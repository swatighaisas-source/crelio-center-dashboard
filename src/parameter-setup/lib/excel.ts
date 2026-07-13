import * as XLSX from 'xlsx';
import type {
  AgeRange,
  AgeUnit,
  Parameter,
  ParameterCategory,
  ParameterType,
  Test,
  TestValidationStatus,
} from '@/types';
import { defaultTestRowWithoutId } from './testDefaults';
import {
  PARAMETER_CATEGORIES,
  PARAMETER_TYPES,
  PARAMETER_TYPE_LABELS,
  defaultAgeRange,
  defaultParameterRowWithoutId,
} from './parameterDefaults';
import { uid } from './id';

/** Column order for bulk test template (matches Test Creation import) */
export const TEST_XLSX_HEADERS = [
  'Test Code',
  'Test Name',
  'Short Name',
  'Multi Sample',
  'Integration Code',
  'Procedure Code',
  'LOINC Code',
  'Test Type',
  'ICD(s) TO PIN',
  'Auto-add ICD',
  'Department',
  'Sample Type',
  'Test Category',
  'Test Price',
  'Test Price 2',
  'Minimum Selling Price',
  'Cost Of Test',
  'Revenue Cap',
  'Previous Test Order Check',
  'Action on Repeat Test',
  'Outsource Center',
  'Gender Based Test',
  'Analytical TAT Days',
  'Analytical TAT Hours',
  'Analytical TAT Minutes',
  'Sample Process',
  'Description',
  'Description Advance Editor',
  'Test Instructions',
  'Status',
  'Validated Active',
  'TAT',
  'Remarks',
  'Bill Only Test',
  'Print Priority N/A',
  'CAP',
  'This test contains graph',
  'Enable Device Flags',
  'Show Device Extra Data in PDF',
  'Mask this report',
  'Hide trends report',
  'No report to patient',
  'Outsourced Test',
  'Non Insurance Service',
  'NABL Tests',
  'Discard Discount',
  'This test has investigations',
  'Multi Unit',
  'Cell Counter',
  'Allow editing in Word',
  'Linearity Check',
  'Delta Check',
] as const;

/**
 * Bulk-upload column layout — matches the product's parameter-wise export so a
 * round-trip (export → edit → re-upload) works. Age-specific parameters span
 * MULTIPLE rows, one per age band, repeating the identity columns; the age band
 * lives in "Lower/Upper Age (in days)" and reuses the Male/Female Range columns.
 */
export const PARAM_XLSX_HEADERS = [
  'labParameterId',
  'Parameter Name',
  'Parameter Type',
  'Parameter Code',
  'Integration Code',
  'Unit',
  'Default Description',
  'Lower Age (in days)',
  'Upper Age (in days)',
  'Male Lower Range',
  'Male Upper Range',
  'Female Lower Range',
  'Female Upper Range',
  'Critical Low Male',
  'Critical High Male',
  'Critical Low Female',
  'Critical High Female',
  'Method',
  'Descriptive Male',
  'Descriptive Female',
  'List values',
  'List Mark As Critical',
  'List Highlight',
] as const;

function sampleRow(over: Record<string, string | number | boolean>): Record<string, string | number> {
  const o: Record<string, string | number> = {};
  for (const h of TEST_XLSX_HEADERS) {
    o[h] = (over[h] as string | number | undefined) ?? '';
  }
  return o;
}

export function downloadTestTemplate() {
  const sample = [
    sampleRow({
      'Test Code': 'BIO_GLU_F',
      'Test Name': 'Glucose Fasting',
      'Short Name': 'Glu F',
      'Test Type': 'Pathology',
      Department: 'Biochemistry',
      'Sample Type': 'Serum',
      'Test Category': 'Diabetes',
      'Test Price': 120,
      'Gender Based Test': 'All',
      Status: 'Unverified',
      'Validated Active': 'Yes',
      TAT: '2h',
      'Print Priority N/A': 'Yes',
    }),
    sampleRow({
      'Test Code': 'HEM_CBC',
      'Test Name': 'Complete Blood Count',
      'Short Name': 'CBC',
      'Test Type': 'Pathology',
      Department: 'Hematology',
      'Sample Type': 'Whole Blood',
      'Test Category': 'Hematology',
      'Test Price': 350,
      'Gender Based Test': 'All',
      Status: 'Verified',
      'Validated Active': 'Yes',
      TAT: '2h',
    }),
  ];
  const ws = XLSX.utils.json_to_sheet(sample, { header: [...TEST_XLSX_HEADERS] });
  const wb = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(wb, ws, 'Tests');
  XLSX.writeFile(wb, 'tests-template.xlsx');
}

