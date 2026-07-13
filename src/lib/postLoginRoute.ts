import type { LabLifecycleState } from "../data/labLifecycle";

/** Lab used for demo / HUDU admin login landing */
export const DEFAULT_LOGIN_LAB_ID = 12923;

export function postLoginCenterPath(labId: number = DEFAULT_LOGIN_LAB_ID): string {
  return `/lab/${labId}/center`;
}

export function postLoginPath(labId: number, lifecycleState: LabLifecycleState): string {
  if (lifecycleState === "onboarding" || lifecycleState === "trial") {
    return `/lab/${labId}/center/onboarding`;
  }
  return `/lab/${labId}/center`;
}
