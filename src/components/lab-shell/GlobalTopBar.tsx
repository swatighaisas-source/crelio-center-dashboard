import { useCallback, useEffect, useRef, useState } from "react";
import { Link, useLocation, useNavigate, useParams } from "react-router-dom";
import { CheckLogoIcon } from "../Icons";
import { AccountNavIcon } from "../account-overview/AccountNavIcon";
import type { NavIconId } from "../../data/accountOverview";
import { taskUsers } from "../../data/inflow/mockTasks";
import { profileInitials } from "../../data/labUserProfile";
import { resolvePageTitle } from "../../lib/resolvePageTitle";
import { getLabWorkflowConfig } from "../../lib/labWorkflowConfig";
import { inflowNotificationsToUi, inflowTasksToActionItems } from "../../lib/inflow/adapters";
import { useInflow } from "../../context/InflowContext";
import { useInflowNavigation } from "../../hooks/useInflowNavigation";
import { useInflowSelectors } from "../../hooks/useInflowSelectors";
import { useLabs } from "../../context/LabsContext";
import { GtbActionsMenu } from "./GtbActionsMenu";
import { GtbNotificationsMenu } from "./GtbNotificationsMenu";
import "../../styles/global-top-bar.css";

type OpenMenu = "notifications" | "actions" | "profile" | null;

const MORE_ITEMS: { id: string; label: string; icon: NavIconId }[] = [
  { id: "updates", label: "Updates", icon: "bell" },
  { id: "video", label: "Video Tutorial", icon: "play" },
  { id: "support", label: "Support", icon: "phone" },
];

