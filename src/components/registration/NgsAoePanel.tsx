export function NgsAoePanel() {
  return (
    <aside className="reg-ngs" aria-label="NGS AOE">
      <header className="reg-ngs__head">
        <h2 className="reg-ngs__title">NGS AOE</h2>
        <button type="button" className="reg-ngs__toggle" aria-label="Toggle NGS AOE panel">
          <svg viewBox="0 0 12 8" width="10" height="7" fill="none" aria-hidden>
            <path
              d="M1.5 1.5L6 6l4.5-4.5"
              stroke="currentColor"
              strokeWidth="1.3"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </button>
      </header>

      <div className="reg-ngs__body">
        <fieldset className="reg-ngs__group">
          <legend className="reg-ngs__question">
            Has the patient been diagnosed with cancer? <span className="reg-field__required">*</span>
          </legend>
          <div className="reg-ngs__checks">
            <label className="reg-check">
              <input type="checkbox" name="cancer-diagnosed" />
              <span>Yes</span>
            </label>
            <label className="reg-check">
              <input type="checkbox" name="cancer-diagnosed" />
              <span>No</span>
            </label>
          </div>
        </fieldset>

        <fieldset className="reg-ngs__group">
          <legend className="reg-ngs__question">If yes, specify the type of cancer</legend>
          <div className="reg-ngs__checks reg-ngs__checks--stack">
            {["Breast", "Ovarian", "Colorectal", "Prostate", "Other"].map((type) => (
              <label key={type} className="reg-check">
                <input type="checkbox" name="cancer-type" />
                <span>{type}</span>
              </label>
            ))}
          </div>
        </fieldset>

        <div className="reg-ngs__group">
          <label className="reg-ngs__question" htmlFor="cancer-age">
            Age at first cancer diagnosis?
          </label>
          <div className="reg-field__select-wrap">
            <select id="cancer-age" className="reg-field__select" defaultValue="">
              <option value="">Select age range</option>
            </select>
            <span className="reg-field__chevron" aria-hidden>
              <svg viewBox="0 0 12 8" width="10" height="7" fill="none">
                <path
                  d="M1.5 1.5L6 6l4.5-4.5"
                  stroke="currentColor"
                  strokeWidth="1.3"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </span>
          </div>
        </div>

        <fieldset className="reg-ngs__group">
          <legend className="reg-ngs__question">
            Does the patient have a family history of cancer?{" "}
            <span className="reg-field__required">*</span>
          </legend>
          <div className="reg-ngs__checks">
            <label className="reg-check">
              <input type="checkbox" name="family-cancer" />
              <span>Yes</span>
            </label>
            <label className="reg-check">
              <input type="checkbox" name="family-cancer" />
              <span>No</span>
            </label>
          </div>
        </fieldset>
      </div>
    </aside>
  );
}
