import type { AdminSubNavIconId } from "./accountOverview";
import { OPERATION_NAV } from "./operationNav";
import { REGISTRATION_NAV } from "./registrationNav";
import {
  ACCESSION_NAV,
  ANALYTICS_NAV,
  CRM_NAV,
  FINANCE_NAV,
  INVENTORY_NAV,
  REVIEWER_NAV,
} from "./otherModuleNav";

export type LabModuleId =
  | "registration"
  | "operation"
  | "accession"
  | "finance"
  | "reviewer"
  | "inventory"
  | "crm"
  | "analytics";

export const LAB_MODULE_IDS: LabModuleId[] = [
  "registration",
  "operation",
  "accession",
  "finance",
  "reviewer",
  "inventory",
  "crm",
  "analytics",
];

const LAB_MODULE_ID_SET = new Set<string>(LAB_MODULE_IDS);

export function isLabModuleId(value: string | undefined): value is LabModuleId {
  return value !== undefined && LAB_MODULE_ID_SET.has(value);
}

export interface ModuleNavLeaf {
  id: string;
  label: string;
  path: string;
  count?: number;
  badge?: string;
  external?: boolean;
}

export interface ModuleNavChild {
  id: string;
  label: string;
  path?: string;
  badge?: string;
  external?: boolean;
  children?: ModuleNavLeaf[];
}

export interface ModuleNavGroup {
  id: string;
  label: string;
  icon: AdminSubNavIconId;
  children?: ModuleNavChild[];
}

export interface RegistrationFlatNavItem {
  id: string;
  label: string;
  path: string;
  icon: AdminSubNavIconId;
  external?: boolean;
}

export interface ModuleDefinition {
  id: LabModuleId;
  label: string;
  icon: AdminSubNavIconId;
}

export const LAB_MODULES: Record<LabModuleId, ModuleDefinition> = {
  registration: { id: "registration", label: "Registration", icon: "registration" },
  operation: { id: "operation", label: "Operation", icon: "operation" },
  accession: { id: "accession", label: "Accession", icon: "accession" },
  finance: { id: "finance", label: "Finance", icon: "finance" },
  reviewer: { id: "reviewer", label: "Reviewer", icon: "reviewer" },
  inventory: { id: "inventory", label: "Inventory", icon: "inventory" },
  crm: { id: "crm", label: "CRM", icon: "crm" },
  analytics: { id: "analytics", label: "Analytics", icon: "analytics" },
};

export function getModuleNavGroups(moduleId: LabModuleId): ModuleNavGroup[] {
  switch (moduleId) {
    case "registration":
      return REGISTRATION_NAV.filter((item) => item.children).map((item) => ({
        id: item.id,
        label: item.label,
        icon: "registration",
        children: item.children!.map((child) => ({
          id: child.id,
          label: child.label,
          path: child.path ?? (child.id === "ordering" ? "" : `/${child.id}`),
          external: child.external,
        })),
      }));
    case "operation":
      return OPERATION_NAV.map((item) => ({
        ...item,
        icon: "operation" as AdminSubNavIconId,
        children: item.children?.map((child) => ({
          ...child,
          children: child.children?.map((leaf) => ({
            ...leaf,
            path: leaf.path ?? `/${leaf.id}`,
          })),
        })),
      }));
    case "accession":
      return ACCESSION_NAV;
    case "finance":
      return FINANCE_NAV;
    case "reviewer":
      return REVIEWER_NAV;
    case "inventory":
      return INVENTORY_NAV;
    case "crm":
      return CRM_NAV;
    case "analytics":
      return ANALYTICS_NAV;
    default:
      return [];
  }
}

export function getRegistrationFlatNav(): RegistrationFlatNavItem[] {
  return REGISTRATION_NAV.filter((item) => !item.children).map((item) => ({
    id: item.id,
    label: item.label,
    path: `/${item.id}`,
    icon: "registration",
    external: item.external,
  }));
}

export function getModuleBasePath(labId: number, moduleId: LabModuleId): string {
  return `/lab/${labId}/${moduleId}`;
}

/** Default landing route when switching into a module from the module switcher */
export function getModuleDefaultPath(labId: number, target: "admin" | LabModuleId): string {
  if (target === "admin") {
    return `/lab/${labId}/center`;
  }
  return getModuleBasePath(labId, target);
}

