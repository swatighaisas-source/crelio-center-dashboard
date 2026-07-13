import type { AdminSubNavIconId } from "../../data/accountOverview";

const stroke = "currentColor";

interface Props {
  id: AdminSubNavIconId;
}

export function AdminSubNavIcon({ id }: Props) {
  switch (id) {
    case "home":
      return (
        <svg className="ao-admin-subnav__icon" viewBox="0 0 16 16" fill="none" aria-hidden>
          <path
            d="M2.5 7.5L8 2.5l5.5 5M4 7v5.5h8V7"
            stroke={stroke}
            strokeWidth="1.1"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      );
    case "admin":
      return (
        <svg className="ao-admin-subnav__icon" viewBox="0 0 16 16" fill="none" aria-hidden>
          <circle cx="8" cy="8" r="2.2" stroke={stroke} strokeWidth="1.2" />
          <path
            d="M8 1.5v1.2M8 13.3v1.2M1.5 8h1.2M13.3 8h1.2M3.2 3.2l.85.85M11.95 11.95l.85.85M3.2 12.8l.85-.85M11.95 4.05l.85-.85"
            stroke={stroke}
            strokeWidth="1.1"
            strokeLinecap="round"
          />
        </svg>
      );
    case "registration":
      return (
        <svg className="ao-admin-subnav__icon" viewBox="0 0 16 16" fill="none" aria-hidden>
          <circle cx="6" cy="5" r="2.2" stroke={stroke} strokeWidth="1.1" />
          <path
            d="M2.5 13c0-2.2 1.6-3.8 3.5-3.8s3.5 1.6 3.5 3.8M11 6v4M13 8h-4"
            stroke={stroke}
            strokeWidth="1.1"
            strokeLinecap="round"
          />
        </svg>
      );
    case "accession":
      return (
        <svg className="ao-admin-subnav__icon" viewBox="0 0 16 16" fill="none" aria-hidden>
          <path
            d="M8 2.5c-2 0-3.5 1.8-3.5 4a3.5 3.5 0 007 0c0-2.2-1.5-4-3.5-4z"
            stroke={stroke}
            strokeWidth="1.1"
            strokeLinejoin="round"
          />
          <path
            d="M5.5 10.5c.8 1.2 1.7 1.8 2.5 1.8s1.7-.6 2.5-1.8"
            stroke={stroke}
            strokeWidth="1.1"
            strokeLinecap="round"
          />
        </svg>
      );
    case "operation":
      return (
        <svg className="ao-admin-subnav__icon" viewBox="0 0 16 16" fill="none" aria-hidden>
          <path
            d="M3 3.5h10v9H3zM6 3.5V2.5h4v1"
            stroke={stroke}
            strokeWidth="1.1"
            strokeLinejoin="round"
          />
          <path d="M6 7h4M6 9.5h2.5" stroke={stroke} strokeWidth="1.1" strokeLinecap="round" />
        </svg>
      );
    case "finance":
    case "analytics":
      return (
        <svg className="ao-admin-subnav__icon" viewBox="0 0 16 16" fill="none" aria-hidden>
          <path
            d="M11.5 4.5a3.5 3.5 0 10 5 5M4.5 11.5a3.5 3.5 0 100-5-5"
            stroke={stroke}
            strokeWidth="1.1"
            strokeLinecap="round"
          />
          <path
            d="M6 6l1.2 1.2M9.8 9.8L11 11"
            stroke={stroke}
            strokeWidth="1.1"
            strokeLinecap="round"
          />
        </svg>
      );
    case "reviewer":
      return (
        <svg className="ao-admin-subnav__icon" viewBox="0 0 16 16" fill="none" aria-hidden>
          <path
            d="M2.5 8s2.2-3.5 5.5-3.5S13.5 8 13.5 8s-2.2 3.5-5.5 3.5S2.5 8 2.5 8z"
            stroke={stroke}
            strokeWidth="1.1"
            strokeLinejoin="round"
          />
          <circle cx="8" cy="8" r="1.5" fill={stroke} />
        </svg>
      );
    case "inventory":
    case "crm":
      return (
        <svg className="ao-admin-subnav__icon" viewBox="0 0 16 16" fill="none" aria-hidden>
          <path
            d="M2.5 3h2l.8 2h5.4l.8-2h2M4 5.5v7.5H12V5.5"
            stroke={stroke}
            strokeWidth="1.1"
            strokeLinejoin="round"
            strokeLinecap="round"
          />
          <circle cx="6" cy="11" r="0.8" fill={stroke} />
          <circle cx="10" cy="11" r="0.8" fill={stroke} />
        </svg>
      );
    default:
      return <span className="ao-admin-subnav__icon" aria-hidden />;
  }
}
