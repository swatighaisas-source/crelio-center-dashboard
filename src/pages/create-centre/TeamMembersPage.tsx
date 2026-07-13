import { useNavigate } from "react-router-dom";
import { useCreateCentre } from "../../context/CreateCentreContext";
import { RoleSelect } from "../../components/create-centre/RoleSelect";

export function TeamMembersPage() {
  const navigate = useNavigate();
  const {
    account,
    newTeamMembers,
    addTeamMember,
    removeTeamMember,
    updateTeamMember,
  } = useCreateCentre();

  return (
    <div className="setup-diagnostic-page setup-diagnostic-page--team">
      <header className="setup-diagnostic-page__header setup-diagnostic-page__header--with-back">
        <button
          type="button"
          className="setup-diagnostic-page__back"
          onClick={() => navigate("/create-centre/setup/signing-doctor")}
          aria-label="Go back"
        >
          ‹
        </button>
        <div className="setup-diagnostic-page__header-text">
          <h1 className="setup-diagnostic-page__title">Setup Your Diagnostic Center</h1>
          <p className="setup-diagnostic-page__step">5/5 Steps</p>
        </div>
      </header>

      <div className="setup-diagnostic-card setup-diagnostic-card--team">
        <h2 className="setup-diagnostic-card__heading">Add/Update Team Members</h2>

        <p className="team-members-subtitle">Add New Members</p>

        <div className="team-members-table">
          <div className="team-members-table__head">
            <span>Name</span>
            <span>Role</span>
            <span>Email</span>
            <span>Contact</span>
            <span className="team-members-table__head-action" />
          </div>

          <div className="team-members-table__row team-members-table__row--primary">
            <div className="team-members-cell team-members-cell--name">
              {account.yourName}
            </div>
            <div className="team-members-cell team-members-cell--role">Admin</div>
            <div className="team-members-cell team-members-cell--email">
              <span>{account.email}</span>
              <span className="signing-doctor-badge">Unverified</span>
            </div>
            <div className="team-members-cell team-members-cell--contact">
              <span>{account.mobile}</span>
              <span className="signing-doctor-badge">Unverified</span>
            </div>
            <div className="team-members-cell team-members-cell--action">
              <button type="button" className="signing-doctor-link">
                Edit
              </button>
            </div>
          </div>

          {newTeamMembers.map((member) => (
            <div key={member.id} className="team-members-table__row team-members-table__row--draft">
              <div className="team-members-cell team-members-cell--name">
                <div className="team-members-input-wrap">
                  <input
                    className="team-members-input"
                    placeholder="Name"
                    value={member.name}
                    onChange={(e) =>
                      updateTeamMember(member.id, { name: e.target.value })
                    }
                  />
                  <span className="team-members-input-icon" title="Required" aria-hidden>
                    ⋮
                  </span>
                </div>
              </div>
              <div className="team-members-cell team-members-cell--role">
                <RoleSelect
                  value={member.role}
                  onChange={(role) => updateTeamMember(member.id, { role })}
                />
              </div>
              <div className="team-members-cell team-members-cell--email">
                <input
                  className="team-members-input"
                  type="email"
                  placeholder="Email"
                  value={member.email}
                  onChange={(e) =>
                    updateTeamMember(member.id, { email: e.target.value })
                  }
                />
              </div>
              <div className="team-members-cell team-members-cell--contact">
                <input
                  className="team-members-input"
                  placeholder="Contact (optional)"
                  value={member.contact}
                  onChange={(e) =>
                    updateTeamMember(member.id, { contact: e.target.value })
                  }
                />
              </div>
              <div className="team-members-cell team-members-cell--action">
                <button
                  type="button"
                  className="team-members-remove"
                  onClick={() => removeTeamMember(member.id)}
                  aria-label="Remove member"
                >
                  ×
                </button>
              </div>
            </div>
          ))}
        </div>

        <div className="team-members-add-row">
          <button type="button" className="team-members-add-btn" onClick={addTeamMember}>
            + Add More
          </button>
        </div>

        <button
          type="button"
          className="setup-diagnostic-continue"
          onClick={() => navigate("/create-centre/choose-plan")}
        >
          Confirm &amp; Continue
        </button>
      </div>
    </div>
  );
}
