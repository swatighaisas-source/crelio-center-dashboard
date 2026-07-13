import { useCallback, useMemo, useRef, useState } from 'react';
import { AgGridReact } from 'ag-grid-react';
import type {
  ColDef,
  GetRowIdParams,
  GridApi,
  GridReadyEvent,
} from 'ag-grid-community';
import { clsx } from 'clsx';
import { useStore } from '@/lib/store';
import { Button } from '@/components/UI';
import { BulkUploadModal } from '@/components/BulkUploadModal';
import { downloadParameterTemplate, parseParametersXlsx } from '@/lib/excel';
import { uid } from '@/lib/id';
import type { AgeRange, Parameter, ParameterType } from '@/types';
import { AgeRangesEditor } from '@/features/parameters/AgeRangesEditor';
import {
  defaultParameterRowWithoutId,
  PARAMETER_TYPES,
} from '@/lib/parameterDefaults';
import { AppMainToolbar } from '@/components/AppSidebar';
import {
  buildParameterColumnGroupDefs,
  PARAMETER_COLUMN_TOGGLES,
  type ParamPinKind,
} from '@/features/parameters/buildParameterColumnDefs';
import { useToast } from '@/lib/useToast';
import { Toaster } from '@/components/Toaster';
import { Trash2 } from 'lucide-react';
import {
  DeleteLibraryParamsDialog,
  type DeletableLibraryParam,
} from '@/features/parameters/DeleteLibraryParamsDialog';
import { CheckboxSetFilter } from '@/features/parameters/CheckboxSetFilter';
import { ParameterGridFilterMenu } from '@/features/parameters/ParameterGridFilterMenu';

const SET_TO_ID = '__setto__';

/** Library parameters only — test-level child instances are hidden here
 * and managed via the Assign Parameters workspace. */
function isLibraryParam(p: Parameter): boolean {
  return !p.isTestLevel;
}

interface ParameterSetupProps {
  /** When true, value cells render as input fields for inline bulk editing. */
  bulkUpdate?: boolean;
  /** Controlled open state for the Bulk Upload modal (button lives in the header). */
  bulkUploadOpen?: boolean;
  onCloseBulkUpload?: () => void;
  /** 0–100 while bulk changes are being saved; null otherwise. Shows a top bar. */
  savingProgress?: number | null;
}

