import { Navigate, useParams } from "react-router-dom";
import { AccountOverviewSidebar } from "../components/account-overview/AccountOverviewSidebar";
import { SubpageBreadcrumb } from "../components/lab-shell/SubpageBreadcrumb";
import ParameterSetupApp from "../parameter-setup/ParameterSetupApp";
import { usePageBreadcrumb } from "../hooks/usePageBreadcrumb";
import { useLabs } from "../context/LabsContext";
import "../styles/account-overview.css";
import "../styles/center-management.css";
import "../styles/subpage-breadcrumb.css";
import "../styles/parameter-setup.css";

/**
 * Hosts the parameter-setup tool as a Test Master section inside the admin
 * module. Keeps the admin (account overview) sidebar for context; the tool
 * renders its own inner nav rail and content under
 * `/lab/:id/center/parameter-setup/*`.
 */
export function ParameterSetupSectionPage() {
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
            <ParameterSetupApp />
          </div>
        </main>
      </div>
    </div>
  );
}
