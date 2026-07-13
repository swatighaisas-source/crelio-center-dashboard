import type { ExceptionKey } from "./mockOrders";
import { taskAssignees } from "./mockTasks";
import type { TaskUser, TaskVisibility } from "./mockTasks";

export type RolloutMode = "new" | "existing" | "transitioning";
export type ExperienceMode = "legacy" | "new";
export type CapabilityState = "on" | "off" | "selective";
export type ExceptionTaskMode = "on" | "off";

/** Who owns the action by default when it is created. */
export type DefaultAssigneeStrategy = "requester" | "org_marketing" | "specific_user";

export type ExceptionConfig = {
  taskMode: ExceptionTaskMode;
  defaultAssigneeStrategy: DefaultAssigneeStrategy;
  /** Lab role name from `taskAssignees` — used when `defaultAssigneeStrategy === "specific_user"`. */
  specificAssignee?: string;
  defaultVisibility: TaskVisibility;
};

export type Capabilities = {
  taskManager: CapabilityState;
  taskCreation: CapabilityState;
  externalVisibility: CapabilityState;
  threading: CapabilityState;
};

export type OrgOverride = {
  externalVisibility: "on" | "off";
};

export type RolloutConfig = {
  mode: RolloutMode;
  experienceMode: ExperienceMode;
  capabilities: Capabilities;
  exceptionConfigs: Partial<Record<ExceptionKey, ExceptionConfig>>;
  orgOverrides: Record<string, OrgOverride>;
};

const allExceptionKeys: ExceptionKey[] = [
  "on_hold",
  "in_question",
  "not_performed",
  "claim_on_hold",
  "qc_fail",
  "missing_data",
  "recollection_required",
];

const defaultExceptionConfigs = (
  overrides: Partial<Record<ExceptionKey, Partial<ExceptionConfig>>> = {},
): Partial<Record<ExceptionKey, ExceptionConfig>> => {
  const base: Record<ExceptionKey, ExceptionConfig> = {
    on_hold: {
      taskMode: "on",
      defaultAssigneeStrategy: "specific_user",
      specificAssignee: "Operations Manager",
      defaultVisibility: "lab_internal",
    },
    in_question: {
      taskMode: "on",
      defaultAssigneeStrategy: "specific_user",
      specificAssignee: "Client Support",
      defaultVisibility: "lab_internal",
    },
    not_performed: {
      taskMode: "on",
      defaultAssigneeStrategy: "specific_user",
      specificAssignee: "Operations Manager",
      defaultVisibility: "lab_internal",
    },
    claim_on_hold: {
      taskMode: "on",
      defaultAssigneeStrategy: "specific_user",
      specificAssignee: "Client Support",
      defaultVisibility: "lab_internal",
    },
    qc_fail: {
      taskMode: "on",
      defaultAssigneeStrategy: "specific_user",
      specificAssignee: "Operations Manager",
      defaultVisibility: "lab_internal",
    },
    missing_data: {
      taskMode: "on",
      defaultAssigneeStrategy: "specific_user",
      specificAssignee: "Client Support",
      defaultVisibility: "lab_internal",
    },
    recollection_required: {
      taskMode: "on",
      defaultAssigneeStrategy: "specific_user",
      specificAssignee: "Client Support",
      defaultVisibility: "lab_internal",
    },
  };
  for (const key of allExceptionKeys) {
    if (overrides[key]) {
      base[key] = { ...base[key], ...overrides[key] };
    }
  }
  return base;
};

export const newLabConfig: RolloutConfig = {
  mode: "new",
  experienceMode: "new",
  capabilities: {
    taskManager: "on",
    taskCreation: "on",
    externalVisibility: "on",
    threading: "on",
  },
  exceptionConfigs: defaultExceptionConfigs({
    claim_on_hold: { defaultVisibility: "shared_with_client" },
    missing_data: { defaultVisibility: "shared_with_client" },
    in_question: { defaultVisibility: "shared_with_client" },
  }),
  orgOverrides: {},
};

export const existingLabConfig: RolloutConfig = {
  mode: "existing",
  experienceMode: "new",
  capabilities: {
    taskManager: "off",
    taskCreation: "off",
    externalVisibility: "off",
    threading: "off",
  },
  exceptionConfigs: defaultExceptionConfigs(),
  orgOverrides: {},
};

export const transitioningLabConfig: RolloutConfig = {
  mode: "transitioning",
  experienceMode: "new",
  capabilities: {
    taskManager: "selective",
    taskCreation: "selective",
    externalVisibility: "selective",
    threading: "on",
  },
  exceptionConfigs: defaultExceptionConfigs({
    qc_fail: { taskMode: "off" },
    claim_on_hold: {
      taskMode: "on",
      specificAssignee: "Billing Specialist",
      defaultAssigneeStrategy: "specific_user",
      defaultVisibility: "shared_with_client",
    },
    recollection_required: {
      taskMode: "on",
      specificAssignee: "Client Support",
      defaultAssigneeStrategy: "specific_user",
      defaultVisibility: "lab_internal",
    },
  }),
  orgOverrides: {
    Amazon: { externalVisibility: "on" },
    Demo: { externalVisibility: "off" },
  },
};

