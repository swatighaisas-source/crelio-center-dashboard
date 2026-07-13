import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useCreateCentre } from "../../context/CreateCentreContext";

export function SigningDoctorPage() {
  const navigate = useNavigate();
  const { account, updateAccount, uploadLetterhead } = useCreateCentre();
  const [editingName, setEditingName] = useState(false);
  const [nameDraft, setNameDraft] = useState(account.yourName);

  const goBack = () => {
    if (uploadLetterhead === "yes") {
      navigate("/create-centre/setup/letterhead");
    } else {
      navigate("/create-centre/setup/report-template");
    }
  };

  const saveName = () => {
    updateAccount({ yourName: nameDraft.trim() || account.yourName });
    setEditingName(false);
  };

  return (
    <div className="setup-diagnostic-page setup-diagnostic-page--signing">
      <header className="setup-diagnostic-page__header setup-diagnostic-page__header--with-back">
        <button
          type="button"
          className="setup-diagnostic-page__back"
          onClick={goBack}
          aria-label="Go back"
        >
          ‹
        </button>
        <div className="setup-diagnostic-page__header-text">
          <h1 className="setup-diagnostic-page__title">Setup Your Diagnostic Center</h1>
          <p className="setup-diagnostic-page__step">4/5 Steps</p>
        </div>
      </header>

      <div className="setup-diagnostic-card setup-diagnostic-card--signing">
        <h2 className="setup-diagnostic-card__heading">Enter your Signing Dr. Details</h2>

        <dl className="signing-doctor-list">
          <div className="signing-doctor-row">
            <dt className="signing-doctor-row__label">Name</dt>
            <dd className="signing-doctor-row__value">
              {editingName ? (
                <input
                  className="signing-doctor-row__input"
                  value={nameDraft}
                  onChange={(e) => setNameDraft(e.target.value)}
                  onBlur={saveName}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") saveName();
                    if (e.key === "Escape") {
                      setNameDraft(account.yourName);
                      setEditingName(false);
                    }
                  }}
                  autoFocus
                />
              ) : (
                account.yourName
              )}
            </dd>
            <dd className="signing-doctor-row__action">
              {editingName ? (
                <button type="button" className="signing-doctor-link" onClick={saveName}>
                  Save
                </button>
              ) : (
                <button
                  type="button"
                  className="signing-doctor-link"
                  onClick={() => {
                    setNameDraft(account.yourName);
                    setEditingName(true);
                  }}
                >
                  Edit
                </button>
              )}
            </dd>
          </div>

          <div className="signing-doctor-row">
            <dt className="signing-doctor-row__label">Contact</dt>
            <dd className="signing-doctor-row__value signing-doctor-row__value--with-badge">
              <span>{account.mobile}</span>
              <span className="signing-doctor-badge">Unverified</span>
            </dd>
            <dd className="signing-doctor-row__action" />
          </div>

          <div className="signing-doctor-row">
            <dt className="signing-doctor-row__label">Email</dt>
            <dd className="signing-doctor-row__value signing-doctor-row__value--with-badge">
              <span>{account.email}</span>
              <span className="signing-doctor-badge">Unverified</span>
            </dd>
            <dd className="signing-doctor-row__action">
              <button type="button" className="signing-doctor-link">
                Resend Verification Link
              </button>
            </dd>
          </div>
        </dl>

        <div className="signing-doctor-divider" />

        <button
          type="button"
          className="setup-diagnostic-continue"
          onClick={() => navigate("/create-centre/setup/team-members")}
        >
          Confirm &amp; Continue
        </button>
      </div>
    </div>
  );
}
