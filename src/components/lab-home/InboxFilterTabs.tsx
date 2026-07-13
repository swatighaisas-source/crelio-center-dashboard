interface InboxFilterTab<T extends string> {
  value: T;
  label: string;
  count: number;
}

interface Props<T extends string> {
  tabs: InboxFilterTab<T>[];
  active: T;
  onChange: (value: T) => void;
  ariaLabel: string;
}

export function InboxFilterTabs<T extends string>({
  tabs,
  active,
  onChange,
  ariaLabel,
}: Props<T>) {
  return (
    <nav className="na-inbox-tabs" aria-label={ariaLabel}>
      {tabs.map((tab) => {
        const isActive = tab.value === active;
        return (
          <button
            key={tab.value}
            type="button"
            className={`na-inbox-tab${isActive ? " na-inbox-tab--active" : ""}`}
            aria-selected={isActive}
            onClick={() => onChange(tab.value)}
          >
            {tab.label}
            <span
              className={`na-inbox-tab__badge${tab.count > 0 ? " na-inbox-tab__badge--filled" : ""}`}
            >
              {tab.count}
            </span>
          </button>
        );
      })}
    </nav>
  );
}
