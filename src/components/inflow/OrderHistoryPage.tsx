import type { PropagatedExceptions } from "../../data/inflow/exceptionTypes";
import type { Order } from "../../data/inflow/mockOrders";
import { ExceptionTags } from "./ExceptionTags";

type Props = {
  orders: Order[];
  getExceptionsForOrder: (order: Order) => PropagatedExceptions;
  onSelectOrder: (orderId: number) => void;
};

const columns = [
  "Order ID",
  "Patient Details",
  "Provider",
  "Order Source",
  "Account",
  "Order Date",
  "Order Amount",
  "Due",
  "Status",
];

const currency = (amount: number) => `₹ ${amount.toLocaleString("en-IN")}`;

export function OrderHistoryPage({ orders, getExceptionsForOrder, onSelectOrder }: Props) {
  return (
    <section className="order-history">
      <div className="page-toolbar">
        <div className="tabs">
          <button className="tab active">All Orders</button>
          <button className="tab">Order Settlements</button>
          <button className="tab">Add Service To Order</button>
        </div>
        <div className="toolbar-filters">
          <input aria-label="Search order" placeholder="Search Order Id" />
          <button>Search</button>
          <div className="date-filter">
            <span>2nd May, 2025 - 13th May, 2026</span>
            <span>▣</span>
          </div>
        </div>
      </div>

      <div className="table-card">
        <div className="rows-count">Rows: 74</div>
        <table>
          <thead>
            <tr>
              {columns.map((column) => (
                <th key={column}>
                  <span>{column}</span>
                  <span className="filter-icon">▼</span>
                </th>
              ))}
              <th />
            </tr>
          </thead>
          <tbody>
            {orders.map((order) => (
              <tr
                key={order.id}
                onClick={() => onSelectOrder(order.id)}
                onKeyDown={(event) => {
                  if (event.key === "Enter" || event.key === " ") {
                    onSelectOrder(order.id);
                  }
                }}
                role="button"
                tabIndex={0}
              >
                <td className="order-id">{order.id}</td>
                <td className="patient-cell">
                  <strong>{order.patient}</strong>
                  <span>{order.patientMeta}</span>
                  <ExceptionTags exceptions={getExceptionsForOrder(order)} />
                </td>
                <td>{order.provider}</td>
                <td>{order.source || "-"}</td>
                <td>{order.account}</td>
                <td>{order.orderDate}</td>
                <td>{currency(order.amount)}</td>
                <td>{currency(order.due)}</td>
                <td>
                  <span className={`status-badge ${order.status.toLowerCase()}`}>{order.status}</span>
                </td>
                <td className="kebab">⋮</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
}
