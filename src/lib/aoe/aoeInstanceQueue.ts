import type {
  AoeCaptureFrequency,
  AoeFormDefinition,
  AoeNavigationStep,
  BillLineItem,
} from "../../data/aoeTypes";
import { getAoeFormForTest } from "../../data/billTests";

export interface ExpandedAoeInstance {
  lineItemId: string;
  instanceIndex: number;
  testId: string;
  testName: string;
  sortIndex: number;
}

/**
 * Expand bill rows into AOE instances. Each qty unit on a row is one instance.
 * Only rows with hasAoe are included.
 */
export function expandBillItemsToAoeInstances(
  lineItems: BillLineItem[],
): ExpandedAoeInstance[] {
  const sorted = [...lineItems].sort((a, b) => a.sortIndex - b.sortIndex);
  const instances: ExpandedAoeInstance[] = [];

  for (const item of sorted) {
    if (!item.hasAoe) continue;
    const qty = Math.max(1, item.qty);
    for (let instanceIndex = 1; instanceIndex <= qty; instanceIndex += 1) {
      instances.push({
        lineItemId: item.id,
        instanceIndex,
        testId: item.testId,
        testName: item.testName,
        sortIndex: item.sortIndex,
      });
    }
  }

  return instances;
}

/** Total AOE instance count for a testId (sum of qty across AOE rows). */
export function countTestInstanceTotal(
  lineItems: BillLineItem[],
  testId: string,
): number {
  return lineItems
    .filter((item) => item.hasAoe && item.testId === testId)
    .reduce((sum, item) => sum + Math.max(1, item.qty), 0);
}

function assignGlobalInstanceNumbers(
  instances: ExpandedAoeInstance[],
): Map<string, { instanceNumber: number; instanceTotal: number }> {
  const totalsByTest = new Map<string, number>();
  for (const instance of instances) {
    totalsByTest.set(
      instance.testId,
      (totalsByTest.get(instance.testId) ?? 0) + 1,
    );
  }

  const counters = new Map<string, number>();
  const result = new Map<string, { instanceNumber: number; instanceTotal: number }>();

  for (const instance of instances) {
    const next = (counters.get(instance.testId) ?? 0) + 1;
    counters.set(instance.testId, next);
    const key = instanceKey(instance.lineItemId, instance.instanceIndex);
    result.set(key, {
      instanceNumber: next,
      instanceTotal: totalsByTest.get(instance.testId) ?? 1,
    });
  }

  return result;
}

export function instanceKey(lineItemId: string, instanceIndex: number): string {
  return `${lineItemId}#${instanceIndex}`;
}

/** Instance label; shown for every instance when total > 1 (including Instance 1 of N). */
export function getInstanceLabel(
  instanceNumber: number,
  instanceTotal: number,
): string {
  if (instanceTotal <= 1) return "";
  return `(Instance ${instanceNumber} of ${instanceTotal})`;
}

export function formatTestHeader(testName: string, instanceLabel: string): string {
  const suffix = instanceLabel ? ` ${instanceLabel}` : "";
  return `(Test Level): ${testName} — AOE for ${testName}${suffix}`;
}

export function formatSectionTitle(
  testName: string,
  instanceLabel: string,
  sectionNumber: number,
): string {
  if (instanceLabel) {
    return `${testName} ${instanceLabel} | Section ${sectionNumber}`;
  }
  return `${testName} Section-${sectionNumber}`;
}

/** First line item for testId in bill order — anchor for ONCE_PER_TEST mode. */
export function getAnchorLineItemId(
  lineItems: BillLineItem[],
  testId: string,
): string | undefined {
  const sorted = [...lineItems]
    .filter((item) => item.hasAoe && item.testId === testId)
    .sort((a, b) => a.sortIndex - b.sortIndex);
  return sorted[0]?.id;
}

function buildStepsForExpandedInstance(
  instance: ExpandedAoeInstance,
  globalNumbers: Map<string, { instanceNumber: number; instanceTotal: number }>,
  form: AoeFormDefinition,
  anchorLineItemId: string,
  anchorInstanceIndex: number,
): AoeNavigationStep[] {
  const numbers = globalNumbers.get(
    instanceKey(instance.lineItemId, instance.instanceIndex),
  ) ?? { instanceNumber: 1, instanceTotal: 1 };

  return form.sections.map((section, sectionIndex) => ({
    lineItemId: instance.lineItemId,
    instanceIndex: instance.instanceIndex,
    anchorLineItemId,
    anchorInstanceIndex,
    testId: instance.testId,
    testName: instance.testName,
    formId: form.formId,
    instanceNumber: numbers.instanceNumber,
    instanceTotal: numbers.instanceTotal,
    sectionIndex,
    sectionId: section.id,
    sectionTitle: section.title,
    totalSections: form.sections.length,
  }));
}

/**
 * Build ordered AOE navigation steps.
 * - ONCE_PER_TEST: one flow per unique AOE test (first row, qty slot 1).
 * - ONCE_PER_TEST_INSTANCE: one flow per qty unit on each AOE row, in bill-line order.
 *
 * `frequency` may be a single lab/default value or a per-test resolver.
 */
export function buildAoeInstanceQueue(
  lineItems: BillLineItem[],
  frequency: AoeCaptureFrequency | ((testId: string) => AoeCaptureFrequency),
  formLookup: (testId: string) => AoeFormDefinition | undefined = getAoeFormForTest,
): AoeNavigationStep[] {
  const resolveFrequency =
    typeof frequency === "function" ? frequency : () => frequency;
  const expanded = expandBillItemsToAoeInstances(lineItems);
  const globalNumbers = assignGlobalInstanceNumbers(expanded);
  const steps: AoeNavigationStep[] = [];
  const seenTests = new Set<string>();

  for (const instance of expanded) {
    const form = formLookup(instance.testId);
    if (!form) continue;

    if (resolveFrequency(instance.testId) === "ONCE_PER_TEST") {
      if (seenTests.has(instance.testId)) continue;
      seenTests.add(instance.testId);
      const anchorId = getAnchorLineItemId(lineItems, instance.testId) ?? instance.lineItemId;
      const anchorInstance = { ...instance, lineItemId: anchorId, instanceIndex: 1 };
      steps.push(
        ...buildStepsForExpandedInstance(
          anchorInstance,
          globalNumbers,
          form,
          anchorId,
          1,
        ).map((step) => ({
          ...step,
          instanceNumber: 1,
          instanceTotal: 1,
        })),
      );
    } else {
      steps.push(
        ...buildStepsForExpandedInstance(
          instance,
          globalNumbers,
          form,
          instance.lineItemId,
          instance.instanceIndex,
        ),
      );
    }
  }

  return steps;
}

export function formatPendingMessage(
  testName: string,
  instanceNumber: number,
  instanceTotal: number,
): string {
  const label = getInstanceLabel(instanceNumber, instanceTotal);
  const prefix = label ? `${testName} ${label}` : testName;
  return `${prefix} has required AOE information pending.`;
}
