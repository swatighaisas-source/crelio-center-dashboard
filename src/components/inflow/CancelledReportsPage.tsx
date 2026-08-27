import { useMemo } from "react";
import type { Report } from "../../data/inflow/mockReports";

type Props = {
  reports: Report[];
  canRestoreReports: boolean;
  onRestoreReport: (reportId: string) => { ok: boolean; reason?: string };
};

function formatDismissedAt(iso: string | undefined) {
  if (!iso) return "—";
  const date = new Date(iso);
  if (Number.isNaN(date.getTime())) return iso;
  return date.toLocaleString();
}

/** Operations → Cancelled Reports: dismissed reports with restore. */
export function CancelledReportsPage({ reports, canRestoreReports, onRestoreReport }: Props) {
  const cancelledReports = useMemo(
    () =>
      reports
        .filter((report) => report.status === "Dismissed" || Boolean(report.dismissal))
        .slice()
        .sort((a, b) => {
          const aTime = a.dismissal?.dismissedAt ?? "";
          const bTime = b.dismissal?.dismissedAt ?? "";
          return bTime.localeCompare(aTime);
        }),
    [reports],
  );

  return (
    <section className="report-list-page cancelled-reports-page">
      <div className="dismiss-page-header">
        <div>
          <h1>Cancelled Reports</h1>
          <p>All dismissed reports. Restore a report to return it to the Waiting List.</p>
        </div>
      </div>

      <div className="report-card">
        <div className="rows-count">Rows: {cancelledReports.length}</div>
        <table>
          <thead>
            <tr>
              {[
                "Accession No",
                "Service",
                "Patient Name",
                "Account",
                "Dismiss Reason",
                "Dismissed By",
                "Dismissed At",
                "Source",
                "Actions",
              ].map((column) => (
                <th key={column}>{column}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {cancelledReports.map((report) => (
              <tr key={report.id}>
                <td>{report.accessionNo}</td>
                <td>{report.service}</td>
                <td>
                  <strong>{report.patientName}</strong>
                </td>
                <td>{report.account}</td>
                <td>{report.dismissal?.reason || "—"}</td>
                <td>{report.dismissal?.dismissedBy || "—"}</td>
                <td>{formatDismissedAt(report.dismissal?.dismissedAt)}</td>
                <td>{report.dismissal?.source || "—"}</td>
                <td className="report-actions-col">
                  <button
                    type="button"
                    className="restore-report-btn"
                    disabled={!canRestoreReports}
                    title={
                      canRestoreReports
                        ? "Restore this report to the Waiting List"
                        : "You do not have permission to restore reports"
                    }
                    onClick={() => {
                      const result = onRestoreReport(report.id);
                      if (!result.ok && result.reason) {
                        window.alert(result.reason);
                      }
                    }}
                  >
                    Restore
                  </button>
                </td>
              </tr>
            ))}
            {cancelledReports.length === 0 ? (
              <tr>
                <td colSpan={9} className="dismiss-empty-cell">
                  No cancelled reports yet.
                </td>
              </tr>
            ) : null}
          </tbody>
        </table>
      </div>
    </section>
  );
}
