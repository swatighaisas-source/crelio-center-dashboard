import { describe, expect, it } from "vitest";
import type { BillLineItem } from "../../../data/aoeTypes";
import { AMMONIA_AOE_FORM, DENGUE_NS1_AOE_FORM } from "../../../data/billTests";
import {
  buildAoeInstanceQueue,
  formatSectionTitle,
  formatTestHeader,
  getInstanceLabel,
} from "../aoeInstanceQueue";

function makeLineItem(
  overrides: Partial<BillLineItem> & Pick<BillLineItem, "id" | "testId" | "sortIndex">,
): BillLineItem {
  const isAoe = overrides.hasAoe ?? overrides.testId !== "test-cbc";
  return {
    testName:
      overrides.testId === "test-ammonia"
        ? "Ammonia"
        : overrides.testId === "test-dengue-ns1"
          ? "Dengue NS1"
          : "Test",
    testCode: "CODE",
    qty: 1,
    price: 0,
    concession: 0,
    hasAoe: isAoe,
    ...overrides,
  };
}

const formLookup = (testId: string) => {
  if (testId === "test-ammonia") return AMMONIA_AOE_FORM;
  if (testId === "test-dengue-ns1") return DENGUE_NS1_AOE_FORM;
  return undefined;
};

describe("buildAoeInstanceQueue", () => {
  it("returns no steps when no AOE tests are on the bill", () => {
    const items = [
      makeLineItem({ id: "li-1", testId: "test-cbc", sortIndex: 0, hasAoe: false }),
    ];
    expect(buildAoeInstanceQueue(items, "ONCE_PER_TEST_INSTANCE", formLookup)).toEqual([]);
  });

  it("does not show instance label for a single qty=1 occurrence", () => {
    const items = [makeLineItem({ id: "li-1", testId: "test-ammonia", sortIndex: 0 })];
    const steps = buildAoeInstanceQueue(items, "ONCE_PER_TEST_INSTANCE", formLookup);
    expect(steps[0].instanceTotal).toBe(1);
    expect(getInstanceLabel(steps[0].instanceNumber, steps[0].instanceTotal)).toBe("");
    expect(formatTestHeader("Ammonia", "")).toBe("(Test Level): Ammonia — AOE for Ammonia");
  });

  it("shows Instance 1 of N for the first qty slot when qty > 1", () => {
    const items = [
      makeLineItem({ id: "li-1", testId: "test-ammonia", sortIndex: 0, qty: 3 }),
    ];
    const steps = buildAoeInstanceQueue(items, "ONCE_PER_TEST_INSTANCE", formLookup);
    const firstInstanceSteps = steps.filter((step) => step.instanceNumber === 1);
    expect(firstInstanceSteps[0].instanceTotal).toBe(3);
    expect(getInstanceLabel(1, 3)).toBe("(Instance 1 of 3)");
    expect(formatTestHeader("Ammonia", "(Instance 1 of 3)")).toContain("Instance 1 of 3");
  });

  it("expands steps by qty — each qty unit gets a full section flow", () => {
    const items = [
      makeLineItem({ id: "li-1", testId: "test-ammonia", sortIndex: 0, qty: 3 }),
    ];
    const steps = buildAoeInstanceQueue(items, "ONCE_PER_TEST_INSTANCE", formLookup);
    expect(steps).toHaveLength(6);
    const instanceStarts = steps.filter((step) => step.sectionIndex === 0);
    expect(instanceStarts.map((step) => step.instanceNumber)).toEqual([1, 2, 3]);
  });

  it("dedupes by testId in ONCE_PER_TEST mode", () => {
    const items = [
      makeLineItem({ id: "li-1", testId: "test-ammonia", sortIndex: 0 }),
      makeLineItem({ id: "li-2", testId: "test-ammonia", sortIndex: 1 }),
    ];
    const oncePerTest = buildAoeInstanceQueue(items, "ONCE_PER_TEST", formLookup);
    const oncePerInstance = buildAoeInstanceQueue(items, "ONCE_PER_TEST_INSTANCE", formLookup);

    expect(oncePerTest).toHaveLength(2);
    expect(oncePerInstance).toHaveLength(4);
    expect(oncePerTest.every((step) => step.instanceTotal === 1)).toBe(true);
  });

  it("asks AOE only once for qty > 1 when frequency is ONCE_PER_TEST", () => {
    const items = [
      makeLineItem({ id: "li-1", testId: "test-ammonia", sortIndex: 0, qty: 3 }),
    ];
    const steps = buildAoeInstanceQueue(items, "ONCE_PER_TEST", formLookup);
    const uniqueInstances = new Set(
      steps.map((step) => `${step.lineItemId}:${step.instanceIndex}`),
    );
    expect(uniqueInstances.size).toBe(1);
    expect(steps[0].instanceTotal).toBe(1);
    expect(getInstanceLabel(steps[0].instanceNumber, steps[0].instanceTotal)).toBe("");
    expect(formatTestHeader("Ammonia", "")).not.toContain("Instance");
  });

  it("orders ammonia instances before dengue in bill-line order", () => {
    const items = [
      makeLineItem({ id: "li-1", testId: "test-ammonia", sortIndex: 0, qty: 2 }),
      makeLineItem({ id: "li-2", testId: "test-dengue-ns1", sortIndex: 1 }),
    ];
    const steps = buildAoeInstanceQueue(items, "ONCE_PER_TEST_INSTANCE", formLookup);
    const instanceStarts = steps.filter((step) => step.sectionIndex === 0);
    expect(instanceStarts.map((step) => step.testId)).toEqual([
      "test-ammonia",
      "test-ammonia",
      "test-dengue-ns1",
    ]);
    expect(formatSectionTitle("Ammonia", "(Instance 2 of 2)", 1)).toBe(
      "Ammonia (Instance 2 of 2) | Section 1",
    );
  });
});
