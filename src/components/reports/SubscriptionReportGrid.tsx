import { ColumnMenuIcon } from "../Icons";
import { SidePanel } from "../SidePanel";

/** Placeholder renewal-style report for non–product-feedback report types */
const DEMO_ROWS = [
  { id: 12922, name: "Bhargavi Health Care", category: "Premium", mrr: 15104 },
  { id: 12921, name: "Sri Sai Diagnostics", category: "Standard", mrr: 8500 },
  { id: 12920, name: "Metro Lab Services", category: "Standard", mrr: 12300 },
  { id: 12919, name: "City Care Pathology", category: "Premium", mrr: 9800 },
  { id: 12918, name: "Wellness Diagnostics Hub", category: "Standard", mrr: 11200 },
];

function formatInr(n: number) {
  return n.toLocaleString("en-IN");
}

export function SubscriptionReportGrid() {
  return (
    <>
      <div className="grid-container">
        <div className="row-group-bar">Drag here to set row groups</div>
        <div className="data-grid data-grid--reports">
          <table>
            <thead>
              <tr>
                {["Lab Id", "Lab Name", "Lab Category", "MRR", "January Invoice", "January Payment", "February Invoice", "February Payment", "March Invoice"].map(
                  (label) => (
                    <th key={label}>
                      <span className="th-inner">
                        <span>{label}</span>
                        <ColumnMenuIcon />
                      </span>
                    </th>
                  ),
                )}
              </tr>
            </thead>
            <tbody>
              {DEMO_ROWS.map((row) => (
                <tr key={row.id}>
                  <td>{row.id}</td>
                  <td>{row.name}</td>
                  <td>{row.category}</td>
                  <td className="col-mrr">{formatInr(row.mrr)}</td>
                  <td>{formatInr(Math.round(row.mrr * 0.95))}</td>
                  <td>{formatInr(Math.round(row.mrr * 0.9))}</td>
                  <td>{formatInr(row.mrr)}</td>
                  <td>{formatInr(Math.round(row.mrr * 0.88))}</td>
                  <td>{formatInr(row.mrr)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
      <SidePanel />
    </>
  );
}
