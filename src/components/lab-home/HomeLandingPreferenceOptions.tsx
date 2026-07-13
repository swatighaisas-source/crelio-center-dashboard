import { LANDING_PREFERENCE_OPTIONS, type HomeLandingPreference } from "../../data/labHome";

interface Props {
  value: HomeLandingPreference;
  onChange: (preference: HomeLandingPreference) => void;
  name?: string;
  compact?: boolean;
}

export function HomeLandingPreferenceOptions({
  value,
  onChange,
  name = "landing-preference",
  compact = false,
}: Props) {
  return (
    <div className={`hw-landing-options${compact ? " hw-landing-options--compact" : ""}`} role="radiogroup">
      {LANDING_PREFERENCE_OPTIONS.map((option) => {
        const selected = value === option.id;
        return (
          <label
            key={option.id}
            className={`hw-landing-option${selected ? " hw-landing-option--selected" : ""}`}
          >
            <input
              type="radio"
              name={name}
              value={option.id}
              checked={selected}
              onChange={() => onChange(option.id)}
              className="hw-landing-option__input"
            />
            <span className="hw-landing-option__radio" aria-hidden />
            <span className="hw-landing-option__text">
              <span className="hw-landing-option__title">{option.title}</span>
              <span className="hw-landing-option__desc">{option.description}</span>
            </span>
          </label>
        );
      })}
    </div>
  );
}