function paramSampleRow(
  over: Record<string, string | number | boolean>,
): Record<string, string | number> {
  const o: Record<string, string | number> = {};
  for (const h of PARAM_XLSX_HEADERS) {
    const v = over[h];
    if (v === undefined) o[h] = '';
    else if (typeof v === 'boolean') o[h] = v ? 'Yes' : 'No';
    else o[h] = v;
  }
  return o;
}

export function downloadParameterTemplate() {
  const sample = [
    // Normal-range parameter — single row.
    paramSampleRow({
      labParameterId: 'P0001',
      'Parameter Name': 'Glucose',
      'Parameter Type': PARAMETER_TYPE_LABELS.TestWithNormalRange,
      'Integration Code': 82434976,
      Unit: 'mg/dL',
      'Male Lower Range': 70,
      'Male Upper Range': 100,
      'Female Lower Range': 70,
      'Female Upper Range': 100,
      'Critical Low Male': 40,
      'Critical High Male': 400,
      Method: 'Hexokinase',
    }),
    // Age-specific parameter — ONE ROW PER AGE BAND, all sharing the same
    // Integration Code. Age limits are in days; a blank Lower Age = default band.
    paramSampleRow({
      labParameterId: 'P0002',
      'Parameter Name': 'Hemoglobin',
      'Parameter Type': PARAMETER_TYPE_LABELS.TestWithAgeSpecificRange,
      'Integration Code': 82434980,
      Unit: 'g/dL',
      'Lower Age (in days)': '',
      'Upper Age (in days)': 30,
      'Male Lower Range': 10,
      'Male Upper Range': 20,
      'Female Lower Range': 10,
      'Female Upper Range': 20,
    }),
    paramSampleRow({
      labParameterId: 'P0003',
      'Parameter Name': 'Hemoglobin',
      'Parameter Type': PARAMETER_TYPE_LABELS.TestWithAgeSpecificRange,
      'Integration Code': 82434980,
      'Lower Age (in days)': 30,
      'Upper Age (in days)': 365,
      'Male Lower Range': 11.5,
      'Male Upper Range': 16.5,
      'Female Lower Range': 11.5,
      'Female Upper Range': 16.5,
    }),
    paramSampleRow({
      labParameterId: 'P0004',
      'Parameter Name': 'Hemoglobin',
      'Parameter Type': PARAMETER_TYPE_LABELS.TestWithAgeSpecificRange,
      'Integration Code': 82434980,
      'Lower Age (in days)': 365,
      'Upper Age (in days)': 36500,
      'Male Lower Range': 13,
      'Male Upper Range': 17,
      'Female Lower Range': 12,
      'Female Upper Range': 15,
    }),
    // List-field parameter.
    paramSampleRow({
      labParameterId: 'P0005',
      'Parameter Name': 'Urine Colour',
      'Parameter Type': PARAMETER_TYPE_LABELS.ListField,
      'Integration Code': 82434979,
      'List values': 'Pale Yellow~0#Yellow~0#Amber~0#Red~0#Colourless~0',
    }),
    // Descriptive (narrative) parameter.
    paramSampleRow({
      labParameterId: 'P0006',
      'Parameter Name': 'Impression',
      'Parameter Type': PARAMETER_TYPE_LABELS.DescriptiveNoRanges,
      'Integration Code': 82434978,
      'Default Description': 'Clinical impression / narrative.',
    }),
  ];
  const ws = XLSX.utils.json_to_sheet(sample, { header: [...PARAM_XLSX_HEADERS] });
  const wb = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(wb, ws, 'Parameters');
  XLSX.writeFile(wb, 'parameters-template.xlsx');
}

/**
 * Column order for the test↔parameter mapping upload. This mirrors the output
 * of the data-variator export (Test ID, Parameter ID, plus human-readable
 * names for reference). Only the two ID columns are used when importing — the
 * name columns are informational so the file stays human-auditable.
 */
