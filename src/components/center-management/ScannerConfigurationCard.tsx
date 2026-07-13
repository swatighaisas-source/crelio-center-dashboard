import { useState } from "react";
import type { ScannerDevice } from "../../data/scannerVendors";
import { useLabScanners } from "../../hooks/useLabScanners";
import { ScannerModal } from "./ScannerModal";

type ModalState =
  | { open: false }
  | { open: true; mode: "add" }
  | { open: true; mode: "edit"; device: ScannerDevice };

interface Props {
  labId: number;
}

export function ScannerConfigurationCard({ labId }: Props) {
  const { scanners, saveScanner, removeScanner } = useLabScanners(labId);
  const [modal, setModal] = useState<ModalState>({ open: false });

  function handleRemove(scannerId: string) {
    removeScanner(scannerId);
    if (modal.open && modal.mode === "edit" && modal.device.id === scannerId) {
      setModal({ open: false });
    }
  }

  return (
    <>
      <section className="cd-card cd-card--compact">
        <h3 className="cd-card__title cd-card__title--solo">Scanner Configuration</h3>

        {scanners.length === 0 ? (
          <p className="cd-scanner-empty">No scanners configured yet.</p>
        ) : (
          <ul className="cd-scanner-list">
            {scanners.map((scanner) => (
              <li key={scanner.id} className="cd-scanner-list__item">
                <div className="cd-scanner-list__main">
                  <span className="cd-scanner-list__name">{scanner.modelName}</span>
                  <span className="cd-scanner-list__vendor">{scanner.baseUrl}</span>
                </div>
                <div className="cd-scanner-list__actions">
                  <button
                    type="button"
                    className="cd-scanner-list__edit"
                    onClick={() => setModal({ open: true, mode: "edit", device: scanner })}
                  >
                    Edit
                  </button>
                  <button
                    type="button"
                    className="cd-scanner-list__remove"
                    onClick={() => handleRemove(scanner.id)}
                    aria-label={`Remove ${scanner.modelName}`}
                  >
                    Remove
                  </button>
                </div>
              </li>
            ))}
          </ul>
        )}

        <button
          type="button"
          className="cd-outline-btn cd-outline-btn--full"
          onClick={() => setModal({ open: true, mode: "add" })}
        >
          Add Scanner
        </button>
      </section>

      <ScannerModal
        open={modal.open}
        mode={modal.open ? modal.mode : "add"}
        initialDevice={modal.open && modal.mode === "edit" ? modal.device : null}
        onClose={() => setModal({ open: false })}
        onSave={saveScanner}
      />
    </>
  );
}
