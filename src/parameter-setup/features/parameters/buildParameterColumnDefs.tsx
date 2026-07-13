import type {
  CellClassParams,
  ColDef,
  ColGroupDef,
  ICellRendererParams,
  ValueSetterParams,
} from 'ag-grid-community';
import type { Parameter, ParameterType } from '@/types';
import {
  DICTIONARY_OPTIONS,
  FIELD_APPLICABILITY,
  FORMULA_OPTIONS,
  PARAMETER_TYPES,
  PARAMETER_TYPE_LABELS,
} from '@/lib/parameterDefaults';
import { Badge } from '@/components/UI';

/** True if a field is applicable to the given parameter type. */
function applicableToType(fieldKey: string, type: ParameterType | undefined): boolean {
  if (!type) return true;
  const set = FIELD_APPLICABILITY[fieldKey];
  if (!set) return true;
  return set.has(type);
}

function cellClassForField(fieldKey: string, setToId: string) {
  return (params: CellClassParams<Parameter>) => {
    if (params.node?.rowPinned === 'top') return undefined;
    if (!params.data || params.data.id === setToId) return undefined;
    if (!applicableToType(fieldKey, params.data.type)) return 'ag-cell-param-disabled';
    return undefined;
  };
}

const NA = <span className="text-slate-400">—</span>;

const PIN_SELECT =
  'w-full h-7 min-h-[28px] text-[12px] rounded border border-slate-300 bg-white';

export type ParamPinKind = 'bool' | 'select' | 'text';
export type ParameterTypeFilter = ParameterType | 'All';

/** Column-group header names, in grid order — drives the "Columns" filter menu. */
export const PARAMETER_COLUMN_GROUPS = [
  'Parameter info',
  'Identifiers',
  'Reference Ranges',
  'Age-specific Ranges',
  'List values',
  'Formula',
  'Rerun',
  'Other Flags',
  'Auto approval',
] as const;

/** Everything selectable in the "Columns" menu (groups only). */
export const PARAMETER_COLUMN_TOGGLES = [...PARAMETER_COLUMN_GROUPS] as const;

export interface ParameterGridContext {
  SET_TO_ID: string;
  updateParameter: (id: string, patch: Partial<Parameter>) => void;
  getPin: (key: string) => string;
  setPin: (key: string, value: string, kind: ParamPinKind) => void;
  /** Cells are only editable while bulk-edit mode is on. */
  bulkUpdate: boolean;
  /** Header names of column groups to show; undefined → show all. */
  visibleGroups?: Set<string>;
  /** Open the age-range modal for this parameter id. */
  openAgeRangesEditor: (parameterId: string) => void;
  /** Comma-separated test labels for a parameter (from test–parameter mappings). */
  getMappedTestLabels: (parameterId: string) => string;
  /** When true, Parameter Type is read-only until unassigned from all tests. */
  isParameterTypeLocked: (parameterId: string) => boolean;
}

// ─── Generic field column factories ──────────────────────────────────────────

type FieldKey = keyof Parameter;

function baseField(
  ctx: ParameterGridContext,
  field: FieldKey,
  header: string,
  width: number,
): Pick<ColDef<Parameter>, 'colId' | 'headerName' | 'width' | 'cellClass'> & {
  editableBase: (p: { data?: Parameter }) => boolean;
} {
  const key = String(field);
  return {
    colId: key,
    headerName: header,
    width,
    cellClass: cellClassForField(key, ctx.SET_TO_ID),
    editableBase: (p) =>
      ctx.bulkUpdate &&
      !!p.data &&
      p.data.id !== ctx.SET_TO_ID &&
      applicableToType(key, p.data.type),
  };
}

