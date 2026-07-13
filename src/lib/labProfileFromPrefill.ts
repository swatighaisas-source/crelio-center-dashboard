import type { USForm } from "../context/CreateCentreContext";
import type { LabOnboardingSnapshot } from "../data/labDetails";
import { US_PLAN_LABELS } from "../data/usPricingPlans";
import type { CmsCliaRecord } from "../services/cmsCliaApi";
import {
  mergeDemoFetchResults,
  type CliaFetchPreview,
  type NpiFetchPreview,
} from "./usOnboardingPrefill";

export interface RegistryFetchResult {
  snapshot: LabOnboardingSnapshot;
  npiPreview: NpiFetchPreview | null;
  cliaPreview: CliaFetchPreview;
  npiRawFields: Record<string, string> | null;
  cliaRawRecord: CmsCliaRecord;
}

export function formatProfileTimeline(timeline?: string): string {
  if (!timeline) return "";
  return timeline;
}

export function fetchRegistryForProfile(
  npi: string,
  clia: string,
  existing: LabOnboardingSnapshot,
): RegistryFetchResult {
  const merged = mergeDemoFetchResults(npi, clia);
  return {
    snapshot: mergeSnapshotWithUsPatch(existing, merged.usPatch, merged.cliaPreview.suggestedProfile),
    npiPreview: merged.npiPreview,
    cliaPreview: merged.cliaPreview,
    npiRawFields: merged.npiRawFields,
    cliaRawRecord: merged.cliaRawRecord,
  };
}

export function snapshotFromPrefillFetch(
  npi: string,
  clia: string,
  existing: LabOnboardingSnapshot,
): LabOnboardingSnapshot {
  return fetchRegistryForProfile(npi, clia, existing).snapshot;
}

export function mergeSnapshotWithUsPatch(
  existing: LabOnboardingSnapshot,
  usPatch: Partial<USForm>,
  suggestedLabType?: string,
): LabOnboardingSnapshot {
  const archetype = usPatch.labArchetype ?? existing.labArchetype;
  return {
    ...existing,
    npi: usPatch.npi?.trim() || existing.npi,
    clia: usPatch.cliaNumber?.trim() || existing.clia,
    labArchetype: archetype,
    labType: suggestedLabType || existing.labType,
    modalities:
      usPatch.selectedModalities && usPatch.selectedModalities.length > 0
        ? usPatch.selectedModalities
        : existing.modalities,
    volume: usPatch.volume ?? existing.volume,
    locations: usPatch.locations ? String(usPatch.locations) : existing.locations,
    userCount: usPatch.userCount ? String(usPatch.userCount) : existing.userCount,
    selectedPlan: usPatch.selectedPlan ?? existing.selectedPlan,
    timeline: usPatch.selectedPlan
      ? `Plan: ${US_PLAN_LABELS[usPatch.selectedPlan]}`
      : existing.timeline,
  };
}

export function parseListInput(value: string): string[] {
  return value
    .split(/[\n,]/)
    .map((s) => s.trim())
    .filter(Boolean);
}

export function formatListInput(items: string[]): string {
  return items.join(", ");
}
