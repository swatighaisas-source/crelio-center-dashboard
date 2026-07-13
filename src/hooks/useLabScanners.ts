import { useLabs } from "../context/LabsContext";
import type { ScannerDevice } from "../data/scannerVendors";

export function useLabScanners(labId: number) {
  const { getLabScanners, saveLabScanner, removeLabScanner } = useLabs();
  const scanners = getLabScanners(labId);

  return {
    scanners,
    saveScanner: (device: ScannerDevice) => saveLabScanner(labId, device),
    removeScanner: (scannerId: string) => removeLabScanner(labId, scannerId),
    hasScanner: scanners.length > 0,
    primaryScanner: scanners[0] ?? null,
  };
}
