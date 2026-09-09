import { afterEach, beforeEach, describe, expect, it } from "vitest";
import type { BillLineItem } from "../../../data/aoeTypes";
import { createBillLineItem, findCatalogTest } from "../../../data/billTests";
import {
  addTestToBill,
  handleRemoveLineItemWithAoeCleanup,
} from "../aoeLifecycle";
import { buildAoeInstanceQueue } from "../aoeInstanceQueue";
import {
  clearMemoryAoeStore,
  getBillAoeAnswersInStore,
  upsertAoeAnswerInStore,
  useMemoryAoeStore,
} from "../aoeResponseStore";

const labId = 1;
const billId = "bill-draft";

function ammoniaItem(id: string, sortIndex: number, qty = 1): BillLineItem {
  const catalog = findCatalogTest("test-ammonia");
  if (!catalog) throw new Error("missing catalog");
  return { ...createBillLineItem(catalog, sortIndex), id, qty };
}

describe("aoeLifecycle", () => {
  beforeEach(() => {
    useMemoryAoeStore();
  });

  afterEach(() => {
    clearMemoryAoeStore();
  });

  it("creates pending instances for each qty unit when adding a test with qty > 1", () => {
    const items = [ammoniaItem("li-1", 0, 3)];
    const steps = buildAoeInstanceQueue(items, "ONCE_PER_TEST_INSTANCE");
    expect(steps.filter((step) => step.sectionIndex === 0)).toHaveLength(3);
  });

  it("creates a new pending instance when adding duplicate test row", () => {
    let items = [ammoniaItem("li-1", 0)];
    items = addTestToBill(items, "test-ammonia");

    const steps = buildAoeInstanceQueue(items, "ONCE_PER_TEST_INSTANCE");
    expect(steps.filter((step) => step.sectionIndex === 0)).toHaveLength(2);
  });

  it("does not add another AOE queue entry when adding duplicate in ONCE_PER_TEST mode", () => {
    let items = [ammoniaItem("li-1", 0)];
    items = addTestToBill(items, "test-ammonia");

    const steps = buildAoeInstanceQueue(items, "ONCE_PER_TEST");
    expect(steps.filter((step) => step.sectionIndex === 0)).toHaveLength(1);
  });

  it("removes only the deleted row's answers", () => {
    let items = [ammoniaItem("li-1", 0), ammoniaItem("li-2", 1)];
    upsertAoeAnswerInStore(labId, billId, items, {
      billId,
      lineItemId: "li-1",
      instanceIndex: 1,
      testId: "test-ammonia",
      formId: "aoe-ammonia",
      sectionId: "ammonia-section-1",
      questionId: "ammonia-s1-q1",
      value: "one",
    });
    upsertAoeAnswerInStore(labId, billId, items, {
      billId,
      lineItemId: "li-2",
      instanceIndex: 1,
      testId: "test-ammonia",
      formId: "aoe-ammonia",
      sectionId: "ammonia-section-1",
      questionId: "ammonia-s1-q1",
      value: "two",
    });

    items = handleRemoveLineItemWithAoeCleanup(labId, billId, items, "li-1");
    const answers = getBillAoeAnswersInStore(labId, billId, items);
    expect(items).toHaveLength(1);
    expect(answers).toHaveLength(1);
    expect(answers[0].lineItemId).toBe("li-2");
    expect(answers[0].value).toBe("two");
  });
});
