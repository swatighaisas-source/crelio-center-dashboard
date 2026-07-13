export type NavIconId =
  | "home"
  | "gear"
  | "grid"
  | "stethoscope"
  | "layers"
  | "pie"
  | "translation"
  | "search"
  | "bell"
  | "play"
  | "phone"
  | "globe"
  | "plus";

export type AdminSubNavIconId =
  | "home"
  | "admin"
  | "registration"
  | "accession"
  | "operation"
  | "finance"
  | "reviewer"
  | "inventory"
  | "crm"
  | "analytics";

export interface AdminSubNavItem {
  id: string;
  label: string;
  icon: AdminSubNavIconId;
}

const ADMIN_SUB_NAV_REST: AdminSubNavItem[] = [
  { id: "registration", label: "Registration", icon: "registration" },
  { id: "accession", label: "Accession", icon: "accession" },
  { id: "operation", label: "Operation", icon: "operation" },
  { id: "finance", label: "Finance", icon: "finance" },
  { id: "reviewer", label: "Reviewer", icon: "reviewer" },
  { id: "inventory", label: "Inventory", icon: "inventory" },
  { id: "crm", label: "CRM", icon: "crm" },
  { id: "analytics", label: "Analytics", icon: "analytics" },
];

/** Flyout when Admin is selected in account overview sidebar */
export const ADMIN_SUB_NAV: AdminSubNavItem[] = [...ADMIN_SUB_NAV_REST];

/** Flyout when Home is selected on the operational home screen */
export const HOME_SUB_NAV: AdminSubNavItem[] = [
  { id: "admin", label: "Admin", icon: "admin" },
  ...ADMIN_SUB_NAV_REST,
];

export const HOME_SIDEBAR_NAV: NavItem[] = [
  { id: "customise", label: "Customise Home", icon: "plus" },
];

export interface NavChildItem {
  id: string;
  label: string;
  external?: boolean;
}

export interface NavItem {
  id: string;
  label: string;
  icon: NavIconId;
  chevron?: "right" | "down";
  external?: boolean;
  active?: boolean;
  indent?: boolean;
  children?: NavChildItem[];
}

export const LAB_SETTINGS_NAV_ID = "lab-settings";
export const TEST_MASTER_NAV_ID = "profile";
export const CLIENT_PRICING_NAV_ID = "list-group";

export type SectionPageId =
  | "overview"
  | "center-details"
  | "resources"
  | "subscription"
  | "communication"
  | "provider"
  | "account-mgmt"
  | "profile"
  | "service-list"
  | "order-settings"
  | "rollout-config"
  | "invoice-settings"
  | "report-settings"
  | "reflex-service-config"
  | "dictionary-mapping"
  | "parameter-setup"
  | "list-group"
  | "list-management"
  | "add-test-to-list-bulk"
  | "department"
  | "outsourcing"
  | "users"
  | "validator"
  | "lab-forms"
  | "custom-login"
  | "patient-feedback"
  | "instant-comments"
  | "medical-db"
  | "marketing"
  | "storage"
  | "integration"
  | "translation"
  | "activity";

export type CenterSectionId = Extract<
  SectionPageId,
  | "overview"
  | "center-details"
  | "resources"
  | "subscription"
  | "communication"
  | "provider"
  | "account-mgmt"
  | "department"
  | "outsourcing"
  | "users"
  | "validator"
  | "profile"
  | "list-group"
>;

export type OtherSettingsSectionId = Extract<
  SectionPageId,
  | "custom-login"
  | "patient-feedback"
  | "instant-comments"
  | "medical-db"
  | "marketing"
  | "storage"
  | "translation"
  | "lab-forms"
>;

export type TestMasterSectionId = Extract<
  SectionPageId,
  | "service-list"
  | "order-settings"
  | "rollout-config"
  | "invoice-settings"
  | "report-settings"
  | "reflex-service-config"
  | "dictionary-mapping"
  | "parameter-setup"
>;

