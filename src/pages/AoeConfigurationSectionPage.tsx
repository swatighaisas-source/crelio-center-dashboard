import { Navigate, useParams } from "react-router-dom";
import { AccountOverviewSidebar } from "../components/account-overview/AccountOverviewSidebar";
import {
  AoeConfigurationEditPage,
  AoeConfigurationListPage,
} from "../components/lab-forms/AoeConfigurationPages";
import { SubpageBreadcrumb } from "../components/lab-shell/SubpageBreadcrumb";
import { usePageBreadcrumb } from "../hooks/usePageBreadcrumb";
import { useLabs } from "../context/LabsContext";
import "../styles/account-overview.css";
import "../styles/aoe-configuration.css";
import "../styles/subpage-breadcrumb.css";

export function AoeConfigurationSectionPage() {
  const { id, configId } = useParams<{ id: string; configId?: string }>();
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
        <main className="ao-main ao-main--center-section">
          {breadcrumb && !configId ? (
            <SubpageBreadcrumb
              backHref={breadcrumb.backHref}
              backLabel={breadcrumb.backLabel}
              segments={breadcrumb.segments}
            />
          ) : null}
          {configId ? (
            <AoeConfigurationEditPage labId={labId} />
          ) : (
            <AoeConfigurationListPage labId={labId} />
          )}
        </main>
      </div>
    </div>
  );
}
