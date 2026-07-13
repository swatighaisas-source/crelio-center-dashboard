import { useEffect, useMemo, useState } from 'react';
import { clsx } from 'clsx';
import { GripVertical, Library, X } from 'lucide-react';
import { useStore } from '@/lib/store';
import { Badge, EmptyState } from '@/components/UI';
import { defaultParameterRowWithoutId } from '@/lib/parameterDefaults';
import { uid } from '@/lib/id';
import type {
  Parameter,
  ParameterCategory,
  ParameterType,
  TestParameterMapping,
} from '@/types';
import { ParameterForm } from './ParameterForm';
import { AddParameterMenu, type CreateParamOption } from './AddParameterMenu';
import { ImportFromLibraryModal } from './ImportFromLibraryModal';
import {
  LinkedParameterEditDialog,
  type ChangedField,
  type ImpactedTest,
} from './LinkedParameterEditDialog';
import { RemoveParameterFromTestDialog } from './RemoveParameterFromTestDialog';

// Fields that actually propagate to children when a library row is updated.
// These also drive the diff shown in the "Update Linked Parameter?" modal.
const INHERITABLE_FIELD_LABELS: ReadonlyArray<[keyof Parameter, string]> = [
  ['name', 'Name'],
  ['code', 'Code'],
  ['type', 'Parameter Type'],
  ['category', 'Category'],
  ['unit', 'Unit'],
  ['method', 'Method'],
  ['integrationCode', 'Integration Code'],
  ['loincCode', 'LOINC Code'],
  ['dictionary', 'Dictionary'],
  ['linkedParameters', 'Linked Parameters'],
  ['maleLowerRange', 'Male Lower Range'],
  ['maleUpperRange', 'Male Upper Range'],
  ['femaleLowerRange', 'Female Lower Range'],
  ['femaleUpperRange', 'Female Upper Range'],
  ['criticalLowMale', 'Critical Low (Male)'],
  ['criticalHighMale', 'Critical High (Male)'],
  ['criticalLowFemale', 'Critical Low (Female)'],
  ['criticalHighFemale', 'Critical High (Female)'],
  ['descriptive', 'Descriptive'],
  ['listValues', 'List Values'],
  ['formulaPreset', 'Formula Preset'],
  ['formula', 'Formula'],
  ['rerunAuto', 'Auto Rerun'],
  ['rerunManual', 'Manual Rerun'],
  ['hideParameter', 'Hide Parameter'],
  ['customizedParameter', 'Customized Parameter'],
  ['highlightThisValue', 'Highlight this value'],
  ['underlineThisValue', 'Underline this value'],
  ['optionalField', 'Optional field'],
  ['hasImpressions', 'Has Impressions'],
  ['hideParameterTrends', 'Hide Parameter Trends'],
];

function fmtFieldValue(v: unknown): string {
  if (v === undefined || v === null) return '';
  if (typeof v === 'boolean') return v ? 'Yes' : 'No';
  if (Array.isArray(v)) return `${v.length} item${v.length === 1 ? '' : 's'}`;
  return String(v);
}

function diffInheritableFields(
  from: Parameter,
  to: Parameter,
): ChangedField[] {
  const out: ChangedField[] = [];
  for (const [key, label] of INHERITABLE_FIELD_LABELS) {
    const a = from[key];
    const b = to[key];
    if (fmtFieldValue(a) !== fmtFieldValue(b)) {
      out.push({ label, from: fmtFieldValue(a), to: fmtFieldValue(b) });
    }
  }
  return out;
}

interface Props {
  testId: string;
  pushToast: (message: string, tone?: 'success' | 'info' | 'warning' | 'danger') => void;
}

/**
 * Resolve the library parameter for a test-level mapping. Returns null for
 * independent (non-library) test parameters.
 */
function resolveLibraryParam(
  param: Parameter | undefined,
  all: Parameter[],
): Parameter | null {
  if (!param) return null;
  const libId = param.sourceLibraryParameterId;
  if (!libId) return null;
  const lib = all.find((p) => p.id === libId);
  return lib ?? null;
}

