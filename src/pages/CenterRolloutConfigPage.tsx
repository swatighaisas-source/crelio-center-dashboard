import { Navigate, useParams } from "react-router-dom";
import { RolloutConfigPage } from "../components/inflow/RolloutConfigPage";
import { useInflow } from "../context/InflowContext";

export function CenterRolloutConfigSection() {
  const { id } = useParams<{ id: string }>();
  const labId = Number(id);
  const inflow = useInflow();

  if (Number.isNaN(labId)) {
    return <Navigate to="/" replace />;
  }

  return (
    <div className="cm-section inflow-root">
      <RolloutConfigPage
        rolloutConfig={inflow.rolloutConfig}
        onUpdateConfig={inflow.setRolloutConfig}
      />
    </div>
  );
}
