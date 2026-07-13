import { Navigate, useParams } from "react-router-dom";
import { useMemo, useState } from "react";
import { AccountOverviewSidebar } from "../components/account-overview/AccountOverviewSidebar";
import { SubpageBreadcrumb } from "../components/lab-shell/SubpageBreadcrumb";
import { usePageBreadcrumb } from "../hooks/usePageBreadcrumb";
import { useSmartBack } from "../hooks/useSmartBack";
import { InboxFilterTabs } from "../components/lab-home/InboxFilterTabs";
import {
  ActionsTable,
  ACTION_SUB_TAB_FILTERS,
  isOpenAction,
  type ActionSubTab,
} from "../components/lab-home/ActionsTable";
import type { ActionItem, ActionStatus } from "../data/labHome";
import { useInflow } from "../context/InflowContext";
import { useInflowSelectors } from "../hooks/useInflowSelectors";
import { inflowTasksToActionItems } from "../lib/inflow/adapters";
import { useLabs } from "../context/LabsContext";
import { getLabWorkflowConfig } from "../lib/labWorkflowConfig";
import "../styles/account-overview.css";
import "../styles/lab-home.css";
import "../styles/subpage-breadcrumb.css";

const SUB_TAB_OPTIONS: { value: ActionSubTab; label: string }[] = [
  { value: "assigned", label: "Assigned to me" },
  { value: "updates", label: "Updates" },
  { value: "reported", label: "Reported by me" },
  { value: "all", label: "All" },
];

function openCountForSubTab(actions: ActionItem[], subTab: ActionSubTab): number {
  return actions.filter(ACTION_SUB_TAB_FILTERS[subTab]).filter(isOpenAction).length;
}

function filterActions(
  actions: ActionItem[],
  subTab: ActionSubTab,
  status: ActionStatus | "all",
  search: string,
): ActionItem[] {
  let result = actions.filter(ACTION_SUB_TAB_FILTERS[subTab]);
  if (status !== "all") {
    result = result.filter((a) => a.status === status);
  }
  if (search) {
    const q = search.toLowerCase();
    result = result.filter(
      (a) => a.title.toLowerCase().includes(q) || a.context.toLowerCase().includes(q),
    );
  }
  return result;
}

export function LabActionsPage() {
  const { id } = useParams<{ id: string }>();
  const labId = Number(id);
  const { getLabDetail } = useLabs();
  const lab = getLabDetail(labId);
  const breadcrumb = usePageBreadcrumb();
  const smartBack = useSmartBack(`/lab/${labId}/center`);
  const inflow = useInflow();
  const { visibleTasks, taskUnreadCounts, currentUser } = useInflowSelectors();

  const [subTab, setSubTab] = useState<ActionSubTab>("assigned");
  const [statusFilter, setStatusFilter] = useState<ActionStatus | "all">("all");
  const [search, setSearch] = useState("");

  const liveActions = useMemo(
    () => inflowTasksToActionItems(visibleTasks, currentUser.assignee, taskUnreadCounts),
    [visibleTasks, currentUser.assignee, taskUnreadCounts],
  );

  const actionsSource = liveActions;

  if (!lab || Number.isNaN(labId)) {
    return <Navigate to="/" replace />;
  }

  if (!getLabWorkflowConfig(lab).showActions) {
    return <Navigate to={`/lab/${labId}/center`} replace />;
  }

  const filteredActions = filterActions(actionsSource, subTab, statusFilter, search);
  const hasActiveFilters = statusFilter !== "all" || search.trim().length > 0;
  const actionTabs = SUB_TAB_OPTIONS.map((opt) => ({
    value: opt.value,
    label: opt.label,
    count: openCountForSubTab(actionsSource, opt.value),
  }));

  return (
    <div className="ao-layout">
      <AccountOverviewSidebar lab={lab} />

      <main className="lab-home">
        {breadcrumb && (
          <SubpageBreadcrumb
            backHref={breadcrumb.backHref}
            backLabel={breadcrumb.backLabel}
            segments={breadcrumb.segments}
            onBack={smartBack}
          />
        )}

        <div className="na-inbox-page">
          <div className="na-inbox-page__tools">
            <select
              className="na-inbox-page__select"
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value as ActionStatus | "all")}
              aria-label="Filter by status"
            >
              <option value="all">All statuses</option>
              <option value="OPEN">Open</option>
              <option value="IN_PROGRESS">In progress</option>
              <option value="CLOSED">Closed</option>
            </select>
            <div className="na-hub__search na-inbox-page__search">
              <svg viewBox="0 0 16 16" width="14" height="14" fill="none" aria-hidden>
                <circle cx="7" cy="7" r="4.5" stroke="currentColor" strokeWidth="1.3" />
                <path d="M10.5 10.5L14 14" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" />
              </svg>
              <input
                type="search"
                placeholder="Search actions…"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                aria-label="Search actions"
              />
            </div>
            <button type="button" className="na-hub__create-btn na-inbox-page__create">
              + Create
            </button>
          </div>

          <div className="na-inbox-page__tabs">
            <InboxFilterTabs
              tabs={actionTabs}
              active={subTab}
              onChange={setSubTab}
              ariaLabel="Action views"
            />
          </div>

          <div className="na-inbox-page__card">
            <ActionsTable
              actions={filteredActions}
              labId={labId}
              showSubTabs={false}
              showStatusFilter={false}
              variant="inbox"
              className="na-inbox-page__table"
              onViewAction={(action) => inflow.openTaskAndMarkNotificationsRead(action.id)}
              emptyTitle={hasActiveFilters ? "No actions match your filters" : undefined}
              emptySubtitle={
                hasActiveFilters
                  ? "Try changing the status filter or search terms."
                  : undefined
              }
              emptyActionLabel={hasActiveFilters ? "Clear applied filters" : undefined}
              onEmptyAction={
                hasActiveFilters
                  ? () => {
                      setStatusFilter("all");
                      setSearch("");
                    }
                  : undefined
              }
            />
          </div>
        </div>
      </main>
    </div>
  );
}
