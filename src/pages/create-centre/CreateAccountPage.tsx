import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useCreateCentre } from "../../context/CreateCentreContext";

const COUNTRIES = ["India", "United States", "United Kingdom", "UAE"];
const CITIES: Record<string, string[]> = {
  India: [
    "Pune, Maharashtra, India",
    "Hyderabad, Telangana, India",
    "Bangalore, Karnataka, India",
    "Mumbai, Maharashtra, India",
    "Delhi, India",
  ],
  "United States": ["New York, NY, USA", "San Francisco, CA, USA"],
  "United Kingdom": ["London, UK"],
  UAE: ["Dubai, UAE"],
};

function parseCityState(cityLabel: string): { city: string; state: string } {
  const parts = cityLabel.split(",").map((p) => p.trim());
  if (parts.length >= 2) {
    return { city: parts[0], state: parts[1] };
  }
  return { city: cityLabel, state: "" };
}

export function CreateAccountPage() {
  const navigate = useNavigate();
  const { account, updateAccount, updateForm } = useCreateCentre();
  const [captchaChecked, setCaptchaChecked] = useState(true);

  const cities = CITIES[account.country] ?? CITIES.India;

  const handleNext = () => {
    const { city, state } = parseCityState(account.city);
    updateForm({
      email: account.email,
      phone: account.mobile,
      city,
      state,
    });
    navigate("/create-centre/business");
  };

  const canProceed =
    account.yourName.trim() &&
    account.email.trim() &&
    account.mobile.trim() &&
    account.city &&
    captchaChecked;

  return (
    <div className="create-account-page">
      <div className="create-account-page__header">
        <h1 className="create-account-page__title">Create your account</h1>
        <p className="create-account-page__step">2/4 Steps</p>
      </div>

      <div className="create-account-card">
        <h2 className="create-account-card__heading">Tell us who you are</h2>

        <div className="create-account-form">
          <label className="account-field">
            <span className="account-field__label">Your Name</span>
            <input
              className="account-field__input"
              value={account.yourName}
              onChange={(e) => updateAccount({ yourName: e.target.value })}
              placeholder="Full name"
            />
          </label>

          <label className="account-field">
            <span className="account-field__label">Email</span>
            <input
              className="account-field__input"
              type="email"
              value={account.email}
              onChange={(e) => updateAccount({ email: e.target.value })}
              placeholder="Email address"
            />
          </label>

          <label className="account-field">
            <span className="account-field__label">Mobile Number</span>
            <div className="account-field__phone">
              <span className="account-field__flag" aria-hidden>
                🇮🇳
              </span>
              <input
                className="account-field__input account-field__input--phone"
                type="tel"
                value={account.mobile}
                onChange={(e) => updateAccount({ mobile: e.target.value })}
                placeholder="Mobile number"
              />
            </div>
          </label>

          <label className="account-field">
            <span className="account-field__label">Country</span>
            <select
              className="account-field__input account-field__select"
              value={account.country}
              onChange={(e) => {
                const country = e.target.value;
                const firstCity = CITIES[country]?.[0] ?? "";
                updateAccount({ country, city: firstCity });
              }}
            >
              {COUNTRIES.map((c) => (
                <option key={c} value={c}>
                  {c}
                </option>
              ))}
            </select>
          </label>

          <label className="account-field">
            <span className="account-field__label">City</span>
            <select
              className="account-field__input account-field__select"
              value={account.city}
              onChange={(e) => updateAccount({ city: e.target.value })}
            >
              <option value="">Select city</option>
              {cities.map((c) => (
                <option key={c} value={c}>
                  {c}
                </option>
              ))}
            </select>
          </label>

          <div className="account-captcha">
            <label className="account-captcha__box">
              <input
                type="checkbox"
                checked={captchaChecked}
                onChange={(e) => setCaptchaChecked(e.target.checked)}
              />
              <span className="account-captcha__check" aria-hidden />
              <span>I&apos;m not a robot</span>
            </label>
            <div className="account-captcha__badge" aria-hidden>
              <span>reCAPTCHA</span>
              <small>Privacy - Terms</small>
            </div>
          </div>
        </div>

        <div className="create-account-card__actions">
          <button
            type="button"
            className="account-back-btn"
            onClick={() => navigate("/create-centre")}
          >
            Back
          </button>
          <button
            type="button"
            className="account-next-btn"
            onClick={handleNext}
            disabled={!canProceed}
          >
            Next
          </button>
        </div>
      </div>
    </div>
  );
}
