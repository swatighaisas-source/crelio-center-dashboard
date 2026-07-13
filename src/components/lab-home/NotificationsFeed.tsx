import { useState } from "react";
import { Link } from "react-router-dom";
import {
  formatNotificationCategoryLine,
  formatNotificationTime,
  groupNotificationsByDay,
  type NotificationItem,
} from "../../data/labHome";
import { InboxEmptyState } from "./InboxEmptyState";

interface Props {
  notifications: NotificationItem[];
  /** When set, renders a "View all →" footer link */
  viewAllHref?: string;
  /** Limit items shown (for hub preview) */
  maxItems?: number;
  /** Allow marking items as read */
  allowMarkRead?: boolean;
  /** Hide default feed header for page-level controls */
  showHeader?: boolean;
  /** Controlled read-state from parent */
  readIds?: Set<string>;
  /** Optional callback for marking a single notification read */
  onMarkRead?: (id: string) => void;
  /** Optional callback for marking a single notification unread */
  onMarkUnread?: (id: string) => void;
  /** Optional callback for marking all visible notifications read */
  onMarkAllRead?: () => void;
  /** Additional wrapper class */
  className?: string;
  /** Group list under day labels (Today, Yesterday, …) */
  groupByDate?: boolean;
  /** Visual density: inbox pages use a calmer row layout */
  variant?: "default" | "inbox";
  /** Highlight the selected notification row */
  selectedId?: string | null;
  /** Open notification detail */
  onViewDetail?: (notification: NotificationItem) => void;
  /** Override empty-state copy */
  emptyTitle?: string;
  emptySubtitle?: string;
  emptyActionLabel?: string;
  onEmptyAction?: () => void;
}

