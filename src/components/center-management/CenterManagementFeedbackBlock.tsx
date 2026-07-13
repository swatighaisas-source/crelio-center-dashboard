import { useState } from "react";
import { AccountOverviewFeedbackCard } from "../account-overview/AccountOverviewFeedbackCard";
import { LabFeedbackFlow } from "../feedback/LabFeedbackFlow";
import type { LabDetail } from "../../data/labDetails";
import { useLabs } from "../../context/LabsContext";

interface Props {
  lab: LabDetail;
}

export function CenterManagementFeedbackBlock({ lab }: Props) {
  const { feedbackState, resetFeedback } = useLabs();
  const [feedbackOpen, setFeedbackOpen] = useState(false);

  const hasSubmitted = feedbackState.submittedAt !== null;

  function openFeedback() {
    setFeedbackOpen(true);
    requestAnimationFrame(() => {
      document.getElementById("cm-feedback-section")?.scrollIntoView({ behavior: "smooth", block: "start" });
    });
  }

  function handleGiveFeedbackAgain() {
    resetFeedback();
    openFeedback();
  }

  function handleFeedbackDone() {
    setFeedbackOpen(false);
    requestAnimationFrame(() => {
      document.getElementById("cm-feedback-card")?.scrollIntoView({ behavior: "smooth", block: "nearest" });
    });
  }

  return (
    <div className="cm-feedback-block">
      <div id="cm-feedback-card">
        <AccountOverviewFeedbackCard
          hasSubmitted={hasSubmitted}
          npsScore={feedbackState.npsScore}
          submittedAt={feedbackState.submittedAt}
          onOpenFeedback={hasSubmitted ? handleGiveFeedbackAgain : openFeedback}
        />
      </div>

      {feedbackOpen && (
        <section id="cm-feedback-section" className="ao-feedback-section" aria-label="Feedback">
          <div className="ao-feedback-section__head">
            <h2 className="ao-feedback-section__title">Feedback</h2>
            <button
              type="button"
              className="ao-feedback-section__close"
              onClick={() => setFeedbackOpen(false)}
            >
              Close
            </button>
          </div>
          <LabFeedbackFlow lab={lab} mode="inline" showTitle={false} onDone={handleFeedbackDone} />
        </section>
      )}
    </div>
  );
}
