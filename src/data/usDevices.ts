// Source: livehealth.solutions/api-v3/integration/public/supported-devices (snapshot 29 May 2026)
// Filtered to published=true and most relevant US modalities

export interface USDevice {
  id: number;
  deviceName: string;
  brand: string;
  modality: string;
  connectionType: string;
  interfacingType: string;
}

/** Canonical modalities shown in US onboarding (step 3). */
export const US_MODALITY_OPTIONS: { id: string; label: string }[] = [
  { id: "Hematology", label: "Hematology" },
  { id: "Blood Chemistry", label: "Blood Chemistry" },
  { id: "Molecular", label: "Molecular" },
  { id: "Toxicology", label: "Toxicology" },
  { id: "Radiology", label: "Radiology" },
  { id: "Anatomical", label: "Anatomical" },
];

/** @deprecated Use US_MODALITY_OPTIONS */
export const US_MODALITIES = US_MODALITY_OPTIONS;

/** Device `modality` values rolled up into Blood Chemistry. */
export const BLOOD_CHEMISTRY_DEVICE_MODALITIES = [
  "BioChemistry",
  "Immunology",
  "Serology",
  "Bio/Immunology",
  "Electrolyte",
] as const;

const LEGACY_MODALITY_TO_CANONICAL: Record<string, string> = {
  BioChemistry: "Blood Chemistry",
  Immunology: "Blood Chemistry",
  Serology: "Blood Chemistry",
  "Bio/Immunology": "Blood Chemistry",
  Electrolyte: "Blood Chemistry",
  Microbiology: "Blood Chemistry",
  "Clinical Pathology": "Blood Chemistry",
  Radiology: "Blood Chemistry",
  "Data management system": "Blood Chemistry",
};

const CANONICAL_MODALITY_IDS = new Set(US_MODALITY_OPTIONS.map((m) => m.id));

export function normalizeSelectedModalities(modalities: string[]): string[] {
  const out = new Set<string>();
  for (const id of modalities) {
    if (CANONICAL_MODALITY_IDS.has(id)) {
      out.add(id);
      continue;
    }
    const mapped = LEGACY_MODALITY_TO_CANONICAL[id];
    if (mapped) out.add(mapped);
  }
  return US_MODALITY_OPTIONS.map((m) => m.id).filter((id) => out.has(id));
}

export function deviceMatchesSelectedModality(
  deviceModality: string,
  selectedModality: string
): boolean {
  if (selectedModality === "Blood Chemistry") {
    return (BLOOD_CHEMISTRY_DEVICE_MODALITIES as readonly string[]).includes(deviceModality);
  }
  return deviceModality === selectedModality;
}

export const ARCHETYPE_DEFAULT_MODALITIES: Record<string, string[]> = {
  "physician-office": ["Hematology", "Blood Chemistry"],
  independent: ["Hematology", "Blood Chemistry"],
  reference: ["Hematology", "Blood Chemistry", "Molecular"],
  specialty: ["Molecular", "Toxicology"],
  d2c: ["Hematology", "Blood Chemistry"],
};

