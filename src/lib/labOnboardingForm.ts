import type { USCustomDevice } from "../context/CreateCentreContext";
import type { USPlanTier } from "../context/CreateCentreContext";
import type { LabOnboardingSnapshot } from "../data/labDetails";
import { archetypeForLabTypeTitle, labTypeTitleForArchetype } from "../data/usLabTypes";
import { parseVolumeId } from "../data/usVolumeOptions";
import { US_DEVICES } from "../data/usDevices";
import { US_PLAN_LABELS } from "../data/usPricingPlans";

export interface LabProfileFormState {
  npi: string;
  clia: string;
  labArchetype: string;
  modalities: string[];
  volume: string;
  locations: string;
  userCount: string;
  selectedPlan: string;
  selectedDeviceIds: number[];
  customDevices: USCustomDevice[];
  selectedIntegrations: string[];
}

export function snapshotToFormState(snapshot: LabOnboardingSnapshot): LabProfileFormState {
  const archetype =
    snapshot.labArchetype ?? archetypeForLabTypeTitle(snapshot.labType) ?? "reference";

  let deviceIds = snapshot.selectedDeviceIds ?? [];
  let customDevices = snapshot.customDevices ?? [];

  if (deviceIds.length === 0 && customDevices.length === 0 && snapshot.devices.length > 0) {
    const parsed = devicesToStructured(snapshot.modalities, snapshot.devices);
    deviceIds = parsed.ids;
    customDevices = parsed.custom;
  }

  const volume = snapshot.volume && parseVolumeId(snapshot.volume) ? snapshot.volume : "";

  let selectedPlan = snapshot.selectedPlan ?? "";
  if (!selectedPlan && snapshot.timeline?.startsWith("Plan: ")) {
    const label = snapshot.timeline.replace("Plan: ", "");
    const entry = Object.entries(US_PLAN_LABELS).find(([, v]) => v === label);
    if (entry) selectedPlan = entry[0];
  }

  return {
    npi: snapshot.npi ?? "",
    clia: snapshot.clia ?? "",
    labArchetype: archetype,
    modalities: [...snapshot.modalities],
    volume,
    locations: snapshot.locations ?? "",
    userCount: snapshot.userCount ?? "",
    selectedPlan,
    selectedDeviceIds: deviceIds,
    customDevices,
    selectedIntegrations: [...snapshot.integrations],
  };
}

export function formStateToSnapshot(form: LabProfileFormState): LabOnboardingSnapshot {
  const labTypeTitle = labTypeTitleForArchetype(form.labArchetype) ?? form.labArchetype;
  const devices = structuredToDeviceNames(form.selectedDeviceIds, form.customDevices);

  return {
    npi: form.npi.trim() || undefined,
    clia: form.clia.trim() || undefined,
    labArchetype: form.labArchetype || undefined,
    labType: labTypeTitle || undefined,
    modalities: form.modalities,
    volume: form.volume || undefined,
    locations: form.locations.trim() || undefined,
    userCount: form.userCount.trim() || undefined,
    selectedPlan: (form.selectedPlan as USPlanTier) || undefined,
    timeline: form.selectedPlan
      ? `Plan: ${US_PLAN_LABELS[form.selectedPlan as USPlanTier] ?? form.selectedPlan}`
      : undefined,
    selectedDeviceIds: form.selectedDeviceIds,
    customDevices: form.customDevices,
    devices,
    integrations: form.selectedIntegrations,
  };
}

function devicesToStructured(
  modalities: string[],
  deviceNames: string[],
): { ids: number[]; custom: USCustomDevice[] } {
  const ids: number[] = [];
  const custom: USCustomDevice[] = [];
  const fallbackModality = modalities[0] ?? "Blood Chemistry";

  for (const name of deviceNames) {
    const found = US_DEVICES.find((d) => d.deviceName === name);
    if (found && !ids.includes(found.id)) {
      ids.push(found.id);
    } else if (name) {
      custom.push({ modality: fallbackModality, name });
    }
  }
  return { ids, custom };
}

function structuredToDeviceNames(ids: number[], custom: USCustomDevice[]): string[] {
  const fromIds = ids
    .map((id) => US_DEVICES.find((d) => d.id === id)?.deviceName)
    .filter((n): n is string => Boolean(n));
  const fromCustom = custom.map((c) => c.name).filter(Boolean);
  return [...fromIds, ...fromCustom];
}