/** Plain text field. */
function txt(
  ctx: ParameterGridContext,
  field: FieldKey,
  header: string,
  width = 150,
  opts: { large?: boolean } = {},
): ColDef<Parameter> {
  const { colId, headerName, cellClass, editableBase } = baseField(ctx, field, header, width);
  return {
    colId,
    field: field as ColDef<Parameter>['field'],
    headerName,
    width,
    cellClass,
    editable: editableBase,
    cellEditor: opts.large ? 'agLargeTextCellEditor' : undefined,
    valueGetter: (p) => (p.data?.[field] as string | undefined) ?? '',
    valueSetter: (p: ValueSetterParams<Parameter, string>) => {
      if (!p.data || p.data.id === ctx.SET_TO_ID) return false;
      if (!applicableToType(String(field), p.data.type)) return false;
      ctx.updateParameter(p.data.id, { [field]: p.newValue ?? '' } as Partial<Parameter>);
      return true;
    },
    cellRenderer: (p: ICellRendererParams<Parameter>) => {
      if (p.node?.rowPinned === 'top') return NA;
      if (!applicableToType(String(field), p.data?.type)) return NA;
      return (p.value as string) ?? '';
    },
  };
}

/** Numerical field (number editor). */
function num(
  ctx: ParameterGridContext,
  field: FieldKey,
  header: string,
  width = 110,
): ColDef<Parameter> {
  const col = txt(ctx, field, header, width);
  return {
    ...col,
    cellEditor: 'agNumberCellEditor',
    cellStyle: { textAlign: 'right' },
    headerClass: 'ag-right-aligned-header',
  };
}

/** Dropdown (single-select) field. */
function dropdown(
  ctx: ParameterGridContext,
  field: FieldKey,
  header: string,
  values: string[],
  width = 170,
): ColDef<Parameter> {
  const key = String(field);
  const { colId, cellClass, editableBase } = baseField(ctx, field, header, width);
  return {
    colId,
    field: field as ColDef<Parameter>['field'],
    headerName: header,
    width,
    cellClass,
    editable: editableBase,
    cellEditor: 'agSelectCellEditor',
    cellEditorParams: { values: ['', ...values] },
    valueGetter: (p) => (p.data?.[field] as string | undefined) ?? '',
    valueSetter: (p: ValueSetterParams<Parameter, string>) => {
      if (!p.data || p.data.id === ctx.SET_TO_ID) return false;
      ctx.updateParameter(p.data.id, { [field]: p.newValue ?? '' } as Partial<Parameter>);
      return true;
    },
    cellRenderer: (p: ICellRendererParams<Parameter>) => {
      if (p.node?.rowPinned === 'top') {
        return (
          <select
            className={PIN_SELECT}
            value={ctx.getPin(key)}
            onChange={(e) => ctx.setPin(key, e.target.value, 'select')}
          >
            <option value="">— {header} —</option>
            {values.map((v) => (
              <option key={v} value={v}>
                {v}
              </option>
            ))}
          </select>
        );
      }
      if (!applicableToType(key, p.data?.type)) return NA;
      return (p.value as string) || NA;
    },
  };
}

/** Boolean flag (Yes / No), with a bulk "set to all" pin select. */
function flag(
  ctx: ParameterGridContext,
  field: FieldKey,
  header: string,
  width = 150,
): ColDef<Parameter> {
  const key = String(field);
  const { colId, cellClass, editableBase } = baseField(ctx, field, header, width);
  return {
    colId,
    field: field as ColDef<Parameter>['field'],
    headerName: header,
    width,
    cellClass,
    editable: editableBase,
    cellEditor: 'agSelectCellEditor',
    cellEditorParams: { values: ['Yes', 'No'] },
    valueGetter: (p) =>
      p.data?.id === ctx.SET_TO_ID ? '' : p.data?.[field] ? 'Yes' : 'No',
    valueSetter: (p) => {
      if (!p.data || p.data.id === ctx.SET_TO_ID) return false;
      ctx.updateParameter(p.data.id, { [field]: p.newValue === 'Yes' } as Partial<Parameter>);
      return true;
    },
    cellRenderer: (p: ICellRendererParams<Parameter>) => {
      if (p.node?.rowPinned === 'top') {
        return (
          <select
            className={PIN_SELECT}
            value={ctx.getPin(key)}
            onChange={(e) => ctx.setPin(key, e.target.value, 'bool')}
          >
            <option value="">—</option>
            <option value="true">Yes</option>
            <option value="false">No</option>
          </select>
        );
      }
      if (!applicableToType(key, p.data?.type)) return NA;
      return p.data?.[field] ? 'Yes' : 'No';
    },
  };
}

// ─── Age-specific ranges (its own column / group) ────────────────────────────

