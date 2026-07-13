import { useRef, useState, type ChangeEvent, type FormEvent, type ReactNode } from "react";
import { Navigate, useNavigate, useParams } from "react-router-dom";
import { AccountOverviewSidebar } from "../components/account-overview/AccountOverviewSidebar";
import { SubpageBreadcrumb } from "../components/lab-shell/SubpageBreadcrumb";
import { usePageBreadcrumb } from "../hooks/usePageBreadcrumb";
import { useSmartBack } from "../hooks/useSmartBack";
import { LabHomeIcon } from "../components/lab-home/LabHomeIcons";
import { UpdatePasswordModal } from "../components/lab-home/UpdatePasswordModal";
import {
  DEFAULT_LANGUAGES,
  DEFAULT_LOGIN_MODULES,
  DOB_DAY_OPTIONS,
  DOB_MONTH_OPTIONS,
  DOB_YEAR_OPTIONS,
  USER_ROLE_OPTIONS,
  profileInitials,
  type LabUserProfile,
} from "../data/labUserProfile";
import { useLabs } from "../context/LabsContext";
import "../styles/account-overview.css";
import "../styles/lab-home.css";
import "../styles/lab-profile.css";
import "../styles/subpage-breadcrumb.css";

function FieldLabel({
  children,
  required,
  hint,
}: {
  children: ReactNode;
  required?: boolean;
  hint?: string;
}) {
  return (
    <span className="profile-field__label">
      {children}
      {required && <span className="profile-field__required"> *</span>}
      {hint && (
        <span className="profile-field__hint-icon" title={hint} aria-label={hint}>
          ⓘ
        </span>
      )}
    </span>
  );
}

