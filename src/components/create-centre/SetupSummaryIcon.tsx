import type { SetupSummaryIconId } from "../../lib/buildSetupSummary";

export function SetupSummaryIcon({ type }: { type: SetupSummaryIconId }) {
  return (
    <span className="setup-summary-icon" aria-hidden>
      <svg viewBox="0 0 32 32" fill="none" className="setup-summary-icon__svg">
        <rect width="32" height="32" rx="8" fill="#f0f4f8" />
        {type === "lab" && (
          <>
            <path d="M10 24V12l6-4 6 4v12" stroke="#4a90e2" strokeWidth="1.5" strokeLinejoin="round" />
            <rect x="14" y="16" width="4" height="8" stroke="#6b8aad" strokeWidth="1.2" />
          </>
        )}
        {type === "identifiers" && (
          <>
            <rect x="9" y="11" width="14" height="10" rx="1.5" stroke="#4a90e2" strokeWidth="1.5" />
            <path d="M12 15h8M12 18h5" stroke="#6b8aad" strokeWidth="1.2" strokeLinecap="round" />
          </>
        )}
        {type === "lab-type" && (
          <circle cx="16" cy="16" r="7" stroke="#4a90e2" strokeWidth="1.5" fill="#e8eef4" />
        )}
        {type === "modalities" && (
          <>
            <rect x="10" y="10" width="5" height="5" rx="1" stroke="#93c47d" strokeWidth="1.2" />
            <rect x="17" y="10" width="5" height="5" rx="1" stroke="#93c47d" strokeWidth="1.2" />
            <rect x="10" y="17" width="5" height="5" rx="1" stroke="#93c47d" strokeWidth="1.2" />
            <rect x="17" y="17" width="5" height="5" rx="1" stroke="#93c47d" strokeWidth="1.2" />
          </>
        )}
        {type === "operations" && (
          <>
            <path d="M11 22V14l5-3 5 3v8" stroke="#f6b26b" strokeWidth="1.5" strokeLinejoin="round" />
            <path d="M14 18h4" stroke="#f6b26b" strokeWidth="1.2" strokeLinecap="round" />
          </>
        )}
        {type === "devices" && (
          <>
            <rect x="10" y="12" width="12" height="10" rx="1.5" stroke="#6b8aad" strokeWidth="1.5" />
            <path d="M13 16h6" stroke="#6b8aad" strokeWidth="1.2" strokeLinecap="round" />
          </>
        )}
        {type === "integrations" && (
          <>
            <circle cx="11" cy="16" r="2" fill="#4a90e2" />
            <circle cx="21" cy="11" r="2" fill="#4a90e2" />
            <circle cx="21" cy="21" r="2" fill="#4a90e2" />
            <path d="M13 15.5L19 11.5M13 16.5L19 20.5" stroke="#6b8aad" strokeWidth="1.2" />
          </>
        )}
        {type === "plan" && (
          <>
            <rect x="10" y="12" width="12" height="9" rx="1" stroke="#4a90e2" strokeWidth="1.5" />
            <path d="M10 16h12" stroke="#6b8aad" strokeWidth="1.2" />
            <path d="M13 19h6" stroke="#52c41a" strokeWidth="1.2" strokeLinecap="round" />
          </>
        )}
        {type === "configuration" && (
          <>
            <path d="M10 14h12M10 18h8" stroke="#6b8aad" strokeWidth="1.5" strokeLinecap="round" />
            <rect x="10" y="10" width="12" height="14" rx="1" stroke="#4a90e2" strokeWidth="1.5" />
          </>
        )}
        {type === "team" && (
          <>
            <circle cx="13" cy="14" r="2.5" stroke="#4a90e2" strokeWidth="1.2" />
            <circle cx="19" cy="14" r="2.5" stroke="#4a90e2" strokeWidth="1.2" />
            <path d="M9 22c0-2.5 2-4 7-4s7 1.5 7 4" stroke="#6b8aad" strokeWidth="1.2" strokeLinecap="round" />
          </>
        )}
      </svg>
    </span>
  );
}
