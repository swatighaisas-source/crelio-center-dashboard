import type {
  AoeAnswer,
  AoeBillStatus,
  AoeCaptureFrequency,
  AoeNavigationStep,
  BillLineItem,
  PendingAoeInstance,
} from "../../data/aoeTypes";
import { getAoeFormForTest } from "../../data/billTests";
import {
  buildAoeInstanceQueue,
  formatPendingMessage,
  getInstanceLabel,
} from "./aoeInstanceQueue";

function answerKey(
  lineItemId: string,
  instanceIndex: number,
  questionId: string,
): string {
  return `${lineItemId}::${instanceIndex}::${questionId}`;
}

export function indexAnswers(answers: AoeAnswer[]): Map<string, AoeAnswer> {
  const map = new Map<string, AoeAnswer>();
  for (const answer of answers) {
    map.set(
      answerKey(answer.lineItemId, answer.instanceIndex ?? 1, answer.questionId),
      answer,
    );
  }
  return map;
}

function isAnswerFilled(value: string | undefined): boolean {
  return Boolean(value?.trim());
}

export function validateStep(
  step: AoeNavigationStep,
  answerMap: Map<string, AoeAnswer>,
): PendingAoeInstance[] {
  const form = getAoeFormForTest(step.testId);
  if (!form) return [];

  const section = form.sections[step.sectionIndex];
  if (!section) return [];

  const pending: PendingAoeInstance[] = [];
  const missingRequired = section.questions.some(
    (question) =>
      question.required &&
      !isAnswerFilled(
        answerMap.get(
          answerKey(
            step.anchorLineItemId,
            step.anchorInstanceIndex,
            question.id,
          ),
        )?.value,
      ),
  );

  if (missingRequired) {
    pending.push({
      testName: step.testName,
      lineItemId: step.lineItemId,
      instanceIndex: step.instanceIndex,
      instanceNumber: step.instanceNumber,
      instanceTotal: step.instanceTotal,
      message: formatPendingMessage(
        step.testName,
        step.instanceNumber,
        step.instanceTotal,
      ),
    });
  }

  return pending;
}

export function validateAllSteps(
  steps: AoeNavigationStep[],
  answerMap: Map<string, AoeAnswer>,
): PendingAoeInstance[] {
  const seen = new Set<string>();
  const pending: PendingAoeInstance[] = [];

  for (const step of steps) {
    const dedupeKey = `${step.anchorLineItemId}:${step.anchorInstanceIndex}:${step.sectionIndex}`;
    if (seen.has(dedupeKey)) continue;
    seen.add(dedupeKey);

    for (const item of validateStep(step, answerMap)) {
      const itemKey = `${item.lineItemId}:${item.instanceIndex}:${item.instanceNumber}`;
      if (!pending.some((p) => `${p.lineItemId}:${p.instanceIndex}:${p.instanceNumber}` === itemKey)) {
        pending.push(item);
      }
    }
  }

  return pending;
}

export function validateBillAoe(
  lineItems: BillLineItem[],
  frequency: AoeCaptureFrequency | ((testId: string) => AoeCaptureFrequency),
  answers: AoeAnswer[],
): AoeBillStatus {
  const steps = buildAoeInstanceQueue(lineItems, frequency);
  if (steps.length === 0) {
    return { complete: true, pending: [] };
  }

  const answerMap = indexAnswers(answers);
  const pending = validateAllSteps(steps, answerMap);

  return {
    complete: pending.length === 0,
    pending,
  };
}

export function getValidationSummary(pending: PendingAoeInstance[]): string {
  if (pending.length === 0) return "";
  return pending[0].message;
}

export function formatInstanceDisplayName(
  testName: string,
  instanceNumber: number,
  instanceTotal: number,
): string {
  const label = getInstanceLabel(instanceNumber, instanceTotal);
  return label ? `${testName} ${label}` : testName;
}
