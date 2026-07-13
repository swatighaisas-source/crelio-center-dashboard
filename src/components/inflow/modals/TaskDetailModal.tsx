import { useEffect, useState } from "react";
import { exceptionLabels, type ExceptionKey } from "../../../data/inflow/mockOrders";
import type { LabTask, TaskAssignee, TaskComment, TaskUser, TaskVisibility } from "../../../data/inflow/mockTasks";

type Props = {
  task: LabTask;
  comments: TaskComment[];
  clientAccountName: string | null;
  sourceSummary: Array<{ label: string; value: string }>;
  linkedTasksForException: LabTask[];
  affectedUsersForExceptionResolve: string[];
  rolloutClientSharingEnabled?: boolean;
  rolloutThreadingEnabled?: boolean;
  onClose: () => void;
  onNavigatePendingCollection: () => void;
  onOpenSource: (sourceLevel: "order" | "bill" | "sample" | "report", sourceId: string) => void;
  onUpdateAssignee: (taskId: string, assignee: TaskAssignee) => void;
  onAddComment: (taskId: string, text: string, internal: boolean, attachments?: boolean) => void;
  onResolveTaskSimple: (taskId: string) => void;
  onResolveViaException: (taskId: string, comment: string) => void;
  currentUser: TaskAssignee;
  labUsers: TaskAssignee[];
  allUsers: TaskUser[];
  onAddWatcher: (taskId: string, user: string) => void;
  onRemoveWatcher: (taskId: string, user: string) => void;
  onUpdateVisibility: (taskId: string, visibility: TaskVisibility) => void;
};

const contextCopy = {
  order: {
    label: "Order Exception",
    titlePrefix: "Order exception",
    entityTitle: "#6866",
    entityMeta: "Source: None (Default)",
    button: "Update Order Info",
  },
  bill: {
    label: "Bill Exception",
    titlePrefix: "Bill exception",
    entityTitle: "#1124621",
    entityMeta: "Bill-level recollection or billing blocker",
    button: "Update Order Info",
  },
  sample: {
    label: "Sample On-Hold",
    titlePrefix: "Sample",
    entityTitle: "#12345678",
    entityMeta: "Blood · Sterile Container · 4 ml",
    button: "Update Sample Info",
  },
  report: {
    label: "Report Exception",
    titlePrefix: "Report Critical Error",
    entityTitle: "CALCIUM 24 hrs URINE",
    entityMeta: "Blood · 000108926 · Pathology",
    button: "Update Report Info",
  },
};

function buildHeadline(
  task: LabTask,
  sourceLevel: keyof typeof contextCopy,
  sourceId: string,
  copy: (typeof contextCopy)[keyof typeof contextCopy],
  exceptionKey?: ExceptionKey,
) {
  if (sourceLevel === "sample") return task.title;
  const token = (exceptionKey ?? task.category).toUpperCase().replace(/\s+/g, "_");
  const subtitle = task.subtitle ? ` of ${task.subtitle}` : "";
  return `${copy.titlePrefix} is marked as ${token} for ${sourceLevel}(#${sourceId})${subtitle}`;
}

function getChipLabel(copy: (typeof contextCopy)[keyof typeof contextCopy], exceptionKey?: ExceptionKey) {
  if (exceptionKey && exceptionLabels[exceptionKey]) {
    return exceptionLabels[exceptionKey];
  }
  return copy.label;
}

function EyeIcon() {
  return (
    <svg viewBox="0 0 16 16" width="14" height="14" fill="none" aria-hidden>
      <path
        d="M1.5 8s2.5-4.5 6.5-4.5S14.5 8 14.5 8s-2.5 4.5-6.5 4.5S1.5 8 1.5 8Z"
        stroke="currentColor"
        strokeWidth="1.2"
      />
      <circle cx="8" cy="8" r="2" stroke="currentColor" strokeWidth="1.2" />
    </svg>
  );
}

function LockIcon() {
  return (
    <svg viewBox="0 0 12 14" width="12" height="12" fill="none" aria-hidden>
      <rect x="2" y="6" width="8" height="7" rx="1.5" stroke="currentColor" strokeWidth="1.2" />
      <path d="M4 6V4.5a2 2 0 0 1 4 0V6" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" />
    </svg>
  );
}

