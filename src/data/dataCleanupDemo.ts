export type IssueSeverity = "blocker" | "warning" | "unclear";

export type CleanupStep = "upload" | "sheetPreview";

export type ErrorScope = "department" | "test" | "parameter" | "mapping";

export type SheetTab = "test" | "parameter" | "mapping";

export const EXPECTED_UPLOAD_FILES = [
  "Test Master.xlsx",
  "Parameter Master.xlsx",
  "Reference Range.xlsx",
] as const;

export const TOTAL_ISSUES_FOUND = 28;

export interface CorrectnessCheck {
  id: string;
  label: string;
}

export const FILE_CORRECTNESS_CHECKS: CorrectnessCheck[] = [
  { id: "files", label: "Required files uploaded" },
  { id: "test-sheets", label: "Test Master — sheets detected" },
  { id: "param-sheets", label: "Parameter Master — sheets detected" },
  { id: "range-sheets", label: "Reference Range — sheets detected" },
];

export interface FixSuggestion {
  id: string;
  scope: ErrorScope;
  field: string;
  severity: IssueSeverity;
  current: string;
  suggested: string;
  resolvedCount: number;
}

export const FIX_SUGGESTIONS: FixSuggestion[] = [
  {
    id: "fix-dept-biochem",
    scope: "department",
    field: "Department",
    severity: "unclear",
    current: "Biochem",
    suggested: "Biochemistry",
    resolvedCount: 3,
  },
  {
    id: "fix-sample-ser",
    scope: "test",
    field: "Sample type",
    severity: "unclear",
    current: "SER",
    suggested: "Serum",
    resolvedCount: 2,
  },
  {
    id: "fix-code-hba1c",
    scope: "test",
    field: "Test code",
    severity: "unclear",
    current: "HBA1C",
    suggested: "HbA1c",
    resolvedCount: 1,
  },
  {
    id: "fix-name-cbc",
    scope: "test",
    field: "Test name",
    severity: "warning",
    current: "CBC Profile",
    suggested: "CBC",
    resolvedCount: 2,
  },
  {
    id: "fix-dept-empty",
    scope: "department",
    field: "Department",
    severity: "blocker",
    current: "—",
    suggested: "Biochemistry",
    resolvedCount: 4,
  },
  {
    id: "fix-mapping-creatinine",
    scope: "mapping",
    field: "Mapping",
    severity: "blocker",
    current: "Unlinked",
    suggested: "Link to Creatinine test",
    resolvedCount: 3,
  },
  {
    id: "fix-sample-wb",
    scope: "test",
    field: "Sample type",
    severity: "unclear",
    current: "WB",
    suggested: "Whole Blood",
    resolvedCount: 2,
  },
  {
    id: "fix-param-sgot",
    scope: "parameter",
    field: "Parameter name",
    severity: "warning",
    current: "SGOT",
    suggested: "AST",
    resolvedCount: 5,
  },
  {
    id: "fix-ref-hgb",
    scope: "parameter",
    field: "Ref range",
    severity: "warning",
    current: "12-16",
    suggested: "12–16",
    resolvedCount: 2,
  },
  {
    id: "fix-ref-wbc",
    scope: "parameter",
    field: "Ref range",
    severity: "warning",
    current: "4.5-11.0",
    suggested: "4.5–11.0",
    resolvedCount: 2,
  },
  {
    id: "fix-ref-tsh-missing",
    scope: "parameter",
    field: "Ref range",
    severity: "blocker",
    current: "—",
    suggested: "0.4–4.0",
    resolvedCount: 3,
  },
  {
    id: "fix-age-hgb",
    scope: "parameter",
    field: "Age-based ranges",
    severity: "blocker",
    current: "Missing",
    suggested: "2 brackets (Adult + Child)",
    resolvedCount: 4,
  },
  {
    id: "fix-age-wbc",
    scope: "parameter",
    field: "Age-based ranges",
    severity: "blocker",
    current: "Missing",
    suggested: "2 brackets (Adult + Child)",
    resolvedCount: 4,
  },
  {
    id: "fix-age-creat",
    scope: "parameter",
    field: "Age-based ranges",
    severity: "blocker",
    current: "Missing",
    suggested: "2 brackets (Adult + Child)",
    resolvedCount: 3,
  },
  {
    id: "fix-age-sgot",
    scope: "parameter",
    field: "Age-based ranges",
    severity: "blocker",
    current: "Missing",
    suggested: "2 brackets (Adult + Child)",
    resolvedCount: 3,
  },
  {
    id: "fix-age-tsh",
    scope: "parameter",
    field: "Age-based ranges",
    severity: "blocker",
    current: "Missing",
    suggested: "2 brackets (Adult + Child)",
    resolvedCount: 3,
  },
];

