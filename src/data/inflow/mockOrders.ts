export type OrderStatus = "Complete" | "Pending";

export type ExceptionKey =
  | "on_hold"
  | "in_question"
  | "not_performed"
  | "claim_on_hold"
  | "qc_fail"
  | "missing_data"
  | "recollection_required";

export type ExceptionActivity = {
  id: string;
  type: "set" | "resolved";
  exceptionKeys: ExceptionKey[];
  comment: string;
  actor: string;
  timestamp: string;
  scope?: "order" | "sample";
  target?: string;
};

export type ServiceLine = {
  id: string;
  name: string;
  code: string;
  status?: "Dispatched";
  price: number;
  concession: number;
};

export type Bill = {
  id: number;
  date: string;
  source: string;
  paid: boolean;
};

export type PaymentHistory = {
  mode: string;
  type: string;
  serviceName: string;
  amount: number;
  transactionDate: string;
  collectedBy: string;
};

export type Order = {
  id: number;
  patient: string;
  patientMeta: string;
  provider: string;
  source: string;
  account: string;
  orderDate: string;
  sampleDate: string;
  amount: number;
  due: number;
  status: OrderStatus;
  orderNumber: string;
  comments: string;
  services: ServiceLine[];
  bills: Bill[];
  paymentHistory: PaymentHistory[];
  exceptions: {
    active: ExceptionKey[];
    activity: ExceptionActivity[];
  };
};

export const exceptionLabels: Record<ExceptionKey, string> = {
  on_hold: "On Hold",
  in_question: "In Question",
  not_performed: "Not Performed",
  claim_on_hold: "Claim On Hold",
  qc_fail: "QC Fail",
  missing_data: "Missing Data",
  recollection_required: "Recollection Required",
};

export const exceptionOptions = Object.keys(exceptionLabels) as ExceptionKey[];

export const protectedExceptionKeys: Set<ExceptionKey> = new Set([
  "recollection_required",
]);

/** Exception types shown as chips in Add Exceptions (order / sample / report modals). Recollection is workflow-only, not user-selectable. */
export function getExceptionOptionsForLevel(level: "order" | "sample" | "report" | "bill") {
  return exceptionOptions.filter((key) => {
    if (key === "recollection_required") {
      return false;
    }
    return level !== "bill";
  });
}

const billStack: Bill[] = [
  { id: 1124621, date: "7th Apr, 2026", source: "None (Default)", paid: true },
  { id: 1047171, date: "14th Oct, 2025", source: "None (Default)", paid: true },
  { id: 1047170, date: "14th Oct, 2025", source: "None (Default)", paid: true },
  { id: 1047071, date: "14th Oct, 2025", source: "None (Default)", paid: true },
  { id: 969691, date: "19th Apr, 2025", source: "None (Default)", paid: true },
  { id: 901714, date: "5th Nov, 2024", source: "None (Default)", paid: true },
  { id: 830842, date: "9th May, 2024", source: "None (Default)", paid: true },
];

