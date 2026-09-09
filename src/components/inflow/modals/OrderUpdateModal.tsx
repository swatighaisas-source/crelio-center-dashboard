import { useEffect, useMemo, useState } from "react";
import type { ExceptionKey, Order } from "../../../data/inflow/mockOrders";
import type { PropagatedExceptions } from "../../../data/inflow/exceptionTypes";
import type { RolloutConfig } from "../../../data/inflow/rolloutConfig";
import type { LabTask, TaskUser } from "../../../data/inflow/mockTasks";
import { useOrderPaymentList } from "../../../context/OrderPaymentListContext";
import {
  entriesToPaymentHistory,
  getTotalPaymentAmount,
  paymentHistoryToEntries,
  type PaymentListEntry,
} from "../../../data/paymentList";
import { PaymentListModal } from "../../registration/PaymentListModal";
import { AoeResponsesModal } from "./AoeResponsesModal";
import { orderHasAoeServices } from "../../../lib/aoe/orderAoeAdapter";
import { ExceptionSection } from "../ExceptionSection";

type Props = {
  labId: number;
  order: Order;
  exceptions: PropagatedExceptions;
  openTasks: LabTask[];
  taskUnreadCounts: Record<string, number>;
  onClose: () => void;
  onUpdate: (order: Order) => void;
  rolloutConfig: RolloutConfig;
  currentUser: TaskUser;
  onOpenTask: (taskId: string) => void;
  onSetExceptions: (orderId: number, exceptionKeys: ExceptionKey[], comment: string) => void;
  onResolveExceptions: (orderId: number, exceptionKeys: ExceptionKey[], comment: string) => void;
};

const currency = (amount: number) => `₹ ${amount.toLocaleString("en-IN")}`;

