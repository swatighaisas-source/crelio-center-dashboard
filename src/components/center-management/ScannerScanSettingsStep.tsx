import {
  SCANNER_COLOR_MODE_OPTIONS,
  SCANNER_PAPER_SIZE_OPTIONS,
  SCANNER_RESOLUTION_OPTIONS,
  SCANNER_UPLOAD_FILE_TYPES,
  type ScannerScanSettings,
} from "../../data/scannerVendors";

interface Props {
  settings: ScannerScanSettings;
  onChange: (settings: ScannerScanSettings) => void;
}

const TOGGLE_OPTIONS: { key: keyof Pick<
  ScannerScanSettings,
  "duplexScanning" | "autoCrop" | "autoDeskew" | "autoRotate"
>; label: string }[] = [
  { key: "duplexScanning", label: "Duplex Scanning" },
  { key: "autoCrop", label: "Auto Crop" },
  { key: "autoDeskew", label: "Auto Deskew" },
  { key: "autoRotate", label: "Auto Rotate" },
];

export function ScannerScanSettingsStep({ settings, onChange }: Props) {
  function update(patch: Partial<ScannerScanSettings>) {
    onChange({ ...settings, ...patch });
  }

  function toggleOption(key: (typeof TOGGLE_OPTIONS)[number]["key"]) {
    update({ [key]: !settings[key] });
  }

  return (
    <div className="cd-scanner-scan">
      <section className="cd-scanner-scan__section">
        <h3 className="cd-scanner-scan__section-title">Scan settings</h3>
        <div className="cd-scanner-scan__row">
          <label className="cd-scanner-scan__field">
            <span className="cd-scanner-scan__field-name">Scan Resolution (DPI)</span>
            <select
              className="cd-select cd-scanner-modal__select"
              value={settings.resolutionDpi}
              onChange={(e) => update({ resolutionDpi: e.target.value })}
            >
              {SCANNER_RESOLUTION_OPTIONS.map((opt) => (
                <option key={opt} value={opt}>
                  {opt}
                </option>
              ))}
            </select>
          </label>
          <label className="cd-scanner-scan__field">
            <span className="cd-scanner-scan__field-name">Color Mode</span>
            <select
              className="cd-select cd-scanner-modal__select"
              value={settings.colorMode}
              onChange={(e) => update({ colorMode: e.target.value })}
            >
              {SCANNER_COLOR_MODE_OPTIONS.map((opt) => (
                <option key={opt} value={opt}>
                  {opt}
                </option>
              ))}
            </select>
          </label>
          <label className="cd-scanner-scan__field">
            <span className="cd-scanner-scan__field-name">Default Paper Size</span>
            <select
              className="cd-select cd-scanner-modal__select"
              value={settings.paperSize}
              onChange={(e) => update({ paperSize: e.target.value })}
            >
              {SCANNER_PAPER_SIZE_OPTIONS.map((opt) => (
                <option key={opt} value={opt}>
                  {opt}
                </option>
              ))}
            </select>
          </label>
        </div>
      </section>

      <section className="cd-scanner-scan__section">
        <h3 className="cd-scanner-scan__section-title">Scan options</h3>
        <div className="cd-scanner-scan__toggles">
          {TOGGLE_OPTIONS.map(({ key, label }) => (
            <label key={key} className="cd-scanner-scan__toggle">
              <input
                type="checkbox"
                checked={settings[key]}
                onChange={() => toggleOption(key)}
              />
              <span className="cd-scanner-scan__toggle-label">{label}</span>
            </label>
          ))}
        </div>
      </section>
    </div>
  );
}

export function ScannerScanSettingsFooter({
  settings,
  onChange,
}: {
  settings: ScannerScanSettings;
  onChange: (settings: ScannerScanSettings) => void;
}) {
  return (
    <div className="cd-scanner-scan__file-type">
      <span className="cd-scanner-scan__file-type-label">Upload File Type</span>
      <select
        className="cd-select cd-scanner-scan__file-type-select"
        value={settings.uploadFileType}
        onChange={(e) => onChange({ ...settings, uploadFileType: e.target.value })}
        aria-label="Upload File Type"
      >
        {SCANNER_UPLOAD_FILE_TYPES.map((opt) => (
          <option key={opt} value={opt}>
            {opt}
          </option>
        ))}
      </select>
    </div>
  );
}
