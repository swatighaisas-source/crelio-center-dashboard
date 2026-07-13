import { useMemo, useState } from 'react';
import { clsx } from 'clsx';
import { useStore } from '@/lib/store';
import { CleanupShell } from './CleanupShell';
import type { Parameter } from '@/types';

const RANGED = new Set([
  'TestWithNormalRange',
  'TestWithDescriptiveRange',
  'TestWithAgeSpecificRange',
]);

type CheckKey = 'code' | 'integrationCode' | 'loincCode' | 'unit' | 'method' | 'sampleType';

const CHECKS: { key: CheckKey; label: string }[] = [
  { key: 'sampleType', label: 'Sample type' },
  { key: 'code', label: 'Code' },
  { key: 'integrationCode', label: 'Integration Code' },
  { key: 'loincCode', label: 'LOINC Code' },
  { key: 'unit', label: 'Unit' },
  { key: 'method', label: 'Method' },
];

export function MissingFieldsScreen() {
  const { state } = useStore();
  const { parameters, tests, mappings } = state;
  const [only, setOnly] = useState<CheckKey | 'all'>('all');

  // testIds (without sample type) each library param is mapped to.
  const missingSampleByParam = useMemo(() => {
    const paramById = new Map(parameters.map((p) => [p.id, p] as const));
    const testById = new Map(tests.map((t) => [t.id, t] as const));
    const set = new Set<string>();
    for (const m of mappings) {
      const child = paramById.get(m.parameterId);
      const libId = child?.sourceLibraryParameterId ?? m.parameterId;
      const t = testById.get(m.testId);
      if (t && !t.sampleTypeId) set.add(libId);
    }
    return set;
  }, [parameters, tests, mappings]);

  const missingOf = (p: Parameter): Set<CheckKey> => {
    const s = new Set<CheckKey>();
    if (!p.code.trim()) s.add('code');
    if (!p.integrationCode.trim()) s.add('integrationCode');
    if (!p.loincCode.trim()) s.add('loincCode');
    if (RANGED.has(p.type) && !p.unit.trim()) s.add('unit');
    if (!p.method.trim()) s.add('method');
    if (missingSampleByParam.has(p.id)) s.add('sampleType');
    return s;
  };

  const rows = useMemo(() => {
    return parameters
      .filter((p) => !p.isTestLevel && !p.disabled)
      .map((p) => ({ p, missing: missingOf(p) }))
      .filter((r) => r.missing.size > 0)
      .filter((r) => only === 'all' || r.missing.has(only));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [parameters, missingSampleByParam, only]);

  const counts = useMemo(() => {
    const c: Record<CheckKey, number> = {
      sampleType: 0,
      code: 0,
      integrationCode: 0,
      loincCode: 0,
      unit: 0,
      method: 0,
    };
    for (const p of parameters.filter((x) => !x.isTestLevel && !x.disabled)) {
      missingOf(p).forEach((k) => (c[k] += 1));
    }
    return c;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [parameters, missingSampleByParam]);

  return (
    <CleanupShell
      title="Missing fields"
      description="Parameters with important information left blank. Click a category to filter, then open a parameter in the library to fill it in."
    >
      {/* Category summary chips */}
      <div className="flex flex-wrap gap-2 mb-4">
        <Chip label="All" count={rows.length} active={only === 'all'} onClick={() => setOnly('all')} />
        {CHECKS.map((c) => (
          <Chip
            key={c.key}
            label={c.label}
            count={counts[c.key]}
            active={only === c.key}
            onClick={() => setOnly(c.key)}
          />
        ))}
      </div>

      <div className="overflow-hidden rounded-lg border border-slate-200 bg-white">
        <table className="w-full text-[12.5px]">
          <thead className="bg-slate-50 text-slate-500 text-left">
            <tr>
              <th className="px-3 py-2 font-medium">Parameter</th>
              <th className="px-3 py-2 font-medium">Code</th>
              <th className="px-3 py-2 font-medium">Type</th>
              <th className="px-3 py-2 font-medium">Missing</th>
            </tr>
          </thead>
          <tbody>
            {rows.map(({ p, missing }) => (
              <tr key={p.id} className="border-t border-slate-100 hover:bg-slate-50">
                <td className="px-3 py-2 text-slate-800 font-medium">{p.name || '(Unnamed)'}</td>
                <td className="px-3 py-2 font-mono text-[11px] text-slate-600">{p.code || '—'}</td>
                <td className="px-3 py-2 text-slate-600">{p.type}</td>
                <td className="px-3 py-2">
                  <div className="flex flex-wrap gap-1">
                    {CHECKS.filter((c) => missing.has(c.key)).map((c) => (
                      <span
                        key={c.key}
                        className="inline-flex items-center rounded-full bg-rose-50 text-rose-700 px-2 py-0.5 text-[11px] font-medium"
                      >
                        {c.label}
                      </span>
                    ))}
                  </div>
                </td>
              </tr>
            ))}
            {rows.length === 0 && (
              <tr>
                <td colSpan={4} className="px-3 py-10 text-center text-slate-500">
                  Nothing missing here. 🎉
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </CleanupShell>
  );
}

function Chip({
  label,
  count,
  active,
  onClick,
}: {
  label: string;
  count: number;
  active: boolean;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={clsx(
        'inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 text-[12px] border transition-colors',
        active
          ? 'border-[#2563eb] bg-blue-50 text-[#2563eb]'
          : 'border-slate-200 bg-white text-slate-600 hover:bg-slate-50',
      )}
    >
      {label}
      <span
        className={clsx(
          'inline-flex items-center justify-center min-w-5 h-5 px-1 rounded-full text-[11px]',
          active ? 'bg-[#2563eb] text-white' : 'bg-slate-100 text-slate-600',
        )}
      >
        {count}
      </span>
    </button>
  );
}
