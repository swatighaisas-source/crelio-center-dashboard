import { useEffect, useState } from "react";
import { useLabs } from "../../context/LabsContext";
import {
  generateSecurePassword,
  validatePassword,
  type PasswordDeliveryMethod,
} from "../../lib/userPassword";
import { sendGeneratedPasswordEmail } from "../../services/userPasswordEmail";
import { PasswordDeliveryChoice } from "./PasswordDeliveryChoice";
import {
  UserInviteEmailPreviewModal,
  type UserPasswordEmailPreviewData,
} from "./UserInviteEmailPreviewModal";

interface Props {
  open: boolean;
  labId: number;
  recipientName: string;
  username: string;
  email: string;
  onClose: () => void;
  onSuccess: (message: string) => void;
}

function RequiredLabel({ children }: { children: string }) {
  return (
    <span className="ue-pw-modal__label">
      {children}
      <span className="ue-pw-modal__req" aria-hidden>
        *
      </span>
    </span>
  );
}

export function SetNewPasswordModal({
  open,
  labId,
  recipientName,
  username,
  email,
  onClose,
  onSuccess,
}: Props) {
  const { getLabDetail } = useLabs();
  const lab = getLabDetail(labId);
  const [deliveryMethod, setDeliveryMethod] = useState<PasswordDeliveryMethod>("manual");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [formError, setFormError] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [emailPreview, setEmailPreview] = useState<UserPasswordEmailPreviewData | null>(null);

  const emailDelivery = deliveryMethod === "email";
  const hasEmail = Boolean(email.trim());

  useEffect(() => {
    if (!open) return;
    function onKeyDown(e: KeyboardEvent) {
      if (e.key === "Escape") onClose();
    }
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [open, onClose]);

  useEffect(() => {
    if (!open) {
      setDeliveryMethod("manual");
      setNewPassword("");
      setConfirmPassword("");
      setFormError("");
      setSubmitting(false);
    }
  }, [open]);

  async function handleSubmit() {
    setFormError("");

    if (emailDelivery) {
      if (!hasEmail) {
        setFormError("Add an email in User Details to use this option.");
        return;
      }

      setSubmitting(true);
      try {
        const generatedPassword = generateSecurePassword();
        const result = await sendGeneratedPasswordEmail({
          labId,
          username,
          email: email.trim(),
          password: generatedPassword,
        });
        if (!result.success) {
          setFormError("Could not send password email. Please try again.");
          return;
        }
        setEmailPreview({
          variant: "password-update",
          recipientName,
          username,
          password: generatedPassword,
          email: email.trim(),
          labName: lab?.name ?? "Your centre",
          labId,
        });
        onClose();
      } finally {
        setSubmitting(false);
      }
      return;
    }

    const passwordCheck = validatePassword(newPassword);
    if (!passwordCheck.valid) {
      setFormError(passwordCheck.error ?? "Enter a valid password.");
      return;
    }
    if (newPassword !== confirmPassword) {
      setFormError("Passwords do not match.");
      return;
    }

    setSubmitting(true);
    try {
      onSuccess("Password updated successfully.");
      onClose();
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <>
    {open && (
    <div className="lab-modal-overlay" onClick={onClose}>
      <div
        className="lab-modal ue-pw-modal"
        role="dialog"
        aria-modal="true"
        aria-labelledby="set-password-modal-title"
        onClick={(e) => e.stopPropagation()}
      >
        <header className="ue-pw-modal__header">
          <h2 id="set-password-modal-title" className="ue-pw-modal__title">
            Set New Password
          </h2>
          <button type="button" className="ue-pw-modal__close" onClick={onClose} aria-label="Close">
            ×
          </button>
        </header>

        <div className="ue-pw-modal__body">
          <p className="ue-pw-modal__intro">
            Setting new password for <strong className="ue-pw-modal__username">{username}</strong>
          </p>

          <PasswordDeliveryChoice
            name="edit-password-delivery"
            value={deliveryMethod}
            onChange={setDeliveryMethod}
            legend="How would you like to set the password?"
            manualLabel="Enter password manually"
            emailLabel="Send Auto Generated Password over email"
          />

          {formError && <p className="ue-pw-modal__error">{formError}</p>}

          {emailDelivery ? (
            <div className="ue-pw-modal__email-panel">
              {hasEmail ? (
                <>
                  <span className="ue-pw-modal__label">Email</span>
                  <div className="ue-pw-modal__email-readonly">{email}</div>
                  <p className="ue-pw-modal__hint">
                    A new password will be generated and emailed to this address.
                  </p>
                </>
              ) : (
                <p className="ue-pw-modal__hint ue-pw-modal__hint--warn">
                  Add an email in User Details to use this option.
                </p>
              )}
            </div>
          ) : (
            <>
              <label className="ue-pw-modal__field">
                <RequiredLabel>New Password</RequiredLabel>
                <input
                  className="ue-pw-modal__input"
                  type="password"
                  placeholder="Enter New Password"
                  autoComplete="new-password"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                />
                <p className="ue-pw-modal__hint">
                  Password must be at least 8 character long and contain at least 1 lowercase latter, 1
                  uppercase letter, 1 digit and 1 special character
                </p>
              </label>

              <label className="ue-pw-modal__field">
                <RequiredLabel>Confirm Password</RequiredLabel>
                <input
                  className="ue-pw-modal__input"
                  type="password"
                  placeholder="Confirm Password"
                  autoComplete="new-password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                />
              </label>
            </>
          )}
        </div>

        <footer className="ue-pw-modal__footer">
          <button
            type="button"
            className="ue-pw-modal__submit"
            onClick={handleSubmit}
            disabled={submitting || (emailDelivery && !hasEmail)}
          >
            {submitting
              ? "Please wait…"
              : emailDelivery
                ? "Send Password Email"
                : "Set New Password"}
          </button>
        </footer>
      </div>
    </div>
    )}

    <UserInviteEmailPreviewModal
      open={emailPreview !== null}
      data={emailPreview}
      onClose={() => setEmailPreview(null)}
    />
    </>
  );
}