export const MAPPING_XLSX_HEADERS = [
  'Test ID',
  'Parameter ID',
  'Test Name',
  'parameter_name',
] as const;

export interface MappingPair {
  testCode: string;
  parameterCode: string;
  /** Informational only — carried through for the preview, ignored when mapping. */
  testName?: string;
  parameterName?: string;
}

export interface ParsedMappingResult {
  pairs: MappingPair[];
  /** Total data rows seen in the sheet. */
  totalRows: number;
  /** Rows skipped because they lacked a Test ID or Parameter ID. */
  skippedRows: number;
}

/** Pull the first column whose normalised header matches one of `keys`. */
function pickField(r: Record<string, unknown>, keys: string[]): string {
  for (const k of Object.keys(r)) {
    if (keys.includes(k.trim().toLowerCase())) {
      const v = toStr(r[k]);
      if (v) return v;
    }
  }
  return '';
}

/**
 * Parse a test↔parameter mapping file (.xlsx or .csv). Matches are made later
 * by code, so this only extracts the Test ID / Parameter ID pair from each row.
 * Header matching is lenient (ID or Code, with/without spaces).
 */
export async function parseMappingXlsx(file: File): Promise<ParsedMappingResult> {
  const buf = await file.arrayBuffer();
  const wb = XLSX.read(buf, { type: 'array' });
  const sheetName = wb.SheetNames[0];
  const ws = wb.Sheets[sheetName];
  const rows = XLSX.utils.sheet_to_json<Record<string, unknown>>(ws, { defval: '' });

  const pairs: MappingPair[] = [];
  let skippedRows = 0;
  for (const r of rows) {
    const testCode = pickField(r, ['test id', 'test code', 'testid', 'testcode']);
    const parameterCode = pickField(r, [
      'parameter id',
      'parameter code',
      'parameterid',
      'parametercode',
      'param id',
      'param code',
    ]);
    if (!testCode || !parameterCode) {
      skippedRows += 1;
      continue;
    }
    const testName = pickField(r, ['test name', 'testname']);
    const parameterName = pickField(r, [
      'parameter_name',
      'parameter name',
      'parametername',
      'param name',
    ]);
    pairs.push({ testCode, parameterCode, testName, parameterName });
  }

  return { pairs, totalRows: rows.length, skippedRows };
}

/**
 * Sample mapping that lines up with the app's seeded library parameters and
 * tests (codes such as `BIO_GLU_F` / `PR_CREAT`). Used only by the prototype
 * helper section so the upload flow can be demoed against the default seed.
 */
export const SEEDED_SAMPLE_MAPPING: MappingPair[] = [
  { testCode: 'BIO_GLU_F', parameterCode: 'PR_CREAT', testName: 'Glucose Fasting', parameterName: 'Creatinine' },
  { testCode: 'BIO_DIA_PAN', parameterCode: 'PR_CREAT', testName: 'Diabetes Panel', parameterName: 'Creatinine' },
  { testCode: 'BIO_DIA_PAN', parameterCode: 'PR_HB', testName: 'Diabetes Panel', parameterName: 'Hemoglobin' },
  { testCode: 'HEM_CBC', parameterCode: 'PR_NOTES', testName: 'Complete Blood Count', parameterName: 'Impression' },
  { testCode: 'BIO_LFT', parameterCode: 'PR_NOTES', testName: 'Liver Function Test', parameterName: 'Impression' },
  { testCode: 'PATH_URE', parameterCode: 'PR_NOTES', testName: 'Urine Routine', parameterName: 'Impression' },
  { testCode: 'BIO_GLU_F', parameterCode: 'PR_GLU', testName: 'Glucose Fasting', parameterName: 'Glucose (already mapped)' },
];

function mappingRowsToSheet(pairs: MappingPair[]) {
  return pairs.map((r) => ({
    'Test ID': r.testCode,
    'Parameter ID': r.parameterCode,
    'Test Name': r.testName ?? '',
    parameter_name: r.parameterName ?? '',
  }));
}

/** Download the seeded sample as an .xlsx (prototype-only helper). */
export function downloadSeededSampleMapping() {
  const ws = XLSX.utils.json_to_sheet(mappingRowsToSheet(SEEDED_SAMPLE_MAPPING), {
    header: [...MAPPING_XLSX_HEADERS],
  });
  const wb = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(wb, ws, 'Mapping');
  XLSX.writeFile(wb, 'seeded-sample-mapping.xlsx');
}

