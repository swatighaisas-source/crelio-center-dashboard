import { useMemo } from "react";
import type { SheetTab, UnifiedColumnKey } from "../../../data/dataCleanupDemo";
import {
  SHEET_TAB_COLUMNS,
  displayCellValue,
  sheetCommentsForTab,
  sheetRowsForTab,
} from "../../../data/dataCleanupDemo";
import { ParameterSheetGrid } from "./ParameterSheetGrid";
import { SeverityBadge } from "./SeverityBadge";

type StandardSheetTab = Exclude<SheetTab, "parameter">;

interface Props {
  activeTab: SheetTab;
  showRevised: boolean;
  activeFixId: string | null;
  onSelectFix: (fixId: string | null) => void;
}

interface StandardGridProps {
  activeTab: StandardSheetTab;
  showRevised: boolean;
  activeFixId: string | null;
  onSelectFix: (fixId: string | null) => void;
}

function StandardSheetGrid({
  activeTab,
  showRevised,
  activeFixId,
  onSelectFix,
}: StandardGridProps) {
  const rows = useMemo(() => sheetRowsForTab(activeTab), [activeTab]);
  const columns = SHEET_TAB_COLUMNS[activeTab];
  const comments = useMemo(
    () => sheetCommentsForTab(activeTab, showRevised),
    [activeTab, showRevised],
  );

  const highlighted = useMemo(() => {
    if (!activeFixId) return new Set<string>();
    const comment = comments.find((c) => c.fixId === activeFixId);
    if (!comment) return new Set<string>();
    return new Set(comment.locations.map((loc) => `${loc.rowId}:${loc.columnKey}`));
  }, [activeFixId, comments]);

  function isHighlighted(rowId: string, key: UnifiedColumnKey) {
    return highlighted.has(`${rowId}:${key}`);
  }

  function cellHasComment(cell: { fixId?: string }) {
    if (!cell.fixId) return false;
    return comments.some((c) => c.fixId === cell.fixId);
  }

  return (
    <div className="dc-excel-body">
      <div className="dc-excel-grid-wrap">
        <table className="dc-excel-grid">
          <thead>
            <tr>
              <th className="dc-excel-grid__row-num" scope="col" aria-hidden />
              {columns.map((col) => (
                <th key={col.key} scope="col">
                  {col.label}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {rows.map((row, idx) => (
              <tr key={row.id}>
                <td className="dc-excel-grid__row-num">{idx + 1}</td>
                {columns.map((col) => {
                  const cell = row.cells[col.key];
                  const showMarker = cellHasComment(cell);
                  const active = isHighlighted(row.id, col.key);
                  const display = displayCellValue(cell, showRevised);
                  return (
                    <td
                      key={col.key}
                      className={[
                        showMarker ? "dc-excel-grid__cell--comment" : "",
                        cell.changed && !showRevised ? "dc-excel-grid__cell--dirty" : "",
                        cell.changed && showRevised ? "dc-excel-grid__cell--fixed" : "",
                        active ? "dc-excel-grid__cell--active" : "",
                      ]
                        .filter(Boolean)
                        .join(" ") || undefined}
                    >
                      <span className="dc-excel-grid__value">{display}</span>
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

export function ExcelWorkbook({ activeTab, showRevised, activeFixId, onSelectFix }: Props) {
  if (activeTab === "parameter") {
    return (
      <ParameterSheetGrid
        showRevised={showRevised}
        activeFixId={activeFixId}
        onSelectFix={onSelectFix}
      />
    );
  }

  return (
    <StandardSheetGrid
      activeTab={activeTab}
      showRevised={showRevised}
      activeFixId={activeFixId}
      onSelectFix={onSelectFix}
    />
  );
}
