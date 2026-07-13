import { useLabs } from "../context/LabsContext";

const SUB_TABS = ["On-going", "Partially Completed", "Recently LIVE"] as const;

interface SubTabsAndStatsProps {
  summary?: {
    totalCount: number;
    totalMrrInr: number;
    totalMrrUsd: number;
    rows: number;
  };
}

export function SubTabsAndStats({ summary: summaryOverride }: SubTabsAndStatsProps) {
  const { summary: globalSummary } = useLabs();
  const summary = summaryOverride ?? globalSummary;

  return (
    <section className="sub-section">
      <div className="secondary-tabs">
        {SUB_TABS.map((tab) => (
          <button
            key={tab}
            type="button"
            className={`secondary-tab${tab === "On-going" ? " secondary-tab--active" : ""}`}
          >
            {tab}
          </button>
        ))}
      </div>
      <div className="stats-bar">
        <span>
          Total Count: <strong>{summary.totalCount}</strong>
        </span>
        <span>
          Total MRR:{" "}
          <strong>
            INR {summary.totalMrrInr.toLocaleString("en-IN")} / USD{" "}
            {summary.totalMrrUsd.toLocaleString("en-US")}
          </strong>
        </span>
        <span>
          Rows: <strong>{summary.rows}</strong>
        </span>
      </div>
    </section>
  );
}
