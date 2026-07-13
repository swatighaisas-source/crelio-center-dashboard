import { ACTIVITY_LOG } from "../../data/labDetails";
import { RefreshIcon } from "../Icons";

const FILTERS = ["All", "Payments", "System", "AM"] as const;

interface Props {
  embedded?: boolean;
}

export function ActivityLogPanel({ embedded }: Props) {
  return (
    <aside
      className={`activity-log-panel${embedded ? " activity-log-panel--embedded" : ""}`}
    >
      <div className="activity-log-panel__header">
        <h3>Activity log</h3>
        <div className="activity-log-panel__actions">
          <button type="button" className="activity-log-panel__refresh" aria-label="Refresh">
            <RefreshIcon />
          </button>
          <button type="button" className="activity-log-panel__add">
            + Add Comment
          </button>
        </div>
      </div>
      <div className="activity-log-panel__filters">
        {FILTERS.map((f, i) => (
          <button
            key={f}
            type="button"
            className={`activity-log-filter${i === 0 ? " activity-log-filter--active" : ""}`}
          >
            {f}
          </button>
        ))}
      </div>
      <ul className="activity-log-list">
        {ACTIVITY_LOG.map((entry) => (
          <li key={entry.id} className="activity-log-item">
            <span className="activity-log-item__dot" />
            <div className="activity-log-item__body">
              <p className="activity-log-item__text">{entry.text}</p>
              <div className="activity-log-item__meta-row">
                <span className="activity-log-item__by">By {entry.by}</span>
                <span className="activity-log-item__time">{entry.time}</span>
              </div>
            </div>
          </li>
        ))}
      </ul>
    </aside>
  );
}
