import { useMemo, useState } from 'react';
import { clsx } from 'clsx';
import { Ban, Trash2 } from 'lucide-react';
import { useStore } from '@/lib/store';
import { Badge, Button } from '@/components/UI';
import { CleanupShell } from './CleanupShell';
import type { Parameter } from '@/types';

const WINDOWS = [
  { label: '30 days', days: 30 },
  { label: '60 days', days: 60 },
  { label: '1 year', days: 365 },
] as const;

/** Deterministic "days since last used" for a never-mapped parameter. */
function staleDays(id: string): number {
  let h = 0;
  for (let i = 0; i < id.length; i++) h = (h * 31 + id.charCodeAt(i)) >>> 0;
  return 20 + (h % 400); // 20–419 days
}

export function UnusedParametersScreen() {
  const { state, updateParameter, deleteParameters } = useStore();
  const { parameters, mappings } = state;
  const [windowDays, setWindowDays] = useState<number>(30);
  const [selected, setSelected] = useState<Set<string>>(new Set());

  // Library param ids that ARE used by at least one test.
  const usedIds = useMemo(() => {
    const paramById = new Map(parameters.map((p) => [p.id, p] as const));
    const set = new Set<string>();
    for (const m of mappings) {
      const child = paramById.get(m.parameterId);
      set.add(child?.sourceLibraryParameterId ?? m.parameterId);
    }
    return set;
  }, [parameters, mappings]);

  const unused = useMemo(() => {
    return parameters
      .filter((p) => !p.isTestLevel && !p.disabled && !usedIds.has(p.id))
      .map((p) => ({ p, days: staleDays(p.id) }))
      .filter((r) => r.days >= windowDays)
      .sort((a, b) => b.days - a.days);
  }, [parameters, usedIds, windowDays]);

  const toggle = (id: string) =>
    setSelected((prev) => {
      const n = new Set(prev);
      n.has(id) ? n.delete(id) : n.add(id);
      return n;
    });

  const allChecked = unused.length > 0 && unused.every((r) => selected.has(r.p.id));
  const selectedList = unused.filter((r) => selected.has(r.p.id)).map((r) => r.p);

  function disableSelected() {
    selectedList.forEach((p) => updateParameter(p.id, { disabled: true }));
    setSelected(new Set());
  }
  function deleteSelected() {
    deleteParameters(selectedList.map((p) => p.id));
    setSelected(new Set());
  }

  return (
    <CleanupShell
      title="Unused parameters"
      description="Library parameters that aren't mapped to any test. Review and disable or delete the ones you no longer need."
      actions={
        <>
          <Button
            variant="secondary"
            size="sm"
            disabled={selected.size === 0}
            onClick={disableSelected}
          >
            <Ban className="h-3.5 w-3.5" /> Disable ({selected.size})
          </Button>
          <Button
            variant="danger"
            size="sm"
            disabled={selected.size === 0}
            onClick={deleteSelected}
          >
            <Trash2 className="h-3.5 w-3.5" /> Delete ({selected.size})
          </Button>
        </>
      }
    >
      <div className="flex items-center gap-3 mb-4">
        <span className="text-[12px] text-slate-500">Unused for at least</span>
        <div className="inline-flex rounded-md border border-slate-300 overflow-hidden">
          {WINDOWS.map((w) => (
            <button
              key={w.days}
              type="button"
              onClick={() => setWindowDays(w.days)}
              className={clsx(
                'px-3 py-1.5 text-[12px] border-r border-slate-200 last:border-r-0',
                windowDays === w.days
                  ? 'bg-[#2563eb] text-white'
                  : 'bg-white text-slate-600 hover:bg-slate-50',
              )}
            >
              {w.label}
            </button>
          ))}
        </div>
        <span className="text-[12px] text-slate-500">
          <strong className="text-slate-800">{unused.length}</strong> parameter
          {unused.length === 1 ? '' : 's'}
        </span>
      </div>

      <div className="overflow-hidden rounded-lg border border-slate-200 bg-white">
        <table className="w-full text-[12.5px]">
          <thead className="bg-slate-50 text-slate-500 text-left">
            <tr>
              <th className="px-3 py-2 w-9">
                <input
                  type="checkbox"
                  className="accent-blue-600"
                  checked={allChecked}
                  onChange={() =>
                    setSelected(allChecked ? new Set() : new Set(unused.map((r) => r.p.id)))
                  }
                />
              </th>
              <th className="px-3 py-2 font-medium">Parameter</th>
              <th className="px-3 py-2 font-medium">Code</th>
              <th className="px-3 py-2 font-medium">Type</th>
              <th className="px-3 py-2 font-medium">Last used</th>
            </tr>
          </thead>
          <tbody>
            {unused.map(({ p, days }: { p: Parameter; days: number }) => (
              <tr key={p.id} className="border-t border-slate-100 hover:bg-slate-50">
                <td className="px-3 py-2">
                  <input
                    type="checkbox"
                    className="accent-blue-600"
                    checked={selected.has(p.id)}
                    onChange={() => toggle(p.id)}
                  />
                </td>
                <td className="px-3 py-2 text-slate-800 font-medium">{p.name || '(Unnamed)'}</td>
                <td className="px-3 py-2 font-mono text-[11px] text-slate-600">{p.code || '—'}</td>
                <td className="px-3 py-2 text-slate-600">{p.type}</td>
                <td className="px-3 py-2">
                  <Badge tone={days >= 365 ? 'danger' : days >= 60 ? 'warning' : 'neutral'}>
                    {days >= 365 ? '1+ year ago' : `${days} days ago`}
                  </Badge>
                </td>
              </tr>
            ))}
            {unused.length === 0 && (
              <tr>
                <td colSpan={5} className="px-3 py-10 text-center text-slate-500">
                  No unused parameters in this window. 🎉
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </CleanupShell>
  );
}
