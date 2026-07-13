import { useState } from "react";
import {
  getSatisfactionConfig,
  type ModuleFeedbackResponse,
} from "../../data/labHome";

interface Props {
  value: ModuleFeedbackResponse;
  onChange: (next: ModuleFeedbackResponse) => void;
}

function StarRow({
  value,
  onChange,
}: {
  value: number;
  onChange: (v: number) => void;
}) {
  const [hovered, setHovered] = useState(0);

  return (
    <div className="feedback-stars feedback-stars--lg" aria-label="Satisfaction rating">
      {[1, 2, 3, 4, 5].map((star) => (
        <button
          key={star}
          type="button"
          className={`feedback-stars__star feedback-stars__star--lg${
            star <= (hovered || value) ? " feedback-stars__star--filled" : ""
          }${star === value && value > 0 ? " feedback-stars__star--selected" : ""}`}
          onMouseEnter={() => setHovered(star)}
          onMouseLeave={() => setHovered(0)}
          onClick={() => onChange(star)}
          aria-label={`${star} star${star !== 1 ? "s" : ""}`}
        >
          <svg viewBox="0 0 20 20" width="26" height="26" fill="currentColor" aria-hidden>
            <path d="M10 1.5l2.4 5 5.6.8-4 4 1 5.5L10 14l-5 2.8 1-5.5-4-4 5.6-.8z" />
          </svg>
        </button>
      ))}
    </div>
  );
}

export function ModuleSatisfactionPanel({ value, onChange }: Props) {
  const config = value.stars > 0 ? getSatisfactionConfig(value.stars) : null;

  function updateStars(stars: number) {
    const nextConfig = getSatisfactionConfig(stars);
    const presetStillValid =
      value.presetComment && nextConfig?.presets.includes(value.presetComment);
    onChange({
      ...value,
      stars,
      presetComment: presetStillValid ? value.presetComment : null,
      saved: false,
    });
  }

  function handleSave() {
    if (value.stars < 1) return;
    onChange({ ...value, saved: true });
  }

  return (
    <div className="feedback-satisfaction">
      <p className="feedback-satisfaction__heading">How satisfied are you with this capability?</p>

      <StarRow value={value.stars} onChange={updateStars} />

      {config && (
        <>
          <p className={`feedback-satisfaction__label feedback-satisfaction__label--${config.tone}`}>
            {config.label}
          </p>

          <div className="feedback-satisfaction__presets" role="list">
            {config.presets.map((preset) => {
              const selected = value.presetComment === preset;
              return (
                <button
                  key={preset}
                  type="button"
                  role="listitem"
                  className={`feedback-satisfaction__chip${selected ? " feedback-satisfaction__chip--selected" : ""}`}
                  onClick={() =>
                    onChange({
                      ...value,
                      presetComment: selected ? null : preset,
                      saved: false,
                    })
                  }
                >
                  {preset}
                </button>
              );
            })}
          </div>

          <textarea
            className="feedback-satisfaction__textarea"
            rows={3}
            placeholder="Add any extra context for your account manager..."
            value={value.comment}
            onChange={(e) =>
              onChange({ ...value, comment: e.target.value, saved: false })
            }
          />

          <button
            type="button"
            className="feedback-satisfaction__save"
            disabled={value.stars < 1}
            onClick={handleSave}
          >
            Save feedback
          </button>

          {value.saved && (
            <p className="feedback-satisfaction__saved-hint" role="status">
              Saved for this capability. You can still edit before submitting all feedback.
            </p>
          )}
        </>
      )}
    </div>
  );
}
