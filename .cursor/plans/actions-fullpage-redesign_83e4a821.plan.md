---
name: actions-fullpage-redesign
overview: Redesign Actions to a Jira-like full page without the left app sidebar, keeping the top nav and adding a left filter rail with open-action counts plus a history-back control.
todos:
  - id: actions-layout
    content: Replace Actions page layout with full-page two-column structure (left rail + content pane) without AccountOverviewSidebar.
    status: completed
  - id: actions-filtering
    content: Move ActionsTable sub-tab filters to left rail with counts; lift status filter and search to right-pane header; wire filtering state at page level.
    status: completed
  - id: actions-styles
    content: Reuse na-fullpage styles from lab-home.css; add Actions-specific header controls (search, status select, Create Action) and responsive behavior if needed.
    status: completed
  - id: actions-table-compat
    content: Adjust ActionsTable only if needed to support page-mode (controlled sub-tab, suppressed internal tabs) while preserving hub preview behavior.
    status: completed
  - id: actions-verify
    content: "Build and verify interactions: sub-tab filters, open counts, status filter, search, history back, workflow toggle guard."
    status: completed
isProject: false
---

# Actions Full-Page Redesign Plan

## Scope and UX Decisions

- Keep top navigation as-is (provided by `LabDashboardLayout`).
- Remove `AccountOverviewSidebar` from Actions page only.
- Implement a **hybrid Jira-like** left rail using existing Actions sub-tab filters with open-action counts.
- Back option uses browser history (`navigate(-1)`).
- Preserve LIVE badge, search, status filter, and Create Action in the right-pane header.

## Implementation Steps

- Update page structure in `[src/pages/LabActionsPage.tsx](src/pages/LabActionsPage.tsx)`:
  - Replace `ao-layout` + `AccountOverviewSidebar` with the shared full-page layout container (`na-fullpage`).
  - Add a left rail that includes:
    - Actions title
    - Back control (history back via `useNavigate(-1)`)
    - Sub-tab category list (Assigned To Me, Updates, Reported By Me, All Actions)
    - Per-category open counts (OPEN + IN_PROGRESS) derived from current mock data
  - Keep workflow-config guard (`showActions`) unchanged.
  - Remove `account-overview.css` import if no longer needed on this page.
- Refactor page state and filtering logic in `[src/pages/LabActionsPage.tsx](src/pages/LabActionsPage.tsx)`:
  - Lift `subTab` state from `ActionsTable` to the page (`assigned` | `updates` | `reported` | `all`).
  - Keep existing page-level `search` state.
  - Add page-level `statusFilter` state (`all` | `OPEN` | `IN_PROGRESS` | `CLOSED`).
  - Compute filtered actions from sub-tab + status + search before passing to table.
  - Compute open counts per sub-tab for left-rail badges.
- Adapt the main content pane in `[src/pages/LabActionsPage.tsx](src/pages/LabActionsPage.tsx)`:
  - Add right-pane header with:
    - Section label (e.g. current sub-tab name or "Open Actions")
    - LIVE badge
    - Status filter select (moved from `ActionsTable` inline control)
    - Search input
    - Create Action button
  - Render full `ActionsTable` in the content column (no row cap).
  - Replace home-link Back with history-back in left rail (consistent with Notifications).
- Reuse and extend styling in `[src/styles/lab-home.css](src/styles/lab-home.css)`:
  - Reuse existing `na-fullpage*` classes from Notifications redesign (shell, sidebar, category list, content header).
  - Add minimal Actions-specific classes only where needed (header search, status select, Create Action button alignment in full-page header).
  - Ensure responsive behavior matches Notifications (left rail stacks on small screens).
- Keep `ActionsTable` compatibility in `[src/components/lab-home/ActionsTable.tsx](src/components/lab-home/ActionsTable.tsx)`:
  - Reuse table rendering as-is for hub preview on `LabHomePage`.
  - If needed, add optional props:
    - `subTab` / `onSubTabChange` for controlled mode
    - `statusFilter` / `onStatusFilterChange` for controlled mode
    - `showSubTabs={false}` and `showStatusFilter={false}` for page-mode to avoid duplicate controls
  - Preserve `viewAllHref` and `maxRows` for hub preview usage.

## Left Rail Filter Mapping

| Rail item         | Filter logic                          | Count badge              |
|-------------------|---------------------------------------|--------------------------|
| Assigned To Me    | `assignedToMe === true`               | Open actions in subset   |
| Updates           | `hasUpdates === true`                 | Open actions in subset   |
| Reported By Me    | `reportedByMe === true`               | Open actions in subset   |
| All Actions       | no sub-tab filter                     | Total open action count  |

Status filter and search apply on top of the selected rail item in the right pane.

## Validation

- Run `npm run build` to ensure TS/CSS compile.
- Manual checks:
  - Actions page has no account left nav.
  - Top nav remains visible.
  - Left rail sub-tabs switch table list correctly.
  - Open counts update reflect filtered subsets (OPEN + IN_PROGRESS).
  - Status filter and search narrow results as expected.
  - Back button returns to previous page.
  - Actions hidden entirely when workflow toggle is off.
  - Hub preview on `LabHomePage` still renders `ActionsTable` with internal tabs unchanged.
