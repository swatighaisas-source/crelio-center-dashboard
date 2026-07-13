export type LabUserRole = "owner" | "technician" | "front-desk" | "director" | "billing";

/** Where the user lands after login; null = intro not completed yet */
export type HomeLandingPreference = "center" | "old-account-overview";

export const LANDING_PREFERENCE_OPTIONS: {
  id: HomeLandingPreference;
  title: string;
  description: string;
}[] = [
  {
    id: "center",
    title: "Go to Center Management after login",
    description: "Open Lab Settings (Center Management) every time you log in.",
  },
  {
    id: "old-account-overview",
    title: "Go to Old account overview",
    description: "Open the classic Account Overview (Finance, Collections, Overview tabs) after login.",
  },
];

export const ROLE_LABELS: Record<LabUserRole, string> = {
  owner: "Lab Owner / Admin",
  technician: "Lab Technician",
  "front-desk": "Front Desk / Receptionist",
  director: "Lab Director / Reviewer",
  billing: "Billing Manager",
};

export type StatusTone = "green" | "red" | "blue" | "orange";
export type StatusIcon = "report" | "flag" | "tube" | "warning" | "users" | "dollar" | "clock" | "check";
export type QuickActionIcon = "track" | "trf" | "label" | "register" | "results" | "invoice" | "approve" | "flag-action";
export type ModuleIcon = "registration" | "inbox" | "bills" | "accession" | "tracker" | "collections" | "users" | "critical";
export type TaskIcon = "task" | "alert" | "invoice-task" | "sample" | "report-task";

export interface StatusCard {
  id: string;
  title: string;
  description: string;
  count: number;
  tone: StatusTone;
  icon: StatusIcon;
}

export interface QuickAction {
  id: string;
  title: string;
  subtitle: string;
  actionLabel: string;
  icon: QuickActionIcon;
}

export interface ModuleCard {
  id: string;
  title: string;
  description: string;
  icon: ModuleIcon;
}

export interface OpenTask {
  id: string;
  title: string;
  description: string;
  count: number;
  tone: StatusTone;
  icon: TaskIcon;
  actionLabel: string;
}

export interface PersonaConfig {
  statusCards: StatusCard[];
  openTasks: OpenTask[];
  quickActions: QuickAction[];
  modules: ModuleCard[];
  sidebarShortcuts: string[];
  notificationCount: number;
}

/** Default unread count on account-overview (admin) sidebar */
export const ADMIN_SIDEBAR_NOTIFICATION_COUNT = 12;

