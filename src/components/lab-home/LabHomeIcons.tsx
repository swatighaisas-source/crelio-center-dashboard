type IconName =
  | "search"
  // status / task icons
  | "report"
  | "flag"
  | "tube"
  | "warning"
  | "users"
  | "dollar"
  | "clock"
  | "check"
  // task icons
  | "task"
  | "alert"
  | "invoice-task"
  | "sample"
  | "report-task"
  // quick action icons
  | "track"
  | "trf"
  | "label"
  | "register"
  | "results"
  | "invoice"
  | "approve"
  | "flag-action"
  // module icons
  | "registration"
  | "inbox"
  | "bills"
  | "accession"
  | "tracker"
  | "collections"
  | "critical"
  // ui chrome
  | "chevron"
  | "gear"
  | "bell"
  | "phone"
  | "mail";

export function LabHomeIcon({ name }: { name: IconName }) {
  const s = "currentColor";
  switch (name) {
    case "search":
      return (
        <svg viewBox="0 0 20 20" fill="none" aria-hidden>
          <circle cx="9" cy="9" r="5.5" stroke={s} strokeWidth="1.4" />
          <path d="M13.5 13.5L17 17" stroke={s} strokeWidth="1.4" strokeLinecap="round" />
        </svg>
      );
    case "report":
    case "report-task":
      return (
        <svg viewBox="0 0 24 24" fill="none" aria-hidden>
          <path d="M7 4h10v16H7z" stroke={s} strokeWidth="1.4" />
          <path d="M9 8h6M9 12h6M9 16h4" stroke={s} strokeWidth="1.3" strokeLinecap="round" />
        </svg>
      );
    case "flag":
    case "flag-action":
      return (
        <svg viewBox="0 0 24 24" fill="none" aria-hidden>
          <path d="M6 4v16M6 4h8l-2 3 2 3H6" stroke={s} strokeWidth="1.4" strokeLinejoin="round" />
        </svg>
      );
    case "tube":
    case "sample":
      return (
        <svg viewBox="0 0 24 24" fill="none" aria-hidden>
          <path d="M9 4h6v8l2 5a2 2 0 01-2 2H9a2 2 0 01-2-2l2-5V4z" stroke={s} strokeWidth="1.3" strokeLinejoin="round" />
          <path d="M7 14h10" stroke={s} strokeWidth="1.3" strokeLinecap="round" />
        </svg>
      );
    case "warning":
    case "alert":
      return (
        <svg viewBox="0 0 24 24" fill="none" aria-hidden>
          <path d="M12 4L2 20h20L12 4z" stroke={s} strokeWidth="1.4" strokeLinejoin="round" />
          <path d="M12 10v4M12 17v1" stroke={s} strokeWidth="1.4" strokeLinecap="round" />
        </svg>
      );
    case "users":
      return (
        <svg viewBox="0 0 24 24" fill="none" aria-hidden>
          <circle cx="9" cy="8" r="3" stroke={s} strokeWidth="1.3" />
          <path d="M3 19c0-3.3 2.7-5.5 6-5.5s6 2.2 6 5.5" stroke={s} strokeWidth="1.3" strokeLinecap="round" />
          <circle cx="17" cy="8" r="2.2" stroke={s} strokeWidth="1.2" />
          <path d="M21 19c0-2.5-1.8-4.2-4-4.7" stroke={s} strokeWidth="1.2" strokeLinecap="round" />
        </svg>
      );
    case "dollar":
    case "invoice":
    case "invoice-task":
      return (
        <svg viewBox="0 0 24 24" fill="none" aria-hidden>
          <circle cx="12" cy="12" r="8.5" stroke={s} strokeWidth="1.3" />
          <path d="M12 7v10M9.5 9.5h4a1.5 1.5 0 010 3h-3a1.5 1.5 0 000 3h4" stroke={s} strokeWidth="1.3" strokeLinecap="round" />
        </svg>
      );
    case "clock":
      return (
        <svg viewBox="0 0 24 24" fill="none" aria-hidden>
          <circle cx="12" cy="12" r="8.5" stroke={s} strokeWidth="1.3" />
          <path d="M12 7v5.5l3.5 2" stroke={s} strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      );
    case "check":
    case "approve":
      return (
        <svg viewBox="0 0 24 24" fill="none" aria-hidden>
          <path d="M4 12l5.5 5.5L20 7" stroke={s} strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      );
    case "task":
      return (
        <svg viewBox="0 0 24 24" fill="none" aria-hidden>
          <path d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2" stroke={s} strokeWidth="1.3" strokeLinejoin="round" />
          <rect x="9" y="3" width="6" height="4" rx="1" stroke={s} strokeWidth="1.3" />
          <path d="M9 12h6M9 16h4" stroke={s} strokeWidth="1.3" strokeLinecap="round" />
        </svg>
      );
    case "track":
      return (
        <svg viewBox="0 0 32 32" fill="none" aria-hidden>
          <circle cx="16" cy="16" r="11" stroke={s} strokeWidth="1.6" />
          <path d="M16 9v7.5l4 4" stroke={s} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      );
    case "trf":
      return (
        <svg viewBox="0 0 32 32" fill="none" aria-hidden>
          <path d="M10 6h12v20H10z" stroke={s} strokeWidth="1.5" strokeLinejoin="round" />
          <path d="M13 11h6M13 15h6M13 19h4" stroke={s} strokeWidth="1.3" strokeLinecap="round" />
        </svg>
      );
    case "label":
      return (
        <svg viewBox="0 0 32 32" fill="none" aria-hidden>
          <rect x="6" y="8" width="20" height="16" rx="2" stroke={s} strokeWidth="1.5" />
          <path d="M6 13h20" stroke={s} strokeWidth="1.3" />
          <rect x="10" y="16" width="12" height="4" rx="1" stroke={s} strokeWidth="1.1" />
        </svg>
      );
    case "register":
      return (
        <svg viewBox="0 0 32 32" fill="none" aria-hidden>
          <circle cx="13" cy="12" r="4" stroke={s} strokeWidth="1.5" />
          <path d="M5 27c0-5 3.6-8 8-8" stroke={s} strokeWidth="1.5" strokeLinecap="round" />
          <path d="M22 17v8M18 21h8" stroke={s} strokeWidth="1.5" strokeLinecap="round" />
        </svg>
      );
    case "results":
      return (
        <svg viewBox="0 0 32 32" fill="none" aria-hidden>
          <path d="M9 6h14v20H9z" stroke={s} strokeWidth="1.5" strokeLinejoin="round" />
          <path d="M12 12h8M12 16h8M12 20h5" stroke={s} strokeWidth="1.3" strokeLinecap="round" />
          <path d="M19 19l4 4" stroke={s} strokeWidth="1.4" strokeLinecap="round" />
        </svg>
      );
    case "registration":
      return (
        <svg viewBox="0 0 32 32" fill="none" aria-hidden>
          <path d="M10 5h12v22H10z" stroke={s} strokeWidth="1.5" strokeLinejoin="round" />
          <circle cx="16" cy="12" r="3" stroke={s} strokeWidth="1.3" />
          <path d="M10 22c0-3.3 2.7-5 6-5s6 1.7 6 5" stroke={s} strokeWidth="1.3" strokeLinecap="round" />
        </svg>
      );
    case "inbox":
      return (
        <svg viewBox="0 0 32 32" fill="none" aria-hidden>
          <path d="M6 8h20v16H6z" stroke={s} strokeWidth="1.5" strokeLinejoin="round" />
          <path d="M6 20h5l2 3h6l2-3h5" stroke={s} strokeWidth="1.3" strokeLinejoin="round" />
          <path d="M10 13h12M10 17h8" stroke={s} strokeWidth="1.2" strokeLinecap="round" />
        </svg>
      );
    case "bills":
    case "collections":
      return (
        <svg viewBox="0 0 32 32" fill="none" aria-hidden>
          <path d="M6 8h20v16H6z" stroke={s} strokeWidth="1.5" strokeLinejoin="round" />
          <path d="M16 12v8M13 14h4.5a1.5 1.5 0 010 3H13" stroke={s} strokeWidth="1.3" strokeLinecap="round" />
        </svg>
      );
    case "accession":
      return (
        <svg viewBox="0 0 32 32" fill="none" aria-hidden>
          <path d="M16 6c-3 0-6 3-6 7a6 6 0 0012 0c0-4-3-7-6-7z" stroke={s} strokeWidth="1.4" strokeLinejoin="round" />
          <path d="M11 20c1.2 2 2.7 3 5 3s3.8-1 5-3" stroke={s} strokeWidth="1.3" strokeLinecap="round" />
        </svg>
      );
    case "tracker":
      return (
        <svg viewBox="0 0 32 32" fill="none" aria-hidden>
          <circle cx="16" cy="16" r="10" stroke={s} strokeWidth="1.5" />
          <circle cx="16" cy="16" r="4" stroke={s} strokeWidth="1.2" />
          <path d="M16 6v4M16 22v4M6 16h4M22 16h4" stroke={s} strokeWidth="1.2" strokeLinecap="round" />
        </svg>
      );
    case "critical":
      return (
        <svg viewBox="0 0 32 32" fill="none" aria-hidden>
          <path d="M16 5L3 27h26L16 5z" stroke={s} strokeWidth="1.5" strokeLinejoin="round" />
          <path d="M16 13v6M16 22v2" stroke={s} strokeWidth="1.5" strokeLinecap="round" />
        </svg>
      );
    case "chevron":
      return (
        <svg viewBox="0 0 16 16" fill="none" aria-hidden>
          <path d="M5 2l6 6-6 6" stroke={s} strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      );
    case "gear":
      return (
        <svg viewBox="0 0 16 16" fill="none" aria-hidden>
          <circle cx="8" cy="8" r="2.2" stroke={s} strokeWidth="1.2" />
          <path d="M8 1.5v1.2M8 13.3v1.2M1.5 8h1.2M13.3 8h1.2M3.2 3.2l.85.85M11.95 11.95l.85.85M3.2 12.8l.85-.85M11.95 4.05l.85-.85" stroke={s} strokeWidth="1.1" strokeLinecap="round" />
        </svg>
      );
    case "bell":
      return (
        <svg viewBox="0 0 20 20" fill="none" aria-hidden>
          <path d="M5 7.5a5 5 0 0110 0v2.5l1 2H4l1-2V7.5zM8 15.5a2 2 0 004 0" stroke={s} strokeWidth="1.3" strokeLinejoin="round" />
        </svg>
      );
    case "phone":
      return (
        <svg viewBox="0 0 16 16" fill="none" aria-hidden>
          <path d="M4 2.5h2l.8 2-1.2 1c.7 1.4 1.8 2.5 3.2 3.2l1-1.2 2 .8v2c0 .5-.4 1-1 1-4.5 0-8-3.5-8-8 0-.6.4-1 1-1z" stroke={s} strokeWidth="1.1" strokeLinejoin="round" />
        </svg>
      );
    case "mail":
      return (
        <svg viewBox="0 0 16 16" fill="none" aria-hidden>
          <path d="M2.5 4.5h11v7h-11z" stroke={s} strokeWidth="1.1" strokeLinejoin="round" />
          <path d="M2.5 5.5l5.5 3.5 5.5-3.5" stroke={s} strokeWidth="1.1" strokeLinejoin="round" />
        </svg>
      );
    default:
      return null;
  }
}