export const TEST_MASTER_SECTION_IDS = new Set<TestMasterSectionId>([
  "service-list",
  "order-settings",
  "rollout-config",
  "invoice-settings",
  "report-settings",
  "reflex-service-config",
  "dictionary-mapping",
  "parameter-setup",
]);

export type ClientPricingSectionId = Extract<
  SectionPageId,
  "list-management" | "add-test-to-list-bulk"
>;

export const CLIENT_PRICING_SECTION_IDS = new Set<ClientPricingSectionId>([
  "list-management",
  "add-test-to-list-bulk",
]);

export type MainNavSectionId =
  | TestMasterSectionId
  | ClientPricingSectionId
  | "integration"
  | "activity";

export const MAIN_NAV_SECTION_IDS = new Set<MainNavSectionId>([
  ...TEST_MASTER_SECTION_IDS,
  ...CLIENT_PRICING_SECTION_IDS,
  "integration",
  "activity",
]);

export interface SectionPageMeta {
  id: SectionPageId;
  title: string;
  description: string;
  badge?: string;
  hub: "center" | "other" | "nav";
  external?: boolean;
}

const SECTION_PAGES: SectionPageMeta[] = [
  {
    id: "overview",
    title: "Overview",
    description: "Classic account overview — finance, collections, logins, and ratings.",
    hub: "center",
  },
  {
    id: "center-details",
    title: "Center Details",
    description: "Lab profile, contacts, billing, and operational settings.",
    hub: "center",
  },
  {
    id: "resources",
    title: "Resources",
    description: "Upload report and bill headers and footers for your centre.",
    hub: "center",
  },
  {
    id: "provider",
    title: "Providers",
    description: "Manage referring doctors, hospitals, and provider networks.",
    hub: "center",
    external: true,
  },
  {
    id: "account-mgmt",
    title: "Accounts",
    description: "Corporate accounts, pricing agreements, and account ledgers.",
    hub: "center",
    external: true,
  },
  {
    id: "profile",
    title: "Test Master",
    description: "Tests, profiles, report layouts, and reference ranges.",
    hub: "center",
  },
  {
    id: "service-list",
    title: "Service List",
    description: "Manage your lab service catalogue and test offerings.",
    hub: "nav",
  },
  {
    id: "order-settings",
    title: "Order Settings",
    description: "Configure order workflows, defaults, and related options.",
    hub: "nav",
  },
  {
    id: "rollout-config",
    title: "Rollout Configuration",
    description: "Configure task manager rollout, exception rules, and client visibility.",
    hub: "nav",
  },
  {
    id: "invoice-settings",
    title: "Invoice Settings",
    description: "Set up invoice templates, fields, and billing preferences.",
    hub: "nav",
  },
  {
    id: "report-settings",
    title: "Report Settings",
    description: "Customize report formats, headers, and delivery options.",
    hub: "nav",
  },
  {
    id: "reflex-service-config",
    title: "Reflex Service Configuration",
    description: "Define reflex rules and linked follow-up services.",
    hub: "nav",
  },
  {
    id: "dictionary-mapping",
    title: "Dictionary Mapping",
    description: "Map internal codes to standard dictionaries and terminologies.",
    hub: "nav",
  },
  {
    id: "parameter-setup",
    title: "Parameter Library",
    description: "Manage the parameter library and assign parameters to tests.",
    hub: "nav",
  },
  {
    id: "list-group",
    title: "Client & Insurance Pricing",
    description: "Client groups, insurance plans, and negotiated pricing.",
    hub: "center",
  },
  {
    id: "list-management",
    title: "List Management",
    description: "Create and manage client and insurance price lists.",
    hub: "nav",
  },
  {
    id: "add-test-to-list-bulk",
    title: "Add Test to List(Bulk)",
    description: "Add tests to lists in bulk for clients and insurance plans.",
    hub: "nav",
  },
  {
    id: "department",
    title: "Departments",
    description: "Lab departments, workflows, and operational units.",
    hub: "center",
  },
  {
    id: "outsourcing",
    title: "Outsourcing Details",
    description: "Outsource partners, routing rules, and send-out configuration.",
    hub: "center",
  },
  {
    id: "users",
    title: "User Management Settings",
    description: "Staff users, roles, and access permissions for your centre.",
    hub: "center",
  },
  {
    id: "validator",
    title: "Validators",
    description: "Set users who can validate and their passkey.",
    hub: "center",
  },
  {
    id: "subscription",
    title: "Subscription",
    description: "Plan, billing cycle, and subscription management.",
    hub: "center",
  },
  {
    id: "communication",
    title: "Communication",
    description: "Notifications, messaging, and patient communication preferences.",
    hub: "center",
  },
  {
    id: "custom-login",
    title: "Custom Login",
    description: "Branded login page, URLs, and access settings for your centre.",
    hub: "other",
  },
  {
    id: "patient-feedback",
    title: "Patient Feedback",
    description: "Patient ratings, reviews, and satisfaction insights.",
    hub: "other",
  },
  {
    id: "instant-comments",
    title: "Instant Comments",
    description: "Quick comments and notes shared across your centre workflows.",
    hub: "other",
  },
  {
    id: "medical-db",
    title: "Medical Database Mapping",
    description: "Map tests and codes to standard medical databases.",
    hub: "other",
  },
  {
    id: "marketing",
    title: "Marketing",
    description: "Campaigns, promotions, and patient outreach tools.",
    hub: "other",
    external: true,
  },
  {
    id: "storage",
    title: "Storage",
    description: "Document storage, retention, and archive settings.",
    hub: "other",
  },
  {
    id: "lab-forms",
    title: "Lab Forms",
    description: "Custom forms, TRFs, and patient intake templates.",
    hub: "other",
  },
  {
    id: "integration",
    title: "Integration Dashboard",
    description: "Connected systems, APIs, and integration health.",
    hub: "nav",
  },
  {
    id: "translation",
    title: "Translation",
    description: "Language packs and localized labels for your centre.",
    hub: "other",
  },
  {
    id: "activity",
    title: "Activity Log",
    description: "Audit trail of changes and user activity across the lab.",
    hub: "nav",
  },
];

