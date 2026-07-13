import { useEffect, useRef, useState } from "react";
import {
  buildScannerDevice,
  DEFAULT_SCANNER_BASE_URL,
  DEFAULT_SCANNER_SCAN_SETTINGS,
  getScannerModel,
  SUPPORTED_SCANNER_MODELS,
  testScannerConnection,
  type ScannerDevice,
  type ScannerScanSettings,
} from "../../data/scannerVendors";
import { ScannerScanSettingsFooter, ScannerScanSettingsStep } from "./ScannerScanSettingsStep";
import { ScannerStepper, type ScannerFlowStep } from "./ScannerStepper";

type ConnectionStatus = "idle" | "connecting" | "success" | "failure";

interface ConnectForm {
  modelId: string;
  baseUrl: string;
}

const DEFAULT_MODEL_ID = SUPPORTED_SCANNER_MODELS[0]?.id ?? "";

const EMPTY_CONNECT: ConnectForm = {
  modelId: DEFAULT_MODEL_ID,
  baseUrl: DEFAULT_SCANNER_BASE_URL,
};

interface Props {
  open: boolean;
  mode: "add" | "edit";
  initialDevice?: ScannerDevice | null;
  stacked?: boolean;
  onClose: () => void;
  onSave: (device: ScannerDevice) => void;
}

