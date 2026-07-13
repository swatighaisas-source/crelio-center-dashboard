import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from 'react';
import type {
  AppState,
  LookupValue,
  Parameter,
  Test,
  TestParameterMapping,
} from '@/types';
import { buildSeed } from './seed';
import { defaultTestRowWithoutId, mergeTestFromPartial } from './testDefaults';
import {
  defaultParameterRowWithoutId,
  mergeParameterFromPartial,
} from './parameterDefaults';
import { uid } from './id';

const STORAGE_KEY = 'lab-setup/state/v1';

type LegacyTest = Partial<Test> & { id: string; active?: boolean; reportType?: string };

function migrateTest(raw: LegacyTest): Test {
  return mergeTestFromPartial(raw);
}

function migrateState(parsed: AppState): AppState {
  return {
    ...parsed,
    tests: parsed.tests.map((t) => migrateTest(t as LegacyTest)),
    parameters: parsed.parameters.map((p) =>
      mergeParameterFromPartial(p as unknown as Parameter & { id: string }),
    ),
  };
}

function loadState(): AppState {
  if (typeof window === 'undefined') return buildSeed();
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return buildSeed();
    const parsed = JSON.parse(raw) as AppState;
    if (!parsed.tests || !parsed.parameters) return buildSeed();
    return migrateState(parsed);
  } catch {
    return buildSeed();
  }
}

function saveState(state: AppState) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  } catch {
    // ignore quota errors
  }
}

/**
 * How newly created mappings should be positioned within each target test.
 * - `end`: append at the bottom; order of new items follows the `libraryParameterIds` array
 *   (the Assign UI passes library catalog order).
 * - `start`: insert at the top; new items in catalog order, then existing rows.
 * - `afterAnchor`: insert after a specific existing mapping in the single selected test.
 */
export type PlacementRule =
  | { kind: 'end' }
  | { kind: 'start' }
  | { kind: 'afterAnchor'; anchorMappingId: string };

export interface AssignResult {
  /** Number of (test, libraryParameter) pairs that produced a new mapping + child. */
  created: number;
  /** Number of pairs skipped because the library parameter was already assigned to that test. */
  skipped: number;
}

export interface BulkAssignByCodeResult {
  /** Pairs that produced a new mapping + linked child. */
  created: number;
  /** Pairs skipped because the parameter was already mapped to that test. */
  skippedDuplicate: number;
  /** Test ID values from the file that did not match any test code. */
  unmatchedTestCodes: string[];
  /** Parameter ID values from the file that did not match any library parameter code. */
  unmatchedParameterCodes: string[];
}

interface StoreContextValue {
  state: AppState;
  // tests
  setTests: (tests: Test[]) => void;
  addTest: (partial?: Partial<Test>) => Test;
  updateTest: (id: string, patch: Partial<Test>) => void;
  deleteTests: (ids: string[]) => void;
  // parameters
  setParameters: (params: Parameter[]) => void;
  addParameter: (partial?: Partial<Parameter>) => Parameter;
  updateParameter: (id: string, patch: Partial<Parameter>) => void;
  deleteParameters: (ids: string[]) => void;
  // lookups
  addDepartment: (name: string) => LookupValue;
  addSampleType: (name: string) => LookupValue;
  // mappings
  addMapping: (testId: string, parameterId: string) => TestParameterMapping | null;
  addMappings: (testIds: string[], parameterIds: string[]) => number;
  updateMapping: (id: string, patch: Partial<TestParameterMapping>) => void;
  deleteMapping: (id: string) => void;
  reorderMappings: (testId: string, orderedIds: string[]) => void;
  cloneMappings: (fromTestId: string, toTestId: string) => number;
  /**
   * High-level action for the Assign Parameters workspace.
   *
   * For each (test × library parameter) pair, creates a test-level child
   * parameter cloned from the library parameter (with `isTestLevel=true` and
   * `sourceLibraryParameterId=<libraryId>`) and adds a mapping that points at
   * that child. Skips pairs where a mapping already references a child derived
   * from the same library parameter for that test.
   */
  assignLibraryParamsToTests: (
    libraryParameterIds: string[],
    testIds: string[],
    placement: PlacementRule,
  ) => AssignResult;

