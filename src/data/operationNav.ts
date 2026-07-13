export type OperationNavIconId =
  | "operation"
  | "dashboard"
  | "waiting-list"
  | "callout"
  | "device"
  | "pcr"
  | "archive"
  | "status"
  | "print"
  | "search";

export interface OperationNavLeaf {
  id: string;
  label: string;
  path?: string;
  count?: number;
}

export interface OperationNavChild {
  id: string;
  label: string;
  path?: string;
  badge?: string;
  children?: OperationNavLeaf[];
}

export interface OperationNavItem {
  id: string;
  label: string;
  icon: OperationNavIconId;
  children?: OperationNavChild[];
}

export const WAITING_LIST_SUB_NAV: OperationNavLeaf[] = [
  { id: "all-services", label: "All Services", path: "", count: 11 },
  { id: "incomplete", label: "Incomplete", path: "/incomplete", count: 11 },
  { id: "partial", label: "Partially Completed", path: "/partially-completed", count: 0 },
  { id: "reruns", label: "Active Reruns", path: "/active-reruns", count: 0 },
  { id: "completed", label: "Completed", path: "/completed", count: 0 },
  { id: "validated", label: "Validated", path: "/validated", count: 0 },
  { id: "rejected", label: "Rejected", path: "/rejected", count: 0 },
  { id: "on-hold", label: "On Hold", path: "/on-hold", count: 0 },
];

export const OPERATION_NAV: OperationNavItem[] = [
  {
    id: "operation",
    label: "Operation",
    icon: "operation",
    children: [
      { id: "dashboard", label: "Operations Dashboard", path: "/dashboard" },
      {
        id: "waiting-list",
        label: "Waiting List",
        path: "/waiting-list",
        children: WAITING_LIST_SUB_NAV,
      },
      { id: "critical-callout", label: "Critical Callout Worklist", path: "/critical-callout" },
      { id: "device-validation", label: "Device Results Validation", path: "/device-validation", badge: "Beta" },
      { id: "rt-pcr", label: "RT-PCR Plating", path: "/rt-pcr-plating" },
      { id: "archives", label: "Archives", path: "/archives" },
      { id: "service-status", label: "Operation / Service Status", path: "/service-status" },
      { id: "report-prints", label: "Report Prints", path: "/report-prints" },
    ],
  },
];
