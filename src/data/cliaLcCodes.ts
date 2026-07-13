/** CMS CLIA Laboratory Certification (LC) codes — specialty / subspecialty labels */
export interface LcCodeEntry {
  code: string;
  label: string;
  group: string;
}

export const LC_CODE_MAP: Record<string, LcCodeEntry> = {
  "010": { code: "010", label: "Histocompatibility", group: "Histocompatibility" },
  "110": { code: "110", label: "Microbiology - Bacteriology", group: "Microbiology" },
  "115": { code: "115", label: "Microbiology - Mycobacteriology", group: "Microbiology" },
  "120": { code: "120", label: "Microbiology - Mycology", group: "Microbiology" },
  "130": { code: "130", label: "Microbiology - Parasitology", group: "Microbiology" },
  "140": { code: "140", label: "Microbiology - Virology", group: "Microbiology" },
  "210": {
    code: "210",
    label: "Diagnostic Immunology - Syphilis Serology",
    group: "Diagnostic Immunology",
  },
  "220": {
    code: "220",
    label: "Diagnostic Immunology - General Immunology",
    group: "Diagnostic Immunology",
  },
  "310": { code: "310", label: "Chemistry - Routine Chemistry", group: "Chemistry" },
  "320": { code: "320", label: "Chemistry - Urinalysis", group: "Chemistry" },
  "330": { code: "330", label: "Chemistry - Endocrinology", group: "Chemistry" },
  "340": { code: "340", label: "Chemistry - Toxicology", group: "Chemistry" },
  "400": { code: "400", label: "Hematology", group: "Hematology" },
  "510": {
    code: "510",
    label: "Immunohematology - ABO Group & Rh type",
    group: "Immunohematology",
  },
  "520": {
    code: "520",
    label: "Immunohematology - Antibody Detection (transfusion)",
    group: "Immunohematology",
  },
  "530": {
    code: "530",
    label: "Immunohematology - Antibody Detection (non-transfusion)",
    group: "Immunohematology",
  },
  "540": {
    code: "540",
    label: "Immunohematology - Antibody Identification",
    group: "Immunohematology",
  },
  "550": {
    code: "550",
    label: "Immunohematology - Compatibility Testing",
    group: "Immunohematology",
  },
  "610": { code: "610", label: "Pathology - Histopathology", group: "Pathology" },
  "620": { code: "620", label: "Pathology - Oral Pathology", group: "Pathology" },
  "630": { code: "630", label: "Pathology - Cytology", group: "Pathology" },
  "800": { code: "800", label: "Radiobioassay", group: "Radiobioassay" },
  "900": { code: "900", label: "Clinical Cytogenetics", group: "Molecular" },
};

export function lcCodeLabel(code: string): string {
  const normalized = code.replace(/^0+/, "").padStart(3, "0");
  const padded = code.length <= 3 ? normalized.padStart(3, "0") : code;
  const entry = LC_CODE_MAP[code] ?? LC_CODE_MAP[padded];
  return entry?.label ?? `LC ${code}`;
}

export function lcCodeGroup(code: string): string {
  const entry = LC_CODE_MAP[code] ?? LC_CODE_MAP[code.padStart(3, "0")];
  return entry?.group ?? "Other";
}