/**
 * A single read-only cell that previews every age band (age limit + M/F range)
 * for an age-specific parameter, with an "Edit" link to the bands modal. Normal
 * parameters show "—" here (their values live in the Reference Ranges columns).
 */
function ageRangesCol(ctx: ParameterGridContext): ColDef<Parameter> {
  return {
    colId: 'ageRanges',
    headerName: 'Age ranges',
    width: 320,
    editable: false,
    sortable: true,
    filter: false,
    valueGetter: (p) =>
      p.data?.id === ctx.SET_TO_ID ? 0 : (p.data?.ageRanges?.length ?? 0),
    cellRenderer: (p: ICellRendererParams<Parameter>) => {
      if (p.node?.rowPinned === 'top') return NA;
      if (!p.data) return '';
      const isAge = p.data.type === 'TestWithAgeSpecificRange';
      const rows = p.data.ageRanges ?? [];
      if (!isAge) return NA;
      if (rows.length === 0) {
        return (
          <button
            type="button"
            className="inline-flex items-center gap-1 rounded-md border border-[#2563eb] bg-white px-2.5 h-7 text-[12px] font-medium text-[#2563eb] hover:bg-blue-50"
            onClick={() => ctx.openAgeRangesEditor(p.data!.id)}
          >
            + Set ranges
          </button>
        );
      }
      return (
        <div className="py-1 w-full leading-[1.4]">
          <div className="flex items-center justify-between gap-2 mb-1">
            <Badge tone="info">
              {rows.length} age range{rows.length === 1 ? '' : 's'}
            </Badge>
            <button
              type="button"
              className="text-[12px] font-medium text-[#2563eb] hover:underline shrink-0"
              onClick={() => ctx.openAgeRangesEditor(p.data!.id)}
            >
              Edit
            </button>
          </div>
          <ul className="m-0 space-y-0.5">
            {rows.map((r) => {
              const age = [r.lowerAge, r.upperAge].filter(Boolean).join('–') || 'Any';
              const m = [r.lowerMale, r.upperMale].filter(Boolean).join('–');
              const f = [r.lowerFemale, r.upperFemale].filter(Boolean).join('–');
              const range =
                m && f && m === f
                  ? m
                  : m && f
                    ? `M ${m} · F ${f}`
                    : m
                      ? `M ${m}`
                      : f
                        ? `F ${f}`
                        : r.descriptiveMale || r.descriptiveFemale || '—';
              return (
                <li
                  key={r.id}
                  className="flex items-baseline gap-1.5 text-[11px] whitespace-nowrap"
                >
                  <span className="text-slate-500 shrink-0 min-w-[5rem]">{age} {r.ageUnit}</span>
                  <span className="text-slate-700 truncate">{range}</span>
                </li>
              );
            })}
          </ul>
        </div>
      );
    },
  };
}

// ─── Core columns ────────────────────────────────────────────────────────────

function nameCol(ctx: ParameterGridContext): ColDef<Parameter> {
  return {
    colId: 'name',
    field: 'name',
    headerName: 'Parameter Name',
    width: 200,
    pinned: 'left',
    editable: (p) => ctx.bulkUpdate && p.data?.id !== ctx.SET_TO_ID,
    cellRenderer: (p: ICellRendererParams<Parameter>) => {
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
      if (!p.data || p.data.id === ctx.SET_TO_ID) return false;
      ctx.updateParameter(p.data.id, { name: p.newValue ?? '' });
      return true;
    },
  };
}

function mappedTestsCol(ctx: ParameterGridContext): ColDef<Parameter> {
  return {
    colId: 'mappedTests',
    headerName: 'Mapped test(s)',
    width: 220,
    editable: false,
    valueGetter: (p) =>
      p.data?.id === ctx.SET_TO_ID || !p.data ? '' : ctx.getMappedTestLabels(p.data.id),
    tooltipValueGetter: (p) => p.value as string,
    cellRenderer: (p: ICellRendererParams<Parameter>) => {
      if (p.node?.rowPinned === 'top') return NA;
      const s = p.data ? ctx.getMappedTestLabels(p.data.id) : '';
      return s ? s : NA;
    },
  };
}

