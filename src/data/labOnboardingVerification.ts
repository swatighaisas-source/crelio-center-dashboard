export type VerificationItemId = "test-menu" | "instrument-mappings" | "report-format";

export interface VerificationItem {
  id: VerificationItemId;
  label: string;
  description: string;
}

export const VERIFICATION_ITEMS: VerificationItem[] = [
  {
    id: "test-menu",
    label: "Test Menu",
    description: "Validate that all tests and test panels are correctly configured.",
  },
  {
    id: "instrument-mappings",
    label: "Instrument Mappings",
    description: "Confirm all instruments are mapped with the correct parameters and result ranges.",
  },
  {
    id: "report-format",
    label: "Report Format PDF",
    description: "Review and approve the final report template PDF before go-live.",
  },
];

export type VerificationState = Record<VerificationItemId, boolean>;

export const EMPTY_VERIFICATION_STATE: VerificationState = {
  "test-menu": false,
  "instrument-mappings": false,
  "report-format": false,
};
