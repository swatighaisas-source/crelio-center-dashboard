import type { AccountConfigurationType } from "../../context/CreateCentreContext";

export function ConfigTypeThumbnail({ type }: { type: AccountConfigurationType }) {
  return (
    <span className={`config-thumb config-thumb--${type}`} aria-hidden>
      <svg viewBox="0 0 56 40" fill="none" className="config-thumb__svg">
        <rect width="56" height="40" rx="2" fill="#f0f3f6" stroke="#dde3ea" strokeWidth="1" />
        {type === "basic-lab" && (
          <>
            <rect x="8" y="10" width="20" height="3" rx="1" fill="#c5d0dc" />
            <rect x="8" y="16" width="28" height="3" rx="1" fill="#dce4ec" />
            <rect x="8" y="22" width="16" height="8" rx="1" fill="#b8c9d9" />
            <rect x="28" y="22" width="20" height="8" rx="1" fill="#a8bdd0" />
          </>
        )}
        {type === "advanced-lab" && (
          <>
            <circle cx="18" cy="20" r="8" stroke="#b8c9d9" strokeWidth="1.5" fill="none" />
            <path d="M30 14v12M36 18v8M42 12v14" stroke="#c5d0dc" strokeWidth="2" />
          </>
        )}
        {type === "covid" && (
          <>
            <circle cx="28" cy="18" r="10" stroke="#b8c9d9" strokeWidth="1.5" fill="#e8eef4" />
            <path d="M24 18h8M28 14v8" stroke="#8fa3b8" strokeWidth="1.5" />
          </>
        )}
        {type === "collection" && (
          <>
            <rect x="10" y="12" width="14" height="16" rx="1" fill="#c5d0dc" />
            <rect x="28" y="14" width="18" height="4" rx="1" fill="#dce4ec" />
            <rect x="28" y="22" width="12" height="4" rx="1" fill="#b8c9d9" />
          </>
        )}
        {type === "radiology-pacs" && (
          <>
            <rect x="8" y="12" width="18" height="16" rx="1" fill="#b8c9d9" />
            <rect x="30" y="12" width="18" height="16" rx="1" fill="#c5d0dc" />
            <circle cx="17" cy="20" r="4" fill="#dce4ec" />
          </>
        )}
      </svg>
    </span>
  );
}
