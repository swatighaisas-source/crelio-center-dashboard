import { clsx } from 'clsx';
import {
  ChevronDown,
  ChevronLeft,
  Link2,
  ListChecks,
  Menu,
  RotateCcw,
  Search,
  SlidersHorizontal,
} from 'lucide-react';
import { useState, type ReactNode } from 'react';

export type TabKey = 'tests' | 'parameters' | 'mappings' | 'reports';

interface NavItem {
  key: TabKey;
  label: string;
  icon: typeof ListChecks;
}

interface NavSection {
  id: string;
  label: string;
  items: NavItem[];
}

const NAV_SECTIONS: NavSection[] = [
  {
    id: 'lab-onboarding',
    label: 'Lab onboarding',
    items: [
      { key: 'parameters', label: 'Parameter Library', icon: SlidersHorizontal },
      { key: 'mappings', label: 'Assign Parameters', icon: Link2 },
    ],
  },
];

interface Props {
  active: TabKey;
  onNavigate: (k: TabKey) => void;
  onResetDemo: () => void;
}

export function AppSidebar({ active, onNavigate, onResetDemo }: Props) {
  const [collapsed, setCollapsed] = useState(false);
  const [openSections, setOpenSections] = useState<Record<string, boolean>>(() =>
    Object.fromEntries(NAV_SECTIONS.map((s) => [s.id, true])),
  );
  const [search, setSearch] = useState('');

  const q = search.trim().toLowerCase();
  const sectionsToRender = NAV_SECTIONS.map((s) => ({
    ...s,
    items: q
      ? s.items.filter((i) => i.label.toLowerCase().includes(q))
      : s.items,
  })).filter((s) => s.items.length > 0);

  return (
    <aside
      className={clsx(
        'shrink-0 flex flex-col border-r border-slate-700/80 bg-[#1a2332] text-slate-200 h-full min-h-0 transition-[width] duration-200',
        collapsed ? 'w-[52px]' : 'w-[260px]',
      )}
    >
      {/* Brand — Crelio-style: name + accent */}
      <div className="h-12 flex items-center gap-2 px-3 border-b border-slate-700/80 bg-[#151c2a]">
        <div className="h-8 w-8 rounded bg-emerald-600 flex items-center justify-center shrink-0 shadow-sm">
          <span className="text-white text-[11px] font-bold leading-none">CH</span>
        </div>
        {!collapsed && (
          <div className="min-w-0">
            <div className="text-[13px] font-semibold text-white leading-tight truncate">
              CrelioHealth
            </div>
            <div className="text-[10px] text-slate-500 truncate">Lab Setup</div>
          </div>
        )}
      </div>

      {!collapsed && (
        <div className="px-2 py-2 border-b border-slate-700/50">
          <div className="text-[11px] text-slate-500 mb-1">Hello, Lab User</div>
          <div className="relative">
            <Search className="absolute left-2 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-slate-500" />
            <input
              type="search"
              placeholder="Navigation search"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full h-8 pl-8 pr-2 rounded bg-[#0f1623] border border-slate-600/50 text-[12px] text-slate-200 placeholder:text-slate-600 focus:outline-none focus:border-blue-500/60"
            />
          </div>
        </div>
      )}

      <div className="flex-1 overflow-y-auto scrollbar-thin py-1">
        {sectionsToRender.map((section) => {
          const open = openSections[section.id] ?? true;
          return (
            <div key={section.id} className="pb-1">
              {!collapsed && (
                <button
                  type="button"
                  onClick={() =>
                    setOpenSections((prev) => ({
                      ...prev,
                      [section.id]: !open,
                    }))
                  }
                  className="w-full flex items-center justify-between px-3 py-2 text-[11px] font-semibold uppercase tracking-wide text-slate-500 hover:text-slate-400"
                >
                  <span className="truncate">{section.label}</span>
                  <ChevronDown
                    className={clsx(
                      'h-4 w-4 transition-transform',
                      !open && '-rotate-90',
                    )}
                  />
                </button>
              )}

              {(collapsed || open) && (
                <nav
                  className={clsx('px-1.5 space-y-0.5', collapsed && 'px-1')}
                >
                  {section.items.map((item) => {
                    const Icon = item.icon;
                    const isActive = active === item.key;
                    return (
                      <button
                        key={item.key}
                        type="button"
                        title={collapsed ? item.label : undefined}
                        onClick={() => onNavigate(item.key)}
                        className={clsx(
                          'w-full flex items-center gap-2 rounded-md py-2 text-left text-[13px] transition-colors',
                          collapsed ? 'justify-center px-0' : 'px-2.5',
                          isActive
                            ? 'bg-blue-600 text-white shadow-md'
                            : 'text-slate-300 hover:bg-slate-700/80 hover:text-white',
                        )}
                      >
                        <Icon className="h-4 w-4 shrink-0 opacity-90" />
                        {!collapsed && (
                          <span className="truncate">{item.label}</span>
                        )}
                      </button>
                    );
                  })}
                </nav>
              )}
            </div>
          );
        })}
      </div>

      <div className="mt-auto border-t border-slate-700/80 p-2 space-y-1">
        <button
          type="button"
          onClick={() => setCollapsed((c) => !c)}
          className={clsx(
            'w-full flex items-center gap-2 rounded py-2 text-[12px] text-slate-400 hover:bg-slate-700/50 hover:text-slate-200',
            collapsed ? 'justify-center' : 'px-2',
          )}
        >
          {collapsed ? (
            <Menu className="h-4 w-4" />
          ) : (
            <>
              <ChevronLeft className="h-4 w-4" />
              <span>Collapse</span>
            </>
          )}
        </button>
        <button
          type="button"
          onClick={onResetDemo}
          className={clsx(
            'w-full flex items-center gap-2 rounded py-2 text-[12px] text-slate-400 hover:bg-slate-700/50 hover:text-amber-200/90',
            collapsed ? 'justify-center' : 'px-2',
          )}
          title="Reset demo data"
        >
          <RotateCcw className="h-4 w-4 shrink-0" />
          {!collapsed && <span>Reset demo</span>}
        </button>
      </div>
    </aside>
  );
}

export function AppMainToolbar({
  children,
  right,
}: {
  children?: ReactNode;
  right?: ReactNode;
}) {
  return (
    <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-200 bg-white px-6 py-2.5">
      <div className="flex flex-wrap items-center gap-2 min-w-0">{children}</div>
      {right && (
        <div className="flex flex-wrap items-center gap-2 min-w-0 flex-1 justify-end">
          {right}
        </div>
      )}
    </div>
  );
}