export const mockOrders: Order[] = [
  {
    id: 117,
    patient: "Aarav Ledger",
    patientMeta: "M - 2 y",
    provider: "SELF",
    source: "None (Default)",
    account: "Amazon",
    orderDate: "11th May, 2026 09:55 am",
    sampleDate: "11/05/2026 09:55 am",
    amount: 0,
    due: 0,
    status: "Complete",
    orderNumber: "-1",
    comments: "Bill split from Parent Bill: 111 to New Bill: 112 by LH - Husain (42)",
    services: [{ id: "svc-117", name: "iron", code: "873P--CHEM_AMS_IRON", price: 0, concession: 0 }],
    bills: billStack,
    paymentHistory: [],
    exceptions: { active: [], activity: [] },
  },
  {
    id: 112,
    patient: "JAMES BERGHOLT",
    patientMeta: "M - 57 y",
    provider: "Dr Catherine Coleman [000474...124]",
    source: "Org Pay",
    account: "Amazon",
    orderDate: "20th Mar, 2026 01:22 pm",
    sampleDate: "20/03/2026 01:22 PM",
    amount: 0,
    due: 0,
    status: "Complete",
    orderNumber: "-1",
    comments: "Bill split from Parent Bill: 111 to New Bill: 112 by LH - Husain (42)",
    services: [{ id: "iron-112", name: "iron", code: "873P--CHEM_AMS_IRON", price: 0, concession: 0 }],
    bills: [
      { id: 112, date: "20th Mar, 2026", source: "Org Pay", paid: true },
      { id: 111, date: "20th Mar, 2026", source: "Insurance", paid: false },
      { id: 86, date: "14th Oct, 2025", source: "None (Default)", paid: false },
    ],
    paymentHistory: [
      {
        mode: "CASH",
        type: "Patient Payment",
        serviceName: "-",
        amount: 0,
        transactionDate: "20th Mar, 2026 01:22 pm",
        collectedBy: "Livehealth",
      },
    ],
    exceptions: { active: [], activity: [] },
  },
  {
    id: 111,
    patient: "Anita Bergholt",
    patientMeta: "F - 54 y",
    provider: "Dr Catherine Coleman [000474...124]",
    source: "Insurance",
    account: "Amazon",
    orderDate: "20th Mar, 2026 01:22 pm",
    sampleDate: "20/03/2026 01:22 PM",
    amount: 70,
    due: 70,
    status: "Pending",
    orderNumber: "ORD-111",
    comments: "Insurance order pending collection details.",
    services: [{ id: "cbc-111", name: "CBC Automated", code: "HEM_CBC", price: 70, concession: 0 }],
    bills: billStack,
    paymentHistory: [],
    exceptions: { active: [], activity: [] },
  },
  {
    id: 110,
    patient: "Noah Trenton",
    patientMeta: "M - 8 d",
    provider: "Dr Catherine Coleman [000474...124]",
    source: "Insurance",
    account: "Amazon",
    orderDate: "18th Mar, 2026 04:47 am",
    sampleDate: "18/03/2026 04:47 AM",
    amount: 166,
    due: 166,
    status: "Pending",
    orderNumber: "ORD-110",
    comments: "Newborn panel requested by provider.",
    services: [
      { id: "tsh-110", name: "TSH - Ultrasensitive", code: "IMMU090", price: 6, concession: 0 },
      { id: "cbc-110", name: "CBC Automated", code: "HEM_CBC", price: 70, concession: 0 },
      { id: "hba1c-110", name: "HbA1c", code: "BIO_HBA1C", price: 90, concession: 0 },
    ],
    bills: billStack,
    paymentHistory: [],
    exceptions: { active: [], activity: [] },
  },
  {
    id: 108,
    patient: "GARRETT HUGHES",
    patientMeta: "M - 0 y",
    provider: "Dr Catherine Coleman [000474...124]",
    source: "None (Default)",
    account: "Demo",
    orderDate: "26th Feb, 2026 05:23 pm",
    sampleDate: "26/02/2026 05:23 PM",
    amount: 1,
    due: 1,
    status: "Pending",
    orderNumber: "ORD-108",
    comments: "Routine service order.",
    services: [{ id: "glucose-108", name: "Glucose Fasting", code: "BIO_GLU_FAST", price: 1, concession: 0 }],
    bills: billStack,
    paymentHistory: [],
    exceptions: { active: [], activity: [] },
  },
];

