import { mockOrders, type ExceptionActivity, type ExceptionKey } from "./mockOrders";

export type Sample = {
  id: string;
  parentSampleId?: string;
  orderId: number;
  accessionNo: string;
  accountName: string;
  patientName: string;
  patientMeta: string;
  services: string[];
  sampleType: string;
  orderDate: string;
  comment: string;
  billId: string;
  organization: string;
  exceptions: {
    active: ExceptionKey[];
    activity: ExceptionActivity[];
  };
};

export const mockSamples: Sample[] = mockOrders.map((order) => ({
  id: `SD${String(order.id).padStart(6, "0")}1`,
  orderId: order.id,
  accessionNo: `AC${String(order.id).padStart(6, "0")}1`,
  accountName: order.account,
  patientName: order.patient,
  patientMeta: order.patientMeta,
  services: order.services.map((service) => service.name),
  sampleType: order.services[0]?.name.toLowerCase().includes("urine") ? "Urine" : "Serum",
  orderDate: order.orderDate,
  comment: "",
  billId: String(order.bills[0]?.id ?? order.id),
  organization: "Aspira Shobha Diagnostic Center",
  exceptions: { active: [], activity: [] },
}));
