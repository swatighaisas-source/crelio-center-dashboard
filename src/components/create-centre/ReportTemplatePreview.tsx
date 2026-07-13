import type { ReportTemplateType } from "../../context/CreateCentreContext";

export function ReportTemplatePreview({ type }: { type: ReportTemplateType }) {
  return (
    <div className="report-template-preview" aria-hidden>
      <svg viewBox="0 0 120 150" className="report-template-preview__svg" fill="none">
        <rect width="120" height="150" rx="2" fill="#ffffff" stroke="#4a90e2" strokeWidth="2" />
        <rect x="12" y="14" width="96" height="10" fill="#e8f0fa" stroke="#4a90e2" strokeWidth="1" />
        <rect x="12" y="32" width="40" height="8" fill="#f0f4f8" stroke="#c5d8eb" strokeWidth="1" />
        <rect x="56" y="32" width="52" height="8" fill="#f0f4f8" stroke="#c5d8eb" strokeWidth="1" />
        <rect x="12" y="46" width="96" height="56" fill="#fafcfe" stroke="#4a90e2" strokeWidth="1" />
        <line x1="12" y1="58" x2="108" y2="58" stroke="#dce8f5" strokeWidth="1" />
        <line x1="12" y1="70" x2="108" y2="70" stroke="#dce8f5" strokeWidth="1" />
        <line x1="12" y1="82" x2="108" y2="82" stroke="#dce8f5" strokeWidth="1" />
        <line x1="44" y1="46" x2="44" y2="102" stroke="#dce8f5" strokeWidth="1" />
        <line x1="76" y1="46" x2="76" y2="102" stroke="#dce8f5" strokeWidth="1" />

        {type === "nabl-cap" && (
          <>
            <circle cx="28" cy="28" r="14" fill="#4a90e2" opacity="0.15" />
            <circle cx="28" cy="28" r="10" stroke="#4a90e2" strokeWidth="1.5" fill="#ffffff" />
            <path
              d="M24 28l3 3 6-6"
              stroke="#4a90e2"
              strokeWidth="1.5"
              strokeLinecap="round"
            />
          </>
        )}

        {type === "barcode" && (
          <>
            <rect x="78" y="10" width="32" height="22" rx="1" fill="#ffffff" stroke="#4a90e2" strokeWidth="1" />
            <rect x="82" y="16" width="2" height="12" fill="#333" />
            <rect x="86" y="16" width="1" height="12" fill="#333" />
            <rect x="89" y="16" width="3" height="12" fill="#333" />
            <rect x="94" y="16" width="1" height="12" fill="#333" />
            <rect x="97" y="16" width="2" height="12" fill="#333" />
            <rect x="101" y="16" width="3" height="12" fill="#333" />
          </>
        )}

        <rect x="12" y="110" width="96" height="8" fill="#f0f4f8" stroke="#c5d8eb" strokeWidth="1" />
        <rect x="12" y="124" width="60" height="6" fill="#e8f0fa" />
      </svg>
    </div>
  );
}
