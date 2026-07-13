import type { CenterUser } from "./centerUsers";

export interface UserFeaturePermission {
  id: string;
  title: string;
  description: string;
  enabled: boolean;
}

export interface UserFeatureGroup {
  id: string;
  title: string;
  permissions: UserFeaturePermission[];
}

export interface UserFeatureTab {
  id: string;
  label: string;
  count: number;
  moduleAccess: boolean;
  enableAll: boolean;
  groups: UserFeatureGroup[];
}

export interface CenterUserDetail {
  user: CenterUser;
  usernamePrefix: string;
  usernameSuffix: string;
  email: string;
  contactCountryCode: string;
  contactNumber: string;
  dobDay: string;
  dobMonth: string;
  dobYear: string;
  inactivityLogoutMinutes: string;
  defaultLanguage: string;
  allowedDiscount: string;
  allowedOrderUpdateDays: string;
  employeeNo: string;
  userIntegrationCode: string;
  twoFactorAuth: boolean;
  featureTabs: UserFeatureTab[];
  allDepartments: boolean;
  defaultDepartment: string;
  departments: { id: string; label: string; checked: boolean }[];
}

export const USER_ROLE_OPTIONS = [
  "Front Desk / Registration",
  "Admin",
  "Lab Technician",
  "Phlebotomist",
];

export const LOGIN_MODULE_OPTIONS = ["Admin", "Registration", "Operation", "Finance"];

export const LANGUAGE_OPTIONS = ["English (United States)", "English (India)", "Hindi"];

export const DEPARTMENT_OPTIONS = ["All Departments", "Pathology", "Radiology", "Biochemistry"];

const REGISTRATION_FEATURE_GROUPS: UserFeatureGroup[] = [
  {
    id: "general",
    title: "General Settings",
    permissions: [
      { id: "register-patient", title: "Register Patient", description: "Allow user to register new patients", enabled: true },
      { id: "update-patient", title: "Update Patient Info", description: "Allow user to update patient information", enabled: true },
      { id: "appointments", title: "Appointments", description: "Allow user to manage appointments", enabled: true },
      { id: "archives", title: "Archives", description: "Allow user to access archived records", enabled: true },
      { id: "expense-mgmt", title: "Expense Management", description: "Allow user to manage expenses", enabled: false },
      { id: "merge-patient", title: "Merge Patient", description: "Allow user to merge patient records", enabled: false },
      { id: "demerge-patient", title: "Demerge Patient", description: "Allow user to demerge patient records", enabled: false },
      { id: "reg-settings", title: "Registration Settings", description: "Allow user to change registration settings", enabled: false },
      { id: "settlement-credit", title: "Settlement Credit Orders", description: "Allow settlement of credit orders", enabled: false },
      { id: "missing-details", title: "Missing Details", description: "Allow user to manage missing patient details", enabled: false },
    ],
  },
  {
    id: "home-collection",
    title: "Home Collection",
    permissions: [
      { id: "home-collections", title: "Home Collections", description: "Allow user to manage home collections", enabled: false },
      { id: "assign-phlebotomist", title: "Assign Phlebotomist", description: "Allow user to assign phlebotomists", enabled: false },
      { id: "hc-settings", title: "Home Collection Settings", description: "Allow user to configure home collection settings", enabled: false },
      { id: "cancel-hc", title: "Cancel Home Collection", description: "Allow user to cancel home collections", enabled: false },
    ],
  },
  {
    id: "ordering",
    title: "Ordering",
    permissions: [
      { id: "edit-concession", title: "Edit Service Concession", description: "Allow user to edit service concessions", enabled: true },
      { id: "edit-price", title: "Edit Service Price", description: "Allow user to edit service prices", enabled: true },
      { id: "hide-prices", title: "Hide Prices", description: "Allow user to hide prices on orders", enabled: false },
    ],
  },
  {
    id: "order-settlements",
    title: "Order Settlements",
    permissions: [
      { id: "order-history", title: "Order History", description: "Allow user to view order history", enabled: true },
      { id: "settle-order", title: "Settle Order", description: "Allow user to settle orders", enabled: true },
      { id: "back-date", title: "Back Date Settlements", description: "Allow back-dated order settlements", enabled: true },
      { id: "add-service", title: "Add Service To Order", description: "Allow user to add services to orders", enabled: true },
      { id: "update-icd", title: "Update ICD Code", description: "Allow user to update ICD codes", enabled: true },
    ],
  },
  {
    id: "collection-report",
    title: "Collection Report",
    permissions: [
      { id: "view-collection", title: "View Collection Report", description: "Allow user to view collection reports", enabled: true },
      { id: "all-user-collection", title: "All User Collection Report", description: "Allow viewing all users' collection reports", enabled: true },
    ],
  },
  {
    id: "operation-status",
    title: "Operation Status",
    permissions: [
      { id: "operation-status", title: "Operation Status", description: "Allow user to view operation status", enabled: true },
      { id: "finance-details", title: "Finance Details", description: "Allow user to view finance details", enabled: true },
    ],
  },
  {
    id: "lab-form",
    title: "Lab Form Responses",
    permissions: [
      { id: "consent-history", title: "Consent History", description: "Allow user to view consent history", enabled: false },
      { id: "edit-aoe", title: "Edit/Update AOEs", description: "Allow user to edit or update AOEs", enabled: true },
      { id: "aoe-history", title: "AOE History", description: "Allow user to view AOE history", enabled: false },
      { id: "patient-info-history", title: "Additional Patient Info History", description: "Allow user to view additional patient info history", enabled: false },
    ],
  },
];

