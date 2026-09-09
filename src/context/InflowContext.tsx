import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useReducer,
  type ReactNode,
} from "react";
import { useParams } from "react-router-dom";
import type { ExceptionRecord, ExceptionSourceLevel } from "../data/inflow/exceptionTypes";
import {
  canDismissReport,
  canRestoreReport,
  emptyDismissSummary,
  type DismissReportInput,
  type DismissReportSummary,
} from "../data/inflow/dismissReport";
import {
  createInflowNotifications,
  type InflowNotification,
  type InflowNotificationEvent,
  uniqueRecipients,
} from "../data/inflow/engineNotifications";
import { createLabInflowState, type LabInflowState } from "../data/inflow/labInflowState";
import { exceptionLabels, type ExceptionKey, type Order } from "../data/inflow/mockOrders";
import type { Report } from "../data/inflow/mockReports";
import type { Sample } from "../data/inflow/mockSamples";
import type { LabTask, TaskAssignee, TaskComment, TaskUser, TaskVisibility } from "../data/inflow/mockTasks";
import { taskAssignees, taskUsers } from "../data/inflow/mockTasks";
import {
  canCreateTask,
  canSendNotifications,
  canShareWithClient,
  canUseThreadedComments,
  getDefaultVisibility,
  resolveDefaultAssigneeUser,
  type RolloutConfig,
} from "../data/inflow/rolloutConfig";
import {
  getExceptionsForOrder,
  getExceptionsForReport,
  getExceptionsForSample,
} from "../lib/inflow/exceptionPropagation";
import {
  getOpenTasksForEntity,
  getOpenTasksForEntityChain,
  getTaskSourceSummary,
} from "../lib/inflow/entityRefs";
import {
  getAllowedRecipients,
  getAllowedTaskUsers,
  getClientRecipientsForAccount,
  getSharedClientRecipients,
  getTaskClientAccount,
  getTaskWatchers,
  getUserByName,
  userCanAccessTask,
} from "../lib/inflow/taskAccess";
import { isDismissReportPermissionEnabled } from "../data/centerUserRoles";

type SelectionState = {
  selectedOrderId: number | null;
  selectedReportId: string | null;
  selectedSampleId: string | null;
  redrawSampleId: string | null;
  selectedTaskId: string | null;
  selectedNotificationId: string | null;
};

const emptySelection: SelectionState = {
  selectedOrderId: null,
  selectedReportId: null,
  selectedSampleId: null,
  redrawSampleId: null,
  selectedTaskId: null,
  selectedNotificationId: null,
};

