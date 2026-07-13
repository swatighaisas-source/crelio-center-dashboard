import type { TaskVisibility } from "../../data/inflow/mockTasks";

type Props = {
  visibility: TaskVisibility;
  className?: string;
};

function LockIcon() {
  return (
    <svg
      className="task-visibility-pill-icon"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
      <path d="M7 11V7a5 5 0 0 1 10 0v4" />
    </svg>
  );
}

function EyeIcon() {
  return (
    <svg
      className="task-visibility-pill-icon"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
      <circle cx="12" cy="12" r="3" />
    </svg>
  );
}

export function TaskVisibilityPill({ visibility, className = "" }: Props) {
  const isInternal = visibility === "lab_internal";
  const label = isInternal ? "Not visible to account" : "Visible to account";
  const variant = isInternal ? "task-visibility-pill--internal" : "task-visibility-pill--account";
  const aria =
    visibility === "lab_internal"
      ? "This action is not visible to the account."
      : "This action is visible to the account.";
  const rootClass = ["task-visibility-pill", variant, className].filter(Boolean).join(" ");

  return (
    <span className={rootClass} role="status" aria-label={aria}>
      {isInternal ? <LockIcon /> : <EyeIcon />}
      <span className="task-visibility-pill-label">{label}</span>
    </span>
  );
}
