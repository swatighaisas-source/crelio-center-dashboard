import { lcCodeGroup, lcCodeLabel, LC_CODE_MAP } from "../data/cliaLcCodes";
import type { CmsCliaRecord } from "../services/cmsCliaApi";

const CERTIFICATE_TYPE: Record<string, string> = {
  "1": "Compliance (High Complexity)",
  "2": "Waiver",
  "3": "Accreditation",
  "4": "PPM (Provider Performed Microscopy)",
  "9": "Registration",
};

const APPLICATION_TYPE: Record<string, string> = {
  "1": "Compliance",
  "2": "Waiver",
  "3": "Accreditation",
  "4": "PPM",
};

const FACILITY_TYPE: Record<string, string> = {
  "01": "Ambulance",
  "02": "Ambulatory Surgery Center",
  "03": "Ancillary Test Site",
  "04": "Assisted Living Facility",
  "05": "Blood Banks",
  "06": "Community Clinic",
  "07": "Comprehensive Outpatient Rehab",
  "08": "End Stage Renal Disease Dialysis",
  "09": "Federally Qualified Health Center",
  "10": "Health Fair",
  "11": "Health Maintenance Organization",
  "12": "Home Health Agency",
  "13": "Hospice",
  "14": "Hospital",
  "15": "Independent",
  "16": "Industrial",
  "17": "Insurance",
  "26": "School / Student Health Service",
};

const TERMINATION_STATUS: Record<string, string> = {
  "00": "Active Provider",
  "12": "No Longer Performing Tests",
};

const ACCREDITATION_FIELDS: { key: string; label: string }[] = [
  { key: "A2LA_ACRDTD_CD", label: "A2LA" },
  { key: "AABB_ACRDTD_CD", label: "AABB" },
  { key: "AOA_ACRDTD_CD", label: "AOA" },
  { key: "ASHI_ACRDTD_CD", label: "ASHI" },
  { key: "CAP_ACRDTD_CD", label: "CAP" },
  { key: "COLA_ACRDTD_CD", label: "COLA" },
  { key: "JCAHO_ACRDTD_CD", label: "Joint Commission" },
];

const EXCLUDED_KEY_PATTERNS =
  /^(ELGBLTY|SKLTN|MLT_SITE|HOSP_LAB|NON_PRFT|LAB_TEMP|SHR_LAB|ACPTBL_POC|CBSA_URBN|_Y_MATCH|APLCTN|CRTFCT_TYPE|CRTFCTN|GNRL_FAC|CLIA_TRMNTN|CLIA_LAB_CLASS|CURRENT_CLIA|PRVDR_CTGRY|STATE_|SSA_|RGN_|MDCD_|CHOW_|CMPLNC_STUS)/i;

const EXCLUDED_VOLUME_KEYS =
  /TEST_VOL|FORM_116|FORM_1557|PPMP_|WVD_/i;

const SPECIALTY_KEY_PATTERNS =
  /(LC|SPCLTY|SPECIALTY|SUBSP|SRVC|TEST|SPEC|ACRDTN_SCHDL|CMPLNC_SCHDL)/i;

export interface SpecialtySignal {
  source: string;
  code?: string;
  label: string;
  group: string;
}

export interface CliaDetectedSignals {
  providerNumber: string;
  facilityName: string;
  address: string;
  certificateType: string;
  certificateTypeCode: string;
  applicationType: string;
  facilityType: string;
  facilityTypeCode: string;
  terminationStatus: string;
  terminationExpirationDate: string;
  specialties: SpecialtySignal[];
  specialtyGroups: string[];
  specialtyDataAvailable: boolean;
  specialtyColumnHints: string[];
  accreditingOrganizations: string[];
  testVolumes: { label: string; value: string }[];
  rawFieldCount: number;
}

function str(record: CmsCliaRecord, ...keys: string[]): string {
  for (const key of keys) {
    const val = record[key];
    if (val !== null && val !== undefined && String(val).trim() !== "") {
      return String(val).trim();
    }
  }
  return "";
}

function num(record: CmsCliaRecord, key: string): number {
  const val = record[key];
  if (val === null || val === undefined || val === "") return 0;
  const n = Number(val);
  return Number.isFinite(n) ? n : 0;
}

function isActiveFlag(value: unknown): boolean {
  if (value === null || value === undefined) return false;
  const s = String(value).trim().toUpperCase();
  if (!s || s === "0" || s === "N" || s === "NO" || s === "NULL") return false;
  return s === "Y" || s === "X" || s === "1" || s === "YES" || /^[0-9]{3}$/.test(s);
}

function looksLikeLcCode(value: string): boolean {
  const code = value.replace(/\D/g, "").slice(0, 3);
  return code.length === 3 && LC_CODE_MAP[code.padStart(3, "0")] !== undefined;
}

function extractLcFromKey(key: string): string | null {
  const match = key.match(/(?:LC|SPECIALTY|SPCLTY|SRVC)[_ ]?(\d{3})/i);
  if (match) return match[1];
  const suffix = key.match(/_(\d{3})$/);
  if (suffix && LC_CODE_MAP[suffix[1]]) return suffix[1];
  return null;
}

