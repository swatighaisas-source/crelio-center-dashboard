import type { AoeCaptureFrequency, BillLineItem } from "../../../data/aoeTypes";
import {
  formatSectionTitle,
  formatTestHeader,
} from "../../../lib/aoe/aoeInstanceQueue";
import { AoeSectionForm } from "./AoeSectionForm";
import { useAoeNavigation } from "./useAoeNavigation";

interface PatientContext {
  name: string;
  id: string;
  ref: string;
  contact: string;
  referral: string;
  organisation: string;
  previousReportOn: string;
}

interface Props {
  labId: number;
  billId: string;
  open: boolean;
  lineItems: BillLineItem[];
  frequency: AoeCaptureFrequency | ((testId: string) => AoeCaptureFrequency);
  patient: PatientContext;
  onClose: () => void;
  onComplete?: () => void;
}

export function AoeForBillModal({
  labId,
  billId,
  open,
  lineItems,
  frequency,
  patient,
  onClose,
  onComplete,
}: Props) {
  const {
    navState,
    currentStep,
    currentForm,
    currentSection,
    instanceLabel,
    validationError,
    getFieldValue,
    saveField,
    handlePrevious,
    handleNext,
    handleSaveClose,
  } = useAoeNavigation({
    labId,
    billId,
    lineItems,
    frequency,
    onClose,
    onComplete,
  });

  if (!open) return null;

  const headerTitle = currentStep
    ? formatTestHeader(currentStep.testName, instanceLabel)
    : "AOE For Bill";

  const sectionTitle =
    currentStep && currentSection
      ? formatSectionTitle(
          currentStep.testName,
          instanceLabel,
          currentStep.sectionIndex + 1,
        )
      : "";

  return (
    <div className="aoe-overlay" role="presentation" onClick={onClose}>
      <div
        className="aoe-modal"
        role="dialog"
        aria-labelledby="aoe-modal-title"
        aria-modal="true"
        onClick={(e) => e.stopPropagation()}
      >
        <header className="aoe-modal__header">
          <button type="button" className="aoe-modal__back" onClick={onClose}>
            <span aria-hidden>‹</span> Back
          </button>
          <h2 id="aoe-modal-title" className="aoe-modal__title">
            AOE For Bill
          </h2>
          <button
            type="button"
            className="aoe-modal__close"
            onClick={onClose}
            aria-label="Close"
          >
            ×
          </button>
        </header>

        <div className="aoe-modal__body">
          <aside className="aoe-sidebar">
            <p className="aoe-sidebar__patient">{patient.name}</p>
            <dl className="aoe-sidebar__details">
              <div>
                <dt>ID</dt>
                <dd>
                  {patient.id} (Ref: {patient.ref})
                </dd>
              </div>
              <div>
                <dt>Contact No</dt>
                <dd>{patient.contact}</dd>
              </div>
              <div>
                <dt>Referral</dt>
                <dd>{patient.referral}</dd>
              </div>
              <div>
                <dt>Organisation</dt>
                <dd>{patient.organisation}</dd>
              </div>
              <div>
                <dt>Previous Report On</dt>
                <dd>{patient.previousReportOn}</dd>
              </div>
            </dl>
          </aside>

          <main className="aoe-main">
            {currentStep && currentForm && currentSection ? (
              <>
                <div className="aoe-test-header">
                  <span className="aoe-test-header__icon" aria-hidden>
                    🧪
                  </span>
                  <span>{headerTitle}</span>
                </div>
                <p className="aoe-test-description">{currentForm.description}</p>
                <AoeSectionForm
                  section={currentSection}
                  sectionTitle={sectionTitle}
                  getFieldValue={getFieldValue}
                  onFieldChange={saveField}
                />
              </>
            ) : (
              <p className="aoe-empty">No AOE-configured tests on this bill.</p>
            )}

            {validationError ? (
              <p className="aoe-validation-error" role="alert">
                {validationError}
              </p>
            ) : null}
          </main>
        </div>

        <footer className="aoe-modal__footer">
          <div className="aoe-modal__footer-actions">
            <button
              type="button"
              className="aoe-btn aoe-btn--outline"
              onClick={handlePrevious}
              disabled={!navState.canGoPrevious}
            >
              Previous
            </button>
            {navState.primaryAction === "next" ? (
              <button type="button" className="aoe-btn aoe-btn--primary" onClick={handleNext}>
                Next
              </button>
            ) : (
              <button
                type="button"
                className="aoe-btn aoe-btn--primary"
                onClick={handleSaveClose}
              >
                Save &amp; Close
              </button>
            )}
          </div>
        </footer>
      </div>
    </div>
  );
}
