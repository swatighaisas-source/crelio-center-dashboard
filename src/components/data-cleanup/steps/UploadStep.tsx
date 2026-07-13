import {
  EXPECTED_UPLOAD_FILES,
  FILE_CORRECTNESS_CHECKS,
} from "../../../data/dataCleanupDemo";
import { StepFooter } from "../shared/StepFooter";

interface Props {
  uploadedFiles: string[];
  analyzing: boolean;
  onAddFile: (file: string) => void;
  onRemoveFile: (file: string) => void;
  onAnalyze: () => void;
}

export function UploadStep({
  uploadedFiles,
  analyzing,
  onAddFile,
  onRemoveFile,
  onAnalyze,
}: Props) {
  const nextFile = EXPECTED_UPLOAD_FILES.find((f) => !uploadedFiles.includes(f));
  const canAddMore = Boolean(nextFile);
  const allFilesPresent = EXPECTED_UPLOAD_FILES.every((f) => uploadedFiles.includes(f));

  function handleDrop(e: React.DragEvent) {
    e.preventDefault();
    if (nextFile) onAddFile(nextFile);
  }

  function handleClick() {
    if (nextFile) onAddFile(nextFile);
  }

  return (
    <div className="dc-step">
      <div
        className={`dc-upload-zone${canAddMore ? "" : " dc-upload-zone--filled"}`}
        onDragOver={canAddMore ? (e) => e.preventDefault() : undefined}
        onDrop={canAddMore ? handleDrop : undefined}
        onClick={canAddMore ? handleClick : undefined}
        role={canAddMore ? "button" : undefined}
        tabIndex={canAddMore ? 0 : undefined}
        onKeyDown={
          canAddMore
            ? (e) => {
                if (e.key === "Enter" || e.key === " ") {
                  e.preventDefault();
                  handleClick();
                }
              }
            : undefined
        }
      >
        <span className="dc-upload-zone__icon" aria-hidden>
          <svg viewBox="0 0 24 24" width="28" height="28" fill="none">
            <path
              d="M12 16V8m0 0l-3 3m3-3l3 3M4 16v2a2 2 0 002 2h12a2 2 0 002-2v-2"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </span>
        <span className="dc-upload-zone__text">
          {canAddMore ? "Drop files or click" : "Files ready"}
        </span>
      </div>

      {uploadedFiles.length > 0 && (
        <ul className="dc-file-list">
          {uploadedFiles.map((file) => (
            <li key={file} className="dc-file-chip">
              <span className="dc-file-chip__name">{file}</span>
              <button
                type="button"
                className="dc-file-chip__remove"
                aria-label={`Remove ${file}`}
                onClick={(e) => {
                  e.stopPropagation();
                  onRemoveFile(file);
                }}
              >
                ×
              </button>
            </li>
          ))}
        </ul>
      )}

      {allFilesPresent && (
        <ul className="dc-correctness-list">
          {FILE_CORRECTNESS_CHECKS.map((check) => (
            <li key={check.id} className="dc-correctness-list__item">
              <span className="dc-correctness-list__icon" aria-hidden>
                <svg viewBox="0 0 16 16" width="16" height="16" fill="none">
                  <circle cx="8" cy="8" r="7" stroke="currentColor" strokeWidth="1.2" />
                  <path
                    d="M5 8l2 2 4-4"
                    stroke="currentColor"
                    strokeWidth="1.2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </span>
              <span>{check.label}</span>
            </li>
          ))}
        </ul>
      )}

      <StepFooter
        step={1}
        totalSteps={2}
        primaryLabel="Analyze"
        onPrimary={onAnalyze}
        primaryLoading={analyzing}
        primaryDisabled={!allFilesPresent}
      />
    </div>
  );
}
