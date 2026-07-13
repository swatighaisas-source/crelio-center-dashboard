import { useState } from 'react';
import { clsx } from 'clsx';
import {
  AlertTriangle,
  ChevronDown,
  ChevronRight,
  Library,
  Scissors,
  X,
} from 'lucide-react';
import { Badge, Button } from '@/components/UI';

export interface ImpactedTest {
  id: string;
  name: string;
  code: string;
  /** True when this is the test the user is currently editing from. */
  isCurrent: boolean;
}

export interface ChangedField {
  label: string;
  from: string;
  to: string;
}

interface Props {
  open: boolean;
  parameterName: string;
  /** Tests that will be updated if the user chooses "Update in Library".
   *  Includes the test the user is editing from (flagged with `isCurrent`). */
  impactedTests: ImpactedTest[];
  /** Summary of fields that differ between the draft and the library row. */
  changedFields: ChangedField[];
  onClose: () => void;
  onUpdateInLibrary: () => void;
  onKeepSeparate: () => void;
}

const INLINE_LIMIT = 6;

export function LinkedParameterEditDialog({
  open,
  parameterName,
  impactedTests,
  changedFields,
  onClose,
  onUpdateInLibrary,
  onKeepSeparate,
}: Props) {
  const [showAllTests, setShowAllTests] = useState(false);
  const [showFieldDetails, setShowFieldDetails] = useState(false);

  if (!open) return null;

  const totalImpacted = impactedTests.length;
  const otherCount = impactedTests.filter((t) => !t.isCurrent).length;
  const inlineTests = showAllTests
    ? impactedTests
    : impactedTests.slice(0, INLINE_LIMIT);
  const hiddenCount = Math.max(0, totalImpacted - inlineTests.length);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 p-4">
      <div className="w-full max-w-2xl max-h-[88vh] flex flex-col rounded-lg bg-white shadow-xl border border-slate-200">
        <div className="flex items-start justify-between px-5 py-4 border-b border-slate-200 shrink-0">
          <div className="flex items-start gap-3">
            <div className="h-9 w-9 rounded-full bg-amber-50 flex items-center justify-center text-amber-600 shrink-0">
              <AlertTriangle className="h-[18px] w-[18px]" />
            </div>
            <div>
              <h3 className="text-[14.5px] font-semibold text-slate-900">
                Update Linked Parameter?
              </h3>
              <p className="text-[12.5px] text-slate-600 mt-1 leading-relaxed">
                <span className="font-medium text-slate-800">
                  {parameterName}
                </span>{' '}
                is linked to the library. Any library update will affect every
                report/test where this parameter is used.
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

        <div className="px-5 py-4 space-y-3 overflow-auto">
          {/* Option 1 — Update in Library */}
          <div className="rounded-lg border border-slate-200 hover:border-blue-400 transition-colors overflow-hidden">
            <div className="p-3">
              <div className="flex items-start gap-3">
                <div className="h-8 w-8 rounded-md bg-blue-50 text-blue-600 flex items-center justify-center shrink-0">
                  <Library className="h-4 w-4" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between gap-2">
                    <div className="text-[13.5px] font-semibold text-slate-900">
                      Update in Library
                    </div>
                    <Badge tone="info">
                      {totalImpacted} test
                      {totalImpacted === 1 ? '' : 's'} will be updated
                    </Badge>
                  </div>
                  <div className="text-[12.5px] text-slate-600 mt-0.5 leading-relaxed">
                    Apply these changes to the library parameter and propagate
                    them to {otherCount > 0 ? 'every linked report below' : 'this test'}.
                  </div>
                </div>
              </div>

              {/* Impacted tests */}
              <div className="mt-3 rounded-md border border-slate-200 bg-slate-50/50">
                <div className="px-3 py-2 text-[11.5px] uppercase tracking-wide font-medium text-slate-500 border-b border-slate-200 flex items-center justify-between">
                  <span>Reports / tests that will be updated</span>
                  <span className="text-slate-400 normal-case tracking-normal">
                    {totalImpacted} total
                  </span>
                </div>
                <ul className="divide-y divide-slate-200">
                  {inlineTests.map((t) => (
                    <li
                      key={t.id}
                      className="px-3 py-1.5 flex items-center justify-between gap-2"
                    >
                      <div className="min-w-0">
                        <div className="text-[12.5px] font-medium text-slate-800 truncate">
                          {t.name}
                        </div>
                        <div className="text-[11px] text-slate-500 truncate">
                          {t.code}
                        </div>
                      </div>
                      {t.isCurrent ? (
                        <Badge tone="success">Current test</Badge>
                      ) : (
                        <Badge tone="neutral">Linked</Badge>
                      )}
                    </li>
                  ))}
                  {hiddenCount > 0 && (
                    <li className="px-3 py-2">
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

              {/* Changed fields */}
              {changedFields.length > 0 && (
                <div className="mt-3">
                  <button
                    type="button"
                    onClick={() => setShowFieldDetails((v) => !v)}
                    className="flex items-center gap-1 text-[12px] text-slate-700 hover:text-slate-900"
                  >
                    {showFieldDetails ? (
                      <ChevronDown className="h-3.5 w-3.5" />
                    ) : (
                      <ChevronRight className="h-3.5 w-3.5" />
                    )}
                    <span>
                      {changedFields.length} field
                      {changedFields.length === 1 ? '' : 's'} will change
                    </span>
                  </button>
                  {showFieldDetails && (
                    <div className="mt-1 rounded-md border border-slate-200 bg-white overflow-hidden">
                      <table className="w-full text-[12px]">
                        <thead className="bg-slate-50 text-slate-500">
                          <tr>
                            <th className="text-left font-medium px-3 py-1.5 w-[28%]">
                              Field
                            </th>
                            <th className="text-left font-medium px-3 py-1.5 w-[36%]">
                              From (library)
                            </th>
                            <th className="text-left font-medium px-3 py-1.5 w-[36%]">
                              To (your edits)
                            </th>
                          </tr>
                        </thead>
                        <tbody>
                          {changedFields.map((f) => (
                            <tr
                              key={f.label}
                              className="border-t border-slate-200"
                            >
                              <td className="px-3 py-1.5 text-slate-700">
                                {f.label}
                              </td>
                              <td className="px-3 py-1.5 text-slate-500 line-through">
                                {f.from || <em className="not-italic">—</em>}
                              </td>
                              <td className="px-3 py-1.5 text-slate-800 font-medium">
                                {f.to || <em className="not-italic">—</em>}
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  )}
                </div>
              )}

              <div className="mt-3 flex items-center justify-end">
                <Button
                  variant="primary"
                  size="sm"
                  onClick={onUpdateInLibrary}
                  disabled={changedFields.length === 0}
                  title={
                    changedFields.length === 0
                      ? 'No inheritable changes detected'
                      : undefined
                  }
                >
                  Update Library &amp; {totalImpacted} report
                  {totalImpacted === 1 ? '' : 's'}
                </Button>
              </div>
            </div>
          </div>

          {/* Option 2 — Keep Separate */}
          <button
            type="button"
            onClick={onKeepSeparate}
            className={clsx(
              'w-full text-left rounded-lg border border-slate-200 hover:border-emerald-400 hover:bg-emerald-50/30 p-3 transition-colors',
            )}
          >
            <div className="flex items-start gap-3">
              <div className="h-8 w-8 rounded-md bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0">
                <Scissors className="h-4 w-4" />
              </div>
              <div>
                <div className="text-[13.5px] font-semibold text-slate-900">
                  Keep Separate
                </div>
                <div className="text-[12.5px] text-slate-600 mt-0.5 leading-relaxed">
                  Remove the library connection for this test parameter and
                  continue with the edited values as an independent parameter
                  for this test only. It will no longer receive library
                  updates.
                </div>
              </div>
            </div>
          </button>
        </div>

        <div className="flex items-center justify-end gap-2 px-5 py-3 border-t border-slate-200 bg-slate-50/60 shrink-0">
          <Button variant="ghost" size="sm" onClick={onClose}>
            Cancel
          </Button>
        </div>
      </div>
    </div>
  );
}
