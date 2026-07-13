import { LAB_MODULE_IDS, type LabModuleId } from "../data/labModules";
import { LabModulePage } from "./LabModulePage";

function createLabModuleRoute(moduleId: LabModuleId) {
  function LabModuleRoutePage() {
    return <LabModulePage moduleId={moduleId} />;
  }
  LabModuleRoutePage.displayName = `LabModuleRoute(${moduleId})`;
  return LabModuleRoutePage;
}

/** One route component per module so client navigation always remounts the shell. */
export const LAB_MODULE_ROUTE_PAGES = Object.fromEntries(
  LAB_MODULE_IDS.map((moduleId) => [moduleId, createLabModuleRoute(moduleId)]),
) as Record<LabModuleId, ReturnType<typeof createLabModuleRoute>>;
