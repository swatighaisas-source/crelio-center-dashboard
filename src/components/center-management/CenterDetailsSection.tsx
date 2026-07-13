import { useState, type ReactNode } from "react";
import type { LabDetail } from "../../data/labDetails";
import { ScannerConfigurationCard } from "./ScannerConfigurationCard";
import "../../styles/center-details.css";

interface Props {
  lab: LabDetail;
  labId: number;
}

function EditButton({ label = "Edit" }: { label?: string }) {
  return (
    <button type="button" className="cd-edit-btn">
      {label}
    </button>
  );
}

function CardHeader({
  icon,
  title,
  action,
}: {
  icon: ReactNode;
  title: string;
  action?: ReactNode;
}) {
  return (
    <div className="cd-card__header">
      <div className="cd-card__header-title">
        <span className="cd-card__header-icon" aria-hidden>
          {icon}
        </span>
        <h3 className="cd-card__title">{title}</h3>
      </div>
      {action}
    </div>
  );
}

function DetailRow({
  label,
  value,
  valueClassName = "",
}: {
  label: string;
  value: ReactNode;
  valueClassName?: string;
}) {
  return (
    <div className="cd-detail-row">
      <span className="cd-detail-row__label">{label}</span>
      <span className={`cd-detail-row__value${valueClassName ? ` ${valueClassName}` : ""}`}>{value}</span>
    </div>
  );
}

function BuildingIcon() {
  return (
    <svg viewBox="0 0 16 16" width="16" height="16" fill="none" aria-hidden>
      <path
        d="M2 14V4l6-3 6 3v10H2Z"
        stroke="currentColor"
        strokeWidth="1.2"
        strokeLinejoin="round"
      />
      <path d="M6 14v-4h4v4" stroke="currentColor" strokeWidth="1.2" />
    </svg>
  );
}

function ClockIcon() {
  return (
    <svg viewBox="0 0 16 16" width="16" height="16" fill="none" aria-hidden>
      <circle cx="8" cy="8" r="6" stroke="currentColor" strokeWidth="1.2" />
      <path d="M8 5v3l2 1.5" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" />
    </svg>
  );
}

function BankIcon() {
  return (
    <svg viewBox="0 0 16 16" width="16" height="16" fill="none" aria-hidden>
      <path
        d="M2 6 8 4l6 2M3 7v5h10V7"
        stroke="currentColor"
        strokeWidth="1.2"
        strokeLinejoin="round"
      />
      <path d="M6 12V9M10 12V9" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" />
    </svg>
  );
}

function CopyIcon() {
  return (
    <svg viewBox="0 0 14 14" width="14" height="14" fill="none" aria-hidden>
      <rect x="4" y="4" width="8" height="8" rx="1" stroke="currentColor" strokeWidth="1.1" />
      <path d="M3 10V3a1 1 0 0 1 1-1h7" stroke="currentColor" strokeWidth="1.1" />
    </svg>
  );
}

function InfoIcon() {
  return (
    <svg viewBox="0 0 14 14" width="14" height="14" fill="none" aria-hidden>
      <circle cx="7" cy="7" r="6" stroke="currentColor" strokeWidth="1.1" />
      <path d="M7 6.2V10M7 4.5h.01" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" />
    </svg>
  );
}

function BellIcon() {
  return (
    <svg viewBox="0 0 16 16" width="16" height="16" fill="none" aria-hidden>
      <path
        d="M4 6.5a4 4 0 0 1 8 0v3l1.5 2H2.5L4 9.5V6.5Z"
        stroke="currentColor"
        strokeWidth="1.2"
        strokeLinejoin="round"
      />
      <path d="M6.5 13a1.5 1.5 0 0 0 3 0" stroke="currentColor" strokeWidth="1.2" />
    </svg>
  );
}

