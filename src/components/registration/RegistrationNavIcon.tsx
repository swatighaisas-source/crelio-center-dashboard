import type { RegistrationNavIconId } from "../../data/registrationNav";

const stroke = { stroke: "currentColor", strokeWidth: 1.3, fill: "none" };

export function RegistrationNavIcon({ id, active }: { id: RegistrationNavIconId; active?: boolean }) {
  const color = active ? "#ffffff" : "currentColor";

  return (
    <span className="reg-nav-icon" aria-hidden style={{ color }}>
      <svg viewBox="0 0 18 18" width="16" height="16">
        {id === "registration" && (
          <>
            <rect x="3" y="2" width="12" height="14" rx="1.5" {...stroke} />
            <path d="M6 6h6M6 9h6M6 12h4" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" />
          </>
        )}
        {id === "calendar" && (
          <>
            <rect x="3" y="4" width="12" height="11" rx="1.5" {...stroke} />
            <path d="M3 7h12M6 2v3M12 2v3" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" />
          </>
        )}
        {id === "home" && (
          <>
            <path d="M3 8l6-5 6 5v7H3V8z" {...stroke} strokeLinejoin="round" />
            <path d="M7 15v-4h4v4" {...stroke} strokeLinejoin="round" />
          </>
        )}
        {id === "history" && (
          <>
            <circle cx="9" cy="9" r="6.5" {...stroke} />
            <path d="M9 5.5V9l2.5 2" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" />
          </>
        )}
        {id === "forms" && (
          <>
            <path d="M5 2h8l2 2v12H5V2z" {...stroke} strokeLinejoin="round" />
            <path d="M7 7h6M7 10h6M7 13h4" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" />
          </>
        )}
        {id === "cash" && (
          <>
            <rect x="2" y="5" width="14" height="9" rx="1.5" {...stroke} />
            <circle cx="9" cy="9.5" r="2" {...stroke} />
          </>
        )}
        {id === "finance" && (
          <>
            <path d="M3 14V6l6-3 6 3v8" {...stroke} strokeLinejoin="round" />
            <path d="M7 14V9h4v5" {...stroke} strokeLinejoin="round" />
          </>
        )}
        {id === "archive" && (
          <>
            <rect x="3" y="4" width="12" height="10" rx="1.5" {...stroke} />
            <path d="M3 7h12" stroke="currentColor" strokeWidth="1.3" />
          </>
        )}
        {id === "print" && (
          <>
            <rect x="5" y="2" width="8" height="4" rx="1" {...stroke} />
            <rect x="3" y="6" width="12" height="8" rx="1.5" {...stroke} />
            <rect x="6" y="10" width="6" height="4" {...stroke} />
          </>
        )}
        {id === "collection" && (
          <>
            <path d="M4 14l2-8h6l2 8H4z" {...stroke} strokeLinejoin="round" />
            <path d="M7 6V4h4v2" {...stroke} strokeLinecap="round" />
          </>
        )}
        {id === "services" && (
          <>
            <rect x="3" y="3" width="5" height="5" rx="1" {...stroke} />
            <rect x="10" y="3" width="5" height="5" rx="1" {...stroke} />
            <rect x="3" y="10" width="5" height="5" rx="1" {...stroke} />
            <rect x="10" y="10" width="5" height="5" rx="1" {...stroke} />
          </>
        )}
        {id === "status" && (
          <>
            <circle cx="9" cy="9" r="6.5" {...stroke} />
            <path d="M9 5.5v4l2.5 1.5" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" />
          </>
        )}
        {id === "search" && (
          <>
            <circle cx="8" cy="8" r="4.5" {...stroke} />
            <path d="M11.5 11.5L15 15" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" />
          </>
        )}
      </svg>
    </span>
  );
}
