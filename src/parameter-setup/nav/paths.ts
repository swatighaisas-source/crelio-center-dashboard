/**
 * Browser paths for primary lab-setup surfaces. When mounted inside the host
 * admin module the tool lives under a dynamic base
 * (e.g. `/lab/123/center/parameter-setup`), so paths are built from that base.
 * Sidebar + programmatic navigations must stay in sync with these literals.
 */
export interface ParamPaths {
  tests: string;
  parameterLibrary: string;
  assignParameters: string;
  cleanupUnused: string;
  cleanupDedupe: string;
  cleanupMissing: string;
  qcMapping: string;
  reports: string;
  reportTest: (testId: string) => string;
}

export function makePaths(base: string): ParamPaths {
  const b = base.replace(/\/+$/, '');
  return {
    tests: `${b}/tests`,
    parameterLibrary: `${b}/parameters/library`,
    assignParameters: `${b}/assign-parameters`,
    cleanupUnused: `${b}/cleanup/unused`,
    cleanupDedupe: `${b}/cleanup/dedupe`,
    cleanupMissing: `${b}/cleanup/missing-fields`,
    qcMapping: `${b}/qc-mapping`,
    reports: `${b}/reports`,
    reportTest: (testId: string) => `${b}/reports/${encodeURIComponent(testId)}`,
  };
}
