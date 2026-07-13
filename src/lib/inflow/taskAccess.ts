import type { Order } from "../../data/inflow/mockOrders";
import type { Report } from "../../data/inflow/mockReports";
import type { Sample } from "../../data/inflow/mockSamples";
import type { LabTask, TaskUser } from "../../data/inflow/mockTasks";
import { clientUsers, taskUsers } from "../../data/inflow/mockTasks";
import { uniqueRecipients } from "../../data/inflow/engineNotifications";

type EntityGraph = {
  orders: Order[];
  samples: Sample[];
  reports: Report[];
};

export function getTaskClientAccount(task: LabTask, graph: EntityGraph): string | null {
  if (task.sourceLevel === "order") {
    return graph.orders.find((order) => String(order.id) === task.sourceId)?.account ?? null;
  }
  if (task.sourceLevel === "bill") {
    return (
      graph.orders.find((order) => order.bills.some((bill) => String(bill.id) === task.sourceId))?.account ??
      null
    );
  }
  if (task.sourceLevel === "sample") {
    return graph.samples.find((sample) => sample.id === task.sourceId)?.accountName ?? null;
  }
  if (task.sourceLevel === "report") {
    return graph.reports.find((report) => report.id === task.sourceId)?.account ?? null;
  }
  return null;
}

export function userCanAccessTask(
  task: LabTask,
  user: TaskUser,
  graph: EntityGraph,
): boolean {
  return (
    user.role === "lab" ||
    (task.visibility === "shared_with_client" &&
      Boolean(user.organization && user.organization === getTaskClientAccount(task, graph)))
  );
}

export function getUserByName(name: string): TaskUser | undefined {
  return taskUsers.find((user) => user.assignee === name);
}

export function getAllowedTaskUsers(task: LabTask, graph: EntityGraph): TaskUser[] {
  return taskUsers.filter((user) => userCanAccessTask(task, user, graph));
}

export function getClientRecipientsForAccount(account: string | null): string[] {
  return clientUsers
    .filter((user) => Boolean(account && user.organization === account))
    .map((user) => user.assignee);
}

export function getSharedClientRecipients(task: LabTask, graph: EntityGraph): string[] {
  return task.visibility === "shared_with_client"
    ? getClientRecipientsForAccount(getTaskClientAccount(task, graph))
    : [];
}

export function getAllowedRecipients(
  task: LabTask,
  recipients: string[],
  graph: EntityGraph,
  actor?: string,
): string[] {
  return uniqueRecipients(
    recipients.filter((recipient) => {
      const user = getUserByName(recipient);
      return user ? userCanAccessTask(task, user, graph) : false;
    }),
    actor,
  );
}

export function getTaskWatchers(task: LabTask, graph: EntityGraph): string[] {
  return Array.from(
    new Set(
      (task.watchers ?? []).filter((watcher) => {
        const user = getUserByName(watcher);
        return user ? userCanAccessTask(task, user, graph) : false;
      }),
    ),
  );
}
