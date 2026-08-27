import { useState } from "react";
import { DISMISS_REPORT_REASONS } from "../../../data/inflow/dismissReport";

type Props = {
  count: number;
  mode: "single" | "bulk";
  onClose: () => void;
  onConfirm: (payload: { reason: string; remarks: string }) => void;
};

export function DismissReportModal({ count, mode, onClose, onConfirm }: Props) {
  const [reason, setReason] = useState("");
  const [remarks, setRemarks] = useState("");
  const [showContinueConfirm, setShowContinueConfirm] = useState(false);

  const title =
    mode === "bulk"
      ? `You are about to dismiss ${count} test${count === 1 ? "" : "s"}.`
      : "You are about to dismiss this test.";

  const canConfirm = reason.trim().length > 0;

  const handlePrimaryClick = () => {
    if (!canConfirm) return;
    setShowContinueConfirm(true);
  };

  const handleYes = () => {
    onConfirm({ reason: reason.trim(), remarks: remarks.trim() });
  };

  const handleNo = () => {
    onClose();
  };

  return (
    <div className="dismiss-report-backdrop" onClick={showContinueConfirm ? undefined : onClose}>
      <section
        className="dismiss-report-modal"
        role="dialog"
        aria-modal="true"
        aria-labelledby="dismiss-report-title"
        onClick={(event) => event.stopPropagation()}
      >
        <button type="button" className="dismiss-report-close" onClick={onClose} aria-label="Close">
          ×
        </button>

        <h2 id="dismiss-report-title">{title}</h2>

        <div className="dismiss-report-warning" role="alert">
          <strong>Warning</strong>
          <ul>
            <li>Any generated reports for these tests will be dismissed.</li>
            <li>The corresponding test charges will be deducted from the patient&apos;s bill.</li>
            {mode === "bulk" ? (
              <li>
                This report and all the associated inventory, outsource will be completely removed
                from the system.
              </li>
            ) : null}
          </ul>
          <p>This action cannot be undone.</p>
        </div>

        <label className="dismiss-report-field">
          <span>
            Dismiss Reason <em>*</em>
          </span>
          <select
            value={reason}
            onChange={(event) => setReason(event.target.value)}
            aria-required="true"
            disabled={showContinueConfirm}
          >
            <option value="">Select dismiss reason</option>
            {DISMISS_REPORT_REASONS.map((item) => (
              <option key={item} value={item}>
                {item}
              </option>
            ))}
          </select>
        </label>

        <label className="dismiss-report-field">
          <span>Remarks</span>
          <textarea
            placeholder="Enter remarks (optional)"
            value={remarks}
            onChange={(event) => setRemarks(event.target.value)}
            rows={3}
            disabled={showContinueConfirm}
          />
        </label>

        <footer className="dismiss-report-footer">
          <button type="button" onClick={onClose} disabled={showContinueConfirm}>
            Cancel
          </button>
          <button
            type="button"
            className="primary"
            disabled={!canConfirm || showContinueConfirm}
            onClick={handlePrimaryClick}
          >
            {mode === "bulk" ? "Dismiss Tests" : "Dismiss Report"}
          </button>
        </footer>
      </section>

      {showContinueConfirm ? (
        <div
          className="dismiss-continue-overlay"
          role="presentation"
          onClick={(event) => event.stopPropagation()}
        >
          <section
            className="dismiss-confirm-mini"
            role="alertdialog"
            aria-modal="true"
            aria-labelledby="dismiss-continue-title"
          >
            <h2 id="dismiss-continue-title">Confirm Dismissal</h2>
            <p>Do you want to continue dismissing selected reports?</p>
            <footer className="dismiss-confirm-mini-footer">
              <button type="button" onClick={handleNo}>
                No
              </button>
              <button type="button" className="primary" onClick={handleYes}>
                Yes
              </button>
            </footer>
          </section>
        </div>
      ) : null}
    </div>
  );
}