  /**
   * Bulk assignment driven by an uploaded mapping file. Each pair carries a
   * test code (Test ID) and a library parameter code (Parameter ID). Codes are
   * resolved case-insensitively: test codes against `Test.code`, parameter
   * codes against non-test-level (library) `Parameter.code`. For every matched,
   * not-yet-mapped pair a test-level child is cloned from the library parameter
   * and appended to the test. Unresolved codes are reported back, not applied.
   */
  assignPairsByCode: (
    pairs: { testCode: string; parameterCode: string }[],
  ) => BulkAssignByCodeResult;

  // ---- Report Parameters (per-test editor) ----

  /**
   * Import a single library parameter into a test. Creates a test-level
   * child cloned from the library parameter (linked via
   * `sourceLibraryParameterId`) and appends a mapping at the end.
   * Returns null if the test already has a linked child for this library parameter.
   */
  importLibraryParamToTest: (
    testId: string,
    libraryParameterId: string,
  ) => { testParameter: Parameter; mapping: TestParameterMapping } | null;

  /**
   * Create a new parameter for a test. If `opts.addToLibrary` is true, also
   * create a library entry (non-test-level) and link the new test parameter
   * to it. Appends a mapping at the end.
   */
  createTestParameter: (
    testId: string,
    partial: Partial<Parameter>,
    opts?: { addToLibrary?: boolean },
  ) => {
    testParameter: Parameter;
    mapping: TestParameterMapping;
    libraryParameter: Parameter | null;
  };

  /**
   * Apply a patch to a library parameter AND propagate it to every
   * test-level child that still inherits from it. Returns the number
   * of linked test parameters that were updated.
   */
  updateLibraryParameterAndPropagate: (
    libraryParameterId: string,
    patch: Partial<Parameter>,
  ) => { linkedUpdated: number };

  /**
   * Break the library link on a test parameter (making it independent)
   * and optionally apply a field patch in the same operation.
   */
  disconnectTestParameterFromLibrary: (
    testParameterId: string,
    patch?: Partial<Parameter>,
  ) => void;

  /**
   * Promote an independent test parameter into a new library entry. Creates a
   * library row (non-test-level) cloned from the test parameter (patched with
   * `patch` if provided) and sets the test parameter's `sourceLibraryParameterId`
   * so it becomes library-linked. Returns null if the parameter is missing,
   * not a test-level row, or already linked to a library parameter.
   */
  promoteTestParameterToLibrary: (
    testParameterId: string,
    patch?: Partial<Parameter>,
  ) => { libraryParameter: Parameter } | null;

  /**
   * Attach existing independent test parameters to an existing library
   * parameter. Test mappings are preserved untouched — only the parameter row
   * is modified.
   *
   * When `useLibraryValues` is true, each test parameter's inheritable fields
   * are overwritten with the library's values. Otherwise the current values
   * are preserved (effectively an "override" — the row keeps its values but
   * now tracks future library updates).
   *
   * Returns a summary with the number of parameters actually linked and any
   * ids that were skipped (already linked, not test-level, or missing).
   */
  linkIndependentParametersToLibrary: (
    testParameterIds: string[],
    libraryParameterId: string,
    options: { useLibraryValues: boolean },
  ) => { linked: number; skipped: string[] };

  /**
   * Delete a test-level parameter along with its mapping. If the parameter
   * is independent (no `sourceLibraryParameterId`), it is removed entirely.
   * Library rows are never deleted here — use `deleteParameters` for that.
   */
  deleteTestParameter: (testParameterId: string) => void;

  /**
   * Delete one or more library parameters. Any test-level children that were
   * linked to those library rows are preserved — their
   * `sourceLibraryParameterId` is cleared so they become fully independent
   * parameters in their respective tests (keeping their current values).
   *
   * Returns a summary describing how many children were detached and which
   * tests were affected.
   */
  deleteLibraryParameters: (
    libraryParameterIds: string[],
  ) => {
    librariesDeleted: number;
    childrenDetached: number;
    affectedTestIds: string[];
  };

  // misc
  /** Write current app state to localStorage. Returns false if storage is unavailable or quota exceeded. */
  saveChanges: () => boolean;
  resetAll: () => void;
  replaceAll: (newState: AppState) => void;
}

const StoreContext = createContext<StoreContextValue | null>(null);

