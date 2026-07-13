import { LAB_ROWS, type LabRow } from "./labs";
import type { LabWorkflowConfig } from "./labWorkflowConfig";

export interface LabSPOC {
  role: string;
  name: string;
  email: string;
  phone?: string;
}

export interface FeedbackModuleEntry {
  name: string;
  rating: number;
  relevant?: boolean;
  presetComment?: string | null;
  comment?: string;
}

export interface FeedbackEntry {
  id: number;
  date: string;
  nps: number;
  /** Selected NPS preset pill labels */
  npsPresetComments?: string[];
  /** NPS free-text comment */
  npsComment?: string;
  /** @deprecated Use npsComment */
  overallComment?: string;
  modules: FeedbackModuleEntry[];
  by: string;
}

export function feedbackEntryNpsComment(entry: FeedbackEntry): string | undefined {
  const parts: string[] = [];
  if (entry.npsPresetComments?.length) {
    parts.push(entry.npsPresetComments.join(" · "));
  }
  const free = entry.npsComment ?? entry.overallComment;
  if (free?.trim()) parts.push(free.trim());
  return parts.length > 0 ? parts.join("\n\n") : undefined;
}

export interface LabOnboardingCustomDevice {
  modality: string;
  name: string;
}

export interface LabOnboardingSnapshot {
  npi?: string;
  clia?: string;
  /** US onboarding archetype id (e.g. reference, independent) */
  labArchetype?: string;
  /** Display label for lab type */
  labType?: string;
  modalities: string[];
  /** Resolved device names for display / legacy */
  devices: string[];
  integrations: string[];
  /** Device catalogue ids from create-centre flow */
  selectedDeviceIds?: number[];
  customDevices?: LabOnboardingCustomDevice[];
  /** Daily volume band id (lt50, 50-200, …) */
  volume?: string;
  timeline?: string;
  locations?: string;
  userCount?: string;
  /** Plan tier id (smart, optimized, pro, power) */
  selectedPlan?: string;
}

export interface LabDetail extends LabRow {
  createdOn: string;
  email: string;
  address: string;
  comment: string;
  expectedLiveDate: string;
  expectedLiveNote: string;
  salesPerson: string;
  contact: string;
  zohoContactId: string;
  onboardingDays: number;
  status: "Onboarding" | "Live" | "Trial" | "Shut down";
  hasBillingDiscrepancy: boolean;
  labAbbreviation: string;
  currentPlan: string;
  currentBalance: number;
  spocs: LabSPOC[];
  onboardingSnapshot: LabOnboardingSnapshot;
  feedbackHistory: FeedbackEntry[];
  /** Feature module ids enabled for lab-user feedback; defaults to all when unset */
  trackedFeedbackFeatureIds?: string[];
  /** Per-lab top nav and home visibility for notifications and actions/tasks */
  workflowConfig?: Partial<LabWorkflowConfig>;
}

const DEFAULT_DETAIL: Omit<LabDetail, keyof LabRow> = {
  createdOn: "22nd May, 2026",
  email: "contact@lab.example.com",
  address: "Hyderabad, Telangana, India",
  comment: "-",
  expectedLiveDate: "18th Jun, 2026",
  expectedLiveNote: "20 Days Left 0 Days in Onboarding",
  salesPerson: "Pavan",
  contact: "8008118118",
  zohoContactId: "163024000066691006",
  onboardingDays: 0,
  status: "Onboarding",
  hasBillingDiscrepancy: true,
  labAbbreviation: "Auriya",
  currentPlan: "Advance Plan 2024 - IND",
  currentBalance: 0,
  spocs: [
    { role: "Owner", name: "Rajesh Sharma", email: "rajesh@diaglab.com", phone: "+1 (410) 834-8600" },
  ],
  onboardingSnapshot: {
    modalities: [],
    devices: [],
    integrations: [],
  },
  feedbackHistory: [],
};

function formatExpectedLiveDate(planned: string): string {
  const match = planned.match(/^(\w+) (\d+), (\d+)$/);
  if (!match) return planned;
  const day = Number(match[2]);
  const suffix =
    day % 10 === 1 && day !== 11
      ? "st"
      : day % 10 === 2 && day !== 12
        ? "nd"
        : day % 10 === 3 && day !== 13
          ? "rd"
          : "th";
  return `${day}${suffix} ${match[1]}, ${match[3]}`;
}

