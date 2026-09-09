import { useCallback, useEffect, useRef, useState, type RefObject } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { SearchIcon } from "../Icons";
import {
  ACCOUNT_NAV,
  ADMIN_SUB_NAV,
  LAB_SETTINGS_NAV_ID,
  ONBOARDING_NAV_ID,
  MAIN_NAV_SECTION_IDS,
  CLIENT_PRICING_NAV_ID,
  CLIENT_PRICING_SECTION_IDS,
  TEST_MASTER_NAV_ID,
  TEST_MASTER_SECTION_IDS,
  LAB_FORMS_MANAGEMENT_NAV_ID,
  LAB_FORMS_MANAGEMENT_SECTION_IDS,
  OTHER_SETTINGS_SECTION_IDS,
} from "../../data/accountOverview";
import type { MainNavSectionId, NavItem } from "../../data/accountOverview";
import type { LabDetail } from "../../data/labDetails";
import { AccountNavIcon } from "./AccountNavIcon";
import { AdminSubnavFlyout } from "./AdminSubnavFlyout";
import { NavExpandableGroup } from "./NavExpandableGroup";
import { useLabs } from "../../context/LabsContext";
import { useSidebarCollapse } from "../lab-shell/LabDashboardLayout";

function NavItemButton({
  item,
  isActive,
  flyoutOpen,
  triggerRef,
  onTriggerClick,
}: {
  item: NavItem;
  isActive: boolean;
  flyoutOpen: boolean;
  triggerRef?: RefObject<HTMLButtonElement>;
  onTriggerClick?: () => void;
}) {
  const isFlyoutTrigger = item.chevron === "right" && onTriggerClick;

  return (
    <button
      ref={triggerRef}
      type="button"
      data-subnav-flyout-trigger={isFlyoutTrigger ? true : undefined}
      className={`ao-nav-item${isActive ? " ao-nav-item--active" : ""}${
        item.indent ? " ao-nav-item--indent" : ""
      }${flyoutOpen ? " ao-nav-item--flyout-open" : ""}`}
      onClick={onTriggerClick}
      aria-expanded={isFlyoutTrigger ? flyoutOpen : undefined}
      aria-haspopup={isFlyoutTrigger ? "menu" : undefined}
    >
      <AccountNavIcon id={item.icon} active={isActive} />
      <span className="ao-nav-item__label">{item.label}</span>
      {item.external && (
        <span className="ao-nav-item__external" aria-label="Opens in new window">
          <svg viewBox="0 0 12 12" width="12" height="12" aria-hidden>
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
      {item.chevron === "right" && (
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
      )}
      {item.chevron === "down" && (
        <span className="ao-nav-item__chevron ao-nav-item__chevron--down" aria-hidden>
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
      )}
    </button>
  );
}

export function AccountOverviewSidebar({ lab }: { lab: LabDetail }) {
  const location = useLocation();
  const navigate = useNavigate();
  const isCenterRoute = /\/lab\/\d+\/center/.test(location.pathname);
  const isAccountOverviewRoute = /\/lab\/\d+\/account-overview/.test(location.pathname);
  const { getLabLifecycleState } = useLabs();
  const { collapsed, toggleCollapsed } = useSidebarCollapse();

  const [flyoutOpen, setFlyoutOpen] = useState(false);
  const [flyoutTop, setFlyoutTop] = useState(0);
  const [labSettingsExpanded, setLabSettingsExpanded] = useState(false);
  const [testMasterExpanded, setTestMasterExpanded] = useState(false);
  const [clientPricingExpanded, setClientPricingExpanded] = useState(false);
  const [labFormsExpanded, setLabFormsExpanded] = useState(false);
  const triggerRef = useRef<HTMLButtonElement>(null);

  const lifecycleState = getLabLifecycleState(lab.id);
  const showOnboardingNav =
    lifecycleState === "onboarding" || lifecycleState === "trial";

  const navItems: NavItem[] = ACCOUNT_NAV.filter(
    (item) => item.id !== ONBOARDING_NAV_ID || showOnboardingNav,
  );

  const openFlyout = useCallback(() => {
    if (triggerRef.current) {
      setFlyoutTop(triggerRef.current.getBoundingClientRect().top);
    }
    setFlyoutOpen(true);
  }, []);

  const toggleFlyout = useCallback(() => {
    if (flyoutOpen) {
      setFlyoutOpen(false);
      return;
    }
    openFlyout();
  }, [flyoutOpen, openFlyout]);

  useEffect(() => {
    setFlyoutOpen(false);
  }, [location.pathname]);

  useEffect(() => {
    const onTestMasterRoute =
      location.pathname === `/lab/${lab.id}/center/profile` ||
      location.pathname.startsWith(`/lab/${lab.id}/center/parameter-setup`) ||
      [...TEST_MASTER_SECTION_IDS].some(
        (id) => location.pathname === `/lab/${lab.id}/center/${id}`,
      );
    if (onTestMasterRoute) setTestMasterExpanded(true);
  }, [location.pathname, lab.id]);

  useEffect(() => {
    const onClientPricingRoute =
      location.pathname === `/lab/${lab.id}/center/list-group` ||
      [...CLIENT_PRICING_SECTION_IDS].some(
        (id) => location.pathname === `/lab/${lab.id}/center/${id}`,
      );
    if (onClientPricingRoute) setClientPricingExpanded(true);
  }, [location.pathname, lab.id]);

  useEffect(() => {
    const onLabFormsRoute = [...LAB_FORMS_MANAGEMENT_SECTION_IDS].some(
      (id) =>
        location.pathname === `/lab/${lab.id}/center/${id}` ||
        location.pathname.startsWith(`/lab/${lab.id}/center/${id}/`),
    );
    if (onLabFormsRoute) setLabFormsExpanded(true);
  }, [location.pathname, lab.id]);

  useEffect(() => {
    const onLabSettingsRoute = [...OTHER_SETTINGS_SECTION_IDS].some(
      (id) => location.pathname === `/lab/${lab.id}/center/${id}`,
    );
    if (onLabSettingsRoute) setLabSettingsExpanded(true);
  }, [location.pathname, lab.id]);

  useEffect(() => {
    if (!flyoutOpen || !triggerRef.current) return;
    const updateTop = () => {
      if (triggerRef.current) {
        setFlyoutTop(triggerRef.current.getBoundingClientRect().top);
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

  return (
    <aside className={`ao-sidebar${collapsed ? " ao-sidebar--collapsed" : ""}`}>
      <div className="ao-sidebar__search">
        <span className="ao-sidebar__search-icon">
          <SearchIcon />
        </span>
        <input type="text" placeholder="Navigation Search" aria-label="Navigation search" />
        <kbd className="ao-sidebar__kbd">
          <span>⌘</span> K
        </kbd>
      </div>

      <nav className="ao-sidebar__nav" aria-label="Account navigation">
        {navItems.map((item) => {
          const isAdmin = item.id === "admin";
          const isCenter = item.id === "center";
          const isOnboardingNav = item.id === ONBOARDING_NAV_ID;
          const isLabSettings = item.id === LAB_SETTINGS_NAV_ID;
          const isTestMaster = item.id === TEST_MASTER_NAV_ID;
          const isClientPricing = item.id === CLIENT_PRICING_NAV_ID;
          const isLabForms = item.id === LAB_FORMS_MANAGEMENT_NAV_ID;
          const isNavSection = MAIN_NAV_SECTION_IDS.has(item.id as MainNavSectionId);
          const isFlyoutRoot = isAdmin;
          const isOnboardingRoute =
            location.pathname === `/lab/${lab.id}/center/onboarding`;
          const isActive = isOnboardingNav
            ? isOnboardingRoute
            : isCenter
              ? (isCenterRoute || isAccountOverviewRoute) && !isOnboardingRoute
              : isNavSection
                ? location.pathname === `/lab/${lab.id}/center/${item.id}`
                : Boolean(item.active);

          if (item.children) {
            return (
              <NavExpandableGroup
                key={item.id}
                item={item as NavItem & { children: NonNullable<NavItem["children"]> }}
                labId={lab.id}
                expanded={
                  isLabSettings
                    ? labSettingsExpanded
                    : isTestMaster
                      ? testMasterExpanded
                      : isClientPricing
                        ? clientPricingExpanded
                        : isLabForms
                          ? labFormsExpanded
                          : false
                }
                onToggle={() => {
                  if (isLabSettings) setLabSettingsExpanded((open) => !open);
                  if (isTestMaster) setTestMasterExpanded((open) => !open);
                  if (isClientPricing) setClientPricingExpanded((open) => !open);
                  if (isLabForms) setLabFormsExpanded((open) => !open);
                }}
              />
            );
          }

          return (
            <NavItemButton
              key={item.id}
              item={item}
              isActive={isActive}
              flyoutOpen={isFlyoutRoot && flyoutOpen}
              triggerRef={isFlyoutRoot ? triggerRef : undefined}
              onTriggerClick={
                isFlyoutRoot
                  ? toggleFlyout
                  : isOnboardingNav
                    ? () => navigate(`/lab/${lab.id}/center/onboarding`)
                    : isCenter
                      ? () => navigate(`/lab/${lab.id}/center`)
                      : isNavSection
                        ? () => navigate(`/lab/${lab.id}/center/${item.id}`)
                        : undefined
              }
            />
          );
        })}
      </nav>

      <AdminSubnavFlyout
        open={flyoutOpen}
        top={flyoutTop}
        labId={lab.id}
        mode="admin"
        items={ADMIN_SUB_NAV}
        onClose={() => setFlyoutOpen(false)}
      />

      <div className="ao-sidebar__footer">
        <button type="button" className="ao-sidebar__footer-lang">
          <AccountNavIcon id="translation" />
          <span className="ao-sidebar__footer-label">English (United States)</span>
          <span className="ao-sidebar__footer-chevron" aria-hidden>
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
        <button
          type="button"
          className="ao-sidebar__collapse"
          aria-label={collapsed ? "Expand sidebar" : "Collapse sidebar"}
          onClick={toggleCollapsed}
        >
          <span className="ao-sidebar__collapse-icon" aria-hidden>
            <svg viewBox="0 0 8 12" width="8" height="12" fill="none">
              <path
                d={collapsed ? "M1.5 1.5L6 6l-4.5 4.5" : "M6.5 1.5L2 6l4.5 4.5"}
                stroke="currentColor"
                strokeWidth="1.4"
                strokeLinecap="round"
              />
            </svg>
          </span>
          <span className="ao-sidebar__footer-label">{collapsed ? "Expand" : "Collapse"}</span>
        </button>
      </div>

    </aside>
  );
}
