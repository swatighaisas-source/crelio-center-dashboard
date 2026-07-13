import { useState } from "react";
import { Link } from "react-router-dom";
import {
  ACTION_CATEGORY_LABELS,
  isOpenAction,
  type ActionItem,
  type ActionStatus,
} from "../../data/labHome";
import { InboxEmptyState } from "./InboxEmptyState";

export { isOpenAction };

export type ActionSubTab = "assigned" | "updates" | "reported" | "all";

export const ACTION_SUB_TAB_FILTERS: Record<ActionSubTab, (a: ActionItem) => boolean> = {
  assigned: (a) => a.assignedToMe,
  updates: (a) => a.hasUpdates,
  reported: (a) => a.reportedByMe,
  all: () => true,
};

function filterByStatus(actions: ActionItem[], status: ActionStatus | "all") {
  if (status === "all") return actions;
  return actions.filter((a) => a.status === status);
}

function VisibilityBadge({ visible }: { visible: boolean }) {
  if (visible) {
    return (
      <span className="na-visibility-badge na-visibility-badge--visible">
        <svg viewBox="0 0 16 16" width="14" height="14" fill="none" aria-hidden>
          <path
            d="M1.5 8s2.5-4.5 6.5-4.5S14.5 8 14.5 8s-2.5 4.5-6.5 4.5S1.5 8 1.5 8Z"
            stroke="currentColor"
            strokeWidth="1.2"
          />
          <circle cx="8" cy="8" r="2" stroke="currentColor" strokeWidth="1.2" />
        </svg>
        Visible
      </span>
    );
  }

  return (
    <span className="na-visibility-badge na-visibility-badge--hidden">
      <svg viewBox="0 0 12 14" width="12" height="12" fill="none" aria-hidden>
        <rect x="2" y="6" width="8" height="7" rx="1.5" stroke="currentColor" strokeWidth="1.2" />
        <path d="M4 6V4.5a2 2 0 0 1 4 0V6" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" />
      </svg>
      Not visible
    </span>
  );
}

function InboxActionCell({
  labId,
  action,
  onViewAction,
}: {
  labId: number;
  action: ActionItem;
  onViewAction?: (action: ActionItem) => void;
}) {
  const updates = action.updateCount ?? (action.hasUpdates ? 1 : 0);

  return (
    <div className="na-actions-cell">
      {onViewAction ? (
        <button type="button" className="na-view-btn--outline" onClick={() => onViewAction(action)}>
          View Action
        </button>
      ) : (
        <Link to={`/lab/${labId}/actions`} className="na-view-btn--outline">
          View Action
        </Link>
      )}
      {updates > 0 && (
        <span className="na-action-updates">
          <span className="na-action-updates__dot" aria-hidden />
          {updates} {updates === 1 ? "Update" : "Updates"}
        </span>
      )}
    </div>
  );
}

interface Props {
  actions: ActionItem[];
  labId: number;
  /** When set, renders a "View all →" footer link */
  viewAllHref?: string;
  /** Limit rows shown (for hub preview) */
  maxRows?: number;
  /** Hide sub-tab bar (page mode – filtering handled externally) */
  showSubTabs?: boolean;
  /** Hide inline status filter (page mode – filter in page header) */
  showStatusFilter?: boolean;
  className?: string;
  variant?: "default" | "inbox";
  onViewAction?: (action: ActionItem) => void;
  emptyTitle?: string;
  emptySubtitle?: string;
  emptyActionLabel?: string;
  onEmptyAction?: () => void;
}