export const US_DEVICES: USDevice[] = [
  { id: 1, deviceName: "Abbott Alinity", brand: "Abbott", modality: "BioChemistry", connectionType: "LAN", interfacingType: "Bidirectional" },
  { id: 2, deviceName: "Abbott AMS", brand: "Abbott", modality: "Data management system", connectionType: "LAN", interfacingType: "Bidirectional" },
  { id: 3, deviceName: "Abbott ARCHITECT i1000", brand: "Abbott", modality: "Immunology", connectionType: "SERIAL", interfacingType: "Bidirectional" },
  { id: 4, deviceName: "Abbott ARCHITECT Ci8200", brand: "Abbott", modality: "Bio/Immunology", connectionType: "SERIAL", interfacingType: "Bidirectional" },
  { id: 5, deviceName: "Abbott ARCHITECT Ci4000", brand: "Abbott", modality: "BioChemistry", connectionType: "LAN", interfacingType: "Bidirectional" },
  { id: 6, deviceName: "Abbott ARCHITECT Ci4100", brand: "Abbott", modality: "Bio/Immunology", connectionType: "SERIAL", interfacingType: "Bidirectional" },
  { id: 7, deviceName: "Abbott ARCHITECT i1000SR", brand: "Abbott", modality: "Immunology", connectionType: "SERIAL", interfacingType: "Bidirectional" },
  { id: 8, deviceName: "Abbott ARCHITECT Plus", brand: "Abbott", modality: "Immunology", connectionType: "SERIAL", interfacingType: "Bidirectional" },
  { id: 9, deviceName: "Abbott Emerald 18", brand: "Abbott", modality: "Hematology", connectionType: "LAN", interfacingType: "Unidirectional" },
  { id: 10, deviceName: "Abbott Emerald 22", brand: "Abbott", modality: "Hematology", connectionType: "SERIAL", interfacingType: "Unidirectional" },
  { id: 11, deviceName: "ACL Elite Pro", brand: "ACL", modality: "Hematology", connectionType: "SERIAL", interfacingType: "Unidirectional" },
  { id: 12, deviceName: "Accurex Sphera", brand: "Accurex", modality: "BioChemistry", connectionType: "FileBase", interfacingType: "Bidirectional" },
  { id: 20, deviceName: "Alere Triage MeterPro", brand: "Alere", modality: "Immunology", connectionType: "SERIAL", interfacingType: "Unidirectional" },
  { id: 25, deviceName: "Beckman ACT 5 Diff", brand: "Beckman", modality: "Hematology", connectionType: "SERIAL", interfacingType: "Unidirectional" },
  { id: 27, deviceName: "Beckman Coulter - Access 2", brand: "Beckman", modality: "Immunology", connectionType: "SERIAL", interfacingType: "Bidirectional" },
  { id: 28, deviceName: "Beckman Coulter ACT", brand: "Beckman", modality: "Hematology", connectionType: "SERIAL", interfacingType: "Unidirectional" },
  { id: 29, deviceName: "Beckman Coulter DXC 700", brand: "Beckman", modality: "BioChemistry", connectionType: "SERIAL", interfacingType: "Bidirectional" },
  { id: 30, deviceName: "Beckman Coulter AU480", brand: "Beckman", modality: "BioChemistry", connectionType: "SERIAL", interfacingType: "Bidirectional" },
  { id: 31, deviceName: "Beckman Coulter AU640", brand: "Beckman", modality: "BioChemistry", connectionType: "SERIAL", interfacingType: "Bidirectional" },
  { id: 32, deviceName: "Beckman Coulter AU680", brand: "Beckman", modality: "BioChemistry", connectionType: "SERIAL", interfacingType: "Bidirectional" },
  { id: 33, deviceName: "Beckman Coulter DxH500", brand: "Beckman", modality: "Hematology", connectionType: "SERIAL/USB", interfacingType: "Unidirectional" },
  { id: 34, deviceName: "Beckman Coulter HD5", brand: "Beckman", modality: "Hematology", connectionType: "SERIAL", interfacingType: "Unidirectional" },
  { id: 35, deviceName: "Beckman Coulter LH 750", brand: "Beckman", modality: "Hematology", connectionType: "SERIAL", interfacingType: "Unidirectional" },
  { id: 36, deviceName: "Beckman Coulter LH 780", brand: "Beckman", modality: "Hematology", connectionType: "SERIAL", interfacingType: "Unidirectional" },
  { id: 37, deviceName: "Beckman Coulter Unicel Dxi 800", brand: "Beckman", modality: "Immunology", connectionType: "SERIAL", interfacingType: "Bidirectional" },
  { id: 38, deviceName: "Beckman Coulter DXH520", brand: "Beckman", modality: "Hematology", connectionType: "SERIAL/LAN", interfacingType: "Unidirectional" },
  { id: 39, deviceName: "Beckman Coulter DXH800", brand: "Beckman", modality: "Hematology", connectionType: "SERIAL", interfacingType: "Bidirectional" },
  { id: 244, deviceName: "Beckman Coulter DxH 560", brand: "Beckman", modality: "Hematology", connectionType: "SERIAL/LAN", interfacingType: "Unidirectional" },
  { id: 41, deviceName: "Biomerieux Biofire FilmArray", brand: "Biomerieux", modality: "Molecular", connectionType: "LAN", interfacingType: "Bidirectional" },
  { id: 42, deviceName: "Biomerieux Mini-Vidas", brand: "Biomerieux", modality: "Immunology", connectionType: "SERIAL", interfacingType: "Unidirectional" },
  { id: 46, deviceName: "BioRad EVOLIS", brand: "BioRad", modality: "Serology", connectionType: "SERIAL", interfacingType: "Bidirectional" },
  { id: 48, deviceName: "DiaSorin LIAISON", brand: "DiaSorin", modality: "Immunology", connectionType: "SERIAL", interfacingType: "Bidirectional" },
  { id: 49, deviceName: "DiaSorin LIAISON XL", brand: "DiaSorin", modality: "Immunology", connectionType: "SERIAL", interfacingType: "Bidirectional" },
  { id: 54, deviceName: "Dirui CA-530", brand: "Dirui", modality: "Clinical Pathology", connectionType: "SERIAL", interfacingType: "Unidirectional" },
  { id: 57, deviceName: "Erba XR-200", brand: "Erba", modality: "BioChemistry", connectionType: "LAN", interfacingType: "Bidirectional" },
  { id: 58, deviceName: "Erba XL-640", brand: "Erba", modality: "BioChemistry", connectionType: "LAN", interfacingType: "Bidirectional" },
  { id: 82, deviceName: "Horiba ABX Pentra 60", brand: "Horiba", modality: "Hematology", connectionType: "SERIAL", interfacingType: "Unidirectional" },
  { id: 83, deviceName: "Horiba ABX Pentra 80", brand: "Horiba", modality: "Hematology", connectionType: "SERIAL", interfacingType: "Unidirectional" },
  { id: 84, deviceName: "Horiba ABX Pentra 120", brand: "Horiba", modality: "Hematology", connectionType: "SERIAL", interfacingType: "Unidirectional" },
  { id: 90, deviceName: "Mindray BC-5000", brand: "Mindray", modality: "Hematology", connectionType: "LAN", interfacingType: "Bidirectional" },
  { id: 91, deviceName: "Mindray BC-5300", brand: "Mindray", modality: "Hematology", connectionType: "LAN", interfacingType: "Bidirectional" },
  { id: 92, deviceName: "Mindray BC-6800", brand: "Mindray", modality: "Hematology", connectionType: "LAN", interfacingType: "Bidirectional" },
  { id: 93, deviceName: "Mindray BS-200", brand: "Mindray", modality: "BioChemistry", connectionType: "SERIAL", interfacingType: "Bidirectional" },
  { id: 94, deviceName: "Mindray BS-380", brand: "Mindray", modality: "BioChemistry", connectionType: "SERIAL", interfacingType: "Bidirectional" },
  { id: 95, deviceName: "Mindray BS-480", brand: "Mindray", modality: "BioChemistry", connectionType: "SERIAL", interfacingType: "Bidirectional" },
  { id: 104, deviceName: "Ortho VITROS 250", brand: "Ortho", modality: "BioChemistry", connectionType: "SERIAL", interfacingType: "Bidirectional" },
  { id: 107, deviceName: "Randox Imola", brand: "Randox", modality: "BioChemistry", connectionType: "LAN", interfacingType: "Bidirectional" },
  { id: 108, deviceName: "Roche Cobas c501", brand: "Roche", modality: "BioChemistry", connectionType: "LAN", interfacingType: "Bidirectional" },
  { id: 109, deviceName: "Roche Cobas c311", brand: "Roche", modality: "BioChemistry", connectionType: "LAN", interfacingType: "Bidirectional" },
  { id: 110, deviceName: "Roche Cobas e411", brand: "Roche", modality: "Immunology", connectionType: "LAN", interfacingType: "Bidirectional" },
  { id: 111, deviceName: "Roche Cobas e601", brand: "Roche", modality: "Immunology", connectionType: "LAN", interfacingType: "Bidirectional" },
  { id: 112, deviceName: "Roche Cobas 6800", brand: "Roche", modality: "Molecular", connectionType: "LAN", interfacingType: "Bidirectional" },
  { id: 113, deviceName: "Roche Cobas 8800", brand: "Roche", modality: "Molecular", connectionType: "LAN", interfacingType: "Bidirectional" },
  { id: 114, deviceName: "Siemens ADVIA 120", brand: "Siemens", modality: "Hematology", connectionType: "SERIAL", interfacingType: "Unidirectional" },
  { id: 115, deviceName: "Siemens ADVIA 2120", brand: "Siemens", modality: "Hematology", connectionType: "SERIAL", interfacingType: "Unidirectional" },
  { id: 116, deviceName: "Siemens ADVIA Centaur", brand: "Siemens", modality: "Immunology", connectionType: "SERIAL", interfacingType: "Bidirectional" },
  { id: 117, deviceName: "Siemens ADVIA Chemistry XPT", brand: "Siemens", modality: "BioChemistry", connectionType: "LAN", interfacingType: "Bidirectional" },
  { id: 118, deviceName: "Siemens ATELLICA", brand: "Siemens", modality: "BioChemistry", connectionType: "LAN", interfacingType: "Bidirectional" },
  { id: 124, deviceName: "Sysmex XN-1000", brand: "Sysmex", modality: "Hematology", connectionType: "LAN", interfacingType: "Bidirectional" },
  { id: 125, deviceName: "Sysmex XN-2000", brand: "Sysmex", modality: "Hematology", connectionType: "LAN", interfacingType: "Bidirectional" },
  { id: 126, deviceName: "Sysmex XP-100", brand: "Sysmex", modality: "Hematology", connectionType: "LAN", interfacingType: "Unidirectional" },
  { id: 127, deviceName: "Sysmex XP-300", brand: "Sysmex", modality: "Hematology", connectionType: "LAN", interfacingType: "Unidirectional" },
  { id: 128, deviceName: "Sysmex XS-500i", brand: "Sysmex", modality: "Hematology", connectionType: "SERIAL", interfacingType: "Unidirectional" },
  { id: 129, deviceName: "Sysmex XS-800i", brand: "Sysmex", modality: "Hematology", connectionType: "SERIAL", interfacingType: "Unidirectional" },
  { id: 130, deviceName: "Sysmex XT-4000i", brand: "Sysmex", modality: "Hematology", connectionType: "SERIAL", interfacingType: "Unidirectional" },
  { id: 131, deviceName: "Sysmex CS-2500", brand: "Sysmex", modality: "Serology", connectionType: "LAN", interfacingType: "Bidirectional" },
  { id: 145, deviceName: "Thermofisher qSTAR Elite", brand: "Thermofisher", modality: "Molecular", connectionType: "LAN", interfacingType: "Bidirectional" },
  { id: 215, deviceName: "Qiagen Rotor-Gene Q", brand: "Qiagen", modality: "Molecular", connectionType: "LAN", interfacingType: "Bidirectional" },
  { id: 228, deviceName: "AlphaCount 60", brand: "Generic", modality: "Hematology", connectionType: "LAN", interfacingType: "Unidirectional" },
  { id: 230, deviceName: "Erba XL-200", brand: "Erba", modality: "BioChemistry", connectionType: "LAN", interfacingType: "Bidirectional" },
  { id: 301, deviceName: "Abbott ARCHITECT i2000SR", brand: "Abbott", modality: "Toxicology", connectionType: "SERIAL", interfacingType: "Bidirectional" },
  { id: 302, deviceName: "Roche Cobas c701", brand: "Roche", modality: "Toxicology", connectionType: "LAN", interfacingType: "Bidirectional" },
  { id: 303, deviceName: "Siemens Viva-E", brand: "Siemens", modality: "Toxicology", connectionType: "SERIAL", interfacingType: "Bidirectional" },
  { id: 304, deviceName: "Thermo Fisher Indiko", brand: "Thermofisher", modality: "Toxicology", connectionType: "LAN", interfacingType: "Bidirectional" },
  { id: 305, deviceName: "Beckman Coulter UniCel Dxl", brand: "Beckman", modality: "Toxicology", connectionType: "SERIAL", interfacingType: "Bidirectional" },
  { id: 306, deviceName: "Randox Evidence Investigator", brand: "Randox", modality: "Toxicology", connectionType: "LAN", interfacingType: "Bidirectional" },
  { id: 307, deviceName: "Ortho VITROS XT 7600", brand: "Ortho", modality: "Toxicology", connectionType: "LAN", interfacingType: "Bidirectional" },
  { id: 308, deviceName: "Agilent MassHunter LC/MS", brand: "Agilent", modality: "Toxicology", connectionType: "LAN", interfacingType: "Bidirectional" },
];

// Most popular brands for pre-suggestion sorting
export const POPULAR_BRANDS_ORDER = [
  "Sysmex", "Beckman", "Roche", "Siemens", "Abbott", "Mindray",
  "Horiba", "Biomerieux", "BioRad", "DiaSorin", "Ortho", "Qiagen", "Thermofisher",
  "Randox", "Agilent",
];

export function getPopularityScore(brand: string): number {
  const idx = POPULAR_BRANDS_ORDER.indexOf(brand);
  return idx === -1 ? 999 : idx;
}

export function getDevicesByModalities(modalities: string[], maxPerModality = 6): USDevice[] {
  const canonical = normalizeSelectedModalities(modalities);
  const result: USDevice[] = [];
  for (const mod of canonical) {
    const byMod = US_DEVICES.filter((d) => deviceMatchesSelectedModality(d.modality, mod))
      .sort((a, b) => getPopularityScore(a.brand) - getPopularityScore(b.brand))
      .slice(0, maxPerModality);
    result.push(...byMod);
  }
  // deduplicate
  const seen = new Set<number>();
  return result.filter((d) => {
    if (seen.has(d.id)) return false;
    seen.add(d.id);
    return true;
  });
}
