import { useNavigate } from "react-router-dom";
import type { InflowNotification } from "../data/inflow/engineNotifications";
import type { NotificationItem } from "../data/labHome";
import { useInflow } from "../context/InflowContext";

/** Navigate to the module route and open the entity/task modal for a notification. */
export function useInflowNavigation() {
  const navigate = useNavigate();
  const inflow = useInflow();
  const { labId } = inflow;

  function openEngineNotification(notification: InflowNotification) {
    inflow.markNotificationRead(notification.id);

    if (notification.taskId) {
      inflow.openTaskAndMarkNotificationsRead(notification.taskId);
      return;
    }

    if (notification.entityType === "order") {
      navigate(`/lab/${labId}/registration/order-history`);
      inflow.setSelectedOrderId(Number(notification.entityId));
      return;
    }
    if (notification.entityType === "sample") {
      navigate(`/lab/${labId}/accession/sample-list`);
      inflow.setSelectedSampleId(notification.entityId);
      return;
    }
    if (notification.entityType === "report") {
      navigate(`/lab/${labId}/operation/waiting-list`);
      inflow.setSelectedReportId(notification.entityId);
      return;
    }
    if (notification.entityType === "task") {
      inflow.openTaskAndMarkNotificationsRead(notification.entityId);
    }
  }

  function openRelatedFromUi(notification: NotificationItem) {
    const engine = inflow.notifications.find((item) => item.id === notification.id);
    if (engine) {
      openEngineNotification(engine);
      return;
    }
    if (notification.relatedActionId) {
      inflow.openTaskAndMarkNotificationsRead(notification.relatedActionId);
      return;
    }
    if (notification.relatedEntityType === "order" && notification.relatedEntityId) {
      navigate(`/lab/${labId}/registration/order-history`);
      inflow.setSelectedOrderId(Number(notification.relatedEntityId));
    } else if (notification.relatedEntityType === "sample" && notification.relatedEntityId) {
      navigate(`/lab/${labId}/accession/sample-list`);
      inflow.setSelectedSampleId(notification.relatedEntityId);
    } else if (notification.relatedEntityType === "report" && notification.relatedEntityId) {
      navigate(`/lab/${labId}/operation/waiting-list`);
      inflow.setSelectedReportId(notification.relatedEntityId);
    }
  }

  return { openEngineNotification, openRelatedFromUi };
}
