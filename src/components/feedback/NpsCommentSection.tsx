import { useEffect, useMemo } from "react";
import {
  allNpsCommentPills,
  getNpsCommentConfig,
} from "../../data/labHome";

interface Props {
  score: number;
  selectedPresets: string[];
  comment: string;
  onPresetsChange: (presets: string[]) => void;
  onCommentChange: (comment: string) => void;
}

export function NpsCommentSection({
  score,
  selectedPresets,
  comment,
  onPresetsChange,
  onCommentChange,
}: Props) {
  const config = useMemo(() => getNpsCommentConfig(score), [score]);

  useEffect(() => {
    if (!config) return;
    const valid = new Set(allNpsCommentPills(config));
    const next = selectedPresets.filter((pill) => valid.has(pill));
    if (next.length !== selectedPresets.length) onPresetsChange(next);
  }, [config, onPresetsChange, selectedPresets]);

  if (!config) return null;

  function togglePreset(pill: string) {
    const next = selectedPresets.includes(pill)
      ? selectedPresets.filter((item) => item !== pill)
      : [...selectedPresets, pill];
    onPresetsChange(next);
  }

  return (
    <section className="feedback-nps-comment" aria-labelledby="feedback-nps-comment-heading">
      <h3 id="feedback-nps-comment-heading" className="feedback-nps-comment__heading">
        {config.heading}
      </h3>
      <p className={`feedback-nps-comment__sub feedback-nps-comment__sub--${config.tone}`}>
        {config.subheading}
      </p>

      <div className="feedback-nps-comment__groups">
        {config.groups.map((group) => (
          <div key={group.id} className="feedback-nps-comment__group">
            {group.label ? (
              <p className="feedback-nps-comment__group-label">{group.label}</p>
            ) : null}
            <div className="feedback-nps-comment__pills" role="list">
              {group.pills.map((pill) => {
                const selected = selectedPresets.includes(pill);
                return (
                  <button
                    key={pill}
                    type="button"
                    role="listitem"
                    className={`feedback-nps-comment__pill${selected ? " feedback-nps-comment__pill--selected" : ""}`}
                    aria-pressed={selected}
                    onClick={() => togglePreset(pill)}
                  >
                    {pill}
                  </button>
                );
              })}
            </div>
          </div>
        ))}
      </div>

      <label className="feedback-nps-comment__extra-label" htmlFor="feedback-nps-extra">
        Anything else for your account manager or support team? (optional)
      </label>
      <textarea
        id="feedback-nps-extra"
        className="feedback-nps-comment__textarea"
        rows={3}
        placeholder="Share specifics — turnaround times, modules, billing, integrations, or people who helped."
        value={comment}
        onChange={(e) => onCommentChange(e.target.value)}
      />
    </section>
  );
}
