import type { AoeNavigationStep } from "../../data/aoeTypes";

export interface AoeNavigationState {
  stepIndex: number;
  totalSteps: number;
  isFirstStep: boolean;
  isLastStep: boolean;
  canGoPrevious: boolean;
  canGoNext: boolean;
  primaryAction: "next" | "save_close";
}

export function createNavigationState(
  stepIndex: number,
  totalSteps: number,
): AoeNavigationState {
  const isFirstStep = stepIndex === 0;
  const isLastStep = stepIndex >= totalSteps - 1;

  return {
    stepIndex,
    totalSteps,
    isFirstStep,
    isLastStep,
    canGoPrevious: totalSteps > 0 && !isFirstStep,
    canGoNext: totalSteps > 0 && !isLastStep,
    primaryAction: isLastStep ? "save_close" : "next",
  };
}

export function goToPreviousStep(stepIndex: number): number {
  return Math.max(0, stepIndex - 1);
}

export function goToNextStep(stepIndex: number, totalSteps: number): number {
  return Math.min(totalSteps - 1, stepIndex + 1);
}

export function getCurrentStep(
  steps: AoeNavigationStep[],
  stepIndex: number,
): AoeNavigationStep | undefined {
  return steps[stepIndex];
}

export function isCrossInstanceTransition(
  fromStep: AoeNavigationStep,
  toStep: AoeNavigationStep,
): boolean {
  return (
    fromStep.lineItemId !== toStep.lineItemId ||
    fromStep.instanceIndex !== toStep.instanceIndex
  );
}

export function isCrossSectionTransition(
  fromStep: AoeNavigationStep,
  toStep: AoeNavigationStep,
): boolean {
  return (
    fromStep.lineItemId === toStep.lineItemId &&
    fromStep.sectionIndex !== toStep.sectionIndex
  );
}
