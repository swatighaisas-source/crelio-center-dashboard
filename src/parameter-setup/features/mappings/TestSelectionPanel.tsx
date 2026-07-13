import { useMemo } from 'react';
import { CheckSquare, Filter, Search, Square, X } from 'lucide-react';
import { clsx } from 'clsx';
import type { LookupValue, Test } from '@/types';
import { Badge, Input } from '@/components/UI';

type MappedFilter = 'any' | 'mapped' | 'unmapped';

export interface TestSelectionPanelProps {
  tests: Test[];
  selectedIds: string[];
  onSelectedIdsChange: (ids: string[]) => void;
  search: string;
  onSearchChange: (v: string) => void;
  departments: LookupValue[];
  departmentFilter: string | 'All';
  onDepartmentFilterChange: (v: string | 'All') => void;
  sampleTypes: LookupValue[];
  sampleTypeFilter: string | 'All';
  onSampleTypeFilterChange: (v: string | 'All') => void;
  mappedFilter: MappedFilter;
  onMappedFilterChange: (v: MappedFilter) => void;
  /** Parameter count per test (distinct library parameters mapped). */
  paramCountByTestId: Map<string, number>;
  /** Optional focused test id (shown highlighted even if not selected). */
  focusTestId?: string | null;
  onFocusTest?: (testId: string) => void;
}

/**
 * Right column: the target Test picker. Supports multi-select plus a single
 * "focused" test used by the Mapping Workspace to show existing context.
 */
