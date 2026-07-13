import type {
  AccountConfigurationType,
  ReportTemplateType,
  USForm,
  USLabArchetype,
  USVolume,
} from "../context/CreateCentreContext";
import {
  CLIA_DEMO_RECORD,
  DEMO_LAB_DISPLAY_NAME,
  DEMO_NPI_ADDRESS,
} from "../data/cliaDemoRecord";
import { TAXONOMY_MAP, archetypeFromTaxonomyCode } from "../data/usTaxonomy";
import {
  ARCHETYPE_DEFAULT_MODALITIES,
  normalizeSelectedModalities,
} from "../data/usDevices";
import type { CliaLabProfile } from "./cliaClassification";
import { classifyLab } from "./cliaClassification";
import { extractSignals, type CliaDetectedSignals } from "./cliaSignals";
import type { CmsCliaRecord } from "../services/cmsCliaApi";
import { normalizeCliaNumber } from "../services/cmsCliaApi";

export type PrefillSource = "NPI" | "CLIA";

/** Default identifiers for US onboarding demo */
export const DEMO_NPI = "1427588029";
export const DEMO_CLIA = "21D2130306";

export type PrefillFieldKey =
  | "usForm.npi"
  | "usForm.cliaNumber"
  | "usForm.labName"
  | "usForm.labAddress"
  | "usForm.labCity"
  | "usForm.labState"
  | "usForm.labZip"
  | "usForm.taxonomyCode"
  | "usForm.labArchetype"
  | "usForm.selectedModalities"
  | "usForm.volume"
  | "usForm.locations"
  | "business.registeredBusinessName"
  | "business.services"
  | "form.name"
  | "form.address"
  | "form.city"
  | "form.state"
  | "form.pincode"
  | "configurationType"
  | "reportTemplate";

export interface NpiFetchPreview {
  labName: string;
  taxonomyCode: string;
  taxonomyDescription: string;
  suggestedLabType: string;
  suggestedArchetype: USLabArchetype;
  npiType?: string;
  practiceAddress?: string;
}

export interface CliaFetchPreview {
  providerNumber: string;
  facilityName: string;
  address: string;
  certificateType: string;
  facilityType: string;
  specialties: string[];
  suggestedProfile: string;
  profileConfidence: string;
  suggestedArchetype: USLabArchetype;
  terminationStatus: string;
}

const PROFILE_TO_ARCHETYPE: Partial<Record<CliaLabProfile, USLabArchetype>> = {
  "Physician Office Lab (POL)": "physician-office",
  "Clinical Lab": "independent",
  "Reference Lab": "reference",
  "Molecular Lab": "specialty",
  "Toxicology Lab": "specialty",
  "Pathology Lab": "specialty",
  "Multimodal Lab": "independent",
};

function str(record: CmsCliaRecord, key: string): string {
  const v = record[key];
  return v !== null && v !== undefined ? String(v).trim() : "";
}

export function profileToArchetype(profile: CliaLabProfile): USLabArchetype | null {
  return PROFILE_TO_ARCHETYPE[profile] ?? null;
}

function modalitiesFromSignals(signals: CliaDetectedSignals): string[] {
  const mods = new Set<string>();
  for (const s of signals.specialties) {
    const code = s.code?.padStart(3, "0");
    if (code === "400") mods.add("Hematology");
    if (code === "310" || code === "330") mods.add("Blood Chemistry");
    if (code === "210" || code === "220") mods.add("Blood Chemistry");
    if (code === "900") mods.add("Molecular");
    if (code && ["610", "620", "630"].includes(code)) mods.add("Blood Chemistry");
    if (code && ["710", "720", "730"].includes(code)) mods.add("Toxicology");
    const g = s.group.toLowerCase();
    if (g.includes("hematology")) mods.add("Hematology");
    if (g.includes("chemistry") || g.includes("immunology") || g.includes("serology")) {
      mods.add("Blood Chemistry");
    }
    if (g.includes("molecular")) mods.add("Molecular");
    if (g.includes("toxicology")) mods.add("Toxicology");
  }
  return normalizeSelectedModalities([...mods]);
}

