import type { CliaDetectedSignals } from "./cliaSignals";

export type CliaLabProfile =
  | "Molecular Lab"
  | "Pathology Lab"
  | "Clinical Lab"
  | "Toxicology Lab"
  | "Multimodal Lab"
  | "Physician Office Lab (POL)"
  | "Reference Lab"
  | "Unable to classify from CLIA data";

export type CliaConfidence = "High" | "Medium" | "Low";

export interface CliaClassificationResult {
  profile: CliaLabProfile;
  confidence: CliaConfidence;
  reasoning: string[];
  detectedLabels: string[];
}

const MOLECULAR_TRIGGERS = [
  "molecular biology",
  "clinical molecular genetics",
  "molecular diagnostics",
  "cytogenetic",
  "clinical cytogenetics",
];

const PATHOLOGY_TRIGGERS = ["pathology", "cytology", "histology", "histopathology"];

const CLINICAL_TRIGGERS = [
  "chemistry",
  "hematology",
  "immunology",
  "urinalysis",
  "endocrinology",
  "routine chemistry",
];

function labelMatches(labels: string[], triggers: string[]): boolean {
  const lower = labels.map((l) => l.toLowerCase());
  return triggers.some((t) => lower.some((l) => l.includes(t)));
}

function hasLcCode(signals: CliaDetectedSignals, codes: string[]): boolean {
  return signals.specialties.some((s) => s.code && codes.includes(s.code.padStart(3, "0")));
}

function countDistinctGroups(signals: CliaDetectedSignals): number {
  const groups = new Set(signals.specialtyGroups);
  return groups.size;
}

function waivedVolume(record: CliaDetectedSignals): number {
  const waived = record.testVolumes.find((v) => v.label.includes("Waived"));
  if (!waived) return 0;
  return Number(waived.value.replace(/,/g, "")) || 0;
}

function annualTestVolume(record: CliaDetectedSignals): number {
  const annual = record.testVolumes.find((v) => v.label.includes("CMS-116 Annual"));
  if (!annual) return 0;
  return Number(annual.value.replace(/,/g, "")) || 0;
}

export function classifyLab(signals: CliaDetectedSignals): CliaClassificationResult {
  const detectedLabels = signals.specialties.map((s) => s.label);
  const reasoning: string[] = [];

  if (!signals.specialtyDataAvailable || detectedLabels.length === 0) {
    const certHint = signals.certificateTypeCode
      ? `Certificate type is ${signals.certificateType}.`
      : "";
    return {
      profile: "Unable to classify from CLIA data",
      confidence: "Low",
      reasoning: [
        "No specialty or LC-code fields were detected in the CMS record.",
        certHint,
        "Onboarding profile cannot be inferred from specialties alone.",
      ].filter(Boolean),
      detectedLabels,
    };
  }

  const cert = signals.certificateTypeCode;
  const isWaiverOrPpm = cert === "2" || cert === "4";
  const waivedVol = waivedVolume(signals);

  if (isWaiverOrPpm || (waivedVol > 0 && cert !== "1" && cert !== "3")) {
    reasoning.push(
      isWaiverOrPpm
        ? `Certificate type indicates ${signals.certificateType}.`
        : `Waived test volume (${waivedVol.toLocaleString()}) suggests waived testing.`
    );
    return {
      profile: "Physician Office Lab (POL)",
      confidence: isWaiverOrPpm ? "High" : "Medium",
      reasoning,
      detectedLabels,
    };
  }

  if (hasLcCode(signals, ["340"]) || labelMatches(detectedLabels, ["toxicology"])) {
    reasoning.push("Toxicology subspecialty (LC 340) or toxicology label detected.");
    return {
      profile: "Toxicology Lab",
      confidence: "High",
      reasoning,
      detectedLabels,
    };
  }

  const molecularMatch =
    labelMatches(detectedLabels, MOLECULAR_TRIGGERS) ||
    hasLcCode(signals, ["900"]) ||
    (hasLcCode(signals, ["140"]) && labelMatches(detectedLabels, ["virology"]));

  if (molecularMatch) {
    if (hasLcCode(signals, ["900"])) {
      reasoning.push("Clinical Cytogenetics (LC 900) present.");
    }
    if (labelMatches(detectedLabels, MOLECULAR_TRIGGERS)) {
      reasoning.push("Specialty label matches molecular / genetics keywords.");
    }
    if (!labelMatches(detectedLabels, MOLECULAR_TRIGGERS) && hasLcCode(signals, ["140"])) {
      reasoning.push(
        "Virology subspecialty used as weak molecular signal (molecular testing often filed under microbiology)."
      );
    }
    return {
      profile: "Molecular Lab",
      confidence: labelMatches(detectedLabels, MOLECULAR_TRIGGERS) ? "High" : "Medium",
      reasoning,
      detectedLabels,
    };
  }

  if (
    hasLcCode(signals, ["610", "620", "630"]) ||
    labelMatches(detectedLabels, PATHOLOGY_TRIGGERS)
  ) {
    reasoning.push("Pathology / cytology / histology specialty detected.");
    return {
      profile: "Pathology Lab",
      confidence: "High",
      reasoning,
      detectedLabels,
    };
  }

  const distinctGroups = countDistinctGroups(signals);
  if (distinctGroups >= 3) {
    reasoning.push(
      `${distinctGroups} distinct specialty groups detected (${signals.specialtyGroups.join(", ")}).`
    );
    return {
      profile: "Multimodal Lab",
      confidence: "Medium",
      reasoning,
      detectedLabels,
    };
  }

  const isIndependent = signals.facilityTypeCode === "15";
  const highVolume = annualTestVolume(signals) >= 25001;
  if (isIndependent && highVolume && distinctGroups >= 2) {
    reasoning.push(
      "Independent facility type with high annual test volume and multiple specialties (reference lab heuristic — not definitive)."
    );
    return {
      profile: "Reference Lab",
      confidence: "Low",
      reasoning,
      detectedLabels,
    };
  }

  if (
    hasLcCode(signals, ["310", "320", "330", "400", "210", "220"]) ||
    labelMatches(detectedLabels, CLINICAL_TRIGGERS)
  ) {
    reasoning.push("Chemistry, hematology, or immunology specialty detected.");
    return {
      profile: "Clinical Lab",
      confidence: "High",
      reasoning,
      detectedLabels,
    };
  }

  reasoning.push("Specialties present but no PRD rule matched with high specificity.");
  return {
    profile: "Unable to classify from CLIA data",
    confidence: "Low",
    reasoning,
    detectedLabels,
  };
}
