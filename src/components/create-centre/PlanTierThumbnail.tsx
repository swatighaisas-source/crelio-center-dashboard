import type { USPlanTier } from "../../context/CreateCentreContext";

export function PlanTierThumbnail({ tier }: { tier: USPlanTier }) {
  return (
    <span className={`config-thumb config-thumb--plan-${tier}`} aria-hidden>
      <svg viewBox="0 0 56 40" fill="none" className="config-thumb__svg">
        <rect width="56" height="40" rx="2" fill="#f0f3f6" stroke="#dde3ea" strokeWidth="1" />
        {tier === "smart" && (
          <>
            <rect x="10" y="12" width="18" height="3" rx="1" fill="#a8c9a0" />
            <rect x="10" y="18" width="24" height="3" rx="1" fill="#c5dcc0" />
            <rect x="10" y="26" width="14" height="6" rx="1" fill="#8fb886" />
          </>
        )}
        {tier === "optimized" && (
          <>
            <rect x="10" y="12" width="14" height="3" rx="1" fill="#9bb8e8" />
            <rect x="10" y="18" width="22" height="3" rx="1" fill="#c5d8f0" />
            <rect x="10" y="24" width="18" height="3" rx="1" fill="#9bb8e8" />
            <rect x="32" y="24" width="14" height="10" rx="1" fill="#7aa3de" />
          </>
        )}
        {tier === "pro" && (
          <>
            <rect x="8" y="11" width="12" height="3" rx="1" fill="#7cb87c" />
            <rect x="8" y="17" width="18" height="3" rx="1" fill="#a8d4a8" />
            <rect x="8" y="23" width="10" height="3" rx="1" fill="#7cb87c" />
            <rect x="22" y="23" width="10" height="3" rx="1" fill="#7cb87c" />
            <rect x="36" y="11" width="12" height="22" rx="1" fill="#5a9e5a" />
          </>
        )}
        {tier === "power" && (
          <>
            <rect x="8" y="10" width="10" height="4" rx="1" fill="#b8a0e0" />
            <rect x="20" y="10" width="10" height="4" rx="1" fill="#b8a0e0" />
            <rect x="32" y="10" width="10" height="4" rx="1" fill="#b8a0e0" />
            <rect x="8" y="18" width="34" height="3" rx="1" fill="#d4c4f0" />
            <rect x="8" y="24" width="34" height="10" rx="1" fill="#9b7fd4" />
          </>
        )}
      </svg>
    </span>
  );
}
