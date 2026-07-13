import { useRef, useState } from "react";
import { useLabScanners } from "../../../hooks/useLabScanners";
import { DocumentEditorModal } from "../../shared/DocumentEditorModal";
import {
  simulateScannerCapture,
  SCANNER_UPLOAD_FILE_TYPES,
  SCANNER_RESOLUTION_OPTIONS,
  SCANNER_COLOR_MODE_OPTIONS,
  SCANNER_PAPER_SIZE_OPTIONS,
  DEFAULT_SCANNER_SCAN_SETTINGS,
  type ScannerScanSettings,
} from "../../../data/scannerVendors";

type Screen = "upload-options" | "scan-document" | "pdf-preview";

interface Props {
  open: boolean;
  patientName: string;
  billId: string | number;
  billDate: string;
  labId: number;
  onClose: () => void;
}

function UploadCloudIcon() {
  return (
    <svg viewBox="0 0 80 80" width="72" height="72" fill="none" aria-hidden>
      <circle cx="40" cy="40" r="34" fill="#eef4fb" />
      <path d="M40 26v22M30 36l10-10 10 10" stroke="#3b71ca" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M26 52h28" stroke="#3b71ca" strokeWidth="2.2" strokeLinecap="round" />
    </svg>
  );
}

function CameraIcon() {
  return (
    <svg viewBox="0 0 80 80" width="72" height="72" fill="none" aria-hidden>
      <circle cx="40" cy="40" r="34" fill="#eef4fb" />
      <rect x="20" y="30" width="40" height="28" rx="4" stroke="#3b71ca" strokeWidth="2" />
      <circle cx="40" cy="44" r="8" stroke="#3b71ca" strokeWidth="2" />
      <circle cx="40" cy="44" r="3.5" stroke="#3b71ca" strokeWidth="1.5" />
      <rect x="33" y="22" width="14" height="10" rx="2" stroke="#3b71ca" strokeWidth="1.5" />
    </svg>
  );
}

