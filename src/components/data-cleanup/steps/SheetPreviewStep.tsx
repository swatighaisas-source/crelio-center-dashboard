import { useState } from "react";
import type { SheetTab } from "../../../data/dataCleanupDemo";
import { CLEANUP_WORKBOOK_CHIP } from "../../../data/dataCleanupDemo";
import { DataViewToggle } from "../shared/DataViewToggle";
import { ExcelTabBar } from "../shared/ExcelTabBar";
import { ExcelWorkbook } from "../shared/ExcelWorkbook";
import { StepFooter } from "../shared/StepFooter";

interface Props {
  onBack: () => void;
}

export function SheetPreviewStep({ onBack }: Props) {
  const [activeTab, setActiveTab] = useState<SheetTab>("test");
  const [showRevised, setShowRevised] = useState(true);
  const [activeFixId, setActiveFixId] = useState<string | null>(null);
  const [downloaded, setDownloaded] = useState(false);

  function handleTabChange(tab: SheetTab) {
    setActiveTab(tab);
    setActiveFixId(null);
  }

  function handleViewChange(view: "original" | "revised") {
    setShowRevised(view === "revised");
  }

  function handleDownload() {
    setDownloaded(true);
  }

  return (
    <div className="dc-step dc-step--preview">
      <div className="dc-workbook">
        <header className="dc-workbook__toolbar">
          <div className="dc-workbook__toolbar-left">
            <span className="dc-workbook__file">{CLEANUP_WORKBOOK_CHIP}</span>
            <DataViewToggle
              value={showRevised ? "revised" : "original"}
              onChange={handleViewChange}
            />
          </div>
        </header>

        <ExcelWorkbook
          activeTab={activeTab}
          showRevised={showRevised}
          activeFixId={activeFixId}
          onSelectFix={setActiveFixId}
        />

        <ExcelTabBar activeTab={activeTab} onTabChange={handleTabChange} />
      </div>

      {downloaded && (
        <p className="dc-export-toast" role="status">
          Download started
        </p>
      )}

      <StepFooter
        step={2}
        totalSteps={2}
        onBack={onBack}
        primaryLabel="Download"
        onPrimary={handleDownload}
      />
    </div>
  );
}
