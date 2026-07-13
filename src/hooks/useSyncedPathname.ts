import { useLayoutEffect, useSyncExternalStore } from "react";
import { useLocation, useNavigate } from "react-router-dom";

function subscribeToPathname(onStoreChange: () => void) {
  const notify = () => onStoreChange();

  const originalPushState = history.pushState.bind(history);
  const originalReplaceState = history.replaceState.bind(history);

  history.pushState = (...args) => {
    originalPushState(...args);
    notify();
  };
  history.replaceState = (...args) => {
    originalReplaceState(...args);
    notify();
  };

  window.addEventListener("popstate", notify);
  window.addEventListener("hashchange", notify);

  return () => {
    history.pushState = originalPushState;
    history.replaceState = originalReplaceState;
    window.removeEventListener("popstate", notify);
    window.removeEventListener("hashchange", notify);
  };
}

function getWindowPathname() {
  return window.location.pathname;
}

/** Pathname from the address bar; re-renders on history.pushState/replaceState (SPA navigations). */
export function useSyncedPathname(): string {
  const location = useLocation();
  const navigate = useNavigate();

  const pathname = useSyncExternalStore(
    subscribeToPathname,
    getWindowPathname,
    () => location.pathname,
  );

  useLayoutEffect(() => {
    const routerPath =
      location.pathname + location.search + location.hash;
    const windowPath =
      window.location.pathname + window.location.search + window.location.hash;
    if (windowPath === routerPath) return;

    const windowInLabShell = windowPath.startsWith("/lab/");
    const routerInLabShell = routerPath.startsWith("/lab/");

    // Logout / dashboard: router already left the lab shell — don't restore a stale lab URL.
    if (!routerInLabShell && windowInLabShell) return;

    navigate(windowPath, { replace: true });
  }, [location.pathname, location.search, location.hash, navigate]);

  return pathname;
}