export function extractSpecialties(record: CmsCliaRecord): {
  specialties: SpecialtySignal[];
  specialtyDataAvailable: boolean;
  columnHints: string[];
} {
  const specialties: SpecialtySignal[] = [];
  const columnHints: string[] = [];
  const seen = new Set<string>();

  const addSpecialty = (source: string, code: string | undefined, label: string) => {
    const group = code ? lcCodeGroup(code) : inferGroupFromLabel(label);
    const dedupeKey = `${group}::${label}`;
    if (seen.has(dedupeKey)) return;
    seen.add(dedupeKey);
    specialties.push({ source, code, label, group });
  };

  for (const [key, raw] of Object.entries(record)) {
    if (EXCLUDED_KEY_PATTERNS.test(key) || EXCLUDED_VOLUME_KEYS.test(key)) continue;
    if (!SPECIALTY_KEY_PATTERNS.test(key) && !looksLikeLcCode(String(raw ?? ""))) continue;

    const value = raw === null || raw === undefined ? "" : String(raw).trim();
    if (!value) continue;

    columnHints.push(key);

    const lcFromKey = extractLcFromKey(key);
    if (lcFromKey && isActiveFlag(value)) {
      addSpecialty(key, lcFromKey, lcCodeLabel(lcFromKey));
      continue;
    }

    if (looksLikeLcCode(value)) {
      const code = value.replace(/\D/g, "").slice(-3).padStart(3, "0");
      addSpecialty(key, code, lcCodeLabel(code));
      continue;
    }

    if (
      /_SW$|_IND$/i.test(key) &&
      isActiveFlag(value) &&
      !EXCLUDED_KEY_PATTERNS.test(key)
    ) {
      const label = key
        .replace(/_SW$|_IND$|_CD$/i, "")
        .replace(/_/g, " ")
        .toLowerCase()
        .replace(/\b\w/g, (c) => c.toUpperCase());
      addSpecialty(key, undefined, label);
    }
  }

  return {
    specialties,
    specialtyDataAvailable: specialties.length > 0 || columnHints.length > 0,
    columnHints: [...new Set(columnHints)],
  };
}

function inferGroupFromLabel(label: string): string {
  const lower = label.toLowerCase();
  if (lower.includes("toxicology")) return "Chemistry";
  if (lower.includes("pathology") || lower.includes("cytology") || lower.includes("histology"))
    return "Pathology";
  if (lower.includes("molecular") || lower.includes("cytogenetic") || lower.includes("genetic"))
    return "Molecular";
  if (lower.includes("microbiology") || lower.includes("virology") || lower.includes("bacteriology"))
    return "Microbiology";
  if (lower.includes("chemistry") || lower.includes("urinalysis") || lower.includes("endocrinology"))
    return "Chemistry";
  if (lower.includes("hematology")) return "Hematology";
  if (lower.includes("immunology")) return "Diagnostic Immunology";
  return "Other";
}

export function extractSignals(record: CmsCliaRecord): CliaDetectedSignals {
  const certCode = str(record, "CRTFCT_TYPE_CD", "crtfct_type_cd");
  const appCode = str(record, "APLCTN_TYPE_CD", "aplctn_type_cd");
  const facCode = str(record, "GNRL_FAC_TYPE_CD", "gnrl_fac_type_cd");
  const termCode = str(record, "CLIA_TRMNTN_CD", "clia_trmntn_cd");

  const { specialties, specialtyDataAvailable, columnHints } = extractSpecialties(record);
  const specialtyGroups = [...new Set(specialties.map((s) => s.group))];

  const accreditingOrganizations = ACCREDITATION_FIELDS.filter(({ key }) =>
    isActiveFlag(record[key])
  ).map(({ label }) => label);

  const testVolumes: { label: string; value: string }[] = [];
  const volFields: { key: string; label: string }[] = [
    { key: "FORM_116_TEST_VOL_CNT", label: "CMS-116 Annual Test Volume" },
    { key: "FORM_116_ACRDTD_TEST_VOL_CNT", label: "CMS-116 Accredited Annual Test Volume" },
    { key: "WVD_TEST_VOL_CNT", label: "Waived Test Volume" },
    { key: "PPMP_TEST_VOL_CNT", label: "PPM Test Volume" },
    { key: "FORM_1557_TEST_VOL_CNT", label: "Survey Test Volume" },
  ];
  for (const { key, label } of volFields) {
    const v = num(record, key);
    if (v > 0) testVolumes.push({ label, value: v.toLocaleString() });
  }

  const street = str(record, "ST_ADR", "st_adr");
  const city = str(record, "CITY_NAME", "city_name");
  const state = str(record, "STATE_CD", "STATE_CD", "ssa_state_cd");
  const zip = str(record, "ZIP_CD", "zip_cd");
  const address = [street, city, state, zip].filter(Boolean).join(", ");

  return {
    providerNumber: str(record, "PRVDR_NUM", "prvdr_num"),
    facilityName: str(record, "FAC_NAME", "fac_name"),
    address,
    certificateType: CERTIFICATE_TYPE[certCode] ?? (certCode ? `Unknown (${certCode})` : "—"),
    certificateTypeCode: certCode,
    applicationType: APPLICATION_TYPE[appCode] ?? (appCode ? `Unknown (${appCode})` : "—"),
    facilityType: FACILITY_TYPE[facCode] ?? (facCode ? `Code ${facCode}` : "—"),
    facilityTypeCode: facCode,
    terminationStatus:
      TERMINATION_STATUS[termCode] ?? (termCode ? `Code ${termCode}` : "—"),
    terminationExpirationDate: str(record, "TRMNTN_EXPRTN_DT", "trmntn_exprtn_dt"),
    specialties,
    specialtyGroups,
    specialtyDataAvailable,
    specialtyColumnHints: columnHints,
    accreditingOrganizations,
    testVolumes,
    rawFieldCount: Object.keys(record).length,
  };
}

/** Prefer first active provider when multiple rows returned */
export function selectPrimaryRecord(records: CmsCliaRecord[]): CmsCliaRecord {
  const active = records.find(
    (r) => str(r, "CLIA_TRMNTN_CD", "clia_trmntn_cd") === "00"
  );
  return active ?? records[0];
}

export function getDetectedLabels(signals: CliaDetectedSignals): string[] {
  return signals.specialties.map((s) => s.label);
}
