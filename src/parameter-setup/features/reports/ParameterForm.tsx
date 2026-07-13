import { useMemo, useState } from 'react';
import { clsx } from 'clsx';
import { BookPlus, Library } from 'lucide-react';
import { Badge, Button, Input, Label } from '@/components/UI';
import type { Parameter } from '@/types';

export type ParameterFormMode = 'edit' | 'create';

interface Props {
  mode: ParameterFormMode;
  /**
   * For `edit` mode: the current values. For `create` mode: an empty draft
   * (already has id set by parent).
   */
  value: Parameter;
  onChange: (next: Parameter) => void;
  /** Present on `edit` mode — true when this parameter is linked to a library row. */
  linkedLibraryParameterName?: string;
  /** Available library parameter names for the "Linked Parameters" select (multi-line). */
  libraryParameterNames?: string[];
  /** For `create` mode only: shown as the "Add this parameter to library" checkbox. */
  addToLibrary?: boolean;
  onToggleAddToLibrary?: (next: boolean) => void;
  /**
   * For `edit` mode on an independent parameter: render an "Add to Library"
   * affordance in the header. Undefined hides the button.
   */
  onAddToLibrary?: () => void;
  onSave: () => void;
  onCancel?: () => void;
}

type SubTab = 'normal' | 'critical' | 'calculation' | 'rerun';

