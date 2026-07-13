import { Navigate, useNavigate, useParams } from "react-router-dom";
import { useLabs } from "../../context/LabsContext";
import {
  useCreateCentre,
  WIZARD_STEPS,
  isWizardStep,
  type WizardStep,
} from "../../context/CreateCentreContext";
import {
  STEP_TITLES,
  LabTypeStep,
  CentreDetailsStep,
  LabDetailsStep,
  SuccessStep,
  SetupChecklistStep,
  TestsStep,
  PricingStep,
  StaffStep,
  ReportsStep,
  FinishStep,
} from "../../components/create-centre/wizardSteps";

function stepPath(step: WizardStep) {
  return `/create-centre/wizard/${step}`;
}

function nextStep(step: WizardStep): WizardStep | null {
  const i = WIZARD_STEPS.indexOf(step);
  return i < WIZARD_STEPS.length - 1 ? WIZARD_STEPS[i + 1] : null;
}

function prevStep(step: WizardStep): WizardStep | null {
  const i = WIZARD_STEPS.indexOf(step);
  return i > 0 ? WIZARD_STEPS[i - 1] : null;
}

export function CreateCentreWizardPage() {
  const { step: stepParam } = useParams<{ step: string }>();
  const navigate = useNavigate();
  const { addLab } = useLabs();
  const { form, updateForm, createdId, setCreatedId, reset } = useCreateCentre();

  if (!isWizardStep(stepParam)) {
    return <Navigate to={stepPath("type")} replace />;
  }

  const step = stepParam;

  const go = (s: WizardStep) => navigate(stepPath(s));
  const exitToDashboard = () => {
    reset();
    navigate("/");
  };
  const exitToLab = () => {
    const id = createdId;
    reset();
    navigate(id ? `/lab/${id}` : "/");
  };

  const createCentre = () => {
    const row = addLab(form);
    setCreatedId(row.id);
    go("success");
  };

  const phase1 = ["type", "centre-details", "lab-details", "success"].includes(step);
  const showStepPills = phase1 && step !== "success";

  return (
    <div className="create-wizard-page">
      <div className="create-wizard-panel">
        <header className="create-wizard-panel__header">
          <h1 className="create-wizard-panel__title">{STEP_TITLES[step]}</h1>
          {showStepPills && (
            <div className="create-steps">
              {["Type", "Details", "Lab"].map((label, i) => {
                const active =
                  (step === "type" && i === 0) ||
                  (step === "centre-details" && i === 1) ||
                  (step === "lab-details" && i === 2);
                const done =
                  (step === "centre-details" && i === 0) ||
                  (step === "lab-details" && i <= 1);
                return (
                  <span
                    key={label}
                    className={`create-step${active ? " create-step--active" : ""}${done ? " create-step--done" : ""}`}
                  >
                    {label}
                  </span>
                );
              })}
            </div>
          )}
        </header>

        <div className="create-wizard-panel__body">
          {step === "type" && (
            <LabTypeStep value={form.labType} onChange={(labType) => updateForm({ labType })} />
          )}
          {step === "centre-details" && (
            <CentreDetailsStep form={form} onChange={updateForm} />
          )}
          {step === "lab-details" && <LabDetailsStep form={form} onChange={updateForm} />}
          {step === "success" && <SuccessStep centreName={form.name} />}
          {step === "setup-checklist" && <SetupChecklistStep />}
          {step === "tests" && <TestsStep />}
          {step === "pricing" && <PricingStep />}
          {step === "staff" && <StaffStep />}
          {step === "reports" && <ReportsStep />}
          {step === "finish" && <FinishStep centreName={form.name} />}
        </div>

        <WizardFooter
          step={step}
          form={form}
          onCancel={exitToDashboard}
          onBack={() => {
            const prev = prevStep(step);
            if (prev) go(prev);
          }}
          onNext={() => {
            if (step === "type") go("centre-details");
            else if (step === "centre-details") go("lab-details");
            else if (step === "lab-details") createCentre();
            else {
              const next = nextStep(step);
              if (next) go(next);
            }
          }}
          onDone={exitToLab}
          onSkipSetup={exitToDashboard}
        />
      </div>
    </div>
  );
}

function WizardFooter({
  step,
  form,
  onCancel,
  onBack,
  onNext,
  onDone,
  onSkipSetup,
}: {
  step: WizardStep;
  form: { name: string };
  onCancel: () => void;
  onBack: () => void;
  onNext: () => void;
  onDone: () => void;
  onSkipSetup: () => void;
}) {
  const canProceedCentre = form.name.trim().length > 0;

  if (step === "success") {
    return (
      <footer className="create-wizard-panel__footer">
        <button type="button" className="btn-secondary" onClick={onSkipSetup}>
          Done
        </button>
        <button type="button" className="btn-solid" onClick={onNext}>
          Proceed to Setup
        </button>
      </footer>
    );
  }

  if (step === "finish") {
    return (
      <footer className="create-wizard-panel__footer create-wizard-panel__footer--end">
        <button type="button" className="btn-solid" onClick={onDone}>
          Go to Dashboard
        </button>
      </footer>
    );
  }

  if (step === "setup-checklist") {
    return (
      <footer className="create-wizard-panel__footer create-wizard-panel__footer--end">
        <button type="button" className="btn-secondary" onClick={onSkipSetup}>
          Skip for now
        </button>
        <button type="button" className="btn-solid" onClick={onNext}>
          Get Started
        </button>
      </footer>
    );
  }

  const showBack = step !== "type";
  const nextLabel =
    step === "lab-details" ? "Create Centre" : step === "reports" ? "Finish" : "Next";
  const nextDisabled = step === "centre-details" && !canProceedCentre;

  return (
    <footer className="create-wizard-panel__footer">
      <button type="button" className="btn-secondary" onClick={onCancel}>
        Cancel
      </button>
      <div className="create-wizard-panel__footer-right">
        {showBack && (
          <button type="button" className="btn-secondary" onClick={onBack}>
            Back
          </button>
        )}
        <button
          type="button"
          className="btn-solid"
          onClick={onNext}
          disabled={nextDisabled}
        >
          {nextLabel}
        </button>
      </div>
    </footer>
  );
}
