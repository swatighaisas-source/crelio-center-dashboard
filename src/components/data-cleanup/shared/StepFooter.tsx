import type { ReactNode } from "react";

interface Props {
  step: number;
  totalSteps: number;
  onBack?: () => void;
  backLabel?: string;
  primaryLabel: string;
  onPrimary: () => void;
  primaryDisabled?: boolean;
  primaryLoading?: boolean;
  extra?: ReactNode;
}

export function StepFooter({
  step,
  totalSteps,
  onBack,
  backLabel = "Back",
  primaryLabel,
  onPrimary,
  primaryDisabled = false,
  primaryLoading = false,
  extra,
}: Props) {
  return (
    <footer className="dc-footer">
      <div className="dc-footer__left">
        <span className="dc-footer__step">
          Step {step} of {totalSteps}
        </span>
        {onBack && (
          <button type="button" className="dc-footer__back" onClick={onBack}>
            {backLabel}
          </button>
        )}
      </div>
      <div className="dc-footer__right">
        {extra}
        <button
          type="button"
          className="dc-btn dc-btn--primary"
          disabled={primaryDisabled || primaryLoading}
          onClick={onPrimary}
        >
          {primaryLoading ? "Analyzing…" : primaryLabel}
        </button>
      </div>
    </footer>
  );
}
