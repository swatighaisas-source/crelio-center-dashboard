import { useCallback, useEffect, useRef, useState } from "react";
import { useOrderPaymentList } from "../../context/OrderPaymentListContext";
import { usePaymentModes } from "../../context/PaymentModesContext";
import {
  fieldRequirementPlaceholder,
  formatPaymentModeLabel,
  getPaymentFieldErrors,
  getPaymentModeRequirements,
  hasPaymentFieldErrors,
  type PaymentFieldErrors,
} from "../../data/paymentModes";
import {
  buildEntryModeOptions,
  createDefaultPaymentListEntries,
  createEmptyPaymentListDraft,
  type PaymentListDraft,
  type PaymentListEntry,
} from "../../data/paymentList";

interface Props {
  labId: number;
  orderId: number;
  open: boolean;
  onClose: () => void;
  onSave?: (entries: PaymentListEntry[]) => void;
  initialEntries?: PaymentListEntry[];
  prefillMode?: string;
  stacked?: boolean;
}

type FieldErrorMap = Record<string, PaymentFieldErrors>;

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

function PlusIcon() {
  return (
    <svg viewBox="0 0 16 16" width="14" height="14" fill="none" aria-hidden>
      <path d="M8 3.5v9M3.5 8h9" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" />
    </svg>
  );
}

function MinusIcon() {
  return (
    <svg viewBox="0 0 16 16" width="14" height="14" fill="none" aria-hidden>
      <path d="M3.5 8h9" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" />
    </svg>
  );
}

function PaymentDetailInputs({
  transactionId,
  bankDetailsComments,
  transactionPlaceholder,
  bankPlaceholder,
  errors,
  onTransactionIdChange,
  onBankDetailsChange,
  transactionAriaLabel,
  bankAriaLabel,
}: {
  transactionId: string;
  bankDetailsComments: string;
  transactionPlaceholder: string;
  bankPlaceholder: string;
  errors?: PaymentFieldErrors;
  onTransactionIdChange: (value: string) => void;
  onBankDetailsChange: (value: string) => void;
  transactionAriaLabel: string;
  bankAriaLabel: string;
}) {
  return (
    <>
      <td>
        <input
          type="text"
          className={`pay-list-table__input${
            errors?.transactionId ? " pay-list-table__input--error" : ""
          }`}
          value={transactionId}
          placeholder={transactionPlaceholder}
          aria-label={transactionAriaLabel}
          aria-invalid={errors?.transactionId ? true : undefined}
          onChange={(e) => onTransactionIdChange(e.target.value)}
        />
      </td>
      <td>
        <input
          type="text"
          className={`pay-list-table__input${
            errors?.bankDetailsComments ? " pay-list-table__input--error" : ""
          }`}
          value={bankDetailsComments}
          placeholder={bankPlaceholder}
          aria-label={bankAriaLabel}
          aria-invalid={errors?.bankDetailsComments ? true : undefined}
          onChange={(e) => onBankDetailsChange(e.target.value)}
        />
      </td>
    </>
  );
}

function draftHasContent(draft: PaymentListDraft): boolean {
  return Boolean(
    draft.paymentMode.trim() ||
      draft.transactionId.trim() ||
      draft.bankDetailsComments.trim() ||
      draft.amount.trim(),
  );
}

