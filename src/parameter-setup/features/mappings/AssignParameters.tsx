import { useMemo, useRef, useState } from 'react';
import {
  AlertTriangle,
  CheckCircle2,
  Download,
  FileSpreadsheet,
  FlaskConical,
  Link2,
  RotateCcw,
  Upload,
} from 'lucide-react';
import { useStore, type BulkAssignByCodeResult } from '@/lib/store';
import { Button, Badge } from '@/components/UI';
import { Toaster } from '@/components/Toaster';
import { useToast } from '@/lib/useToast';
import { clsx } from 'clsx';
import {
  downloadMappingTemplate,
  parseMappingXlsx,
  type MappingPair,
} from '@/lib/excel';

type RowStatus = 'new' | 'duplicate' | 'unmatched';

interface EvaluatedRow extends MappingPair {
  status: RowStatus;
  /** Why an unmatched row could not be applied. */
  note?: string;
}

interface Evaluation {
  evaluated: EvaluatedRow[];
  willMap: number;
  alreadyMapped: number;
  unmatched: number;
  total: number;
}

type Busy = null | 'parsing' | 'applying';

const delay = (ms: number) => new Promise((r) => setTimeout(r, ms));

/**
 * Fabricated rows for the "Load sample data" walkthrough. This lets the user
 * step through the whole flow — preview → applying → result with failures —
 * without touching real data or running any validation/assignment. The real
 * file-upload path always runs genuine validation against the store.
 */
const DEMO_EVALUATED: EvaluatedRow[] = [
  { testCode: 'BIO_GLU_F', testName: 'Glucose Fasting', parameterCode: 'PR_GLU', parameterName: 'Glucose', status: 'new' },
  { testCode: 'HEM_CBC', testName: 'Complete Blood Count', parameterCode: 'PR_HB', parameterName: 'Hemoglobin', status: 'new' },
  { testCode: 'HEM_CBC', testName: 'Complete Blood Count', parameterCode: 'PR_WBC', parameterName: 'WBC Count', status: 'new' },
  { testCode: 'BIO_LFT', testName: 'Liver Function Test', parameterCode: 'PR_AST', parameterName: 'AST (SGOT)', status: 'new' },
  { testCode: 'PATH_URE', testName: 'Urine Routine', parameterCode: 'PR_UR_PH', parameterName: 'Urine pH', status: 'new' },
  { testCode: 'BIO_DIAB', testName: 'Diabetes Panel', parameterCode: 'PR_GLU', parameterName: 'Glucose', status: 'duplicate', note: 'Already mapped to this test' },
  { testCode: 'ZZZ_BAD', testName: 'Unknown Test', parameterCode: 'PR_GLU', parameterName: 'Glucose', status: 'unmatched', note: 'Unknown Test ID' },
  { testCode: 'BIO_LFT', testName: 'Liver Function Test', parameterCode: 'QQ_NOPE', parameterName: '—', status: 'unmatched', note: 'Unknown Parameter ID' },
];
const DEMO_EVALUATION: Evaluation = {
  evaluated: DEMO_EVALUATED,
  willMap: 5,
  alreadyMapped: 1,
  unmatched: 2,
  total: 8,
};
const DEMO_RESULT: BulkAssignByCodeResult = {
  created: 5,
  skippedDuplicate: 1,
  unmatchedTestCodes: [],
  unmatchedParameterCodes: [],
};

/**
 * Assign Parameters — upload-driven workflow with a full lifecycle:
 *
 *   idle  →  parsing  →  preview  →  applying  →  done (with failures)
 *
 * Matching is by code: `Test ID` → `Test.code`, `Parameter ID` → library
 * `Parameter.code` (case-insensitive). Mappings are written to the store, which
 * auto-persists to local storage — so there is no separate "save" step. Rows
 * that can't be matched surface as failures the user can review, download and
 * re-upload after fixing.
 */