const OVERRIDES: Partial<Record<number, Partial<LabDetail>>> = {
  12922: {
    email: "vaddirajudheeraj@gmail.com",
    labAbbreviation: "Auriya",
    accountManager: "Swamy Kethavath",
    mrr: 15104,
    planType: "Fixed recurring",
    expectedLiveNote: "20 Days Left 0 Days in Onboarding",
    spocs: [
      { role: "Owner", name: "Dheeraj Vaddiraj", email: "vaddirajudheeraj@gmail.com", phone: "+1 (410) 834-8600" },
      { role: "Lab Director", name: "Dr. Priya Mehta", email: "priya.mehta@diamondmedlab.com", phone: "+1 (410) 834-8601" },
      { role: "Implementation Co-ordinator", name: "Ravi Kiran", email: "ravi.kiran@diamondmedlab.com" },
    ],
    onboardingSnapshot: {
      npi: "1427588029",
      clia: "21D2130306",
      labType: "Reference / Hospital-based Lab",
      modalities: ["Hematology", "Blood Chemistry", "Molecular"],
      devices: ["Sysmex XN-1000", "Sysmex XN-2000", "Roche Cobas c501", "Roche Cobas 6800"],
      integrations: ["AthenaHealth", "Ellkay", "Kareo"],
      timeline: "1 – 3 months",
      locations: "2",
      userCount: "15",
    },
    feedbackHistory: [
      {
        id: 1,
        date: "30th May, 2026",
        nps: 8,
        npsComment:
          "Setup was smooth overall. The NPI prefill saved a lot of time. The modality selection could use clearer labels.",
        modules: [
          {
            name: "Home collection",
            rating: 5,
            relevant: true,
            presetComment: "We are happy with how this works for our lab.",
          },
          {
            name: "Appointments",
            rating: 4,
            relevant: true,
            presetComment: "Mostly works for us; we may need a few adjustments.",
          },
          {
            name: "Sample Accession",
            rating: 4,
            relevant: true,
            comment: "Training on barcode workflow would help.",
          },
          {
            name: "Auto validation",
            rating: 3,
            relevant: true,
            presetComment: "Useful, but we need more clarity on day-to-day use.",
          },
          {
            name: "Email delivery",
            rating: 5,
            relevant: true,
            presetComment: "Clear and aligned with how we operate.",
          },
          {
            name: "Billing integration",
            rating: 4,
            relevant: true,
          },
        ],
        by: "Dheeraj Vaddiraj",
      },
      {
        id: 2,
        date: "24th May, 2026",
        nps: 7,
        npsComment: "Initial demo was good. Need faster turnaround on billing setup.",
        modules: [
          {
            name: "B2B ordering",
            rating: 4,
            relevant: true,
            presetComment: "Mostly works for us; we may need a few adjustments.",
          },
          {
            name: "Billing integration",
            rating: 2,
            relevant: true,
            presetComment: "We have concerns — this does not match how we work today.",
            comment: "Waiting on payer list sync from AM.",
          },
          {
            name: "WhatsApp delivery",
            rating: 4,
            relevant: true,
          },
        ],
        by: "Dr. Priya Mehta",
      },
    ],
  },
};

export function getLabDetail(id: number): LabDetail | undefined {
  const row = LAB_ROWS.find((r) => r.id === id);
  if (!row) return undefined;

  const override = OVERRIDES[id] ?? {};
  return {
    ...DEFAULT_DETAIL,
    ...row,
    planType: row.planType.replace("Recurring", "recurring").replace("Billing", "billing"),
    expectedLiveDate: formatExpectedLiveDate(row.plannedLiveDate),
    expectedLiveNote: `${row.plannedLiveNote} | ${row.days} Days in Onboarding`,
    ...override,
  };
}

export const ACTIVITY_LOG = [
  {
    id: 1,
    text: "Lab State changed to Onboarding",
    by: "Abhijeet Kukade",
    time: "29th May, 2026 09:46 am",
    type: "system" as const,
  },
  {
    id: 2,
    text: "Accession pattern updated",
    by: "Swamy Kethavath",
    time: "29th May, 2026 09:12 am",
    type: "am" as const,
  },
  {
    id: 3,
    text: "Sales Person changed to Pavan",
    by: "Bhagyashali",
    time: "28th May, 2026 04:30 pm",
    type: "am" as const,
  },
  {
    id: 4,
    text: "MRR has been updated from 17700 to 15104",
    by: "System",
    time: "28th May, 2026 11:00 am",
    type: "payments" as const,
  },
  {
    id: 5,
    text: "Lab abbreviation changed to Auriya",
    by: "System",
    time: "27th May, 2026 11:30 am",
    type: "system" as const,
  },
  {
    id: 6,
    text: "New Features & Logins Added",
    by: "System",
    time: "26th May, 2026 02:15 pm",
    type: "system" as const,
  },
  {
    id: 7,
    text: "Expected Live Date updated",
    by: "Swamy Kethavath",
    time: "25th May, 2026 10:00 am",
    type: "am" as const,
  },
];

export const CHART_DATA = [
  { day: "23/05", bills: 2, reports: 1 },
  { day: "24/05", bills: 1, reports: 2 },
  { day: "25/05", bills: 3, reports: 2 },
  { day: "26/05", bills: 2, reports: 3 },
  { day: "27/05", bills: 1, reports: 1 },
  { day: "28/05", bills: 0, reports: 0 },
  { day: "29/05", bills: 1, reports: 1 },
];
