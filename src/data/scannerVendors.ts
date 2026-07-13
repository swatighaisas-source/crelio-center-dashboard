export interface ScannerModel {
  id: string;
  name: string;
  brand: string;
}

export interface ScannerScanSettings {
  resolutionDpi: string;
  colorMode: string;
  paperSize: string;
  duplexScanning: boolean;
  autoCrop: boolean;
  autoDeskew: boolean;
  autoRotate: boolean;
  uploadFileType: string;
}

export interface ScannerDevice {
  id: string;
  modelId: string;
  modelName: string;
  brand: string;
  baseUrl: string;
  scanSettings: ScannerScanSettings;
}

export const SCANNER_MODELS: ScannerModel[] = [
  { id: "ambir-490i", name: "Ambir ImageScan Pro 490i", brand: "Ambir" },
  { id: "ambir-687ix", name: "Ambir nCard 687ix", brand: "Ambir" },
  { id: "fujitsu-fi7160", name: "Fujitsu fi-7160", brand: "Fujitsu" },
  { id: "epson-ds530", name: "Epson WorkForce DS-530", brand: "Epson" },
];

/** Scanners available in the connect flow (registration / centre details). */
export const SUPPORTED_SCANNER_MODELS: ScannerModel[] = [
  { id: "ambir-490i", name: "Ambir ImageScan Pro 490i", brand: "Ambir" },
];

export const SCANNER_RESOLUTION_OPTIONS = ["Default", "100 DPI", "200 DPI", "300 DPI", "600 DPI"];
export const SCANNER_COLOR_MODE_OPTIONS = ["Default", "Color", "Grayscale", "Black & White"];
export const SCANNER_PAPER_SIZE_OPTIONS = ["Default", "None", "A4", "Letter", "Legal"];
export const SCANNER_UPLOAD_FILE_TYPES = ["PDF", "JPEG", "PNG", "TIFF"];

export const DEFAULT_SCANNER_BASE_URL = "http://localhost:8080";

export const DEFAULT_SCANNER_SCAN_SETTINGS: ScannerScanSettings = {
  resolutionDpi: "Default",
  colorMode: "Default",
  paperSize: "Default",
  duplexScanning: true,
  autoCrop: true,
  autoDeskew: true,
  autoRotate: true,
  uploadFileType: "PDF",
};

export function getScannerModel(id: string): ScannerModel | undefined {
  return SCANNER_MODELS.find((m) => m.id === id);
}

/** Demo: succeeds when base URL matches the local Ambir agent endpoint. */
export function testScannerConnection(baseUrl: string): Promise<boolean> {
  const normalized = baseUrl.trim().replace(/\/$/, "");
  return new Promise((resolve) => {
    window.setTimeout(() => {
      resolve(normalized === DEFAULT_SCANNER_BASE_URL);
    }, 1400);
  });
}

export function simulateScannerCapture(
  scanner: ScannerDevice,
): Promise<{ fileName: string }> {
  const ext = scanner.scanSettings.uploadFileType.toLowerCase();
  const fileExt = ext === "jpeg" ? "jpg" : ext.toLowerCase();
  return new Promise((resolve) => {
    window.setTimeout(() => {
      resolve({ fileName: `scanned-id-proof.${fileExt}` });
    }, 1200);
  });
}

export function buildScannerDevice(
  partial: Pick<ScannerDevice, "id" | "modelId" | "baseUrl" | "scanSettings">,
): ScannerDevice | null {
  const model = getScannerModel(partial.modelId);
  if (!model) return null;
  return {
    id: partial.id,
    modelId: partial.modelId,
    modelName: model.name,
    brand: model.brand,
    baseUrl: partial.baseUrl.trim(),
    scanSettings: partial.scanSettings,
  };
}
