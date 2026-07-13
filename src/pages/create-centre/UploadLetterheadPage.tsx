import { useRef } from "react";
import { useNavigate } from "react-router-dom";
import { useCreateCentre } from "../../context/CreateCentreContext";
import { LetterheadHeaderMock } from "../../components/create-centre/LetterheadHeaderMock";
import { LetterheadFooterPlaceholder } from "../../components/create-centre/LetterheadFooterPlaceholder";

export function UploadLetterheadPage() {
  const navigate = useNavigate();
  const {
    letterheadHeaderPreview,
    letterheadFooterPreview,
    setLetterheadHeaderPreview,
    setLetterheadFooterPreview,
  } = useCreateCentre();

  const headerInputRef = useRef<HTMLInputElement>(null);
  const footerInputRef = useRef<HTMLInputElement>(null);

  const handleHeaderFile = (file: File | undefined) => {
    if (!file) return;
    if (letterheadHeaderPreview) URL.revokeObjectURL(letterheadHeaderPreview);
    setLetterheadHeaderPreview(URL.createObjectURL(file));
  };

  const handleFooterFile = (file: File | undefined) => {
    if (!file) return;
    if (letterheadFooterPreview) URL.revokeObjectURL(letterheadFooterPreview);
    setLetterheadFooterPreview(URL.createObjectURL(file));
  };

  return (
    <div className="setup-diagnostic-page setup-diagnostic-page--letterhead">
      <header className="setup-diagnostic-page__header setup-diagnostic-page__header--with-back">
        <button
          type="button"
          className="setup-diagnostic-page__back"
          onClick={() => navigate("/create-centre/setup/report-template")}
          aria-label="Go back"
        >
          ‹
        </button>
        <div className="setup-diagnostic-page__header-text">
          <h1 className="setup-diagnostic-page__title">Setup Your Diagnostic Center</h1>
          <p className="setup-diagnostic-page__step">3/5 Steps</p>
        </div>
      </header>

      <div className="setup-diagnostic-card setup-diagnostic-card--letterhead">
        <h2 className="setup-diagnostic-card__heading">Upload Letterheads</h2>

        <section className="letterhead-section">
          <h3 className="letterhead-section__label">Report Header</h3>
          <div className="letterhead-section__preview">
            {letterheadHeaderPreview ? (
              <img
                src={letterheadHeaderPreview}
                alt="Report header preview"
                className="letterhead-section__uploaded-img"
              />
            ) : (
              <LetterheadHeaderMock />
            )}
          </div>
          <div className="letterhead-section__actions">
            <input
              ref={headerInputRef}
              type="file"
              accept=".png,.jpeg,.jpg,.PNG,.JPEG,.JPG"
              className="letterhead-section__file"
              onChange={(e) => handleHeaderFile(e.target.files?.[0])}
            />
            <button
              type="button"
              className="letterhead-upload-btn"
              onClick={() => headerInputRef.current?.click()}
            >
              Upload Image
            </button>
            <span className="letterhead-section__hint">
              (Only .png, .jpeg and .jpg file are supported)
            </span>
          </div>
        </section>

        <section className="letterhead-section">
          <h3 className="letterhead-section__label">Report Footer</h3>
          <div className="letterhead-section__preview letterhead-section__preview--footer">
            {letterheadFooterPreview ? (
              <img
                src={letterheadFooterPreview}
                alt="Report footer preview"
                className="letterhead-section__uploaded-img"
              />
            ) : (
              <LetterheadFooterPlaceholder />
            )}
          </div>
          <div className="letterhead-section__actions">
            <input
              ref={footerInputRef}
              type="file"
              accept=".png,.jpeg,.jpg,.PNG,.JPEG,.JPG"
              className="letterhead-section__file"
              onChange={(e) => handleFooterFile(e.target.files?.[0])}
            />
            <button
              type="button"
              className="letterhead-upload-btn"
              onClick={() => footerInputRef.current?.click()}
            >
              Upload Image
            </button>
            <span className="letterhead-section__hint">
              (Only .png, .jpeg and .jpg file are supported)
            </span>
          </div>
        </section>

        <div className="letterhead-footer-actions">
          <button type="button" className="letterhead-preview-btn">
            Preview
          </button>
          <button
            type="button"
            className="setup-diagnostic-continue"
            onClick={() => navigate("/create-centre/setup/signing-doctor")}
          >
            Confirm &amp; Continue
          </button>
        </div>
      </div>
    </div>
  );
}
