import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { CheckLogoIcon } from "../components/Icons";
import { useLabs } from "../context/LabsContext";
import { postLoginPath, DEFAULT_LOGIN_LAB_ID } from "../lib/postLoginRoute";
import "../styles/login.css";

const HEADER_LINKS = [
  { label: "Create Account", href: "/support-login" },
  { label: "Services Status", href: "#services-status" },
  { label: "Blog", href: "#blog" },
  { label: "Feedback", href: "#feedback" },
  { label: "Resources", href: "#resources" },
] as const;

const FOOTER_LINKS = [
  "About CrelioHealth for Diagnostics",
  "CrelioHealth in Press",
  "Terms & Conditions",
  "Privacy Policy",
] as const;

const GOOGLE_ACCOUNTS = [
  {
    name: "Husain Rampurawala",
    email: "husain@livehealth.in",
    avatar: "https://lh3.googleusercontent.com/a/default-user=s40-c",
  },
  {
    name: "Husain Rampurawala",
    email: "husainhr33@gmail.com",
    avatar: "https://lh3.googleusercontent.com/a/default-user=s40-c",
  },
] as const;

function EyeIcon({ visible }: { visible: boolean }) {
  return (
    <svg className="login-field__eye" viewBox="0 0 20 20" fill="none" aria-hidden>
      {visible ? (
        <>
          <path
            d="M2 10s3.5-6 8-6 8 6 8 6-3.5 6-8 6-8-6-8-6z"
            stroke="currentColor"
            strokeWidth="1.3"
          />
          <circle cx="10" cy="10" r="2.5" stroke="currentColor" strokeWidth="1.3" />
        </>
      ) : (
        <>
          <path
            d="M2 10s3.5-6 8-6 8 6 8 6-3.5 6-8 6-8-6-8-6z"
            stroke="currentColor"
            strokeWidth="1.3"
          />
          <path d="M3 3l14 14" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" />
        </>
      )}
    </svg>
  );
}

function GoogleIcon() {
  return (
    <svg className="login-google-btn__icon" viewBox="0 0 18 18" aria-hidden>
      <path
        fill="#4285F4"
        d="M17.64 9.2c0-.637-.057-1.251-.164-1.84H9v3.481h4.844a4.14 4.14 0 0 1-1.796 2.716v2.259h2.908c3.42-3.15 5.385-7.78 5.385-13.256z"
      />
      <path
        fill="#34A853"
        d="M9 18c2.43 0 4.467-.806 5.956-2.18l-2.908-2.259c-.806.54-1.837.86-3.048.86-2.344 0-4.328-1.584-5.036-3.711H.957v2.332A8.997 8.997 0 0 0 9 18z"
      />
      <path
        fill="#FBBC05"
        d="M3.964 10.71A5.41 5.41 0 0 1 3.682 9c0-.593.102-1.17.282-1.71V4.958H.957A8.996 8.996 0 0 0 0 9c0 1.452.348 2.827.957 4.042l3.007-2.332z"
      />
      <path
        fill="#EA4335"
        d="M9 3.58c1.321 0 2.508.454 3.44 1.345l2.582-2.58C13.463.891 11.426 0 9 0 5.482 0 2.443 2.022.957 4.958L3.964 7.29C4.672 5.163 6.656 3.58 9 3.58z"
      />
    </svg>
  );
}

