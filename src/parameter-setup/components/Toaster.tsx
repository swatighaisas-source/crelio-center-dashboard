import { clsx } from 'clsx';
import { CheckCircle2, Info, TriangleAlert, X } from 'lucide-react';
import type { Toast } from '@/lib/useToast';

interface Props {
  toasts: Toast[];
  onDismiss: (id: string) => void;
  className?: string;
}

/**
 * Fixed top-right toast stack. Caller owns the queue via {@link useToast}.
 * Rendered as a portal-less overlay; callers can mount this anywhere.
 */
export function Toaster({ toasts, onDismiss, className }: Props) {
  return (
    <div
      className={clsx(
        'pointer-events-none fixed top-16 right-4 z-50 flex flex-col gap-2 w-[340px]',
        className,
      )}
    >
      {toasts.map((t) => (
        <ToastBanner key={t.id} toast={t} onDismiss={() => onDismiss(t.id)} />
      ))}
    </div>
  );
}

function ToastBanner({
  toast,
  onDismiss,
}: {
  toast: Toast;
  onDismiss: () => void;
}) {
  const tone = toast.tone;
  const Icon =
    tone === 'success'
      ? CheckCircle2
      : tone === 'warning' || tone === 'danger'
      ? TriangleAlert
      : Info;
  return (
    <div
      className={clsx(
        'pointer-events-auto shadow-md rounded-md border px-3 py-2 text-[12.5px] flex items-start gap-2 bg-white',
        tone === 'success' && 'border-emerald-200 text-emerald-900',
        tone === 'info' && 'border-sky-200 text-sky-900',
        tone === 'warning' && 'border-amber-200 text-amber-900',
        tone === 'danger' && 'border-rose-200 text-rose-900',
      )}
      role="status"
    >
      <Icon
        className={clsx(
          'h-4 w-4 shrink-0 mt-0.5',
          tone === 'success' && 'text-emerald-600',
          tone === 'info' && 'text-sky-600',
          tone === 'warning' && 'text-amber-600',
          tone === 'danger' && 'text-rose-600',
        )}
      />
      <div className="flex-1 leading-snug whitespace-pre-line">
        {toast.message}
      </div>
      <button
        type="button"
        onClick={onDismiss}
        className="text-slate-400 hover:text-slate-600"
        aria-label="Dismiss"
      >
        <X className="h-3.5 w-3.5" />
      </button>
    </div>
  );
}
