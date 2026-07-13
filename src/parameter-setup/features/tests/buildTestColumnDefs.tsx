import type {
  ColDef,
  ColGroupDef,
  ICellRendererParams,
  ValueSetterParams,
} from 'ag-grid-community';
import type { LookupValue, Test } from '@/types';

const TEST_TYPE_OPTIONS = [
  '',
  'Pathology',
  'Biochemistry',
  'Hematology',
  'Microbiology',
  'Radiology',
  'Immunology',
  'Serology',
  'Other',
];

const GENDER_BASED_OPTIONS = ['', 'All', 'Male', 'Female', 'Other'];

const PIN_SELECT =
  'w-full h-7 min-h-[28px] text-[12px] rounded border border-slate-300 bg-white';

type BoolKey =
  | 'multiSample'
  | 'autoAddIcd'
  | 'descriptionAdvanceEditor'
  | 'billOnlyTest'
  | 'printPriorityNA'
  | 'cap'
  | 'testContainsGraph'
  | 'enableDeviceFlags'
  | 'showDeviceExtraDataInPdf'
  | 'maskThisReport'
  | 'hideTrendsReport'
  | 'noReportToPatient'
  | 'outsourcedTest'
  | 'nonInsuranceService'
  | 'nablTests'
  | 'discardDiscount'
  | 'testHasInvestigations'
  | 'multiUnit'
  | 'cellCounter'
  | 'allowEditInWord'
  | 'linearityCheck'
  | 'deltaCheck';

const BOOL_LABELS: Record<BoolKey, string> = {
  multiSample: 'Multi Sample',
  autoAddIcd: 'Auto-add ICD',
  descriptionAdvanceEditor: 'Description Advance Editor',
  billOnlyTest: 'Bill Only Test',
  printPriorityNA: 'Print Priority N/A',
  cap: 'CAP',
  testContainsGraph: 'This test contains graph',
  enableDeviceFlags: 'Enable Device Flags (MongoDB)',
  showDeviceExtraDataInPdf: 'Show Device Extra Data in PDF',
  maskThisReport: 'Mask this report',
  hideTrendsReport: 'Hide trends report',
  noReportToPatient: 'No report to patient',
  outsourcedTest: 'Outsourced Test',
  nonInsuranceService: 'Non Insurance Service',
  nablTests: 'NABL Tests',
  discardDiscount: 'Discard Discount',
  testHasInvestigations: 'This test has investigations',
  multiUnit: 'Multi Unit',
  cellCounter: 'Cell Counter',
  allowEditInWord: 'Allow editing in Word',
  linearityCheck: 'Linearity Check',
  deltaCheck: 'Delta Check',
};

/** Flags shown under “Configs” (excludes fields placed in General / Details / Word / Report validation) */
const CONFIGS_GROUP_BOOLS: BoolKey[] = [
  'billOnlyTest',
  'printPriorityNA',
  'cap',
  'testContainsGraph',
  'enableDeviceFlags',
  'showDeviceExtraDataInPdf',
  'maskThisReport',
  'hideTrendsReport',
  'noReportToPatient',
  'outsourcedTest',
  'nonInsuranceService',
  'nablTests',
  'discardDiscount',
  'testHasInvestigations',
  'multiUnit',
  'cellCounter',
];

export type PinKind = 'dept' | 'sample' | 'bool' | 'select';

export interface TestGridContext {
  SET_TO_ID: string;
  updateTest: (id: string, patch: Partial<Test>) => void;
  getPin: (key: string) => string;
  setPin: (key: string, value: string, kind: PinKind) => void;
  departments: LookupValue[];
  deptById: Map<string, string>;
  deptIds: string[];
  sampleTypes: LookupValue[];
  sampleById: Map<string, string>;
  sampleIds: string[];
}

function numCol(
  field: keyof Test,
  headerName: string,
  width: number,
  ctx: TestGridContext,
): ColDef<Test> {
  const { SET_TO_ID, updateTest } = ctx;
  return {
    colId: String(field),
    field: field as ColDef<Test>['field'],
    headerName,
    width,
    editable: (p) => p.data?.id !== SET_TO_ID,
    valueParser: (p) =>
      p.newValue == null || p.newValue === '' ? null : Number(p.newValue),
    valueFormatter: (p) =>
      p.value != null && p.value !== '' ? String(p.value) : '',
    valueGetter: (p) => p.data?.[field] as number | null | undefined,
    valueSetter: (p) => {
      if (!p.data || p.data.id === SET_TO_ID) return false;
      const n = p.newValue as number | null;
      updateTest(p.data.id, {
        [field]: n == null || Number.isNaN(n) ? null : n,
      } as Partial<Test>);
      return true;
    },
    cellRenderer: (p: ICellRendererParams<Test>) =>
      p.node?.rowPinned === 'top' ? (
        <span className="text-slate-400">—</span>
      ) : (
        (p.value ?? '')
      ),
  };
}