export const PERSONA_CONFIG: Record<LabUserRole, PersonaConfig> = {
  owner: {
    statusCards: [
      { id: "final-reports", title: "Final Reports Ready", description: "Reports are ready for sharing", count: 22, tone: "green", icon: "report" },
      { id: "open-issues", title: "Open Issues", description: "Issues raised by the lab", count: 24, tone: "orange", icon: "warning" },
      { id: "billing-disc", title: "Billing Discrepancies", description: "Invoices with mismatches", count: 5, tone: "red", icon: "dollar" },
      { id: "active-users", title: "Active Users Today", description: "Staff logged in today", count: 11, tone: "blue", icon: "users" },
    ],
    openTasks: [
      { id: "pending-approvals", title: "Pending Report Approvals", description: "Reports waiting for your sign-off", count: 8, tone: "orange", icon: "report-task", actionLabel: "Review" },
      { id: "unresolved-issues", title: "Unresolved Issues", description: "Lab issues needing resolution", count: 7, tone: "red", icon: "alert", actionLabel: "Resolve" },
      { id: "unpaid-invoices", title: "Unpaid Invoices", description: "Outstanding payments pending", count: 12, tone: "orange", icon: "invoice-task", actionLabel: "View" },
    ],
    quickActions: [
      { id: "view-reports", title: "View Reports", subtitle: "All final and pending reports", actionLabel: "Open", icon: "results" },
      { id: "billing-summary", title: "Billing Summary", subtitle: "Invoices and payment status", actionLabel: "Open", icon: "invoice" },
      { id: "track", title: "Track Sample", subtitle: "Track by Bill/Sample ID", actionLabel: "Track", icon: "track" },
    ],
    modules: [
      { id: "registration", title: "Registration", description: "Register new patients and bills", icon: "registration" },
      { id: "bills", title: "Bills Generated", description: "Manage invoices and payments", icon: "bills" },
      { id: "users", title: "User Management", description: "Manage staff access and roles", icon: "users" },
    ],
    sidebarShortcuts: ["provider", "profile", "activity"],
    notificationCount: 12,
  },

  technician: {
    statusCards: [
      { id: "pending-entry", title: "Samples Pending Entry", description: "Awaiting result entry", count: 18, tone: "orange", icon: "tube" },
      { id: "recollection", title: "Recollection Requests", description: "Samples requiring recollection", count: 4, tone: "red", icon: "flag" },
      { id: "critical-results", title: "Critical Results", description: "Results needing urgent attention", count: 3, tone: "red", icon: "warning" },
      { id: "tat-breaches", title: "TAT Breaches", description: "Tests exceeding turnaround time", count: 6, tone: "orange", icon: "clock" },
    ],
    openTasks: [
      { id: "awaiting-entry", title: "Awaiting Result Entry", description: "Samples collected, results not entered", count: 18, tone: "orange", icon: "sample", actionLabel: "Enter" },
      { id: "recollect", title: "Recollection Pending", description: "Patient samples to be recollected", count: 4, tone: "red", icon: "alert", actionLabel: "View" },
      { id: "urgent-tests", title: "Urgent / STAT Tests", description: "High-priority tests in queue", count: 5, tone: "red", icon: "task", actionLabel: "Process" },
    ],
    quickActions: [
      { id: "enter-results", title: "Enter Results", subtitle: "Input test results for samples", actionLabel: "Open", icon: "results" },
      { id: "track", title: "Track Sample", subtitle: "Track status by Sample ID", actionLabel: "Track", icon: "track" },
      { id: "print-label", title: "Print Label", subtitle: "Barcode for collected samples", actionLabel: "Print", icon: "label" },
    ],
    modules: [
      { id: "accession", title: "Accession", description: "Sample accession and processing", icon: "accession" },
      { id: "inbox", title: "Results Inbox", description: "View and enter lab results", icon: "inbox" },
      { id: "tracker", title: "Sample Tracker", description: "Live status of all samples", icon: "tracker" },
    ],
    sidebarShortcuts: ["validator", "department", "outsourcing"],
    notificationCount: 9,
  },

  "front-desk": {
    statusCards: [
      { id: "registered-today", title: "Patients Registered", description: "Registrations done today", count: 34, tone: "green", icon: "users" },
      { id: "bills-pending", title: "Bills Pending", description: "Generated but unpaid bills", count: 9, tone: "orange", icon: "dollar" },
      { id: "trf-printed", title: "TRF Printed", description: "Test request forms printed today", count: 21, tone: "blue", icon: "report" },
      { id: "samples-collected", title: "Samples Collected", description: "Samples handed to lab today", count: 28, tone: "green", icon: "tube" },
    ],
    openTasks: [
      { id: "incomplete-reg", title: "Incomplete Registrations", description: "Walk-ins with partial details", count: 3, tone: "orange", icon: "task", actionLabel: "Complete" },
      { id: "pending-bills", title: "Pending Bill Generation", description: "Tests registered but not billed", count: 6, tone: "red", icon: "invoice-task", actionLabel: "Generate" },
      { id: "unprinted-trf", title: "Unprinted TRFs", description: "Bills without printed TRF", count: 4, tone: "orange", icon: "report-task", actionLabel: "Print" },
    ],
    quickActions: [
      { id: "new-registration", title: "New Registration", subtitle: "Register a new patient", actionLabel: "Register", icon: "register" },
      { id: "print-trf", title: "Print TRF", subtitle: "Quick print by sample no.", actionLabel: "Print", icon: "trf" },
      { id: "track", title: "Track Sample", subtitle: "Track status by Bill/Sample ID", actionLabel: "Track", icon: "track" },
    ],
    modules: [
      { id: "registration", title: "Registration", description: "Register new patients and bills", icon: "registration" },
      { id: "bills", title: "Bills Generated", description: "View and manage bills", icon: "bills" },
      { id: "tracker", title: "Sample Tracker", description: "Track collected samples", icon: "tracker" },
    ],
    sidebarShortcuts: ["provider", "list-group", "center"],
    notificationCount: 6,
  },

  director: {
    statusCards: [
      { id: "pending-review", title: "Reports Pending Review", description: "Awaiting your approval", count: 16, tone: "orange", icon: "report" },
      { id: "critical-reports", title: "Critical Reports", description: "Results requiring immediate attention", count: 14, tone: "red", icon: "flag" },
      { id: "tat-alerts", title: "TAT Alerts", description: "Tests breaching turnaround time", count: 7, tone: "orange", icon: "clock" },
      { id: "approved-today", title: "Approved Today", description: "Reports signed off today", count: 31, tone: "green", icon: "check" },
    ],
    openTasks: [
      { id: "sign-off", title: "Reports Awaiting Sign-off", description: "Ready for your final approval", count: 16, tone: "orange", icon: "report-task", actionLabel: "Review" },
      { id: "critical-follow", title: "Critical Flag Follow-ups", description: "Flagged results without action", count: 5, tone: "red", icon: "alert", actionLabel: "Action" },
      { id: "tat-breach-list", title: "TAT Breach List", description: "Tests past their deadline", count: 7, tone: "red", icon: "task", actionLabel: "View" },
    ],
    quickActions: [
      { id: "review-reports", title: "Review Reports", subtitle: "Approve or reject pending reports", actionLabel: "Open", icon: "results" },
      { id: "flag-critical", title: "Flag Critical", subtitle: "Mark results for urgent follow-up", actionLabel: "Flag", icon: "flag-action" },
      { id: "approve-batch", title: "Approve Batch", subtitle: "Sign off a batch of reports", actionLabel: "Approve", icon: "approve" },
    ],
    modules: [
      { id: "inbox", title: "Results Inbox", description: "View and approve lab results", icon: "inbox" },
      { id: "critical", title: "Critical Reports", description: "Manage flagged critical results", icon: "critical" },
      { id: "accession", title: "Accession", description: "Sample and test management", icon: "accession" },
    ],
    sidebarShortcuts: ["validator", "lab-forms", "department"],
    notificationCount: 14,
  },

  billing: {
    statusCards: [
      { id: "outstanding", title: "Outstanding Amount", description: "Total unpaid across all bills", count: 148, tone: "red", icon: "dollar" },
      { id: "due-today", title: "Invoices Due Today", description: "Payments expected today", count: 12, tone: "orange", icon: "warning" },
      { id: "received", title: "Payments Received", description: "Payments collected today", count: 27, tone: "green", icon: "check" },
      { id: "credits", title: "Credits Pending", description: "Credit notes awaiting issue", count: 6, tone: "blue", icon: "report" },
    ],
    openTasks: [
      { id: "overdue-invoices", title: "Overdue Invoices", description: "Invoices past their due date", count: 19, tone: "red", icon: "invoice-task", actionLabel: "Follow Up" },
      { id: "unmatched-payments", title: "Unmatched Payments", description: "Payments without an invoice link", count: 4, tone: "orange", icon: "alert", actionLabel: "Match" },
      { id: "pending-credits", title: "Pending Credit Notes", description: "Credit requests not yet processed", count: 6, tone: "orange", icon: "task", actionLabel: "Process" },
    ],
    quickActions: [
      { id: "generate-invoice", title: "Generate Invoice", subtitle: "Create a new invoice", actionLabel: "Create", icon: "invoice" },
      { id: "record-payment", title: "Record Payment", subtitle: "Log an incoming payment", actionLabel: "Record", icon: "approve" },
      { id: "track", title: "Track Sample", subtitle: "Track by Bill/Sample ID", actionLabel: "Track", icon: "track" },
    ],
    modules: [
      { id: "bills", title: "Bills Generated", description: "Manage invoices and payments", icon: "bills" },
      { id: "collections", title: "Collections", description: "Track payment collections", icon: "collections" },
      { id: "registration", title: "Registration", description: "View billing-linked registrations", icon: "registration" },
    ],
    sidebarShortcuts: ["marketing", "integration", "activity"],
    notificationCount: 8,
  },
};