export function TestSelectionPanel({
  tests,
  selectedIds,
  onSelectedIdsChange,
  search,
  onSearchChange,
  departments,
  departmentFilter,
  onDepartmentFilterChange,
  sampleTypes,
  sampleTypeFilter,
  onSampleTypeFilterChange,
  mappedFilter,
  onMappedFilterChange,
  paramCountByTestId,
  focusTestId,
  onFocusTest,
}: TestSelectionPanelProps) {
  const deptById = useMemo(
    () => new Map(departments.map((d) => [d.id, d.name] as const)),
    [departments],
  );
  const sampleById = useMemo(
    () => new Map(sampleTypes.map((s) => [s.id, s.name] as const)),
    [sampleTypes],
  );
  const selectedSet = useMemo(() => new Set(selectedIds), [selectedIds]);

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    return tests.filter((t) => {
      if (departmentFilter !== 'All' && (t.departmentId ?? '') !== departmentFilter) return false;
      if (sampleTypeFilter !== 'All' && (t.sampleTypeId ?? '') !== sampleTypeFilter) return false;
      const count = paramCountByTestId.get(t.id) ?? 0;
      if (mappedFilter === 'mapped' && count === 0) return false;
      if (mappedFilter === 'unmapped' && count > 0) return false;
      if (!q) return true;
      return [t.code, t.name, t.shortName]
        .filter(Boolean)
        .some((v) => (v as string).toLowerCase().includes(q));
    });
  }, [tests, search, departmentFilter, sampleTypeFilter, mappedFilter, paramCountByTestId]);

  function toggle(id: string) {
    if (selectedSet.has(id)) {
      onSelectedIdsChange(selectedIds.filter((x) => x !== id));
    } else {
      onSelectedIdsChange([...selectedIds, id]);
    }
  }

  const allVisibleSelected =
    filtered.length > 0 && filtered.every((t) => selectedSet.has(t.id));

  function selectAllVisible() {
    if (allVisibleSelected) {
      const visible = new Set(filtered.map((t) => t.id));
      onSelectedIdsChange(selectedIds.filter((id) => !visible.has(id)));
      return;
    }
    const next = [...selectedIds];
    for (const t of filtered) if (!selectedSet.has(t.id)) next.push(t.id);
    onSelectedIdsChange(next);
  }

  function clearAll() {
    onSelectedIdsChange([]);
  }

  return (
    <div className="flex flex-col h-full min-h-0 bg-white">
      <div className="px-3 py-2 border-b border-slate-200 space-y-2">
        <div>
          <div className="text-[13px] font-semibold text-slate-900">Tests</div>
          <div className="text-[11px] text-slate-500">
            {filtered.length} of {tests.length} · {selectedIds.length} selected
          </div>
        </div>
        <div className="relative">
          <Search className="h-3.5 w-3.5 absolute left-2 top-1/2 -translate-y-1/2 text-slate-400" />
          <Input
            value={search}
            onChange={(e) => onSearchChange(e.target.value)}
            className="pl-7 h-8 w-full"
            placeholder="Search by code or name…"
          />
        </div>
        <div className="flex items-center gap-1.5 text-[11px] text-slate-500">
          <Filter className="h-3 w-3" />
          <select
            value={departmentFilter}
            onChange={(e) => onDepartmentFilterChange(e.target.value)}
            className="h-7 rounded border border-slate-200 bg-white px-1.5 text-[11px] flex-1 min-w-0"
          >
            <option value="All">All departments</option>
            {departments.map((d) => (
              <option key={d.id} value={d.id}>
                {d.name}
              </option>
            ))}
          </select>
          <select
            value={sampleTypeFilter}
            onChange={(e) => onSampleTypeFilterChange(e.target.value)}
            className="h-7 rounded border border-slate-200 bg-white px-1.5 text-[11px] flex-1 min-w-0"
          >
            <option value="All">All samples</option>
            {sampleTypes.map((s) => (
              <option key={s.id} value={s.id}>
                {s.name}
              </option>
            ))}
          </select>
        </div>
        <div className="flex items-center gap-1.5 text-[11px] text-slate-500">
          <select
            value={mappedFilter}
            onChange={(e) => onMappedFilterChange(e.target.value as MappedFilter)}
            className="h-7 rounded border border-slate-200 bg-white px-1.5 text-[11px]"
          >
            <option value="any">Any mapping status</option>
            <option value="mapped">Has parameters</option>
            <option value="unmapped">No parameters</option>
          </select>
        </div>
        <div className="flex items-center justify-between gap-2 text-[11px]">
          <button
            type="button"
            onClick={selectAllVisible}
            disabled={filtered.length === 0}
            className="inline-flex items-center gap-1 text-blue-700 hover:text-blue-800 font-medium disabled:text-slate-400"
          >
            {allVisibleSelected ? (
              <>
                <CheckSquare className="h-3 w-3" /> Deselect visible
              </>
            ) : (
              <>
                <Square className="h-3 w-3" /> Select all visible
              </>
            )}
          </button>
          <button
            type="button"
            onClick={clearAll}
            disabled={selectedIds.length === 0}
            className="inline-flex items-center gap-1 text-slate-500 hover:text-slate-700 disabled:text-slate-300"
          >
            <X className="h-3 w-3" /> Clear
          </button>
        </div>
      </div>

      <div className="flex-1 min-h-0 overflow-y-auto scrollbar-thin">
        {filtered.length === 0 ? (
          <div className="p-6 text-center text-[12px] text-slate-500">
            No tests match the current filters.
          </div>
        ) : (
          <ul className="divide-y divide-slate-100">
            {filtered.map((t) => {
              const checked = selectedSet.has(t.id);
              const focused = focusTestId === t.id;
              const dept = t.departmentId ? deptById.get(t.departmentId) : undefined;
              const sample = t.sampleTypeId ? sampleById.get(t.sampleTypeId) : undefined;
              const count = paramCountByTestId.get(t.id) ?? 0;
              return (
                <li key={t.id}>
                  <div
                    className={clsx(
                      'flex items-start gap-2 px-3 py-2 cursor-pointer transition-colors',
                      checked
                        ? 'bg-blue-50/70'
                        : focused
                          ? 'bg-amber-50/60'
                          : 'hover:bg-slate-50',
                    )}
                    onClick={() => onFocusTest?.(t.id)}
                  >
                    <input
                      type="checkbox"
                      className="h-3.5 w-3.5 mt-0.5 accent-blue-600"
                      checked={checked}
                      onClick={(e) => e.stopPropagation()}
                      onChange={() => toggle(t.id)}
                    />
                    <div className="min-w-0 flex-1">
                      <div className="flex items-baseline justify-between gap-2">
                        <div className="text-[12px] font-medium text-slate-900 truncate">
                          {t.name || '(Unnamed)'}
                        </div>
                        <Badge tone={count > 0 ? 'info' : 'neutral'} className="shrink-0">
                          {count} {count === 1 ? 'param' : 'params'}
                        </Badge>
                      </div>
                      <div className="flex items-center gap-1.5 text-[11px] text-slate-500 mt-0.5 flex-wrap">
                        <span className="font-mono">{t.code || '—'}</span>
                        {dept && (
                          <>
                            <span className="text-slate-300">·</span>
                            <span className="truncate">{dept}</span>
                          </>
                        )}
                        {sample && (
                          <>
                            <span className="text-slate-300">·</span>
                            <span className="truncate">{sample}</span>
                          </>
                        )}
                      </div>
                    </div>
                  </div>
                </li>
              );
            })}
          </ul>
        )}
      </div>
    </div>
  );
}
