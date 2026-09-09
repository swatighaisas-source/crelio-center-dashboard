export type AoeHistoryTab = "bill" | "test" | "promotion" | "store";

export interface AoeHistoryRow {
  id: string;
  patientId: number;
  patientFullName: string;
  patientDob: string;
  billId: number;
  testId: string;
  testName: string;
  aoeType: AoeHistoryTab;
}

export interface ConsentHistoryRow {
  id: string;
  patientId: number;
  patientFullName: string;
  billId: number;
  consentForm: string;
  signedOn: string;
}

export interface PatientInfoHistoryRow {
  id: string;
  patientId: number;
  patientFullName: string;
  billId: number;
  fieldLabel: string;
  fieldValue: string;
}

const AMMONIA_TEST_ID = "761004";
const DENGUE_TEST_ID = "7063835";

function buildTestAoeRows(): AoeHistoryRow[] {
  const rows: AoeHistoryRow[] = [];

  for (let instance = 1; instance <= 3; instance += 1) {
    rows.push({
      id: `doe-ammonia-${instance}`,
      patientId: 33331,
      patientFullName: "Doe Testing",
      patientDob: "",
      billId: 922638,
      testId: AMMONIA_TEST_ID,
      testName: "AMMONIA",
      aoeType: "test",
    });
  }

  for (let instance = 1; instance <= 3; instance += 1) {
    rows.push({
      id: `swati-ammonia-${instance}`,
      patientId: 33506,
      patientFullName: "swati",
      patientDob: "",
      billId: 922639,
      testId: AMMONIA_TEST_ID,
      testName: "Ammonia",
      aoeType: "test",
    });
  }

  rows.push({
    id: "swati-dengue-1",
    patientId: 33506,
    patientFullName: "swati",
    patientDob: "",
    billId: 922639,
    testId: DENGUE_TEST_ID,
    testName: "Dengue NS1",
    aoeType: "test",
  });

  const fillerPatients = [
    { patientId: 33401, name: "John Smith", billId: 922600 },
    { patientId: 33402, name: "Jane Doe", billId: 922601 },
    { patientId: 33403, name: "Alex Kumar", billId: 922602 },
    { patientId: 33404, name: "Priya Patel", billId: 922603 },
    { patientId: 33405, name: "Michael Chen", billId: 922604 },
  ];

  let fillerIndex = 0;
  while (rows.length < 42) {
    const patient = fillerPatients[fillerIndex % fillerPatients.length];
    rows.push({
      id: `filler-${rows.length}`,
      patientId: patient.patientId,
      patientFullName: patient.name,
      patientDob: "",
      billId: patient.billId,
      testId: AMMONIA_TEST_ID,
      testName: "AMMONIA",
      aoeType: "test",
    });
    fillerIndex += 1;
  }

  return rows;
}

export const mockAoeHistoryRows: AoeHistoryRow[] = buildTestAoeRows();

export const mockBillAoeRows: AoeHistoryRow[] = mockAoeHistoryRows.slice(0, 8).map((row) => ({
  ...row,
  id: `bill-${row.id}`,
  aoeType: "bill" as const,
}));

export const mockPromotionAoeRows: AoeHistoryRow[] = mockAoeHistoryRows.slice(0, 5).map((row) => ({
  ...row,
  id: `promo-${row.id}`,
  aoeType: "promotion" as const,
}));

export const mockStoreAoeRows: AoeHistoryRow[] = mockAoeHistoryRows.slice(0, 3).map((row) => ({
  ...row,
  id: `store-${row.id}`,
  aoeType: "store" as const,
}));

export const mockConsentHistoryRows: ConsentHistoryRow[] = [
  {
    id: "consent-1",
    patientId: 33506,
    patientFullName: "swati",
    billId: 922639,
    consentForm: "General Lab Consent",
    signedOn: "2nd Sep, 2026 03:00 pm",
  },
  {
    id: "consent-2",
    patientId: 33331,
    patientFullName: "Doe Testing",
    billId: 922638,
    consentForm: "General Lab Consent",
    signedOn: "2nd Sep, 2026 02:45 pm",
  },
  {
    id: "consent-3",
    patientId: 33401,
    patientFullName: "John Smith",
    billId: 922600,
    consentForm: "HIV Testing Consent",
    signedOn: "1st Sep, 2026 11:20 am",
  },
];

export const mockPatientInfoHistoryRows: PatientInfoHistoryRow[] = [
  {
    id: "info-1",
    patientId: 33506,
    patientFullName: "swati",
    billId: 922639,
    fieldLabel: "Emergency Contact",
    fieldValue: "91 9898789878",
  },
  {
    id: "info-2",
    patientId: 33506,
    patientFullName: "swati",
    billId: 922639,
    fieldLabel: "Clinical Notes",
    fieldValue: "Fever for 3 days",
  },
  {
    id: "info-3",
    patientId: 33331,
    patientFullName: "Doe Testing",
    billId: 922638,
    fieldLabel: "Referral Notes",
    fieldValue: "Routine screening",
  },
];

export function getAoeRowsForTab(tab: AoeHistoryTab): AoeHistoryRow[] {
  switch (tab) {
    case "bill":
      return mockBillAoeRows;
    case "test":
      return mockAoeHistoryRows;
    case "promotion":
      return mockPromotionAoeRows;
    case "store":
      return mockStoreAoeRows;
    default:
      return mockAoeHistoryRows;
  }
}
