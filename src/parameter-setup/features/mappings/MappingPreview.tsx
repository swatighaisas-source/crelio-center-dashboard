import { ArrowRight } from 'lucide-react';
import { clsx } from 'clsx';
import type { Parameter, Test } from '@/types';

export interface SkipWarning {
  testId: string;
  testLabel: string;
  libraryParameterId: string;
  libraryParameterLabel: string;
}

export interface MappingPreviewProps {
  selectedParameters: Parameter[];
  selectedTests: Test[];
  plannedCount: number;
}

/**
 * Compact visual preview of the mapping that will be created: parameters →
 * tests, with a running count of how many new mappings this would produce.
 */
export function MappingPreview({
  selectedParameters,
  selectedTests,
  plannedCount,
}: MappingPreviewProps) {
  const empty = selectedParameters.length === 0 || selectedTests.length === 0;

  if (empty) {
    return (
      <div className="rounded-md border border-dashed border-slate-300 bg-white px-4 py-6 text-center">
        <div className="text-[13px] font-medium text-slate-800">
          Select parameters and tests to preview the mapping.
        </div>
        <div className="text-[11px] text-slate-500 mt-1 leading-snug">
          Choose items from the Parameter Library on the left and Tests on the right.
        </div>
      </div>
    );
  }

  return (
    <div className="rounded-md border border-slate-200 bg-white">
      <div className="px-3 py-2 border-b border-slate-100 flex items-center justify-between">
        <div className="text-[12px] font-semibold text-slate-800">Will be added</div>
        <div className="text-[11px] text-slate-500">
          <span className="font-semibold text-blue-700">{plannedCount}</span> new mapping
          {plannedCount === 1 ? '' : 's'}
        </div>
      </div>

      <div className="px-3 py-3 grid grid-cols-[1fr_auto_1fr] items-start gap-3">
        <ChipList
          label="Parameters"
          count={selectedParameters.length}
          items={selectedParameters.map((p) => ({
            id: p.id,
            label: p.name || p.code,
            sub: p.code,
          }))}
          tone="info"
        />
        <div className="flex items-center justify-center h-full pt-5 text-slate-400">
          <ArrowRight className="h-4 w-4" />
        </div>
        <ChipList
          label="Tests"
          count={selectedTests.length}
          items={selectedTests.map((t) => ({
            id: t.id,
            label: t.name || t.code,
            sub: t.code,
          }))}
          tone="neutral"
        />
      </div>
    </div>
  );
}

function ChipList({
  label,
  count,
  items,
  tone,
}: {
  label: string;
  count: number;
  items: { id: string; label: string; sub?: string }[];
  tone: 'info' | 'neutral';
}) {
  return (
    <div className="min-w-0">
      <div className="text-[10px] uppercase tracking-wide text-slate-500 font-semibold mb-1.5">
        {label} ({count})
      </div>
      <div className="flex flex-wrap gap-1">
        {items.slice(0, 16).map((it) => (
          <span
            key={it.id}
            title={it.sub}
            className={clsx(
              'inline-flex items-center rounded border px-1.5 py-0.5 text-[11px] max-w-full',
              tone === 'info'
                ? 'border-sky-200 bg-sky-50 text-sky-800'
                : 'border-slate-200 bg-slate-50 text-slate-700',
            )}
          >
            <span className="truncate">{it.label}</span>
          </span>
        ))}
        {items.length > 16 && (
          <span className="text-[11px] text-slate-500">+{items.length - 16} more</span>
        )}
      </div>
    </div>
  );
}
