/** CMS Provider of Services — Clinical Laboratories (CLIA) dataset */
export const CLIA_POS_DATASET_ID = "d3eb38ac-d8e9-40d3-b7b7-6205d3d1dc16";

const CMS_ORIGIN = "https://data.cms.gov";
const API_PREFIX = `/data-api/v1/dataset/${CLIA_POS_DATASET_ID}`;

export interface CmsDatasetColumn {
  name: string;
  dataType?: string;
  description?: string;
}

export interface CmsDatasetMetadata {
  columns: CmsDatasetColumn[];
  raw: unknown;
}

export interface CmsDatasetStats {
  totalRows?: number;
  raw: unknown;
}

export interface CmsCliaRecord {
  [key: string]: string | number | null | undefined;
}

export interface FetchLabByCliaResult {
  records: CmsCliaRecord[];
  rawUrl: string;
  error?: string;
  httpStatus?: number;
  usedDemoData?: boolean;
  fetchSource?: "direct" | "proxy";
}

export function normalizeCliaNumber(input: string): string {
  return input.trim().toUpperCase().replace(/[\s-]/g, "");
}

function directUrl(suffix: string, search = ""): string {
  return `${CMS_ORIGIN}${API_PREFIX}${suffix}${search}`;
}

function proxyUrl(suffix: string, search = ""): string {
  return `/api/cms${API_PREFIX}${suffix}${search}`;
}

export function buildLabByCliaUrl(clia: string, size = 10, useProxy = false): string {
  const normalized = normalizeCliaNumber(clia);
  const params = new URLSearchParams({
    size: String(size),
    offset: "0",
  });
  params.set("filter[filter-0-0][condition][path]", "PRVDR_NUM");
  params.set("filter[filter-0-0][condition][operator]", "=");
  params.set("filter[filter-0-0][condition][value]", normalized);
  const search = `?${params.toString()}`;
  return useProxy ? proxyUrl("/data", search) : directUrl("/data", search);
}

const CMS_FETCH_HEADERS: HeadersInit = {
  Accept: "application/json, text/plain, */*",
  "Accept-Language": "en-US,en;q=0.9",
};

async function cmsFetch(pathSuffix: string, search = ""): Promise<{
  res: Response;
  source: "direct" | "proxy";
}> {
  const direct = directUrl(pathSuffix, search);
  let res = await fetch(direct, { headers: CMS_FETCH_HEADERS, mode: "cors" });

  if (res.ok) {
    return { res, source: "direct" };
  }

  const shouldRetryViaProxy =
    import.meta.env.DEV &&
    (res.status === 403 || res.status === 0 || res.type === "opaque");

  if (shouldRetryViaProxy) {
    const proxied = proxyUrl(pathSuffix, search);
    const proxyRes = await fetch(proxied, { headers: CMS_FETCH_HEADERS });
    if (proxyRes.ok) {
      return { res: proxyRes, source: "proxy" };
    }
    return { res: proxyRes, source: "proxy" };
  }

  return { res, source: "direct" };
}

function parseJsonBody<T>(text: string): T | { error: string } {
  try {
    return JSON.parse(text) as T;
  } catch {
    return { error: "Invalid JSON response from CMS API" };
  }
}

/** CMS data API may return a bare array or a wrapper with a data property */
function extractRecords(body: unknown): CmsCliaRecord[] {
  if (Array.isArray(body)) {
    return body as CmsCliaRecord[];
  }
  if (body && typeof body === "object") {
    const obj = body as Record<string, unknown>;
    if (Array.isArray(obj.data)) return obj.data as CmsCliaRecord[];
    if (Array.isArray(obj.results)) return obj.results as CmsCliaRecord[];
  }
  return [];
}

