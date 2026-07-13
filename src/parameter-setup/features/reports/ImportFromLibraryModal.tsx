import { useMemo, useState } from 'react';
import { clsx } from 'clsx';
import { Check, Search, X } from 'lucide-react';
import { useStore } from '@/lib/store';
import { Badge, Button, Input } from '@/components/UI';
import type { Parameter } from '@/types';

interface Props {
  open: boolean;
  testId: string;
  /** Library parameter ids already linked to the current test (disabled rows). */
  alreadyLinkedLibraryIds: Set<string>;
  onClose: () => void;
  onImport: (libraryParameterId: string) => void;
}

export function ImportFromLibraryModal({
  open,
  alreadyLinkedLibraryIds,
  onClose,
  onImport,
}: Props) {
  const { state } = useStore();
  const [search, setSearch] = useState('');
  const [typeFilter, setTypeFilter] = useState<Parameter['type'] | 'all'>('all');
  const [selectedId, setSelectedId] = useState<string | null>(null);
  // Prototype-only: open on a short explainer of what the library is.
  const [showIntro, setShowIntro] = useState(true);

  const libraryParams = useMemo(
    () => state.parameters.filter((p) => !p.isTestLevel),
    [state.parameters],
  );

  // Usage count per library parameter (including Case A: direct mappings to
  // library rows for any legacy tests, and Case B: linked children).
  const usageByLibraryId = useMemo(() => {
    const counts = new Map<string, Set<string>>();
    const paramById = new Map(state.parameters.map((p) => [p.id, p] as const));
    for (const m of state.mappings) {
      const child = paramById.get(m.parameterId);
      const libId = child?.sourceLibraryParameterId ?? m.parameterId;
      if (!counts.has(libId)) counts.set(libId, new Set());
      counts.get(libId)!.add(m.testId);
    }
    return counts;
  }, [state.mappings, state.parameters]);

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    return libraryParams.filter((p) => {
      if (typeFilter !== 'all' && p.type !== typeFilter) return false;
      if (!q) return true;
      return (
        p.name.toLowerCase().includes(q) || p.code.toLowerCase().includes(q)
      );
    });
  }, [libraryParams, search, typeFilter]);

  if (!open) return null;

  const selected = selectedId
    ? libraryParams.find((p) => p.id === selectedId) ?? null
    : null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 p-4">
      <div className="w-full max-w-3xl max-h-[85vh] flex flex-col rounded-lg bg-white shadow-xl border border-slate-200">
        <div className="flex items-center justify-between px-5 py-3 border-b border-slate-200">
          <div>
            <h3 className="text-[14px] font-semibold text-slate-900">
              Import from Parameter Library
            </h3>
            <p className="text-[12px] text-slate-500 mt-0.5">
              Select a parameter to import. A linked test-level instance will be
              created so future library updates can flow through.
            </p>
          </div>
          <div className="flex items-center gap-3 shrink-0">
            <label
              className="flex items-center gap-1.5 text-[11.5px] text-slate-500 cursor-pointer select-none"
              title="Prototype only — preview the library explainer"
            >
              <span>Intro</span>
              <span
                className={clsx(
                  'relative inline-block h-4 w-7 rounded-full transition-colors',
                  showIntro ? 'bg-blue-600' : 'bg-slate-300',
                )}
              >
                <span
                  className={clsx(
                    'absolute top-0.5 h-3 w-3 rounded-full bg-white shadow-sm transition-all',
                    showIntro ? 'left-3.5' : 'left-0.5',
                  )}
                />
              </span>
              <input
                type="checkbox"
                className="sr-only"
                checked={showIntro}
                onChange={(e) => setShowIntro(e.target.checked)}
              />
            </label>
            <button
              type="button"
              onClick={onClose}
              className="p-1 rounded hover:bg-slate-100 text-slate-500"
              aria-label="Close"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
        </div>

        {showIntro ? (
          <LibraryIntro onBrowse={() => setShowIntro(false)} />
        ) : (
          <>
        <div className="px-5 py-3 border-b border-slate-200 flex items-center gap-2">
          <div className="relative flex-1">
            <Search className="absolute left-2 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-slate-400" />
            <Input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search by name or code"
              className="pl-7 w-full"
            />
          </div>
          <select
            value={typeFilter}
            onChange={(e) =>
              setTypeFilter(e.target.value as Parameter['type'] | 'all')
            }
            className="h-9 rounded-md border border-slate-300 bg-white px-2 text-[12.5px] text-slate-700"
          >
            <option value="all">All types</option>
            <option value="TestWithNormalRange">Normal Range</option>
            <option value="TestWithAgeSpecificRange">Age-Specific</option>
            <option value="TestWithDescriptiveRange">Descriptive Range</option>
            <option value="DescriptiveNoRanges">Descriptive (no ranges)</option>
            <option value="ListField">List</option>
            <option value="File">File</option>
            <option value="Graph">Graph</option>
            <option value="Image">Image</option>
          </select>
        </div>

        <div className="flex-1 min-h-0 overflow-auto">
          <table className="w-full text-[12.5px]">
            <thead className="sticky top-0 bg-slate-50 text-slate-600 text-[11.5px] uppercase tracking-wide">
              <tr>
                <th className="text-left font-medium px-4 py-2 w-[38%]">
                  Parameter
                </th>
                <th className="text-left font-medium px-3 py-2 w-[22%]">Type</th>
                <th className="text-left font-medium px-3 py-2 w-[15%]">Unit</th>
                <th className="text-left font-medium px-3 py-2 w-[15%]">
                  Used in
                </th>
                <th className="text-left font-medium px-3 py-2 w-[10%]"></th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((p) => {
                const disabled = alreadyLinkedLibraryIds.has(p.id);
                const isSelected = selectedId === p.id;
                const usedIn = usageByLibraryId.get(p.id)?.size ?? 0;
                return (
                  <tr
                    key={p.id}
                    onClick={() => !disabled && setSelectedId(p.id)}
                    className={clsx(
                      'border-b border-slate-100',
                      disabled
                        ? 'opacity-60 cursor-not-allowed'
                        : 'cursor-pointer hover:bg-slate-50',
                      isSelected && !disabled && 'bg-blue-50/60',
                    )}
                  >
                    <td className="px-4 py-2">
                      <div className="flex items-center gap-2">
                        <span
                          className={clsx(
                            'h-3.5 w-3.5 rounded-full border flex items-center justify-center',
                            isSelected
                              ? 'bg-blue-600 border-blue-600'
                              : 'border-slate-300',
                          )}
                        >
                          {isSelected && (
                            <Check className="h-2.5 w-2.5 text-white" />
                          )}
                        </span>
                        <div>
                          <div className="font-medium text-slate-900">
                            {p.name}
                          </div>
                          <div className="text-[11px] text-slate-500">{p.code}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-3 py-2 text-slate-600">{p.type}</td>
                    <td className="px-3 py-2 text-slate-600">{p.unit || '—'}</td>
                    <td className="px-3 py-2">
                      {usedIn > 0 ? (
                        <Badge tone="info">
                          {usedIn} test{usedIn === 1 ? '' : 's'}
                        </Badge>
                      ) : (
                        <span className="text-slate-400">—</span>
                      )}
                    </td>
                    <td className="px-3 py-2">
                      {disabled && (
                        <Badge tone="neutral">Already linked</Badge>
                      )}
                    </td>
                  </tr>
                );
              })}
              {filtered.length === 0 && (
                <tr>
                  <td
                    colSpan={5}
                    className="px-4 py-10 text-center text-slate-500"
                  >
                    No library parameters match your search.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
          </>
        )}

        <div className="flex items-center justify-between px-5 py-3 border-t border-slate-200 bg-slate-50/60">
          <div className="text-[12px] text-slate-500">
            {showIntro ? (
              <span>A quick intro — toggle off to browse the library.</span>
            ) : selected ? (
              <span>
                Selected: <span className="font-medium">{selected.name}</span>
              </span>
            ) : (
              <span>No parameter selected</span>
            )}
          </div>
          <div className="flex items-center gap-2">
            <Button variant="secondary" size="sm" onClick={onClose}>
              Cancel
            </Button>
            <Button
              variant="primary"
              size="sm"
              disabled={!selected}
              onClick={() => {
                if (selected) {
                  onImport(selected.id);
                  setSelectedId(null);
                }
              }}
            >
              Import Parameter
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}

