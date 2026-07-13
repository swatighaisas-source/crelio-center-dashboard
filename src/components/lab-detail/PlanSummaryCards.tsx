import { Link } from "react-router-dom";
import type { LabDetail } from "../../data/labDetails";
import { EditIcon } from "../Icons";
import { formatMrr } from "../../data/labs";

interface Props {
  lab: LabDetail;
  labId: number;
  compact?: boolean;
}

export function PlanSummaryCards({ lab, labId, compact }: Props) {
  if (compact) {
    return (
      <div className="detail-card detail-card--plan-invoices">
        <section className="plan-invoices__section">
          <div className="detail-card__header">
            <h3>Plan Details</h3>
            <Link to={`/lab/${labId}/plan`} className="detail-card__link">
              View Plan Details
            </Link>
          </div>
          <dl className="detail-dl detail-dl--plan">
            <div>
              <dt>Current Plan</dt>
              <dd>{lab.currentPlan}</dd>
            </div>
            <div>
              <dt>Plan Type</dt>
              <dd>
                {lab.planType}
                <EditIcon />
              </dd>
            </div>
            <div>
              <dt>Total MRR</dt>
              <dd>
                INR {formatMrr(lab.mrr)} / {formatMrr(lab.mrr)}
                <EditIcon />
              </dd>
            </div>
            <div>
              <dt>Current Balance</dt>
              <dd>INR {lab.currentBalance}</dd>
            </div>
            <div>
              <dt>Last Payment Date</dt>
              <dd>-</dd>
            </div>
          </dl>
          <div className="plan-summary__sync-row">
            <button type="button" className="btn-secondary btn-secondary--sm plan-summary__sync">
              Sync
            </button>
          </div>
        </section>

        <div className="plan-invoices__divider" role="separator" />

        <section className="plan-invoices__section">
          <div className="detail-card__header">
            <h3>Invoices</h3>
            <button type="button" className="detail-card__link">
              View Invoices and Payments
            </button>
          </div>
          <dl className="detail-dl detail-dl--plan">
            <div>
              <dt>Total Invoices</dt>
              <dd>0</dd>
            </div>
            <div>
              <dt>Due Since</dt>
              <dd>No Due Date</dd>
            </div>
          </dl>
        </section>
      </div>
    );
  }

  return (
    <div className="plan-summary">
      <div className="plan-summary__left">
        <div className="detail-card detail-card--compact">
          <div className="detail-card__header">
            <h3>Plan Details</h3>
            <Link to={`/lab/${labId}/plan`} className="detail-card__link">
              View Plan Details
            </Link>
          </div>
          <dl className="detail-dl">
            <div>
              <dt>Current Plan</dt>
              <dd>{lab.currentPlan}</dd>
            </div>
            <div>
              <dt>Plan Type</dt>
              <dd>
                {lab.planType}
                <EditIcon />
              </dd>
            </div>
            <div>
              <dt>Total MRR</dt>
              <dd>
                INR {formatMrr(lab.mrr)} / {formatMrr(lab.mrr)}
                <EditIcon />
              </dd>
            </div>
            <div>
              <dt>Current Balance</dt>
              <dd>INR {lab.currentBalance}</dd>
            </div>
            <div>
              <dt>Last Payment Date</dt>
              <dd>-</dd>
            </div>
          </dl>
          <div className="plan-summary__sync-row">
            <button type="button" className="btn-secondary btn-secondary--sm plan-summary__sync">
              Sync
            </button>
          </div>
        </div>
        <div className="detail-card detail-card--compact">
          <div className="detail-card__header">
            <h3>Invoices</h3>
            <span className="detail-card__link">View Invoices and Payments</span>
          </div>
          <dl className="detail-dl">
            <div>
              <dt>Total Invoices</dt>
              <dd>0</dd>
            </div>
            <div>
              <dt>Due Since</dt>
              <dd>No Due Date</dd>
            </div>
          </dl>
        </div>
      </div>
      <div className="detail-card plan-summary__metrics">
        <dl className="metrics-grid">
          <div>
            <dt>Total OF Amount</dt>
            <dd>INR 0</dd>
          </div>
          <div>
            <dt>Live Amount</dt>
            <dd>INR 0</dd>
          </div>
          <div>
            <dt>Live/Pending Items Count</dt>
            <dd>0/0</dd>
          </div>
          <div>
            <dt>Total amount realisation date</dt>
            <dd>29 May 2026</dd>
          </div>
        </dl>
      </div>
    </div>
  );
}
