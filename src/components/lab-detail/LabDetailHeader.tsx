import type { ReactNode } from "react";
import { Link } from "react-router-dom";
import type { LabDetail } from "../../data/labDetails";
import {
  lifecycleDisplayLabel,
  type LabLifecycleState,
} from "../../data/labLifecycle";
import { useLabs } from "../../context/LabsContext";
import { LabHeaderProfilePills } from "./LabHeaderProfilePills";
import { LabHeaderNpsRow } from "./LabHeaderNpsRow";
import { ChevronDownIcon, EditIcon, CopyIcon, WarningIcon } from "../Icons";

const LIFECYCLE_OPTIONS: LabLifecycleState[] = ["onboarding", "live", "trial", "shutdown"];

function lifecycleBadgeClass(state: LabLifecycleState): string {
  switch (state) {
    case "onboarding":
      return "badge--onboarding";
    case "live":
      return "badge--live";
    case "trial":
      return "badge--trial";
    case "shutdown":
      return "badge--shutdown";
  }
}

interface Props {
  lab: LabDetail;
}

export function LabDetailHeader({ lab }: Props) {
  const { landingPreference, getLabLifecycleState, updateLabLifecycleState } = useLabs();
  const lifecycleState = getLabLifecycleState(lab.id);
  
  let loginTo: string;
  if (lifecycleState === "onboarding" || lifecycleState === "trial") {
    loginTo = `/lab/${lab.id}/center/onboarding`;
  } else if (landingPreference === "old-account-overview") {
    loginTo = `/lab/${lab.id}/account-overview`;
  } else {
    loginTo = `/lab/${lab.id}/center`;
  }

  return (
    <header className="lab-header">
      <div className="lab-header__top">
        <div className="lab-header__title-row">
          <Link to="/" className="lab-header__back" aria-label="Back to dashboard">
            ←
          </Link>
          <h1 className="lab-header__title">
            #{lab.id} {lab.name}
          </h1>
          <button type="button" className="lab-header__copy" aria-label="Copy lab name">
            <CopyIcon />
          </button>
          <label className="lab-header__status-wrap">
            <span className="visually-hidden">Lab lifecycle state</span>
            <select
              className={`badge lab-header__status-select ${lifecycleBadgeClass(lifecycleState)}`}
              value={lifecycleState}
              onChange={(e) =>
                updateLabLifecycleState(lab.id, e.target.value as LabLifecycleState)
              }
              aria-label="Lab lifecycle state"
            >
              {LIFECYCLE_OPTIONS.map((state) => (
                <option key={state} value={state}>
                  {lifecycleDisplayLabel(state)}
                </option>
              ))}
            </select>
          </label>
          {lab.hasBillingDiscrepancy && (
            <span className="badge badge--discrepancy">
              <WarningIcon />
              Billing Discrepancy Found
            </span>
          )}
          <button type="button" className="lab-header__add-tags">
            +Add tags
          </button>
        </div>
        <div className="lab-header__actions">
          <button type="button" className="btn-outline btn-outline--sm">
            Check Discrepancy
          </button>
          <Link to={`/lab/${lab.id}/data-cleanup`} className="btn-outline btn-outline--sm">
            Data Cleanup
          </Link>
          <button type="button" className="btn-outline btn-outline--sm">
            Schedule
          </button>
          <button type="button" className="btn-primary-dropdown btn-primary-dropdown--sm">
            Options
            <ChevronDownIcon />
          </button>
          <Link to={loginTo} className="btn-solid btn-solid--sm">
            Login
          </Link>
        </div>
      </div>

      <LabHeaderProfilePills lab={lab} />

      <div className="lab-header__meta">
        <div className="lab-header__meta-col">
          <MetaItem label="Created On" value={lab.createdOn} />
          <MetaItem
            label="Account Manager"
            value={lab.accountManager}
            editable
          />
          <MetaItem label="Email" value={lab.email} />
          <MetaItem label="Address" value={lab.address} />
          <MetaItem label="Comment" value={lab.comment} />
        </div>
        <div className="lab-header__meta-col">
          <MetaItem
            label="Expected Live Date"
            value={
              <>
                {lab.expectedLiveDate}{" "}
                <span className="lab-header__live-note">{lab.expectedLiveNote}</span>
              </>
            }
          />
          <MetaItem label="Sales Person" value={lab.salesPerson} editable />
          <MetaItem label="Contact" value={lab.contact} />
          <MetaItem label="Zoho Contact Id" value={lab.zohoContactId} />
        </div>
      </div>

      <LabHeaderNpsRow history={lab.feedbackHistory} />
    </header>
  );
}

function MetaItem({
  label,
  value,
  editable,
}: {
  label: string;
  value: ReactNode;
  editable?: boolean;
}) {
  return (
    <div className="meta-item">
      <span className="meta-item__label">{label}</span>
      <span className="meta-item__value">
        {value}
        {editable && (
          <button type="button" className="meta-item__edit" aria-label={`Edit ${label}`}>
            <EditIcon />
          </button>
        )}
      </span>
    </div>
  );
}
