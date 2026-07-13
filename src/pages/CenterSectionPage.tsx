import { Navigate, useParams } from "react-router-dom";
import { AccountOverviewSidebar } from "../components/account-overview/AccountOverviewSidebar";
import { CenterDetailsSection } from "../components/center-management/CenterDetailsSection";
import { UserManagementSection } from "../components/center-management/UserManagementSection";
import { ResourcesUploadSection } from "../components/center-management/ResourcesUploadSection";
import { LabWorkflowConfigPanel } from "../components/lab-settings/LabWorkflowConfigPanel";
import { CenterRolloutConfigSection } from "./CenterRolloutConfigPage";
import { SubpageBreadcrumb } from "../components/lab-shell/SubpageBreadcrumb";
import {
  CLIENT_PRICING_NAV_ID,
  CLIENT_PRICING_SECTION_IDS,
  getSectionPage,
  OTHER_SETTINGS_SECTION_IDS,
  TEST_MASTER_NAV_ID,
  TEST_MASTER_SECTION_IDS,
  type ClientPricingSectionId,
  type SectionPageId,
  type TestMasterSectionId,
} from "../data/accountOverview";
import { usePageBreadcrumb } from "../hooks/usePageBreadcrumb";
import { useLabs } from "../context/LabsContext";
import "../styles/account-overview.css";
import "../styles/center-management.css";
import "../styles/lab-detail.css";
import "../styles/subpage-breadcrumb.css";
import "../styles/user-management.css";

function isValidSection(id: string | undefined): id is SectionPageId {
  return id !== undefined && id !== "overview" && Boolean(getSectionPage(id));
}

export function CenterSectionPage() {
  const { id, section } = useParams<{ id: string; section: string }>();
  const labId = Number(id);
  const { getLabDetail } = useLabs();
  const lab = getLabDetail(labId);
  const breadcrumb = usePageBreadcrumb();

  if (!lab || Number.isNaN(labId)) {
    return <Navigate to="/" replace />;
  }

  if (section === "overview") {
    return <Navigate to={`/lab/${labId}/account-overview`} replace />;
  }

  if (!isValidSection(section)) {
    return <Navigate to={`/lab/${labId}/center`} replace />;
  }

  const sectionMeta = getSectionPage(section)!;
  const isOtherSettings = OTHER_SETTINGS_SECTION_IDS.has(section);
  const isTestMasterChild = TEST_MASTER_SECTION_IDS.has(section as TestMasterSectionId);
  const isTestMasterRoot = section === TEST_MASTER_NAV_ID;
  const isClientPricingChild = CLIENT_PRICING_SECTION_IDS.has(section as ClientPricingSectionId);
  const isClientPricingRoot = section === CLIENT_PRICING_NAV_ID;

  return (
    <div className="ao-layout">
      <AccountOverviewSidebar lab={lab} />

      <div className="ao-main-wrap">
        <main
          key={section}
          className={`ao-main ao-main--center-section${
            section === "center-details" ? " ao-main--center-details" : ""
          }${section === "users" ? " ao-main--users-settings" : ""}`}
        >
          {breadcrumb && (
            <SubpageBreadcrumb
              backHref={breadcrumb.backHref}
              backLabel={breadcrumb.backLabel}
              segments={breadcrumb.segments}
            />
          )}

          {section === "resources" ? (
            <div className="cm-section">
              <ResourcesUploadSection />
            </div>
          ) : section === "order-settings" ? (
            <div className="cm-section">
              <LabWorkflowConfigPanel lab={lab} />
            </div>
          ) : section === "rollout-config" ? (
            <CenterRolloutConfigSection />
          ) : section === "center-details" ? (
            <CenterDetailsSection lab={lab} labId={labId} />
          ) : section === "users" ? (
            <div className="cm-section cm-section--users">
              <UserManagementSection labId={labId} />
            </div>
          ) : (
            <section className="cm-section cm-section--placeholder">
              <p className="cm-section__text">{sectionMeta.description}</p>
              <p className="cm-section__text cm-section__text--muted">
                {isOtherSettings
                  ? `This section is available under Other Settings. Content for ${sectionMeta.title} will appear here.`
                  : isTestMasterChild || isTestMasterRoot
                    ? `This section is available under Test Master. Content for ${sectionMeta.title} will appear here.`
                    : isClientPricingChild || isClientPricingRoot
                      ? `This section is available under Client & Insurance Pricing. Content for ${sectionMeta.title} will appear here.`
                      : `This section is available in Lab Settings. Content for ${sectionMeta.title} will appear here.`}
              </p>
            </section>
          )}
        </main>
      </div>
    </div>
  );
}
