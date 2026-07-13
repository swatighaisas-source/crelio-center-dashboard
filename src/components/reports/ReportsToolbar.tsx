import { ChevronDownIcon } from "../Icons";
import {
  REPORT_TYPES,
  type ReportTypeId,
} from "../../data/reports";

interface Props {
  reportTypeId: ReportTypeId;
  reportVariantId: string;
  rowCount: number;
  onReportTypeChange: (id: ReportTypeId) => void;
  onReportVariantChange: (id: string) => void;
  onRefresh: () => void;
  onExport: () => void;
}

export function ReportsToolbar({
  reportTypeId,
  reportVariantId,
  rowCount,
  onReportTypeChange,
  onReportVariantChange,
  onRefresh,
  onExport,
}: Props) {
  const reportType = REPORT_TYPES.find((t) => t.id === reportTypeId) ?? REPORT_TYPES[0];
  const variants = reportType.variants;

  return (
    <section className="reports-toolbar">
      <div className="reports-toolbar__filters">
        <label className="reports-select-wrap">
          <span className="visually-hidden">Reports type</span>
          <select
            className="reports-select"
            value={reportTypeId}
            onChange={(e) => onReportTypeChange(e.target.value as ReportTypeId)}
            aria-label="Reports type"
          >
            {REPORT_TYPES.map((t) => (
              <option key={t.id} value={t.id}>
                {t.label}
              </option>
            ))}
          </select>
          <ChevronDownIcon className="reports-select__chevron" />
        </label>

        <label className="reports-select-wrap">
          <span className="visually-hidden">Report variant</span>
          <select
            className="reports-select"
            value={reportVariantId}
            onChange={(e) => onReportVariantChange(e.target.value)}
            aria-label="Report variant"
          >
            {variants.map((v) => (
              <option key={v.id} value={v.id}>
                {v.label}
              </option>
            ))}
          </select>
          <ChevronDownIcon className="reports-select__chevron" />
        </label>

        <span className="reports-toolbar__rows">Rows: {rowCount}</span>
      </div>

      <div className="reports-toolbar__actions">
        <label className="reports-select-wrap reports-select-wrap--sm">
          <select className="reports-select reports-select--sm" defaultValue="monthly" aria-label="Period">
            <option value="monthly">Monthly</option>
            <option value="quarterly">Quarterly</option>
            <option value="yearly">Yearly</option>
          </select>
          <ChevronDownIcon className="reports-select__chevron" />
        </label>
        <label className="reports-select-wrap reports-select-wrap--sm">
          <select className="reports-select reports-select--sm" defaultValue="2026" aria-label="Year">
            <option value="2026">2026</option>
            <option value="2025">2025</option>
          </select>
          <ChevronDownIcon className="reports-select__chevron" />
        </label>
        <button type="button" className="btn-primary-dropdown" onClick={onRefresh}>
          Refresh Report
        </button>
        <button type="button" className="btn-secondary" onClick={onExport}>
          Export
        </button>
      </div>
    </section>
  );
}
