type DataView = "original" | "revised";

interface Props {
  value: DataView;
  onChange: (value: DataView) => void;
}

export function DataViewToggle({ value, onChange }: Props) {
  return (
    <div className="dc-view-toggle" role="group" aria-label="Data view">
      <button
        type="button"
        className={`dc-view-toggle__btn${value === "original" ? " dc-view-toggle__btn--active" : ""}`}
        aria-pressed={value === "original"}
        onClick={() => onChange("original")}
      >
        Original
      </button>
      <button
        type="button"
        className={`dc-view-toggle__btn${value === "revised" ? " dc-view-toggle__btn--active" : ""}`}
        aria-pressed={value === "revised"}
        onClick={() => onChange("revised")}
      >
        Revised
      </button>
    </div>
  );
}