function PaperclipIcon() {
  return (
    <svg viewBox="0 0 16 16" width="14" height="14" fill="none" aria-hidden>
      <path
        d="M10.5 4.5l-4.2 4.2a2 2 0 1 0 2.8 2.8l4.5-4.5a3 3 0 1 0-4.2-4.2L5.2 8.1"
        stroke="currentColor"
        strokeWidth="1.2"
        strokeLinecap="round"
      />
    </svg>
  );
}

function VisibilityDropdown({
  visibility,
  disabled,
  clientAccountName,
  rolloutEnabled,
  onChange,
}: {
  visibility: TaskVisibility;
  disabled: boolean;
  clientAccountName: string | null;
  rolloutEnabled: boolean;
  onChange: (visibility: TaskVisibility) => void;
}) {
  const [isOpen, setIsOpen] = useState(false);
  const isVisible = visibility === "shared_with_client";

  if (!rolloutEnabled) {
    return <span className="task-visibility-locked">Not Visible</span>;
  }

  return (
    <div className="task-visibility-dropdown">
      <button
        type="button"
        className={`task-visibility-trigger${isVisible ? " task-visibility-trigger--visible" : ""}`}
        disabled={disabled}
        aria-haspopup="listbox"
        aria-expanded={isOpen}
        onClick={() => setIsOpen((current) => !current)}
      >
        {isVisible ? <EyeIcon /> : <LockIcon />}
        {isVisible ? "Visible" : "Not Visible"}
        <span className="task-visibility-trigger__chevron" aria-hidden>
          ⌄
        </span>
      </button>
      {isOpen && !disabled ? (
        <div className="task-visibility-menu" role="listbox" aria-label="Visibility">
          <button
            type="button"
            role="option"
            aria-selected={isVisible}
            className={isVisible ? "selected" : ""}
            onClick={() => {
              onChange("shared_with_client");
              setIsOpen(false);
            }}
            disabled={!clientAccountName}
          >
            <EyeIcon />
            Visible
          </button>
          <button
            type="button"
            role="option"
            aria-selected={!isVisible}
            className={!isVisible ? "selected" : ""}
            onClick={() => {
              onChange("lab_internal");
              setIsOpen(false);
            }}
          >
            <LockIcon />
            Not Visible
          </button>
        </div>
      ) : null}
    </div>
  );
}

