export type InflowNotificationEntityType = "task" | "order" | "sample" | "report" | "comment";

export type InflowNotification = {
  id: string;
  tag: string;
  title: string;
  detail: string;
  type: string;
  source: string;
  time: string;
  recipient: string;
  actor: string;
  entityType: InflowNotificationEntityType;
  entityId: string;
  taskId?: string;
  createdAt: string;
  read: boolean;
};

export type InflowNotificationEvent = {
  tag: string;
  title: string;
  detail: string;
  type: string;
  recipient: string;
  actor: string;
  entityType: InflowNotificationEntityType;
  entityId: string;
  taskId?: string;
};

export const createInflowNotification = (
  event: InflowNotificationEvent,
  createdAt = "Just now",
): InflowNotification => ({
  ...event,
  id: `N-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
  source: event.actor,
  time: createdAt,
  createdAt,
  read: false,
});

export const createInflowNotifications = (
  events: InflowNotificationEvent[],
  createdAt = "Just now",
): InflowNotification[] => events.map((event) => createInflowNotification(event, createdAt));

export const uniqueRecipients = (recipients: string[], actor?: string) =>
  Array.from(new Set(recipients.filter((recipient) => recipient && recipient !== actor)));
