import { useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { USPrefillTag } from "../../../components/create-centre/USPrefillTag";
import { USPageHeader } from "../../../components/create-centre/USPageHeader";
import { USModalityIcon } from "../../../components/create-centre/USModalityIcon";
import { useCreateCentre } from "../../../context/CreateCentreContext";
import {
  ARCHETYPE_DEFAULT_MODALITIES,
  US_MODALITY_OPTIONS,
  normalizeSelectedModalities,
} from "../../../data/usDevices";

export function USModalitiesPage() {
  const navigate = useNavigate();
  const { usForm, updateUSForm } = useCreateCentre();
  const didApplyDefaults = useRef(false);

  useEffect(() => {
    const normalized = normalizeSelectedModalities(usForm.selectedModalities);
    const changed =
      normalized.length !== usForm.selectedModalities.length ||
      normalized.some((id, i) => id !== usForm.selectedModalities[i]);

    if (changed) {
      updateUSForm({ selectedModalities: normalized });
      return;
    }

    if (!didApplyDefaults.current && normalized.length === 0) {
      didApplyDefaults.current = true;
      const defaults = normalizeSelectedModalities(
        ARCHETYPE_DEFAULT_MODALITIES[usForm.labArchetype] ?? ["Hematology", "Blood Chemistry"]
      );
      updateUSForm({ selectedModalities: defaults });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [usForm.labArchetype, usForm.selectedModalities]);

  function toggleModality(id: string) {
    const current = usForm.selectedModalities;
    const next = current.includes(id)
      ? current.filter((m) => m !== id)
      : [...current, id];
    updateUSForm({ selectedModalities: next });
  }

  return (
    <div className="setup-diagnostic-page">
      <USPageHeader
        title="Select Modalities"
        step="3 / 8 Steps"
        backTo="/create-centre/us/lab-type"
      />

      <div className="setup-diagnostic-card">
        <h2 className="setup-diagnostic-card__heading">
          Select Modalities
          <USPrefillTag field="usForm.selectedModalities" />
        </h2>

        <div className="setup-diagnostic-card__body">
          <div className="modality-square-grid">
            {US_MODALITY_OPTIONS.map((mod) => {
              const checked = usForm.selectedModalities.includes(mod.id);
              return (
                <label
                  key={mod.id}
                  className={`modality-square-card${checked ? " modality-square-card--checked" : ""}`}
                >
                  <input
                    type="checkbox"
                    checked={checked}
                    onChange={() => toggleModality(mod.id)}
                    className="modality-square-card__input"
                  />
                  <div className="modality-square-card__icon-wrapper">
                    <USModalityIcon modality={mod.id} />
                  </div>
                  <span className="modality-square-card__label">{mod.label}</span>
                  <div className="modality-square-card__checkbox">
                    {checked && <span className="modality-square-card__check">✓</span>}
                  </div>
                </label>
              );
            })}
          </div>

          <button
            type="button"
            className="setup-diagnostic-continue"
            onClick={() => navigate("/create-centre/us/volume")}
            disabled={usForm.selectedModalities.length === 0}
          >
            Confirm &amp; Continue
          </button>
        </div>
      </div>
    </div>
  );
}
