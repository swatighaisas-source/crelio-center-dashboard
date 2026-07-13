import type { LabModuleId } from "../../data/labModules";
import { LAB_MODULES } from "../../data/labModules";

interface Props {
  title: string;
  moduleId: LabModuleId;
}

export function ModulePlaceholder({ title, moduleId }: Props) {
  const module = LAB_MODULES[moduleId];

  return (
    <div className="module-placeholder">
      <div className="module-placeholder__card">
        <p className="module-placeholder__eyebrow">{module.label}</p>
        <h2 className="module-placeholder__title">{title}</h2>
        <p className="module-placeholder__text">
          This page is a placeholder. Content for {title} will be added in a future update.
        </p>
      </div>
    </div>
  );
}