export function OrderUpdateModal({
  labId,
  order,
  exceptions,
  openTasks,
  taskUnreadCounts,
  onClose,
  onUpdate,
  rolloutConfig,
  currentUser,
  onOpenTask,
  onSetExceptions,
  onResolveExceptions,
}: Props) {
  const [activeBillId, setActiveBillId] = useState(order.bills[0]?.id ?? order.id);
  const [paymentListOpen, setPaymentListOpen] = useState(false);
  const [aoeResponsesOpen, setAoeResponsesOpen] = useState(false);
  const { savedPayments, saveOrderPayments } = useOrderPaymentList(labId, order.id);

  useEffect(() => {
    if (savedPayments.length > 0 || order.paymentHistory.length === 0) return;
    saveOrderPayments(paymentHistoryToEntries(order.paymentHistory));
  }, [order.id, order.paymentHistory, savedPayments.length, saveOrderPayments]);

  const paymentRows = useMemo(() => {
    if (savedPayments.length > 0) {
      return entriesToPaymentHistory(savedPayments, order.orderDate);
    }
    return order.paymentHistory;
  }, [savedPayments, order.orderDate, order.paymentHistory]);

  const totalPaid = useMemo(() => {
    if (savedPayments.length > 0) return getTotalPaymentAmount(savedPayments);
    return order.paymentHistory.reduce((sum, payment) => sum + payment.amount, 0);
  }, [savedPayments, order.paymentHistory]);
  const dueAmount = Math.max(order.amount - totalPaid, 0);

  function handlePaymentListSave(entries: PaymentListEntry[]) {
    onUpdate({
      ...order,
      paymentHistory: entriesToPaymentHistory(entries, order.orderDate),
    });
  }

  const paymentListInitialEntries =
    order.paymentHistory.length > 0 ? paymentHistoryToEntries(order.paymentHistory) : undefined;

  return (
    <div className="modal-backdrop">
      <section className="order-modal" role="dialog" aria-modal="true" aria-label="Update order">
        <aside className="past-bills">
          <div className="past-title">Past Bills</div>
          <input placeholder="Search Bill" />
          {order.bills.map((bill) => (
            <button
              className={`bill-card ${bill.id === activeBillId ? "active" : ""}`}
              key={bill.id}
              onClick={() => setActiveBillId(bill.id)}
            >
              <strong>{bill.date}</strong>
              <span>
                #{bill.id} {bill.paid ? <b>Paid</b> : null}
              </span>
              <small>Source: {bill.source}</small>
            </button>
          ))}
        </aside>

        <div className="modal-main">
          <button className="modal-close" onClick={onClose} aria-label="Close">
            ×
          </button>

          <header className="modal-header">
            <h1>
              {order.patient} <span>({order.patientMeta.replace(" - ", " years - ")})</span>
            </h1>
            <div className="modal-dates">
              <label>
                Order Date
                <span>{order.orderDate.replace(" pm", " PM").replace(" am", " AM")}</span>
              </label>
              <label>
                Sample Date
                <span>{order.sampleDate}</span>
              </label>
            </div>
          </header>

          <div className="source-selector">
            <span>Select Source of Ordering</span>
            {["Self Pay", "Insurance", "Org Pay", "Other"].map((source) => (
              <button className={source === order.source ? "selected" : ""} key={source}>
                {source}
              </button>
            ))}
          </div>

          <div className="order-icd">Order ICD <input placeholder="Select ICD Code" /></div>

          <section className="service-table">
            <div className="service-row head">
              <span>#</span>
              <span>Service Name</span>
              <span>Qty</span>
              <span>ICD Code</span>
              <span>Price</span>
              <span>Concession</span>
              <span />
            </div>
            {order.services.map((service, index) => (
              <div className="service-row" key={service.id}>
                <span>{index + 1}</span>
                <span>
                  <strong>{service.name}</strong>
                  {service.status ? <b>({service.status})</b> : null}
                  <small>{service.code}</small>
                </span>
                <input value={String(service.qty ?? 1)} readOnly />
                <input placeholder="ICD Code" />
                <span>{currency(service.price)} ✎</span>
                <span>{currency(service.concession)} ✎</span>
                <button>Remove Service</button>
              </div>
            ))}
          </section>

          <section className="add-service">
            <h2>Add new service to order</h2>
            <div className="service-row add">
              <span>1</span>
              <div className="search-select">Search & Select List <span>⌕</span></div>
              <input placeholder="ICD Code" />
              <input defaultValue="0" />
              <input defaultValue="0" />
            </div>
            <button className="add-test">Add Service</button>
          </section>

          <section className="accordion closed">
            <button>
              <strong>Additional Details</strong>
              <span>⌄</span>
            </button>
          </section>

          <ExceptionSection
            subjectId={order.id}
            subjectLabel={`Order : #${order.id}`}
            currentLevel="order"
            exceptions={exceptions}
            openTasks={openTasks}
            taskUnreadCounts={taskUnreadCounts}
            rolloutConfig={rolloutConfig}
            account={order.account}
            requesterUser={currentUser}
            onOpenTask={onOpenTask}
            onSetExceptions={(subjectId, exceptionKeys, comment) =>
              onSetExceptions(Number(subjectId), exceptionKeys, comment)
            }
            onResolveExceptions={(subjectId, exceptionKeys, comment) =>
              onResolveExceptions(Number(subjectId), exceptionKeys, comment)
            }
          />

          <section className="payment-details">
            <h2>Payment Details</h2>
            <div className="payment-grid">
              <div className="summary-card">
                <h3>Order Summary</h3>
                <label>Service Amount (₹)<span>{order.amount}</span></label>
                <label>Additional Amount (₹)<input defaultValue="0" /></label>
                <label>Concession (₹)<input defaultValue="0" /></label>
                <label>TDS Concession (%)<input defaultValue="0" /></label>
                <label>Payable Amount (₹)<span>{order.amount}</span></label>
              </div>
              <div className="summary-card">
                <h3>Payment Status</h3>
                <label>Payable Amount (₹)<span>{order.amount}</span></label>
                <label>Total Paid Amount (₹)<span>{totalPaid}</span></label>
                <label>Due Amount (₹)<span>{dueAmount}</span></label>
              </div>
            </div>
          </section>

          <section className="payment-history">
            <h2>Payment History</h2>
            <button
              type="button"
              className="add-payment"
              onClick={() => setPaymentListOpen(true)}
            >
              Add Payment
            </button>
            <div className="payment-row head">
              <span>PAYMENT MODE</span>
              <span>PAYMENT TYPE</span>
              <span>SERVICE NAME</span>
              <span>AMOUNT (₹)</span>
              <span>TRANSACTION DATE</span>
              <span>COLLECTED BY</span>
            </div>
            {paymentRows.length > 0 ? (
              paymentRows.map((payment, index) => (
                <div
                  className="payment-row"
                  key={`${payment.mode}-${payment.transactionDate}-${index}`}
                >
                  <span>{payment.mode}</span>
                  <span>{payment.type}</span>
                  <span>{payment.serviceName}</span>
                  <span>{payment.amount}</span>
                  <span>{payment.transactionDate}</span>
                  <span>{payment.collectedBy}</span>
                </div>
              ))
            ) : (
              <div className="payment-row payment-row--empty">
                <span>No payments recorded yet.</span>
              </div>
            )}
          </section>

          <footer className="modal-footer modal-footer--order">
            <div className="modal-footer__left">
              <label className="modal-footer__attachments">
                <input type="checkbox" defaultChecked /> Bill Attachments
              </label>
              <button type="button">Print⌄</button>
            </div>
            <div className="modal-footer__right">
              <button type="button" className="danger">Cancel Bill</button>
              {orderHasAoeServices(order.services) ? (
                <button
                  type="button"
                  className="aoe-action"
                  onClick={() => setAoeResponsesOpen(true)}
                >
                  View AOE
                </button>
              ) : null}
              <button type="button" className="primary" onClick={() => onUpdate(order)}>
                Confirm &amp; Update
              </button>
            </div>
          </footer>
        </div>
      </section>

      <AoeResponsesModal
        labId={labId}
        order={order}
        open={aoeResponsesOpen}
        onClose={() => setAoeResponsesOpen(false)}
      />

      <PaymentListModal
        labId={labId}
        orderId={order.id}
        open={paymentListOpen}
        onClose={() => setPaymentListOpen(false)}
        onSave={handlePaymentListSave}
        initialEntries={paymentListInitialEntries}
        stacked
      />
    </div>
  );
}