function ScanDocumentIcon() {
  return (
    <svg viewBox="0 0 80 80" width="72" height="72" fill="none" aria-hidden>
      <circle cx="40" cy="40" r="34" fill="#eef4fb" />
      <rect x="26" y="28" width="28" height="24" rx="1" stroke="#3b71ca" strokeWidth="2" strokeLinejoin="round" />
      <path d="M30 40h20" stroke="#3b71ca" strokeWidth="2" strokeLinecap="round" />
      <path d="M20 24v-4h4M60 24v-4h-4M20 56v4h4M60 56v4h-4" stroke="#3b71ca" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function ConnectedBadge() {
  return (
    <div className="bill-attach-connected-badge">
      <span className="bill-attach-connected-dot" />
      Connected
      <button className="bill-attach-connected-close" aria-label="Dismiss">×</button>
    </div>
  );
}

export function UploadBillAttachmentsModal({
  open,
  patientName,
  billId,
  billDate,
  labId,
  onClose,
}: Props) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const cameraInputRef = useRef<HTMLInputElement>(null);

  const [screen, setScreen] = useState<Screen>("upload-options");
  const [scanStatus, setScanStatus] = useState<"idle" | "scanning">("idle");
  const [scanSettingsOpen, setScanSettingsOpen] = useState(false);
  const [fileType, setFileType] = useState("PDF");
  const [duplex, setDuplex] = useState(true);
  const [scanSettings, setScanSettings] = useState<ScannerScanSettings>(DEFAULT_SCANNER_SCAN_SETTINGS);
  const [draftSettings, setDraftSettings] = useState<ScannerScanSettings>(DEFAULT_SCANNER_SCAN_SETTINGS);
  const [scannedPages, setScannedPages] = useState(0);
  const [editorOpen, setEditorOpen] = useState(false);

  const { hasScanner, primaryScanner } = useLabScanners(labId);

  if (!open) return null;

  function handleClose() {
    setScreen("upload-options");
    setScanStatus("idle");
    setScanSettingsOpen(false);
    setScannedPages(0);
    onClose();
  }

  async function handleScan() {
    if (scanStatus === "scanning") return;
    setScanStatus("scanning");
    try {
      const scanner = primaryScanner ?? {
        id: "demo",
        modelId: "ambir-490i",
        modelName: "Ambir ImageScan Pro 490i",
        brand: "Ambir",
        baseUrl: "http://localhost:8080",
        scanSettings,
      };
      await simulateScannerCapture(scanner);
      setScannedPages(duplex ? 2 : 1);
      setScreen("pdf-preview");
    } finally {
      setScanStatus("idle");
    }
  }

  function openScanSettings() {
    setDraftSettings({ ...scanSettings });
    setScanSettingsOpen(true);
  }

  function saveScanSettings() {
    setScanSettings({ ...draftSettings });
    setScanSettingsOpen(false);
  }

  const modalTitle =
    screen === "scan-document"
      ? `Scan Document${hasScanner && primaryScanner ? ` (${primaryScanner.modelName})` : ""}`
      : "Upload Bill Attachments";

  return (
    <div className="bill-attach-overlay" onClick={handleClose}>
      <div
        className="bill-attach-modal"
        role="dialog"
        aria-modal="true"
        aria-label={modalTitle}
        style={{ maxWidth: screen === "pdf-preview" ? 960 : 640 }}
        onClick={(e) => e.stopPropagation()}
      >
        {(hasScanner || screen === "pdf-preview") && <ConnectedBadge />}

        <div className="bill-attach-modal-header">
          <span className="bill-attach-modal-title">{modalTitle}</span>
          <button className="bill-attach-modal-close" onClick={handleClose} aria-label="Close">×</button>
        </div>

        {screen === "upload-options" && (
          <>
            <div className="bill-attach-body">
              <div className="bill-attach-tiles-row">
                <div className="bill-attach-tile-col">
                  <div className="bill-attach-tile">
                    <UploadCloudIcon />
                  </div>
                  <button
                    type="button"
                    className="bill-attach-tile-btn"
                    onClick={() => fileInputRef.current?.click()}
                  >
                    Add New File
                  </button>
                  <input
                    ref={fileInputRef}
                    type="file"
                    className="bill-attach-hidden-input"
                    accept=".jpg,.jpeg,.png,.pdf"
                    onChange={() => {}}
                  />
                </div>

                <div className="bill-attach-tile-col">
                  <div className="bill-attach-tile">
                    <CameraIcon />
                  </div>
                  <button
                    type="button"
                    className="bill-attach-tile-btn"
                    onClick={() => cameraInputRef.current?.click()}
                  >
                    Use Camera
                  </button>
                  <input
                    ref={cameraInputRef}
                    type="file"
                    className="bill-attach-hidden-input"
                    accept="image/*"
                    capture="environment"
                    onChange={() => {}}
                  />
                </div>

                <div className="bill-attach-tile-col">
                  <div className="bill-attach-tile bill-attach-tile--scan">
                    <ScanDocumentIcon />
                  </div>
                  <button
                    type="button"
                    className="bill-attach-tile-btn bill-attach-tile-btn--primary"
                    onClick={() => setScreen("scan-document")}
                  >
                    Scan Document
                  </button>
                </div>
              </div>

              <p className="bill-attach-extensions">Allowed Extensions: JPG, PNG, PDF</p>
              <p className="bill-attach-meta">Patient Name: {patientName}</p>
              <p className="bill-attach-meta">Bill Id: {billId}</p>
              <p className="bill-attach-meta" style={{ marginBottom: 0 }}>Bill Date: {billDate}</p>
            </div>

            <div className="bill-attach-footer">
              <button className="bill-attach-btn bill-attach-btn--danger" onClick={handleClose}>Cancel</button>
              <button className="bill-attach-btn">Show Attachments</button>
              <button className="bill-attach-btn bill-attach-btn--primary" disabled>Upload</button>
            </div>
          </>
        )}

        {screen === "scan-document" && (
          <>
            <div className="bill-attach-body bill-attach-body--scan">
              {scanStatus === "idle" ? (
                <div className="bill-attach-scan-prompt">Click Scan to start scanning your document</div>
              ) : (
                <div className="bill-attach-scanning-state">
                  <div className="bill-attach-spinner" />
                  <span className="bill-attach-scanning-text">Scanning...</span>
                </div>
              )}

              <div className="bill-attach-scan-controls">
                <div className="bill-attach-scan-controls-left">
                  <span className="bill-attach-file-type-label">Upload File Type</span>
                  <select
                    className="bill-attach-select"
                    value={fileType}
                    onChange={(e) => setFileType(e.target.value)}
                    disabled={scanStatus === "scanning"}
                  >
                    {SCANNER_UPLOAD_FILE_TYPES.map((t) => (
                      <option key={t}>{t}</option>
                    ))}
                  </select>
                  <button
                    className="bill-attach-gear-btn"
                    onClick={openScanSettings}
                    aria-label="Scan settings"
                    disabled={scanStatus === "scanning"}
                  >
                    ⚙
                  </button>
                </div>
                <div className="bill-attach-scan-controls-right">
                  <label className="bill-attach-duplex-label">
                    <input
                      type="checkbox"
                      checked={duplex}
                      onChange={(e) => setDuplex(e.target.checked)}
                      disabled={scanStatus === "scanning"}
                    />
                    Duplex
                  </label>
                  <button
                    className={`bill-attach-scan-btn${scanStatus === "scanning" ? " bill-attach-scan-btn--scanning" : ""}`}
                    onClick={handleScan}
                    disabled={scanStatus === "scanning"}
                  >
                    {scanStatus === "scanning" && <span className="bill-attach-scan-spinner" />}
                    Scan
                  </button>
                </div>
              </div>
            </div>

          </>
        )}

        {screen === "pdf-preview" && (
          <>
            <div className="bill-attach-body bill-attach-body--preview">
              <p className="bill-attach-pdf-label">PDF Document ({scannedPages} page{scannedPages !== 1 ? "s" : ""})</p>
              <div className="bill-attach-pdf-viewer">
                <div className="bill-attach-pdf-toolbar">
                  <button className="bill-attach-pdf-tbtn">☰</button>
                  <button className="bill-attach-pdf-tbtn">⤢</button>
                  <button className="bill-attach-pdf-tbtn">···</button>
                  <button className="bill-attach-pdf-tbtn">−</button>
                  <button className="bill-attach-pdf-tbtn">+</button>
                  <button className="bill-attach-pdf-tbtn">⊡</button>
                  <div className="bill-attach-pdf-page-row">
                    <input className="bill-attach-pdf-page-input" defaultValue="1" />
                    <span>of {scannedPages}</span>
                  </div>
                  <button className="bill-attach-pdf-tbtn">↺</button>
                  <button className="bill-attach-pdf-tbtn">⤣</button>
                  <span style={{ flex: 1 }} />
                  <button className="bill-attach-pdf-tbtn">🔍</button>
                  <button className="bill-attach-pdf-tbtn">💾</button>
                  <button className="bill-attach-pdf-tbtn">···</button>
                </div>
                <div className="bill-attach-pdf-content">
                  <div className="bill-attach-pdf-page">
                    <span style={{ fontSize: 20, color: "#555", fontFamily: "Georgia, serif" }}>Scanned</span>
                    <span style={{ fontSize: 16, color: "#888", fontFamily: "Georgia, serif" }}>Document</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="bill-attach-footer bill-attach-footer--preview">
              <button className="bill-attach-btn" onClick={() => setScreen("scan-document")}>Back</button>
              <button className="bill-attach-btn bill-attach-btn--danger" onClick={handleClose}>Cancel</button>
              <button className="bill-attach-btn bill-attach-btn--edit" onClick={() => setEditorOpen(true)}>Edit</button>
              <span className="bill-attach-file-type-label">Upload File Type</span>
              <select
                className="bill-attach-select"
                value={fileType}
                onChange={(e) => setFileType(e.target.value)}
              >
                {SCANNER_UPLOAD_FILE_TYPES.map((t) => (
                  <option key={t}>{t}</option>
                ))}
              </select>
              <label className="bill-attach-duplex-label">
                <input type="checkbox" checked={duplex} onChange={(e) => setDuplex(e.target.checked)} />
                Duplex
              </label>
              <span style={{ flex: 1 }} />
              <button className="bill-attach-btn">Add Page</button>
              <button className="bill-attach-btn">Show Attachments</button>
              <button className="bill-attach-btn bill-attach-btn--teal" onClick={handleClose}>Confirm and Upload</button>
            </div>
          </>
        )}
      </div>

      {scanSettingsOpen && (
        <div
          className="bill-attach-settings-overlay"
          onClick={(e) => e.stopPropagation()}
        >
          <div className="bill-attach-settings-modal" role="dialog" aria-label="Scan Settings">
            <div className="bill-attach-modal-header">
              <span className="bill-attach-modal-title">Scan Settings</span>
              <button className="bill-attach-modal-close" onClick={() => setScanSettingsOpen(false)} aria-label="Close">×</button>
            </div>

            <div className="bill-attach-body">
              <div className="bill-attach-settings-grid">
                <div className="bill-attach-settings-field">
                  <label>Scan Resolution (DPI)</label>
                  <select
                    value={draftSettings.resolutionDpi}
                    onChange={(e) => setDraftSettings((s) => ({ ...s, resolutionDpi: e.target.value }))}
                  >
                    {SCANNER_RESOLUTION_OPTIONS.map((o) => <option key={o}>{o}</option>)}
                  </select>
                </div>
                <div className="bill-attach-settings-field">
                  <label>Color Mode</label>
                  <select
                    value={draftSettings.colorMode}
                    onChange={(e) => setDraftSettings((s) => ({ ...s, colorMode: e.target.value }))}
                  >
                    {SCANNER_COLOR_MODE_OPTIONS.map((o) => <option key={o}>{o}</option>)}
                  </select>
                </div>
                <div className="bill-attach-settings-field">
                  <label>Paper Size</label>
                  <select
                    value={draftSettings.paperSize}
                    onChange={(e) => setDraftSettings((s) => ({ ...s, paperSize: e.target.value }))}
                  >
                    {SCANNER_PAPER_SIZE_OPTIONS.map((o) => <option key={o}>{o}</option>)}
                  </select>
                </div>
              </div>

              <div className="bill-attach-toggles-row">
                <label className="bill-attach-toggle-item">
                  <input
                    type="checkbox"
                    checked={draftSettings.autoCrop}
                    onChange={(e) => setDraftSettings((s) => ({ ...s, autoCrop: e.target.checked }))}
                  />
                  Auto Crop
                </label>
                <label className="bill-attach-toggle-item">
                  <input
                    type="checkbox"
                    checked={draftSettings.autoDeskew}
                    onChange={(e) => setDraftSettings((s) => ({ ...s, autoDeskew: e.target.checked }))}
                  />
                  Auto Deskew
                </label>
                <label className="bill-attach-toggle-item">
                  <input
                    type="checkbox"
                    checked={draftSettings.autoRotate}
                    onChange={(e) => setDraftSettings((s) => ({ ...s, autoRotate: e.target.checked }))}
                  />
                  Auto Rotate
                </label>
              </div>
            </div>

            <div className="bill-attach-footer">
              <button className="bill-attach-btn" onClick={() => setScanSettingsOpen(false)}>Cancel</button>
              <button className="bill-attach-btn bill-attach-btn--teal" onClick={saveScanSettings}>Save Settings</button>
            </div>
          </div>
        </div>
      )}

      <DocumentEditorModal
        open={editorOpen}
        pageCount={scannedPages}
        onClose={() => setEditorOpen(false)}
        onApply={() => setEditorOpen(false)}
      />
    </div>
  );
}
