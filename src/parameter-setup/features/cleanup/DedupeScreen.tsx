import { useMemo, useState } from 'react';
import { clsx } from 'clsx';
import { GitMerge, Link2 } from 'lucide-react';
import { useStore } from '@/lib/store';
import { Badge, Button } from '@/components/UI';
import { CleanupShell } from './CleanupShell';
import type { Parameter } from '@/types';

/** Fields the user can group by to detect duplicates. */
const CRITERIA = [
  { key: 'name', label: 'Name' },
  { key: 'code', label: 'Code' },
  { key: 'integrationCode', label: 'Integration Code' },
  { key: 'loincCode', label: 'LOINC Code' },
  { key: 'dictionary', label: 'Dictionary' },
] as const;
type CriteriaKey = (typeof CRITERIA)[number]['key'];

/** All identity fields used to score confidence (independent of grouping). */
const IDENTITY_FIELDS: CriteriaKey[] = [
  'name',
  'code',
  'integrationCode',
  'loincCode',
  'dictionary',
];

const norm = (v: string) => (v ?? '').trim().toLowerCase();

interface DupGroup {
  key: string;
  members: Parameter[];
  confidence: number;
}

/** Share of identity fields that are identical (and present) across the group. */
function confidenceOf(members: Parameter[]): number {
  let considered = 0;
  let shared = 0;
  for (const f of IDENTITY_FIELDS) {
    const values = members.map((m) => norm((m[f] as string) ?? ''));
    if (values.every((v) => !v)) continue; // field empty for all → ignore
    considered += 1;
    const distinct = new Set(values.filter(Boolean));
    if (distinct.size === 1 && values.every(Boolean)) shared += 1;
  }
  if (considered === 0) return 0;
  return Math.round((shared / considered) * 100);
}

