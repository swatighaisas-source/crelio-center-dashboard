import { Navigate, useParams } from "react-router-dom";
import { useMemo, useState } from "react";
import { AccountOverviewSidebar } from "../components/account-overview/AccountOverviewSidebar";
import { NotificationCategoryFilters } from "../components/lab-home/NotificationCategoryFilters";
import { NotificationDetailPanel } from "../components/lab-home/NotificationDetailPanel";
import { NotificationsFeed } from "../components/lab-home/NotificationsFeed";
import { SubpageBreadcrumb } from "../components/lab-shell/SubpageBreadcrumb";
import { usePageBreadcrumb } from "../hooks/usePageBreadcrumb";
import { useSmartBack } from "../hooks/useSmartBack";
import { useInflowNavigation } from "../hooks/useInflowNavigation";
import type { NotificationCategory, NotificationItem } from "../data/labHome";
import { useInflow } from "../context/InflowContext";
import { useInflowSelectors } from "../hooks/useInflowSelectors";
import { inflowNotificationsToUi } from "../lib/inflow/adapters";
import { useLabs } from "../context/LabsContext";
import { getLabWorkflowConfig } from "../lib/labWorkflowConfig";
import "../styles/account-overview.css";
import "../styles/lab-home.css";
import "../styles/subpage-breadcrumb.css";

