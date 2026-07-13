import type {
  ExceptionActivityItem,
  ExceptionRecord,
  ExceptionRelation,
  ExceptionSourceLevel,
  PropagatedExceptions,
} from "../../data/inflow/exceptionTypes";
import type { Order } from "../../data/inflow/mockOrders";
import type { Report } from "../../data/inflow/mockReports";
import type { Sample } from "../../data/inflow/mockSamples";

type Graph = {
  orders: Order[];
  samples: Sample[];
  reports: Report[];
};

const sourceRank: Record<ExceptionSourceLevel, number> = {
  order: 0,
  bill: 1,
  sample: 2,
  report: 3,
};

export function getExceptionLabel(sourceLevel: ExceptionSourceLevel, sourceId: string) {
  if (sourceLevel === "order") {
    return `Order : #${sourceId}`;
  }
  if (sourceLevel === "bill") {
    return `Bill : #${sourceId}`;
  }
  if (sourceLevel === "sample") {
    return `Sample : ${sourceId}`;
  }
  return `Report : #${sourceId}`;
}

function isRecordInOrderChain(record: ExceptionRecord, orderId: number, graph: Graph) {
  if (record.sourceLevel === "order") {
    return record.sourceId === String(orderId);
  }
  if (record.sourceLevel === "bill") {
    return graph.orders.some(
      (order) =>
        order.id === orderId && order.bills.some((bill) => String(bill.id) === record.sourceId),
    );
  }
  if (record.sourceLevel === "sample") {
    return graph.samples.some((sample) => sample.id === record.sourceId && sample.orderId === orderId);
  }
  return graph.reports.some((report) => report.id === record.sourceId && report.orderId === orderId);
}

function isRecordInBillChain(record: ExceptionRecord, billId: string, orderId: number, graph: Graph) {
  if (record.sourceLevel === "order") {
    return record.sourceId === String(orderId);
  }
  if (record.sourceLevel === "bill") {
    return record.sourceId === billId;
  }
  if (record.sourceLevel === "sample") {
    return graph.samples.some((sample) => sample.id === record.sourceId && sample.billId === billId);
  }
  return graph.reports.some((report) => report.id === record.sourceId && report.billId === billId);
}

function isRecordInSampleChain(record: ExceptionRecord, sample: Sample, graph: Graph) {
  if (record.sourceLevel === "order") {
    return record.sourceId === String(sample.orderId);
  }
  if (record.sourceLevel === "bill") {
    return record.sourceId === sample.billId;
  }
  if (record.sourceLevel === "sample") {
    return record.sourceId === sample.id;
  }
  return graph.reports.some((report) => report.id === record.sourceId && report.sampleId === sample.id);
}

function isRecordInReportChain(record: ExceptionRecord, report: Report) {
  if (record.sourceLevel === "order") {
    return record.sourceId === String(report.orderId);
  }
  if (record.sourceLevel === "bill") {
    return record.sourceId === report.billId;
  }
  if (record.sourceLevel === "sample") {
    return record.sourceId === report.sampleId;
  }
  return record.sourceId === report.id;
}

function getRelation(record: ExceptionRecord, currentLevel: ExceptionSourceLevel, currentId: string): ExceptionRelation {
  if (record.sourceLevel === currentLevel && record.sourceId === currentId) {
    return "direct";
  }
  if (sourceRank[record.sourceLevel] < sourceRank[currentLevel]) {
    return "inherited";
  }
  return "related";
}

function toActivity(record: ExceptionRecord, relation: ExceptionRelation): ExceptionActivityItem[] {
  const sourceLabel = getExceptionLabel(record.sourceLevel, record.sourceId);
  const created: ExceptionActivityItem = {
    id: `${record.id}-created`,
    type: "set",
    exceptionKey: record.exceptionKey,
    comment: record.comment,
    timestamp: record.createdAt,
    actor: record.createdBy,
    sourceLevel: record.sourceLevel,
    sourceId: record.sourceId,
    sourceLabel,
    relation,
  };

  if (record.status === "active") {
    return [created];
  }

  return [
    {
      id: `${record.id}-resolved`,
      type: "resolved",
      exceptionKey: record.exceptionKey,
      comment: record.resolutionComment || "Resolved",
      timestamp: record.resolvedAt || record.createdAt,
      actor: record.resolvedBy || record.createdBy,
      sourceLevel: record.sourceLevel,
      sourceId: record.sourceId,
      sourceLabel,
      relation,
    },
    created,
  ];
}

function buildPropagatedView(
  records: ExceptionRecord[],
  currentLevel: ExceptionSourceLevel,
  currentId: string,
  includeRecord: (record: ExceptionRecord) => boolean,
): PropagatedExceptions {
  const visible = records.filter(includeRecord);
  const directActive = visible.filter(
    (record) => record.status === "active" && record.sourceLevel === currentLevel && record.sourceId === currentId,
  );
  const inheritedActive = visible.filter((record) => {
    const relation = getRelation(record, currentLevel, currentId);
    return record.status === "active" && relation === "inherited";
  });
  const relatedActive = visible.filter((record) => {
    const relation = getRelation(record, currentLevel, currentId);
    return record.status === "active" && relation === "related";
  });

  const activity = visible.flatMap((record) => toActivity(record, getRelation(record, currentLevel, currentId)));

  return { directActive, inheritedActive, relatedActive, activity };
}

export function getExceptionsForOrder(
  orderId: number,
  records: ExceptionRecord[],
  graph: Graph,
): PropagatedExceptions {
  return buildPropagatedView(records, "order", String(orderId), (record) =>
    isRecordInOrderChain(record, orderId, graph),
  );
}

export function getExceptionsForBill(
  billId: string,
  orderId: number,
  records: ExceptionRecord[],
  graph: Graph,
): PropagatedExceptions {
  return buildPropagatedView(records, "bill", billId, (record) =>
    isRecordInBillChain(record, billId, orderId, graph),
  );
}

export function getExceptionsForSample(
  sample: Sample,
  records: ExceptionRecord[],
  graph: Graph,
): PropagatedExceptions {
  return buildPropagatedView(records, "sample", sample.id, (record) =>
    isRecordInSampleChain(record, sample, graph),
  );
}

export function getExceptionsForReport(report: Report, records: ExceptionRecord[]): PropagatedExceptions {
  return buildPropagatedView(records, "report", report.id, (record) => isRecordInReportChain(record, report));
}