export function getModuleIdFromPath(pathname: string, labId: number): LabModuleId | null {
  for (const moduleId of LAB_MODULE_IDS) {
    const base = getModuleBasePath(labId, moduleId);
    if (pathname === base || pathname.startsWith(`${base}/`)) return moduleId;
  }
  return null;
}

export function getModuleSectionPath(pathname: string, labId: number, moduleId: LabModuleId): string {
  const moduleForPath = getModuleIdFromPath(pathname, labId);
  if (moduleForPath !== moduleId) {
    return "__invalid__";
  }
  const base = getModuleBasePath(labId, moduleId);
  if (pathname === base || pathname === `${base}/`) return "";
  return pathname.slice(base.length + 1).replace(/\/$/, "");
}

function leafPath(child: ModuleNavChild | ModuleNavLeaf): string {
  if ("path" in child && child.path !== undefined) {
    return child.path === "" ? "" : child.path.replace(/^\//, "");
  }
  return child.id;
}

export function resolveModuleSectionTitle(moduleId: LabModuleId, sectionPath: string): string {
  const normalized = sectionPath.replace(/^\//, "");

  if (moduleId === "registration") {
    for (const item of REGISTRATION_NAV) {
      if (item.children) {
        for (const child of item.children) {
          const path = child.path ?? (child.id === "ordering" ? "" : child.id);
          if (path.replace(/^\//, "") === normalized) return child.label;
        }
      } else if (item.id === normalized) {
        return item.label;
      }
    }
    if (!normalized) return "Registration / Ordering";
  }

  for (const group of getModuleNavGroups(moduleId)) {
    for (const child of group.children ?? []) {
      if (leafPath(child) === normalized) return child.label;
      for (const leaf of child.children ?? []) {
        if (leafPath(leaf) === normalized) return leaf.label;
      }
    }
  }

  if (!normalized) {
    if (moduleId === "operation") return "All Services";
    return LAB_MODULES[moduleId].label;
  }

  return normalized
    .split("/")
    .map((part) => part.replace(/-/g, " ").replace(/\b\w/g, (c) => c.toUpperCase()))
    .join(" / ");
}

export function isModuleSectionActive(
  pathname: string,
  labId: number,
  moduleId: LabModuleId,
  sectionPath: string,
): boolean {
  const base = getModuleBasePath(labId, moduleId);
  const normalized = sectionPath.replace(/^\//, "");
  if (!normalized) {
    return pathname === base || pathname === `${base}/`;
  }
  return pathname === `${base}/${normalized}` || pathname === `${base}/${normalized}/`;
}

export function sectionHref(labId: number, moduleId: LabModuleId, sectionPath: string): string {
  const base = getModuleBasePath(labId, moduleId);
  const normalized = sectionPath.replace(/^\//, "");
  return normalized ? `${base}/${normalized}` : base;
}

export interface ModuleFlyoutLink {
  id: string;
  label: string;
  href: string;
  external?: boolean;
}

function navPathToSection(path: string | undefined, id: string): string {
  if (path === "") return "";
  if (path) return path.replace(/^\//, "");
  return id;
}

/** Flat section links for the active module's flyout submenu */
export function getModuleFlyoutLinks(labId: number, moduleId: LabModuleId): ModuleFlyoutLink[] {
  const links: ModuleFlyoutLink[] = [];

  if (moduleId === "registration") {
    for (const item of REGISTRATION_NAV) {
      if (item.children) {
        for (const child of item.children) {
          const section =
            child.path === ""
              ? ""
              : child.path
                ? child.path.replace(/^\//, "")
                : child.id === "ordering"
                  ? ""
                  : child.id;
          links.push({
            id: child.id,
            label: child.label,
            href: sectionHref(labId, moduleId, section),
            external: child.external,
          });
        }
      } else {
        links.push({
          id: item.id,
          label: item.label,
          href: sectionHref(labId, moduleId, item.id),
          external: item.external,
        });
      }
    }
    return links;
  }

  for (const group of getModuleNavGroups(moduleId)) {
    for (const child of group.children ?? []) {
      if (child.children) {
        for (const leaf of child.children) {
          links.push({
            id: leaf.id,
            label: leaf.label,
            href: sectionHref(labId, moduleId, navPathToSection(leaf.path, leaf.id)),
            external: leaf.external,
          });
        }
      } else {
        links.push({
          id: child.id,
          label: child.label,
          href: sectionHref(labId, moduleId, navPathToSection(child.path, child.id)),
          external: child.external,
        });
      }
    }
  }

  return links;
}
