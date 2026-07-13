import {
  canCreateTask,
  canSendNotifications,
  canShareWithClient,
  canUseThreadedComments,
  type RolloutConfig,
} from "./inflow/rolloutConfig";

export interface LabWorkflowConfig {
  showNotifications: boolean;
  showActions: boolean;
}

export const DEFAULT_LAB_WORKFLOW_CONFIG: LabWorkflowConfig = {
  showNotifications: true,
  showActions: true,
};

export function resolveLabWorkflowConfig(
  config?: Partial<LabWorkflowConfig>,
): LabWorkflowConfig {
  return {
    showNotifications: config?.showNotifications ?? DEFAULT_LAB_WORKFLOW_CONFIG.showNotifications,
    showActions: config?.showActions ?? DEFAULT_LAB_WORKFLOW_CONFIG.showActions,
  };
}

/** Bridge lab workflow toggles with inflow rollout capabilities */
export function resolveWorkflowFromRollout(
  rollout: RolloutConfig,
  account?: string | null,
): LabWorkflowConfig {
  return {
    showNotifications: canSendNotifications(rollout, account),
    showActions: canSendNotifications(rollout, account),
  };
}

export {
  canCreateTask,
  canSendNotifications,
  canShareWithClient,
  canUseThreadedComments,
};