const FEATURE_TABS: Omit<UserFeatureTab, "groups">[] = [
  { id: "registration", label: "Registration", count: 21, moduleAccess: true, enableAll: false },
  { id: "accession", label: "Accession", count: 2, moduleAccess: false, enableAll: false },
  { id: "operation", label: "Operation", count: 13, moduleAccess: false, enableAll: false },
  { id: "finance", label: "Finance", count: 20, moduleAccess: false, enableAll: false },
  { id: "admin", label: "Admin", count: 21, moduleAccess: false, enableAll: false },
  { id: "phlebotomist", label: "Phlebotomist", count: 1, moduleAccess: false, enableAll: false },
  { id: "inventory", label: "Inventory", count: 22, moduleAccess: false, enableAll: false },
];

function splitUsername(username: string): { prefix: string; suffix: string } {
  const dash = username.indexOf("-");
  if (dash === -1) return { prefix: username, suffix: "" };
  return { prefix: username.slice(0, dash), suffix: username.slice(dash + 1) };
}

function buildFeatureTabs(): UserFeatureTab[] {
  return FEATURE_TABS.map((tab) => ({
    ...tab,
    groups: tab.id === "registration" ? REGISTRATION_FEATURE_GROUPS : [],
  }));
}

const HUDU_ADMIN_DETAIL: Omit<CenterUserDetail, "user"> = {
  usernamePrefix: "hudu",
  usernameSuffix: "admin",
  email: "husain@livehealth.io",
  contactCountryCode: "+91",
  contactNumber: "80874 43919",
  dobDay: "",
  dobMonth: "",
  dobYear: "",
  inactivityLogoutMinutes: "55",
  defaultLanguage: "English (United States)",
  allowedDiscount: "100",
  allowedOrderUpdateDays: "78600",
  employeeNo: "",
  userIntegrationCode: "",
  twoFactorAuth: false,
  featureTabs: buildFeatureTabs(),
  allDepartments: false,
  defaultDepartment: "All Departments",
  departments: [{ id: "pathology", label: "Pathology", checked: true }],
};

const USER_DETAIL_OVERRIDES: Record<string, Partial<Omit<CenterUserDetail, "user" | "featureTabs">>> = {
  "hudu-admin": {},
};

export function buildCenterUserDetail(user: CenterUser): CenterUserDetail {
  const { prefix, suffix } = splitUsername(user.username);
  const overrides = USER_DETAIL_OVERRIDES[user.id] ?? {};

  if (user.id === "hudu-admin") {
    return {
      user,
      ...HUDU_ADMIN_DETAIL,
      email: user.email ?? HUDU_ADMIN_DETAIL.email,
      ...overrides,
    };
  }

  return {
    user,
    usernamePrefix: prefix,
    usernameSuffix: suffix,
    email: user.email ?? "",
    contactCountryCode: "+91",
    contactNumber: "",
    dobDay: "",
    dobMonth: "",
    dobYear: "",
    inactivityLogoutMinutes: "55",
    defaultLanguage: "English (United States)",
    allowedDiscount: "0",
    allowedOrderUpdateDays: "0",
    employeeNo: "",
    userIntegrationCode: "",
    twoFactorAuth: false,
    featureTabs: buildFeatureTabs(),
    allDepartments: true,
    defaultDepartment: "All Departments",
    departments: [{ id: "pathology", label: "Pathology", checked: false }],
    ...overrides,
  };
}