export function downloadMappingTemplate() {
  const sample = [
    {
      'Test ID': 'T0044',
      'Parameter ID': 'P0001',
      'Test Name': 'Acute Leukemia Reflex Panel',
      parameter_name: 'Acute Leukemia Panel + Karyotyping',
    },
    {
      'Test ID': 'T0071',
      'Parameter ID': 'P0002',
      'Test Name': 'ALL Comprehensive Panel 1',
      parameter_name: 'Karyotype - Bone Marrow',
    },
    {
      'Test ID': 'T0071',
      'Parameter ID': 'P0003',
      'Test Name': 'ALL Comprehensive Panel 1',
      parameter_name: 'PCR BCR-ABL1 Qualitative',
    },
  ];
  const ws = XLSX.utils.json_to_sheet(sample, { header: [...MAPPING_XLSX_HEADERS] });
  const wb = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(wb, ws, 'Mapping');
  XLSX.writeFile(wb, 'test-parameter-mapping-template.xlsx');
}

function truthy(v: unknown): boolean {
  if (typeof v === 'boolean') return v;
  if (typeof v === 'number') return v !== 0;
  if (typeof v === 'string') {
    const s = v.trim().toLowerCase();
    return s === 'yes' || s === 'y' || s === 'true' || s === '1' || s === 'active';
  }
  // Missing / null / unknown columns default to false (an absent flag column
  // must NOT silently turn every boolean field on).
  return false;
}

function toStr(v: unknown): string {
  if (v === null || v === undefined) return '';
  return String(v).trim();
}

function parseTestValidationStatus(v: unknown): TestValidationStatus {
  const s = toStr(v).toLowerCase();
  if (s === 'verified') return 'Verified';
  if (s === 'pending') return 'Pending';
  return 'Unverified';
}

function toNum(v: unknown): number | null {
  if (v === null || v === undefined || v === '') return null;
  const n = Number(v);
  return Number.isFinite(n) ? n : null;
}

export interface ParsedTestsResult {
  rows: Omit<Test, 'id'>[];
  departmentNames: string[];
  sampleTypeNames: string[];
}

export function parseTestRowFromExcel(
  r: Record<string, unknown>,
): Omit<Test, 'id'> & { _departmentName: string; _sampleTypeName: string } {
  const d = defaultTestRowWithoutId();
  const dept = toStr(r['Department']);
  const sample = toStr(r['Sample Type']);
  const testPrice = toNum(r['Test Price']);
  const defaultPriceLegacy = toNum(r['Default Price']);
  const valActiveStr = toStr(r['Validated Active']);
  const legacyActiveStr = toStr(r['Active']);
  const validatedActive =
    valActiveStr !== ''
      ? truthy(r['Validated Active'])
      : legacyActiveStr !== ''
        ? truthy(r['Active'])
        : d.validatedActive;
  const statusCol = toStr(r['Status']);
  return {
    ...d,
    code: toStr(r['Test Code']),
    name: toStr(r['Test Name']),
    shortName: toStr(r['Short Name']) || toStr(r['Short Text']),
    multiSample: truthy(r['Multi Sample']),
    integrationCode: toStr(r['Integration Code']),
    procedureCode: toStr(r['Procedure Code']),
    loincCode: toStr(r['LOINC Code']),
    testType: toStr(r['Test Type']),
    icdToPin: toStr(r['ICD(s) TO PIN']),
    autoAddIcd: truthy(r['Auto-add ICD']),
    departmentId: null,
    sampleTypeId: null,
    category: toStr(r['Test Category']) || toStr(r['Category']),
    defaultPrice: testPrice ?? defaultPriceLegacy,
    testPrice2: toNum(r['Test Price 2']),
    minimumSellingPrice: toNum(r['Minimum Selling Price']),
    costOfTest: toNum(r['Cost Of Test']),
    revenueCap: toNum(r['Revenue Cap']),
    previousTestOrderCheck: toStr(r['Previous Test Order Check']),
    actionOnRepeatTest: toStr(r['Action on Repeat Test']),
    outsourceCenter: toStr(r['Outsource Center']),
    genderBasedTest: toStr(r['Gender Based Test']) || d.genderBasedTest,
    analyticalTatDays: toNum(r['Analytical TAT Days']),
    analyticalTatHours: toNum(r['Analytical TAT Hours']),
    analyticalTatMinutes: toNum(r['Analytical TAT Minutes']),
    sampleProcess: toStr(r['Sample Process']),
    description: toStr(r['Description']),
    descriptionAdvanceEditor: truthy(r['Description Advance Editor']),
    testInstructions: toStr(r['Test Instructions']),
    validationStatus: statusCol ? parseTestValidationStatus(r['Status']) : d.validationStatus,
    validatedActive,
    tat: toStr(r['TAT']),
    remarks: toStr(r['Remarks']),
    billOnlyTest: truthy(r['Bill Only Test']),
    printPriorityNA: truthy(r['Print Priority N/A']),
    cap: truthy(r['CAP']),
    testContainsGraph: truthy(r['This test contains graph']),
    enableDeviceFlags: truthy(r['Enable Device Flags']),
    showDeviceExtraDataInPdf: truthy(r['Show Device Extra Data in PDF']),
    maskThisReport: truthy(r['Mask this report']),
    hideTrendsReport: truthy(r['Hide trends report']),
    noReportToPatient: truthy(r['No report to patient']),
    outsourcedTest: truthy(r['Outsourced Test']),
    nonInsuranceService: truthy(r['Non Insurance Service']),
    nablTests: truthy(r['NABL Tests']),
    discardDiscount: truthy(r['Discard Discount']),
    testHasInvestigations: truthy(r['This test has investigations']),
    multiUnit: truthy(r['Multi Unit']),
    cellCounter: truthy(r['Cell Counter']),
    allowEditInWord: truthy(r['Allow editing in Word']),
    linearityCheck: truthy(r['Linearity Check']),
    deltaCheck: truthy(r['Delta Check']),
    _departmentName: dept,
    _sampleTypeName: sample,
  };
}

