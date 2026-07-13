import { useEffect, useState } from "react";
import {
  ALL_FEEDBACK_FEATURE_IDS,
  FEEDBACK_MODULE_GROUPS,
} from "../../data/labHome";

interface Props {
  open: boolean;
  onClose: () => void;
  initialFeatureIds: string[];
  onSave: (featureIds: string[]) => void;
}

export function FeaturesToTrackModal({ open, onClose, initialFeatureIds, onSave }: Props) {
  const [selected, setSelected] = useState<Set<string>>(new Set());

  useEffect(() => {
    if (open) {
      setSelected(new Set(initialFeatureIds));
    }
  }, [open, initialFeatureIds]);

  if (!open) return null;

  function toggleFeature(id: string) {
    setSelected((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  }

  function toggleGroup(groupModuleIds: string[], checked: boolean) {
    setSelected((prev) => {
      const next = new Set(prev);
      for (const id of groupModuleIds) {
        if (checked) next.add(id);
        else next.delete(id);
      }
      return next;
    });
  }

  function handleSave() {
    const ordered = ALL_FEEDBACK_FEATURE_IDS.filter((id) => selected.has(id));
    onSave(ordered);
    onClose();
  }

  return (
    <div className="lab-modal-overlay" onClick={onClose}>
      <div
        className="lab-modal lab-modal--features-track"
        role="dialog"
        aria-modal="true"
        aria-labelledby="features-track-title"
        onClick={(e) => e.stopPropagation()}
      >
        <header className="lab-modal__header">
          <div>
            <h2 id="features-track-title">Features to track for this lab</h2>
            <p className="features-track-modal__sub">
              Checked features appear in the lab&apos;s feedback view. The knowledge base remains
              fully accessible regardless.
            </p>
          </div>
          <button type="button" className="lab-modal__close" onClick={onClose} aria-label="Close">
            ×
          </button>
        </header>

        <div className="features-track-modal__grid">
          {FEEDBACK_MODULE_GROUPS.map((group) => {
            const groupIds = group.modules.map((m) => m.id);
            const allChecked = groupIds.length > 0 && groupIds.every((id) => selected.has(id));
            const someChecked = groupIds.some((id) => selected.has(id));

            return (
              <section key={group.id} className="features-track-card">
                <label className="features-track-card__head">
                  <input
                    type="checkbox"
                    checked={allChecked}
                    ref={(el) => {
                      if (el) el.indeterminate = someChecked && !allChecked;
                    }}
                    onChange={(e) => toggleGroup(groupIds, e.target.checked)}
                  />
                  <span className="features-track-card__title">{group.name}</span>
                </label>
                <ul className="features-track-card__list">
                  {group.modules.map((mod) => (
                    <li key={mod.id}>
                      <label className="features-track-card__item">
                        <input
                          type="checkbox"
                          checked={selected.has(mod.id)}
                          onChange={() => toggleFeature(mod.id)}
                        />
                        <span>{mod.name}</span>
                      </label>
                    </li>
                  ))}
                </ul>
              </section>
            );
          })}
        </div>

        <footer className="lab-modal__footer features-track-modal__footer">
          <button type="button" className="btn-outline btn-outline--sm" onClick={onClose}>
            Cancel
          </button>
          <button
            type="button"
            className="btn-solid btn-solid--sm"
            onClick={handleSave}
            disabled={selected.size === 0}
          >
            Save changes
          </button>
        </footer>
      </div>
    </div>
  );
}
