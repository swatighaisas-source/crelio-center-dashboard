import { useMemo } from "react";
import { useLabs } from "../../context/LabsContext";
import { buildProductFeedbackReportRows } from "../../data/reports";
import { npsTone } from "../../data/labs";
import { ColumnMenuIcon } from "../Icons";
import { SidePanel } from "../SidePanel";

const REPORT_COL = {
  labId: 80,
  labName: 200,
  labType: 180,
  nps: 88,
  feedbackDate: 132,
  submittedBy: 150,
  npsComment: 280,
} as const;

function reportTableWidth(): number {
  return Object.values(REPORT_COL).reduce((sum, width) => sum + width, 0);
}

export function ProductFeedbackReportGrid() {
  const { labs, getLabDetail } = useLabs();

  const rows = useMemo(
    () => buildProductFeedbackReportRows(labs, getLabDetail),
    [labs, getLabDetail],
  );

  const tableWidth = reportTableWidth();

  return (
    <>
      <div className="grid-container grid-container--reports">
        <div className="row-group-bar">Drag here to set row groups</div>
        <div
          className="reports-table-scroll data-grid data-grid--reports"
          tabIndex={0}
          aria-label="Product feedback report table"
        >
          <table style={{ width: tableWidth, minWidth: tableWidth }}>
            <colgroup>
              <col style={{ width: REPORT_COL.labId }} />
              <col style={{ width: REPORT_COL.labName }} />
              <col style={{ width: REPORT_COL.labType }} />
              <col style={{ width: REPORT_COL.nps }} />
              <col style={{ width: REPORT_COL.feedbackDate }} />
              <col style={{ width: REPORT_COL.submittedBy }} />
              <col style={{ width: REPORT_COL.npsComment }} />
            </colgroup>
            <thead>
              <tr>
                <th className="col-lab-id">
                  <span className="th-inner">
                    <span>Lab Id</span>
                    <ColumnMenuIcon />
                  </span>
                </th>
                <th className="col-lab-name">
                  <span className="th-inner">
                    <span>Lab Name</span>
                    <ColumnMenuIcon />
                  </span>
                </th>
                <th className="col-lab-type">
                  <span className="th-inner">
                    <span>Lab Type</span>
                    <ColumnMenuIcon />
                  </span>
                </th>
                <th className="col-nps">
                  <span className="th-inner">
                    <span>NPS Score</span>
                    <ColumnMenuIcon />
                  </span>
                </th>
                <th className="col-feedback-date">
                  <span className="th-inner">
                    <span>Feedback Date</span>
                    <ColumnMenuIcon />
                  </span>
                </th>
                <th className="col-submitted-by">
                  <span className="th-inner">
                    <span>Submitted By</span>
                    <ColumnMenuIcon />
                  </span>
                </th>
                <th className="col-nps-comment">
                  <span className="th-inner">
                    <span>NPS Comment</span>
                    <ColumnMenuIcon />
                  </span>
                </th>
              </tr>
            </thead>
            <tbody>
              {rows.map((row) => (
                <tr key={row.labId}>
                  <td className="col-lab-id">{row.labId}</td>
                  <td className="col-lab-name">{row.labName}</td>
                  <td className="col-lab-type" title={row.labType}>
                    {row.labType}
                  </td>
                  <td className="col-nps">
                    {row.nps !== null ? (
                      <span className={`grid-nps grid-nps--${npsTone(row.nps)}`}>
                        {row.nps}
                        <span className="grid-nps__max">/10</span>
                      </span>
                    ) : (
                      <span className="grid-nps grid-nps--empty">—</span>
                    )}
                  </td>
                  <td className="col-feedback-date">{row.feedbackDate ?? "—"}</td>
                  <td className="col-submitted-by">{row.submittedBy ?? "—"}</td>
                  <td className="col-nps-comment">{row.npsComment ?? "—"}</td>
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
