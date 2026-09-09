/** How often AOE answers are captured for duplicate tests on a bill. */
export type AoeCaptureFrequency = "ONCE_PER_TEST" | "ONCE_PER_TEST_INSTANCE";

export const DEFAULT_AOE_CAPTURE_FREQUENCY: AoeCaptureFrequency = "ONCE_PER_TEST_INSTANCE";

export const AOE_CAPTURE_FREQUENCY_OPTIONS: {
  value: AoeCaptureFrequency;
  label: string;
}[] = [
  {
    value: "ONCE_PER_TEST",
    label: "Once per test",
  },
  {
    value: "ONCE_PER_TEST_INSTANCE",
    label: "Once per test instance",
  },
];

/** AOE field types supported in the billing flow. */
export type AoeQuestionType =
  | "text"
  | "textarea"
  | "email"
  | "date"
  | "datetime"
  | "signature";

export interface AoeQuestion {
  id: string;
  label: string;
  type: AoeQuestionType;
  required: boolean;
}

export interface AoeSection {
  id: string;
  title: string;
  questions: AoeQuestion[];
}

export interface AoeFormDefinition {
  formId: string;
  testId: string;
  testName: string;
  description: string;
  sections: AoeSection[];
}

/**
 * One row in the Bill Patient test table.
 * When AOE capture is ONCE_PER_TEST_INSTANCE, each qty unit on a row
 * generates a separate AOE instance (see buildAoeInstanceQueue).
 */
export interface BillLineItem {
  id: string;
  testId: string;
  testName: string;
  testCode: string;
  qty: number;
  price: number;
  concession: number;
  hasAoe: boolean;
  sortIndex: number;
}

export interface AoeAnswer {
  billId: string;
  lineItemId: string;
  /** 1-based qty slot within the bill row (default 1 for legacy answers). */
  instanceIndex: number;
  testId: string;
  formId: string;
  sectionId: string;
  questionId: string;
  value: string;
  metadata?: Record<string, string>;
}

/** One navigable step: a section within a test instance. */
export interface AoeNavigationStep {
  lineItemId: string;
  /** 1-based qty slot within the bill row. */
  instanceIndex: number;
  anchorLineItemId: string;
  anchorInstanceIndex: number;
  testId: string;
  testName: string;
  formId: string;
  instanceNumber: number;
  instanceTotal: number;
  sectionIndex: number;
  sectionId: string;
  sectionTitle: string;
  totalSections: number;
}

export interface PendingAoeInstance {
  testName: string;
  lineItemId: string;
  instanceIndex: number;
  instanceNumber: number;
  instanceTotal: number;
  message: string;
}

export interface AoeBillStatus {
  complete: boolean;
  pending: PendingAoeInstance[];
}

/** Legacy answers stored before lineItemId was introduced. */
export interface LegacyAoeAnswer {
  billId: string;
  testId: string;
  formId: string;
  sectionId: string;
  questionId: string;
  value: string;
  lineItemId?: string;
  instanceIndex?: number;
  metadata?: Record<string, string>;
}

export function createLineItemId(): string {
  if (typeof crypto !== "undefined" && crypto.randomUUID) {
    return crypto.randomUUID();
  }
  return `li-${Date.now()}-${Math.random().toString(36).slice(2, 9)}`;
}