// —— Notifications & Actions ——

export type ActionCategory =
  | "NOT_PERFORMED"
  | "UNRESOLVED"
  | "PENDING_APPROVAL"
  | "OVERDUE"
  | "RECOLLECTION"
  | "CRITICAL";
export type ActionStatus = "OPEN" | "IN_PROGRESS" | "CLOSED";

export type NotificationCategory =
  | "EXCEPTION_CREATED"
  | "MENTION"
  | "EXCEPTION_RESOLVED"
  | "ACTION_SHARED"
  | "ACTION_ASSIGNED"
  | "ADDED_AS_WATCHER"
  | "REMOVED_AS_WATCHER"
  | "NEW_COMMENT"
  | "ACTION_MADE_INTERNAL";

export const NOTIFICATION_CATEGORY_LABELS: Record<NotificationCategory, string> = {
  EXCEPTION_CREATED: "Exception Created",
  MENTION: "Mention",
  EXCEPTION_RESOLVED: "Exception Resolved",
  ACTION_SHARED: "Action Shared",
  ACTION_ASSIGNED: "Action Assigned",
  ADDED_AS_WATCHER: "Added as Watcher",
  REMOVED_AS_WATCHER: "Removed as Watcher",
  NEW_COMMENT: "New Comment",
  ACTION_MADE_INTERNAL: "Action made Internal",
};

