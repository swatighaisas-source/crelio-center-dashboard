import { useNavigate } from "react-router-dom";
import { USPrefillTag } from "../../components/create-centre/USPrefillTag";
import { useCreateCentre, REPORT_TEMPLATE_OPTIONS } from "../../context/CreateCentreContext";
import { ReportTemplatePreview } from "../../components/create-centre/ReportTemplatePreview";

export function ReportTemplatePage() {
  const navigate = useNavigate();
  const {
    reportTemplate,
    setReportTemplate,
    recommendedFontDefaults,
    setRecommendedFontDefaults,
    uploadLetterhead,
    setUploadLetterhead,
  } = useCreateCentre();

  const handleContinue = () => {
    if (uploadLetterhead === "yes") {
      navigate("/create-centre/setup/letterhead");
    } else {
      navigate("/create-centre/setup/signing-doctor");
    }
  };

  return (
    <div className="setup-diagnostic-page setup-diagnostic-page--report">
      <header className="setup-diagnostic-page__header">
        <h1 className="setup-diagnostic-page__title">Setup Your Diagnostic Center</h1>
        <p className="setup-diagnostic-page__step">2/5 Steps</p>
      </header>

      <div className="setup-diagnostic-card setup-diagnostic-card--report">
        <h2 className="setup-diagnostic-card__heading">
          Select Report Template
          <USPrefillTag field="reportTemplate" />
        </h2>

        <div className="report-template-carousel">
          <div
            className="report-template-grid"
            role="radiogroup"
            aria-label="Report template"
          >
            {REPORT_TEMPLATE_OPTIONS.map((option) => {
              const selected = reportTemplate === option.id;
              return (
                <label
                  key={option.id}
                  className={`report-template-card${selected ? " report-template-card--selected" : ""}`}
                >
                  <input
                    type="radio"
                    name="reportTemplate"
                    value={option.id}
                    checked={selected}
                    onChange={() => setReportTemplate(option.id)}
                    className="report-template-card__input"
                  />
                  <span className="report-template-card__radio" aria-hidden />
                  <ReportTemplatePreview type={option.id} />
                  <span className="report-template-card__label">{option.label}</span>
                  <button
                    type="button"
                    className={`report-template-card__preview${selected ? " report-template-card__preview--active" : ""}`}
                    onClick={(e) => e.preventDefault()}
                  >
                    Preview
                  </button>
                </label>
              );
            })}
          </div>
          <button
            type="button"
            className="report-template-carousel__next"
            aria-label="More templates"
          >
            ›
          </button>
        </div>

        <div className="report-template-options">
          <label className="report-template-checkbox">
            <input
              type="checkbox"
              checked={recommendedFontDefaults}
              onChange={(e) => setRecommendedFontDefaults(e.target.checked)}
            />
            <span className="report-template-checkbox__box" aria-hidden />
            <span>
              Set font-size, date-formats to recommended defaults for Medical Laboratories
            </span>
          </label>

          <div className="report-template-letterhead">
            <span className="report-template-letterhead__label">Upload company letterhead</span>
            <div className="report-template-letterhead__choices" role="radiogroup">
              {(["yes", "no"] as const).map((value) => (
                <label key={value} className="report-template-inline-radio">
                  <input
                    type="radio"
                    name="uploadLetterhead"
                    value={value}
                    checked={uploadLetterhead === value}
                    onChange={() => setUploadLetterhead(value)}
                  />
                  <span className="report-template-inline-radio__dot" aria-hidden />
                  <span>{value === "yes" ? "Yes" : "No"}</span>
                </label>
              ))}
            </div>
          </div>
        </div>

        <button type="button" className="setup-diagnostic-continue" onClick={handleContinue}>
          Confirm &amp; Continue
        </button>
      </div>
    </div>
  );
}
