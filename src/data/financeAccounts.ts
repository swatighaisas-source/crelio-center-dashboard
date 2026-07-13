export type AccountOrgType = "Walkin" | "PrePaid" | "PostPaid";

export interface FinanceAccount {
  id: string;
  name: string;
  contactNo: string;
  email: string;
  businessType: string;
  orgType: AccountOrgType;
  loginBadge?: string;
  assignedLedger: string;
  actualCredit: number;
  creditDays: number;
  status: "active" | "inactive";
  defaultPaymentMode: string;
}

/** Orgs that have an explicitly configured default payment mode. */
export const CONFIGURED_DEFAULT_PAYMENT_ACCOUNT_IDS = new Set([
  "acc-1",
  "acc-2",
  "acc-3",
  "acc-4",
]);

export function isConfiguredDefaultPaymentAccount(accountId: string): boolean {
  return CONFIGURED_DEFAULT_PAYMENT_ACCOUNT_IDS.has(accountId);
}

export function getConfiguredAccountDefaultPaymentMode(accountId: string): string {
  const account = DEFAULT_FINANCE_ACCOUNTS.find((item) => item.id === accountId);
  return account?.defaultPaymentMode ?? "";
}

export const DEFAULT_FINANCE_ACCOUNTS: FinanceAccount[] = [
  {
    id: "acc-1",
    name: "postpaid-sid",
    contactNo: "9876543210",
    email: "postpaid.sid@example.com",
    businessType: "Diagnostic",
    orgType: "PostPaid",
    loginBadge: "CC Login 1",
    assignedLedger: "Main Ledger",
    actualCredit: -500,
    creditDays: 30,
    status: "active",
    defaultPaymentMode: "Cash",
  },
  {
    id: "acc-2",
    name: "Bhagya Postpaid org",
    contactNo: "9123456780",
    email: "bhagya.postpaid@example.com",
    businessType: "Hospital",
    orgType: "PostPaid",
    assignedLedger: "Main Ledger",
    actualCredit: -28616,
    creditDays: 45,
    status: "active",
    defaultPaymentMode: "Cash",
  },
  {
    id: "acc-3",
    name: "test-swati",
    contactNo: "9988776655",
    email: "test.swati@example.com",
    businessType: "Clinic",
    orgType: "PostPaid",
    loginBadge: "CC Login 1",
    assignedLedger: "Secondary Ledger",
    actualCredit: -1200,
    creditDays: 15,
    status: "active",
    defaultPaymentMode: "Credit Card",
  },
  {
    id: "acc-4",
    name: "pranaliPostpaid",
    contactNo: "9012345678",
    email: "pranali.postpaid@example.com",
    businessType: "Diagnostic",
    orgType: "PostPaid",
    assignedLedger: "Main Ledger",
    actualCredit: -8400,
    creditDays: 30,
    status: "active",
    defaultPaymentMode: "Credit Card",
  },
  {
    id: "acc-5",
    name: "dummyorg1",
    contactNo: "8899001122",
    email: "dummyorg1@example.com",
    businessType: "Corporate",
    orgType: "PostPaid",
    assignedLedger: "Main Ledger",
    actualCredit: -250,
    creditDays: 7,
    status: "active",
    defaultPaymentMode: "",
  },
  {
    id: "acc-6",
    name: "pragati Orgs post paid",
    contactNo: "8765432109",
    email: "pragati.orgs@example.com",
    businessType: "Hospital",
    orgType: "PostPaid",
    loginBadge: "CC Login 1",
    assignedLedger: "Regional Ledger",
    actualCredit: -15400,
    creditDays: 60,
    status: "active",
    defaultPaymentMode: "",
  },
  {
    id: "acc-7",
    name: "new postpaid org testin...",
    contactNo: "7654321098",
    email: "new.postpaid@example.com",
    businessType: "Clinic",
    orgType: "PostPaid",
    assignedLedger: "Main Ledger",
    actualCredit: -980,
    creditDays: 20,
    status: "active",
    defaultPaymentMode: "",
  },
  {
    id: "acc-8",
    name: "QA Krishna 2",
    contactNo: "6543210987",
    email: "qa.krishna@example.com",
    businessType: "Diagnostic",
    orgType: "PostPaid",
    assignedLedger: "QA Ledger",
    actualCredit: -3200,
    creditDays: 30,
    status: "active",
    defaultPaymentMode: "",
  },
  {
    id: "acc-9",
    name: "243 org",
    contactNo: "5432109876",
    email: "org243@example.com",
    businessType: "Corporate",
    orgType: "PostPaid",
    loginBadge: "CC Login 1",
    assignedLedger: "Main Ledger",
    actualCredit: -1100,
    creditDays: 15,
    status: "active",
    defaultPaymentMode: "",
  },
  {
    id: "acc-10",
    name: "Walkin Patient Default",
    contactNo: "4321098765",
    email: "walkin@example.com",
    businessType: "Walkin",
    orgType: "Walkin",
    assignedLedger: "Cash Ledger",
    actualCredit: 0,
    creditDays: 0,
    status: "active",
    defaultPaymentMode: "",
  },
  {
    id: "acc-11",
    name: "Prepaid Health Corp",
    contactNo: "3210987654",
    email: "prepaid.health@example.com",
    businessType: "Corporate",
    orgType: "PrePaid",
    assignedLedger: "Prepaid Ledger",
    actualCredit: 5000,
    creditDays: 0,
    status: "active",
    defaultPaymentMode: "",
  },
];

/** Display total used in the account list table header (matches production scale). */
export const ACCOUNT_LIST_DISPLAY_TOTAL = 484;
