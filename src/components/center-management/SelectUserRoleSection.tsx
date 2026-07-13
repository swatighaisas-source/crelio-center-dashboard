import { Link } from "react-router-dom";
import { SubpageBreadcrumb } from "../lab-shell/SubpageBreadcrumb";
import { USER_ROLE_CARDS, addUserDetailsHref } from "../../data/centerUserRoles";
import { usePageBreadcrumb } from "../../hooks/usePageBreadcrumb";
import "../../styles/subpage-breadcrumb.css";

interface Props {
  labId: number;
}

function RoleHintIcon() {
  return (
    <svg viewBox="0 0 16 16" width="16" height="16" fill="none" aria-hidden>
      <circle cx="6.5" cy="5" r="2.5" stroke="currentColor" strokeWidth="1.2" />
      <path
        d="M2.5 13c0-2.2 1.8-4 4-4s4 1.8 4 4"
        stroke="currentColor"
        strokeWidth="1.2"
        strokeLinecap="round"
      />
      <path d="M12 4v4M10 6h4" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" />
    </svg>
  );
}

export function SelectUserRoleSection({ labId }: Props) {
  const breadcrumb = usePageBreadcrumb();

  return (
    <div className="ue-page ue-page--select-role">
      {breadcrumb && (
        <SubpageBreadcrumb
          backHref={breadcrumb.backHref}
          backLabel={breadcrumb.backLabel}
          segments={breadcrumb.segments}
        />
      )}

      <div className="ue-select-role">
        <div className="ue-select-role__banner">
          <span className="ue-select-role__banner-icon" aria-hidden>
            <RoleHintIcon />
          </span>
          <p className="ue-select-role__banner-text">
            Select user role to quick and easily assign the required permissions
          </p>
        </div>

        <div className="ue-role-grid">
          {USER_ROLE_CARDS.map((role) => (
            <Link
              key={role.id}
              to={addUserDetailsHref(labId, role.id)}
              className="ue-role-card"
            >
              <div className="ue-role-card__head">{role.title}</div>
              <ul className="ue-role-card__list">
                {role.bullets.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
            </Link>
          ))}
        </div>

        <div className="ue-select-role__scroll" aria-hidden>
          <span className="ue-select-role__scroll-pill" />
        </div>
      </div>
    </div>
  );
}
