import { ArrowDownToLine, ArrowUpToLine, MoveDown } from 'lucide-react';
import { clsx } from 'clsx';
import type { Parameter, Test, TestParameterMapping } from '@/types';
import type { PlacementRule } from '@/lib/store';

export type PlacementKind = PlacementRule['kind'];

interface Option {
  id: PlacementKind;
  label: string;
  hint: string;
  Icon: typeof ArrowDownToLine;
}

const OPTIONS: Option[] = [
  {
    id: 'end',
    label: 'Add at end',
    hint: 'Append in library catalog order.',
    Icon: ArrowDownToLine,
  },
  {
    id: 'start',
    label: 'Add at beginning',
    hint: 'Insert above existing mappings.',
    Icon: ArrowUpToLine,
  },
  {
    id: 'afterAnchor',
    label: 'Insert after…',
    hint: 'Insert after a parameter in the selected test.',
    Icon: MoveDown,
  },
];

/**
 * Compact icon-row placement rule picker. Lives at the bottom of the Mapping
 * Workspace: shows four icon buttons with a single helper line describing the
 * active rule. Full labels appear as tooltips so the control stays tight.
 */
export function PlacementRuleSelector({
  kind,
  anchorMappingId,
  onKindChange,
  onAnchorChange,
  singleSelectedTest,
  existingMappings,
  parameterById,
}: {
  kind: PlacementKind;
  anchorMappingId: string | null;
  onKindChange: (next: PlacementKind) => void;
  onAnchorChange: (id: string | null) => void;
  singleSelectedTest: Test | null;
  existingMappings: TestParameterMapping[];
  parameterById: Map<string, Parameter>;
}) {
  const active = OPTIONS.find((o) => o.id === kind) ?? OPTIONS[0];

  return (
    <div className="flex flex-col gap-1.5">
      <div className="flex items-center gap-2 flex-wrap">
        <div className="flex items-center rounded-md border border-slate-200 bg-white overflow-hidden">
          {OPTIONS.map((o) => {
            const disabled = o.id === 'afterAnchor' && !singleSelectedTest;
            const isActive = o.id === kind;
            return (
              <button
                key={o.id}
                type="button"
                disabled={disabled}
                onClick={() => {
                  onKindChange(o.id);
                  if (o.id !== 'afterAnchor') onAnchorChange(null);
                }}
                title={
                  disabled
                    ? 'Available only when exactly one test is selected'
                    : `${o.label} — ${o.hint}`
                }
                aria-label={o.label}
                aria-pressed={isActive}
                className={clsx(
                  'h-8 w-9 flex items-center justify-center transition-colors border-r border-slate-200 last:border-r-0',
                  isActive
                    ? 'bg-blue-50 text-blue-700'
                    : 'text-slate-500 hover:bg-slate-50 hover:text-slate-700',
                  disabled && 'opacity-40 cursor-not-allowed hover:bg-transparent hover:text-slate-500',
                )}
              >
                <o.Icon className="h-4 w-4" />
              </button>
            );
          })}
        </div>

        {kind === 'afterAnchor' && singleSelectedTest && (
          <select
            value={anchorMappingId ?? ''}
            onChange={(e) => onAnchorChange(e.target.value || null)}
            className="h-8 rounded-md border border-slate-300 bg-white px-2 text-[12px] min-w-[160px] max-w-[260px]"
          >
            <option value="">— Anchor parameter —</option>
            {existingMappings.map((m) => {
              const p = parameterById.get(m.parameterId);
              const label = p ? `${m.sequence}. ${p.name}` : `${m.sequence}. (missing)`;
              return (
                <option key={m.id} value={m.id}>
                  {label}
                </option>
              );
            })}
          </select>
        )}
      </div>

      <div className="text-[11px] text-slate-500 leading-snug">
        <span className="font-medium text-slate-700">{active.label}</span> — {active.hint}
        {kind === 'afterAnchor' && !singleSelectedTest && (
          <span className="text-amber-700">
            {' '}· Select exactly one test to pick an anchor.
          </span>
        )}
      </div>
    </div>
  );
}
