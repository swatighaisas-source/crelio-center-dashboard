import { useCallback, useMemo, useState } from 'react';
import { useGridFilter } from 'ag-grid-react';
import type { CustomFilterProps } from 'ag-grid-react';
import type { IDoesFilterPassParams } from 'ag-grid-community';
import { Search } from 'lucide-react';

const BLANK = '(Blanks)';

interface Model {
  values: string[];
}

/**
 * Excel-style checkbox (set) filter for ag-grid Community, which doesn't ship
 * the Enterprise Set Filter. Lists the distinct values in the column with a
 * checkbox each; a null model means "all selected" (no filtering).
 */
export function CheckboxSetFilter(props: CustomFilterProps<unknown, unknown, Model>) {
  const { model, onModelChange, getValue, api } = props;
  const [search, setSearch] = useState('');

  const keyOf = useCallback(
    (node: Parameters<typeof getValue>[0]) => {
      const v = getValue(node);
      return v == null || v === '' ? BLANK : String(v);
    },
    [getValue],
  );

  const doesFilterPass = useCallback(
    (params: IDoesFilterPassParams) => {
      if (!model) return true;
      return model.values.includes(keyOf(params.node));
    },
    [model, keyOf],
  );

  useGridFilter({ doesFilterPass });

  // Distinct values across all (non-pinned) rows.
  const options = useMemo(() => {
    const set = new Set<string>();
    api.forEachNode((node) => {
      if (node.data) set.add(keyOf(node));
    });
    return Array.from(set).sort((a, b) =>
      a === BLANK ? 1 : b === BLANK ? -1 : a.localeCompare(b),
    );
    // re-derive when the popup opens (model toggles) or data changes
  }, [api, keyOf, model]);

  const selected = useMemo(
    () => (model ? new Set(model.values) : new Set(options)),
    [model, options],
  );

  const visible = useMemo(() => {
    const q = search.trim().toLowerCase();
    return q ? options.filter((o) => o.toLowerCase().includes(q)) : options;
  }, [options, search]);

  const commit = useCallback(
    (next: Set<string>) => {
      if (next.size === options.length) onModelChange(null);
      else onModelChange({ values: Array.from(next) });
    },
    [options.length, onModelChange],
  );

  const toggle = (opt: string) => {
    const next = new Set(selected);
    if (next.has(opt)) next.delete(opt);
    else next.add(opt);
    commit(next);
  };

  const allChecked = selected.size === options.length;

  return (
    <div className="w-[210px] p-2 text-[12px] text-slate-700">
      <div className="relative mb-2">
        <Search className="absolute left-2 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-slate-400" />
        <input
          autoFocus
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search"
          className="w-full h-8 pl-7 pr-2 rounded border border-slate-300 text-[12px] focus:outline-none focus:border-blue-500"
        />
      </div>

      <label className="flex items-center gap-2 px-1 py-1 cursor-pointer hover:bg-slate-50 rounded">
        <input
          type="checkbox"
          className="accent-blue-600"
          checked={allChecked}
          ref={(el) => {
            if (el) el.indeterminate = !allChecked && selected.size > 0;
          }}
          onChange={() => (allChecked ? commit(new Set()) : commit(new Set(options)))}
        />
        <span className="font-medium">(Select all)</span>
      </label>

      <div className="max-h-[220px] overflow-auto mt-1 border-t border-slate-100 pt-1">
        {visible.length === 0 ? (
          <div className="px-1 py-2 text-slate-400">No matches</div>
        ) : (
          visible.map((opt) => (
            <label
              key={opt}
              className="flex items-center gap-2 px-1 py-1 cursor-pointer hover:bg-slate-50 rounded"
            >
              <input
                type="checkbox"
                className="accent-blue-600"
                checked={selected.has(opt)}
                onChange={() => toggle(opt)}
              />
              <span className="truncate" title={opt}>
                {opt}
              </span>
            </label>
          ))
        )}
      </div>
    </div>
  );
}
