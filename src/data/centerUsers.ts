export interface CenterUser {
  id: string;
  username: string;
  name: string;
  userRole: string;
  defaultLoginSection: string;
  lastActivity: string;
  email?: string;
}

export function formatUserLastActivity(date = new Date()): string {
  const day = date.getDate();
  const suffix =
    day % 10 === 1 && day !== 11
      ? "st"
      : day % 10 === 2 && day !== 12
        ? "nd"
        : day % 10 === 3 && day !== 13
          ? "rd"
          : "th";
  const months = [
    "Jan",
    "Feb",
    "Mar",
    "Apr",
    "May",
    "Jun",
    "Jul",
    "Aug",
    "Sep",
    "Oct",
    "Nov",
    "Dec",
  ];
  return `${day}${suffix} ${months[date.getMonth()]}, ${date.getFullYear()}`;
}

export const CENTER_USER_LOGIN_QUOTA = { used: 50, total: 56 };

export const CENTER_USERS: CenterUser[] = [
  {
    id: "hudu-admin",
    username: "hudu-admin",
    name: "Husain Dummy Lab",
    userRole: "Front Desk / Registration",
    defaultLoginSection: "Admin",
    lastActivity: "6th Jun, 2026",
  },
  {
    id: "hudu-livehealth",
    username: "hudu-livehealth",
    name: "Livehealth",
    userRole: "",
    defaultLoginSection: "",
    lastActivity: "—",
  },
  {
    id: "hudu-demo",
    username: "hudu-demo",
    name: "demo",
    userRole: "Admin",
    defaultLoginSection: "Admin",
    lastActivity: "26th Feb, 2025",
  },
  {
    id: "hudu-reg",
    username: "hudu-reg",
    name: "reg",
    userRole: "Front Desk / Registration",
    defaultLoginSection: "Registration",
    lastActivity: "20th Mar, 2025",
  },
  {
    id: "hudu-demoreg",
    username: "hudu-demoreg",
    name: "demoreg",
    userRole: "Front Desk / Registration",
    defaultLoginSection: "Registration",
    lastActivity: "16th Jul, 2025",
  },
  {
    id: "hudu-discount",
    username: "hudu-discount",
    name: "discount",
    userRole: "Front Desk / Registration",
    defaultLoginSection: "Registration",
    lastActivity: "22nd May, 2026",
  },
];

export function findCenterUser(users: CenterUser[], userId: string): CenterUser | undefined {
  return users.find((u) => u.id === userId || u.username === userId);
}

export function centerUserHref(labId: number, userId: string): string {
  return `/lab/${labId}/center/users/${encodeURIComponent(userId)}`;
}
