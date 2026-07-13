import { useState } from 'react';
import { Save } from 'lucide-react';
import { useStore } from '@/lib/store';
import { Button } from '@/components/UI';

/** Persists the current app state to local storage and shows a short confirmation. */
export function SaveChangesButton() {
  const { saveChanges } = useStore();
  const [hint, setHint] = useState<'idle' | 'ok' | 'err'>('idle');

  return (
    <span className="inline-flex items-center gap-2">
      <Button
        type="button"
        size="sm"
        variant="secondary"
        onClick={() => {
          if (saveChanges()) {
            setHint('ok');
            window.setTimeout(() => setHint('idle'), 2500);
          } else {
            setHint('err');
            window.setTimeout(() => setHint('idle'), 4000);
          }
        }}
      >
        <Save className="h-3.5 w-3.5" aria-hidden />
        Save changes
      </Button>
      {hint === 'ok' && (
        <span className="text-[12px] text-emerald-600 whitespace-nowrap">Saved locally</span>
      )}
      {hint === 'err' && (
        <span className="text-[12px] text-rose-600 whitespace-nowrap">Save failed</span>
      )}
    </span>
  );
}
