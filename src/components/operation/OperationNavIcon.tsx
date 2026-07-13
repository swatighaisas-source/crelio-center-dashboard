import type { OperationNavIconId } from "../../data/operationNav";

const stroke = { stroke: "currentColor", strokeWidth: 1.3, fill: "none" };

export function OperationNavIcon({ id, active }: { id: OperationNavIconId; active?: boolean }) {
  const color = active ? "#ffffff" : "currentColor";

  return (
    <span className="op-nav-icon" aria-hidden style={{ color }}>
      <svg viewBox="0 0 18 18" width="16" height="16">
        {id === "operation" && (
          <>
            <circle cx="9" cy="9" r="6.5" {...stroke} />
            <path d="M9 5.5v4l2.5 1.5" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" />
          </>
        )}
        {id === "dashboard" && (
          <>
            <rect x="3" y="3" width="5" height="5" rx="1" {...stroke} />
            <rect x="10" y="3" width="5" height="5" rx="1" {...stroke} />
            <rect x="3" y="10" width="5" height="5" rx="1" {...stroke} />
            <rect x="10" y="10" width="5" height="5" rx="1" {...stroke} />
          </>
        )}
        {id === "waiting-list" && (
          <>
            <rect x="4" y="3" width="10" height="12" rx="1.5" {...stroke} />
            <path d="M7 7h6M7 10h6M7 13h4" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" />
          </>
        )}
        {id === "callout" && (
          <>
            <path d="M9 2.5l1.8 3.6 4 .6-2.9 2.8.7 4-3.6-1.9-3.6 1.9.7-4L3.2 6.7l4-.6L9 2.5z" {...stroke} strokeLinejoin="round" />
          </>
        )}
        {id === "device" && (
          <>
            <rect x="4" y="5" width="10" height="8" rx="1.5" {...stroke} />
            <path d="M7 13v1.5M11 13v1.5" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" />
          </>
        )}
        {id === "pcr" && (
          <>
            <rect x="6" y="2" width="6" height="14" rx="1" {...stroke} />
            <path d="M8 6h2M8 9h2M8 12h2" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" />
          </>
        )}
        {id === "archive" && (
          <>
            <rect x="3" y="4" width="12" height="10" rx="1.5" {...stroke} />
            <path d="M3 7h12" stroke="currentColor" strokeWidth="1.3" />
          </>
        )}
        {id === "status" && (
          <>
            <circle cx="9" cy="9" r="6.5" {...stroke} />
            <path d="M6 9l2 2 4-4" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round" />
          </>
        )}
        {id === "print" && (
          <>
            <rect x="5" y="2" width="8" height="4" rx="1" {...stroke} />
            <rect x="3" y="6" width="12" height="8" rx="1.5" {...stroke} />
            <rect x="6" y="10" width="6" height="4" {...stroke} />
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
