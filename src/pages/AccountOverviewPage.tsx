import { Navigate, useParams } from "react-router-dom";
import { AccountOverviewSidebar } from "../components/account-overview/AccountOverviewSidebar";
import { AccountOverviewDashboard } from "../components/account-overview/AccountOverviewDashboard";
import { OnlineTrainingsPanel } from "../components/account-overview/OnlineTrainingsPanel";
import { SubpageBreadcrumb } from "../components/lab-shell/SubpageBreadcrumb";
import { usePageBreadcrumb } from "../hooks/usePageBreadcrumb";
import { useLabs } from "../context/LabsContext";
import "../styles/account-overview.css";
import "../styles/center-management.css";
import "../styles/subpage-breadcrumb.css";

export function AccountOverviewPage() {
  const { id } = useParams<{ id: string }>();
  const labId = Number(id);
  const { getLabDetail } = useLabs();
  const lab = getLabDetail(labId);
  const breadcrumb = usePageBreadcrumb();

  if (!lab || Number.isNaN(labId)) {
    return <Navigate to="/" replace />;
  }

  return (
    <div className="ao-layout">
      <AccountOverviewSidebar lab={lab} />

      <div className="ao-main-wrap">
        <main className="ao-main">
          {breadcrumb && (
            <SubpageBreadcrumb
              backHref={breadcrumb.backHref}
              backLabel={breadcrumb.backLabel}
              segments={breadcrumb.segments}
              actions={
                <button type="button" className="ao-main__back-btn">
                  Go to Old account overview
                </button>
              }
            />
          )}

          <div className="ao-main__overview-meta">
            <p className="ao-main__lab-email">{lab.email}</p>
          </div>

          <AccountOverviewDashboard />
        </main>

        <OnlineTrainingsPanel />
      </div>
    </div>
  );
}
