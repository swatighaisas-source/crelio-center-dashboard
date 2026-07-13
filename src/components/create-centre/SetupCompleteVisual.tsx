type Phase = "processing" | "complete";

export function SetupCompleteVisual({ phase }: { phase: Phase }) {
  if (phase === "processing") {
    return (
      <div className="setup-complete-visual setup-complete-visual--processing">
        <svg
          className="setup-complete-visual__ring"
          viewBox="0 0 80 80"
          fill="none"
          aria-hidden
        >
          <circle cx="40" cy="40" r="34" stroke="#e2ebf4" strokeWidth="4" />
          <circle
            className="setup-complete-visual__ring-arc"
            cx="40"
            cy="40"
            r="34"
            stroke="#4a90e2"
            strokeWidth="4"
            strokeLinecap="round"
            strokeDasharray="52 162"
          />
        </svg>
        <p className="setup-complete-visual__status">Creating your centre…</p>
        <p className="setup-complete-visual__hint">Applying your setup choices</p>
      </div>
    );
  }

  return (
    <div className="setup-complete-visual setup-complete-visual--complete">
      <svg
        className="setup-complete-visual__check-svg"
        viewBox="0 0 80 80"
        fill="none"
        aria-hidden
      >
        <circle
          className="setup-complete-visual__check-circle"
          cx="40"
          cy="40"
          r="34"
          stroke="#52c41a"
          strokeWidth="4"
          fill="#f0faf2"
        />
        <path
          className="setup-complete-visual__check-mark"
          d="M26 41 L36 51 L56 29"
          stroke="#52c41a"
          strokeWidth="4"
          strokeLinecap="round"
          strokeLinejoin="round"
          fill="none"
        />
      </svg>
      <h1 className="setup-complete-visual__title">Congratulations!</h1>
      <p className="setup-complete-visual__intro">
        Your centre is ready. Your 15-day trial starts today.
      </p>
    </div>
  );
}
