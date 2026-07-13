import { useState } from "react";
import { exceptionLabels } from "../../data/inflow/mockOrders";
import type { ExceptionKey } from "../../data/inflow/mockOrders";
import {
  defaultAssigneeStrategyLabels,
  experienceModeLabels,
  getExceptionConfig,
  isNewExperience,
  type DefaultAssigneeStrategy,
  type ExceptionConfig,
  type ExceptionTaskMode,
  type ExperienceMode,
  type RolloutConfig,
} from "../../data/inflow/rolloutConfig";
import { taskAssignees } from "../../data/inflow/mockTasks";

const allExceptionKeys: ExceptionKey[] = [
  "on_hold",
  "in_question",
  "not_performed",
  "claim_on_hold",
  "qc_fail",
  "missing_data",
  "recollection_required",
];

type Props = {
  rolloutConfig: RolloutConfig;
  onUpdateConfig: (config: RolloutConfig) => void;
};

const actionModeLabels: Record<ExceptionTaskMode, string> = {
  on: "On",
  off: "Off",
};

const actionModeDescriptions: Record<ExceptionTaskMode, string> = {
  on: "Exception raised + action created",
  off: "Exception raised, no action created",
};

const assigneeStrategyOrder: DefaultAssigneeStrategy[] = ["requester", "org_marketing", "specific_user"];

const orgList = ["Amazon", "Demo", "Aspira Shobha Diagnostic Center"];

