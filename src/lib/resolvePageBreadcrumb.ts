import {
  CLIENT_PRICING_NAV_ID,
  CLIENT_PRICING_SECTION_IDS,
  getSectionPage,
  LAB_FORMS_MANAGEMENT_SECTION_IDS,
  OTHER_SETTINGS_SECTION_IDS,
  TEST_MASTER_NAV_ID,
  TEST_MASTER_SECTION_IDS,
  type ClientPricingSectionId,
  type SectionPageId,
  type TestMasterSectionId,
} from "../data/accountOverview";
import {
  getModuleIdFromPath,
  getModuleSectionPath,
  resolveModuleSectionTitle,
} from "../data/labModules";

export interface BreadcrumbSegment {
  label: string;
  href?: string;
}

export interface PageBreadcrumbResult {
  title: string;
  backHref: string;
  backLabel: string;
  segments: BreadcrumbSegment[];
}

function labSettingsHref(labId: number) {
  return `/lab/${labId}/center`;
}

function centerSectionHref(labId: number, sectionId: string) {
  return `/lab/${labId}/center/${sectionId}`;
}

function resolveCenterSectionBreadcrumb(labId: number, sectionId: SectionPageId): PageBreadcrumbResult {
  const sectionMeta = getSectionPage(sectionId)!;
  const isOtherSettings = OTHER_SETTINGS_SECTION_IDS.has(sectionId);
  const isTestMasterChild = TEST_MASTER_SECTION_IDS.has(sectionId as TestMasterSectionId);
  const isTestMasterRoot = sectionId === TEST_MASTER_NAV_ID;
  const isClientPricingChild = CLIENT_PRICING_SECTION_IDS.has(sectionId as ClientPricingSectionId);
  const isClientPricingRoot = sectionId === CLIENT_PRICING_NAV_ID;

  const segments: BreadcrumbSegment[] = [
    { label: "Lab Settings", href: labSettingsHref(labId) },
  ];

  if (isOtherSettings) {
    segments.push({ label: "Other Settings" });
    segments.push({ label: sectionMeta.title });
    return {
      title: sectionMeta.title,
      backHref: labSettingsHref(labId),
      backLabel: "Back to Lab Settings",
      segments,
    };
  }

  if (isTestMasterChild || isTestMasterRoot) {
    if (isTestMasterRoot) {
      segments.push({ label: "Test Master" });
    } else {
      segments.push({ label: "Test Master", href: centerSectionHref(labId, TEST_MASTER_NAV_ID) });
      segments.push({ label: sectionMeta.title });
    }
    return {
      title: sectionMeta.title,
      backHref: isTestMasterRoot
        ? labSettingsHref(labId)
        : centerSectionHref(labId, TEST_MASTER_NAV_ID),
      backLabel: isTestMasterRoot ? "Back to Lab Settings" : "Back to Test Master",
      segments,
    };
  }

  if (isClientPricingChild || isClientPricingRoot) {
    if (isClientPricingRoot) {
      segments.push({ label: "Client & Insurance Pricing" });
    } else {
      segments.push({
        label: "Client & Insurance Pricing",
        href: centerSectionHref(labId, CLIENT_PRICING_NAV_ID),
      });
      segments.push({ label: sectionMeta.title });
    }
    return {
      title: sectionMeta.title,
      backHref: isClientPricingRoot
        ? labSettingsHref(labId)
        : centerSectionHref(labId, CLIENT_PRICING_NAV_ID),
      backLabel: isClientPricingRoot
        ? "Back to Lab Settings"
        : "Back to Client & Insurance Pricing",
      segments,
    };
  }

  if (LAB_FORMS_MANAGEMENT_SECTION_IDS.has(sectionId as "aoe-configuration" | "consent-form-configuration" | "additional-patient-info")) {
    segments.push({ label: "Lab Forms Management" });
    segments.push({ label: sectionMeta.title });
    return {
      title: sectionMeta.title,
      backHref: labSettingsHref(labId),
      backLabel: "Back to Lab Settings",
      segments,
    };
  }

  segments.push({ label: sectionMeta.title });
  return {
    title: sectionMeta.title,
    backHref: labSettingsHref(labId),
    backLabel: "Back to Lab Settings",
    segments,
  };
}

function resolveUserManagementBreadcrumb(
  labId: number,
  subPath: string,
): PageBreadcrumbResult | null {
  const usersHref = centerSectionHref(labId, "users");
  const baseSegments: BreadcrumbSegment[] = [
    { label: "Lab Settings", href: labSettingsHref(labId) },
    { label: "User Management Settings", href: usersHref },
  ];

  if (subPath === "users") {
    return {
      title: "User Management Settings",
      backHref: labSettingsHref(labId),
      backLabel: "Back to Lab Settings",
      segments: [...baseSegments, { label: "User Management Settings" }],
    };
  }

  if (subPath === "users/new") {
    return {
      title: "Select User Role",
      backHref: usersHref,
      backLabel: "Back to User Management Settings",
      segments: [...baseSegments, { label: "Add New User" }],
    };
  }

  const newRoleMatch = subPath.match(/^users\/new\/([^/]+)$/);
  if (newRoleMatch) {
    return {
      title: "Add New User",
      backHref: `/lab/${labId}/center/users/new`,
      backLabel: "Back to role selection",
      segments: [...baseSegments, { label: "Add New User" }],
    };
  }

  const editMatch = subPath.match(/^users\/([^/]+)$/);
  if (editMatch && editMatch[1] !== "new") {
    return {
      title: "Edit User",
      backHref: usersHref,
      backLabel: "Back to User Management Settings",
      segments: [...baseSegments, { label: "Edit User" }],
    };
  }

  return null;
}