export const NOTIFICATION_CATEGORIES = Object.keys(
  NOTIFICATION_CATEGORY_LABELS,
) as NotificationCategory[];

export function getNotificationCategoryLabel(category: NotificationCategory): string {
  return NOTIFICATION_CATEGORY_LABELS[category];
}

export function formatNotificationCategoryLine(category: NotificationCategory): string {
  return `# ${getNotificationCategoryLabel(category).toLowerCase()}`;
}

export type NotificationRelatedEntityType = "task" | "order" | "sample" | "report" | "comment";

export interface NotificationItem {
  id: string;
  category: NotificationCategory;
  title: string;
  description: string;
  isRead: boolean;
  timestamp: string;
  labId?: number;
  relatedActionId?: string;
  relatedEntityType?: NotificationRelatedEntityType;
  relatedEntityId?: string;
  actor?: string;
}

export interface ActionOwner {
  initials: string;
  name: string;
  color: string;
}

export interface ActionItem {
  id: string;
  category: ActionCategory;
  /** Short label shown in the Exception column */
  exceptionLabel: string;
  title: string;
  context: string;
  visibleToAccount: boolean;
  owner: ActionOwner;
  status: ActionStatus;
  assignedToMe: boolean;
  reportedByMe: boolean;
  hasUpdates: boolean;
  updateCount?: number;
}

export const MOCK_NOTIFICATIONS: NotificationItem[] = [
  {
    id: "notif-1",
    category: "EXCEPTION_CREATED",
    title: "Priya Sharma created an action",
    description: "Not Performed exception raised at order level (112)",
    isRead: false,
    timestamp: "2026-06-02T08:30:00",
    relatedActionId: "action-1",
  },
  {
    id: "notif-2",
    category: "ACTION_ASSIGNED",
    title: "Amit Patel assigned an action",
    description: "Sample result mismatch – Bill #4489",
    isRead: false,
    timestamp: "2026-06-02T07:15:00",
    relatedActionId: "action-2",
  },
  {
    id: "notif-3",
    category: "EXCEPTION_RESOLVED",
    title: "Neha Gupta resolved an action",
    description: "Invoice #INV-0892 payment follow-up",
    isRead: false,
    timestamp: "2026-06-02T06:05:00",
    relatedActionId: "action-3",
  },
  {
    id: "notif-4",
    category: "ACTION_SHARED",
    title: "Rahul Mehta made an action visible to your account",
    description: "Critical result review – Bill #4510",
    isRead: true,
    timestamp: "2026-06-01T17:45:00",
    relatedActionId: "action-4",
  },
  {
    id: "notif-5",
    category: "ADDED_AS_WATCHER",
    title: "Sneha Iyer added you as a watcher",
    description: "Recollection required – Bill #4498",
    isRead: false,
    timestamp: "2026-06-01T14:30:00",
    relatedActionId: "action-5",
  },
  {
    id: "notif-6",
    category: "MENTION",
    title: "Vikram Singh mentioned you in an action comment",
    description: "Please confirm if the sample was hemolyzed before we close this.",
    isRead: false,
    timestamp: "2026-06-01T11:00:00",
    relatedActionId: "action-2",
  },
  {
    id: "notif-7",
    category: "NEW_COMMENT",
    title: "Anita Desai commented on a watched action",
    description: "Attached the corrected TRF for Bill #4521.",
    isRead: true,
    timestamp: "2026-05-31T16:20:00",
    relatedActionId: "action-6",
  },
  {
    id: "notif-8",
    category: "NEW_COMMENT",
    title: "Karan Joshi commented on a watched action",
    description: "Assignee updated the due date to tomorrow.",
    isRead: true,
    timestamp: "2026-05-31T09:20:00",
    relatedActionId: "action-7",
  },
  {
    id: "notif-9",
    category: "REMOVED_AS_WATCHER",
    title: "Meera Nair removed you as a watcher",
    description: "Outsource delay – Bill #4445",
    isRead: true,
    timestamp: "2026-05-30T15:10:00",
    relatedActionId: "action-8",
  },
  {
    id: "notif-10",
    category: "ACTION_MADE_INTERNAL",
    title: "Arjun Reddy made an action internal only",
    description: "Billing discrepancy – City Hospital account",
    isRead: false,
    timestamp: "2026-05-30T10:00:00",
    relatedActionId: "action-9",
  },
];

