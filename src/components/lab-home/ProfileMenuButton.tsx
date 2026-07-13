import { Link } from "react-router-dom";
import { ROLE_LABELS } from "../../data/labHome";
import { profileInitials, type LabUserProfile } from "../../data/labUserProfile";

interface Props {
  labId: number;
  profile: LabUserProfile;
}

export function ProfileMenuButton({ labId, profile }: Props) {
  const initials = profileInitials(profile);

  return (
    <Link
      to={`/lab/${labId}/profile`}
      className="profile-menu-btn"
      aria-label="Update profile"
    >
      {profile.profilePhotoUrl ? (
        <img
          src={profile.profilePhotoUrl}
          alt=""
          className="profile-menu-btn__avatar profile-menu-btn__avatar--photo"
        />
      ) : (
        <span className="profile-menu-btn__avatar" aria-hidden>
          {initials}
        </span>
      )}
      <span className="profile-menu-btn__text">
        <span className="profile-menu-btn__name">{profile.name}</span>
        <span className="profile-menu-btn__role">{ROLE_LABELS[profile.userRole]}</span>
      </span>
      <svg className="profile-menu-btn__chevron" width="12" height="8" viewBox="0 0 12 8" fill="none" aria-hidden>
        <path
          d="M1.5 1.5L6 6l4.5-4.5"
          stroke="currentColor"
          strokeWidth="1.3"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    </Link>
  );
}
