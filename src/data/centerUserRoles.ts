import type { UserFeatureGroup, UserFeatureTab } from "./centerUserEdit";

export interface UserRoleCard {
  id: string;
  title: string;
  bullets: string[];
}

export const USER_ROLE_CARDS: UserRoleCard[] = [
  {
    id: "front-desk-registration",
    title: "Front Desk / Registration",
    bullets: ["Handle Patient Registration", "Update Patient Registration", "Order Patient"],
  },
  {
    id: "accession-lab-technician",
    title: "Accession Lab Technician",
    bullets: ["Collect & Receive Sample", "Create Sample Batch"],
  },
  {
    id: "operations-lab-technician",
    title: "Operations Lab Technician",
    bullets: ["Service Report Entry", "Validate Reports", "Dispatch / Submit Report"],
  },
  {
    id: "lab-finance-analysis",
    title: "Lab Finance / Analysis",
    bullets: [
      "Provider Management",
      "B2B Account Management",
      "Marketing Management",
      "Expense Management",
      "Analytical & MIS Report",
    ],
  },
  {
    id: "admin",
    title: "Admin",
    bullets: [
      "User Management",
      "Add/Edit Service Report Master",
      "Department Master",
      "Center Management",
      "View Activity Log",
    ],
  },
  {
    id: "inventory-manager",
    title: "Inventory Manager",
    bullets: [
      "Stock Management",
      "Purchase & Supplier Management",
      "Manage Inventory Master",
      "Inventory Analytics",
    ],
  },
  {
    id: "phlebotomist",
    title: "Phlebotomist",
    bullets: ["Access To Phlebo App", "Home Collection Trips", "Collect Samples"],
  },
  {
    id: "custom-profile",
    title: "Custom Profile",
    bullets: ["Create Customer User Profile As Per Your Preferences"],
  },
];

const OPERATION_FEATURE_GROUPS: UserFeatureGroup[] = [
  {
    id: "viewing-access",
    title: "Viewing Access",
    permissions: [
      { id: "op-view-only", title: "Operation View Only", description: "Allow view-only access to operations", enabled: false },
      { id: "hide-due", title: "Hide Due And Sendout Reports", description: "Hide due and sendout reports", enabled: false },
      { id: "qc-mgmt", title: "Quality Control Management", description: "Allow quality control management", enabled: true },
    ],
  },
  {
    id: "operation-actions",
    title: "Operation Actions",
    permissions: [
      { id: "edit-report", title: "Edit Report", description: "Allow user to edit reports", enabled: true },
      { id: "clear-report", title: "Clear Report", description: "Allow user to clear reports", enabled: true },
      { id: "dismiss-report", title: "Dismiss Report", description: "Allow user to dismiss reports", enabled: true },
      { id: "redraw-redo", title: "Redraw/Redo Reports", description: "Allow redraw and redo of reports", enabled: true },
      { id: "submit-all-dept", title: "Submit For All Department", description: "Allow submit for all departments", enabled: true },
      { id: "mark-done", title: "Mark As Done", description: "Allow marking reports as done", enabled: true },
      { id: "edit-validated", title: "Edit Validated Report", description: "Allow editing validated reports", enabled: true },
      { id: "edit-submitted", title: "Edit Submitted Report", description: "Allow editing submitted reports", enabled: true },
      { id: "update-report-info", title: "Update Report Info", description: "Allow updating report information", enabled: true },
      { id: "convert-file", title: "Allow Convert To File Report", description: "Allow converting to file report", enabled: true },
      { id: "smart-report", title: "Generate Smart Report", description: "Allow generating smart reports", enabled: false },
      { id: "fetch-samples", title: "Fetch Samples From Other Centres", description: "Allow fetching samples from other centres", enabled: false },
      { id: "sample-tracking", title: "Sample Tracking", description: "Allow sample tracking", enabled: false },
      { id: "pcr-plating", title: "PCR Plating", description: "Allow PCR plating", enabled: false },
      { id: "critical-approval", title: "Critical Report Approval", description: "Allow critical report approval", enabled: false },
    ],
  },
  {
    id: "inventory-operations",
    title: "Inventory Operations",
    permissions: [
      { id: "inv-mgmt", title: "Inventory Management", description: "Allow inventory management", enabled: true },
      { id: "stock-mgmt", title: "Stock Management", description: "Allow stock management", enabled: true },
      { id: "inv-orders", title: "Inventory Orders", description: "Allow inventory orders", enabled: true },
      { id: "place-orders", title: "Place New Orders", description: "Allow placing new orders", enabled: true },
      { id: "inv-reports", title: "Reports", description: "Allow inventory reports", enabled: true },
      { id: "stock-service", title: "Stock Service Relation", description: "Allow stock service relations", enabled: true },
    ],
  },
];