export type InflowContextValue = {
  labId: number;
  state: LabInflowState;
  graph: { orders: Order[]; samples: Sample[]; reports: Report[] };
  selection: SelectionState;
  isLabUser: boolean;
  currentUser: TaskUser;
  rolloutConfig: RolloutConfig;
  orders: Order[];
  samples: Sample[];
  reports: Report[];
  tasks: LabTask[];
  visibleTasks: LabTask[];
  notifications: InflowNotification[];
  taskComments: TaskComment[];
  exceptionRecords: ExceptionRecord[];
  pendingCollectionSamples: Sample[];
  selectedOrder: Order | null;
  selectedReport: Report | null;
  selectedSample: Sample | null;
  redrawSample: Sample | null;
  redrawSampleServices: string[];
  selectedTask: LabTask | null;
  selectedNotification: InflowNotification | null;
  setRolloutConfig: (config: RolloutConfig) => void;
  setCurrentUser: (user: TaskUser) => void;
  setSelectedOrderId: (id: number | null) => void;
  setSelectedReportId: (id: string | null) => void;
  setSelectedSampleId: (id: string | null) => void;
  setRedrawSampleId: (id: string | null) => void;
  setSelectedTaskId: (id: string | null) => void;
  setSelectedNotificationId: (id: string | null) => void;
  clearSelection: () => void;
  getExceptionsForOrder: (order: Order) => ReturnType<typeof getExceptionsForOrder>;
  getExceptionsForReport: (report: Report) => ReturnType<typeof getExceptionsForReport>;
  getExceptionsForSample: (sample: Sample) => ReturnType<typeof getExceptionsForSample>;
  getOpenTasksForEntityChain: (sourceLevel: ExceptionSourceLevel, sourceId: string) => LabTask[];
  getTaskSourceSummary: (task: LabTask) => ReturnType<typeof getTaskSourceSummary>;
  getTaskClientAccount: (task: LabTask) => string | null;
  userCanAccessTask: (task: LabTask, user?: TaskUser) => boolean;
  updateOrder: (order: Order) => void;
  createOrder: (order: Order) => void;
  createException: (
    sourceLevel: ExceptionSourceLevel,
    sourceId: string,
    exceptionKeys: ExceptionKey[],
    comment: string,
    account?: string | null,
  ) => void;
  resolveException: (
    sourceLevel: ExceptionSourceLevel,
    sourceId: string,
    exceptionKeys: ExceptionKey[],
    comment: string,
  ) => void;
  collectSample: (sampleId: string) => void;
  splitSampleForRedraw: (sampleId: string, selectedServices: string[], comment: string) => void;
  dismissReports: (input: DismissReportInput) => DismissReportSummary;
  restoreReport: (reportId: string) => { ok: boolean; reason?: string };
  canDismissReports: boolean;
  updateTaskAssignee: (taskId: string, assignee: TaskAssignee) => void;
  addTaskComment: (taskId: string, text: string, internal: boolean, attachments?: boolean) => void;
  resolveTask: (taskId: string) => void;
  resolveTaskViaException: (taskId: string, comment: string) => void;
  addManualTaskWatcher: (taskId: string, user: string) => void;
  removeTaskWatcher: (taskId: string, user: string) => void;
  updateTaskVisibility: (taskId: string, visibility: TaskVisibility) => void;
  openNotification: (notificationId: string) => void;
  openTaskAndMarkNotificationsRead: (taskId: string) => void;
  markAllNotificationsRead: () => void;
  markNotificationRead: (notificationId: string) => void;
  markNotificationUnread: (notificationId: string) => void;
  canShareWithClientForTask: (task: LabTask) => boolean;
  canUseThreadedCommentsForTask: (task: LabTask) => boolean;
  labUsers: TaskAssignee[];
  allUsers: TaskUser[];
  getAllowedTaskUsers: (task: LabTask) => TaskUser[];
};

const InflowContext = createContext<InflowContextValue | null>(null);

const labStates = new Map<number, LabInflowState>();

function getLabState(labId: number): LabInflowState {
  if (!labStates.has(labId)) {
    labStates.set(labId, createLabInflowState(labId));
  }
  return labStates.get(labId)!;
}

