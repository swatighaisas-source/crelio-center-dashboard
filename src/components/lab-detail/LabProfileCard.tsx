import { useState } from "react";
import type { LabOnboardingSnapshot } from "../../data/labDetails";
import { US_VOLUME_LABELS, parseVolumeId } from "../../data/usVolumeOptions";
import { US_PLAN_LABELS } from "../../data/usPricingPlans";
import type { USPlanTier } from "../../context/CreateCentreContext";
import { LabProfileEditModal } from "./LabProfileEditModal";

interface Props {
  snapshot: LabOnboardingSnapshot;
  onSave: (snapshot: LabOnboardingSnapshot) => void;
}

function formatList(items: string[], max = 4): string {
  if (!items.length) return "—";
  const shown = items.slice(0, max).join(", ");
  const rest = items.length - max;
  return rest > 0 ? `${shown} +${rest} more` : shown;
}

export function LabProfileCard({ snapshot, onSave }: Props) {
  const [editOpen, setEditOpen] = useState(false);

  const hasContent =
    Boolean(snapshot.npi) ||
    Boolean(snapshot.clia) ||
    Boolean(snapshot.labType) ||
    snapshot.modalities.length > 0 ||
    snapshot.devices.length > 0 ||
    snapshot.integrations.length > 0;

  return (
    <>
      <div className="detail-card detail-card--compact detail-card--lab-profile">
        <div className="detail-card__header">
          <h3>Lab profile</h3>
          <button
            type="button"
            className="detail-card__link"
            onClick={() => setEditOpen(true)}
          >
            Edit
          </button>
        </div>

        {(snapshot.labType || snapshot.modalities.length > 0) && (
          <div className="lab-profile-pills" aria-label="Key profile highlights">
            {snapshot.labType && (
              <span className="badge badge--profile badge--profile-type">{snapshot.labType}</span>
            )}
            {snapshot.modalities.map((m) => (
              <span key={m} className="badge badge--profile badge--profile-mod">
                {m}
              </span>
            ))}
            {snapshot.selectedPlan && (
              <span className="badge badge--profile badge--profile-timeline">
                Plan: {US_PLAN_LABELS[snapshot.selectedPlan as USPlanTier] ?? snapshot.selectedPlan}
              </span>
            )}
            {parseVolumeId(snapshot.volume) && (
              <span className="badge badge--profile badge--profile-timeline">
                Volume: {US_VOLUME_LABELS[parseVolumeId(snapshot.volume)!]}
              </span>
            )}
          </div>
        )}

        {!hasContent ? (
          <p className="lab-profile-empty">
            No profile captured yet.{" "}
            <button type="button" className="detail-card__link" onClick={() => setEditOpen(true)}>
              Add details
            </button>
          </p>
        ) : (
          <dl className="detail-dl detail-dl--stacked">
            {snapshot.npi && (
              <div>
                <dt>NPI</dt>
                <dd>
                  <span className="badge badge--profile badge--profile-id">{snapshot.npi}</span>
                </dd>
              </div>
            )}
            {snapshot.clia && (
              <div>
                <dt>CLIA</dt>
                <dd>
                  <span className="badge badge--profile badge--profile-id">{snapshot.clia}</span>
                </dd>
              </div>
            )}
            {snapshot.devices.length > 0 && (
              <div>
                <dt>Devices</dt>
                <dd>{formatList(snapshot.devices, 2)}</dd>
              </div>
            )}
            {snapshot.integrations.length > 0 && (
              <div>
                <dt>Integrations</dt>
                <dd>{formatList(snapshot.integrations, 2)}</dd>
              </div>
            )}
            {snapshot.locations && (
              <div>
                <dt>Locations</dt>
                <dd>{snapshot.locations}</dd>
              </div>
            )}
            {snapshot.userCount && (
              <div>
                <dt>Users</dt>
                <dd>{snapshot.userCount}</dd>
              </div>
            )}
          </dl>
        )}
      </div>

      <LabProfileEditModal
        open={editOpen}
        snapshot={snapshot}
        onClose={() => setEditOpen(false)}
        onSave={onSave}
      />
    </>
  );
}
