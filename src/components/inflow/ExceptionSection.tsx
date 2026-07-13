import { useMemo, useState } from "react";
import {
  exceptionLabels,
  getExceptionOptionsForLevel,
  protectedExceptionKeys,
  type ExceptionKey,
} from "../../data/inflow/mockOrders";
import type { ExceptionSourceLevel, PropagatedExceptions } from "../../data/inflow/exceptionTypes";
import type { LabTask, TaskUser } from "../../data/inflow/mockTasks";
import { TaskVisibilityPill } from "./TaskVisibilityPill";
import {
  canCreateTask,
  canShareWithClient,
  resolveDefaultAssigneeUser,
  getDefaultVisibility,
  type RolloutConfig,
} from "../../data/inflow/rolloutConfig";

const instantCommentsByException: Record<ExceptionKey, string[]> = {
  on_hold: [
    "Placed on hold pending confirmation of required information before workflow can continue.",
    "Hold applied because downstream processing should not proceed until the blocker is cleared.",
    "Awaiting responsible team confirmation before releasing this item from hold.",
  ],
  in_question: [
    "Result or order detail is in question and requires review before proceeding.",
    "Clarification needed from the responsible team before this can move forward.",
    "Please review the discrepancy and confirm the correct next action.",
  ],
  not_performed: [
    "Service could not be performed as requested. Please confirm whether cancellation or recollection is required.",
    "Test not performed due to operational or sample-related limitation. Awaiting next-step confirmation.",
    "Marking as not performed until the team confirms replacement, recollection, or cancellation.",
  ],
  claim_on_hold: [
    "Insurance billing hold. Claim cannot be submitted until payer details and authorization are confirmed.",
    "Claim is on hold pending account confirmation of billing responsibility.",
    "Billing blocker identified. Awaiting missing payer/account information before claim movement.",
  ],
  qc_fail: [
    "QC failed during validation. Hold release until reviewer confirms rerun or acceptance.",
    "Quality check failed. Please review whether recollection, rerun, or supervisor approval is required.",
    "Report release blocked due to QC failure. Awaiting clinical review and corrective action.",
  ],
  missing_data: [
    "Required information is missing. Please provide the missing details before this can proceed.",
    "Workflow blocked because mandatory data is incomplete or unavailable.",
    "Missing data identified. Awaiting account/provider/lab confirmation to complete processing.",
  ],
  recollection_required: [
    "Sample requires recollection before testing or reporting can continue.",
    "Specimen quality or volume is insufficient. Please arrange recollection with the patient or collection site.",
    "Recollection requested. Confirm the new collection date and update the order before proceeding.",
  ],
};

type Props = {
  subjectId: number | string;
  subjectLabel: string;
  currentLevel: ExceptionSourceLevel;
  exceptions: PropagatedExceptions;
  openTasks: LabTask[];
  taskUnreadCounts: Record<string, number>;
  rolloutConfig: RolloutConfig;
  /** Referring org account — used for default sharing preview (same as `createException`). */
  account?: string | null;
  /** Current user — used to preview "requester" assignee strategy. */
  requesterUser: TaskUser;
  title?: string;
  onOpenTask: (taskId: string) => void;
  onSetExceptions: (subjectId: number | string, exceptionKeys: ExceptionKey[], comment: string) => void;
  onResolveExceptions: (subjectId: number | string, exceptionKeys: ExceptionKey[], comment: string) => void;
};

