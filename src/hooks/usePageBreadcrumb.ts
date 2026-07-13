import { useMemo } from "react";
import { useLocation } from "react-router-dom";
import { useLabs } from "../context/LabsContext";
import { resolvePageBreadcrumb } from "../lib/resolvePageBreadcrumb";

export function usePageBreadcrumb() {
  const { pathname } = useLocation();
  const { getLabDetail } = useLabs();
  const labIdMatch = pathname.match(/^\/lab\/(\d+)/);
  const labId = labIdMatch ? Number(labIdMatch[1]) : NaN;
  const lab = Number.isNaN(labId) ? undefined : getLabDetail(labId);

  return useMemo(() => resolvePageBreadcrumb(pathname, lab), [pathname, lab]);
}
