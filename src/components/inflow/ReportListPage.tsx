import type { PropagatedExceptions } from "../../data/inflow/exceptionTypes";
import type { Report } from "../../data/inflow/mockReports";
import { ExceptionTags } from "./ExceptionTags";

type Props = {
  reports: Report[];
  getExceptionsForReport: (report: Report) => PropagatedExceptions;
  onSelectReport: (reportId: string) => void;
};

export function ReportListPage({ reports, getExceptionsForReport, onSelectReport }: Props) {
  return (
    <section className="report-list-page">
      <div className="report-topbar">
        <select defaultValue="All Departments">
          <option>All Departments</option>
        </select>
        <div className="accession-date">
          <label>Accession Date</label>
          <span>1st May, 2026 - 13th May, 2026</span>
          <button>▣</button>
          <button>⚙</button>
        </div>
      </div>

      <div className="report-tabs">
        <button>Patients Waiting List</button>
        <button className="active">Service-wise Waiting List</button>
        <button>Instrument-wise Waiting List</button>
      </div>

      <div className="report-search-row">
        <input placeholder="Select by Patient Id / Name / Accession Number / National ID / DOB(DDMMYYYY)" />
        <button>cmd⌘</button>
        <button>⌕</button>
        <button>|||</button>
        <span />
        <button>Refresh ⟳</button>
        <button className="blue">Submit All ⓘ</button>
        <button className="blue">Work List ▾</button>
      </div>

      <div className="report-card">
        <div className="rows-count">Rows: 4</div>
        <table>
          <thead>
            <tr>
              {["Accession No", "Service", "Patient Name", "DOB", "Provider", "Account", "Status", "Accession Date", "Actions"].map((column) => (
                <th key={column}>{column}<span className="filter-icon">▼</span></th>
              ))}
              <th />
            </tr>
          </thead>
          <tbody>
            {reports.map((report) => (
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
                <td><span className="report-status">{report.status}</span></td>
                <td>{report.accessionDate}</td>
                <td />
                <td className="kebab">⋮</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
}
