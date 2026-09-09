import { describe, expect, it } from "vitest";
import type { BillLineItem } from "../../../data/aoeTypes";
import { AMMONIA_AOE_FORM, DENGUE_NS1_AOE_FORM } from "../../../data/billTests";
import { buildAoeInstanceQueue } from "../aoeInstanceQueue";
import { buildAoeNavItems, formatAoeNavLabel } from "../aoeNavItems";

function makeLineItem(
  id: string,
  testId: string,
  sortIndex: number,
  qty = 1,
): BillLineItem {
  return {
    id,
    testId,
    testName: testId === "test-ammonia" ? "Ammonia" : "Dengue NS1",
    testCode: "CODE",
    qty,
    price: 0,
    concession: 0,
    hasAoe: true,
    sortIndex,
  };
}

const formLookup = (testId: string) => {
  if (testId === "test-ammonia") return AMMONIA_AOE_FORM;
  if (testId === "test-dengue-ns1") return DENGUE_NS1_AOE_FORM;
  return undefined;
};

describe("aoeNavItems", () => {
  it("shows test name only for a single instance", () => {
    expect(formatAoeNavLabel("Ammonia", 1, 1)).toBe("Ammonia");
  });

  it("shows instance labels in left nav when qty > 1", () => {
    const lineItems = [makeLineItem("li-1", "test-ammonia", 0, 3)];
    const steps = buildAoeInstanceQueue(lineItems, "ONCE_PER_TEST_INSTANCE", formLookup);
    const navItems = buildAoeNavItems(steps);

    expect(navItems).toHaveLength(3);
    expect(navItems[0].label).toBe("Ammonia (Instance 1 of 3)");
    expect(navItems[1].label).toBe("Ammonia (Instance 2 of 3)");
    expect(navItems[2].label).toBe("Ammonia (Instance 3 of 3)");
  });

  it("lists ammonia instances before dengue in bill order", () => {
    const lineItems = [
      makeLineItem("li-1", "test-ammonia", 0, 2),
      makeLineItem("li-2", "test-dengue-ns1", 1, 1),
    ];
    const steps = buildAoeInstanceQueue(lineItems, "ONCE_PER_TEST_INSTANCE", formLookup);
    const navItems = buildAoeNavItems(steps);

    expect(navItems.map((item) => item.label)).toEqual([
      "Ammonia (Instance 1 of 2)",
      "Ammonia (Instance 2 of 2)",
      "Dengue NS1",
    ]);
  });
});
