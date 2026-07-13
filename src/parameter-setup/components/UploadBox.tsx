import { UploadCloud, FileSpreadsheet, Download } from 'lucide-react';
import { useRef, useState } from 'react';
import { Button } from './UI';
import { clsx } from 'clsx';

interface Props {
  title: string;
  description?: string;
  onFile: (file: File) => void | Promise<void>;
  onDownloadTemplate?: () => void;
  accept?: string;
}

export function UploadBox({
  title,
  description,
  onFile,
  onDownloadTemplate,
  accept = '.xlsx,.xls',
}: Props) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [dragging, setDragging] = useState(false);
  const [fileName, setFileName] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  async function handle(file: File) {
    setBusy(true);
    setFileName(file.name);
    try {
      await onFile(file);
    } finally {
      setBusy(false);
    }
  }

  return (
    <div
      onDragOver={(e) => {
        e.preventDefault();
        setDragging(true);
      }}
      onDragLeave={() => setDragging(false)}
      onDrop={(e) => {
        e.preventDefault();
        setDragging(false);
        const f = e.dataTransfer.files?.[0];
        if (f) void handle(f);
      }}
      className={clsx(
        'rounded-lg border-2 border-dashed bg-white px-4 py-5 flex items-center justify-between gap-4',
        dragging ? 'border-blue-500 bg-blue-50/40' : 'border-slate-300',
      )}
    >
      <div className="flex items-center gap-3">
        <div className="h-10 w-10 rounded-md bg-blue-50 text-blue-600 flex items-center justify-center">
          <UploadCloud className="h-5 w-5" />
        </div>
        <div>
          <div className="text-[13px] font-medium text-slate-900">{title}</div>
          <div className="text-[12px] text-slate-500">
            {description ?? 'Drop an Excel file (.xlsx) or click to browse.'}
          </div>
          {fileName && (
            <div className="mt-1 text-[11px] text-slate-500 inline-flex items-center gap-1">
              <FileSpreadsheet className="h-3 w-3" />
              {fileName}
              {busy && <span className="text-blue-600">(parsing…)</span>}
            </div>
          )}
        </div>
      </div>
      <div className="flex items-center gap-2">
        {onDownloadTemplate && (
          <Button variant="ghost" size="sm" onClick={onDownloadTemplate}>
            <Download className="h-3.5 w-3.5" /> Template
          </Button>
        )}
        <Button
          variant="primary"
          size="sm"
          onClick={() => inputRef.current?.click()}
        >
          Browse file
        </Button>
        <input
          ref={inputRef}
          type="file"
          accept={accept}
          hidden
          onChange={(e) => {
            const f = e.target.files?.[0];
            if (f) void handle(f);
            e.target.value = '';
          }}
        />
      </div>
    </div>
  );
}
