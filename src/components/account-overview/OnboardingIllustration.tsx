export function OnboardingIllustration() {
  return (
    <div className="ao-welcome__illus" aria-hidden>
      <svg viewBox="0 0 200 160" className="ao-welcome__illus-svg">
        <rect x="48" y="24" width="104" height="72" rx="6" fill="#f5f7fa" stroke="#d8dee6" strokeWidth="1.5" />
        <rect x="56" y="36" width="88" height="8" rx="2" fill="#e8ecf0" />
        <rect x="56" y="50" width="60" height="6" rx="2" fill="#e8ecf0" />
        <rect x="56" y="62" width="72" height="6" rx="2" fill="#e8ecf0" />
        <circle cx="128" cy="108" r="32" fill="#52c41a" />
        <path
          d="M116 108l8 8 16-18"
          stroke="#fff"
          strokeWidth="4"
          strokeLinecap="round"
          strokeLinejoin="round"
          fill="none"
        />
        <circle cx="36" cy="48" r="4" fill="#ff7875" opacity="0.9" />
        <circle cx="168" cy="40" r="3" fill="#69c0ff" />
        <circle cx="172" cy="72" r="2.5" fill="#ffd666" />
        <text x="30" y="100" fontSize="14" fill="#ff7875" fontWeight="600">
          +
        </text>
      </svg>
    </div>
  );
}
