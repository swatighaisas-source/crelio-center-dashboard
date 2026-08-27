import { useEffect, useLayoutEffect, useMemo, useRef, useState } from "react";
import { createPortal } from "react-dom";
import type { PropagatedExceptions } from "../../data/inflow/exceptionTypes";
import type { DismissReportSource, DismissReportSummary } from "../../data/inflow/dismissReport";
import type { Report } from "../../data/inflow/mockReports";
import { ExceptionTags } from "./ExceptionTags";
import { DismissReportModal } from "./modals/DismissReportModal";
import { DismissSummaryModal } from "./modals/DismissSummaryModal";

type Props = {
  reports: Report[];
  getExceptionsForReport: (report: Report) => PropagatedExceptions;
  onSelectReport: (reportId: string) => void;
  canDismissReports: boolean;
  currentUserName: string;
  onDismissReports: (input: {
    reportIds: string[];
    reason: string;
    remarks: string;
    source: DismissReportSource;
    dismissedBy: string;
  }) => DismissReportSummary;
};

type MenuPosition = { top: number; left: number };

export function ReportListPage({
  reports,
  getExceptionsForReport,
  onSelectReport,
  canDismissReports,
  currentUserName,
  onDismissReports,
}: Props) {
  const activeReports = useMemo(
    () => reports.filter((report) => report.status !== "Dismissed" && !report.dismissal),
    [reports],
  );

  const [menuReportId, setMenuReportId] = useState<string | null>(null);
  const [menuPos, setMenuPos] = useState<MenuPosition | null>(null);
  const [dismissTargetIds, setDismissTargetIds] = useState<string[] | null>(null);
  const [summary, setSummary] = useState<DismissReportSummary | null>(null);
  const menuRef = useRef<HTMLDivElement | null>(null);
  const triggerRefs = useRef<Record<string, HTMLButtonElement | null>>({});

  useLayoutEffect(() => {
    if (!menuReportId) {
      setMenuPos(null);
      return;
    }
    const trigger = triggerRefs.current[menuReportId];
    if (!trigger) return;
    const rect = trigger.getBoundingClientRect();
    const menuWidth = 180;
    const left = Math.min(rect.right - menuWidth, window.innerWidth - menuWidth - 8);
    setMenuPos({
      top: rect.bottom + 4,
      left: Math.max(8, left),
    });
  }, [menuReportId]);

  useEffect(() => {
    if (!menuReportId) return;

    const close = () => setMenuReportId(null);
    const handlePointer = (event: MouseEvent) => {
      const target = event.target as Node;
      if (menuRef.current?.contains(target)) return;
      const trigger = triggerRefs.current[menuReportId];
      if (trigger?.contains(target)) return;
      setMenuReportId(null);
    };

    const timer = window.setTimeout(() => {
      document.addEventListener("mousedown", handlePointer);
      window.addEventListener("scroll", close, true);
      window.addEventListener("resize", close);
    }, 0);

    return () => {
      window.clearTimeout(timer);
      document.removeEventListener("mousedown", handlePointer);
      window.removeEventListener("scroll", close, true);
      window.removeEventListener("resize", close);
    };
  }, [menuReportId]);

  const openDismiss = (reportIds: string[]) => {
    setMenuReportId(null);
    setDismissTargetIds(reportIds);
  };

  const handleConfirmDismiss = ({ reason, remarks }: { reason: string; remarks: string }) => {
    if (!dismissTargetIds?.length) return;
    const result = onDismissReports({
      reportIds: dismissTargetIds,
      reason,
      remarks,
      source: "Dismiss Report",
      dismissedBy: currentUserName,
    });
    setDismissTargetIds(null);
    setSummary(result);
  };

  const menuReport = menuReportId
    ? activeReports.find((report) => report.id === menuReportId) ?? null
    : null;

  return (
    <section className="report-list-page">
      <div className="report-topbar">
        <select defaultValue="All Departments">
          <option>All Departments</option>
        </select>
        <div className="accession-date">
          <label>Accession Date</label>
          <span>1st May, 2026 - 13th May, 2026</span>
          <button type="button">▣</button>
          <button type="button">⚙</button>
        </div>
      </div>

      <div className="report-tabs">
        <button type="button">Patients Waiting List</button>
        <button type="button" className="active">
          Service-wise Waiting List
        </button>
        <button type="button">Instrument-wise Waiting List</button>
      </div>

      <div className="report-search-row">
        <input placeholder="Select by Patient Id / Name / Accession Number / National ID / DOB(DDMMYYYY)" />
        <button type="button">cmd⌘</button>
        <button type="button">⌕</button>
        <button type="button">|||</button>
        <div className="report-search-actions">
          <button type="button">Refresh ⟳</button>
          <button type="button" className="blue">
            Submit All ⓘ
          </button>
          <button type="button" className="blue">
            Work List ▾
          </button>
        </div>
      </div>

      <div className="report-card">
        <div className="rows-count">Rows: {activeReports.length}</div>
        <table>
          <thead>
            <tr>
              {[
                "Accession No",
                "Service",
                "Patient Name",
                "DOB",
                "Provider",
                "Account",
                "Status",
                "Accession Date",
                "Actions",
              ].map((column) => (
                <th key={column} className={column === "Actions" ? "report-actions-col" : undefined}>
                  {column}
                  {column !== "Actions" ? <span className="filter-icon">▼</span> : null}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {activeReports.map((report) => {
              const menuOpen = menuReportId === report.id;
              return (
                <tr
                  key={report.id}
                  onClick={() => onSelectReport(report.id)}
                  onKeyDown={(event) => {
                    if (event.key === "Enter" || event.key === " ") {
                      onSelectReport(report.id);
                    }
                  }}
                  role="button"
                  tabIndex={0}
                >
                  <td>{report.accessionNo}</td>
                  <td>{report.service}</td>
                  <td>
                    <strong>{report.patientName}</strong>
                    <ExceptionTags exceptions={getExceptionsForReport(report)} />
                  </td>
                  <td>{report.dob}</td>
                  <td>{report.provider}</td>
                  <td>{report.account}</td>
                  <td>
                    <span className="report-status">{report.status}</span>
                  </td>
                  <td>{report.accessionDate}</td>
                  <td
                    className="report-actions-col"
                    onClick={(event) => event.stopPropagation()}
                    onKeyDown={(event) => event.stopPropagation()}
                  >
                    <div className="report-actions-wrap">
                      <button
                        type="button"
                        className="report-kebab-btn"
                        aria-label={`Actions for ${report.service}`}
                        aria-haspopup="menu"
                        aria-expanded={menuOpen}
                        ref={(node) => {
                          triggerRefs.current[report.id] = node;
                        }}
                        onClick={(event) => {
                          event.stopPropagation();
                          setMenuReportId((current) => (current === report.id ? null : report.id));
                        }}
                      >
                        <span className="report-kebab-dots" aria-hidden="true">
                          <i />
                          <i />
                          <i />
                        </span>
                      </button>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {menuReport && menuPos
        ? createPortal(
            <div
              ref={menuRef}
              className="report-kebab-menu report-kebab-menu--portal"
              role="menu"
              style={{ top: menuPos.top, left: menuPos.left }}
            >
              {canDismissReports ? (
                <button
                  type="button"
                  role="menuitem"
                  onClick={() => openDismiss([menuReport.id])}
                >
                  Dismiss Report
                </button>
              ) : (
                <span className="report-kebab-empty">No permission to dismiss</span>
              )}
            </div>,
            document.body,
          )
        : null}

      {dismissTargetIds ? (
        <DismissReportModal
          count={dismissTargetIds.length}
          mode="single"
          onClose={() => setDismissTargetIds(null)}
          onConfirm={handleConfirmDismiss}
        />
      ) : null}

      {summary ? <DismissSummaryModal summary={summary} onClose={() => setSummary(null)} /> : null}
    </section>
  );
}
