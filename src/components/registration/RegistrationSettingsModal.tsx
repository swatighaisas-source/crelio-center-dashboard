import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { ManagePaymentModesModal } from "./ManagePaymentModesModal";
import {
  ADVANCE_SETTINGS_LEFT,
  ADVANCE_SETTINGS_RIGHT,
  AGE_DISCOUNT_PRESETS,
  APPOINTMENT_VERSION_OPTIONS,
  DISCOUNT_LIST_OPTIONS,
  REGISTRATION_LAYOUT_OPTIONS,
  REGISTRATION_PAGES,
  REGISTRATION_SETTINGS_TABS,
  REGISTRATION_VERSION_OPTIONS,
  type RegistrationSettingsCheckbox,
  type RegistrationSettingsTabId,
} from "../../data/registrationSettings";

interface Props {
  open: boolean;
  onClose: () => void;
}

function flattenCheckboxes(items: RegistrationSettingsCheckbox[]): RegistrationSettingsCheckbox[] {
  return items.flatMap((item) => [item, ...(item.children ?? [])]);
}

function buildCheckboxState(
  left: RegistrationSettingsCheckbox[],
  right: RegistrationSettingsCheckbox[],
): Record<string, boolean> {
  const all = [...flattenCheckboxes(left), ...flattenCheckboxes(right)];
  return Object.fromEntries(all.map((item) => [item.id, item.checked]));
}

function InfoIcon() {
  return (
    <svg viewBox="0 0 16 16" width="14" height="14" fill="none" aria-hidden>
      <circle cx="8" cy="8" r="6.5" stroke="currentColor" strokeWidth="1.2" />
      <path d="M8 7.2V11" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" />
      <circle cx="8" cy="5.2" r="0.75" fill="currentColor" />
    </svg>
  );
}

function SettingsCheckbox({
  item,
  checkboxState,
  onChange,
  nested,
}: {
  item: RegistrationSettingsCheckbox;
  checkboxState: Record<string, boolean>;
  onChange: (id: string, value: boolean) => void;
  nested?: boolean;
}) {
  return (
    <>
      <label
        className={`reg-settings-check${nested ? " reg-settings-check--nested" : ""}`}
      >
        <input
          type="checkbox"
          checked={checkboxState[item.id] ?? false}
          onChange={(e) => onChange(item.id, e.target.checked)}
        />
        <span>{item.label}</span>
      </label>
      {item.children?.map((child) => (
        <SettingsCheckbox
          key={child.id}
          item={child}
          checkboxState={checkboxState}
          onChange={onChange}
          nested
        />
      ))}
    </>
  );
}