export function ParameterForm({
  mode,
  value,
  onChange,
  linkedLibraryParameterName,
  libraryParameterNames = [],
  addToLibrary,
  onToggleAddToLibrary,
  onAddToLibrary,
  onSave,
  onCancel,
}: Props) {
  const [subTab, setSubTab] = useState<SubTab>('normal');

  const set = <K extends keyof Parameter>(key: K, v: Parameter[K]) => {
    onChange({ ...value, [key]: v });
  };

  const isLinked = Boolean(linkedLibraryParameterName);

  const tabs = useMemo(
    () => [
      { id: 'normal' as const, label: 'Normal Ranges' },
      { id: 'critical' as const, label: 'Critical Ranges' },
      { id: 'calculation' as const, label: 'Calculation' },
      { id: 'rerun' as const, label: 'Rerun' },
    ],
    [],
  );

  return (
    <div className="flex flex-col h-full min-h-0">
      <div className="flex items-center justify-between gap-3 px-4 py-3 border-b border-slate-200">
        <div className="flex items-center gap-2 min-w-0">
          <h3 className="text-[14px] font-semibold text-slate-900">
            Parameters information
          </h3>
          {isLinked && (
            <span
              className="inline-flex items-center gap-1 text-[12px] text-blue-600 truncate"
              title={`This parameter is shared from the library (“${linkedLibraryParameterName}”). Saving lets you update it across every test that uses it, or keep a separate copy just for this test.`}
            >
              <Library className="h-3.5 w-3.5 shrink-0" />
              <span className="truncate">Shared across tests</span>
            </span>
          )}
          {mode === 'create' && (
            <Badge tone="warning">Unsaved</Badge>
          )}
        </div>
        <div className="flex items-center gap-3 text-[12px] shrink-0">
          {mode === 'edit' && !isLinked && onAddToLibrary && (
            <button
              type="button"
              onClick={onAddToLibrary}
              className="inline-flex items-center gap-1 text-blue-600 hover:text-blue-700 hover:underline"
              title="Add this parameter to the shared library so other tests can reuse it. Once added, edits sync across every linked test."
            >
              <BookPlus className="h-3.5 w-3.5" />
              Add to library
            </button>
          )}
          <button
            type="button"
            className="text-slate-400 hover:text-slate-600 disabled:opacity-60"
            disabled
            title="Coming soon"
          >
            Duplicate/Copy
          </button>
        </div>
      </div>

      <div className="flex-1 min-h-0 overflow-auto p-4 space-y-4">
        {/* Row: Name + Unit */}
        <div className="grid grid-cols-2 gap-3">
          <div>
            <Label>Name *</Label>
            <Input
              value={value.name}
              onChange={(e) => set('name', e.target.value)}
              placeholder="Enter parameter name"
            />
          </div>
          <div>
            <Label>Unit</Label>
            <Input
              value={value.unit}
              onChange={(e) => set('unit', e.target.value)}
              placeholder="Enter the Value Unit"
            />
          </div>
        </div>

        {/* Row: Method */}
        <div>
          <Label>Method</Label>
          <Input
            value={value.method}
            onChange={(e) => set('method', e.target.value)}
            placeholder="Enter the Method Name"
          />
        </div>

        {/* Row: Integration + LOINC */}
        <div className="grid grid-cols-2 gap-3">
          <div>
            <Label>Integration Code</Label>
            <Input
              value={value.integrationCode}
              onChange={(e) => set('integrationCode', e.target.value)}
              placeholder="Enter the Integration Code"
            />
          </div>
          <div>
            <Label>LOINC Code</Label>
            <Input
              value={value.loincCode}
              onChange={(e) => set('loincCode', e.target.value)}
              placeholder="Enter LOINC Code"
            />
          </div>
        </div>

        {/* Row: Dictionary + Linked Parameters */}
        <div className="grid grid-cols-2 gap-3">
          <div>
            <Label>Dictionary</Label>
            <select
              className="w-full h-9 rounded-md border border-slate-300 bg-white px-2 text-[13px] text-slate-700"
              value={value.dictionary}
              onChange={(e) => set('dictionary', e.target.value)}
            >
              <option value="">Select Dictionary</option>
              <option value="Pathology">Pathology</option>
              <option value="Radiology">Radiology</option>
              <option value="Microbiology">Microbiology</option>
            </select>
          </div>
          <div>
            <Label>
              Linked Parameters{' '}
              <span className="text-slate-400 font-normal">
                (any update will propagate)
              </span>
            </Label>
            <select
              className="w-full h-9 rounded-md border border-slate-300 bg-white px-2 text-[13px] text-slate-700"
              value={value.linkedParameters}
              onChange={(e) => set('linkedParameters', e.target.value)}
            >
              <option value="">Select Parameter to link</option>
              {libraryParameterNames.map((n) => (
                <option key={n} value={n}>
                  {n}
                </option>
              ))}
            </select>
            <p className="text-[11px] text-slate-500 mt-1">
              Any update to this parameter will update the linked parameter as
              well (Remove existing linking to link another parameter).
            </p>
          </div>
        </div>

        {/* Sub-tabs for ranges / calc / rerun */}
        <div className="pt-2 border-t border-slate-200">
          <div className="flex items-center gap-1 border-b border-slate-200">
            {tabs.map((t) => (
              <button
                key={t.id}
                type="button"
                onClick={() => setSubTab(t.id)}
                className={clsx(
                  'px-3 py-2 text-[12.5px] border-b-2 -mb-px transition-colors',
                  subTab === t.id
                    ? 'border-blue-600 text-blue-700 font-medium'
                    : 'border-transparent text-slate-600 hover:text-slate-900',
                )}
              >
                {t.label}
              </button>
            ))}
          </div>

          <div className="pt-4">
            {subTab === 'normal' && (
              <div className="space-y-3">
                <div className="grid grid-cols-[120px_1fr_1fr] items-center gap-3">
                  <Label className="mb-0">Male Range</Label>
                  <Input
                    value={value.maleLowerRange}
                    onChange={(e) => set('maleLowerRange', e.target.value)}
                    placeholder="Lower Range"
                  />
                  <Input
                    value={value.maleUpperRange}
                    onChange={(e) => set('maleUpperRange', e.target.value)}
                    placeholder="Upper Range"
                  />
                </div>
                <div className="grid grid-cols-[120px_1fr_1fr] items-center gap-3">
                  <Label className="mb-0">Female Range</Label>
                  <Input
                    value={value.femaleLowerRange}
                    onChange={(e) => set('femaleLowerRange', e.target.value)}
                    placeholder="Lower Range"
                  />
                  <Input
                    value={value.femaleUpperRange}
                    onChange={(e) => set('femaleUpperRange', e.target.value)}
                    placeholder="Upper Range"
                  />
                </div>
              </div>
            )}

            {subTab === 'critical' && (
              <div className="space-y-3">
                <div className="grid grid-cols-[120px_1fr_1fr] items-center gap-3">
                  <Label className="mb-0">Male Critical</Label>
                  <Input
                    value={value.criticalLowMale}
                    onChange={(e) => set('criticalLowMale', e.target.value)}
                    placeholder="Low"
                  />
                  <Input
                    value={value.criticalHighMale}
                    onChange={(e) => set('criticalHighMale', e.target.value)}
                    placeholder="High"
                  />
                </div>
                <div className="grid grid-cols-[120px_1fr_1fr] items-center gap-3">
                  <Label className="mb-0">Female Critical</Label>
                  <Input
                    value={value.criticalLowFemale}
                    onChange={(e) => set('criticalLowFemale', e.target.value)}
                    placeholder="Low"
                  />
                  <Input
                    value={value.criticalHighFemale}
                    onChange={(e) => set('criticalHighFemale', e.target.value)}
                    placeholder="High"
                  />
                </div>
              </div>
            )}

            {subTab === 'calculation' && (
              <div className="space-y-3">
                <div>
                  <Label>Formula Preset</Label>
                  <Input
                    value={value.formulaPreset}
                    onChange={(e) => set('formulaPreset', e.target.value)}
                    placeholder="e.g. MCV, MCH"
                  />
                </div>
                <div>
                  <Label>Formula</Label>
                  <Input
                    value={value.formula}
                    onChange={(e) => set('formula', e.target.value)}
                    placeholder="e.g. (HCT / RBC) * 10"
                  />
                </div>
              </div>
            )}

            {subTab === 'rerun' && (
              <div className="space-y-2 text-[13px] text-slate-700">
                <label className="inline-flex items-center gap-2">
                  <input
                    type="checkbox"
                    checked={value.rerunAuto}
                    onChange={(e) => set('rerunAuto', e.target.checked)}
                  />
                  Auto Rerun
                </label>
                <br />
                <label className="inline-flex items-center gap-2">
                  <input
                    type="checkbox"
                    checked={value.rerunManual}
                    onChange={(e) => set('rerunManual', e.target.checked)}
                  />
                  Manual Rerun
                </label>
              </div>
            )}
          </div>
        </div>

        {/* Other info flags */}
        <div className="pt-3 border-t border-slate-200">
          <div className="text-[12px] font-medium text-slate-600 mb-2">
            Other Info
          </div>
          <div className="grid grid-cols-3 gap-x-4 gap-y-2 text-[12.5px] text-slate-700">
            <FlagCheckbox
              label="Hide Parameter"
              checked={value.hideParameter}
              onChange={(c) => set('hideParameter', c)}
            />
            <FlagCheckbox
              label="Customized Parameter"
              checked={value.customizedParameter}
              onChange={(c) => set('customizedParameter', c)}
            />
            <FlagCheckbox
              label="Highlight this value"
              checked={value.highlightThisValue}
              onChange={(c) => set('highlightThisValue', c)}
            />
            <FlagCheckbox
              label="Underline this value"
              checked={value.underlineThisValue}
              onChange={(c) => set('underlineThisValue', c)}
            />
            <FlagCheckbox
              label="Optional field"
              checked={value.optionalField}
              onChange={(c) => set('optionalField', c)}
            />
            <FlagCheckbox
              label="Has Impressions"
              checked={value.hasImpressions}
              onChange={(c) => set('hasImpressions', c)}
            />
            <FlagCheckbox
              label="Hide Parameter Trends"
              checked={value.hideParameterTrends}
              onChange={(c) => set('hideParameterTrends', c)}
            />
          </div>
        </div>

        {/* Create-only: Add to library checkbox */}
        {mode === 'create' && onToggleAddToLibrary && (
          <div className="pt-3 border-t border-slate-200">
            <label className="inline-flex items-start gap-2 text-[13px] text-slate-800">
              <input
                type="checkbox"
                className="mt-0.5"
                checked={Boolean(addToLibrary)}
                onChange={(e) => onToggleAddToLibrary(e.target.checked)}
              />
              <span>
                <span className="font-medium">Also add to the shared library</span>
                <span className="block text-[12px] text-slate-500">
                  Makes this parameter reusable across tests — edit it once and
                  the change applies everywhere it’s used. Leave off to keep it
                  only in this test.
                </span>
              </span>
            </label>
          </div>
        )}
      </div>

      <div className="shrink-0 flex items-center justify-end gap-2 px-4 py-3 border-t border-slate-200 bg-slate-50/60">
        {onCancel && (
          <Button variant="ghost" size="sm" onClick={onCancel}>
            Cancel
          </Button>
        )}
        <Button variant="primary" size="sm" onClick={onSave}>
          {mode === 'create' ? 'Save Parameter' : 'Save Changes'}
        </Button>
      </div>
    </div>
  );
}

function FlagCheckbox({
  label,
  checked,
  onChange,
}: {
  label: string;
  checked: boolean;
  onChange: (c: boolean) => void;
}) {
  return (
    <label className="inline-flex items-center gap-2">
      <input
        type="checkbox"
        checked={checked}
        onChange={(e) => onChange(e.target.checked)}
      />
      <span>{label}</span>
    </label>
  );
}
