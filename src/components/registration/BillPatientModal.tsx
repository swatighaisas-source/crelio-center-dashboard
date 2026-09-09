import { useEffect, useMemo, useRef, useState, type MouseEvent } from "react";
import { useNavigate } from "react-router-dom";
import { useInflow } from "../../context/InflowContext";
import { useLabAoeConfig } from "../../context/LabAoeConfigContext";
import { useOrderPaymentList } from "../../context/OrderPaymentListContext";
import { usePaymentModes } from "../../context/PaymentModesContext";
import type { BillLineItem } from "../../data/aoeTypes";
import {
  BILL_TEST_CATALOG,
  createDefaultBillLineItems,
  findCatalogTest,
} from "../../data/billTests";
import { sectionHref } from "../../data/labModules";
import {
  formatPaymentModeLabel,
  paymentModeRequiresDetails,
} from "../../data/paymentModes";
import {
  getRegistrationBillDraftOrderId,
  getTotalPaymentAmount,
  type PaymentListEntry,
} from "../../data/paymentList";
import { getAoeCompletionMessage, isBillAoeComplete } from "../../lib/aoe/aoeCompletion";
import {
  addTestToBill,
  handleRemoveLineItemWithAoeCleanup,
  moveLineItemDown,
  moveLineItemUp,
  updateLineItemQty,
} from "../../lib/aoe/aoeLifecycle";
import { copyBillAoeAnswers, getBillAoeAnswers } from "../../lib/aoe/aoeResponseStore";
import { getValidationSummary, validateBillAoe } from "../../lib/aoe/aoeValidation";
import {
  buildOrderFromBillLineItems,
  nextOrderId,
} from "../../lib/aoe/orderAoeAdapter";
import { AoeForBillModal } from "./aoe/AoeForBillModal";
import { PaymentListModal } from "./PaymentListModal";

interface Props {
  labId: number;
  open: boolean;
  onClose: () => void;
}

const BILL_SOURCES = ["Self Pay", "Insurance", "Org Pay"] as const;
const PATIENT_DUE = 908;

const PATIENT_CONTEXT = {
  name: "swati (F - 0 years)",
  id: "33506",
  ref: "IpId-4633",
  contact: "91 9898789878",
  referral: "test-ref-2",
  organisation: "Saturn (Training)",
  previousReportOn: "28th May, 2026 12:14 pm",
};

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

function formatCurrency(amount: number) {
  return `₹ ${amount.toFixed(2)}`;
}

