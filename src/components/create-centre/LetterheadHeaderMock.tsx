/** Static mock preview for report header upload area */
export function LetterheadHeaderMock() {
  return (
    <div className="letterhead-header-mock">
      <div className="letterhead-header-mock__toolbar">
        <div className="letterhead-header-mock__toggles">
          <span className="letterhead-header-mock__toggle letterhead-header-mock__toggle--active">
            ☰
          </span>
          <span className="letterhead-header-mock__toggle">▦</span>
        </div>
        <select className="letterhead-header-mock__select" defaultValue="all" disabled>
          <option>All Transactions</option>
        </select>
        <div className="letterhead-header-mock__search">
          <span className="letterhead-header-mock__search-icon">⌕</span>
          <span>Search a transaction</span>
        </div>
      </div>
      <p className="letterhead-header-mock__notice">
        Recent transactions may take up to 2 hours to reflect here. *Closing Balance = Account
        Balance + Amount on Hold (if any)
      </p>
      <div className="letterhead-header-mock__row">
        <span className="letterhead-header-mock__date">08 Apr 2026</span>
        <span className="letterhead-header-mock__desc">
          NEFT CR-UTIB0001506-RAZORPAY PAYMENTS SOLUTIONS INDIA PRIVATE LIMITED...
        </span>
        <span className="letterhead-header-mock__amount">
          ₹1,54,730.78 <span className="letterhead-header-mock__arrow">↓</span>
        </span>
        <span className="letterhead-header-mock__balance">
          Closing balance <strong>₹27,32,498.16</strong>
        </span>
      </div>
    </div>
  );
}
