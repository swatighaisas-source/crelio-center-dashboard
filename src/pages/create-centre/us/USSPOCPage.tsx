import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { USPageHeader } from "../../../components/create-centre/USPageHeader";
import { useCreateCentre } from "../../../context/CreateCentreContext";
import type { USSPOCEntry } from "../../../context/CreateCentreContext";

const EMPTY_CONTACT: USSPOCEntry = { name: "", email: "", phone: "" };

const ROLE_OPTIONS = [
  "Owner",
  "Lab Director",
  "Implementation Co-ordinator",
  "Finance",
  "HR",
  "Lab Operations",
  "IT",
  "Procurement",
  "Other",
];

interface ContactCardProps {
  label: string;
  value: USSPOCEntry;
  role?: string;
  showRole?: boolean;
  required?: boolean;
  disclaimer?: string;
  onRemove?: () => void;
  onChange: (patch: Partial<USSPOCEntry & { role: string }>) => void;
}

function ContactCard({
  label,
  value,
  role,
  showRole,
  required,
  disclaimer,
  onRemove,
  onChange,
}: ContactCardProps) {
  return (
    <div className={`spoc-contact-card${required ? " spoc-contact-card--required" : ""}`}>
      <div className="spoc-contact-card__header">
        <div className="spoc-contact-card__title-row">
          <span className="spoc-contact-card__label">{label}</span>
          {required ? <span className="spoc-required-badge">Required</span> : null}
        </div>
        {onRemove ? (
          <button
            type="button"
            className="spoc-contact-card__remove"
            onClick={onRemove}
            aria-label={`Remove ${label}`}
          >
            ×
          </button>
        ) : null}
      </div>
      {disclaimer ? <p className="spoc-contact-card__disclaimer">{disclaimer}</p> : null}
      <div className="spoc-contact-card__fields">
        <label className="us-form-field spoc-contact-card__field">
          <span className="us-form-field__label">Full Name</span>
          <input
            type="text"
            className="us-form-field__input"
            placeholder="Jane Smith"
            value={value.name}
            onChange={(e) => onChange({ name: e.target.value })}
          />
        </label>
        <label className="us-form-field spoc-contact-card__field">
          <span className="us-form-field__label">Email</span>
          <input
            type="email"
            className="us-form-field__input"
            placeholder="jane@lab.com"
            value={value.email}
            onChange={(e) => onChange({ email: e.target.value })}
          />
        </label>
        <label className="us-form-field spoc-contact-card__field">
          <span className="us-form-field__label">
            Phone <span className="spoc-optional">optional</span>
          </span>
          <input
            type="tel"
            className="us-form-field__input"
            placeholder="+1 (555) 000-0000"
            value={value.phone}
            onChange={(e) => onChange({ phone: e.target.value })}
          />
        </label>
        {showRole ? (
          <label className="us-form-field spoc-contact-card__field">
            <span className="us-form-field__label">Role</span>
            <select
              className="us-form-field__input"
              value={role ?? ""}
              onChange={(e) => onChange({ role: e.target.value })}
            >
              <option value="">— Select role —</option>
              {ROLE_OPTIONS.map((r) => (
                <option key={r} value={r}>
                  {r}
                </option>
              ))}
            </select>
          </label>
        ) : null}
      </div>
    </div>
  );
}

type ExtraContact = { id: string } & USSPOCEntry & { role: string };

export function USSPOCPage() {
  const navigate = useNavigate();
  const { usForm, updateUSForm } = useCreateCentre();
  const [extras, setExtras] = useState<ExtraContact[]>([]);
  const [showLabDirector, setShowLabDirector] = useState(true);
  const [showImplCoord, setShowImplCoord] = useState(true);

  function addExtra() {
    setExtras((prev) => [
      ...prev,
      { id: `extra-${Date.now()}`, name: "", email: "", phone: "", role: "" },
    ]);
  }

  function removeExtra(id: string) {
    setExtras((prev) => prev.filter((e) => e.id !== id));
  }

  function updateExtra(id: string, patch: Partial<ExtraContact>) {
    setExtras((prev) => prev.map((e) => (e.id === id ? { ...e, ...patch } : e)));
  }

  function dismissLabDirector() {
    setShowLabDirector(false);
    updateUSForm({ spocLabDirector: { ...EMPTY_CONTACT } });
  }

  function dismissImplCoord() {
    setShowImplCoord(false);
    updateUSForm({ spocImplCoord: { ...EMPTY_CONTACT } });
  }

  const canContinue = !!(usForm.spocOwner.name.trim() && usForm.spocOwner.email.trim());

  return (
    <div className="setup-diagnostic-page">
      <USPageHeader
        title="Contact Details"
        step="7 / 8 Steps"
        backTo="/create-centre/us/integrations"
      />

      <div className="setup-diagnostic-card">
        <h2 className="setup-diagnostic-card__heading">Contact Details</h2>

        <div className="setup-diagnostic-card__body">
          <ContactCard
            label="Authorised Signatory"
            required
            disclaimer="All billing-related consents will be sent to this contact. This contact is mandatory."
            value={usForm.spocOwner}
            onChange={(patch) => updateUSForm({ spocOwner: { ...usForm.spocOwner, ...patch } })}
          />

          {showLabDirector ? (
            <ContactCard
              label="Lab Director"
              value={usForm.spocLabDirector}
              onChange={(patch) =>
                updateUSForm({ spocLabDirector: { ...usForm.spocLabDirector, ...patch } })
              }
              onRemove={dismissLabDirector}
            />
          ) : null}

          {showImplCoord ? (
            <ContactCard
              label="Implementation Coordinator"
              value={usForm.spocImplCoord}
              onChange={(patch) =>
                updateUSForm({ spocImplCoord: { ...usForm.spocImplCoord, ...patch } })
              }
              onRemove={dismissImplCoord}
            />
          ) : null}

          {extras.map((extra, i) => (
            <ContactCard
              key={extra.id}
              label={`Additional Contact ${i + 1}`}
              value={extra}
              role={extra.role}
              showRole
              onChange={(patch) => updateExtra(extra.id, patch)}
              onRemove={() => removeExtra(extra.id)}
            />
          ))}

          <button type="button" className="spoc-add-contact-btn" onClick={addExtra}>
            <svg width="14" height="14" viewBox="0 0 14 14" fill="none" aria-hidden>
              <path
                d="M7 2v10M2 7h10"
                stroke="#4a90e2"
                strokeWidth="1.6"
                strokeLinecap="round"
              />
            </svg>
            Add another contact
            <span className="spoc-optional">optional</span>
          </button>

          <p className="spoc-credentials-note">
            User credentials will be sent over email to the contacts listed on this page.
          </p>

          <p className="spoc-trust-note">
            Used only for onboarding coordination — never shared externally.
          </p>

          <button
            type="button"
            className="setup-diagnostic-continue"
            onClick={() => navigate("/create-centre/us/plan")}
            disabled={!canContinue}
          >
            Confirm &amp; Continue
          </button>
        </div>
      </div>
    </div>
  );
}
