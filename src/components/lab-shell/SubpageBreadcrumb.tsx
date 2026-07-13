import { Link } from "react-router-dom";
import type { ReactNode } from "react";
import type { BreadcrumbSegment } from "../../lib/resolvePageBreadcrumb";

interface Props {
  backHref: string;
  segments: BreadcrumbSegment[];
  backLabel?: string;
  onBack?: () => void;
  actions?: ReactNode;
  className?: string;
}

function BackChevron() {
  return (
    <svg viewBox="0 0 16 16" width="12" height="12" fill="none" aria-hidden>
      <path
        d="M10 3L5 8l5 5"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export function SubpageBreadcrumb({
  backHref,
  segments,
  backLabel = "Back",
  onBack,
  actions,
  className = "",
}: Props) {
  if (segments.length === 0) return null;

  const current = segments[segments.length - 1];
  const parents = segments.slice(0, -1);

  return (
    <header className={`subpage-crumb${className ? ` ${className}` : ""}`}>
      <div className="subpage-crumb__trail">
        {onBack ? (
          <button type="button" className="subpage-crumb__back" aria-label={backLabel} onClick={onBack}>
            <BackChevron />
          </button>
        ) : (
          <Link to={backHref} className="subpage-crumb__back" aria-label={backLabel}>
            <BackChevron />
          </Link>
        )}
        <nav className="subpage-crumb__nav" aria-label="Breadcrumb">
          {parents.map((segment) => (
            <span key={`${segment.label}-${segment.href}`} className="subpage-crumb__segment">
              <Link to={segment.href!} className="subpage-crumb__link">
                {segment.label}
              </Link>
              <span className="subpage-crumb__sep" aria-hidden>
                /
              </span>
            </span>
          ))}
          <span className="subpage-crumb__current" aria-current="page">
            {current.label}
          </span>
        </nav>
      </div>
      {actions ? <div className="subpage-crumb__actions">{actions}</div> : null}
    </header>
  );
}