function countEnabled(groups: UserFeatureGroup[]): number {
  return groups.reduce((n, g) => n + g.permissions.filter((p) => p.enabled).length, 0);
}

const ROLE_DEFAULTS: Record<
  string,
  { userRole: string; defaultLoginModule: string; activeTabId: string; groups: UserFeatureGroup[] }
> = {
  "front-desk-registration": {
    userRole: "Front Desk / Registration",
    defaultLoginModule: "Registration",
    activeTabId: "registration",
    groups: [],
  },
  "accession-lab-technician": {
    userRole: "Accession Lab Technician",
    defaultLoginModule: "Operation",
    activeTabId: "accession",
    groups: [],
  },
  "operations-lab-technician": {
    userRole: "Operations Lab Technician",
    defaultLoginModule: "Operation",
    activeTabId: "operation",
    groups: OPERATION_FEATURE_GROUPS,
  },
  "lab-finance-analysis": {
    userRole: "Lab Finance / Analysis",
    defaultLoginModule: "Finance",
    activeTabId: "finance",
    groups: [],
  },
  admin: {
    userRole: "Admin",
    defaultLoginModule: "Admin",
    activeTabId: "admin",
    groups: [],
  },
  "inventory-manager": {
    userRole: "Inventory Manager",
    defaultLoginModule: "Admin",
    activeTabId: "inventory",
    groups: [],
  },
  phlebotomist: {
    userRole: "Phlebotomist",
    defaultLoginModule: "Registration",
    activeTabId: "phlebotomist",
    groups: [],
  },
  "custom-profile": {
    userRole: "Custom Profile",
    defaultLoginModule: "Admin",
    activeTabId: "registration",
    groups: [],
  },
};

export interface AddUserFormDefaults {
  roleId: string;
  userRole: string;
  defaultLoginModule: string;
  activeTabId: string;
  featureTabs: UserFeatureTab[];
}

export function getUserRoleCard(roleId: string): UserRoleCard | undefined {
  return USER_ROLE_CARDS.find((r) => r.id === roleId);
}

export function buildAddUserDefaults(roleId: string): AddUserFormDefaults | undefined {
  const card = getUserRoleCard(roleId);
  const defaults = ROLE_DEFAULTS[roleId];
  if (!card || !defaults) return undefined;

  const opCount = defaults.activeTabId === "operation" ? countEnabled(defaults.groups) : 0;

  const featureTabs: UserFeatureTab[] = [
    {
      id: "registration",
      label: "Registration",
      count: defaults.activeTabId === "registration" ? 0 : 0,
      moduleAccess: defaults.activeTabId === "registration",
      enableAll: false,
      groups: [],
    },
    {
      id: "accession",
      label: "Accession",
      count: defaults.activeTabId === "accession" ? 0 : 0,
      moduleAccess: defaults.activeTabId === "accession",
      enableAll: false,
      groups: [],
    },
    {
      id: "operation",
      label: "Operation",
      count: opCount,
      moduleAccess: defaults.activeTabId === "operation",
      enableAll: false,
      groups: defaults.activeTabId === "operation" ? defaults.groups : [],
    },
    {
      id: "finance",
      label: "Finance",
      count: 0,
      moduleAccess: defaults.activeTabId === "finance",
      enableAll: false,
      groups: [],
    },
    {
      id: "admin",
      label: "Admin",
      count: 0,
      moduleAccess: defaults.activeTabId === "admin",
      enableAll: false,
      groups: [],
    },
    {
      id: "phlebotomist",
      label: "Phlebotomist",
      count: 0,
      moduleAccess: defaults.activeTabId === "phlebotomist",
      enableAll: false,
      groups: [],
    },
    {
      id: "inventory",
      label: "Inventory",
      count: 0,
      moduleAccess: defaults.activeTabId === "inventory",
      enableAll: false,
      groups: [],
    },
  ];

  return {
    roleId,
    userRole: defaults.userRole,
    defaultLoginModule: defaults.defaultLoginModule,
    activeTabId: defaults.activeTabId,
    featureTabs,
  };
}

export function selectUserRoleHref(labId: number): string {
  return `/lab/${labId}/center/users/new`;
}

export function addUserDetailsHref(labId: number, roleId: string): string {
  return `/lab/${labId}/center/users/new/${roleId}`;
}