function servicesFromModalities(modalityIds: string[]): string[] {
  const services = new Set<string>();
  const canonical = normalizeSelectedModalities(modalityIds);
  if (canonical.includes("Blood Chemistry")) {
    services.add("lab-testing");
    services.add("immunoassays");
  }
  if (canonical.includes("Toxicology")) services.add("lab-testing");
  if (canonical.includes("Molecular")) services.add("clinical-pathology");
  return [...services];
}

function volumeFromAnnualTests(count: number): USVolume {
  if (count <= 2000) return "lt50";
  if (count <= 10000) return "50-200";
  if (count <= 25000) return "200-500";
  return "500plus";
}

function annualTestVolume(record: CmsCliaRecord): number {
  const accred = Number(record.FORM_116_ACRDTD_TEST_VOL_CNT ?? 0);
  const compliance = Number(record.FORM_116_TEST_VOL_CNT ?? 0);
  return accred > 0 ? accred : compliance;
}

/** When CMS row has no LC specialty columns (common in API extracts). */
function inferArchetypeFromCliaRecord(
  record: CmsCliaRecord,
  signals: CliaDetectedSignals
): USLabArchetype {
  const cert = signals.certificateTypeCode;
  const fac = signals.facilityTypeCode;
  const vol = annualTestVolume(record);
  if (cert === "2" || cert === "4") return "physician-office";
  if (fac === "14") return "reference";
  if (fac === "15" && vol >= 100000) return "reference";
  if (cert === "3") return "independent";
  return "independent";
}

function formatFacilityDisplayName(raw: string): string {
  if (raw.toUpperCase().includes("DIAMOND MEDICAL")) return DEMO_LAB_DISPLAY_NAME;
  return raw
    .toLowerCase()
    .replace(/\b\w/g, (c) => c.toUpperCase())
    .replace(/\bLlc\b/g, "LLC");
}

function configurationFromClia(record: CmsCliaRecord, signals: CliaDetectedSignals): AccountConfigurationType {
  const cert = str(record, "CRTFCT_TYPE_CD");
  if (cert === "2" || cert === "4") return "basic-lab";
  if (signals.accreditingOrganizations.length > 0) return "advanced-lab";
  return "basic-lab";
}

function reportTemplateFromClia(signals: CliaDetectedSignals): ReportTemplateType {
  if (signals.accreditingOrganizations.some((o) => /CAP|COLA/i.test(o))) {
    return "nabl-cap";
  }
  return "standard";
}

export function buildNpiDemoPreview(npi: string): {
  preview: NpiFetchPreview;
  usPatch: Partial<USForm>;
  sources: Partial<Record<PrefillFieldKey, PrefillSource>>;
} {
  const trimmed = npi.trim();
  const matched =
    trimmed === DEMO_NPI
      ? TAXONOMY_MAP.find((r) => r.code === "291U00000X")!
      : (TAXONOMY_MAP.find((r) => r.code.startsWith(trimmed.substring(0, 3))) ??
        TAXONOMY_MAP.find((r) => r.code === "291U00000X")!);
  const taxonomy = matched.code;
  const archetype = archetypeFromTaxonomyCode(taxonomy);
  const labName = trimmed === DEMO_NPI ? DEMO_LAB_DISPLAY_NAME : `Lab NPI-${trimmed}`;

  const preview: NpiFetchPreview =
    trimmed === DEMO_NPI
      ? {
          labName,
          taxonomyCode: taxonomy,
          taxonomyDescription: matched.description,
          suggestedLabType: matched.suggestedLabType,
          suggestedArchetype: archetype,
          npiType: "Type 2 (Organization)",
          practiceAddress: `${DEMO_NPI_ADDRESS.street}, ${DEMO_NPI_ADDRESS.city}, ${DEMO_NPI_ADDRESS.state} ${DEMO_NPI_ADDRESS.zip}`,
        }
      : {
          labName,
          taxonomyCode: taxonomy,
          taxonomyDescription: matched.description,
          suggestedLabType: matched.suggestedLabType,
          suggestedArchetype: archetype,
        };

  const sources: Partial<Record<PrefillFieldKey, PrefillSource>> = {
    "usForm.npi": "NPI",
    "usForm.labName": "NPI",
    "usForm.taxonomyCode": "NPI",
    "usForm.labArchetype": "NPI",
  };

  return {
    preview,
    usPatch: {
      npi: trimmed,
      labName,
      taxonomyCode: taxonomy,
      labArchetype: archetype,
    },
    sources,
  };
}

