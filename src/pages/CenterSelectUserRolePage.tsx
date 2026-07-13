import { Navigate } from "react-router-dom";
import { useParams } from "react-router-dom";
import { AccountOverviewSidebar } from "../components/account-overview/AccountOverviewSidebar";
import { SelectUserRoleSection } from "../components/center-management/SelectUserRoleSection";
import { useLabs } from "../context/LabsContext";
import "../styles/account-overview.css";
import "../styles/center-management.css";
import "../styles/user-management.css";

export function CenterSelectUserRolePage() {
  const { id } = useParams<{ id: string }>();
  const labId = Number(id);
  const { getLabDetail } = useLabs();
  const lab = getLabDetail(labId);

  if (!lab || Number.isNaN(labId)) {
    return <Navigate to="/" replace />;
  }

  return (
    <div className="ao-layout">
      <AccountOverviewSidebar lab={lab} />

      <div className="ao-main-wrap">
        <main className="ao-main ao-main--center-section ao-main--user-edit ao-main--select-role">
          <SelectUserRoleSection labId={labId} />
        </main>
      </div>
    </div>
  );
}
