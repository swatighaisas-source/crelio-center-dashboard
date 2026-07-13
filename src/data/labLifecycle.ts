import type { PrimaryTabId } from "../components/PrimaryTabs";

export type LabLifecycleState = "onboarding" | "live" | "trial" | "shutdown";

export type LabDetailStatus = "Onboarding" | "Live" | "Trial" | "Shut down";

const LIFECYCLE_PRIMARY_TABS = ["Onboarding", "Live", "Trial", "Shutdown"] as const;

export type LifecyclePrimaryTabId = (typeof LIFECYCLE_PRIMARY_TABS)[number];

export const PRIMARY_TAB_TO_LIFECYCLE: Record<LifecyclePrimaryTabId, LabLifecycleState> = {
  Onboarding: "onboarding",
  Live: "live",
  Trial: "trial",
  Shutdown: "shutdown",
};

export function isLifecyclePrimaryTab(tab: PrimaryTabId): tab is LifecyclePrimaryTabId {
  return (LIFECYCLE_PRIMARY_TABS as readonly string[]).includes(tab);
}

export function lifecycleDisplayLabel(state: LabLifecycleState): string {
  switch (state) {
    case "onboarding":
      return "Onboarding";
    case "live":
      return "Live";
    case "trial":
      return "Trial";
    case "shutdown":
      return "Shut down";
  }
}

export function lifecycleDetailStatus(state: LabLifecycleState): LabDetailStatus {
  return lifecycleDisplayLabel(state) as LabDetailStatus;
}

export function filterLabsForPrimaryTab<T extends { lifecycleState: LabLifecycleState }>(
  labs: T[],
  tab: PrimaryTabId,
): T[] {
  if (!isLifecyclePrimaryTab(tab)) return labs;
  const state = PRIMARY_TAB_TO_LIFECYCLE[tab];
  return labs.filter((lab) => lab.lifecycleState === state);
}

export function computeLabsSummary(labs: { mrr: number }[]) {
  const totalMrrInr = labs.reduce((sum, l) => sum + l.mrr, 0);
  return {
    totalCount: labs.length,
    totalMrrInr,
    totalMrrUsd: Math.round(totalMrrInr / 102.7),
    rows: labs.length,
  };
}

export function countLabsByLifecycleState(
  labs: { lifecycleState: LabLifecycleState }[],
): Record<LabLifecycleState, number> {
  return labs.reduce(
    (acc, lab) => {
      acc[lab.lifecycleState] += 1;
      return acc;
    },
    { onboarding: 0, live: 0, trial: 0, shutdown: 0 } satisfies Record<LabLifecycleState, number>,
  );
}