export function buildNpiRawFields(npi: string, preview: NpiFetchPreview): Record<string, string> {
  const fields: Record<string, string> = {
    "NPI Number": npi.trim(),
    "Provider Name": preview.labName,
    "Taxonomy Code": preview.taxonomyCode,
    "Taxonomy Description": preview.taxonomyDescription,
    "Suggested Lab Type (taxonomy)": preview.suggestedLabType,
    "Suggested Archetype": LAB_ARCHETYPE_LABELS[preview.suggestedArchetype],
  };
  if (preview.npiType) fields["NPI Entity Type"] = preview.npiType;
  if (preview.practiceAddress) fields["Practice Address"] = preview.practiceAddress;
  return fields;
}

export function buildCliaDemoPrefill(cliaInput: string): {
  preview: CliaFetchPreview;
  rawRecord: CmsCliaRecord;
  usPatch: Partial<USForm>;
  businessPatch: { registeredBusinessName?: string; services?: string[] };
  formPatch: Partial<{ name: string; address: string; city: string; state: string; pincode: string }>;
  configurationType: AccountConfigurationType;
  reportTemplate: ReportTemplateType;
  sources: Partial<Record<PrefillFieldKey, PrefillSource>>;
} {
  const normalized =
    normalizeCliaNumber(cliaInput) || String(CLIA_DEMO_RECORD.PRVDR_NUM ?? "");
  const record: CmsCliaRecord = { ...CLIA_DEMO_RECORD, PRVDR_NUM: normalized };
  const signals = extractSignals(record);
  const classification = classifyLab(signals);
  const inferredArchetype = inferArchetypeFromCliaRecord(record, signals);
  const archetype =
    profileToArchetype(classification.profile) ?? inferredArchetype;
  let modalities = modalitiesFromSignals(signals);
  if (modalities.length === 0) {
    modalities = ARCHETYPE_DEFAULT_MODALITIES[archetype] ?? [];
  }
  const annualVol = annualTestVolume(record);
  const volume = volumeFromAnnualTests(annualVol);
  const services = servicesFromModalities(modalities);
  const labName = formatFacilityDisplayName(signals.facilityName || DEMO_LAB_DISPLAY_NAME);

  const noLcSpecialties = signals.specialties.length === 0;
  const suggestedProfile =
    classification.profile === "Unable to classify from CLIA data" && noLcSpecialties
      ? `Reference Lab (inferred from accreditation + volume)`
      : classification.profile;
  const profileConfidence =
    noLcSpecialties && classification.profile === "Unable to classify from CLIA data"
      ? "Medium"
      : classification.confidence;

  const preview: CliaFetchPreview = {
    providerNumber: signals.providerNumber,
    facilityName: labName,
    address: signals.address,
    certificateType: signals.certificateType,
    facilityType: signals.facilityType,
    specialties: signals.specialties.length
      ? signals.specialties.map((s) => s.label)
      : [
          "LC specialty columns not in this CMS extract",
          `Accredited annual volume: ${annualVol.toLocaleString()}`,
          signals.accreditingOrganizations.length
            ? `Accreditation: ${signals.accreditingOrganizations.join(", ")}`
            : "",
        ].filter(Boolean),
    suggestedProfile,
    profileConfidence,
    suggestedArchetype: archetype,
    terminationStatus: signals.terminationStatus,
  };

  const sources: Partial<Record<PrefillFieldKey, PrefillSource>> = {
    "usForm.cliaNumber": "CLIA",
    "usForm.labName": "CLIA",
    "usForm.labAddress": "CLIA",
    "usForm.labCity": "CLIA",
    "usForm.labState": "CLIA",
    "usForm.labZip": "CLIA",
    "usForm.labArchetype": "CLIA",
    "usForm.selectedModalities": "CLIA",
    "usForm.volume": "CLIA",
    "business.registeredBusinessName": "CLIA",
    "business.services": "CLIA",
    "form.name": "CLIA",
    "form.address": "CLIA",
    "form.city": "CLIA",
    "form.state": "CLIA",
    "form.pincode": "CLIA",
    configurationType: "CLIA",
    reportTemplate: "CLIA",
  };

  return {
    preview,
    rawRecord: record,
    usPatch: {
      cliaNumber: normalized,
      labName,
      labAddress: str(record, "ST_ADR"),
      labCity: str(record, "CITY_NAME"),
      labState: str(record, "STATE_CD"),
      labZip: str(record, "ZIP_CD"),
      labArchetype: archetype,
      selectedModalities: normalizeSelectedModalities(modalities),
      volume,
      manualEntry: false,
    },
    businessPatch: {
      registeredBusinessName: labName,
      services,
    },
    formPatch: {
      name: labName,
      address: str(record, "ST_ADR"),
      city: str(record, "CITY_NAME"),
      state: str(record, "STATE_CD"),
      pincode: str(record, "ZIP_CD"),
    },
    configurationType: configurationFromClia(record, signals),
    reportTemplate: reportTemplateFromClia(signals),
    sources,
  };
}

