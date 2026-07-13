import type { ExceptionSourceLevel } from "../../data/inflow/exceptionTypes";
import type { Order } from "../../data/inflow/mockOrders";
import type { Report } from "../../data/inflow/mockReports";
import type { Sample } from "../../data/inflow/mockSamples";
import type { LabTask } from "../../data/inflow/mockTasks";

type EntityGraph = {
  orders: Order[];
  samples: Sample[];
  reports: Report[];
};

export type SourceSummaryRow = { label: string; value: string };

export function getTaskSourceSummary(task: LabTask, graph: EntityGraph): SourceSummaryRow[] {
  if (task.sourceLevel === "order") {
    const order = graph.orders.find((item) => String(item.id) === task.sourceId);
    return order
      ? [
          { label: "Order ID", value: String(order.id) },
          { label: "Account", value: order.account },
          { label: "Patient", value: order.patient },
          { label: "Order Date", value: order.orderDate },
          {
            label: "Services",
            value: order.services.map((service) => service.name).join(", ") || "-",
          },
          { label: "Status", value: order.status },
        ]
      : [];
  }
  if (task.sourceLevel === "bill") {
    const order = graph.orders.find((item) =>
      item.bills.some((bill) => String(bill.id) === task.sourceId),
    );
    const bill = order?.bills.find((item) => String(item.id) === task.sourceId);
    return bill
      ? [
          { label: "Bill ID", value: String(bill.id) },
          { label: "Bill Date", value: bill.date },
          { label: "Account", value: order?.account ?? "-" },
          { label: "Patient", value: order?.patient ?? "-" },
          { label: "Source", value: bill.source },
          { label: "Paid", value: bill.paid ? "Yes" : "No" },
        ]
      : [];
  }
  if (task.sourceLevel === "sample") {
    const sample = graph.samples.find((item) => item.id === task.sourceId);
    return sample
      ? [
          { label: "Sample ID", value: sample.parentSampleId ?? sample.id },
          { label: "Accession No", value: sample.accessionNo },
          { label: "Account", value: sample.accountName },
          { label: "Patient", value: sample.patientName },
          { label: "Sample Type", value: sample.sampleType },
          { label: "Services", value: sample.services.join(", ") },
        ]
      : [];
  }
  if (task.sourceLevel === "report") {
    const report = graph.reports.find((item) => item.id === task.sourceId);
    return report
      ? [
          { label: "Report ID", value: report.id },
          { label: "Accession No", value: report.accessionNo },
          { label: "Account", value: report.account },
          { label: "Patient", value: report.patientName },
          { label: "Service", value: report.service },
          { label: "Status", value: report.status },
        ]
      : [];
  }
  return [];
}

export function getRelatedEntityRefs(
  sourceLevel: ExceptionSourceLevel,
  sourceId: string,
  graph: EntityGraph,
): Array<{ sourceLevel: ExceptionSourceLevel; sourceId: string }> {
  const { orders, samples, reports } = graph;
  if (sourceLevel === "order") {
    const orderId = Number(sourceId);
    const order = orders.find((item) => item.id === orderId);
    const orderSamples = samples.filter((sample) => sample.orderId === orderId);
    return [
      { sourceLevel: "order", sourceId },
      ...(order?.bills ?? []).map((bill) => ({
        sourceLevel: "bill" as const,
        sourceId: String(bill.id),
      })),
      ...orderSamples.map((sample) => ({ sourceLevel: "sample" as const, sourceId: sample.id })),
      ...reports
        .filter((report) => report.orderId === orderId)
        .map((report) => ({ sourceLevel: "report" as const, sourceId: report.id })),
    ];
  }
  if (sourceLevel === "bill") {
    const order = orders.find((item) => item.bills.some((bill) => String(bill.id) === sourceId));
    if (!order) {
      return [{ sourceLevel: "bill", sourceId }];
    }
    const billSamples = samples.filter(
      (sample) => sample.billId === sourceId && sample.orderId === order.id,
    );
    const billReports = reports.filter(
      (report) => report.billId === sourceId && report.orderId === order.id,
    );
    return [
      { sourceLevel: "order", sourceId: String(order.id) },
      { sourceLevel: "bill", sourceId },
      ...billSamples.map((sample) => ({ sourceLevel: "sample" as const, sourceId: sample.id })),
      ...billReports.map((report) => ({ sourceLevel: "report" as const, sourceId: report.id })),
    ];
  }
  if (sourceLevel === "sample") {
    const sample = samples.find((item) => item.id === sourceId);
    if (!sample) {
      return [{ sourceLevel: "sample", sourceId }];
    }
    return [
      { sourceLevel: "order", sourceId: String(sample.orderId) },
      { sourceLevel: "bill", sourceId: sample.billId },
      { sourceLevel: "sample", sourceId },
      ...reports
        .filter((report) => report.sampleId === sourceId)
        .map((report) => ({ sourceLevel: "report" as const, sourceId: report.id })),
    ];
  }
  const report = reports.find((item) => item.id === sourceId);
  if (!report) {
    return [{ sourceLevel: "report", sourceId }];
  }
  return [
    { sourceLevel: "order", sourceId: String(report.orderId) },
    { sourceLevel: "bill", sourceId: report.billId },
    { sourceLevel: "sample", sourceId: report.sampleId },
    { sourceLevel: "report", sourceId },
  ];
}

export function getOpenTasksForEntity(
  tasks: LabTask[],
  sourceLevel: ExceptionSourceLevel,
  sourceId: string,
): LabTask[] {
  return tasks.filter(
    (task) =>
      task.sourceLevel === sourceLevel && task.sourceId === sourceId && task.status === "OPEN",
  );
}

export function getOpenTasksForEntityChain(
  tasks: LabTask[],
  sourceLevel: ExceptionSourceLevel,
  sourceId: string,
  graph: EntityGraph,
): LabTask[] {
  const relatedRefs = getRelatedEntityRefs(sourceLevel, sourceId, graph);
  return tasks.filter(
    (task) =>
      task.status === "OPEN" &&
      relatedRefs.some(
        (ref) => ref.sourceLevel === task.sourceLevel && ref.sourceId === task.sourceId,
      ),
  );
}
