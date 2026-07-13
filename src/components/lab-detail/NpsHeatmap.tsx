import { useMemo } from "react";
import type { FeedbackEntry } from "../../data/labDetails";
import {
  buildLast12NpsMonths,
  npsTone,
  type NpsMonthCell,
} from "./feedbackDetailUtils";

interface Props {
  history: FeedbackEntry[];
  layout?: "grid" | "row";
  selectedKey?: string | null;
  onCellClick?: (cell: NpsMonthCell) => void;
}

function formatScore(nps: number): string {
  return Number.isInteger(nps) ? String(nps) : nps.toFixed(1);
}

export function NpsHeatmap({
  history,
  layout = "grid",
  selectedKey = null,
  onCellClick,
}: Props) {
  const cells = useMemo(() => buildLast12NpsMonths(history), [history]);
  const isRow = layout === "row";

  return (
    <div className={`fb-card__heatmap${isRow ? " fb-card__heatmap--row" : ""}`}>
      <p className="fb-card__heatmap-label">Last 12 months NPS</p>
      <div
        className={`fb-card__heatmap-grid${isRow ? " fb-card__heatmap-grid--row" : ""}`}
        role={onCellClick ? "group" : "img"}
        aria-label="NPS heatmap for the last 12 months"
      >
        {cells.map((cell) => {
          const score = cell.nps;
          const hasScore = score !== null;
          const tone = hasScore ? npsTone(Math.round(score)) : "empty";
          const isSelected = selectedKey === cell.key;
          const className = [
            "fb-card__heatmap-cell",
            `fb-card__heatmap-cell--${tone}`,
            cell.isCurrentMonth ? "fb-card__heatmap-cell--current" : "",
            onCellClick ? "fb-card__heatmap-cell--clickable" : "",
            isSelected ? "fb-card__heatmap-cell--selected" : "",
          ]
            .filter(Boolean)
            .join(" ");

          const title = hasScore
            ? `${cell.label} ${cell.year}: NPS ${formatScore(score)}`
            : `${cell.label} ${cell.year}: No submission`;

          if (onCellClick) {
            return (
              <button
                key={cell.key}
                type="button"
                className={className}
                title={title}
                aria-pressed={isSelected}
                onClick={() => onCellClick(cell)}
              >
                <span className="fb-card__heatmap-month">{cell.label}</span>
                <span className="fb-card__heatmap-score">
                  {hasScore ? formatScore(score) : "—"}
                </span>
              </button>
            );
          }

          return (
            <div key={cell.key} className={className} title={title}>
              <span className="fb-card__heatmap-month">{cell.label}</span>
              <span className="fb-card__heatmap-score">
                {hasScore ? formatScore(score) : "—"}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
