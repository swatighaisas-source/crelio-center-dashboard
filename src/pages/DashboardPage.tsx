import { useCallback, useMemo, useState } from "react";
import { TopNav } from "../components/TopNav";
import { PrimaryTabs, type PrimaryTabId } from "../components/PrimaryTabs";
import { SubTabsAndStats } from "../components/SubTabsAndStats";
import { DataGrid } from "../components/DataGrid";
import { SidePanel } from "../components/SidePanel";
import { ReportsToolbar } from "../components/reports/ReportsToolbar";
import { ProductFeedbackReportGrid } from "../components/reports/ProductFeedbackReportGrid";
import { SubscriptionReportGrid } from "../components/reports/SubscriptionReportGrid";
import { useLabs } from "../context/LabsContext";
import {
  computeLabsSummary,
  countLabsByLifecycleState,
  filterLabsForPrimaryTab,
  isLifecyclePrimaryTab,
} from "../data/labLifecycle";
import {
  REPORT_TYPES,
  buildProductFeedbackReportRows,
  exportProductFeedbackCsv,
  type ReportTypeId,
} from "../data/reports";

export function DashboardPage() {
  const { labs, getLabDetail } = useLabs();
  const [primaryTab, setPrimaryTab] = useState<PrimaryTabId>("Onboarding");
  const [reportTypeId, setReportTypeId] = useState<ReportTypeId>("product-feedback");
  const [reportVariantId, setReportVariantId] = useState("nps-summary");
  const [reportRefreshKey, setReportRefreshKey] = useState(0);

  const filteredLabs = useMemo(
    () => filterLabsForPrimaryTab(labs, primaryTab),
    [labs, primaryTab],
  );

  const tabSummary = useMemo(() => computeLabsSummary(filteredLabs), [filteredLabs]);

  const lifecycleTabCounts = useMemo(() => {
    const counts = countLabsByLifecycleState(labs);
    return {
      Onboarding: counts.onboarding,
      Live: counts.live,
      Trial: counts.trial,
      Shutdown: counts.shutdown,
    } satisfies Partial<Record<PrimaryTabId, number>>;
  }, [labs]);

  const feedbackRows = useMemo(
    () => buildProductFeedbackReportRows(labs, getLabDetail),
    [labs, getLabDetail, reportRefreshKey],
  );

  const handleReportTypeChange = useCallback((id: ReportTypeId) => {
    setReportTypeId(id);
    const type = REPORT_TYPES.find((t) => t.id === id);
    setReportVariantId(type?.variants[0]?.id ?? "");
  }, []);

  const handleExport = useCallback(() => {
    if (reportTypeId === "product-feedback") {
      exportProductFeedbackCsv(feedbackRows);
    }
  }, [reportTypeId, feedbackRows]);

  const isReports = primaryTab === "Reports";
  const showLifecycleGrid = isLifecyclePrimaryTab(primaryTab);
  const gridLabs = showLifecycleGrid ? filteredLabs : labs;
  const rowCount =
    isReports && reportTypeId === "product-feedback" ? feedbackRows.length : gridLabs.length;

  return (
    <div className="dashboard">
      <TopNav />
      <PrimaryTabs
        activeTab={primaryTab}
        onTabChange={setPrimaryTab}
        lifecycleTabCounts={lifecycleTabCounts}
        onExport={isReports && reportTypeId === "product-feedback" ? handleExport : undefined}
      />

      {isReports ? (
        <>
          <ReportsToolbar
            reportTypeId={reportTypeId}
            reportVariantId={reportVariantId}
            rowCount={rowCount}
            onReportTypeChange={handleReportTypeChange}
            onReportVariantChange={setReportVariantId}
            onRefresh={() => setReportRefreshKey((k) => k + 1)}
            onExport={handleExport}
          />
          <main className="table-wrapper table-wrapper--reports">
            {reportTypeId === "product-feedback" ? (
              <ProductFeedbackReportGrid key={reportRefreshKey} />
            ) : (
              <SubscriptionReportGrid />
            )}
          </main>
        </>
      ) : (
        <>
          <SubTabsAndStats summary={showLifecycleGrid ? tabSummary : undefined} />
          <main className="table-wrapper">
            <DataGrid labs={gridLabs} showLifecycleColumn={!showLifecycleGrid} />
            <SidePanel />
          </main>
        </>
      )}
    </div>
  );
}
