import { useEffect, useRef, useState } from "react";
import uploadCameraIcon from "../../assets/registration/upload-camera.png";
import uploadCloudIcon from "../../assets/registration/upload-cloud.png";
import { ScannerModal } from "../center-management/ScannerModal";
import { ScanDocumentModal } from "../shared/ScanDocumentModal";
import { useLabScanners } from "../../hooks/useLabScanners";

const ID_PROOF_TYPES = [
  "Driver's License",
  "Passport",
  "National ID",
  "State ID",
  "Military ID",
  "Other",
] as const;

interface Props {
  labId: number;
  open: boolean;
  onClose: () => void;
}

function ScanDocumentIcon() {
  return (
    <svg
      className="reg-id-proof-upload-tile__icon reg-id-proof-upload-tile__icon--svg"
      viewBox="0 0 72 72"
      fill="none"
      aria-hidden
    >
      <path
        d="M22 26h28v24H22V26Z"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinejoin="round"
      />
      <path d="M26 37h20" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
      <path
        d="M16 22V18h4M56 22V18h-4M16 50v4h4M56 50v-4h4"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export function UploadPatientIdProofModal({ labId, open, onClose }: Props) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const cameraInputRef = useRef<HTMLInputElement>(null);
  const [idType, setIdType] = useState("");
  const [idNumber, setIdNumber] = useState("");
  const [selectedFileName, setSelectedFileName] = useState<string | null>(null);
  const [scannerModalOpen, setScannerModalOpen] = useState(false);
  const [scanDocModalOpen, setScanDocModalOpen] = useState(false);
  const [scannerReadyHint, setScannerReadyHint] = useState(false);

  const { hasScanner, primaryScanner, saveScanner } = useLabScanners(labId);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape" && !scannerModalOpen) onClose();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, onClose, scannerModalOpen]);

  useEffect(() => {
    if (!open) {
      setIdType("");
      setIdNumber("");
      setSelectedFileName(null);
      setScannerModalOpen(false);
      setScanDocModalOpen(false);
      setScannerReadyHint(false);
    }
  }, [open]);

  useEffect(() => {
    if (!scannerReadyHint) return undefined;
    const timer = window.setTimeout(() => setScannerReadyHint(false), 4000);
    return () => window.clearTimeout(timer);
  }, [scannerReadyHint]);

  if (!open) return null;

  function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    setSelectedFileName(file?.name ?? null);
    e.target.value = "";
  }

  function handleUpload(e: React.FormEvent) {
    e.preventDefault();
    onClose();
  }

  function handleScanClick() {
    setScanDocModalOpen(true);
  }

  return (
    <>
      <div
        className="reg-id-proof-overlay"
        role="presentation"
        onClick={onClose}
      >
        <div
          className="reg-id-proof-modal"
          role="dialog"
          aria-labelledby="reg-id-proof-title"
          aria-modal="true"
          onClick={(e) => e.stopPropagation()}
        >
          <header className="reg-id-proof-modal__header">
            <h2 id="reg-id-proof-title" className="reg-id-proof-modal__title">
              Upload Patient ID Proof
            </h2>
            <button
              type="button"
              className="reg-id-proof-modal__close"
              onClick={onClose}
              aria-label="Close"
            >
              ×
            </button>
          </header>

          <form className="reg-id-proof-modal__body" onSubmit={handleUpload}>
            <div className="reg-id-proof-upload-row">
              <div className="reg-id-proof-upload-col">
                <div className="reg-id-proof-upload-tile" aria-hidden>
                  <img src={uploadCloudIcon} alt="" className="reg-id-proof-upload-tile__icon" />
                </div>
                <button
                  type="button"
                  className="reg-id-proof-upload-action"
                  onClick={() => fileInputRef.current?.click()}
                >
                  Add New File
                </button>
                <input
                  ref={fileInputRef}
                  type="file"
                  className="reg-id-proof-upload-input"
                  accept=".jpg,.jpeg,.png,.pdf,image/jpeg,image/png,application/pdf"
                  onChange={handleFileChange}
                />
              </div>

              <div className="reg-id-proof-upload-col">
                <div className="reg-id-proof-upload-tile" aria-hidden>
                  <img src={uploadCameraIcon} alt="" className="reg-id-proof-upload-tile__icon" />
                </div>
                <button
                  type="button"
                  className="reg-id-proof-upload-action"
                  onClick={() => cameraInputRef.current?.click()}
                >
                  Use Camera
                </button>
                <input
                  ref={cameraInputRef}
                  type="file"
                  className="reg-id-proof-upload-input"
                  accept="image/*"
                  capture="environment"
                  onChange={handleFileChange}
                />
              </div>

              <div className="reg-id-proof-upload-col">
                <div className="reg-id-proof-upload-tile reg-id-proof-upload-tile--scan" aria-hidden>
                  <ScanDocumentIcon />
                </div>
                <button
                  type="button"
                  className="reg-id-proof-upload-action"
                  onClick={handleScanClick}
                >
                  Scan Document
                </button>
                {scannerReadyHint && hasScanner && (
                  <p className="reg-id-proof-scan-hint reg-id-proof-scan-hint--ready" role="status">
                    Scanner ready — you can scan now.
                  </p>
                )}
              </div>
            </div>

            <p className="reg-id-proof-extensions">Allowed Extensions: JPG, PNG, PDF</p>
            {selectedFileName && (
              <p className="reg-id-proof-selected-file" aria-live="polite">
                Selected: {selectedFileName}
              </p>
            )}

            <label className="reg-id-proof-field">
              <span className="reg-id-proof-field__label visually-hidden">ID type</span>
              <select
                className="reg-id-proof-field__control reg-id-proof-field__select"
                value={idType}
                onChange={(e) => setIdType(e.target.value)}
                required
              >
                <option value="" disabled>
                  Select Type
                </option>
                {ID_PROOF_TYPES.map((type) => (
                  <option key={type} value={type}>
                    {type}
                  </option>
                ))}
              </select>
              <span className="reg-id-proof-field__chevron" aria-hidden>
                <svg viewBox="0 0 12 8" width="12" height="8" fill="none">
                  <path
                    d="M1.5 1.5L6 6l4.5-4.5"
                    stroke="currentColor"
                    strokeWidth="1.4"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </span>
            </label>

            <label className="reg-id-proof-field">
              <span className="reg-id-proof-field__label visually-hidden">ID number</span>
              <input
                type="text"
                className="reg-id-proof-field__control"
                placeholder="ID Number"
                value={idNumber}
                onChange={(e) => setIdNumber(e.target.value)}
                required
              />
            </label>

            <footer className="reg-id-proof-modal__footer">
              <button type="button" className="reg-id-proof-btn reg-id-proof-btn--secondary" onClick={onClose}>
                Close
              </button>
              <button type="submit" className="reg-id-proof-btn reg-id-proof-btn--primary">
                Upload
              </button>
            </footer>
          </form>
        </div>
      </div>

      <ScannerModal
        open={scannerModalOpen}
        mode="add"
        stacked
        onClose={() => setScannerModalOpen(false)}
        onSave={(device) => {
          saveScanner(device);
          setScannerModalOpen(false);
          setScannerReadyHint(true);
        }}
      />

      <ScanDocumentModal
        open={scanDocModalOpen}
        scanner={primaryScanner}
        onClose={() => setScanDocModalOpen(false)}
        onConfirm={(fileName) => setSelectedFileName(fileName)}
      />
    </>
  );
}
