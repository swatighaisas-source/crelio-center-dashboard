import { useCallback, useState } from 'react';

export type ToastTone = 'success' | 'info' | 'warning' | 'danger';
export interface Toast {
  id: string;
  message: string;
  tone: ToastTone;
}

/**
 * Lightweight in-memory toast queue used by the Report Management screens.
 * Each toast auto-dismisses after ~3.5s, with a cap to keep the queue bounded.
 */
export function useToast() {
  const [toasts, setToasts] = useState<Toast[]>([]);

  const push = useCallback((message: string, tone: ToastTone = 'success') => {
    const id = `toast-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`;
    setToasts((prev) => [...prev.slice(-3), { id, message, tone }]);
    window.setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 3500);
  }, []);

  const dismiss = useCallback((id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  return { toasts, push, dismiss };
}
