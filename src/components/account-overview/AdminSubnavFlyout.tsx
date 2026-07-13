import { useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import type { AdminSubNavItem } from "../../data/accountOverview";
import { getModuleDefaultPath, isLabModuleId } from "../../data/labModules";
import { AdminSubNavIcon } from "./AdminSubNavIcon";

export type SubnavFlyoutMode = "admin" | "home";

interface Props {
  open: boolean;
  top: number;
  labId: number;
  mode: SubnavFlyoutMode;
  items: AdminSubNavItem[];
  onClose: () => void;
}

function flyoutTarget(labId: number, itemId: string): string {
  if (itemId === "admin") {
    return getModuleDefaultPath(labId, "admin");
  }
  if (isLabModuleId(itemId)) {
    return getModuleDefaultPath(labId, itemId);
  }
  return getModuleDefaultPath(labId, "admin");
}

export function AdminSubnavFlyout({ open, top, labId, mode, items, onClose }: Props) {
  const panelRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();

  useEffect(() => {
    if (!open) return;
    function onPointerDown(e: MouseEvent) {
      const target = e.target as Node;
      if (panelRef.current?.contains(target)) return;
      if (document.querySelector("[data-subnav-flyout-trigger]")?.contains(target)) return;
      if (document.querySelector("[data-module-switcher-trigger]")?.contains(target)) return;
      if (document.querySelector("[data-profile-menu-trigger]")?.contains(target)) return;
      if (document.querySelector(".ao-profile-menu")?.contains(target)) return;
      if (document.querySelector("[data-notifications-flyout-trigger]")?.contains(target)) return;
      if (document.querySelector(".ao-na-flyout")?.contains(target)) return;
      onClose();
    }
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") onClose();
    }
    document.addEventListener("mousedown", onPointerDown);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("mousedown", onPointerDown);
      document.removeEventListener("keydown", onKey);
    };
  }, [open, onClose]);

  if (!open) return null;

  const menuLabel = mode === "home" ? "Module switcher" : "Admin submenu";

  return (
    <div
      ref={panelRef}
      className="ao-admin-flyout"
      style={{ top: `${top}px` }}
      role="menu"
      aria-label={menuLabel}
    >
      {items.map((item, index) => (
        <button
          key={item.id}
          type="button"
          role="menuitem"
          className={`ao-admin-flyout__item${
            index < items.length - 1 ? " ao-admin-flyout__item--bordered" : ""
          }`}
          onClick={() => {
            onClose();
            navigate(flyoutTarget(labId, item.id));
          }}
        >
          <AdminSubNavIcon id={item.icon} />
          <span>{item.label}</span>
        </button>
      ))}
    </div>
  );
}