function AdvanceSettingsPanel({
  checkboxState,
  onCheckboxChange,
  registrationVersion,
  appointmentVersion,
  formLayout,
  discountList,
  onRegistrationVersionChange,
  onAppointmentVersionChange,
  onFormLayoutChange,
  onDiscountListChange,
  onManagePaymentModes,
}: {
  checkboxState: Record<string, boolean>;
  onCheckboxChange: (id: string, value: boolean) => void;
  registrationVersion: string;
  appointmentVersion: string;
  formLayout: string;
  discountList: string;
  onRegistrationVersionChange: (value: string) => void;
  onAppointmentVersionChange: (value: string) => void;
  onFormLayoutChange: (value: string) => void;
  onDiscountListChange: (value: string) => void;
  onManagePaymentModes: () => void;
}) {
  return (
    <div className="reg-settings-advance">
      <div className="reg-settings-advance__columns">
        <div className="reg-settings-advance__col">
          {ADVANCE_SETTINGS_LEFT.map((item) => (
            <SettingsCheckbox
              key={item.id}
              item={item}
              checkboxState={checkboxState}
              onChange={onCheckboxChange}
            />
          ))}
        </div>
        <div className="reg-settings-advance__col">
          {ADVANCE_SETTINGS_RIGHT.map((item) => (
            <SettingsCheckbox
              key={item.id}
              item={item}
              checkboxState={checkboxState}
              onChange={onCheckboxChange}
            />
          ))}
        </div>
      </div>

      <div className="reg-settings-advance__radios">
        <fieldset className="reg-settings-radio-group">
          <legend>Select Registration Version</legend>
          <div className="reg-settings-radio-group__options">
            {REGISTRATION_VERSION_OPTIONS.map((option) => (
              <label key={option} className="reg-settings-radio">
                <input
                  type="radio"
                  name="registration-version"
                  value={option}
                  checked={registrationVersion === option}
                  onChange={() => onRegistrationVersionChange(option)}
                />
                <span>{option}</span>
              </label>
            ))}
          </div>
        </fieldset>

        <fieldset className="reg-settings-radio-group">
          <legend>Select Appointment Version</legend>
          <div className="reg-settings-radio-group__options">
            {APPOINTMENT_VERSION_OPTIONS.map((option) => (
              <label key={option} className="reg-settings-radio">
                <input
                  type="radio"
                  name="appointment-version"
                  value={option}
                  checked={appointmentVersion === option}
                  onChange={() => onAppointmentVersionChange(option)}
                />
                <span>{option}</span>
              </label>
            ))}
          </div>
        </fieldset>

        <fieldset className="reg-settings-radio-group">
          <legend>Select Registration Form Layout</legend>
          <div className="reg-settings-radio-group__options">
            {REGISTRATION_LAYOUT_OPTIONS.map((option) => (
              <label key={option} className="reg-settings-radio">
                <input
                  type="radio"
                  name="registration-layout"
                  value={option}
                  checked={formLayout === option}
                  onChange={() => onFormLayoutChange(option)}
                />
                <span>{option}</span>
              </label>
            ))}
          </div>
        </fieldset>
      </div>

      <div className="reg-settings-advance__sections">
        <section className="reg-settings-section">
          <h3 className="reg-settings-section__title">
            Set Preference For Discount List
            <button type="button" className="reg-settings-section__info" aria-label="More info">
              <InfoIcon />
            </button>
          </h3>
          <select
            className="reg-settings-select"
            value={discountList}
            onChange={(e) => onDiscountListChange(e.target.value)}
          >
            {DISCOUNT_LIST_OPTIONS.map((option) => (
              <option key={option} value={option}>
                {option}
              </option>
            ))}
          </select>
        </section>

        <section className="reg-settings-section">
          <h3 className="reg-settings-section__title">Add Discount Based on Age</h3>
          <p className="reg-settings-section__hint">Select the age (in years)</p>
          <div className="reg-settings-age-row">
            <input type="number" className="reg-settings-age-input" defaultValue={0} min={0} />
            <input type="number" className="reg-settings-age-input" defaultValue={0} min={0} />
            <button type="button" className="reg-settings-btn reg-settings-btn--add">
              Add
            </button>
          </div>
          {AGE_DISCOUNT_PRESETS.map((preset) => (
            <div key={preset.id} className="reg-settings-age-preset">
              <span className="reg-settings-age-preset__range">{preset.range}</span>
              <button type="button" className="reg-settings-btn reg-settings-btn--remove">
                Remove
              </button>
              <select className="reg-settings-select reg-settings-select--compact" defaultValue={preset.discount}>
                <option value={preset.discount}>{preset.discount}</option>
              </select>
            </div>
          ))}
        </section>

        <section className="reg-settings-section">
          <h3 className="reg-settings-section__title">Add Discount Based on Time</h3>
          <button type="button" className="reg-settings-btn reg-settings-btn--enable">
            Enable
          </button>
        </section>

        <section className="reg-settings-section">
          <h3 className="reg-settings-section__title">
            Registration/Order Creation With Missing Details
          </h3>
          <div className="reg-settings-section__actions">
            <button type="button" className="reg-settings-btn reg-settings-btn--edit">
              Edit
            </button>
            <button type="button" className="reg-settings-btn reg-settings-btn--disable">
              Disable
            </button>
          </div>
        </section>

        <section className="reg-settings-section reg-settings-section--inline">
          <h3 className="reg-settings-section__title reg-settings-section__title--inline">
            Custom Payment Modes
          </h3>
          <button
            type="button"
            className="reg-settings-btn reg-settings-btn--outline"
            onClick={onManagePaymentModes}
          >
            Manage Payment Modes
          </button>
        </section>
      </div>
    </div>
  );
}

function PlaceholderTab({ label }: { label: string }) {
  return (
    <div className="reg-settings-placeholder">
      <p>{label} configuration will appear here.</p>
    </div>
  );
}

