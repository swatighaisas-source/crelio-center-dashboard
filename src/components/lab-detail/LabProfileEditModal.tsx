import { useEffect, useState } from "react";
import type { LabOnboardingSnapshot } from "../../data/labDetails";
import { US_MODALITY_OPTIONS } from "../../data/usDevices";
import { US_LAB_TYPE_OPTIONS } from "../../data/usLabTypes";
import { US_VOLUME_OPTIONS } from "../../data/usVolumeOptions";
import {
  formStateToSnapshot,
  snapshotToFormState,
  type LabProfileFormState,
} from "../../lib/labOnboardingForm";
import { fetchRegistryForProfile } from "../../lib/labProfileFromPrefill";
import type { CliaFetchPreview, NpiFetchPreview } from "../../lib/usOnboardingPrefill";
import type { CmsCliaRecord } from "../../services/cmsCliaApi";
import { LabRegistryPreviewTabs } from "./profile-edit/LabRegistryPreviewTabs";
import { ProfileDevicePicker } from "./profile-edit/ProfileDevicePicker";
import { ProfileIntegrationPicker } from "./profile-edit/ProfileIntegrationPicker";
import "../../styles/create-centre.css";

interface Props {
  open: boolean;
  snapshot: LabOnboardingSnapshot;
  onClose: () => void;
  onSave: (snapshot: LabOnboardingSnapshot) => void;
}