export const MOCK_ACTIONS: ActionItem[] = [
  {
    id: "action-1",
    category: "NOT_PERFORMED",
    exceptionLabel: "QC Fail",
    title: "QC Fail exception raised at order level (117)",
    context: "Awaiting more details",
    visibleToAccount: true,
    owner: { initials: "CS", name: "Client Support", color: "#16a34a" },
    status: "OPEN",
    assignedToMe: true,
    reportedByMe: false,
    hasUpdates: true,
    updateCount: 2,
  },
  {
    id: "action-2",
    category: "UNRESOLVED",
    exceptionLabel: "In Question",
    title: "In Question exception raised at order level (118)",
    context: "Referred for re-analysis",
    visibleToAccount: false,
    owner: { initials: "CS", name: "Client Support", color: "#16a34a" },
    status: "OPEN",
    assignedToMe: true,
    reportedByMe: false,
    hasUpdates: false,
  },
  {
    id: "action-3",
    category: "PENDING_APPROVAL",
    exceptionLabel: "Pending approval",
    title: "Report approval pending – CBC batch (Order #331–340)",
    context: "Awaiting director sign-off",
    visibleToAccount: false,
    owner: { initials: "DL", name: "Dr. Leena Shah", color: "#7c3aed" },
    status: "OPEN",
    assignedToMe: false,
    reportedByMe: true,
    hasUpdates: false,
  },
  {
    id: "action-4",
    category: "RECOLLECTION",
    exceptionLabel: "Recollection",
    title: "HbA1c recollection required – Bill #4498",
    context: "Sample haemolysed during transit",
    visibleToAccount: true,
    owner: { initials: "RK", name: "Receptionist Kumar", color: "#d97706" },
    status: "OPEN",
    assignedToMe: false,
    reportedByMe: false,
    hasUpdates: false,
  },
  {
    id: "action-5",
    category: "OVERDUE",
    exceptionLabel: "Overdue",
    title: "Invoice #INV-0892 payment follow-up",
    context: "7 days overdue – Account: City Hospital",
    visibleToAccount: false,
    owner: { initials: "CS", name: "Client Support", color: "#16a34a" },
    status: "OPEN",
    assignedToMe: true,
    reportedByMe: false,
    hasUpdates: false,
  },
  {
    id: "action-6",
    category: "CRITICAL",
    exceptionLabel: "Critical",
    title: "Critical potassium result – Bill #4510",
    context: "K+ 6.8 mEq/L – Physician notified",
    visibleToAccount: false,
    owner: { initials: "DL", name: "Dr. Leena Shah", color: "#7c3aed" },
    status: "IN_PROGRESS",
    assignedToMe: false,
    reportedByMe: true,
    hasUpdates: true,
    updateCount: 1,
  },
  {
    id: "action-7",
    category: "NOT_PERFORMED",
    exceptionLabel: "Not performed",
    title: "Thyroid panel cancelled – Order #287",
    context: "Patient requested cancellation post-collection",
    visibleToAccount: true,
    owner: { initials: "RK", name: "Receptionist Kumar", color: "#d97706" },
    status: "OPEN",
    assignedToMe: false,
    reportedByMe: false,
    hasUpdates: false,
  },
];

