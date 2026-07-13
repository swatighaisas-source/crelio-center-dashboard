import { useMemo, useState } from 'react';
import { clsx } from 'clsx';
import { Cpu } from 'lucide-react';
import { useStore } from '@/lib/store';
import { CleanupShell } from './CleanupShell';

const DEVICES = [
  'Sysmex XN-1000',
  'Roche Cobas c311',
  'Abbott Architect i1000',
  'Mindray BS-240',
] as const;

/** Deterministic analyte channels per device (prototype data). */
function channelsFor(device: string): { code: string; name: string }[] {
  const presets: Record<string, { code: string; name: string }[]> = {
    'Sysmex XN-1000': [
      { code: 'WBC', name: 'White Blood Cells' },
      { code: 'RBC', name: 'Red Blood Cells' },
      { code: 'HGB', name: 'Hemoglobin' },
      { code: 'PLT', name: 'Platelets' },
    ],
    'Roche Cobas c311': [
      { code: 'GLU', name: 'Glucose' },
      { code: 'CREA', name: 'Creatinine' },
      { code: 'ALT', name: 'Alanine Transaminase' },
      { code: 'AST', name: 'Aspartate Transaminase' },
    ],
    'Abbott Architect i1000': [
      { code: 'TSH', name: 'Thyroid Stimulating Hormone' },
      { code: 'FT4', name: 'Free T4' },
      { code: 'VITD', name: 'Vitamin D' },
    ],
    'Mindray BS-240': [
      { code: 'CHOL', name: 'Total Cholesterol' },
      { code: 'HDL', name: 'HDL Cholesterol' },
      { code: 'TRIG', name: 'Triglycerides' },
    ],
  };
  return presets[device] ?? [];
}

type Tab = 'interfacing' | 'qc';

export function QcInterfacingScreen() {
  const { state } = useStore();
  const libraryParams = useMemo(
    () => state.parameters.filter((p) => !p.isTestLevel && !p.disabled),
    [state.parameters],
  );

  const [device, setDevice] = useState<string>(DEVICES[0]);
  const [tab, setTab] = useState<Tab>('interfacing');
  const channels = useMemo(() => channelsFor(device), [device]);

  // Prototype-only local mappings, keyed by `${device}:${channelCode}`.
  const [mapping, setMapping] = useState<Record<string, string>>({});
  const [qc, setQc] = useState<Record<string, { mean: string; sd: string }>>({});

  const setMap = (code: string, paramId: string) =>
    setMapping((m) => ({ ...m, [`${device}:${code}`]: paramId }));
  const setQcVal = (key: string, field: 'mean' | 'sd', value: string) =>
    setQc((q) => ({ ...q, [key]: { ...(q[key] ?? { mean: '', sd: '' }), [field]: value } }));

  return (
    <CleanupShell
      title="QC & Interfacing mapping"
      description="Map an analyser's channels to your library parameters for result interfacing, and set quality-control targets per analyte."
      actions={
        <div className="flex items-center gap-2">
          <Cpu className="h-4 w-4 text-slate-400" />
          <select
            value={device}
            onChange={(e) => setDevice(e.target.value)}
            className="h-9 rounded-md border border-slate-300 bg-white px-2 text-[13px] text-slate-700"
          >
            {DEVICES.map((d) => (
              <option key={d} value={d}>
                {d}
              </option>
            ))}
          </select>
        </div>
      }
    >
      <div className="flex items-center gap-0 border-b border-slate-200 mb-4">
        {(['interfacing', 'qc'] as Tab[]).map((t) => (
          <button
            key={t}
            type="button"
            onClick={() => setTab(t)}
            className={clsx(
              'px-4 py-2.5 text-[13px] border-b-2 -mb-px',
              tab === t
                ? 'border-[#2563eb] text-[#2563eb] font-semibold'
                : 'border-transparent text-slate-500 hover:text-slate-700',
            )}
          >
            {t === 'interfacing' ? 'Interfacing mapping' : 'QC mapping'}
          </button>
        ))}
      </div>

      {tab === 'interfacing' ? (
        <div className="overflow-hidden rounded-lg border border-slate-200 bg-white">
          <table className="w-full text-[12.5px]">
            <thead className="bg-slate-50 text-slate-500 text-left">
              <tr>
                <th className="px-3 py-2 font-medium w-32">Device code</th>
                <th className="px-3 py-2 font-medium">Analyte</th>
                <th className="px-3 py-2 font-medium w-[40%]">Mapped library parameter</th>
              </tr>
            </thead>
            <tbody>
              {channels.map((ch) => (
                <tr key={ch.code} className="border-t border-slate-100">
                  <td className="px-3 py-2 font-mono text-[11px] text-slate-700">{ch.code}</td>
                  <td className="px-3 py-2 text-slate-700">{ch.name}</td>
                  <td className="px-3 py-2">
                    <select
                      value={mapping[`${device}:${ch.code}`] ?? ''}
                      onChange={(e) => setMap(ch.code, e.target.value)}
                      className="w-full h-8 rounded border border-slate-300 bg-white px-2 text-[12px]"
                    >
                      <option value="">— Not mapped —</option>
                      {libraryParams.map((p) => (
                        <option key={p.id} value={p.id}>
                          {p.name} {p.code ? `(${p.code})` : ''}
                        </option>
                      ))}
                    </select>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <div className="overflow-hidden rounded-lg border border-slate-200 bg-white">
          <table className="w-full text-[12.5px]">
            <thead className="bg-slate-50 text-slate-500 text-left">
              <tr>
                <th className="px-3 py-2 font-medium">Analyte</th>
                <th className="px-3 py-2 font-medium">QC level</th>
                <th className="px-3 py-2 font-medium">Lot</th>
                <th className="px-3 py-2 font-medium w-28">Target mean</th>
                <th className="px-3 py-2 font-medium w-28">Target SD</th>
              </tr>
            </thead>
            <tbody>
              {channels.flatMap((ch) =>
                ['Level 1', 'Level 2'].map((lvl) => {
                  const key = `${device}:${ch.code}:${lvl}`;
                  return (
                    <tr key={key} className="border-t border-slate-100">
                      <td className="px-3 py-2 text-slate-700">{ch.name}</td>
                      <td className="px-3 py-2 text-slate-600">{lvl}</td>
                      <td className="px-3 py-2 font-mono text-[11px] text-slate-600">
                        QC-{ch.code}-{lvl === 'Level 1' ? 'L' : 'H'}
                      </td>
                      <td className="px-3 py-2">
                        <input
                          value={qc[key]?.mean ?? ''}
                          onChange={(e) => setQcVal(key, 'mean', e.target.value)}
                          className="w-full h-8 rounded border border-slate-300 px-2 text-[12px] text-right"
                          placeholder="—"
                        />
                      </td>
                      <td className="px-3 py-2">
                        <input
                          value={qc[key]?.sd ?? ''}
                          onChange={(e) => setQcVal(key, 'sd', e.target.value)}
                          className="w-full h-8 rounded border border-slate-300 px-2 text-[12px] text-right"
                          placeholder="—"
                        />
                      </td>
                    </tr>
                  );
                }),
              )}
            </tbody>
          </table>
        </div>
      )}

      <p className="mt-3 text-[11px] text-slate-400">
        Prototype only — mappings and QC targets here are not persisted.
      </p>
    </CleanupShell>
  );
}