export function StoreProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<AppState>(() => loadState());

  useEffect(() => {
    saveState(state);
  }, [state]);

  const setTests = useCallback((tests: Test[]) => {
    setState((s) => ({ ...s, tests }));
  }, []);

  const addTest = useCallback((partial?: Partial<Test>) => {
    const t: Test = {
      id: uid('tst'),
      ...defaultTestRowWithoutId(),
      ...partial,
    };
    setState((s) => ({ ...s, tests: [...s.tests, t] }));
    return t;
  }, []);

  const updateTest = useCallback((id: string, patch: Partial<Test>) => {
    setState((s) => ({
      ...s,
      tests: s.tests.map((t) => (t.id === id ? { ...t, ...patch } : t)),
    }));
  }, []);

  const deleteTests = useCallback((ids: string[]) => {
    const set = new Set(ids);
    setState((s) => ({
      ...s,
      tests: s.tests.filter((t) => !set.has(t.id)),
      mappings: s.mappings.filter((m) => !set.has(m.testId)),
    }));
  }, []);

  const setParameters = useCallback((parameters: Parameter[]) => {
    setState((s) => ({ ...s, parameters }));
  }, []);

  const addParameter = useCallback((partial?: Partial<Parameter>) => {
    const p: Parameter = {
      id: uid('par'),
      ...defaultParameterRowWithoutId(),
      ...partial,
    };
    setState((s) => ({ ...s, parameters: [...s.parameters, p] }));
    return p;
  }, []);

  const updateParameter = useCallback((id: string, patch: Partial<Parameter>) => {
    setState((s) => ({
      ...s,
      parameters: s.parameters.map((p) => (p.id === id ? { ...p, ...patch } : p)),
    }));
  }, []);

  const deleteParameters = useCallback((ids: string[]) => {
    const set = new Set(ids);
    setState((s) => ({
      ...s,
      parameters: s.parameters.filter((p) => !set.has(p.id)),
      mappings: s.mappings.filter((m) => !set.has(m.parameterId)),
    }));
  }, []);

  const addDepartment = useCallback((name: string) => {
    const trimmed = name.trim();
    const existing = state.departments.find(
      (d) => d.name.toLowerCase() === trimmed.toLowerCase(),
    );
    if (existing) return existing;
    const dep: LookupValue = { id: uid('dep'), name: trimmed };
    setState((s) => ({ ...s, departments: [...s.departments, dep] }));
    return dep;
  }, [state.departments]);

  const addSampleType = useCallback((name: string) => {
    const trimmed = name.trim();
    const existing = state.sampleTypes.find(
      (d) => d.name.toLowerCase() === trimmed.toLowerCase(),
    );
    if (existing) return existing;
    const sample: LookupValue = { id: uid('smp'), name: trimmed };
    setState((s) => ({ ...s, sampleTypes: [...s.sampleTypes, sample] }));
    return sample;
  }, [state.sampleTypes]);

  const addMapping = useCallback(
    (testId: string, parameterId: string) => {
      let created: TestParameterMapping | null = null;
      setState((s) => {
        const already = s.mappings.some(
          (m) => m.testId === testId && m.parameterId === parameterId,
        );
        if (already) return s;
        const maxSeq = s.mappings
          .filter((m) => m.testId === testId)
          .reduce((acc, m) => Math.max(acc, m.sequence), 0);
        const mapping: TestParameterMapping = {
          id: uid('map'),
          testId,
          parameterId,
          sequence: maxSeq + 1,
          isHeader: false,
          printable: true,
          required: false,
          overrides: {},
        };
        created = mapping;
        return { ...s, mappings: [...s.mappings, mapping] };
      });
      return created;
    },
    [],
  );

  const addMappings = useCallback(
    (testIds: string[], parameterIds: string[]) => {
      let added = 0;
      setState((s) => {
        const newMaps: TestParameterMapping[] = [];
        for (const tId of testIds) {
          let maxSeq = s.mappings
            .filter((m) => m.testId === tId)
            .reduce((acc, m) => Math.max(acc, m.sequence), 0);
          for (const pId of parameterIds) {
            const already =
              s.mappings.some(
                (m) => m.testId === tId && m.parameterId === pId,
              ) ||
              newMaps.some((m) => m.testId === tId && m.parameterId === pId);
            if (already) continue;
            maxSeq += 1;
            newMaps.push({
              id: uid('map'),
              testId: tId,
              parameterId: pId,
              sequence: maxSeq,
              isHeader: false,
              printable: true,
              required: false,
              overrides: {},
            });
          }
        }
        added = newMaps.length;
        return { ...s, mappings: [...s.mappings, ...newMaps] };
      });
      return added;
    },
    [],
  );

  const updateMapping = useCallback(
    (id: string, patch: Partial<TestParameterMapping>) => {
      setState((s) => ({
        ...s,
        mappings: s.mappings.map((m) => (m.id === id ? { ...m, ...patch } : m)),
      }));
    },
    [],
  );

  const deleteMapping = useCallback((id: string) => {
    setState((s) => ({ ...s, mappings: s.mappings.filter((m) => m.id !== id) }));
  }, []);

  const reorderMappings = useCallback((testId: string, orderedIds: string[]) => {
    setState((s) => {
      const seqMap = new Map(orderedIds.map((id, idx) => [id, idx + 1]));
      return {
        ...s,
        mappings: s.mappings.map((m) => {
          if (m.testId !== testId) return m;
          const nextSeq = seqMap.get(m.id);
          return nextSeq ? { ...m, sequence: nextSeq } : m;
        }),
      };
    });
  }, []);

  const cloneMappings = useCallback(
    (fromTestId: string, toTestId: string) => {
      let cloned = 0;
      setState((s) => {
        const src = s.mappings
          .filter((m) => m.testId === fromTestId)
          .sort((a, b) => a.sequence - b.sequence);
        const existingParamIds = new Set(
          s.mappings
            .filter((m) => m.testId === toTestId)
            .map((m) => m.parameterId),
        );
        let maxSeq = s.mappings
          .filter((m) => m.testId === toTestId)
          .reduce((acc, m) => Math.max(acc, m.sequence), 0);
        const newMaps: TestParameterMapping[] = [];
        for (const m of src) {
          if (existingParamIds.has(m.parameterId)) continue;
          maxSeq += 1;
          newMaps.push({
            ...m,
            id: uid('map'),
            testId: toTestId,
            sequence: maxSeq,
          });
        }
        cloned = newMaps.length;
        return { ...s, mappings: [...s.mappings, ...newMaps] };
      });
      return cloned;
    },
    [],
  );

  const assignLibraryParamsToTests = useCallback(
    (
      libraryParameterIds: string[],
      testIds: string[],
      placement: PlacementRule,
    ): AssignResult => {
      let created = 0;
      let skipped = 0;
      setState((s) => {
        const paramById = new Map(s.parameters.map((p) => [p.id, p] as const));
        const newParams: Parameter[] = [];
        const newMappings: TestParameterMapping[] = [];

        for (const testId of testIds) {
          const existing = s.mappings
            .filter((m) => m.testId === testId)
            .sort((a, b) => a.sequence - b.sequence);

          const libIdsAlreadyOnTest = new Set<string>();
          for (const m of existing) {
            const child = paramById.get(m.parameterId);
            const libId = child?.sourceLibraryParameterId ?? m.parameterId;
            libIdsAlreadyOnTest.add(libId);
          }

          const additions: { libId: string; mapping: TestParameterMapping }[] = [];
          for (const libId of libraryParameterIds) {
            const lib = paramById.get(libId);
            if (!lib) {
              skipped += 1;
              continue;
            }
            if (libIdsAlreadyOnTest.has(libId)) {
              skipped += 1;
              continue;
            }
            libIdsAlreadyOnTest.add(libId);

            const childId = uid('par');
            const child: Parameter = {
              ...lib,
              id: childId,
              isTestLevel: true,
              sourceLibraryParameterId: libId,
            };
            newParams.push(child);

            const mapping: TestParameterMapping = {
              id: uid('map'),
              testId,
              parameterId: childId,
              sequence: 0,
              isHeader: false,
              printable: true,
              required: false,
              overrides: {},
            };
            additions.push({ libId, mapping });
          }

          if (additions.length === 0) continue;

          const finalOrdered: TestParameterMapping[] = [];
          const mapSeq = (list: TestParameterMapping[]) =>
            list.map((m, idx) => ({ ...m, sequence: idx + 1 }));

          if (placement.kind === 'start') {
            finalOrdered.push(...additions.map((a) => a.mapping));
            finalOrdered.push(...existing);
          } else if (placement.kind === 'afterAnchor') {
            const anchorIdx = existing.findIndex(
              (m) => m.id === placement.anchorMappingId,
            );
            if (anchorIdx === -1) {
              finalOrdered.push(...existing, ...additions.map((a) => a.mapping));
            } else {
              finalOrdered.push(...existing.slice(0, anchorIdx + 1));
              finalOrdered.push(...additions.map((a) => a.mapping));
              finalOrdered.push(...existing.slice(anchorIdx + 1));
            }
          } else {
            // 'end' — append at the bottom; `additions` follow caller's id order.
            finalOrdered.push(...existing, ...additions.map((a) => a.mapping));
          }

          const resequenced = mapSeq(finalOrdered);
          const idToReseq = new Map(resequenced.map((m) => [m.id, m] as const));

          // Keep untouched mappings; only replace those we re-sequenced, and add
          // the brand-new ones.
          for (const r of resequenced) {
            if (additions.some((a) => a.mapping.id === r.id)) {
              newMappings.push(r);
            }
          }

          // Update sequences on pre-existing mappings (they may have shifted).
          // We merge these below by rewriting s.mappings.
          s = {
            ...s,
            mappings: s.mappings.map((m) => {
              if (m.testId !== testId) return m;
              const next = idToReseq.get(m.id);
              return next ? { ...m, sequence: next.sequence } : m;
            }),
          };

          created += additions.length;
        }

        if (newParams.length === 0 && newMappings.length === 0) return s;

        return {
          ...s,
          parameters: [...s.parameters, ...newParams],
          mappings: [...s.mappings, ...newMappings],
        };
      });
      return { created, skipped };
    },
    [],
  );

  const assignPairsByCode = useCallback(
    (pairs: { testCode: string; parameterCode: string }[]): BulkAssignByCodeResult => {
      let result: BulkAssignByCodeResult = {
        created: 0,
        skippedDuplicate: 0,
        unmatchedTestCodes: [],
        unmatchedParameterCodes: [],
      };
      setState((s) => {
        const norm = (v: string) => v.trim().toLowerCase();

        // code → id lookups (first occurrence wins).
        const testIdByCode = new Map<string, string>();
        for (const t of s.tests) {
          const k = norm(t.code);
          if (k && !testIdByCode.has(k)) testIdByCode.set(k, t.id);
        }
        const libIdByCode = new Map<string, string>();
        for (const p of s.parameters) {
          if (p.isTestLevel) continue;
          const k = norm(p.code);
          if (k && !libIdByCode.has(k)) libIdByCode.set(k, p.id);
        }

        const unmatchedTests = new Set<string>();
        const unmatchedParams = new Set<string>();

        // Group resolved library-parameter ids by test, preserving file order.
        const libIdsByTest = new Map<string, string[]>();
        for (const { testCode, parameterCode } of pairs) {
          const tId = testIdByCode.get(norm(testCode));
          const pId = libIdByCode.get(norm(parameterCode));
          if (!tId) unmatchedTests.add(testCode);
          if (!pId) unmatchedParams.add(parameterCode);
          if (!tId || !pId) continue;
          const arr = libIdsByTest.get(tId);
          if (arr) arr.push(pId);
          else libIdsByTest.set(tId, [pId]);
        }

        const paramById = new Map(s.parameters.map((p) => [p.id, p] as const));
        const newParams: Parameter[] = [];
        const newMappings: TestParameterMapping[] = [];
        let created = 0;
        let skippedDuplicate = 0;

        for (const [testId, libIds] of libIdsByTest) {
          // Library ids already on this test (resolve children back to source).
          const libIdsAlready = new Set<string>();
          let maxSeq = 0;
          for (const m of s.mappings) {
            if (m.testId !== testId) continue;
            maxSeq = Math.max(maxSeq, m.sequence);
            const child = paramById.get(m.parameterId);
            libIdsAlready.add(child?.sourceLibraryParameterId ?? m.parameterId);
          }
          for (const libId of libIds) {
            if (libIdsAlready.has(libId)) {
              skippedDuplicate += 1;
              continue;
            }
            libIdsAlready.add(libId);
            const lib = paramById.get(libId);
            if (!lib) continue;
            const childId = uid('par');
            newParams.push({
              ...lib,
              id: childId,
              isTestLevel: true,
              sourceLibraryParameterId: libId,
            });
            maxSeq += 1;
            newMappings.push({
              id: uid('map'),
              testId,
              parameterId: childId,
              sequence: maxSeq,
              isHeader: false,
              printable: true,
              required: false,
              overrides: {},
            });
            created += 1;
          }
        }

        result = {
          created,
          skippedDuplicate,
          unmatchedTestCodes: Array.from(unmatchedTests),
          unmatchedParameterCodes: Array.from(unmatchedParams),
        };

        if (newParams.length === 0 && newMappings.length === 0) return s;
        return {
          ...s,
          parameters: [...s.parameters, ...newParams],
          mappings: [...s.mappings, ...newMappings],
        };
      });
      return result;
    },
    [],
  );

  // Fields that should NOT be copied from a library edit to its linked children.
  // Everything else (ranges, units, other-info flags, etc.) is considered inheritable.
  const NON_INHERITABLE = new Set<keyof Parameter>([
    'id',
    'isTestLevel',
    'sourceLibraryParameterId',
  ]);

  const importLibraryParamToTest = useCallback(
    (testId: string, libraryParameterId: string) => {
      let result: { testParameter: Parameter; mapping: TestParameterMapping } | null = null;
      setState((s) => {
        const lib = s.parameters.find((p) => p.id === libraryParameterId);
        if (!lib || lib.isTestLevel) return s;
        // Already linked? Walk each mapping on this test back to its source library id.
        const paramById = new Map(s.parameters.map((p) => [p.id, p] as const));
        const already = s.mappings.some((m) => {
          if (m.testId !== testId) return false;
          const child = paramById.get(m.parameterId);
          const libId = child?.sourceLibraryParameterId ?? m.parameterId;
          return libId === libraryParameterId;
        });
        if (already) return s;
        const childId = uid('par');
        const child: Parameter = {
          ...lib,
          id: childId,
          isTestLevel: true,
          sourceLibraryParameterId: libraryParameterId,
        };
        const maxSeq = s.mappings
          .filter((m) => m.testId === testId)
          .reduce((acc, m) => Math.max(acc, m.sequence), 0);
        const mapping: TestParameterMapping = {
          id: uid('map'),
          testId,
          parameterId: childId,
          sequence: maxSeq + 1,
          isHeader: false,
          printable: true,
          required: false,
          overrides: {},
        };
        result = { testParameter: child, mapping };
        return {
          ...s,
          parameters: [...s.parameters, child],
          mappings: [...s.mappings, mapping],
        };
      });
      return result;
    },
    [],
  );

  const createTestParameter = useCallback(
    (
      testId: string,
      partial: Partial<Parameter>,
      opts?: { addToLibrary?: boolean },
    ) => {
      let returnValue: {
        testParameter: Parameter;
        mapping: TestParameterMapping;
        libraryParameter: Parameter | null;
      } | null = null;

      setState((s) => {
        const base = defaultParameterRowWithoutId();
        let libraryParameter: Parameter | null = null;
        const newParams: Parameter[] = [];

        let sourceLibraryParameterId: string | undefined;
        if (opts?.addToLibrary) {
          libraryParameter = {
            ...base,
            ...partial,
            id: uid('par'),
            isTestLevel: false,
            sourceLibraryParameterId: undefined,
          };
          newParams.push(libraryParameter);
          sourceLibraryParameterId = libraryParameter.id;
        }

        const testParameter: Parameter = {
          ...base,
          ...partial,
          id: uid('par'),
          isTestLevel: true,
          sourceLibraryParameterId,
        };
        newParams.push(testParameter);

        const maxSeq = s.mappings
          .filter((m) => m.testId === testId)
          .reduce((acc, m) => Math.max(acc, m.sequence), 0);
        const mapping: TestParameterMapping = {
          id: uid('map'),
          testId,
          parameterId: testParameter.id,
          sequence: maxSeq + 1,
          isHeader: false,
          printable: true,
          required: false,
          overrides: {},
        };

        returnValue = { testParameter, mapping, libraryParameter };
        return {
          ...s,
          parameters: [...s.parameters, ...newParams],
          mappings: [...s.mappings, mapping],
        };
      });

      if (!returnValue) {
        throw new Error('createTestParameter: state update did not produce a result');
      }
      return returnValue;
    },
    [],
  );

  const updateLibraryParameterAndPropagate = useCallback(
    (libraryParameterId: string, patch: Partial<Parameter>) => {
      let linkedUpdated = 0;
      setState((s) => {
        const lib = s.parameters.find((p) => p.id === libraryParameterId);
        if (!lib) return s;

        // Strip non-inheritable fields from the propagation patch. The library
        // row itself accepts the full patch (minus id-scoped keys).
        const inheritable: Partial<Parameter> = {};
        for (const key of Object.keys(patch) as (keyof Parameter)[]) {
          if (!NON_INHERITABLE.has(key)) {
            (inheritable as Record<string, unknown>)[key] = patch[key];
          }
        }

        const parameters = s.parameters.map((p) => {
          if (p.id === libraryParameterId) {
            return { ...p, ...patch, id: p.id, isTestLevel: false };
          }
          if (
            p.isTestLevel &&
            p.sourceLibraryParameterId === libraryParameterId
          ) {
            linkedUpdated += 1;
            return { ...p, ...inheritable };
          }
          return p;
        });

        return { ...s, parameters };
      });
      return { linkedUpdated };
    },
    [],
  );

  const disconnectTestParameterFromLibrary = useCallback(
    (testParameterId: string, patch?: Partial<Parameter>) => {
      setState((s) => ({
        ...s,
        parameters: s.parameters.map((p) => {
          if (p.id !== testParameterId) return p;
          return {
            ...p,
            ...(patch ?? {}),
            id: p.id,
            isTestLevel: true,
            sourceLibraryParameterId: undefined,
          };
        }),
      }));
    },
    [],
  );

  const promoteTestParameterToLibrary = useCallback(
    (testParameterId: string, patch?: Partial<Parameter>) => {
      let result: { libraryParameter: Parameter } | null = null;
      setState((s) => {
        const testParam = s.parameters.find((p) => p.id === testParameterId);
        if (
          !testParam ||
          !testParam.isTestLevel ||
          testParam.sourceLibraryParameterId
        ) {
          return s;
        }
        // Fold in any draft edits the caller wants to persist as part of the
        // promotion, then strip test-level markers for the library copy.
        const merged: Parameter = { ...testParam, ...(patch ?? {}) };
        const libraryParameter: Parameter = {
          ...merged,
          id: uid('par'),
          isTestLevel: false,
          sourceLibraryParameterId: undefined,
        };
        result = { libraryParameter };
        return {
          ...s,
          parameters: s.parameters.map((p) => {
            if (p.id === testParameterId) {
              return {
                ...merged,
                id: p.id,
                isTestLevel: true,
                sourceLibraryParameterId: libraryParameter.id,
              };
            }
            return p;
          }).concat(libraryParameter),
        };
      });
      return result;
    },
    [],
  );

  const linkIndependentParametersToLibrary = useCallback(
    (
      testParameterIds: string[],
      libraryParameterId: string,
      options: { useLibraryValues: boolean },
    ) => {
      let linked = 0;
      const skipped: string[] = [];
      setState((s) => {
        const lib = s.parameters.find((p) => p.id === libraryParameterId);
        if (!lib || lib.isTestLevel) {
          // Nothing to link to — skip everything.
          for (const id of testParameterIds) skipped.push(id);
          return s;
        }

        // Pre-compute the inheritable slice of the library so we can copy it
        // onto each linked child when `useLibraryValues` is true.
        const inheritable: Partial<Parameter> = {};
        for (const key of Object.keys(lib) as (keyof Parameter)[]) {
          if (!NON_INHERITABLE.has(key)) {
            (inheritable as Record<string, unknown>)[key] = lib[key];
          }
        }

        const idSet = new Set(testParameterIds);
        const parameters = s.parameters.map((p) => {
          if (!idSet.has(p.id)) return p;
          if (!p.isTestLevel || p.sourceLibraryParameterId) {
            skipped.push(p.id);
            return p;
          }
          linked += 1;
          const base = options.useLibraryValues
            ? { ...p, ...inheritable }
            : p;
          return {
            ...base,
            id: p.id,
            isTestLevel: true,
            sourceLibraryParameterId: libraryParameterId,
          };
        });

        return { ...s, parameters };
      });
      return { linked, skipped };
    },
    [],
  );

  const deleteLibraryParameters = useCallback(
    (libraryParameterIds: string[]) => {
      let summary = {
        librariesDeleted: 0,
        childrenDetached: 0,
        affectedTestIds: [] as string[],
      };
      setState((s) => {
        const delSet = new Set(libraryParameterIds);
        const paramById = new Map(s.parameters.map((p) => [p.id, p] as const));

        // Count libraries that actually exist and are non-test-level.
        let librariesDeleted = 0;
        for (const id of delSet) {
          const p = paramById.get(id);
          if (p && !p.isTestLevel) librariesDeleted += 1;
        }

        let childrenDetached = 0;
        const affectedTests = new Set<string>();
        for (const m of s.mappings) {
          const child = paramById.get(m.parameterId);
          if (
            child?.sourceLibraryParameterId &&
            delSet.has(child.sourceLibraryParameterId)
          ) {
            affectedTests.add(m.testId);
          }
        }
        for (const p of s.parameters) {
          if (
            p.isTestLevel &&
            p.sourceLibraryParameterId &&
            delSet.has(p.sourceLibraryParameterId)
          ) {
            childrenDetached += 1;
          }
        }

        summary = {
          librariesDeleted,
          childrenDetached,
          affectedTestIds: Array.from(affectedTests),
        };

        return {
          ...s,
          parameters: s.parameters
            // Remove the library rows themselves.
            .filter((p) => !(delSet.has(p.id) && !p.isTestLevel))
            // Detach any still-linked children so they become independent
            // but keep their values + mappings intact.
            .map((p) => {
              if (
                p.isTestLevel &&
                p.sourceLibraryParameterId &&
                delSet.has(p.sourceLibraryParameterId)
              ) {
                return { ...p, sourceLibraryParameterId: undefined };
              }
              return p;
            }),
          // Drop any *direct* mappings pointing at the deleted library rows
          // (legacy data-shape). Child mappings are left alone.
          mappings: s.mappings.filter((m) => {
            const p = paramById.get(m.parameterId);
            if (p && !p.isTestLevel && delSet.has(p.id)) return false;
            return true;
          }),
        };
      });
      return summary;
    },
    [],
  );

  const deleteTestParameter = useCallback((testParameterId: string) => {
    setState((s) => {
      const param = s.parameters.find((p) => p.id === testParameterId);
      // Only test-level rows are managed from the Report Parameters screen.
      if (!param || !param.isTestLevel) return s;
      return {
        ...s,
        parameters: s.parameters.filter((p) => p.id !== testParameterId),
        mappings: s.mappings.filter((m) => m.parameterId !== testParameterId),
      };
    });
  }, []);

  const resetAll = useCallback(() => {
    setState(buildSeed());
  }, []);

  const replaceAll = useCallback((newState: AppState) => {
    setState(newState);
  }, []);

  const saveChanges = useCallback((): boolean => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
      return true;
    } catch {
      return false;
    }
  }, [state]);

  const value = useMemo<StoreContextValue>(
    () => ({
      state,
      setTests,
      addTest,
      updateTest,
      deleteTests,
      setParameters,
      addParameter,
      updateParameter,
      deleteParameters,
      addDepartment,
      addSampleType,
      addMapping,
      addMappings,
      updateMapping,
      deleteMapping,
      reorderMappings,
      cloneMappings,
      assignLibraryParamsToTests,
      assignPairsByCode,
      importLibraryParamToTest,
      createTestParameter,
      updateLibraryParameterAndPropagate,
      disconnectTestParameterFromLibrary,
      promoteTestParameterToLibrary,
      linkIndependentParametersToLibrary,
      deleteTestParameter,
      deleteLibraryParameters,
      saveChanges,
      resetAll,
      replaceAll,
    }),
    [
      state,
      setTests,
      addTest,
      updateTest,
      deleteTests,
      setParameters,
      addParameter,
      updateParameter,
      deleteParameters,
      addDepartment,
      addSampleType,
      addMapping,
      addMappings,
      updateMapping,
      deleteMapping,
      reorderMappings,
      cloneMappings,
      assignLibraryParamsToTests,
      assignPairsByCode,
      importLibraryParamToTest,
      createTestParameter,
      updateLibraryParameterAndPropagate,
      disconnectTestParameterFromLibrary,
      promoteTestParameterToLibrary,
      linkIndependentParametersToLibrary,
      deleteTestParameter,
      deleteLibraryParameters,
      saveChanges,
      resetAll,
      replaceAll,
    ],
  );

  return <StoreContext.Provider value={value}>{children}</StoreContext.Provider>;
}

export function useStore() {
  const ctx = useContext(StoreContext);
  if (!ctx) throw new Error('useStore must be used inside StoreProvider');
  return ctx;
}
