import { useNavigate } from "react-router-dom";
import { useCreateCentre } from "../../context/CreateCentreContext";
import { AccountSuccessIcon } from "../../components/create-centre/AccountSuccessIcon";

export function AccountReadyPage() {
  const navigate = useNavigate();
  const { account } = useCreateCentre();

  const contact = account.mobile || "contact";
  const email = account.email || "email";

  return (
    <div className="create-account-page">
      <div className="create-account-page__header">
        <h1 className="create-account-page__title">Create your account</h1>
        <p className="create-account-page__step">4/4 Steps</p>
      </div>

      <div className="create-account-card create-account-card--ready">
        <AccountSuccessIcon />

        <p className="account-ready__message">
          Your account is now ready for personalization.
        </p>

        <p className="account-ready__submessage">
          We have sent login credentials on registered{" "}
          <strong>{contact}</strong> and <strong>{email}</strong>.
        </p>

        <button
          type="button"
          className="account-ready__login-btn"
          onClick={() => navigate("/create-centre/setup")}
        >
          Login
        </button>
      </div>
    </div>
  );
}
