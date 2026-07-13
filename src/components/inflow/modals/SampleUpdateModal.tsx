import { useState } from "react";
import type { ExceptionKey } from "../../../data/inflow/mockOrders";
import type { PropagatedExceptions } from "../../../data/inflow/exceptionTypes";
import type { Sample } from "../../../data/inflow/mockSamples";
import type { RolloutConfig } from "../../../data/inflow/rolloutConfig";
import type { LabTask, TaskUser } from "../../../data/inflow/mockTasks";
import { ExceptionSection } from "../ExceptionSection";
import { UploadBillAttachmentsModal } from "./UploadBillAttachmentsModal";

type Props = {
  sample: Sample;
  exceptions: PropagatedExceptions;
  openTasks: LabTask[];
  taskUnreadCounts: Record<string, number>;
  onClose: () => void;
  onOpenTask: (taskId: string) => void;
  onSetExceptions: (sampleId: string, exceptionKeys: ExceptionKey[], comment: string) => void;
  onResolveExceptions: (sampleId: string, exceptionKeys: ExceptionKey[], comment: string) => void;
  rolloutConfig: RolloutConfig;
  currentUser: TaskUser;
};

export function SampleUpdateModal({
  sample,
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
  const [uploadModalOpen, setUploadModalOpen] = useState(false);

  return (
    <div className="sample-modal-backdrop">
      <aside className="sample-side-nav">
        <div className="aspira-logo">ASPIRA</div>
        <div className="sample-user">Hello Operations Manager<br />#343 - Aspira Diagnostic</div>
        {["Accession", "Pending Accession", "Pending Collection", "Accessioned", "Rejected Samples", "Accession Settings", "Advanced Search"].map((item) => (
          <div className={`sample-nav-item ${item === "Pending Accession" ? "active" : ""}`} key={item}>
            {item}
          </div>
        ))}
        <div className="more-label">MORE INFO</div>
        {["Updates", "Video Tutorial", "Support", "English"].map((item) => (
          <div className="sample-nav-item" key={item}>{item}</div>
        ))}
        <button className="collapse-button">‹ Collapse</button>
      </aside>

      <section className="sample-update-modal">
        <div className="sample-edit-panel">
          <h1>Update Sample Info</h1>
          <div className="sample-tabs-inner">
            <button className="active">Sample Info</button>
            <button>Clinical Info</button>
          </div>

          <h2>Sample Details</h2>
          <div className="sample-detail-card">
            <div><strong>Urine</strong><span>SD000470426</span></div>
            <div><span className="blue-dot" /> Blue Cap Non Sterile Container</div>
          </div>

          <h2>Test Details</h2>
          <div className="sample-test-grid">
            <label>Test Name<input value="Routine Examination Urine   Not Collected" readOnly /></label>
          </div>

          <h2>Sample Info</h2>
          <div className="sample-date-grid">
            <label>Sample Collection Date<input value="07/04/2026 07:30 AM" readOnly /></label>
            <label>Sample Accession Date<input value="07/04/2026 07:30 AM" readOnly /></label>
          </div>
          <p className="sample-note">Note: This will update sample in outsource centre.</p>
          <label className="manual-id">Manual Sample ID<input /></label>

          <ExceptionSection
            subjectId={sample.id}
            subjectLabel={`Sample : ${sample.parentSampleId ?? sample.id}`}
            currentLevel="sample"
            exceptions={exceptions}
            openTasks={openTasks}
            taskUnreadCounts={taskUnreadCounts}
            rolloutConfig={rolloutConfig}
            account={sample.accountName}
            requesterUser={currentUser}
            onOpenTask={onOpenTask}
            onSetExceptions={(subjectId, exceptionKeys, comment) =>
              onSetExceptions(String(subjectId), exceptionKeys, comment)
            }
            onResolveExceptions={(subjectId, exceptionKeys, comment) =>
              onResolveExceptions(String(subjectId), exceptionKeys, comment)
            }
          />

          <h2>Bill Comments <button>Add Comment</button></h2>
          <div className="bill-comments" />
          <h2>Bill Attachments</h2>
          <button className="attachment-plus" onClick={() => setUploadModalOpen(true)}>+</button>

          <footer className="sample-modal-footer">
            <button>Print TRF</button>
            <button>Bill Updates</button>
            <span />
            <button onClick={onClose}>Close</button>
            <button className="collect">Collect</button>
            <button className="primary">Update & Receive</button>
          </footer>
        </div>

        <aside className="report-info-panel sample-info-panel">
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
            <dd>{sample.billId}</dd>
            <dt>Sample ID</dt>
            <dd>{sample.parentSampleId ?? sample.id}</dd>
            <dt>Order No</dt>
            <dd>{sample.orderId}</dd>
            <dt>Organization</dt>
            <dd>{sample.organization}<br />Contact : -</dd>
            <dt>Referral Name</dt>
            <dd>Dr. PRADEEP GADGE (-)<br />Contact : -</dd>
          </dl>
        </aside>
      </section>

      <UploadBillAttachmentsModal
        open={uploadModalOpen}
        patientName="postpaid refund"
        billId={sample.billId ?? "8153"}
        billDate="Jun 12th, 2026"
        labId={1}
        onClose={() => setUploadModalOpen(false)}
      />
    </div>
  );
}
