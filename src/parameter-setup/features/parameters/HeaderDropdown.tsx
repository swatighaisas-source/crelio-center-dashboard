import { useEffect, useRef, useState, type ReactNode } from 'react';
import { ChevronDown } from 'lucide-react';
import { Button } from '@/components/UI';

export interface DropdownItem {
  label: string;
  icon?: ReactNode;
  description?: string;
  onSelect: () => void;
}

/** A header button that opens a small menu of actions. */
export function HeaderDropdown({
  label,
  icon,
  items,
  variant = 'secondary',
}: {
  label: string;
  icon?: ReactNode;
  items: DropdownItem[];
  variant?: 'primary' | 'secondary';
}) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function onDoc(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    }
    if (open) document.addEventListener('mousedown', onDoc);
    return () => document.removeEventListener('mousedown', onDoc);
  }, [open]);

  return (
    <div className="relative" ref={ref}>
      <Button variant={variant} onClick={() => setOpen((o) => !o)}>
        {icon}
        {label}
        <ChevronDown className="h-4 w-4 opacity-70" />
      </Button>
      {open && (
        <div className="absolute right-0 top-full mt-1 w-[260px] rounded-md border border-slate-200 bg-white shadow-lg z-30 py-1">
          {items.map((it) => (
            <button
              key={it.label}
              type="button"
              onClick={() => {
                setOpen(false);
                it.onSelect();
              }}
              className="w-full text-left px-3 py-2 hover:bg-slate-50 flex items-start gap-2.5"
            >
              {it.icon && <span className="mt-0.5 text-slate-500 shrink-0">{it.icon}</span>}
              <span className="min-w-0">
                <span className="block text-[13px] text-slate-800">{it.label}</span>
                {it.description && (
                  <span className="block text-[11.5px] text-slate-500 leading-snug">
                    {it.description}
                  </span>
                )}
              </span>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
