import { NavLink } from "react-router-dom";

const TABS = [
  { key: "centre", label: "Centre Details", path: "" },
  { key: "plan", label: "Plan Details", path: "plan" },
  { key: "config", label: "Configurations", path: "configurations" },
] as const;

interface Props {
  labId: number;
}

export function LabDetailTabs({ labId }: Props) {
  const base = `/lab/${labId}`;

  return (
    <nav className="lab-detail-tabs">
      {TABS.map((tab) => (
        <NavLink
          key={tab.key}
          to={tab.path ? `${base}/${tab.path}` : base}
          end={tab.path === ""}
          className={({ isActive }) =>
            `lab-detail-tab${isActive ? " lab-detail-tab--active" : ""}`
          }
        >
          {tab.label}
        </NavLink>
      ))}
    </nav>
  );
}