function textCol(
  field: keyof Test,
  headerName: string,
  width: number,
  ctx: TestGridContext,
): ColDef<Test> {
  const { SET_TO_ID, updateTest } = ctx;
  return {
    colId: String(field),
    field: field as ColDef<Test>['field'],
    headerName,
    width,
    editable: (p) => p.data?.id !== SET_TO_ID,
    valueGetter: (p) => (p.data?.[field] as string | undefined) ?? '',
    valueSetter: (p: ValueSetterParams<Test, string>) => {
      if (!p.data || p.data.id === SET_TO_ID) return false;
      updateTest(p.data.id, { [field]: p.newValue ?? '' } as Partial<Test>);
      return true;
    },
    cellRenderer: (p: ICellRendererParams<Test>) =>
      p.node?.rowPinned === 'top' ? (
        <span className="text-slate-400">—</span>
      ) : (
        (p.value ?? '')
      ),
  };
}

function boolCol(key: BoolKey, ctx: TestGridContext): ColDef<Test> {
  const { SET_TO_ID, updateTest, getPin, setPin } = ctx;
  const headerName = BOOL_LABELS[key];
  return {
    colId: key,
    field: key as ColDef<Test>['field'],
    headerName,
    width: 118,
    filter: 'agTextColumnFilter',
    valueGetter: (p) =>
      p.data?.id === SET_TO_ID ? '' : p.data?.[key] ? 'Yes' : 'No',
    editable: (p) => p.data?.id !== SET_TO_ID,
    valueSetter: (p) => {
      if (!p.data || p.data.id === SET_TO_ID) return false;
      updateTest(p.data.id, { [key]: p.newValue === 'Yes' } as Partial<Test>);
      return true;
    },
    cellEditor: 'agSelectCellEditor',
    cellEditorParams: { values: ['Yes', 'No'] },
    cellRenderer: (p: ICellRendererParams<Test>) => {
      if (p.node?.rowPinned === 'top') {
        return (
          <select
            className={PIN_SELECT}
            value={getPin(key)}
            onChange={(e) => setPin(key, e.target.value, 'bool')}
          >
            <option value="">—</option>
            <option value="true">Yes</option>
            <option value="false">No</option>
          </select>
        );
      }
      return p.data?.[key] ? 'Yes' : 'No';
    },
  };
}

