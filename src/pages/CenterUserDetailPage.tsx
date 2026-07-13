import { Navigate, useParams } from "react-router-dom";
import { AccountOverviewSidebar } from "../components/account-overview/AccountOverviewSidebar";
import { EditUserSection } from "../components/center-management/EditUserSection";
import { buildCenterUserDetail } from "../data/centerUserEdit";
import { useLabs } from "../context/LabsContext";
import { useLabUsers } from "../hooks/useLabUsers";
import "../styles/account-overview.css";
import "../styles/center-management.css";
import "../styles/user-management.css";

export function CenterUserDetailPage() {
  const { id, userId } = useParams<{ id: string; userId: string }>();
  const labId = Number(id);
  const { getLabDetail } = useLabs();
  const { findUser } = useLabUsers(labId);
  const lab = getLabDetail(labId);
  const user = userId ? findUser(userId) : undefined;
  const detail = user ? buildCenterUserDetail(user) : undefined;

  if (!lab || Number.isNaN(labId)) {
    return <Navigate to="/" replace />;
  }

  if (!detail) {
    return <Navigate to={`/lab/${labId}/center/users`} replace />;
  }

  return (
    <div className="ao-layout">
      <AccountOverviewSidebar lab={lab} />

      <div className="ao-main-wrap">
        <main className="ao-main ao-main--center-section ao-main--user-edit">
          <EditUserSection labId={labId} detail={detail} />
        </main>
      </div>
    </div>
  );
}
