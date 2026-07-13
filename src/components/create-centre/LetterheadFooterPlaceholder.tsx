export function LetterheadFooterPlaceholder() {
  return (
    <div className="letterhead-footer-placeholder" aria-hidden>
      <svg viewBox="0 0 80 80" className="letterhead-footer-placeholder__svg">
        <circle cx="40" cy="40" r="36" fill="#e8f2fc" />
        <rect x="22" y="28" width="24" height="24" rx="2" fill="#4a90e2" opacity="0.85" />
        <rect
          x="48"
          y="34"
          width="18"
          height="18"
          rx="1"
          fill="none"
          stroke="#4a90e2"
          strokeWidth="1.5"
          strokeDasharray="3 2"
        />
        <path
          d="M46 42h16M52 36v12"
          stroke="#4a90e2"
          strokeWidth="1.5"
          strokeLinecap="round"
        />
      </svg>
    </div>
  );
}
