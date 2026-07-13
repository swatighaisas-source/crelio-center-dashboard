import { useNavigate } from "react-router-dom";
import { USPrefillTag } from "../../components/create-centre/USPrefillTag";
import { useCreateCentre, CONFIGURATION_OPTIONS } from "../../context/CreateCentreContext";
import { ConfigTypeThumbnail } from "../../components/create-centre/ConfigTypeThumbnail";

export function SetupDiagnosticCenterPage() {
  const navigate = useNavigate();
  const { configurationType, setConfigurationType, updateForm } = useCreateCentre();

  const handleContinue = () => {
    if (configurationType === "collection") {
      updateForm({ labType: "collection" });
    } else if (configurationType === "radiology-pacs") {
      updateForm({ labType: "processing" });
    } else {
      updateForm({ labType: "standalone" });
    }
    navigate("/create-centre/setup/report-template");
  };

  return (
    <div className="setup-diagnostic-page">
      <header className="setup-diagnostic-page__header">
        <h1 className="setup-diagnostic-page__title">Setup Your Diagnostic Center</h1>
        <p className="setup-diagnostic-page__step">1/5 Steps</p>
      </header>

      <div className="setup-diagnostic-card">
        <h2 className="setup-diagnostic-card__heading">
          Select Your Account Configuration Type
          <USPrefillTag field="configurationType" />
        </h2>

        <ul className="config-type-list" role="radiogroup" aria-label="Configuration type">
          {CONFIGURATION_OPTIONS.map((option) => {
            const selected = configurationType === option.id;
            return (
              <li key={option.id}>
                <label
                  className={`config-type-option${selected ? " config-type-option--selected" : ""}`}
                >
                  <input
                    type="radio"
                    name="configurationType"
                    value={option.id}
                    checked={selected}
                    onChange={() => setConfigurationType(option.id)}
                    className="config-type-option__input"
                  />
                  <ConfigTypeThumbnail type={option.id} />
                  <span className="config-type-option__body">
                    <span className="config-type-option__title">{option.title}</span>
                    <span className="config-type-option__desc">{option.description}</span>
                    {option.recommended && (
                      <span className="config-type-option__badge">Recommended</span>
                    )}
                  </span>
                  <span className="config-type-option__radio" aria-hidden />
                </label>
              </li>
            );
          })}
        </ul>

        <button type="button" className="setup-diagnostic-continue" onClick={handleContinue}>
          Confirm &amp; Continue
        </button>
      </div>
    </div>
  );
}
