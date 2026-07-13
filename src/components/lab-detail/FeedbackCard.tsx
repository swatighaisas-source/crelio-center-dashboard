import { Link } from "react-router-dom";
import type { FeedbackEntry } from "../../data/labDetails";

interface Props {
  labId: number;
  history: FeedbackEntry[];
}

export function FeedbackCard({ labId, history }: Props) {
  return (
    <div className="detail-card detail-card--feedback">
      <div className="fb-card__top">
        <div className="fb-card__title-block">
          <h3 className="fb-card__title">Feedback</h3>
          <p className="fb-card__meta">
            {history.length > 0
              ? `${history.length} submission${history.length === 1 ? "" : "s"}`
              : "No submissions yet"}
          </p>
        </div>
        <div className="fb-card__actions">
          <Link to={`/lab/${labId}/feedback`} className="btn-solid btn-solid--sm">
            Add feedback
          </Link>
        </div>
      </div>
    </div>
  );
}
