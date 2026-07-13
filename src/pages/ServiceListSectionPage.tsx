import { Navigate, useParams } from "react-router-dom";
import { AccountOverviewSidebar } from "../components/account-overview/AccountOverviewSidebar";
import { SubpageBreadcrumb } from "../components/lab-shell/SubpageBreadcrumb";
import ServiceListApp from "../parameter-setup/ServiceListApp";
import { usePageBreadcrumb } from "../hooks/usePageBreadcrumb";
import { useLabs } from "../context/LabsContext";
import "../styles/account-overview.css";
import "../styles/center-management.css";
import "../styles/subpage-breadcrumb.css";
import "../styles/parameter-setup.css";

/**
 * "Service List" Test Master section: the test list (with bulk upload) and the
 * per-test detail view, under `/lab/:id/center/service-list/*`.
 */
export function ServiceListSectionPage() {
  const { id } = useParams<{ id: string }>();
  const labId = Number(id);
  const { getLabDetail } = useLabs();
  const lab = getLabDetail(labId);
  const breadcrumb = usePageBreadcrumb();

  if (!lab || Number.isNaN(labId)) {
    return <Navigate to="/" replace />;
  }

  return (
    <div className="ao-layout param-setup-page">
      <AccountOverviewSidebar lab={lab} />

      <div className="ao-main-wrap">
        <main className="ao-main">
          {breadcrumb && (
            <SubpageBreadcrumb
              backHref={breadcrumb.backHref}
              backLabel={breadcrumb.backLabel}
              segments={breadcrumb.segments}
            />
          )}
          <div className="param-setup-host">
            <ServiceListApp />
          </div>
        </main>
      </div>
    </div>
  );
}
