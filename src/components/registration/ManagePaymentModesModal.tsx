import { useEffect, useMemo, useRef, useState } from "react";
import { useAccountManagement } from "../../context/AccountManagementContext";
import { usePaymentModes } from "../../context/PaymentModesContext";
import {
  createEmptyCustomPaymentMode,
  FIELD_REQUIREMENT_OPTIONS,
  formatPaymentModeLabel,
  paymentModesMatch,
  type FieldRequirement,
  type PaymentModeRow,
} from "../../data/paymentModes";
import { PaymentModeTransferModal } from "./PaymentModeTransferModal";

interface Props {
  labId: number;
  open: boolean;
  onClose: () => void;
}

interface PendingDisable {
  rowId: string;
  modeName: string;
}

function TrashIcon() {
  return (
    <svg viewBox="0 0 16 16" width="15" height="15" fill="none" aria-hidden>
      <path
        d="M3.5 5.5h9M6 5.5V4.5a1 1 0 011-1h2a1 1 0 011 1v1M5.5 5.5l.5 7h4l.5-7"
        stroke="currentColor"
        strokeWidth="1.1"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function TableToggle({
  on,
  onChange,
  label,
}: {
  on: boolean;
  onChange: (value: boolean) => void;
  label: string;
}) {
  return (
    <button
      type="button"
      className={`pay-modes-toggle${on ? " pay-modes-toggle--on" : ""}`}
      aria-pressed={on}
      aria-label={label}
      onClick={() => onChange(!on)}
    >
      <span className="pay-modes-toggle__knob" />
    </button>
  );
}

function RequirementSelect({
  value,
  onChange,
  label,
}: {
  value: FieldRequirement;
  onChange: (value: FieldRequirement) => void;
  label: string;
}) {
  return (
    <select
      className="pay-modes-table__select"
      value={value}
      aria-label={label}
      onChange={(e) => onChange(e.target.value as FieldRequirement)}
    >
      {FIELD_REQUIREMENT_OPTIONS.map((option) => (
        <option key={option.value} value={option.value}>
          {option.label}
        </option>
      ))}
    </select>
  );
}

export function ManagePaymentModesModal({ labId, open, onClose }: Props) {
  const { paymentModes, savePaymentModes } = usePaymentModes(labId);
  const { getAccountsWithDefaultPaymentMode, transferDefaultPaymentModeForAccounts } =
    useAccountManagement(labId);
  const [rows, setRows] = useState<PaymentModeRow[]>(paymentModes);
  const [pendingDisable, setPendingDisable] = useState<PendingDisable | null>(null);
  const scrollToRowIdRef = useRef<string | null>(null);
  const wasOpenRef = useRef(false);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (pendingDisable) return;
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, onClose, pendingDisable]);

  useEffect(() => {
    if (open && !wasOpenRef.current) {
      setRows(paymentModes);
      scrollToRowIdRef.current = null;
      setPendingDisable(null);
    }
    wasOpenRef.current = open;
  }, [open, paymentModes]);

  useEffect(() => {
    const rowId = scrollToRowIdRef.current;
    if (!rowId) return;

    const rowEl = document.getElementById(`pay-mode-row-${rowId}`);
    if (!rowEl) return;

    scrollToRowIdRef.current = null;
    rowEl.scrollIntoView({ block: "nearest", behavior: "smooth" });
    rowEl.querySelector<HTMLInputElement>(".pay-modes-table__name-input")?.focus();
  }, [rows]);

  const transferEnabledModeOptions = useMemo(() => {
    if (!pendingDisable) return [];
    return rows
      .filter(
        (row) =>
          row.showToLab &&
          row.name.trim() &&
          !paymentModesMatch(row.name, pendingDisable.modeName),
      )
      .map((row) => ({
        value: row.name.trim(),
        label: formatPaymentModeLabel(row.name.trim()),
      }));
  }, [pendingDisable, rows]);

  const affectedOrgs = useMemo(() => {
    if (!pendingDisable) return [];
    return getAccountsWithDefaultPaymentMode(pendingDisable.modeName);
  }, [pendingDisable, getAccountsWithDefaultPaymentMode]);

  if (!open) return null;

  function updateRow(id: string, patch: Partial<PaymentModeRow>) {
    setRows((prev) => prev.map((row) => (row.id === id ? { ...row, ...patch } : row)));
  }

  function handleVisibilityChange(row: PaymentModeRow, visible: boolean) {
    if (visible) {
      updateRow(row.id, { showToLab: true });
      return;
    }

    const modeName = row.name.trim();
    if (!modeName) {
      updateRow(row.id, { showToLab: false });
      return;
    }

    const orgsWithDefault = getAccountsWithDefaultPaymentMode(modeName);
    if (orgsWithDefault.length === 0) {
      updateRow(row.id, { showToLab: false });
      return;
    }

    setPendingDisable({ rowId: row.id, modeName });
  }

  function handleTransferCancel() {
    setPendingDisable(null);
  }

  function handleTransfer(accountIds: string[], newMode: string) {
    if (!pendingDisable) return;
    transferDefaultPaymentModeForAccounts(accountIds, newMode);
    updateRow(pendingDisable.rowId, { showToLab: false });
    setPendingDisable(null);
  }

  function handleDelete(id: string) {
    setRows((prev) => prev.filter((row) => row.id !== id));
  }

  function handleAddAnother() {
    const newRow = createEmptyCustomPaymentMode();
    scrollToRowIdRef.current = newRow.id;
    setRows((prev) => [...prev, newRow]);
  }

  function handleSave() {
    savePaymentModes(rows);
    onClose();
  }

  return (
    <>
      <div className="pay-modes-overlay" role="presentation" onClick={onClose}>
        <div
          className="pay-modes-modal"
          role="dialog"
          aria-labelledby="pay-modes-title"
          aria-modal="true"
          onClick={(e) => e.stopPropagation()}
        >
          <header className="pay-modes-modal__header">
            <h2 id="pay-modes-title" className="pay-modes-modal__title">
              Manage Payment Modes
            </h2>
            <button
              type="button"
              className="pay-modes-modal__close"
              onClick={onClose}
              aria-label="Close"
            >
              ×
            </button>
          </header>

          <div className="pay-modes-modal__body">
            <div className="pay-modes-master">
              <div className="pay-modes-master__toolbar">
                <span className="pay-modes-master__count">Rows: {rows.length}</span>
              </div>

              <div className="pay-modes-table-wrap">
                <table className="pay-modes-table">
                  <colgroup>
                    <col className="pay-modes-table__col-mode" />
                    <col className="pay-modes-table__col-transaction" />
                    <col className="pay-modes-table__col-bank" />
                    <col className="pay-modes-table__col-visible" />
                    <col className="pay-modes-table__col-actions" />
                  </colgroup>
                  <thead>
                    <tr>
                      <th className="pay-modes-table__col-mode">Payment Mode</th>
                      <th className="pay-modes-table__col-transaction">Transaction ID</th>
                      <th className="pay-modes-table__col-bank">Bank Details/Comments</th>
                      <th className="pay-modes-table__col-visible">Visible</th>
                      <th className="pay-modes-table__actions-col" aria-label="Actions" />
                    </tr>
                  </thead>
                  <tbody>
                    {rows.map((row) => (
                      <tr key={row.id} id={`pay-mode-row-${row.id}`}>
                        <td className="pay-modes-table__col-mode">
                          {row.isCustom ? (
                            <input
                              type="text"
                              className="pay-modes-table__name-input"
                              value={row.name}
                              placeholder="Enter payment mode"
                              aria-label="Payment mode name"
                              onChange={(e) => updateRow(row.id, { name: e.target.value })}
                            />
                          ) : (
                            row.name
                          )}
                        </td>
                        <td className="pay-modes-table__col-transaction">
                          <RequirementSelect
                            value={row.transactionId}
                            onChange={(value) => updateRow(row.id, { transactionId: value })}
                            label={`Transaction ID requirement for ${row.name || "payment mode"}`}
                          />
                        </td>
                        <td className="pay-modes-table__col-bank">
                          <RequirementSelect
                            value={row.bankDetailsComments}
                            onChange={(value) =>
                              updateRow(row.id, { bankDetailsComments: value })
                            }
                            label={`Bank Details/Comments requirement for ${row.name || "payment mode"}`}
                          />
                        </td>
                        <td className="pay-modes-table__col-visible">
                          <TableToggle
                            on={row.showToLab}
                            onChange={(value) => handleVisibilityChange(row, value)}
                            label={`${row.name || "Payment mode"} visible`}
                          />
                        </td>
                        <td className="pay-modes-table__actions-col">
                          {row.isCustom ? (
                            <button
                              type="button"
                              className="pay-modes-table__delete"
                              aria-label={`Delete ${row.name || "payment mode"}`}
                              onClick={() => handleDelete(row.id)}
                            >
                              <TrashIcon />
                            </button>
                          ) : null}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              <footer className="pay-modes-master__footer">
                <div className="pay-modes-master__footer-row">
                  <button
                    type="button"
                    className="pay-modes-btn pay-modes-btn--outline"
                    onClick={handleAddAnother}
                  >
                    Add another
                  </button>
                </div>
                <div className="pay-modes-master__footer-row pay-modes-master__footer-row--actions">
                  <button
                    type="button"
                    className="pay-modes-btn pay-modes-btn--secondary"
                    onClick={onClose}
                  >
                    Cancel
                  </button>
                  <button
                    type="button"
                    className="pay-modes-btn pay-modes-btn--primary"
                    onClick={handleSave}
                  >
                    Save
                  </button>
                </div>
              </footer>
            </div>
          </div>
        </div>
      </div>

      {pendingDisable ? (
        <PaymentModeTransferModal
          disabledModeName={pendingDisable.modeName}
          affectedOrgs={affectedOrgs}
          enabledModeOptions={transferEnabledModeOptions}
          onTransfer={handleTransfer}
          onCancel={handleTransferCancel}
        />
      ) : null}
    </>
  );
}