export function ReportParametersTab({ testId, pushToast }: Props) {
  const {
    state,
    importLibraryParamToTest,
    createTestParameter,
    updateParameter,
    updateLibraryParameterAndPropagate,
    disconnectTestParameterFromLibrary,
    promoteTestParameterToLibrary,
    deleteTestParameter,
  } = useStore();

  // Ordered mappings for this test
  const mappings = useMemo(() => {
    return state.mappings
      .filter((m) => m.testId === testId)
      .slice()
      .sort((a, b) => a.sequence - b.sequence);
  }, [state.mappings, testId]);

  const paramById = useMemo(
    () => new Map(state.parameters.map((p) => [p.id, p] as const)),
    [state.parameters],
  );

  // Library parameter ids already linked to this test — used to disable rows
  // in the "Import from Library" modal.
  const alreadyLinkedLibraryIds = useMemo(() => {
    const set = new Set<string>();
    for (const m of mappings) {
      const child = paramById.get(m.parameterId);
      const libId = child?.sourceLibraryParameterId ?? m.parameterId;
      if (paramById.get(libId) && !paramById.get(libId)?.isTestLevel) {
        set.add(libId);
      }
    }
    return set;
  }, [mappings, paramById]);

  const libraryParameterNames = useMemo(
    () =>
      state.parameters
        .filter((p) => !p.isTestLevel)
        .map((p) => p.name)
        .sort(),
    [state.parameters],
  );

  // Map of library parameter id → set of test ids that will be updated when
  // the library row is changed (used for the "Update in Library" impact list).
  const impactedTestIdsByLibId = useMemo(() => {
    const m = new Map<string, Set<string>>();
    for (const map of state.mappings) {
      const p = paramById.get(map.parameterId);
      const libId = p?.sourceLibraryParameterId;
      if (!libId) continue;
      if (!m.has(libId)) m.set(libId, new Set());
      m.get(libId)!.add(map.testId);
    }
    return m;
  }, [state.mappings, paramById]);

  // Selection + draft state
  const [selectedMappingId, setSelectedMappingId] = useState<string | null>(
    mappings[0]?.id ?? null,
  );
  const [draft, setDraft] = useState<Parameter | null>(null);
  const [creatingDraft, setCreatingDraft] = useState<Parameter | null>(null);
  const [addToLibrary, setAddToLibrary] = useState(false);

  const [importOpen, setImportOpen] = useState(false);
  const [linkedDialogOpen, setLinkedDialogOpen] = useState(false);
  const [pendingRemove, setPendingRemove] = useState<string | null>(null);

  // Keep selection valid when mappings change externally (e.g. after delete).
  useEffect(() => {
    if (selectedMappingId && !mappings.some((m) => m.id === selectedMappingId)) {
      setSelectedMappingId(mappings[0]?.id ?? null);
    }
  }, [mappings, selectedMappingId]);

  // Reset draft whenever the selected mapping changes.
  const selectedMapping: TestParameterMapping | null =
    mappings.find((m) => m.id === selectedMappingId) ?? null;
  const selectedParam = selectedMapping
    ? paramById.get(selectedMapping.parameterId) ?? null
    : null;

  useEffect(() => {
    if (creatingDraft) return; // don't clobber create draft when clicking elsewhere
    setDraft(selectedParam ? { ...selectedParam } : null);
  }, [selectedParam, creatingDraft]);

  // -------- Handlers --------

  function handleImport(libId: string) {
    const res = importLibraryParamToTest(testId, libId);
    setImportOpen(false);
    if (!res) {
      pushToast(
        'That library parameter is already linked to this test.',
        'warning',
      );
      return;
    }
    pushToast(`Parameter imported successfully from library.`, 'success');
    setSelectedMappingId(res.mapping.id);
    setCreatingDraft(null);
  }

  function startCreate(opt?: {
    type?: ParameterType;
    category?: ParameterCategory;
    name?: string;
  }) {
    const base = defaultParameterRowWithoutId();
    const newDraft: Parameter = {
      id: uid('par'),
      ...base,
      type: opt?.type ?? base.type,
      category: opt?.category ?? base.category,
      name: opt?.name ?? base.name,
      isTestLevel: true,
    };
    setCreatingDraft(newDraft);
    setAddToLibrary(false);
    setSelectedMappingId(null);
  }

  function handleCreateFromMenu(opt: CreateParamOption) {
    startCreate(opt);
  }

  function cancelCreate() {
    setCreatingDraft(null);
    setSelectedMappingId(mappings[0]?.id ?? null);
  }

  function handleCreateSave() {
    if (!creatingDraft) return;
    if (!creatingDraft.name.trim()) {
      pushToast('Parameter name is required.', 'warning');
      return;
    }
    // Strip the id/isTestLevel; createTestParameter assigns its own ids.
    const { id: _id, isTestLevel: _iso, sourceLibraryParameterId: _sid, ...rest } =
      creatingDraft;
    void _id;
    void _iso;
    void _sid;
    const res = createTestParameter(testId, rest, {
      addToLibrary,
    });
    setCreatingDraft(null);
    setSelectedMappingId(res.mapping.id);
    if (addToLibrary) {
      pushToast('New parameter created and added to library.', 'success');
    } else {
      pushToast('New parameter created for this test only.', 'success');
    }
    setAddToLibrary(false);
  }

  function handleSaveEdit() {
    if (!draft || !selectedParam || !selectedMapping) return;
    const libParam = resolveLibraryParam(selectedParam, state.parameters);
    if (libParam) {
      // Linked → check if there is anything to propagate before prompting.
      const diffs = diffInheritableFields(libParam, draft);
      if (diffs.length === 0) {
        // Still persist non-inheritable edits on the child (e.g. local flags
        // we chose not to propagate). Skip the dialog since library stays intact.
        updateParameter(selectedParam.id, draft);
        pushToast('No library-inherited fields changed. Saved locally.', 'info');
        return;
      }
      setLinkedDialogOpen(true);
      return;
    }
    // Independent — write directly.
    updateParameter(selectedParam.id, draft);
    pushToast('Parameter updated.', 'success');
  }

  function handleUpdateInLibrary() {
    if (!draft || !selectedParam) return;
    const libId = selectedParam.sourceLibraryParameterId;
    if (!libId) return;
    const impactedCount = impactedTests.length;
    // Apply the draft to the library row; propagation also covers the current
    // selected child since it shares the same libId.
    const { id: _id, isTestLevel: _iso, sourceLibraryParameterId: _sid, ...patch } =
      draft;
    void _id;
    void _iso;
    void _sid;
    updateLibraryParameterAndPropagate(libId, patch);
    setLinkedDialogOpen(false);
    pushToast(
      `Library parameter updated. ${impactedCount} linked report${
        impactedCount === 1 ? '' : 's'
      } ${impactedCount === 1 ? 'was' : 'were'} updated.`,
      'success',
    );
  }

  function handleKeepSeparate() {
    if (!draft || !selectedParam) return;
    const { id: _id, isTestLevel: _iso, sourceLibraryParameterId: _sid, ...patch } =
      draft;
    void _id;
    void _iso;
    void _sid;
    disconnectTestParameterFromLibrary(selectedParam.id, patch);
    setLinkedDialogOpen(false);
    pushToast(
      'Parameter disconnected from library and saved independently.',
      'success',
    );
  }

  function handleAddToLibrary() {
    if (!draft || !selectedParam) return;
    if (selectedParam.sourceLibraryParameterId) return; // already linked
    if (!draft.name.trim()) {
      pushToast('Parameter name is required before adding to library.', 'warning');
      return;
    }
    // Strip id / linkage markers so the current draft becomes both the test
    // row's new values and the seed for the new library entry.
    const { id: _id, isTestLevel: _iso, sourceLibraryParameterId: _sid, ...patch } =
      draft;
    void _id;
    void _iso;
    void _sid;
    const res = promoteTestParameterToLibrary(selectedParam.id, patch);
    if (!res) {
      pushToast('Unable to add this parameter to the library.', 'danger');
      return;
    }
    pushToast(
      `“${res.libraryParameter.name}” added to library. This test is now linked to it.`,
      'success',
    );
  }

  function handleDelete(mappingId: string) {
    setPendingRemove(mappingId);
  }

  function confirmRemove() {
    if (!pendingRemove) return;
    const m = mappings.find((mm) => mm.id === pendingRemove);
    setPendingRemove(null);
    if (!m) return;
    const param = paramById.get(m.parameterId);
    if (!param) return;
    const libId = param.sourceLibraryParameterId;
    const otherTestCount = libId
      ? Math.max(
          0,
          (impactedTestIdsByLibId.get(libId)?.size ?? 0) - 1,
        )
      : 0;
    deleteTestParameter(m.parameterId);
    if (libId) {
      pushToast(
        `“${param.name}” removed from this test. Library entry is untouched${
          otherTestCount > 0
            ? ` and still used by ${otherTestCount} other test${
                otherTestCount === 1 ? '' : 's'
              }`
            : ''
        }.`,
        'info',
      );
    } else {
      pushToast(
        `“${param.name}” deleted from this test.`,
        'info',
      );
    }
  }

  // -------- Render --------

  const showCreate = Boolean(creatingDraft);
  const selectedLibParam = resolveLibraryParam(selectedParam ?? undefined, state.parameters);

  // Compute the list of impacted tests + changed fields for the decision modal.
  // Both are only meaningful when the selected parameter is linked.
  const impactedTests = useMemo<ImpactedTest[]>(() => {
    const libId = selectedParam?.sourceLibraryParameterId;
    if (!libId) return [];
    const testIds = impactedTestIdsByLibId.get(libId);
    if (!testIds || testIds.size === 0) return [];
    return state.tests
      .filter((t) => testIds.has(t.id))
      .map((t) => ({
        id: t.id,
        name: t.name,
        code: t.code,
        isCurrent: t.id === testId,
      }))
      // Put the current test first, then alphabetical by name.
      .sort((a, b) => {
        if (a.isCurrent !== b.isCurrent) return a.isCurrent ? -1 : 1;
        return a.name.localeCompare(b.name);
      });
  }, [selectedParam, impactedTestIdsByLibId, state.tests, testId]);

  const changedFields = useMemo<ChangedField[]>(() => {
    if (!selectedLibParam || !draft) return [];
    return diffInheritableFields(selectedLibParam, draft);
  }, [selectedLibParam, draft]);

  return (
    <div className="flex flex-col flex-1 min-h-0">
      <div className="flex items-center justify-between px-4 pt-3 pb-2 border-b border-slate-200">
        <div className="text-[13px] font-medium text-slate-700">
          Test Parameters{' '}
          <span className="text-slate-500">({mappings.length})</span>
        </div>
        <AddParameterMenu
          onCreate={handleCreateFromMenu}
          onImportFromLibrary={() => setImportOpen(true)}
        />
      </div>

      <div className="grid flex-1 min-h-0" style={{ gridTemplateColumns: '280px 1fr' }}>
        {/* Left: parameter list */}
        <div className="border-r border-slate-200 overflow-y-auto bg-white">
          {mappings.length === 0 && !showCreate ? (
            <div className="p-4">
              <EmptyState
                title="No parameters yet"
                description="Use “Add New Parameter” to create one for this test or import an existing one from the library."
              />
            </div>
          ) : (
            <ul className="py-1">
              {mappings.map((m) => {
                const p = paramById.get(m.parameterId);
                if (!p) return null;
                const lib = resolveLibraryParam(p, state.parameters);
                const isActive = !showCreate && m.id === selectedMappingId;
                return (
                  <li key={m.id}>
                    <button
                      type="button"
                      onClick={() => {
                        setCreatingDraft(null);
                        setSelectedMappingId(m.id);
                      }}
                      className={clsx(
                        'w-full text-left px-3 py-2 flex items-start gap-2 border-l-2',
                        isActive
                          ? 'bg-blue-50 border-blue-600'
                          : 'border-transparent hover:bg-slate-50',
                      )}
                    >
                      <GripVertical className="h-3.5 w-3.5 mt-0.5 text-slate-300 shrink-0" />
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-1.5 min-w-0">
                          <div className="text-[13px] font-medium text-slate-900 truncate">
                            {p.name}
                          </div>
                          {lib && (
                            <span
                              className="shrink-0 inline-flex text-blue-500"
                              title={`Shared from library — edits can apply across every test that uses “${lib.name}”.`}
                            >
                              <Library className="h-3.5 w-3.5" />
                            </span>
                          )}
                        </div>
                        <div className="flex items-center gap-1 mt-0.5 flex-wrap">
                          <span className="text-[11px] text-slate-500 truncate">
                            {p.type === 'TestWithNormalRange'
                              ? 'Normal Range'
                              : p.type}
                          </span>
                        </div>
                      </div>
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleDelete(m.id);
                        }}
                        className="p-0.5 text-slate-400 hover:text-rose-600"
                        title="Remove from test"
                      >
                        <X className="h-3.5 w-3.5" />
                      </button>
                    </button>
                  </li>
                );
              })}

              {showCreate && (
                <li>
                  <div className="px-3 py-2 flex items-start gap-2 border-l-2 border-amber-500 bg-amber-50/50">
                    <GripVertical className="h-3.5 w-3.5 mt-0.5 text-slate-300 shrink-0" />
                    <div className="flex-1 min-w-0">
                      <div className="text-[13px] font-medium text-slate-900 truncate">
                        {creatingDraft?.name || 'Untitled parameter'}
                      </div>
                      <Badge tone="warning" className="mt-0.5">
                        Draft
                      </Badge>
                    </div>
                  </div>
                </li>
              )}
            </ul>
          )}
        </div>

        {/* Right: editor */}
        <div className="min-h-0 flex flex-col">
          {showCreate && creatingDraft ? (
            <ParameterForm
              mode="create"
              value={creatingDraft}
              onChange={setCreatingDraft}
              libraryParameterNames={libraryParameterNames}
              addToLibrary={addToLibrary}
              onToggleAddToLibrary={setAddToLibrary}
              onSave={handleCreateSave}
              onCancel={cancelCreate}
            />
          ) : draft && selectedParam ? (
            <ParameterForm
              mode="edit"
              value={draft}
              onChange={setDraft}
              linkedLibraryParameterName={selectedLibParam?.name}
              libraryParameterNames={libraryParameterNames}
              onAddToLibrary={
                selectedLibParam ? undefined : handleAddToLibrary
              }
              onSave={handleSaveEdit}
              onCancel={() => setDraft({ ...selectedParam })}
            />
          ) : (
            <div className="flex-1 flex items-center justify-center">
              <EmptyState
                title="Select a parameter to edit"
                description="Pick a parameter from the list on the left, or use “Add New Parameter” to create or import one."
              />
            </div>
          )}
        </div>
      </div>

      <ImportFromLibraryModal
        open={importOpen}
        testId={testId}
        alreadyLinkedLibraryIds={alreadyLinkedLibraryIds}
        onClose={() => setImportOpen(false)}
        onImport={handleImport}
      />

      <LinkedParameterEditDialog
        open={linkedDialogOpen}
        parameterName={selectedParam?.name ?? ''}
        impactedTests={impactedTests}
        changedFields={changedFields}
        onClose={() => setLinkedDialogOpen(false)}
        onUpdateInLibrary={handleUpdateInLibrary}
        onKeepSeparate={handleKeepSeparate}
      />

      {(() => {
        const m = pendingRemove
          ? mappings.find((mm) => mm.id === pendingRemove)
          : null;
        const param = m ? paramById.get(m.parameterId) ?? null : null;
        const libId = param?.sourceLibraryParameterId;
        const libParam = libId
          ? state.parameters.find((p) => p.id === libId) ?? null
          : null;
        const remainingLinkedTests = libId
          ? Math.max(
              0,
              (impactedTestIdsByLibId.get(libId)?.size ?? 0) - 1,
            )
          : 0;
        const testName =
          state.tests.find((t) => t.id === testId)?.name ?? 'this test';
        return (
          <RemoveParameterFromTestDialog
            open={!!pendingRemove && !!param}
            parameterName={param?.name ?? ''}
            testName={testName}
            isLinked={!!libParam}
            libraryParameterName={libParam?.name}
            remainingLinkedTestCount={remainingLinkedTests}
            onClose={() => setPendingRemove(null)}
            onConfirm={confirmRemove}
          />
        );
      })()}
    </div>
  );
}
