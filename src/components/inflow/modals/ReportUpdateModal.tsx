import type { ExceptionKey } from "../../../data/inflow/mockOrders";
import type { PropagatedExceptions } from "../../../data/inflow/exceptionTypes";
import type { Report } from "../../../data/inflow/mockReports";
import type { RolloutConfig } from "../../../data/inflow/rolloutConfig";
import type { LabTask, TaskUser } from "../../../data/inflow/mockTasks";
import { ExceptionSection } from "../ExceptionSection";

type Props = {
  report: Report;
  exceptions: PropagatedExceptions;
  openTasks: LabTask[];
  taskUnreadCounts: Record<string, number>;
  onClose: () => void;
  onOpenTask: (taskId: string) => void;
  onSetExceptions: (reportId: string, exceptionKeys: ExceptionKey[], comment: string) => void;
  onResolveExceptions: (reportId: string, exceptionKeys: ExceptionKey[], comment: string) => void;
  rolloutConfig: RolloutConfig;
  currentUser: TaskUser;
};

const patientQueue = [
  "Emergency Report",
  "Gulzar Hussain Shaik 75 years - M",
  "Vijaylaxmi Ravada 34 years - F",
  "7th Apr, 2026",
  "Leeladevi Kamalkishore Lohia 62 years - F",
  "Ajay Ramsharan Gupta 46 years - M",
  "Mangala Pramod Sawant 63 years - F",
  "Akshay Dhondu Nachane 13/01/1995 - M",
  "Alpa Jasmin Gada 02/11/1982 - F",
  "Bharti K. Patel 59 years - F",
  "Payal Shailesh Chudasama 48 years - F",
  "Mohammad Yakoob Patel 25 years - M",
];

export function ReportUpdateModal({
  report,
  exceptions,
  openTasks,
  taskUnreadCounts,
  onClose,
  onOpenTask,
  onSetExceptions,
  onResolveExceptions,
  rolloutConfig,
  currentUser,
}: Props) {
  return (
    <div className="report-modal-backdrop">
      <aside className="report-patient-rail">
        <button className="back-button">‹ Back</button>
        <input placeholder="Search Patient Name, ID, Accession" />
        {patientQueue.map((patient) => (
          <div className={`queue-item ${patient.includes("Leeladevi") ? "active" : ""}`} key={patient}>
            {patient}
          </div>
        ))}
      </aside>

      <section className="report-update-modal">
        <div className="report-edit-panel">
          <h1>Update Report Info</h1>
          <div className="test-banner">
            <strong>Routine Examination Urine <span>Not Collected</span></strong>
            <p>Urine - SD000470426 - CLINICAL PATHOLOGY</p>
          </div>

          <div className="dob-grid">
            <label>Date of Birth<select><option>Day</option></select></label>
            <label><span>&nbsp;</span><select><option>Month</option></select></label>
            <label><span>&nbsp;</span><select><option>Year</option></select></label>
            <label>Age<input value={report.age} readOnly /></label>
            <label>Year<select><option>ye...</option></select></label>
          </div>
          <button className="clear-link">Clear</button>

          <label className="full-field">
            Referral Doctor:
            <div className="select-like">Dr. PRADEEP GADGE <span>× ⌕</span></div>
            <em>The referral will be updated for all reports within this bill</em>
          </label>

          <h2>Update Reporting Info</h2>
          <div className="report-date-grid">
            <label>Sample Collection Date<input value={report.sampleDate} readOnly /></label>
            <label>Report Date<input value={report.reportDate} readOnly /></label>
            <label>Sample Accession Date<input value={report.sampleDate} readOnly /></label>
            <label>Approval Date<input value={report.approvalDate} readOnly /></label>
          </div>

          <ExceptionSection
            subjectId={report.id}
            subjectLabel={`Report : #${report.id}`}
            currentLevel="report"
            exceptions={exceptions}
            openTasks={openTasks}
            taskUnreadCounts={taskUnreadCounts}
            rolloutConfig={rolloutConfig}
            account={report.account}
            requesterUser={currentUser}
            onOpenTask={onOpenTask}
            onSetExceptions={(subjectId, exceptionKeys, comment) =>
              onSetExceptions(String(subjectId), exceptionKeys, comment)
            }
            onResolveExceptions={(subjectId, exceptionKeys, comment) =>
              onResolveExceptions(String(subjectId), exceptionKeys, comment)
            }
          />

          <footer className="report-modal-footer">
            <button onClick={onClose}>Close</button>
            <button className="primary">Update Report Info</button>
          </footer>
        </div>

        <aside className="report-info-panel">
          <button className="modal-close report-close" onClick={onClose}>×</button>
          <h3>Mrs. Leeladevi Kamalkishore Lohia (F - 62 years)</h3>
          <p>#577447</p>
          <button className="attachment-button">⌘ 0 Attachments</button>
          <dl>
            <dt>Accession Date</dt>
            <dd>7th Apr, 2026 07:30 am</dd>
            <dt>Bill Date</dt>
            <dd>7th Apr, 2026 07:30 am</dd>
            <dt>Billed By</dt>
            <dd>Tabish Ali</dd>
            <dt>Bill ID</dt>
            <dd>{report.billId}</dd>
            <dt>Sample ID</dt>
            <dd>{report.sampleId}</dd>
            <dt>Order No</dt>
            <dd>{report.orderId}</dd>
            <dt>Organization</dt>
            <dd>{report.organization}<br />Contact : -</dd>
            <dt>Referral Name</dt>
            <dd>Dr. PRADEEP GADGE (-)<br />Contact : -</dd>
          </dl>
        </aside>
      </section>
    </div>
  );
}