function AppStoreBadge() {
  return (
    <a href="#app-store" className="login-store-badge" aria-label="Download on the App Store">
      <svg viewBox="0 0 135 40" aria-hidden>
        <rect width="135" height="40" rx="5" fill="#000" />
        <text x="44" y="14" fill="#fff" fontSize="7" fontFamily="Roboto, sans-serif">
          Download on the
        </text>
        <text x="44" y="28" fill="#fff" fontSize="13" fontWeight="500" fontFamily="Roboto, sans-serif">
          App Store
        </text>
        <path
          fill="#fff"
          d="M24.77 20.3c-.03-3.22 2.64-4.76 2.76-4.83-1.5-2.2-3.84-2.5-4.67-2.53-1.99-.2-3.88 1.17-4.89 1.17-1.01 0-2.57-1.14-4.23-1.11-2.18.03-4.19 1.27-5.31 3.22-2.27 3.93-.58 9.74 1.63 12.94 1.08 1.56 2.37 3.31 4.06 3.25 1.63-.07 2.25-1.05 4.23-1.05 1.98 0 2.54 1.05 4.27 1.02 1.77-.03 2.88-1.58 3.94-3.15 1.24-1.81 1.75-3.57 1.78-3.66-.04-.02-3.41-1.31-3.45-5.19zM21.3 8.87c.9-1.09 1.5-2.6 1.34-4.11-1.29.05-2.85.86-3.77 1.95-.83.96-1.56 2.5-1.36 3.97 1.44.11 2.9-.73 3.79-1.81z"
        />
      </svg>
    </a>
  );
}

function GooglePlayBadge() {
  return (
    <a href="#google-play" className="login-store-badge" aria-label="Get it on Google Play">
      <svg viewBox="0 0 135 40" aria-hidden>
        <rect width="135" height="40" rx="5" fill="#000" />
        <text x="44" y="11" fill="#fff" fontSize="6" fontFamily="Roboto, sans-serif">
          GET IT ON
        </text>
        <text x="44" y="27" fill="#fff" fontSize="13" fontWeight="500" fontFamily="Roboto, sans-serif">
          Google Play
        </text>
        <path fill="#00D6FF" d="M8 7.5l7.5 12.5L8 32.5V7.5z" />
        <path fill="#00F076" d="M8 7.5l7.5 12.5 4-2.5L8 7.5z" />
        <path fill="#FFB900" d="M15.5 20l4 2.5-11.5 7 7.5-9.5z" />
        <path fill="#FF3A44" d="M8 32.5l11.5-7-4 2.5L8 32.5z" />
      </svg>
    </a>
  );
}

