import type { InflowNotification } from "../../data/inflow/engineNotifications";
import type { LabTask } from "../../data/inflow/mockTasks";
import type {
  ActionCategory,
  ActionItem,
  ActionStatus,
  NotificationCategory,
  NotificationItem,
} from "../../data/labHome";

const TAG_TO_CATEGORY: Record<string, NotificationCategory> = {
  "ACTION CREATED": "EXCEPTION_CREATED",
  MENTION: "MENTION",
  "EXCEPTION RESOLVED": "EXCEPTION_RESOLVED",
  "ACTION VISIBLE TO ACCOUNT": "ACTION_SHARED",
  "ACTION ASSIGNED": "ACTION_ASSIGNED",
  "WATCHER ADDED": "ADDED_AS_WATCHER",
  COMMENT: "NEW_COMMENT",
  ATTACHMENT: "NEW_COMMENT",
  "ACTION RESOLVED": "EXCEPTION_RESOLVED",
  "ORDER UPDATED": "NEW_COMMENT",
};

function mapNotificationCategory(tag: string): NotificationCategory {
  return TAG_TO_CATEGORY[tag] ?? "NEW_COMMENT";
}

function parseTimestamp(createdAt: string): string {
  if (createdAt === "Just now") {
    return new Date().toISOString();
  }
  return createdAt;
}

export function inflowNotificationToUi(notification: InflowNotification, labId: number): NotificationItem {
  return {
    id: notification.id,
    category: mapNotificationCategory(notification.tag),
    title: notification.title,
    description: notification.detail,
    isRead: notification.read,
    timestamp: parseTimestamp(notification.createdAt),
    labId,
    relatedActionId: notification.taskId,
    relatedEntityType: notification.entityType,
    relatedEntityId: notification.entityId,
    actor: notification.actor,
  };
}

export function inflowNotificationsToUi(
  notifications: InflowNotification[],
  labId: number,
  recipient?: string,
): NotificationItem[] {
  return notifications
    .filter((notification) => (recipient ? notification.recipient === recipient : true))
    .map((notification) => inflowNotificationToUi(notification, labId));
}

function mapTaskCategory(category: string): ActionCategory {
  const normalized = category.toUpperCase();
  if (normalized.includes("NOT PERFORMED")) return "NOT_PERFORMED";
  if (normalized.includes("RECOLLECTION")) return "RECOLLECTION";
  if (normalized.includes("CRITICAL") || normalized.includes("QC")) return "CRITICAL";
  if (normalized.includes("OVERDUE") || normalized.includes("HOLD") || normalized.includes("CLAIM")) {
    return "OVERDUE";
  }
  if (normalized.includes("APPROVAL")) return "PENDING_APPROVAL";
  return "UNRESOLVED";
}

function mapTaskStatus(status: LabTask["status"]): ActionStatus {
  if (status === "RESOLVED") return "CLOSED";
  return "OPEN";
}

export function inflowTaskToActionItem(
  task: LabTask,
  currentUserName: string,
  taskUnreadCounts: Record<string, number>,
): ActionItem {
  const updateCount = taskUnreadCounts[task.id] ?? 0;
  return {
    id: task.id,
    category: mapTaskCategory(task.category),
    exceptionLabel: task.category,
    title: task.title,
    context: task.subtitle || task.patient,
    visibleToAccount: task.visibility === "shared_with_client",
    owner: {
      initials: task.assigneeInitials,
      name: task.assignee,
      color: task.assigneeColor,
    },
    status: mapTaskStatus(task.status),
    assignedToMe: task.assignee === currentUserName,
    reportedByMe: task.reportedBy === currentUserName || task.createdBy === currentUserName,
    hasUpdates: updateCount > 0,
    updateCount: updateCount > 0 ? updateCount : undefined,
  };
}

export function inflowTasksToActionItems(
  tasks: LabTask[],
  currentUserName: string,
  taskUnreadCounts: Record<string, number>,
): ActionItem[] {
  return tasks.map((task) => inflowTaskToActionItem(task, currentUserName, taskUnreadCounts));
}
