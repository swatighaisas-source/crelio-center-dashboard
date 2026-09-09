import { Link, useLocation } from "react-router-dom";
import { useEffect, useMemo, useState } from "react";
import {
  getModuleNavGroups,
  getRegistrationFlatNav,
  isModuleSectionActive,
  sectionHref,
  type LabModuleId,
  type ModuleNavChild,
  type ModuleNavLeaf,
} from "../../data/labModules";
import { REGISTRATION_NAV } from "../../data/registrationNav";
import { RegistrationNavIcon } from "../registration/RegistrationNavIcon";
import { OperationNavIcon } from "../operation/OperationNavIcon";
import { AdminSubNavIcon } from "../account-overview/AdminSubNavIcon";
import { ModuleSidebarShell } from "./ModuleSidebarShell";
interface Props {
  labId: number;
  moduleId: LabModuleId;
  className?: string;
}

function Chevron({ up }: { up?: boolean }) {
  return (
    <span
      className={`ao-nav-item__chevron ao-nav-item__chevron--down${up ? " ao-nav-item__chevron--up" : ""}`}
      aria-hidden
    >
      <svg viewBox="0 0 12 8" width="10" height="7" fill="none">
        <path
          d="M1.5 1.5L6 6l4.5-4.5"
          stroke="currentColor"
          strokeWidth="1.3"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    </span>
  );
}

function ExternalIcon() {
  return (
    <span className="ao-nav-subitem__external" aria-label="Opens in new window">
      <svg viewBox="0 0 12 12" width="11" height="11" aria-hidden>
        <path
          d="M4 2h6v6M10 2L5 7M6 2H2v8h8V6"
          stroke="currentColor"
          strokeWidth="1.1"
          fill="none"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    </span>
  );
}

