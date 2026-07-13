import { AlertTriangle, CheckCircle2, Plus, X } from 'lucide-react';
import type { Parameter, Test, TestParameterMapping } from '@/types';
import { Button } from '@/components/UI';
import {
  PlacementRuleSelector,
  type PlacementKind,
} from './PlacementRuleSelector';
import { MappingPreview, type SkipWarning } from './MappingPreview';

export interface MappingWorkspaceProps {
  selectedParameters: Parameter[];
  selectedTests: Test[];

  placementKind: PlacementKind;
  anchorMappingId: string | null;
  onPlacementKindChange: (k: PlacementKind) => void;
  onAnchorMappingIdChange: (id: string | null) => void;

  skipped: SkipWarning[];
  plannedCount: number;

  /** Mappings for the single selected test, used only for the anchor selector. */
  anchorCandidateMappings: TestParameterMapping[];
  parameterById: Map<string, Parameter>;

  onApply: () => void;
  onClearSelections: () => void;
  lastResult: { created: number; skipped: number } | null;
  onDismissResult: () => void;
}

/**
 * Middle column. Top-down layout:
 *   1. Skip warnings (if any) — explicit reasons up front.
 *   2. Success banner after apply (dismissible).
 *   3. Visual preview of what will be added.
 *   4. Bottom bar: placement rule icons + Clear / Add to Tests.
 */
export function MappingWorkspace({
  selectedParameters,
  selectedTests,
  placementKind,
  anchorMappingId,
  onPlacementKindChange,
  onAnchorMappingIdChange,
  skipped,
  plannedCount,
  anchorCandidateMappings,
  parameterById,
  onApply,
  onClearSelections,
  lastResult,
  onDismissResult,
}: MappingWorkspaceProps) {
  const empty = selectedParameters.length === 0 || selectedTests.length === 0;
  const singleSelectedTest = selectedTests.length === 1 ? selectedTests[0] : null;

  const canApply =
    !empty &&
    plannedCount > 0 &&
    (placementKind !== 'afterAnchor' || !!anchorMappingId);

  return (
    <div className="flex flex-col h-full min-h-0 bg-slate-50/60">
      <div className="px-3 py-2 border-b border-slate-200 bg-white">
        <div className="text-[13px] font-semibold text-slate-900">Mapping Workspace</div>
        <div className="text-[11px] text-slate-500">
          Adding from library creates linked test-level parameter instances.
        </div>
      </div>

      <div className="flex-1 min-h-0 overflow-y-auto scrollbar-thin p-3 space-y-3">
        {skipped.length > 0 && <SkipWarnings skipped={skipped} />}

        {lastResult && (
          <div className="rounded-md border border-emerald-200 bg-emerald-50/80 px-3 py-2 flex items-start gap-2">
            <CheckCircle2 className="h-4 w-4 text-emerald-600 mt-0.5 shrink-0" />
            <div className="flex-1 min-w-0">
              <div className="text-[12px] font-medium text-emerald-800">
                {lastResult.created} mapping{lastResult.created === 1 ? '' : 's'} created
              </div>
              {lastResult.skipped > 0 && (
                <div className="text-[11px] text-emerald-700">
                  {lastResult.skipped} skipped (already mapped).
                </div>
              )}
            </div>
            <button
              type="button"
              onClick={onDismissResult}
              className="text-emerald-600/70 hover:text-emerald-800"
            >
              <X className="h-3.5 w-3.5" />
            </button>
          </div>
        )}

        <MappingPreview
          selectedParameters={selectedParameters}
          selectedTests={selectedTests}
          plannedCount={plannedCount}
        />
      </div>

      <div className="border-t border-slate-200 bg-white px-3 py-2 space-y-2">
        <PlacementRuleSelector
          kind={placementKind}
          anchorMappingId={anchorMappingId}
          onKindChange={onPlacementKindChange}
          onAnchorChange={onAnchorMappingIdChange}
          singleSelectedTest={singleSelectedTest}
          existingMappings={anchorCandidateMappings}
          parameterById={parameterById}
        />

        <div className="flex items-center justify-between gap-2 pt-1 border-t border-slate-100">
          <div className="text-[11px] text-slate-500 truncate">
            {empty
              ? 'Select parameters and tests to begin.'
              : `${plannedCount} new · ${skipped.length} skipped`}
          </div>
          <div className="flex items-center gap-2">
            <Button size="sm" variant="ghost" onClick={onClearSelections}>
              <X className="h-3.5 w-3.5" /> Clear selections
            </Button>
            <Button
              size="sm"
              variant="primary"
              disabled={!canApply}
              onClick={onApply}
            >
              <Plus className="h-3.5 w-3.5" />
              Add to Tests
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}

function SkipWarnings({ skipped }: { skipped: SkipWarning[] }) {
  // Group by test for a more compact, readable message.
  const byTest = new Map<string, { testLabel: string; params: string[] }>();
  for (const s of skipped) {
    let entry = byTest.get(s.testId);
    if (!entry) {
      entry = { testLabel: s.testLabel, params: [] };
      byTest.set(s.testId, entry);
    }
    entry.params.push(s.libraryParameterLabel);
  }

  return (
    <div className="rounded-md border border-amber-200 bg-amber-50/70">
      <div className="px-3 py-2 border-b border-amber-100 flex items-center gap-1.5 text-[12px] font-semibold text-amber-800">
        <AlertTriangle className="h-3.5 w-3.5" />
        {skipped.length} will be skipped — already mapped
      </div>
      <ul className="px-3 py-2 space-y-1 text-[11px] text-amber-900 max-h-32 overflow-y-auto scrollbar-thin">
        {Array.from(byTest.values())
          .slice(0, 8)
          .map((entry) => (
            <li key={entry.testLabel} className="flex gap-1.5">
              <span className="shrink-0 text-amber-700">•</span>
              <span className="min-w-0">
                <span className="font-medium">{entry.testLabel}</span>: {entry.params.join(', ')}
              </span>
            </li>
          ))}
        {byTest.size > 8 && (
          <li className="text-amber-700 pl-3">…and {byTest.size - 8} more tests</li>
        )}
      </ul>
    </div>
  );
}
