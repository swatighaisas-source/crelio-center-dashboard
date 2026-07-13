import { Link } from "react-router-dom";
import {
  formatNotificationCategoryLine,
  formatNotificationDateTime,
  formatNotificationTime,
  type NotificationItem,
} from "../../data/labHome";

interface Props {
  labId: number;
  notification: NotificationItem;
  isUnread: boolean;
  onClose: () => void;
  onMarkRead?: () => void;
  onMarkUnread?: () => void;
  onViewRelatedAction?: () => void;
  onOpenRelatedItem?: () => void;
}

export function NotificationDetailPanel({
  labId,
  notification,
  isUnread,
  onClose,
  onMarkRead,
  onMarkUnread,
  onViewRelatedAction,
  onOpenRelatedItem,
}: Props) {
  const hasRelatedItem =
    Boolean(onOpenRelatedItem) ||
    Boolean(notification.relatedActionId) ||
    Boolean(notification.relatedEntityId);
  return (
    <aside className="na-notif-detail" aria-label="Notification detail">
      <div className="na-notif-detail__header">
        <p className="na-notif-detail__category">
          {formatNotificationCategoryLine(notification.category)}
        </p>
        <div className="na-notif-detail__header-actions">
          {isUnread && onMarkRead && (
            <button type="button" className="na-notif-detail__text-btn" onClick={onMarkRead}>
              Mark as read
            </button>
          )}
          {!isUnread && onMarkUnread && (
            <button
              type="button"
              className="na-notif-detail__text-btn na-notif-detail__text-btn--muted"
              onClick={onMarkUnread}
            >
              Mark as unread
            </button>
          )}
          <button
            type="button"
            className="na-notif-detail__close"
            aria-label="Close detail"
            onClick={onClose}
          >
            <svg viewBox="0 0 16 16" width="14" height="14" fill="none" aria-hidden>
              <path
                d="M4 4l8 8M12 4l-8 8"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
              />
            </svg>
          </button>
        </div>
      </div>

      <h2 className="na-notif-detail__title">{notification.title}</h2>
      <p className="na-notif-detail__desc">{notification.description}</p>

      <dl className="na-notif-detail__meta">
        {notification.actor && (
          <div className="na-notif-detail__meta-row">
            <dt>From</dt>
            <dd>{notification.actor}</dd>
          </div>
        )}
        {notification.relatedEntityType && notification.relatedEntityId && (
          <div className="na-notif-detail__meta-row">
            <dt>Related</dt>
            <dd className="na-notif-detail__entity">
              {notification.relatedEntityType} {notification.relatedEntityId}
            </dd>
          </div>
        )}
        <div className="na-notif-detail__meta-row">
          <dt>Received</dt>
          <dd>
            <time dateTime={notification.timestamp}>
              {formatNotificationDateTime(notification.timestamp)}
            </time>
            <span className="na-notif-detail__relative">
              ({formatNotificationTime(notification.timestamp)})
            </span>
          </dd>
        </div>
      </dl>

      {hasRelatedItem && (
        <div className="na-notif-detail__actions">
          {onOpenRelatedItem && (
            <button type="button" className="na-action-link" onClick={onOpenRelatedItem}>
              Open related item
            </button>
          )}
          {notification.relatedActionId && (
            onViewRelatedAction ? (
              <button type="button" className="na-action-link" onClick={onViewRelatedAction}>
                View related action
              </button>
            ) : (
              <Link to={`/lab/${labId}/actions`} className="na-action-link">
                View related action
              </Link>
            )
          )}
        </div>
      )}
    </aside>
  );
}
