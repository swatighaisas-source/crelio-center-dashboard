import { useState } from "react";
import {
  DEPARTMENT_OPTIONS,
  LANGUAGE_OPTIONS,
  LOGIN_MODULE_OPTIONS,
  USER_ROLE_OPTIONS,
  type CenterUserDetail,
  type UserFeatureTab,
} from "../../data/centerUserEdit";
import { SubpageBreadcrumb } from "../lab-shell/SubpageBreadcrumb";
import { usePageBreadcrumb } from "../../hooks/usePageBreadcrumb";
import { SetNewPasswordModal } from "./SetNewPasswordModal";
import "../../styles/subpage-breadcrumb.css";

interface Props {
  labId: number;
  detail: CenterUserDetail;
}

function Toggle({
  checked,
  onChange,
  label,
}: {
  checked: boolean;
  onChange?: () => void;
  label: string;
}) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={checked}
      aria-label={label}
      className={`ue-toggle${checked ? " ue-toggle--on" : ""}`}
      onClick={onChange}
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

export function EditUserSection({ labId, detail }: Props) {
  const [activeTabId, setActiveTabId] = useState("registration");
  const [passwordModalOpen, setPasswordModalOpen] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");
  const breadcrumb = usePageBreadcrumb();
  const activeTab = detail.featureTabs.find((t) => t.id === activeTabId) ?? detail.featureTabs[0];

  return (
    <div className="ue-page">
      {breadcrumb && (
        <SubpageBreadcrumb
          backHref={breadcrumb.backHref}
          backLabel={breadcrumb.backLabel}
          segments={breadcrumb.segments}
          actions={
            <>
              <button type="button" className="ue-btn ue-btn--outline">
                Copy User
              </button>
              <button
                type="button"
                className="ue-btn ue-btn--outline"
                onClick={() => setPasswordModalOpen(true)}
              >
                Set New Password
              </button>
              <button type="button" className="ue-btn ue-btn--primary">
                Save Changes
              </button>
            </>
          }
        />
      )}

      <div className="ue-body">
        {successMessage && <p className="ue-toast">{successMessage}</p>}

        <section className="ue-section">
          <header className="ue-section__head">
            User Details - Provide details of the user you are adding
          </header>
          <div className="ue-section__body">
            <div className="ue-form-grid">
              <label className="ue-field">
                <RequiredLabel>Name</RequiredLabel>
                <input className="ue-input" type="text" defaultValue={detail.user.name} />
              </label>
              <label className="ue-field">
                <RequiredLabel>User Role</RequiredLabel>
                <select className="ue-select" defaultValue={detail.user.userRole || USER_ROLE_OPTIONS[0]}>
                  {USER_ROLE_OPTIONS.map((opt) => (
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
                  defaultValue={detail.user.defaultLoginSection || LOGIN_MODULE_OPTIONS[0]}
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
                <div className="ue-username">
                  <input className="ue-input ue-input--prefix" type="text" defaultValue={detail.usernamePrefix} />
                  <input className="ue-input" type="text" defaultValue={detail.usernameSuffix} />
                </div>
              </label>
              <label className="ue-field">
                <RequiredLabel>Email</RequiredLabel>
                <input className="ue-input" type="email" defaultValue={detail.email} />
              </label>
              <label className="ue-field">
                <span className="ue-label">Contact No</span>
                <div className="ue-phone">
                  <span className="ue-phone__flag" aria-hidden>
                    🇮🇳
                  </span>
                  <span className="ue-phone__code">{detail.contactCountryCode}</span>
                  <input className="ue-phone__input" type="text" defaultValue={detail.contactNumber} />
                </div>
              </label>

              <div className="ue-field">
                <span className="ue-label">Date of Birth</span>
                <div className="ue-dob">
                  <select className="ue-select" defaultValue={detail.dobDay} aria-label="Day">
                    <option value="">Day</option>
                    {Array.from({ length: 31 }, (_, i) => (
                      <option key={i + 1} value={String(i + 1)}>
                        {i + 1}
                      </option>
                    ))}
                  </select>
                  <select className="ue-select" defaultValue={detail.dobMonth} aria-label="Month">
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
                  <select className="ue-select" defaultValue={detail.dobYear} aria-label="Year">
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
                <span className="ue-label">Inactivity Logout Time (Minutes)</span>
                <input className="ue-input" type="text" defaultValue={detail.inactivityLogoutMinutes} />
              </label>
              <label className="ue-field ue-field--language">
                <span className="ue-label">Default Language</span>
                <div className="ue-language">
                  <select className="ue-select ue-select--language" defaultValue={detail.defaultLanguage}>
                    {LANGUAGE_OPTIONS.map((opt) => (
                      <option key={opt} value={opt}>
                        {opt}
                      </option>
                    ))}
                  </select>
                  <button type="button" className="ue-language__clear" aria-label="Clear language">
                    ×
                  </button>
                </div>
              </label>

              <label className="ue-field">
                <span className="ue-label">Allowed Discount on Order</span>
                <input className="ue-input" type="text" defaultValue={detail.allowedDiscount} />
              </label>
              <label className="ue-field">
                <span className="ue-label ue-label--with-info">
                  Allowed Time for Order Update (days)
                  <InfoIcon />
                </span>
                <input className="ue-input" type="text" defaultValue={detail.allowedOrderUpdateDays} />
              </label>
              <label className="ue-field">
                <span className="ue-label">Employee No / Payroll No</span>
                <input className="ue-input" type="text" placeholder="Enter Employee No" defaultValue={detail.employeeNo} />
              </label>

              <label className="ue-field ue-field--wide">
                <span className="ue-label">User Integration Code</span>
                <input
                  className="ue-input"
                  type="text"
                  placeholder="Enter User Integration Code"
                  defaultValue={detail.userIntegrationCode}
                />
              </label>

              <div className="ue-field ue-field--wide ue-field--2fa">
                <span className="ue-label">Two Factor Authentication</span>
                <div className="ue-2fa">
                  <Toggle checked={detail.twoFactorAuth} label="Two Factor Authentication" />
                  <p className="ue-2fa__hint">
                    To Enable/Disable two factor authentication, Please enter contact no and email id
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="ue-section">
          <header className="ue-section__head">Feature Access</header>
          <div className="ue-section__body ue-section__body--flush">
            <div className="ue-fa-tabs" role="tablist" aria-label="Feature access modules">
              {detail.featureTabs.map((tab) => (
                <button
                  key={tab.id}
                  type="button"
                  role="tab"
                  aria-selected={tab.id === activeTabId}
                  className={`ue-fa-tab${tab.id === activeTabId ? " ue-fa-tab--active" : ""}`}
                  onClick={() => setActiveTabId(tab.id)}
                >
                  {tab.label}
                  <span className="ue-fa-tab__badge">{tab.count}</span>
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
                <Toggle checked={detail.allDepartments} label="All Departments" />
              </div>
              <label className="ue-dept-toolbar__default">
                <span className="ue-label">Default Department</span>
                <select className="ue-select ue-select--dept" defaultValue={detail.defaultDepartment}>
                  {DEPARTMENT_OPTIONS.map((opt) => (
                    <option key={opt} value={opt}>
                      {opt}
                    </option>
                  ))}
                </select>
              </label>
            </div>
            <div className="ue-dept-list">
              {detail.departments.map((dept) => (
                <label key={dept.id} className="ue-dept-check">
                  <input type="checkbox" defaultChecked={dept.checked} />
                  <span>{dept.label}</span>
                </label>
              ))}
            </div>
          </div>
        </section>
      </div>

      <footer className="ue-footer">
        <button type="button" className="ue-btn ue-btn--primary ue-btn--footer">
          Save Changes
        </button>
      </footer>

      <SetNewPasswordModal
        open={passwordModalOpen}
        labId={labId}
        recipientName={detail.user.name}
        username={detail.user.username}
        email={detail.email}
        onClose={() => setPasswordModalOpen(false)}
        onSuccess={setSuccessMessage}
      />
    </div>
  );
}