function ChevronDownIcon() {
  return (
    <svg viewBox="0 0 12 8" width="10" height="7" fill="none" aria-hidden>
      <path
        d="M1.5 1.5L6 6l4.5-4.5"
        stroke="currentColor"
        strokeWidth="1.3"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function LogoutIcon() {
  return (
    <svg viewBox="0 0 16 16" width="16" height="16" aria-hidden>
      <path
        d="M6 2H3.5A1.5 1.5 0 0 0 2 3.5v9A1.5 1.5 0 0 0 3.5 14H6"
        stroke="currentColor"
        strokeWidth="1.25"
        fill="none"
        strokeLinecap="round"
      />
      <path
        d="M6 8h7M11.5 5.5 14 8l-2.5 2.5"
        stroke="currentColor"
        strokeWidth="1.25"
        fill="none"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export function GlobalTopBar() {
  const { id } = useParams<{ id: string }>();
  const labId = Number(id);
  const location = useLocation();
  const navigate = useNavigate();
  const { getLabDetail, getUserProfile } = useLabs();
  const inflow = useInflow();
  const { openRelatedFromUi } = useInflowNavigation();
  const {
    unreadNotificationCount,
    openActionCount,
    visibleTasks,
    taskUnreadCounts,
    currentUserNotifications,
    currentUser,
  } = useInflowSelectors();

  const [openMenu, setOpenMenu] = useState<OpenMenu>(null);
  const barRef = useRef<HTMLElement>(null);

  const close = useCallback(() => setOpenMenu(null), []);

  useEffect(() => {
    if (!openMenu) return;
    function onClick(e: MouseEvent) {
      if (!barRef.current?.contains(e.target as Node)) close();
    }
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") close();
    }
    document.addEventListener("click", onClick);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("click", onClick);
      document.removeEventListener("keydown", onKey);
    };
  }, [openMenu, close]);

  if (Number.isNaN(labId)) return null;

  const lab = getLabDetail(labId);
  if (!lab) return null;

  const pageTitle = resolvePageTitle(location.pathname, lab);
  
  const userProfile = getUserProfile(lab.id);
  const profileName = userProfile?.name ?? lab.name;
  const profileSub = `#${lab.id} - ${lab.name}`;
  // For user initials, we'll just use "L" or whatever is computed in the sidebar as fallback.
  // Actually, we can compute it similar to the sidebar.
  const initials = userProfile
    ? profileInitials(userProfile)
    : (lab.labAbbreviation ?? lab.name).split(/\s+/).map((w: string) => w[0]).join("").slice(0, 2).toUpperCase();

  const liveNotifications = inflowNotificationsToUi(
    currentUserNotifications,
    labId,
    currentUser.assignee,
  );
  const liveActions = inflowTasksToActionItems(
    visibleTasks,
    currentUser.assignee,
    taskUnreadCounts,
  );
  const notificationsForMenu = liveNotifications;
  const actionsForMenu = liveActions;
  const unreadNotifications = unreadNotificationCount;
  const openActions = openActionCount;
  const { showNotifications, showActions } = getLabWorkflowConfig(lab);

  const notificationsPath = `/lab/${labId}/notifications`;
  const actionsPath = `/lab/${labId}/actions`;
  const isOnNotificationsPage = location.pathname === notificationsPath;
  const isOnActionsPage = location.pathname === actionsPath;

  useEffect(() => {
    setOpenMenu(null);
  }, [location.pathname]);

  useEffect(() => {
    if (!showNotifications && openMenu === "notifications") close();
    if (!showActions && openMenu === "actions") close();
  }, [showNotifications, showActions, openMenu, close]);

  function toggle(menu: Exclude<OpenMenu, null>, e: React.MouseEvent) {
    e.stopPropagation();
    setOpenMenu((cur) => (cur === menu ? null : menu));
  }

  return (
    <header className="gtb" ref={barRef}>
      <Link to={`/lab/${labId}/center`} className="gtb__brand" aria-label="Go to Lab Settings">
        <CheckLogoIcon />
        <span className="gtb__brand-text">CrelioHealth</span>
      </Link>

      <div className="gtb__content">
        {pageTitle && <h1 className="gtb__page-title">{pageTitle}</h1>}

        <nav className="gtb__nav" aria-label="Global navigation">
          {showNotifications && (
          <div className="gtb__pop-wrap">
            <button
              type="button"
              className={`gtb__nav-item${openMenu === "notifications" || isOnNotificationsPage ? " gtb__nav-item--active" : ""}`}
              aria-label={`Notifications, ${unreadNotifications} unread`}
              aria-expanded={openMenu === "notifications"}
              aria-current={isOnNotificationsPage ? "page" : undefined}
              aria-haspopup="menu"
              onClick={(e) => toggle("notifications", e)}
            >
              <AccountNavIcon id="bell" />
              <span className="gtb__nav-label">Notifications</span>
              {unreadNotifications > 0 && (
                <span className="gtb__badge gtb__badge--inline">{unreadNotifications}</span>
              )}
              <span className="gtb__nav-chevron">
                <ChevronDownIcon />
              </span>
            </button>

            {openMenu === "notifications" && (
              <GtbNotificationsMenu
                labId={labId}
                notifications={notificationsForMenu}
                onClose={close}
                onSelectNotification={(notification) => openRelatedFromUi(notification)}
              />
            )}
          </div>
          )}

          {showActions && (
          <div className="gtb__pop-wrap">
            <button
              type="button"
              className={`gtb__nav-item${openMenu === "actions" || isOnActionsPage ? " gtb__nav-item--active" : ""}`}
              aria-label={`Actions, ${openActions} open`}
              aria-expanded={openMenu === "actions"}
              aria-current={isOnActionsPage ? "page" : undefined}
              aria-haspopup="menu"
              onClick={(e) => toggle("actions", e)}
            >
              <AccountNavIcon id="layers" />
              <span className="gtb__nav-label">Actions</span>
              {openActions > 0 && (
                <span className="gtb__badge gtb__badge--inline">{openActions}</span>
              )}
              <span className="gtb__nav-chevron">
                <ChevronDownIcon />
              </span>
            </button>

            {openMenu === "actions" && (
              <GtbActionsMenu
                labId={labId}
                actions={actionsForMenu}
                onClose={close}
                onSelectAction={(action) => inflow.openTaskAndMarkNotificationsRead(action.id)}
              />
            )}
          </div>
          )}

          <button type="button" className="gtb__nav-item">
            <AccountNavIcon id="phone" />
            <span className="gtb__nav-label">Support</span>
          </button>

          <div className="gtb__nav-divider" role="separator" />

          <div className="gtb__pop-wrap">
            <button
              type="button"
              className={`gtb__profile-btn${openMenu === "profile" ? " gtb__profile-btn--active" : ""}`}
              aria-label="Open account menu"
              aria-expanded={openMenu === "profile"}
              aria-haspopup="menu"
              onClick={(e) => toggle("profile", e)}
            >
              {userProfile?.profilePhotoUrl ? (
                <img
                  src={userProfile.profilePhotoUrl}
                  alt=""
                  className="gtb__avatar gtb__avatar--photo"
                />
              ) : (
                <span className="gtb__avatar">{initials}</span>
              )}
              <span className="gtb__profile-name">{profileName}</span>
              <span className="gtb__profile-chevron" aria-hidden>
                <ChevronDownIcon />
              </span>
            </button>

            {openMenu === "profile" && (
              <div className="gtb__menu gtb__menu--profile" role="menu" aria-label="Account menu">
                <div className="gtb__menu-profile">
                  <span className="gtb__menu-profile-name">{profileName}</span>
                  <span className="gtb__menu-profile-lab">{profileSub}</span>
                </div>

                <div className="gtb__menu-divider" role="separator" />

                <div className="gtb__menu-plan">
                  <span className="gtb__menu-plan-label">Plan</span>
                  <span className="gtb__menu-plan-value">{lab.currentPlan}</span>
                </div>

                <div className="gtb__menu-divider" role="separator" />

                <div className="gtb__menu-links" aria-label="Switch user persona">
                  {taskUsers.map((user) => (
                    <button
                      key={user.assignee}
                      type="button"
                      className={`gtb__menu-link${currentUser.assignee === user.assignee ? " gtb__menu-link--active" : ""}`}
                      onClick={() => {
                        inflow.setCurrentUser(user);
                        close();
                      }}
                    >
                      <span
                        className="gtb__menu-user-avatar"
                        style={{ background: user.assigneeColor }}
                        aria-hidden
                      >
                        {user.assigneeInitials}
                      </span>
                      <span>
                        {user.assignee}
                        {user.organization ? ` (${user.organization})` : ""}
                      </span>
                    </button>
                  ))}
                </div>

                <div className="gtb__menu-divider" role="separator" />

                <div className="gtb__menu-links">
                  {MORE_ITEMS.map((item) => (
                    <button
                      key={item.id}
                      type="button"
                      className="gtb__menu-link"
                      onClick={() => close()}
                    >
                      <AccountNavIcon id={item.icon} />
                      <span>{item.label}</span>
                    </button>
                  ))}
                </div>

                <div className="gtb__menu-divider" role="separator" />

                <button
                  type="button"
                  className="gtb__menu-logout"
                  onClick={() => {
                    close();
                    navigate("/", { replace: true });
                  }}
                >
                  <span className="gtb__menu-logout-icon">
                    <LogoutIcon />
                  </span>
                  <span>Logout</span>
                </button>
              </div>
            )}
          </div>
        </nav>
      </div>
    </header>
  );
}
