---
name: notifications-fullpage-redesign
overview: Redesign Notifications to a Jira-like full page without the left app sidebar, keeping the top nav and adding a left filter rail with unread counts plus a history-back control.
todos:
  - id: notif-layout
    content: Replace Notifications page layout with full-page two-column structure (left rail + content pane) without AccountOverviewSidebar.
    status: completed
  - id: notif-filtering
    content: Implement hybrid category rail with unread counts and history-back behavior; wire filtering + unread toggle state.
    status: completed
  - id: notif-styles
    content: Add Jira-like full-page styles in lab-home.css for left rail, active states, right header controls, and responsive behavior.
    status: completed
  - id: notif-feed-compat
    content: Adjust NotificationsFeed only if needed to fit page-mode layout while preserving existing mark-read behavior.
    status: completed
  - id: notif-verify
    content: "Build and verify interactions: category filters, unread counts, mark all/read, history back, workflow toggle guard."
    status: completed
isProject: false
---

# Notifications Full-Page Redesign Plan

## Scope and UX Decisions

- Keep top navigation as-is (provided by `LabDashboardLayout`).
- Remove `AccountOverviewSidebar` from Notifications page only.
- Implement a **hybrid Jira-like** left rail using existing notification categories with unread counts.
- Back option uses browser history (`navigate(-1)`).

## Implementation Steps

- Update page structure in `[src/pages/LabNotificationsPage.tsx](src/pages/LabNotificationsPage.tsx)`:
  - Replace `ao-layout` + `AccountOverviewSidebar` with a dedicated full-page notifications layout container.
  - Add a left rail that includes:
    - Notifications title
    - Back control (history back)
    - Category list (All, Unread, Reports, Samples, Invoices, Exceptions, System)
    - Per-category unread counts derived from current read state
  - Keep workflow-config guard (`showNotifications`) unchanged.
- Refactor page state and filtering logic in `[src/pages/LabNotificationsPage.tsx](src/pages/LabNotificationsPage.tsx)`:
  - Keep `readIds` as source of read/unread truth.
  - Add/keep selected category state.
  - Add "Only show unread" toggle for right pane.
  - Compute filtered notifications from category + unread toggle.
- Adapt the main content pane in `[src/pages/LabNotificationsPage.tsx](src/pages/LabNotificationsPage.tsx)`:
  - Add right-pane header controls (Today label, Mark all as read, Only show unread toggle).
  - Render full notifications feed/list in the content column.
  - Preserve mark-read interactions and unread counters.
- Add styling for new layout in `[src/styles/lab-home.css](src/styles/lab-home.css)`:
  - New classes for full-page shell, left rail, category items/count badges, right content header, and unread toggle.
  - Ensure visual hierarchy aligns with Jira-like layout (clear column split, active state, subtle separators).
  - Add responsive behavior (left rail collapses/stacking on small screens).
- Keep `NotificationsFeed` compatibility in `[src/components/lab-home/NotificationsFeed.tsx](src/components/lab-home/NotificationsFeed.tsx)`:
  - Reuse as much as possible.
  - If needed, add minimal optional props for page-mode header suppression/spacing so styling remains consistent without duplicating list logic.

## Validation

- Run `npm run build` to ensure TS/CSS compile.
- Manual checks:
  - Notifications page has no account left nav.
  - Top nav remains visible.
  - Left categories switch list correctly.
  - Unread counts update after mark-read actions.
  - Back button returns to previous page.
  - Notifications hidden entirely when workflow toggle is off.