export async function parseTestsXlsx(file: File): Promise<ParsedTestsResult> {
  const buf = await file.arrayBuffer();
  const wb = XLSX.read(buf, { type: 'array' });
  const sheetName = wb.SheetNames[0];
  const ws = wb.Sheets[sheetName];
  const rows = XLSX.utils.sheet_to_json<Record<string, unknown>>(ws, { defval: '' });

  const departmentNames = new Set<string>();
  const sampleTypeNames = new Set<string>();

  const parsed: Omit<Test, 'id'>[] = rows
    .map((r) => {
      const row = parseTestRowFromExcel(r);
      if (row._departmentName) departmentNames.add(row._departmentName);
      if (row._sampleTypeName) sampleTypeNames.add(row._sampleTypeName);
      return row;
    })
    .filter((r) => r.code || r.name);

  return {
    rows: parsed,
    departmentNames: Array.from(departmentNames),
    sampleTypeNames: Array.from(sampleTypeNames),
  };
}

function normaliseParamType(v: string): ParameterType {
  const s = v.trim().toLowerCase();
  // Match by enum id or user-facing label
  for (const t of PARAMETER_TYPES) {
    if (t.toLowerCase() === s) return t;
    if (PARAMETER_TYPE_LABELS[t].toLowerCase() === s) return t;
  }
  if (s.startsWith('normal')) return 'TestWithNormalRange';
  if (s.startsWith('age')) return 'TestWithAgeSpecificRange';
  if (s.startsWith('desc') && s.includes('no')) return 'DescriptiveNoRanges';
  if (s.startsWith('desc')) return 'TestWithDescriptiveRange';
  if (s.startsWith('list') || s.startsWith('qual') || s.startsWith('cat')) return 'ListField';
  if (s.startsWith('file')) return 'File';
  if (s.startsWith('graph')) return 'Graph';
  if (s.startsWith('image')) return 'Image';
  // Legacy
  if (s.startsWith('numeric') || s.startsWith('semi')) return 'TestWithNormalRange';
  if (s.startsWith('text') || s.startsWith('narr')) return 'DescriptiveNoRanges';
  if (s.startsWith('calc') || s.startsWith('deriv')) return 'DescriptiveNoRanges';
  return 'TestWithNormalRange';
}

function normaliseCategory(v: string): ParameterCategory {
  const s = v.trim().toLowerCase();
  for (const c of PARAMETER_CATEGORIES) {
    if (c.toLowerCase() === s) return c;
  }
  return 'Pathology';
}