const extraRows: Array<Pick<Order, "id" | "patient" | "patientMeta" | "provider" | "source" | "account" | "orderDate" | "amount" | "due" | "status">> = [
  { id: 107, patient: "Riya Shah", patientMeta: "F - 32 y", provider: "Dr Catherine Coleman [000474...124]", source: "None (Default)", account: "Demo", orderDate: "10th Feb, 2026 07:26 pm", amount: 1, due: 0, status: "Complete" },
  { id: 106, patient: "Mehul Latkar Demo", patientMeta: "M - 41 y", provider: "Dr Ann Forde [000099...1033]", source: "None (Default)", account: "Demo", orderDate: "10th Feb, 2026 07:26 pm", amount: 0, due: 0, status: "Complete" },
  { id: 105, patient: "Kabir Mehta", patientMeta: "M - 29 y", provider: "Dr Catherine Coleman [000474...124]", source: "None (Default)", account: "Demo", orderDate: "10th Feb, 2026 07:26 pm", amount: 1, due: 1, status: "Complete" },
  { id: 104, patient: "Sara Iyer", patientMeta: "F - 36 y", provider: "Dr Catherine Coleman [000474...124]", source: "None (Default)", account: "Demo", orderDate: "10th Feb, 2026 07:24 pm", amount: 6666670, due: 6666650, status: "Pending" },
  { id: 103, patient: "Dev Patel", patientMeta: "M - 45 y", provider: "Dr Tara Conlan [000028...1327]", source: "", account: "Amazon", orderDate: "6th Feb, 2026 10:04 am", amount: 4, due: 0, status: "Complete" },
  { id: 102, patient: "Isha Nair", patientMeta: "F - 27 y", provider: "SELF", source: "None (Default)", account: "Amazon", orderDate: "6th Feb, 2026 09:47 am", amount: 4, due: 0, status: "Complete" },
  { id: 101, patient: "Husain Rampurwala", patientMeta: "M - 38 y", provider: "SELF", source: "None (Default)", account: "Demo", orderDate: "21st Jan, 2026 04:52 pm", amount: 20, due: 0, status: "Complete" },
  { id: 100, patient: "Tara Sethi", patientMeta: "F - 31 y", provider: "Dr Tara Conlan [000028...1327]", source: "e3425676", account: "Amazon", orderDate: "16th Jan, 2026 04:04 pm", amount: 5, due: 5, status: "Pending" },
  { id: 99, patient: "Omar Khan", patientMeta: "M - 52 y", provider: "Dr Catherine Coleman [000474...124]", source: "None (Default)", account: "Amazon", orderDate: "16th Jan, 2026 01:43 pm", amount: 0, due: 0, status: "Complete" },
  { id: 98, patient: "Mira Joshi", patientMeta: "F - 24 y", provider: "SELF", source: "None (Default)", account: "Amazon", orderDate: "11th Jan, 2026 08:01 am", amount: 0, due: 0, status: "Complete" },
  { id: 97, patient: "Neil Dsouza", patientMeta: "M - 47 y", provider: "Dr Catherine Coleman [000474...124]", source: "None (Default)", account: "Dummy account for test...", orderDate: "17th Dec, 2025 09:32 am", amount: 2, due: 0, status: "Complete" },
  { id: 96, patient: "Pooja Menon", patientMeta: "F - 10 y", provider: "Dr Tara Conlan [000028...1327]", source: "e3425676", account: "Amazon", orderDate: "12th Dec, 2025 07:58 pm", amount: 0, due: 0, status: "Complete" },
  { id: 95, patient: "Arjun Rao", patientMeta: "M - 40 y", provider: "SELF", source: "None (Default)", account: "Demo", orderDate: "12th Dec, 2025 11:59 am", amount: 1, due: 0, status: "Complete" },
  { id: 94, patient: "Leena Kapoor", patientMeta: "F - 33 y", provider: "SELF", source: "None (Default)", account: "Demo", orderDate: "11th Dec, 2025 02:21 pm", amount: 1, due: 0, status: "Complete" },
  { id: 93, patient: "Rohan Batra", patientMeta: "M - 28 y", provider: "SELF", source: "None (Default)", account: "Demo", orderDate: "11th Dec, 2025 02:16 pm", amount: 1, due: 0, status: "Complete" },
  { id: 92, patient: "Aisha Thomas", patientMeta: "F - 35 y", provider: "SELF", source: "None (Default)", account: "Demo", orderDate: "11th Dec, 2025 02:13 pm", amount: 1, due: 0, status: "Complete" },
];

mockOrders.push(
  ...extraRows.map((row) => ({
    ...row,
    sampleDate: row.orderDate,
    orderNumber: `ORD-${row.id}`,
    comments: "Routine billing order.",
    services: [{ id: `svc-${row.id}`, name: "TSH - Ultrasensitive", code: "IMMU090", price: row.amount, concession: 0 }],
    bills: billStack,
    paymentHistory: [],
    exceptions: { active: [], activity: [] },
  })),
);
