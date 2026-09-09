import { describe, expect, it } from "vitest";
import type { BillLineItem } from "../../../data/aoeTypes";
import { AMMONIA_AOE_FORM } from "../../../data/billTests";
import { buildAoeInstanceQueue } from "../aoeInstanceQueue";
import {
  createNavigationState,
  getCurrentStep,
  goToNextStep,
  goToPreviousStep,
  isCrossInstanceTransition,
} from "../aoeNavigation";

function makeLineItem(
  id: string,
  sortIndex: number,
  qty = 1,
): BillLineItem {
  return {
    id,
    testId: "test-ammonia",
    testName: "Ammonia",
    testCode: "BIOC012",
    qty,
    price: 0,
    concession: 0,
    hasAoe: true,
    sortIndex,
  };
}

const formLookup = (testId: string) =>
  testId === "test-ammonia" ? AMMONIA_AOE_FORM : undefined;

describe("aoeNavigation", () => {
  it("navigates across sections within an instance", () => {
    const lineItems = [makeLineItem("li-1", 0)];
    const steps = buildAoeInstanceQueue(lineItems, "ONCE_PER_TEST_INSTANCE", formLookup);
    expect(steps).toHaveLength(2);

    let index = 0;
    expect(createNavigationState(index, steps.length).primaryAction).toBe("next");
    index = goToNextStep(index, steps.length);
    expect(getCurrentStep(steps, index)?.sectionIndex).toBe(1);
    expect(createNavigationState(index, steps.length).primaryAction).toBe("save_close");
  });

  it("navigates from final section of qty instance 1 to first section of instance 2", () => {
    const lineItems = [makeLineItem("li-1", 0, 2)];
    const steps = buildAoeInstanceQueue(lineItems, "ONCE_PER_TEST_INSTANCE", formLookup);

    const firstInstanceLastSectionIndex = steps.findIndex(
      (step) => step.instanceIndex === 1 && step.sectionIndex === 1,
    );
    const nextIndex = goToNextStep(firstInstanceLastSectionIndex, steps.length);
    const nextStep = getCurrentStep(steps, nextIndex);

    expect(nextStep?.instanceIndex).toBe(2);
    expect(nextStep?.sectionIndex).toBe(0);
    expect(
      isCrossInstanceTransition(
        steps[firstInstanceLastSectionIndex],
        steps[nextIndex],
      ),
    ).toBe(true);
  });

  it("returns to prior instance final section when going previous from instance start", () => {
    const lineItems = [makeLineItem("li-1", 0, 2)];
    const steps = buildAoeInstanceQueue(lineItems, "ONCE_PER_TEST_INSTANCE", formLookup);
    const secondInstanceFirstSectionIndex = steps.findIndex(
      (step) => step.instanceIndex === 2 && step.sectionIndex === 0,
    );

    const previousIndex = goToPreviousStep(secondInstanceFirstSectionIndex);
    const previousStep = getCurrentStep(steps, previousIndex);
    expect(previousStep?.instanceIndex).toBe(1);
    expect(previousStep?.sectionIndex).toBe(1);
  });
});