export function ActionsTable({
  actions,
  labId,
  viewAllHref,
  maxRows,
  showSubTabs = true,
  showStatusFilter = true,
  className,
  variant = "default",
  onViewAction,
  emptyTitle,
  emptySubtitle,
  emptyActionLabel,
  onEmptyAction,
}: Props) {
  const [subTab, setSubTab] = useState<ActionSubTab>("assigned");
  const [statusFilter, setStatusFilter] = useState<ActionStatus | "all">("all");

  const assignedCount = actions.filter(ACTION_SUB_TAB_FILTERS.assigned).length;
  const updatesCount = actions.filter(ACTION_SUB_TAB_FILTERS.updates).length;
  const reportedCount = actions.filter(ACTION_SUB_TAB_FILTERS.reported).length;

  const filtered = showSubTabs
    ? filterByStatus(actions.filter(ACTION_SUB_TAB_FILTERS[subTab]), statusFilter)
    : actions;

  const rows = maxRows ? filtered.slice(0, maxRows) : filtered;

  const isInbox = variant === "inbox";

  function renderInboxRow(action: ActionItem) {
    return (
      <tr key={action.id} className="na-table__row">
        <td className="na-table__cell na-table__cell--category">
          <span className={`na-category-pill na-category-pill--${action.category}`}>
            {action.exceptionLabel}
          </span>
        </td>
        <td className="na-table__cell na-table__cell--description">
          <span className="na-action-description">{action.title}</span>
        </td>
        <td className="na-table__cell na-table__cell--visibility">
          <VisibilityBadge visible={action.visibleToAccount} />
        </td>
        <td className="na-table__cell na-table__cell--assignee">
          <div className="na-owner">
            <span
              className="na-owner__avatar"
              style={{ background: action.owner.color }}
              aria-label={action.owner.name}
            >
              {action.owner.initials}
            </span>
            <span className="na-owner__name">{action.owner.name}</span>
          </div>
        </td>
        <td className="na-table__cell na-table__cell--action">
          <InboxActionCell labId={labId} action={action} onViewAction={onViewAction} />
        </td>
      </tr>
    );
  }

  function renderDefaultRow(action: ActionItem) {
    return (
      <tr key={action.id} className="na-table__row">
        <td className="na-table__cell na-table__cell--category">
          <span className={`na-category-pill na-category-pill--${action.category}`}>
            {ACTION_CATEGORY_LABELS[action.category]}
          </span>
        </td>
        <td className="na-table__cell">
          <span className="na-context__title">{action.title}</span>
          <span className="na-context__sub">{action.context}</span>
          {!action.visibleToAccount && (
            <span className="na-lock-badge">
              <svg viewBox="0 0 12 14" width="10" height="10" fill="none" aria-hidden>
                <rect x="2" y="6" width="8" height="7" rx="1.5" stroke="currentColor" strokeWidth="1.2" />
                <path d="M4 6V4.5a2 2 0 0 1 4 0V6" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" />
              </svg>
              Not visible to account
            </span>
          )}
        </td>
        <td className="na-table__cell na-table__cell--owner">
          <div className="na-owner">
            <span
              className="na-owner__avatar"
              style={{ background: action.owner.color }}
              aria-label={action.owner.name}
            >
              {action.owner.initials}
            </span>
            <span className="na-owner__name">{action.owner.name}</span>
          </div>
        </td>
        <td className="na-table__cell na-table__cell--status">
          <span className={`na-status-chip na-status-chip--${action.status}`}>
            {action.status === "IN_PROGRESS" ? "In Progress" : action.status === "OPEN" ? "Open" : "Closed"}
          </span>
        </td>
        <td className="na-table__cell na-table__cell--action">
          <Link to={`/lab/${labId}/actions`} className="na-view-btn">
            VIEW
          </Link>
        </td>
      </tr>
    );
  }

  const colSpan = isInbox ? 5 : 5;

  return (
    <div
      className={`${className ?? "na-hub__panel"}${isInbox ? " na-hub__panel--inbox" : ""}`}
    >
      {showSubTabs && (
        <div className="na-sub-tabs">
          <button
            type="button"
            className={`na-sub-tab${subTab === "assigned" ? " na-sub-tab--active" : ""}`}
            onClick={() => setSubTab("assigned")}
          >
            Assigned To Me{" "}
            <span style={{ fontWeight: 400, color: "#9ca3af" }}>({assignedCount})</span>
          </button>
          <button
            type="button"
            className={`na-sub-tab${subTab === "updates" ? " na-sub-tab--active" : ""}`}
            onClick={() => setSubTab("updates")}
          >
            Updates{" "}
            <span style={{ fontWeight: 400, color: "#9ca3af" }}>({updatesCount})</span>
            {updatesCount > 0 && <span className="na-sub-tab__updates-dot" />}
          </button>
          <button
            type="button"
            className={`na-sub-tab${subTab === "reported" ? " na-sub-tab--active" : ""}`}
            onClick={() => setSubTab("reported")}
          >
            Reported By Me{" "}
            <span style={{ fontWeight: 400, color: "#9ca3af" }}>({reportedCount})</span>
          </button>
          <button
            type="button"
            className={`na-sub-tab${subTab === "all" ? " na-sub-tab--active" : ""}`}
            onClick={() => setSubTab("all")}
          >
            All Actions{" "}
            <span style={{ fontWeight: 400, color: "#9ca3af" }}>({actions.length})</span>
          </button>

          {showStatusFilter && (
            <div style={{ marginLeft: "auto", display: "flex", alignItems: "center", gap: 8, paddingRight: 4 }}>
              <select
                className="na-fullpage__status-select"
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value as ActionStatus | "all")}
              >
                <option value="all">All statuses</option>
                <option value="OPEN">Open</option>
                <option value="IN_PROGRESS">In progress</option>
                <option value="CLOSED">Closed</option>
              </select>
            </div>
          )}
        </div>
      )}

      {isInbox && rows.length === 0 ? (
        <div className="na-table-wrap na-table-wrap--empty">
          <InboxEmptyState
            variant="actions"
            title={emptyTitle}
            subtitle={emptySubtitle}
            actionLabel={emptyActionLabel}
            onAction={onEmptyAction}
          />
        </div>
      ) : (
        <div className="na-table-wrap">
          <table className={`na-table${isInbox ? " na-data-grid" : ""}`}>
            <thead className="na-table__head">
              <tr>
                {isInbox ? (
                  <>
                    <th className="na-table__cell na-table__cell--category">Category</th>
                    <th className="na-table__cell na-table__cell--description">Description</th>
                    <th className="na-table__cell na-table__cell--visibility">Visibility to account</th>
                    <th className="na-table__cell na-table__cell--assignee">Assignee</th>
                    <th className="na-table__cell na-table__cell--action">Actions</th>
                  </>
                ) : (
                  <>
                    <th className="na-table__cell na-table__cell--category">Category</th>
                    <th className="na-table__cell">Action context / details</th>
                    <th className="na-table__cell na-table__cell--owner">Owner</th>
                    <th className="na-table__cell na-table__cell--status">Status</th>
                    <th className="na-table__cell na-table__cell--action">Action</th>
                  </>
                )}
              </tr>
            </thead>
            <tbody>
              {rows.length === 0 ? (
                <tr>
                  <td colSpan={colSpan}>
                    <InboxEmptyState variant="actions" />
                  </td>
                </tr>
              ) : (
                rows.map((action) => (isInbox ? renderInboxRow(action) : renderDefaultRow(action)))
              )}
            </tbody>
          </table>
        </div>
      )}

      {viewAllHref && rows.length > 0 && (
        <div className="na-view-all">
          <Link to={viewAllHref} className="na-view-all__link">
            View all Pending Actions →
          </Link>
        </div>
      )}
    </div>
  );
}
