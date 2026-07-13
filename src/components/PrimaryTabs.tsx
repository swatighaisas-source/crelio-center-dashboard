import { ChevronDownIcon } from "./Icons";
import { isLifecyclePrimaryTab } from "../data/labLifecycle";

export const PRIMARY_TABS = [
  "Onboarding",
  "Live",
  "Trial",
  "Shutdown",
  "Reports",
  "Integrations",
] as const;

export type PrimaryTabId = (typeof PRIMARY_TABS)[number];

interface Props {
  activeTab: PrimaryTabId;
  onTabChange: (tab: PrimaryTabId) => void;
  /** Counts for lifecycle tabs (Onboarding, Live, Trial, Shutdown) */
  lifecycleTabCounts?: Partial<Record<PrimaryTabId, number>>;
  /** When set, top-bar Export triggers this (e.g. product feedback CSV) */
  onExport?: () => void;
}

export function PrimaryTabs({ activeTab, onTabChange, lifecycleTabCounts, onExport }: Props) {
  return (
    <div className="primary-tabs">
      <div className="primary-tabs__list">
        {PRIMARY_TABS.map((tab) => {
          const count = isLifecyclePrimaryTab(tab) ? lifecycleTabCounts?.[tab] : undefined;
          const label = count !== undefined ? `${tab} (${count})` : tab;
          return (
          <button
            key={tab}
            type="button"
            className={`primary-tab${tab === activeTab ? " primary-tab--active" : ""}`}
            onClick={() => onTabChange(tab)}
          >
            {label}
          </button>
          );
        })}
      </div>
      <div className="primary-tabs__actions">
        <button type="button" className="btn-primary-dropdown">
          All
          <ChevronDownIcon />
        </button>
        <button
          type="button"
          className="btn-secondary"
          onClick={onExport}
          disabled={!onExport}
        >
          Export
        </button>
        <button type="button" className="btn-secondary">
          Refresh
        </button>
      </div>
    </div>
  );
}