/**
 * Prototype explainer shown when the "Intro" toggle is on — teaches the library
 * concept with a soft illustration, styled like the app's empty states.
 */
function LibraryIntro({ onBrowse }: { onBrowse: () => void }) {
  return (
    <div className="flex-1 min-h-0 flex flex-col items-center justify-center text-center px-8 py-12">
      <LibraryIllustration />
      <h4 className="mt-7 text-[16px] font-semibold text-slate-800">
        One parameter, shared across every test
      </h4>
      <p className="mt-2 max-w-md text-[13px] text-slate-500 leading-relaxed">
        The library is your reusable set of parameters. Add one to this test from
        the library, and any future edit to it flows to every test that uses it —
        so you set it up once instead of re-entering it each time.
      </p>
      <div className="mt-6">
        <Button variant="primary" size="sm" onClick={onBrowse}>
          Browse the library
        </Button>
      </div>
    </div>
  );
}

function LibraryIllustration() {
  return (
    <svg
      width="208"
      height="150"
      viewBox="0 0 208 150"
      fill="none"
      role="img"
      aria-label="Shared parameter library"
    >
      {/* stacked cards — the shared library */}
      <rect x="34" y="46" width="96" height="62" rx="9" fill="#eef2f8" />
      <rect x="46" y="38" width="96" height="62" rx="9" fill="#e6ecf5" />
      <rect
        x="58"
        y="50"
        width="96"
        height="64"
        rx="9"
        fill="#f9fbfe"
        stroke="#cdd8e8"
        strokeWidth="1.5"
      />
      {/* lines on the front card */}
      <rect x="70" y="64" width="48" height="7" rx="3.5" fill="#c7d3e6" />
      <rect x="70" y="80" width="66" height="6" rx="3" fill="#dde5f1" />
      <rect x="70" y="94" width="40" height="6" rx="3" fill="#dde5f1" />
      {/* link node — "shared / reused" */}
      <circle cx="154" cy="66" r="13" fill="#dbe7ff" />
      <path
        d="M150 66a4 4 0 0 1 4-4h2M158 66a4 4 0 0 1-4 4h-2"
        stroke="#3b71e8"
        strokeWidth="2"
        strokeLinecap="round"
      />
      <path d="M151 66h6" stroke="#3b71e8" strokeWidth="2" strokeLinecap="round" />
      {/* accent dots + plus marks (muted, like the notifications illustration) */}
      <circle cx="28" cy="60" r="3.2" fill="#9db8f0" />
      <circle cx="180" cy="104" r="2.6" fill="#f1c27a" />
      <circle cx="158" cy="36" r="2" fill="#cdd8e8" />
      <path
        d="M26 100v8M22 104h8"
        stroke="#9db8f0"
        strokeWidth="1.6"
        strokeLinecap="round"
      />
      <path
        d="M186 54v7M182.5 57.5h7"
        stroke="#f1c27a"
        strokeWidth="1.6"
        strokeLinecap="round"
      />
    </svg>
  );
}
