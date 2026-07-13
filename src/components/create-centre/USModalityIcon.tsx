export function USModalityIcon({ modality }: { modality: string }) {
  return (
    <span className="modality-icon" aria-hidden>
      <svg viewBox="0 0 48 48" fill="none" className="modality-icon__svg">
        <rect width="48" height="48" rx="8" fill="#f4f7fa" className="modality-icon__bg" />
        
        {modality === "Hematology" && (
          <>
            <path d="M24 12C24 12 16 20 16 28C16 32.4183 19.5817 36 24 36C28.4183 36 32 32.4183 32 28C32 20 24 12 24 12Z" fill="#ffefef" stroke="#e06666" strokeWidth="2" strokeLinejoin="round"/>
            <path d="M21 26C21 24.5 22 23 23.5 23" stroke="#e06666" strokeWidth="2" strokeLinecap="round"/>
          </>
        )}
        
        {modality === "Blood Chemistry" && (
          <>
            <path d="M20 12H28" stroke="#f6b26b" strokeWidth="2" strokeLinecap="round"/>
            <path d="M22 12V20L16 32C15.5 33 16 35 17.5 35H30.5C32 35 32.5 33 32 32L26 20V12" fill="#fff5e6" stroke="#f6b26b" strokeWidth="2" strokeLinejoin="round"/>
            <path d="M18 28H30" stroke="#f6b26b" strokeWidth="2" strokeLinecap="round"/>
            <circle cx="22" cy="31" r="1.5" fill="#f6b26b" />
            <circle cx="26" cy="30" r="1" fill="#f6b26b" />
          </>
        )}
        
        {modality === "Molecular" && (
          <>
            <path d="M18 14C24 14 24 34 30 34" stroke="#93c47d" strokeWidth="2" strokeLinecap="round"/>
            <path d="M30 14C24 14 24 34 18 34" stroke="#93c47d" strokeWidth="2" strokeLinecap="round"/>
            <line x1="19" y1="18" x2="29" y2="18" stroke="#93c47d" strokeWidth="2" strokeLinecap="round"/>
            <line x1="21" y1="24" x2="27" y2="24" stroke="#93c47d" strokeWidth="2" strokeLinecap="round"/>
            <line x1="19" y1="30" x2="29" y2="30" stroke="#93c47d" strokeWidth="2" strokeLinecap="round"/>
          </>
        )}

        {modality === "Toxicology" && (
          <>
            <rect x="16" y="22" width="16" height="12" rx="2" fill="#e6eaef" stroke="#8e7cc3" strokeWidth="2" strokeLinejoin="round"/>
            <path d="M20 22V16C20 14.5 21 14 24 14C27 14 28 14.5 28 16V22" fill="#f3e8fd" stroke="#8e7cc3" strokeWidth="2" strokeLinejoin="round"/>
            <path d="M22 26V30M20 28H24" stroke="#8e7cc3" strokeWidth="2" strokeLinecap="round"/>
          </>
        )}
        
        {modality === "Radiology" && (
          <>
            {/* Spine & Ribcage */}
            <line x1="24" y1="14" x2="24" y2="34" stroke="#6fa8dc" strokeWidth="2.5" strokeLinecap="round"/>
            <path d="M24 18C20 18 16 20 16 23" stroke="#6fa8dc" strokeWidth="2" strokeLinecap="round"/>
            <path d="M24 18C28 18 32 20 32 23" stroke="#6fa8dc" strokeWidth="2" strokeLinecap="round"/>
            <path d="M24 23C19 23 15 25 15 28" stroke="#6fa8dc" strokeWidth="2" strokeLinecap="round"/>
            <path d="M24 23C29 23 33 25 33 28" stroke="#6fa8dc" strokeWidth="2" strokeLinecap="round"/>
            <path d="M24 28C20 28 17 29.5 17 32" stroke="#6fa8dc" strokeWidth="2" strokeLinecap="round"/>
            <path d="M24 28C28 28 31 29.5 31 32" stroke="#6fa8dc" strokeWidth="2" strokeLinecap="round"/>
          </>
        )}

        {modality === "Anatomical" && (
          <>
            {/* Microscope */}
            <path d="M22 14V22C22 23 23 24 24 24H28" stroke="#c27ba0" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            <rect x="20" y="12" width="4" height="4" rx="1" fill="#fce5ed" stroke="#c27ba0" strokeWidth="2"/>
            <path d="M28 22V26" stroke="#c27ba0" strokeWidth="2" strokeLinecap="round"/>
            <path d="M18 34H30" stroke="#c27ba0" strokeWidth="2" strokeLinecap="round"/>
            <path d="M24 26C20 26 18 28 18 34" stroke="#c27ba0" strokeWidth="2"/>
            <line x1="24" y1="30" x2="30" y2="30" stroke="#c27ba0" strokeWidth="2" strokeLinecap="round"/>
          </>
        )}
      </svg>
    </span>
  );
}
