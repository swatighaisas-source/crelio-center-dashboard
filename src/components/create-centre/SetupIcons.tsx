const STROKE = "#8eb9e8";
const FILL_LIGHT = "#d4e8f7";

export function BenefitDigitalIcon() {
  return (
    <svg width="48" height="48" viewBox="0 0 48 48" fill="none" aria-hidden>
      <rect x="8" y="10" width="32" height="24" rx="2" stroke={STROKE} strokeWidth="1.5" />
      <path d="M8 17h32" stroke={STROKE} strokeWidth="1.5" />
      <path
        d="M28 26l3.5 3.5 7.5-8"
        stroke={STROKE}
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export function BenefitExperienceIcon() {
  return (
    <svg width="48" height="48" viewBox="0 0 48 48" fill="none" aria-hidden>
      <path
        d="M14 22c0-4.4 3.6-8 8-8s8 3.6 8 8v2h2.5a2.5 2.5 0 012.5 2.5v9a2.5 2.5 0 01-2.5 2.5H11.5a2.5 2.5 0 01-2.5-2.5v-9A2.5 2.5 0 0111.5 24H14v-2z"
        stroke={STROKE}
        strokeWidth="1.5"
        strokeLinejoin="round"
      />
      <path d="M17 31h14" stroke={STROKE} strokeWidth="1.5" strokeLinecap="round" />
      <circle cx="35" cy="14" r="2" fill={FILL_LIGHT} stroke={STROKE} strokeWidth="1" />
      <circle cx="39" cy="19" r="1.5" fill={FILL_LIGHT} stroke={STROKE} strokeWidth="1" />
      <path
        d="M33 12l1 2M37 11l-1 2M40 15l2 0"
        stroke={STROKE}
        strokeWidth="1"
        strokeLinecap="round"
      />
    </svg>
  );
}

export function BenefitChartIcon() {
  return (
    <svg width="48" height="48" viewBox="0 0 48 48" fill="none" aria-hidden>
      <rect x="10" y="26" width="6" height="12" fill={FILL_LIGHT} stroke={STROKE} strokeWidth="1.2" />
      <rect x="21" y="20" width="6" height="18" fill={FILL_LIGHT} stroke={STROKE} strokeWidth="1.2" />
      <rect x="32" y="14" width="6" height="24" fill={FILL_LIGHT} stroke={STROKE} strokeWidth="1.2" />
      <path
        d="M10 18l11-5 10 7 9-11"
        stroke={STROKE}
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export function BenefitIntegrationIcon() {
  return (
    <svg width="48" height="48" viewBox="0 0 48 48" fill="none" aria-hidden>
      <path d="M16 24h16M20 18l-6 6 6 6M28 18l6 6-6 6" stroke={STROKE} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
      <circle cx="12" cy="24" r="4" fill={FILL_LIGHT} stroke={STROKE} strokeWidth="1.2" />
      <circle cx="36" cy="24" r="4" fill={FILL_LIGHT} stroke={STROKE} strokeWidth="1.2" />
    </svg>
  );
}

export function BenefitAutomationIcon() {
  return (
    <svg width="48" height="48" viewBox="0 0 48 48" fill="none" aria-hidden>
      <circle cx="24" cy="24" r="6" fill={FILL_LIGHT} stroke={STROKE} strokeWidth="1.5" />
      <path d="M24 14v-2M24 36v-2M14 24h-2M36 24h-2M17 17l-1.5-1.5M31 31l1.5 1.5M31 17l1.5-1.5M17 31l-1.5 1.5" stroke={STROKE} strokeWidth="2" strokeLinecap="round" />
      <circle cx="24" cy="24" r="11" stroke={STROKE} strokeWidth="1.5" strokeDasharray="4 4" />
    </svg>
  );
}

export function BenefitPortalIcon() {
  return (
    <svg width="48" height="48" viewBox="0 0 48 48" fill="none" aria-hidden>
      <circle cx="24" cy="18" r="5" fill={FILL_LIGHT} stroke={STROKE} strokeWidth="1.5" />
      <path d="M14 34c0-5.5 4.5-8 10-8s10 2.5 10 8" stroke={STROKE} strokeWidth="1.5" strokeLinecap="round" />
      <rect x="10" y="10" width="28" height="28" rx="3" stroke={STROKE} strokeWidth="1.5" />
    </svg>
  );
}
