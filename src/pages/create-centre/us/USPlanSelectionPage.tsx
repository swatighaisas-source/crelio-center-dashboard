import { useNavigate } from "react-router-dom";
import { PlanTierThumbnail } from "../../../components/create-centre/PlanTierThumbnail";
import { USPageHeader } from "../../../components/create-centre/USPageHeader";
import { useCreateCentre } from "../../../context/CreateCentreContext";
import { US_PRICING_PLANS } from "../../../data/usPricingPlans";

export function USPlanSelectionPage() {
  const navigate = useNavigate();
  const { usForm, updateUSForm } = useCreateCentre();

  return (
    <div className="setup-diagnostic-page">
      <USPageHeader
        title="Choose Your Plan"
        step="8 / 8 Steps"
        backTo="/create-centre/us/spoc"
      />

      <div className="setup-diagnostic-card">
        <h2 className="setup-diagnostic-card__heading">Select the plan that fits your lab</h2>

        <ul className="config-type-list" role="radiogroup" aria-label="Pricing plan">
          {US_PRICING_PLANS.map((plan) => {
            const selected = usForm.selectedPlan === plan.id;
            return (
              <li key={plan.id}>
                <label
                  className={`config-type-option${selected ? " config-type-option--selected" : ""}`}
                >
                  <input
                    type="radio"
                    name="plan"
                    value={plan.id}
                    checked={selected}
                    onChange={() => updateUSForm({ selectedPlan: plan.id })}
                    className="config-type-option__input"
                  />
                  <PlanTierThumbnail tier={plan.id} />
                  <span className="config-type-option__body">
                    <span className="config-type-option__title">{plan.name}</span>
                    <span className="config-type-option__desc">{plan.description}</span>
                    <span className="config-type-option__meta">{plan.priceLine}</span>
                    {plan.recommended ? (
                      <span className="config-type-option__badge">Recommended</span>
                    ) : null}
                  </span>
                  <span className="config-type-option__radio" aria-hidden />
                </label>
              </li>
            );
          })}
        </ul>

        <p className="us-plan-footnote us-plan-footnote--list">
          Monthly billing available at +15% · 30-day cancellation notice · USA &amp; Canada ·
          Annual contract
        </p>

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
