import { useInflow } from "../../context/InflowContext";
import { CancelledReportsPage } from "./CancelledReportsPage";
import { DismissReportsPage } from "./DismissReportsPage";
import { ReportListPage } from "./ReportListPage";
import "../../styles/operation.css";

/** Service-wise waiting list backed by live inflow report data */
export function InflowOperationWorkspace() {
  const inflow = useInflow();

  return (
    <div className="op-workspace inflow-root">
      <ReportListPage
        reports={inflow.reports}
        getExceptionsForReport={inflow.getExceptionsForReport}
        onSelectReport={inflow.setSelectedReportId}
        canDismissReports={inflow.canDismissReports}
        currentUserName={inflow.currentUser.assignee}
        onDismissReports={inflow.dismissReports}
      />
    </div>
  );
}

export function InflowDismissReportsWorkspace() {
  const inflow = useInflow();

  return (
    <div className="op-workspace inflow-root">
      <DismissReportsPage
        reports={inflow.reports}
        getExceptionsForReport={inflow.getExceptionsForReport}
        onSelectReport={inflow.setSelectedReportId}
        canDismissReports={inflow.canDismissReports}
        currentUserName={inflow.currentUser.assignee}
        onDismissReports={inflow.dismissReports}
      />
    </div>
  );
}

export function InflowCancelledReportsWorkspace() {
  const inflow = useInflow();

  return (
    <div className="op-workspace inflow-root">
      <CancelledReportsPage
        reports={inflow.reports}
        canRestoreReports={inflow.canDismissReports}
        onRestoreReport={inflow.restoreReport}
      />
    </div>
  );
}
