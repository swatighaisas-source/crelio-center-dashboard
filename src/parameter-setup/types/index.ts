export type ID = string;

export interface LookupValue {
  id: ID;
  name: string;
}

/** User / workflow validation label on a test (bulk-settable in Test Creation) */
export type TestValidationStatus = 'Unverified' | 'Verified' | 'Pending';

export interface Test {
  id: ID;
  code: string;
  name: string;
  shortName?: string;
  /** General */
  multiSample: boolean;
  integrationCode: string;
  procedureCode: string;
  loincCode: string;
  testType: string;
  icdToPin: string;
  autoAddIcd: boolean;
  departmentId?: ID | null;
  sampleTypeId?: ID | null;
  /** Test Category / Section (maps to Crelio “Test Category”) */
  category?: string;
  /** Pricing */
  defaultPrice: number | null;
  testPrice2: number | null;
  minimumSellingPrice: number | null;
  costOfTest: number | null;
  revenueCap: number | null;
  previousTestOrderCheck: string;
  actionOnRepeatTest: string;
  outsourceCenter: string;
  /** Other information */
  genderBasedTest: string;
  analyticalTatDays: number | null;
  analyticalTatHours: number | null;
  analyticalTatMinutes: number | null;
  sampleProcess: string;
  description: string;
  descriptionAdvanceEditor: boolean;
  testInstructions: string;
  /** Review / compliance (Status column) */
  validationStatus: TestValidationStatus;
  /** When true, test is cleared for use as validated + active in the lab workflow */
  validatedActive: boolean;
  /** Legacy / display rollup (e.g. “2h”) */
  tat?: string;
  remarks?: string;
  /** Configs */
  billOnlyTest: boolean;
  printPriorityNA: boolean;
  cap: boolean;
  testContainsGraph: boolean;
  enableDeviceFlags: boolean;
  showDeviceExtraDataInPdf: boolean;
  maskThisReport: boolean;
  hideTrendsReport: boolean;
  noReportToPatient: boolean;
  outsourcedTest: boolean;
  nonInsuranceService: boolean;
  nablTests: boolean;
  discardDiscount: boolean;
  testHasInvestigations: boolean;
  multiUnit: boolean;
  cellCounter: boolean;
  allowEditInWord: boolean;
  linearityCheck: boolean;
  deltaCheck: boolean;
}

/**
 * Parameter types are modelled after Crelio’s “Add new parameter” options
 * (Pathology / Radiology / Style → type). Each row is a single parameter
 * with a `type` that governs which additional fields are applicable.
 */
export type ParameterType =
  | 'TestWithNormalRange'
  | 'TestWithDescriptiveRange'
  | 'TestWithAgeSpecificRange'
  | 'DescriptiveNoRanges'
  | 'ListField'
  | 'File'
  | 'Graph'
  | 'Image';

export type ParameterCategory = 'Pathology' | 'Radiology' | 'Style';

export type AgeUnit = 'Days' | 'Months' | 'Years';

/** A single age-specific range row (a parameter can have many). */
export interface AgeRange {
  id: ID;
  isDefault: boolean;
  ageUnit: AgeUnit;
  lowerAge: string;
  upperAge: string;
  lowerMale: string;
  upperMale: string;
  lowerFemale: string;
  upperFemale: string;
  descriptiveMale: string;
  descriptiveFemale: string;
}

export interface Parameter {
  id: ID;
  /** Stable machine identifier — still editable, used for lookups / mapping */
  code: string;
  name: string;
  category: ParameterCategory;
  type: ParameterType;

  /** Identifiers / method */
  unit: string;
  method: string;
  integrationCode: string;
  loincCode: string;
  dictionary: string;
  linkedParameters: string;

  /** Normal Ranges (numeric lower/upper, applies to most ranged types) */
  maleLowerRange: string;
  maleUpperRange: string;
  femaleLowerRange: string;
  femaleUpperRange: string;

  /** Descriptive narratives shown next to the numeric range */
  defaultDescription: string;
  descriptiveMale: string;
  descriptiveFemale: string;
  descriptiveMaleAdvanceEditor: boolean;
  descriptiveFemaleAdvanceEditor: boolean;

  /** Age-specific ranges — any number of rows, one marked default. */
  ageRanges: AgeRange[];

  /** Descriptive (No Ranges) */
  descriptive: string;
  descriptiveAdvanceEditor: boolean;
  breakLine: boolean;
  obxSegments: boolean;

  /** List Field */
  listValues: string;
  listMarkAsCritical: boolean;
  listHighlight: boolean;

  /** Critical Ranges */
  criticalLowMale: string;
  criticalHighMale: string;
  criticalLowFemale: string;
  criticalHighFemale: string;

  /** Calculation */
  formulaPreset: string;
  formula: string;
  /** Variable→parameter mapping for the chosen formula (only when formula set). */
  formulaMapping: string;

  /** Rerun method flags */
  rerunAuto: boolean;
  rerunManual: boolean;

  /** Other info flags (common to almost all types) */
  hideParameter: boolean;
  customizedParameter: boolean;
  highlightThisValue: boolean;
  underlineThisValue: boolean;
  optionalField: boolean;
  hasImpressions: boolean;
  hideParameterTrends: boolean;
  nonEditable: boolean;
  reportOnlyWhenPositive: boolean;

  /** Auto approval */
  autoApproval: boolean;
  autoApprovalLowerMale: string;
  autoApprovalUpperMale: string;
  autoApprovalLowerFemale: string;
  autoApprovalUpperFemale: string;

  /** Soft-disabled (e.g. via de-duplication "keep one, disable others"). */
  disabled?: boolean;

  /**
   * When true, this row is a test-level child instance created by assigning
   * a library parameter to a test; it should not appear in the library view.
   */
  isTestLevel?: boolean;
  /**
   * For test-level children: the library parameter this instance was cloned
   * from. Used to render "Linked from Library" badges and to derive library
   * mapping state without re-scanning every mapping.
   */
  sourceLibraryParameterId?: ID;
}

export interface ParameterOverrides {
  displayName?: string;
  unit?: string;
  normalRange?: string;
  notes?: string;
}

export interface TestParameterMapping {
  id: ID;
  testId: ID;
  parameterId: ID;
  sequence: number;
  isHeader: boolean;
  printable: boolean;
  required: boolean;
  overrides: ParameterOverrides;
}

export interface AppState {
  tests: Test[];
  parameters: Parameter[];
  departments: LookupValue[];
  sampleTypes: LookupValue[];
  mappings: TestParameterMapping[];
}
