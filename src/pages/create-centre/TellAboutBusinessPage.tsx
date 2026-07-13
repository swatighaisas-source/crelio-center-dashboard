import { useNavigate } from "react-router-dom";
import { USPrefillTag } from "../../components/create-centre/USPrefillTag";
import {
  useCreateCentre,
  SERVICE_OPTIONS,
} from "../../context/CreateCentreContext";

const LEFT_COLUMN_IDS = [
  "lab-testing",
  "immunoassays",
  "histo-cytology",
  "mri-ct",
  "other",
] as const;

const RIGHT_COLUMN_IDS = [
  "clinical-pathology",
  "microbiology",
  "radiology-xray",
  "pet",
] as const;

function getServiceLabel(id: string) {
  return SERVICE_OPTIONS.find((s) => s.id === id)?.label ?? id;
}

export function TellAboutBusinessPage() {
  const navigate = useNavigate();
  const { business, updateBusiness, toggleService, updateForm } = useCreateCentre();

  const handleCreateAccount = () => {
    updateForm({ name: business.registeredBusinessName });
    navigate("/create-centre/account-ready");
  };

  const canSubmit =
    business.registeredBusinessName.trim().length > 0 &&
    business.teamSize.trim().length > 0;

  const renderColumn = (ids: readonly string[]) => (
    <ul className="business-services__col">
      {ids.map((id) => (
        <li key={id}>
          <label className="business-checkbox">
            <input
              type="checkbox"
              checked={business.services.includes(id)}
              onChange={() => toggleService(id)}
            />
            <span className="business-checkbox__box" aria-hidden />
            <span>{getServiceLabel(id)}</span>
          </label>
        </li>
      ))}
    </ul>
  );

  return (
    <div className="create-account-page">
      <div className="create-account-page__header">
        <h1 className="create-account-page__title">Create your account</h1>
        <p className="create-account-page__step">3/4 Steps</p>
      </div>

      <div className="create-account-card create-account-card--business">
        <h2 className="create-account-card__heading">Tell Us About Your Business</h2>

        <div className="create-account-form">
          <label className="account-field account-field--business">
            <span className="account-field__label">
              Registered Business Name
              <USPrefillTag field="business.registeredBusinessName" />
            </span>
            <input
              className="business-field__input"
              value={business.registeredBusinessName}
              onChange={(e) =>
                updateBusiness({ registeredBusinessName: e.target.value })
              }
              placeholder="Enter Business Name"
            />
          </label>

          <label className="account-field account-field--business">
            <span className="account-field__label">Team Size</span>
            <input
              className="business-field__input"
              type="text"
              inputMode="numeric"
              value={business.teamSize}
              onChange={(e) => updateBusiness({ teamSize: e.target.value })}
              placeholder="Enter Team Size (Numeric)"
            />
          </label>

          <fieldset className="business-services">
            <legend className="account-field__label business-services__legend">
              Choose the type of services you provide
              <USPrefillTag field="business.services" />
            </legend>
            <div className="business-services__grid">
              {renderColumn(LEFT_COLUMN_IDS)}
              {renderColumn(RIGHT_COLUMN_IDS)}
            </div>
          </fieldset>
        </div>

        <button
          type="button"
          className="business-create-btn"
          onClick={handleCreateAccount}
          disabled={!canSubmit}
        >
          Create Account
        </button>
      </div>
    </div>
  );
}
