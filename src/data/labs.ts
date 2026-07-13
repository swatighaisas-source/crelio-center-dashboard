import type { LabLifecycleState } from "./labLifecycle";

export type PlannedLiveStatus = "future" | "past";

export interface LabRow {
  id: number;
  name: string;
  plannedLiveDate: string;
  plannedLiveNote: string;
  plannedLiveStatus: PlannedLiveStatus;
  days: number;
  planType: string;
  mrr: number;
  accountManager: string;
  lifecycleState: LabLifecycleState;
  /** Latest NPS score (0–10); null if not collected */
  nps?: number | null;
  labType?: string;
  modalities?: string[];
}

export const SUMMARY = {
  totalCount: 100,
  totalMrrInr: 614292,
  totalMrrUsd: 5984,
  rows: 100,
};

export type LabType = "standalone" | "collection" | "processing";

export interface CreateCentreForm {
  labType: LabType;
  name: string;
  phone: string;
  email: string;
  address: string;
  pincode: string;
  city: string;
  state: string;
  gstNumber: string;
  panNumber: string;
}

export const INITIAL_LAB_ROWS: LabRow[] = [
  {
    id: 12923,
    name: "HUDU Diagnostic Center",
    plannedLiveDate: "Jul 1, 2026",
    plannedLiveNote: "Onboarding",
    plannedLiveStatus: "future",
    days: 0,
    planType: "Fixed Recurring",
    mrr: 2750,
    accountManager: "Swamy Kethavath",
    nps: null,
    labType: "Independent Clinical Lab",
    modalities: ["Hematology", "Blood Chemistry"],
    lifecycleState: "onboarding",
  },
  {
    id: 12922,
    name: "Bhargavi Health Care",
    plannedLiveDate: "Jun 18, 2026",
    plannedLiveNote: "19 Days Left",
    plannedLiveStatus: "future",
    days: 0,
    planType: "Fixed Recurring",
    mrr: 15104,
    accountManager: "Swamy Kethavath",
    nps: 8,
    labType: "Reference / Hospital-based Lab",
    modalities: ["Hematology", "Blood Chemistry", "Molecular"],
    lifecycleState: "onboarding",
  },
  {
    id: 12921,
    name: "Sri Sai Diagnostics",
    plannedLiveDate: "Jun 15, 2026",
    plannedLiveNote: "17 Days Left",
    plannedLiveStatus: "future",
    days: 0,
    planType: "Fixed Recurring",
    mrr: 8500,
    accountManager: "Priya Sharma",
    nps: 9,
    labType: "Independent Clinical Lab",
    modalities: ["Hematology", "Blood Chemistry"],
    lifecycleState: "onboarding",
  },
  {
    id: 12920,
    name: "Metro Lab Services",
    plannedLiveDate: "Jun 12, 2026",
    plannedLiveNote: "14 Days Left",
    plannedLiveStatus: "future",
    days: 5,
    planType: "Variable Billing",
    mrr: 12300,
    accountManager: "Amit Patel",
    nps: 6,
    labType: "Physician Office Lab (POL)",
    modalities: ["Blood Chemistry", "Immunology"],
    lifecycleState: "onboarding",
  },
  {
    id: 12919,
    name: "City Care Pathology",
    plannedLiveDate: "Jun 10, 2026",
    plannedLiveNote: "12 Days Left",
    plannedLiveStatus: "future",
    days: 0,
    planType: "Fixed Recurring",
    mrr: 9800,
    accountManager: "Swamy Kethavath",
    nps: 7,
    labType: "Clinic-based Lab",
    modalities: ["Hematology", "Urinalysis"],
    lifecycleState: "onboarding",
  },
  {
    id: 12918,
    name: "Wellness Diagnostics Hub",
    plannedLiveDate: "Jun 8, 2026",
    plannedLiveNote: "10 Days Left",
    plannedLiveStatus: "future",
    days: 2,
    planType: "Fixed Recurring",
    mrr: 11200,
    accountManager: "Neha Gupta",
    nps: 10,
    labType: "Molecular Lab",
    modalities: ["Molecular", "Genetics"],
    lifecycleState: "onboarding",
  },
  {
    id: 12917,
    name: "Apollo Path Labs [A]",
    plannedLiveDate: "Jun 5, 2026",
    plannedLiveNote: "7 Days Left",
    plannedLiveStatus: "future",
    days: 0,
    planType: "Fixed Recurring",
    mrr: 22000,
    accountManager: "Bhagyashali",
    nps: 8,
    labType: "Hospital-based Lab",
    modalities: ["Hematology", "Blood Chemistry", "Microbiology"],
    lifecycleState: "trial",
  },
  {
    id: 12916,
    name: "Green Valley Medical",
    plannedLiveDate: "Jun 2, 2026",
    plannedLiveNote: "4 Days Left",
    plannedLiveStatus: "future",
    days: 1,
    planType: "Variable Billing",
    mrr: 7600,
    accountManager: "Priya Sharma",
    nps: 5,
    labType: "Independent Clinical Lab",
    modalities: ["Blood Chemistry"],
    lifecycleState: "onboarding",
  },
  {
    id: 12877,
    name: "ES Migration [B]",
    plannedLiveDate: "May 19, 2026",
    plannedLiveNote: "9 Days Ago",
    plannedLiveStatus: "past",
    days: 30,
    planType: "Fixed Recurring",
    mrr: 17700,
    accountManager: "Bhagyashali",
    nps: 7,
    labType: "Reference Lab",
    modalities: ["Hematology", "Blood Chemistry", "Immunology"],
    lifecycleState: "live",
  },
  {
    id: 12876,
    name: "North Star Diagnostics",
    plannedLiveDate: "May 15, 2026",
    plannedLiveNote: "13 Days Ago",
    plannedLiveStatus: "past",
    days: 15,
    planType: "Fixed Recurring",
    mrr: 9400,
    accountManager: "Amit Patel",
    nps: null,
    labType: "Collection Centre",
    modalities: ["Hematology"],
    lifecycleState: "trial",
  },
  {
    id: 12875,
    name: "LifeLine Pathology",
    plannedLiveDate: "May 12, 2026",
    plannedLiveNote: "16 Days Ago",
    plannedLiveStatus: "past",
    days: 0,
    planType: "Variable Billing",
    mrr: 6800,
    accountManager: "Swamy Kethavath",
    nps: 6,
    labType: "Physician Office Lab (POL)",
    modalities: ["Urinalysis", "Blood Chemistry"],
    lifecycleState: "shutdown",
  },
  {
    id: 12874,
    name: "Prime Health Labs",
    plannedLiveDate: "May 10, 2026",
    plannedLiveNote: "18 Days Ago",
    plannedLiveStatus: "past",
    days: 7,
    planType: "Fixed Recurring",
    mrr: 14500,
    accountManager: "Neha Gupta",
    nps: 9,
    labType: "Independent Clinical Lab",
    modalities: ["Hematology", "Blood Chemistry", "Molecular"],
    lifecycleState: "live",
  },
  {
    id: 12873,
    name: "CareFirst Diagnostics",
    plannedLiveDate: "May 8, 2026",
    plannedLiveNote: "20 Days Ago",
    plannedLiveStatus: "past",
    days: 0,
    planType: "Fixed Recurring",
    mrr: 10200,
    accountManager: "Bhagyashali",
    nps: 8,
    labType: "Clinic-based Lab",
    modalities: ["Hematology", "Immunology"],
    lifecycleState: "live",
  },
];

