import { useInflow } from "../../context/InflowContext";
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
      />
    </div>
  );
}