export function getUnreadNotificationCount(notifications: NotificationItem[]): number {
  return notifications.filter((n) => !n.isRead).length;
}

export function getOpenActionCount(actions: ActionItem[]): number {
  return actions.filter((a) => a.status === "OPEN" || a.status === "IN_PROGRESS").length;
}

export function isOpenAction(action: ActionItem): boolean {
  return action.status === "OPEN" || action.status === "IN_PROGRESS";
}

export function getLatestNotifications(
  notifications: NotificationItem[],
  limit = 4,
): NotificationItem[] {
  return [...notifications]
    .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())
    .slice(0, limit);
}

export function getLatestOpenActions(actions: ActionItem[], limit = 4): ActionItem[] {
  return [...actions]
    .filter(isOpenAction)
    .sort((a, b) => {
      if (a.assignedToMe !== b.assignedToMe) return a.assignedToMe ? -1 : 1;
      if (a.status === "OPEN" && b.status !== "OPEN") return -1;
      if (b.status === "OPEN" && a.status !== "OPEN") return 1;
      return 0;
    })
    .slice(0, limit);
}

export function formatNotificationDayGroup(isoTimestamp: string): string {
  const ts = new Date(isoTimestamp);
  const now = new Date();
  const startOfToday = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const startOfTs = new Date(ts.getFullYear(), ts.getMonth(), ts.getDate());
  const diffDays = Math.round((startOfToday.getTime() - startOfTs.getTime()) / 86400000);
  if (diffDays === 0) return "Today";
  if (diffDays === 1) return "Yesterday";
  return ts.toLocaleDateString(undefined, { weekday: "short", month: "short", day: "numeric" });
}

