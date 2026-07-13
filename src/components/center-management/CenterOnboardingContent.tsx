import { useMemo, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useLabs } from "../../context/LabsContext";
import {
  VERIFICATION_ITEMS,
  type VerificationItemId,
} from "../../data/labOnboardingVerification";
import { GO_LIVE_TERMS_TEXT } from "../../data/goLiveTerms";
import { lifecycleDisplayLabel } from "../../data/labLifecycle";
import type { SectionPageId } from "../../data/accountOverview";
import { centerSectionHref } from "./LabSettingsHubCard";
import type { LabDetail } from "../../data/labDetails";

const REVIEW_LINKS: Partial<Record<VerificationItemId, SectionPageId>> = {
  "test-menu": "profile",
  "instrument-mappings": "profile",
  "report-format": "report-settings",
};

type GoLiveModalStep = "terms" | "otp";

interface Props {
  lab: LabDetail;
}

export function CenterOnboardingContent({ lab }: Props) {
  const labId = lab.id;
  const navigate = useNavigate();
  const {
    getLabLifecycleState,
    getVerificationState,
    setVerificationItem,
    initiateGoLive,
    confirmGoLive,
  } = useLabs();

  const lifecycleState = getLabLifecycleState(labId);
  const verificationState = getVerificationState(labId);
  const statusLabel = lifecycleDisplayLabel(lifecycleState);

  const [goLiveModalOpen, setGoLiveModalOpen] = useState(false);
  const [modalStep, setModalStep] = useState<GoLiveModalStep>("terms");
  const [termsAccepted, setTermsAccepted] = useState(false);
  const [otpValue, setOtpValue] = useState("");
  const [otpError, setOtpError] = useState("");

  const allVerified = useMemo(
    () => VERIFICATION_ITEMS.every((item) => verificationState[item.id]),
    [verificationState],
  );

  const unverifiedLabels = useMemo(
    () =>
      VERIFICATION_ITEMS.filter((item) => !verificationState[item.id]).map((item) => item.label),
    [verificationState],
  );

  const handleToggleVerification = (itemId: VerificationItemId) => {
    setVerificationItem(labId, itemId, !verificationState[itemId]);
  };

  const openGoLiveModal = () => {
    setModalStep("terms");
    setTermsAccepted(false);
    setOtpValue("");
    setOtpError("");
    setGoLiveModalOpen(true);
  };

  const closeGoLiveModal = () => {
    setGoLiveModalOpen(false);
    setModalStep("terms");
    setTermsAccepted(false);
    setOtpValue("");
    setOtpError("");
  };

  const handleAcceptTerms = () => {
    if (!termsAccepted) return;
    initiateGoLive(labId);
    setOtpValue("");
    setOtpError("");
    setModalStep("otp");
  };

  const handleConfirmOtp = () => {
    const result = confirmGoLive(labId, otpValue);
    if (result.success) {
      closeGoLiveModal();
      navigate(`/lab/${labId}/center`);
    } else {
      setOtpError(result.error ?? "An error occurred");
    }
  };

  return (
    <div className="cm-onboarding">
      <p className="cm-hub__lab-meta" aria-label="Centre information">
        <span className="cm-hub__lab-meta-label">Centre</span>
        <span className="cm-hub__lab-meta-sep" aria-hidden>
          ·
        </span>
        <span className="cm-hub__lab-meta-strong">#{lab.id}</span>
        <span className="cm-hub__lab-meta-sep" aria-hidden>
          ·
        </span>
        <span className="cm-hub__lab-meta-strong">{lab.name}</span>
        <span className="cm-hub__lab-meta-sep" aria-hidden>
          ·
        </span>
        <a href={`mailto:${lab.email}`} className="cm-hub__lab-meta-link">
          {lab.email}
        </a>
        <span className="cm-hub__lab-meta-sep" aria-hidden>
          ·
        </span>
        <span>{lab.address}</span>
      </p>

      <section className="cm-onboarding-banner" aria-labelledby="cm-onboarding-banner-title">
        <div className="cm-onboarding-banner__icon" aria-hidden>
          <svg viewBox="0 0 24 24" width="22" height="22" fill="none">
            <path
              d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 5v6m0 2v2"
              stroke="#3b71ca"
              strokeWidth="1.5"
              strokeLinecap="round"
            />
          </svg>
        </div>
        <div className="cm-onboarding-banner__text">
          <h2 id="cm-onboarding-banner-title" className="cm-onboarding-banner__title">
            Your centre is in {statusLabel}
          </h2>
          <p className="cm-onboarding-banner__sub">
            Complete the verification steps below, then go live when you are ready. An OTP will be
            sent to the authorised signatory&apos;s email and phone after you accept the terms.
          </p>
        </div>
        <button type="button" className="ao-feedback-card__cta" onClick={openGoLiveModal}>
          Go live
        </button>
      </section>

      <section className="cm-hub__group" aria-labelledby="cm-onboarding-verify-label">
        <h2 id="cm-onboarding-verify-label" className="cm-hub__group-label">
          Go-live verification
        </h2>
        <div className="cm-onboarding-cards-stack">
          {VERIFICATION_ITEMS.map((item) => {
            const isVerified = verificationState[item.id];
            const reviewSection = REVIEW_LINKS[item.id];
            return (
              <article
                key={item.id}
                className={`cm-onboarding-card cm-onboarding-card--wide${isVerified ? " cm-onboarding-card--verified" : ""}`}
              >
                <div className="cm-onboarding-card__main">
                  <span className="cm-hub__card-icon" aria-hidden>
                    <svg viewBox="0 0 24 24" fill="none" width="22" height="22">
                      <rect
                        x="4"
                        y="4"
                        width="16"
                        height="16"
                        rx="2"
                        stroke="currentColor"
                        strokeWidth="1.4"
                      />
                      <path
                        d="M8 9h8M8 13h5"
                        stroke="currentColor"
                        strokeWidth="1.3"
                        strokeLinecap="round"
                      />
                    </svg>
                  </span>
                  <div className="cm-onboarding-card__body">
                    <h3 className="cm-onboarding-card__title">{item.label}</h3>
                    <p className="cm-onboarding-card__desc">{item.description}</p>
                  </div>
                </div>
                <div className="cm-onboarding-card__aside">
                  <span
                    className={`cm-hub__card-badge${isVerified ? "" : " cm-hub__card-badge--pending"}`}
                  >
                    {isVerified ? "Verified" : "Pending"}
                  </span>
                  <div className="cm-onboarding-card__actions">
                    {reviewSection && (
                      <Link
                        to={centerSectionHref(labId, reviewSection)}
                        className="cm-onboarding-card__review"
                      >
                        Review settings
                      </Link>
                    )}
                    <button
                      type="button"
                      className={`cm-onboarding-card__verify${isVerified ? " cm-onboarding-card__verify--done" : ""}`}
                      onClick={() => handleToggleVerification(item.id)}
                    >
                      {isVerified ? "Unmark" : "Mark as verified"}
                    </button>
                  </div>
                </div>
              </article>
            );
          })}
        </div>
      </section>

      {goLiveModalOpen && (
        <div className="otp-modal-overlay" onClick={closeGoLiveModal}>
          <div
            className="otp-modal otp-modal--golive"
            onClick={(e) => e.stopPropagation()}
            role="dialog"
            aria-modal
            aria-labelledby="golive-modal-title"
          >
            <div className="otp-modal__header">
              <h3 id="golive-modal-title" className="otp-modal__title">
                {modalStep === "terms" ? "Go live — terms and conditions" : "Confirm go live"}
              </h3>
              <button type="button" className="otp-modal__close" onClick={closeGoLiveModal}>
                ×
              </button>
            </div>

            {modalStep === "terms" ? (
              <>
                <div className="otp-modal__body otp-modal__body--terms">
                  {!allVerified && (
                    <div className="cm-golive-warning" role="alert">
                      <strong>Review recommended before go-live</strong>
                      <p>
                        You have not marked the following as verified:{" "}
                        <span className="cm-golive-warning__items">{unverifiedLabels.join(", ")}</span>
                        . Test menu (masters), instrument mappings, and report format PDF should be
                        reviewed before production use. You may still proceed if you accept the
                        terms below.
                      </p>
                    </div>
                  )}
                  <div className="cm-golive-terms" tabIndex={0}>
                    <pre className="cm-golive-terms__text">{GO_LIVE_TERMS_TEXT}</pre>
                  </div>
                  <label className="cm-golive-terms__accept">
                    <input
                      type="checkbox"
                      checked={termsAccepted}
                      onChange={(e) => setTermsAccepted(e.target.checked)}
                    />
                    <span>
                      I have read and accept the go-live terms and conditions on behalf of this
                      centre
                    </span>
                  </label>
                </div>
                <div className="otp-modal__footer">
                  <button
                    type="button"
                    className="otp-modal__button otp-modal__button--cancel"
                    onClick={closeGoLiveModal}
                  >
                    Cancel
                  </button>
                  <button
                    type="button"
                    className="otp-modal__button otp-modal__button--confirm"
                    onClick={handleAcceptTerms}
                    disabled={!termsAccepted}
                  >
                    Accept and continue
                  </button>
                </div>
              </>
            ) : (
              <>
                <div className="otp-modal__body">
                  <p className="otp-modal__message">
                    An OTP has been sent to the authorised signatory&apos;s email and phone number.
                    Enter the 6-digit code to complete go-live.
                  </p>
                  <div className="otp-modal__input-group">
                    <label htmlFor="cm-otp-input" className="otp-modal__label">
                      Enter OTP
                    </label>
                    <input
                      id="cm-otp-input"
                      type="text"
                      className="otp-modal__input"
                      maxLength={6}
                      value={otpValue}
                      onChange={(e) => {
                        setOtpValue(e.target.value);
                        setOtpError("");
                      }}
                      placeholder="123456"
                      autoComplete="one-time-code"
                    />
                  </div>
                  {otpError && <p className="otp-modal__error">{otpError}</p>}
                  <div className="otp-modal__hint">
                    <small>
                      For this prototype, use OTP: <strong>123456</strong>
                    </small>
                  </div>
                </div>
                <div className="otp-modal__footer">
                  <button
                    type="button"
                    className="otp-modal__button otp-modal__button--cancel"
                    onClick={() => {
                      setModalStep("terms");
                      setOtpError("");
                    }}
                  >
                    Back
                  </button>
                  <button
                    type="button"
                    className="otp-modal__button otp-modal__button--confirm"
                    onClick={handleConfirmOtp}
                    disabled={otpValue.length !== 6}
                  >
                    Confirm go live
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