export const CENTER_SECTIONS: SectionPageMeta[] = SECTION_PAGES.filter((s) => s.hub === "center");

export type LabSettingsCardCategory = "lab-masters" | "users" | "lab-information";

export interface LabSettingsCardGroup {
  id: LabSettingsCardCategory;
  label: string;
  sectionIds: CenterSectionId[];
}

/** Lab Settings hub card groupings */
export const LAB_SETTINGS_CARD_GROUPS: LabSettingsCardGroup[] = [
  {
    id: "lab-masters",
    label: "Lab masters",
    sectionIds: ["profile", "list-group", "department", "outsourcing"],
  },
  {
    id: "users",
    label: "Users",
    sectionIds: ["account-mgmt", "provider", "users", "validator"],
  },
  {
    id: "lab-information",
    label: "Lab Information",
    sectionIds: ["overview", "center-details", "resources", "subscription", "communication"],
  },
];

export function getLabSettingsGroupedSections(): {
  group: LabSettingsCardGroup;
  sections: SectionPageMeta[];
}[] {
  const byId = new Map(CENTER_SECTIONS.map((s) => [s.id, s]));
  return LAB_SETTINGS_CARD_GROUPS.map((group) => ({
    group,
    sections: group.sectionIds
      .map((id) => byId.get(id))
      .filter((s): s is SectionPageMeta => s !== undefined),
  })).filter(({ sections }) => sections.length > 0);
}

export const OTHER_SETTINGS_SECTIONS: SectionPageMeta[] = SECTION_PAGES.filter(
  (s) => s.hub === "other",
);

export const OTHER_SETTINGS_SECTION_IDS = new Set(
  OTHER_SETTINGS_SECTIONS.map((s) => s.id),
);

export function getSectionPage(id: string): SectionPageMeta | undefined {
  return SECTION_PAGES.find((s) => s.id === id);
}

const OTHER_SETTINGS_CHILDREN: NavChildItem[] = OTHER_SETTINGS_SECTIONS.map((s) => ({
  id: s.id,
  label: s.title,
  external: s.external,
}));

