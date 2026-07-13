import { Link } from "react-router-dom";
import {
  ACTION_CATEGORY_LABELS,
  getLatestOpenActions,
  getOpenActionCount,
  type ActionItem,
} from "../../data/labHome";

interface Props {
  labId: number;
  actions: ActionItem[];
  onClose: () => void;
  maxItems?: number;
  onSelectAction?: (action: ActionItem) => void;
}

export function GtbActionsMenu({
  labId,
  actions,
  onClose,
  maxItems = 4,
  onSelectAction,
}: Props) {
  const openCount = getOpenActionCount(actions);
  const items = getLatestOpenActions(actions, maxItems);

  return (
    <div className="gtb__menu gtb__menu--feed" role="menu" aria-label="Actions">
      <p className="gtb__menu-summary">
        {openCount > 0
          ? `${openCount} open action item${openCount === 1 ? "" : "s"}`
          : "No open action items"}
      </p>

      {items.length === 0 ? (
        <p className="gtb__feed-empty">No open actions right now.</p>
      ) : (
        <ul className="gtb__feed-list">
          {items.map((action) => (
            <li key={action.id}>
              {onSelectAction ? (
                <button
                  type="button"
                  className="gtb__feed-item gtb__feed-item--action gtb__feed-item--btn"
                  role="menuitem"
                  onClick={() => {
                    onSelectAction(action);
                    onClose();
                  }}
                >
                  <span
                    className="gtb__feed-avatar"
                    style={{ backgroundColor: action.owner.color }}
                    aria-hidden
                  >
                    {action.owner.initials}
                  </span>
                  <span className="gtb__feed-item__main">
                    <span className="gtb__feed-item__title">
                      {action.title}
                      {(action.updateCount ?? 0) > 0 && (
                        <span className="gtb__feed-item__updates">{action.updateCount} new</span>
                      )}
                    </span>
                    <span className="gtb__feed-item__desc">{action.context}</span>
                  </span>
                  <span className="gtb__feed-item__meta">
                    <span className={`gtb__feed-pill gtb__feed-pill--${action.category}`}>
                      {ACTION_CATEGORY_LABELS[action.category]}
                    </span>
                  </span>
                </button>
              ) : (
                <Link
                  to={`/lab/${labId}/actions`}
                  className="gtb__feed-item gtb__feed-item--action"
                  role="menuitem"
                  onClick={onClose}
                >
                  <span
                    className="gtb__feed-avatar"
                    style={{ backgroundColor: action.owner.color }}
                    aria-hidden
                  >
                    {action.owner.initials}
                  </span>
                  <span className="gtb__feed-item__main">
                    <span className="gtb__feed-item__title">{action.title}</span>
                    <span className="gtb__feed-item__desc">{action.context}</span>
                  </span>
                  <span className="gtb__feed-item__meta">
                    <span className={`gtb__feed-pill gtb__feed-pill--${action.category}`}>
                      {ACTION_CATEGORY_LABELS[action.category]}
                    </span>
                  </span>
                </Link>
              )}
            </li>
          ))}
        </ul>
      )}

      <Link
        to={`/lab/${labId}/actions`}
        className="gtb__menu-footer"
        role="menuitem"
        onClick={onClose}
      >
        Open Actions
        <span aria-hidden>→</span>
      </Link>
    </div>
  );
}
