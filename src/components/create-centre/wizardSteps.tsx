import type { CreateCentreForm, LabType } from "../../data/labs";

export const LAB_TYPES: { value: LabType; label: string; description: string }[] = [
  {
    value: "standalone",
    label: "Standalone Centre",
    description: "Full-service lab operating independently",
  },
  {
    value: "collection",
    label: "Collection Centre",
    description: "Sample collection point linked to a processing lab",
  },
  {
    value: "processing",
    label: "Processing Centre",
    description: "Central lab for test processing and reporting",
  },
];

export const SETUP_TASKS = [
  { num: 1, title: "Add Tests & Packages", desc: "Configure tests available at this centre" },
  { num: 2, title: "Set up Pricing & Discounts", desc: "Define rates and discount rules" },
  { num: 3, title: "Add Staff & Roles", desc: "Invite team members and assign roles" },
  { num: 4, title: "Configure Report Templates", desc: "Choose layouts for patient reports" },
];

export const TEST_OPTIONS = [
  { title: "Add Individual Tests", desc: "Pick tests one by one from the master list" },
  { title: "Add Test Packages", desc: "Bundle tests into health packages" },
  { title: "Import from Excel", desc: "Bulk upload tests via spreadsheet" },
];

export const REPORT_TEMPLATES = ["Classic", "Modern", "Compact", "Bilingual"];

export const STEP_TITLES: Record<string, string> = {
  type: "Select Your Laboratory Type",
  "centre-details": "Centre Details",
  "lab-details": "Add Lab Details",
  success: "Centre Created Successfully!",
  "setup-checklist": "Set up your laboratory",
  tests: "Add Tests & Packages",
  pricing: "Pricing & Discounts",
  staff: "Staff & Roles",
  reports: "Report Templates",
  finish: "All Set!",
};

export function LabTypeStep({
  value,
  onChange,
}: {
  value: LabType;
  onChange: (v: LabType) => void;
}) {
  return (
    <div className="create-options">
      {LAB_TYPES.map((opt) => (
        <label
          key={opt.value}
          className={`create-option${value === opt.value ? " create-option--selected" : ""}`}
        >
          <input
            type="radio"
            name="labType"
            value={opt.value}
            checked={value === opt.value}
            onChange={() => onChange(opt.value)}
          />
          <span className="create-option__radio" />
          <span className="create-option__text">
            <strong>{opt.label}</strong>
            <span>{opt.description}</span>
          </span>
        </label>
      ))}
    </div>
  );
}

export function CentreDetailsStep({
  form,
  onChange,
}: {
  form: CreateCentreForm;
  onChange: (p: Partial<CreateCentreForm>) => void;
}) {
  return (
    <div className="create-form">
      <label className="create-field">
        <span>Name</span>
        <input
          value={form.name}
          onChange={(e) => onChange({ name: e.target.value })}
          placeholder="Centre name"
        />
      </label>
      <div className="create-form__row">
        <label className="create-field">
          <span>Phone</span>
          <input
            value={form.phone}
            onChange={(e) => onChange({ phone: e.target.value })}
            placeholder="Contact number"
          />
        </label>
        <label className="create-field">
          <span>Email</span>
          <input
            type="email"
            value={form.email}
            onChange={(e) => onChange({ email: e.target.value })}
            placeholder="Email address"
          />
        </label>
      </div>
      <label className="create-field">
        <span>Address</span>
        <textarea
          value={form.address}
          onChange={(e) => onChange({ address: e.target.value })}
          placeholder="Street address"
          rows={2}
        />
      </label>
      <div className="create-form__row create-form__row--3">
        <label className="create-field">
          <span>Pincode</span>
          <input
            value={form.pincode}
            onChange={(e) => onChange({ pincode: e.target.value })}
            placeholder="Pincode"
          />
        </label>
        <label className="create-field">
          <span>City</span>
          <select value={form.city} onChange={(e) => onChange({ city: e.target.value })}>
            <option value="">Select city</option>
            <option value="Hyderabad">Hyderabad</option>
            <option value="Bangalore">Bangalore</option>
            <option value="Mumbai">Mumbai</option>
            <option value="Delhi">Delhi</option>
          </select>
        </label>
        <label className="create-field">
          <span>State</span>
          <select value={form.state} onChange={(e) => onChange({ state: e.target.value })}>
            <option value="">Select state</option>
            <option value="Telangana">Telangana</option>
            <option value="Karnataka">Karnataka</option>
            <option value="Maharashtra">Maharashtra</option>
            <option value="Delhi">Delhi</option>
          </select>
        </label>
      </div>
    </div>
  );
}