function typeCol(ctx: ParameterGridContext): ColDef<Parameter> {
  return {
    colId: 'paramType',
    field: 'type',
    headerName: 'Parameter Type',
    width: 200,
    editable: (p) =>
      ctx.bulkUpdate &&
      !!p.data &&
      p.data.id !== ctx.SET_TO_ID &&
      !ctx.isParameterTypeLocked(p.data.id),
    cellClass: (p) => {
      if (p.node?.rowPinned === 'top' || !p.data || p.data.id === ctx.SET_TO_ID) return undefined;
      return ctx.isParameterTypeLocked(p.data.id) ? 'ag-cell-param-disabled' : undefined;
    },
    tooltipValueGetter: (p) =>
      p.data && p.data.id !== ctx.SET_TO_ID && ctx.isParameterTypeLocked(p.data.id)
        ? 'Assigned to one or more tests. Unassign it in Assign Parameters to change the type.'
        : null,
    cellEditor: 'agSelectCellEditor',
    cellEditorParams: { values: PARAMETER_TYPES },
    valueGetter: (p) => p.data?.type ?? 'TestWithNormalRange',
    valueFormatter: (p) => (p.value ? PARAMETER_TYPE_LABELS[p.value as ParameterType] : ''),
    valueSetter: (p) => {
      if (!p.data || p.data.id === ctx.SET_TO_ID) return false;
      if (ctx.isParameterTypeLocked(p.data.id)) return false;
      ctx.updateParameter(p.data.id, { type: p.newValue as ParameterType });
      return true;
    },
    cellRenderer: (p: ICellRendererParams<Parameter>) => {
      if (p.node?.rowPinned === 'top') {
        return (
          <select
            className={PIN_SELECT}
            value={ctx.getPin('type')}
            onChange={(e) => ctx.setPin('type', e.target.value, 'select')}
          >
            <option value="">— Type —</option>
            {PARAMETER_TYPES.map((t) => (
              <option key={t} value={t}>
                {PARAMETER_TYPE_LABELS[t]}
              </option>
            ))}
          </select>
        );
      }
      const t = p.data?.type;
      return t ? PARAMETER_TYPE_LABELS[t] : '';
    },
  };
}

/** Formula variable mapping — only meaningful once a formula is chosen. */
function formulaMappingCol(ctx: ParameterGridContext): ColDef<Parameter> {
  return {
    colId: 'formulaMapping',
    field: 'formulaMapping',
    headerName: 'Formula Mapping',
    width: 200,
    editable: (p) =>
      ctx.bulkUpdate && !!p.data && p.data.id !== ctx.SET_TO_ID && !!p.data.formula,
    cellEditor: 'agLargeTextCellEditor',
    valueGetter: (p) => p.data?.formulaMapping ?? '',
    valueSetter: (p: ValueSetterParams<Parameter, string>) => {
      if (!p.data || p.data.id === ctx.SET_TO_ID || !p.data.formula) return false;
      ctx.updateParameter(p.data.id, { formulaMapping: p.newValue ?? '' });
      return true;
    },
    cellRenderer: (p: ICellRendererParams<Parameter>) => {
      if (p.node?.rowPinned === 'top') return NA;
      if (!p.data?.formula) {
        return <span className="text-slate-400 text-[11px]">Set a formula first</span>;
      }
      return p.data.formulaMapping ? (
        p.data.formulaMapping
      ) : (
        <span className="text-[#2563eb] text-[12px]">Map variables…</span>
      );
    },
  };
}

// ─── Assembly ────────────────────────────────────────────────────────────────

