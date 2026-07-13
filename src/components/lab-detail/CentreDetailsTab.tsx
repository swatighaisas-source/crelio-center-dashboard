import type { LabDetail } from "../../data/labDetails";
import { ActivityChart } from "./ActivityChart";
import { ActivityLogPanel } from "./ActivityLogPanel";
import { SPOCCard } from "./SPOCCard";
import { LabProfileCard } from "./LabProfileCard";
import { useLabs } from "../../context/LabsContext";

const BOTTOM_TABS = [
  "Current State",
  "Interfaces",
  "Communication",
  "Activity log",
  "Freshdesk Tickets",
] as const;

interface Props {
  lab: LabDetail;
}

export function CentreDetailsTab({ lab }: Props) {
  const { updateLabOnboardingSnapshot } = useLabs();

  return (
    <div className="centre-details">
      <div className="centre-details__main">
        <div className="centre-details__grid">
          <div className="centre-details__col centre-details__col--left">
            <div className="detail-card detail-card--billing">
              <div className="detail-card__header">
                <h3>Billing Info</h3>
                <span className="badge badge--primary">Primary Billing Centre</span>
              </div>
              <div className="billing-zoho">
                <span className="billing-zoho__label">Zoho Contact ID</span>
                <div className="billing-zoho__actions">
                  <button type="button" className="btn-secondary btn-secondary--sm">
                    Edit
                  </button>
                  <button type="button" className="btn-secondary btn-secondary--sm">
                    Sync
                  </button>
                </div>
              </div>
              <p className="billing-zoho__id">{lab.zohoContactId}</p>
              <dl className="detail-dl detail-dl--stacked">
                <div>
                  <dt>Legal Entity</dt>
                  <dd>-</dd>
                </div>
                <div>
                  <dt>Billing Entity</dt>
                  <dd>-</dd>
                </div>
                <div>
                  <dt>Billing Cycle</dt>
                  <dd>Quarterly</dd>
                </div>
                <div>
                  <dt>Billing Day of the Month</dt>
                  <dd>-</dd>
                </div>
                <div>
                  <dt>Credit Days</dt>
                  <dd>-</dd>
                </div>
              </dl>
              <div className="detail-card__subheader">
                <h4>Related Billing Centres (0)</h4>
                <button type="button" className="btn-secondary btn-secondary--sm">
                  Edit
                </button>
              </div>
              <div className="billing-links">
                <button type="button" className="billing-links__item">
                  Enable Portal Access
                </button>
                <button type="button" className="billing-links__item">
                  Enable Payment Reminders
                </button>
                <button type="button" className="billing-links__item">
                  Send Invoices
                </button>
              </div>
            </div>
            <SPOCCard spocs={lab.spocs} />
          </div>

          <div className="centre-details__col centre-details__col--center">
            <div className="detail-card detail-card--activity">
              <div className="detail-card__header">
                <h3>Last Activity (7 days)</h3>
                <button type="button" className="detail-card__link">
                  View Grafana
                </button>
              </div>
              <div className="mini-tabs">
                <button type="button" className="mini-tab mini-tab--active">
                  LIMS
                </button>
                <button type="button" className="mini-tab">
                  CRM
                </button>
                <button type="button" className="mini-tab">
                  INVENTORY
                </button>
              </div>
              <div className="metric-boxes">
                <div className="metric-box">
                  <span className="metric-box__label">Total Bills</span>
                  <span className="metric-box__value">10</span>
                </div>
                <div className="metric-box">
                  <span className="metric-box__label">Avg. Bill Amount/Bill</span>
                  <span className="metric-box__value">Rs 0</span>
                </div>
                <div className="metric-box">
                  <span className="metric-box__label">Avg. Reports/Bill</span>
                  <span className="metric-box__value">1</span>
                </div>
              </div>
              <div className="chart-legend">
                <span>
                  <i className="chart-legend__dot chart-legend__dot--purple" />
                  Total Bills
                </span>
                <span>
                  <i className="chart-legend__dot chart-legend__dot--green" />
                  Reports Submitted
                </span>
              </div>
              <ActivityChart />
            </div>
            <LabProfileCard
              snapshot={lab.onboardingSnapshot}
              onSave={(snapshot) => updateLabOnboardingSnapshot(lab.id, snapshot)}
            />
          </div>
        </div>

        <div className="centre-details__footer">
          <div className="centre-details__bottom">
            <div className="bottom-tabs">
              {BOTTOM_TABS.map((tab) => (
                <button
                  key={tab}
                  type="button"
                  className={`bottom-tab${tab === "Current State" ? " bottom-tab--active" : ""}`}
                >
                  {tab}
                </button>
              ))}
            </div>
            <div className="bottom-placeholder" aria-hidden />
          </div>
          <ActivityLogPanel embedded />
        </div>
      </div>
    </div>
  );
}
