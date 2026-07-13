import { useState, useEffect } from "react";
import { getAccountNavShortcutItems } from "../../data/accountOverview";
import { AccountNavIcon } from "./AccountNavIcon";

interface Props {
  open: boolean;
  onClose: () => void;
  initialShortcuts: string[];
  onSave: (shortcuts: string[]) => void;
}

export function CustomiseHomeModal({ open, onClose, initialShortcuts, onSave }: Props) {
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());

  useEffect(() => {
    if (open) {
      setSelectedIds(new Set(initialShortcuts));
    }
  }, [open, initialShortcuts]);

  if (!open) return null;

  const selectableItems = getAccountNavShortcutItems();

  const toggleSelection = (id: string) => {
    setSelectedIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  const handleSave = () => {
    const sortedShortcuts = selectableItems
      .filter((item) => selectedIds.has(item.id))
      .map((item) => item.id);
    onSave(sortedShortcuts);
  };

  return (
    <div className="lab-profile-modal-overlay">
      <div
        className="lab-profile-modal"
        role="dialog"
        aria-modal="true"
        aria-labelledby="customise-modal-title"
      >
        <header className="lab-profile-modal__header">
          <h2 id="customise-modal-title" className="lab-profile-modal__title">
            Customise Home Shortcuts
          </h2>
          <button type="button" className="lab-profile-modal__close" onClick={onClose} aria-label="Close">
            <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2">
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </header>
        <div className="lab-profile-modal__content">
          <p style={{ margin: "0 0 16px", color: "#666", fontSize: "14px" }}>
            Select items from the navigation menu to pin as shortcuts on your Home screen.
          </p>
          <div style={{ display: "grid", gap: "12px", maxHeight: "400px", overflowY: "auto" }}>
            {selectableItems.map((item) => {
              const isSelected = selectedIds.has(item.id);
              return (
                <label
                  key={item.id}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "12px",
                    padding: "10px",
                    border: "1px solid #e5e7eb",
                    borderRadius: "8px",
                    cursor: "pointer",
                    backgroundColor: isSelected ? "#eff6ff" : "#fff",
                    borderColor: isSelected ? "#3b71ca" : "#e5e7eb",
                  }}
                >
                  <input
                    type="checkbox"
                    checked={isSelected}
                    onChange={() => toggleSelection(item.id)}
                    style={{
                      width: "16px",
                      height: "16px",
                      accentColor: "#3b71ca",
                    }}
                  />
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      width: "28px",
                      height: "28px",
                      borderRadius: "6px",
                      backgroundColor: isSelected ? "#3b71ca" : "#f3f4f6",
                      color: isSelected ? "#fff" : "#4b5563",
                    }}
                  >
                    <AccountNavIcon id={item.icon} active={isSelected} />
                  </div>
                  <span style={{ fontSize: "14px", color: "#1f2937", fontWeight: isSelected ? 500 : 400 }}>
                    {item.label}
                  </span>
                </label>
              );
            })}
          </div>
        </div>
        <footer className="lab-profile-modal__footer">
          <button type="button" className="lab-profile-modal__btn lab-profile-modal__btn--cancel" onClick={onClose}>
            Cancel
          </button>
          <button type="button" className="lab-profile-modal__btn lab-profile-modal__btn--save" onClick={handleSave}>
            Save Shortcuts
          </button>
        </footer>
      </div>
    </div>
  );
}
