import { useEffect } from "react";
import { CheckLogoIcon } from "../Icons";

export type UserPasswordEmailPreviewVariant = "invite" | "password-update";

export interface UserPasswordEmailPreviewData {
  variant?: UserPasswordEmailPreviewVariant;
  recipientName: string;
  username: string;
  password: string;
  email: string;
  labName: string;
  labId: number;
}

/** @deprecated Use UserPasswordEmailPreviewData */
export type UserInviteEmailPreviewData = UserPasswordEmailPreviewData;

const VARIANT_COPY = {
  invite: {
    modalTitle: "User created successfully",
    prototypeNote: "Prototype only — preview of the invitation email sent to the user.",
    detailsLabel: "Please find your login details :",
  },
  "password-update": {
    modalTitle: "Password email sent",
    prototypeNote: "Prototype only — preview of the password update email sent to the user.",
    detailsLabel: "Please find your updated login details :",
  },
} as const;

interface Props {
  open: boolean;
  data: UserPasswordEmailPreviewData | null;
  onClose: () => void;
}

export function UserInviteEmailPreviewModal({ open, data, onClose }: Props) {
  useEffect(() => {
    if (!open) return;
    function onKeyDown(e: KeyboardEvent) {
      if (e.key === "Escape") onClose();
    }
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [open, onClose]);

  if (!open || !data) return null;

  const variant = data.variant ?? "invite";
  const copy = VARIANT_COPY[variant];
  const contactParts = [data.email].filter(Boolean);

  return (
    <div className="lab-modal-overlay" onClick={onClose}>
      <div
        className="lab-modal ue-invite-modal"
        role="dialog"
        aria-modal="true"
        aria-labelledby="user-invite-modal-title"
        onClick={(e) => e.stopPropagation()}
      >
        <header className="ue-invite-modal__header">
          <h2 id="user-invite-modal-title" className="ue-invite-modal__title">
            {copy.modalTitle}
          </h2>
          <button type="button" className="ue-invite-modal__close" onClick={onClose} aria-label="Close">
            ×
          </button>
        </header>

        <p className="ue-invite-modal__prototype" role="note">
          {copy.prototypeNote}
        </p>

        <div className="ue-invite-modal__preview-wrap">
          <div className="ue-invite-email">
            <div className="ue-invite-email__card">
              <div className="ue-invite-email__brand">
                <CheckLogoIcon />
                <span className="ue-invite-email__brand-text">CrelioHealth</span>
              </div>

              <p className="ue-invite-email__greeting">Hi {data.recipientName},</p>

              <p className="ue-invite-email__intro">
                {variant === "invite" ? (
                  <>
                    You have been invited to use CrelioHealth For Diagnostics. Your user account for{" "}
                    <strong>{data.labName}</strong> (center id: #{data.labId}) has been created
                    successfully.
                  </>
                ) : (
                  <>
                    Your password has been updated by your center admin for CrelioHealth For
                    Diagnostics. Your account for <strong>{data.labName}</strong> (center id: #
                    {data.labId}) now has a new temporary password.
                  </>
                )}
              </p>

              <p className="ue-invite-email__details-label">{copy.detailsLabel}</p>

              <table className="ue-invite-email__table">
                <tbody>
                  <tr>
                    <th scope="row">User Name:</th>
                    <td>{data.recipientName}</td>
                  </tr>
                  <tr>
                    <th scope="row">Username:</th>
                    <td>{data.username}</td>
                  </tr>
                  <tr>
                    <th scope="row">Password:</th>
                    <td>
                      <code className="ue-invite-email__password">{data.password}</code>
                    </td>
                  </tr>
                  <tr>
                    <th scope="row">Contact:</th>
                    <td>
                      {contactParts.map((part, index) => (
                        <span key={part}>
                          {index > 0 && ", "}
                          <a href={`mailto:${part}`} className="ue-invite-email__link">
                            {part}
                          </a>
                        </span>
                      ))}
                    </td>
                  </tr>
                </tbody>
              </table>

              <p className="ue-invite-email__support">
                Get in touch with us on{" "}
                <a href="mailto:support@livehealth.in" className="ue-invite-email__link">
                  support@livehealth.in
                </a>{" "}
                in case of any queries.
              </p>
            </div>

            <p className="ue-invite-email__copyright">
              Copyright © 2018 Creliant Software Pvt. Ltd. All Rights Reserved.
            </p>
          </div>
        </div>

        <footer className="ue-invite-modal__footer">
          <button type="button" className="ue-invite-modal__done" onClick={onClose}>
            Done
          </button>
        </footer>
      </div>
    </div>
  );
}