export function ExceptionSection({
  subjectId,
  subjectLabel,
  currentLevel,
  exceptions,
  openTasks,
  taskUnreadCounts,
  rolloutConfig,
  account,
  requesterUser,
  title = "Add Exceptions",
  onOpenTask,
  onSetExceptions,
  onResolveExceptions,
}: Props) {
  const [selected, setSelected] = useState<ExceptionKey[]>([]);
  const [comment, setComment] = useState("");
  const [isResolveOpen, setIsResolveOpen] = useState(false);
  const [resolveSelected, setResolveSelected] = useState<ExceptionKey[]>([]);
  const [resolutionComment, setResolutionComment] = useState("");
  const [showActivityLog, setShowActivityLog] = useState(false);
  const [isInstantCommentOpen, setIsInstantCommentOpen] = useState(false);

  const directKeys = useMemo(
    () => exceptions.directActive.map((exception) => exception.exceptionKey),
    [exceptions.directActive],
  );
  const inheritedKeys = useMemo(
    () => exceptions.inheritedActive.map((exception) => exception.exceptionKey),
    [exceptions.inheritedActive],
  );
  const relatedActiveCount = exceptions.relatedActive.length;
  const hasActiveExceptions = directKeys.length > 0 || inheritedKeys.length > 0 || relatedActiveCount > 0;
  const directSet = useMemo(() => new Set(directKeys), [directKeys]);
  const inheritedSet = useMemo(() => new Set(inheritedKeys), [inheritedKeys]);
  const selectedSet = useMemo(() => new Set(selected), [selected]);
  const affectedResolveTasks = useMemo(
    () =>
      openTasks.filter(
        (task) => task.exceptionKey && resolveSelected.includes(task.exceptionKey as ExceptionKey),
      ),
    [openTasks, resolveSelected],
  );
  const affectedResolveUsers = useMemo(
    () =>
      Array.from(
        new Set(
          affectedResolveTasks.flatMap((task) => [task.assignee, ...(task.watchers ?? [])]).filter(Boolean),
        ),
      ),
    [affectedResolveTasks],
  );
  const instantCommentOptions = useMemo(
    () =>
      selected.flatMap((key) =>
        instantCommentsByException[key].map((text) => ({
          key,
          label: exceptionLabels[key],
          text,
        })),
      ),
    [selected],
  );
  const levelExceptionOptions = useMemo(
    () => getExceptionOptionsForLevel(currentLevel),
    [currentLevel],
  );

  const createPreviewRows = useMemo(() => {
    return selected.map((key) => {
      const willCreateAction = canCreateTask(rolloutConfig, key, account);
      const assignee = willCreateAction
        ? resolveDefaultAssigneeUser(rolloutConfig, key, { requester: requesterUser, account }).assignee
        : null;
      let visibilityLine: string;
      if (!willCreateAction) {
        visibilityLine = "";
      } else if (!canShareWithClient(rolloutConfig, account)) {
        visibilityLine = "Visible to: Lab only.";
      } else {
        const v = getDefaultVisibility(rolloutConfig, key);
        visibilityLine =
          v === "shared_with_client"
            ? "Visible to: Lab + Account."
            : "Visible to: Lab only (not shared with Account).";
      }
      return { key, willCreateAction, assignee, visibilityLine };
    });
  }, [selected, rolloutConfig, account, requesterUser]);

  const toggleSelection = (key: ExceptionKey) => {
    setSelected((current) =>
      current.includes(key) ? current.filter((item) => item !== key) : [...current, key],
    );
  };

  const submit = () => {
    if (!selected.length) {
      return;
    }
    onSetExceptions(subjectId, selected, comment.trim());
    setSelected([]);
    setComment("");
    setIsInstantCommentOpen(false);
  };

  const openResolvePanel = () => {
    setIsResolveOpen(true);
    setSelected([]);
    setResolveSelected(directKeys.filter((key) => !protectedExceptionKeys.has(key)));
  };

  const toggleResolveSelection = (key: ExceptionKey) => {
    setResolveSelected((current) =>
      current.includes(key) ? current.filter((item) => item !== key) : [...current, key],
    );
  };

  const submitResolution = () => {
    if (!resolveSelected.length) {
      return;
    }
    onResolveExceptions(subjectId, resolveSelected, resolutionComment.trim());
    setIsResolveOpen(false);
    setResolveSelected([]);
    setResolutionComment("");
  };

  return (
    <section className={`exceptions-panel ${hasActiveExceptions ? "raised" : ""}`}>
      <div className="exception-header">
        <div>
          <h2>{title}</h2>
          <div className="exception-chips">
            {levelExceptionOptions.map((key) => {
              const isActive = directSet.has(key);
              const isInherited = inheritedSet.has(key) && !isActive;
              const isSelected = selectedSet.has(key);
              const isProtected = protectedExceptionKeys.has(key) && !isActive;
              const chipTitle = isProtected
                ? "Raise via Redraw in the sample list"
                : isInherited
                ? `Inherited from parent ${currentLevel}`
                : undefined;
              return (
                <button
                  className={`exception-chip ${isActive ? "active" : ""} ${isInherited ? "inherited" : ""} ${isProtected ? "protected" : ""} ${isSelected ? "selected" : ""}`}
                  disabled={isInherited || isProtected}
                  key={key}
                  onClick={() => toggleSelection(key)}
                  type="button"
                  title={chipTitle}
                >
                  {exceptionLabels[key]}
                </button>
              );
            })}
            {relatedActiveCount ? (
              <span className="exception-chip related">
                {relatedActiveCount === 1 ? "Related Exception" : `${relatedActiveCount} Related Exceptions`}
              </span>
            ) : null}
          </div>
        </div>
        {directKeys.length ? (
          <button className="resolve-button" onClick={openResolvePanel}>
            Resolve Exceptions
          </button>
        ) : null}
        <span className="accordion-caret">⌄</span>
      </div>

      {isResolveOpen && directKeys.length ? (
        <div className="resolve-form">
          <label className="resolve-title">Select Exceptions To Resolve</label>
          <div className="resolve-options">
            {directKeys.map((key) => {
              const isLocked = protectedExceptionKeys.has(key);
              return (
                <label
                  key={key}
                  className={isLocked ? "resolve-option locked" : "resolve-option"}
                  title={isLocked ? "Resolve via Collect Sample in Pending Collection" : undefined}
                >
                  <input
                    type="checkbox"
                    checked={!isLocked && resolveSelected.includes(key)}
                    onChange={() => {
                      if (isLocked) return;
                      toggleResolveSelection(key);
                    }}
                    disabled={isLocked}
                  />
                  {exceptionLabels[key]}
                  {isLocked ? <small> (Resolve via Pending Collection)</small> : null}
                </label>
              );
            })}
          </div>
          <label className="resolution-comment">
            Resolution Comment
            <textarea
              placeholder="Add Resolution Comment"
              value={resolutionComment}
              onChange={(event) => setResolutionComment(event.target.value)}
            />
          </label>
          {affectedResolveTasks.length ? (
            <div className="resolution-warning">
              <div className="resolution-warning-copy">
                <b>!</b>
                <div>
                  <strong>This will close linked actions</strong>
                  <p>
                    Resolving this exception will mark {affectedResolveTasks.length} linked{" "}
                    {affectedResolveTasks.length === 1 ? "action" : "actions"} as resolved and remove{" "}
                    {affectedResolveTasks.length === 1 ? "it" : "them"} from owners' open action lists.
                  </p>
                </div>
              </div>
              {affectedResolveUsers.length ? (
                <div className="resolution-warning-users">
                  <span>Will notify</span>
                  {affectedResolveUsers.map((user) => (
                    <em key={user}>{user}</em>
                  ))}
                </div>
              ) : null}
            </div>
          ) : null}
          <a className="instant-link">Instant Comment</a>
          <div className="resolve-actions">
            <button onClick={() => setIsResolveOpen(false)}>Close</button>
            <button className="resolve-submit" onClick={submitResolution}>
              {affectedResolveTasks.length ? "Resolve & Close Actions" : "Resolve"}
            </button>
          </div>
        </div>
      ) : null}

      {!isResolveOpen && selected.length ? (
        <div className="exception-form">
          <p className="exception-workflows-impacted">
            Workflows impacted: Diaristics sample collect and receive, restricts report submission
          </p>
          <div className="exception-task-preview">
              <div className="exception-task-preview-copy">
                <b>!</b>
                <div>
                  <strong>What happens when you save</strong>
                  {createPreviewRows.every((r) => !r.willCreateAction) ? (
                    <p className="exception-task-preview-lead">
                      No task will be created — only the exception is saved.
                    </p>
                  ) : createPreviewRows.length === 1 && createPreviewRows[0].willCreateAction ? (
                    <>
                      <p className="exception-task-preview-lead">
                        Creates 1 action. Owner: <em>{createPreviewRows[0].assignee}</em>
                      </p>
                      <p className="exception-task-preview-lead exception-task-preview-line2">
                        {createPreviewRows[0].visibilityLine}
                      </p>
                    </>
                  ) : (
                    <ul className="exception-task-preview-list">
                      {createPreviewRows.map((row) => (
                        <li key={row.key}>
                          <strong>{exceptionLabels[row.key]}:</strong>{" "}
                          {row.willCreateAction ? (
                            <>
                              1 action → <em>{row.assignee}</em>. {row.visibilityLine}
                            </>
                          ) : (
                            <>No task — exception only.</>
                          )}
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
            </div>
          </div>
          <label>
            Exception Comment
            <textarea
              placeholder="Add Exception Comment"
              value={comment}
              onChange={(event) => setComment(event.target.value)}
            />
          </label>
          <div className="instant-comment-picker">
            <button
              type="button"
              onClick={() => setIsInstantCommentOpen((current) => !current)}
              disabled={!instantCommentOptions.length}
              aria-expanded={isInstantCommentOpen}
              aria-haspopup="menu"
            >
              Instant Comment +
            </button>
            {isInstantCommentOpen && instantCommentOptions.length ? (
              <div className="instant-comment-menu" role="menu">
                {instantCommentOptions.map((option) => (
                  <button
                    type="button"
                    role="menuitem"
                    key={`${option.key}-${option.text}`}
                    onClick={() => {
                      setComment(option.text);
                      setIsInstantCommentOpen(false);
                    }}
                  >
                    <strong>{option.label}</strong>
                    <span>{option.text}</span>
                  </button>
                ))}
              </div>
            ) : null}
          </div>
          <div className="email-options">
            <label><input type="checkbox" /> Email Patient</label>
            <label><input type="checkbox" /> Email Account</label>
            <label><input type="checkbox" /> Email Provider</label>
            <span />
            <button onClick={() => setSelected([])}>Close</button>
            <button className="set-exception" onClick={submit}>Set Exception</button>
          </div>
        </div>
      ) : null}

      {openTasks.length ? (
        <div className="open-task-block">
          <h3>Exception Actions</h3>
          {openTasks.map((task) => (
            <div className="open-task-row" key={task.id}>
              <span className={`task-category ${task.categoryClass}`}>{task.category}</span>
              <span className="open-task-title">
                <strong className="open-task-title-primary">
                  <span className="open-task-title-text">{task.title}</span>
                  <TaskVisibilityPill visibility={task.visibility} />
                  {taskUnreadCounts[task.id] ? (
                    <span className="task-unread-badge">{taskUnreadCounts[task.id]} unread</span>
                  ) : null}
                </strong>
                <small>{task.subtitle}</small>
              </span>
              <span className="task-assignee">
                <b style={{ background: task.assigneeColor }}>{task.assigneeInitials}</b>
                {task.assignee}
              </span>
              <div className="open-task-row-actions">
                <span className={`task-status ${task.status.toLowerCase()}`}>{task.status}</span>
                <button
                  type="button"
                  className="open-task-view-action"
                  onClick={() => onOpenTask(task.id)}
                >
                  View action
                </button>
              </div>
            </div>
          ))}
        </div>
      ) : null}

      {hasActiveExceptions || exceptions.activity.length > 0 ? (
        <div className="activity-block">
          <button className="activity-toggle" onClick={() => setShowActivityLog((current) => !current)}>
            <span>{showActivityLog ? "⌃" : "⌄"}</span> Exception Log
          </button>
          {showActivityLog
            ? exceptions.activity.map((item) => (
                <div className={`log-row ${item.type} ${item.relation}`} key={item.id}>
                  <span>
                    {item.type === "resolved"
                      ? "Resolved"
                      : `Exception Set For ${item.sourceLabel || subjectLabel}`}
                  </span>
                  <b>{exceptionLabels[item.exceptionKey]}</b>
                  <em>{item.comment}</em>
                  <small>{item.timestamp} by {item.actor}</small>
                </div>
              ))
            : null}
        </div>
      ) : null}
    </section>
  );
}