export function LabNotificationsPage() {
  const { id } = useParams<{ id: string }>();
  const labId = Number(id);
  const { getLabDetail } = useLabs();
  const lab = getLabDetail(labId);
  const breadcrumb = usePageBreadcrumb();
  const smartBack = useSmartBack(`/lab/${labId}/center`);
  const inflow = useInflow();
  const { openRelatedFromUi } = useInflowNavigation();
  const { currentUserNotifications, currentUser, unreadNotificationCount } = useInflowSelectors();

  const [unreadOnly, setUnreadOnly] = useState(true);
  const [categoryFilters, setCategoryFilters] = useState<Set<NotificationCategory>>(new Set());
  const [selectedId, setSelectedId] = useState<string | null>(null);

  const allNotifications = useMemo(
    () => inflowNotificationsToUi(currentUserNotifications, labId, currentUser.assignee),
    [currentUserNotifications, labId, currentUser.assignee],
  );

  const visibilityPool = useMemo(
    () => (unreadOnly ? allNotifications.filter((n) => !n.isRead) : allNotifications),
    [unreadOnly, allNotifications],
  );

  const categoryCounts = useMemo(() => {
    const counts: Partial<Record<NotificationCategory, number>> = {};
    for (const notif of visibilityPool) {
      counts[notif.category] = (counts[notif.category] ?? 0) + 1;
    }
    return counts;
  }, [visibilityPool]);

  const notificationsWithReadState: NotificationItem[] = useMemo(() => {
    const filtered =
      categoryFilters.size === 0
        ? visibilityPool
        : visibilityPool.filter((n) => categoryFilters.has(n.category));
    return filtered;
  }, [visibilityPool, categoryFilters]);

  const unreadVisible = notificationsWithReadState.filter((n) => !n.isRead).length;
  const selectedNotification =
    notificationsWithReadState.find((n) => n.id === selectedId) ?? null;
  const hasCategoryFilters = categoryFilters.size > 0;
  const showEmptyClearFilters = hasCategoryFilters;
  const showEmptyShowAll = unreadOnly && !hasCategoryFilters && allNotifications.length > 0;

  const emptyTitle = showEmptyClearFilters
    ? "No notifications match your filters"
    : unreadOnly
      ? "No unread notifications"
      : undefined;
  const emptySubtitle = showEmptyClearFilters
    ? "Try removing category filters or turn off Unread only."
    : showEmptyShowAll
      ? "Turn off Unread only to see older notifications."
      : undefined;
  const emptyActionLabel = showEmptyClearFilters
    ? "Clear filters"
    : showEmptyShowAll
      ? "Show all notifications"
      : undefined;

  function handleEmptyAction() {
    if (showEmptyClearFilters) {
      setCategoryFilters(new Set());
      return;
    }
    if (showEmptyShowAll) {
      setUnreadOnly(false);
    }
  }

  if (!lab || Number.isNaN(labId)) {
    return <Navigate to="/" replace />;
  }

  if (!getLabWorkflowConfig(lab).showNotifications) {
    return <Navigate to={`/lab/${labId}/center`} replace />;
  }

  function markRead(notifId: string) {
    inflow.markNotificationRead(notifId);
  }

  function markUnread(notifId: string) {
    inflow.markNotificationUnread(notifId);
  }

  function markAllVisibleRead() {
    notificationsWithReadState.forEach((notif) => {
      if (!notif.isRead) {
        inflow.markNotificationRead(notif.id);
      }
    });
    inflow.markAllNotificationsRead();
  }

  function handleViewDetail(notif: NotificationItem) {
    setSelectedId(notif.id);
    if (!notif.isRead) {
      markRead(notif.id);
    }
  }

  function handleOpenRelated(notification: NotificationItem) {
    setSelectedId(null);
    openRelatedFromUi(notification);
  }

  const readIds = useMemo(
    () => new Set(allNotifications.filter((n) => n.isRead).map((n) => n.id)),
    [allNotifications],
  );

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
            {unreadNotificationCount > 0 && (
              <p className="na-inbox-page__summary">
                {unreadNotificationCount} unread notification
                {unreadNotificationCount !== 1 ? "s" : ""}
              </p>
            )}
            <div className="na-inbox-page__toggle">
              <button
                type="button"
                role="switch"
                aria-checked={unreadOnly}
                aria-label="Unread only"
                className={`na-inbox-page__switch${unreadOnly ? " na-inbox-page__switch--on" : ""}`}
                onClick={() => setUnreadOnly((value) => !value)}
              >
                <span className="na-inbox-page__switch-knob" aria-hidden />
              </button>
              <span>Unread only</span>
            </div>
            {selectedNotification && (
              <button
                type="button"
                className="na-inbox-page__text-btn"
                onClick={() =>
                  selectedNotification.isRead
                    ? markUnread(selectedNotification.id)
                    : markRead(selectedNotification.id)
                }
              >
                {selectedNotification.isRead ? "Mark as unread" : "Mark as read"}
              </button>
            )}
            <button
              type="button"
              className="na-inbox-page__text-btn"
              disabled={notificationsWithReadState.length === 0 || unreadVisible === 0}
              onClick={markAllVisibleRead}
            >
              Mark all read
            </button>
          </div>

          <NotificationCategoryFilters
            active={categoryFilters}
            counts={categoryCounts}
            onChange={setCategoryFilters}
          />

          <div
            className={`na-inbox-page__card na-inbox-page__card--notifications${selectedNotification ? " na-inbox-page__card--split" : ""}`}
          >
            <div className="na-notif-inbox__list">
              <NotificationsFeed
                notifications={notificationsWithReadState}
                allowMarkRead
                showHeader={false}
                groupByDate
                variant="inbox"
                className="na-inbox-page__feed"
                readIds={readIds}
                selectedId={selectedId}
                onViewDetail={handleViewDetail}
                onMarkRead={markRead}
                onMarkUnread={markUnread}
                onMarkAllRead={markAllVisibleRead}
                emptyTitle={emptyTitle}
                emptySubtitle={emptySubtitle}
                emptyActionLabel={emptyActionLabel}
                onEmptyAction={emptyActionLabel ? handleEmptyAction : undefined}
              />
            </div>
            {selectedNotification && (
              <NotificationDetailPanel
                labId={labId}
                notification={selectedNotification}
                isUnread={!selectedNotification.isRead}
                onClose={() => setSelectedId(null)}
                onMarkRead={() => markRead(selectedNotification.id)}
                onMarkUnread={() => markUnread(selectedNotification.id)}
                onViewRelatedAction={
                  selectedNotification.relatedActionId
                    ? () => inflow.openTaskAndMarkNotificationsRead(selectedNotification.relatedActionId!)
                    : undefined
                }
                onOpenRelatedItem={() => handleOpenRelated(selectedNotification)}
              />
            )}
          </div>
        </div>
      </main>
    </div>
  );
}
