import type { USLabArchetype } from "../context/CreateCentreContext";

export interface TaxonomyRow {
  code: string;
  description: string;
  suggestedLabType: string;
  archetype: USLabArchetype;
  confidence: "High" | "Medium" | "Low";
}

export const TAXONOMY_MAP: TaxonomyRow[] = [
  {
    code: "291U00000X",
    description: "Clinical Medical Laboratory",
    suggestedLabType: "Independent Clinical Lab",
    archetype: "independent",
    confidence: "High",
  },
  {
    code: "291500000X",
    description: "Clinical Molecular Genetics Lab",
    suggestedLabType: "Molecular Lab",
    archetype: "specialty",
    confidence: "High",
  },
  {
    code: "291R00000X",
    description: "Clinical Biochemical Genetics Lab",
    suggestedLabType: "Molecular / Genetics Lab",
    archetype: "specialty",
    confidence: "High",
  },
  {
    code: "291Y00000X",
    description: "Clinical Cytogenetics & Molecular Genetics Lab",
    suggestedLabType: "Molecular / Cytogenetics Lab",
    archetype: "specialty",
    confidence: "High",
  },
  {
    code: "261QP0400X",
    description: "Federally Qualified Health Center",
    suggestedLabType: "Clinic-based Lab / POL Candidate",
    archetype: "physician-office",
    confidence: "Medium",
  },
  {
    code: "207Q00000X",
    description: "Family Medicine",
    suggestedLabType: "Physician Office Lab (POL) Candidate",
    archetype: "physician-office",
    confidence: "Medium",
  },
  {
    code: "207R00000X",
    description: "Internal Medicine",
    suggestedLabType: "Physician Office Lab (POL) Candidate",
    archetype: "physician-office",
    confidence: "Medium",
  },
  {
    code: "208000000X",
    description: "General Practice",
    suggestedLabType: "Physician Office Lab (POL) Candidate",
    archetype: "physician-office",
    confidence: "Medium",
  },
];

export function archetypeFromTaxonomyCode(code: string): USLabArchetype {
  const row = TAXONOMY_MAP.find((r) => r.code === code);
  return row ? row.archetype : "independent";
}

/** Archetype suggested by NPI taxonomy lookup (fetch path only). */
export function getRecommendedArchetype(
  taxonomyCode: string,
  manualEntry: boolean
): USLabArchetype | null {
  if (!taxonomyCode || manualEntry) return null;
  return archetypeFromTaxonomyCode(taxonomyCode);
}