function leafSectionPath(leaf: ModuleNavLeaf): string {
  if (leaf.path === "") return "";
  return leaf.path.replace(/^\//, "");
}

function childSectionPath(child: ModuleNavChild): string {
  if (child.path === "") return "";
  if (child.path) return child.path.replace(/^\//, "");
  return child.id;
}

function isLeafActive(
  pathname: string,
  labId: number,
  moduleId: LabModuleId,
  leaf: ModuleNavLeaf,
): boolean {
  return isModuleSectionActive(pathname, labId, moduleId, leafSectionPath(leaf));
}

function isChildActive(
  pathname: string,
  labId: number,
  moduleId: LabModuleId,
  child: ModuleNavChild,
): boolean {
  if (child.children) {
    return child.children.some((leaf) => isLeafActive(pathname, labId, moduleId, leaf));
  }
  return isModuleSectionActive(pathname, labId, moduleId, childSectionPath(child));
}

function NavCount({ count }: { count?: number }) {
  if (count === undefined) return null;
  return <span className="op-nav-subitem__count">{count}</span>;
}

function NestedLeaves({
  leaves,
  labId,
  moduleId,
  pathname,
}: {
  leaves: ModuleNavLeaf[];
  labId: number;
  moduleId: LabModuleId;
  pathname: string;
}) {
  return (
    <div className="ao-nav-group__sub ao-nav-group__sub--nested" role="group">
      {leaves.map((leaf) => {
        const section = leafSectionPath(leaf);
        const href = sectionHref(labId, moduleId, section);
        const isActive = isLeafActive(pathname, labId, moduleId, leaf);

        if (leaf.external) {
          return (
            <button key={leaf.id} type="button" className="ao-nav-subitem ao-nav-subitem--nested">
              <span className="ao-nav-subitem__label">{leaf.label}</span>
              <ExternalIcon />
            </button>
          );
        }

        return (
          <Link
            key={leaf.id}
            to={href}
            className={`ao-nav-subitem ao-nav-subitem--nested${isActive ? " ao-nav-subitem--active" : ""}`}
            aria-current={isActive ? "page" : undefined}
          >
            <span className="ao-nav-subitem__label">{leaf.label}</span>
            <NavCount count={leaf.count} />
          </Link>
        );
      })}
    </div>
  );
}

function ModuleNavChildItem({
  child,
  labId,
  moduleId,
  pathname,
  expanded,
  onToggle,
}: {
  child: ModuleNavChild;
  labId: number;
  moduleId: LabModuleId;
  pathname: string;
  expanded: boolean;
  onToggle: () => void;
}) {
  if (child.children) {
    const active = isChildActive(pathname, labId, moduleId, child);
    const groupActive = expanded || active;

    return (
      <div className="op-nav-nested-group">
        <button
          type="button"
          className={`ao-nav-subitem ao-nav-subitem--group${groupActive ? " ao-nav-subitem--active" : ""}`}
          onClick={onToggle}
          aria-expanded={expanded}
        >
          <span className="ao-nav-subitem__label">{child.label}</span>
          <Chevron up={expanded} />
        </button>
        {expanded && (
          <NestedLeaves
            leaves={child.children}
            labId={labId}
            moduleId={moduleId}
            pathname={pathname}
          />
        )}
      </div>
    );
  }

  const section = childSectionPath(child);
  const href = sectionHref(labId, moduleId, section);
  const isActive = isModuleSectionActive(pathname, labId, moduleId, section);

  if (child.external) {
    return (
      <button type="button" className="ao-nav-subitem">
        <span className="ao-nav-subitem__label">{child.label}</span>
        <ExternalIcon />
      </button>
    );
  }

  return (
    <Link
      to={href}
      className={`ao-nav-subitem${isActive ? " ao-nav-subitem--active" : ""}`}
      aria-current={isActive ? "page" : undefined}
    >
      <span className="ao-nav-subitem__label">{child.label}</span>
      {child.badge && <span className="op-nav-subitem__badge">{child.badge}</span>}
    </Link>
  );
}

function RegistrationNavSection({
  labId,
  pathname,
}: {
  labId: number;
  pathname: string;
}) {
  const moduleId = "registration" as const;
  const [expandedGroups, setExpandedGroups] = useState<Set<string>>(() => new Set(["registration"]));

  useEffect(() => {
    const ids = new Set<string>();
    for (const item of REGISTRATION_NAV) {
      if (item.children) {
        const childActive = item.children.some((child) => {
          const section =
            child.path === ""
              ? ""
              : child.path
                ? child.path.replace(/^\//, "")
                : child.id;
          return isModuleSectionActive(pathname, labId, moduleId, section);
        });
        if (childActive) ids.add(item.id);
      } else if (isModuleSectionActive(pathname, labId, moduleId, item.id)) {
        ids.add(item.id);
      }
    }
    if (ids.size > 0) setExpandedGroups(ids);
  }, [pathname, labId]);

  return (
    <>
      {REGISTRATION_NAV.map((item) => {
        if (item.children) {
          const expanded = expandedGroups.has(item.id);
          const hubChild = item.children.find((c) => c.path === "");
          const triggerLabel =
            item.id === "registration" && hubChild ? hubChild.label : item.label;
          const groupActive =
            expanded ||
            item.children.some((child) => {
              const section =
                child.path === ""
                  ? ""
                  : child.path
                    ? child.path.replace(/^\//, "")
                    : child.id;
              return isModuleSectionActive(pathname, labId, moduleId, section);
            });

          return (
            <div key={item.id} className="ao-nav-group ao-nav-group--inline">
              <button
                type="button"
                className={`ao-nav-item ao-nav-group__trigger${groupActive ? " ao-nav-item--active" : ""}`}
                onClick={() =>
                  setExpandedGroups((prev) => {
                    const next = new Set(prev);
                    if (next.has(item.id)) next.delete(item.id);
                    else next.add(item.id);
                    return next;
                  })
                }
                aria-expanded={expanded}
              >
                <RegistrationNavIcon id={item.icon} active={groupActive} />
                <span className="ao-nav-item__label">{triggerLabel}</span>
                <Chevron up={expanded} />
              </button>
              {expanded && (
                <div className="ao-nav-group__sub" role="group">
                  {item.children.map((child) => {
                    if (child.path === "") return null;
                    const section = child.path
                      ? child.path.replace(/^\//, "")
                      : child.id;
                    const href = sectionHref(labId, moduleId, section);
                    const isActive = isModuleSectionActive(pathname, labId, moduleId, section);

                    if (child.external) {
                      return (
                        <button key={child.id} type="button" className="ao-nav-subitem">
                          <span className="ao-nav-subitem__label">{child.label}</span>
                          <ExternalIcon />
                        </button>
                      );
                    }

                    return (
                      <Link
                        key={child.id}
                        to={href}
                        className={`ao-nav-subitem${isActive ? " ao-nav-subitem--active" : ""}`}
                        aria-current={isActive ? "page" : undefined}
                      >
                        <span className="ao-nav-subitem__label">{child.label}</span>
                      </Link>
                    );
                  })}
                </div>
              )}
            </div>
          );
        }

        const href = sectionHref(labId, moduleId, item.id);
        const isActive = isModuleSectionActive(pathname, labId, moduleId, item.id);

        if (item.external) {
          return (
            <button key={item.id} type="button" className="ao-nav-item">
              <RegistrationNavIcon id={item.icon} />
              <span className="ao-nav-item__label">{item.label}</span>
              <ExternalIcon />
            </button>
          );
        }

        return (
          <Link
            key={item.id}
            to={href}
            className={`ao-nav-item${isActive ? " ao-nav-item--active" : ""}`}
            aria-current={isActive ? "page" : undefined}
          >
            <RegistrationNavIcon id={item.icon} active={isActive} />
            <span className="ao-nav-item__label">{item.label}</span>
          </Link>
        );
      })}
    </>
  );
}

function ModuleInlineNav({
  labId,
  moduleId,
  pathname,
}: {
  labId: number;
  moduleId: LabModuleId;
  pathname: string;
}) {
  const groups = useMemo(() => getModuleNavGroups(moduleId), [moduleId]);
  const flatRegistrationNav = useMemo(
    () => (moduleId === "registration" ? getRegistrationFlatNav() : []),
    [moduleId],
  );

  const inlineChildren = useMemo(() => {
    if (moduleId === "registration") return null;
    if (groups.length === 1 && groups[0].id === moduleId) {
      return groups[0].children ?? [];
    }
    return null;
  }, [groups, moduleId]);

  const activeNestedIds = useMemo(() => {
    const ids = new Set<string>();
    const children = inlineChildren ?? [];
    for (const child of children) {
      if (child.children && isChildActive(pathname, labId, moduleId, child)) {
        ids.add(child.id);
      }
    }
    if (!inlineChildren) {
      for (const group of groups) {
        for (const child of group.children ?? []) {
          if (child.children && isChildActive(pathname, labId, moduleId, child)) {
            ids.add(child.id);
          }
        }
      }
    }
    return ids;
  }, [inlineChildren, groups, pathname, labId, moduleId]);

  const activeGroupIds = useMemo(() => {
    const ids = new Set<string>();
    if (!inlineChildren) {
      for (const group of groups) {
        const childActive = group.children?.some((child) =>
          isChildActive(pathname, labId, moduleId, child),
        );
        if (childActive) ids.add(group.id);
      }
    }
    if (moduleId === "registration") {
      const flatActive = flatRegistrationNav.some((item) =>
        isModuleSectionActive(pathname, labId, moduleId, item.path.replace(/^\//, "")),
      );
      if (flatActive) ids.add("registration");
    }
    return ids;
  }, [groups, pathname, labId, moduleId, flatRegistrationNav, inlineChildren]);

  const [expandedGroups, setExpandedGroups] = useState<Set<string>>(() => new Set(activeGroupIds));
  const [expandedNested, setExpandedNested] = useState<Set<string>>(() => new Set(activeNestedIds));

  const activeNestedKey = useMemo(
    () => Array.from(activeNestedIds).sort().join(","),
    [activeNestedIds],
  );
  const activeGroupKey = useMemo(
    () => Array.from(activeGroupIds).sort().join(","),
    [activeGroupIds],
  );

  useEffect(() => {
    setExpandedGroups(new Set(activeGroupKey ? activeGroupKey.split(",") : []));
  }, [moduleId, pathname, activeGroupKey]);

  useEffect(() => {
    setExpandedNested(new Set(activeNestedKey ? activeNestedKey.split(",") : []));
  }, [moduleId, pathname, activeNestedKey]);

  if (moduleId === "registration") {
    return <RegistrationNavSection labId={labId} pathname={pathname} />;
  }

  const renderChild = (child: ModuleNavChild) => (
    <ModuleNavChildItem
      key={child.id}
      child={child}
      labId={labId}
      moduleId={moduleId}
      pathname={pathname}
      expanded={expandedNested.has(child.id)}
      onToggle={() =>
        setExpandedNested((prev) => {
          const next = new Set(prev);
          if (next.has(child.id)) next.delete(child.id);
          else next.add(child.id);
          return next;
        })
      }
    />
  );

  if (inlineChildren) {
    return (
      <div className="ao-sidebar__module-pages" role="group" aria-label={`${moduleId} pages`}>
        {inlineChildren.map((child) => {
          if (child.children) {
            const expanded = expandedNested.has(child.id);
            const active = isChildActive(pathname, labId, moduleId, child);
            const groupActive = expanded || active;
            return (
              <div key={child.id} className="ao-nav-group ao-nav-group--inline">
                <button
                  type="button"
                  className={`ao-nav-item ao-nav-group__trigger${groupActive ? " ao-nav-item--active" : ""}`}
                  onClick={() =>
                    setExpandedNested((prev) => {
                      const next = new Set(prev);
                      if (next.has(child.id)) next.delete(child.id);
                      else next.add(child.id);
                      return next;
                    })
                  }
                  aria-expanded={expanded}
                >
                  {moduleId === "operation" ? (
                    <OperationNavIcon id="waiting-list" active={groupActive} />
                  ) : (
                    <AdminSubNavIcon id={moduleId} />
                  )}
                  <span className="ao-nav-item__label">{child.label}</span>
                  <Chevron up={expanded} />
                </button>
                {expanded && child.children && (
                  <div className="ao-nav-group__sub" role="group">
                    {child.children.map((leaf) => {
                      const section = leafSectionPath(leaf);
                      const href = sectionHref(labId, moduleId, section);
                      const isActive = isLeafActive(pathname, labId, moduleId, leaf);
                      return (
                        <Link
                          key={leaf.id}
                          to={href}
                          className={`ao-nav-subitem${isActive ? " ao-nav-subitem--active" : ""}`}
                          aria-current={isActive ? "page" : undefined}
                        >
                          <span className="ao-nav-subitem__label">{leaf.label}</span>
                          <NavCount count={leaf.count} />
                        </Link>
                      );
                    })}
                  </div>
                )}
              </div>
            );
          }
          const section = childSectionPath(child);
          const href = sectionHref(labId, moduleId, section);
          const isActive = isModuleSectionActive(pathname, labId, moduleId, section);
          return (
            <Link
              key={child.id}
              to={href}
              className={`ao-nav-item${isActive ? " ao-nav-item--active" : ""}`}
              aria-current={isActive ? "page" : undefined}
            >
              <AdminSubNavIcon id={moduleId} />
              <span className="ao-nav-item__label">{child.label}</span>
              {child.badge && <span className="op-nav-subitem__badge">{child.badge}</span>}
            </Link>
          );
        })}
      </div>
    );
  }

  return (
    <div className="ao-sidebar__module-pages">
      {groups.map((group) => {
        const expanded = expandedGroups.has(group.id);
        const childActive = group.children?.some((child) =>
          isChildActive(pathname, labId, moduleId, child),
        );
        const groupActive = expanded || Boolean(childActive);

        return (
          <div key={group.id} className="ao-nav-group ao-nav-group--inline">
            <button
              type="button"
              className={`ao-nav-item ao-nav-group__trigger${groupActive ? " ao-nav-item--active" : ""}`}
              onClick={() =>
                setExpandedGroups((prev) => {
                  const next = new Set(prev);
                  if (next.has(group.id)) next.delete(group.id);
                  else next.add(group.id);
                  return next;
                })
              }
              aria-expanded={expanded}
            >
              <AdminSubNavIcon id={moduleId} />
              <span className="ao-nav-item__label">{group.label}</span>
              <Chevron up={expanded} />
            </button>
            {expanded && group.children && (
              <div className="ao-nav-group__sub" role="group">
                {group.children.map((child) => renderChild(child))}
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}

export function ModuleNavSidebar({ labId, moduleId, className = "" }: Props) {
  const location = useLocation();
  const pathname = location.pathname;

  return (
    <ModuleSidebarShell labId={labId} activeModuleId={moduleId} className={className}>
      <ModuleInlineNav labId={labId} moduleId={moduleId} pathname={pathname} />
    </ModuleSidebarShell>
  );
}
