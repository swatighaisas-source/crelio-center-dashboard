import { Navigate, useParams } from "react-router-dom";
import { AccountOverviewSidebar } from "../components/account-overview/AccountOverviewSidebar";
import { LabFeedbackFlow } from "../components/feedback/LabFeedbackFlow";
import { SubpageBreadcrumb } from "../components/lab-shell/SubpageBreadcrumb";
import { usePageBreadcrumb } from "../hooks/usePageBreadcrumb";
import { useSmartBack } from "../hooks/useSmartBack";
import { useLabs } from "../context/LabsContext";
import "../styles/account-overview.css";
import "../styles/lab-home.css";
import "../styles/subpage-breadcrumb.css";

export function LabFeedbackPage() {
  const { id } = useParams<{ id: string }>();
  const labId = Number(id);
  const { getLabDetail } = useLabs();
  const lab = getLabDetail(labId);
  const breadcrumb = usePageBreadcrumb();
  const smartBack = useSmartBack(`/lab/${labId}/center`);

  if (!lab || Number.isNaN(labId)) {
    return <Navigate to="/" replace />;
  }

  return (
    <div className="ao-layout">
      <AccountOverviewSidebar lab={lab} />

      <main className="lab-home">
        {breadcrumb && (
          <SubpageBreadcrumb
            backHref={breadcrumb.backHref}
            backLabel={breadcrumb.backLabel}
            segments={breadcrumb.segments}
            onBack={smartBack}
          />
        )}

        <div className="lab-home__content lab-home__content--feedback">
          <LabFeedbackFlow lab={lab} mode="page" showTitle={false} />
        </div>
      </main>
    </div>
  );
}
