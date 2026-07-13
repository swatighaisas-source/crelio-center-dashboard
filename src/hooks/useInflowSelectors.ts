import { useMemo } from "react";
import { canSendNotifications } from "../data/inflow/rolloutConfig";
import type { InflowNotification } from "../data/inflow/engineNotifications";
import type { LabTask } from "../data/inflow/mockTasks";
import { useInflow } from "../context/InflowContext";

export function useInflowSelectors() {
  const inflow = useInflow();
  const { currentUser, visibleTasks, notifications, tasks, rolloutConfig, graph } = inflow;
  const isLabUser = currentUser.role === "lab";

  const currentUserNotifications = useMemo(
    () =>
      notifications.filter((notification) => {
        if (notification.recipient !== currentUser.assignee) return false;
        if (!notification.taskId) return true;
        const task = tasks.find((item) => item.id === notification.taskId);
        return task ? inflow.userCanAccessTask(task) : false;
      }),
    [notifications, currentUser.assignee, tasks, inflow],
  );

  const unreadNotificationCount = useMemo(
    () =>
      currentUserNotifications.filter((notification) => !notification.read).length,
    [currentUserNotifications],
  );

  const assignedToCurrentUserOpenTasks = useMemo(
    () =>
      isLabUser
        ? visibleTasks.filter(
            (task) => task.assignee === currentUser.assignee && task.status === "OPEN",
          )
        : visibleTasks.filter((task) => task.status === "OPEN"),
    [currentUser.assignee, isLabUser, visibleTasks],
  );

  const openActionCount = assignedToCurrentUserOpenTasks.length;

  const taskUnreadCounts = useMemo(
    () =>
      currentUserNotifications.reduce<Record<string, number>>((counts, notification) => {
        if (!notification.taskId || notification.read) return counts;
        counts[notification.taskId] = (counts[notification.taskId] ?? 0) + 1;
        return counts;
      }, {}),
    [currentUserNotifications],
  );

  const taskNotificationMap = useMemo(
    () =>
      currentUserNotifications
        .filter((notification) => notification.taskId)
        .reduce<Record<string, InflowNotification[]>>((grouped, notification) => {
          if (!notification.taskId) return grouped;
          grouped[notification.taskId] = [...(grouped[notification.taskId] ?? []), notification];
          return grouped;
        }, {}),
    [currentUserNotifications],
  );

  const rolloutTasksDisabled = !canSendNotifications(rolloutConfig);

  return {
    currentUser,
    isLabUser,
    visibleTasks,
    currentUserNotifications,
    unreadNotificationCount,
    openActionCount,
    assignedToCurrentUserOpenTasks,
    taskUnreadCounts,
    taskNotificationMap,
    rolloutTasksDisabled,
    graph,
  };
}

export function useTaskModalSelectors(selectedTask: LabTask | null) {
  const inflow = useInflow();

  const linkedTasksForException = useMemo(() => {
    if (
      !selectedTask?.exceptionKey ||
      !selectedTask.sourceLevel ||
      selectedTask.sourceId == null
    ) {
      return [];
    }
    return inflow.tasks.filter(
      (task) =>
        task.status === "OPEN" &&
        task.sourceLevel === selectedTask.sourceLevel &&
        task.sourceId === selectedTask.sourceId &&
        task.exceptionKey === selectedTask.exceptionKey,
    );
  }, [inflow.tasks, selectedTask]);

  const affectedUsersForExceptionResolve = useMemo(
    () =>
      Array.from(
        new Set(
          linkedTasksForException
            .flatMap((task) => [task.assignee, ...(task.watchers ?? [])])
            .filter(Boolean),
        ),
      ),
    [linkedTasksForException],
  );

  return { linkedTasksForException, affectedUsersForExceptionResolve };
}
