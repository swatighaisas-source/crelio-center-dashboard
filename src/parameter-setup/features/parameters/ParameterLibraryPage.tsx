import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Eraser,
  Copy,
  Download,
  FileSpreadsheet,
  ListChecks,
  Sparkles,
} from 'lucide-react';
import { useStore } from '@/lib/store';
import { Button } from '@/components/UI';
import { ParameterSetup } from './ParameterSetup';
import { HowItWorksModal } from './HowItWorksModal';
import { HeaderDropdown } from './HeaderDropdown';
import { useParamPaths } from '@/nav/base';
import {
  downloadFlatParameterList,
  downloadTestWiseParameters,
} from '@/lib/excel';

/**
 * "Parameter Library" — the single library grid plus its header actions:
 * Assign, Cleanup (Unused / De-dupe / Missing fields), QC & Interfacing,
 * Bulk Download (flat / test-wise), Bulk Upload and Bulk Update.
 */
export function ParameterLibraryPage() {
  const { state } = useStore();
  const paths = useParamPaths();
  const navigate = useNavigate();
  const [bulkUpdate, setBulkUpdate] = useState(false);
  const [bulkUploadOpen, setBulkUploadOpen] = useState(false);
  const [howOpen, setHowOpen] = useState(false);
  const [saveProgress, setSaveProgress] = useState<number | null>(null);

  // Toggle bulk-edit on; or, when already on, run a save progress bar then exit.
  async function handleBulkUpdateClick() {
    if (!bulkUpdate) {
      setBulkUpdate(true);
      return;
    }
    setSaveProgress(0);
    const steps = 16;
    for (let i = 1; i <= steps; i++) {
      await new Promise((r) => setTimeout(r, 55));
      setSaveProgress(Math.round((i / steps) * 100));
    }
    setSaveProgress(null);
    setBulkUpdate(false);
  }

  return (
    <div className="flex flex-col flex-1 min-h-0">
      <HowItWorksModal open={howOpen} onClose={() => setHowOpen(false)} />

      <div className="px-6 pt-3 pb-3 border-b border-slate-200 bg-white shrink-0 flex items-center justify-between gap-3 flex-wrap">
        <button
          type="button"
          onClick={() => setHowOpen(true)}
          className="text-[13px] font-medium text-[#2563eb] hover:underline"
        >
          How it works?
        </button>

        <div className="flex items-center gap-2 flex-wrap justify-end">
          <HeaderDropdown
            label="Parameter Cleanup"
            icon={<Eraser className="h-4 w-4" />}
            items={[
              {
                label: 'Unused parameters',
                description: 'Parameters not mapped to any test',
                icon: <ListChecks className="h-4 w-4" />,
                onSelect: () => navigate(paths.cleanupUnused),
              },
              {
                label: 'De-duplication',
                description: 'Find & merge duplicate parameters',
                icon: <Copy className="h-4 w-4" />,
                onSelect: () => navigate(paths.cleanupDedupe),
              },
              {
                label: 'Missing fields',
                description: 'Parameters with blank important fields',
                icon: <Sparkles className="h-4 w-4" />,
                onSelect: () => navigate(paths.cleanupMissing),
              },
            ]}
          />

          <Button variant="secondary" onClick={() => navigate(paths.qcMapping)}>
            QC &amp; Interfacing
          </Button>

          <HeaderDropdown
            label="Bulk Download"
            icon={<Download className="h-4 w-4" />}
            items={[
              {
                label: 'Flat parameter list',
                description: 'One row per parameter (age bands expanded)',
                onSelect: () => downloadFlatParameterList(state.parameters),
              },
              {
                label: 'Test-wise parameters',
                description: 'One row per test–parameter mapping',
                onSelect: () =>
                  downloadTestWiseParameters(state.tests, state.parameters, state.mappings),
              },
            ]}
          />

          <Button variant="secondary" onClick={() => setBulkUploadOpen(true)}>
            <FileSpreadsheet className="h-4 w-4" /> Bulk Upload
          </Button>

          <Button variant="secondary" onClick={() => navigate(paths.assignParameters)}>
            Assign Parameters
          </Button>

          <Button
            variant="primary"
            disabled={saveProgress !== null}
            onClick={handleBulkUpdateClick}
          >
            {bulkUpdate ? 'Save changes' : 'Bulk Update'}
          </Button>
        </div>
      </div>

      <div className="flex-1 min-h-0 flex flex-col">
        <ParameterSetup
          bulkUpdate={bulkUpdate}
          bulkUploadOpen={bulkUploadOpen}
          onCloseBulkUpload={() => setBulkUploadOpen(false)}
          savingProgress={saveProgress}
        />
      </div>
    </div>
  );
}
