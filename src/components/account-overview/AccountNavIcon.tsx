import type { NavIconId } from "../../data/accountOverview";

interface Props {
  id: NavIconId;
  active?: boolean;
}

export function AccountNavIcon({ id, active }: Props) {
  const stroke = active ? "#ffffff" : "currentColor";
  const fill = active ? "#ffffff" : "none";

  switch (id) {
    case "home":
      return (
        <svg className="ao-nav-icon" viewBox="0 0 16 16" fill="none" aria-hidden>
          <path
            d="M2.5 7.5L8 2.5l5.5 5M4 7v5.5h8V7"
            stroke={stroke}
            strokeWidth="1.1"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      );
    case "gear":
      return (
        <svg className="ao-nav-icon" viewBox="0 0 16 16" fill="none" aria-hidden>
          <circle cx="8" cy="8" r="2.2" stroke={stroke} strokeWidth="1.2" />
          <path
            d="M8 1.5v1.2M8 13.3v1.2M1.5 8h1.2M13.3 8h1.2M3.2 3.2l.85.85M11.95 11.95l.85.85M3.2 12.8l.85-.85M11.95 4.05l.85-.85"
            stroke={stroke}
            strokeWidth="1.1"
            strokeLinecap="round"
          />
        </svg>
      );
    case "grid":
      return (
        <svg className="ao-nav-icon" viewBox="0 0 16 16" fill="none" aria-hidden>
          <rect x="2" y="2" width="4.5" height="4.5" rx="0.5" stroke={stroke} strokeWidth="1.1" />
          <rect x="9.5" y="2" width="4.5" height="4.5" rx="0.5" stroke={stroke} strokeWidth="1.1" />
          <rect x="2" y="9.5" width="4.5" height="4.5" rx="0.5" stroke={stroke} strokeWidth="1.1" />
          <rect x="9.5" y="9.5" width="4.5" height="4.5" rx="0.5" stroke={stroke} strokeWidth="1.1" />
        </svg>
      );
    case "stethoscope":
      return (
        <svg className="ao-nav-icon" viewBox="0 0 16 16" fill="none" aria-hidden>
          <path
            d="M4.5 3.5v4a3 3 0 006 0V5.5M10.5 9.5a2.5 2.5 0 104.5 0v-1"
            stroke={stroke}
            strokeWidth="1.15"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      );
    case "layers":
      return (
        <svg className="ao-nav-icon" viewBox="0 0 16 16" fill="none" aria-hidden>
          <path d="M2 5.5L8 2.5l6 3-6 3-6-3z" stroke={stroke} strokeWidth="1.1" strokeLinejoin="round" />
          <path d="M2 8.5l6 3 6-3" stroke={stroke} strokeWidth="1.1" strokeLinejoin="round" />
          <path d="M2 11.5l6 3 6-3" stroke={stroke} strokeWidth="1.1" strokeLinejoin="round" />
        </svg>
      );
    case "pie":
      return (
        <svg className="ao-nav-icon" viewBox="0 0 16 16" fill="none" aria-hidden>
          <circle cx="8" cy="8" r="5.5" stroke={stroke} strokeWidth="1.1" />
          <path d="M8 8V2.5A5.5 5.5 0 0112.2 8H8z" fill={active ? "rgba(255,255,255,0.35)" : "currentColor"} stroke="none" />
        </svg>
      );
    case "translation":
      return (
        <svg className="ao-nav-icon ao-nav-icon--translation" viewBox="0 0 16 16" fill="none" aria-hidden>
          <text x="1" y="11" fontSize="10" fontWeight="600" fill={stroke}>
            A
          </text>
          <text x="9" y="11" fontSize="9" fill={stroke}>
            文
          </text>
        </svg>
      );
    case "search":
      return (
        <svg className="ao-nav-icon" viewBox="0 0 16 16" fill="none" aria-hidden>
          <circle cx="7" cy="7" r="4.2" stroke={stroke} strokeWidth="1.15" />
          <path d="M10.2 10.2L13.5 13.5" stroke={stroke} strokeWidth="1.15" strokeLinecap="round" />
        </svg>
      );
    case "bell":
      return (
        <svg className="ao-nav-icon" viewBox="0 0 16 16" fill="none" aria-hidden>
          <path
            d="M4 6.5a4 4 0 018 0v2.2l.8 1.6H3.2l.8-1.6V6.5zM6.5 12.5a1.5 1.5 0 003 0"
            stroke={stroke}
            strokeWidth="1.1"
            strokeLinejoin="round"
          />
        </svg>
      );
    case "play":
      return (
        <svg className="ao-nav-icon" viewBox="0 0 16 16" fill="none" aria-hidden>
          <circle cx="8" cy="8" r="5.5" stroke={stroke} strokeWidth="1.1" />
          <path d="M7 5.5l4 2.5-4 2.5V5.5z" fill={fill} stroke={stroke} strokeWidth="0.8" />
        </svg>
      );
    case "phone":
      return (
        <svg className="ao-nav-icon" viewBox="0 0 16 16" fill="none" aria-hidden>
          <path
            d="M4.5 2.8h2.2l.9 2.2-1.4 1c.8 1.6 2.1 2.9 3.7 3.7l1-1.4 2.2.9v2.2c0 .6-.5 1.1-1.1 1.1C6.8 13.5 2.5 9.2 2.5 4c0-.6.4-1.2 1-1.2z"
            stroke={stroke}
            strokeWidth="1.05"
            strokeLinejoin="round"
          />
        </svg>
      );
    case "globe":
      return (
        <svg className="ao-nav-icon ao-nav-icon--translation" viewBox="0 0 16 16" fill="none" aria-hidden>
          <text x="1" y="11" fontSize="10" fontWeight="600" fill={stroke}>
            A
          </text>
          <text x="9" y="11" fontSize="9" fill={stroke}>
            文
          </text>
        </svg>
      );
    case "plus":
      return (
        <svg className="ao-nav-icon" viewBox="0 0 16 16" fill="none" aria-hidden>
          <path d="M8 3v10M3 8h10" stroke={stroke} strokeWidth="1.2" strokeLinecap="round" />
        </svg>
      );
    default:
      return <span className="ao-nav-icon" aria-hidden />;
  }
}