export function buildTestColumnGroupDefs(ctx: TestGridContext): (
  | ColDef<Test>
  | ColGroupDef<Test>
)[] {
  const { SET_TO_ID, updateTest, getPin, setPin, departments, deptById, deptIds, sampleTypes, sampleById, sampleIds } =
    ctx;

  return [
    {
      field: 'code',
      headerName: 'Test Code *',
      width: 140,
      editable: (p) => p.data?.id !== SET_TO_ID,
      cellRenderer: (p: ICellRendererParams<Test>) =>
        p.node?.rowPinned === 'top' ? (
          <span className="text-slate-400">—</span>
        ) : (
          (p.value ?? '')
        ),
      valueGetter: (p) => p.data?.code,
      valueSetter: (p: ValueSetterParams<Test, string>) => {
        if (!p.data || p.data.id === SET_TO_ID) return false;
        updateTest(p.data.id, { code: p.newValue ?? '' });
        return true;
      },
    },
    {
      field: 'name',
      headerName: 'Test Name *',
      width: 160,
      pinned: 'left',
      editable: (p) => p.data?.id !== SET_TO_ID,
      cellRenderer: (p: ICellRendererParams<Test>) => {
        if (p.node?.rowPinned === 'top') {
          return (
            <span className="text-[12px] font-bold text-blue-800 tracking-tight">
              SET TO ALL:
            </span>
          );
        }
        return p.value ?? '';
      },
      valueGetter: (p) => p.data?.name,
      valueSetter: (p) => {
        if (!p.data || p.data.id === SET_TO_ID) return false;
        updateTest(p.data.id, { name: p.newValue ?? '' });
        return true;
      },
    },
    {
      field: 'shortName',
      headerName: 'Short Text',
      width: 100,
      editable: (p) => p.data?.id !== SET_TO_ID,
      cellRenderer: (p: ICellRendererParams<Test>) =>
        p.node?.rowPinned === 'top' ? <span className="text-slate-400">—</span> : (p.value ?? ''),
      valueGetter: (p) => p.data?.shortName,
      valueSetter: (p) => {
        if (!p.data || p.data.id === SET_TO_ID) return false;
        updateTest(p.data.id, { shortName: p.newValue });
        return true;
      },
    },
    {
      colId: 'departmentId',
      field: 'departmentId',
      headerName: 'Department *',
      width: 150,
      editable: (p) => p.data != null && p.data.id !== SET_TO_ID,
      valueFormatter: (p) =>
        p.data?.id === SET_TO_ID
          ? ''
          : p.value
            ? (deptById.get(p.value as string) ?? '')
            : '',
      cellEditor: 'agSelectCellEditor',
      cellEditorParams: { values: ['', ...deptIds] },
      valueSetter: (p) => {
        if (!p.data || p.data.id === SET_TO_ID) return false;
        const v = p.newValue;
        updateTest(p.data.id, { departmentId: v && v !== '' ? String(v) : null });
        return true;
      },
      cellRenderer: (p: ICellRendererParams<Test, string | null | undefined>) => {
        if (p.node?.rowPinned === 'top') {
          return (
            <select
              className={PIN_SELECT}
              value={getPin('departmentId')}
              onChange={(e) => setPin('departmentId', e.target.value, 'dept')}
            >
              <option value="">— Department —</option>
              {departments.map((d) => (
                <option key={d.id} value={d.id}>
                  {d.name}
                </option>
              ))}
            </select>
          );
        }
        return (p.value ? deptById.get(p.value) : '') as unknown as string;
      },
    },
    {
      colId: 'sampleTypeId',
      field: 'sampleTypeId',
      headerName: 'Sample Type *',
      width: 150,
      editable: (p) => p.data != null && p.data.id !== SET_TO_ID,
      valueFormatter: (p) =>
        p.data?.id === SET_TO_ID
          ? ''
          : p.value
            ? (sampleById.get(p.value as string) ?? '')
            : '',
      cellEditor: 'agSelectCellEditor',
      cellEditorParams: { values: ['', ...sampleIds] },
      valueSetter: (p) => {
        if (!p.data || p.data.id === SET_TO_ID) return false;
        const v = p.newValue;
        updateTest(p.data.id, { sampleTypeId: v && v !== '' ? String(v) : null });
        return true;
      },
      cellRenderer: (p: ICellRendererParams<Test>) => {
        if (p.node?.rowPinned === 'top') {
          return (
            <select
              className={PIN_SELECT}
              value={getPin('sampleTypeId')}
              onChange={(e) => setPin('sampleTypeId', e.target.value, 'sample')}
            >
              <option value="">— Sample type —</option>
              {sampleTypes.map((s) => (
                <option key={s.id} value={s.id}>
                  {s.name}
                </option>
              ))}
            </select>
          );
        }
        return (p.value ? sampleById.get(String(p.value)) : '') as unknown as string;
      },
    },
    {
      field: 'category',
      headerName: 'Test Category',
      width: 130,
      editable: (p) => p.data?.id !== SET_TO_ID,
      cellRenderer: (p: ICellRendererParams<Test>) =>
        p.node?.rowPinned === 'top' ? <span className="text-slate-400">—</span> : (p.value ?? ''),
      valueGetter: (p) => p.data?.category,
      valueSetter: (p) => {
        if (!p.data || p.data.id === SET_TO_ID) return false;
        updateTest(p.data.id, { category: p.newValue });
        return true;
      },
    },
    {
      colId: 'validatedActiveCol',
      headerName: 'Validated Active',
      width: 120,
      editable: (p) => p.data?.id !== SET_TO_ID,
      valueGetter: (p) =>
        p.data?.id === SET_TO_ID ? null : p.data?.validatedActive ? 'Yes' : 'No',
      cellEditor: 'agSelectCellEditor',
      cellEditorParams: { values: ['Yes', 'No'] },
      valueSetter: (p) => {
        if (!p.data || p.data.id === SET_TO_ID) return false;
        updateTest(p.data.id, { validatedActive: p.newValue === 'Yes' });
        return true;
      },
      cellRenderer: (p: ICellRendererParams<Test>) => {
        if (p.node?.rowPinned === 'top') {
          return (
            <select
              className={PIN_SELECT}
              value={getPin('validatedActive')}
              onChange={(e) => setPin('validatedActive', e.target.value, 'bool')}
            >
              <option value="">— Validated active —</option>
              <option value="true">Yes</option>
              <option value="false">No</option>
            </select>
          );
        }
        return p.data?.validatedActive ? 'Yes' : 'No';
      },
    },
    {
      headerName: 'General',
      children: [
        boolCol('multiSample', ctx),
        textCol('integrationCode', 'Integration Code', 120, ctx),
        textCol('procedureCode', 'Procedure Code', 120, ctx),
        textCol('loincCode', 'LOINC Code', 100, ctx),
        {
          colId: 'testType',
          field: 'testType',
          headerName: 'Test Type',
          width: 130,
          editable: (p) => p.data?.id !== SET_TO_ID,
          cellEditor: 'agSelectCellEditor',
          cellEditorParams: { values: TEST_TYPE_OPTIONS },
          valueGetter: (p) => p.data?.testType ?? '',
          valueSetter: (p) => {
            if (!p.data || p.data.id === SET_TO_ID) return false;
            updateTest(p.data.id, { testType: (p.newValue as string) ?? '' });
            return true;
          },
          cellRenderer: (p: ICellRendererParams<Test>) => {
            if (p.node?.rowPinned === 'top') {
              return (
                <select
                  className={PIN_SELECT}
                  value={getPin('testType')}
                  onChange={(e) => setPin('testType', e.target.value, 'select')}
                >
                  <option value="">— Test type —</option>
                  {TEST_TYPE_OPTIONS.filter(Boolean).map((t) => (
                    <option key={t} value={t}>
                      {t}
                    </option>
                  ))}
                </select>
              );
            }
            return p.value ?? '';
          },
        },
        textCol('icdToPin', 'ICD(s) TO PIN', 140, ctx),
        boolCol('autoAddIcd', ctx),
      ],
    },
    {
      headerName: 'Pricing',
      children: [
        numCol('defaultPrice', 'Test Price', 100, ctx),
        numCol('testPrice2', 'Test Price 2', 100, ctx),
        numCol('minimumSellingPrice', 'Minimum Selling Price', 130, ctx),
        numCol('costOfTest', 'Cost Of Test', 110, ctx),
        numCol('revenueCap', 'Revenue Cap', 100, ctx),
      ],
    },
    {
      headerName: 'Order & outsource',
      children: [
        textCol('previousTestOrderCheck', 'Previous Test Order Check', 160, ctx),
        textCol('actionOnRepeatTest', 'Action on Repeat Test', 150, ctx),
        textCol('outsourceCenter', 'Outsource Center', 130, ctx),
      ],
    },
    {
      headerName: 'Details',
      children: [
        {
          colId: 'genderBasedTest',
          field: 'genderBasedTest',
          headerName: 'Gender Based Test',
          width: 120,
          editable: (p) => p.data?.id !== SET_TO_ID,
          cellEditor: 'agSelectCellEditor',
          cellEditorParams: { values: GENDER_BASED_OPTIONS },
          valueGetter: (p) => p.data?.genderBasedTest ?? 'All',
          valueSetter: (p) => {
            if (!p.data || p.data.id === SET_TO_ID) return false;
            updateTest(p.data.id, { genderBasedTest: (p.newValue as string) || 'All' });
            return true;
          },
          cellRenderer: (p: ICellRendererParams<Test>) => {
            if (p.node?.rowPinned === 'top') {
              return (
                <select
                  className={PIN_SELECT}
                  value={getPin('genderBasedTest')}
                  onChange={(e) => setPin('genderBasedTest', e.target.value, 'select')}
                >
                  <option value="">— Gender —</option>
                  {GENDER_BASED_OPTIONS.filter(Boolean).map((g) => (
                    <option key={g} value={g}>
                      {g}
                    </option>
                  ))}
                </select>
              );
            }
            return p.value ?? '';
          },
        },
        numCol('analyticalTatDays', 'Analytical TAT Days', 90, ctx),
        numCol('analyticalTatHours', 'Analytical TAT Hours', 100, ctx),
        numCol('analyticalTatMinutes', 'Analytical TAT Minutes', 110, ctx),
        textCol('sampleProcess', 'Sample Process', 120, ctx),
        {
          ...textCol('description', 'Description', 200, ctx),
          cellEditor: 'agLargeTextCellEditor',
        },
        boolCol('descriptionAdvanceEditor', ctx),
        {
          ...textCol('testInstructions', 'Test Instructions', 200, ctx),
          cellEditor: 'agLargeTextCellEditor',
        },
        {
          field: 'tat',
          headerName: 'TAT (display)',
          width: 90,
          editable: (p) => p.data?.id !== SET_TO_ID,
          cellRenderer: (p: ICellRendererParams<Test>) =>
            p.node?.rowPinned === 'top' ? <span className="text-slate-400">—</span> : (p.value ?? ''),
          valueGetter: (p) => p.data?.tat,
          valueSetter: (p) => {
            if (!p.data || p.data.id === SET_TO_ID) return false;
            updateTest(p.data.id, { tat: p.newValue });
            return true;
          },
        },
      ],
    },
    {
      headerName: 'Configs',
      children: CONFIGS_GROUP_BOOLS.map((k) => boolCol(k, ctx)),
    },
    {
      headerName: 'Microsoft Word',
      children: [boolCol('allowEditInWord', ctx)],
    },
    {
      headerName: 'Report validation',
      children: [boolCol('linearityCheck', ctx), boolCol('deltaCheck', ctx)],
    },
  ];
}
