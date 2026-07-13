import type { LabDetail } from "./labDetails";
import { feedbackEntryNpsComment } from "./labDetails";
import type { LabRow } from "./labs";

export type ReportTypeId =
  | "subscription"
  | "product-usage"
  | "onboarding-tracking"
  | "risk-analysis"
  | "product-feedback";

export interface ReportTypeOption {
  id: ReportTypeId;
  label: string;
  variants: { id: string; label: string }[];
}

export const REPORT_TYPES: ReportTypeOption[] = [
  {
    id: "subscription",
    label: "Subscription Management",
    variants: [
      { id: "renewal-summary", label: "Renewal Summary Report" },
      { id: "mrr-summary", label: "MRR Summary Report" },
    ],
  },
  {
    id: "product-usage",
    label: "Product Usage",
    variants: [
      { id: "module-adoption", label: "Module Adoption Report" },
      { id: "login-activity", label: "Login Activity Report" },
    ],
  },
  {
    id: "onboarding-tracking",
    label: "Onboarding Tracking",
    variants: [
      { id: "pipeline", label: "Onboarding Pipeline Report" },
      { id: "go-live", label: "Go-live Tracker Report" },
    ],
  },
  {
    id: "risk-analysis",
    label: "Risk Analysis",
    variants: [
      { id: "churn-risk", label: "Churn Risk Report" },
      { id: "billing-risk", label: "Billing Risk Report" },
    ],
  },
  {
    id: "product-feedback",
    label: "Product Feedback",
    variants: [{ id: "nps-summary", label: "NPS Feedback Export" }],
  },
];

export interface ProductFeedbackReportRow {
  labId: number;
  labName: string;
  labType: string;
  nps: number | null;
  feedbackDate: string | null;
  submittedBy: string | null;
  npsComment: string | null;
}

export function buildProductFeedbackReportRows(
  labs: LabRow[],
  getDetail: (id: number) => LabDetail | undefined,
): ProductFeedbackReportRow[] {
  return labs.map((row) => {
    const detail = getDetail(row.id);
    const latest = detail?.feedbackHistory[0];

    const labType =
      detail?.onboardingSnapshot?.labType?.trim() || row.labType?.trim() || "—";

    return {
      labId: row.id,
      labName: row.name,
      labType,
      nps: latest?.nps ?? row.nps ?? null,
      feedbackDate: latest?.date ?? null,
      submittedBy: latest?.by ?? null,
      npsComment: latest ? feedbackEntryNpsComment(latest) ?? null : null,
    };
  });
}

export function exportProductFeedbackCsv(rows: ProductFeedbackReportRow[]): void {
  const header = [
    "Lab Id",
    "Lab Name",
    "Lab Type",
    "NPS Score",
    "Feedback Date",
    "Submitted By",
    "NPS Comment",
  ];

  const escape = (v: string) => {
    if (v.includes(",") || v.includes('"') || v.includes("\n")) {
      return `"${v.replace(/"/g, '""')}"`;
    }
    return v;
  };

  const lines = [
    header.join(","),
    ...rows.map((row) =>
      [
        String(row.labId),
        escape(row.labName),
        escape(row.labType),
        row.nps !== null ? String(row.nps) : "",
        row.feedbackDate ?? "",
        row.submittedBy ? escape(row.submittedBy) : "",
        row.npsComment ? escape(row.npsComment) : "",
      ].join(","),
    ),
  ];

  const blob = new Blob([lines.join("\n")], { type: "text/csv;charset=utf-8;" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = "product-feedback-nps.csv";
  a.click();
  URL.revokeObjectURL(url);
}
