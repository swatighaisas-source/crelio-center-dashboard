import { SearchIcon } from "../Icons";
import { ModuleSwitcherNav } from "./ModuleSwitcherNav";
import { useSidebarCollapse } from "./LabDashboardLayout";
import type { LabModuleId } from "../../data/labModules";

interface Props {
  labId: number;
  activeModuleId: LabModuleId;
  className?: string;
  children: React.ReactNode;
}

export function ModuleSidebarShell({
  labId,
  activeModuleId,
  className = "",
  children,
}: Props) {
  const { collapsed, toggleCollapsed } = useSidebarCollapse();
  const moduleLabel = activeModuleId.charAt(0).toUpperCase() + activeModuleId.slice(1);

  return (
    <aside className={`ao-sidebar module-sidebar ${className}${collapsed ? " ao-sidebar--collapsed" : ""}`}>
      <div className="ao-sidebar__search">
        <span className="ao-sidebar__search-icon">
          <SearchIcon />
        </span>
        <input type="text" placeholder="Navigation Search" aria-label="Navigation search" />
        <kbd className="ao-sidebar__kbd">
          <span>⌘</span> K
        </kbd>
      </div>

      <nav className="ao-sidebar__nav" aria-label={`${moduleLabel} navigation`}>
        <ModuleSwitcherNav labId={labId} activeModuleId={activeModuleId} />
        {children}
      </nav>

      <div className="ao-sidebar__footer">
        <button
          type="button"
          className="ao-sidebar__collapse"
          aria-label={collapsed ? "Expand sidebar" : "Collapse sidebar"}
          onClick={toggleCollapsed}
        >
          <span className="ao-sidebar__collapse-icon" aria-hidden>
            <svg viewBox="0 0 16 16" width="14" height="14" fill="none">
              <path
                d={collapsed ? "M6 3l5 5-5 5" : "M10 3L5 8l5 5"}
                stroke="currentColor"
                strokeWidth="1.4"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </span>
          <span className="ao-sidebar__footer-label">{collapsed ? "Expand" : "Collapse"}</span>
        </button>
      </div>
    </aside>
  );
}