function extractColumns(metadata: unknown): CmsDatasetColumn[] {
  if (!metadata || typeof metadata !== "object") return [];
  const obj = metadata as Record<string, unknown>;

  const candidates = [
    obj.columns,
    obj.fields,
    (obj.data as Record<string, unknown> | undefined)?.columns,
  ];

  for (const c of candidates) {
    if (!Array.isArray(c)) continue;
    return c
      .map((col) => {
        if (typeof col === "string") return { name: col };
        const item = col as Record<string, unknown>;
        return {
          name: String(item.name ?? item.field ?? item.column ?? ""),
          dataType: item.dataType ? String(item.dataType) : undefined,
          description: item.description ? String(item.description) : undefined,
        };
      })
      .filter((col) => col.name);
  }

  return [];
}

function accessDeniedMessage(status: number, source: "direct" | "proxy"): string {
  if (status === 403) {
    return source === "proxy"
      ? `CMS blocked the dev proxy (${status}). The app will try your browser directly on the next fetch—restart dev server if needed. You can also use "Load demo data" below.`
      : `CMS API returned ${status} (Access Denied). This is often Akamai bot protection—not a bad CLIA number. Try "Load demo data" to explore the UI, or open the request URL in a new tab.`;
  }
  return `CMS API error (${status}).`;
}

export async function fetchDatasetMetadata(): Promise<CmsDatasetMetadata> {
  const { res } = await cmsFetch("/metadata");
  const text = await res.text();
  const body = parseJsonBody<unknown>(text);
  if (!res.ok) {
    throw new Error(
      typeof body === "object" && body && "error" in body
        ? String((body as { error: string }).error)
        : `Metadata request failed (${res.status})`
    );
  }
  return { columns: extractColumns(body), raw: body };
}

export async function fetchDatasetStats(): Promise<CmsDatasetStats> {
  const { res } = await cmsFetch("/data/stats");
  const text = await res.text();
  const parsed = parseJsonBody<unknown>(text);
  if (!res.ok) {
    throw new Error(`Stats request failed (${res.status})`);
  }
  const body =
    parsed && typeof parsed === "object" && !("error" in parsed)
      ? (parsed as Record<string, unknown>)
      : {};
  const totalRows =
    typeof body.total === "number"
      ? body.total
      : typeof body.count === "number"
        ? body.count
        : typeof body.rowCount === "number"
          ? body.rowCount
          : undefined;
  return { totalRows, raw: parsed };
}

export async function fetchLabByClia(clia: string): Promise<FetchLabByCliaResult> {
  const normalized = normalizeCliaNumber(clia);
  if (!normalized) {
    return { records: [], rawUrl: "", error: "Enter a CLIA certificate number." };
  }

  const search = buildLabByCliaUrl(normalized).split("?")[1] ?? "";
  const rawUrl = buildLabByCliaUrl(normalized);
  const { res, source } = await cmsFetch("/data", `?${search}`);
  const text = await res.text();

  if (!res.ok) {
    const isHtml = text.trimStart().startsWith("<");
    return {
      records: [],
      rawUrl,
      httpStatus: res.status,
      fetchSource: source,
      error: isHtml
        ? accessDeniedMessage(res.status, source)
        : `CMS API error (${res.status}): ${text.slice(0, 200)}`,
    };
  }

  const body = parseJsonBody<unknown>(text);
  if (body && typeof body === "object" && "error" in body) {
    return {
      records: [],
      rawUrl,
      error: String((body as { error: string }).error),
      fetchSource: source,
    };
  }

  const records = extractRecords(body);
  if (records.length === 0) {
    return {
      records: [],
      rawUrl,
      fetchSource: source,
      error: `No laboratory found for CLIA / PRVDR_NUM "${normalized}".`,
    };
  }

  return { records, rawUrl, fetchSource: source };
}

export async function fetchLabByCliaDemo(clia: string): Promise<FetchLabByCliaResult> {
  const { CLIA_DEMO_RECORD } = await import("../data/cliaDemoRecord");
  const normalized = normalizeCliaNumber(clia) || CLIA_DEMO_RECORD.PRVDR_NUM;
  const record = { ...CLIA_DEMO_RECORD, PRVDR_NUM: normalized };
  return {
    records: [record],
    rawUrl: "(demo data — CMS API not used)",
    usedDemoData: true,
    fetchSource: "direct",
  };
}