export function ScannerModal({ open, mode, initialDevice, stacked = false, onClose, onSave }: Props) {
  const [step, setStep] = useState<ScannerFlowStep>("select-scanner");
  const [maxStep, setMaxStep] = useState<ScannerFlowStep>("select-scanner");
  const [connectForm, setConnectForm] = useState<ConnectForm>(EMPTY_CONNECT);
  const [scanSettings, setScanSettings] = useState<ScannerScanSettings>(DEFAULT_SCANNER_SCAN_SETTINGS);
  const [connectionStatus, setConnectionStatus] = useState<ConnectionStatus>("idle");
  const testRunRef = useRef(0);
  const deviceIdRef = useRef(`scanner-${Date.now()}`);

  useEffect(() => {
    if (!open) {
      setStep("select-scanner");
      setMaxStep("select-scanner");
      setConnectForm(EMPTY_CONNECT);
      setScanSettings(DEFAULT_SCANNER_SCAN_SETTINGS);
      setConnectionStatus("idle");
      testRunRef.current += 1;
      deviceIdRef.current = `scanner-${Date.now()}`;
      return;
    }

    if (mode === "edit" && initialDevice) {
      deviceIdRef.current = initialDevice.id;
      setConnectForm({
        modelId: initialDevice.modelId,
        baseUrl: initialDevice.baseUrl,
      });
      setScanSettings(initialDevice.scanSettings);
      setConnectionStatus("success");
      setStep("connect");
      setMaxStep("scan-settings");
    }
  }, [open, mode, initialDevice]);

  if (!open) return null;

  const model = getScannerModel(connectForm.modelId);
  const scannerSelected = connectForm.modelId !== "";
  const baseUrlValid = connectForm.baseUrl.trim() !== "";
  const formValid = scannerSelected && baseUrlValid;
  const isConnecting = connectionStatus === "connecting";
  const connectionOk = connectionStatus === "success";
  const canGoToScanSettings = connectionOk && formValid;

  const modalTitle =
    step === "scan-settings"
      ? "Scanner Configuration"
      : step === "select-scanner"
        ? "Select Scanner"
        : mode === "edit"
          ? "Edit Scanner"
          : "Add Scanner";

  function updateBaseUrl(baseUrl: string) {
    setConnectForm((prev) => ({ ...prev, baseUrl }));
    if (mode === "add") {
      setConnectionStatus("idle");
    }
  }

  function selectModel(modelId: string) {
    setConnectForm((prev) => ({ ...prev, modelId }));
    if (mode === "add") {
      setConnectionStatus("idle");
    }
  }

  function handleClose() {
    onClose();
  }

  function goToStep(next: ScannerFlowStep) {
    if (next === "connect" && !scannerSelected) return;
    if (next === "scan-settings" && !canGoToScanSettings && mode === "add") return;

    setStep(next);
    if (stepIndex(next) > stepIndex(maxStep)) {
      setMaxStep(next);
    }
  }

  function stepIndex(s: ScannerFlowStep): number {
    const order: ScannerFlowStep[] = ["select-scanner", "connect", "scan-settings"];
    return order.indexOf(s);
  }

  function handleStepperClick(target: ScannerFlowStep) {
    if (target === "select-scanner") {
      goToStep("select-scanner");
      return;
    }
    if (target === "connect" && (scannerSelected || mode === "edit")) {
      goToStep("connect");
      return;
    }
    if (target === "scan-settings" && (canGoToScanSettings || mode === "edit")) {
      goToStep("scan-settings");
    }
  }

  async function handleTestConnection() {
    if (!baseUrlValid || isConnecting) return;

    const runId = testRunRef.current + 1;
    testRunRef.current = runId;
    setConnectionStatus("connecting");

    const ok = await testScannerConnection(connectForm.baseUrl);
    if (testRunRef.current !== runId) return;

    setConnectionStatus(ok ? "success" : "failure");
  }

  function buildDevice(): ScannerDevice | null {
    return buildScannerDevice({
      id: deviceIdRef.current,
      modelId: connectForm.modelId,
      baseUrl: connectForm.baseUrl,
      scanSettings,
    });
  }

  function handleFinish() {
    const device = buildDevice();
    if (!device) return;
    onSave(device);
    handleClose();
  }

  return (
    <div
      className={`lab-modal-overlay${stacked ? " lab-modal-overlay--stacked" : ""}`}
      onClick={handleClose}
    >
      <div
        className={`lab-modal cd-scanner-modal${step === "scan-settings" ? " cd-scanner-modal--wide" : ""}`}
        role="dialog"
        aria-modal="true"
        aria-labelledby="scanner-modal-title"
        onClick={(e) => e.stopPropagation()}
      >
        <header className="lab-modal__header">
          <h2 id="scanner-modal-title">{modalTitle}</h2>
          <button type="button" className="lab-modal__close" onClick={handleClose} aria-label="Close">
            ×
          </button>
        </header>

        <ScannerStepper current={step} maxReached={maxStep} onStepClick={handleStepperClick} />

        <div className="cd-scanner-modal__body">
          {step === "select-scanner" && (
            <fieldset className="cd-scanner-select">
              <legend className="cd-scanner-select__legend">Supported scanners</legend>
              <ul className="cd-scanner-select__list">
                {SUPPORTED_SCANNER_MODELS.map((scanner) => {
                  const isSelected = connectForm.modelId === scanner.id;
                  return (
                    <li key={scanner.id}>
                      <label
                        className={`cd-scanner-select__option${
                          isSelected ? " cd-scanner-select__option--selected" : ""
                        }`}
                      >
                        <input
                          type="radio"
                          name="scanner-model"
                          className="cd-scanner-select__radio"
                          value={scanner.id}
                          checked={isSelected}
                          onChange={() => selectModel(scanner.id)}
                        />
                        <span className="cd-scanner-select__content">
                          <span className="cd-scanner-select__name">{scanner.name}</span>
                          <span className="cd-scanner-select__brand">{scanner.brand}</span>
                        </span>
                      </label>
                    </li>
                  );
                })}
              </ul>
            </fieldset>
          )}

          {step === "connect" && (
            <>
              <div className="cd-scanner-modal__selected">
                <span className="cd-scanner-modal__label">Scanner</span>
                <p className="cd-scanner-modal__selected-name">{model?.name ?? "—"}</p>
              </div>

              <label className="cd-scanner-modal__field">
                <span className="cd-scanner-modal__label">Add Base URL</span>
                <input
                  type="url"
                  className="cd-scanner-modal__input"
                  value={connectForm.baseUrl}
                  onChange={(e) => updateBaseUrl(e.target.value)}
                  placeholder="http://localhost:8080"
                  disabled={isConnecting}
                />
              </label>

              <p className="cd-scanner-modal__hint">
                You can find the base URL in the {model?.brand ?? "scanner"} scanner setup document.
                Example:{" "}
                <span className="cd-scanner-modal__hint-link">{DEFAULT_SCANNER_BASE_URL}</span>
              </p>

              {connectionStatus === "connecting" && (
                <div
                  className="cd-scanner-modal__status cd-scanner-modal__status--connecting"
                  aria-live="polite"
                >
                  <div className="cd-scanner-modal__spinner cd-scanner-modal__spinner--large" aria-hidden />
                  <p>Connecting......</p>
                </div>
              )}

              {connectionStatus === "success" && (
                <div className="cd-scanner-modal__status cd-scanner-modal__status--success" role="status">
                  <p>Scanner connected successfully! Continue to configure scan settings.</p>
                </div>
              )}

              {connectionStatus === "failure" && (
                <div className="cd-scanner-modal__status cd-scanner-modal__status--failure" role="alert">
                  <p className="cd-scanner-modal__error-title">Failed to connect to scanner.</p>
                  <ul className="cd-scanner-modal__error-list">
                    <li>Please check if the scanner is on</li>
                    <li>Make sure the base URL is correct</li>
                    <li>Confirm the scanner software is running locally</li>
                    <li>Retry Connection</li>
                    <li>
                      If you still face issues,{" "}
                      <a href="mailto:support@creliohealth.com" className="cd-scanner-modal__support-link">
                        Contact Support
                      </a>
                    </li>
                  </ul>
                </div>
              )}
            </>
          )}

          {step === "scan-settings" && (
            <ScannerScanSettingsStep settings={scanSettings} onChange={setScanSettings} />
          )}
        </div>

        {step === "select-scanner" && (
          <footer className="lab-modal__footer cd-scanner-modal__footer">
            <button type="button" className="cd-scanner-modal__btn-close" onClick={handleClose}>
              Close
            </button>
            <div className="cd-scanner-modal__footer-actions">
              <button
                type="button"
                className="btn-solid btn-solid--sm"
                onClick={() => goToStep("connect")}
                disabled={!scannerSelected}
              >
                Next
              </button>
            </div>
          </footer>
        )}

        {step === "connect" && (
          <footer className="lab-modal__footer cd-scanner-modal__footer">
            <button type="button" className="cd-scanner-modal__btn-close" onClick={() => goToStep("select-scanner")}>
              Back
            </button>
            <div className="cd-scanner-modal__footer-actions">
              {connectionStatus === "failure" ? (
                <button
                  type="button"
                  className="cd-scanner-modal__btn-test"
                  onClick={handleTestConnection}
                  disabled={!baseUrlValid || isConnecting}
                >
                  Retry connection
                </button>
              ) : (
                <button
                  type="button"
                  className="cd-scanner-modal__btn-test"
                  onClick={handleTestConnection}
                  disabled={!baseUrlValid || isConnecting}
                >
                  Test connection
                </button>
              )}
              <button
                type="button"
                className="btn-solid btn-solid--sm"
                onClick={() => goToStep("scan-settings")}
                disabled={!canGoToScanSettings}
              >
                Next
              </button>
            </div>
          </footer>
        )}

        {step === "scan-settings" && (
          <footer className="lab-modal__footer cd-scanner-modal__footer cd-scanner-modal__footer--scan">
            <ScannerScanSettingsFooter settings={scanSettings} onChange={setScanSettings} />
            <div className="cd-scanner-modal__footer-actions">
              <button type="button" className="cd-scanner-modal__btn-close" onClick={() => goToStep("connect")}>
                Back
              </button>
              <button type="button" className="btn-solid btn-solid--sm" onClick={handleFinish}>
                Save Settings
              </button>
            </div>
          </footer>
        )}
      </div>
    </div>
  );
}