const TEST_MASTER_CHILDREN: NavChildItem[] = [
  { id: "service-list", label: "Service List" },
  { id: "order-settings", label: "Order Settings" },
  { id: "rollout-config", label: "Rollout Configuration" },
  { id: "invoice-settings", label: "Invoice Settings" },
  { id: "report-settings", label: "Report Settings" },
  { id: "reflex-service-config", label: "Reflex Service Configuration" },
  { id: "dictionary-mapping", label: "Dictionary Mapping" },
  { id: "parameter-setup", label: "Parameter Library" },
];

const CLIENT_PRICING_CHILDREN: NavChildItem[] = [
  { id: "list-management", label: "List Management" },
  { id: "add-test-to-list-bulk", label: "Add Test to List(Bulk)" },
];

/** Nav group id → hub card / root section id */
export const NAV_GROUP_ROOT_SECTION_IDS: Record<string, SectionPageId> = {
  [TEST_MASTER_NAV_ID]: "profile",
  [CLIENT_PRICING_NAV_ID]: "list-group",
};

export const ONBOARDING_NAV_ID = "onboarding";

export const ACCOUNT_NAV: NavItem[] = [
  { id: "admin", label: "Admin", icon: "gear", chevron: "right" },
  { id: ONBOARDING_NAV_ID, label: "Onboarding", icon: "grid" },
  { id: "center", label: "Lab Settings", icon: "grid" },
  {
    id: TEST_MASTER_NAV_ID,
    label: "Test Master",
    icon: "grid",
    children: TEST_MASTER_CHILDREN,
  },
  {
    id: CLIENT_PRICING_NAV_ID,
    label: "Client & Insurance Pricing",
    icon: "grid",
    children: CLIENT_PRICING_CHILDREN,
  },
  { id: "integration", label: "Integration Dashboard", icon: "pie" },
  { id: "activity", label: "Activity Log", icon: "grid" },
  {
    id: LAB_SETTINGS_NAV_ID,
    label: "Other Settings",
    icon: "grid",
    children: OTHER_SETTINGS_CHILDREN,
  },
  { id: "search", label: "Advanced Search", icon: "search" },
];

/** Flat list for home shortcuts (excludes Admin, Center, and group headers). */
export function getAccountNavShortcutItems(): NavItem[] {
  const items: NavItem[] = [];

  for (const item of ACCOUNT_NAV) {
    if (item.id === "admin" || item.id === "center" || item.id === ONBOARDING_NAV_ID) continue;
    if (item.children) {
      if (item.id === TEST_MASTER_NAV_ID || item.id === CLIENT_PRICING_NAV_ID) {
        items.push({ id: item.id, label: item.label, icon: item.icon });
        continue;
      }
      for (const child of item.children) {
        items.push({
          id: child.id,
          label: child.label,
          icon: item.icon,
          external: child.external,
        });
      }
      continue;
    }
    items.push(item);
  }

  for (const section of CENTER_SECTIONS) {
    if (section.id === "overview") continue;
    if (items.some((i) => i.id === section.id)) continue;
    items.push({
      id: section.id,
      label: section.title,
      icon: "grid",
      external: section.external,
    });
  }

  return items;
}

export interface TrainingCourse {
  id: string;
  title: string;
  description: string;
  thumbClass: string;
}

export const TRAINING_COURSES: TrainingCourse[] = [
  {
    id: "overall",
    title: "Overall Courses",
    description: "Get started with all essential training modules for your lab.",
    thumbClass: "ao-training-thumb--overall",
  },
  {
    id: "basics",
    title: "CrelioHealth Basics",
    description: "Learn the fundamentals of registration, billing, and reports.",
    thumbClass: "ao-training-thumb--basics",
  },
  {
    id: "billing",
    title: "Billing & Payments",
    description: "Understand invoicing, payments, and finance workflows.",
    thumbClass: "ao-training-thumb--billing",
  },
  {
    id: "advanced",
    title: "Advanced Operations",
    description: "Deep dive into inventory, outsourcing, and integrations.",
    thumbClass: "ao-training-thumb--advanced",
  },
];
