import type { IssueSeverity } from "../../../data/dataCleanupDemo";

const LABELS: Record<IssueSeverity, string> = {
  blocker: "Blocker",
  warning: "Warning",
  unclear: "Unclear",
};

interface Props {
  severity: IssueSeverity;
}

export function SeverityBadge({ severity }: Props) {
  return (
    <span className={`dc-severity dc-severity--${severity}`}>{LABELS[severity]}</span>
  );
}