export function LabProfilePage() {
  const { id } = useParams<{ id: string }>();
  const labId = Number(id);
  const navigate = useNavigate();
  const { getLabDetail, getUserProfile, updateUserProfile } = useLabs();
  const lab = getLabDetail(labId);
  const savedProfile = getUserProfile(labId);
  const breadcrumb = usePageBreadcrumb();
  const smartBack = useSmartBack(`/lab/${labId}/center`);

  const [draft, setDraft] = useState<LabUserProfile>(savedProfile);
  const [passwordOpen, setPasswordOpen] = useState(false);
  const [saveMessage, setSaveMessage] = useState<string | null>(null);
  const fileRef = useRef<HTMLInputElement>(null);

  if (!lab || Number.isNaN(labId)) {
    return <Navigate to="/" replace />;
  }

  const initials = profileInitials(draft);

  function patch<K extends keyof LabUserProfile>(key: K, value: LabUserProfile[K]) {
    setDraft((prev) => ({ ...prev, [key]: value }));
  }

  function handlePhotoChange(e: ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    if (!file.type.startsWith("image/")) return;
    const reader = new FileReader();
    reader.onload = () => {
      if (typeof reader.result === "string") {
        patch("profilePhotoUrl", reader.result);
      }
    };
    reader.readAsDataURL(file);
    e.target.value = "";
  }

  function handleRemovePhoto() {
    patch("profilePhotoUrl", null);
  }

  function handleSave(e: FormEvent) {
    e.preventDefault();
    if (!draft.name.trim() || !draft.username.trim()) return;
    updateUserProfile(labId, draft);
    setSaveMessage("Profile saved.");
    setTimeout(() => setSaveMessage(null), 3000);
  }

  function handlePasswordSave(_current: string, _newPassword: string) {
    setSaveMessage("Password updated.");
    setTimeout(() => setSaveMessage(null), 3000);
  }

  return (
    <div className="ao-layout">
      <AccountOverviewSidebar lab={lab} />

      <main className="lab-home">
        {breadcrumb && (
          <SubpageBreadcrumb
            backHref={breadcrumb.backHref}
            backLabel={breadcrumb.backLabel}
            segments={breadcrumb.segments}
            onBack={smartBack}
            actions={
              <button type="button" className="lab-home__header-notify" aria-label="Notifications">
                <LabHomeIcon name="bell" />
              </button>
            }
          />
        )}

        <div className="lab-home__content lab-home__content--profile">
          <div className="profile-page__head">
            {saveMessage && <p className="profile-page__toast">{saveMessage}</p>}
          </div>

          <section className="profile-page__top">
            <div className="profile-photo-block">
              {draft.profilePhotoUrl ? (
                <img
                  src={draft.profilePhotoUrl}
                  alt=""
                  className="profile-photo-block__img"
                />
              ) : (
                <span className="profile-photo-block__initials" aria-hidden>
                  {initials}
                </span>
              )}
              <div className="profile-photo-block__actions">
                <input
                  ref={fileRef}
                  type="file"
                  accept="image/*"
                  className="profile-photo-block__file"
                  onChange={handlePhotoChange}
                  aria-label="Upload profile photo"
                />
                <button
                  type="button"
                  className="profile-btn profile-btn--outline"
                  onClick={() => fileRef.current?.click()}
                >
                  Upload profile photo
                </button>
                {draft.profilePhotoUrl && (
                  <button
                    type="button"
                    className="profile-btn profile-btn--ghost"
                    onClick={handleRemovePhoto}
                  >
                    Remove photo
                  </button>
                )}
                <p className="profile-photo-block__hint">
                  Shown in the top navigation bar across the application.
                </p>
              </div>
            </div>
            <button
              type="button"
              className="profile-btn profile-btn--outline profile-page__password-btn"
              onClick={() => setPasswordOpen(true)}
            >
              Update password
            </button>
          </section>

          <form className="profile-form" onSubmit={handleSave}>
            <div className="profile-form__grid">
              <label className="profile-field">
                <FieldLabel required>Name</FieldLabel>
                <input
                  className="profile-field__input"
                  value={draft.name}
                  onChange={(e) => patch("name", e.target.value)}
                  required
                />
              </label>

              <label className="profile-field">
                <FieldLabel required>User Role</FieldLabel>
                <select
                  className="profile-field__input"
                  value={draft.userRole}
                  onChange={(e) => patch("userRole", e.target.value as LabUserProfile["userRole"])}
                >
                  {USER_ROLE_OPTIONS.map((opt) => (
                    <option key={opt.value} value={opt.value}>
                      {opt.label}
                    </option>
                  ))}
                </select>
              </label>

              <label className="profile-field">
                <FieldLabel required>Default Login Module / URL</FieldLabel>
                <select
                  className="profile-field__input"
                  value={draft.defaultLoginModule}
                  onChange={(e) => patch("defaultLoginModule", e.target.value)}
                >
                  {DEFAULT_LOGIN_MODULES.map((m) => (
                    <option key={m} value={m}>
                      {m}
                    </option>
                  ))}
                </select>
              </label>

              <label className="profile-field">
                <FieldLabel required>Username</FieldLabel>
                <div className="profile-field__prefix-wrap">
                  <span className="profile-field__prefix">{draft.usernamePrefix}</span>
                  <input
                    className="profile-field__input profile-field__input--prefixed"
                    value={draft.username}
                    onChange={(e) => patch("username", e.target.value)}
                    required
                  />
                </div>
              </label>

              <label className="profile-field">
                <FieldLabel>Email</FieldLabel>
                <input
                  type="email"
                  className="profile-field__input"
                  value={draft.email}
                  onChange={(e) => patch("email", e.target.value)}
                  placeholder="Enter Email"
                />
              </label>

              <label className="profile-field">
                <FieldLabel>Contact No</FieldLabel>
                <div className="profile-field__prefix-wrap">
                  <span className="profile-field__prefix profile-field__prefix--flag" aria-hidden>
                    🇮🇳
                  </span>
                  <input
                    type="tel"
                    className="profile-field__input profile-field__input--prefixed"
                    value={draft.contactNo}
                    onChange={(e) => patch("contactNo", e.target.value)}
                    placeholder="Enter Contact Number"
                  />
                </div>
              </label>

              <div className="profile-field profile-field--dob">
                <FieldLabel>Date of Birth</FieldLabel>
                <div className="profile-field__dob-row">
                  <select
                    className="profile-field__input"
                    value={draft.dateOfBirthDay}
                    onChange={(e) => patch("dateOfBirthDay", e.target.value)}
                    aria-label="Day"
                  >
                    <option value="">Day</option>
                    {DOB_DAY_OPTIONS.map((d) => (
                      <option key={d} value={d}>
                        {d}
                      </option>
                    ))}
                  </select>
                  <select
                    className="profile-field__input"
                    value={draft.dateOfBirthMonth}
                    onChange={(e) => patch("dateOfBirthMonth", e.target.value)}
                    aria-label="Month"
                  >
                    <option value="">Month</option>
                    {DOB_MONTH_OPTIONS.map((m) => (
                      <option key={m} value={m}>
                        {m}
                      </option>
                    ))}
                  </select>
                  <select
                    className="profile-field__input"
                    value={draft.dateOfBirthYear}
                    onChange={(e) => patch("dateOfBirthYear", e.target.value)}
                    aria-label="Year"
                  >
                    <option value="">Year</option>
                    {DOB_YEAR_OPTIONS.map((y) => (
                      <option key={y} value={y}>
                        {y}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <label className="profile-field">
                <FieldLabel>Inactivity Logout Time (Minutes)</FieldLabel>
                <input
                  type="number"
                  min={0}
                  className="profile-field__input"
                  value={draft.inactivityLogoutMinutes}
                  onChange={(e) => patch("inactivityLogoutMinutes", e.target.value)}
                />
              </label>

              <label className="profile-field">
                <FieldLabel>Default Language</FieldLabel>
                <select
                  className="profile-field__input"
                  value={draft.defaultLanguage}
                  onChange={(e) => patch("defaultLanguage", e.target.value)}
                >
                  <option value="">Select Default Language</option>
                  {DEFAULT_LANGUAGES.map((lang) => (
                    <option key={lang} value={lang}>
                      {lang}
                    </option>
                  ))}
                </select>
              </label>

              <label className="profile-field">
                <FieldLabel>Employee No / Payroll No</FieldLabel>
                <input
                  className="profile-field__input"
                  value={draft.employeeNo}
                  onChange={(e) => patch("employeeNo", e.target.value)}
                  placeholder="Enter Employee No"
                />
              </label>
            </div>

            <div className="profile-form__footer">
              <button
                type="button"
                className="profile-btn profile-btn--ghost"
                onClick={() => navigate(`/lab/${labId}/center`)}
              >
                Cancel
              </button>
              <button type="submit" className="profile-btn profile-btn--primary">
                Save profile
              </button>
            </div>
          </form>
        </div>
      </main>

      <UpdatePasswordModal
        open={passwordOpen}
        onClose={() => setPasswordOpen(false)}
        onSave={handlePasswordSave}
      />
    </div>
  );
}
