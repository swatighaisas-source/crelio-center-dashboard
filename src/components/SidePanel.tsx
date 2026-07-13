export function SidePanel() {
  return (
    <aside className="side-panel" aria-label="Grid tools">
      <button type="button" className="side-panel__tab">
        Columns
      </button>
      <button type="button" className="side-panel__tab">
        Filters
      </button>
    </aside>
  );
}
