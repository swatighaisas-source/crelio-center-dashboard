import { useEffect, useRef, useState } from 'react';
import { clsx } from 'clsx';
import { ChevronDown, ChevronRight, Library, Plus } from 'lucide-react';
import { Button } from '@/components/UI';
import type { ParameterCategory, ParameterType } from '@/types';

export interface CreateParamOption {
  type: ParameterType;
  category: ParameterCategory;
  /** Preset name (used for Style layout elements like "Page Break"). */
  name?: string;
}

interface MenuLeaf {
  label: string;
  type: ParameterType;
  name?: string;
}

interface MenuCategory {
  id: ParameterCategory;
  label: string;
  items: MenuLeaf[];
}

/** Category → parameter-type tree, mirroring the live Crelio "Add New Parameter" menu. */
const CATEGORIES: MenuCategory[] = [
  {
    id: 'Pathology',
    label: 'Pathology',
    items: [
      { label: 'Service With Normal Range', type: 'TestWithNormalRange' },
      { label: 'Service With Descriptive Range', type: 'TestWithDescriptiveRange' },
      { label: 'Service With Age Specific Range', type: 'TestWithAgeSpecificRange' },
      { label: 'Descriptive (No Ranges)', type: 'DescriptiveNoRanges' },
      { label: 'List Field', type: 'ListField' },
      { label: 'File', type: 'File' },
      { label: 'Graph', type: 'Graph' },
      { label: 'Image', type: 'Image' },
    ],
  },
  {
    id: 'Radiology',
    label: 'Radiology',
    items: [
      { label: 'Descriptive (No Ranges)', type: 'DescriptiveNoRanges' },
      { label: 'File', type: 'File' },
      { label: 'List Field', type: 'ListField' },
      { label: 'Image', type: 'Image' },
    ],
  },
  {
    id: 'Style',
    label: 'Style',
    // Layout elements — modelled as descriptive rows in this prototype.
    items: [
      { label: 'Heading With Separator Line', type: 'DescriptiveNoRanges', name: 'Heading With Separator Line' },
      { label: 'Heading', type: 'DescriptiveNoRanges', name: 'Heading' },
      { label: 'Heading In Center', type: 'DescriptiveNoRanges', name: 'Heading In Center' },
      { label: 'Space', type: 'DescriptiveNoRanges', name: 'Space' },
      { label: 'Separator Line', type: 'DescriptiveNoRanges', name: 'Separator Line' },
      { label: 'Page Break', type: 'DescriptiveNoRanges', name: 'Page Break' },
    ],
  },
];

interface Props {
  onCreate: (opt: CreateParamOption) => void;
  onImportFromLibrary: () => void;
}

export function AddParameterMenu({ onCreate, onImportFromLibrary }: Props) {
  const [open, setOpen] = useState(false);
  const [active, setActive] = useState<ParameterCategory | null>('Pathology');
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function onDoc(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    }
    if (open) document.addEventListener('mousedown', onDoc);
    return () => document.removeEventListener('mousedown', onDoc);
  }, [open]);

  function close() {
    setOpen(false);
    setActive('Pathology');
  }

  return (
    <div className="relative" ref={ref}>
      <Button variant="primary" size="sm" onClick={() => setOpen((o) => !o)}>
        <Plus className="h-3.5 w-3.5" />
        Add New Parameter
        <ChevronDown className="h-3.5 w-3.5 opacity-80" />
      </Button>

      {open && (
        <div className="absolute right-0 top-full mt-1 w-[212px] rounded-md border border-slate-200 bg-white shadow-lg z-30 py-1">
          {CATEGORIES.map((cat) => (
            <div
              key={cat.id}
              className="relative"
              onMouseEnter={() => setActive(cat.id)}
            >
              <button
                type="button"
                className={clsx(
                  'w-full flex items-center justify-between px-3 py-2 text-[13px]',
                  active === cat.id
                    ? 'bg-blue-50 text-blue-700 font-medium'
                    : 'text-slate-700 hover:bg-slate-50',
                )}
              >
                {cat.label}
                <ChevronRight className="h-3.5 w-3.5 opacity-70" />
              </button>

              {active === cat.id && (
                <div className="absolute right-full top-0 mr-px w-[280px] rounded-md border border-slate-200 bg-white shadow-lg py-1 max-h-[60vh] overflow-auto">
                  {cat.items.map((it) => (
                    <button
                      key={it.label}
                      type="button"
                      onClick={() => {
                        onCreate({ type: it.type, category: cat.id, name: it.name });
                        close();
                      }}
                      className="w-full text-left px-3 py-2 text-[13px] text-slate-700 hover:bg-blue-50 hover:text-blue-700"
                    >
                      {it.label}
                    </button>
                  ))}
                </div>
              )}
            </div>
          ))}

          {/* "Add from Library" sits below the categories */}
          <div
            className="mt-1 pt-1 border-t border-slate-100"
            onMouseEnter={() => setActive(null)}
          >
            <button
              type="button"
              onClick={() => {
                onImportFromLibrary();
                close();
              }}
              className="w-full flex items-center gap-2 px-3 py-2 text-[13px] text-blue-700 hover:bg-blue-50"
            >
              <Library className="h-3.5 w-3.5" />
              Add from Library
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