export type UnifiedColumnKey =
  | "testCode"
  | "testName"
  | "department"
  | "sampleType"
  | "parameter"
  | "parameterCode"
  | "unit"
  | "refRange"
  | "mappingLink";

export type ParameterColumnKey =
  | "parameter"
  | "parameterCode"
  | "unit"
  | "refRange"
  | "ageDefault"
  | "ageUnit"
  | "lowerAge"
  | "upperAge"
  | "lowerRangeM"
  | "upperRangeM"
  | "lowerRangeF"
  | "upperRangeF";

export type SheetColumnKey = UnifiedColumnKey | ParameterColumnKey;

export interface SheetColumn {
  key: UnifiedColumnKey;
  label: string;
}

export interface ParameterSheetColumn {
  key: ParameterColumnKey;
  label: string;
  group: "parameter" | "age";
}

export const PARAMETER_SHEET_COLUMNS: ParameterSheetColumn[] = [
  { key: "parameter", label: "Parameter Name", group: "parameter" },
  { key: "parameterCode", label: "Parameter Code", group: "parameter" },
  { key: "unit", label: "Unit", group: "parameter" },
  { key: "refRange", label: "Ref Range", group: "parameter" },
  { key: "ageDefault", label: "Default", group: "age" },
  { key: "ageUnit", label: "Unit", group: "age" },
  { key: "lowerAge", label: "Lower Age", group: "age" },
  { key: "upperAge", label: "Upper Age", group: "age" },
  { key: "lowerRangeM", label: "Low (M)", group: "age" },
  { key: "upperRangeM", label: "High (M)", group: "age" },
  { key: "lowerRangeF", label: "Low (F)", group: "age" },
  { key: "upperRangeF", label: "High (F)", group: "age" },
];

export const SHEET_TAB_COLUMNS: Record<Exclude<SheetTab, "parameter">, SheetColumn[]> = {
  test: [
    { key: "testCode", label: "Test Code" },
    { key: "testName", label: "Test Name" },
    { key: "department", label: "Department" },
    { key: "sampleType", label: "Sample Type" },
  ],
  mapping: [
    { key: "testCode", label: "Test Code" },
    { key: "parameter", label: "Parameter" },
    { key: "mappingLink", label: "Mapping" },
  ],
};

export const SHEET_TAB_LABELS: Record<SheetTab, string> = {
  test: "Test",
  parameter: "Parameter",
  mapping: "Test–Parameter Mapping",
};

export const SHEET_TAB_ORDER: SheetTab[] = ["test", "parameter", "mapping"];

export interface UnifiedCell {
  value: string;
  fixId?: string;
}

export interface UnifiedDataRow {
  id: string;
  testCode: UnifiedCell;
  testName: UnifiedCell;
  department: UnifiedCell;
  sampleType: UnifiedCell;
  parameter: UnifiedCell;
  parameterCode: UnifiedCell;
  unit: UnifiedCell;
  refRange: UnifiedCell;
  mappingLink: UnifiedCell;
}

