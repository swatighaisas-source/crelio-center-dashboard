import { useMemo } from 'react';
import { CheckSquare, Filter, Search, Square, X } from 'lucide-react';
import { clsx } from 'clsx';
import type { Parameter, ParameterType } from '@/types';
import { PARAMETER_TYPES, PARAMETER_TYPE_LABELS } from '@/lib/parameterDefaults';
import { Badge, Input } from '@/components/UI';

type MappedFilter = 'any' | 'mapped' | 'unmapped';

export interface ParameterSelectionPanelProps {
  parameters: Parameter[];
  selectedIds: string[];
  onSelectedIdsChange: (ids: string[]) => void;
  search: string;
  onSearchChange: (v: string) => void;
  typeFilter: ParameterType | 'All';
  onTypeFilterChange: (v: ParameterType | 'All') => void;
  mappedFilter: MappedFilter;
  onMappedFilterChange: (v: MappedFilter) => void;
  /** Count of distinct tests each library parameter is assigned to. */
  mappedTestCountByParamId: Map<string, number>;
}

/**
 * Left column: the Parameter Library picker. Multi-select list with search and
 * filters. Selection order is preserved in `selectedIds` so the Mapping
 * Workspace can honour the "Preserve selection order" placement rule.
 */
export function ParameterSelectionPanel({
  parameters,
  selectedIds,
  onSelectedIdsChange,
  search,
  onSearchChange,
  typeFilter,
  onTypeFilterChange,
  mappedFilter,
  onMappedFilterChange,
  mappedTestCountByParamId,
}: ParameterSelectionPanelProps) {
  const selectedSet = useMemo(() => new Set(selectedIds), [selectedIds]);

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    return parameters.filter((p) => {
      if (typeFilter !== 'All' && p.type !== typeFilter) return false;
      const count = mappedTestCountByParamId.get(p.id) ?? 0;
      if (mappedFilter === 'mapped' && count === 0) return false;
      if (mappedFilter === 'unmapped' && count > 0) return false;
      if (!q) return true;
      return [p.code, p.name, p.unit]
        .filter(Boolean)
        .some((v) => (v as string).toLowerCase().includes(q));
    });
  }, [parameters, search, typeFilter, mappedFilter, mappedTestCountByParamId]);

  function toggle(id: string) {
    if (selectedSet.has(id)) {
      onSelectedIdsChange(selectedIds.filter((x) => x !== id));
    } else {
      onSelectedIdsChange([...selectedIds, id]);
    }
  }

  const allVisibleSelected =
    filtered.length > 0 && filtered.every((p) => selectedSet.has(p.id));

  function selectAllVisible() {
    if (allVisibleSelected) {
      const filteredSet = new Set(filtered.map((p) => p.id));
      onSelectedIdsChange(selectedIds.filter((id) => !filteredSet.has(id)));
      return;
    }
    const next = [...selectedIds];
    for (const p of filtered) {
      if (!selectedSet.has(p.id)) next.push(p.id);
    }
    onSelectedIdsChange(next);
  }

  function clearAll() {
    onSelectedIdsChange([]);
  }

  return (
    <div className="flex flex-col h-full min-h-0 bg-white">
      <div className="px-3 py-2 border-b border-slate-200 space-y-2">
        <div className="flex items-center justify-between">
          <div>
            <div className="text-[13px] font-semibold text-slate-900">Parameter Library</div>
            <div className="text-[11px] text-slate-500">
              {filtered.length} of {parameters.length} · {selectedIds.length} selected
            </div>
          </div>
        </div>
        <div className="relative">
          <Search className="h-3.5 w-3.5 absolute left-2 top-1/2 -translate-y-1/2 text-slate-400" />
          <Input
            value={search}
            onChange={(e) => onSearchChange(e.target.value)}
            className="pl-7 h-8 w-full"
            placeholder="Search by code, name or unit…"
          />
        </div>
        <div className="flex items-center gap-1.5 text-[11px] text-slate-500">
          <Filter className="h-3 w-3" />
          <select
            value={typeFilter}
            onChange={(e) => onTypeFilterChange(e.target.value as ParameterType | 'All')}
            className="h-7 rounded border border-slate-200 bg-white px-1.5 text-[11px] min-w-0 flex-1"
          >
            <option value="All">All types</option>
            {PARAMETER_TYPES.map((t) => (
              <option key={t} value={t}>
                {PARAMETER_TYPE_LABELS[t]}
              </option>
            ))}
          </select>
          <select
            value={mappedFilter}
            onChange={(e) => onMappedFilterChange(e.target.value as MappedFilter)}
            className="h-7 rounded border border-slate-200 bg-white px-1.5 text-[11px]"
          >
            <option value="any">Any status</option>
            <option value="mapped">Mapped</option>
            <option value="unmapped">Unmapped</option>
          </select>
        </div>
        <div className="flex items-center justify-between gap-2 text-[11px]">
          <button
            type="button"
            onClick={selectAllVisible}
            className="inline-flex items-center gap-1 text-blue-700 hover:text-blue-800 font-medium disabled:text-slate-400"
            disabled={filtered.length === 0}
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
            No parameters match the current filters.
          </div>
        ) : (
          <ul className="divide-y divide-slate-100">
            {filtered.map((p) => {
              const checked = selectedSet.has(p.id);
              const count = mappedTestCountByParamId.get(p.id) ?? 0;
              return (
                <li key={p.id}>
                  <label
                    className={clsx(
                      'flex items-start gap-2 px-3 py-2 cursor-pointer transition-colors',
                      checked ? 'bg-blue-50/70' : 'hover:bg-slate-50',
                    )}
                  >
                    <input
                      type="checkbox"
                      className="h-3.5 w-3.5 mt-0.5 accent-blue-600"
                      checked={checked}
                      onChange={() => toggle(p.id)}
                    />
                    <div className="min-w-0 flex-1">
                      <div className="flex items-baseline justify-between gap-2">
                        <div className="text-[12px] font-medium text-slate-900 truncate">
                          {p.name || '(Unnamed)'}
                        </div>
                        {count > 0 && (
                          <Badge tone="success" className="shrink-0">
                            {count} {count === 1 ? 'test' : 'tests'}
                          </Badge>
                        )}
                      </div>
                      <div className="flex items-center gap-1.5 text-[11px] text-slate-500 mt-0.5">
                        <span className="font-mono">{p.code || '—'}</span>
                        <span className="text-slate-300">·</span>
                        <span className="truncate">{PARAMETER_TYPE_LABELS[p.type]}</span>
                        {p.unit && (
                          <>
                            <span className="text-slate-300">·</span>
                            <span className="truncate">{p.unit}</span>
                          </>
                        )}
                      </div>
                    </div>
                  </label>
                </li>
              );
            })}
          </ul>
        )}
      </div>
    </div>
  );
}