function normaliseAgeUnit(v: string): AgeUnit {
  const s = v.trim().toLowerCase();
  if (s.startsWith('day')) return 'Days';
  if (s.startsWith('mon')) return 'Months';
  return 'Years';
}

/**
 * Build one age-specific range from a sheet row. The M/F bounds are read from
 * the SAME columns a normal-range parameter uses (Male/Female Lower/Upper
 * Range) — what makes the row "age-specific" is the populated age band. Aliases
 * for the data-export header style (lowerAge/upperAge, Lower Range (M), …) are
 * also accepted so files from either source import cleanly.
 */
function ageRangeFromRow(r: Record<string, unknown>, isDefault: boolean): AgeRange {
  const unit = pickField(r, ['age unit', 'ageunit', 'default age unit']);
  return defaultAgeRange({
    isDefault,
    // Exports give age limits in days with no unit column → default to Days.
    ageUnit: unit ? normaliseAgeUnit(unit) : 'Days',
    lowerAge: pickField(r, [
      'lower age (in days)',
      'lower age limit',
      'lowerage',
      'default age lower',
    ]),
    upperAge: pickField(r, [
      'upper age (in days)',
      'upper age limit',
      'upperage',
      'default age upper',
    ]),
    lowerMale: pickField(r, ['male lower range', 'lower range (m)', 'lowerboundmale', 'default age lower male']),
    upperMale: pickField(r, ['male upper range', 'upper range (m)', 'upperboundmale', 'default age upper male']),
    lowerFemale: pickField(r, ['female lower range', 'lower range (f)', 'lowerboundfemale', 'default age lower female']),
    upperFemale: pickField(r, ['female upper range', 'upper range (f)', 'upperboundfemale', 'default age upper female']),
    descriptiveMale: pickField(r, ['descriptive male', 'default descriptive range (m)']),
    descriptiveFemale: pickField(r, ['descriptive female', 'default descriptive range (f)']),
  });
}

function ageRangeHasValue(r: AgeRange): boolean {
  return !!(
    r.lowerAge || r.upperAge || r.lowerMale || r.upperMale ||
    r.lowerFemale || r.upperFemale || r.descriptiveMale || r.descriptiveFemale
  );
}

/**
 * Group consecutive rows that belong to the same parameter. Age-specific
 * parameters repeat their identity (code/name) across one row per age band;
 * a row with no identity is treated as a continuation of the previous one.
 */
function groupParameterRows(
  rows: Record<string, unknown>[],
): Record<string, unknown>[][] {
  const groups: Record<string, unknown>[][] = [];
  let lastKey: string | null = null;
  for (const r of rows) {
    // Group by the most-specific SHARED identity. Age bands in real exports
    // repeat the Integration Code (or Parameter Code) while giving each band a
    // unique row id, so labParameterId is only a last resort.
    const code = pickField(r, ['parameter code']);
    const integration = pickField(r, ['integration code']);
    const name = pickField(r, ['parameter name', 'parameter_name']);
    const labId = pickField(r, ['labparameterid', 'parameter id']);
    const key = (code || integration || name || labId).trim().toLowerCase();
    if (!key) {
      if (groups.length) groups[groups.length - 1].push(r);
      continue;
    }
    if (key === lastKey && groups.length) {
      groups[groups.length - 1].push(r);
    } else {
      groups.push([r]);
      lastKey = key;
    }
  }
  return groups;
}