export interface AgeBracket {
  id: string;
  isDefault: boolean;
  ageUnit: string;
  lowerAge: string;
  upperAge: string;
  lowerRangeM: string;
  upperRangeM: string;
  lowerRangeF: string;
  upperRangeF: string;
}

export interface ParameterDefinition {
  id: string;
  parameter: UnifiedCell;
  parameterCode: UnifiedCell;
  unit: UnifiedCell;
  refRange: UnifiedCell;
  /** Existing brackets in uploaded data; empty when missing */
  ageBrackets: AgeBracket[];
  /** Applied when age ranges are missing and view is revised */
  suggestedAgeBrackets: AgeBracket[];
  missingAgeFixId?: string;
}

export const PARAMETER_DEFINITIONS: ParameterDefinition[] = [
  {
    id: "param-hgb",
    parameter: { value: "Haemoglobin" },
    parameterCode: { value: "HGB" },
    unit: { value: "g/dL" },
    refRange: { value: "12-16", fixId: "fix-ref-hgb" },
    ageBrackets: [],
    missingAgeFixId: "fix-age-hgb",
    suggestedAgeBrackets: [
      {
        id: "hgb-adult",
        isDefault: true,
        ageUnit: "Years",
        lowerAge: "18",
        upperAge: "120",
        lowerRangeM: "12",
        upperRangeM: "16",
        lowerRangeF: "12",
        upperRangeF: "16",
      },
      {
        id: "hgb-child",
        isDefault: false,
        ageUnit: "Years",
        lowerAge: "0",
        upperAge: "17",
        lowerRangeM: "11",
        upperRangeM: "14",
        lowerRangeF: "11",
        upperRangeF: "14",
      },
    ],
  },
  {
    id: "param-hba1c",
    parameter: { value: "HbA1c" },
    parameterCode: { value: "HBA1C" },
    unit: { value: "%" },
    refRange: { value: "4.0–5.6" },
    ageBrackets: [
      {
        id: "hba1c-adult",
        isDefault: true,
        ageUnit: "Years",
        lowerAge: "18",
        upperAge: "120",
        lowerRangeM: "4.0",
        upperRangeM: "5.6",
        lowerRangeF: "4.0",
        upperRangeF: "5.6",
      },
    ],
    suggestedAgeBrackets: [],
  },
  {
    id: "param-sgot",
    parameter: { value: "SGOT", fixId: "fix-param-sgot" },
    parameterCode: { value: "SGOT" },
    unit: { value: "U/L" },
    refRange: { value: "5–40" },
    ageBrackets: [],
    missingAgeFixId: "fix-age-sgot",
    suggestedAgeBrackets: [
      {
        id: "sgot-adult",
        isDefault: true,
        ageUnit: "Years",
        lowerAge: "18",
        upperAge: "120",
        lowerRangeM: "5",
        upperRangeM: "40",
        lowerRangeF: "5",
        upperRangeF: "40",
      },
      {
        id: "sgot-child",
        isDefault: false,
        ageUnit: "Years",
        lowerAge: "0",
        upperAge: "17",
        lowerRangeM: "10",
        upperRangeM: "55",
        lowerRangeF: "10",
        upperRangeF: "55",
      },
    ],
  },
  {
    id: "param-creat",
    parameter: { value: "Creatinine" },
    parameterCode: { value: "CREAT" },
    unit: { value: "mg/dL" },
    refRange: { value: "0.6–1.2" },
    ageBrackets: [],
    missingAgeFixId: "fix-age-creat",
    suggestedAgeBrackets: [
      {
        id: "creat-adult",
        isDefault: true,
        ageUnit: "Years",
        lowerAge: "18",
        upperAge: "120",
        lowerRangeM: "0.6",
        upperRangeM: "1.2",
        lowerRangeF: "0.5",
        upperRangeF: "1.1",
      },
      {
        id: "creat-child",
        isDefault: false,
        ageUnit: "Years",
        lowerAge: "0",
        upperAge: "17",
        lowerRangeM: "0.3",
        upperRangeM: "0.7",
        lowerRangeF: "0.3",
        upperRangeF: "0.7",
      },
    ],
  },
  {
    id: "param-tsh",
    parameter: { value: "TSH" },
    parameterCode: { value: "TSH" },
    unit: { value: "mIU/L" },
    refRange: { value: "—", fixId: "fix-ref-tsh-missing" },
    ageBrackets: [],
    missingAgeFixId: "fix-age-tsh",
    suggestedAgeBrackets: [
      {
        id: "tsh-adult",
        isDefault: true,
        ageUnit: "Years",
        lowerAge: "18",
        upperAge: "120",
        lowerRangeM: "0.4",
        upperRangeM: "4.0",
        lowerRangeF: "0.4",
        upperRangeF: "4.0",
      },
      {
        id: "tsh-child",
        isDefault: false,
        ageUnit: "Years",
        lowerAge: "0",
        upperAge: "17",
        lowerRangeM: "0.7",
        upperRangeM: "6.4",
        lowerRangeF: "0.7",
        upperRangeF: "6.4",
      },
    ],
  },
  {
    id: "param-glu",
    parameter: { value: "Glucose" },
    parameterCode: { value: "GLU" },
    unit: { value: "mg/dL" },
    refRange: { value: "70–100" },
    ageBrackets: [
      {
        id: "glu-adult",
        isDefault: true,
        ageUnit: "Years",
        lowerAge: "18",
        upperAge: "120",
        lowerRangeM: "70",
        upperRangeM: "100",
        lowerRangeF: "70",
        upperRangeF: "100",
      },
    ],
    suggestedAgeBrackets: [],
  },
  {
    id: "param-sgpt",
    parameter: { value: "SGPT" },
    parameterCode: { value: "SGPT" },
    unit: { value: "U/L" },
    refRange: { value: "7–56" },
    ageBrackets: [
      {
        id: "sgpt-adult",
        isDefault: true,
        ageUnit: "Years",
        lowerAge: "18",
        upperAge: "120",
        lowerRangeM: "7",
        upperRangeM: "56",
        lowerRangeF: "7",
        upperRangeF: "56",
      },
    ],
    suggestedAgeBrackets: [],
  },
  {
    id: "param-wbc",
    parameter: { value: "WBC" },
    parameterCode: { value: "WBC" },
    unit: { value: "10³/µL" },
    refRange: { value: "4.5-11.0", fixId: "fix-ref-wbc" },
    ageBrackets: [],
    missingAgeFixId: "fix-age-wbc",
    suggestedAgeBrackets: [
      {
        id: "wbc-adult",
        isDefault: true,
        ageUnit: "Years",
        lowerAge: "18",
        upperAge: "120",
        lowerRangeM: "4.5",
        upperRangeM: "11.0",
        lowerRangeF: "4.5",
        upperRangeF: "11.0",
      },
      {
        id: "wbc-child",
        isDefault: false,
        ageUnit: "Years",
        lowerAge: "0",
        upperAge: "17",
        lowerRangeM: "5.0",
        upperRangeM: "13.0",
        lowerRangeF: "5.0",
        upperRangeF: "13.0",
      },
    ],
  },
];

