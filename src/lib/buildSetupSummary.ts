import {
  CONFIGURATION_OPTIONS,
  REPORT_TEMPLATE_OPTIONS,
  type AccountConfigurationType,
  type BusinessForm,
  type ReportTemplateType,
  type USForm,
  type USLabArchetype,
  type USVolume,
} from "../context/CreateCentreContext";
import { US_PLAN_LABELS, US_PRICING_PLANS } from "../data/usPricingPlans";
import type { CreateCentreForm } from "../data/labs";
import { US_DEVICES } from "../data/usDevices";
import { LAB_ARCHETYPE_LABELS } from "./usOnboardingPrefill";

export type SetupSummaryIconId =
  | "lab"
  | "identifiers"
  | "lab-type"
  | "modalities"
  | "operations"
  | "devices"
  | "integrations"
  | "plan"
  | "configuration"
  | "team";

export interface SetupSummaryItem {
  icon: SetupSummaryIconId;
  label: string;
  value: string;
}

const VOLUME_LABELS: Record<USVolume, string> = {
  lt50: "< 50 patients / day",
  "50-200": "50 – 200 patients / day",
  "200-500": "200 – 500 patients / day",
  "500plus": "500+ patients / day",
};

function formatList(items: string[], max = 4): string {
  if (items.length === 0) return "—";
  const shown = items.slice(0, max);
  const rest = items.length - shown.length;
  const base = shown.join(", ");
  return rest > 0 ? `${base} +${rest} more` : base;
}

export function isUsOnboardingFlow(usForm: USForm): boolean {
  return Boolean(
    usForm.labName.trim() ||
      usForm.npi.trim() ||
      usForm.cliaNumber.trim() ||
      usForm.selectedModalities.length > 0
  );
}

export function buildSetupSummary(params: {
  form: CreateCentreForm;
  business: BusinessForm;
  usForm: USForm;
  configurationType: AccountConfigurationType;
  reportTemplate: ReportTemplateType;
  teamCount: number;
  serviceLabels: string[];
}): SetupSummaryItem[] {
  const { form, business, usForm, configurationType, reportTemplate, teamCount, serviceLabels } =
    params;

  const centreName =
    form.name.trim() ||
    business.registeredBusinessName.trim() ||
    usForm.labName.trim() ||
    "New Diagnostic Centre";

  const configLabel =
    CONFIGURATION_OPTIONS.find((c) => c.id === configurationType)?.title ?? configurationType;
  const reportLabel =
    REPORT_TEMPLATE_OPTIONS.find((r) => r.id === reportTemplate)?.label ?? reportTemplate;

  const items: SetupSummaryItem[] = [];

  if (isUsOnboardingFlow(usForm)) {
    const addressParts = [
      usForm.labAddress,
      usForm.labCity,
      usForm.labState,
      usForm.labZip,
    ].filter(Boolean);
    const address =
      addressParts.join(", ") || [form.address, form.city, form.state].filter(Boolean).join(", ");

    items.push({
      icon: "lab",
      label: "Lab",
      value: centreName + (address ? ` · ${address}` : ""),
    });

    const ids: string[] = [];
    if (usForm.npi.trim()) ids.push(`NPI ${usForm.npi.trim()}`);
    if (usForm.cliaNumber.trim()) ids.push(`CLIA ${usForm.cliaNumber.trim()}`);
    if (ids.length > 0) {
      items.push({ icon: "identifiers", label: "Identifiers", value: ids.join(" · ") });
    }

    items.push({
      icon: "lab-type",
      label: "Lab type",
      value: LAB_ARCHETYPE_LABELS[usForm.labArchetype as USLabArchetype] ?? usForm.labArchetype,
    });

    if (usForm.selectedModalities.length > 0) {
      items.push({
        icon: "modalities",
        label: "Modalities",
        value: formatList(usForm.selectedModalities, 6),
      });
    }

    const ops: string[] = [];
    if (usForm.volume) ops.push(VOLUME_LABELS[usForm.volume]);
    if (usForm.locations.trim()) ops.push(`${usForm.locations.trim()} location(s)`);
    if (usForm.userCount.trim()) ops.push(`${usForm.userCount.trim()} users`);
    if (ops.length > 0) {
      items.push({ icon: "operations", label: "Operations", value: ops.join(" · ") });
    }

    const deviceNames = usForm.selectedDeviceIds
      .map((id) => US_DEVICES.find((d) => d.id === id)?.deviceName)
      .filter((n): n is string => Boolean(n));
    const customNames = usForm.customDevices.map((d) => d.name);
    const allDevices = [...deviceNames, ...customNames];
    if (allDevices.length > 0) {
      items.push({
        icon: "devices",
        label: "Devices",
        value: formatList(allDevices, 3),
      });
    }

    if (usForm.selectedIntegrations.length > 0) {
      items.push({
        icon: "integrations",
        label: "Integrations",
        value: formatList(usForm.selectedIntegrations, 3),
      });
    }

    const plan = US_PRICING_PLANS.find((p) => p.id === usForm.selectedPlan);
    items.push({
      icon: "plan",
      label: "Plan",
      value: plan
        ? `${US_PLAN_LABELS[usForm.selectedPlan]} · $${plan.priceMonthly.toLocaleString("en-US")}/mo`
        : US_PLAN_LABELS[usForm.selectedPlan],
    });
  } else {
    const address = [form.address, form.city, form.state, form.pincode].filter(Boolean).join(", ");
    items.push({
      icon: "lab",
      label: "Centre",
      value: centreName + (address ? ` · ${address}` : ""),
    });

    if (serviceLabels.length > 0) {
      items.push({
        icon: "modalities",
        label: "Services",
        value: formatList(serviceLabels, 5),
      });
    }
  }

  items.push({
    icon: "configuration",
    label: "Configuration",
    value: `${configLabel} · ${reportLabel}`,
  });

  if (teamCount > 0) {
    items.push({
      icon: "team",
      label: "Team",
      value: `${teamCount} member${teamCount === 1 ? "" : "s"} added`,
    });
  }

  return items;
}
