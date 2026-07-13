import { useMemo, useState } from "react";
import { useAccountManagement } from "../../context/AccountManagementContext";
import {
  ACCOUNT_LIST_DISPLAY_TOTAL,
  type AccountOrgType,
  type FinanceAccount,
} from "../../data/financeAccounts";

interface Props {
  labId: number;
}

const ORG_TABS: AccountOrgType[] = ["Walkin", "PrePaid", "PostPaid"];

const TABLE_COLUMNS = [
  "Name",
  "Contact No",
  "Email Id",
  "Business Type",
  "Org Type",
  "Login",
  "Assigned Ledger",
  "Actual Credit",
  "Credit Days",
] as const;

function formatCredit(amount: number) {
  const formatted = Math.abs(amount).toLocaleString("en-US");
  return amount < 0 ? `$ -${formatted}` : `$ ${formatted}`;
}

function RowActionsButton() {
  return (
    <button type="button" className="fin-acct-table__actions" aria-label="More actions">
      <svg viewBox="0 0 16 16" width="16" height="16" fill="currentColor" aria-hidden>
        <circle cx="8" cy="3.5" r="1.2" />
        <circle cx="8" cy="8" r="1.2" />
        <circle cx="8" cy="12.5" r="1.2" />
      </svg>
    </button>
  );
}

export function AccountListPage({ labId }: Props) {
  const { accounts } = useAccountManagement(labId);
  const [activeTab, setActiveTab] = useState<AccountOrgType>("PostPaid");
  const [search, setSearch] = useState("");

  const filteredAccounts = useMemo(() => {
    const query = search.trim().toLowerCase();
    return accounts.filter((account) => {
      if (account.orgType !== activeTab) return false;
      if (!query) return true;
      return (
        account.name.toLowerCase().includes(query) ||
        account.contactNo.includes(query) ||
        account.email.toLowerCase().includes(query)
      );
    });
  }, [accounts, activeTab, search]);

  const rowCountLabel =
    activeTab === "PostPaid" && !search.trim()
      ? ACCOUNT_LIST_DISPLAY_TOTAL
      : filteredAccounts.length;

  return (
    <div className="fin-acct-page">
      <section className="fin-acct-banner" aria-label="B2B payment collection">
        <div className="fin-acct-banner__content">
          <h2 className="fin-acct-banner__title">
            Streamline payment collection process for your B2B clients
          </h2>
          <p className="fin-acct-banner__text">
            Automated payment reminders and setup paywall for CC logins. Define limits for credits
            based on your business terms.
          </p>
        </div>
      </section>

      <div className="fin-acct-toolbar">
        <input
          type="search"
          className="fin-acct-toolbar__search"
          placeholder="Search Account Name / Contact Number"
          value={search}
          onChange={(event) => setSearch(event.target.value)}
          aria-label="Search accounts"
        />
        <div className="fin-acct-toolbar__actions">
          <button type="button" className="fin-acct-btn fin-acct-btn--outline">
            Disabled Accounts
          </button>
          <button type="button" className="fin-acct-btn fin-acct-btn--outline">
            Export
          </button>
          <button type="button" className="fin-acct-btn fin-acct-btn--primary">
            Add Account
          </button>
        </div>
      </div>

      <div className="fin-acct-tabs" role="tablist" aria-label="Account type">
        {ORG_TABS.map((tab) => (
          <button
            key={tab}
            type="button"
            role="tab"
            aria-selected={activeTab === tab}
            className={`fin-acct-tab${activeTab === tab ? " fin-acct-tab--active" : ""}`}
            onClick={() => setActiveTab(tab)}
          >
            {tab}
          </button>
        ))}
      </div>

      <div className="fin-acct-table-card">
        <div className="fin-acct-table-card__count">Rows: {rowCountLabel}</div>
        <div className="fin-acct-table-wrap">
          <table className="fin-acct-table">
            <thead>
              <tr>
                {TABLE_COLUMNS.map((column) => (
                  <th key={column}>
                    <span>{column}</span>
                    <span className="fin-acct-table__filter" aria-hidden>
                      ▼
                    </span>
                  </th>
                ))}
                <th className="fin-acct-table__actions-col" aria-label="Actions" />
              </tr>
            </thead>
            <tbody>
              {filteredAccounts.length > 0 ? (
                filteredAccounts.map((account) => (
                  <AccountRow key={account.id} account={account} />
                ))
              ) : (
                <tr>
                  <td colSpan={TABLE_COLUMNS.length + 1} className="fin-acct-table__empty">
                    No accounts found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

function AccountRow({ account }: { account: FinanceAccount }) {
  return (
    <tr>
      <td className="fin-acct-table__name">{account.name}</td>
      <td>{account.contactNo}</td>
      <td className="fin-acct-table__email">{account.email}</td>
      <td>{account.businessType}</td>
      <td>{account.orgType}</td>
      <td>
        {account.loginBadge ? (
          <span className="fin-acct-badge">{account.loginBadge}</span>
        ) : (
          "-"
        )}
      </td>
      <td>{account.assignedLedger}</td>
      <td className="fin-acct-table__credit">{formatCredit(account.actualCredit)}</td>
      <td>{account.creditDays}</td>
      <td className="fin-acct-table__actions-col">
        <RowActionsButton />
      </td>
    </tr>
  );
}
