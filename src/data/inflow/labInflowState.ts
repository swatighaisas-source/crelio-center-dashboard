import type { ExceptionRecord } from "./exceptionTypes";
import type { InflowNotification } from "./engineNotifications";
import { mockOrders } from "./mockOrders";
import { mockReports } from "./mockReports";
import { mockSamples } from "./mockSamples";
import type { LabTask, TaskComment, TaskUser } from "./mockTasks";
import { taskUsers } from "./mockTasks";
import type { Order } from "./mockOrders";
import type { Report } from "./mockReports";
import type { Sample } from "./mockSamples";
import { newLabConfig, type RolloutConfig } from "./rolloutConfig";

export type LabInflowState = {
  labId: number;
  orders: Order[];
  samples: Sample[];
  reports: Report[];
  exceptionRecords: ExceptionRecord[];
  tasks: LabTask[];
  notifications: InflowNotification[];
  taskComments: TaskComment[];
  rolloutConfig: RolloutConfig;
  currentUser: TaskUser;
};

function cloneGraph() {
  return {
    orders: structuredClone(mockOrders),
    samples: structuredClone(mockSamples),
    reports: structuredClone(mockReports),
  };
}

export function createLabInflowState(labId: number): LabInflowState {
  const graph = cloneGraph();
  return {
    labId,
    ...graph,
    exceptionRecords: [],
    tasks: [],
    notifications: [],
    taskComments: [],
    rolloutConfig: structuredClone(newLabConfig),
    currentUser: taskUsers[0],
  };
}

const labStateCache = new Map<number, LabInflowState>();

export function getOrCreateLabInflowState(labId: number): LabInflowState {
  let state = labStateCache.get(labId);
  if (!state) {
    state = createLabInflowState(labId);
    labStateCache.set(labId, state);
  }
  return state;
}

export function resetLabInflowState(labId: number): LabInflowState {
  const state = createLabInflowState(labId);
  labStateCache.set(labId, state);
  return state;
}
