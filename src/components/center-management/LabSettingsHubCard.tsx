import { Link } from "react-router-dom";
import type { SectionPageMeta, SectionPageId } from "../../data/accountOverview";

interface Props {
  section: SectionPageMeta;
  href: string;
}

export function LabSettingsHubCard({ section, href }: Props) {
  return (
    <Link to={href} className="cm-hub__card">
      <div className="cm-hub__card-top">
        <span className="cm-hub__card-icon" aria-hidden>
          <svg viewBox="0 0 24 24" fill="none" width="22" height="22">
            <rect x="4" y="4" width="16" height="16" rx="2" stroke="currentColor" strokeWidth="1.4" />
            <path d="M8 9h8M8 13h5" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" />
          </svg>
        </span>
        {section.badge && <span className="cm-hub__card-badge">{section.badge}</span>}
      </div>
      <h2 className="cm-hub__card-title">{section.title}</h2>
      <p className="cm-hub__card-desc">{section.description}</p>
      <span className="cm-hub__card-arrow" aria-hidden>
        <svg viewBox="0 0 16 16" fill="none" width="16" height="16">
          <path
            d="M5 2l6 6-6 6"
            stroke="currentColor"
            strokeWidth="1.4"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </span>
    </Link>
  );
}

export function centerSectionHref(labId: number, sectionId: SectionPageId): string {
  if (sectionId === "overview") {
    return `/lab/${labId}/account-overview`;
  }
  return `/lab/${labId}/center/${sectionId}`;
}
