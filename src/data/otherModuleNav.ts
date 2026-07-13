import type { ModuleNavGroup } from "./labModules";

function group(
  id: ModuleNavGroup["icon"],
  label: string,
  children: { id: string; label: string; path?: string }[],
): ModuleNavGroup[] {
  return [
    {
      id,
      label,
      icon: id,
      children: children.map((child) => ({
        id: child.id,
        label: child.label,
        path: child.path ?? `/${child.id}`,
      })),
    },
  ];
}

export const ACCESSION_NAV = group("accession", "Accession", [
  { id: "dashboard", label: "Accession Dashboard", path: "" },
  { id: "sample-list", label: "Sample List", path: "/sample-list" },
  { id: "pending", label: "Pending Accession" },
  { id: "completed", label: "Completed Accession" },
  { id: "archives", label: "Archives" },
]);

export const FINANCE_NAV: ModuleNavGroup[] = [
  {
    id: "finance",
    label: "Finance",
    icon: "finance",
    children: [
      { id: "dashboard", label: "Finance Dashboard", path: "" },
      {
        id: "account-management",
        label: "Account Management",
        children: [
          {
            id: "account-list",
            label: "Account List",
            path: "/account-management/account-list",
          },
          {
            id: "account-revenue-list",
            label: "Account Revenue List",
            path: "/account-management/account-revenue-list",
          },
          {
            id: "account-marketing-report",
            label: "Account Wise Marketing Report",
            path: "/account-management/account-marketing-report",
          },
          {
            id: "custom-url",
            label: "Custom URL",
            path: "/account-management/custom-url",
          },
          {
            id: "bulk-account-upload",
            label: "Bulk Account Upload",
            path: "/account-management/bulk-account-upload",
          },
          {
            id: "auto-account-code",
            label: "Auto Account Code Generation",
            path: "/account-management/auto-account-code",
          },
          {
            id: "account-notifications",
            label: "Account Notifications",
            path: "/account-management/account-notifications",
          },
        ],
      },
      { id: "invoices", label: "Invoices", path: "/invoices" },
      { id: "payments", label: "Payments", path: "/payments" },
      { id: "reports", label: "Financial Reports", path: "/reports" },
    ],
  },
];

export const REVIEWER_NAV = group("reviewer", "Reviewer", [
  { id: "dashboard", label: "Reviewer Dashboard", path: "" },
  { id: "pending", label: "Pending Review" },
  { id: "completed", label: "Completed Review" },
]);

export const INVENTORY_NAV = group("inventory", "Inventory", [
  { id: "dashboard", label: "Inventory Dashboard", path: "" },
  { id: "stock", label: "Stock Management" },
  { id: "orders", label: "Purchase Orders" },
  { id: "reports", label: "Inventory Reports" },
]);

export const CRM_NAV = group("crm", "CRM", [
  { id: "dashboard", label: "CRM Dashboard", path: "" },
  { id: "accounts", label: "Accounts" },
  { id: "contacts", label: "Contacts" },
  { id: "campaigns", label: "Campaigns" },
]);

export const ANALYTICS_NAV = group("analytics", "Analytics", [
  { id: "dashboard", label: "Analytics Dashboard", path: "" },
  { id: "operations", label: "Operations Analytics" },
  { id: "finance", label: "Finance Analytics" },
  { id: "custom", label: "Custom Reports" },
]);
