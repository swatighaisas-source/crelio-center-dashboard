import { clsx } from 'clsx';
import type { ButtonHTMLAttributes, InputHTMLAttributes, ReactNode } from 'react';

export function Button({
  variant = 'secondary',
  size = 'md',
  className,
  children,
  ...rest
}: ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: 'primary' | 'secondary' | 'ghost' | 'danger';
  size?: 'sm' | 'md';
}) {
  return (
    <button
      {...rest}
      className={clsx(
        'inline-flex items-center justify-center gap-1.5 rounded-md font-medium transition-colors disabled:cursor-not-allowed disabled:opacity-50',
        size === 'sm' ? 'h-9 px-3.5 text-[13px]' : 'h-10 px-5 text-[14px]',
        variant === 'primary' &&
          'bg-[#2563eb] text-white border border-[#2563eb] hover:bg-[#1d4ed8] hover:border-[#1d4ed8]',
        variant === 'secondary' &&
          'bg-white text-[#2563eb] border border-[#2563eb] hover:bg-[#eff4ff]',
        variant === 'ghost' &&
          'text-[#2563eb] hover:bg-[#eff4ff]',
        variant === 'danger' &&
          'bg-white text-[#dc2626] border border-[#dc2626] hover:bg-[#fef2f2]',
        className,
      )}
    >
      {children}
    </button>
  );
}

export function Badge({
  tone = 'neutral',
  children,
  className,
}: {
  tone?: 'neutral' | 'success' | 'warning' | 'danger' | 'info';
  children: ReactNode;
  className?: string;
}) {
  return (
    <span
      className={clsx(
        'inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[11px] font-medium',
        tone === 'neutral' && 'bg-slate-100 text-slate-700',
        tone === 'success' && 'bg-emerald-50 text-emerald-700',
        tone === 'warning' && 'bg-amber-50 text-amber-700',
        tone === 'danger' && 'bg-rose-50 text-rose-700',
        tone === 'info' && 'bg-sky-50 text-sky-700',
        className,
      )}
    >
      {children}
    </span>
  );
}

export function StatCard({
  label,
  value,
  tone = 'neutral',
  hint,
}: {
  label: string;
  value: string | number;
  tone?: 'neutral' | 'success' | 'warning' | 'danger' | 'info';
  hint?: string;
}) {
  return (
    <div className="flex-1 min-w-[140px] rounded-lg border border-slate-200 bg-white p-3">
      <div className="text-[11px] uppercase tracking-wide text-slate-500 font-medium">
        {label}
      </div>
      <div
        className={clsx(
          'text-2xl font-semibold mt-1',
          tone === 'neutral' && 'text-slate-900',
          tone === 'success' && 'text-emerald-600',
          tone === 'warning' && 'text-amber-600',
          tone === 'danger' && 'text-rose-600',
          tone === 'info' && 'text-sky-600',
        )}
      >
        {value}
      </div>
      {hint && <div className="text-[11px] text-slate-500 mt-0.5">{hint}</div>}
    </div>
  );
}

export function Input({
  className,
  ...rest
}: InputHTMLAttributes<HTMLInputElement>) {
  return (
    <input
      {...rest}
      className={clsx(
        'h-9 rounded-md border border-[#d9d9d9] bg-white px-3 text-[13px] text-[#333] placeholder:text-[#999] focus:border-[#2563eb] focus:outline-none focus:ring-2 focus:ring-[#2563eb]/20',
        className,
      )}
    />
  );
}

export function Label({ children, className }: { children: ReactNode; className?: string }) {
  return (
    <label className={clsx('block text-[12px] font-medium text-slate-600 mb-1', className)}>
      {children}
    </label>
  );
}

export function Card({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <div
      className={clsx(
        'rounded-lg border border-slate-200 bg-white',
        className,
      )}
    >
      {children}
    </div>
  );
}

export function SectionTitle({
  title,
  description,
  right,
}: {
  title: string;
  description?: string;
  right?: ReactNode;
}) {
  return (
    <div className="flex items-center justify-between mb-3">
      <div>
        <h2 className="text-[15px] font-semibold text-slate-900">{title}</h2>
        {description && (
          <p className="text-[12px] text-slate-500 mt-0.5">{description}</p>
        )}
      </div>
      {right && <div className="flex items-center gap-2">{right}</div>}
    </div>
  );
}

export function EmptyState({
  title,
  description,
  action,
}: {
  title: string;
  description?: string;
  action?: ReactNode;
}) {
  return (
    <div className="flex flex-col items-center justify-center gap-2 py-12 px-4 text-center">
      <div className="h-10 w-10 rounded-full bg-slate-100 flex items-center justify-center text-slate-400">
        &middot;&middot;&middot;
      </div>
      <div className="text-[14px] font-medium text-slate-700">{title}</div>
      {description && (
        <div className="text-[12px] text-slate-500 max-w-md">{description}</div>
      )}
      {action}
    </div>
  );
}
