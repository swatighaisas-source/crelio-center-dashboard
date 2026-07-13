import { useEffect, useRef, useState } from 'react';
import { clsx } from 'clsx';
import { ChevronDown, SlidersHorizontal } from 'lucide-react';
import { PARAMETER_TYPES, PARAMETER_TYPE_LABELS } from '@/lib/parameterDefaults';
import { PARAMETER_COLUMN_TOGGLES } from './buildParameterColumnDefs';
import type { ParameterType } from '@/types';

interface Props {
  /** Selected parameter types (rows). All selected = no row filtering. */
  selectedTypes: Set<ParameterType>;
  onToggleType: (t: ParameterType) => void;
  onSetAllTypes: (all: boolean) => void;
  /** Visible column-group header names. */
  visibleGroups: Set<string>;
  onToggleGroup: (g: string) => void;
  onSetAllGroups: (all: boolean) => void;
}

/**
 * Toolbar "Filter" control. One dropdown with two sections:
 *   • Parameter type — filters which rows are shown.
 *   • Columns — toggles which column groups are shown in the grid.
 */
export function ParameterGridFilterMenu({
  selectedTypes,
  onToggleType,
  onSetAllTypes,
  visibleGroups,
  onToggleGroup,
  onSetAllGroups,
}: Props) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function onDoc(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    }
    if (open) document.addEventListener('mousedown', onDoc);
    return () => document.removeEventListener('mousedown', onDoc);
  }, [open]);

  const typesAll = selectedTypes.size === PARAMETER_TYPES.length;
  const groupsAll = visibleGroups.size === PARAMETER_COLUMN_TOGGLES.length;
  const activeFilters =
    (typesAll ? 0 : 1) + (groupsAll ? 0 : 1);

  return (
    <div className="relative" ref={ref}>
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        className={clsx(
          'inline-flex items-center gap-1.5 h-8 px-2.5 rounded-md border text-[12px] font-medium transition-colors',
          activeFilters > 0
            ? 'border-[#2563eb] text-[#2563eb] bg-blue-50'
            : 'border-slate-300 text-slate-600 bg-white hover:bg-slate-50',
        )}
      >
        <SlidersHorizontal className="h-3.5 w-3.5" />
        Filter
        {activeFilters > 0 && (
          <span className="ml-0.5 inline-flex items-center justify-center h-4 min-w-4 px-1 rounded-full bg-[#2563eb] text-white text-[10px]">
            {activeFilters}
          </span>
        )}
        <ChevronDown className="h-3.5 w-3.5 opacity-70" />
      </button>

      {open && (
        <div className="absolute right-0 top-full mt-1 w-[300px] rounded-md border border-slate-200 bg-white shadow-lg z-30 p-3 grid grid-cols-2 gap-4 text-[12px]">
          <Section
            title="Parameter type"
            allChecked={typesAll}
            someChecked={selectedTypes.size > 0}
            onToggleAll={() => onSetAllTypes(!typesAll)}
          >
            {PARAMETER_TYPES.map((t) => (
              <Row
                key={t}
                label={PARAMETER_TYPE_LABELS[t]}
                checked={selectedTypes.has(t)}
                onToggle={() => onToggleType(t)}
              />
            ))}
          </Section>

          <Section
            title="Columns"
            allChecked={groupsAll}
            someChecked={visibleGroups.size > 0}
            onToggleAll={() => onSetAllGroups(!groupsAll)}
          >
            {PARAMETER_COLUMN_TOGGLES.map((g) => (
              <Row
                key={g}
                label={g}
                checked={visibleGroups.has(g)}
                onToggle={() => onToggleGroup(g)}
              />
            ))}
          </Section>
        </div>
      )}
    </div>
  );
}

function Section({
  title,
  allChecked,
  someChecked,
  onToggleAll,
  children,
}: {
  title: string;
  allChecked: boolean;
  someChecked: boolean;
  onToggleAll: () => void;
  children: React.ReactNode;
}) {
  return (
    <div className="min-w-0">
      <div className="text-[11px] font-semibold uppercase tracking-wide text-slate-500 mb-1.5">
        {title}
      </div>
      <label className="flex items-center gap-2 px-1 py-1 cursor-pointer hover:bg-slate-50 rounded">
        <input
          type="checkbox"
          className="accent-blue-600"
          checked={allChecked}
          ref={(el) => {
            if (el) el.indeterminate = !allChecked && someChecked;
          }}
          onChange={onToggleAll}
        />
        <span className="font-medium">All</span>
      </label>
      <div className="max-h-[230px] overflow-auto border-t border-slate-100 mt-1 pt-1">
        {children}
      </div>
    </div>
  );
}

function Row({
  label,
  checked,
  onToggle,
}: {
  label: string;
  checked: boolean;
  onToggle: () => void;
}) {
  return (
    <label className="flex items-center gap-2 px-1 py-1 cursor-pointer hover:bg-slate-50 rounded">
      <input
        type="checkbox"
        className="accent-blue-600 shrink-0"
        checked={checked}
        onChange={onToggle}
      />
      <span className="truncate" title={label}>
        {label}
      </span>
    </label>
  );
}
