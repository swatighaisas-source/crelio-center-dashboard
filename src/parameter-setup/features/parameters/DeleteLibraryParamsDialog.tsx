import { useState } from 'react';
import { AlertTriangle, ChevronDown, ChevronRight, Unlink, X } from 'lucide-react';
import { Badge, Button } from '@/components/UI';

export interface DeletableLibraryParam {
  id: string;
  name: string;
  /** How many test-level children are currently linked to this library row. */
  linkedChildCount: number;
  /** Names of tests that currently use this library parameter. */
  testNames: string[];
}

interface Props {
  open: boolean;
  params: DeletableLibraryParam[];
  onClose: () => void;
  onConfirm: () => void;
}

const INLINE_TEST_LIMIT = 8;

/**
 * Confirm deleting one or more parameters from the library.
 *
 * Messaging goals:
 *  - Clearly show how many test-level parameters are currently linked and
 *    which tests they live in.
 *  - Explain that those tests will keep the parameter — the link to the
 *    library is what gets severed, turning each linked copy into an
 *    independent parameter.
 *  - For params with no linked children, frame it as a clean delete.
 */
export function DeleteLibraryParamsDialog({
  open,
  params,
  onClose,
  onConfirm,
}: Props) {
  const [showAllTests, setShowAllTests] = useState(false);

  if (!open) return null;

  const totalParams = params.length;
  const linkedParams = params.filter((p) => p.linkedChildCount > 0);
  const totalLinkedChildren = params.reduce(
    (sum, p) => sum + p.linkedChildCount,
    0,
  );

  // Deduplicated list of tests across all selected params.
  const affectedTestNames = Array.from(
    new Set(params.flatMap((p) => p.testNames)),
  ).sort();
  const inlineTests = showAllTests
    ? affectedTestNames
    : affectedTestNames.slice(0, INLINE_TEST_LIMIT);
  const hiddenCount = Math.max(
    0,
    affectedTestNames.length - inlineTests.length,
  );

  const hasImpact = totalLinkedChildren > 0;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 p-4">
      <div className="w-full max-w-2xl max-h-[88vh] flex flex-col rounded-lg bg-white shadow-xl border border-slate-200">
        <div className="flex items-start justify-between px-5 py-4 border-b border-slate-200 shrink-0">
          <div className="flex items-start gap-3">
            <div
              className={
                hasImpact
                  ? 'h-9 w-9 rounded-full bg-amber-50 flex items-center justify-center text-amber-600 shrink-0'
                  : 'h-9 w-9 rounded-full bg-rose-50 flex items-center justify-center text-rose-600 shrink-0'
              }
            >
              {hasImpact ? (
                <Unlink className="h-[18px] w-[18px]" />
              ) : (
                <AlertTriangle className="h-[18px] w-[18px]" />
              )}
            </div>
            <div>
              <h3 className="text-[14.5px] font-semibold text-slate-900">
                {hasImpact
                  ? 'Delete from library and detach linked tests?'
                  : `Delete ${totalParams} parameter${totalParams === 1 ? '' : 's'}?`}
              </h3>
              <p className="text-[12.5px] text-slate-600 mt-1 leading-relaxed">
                {hasImpact ? (
                  <>
                    You are removing{' '}
                    <span className="font-medium text-slate-800">
                      {totalParams} library parameter
                      {totalParams === 1 ? '' : 's'}
                    </span>
                    . Tests already using{' '}
                    {totalParams === 1 ? 'it' : 'them'} will keep the
                    parameter, but the link back to the library will be
                    broken.
                  </>
                ) : (
                  <>
                    None of the selected parameters are currently used in any
                    test. They will be removed from the library.
                  </>
                )}
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1 rounded hover:bg-slate-100 text-slate-500"
            aria-label="Close"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        <div className="px-5 py-4 overflow-auto space-y-4">
          {/* Parameters being deleted */}
          <div className="rounded-md border border-slate-200 overflow-hidden">
            <div className="px-3 py-2 text-[11.5px] uppercase tracking-wide font-medium text-slate-500 border-b border-slate-200 bg-slate-50 flex items-center justify-between">
              <span>Parameters to delete</span>
              <span className="text-slate-400 normal-case tracking-normal">
                {totalParams} total
              </span>
            </div>
            <ul className="divide-y divide-slate-200 max-h-52 overflow-auto">
              {params.map((p) => (
                <li
                  key={p.id}
                  className="px-3 py-1.5 flex items-center justify-between gap-2"
                >
                  <div className="text-[12.5px] font-medium text-slate-800 truncate">
                    {p.name}
                  </div>
                  {p.linkedChildCount > 0 ? (
                    <Badge tone="warning">
                      {p.linkedChildCount} linked test
                      {p.linkedChildCount === 1 ? '' : 's'}
                    </Badge>
                  ) : (
                    <Badge tone="neutral">Unused</Badge>
                  )}
                </li>
              ))}
            </ul>
          </div>

          {/* Impact breakdown */}
          {hasImpact && (
            <div className="rounded-md border border-amber-200 bg-amber-50/50 p-3">
              <div className="flex items-start gap-2">
                <Unlink className="h-4 w-4 text-amber-700 mt-0.5 shrink-0" />
                <div className="text-[12.5px] text-slate-700 leading-relaxed space-y-2 flex-1 min-w-0">
                  <div>
                    <span className="font-medium text-slate-900">
                      {totalLinkedChildren} parameter copy
                      {totalLinkedChildren === 1 ? '' : ' copies'}
                    </span>{' '}
                    across{' '}
                    <span className="font-medium text-slate-900">
                      {affectedTestNames.length} test
                      {affectedTestNames.length === 1 ? '' : 's'}
                    </span>{' '}
                    will be converted into{' '}
                    <span className="font-medium">independent parameters</span>
                    . They will keep all current values, but will no longer
                    receive library updates.
                  </div>
                  {linkedParams.length > 0 && (
                    <ul className="list-disc pl-5 space-y-0.5">
                      {linkedParams.map((p) => (
                        <li key={p.id}>
                          <span className="font-medium text-slate-800">
                            {p.name}
                          </span>{' '}
                          → {p.testNames.length} test
                          {p.testNames.length === 1 ? '' : 's'}:{' '}
                          <span className="text-slate-600">
                            {p.testNames.slice(0, 3).join(', ')}
                            {p.testNames.length > 3
                              ? `, +${p.testNames.length - 3} more`
                              : ''}
                          </span>
                        </li>
                      ))}
                    </ul>
                  )}

                  <div className="mt-1">
                    <button
                      type="button"
                      onClick={() => setShowAllTests((v) => !v)}
                      className="flex items-center gap-1 text-[12px] text-slate-700 hover:text-slate-900"
                    >
                      {showAllTests ? (
                        <ChevronDown className="h-3.5 w-3.5" />
                      ) : (
                        <ChevronRight className="h-3.5 w-3.5" />
                      )}
                      <span>
                        {affectedTestNames.length} affected test
                        {affectedTestNames.length === 1 ? '' : 's'}
                      </span>
                    </button>
                    <ul className="mt-1 rounded-md border border-slate-200 bg-white divide-y divide-slate-200">
                      {inlineTests.map((name) => (
                        <li
                          key={name}
                          className="px-3 py-1.5 text-[12.5px] text-slate-700 truncate"
                        >
                          {name}
                        </li>
                      ))}
                      {hiddenCount > 0 && (
                        <li className="px-3 py-1.5">
                          <button
                            type="button"
                            onClick={() => setShowAllTests(true)}
                            className="text-[12px] text-blue-700 hover:underline"
                          >
                            Show {hiddenCount} more
                          </button>
                        </li>
                      )}
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        <div className="flex items-center justify-end gap-2 px-5 py-3 border-t border-slate-200 bg-slate-50/60 shrink-0">
          <Button variant="ghost" size="sm" onClick={onClose}>
            Cancel
          </Button>
          <Button variant="danger" size="sm" onClick={onConfirm}>
            {hasImpact ? (
              <>
                Delete &amp; detach {totalLinkedChildren} parameter
                {totalLinkedChildren === 1 ? '' : 's'}
              </>
            ) : (
              <>
                Delete {totalParams} parameter{totalParams === 1 ? '' : 's'}
              </>
            )}
          </Button>
        </div>
      </div>
    </div>
  );
}
