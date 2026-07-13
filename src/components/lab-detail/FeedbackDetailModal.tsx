import type { FeedbackEntry } from "../../data/labDetails";
import {
  npsLabel,
  npsTone,
} from "./feedbackDetailUtils";

interface Props {
  open: boolean;
  onClose: () => void;
  history: FeedbackEntry[];
  title?: string;
  emptyMessage?: string;
}

export function FeedbackDetailModal({
  open,
  onClose,
  history,
  title = "Detailed feedback",
  emptyMessage = "No feedback submissions to show.",
}: Props) {
  if (!open) return null;

  const sortedHistory = [...history];

  return (
    <div className="lab-modal-overlay" onClick={onClose}>
      <div
        className="lab-modal lab-modal--feedback-detail"
        role="dialog"
        aria-modal="true"
        aria-labelledby="feedback-detail-title"
        onClick={(e) => e.stopPropagation()}
      >
        <header className="lab-modal__header fb-detail-modal__header">
          <div>
            <h2 id="feedback-detail-title">{title}</h2>
            <p className="fb-detail-modal__sub">
              {history.length > 0
                ? `${history.length} submission${history.length === 1 ? "" : "s"}`
                : "No submissions"}
            </p>
          </div>
          <button type="button" className="lab-modal__close" onClick={onClose} aria-label="Close">
            ×
          </button>
        </header>

        <div className="fb-detail-modal__body">
          {history.length === 0 ? (
            <p className="fb-detail-note__empty fb-detail-modal__empty">{emptyMessage}</p>
          ) : (
            <div className="fb-detail-stack">
              {sortedHistory.map((entry) => {
                const freeComment = entry.npsComment?.trim();
                return (
                  <article key={entry.id} className="fb-detail-note">
                    <header className="fb-detail-note__head fb-detail-note__head--nps">
                      <span className="fb-detail-note__date">{entry.date}</span>
                      <span className={`fb-detail-nps fb-detail-nps--${npsTone(entry.nps)}`}>
                        {entry.nps}/10
                      </span>
                      <span className="fb-detail-note__segment">{npsLabel(entry.nps)}</span>
                      <span className="fb-detail-note__by">{entry.by}</span>
                    </header>
                    <div className="fb-detail-nps-comment">
                      {entry.npsPresetComments && entry.npsPresetComments.length > 0 && (
                        <div className="fb-detail-nps-comment__presets">
                          {entry.npsPresetComments.map((pill) => (
                            <span key={pill} className="fb-detail-nps-comment__pill">
                              {pill}
                            </span>
                          ))}
                        </div>
                      )}
                      <span className="fb-detail-nps-comment__label">Additional comment</span>
                      {freeComment ? (
                        <p className="fb-detail-note__text">{freeComment}</p>
                      ) : (
                        <p className="fb-detail-note__empty">No additional comment.</p>
                      )}
                    </div>
                  </article>
                );
              })}
            </div>
          )}
        </div>

        <footer className="lab-modal__footer">
          <button type="button" className="btn-outline btn-outline--sm" onClick={onClose}>
            Close
          </button>
        </footer>
      </div>
    </div>
  );
}
