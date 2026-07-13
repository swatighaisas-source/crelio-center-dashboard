import { useNavigate } from "react-router-dom";
import { useInflow } from "../../context/InflowContext";
import { useTaskModalSelectors } from "../../hooks/useInflowSelectors";
import { OrderUpdateModal } from "./modals/OrderUpdateModal";
import { ReportUpdateModal } from "./modals/ReportUpdateModal";
import { SampleRedrawModal } from "./modals/SampleRedrawModal";
import { SampleUpdateModal } from "./modals/SampleUpdateModal";
import { TaskDetailModal } from "./modals/TaskDetailModal";
import "../../styles/inflow.css";

export function InflowModalsHost() {
  const navigate = useNavigate();
  const inflow = useInflow();
  const {
    labId,
    selectedOrder,
    selectedReport,
    selectedSample,
    redrawSample,
    redrawSampleServices,
    selectedTask,
    rolloutConfig,
    currentUser,
    isLabUser,
    taskComments,
    setSelectedOrderId,
    setSelectedReportId,
    setSelectedSampleId,
    setRedrawSampleId,
    setSelectedTaskId,
    getExceptionsForOrder,
    getExceptionsForReport,
    getExceptionsForSample,
    getOpenTasksForEntityChain,
    getTaskSourceSummary,
    getTaskClientAccount,
    updateOrder,
    createException,
    resolveException,
    openTaskAndMarkNotificationsRead,
    updateTaskAssignee,
    addTaskComment,
    resolveTask,
    resolveTaskViaException,
    addManualTaskWatcher,
    removeTaskWatcher,
    updateTaskVisibility,
    splitSampleForRedraw,
    canShareWithClientForTask,
    canUseThreadedCommentsForTask,
    labUsers,
    allUsers,
  } = inflow;

  const { linkedTasksForException, affectedUsersForExceptionResolve } =
    useTaskModalSelectors(selectedTask);

  const taskUnreadCounts = inflow.notifications.reduce<Record<string, number>>((counts, notification) => {
    if (!notification.taskId || notification.read) return counts;
    if (notification.recipient !== currentUser.assignee) return counts;
    counts[notification.taskId] = (counts[notification.taskId] ?? 0) + 1;
    return counts;
  }, {});

  const openEntityFromTask = (sourceLevel: string, sourceId: string) => {
    if (!isLabUser) return;
    setSelectedTaskId(null);
    if (sourceLevel === "order") {
      navigate(`/lab/${labId}/registration/order-history`);
      setSelectedOrderId(Number(sourceId));
    }
    if (sourceLevel === "sample") {
      navigate(`/lab/${labId}/accession/sample-list`);
      setSelectedSampleId(sourceId);
    }
    if (sourceLevel === "report") {
      navigate(`/lab/${labId}/operation/waiting-list`);
      setSelectedReportId(sourceId);
    }
  };

  return (
    <>
      {selectedOrder ? (
        <OrderUpdateModal
          labId={labId}
          order={selectedOrder}
          exceptions={getExceptionsForOrder(selectedOrder)}
          openTasks={getOpenTasksForEntityChain("order", String(selectedOrder.id))}
          taskUnreadCounts={taskUnreadCounts}
          rolloutConfig={rolloutConfig}
          currentUser={currentUser}
          onClose={() => setSelectedOrderId(null)}
          onUpdate={updateOrder}
          onOpenTask={openTaskAndMarkNotificationsRead}
          onSetExceptions={(orderId, exceptionKeys, comment) =>
            createException("order", String(orderId), exceptionKeys, comment, selectedOrder.account)
          }
          onResolveExceptions={(orderId, exceptionKeys, comment) =>
            resolveException("order", String(orderId), exceptionKeys, comment)
          }
        />
      ) : null}

      {selectedReport ? (
        <ReportUpdateModal
          report={selectedReport}
          exceptions={getExceptionsForReport(selectedReport)}
          openTasks={getOpenTasksForEntityChain("report", selectedReport.id)}
          taskUnreadCounts={taskUnreadCounts}
          rolloutConfig={rolloutConfig}
          currentUser={currentUser}
          onClose={() => setSelectedReportId(null)}
          onOpenTask={openTaskAndMarkNotificationsRead}
          onSetExceptions={(reportId, exceptionKeys, comment) =>
            createException("report", reportId, exceptionKeys, comment, selectedReport.account)
          }
          onResolveExceptions={(reportId, exceptionKeys, comment) =>
            resolveException("report", reportId, exceptionKeys, comment)
          }
        />
      ) : null}

      {redrawSample ? (
        <SampleRedrawModal
          sample={redrawSample}
          services={redrawSampleServices}
          onClose={() => setRedrawSampleId(null)}
          onConfirm={({ sampleId, selectedServices, comment }) => {
            splitSampleForRedraw(sampleId, selectedServices, comment);
            setRedrawSampleId(null);
          }}
        />
      ) : null}

      {selectedSample ? (
        <SampleUpdateModal
          sample={selectedSample}
          exceptions={getExceptionsForSample(selectedSample)}
          openTasks={getOpenTasksForEntityChain("sample", selectedSample.id)}
          taskUnreadCounts={taskUnreadCounts}
          rolloutConfig={rolloutConfig}
          currentUser={currentUser}
          onClose={() => setSelectedSampleId(null)}
          onOpenTask={openTaskAndMarkNotificationsRead}
          onSetExceptions={(sampleId, exceptionKeys, comment) =>
            createException("sample", sampleId, exceptionKeys, comment, selectedSample.accountName)
          }
          onResolveExceptions={(sampleId, exceptionKeys, comment) =>
            resolveException("sample", sampleId, exceptionKeys, comment)
          }
        />
      ) : null}

      {selectedTask ? (
        <TaskDetailModal
          task={selectedTask}
          comments={taskComments.filter((comment) => comment.taskId === selectedTask.id)}
          clientAccountName={getTaskClientAccount(selectedTask)}
          sourceSummary={getTaskSourceSummary(selectedTask)}
          linkedTasksForException={linkedTasksForException}
          affectedUsersForExceptionResolve={affectedUsersForExceptionResolve}
          rolloutClientSharingEnabled={canShareWithClientForTask(selectedTask)}
          rolloutThreadingEnabled={canUseThreadedCommentsForTask(selectedTask)}
          onClose={() => setSelectedTaskId(null)}
          onNavigatePendingCollection={() => {
            setSelectedTaskId(null);
            navigate(`/lab/${labId}/registration/pending-collection`);
          }}
          onUpdateAssignee={updateTaskAssignee}
          onAddComment={addTaskComment}
          onResolveTaskSimple={(taskId) => {
            resolveTask(taskId);
            setSelectedTaskId(null);
          }}
          onResolveViaException={resolveTaskViaException}
          currentUser={currentUser}
          labUsers={labUsers}
          allUsers={allUsers}
          onAddWatcher={addManualTaskWatcher}
          onRemoveWatcher={removeTaskWatcher}
          onUpdateVisibility={updateTaskVisibility}
          onOpenSource={openEntityFromTask}
        />
      ) : null}
    </>
  );
}
