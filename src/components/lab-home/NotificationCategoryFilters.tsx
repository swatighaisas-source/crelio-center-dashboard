import {
  formatNotificationCategoryLine,
  NOTIFICATION_CATEGORIES,
  type NotificationCategory,
} from "../../data/labHome";

interface Props {
  active: Set<NotificationCategory>;
  counts: Partial<Record<NotificationCategory, number>>;
  onChange: (categories: Set<NotificationCategory>) => void;
}

export function NotificationCategoryFilters({ active, counts, onChange }: Props) {
  const allSelected = active.size === 0;

  function toggleCategory(category: NotificationCategory) {
    const next = new Set(active);
    if (next.has(category)) {
      next.delete(category);
    } else {
      next.add(category);
    }
    onChange(next);
  }

  function selectAll() {
    onChange(new Set());
  }

  return (
    <div className="na-notif-category-filters" role="group" aria-label="Filter by category">
      <button
        type="button"
        className={`na-notif-category-chip${allSelected ? " na-notif-category-chip--active" : ""}`}
        aria-pressed={allSelected}
        onClick={selectAll}
      >
        All
      </button>
      {NOTIFICATION_CATEGORIES.map((category) => {
        const count = counts[category] ?? 0;
        const isActive = active.has(category);
        if (count === 0 && !isActive) return null;

        return (
          <button
            key={category}
            type="button"
            className={`na-notif-category-chip${isActive ? " na-notif-category-chip--active" : ""}`}
            aria-pressed={isActive}
            onClick={() => toggleCategory(category)}
          >
            {formatNotificationCategoryLine(category)}
            {count > 0 && <span className="na-notif-category-chip__count">{count}</span>}
          </button>
        );
      })}
    </div>
  );
}