export const labPresets: Record<RolloutMode, RolloutConfig> = {
  new: newLabConfig,
  existing: existingLabConfig,
  transitioning: transitioningLabConfig,
};

/** Mock: lab marketing / org relationship owner used when strategy is `org_marketing`. */
export const marketingAssigneeByOrgAccount: Record<string, string> = {
  Amazon: "Client Support",
  Demo: "Billing Specialist",
  "Aspira Shobha Diagnostic Center": "Operations Manager",
};

export const defaultAssigneeStrategyLabels: Record<DefaultAssigneeStrategy, string> = {
  requester: "Requester (who sets the exception)",
  org_marketing: "Marketing contact for organization",
  specific_user: "Specific user",
};

function defaultExceptionConfigFallback(): ExceptionConfig {
  return {
    taskMode: "on",
    defaultAssigneeStrategy: "specific_user",
    specificAssignee: taskAssignees[0].assignee,
    defaultVisibility: "lab_internal",
  };
}

const defaultConfigsByKey = defaultExceptionConfigs();

function defaultExceptionConfigForKey(exceptionKey: ExceptionKey): ExceptionConfig {
  return defaultConfigsByKey[exceptionKey] ?? defaultExceptionConfigFallback();
}

export function getExceptionConfig(
  config: RolloutConfig,
  exceptionKey: ExceptionKey,
): ExceptionConfig {
  const base = defaultExceptionConfigForKey(exceptionKey);
  const stored = config.exceptionConfigs[exceptionKey];
  if (!stored) {
    return base;
  }
  const merged = { ...base, ...stored };
  if (merged.defaultAssigneeStrategy === "specific_user") {
    const name = merged.specificAssignee ?? taskAssignees[0].assignee;
    return { ...merged, specificAssignee: name };
  }
  return merged;
}

export function isNewExperience(config: RolloutConfig): boolean {
  return config.experienceMode === "new";
}

export function canCreateTask(
  config: RolloutConfig,
  exceptionKey: ExceptionKey,
  account?: string | null,
): boolean {
  if (!isNewExperience(config)) return false;
  const caps = resolveCapabilities(config, account);
  if (caps.taskCreation === "off") return false;
  const exCfg = getExceptionConfig(config, exceptionKey);
  return exCfg.taskMode !== "off";
}

export function canSendNotifications(config: RolloutConfig, account?: string | null): boolean {
  if (!isNewExperience(config)) return false;
  const caps = resolveCapabilities(config, account);
  return caps.taskManager !== "off";
}

export function canShareWithClient(config: RolloutConfig, account?: string | null): boolean {
  if (!isNewExperience(config)) return false;
  const global = config.capabilities.externalVisibility;
  if (global === "off") return false;
  if (global === "on") return true;
  if (!account) return false;
  return config.orgOverrides[account]?.externalVisibility === "on";
}

export function canUseThreadedComments(config: RolloutConfig, account?: string | null): boolean {
  if (!isNewExperience(config)) return false;
  const caps = resolveCapabilities(config, account);
  return caps.threading !== "off";
}

function taskUserFromLabAssigneeName(name: string): TaskUser {
  return taskAssignees.find((a) => a.assignee === name) ?? taskAssignees[0];
}

/**
 * Resolves configured default assignee to a user — same rules as action creation in App.
 * Prefer this over reading `getExceptionConfig` when you have requester + org account context.
 */
export function resolveDefaultAssigneeUser(
  config: RolloutConfig,
  exceptionKey: ExceptionKey,
  context: { requester: TaskUser; account?: string | null },
): TaskUser {
  const cfg = getExceptionConfig(config, exceptionKey);
  switch (cfg.defaultAssigneeStrategy) {
    case "requester":
      return context.requester;
    case "org_marketing": {
      const accountKey = context.account?.trim() ?? "";
      const name =
        (accountKey && marketingAssigneeByOrgAccount[accountKey]) ?? taskAssignees[0].assignee;
      return taskUserFromLabAssigneeName(name);
    }
    case "specific_user":
    default:
      return taskUserFromLabAssigneeName(cfg.specificAssignee ?? taskAssignees[0].assignee);
  }
}

export function getDefaultVisibility(config: RolloutConfig, exceptionKey: ExceptionKey): TaskVisibility {
  return getExceptionConfig(config, exceptionKey).defaultVisibility;
}

export function resolveCapabilities(config: RolloutConfig, account?: string | null): Capabilities {
  const orgOverride = account ? config.orgOverrides[account] : undefined;
  if (!orgOverride) {
    return config.capabilities;
  }
  return {
    ...config.capabilities,
    externalVisibility: orgOverride.externalVisibility,
  };
}

export const experienceModeLabels: Record<ExperienceMode, string> = {
  legacy: "Legacy Mode",
  new: "New Experience",
};

export const modeLabels: Record<RolloutMode, string> = {
  new: "New Lab",
  existing: "Existing Lab",
  transitioning: "Transitioning Lab",
};

export const modeDescriptions: Record<RolloutMode, string> = {
  new: "Full stack ON — exceptions, tasks, notifications, client visibility and threading all enabled.",
  existing: "Exceptions only — tasks, notifications and client-facing features are disabled.",
  transitioning: "Selective rollout — task sharing with referring organisations configured per org; tasks still created per exception rules.",
};
