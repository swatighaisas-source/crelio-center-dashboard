import { useEffect, useState } from "react";
import { LabRegistryPreviewCard } from "../../create-centre/LabRegistryPreviewCard";
import type { CliaFetchPreview, NpiFetchPreview } from "../../../lib/usOnboardingPrefill";
import type { CmsCliaRecord } from "../../../services/cmsCliaApi";
import { LabRegistryRawPanel } from "./LabRegistryRawPanel";

type RegistryTab = "interpreted" | "raw";

interface Props {
  npi: string;
  clia: string;
  npiPreview: NpiFetchPreview | null;
  cliaPreview: CliaFetchPreview;
  npiRawFields: Record<string, string> | null;
  cliaRawRecord: CmsCliaRecord;
}

export function LabRegistryPreviewTabs({
  npi,
  clia,
  npiPreview,
  cliaPreview,
  npiRawFields,
  cliaRawRecord,
}: Props) {
  const [tab, setTab] = useState<RegistryTab>("interpreted");

  useEffect(() => {
    setTab("interpreted");
  }, [npi, clia, npiPreview, cliaPreview]);

  const tabId = "lab-registry-preview-panel";

  return (
    <div className="lab-registry-tabs">
      <div className="lab-registry-tabs__bar" role="tablist" aria-label="Registry data view">
        <button
          type="button"
          role="tab"
          id={`${tabId}-interpreted`}
          aria-selected={tab === "interpreted"}
          aria-controls={`${tabId}-interpreted-panel`}
          className={`lab-registry-tabs__tab${tab === "interpreted" ? " lab-registry-tabs__tab--active" : ""}`}
          onClick={() => setTab("interpreted")}
        >
          Interpreted
        </button>
        <button
          type="button"
          role="tab"
          id={`${tabId}-raw`}
          aria-selected={tab === "raw"}
          aria-controls={`${tabId}-raw-panel`}
          className={`lab-registry-tabs__tab${tab === "raw" ? " lab-registry-tabs__tab--active" : ""}`}
          onClick={() => setTab("raw")}
        >
          Raw
        </button>
      </div>

      <div
        className="lab-registry-tabs__panel lab-registry-tabs__panel--interpreted"
        role="tabpanel"
        id={`${tabId}-interpreted-panel`}
        aria-labelledby={`${tabId}-interpreted`}
        hidden={tab !== "interpreted"}
      >
        <LabRegistryPreviewCard
          compact
          npi={npi}
          clia={clia}
          npiPreview={npiPreview}
          cliaPreview={cliaPreview}
        />
      </div>

      <div
        className="lab-registry-tabs__panel lab-registry-tabs__panel--raw"
        role="tabpanel"
        id={`${tabId}-raw-panel`}
        aria-labelledby={`${tabId}-raw`}
        hidden={tab !== "raw"}
      >
        <LabRegistryRawPanel npiRawFields={npiRawFields} cliaRawRecord={cliaRawRecord} />
      </div>
    </div>
  );
}