export function TaskDetailModal({
  task,
  comments,
  clientAccountName,
  sourceSummary,
  onClose,
  onNavigatePendingCollection,
  onOpenSource,
  rolloutClientSharingEnabled = true,
  rolloutThreadingEnabled = true,
  onUpdateAssignee,
  onAddComment,
  onResolveTaskSimple,
  onResolveViaException,
  linkedTasksForException,
  affectedUsersForExceptionResolve,
  currentUser,
  labUsers,
  allUsers,
  onAddWatcher,
  onRemoveWatcher,
  onUpdateVisibility,
}: Props) {
  const [commentText, setCommentText] = useState("");
  const [isInternalComment, setIsInternalComment] = useState(false);
  const [isTagMenuOpen, setIsTagMenuOpen] = useState(false);
  const [isViewerMenuOpen, setIsViewerMenuOpen] = useState(false);
  const [isResolveConfirmOpen, setIsResolveConfirmOpen] = useState(false);
  const [resolutionComment, setResolutionComment] = useState("");
  const sourceLevel = task.sourceLevel ?? "report";
  const sourceId = task.sourceId ?? "57447";
  const copy = contextCopy[sourceLevel] ?? contextCopy.report;
  const isResolved = task.status === "RESOLVED";
  const isLabUser = currentUser.role === "lab";
  const canEditLabFields = isLabUser && !isResolved;
  const exceptionKey = task.exceptionKey as ExceptionKey | undefined;
  const isRecollectionException = exceptionKey === "recollection_required";
  const hasExceptionLinkage = Boolean(exceptionKey && !isRecollectionException);
  const chipLabel = getChipLabel(copy, exceptionKey);
  const headline = buildHeadline(task, sourceLevel, sourceId, copy, exceptionKey);

  useEffect(() => {
    setIsResolveConfirmOpen(false);
    setResolutionComment("");
  }, [task.id]);

  const simpleResolveAffectedUsers = Array.from(new Set([task.assignee, ...(task.watchers ?? [])])).filter(Boolean);
  const selectedAssignee = {
    assignee: task.assignee,
    assigneeInitials: task.assigneeInitials,
    assigneeColor: task.assigneeColor,
    role: "lab" as const,
  };
  const viewerProfiles = task.watchers
    .map((watcher) => allUsers.find((user) => user.assignee === watcher))
    .filter((watcher): watcher is TaskUser => Boolean(watcher));
  const sharedClientUsers = allUsers.filter(
    (user) =>
      user.role === "client" &&
      task.visibility === "shared_with_client" &&
      Boolean(clientAccountName && user.organization === clientAccountName),
  );
  const allowedTaskUsers = task.visibility === "shared_with_client" ? [...labUsers, ...sharedClientUsers] : labUsers;
  const viewerOptions = allowedTaskUsers.filter((user) => !task.watchers.includes(user.assignee));
  const tagUsers = allowedTaskUsers;
  const visibleViewers = viewerProfiles.slice(0, 2);
  const overflowViewerCount = Math.max(0, viewerProfiles.length - visibleViewers.length);

  return (
    <div className="task-detail-backdrop">
      <section className="task-detail-modal">
        <header className="task-detail-header">
          <div className="task-detail-header__left">
            <h1>Action Details</h1>
            <span className={`task-detail-chip task-detail-chip--${sourceLevel}`}>{chipLabel}</span>
            <span className="task-detail-status">
              <span className={`task-open-dot ${isResolved ? "resolved" : ""}`} aria-hidden />
              {task.status}
            </span>
          </div>
          <div className="task-detail-header__right">
            {isLabUser ? (
              <VisibilityDropdown
                visibility={task.visibility}
                disabled={!canEditLabFields}
                clientAccountName={clientAccountName}
                rolloutEnabled={rolloutClientSharingEnabled}
                onChange={(visibility) => onUpdateVisibility(task.id, visibility)}
              />
            ) : (
              <span className="task-visibility-readonly">
                Visible to your account: {clientAccountName ?? currentUser.organization ?? "Client"}
              </span>
            )}
            <button type="button" className="task-close" onClick={onClose} aria-label="Close">
              ×
            </button>
          </div>
        </header>

        <div className="task-detail-body">
          <main className="task-detail-main">
            <h2>{headline}</h2>

            <section className="task-description">
              <h3>Description</h3>
              <p>{task.description || "This is the description."}</p>
            </section>

            <section className="task-exception-card">
              <div className="task-exception-card__content">
                <strong>{copy.entityTitle}</strong>
                <span>{copy.entityMeta}</span>
                <small>
                  <span className="task-exception-card__info-icon" aria-hidden>
                    i
                  </span>
                  This action will resolve automatically when the exception is resolved.
                </small>
              </div>
              {isLabUser ? (
                <button
                  type="button"
                  className="task-exception-card__action"
                  disabled={isResolved}
                  onClick={() => onOpenSource(sourceLevel, sourceId)}
                >
                  {copy.button}
                  <span aria-hidden>›</span>
                </button>
              ) : null}
            </section>

            {!isLabUser ? (
              <section className="task-source-readonly">
                <div>
                  <h3>{sourceLevel.toUpperCase()} Details</h3>
                  <span>Read-only source information</span>
                </div>
                <dl>
                  {sourceSummary.map((item) => (
                    <div key={item.label}>
                      <dt>{item.label}</dt>
                      <dd>{item.value || "-"}</dd>
                    </div>
                  ))}
                </dl>
              </section>
            ) : null}

            <section className="task-comments">
              <div className="task-comments-head">
                <h3>Comments</h3>
                <span>
                  <span className="task-comments-head__info" aria-hidden>
                    i
                  </span>
                  Only lab users can see internal comments
                </span>
              </div>

              {comments
                .filter((comment) => isLabUser || !comment.internal)
                .map((comment) => (
                  <Comment
                    comment={comment}
                    key={comment.id}
                    readonly={isResolved}
                    allUsers={allUsers}
                  />
                ))}

              {!isResolved ? (
                <div className="task-comment-box">
                  <textarea
                    placeholder="Add comment"
                    value={commentText}
                    onChange={(event) => setCommentText(event.target.value)}
                  />
                  <div className="task-comment-box__toolbar">
                    <button
                      type="button"
                      className="task-comment-box__icon-btn"
                      aria-label="Attach file"
                      onClick={() => {
                        onAddComment(task.id, commentText, isInternalComment, true);
                        setCommentText("");
                      }}
                    >
                      <PaperclipIcon />
                    </button>
                    {rolloutThreadingEnabled ? (
                      <div className="task-tag-picker">
                        <button
                          type="button"
                          className="task-comment-box__tag-btn"
                          onClick={() => setIsTagMenuOpen((current) => !current)}
                          aria-haspopup="listbox"
                          aria-expanded={isTagMenuOpen}
                        >
                          @ Tag User
                        </button>
                        {isTagMenuOpen ? (
                          <div className="task-tag-menu" role="listbox" aria-label="Tag user">
                            {tagUsers.map((user) => (
                              <button
                                type="button"
                                key={user.assignee}
                                role="option"
                                onClick={() => {
                                  const separator = commentText && !commentText.endsWith(" ") ? " " : "";
                                  setCommentText(`${commentText}${separator}@${user.assignee} `);
                                  setIsTagMenuOpen(false);
                                }}
                              >
                                <span className="task-assignee">
                                  <b style={{ background: user.assigneeColor }}>{user.assigneeInitials}</b>
                                  {user.assignee}
                                </span>
                              </button>
                            ))}
                          </div>
                        ) : null}
                      </div>
                    ) : null}
                    {isLabUser ? (
                      <label className="task-comment-box__internal">
                        <input
                          type="checkbox"
                          checked={isInternalComment}
                          onChange={(event) => setIsInternalComment(event.target.checked)}
                        />
                        Lab internal comment
                      </label>
                    ) : null}
                    <button
                      type="button"
                      className="task-comment-box__submit"
                      onClick={() => {
                        onAddComment(task.id, commentText, isInternalComment);
                        setCommentText("");
                      }}
                    >
                      Add Comment
                    </button>
                  </div>
                </div>
              ) : null}
            </section>
          </main>

          <aside className="task-detail-side">
            <button type="button" className="task-attachments" disabled={isResolved}>
              <PaperclipIcon />
              2 Attachments
            </button>

            <AssigneeDropdown
              label="Assignee"
              value={selectedAssignee}
              users={labUsers}
              disabled={!canEditLabFields}
              onChange={(assignee) => onUpdateAssignee(task.id, assignee)}
            />

            <section className="task-viewers">
              <span className="task-viewers__label">Viewers</span>
              <div className="task-viewers__chips">
                {visibleViewers.map((viewer) => (
                  <span className="task-viewer-chip" key={viewer.assignee}>
                    {viewer.assignee}
                    <button
                      type="button"
                      aria-label={`Remove ${viewer.assignee}`}
                      disabled={isResolved || (currentUser.role === "client" && viewer.assignee !== currentUser.assignee)}
                      onClick={() => onRemoveWatcher(task.id, viewer.assignee)}
                    >
                      ×
                    </button>
                  </span>
                ))}
                {overflowViewerCount > 0 ? (
                  <span className="task-viewer-chip task-viewer-chip--more">+{overflowViewerCount}</span>
                ) : null}
                {!viewerProfiles.length ? <small className="task-viewers__empty">No viewers yet</small> : null}
              </div>
              {canEditLabFields ? (
                <div className="task-viewers__add">
                  <button
                    type="button"
                    disabled={!viewerOptions.length}
                    onClick={() => setIsViewerMenuOpen((current) => !current)}
                    aria-haspopup="listbox"
                    aria-expanded={isViewerMenuOpen}
                  >
                    Add viewer
                  </button>
                  {isViewerMenuOpen ? (
                    <div className="task-viewer-menu" role="listbox" aria-label="Add viewer">
                      {viewerOptions.map((user) => (
                        <button
                          type="button"
                          key={user.assignee}
                          role="option"
                          onClick={() => {
                            onAddWatcher(task.id, user.assignee);
                            setIsViewerMenuOpen(false);
                          }}
                        >
                          <span className="task-assignee">
                            <b style={{ background: user.assigneeColor }}>{user.assigneeInitials}</b>
                            {user.assignee}
                          </span>
                        </button>
                      ))}
                    </div>
                  ) : null}
                </div>
              ) : null}
            </section>

            {!isResolved && isLabUser ? (
              <>
                <button className="mark-resolved" type="button" onClick={() => setIsResolveConfirmOpen(true)}>
                  <span aria-hidden>✓</span> Mark as Resolved
                </button>
                {isResolveConfirmOpen ? (
                  <div className="task-detail-resolve-panel">
                    {isRecollectionException && exceptionKey ? (
                      <>
                        <p className="task-detail-resolve-intro">
                          <strong>{exceptionLabels[exceptionKey]}</strong> cannot be resolved here. Resolve via{" "}
                          <strong>Pending Collection</strong> → Collect Sample for this sample row.
                        </p>
                        <div className="task-detail-resolve-actions">
                          <button type="button" className="task-detail-resolve-secondary" onClick={() => setIsResolveConfirmOpen(false)}>
                            Close
                          </button>
                          <button type="button" className="task-detail-resolve-primary" onClick={onNavigatePendingCollection}>
                            Open Pending Collection
                          </button>
                        </div>
                      </>
                    ) : hasExceptionLinkage && exceptionKey ? (
                      <>
                        <label className="resolution-comment">
                          Resolution comment (required)
                          <textarea
                            placeholder="Resolution comment"
                            value={resolutionComment}
                            onChange={(event) => setResolutionComment(event.target.value)}
                          />
                        </label>
                        <div className="resolution-warning">
                          <div className="resolution-warning-copy">
                            <b>!</b>
                            <div>
                              <strong>This will resolve the exception and close linked actions</strong>
                              <p>
                                Resolves <strong>{exceptionLabels[exceptionKey]}</strong> on this{" "}
                                {task.sourceLevel ?? "record"}. {linkedTasksForException.length} linked{" "}
                                {linkedTasksForException.length === 1 ? "action" : "actions"} marked resolved,
                                removed from owners&apos; open lists, and watchers notified.
                              </p>
                            </div>
                          </div>
                          {affectedUsersForExceptionResolve.length ? (
                            <div className="resolution-warning-users">
                              <span>Will notify</span>
                              {affectedUsersForExceptionResolve.map((user) => (
                                <em key={user}>{user}</em>
                              ))}
                            </div>
                          ) : null}
                        </div>
                        <div className="resolve-actions task-detail-resolve-actions">
                          <button type="button" onClick={() => setIsResolveConfirmOpen(false)}>
                            Cancel
                          </button>
                          <button
                            type="button"
                            className="resolve-submit"
                            disabled={!resolutionComment.trim()}
                            onClick={() => {
                              const trimmed = resolutionComment.trim();
                              if (!trimmed) return;
                              onResolveViaException(task.id, trimmed);
                            }}
                          >
                            Resolve exception & actions
                          </button>
                        </div>
                      </>
                    ) : (
                      <>
                        <p className="task-detail-resolve-intro">
                          Resolve this action? Watchers notified; action leaves open lists.
                        </p>
                        <div className="resolution-warning">
                          <div className="resolution-warning-copy">
                            <b>!</b>
                            <div>
                              <strong>Notifications</strong>
                              <p>Assigned owner and watchers get an action resolved notification.</p>
                            </div>
                          </div>
                          {simpleResolveAffectedUsers.length ? (
                            <div className="resolution-warning-users">
                              <span>Will notify</span>
                              {simpleResolveAffectedUsers.map((user) => (
                                <em key={user}>{user}</em>
                              ))}
                            </div>
                          ) : null}
                        </div>
                        <div className="resolve-actions task-detail-resolve-actions">
                          <button type="button" onClick={() => setIsResolveConfirmOpen(false)}>
                            Cancel
                          </button>
                          <button type="button" className="resolve-submit" onClick={() => onResolveTaskSimple(task.id)}>
                            Resolve action
                          </button>
                        </div>
                      </>
                    )}
                  </div>
                ) : null}
              </>
            ) : null}

            <dl className="task-detail-meta">
              <div>
                <dt>Account</dt>
                <dd>{clientAccountName ?? "—"}</dd>
              </div>
              <div>
                <dt>Reported By</dt>
                <dd>{task.reportedBy}</dd>
              </div>
              <div>
                <dt>Created Date</dt>
                <dd>{task.createdAt}</dd>
              </div>
              <div>
                <dt>Resolved Date</dt>
                <dd>{isResolved ? "23rd Mar 2026 12:29 PM" : "—"}</dd>
              </div>
            </dl>
          </aside>
        </div>
      </section>
    </div>
  );
}

