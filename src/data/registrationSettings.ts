export type RegistrationSettingsTabId =
  | "quick"
  | "display"
  | "advance"
  | "lab-forms"
  | "pick-list";

export interface RegistrationSettingsTab {
  id: RegistrationSettingsTabId;
  label: string;
}

export interface RegistrationSettingsCheckbox {
  id: string;
  label: string;
  checked: boolean;
  children?: RegistrationSettingsCheckbox[];
}

export const REGISTRATION_SETTINGS_TABS: RegistrationSettingsTab[] = [
  { id: "quick", label: "Quick Settings" },
  { id: "display", label: "Display Fields" },
  { id: "advance", label: "Advance Settings" },
  { id: "lab-forms", label: "Lab Forms" },
  { id: "pick-list", label: "Pick List" },
];

export const REGISTRATION_PAGES = ["Default Registration Page"] as const;

export const ADVANCE_SETTINGS_LEFT: RegistrationSettingsCheckbox[] = [
  { id: "bill-confirmation", label: "Bill Confirmation Page", checked: true },
  { id: "bill-consent", label: "Bill Consent", checked: false },
  { id: "add-org-link", label: "Show Add Organization Link", checked: true },
  { id: "show-tat", label: "Show TAT", checked: false },
  { id: "restrict-duplicate-order", label: "Restrict duplicate order No", checked: false },
  { id: "restrict-patient-update", label: "Restrict Patient Update", checked: false },
  { id: "search-accession", label: "Search Accession Number", checked: false },
  { id: "test-quantity", label: "Test Quantity Option", checked: true },
  {
    id: "strict-check",
    label: "Strict check",
    checked: false,
    children: [
      { id: "strict-check-all", label: "Strict check for all updates", checked: false },
    ],
  },
  { id: "national-registry", label: "National Registry", checked: false },
  { id: "show-dob-search", label: "Show DOB on search", checked: false },
  { id: "bill-wise-accession", label: "Bill Wise Accession View", checked: false },
  { id: "auto-capitalise", label: "Auto Capitalise Patient Name", checked: false },
  { id: "hide-consulting-doctor", label: "Hide Consulting Doctor", checked: false },
  { id: "hide-medical-history", label: "Hide Patient Medical History", checked: false },
  {
    id: "patient-copay",
    label: "Patient Copay or Payable Amount Mandatory",
    checked: true,
  },
  {
    id: "restrict-duplicate-mrn",
    label: "Restrict Duplicate Patient Id (MRN) - Organisation Wise",
    checked: false,
    children: [
      { id: "past-order-suggestion", label: "Show suggestion from past orders", checked: false },
      { id: "bill-icd-mandatory", label: "Bill ICD Code Mandatory", checked: false },
      { id: "test-icd-mandatory", label: "Test ICD Code Mandatory", checked: false },
      { id: "icd-matrix", label: "ICD Matrix Selection", checked: false },
      { id: "show-modifiers", label: "Show Modifiers", checked: false },
      {
        id: "icd-bill-sources",
        label: "ICD Code Mandatory based on Bill Sources",
        checked: false,
      },
    ],
  },
  { id: "show-bill-source", label: "Show Bill Source", checked: true },
  { id: "insurance-form", label: "Configure Insurance Form Details", checked: false },
  { id: "capture-fingerprint", label: "Capture Fingerprint", checked: false },
];

export const ADVANCE_SETTINGS_RIGHT: RegistrationSettingsCheckbox[] = [
  { id: "rtl-typeahead", label: "RTL Typeahead (Right to Left)", checked: false },
  { id: "add-doc-link", label: "Show Add Doc Link", checked: true },
  { id: "price-list-default", label: "Price List with Default Test", checked: true },
  { id: "restrict-name-search", label: "Restrict Patient Name search", checked: false },
  { id: "whatsapp-default", label: "Send WhatsApp Option Default ON", checked: false },
  {
    id: "search-test-name-code",
    label: "Search Test by Test Name and Test Code",
    checked: false,
  },
  { id: "tds-calculation", label: "TDS calculation", checked: false },
  { id: "collection-type", label: "Collection Type", checked: false },
  { id: "sample-date-compulsory", label: "Sample Date Compulsory", checked: false },
  {
    id: "restrict-autofill",
    label: "Restrict auto-fill to Referral, Organisation & Branch",
    checked: false,
  },
  {
    id: "test-suggestion-past",
    label: "Show test suggestion from past orders",
    checked: false,
  },
  { id: "google-places", label: "Google Places Search", checked: true },
  { id: "enable-insurance", label: "Enable Insurance Addition", checked: true },
  { id: "hide-other-info", label: "Hide Other Information Panel", checked: false },
  {
    id: "notify-lab-admin",
    label: "Notify lab admin after Add test to Bill",
    checked: false,
  },
  { id: "icd-while-booking", label: "Enable ICD Code while booking", checked: false },
  {
    id: "bulk-registration",
    label: "Enable Bulk Registration - Multi sample support",
    checked: true,
  },
  { id: "order-via-trf", label: "Order via TRF", checked: true },
  { id: "add-shared-referral", label: "Add Shared Referral", checked: true },
];

import type { AoeCaptureFrequency } from "./aoeTypes";
import { AOE_CAPTURE_FREQUENCY_OPTIONS, DEFAULT_AOE_CAPTURE_FREQUENCY } from "./aoeTypes";

export { AOE_CAPTURE_FREQUENCY_OPTIONS, DEFAULT_AOE_CAPTURE_FREQUENCY };
export type { AoeCaptureFrequency };

export const REGISTRATION_VERSION_OPTIONS = ["Version 4", "Version 5 (Latest)"] as const;
export const APPOINTMENT_VERSION_OPTIONS = ["Version 1", "Version 2"] as const;
export const REGISTRATION_LAYOUT_OPTIONS = ["Default Form", "US Standard Form"] as const;

export const DISCOUNT_LIST_OPTIONS = ["Time Based Discount"] as const;

export const AGE_DISCOUNT_PRESETS = [
  { id: "10-20", range: "10-20 yrs", discount: "dicount123" },
] as const;
