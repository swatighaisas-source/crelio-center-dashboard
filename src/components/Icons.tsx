export function CheckLogoIcon() {
  return (
    <svg className="logo__icon" viewBox="0 0 24 24" fill="none" aria-hidden>
      <circle cx="12" cy="12" r="11" fill="#52c41a" />
      <path
        d="M7 12.5l3 3 7-7"
        stroke="#fff"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export function ChevronDownIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 10 10" fill="currentColor" aria-hidden>
      <path d="M2 3.5L5 6.5L8 3.5" stroke="currentColor" strokeWidth="1.2" fill="none" />
    </svg>
  );
}

export function SearchIcon() {
  return (
    <svg className="search-box__icon" viewBox="0 0 16 16" fill="none" aria-hidden>
      <circle cx="7" cy="7" r="4.5" stroke="currentColor" strokeWidth="1.2" />
      <path d="M10.5 10.5L14 14" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" />
    </svg>
  );
}

export function UserIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="#ccc" aria-hidden>
      <circle cx="8" cy="5.5" r="2.5" />
      <path d="M3 14c0-2.8 2.2-5 5-5s5 2.2 5 5" />
    </svg>
  );
}

export function ColumnMenuIcon() {
  return (
    <svg className="th-menu" viewBox="0 0 14 14" fill="currentColor" aria-hidden>
      <rect x="1" y="2" width="12" height="1.5" rx="0.5" />
      <rect x="1" y="6.25" width="12" height="1.5" rx="0.5" />
      <rect x="1" y="10.5" width="12" height="1.5" rx="0.5" />
    </svg>
  );
}

export function EditIcon() {
  return (
    <svg width="12" height="12" viewBox="0 0 12 12" fill="none" aria-hidden>
      <path
        d="M8.5 1.5l2 2L4 10H2v-2L8.5 1.5z"
        stroke="#1890ff"
        strokeWidth="1"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export function CopyIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 14 14" fill="none" aria-hidden>
      <rect x="4" y="4" width="8" height="8" rx="1" stroke="#999" strokeWidth="1.2" />
      <path d="M2 10V3a1 1 0 011-1h7" stroke="#999" strokeWidth="1.2" />
    </svg>
  );
}

export function WarningIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 14 14" fill="currentColor" aria-hidden>
      <path d="M7 1L13 12H1L7 1zm0 4v4M7 10.5h.01" stroke="currentColor" strokeWidth="1.2" fill="none" />
    </svg>
  );
}

export function CheckCircleIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" aria-hidden>
      <circle cx="8" cy="8" r="7" fill="#52c41a" />
      <path d="M5 8l2 2 4-4" stroke="#fff" strokeWidth="1.5" fill="none" />
    </svg>
  );
}

export function InfoIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 14 14" aria-hidden>
      <circle cx="7" cy="7" r="6" stroke="#1890ff" fill="none" strokeWidth="1.2" />
      <path d="M7 6v4M7 4.5h.01" stroke="#1890ff" strokeWidth="1.2" />
    </svg>
  );
}

export function RefreshIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 14 14" fill="none" aria-hidden>
      <path
        d="M11 7A4 4 0 105 4.5M5 4.5V2M5 4.5H7"
        stroke="#666"
        strokeWidth="1.2"
        strokeLinecap="round"
      />
    </svg>
  );
}

export function ChevronRightIcon() {
  return (
    <svg width="12" height="12" viewBox="0 0 12 12" aria-hidden>
      <path d="M4 2l4 4-4 4" stroke="#999" strokeWidth="1.2" fill="none" />
    </svg>
  );
}
