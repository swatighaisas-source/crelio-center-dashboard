import type { InflowNotification } from "../../../data/inflow/engineNotifications";

type Props = {
  notification: InflowNotification;
  onClose: () => void;
  onOpenRelated: (notification: InflowNotification) => void;
};

export function NotificationDetailModal({ notification, onClose, onOpenRelated }: Props) {
  return (
    <div className="notification-detail-backdrop">
      <section className="notification-detail-modal" role="dialog" aria-modal="true" aria-label="Notification detail">
        <button className="notification-detail-close" onClick={onClose} aria-label="Close notification detail">
          ×
        </button>
        <header>
          <span className="notification-detail-tag">{notification.tag}</span>
          <h2>{notification.title}</h2>
          <p>{notification.detail}</p>
        </header>

        <dl>
          <dt>Notification ID</dt>
          <dd>{notification.id}</dd>
          <dt>Type</dt>
          <dd>{notification.type}</dd>
          <dt>Source</dt>
          <dd>{notification.source}</dd>
          <dt>Received</dt>
          <dd>{notification.time}</dd>
          <dt>Status</dt>
          <dd>{notification.read ? "Read" : "Unread"}</dd>
          <dt>Recipient</dt>
          <dd>{notification.recipient}</dd>
          <dt>Related Item</dt>
          <dd>{notification.entityType.toUpperCase()} {notification.entityId}</dd>
        </dl>

        <footer>
          <button onClick={onClose}>Close</button>
          <button className="primary" onClick={() => onOpenRelated(notification)}>
            Open Related Item
          </button>
        </footer>
      </section>
    </div>
  );
}
