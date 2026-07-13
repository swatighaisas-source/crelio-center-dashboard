import { useEffect, useMemo, useRef, useState, type MouseEvent } from "react";
import { useOrderPaymentList } from "../../context/OrderPaymentListContext";
import { usePaymentModes } from "../../context/PaymentModesContext";
import {
  formatPaymentModeLabel,
  paymentModeRequiresDetails,
} from "../../data/paymentModes";
import {
  getRegistrationBillDraftOrderId,
  getTotalPaymentAmount,
  type PaymentListEntry,
} from "../../data/paymentList";
import { PaymentListModal } from "./PaymentListModal";

interface Props {
  labId: number;
  open: boolean;
  onClose: () => void;
}

const BILL_SOURCES = ["Self Pay", "Insurance", "Org Pay"] as const;
const PAYABLE_AMOUNT = 101;
const PATIENT_DUE = 908;

function ChevronDown() {
  return (
    <svg viewBox="0 0 12 8" width="10" height="7" fill="none" aria-hidden>
      <path
        d="M1.5 1.5L6 6l4.5-4.5"
        stroke="currentColor"
        strokeWidth="1.3"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export function BillPatientModal({ labId, open, onClose }: Props) {
  const { paymentModes, visiblePaymentModeOptions } = usePaymentModes(labId);
  const billDraftId = useMemo(() => getRegistrationBillDraftOrderId(labId), [labId]);
  const [selectedSource, setSelectedSource] = useState<(typeof BILL_SOURCES)[number]>("Self Pay");
  const [selectedMode, setSelectedMode] = useState("");
  const [moreOpen, setMoreOpen] = useState(false);
  const [paymentListOpen, setPaymentListOpen] = useState(false);
  const [prefillMode, setPrefillMode] = useState<string | undefined>();
  const [paymentListSession, setPaymentListSession] = useState(0);
  const wasOpenRef = useRef(false);

  const { savedPayments } = useOrderPaymentList(labId, billDraftId);

  useEffect(() => {
    if (!open) {
      wasOpenRef.current = false;
      setPaymentListOpen(false);
      return;
    }
    if (wasOpenRef.current) return;
    wasOpenRef.current = true;

    setSelectedSource("Self Pay");
    setSelectedMode(
      savedPayments[savedPayments.length - 1]?.paymentMode ??
        visiblePaymentModeOptions[0]?.value ??
        "",
    );
    setMoreOpen(false);
    setPaymentListOpen(false);
    setPrefillMode(undefined);
  }, [open, savedPayments, visiblePaymentModeOptions]);

  const primaryModes = visiblePaymentModeOptions.slice(0, 3);
  const moreModes = visiblePaymentModeOptions.slice(3);

  const paidTotal = useMemo(() => getTotalPaymentAmount(savedPayments), [savedPayments]);
  const remaining = Math.max(PAYABLE_AMOUNT - paidTotal, 0);

  const activeModeLabel = selectedMode
    ? formatPaymentModeLabel(selectedMode)
    : formatPaymentModeLabel(visiblePaymentModeOptions[0]?.value ?? "Cash");

  function handleModeSelect(mode: string, event?: MouseEvent) {
    event?.stopPropagation();
    setSelectedMode(mode);
    setMoreOpen(false);
    if (paymentModeRequiresDetails(paymentModes, mode)) {
      setPrefillMode(mode);
      setPaymentListSession((session) => session + 1);
      setPaymentListOpen(true);
    }
  }

  function openPaymentList(mode?: string, event?: MouseEvent) {
    event?.stopPropagation();
    setPrefillMode(mode ?? (selectedMode || undefined));
    setPaymentListSession((session) => session + 1);
    setPaymentListOpen(true);
  }

  function handlePaymentListSave(entries: PaymentListEntry[]) {
    if (entries.length > 0) {
      setSelectedMode(entries[entries.length - 1].paymentMode);
    }
  }

  if (!open) return null;

  return (
    <>
      <div className="bill-patient-overlay" role="presentation" onClick={onClose}>
        <div
          className="bill-patient-modal"
          role="dialog"
          aria-labelledby="bill-patient-title"
          aria-modal="true"
          onClick={(e) => e.stopPropagation()}
        >
          <header className="bill-patient-modal__header">
            <button type="button" className="bill-patient-modal__back" onClick={onClose}>
              <span aria-hidden>‹</span> Back
            </button>
            <h2 id="bill-patient-title" className="bill-patient-modal__title">
              Bill Patient
            </h2>
            <div className="bill-patient-modal__times">
              <label>
                Sample Collect Time
                <input type="text" defaultValue="25/06/2026 10:48 AM" readOnly />
              </label>
              <label>
                Bill Booking Time
                <input type="text" defaultValue="25/06/2026 10:48 AM" readOnly />
              </label>
            </div>
            <button
              type="button"
              className="bill-patient-modal__close"
              onClick={onClose}
              aria-label="Close"
            >
              ×
            </button>
          </header>

          <div className="bill-patient-modal__body">
            <aside className="bill-patient-sidebar">
              <div className="bill-patient-sidebar__patient">
                <div className="bill-patient-sidebar__name-row">
                  <h3>Mr. Pranalitest (F - 4 Years)</h3>
                  <span className="bill-patient-sidebar__badge">R</span>
                </div>
                <p className="bill-patient-sidebar__id">#22740</p>
              </div>
              <dl className="bill-patient-sidebar__details">
                <div>
                  <dt>Contact No</dt>
                  <dd>+1 1234567890</dd>
                </div>
                <div>
                  <dt>Email</dt>
                  <dd>pranalitest@example.com</dd>
                </div>
                <div>
                  <dt>Referral</dt>
                  <dd>NewojWd</dd>
                </div>
                <div>
                  <dt>Organisation</dt>
                  <dd>cccount2</dd>
                </div>
                <div>
                  <dt>National ID</dt>
                  <dd>****1234</dd>
                </div>
                <div>
                  <dt>Previous Report On</dt>
                  <dd>4th Jun, 2026 12:49 pm</dd>
                </div>
              </dl>
            </aside>

            <main className="bill-patient-main">
              <section className="bill-patient-section">
                <h3 className="bill-patient-section__label">Select Source of Billing</h3>
                <div className="bill-patient-sources">
                  {BILL_SOURCES.map((source) => (
                    <button
                      key={source}
                      type="button"
                      className={`bill-patient-source${
                        selectedSource === source ? " bill-patient-source--active" : ""
                      }`}
                      onClick={() => setSelectedSource(source)}
                    >
                      {source}
                    </button>
                  ))}
                  <button type="button" className="bill-patient-source bill-patient-source--dropdown">
                    None (Default)
                    <ChevronDown />
                  </button>
                </div>
              </section>

              <section className="bill-patient-tests">
                <div className="bill-patient-tests__tabs">
                  <button type="button" className="bill-patient-tests__tab bill-patient-tests__tab--active">
                    Search View
                  </button>
                  <button type="button" className="bill-patient-tests__tab">
                    abc
                  </button>
                  <button type="button" className="bill-patient-tests__tab">
                    nnnnn
                  </button>
                </div>
                <table className="bill-patient-tests__table">
                  <thead>
                    <tr>
                      <th>#</th>
                      <th>Test Name</th>
                      <th>Qty</th>
                      <th>Price</th>
                      <th>Concession</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td>1</td>
                      <td>
                        <strong>CBC</strong>
                      </td>
                      <td>
                        <input type="text" defaultValue="1" readOnly className="bill-patient-tests__qty" />
                      </td>
                      <td>$ 101</td>
                      <td>$ 0</td>
                    </tr>
                    <tr>
                      <td>2</td>
                      <td colSpan={4}>
                        <div className="bill-patient-tests__search">Search &amp; Select List</div>
                      </td>
                    </tr>
                  </tbody>
                </table>
                <button type="button" className="bill-patient-tests__add">
                  Add Test
                </button>
              </section>

              <section className="bill-patient-other">
                <h3>Other Information</h3>
                <div className="bill-patient-other__grid">
                  <label>
                    Order Number
                    <input type="text" placeholder="Order Number" />
                  </label>
                  <label>
                    Consulting Doctor
                    <select defaultValue="">
                      <option value="">Consulting Doctor</option>
                    </select>
                  </label>
                </div>
              </section>

              <section className="bill-patient-payment">
                <h3>Payment Information</h3>
                <div className="bill-patient-payment__grid">
                  <div className="bill-patient-payment__col">
                    <label>
                      Concession (IN $)
                      <div className="bill-patient-payment__split">
                        <select defaultValue="">
                          <option value="">Select</option>
                        </select>
                        <input type="text" placeholder="0" />
                      </div>
                    </label>
                    <label>
                      Bill Additional Amount
                      <input type="text" placeholder="0" />
                    </label>
                  </div>

                  <div className="bill-patient-payment__col bill-patient-payment__col--summary">
                    <p>
                      <span>Test Amount:</span> <strong>$ {PAYABLE_AMOUNT}</strong>
                    </p>
                    <p>
                      <span>Patient Due:</span> <strong>$ {PATIENT_DUE}</strong>
                    </p>
                    <label>
                      Add Comment
                      <textarea rows={3} placeholder="Add Comment" />
                    </label>
                    <label className="bill-patient-payment__checkbox">
                      <input type="checkbox" />
                      Same for Report
                    </label>
                  </div>

                  <div className="bill-patient-payment__col bill-patient-payment__col--modes">
                    <p className="bill-patient-payment__payable">
                      <span>Payable Amount:</span> <strong>$ {PAYABLE_AMOUNT}</strong>
                    </p>
                    <label>
                      Advance Paid
                      <input type="text" placeholder="Advance" />
                    </label>

                    <div className="bill-patient-modes">
                      {primaryModes.map((mode) => (
                        <button
                          key={mode.value}
                          type="button"
                          className={`bill-patient-mode${
                            selectedMode === mode.value ? " bill-patient-mode--active" : ""
                          }`}
                          onClick={(event) => handleModeSelect(mode.value, event)}
                        >
                          {mode.label}
                        </button>
                      ))}
                      {moreModes.length > 0 ? (
                        <div className="bill-patient-modes__more">
                          <button
                            type="button"
                            className={`bill-patient-mode bill-patient-mode--more${
                              moreModes.some((mode) => mode.value === selectedMode)
                                ? " bill-patient-mode--active"
                                : ""
                            }`}
                            onClick={() => setMoreOpen((open) => !open)}
                            aria-expanded={moreOpen}
                          >
                            More
                            <ChevronDown />
                          </button>
                          {moreOpen ? (
                            <div className="bill-patient-modes__dropdown" role="menu">
                              {moreModes.map((mode) => (
                                <button
                                  key={mode.value}
                                  type="button"
                                  role="menuitem"
                                  className={
                                    selectedMode === mode.value
                                      ? "bill-patient-modes__dropdown-item--active"
                                      : undefined
                                  }
                                  onClick={(event) => handleModeSelect(mode.value, event)}
                                >
                                  {mode.label}
                                </button>
                              ))}
                            </div>
                          ) : null}
                        </div>
                      ) : null}
                    </div>

                    <button
                      type="button"
                      className="bill-patient-payment__add-link"
                      onClick={(event) => openPaymentList(undefined, event)}
                    >
                      Add Payment
                    </button>

                    <div className="bill-patient-payment__breakdown">
                      {savedPayments.length > 0 ? (
                        savedPayments.map((entry) => (
                          <span key={entry.id}>
                            {formatPaymentModeLabel(entry.paymentMode)} $ {entry.amount}
                          </span>
                        ))
                      ) : (
                        <span>
                          {activeModeLabel} $ 0
                        </span>
                      )}
                      <span>Remaining $ {remaining}</span>
                    </div>
                  </div>
                </div>
              </section>
            </main>

            <aside className="bill-patient-pricelist">
              <h3>Price List Details</h3>
              <label>
                Discount Price List
                <input type="search" placeholder="Search discount price list" />
              </label>
              <p className="bill-patient-pricelist__note">
                Limited discount access, cannot change discount lists
              </p>
            </aside>
          </div>

          <footer className="bill-patient-modal__footer">
            <label className="bill-patient-modal__emergency">
              <input type="checkbox" />
              Emergency Report
            </label>
            <div className="bill-patient-modal__footer-actions">
              <button type="button" className="bill-patient-btn bill-patient-btn--cancel" onClick={onClose}>
                Cancel
              </button>
              <button type="button" className="bill-patient-btn bill-patient-btn--confirm">
                Confirm and Bill
                <span className="bill-patient-btn__hint">cmd+enter</span>
              </button>
            </div>
          </footer>
        </div>
      </div>

      <PaymentListModal
        key={paymentListSession}
        labId={labId}
        orderId={billDraftId}
        open={paymentListOpen}
        onClose={() => {
          setPaymentListOpen(false);
          setPrefillMode(undefined);
        }}
        onSave={handlePaymentListSave}
        prefillMode={prefillMode}
        stacked
      />
    </>
  );
}
