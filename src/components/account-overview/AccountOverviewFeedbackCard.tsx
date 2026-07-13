import { formatFeedbackDate } from "../../data/labHome";

interface Props {
  hasSubmitted: boolean;
  npsScore: number | null;
  submittedAt: string | null;
  onOpenFeedback: () => void;
}

function npsTone(score: number): string {
  if (score <= 6) return "red";
  if (score <= 8) return "yellow";
  return "green";
}

export function AccountOverviewFeedbackCard({
  hasSubmitted,
  npsScore,
  submittedAt,
  onOpenFeedback,
}: Props) {
  if (hasSubmitted && npsScore !== null) {
    return (
      <section className="ao-feedback-card ao-feedback-card--done" aria-label="Feedback submitted">
        <div className="ao-feedback-card__icon" aria-hidden>
          <svg viewBox="0 0 24 24" width="22" height="22" fill="none">
            <path
              d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 14l-4-4 1.4-1.4L11 13.2l6.6-6.6L19 8l-8 8z"
              fill="#3b71ca"
            />
          </svg>
        </div>
        <div className="ao-feedback-card__text">
          <h2 className="ao-feedback-card__title">Thank you for your feedback</h2>
          <p className="ao-feedback-card__sub">
            You rated us{" "}
            <span className={`ao-feedback-card__nps ao-feedback-card__nps--${npsTone(npsScore)}`}>
              {npsScore}/10
            </span>
            {submittedAt ? ` · ${formatFeedbackDate(submittedAt)}` : ""}
          </p>
        </div>
        <button type="button" className="ao-feedback-card__cta ao-feedback-card__cta--secondary" onClick={onOpenFeedback}>
          Submit again
        </button>
      </section>
    );
  }

  return (
    <button
      type="button"
      className="ao-feedback-card"
      onClick={onOpenFeedback}
      aria-label="Open feedback survey — share your feedback"
    >
      <div className="ao-feedback-card__icon" aria-hidden>
        <svg viewBox="0 0 24 24" width="22" height="22" fill="none">
          <path
            d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 5v6m0 2v2"
            stroke="#3b71ca"
            strokeWidth="1.5"
            strokeLinecap="round"
          />
        </svg>
      </div>
      <div className="ao-feedback-card__text">
        <span className="ao-feedback-card__title">Share your feedback</span>
        <span className="ao-feedback-card__sub">
          Your feedback helps us make the product even better.
        </span>
      </div>
      <span className="ao-feedback-card__cta">Start survey →</span>
    </button>
  );
}
