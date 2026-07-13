import { Fragment } from "react";
import { WAITING_LIST_GROUPS, WAITING_LIST_STATUS } from "../../data/waitingList";

const TABS: { id: string; label: string; active?: boolean }[] = [
  { id: "patients", label: "Patients Waiting List", active: true },
  { id: "service", label: "Service-wise Waiting List" },
  { id: "instrument", label: "Instrument-wise Waiting List" },
];

function FilterIcon() {
  return (
    <svg viewBox="0 0 12 12" width="10" height="10" fill="none" aria-hidden>
      <path d="M1 3h10M3 6h6M5 9h2" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" />
    </svg>
  );
}

export function WaitingListWorkspace() {
  return (
    <div className="op-workspace">
      <div className="op-page-header">
        <div className="op-page-header__left">
          <label className="op-select-wrap">
            <span className="visually-hidden">Department</span>
            <select className="op-select" defaultValue="all" aria-label="All Departments">
              <option value="all">All Departments</option>
            </select>
            <span className="op-select__chevron" aria-hidden>
              <svg viewBox="0 0 12 8" width="10" height="7" fill="none">
                <path
                  d="M1.5 1.5L6 6l4.5-4.5"
                  stroke="currentColor"
                  strokeWidth="1.3"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </span>
          </label>
        </div>

        <div className="op-page-header__right">
          <span className="op-page-header__date-label">Accession Date</span>
          <button type="button" className="op-date-range">
            20th May, 2026 - 3rd Jun, 2026
            <svg viewBox="0 0 16 16" width="14" height="14" fill="none" aria-hidden>
              <rect x="2" y="3" width="12" height="11" rx="1.5" stroke="currentColor" strokeWidth="1.2" />
              <path d="M2 6h12M5 1.5V4M11 1.5V4" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" />
            </svg>
          </button>
          <button type="button" className="op-icon-btn" aria-label="Calendar">
            <svg viewBox="0 0 16 16" width="16" height="16" fill="none" aria-hidden>
              <rect x="2" y="3" width="12" height="11" rx="1.5" stroke="currentColor" strokeWidth="1.2" />
              <path d="M2 6h12M5 1.5V4M11 1.5V4" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" />
            </svg>
          </button>
          <button type="button" className="op-icon-btn" aria-label="Settings">
            <svg viewBox="0 0 16 16" width="16" height="16" fill="none" aria-hidden>
              <path
                d="M8 10a2 2 0 100-4 2 2 0 000 4z"
                stroke="currentColor"
                strokeWidth="1.2"
              />
              <path
                d="M13.1 9.4a1.1 1.1 0 00.22 1.22l.04.04a1.35 1.35 0 01-1.9 1.9l-.04-.04a1.1 1.1 0 00-1.22-.22 1.1 1.1 0 00-.68 1.01v.11a1.35 1.35 0 01-2.7 0v-.12a1.1 1.1 0 00-.72-1.01 1.1 1.1 0 00-1.22.22l-.04.04a1.35 1.35 0 01-1.9-1.9l.04-.04a1.1 1.1 0 00.22-1.22 1.1 1.1 0 00-1.01-.68H2.35a1.35 1.35 0 010-2.7h.12a1.1 1.1 0 001.01-.72 1.1 1.1 0 00-.22-1.22l-.04-.04a1.35 1.35 0 011.9-1.9l.04.04a1.1 1.1 0 001.22.22h.05a1.1 1.1 0 001.01-.72V2.35a1.35 1.35 0 012.7 0v.12a1.1 1.1 0 001.01.72 1.1 1.1 0 001.22-.22l.04-.04a1.35 1.35 0 011.9 1.9l-.04.04a1.1 1.1 0 00-.22 1.22v.05a1.1 1.1 0 00.68 1.01h.12a1.35 1.35 0 010 2.7h-.12a1.1 1.1 0 00-1.01.68z"
                stroke="currentColor"
                strokeWidth="1.1"
                strokeLinejoin="round"
              />
            </svg>
          </button>
        </div>
      </div>

      <div className="op-tabs" role="tablist" aria-label="Waiting list views">
        {TABS.map((tab) => (
          <button
            key={tab.id}
            type="button"
            role="tab"
            className={`op-tab${tab.active ? " op-tab--active" : ""}`}
            aria-selected={tab.active}
          >
            {tab.label}
          </button>
        ))}
      </div>

      <div className="op-toolbar">
        <div className="op-toolbar__search-wrap">
          <input
            type="search"
            className="op-toolbar__search"
            placeholder="Select by Patient Id / Name / Accession Number / National ID / DOB(DDMMYYYY)"
            aria-label="Search waiting list"
          />
          <span className="op-toolbar__shortcut">cmd + j</span>
          <button type="button" className="op-toolbar__search-btn" aria-label="Search">
            <svg viewBox="0 0 16 16" width="15" height="15" fill="none" aria-hidden>
              <circle cx="7" cy="7" r="4.5" stroke="currentColor" strokeWidth="1.3" />
              <path d="M10.5 10.5L14 14" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" />
            </svg>
          </button>
        </div>

        <div className="op-toolbar__actions">
          <button type="button" className="op-btn op-btn--outline">
            Refresh
          </button>
          <button type="button" className="op-btn op-btn--primary">
            Submit All
          </button>
          <button type="button" className="op-btn op-btn--primary op-btn--dropdown">
            Work List
            <svg viewBox="0 0 12 8" width="9" height="6" fill="none" aria-hidden>
              <path
                d="M1.5 1.5L6 6l4.5-4.5"
                stroke="currentColor"
                strokeWidth="1.3"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </button>
          <div className="op-view-toggle" role="group" aria-label="View mode">
            <button type="button" className="op-view-toggle__btn op-view-toggle__btn--active" aria-label="List view">
              <svg viewBox="0 0 16 16" width="14" height="14" fill="none" aria-hidden>
                <path d="M3 4h10M3 8h10M3 12h10" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" />
              </svg>
            </button>
            <button type="button" className="op-view-toggle__btn" aria-label="Grid view">
              <svg viewBox="0 0 16 16" width="14" height="14" fill="none" aria-hidden>
                <rect x="3" y="3" width="4" height="4" rx="0.5" stroke="currentColor" strokeWidth="1.2" />
                <rect x="9" y="3" width="4" height="4" rx="0.5" stroke="currentColor" strokeWidth="1.2" />
                <rect x="3" y="9" width="4" height="4" rx="0.5" stroke="currentColor" strokeWidth="1.2" />
                <rect x="9" y="9" width="4" height="4" rx="0.5" stroke="currentColor" strokeWidth="1.2" />
              </svg>
            </button>
          </div>
        </div>
      </div>

      <div className="op-table-panel">
        <div className="op-status-pills">
          <span className="op-status-pill op-status-pill--incomplete">
            Incomplete ({WAITING_LIST_STATUS.incomplete})
          </span>
          <span className="op-status-pill op-status-pill--completed">
            Completed ({WAITING_LIST_STATUS.completed})
          </span>
          <span className="op-status-pill op-status-pill--validated">
            Validated ({WAITING_LIST_STATUS.validated})
          </span>
        </div>

        <div className="op-table-wrap">
          <table className="op-table">
            <thead>
              <tr>
                <th>
                  <span className="op-table__head">
                    Patient ID
                    <FilterIcon />
                  </span>
                </th>
                <th>
                  <span className="op-table__head">
                    Patient Details
                    <FilterIcon />
                  </span>
                </th>
                <th>
                  <span className="op-table__head">
                    Order ID
                    <FilterIcon />
                  </span>
                </th>
                <th>
                  <span className="op-table__head">
                    Accession Number
                    <FilterIcon />
                  </span>
                </th>
                <th>
                  <span className="op-table__head">
                    Provider
                    <FilterIcon />
                  </span>
                </th>
                <th>
                  <span className="op-table__head">
                    Account
                    <FilterIcon />
                  </span>
                </th>
                <th className="op-table__status-col">Incomplete</th>
                <th className="op-table__status-col">Completed</th>
                <th className="op-table__status-col">Validated</th>
              </tr>
            </thead>
            <tbody>
              {WAITING_LIST_GROUPS.map((group) => (
                <Fragment key={group.id}>
                  <tr className="op-table__group-row">
                    <td colSpan={9}>
                      <button type="button" className="op-table__group-toggle" aria-expanded="true">
                        <svg viewBox="0 0 12 8" width="10" height="7" fill="none" aria-hidden>
                          <path
                            d="M1.5 1.5L6 6l4.5-4.5"
                            stroke="currentColor"
                            strokeWidth="1.3"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          />
                        </svg>
                        {group.label} ({group.patients.length})
                      </button>
                    </td>
                  </tr>
                  {group.patients.map((patient) => (
                    <tr key={patient.id} className="op-table__data-row">
                      <td className="op-table__id">{patient.patientId}</td>
                      <td className="op-table__patient">
                        <span className="op-table__patient-name">{patient.name}</span>
                        <span className="op-table__patient-meta">
                          {patient.age}/- {patient.gender}
                        </span>
                        <span className="op-table__service-tags">
                          {patient.services.map((service, index) => (
                            <span key={`${patient.id}-${service}-${index}`} className="op-service-tag">
                              {service}
                            </span>
                          ))}
                        </span>
                      </td>
                      <td>{patient.orderIds.join(", ")}</td>
                      <td>{patient.accessionNumbers.join(", ")}</td>
                      <td>{patient.provider}</td>
                      <td>{patient.account}</td>
                      <td className="op-table__status-col">{patient.incomplete}</td>
                      <td className="op-table__status-col">{patient.completed}</td>
                      <td className="op-table__status-col">{patient.validated}</td>
                    </tr>
                  ))}
                </Fragment>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
