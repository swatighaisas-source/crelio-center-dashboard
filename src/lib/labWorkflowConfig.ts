import type { LabDetail } from "../data/labDetails";
import { resolveLabWorkflowConfig } from "../data/labWorkflowConfig";

export function getLabWorkflowConfig(lab: LabDetail) {
  return resolveLabWorkflowConfig(lab.workflowConfig);
}
