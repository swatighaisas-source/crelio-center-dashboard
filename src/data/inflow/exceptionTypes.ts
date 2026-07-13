import type { ExceptionKey } from "./mockOrders";

export type ExceptionSourceLevel = "order" | "bill" | "sample" | "report";
export type ExceptionStatus = "active" | "resolved";
export type ExceptionRelation = "direct" | "inherited" | "related";

export type ExceptionRecord = {
  id: string;
  sourceLevel: ExceptionSourceLevel;
  sourceId: string;
  exceptionKey: ExceptionKey;
  comment: string;
  status: ExceptionStatus;
  createdAt: string;
  createdBy: string;
  resolvedAt?: string;
  resolvedBy?: string;
  resolutionComment?: string;
};

export type ExceptionActivityItem = {
  id: string;
  type: "set" | "resolved";
  exceptionKey: ExceptionKey;
  comment: string;
  timestamp: string;
  actor: string;
  sourceLevel: ExceptionSourceLevel;
  sourceId: string;
  sourceLabel: string;
  relation: ExceptionRelation;
};

export type PropagatedExceptions = {
  directActive: ExceptionRecord[];
  inheritedActive: ExceptionRecord[];
  relatedActive: ExceptionRecord[];
  activity: ExceptionActivityItem[];
};

export const initialExceptionRecords: ExceptionRecord[] = [];
