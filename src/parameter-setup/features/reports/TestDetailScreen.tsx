import { useState } from 'react';
import { clsx } from 'clsx';
import { ChevronRight } from 'lucide-react';
import { useStore } from '@/lib/store';
import { Badge, Button, EmptyState } from '@/components/UI';
import { ReportParametersTab } from './ReportParametersTab';

type DetailTab =
  | 'info'
  | 'parameters'
  | 'supplementary'
  | 'templating'
  | 'parentMapping'
  | 'reportSettings';

const TABS: { id: DetailTab; label: string }[] = [
  { id: 'info', label: 'Test Information' },
  { id: 'parameters', label: 'Report Parameters' },
  { id: 'supplementary', label: 'Supplementary Test' },
  { id: 'templating', label: 'Report Templating' },
  { id: 'parentMapping', label: 'Parent Test Mapping' },
  { id: 'reportSettings', label: 'Report Settings' },
];

interface Props {
  testId: string;
  onBackToList: () => void;
  pushToast: (
    message: string,
    tone?: 'success' | 'info' | 'warning' | 'danger',
  ) => void;
}

export function TestDetailScreen({ testId, onBackToList, pushToast }: Props) {
  const { state } = useStore();
  const [tab, setTab] = useState<DetailTab>('parameters');

  const test = state.tests.find((t) => t.id === testId);
  if (!test) {
    return (
      <div className="p-6">
        <EmptyState
          title="Test not found"
          description="This test may have been deleted."
          action={
            <Button variant="secondary" size="sm" onClick={onBackToList}>
              Back to Test List
            </Button>
          }
        />
      </div>
    );
  }

  return (
    <div className="flex flex-col min-h-0 flex-1 bg-white">
      {/* Breadcrumb bar */}
      <div className="px-5 py-2 border-b border-slate-200 bg-slate-50/60 flex items-center justify-between">
        <div className="flex items-center gap-1 text-[12.5px] text-slate-600">
          <button
            type="button"
            onClick={onBackToList}
            className="hover:text-blue-700 hover:underline"
          >
            Test List
          </button>
          <ChevronRight className="h-3 w-3 text-slate-400" />
          <span className="text-slate-900 font-medium">Edit Report</span>
        </div>
        <div className="flex items-center gap-2">
          <button
            type="button"
            className="text-[12px] text-blue-600 hover:underline"
            disabled
            title="Placeholder"
          >
            Go to old version
          </button>
          <Button variant="secondary" size="sm" disabled>
            Audit Trail
          </Button>
          <Button variant="secondary" size="sm" disabled>
            Preview Report
          </Button>
          <Button variant="primary" size="sm" disabled>
            Save Changes
          </Button>
        </div>
      </div>

      {/* Title + code */}
      <div className="px-5 py-3 border-b border-slate-200 flex items-center gap-3">
        <h2 className="text-[15px] font-semibold text-slate-900">{test.name}</h2>
        <span className="text-[12.5px] text-slate-500">— {test.code}</span>
        {test.validationStatus !== 'Verified' && (
          <Badge tone="warning">Not Verified</Badge>
        )}
      </div>

      {/* Sub-tabs */}
      <div className="px-5 border-b border-slate-200">
        <div className="flex items-center gap-0 overflow-x-auto">
          {TABS.map((t) => (
            <button
              key={t.id}
              type="button"
              onClick={() => setTab(t.id)}
              className={clsx(
                'px-3 py-2 text-[12.5px] border-b-2 -mb-px transition-colors whitespace-nowrap',
                tab === t.id
                  ? 'border-blue-600 text-blue-700 font-medium'
                  : 'border-transparent text-slate-600 hover:text-slate-900',
              )}
            >
              {t.label}
            </button>
          ))}
        </div>
      </div>

      <div className="flex-1 min-h-0 flex flex-col">
        {tab === 'parameters' && (
          <ReportParametersTab testId={testId} pushToast={pushToast} />
        )}
        {tab !== 'parameters' && (
          <div className="flex-1 flex items-center justify-center p-6">
            <EmptyState
              title={`${TABS.find((x) => x.id === tab)?.label ?? ''} — coming soon`}
              description="This tab is a placeholder in the current demo. Report Parameters is the primary focus of this flow."
            />
          </div>
        )}
      </div>
    </div>
  );
}
