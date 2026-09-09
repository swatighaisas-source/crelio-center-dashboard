import { useMemo, useState } from "react";
import {
  getAoeRowsForTab,
  mockConsentHistoryRows,
  mockPatientInfoHistoryRows,
  type AoeHistoryTab,
} from "../../data/labFormsHistory";

type LabFormsHistorySection = "consent-history" | "aoe-history" | "patient-info-history";

interface Props {
  section: string;
}

const AOE_TABS: { id: AoeHistoryTab; label: string }[] = [
  { id: "bill", label: "Bill AOE" },
  { id: "test", label: "Test AOE" },
  { id: "promotion", label: "Promotion AOE" },
  { id: "store", label: "Store AOE" },
];

const AOE_COLUMNS = [
  "Patient ID",
  "Patient Full Name",
  "Patient DOB",
  "Bill ID",
  "Test ID",
  "Test Name",
] as const;

const CONSENT_COLUMNS = [
  "Patient ID",
  "Patient Full Name",
  "Bill ID",
  "Consent Form",
  "Signed On",
] as const;

const PATIENT_INFO_COLUMNS = [
  "Patient ID",
  "Patient Full Name",
  "Bill ID",
  "Field Label",
  "Field Value",
] as const;

function FilterIcon() {
  return (
    <span className="filter-icon" aria-hidden>
      ▼
    </span>
  );
}

function HistoryToolbar() {
  return (
    <div className="lab-forms-history__toolbar">
      <label className="lab-forms-history__branches">
        <span className="visually-hidden">Select Branches</span>
        <select defaultValue="selected" aria-label="Select Branches">
          <option value="selected">Select Branches: 71 Selected</option>
          <option value="all">All Branches</option>
        </select>
      </label>
      <button type="button" className="lab-forms-history__export">
        Export Values
      </button>
      <div className="lab-forms-history__date">
        <span>2nd Sep, 2026 - 2nd Sep, 2026</span>
        <span aria-hidden>▣</span>
      </div>
    </div>
  );
}

function AoeHistoryContent() {
  const [activeTab, setActiveTab] = useState<AoeHistoryTab>("test");
  const rows = useMemo(() => getAoeRowsForTab(activeTab), [activeTab]);

  return (
    <>
      <div className="page-toolbar lab-forms-history__tabs">
        <div className="tabs" role="tablist" aria-label="AOE type">
          {AOE_TABS.map((tab) => (
            <button
              key={tab.id}
              type="button"
              role="tab"
              className={`tab${activeTab === tab.id ? " active" : ""}`}
              aria-selected={activeTab === tab.id}
              onClick={() => setActiveTab(tab.id)}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      <div className="table-card">
        <div className="rows-count">Rows: {rows.length}</div>
        <table>
          <thead>
            <tr>
              {AOE_COLUMNS.map((column) => (
                <th key={column}>
                  <span>{column}</span>
                  <FilterIcon />
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {rows.map((row) => (
              <tr key={row.id}>
                <td>{row.patientId}</td>
                <td>{row.patientFullName}</td>
                <td>{row.patientDob || ""}</td>
                <td>{row.billId}</td>
                <td>{row.testId}</td>
                <td>{row.testName}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </>
  );
}

function ConsentHistoryContent() {
  return (
    <div className="table-card">
      <div className="rows-count">Rows: {mockConsentHistoryRows.length}</div>
      <table>
        <thead>
          <tr>
            {CONSENT_COLUMNS.map((column) => (
              <th key={column}>
                <span>{column}</span>
                <FilterIcon />
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {mockConsentHistoryRows.map((row) => (
            <tr key={row.id}>
              <td>{row.patientId}</td>
              <td>{row.patientFullName}</td>
              <td>{row.billId}</td>
              <td>{row.consentForm}</td>
              <td>{row.signedOn}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

function PatientInfoHistoryContent() {
  return (
    <div className="table-card">
      <div className="rows-count">Rows: {mockPatientInfoHistoryRows.length}</div>
      <table>
        <thead>
          <tr>
            {PATIENT_INFO_COLUMNS.map((column) => (
              <th key={column}>
                <span>{column}</span>
                <FilterIcon />
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {mockPatientInfoHistoryRows.map((row) => (
            <tr key={row.id}>
              <td>{row.patientId}</td>
              <td>{row.patientFullName}</td>
              <td>{row.billId}</td>
              <td>{row.fieldLabel}</td>
              <td>{row.fieldValue}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

function resolveSubSection(section: string): LabFormsHistorySection {
  const normalized = section.replace(/^lab-forms-history\/?/, "");
  if (normalized === "aoe-history") return "aoe-history";
  if (normalized === "patient-info-history") return "patient-info-history";
  return "consent-history";
}

export function LabFormsHistoryPage({ section }: Props) {
  const subSection = resolveSubSection(section);

  return (
    <section className="lab-forms-history">
      <HistoryToolbar />
      {subSection === "aoe-history" ? <AoeHistoryContent /> : null}
      {subSection === "consent-history" ? <ConsentHistoryContent /> : null}
      {subSection === "patient-info-history" ? <PatientInfoHistoryContent /> : null}
    </section>
  );
}
