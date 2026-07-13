import { useNavigate } from "react-router-dom";
import { USPrefillTag } from "../../../components/create-centre/USPrefillTag";
import { USPageHeader } from "../../../components/create-centre/USPageHeader";
import { useCreateCentre } from "../../../context/CreateCentreContext";
import { US_VOLUME_OPTIONS } from "../../../data/usVolumeOptions";

export function USVolumePage() {
  const navigate = useNavigate();
  const { usForm, updateUSForm } = useCreateCentre();

  const canContinue = !!(usForm.volume && usForm.locations && usForm.userCount);

  return (
    <div className="setup-diagnostic-page">
      <USPageHeader
        title="Volume, Locations & Users"
        step="4 / 8 Steps"
        backTo="/create-centre/us/modalities"
      />

      <div className="setup-diagnostic-card">
        <h2 className="setup-diagnostic-card__heading">
          Enter Volume, Number of Locations and Users
        </h2>

        <div className="setup-diagnostic-card__body">
        <div className="volume-inputs-grid">
          <div>
            <span className="us-form-field__label" style={{ display: "block", marginBottom: 10, fontWeight: 600 }}>
              Daily Patient Volume (approx.)
              <USPrefillTag field="usForm.volume" />
            </span>
            <div className="volume-radio-group">
              {US_VOLUME_OPTIONS.map((opt) => (
                <div
                  key={opt.id}
                  className={`volume-radio-card${usForm.volume === opt.id ? " volume-radio-card--selected" : ""}`}
                  onClick={() => updateUSForm({ volume: opt.id })}
                >
                  {opt.label}
                </div>
              ))}
            </div>
          </div>

          <label className="us-form-field">
            <span className="us-form-field__label">Number of Locations</span>
            <input
              type="number"
              min={1}
              className="us-form-field__input"
              placeholder="e.g. 3"
              value={usForm.locations}
              onChange={(e) => updateUSForm({ locations: e.target.value })}
            />
          </label>

          <label className="us-form-field">
            <span className="us-form-field__label">Approx. Number of Users</span>
            <input
              type="number"
              min={1}
              className="us-form-field__input"
              placeholder="e.g. 12"
              value={usForm.userCount}
              onChange={(e) => updateUSForm({ userCount: e.target.value })}
            />
          </label>

        </div>

        <button
          type="button"
          className="setup-diagnostic-continue"
          onClick={() => navigate("/create-centre/us/devices")}
          disabled={!canContinue}
        >
          Confirm &amp; Continue
        </button>
        </div>
      </div>
    </div>
  );
}