export function PaymentListModal({
  labId,
  orderId,
  open,
  onClose,
  onSave,
  initialEntries,
  prefillMode,
  stacked,
}: Props) {
  const { paymentModes, visiblePaymentModeOptions } = usePaymentModes(labId);
  const { savedPayments, saveOrderPayments } = useOrderPaymentList(labId, orderId);
  const [entries, setEntries] = useState<PaymentListEntry[]>([]);
  const [draft, setDraft] = useState<PaymentListDraft>(() => createEmptyPaymentListDraft());
  const [fieldErrors, setFieldErrors] = useState<FieldErrorMap>({});
  const wasOpenRef = useRef(false);

  const defaultMode = visiblePaymentModeOptions[0]?.value ?? "";
  const showTable =
    visiblePaymentModeOptions.length > 0 ||
    entries.length > 0 ||
    (open && savedPayments.length > 0);

  const attemptClose = useCallback(() => {
    const nextErrors: FieldErrorMap = {};
    let hasErrors = false;

    for (const entry of entries) {
      const rowErrors = getPaymentFieldErrors(
        paymentModes,
        entry.paymentMode,
        entry.transactionId,
        entry.bankDetailsComments,
      );
      if (hasPaymentFieldErrors(rowErrors)) {
        nextErrors[entry.id] = rowErrors;
        hasErrors = true;
      }
    }

    if (draftHasContent(draft)) {
      const draftErrors = getPaymentFieldErrors(
        paymentModes,
        draft.paymentMode || defaultMode,
        draft.transactionId,
        draft.bankDetailsComments,
      );
      if (hasPaymentFieldErrors(draftErrors)) {
        nextErrors.draft = draftErrors;
        hasErrors = true;
      }
    }

    if (hasErrors) {
      setFieldErrors(nextErrors);
      return;
    }

    let finalEntries = entries;
    if (draftHasContent(draft)) {
      finalEntries = [
        ...entries,
        {
          id: `entry-${Date.now()}`,
          paymentMode: draft.paymentMode || defaultMode,
          transactionId: draft.transactionId,
          bankDetailsComments: draft.bankDetailsComments,
          amount: draft.amount || "0.0",
        },
      ];
    }

    saveOrderPayments(finalEntries);
    onSave?.(finalEntries);
    setFieldErrors({});
    onClose();
  }, [defaultMode, draft, entries, onClose, onSave, paymentModes, saveOrderPayments]);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") attemptClose();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, attemptClose]);

  useEffect(() => {
    if (!open) {
      wasOpenRef.current = false;
      return;
    }
    if (wasOpenRef.current) return;
    wasOpenRef.current = true;

    let initial: PaymentListEntry[];
    if (savedPayments.length > 0) {
      initial = savedPayments;
    } else if (initialEntries && initialEntries.length > 0) {
      initial = initialEntries;
      saveOrderPayments(initialEntries);
    } else if (prefillMode) {
      initial = [];
    } else if (defaultMode) {
      initial = createDefaultPaymentListEntries(defaultMode);
    } else {
      initial = [];
    }

    setEntries(initial);
    setDraft(
      prefillMode
        ? { ...createEmptyPaymentListDraft(), paymentMode: prefillMode }
        : createEmptyPaymentListDraft(),
    );
    setFieldErrors({});
  }, [open, defaultMode, initialEntries, prefillMode, savedPayments, saveOrderPayments]);

  useEffect(() => {
    if (!open || !prefillMode) return;
    setDraft((prev) =>
      prev.paymentMode === prefillMode ? prev : { ...prev, paymentMode: prefillMode },
    );
  }, [open, prefillMode]);

  if (!open) return null;

  function clearFieldError(rowKey: string, field: keyof PaymentFieldErrors) {
    setFieldErrors((prev) => {
      const current = prev[rowKey];
      if (!current?.[field]) return prev;
      const nextRow = { ...current, [field]: false };
      if (!nextRow.transactionId && !nextRow.bankDetailsComments) {
        const { [rowKey]: _removed, ...rest } = prev;
        return rest;
      }
      return { ...prev, [rowKey]: nextRow };
    });
  }

  function updateEntry(id: string, patch: Partial<PaymentListEntry>) {
    setEntries((prev) => prev.map((entry) => (entry.id === id ? { ...entry, ...patch } : entry)));
    if (patch.transactionId !== undefined) clearFieldError(id, "transactionId");
    if (patch.bankDetailsComments !== undefined) clearFieldError(id, "bankDetailsComments");
    if (patch.paymentMode !== undefined) {
      setFieldErrors((prev) => {
        const { [id]: _removed, ...rest } = prev;
        return rest;
      });
    }
  }

  function deleteEntry(id: string) {
    setEntries((prev) => prev.filter((entry) => entry.id !== id));
    setFieldErrors((prev) => {
      const { [id]: _removed, ...rest } = prev;
      return rest;
    });
  }

  function updateDraft(patch: Partial<PaymentListDraft>) {
    setDraft((prev) => ({ ...prev, ...patch }));
    if (patch.transactionId !== undefined) clearFieldError("draft", "transactionId");
    if (patch.bankDetailsComments !== undefined) clearFieldError("draft", "bankDetailsComments");
    if (patch.paymentMode !== undefined) {
      setFieldErrors((prev) => {
        const { draft: _removed, ...rest } = prev;
        return rest;
      });
    }
  }

  function handleAddDraft() {
    if (!draft.paymentMode && !draft.amount) return;

    const draftErrors = getPaymentFieldErrors(
      paymentModes,
      draft.paymentMode || defaultMode,
      draft.transactionId,
      draft.bankDetailsComments,
    );
    if (hasPaymentFieldErrors(draftErrors)) {
      setFieldErrors((prev) => ({ ...prev, draft: draftErrors }));
      return;
    }

    setEntries((prev) => [
      ...prev,
      {
        id: `entry-${Date.now()}`,
        paymentMode: draft.paymentMode || defaultMode,
        transactionId: draft.transactionId,
        bankDetailsComments: draft.bankDetailsComments,
        amount: draft.amount || "0.0",
      },
    ]);
    setDraft(createEmptyPaymentListDraft());
    setFieldErrors((prev) => {
      const { draft: _removed, ...rest } = prev;
      return rest;
    });
  }

  function handleClearDraft() {
    setDraft(createEmptyPaymentListDraft());
    setFieldErrors((prev) => {
      const { draft: _removed, ...rest } = prev;
      return rest;
    });
  }

  function getPlaceholders(modeName: string) {
    const requirements = getPaymentModeRequirements(paymentModes, modeName);
    return {
      transactionId: fieldRequirementPlaceholder(requirements.transactionId),
      bankDetailsComments: fieldRequirementPlaceholder(requirements.bankDetailsComments),
    };
  }

  const draftPlaceholders = getPlaceholders(draft.paymentMode || defaultMode);

  return (
    <div
      className={`pay-list-overlay${stacked ? " pay-list-overlay--stacked" : ""}`}
      role="presentation"
      onClick={attemptClose}
    >
      <div
        className="pay-list-modal"
        role="dialog"
        aria-labelledby="pay-list-title"
        aria-modal="true"
        onClick={(e) => e.stopPropagation()}
      >
        <header className="pay-list-modal__header">
          <h2 id="pay-list-title" className="pay-list-modal__title">
            Payment List
          </h2>
          <button
            type="button"
            className="pay-list-modal__close"
            onClick={attemptClose}
            aria-label="Close"
          >
            ×
          </button>
        </header>

        <div className="pay-list-modal__body">
          {!showTable ? (
            <p className="pay-list-empty">
              No visible payment modes. Enable modes in Registration Settings → Manage Payment
              Modes.
            </p>
          ) : (
            <div className="pay-list-table-wrap">
              <table className="pay-list-table">
                <colgroup>
                  <col className="pay-list-table__col-mode" />
                  <col className="pay-list-table__col-transaction" />
                  <col className="pay-list-table__col-bank" />
                  <col className="pay-list-table__col-amount" />
                  <col className="pay-list-table__col-action" />
                </colgroup>
                <thead>
                  <tr>
                    <th>Payment Mode</th>
                    <th>Transaction ID</th>
                    <th>Bank Details/Comments</th>
                    <th>Amount</th>
                    <th>Action</th>
                  </tr>
                </thead>
                <tbody>
                  {entries.map((entry) => {
                    const placeholders = getPlaceholders(entry.paymentMode);
                    const entryModeOptions = buildEntryModeOptions(
                      entry.paymentMode,
                      visiblePaymentModeOptions,
                    );
                    return (
                      <tr key={entry.id}>
                        <td>
                          <select
                            className="pay-list-table__select"
                            value={entry.paymentMode}
                            aria-label={`Payment mode for entry ${entry.id}`}
                            onChange={(e) => updateEntry(entry.id, { paymentMode: e.target.value })}
                          >
                            {entryModeOptions.map((option) => (
                              <option key={option.value} value={option.value}>
                                {option.label}
                              </option>
                            ))}
                          </select>
                        </td>
                        <PaymentDetailInputs
                          transactionId={entry.transactionId}
                          bankDetailsComments={entry.bankDetailsComments}
                          transactionPlaceholder={placeholders.transactionId}
                          bankPlaceholder={placeholders.bankDetailsComments}
                          errors={fieldErrors[entry.id]}
                          onTransactionIdChange={(value) =>
                            updateEntry(entry.id, { transactionId: value })
                          }
                          onBankDetailsChange={(value) =>
                            updateEntry(entry.id, { bankDetailsComments: value })
                          }
                          transactionAriaLabel={`Transaction ID for ${formatPaymentModeLabel(entry.paymentMode)}`}
                          bankAriaLabel={`Bank Details/Comments for ${formatPaymentModeLabel(entry.paymentMode)}`}
                        />
                        <td>
                          <input
                            type="text"
                            className="pay-list-table__input pay-list-table__input--amount"
                            value={entry.amount}
                            aria-label={`Amount for ${formatPaymentModeLabel(entry.paymentMode)}`}
                            onChange={(e) => updateEntry(entry.id, { amount: e.target.value })}
                          />
                        </td>
                        <td className="pay-list-table__action-cell">
                          <button
                            type="button"
                            className="pay-list-table__icon-btn"
                            aria-label={`Delete ${formatPaymentModeLabel(entry.paymentMode)} payment`}
                            onClick={() => deleteEntry(entry.id)}
                          >
                            <TrashIcon />
                          </button>
                        </td>
                      </tr>
                    );
                  })}

                  {visiblePaymentModeOptions.length > 0 ? (
                    <tr className="pay-list-table__draft-row">
                      <td>
                        <select
                          className="pay-list-table__select"
                          value={draft.paymentMode}
                          aria-label="Payment mode for new entry"
                          onChange={(e) => updateDraft({ paymentMode: e.target.value })}
                        >
                          <option value="">Select mode</option>
                          {visiblePaymentModeOptions.map((option) => (
                            <option key={option.value} value={option.value}>
                              {option.label}
                            </option>
                          ))}
                        </select>
                      </td>
                      <PaymentDetailInputs
                        transactionId={draft.transactionId}
                        bankDetailsComments={draft.bankDetailsComments}
                        transactionPlaceholder={draftPlaceholders.transactionId}
                        bankPlaceholder={draftPlaceholders.bankDetailsComments}
                        errors={fieldErrors.draft}
                        onTransactionIdChange={(value) => updateDraft({ transactionId: value })}
                        onBankDetailsChange={(value) =>
                          updateDraft({ bankDetailsComments: value })
                        }
                        transactionAriaLabel="Transaction ID for new entry"
                        bankAriaLabel="Bank Details/Comments for new entry"
                      />
                      <td>
                        <input
                          type="text"
                          className="pay-list-table__input pay-list-table__input--amount"
                          value={draft.amount}
                          aria-label="Amount for new entry"
                          onChange={(e) => updateDraft({ amount: e.target.value })}
                        />
                      </td>
                      <td className="pay-list-table__action-cell">
                        <button
                          type="button"
                          className="pay-list-table__round-btn"
                          aria-label="Add payment row"
                          onClick={handleAddDraft}
                        >
                          <PlusIcon />
                        </button>
                        <button
                          type="button"
                          className="pay-list-table__round-btn"
                          aria-label="Clear new payment row"
                          onClick={handleClearDraft}
                        >
                          <MinusIcon />
                        </button>
                      </td>
                    </tr>
                  ) : null}
                </tbody>
              </table>
            </div>
          )}
        </div>

        <footer className="pay-list-modal__footer">
          <button type="button" className="pay-list-btn pay-list-btn--close" onClick={attemptClose}>
            Close
          </button>
        </footer>
      </div>
    </div>
  );
}
