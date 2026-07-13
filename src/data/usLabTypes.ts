import type { USLabArchetype } from "../context/CreateCentreContext";

export const US_LAB_TYPE_OPTIONS: {
  id: USLabArchetype;
  title: string;
  shortTitle: string;
  description: string;
}[] = [
  {
    id: "physician-office",
    title: "Physician Office Lab (POL)",
    shortTitle: "POL",
    description: "CLIA-waived & moderate-complexity testing within a physician practice",
  },
  {
    id: "independent",
    title: "Independent / Multi-site Diagnostic Lab",
    shortTitle: "Independent",
    description: "High-volume clinical testing across multiple collection points or sites",
  },
  {
    id: "reference",
    title: "Reference / Hospital-based Lab",
    shortTitle: "Reference",
    description: "Send-out, esoteric testing, and hospital outreach laboratory programs",
  },
  {
    id: "specialty",
    title: "Specialty Lab",
    shortTitle: "Specialty",
    description: "Focused on Toxicology, Molecular, Pathology, or Radiology workflows",
  },
  {
    id: "d2c",
    title: "D2C / Home Collection Lab",
    shortTitle: "D2C / Home",
    description: "Direct-to-consumer kits, telehealth, and mobile phlebotomy services",
  },
];

export function labTypeTitleForArchetype(archetype?: string): string | undefined {
  if (!archetype) return undefined;
  return US_LAB_TYPE_OPTIONS.find((o) => o.id === archetype)?.title;
}

export function archetypeForLabTypeTitle(title?: string): USLabArchetype | undefined {
  if (!title) return undefined;
  const match = US_LAB_TYPE_OPTIONS.find(
    (o) => o.title === title || o.id === title,
  );
  return match?.id;
}
