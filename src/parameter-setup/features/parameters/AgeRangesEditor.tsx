import { useEffect, useState } from 'react';
import type { AgeRange, AgeUnit } from '@/types';
import { Button } from '@/components/UI';
import { Plus, Trash2, X } from 'lucide-react';
import { defaultAgeRange } from '@/lib/parameterDefaults';

const AGE_UNITS: AgeUnit[] = ['Days', 'Months', 'Years'];

interface Props {
  open: boolean;
  parameterName: string;
  unit: string;
  initialRows: AgeRange[];
  onClose: () => void;
  onSave: (rows: AgeRange[]) => void;
}

/**
 * Mirrors the Crelio "Age Based Ranges" sub-grid: multiple rows per
 * parameter, each with Unit / Lower Age / Upper Age / Lower (M) /
 * Upper (M) / Lower (F) / Upper (F) / Descriptive (M) / Descriptive (F)
 * and a single Default radio selection.
 */
export function AgeRangesEditor({
  open,
  parameterName,
  unit,
  initialRows,
  onClose,
  onSave,
}: Props) {
  const [rows, setRows] = useState<AgeRange[]>(initialRows);

  useEffect(() => {
    if (open) setRows(initialRows.length ? initialRows : [defaultAgeRange({ isDefault: true })]);
  }, [open, initialRows]);

  if (!open) return null;

  const patch = (id: string, changes: Partial<AgeRange>) => {
    setRows((prev) => prev.map((r) => (r.id === id ? { ...r, ...changes } : r)));
  };

  const setDefault = (id: string) => {
    setRows((prev) => prev.map((r) => ({ ...r, isDefault: r.id === id })));
  };

  const addRow = () => {
    setRows((prev) => [
      ...prev,
      defaultAgeRange({ isDefault: prev.length === 0 }),
    ]);
  };

  const removeRow = (id: string) => {
    setRows((prev) => {
      const next = prev.filter((r) => r.id !== id);
      if (next.length > 0 && !next.some((r) => r.isDefault)) {
        next[0] = { ...next[0], isDefault: true };
      }
      return next;
    });
  };

  const handleSave = () => {
    const cleaned = rows.length === 0 ? [] : rows;
    if (cleaned.length > 0 && !cleaned.some((r) => r.isDefault)) {
      cleaned[0] = { ...cleaned[0], isDefault: true };
    }
    onSave(cleaned);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 p-4">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-[1180px] max-h-[85vh] flex flex-col">
        <div className="px-5 py-3 border-b border-slate-200 flex items-center justify-between">
          <div>
            <div className="text-[14px] font-semibold text-slate-800">
              Age-based ranges
            </div>
            <div className="text-[12px] text-slate-500">
              {parameterName || 'Parameter'}
              {unit ? ` · Unit: ${unit}` : ''}
              {' · '}
              {rows.length} row{rows.length === 1 ? '' : 's'}
            </div>
          </div>
          <button
            type="button"
            className="text-slate-400 hover:text-slate-700"
            onClick={onClose}
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        <div className="flex-1 overflow-auto">
          <table className="w-full text-[12px] border-collapse">
            <thead className="sticky top-0 bg-slate-50 z-10">
              <tr className="text-slate-600 border-b border-slate-200">
                <Th w={70}>Default</Th>
                <Th w={90}>Unit</Th>
                <Th w={100}>Lower Age</Th>
                <Th w={100}>Upper Age</Th>
                <Th w={100}>Lower (M)</Th>
                <Th w={100}>Upper (M)</Th>
                <Th w={100}>Lower (F)</Th>
                <Th w={100}>Upper (F)</Th>
                <Th>Descriptive (M)</Th>
                <Th>Descriptive (F)</Th>
                <Th w={40}></Th>
              </tr>
            </thead>
            <tbody>
              {rows.map((r) => (
                <tr key={r.id} className="border-b border-slate-100 hover:bg-slate-50/60">
                  <Td>
                    <input
                      type="radio"
                      name="age-range-default"
                      className="h-3.5 w-3.5 accent-blue-600"
                      checked={r.isDefault}
                      onChange={() => setDefault(r.id)}
                    />
                  </Td>
                  <Td>
                    <select
                      className="h-7 w-full rounded border border-slate-200 bg-white px-1 text-[12px]"
                      value={r.ageUnit}
                      onChange={(e) =>
                        patch(r.id, { ageUnit: e.target.value as AgeUnit })
                      }
                    >
                      {AGE_UNITS.map((u) => (
                        <option key={u} value={u}>
                          {u}
                        </option>
                      ))}
                    </select>
                  </Td>
                  <Td>
                    <NumInput value={r.lowerAge} onChange={(v) => patch(r.id, { lowerAge: v })} />
                  </Td>
                  <Td>
                    <NumInput value={r.upperAge} onChange={(v) => patch(r.id, { upperAge: v })} />
                  </Td>
                  <Td>
                    <TextInput value={r.lowerMale} onChange={(v) => patch(r.id, { lowerMale: v })} />
                  </Td>
                  <Td>
                    <TextInput value={r.upperMale} onChange={(v) => patch(r.id, { upperMale: v })} />
                  </Td>
                  <Td>
                    <TextInput value={r.lowerFemale} onChange={(v) => patch(r.id, { lowerFemale: v })} />
                  </Td>
                  <Td>
                    <TextInput value={r.upperFemale} onChange={(v) => patch(r.id, { upperFemale: v })} />
                  </Td>
                  <Td>
                    <TextInput
                      value={r.descriptiveMale}
                      onChange={(v) => patch(r.id, { descriptiveMale: v })}
                    />
                  </Td>
                  <Td>
                    <TextInput
                      value={r.descriptiveFemale}
                      onChange={(v) => patch(r.id, { descriptiveFemale: v })}
                    />
                  </Td>
                  <Td>
                    <button
                      type="button"
                      className="text-slate-400 hover:text-rose-600 p-1"
                      onClick={() => removeRow(r.id)}
                      title="Remove row"
                    >
                      <Trash2 className="h-3.5 w-3.5" />
                    </button>
                  </Td>
                </tr>
              ))}
              {rows.length === 0 && (
                <tr>
                  <td
                    colSpan={11}
                    className="text-center py-8 text-slate-500 text-[12px]"
                  >
                    No age ranges yet. Add one below.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        <div className="px-5 py-3 border-t border-slate-200 flex items-center justify-between">
          <Button size="sm" variant="secondary" onClick={addRow}>
            <Plus className="h-3.5 w-3.5" /> Add row
          </Button>
          <div className="flex items-center gap-2">
            <div className="text-[11px] text-slate-500 mr-2">
              1 year = 365 days, 1 month = 30 days
            </div>
            <Button size="sm" variant="secondary" onClick={onClose}>
              Cancel
            </Button>
            <Button size="sm" variant="primary" onClick={handleSave}>
              Save age ranges
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}

function Th({ children, w }: { children?: React.ReactNode; w?: number }) {
  return (
    <th
      className="text-left text-[11px] font-medium uppercase tracking-wide px-2 py-2"
      style={w ? { width: w } : undefined}
    >
      {children}
    </th>
  );
}

function Td({ children }: { children: React.ReactNode }) {
  return <td className="px-2 py-1 align-middle">{children}</td>;
}

function TextInput({ value, onChange }: { value: string; onChange: (v: string) => void }) {
  return (
    <input
      className="h-7 w-full rounded border border-slate-200 bg-white px-1.5 text-[12px] focus:border-blue-500 focus:outline-none"
      value={value}
      onChange={(e) => onChange(e.target.value)}
    />
  );
}

function NumInput({ value, onChange }: { value: string; onChange: (v: string) => void }) {
  return (
    <input
      type="number"
      className="h-7 w-full rounded border border-slate-200 bg-white px-1.5 text-[12px] focus:border-blue-500 focus:outline-none"
      value={value}
      onChange={(e) => onChange(e.target.value)}
    />
  );
}
