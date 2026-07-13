import { AlertTriangle, Library, Unlink, X } from 'lucide-react';
import { Badge, Button } from '@/components/UI';

interface Props {
  open: boolean;
  parameterName: string;
  testName: string;
  /** True when the parameter is linked to a library entry. */
  isLinked: boolean;
  /** Name of the source library parameter (only used when `isLinked`). */
  libraryParameterName?: string;
  /** How many other tests still use this library parameter after removal. */
  remainingLinkedTestCount?: number;
  onClose: () => void;
  onConfirm: () => void;
}

/**
 * Confirm removing a parameter from a single test.
 *
 * Key messaging goals:
 *  - For linked parameters: reassure the user that the library entry and
 *    other tests are untouched — only this test's mapping goes away.
 *  - For independent parameters: warn that this will permanently delete
 *    the parameter since nothing else references it.
 */
export function RemoveParameterFromTestDialog({
  open,
  parameterName,
  testName,
  isLinked,
  libraryParameterName,
  remainingLinkedTestCount = 0,
  onClose,
  onConfirm,
}: Props) {
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 p-4">
      <div className="w-full max-w-lg rounded-lg bg-white shadow-xl border border-slate-200 flex flex-col">
        <div className="flex items-start justify-between px-5 py-4 border-b border-slate-200">
          <div className="flex items-start gap-3">
            <div
              className={
                isLinked
                  ? 'h-9 w-9 rounded-full bg-blue-50 flex items-center justify-center text-blue-600 shrink-0'
                  : 'h-9 w-9 rounded-full bg-rose-50 flex items-center justify-center text-rose-600 shrink-0'
              }
            >
              {isLinked ? (
                <Unlink className="h-[18px] w-[18px]" />
              ) : (
                <AlertTriangle className="h-[18px] w-[18px]" />
              )}
            </div>
            <div>
              <h3 className="text-[14.5px] font-semibold text-slate-900">
                Remove parameter from this test?
              </h3>
              <p className="text-[12.5px] text-slate-600 mt-1 leading-relaxed">
                <span className="font-medium text-slate-800">
                  {parameterName}
                </span>{' '}
                will be removed from{' '}
                <span className="font-medium text-slate-800">{testName}</span>.
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

        <div className="px-5 py-4">
          {isLinked ? (
            <div className="rounded-md border border-blue-200 bg-blue-50/60 p-3">
              <div className="flex items-start gap-2">
                <Library className="h-4 w-4 text-blue-600 mt-0.5 shrink-0" />
                <div className="text-[12.5px] text-slate-700 leading-relaxed space-y-2">
                  <div>
                    This parameter is{' '}
                    <Badge tone="info" className="align-middle">
                      Linked to Library
                    </Badge>
                    {libraryParameterName ? (
                      <>
                        {' '}
                        (
                        <span className="font-medium text-slate-800">
                          {libraryParameterName}
                        </span>
                        )
                      </>
                    ) : null}
                    . Only the mapping for this test will be removed — the
                    library entry itself stays intact.
                  </div>
                  <ul className="list-disc pl-5 space-y-1 text-slate-700">
                    <li>The library parameter is not deleted.</li>
                    <li>
                      {remainingLinkedTestCount > 0 ? (
                        <>
                          {remainingLinkedTestCount} other test
                          {remainingLinkedTestCount === 1 ? '' : 's'} currently
                          using this library parameter will continue working
                          unchanged.
                        </>
                      ) : (
                        <>
                          No other tests are currently linked to this library
                          parameter.
                        </>
                      )}
                    </li>
                    <li>
                      You can re-add it later via{' '}
                      <span className="font-medium">Import from Library</span>.
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          ) : (
            <div className="rounded-md border border-rose-200 bg-rose-50/60 p-3">
              <div className="flex items-start gap-2">
                <AlertTriangle className="h-4 w-4 text-rose-600 mt-0.5 shrink-0" />
                <div className="text-[12.5px] text-slate-700 leading-relaxed">
                  This parameter is{' '}
                  <Badge tone="neutral" className="align-middle">
                    Independent
                  </Badge>{' '}
                  and exists only in this test. Removing it here will delete
                  the parameter and its configured values permanently.
                </div>
              </div>
            </div>
          )}
        </div>

        <div className="flex items-center justify-end gap-2 px-5 py-3 border-t border-slate-200 bg-slate-50/60">
          <Button variant="ghost" size="sm" onClick={onClose}>
            Cancel
          </Button>
          <Button
            variant={isLinked ? 'primary' : 'danger'}
            size="sm"
            onClick={onConfirm}
          >
            {isLinked ? 'Remove from this test' : 'Delete parameter'}
          </Button>
        </div>
      </div>
    </div>
  );
}
