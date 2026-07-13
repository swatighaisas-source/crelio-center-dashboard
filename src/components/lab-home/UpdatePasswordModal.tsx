import { useState } from "react";

interface Props {
  open: boolean;
  onClose: () => void;
  onSave: (currentPassword: string, newPassword: string) => void;
}

export function UpdatePasswordModal({ open, onClose, onSave }: Props) {
  const [current, setCurrent] = useState("");
  const [next, setNext] = useState("");
  const [confirm, setConfirm] = useState("");
  const [error, setError] = useState<string | null>(null);

  if (!open) return null;

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!current.trim()) {
      setError("Enter your current password.");
      return;
    }
    if (next.length < 8) {
      setError("New password must be at least 8 characters.");
      return;
    }
    if (next !== confirm) {
      setError("New passwords do not match.");
      return;
    }
    setError(null);
    onSave(current, next);
    setCurrent("");
    setNext("");
    setConfirm("");
    onClose();
  }

  function handleClose() {
    setError(null);
    onClose();
  }

  return (
    <div className="profile-modal-overlay" role="presentation" onClick={handleClose}>
      <div
        className="profile-modal"
        role="dialog"
        aria-modal="true"
        aria-labelledby="profile-password-title"
        onClick={(e) => e.stopPropagation()}
      >
        <h2 id="profile-password-title" className="profile-modal__title">
          Update password
        </h2>
        <form className="profile-modal__form" onSubmit={handleSubmit}>
          <label className="profile-field">
            <span className="profile-field__label">Current password *</span>
            <input
              type="password"
              className="profile-field__input"
              value={current}
              onChange={(e) => setCurrent(e.target.value)}
              autoComplete="current-password"
            />
          </label>
          <label className="profile-field">
            <span className="profile-field__label">New password *</span>
            <input
              type="password"
              className="profile-field__input"
              value={next}
              onChange={(e) => setNext(e.target.value)}
              autoComplete="new-password"
            />
          </label>
          <label className="profile-field">
            <span className="profile-field__label">Confirm new password *</span>
            <input
              type="password"
              className="profile-field__input"
              value={confirm}
              onChange={(e) => setConfirm(e.target.value)}
              autoComplete="new-password"
            />
          </label>
          {error && (
            <p className="profile-modal__error" role="alert">
              {error}
            </p>
          )}
          <div className="profile-modal__actions">
            <button type="button" className="profile-btn profile-btn--ghost" onClick={handleClose}>
              Cancel
            </button>
            <button type="submit" className="profile-btn profile-btn--primary">
              Update password
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