export function NotificationsFeed({
  notifications,
  viewAllHref,
  maxItems,
  allowMarkRead = true,
  showHeader = true,
  readIds,
  onMarkRead,
  onMarkUnread,
  onMarkAllRead,
  className,
  groupByDate = false,
  variant = "default",
  selectedId,
  onViewDetail,
  emptyTitle,
  emptySubtitle,
  emptyActionLabel,
  onEmptyAction,
}: Props) {
  const [internalReadIds, setInternalReadIds] = useState<Set<string>>(
    () => new Set(notifications.filter((n) => n.isRead).map((n) => n.id)),
  );
  const activeReadIds = readIds ?? internalReadIds;

  function markRead(id: string) {
    if (onMarkRead) {
      onMarkRead(id);
      return;
    }
    setInternalReadIds((prev) => new Set([...prev, id]));
  }

  function markUnread(id: string) {
    if (onMarkUnread) {
      onMarkUnread(id);
      return;
    }
    setInternalReadIds((prev) => {
      const next = new Set(prev);
      next.delete(id);
      return next;
    });
  }

  function markAllRead() {
    if (onMarkAllRead) {
      onMarkAllRead();
      return;
    }
    setInternalReadIds(new Set(notifications.map((n) => n.id)));
  }

  const unreadCount = notifications.filter((n) => !activeReadIds.has(n.id)).length;
  const items = maxItems ? notifications.slice(0, maxItems) : notifications;
  const isInbox = variant === "inbox";
  const dayGroups = groupByDate ? groupNotificationsByDay(items) : null;

  function renderListItem(notif: NotificationItem) {
    const isUnread = !activeReadIds.has(notif.id);
    return (
      <div
        key={notif.id}
        className={`na-notif-item${isUnread ? " na-notif-item--unread" : ""}`}
      >
        <span className="na-notif__dot" aria-hidden />
        <div className="na-notif__body">
          <span className="na-notif__title">{notif.title}</span>
          <span className="na-notif__desc">{notif.description}</span>
        </div>
        <div className="na-notif__meta">
          <span className="na-notif__time">{formatNotificationTime(notif.timestamp)}</span>
          {allowMarkRead && isUnread && (
            <button
              type="button"
              className="na-notif__mark-read"
              aria-label="Mark as read"
              title="Mark as read"
              onClick={() => markRead(notif.id)}
            >
              <svg viewBox="0 0 16 16" width="14" height="14" fill="none" aria-hidden>
                <path
                  d="M3 8.5l3.5 3.5 6-7"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </button>
          )}
        </div>
      </div>
    );
  }

  function renderInboxItem(notif: NotificationItem) {
    const isUnread = !activeReadIds.has(notif.id);
    const isSelected = selectedId === notif.id;
    return (
      <li
        key={notif.id}
        className={`na-notif-feed__item${isUnread ? " na-notif-feed__item--unread" : ""}${isSelected ? " na-notif-feed__item--selected" : ""}`}
      >
        <span className="na-notif-feed__dot" aria-hidden />
        <time className="na-notif-feed__time" dateTime={notif.timestamp}>
          {formatNotificationTime(notif.timestamp)}
        </time>
        <div className="na-notif-feed__body">
          <p className="na-notif-feed__title">{notif.title}</p>
          <p className="na-notif-feed__desc">{notif.description}</p>
        </div>
        <p className="na-notif-feed__category-col">
          {formatNotificationCategoryLine(notif.category)}
        </p>
        <div className="na-notif-feed__actions">
          {onViewDetail && (
            <button
              type="button"
              className="na-notif-feed__link"
              onClick={() => onViewDetail(notif)}
            >
              View detail
            </button>
          )}
          {allowMarkRead && onViewDetail && (
            <span className="na-notif-feed__actions-sep" aria-hidden>
              ·
            </span>
          )}
          {allowMarkRead &&
            (isUnread ? (
              <button
                type="button"
                className="na-notif-feed__link na-notif-feed__link--muted"
                onClick={() => markRead(notif.id)}
              >
                Mark read
              </button>
            ) : (
              <button
                type="button"
                className="na-notif-feed__link na-notif-feed__link--muted"
                onClick={() => markUnread(notif.id)}
              >
                Mark unread
              </button>
            ))}
        </div>
      </li>
    );
  }

  function renderInboxFeed() {
    if (items.length === 0) {
      return (
        <div className="na-notif-feed na-notif-feed--empty">
          <InboxEmptyState
            variant="notifications"
            title={emptyTitle}
            subtitle={emptySubtitle}
            actionLabel={emptyActionLabel}
            onAction={onEmptyAction}
          />
        </div>
      );
    }

    if (dayGroups) {
      return (
        <div className="na-notif-feed">
          {dayGroups.map((group) => (
            <section key={group.label} className="na-notif-feed__day">
              <h2 className="na-notif-feed__day-label">{group.label}</h2>
              <ul className="na-notif-feed__list">
                {group.items.map((notif) => renderInboxItem(notif))}
              </ul>
            </section>
          ))}
        </div>
      );
    }

    return (
      <div className="na-notif-feed">
        <ul className="na-notif-feed__list">
          {items.map((notif) => renderInboxItem(notif))}
        </ul>
      </div>
    );
  }

  return (
    <div
      className={`na-hub__panel${isInbox ? " na-hub__panel--inbox na-hub__panel--notif-feed" : ""}${className ? ` ${className}` : ""}`}
    >
      {showHeader && (
        <div className="na-notifs-header">
          <span className="na-notifs-header__label">
            {unreadCount > 0 ? `${unreadCount} unread` : "All caught up"}
          </span>
          {allowMarkRead && unreadCount > 0 && (
            <button type="button" className="na-notifs-header__action" onClick={markAllRead}>
              Mark all as read
            </button>
          )}
        </div>
      )}

      {isInbox ? (
        renderInboxFeed()
      ) : (
        <div className="na-notifs">
          {items.length === 0 ? (
            <InboxEmptyState variant="notifications" />
          ) : dayGroups ? (
            dayGroups.map((group) => (
              <section key={group.label} className="na-notif-day">
                <h2 className="na-notif-day__label">{group.label}</h2>
                {group.items.map((notif) => renderListItem(notif))}
              </section>
            ))
          ) : (
            items.map((notif) => renderListItem(notif))
          )}
        </div>
      )}

      {viewAllHref && items.length > 0 && (
        <div className="na-view-all">
          <Link to={viewAllHref} className="na-view-all__link">
            View all Notifications →
          </Link>
        </div>
      )}
    </div>
  );
}