export function CenterDetailsSection({ lab, labId }: Props) {
  const [alertVisible, setAlertVisible] = useState(true);
  const [tatEnabled, setTatEnabled] = useState(true);

  const accountManager = lab.accountManager ?? "Husain";
  const reportSharingKey = "1f72b258-f59c-5a8e-4b2c-9d1e-6f7a8b5c4d3";
  const centreName = "Husain dummy lab";
  const abbreviation = lab.labAbbreviation?.toLowerCase() ?? "hudu";
  return (
    <div className="cd-page">
      <div className="cd-account-bar">
        <div className="cd-account-bar__row">
          <div className="cd-account-bar__item">
            <span className="cd-account-bar__label">Centre Account Id :</span>
            <span className="cd-account-bar__value">{lab.id}</span>
          </div>
          <div className="cd-account-bar__item">
            <span className="cd-account-bar__label">Account Manager :</span>
            <span className="cd-account-bar__value">{accountManager}</span>
          </div>
          <div className="cd-account-bar__item cd-account-bar__item--key">
            <span className="cd-account-bar__label">Report Sharing Key :</span>
            <span className="cd-account-bar__value cd-account-bar__value--truncate">{reportSharingKey}</span>
            <button type="button" className="cd-copy-btn" aria-label="Copy report sharing key">
              <CopyIcon />
            </button>
          </div>
        </div>
        <div className="cd-account-bar__row">
          <div className="cd-account-bar__item">
            <span className="cd-account-bar__label">Account Abbreviation :</span>
            <span className="cd-account-bar__value">{abbreviation}</span>
          </div>
          <div className="cd-account-bar__item">
            <span className="cd-account-bar__label">Center Live Date :</span>
            <span className="cd-account-bar__value">-</span>
          </div>
        </div>
      </div>

      {alertVisible && (
        <div className="cd-alert" role="status">
          <span className="cd-alert__bell">
            <BellIcon />
            <span className="cd-alert__dot" aria-hidden />
          </span>
          <p className="cd-alert__text">
            Update your centre details correctly, as they will reflect on patients&apos; login, mobile
            app, and WhatsApp/SMS communication.
          </p>
          <button
            type="button"
            className="cd-alert__close"
            onClick={() => setAlertVisible(false)}
            aria-label="Dismiss"
          >
            ×
          </button>
        </div>
      )}

      <div className="cd-page-body">
      <div className="cd-grid">
        <div className="cd-col cd-col--left">
          <section className="cd-card">
            <CardHeader icon={<BuildingIcon />} title="Centre Details" action={<EditButton />} />
            <h4 className="cd-centre-name">{centreName}</h4>
            <div className="cd-details-list">
              <DetailRow label="Centre Reg. ID :" value="Not updated" valueClassName="cd-detail-row__value--error" />
              <DetailRow label="Centre Mailing Address :" value="Pune, Maharashtra, India" />
              <DetailRow label="City :" value="Pune" />
              <DetailRow label="Zipcode :" value="0" />
              <DetailRow label="Centre Email :" value="husain@livehealth.in" />
              <DetailRow label="Centre Contact :" value="8087443919" />
              <DetailRow label="Website Link :" value="Not updated" valueClassName="cd-detail-row__value--error" />
              <DetailRow label="Timezone :" value="Asia/Kolkata" />
              <DetailRow label="Your Lab Intro/Slogan :" value="-" />
              <DetailRow label="No of Employees :" value="6" />
            </div>
          </section>

          <section className="cd-card">
            <CardHeader icon={<ClockIcon />} title="Lab Timings" action={<EditButton />} />
            <p className="cd-timings-today">
              <span className="cd-timings-today__label">Today&apos;s timing :</span>{" "}
              <strong>08:00 am To 08:00 pm</strong>
            </p>
            <div className="cd-tat-row">
              <span className="cd-tat-row__label">Calculate TAT based on lab working hours</span>
              <button type="button" className="cd-info-btn" aria-label="More information">
                <InfoIcon />
              </button>
              <button
                type="button"
                role="switch"
                aria-checked={tatEnabled}
                className={`cd-toggle${tatEnabled ? " cd-toggle--on" : ""}`}
                onClick={() => setTatEnabled((v) => !v)}
              >
                <span className="cd-toggle__thumb" />
              </button>
            </div>
          </section>
        </div>

        <div className="cd-col cd-col--middle">
          <section className="cd-preview-block">
            <div className="cd-preview-block__head">
              <h3 className="cd-preview-block__title cd-preview-block__title--green">Patient login preview</h3>
              <EditButton />
            </div>
            <p className="cd-preview-block__desc">
              Your lab branding, mailing address and lab timings are shown to patients on their login
            </p>
            <div className="cd-preview-card cd-preview-card--login">
              <div className="cd-preview-logo">Centre Logo</div>
              <p className="cd-preview-card__name">{centreName}</p>
              <p className="cd-preview-card__sub">Pune, Maharashtra, India</p>
            </div>
          </section>

          <section className="cd-preview-block">
            <h3 className="cd-preview-block__title cd-preview-block__title--green">Sample packages</h3>
            <p className="cd-preview-block__desc">
              Your logo will be displayed on packages you offer to patients
            </p>
            <div className="cd-preview-packages">
              <div className="cd-preview-packages__image" role="img" aria-label="Sample package preview" />
              <div className="cd-preview-packages__logo">Centre Logo</div>
            </div>
          </section>

          <section className="cd-preview-block">
            <h3 className="cd-preview-block__title cd-preview-block__title--green">Whatsapp preview</h3>
            <p className="cd-preview-block__desc">
              About Your Business will be shown in welcome message to patient on WhatsApp
            </p>
            <div className="cd-preview-whatsapp">
              <p>
                Hi Devyani, You are registered at <strong>{centreName}</strong>, -
              </p>
              <ul>
                <li>📈 track lab results</li>
                <li>📁 organise records</li>
                <li>💳 pay medical bills.</li>
              </ul>
              <p className="cd-preview-whatsapp__footer">
                You can stay connected with your diagnostic lab 🏥 via our mobile app 📲 powered by
                livehealth.in. Livehealth helps you stay connected to your labs
              </p>
            </div>
          </section>
        </div>

        <div className="cd-col cd-col--right">
          <section className="cd-card cd-card--compact">
            <CardHeader icon={<BankIcon />} title="Bank Details" action={<EditButton />} />
            <div className="cd-details-list cd-details-list--compact">
              <DetailRow label="Bank Name :" value="Not updated" valueClassName="cd-detail-row__value--error" />
              <DetailRow label="Type :" value="Not updated" valueClassName="cd-detail-row__value--error" />
              <DetailRow label="Account No :" value="Not updated" valueClassName="cd-detail-row__value--error" />
              <DetailRow label="IFSC Code :" value="Not updated" valueClassName="cd-detail-row__value--error" />
              <DetailRow label="UPI ID :" value="Not updated" valueClassName="cd-detail-row__value--error" />
              <DetailRow label="Account payment notes :" value="Not updated" valueClassName="cd-detail-row__value--error" />
              <DetailRow label="Currency :" value="₹" />
              <DetailRow label="ISO Code :" value="IN" />
              <DetailRow label="Country Code :" value="91" />
            </div>
          </section>

          <section className="cd-card cd-card--compact">
            <h3 className="cd-card__title cd-card__title--solo">Bank Account Configuration</h3>
            <div className="cd-phonepe-row">
              <span className="cd-phonepe-logo">PhonePe</span>
              <span className="cd-phonepe-label">PhonePe Account</span>
              <button type="button" className="cd-outline-btn cd-outline-btn--sm">
                Complete Setup
              </button>
            </div>
          </section>

          <section className="cd-card cd-card--compact">
            <h3 className="cd-card__title cd-card__title--solo">Shipping Partners</h3>
            <select className="cd-select" defaultValue="" aria-label="Select shipping partner">
              <option value="" disabled>
                Select shipping partner
              </option>
            </select>
            <button type="button" className="cd-outline-btn cd-outline-btn--full">
              Add Shipping Partner
            </button>
          </section>

          <section className="cd-card cd-card--compact">
            <h3 className="cd-card__title cd-card__title--solo">Swipe Machines</h3>
            <button type="button" className="cd-link-btn">
              Add New Device
            </button>
          </section>

          <section className="cd-card cd-card--compact">
            <h3 className="cd-card__title cd-card__title--solo">Select Insurance Vendor</h3>
            <button type="button" className="cd-outline-btn cd-outline-btn--full">
              Add Insurance Vendor
            </button>
          </section>

          <section className="cd-card cd-card--compact">
            <h3 className="cd-card__title cd-card__title--solo">FAX Configuration</h3>
            <select className="cd-select" defaultValue="" aria-label="Select FAX provider">
              <option value="" disabled>
                Select FAX provider
              </option>
            </select>
            <button type="button" className="cd-outline-btn cd-outline-btn--full">
              Add FAX provider
            </button>
          </section>

          <ScannerConfigurationCard labId={labId} />

          <section className="cd-card cd-card--compact">
            <CardHeader
              icon={
                <svg viewBox="0 0 16 16" width="16" height="16" fill="none" aria-hidden>
                  <circle cx="6" cy="5" r="2.5" stroke="currentColor" strokeWidth="1.1" />
                  <path
                    d="M2 13c0-2.2 1.8-4 4-4s4 1.8 4 4"
                    stroke="currentColor"
                    strokeWidth="1.1"
                  />
                  <path d="M11 6v4M9 8h4" stroke="currentColor" strokeWidth="1.1" strokeLinecap="round" />
                </svg>
              }
              title="Main Contacts"
              action={<EditButton />}
            />
            <div className="cd-contacts-list">
              <span>Admin</span>
              <span>Finance Head</span>
              <span>Operations Head</span>
            </div>
          </section>
        </div>
      </div>
      </div>
    </div>
  );
}
