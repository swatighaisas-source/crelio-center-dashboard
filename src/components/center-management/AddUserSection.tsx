import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useLabs } from "../../context/LabsContext";
import {
  DEPARTMENT_OPTIONS,
  LANGUAGE_OPTIONS,
  LOGIN_MODULE_OPTIONS,
  type UserFeatureTab,
} from "../../data/centerUserEdit";
import type { AddUserFormDefaults } from "../../data/centerUserRoles";
import { USER_ROLE_CARDS } from "../../data/centerUserRoles";
import { formatUserLastActivity } from "../../data/centerUsers";
import { useLabUsers } from "../../hooks/useLabUsers";
import {
  generateSecurePassword,
  validateEmail,
  validatePassword,
  type PasswordDeliveryMethod,
} from "../../lib/userPassword";
import { sendGeneratedPasswordEmail } from "../../services/userPasswordEmail";
import { SubpageBreadcrumb } from "../lab-shell/SubpageBreadcrumb";
import { usePageBreadcrumb } from "../../hooks/usePageBreadcrumb";
import { PasswordDeliveryChoice } from "./PasswordDeliveryChoice";
import "../../styles/subpage-breadcrumb.css";
import {
  UserInviteEmailPreviewModal,
  type UserInviteEmailPreviewData,
} from "./UserInviteEmailPreviewModal";

interface Props {
  labId: number;
  defaults: AddUserFormDefaults;
}

function Toggle({
  checked,
  label,
}: {
  checked: boolean;
  label: string;
}) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={checked}
      aria-label={label}
      className={`ue-toggle${checked ? " ue-toggle--on" : ""}`}
    >
      <span className="ue-toggle__thumb" />
    </button>
  );
}

function RequiredLabel({ children }: { children: string }) {
  return (
    <span className="ue-label">
      {children}
      <span className="ue-label__req" aria-hidden>
        *
      </span>
    </span>
  );
}

function InfoIcon() {
  return (
    <svg className="ue-label__info" viewBox="0 0 14 14" width="14" height="14" aria-hidden>
      <circle cx="7" cy="7" r="6" fill="none" stroke="currentColor" strokeWidth="1.2" />
      <path d="M7 6.25V10" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" />
      <circle cx="7" cy="4.25" r="0.75" fill="currentColor" />
    </svg>
  );
}

