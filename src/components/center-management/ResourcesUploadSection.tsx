import { useRef } from "react";

const RESOURCE_ITEMS = [
  { id: "report-header", label: "Report Header" },
  { id: "report-footer", label: "Report Footer" },
  { id: "bill-header", label: "Bill Header" },
  { id: "bill-footer", label: "Bill Footer" },
] as const;

export function ResourcesUploadSection() {
  const fileInputs = useRef<Record<string, HTMLInputElement | null>>({});

  function triggerUpload(id: string) {
    fileInputs.current[id]?.click();
  }

  return (
    <section className="cm-resources" aria-labelledby="cm-resources-title">
      <h2 id="cm-resources-title" className="cm-resources__title">
        Upload Resources
      </h2>
      <p className="cm-resources__sub">
        Upload files, images and resources related to your center.
      </p>

      <ul className="cm-resources__list">
        {RESOURCE_ITEMS.map((item) => (
          <li key={item.id} className="cm-resources__row">
            <span className="cm-resources__label">{item.label}</span>
            <div className="cm-resources__actions">
              <input
                ref={(el) => {
                  fileInputs.current[item.id] = el;
                }}
                type="file"
                className="cm-resources__file"
                accept="image/*,.pdf"
                aria-label={`Upload ${item.label}`}
                onChange={() => {
                  /* demo: file selection only */
                }}
              />
              <button
                type="button"
                className="cm-resources__upload-btn"
                onClick={() => triggerUpload(item.id)}
              >
                Upload
              </button>
            </div>
          </li>
        ))}
      </ul>
    </section>
  );
}
