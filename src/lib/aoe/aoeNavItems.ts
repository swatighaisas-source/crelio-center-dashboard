import type { AoeNavigationStep } from "../../data/aoeTypes";
import { getInstanceLabel } from "./aoeInstanceQueue";

export interface AoeNavItem {
  id: string;
  lineItemId: string;
  instanceIndex: number;
  testId: string;
  testName: string;
  instanceNumber: number;
  instanceTotal: number;
  label: string;
  stepIndex: number;
}

/** Label for left navigation in AOE Responses view. */
export function formatAoeNavLabel(
  testName: string,
  instanceNumber: number,
  instanceTotal: number,
): string {
  const instanceLabel = getInstanceLabel(instanceNumber, instanceTotal);
  if (!instanceLabel) return testName;
  return `${testName} ${instanceLabel}`;
}

/** One nav entry per test instance (first section step). */
export function buildAoeNavItems(steps: AoeNavigationStep[]): AoeNavItem[] {
  const items: AoeNavItem[] = [];
  const seen = new Set<string>();

  steps.forEach((step, stepIndex) => {
    if (step.sectionIndex !== 0) return;
    const key = `${step.lineItemId}#${step.instanceIndex}`;
    if (seen.has(key)) return;
    seen.add(key);

    items.push({
      id: key,
      lineItemId: step.lineItemId,
      instanceIndex: step.instanceIndex,
      testId: step.testId,
      testName: step.testName,
      instanceNumber: step.instanceNumber,
      instanceTotal: step.instanceTotal,
      label: formatAoeNavLabel(
        step.testName,
        step.instanceNumber,
        step.instanceTotal,
      ),
      stepIndex,
    });
  });

  return items;
}

export function getStepsForNavItem(
  steps: AoeNavigationStep[],
  item: AoeNavItem,
): AoeNavigationStep[] {
  return steps.filter(
    (step) =>
      step.lineItemId === item.lineItemId &&
      step.instanceIndex === item.instanceIndex,
  );
}
