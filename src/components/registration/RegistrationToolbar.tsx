import { useState } from "react";
import { useParams } from "react-router-dom";
import { RegistrationSettingsModal } from "./RegistrationSettingsModal";
import { UploadPatientIdProofModal } from "./UploadPatientIdProofModal";

export function RegistrationToolbar() {
  const { id } = useParams<{ id: string }>();
  const labId = Number(id);
  const [idProofModalOpen, setIdProofModalOpen] = useState(false);
  const [settingsModalOpen, setSettingsModalOpen] = useState(false);

  return (
    <div className="reg-toolbar">
      <div className="reg-toolbar__search-wrap">
        <span className="reg-toolbar__search-icon" aria-hidden>
          <svg viewBox="0 0 16 16" width="15" height="15" fill="none">
            <circle cx="7" cy="7" r="4.5" stroke="currentColor" strokeWidth="1.3" />
            <path d="M10.5 10.5L14 14" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" />
          </svg>
        </span>
        <input
          type="search"
          className="reg-toolbar__search"
          placeholder="Search By Name, Phone, National Id, MRN, DOB(DDMMYYYY)"
          aria-label="Search patients"
        />
        <button type="button" className="reg-toolbar__filter" aria-label="Filter search">
          <svg viewBox="0 0 16 16" width="14" height="14" fill="none" aria-hidden>
            <path d="M2 4h12M4 8h8M6 12h4" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" />
          </svg>
        </button>
      </div>

      <div className="reg-toolbar__actions">
        <button
          type="button"
          className="reg-toolbar__btn reg-toolbar__btn--outline"
          onClick={() => setIdProofModalOpen(true)}
        >
          Upload ID Proof
        </button>
        <button type="button" className="reg-toolbar__btn reg-toolbar__btn--ai">
          <span className="reg-toolbar__ai-icon" aria-hidden>
            <svg viewBox="0 0 16 16" width="14" height="14" fill="none">
              <rect x="3" y="5" width="10" height="8" rx="2" stroke="currentColor" strokeWidth="1.2" />
              <circle cx="6" cy="9" r="1" fill="currentColor" />
              <circle cx="10" cy="9" r="1" fill="currentColor" />
              <path d="M8 2v2M5 3l1 1.5M11 3l-1 1.5" stroke="currentColor" strokeWidth="1.1" strokeLinecap="round" />
            </svg>
          </span>
          AI Order from TRF
        </button>
        <button type="button" className="reg-toolbar__btn reg-toolbar__btn--ghost">
          Calculate Price
        </button>
        <button type="button" className="reg-toolbar__btn reg-toolbar__btn--ghost reg-toolbar__btn--dropdown">
          Bulk Registration
          <svg viewBox="0 0 12 8" width="9" height="6" fill="none" aria-hidden>
            <path
              d="M1.5 1.5L6 6l4.5-4.5"
              stroke="currentColor"
              strokeWidth="1.3"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </button>
        <button
          type="button"
          className="reg-toolbar__settings"
          aria-label="Registration settings"
          onClick={() => setSettingsModalOpen(true)}
        >
          <svg viewBox="0 0 16 16" width="16" height="16" fill="none" aria-hidden>
            <path
              d="M8 10a2 2 0 100-4 2 2 0 000 4z"
              stroke="currentColor"
              strokeWidth="1.2"
            />
            <path
              d="M13.1 9.4a1.1 1.1 0 00.22 1.22l.04.04a1.35 1.35 0 01-1.9 1.9l-.04-.04a1.1 1.1 0 00-1.22-.22 1.1 1.1 0 00-.68 1.01v.11a1.35 1.35 0 01-2.7 0v-.12a1.1 1.1 0 00-.72-1.01 1.1 1.1 0 00-1.22.22l-.04.04a1.35 1.35 0 01-1.9-1.9l.04-.04a1.1 1.1 0 00.22-1.22 1.1 1.1 0 00-1.01-.68H2.35a1.35 1.35 0 010-2.7h.12a1.1 1.1 0 001.01-.72 1.1 1.1 0 00-.22-1.22l-.04-.04a1.35 1.35 0 011.9-1.9l.04.04a1.1 1.1 0 001.22.22h.05a1.1 1.1 0 001.01-.72V2.35a1.35 1.35 0 012.7 0v.12a1.1 1.1 0 001.01.72 1.1 1.1 0 001.22-.22l.04-.04a1.35 1.35 0 011.9 1.9l-.04.04a1.1 1.1 0 00-.22 1.22v.05a1.1 1.1 0 00.68 1.01h.12a1.35 1.35 0 010 2.7h-.12a1.1 1.1 0 00-1.01.68z"
              stroke="currentColor"
              strokeWidth="1.1"
              strokeLinejoin="round"
            />
          </svg>
        </button>
      </div>

      <UploadPatientIdProofModal
        labId={labId}
        open={idProofModalOpen}
        onClose={() => setIdProofModalOpen(false)}
      />
      <RegistrationSettingsModal
        open={settingsModalOpen}
        onClose={() => setSettingsModalOpen(false)}
      />
    </div>
  );
}
