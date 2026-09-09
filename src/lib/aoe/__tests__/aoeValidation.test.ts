import { describe, expect, it } from "vitest";
import type { AoeAnswer, BillLineItem } from "../../../data/aoeTypes";
import { buildAoeInstanceQueue } from "../aoeInstanceQueue";
import { indexAnswers, validateBillAoe } from "../aoeValidation";

function makeLineItem(
  id: string,
  sortIndex: number,
  overrides: Partial<BillLineItem> = {},
): BillLineItem {
  return {
    id,
    testId: "test-ammonia",
    testName: "Ammonia",
    testCode: "BIOC012",
    qty: 1,
    price: 0,
    concession: 0,
    hasAoe: true,
    sortIndex,
    ...overrides,
  };
}

function fillRequiredAnswers(lineItemId: string, instanceIndex = 1): AoeAnswer[] {
  return [
    "ammonia-s1-q1",
    "ammonia-s1-q2",
    "ammonia-s1-q3",
    "ammonia-s2-q1",
    "ammonia-s2-q2",
    "ammonia-s2-q3",
    "ammonia-s2-q4",
    "ammonia-s2-q5",
  ].map((questionId, index) => ({
    billId: "bill-1",
    lineItemId,
    instanceIndex,
    testId: "test-ammonia",
    formId: "aoe-ammonia",
    sectionId: index < 3 ? "ammonia-section-1" : "ammonia-section-2",
    questionId,
    value: "filled",
  }));
}

describe("aoeValidation", () => {
  it("blocks completion when mandatory answers are missing", () => {
    const lineItems = [makeLineItem("li-1", 0, { qty: 2 })];
    const status = validateBillAoe(lineItems, "ONCE_PER_TEST_INSTANCE", []);
    expect(status.complete).toBe(false);
    expect(status.pending.length).toBeGreaterThan(0);
  });

  it("returns instance-specific validation messages", () => {
    const lineItems = [makeLineItem("li-1", 0, { qty: 2 })];
    const answers = fillRequiredAnswers("li-1", 1);
    const status = validateBillAoe(lineItems, "ONCE_PER_TEST_INSTANCE", answers);
    expect(status.complete).toBe(false);
    expect(status.pending[0].message).toBe(
      "Ammonia (Instance 2 of 2) has required AOE information pending.",
    );
  });

  it("marks bill complete when all required instances are filled", () => {
    const lineItems = [makeLineItem("li-1", 0, { qty: 2 })];
    const answers = [
      ...fillRequiredAnswers("li-1", 1),
      ...fillRequiredAnswers("li-1", 2),
    ];
    const status = validateBillAoe(lineItems, "ONCE_PER_TEST_INSTANCE", answers);
    expect(status.complete).toBe(true);
  });

  it("uses shared answers for duplicate tests in ONCE_PER_TEST mode", () => {
    const lineItems = [makeLineItem("li-1", 0), makeLineItem("li-2", 1)];
    const answers = fillRequiredAnswers("li-1", 1);
    const status = validateBillAoe(lineItems, "ONCE_PER_TEST", answers);
    expect(status.complete).toBe(true);

    const steps = buildAoeInstanceQueue(lineItems, "ONCE_PER_TEST");
    expect(steps.every((step) => step.anchorLineItemId === "li-1")).toBe(true);
    expect(indexAnswers(answers).size).toBe(8);
  });
});