export function LabProfileEditModal({ open, snapshot, onClose, onSave }: Props) {
  const [form, setForm] = useState<LabProfileFormState>(() => snapshotToFormState(snapshot));
  const [fetching, setFetching] = useState(false);
  const [fetchNote, setFetchNote] = useState<string | null>(null);
  const [registryPreview, setRegistryPreview] = useState<{
    npiPreview: NpiFetchPreview | null;
    cliaPreview: CliaFetchPreview;
    npiRawFields: Record<string, string> | null;
    cliaRawRecord: CmsCliaRecord;
  } | null>(null);

  useEffect(() => {
    if (open) {
      setForm(snapshotToFormState(snapshot));
      setFetchNote(null);
      const npi = snapshot.npi?.trim() ?? "";
      const clia = snapshot.clia?.trim() ?? "";
      if (npi || clia) {
        const result = fetchRegistryForProfile(npi, clia, snapshot);
        setRegistryPreview({
          npiPreview: result.npiPreview,
          cliaPreview: result.cliaPreview,
          npiRawFields: result.npiRawFields,
          cliaRawRecord: result.cliaRawRecord,
        });
      } else {
        setRegistryPreview(null);
      }
    }
  }, [open, snapshot]);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, onClose]);

  if (!open) return null;

  function patch(partial: Partial<LabProfileFormState>) {
    setForm((prev) => ({ ...prev, ...partial }));
  }

  function toggleModality(id: string) {
    setForm((prev) => ({
      ...prev,
      modalities: prev.modalities.includes(id)
        ? prev.modalities.filter((m) => m !== id)
        : [...prev.modalities, id],
    }));
  }

  function handleFetch() {
    const npi = form.npi.trim();
    const clia = form.clia.trim();
    if (!npi && !clia) {
      setFetchNote("Enter an NPI and/or CLIA number to fetch.");
      return;
    }
    setFetching(true);
    setFetchNote(null);
    setTimeout(() => {
      const result = fetchRegistryForProfile(npi, clia, formStateToSnapshot(form));
      setForm(snapshotToFormState(result.snapshot));
      setRegistryPreview({
        npiPreview: result.npiPreview,
        cliaPreview: result.cliaPreview,
        npiRawFields: result.npiRawFields,
        cliaRawRecord: result.cliaRawRecord,
      });
      setFetchNote("Registry details applied. Review and save when ready.");
      setFetching(false);
    }, 700);
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    onSave(formStateToSnapshot(form));
    onClose();
  }

  return (
    <div className="lab-modal-overlay" role="presentation" onClick={onClose}>
      <div
        className="lab-modal lab-profile-modal lab-profile-modal--compact-layout"
        role="dialog"
        aria-labelledby="lab-profile-modal-title"
        aria-modal="true"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="lab-modal__header">
          <h2 id="lab-profile-modal-title">Edit lab profile</h2>
          <button type="button" className="lab-modal__close" onClick={onClose} aria-label="Close">
            ×
          </button>
        </div>

        <form
          className="lab-profile-modal__form lab-profile-modal__form--scroll lab-profile-modal__form--compact"
          onSubmit={handleSubmit}
        >
          <section className="lab-profile-section lab-profile-section--tight lab-profile-modal__fetch">
            <h3 className="lab-profile-section__title">Identifiers</h3>
            <div className="lab-profile-modal__fetch-row">
              <label className="us-form-field us-form-field--inline">
                <span className="us-form-field__label">NPI</span>
                <input
                  type="text"
                  className="us-form-field__input"
                  value={form.npi}
                  onChange={(e) => patch({ npi: e.target.value })}
                  placeholder="10-digit NPI"
                />
              </label>
              <label className="us-form-field us-form-field--inline">
                <span className="us-form-field__label">CLIA</span>
                <input
                  type="text"
                  className="us-form-field__input"
                  value={form.clia}
                  onChange={(e) => patch({ clia: e.target.value })}
                  placeholder="CLIA number"
                />
              </label>
              <button
                type="button"
                className="btn-solid btn-solid--sm lab-profile-modal__fetch-btn"
                onClick={handleFetch}
                disabled={fetching}
              >
                {fetching ? "Fetching…" : "Fetch"}
              </button>
            </div>
            {fetchNote && <p className="lab-profile-modal__fetch-note">{fetchNote}</p>}
            {registryPreview && (
              <LabRegistryPreviewTabs
                npi={form.npi}
                clia={form.clia}
                npiPreview={registryPreview.npiPreview}
                cliaPreview={registryPreview.cliaPreview}
                npiRawFields={registryPreview.npiRawFields}
                cliaRawRecord={registryPreview.cliaRawRecord}
              />
            )}
          </section>

          <div className="lab-profile-modal__columns">
            <div className="lab-profile-modal__col">
              <section className="lab-profile-section lab-profile-section--tight">
                <h3 className="lab-profile-section__title">Type of lab</h3>
                <div
                  className="lab-profile-modal__choice-grid lab-profile-modal__choice-grid--lab-type"
                  role="radiogroup"
                  aria-label="Lab type"
                >
                  {US_LAB_TYPE_OPTIONS.map((option) => {
                    const selected = form.labArchetype === option.id;
                    return (
                      <label
                        key={option.id}
                        className={`lab-profile-modal__choice lab-profile-modal__choice--radio${selected ? " lab-profile-modal__choice--selected" : ""}`}
                        title={option.title}
                      >
                        <input
                          type="radio"
                          name="labArchetype"
                          value={option.id}
                          checked={selected}
                          onChange={() => patch({ labArchetype: option.id })}
                        />
                        <span>{option.shortTitle}</span>
                      </label>
                    );
                  })}
                </div>
              </section>

              <section className="lab-profile-section lab-profile-section--tight">
                <h3 className="lab-profile-section__title">Modalities</h3>
                <div className="lab-profile-modal__choice-grid">
                  {US_MODALITY_OPTIONS.map((m) => (
                    <label
                      key={m.id}
                      className={`lab-profile-modal__choice lab-profile-modal__choice--check${form.modalities.includes(m.id) ? " lab-profile-modal__choice--selected" : ""}`}
                    >
                      <input
                        type="checkbox"
                        checked={form.modalities.includes(m.id)}
                        onChange={() => toggleModality(m.id)}
                      />
                      <span>{m.label}</span>
                    </label>
                  ))}
                </div>
              </section>

              <section className="lab-profile-section lab-profile-section--tight">
                <h3 className="lab-profile-section__title">Scale</h3>
                <div className="lab-profile-modal__scale-row">
                  <label className="us-form-field us-form-field--inline">
                    <span className="us-form-field__label">Daily volume</span>
                    <select
                      className="us-form-field__input us-form-field__select"
                      value={form.volume}
                      onChange={(e) => patch({ volume: e.target.value })}
                    >
                      <option value="">Select…</option>
                      {US_VOLUME_OPTIONS.map((opt) => (
                        <option key={opt.id} value={opt.id}>
                          {opt.label} patients / day
                        </option>
                      ))}
                    </select>
                  </label>
                  <label className="us-form-field us-form-field--inline">
                    <span className="us-form-field__label">Locations</span>
                    <input
                      type="number"
                      min={1}
                      className="us-form-field__input"
                      value={form.locations}
                      onChange={(e) => patch({ locations: e.target.value })}
                      placeholder="2"
                    />
                  </label>
                  <label className="us-form-field us-form-field--inline">
                    <span className="us-form-field__label">Users</span>
                    <input
                      type="number"
                      min={1}
                      className="us-form-field__input"
                      value={form.userCount}
                      onChange={(e) => patch({ userCount: e.target.value })}
                      placeholder="15"
                    />
                  </label>
                </div>
              </section>
            </div>

            <div className="lab-profile-modal__col">
              <section className="lab-profile-section lab-profile-section--tight">
                <h3 className="lab-profile-section__title">Devices</h3>
                <ProfileDevicePicker
                  compact
                  modalities={form.modalities}
                  selectedDeviceIds={form.selectedDeviceIds}
                  customDevices={form.customDevices}
                  onChange={(devicePatch) => patch(devicePatch)}
                />
              </section>

              <section className="lab-profile-section lab-profile-section--tight lab-profile-section--last">
                <h3 className="lab-profile-section__title">Integrations</h3>
                <ProfileIntegrationPicker
                  compact
                  selectedIntegrations={form.selectedIntegrations}
                  onChange={(selectedIntegrations) => patch({ selectedIntegrations })}
                />
              </section>
            </div>
          </div>

          <div className="lab-modal__footer lab-modal__footer--sticky">
            <button type="button" className="btn-secondary btn-secondary--sm" onClick={onClose}>
              Cancel
            </button>
            <button type="submit" className="btn-solid btn-solid--sm">
              Save profile
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
