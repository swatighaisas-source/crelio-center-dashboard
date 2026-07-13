import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import { LabsProvider } from "./context/LabsContext";
import { CreateCentreLayout } from "./pages/create-centre/CreateCentreLayout";
import { CreateAccountPage } from "./pages/create-centre/CreateAccountPage";
import { TellAboutBusinessPage } from "./pages/create-centre/TellAboutBusinessPage";
import { AccountReadyPage } from "./pages/create-centre/AccountReadyPage";
import { SetupLandingPage } from "./pages/create-centre/SetupLandingPage";
import { SetupDiagnosticCenterPage } from "./pages/create-centre/SetupDiagnosticCenterPage";
import { ReportTemplatePage } from "./pages/create-centre/ReportTemplatePage";
import { UploadLetterheadPage } from "./pages/create-centre/UploadLetterheadPage";
import { SigningDoctorPage } from "./pages/create-centre/SigningDoctorPage";
import { TeamMembersPage } from "./pages/create-centre/TeamMembersPage";
import { ChoosePlanPage } from "./pages/create-centre/ChoosePlanPage";
import { CreateCentreWizardPage } from "./pages/create-centre/CreateCentreWizardPage";
import { USWelcomePage } from "./pages/create-centre/us/USWelcomePage";
import { USNpiPage } from "./pages/create-centre/us/USNpiPage";
import { USLabTypePage } from "./pages/create-centre/us/USLabTypePage";
import { USModalitiesPage } from "./pages/create-centre/us/USModalitiesPage";
import { USVolumePage } from "./pages/create-centre/us/USVolumePage";
import { USDevicesPage } from "./pages/create-centre/us/USDevicesPage";
import { USIntegrationsPage } from "./pages/create-centre/us/USIntegrationsPage";
import { USSPOCPage } from "./pages/create-centre/us/USSPOCPage";
import { USPlanSelectionPage } from "./pages/create-centre/us/USPlanSelectionPage";
import { DashboardPage } from "./pages/DashboardPage";
import { LabDetailPage } from "./pages/LabDetailPage";
import { LabDataCleanupPage } from "./pages/LabDataCleanupPage";
import { CenterManagementHubPage } from "./pages/CenterManagementHubPage";
import { CenterOnboardingPage } from "./pages/CenterOnboardingPage";
import { CenterSectionPage } from "./pages/CenterSectionPage";
import { ParameterSetupSectionPage } from "./pages/ParameterSetupSectionPage";
import { ServiceListSectionPage } from "./pages/ServiceListSectionPage";
import { CenterUserDetailPage } from "./pages/CenterUserDetailPage";
import { CenterSelectUserRolePage } from "./pages/CenterSelectUserRolePage";
import { CenterAddUserPage } from "./pages/CenterAddUserPage";
import { LegacyHomeRedirect } from "./pages/LegacyHomeRedirect";
import { LabProfilePage } from "./pages/LabProfilePage";
import { LabOpenTasksPage } from "./pages/LabOpenTasksPage";
import { LabFeedbackPage } from "./pages/LabFeedbackPage";
import { LabActionsPage } from "./pages/LabActionsPage";
import { LabNotificationsPage } from "./pages/LabNotificationsPage";
import { AccountOverviewPage } from "./pages/AccountOverviewPage";
import { CliaProfilingPage } from "./pages/CliaProfilingPage";
import { LoginPage } from "./pages/LoginPage";
import { SupportLoginPage } from "./pages/SupportLoginPage";
import { LAB_MODULE_IDS } from "./data/labModules";
import { LAB_MODULE_ROUTE_PAGES } from "./pages/labModuleRoutes";
import { LabDashboardLayout } from "./components/lab-shell/LabDashboardLayout";
import "./styles/dashboard.css";
import "./styles/lab-detail.css";
import "./styles/subpage-breadcrumb.css";

export default function App() {
  return (
    <BrowserRouter>
      <LabsProvider>
        <Routes>
          <Route path="/" element={<DashboardPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/support-login" element={<SupportLoginPage />} />
          <Route path="/clia-profiling" element={<CliaProfilingPage />} />
          <Route element={<LabDashboardLayout />}>
            <Route path="/lab/:id/center/onboarding" element={<CenterOnboardingPage />} />
            <Route path="/lab/:id/center/users/new/:roleId" element={<CenterAddUserPage />} />
            <Route path="/lab/:id/center/users/new" element={<CenterSelectUserRolePage />} />
            <Route path="/lab/:id/center/users/:userId" element={<CenterUserDetailPage />} />
            <Route
              path="/lab/:id/center/parameter-setup/*"
              element={<ParameterSetupSectionPage />}
            />
            <Route
              path="/lab/:id/center/service-list/*"
              element={<ServiceListSectionPage />}
            />
            <Route path="/lab/:id/center/:section" element={<CenterSectionPage />} />
            <Route path="/lab/:id/center" element={<CenterManagementHubPage />} />
            <Route path="/lab/:id/account-overview" element={<AccountOverviewPage />} />
            {LAB_MODULE_IDS.map((moduleId) => {
              const ModuleRoutePage = LAB_MODULE_ROUTE_PAGES[moduleId];
              return (
                <Route
                  key={moduleId}
                  path={`/lab/:id/${moduleId}/*`}
                  element={<ModuleRoutePage />}
                />
              );
            })}
            <Route path="/lab/:id/profile" element={<LabProfilePage />} />
            <Route path="/lab/:id/open-tasks" element={<LabOpenTasksPage />} />
            <Route path="/lab/:id/feedback" element={<LabFeedbackPage />} />
            <Route path="/lab/:id/actions" element={<LabActionsPage />} />
            <Route path="/lab/:id/notifications" element={<LabNotificationsPage />} />
            <Route path="/lab/:id/home/*" element={<LegacyHomeRedirect />} />
          </Route>
          <Route path="/lab/:id" element={<LabDetailPage />} />
          <Route path="/lab/:id/plan" element={<LabDetailPage />} />
          <Route path="/lab/:id/configurations" element={<LabDetailPage />} />
          <Route path="/lab/:id/data-cleanup" element={<LabDataCleanupPage />} />
          <Route path="/create-centre" element={<CreateCentreLayout />}>
            <Route index element={<SetupLandingPage />} />
            <Route path="account" element={<CreateAccountPage />} />
            <Route path="business" element={<TellAboutBusinessPage />} />
            <Route path="account-ready" element={<AccountReadyPage />} />
            <Route path="setup" element={<SetupDiagnosticCenterPage />} />
            <Route path="setup/report-template" element={<ReportTemplatePage />} />
            <Route path="setup/letterhead" element={<UploadLetterheadPage />} />
            <Route path="setup/signing-doctor" element={<SigningDoctorPage />} />
            <Route path="setup/team-members" element={<TeamMembersPage />} />
            <Route path="choose-plan" element={<ChoosePlanPage />} />
            <Route path="wizard/:step" element={<CreateCentreWizardPage />} />
            <Route path="us" element={<USWelcomePage />} />
            <Route path="us/npi" element={<USNpiPage />} />
            <Route path="us/lab-type" element={<USLabTypePage />} />
            <Route path="us/modalities" element={<USModalitiesPage />} />
            <Route path="us/volume" element={<USVolumePage />} />
            <Route path="us/devices" element={<USDevicesPage />} />
            <Route path="us/integrations" element={<USIntegrationsPage />} />
            <Route path="us/spoc" element={<USSPOCPage />} />
            <Route path="us/plan" element={<USPlanSelectionPage />} />
          </Route>
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </LabsProvider>
    </BrowserRouter>
  );
}
