import { Link } from "react-router-dom";

interface Props {
  labId: number;
  onDismiss: () => void;
}

export function FeedbackReminderBanner({ labId, onDismiss }: Props) {
  return (
    <div className="feedback-reminder" role="alert">
      <div className="feedback-reminder__icon" aria-hidden>
        <svg viewBox="0 0 24 24" fill="none" width="20" height="20">
          <path
            d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 5v6m0 2v2"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinecap="round"
          />
        </svg>
      </div>
      <div className="feedback-reminder__body">
        <span className="feedback-reminder__title">Share your feedback</span>
        <span className="feedback-reminder__sub">
          Your feedback helps us make the product even better.
        </span>
      </div>
      <Link
        to={`/lab/${labId}/feedback`}
        className="feedback-reminder__cta"
      >
        Start survey →
      </Link>
      <button
        type="button"
        className="feedback-reminder__dismiss"
        onClick={onDismiss}
        aria-label="Dismiss feedback reminder"
      >
        <svg viewBox="0 0 16 16" width="14" height="14" fill="none" aria-hidden>
          <path
            d="M4 4l8 8M12 4l-8 8"
            stroke="currentColor"
            strokeWidth="1.4"
            strokeLinecap="round"
          />
        </svg>
      </button>
    </div>
  );
}
