import type { OpenTask } from "../../data/labHome";
import { LabHomeIcon } from "./LabHomeIcons";

interface Props {
  tasks: OpenTask[];
}

export function OpenTasksList({ tasks }: Props) {
  return (
    <div className="lab-home__tasks-list">
      {tasks.map((task) => (
        <div key={task.id} className={`lab-home__task-item lab-home__task-item--${task.tone}`}>
          <span className={`lab-home__task-icon lab-home__task-icon--${task.tone}`}>
            <LabHomeIcon name={task.icon} />
          </span>
          <div className="lab-home__task-body">
            <span className="lab-home__task-title">{task.title}</span>
            <span className="lab-home__task-desc">{task.description}</span>
          </div>
          <span className={`lab-home__task-badge lab-home__task-badge--${task.tone}`}>{task.count}</span>
          <button type="button" className={`lab-home__task-btn lab-home__task-btn--${task.tone}`}>
            {task.actionLabel}
          </button>
        </div>
      ))}
    </div>
  );
}
