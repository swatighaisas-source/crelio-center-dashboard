import { useCallback, useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import { HOME_SUB_NAV } from "../../data/accountOverview";
import { LAB_MODULES, type LabModuleId } from "../../data/labModules";
import { AdminSubnavFlyout } from "../account-overview/AdminSubnavFlyout";
import { AdminSubNavIcon } from "../account-overview/AdminSubNavIcon";

interface Props {
  labId: number;
  activeModuleId: LabModuleId;
}

function RightChevron() {
  return (
    <span className="ao-nav-item__chevron" aria-hidden>
      <svg viewBox="0 0 8 12" width="7" height="11" fill="none">
        <path
          d="M1.5 1.5L5.5 5.5l-4 4"
          stroke="currentColor"
          strokeWidth="1.3"
          strokeLinecap="round"
        />
      </svg>
    </span>
  );
}

export function ModuleSwitcherNav({ labId, activeModuleId }: Props) {
  const location = useLocation();
  const [flyoutOpen, setFlyoutOpen] = useState(false);
  const [flyoutTop, setFlyoutTop] = useState(0);

  const moduleMeta = LAB_MODULES[activeModuleId];
  const closeFlyout = useCallback(() => setFlyoutOpen(false), []);

  useEffect(() => {
    setFlyoutOpen(false);
  }, [location.pathname]);

  useEffect(() => {
    if (!flyoutOpen) return;
    const updateTop = () => {
      const trigger = document.querySelector('[data-module-switcher-trigger]');
      if (trigger instanceof HTMLElement) {
        setFlyoutTop(trigger.getBoundingClientRect().top);
      }
    };
    updateTop();
    window.addEventListener("scroll", updateTop, true);
    window.addEventListener("resize", updateTop);
    return () => {
      window.removeEventListener("scroll", updateTop, true);
      window.removeEventListener("resize", updateTop);
    };
  }, [flyoutOpen]);

  function toggleFlyout(event: React.MouseEvent<HTMLButtonElement>) {
    setFlyoutTop(event.currentTarget.getBoundingClientRect().top);
    setFlyoutOpen((open) => !open);
  }

  return (
    <>
      <div className="ao-sidebar__module-switcher">
        <button
          type="button"
          data-module-switcher-trigger
          data-subnav-flyout-trigger
          className={`ao-nav-item ao-sidebar__module-switcher-btn${
            flyoutOpen ? " ao-nav-item--flyout-open" : ""
          }`}
          onClick={toggleFlyout}
          aria-expanded={flyoutOpen}
          aria-haspopup="menu"
          aria-label={`${moduleMeta.label} — switch module`}
        >
          <AdminSubNavIcon id={moduleMeta.icon} />
          <span className="ao-nav-item__label">{moduleMeta.label}</span>
          <RightChevron />
        </button>
      </div>

      <AdminSubnavFlyout
        open={flyoutOpen}
        top={flyoutTop}
        labId={labId}
        mode="home"
        items={HOME_SUB_NAV}
        onClose={closeFlyout}
      />
    </>
  );
}