export function formatModalitiesList(modalities: string[], max = 3): string {
  if (modalities.length === 0) return "—";
  if (modalities.length <= max) return modalities.join(", ");
  return `${modalities.slice(0, max).join(", ")} +${modalities.length - max}`;
}

export function npsTone(score: number): "green" | "yellow" | "red" {
  if (score >= 9) return "green";
  if (score >= 7) return "yellow";
  return "red";
}

/** @deprecated Use INITIAL_LAB_ROWS or useLabs().labs */
export const LAB_ROWS = INITIAL_LAB_ROWS;

export function formatMrr(value: number): string {
  return value.toLocaleString("en-IN");
}

export function labRowFromCreateForm(
  form: CreateCentreForm,
  id: number
): { row: LabRow; detail: Partial<import("./labDetails").LabDetail> } {
  const live = new Date();
  live.setDate(live.getDate() + 30);
  const months = [
    "Jan", "Feb", "Mar", "Apr", "May", "Jun",
    "Jul", "Aug", "Sep", "Oct", "Nov", "Dec",
  ];
  const plannedLiveDate = `${months[live.getMonth()]} ${live.getDate()}, ${live.getFullYear()}`;

  const planType =
    form.labType === "processing" ? "Variable Billing" : "Fixed Recurring";

  return {
    row: {
      id,
      name: form.name,
      plannedLiveDate,
      plannedLiveNote: "30 Days Left",
      plannedLiveStatus: "future",
      days: 0,
      planType,
      mrr: 0,
      accountManager: "Unassigned",
      lifecycleState: "onboarding",
    },
    detail: {
      email: form.email,
      contact: form.phone,
      address: [form.address, form.city, form.state].filter(Boolean).join(", "),
      labAbbreviation: form.name.split(" ")[0] ?? "Lab",
      hasBillingDiscrepancy: false,
      comment: form.gstNumber ? `GST: ${form.gstNumber}` : "-",
    },
  };
}
