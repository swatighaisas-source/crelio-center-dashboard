import { useMemo } from "react";
import type { ParameterColumnKey } from "../../../data/dataCleanupDemo";
import {
  PARAMETER_SHEET_COLUMNS,
  buildParameterSheetRows,
  displayCellValue,
  parameterSheetComments,
} from "../../../data/dataCleanupDemo";
import { SeverityBadge } from "./SeverityBadge";

interface Props {
  showRevised: boolean;
  activeFixId: string | null;
  onSelectFix: (fixId: string | null) => void;
}

export function ParameterSheetGrid({ showRevised, activeFixId, onSelectFix }: Props) {
  const rows = useMemo(() => buildParameterSheetRows(showRevised), [showRevised]);
  const comments = useMemo(() => parameterSheetComments(showRevised), [showRevised]);

  const highlighted = useMemo(() => {
    if (!activeFixId) return new Set<string>();
    const comment = comments.find((c) => c.fixId === activeFixId);
    if (!comment) return new Set<string>();
    return new Set(comment.locations.map((loc) => `${loc.rowId}:${loc.columnKey}`));
  }, [activeFixId, comments]);

  function isHighlighted(rowId: string, key: ParameterColumnKey) {
    return highlighted.has(`${rowId}:${key}`);
  }

  function cellHasComment(cell: { fixId?: string }) {
    if (!cell.fixId) return false;
    return comments.some((c) => c.fixId === cell.fixId);
  }

  return (
    <div className="dc-excel-body">
      <div className="dc-excel-grid-wrap dc-excel-grid-wrap--parameter">
        <table className="dc-excel-grid dc-excel-grid--parameter">
          <thead>
            <tr>
              <th className="dc-excel-grid__row-num" scope="col" aria-hidden />
              {PARAMETER_SHEET_COLUMNS.map((col) => (
                <th
                  key={col.key}
                  scope="col"
                  className={col.group === "age" ? "dc-excel-grid__th--age" : undefined}
                >
                  {col.label}
                </th>
              ))}
            </tr>
            <tr className="dc-excel-grid__group-row">
              <th aria-hidden />
              <th colSpan={4} className="dc-excel-grid__group-label">
                Parameter
              </th>
              <th colSpan={8} className="dc-excel-grid__group-label dc-excel-grid__group-label--age">
                Age-based ranges
              </th>
            </tr>
          </thead>
          <tbody>
            {rows.map((row, idx) => (
              <tr
                key={row.id}
                className={row.isFirstOfParameter ? "dc-excel-grid__row--param-start" : ""}
              >
                <td className="dc-excel-grid__row-num">{idx + 1}</td>
                {PARAMETER_SHEET_COLUMNS.map((col) => {
                  const cell = row.cells[col.key];
                  const showMarker = cellHasComment(cell);
                  const active = isHighlighted(row.id, col.key);
                  const display = displayCellValue(cell, showRevised);
                  const isContinued =
                    !row.isFirstOfParameter &&
                    (col.key === "parameter" ||
                      col.key === "parameterCode" ||
                      col.key === "unit" ||
                      col.key === "refRange");

                  return (
                    <td
                      key={col.key}
                      className={[
                        col.group === "age" ? "dc-excel-grid__cell--age" : "",
                        isContinued ? "dc-excel-grid__cell--continued" : "",
                        showMarker ? "dc-excel-grid__cell--comment" : "",
                        cell.changed && !showRevised ? "dc-excel-grid__cell--dirty" : "",
                        cell.changed && showRevised ? "dc-excel-grid__cell--fixed" : "",
                        active ? "dc-excel-grid__cell--active" : "",
                      ]
                        .filter(Boolean)
                        .join(" ") || undefined}
                    >
                      <span className="dc-excel-grid__value">
                        {isContinued ? "" : display}
                      </span>
                      {showMarker && (
                        <button
                          type="button"
                          className={`dc-excel-grid__marker${activeFixId === cell.fixId ? " dc-excel-grid__marker--open" : ""}`}
                          aria-label="View correction"
                          onClick={() =>
                            onSelectFix(activeFixId === cell.fixId ? null : (cell.fixId ?? null))
                          }
                        />
                      )}
                    </td>
                  );
                })}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <aside className="dc-excel-notes" aria-label="Sheet notes">
        <div className="dc-excel-notes__head">
          <span className="dc-excel-notes__title">Notes</span>
          <span className="dc-excel-notes__count">{comments.length}</span>
        </div>
        {comments.length === 0 ? (
          <p className="dc-excel-notes__empty">No corrections on this sheet</p>
        ) : (
          <ul className="dc-excel-notes__list">
            {comments.map((comment) => {
              const isOpen = activeFixId === comment.fixId;
              return (
                <li key={comment.fixId}>
                  <button
                    type="button"
                    className={`dc-excel-note${isOpen ? " dc-excel-note--open" : ""}`}
                    aria-expanded={isOpen}
                    onClick={() => onSelectFix(isOpen ? null : comment.fixId)}
                  >
                    <span className="dc-excel-note__top">
                      <SeverityBadge severity={comment.fix.severity} />
                      <span className="dc-excel-note__field">{comment.fix.field}</span>
                    </span>
                    <span className="dc-excel-note__summary">
                      {comment.fix.current} → {comment.fix.suggested}
                    </span>
                  </button>
                </li>
              );
            })}
          </ul>
        )}
      </aside>
    </div>
  );
}
