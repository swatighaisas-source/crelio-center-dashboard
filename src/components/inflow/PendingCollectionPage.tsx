import type { PropagatedExceptions } from "../../data/inflow/exceptionTypes";
import type { Sample } from "../../data/inflow/mockSamples";
import { ExceptionTags } from "./ExceptionTags";

type Props = {
  samples: Sample[];
  getExceptionsForSample: (sample: Sample) => PropagatedExceptions;
  onSelectSample: (sampleId: string) => void;
  onCollectSample: (sampleId: string) => void;
};

export function PendingCollectionPage({ samples, getExceptionsForSample, onSelectSample, onCollectSample }: Props) {
  return (
    <section className="sample-list-page">
      <div className="sample-search-top">
        <input placeholder="Select by Patient Id / Name / Accession Number / National ID / DOB(DDMMYYYY)" />
        <button>⌕</button>
        <button>|||</button>
        <div className="sample-updated">
          <label>Last Updated Date</label>
          <span>10th May, 2026 - 13th May, 2026</span>
          <button>▣</button>
        </div>
      </div>

      <div className="sample-toolbar">
        <select defaultValue="All Departments">
          <option>All Departments</option>
        </select>
        <span />
        <button>Open Filters ▼</button>
        <button className="blue">Work List ▼</button>
        <button>Scan Mode ▦</button>
        <button>Print All</button>
      </div>

      <div className="sample-table-card">
        <div className="rows-count">Rows: {samples.length}</div>
        <table>
          <thead>
            <tr>
              <th><input type="checkbox" /> Accession No<span className="filter-icon">▼</span></th>
              <th>Account Name<span className="filter-icon">▼</span></th>
              <th>Patient Details<span className="filter-icon">▼</span></th>
              <th>Services</th>
              <th>Sample Type<span className="filter-icon">▼</span></th>
              <th>Order Date<span className="filter-icon">▼</span></th>
              <th />
            </tr>
          </thead>
          <tbody>
            {samples.length === 0 ? (
              <tr>
                <td colSpan={7} className="pending-empty">
                  No samples awaiting collection.
                </td>
              </tr>
            ) : (
              samples.map((sample) => (
                <tr
                  key={sample.id}
                  onClick={() => onSelectSample(sample.id)}
                  onKeyDown={(event) => {
                    if (event.key === "Enter" || event.key === " ") {
                      onSelectSample(sample.id);
                    }
                  }}
                  role="button"
                  tabIndex={0}
                >
                  <td><input type="checkbox" /> {sample.accessionNo}{sample.parentSampleId ? <small> (Recollect)</small> : null}</td>
                  <td>{sample.accountName}</td>
                  <td>
                    <strong>{sample.patientName}</strong>
                    <small>{sample.patientMeta}</small>
                    <ExceptionTags exceptions={getExceptionsForSample(sample)} />
                  </td>
                  <td>{sample.services.map((line) => <span key={line}>{line}</span>)}</td>
                  <td><span className="sample-dot" /> {sample.sampleType}<small>Vial Count: 1</small></td>
                  <td>{sample.orderDate}</td>
                  <td className="sample-actions">
                    <button
                      type="button"
                      className="blue"
                      onClick={(event) => {
                        event.stopPropagation();
                        onCollectSample(sample.id);
                      }}
                    >
                      Collect Sample
                    </button>
                    <button
                      type="button"
                      className="blue"
                      onClick={(event) => {
                        event.stopPropagation();
                      }}
                    >
                      Print Userwise Barcode
                    </button>
                    <span>⋮</span>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </section>
  );
}