function FeatureAccessPanel({ tab }: { tab: UserFeatureTab }) {
  if (tab.groups.length === 0) {
    return (
      <div className="ue-fa-empty">
        <p className="ue-fa-empty__text">No permissions configured for {tab.label}.</p>
      </div>
    );
  }

  return (
    <div className="ue-fa-groups">
      {tab.groups.map((group) => (
        <div key={group.id} className="ue-fa-group">
          <div className="ue-fa-group__head">{group.title}</div>
          <div className="ue-fa-group__grid">
            {group.permissions.map((perm) => (
              <div key={perm.id} className="ue-fa-item">
                <Toggle checked={perm.enabled} label={perm.title} />
                <div className="ue-fa-item__text">
                  <div className="ue-fa-item__title">{perm.title}</div>
                  <div className="ue-fa-item__desc">{perm.description}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}

export function AddUserSection({ labId, defaults }: Props) {
  const navigate = useNavigate();
  const { getLabDetail } = useLabs();
  const { createUser } = useLabUsers(labId);
  const lab = getLabDetail(labId);
  const breadcrumb = usePageBreadcrumb();
  const [activeTabId, setActiveTabId] = useState(defaults.activeTabId);
  const [passwordDelivery, setPasswordDelivery] = useState<PasswordDeliveryMethod>("manual");
  const [name, setName] = useState("");
  const [userRole, setUserRole] = useState(defaults.userRole);
  const [defaultLoginModule, setDefaultLoginModule] = useState(defaults.defaultLoginModule);
  const [usernameSuffix, setUsernameSuffix] = useState("");
  const [password, setPassword] = useState("");
  const [email, setEmail] = useState("");
  const [formError, setFormError] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [invitePreview, setInvitePreview] = useState<UserInviteEmailPreviewData | null>(null);

  const activeTab = defaults.featureTabs.find((t) => t.id === activeTabId) ?? defaults.featureTabs[0];
  const roleOptions = USER_ROLE_CARDS.map((r) => r.title);
  const emailDelivery = passwordDelivery === "email";

  async function handleCreateUser() {
    setFormError("");
    const trimmedName = name.trim();
    const trimmedSuffix = usernameSuffix.trim();
    const trimmedEmail = email.trim();

    if (!trimmedName) {
      setFormError("Name is required.");
      return;
    }
    if (!trimmedSuffix) {
      setFormError("Username is required.");
      return;
    }

    if (emailDelivery) {
      const emailCheck = validateEmail(trimmedEmail);
      if (!emailCheck.valid) {
        setFormError(emailCheck.error ?? "Email is required.");
        return;
      }
    } else {
      const passwordCheck = validatePassword(password);
      if (!passwordCheck.valid) {
        setFormError(passwordCheck.error ?? "Enter a valid password.");
        return;
      }
    }

    const username = `hudu-${trimmedSuffix}`;
    const userId = username;
    const generatedPassword = emailDelivery ? generateSecurePassword() : password;

    setSubmitting(true);
    try {
      createUser({
        id: userId,
        username,
        name: trimmedName,
        userRole,
        defaultLoginSection: defaultLoginModule,
        lastActivity: formatUserLastActivity(),
        email: trimmedEmail || undefined,
      });

      if (emailDelivery) {
        const result = await sendGeneratedPasswordEmail({
          labId,
          username,
          email: trimmedEmail,
          password: generatedPassword,
        });
        if (!result.success) {
          setFormError("Could not send password email. Please try again.");
          return;
        }
        setInvitePreview({
          variant: "invite",
          recipientName: trimmedName,
          username,
          password: generatedPassword,
          email: trimmedEmail,
          labName: lab?.name ?? "Your centre",
          labId,
        });
        return;
      }

      navigate(`/lab/${labId}/center/users?created=1`);
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="ue-page">
      {breadcrumb && (
        <SubpageBreadcrumb
          backHref={breadcrumb.backHref}
          backLabel={breadcrumb.backLabel}
          segments={breadcrumb.segments}
        />
      )}

      <div className="ue-body">
        {formError && <p className="ue-form-error">{formError}</p>}

        <section className="ue-section">
          <header className="ue-section__head">
            User Details - Provide details of the user you are adding
          </header>
          <div className="ue-section__body">
            <div className="ue-form-grid ue-form-grid--add">
              <label className="ue-field">
                <RequiredLabel>Name</RequiredLabel>
                <input
                  className="ue-input"
                  type="text"
                  placeholder="Enter Name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                />
              </label>
              <label className="ue-field">
                <RequiredLabel>User Role</RequiredLabel>
                <select
                  className="ue-select"
                  value={userRole}
                  onChange={(e) => setUserRole(e.target.value)}
                >
                  {roleOptions.map((opt) => (
                    <option key={opt} value={opt}>
                      {opt}
                    </option>
                  ))}
                </select>
              </label>
              <label className="ue-field">
                <RequiredLabel>Default Login Module / URL</RequiredLabel>
                <select
                  className="ue-select"
                  value={defaultLoginModule}
                  onChange={(e) => setDefaultLoginModule(e.target.value)}
                >
                  {LOGIN_MODULE_OPTIONS.map((opt) => (
                    <option key={opt} value={opt}>
                      {opt}
                    </option>
                  ))}
                </select>
              </label>

              <label className="ue-field">
                <RequiredLabel>Username</RequiredLabel>
                <div className="ue-username ue-username--add">
                  <span className="ue-username__fixed">hudu</span>
                  <input
                    className="ue-input"
                    type="text"
                    placeholder="Enter Username"
                    value={usernameSuffix}
                    onChange={(e) => setUsernameSuffix(e.target.value)}
                  />
                </div>
              </label>
              <label className="ue-field">
                {emailDelivery ? <RequiredLabel>Email</RequiredLabel> : <span className="ue-label">Email</span>}
                <input
                  className="ue-input"
                  type="email"
                  placeholder="Enter Email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
                {emailDelivery && (
                  <p className="ue-field__hint ue-field__hint--email">
                    A temporary password will be emailed after the user is created.
                  </p>
                )}
              </label>
              <label className="ue-field">
                <span className="ue-label">Contact No</span>
                <div className="ue-phone">
                  <span className="ue-phone__flag" aria-hidden>
                    🇮🇳
                  </span>
                  <input className="ue-phone__input" type="text" placeholder="Enter Contact Number" />
                </div>
              </label>

              <div className="ue-field">
                <span className="ue-label">Date of Birth</span>
                <div className="ue-dob">
                  <select className="ue-select" defaultValue="" aria-label="Day">
                    <option value="">Day</option>
                    {Array.from({ length: 31 }, (_, i) => (
                      <option key={i + 1} value={String(i + 1)}>
                        {i + 1}
                      </option>
                    ))}
                  </select>
                  <select className="ue-select" defaultValue="" aria-label="Month">
                    <option value="">Month</option>
                    {[
                      "January",
                      "February",
                      "March",
                      "April",
                      "May",
                      "June",
                      "July",
                      "August",
                      "September",
                      "October",
                      "November",
                      "December",
                    ].map((m) => (
                      <option key={m} value={m}>
                        {m}
                      </option>
                    ))}
                  </select>
                  <select className="ue-select" defaultValue="" aria-label="Year">
                    <option value="">Year</option>
                    {Array.from({ length: 80 }, (_, i) => {
                      const year = new Date().getFullYear() - i;
                      return (
                        <option key={year} value={String(year)}>
                          {year}
                        </option>
                      );
                    })}
                  </select>
                </div>
              </div>
              <label className="ue-field">
                <span className="ue-label">Default Language</span>
                <select className="ue-select" defaultValue="">
                  <option value="">Select Default Language</option>
                  {LANGUAGE_OPTIONS.map((opt) => (
                    <option key={opt} value={opt}>
                      {opt}
                    </option>
                  ))}
                </select>
              </label>
              <label className="ue-field">
                <span className="ue-label">Inactivity Logout Time (Minutes)</span>
                <input className="ue-input" type="text" defaultValue="0" />
              </label>

              <label className="ue-field">
                <span className="ue-label">Allowed Discount on Order</span>
                <input className="ue-input" type="text" defaultValue="0" />
              </label>
              <label className="ue-field">
                <span className="ue-label">Employee No / Payroll No</span>
                <input className="ue-input" type="text" placeholder="Enter Employee No" />
              </label>
              <label className="ue-field">
                <span className="ue-label ue-label--with-info">
                  Allowed Time for Order Update (days)
                  <InfoIcon />
                </span>
                <input className="ue-input" type="text" defaultValue="0" />
              </label>

              <label className="ue-field ue-field--wide">
                <span className="ue-label">User Integration Code</span>
                <input className="ue-input" type="text" placeholder="Enter User Integration Code" />
              </label>

              <div className="ue-field ue-field--wide ue-field--2fa">
                <span className="ue-label">Two Factor Authentication</span>
                <div className="ue-2fa">
                  <Toggle checked={false} label="Two Factor Authentication" />
                  <p className="ue-2fa__hint">
                    To Enable/Disable two factor authentication, Please enter contact no and email id
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="ue-section">
          <header className="ue-section__head">Set Password for User</header>
          <div className="ue-section__body ue-section__body--password">
            <PasswordDeliveryChoice
              name="add-user-password-delivery"
              value={passwordDelivery}
              onChange={setPasswordDelivery}
              layout="stacked"
            />
            {!emailDelivery ? (
              <label className="ue-field ue-field--password-input">
                <RequiredLabel>Password</RequiredLabel>
                <input
                  className="ue-input"
                  type="password"
                  placeholder="Enter Password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  autoComplete="new-password"
                />
                <p className="ue-field__hint">
                  Password must be at least 8 character long and contain at least 1 lowercase letter, 1
                  uppercase letter, 1 digit and 1 special character
                </p>
              </label>
            ) : (
              <p className="ue-password-card__hint">
                A temporary password will be generated and emailed after the user is created. Email is
                required in User Details above.
              </p>
            )}
          </div>
        </section>

        <section className="ue-section">
          <header className="ue-section__head">Feature Access</header>
          <div className="ue-section__body ue-section__body--flush">
            <div className="ue-fa-tabs" role="tablist" aria-label="Feature access modules">
              {defaults.featureTabs.map((tab) => (
                <button
                  key={tab.id}
                  type="button"
                  role="tab"
                  aria-selected={tab.id === activeTabId}
                  className={`ue-fa-tab${tab.id === activeTabId ? " ue-fa-tab--active" : ""}`}
                  onClick={() => setActiveTabId(tab.id)}
                >
                  {tab.label}
                  <span className="ue-fa-tab__badge ue-fa-tab__badge--dark">{tab.count}</span>
                </button>
              ))}
            </div>

            {activeTab && (
              <div className="ue-fa-toolbar">
                <div className="ue-fa-toolbar__item">
                  <span className="ue-fa-toolbar__label">Module Access</span>
                  <Toggle checked={activeTab.moduleAccess} label="Module Access" />
                </div>
                <div className="ue-fa-toolbar__item">
                  <span className="ue-fa-toolbar__label">Enable All</span>
                  <Toggle checked={activeTab.enableAll} label="Enable All" />
                </div>
              </div>
            )}

            {activeTab && <FeatureAccessPanel tab={activeTab} />}
          </div>
        </section>

        <section className="ue-section">
          <header className="ue-section__head">
            Department Access - Set the departments the user will have access to
          </header>
          <div className="ue-section__body">
            <div className="ue-dept-toolbar">
              <div className="ue-dept-toolbar__item">
                <span className="ue-dept-toolbar__label">All Departments</span>
                <Toggle checked={false} label="All Departments" />
              </div>
              <label className="ue-dept-toolbar__default">
                <span className="ue-label">Default Department</span>
                <select className="ue-select ue-select--dept" defaultValue="">
                  <option value="">Select Default Department</option>
                  {DEPARTMENT_OPTIONS.filter((d) => d !== "All Departments").map((opt) => (
                    <option key={opt} value={opt}>
                      {opt}
                    </option>
                  ))}
                </select>
              </label>
            </div>
            <div className="ue-dept-list">
              <label className="ue-dept-check">
                <input type="checkbox" />
                <span>Pathology</span>
              </label>
            </div>
          </div>
        </section>
      </div>

      <footer className="ue-footer">
        <button
          type="button"
          className="ue-btn ue-btn--primary ue-btn--footer"
          onClick={handleCreateUser}
          disabled={submitting}
        >
          {submitting ? "Creating…" : "Create User"}
        </button>
      </footer>

      <UserInviteEmailPreviewModal
        open={invitePreview !== null}
        data={invitePreview}
        onClose={() => {
          setInvitePreview(null);
          navigate(`/lab/${labId}/center/users`);
        }}
      />
    </div>
  );
}