export function InflowProvider({ children }: { children: ReactNode }) {
  const { id } = useParams<{ id: string }>();
  const labId = Number(id) || 1;
  const [, bump] = useReducer((n: number) => n + 1, 0);
  const [selection, setSelection] = useReducer(
    (prev: SelectionState, patch: Partial<SelectionState>) => ({ ...prev, ...patch }),
    emptySelection,
  );

  const state = getLabState(labId);
  const graph = useMemo(
    () => ({ orders: state.orders, samples: state.samples, reports: state.reports }),
    [state.orders, state.samples, state.reports],
  );

  const patchState = useCallback(
    (updater: (current: LabInflowState) => LabInflowState) => {
      labStates.set(labId, updater(getLabState(labId)));
      bump();
    },
    [labId],
  );

  const currentUser = state.currentUser;
  const isLabUser = currentUser.role === "lab";

  const pushNotifications = useCallback(
    (events: InflowNotificationEvent[]) => {
      if (!events.length) return;
      patchState((current) => ({
        ...current,
        notifications: [...createInflowNotifications(events), ...current.notifications],
      }));
    },
    [patchState],
  );

  const notifyTaskWatchers = useCallback(
    (
      task: LabTask,
      event: Omit<InflowNotificationEvent, "recipient" | "actor" | "entityType" | "entityId" | "taskId">,
      actor = currentUser.assignee,
      extraRecipients: string[] = [],
    ) => {
      if (!canSendNotifications(state.rolloutConfig)) return;
      const recipients = getAllowedRecipients(
        task,
        [...getTaskWatchers(task, graph), ...extraRecipients],
        graph,
        actor,
      );
      pushNotifications(
        recipients.map((recipient) => ({
          ...event,
          recipient,
          actor,
          entityType: "task",
          entityId: task.id,
          taskId: task.id,
        })),
      );
    },
    [currentUser.assignee, graph, pushNotifications, state.rolloutConfig],
  );

  const visibleTasks = useMemo(
    () => state.tasks.filter((task) => userCanAccessTask(task, currentUser, graph)),
    [state.tasks, currentUser, graph],
  );

  const pendingCollectionSamples = useMemo(
    () =>
      state.samples.filter((sample) => {
        const propagated = getExceptionsForSample(sample, state.exceptionRecords, graph);
        return propagated.directActive.some(
          (record) =>
            record.exceptionKey === "recollection_required" &&
            record.sourceLevel === "sample" &&
            record.sourceId === sample.id,
        );
      }),
    [state.samples, state.exceptionRecords, graph],
  );

  const selectedOrder = useMemo(
    () => state.orders.find((order) => order.id === selection.selectedOrderId) ?? null,
    [state.orders, selection.selectedOrderId],
  );
  const selectedReport = useMemo(
    () => state.reports.find((report) => report.id === selection.selectedReportId) ?? null,
    [state.reports, selection.selectedReportId],
  );
  const selectedSample = useMemo(
    () => state.samples.find((sample) => sample.id === selection.selectedSampleId) ?? null,
    [state.samples, selection.selectedSampleId],
  );
  const redrawSample = useMemo(
    () => state.samples.find((sample) => sample.id === selection.redrawSampleId) ?? null,
    [state.samples, selection.redrawSampleId],
  );
  const selectedTask = useMemo(() => {
    const task = state.tasks.find((item) => item.id === selection.selectedTaskId) ?? null;
    return task && userCanAccessTask(task, currentUser, graph) ? task : null;
  }, [state.tasks, selection.selectedTaskId, currentUser, graph]);
  const selectedNotification = useMemo(
    () =>
      state.notifications.find((notification) => notification.id === selection.selectedNotificationId) ??
      null,
    [state.notifications, selection.selectedNotificationId],
  );

  const createException = useCallback(
    (
      sourceLevel: ExceptionSourceLevel,
      sourceId: string,
      exceptionKeys: ExceptionKey[],
      comment: string,
      account?: string | null,
    ) => {
      if (!isLabUser) return;
      const now = Date.now();
      const nextRecords: ExceptionRecord[] = exceptionKeys.map((exceptionKey, index) => ({
        id: `${sourceLevel}-${sourceId}-${exceptionKey}-${now}-${index}`,
        sourceLevel,
        sourceId,
        exceptionKey,
        comment: comment || "Awaiting More details",
        status: "active",
        createdAt: "23rd Mar 2026 12:23 PM",
        createdBy: currentUser.assignee,
      }));

      patchState((current) => {
        const exceptionRecords = [...nextRecords, ...current.exceptionRecords];
        const taskableRecords = nextRecords.filter((record) =>
          canCreateTask(current.rolloutConfig, record.exceptionKey, account),
        );
        if (!taskableRecords.length) {
          return { ...current, exceptionRecords };
        }

        const nextTasks: LabTask[] = taskableRecords.map((record) => {
          const defaultOwner = resolveDefaultAssigneeUser(current.rolloutConfig, record.exceptionKey, {
            requester: currentUser,
            account,
          });
          const defaultVisibility = canShareWithClient(current.rolloutConfig, account)
            ? getDefaultVisibility(current.rolloutConfig, record.exceptionKey)
            : "lab_internal";
          return {
            id: `task-${record.id}`,
            category: exceptionLabels[record.exceptionKey].toUpperCase(),
            categoryClass: "exception",
            sourceLevel: record.sourceLevel,
            sourceId: record.sourceId,
            exceptionKey: record.exceptionKey,
            title: `${exceptionLabels[record.exceptionKey]} exception raised at ${record.sourceLevel} level (${record.sourceId})`,
            subtitle: record.comment,
            assignee: defaultOwner.assignee,
            assigneeInitials: defaultOwner.assigneeInitials,
            assigneeColor: defaultOwner.assigneeColor,
            patient: `${record.sourceLevel.toUpperCase()} ${record.sourceId}`,
            visibility: defaultVisibility,
            sharedWith: [],
            status: "OPEN",
            description: record.comment,
            createdBy: currentUser.assignee,
            reportedBy: currentUser.assignee,
            createdAt: "Just now",
            watchers: uniqueRecipients([defaultOwner.assignee, currentUser.assignee]),
          };
        });

        const tasks = [...nextTasks, ...current.tasks];
        if (canSendNotifications(current.rolloutConfig, account)) {
          nextTasks.forEach((task) =>
            notifyTaskWatchers(task, {
              tag: "ACTION CREATED",
              title: `${currentUser.assignee} created an action`,
              detail: task.title,
              type: "Action",
            }),
          );
        }
        return { ...current, exceptionRecords, tasks };
      });
    },
    [currentUser, isLabUser, notifyTaskWatchers, patchState],
  );

  const resolveException = useCallback(
    (
      sourceLevel: ExceptionSourceLevel,
      sourceId: string,
      exceptionKeys: ExceptionKey[],
      comment: string,
    ) => {
      if (!isLabUser) return;
      const affectedTasks = state.tasks.filter(
        (task) =>
          task.sourceLevel === sourceLevel &&
          task.sourceId === sourceId &&
          task.exceptionKey &&
          exceptionKeys.includes(task.exceptionKey as ExceptionKey),
      );

      patchState((current) => ({
        ...current,
        exceptionRecords: current.exceptionRecords.map((record) => {
          if (
            record.sourceLevel !== sourceLevel ||
            record.sourceId !== sourceId ||
            !exceptionKeys.includes(record.exceptionKey) ||
            record.status !== "active"
          ) {
            return record;
          }
          return {
            ...record,
            status: "resolved",
            resolvedAt: "23rd Mar 2026 12:29 PM",
            resolvedBy: currentUser.assignee,
            resolutionComment: comment || `Resolved at ${sourceLevel} level`,
          };
        }),
        tasks: current.tasks.map((task) => {
          if (
            task.sourceLevel === sourceLevel &&
            task.sourceId === sourceId &&
            task.exceptionKey &&
            exceptionKeys.includes(task.exceptionKey as ExceptionKey)
          ) {
            return { ...task, status: "RESOLVED" };
          }
          return task;
        }),
      }));

      affectedTasks.forEach((task) =>
        notifyTaskWatchers(task, {
          tag: "EXCEPTION RESOLVED",
          title: `${currentUser.assignee} resolved an exception action`,
          detail: task.title,
          type: "Action",
        }),
      );
    },
    [currentUser.assignee, isLabUser, notifyTaskWatchers, patchState, state.tasks],
  );

  const value: InflowContextValue = {
    labId,
    state,
    graph,
    selection,
    isLabUser,
    currentUser,
    rolloutConfig: state.rolloutConfig,
    orders: state.orders,
    samples: state.samples,
    reports: state.reports,
    tasks: state.tasks,
    visibleTasks,
    notifications: state.notifications,
    taskComments: state.taskComments,
    exceptionRecords: state.exceptionRecords,
    pendingCollectionSamples,
    selectedOrder,
    selectedReport,
    selectedSample,
    redrawSample,
    redrawSampleServices: redrawSample?.services ?? [],
    selectedTask,
    selectedNotification,
    setRolloutConfig: (config) => patchState((current) => ({ ...current, rolloutConfig: config })),
    setCurrentUser: (user) => patchState((current) => ({ ...current, currentUser: user })),
    setSelectedOrderId: (selectedOrderId) => setSelection({ selectedOrderId }),
    setSelectedReportId: (selectedReportId) => setSelection({ selectedReportId }),
    setSelectedSampleId: (selectedSampleId) => setSelection({ selectedSampleId }),
    setRedrawSampleId: (redrawSampleId) => setSelection({ redrawSampleId }),
    setSelectedTaskId: (selectedTaskId) => setSelection({ selectedTaskId }),
    setSelectedNotificationId: (selectedNotificationId) => setSelection({ selectedNotificationId }),
    clearSelection: () => setSelection(emptySelection),
    getExceptionsForOrder: (order) =>
      getExceptionsForOrder(order.id, state.exceptionRecords, graph),
    getExceptionsForReport: (report) => getExceptionsForReport(report, state.exceptionRecords),
    getExceptionsForSample: (sample) =>
      getExceptionsForSample(sample, state.exceptionRecords, graph),
    getOpenTasksForEntityChain: (sourceLevel, sourceId) =>
      getOpenTasksForEntityChain(state.tasks, sourceLevel, sourceId, graph),
    getTaskSourceSummary: (task) => getTaskSourceSummary(task, graph),
    getTaskClientAccount: (task) => getTaskClientAccount(task, graph),
    userCanAccessTask: (task, user = currentUser) => userCanAccessTask(task, user, graph),
    getAllowedTaskUsers: (task) => getAllowedTaskUsers(task, graph),
    updateOrder: (nextOrder) => {
      if (!isLabUser) return;
      patchState((current) => ({
        ...current,
        orders: current.orders.map((order) => (order.id === nextOrder.id ? nextOrder : order)),
      }));
      getOpenTasksForEntity(state.tasks, "order", String(nextOrder.id)).forEach((task) =>
        notifyTaskWatchers(task, {
          tag: "ORDER UPDATED",
          title: `${currentUser.assignee} updated an order linked to your action`,
          detail: task.title,
          type: "Order",
        }),
      );
    },
    createOrder: (order) => {
      if (!isLabUser) return;
      patchState((current) => ({
        ...current,
        orders: [order, ...current.orders.filter((existing) => existing.id !== order.id)],
      }));
    },
    createException,
    resolveException,
    collectSample: (sampleId) =>
      resolveException("sample", sampleId, ["recollection_required"], "Sample recollected."),
    splitSampleForRedraw: (sampleId, selectedServices, comment) => {
      if (!isLabUser) return;
      const original = state.samples.find((sample) => sample.id === sampleId);
      if (!original || selectedServices.length === 0) return;
      const fallbackComment = comment || "Redraw requested. Recollection required for this sample.";
      if (selectedServices.length === original.services.length) {
        createException("sample", sampleId, ["recollection_required"], fallbackComment, original.accountName);
        return;
      }
      const remaining = original.services.filter((service) => !selectedServices.includes(service));
      const newSampleId = `${original.id}-r${Date.now()}`;
      patchState((current) => ({
        ...current,
        reports: current.reports.map((report) => {
          if (report.sampleId !== sampleId) return report;
          if (!selectedServices.includes(report.service)) return report;
          return { ...report, sampleId: newSampleId };
        }),
        samples: current.samples
          .map((sample) => (sample.id === sampleId ? { ...sample, services: remaining } : sample))
          .concat({
            ...original,
            id: newSampleId,
            parentSampleId: original.parentSampleId ?? original.id,
            services: selectedServices,
            exceptions: { active: [], activity: [] },
          }),
      }));
      createException(
        "sample",
        newSampleId,
        ["recollection_required"],
        fallbackComment,
        original.accountName,
      );
    },
    dismissReports: (input) => {
      const summary = emptyDismissSummary(input.reportIds.length);
      if (!isLabUser || !isDismissReportPermissionEnabled()) {
        for (const reportId of input.reportIds) {
          const report = state.reports.find((item) => item.id === reportId);
          summary.failed.push({
            reportId,
            accessionNo: report?.accessionNo ?? "—",
            service: report?.service ?? "—",
            patientName: report?.patientName ?? "—",
            reason: "You do not have permission to dismiss reports.",
          });
        }
        return summary;
      }

      const reason = input.reason.trim();
      if (!reason) {
        for (const reportId of input.reportIds) {
          const report = state.reports.find((item) => item.id === reportId);
          summary.failed.push({
            reportId,
            accessionNo: report?.accessionNo ?? "—",
            service: report?.service ?? "—",
            patientName: report?.patientName ?? "—",
            reason: "Dismiss reason is required.",
          });
        }
        return summary;
      }

      const dismissedAt = new Date().toISOString();
      const remarks = input.remarks.trim();
      const succeedIds: string[] = [];

      // Process independently so one failure does not block the rest.
      for (const reportId of input.reportIds) {
        const report = state.reports.find((item) => item.id === reportId);
        const check = canDismissReport(report);
        if (!report || !check.ok) {
          summary.failed.push({
            reportId,
            accessionNo: report?.accessionNo ?? "—",
            service: report?.service ?? "—",
            patientName: report?.patientName ?? "—",
            reason: check.reason ?? "Unable to dismiss this test.",
          });
          continue;
        }

        succeedIds.push(reportId);
        summary.succeeded.push({
          reportId: report.id,
          accessionNo: report.accessionNo,
          service: report.service,
          patientName: report.patientName,
        });
      }

      if (succeedIds.length > 0) {
        const succeedSet = new Set(succeedIds);
        patchState((current) => ({
          ...current,
          reports: current.reports.map((report) => {
            if (!succeedSet.has(report.id)) return report;
            return {
              ...report,
              status: "Dismissed" as const,
              dismissal: {
                reason,
                remarks,
                dismissedBy: input.dismissedBy,
                dismissedAt,
                source: input.source,
              },
            };
          }),
        }));

        if (selection.selectedReportId && succeedSet.has(selection.selectedReportId)) {
          setSelection({ selectedReportId: null });
        }

        // Downstream notification stub (mirrors existing task-watcher style alerts).
        pushNotifications(
          succeedIds.flatMap((reportId) => {
            const report = state.reports.find((item) => item.id === reportId);
            if (!report) return [];
            return [
              {
                recipient: currentUser.assignee,
                actor: input.dismissedBy,
                tag: "REPORT DISMISSED",
                title: `${input.dismissedBy} dismissed a report`,
                detail: `${report.service} · ${report.accessionNo} · ${input.source}`,
                type: "Report" as const,
                entityType: "report" as const,
                entityId: report.id,
              },
            ];
          }),
        );
      }

      return summary;
    },
    restoreReport: (reportId) => {
      if (!isLabUser || !isDismissReportPermissionEnabled()) {
        return { ok: false, reason: "You do not have permission to restore reports." };
      }
      const report = state.reports.find((item) => item.id === reportId);
      const check = canRestoreReport(report);
      if (!report || !check.ok) {
        return { ok: false, reason: check.reason ?? "Unable to restore this report." };
      }

      patchState((current) => ({
        ...current,
        reports: current.reports.map((item) => {
          if (item.id !== reportId) return item;
          const { dismissal: _dismissal, ...rest } = item;
          return {
            ...rest,
            status: "Received" as const,
          };
        }),
      }));

      pushNotifications([
        {
          recipient: currentUser.assignee,
          actor: currentUser.assignee,
          tag: "REPORT RESTORED",
          title: `${currentUser.assignee} restored a report`,
          detail: `${report.service} · ${report.accessionNo}`,
          type: "Report",
          entityType: "report",
          entityId: report.id,
        },
      ]);

      return { ok: true };
    },
    canDismissReports: isLabUser && isDismissReportPermissionEnabled(),
    updateTaskAssignee: (taskId, assignee) => {
      if (!isLabUser || assignee.role !== "lab") return;
      const currentTask = state.tasks.find((task) => task.id === taskId);
      patchState((current) => ({
        ...current,
        tasks: current.tasks.map((task) =>
          task.id === taskId
            ? {
                ...task,
                ...assignee,
                watchers: Array.from(
                  new Set([
                    ...getTaskWatchers(task, graph),
                    assignee.assignee,
                    currentUser.assignee,
                  ]),
                ),
              }
            : task,
        ),
      }));
      if (currentTask && currentTask.assignee !== assignee.assignee) {
        const nextTask = {
          ...currentTask,
          ...assignee,
          watchers: getAllowedRecipients(
            currentTask,
            [...getTaskWatchers(currentTask, graph), assignee.assignee, currentUser.assignee],
            graph,
          ),
        };
        notifyTaskWatchers(nextTask, {
          tag: "ACTION ASSIGNED",
          title: `${currentUser.assignee} assigned an action`,
          detail: currentTask.title,
          type: "Action",
        });
      }
    },
    addTaskComment: (taskId, text, internal, attachments = false) => {
      const task = state.tasks.find((item) => item.id === taskId);
      if (!task || !text.trim() || !userCanAccessTask(task, currentUser, graph)) return;
      const isInternal = isLabUser ? internal : false;
      const comment: TaskComment = {
        id: `comment-${taskId}-${Date.now()}`,
        taskId,
        author: currentUser.assignee,
        text: text.trim(),
        createdAt: "Just now",
        attachments,
        internal: isInternal,
      };
      const mentionedUsers = getAllowedRecipients(
        task,
        taskUsers
          .filter((user) => text.toLowerCase().includes(`@${user.assignee}`.toLowerCase()))
          .map((user) => user.assignee),
        graph,
        currentUser.assignee,
      );
      patchState((current) => ({
        ...current,
        taskComments: [...current.taskComments, comment],
        tasks: current.tasks.map((item) =>
          item.id === taskId
            ? {
                ...item,
                watchers: getAllowedRecipients(
                  item,
                  [...getTaskWatchers(item, graph), currentUser.assignee, ...mentionedUsers],
                  graph,
                ),
              }
            : item,
        ),
      }));
      const recipients = isInternal
        ? uniqueRecipients(
            [...getTaskWatchers(task, graph), currentUser.assignee, ...mentionedUsers].filter(
              (recipient) => getUserByName(recipient)?.role === "lab",
            ),
            currentUser.assignee,
          )
        : getAllowedRecipients(
            task,
            [...getTaskWatchers(task, graph), currentUser.assignee, ...mentionedUsers],
            graph,
            currentUser.assignee,
          );
      pushNotifications(
        recipients.map((recipient) => ({
          tag: mentionedUsers.includes(recipient) ? "MENTION" : attachments ? "ATTACHMENT" : "COMMENT",
          title: mentionedUsers.includes(recipient)
            ? `${currentUser.assignee} mentioned you in an action comment`
            : `${currentUser.assignee} commented on a watched action`,
          detail: comment.text,
          type: "Action",
          recipient,
          actor: currentUser.assignee,
          entityType: "comment",
          entityId: comment.id,
          taskId,
        })),
      );
    },
    resolveTask: (taskId) => {
      const task = state.tasks.find((item) => item.id === taskId);
      if (!task || !isLabUser) return;
      patchState((current) => ({
        ...current,
        tasks: current.tasks.map((item) => (item.id === taskId ? { ...item, status: "RESOLVED" } : item)),
      }));
      notifyTaskWatchers(task, {
        tag: "ACTION RESOLVED",
        title: `${currentUser.assignee} resolved an action`,
        detail: task.title,
        type: "Action",
      });
    },
    resolveTaskViaException: (taskId, comment) => {
      const taskItem = state.tasks.find((item) => item.id === taskId);
      if (!taskItem || !isLabUser || !comment.trim()) return;
      if (!taskItem.exceptionKey || taskItem.exceptionKey === "recollection_required") return;
      if (!taskItem.sourceLevel || taskItem.sourceId == null) return;
      resolveException(
        taskItem.sourceLevel,
        taskItem.sourceId,
        [taskItem.exceptionKey as ExceptionKey],
        comment.trim(),
      );
      setSelection({ selectedTaskId: null });
    },
    addManualTaskWatcher: (taskId, user) => {
      const task = state.tasks.find((item) => item.id === taskId);
      const watcher = getUserByName(user);
      if (!task || !watcher || !userCanAccessTask(task, watcher, graph)) return;
      if (getTaskWatchers(task, graph).includes(user)) return;
      patchState((current) => ({
        ...current,
        tasks: current.tasks.map((item) =>
          item.id === taskId
            ? {
                ...item,
                watchers: getAllowedRecipients(item, [...(item.watchers ?? []), user], graph),
              }
            : item,
        ),
      }));
      if (user !== currentUser.assignee) {
        pushNotifications([
          {
            tag: "WATCHER ADDED",
            title: `${currentUser.assignee} added you as a watcher`,
            detail: task.title,
            type: "Action",
            recipient: user,
            actor: currentUser.assignee,
            entityType: "task",
            entityId: task.id,
            taskId: task.id,
          },
        ]);
      }
    },
    removeTaskWatcher: (taskId, user) => {
      patchState((current) => ({
        ...current,
        tasks: current.tasks.map((task) =>
          task.id === taskId
            ? { ...task, watchers: getTaskWatchers(task, graph).filter((watcher) => watcher !== user) }
            : task,
        ),
      }));
    },
    updateTaskVisibility: (taskId, visibility) => {
      if (!isLabUser) return;
      const taskToUpdate = state.tasks.find((task) => task.id === taskId);
      if (!taskToUpdate) return;
      const account = getTaskClientAccount(taskToUpdate, graph);
      const previousClientRecipients = getSharedClientRecipients(taskToUpdate, graph);
      const nextClientRecipients =
        visibility === "shared_with_client" ? getClientRecipientsForAccount(account) : [];
      const newClientRecipients = uniqueRecipients(
        nextClientRecipients.filter((recipient) => !previousClientRecipients.includes(recipient)),
        currentUser.assignee,
      );
      patchState((current) => ({
        ...current,
        tasks: current.tasks.map((task) => {
          if (task.id !== taskId) return task;
          const nextTask = {
            ...task,
            visibility,
            sharedWith: visibility === "shared_with_client" && account ? [account] : [],
          };
          return {
            ...nextTask,
            watchers: getAllowedRecipients(
              nextTask,
              [...nextTask.watchers, ...getSharedClientRecipients(nextTask, graph)],
              graph,
            ),
          };
        }),
      }));
      pushNotifications(
        newClientRecipients.map((recipient) => ({
          tag: "ACTION VISIBLE TO ACCOUNT",
          title: `${currentUser.assignee} made an action visible to your account`,
          detail: taskToUpdate.title,
          type: "Action",
          recipient,
          actor: currentUser.assignee,
          entityType: "task",
          entityId: taskToUpdate.id,
          taskId: taskToUpdate.id,
        })),
      );
    },
    openNotification: (notificationId) => {
      patchState((current) => ({
        ...current,
        notifications: current.notifications.map((notification) =>
          notification.id === notificationId ? { ...notification, read: true } : notification,
        ),
      }));
      setSelection({ selectedNotificationId: notificationId });
    },
    openTaskAndMarkNotificationsRead: (taskId) => {
      const task = state.tasks.find((item) => item.id === taskId);
      if (!task || !userCanAccessTask(task, currentUser, graph)) return;
      patchState((current) => ({
        ...current,
        notifications: current.notifications.map((notification) =>
          notification.recipient === currentUser.assignee &&
          notification.taskId === taskId &&
          !notification.read
            ? { ...notification, read: true }
            : notification,
        ),
      }));
      setSelection({ selectedTaskId: taskId });
    },
    markAllNotificationsRead: () => {
      patchState((current) => ({
        ...current,
        notifications: current.notifications.map((notification) =>
          notification.recipient === currentUser.assignee
            ? { ...notification, read: true }
            : notification,
        ),
      }));
    },
    markNotificationRead: (notificationId) => {
      patchState((current) => ({
        ...current,
        notifications: current.notifications.map((notification) =>
          notification.id === notificationId ? { ...notification, read: true } : notification,
        ),
      }));
    },
    markNotificationUnread: (notificationId) => {
      patchState((current) => ({
        ...current,
        notifications: current.notifications.map((notification) =>
          notification.id === notificationId ? { ...notification, read: false } : notification,
        ),
      }));
    },
    canShareWithClientForTask: (task) =>
      canShareWithClient(state.rolloutConfig, getTaskClientAccount(task, graph)),
    canUseThreadedCommentsForTask: (task) =>
      canUseThreadedComments(state.rolloutConfig, getTaskClientAccount(task, graph)),
    labUsers: taskAssignees,
    allUsers: taskUsers,
  };

  return <InflowContext.Provider value={value}>{children}</InflowContext.Provider>;
}

export function useInflow() {
  const ctx = useContext(InflowContext);
  if (!ctx) {
    throw new Error("useInflow must be used within InflowProvider");
  }
  return ctx;
}

export function useInflowOptional() {
  return useContext(InflowContext);
}