export function RegistrationSettingsModal({ open, onClose }: Props) {
  const { id } = useParams<{ id: string }>();
  const labId = Number(id);
  const [activeTab, setActiveTab] = useState<RegistrationSettingsTabId>("advance");
  const [selectedPage, setSelectedPage] = useState<string>(REGISTRATION_PAGES[0]);
  const [checkboxState, setCheckboxState] = useState(() =>
    buildCheckboxState(ADVANCE_SETTINGS_LEFT, ADVANCE_SETTINGS_RIGHT),
  );
  const [registrationVersion, setRegistrationVersion] = useState<string>(
    REGISTRATION_VERSION_OPTIONS[1],
  );
  const [appointmentVersion, setAppointmentVersion] = useState<string>(
    APPOINTMENT_VERSION_OPTIONS[1],
  );
  const [formLayout, setFormLayout] = useState<string>(REGISTRATION_LAYOUT_OPTIONS[1]);
  const [discountList, setDiscountList] = useState<string>(DISCOUNT_LIST_OPTIONS[0]);
  const [paymentModesModalOpen, setPaymentModesModalOpen] = useState(false);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, onClose]);

  if (!open) return null;

  function handleCheckboxChange(id: string, value: boolean) {
    setCheckboxState((prev) => ({ ...prev, [id]: value }));
  }

  function handleSave(e: React.FormEvent) {
    e.preventDefault();
    onClose();
  }

  const activeTabMeta = REGISTRATION_SETTINGS_TABS.find((tab) => tab.id === activeTab);

  return (
    <div className="reg-settings-overlay" role="presentation" onClick={onClose}>
      <div
        className="reg-settings-modal"
        role="dialog"
        aria-labelledby="reg-settings-title"
        aria-modal="true"
        onClick={(e) => e.stopPropagation()}
      >
        <header className="reg-settings-modal__header">
          <h2 id="reg-settings-title" className="reg-settings-modal__title">
            Registration Settings
          </h2>
          <button
            type="button"
            className="reg-settings-modal__close"
            onClick={onClose}
            aria-label="Close"
          >
            ×
          </button>
        </header>

        <div className="reg-settings-modal__toolbar">
          <select
            className="reg-settings-page-select"
            value={selectedPage}
            onChange={(e) => setSelectedPage(e.target.value)}
          >
            {REGISTRATION_PAGES.map((page) => (
              <option key={page} value={page}>
                {page}
              </option>
            ))}
          </select>
          <button type="button" className="reg-settings-btn reg-settings-btn--outline">
            Add
          </button>
          <span className="reg-settings-published">Published</span>
        </div>

        <nav className="reg-settings-tabs" aria-label="Registration settings sections">
          {REGISTRATION_SETTINGS_TABS.map((tab) => (
            <button
              key={tab.id}
              type="button"
              className={`reg-settings-tabs__tab${
                activeTab === tab.id ? " reg-settings-tabs__tab--active" : ""
              }`}
              onClick={() => setActiveTab(tab.id)}
              aria-selected={activeTab === tab.id}
            >
              {tab.label}
            </button>
          ))}
        </nav>

        <form className="reg-settings-modal__body" onSubmit={handleSave}>
          {activeTab === "advance" ? (
            <AdvanceSettingsPanel
              checkboxState={checkboxState}
              onCheckboxChange={handleCheckboxChange}
              registrationVersion={registrationVersion}
              appointmentVersion={appointmentVersion}
              formLayout={formLayout}
              discountList={discountList}
              onRegistrationVersionChange={setRegistrationVersion}
              onAppointmentVersionChange={setAppointmentVersion}
              onFormLayoutChange={setFormLayout}
              onDiscountListChange={setDiscountList}
              onManagePaymentModes={() => setPaymentModesModalOpen(true)}
            />
          ) : (
            <PlaceholderTab label={activeTabMeta?.label ?? "Settings"} />
          )}

          <footer className="reg-settings-modal__footer">
            <button
              type="button"
              className="reg-settings-btn reg-settings-btn--secondary"
              onClick={onClose}
            >
              Close
            </button>
            <button type="submit" className="reg-settings-btn reg-settings-btn--primary">
              Save
            </button>
          </footer>
        </form>
      </div>

      <ManagePaymentModesModal
        labId={labId}
        open={paymentModesModalOpen}
        onClose={() => setPaymentModesModalOpen(false)}
      />
    </div>
  );
}
