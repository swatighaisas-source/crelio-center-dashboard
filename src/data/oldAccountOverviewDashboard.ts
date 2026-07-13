export const FINANCE_MONTHS = [
  "Jul-25",
  "Aug-25",
  "Sep-25",
  "Oct-25",
  "Nov-25",
  "Dec-25",
  "Jan-26",
  "Feb-26",
  "Mar-26",
  "Apr-26",
  "May-26",
  "Jun-26",
] as const;

/** Demo finance series (INR) — Feb-26 dominates like production labs with large dues */
export const FINANCE_DUE_BY_MONTH = [0, 0, 0, 0, 0, 0, 0, 6_666_872, 0, 0, 0, 0] as const;
export const FINANCE_PAID_BY_MONTH = [0, 0, 0, 0, 0, 0, 0, 188, 0, 0, 0, 0] as const;

export const FINANCE_TOTAL_INR = 6_667_060;

export const COLLECTIONS_TOTAL_INR = 38;
export const COLLECTIONS_CASH_INR = 38;
export const COLLECTIONS_OTHER_INR = 0;

export const LOGIN_BREAKDOWN = [
  { label: "Account Logins", value: 0, color: "#91d5ff" },
  { label: "Provider Logins", value: 0, color: "#69c0ff" },
  { label: "Lab Logins", value: 1, color: "#13c2c2" },
  { label: "Doctor Logins", value: 0, color: "#36cfc9" },
] as const;

export const LOGIN_TOTAL = 1;
