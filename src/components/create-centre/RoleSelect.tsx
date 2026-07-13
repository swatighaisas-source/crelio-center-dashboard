import { useEffect, useRef, useState } from "react";
import { TEAM_ROLE_OPTIONS, type TeamRole } from "../../context/teamMembers";

interface Props {
  value: TeamRole;
  onChange: (role: TeamRole) => void;
}

export function RoleSelect({ value, onChange }: Props) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const selected = TEAM_ROLE_OPTIONS.find((r) => r.value === value)!;

  useEffect(() => {
    const onDoc = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener("mousedown", onDoc);
    return () => document.removeEventListener("mousedown", onDoc);
  }, []);

  return (
    <div className="role-select" ref={ref}>
      <button
        type="button"
        className="role-select__trigger"
        onClick={() => setOpen((o) => !o)}
        aria-expanded={open}
      >
        <span>{selected.label}</span>
        <span className="role-select__chevron">▾</span>
      </button>
      {open && (
        <ul className="role-select__menu" role="listbox">
          {TEAM_ROLE_OPTIONS.map((opt) => (
            <li key={opt.value}>
              <button
                type="button"
                className={`role-select__option${opt.value === value ? " role-select__option--active" : ""}`}
                onClick={() => {
                  onChange(opt.value);
                  setOpen(false);
                }}
              >
                <span className="role-select__option-label">{opt.label}</span>
                <span className="role-select__option-desc">{opt.description}</span>
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