function AssigneeDropdown({
  label,
  value,
  users,
  disabled,
  onChange,
}: {
  label: string;
  value: TaskAssignee;
  users: TaskAssignee[];
  disabled: boolean;
  onChange: (assignee: TaskAssignee) => void;
}) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="task-lab-assignee">
      <span>{label}</span>
      <button
        type="button"
        className="task-assignee-picker"
        disabled={disabled}
        aria-haspopup="listbox"
        aria-expanded={isOpen}
        onClick={() => setIsOpen((current) => !current)}
      >
        <span className="task-assignee">
          <b style={{ background: value.assigneeColor }}>{value.assigneeInitials}</b>
          {value.assignee}
        </span>
        <span className="task-assignee-picker__chevron" aria-hidden>
          ⌄
        </span>
      </button>
      {isOpen && !disabled ? (
        <div className="task-assignee-menu" role="listbox" aria-label={label}>
          {users.map((user) => (
            <button
              type="button"
              key={user.assignee}
              className={user.assignee === value.assignee ? "selected" : ""}
              role="option"
              aria-selected={user.assignee === value.assignee}
              onClick={() => {
                onChange(user);
                setIsOpen(false);
              }}
            >
              <span className="task-assignee">
                <b style={{ background: user.assigneeColor }}>{user.assigneeInitials}</b>
                {user.assignee}
              </span>
            </button>
          ))}
        </div>
      ) : null}
    </div>
  );
}

