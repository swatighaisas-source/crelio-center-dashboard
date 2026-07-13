import {
  Navigate,
  Outlet,
  Route,
  Routes,
  useParams,
} from 'react-router-dom';
import './agGridSetup';
import 'ag-grid-community/styles/ag-grid.css';
import 'ag-grid-community/styles/ag-theme-alpine.css';
import './index.css';
import { StoreProvider } from '@/lib/store';
import { ParamBaseProvider, useParamPaths } from '@/nav/base';
import { ParameterLibraryPage } from '@/features/parameters/ParameterLibraryPage';
import { AssignParameters } from '@/features/mappings/AssignParameters';
import { UnusedParametersScreen } from '@/features/cleanup/UnusedParametersScreen';
import { DedupeScreen } from '@/features/cleanup/DedupeScreen';
import { MissingFieldsScreen } from '@/features/cleanup/MissingFieldsScreen';
import { QcInterfacingScreen } from '@/features/cleanup/QcInterfacingScreen';

/**
 * Content shell for the parameter section. The dark nav rail is gone — the
 * admin (account overview) sidebar is the only nav, and the content fills the
 * host area. The host renders the breadcrumb above this.
 */
function ParameterSetupWorkspace() {
  return (
    <div className="param-setup-root param-setup-card text-slate-900">
      <Outlet />
    </div>
  );
}

function RedirectToLibrary() {
  const paths = useParamPaths();
  return <Navigate to={paths.parameterLibrary} replace />;
}

/**
 * Test Creation and the Test List now live under the admin "Service List"
 * section, so the tool redirects its old `tests`/`reports` URLs there.
 */
function RedirectToServiceList() {
  const { id } = useParams<{ id: string }>();
  return <Navigate to={`/lab/${id}/center/service-list`} replace />;
}

/**
 * Parameter-setup tool, mounted under `/lab/:id/center/parameter-setup/*` in the
 * host. The host owns the BrowserRouter; this renders a nested route group.
 */
export default function ParameterSetupApp() {
  const { id } = useParams<{ id: string }>();
  const base = `/lab/${id}/center/parameter-setup`;

  return (
    <ParamBaseProvider base={base}>
      <StoreProvider>
        <Routes>
          <Route element={<ParameterSetupWorkspace />}>
            <Route index element={<RedirectToLibrary />} />

            <Route path="tests" element={<RedirectToServiceList />} />

            <Route path="parameters">
              <Route index element={<RedirectToLibrary />} />
              <Route path="library" element={<ParameterLibraryPage />} />
            </Route>

            <Route path="assign-parameters" element={<AssignParameters />} />

            <Route path="cleanup">
              <Route index element={<Navigate to="unused" replace />} />
              <Route path="unused" element={<UnusedParametersScreen />} />
              <Route path="dedupe" element={<DedupeScreen />} />
              <Route path="missing-fields" element={<MissingFieldsScreen />} />
            </Route>

            <Route path="qc-mapping" element={<QcInterfacingScreen />} />

            <Route path="reports/*" element={<RedirectToServiceList />} />

            <Route path="*" element={<RedirectToLibrary />} />
          </Route>
        </Routes>
      </StoreProvider>
    </ParamBaseProvider>
  );
}
