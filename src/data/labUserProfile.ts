import type { LabUserRole } from "./labHome";

export interface LabUserProfile {
  name: string;
  username: string;
  usernamePrefix: string;
  userRole: LabUserRole;
  email: string;
  contactNo: string;
  dateOfBirthDay: string;
  dateOfBirthMonth: string;
  dateOfBirthYear: string;
  defaultLoginModule: string;
  defaultLanguage: string;
  employeeNo: string;
  inactivityLogoutMinutes: string;
  profilePhotoUrl: string | null;
}

export const DEFAULT_LOGIN_MODULES = [
  "Admin",
  "Registration",
  "Accession",
  "Operation",
  "Finance",
  "Reviewer",
] as const;

export const DEFAULT_LANGUAGES = [
  "English (United States)",
  "English (India)",
  "Hindi",
  "Marathi",
  "Tamil",
  "Telugu",
] as const;

/** Labels aligned with classic user-management UI */
export const USER_ROLE_OPTIONS: { value: LabUserRole; label: string }[] = [
  { value: "owner", label: "Admin" },
  { value: "technician", label: "Lab Technician" },
  { value: "front-desk", label: "Front Desk / Receptionist" },
  { value: "director", label: "Lab Director / Reviewer" },
  { value: "billing", label: "Billing Manager" },
];

const DAYS = Array.from({ length: 31 }, (_, i) => String(i + 1));
const MONTHS = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
];
const YEARS = Array.from({ length: 80 }, (_, i) => String(new Date().getFullYear() - i));

export const DOB_DAY_OPTIONS = DAYS;
export const DOB_MONTH_OPTIONS = MONTHS;
export const DOB_YEAR_OPTIONS = YEARS;

export function createDefaultProfile(labName: string, email: string, abbreviation: string): LabUserProfile {
  const prefix = abbreviation.toLowerCase().replace(/[^a-z0-9]/g, "").slice(0, 8) || "lab";
  const firstName = labName.split(/\s+/)[0]?.toLowerCase() || "user";
  return {
    name: firstName.charAt(0).toUpperCase() + firstName.slice(1),
    username: firstName,
    usernamePrefix: prefix,
    userRole: "owner",
    email,
    contactNo: "",
    dateOfBirthDay: "",
    dateOfBirthMonth: "",
    dateOfBirthYear: "",
    defaultLoginModule: "Admin",
    defaultLanguage: "",
    employeeNo: "",
    inactivityLogoutMinutes: "55",
    profilePhotoUrl: null,
  };
}

export function profileInitials(profile: LabUserProfile): string {
  return profile.name
    .split(/\s+/)
    .map((w) => w[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();
}
