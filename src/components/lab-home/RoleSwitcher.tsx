import { useRef, useState } from "react";
import { ROLE_LABELS, type LabUserRole } from "../../data/labHome";

interface Props {
  activeRole: LabUserRole;
  onChange: (role: LabUserRole) => void;
}

const ROLES = Object.entries(ROLE_LABELS) as [LabUserRole, string][];

const ROLE_ICONS: Record<LabUserRole, JSX.Element> = {
  owner: (
    <svg width="14" height="14" viewBox="0 0 16 16" fill="none" aria-hidden>
      <circle cx="8" cy="5.5" r="2.5" stroke="currentColor" strokeWidth="1.2" />
      <path d="M3 13c0-2.8 2.2-4.5 5-4.5s5 1.7 5 4.5" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" />
    </svg>
  ),
  technician: (
    <svg width="14" height="14" viewBox="0 0 16 16" fill="none" aria-hidden>
      <path d="M8 2.5c-2 0-3.5 1.8-3.5 4a3.5 3.5 0 007 0c0-2.2-1.5-4-3.5-4z" stroke="currentColor" strokeWidth="1.1" strokeLinejoin="round" />
      <path d="M5.5 10.5c.8 1.2 1.7 1.8 2.5 1.8s1.7-.6 2.5-1.8" stroke="currentColor" strokeWidth="1.1" strokeLinecap="round" />
    </svg>
  ),
  "front-desk": (
    <svg width="14" height="14" viewBox="0 0 16 16" fill="none" aria-hidden>
      <rect x="2" y="4" width="12" height="8" rx="1" stroke="currentColor" strokeWidth="1.1" />
      <path d="M5 8h6M5 10h3" stroke="currentColor" strokeWidth="1.1" strokeLinecap="round" />
    </svg>
  ),
  director: (
    <svg width="14" height="14" viewBox="0 0 16 16" fill="none" aria-hidden>
      <path d="M2.5 8s2.2-3.5 5.5-3.5S13.5 8 13.5 8s-2.2 3.5-5.5 3.5S2.5 8 2.5 8z" stroke="currentColor" strokeWidth="1.1" strokeLinejoin="round" />
      <circle cx="8" cy="8" r="1.5" fill="currentColor" />
    </svg>
  ),
  billing: (
    <svg width="14" height="14" viewBox="0 0 16 16" fill="none" aria-hidden>
      <circle cx="8" cy="8" r="5.5" stroke="currentColor" strokeWidth="1.1" />
      <path d="M8 5v6M6 6.5h3a1 1 0 010 2H7a1 1 0 000 2h3" stroke="currentColor" strokeWidth="1.1" strokeLinecap="round" />
    </svg>
  ),
};

export function RoleSwitcher({ activeRole, onChange }: Props) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  const handleSelect = (role: LabUserRole) => {
    onChange(role);
    setOpen(false);
  };

  return (
    <div className="role-switcher" ref={ref}>
      <button
        type="button"
        className="role-switcher__trigger"
        onClick={() => setOpen((o) => !o)}
        aria-haspopup="listbox"
        aria-expanded={open}
      >
        <span className="role-switcher__icon">{ROLE_ICONS[activeRole]}</span>
        <span className="role-switcher__label">{ROLE_LABELS[activeRole]}</span>
        <svg className="role-switcher__chevron" width="12" height="8" viewBox="0 0 12 8" fill="none" aria-hidden>
          <path d="M1.5 1.5L6 6l4.5-4.5" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </button>

      {open && (
        <>
          <div className="role-switcher__backdrop" onClick={() => setOpen(false)} />
          <ul className="role-switcher__menu" role="listbox" aria-label="Select role">
            <li className="role-switcher__menu-header">Viewing as</li>
            {ROLES.map(([role, label]) => (
              <li
                key={role}
                role="option"
                aria-selected={role === activeRole}
                className={`role-switcher__option${role === activeRole ? " role-switcher__option--active" : ""}`}
                onClick={() => handleSelect(role)}
              >
                <span className="role-switcher__option-icon">{ROLE_ICONS[role]}</span>
                <span>{label}</span>
                {role === activeRole && (
                  <svg className="role-switcher__check" width="14" height="14" viewBox="0 0 16 16" fill="none" aria-hidden>
                    <path d="M3 8l3.5 3.5L13 5" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                )}
              </li>
            ))}
          </ul>
        </>
      )}
    </div>
  );
}