export function LabDetailsStep({
  form,
  onChange,
}: {
  form: CreateCentreForm;
  onChange: (p: Partial<CreateCentreForm>) => void;
}) {
  return (
    <div className="create-form">
      <p className="create-hint">You can skip this for now and add it later</p>
      <label className="create-field">
        <span>GST Number</span>
        <input
          value={form.gstNumber}
          onChange={(e) => onChange({ gstNumber: e.target.value })}
          placeholder="Optional"
        />
      </label>
      <label className="create-field">
        <span>PAN Number</span>
        <input
          value={form.panNumber}
          onChange={(e) => onChange({ panNumber: e.target.value })}
          placeholder="Optional"
        />
      </label>
    </div>
  );
}

export function SuccessStep({ centreName }: { centreName: string }) {
  return (
    <div className="create-success">
      <div className="create-success__icon">✓</div>
      <p className="create-success__title">Centre Created Successfully!</p>
      <p className="create-success__sub">
        <strong>{centreName || "Your centre"}</strong> has been created. You can now start
        adding tests and packages.
      </p>
    </div>
  );
}

export function SetupChecklistStep() {
  return (
    <ul className="setup-tasks">
      {SETUP_TASKS.map((t) => (
        <li key={t.num} className="setup-task">
          <span className="setup-task__num">{t.num}</span>
          <span>
            <strong>{t.title}</strong>
            <span>{t.desc}</span>
          </span>
        </li>
      ))}
    </ul>
  );
}

export function TestsStep() {
  return (
    <div className="create-cards">
      {TEST_OPTIONS.map((opt) => (
        <button key={opt.title} type="button" className="create-card">
          <strong>{opt.title}</strong>
          <span>{opt.desc}</span>
        </button>
      ))}
    </div>
  );
}

export function PricingStep() {
  return (
    <div className="create-form">
      <label className="create-field">
        <span>Default test price (INR)</span>
        <input type="number" defaultValue={0} min={0} />
      </label>
      <label className="create-field">
        <span>Discount (%)</span>
        <input type="number" defaultValue={0} min={0} max={100} />
      </label>
      <p className="create-hint">Pricing can be adjusted per test after import.</p>
    </div>
  );
}

export function StaffStep() {
  return (
    <div className="create-form">
      <div className="create-form__row">
        <label className="create-field">
          <span>Name</span>
          <input placeholder="Staff name" />
        </label>
        <label className="create-field">
          <span>Email / Phone</span>
          <input placeholder="Contact" />
        </label>
      </div>
      <label className="create-field">
        <span>Role</span>
        <select defaultValue="admin">
          <option value="admin">Admin</option>
          <option value="pathologist">Pathologist</option>
          <option value="technician">Technician</option>
        </select>
      </label>
    </div>
  );
}

export function ReportsStep() {
  return (
    <div className="template-grid">
      {REPORT_TEMPLATES.map((name) => (
        <button key={name} type="button" className="template-card">
          <div className="template-card__preview" />
          <span>{name}</span>
        </button>
      ))}
    </div>
  );
}

export function FinishStep({ centreName }: { centreName: string }) {
  return (
    <div className="create-success">
      <div className="create-success__icon">✓</div>
      <p className="create-success__title">All Set!</p>
      <p className="create-success__sub">
        {centreName || "Your centre"} is ready. You can continue configuring from the
        centre dashboard.
      </p>
    </div>
  );
}