export interface ParameterSheetRow {
  id: string;
  parameterId: string;
  isFirstOfParameter: boolean;
  cells: Record<ParameterColumnKey, CleanedCell>;
}

export const UNIFIED_DATA_ROWS: UnifiedDataRow[] = [
  {
    id: "row-1",
    testCode: { value: "CBC" },
    testName: { value: "CBC Profile", fixId: "fix-name-cbc" },
    department: { value: "Haematology" },
    sampleType: { value: "WB", fixId: "fix-sample-wb" },
    parameter: { value: "Haemoglobin" },
    parameterCode: { value: "HGB" },
    unit: { value: "g/dL" },
    refRange: { value: "12-16", fixId: "fix-ref-hgb" },
    mappingLink: { value: "Linked" },
  },
  {
    id: "row-2",
    testCode: { value: "HBA1C", fixId: "fix-code-hba1c" },
    testName: { value: "HbA1c" },
    department: { value: "Biochem", fixId: "fix-dept-biochem" },
    sampleType: { value: "SER", fixId: "fix-sample-ser" },
    parameter: { value: "HbA1c" },
    parameterCode: { value: "HBA1C" },
    unit: { value: "%" },
    refRange: { value: "4.0–5.6" },
    mappingLink: { value: "Linked" },
  },
  {
    id: "row-3",
    testCode: { value: "LFT" },
    testName: { value: "Liver Function Test" },
    department: { value: "Biochem", fixId: "fix-dept-biochem" },
    sampleType: { value: "SER", fixId: "fix-sample-ser" },
    parameter: { value: "SGOT", fixId: "fix-param-sgot" },
    parameterCode: { value: "SGOT" },
    unit: { value: "U/L" },
    refRange: { value: "5–40" },
    mappingLink: { value: "Linked" },
  },
  {
    id: "row-4",
    testCode: { value: "CREAT" },
    testName: { value: "Creatinine" },
    department: { value: "—", fixId: "fix-dept-empty" },
    sampleType: { value: "SER", fixId: "fix-sample-ser" },
    parameter: { value: "Creatinine" },
    parameterCode: { value: "CREAT" },
    unit: { value: "mg/dL" },
    refRange: { value: "0.6–1.2" },
    mappingLink: { value: "Unlinked", fixId: "fix-mapping-creatinine" },
  },
  {
    id: "row-5",
    testCode: { value: "TSH" },
    testName: { value: "TSH" },
    department: { value: "Endocrinology" },
    sampleType: { value: "SER", fixId: "fix-sample-ser" },
    parameter: { value: "TSH" },
    parameterCode: { value: "TSH" },
    unit: { value: "mIU/L" },
    refRange: { value: "—", fixId: "fix-ref-tsh-missing" },
    mappingLink: { value: "Linked" },
  },
  {
    id: "row-6",
    testCode: { value: "GLU" },
    testName: { value: "Glucose Fasting" },
    department: { value: "Biochem", fixId: "fix-dept-biochem" },
    sampleType: { value: "SER", fixId: "fix-sample-ser" },
    parameter: { value: "Glucose" },
    parameterCode: { value: "GLU" },
    unit: { value: "mg/dL" },
    refRange: { value: "70–100" },
    mappingLink: { value: "Linked" },
  },
  {
    id: "row-7",
    testCode: { value: "LFT" },
    testName: { value: "Liver Function Test" },
    department: { value: "Biochem", fixId: "fix-dept-biochem" },
    sampleType: { value: "SER", fixId: "fix-sample-ser" },
    parameter: { value: "SGPT" },
    parameterCode: { value: "SGPT" },
    unit: { value: "U/L" },
    refRange: { value: "7–56" },
    mappingLink: { value: "Linked" },
  },
  {
    id: "row-8",
    testCode: { value: "CBC" },
    testName: { value: "CBC Profile", fixId: "fix-name-cbc" },
    department: { value: "Haematology" },
    sampleType: { value: "WB", fixId: "fix-sample-wb" },
    parameter: { value: "WBC" },
    parameterCode: { value: "WBC" },
    unit: { value: "10³/µL" },
    refRange: { value: "4.5-11.0", fixId: "fix-ref-wbc" },
    mappingLink: { value: "Linked" },
  },
];