export function groupNotificationsByDay(
  notifications: NotificationItem[],
): { label: string; items: NotificationItem[] }[] {
  const groups: { label: string; items: NotificationItem[] }[] = [];
  const map = new Map<string, NotificationItem[]>();
  const sorted = [...notifications].sort(
    (a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime(),
  );

  for (const item of sorted) {
    const label = formatNotificationDayGroup(item.timestamp);
    const bucket = map.get(label);
    if (bucket) bucket.push(item);
    else map.set(label, [item]);
  }

  for (const [label, items] of map) {
    groups.push({ label, items });
  }
  return groups;
}

export function formatNotificationTime(isoTimestamp: string): string {
  const now = new Date();
  const ts = new Date(isoTimestamp);
  const diffMs = now.getTime() - ts.getTime();
  const diffMins = Math.floor(diffMs / 60000);
  if (diffMins < 1) return "Just now";
  if (diffMins < 60) return `${diffMins}m`;
  const diffHours = Math.floor(diffMins / 60);
  if (diffHours < 24) return `${diffHours}h`;
  const diffDays = Math.floor(diffHours / 24);
  if (diffDays === 1) return "Yesterday";
  return `${diffDays}d`;
}

export function formatNotificationDateTime(isoTimestamp: string): string {
  const ts = new Date(isoTimestamp);
  return ts.toLocaleString(undefined, {
    day: "numeric",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

export const ACTION_CATEGORY_LABELS: Record<ActionCategory, string> = {
  NOT_PERFORMED: "NOT PERFORMED",
  UNRESOLVED: "UNRESOLVED",
  PENDING_APPROVAL: "PENDING APPROVAL",
  OVERDUE: "OVERDUE",
  RECOLLECTION: "RECOLLECTION",
  CRITICAL: "CRITICAL",
};

// —— Feedback system (feature-level modules grouped by category) ——

export interface FeedbackModule {
  id: string;
  name: string;
  categoryId: string;
}

export interface FeedbackModuleGroup {
  id: string;
  name: string;
  modules: FeedbackModule[];
}

function featureId(categoryId: string, featureName: string): string {
  const slug = featureName
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
  return `${categoryId}--${slug}`;
}

function group(
  id: string,
  name: string,
  featureNames: string[],
): FeedbackModuleGroup {
  return {
    id,
    name,
    modules: featureNames.map((featureName) => ({
      id: featureId(id, featureName),
      name: featureName,
      categoryId: id,
    })),
  };
}

/** Category labels are grouping only; each checkbox feature is a feedback item. */
export const FEEDBACK_MODULE_GROUPS: FeedbackModuleGroup[] = [
  group("ordering", "Ordering", [
    "Appointments",
    "Home collection",
    "B2B ordering",
    "Ordering via integration",
    "AOE (Ask at Order Entry)",
    "Consent",
    "Bulk ordering",
    "AI TRF ordering",
  ]),
  group("accession", "Accession", [
    "Sample Accession",
    "Sample vial count",
    "Remote barcode printing",
    "Department-wise accession",
    "Batch transfer (inter-location)",
  ]),
  group("sample-processing", "Sample Processing", [
    "Worklist processing",
    "Sample archival",
    "Molecular plating",
    "Anatomical stage tracking",
  ]),
  group("report-entry", "Report Entry", [
    "Biochemistry",
    "Microbiology",
    "Hematology",
    "Molecular",
    "Toxicology",
    "Radiology",
    "Rerun",
    "Reflex testing",
    "Outsourced reporting",
    "Integration reporting",
  ]),
  group("report-validation", "Report Validation", [
    "Manual validation",
    "Instrument-wise bulk validation",
    "Auto validation",
    "Critical call-out",
  ]),
  group("qc", "QC", [
    "Westgard rule warning / blocking",
    "QC value approval then plot",
    "QC Lot management",
  ]),
  group("report-delivery", "Report Delivery", [
    "Email delivery",
    "SMS delivery",
    "WhatsApp delivery",
    "Fax delivery",
    "Print & handover",
    "Patient portal delivery",
    "B2B portal delivery",
    "Integration delivery (push)",
  ]),
  group("billing", "Billing", [
    "Eligibility check",
    "Test frequency check",
    "Insurance price lists",
    "Billing integration",
  ]),
];

export const FEEDBACK_MODULES: FeedbackModule[] = FEEDBACK_MODULE_GROUPS.flatMap(
  (g) => g.modules,
);

export function feedbackCategoryName(categoryId: string): string {
  return FEEDBACK_MODULE_GROUPS.find((g) => g.id === categoryId)?.name ?? categoryId;
}

export const ALL_FEEDBACK_FEATURE_IDS: string[] = FEEDBACK_MODULES.map((m) => m.id);

/** Resolved ids for a lab (all features when not configured). */
export function getTrackedFeedbackFeatureIds(tracked?: string[] | null): string[] {
  if (!tracked || tracked.length === 0) {
    return [...ALL_FEEDBACK_FEATURE_IDS];
  }
  const allowed = new Set(ALL_FEEDBACK_FEATURE_IDS);
  return tracked.filter((id) => allowed.has(id));
}

export function getFeedbackGroupsForFeatures(trackedIds: string[]): FeedbackModuleGroup[] {
  const set = new Set(trackedIds);
  return FEEDBACK_MODULE_GROUPS.map((group) => ({
    ...group,
    modules: group.modules.filter((m) => set.has(m.id)),
  })).filter((group) => group.modules.length > 0);
}

export function feedbackModuleById(id: string): FeedbackModule | undefined {
  return FEEDBACK_MODULES.find((m) => m.id === id);
}

export interface ModuleFeedbackResponse {
  relevant: boolean;
  stars: number;
  presetComment: string | null;
  comment: string;
  /** UI: user clicked Save feedback for this capability */
  saved?: boolean;
}

export type FeedbackSatisfactionTone = "good" | "mixed" | "poor";

export interface FeedbackSatisfactionConfig {
  tone: FeedbackSatisfactionTone;
  label: string;
  presets: string[];
}

export function getSatisfactionConfig(stars: number): FeedbackSatisfactionConfig | null {
  if (stars < 1 || stars > 5) return null;
  if (stars <= 2) {
    return {
      tone: "poor",
      label: "Not looking good — please pick a preset or add notes.",
      presets: [
        "We have concerns — this does not match how we work today.",
        "We need more support or training before we can adopt this.",
        "Implementation feels incomplete or confusing for our team.",
      ],
    };
  }
  if (stars === 3) {
    return {
      tone: "mixed",
      label: "Mixed — optional notes help your account manager.",
      presets: [
        "Mostly works for us; we may need a few adjustments.",
        "Useful, but we need more clarity on day-to-day use.",
      ],
    };
  }
  return {
    tone: "good",
    label: stars === 5 ? "Looks good." : "Works well for us.",
    presets: [
      "The account manager has set this up for us — very helpful.",
      "We are happy with how this works for our lab.",
      "Clear and aligned with how we operate.",
    ],
  };
}

export function createRelevantModuleResponse(
  prev?: Partial<ModuleFeedbackResponse>,
): ModuleFeedbackResponse {
  return {
    relevant: true,
    stars: prev?.stars ?? 0,
    presetComment: prev?.presetComment ?? null,
    comment: prev?.comment ?? "",
    saved: false,
  };
}

export function createNotRelevantModuleResponse(): ModuleFeedbackResponse {
  return {
    relevant: false,
    stars: 0,
    presetComment: null,
    comment: "",
    saved: true,
  };
}

export type FeedbackStep = "nps" | "done";

export interface NpsFeedbackSubmission {
  score: number;
  presetComments: string[];
  comment: string;
}

export interface NpsCommentPillGroup {
  id: string;
  label: string;
  pills: string[];
}

export interface NpsCommentConfig {
  tone: FeedbackSatisfactionTone;
  heading: string;
  subheading: string;
  groups: NpsCommentPillGroup[];
}

export function getNpsCommentConfig(score: number): NpsCommentConfig | null {
  if (score < 0 || score > 10) return null;

  if (score <= 6) {
    return {
      tone: "poor",
      heading: "What held your score back?",
      subheading: "Pick what applies — this helps us route follow-up to the right team.",
      groups: [
        {
          id: "themes",
          label: "",
          pills: [
            "Support response is too slow or hard to reach",
            "Product gaps — slow reports, missing billing, or integration issues",
            "Implementation delays or account manager follow-up is lacking",
          ],
        },
      ],
    };
  }

  if (score <= 8) {
    return {
      tone: "mixed",
      heading: "What would make this a stronger recommendation?",
      subheading: "Select any themes that apply — product, support, or your account team.",
      groups: [
        {
          id: "themes",
          label: "",
          pills: [
            "Generally works but reporting or billing workflow needs improvement",
            "Support is helpful but slower at peak times or holidays",
            "Implementation was okay but a few gaps still remain",
          ],
        },
      ],
    };
  }

  return {
    tone: "good",
    heading: "What's working well for your lab?",
    subheading: "Tell us what you'd highlight to another diagnostic lab.",
    groups: [
      {
        id: "themes",
        label: "",
        pills: [
          "Easy-to-use LIS — integrations and daily workflows work well",
          "Support team is responsive and resolves issues quickly",
          "Smooth onboarding and a proactive account manager",
        ],
      },
    ],
  };
}

export function allNpsCommentPills(config: NpsCommentConfig): string[] {
  return config.groups.flatMap((group) => group.pills);
}

export interface FeedbackState {
  npsScore: number | null;
  npsPresetComments: string[];
  npsComment: string;
  submittedAt: string | null;
  step: FeedbackStep;
}

export const INITIAL_FEEDBACK_STATE: FeedbackState = {
  npsScore: null,
  npsPresetComments: [],
  npsComment: "",
  submittedAt: null,
  step: "nps",
};

export function shouldShowFeedbackReminder(submittedAt: string | null): boolean {
  if (!submittedAt) return true;
  const sixMonthsAgo = new Date();
  sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6);
  return new Date(submittedAt) < sixMonthsAgo;
}

export function formatFeedbackDate(iso: string): string {
  const d = new Date(iso);
  const months = [
    "Jan", "Feb", "Mar", "Apr", "May", "Jun",
    "Jul", "Aug", "Sep", "Oct", "Nov", "Dec",
  ];
  const day = d.getDate();
  const suffix =
    day % 10 === 1 && day !== 11
      ? "st"
      : day % 10 === 2 && day !== 12
        ? "nd"
        : day % 10 === 3 && day !== 13
          ? "rd"
          : "th";
  return `${day}${suffix} ${months[d.getMonth()]}, ${d.getFullYear()}`;
}
