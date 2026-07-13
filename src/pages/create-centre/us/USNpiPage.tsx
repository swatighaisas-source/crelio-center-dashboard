import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { LabRegistryPreviewCard } from "../../../components/create-centre/LabRegistryPreviewCard";
import { USPrefillTag } from "../../../components/create-centre/USPrefillTag";
import { USPageHeader } from "../../../components/create-centre/USPageHeader";
import { useCreateCentre } from "../../../context/CreateCentreContext";
import { TAXONOMY_MAP, archetypeFromTaxonomyCode } from "../../../data/usTaxonomy";
import {
  DEMO_CLIA,
  DEMO_NPI,
  buildCliaDemoPrefill,
  mergeDemoFetchResults,
  type CliaFetchPreview,
  type NpiFetchPreview,
} from "../../../lib/usOnboardingPrefill";

export function USNpiPage() {
  const navigate = useNavigate();
  const {
    usForm,
    updateUSForm,
    updateBusiness,
    updateForm,
    setConfigurationType,
    setReportTemplate,
    setPrefillSources,
  } = useCreateCentre();

  const [npiInput, setNpiInput] = useState(usForm.npi || DEMO_NPI);
  const [cliaInput, setCliaInput] = useState(usForm.cliaNumber || DEMO_CLIA);
  const autoFetched = useRef(false);
  const [fetching, setFetching] = useState(false);
  const [manualEntry, setManualEntry] = useState(usForm.manualEntry);
  const [npiPreview, setNpiPreview] = useState<NpiFetchPreview | null>(null);
  const [cliaPreview, setCliaPreview] = useState<CliaFetchPreview | null>(null);
  const [fetched, setFetched] = useState(false);

  function runDemoFetch(npi: string, clia: string) {
    setFetching(true);
    setManualEntry(false);

    setTimeout(() => {
      const cliaResult = buildCliaDemoPrefill(clia || DEMO_CLIA);
      const merged = mergeDemoFetchResults(npi, clia || DEMO_CLIA);

      updateUSForm({ ...merged.usPatch, manualEntry: false });
      updateBusiness(cliaResult.businessPatch);
      updateForm(cliaResult.formPatch);
      setConfigurationType(cliaResult.configurationType);
      setReportTemplate(cliaResult.reportTemplate);
      setPrefillSources(merged.sources);

      setNpiPreview(merged.npiPreview);
      setCliaPreview(merged.cliaPreview);
      setFetched(true);
      setFetching(false);
    }, 700);
  }

  function handleFetch() {
    const hasNpi = npiInput.trim().length > 0;
    const hasClia = cliaInput.trim().length > 0;
    if (!hasNpi && !hasClia) return;
    runDemoFetch(npiInput, cliaInput);
  }

  useEffect(() => {
    if (autoFetched.current || usForm.manualEntry) return;
    if (usForm.labName && usForm.labAddress) {
      setFetched(true);
      autoFetched.current = true;
      return;
    }
    autoFetched.current = true;
    runDemoFetch(DEMO_NPI, DEMO_CLIA);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  function handleManualToggle() {
    setManualEntry(true);
    updateUSForm({ manualEntry: true });
    setFetched(false);
    setNpiPreview(null);
    setCliaPreview(null);
  }

  function handleContinue() {
    updateUSForm({
      npi: npiInput,
      cliaNumber: cliaInput,
      manualEntry,
    });
    navigate("/create-centre/us/lab-type");
  }

  const canContinue = manualEntry
    ? !!(usForm.labName && usForm.labAddress)
    : fetched && !!(npiInput.trim() || cliaInput.trim());

  const canFetch = (npiInput.trim() || cliaInput.trim()) && !manualEntry;

  return (
    <div className="setup-diagnostic-page">
      <USPageHeader
        title="Tell us about your lab"
        step="1 / 8 Steps"
        backTo="/create-centre/us"
      />

      <div className="setup-diagnostic-card">
        <h2 className="setup-diagnostic-card__heading">Tell us about your lab</h2>

        <div className="setup-diagnostic-card__body">
          <p className="us-fetch-hint">
            Enter NPI and/or CLIA, then fetch once to preview registry data and prefill later
            steps (demo).
          </p>

          <label className="us-form-field">
            <span className="us-form-field__label">
              NPI Number
              {fetched && <USPrefillTag field="usForm.npi" />}
            </span>
            <input
              type="text"
              className="us-form-field__input"
              placeholder="Enter 10-digit NPI number"
              value={npiInput}
              onChange={(e) => setNpiInput(e.target.value)}
              disabled={manualEntry}
            />
          </label>

          <label className="us-form-field">
            <span className="us-form-field__label">
              CLIA Number
              {fetched && <USPrefillTag field="usForm.cliaNumber" />}
            </span>
            <input
              type="text"
              className="us-form-field__input"
              placeholder="Enter CLIA certificate number"
              value={cliaInput}
              onChange={(e) => setCliaInput(e.target.value)}
              disabled={manualEntry}
            />
          </label>

          {!manualEntry && (
            <div className="npi-fetch-row npi-fetch-row--single">
              <button
                type="button"
                className={`npi-fetch-btn npi-fetch-btn--wide${fetching ? " npi-fetch-btn--loading" : ""}`}
                onClick={handleFetch}
                disabled={fetching || !canFetch}
              >
                {fetching ? "Fetching…" : "Fetch lab data"}
              </button>
            </div>
          )}

          {fetched && (npiPreview || cliaPreview) && (
            <LabRegistryPreviewCard
              npi={npiInput}
              clia={cliaInput}
              npiPreview={npiPreview}
              cliaPreview={cliaPreview}
            />
          )}

          {fetched && (
            <p className="us-prefill-note">
              Later steps (lab type, modalities, volume, business name, report template) were
              prefilled from CLIA where available; taxonomy from NPI.
            </p>
          )}

          {!manualEntry && (
            <div className="npi-divider-manual">
              <button
                type="button"
                className="npi-divider-manual__link"
                onClick={handleManualToggle}
              >
                Or Enter Manually
              </button>
            </div>
          )}

          {manualEntry && (
            <div style={{ marginTop: 20 }}>
              <label className="us-form-field">
                <span className="us-form-field__label">Lab Name *</span>
                <input
                  type="text"
                  className="us-form-field__input"
                  value={usForm.labName}
                  onChange={(e) => updateUSForm({ labName: e.target.value })}
                  placeholder="e.g. Austin Diagnostics LLC"
                />
              </label>
              <label className="us-form-field">
                <span className="us-form-field__label">NPI Number</span>
                <input
                  type="text"
                  className="us-form-field__input"
                  value={npiInput}
                  onChange={(e) => setNpiInput(e.target.value)}
                  placeholder="10-digit NPI"
                />
              </label>
              <label className="us-form-field">
                <span className="us-form-field__label">CLIA Number</span>
                <input
                  type="text"
                  className="us-form-field__input"
                  value={cliaInput}
                  onChange={(e) => setCliaInput(e.target.value)}
                  placeholder="CLIA certificate number"
                />
              </label>
              <label className="us-form-field">
                <span className="us-form-field__label">Street Address *</span>
                <input
                  type="text"
                  className="us-form-field__input"
                  value={usForm.labAddress}
                  onChange={(e) => updateUSForm({ labAddress: e.target.value })}
                  placeholder="123 Medical Drive"
                />
              </label>
              <div className="us-form-row">
                <label className="us-form-field">
                  <span className="us-form-field__label">City</span>
                  <input
                    type="text"
                    className="us-form-field__input"
                    value={usForm.labCity}
                    onChange={(e) => updateUSForm({ labCity: e.target.value })}
                  />
                </label>
                <label className="us-form-field">
                  <span className="us-form-field__label">State</span>
                  <input
                    type="text"
                    className="us-form-field__input"
                    value={usForm.labState}
                    onChange={(e) => updateUSForm({ labState: e.target.value })}
                    placeholder="TX"
                  />
                </label>
                <label className="us-form-field">
                  <span className="us-form-field__label">ZIP</span>
                  <input
                    type="text"
                    className="us-form-field__input"
                    value={usForm.labZip}
                    onChange={(e) => updateUSForm({ labZip: e.target.value })}
                    placeholder="78701"
                  />
                </label>
              </div>
              <label className="us-form-field">
                <span className="us-form-field__label">Taxonomy Code</span>
                <select
                  className="us-form-field__input"
                  value={usForm.taxonomyCode}
                  onChange={(e) =>
                    updateUSForm({
                      taxonomyCode: e.target.value,
                      labArchetype: archetypeFromTaxonomyCode(e.target.value),
                    })
                  }
                >
                  <option value="">— Select taxonomy code —</option>
                  {TAXONOMY_MAP.map((r) => (
                    <option key={r.code} value={r.code}>
                      {r.code} — {r.description}
                    </option>
                  ))}
                </select>
              </label>
            </div>
          )}

          <button
            type="button"
            className="setup-diagnostic-continue"
            onClick={handleContinue}
            disabled={!canContinue}
          >
            Confirm &amp; Continue
          </button>
        </div>
      </div>
    </div>
  );
}
