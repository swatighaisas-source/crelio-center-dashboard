import type { USLabArchetype } from "../../context/CreateCentreContext";

export function USLabTypeIcon({ type }: { type: USLabArchetype }) {
  return (
    <span className={`config-thumb config-thumb--us-${type}`} aria-hidden>
      <svg viewBox="0 0 56 40" fill="none" className="config-thumb__svg">
        <rect width="56" height="40" rx="2" fill="#f0f3f6" stroke="#dde3ea" strokeWidth="1" />
        {type === "physician-office" && (
          <>
            <rect x="10" y="12" width="16" height="18" rx="1" fill="#c5d0dc" />
            <rect x="30" y="14" width="16" height="4" rx="1" fill="#dce4ec" />
            <rect x="30" y="22" width="12" height="4" rx="1" fill="#b8c9d9" />
            <path d="M16 20h4M18 18v4" stroke="#8fa3b8" strokeWidth="1.2" strokeLinecap="round" />
          </>
        )}
        {type === "independent" && (
          <>
            <circle cx="18" cy="20" r="8" stroke="#b8c9d9" strokeWidth="1.5" fill="none" />
            <path d="M30 14v12M36 18v8M42 12v14" stroke="#c5d0dc" strokeWidth="2" />
          </>
        )}
        {type === "reference" && (
          <>
            <rect x="8" y="10" width="22" height="22" rx="1" fill="#b8c9d9" />
            <rect x="34" y="14" width="14" height="6" rx="1" fill="#dce4ec" />
            <rect x="34" y="24" width="14" height="6" rx="1" fill="#c5d0dc" />
            <rect x="14" y="16" width="10" height="12" rx="1" fill="#e8eef4" />
          </>
        )}
        {type === "specialty" && (
          <>
            <path
              d="M28 10v6M25 13h6"
              stroke="#8fa3b8"
              strokeWidth="1.5"
              strokeLinecap="round"
            />
            <path
              d="M22 18h12l-2 14H24l-2-14z"
              fill="#c5d0dc"
              stroke="#b8c9d9"
              strokeWidth="1"
              strokeLinejoin="round"
            />
            <ellipse cx="28" cy="28" rx="4" ry="2" fill="#dce4ec" />
          </>
        )}
        {type === "d2c" && (
          <>
            <rect x="8" y="18" width="22" height="12" rx="2" fill="#c5d0dc" />
            <circle cx="14" cy="30" r="3" fill="#b8c9d9" />
            <circle cx="24" cy="30" r="3" fill="#b8c9d9" />
            <rect x="32" y="14" width="16" height="10" rx="1" fill="#dce4ec" />
            <path d="M36 19h8M40 17v4" stroke="#8fa3b8" strokeWidth="1" strokeLinecap="round" />
          </>
        )}
      </svg>
    </span>
  );
}
