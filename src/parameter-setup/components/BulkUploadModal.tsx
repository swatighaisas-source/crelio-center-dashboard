import { X, Download, FileSpreadsheet } from 'lucide-react';
import { useRef, useState } from 'react';
import { Button } from './UI';
import { clsx } from 'clsx';

interface Props {
  open: boolean;
  title: string;
  description?: string;
  onClose: () => void;
  onFile: (file: File) => void | Promise<void>;
  onDownloadTemplate: () => void;
  accept?: string;
}

export function BulkUploadModal({
  open,
  title,
  description = 'Use the provided column layout. You can download a sample file below.',
  onClose,
  onFile,
  onDownloadTemplate,
  accept = '.xlsx,.xls',
}: Props) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [fileName, setFileName] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);
  const [drag, setDrag] = useState(false);

  if (!open) return null;

  async function handle(file: File) {
    setBusy(true);
    setFileName(file.name);
    try {
      await onFile(file);
      onClose();
    } finally {
      setBusy(false);
    }
  }

  return (
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center bg-slate-900/50 p-4"
      role="dialog"
      aria-modal="true"
      aria-labelledby="bulk-upload-title"
    >
      <div className="w-full max-w-2xl rounded-lg border border-slate-200 bg-white shadow-xl">
        <div className="flex items-center justify-between border-b border-slate-200 px-6 py-4">
          <h2 id="bulk-upload-title" className="text-[16px] font-semibold text-slate-900">
            {title}
          </h2>
          <button
            type="button"
            onClick={onClose}
            className="rounded p-1 text-slate-400 hover:bg-slate-100 hover:text-slate-700"
            aria-label="Close"
          >
            <X className="h-5 w-5" />
          </button>
        </div>
        <div className="p-6 space-y-5">
          <p className="text-[13px] text-slate-600">{description}</p>

          <div
            onDragOver={(e) => {
              e.preventDefault();
              setDrag(true);
            }}
            onDragLeave={() => setDrag(false)}
            onDrop={(e) => {
              e.preventDefault();
              setDrag(false);
              const f = e.dataTransfer.files?.[0];
              if (f) void handle(f);
            }}
            className={clsx(
              'rounded-lg border-2 border-dashed px-4 py-8 text-center',
              drag ? 'border-blue-500 bg-blue-50/50' : 'border-slate-200 bg-slate-50/80',
            )}
          >
            <FileSpreadsheet className="mx-auto h-8 w-8 text-slate-400" />
            <p className="mt-2 text-[13px] text-slate-700 font-medium">Upload file</p>
            <p className="text-[12px] text-slate-500">Drop .xlsx here or choose from disk</p>
            {fileName && (
              <p className="mt-2 text-[12px] text-slate-600">
                {fileName} {busy && '…'}
              </p>
            )}
            <div className="mt-3 flex flex-wrap items-center justify-center gap-2">
              <Button
                type="button"
                variant="secondary"
                onClick={onDownloadTemplate}
              >
                <Download className="h-3.5 w-3.5" />
                Download template
              </Button>
              <Button
                type="button"
                variant="primary"
                onClick={() => inputRef.current?.click()}
              >
                Choose file
              </Button>
            </div>
            <input
              ref={inputRef}
              type="file"
              accept={accept}
              className="hidden"
              onChange={(e) => {
                const f = e.target.files?.[0];
                if (f) void handle(f);
                e.target.value = '';
              }}
            />
          </div>
        </div>
        <div className="flex justify-end gap-2 border-t border-slate-200 px-6 py-4">
          <Button type="button" variant="danger" onClick={onClose}>
            Cancel
          </Button>
        </div>
      </div>
    </div>
  );
}