export function ParameterSetup({
  bulkUpdate = false,
  bulkUploadOpen = false,
  onCloseBulkUpload,
  savingProgress = null,
}: ParameterSetupProps) {
  const {
    state,
    setParameters,
    updateParameter,
    updateLibraryParameterAndPropagate,
    deleteLibraryParameters,
  } = useStore();
  const { parameters, mappings, tests } = state;
  const { toasts, push: pushToast, dismiss } = useToast();

  const libraryParameters = useMemo(
    // Hide blank rows (no name and no code) and disabled rows.
    () =>
      parameters.filter(
        (p) => isLibraryParam(p) && !p.disabled && (p.name?.trim() || p.code?.trim()),
      ),
    [parameters],
  );

  const { getMappedTestLabels, isParameterTypeLocked, testNamesByLibId } =
    useMemo(() => {
      const testById = new Map(tests.map((t) => [t.id, t] as const));
      const paramById = new Map(parameters.map((p) => [p.id, p] as const));
      const labelsByLib = new Map<string, string[]>();
      const testNamesByLib = new Map<string, string[]>();
      const seenTestByLib = new Map<string, Set<string>>();

      for (const m of mappings) {
        const mappedParam = paramById.get(m.parameterId);
        // Walk the linked-child chain back to the library parameter.
        const libId = mappedParam?.sourceLibraryParameterId ?? m.parameterId;
        let set = seenTestByLib.get(libId);
        if (!set) {
          set = new Set();
          seenTestByLib.set(libId, set);
        }
        if (set.has(m.testId)) continue;
        set.add(m.testId);

        const t = testById.get(m.testId);
        const label = t
          ? t.code
            ? `${t.name} (${t.code})`
            : t.name
          : `Missing test (${m.testId})`;
        const list = labelsByLib.get(libId) ?? [];
        list.push(label);
        labelsByLib.set(libId, list);

        const names = testNamesByLib.get(libId) ?? [];
        names.push(t?.name ?? `Missing test`);
        testNamesByLib.set(libId, names);
      }

      return {
        getMappedTestLabels: (parameterId: string) =>
          (labelsByLib.get(parameterId) ?? []).join(', '),
        isParameterTypeLocked: (parameterId: string) =>
          (labelsByLib.get(parameterId)?.length ?? 0) > 0,
        testNamesByLibId: testNamesByLib,
      };
    }, [parameters, mappings, tests]);

  /**
   * Wrapper used by every library-grid edit path (single-cell commits, age
   * ranges editor, and individual pin-row applies). Propagates inheritable
   * fields to linked test-level children and surfaces the affected tests via
   * a toast so the user sees exactly which reports were touched by the edit.
   */
  const updateLibraryParameter = useCallback(
    (id: string, patch: Partial<Parameter>) => {
      const row = parameters.find((p) => p.id === id);
      if (!row || row.isTestLevel) {
        updateParameter(id, patch);
        return;
      }
      const affectedTests = testNamesByLibId.get(id) ?? [];
      if (affectedTests.length === 0) {
        updateParameter(id, patch);
        return;
      }
      updateLibraryParameterAndPropagate(id, patch);
      const preview = affectedTests.slice(0, 5).join(', ');
      const extra =
        affectedTests.length > 5
          ? `, +${affectedTests.length - 5} more`
          : '';
      pushToast(
        `“${row.name}” updated. ${affectedTests.length} linked test${
          affectedTests.length === 1 ? '' : 's'
        } synced: ${preview}${extra}.`,
        'success',
      );
    },
    [
      parameters,
      testNamesByLibId,
      updateParameter,
      updateLibraryParameterAndPropagate,
      pushToast,
    ],
  );

  const gridApiRef = useRef<GridApi<Parameter> | null>(null);
  // Quick-filter wiring stays intact; the type filter now lives in the
  // toolbar "Filter" menu (rows by type) alongside column-group visibility.
  const search = '';
  const [selectedCount, setSelectedCount] = useState(0);
  const [pinRow, setPinRow] = useState<Record<string, string>>({});
  const [ageEditorId, setAgeEditorId] = useState<string | null>(null);
  const [pendingDelete, setPendingDelete] = useState<DeletableLibraryParam[]>([]);
  const [selectedTypes, setSelectedTypes] = useState<Set<ParameterType>>(
    () => new Set(PARAMETER_TYPES),
  );
  const [visibleGroups, setVisibleGroups] = useState<Set<string>>(
    () => new Set(PARAMETER_COLUMN_TOGGLES),
  );

  const filtered = useMemo(() => {
    const allTypes = selectedTypes.size === PARAMETER_TYPES.length;
    return libraryParameters.filter((p) => {
      if (!allTypes && !selectedTypes.has(p.type)) return false;
      return true;
    });
  }, [libraryParameters, selectedTypes]);

  const getPin = useCallback((key: string) => pinRow[key] ?? '', [pinRow]);

  /**
   * Apply a pin-row bulk patch to all selected library parameters. Edits
   * propagate to linked test-level children, and a single aggregate toast
   * is emitted summarizing the cross-parameter × cross-test impact.
   */
  const applyBulkPatch = useCallback(
    (patch: Partial<Parameter>, { skipLockedType }: { skipLockedType: boolean }) => {
      const api = gridApiRef.current;
      if (!api) return;
      const rows = (api.getSelectedRows() as Parameter[]).filter(
        (r) => r.id !== SET_TO_ID,
      );
      if (rows.length === 0) return;

      const affectedTests = new Set<string>();
      let libraryRowsUpdated = 0;

      for (const row of rows) {
        if (skipLockedType && isParameterTypeLocked(row.id)) continue;
        if (row.isTestLevel) {
          updateParameter(row.id, patch);
          continue;
        }
        const linkedTests = testNamesByLibId.get(row.id) ?? [];
        if (linkedTests.length === 0) {
          updateParameter(row.id, patch);
        } else {
          updateLibraryParameterAndPropagate(row.id, patch);
          for (const name of linkedTests) affectedTests.add(name);
        }
        libraryRowsUpdated += 1;
      }

      if (affectedTests.size > 0) {
        const list = Array.from(affectedTests);
        const preview = list.slice(0, 6).join(', ');
        const extra = list.length > 6 ? `, +${list.length - 6} more` : '';
        pushToast(
          `Bulk update applied to ${libraryRowsUpdated} library parameter${
            libraryRowsUpdated === 1 ? '' : 's'
          }. ${list.length} linked test${
            list.length === 1 ? '' : 's'
          } will be updated: ${preview}${extra}.`,
          'success',
        );
      }
    },
    [
      isParameterTypeLocked,
      testNamesByLibId,
      updateLibraryParameterAndPropagate,
      updateParameter,
      pushToast,
    ],
  );

  const setPin = useCallback(
    (key: string, value: string, kind: ParamPinKind) => {
      setPinRow((prev) => ({ ...prev, [key]: value }));
      if (value === '') return;
      if (key === 'type' && kind === 'select') {
        const nextType = value as ParameterType;
        applyBulkPatch({ type: nextType }, { skipLockedType: true });
        return;
      }
      if (kind === 'bool') {
        const b = value === 'true';
        applyBulkPatch(
          { [key]: b } as Partial<Parameter>,
          { skipLockedType: false },
        );
        return;
      }
      applyBulkPatch(
        { [key]: value } as Partial<Parameter>,
        { skipLockedType: false },
      );
    },
    [applyBulkPatch],
  );

  const onGridReady = (e: GridReadyEvent) => {
    gridApiRef.current = e.api;
  };

  async function handleUpload(file: File) {
    const parsed = await parseParametersXlsx(file);
    const newRows: Parameter[] = parsed.map((p) => ({ id: uid('par'), ...p }));
    setParameters([...parameters, ...newRows]);
  }

  const openAgeRangesEditor = useCallback((parameterId: string) => {
    setAgeEditorId(parameterId);
  }, []);

  const colDefs = useMemo(
    () =>
      buildParameterColumnGroupDefs({
        SET_TO_ID,
        updateParameter: updateLibraryParameter,
        getPin,
        setPin,
        bulkUpdate,
        visibleGroups,
        openAgeRangesEditor,
        getMappedTestLabels,
        isParameterTypeLocked,
      }),
    [
      getPin,
      setPin,
      bulkUpdate,
      updateLibraryParameter,
      visibleGroups,
      openAgeRangesEditor,
      getMappedTestLabels,
      isParameterTypeLocked,
    ],
  );

  const editingAgeParam = useMemo(
    () => (ageEditorId ? parameters.find((p) => p.id === ageEditorId) ?? null : null),
    [ageEditorId, parameters],
  );

  const defaultColDef = useMemo<ColDef>(
    () => ({
      resizable: true,
      sortable: true,
      filter: CheckboxSetFilter,
      filterParams: { buttons: ['reset'] },
    }),
    [],
  );

  const getRowId = useCallback((p: GetRowIdParams<Parameter>) => p.data.id, []);

  // Age-specific rows stack one line per band in the combined range columns,
  // so grow the row to fit them.
  const getRowHeight = useCallback((p: { data?: Parameter }) => {
    const d = p.data;
    if (
      d &&
      d.id !== SET_TO_ID &&
      d.type === 'TestWithAgeSpecificRange' &&
      (d.ageRanges?.length ?? 0) > 0
    ) {
      return 30 + d.ageRanges.length * 22;
    }
    return 34;
  }, []);

  const pinnedTop = useMemo((): Parameter[] | undefined => {
    if (selectedCount === 0) return undefined;
    return [{ id: SET_TO_ID, ...defaultParameterRowWithoutId() }];
  }, [selectedCount]);

  const handleSaveAgeRanges = (rows: AgeRange[]) => {
    if (!ageEditorId) return;
    updateLibraryParameter(ageEditorId, { ageRanges: rows });
  };

  return (
    <div className="flex flex-col h-full min-h-0 min-h-[420px]">
      <Toaster toasts={toasts} onDismiss={dismiss} />
      <AgeRangesEditor
        open={!!editingAgeParam}
        parameterName={editingAgeParam?.name ?? ''}
        unit={editingAgeParam?.unit ?? ''}
        initialRows={editingAgeParam?.ageRanges ?? []}
        onClose={() => setAgeEditorId(null)}
        onSave={handleSaveAgeRanges}
      />
      <BulkUploadModal
        open={bulkUploadOpen}
        onClose={() => onCloseBulkUpload?.()}
        title="Bulk upload — parameters"
        onFile={handleUpload}
        onDownloadTemplate={downloadParameterTemplate}
      />
      <DeleteLibraryParamsDialog
        open={pendingDelete.length > 0}
        params={pendingDelete}
        onClose={() => setPendingDelete([])}
        onConfirm={() => {
          const ids = pendingDelete.map((p) => p.id);
          const summary = deleteLibraryParameters(ids);
          setPendingDelete([]);
          // Clear selection in the grid so the pinned top row disappears too.
          gridApiRef.current?.deselectAll();
          setSelectedCount(0);
          if (summary.childrenDetached > 0) {
            pushToast(
              `${summary.librariesDeleted} library parameter${
                summary.librariesDeleted === 1 ? '' : 's'
              } deleted. ${summary.childrenDetached} linked parameter${
                summary.childrenDetached === 1 ? '' : 's'
              } in ${summary.affectedTestIds.length} test${
                summary.affectedTestIds.length === 1 ? '' : 's'
              } ${
                summary.childrenDetached === 1 ? 'is' : 'are'
              } now independent.`,
              'success',
            );
          } else {
            pushToast(
              `${summary.librariesDeleted} library parameter${
                summary.librariesDeleted === 1 ? '' : 's'
              } deleted.`,
              'success',
            );
          }
        }}
      />

      <AppMainToolbar
        right={
          <>
            {bulkUpdate && (
              <Button
                size="sm"
                variant="danger"
                disabled={selectedCount === 0}
                onClick={() => {
                  const rows = (gridApiRef.current?.getSelectedRows() as Parameter[])
                    .filter((r) => r.id !== SET_TO_ID);
                  if (rows.length === 0) return;
                  setPendingDelete(
                    rows.map((r) => ({
                      id: r.id,
                      name: r.name || '(Unnamed)',
                      linkedChildCount:
                        (testNamesByLibId.get(r.id)?.length ?? 0),
                      testNames: testNamesByLibId.get(r.id) ?? [],
                    })),
                  );
                }}
              >
                <Trash2 className="h-3.5 w-3.5" /> Delete
              </Button>
            )}
            <ParameterGridFilterMenu
              selectedTypes={selectedTypes}
              onToggleType={(t) =>
                setSelectedTypes((prev) => {
                  const n = new Set(prev);
                  if (n.has(t)) n.delete(t);
                  else n.add(t);
                  return n;
                })
              }
              onSetAllTypes={(all) =>
                setSelectedTypes(all ? new Set(PARAMETER_TYPES) : new Set())
              }
              visibleGroups={visibleGroups}
              onToggleGroup={(g) =>
                setVisibleGroups((prev) => {
                  const n = new Set(prev);
                  if (n.has(g)) n.delete(g);
                  else n.add(g);
                  return n;
                })
              }
              onSetAllGroups={(all) =>
                setVisibleGroups(all ? new Set(PARAMETER_COLUMN_TOGGLES) : new Set())
              }
            />
          </>
        }
      >
        <span className="text-[12px] text-slate-500">
          Rows:{' '}
          <span className="font-medium text-slate-800">{filtered.length}</span>
        </span>
        {selectedCount > 0 && (
          <span className="text-[12px] text-blue-700 font-medium">
            {selectedCount} selected
          </span>
        )}
        {bulkUpdate && (
          <span className="text-[12px] text-blue-700 font-medium">
            Bulk update mode — edit cells inline
          </span>
        )}
      </AppMainToolbar>

      {typeof savingProgress === 'number' && (
        <div className="px-6 pt-3">
          <div className="flex items-center justify-between mb-1.5">
            <span className="text-[13px] font-medium text-slate-700">
              Saving changes…
            </span>
            <span className="text-[13px] font-semibold text-blue-600 tabular-nums">
              {savingProgress}%
            </span>
          </div>
          <div className="w-full h-2.5 rounded-full bg-slate-200 overflow-hidden">
            <div
              className="h-full rounded-full bg-blue-500 transition-all duration-150"
              style={{ width: `${savingProgress}%` }}
            />
          </div>
        </div>
      )}

      <div className="flex-1 min-h-0 px-6 pb-5 pt-3">
        <div
          className={clsx(
            'ag-theme-alpine h-full w-full min-w-0 overflow-auto rounded-md border border-slate-200 ag-lab-grid',
            bulkUpdate && 'ag-bulk-edit',
          )}
        >
          <AgGridReact<Parameter>
            rowData={filtered}
            columnDefs={colDefs}
            defaultColDef={defaultColDef}
            getRowId={getRowId}
            onGridReady={onGridReady}
            pinnedTopRowData={pinnedTop}
            alwaysShowHorizontalScroll
            quickFilterText={search}
            rowSelection={{
              mode: 'multiRow',
              checkboxes: true,
              headerCheckbox: true,
              isRowSelectable: (n) => n.data?.id !== SET_TO_ID,
            }}
            onSelectionChanged={() => {
              const api = gridApiRef.current;
              if (!api) return;
              setSelectedCount(
                api.getSelectedRows().filter((r: Parameter) => r.id !== SET_TO_ID).length,
              );
            }}
            singleClickEdit={bulkUpdate}
            stopEditingWhenCellsLoseFocus
            getRowHeight={getRowHeight}
            headerHeight={36}
            animateRows
            suppressCellFocus
          />
        </div>
      </div>
    </div>
  );
}
