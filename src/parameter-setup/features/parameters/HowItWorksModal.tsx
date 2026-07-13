import { X } from 'lucide-react';
import { Button } from '@/components/UI';

interface Props {
  open: boolean;
  onClose: () => void;
}

/**
 * Educational modal explaining the Parameter Library concept — replaces the
 * inline "shared across tests" helper line with an on-demand walkthrough.
 */
export function HowItWorksModal({ open, onClose }: Props) {
  if (!open) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 p-4">
      <div className="w-full max-w-lg max-h-[85vh] flex flex-col rounded-lg bg-white shadow-xl border border-slate-200">
        <div className="flex items-center justify-between px-5 py-3 border-b border-slate-200">
          <h3 className="text-[15px] font-semibold text-slate-900">
            How the Parameter Library works
          </h3>
          <button
            type="button"
            onClick={onClose}
            className="p-1 rounded hover:bg-slate-100 text-slate-500"
            aria-label="Close"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        <div className="flex-1 min-h-0 overflow-auto px-5 py-5 space-y-5">
          {STEPS.map((s) => (
            <div key={s.title} className="flex items-start gap-3.5">
              <div
                className="h-10 w-10 shrink-0 rounded-lg flex items-center justify-center"
                style={{ background: s.tint }}
              >
                {s.icon}
              </div>
              <div className="min-w-0">
                <div className="text-[13.5px] font-semibold text-slate-800">
                  {s.title}
                </div>
                <p className="text-[12.5px] text-slate-500 leading-relaxed mt-0.5">
                  {s.body}
                </p>
              </div>
            </div>
          ))}
        </div>

        <div className="flex items-center justify-end px-5 py-3 border-t border-slate-200 bg-slate-50/60">
          <Button variant="primary" size="sm" onClick={onClose}>
            Got it
          </Button>
        </div>
      </div>
    </div>
  );
}

const STEPS: { title: string; body: string; tint: string; icon: JSX.Element }[] = [
  {
    title: 'One library, reused across tests',
    body: 'The library is your master set of parameters. The same parameter can be mapped to many tests instead of being re-created each time.',
    tint: '#eef2ff',
    icon: <SharedIcon />,
  },
  {
    title: 'Edit once, applies everywhere',
    body: 'Change a library parameter here — the unit, ranges or type — and the update flows to every test that uses it automatically.',
    tint: '#ecfdf5',
    icon: <SyncIcon />,
  },
  {
    title: 'Assign parameters to tests',
    body: 'Use “Assign Parameters” to link parameters to tests in bulk by uploading a Test ID / Parameter ID sheet.',
    tint: '#fff7ed',
    icon: <LinkIcon />,
  },
  {
    title: 'Bulk upload & bulk update',
    body: '“Bulk Upload” imports parameters from a spreadsheet. “Bulk Update” turns the grid into editable cells so you can edit many rows inline at once.',
    tint: '#eff6ff',
    icon: <SheetIcon />,
  },
];

function SharedIcon() {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
      <rect x="3" y="6" width="11" height="8" rx="2" fill="#c7d2fe" />
      <rect x="6" y="9" width="11" height="8" rx="2" fill="#a5b4fc" />
      <rect
        x="9"
        y="11"
        width="11"
        height="9"
        rx="2"
        fill="#fff"
        stroke="#6366f1"
        strokeWidth="1.4"
      />
      <circle cx="14.5" cy="15.5" r="1.4" fill="#6366f1" />
    </svg>
  );
}

function SyncIcon() {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
      <path
        d="M5 12a7 7 0 0 1 11.9-5M19 12a7 7 0 0 1-11.9 5"
        stroke="#10b981"
        strokeWidth="1.8"
        strokeLinecap="round"
      />
      <path
        d="M16 4v3h-3M8 20v-3h3"
        stroke="#10b981"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function LinkIcon() {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
      <path
        d="M9.5 14.5l5-5M8 13l-1.5 1.5a3.2 3.2 0 0 0 4.5 4.5L12.5 17.5M16 11l1.5-1.5a3.2 3.2 0 0 0-4.5-4.5L11.5 6.5"
        stroke="#f59e0b"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function SheetIcon() {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
      <rect
        x="4"
        y="3.5"
        width="16"
        height="17"
        rx="2"
        fill="#fff"
        stroke="#3b82f6"
        strokeWidth="1.4"
      />
      <path
        d="M4 9h16M4 14h16M9 9v11M15 9v11"
        stroke="#93c5fd"
        strokeWidth="1.3"
      />
    </svg>
  );
}