export function LoginPage() {
  const navigate = useNavigate();
  const { setLandingPreference, getLabLifecycleState } = useLabs();
  const [loginTab, setLoginTab] = useState<"center" | "doctor">("center");
  const [showPassword, setShowPassword] = useState(false);
  const [showGooglePicker, setShowGooglePicker] = useState(true);

  function completeLogin() {
    setLandingPreference("center");
    const lifecycleState = getLabLifecycleState(DEFAULT_LOGIN_LAB_ID);
    navigate(postLoginPath(DEFAULT_LOGIN_LAB_ID, lifecycleState));
  }

  return (
    <div className="login-page">
      <header className="login-header">
        <a href="/login" className="login-header__logo">
          <CheckLogoIcon />
          <span className="login-header__brand">CrelioHealth</span>
        </a>
        <nav className="login-header__nav" aria-label="Utility links">
          {HEADER_LINKS.map(({ label, href }) =>
            href.startsWith("/") ? (
              <Link key={label} to={href} className="login-header__link">
                {label}
              </Link>
            ) : (
              <a key={label} href={href} className="login-header__link">
                {label}
              </a>
            ),
          )}
        </nav>
      </header>

      <main className="login-main">
        <div className="login-main__inner">
          <section className="login-form-panel" aria-labelledby="login-heading">
            <h1 id="login-heading" className="login-form-panel__title">
              Democratising Healthcare Diagnostics
            </h1>
            <p className="login-form-panel__subtitle">Login to Smart | Simple | Secure LIMS</p>

            <div className="login-tabs" role="tablist" aria-label="Login type">
              <button
                type="button"
                role="tab"
                aria-selected={loginTab === "center"}
                className={`login-tabs__tab${loginTab === "center" ? " login-tabs__tab--active" : ""}`}
                onClick={() => setLoginTab("center")}
              >
                Center Login
              </button>
              <button
                type="button"
                role="tab"
                aria-selected={loginTab === "doctor"}
                className={`login-tabs__tab${loginTab === "doctor" ? " login-tabs__tab--active" : ""}`}
                onClick={() => setLoginTab("doctor")}
              >
                Doctor Login
              </button>
            </div>

            <form
              className="login-form"
              onSubmit={(e) => {
                e.preventDefault();
                completeLogin();
              }}
            >
              <label className="login-field">
                <span className="login-field__label">Username</span>
                <input
                  className="login-field__input"
                  type="text"
                  name="username"
                  defaultValue="hudu-admin"
                  autoComplete="username"
                />
              </label>

              <label className="login-field">
                <span className="login-field__label">Password</span>
                <span className="login-field__password-wrap">
                  <input
                    className="login-field__input login-field__input--password"
                    type={showPassword ? "text" : "password"}
                    name="password"
                    defaultValue="hudu-admin-pass"
                    autoComplete="current-password"
                  />
                  <button
                    type="button"
                    className="login-field__eye-btn"
                    aria-label={showPassword ? "Hide password" : "Show password"}
                    onClick={() => setShowPassword((v) => !v)}
                  >
                    <EyeIcon visible={showPassword} />
                  </button>
                </span>
              </label>

              <a href="#forgot-password" className="login-form__forgot">
                Forgot Password
              </a>

              <button type="submit" className="login-form__submit">
                Sign in using our secure server
              </button>
            </form>

            <div className="login-google-wrap">
              <button type="button" className="login-google-btn" onClick={completeLogin}>
                <GoogleIcon />
                <span>Sign in as Husain</span>
              </button>

              {showGooglePicker && (
                <div className="login-google-picker" role="dialog" aria-label="Choose Google account">
                  <div className="login-google-picker__header">
                    <GoogleIcon />
                    <span className="login-google-picker__title">
                      Sign in to livehealth.solutions with Google
                    </span>
                    <button
                      type="button"
                      className="login-google-picker__close"
                      aria-label="Close"
                      onClick={() => setShowGooglePicker(false)}
                    >
                      ×
                    </button>
                  </div>
                  <ul className="login-google-picker__list">
                    {GOOGLE_ACCOUNTS.map((account) => (
                      <li key={account.email}>
                        <button
                          type="button"
                          className="login-google-picker__account"
                          onClick={completeLogin}
                        >
                          <span className="login-google-picker__avatar" aria-hidden />
                          <span className="login-google-picker__meta">
                            <span className="login-google-picker__name">{account.name}</span>
                            <span className="login-google-picker__email">{account.email}</span>
                          </span>
                        </button>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          </section>

          <aside className="login-hero" aria-label="Product highlight">
            <img
              className="login-hero__image"
              src="/login/hero-banner.png"
              alt="Laboratory professionals reviewing quality control on a tablet"
              width={524}
              height={330}
            />
          </aside>
        </div>

        <section className="login-app-promo" aria-label="Mobile app download">
          <p className="login-app-promo__text">Manage your Lab on the go with CrelioHealth App</p>
          <div className="login-app-promo__badges">
            <AppStoreBadge />
            <GooglePlayBadge />
          </div>
        </section>
      </main>

      <footer className="login-footer">
        <p className="login-footer__disclaimer">
          By using this platform you agree to our use of cookies and similar technologies to
          provide, protect and improve our products and services, and to understand how you use
          our platform. You can change your cookie preferences at any time. If you do not agree
          with our use of cookies, please adjust your browser settings accordingly.
        </p>
        <p className="login-footer__links">
          {FOOTER_LINKS.map((label, i) => (
            <span key={label}>
              {i > 0 && <span className="login-footer__dot"> · </span>}
              <a href={`#${label.toLowerCase().replace(/\s+/g, "-")}`}>{label}</a>
            </span>
          ))}
        </p>
        <p className="login-footer__meta">Version 3.5 · © 2020 Creliant Software Pvt. Ltd.</p>
      </footer>
    </div>
  );
}
