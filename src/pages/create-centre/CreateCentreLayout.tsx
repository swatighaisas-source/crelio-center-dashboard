import { Link, Outlet, useLocation, useNavigate } from "react-router-dom";
import { CreateCentreProvider } from "../../context/CreateCentreContext";
import { CheckLogoIcon } from "../../components/Icons";
import "../../styles/create-centre.css";

function SetupTopNav() {
  const location = useLocation();
  const navigate = useNavigate();
  const showLogout =
    location.pathname.includes("/account-ready") ||
    location.pathname.includes("/setup") ||
    location.pathname.includes("/choose-plan") ||
    location.pathname.includes("/report-template") ||
    location.pathname.includes("/wizard") ||
    location.pathname.includes("/us");

  return (
    <header className="setup-top-nav">
      <Link to="/" className="setup-top-nav__logo">
        <CheckLogoIcon />
        <span className="setup-top-nav__brand">
          <span className="setup-top-nav__crelio">Crelio</span>
          <span className="setup-top-nav__health">Health</span>
        </span>
      </Link>
      {showLogout && (
        <button
          type="button"
          className="setup-top-nav__logout"
          onClick={() => navigate("/")}
        >
          Logout
        </button>
      )}
    </header>
  );
}

export function CreateCentreLayout() {
  return (
    <CreateCentreProvider>
      <div className="create-centre-layout">
        <SetupTopNav />
        <main className="create-centre-layout__main">
          <Outlet />
        </main>
      </div>
    </CreateCentreProvider>
  );
}
