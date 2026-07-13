import { useEffect, useRef, useState } from "react";
import type { LabDetail } from "../../data/labDetails";
import { useLabs } from "../../context/LabsContext";
import { US_MODALITY_OPTIONS } from "../../data/usDevices";
import { LAB_ARCHETYPE_LABELS } from "../../lib/usOnboardingPrefill";

const LAB_TYPE_OPTIONS = Object.values(LAB_ARCHETYPE_LABELS);

interface Props {
  lab: LabDetail;
}

export function LabHeaderProfilePills({ lab }: Props) {
  const { updateLabOnboardingSnapshot } = useLabs();
  const [editing, setEditing] = useState(false);
  const editRef = useRef<HTMLDivElement>(null);
  const snapshot = lab.onboardingSnapshot;
  const { labType, modalities } = snapshot;

  useEffect(() => {
    if (!editing) return;
    function onPointerDown(e: MouseEvent) {
      if (editRef.current && !editRef.current.contains(e.target as Node)) {
        setEditing(false);
      }
    }
    document.addEventListener("mousedown", onPointerDown);
    return () => document.removeEventListener("mousedown", onPointerDown);
  }, [editing]);

  function patch(partial: { labType?: string; modalities?: string[] }) {
    updateLabOnboardingSnapshot(lab.id, {
      ...snapshot,
      labType: partial.labType !== undefined ? partial.labType || undefined : snapshot.labType,
      modalities: partial.modalities ?? snapshot.modalities,
    });
  }

  function toggleModality(id: string) {
    const next = modalities.includes(id)
      ? modalities.filter((m) => m !== id)
      : [...modalities, id];
    const ordered = US_MODALITY_OPTIONS.map((o) => o.id).filter((id) => next.includes(id));
    patch({ modalities: ordered });
  }

  return (
    <div
      className={`lab-header__profile${editing ? " lab-header__profile--editing" : ""}`}
      aria-label="Lab type and modalities"
    >
      <div className="lab-header__profile-pills-list" ref={editRef}>
        {!editing ? (
          <>
            {labType ? (
              <span className="badge badge--profile badge--profile-type">{labType}</span>
            ) : null}
            {modalities.map((m) => (
              <span key={m} className="badge badge--profile badge--profile-mod">
                {m}
              </span>
            ))}
            <button
              type="button"
              className="badge badge--profile badge--profile-action"
              onClick={() => setEditing(true)}
            >
              Edit
            </button>
          </>
        ) : (
          <>
            <div className="lab-header__select-pill lab-header__select-pill--type">
              <select
                className="lab-header__select-pill-input"
                value={labType ?? ""}
                onChange={(e) => patch({ labType: e.target.value })}
                aria-label="Lab type"
              >
                <option value="">Select lab type</option>
                {LAB_TYPE_OPTIONS.map((type) => (
                  <option key={type} value={type}>
                    {type}
                  </option>
                ))}
              </select>
            </div>
            {US_MODALITY_OPTIONS.map((m) => {
              const selected = modalities.includes(m.id);
              return (
                <label
                  key={m.id}
                  className={`lab-header__modality-check badge badge--profile badge--profile-mod${
                    selected ? "" : " badge--profile-mod--off"
                  }`}
                >
                  <input
                    type="checkbox"
                    className="lab-header__modality-checkbox"
                    checked={selected}
                    onChange={() => toggleModality(m.id)}
                  />
                  <span>{m.label}</span>
                </label>
              );
            })}
            <button
              type="button"
              className="badge badge--profile badge--profile-action badge--profile-action--done"
              onClick={() => setEditing(false)}
            >
              Done
            </button>
          </>
        )}
      </div>
    </div>
  );
}
