import { useNavigate } from "react-router-dom";
import { CheckLogoIcon, ChevronDownIcon, SearchIcon, UserIcon } from "./Icons";

export function TopNav() {
  const navigate = useNavigate();
  return (
    <header className="top-nav">
      <div className="top-nav__left">
        <div className="logo">
          <CheckLogoIcon />
          <span>CrelioHealth</span>
        </div>
        <nav className="nav-links">
          <button type="button" className="nav-link nav-link--active">
            Centre Dashboard
          </button>
          <button type="button" className="nav-link">
            Others
            <ChevronDownIcon className="nav-link__chevron" />
          </button>
        </nav>
      </div>
      <div className="top-nav__right">
        <div className="search-box">
          <SearchIcon />
          <input
            className="search-box__input"
            type="text"
            placeholder="Name/ID Search"
            aria-label="Name or ID search"
          />
        </div>
        <button
          type="button"
          className="btn-outline"
          onClick={() => navigate("/clia-profiling")}
        >
          CLIA POC
        </button>
        <button
          type="button"
          className="btn-outline top-nav__create"
          onClick={() => navigate("/create-centre/us")}
        >
          Create Centre
        </button>
        <button type="button" className="btn-outline">
          Go to Old Dashboard
        </button>
        <button type="button" className="user-menu">
          <span className="user-menu__avatar">
            <UserIcon />
          </span>
          <span>Husain</span>
          <ChevronDownIcon className="user-menu__chevron" />
        </button>
      </div>
    </header>
  );
}