export interface CleanedCell {
  value: string;
  original: string;
  changed: boolean;
  fixId?: string;
}

export type UnifiedRowColumnKey = UnifiedColumnKey;

export interface CleanedRow {
  id: string;
  cells: Record<UnifiedRowColumnKey, CleanedCell>;
}

export interface SheetComment {
  fixId: string;
  fix: FixSuggestion;
  locations: { rowId: string; columnKey: SheetColumnKey }[];
}

const FIX_MAP = Object.fromEntries(FIX_SUGGESTIONS.map((f) => [f.id, f]));

export const EXPORT_FILES = [
  "Customer_Data_Cleaned.xlsx",
  "Data_Issues_Report.xlsx",
] as const;

export const CLEANUP_WORKBOOK_CHIP = "Customer_Data_Cleaned.xlsx";

function fixBelongsToTab(fix: FixSuggestion, tab: SheetTab): boolean {
  if (tab === "test") return fix.scope === "test" || fix.scope === "department";
  if (tab === "parameter") return fix.scope === "parameter";
  return fix.scope === "mapping";
}

export function fixesForTab(tab: SheetTab): FixSuggestion[] {
  return FIX_SUGGESTIONS.filter((fix) => fixBelongsToTab(fix, tab));
}

export function tabIssueCounts(): Record<SheetTab, number> {
  return {
    test: fixesForTab("test").length,
    parameter: fixesForTab("parameter").length,
    mapping: fixesForTab("mapping").length,
  };
}

