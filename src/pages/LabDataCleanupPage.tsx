import { Navigate, useParams } from "react-router-dom";
import { DataCleanupPageHeader } from "../components/lab-detail/DataCleanupPageHeader";
import { DataCleanupTab } from "../components/lab-detail/DataCleanupTab";
import { useLabs } from "../context/LabsContext";
import "../styles/data-cleanup.css";

export function LabDataCleanupPage() {
  const { id } = useParams<{ id: string }>();
  const labId = Number(id);
  const { getLabDetail } = useLabs();
  const lab = getLabDetail(labId);

  if (!lab || Number.isNaN(labId)) {
    return <Navigate to="/" replace />;
  }

  return (
    <div className="data-cleanup-layout">
      <DataCleanupPageHeader lab={lab} />
      <main className="data-cleanup-layout__content">
        <DataCleanupTab />
      </main>
    </div>
  );
}