export async function parseParametersXlsx(file: File): Promise<Omit<Parameter, 'id'>[]> {
  const buf = await file.arrayBuffer();
  const wb = XLSX.read(buf, { type: 'array' });
  const sheetName = wb.SheetNames[0];
  const ws = wb.Sheets[sheetName];
  const rows = XLSX.utils.sheet_to_json<Record<string, unknown>>(ws, { defval: '' });

  const isLegacy = rows.length > 0 && ('Display Name' in rows[0] || 'Allowed Values' in rows[0]);

  if (isLegacy) {
    return rows
      .map((r) => {
        const d = defaultParameterRowWithoutId();
        const type = normaliseParamType(toStr(r['Parameter Type']));
        // Legacy template format — map best-effort into new shape
        const normalRange = toStr(r['Normal Range']);
        const [lowerStr = '', upperStr = ''] = normalRange.split(/[-–]/).map((s) => s.trim());
        const allowedValues = toStr(r['Allowed Values']);
        const criticalLow = toStr(r['Critical Low']);
        const criticalHigh = toStr(r['Critical High']);
        return {
          ...d,
          code: toStr(r['Parameter Code']),
          name: toStr(r['Parameter Name']) || toStr(r['Display Name']),
          category: 'Pathology' as ParameterCategory,
          type,
          unit: toStr(r['Unit']),
          maleLowerRange: lowerStr,
          maleUpperRange: upperStr,
          femaleLowerRange: lowerStr,
          femaleUpperRange: upperStr,
          criticalLowMale: criticalLow,
          criticalHighMale: criticalHigh,
          criticalLowFemale: criticalLow,
          criticalHighFemale: criticalHigh,
          listValues: allowedValues,
          formula: toStr(r['Formula']),
          descriptive: toStr(r['Interpretation']),
        };
      })
      .filter((r) => r.code || r.name);
  }

  // Standard format: one parameter per group of rows. Age-specific parameters
  // span multiple rows (one per age band); everything else is a single row.
  return groupParameterRows(rows)
    .map((group) => {
      const head = group[0];
      const d = defaultParameterRowWithoutId();
      const type = normaliseParamType(toStr(head['Parameter Type']));
      const isAgeSpecific = type === 'TestWithAgeSpecificRange';

      const ageRanges = isAgeSpecific
        ? group.map((r, i) => ageRangeFromRow(r, i === 0)).filter(ageRangeHasValue)
        : [];

      return {
        ...d,
        code: toStr(head['Parameter Code']),
        name: toStr(head['Parameter Name']),
        category: normaliseCategory(toStr(head['Category'])),
        type,
        unit: toStr(head['Unit']),
        method: toStr(head['Method']),
        integrationCode: toStr(head['Integration Code']),
        loincCode: toStr(head['LOINC Code']),
        dictionary: toStr(head['Dictionary']),
        linkedParameters: toStr(head['Linked Parameters']),
        // For age-specific rows the bounds live in `ageRanges`; the top-level
        // normal-range fields stay empty so they don't double up.
        maleLowerRange: isAgeSpecific ? '' : toStr(head['Male Lower Range']),
        maleUpperRange: isAgeSpecific ? '' : toStr(head['Male Upper Range']),
        femaleLowerRange: isAgeSpecific ? '' : toStr(head['Female Lower Range']),
        femaleUpperRange: isAgeSpecific ? '' : toStr(head['Female Upper Range']),
        defaultDescription: pickField(head, ['default description']),
        descriptiveMale: isAgeSpecific ? '' : toStr(head['Descriptive Male']),
        descriptiveFemale: isAgeSpecific ? '' : toStr(head['Descriptive Female']),
        descriptiveMaleAdvanceEditor: truthy(head['Descriptive Male Advance Editor']),
        descriptiveFemaleAdvanceEditor: truthy(head['Descriptive Female Advance Editor']),
        ageRanges,
        descriptive: toStr(head['Descriptive']),
        descriptiveAdvanceEditor: truthy(head['Descriptive Advance Editor']),
        breakLine: truthy(head['Break line']),
        obxSegments: truthy(head['OBX Segments']),
        listValues: pickField(head, ['list values']),
        listMarkAsCritical: truthy(head['List Mark As Critical']),
        listHighlight: truthy(head['List Highlight']),
        criticalLowMale: toStr(head['Critical Low Male']),
        criticalHighMale: toStr(head['Critical High Male']),
        criticalLowFemale: toStr(head['Critical Low Female']),
        criticalHighFemale: toStr(head['Critical High Female']),
        formulaPreset: toStr(head['Formula Preset']),
        formula: toStr(head['Formula']),
        rerunAuto: truthy(head['Auto Rerun']),
        rerunManual:
          truthy(head['Manual Rerun']) ||
          !!toStr(head['Rerun Instructions']).trim(),
        hideParameter: truthy(head['Hide Parameter']),
        customizedParameter: truthy(head['Customized Parameter']),
        highlightThisValue: truthy(head['Highlight this value']),
        underlineThisValue: truthy(head['Underline this value']),
        optionalField: truthy(head['Optional field']),
        hasImpressions: truthy(head['Has Impressions']),
        hideParameterTrends: truthy(head['Hide Parameter Trends']),
      };
    })
    .filter((r) => r.code || r.name);
}