const STANDALONE_LAB_PAGE_TITLES: Record<string, string> = {
  profile: "Update profile",
  feedback: "Feedback",
  "open-tasks": "Open tasks",
  notifications: "Notifications",
  actions: "Pending Actions",
};

function resolveStandaloneLabPageBreadcrumb(labId: number, pageId: string): PageBreadcrumbResult | null {
  const title = STANDALONE_LAB_PAGE_TITLES[pageId];
  if (!title) return null;

  return {
    title,
    backHref: labSettingsHref(labId),
    backLabel: "Back",
    segments: [{ label: title }],
  };
}

export function resolvePageBreadcrumb(
  pathname: string,
  _lab?: { name: string; address: string } | null,
): PageBreadcrumbResult | null {
  const match = pathname.match(/^\/lab\/(\d+)(\/.*)?$/);
  if (!match) return null;

  const labId = Number(match[1]);
  const path = (match[2] ?? "").replace(/^\//, "");

  if (path === "account-overview") {
    return {
      title: "Overview",
      backHref: labSettingsHref(labId),
      backLabel: "Back to Lab Settings",
      segments: [
        { label: "Lab Settings", href: labSettingsHref(labId) },
        { label: "Overview" },
      ],
    };
  }

  if (path === "center" || path === "center/onboarding") {
    return null;
  }

  if (path.startsWith("center/")) {
    const centerPath = path.slice("center/".length);
    const userBreadcrumb = resolveUserManagementBreadcrumb(labId, centerPath);
    if (userBreadcrumb) return userBreadcrumb;

    const sectionId = centerPath.split("/")[0];

    // Parameter Library hosts several sub-pages (Assign, Cleanup, QC mapping).
    if (sectionId === "parameter-setup") {
      const sub = centerPath.slice("parameter-setup".length).replace(/^\//, "");
      const libraryHref = `/lab/${labId}/center/parameter-setup`;
      const subPages: { prefix: string; title: string }[] = [
        { prefix: "assign-parameters", title: "Assign Parameters" },
        { prefix: "cleanup/unused", title: "Unused Parameters" },
        { prefix: "cleanup/dedupe", title: "De-duplication" },
        { prefix: "cleanup/missing-fields", title: "Missing Fields" },
        { prefix: "cleanup", title: "Parameter Cleanup" },
        { prefix: "qc-mapping", title: "QC & Interfacing Mapping" },
      ];
      const match = subPages.find((p) => sub.startsWith(p.prefix));
      if (match) {
        return {
          title: match.title,
          backHref: libraryHref,
          backLabel: "Back to Parameter Library",
          segments: [
            { label: "Lab Settings", href: labSettingsHref(labId) },
            { label: "Test Master", href: centerSectionHref(labId, TEST_MASTER_NAV_ID) },
            { label: "Parameter Library", href: libraryHref },
            { label: match.title },
          ],
        };
      }
      return resolveCenterSectionBreadcrumb(labId, "parameter-setup");
    }

    if (sectionId === "aoe-configuration") {
      const listHref = `/lab/${labId}/center/aoe-configuration`;
      const sub = centerPath.slice("aoe-configuration".length).replace(/^\//, "");
      if (sub) {
        return {
          title: "Edit AOE Form Configuration",
          backHref: listHref,
          backLabel: "Back to AOE Configuration",
          segments: [
            { label: "Lab Settings", href: labSettingsHref(labId) },
            { label: "Lab Forms Management" },
            { label: "AOE Configuration", href: listHref },
            { label: "Edit AOE Form Configuration" },
          ],
        };
      }
      return resolveCenterSectionBreadcrumb(labId, "aoe-configuration");
    }

    const sectionMeta = getSectionPage(sectionId);
    if (sectionMeta && sectionId !== "overview") {
      return resolveCenterSectionBreadcrumb(labId, sectionId as SectionPageId);
    }
    return null;
  }

  const standaloneBreadcrumb = resolveStandaloneLabPageBreadcrumb(labId, path.split("/")[0]);
  if (standaloneBreadcrumb) return standaloneBreadcrumb;

  const moduleId = getModuleIdFromPath(pathname, labId);
  if (moduleId) {
    return null;
  }

  return null;
}

export function resolvePageTitle(
  pathname: string,
  lab?: { name: string; address: string } | null,
): string {
  const breadcrumb = resolvePageBreadcrumb(pathname, lab);
  if (breadcrumb) return breadcrumb.title;

  const match = pathname.match(/^\/lab\/(\d+)(\/.*)?$/);
  if (!match) return "";

  const labId = Number(match[1]);
  const path = match[2] ?? "";

  if (path === "/center") return "Lab Settings";
  if (path === "/center/onboarding") return "Onboarding";

  const moduleId = getModuleIdFromPath(pathname, labId);
  if (moduleId) {
    const section = getModuleSectionPath(pathname, labId, moduleId);
    return resolveModuleSectionTitle(moduleId, section);
  }

  return "";
}