function resolveCell(cell: UnifiedCell): CleanedCell {
  if (!cell.fixId) {
    return { value: cell.value, original: cell.value, changed: false };
  }
  const fix = FIX_MAP[cell.fixId];
  if (!fix) {
    return { value: cell.value, original: cell.value, changed: false };
  }
  return {
    value: fix.suggested,
    original: cell.value,
    changed: true,
    fixId: cell.fixId,
  };
}

export function buildCleanedRows(): CleanedRow[] {
  return UNIFIED_DATA_ROWS.map((row) => ({
    id: row.id,
    cells: {
      testCode: resolveCell(row.testCode),
      testName: resolveCell(row.testName),
      department: resolveCell(row.department),
      sampleType: resolveCell(row.sampleType),
      parameter: resolveCell(row.parameter),
      parameterCode: resolveCell(row.parameterCode),
      unit: resolveCell(row.unit),
      refRange: resolveCell(row.refRange),
      mappingLink: resolveCell(row.mappingLink),
    },
  }));
}

function cell(value: string, changed = false, fixId?: string): CleanedCell {
  return { value, original: value, changed, fixId };
}

function ageBracketCells(
  bracket: AgeBracket,
  options: { isNew: boolean; missingFixId?: string },
): Pick<
  Record<ParameterColumnKey, CleanedCell>,
  | "ageDefault"
  | "ageUnit"
  | "lowerAge"
  | "upperAge"
  | "lowerRangeM"
  | "upperRangeM"
  | "lowerRangeF"
  | "upperRangeF"
> {
  if (options.missingFixId) {
    const missing = cell("—", true, options.missingFixId);
    return {
      ageDefault: missing,
      ageUnit: missing,
      lowerAge: missing,
      upperAge: missing,
      lowerRangeM: missing,
      upperRangeM: missing,
      lowerRangeF: missing,
      upperRangeF: missing,
    };
  }

  const mk = (val: string) =>
    options.isNew
      ? { value: val, original: "—", changed: true }
      : cell(val);

  return {
    ageDefault: mk(bracket.isDefault ? "●" : ""),
    ageUnit: mk(bracket.ageUnit),
    lowerAge: mk(bracket.lowerAge),
    upperAge: mk(bracket.upperAge),
    lowerRangeM: mk(bracket.lowerRangeM),
    upperRangeM: mk(bracket.upperRangeM),
    lowerRangeF: mk(bracket.lowerRangeF),
    upperRangeF: mk(bracket.upperRangeF),
  };
}

