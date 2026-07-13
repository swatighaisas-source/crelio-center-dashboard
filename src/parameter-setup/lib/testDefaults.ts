import type { Test, TestValidationStatus } from '@/types';

export type TestWithoutId = Omit<Test, 'id'>;

const UNVERIFIED: TestValidationStatus = 'Unverified';

function normaliseValidationStatus(v: unknown): TestValidationStatus {
  const s = String(v ?? '')
    .trim()
    .toLowerCase();
  if (s === 'verified') return 'Verified';
  if (s === 'pending') return 'Pending';
  return 'Unverified';
}

/** Full row defaults (bulk test creation + Crelio-style fields) */
export const defaultTestRowWithoutId = (): TestWithoutId => ({
  code: '',
  name: '',
  shortName: '',

  multiSample: false,
  integrationCode: '',
  procedureCode: '',
  loincCode: '',
  testType: '',
  icdToPin: '',
  autoAddIcd: false,

  departmentId: null,
  sampleTypeId: null,
  category: '',

  defaultPrice: null,
  testPrice2: null,
  minimumSellingPrice: null,
  costOfTest: null,
  revenueCap: null,

  previousTestOrderCheck: '',
  actionOnRepeatTest: '',

  outsourceCenter: '',

  genderBasedTest: 'All',
  analyticalTatDays: null,
  analyticalTatHours: null,
  analyticalTatMinutes: null,
  sampleProcess: '',
  description: '',
  descriptionAdvanceEditor: false,
  testInstructions: '',

  validationStatus: UNVERIFIED,
  validatedActive: true,
  tat: '',
  remarks: '',

  billOnlyTest: false,
  printPriorityNA: false,
  cap: false,
  testContainsGraph: false,
  enableDeviceFlags: false,
  showDeviceExtraDataInPdf: false,
  maskThisReport: false,
  hideTrendsReport: false,
  noReportToPatient: false,
  outsourcedTest: false,
  nonInsuranceService: false,
  nablTests: false,
  discardDiscount: false,
  testHasInvestigations: false,
  multiUnit: false,
  cellCounter: false,

  allowEditInWord: false,

  linearityCheck: false,
  deltaCheck: false,
});

type Legacy = Partial<Test> & { id: string; active?: boolean; reportType?: string };

/** Fills new fields for older saved rows / partial patches */
export function mergeTestFromPartial(raw: Legacy): Test {
  const base = defaultTestRowWithoutId();
  const m: Record<string, unknown> = { ...base, ...raw, id: raw.id };

  m.validationStatus =
    raw.validationStatus !== undefined
      ? normaliseValidationStatus(raw.validationStatus)
      : UNVERIFIED;

  if (raw.validatedActive !== undefined) m.validatedActive = raw.validatedActive;
  else if (raw.active !== undefined) m.validatedActive = Boolean(raw.active);
  else m.validatedActive = base.validatedActive;

  for (const k of Object.keys(base) as (keyof TestWithoutId)[]) {
    if (m[k] === undefined) m[k] = base[k];
  }
  return m as unknown as Test;
}
