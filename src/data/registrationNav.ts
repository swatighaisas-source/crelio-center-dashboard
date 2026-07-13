export type RegistrationNavIconId =
  | "registration"
  | "calendar"
  | "home"
  | "history"
  | "forms"
  | "cash"
  | "finance"
  | "archive"
  | "print"
  | "collection"
  | "services"
  | "status"
  | "search";

export interface RegistrationNavChild {
  id: string;
  label: string;
  path?: string;
  external?: boolean;
}

export interface RegistrationNavItem {
  id: string;
  label: string;
  icon: RegistrationNavIconId;
  chevron?: "down";
  children?: RegistrationNavChild[];
  external?: boolean;
}

export const REGISTRATION_NAV: RegistrationNavItem[] = [
  {
    id: "registration",
    label: "Registration",
    icon: "registration",
    chevron: "down",
    children: [
      { id: "ordering", label: "Registration / Ordering", path: "" },
      { id: "default-page", label: "Default Registration Page" },
      { id: "patient-search", label: "Patient Search", external: true },
      { id: "ai-registration", label: "AI Patient Registration", external: true },
    ],
  },
  { id: "appointments", label: "Appointments", icon: "calendar" },
  { id: "home-collection", label: "Home Collection", icon: "home" },
  { id: "pending-collection", label: "Pending Collection", icon: "collection" },
  { id: "order-history", label: "Order History", icon: "history" },
  { id: "lab-forms-history", label: "Lab Forms History", icon: "forms" },
  { id: "cash-transfer", label: "Cash Transfer", icon: "cash" },
  { id: "financial-reports", label: "Financial Reports", icon: "finance" },
  { id: "archives", label: "Archives", icon: "archive" },
  { id: "report-prints", label: "Report Prints", icon: "print" },
  { id: "collection-reports", label: "Collection Reports", icon: "collection" },
  { id: "services-list", label: "Services List", icon: "services" },
  { id: "operational-status", label: "Operational Status", icon: "status" },
  { id: "advanced-search", label: "Advanced Search", icon: "search" },
];
