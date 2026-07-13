import type { LabDetail } from "../../data/labDetails";
import { PlanSummaryCards } from "./PlanSummaryCards";
import { MiniTable } from "./MiniTable";
import { CheckCircleIcon, InfoIcon, ChevronDownIcon } from "../Icons";

const SUB_TABS = ["Recurring Profile Items", "Invoices", "Payments", "Order Form"] as const;

interface Props {
  lab: LabDetail;
}

export function PlanDetailsTab({ lab }: Props) {
  return (
    <div className="plan-details">
      {/* Plan + Invoices summary — moved from Centre Details side column */}
      <PlanSummaryCards lab={lab} labId={lab.id} />

      <div className="plan-details__usage-grid">
        <MiniTable
          title="User Logins"
          headers={["Logins", "Used", "Total"]}
          rows={[
            ["User", "1", "10"],
            ["CC", "0", "20"],
            ["Org", "0", "50"],
            ["Referral", "0", "25"],
          ]}
        />
        <MiniTable
          title="Balance"
          headers={["Channel", "Balance"]}
          rows={[
            ["SMS", "100"],
            ["Whatsapp", "0"],
          ]}
        />
        <MiniTable
          title="Credits added per month"
          headers={["Channel", "Credits"]}
          rows={[
            ["SMS", "0"],
            ["Whatsapp", "0"],
          ]}
        />
      </div>

      <div className="plan-details__subnav">
        <div className="plan-sub-tabs">
          {SUB_TABS.map((tab) => (
            <button
              key={tab}
              type="button"
              className={`plan-sub-tab${tab === "Recurring Profile Items" ? " plan-sub-tab--active" : ""}`}
            >
              {tab}
            </button>
          ))}
        </div>
        <div className="plan-details__toolbar">
          <div className="filter-pills">
            <button type="button" className="filter-pill filter-pill--active">
              All Items
            </button>
            <button type="button" className="filter-pill">
              Used in this lab
            </button>
            <button type="button" className="filter-pill">
              Used in another lab
            </button>
          </div>
          <div className="plan-details__toolbar-actions">
            <button type="button" className="btn-primary-dropdown btn-primary-dropdown--sm">
              Add new Items to Plan
              <ChevronDownIcon />
            </button>
            <button type="button" className="btn-solid btn-solid--sm">
              Sync
            </button>
            <button type="button" className="btn-primary-dropdown btn-primary-dropdown--sm">
              Bulk Options
              <ChevronDownIcon />
            </button>
          </div>
        </div>
      </div>

      <div className="recurring-profile">
        <div className="recurring-profile__summary">
          <span>
            <strong>Recurring Profile Id:</strong> 163024000066704011
          </span>
          <span>
            <strong>Total Amount:</strong> INR 0
          </span>
          <span>
            <strong>Start Date:</strong> 06 Jun 2026
          </span>
          <span>
            <strong>Order Form Number:</strong> NA
          </span>
          <span>
            <strong>Frequency:</strong> 1 months
          </span>
          <div className="recurring-profile__summary-right">
            <span>0 / 1 live</span>
            <span className="badge badge--green">1 months</span>
            <button type="button" className="detail-card__link">
              Remove Order Form
            </button>
          </div>
        </div>
        <table className="recurring-table">
          <thead>
            <tr>
              <th>Item Name</th>
              <th>Total available Quantity</th>
              <th>Assigned Quantity</th>
              <th>Amount</th>
              <th>Expected Live Date</th>
              <th>Status</th>
              <th>Zoho Sync</th>
              <th />
            </tr>
          </thead>
          <tbody>
            <tr>
              <td className="recurring-table__item">
                CH LIMS - Subscription Plan - Advance IND
                <span className="badge badge--plan">Plan</span>
                <InfoIcon />
              </td>
              <td>1</td>
              <td>0</td>
              <td>₹0</td>
              <td>-</td>
              <td>
                <span className="badge badge--unused">Unused</span>
              </td>
              <td>
                <CheckCircleIcon />
              </td>
              <td>
                <button type="button" className="btn-solid btn-solid--sm">
                  Add
                </button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
}
