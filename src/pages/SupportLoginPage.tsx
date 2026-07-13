import { Link } from "react-router-dom";
import { CheckLogoIcon } from "../components/Icons";
import "../styles/support-login.css";

const SERVERS = [
  { label: "Mumbai", href: "#mumbai" },
  { label: "US Server", href: "/create-centre/us" },
  { label: "Saudi Server", href: "#saudi" },
  { label: "Europe Server", href: "#europe" },
  { label: "UAE Server", href: "#uae" },
  { label: "NRL Server", href: "#nrl" },
  { label: "Malaysia Server", href: "#malaysia" },
] as const;

function GoogleGIcon() {
  return (
    <svg className="support-google__g" viewBox="0 0 18 18" aria-hidden>
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

function ChevronDownSmall() {
  return (
    <svg className="support-google__chevron" viewBox="0 0 10 6" fill="none" aria-hidden>
      <path d="M1 1l4 4 4-4" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" />
    </svg>
  );
}

export function SupportLoginPage() {
  return (
    <div className="support-login-page">
      <main className="support-login">
        <Link to="/login" className="support-login__logo" aria-label="CrelioHealth home">
          <CheckLogoIcon />
          <span className="support-login__brand">
            <span className="support-login__brand-crelio">Crelio</span>
            <span className="support-login__brand-health">Health</span>
          </span>
        </Link>

        <h1 className="support-login__title">Support Login</h1>

        <nav className="support-login__servers" aria-label="Select server region">
          {SERVERS.map(({ label, href }) =>
            href.startsWith("/") ? (
              <Link key={label} to={href} className="support-login__server-link">
                {label}
              </Link>
            ) : (
              <a key={label} href={href} className="support-login__server-link">
                {label}
              </a>
            ),
          )}
        </nav>

        <Link to="/create-centre/us" className="support-google" aria-label="Sign in with Google as Husain">
          <span className="support-google__avatar" aria-hidden />
          <span className="support-google__text">
            <span className="support-google__line">Sign in as Husain</span>
            <span className="support-google__email-row">
              <span className="support-google__email">husain@livehealth.in</span>
              <ChevronDownSmall />
            </span>
          </span>
          <GoogleGIcon />
        </Link>
      </main>
    </div>
  );
}
