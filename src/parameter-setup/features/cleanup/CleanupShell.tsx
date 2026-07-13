import type { ReactNode } from 'react';

/** Shared header + scroll layout for the cleanup / QC sub-screens. */
export function CleanupShell({
  title,
  description,
  actions,
  children,
}: {
  title: string;
  description?: string;
  actions?: ReactNode;
  children: ReactNode;
}) {
  return (
    <div className="flex flex-col flex-1 min-h-0">
      <div className="flex-none border-b border-slate-200 bg-white px-6 py-4">
        <div className="flex items-start justify-between gap-3 flex-wrap">
          <div className="min-w-0">
            <h2 className="text-[16px] font-semibold text-slate-900">{title}</h2>
            {description && (
              <p className="text-[12px] text-slate-500 mt-1 max-w-2xl">{description}</p>
            )}
          </div>
          {actions && <div className="flex items-center gap-2 shrink-0">{actions}</div>}
        </div>
      </div>
      <div className="flex-1 min-h-0 overflow-auto bg-slate-50">
        <div className="px-6 py-6">{children}</div>
      </div>
    </div>
  );
}
