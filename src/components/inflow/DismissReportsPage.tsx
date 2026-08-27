import { useEffect, useMemo, useState } from "react";
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

/** Operations → Dismiss Reports: select active tests and bulk dismiss. */
export function DismissReportsPage({
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

  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [dismissTargetIds, setDismissTargetIds] = useState<string[] | null>(null);
  const [summary, setSummary] = useState<DismissReportSummary | null>(null);
  const [searchQuery, setSearchQuery] = useState("");

  const filteredReports = useMemo(() => {
    const query = searchQuery.trim().toLowerCase();
    if (!query) return activeReports;
    return activeReports.filter((report) => {
      const haystack = [
        report.accessionNo,
        report.service,
        report.patientName,
        report.account,
        report.billId,
        report.organization,
      ]
        .join(" ")
        .toLowerCase();
      return haystack.includes(query);
    });
  }, [activeReports, searchQuery]);

  useEffect(() => {
    setSelectedIds((current) =>
      current.filter((id) => filteredReports.some((report) => report.id === id)),
    );
  }, [filteredReports]);

  const selectedSet = useMemo(() => new Set(selectedIds), [selectedIds]);
  const allSelected =
    filteredReports.length > 0 && filteredReports.every((report) => selectedSet.has(report.id));

  const toggleAll = () => {
    setSelectedIds(allSelected ? [] : filteredReports.map((report) => report.id));
  };

  const toggleOne = (reportId: string) => {
    setSelectedIds((current) =>
      current.includes(reportId)
        ? current.filter((id) => id !== reportId)
        : [...current, reportId],
    );
  };

  const handleConfirmDismiss = ({ reason, remarks }: { reason: string; remarks: string }) => {
    if (!dismissTargetIds?.length) return;
    const result = onDismissReports({
      reportIds: dismissTargetIds,
      reason,
      remarks,
      source: "Bulk Dismiss",
      dismissedBy: currentUserName,
    });
    setDismissTargetIds(null);
    setSelectedIds((current) => current.filter((id) => !dismissTargetIds.includes(id)));
    setSummary(result);
  };

  return (
    <section className="report-list-page dismiss-reports-page">
      <div className="op-page-header dismiss-reports-filters">
        <div className="op-page-header__left">
          <label className="op-select-wrap">
            <span className="visually-hidden">Department</span>
            <select className="op-select" defaultValue="all" aria-label="All Departments">
              <option value="all">All Departments</option>
              <option value="pathology">Pathology</option>
              <option value="radiology">Radiology</option>
              <option value="molecular">Molecular</option>
            </select>
            <span className="op-select__chevron" aria-hidden>
              <svg viewBox="0 0 12 8" width="10" height="7" fill="none">
                <path
                  d="M1.5 1.5L6 6l4.5-4.5"
                  stroke="currentColor"
                  strokeWidth="1.3"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </span>
          </label>
        </div>

        <div className="op-page-header__right">
          <label className="op-select-wrap op-select-wrap--branches">
            <span className="visually-hidden">Branches</span>
            <select className="op-select" defaultValue="selected" aria-label="Select Branches">
              <option value="selected">Select Branches: 134 Selected</option>
              <option value="all">All Branches</option>
              <option value="main">Main Branch</option>
            </select>
            <span className="op-select__chevron" aria-hidden>
              <svg viewBox="0 0 12 8" width="10" height="7" fill="none">
                <path
                  d="M1.5 1.5L6 6l4.5-4.5"
                  stroke="currentColor"
                  strokeWidth="1.3"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </span>
          </label>

          <div className="dismiss-reports-date">
            <span className="op-page-header__date-label">Latest Updated</span>
            <button type="button" className="op-date-range">
              1st Aug, 2026 - 7th Aug, 2026
              <svg viewBox="0 0 16 16" width="14" height="14" fill="none" aria-hidden>
                <rect x="2" y="3" width="12" height="11" rx="1.5" stroke="currentColor" strokeWidth="1.2" />
                <path
                  d="M2 6h12M5 1.5V4M11 1.5V4"
                  stroke="currentColor"
                  strokeWidth="1.2"
                  strokeLinecap="round"
                />
              </svg>
            </button>
          </div>
        </div>
      </div>

      <div className="dismiss-page-header">
        <div>
          <h1>Dismiss Reports</h1>
          <p>Select one or more tests to dismiss. This uses the same dismissal workflow as Waiting List.</p>
        </div>
        {canDismissReports ? (
          <button
            type="button"
            className="blue bulk-dismiss-btn"
            disabled={selectedIds.length === 0}
            onClick={() => {
              if (selectedIds.length === 0) return;
              setDismissTargetIds(selectedIds);
            }}
          >
            Bulk Dismiss{selectedIds.length > 0 ? ` (${selectedIds.length})` : ""}
          </button>
        ) : (
          <p className="dismiss-page-permission">You do not have permission to dismiss reports.</p>
        )}
      </div>

      <div className="op-toolbar dismiss-reports-search">
        <div className="op-toolbar__search-wrap">
          <input
            type="search"
            className="op-toolbar__search"
            placeholder="Select by Patient Id / Name / Accession Number / National ID / DOB(DDMMYYYY)"
            aria-label="Search reports to dismiss"
            value={searchQuery}
            onChange={(event) => setSearchQuery(event.target.value)}
          />
          <span className="op-toolbar__shortcut">cmd+j</span>
          <button type="button" className="op-toolbar__search-btn" aria-label="Search">
            <svg viewBox="0 0 16 16" width="15" height="15" fill="none" aria-hidden>
              <circle cx="7" cy="7" r="4.5" stroke="currentColor" strokeWidth="1.3" />
              <path d="M10.5 10.5L14 14" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" />
            </svg>
          </button>
          <span className="op-toolbar__search-divider" aria-hidden />
          <button type="button" className="op-toolbar__barcode-btn" aria-label="Scan barcode">
            <svg viewBox="0 0 16 16" width="15" height="15" fill="none" aria-hidden>
              <path
                d="M2 3h1.2v10H2V3zm2.2 0h.8v10h-.8V3zm1.6 0h1.2v10H5.8V3zm2 0h.6v10h-.6V3zm1.4 0h1v10h-1V3zm1.8 0h.5v10h-.5V3zm1.2 0H14v10h-1.2V3z"
                fill="currentColor"
              />
            </svg>
          </button>
        </div>
      </div>

      <div className="report-card">
        <div className="rows-count">Rows: {filteredReports.length}</div>
        <table>
          <thead>
            <tr>
              {canDismissReports ? (
                <th className="report-select-col">
                  <input
                    type="checkbox"
                    checked={allSelected}
                    onChange={toggleAll}
                    aria-label="Select all tests"
                    disabled={!canDismissReports}
                  />
                </th>
              ) : null}
              {["Accession No", "Service", "Patient Name", "Account", "Status", "Accession Date"].map(
                (column) => (
                  <th key={column}>{column}</th>
                ),
              )}
            </tr>
          </thead>
          <tbody>
            {filteredReports.map((report) => {
              const selected = selectedSet.has(report.id);
              return (
                <tr
                  key={report.id}
                  className={selected ? "report-row-selected" : undefined}
                  onClick={() => onSelectReport(report.id)}
                >
                  {canDismissReports ? (
                    <td
                      className="report-select-col"
                      onClick={(event) => event.stopPropagation()}
                    >
                      <input
                        type="checkbox"
                        checked={selected}
                        onChange={() => toggleOne(report.id)}
                        aria-label={`Select ${report.service}`}
                      />
                    </td>
                  ) : null}
                  <td>{report.accessionNo}</td>
                  <td>{report.service}</td>
                  <td>
                    <strong>{report.patientName}</strong>
                    <ExceptionTags exceptions={getExceptionsForReport(report)} />
                  </td>
                  <td>{report.account}</td>
                  <td>
                    <span className="report-status">{report.status}</span>
                  </td>
                  <td>{report.accessionDate}</td>
                </tr>
              );
            })}
            {filteredReports.length === 0 ? (
              <tr>
                <td colSpan={canDismissReports ? 7 : 6} className="dismiss-empty-cell">
                  {searchQuery.trim()
                    ? "No reports match your search."
                    : "No active reports available to dismiss."}
                </td>
              </tr>
            ) : null}
          </tbody>
        </table>
      </div>

      {dismissTargetIds ? (
        <DismissReportModal
          count={dismissTargetIds.length}
          mode="bulk"
          onClose={() => setDismissTargetIds(null)}
          onConfirm={handleConfirmDismiss}
        />
      ) : null}

      {summary ? <DismissSummaryModal summary={summary} onClose={() => setSummary(null)} /> : null}
    </section>
  );
}
