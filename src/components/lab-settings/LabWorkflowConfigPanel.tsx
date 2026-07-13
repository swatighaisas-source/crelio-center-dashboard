import { Link, useParams } from "react-router-dom";
import type { LabDetail } from "../../data/labDetails";
import { getLabWorkflowConfig } from "../../lib/labWorkflowConfig";
import { useLabs } from "../../context/LabsContext";

interface Props {
  lab: LabDetail;
}

function WorkflowToggle({
  label,
  hint,
  checked,
  onChange,
}: {
  label: string;
  hint: string;
  checked: boolean;
  onChange: (next: boolean) => void;
}) {
  return (
    <div className="toggle-field lab-workflow-config__toggle">
      <div className="toggle-field__row">
        <span className="toggle-field__label">{label}</span>
        <button
          type="button"
          className={`toggle${checked ? " toggle--on" : ""}`}
          aria-pressed={checked}
          aria-label={`${label}: ${checked ? "on" : "off"}`}
          onClick={() => onChange(!checked)}
        >
          <span className="toggle__knob" />
        </button>
      </div>
      <p className="toggle-field__hint">{hint}</p>
    </div>
  );
}

export function LabWorkflowConfigPanel({ lab }: Props) {
  const { id } = useParams<{ id: string }>();
  const labId = Number(id) || lab.id;
  const { updateLabWorkflowConfig } = useLabs();
  const workflow = getLabWorkflowConfig(lab);

  function update(patch: Partial<typeof workflow>) {
    updateLabWorkflowConfig(lab.id, patch);
  }

  return (
    <section className="lab-workflow-config">
      <header className="lab-workflow-config__header">
        <h2 className="lab-workflow-config__title">Top navigation visibility</h2>
        <p className="lab-workflow-config__desc">
          Control whether Notifications and Actions appear in the top navigation bar for this lab.
          When switched off, those items are hidden for all users at this centre.
        </p>
      </header>

      <div className="lab-workflow-config__toggles">
        <WorkflowToggle
          label="Notifications"
          hint="Show the Notifications menu in the top navigation bar."
          checked={workflow.showNotifications}
          onChange={(showNotifications) => update({ showNotifications })}
        />
        <WorkflowToggle
          label="Actions (Tasks)"
          hint="Show the Actions menu in the top navigation bar."
          checked={workflow.showActions}
          onChange={(showActions) => update({ showActions })}
        />
      </div>

      <p className="lab-workflow-config__desc" style={{ marginTop: 24 }}>
        For exception rules, task creation, and client visibility presets, open{" "}
        <Link to={`/lab/${labId}/center/rollout-config`}>Rollout Configuration</Link>.
      </p>
    </section>
  );
}
