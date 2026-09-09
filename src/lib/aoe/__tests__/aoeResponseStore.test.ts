import { afterEach, beforeEach, describe, expect, it } from "vitest";
import type { AoeAnswer, BillLineItem } from "../../../data/aoeTypes";
import {
  clearMemoryAoeStore,
  copyBillAoeAnswers,
  getBillAoeAnswersInStore,
  migrateLegacyAnswers,
  removeAoeAnswersForLineItemInStore,
  saveBillAoeAnswers,
  upsertAoeAnswerInStore,
  useMemoryAoeStore,
} from "../aoeResponseStore";

const labId = 1;
const billId = "bill-100";

function makeLineItem(id: string, sortIndex: number, testId = "test-ammonia"): BillLineItem {
  return {
    id,
    testId,
    testName: "Ammonia",
    testCode: "BIOC012",
    qty: 1,
    price: 0,
    concession: 0,
    hasAoe: true,
    sortIndex,
  };
}

function makeAnswer(
  lineItemId: string,
  questionId: string,
  value: string,
  instanceIndex = 1,
): AoeAnswer {
  return {
    billId,
    lineItemId,
    instanceIndex,
    testId: "test-ammonia",
    formId: "aoe-ammonia",
    sectionId: "ammonia-section-1",
    questionId,
    value,
  };
}

describe("aoeResponseStore", () => {
  beforeEach(() => {
    useMemoryAoeStore();
  });

  afterEach(() => {
    clearMemoryAoeStore();
  });

  it("stores answers separately per lineItemId and instanceIndex", () => {
    const lineItems = [makeLineItem("li-1", 0)];
    upsertAoeAnswerInStore(labId, billId, lineItems, makeAnswer("li-1", "q1", "alpha", 1));
    upsertAoeAnswerInStore(labId, billId, lineItems, makeAnswer("li-1", "q1", "beta", 2));

    const answers = getBillAoeAnswersInStore(labId, billId, lineItems);
    expect(answers).toHaveLength(2);
    expect(answers.find((a) => a.instanceIndex === 1)?.value).toBe("alpha");
    expect(answers.find((a) => a.instanceIndex === 2)?.value).toBe("beta");
  });

  it("removes only the targeted line item answers", () => {
    const lineItems = [makeLineItem("li-1", 0), makeLineItem("li-2", 1)];
    upsertAoeAnswerInStore(labId, billId, lineItems, makeAnswer("li-1", "q1", "alpha"));
    upsertAoeAnswerInStore(labId, billId, lineItems, makeAnswer("li-2", "q1", "beta"));

    removeAoeAnswersForLineItemInStore(labId, billId, lineItems, "li-1");
    const answers = getBillAoeAnswersInStore(labId, billId, lineItems);
    expect(answers).toHaveLength(1);
    expect(answers[0].lineItemId).toBe("li-2");
  });

  it("migrates legacy answers without lineItemId to first matching row", () => {
    const lineItems = [makeLineItem("li-1", 0), makeLineItem("li-2", 1)];
    saveBillAoeAnswers(labId, billId, [
      {
        billId,
        lineItemId: "",
        instanceIndex: 1,
        testId: "test-ammonia",
        formId: "aoe-ammonia",
        sectionId: "ammonia-section-1",
        questionId: "q1",
        value: "legacy",
      },
    ]);

    const migrated = migrateLegacyAnswers(
      [
        {
          billId,
          testId: "test-ammonia",
          formId: "aoe-ammonia",
          sectionId: "ammonia-section-1",
          questionId: "q1",
          value: "legacy",
        },
      ],
      lineItems,
    );
    expect(migrated[0].lineItemId).toBe("li-1");
    expect(migrated[0].instanceIndex).toBe(1);
    expect(migrated[0].value).toBe("legacy");
  });

  it("copies draft bill AOE answers onto a confirmed order bill id", () => {
    const lineItems = [makeLineItem("li-1", 0)];
    saveBillAoeAnswers(labId, "draft--1", [makeAnswer("li-1", "q1", "from-bill")]);

    const copied = copyBillAoeAnswers(labId, "draft--1", "922640");
    expect(copied).toHaveLength(1);
    expect(copied[0].billId).toBe("922640");
    expect(copied[0].value).toBe("from-bill");

    const onOrder = getBillAoeAnswersInStore(labId, "922640", lineItems);
    expect(onOrder).toHaveLength(1);
    expect(onOrder[0].lineItemId).toBe("li-1");
    expect(onOrder[0].value).toBe("from-bill");
  });
});
