import {
  COLLECTIONS_CASH_INR,
  COLLECTIONS_OTHER_INR,
  COLLECTIONS_TOTAL_INR,
  FINANCE_DUE_BY_MONTH,
  FINANCE_MONTHS,
  FINANCE_PAID_BY_MONTH,
  FINANCE_TOTAL_INR,
  LOGIN_BREAKDOWN,
  LOGIN_TOTAL,
} from "../../data/oldAccountOverviewDashboard";

const CHART_H = 140;
const BAR_W = 28;
function formatInr(amount: number): string {
  return `₹ ${amount.toLocaleString("en-IN")}`;
}

function FinanceBarChart() {
  const max = Math.max(...FINANCE_DUE_BY_MONTH, ...FINANCE_PAID_BY_MONTH, 1);

  return (
    <div className="ao-dash-chart ao-dash-chart--bars">
      <div className="ao-dash-chart__plot" style={{ height: CHART_H }}>
        {FINANCE_MONTHS.map((month, i) => {
          const due = FINANCE_DUE_BY_MONTH[i];
          const paid = FINANCE_PAID_BY_MONTH[i];
          const dueH = (due / max) * (CHART_H - 24);
          const paidH = (paid / max) * (CHART_H - 24);
          return (
            <div key={month} className="ao-dash-bar-group" style={{ width: BAR_W }}>
              <div className="ao-dash-bar-stack" style={{ height: CHART_H - 20 }}>
                {due > 0 && (
                  <div
                    className="ao-dash-bar ao-dash-bar--due"
                    style={{ height: `${dueH}px` }}
                    title={`Due: ${formatInr(due)}`}
                  />
                )}
                {paid > 0 && (
                  <div
                    className="ao-dash-bar ao-dash-bar--paid"
                    style={{ height: `${Math.max(paidH, 4)}px` }}
                    title={`Paid: ${formatInr(paid)}`}
                  />
                )}
              </div>
              <span className="ao-dash-bar-group__label">{month}</span>
            </div>
          );
        })}
      </div>
      <div className="ao-dash-legend">
        <span className="ao-dash-legend__item">
          <span className="ao-dash-legend__swatch ao-dash-legend__swatch--due" />
          Due: {formatInr(6_666_872)}
        </span>
        <span className="ao-dash-legend__item">
          <span className="ao-dash-legend__swatch ao-dash-legend__swatch--paid" />
          Paid: {formatInr(188)}
        </span>
      </div>
    </div>
  );
}

function DonutChart({
  segments,
  size = 120,
}: {
  segments: { value: number; color: string }[];
  size?: number;
}) {
  const total = segments.reduce((s, x) => s + x.value, 0);
  const r = size / 2 - 10;
  const c = 2 * Math.PI * r;
  let offset = 0;

  if (total === 0) {
    return (
      <svg width={size} height={size} className="ao-dash-donut" aria-hidden>
        <circle cx={size / 2} cy={size / 2} r={r} fill="none" stroke="#e8eaed" strokeWidth="16" />
      </svg>
    );
  }

  return (
    <svg width={size} height={size} className="ao-dash-donut" aria-hidden>
      {segments.map((seg, i) => {
        if (seg.value <= 0) return null;
        const len = (seg.value / total) * c;
        const dash = `${len} ${c - len}`;
        const el = (
          <circle
            key={i}
            cx={size / 2}
            cy={size / 2}
            r={r}
            fill="none"
            stroke={seg.color}
            strokeWidth="16"
            strokeDasharray={dash}
            strokeDashoffset={-offset}
            transform={`rotate(-90 ${size / 2} ${size / 2})`}
          />
        );
        offset += len;
        return el;
      })}
    </svg>
  );
}

function PeriodSelect({ value }: { value: string }) {
  return (
    <select className="ao-dash-card__period" defaultValue={value} aria-label="Time period">
      <option value="12m">Last 12 Months</option>
      <option value="6m">Last 6 Months</option>
      <option value="today">Today</option>
    </select>
  );
}

export function AccountOverviewDashboard() {
  const collectionsSegments = [
    { value: COLLECTIONS_CASH_INR, color: "#1890ff" },
    { value: COLLECTIONS_OTHER_INR, color: "#52c41a" },
  ];
  const loginSegments = LOGIN_BREAKDOWN.map((x) => ({ value: x.value, color: x.color }));

  return (
    <div className="ao-dash">
      <div className="ao-dash-grid">
        <article className="ao-dash-card">
          <header className="ao-dash-card__head">
            <h3 className="ao-dash-card__title">Finance: {formatInr(FINANCE_TOTAL_INR)}</h3>
            <PeriodSelect value="12m" />
          </header>
          <FinanceBarChart />
          <button type="button" className="ao-dash-card__link">
            Revenue Insights →
          </button>
        </article>

        <article className="ao-dash-card">
          <header className="ao-dash-card__head">
            <h3 className="ao-dash-card__title">Your Collections: {formatInr(COLLECTIONS_TOTAL_INR)}</h3>
            <PeriodSelect value="12m" />
          </header>
          <div className="ao-dash-card__donut-row">
            <DonutChart segments={collectionsSegments} />
            <ul className="ao-dash-card__legend-list">
              <li>
                <span className="ao-dash-legend__swatch" style={{ background: "#1890ff" }} />
                Cash Collection: {formatInr(COLLECTIONS_CASH_INR)}
              </li>
              <li>
                <span className="ao-dash-legend__swatch" style={{ background: "#52c41a" }} />
                Others Collection: {formatInr(COLLECTIONS_OTHER_INR)}
              </li>
            </ul>
          </div>
          <button type="button" className="ao-dash-card__link">
            Collection Insights →
          </button>
        </article>

        <article className="ao-dash-card">
          <header className="ao-dash-card__head">
            <h3 className="ao-dash-card__title">Total Logins: {LOGIN_TOTAL}</h3>
            <span className="ao-dash-card__period ao-dash-card__period--static">Today</span>
          </header>
          <div className="ao-dash-card__donut-row">
            <DonutChart segments={loginSegments} size={110} />
            <ul className="ao-dash-card__legend-list">
              {LOGIN_BREAKDOWN.map((row) => (
                <li key={row.label}>
                  <span className="ao-dash-legend__swatch" style={{ background: row.color }} />
                  {row.label}: {row.value}
                </li>
              ))}
            </ul>
          </div>
        </article>

        <article className="ao-dash-card">
          <header className="ao-dash-card__head">
            <h3 className="ao-dash-card__title">Average Patient&apos;s Rating: 0.00</h3>
            <PeriodSelect value="12m" />
          </header>
          <div className="ao-dash-empty">
            <div className="ao-dash-empty__icon" aria-hidden>
              <svg viewBox="0 0 48 48" width="48" height="48" fill="none">
                <rect x="8" y="12" width="32" height="24" rx="2" stroke="#d9d9d9" strokeWidth="1.5" />
                <path d="M16 22h16M16 28h10" stroke="#d9d9d9" strokeWidth="1.5" strokeLinecap="round" />
              </svg>
            </div>
            <p className="ao-dash-empty__text">No Data Available</p>
          </div>
        </article>
      </div>
    </div>
  );
}
