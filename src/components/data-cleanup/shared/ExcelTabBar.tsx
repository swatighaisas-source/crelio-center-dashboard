import type { SheetTab } from "../../../data/dataCleanupDemo";
import { SHEET_TAB_LABELS, SHEET_TAB_ORDER, tabIssueCounts } from "../../../data/dataCleanupDemo";

interface Props {
  activeTab: SheetTab;
  onTabChange: (tab: SheetTab) => void;
}

export function ExcelTabBar({ activeTab, onTabChange }: Props) {
  const counts = tabIssueCounts();

  return (
    <div className="dc-excel-tabs" role="tablist" aria-label="Workbook sheets">
      {SHEET_TAB_ORDER.map((tab) => (
        <button
          key={tab}
          type="button"
          role="tab"
          aria-selected={activeTab === tab}
          className={`dc-excel-tabs__tab${activeTab === tab ? " dc-excel-tabs__tab--active" : ""}`}
          onClick={() => onTabChange(tab)}
        >
          {SHEET_TAB_LABELS[tab]}
          {counts[tab] > 0 && (
            <span className="dc-excel-tabs__dot" aria-label={`${counts[tab]} issues`} />
          )}
        </button>
      ))}
    </div>
  );
}
