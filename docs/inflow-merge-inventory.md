# Inflow merge inventory

Task manager (`task-manager-end-to-end-flow`) → Centre dashboard (`crelio-centre-dashboard`)

| Task manager source | Centre dashboard target |
|---------------------|-------------------------|
| `src/data/mockOrders.ts` | `src/data/inflow/mockOrders.ts` |
| `src/data/mockSamples.ts` | `src/data/inflow/mockSamples.ts` |
| `src/data/mockReports.ts` | `src/data/inflow/mockReports.ts` |
| `src/data/exceptionTypes.ts` | `src/data/inflow/exceptionTypes.ts` |
| `src/data/rolloutConfig.ts` | `src/data/inflow/rolloutConfig.ts` |
| `src/data/mockTasks.ts` | `src/data/inflow/mockTasks.ts` |
| `src/data/notifications.ts` | `src/data/inflow/engineNotifications.ts` |
| `src/utils/exceptionPropagation.ts` | `src/lib/inflow/exceptionPropagation.ts` |
| `src/App.tsx` (state + mutations) | `src/context/InflowContext.tsx` + `src/lib/inflow/*` |
| `src/components/ExceptionSection.tsx` | `src/components/inflow/ExceptionSection.tsx` |
| `src/components/ExceptionTags.tsx` | `src/components/inflow/ExceptionTags.tsx` |
| `src/components/TaskDetailModal.tsx` | `src/components/inflow/TaskDetailPanel.tsx` |
| `src/components/TaskVisibilityPill.tsx` | `src/components/inflow/TaskVisibilityPill.tsx` |
| `src/components/OrderHistoryPage.tsx` | `src/components/inflow/OrderHistoryPage.tsx` |
| `src/components/OrderUpdateModal.tsx` | `src/components/inflow/modals/OrderUpdateModal.tsx` |
| `src/components/ReportListPage.tsx` | `src/components/inflow/ReportListPage.tsx` |
| `src/components/ReportUpdateModal.tsx` | `src/components/inflow/modals/ReportUpdateModal.tsx` |
| `src/components/SampleListPage.tsx` | `src/components/inflow/SampleListPage.tsx` |
| `src/components/SampleUpdateModal.tsx` | `src/components/inflow/modals/SampleUpdateModal.tsx` |
| `src/components/SampleRedrawModal.tsx` | `src/components/inflow/modals/SampleRedrawModal.tsx` |
| `src/components/PendingCollectionPage.tsx` | `src/components/inflow/PendingCollectionPage.tsx` |
| `src/components/RolloutConfigPage.tsx` | `src/pages/CenterRolloutConfigPage.tsx` |
| `src/components/NotificationListPage.tsx` | Replaced by `LabActionsPage` + `LabNotificationsPage` |
| `src/components/NotificationDetailModal.tsx` | Merged into `NotificationDetailPanel.tsx` |
| `src/components/Sidebar.tsx` | Replaced by `GlobalTopBar` + module sidebars |
| `src/components/TaskListPage.tsx` | Dropped (unused) |
| `src/styles.css` | `src/styles/inflow.css` (namespaced) |
