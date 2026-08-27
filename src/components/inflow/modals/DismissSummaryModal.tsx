import type { DismissReportSummary } from "../../../data/inflow/dismissReport";

type Props = {
  summary: DismissReportSummary;
  onClose: () => void;
};

export function DismissSummaryModal({ summary, onClose }: Props) {
  return (
    <div className="dismiss-report-backdrop" onClick={onClose}>
      <section
        className="dismiss-report-modal dismiss-summary-modal"
        role="dialog"
        aria-modal="true"
        aria-labelledby="dismiss-summary-title"
        onClick={(event) => event.stopPropagation()}
      >
        <button type="button" className="dismiss-report-close" onClick={onClose} aria-label="Close">
          ×
        </button>

        <h2 id="dismiss-summary-title">Dismissal summary</h2>

        <ul className="dismiss-summary-stats">
          <li>
            <span>Total Selected</span>
            <strong>{summary.totalSelected}</strong>
          </li>
          <li>
            <span>Successfully Dismissed</span>
            <strong className="ok">{summary.succeeded.length}</strong>
          </li>
          <li>
            <span>Failed</span>
            <strong className={summary.failed.length ? "fail" : ""}>{summary.failed.length}</strong>
          </li>
        </ul>

        {summary.failed.length > 0 ? (
          <div className="dismiss-summary-failures">
            <h3>Failure reasons</h3>
            <table>
              <thead>
                <tr>
                  <th>Accession</th>
                  <th>Service</th>
                  <th>Patient</th>
                  <th>Reason</th>
                </tr>
              </thead>
              <tbody>
                {summary.failed.map((item) => (
                  <tr key={item.reportId}>
                    <td>{item.accessionNo}</td>
                    <td>{item.service}</td>
                    <td>{item.patientName}</td>
                    <td>{item.reason}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <p className="dismiss-summary-all-ok">All selected tests were dismissed successfully.</p>
        )}

        <footer className="dismiss-report-footer">
          <button type="button" className="primary" onClick={onClose}>
            Close
          </button>
        </footer>
      </section>
    </div>
  );
}