export function buildParameterColumnGroupDefs(
  ctx: ParameterGridContext,
): (ColDef<Parameter> | ColGroupDef<Parameter>)[] {
  const { bulkUpdate, visibleGroups } = ctx;

  const parameterInfo: ColGroupDef<Parameter> = {
    headerName: 'Parameter info',
    children: [
      // Mapped test(s) is reference-only — hidden while bulk editing.
      ...(bulkUpdate ? [] : [mappedTestsCol(ctx)]),
      typeCol(ctx),
      txt(ctx, 'unit', 'Unit', 90),
      txt(ctx, 'method', 'Method', 150),
    ],
  };

  const identifiers: ColGroupDef<Parameter> = {
    headerName: 'Identifiers',
    children: [
      txt(ctx, 'code', 'Parameter Code', 130),
      txt(ctx, 'integrationCode', 'Integration Code', 140),
      txt(ctx, 'loincCode', 'LOINC Code', 120),
      dropdown(ctx, 'dictionary', 'Dictionary', DICTIONARY_OPTIONS, 180),
    ],
  };

  // Normal ranges only — single values per parameter.
  const referenceRanges: ColGroupDef<Parameter> = {
    headerName: 'Reference Ranges',
    children: [
      txt(ctx, 'defaultDescription', 'Default Description', 200, { large: true }),
      num(ctx, 'maleLowerRange', 'Male Lower Range', 130),
      num(ctx, 'maleUpperRange', 'Male Upper Range', 130),
      num(ctx, 'femaleLowerRange', 'Female Lower Range', 135),
      num(ctx, 'femaleUpperRange', 'Female Upper Range', 135),
      num(ctx, 'criticalLowMale', 'Critical Low Male', 130),
      num(ctx, 'criticalHighMale', 'Critical High Male', 130),
      num(ctx, 'criticalLowFemale', 'Critical Low Female', 135),
      num(ctx, 'criticalHighFemale', 'Critical High Female', 135),
      txt(ctx, 'descriptiveMale', 'Descriptive Male', 180),
      txt(ctx, 'descriptiveFemale', 'Descriptive Female', 180),
    ],
  };

  // Age-specific ranges live in their own group / column.
  const ageSpecificRanges: ColGroupDef<Parameter> = {
    headerName: 'Age-specific Ranges',
    children: [ageRangesCol(ctx)],
  };

  const listValues: ColGroupDef<Parameter> = {
    headerName: 'List values',
    children: [txt(ctx, 'listValues', 'List values', 240, { large: true })],
  };

  const formula: ColGroupDef<Parameter> = {
    headerName: 'Formula',
    children: [
      dropdown(ctx, 'formula', 'Formula', FORMULA_OPTIONS, 240),
      formulaMappingCol(ctx),
    ],
  };

  const rerun: ColGroupDef<Parameter> = {
    headerName: 'Rerun',
    children: [flag(ctx, 'rerunAuto', 'Auto Rerun', 120), flag(ctx, 'rerunManual', 'Manual Rerun', 120)],
  };

  const otherFlags: ColGroupDef<Parameter> = {
    headerName: 'Other Flags',
    children: [
      flag(ctx, 'hideParameter', 'Hide Parameter', 130),
      flag(ctx, 'optionalField', 'Optional field', 120),
      flag(ctx, 'breakLine', 'Break line', 110),
      flag(ctx, 'customizedParameter', 'Customized Parameter', 160),
      flag(ctx, 'highlightThisValue', 'Highlight this value', 150),
      flag(ctx, 'underlineThisValue', 'Underline this value', 150),
      flag(ctx, 'hasImpressions', 'Has Impressions', 130),
      flag(ctx, 'hideParameterTrends', 'Hide Parameter Trends', 160),
      flag(ctx, 'nonEditable', 'Non-editable field', 150),
      flag(ctx, 'reportOnlyWhenPositive', 'Report only when Positive', 175),
    ],
  };

  const autoApproval: ColGroupDef<Parameter> = {
    headerName: 'Auto approval',
    children: [
      flag(ctx, 'autoApproval', 'Auto approval Flag', 140),
      num(ctx, 'autoApprovalLowerMale', 'Auto approval LowerMale', 160),
      num(ctx, 'autoApprovalUpperMale', 'Auto approval UpperMale', 160),
      num(ctx, 'autoApprovalLowerFemale', 'Auto approval LowerFemale', 165),
      num(ctx, 'autoApprovalUpperFemale', 'Auto approval UpperFemale', 165),
    ],
  };

  const groups: ColGroupDef<Parameter>[] = [
    parameterInfo,
    identifiers,
    referenceRanges,
    ageSpecificRanges,
    listValues,
    formula,
    rerun,
    otherFlags,
    autoApproval,
  ];

  const visible = groups.filter(
    (g) => !visibleGroups || visibleGroups.has(g.headerName as string),
  );

  // Parameter Name is the always-pinned identity column.
  return [nameCol(ctx), ...visible];
}