export function RolloutConfigPage({ rolloutConfig, onUpdateConfig }: Props) {
  const [activeTab, setActiveTab] = useState<"create" | "master">("create");
  const [isOrgModalOpen, setIsOrgModalOpen] = useState(false);

  const isNew = isNewExperience(rolloutConfig);

  const setExperienceMode = (experienceMode: ExperienceMode) => {
    onUpdateConfig({ ...rolloutConfig, experienceMode });
    if (experienceMode === "legacy") {
      setIsOrgModalOpen(false);
    }
  };

  const updateExceptionConfig = (key: ExceptionKey, patch: Partial<ExceptionConfig>) => {
    const current = getExceptionConfig(rolloutConfig, key);
    onUpdateConfig({
      ...rolloutConfig,
      exceptionConfigs: {
        ...rolloutConfig.exceptionConfigs,
        [key]: { ...current, ...patch },
      },
    });
  };

  const setAllOrganisations = () => {
    onUpdateConfig({
      ...rolloutConfig,
      capabilities: { ...rolloutConfig.capabilities, externalVisibility: "on" },
    });
    setIsOrgModalOpen(false);
  };

  const setSpecificOrganisations = () => {
    onUpdateConfig({
      ...rolloutConfig,
      capabilities: { ...rolloutConfig.capabilities, externalVisibility: "selective" },
    });
    setIsOrgModalOpen(true);
  };

  const updateOrgShare = (org: string, share: boolean) => {
    onUpdateConfig({
      ...rolloutConfig,
      orgOverrides: {
        ...rolloutConfig.orgOverrides,
        [org]: { externalVisibility: share ? "on" : "off" },
      },
    });
  };

  const sharedOrgCount = orgList.filter(
    (org) => rolloutConfig.orgOverrides[org]?.externalVisibility === "on",
  ).length;

  const isSelectiveSharing = rolloutConfig.capabilities.externalVisibility === "selective";
  const isAllOrgSharing = rolloutConfig.capabilities.externalVisibility === "on";

  const createTabContent = (
    <div className="rollout-create-tab">
      <section className="rollout-create-exception-section">
        <h2>Create an exception</h2>
        <p className="rollout-create-exception-hint">
          This section is reserved for exception-creation settings. Content will be added here for both Legacy Mode and
          New Experience.
        </p>
        <div className="rollout-create-exception-blank" aria-hidden />
      </section>
    </div>
  );

  const masterTabContent = isNew ? (
    <div className="rollout-master-tab">
      <p className="rollout-master-intro">
        {allExceptionKeys.length} exceptions configured. Choose how actions are created, who owns them by default
        (requester, organization marketing contact, or a fixed lab user), and default visibility.
      </p>
      <table className="rollout-exception-table">
        <thead>
          <tr>
            <th>Exception</th>
            <th>Action Creation</th>
            <th>Default Assignee</th>
            <th>Default Visibility</th>
            <th>Status</th>
          </tr>
        </thead>
        <tbody>
          {allExceptionKeys.map((key) => {
            const cfg = getExceptionConfig(rolloutConfig, key);
            return (
              <tr key={key}>
                <td>
                  <strong>{exceptionLabels[key]}</strong>
                </td>
                <td>
                  <div className="task-mode-selector">
                    {(["on", "off"] as ExceptionTaskMode[]).map((m) => (
                      <button
                        key={m}
                        type="button"
                        className={`task-mode-btn${cfg.taskMode === m ? " active" : ""}`}
                        title={actionModeDescriptions[m]}
                        onClick={() => updateExceptionConfig(key, { taskMode: m })}
                      >
                        {actionModeLabels[m]}
                      </button>
                    ))}
                  </div>
                </td>
                <td className="rollout-assignee-cell">
                  <select
                    className="rollout-strategy-select"
                    aria-label="Default assignee rule"
                    value={cfg.defaultAssigneeStrategy}
                    onChange={(e) => {
                      const strategy = e.target.value as DefaultAssigneeStrategy;
                      const next: Partial<ExceptionConfig> = { defaultAssigneeStrategy: strategy };
                      if (strategy === "specific_user") {
                        next.specificAssignee = cfg.specificAssignee ?? taskAssignees[0].assignee;
                      }
                      updateExceptionConfig(key, next);
                    }}
                  >
                    {assigneeStrategyOrder.map((s) => (
                      <option key={s} value={s}>
                        {defaultAssigneeStrategyLabels[s]}
                      </option>
                    ))}
                  </select>
                  {cfg.defaultAssigneeStrategy === "specific_user" ? (
                    <select
                      className="rollout-assignee-select"
                      aria-label="Specific lab user"
                      value={cfg.specificAssignee ?? taskAssignees[0].assignee}
                      onChange={(ev) => updateExceptionConfig(key, { specificAssignee: ev.target.value })}
                    >
                      {taskAssignees.map((a) => (
                        <option key={a.assignee} value={a.assignee}>
                          {a.assignee}
                        </option>
                      ))}
                    </select>
                  ) : null}
                </td>
                <td>
                  <div className="task-visibility-toggle">
                    <button
                      type="button"
                      className={cfg.defaultVisibility === "lab_internal" ? "active" : ""}
                      onClick={() => updateExceptionConfig(key, { defaultVisibility: "lab_internal" })}
                    >
                      Internal Only
                    </button>
                    <button
                      type="button"
                      className={cfg.defaultVisibility === "shared_with_client" ? "active" : ""}
                      onClick={() => updateExceptionConfig(key, { defaultVisibility: "shared_with_client" })}
                    >
                      Visible to Org
                    </button>
                  </div>
                </td>
                <td>
                  <span className={`rollout-task-status-badge ${cfg.taskMode === "on" ? "badge-on" : "badge-off"}`}>
                    {cfg.taskMode === "on" ? "Action ON" : "OFF"}
                  </span>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  ) : (
    <div className="rollout-master-tab rollout-master-legacy">
      <p className="rollout-master-intro">
        {allExceptionKeys.length} exceptions configured. Action settings are not available in Legacy mode.
      </p>
      <table className="rollout-exception-table legacy">
        <thead>
          <tr>
            <th>Exception</th>
          </tr>
        </thead>
        <tbody>
          {allExceptionKeys.map((key) => (
            <tr key={key}>
              <td>
                <strong>{exceptionLabels[key]}</strong>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );

  return (
    <div className="rollout-page">
      <div className="rollout-header">
        <h1>Exception Configuration</h1>
        <p>Define exceptions, their types and the roles/drivers they block.</p>
        <div className="rollout-header-actions">
          <span className="rollout-experience-chip" data-experience={rolloutConfig.experienceMode}>
            {experienceModeLabels[rolloutConfig.experienceMode]}
          </span>
        </div>
      </div>

      <section className="rollout-experience-toggle" aria-label="Experience mode">
        {(["legacy", "new"] as ExperienceMode[]).map((em) => (
          <button
            key={em}
            type="button"
            className={rolloutConfig.experienceMode === em ? "active" : ""}
            onClick={() => setExperienceMode(em)}
          >
            {experienceModeLabels[em]}
          </button>
        ))}
      </section>

      {isNew ? (
        <section className="rollout-ext-coord">
          <div className="rollout-ext-coord-label">
            External coordination — client action sharing
            <span className="rollout-ext-badge">External</span>
          </div>
          <p>
            For external coordination, choose who can see and act on shared actions with your referring clinics and
            hospitals: every organisation, or only the ones you pick in the list.
          </p>
          <div className="rollout-org-toggle">
            <button type="button" className={isAllOrgSharing ? "active" : ""} onClick={setAllOrganisations}>
              All organisations
            </button>
            <button type="button" className={isSelectiveSharing ? "active" : ""} onClick={setSpecificOrganisations}>
              Specific organisations
            </button>
          </div>
          {isSelectiveSharing ? (
            <div className="rollout-org-selective-actions">
              <p className="rollout-org-note">
                Actions from external coordination exceptions are visible only to organisations you enable.
                {sharedOrgCount
                  ? ` ${sharedOrgCount} organisation${sharedOrgCount === 1 ? "" : "s"} enabled.`
                  : " None enabled yet."}
              </p>
              <button type="button" className="rollout-manage-orgs-btn" onClick={() => setIsOrgModalOpen(true)}>
                Manage organisations
              </button>
            </div>
          ) : isAllOrgSharing ? (
            <p className="rollout-org-note">
              Actions from external coordination exceptions are visible to every linked referring organisation.
            </p>
          ) : (
            <p className="rollout-org-note">Action sharing with referring organisations is disabled for this lab.</p>
          )}
        </section>
      ) : null}

      <div className="rollout-tabs">
        <button
          type="button"
          className={activeTab === "create" ? "active" : ""}
          onClick={() => setActiveTab("create")}
        >
          Create Exception
        </button>
        <button
          type="button"
          className={activeTab === "master" ? "active" : ""}
          onClick={() => setActiveTab("master")}
        >
          Exception Master
        </button>
      </div>

      {activeTab === "create" ? createTabContent : masterTabContent}

      {isNew && isOrgModalOpen ? (
        <div className="rollout-org-modal-backdrop" onClick={() => setIsOrgModalOpen(false)}>
          <section
            className="rollout-org-modal"
            onClick={(event) => event.stopPropagation()}
            role="dialog"
            aria-labelledby="rollout-org-modal-title"
          >
            <header className="rollout-org-modal-header">
              <div>
                <h2 id="rollout-org-modal-title">Share action to organization</h2>
                <p>Select organisations that can see shared actions from external coordination exceptions.</p>
              </div>
              <button type="button" className="rollout-org-modal-close" onClick={() => setIsOrgModalOpen(false)} aria-label="Close">
                ×
              </button>
            </header>
            <div className="rollout-org-modal-body">
            <table className="rollout-org-table">
              <thead>
                <tr>
                  <th>Organisation</th>
                  <th>Share action to organization</th>
                </tr>
              </thead>
              <tbody>
                {orgList.map((org) => {
                  const shareEnabled = rolloutConfig.orgOverrides[org]?.externalVisibility === "on";
                  return (
                    <tr key={org}>
                      <td>
                        <strong>{org}</strong>
                      </td>
                      <td>
                        <select
                          value={shareEnabled ? "on" : "off"}
                          onChange={(e) => updateOrgShare(org, e.target.value === "on")}
                        >
                          <option value="on">On</option>
                          <option value="off">Off</option>
                        </select>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
            </div>
            <footer className="rollout-org-modal-footer">
              <button type="button" onClick={() => setIsOrgModalOpen(false)}>
                Done
              </button>
            </footer>
          </section>
        </div>
      ) : null}
    </div>
  );
}