export function DedupeScreen() {
  const { state, updateParameter } = useStore();
  const { parameters } = state;
  const [criteria, setCriteria] = useState<Set<CriteriaKey>>(new Set(['name']));
  const [threshold, setThreshold] = useState(90);

  const library = useMemo(
    () => parameters.filter((p) => !p.isTestLevel && !p.disabled),
    [parameters],
  );

  const groups = useMemo<DupGroup[]>(() => {
    if (criteria.size === 0) return [];
    const byKey = new Map<string, Parameter[]>();
    for (const p of library) {
      const parts = CRITERIA.filter((c) => criteria.has(c.key)).map((c) =>
        norm((p[c.key] as string) ?? ''),
      );
      if (parts.every((v) => !v)) continue; // nothing to match on
      const key = parts.join('∥');
      const arr = byKey.get(key);
      if (arr) arr.push(p);
      else byKey.set(key, [p]);
    }
    return Array.from(byKey.entries())
      .filter(([, m]) => m.length > 1)
      .map(([key, members]) => ({ key, members, confidence: confidenceOf(members) }))
      .sort((a, b) => b.confidence - a.confidence);
  }, [library, criteria]);

  const toggleCriteria = (k: CriteriaKey) =>
    setCriteria((prev) => {
      const n = new Set(prev);
      n.has(k) ? n.delete(k) : n.add(k);
      return n;
    });

  /** Keep the first member; repoint linked children of the rest, then disable them. */
  function merge(group: DupGroup) {
    const [primary, ...dupes] = group.members;
    for (const d of dupes) {
      parameters
        .filter((c) => c.sourceLibraryParameterId === d.id)
        .forEach((c) => updateParameter(c.id, { sourceLibraryParameterId: primary.id }));
      updateParameter(d.id, { disabled: true });
    }
  }

  function bulkApprove() {
    groups.filter((g) => g.confidence >= threshold).forEach(merge);
  }

  const aboveThreshold = groups.filter((g) => g.confidence >= threshold).length;

  return (
    <CleanupShell
      title="De-duplication"
      description="Find duplicate parameters by matching identity fields, then merge them — the primary is kept and every test using a duplicate is re-linked to it."
    >
      {/* Criteria */}
      <div className="rounded-lg border border-slate-200 bg-white p-4 mb-4">
        <div className="text-[12px] font-semibold text-slate-600 mb-2">
          Identify duplicates by
        </div>
        <div className="flex flex-wrap gap-x-5 gap-y-2">
          {CRITERIA.map((c) => (
            <label key={c.key} className="flex items-center gap-2 text-[13px] cursor-pointer">
              <input
                type="checkbox"
                className="accent-blue-600"
                checked={criteria.has(c.key)}
                onChange={() => toggleCriteria(c.key)}
              />
              {c.label}
            </label>
          ))}
        </div>
      </div>

      {/* Bulk approve */}
      <div className="flex items-center justify-between gap-3 flex-wrap mb-4">
        <div className="text-[12.5px] text-slate-600">
          <strong className="text-slate-800">{groups.length}</strong> duplicate group
          {groups.length === 1 ? '' : 's'} found
        </div>
        <div className="flex items-center gap-2">
          <span className="text-[12px] text-slate-500">Auto-merge confidence ≥</span>
          <input
            type="number"
            min={0}
            max={100}
            value={threshold}
            onChange={(e) => setThreshold(Number(e.target.value))}
            className="w-16 h-8 rounded border border-slate-300 px-2 text-[12px]"
          />
          <span className="text-[12px] text-slate-500">%</span>
          <Button variant="primary" size="sm" disabled={aboveThreshold === 0} onClick={bulkApprove}>
            <GitMerge className="h-3.5 w-3.5" /> Merge {aboveThreshold} group
            {aboveThreshold === 1 ? '' : 's'}
          </Button>
        </div>
      </div>

      <div className="space-y-3">
        {groups.map((g) => (
          <div key={g.key} className="rounded-lg border border-slate-200 bg-white overflow-hidden">
            <div className="flex items-center justify-between gap-3 px-4 py-2.5 border-b border-slate-100 bg-slate-50/60">
              <div className="flex items-center gap-2 text-[12.5px] text-slate-600">
                <span className="font-medium text-slate-800">{g.members.length} parameters</span>
                <span>·</span>
                <ConfidenceBadge value={g.confidence} />
              </div>
              <Button variant="secondary" size="sm" onClick={() => merge(g)}>
                <Link2 className="h-3.5 w-3.5" /> Merge into one
              </Button>
            </div>
            <table className="w-full text-[12.5px]">
              <thead className="text-slate-500 text-left">
                <tr>
                  <th className="px-4 py-1.5 font-medium">Parameter</th>
                  <th className="px-3 py-1.5 font-medium">Code</th>
                  <th className="px-3 py-1.5 font-medium">Integration</th>
                  <th className="px-3 py-1.5 font-medium">Dictionary</th>
                  <th className="px-3 py-1.5 font-medium" />
                </tr>
              </thead>
              <tbody>
                {g.members.map((p, i) => (
                  <tr key={p.id} className="border-t border-slate-100">
                    <td className="px-4 py-1.5 text-slate-800">{p.name || '(Unnamed)'}</td>
                    <td className="px-3 py-1.5 font-mono text-[11px] text-slate-600">{p.code || '—'}</td>
                    <td className="px-3 py-1.5 font-mono text-[11px] text-slate-600">{p.integrationCode || '—'}</td>
                    <td className="px-3 py-1.5 text-slate-600">{p.dictionary || '—'}</td>
                    <td className="px-3 py-1.5">
                      {i === 0 ? (
                        <Badge tone="success">Primary (kept)</Badge>
                      ) : (
                        <span className="text-slate-400">will be disabled</span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ))}
        {groups.length === 0 && (
          <div className="rounded-lg border border-dashed border-slate-200 bg-white px-4 py-10 text-center text-slate-500 text-[13px]">
            No duplicates for the selected criteria.
          </div>
        )}
      </div>
    </CleanupShell>
  );
}

function ConfidenceBadge({ value }: { value: number }) {
  const tone = value >= 90 ? 'success' : value >= 70 ? 'warning' : 'danger';
  return (
    <span
      className={clsx(
        'inline-flex items-center rounded-full px-2 py-0.5 text-[11px] font-medium',
        tone === 'success' && 'bg-emerald-50 text-emerald-700',
        tone === 'warning' && 'bg-amber-50 text-amber-700',
        tone === 'danger' && 'bg-rose-50 text-rose-700',
      )}
    >
      {value}% confidence
    </span>
  );
}
