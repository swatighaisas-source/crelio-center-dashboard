import type { Report } from "./mockReports";

export const DISMISS_REPORT_REASONS = [
  "Sample never received",
  "Test no longer required",
  "Order booked in error",
  "Duplicate test",
  "Patient request",
  "Other",
] as const;

export type DismissReportReason = (typeof DISMISS_REPORT_REASONS)[number] | string;

export type DismissReportSource = "Dismiss Report" | "Bulk Dismiss";

export type DismissReportInput = {
  reportIds: string[];
  reason: string;
  remarks: string;
  source: DismissReportSource;
  dismissedBy: string;
};

export type DismissReportFailure = {
  reportId: string;
  accessionNo: string;
  service: string;
  patientName: string;
  reason: string;
};

export type DismissReportSuccess = {
  reportId: string;
  accessionNo: string;
  service: string;
  patientName: string;
};

export type DismissReportSummary = {
  totalSelected: number;
  succeeded: DismissReportSuccess[];
  failed: DismissReportFailure[];
};

export function canDismissReport(report: Report | undefined | null): {
  ok: boolean;
  reason?: string;
} {
  if (!report) return { ok: false, reason: "Test not found." };
  if (report.status === "Dismissed" || report.dismissal) {
    return { ok: false, reason: "Test is already dismissed." };
  }
  return { ok: true };
}

export function canRestoreReport(report: Report | undefined | null): {
  ok: boolean;
  reason?: string;
} {
  if (!report) return { ok: false, reason: "Test not found." };
  if (report.status !== "Dismissed" && !report.dismissal) {
    return { ok: false, reason: "Test is not dismissed." };
  }
  return { ok: true };
}

export function emptyDismissSummary(totalSelected = 0): DismissReportSummary {
  return { totalSelected, succeeded: [], failed: [] };
}
