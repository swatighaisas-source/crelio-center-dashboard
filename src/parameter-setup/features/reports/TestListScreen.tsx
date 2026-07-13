import { useMemo, useState } from 'react';
import { clsx } from 'clsx';
import { ChevronRight, FileSpreadsheet, FileText, Search } from 'lucide-react';
import { AgGridReact } from 'ag-grid-react';
import type { ColDef, RowClickedEvent } from 'ag-grid-community';
import { useStore } from '@/lib/store';
import { Badge, Button, Input } from '@/components/UI';
import { BulkUploadModal } from '@/components/BulkUploadModal';
import { downloadTestTemplate, parseTestsXlsx } from '@/lib/excel';
import { uid } from '@/lib/id';
import type { Test } from '@/types';

interface Props {
  onOpenTest: (testId: string) => void;
}

type ListTab = 'tests' | 'profile' | 'billOnly';

interface TestRow {
  id: string;
  name: string;
  code: string;
  price: number | null;
  sampleType: string;
  department: string;
  outsourced: string;
  outsourceCenter: string;
  validationStatus: Test['validationStatus'];
  parameterCount: number;
}

export function TestListScreen({ onOpenTest }: Props) {
  const { state, setTests, addDepartment, addSampleType } = useStore();
  const [tab, setTab] = useState<ListTab>('tests');
  const [search, setSearch] = useState('');
  const [bulkOpen, setBulkOpen] = useState(false);

  // Bulk upload tests from an .xlsx (carried over from the old Test Creation screen).
  async function handleBulkUpload(file: File) {
    const parsed = await parseTestsXlsx(file);
    const deptByName = new Map(state.departments.map((d) => [d.name.toLowerCase(), d.id]));
    const sampleByName = new Map(state.sampleTypes.map((s) => [s.name.toLowerCase(), s.id]));
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
    setTests([...state.tests, ...newRows]);
  }

  const deptById = useMemo(
    () => new Map(state.departments.map((d) => [d.id, d.name] as const)),
    [state.departments],
  );
  const sampleById = useMemo(
    () => new Map(state.sampleTypes.map((s) => [s.id, s.name] as const)),
    [state.sampleTypes],
  );

  const paramCountByTestId = useMemo(() => {
    const m = new Map<string, number>();
    for (const mapping of state.mappings) {
      m.set(mapping.testId, (m.get(mapping.testId) ?? 0) + 1);
    }
    return m;
  }, [state.mappings]);

  const rows = useMemo<TestRow[]>(() => {
    const q = search.trim().toLowerCase();
    return state.tests
      .filter((t) => {
        if (tab === 'billOnly') {
          if (!t.billOnlyTest) return false;
        } else if (tab === 'profile') {
          // No profile tests in the current data model. Keep the tab visible
          // to match Crelio's list shell; it simply renders empty.
          return false;
        } else if (t.billOnlyTest) {
          return false;
        }
        if (!q) return true;
        return (
          t.name.toLowerCase().includes(q) ||
          t.code.toLowerCase().includes(q) ||
          (t.shortName ?? '').toLowerCase().includes(q)
        );
      })
      .map((t) => ({
        id: t.id,
        name: t.name,
        code: t.code,
        price: t.defaultPrice ?? null,
        sampleType: t.sampleTypeId ? sampleById.get(t.sampleTypeId) ?? '' : '',
        department: t.departmentId ? deptById.get(t.departmentId) ?? '' : '',
        outsourced: t.outsourcedTest ? 'Yes' : 'No',
        outsourceCenter: t.outsourceCenter || '-',
        validationStatus: t.validationStatus,
        parameterCount: paramCountByTestId.get(t.id) ?? 0,
      }));
  }, [state.tests, tab, search, deptById, sampleById, paramCountByTestId]);

  const columnDefs = useMemo<ColDef<TestRow>[]>(
    () => [
      {
        headerName: 'Test Name',
        field: 'name',
        flex: 2,
        minWidth: 220,
        cellRenderer: (p: { data?: TestRow }) => {
          if (!p.data) return null;
          return (
            <span className="inline-flex items-center gap-2">
              <span className="font-medium text-slate-900">{p.data.name}</span>
              {p.data.validationStatus !== 'Verified' && (
                <Badge tone="warning">Not Verified</Badge>
              )}
              {p.data.parameterCount > 0 && (
                <span className="text-[11px] text-slate-500">
                  · {p.data.parameterCount} parameter
                  {p.data.parameterCount === 1 ? '' : 's'}
                </span>
              )}
            </span>
          );
        },
      },
      { headerName: 'Test Code', field: 'code', flex: 1.2, minWidth: 180 },
      {
        headerName: 'Price (₹)',
        field: 'price',
        width: 120,
        valueFormatter: (p: { value?: number | null }) =>
          p.value == null ? '—' : `₹ ${p.value}`,
        cellStyle: { textAlign: 'right' },
        headerClass: 'ag-right-aligned-header',
      },
      { headerName: 'Sample Type', field: 'sampleType', flex: 1, minWidth: 140 },
      { headerName: 'Department', field: 'department', flex: 1, minWidth: 140 },
      { headerName: 'Outsourced', field: 'outsourced', width: 120 },
      {
        headerName: 'Outsource Center',
        field: 'outsourceCenter',
        flex: 1,
        minWidth: 160,
      },
      {
        headerName: '',
        colId: 'open',
        width: 56,
        pinned: 'right' as const,
        sortable: false,
        filter: false,
        cellRenderer: () => (
          <span className="inline-flex h-full items-center justify-center text-slate-400">
            <ChevronRight className="h-4 w-4" />
          </span>
        ),
      },
    ],
    [],
  );

  const defaultColDef = useMemo<ColDef>(
    () => ({
      sortable: true,
      filter: 'agTextColumnFilter',
      resizable: true,
      suppressMovable: true,
    }),
    [],
  );

  return (
    <div className="flex flex-col min-h-0 flex-1 bg-white">
      {/* Title + primary actions */}
      <div className="px-6 pt-5 border-b border-slate-200">
        <div className="flex flex-wrap items-center justify-between gap-3 mb-4">
          <div className="flex items-center gap-2">
            <FileText className="h-4.5 w-4.5 text-slate-500" />
            <h2 className="text-[17px] font-semibold text-slate-900">Test List</h2>
            <span className="text-[12px] text-slate-500">Rows: {rows.length}</span>
          </div>
          <div className="flex flex-wrap items-center gap-2.5">
            <Button variant="secondary" onClick={() => setBulkOpen(true)}>
              <FileSpreadsheet className="h-3.5 w-3.5" /> Bulk Upload
            </Button>
            <Button variant="secondary" disabled>
              Parameter Wise Export
            </Button>
            <Button variant="primary" disabled>
              Add Profile
            </Button>
            <Button variant="primary" disabled>
              Add New Report
            </Button>
          </div>
        </div>
        {/* Tabs + search */}
        <div className="flex flex-wrap items-end justify-between gap-3">
          <div className="flex items-center gap-1">
            {([
              { id: 'tests', label: 'Tests' },
              { id: 'profile', label: 'Profile Tests' },
              { id: 'billOnly', label: 'Bill Only Test' },
            ] as { id: ListTab; label: string }[]).map((t) => (
              <button
                key={t.id}
                type="button"
                onClick={() => setTab(t.id)}
                className={clsx(
                  'px-4 py-3 text-[14px] border-b-2 -mb-px transition-colors',
                  tab === t.id
                    ? 'border-[#2563eb] text-[#2563eb] font-semibold'
                    : 'border-transparent text-[#666] hover:text-[#333]',
                )}
              >
                {t.label}
              </button>
            ))}
          </div>
          <div className="relative mb-2">
            <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-slate-400" />
            <Input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search test name or code"
              className="pl-8 w-[260px]"
            />
          </div>
        </div>
      </div>

      <div className="flex-1 min-h-0 px-6 pb-5 pt-4">
        <div className="ag-theme-alpine ag-lab-grid h-full w-full rounded-md border border-slate-200 overflow-hidden">
          <AgGridReact<TestRow>
            rowData={rows}
            columnDefs={columnDefs}
            defaultColDef={defaultColDef}
            rowHeight={40}
            headerHeight={38}
            animateRows={false}
            onRowClicked={(e: RowClickedEvent<TestRow>) => {
              if (e.data) onOpenTest(e.data.id);
            }}
            rowStyle={{ cursor: 'pointer' }}
            overlayNoRowsTemplate={
              tab === 'profile'
                ? '<span class="text-slate-500 text-[12px]">No profile tests defined.</span>'
                : '<span class="text-slate-500 text-[12px]">No tests match your search.</span>'
            }
          />
        </div>
      </div>

      <BulkUploadModal
        open={bulkOpen}
        onClose={() => setBulkOpen(false)}
        title="Bulk upload — tests"
        onFile={handleBulkUpload}
        onDownloadTemplate={downloadTestTemplate}
      />
    </div>
  );
}
