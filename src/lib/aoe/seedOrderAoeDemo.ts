import type { AoeAnswer, AoeCaptureFrequency, BillLineItem } from "../../data/aoeTypes";
import { getAoeFormForTest } from "../../data/billTests";
import { getBillAoeAnswers, saveBillAoeAnswers } from "./aoeResponseStore";

const DEMO_AMMONIA_INSTANCE_1: Record<string, string> = {
  "ammonia-s1-q1": "aa",
  "ammonia-s1-q2": "aa",
  "ammonia-s1-q3": "aa@gmail.com",
  "ammonia-s2-q1": "Aarhus, Denmark",
  "ammonia-s2-q2": "aa",
  "ammonia-s2-q3": "2026-09-01",
  "ammonia-s2-q4": "2026-09-02T15:00",
  "ammonia-s2-q5": "signed",
};

function buildAnswersForInstance(
  billId: string,
  lineItem: BillLineItem,
  instanceIndex: number,
  values: Record<string, string>,
): AoeAnswer[] {
  const form = getAoeFormForTest(lineItem.testId);
  if (!form) return [];

  const answers: AoeAnswer[] = [];
  for (const section of form.sections) {
    for (const question of section.questions) {
      const value = values[question.id];
      if (value === undefined) continue;
      answers.push({
        billId,
        lineItemId: lineItem.id,
        instanceIndex,
        testId: lineItem.testId,
        formId: form.formId,
        sectionId: section.id,
        questionId: question.id,
        value,
      });
    }
  }
  return answers;
}

function instanceCountForLineItem(
  lineItem: BillLineItem,
  frequency: AoeCaptureFrequency,
): number {
  if (frequency === "ONCE_PER_TEST") return 1;
  return Math.max(1, lineItem.qty);
}

/** Seed demo AOE answers for order history prototype when none exist. */
export function ensureDemoOrderAoeAnswers(
  labId: number,
  billId: string,
  lineItems: BillLineItem[],
  captureFrequency: AoeCaptureFrequency = "ONCE_PER_TEST_INSTANCE",
) {
  const existing = getBillAoeAnswers(labId, billId, lineItems);
  if (existing.length > 0) return;

  const answers: AoeAnswer[] = [];

  for (const lineItem of lineItems) {
    if (!lineItem.hasAoe) continue;

    if (lineItem.testId === "test-ammonia") {
      const instanceTotal = instanceCountForLineItem(lineItem, captureFrequency);
      for (let instanceIndex = 1; instanceIndex <= instanceTotal; instanceIndex += 1) {
        const suffix = instanceIndex === 1 ? "" : `-${instanceIndex}`;
        const values = Object.fromEntries(
          Object.entries(DEMO_AMMONIA_INSTANCE_1).map(([key, value]) => [
            key,
            key === "ammonia-s1-q1" ? `${value}${suffix}` : value,
          ]),
        );
        answers.push(
          ...buildAnswersForInstance(billId, lineItem, instanceIndex, values),
        );
      }
    }

    if (lineItem.testId === "test-dengue-ns1") {
      answers.push(
        ...buildAnswersForInstance(billId, lineItem, 1, {
          "dengue-s1-q1": "Outpatient collection",
          "dengue-s1-q2": "Fever for 2 days",
        }),
      );
    }
  }

  if (answers.length > 0) {
    saveBillAoeAnswers(labId, billId, answers);
  }
}