export function buildParameterSheetRows(showRevised: boolean): ParameterSheetRow[] {
  const rows: ParameterSheetRow[] = [];

  for (const def of PARAMETER_DEFINITIONS) {
    const brackets =
      def.ageBrackets.length > 0
        ? def.ageBrackets
        : showRevised && def.suggestedAgeBrackets.length > 0
          ? def.suggestedAgeBrackets
          : null;

    const bracketList =
      brackets === null
        ? [null]
        : brackets;

    bracketList.forEach((bracket, idx) => {
      const isFirst = idx === 0;
      const rowId = bracket
        ? `${def.id}--${bracket.id}`
        : `${def.id}--missing`;

      const meta = {
        parameter: resolveCell(def.parameter),
        parameterCode: resolveCell(def.parameterCode),
        unit: resolveCell(def.unit),
        refRange: resolveCell(def.refRange),
      };

      const ageCells = bracket
        ? ageBracketCells(bracket, {
            isNew: def.ageBrackets.length === 0 && showRevised,
          })
        : ageBracketCells(
            {
              id: "placeholder",
              isDefault: false,
              ageUnit: "",
              lowerAge: "",
              upperAge: "",
              lowerRangeM: "",
              upperRangeM: "",
              lowerRangeF: "",
              upperRangeF: "",
            },
            { isNew: true, missingFixId: def.missingAgeFixId },
          );

      rows.push({
        id: rowId,
        parameterId: def.id,
        isFirstOfParameter: isFirst,
        cells: { ...meta, ...ageCells },
      });
    });
  }

  return rows;
}

export function parameterSheetComments(showRevised: boolean): SheetComment[] {
  const tabFixIds = new Set(fixesForTab("parameter").map((f) => f.id));
  const byFix = new Map<string, SheetComment["locations"]>();
  const sheetRows = buildParameterSheetRows(showRevised);

  for (const row of sheetRows) {
    for (const col of PARAMETER_SHEET_COLUMNS) {
      const cell = row.cells[col.key];
      if (cell.fixId && tabFixIds.has(cell.fixId)) {
        const locations = byFix.get(cell.fixId) ?? [];
        locations.push({ rowId: row.id, columnKey: col.key });
        byFix.set(cell.fixId, locations);
      }
    }
  }

  return fixesForTab("parameter")
    .filter((fix) => byFix.has(fix.id))
    .map((fix) => ({
      fixId: fix.id,
      fix,
      locations: byFix.get(fix.id) ?? [],
    }));
}

export function sheetRowsForTab(tab: SheetTab): CleanedRow[] {
  if (tab === "parameter") return [];
  return buildCleanedRows();
}

export function sheetCommentsForTab(tab: SheetTab, showRevised = false): SheetComment[] {
  if (tab === "parameter") return parameterSheetComments(showRevised);

  const tabFixIds = new Set(fixesForTab(tab).map((f) => f.id));
  const columns = SHEET_TAB_COLUMNS[tab];
  const tabColumnKeys = new Set<SheetColumnKey>(columns.map((c) => c.key));
  const byFix = new Map<string, SheetComment["locations"]>();

  for (const row of UNIFIED_DATA_ROWS) {
    for (const col of columns) {
      const cell = row[col.key as keyof UnifiedDataRow];
      if (
        cell &&
        typeof cell === "object" &&
        "fixId" in cell &&
        cell.fixId &&
        tabFixIds.has(cell.fixId)
      ) {
        const locations = byFix.get(cell.fixId) ?? [];
        locations.push({ rowId: row.id, columnKey: col.key });
        byFix.set(cell.fixId, locations);
      }
    }
  }

  return fixesForTab(tab)
    .filter((fix) => byFix.has(fix.id))
    .map((fix) => ({
      fixId: fix.id,
      fix,
      locations: (byFix.get(fix.id) ?? []).filter((loc) => tabColumnKeys.has(loc.columnKey)),
    }));
}

export function displayCellValue(cell: CleanedCell, showRevised: boolean): string {
  return showRevised ? cell.value : cell.original;
}

export const STEP_ORDER: CleanupStep[] = ["upload", "sheetPreview"];

export function stepIndex(step: CleanupStep): number {
  return STEP_ORDER.indexOf(step);
}
