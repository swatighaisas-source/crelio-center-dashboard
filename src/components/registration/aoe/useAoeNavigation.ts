import { useCallback, useMemo, useState } from "react";
import type {
  AoeAnswer,
  AoeCaptureFrequency,
  BillLineItem,
} from "../../../data/aoeTypes";
import { getAoeFormForTest } from "../../../data/billTests";
import {
  createNavigationState,
  getCurrentStep,
  goToNextStep,
  goToPreviousStep,
} from "../../../lib/aoe/aoeNavigation";
import { buildAoeInstanceQueue, getInstanceLabel } from "../../../lib/aoe/aoeInstanceQueue";
import {
  getBillAoeAnswers,
  resolveStorageAnchor,
  upsertAoeAnswer,
} from "../../../lib/aoe/aoeResponseStore";
import { validateBillAoe } from "../../../lib/aoe/aoeValidation";

interface UseAoeNavigationOptions {
  labId: number;
  billId: string;
  lineItems: BillLineItem[];
  frequency: AoeCaptureFrequency | ((testId: string) => AoeCaptureFrequency);
  onClose: () => void;
  onComplete?: () => void;
}

export function useAoeNavigation({
  labId,
  billId,
  lineItems,
  frequency,
  onClose,
  onComplete,
}: UseAoeNavigationOptions) {
  const resolveFrequency = useCallback(
    (testId: string) =>
      typeof frequency === "function" ? frequency(testId) : frequency,
    [frequency],
  );

  const steps = useMemo(
    () => buildAoeInstanceQueue(lineItems, resolveFrequency),
    [lineItems, resolveFrequency],
  );

  const [stepIndex, setStepIndex] = useState(0);
  const [answers, setAnswers] = useState<AoeAnswer[]>(() =>
    getBillAoeAnswers(labId, billId, lineItems),
  );
  const [validationError, setValidationError] = useState<string | null>(null);

  const navState = createNavigationState(stepIndex, steps.length);
  const currentStep = getCurrentStep(steps, stepIndex);

  const currentForm = currentStep
    ? getAoeFormForTest(currentStep.testId)
    : undefined;
  const currentSection = currentForm?.sections[currentStep?.sectionIndex ?? 0];

  const instanceLabel = currentStep
    ? getInstanceLabel(currentStep.instanceNumber, currentStep.instanceTotal)
    : "";

  const refreshAnswers = useCallback(() => {
    setAnswers(getBillAoeAnswers(labId, billId, lineItems));
  }, [labId, billId, lineItems]);

  const saveField = useCallback(
    (questionId: string, sectionId: string, value: string) => {
      if (!currentStep || !currentForm) return;

      const storage = resolveStorageAnchor(
        currentStep.lineItemId,
        currentStep.instanceIndex,
        currentStep.testId,
        lineItems,
        resolveFrequency(currentStep.testId),
      );

      const answer: AoeAnswer = {
        billId,
        lineItemId: storage.lineItemId,
        instanceIndex: storage.instanceIndex,
        testId: currentStep.testId,
        formId: currentForm.formId,
        sectionId,
        questionId,
        value,
      };

      upsertAoeAnswer(labId, billId, lineItems, answer);
      setAnswers(getBillAoeAnswers(labId, billId, lineItems));
    },
    [currentStep, currentForm, labId, billId, lineItems, resolveFrequency],
  );

  const getFieldValue = useCallback(
    (questionId: string): string => {
      if (!currentStep) return "";
      const storage = resolveStorageAnchor(
        currentStep.lineItemId,
        currentStep.instanceIndex,
        currentStep.testId,
        lineItems,
        resolveFrequency(currentStep.testId),
      );
      return (
        answers.find(
          (a) =>
            a.lineItemId === storage.lineItemId &&
            (a.instanceIndex ?? 1) === storage.instanceIndex &&
            a.questionId === questionId,
        )?.value ?? ""
      );
    },
    [answers, currentStep, lineItems, resolveFrequency],
  );

  const validateCurrentSection = useCallback((): boolean => {
    if (!currentStep || !currentSection) return true;

    const storage = resolveStorageAnchor(
      currentStep.lineItemId,
      currentStep.instanceIndex,
      currentStep.testId,
      lineItems,
      resolveFrequency(currentStep.testId),
    );

    for (const question of currentSection.questions) {
      if (!question.required) continue;
      const value = answers.find(
        (a) =>
          a.lineItemId === storage.lineItemId &&
          (a.instanceIndex ?? 1) === storage.instanceIndex &&
          a.questionId === question.id,
      )?.value;
      if (!value?.trim()) {
        const label = instanceLabel
          ? `${currentStep.testName} ${instanceLabel}`
          : currentStep.testName;
        setValidationError(`${label} has required AOE information pending.`);
        return false;
      }
    }
    setValidationError(null);
    return true;
  }, [currentStep, currentSection, answers, lineItems, resolveFrequency, instanceLabel]);

  const handlePrevious = useCallback(() => {
    setValidationError(null);
    setStepIndex((index) => goToPreviousStep(index));
  }, []);

  const handleNext = useCallback(() => {
    if (!validateCurrentSection()) return;
    setStepIndex((index) => goToNextStep(index, steps.length));
  }, [validateCurrentSection, steps.length]);

  const handleSaveClose = useCallback(() => {
    if (!validateCurrentSection()) return;

    const status = validateBillAoe(lineItems, resolveFrequency, answers);
    if (!status.complete) {
      setValidationError(status.pending[0]?.message ?? "AOE information is incomplete.");
      return;
    }

    onComplete?.();
    onClose();
  }, [
    validateCurrentSection,
    lineItems,
    resolveFrequency,
    answers,
    onComplete,
    onClose,
  ]);

  return {
    steps,
    stepIndex,
    navState,
    currentStep,
    currentForm,
    currentSection,
    instanceLabel,
    validationError,
    getFieldValue,
    saveField,
    handlePrevious,
    handleNext,
    handleSaveClose,
    refreshAnswers,
  };
}

export type AoeNavigationHook = ReturnType<typeof useAoeNavigation>;
