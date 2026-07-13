export function AccountSuccessIcon() {
  return (
    <div className="account-success-icon" aria-hidden>
      <span className="account-success-icon__spark account-success-icon__spark--1">+</span>
      <span className="account-success-icon__spark account-success-icon__spark--2">+</span>
      <span className="account-success-icon__dot account-success-icon__dot--1" />
      <span className="account-success-icon__dot account-success-icon__dot--2" />
      <span className="account-success-icon__dot account-success-icon__dot--3" />
      <span className="account-success-icon__star account-success-icon__star--1">✦</span>
      <span className="account-success-icon__star account-success-icon__star--2">✦</span>
      <div className="account-success-icon__circle">
        <svg viewBox="0 0 48 48" fill="none">
          <path
            d="M14 24l7 7 16-16"
            stroke="#ffffff"
            strokeWidth="4"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </div>
    </div>
  );
}
