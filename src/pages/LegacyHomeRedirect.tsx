import { Navigate, useLocation, useParams } from "react-router-dom";

const LEGACY_HOME_PATHS: Record<string, string> = {
  profile: "profile",
  "open-tasks": "open-tasks",
  feedback: "feedback",
  actions: "actions",
  notifications: "notifications",
};

/** Redirects old /lab/:id/home/* URLs to their new top-level paths. */
export function LegacyHomeRedirect() {
  const { id } = useParams<{ id: string }>();
  const location = useLocation();
  const labId = id ?? "";
  const match = location.pathname.match(/^\/lab\/\d+\/home(?:\/(.*))?$/);
  const subPath = (match?.[1] ?? "").replace(/\/$/, "");

  if (!subPath) {
    return <Navigate to={`/lab/${labId}/center`} replace />;
  }

  const segment = subPath.split("/")[0];
  const target = LEGACY_HOME_PATHS[segment];
  if (target) {
    return <Navigate to={`/lab/${labId}/${target}`} replace />;
  }

  return <Navigate to={`/lab/${labId}/center`} replace />;
}
