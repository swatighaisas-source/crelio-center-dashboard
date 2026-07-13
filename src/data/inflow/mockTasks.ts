export type TaskStatus = "OPEN" | "RESOLVED";
export type TaskVisibility = "lab_internal" | "shared_with_client";
export type TaskUserRole = "lab" | "client";

export type TaskUser = {
  assignee: string;
  assigneeInitials: string;
  assigneeColor: string;
  role: TaskUserRole;
  organization?: string;
};

export type LabTask = {
  id: string;
  category: string;
  categoryClass: string;
  sourceLevel?: "order" | "bill" | "sample" | "report";
  sourceId?: string;
  exceptionKey?: string;
  title: string;
  subtitle: string;
  assignee: string;
  assigneeInitials: string;
  assigneeColor: string;
  patient: string;
  visibility: TaskVisibility;
  sharedWith: string[];
  status: TaskStatus;
  description: string;
  createdBy: string;
  reportedBy: string;
  createdAt: string;
  watchers: string[];
};

export type TaskAssignee = TaskUser;

export type TaskComment = {
  id: string;
  taskId: string;
  author: string;
  text: string;
  createdAt: string;
  replies?: string[];
  attachments?: boolean;
  internal?: boolean;
};

export const taskAssignees: TaskAssignee[] = [
  { assignee: "Operations Manager", assigneeInitials: "OM", assigneeColor: "#008b65", role: "lab" },
  { assignee: "Lab Technician", assigneeInitials: "LT", assigneeColor: "#0f74d9", role: "lab" },
  { assignee: "Client Support", assigneeInitials: "CS", assigneeColor: "#0f938f", role: "lab" },
  { assignee: "Billing Specialist", assigneeInitials: "BS", assigneeColor: "#61708a", role: "lab" },
];

export const clientUsers: TaskUser[] = [
  {
    assignee: "Amazon Client",
    assigneeInitials: "AM",
    assigneeColor: "#7b5bbd",
    role: "client",
    organization: "Amazon",
  },
  {
    assignee: "Demo Client",
    assigneeInitials: "DC",
    assigneeColor: "#b2672f",
    role: "client",
    organization: "Demo",
  },
];

export const taskUsers: TaskUser[] = [...taskAssignees, ...clientUsers];

export const mockTasks: LabTask[] = [];

export const initialTaskComments: TaskComment[] = [];
