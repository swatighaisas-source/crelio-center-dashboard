import { mockOrders, type ExceptionActivity, type ExceptionKey } from "./mockOrders";
import { mockSamples } from "./mockSamples";

export type ReportStatus = "Received" | "Dispatched" | "Dismissed";

export type ReportDismissal = {
  reason: string;
  remarks: string;
  dismissedBy: string;
  dismissedAt: string;
  source: "Dismiss Report" | "Bulk Dismiss";
};

export type Report = {
  id: string;
  orderId: number;
  sampleId: string;
  accessionNo: string;
  service: string;
  patientName: string;
  dob: string;
  provider: string;
  account: string;
  status: ReportStatus;
  accessionDate: string;
  age: number;
  gender: string;
  reportDate: string;
  sampleDate: string;
  approvalDate: string;
  referralDoctor: string;
  billId: string;
  organization: string;
  exceptions: {
    active: ExceptionKey[];
    activity: ExceptionActivity[];
  };
  dismissal?: ReportDismissal;
};

export const mockReports: Report[] = mockSamples.flatMap((sample, sampleIndex) => {
  const order = mockOrders.find((item) => item.id === sample.orderId);
  const gender = order?.patientMeta.startsWith("F") ? "F" : "M";

  return sample.services.map((serviceName, serviceIndex) => ({
    id: String(57447 + sampleIndex * 10 + serviceIndex),
    orderId: sample.orderId,
    sampleId: sample.id,
    accessionNo: sample.accessionNo,
    service: serviceName,
    patientName: `${sample.patientName} (${gender})`,
    dob: "-",
    provider: order?.provider ?? "SELF",
    account: sample.accountName,
    status: "Received" as const,
    accessionDate: sample.orderDate,
    age: Number(order?.patientMeta.match(/\d+/)?.[0] ?? 34),
    gender,
    reportDate: sample.orderDate,
    sampleDate: sample.orderDate,
    approvalDate: sample.orderDate,
    referralDoctor: "Dr. PRADEEP GADGE",
    billId: sample.billId,
    organization: sample.organization,
    exceptions: { active: [], activity: [] },
  }));
});