function getAuthorProfile(author: string, allUsers: TaskUser[]) {
  return allUsers.find((user) => user.assignee === author);
}

function Comment({
  comment,
  readonly,
  allUsers,
}: {
  comment: TaskComment;
  readonly?: boolean;
  allUsers: TaskUser[];
}) {
  const profile = getAuthorProfile(comment.author, allUsers);
  const initials = profile?.assigneeInitials ?? comment.author.split(" ").map((part) => part[0]).join("").slice(0, 2);
  const avatarColor = profile?.assigneeColor ?? "#61708a";

  return (
    <article className={`task-comment${comment.internal ? " task-comment--internal" : ""}`}>
      <span className="comment-avatar" style={{ background: avatarColor }}>
        {initials}
      </span>
      <div className="task-comment__body">
        <div className="task-comment__head">
          <strong>
            {comment.author} <small>· {comment.createdAt}</small>
          </strong>
          {comment.internal ? (
            <span className="task-comment__internal-badge">
              <LockIcon />
              Lab internal comment
            </span>
          ) : null}
        </div>
        <p>{comment.text}</p>
        {comment.replies?.map((reply) => (
          <div className="task-reply" key={reply}>
            <span className="comment-avatar comment-avatar--small" style={{ background: avatarColor }}>
              {initials}
            </span>
            <p>{reply}</p>
          </div>
        ))}
        {comment.attachments ? (
          <div className="task-attachment-icons">
            <span className="task-attachment-icons__doc">DOC</span>
            <span className="task-attachment-icons__pdf">PDF</span>
            <span className="task-attachment-icons__img" aria-hidden />
          </div>
        ) : null}
        {!readonly ? (
          <button type="button" className="task-comment__reply">
            Reply
          </button>
        ) : null}
      </div>
    </article>
  );
}