export function mergePrefillSources(
  ...maps: Array<Partial<Record<PrefillFieldKey, PrefillSource>>>
): Partial<Record<PrefillFieldKey, PrefillSource>> {
  const out: Partial<Record<PrefillFieldKey, PrefillSource>> = {};
  for (const map of maps) {
    Object.assign(out, map);
  }
  return out;
}

/** CLIA overwrites address/name; NPI keeps taxonomy when both run */
export function mergeDemoFetchResults(
  npi: string,
  clia: string
): {
  npiPreview: NpiFetchPreview | null;
  npiRawFields: Record<string, string> | null;
  cliaPreview: CliaFetchPreview;
  cliaRawRecord: CmsCliaRecord;
  usPatch: Partial<USForm>;
  sources: Partial<Record<PrefillFieldKey, PrefillSource>>;
} {
  const cliaResult = buildCliaDemoPrefill(clia || "12D3456789");
  let npiResult: ReturnType<typeof buildNpiDemoPreview> | null = null;
  let sources = { ...cliaResult.sources };

  const usPatch: Partial<USForm> = {
    ...cliaResult.usPatch,
  };

  if (npi.trim()) {
    npiResult = buildNpiDemoPreview(npi);
    sources = mergePrefillSources(npiResult.sources, cliaResult.sources);
    usPatch.npi = npiResult.usPatch.npi;
    usPatch.taxonomyCode = npiResult.usPatch.taxonomyCode;
    if (sources["usForm.labArchetype"] !== "CLIA") {
      usPatch.labArchetype = npiResult.usPatch.labArchetype;
    }
    if (sources["usForm.labName"] !== "CLIA") {
      usPatch.labName = npiResult.usPatch.labName;
    }
  }

  usPatch.labName = formatFacilityDisplayName(
    String(usPatch.labName ?? cliaResult.usPatch.labName ?? DEMO_LAB_DISPLAY_NAME)
  );

  return {
    npiPreview: npiResult?.preview ?? null,
    npiRawFields: npiResult ? buildNpiRawFields(npi, npiResult.preview) : null,
    cliaPreview: cliaResult.preview,
    cliaRawRecord: cliaResult.rawRecord,
    usPatch,
    sources,
  };
}

export const LAB_ARCHETYPE_LABELS: Record<USLabArchetype, string> = {
  "physician-office": "Physician Office Lab (POL)",
  independent: "Independent / Multi-site Diagnostic Lab",
  reference: "Reference / Hospital-based Lab",
  specialty: "Specialty Lab",
  d2c: "D2C / Home Collection Lab",
};
