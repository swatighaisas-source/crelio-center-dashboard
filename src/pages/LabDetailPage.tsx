import { Navigate, useLocation, useParams } from "react-router-dom";
import { TopNav } from "../components/TopNav";
import { LabDetailHeader } from "../components/lab-detail/LabDetailHeader";
import { LabDetailTabs } from "../components/lab-detail/LabDetailTabs";
import { CentreDetailsTab } from "../components/lab-detail/CentreDetailsTab";
import { PlanDetailsTab } from "../components/lab-detail/PlanDetailsTab";
import { ConfigurationsTab } from "../components/lab-detail/ConfigurationsTab";
import { useLabs } from "../context/LabsContext";

type DetailTab = "index" | "plan" | "configurations" | "onboarding";

function tabFromPathname(pathname: string): DetailTab {
  if (pathname.endsWith("/onboarding")) return "onboarding";
  if (pathname.endsWith("/plan")) return "plan";
  if (pathname.endsWith("/configurations")) return "configurations";
  return "index";
}

export function LabDetailPage() {
  const { id } = useParams<{ id: string }>();
  const location = useLocation();
  const labId = Number(id);
  const { getLabDetail } = useLabs();
  const lab = getLabDetail(labId);
  const tab = tabFromPathname(location.pathname);

  if (!lab || Number.isNaN(labId)) {
    return <Navigate to="/" replace />;
  }

  if (tab === "onboarding") {
    return <Navigate to={`/lab/${labId}/center/onboarding`} replace />;
  }

  return (
    <div className="dashboard dashboard--detail">
      <TopNav />
      <LabDetailHeader lab={lab} />
      <LabDetailTabs labId={labId} />
      <div className="lab-detail-content">
        {tab === "plan" ? (
          <PlanDetailsTab lab={lab} />
        ) : tab === "configurations" ? (
          <ConfigurationsTab lab={lab} />
        ) : (
          <CentreDetailsTab lab={lab} />
        )}
      </div>
    </div>
  );
}
