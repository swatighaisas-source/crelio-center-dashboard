import { useCallback, useMemo, useState } from "react";
import type { CleanupStep } from "../../data/dataCleanupDemo";
import { EXPECTED_UPLOAD_FILES, STEP_ORDER } from "../../data/dataCleanupDemo";
import { SheetPreviewStep } from "./steps/SheetPreviewStep";
import { UploadStep } from "./steps/UploadStep";

export function DataCleanupFlow() {
  const [step, setStep] = useState<CleanupStep>("upload");
  const [uploadedFiles, setUploadedFiles] = useState<string[]>([...EXPECTED_UPLOAD_FILES]);
  const [analyzing, setAnalyzing] = useState(false);

  const stepIdx = useMemo(() => STEP_ORDER.indexOf(step), [step]);

  const goBack = useCallback(() => {
    if (stepIdx > 0) setStep(STEP_ORDER[stepIdx - 1]);
  }, [stepIdx]);

  function handleAddFile(file: string) {
    setUploadedFiles((prev) => (prev.includes(file) ? prev : [...prev, file]));
  }

  function handleRemoveFile(file: string) {
    setUploadedFiles((prev) => prev.filter((f) => f !== file));
  }

  function handleAnalyze() {
    setAnalyzing(true);
    window.setTimeout(() => {
      setAnalyzing(false);
      setStep("sheetPreview");
    }, 1000);
  }

  return (
    <div className="dc-flow">
      {step === "upload" && (
        <UploadStep
          uploadedFiles={uploadedFiles}
          analyzing={analyzing}
          onAddFile={handleAddFile}
          onRemoveFile={handleRemoveFile}
          onAnalyze={handleAnalyze}
        />
      )}
      {step === "sheetPreview" && <SheetPreviewStep onBack={goBack} />}
    </div>
  );
}
