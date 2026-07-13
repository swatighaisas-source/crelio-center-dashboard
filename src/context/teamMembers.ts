export type TeamRole =
  | "admin"
  | "technician"
  | "finance"
  | "receptionist"
  | "complete-ops";

export interface TeamRoleOption {
  value: TeamRole;
  label: string;
  description: string;
}

export const TEAM_ROLE_OPTIONS: TeamRoleOption[] = [
  { value: "admin", label: "Admin", description: "Admin and Finance access.." },
  {
    value: "technician",
    label: "Technician",
    description: "Accession & Report related access ..",
  },
  { value: "finance", label: "Finance", description: "Finance access.." },
  {
    value: "receptionist",
    label: "Receptionist",
    description: "Registration & Billing access..",
  },
  {
    value: "complete-ops",
    label: "Complete Operations",
    description: "Operations & Registration & Billing",
  },
];

export interface TeamMemberDraft {
  id: string;
  name: string;
  role: TeamRole;
  email: string;
  contact: string;
}

export function createEmptyMember(): TeamMemberDraft {
  return {
    id: crypto.randomUUID(),
    name: "",
    role: "admin",
    email: "",
    contact: "",
  };
}
