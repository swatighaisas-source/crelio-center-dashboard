import { useNavigate } from "react-router-dom";
import {
  BenefitChartIcon,
  BenefitDigitalIcon,
  BenefitExperienceIcon,
  BenefitIntegrationIcon,
  BenefitAutomationIcon,
  BenefitPortalIcon,
} from "../../../components/create-centre/SetupIcons";

const US_BENEFITS = [
  {
    Icon: BenefitExperienceIcon,
    title: "HIPAA Compliant",
    desc: "End-to-end encrypted patient data and audit trails",
  },
  {
    Icon: BenefitDigitalIcon,
    title: "CLIA / CAP Ready",
    desc: "Built-in QC, proficiency testing and accreditation workflows",
  },
  {
    Icon: BenefitChartIcon,
    title: "AI-Powered",
    desc: "Smart result flagging, trend analysis and predictive turnaround",
  },
  {
    Icon: BenefitIntegrationIcon,
    title: "EHR & RCM Integrations",
    desc: "Seamless connectivity with AthenaHealth, Kareo, Ellkay, and more",
  },
  {
    Icon: BenefitAutomationIcon,
    title: "Automated Validation",
    desc: "Rule-based auto-approval and SOP-driven workflows",
  },
  {
    Icon: BenefitPortalIcon,
    title: "B2B & Patient Portals",
    desc: "Dedicated portals for referring providers and patients",
  },
];

export function USWelcomePage() {
  const navigate = useNavigate();

  return (
    <div className="setup-landing">
      <header className="setup-landing__intro">
        <h1 className="setup-landing__title">Setup Your Diagnostic Center</h1>
        <p className="setup-landing__subtitle">
          Get started with CrelioHealth for Diagnostics
        </p>
      </header>

      <div className="setup-card">
        <section className="setup-card__section setup-card__section--benefits">
          <h2 className="setup-card__heading">Benefits of CrelioHealth for Diagnostics</h2>
          <ul className="setup-benefits">
            {US_BENEFITS.map(({ Icon, title, desc }) => (
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
          
          <div className="setup-card__cta" style={{ marginTop: 40 }}>
            <button
              type="button"
              className="setup-get-started"
              onClick={() => navigate("/create-centre/us/npi")}
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