export function BillPatientModal({ labId, open, onClose }: Props) {
  const navigate = useNavigate();
  const { createOrder, orders, setSelectedOrderId } = useInflow();
  const { paymentModes, visiblePaymentModeOptions } = usePaymentModes(labId);
  const { captureFrequency } = useLabAoeConfig(labId);
  const billDraftOrderId = useMemo(() => getRegistrationBillDraftOrderId(labId), [labId]);
  const billDraftId = useMemo(() => String(billDraftOrderId), [billDraftOrderId]);
  const [selectedSource, setSelectedSource] = useState<(typeof BILL_SOURCES)[number]>("Self Pay");
  const [selectedMode, setSelectedMode] = useState("");
  const [paymentListOpen, setPaymentListOpen] = useState(false);
  const [prefillMode, setPrefillMode] = useState<string | undefined>();
  const [paymentListSession, setPaymentListSession] = useState(0);
  const [lineItems, setLineItems] = useState<BillLineItem[]>(() => createDefaultBillLineItems());
  const [aoeModalOpen, setAoeModalOpen] = useState(false);
  const [toast, setToast] = useState<string | null>(null);
  const [confirmError, setConfirmError] = useState<string | null>(null);
  const wasOpenRef = useRef(false);

  const { savedPayments } = useOrderPaymentList(labId, billDraftOrderId);

  const testAmount = useMemo(
    () =>
      lineItems.reduce(
        (sum, item) => sum + item.price * item.qty - item.concession,
        0,
      ),
    [lineItems],
  );

  const answers = useMemo(
    () => getBillAoeAnswers(labId, billDraftId, lineItems),
    [labId, billDraftId, lineItems, aoeModalOpen],
  );

  const aoeComplete = useMemo(
    () => isBillAoeComplete(lineItems, captureFrequency, answers),
    [lineItems, captureFrequency, answers],
  );

  const aoeStatus = useMemo(
    () => validateBillAoe(lineItems, captureFrequency, answers),
    [lineItems, captureFrequency, answers],
  );

  useEffect(() => {
    if (!open) {
      wasOpenRef.current = false;
      setPaymentListOpen(false);
      setAoeModalOpen(false);
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
    setPaymentListOpen(false);
    setPrefillMode(undefined);
    setLineItems(createDefaultBillLineItems());
    setConfirmError(null);
    setToast(null);
  }, [open, savedPayments, visiblePaymentModeOptions]);

  useEffect(() => {
    if (!toast) return;
    const timer = window.setTimeout(() => setToast(null), 4000);
    return () => window.clearTimeout(timer);
  }, [toast]);

  const primaryModes = visiblePaymentModeOptions.slice(0, 3);

  const paidTotal = useMemo(() => getTotalPaymentAmount(savedPayments), [savedPayments]);
  const remaining = Math.max(testAmount - paidTotal, 0);

  const suggestedTests = BILL_TEST_CATALOG.filter((test) =>
    ["test-ammonia", "test-afp"].includes(test.testId),
  );

  function handleModeSelect(mode: string, event?: MouseEvent) {
    event?.stopPropagation();
    setSelectedMode(mode);
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

  function handleAddTest(testId: string) {
    setLineItems((items) => addTestToBill(items, testId));
  }

  function handleRemoveLineItem(lineItemId: string) {
    setLineItems((items) =>
      handleRemoveLineItemWithAoeCleanup(labId, billDraftId, items, lineItemId),
    );
  }

  function handleQtyChange(lineItemId: string, rawQty: string) {
    const qty = Number.parseInt(rawQty, 10);
    if (Number.isNaN(qty)) return;
    setLineItems((items) => updateLineItemQty(items, lineItemId, qty));
  }

  function handleConfirmBill() {
    if (!aoeComplete && aoeStatus.pending.length > 0) {
      setConfirmError(getValidationSummary(aoeStatus.pending));
      return;
    }
    setConfirmError(null);

    const orderId = nextOrderId(orders);
    const order = buildOrderFromBillLineItems({
      orderId,
      lineItems,
      patientName: "swati",
      patientMeta: "F - 0 y",
      provider: PATIENT_CONTEXT.referral,
      source: selectedSource,
      account: PATIENT_CONTEXT.organisation,
    });
    order.paymentHistory = savedPayments
      .filter((entry) => Number.parseFloat(entry.amount) > 0)
      .map((entry) => ({
        mode: formatPaymentModeLabel(entry.paymentMode),
        type: "Payment",
        serviceName: lineItems.map((item) => item.testName).join(", ") || "—",
        amount: Number.parseFloat(entry.amount) || 0,
        transactionDate: order.orderDate,
        collectedBy: "Registration",
      }));
    const paidTotalForOrder = getTotalPaymentAmount(savedPayments);
    order.due = Math.max(order.amount - paidTotalForOrder, 0);
    if (order.bills[0]) {
      order.bills[0].paid = order.due <= 0;
      order.bills[0].source = selectedSource;
    }

    createOrder(order);
    copyBillAoeAnswers(labId, billDraftId, String(orderId));

    onClose();
    navigate(sectionHref(labId, "registration", "order-history"));
    setSelectedOrderId(orderId);
  }

  function handleAoeComplete() {
    setAoeModalOpen(true);
  }

  const activeModeLabel = selectedMode
    ? formatPaymentModeLabel(selectedMode)
    : formatPaymentModeLabel(visiblePaymentModeOptions[0]?.value ?? "Cash");

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
                <input type="text" defaultValue="02/09/2026 12:28 PM" readOnly />
              </label>
              <label>
                Bill Booking Time
                <input type="text" defaultValue="02/09/2026 12:28 PM" readOnly />
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
                  <h3>swati (F - 0 years)</h3>
                </div>
                <p className="bill-patient-sidebar__id">33506</p>
              </div>
              <dl className="bill-patient-sidebar__details">
                <div>
                  <dt>Contact No</dt>
                  <dd>91 9898789878</dd>
                </div>
                <div>
                  <dt>Referral</dt>
                  <dd>test-ref-2</dd>
                </div>
                <div>
                  <dt>Organisation</dt>
                  <dd>Saturn (Training)</dd>
                </div>
                <div>
                  <dt>Previous Report On</dt>
                  <dd>28th May, 2026 12:14 pm</dd>
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
                <table className="bill-patient-tests__table">
                  <thead>
                    <tr>
                      <th>#</th>
                      <th>Test Name</th>
                      <th>Qty</th>
                      <th>Price</th>
                      <th>Concession</th>
                      <th aria-label="Actions" />
                    </tr>
                  </thead>
                  <tbody>
                    {lineItems.map((item, index) => (
                      <tr key={item.id}>
                        <td>{index + 1}</td>
                        <td>
                          <strong>{item.testName}</strong>
                          <div className="bill-patient-tests__subtitle">
                            {item.testName} - {item.testCode}
                          </div>
                          {item.hasAoe ? (
                            <span className="bill-patient-tests__aoe-badge">AOE Required</span>
                          ) : null}
                        </td>
                        <td>
                          <input
                            type="number"
                            min={1}
                            className="bill-patient-tests__qty"
                            value={item.qty}
                            onChange={(e) => handleQtyChange(item.id, e.target.value)}
                          />
                        </td>
                        <td>{formatCurrency(item.price * item.qty)}</td>
                        <td>{formatCurrency(item.concession)}</td>
                        <td className="bill-patient-tests__actions">
                          <button
                            type="button"
                            className="bill-patient-tests__move"
                            aria-label="Move up"
                            onClick={() =>
                              setLineItems((items) => moveLineItemUp(items, item.id))
                            }
                            disabled={index === 0}
                          >
                            ↑
                          </button>
                          <button
                            type="button"
                            className="bill-patient-tests__move"
                            aria-label="Move down"
                            onClick={() =>
                              setLineItems((items) => moveLineItemDown(items, item.id))
                            }
                            disabled={index === lineItems.length - 1}
                          >
                            ↓
                          </button>
                          <button
                            type="button"
                            className="bill-patient-tests__remove"
                            aria-label="Remove test"
                            onClick={() => handleRemoveLineItem(item.id)}
                          >
                            ×
                          </button>
                        </td>
                      </tr>
                    ))}
                    <tr>
                      <td>{lineItems.length + 1}</td>
                      <td colSpan={5}>
                        <div className="bill-patient-tests__search">Search &amp; Select List</div>
                        <div className="bill-patient-tests__suggested">
                          <span>Suggested Tests</span>
                          {suggestedTests.map((test) => (
                            <button
                              key={test.testId}
                              type="button"
                              className="bill-patient-tests__suggested-btn"
                              onClick={() => handleAddTest(test.testId)}
                            >
                              {test.testName.toUpperCase()}
                            </button>
                          ))}
                        </div>
                      </td>
                    </tr>
                  </tbody>
                </table>
              </section>

              {confirmError ? (
                <p className="bill-patient-error" role="alert">
                  {confirmError}
                </p>
              ) : null}

              <section className="bill-patient-payment">
                <h3>Payment Information</h3>
                <div className="bill-patient-payment__grid">
                  <div className="bill-patient-payment__col bill-patient-payment__col--summary">
                    <p>
                      <span>Test Amount:</span> <strong>{formatCurrency(testAmount)}</strong>
                    </p>
                    <p>
                      <span>Patient Due:</span> <strong>{formatCurrency(PATIENT_DUE)}</strong>
                    </p>
                  </div>

                  <div className="bill-patient-payment__col bill-patient-payment__col--modes">
                    <p className="bill-patient-payment__payable">
                      <span>Payable Amount:</span> <strong>{formatCurrency(testAmount)}</strong>
                    </p>

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
                    </div>

                    <button
                      type="button"
                      className="bill-patient-payment__add-link"
                      onClick={(event) => openPaymentList(undefined, event)}
                    >
                      Add Payment
                    </button>

                    <div className="bill-patient-payment__breakdown">
                      <span>
                        {activeModeLabel} {formatCurrency(paidTotal)}
                      </span>
                      <span>Remaining {formatCurrency(remaining)}</span>
                    </div>
                  </div>
                </div>
              </section>
            </main>

            <aside className="bill-patient-pricelist">
              <h3>Price List Details</h3>
              <label>
                Organisation Price List
                <input type="search" placeholder="Search organisation price list" />
              </label>
              <label>
                Referral Price List
                <input type="search" placeholder="Search referral price list" />
              </label>
              <label>
                Discount Price List
                <input type="search" placeholder="Search discount price list" />
              </label>
            </aside>
          </div>

          <footer className="bill-patient-modal__footer">
            <div className="bill-patient-modal__footer-actions">
              <button type="button" className="bill-patient-btn bill-patient-btn--cancel" onClick={onClose}>
                Cancel
              </button>
              <button
                type="button"
                className={`bill-patient-btn bill-patient-btn--aoe${
                  aoeComplete ? " bill-patient-btn--aoe-complete" : ""
                }`}
                onClick={handleAoeComplete}
              >
                {aoeComplete ? "AOE Complete" : "Complete AOE"}
              </button>
              <button
                type="button"
                className="bill-patient-btn bill-patient-btn--confirm"
                onClick={handleConfirmBill}
              >
                Confirm and Bill
              </button>
            </div>
          </footer>

          {toast ? <div className="bill-patient-toast">{toast}</div> : null}
        </div>
      </div>

      <AoeForBillModal
        labId={labId}
        billId={billDraftId}
        open={aoeModalOpen}
        lineItems={lineItems}
        frequency={captureFrequency}
        patient={PATIENT_CONTEXT}
        onClose={() => setAoeModalOpen(false)}
        onComplete={() => {
          setToast(getAoeCompletionMessage(lineItems, captureFrequency, answers));
        }}
      />

      <PaymentListModal
        key={paymentListSession}
        labId={labId}
        orderId={billDraftOrderId}
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

export { findCatalogTest };
