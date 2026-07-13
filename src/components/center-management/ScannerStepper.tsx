export type ScannerFlowStep = "select-scanner" | "connect" | "scan-settings";

const STEPS: { id: ScannerFlowStep; label: string }[] = [
  { id: "select-scanner", label: "Select Scanner" },
  { id: "connect", label: "Connect" },
  { id: "scan-settings", label: "Scanner Configuration" },
];

interface Props {
  current: ScannerFlowStep;
  maxReached: ScannerFlowStep;
  onStepClick?: (step: ScannerFlowStep) => void;
}

function stepIndex(step: ScannerFlowStep): number {
  return STEPS.findIndex((s) => s.id === step);
}

export function ScannerStepper({ current, maxReached, onStepClick }: Props) {
  const maxIndex = stepIndex(maxReached);

  return (
    <nav className="cd-scanner-stepper" aria-label="Scanner setup progress">
      <ol className="cd-scanner-stepper__list">
        {STEPS.map((step, index) => {
          const isActive = step.id === current;
          const isDone = index < stepIndex(current);
          const isReachable = index <= maxIndex;

          return (
            <li key={step.id} className="cd-scanner-stepper__item">
              {index > 0 && (
                <span
                  className={`cd-scanner-stepper__line${isDone || isActive ? " cd-scanner-stepper__line--done" : ""}`}
                  aria-hidden
                />
              )}
              {isReachable && onStepClick ? (
                <button
                  type="button"
                  className={`cd-scanner-stepper__pill${
                    isActive ? " cd-scanner-stepper__pill--active" : ""
                  }${isDone ? " cd-scanner-stepper__pill--done" : ""}`}
                  onClick={() => onStepClick(step.id)}
                  aria-current={isActive ? "step" : undefined}
                >
                  <span className="cd-scanner-stepper__num">{index + 1}</span>
                  {step.label}
                </button>
              ) : (
                <span
                  className={`cd-scanner-stepper__pill${
                    isActive ? " cd-scanner-stepper__pill--active" : ""
                  }${isDone ? " cd-scanner-stepper__pill--done" : ""}`}
                  aria-current={isActive ? "step" : undefined}
                >
                  <span className="cd-scanner-stepper__num">{index + 1}</span>
                  {step.label}
                </span>
              )}
            </li>
          );
        })}
      </ol>
    </nav>
  );
}
