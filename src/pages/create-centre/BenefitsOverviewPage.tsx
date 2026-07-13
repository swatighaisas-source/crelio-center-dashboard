import { useNavigate } from "react-router-dom";
import {
  BenefitChartIcon,
  BenefitDigitalIcon,
  BenefitExperienceIcon,
} from "../../components/create-centre/SetupIcons";

const BENEFITS = [
  {
    Icon: BenefitDigitalIcon,
    title: "Make Your Lab 100% Digital",
    desc: "Connect Anytime & Anywhere from web logins, Mobile App",
  },
  {
    Icon: BenefitExperienceIcon,
    title: "Enhanced Patient Experience",
    desc: "Automated Communication, Patient Records & History",
  },
  {
    Icon: BenefitChartIcon,
    title: "Increase Profitability",
    desc: "Manage Finance Effectively, Reduce Operational TAT",
  },
];

const ONBOARD_STEPS = [
  { num: 1, label: "Create Your Account" },
  { num: 2, label: "Customize Your Center" },
  { num: 3, label: "Start 15 Days Trial" },
];

export function BenefitsOverviewPage() {
  const navigate = useNavigate();

  return (
    <div className="setup-landing">
      <header className="setup-landing__intro">
        <h1 className="setup-landing__title">Setup your Diagnostic Center</h1>
        <p className="setup-landing__subtitle">
          Get started with CrelioHealth for Diagnostics in just 15 Min
        </p>
      </header>

      <div className="setup-card">
        <section className="setup-card__section setup-card__section--benefits">
          <h2 className="setup-card__heading">Benefits of CrelioHealth for Diagnostics</h2>
          <ul className="setup-benefits">
            {BENEFITS.map(({ Icon, title, desc }) => (
              <li key={title} className="setup-benefit">
                <span className="setup-benefit__icon" aria-hidden>
                  <Icon />
                </span>
                <span className="setup-benefit__text">
                  <strong>{title}</strong>
                  <span>{desc}</span>
                </span>
              </li>
            ))}
          </ul>
        </section>

        <section className="setup-card__section setup-card__section--onboard">
          <h2 className="setup-card__heading setup-card__heading--center">
            Onboard Your Center In Just 15 Min
          </h2>
          <div className="setup-onboard-steps">
            {ONBOARD_STEPS.map((s) => (
              <div key={s.num} className="setup-onboard-step">
                <span className="setup-onboard-step__num">{s.num}</span>
                <span className="setup-onboard-step__label">{s.label}</span>
              </div>
            ))}
          </div>
          <div className="setup-card__cta">
            <button
              type="button"
              className="setup-get-started"
              onClick={() => navigate("/create-centre/account")}
            >
              Get Started
            </button>
          </div>
        </section>
      </div>

      <p className="setup-landing__footer">
        Are you a patient? You can{" "}
        <a href="#login" className="setup-landing__link">
          Login here
        </a>
      </p>
    </div>
  );
}
