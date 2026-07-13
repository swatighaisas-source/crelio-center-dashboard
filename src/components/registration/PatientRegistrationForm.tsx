import { useState, type ReactNode } from "react";
import { useParams } from "react-router-dom";
import { BillPatientModal } from "./BillPatientModal";

function FieldLabel({
  children,
  required,
  hint,
}: {
  children: ReactNode;
  required?: boolean;
  hint?: ReactNode;
}) {
  return (
    <label className="reg-field__label">
      {children}
      {required && <span className="reg-field__required"> *</span>}
      {hint}
    </label>
  );
}

function SelectChevron() {
  return (
    <span className="reg-field__chevron" aria-hidden>
      <svg viewBox="0 0 12 8" width="10" height="7" fill="none">
        <path
          d="M1.5 1.5L6 6l4.5-4.5"
          stroke="currentColor"
          strokeWidth="1.3"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    </span>
  );
}

export function PatientRegistrationForm() {
  const { id } = useParams<{ id: string }>();
  const labId = Number(id);
  const [billModalOpen, setBillModalOpen] = useState(false);

  return (
    <form className="reg-form" onSubmit={(e) => e.preventDefault()}>
      <div className="reg-form__grid">
        <div className="reg-field reg-field--sm">
          <FieldLabel>Patient ID</FieldLabel>
          <div className="reg-field__static">76</div>
        </div>

        <div className="reg-field">
          <FieldLabel>Select Patient Type</FieldLabel>
          <div className="reg-field__select-wrap">
            <select className="reg-field__select" defaultValue="" aria-label="Select Patient Type">
              <option value="">Select Patient Type</option>
            </select>
            <SelectChevron />
          </div>
        </div>

        <div className="reg-field">
          <FieldLabel>Optional Patient ID (MRN)</FieldLabel>
          <input type="text" className="reg-field__input" placeholder="Optional Patient ID (MRN)" />
        </div>

        <div className="reg-field">
          <FieldLabel>National ID Number</FieldLabel>
          <div className="reg-field__input-wrap">
            <input type="text" className="reg-field__input" placeholder="National ID Number" />
            <button type="button" className="reg-field__input-icon" aria-label="Search national ID">
              <svg viewBox="0 0 16 16" width="14" height="14" fill="none">
                <circle cx="7" cy="7" r="4.5" stroke="currentColor" strokeWidth="1.3" />
                <path d="M10.5 10.5L14 14" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" />
              </svg>
            </button>
          </div>
          <button type="button" className="reg-field__link">
            Verify Patient
          </button>
        </div>

        <div className="reg-field">
          <FieldLabel>Designation</FieldLabel>
          <div className="reg-field__select-wrap">
            <select className="reg-field__select" defaultValue="" aria-label="Designation">
              <option value="">Designation</option>
            </select>
            <SelectChevron />
          </div>
        </div>

        <div className="reg-field reg-field--span-3">
          <FieldLabel required>Enter Patient Name</FieldLabel>
          <div className="reg-field__input-wrap">
            <input
              type="text"
              className="reg-field__input"
              placeholder="Enter Patient Name"
              aria-required
            />
            <button type="button" className="reg-field__input-icon" aria-label="Search patient name">
              <svg viewBox="0 0 16 16" width="14" height="14" fill="none">
                <circle cx="7" cy="7" r="4.5" stroke="currentColor" strokeWidth="1.3" />
                <path d="M10.5 10.5L14 14" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" />
              </svg>
            </button>
          </div>
        </div>

        <div className="reg-field">
          <FieldLabel>Sex</FieldLabel>
          <div className="reg-field__radios">
            <label className="reg-radio">
              <input type="radio" name="sex" defaultChecked />
              <span>Male</span>
            </label>
            <label className="reg-radio">
              <input type="radio" name="sex" />
              <span>Female</span>
            </label>
            <label className="reg-radio">
              <input type="radio" name="sex" />
              <span>Other</span>
            </label>
          </div>
        </div>

        <div className="reg-field reg-field--sm">
          <FieldLabel>Height</FieldLabel>
          <input type="text" className="reg-field__input" placeholder="Height" />
        </div>

        <div className="reg-field reg-field--sm">
          <FieldLabel>Weight</FieldLabel>
          <input type="text" className="reg-field__input" placeholder="Weight" />
        </div>

        <div className="reg-field reg-field--dob">
          <FieldLabel>Date of Birth</FieldLabel>
          <div className="reg-field__dob-row">
            <div className="reg-field__select-wrap">
              <select className="reg-field__select" defaultValue="" aria-label="Day">
                <option value="">Day</option>
              </select>
              <SelectChevron />
            </div>
            <div className="reg-field__select-wrap">
              <select className="reg-field__select" defaultValue="" aria-label="Month">
                <option value="">Month</option>
              </select>
              <SelectChevron />
            </div>
            <div className="reg-field__select-wrap">
              <select className="reg-field__select" defaultValue="" aria-label="Year">
                <option value="">Year</option>
              </select>
              <SelectChevron />
            </div>
          </div>
          <button type="button" className="reg-field__link">
            Clear
          </button>
        </div>

        <div className="reg-field reg-field--xs">
          <FieldLabel>Age</FieldLabel>
          <input type="text" className="reg-field__input" defaultValue="0" />
        </div>

        <div className="reg-field reg-field--xs">
          <FieldLabel>Year</FieldLabel>
          <div className="reg-field__input-wrap">
            <input type="text" className="reg-field__input" defaultValue="0" />
            <button type="button" className="reg-field__clear" aria-label="Clear year">
              ×
            </button>
          </div>
        </div>

        <div className="reg-field">
          <FieldLabel>Contact Number</FieldLabel>
          <div className="reg-field__phone-row">
            <button type="button" className="reg-field__country" aria-label="Country code">
              <span className="reg-field__flag" aria-hidden>
                🇺🇸
              </span>
              <SelectChevron />
            </button>
            <input type="tel" className="reg-field__input" placeholder="Contact Number" />
          </div>
        </div>

        <div className="reg-field">
          <FieldLabel>Phone Number Belongs To</FieldLabel>
          <div className="reg-field__radios">
            <label className="reg-radio">
              <input type="radio" name="phoneOwner" defaultChecked />
              <span>Patient</span>
            </label>
            <label className="reg-radio">
              <input type="radio" name="phoneOwner" />
              <span>Relative/Guardian</span>
            </label>
          </div>
        </div>

        <div className="reg-field">
          <FieldLabel>Email</FieldLabel>
          <input type="email" className="reg-field__input" placeholder="Email" />
        </div>

        <div className="reg-field">
          <FieldLabel>Alternative Email</FieldLabel>
          <input type="email" className="reg-field__input" placeholder="Alternative Email" />
        </div>

        <div className="reg-field">
          <FieldLabel>Account</FieldLabel>
          <div className="reg-field__input-wrap">
            <input type="text" className="reg-field__input" defaultValue="Amazon" />
            <button type="button" className="reg-field__clear" aria-label="Clear account">
              ×
            </button>
          </div>
        </div>

        <div className="reg-field">
          <FieldLabel>Provider</FieldLabel>
          <div className="reg-field__provider-row">
            <div className="reg-field__select-wrap reg-field__select-wrap--grow">
              <select className="reg-field__select" defaultValue="" aria-label="Provider">
                <option value="">Provider</option>
              </select>
              <SelectChevron />
            </div>
            <button type="button" className="reg-field__add-btn" aria-label="Add provider">
              +
            </button>
          </div>
          <button type="button" className="reg-field__link">
            Add Shared Provider
          </button>
        </div>

        <div className="reg-field reg-field--full">
          <FieldLabel>Mailing Address</FieldLabel>
          <input type="text" className="reg-field__input" placeholder="Mailing Address" />
        </div>

        <div className="reg-field">
          <FieldLabel>City</FieldLabel>
          <input type="text" className="reg-field__input" placeholder="City" />
        </div>

        <div className="reg-field">
          <FieldLabel>State</FieldLabel>
          <div className="reg-field__select-wrap">
            <select className="reg-field__select" defaultValue="" aria-label="State">
              <option value="">State</option>
            </select>
            <SelectChevron />
          </div>
        </div>

        <div className="reg-field">
          <FieldLabel>County</FieldLabel>
          <input type="text" className="reg-field__input" placeholder="County" />
        </div>

        <div className="reg-field">
          <FieldLabel>Zipcode</FieldLabel>
          <input type="text" className="reg-field__input" placeholder="Zipcode" />
        </div>

        <div className="reg-field reg-field--full">
          <FieldLabel>Clinical History</FieldLabel>
          <div className="reg-field__select-wrap">
            <select className="reg-field__select" defaultValue="" aria-label="Clinical History">
              <option value="">Clinical History</option>
            </select>
            <SelectChevron />
          </div>
        </div>

        <div className="reg-field reg-field--full">
          <FieldLabel>Passport Number</FieldLabel>
          <input type="text" className="reg-field__input" placeholder="Passport Number" />
        </div>

        <div className="reg-field reg-field--full">
          <FieldLabel>Nationality</FieldLabel>
          <div className="reg-field__select-wrap">
            <select className="reg-field__select" defaultValue="" aria-label="Nationality">
              <option value="">Nationality</option>
            </select>
            <SelectChevron />
          </div>
        </div>

        <div className="reg-field reg-field--full">
          <FieldLabel>Ethnicity</FieldLabel>
          <div className="reg-field__select-wrap">
            <select className="reg-field__select" defaultValue="" aria-label="Ethnicity">
              <option value="">Ethnicity</option>
            </select>
            <SelectChevron />
          </div>
        </div>

        <div className="reg-field reg-field--full">
          <FieldLabel>Race</FieldLabel>
          <div className="reg-field__select-wrap">
            <select className="reg-field__select" defaultValue="" aria-label="Race">
              <option value="">Race</option>
            </select>
            <SelectChevron />
          </div>
        </div>

        <div className="reg-field reg-field--full">
          <FieldLabel>Country</FieldLabel>
          <div className="reg-field__select-wrap">
            <select className="reg-field__select" defaultValue="" aria-label="Country">
              <option value="">Country</option>
            </select>
            <SelectChevron />
          </div>
        </div>
      </div>

      <div className="reg-form__footer">
        <button type="button" className="reg-form__clear">
          Clear
        </button>
        <div className="reg-form__actions">
          <button type="submit" className="reg-form__submit">
            Register
          </button>
          <button type="button" className="reg-form__submit" onClick={() => setBillModalOpen(true)}>
            Register And Order
          </button>
        </div>
      </div>

      <BillPatientModal
        labId={labId}
        open={billModalOpen}
        onClose={() => setBillModalOpen(false)}
      />
    </form>
  );
}
