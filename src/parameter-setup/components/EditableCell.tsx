import { clsx } from 'clsx';
import {
  useEffect,
  useRef,
  useState,
  type InputHTMLAttributes,
  type KeyboardEvent,
} from 'react';

interface TextCellProps
  extends Omit<InputHTMLAttributes<HTMLInputElement>, 'onChange' | 'value'> {
  value: string;
  onCommit: (next: string) => void;
  placeholder?: string;
  required?: boolean;
  invalid?: boolean;
}

export function TextCell({
  value,
  onCommit,
  placeholder,
  required,
  invalid,
  className,
  ...rest
}: TextCellProps) {
  const [draft, setDraft] = useState(value);
  useEffect(() => setDraft(value), [value]);
  return (
    <input
      {...rest}
      value={draft}
      placeholder={placeholder}
      onChange={(e) => setDraft(e.target.value)}
      onBlur={() => draft !== value && onCommit(draft)}
      onKeyDown={(e: KeyboardEvent<HTMLInputElement>) => {
        if (e.key === 'Enter') {
          e.currentTarget.blur();
        } else if (e.key === 'Escape') {
          setDraft(value);
          e.currentTarget.blur();
        }
      }}
      className={clsx(
        'cell-input w-full h-full px-2 py-1 bg-transparent text-[13px] text-slate-900 placeholder:text-slate-400 border-0',
        (required && !draft) || invalid ? 'bg-rose-50/60' : '',
        className,
      )}
    />
  );
}

interface NumberCellProps {
  value: number | null | undefined;
  onCommit: (next: number | null) => void;
  placeholder?: string;
  step?: number;
}

export function NumberCell({ value, onCommit, placeholder, step }: NumberCellProps) {
  const [draft, setDraft] = useState<string>(value == null ? '' : String(value));
  useEffect(() => setDraft(value == null ? '' : String(value)), [value]);
  return (
    <input
      type="number"
      step={step}
      value={draft}
      placeholder={placeholder}
      onChange={(e) => setDraft(e.target.value)}
      onBlur={() => {
        const n = draft === '' ? null : Number(draft);
        const final = n === null || Number.isNaN(n) ? null : n;
        const current = value ?? null;
        if (final !== current) onCommit(final);
      }}
      className="cell-input w-full h-full px-2 py-1 bg-transparent text-[13px] text-slate-900 placeholder:text-slate-400 border-0"
    />
  );
}

interface SelectCellProps {
  value: string;
  onCommit: (next: string) => void;
  options: { id: string; label: string }[];
  onCreate?: (label: string) => string; // returns new id
  placeholder?: string;
  required?: boolean;
}

export function SelectCell({
  value,
  onCommit,
  options,
  onCreate,
  placeholder,
  required,
}: SelectCellProps) {
  const [open, setOpen] = useState(false);
  const [filter, setFilter] = useState('');
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    const h = (e: MouseEvent) => {
      if (!ref.current?.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener('mousedown', h);
    return () => document.removeEventListener('mousedown', h);
  }, [open]);

  const current = options.find((o) => o.id === value);
  const filtered = options.filter((o) =>
    filter ? o.label.toLowerCase().includes(filter.toLowerCase()) : true,
  );
  const canCreate =
    !!onCreate &&
    filter.trim().length > 0 &&
    !options.some((o) => o.label.toLowerCase() === filter.trim().toLowerCase());

  return (
    <div ref={ref} className="relative h-full">
      <button
        type="button"
        onClick={() => {
          setOpen((o) => !o);
          setFilter('');
        }}
        className={clsx(
          'w-full h-full px-2 py-1 text-left text-[13px]',
          current ? 'text-slate-900' : 'text-slate-400',
          required && !current ? 'bg-rose-50/60' : '',
        )}
      >
        {current?.label ?? placeholder ?? 'Select…'}
      </button>
      {open && (
        <div className="absolute z-30 top-full left-0 mt-1 w-56 rounded-md border border-slate-200 bg-white shadow-lg">
          <div className="p-2 border-b border-slate-100">
            <input
              autoFocus
              value={filter}
              onChange={(e) => setFilter(e.target.value)}
              placeholder="Search or create…"
              className="w-full h-7 rounded border border-slate-200 px-2 text-[12px] focus:outline-none focus:border-blue-500"
            />
          </div>
          <div className="max-h-48 overflow-y-auto scrollbar-thin py-1">
            {filtered.length === 0 && !canCreate && (
              <div className="px-3 py-2 text-[12px] text-slate-400">No matches</div>
            )}
            {filtered.map((o) => (
              <button
                key={o.id}
                type="button"
                onClick={() => {
                  onCommit(o.id);
                  setOpen(false);
                }}
                className={clsx(
                  'w-full text-left px-3 py-1.5 text-[13px] hover:bg-blue-50',
                  value === o.id && 'bg-blue-50 text-blue-800',
                )}
              >
                {o.label}
              </button>
            ))}
            {canCreate && onCreate && (
              <button
                type="button"
                onClick={() => {
                  const newId = onCreate(filter.trim());
                  onCommit(newId);
                  setOpen(false);
                }}
                className="w-full text-left px-3 py-1.5 text-[13px] text-blue-700 hover:bg-blue-50 border-t border-slate-100"
              >
                + Create &ldquo;{filter.trim()}&rdquo;
              </button>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

export function CheckCell({
  value,
  onCommit,
}: {
  value: boolean;
  onCommit: (v: boolean) => void;
}) {
  return (
    <div className="flex items-center justify-center h-full">
      <input
        type="checkbox"
        checked={value}
        onChange={(e) => onCommit(e.target.checked)}
        className="h-4 w-4 accent-blue-600"
      />
    </div>
  );
}
