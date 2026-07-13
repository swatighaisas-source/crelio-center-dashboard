import {
  Navigate,
  Outlet,
  Route,
  Routes,
  useNavigate,
  useOutletContext,
  useParams,
} from 'react-router-dom';
import './agGridSetup';
import 'ag-grid-community/styles/ag-grid.css';
import 'ag-grid-community/styles/ag-theme-alpine.css';
import './index.css';
import { StoreProvider } from '@/lib/store';
import { TestListScreen } from '@/features/reports/TestListScreen';
import { TestDetailScreen } from '@/features/reports/TestDetailScreen';
import { useToast } from '@/lib/useToast';
import { Toaster } from '@/components/Toaster';

type DetailCtx = {
  pushToast: (
    message: string,
    tone?: 'success' | 'info' | 'warning' | 'danger',
  ) => void;
};

function ServiceListLayout() {
  const { toasts, push, dismiss } = useToast();
  const ctx: DetailCtx = { pushToast: push };
  return (
    <div className="param-setup-root param-setup-card relative">
      <Outlet context={ctx} />
      <Toaster toasts={toasts} onDismiss={dismiss} />
    </div>
  );
}

function listHref(id: string | undefined) {
  return `/lab/${id}/center/service-list`;
}

function TestListRoute() {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  return (
    <TestListScreen
      onOpenTest={(testId) =>
        navigate(`${listHref(id)}/${encodeURIComponent(testId)}`)
      }
    />
  );
}

function TestDetailRoute() {
  const { id, testId } = useParams<{ id: string; testId: string }>();
  const navigate = useNavigate();
  const { pushToast } = useOutletContext<DetailCtx>();

  if (!testId) {
    return <Navigate to={listHref(id)} replace />;
  }

  return (
    <TestDetailScreen
      testId={testId}
      onBackToList={() => navigate(listHref(id))}
      pushToast={pushToast}
    />
  );
}

function RedirectToList() {
  const { id } = useParams<{ id: string }>();
  return <Navigate to={listHref(id)} replace />;
}

/**
 * The "Service List" admin section: the test list (with bulk upload) plus the
 * per-test detail view. Mounted under `/lab/:id/center/service-list/*`.
 */
export default function ServiceListApp() {
  return (
    <StoreProvider>
      <Routes>
        <Route element={<ServiceListLayout />}>
          <Route index element={<TestListRoute />} />
          <Route path=":testId" element={<TestDetailRoute />} />
          <Route path="*" element={<RedirectToList />} />
        </Route>
      </Routes>
    </StoreProvider>
  );
}
