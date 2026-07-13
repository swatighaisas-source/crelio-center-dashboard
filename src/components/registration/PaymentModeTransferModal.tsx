import { useEffect, useMemo, useState } from "react";
import { formatPaymentModeLabel } from "../../data/paymentModes";
import type { FinanceAccount } from "../../data/financeAccounts";

interface Props {
  disabledModeName: string;
  affectedOrgs: FinanceAccount[];
  enabledModeOptions: { value: string; label: string }[];
  onTransfer: (accountIds: string[], newMode: string) => void;
  onCancel: () => void;
}

export function PaymentModeTransferModal({
  disabledModeName,
  affectedOrgs,
  enabledModeOptions,
  onTransfer,
  onCancel,
}: Props) {
  const [selectedOrgIds, setSelectedOrgIds] = useState<Set<string>>(
    () => new Set(affectedOrgs.map((org) => org.id)),
  );
  const [newMode, setNewMode] = useState(enabledModeOptions[0]?.value ?? "");

  useEffect(() => {
    setSelectedOrgIds(new Set(affectedOrgs.map((org) => org.id)));
    setNewMode(enabledModeOptions[0]?.value ?? "");
  }, [affectedOrgs, enabledModeOptions, disabledModeName]);

  useEffect(() => {
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") onCancel();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [onCancel]);

  const allSelected = useMemo(
    () => affectedOrgs.length > 0 && affectedOrgs.every((org) => selectedOrgIds.has(org.id)),
    [affectedOrgs, selectedOrgIds],
  );

  function toggleOrg(orgId: string) {
    setSelectedOrgIds((prev) => {
      const next = new Set(prev);
      if (next.has(orgId)) next.delete(orgId);
      else next.add(orgId);
      return next;
    });
  }

  function toggleAllOrgs() {
    setSelectedOrgIds(
      allSelected ? new Set() : new Set(affectedOrgs.map((org) => org.id)),
    );
  }

  function handleTransfer() {
    if (!newMode.trim() || selectedOrgIds.size === 0) return;
    onTransfer(Array.from(selectedOrgIds), newMode);
  }

  const canTransfer = selectedOrgIds.size > 0 && Boolean(newMode.trim());

  return (
    <div
      className="pay-modes-transfer-overlay"
      role="presentation"
      onClick={onCancel}
    >
      <div
        className="pay-modes-transfer-modal"
        role="dialog"
        aria-labelledby="pay-modes-transfer-title"
        aria-modal="true"
        onClick={(event) => event.stopPropagation()}
      >
        <header className="pay-modes-transfer-modal__header">
          <h2 id="pay-modes-transfer-title" className="pay-modes-transfer-modal__title">
            Transfer Default Payment Mode
          </h2>
          <button
            type="button"
            className="pay-modes-modal__close"
            onClick={onCancel}
            aria-label="Close"
          >
            ×
          </button>
        </header>

        <div className="pay-modes-transfer-modal__body">
          <p className="pay-modes-transfer-modal__intro">
            <strong>{formatPaymentModeLabel(disabledModeName)}</strong> is being disabled, but the
            following orgs use it as their default payment mode. Select orgs and choose a new default
            payment mode to transfer.
          </p>

          <div className="pay-modes-transfer-modal__orgs">
            <div className="pay-modes-transfer-modal__orgs-head">
              <span>Organisations</span>
              <label className="pay-modes-transfer-modal__select-all">
                <input
                  type="checkbox"
                  checked={allSelected}
                  onChange={toggleAllOrgs}
                />
                Select all
              </label>
            </div>
            <ul className="pay-modes-transfer-modal__org-list">
              {affectedOrgs.map((org) => (
                <li key={org.id}>
                  <label className="pay-modes-transfer-modal__org-item">
                    <input
                      type="checkbox"
                      checked={selectedOrgIds.has(org.id)}
                      onChange={() => toggleOrg(org.id)}
                    />
                    <span className="pay-modes-transfer-modal__org-name">{org.name}</span>
                    <span className="pay-modes-transfer-modal__org-mode">
                      {formatPaymentModeLabel(org.defaultPaymentMode)}
                    </span>
                  </label>
                </li>
              ))}
            </ul>
          </div>

          <label className="pay-modes-transfer-modal__target">
            <span>Transfer default payment mode to</span>
            {enabledModeOptions.length > 0 ? (
              <select
                value={newMode}
                onChange={(event) => setNewMode(event.target.value)}
                aria-label="New default payment mode"
              >
                {enabledModeOptions.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            ) : (
              <p className="pay-modes-transfer-modal__no-modes">
                No other enabled payment modes are available. Enable another mode before disabling
                this one.
              </p>
            )}
          </label>
        </div>

        <footer className="pay-modes-transfer-modal__footer">
          <button
            type="button"
            className="pay-modes-btn pay-modes-btn--secondary"
            onClick={onCancel}
          >
            Cancel
          </button>
          <button
            type="button"
            className="pay-modes-btn pay-modes-btn--primary"
            onClick={handleTransfer}
            disabled={!canTransfer}
          >
            Transfer
          </button>
        </footer>
      </div>
    </div>
  );
}
