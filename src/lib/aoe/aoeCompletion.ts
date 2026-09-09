import type {
  AoeAnswer,
  AoeCaptureFrequency,
  BillLineItem,
} from "../../data/aoeTypes";
import { buildAoeInstanceQueue } from "./aoeInstanceQueue";
import { validateBillAoe } from "./aoeValidation";

export type AoeFrequencyInput =
  | AoeCaptureFrequency
  | ((testId: string) => AoeCaptureFrequency);

export function isBillAoeComplete(
  lineItems: BillLineItem[],
  frequency: AoeFrequencyInput,
  answers: AoeAnswer[],
): boolean {
  return validateBillAoe(lineItems, frequency, answers).complete;
}

export function billRequiresAoe(lineItems: BillLineItem[]): boolean {
  return lineItems.some((item) => item.hasAoe);
}

export function getAoeStepCount(
  lineItems: BillLineItem[],
  frequency: AoeFrequencyInput,
): number {
  return buildAoeInstanceQueue(lineItems, frequency).length;
}

export function getAoeCompletionMessage(
  lineItems: BillLineItem[],
  frequency: AoeFrequencyInput,
  answers: AoeAnswer[],
): string {
  const status = validateBillAoe(lineItems, frequency, answers);
  if (status.complete) {
    const stepCount = getAoeStepCount(lineItems, frequency);
    if (stepCount === 0) return "No AOE information required for this bill.";
    return "All required AOE information has been saved.";
  }
  const count = status.pending.length;
  if (count === 1) return status.pending[0].message;
  return `${count} test instances have required AOE information pending.`;
}
