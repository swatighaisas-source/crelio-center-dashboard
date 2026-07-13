import { Navigate, useParams } from "react-router-dom";
import { AccountOverviewSidebar } from "../components/account-overview/AccountOverviewSidebar";
import { AddUserSection } from "../components/center-management/AddUserSection";
import { buildAddUserDefaults } from "../data/centerUserRoles";
import { useLabs } from "../context/LabsContext";
import "../styles/account-overview.css";
import "../styles/center-management.css";
import "../styles/user-management.css";

export function CenterAddUserPage() {
  const { id, roleId } = useParams<{ id: string; roleId: string }>();
  const labId = Number(id);
  const { getLabDetail } = useLabs();
  const lab = getLabDetail(labId);
  const defaults = roleId ? buildAddUserDefaults(roleId) : undefined;

  if (!lab || Number.isNaN(labId)) {
    return <Navigate to="/" replace />;
  }

  if (!defaults) {
    return <Navigate to={`/lab/${labId}/center/users/new`} replace />;
  }

  return (
    <div className="ao-layout">
      <AccountOverviewSidebar lab={lab} />

      <div className="ao-main-wrap">
        <main className="ao-main ao-main--center-section ao-main--user-edit">
          <AddUserSection labId={labId} defaults={defaults} />
        </main>
      </div>
    </div>
  );
}
