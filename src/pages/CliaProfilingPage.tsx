import { useCallback, useState } from "react";
import { Link } from "react-router-dom";
import { classifyLab } from "../lib/cliaClassification";
import { extractSignals, selectPrimaryRecord } from "../lib/cliaSignals";
import {
  buildLabByCliaUrl,
  CLIA_POS_DATASET_ID,
  fetchDatasetMetadata,
  fetchDatasetStats,
  fetchLabByClia,
  fetchLabByCliaDemo,
  type CmsCliaRecord,
  type CmsDatasetColumn,
} from "../services/cmsCliaApi";
import "../styles/clia-profiling.css";

export function CliaProfilingPage() {
  const [cliaInput, setCliaInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [rawUrl, setRawUrl] = useState<string | null>(null);
  const [records, setRecords] = useState<CmsCliaRecord[] | null>(null);
  const [metadataColumns, setMetadataColumns] = useState<CmsDatasetColumn[]>([]);
  const [datasetStats, setDatasetStats] = useState<string | null>(null);
  const [fetchCount, setFetchCount] = useState(0);
  const [usedDemoData, setUsedDemoData] = useState(false);
  const [fetchSource, setFetchSource] = useState<string | null>(null);

  const loadMetadata = useCallback(async () => {
    try {
      const [meta, stats] = await Promise.all([
        fetchDatasetMetadata(),
        fetchDatasetStats().catch(() => null),
      ]);
      setMetadataColumns(meta.columns);
      if (stats?.totalRows !== undefined) {
        setDatasetStats(`Dataset row count: ${stats.totalRows.toLocaleString()}`);
      }
    } catch {
      setMetadataColumns([]);
    }
  }, []);

  async function handleFetch() {
    if (!cliaInput.trim()) return;
    setLoading(true);
    setError(null);
    setRecords(null);
    setRawUrl(null);
    setUsedDemoData(false);
    setFetchSource(null);

    await loadMetadata();

    const result = await fetchLabByClia(cliaInput);
    setFetchCount((c) => c + 1);
    setRawUrl(result.rawUrl);
    setFetchSource(result.fetchSource ?? null);
    setLoading(false);

    if (result.error) {
      setError(result.error);
      return;
    }

    setRecords(result.records);
  }

  async function handleLoadDemo() {
    setLoading(true);
    setError(null);
    setUsedDemoData(false);
    const result = await fetchLabByCliaDemo(cliaInput || "12D3456789");
    setLoading(false);
    setRecords(result.records);
    setRawUrl(result.rawUrl);
    setUsedDemoData(true);
    setFetchSource("demo");
    setFetchCount((c) => c + 1);
  }

  const primary = records ? selectPrimaryRecord(records) : null;
  const signals = primary ? extractSignals(primary) : null;
  const classification = signals ? classifyLab(signals) : null;
  const recordKeys = primary ? Object.keys(primary).sort() : [];

  return (
    <div className="clia-page">
      <header className="clia-page__header">
        <div>
          <h1 className="clia-page__title">CLIA Lab Profiling POC</h1>
          <p className="clia-page__subtitle">
            CMS Provider of Services — Clinical Laboratories (dataset {CLIA_POS_DATASET_ID.slice(0, 8)}…)
          </p>
        </div>
        <Link to="/" className="btn-outline">
          Back to Dashboard
        </Link>
      </header>

      <main className="clia-page__body">
        {/* Screen 1 — Lookup */}
        <section className="clia-section" aria-labelledby="clia-lookup-heading">
          <h2 id="clia-lookup-heading" className="clia-section__heading">
            CLIA Lookup
          </h2>
          <p className="clia-section__desc">
            Enter a CLIA certificate number (CMS PRVDR_NUM). Data is fetched from data.cms.gov.
          </p>
          <div className="clia-fetch-row">
            <input
              type="text"
              placeholder="e.g. 12D3456789"
              value={cliaInput}
              onChange={(e) => setCliaInput(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleFetch()}
              aria-label="CLIA number"
            />
            <button type="button" onClick={handleFetch} disabled={loading || !cliaInput.trim()}>
              {loading ? "Fetching…" : "Fetch Data"}
            </button>
            <button
              type="button"
              className="btn-outline"
              onClick={handleLoadDemo}
              disabled={loading}
              style={{ padding: "10px 16px", borderRadius: 6, cursor: "pointer" }}
            >
              Load demo data
            </button>
          </div>
          {error && (
            <div className="clia-error" role="alert">
              {error}
              <p style={{ margin: "10px 0 0", fontSize: "0.8125rem" }}>
                CMS often blocks automated/proxy traffic (Akamai 403). Use{" "}
                <strong>Load demo data</strong> to test classification, or open the request URL in a
                new browser tab.
              </p>
            </div>
          )}
          {usedDemoData && (
            <div
              className="clia-demo-banner"
              role="status"
              style={{
                marginTop: 12,
                padding: "10px 12px",
                background: "#eff6ff",
                border: "1px solid #bfdbfe",
                borderRadius: 6,
                fontSize: "0.875rem",
              }}
            >
              Showing bundled demo record — not live CMS data.
            </div>
          )}
          {rawUrl && (
            <p className="clia-meta">
              Request URL:{" "}
              <a href={rawUrl} target="_blank" rel="noopener noreferrer">
                {rawUrl.startsWith("/") ? `${window.location.origin}${rawUrl}` : rawUrl}
              </a>
            </p>
          )}
          {datasetStats && <p className="clia-meta">{datasetStats}</p>}
          {fetchSource && !usedDemoData && (
            <p className="clia-meta">Fetched via: {fetchSource === "direct" ? "browser → CMS" : "dev proxy"}</p>
          )}
        </section>

        {records && primary && (
          <>
            {/* Screen 2 — Raw response */}
            <section className="clia-section" aria-labelledby="clia-raw-heading">
              <h2 id="clia-raw-heading" className="clia-section__heading">
                Raw Dataset Response
              </h2>
              <p className="clia-section__desc">
                {records.length} record(s) returned · {recordKeys.length} fields in primary record
              </p>
              <pre className="clia-pre">{JSON.stringify(records, null, 2)}</pre>
              {metadataColumns.length > 0 && (
                <>
                  <h3 style={{ marginTop: 16, fontSize: "0.875rem" }}>Metadata columns</h3>
                  <table className="clia-columns-table">
                    <thead>
                      <tr>
                        <th>Column</th>
                        <th>Type</th>
                      </tr>
                    </thead>
                    <tbody>
                      {metadataColumns.map((col) => (
                        <tr key={col.name}>
                          <td>{col.name}</td>
                          <td>{col.dataType ?? "—"}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </>
              )}
              {metadataColumns.length === 0 && recordKeys.length > 0 && (
                <>
                  <h3 style={{ marginTop: 16, fontSize: "0.875rem" }}>Field names (from record)</h3>
                  <table className="clia-columns-table">
                    <thead>
                      <tr>
                        <th>Field</th>
                        <th>Value (sample)</th>
                      </tr>
                    </thead>
                    <tbody>
                      {recordKeys.map((key) => (
                        <tr key={key}>
                          <td>{key}</td>
                          <td>{String(primary[key] ?? "—")}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </>
              )}
            </section>

            {/* Screen 3 — Detected signals */}
            {signals && (
              <section className="clia-section" aria-labelledby="clia-signals-heading">
                <h2 id="clia-signals-heading" className="clia-section__heading">
                  Detected Signals
                </h2>
                <div className="clia-signal-grid">
                  <div className="clia-signal-row">
                    <span className="clia-signal-row__key">Provider / CLIA #</span>
                    <span className="clia-signal-row__val">{signals.providerNumber || "—"}</span>
                  </div>
                  <div className="clia-signal-row">
                    <span className="clia-signal-row__key">Facility name</span>
                    <span className="clia-signal-row__val">{signals.facilityName || "—"}</span>
                  </div>
                  <div className="clia-signal-row">
                    <span className="clia-signal-row__key">Address</span>
                    <span className="clia-signal-row__val">{signals.address || "—"}</span>
                  </div>
                  <div className="clia-signal-row">
                    <span className="clia-signal-row__key">Certificate type</span>
                    <span className="clia-signal-row__val">{signals.certificateType}</span>
                  </div>
                  <div className="clia-signal-row">
                    <span className="clia-signal-row__key">Application type</span>
                    <span className="clia-signal-row__val">{signals.applicationType}</span>
                  </div>
                  <div className="clia-signal-row">
                    <span className="clia-signal-row__key">Facility type</span>
                    <span className="clia-signal-row__val">{signals.facilityType}</span>
                  </div>
                  <div className="clia-signal-row">
                    <span className="clia-signal-row__key">Status</span>
                    <span className="clia-signal-row__val">{signals.terminationStatus}</span>
                  </div>
                  {signals.terminationExpirationDate && (
                    <div className="clia-signal-row">
                      <span className="clia-signal-row__key">Termination / expiration</span>
                      <span className="clia-signal-row__val">
                        {signals.terminationExpirationDate}
                      </span>
                    </div>
                  )}
                </div>

                <h3 style={{ marginTop: 20, fontSize: "0.875rem", fontWeight: 600 }}>
                  Testing specialties / service types
                </h3>
                {!signals.specialtyDataAvailable && (
                  <p className="clia-meta" style={{ marginTop: 8 }}>
                    No specialty columns matched heuristics. Inspect raw JSON for LC / specialty
                    fields.
                  </p>
                )}
                {signals.specialties.length > 0 ? (
                  <ul className="clia-tag-list" style={{ marginTop: 8 }}>
                    {signals.specialties.map((s) => (
                      <li key={`${s.source}-${s.label}`} className="clia-tag" title={s.source}>
                        {s.label}
                      </li>
                    ))}
                  </ul>
                ) : null}
                {signals.specialtyColumnHints.length > 0 && (
                  <p className="clia-meta" style={{ marginTop: 8 }}>
                    Matched columns: {signals.specialtyColumnHints.join(", ")}
                  </p>
                )}

                {signals.accreditingOrganizations.length > 0 && (
                  <>
                    <h3 style={{ marginTop: 16, fontSize: "0.875rem", fontWeight: 600 }}>
                      Accrediting organizations
                    </h3>
                    <ul className="clia-tag-list" style={{ marginTop: 8 }}>
                      {signals.accreditingOrganizations.map((org) => (
                        <li key={org} className="clia-tag">
                          {org}
                        </li>
                      ))}
                    </ul>
                  </>
                )}

                {signals.testVolumes.length > 0 && (
                  <>
                    <h3 style={{ marginTop: 16, fontSize: "0.875rem", fontWeight: 600 }}>
                      Test volumes
                    </h3>
                    <div className="clia-signal-grid" style={{ marginTop: 8 }}>
                      {signals.testVolumes.map((v) => (
                        <div key={v.label} className="clia-signal-row">
                          <span className="clia-signal-row__key">{v.label}</span>
                          <span className="clia-signal-row__val">{v.value}</span>
                        </div>
                      ))}
                    </div>
                  </>
                )}
              </section>
            )}

            {/* Screen 4 — Suggested profile */}
            {classification && signals && (
              <section className="clia-section" aria-labelledby="clia-profile-heading">
                <h2 id="clia-profile-heading" className="clia-section__heading">
                  Suggested Lab Profile
                </h2>
                <div
                  className={`clia-profile-card${
                    classification.profile === "Unable to classify from CLIA data"
                      ? " clia-profile-card--unknown"
                      : ""
                  }`}
                >
                  <p className="clia-profile-name">{classification.profile}</p>
                  <span
                    className={`clia-confidence clia-confidence--${classification.confidence.toLowerCase()}`}
                  >
                    Confidence: {classification.confidence}
                  </span>
                  {classification.detectedLabels.length > 0 && (
                    <p className="clia-meta" style={{ marginTop: 12 }}>
                      Detected: {classification.detectedLabels.join(" · ")}
                    </p>
                  )}
                  <p className="clia-meta" style={{ marginTop: 8 }}>
                    Certificate: {signals.certificateType}
                    {signals.specialtyGroups.length > 0 &&
                      ` · Groups: ${signals.specialtyGroups.join(", ")}`}
                  </p>
                  <ul className="clia-reasoning">
                    {classification.reasoning.map((line) => (
                      <li key={line}>{line}</li>
                    ))}
                  </ul>
                </div>
              </section>
            )}
          </>
        )}

        <footer className="clia-footer">
          Exploratory POC — not wired to US onboarding. Fetches: {fetchCount}. Sample filter URL
          pattern: {buildLabByCliaUrl("00X0000000", 1).replace("00X0000000", "{CLIA}")}
        </footer>
      </main>
    </div>
  );
}