export function freshTestId() {
  return uid('tst');
}
export function freshParamId() {
  return uid('par');
}

// ─── Bulk download / export ──────────────────────────────────────────────────

/**
 * Flat parameter list: one row per library parameter. Age-specific parameters
 * expand into one row per age band (mirrors the import format).
 */
export function downloadFlatParameterList(parameters: Parameter[]) {
  const library = parameters.filter((p) => !p.isTestLevel && !p.disabled);
  const rows: Record<string, string | number>[] = [];

  let seq = 1;
  for (const p of library) {
    const baseRow = (over: Record<string, string | number> = {}) =>
      paramSampleRow({
        labParameterId: `P${String(seq).padStart(4, '0')}`,
        'Parameter Name': p.name,
        'Parameter Type': PARAMETER_TYPE_LABELS[p.type],
        'Parameter Code': p.code,
        'Integration Code': p.integrationCode,
        Unit: p.unit,
        'Default Description': p.defaultDescription,
        Method: p.method,
        'Critical Low Male': p.criticalLowMale,
        'Critical High Male': p.criticalHighMale,
        'Critical Low Female': p.criticalLowFemale,
        'Critical High Female': p.criticalHighFemale,
        ...over,
      });

    if (p.type === 'TestWithAgeSpecificRange' && p.ageRanges.length > 0) {
      p.ageRanges.forEach((r) => {
        rows.push(
          baseRow({
            'Lower Age (in days)': r.lowerAge,
            'Upper Age (in days)': r.upperAge,
            'Male Lower Range': r.lowerMale,
            'Male Upper Range': r.upperMale,
            'Female Lower Range': r.lowerFemale,
            'Female Upper Range': r.upperFemale,
            'Descriptive Male': r.descriptiveMale,
            'Descriptive Female': r.descriptiveFemale,
          }),
        );
        seq += 1;
      });
    } else {
      rows.push(
        baseRow({
          'Male Lower Range': p.maleLowerRange,
          'Male Upper Range': p.maleUpperRange,
          'Female Lower Range': p.femaleLowerRange,
          'Female Upper Range': p.femaleUpperRange,
          'Descriptive Male': p.descriptiveMale,
          'Descriptive Female': p.descriptiveFemale,
          'List values': p.listValues,
        }),
      );
      seq += 1;
    }
  }

  const ws = XLSX.utils.json_to_sheet(rows, { header: [...PARAM_XLSX_HEADERS] });
  const wb = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(wb, ws, 'Parameters');
  XLSX.writeFile(wb, 'parameters-flat.xlsx');
}

/** Test-wise parameter list: one row per (test, parameter) mapping. */
export function downloadTestWiseParameters(
  tests: Test[],
  parameters: Parameter[],
  mappings: { testId: string; parameterId: string; sequence: number }[],
) {
  const testById = new Map(tests.map((t) => [t.id, t] as const));
  const paramById = new Map(parameters.map((p) => [p.id, p] as const));

  const rows = [...mappings]
    .sort((a, b) => a.testId.localeCompare(b.testId) || a.sequence - b.sequence)
    .map((m) => {
      const t = testById.get(m.testId);
      const child = paramById.get(m.parameterId);
      const lib = child?.sourceLibraryParameterId
        ? paramById.get(child.sourceLibraryParameterId)
        : child;
      return {
        'Test Code': t?.code ?? '',
        'Test Name': t?.name ?? '',
        'Parameter Code': lib?.code ?? child?.code ?? '',
        'Parameter Name': lib?.name ?? child?.name ?? '',
        'Parameter Type': child ? PARAMETER_TYPE_LABELS[child.type] : '',
        Unit: child?.unit ?? '',
        Sequence: m.sequence,
      };
    });

  const ws = XLSX.utils.json_to_sheet(rows, {
    header: [
      'Test Code',
      'Test Name',
      'Parameter Code',
      'Parameter Name',
      'Parameter Type',
      'Unit',
      'Sequence',
    ],
  });
  const wb = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(wb, ws, 'Test-wise Parameters');
  XLSX.writeFile(wb, 'parameters-test-wise.xlsx');
}
