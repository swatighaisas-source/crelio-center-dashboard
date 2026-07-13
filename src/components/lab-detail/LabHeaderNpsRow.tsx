import { useState } from "react";
import type { FeedbackEntry } from "../../data/labDetails";
import {
  formatNpsMonthHeading,
  getFeedbackEntriesForMonth,
  type NpsMonthCell,
} from "./feedbackDetailUtils";
import { FeedbackDetailModal } from "./FeedbackDetailModal";
import { NpsHeatmap } from "./NpsHeatmap";

interface Props {
  history: FeedbackEntry[];
}

export function LabHeaderNpsRow({ history }: Props) {
  const [detailOpen, setDetailOpen] = useState(false);
  const [selectedMonth, setSelectedMonth] = useState<NpsMonthCell | null>(null);
  const [monthDetailOpen, setMonthDetailOpen] = useState(false);

  function handleCellClick(cell: NpsMonthCell) {
    setSelectedMonth(cell);
    setMonthDetailOpen(true);
  }

  function closeMonthDetail() {
    setMonthDetailOpen(false);
    setSelectedMonth(null);
  }

  const monthEntries = selectedMonth
    ? getFeedbackEntriesForMonth(history, selectedMonth.key)
    : [];

  return (
    <>
      <div className="lab-header__nps">
        <NpsHeatmap
          history={history}
          layout="row"
          selectedKey={selectedMonth?.key ?? null}
          onCellClick={handleCellClick}
        />
        {history.length > 0 && (
          <button
            type="button"
            className="btn-secondary btn-secondary--sm lab-header__nps-view-details"
            onClick={() => setDetailOpen(true)}
          >
            View details
          </button>
        )}
      </div>

      <FeedbackDetailModal
        open={monthDetailOpen}
        onClose={closeMonthDetail}
        history={monthEntries}
        title={selectedMonth ? formatNpsMonthHeading(selectedMonth) : undefined}
        emptyMessage={
          selectedMonth
            ? `No feedback submitted for ${formatNpsMonthHeading(selectedMonth)}.`
            : undefined
        }
      />

      <FeedbackDetailModal
        open={detailOpen}
        onClose={() => setDetailOpen(false)}
        history={history}
        title="Detailed feedback"
      />
    </>
  );
}
