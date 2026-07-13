import type { USIntegration } from "../../data/usIntegrations";

interface IntegrationPickerSectionProps {
  title: string;
  items: USIntegration[];
  selectedNames: string[];
  onToggle: (name: string) => void;
  /** Title + category only (no summary line) */
  compact?: boolean;
}

export function IntegrationPickerSection({
  title,
  items,
  selectedNames,
  onToggle,
  compact = false,
}: IntegrationPickerSectionProps) {
  const selectedInSection = items.filter((i) => selectedNames.includes(i.name)).length;

  return (
    <section className="integration-selected-section" aria-label={title}>
      <h3 className="integration-selected-section__title">
        {title}
        {selectedInSection > 0 && (
          <span className="integration-selected-section__count">{selectedInSection}</span>
        )}
      </h3>

      <div
        className={`integration-checkbox-list${compact ? " integration-checkbox-list--compact" : ""}`}
      >
        {items.map((integration) => {
          const checked = selectedNames.includes(integration.name);
          return (
            <div
              key={integration.id}
              className={`integration-checkbox-item${checked ? " integration-checkbox-item--checked" : ""}${compact ? " integration-checkbox-item--compact" : ""}`}
              onClick={() => onToggle(integration.name)}
              onKeyDown={(e) => {
                if (e.key === "Enter" || e.key === " ") {
                  e.preventDefault();
                  onToggle(integration.name);
                }
              }}
              role="checkbox"
              aria-checked={checked}
              tabIndex={0}
            >
              <div className="integration-checkbox-item__box" aria-hidden>
                {checked ? <span className="integration-checkbox-item__check">✓</span> : null}
              </div>
              <div className="integration-checkbox-item__body">
                <div className="integration-checkbox-item__name">{integration.name}</div>
                {!compact && (
                  <div className="integration-checkbox-item__summary">{integration.summary}</div>
                )}
              </div>
              {!compact && (
                <span className="integration-checkbox-item__cat">{integration.category}</span>
              )}
            </div>
          );
        })}
      </div>
    </section>
  );
}
