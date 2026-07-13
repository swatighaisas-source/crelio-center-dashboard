import { useEffect, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { CENTER_USER_LOGIN_QUOTA, centerUserHref } from "../../data/centerUsers";
import { selectUserRoleHref } from "../../data/centerUserRoles";
import { useLabUsers } from "../../hooks/useLabUsers";
import "../../styles/user-management.css";

interface Props {
  labId: number;
}

function FilterIcon() {
  return (
    <svg className="um-table__filter" viewBox="0 0 12 12" width="11" height="11" aria-hidden>
      <path
        d="M1.25 2.25h9.5L7.5 6.25v3.25L4.5 10.5V6.25L1.25 2.25z"
        fill="currentColor"
      />
    </svg>
  );
}

function InfoIcon() {
  return (
    <svg className="um-header__info-icon" viewBox="0 0 14 14" width="14" height="14" aria-hidden>
      <circle cx="7" cy="7" r="6" fill="none" stroke="currentColor" strokeWidth="1.2" />
      <path d="M7 6.25V10" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" />
      <circle cx="7" cy="4.25" r="0.75" fill="currentColor" />
    </svg>
  );
}

function AddUserIcon() {
  return (
    <svg viewBox="0 0 16 16" width="14" height="14" fill="none" aria-hidden>
      <circle cx="6.5" cy="5" r="2.5" stroke="currentColor" strokeWidth="1.2" />
      <path
        d="M2.5 13c0-2.2 1.8-4 4-4s4 1.8 4 4"
        stroke="currentColor"
        strokeWidth="1.2"
        strokeLinecap="round"
      />
      <path d="M12 4v4M10 6h4" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" />
    </svg>
  );
}

function MoreIcon() {
  return (
    <svg viewBox="0 0 4 16" width="4" height="16" aria-hidden>
      <circle cx="2" cy="2.5" r="1.25" fill="currentColor" />
      <circle cx="2" cy="8" r="1.25" fill="currentColor" />
      <circle cx="2" cy="13.5" r="1.25" fill="currentColor" />
    </svg>
  );
}

function TableHeadCell({ label }: { label: string }) {
  return (
    <th>
      <span className="um-table__head">
        <span>{label}</span>
        <FilterIcon />
      </span>
    </th>
  );
}

export function UserManagementSection({ labId }: Props) {
  const { used, total } = CENTER_USER_LOGIN_QUOTA;
  const { users } = useLabUsers(labId);
  const [searchParams, setSearchParams] = useSearchParams();
  const [toastMessage, setToastMessage] = useState("");

  useEffect(() => {
    if (searchParams.get("created") !== "1") return;

    const emailed = searchParams.get("emailed") === "1";
    const email = searchParams.get("email");
    setToastMessage(
      emailed && email
        ? `User created. A temporary password was emailed to ${email}.`
        : "User created successfully.",
    );

    const next = new URLSearchParams(searchParams);
    next.delete("created");
    next.delete("emailed");
    next.delete("email");
    setSearchParams(next, { replace: true });
  }, [searchParams, setSearchParams]);

  return (
    <div className="um-page">
      {toastMessage && <p className="ue-toast ue-toast--list">{toastMessage}</p>}

      <header className="um-header">
        <div className="um-header__left">
          <p className="um-header__rows">Rows: {users.length}</p>
        </div>
        <div className="um-header__right">
          <button type="button" className="um-header__legacy-link">
            Go back to old User Management
          </button>
          <span className="um-header__quota">
            <strong>
              {used}/{total} User logins remaining
            </strong>
            <button type="button" className="um-header__info-btn" aria-label="User login quota info">
              <InfoIcon />
            </button>
          </span>
          <Link to={selectUserRoleHref(labId)} className="um-header__add-btn">
            <AddUserIcon />
            Add User
          </Link>
        </div>
      </header>

      <div className="um-table-wrap">
        <table className="um-table">
          <thead>
            <tr>
              <TableHeadCell label="Username" />
              <TableHeadCell label="Name" />
              <TableHeadCell label="User Role" />
              <TableHeadCell label="Default Login Section" />
              <TableHeadCell label="Last Activity" />
              <th className="um-table__actions-head" aria-label="Actions" />
            </tr>
          </thead>
          <tbody>
            {users.map((user) => (
              <tr key={user.id} className="um-table__row">
                <td className="um-table__cell um-table__cell--primary">
                  <Link to={centerUserHref(labId, user.id)} className="um-table__user-link">
                    {user.username}
                  </Link>
                </td>
                <td className="um-table__cell um-table__cell--primary">
                  <Link to={centerUserHref(labId, user.id)} className="um-table__user-link">
                    {user.name}
                  </Link>
                </td>
                <td className="um-table__cell">{user.userRole || "\u00a0"}</td>
                <td className="um-table__cell">{user.defaultLoginSection || "\u00a0"}</td>
                <td className="um-table__cell">{user.lastActivity}</td>
                <td className="um-table__cell um-table__cell--actions">
                  <button type="button" className="um-table__copy-btn">
                    Copy User
                  </button>
                  <button type="button" className="um-table__more-btn" aria-label={`More actions for ${user.username}`}>
                    <MoreIcon />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