export function AssignParameters() {
  const { state, assignPairsByCode } = useStore();
  const { tests, parameters, mappings } = state;
  const { toasts, push, dismiss } = useToast();

  const inputRef = useRef<HTMLInputElement>(null);
  const [rows, setRows] = useState<MappingPair[] | null>(null);
  const [sourceLabel, setSourceLabel] = useState<string | null>(null);
  const [applied, setApplied] = useState<BulkAssignByCodeResult | null>(null);
  const [drag, setDrag] = useState(false);
  const [busy, setBusy] = useState<Busy>(null);
  const [progress, setProgress] = useState(0);
  // When true, we're in the fabricated "Load sample data" walkthrough — no real
  // validation or store mutation happens.
  const [demo, setDemo] = useState(false);

  // Evaluate each parsed row against current store state for the preview.
  const evaluation = useMemo<Evaluation | null>(() => {
    if (demo) return DEMO_EVALUATION;
    if (!rows) return null;
    const norm = (v: string) => v.trim().toLowerCase();

    const testIdByCode = new Map<string, string>();
    for (const t of tests) {
      const k = norm(t.code);
      if (k && !testIdByCode.has(k)) testIdByCode.set(k, t.id);
    }
    const libIdByCode = new Map<string, string>();
    for (const p of parameters) {
      if (p.isTestLevel) continue;
      const k = norm(p.code);
      if (k && !libIdByCode.has(k)) libIdByCode.set(k, p.id);
    }

    const paramById = new Map(parameters.map((p) => [p.id, p] as const));
    const mappedLibByTest = new Map<string, Set<string>>();
    for (const m of mappings) {
      const child = paramById.get(m.parameterId);
      const libId = child?.sourceLibraryParameterId ?? m.parameterId;
      let set = mappedLibByTest.get(m.testId);
      if (!set) {
        set = new Set();
        mappedLibByTest.set(m.testId, set);
      }
      set.add(libId);
    }

    const seenInFile = new Map<string, Set<string>>();
    let willMap = 0;
    let alreadyMapped = 0;
    let unmatched = 0;

    const evaluated: EvaluatedRow[] = rows.map((r) => {
      const tId = testIdByCode.get(norm(r.testCode));
      const pId = libIdByCode.get(norm(r.parameterCode));
      if (!tId || !pId) {
        unmatched += 1;
        const note =
          !tId && !pId
            ? 'Unknown Test ID & Parameter ID'
            : !tId
              ? 'Unknown Test ID'
              : 'Unknown Parameter ID';
        return { ...r, status: 'unmatched', note };
      }
      let fileSet = seenInFile.get(tId);
      if (!fileSet) {
        fileSet = new Set();
        seenInFile.set(tId, fileSet);
      }
      const already = mappedLibByTest.get(tId)?.has(pId) || fileSet.has(pId);
      fileSet.add(pId);
      if (already) {
        alreadyMapped += 1;
        return { ...r, status: 'duplicate', note: 'Already mapped to this test' };
      }
      willMap += 1;
      return { ...r, status: 'new' };
    });

    return { evaluated, willMap, alreadyMapped, unmatched, total: rows.length };
  }, [demo, rows, tests, parameters, mappings]);

  const failures = useMemo(
    () => evaluation?.evaluated.filter((r) => r.status === 'unmatched') ?? [],
    [evaluation],
  );

  async function handleFile(file: File) {
    setDemo(false);
    setBusy('parsing');
    setSourceLabel(file.name);
    try {
      await delay(550); // surface the loader for the (normally instant) parse
      const parsed = await parseMappingXlsx(file);
      if (parsed.pairs.length === 0) {
        push('No rows with both a Test ID and Parameter ID were found.', 'warning');
        setSourceLabel(null);
        return;
      }
      setApplied(null);
      setRows(parsed.pairs);
      if (parsed.skippedRows > 0) {
        push(`${parsed.skippedRows} blank/incomplete row(s) were ignored.`, 'info');
      }
    } catch {
      push('Could not read that file. Upload a .xlsx or .csv.', 'danger');
      setSourceLabel(null);
    } finally {
      setBusy(null);
    }
  }

  // "Load sample data" — fabricated walkthrough. No parsing of a real file,
  // no validation against the store.
  async function loadSeededSample() {
    setRows(null);
    setApplied(null);
    setDemo(true);
    setSourceLabel('Seeded sample (prototype)');
    setBusy('parsing');
    await delay(650);
    setBusy(null);
  }

  async function runProgress() {
    setBusy('applying');
    setProgress(0);
    const steps = 16;
    for (let i = 1; i <= steps; i++) {
      await delay(55);
      setProgress(Math.round((i / steps) * 100));
    }
  }

  async function applyNow() {
    if (!evaluation) return;

    // Demo walkthrough: show the loader + a fabricated result, skip real work.
    if (demo) {
      await runProgress();
      setApplied(DEMO_RESULT);
      setBusy(null);
      setProgress(0);
      push(`Assigned ${DEMO_RESULT.created} parameters. (Sample walkthrough)`, 'success');
      return;
    }

    if (!rows) return;
    await runProgress();
    const res = assignPairsByCode(rows);
    setApplied(res);
    setBusy(null);
    setProgress(0);
    if (res.created > 0) {
      push(
        `Assigned ${res.created} parameter${res.created === 1 ? '' : 's'}. Saved.`,
        'success',
      );
    } else {
      push('Nothing new to assign — every row was a duplicate or unmatched.', 'warning');
    }
  }

  function reset() {
    setRows(null);
    setSourceLabel(null);
    setApplied(null);
    setDemo(false);
  }

  /** Export the unmatched rows as a CSV so the user can fix the IDs and re-upload. */
  function downloadFailures() {
    const header = ['Test ID', 'Parameter ID', 'Test Name', 'Parameter Name', 'Reason'];
    const esc = (v: string) => `"${(v ?? '').replace(/"/g, '""')}"`;
    const lines = [header.join(',')].concat(
      failures.map((f) =>
        [f.testCode, f.parameterCode, f.testName || '', f.parameterName || '', f.note || 'Unmatched']
          .map(esc)
          .join(','),
      ),
    );
    const blob = new Blob([lines.join('\n')], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'assign-parameters-failures.csv';
    a.click();
    URL.revokeObjectURL(url);
  }

  const showHeaderCta = !busy && !applied && !!evaluation;

  return (
    <div className="flex flex-col flex-1 min-h-0">
      <div className="flex-none border-b border-slate-200 bg-white px-6 py-4">
        <div className="flex items-start justify-between gap-3">
          <div className="min-w-0">
            <h2 className="text-[16px] font-semibold text-slate-900">
              Assign Parameters to Tests
            </h2>
            <p className="text-[12px] text-slate-500 mt-1">
              Bulk-map library parameters to tests by uploading a Test ID / Parameter ID file.
            </p>
          </div>

          {showHeaderCta ? (
            <div className="flex items-center gap-2 shrink-0">
              <Button type="button" variant="ghost" size="sm" onClick={reset}>
                Discard
              </Button>
              <Button
                type="button"
                variant="primary"
                size="sm"
                onClick={applyNow}
                disabled={!evaluation || evaluation.willMap === 0}
              >
                <Link2 className="h-3.5 w-3.5" />
                Assign {evaluation?.willMap ?? 0} parameter
                {(evaluation?.willMap ?? 0) === 1 ? '' : 's'}
              </Button>
            </div>
          ) : !busy && !rows && !applied ? (
            <div className="shrink-0 flex flex-col items-end text-right">
              <Button
                type="button"
                variant="secondary"
                size="sm"
                onClick={loadSeededSample}
              >
                <FlaskConical className="h-3.5 w-3.5" />
                Load sample data
              </Button>
              <p className="text-[11px] text-slate-400 mt-1 max-w-[220px]">
                Prototype only — loads seeded sample IDs so you can try the flow end-to-end.
              </p>
            </div>
          ) : null}
        </div>
      </div>

      <div className="flex-1 min-h-0 overflow-auto bg-slate-50">
        <div className="w-full px-6 py-6">
          {busy === 'parsing' ? (
            <ProgressBar title="Reading your file…" subtitle={sourceLabel ?? undefined} />
          ) : applied ? (
            <ResultPanel
              result={applied}
              failures={failures}
              onUploadAnother={reset}
              onReupload={() => inputRef.current?.click()}
              onDownloadFailures={downloadFailures}
            />
          ) : evaluation ? (
            <PreviewPanel
              evaluation={evaluation}
              sourceLabel={sourceLabel}
              onReset={reset}
              applyingProgress={busy === 'applying' ? progress : null}
            />
          ) : (
            <EmptyState
              drag={drag}
              setDrag={setDrag}
              onPickFile={() => inputRef.current?.click()}
              onDropFile={handleFile}
            />
          )}
        </div>
      </div>

      <input
        ref={inputRef}
        type="file"
        accept=".xlsx,.xls,.csv"
        className="hidden"
        onChange={(e) => {
          const f = e.target.files?.[0];
          if (f) void handleFile(f);
          e.target.value = '';
        }}
      />

      <Toaster toasts={toasts} onDismiss={dismiss} />
    </div>
  );
}

function ProgressBar({
  title,
  subtitle,
  progress,
}: {
  title: string;
  subtitle?: string;
  /** 0–100 for a determinate bar; omit for an indeterminate (animated) bar. */
  progress?: number;
}) {
  const determinate = typeof progress === 'number';
  return (
    <div className="flex flex-col items-center justify-center px-4 py-24">
      <div className="w-full max-w-xl">
        <div className="flex items-center justify-between mb-2">
          <span className="text-[14px] font-medium text-slate-700">{title}</span>
          {determinate && (
            <span className="text-[13px] font-semibold text-blue-600 tabular-nums">
              {progress}%
            </span>
          )}
        </div>
        <div className="w-full h-2.5 rounded-full bg-slate-200 overflow-hidden">
          {determinate ? (
            <div
              className="h-full bg-blue-500 transition-all duration-150"
              style={{ width: `${progress}%` }}
            />
          ) : (
            <div className="h-full w-2/5 rounded-full bg-blue-500 animate-progress-indeterminate" />
          )}
        </div>
        {subtitle && (
          <p className="mt-2 text-[12px] text-slate-500 truncate">{subtitle}</p>
        )}
      </div>
    </div>
  );
}

function EmptyState({
  drag,
  setDrag,
  onPickFile,
  onDropFile,
}: {
  drag: boolean;
  setDrag: (v: boolean) => void;
  onPickFile: () => void;
  onDropFile: (file: File) => void;
}) {
  return (
    <div
      onDragOver={(e) => {
        e.preventDefault();
        setDrag(true);
      }}
      onDragLeave={() => setDrag(false)}
      onDrop={(e) => {
        e.preventDefault();
        setDrag(false);
        const f = e.dataTransfer.files?.[0];
        if (f) onDropFile(f);
      }}
      className={clsx(
        'w-full min-h-[60vh] flex flex-col items-center justify-center text-center px-4 rounded-lg transition-colors',
        drag && 'bg-blue-50/60 outline-2 outline-dashed outline-blue-300',
      )}
    >
      <div className="h-16 w-16 rounded-full bg-blue-50 flex items-center justify-center">
        <FileSpreadsheet className="h-8 w-8 text-blue-500" />
      </div>
      <h3 className="mt-4 text-[16px] font-semibold text-slate-800">
        Upload a file to assign parameters
      </h3>
      <p className="mt-2 max-w-md text-[13px] text-slate-500 leading-relaxed">
        Each row links one library parameter to one test, matched by code
        (<strong className="text-slate-600">Test ID → test code</strong>,{' '}
        <strong className="text-slate-600">Parameter ID → parameter code</strong>).
        Download the template, fill in the IDs, then upload.
      </p>

      <div className="mt-5 flex flex-wrap items-center justify-center gap-2">
        <Button type="button" variant="secondary" onClick={downloadMappingTemplate}>
          <Download className="h-3.5 w-3.5" />
          Download template
        </Button>
        <Button type="button" variant="primary" onClick={onPickFile}>
          <Upload className="h-3.5 w-3.5" />
          Choose file
        </Button>
      </div>
      <p className="mt-3 text-[12px] text-slate-400">
        You can also drop a .xlsx or .csv anywhere on this page.
      </p>
    </div>
  );
}

function PreviewPanel({
  evaluation,
  sourceLabel,
  onReset,
  applyingProgress,
}: {
  evaluation: Evaluation;
  sourceLabel: string | null;
  onReset: () => void;
  /** 0–100 while assignment is running (replaces the summary counts); null otherwise. */
  applyingProgress?: number | null;
}) {
  const { evaluated, willMap, alreadyMapped, unmatched, total } = evaluation;
  const applying = typeof applyingProgress === 'number';
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between gap-3 flex-wrap">
        <div className="flex items-center gap-2 text-[12.5px] text-slate-600 min-w-0">
          <FileSpreadsheet className="h-4 w-4 text-slate-400 shrink-0" />
          <span className="truncate">
            Preview of <strong className="text-slate-800">{sourceLabel}</strong>
          </span>
        </div>
        {!applying && (
          <Button type="button" variant="ghost" size="sm" onClick={onReset}>
            <RotateCcw className="h-3.5 w-3.5" />
            Choose a different file
          </Button>
        )}
      </div>

      {applying ? (
        /* Progress bar replaces the summary counts while assignment runs */
        <div className="border-y border-slate-200 py-3">
          <div className="flex items-center justify-between mb-1.5">
            <span className="text-[13px] font-medium text-slate-700">
              Assigning parameters…
            </span>
            <span className="text-[13px] font-semibold text-blue-600 tabular-nums">
              {applyingProgress}%
            </span>
          </div>
          <div className="w-full h-2.5 rounded-full bg-slate-200 overflow-hidden">
            <div
              className="h-full rounded-full bg-blue-500 transition-all duration-150"
              style={{ width: `${applyingProgress}%` }}
            />
          </div>
        </div>
      ) : (
        /* Summary — single inline row */
        <div className="flex flex-wrap items-center gap-x-6 gap-y-2 border-y border-slate-200 py-3">
          <Stat label="Rows" value={total} />
          <Stat label="Will map" value={willMap} tone="success" />
          <Stat label="Already mapped" value={alreadyMapped} tone="warning" />
          <Stat label="Won't map" value={unmatched} tone={unmatched > 0 ? 'danger' : 'neutral'} />
        </div>
      )}

      <div className="overflow-hidden rounded-lg border border-slate-200">
        <div className="max-h-[46vh] overflow-auto">
          <table className="w-full text-[12px]">
            <thead className="sticky top-0 bg-slate-50 text-slate-500 text-left">
              <tr>
                <th className="px-3 py-2 font-medium">Test ID</th>
                <th className="px-3 py-2 font-medium">Test Name</th>
                <th className="px-3 py-2 font-medium">Parameter ID</th>
                <th className="px-3 py-2 font-medium">Parameter Name</th>
                <th className="px-3 py-2 font-medium">Status</th>
              </tr>
            </thead>
            <tbody>
              {evaluated.map((r, i) => (
                <tr key={i} className="border-t border-slate-100">
                  <td className="px-3 py-1.5 font-mono text-[11px] text-slate-700">{r.testCode}</td>
                  <td className="px-3 py-1.5 text-slate-600">{r.testName || '—'}</td>
                  <td className="px-3 py-1.5 font-mono text-[11px] text-slate-700">{r.parameterCode}</td>
                  <td className="px-3 py-1.5 text-slate-600">{r.parameterName || '—'}</td>
                  <td className="px-3 py-1.5">
                    <StatusBadge status={r.status} note={r.note} />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

function Stat({
  label,
  value,
  tone = 'neutral',
}: {
  label: string;
  value: number;
  tone?: 'neutral' | 'success' | 'warning' | 'danger';
}) {
  const color =
    tone === 'success'
      ? 'text-emerald-600'
      : tone === 'warning'
        ? 'text-amber-600'
        : tone === 'danger'
          ? 'text-rose-600'
          : 'text-slate-800';
  return (
    <div className="flex items-baseline gap-1.5">
      <span className={clsx('text-[18px] font-semibold tabular-nums', color)}>{value}</span>
      <span className="text-[12px] text-slate-500">{label}</span>
    </div>
  );
}

function StatusBadge({ status, note }: { status: RowStatus; note?: string }) {
  if (status === 'new') return <Badge tone="success">Will map</Badge>;
  if (status === 'duplicate')
    return <Badge tone="warning" className="whitespace-nowrap">{note ?? 'Already mapped'}</Badge>;
  return <Badge tone="danger" className="whitespace-nowrap">{note ?? 'Unmatched'}</Badge>;
}

function ResultPanel({
  result,
  failures,
  onUploadAnother,
  onReupload,
  onDownloadFailures,
}: {
  result: BulkAssignByCodeResult;
  failures: EvaluatedRow[];
  onUploadAnother: () => void;
  onReupload: () => void;
  onDownloadFailures: () => void;
}) {
  const [showFailures, setShowFailures] = useState(false);
  const failedCount = failures.length;

  return (
    <div className="w-full space-y-5">
      {/* Success summary + primary upload action (at the top) */}
      <div className="flex items-start justify-between gap-3 flex-wrap">
        <div className="flex items-start gap-3 min-w-0">
          <CheckCircle2 className="h-6 w-6 text-emerald-600 shrink-0" />
          <div className="min-w-0">
            <p className="text-[15px] font-semibold text-slate-800">
              Assigned {result.created} parameter{result.created === 1 ? '' : 's'}
            </p>
            <p className="text-[12.5px] text-slate-500 mt-0.5">
              Changes are saved automatically.
              {result.skippedDuplicate > 0 && (
                <> {result.skippedDuplicate} row{result.skippedDuplicate === 1 ? '' : 's'} skipped (already mapped).</>
              )}
            </p>
          </div>
        </div>
        <Button type="button" variant="primary" size="sm" onClick={onUploadAnother}>
          <Upload className="h-3.5 w-3.5" />
          Upload another file
        </Button>
      </div>

      {/* Failures */}
      {failedCount > 0 && (
        <div className="rounded-lg border border-rose-200 bg-rose-50/60 p-4">
          <div className="flex items-start justify-between gap-3 flex-wrap">
            <div className="flex items-start gap-2.5 min-w-0">
              <AlertTriangle className="h-5 w-5 text-rose-500 shrink-0 mt-0.5" />
              <div className="min-w-0">
                <p className="text-[13px] font-semibold text-rose-900">
                  {failedCount} row{failedCount === 1 ? '' : 's'} couldn&apos;t be assigned
                </p>
                <p className="text-[12px] text-rose-800/80 mt-0.5">
                  Their Test ID or Parameter ID didn&apos;t match anything in the library. Fix the
                  IDs and re-upload to assign the rest.
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2 shrink-0">
              <Button type="button" variant="ghost" size="sm" onClick={() => setShowFailures((v) => !v)}>
                {showFailures ? 'Hide' : 'View'} failures
              </Button>
              <Button type="button" variant="secondary" size="sm" onClick={onDownloadFailures}>
                <Download className="h-3.5 w-3.5" />
                Download failures
              </Button>
            </div>
          </div>

          {showFailures && (
            <div className="mt-3 overflow-hidden rounded-md border border-rose-200 bg-white">
              <div className="max-h-[36vh] overflow-auto">
                <table className="w-full text-[12px]">
                  <thead className="sticky top-0 bg-rose-50 text-rose-700/80 text-left">
                    <tr>
                      <th className="px-3 py-2 font-medium">Test ID</th>
                      <th className="px-3 py-2 font-medium">Parameter ID</th>
                      <th className="px-3 py-2 font-medium">Reason</th>
                    </tr>
                  </thead>
                  <tbody>
                    {failures.map((f, i) => (
                      <tr key={i} className="border-t border-rose-100">
                        <td className="px-3 py-1.5 font-mono text-[11px] text-slate-700">{f.testCode}</td>
                        <td className="px-3 py-1.5 font-mono text-[11px] text-slate-700">{f.parameterCode}</td>
                        <td className="px-3 py-1.5 text-rose-700">{f.note ?? 'Unmatched'}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          <div className="mt-3">
            <Button type="button" variant="secondary" size="sm" onClick={onReupload}>
              <RotateCcw className="h-3.5 w-3.5" />
              Re-upload corrected file
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
