import { Navigate, useParams } from "react-router-dom";
import { AccountOverviewSidebar } from "../components/account-overview/AccountOverviewSidebar";
import { CenterManagementFeedbackBlock } from "../components/center-management/CenterManagementFeedbackBlock";
import {
  LabSettingsHubCard,
  centerSectionHref,
} from "../components/center-management/LabSettingsHubCard";
import { getLabSettingsGroupedSections } from "../data/accountOverview";
import { useLabs } from "../context/LabsContext";
import "../styles/account-overview.css";
import "../styles/center-management.css";
import "../styles/lab-home.css";

export function CenterManagementHubPage() {
  const { id } = useParams<{ id: string }>();
  const labId = Number(id);
  const { getLabDetail } = useLabs();
  const lab = getLabDetail(labId);

  if (!lab || Number.isNaN(labId)) {
    return <Navigate to="/" replace />;
  }

  const groupedSections = getLabSettingsGroupedSections();

  return (
    <div className="ao-layout">
      <AccountOverviewSidebar lab={lab} />

      <div className="ao-main-wrap">
        <main className="ao-main ao-main--center-hub">
          <div className="cm-hub__body">
            <p className="cm-hub__lab-meta" aria-label="Centre information">
              <span className="cm-hub__lab-meta-label">Centre</span>
              <span className="cm-hub__lab-meta-sep" aria-hidden>
                ·
              </span>
              <span className="cm-hub__lab-meta-strong">#{lab.id}</span>
              <span className="cm-hub__lab-meta-sep" aria-hidden>
                ·
              </span>
              <span className="cm-hub__lab-meta-strong">{lab.name}</span>
              <span className="cm-hub__lab-meta-sep" aria-hidden>
                ·
              </span>
              <a href={`mailto:${lab.email}`} className="cm-hub__lab-meta-link">
                {lab.email}
              </a>
              <span className="cm-hub__lab-meta-sep" aria-hidden>
                ·
              </span>
              <span>{lab.address}</span>
            </p>

            <CenterManagementFeedbackBlock lab={lab} />

            <div className="cm-hub__groups">
              {groupedSections.map(({ group, sections }) => (
                <section key={group.id} className="cm-hub__group" aria-labelledby={`cm-hub-${group.id}`}>
                  <h2 id={`cm-hub-${group.id}`} className="cm-hub__group-label">
                    {group.label}
                  </h2>
                  <div className="cm-hub__grid">
                    {sections.map((section) => (
                      <LabSettingsHubCard
                        key={section.id}
                        section={section}
                        href={centerSectionHref(labId, section.id)}
                      />
                    ))}
                  </div>
                </section>
              ))}
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
