import { Link, useLocation } from "react-router-dom";
import { NAV_GROUP_ROOT_SECTION_IDS, type NavItem } from "../../data/accountOverview";
import { AccountNavIcon } from "./AccountNavIcon";

interface Props {
  item: NavItem & { children: NonNullable<NavItem["children"]> };
  labId: number;
  expanded: boolean;
  onToggle: () => void;
}

function isChildActive(pathname: string, labId: number, childId: string): boolean {
  const base = `/lab/${labId}/center/${childId}`;
  // Some children (e.g. parameter-setup) mount a nested tool with its own
  // sub-routes, so match the whole subtree, not just the exact base path.
  return pathname === base || pathname.startsWith(`${base}/`);
}

export function NavExpandableGroup({ item, labId, expanded, onToggle }: Props) {
  const location = useLocation();
  const rootSectionId = NAV_GROUP_ROOT_SECTION_IDS[item.id];
  const rootPath = rootSectionId ? `/lab/${labId}/center/${rootSectionId}` : undefined;

  const childActive = item.children.some((child) =>
    isChildActive(location.pathname, labId, child.id),
  );
  const rootActive = rootPath !== undefined && location.pathname === rootPath;
  const groupActive = expanded || childActive || rootActive;

  return (
    <div className="ao-nav-group">
      <button
        type="button"
        className={`ao-nav-item ao-nav-group__trigger${groupActive ? " ao-nav-item--active" : ""}`}
        onClick={onToggle}
        aria-expanded={expanded}
      >
        <AccountNavIcon id={item.icon} active={groupActive} />
        <span className="ao-nav-item__label">{item.label}</span>
        <span
          className={`ao-nav-item__chevron ao-nav-item__chevron--down${
            expanded ? " ao-nav-item__chevron--up" : ""
          }`}
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
      </button>
      {expanded && (
        <div className="ao-nav-group__sub" role="group" aria-label={item.label}>
          {item.children.map((child) => {
            const href = `/lab/${labId}/center/${child.id}`;
            const isActive = isChildActive(location.pathname, labId, child.id);
            return (
              <Link
                key={child.id}
                to={href}
                className={`ao-nav-subitem${isActive ? " ao-nav-subitem--active" : ""}`}
                aria-current={isActive ? "page" : undefined}
              >
                <span className="ao-nav-subitem__label">{child.label}</span>
                {child.external && (
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
                )}
              </Link>
            );
          })}
        </div>
      )}
    </div>
  );
}
