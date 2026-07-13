import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { SetupCompleteVisual } from "../../components/create-centre/SetupCompleteVisual";
import { SetupSummaryIcon } from "../../components/create-centre/SetupSummaryIcon";
import {
  SERVICE_OPTIONS,
  useCreateCentre,
} from "../../context/CreateCentreContext";
import { useLabs } from "../../context/LabsContext";
import { buildSetupSummary } from "../../lib/buildSetupSummary";

const PROCESSING_MS = 2400;

export function ChoosePlanPage() {
  const navigate = useNavigate();
  const { addLab } = useLabs();
  const {
    account,
    form,
    business,
    usForm,
    configurationType,
    reportTemplate,
    newTeamMembers,
    reset,
    setCreatedId,
  } = useCreateCentre();

  const [phase, setPhase] = useState<"processing" | "complete">("processing");
  const [createdLabId, setCreatedLabId] = useState<number | null>(null);

  const summaryItems = useMemo(() => {
    const serviceLabels = business.services
      .map((id) => SERVICE_OPTIONS.find((s) => s.id === id)?.label ?? id)
      .filter(Boolean);
    const teamCount = newTeamMembers.filter(
      (m) => m.name.trim() || m.email.trim()
    ).length;

    return buildSetupSummary({
      form,
      business,
      usForm,
      configurationType,
      reportTemplate,
      teamCount,
      serviceLabels,
    });
  }, [form, business, usForm, configurationType, reportTemplate, newTeamMembers]);

  useEffect(() => {
    let cancelled = false;

    const timer = window.setTimeout(() => {
      if (cancelled) return;

      try {
        const centreName =
          form.name.trim() ||
          business.registeredBusinessName.trim() ||
          usForm.labName.trim() ||
          "New Diagnostic Centre";

        const row = addLab({
          ...form,
          name: centreName,
          email: form.email || account.email,
          phone: form.phone || account.mobile,
        });
        setCreatedId(row.id);
        setCreatedLabId(row.id);
      } catch (err) {
        console.error("Failed to create centre:", err);
      } finally {
        if (!cancelled) {
          setPhase("complete");
        }
      }
    }, PROCESSING_MS);

    return () => {
      cancelled = true;
      window.clearTimeout(timer);
    };
  }, [addLab, account.email, account.mobile, form, business.registeredBusinessName, usForm.labName, setCreatedId]);

  function goToCentre() {
    if (createdLabId != null) {
      reset();
      navigate(`/lab/${createdLabId}`);
    }
  }

  return (
    <div className="choose-plan-page">
      <div className="choose-plan-card setup-complete-card">
        <SetupCompleteVisual phase={phase} />

        {phase === "complete" && (
          <>
            <section className="setup-summary" aria-label="Setup summary">
              <h2 className="setup-summary__heading">Your setup summary</h2>
              <ul className="setup-summary__list">
                {summaryItems.map((item) => (
                  <li key={`${item.icon}-${item.label}`} className="setup-summary__row">
                    <SetupSummaryIcon type={item.icon} />
                    <div className="setup-summary__text">
                      <span className="setup-summary__label">{item.label}</span>
                      <span className="setup-summary__value">{item.value}</span>
                    </div>
                  </li>
                ))}
              </ul>
            </section>

            <button
              type="button"
              className="setup-diagnostic-continue setup-complete-card__cta"
              onClick={goToCentre}
            >
              Go to your centre
            </button>
          </>
        )}
      </div>
    </div>
  );
}
