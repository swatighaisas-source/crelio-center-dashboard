import { Navigate, useParams } from "react-router-dom";
import {
  getModuleBasePath,
  getModuleDefaultPath,
  getModuleIdFromPath,
  getModuleSectionPath,
  resolveModuleSectionTitle,
  sectionHref,
  type LabModuleId,
} from "../data/labModules";
import { useSyncedPathname } from "../hooks/useSyncedPathname";
import { ModuleNavSidebar } from "../components/lab-shell/ModuleNavSidebar";
import { ModulePlaceholder } from "../components/lab-shell/ModulePlaceholder";
import { InflowCancelledReportsWorkspace, InflowDismissReportsWorkspace, InflowOperationWorkspace } from "../components/inflow/InflowOperationWorkspace";
import { OrderHistoryPage } from "../components/inflow/OrderHistoryPage";
import { PendingCollectionPage } from "../components/inflow/PendingCollectionPage";
import { SampleListPage } from "../components/inflow/SampleListPage";
import { RegistrationToolbar } from "../components/registration/RegistrationToolbar";
import { useInflow } from "../context/InflowContext";
import { PatientRegistrationForm } from "../components/registration/PatientRegistrationForm";
import { NgsAoePanel } from "../components/registration/NgsAoePanel";
import { AccountListPage } from "../components/finance/AccountListPage";
import { LabFormsHistoryPage } from "../components/registration/LabFormsHistoryPage";
import { useLabs } from "../context/LabsContext";
import "../styles/account-overview.css";
import "../styles/module-layout.css";
import "../styles/registration.css";
import "../styles/operation.css";
import "../styles/finance.css";

function RegistrationWorkspace() {
  return (
    <>
      <RegistrationToolbar />
      <div className="reg-workspace">
        <div className="reg-form-panel">
          <PatientRegistrationForm />
        </div>
        <NgsAoePanel />
      </div>
    </>
  );
}

function RegistrationInflowSection({ section }: { section: string }) {
  const inflow = useInflow();

  if (section === "order-history") {
    return (
      <div className="inflow-root">
        <OrderHistoryPage
          orders={inflow.orders}
          getExceptionsForOrder={inflow.getExceptionsForOrder}
          onSelectOrder={inflow.setSelectedOrderId}
        />
      </div>
    );
  }

  if (section === "pending-collection") {
    return (
      <div className="inflow-root">
        <PendingCollectionPage
          samples={inflow.pendingCollectionSamples}
          getExceptionsForSample={inflow.getExceptionsForSample}
          onSelectSample={inflow.setSelectedSampleId}
          onCollectSample={inflow.collectSample}
        />
      </div>
    );
  }

  return null;
}

function AccessionInflowSection({ section }: { section: string }) {
  const inflow = useInflow();

  if (section === "sample-list") {
    return (
      <div className="inflow-root">
        <SampleListPage
          samples={inflow.samples}
          getExceptionsForSample={inflow.getExceptionsForSample}
          onSelectSample={inflow.setSelectedSampleId}
          onRedrawSample={inflow.setRedrawSampleId}
        />
      </div>
    );
  }

  return null;
}

function ModuleMainContent({
  moduleId,
  labId,
  pathname,
}: {
  moduleId: LabModuleId;
  labId: number;
  pathname: string;
}) {
  const section = getModuleSectionPath(pathname, labId, moduleId);

  if (moduleId === "registration" && section === "") {
    return <RegistrationWorkspace />;
  }

  if (moduleId === "registration" && (section === "order-history" || section === "pending-collection")) {
    return <RegistrationInflowSection section={section} />;
  }

  if (moduleId === "registration" && section === "lab-forms-history") {
    return (
      <Navigate
        to={sectionHref(labId, "registration", "lab-forms-history/consent-history")}
        replace
      />
    );
  }

  if (moduleId === "registration" && section.startsWith("lab-forms-history/")) {
    return (
      <div className="inflow-root">
        <LabFormsHistoryPage section={section} />
      </div>
    );
  }

  if (moduleId === "operation" && (section === "" || section === "waiting-list")) {
    return <InflowOperationWorkspace />;
  }

  if (moduleId === "operation" && section === "dismiss-reports") {
    return <InflowDismissReportsWorkspace />;
  }

  if (moduleId === "operation" && section === "cancelled-reports") {
    return <InflowCancelledReportsWorkspace />;
  }

  if (moduleId === "accession" && section === "sample-list") {
    return <AccessionInflowSection section={section} />;
  }

  if (moduleId === "finance" && section === "account-management/account-list") {
    return <AccountListPage labId={labId} />;
  }

  const title = resolveModuleSectionTitle(moduleId, section);
  return <ModulePlaceholder title={title} moduleId={moduleId} />;
}

interface Props {
  moduleId: LabModuleId;
}

export function LabModulePage({ moduleId: moduleIdFromRoute }: Props) {
  const { id } = useParams<{ id: string }>();
  const pathname = useSyncedPathname();
  const labId = Number(id);
  const moduleId = moduleIdFromRoute;
  const moduleBase = getModuleBasePath(labId, moduleId);
  const pathModuleId = getModuleIdFromPath(pathname, labId);

  const { getLabDetail } = useLabs();
  const lab = getLabDetail(labId);

  if (!lab || Number.isNaN(labId)) {
    return <Navigate to="/" replace />;
  }

  if (pathModuleId && pathModuleId !== moduleId) {
    return <Navigate to={getModuleDefaultPath(labId, pathModuleId)} replace />;
  }

  if (
    !pathModuleId &&
    pathname !== moduleBase &&
    !pathname.startsWith(`${moduleBase}/`)
  ) {
    return null;
  }

  const contentKey = `${moduleId}-${pathname}`;

  const layoutClass =
    moduleId === "registration"
      ? "reg-layout module-layout"
      : moduleId === "operation"
        ? "op-layout module-layout"
        : "module-layout";

  const sidebarClass =
    moduleId === "registration" ? "reg-sidebar" : moduleId === "operation" ? "op-sidebar" : "";

  const mainClass =
    moduleId === "registration" ? "reg-main" : moduleId === "operation" ? "op-main" : "";

  return (
    <div className={layoutClass} key={contentKey}>
      <ModuleNavSidebar labId={labId} moduleId={moduleId} className={sidebarClass} />
      <div className={`module-main ${mainClass}`}>
        <ModuleMainContent moduleId={moduleId} labId={labId} pathname={pathname} />
      </div>
    </div>
  );
}
