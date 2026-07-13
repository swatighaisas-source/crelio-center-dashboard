import { useState, type ReactNode } from "react";
import type { LabDetail } from "../../data/labDetails";
import { LabWorkflowConfigPanel } from "../lab-settings/LabWorkflowConfigPanel";
import { ChevronRightIcon } from "../Icons";

const SIDEBAR_ITEMS = [
  "Account Configuration",
  "Registration Configurations",
  "Accession Configurations",
  "Communication Configurations",
  "Operations Configurations",
  "Report Setting",
  "Import/Export Configurations",
] as const;

const INNER_TABS = [
  "Accounts Configuration",
  "Workflow Configurations",
  "PDF/Template Configurations",
  "TAX Configurations",
] as const;

const DAYS = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];

interface Props {
  lab: LabDetail;
}

export function ConfigurationsTab({ lab }: Props) {
  const [activeInnerTab, setActiveInnerTab] = useState<(typeof INNER_TABS)[number]>(
    "Accounts Configuration",
  );

  return (
    <div className="configurations">
      <aside className="config-sidebar">
        {SIDEBAR_ITEMS.map((item) => (
          <button
            key={item}
            type="button"
            className={`config-sidebar__item${item === "Account Configuration" ? " config-sidebar__item--active" : ""}`}
          >
            {item}
          </button>
        ))}
      </aside>

      <div className="config-main">
        <div className="config-main__toolbar">
          <nav className="config-inner-tabs">
            {INNER_TABS.map((tab) => (
              <button
                key={tab}
                type="button"
                className={`config-inner-tab${tab === activeInnerTab ? " config-inner-tab--active" : ""}`}
                onClick={() => setActiveInnerTab(tab)}
              >
                {tab}
              </button>
            ))}
          </nav>
          <div className="config-main__actions">
            <button type="button" className="btn-secondary btn-secondary--sm">
              Export JSON
            </button>
            <button type="button" className="btn-solid btn-solid--sm">
              Save
            </button>
          </div>
        </div>

        {activeInnerTab === "Workflow Configurations" ? (
          <LabWorkflowConfigPanel lab={lab} />
        ) : (
          <>
        <CollapsibleSection title="Account Details">
          <div className="form-grid">
            <FormField label="Lab Name" value={lab.name} />
            <FormField label="Lab Abbreviation" value={lab.labAbbreviation} />
            <FormField label="Lab Contact" value={lab.contact} flag />
            <FormField label="Lab Address" value={lab.address} full />
            <FormField label="City" value="Hyderabad" />
            <FormField label="State" value="Telangana" />
            <FormField label="Pincode" value="" />
            <FormField label="Country" value="India" select />
            <FormField label="Country Code" value="91" select />
            <FormField label="Default Country ISO Code" value="IN" readonly />
            <FormField label="Currency" value="₹" select />
            <FormField label="Date Format" value="IN" select />
            <FormField label="TimeZone" value="Asia/Kolkata" readonly />
            <FormField label="Lab Email" value={lab.email} full />
          </div>
        </CollapsibleSection>

        <CollapsibleSection title="Lab Admin Details">
          <div className="form-grid">
            <FormField label="Admin Name" value="Dheeraj Vaddiraju" />
            <FormField label="Admin Email" value={lab.email} />
            <FormField label="Admin Contact" value={lab.contact} flag />
          </div>
        </CollapsibleSection>

        <CollapsibleSection title="Lab Timings">
          <div className="timings-controls">
            <select className="form-select" defaultValue="">
              <option value="">Select Day</option>
              {DAYS.map((d) => (
                <option key={d} value={d}>
                  {d}
                </option>
              ))}
            </select>
            <FormField label="Start Time" value="12:00 AM" inline />
            <FormField label="End Time" value="12:00 AM" inline />
            <button type="button" className="btn-solid btn-solid--sm">
              Add
            </button>
            <button type="button" className="btn-solid btn-solid--sm">
              Add All
            </button>
            <button type="button" className="btn-solid btn-solid--sm">
              Remove All
            </button>
          </div>
          <ul className="timings-list">
            {DAYS.map((day) => (
              <li key={day} className="timings-list__item">
                <span className="timings-list__day">{day}</span>
                <span>08:00 AM - 08:00 PM</span>
                <button type="button" className="btn-outline btn-outline--sm">
                  Remove
                </button>
              </li>
            ))}
          </ul>
        </CollapsibleSection>

        <CollapsibleSection title="Communication Details">
          <h4 className="config-subsection">Communication Credits</h4>
          <div className="form-grid form-grid--3">
            <FormField label="SMS Credits Available" value="0" />
            <FormField label="Sender ID" value="CRELIO" />
            <div className="form-field form-field--actions">
              <button type="button" className="btn-secondary btn-secondary--sm">
                Edit
              </button>
            </div>
          </div>
          <p className="config-hint">
            CRON 100 · SMS Monthly Limit 0 · Whatsapp Credits 0
          </p>
          <h4 className="config-subsection">Whatsapp Controls</h4>
          <h4 className="config-subsection">Communication Controls</h4>
          <div className="toggle-grid">
            <Toggle label="SMS Hardstop" hint="Stop SMS Communication for the lab" on />
            <Toggle label="Email Hardstop" hint="Stop Email Communication for the lab" on />
            <Toggle label="Billing SMS Flag" on={false} />
            <Toggle
              label="Send Indirect Message"
              hint="Enable sending messages to indirect patient"
              on={false}
            />
          </div>
        </CollapsibleSection>
          </>
        )}
      </div>
    </div>
  );
}

function CollapsibleSection({
  title,
  children,
}: {
  title: string;
  children: ReactNode;
}) {
  return (
    <section className="config-section">
      <header className="config-section__header">
        <h3>{title}</h3>
        <ChevronRightIcon />
      </header>
      <div className="config-section__body">{children}</div>
    </section>
  );
}

function FormField({
  label,
  value,
  full,
  inline,
  select,
  readonly,
  flag,
}: {
  label: string;
  value: string;
  full?: boolean;
  inline?: boolean;
  select?: boolean;
  readonly?: boolean;
  flag?: boolean;
}) {
  return (
    <div
      className={`form-field${full ? " form-field--full" : ""}${inline ? " form-field--inline" : ""}`}
    >
      <label className="form-field__label">{label}</label>
      <div className="form-field__input-wrap">
        {flag && <span className="form-field__flag">🇮🇳</span>}
        {select ? (
          <select className="form-input" defaultValue={value}>
            <option>{value}</option>
          </select>
        ) : (
          <input
            className={`form-input${readonly ? " form-input--readonly" : ""}`}
            defaultValue={value}
            readOnly={readonly}
          />
        )}
      </div>
    </div>
  );
}

function Toggle({
  label,
  hint,
  on,
}: {
  label: string;
  hint?: string;
  on: boolean;
}) {
  return (
    <div className="toggle-field">
      <div className="toggle-field__row">
        <span className="toggle-field__label">{label}</span>
        <button
          type="button"
          className={`toggle${on ? " toggle--on" : ""}`}
          aria-pressed={on}
        >
          <span className="toggle__knob" />
        </button>
      </div>
      {hint && <p className="toggle-field__hint">{hint}</p>}
    </div>
  );
}
