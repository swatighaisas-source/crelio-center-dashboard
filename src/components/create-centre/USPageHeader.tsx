import { useNavigate } from "react-router-dom";

interface USPageHeaderProps {
  title: string;
  step?: string;
  backTo: string;
}

export function USPageHeader({ title, step, backTo }: USPageHeaderProps) {
  const navigate = useNavigate();

  return (
    <header className="setup-diagnostic-page__header setup-diagnostic-page__header--with-back">
      <button
        type="button"
        className="setup-diagnostic-page__back"
        onClick={() => navigate(backTo)}
        aria-label="Go back"
      >
        ‹
      </button>
      <div className="setup-diagnostic-page__header-text">
        <h1 className="setup-diagnostic-page__title">{title}</h1>
        {step ? <p className="setup-diagnostic-page__step">{step}</p> : null}
      </div>
    </header>
  );
}
