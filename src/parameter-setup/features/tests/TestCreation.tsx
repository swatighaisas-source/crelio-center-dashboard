import { useCallback, useMemo, useRef, useState } from 'react';
import { AgGridReact } from 'ag-grid-react';
import type { ColDef, GetRowIdParams, GridApi, GridReadyEvent } from 'ag-grid-community';
import { useStore } from '@/lib/store';
import { Button, Input } from '@/components/UI';
import { BulkUploadModal } from '@/components/BulkUploadModal';
import { downloadTestTemplate, parseTestsXlsx } from '@/lib/excel';
import { defaultTestRowWithoutId } from '@/lib/testDefaults';
import { uid } from '@/lib/id';
import type { Test } from '@/types';
import { AppMainToolbar } from '@/components/AppSidebar';
import { SaveChangesButton } from '@/components/SaveChangesButton';
import {
  buildTestColumnGroupDefs,
  type PinKind,
} from '@/features/tests/buildTestColumnDefs';
import { ArrowRight, FileSpreadsheet, Plus, Search } from 'lucide-react';

const SET_TO_ID = '__setto__';

interface Props {
  onNext: () => void;
}

export function TestCreation({ onNext }: Props) {
  const {
    state,
    setTests,
    addTest,
    updateTest,
    addDepartment,
    addSampleType,
  } = useStore();
  const { tests, departments, sampleTypes } = state;

  const gridApiRef = useRef<GridApi<Test> | null>(null);
  const [search, setSearch] = useState('');
  const [templateOpen, setTemplateOpen] = useState(false);
  const [selectedCount, setSelectedCount] = useState(0);
  const [pinRow, setPinRow] = useState<Record<string, string>>({});

  const deptById = useMemo(
    () => new Map(departments.map((d) => [d.id, d.name])),
    [departments],
  );
  const sampleById = useMemo(
    () => new Map(sampleTypes.map((s) => [s.id, s.name])),
    [sampleTypes],
  );
  const deptIds = useMemo(() => departments.map((d) => d.id), [departments]);
  const sampleIds = useMemo(() => sampleTypes.map((s) => s.id), [sampleTypes]);

  const duplicates = useMemo(() => {
    const codeMap = new Map<string, number>();
    for (const t of tests) {
      const k = t.code.trim().toLowerCase();
      if (!k) continue;
      codeMap.set(k, (codeMap.get(k) ?? 0) + 1);
    }
    return new Set(
      tests
        .filter(
          (t) => t.code && (codeMap.get(t.code.trim().toLowerCase()) ?? 0) > 1,
        )
        .map((t) => t.id),
    );
  }, [tests]);

  const applyToSelected = useCallback(
    (apply: (id: string) => void) => {
      const api = gridApiRef.current;
      if (!api) return;
      for (const row of api.getSelectedRows() as Test[]) {
        if (row.id === SET_TO_ID) continue;
        apply(row.id);
      }
    },
    [],
  );

  const getPin = useCallback((key: string) => pinRow[key] ?? '', [pinRow]);

  const setPin = useCallback(
    (key: string, value: string, kind: PinKind) => {
      setPinRow((prev) => ({ ...prev, [key]: value }));
      if (kind === 'dept') {
        applyToSelected((id) => updateTest(id, { departmentId: value || null }));
        return;
      }
      if (kind === 'sample') {
        applyToSelected((id) => updateTest(id, { sampleTypeId: value || null }));
        return;
      }
      if (value === '') return;
      if (kind === 'bool') {
        const b = value === 'true';
        applyToSelected((id) => updateTest(id, { [key]: b } as Partial<Test>));
        return;
      }
      if (key === 'genderBasedTest') {
        applyToSelected((id) => updateTest(id, { genderBasedTest: value || 'All' }));
      } else {
        applyToSelected((id) => updateTest(id, { [key]: value } as Partial<Test>));
      }
    },
    [applyToSelected, updateTest],
  );

  const onGridReady = (e: GridReadyEvent) => {
    gridApiRef.current = e.api;
  };

  async function handleUpload(file: File) {
    const parsed = await parseTestsXlsx(file);
    const deptByName = new Map(departments.map((d) => [d.name.toLowerCase(), d.id]));
    const sampleByName = new Map(sampleTypes.map((s) => [s.name.toLowerCase(), s.id]));
    for (const name of parsed.departmentNames) {
      const key = name.toLowerCase();
      if (!deptByName.has(key)) {
        const c = addDepartment(name);
        deptByName.set(key, c.id);
      }
    }
    for (const name of parsed.sampleTypeNames) {
      const key = name.toLowerCase();
      if (!sampleByName.has(key)) {
        const c = addSampleType(name);
        sampleByName.set(key, c.id);
      }
    }
    const newRows: Test[] = parsed.rows.map((r) => {
      const extra = r as typeof r & { _departmentName?: string; _sampleTypeName?: string };
      const { _departmentName, _sampleTypeName, ...rest } = extra;
      return {
        id: uid('tst'),
        ...rest,
        departmentId: _departmentName
          ? (deptByName.get(_departmentName.toLowerCase()) ?? null)
          : null,
        sampleTypeId: _sampleTypeName
          ? (sampleByName.get(_sampleTypeName.toLowerCase()) ?? null)
          : null,
      } as Test;
    });
    setTests([...tests, ...newRows]);
  }

  const colDefs = useMemo(
    () =>
      buildTestColumnGroupDefs({
        SET_TO_ID,
        updateTest,
        getPin,
        setPin,
        departments,
        deptById,
        deptIds,
        sampleTypes,
        sampleById,
        sampleIds,
      }),
    [departments, deptById, deptIds, getPin, sampleById, sampleIds, sampleTypes, setPin, updateTest],
  );

  const defaultColDef = useMemo<ColDef>(
    () => ({
      resizable: true,
      sortable: true,
      filter: 'agTextColumnFilter',
    }),
    [],
  );

  const getRowId = useCallback((p: GetRowIdParams<Test>) => p.data.id, []);

  const pinnedTopRowData = useMemo((): Test[] | undefined => {
    if (selectedCount === 0) return undefined;
    return [{ id: SET_TO_ID, ...defaultTestRowWithoutId() }];
  }, [selectedCount]);

  return (
    <div className="flex flex-col h-full min-h-0 min-h-[420px]">
      <AppMainToolbar
        right={
          <>
            <SaveChangesButton />
            <span className="text-[12px] text-slate-500">
              Rows: <span className="font-medium text-slate-800">{tests.length}</span>
            </span>
            <Button size="sm" variant="secondary" onClick={() => addTest()}>
              <Plus className="h-3.5 w-3.5" /> Add test
            </Button>
            <Button size="sm" variant="primary" onClick={onNext}>
              Next: Parameters <ArrowRight className="h-3.5 w-3.5" />
            </Button>
          </>
        }
      >
        <div className="relative">
          <Search className="h-3.5 w-3.5 absolute left-2 top-1/2 -translate-y-1/2 text-slate-400" />
          <Input
            placeholder="Search (quick filter)…"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-7 w-56 h-8"
          />
        </div>
        <Button size="sm" variant="primary" onClick={() => setTemplateOpen(true)}>
          <FileSpreadsheet className="h-3.5 w-3.5" />
          Bulk Upload
        </Button>
        {selectedCount > 0 && (
          <span className="text-[12px] text-blue-700 font-medium">
            {selectedCount} selected
          </span>
        )}
      </AppMainToolbar>

      <div className="flex-1 min-h-0 p-3">
        <div className="ag-theme-alpine h-[min(80vh,900px)] w-full min-w-0 overflow-auto rounded border border-slate-200 ag-lab-grid">
          <AgGridReact<Test>
            rowData={tests}
            columnDefs={colDefs}
            defaultColDef={defaultColDef}
            getRowId={getRowId}
            onGridReady={onGridReady}
            pinnedTopRowData={pinnedTopRowData}
            alwaysShowHorizontalScroll
            getRowClass={(p) =>
              p.data?.id && duplicates.has(p.data.id) ? 'ag-row-duplicate' : undefined
            }
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
                api.getSelectedRows().filter((r: Test) => r.id !== SET_TO_ID).length,
              );
            }}
            singleClickEdit
            stopEditingWhenCellsLoseFocus
            rowHeight={34}
            headerHeight={36}
            animateRows
            suppressCellFocus
          />
        </div>
      </div>

      <BulkUploadModal
        open={templateOpen}
        onClose={() => setTemplateOpen(false)}
        title="Bulk upload — tests"
        onFile={handleUpload}
        onDownloadTemplate={downloadTestTemplate}
      />
    </div>
  );
}
