import { Navigate, useParams } from "react-router-dom";
import { AccountOverviewSidebar } from "../components/account-overview/AccountOverviewSidebar";
import { CenterOnboardingContent } from "../components/center-management/CenterOnboardingContent";
import { useLabs } from "../context/LabsContext";
import "../styles/account-overview.css";
import "../styles/center-management.css";

export function CenterOnboardingPage() {
  const { id } = useParams<{ id: string }>();
  const labId = Number(id);
  const { getLabDetail, getLabLifecycleState } = useLabs();
  const lab = getLabDetail(labId);

  if (!lab || Number.isNaN(labId)) {
    return <Navigate to="/" replace />;
  }

  const lifecycle = getLabLifecycleState(labId);
  if (lifecycle !== "onboarding" && lifecycle !== "trial") {
    return <Navigate to={`/lab/${labId}/center`} replace />;
  }

  return (
    <div className="ao-layout">
      <AccountOverviewSidebar lab={lab} />

      <div className="ao-main-wrap">
        <main className="ao-main ao-main--center-hub">
          <div className="cm-hub__body">
            <CenterOnboardingContent lab={lab} />
          </div>
        </main>
      </div>
    </div>
  );
}
