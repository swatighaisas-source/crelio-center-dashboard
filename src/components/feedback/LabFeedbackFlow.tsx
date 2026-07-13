import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  formatFeedbackDate,
  type FeedbackState,
  type NpsFeedbackSubmission,
} from "../../data/labHome";
import type { LabDetail } from "../../data/labDetails";
import { useLabs } from "../../context/LabsContext";
import { NpsCommentSection } from "./NpsCommentSection";

function npsTone(score: number): string {
  if (score <= 6) return "red";
  if (score <= 8) return "yellow";
  return "green";
}

export function LastFeedbackSummary({ state }: { state: FeedbackState }) {
  if (!state.submittedAt || state.npsScore === null) return null;

  return (
    <section className="feedback-last" aria-label="Your last feedback">
      <div className="feedback-last__header">
        <h2 className="feedback-last__title">Your last feedback</h2>
        <span className="feedback-last__date">Submitted {formatFeedbackDate(state.submittedAt)}</span>
      </div>
      <div className="feedback-last__nps">
        <span className="feedback-last__nps-label">NPS score</span>
        <span className={`feedback-last__nps-score feedback-last__nps-score--${npsTone(state.npsScore)}`}>
          {state.npsScore}/10
        </span>
      </div>
      {state.npsPresetComments.length > 0 && (
        <div className="feedback-last__preset-pills">
          {state.npsPresetComments.map((pill) => (
            <span key={pill} className="feedback-last__preset-pill">
              {pill}
            </span>
          ))}
        </div>
      )}
      {state.npsComment.trim() && (
        <p className="feedback-last__comment">{state.npsComment.trim()}</p>
      )}
      <p className="feedback-last__hint">You can update your score and comments below and submit again.</p>
    </section>
  );
}

function NpsStep({
  initialScore,
  initialPresets,
  initialComment,
  onSubmit,
}: {
  initialScore: number | null;
  initialPresets: string[];
  initialComment: string;
  onSubmit: (submission: NpsFeedbackSubmission) => void;
}) {
  const [selected, setSelected] = useState<number | null>(initialScore);
  const [presetComments, setPresetComments] = useState<string[]>(initialPresets);
  const [comment, setComment] = useState(initialComment);

  useEffect(() => {
    setSelected(initialScore);
    setPresetComments(initialPresets);
    setComment(initialComment);
  }, [initialScore, initialPresets, initialComment]);

  function npsColor(n: number) {
    if (n <= 6) return "red";
    if (n <= 8) return "yellow";
    return "green";
  }

  function handleScoreSelect(score: number) {
    setSelected(score);
  }

  return (
    <div className="feedback-step feedback-step--nps">
      <h2 className="feedback-step__section-heading">NPS score</h2>
      <p className="feedback-step__sub">
        How likely are you to recommend CrelioHealth to another diagnostic lab? (0 = not at all likely,
        10 = extremely likely)
      </p>

      <div className="feedback-nps">
        {Array.from({ length: 11 }, (_, i) => (
          <button
            key={i}
            type="button"
            className={`feedback-nps__btn feedback-nps__btn--${npsColor(i)}${selected === i ? " feedback-nps__btn--selected" : ""}`}
            onClick={() => handleScoreSelect(i)}
            aria-pressed={selected === i}
          >
            {i}
          </button>
        ))}
      </div>

      <div className="feedback-nps__labels">
        <span>Not likely at all</span>
        <span>Extremely likely</span>
      </div>

      {selected !== null && (
        <NpsCommentSection
          score={selected}
          selectedPresets={presetComments}
          comment={comment}
          onPresetsChange={setPresetComments}
          onCommentChange={setComment}
        />
      )}

      <button
        type="button"
        className="feedback-step__submit"
        disabled={selected === null}
        onClick={() =>
          selected !== null &&
          onSubmit({
            score: selected,
            presetComments,
            comment: comment.trim(),
          })
        }
      >
        {initialScore !== null ? "Update feedback" : "Submit feedback"}
      </button>
    </div>
  );
}

function DoneStep({
  mode,
  labId,
  onDone,
}: {
  mode: "page" | "inline";
  labId: number;
  onDone?: () => void;
}) {
  const navigate = useNavigate();

  useEffect(() => {
    if (mode !== "page") return;
    const t = setTimeout(() => navigate(`/lab/${labId}/center`), 2200);
    return () => clearTimeout(t);
  }, [mode, labId, navigate]);

  return (
    <div className="feedback-step feedback-step--center">
      <div className="feedback-thankyou__icon" aria-hidden>
        <svg viewBox="0 0 64 64" fill="none" width="56" height="56">
          <circle cx="32" cy="32" r="30" stroke="#3b71ca" strokeWidth="2.5" />
          <path
            d="M18 32l10 10 18-18"
            stroke="#3b71ca"
            strokeWidth="2.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </div>
      <h2 className="feedback-step__heading">Thank you — feedback submitted!</h2>
      {mode === "page" ? (
        <p className="feedback-step__sub">Returning you to Home in a moment…</p>
      ) : (
        <button type="button" className="feedback-step__submit ao-feedback-done__back" onClick={onDone}>
          Back to Overview
        </button>
      )}
    </div>
  );
}

export type LabFeedbackFlowMode = "page" | "inline";

interface LabFeedbackFlowProps {
  lab: LabDetail;
  mode: LabFeedbackFlowMode;
  onDone?: () => void;
  showTitle?: boolean;
}

export function LabFeedbackFlow({ lab, mode, onDone, showTitle = true }: LabFeedbackFlowProps) {
  const { feedbackState, submitNps } = useLabs();
  const [showSuccess, setShowSuccess] = useState(false);

  const hasPreviousSubmission = feedbackState.submittedAt !== null;

  function handleNpsSubmit(submission: NpsFeedbackSubmission) {
    submitNps(lab.id, submission);
    setShowSuccess(true);
  }

  if (showSuccess && feedbackState.step === "done") {
    return <DoneStep mode={mode} labId={lab.id} onDone={onDone} />;
  }

  return (
    <div className="lab-feedback-flow">
      {showTitle && <h2 className="feedback-page__title">Feedback</h2>}
      {hasPreviousSubmission && <LastFeedbackSummary state={feedbackState} />}
      <NpsStep
        initialScore={feedbackState.npsScore}
        initialPresets={feedbackState.npsPresetComments}
        initialComment={feedbackState.npsComment}
        onSubmit={handleNpsSubmit}
      />
    </div>
  );
}
