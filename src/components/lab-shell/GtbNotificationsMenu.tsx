import { Link } from "react-router-dom";
import {
  formatNotificationTime,
  getLatestNotifications,
  getUnreadNotificationCount,
  type NotificationItem,
} from "../../data/labHome";

interface Props {
  labId: number;
  notifications: NotificationItem[];
  onClose: () => void;
  maxItems?: number;
  onSelectNotification?: (notification: NotificationItem) => void;
}

export function GtbNotificationsMenu({
  labId,
  notifications,
  onClose,
  maxItems = 4,
  onSelectNotification,
}: Props) {
  const unreadOnly = notifications.filter((n) => !n.isRead);
  const unreadCount = getUnreadNotificationCount(unreadOnly);
  const items = getLatestNotifications(unreadOnly, maxItems);

  return (
    <div className="gtb__menu gtb__menu--feed" role="menu" aria-label="Notifications">
      <p className="gtb__menu-summary">
        {unreadCount > 0
          ? `${unreadCount} unread notification${unreadCount === 1 ? "" : "s"}`
          : "No unread notifications"}
      </p>

      {items.length === 0 ? (
        <p className="gtb__feed-empty">You&apos;re all caught up.</p>
      ) : (
        <ul className="gtb__feed-list">
          {items.map((notif) => (
            <li key={notif.id}>
              {onSelectNotification ? (
                <button
                  type="button"
                  className={`gtb__feed-item gtb__feed-item--btn${notif.isRead ? "" : " gtb__feed-item--unread"}`}
                  role="menuitem"
                  onClick={() => {
                    onSelectNotification(notif);
                    onClose();
                  }}
                >
                  <span className="gtb__feed-item__dot" aria-hidden />
                  <span className="gtb__feed-item__main">
                    <span className="gtb__feed-item__title">{notif.title}</span>
                    <span className="gtb__feed-item__desc">{notif.description}</span>
                  </span>
                  <span className="gtb__feed-item__meta">
                    <span className="gtb__feed-item__time">
                      {formatNotificationTime(notif.timestamp)}
                    </span>
                  </span>
                </button>
              ) : (
                <Link
                  to={`/lab/${labId}/notifications`}
                  className={`gtb__feed-item${notif.isRead ? "" : " gtb__feed-item--unread"}`}
                  role="menuitem"
                  onClick={onClose}
                >
                  <span className="gtb__feed-item__dot" aria-hidden />
                  <span className="gtb__feed-item__main">
                    <span className="gtb__feed-item__title">{notif.title}</span>
                    <span className="gtb__feed-item__desc">{notif.description}</span>
                  </span>
                  <span className="gtb__feed-item__meta">
                    <span className="gtb__feed-item__time">
                      {formatNotificationTime(notif.timestamp)}
                    </span>
                  </span>
                </Link>
              )}
            </li>
          ))}
        </ul>
      )}

      <Link
        to={`/lab/${labId}/notifications`}
        className="gtb__menu-footer"
        role="menuitem"
        onClick={onClose}
      >
        Open Notifications
        <span aria-hidden>→</span>
      </Link>
    </div>
  );
}
