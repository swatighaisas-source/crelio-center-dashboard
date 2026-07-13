import { useNavigate } from "react-router-dom";
import { USLabTypeIcon } from "../../../components/create-centre/USLabTypeIcon";
import { USPageHeader } from "../../../components/create-centre/USPageHeader";
import { useCreateCentre } from "../../../context/CreateCentreContext";
import { USPrefillTag } from "../../../components/create-centre/USPrefillTag";
import { getRecommendedArchetype } from "../../../data/usTaxonomy";
import { US_LAB_TYPE_OPTIONS } from "../../../data/usLabTypes";

export function USLabTypePage() {
  const navigate = useNavigate();
  const { usForm, updateUSForm, getPrefillSource } = useCreateCentre();

  const cliaArchetypePrefill = getPrefillSource("usForm.labArchetype") === "CLIA";
  const recommendedArchetype = cliaArchetypePrefill
    ? usForm.labArchetype
    : getRecommendedArchetype(usForm.taxonomyCode, usForm.manualEntry);

  return (
    <div className="setup-diagnostic-page">
      <USPageHeader
        title="Select Type of Lab"
        step="2 / 8 Steps"
        backTo="/create-centre/us/npi"
      />

      <div className="setup-diagnostic-card">
        <h2 className="setup-diagnostic-card__heading">
          Select Type of Lab
          <USPrefillTag field="usForm.labArchetype" />
        </h2>

        <ul className="config-type-list" role="radiogroup" aria-label="Lab type">
          {US_LAB_TYPE_OPTIONS.map((option) => {
            const selected = usForm.labArchetype === option.id;
            const recommended = recommendedArchetype === option.id;
            return (
              <li key={option.id}>
                <label
                  className={`config-type-option${selected ? " config-type-option--selected" : ""}`}
                >
                  <input
                    type="radio"
                    name="labArchetype"
                    value={option.id}
                    checked={selected}
                    onChange={() =>
                      updateUSForm({ labArchetype: option.id, selectedIntegrations: [] })
                    }
                    className="config-type-option__input"
                  />
                  <USLabTypeIcon type={option.id} />
                  <span className="config-type-option__body">
                    <span className="config-type-option__title">{option.title}</span>
                    <span className="config-type-option__desc">{option.description}</span>
                    {recommended && (
                      <span className="config-type-option__badge">
                        {cliaArchetypePrefill ? "Prefilled · CLIA" : "Recommended"}
                      </span>
                    )}
                  </span>
                  <span className="config-type-option__radio" aria-hidden />
                </label>
              </li>
            );
          })}
        </ul>

        <button
          type="button"
          className="setup-diagnostic-continue"
          onClick={() => navigate("/create-centre/us/modalities")}
        >
          Confirm &amp; Continue
        </button>
      </div>
    </div>
  );
}
