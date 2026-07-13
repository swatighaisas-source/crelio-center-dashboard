import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { SearchIcon } from "../../../components/Icons";
import { IntegrationPickerSection } from "../../../components/create-centre/IntegrationPickerSection";
import { USPageHeader } from "../../../components/create-centre/USPageHeader";
import { useCreateCentre } from "../../../context/CreateCentreContext";
import {
  US_ALL_INTEGRATIONS,
  US_DEDICATED_SECTION_INTEGRATIONS,
  US_ELIGIBILITY_INTEGRATIONS,
  US_FAX_INTEGRATIONS,
  US_SEARCHABLE_INTEGRATIONS,
  type USIntegration,
} from "../../../data/usIntegrations";

const DEDICATED_NAMES = new Set(US_DEDICATED_SECTION_INTEGRATIONS.map((i) => i.name));

/** Former archetype defaults — cleared on load so nothing stays pre-checked */
const LEGACY_ARCHETYPE_DEFAULT_INTEGRATIONS = new Set([
  "AthenaHealth",
  "Kareo",
  "Ellkay",
  "Clinical Pathology Laboratories",
  "Azalea Health",
  "EClinical Works",
  "Stripe",
  "Twilio",
]);

export function USIntegrationsPage() {
  const navigate = useNavigate();
  const { usForm, updateUSForm } = useCreateCentre();
  const [query, setQuery] = useState("");
  const [isFocused, setIsFocused] = useState(false);

  const integrationByName = useMemo(
    () => new Map(US_ALL_INTEGRATIONS.map((i) => [i.name, i])),
    [],
  );

  useEffect(() => {
    const current = usForm.selectedIntegrations;
    if (current.length === 0) return;
    const onlyLegacyDefaults = current.every((name) =>
      LEGACY_ARCHETYPE_DEFAULT_INTEGRATIONS.has(name),
    );
    if (onlyLegacyDefaults) {
      updateUSForm({ selectedIntegrations: [] });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const searchResults = useMemo(() => {
    if (!query.trim()) return [];
    const lower = query.toLowerCase();
    return US_SEARCHABLE_INTEGRATIONS.filter((i) => {
      if (usForm.selectedIntegrations.includes(i.name)) return false;
      return (
        i.name.toLowerCase().includes(lower) ||
        i.category.toLowerCase().includes(lower) ||
        i.summary.toLowerCase().includes(lower)
      );
    }).slice(0, 8);
  }, [query, usForm.selectedIntegrations]);

  function toggleIntegration(name: string) {
    if (usForm.selectedIntegrations.includes(name)) {
      updateUSForm({
        selectedIntegrations: usForm.selectedIntegrations.filter((x) => x !== name),
      });
    } else {
      updateUSForm({ selectedIntegrations: [...usForm.selectedIntegrations, name] });
    }
  }

  function addIntegration(name: string) {
    if (!usForm.selectedIntegrations.includes(name)) {
      updateUSForm({ selectedIntegrations: [...usForm.selectedIntegrations, name] });
    }
  }

  const selectedItems: USIntegration[] = usForm.selectedIntegrations
    .map((name) => integrationByName.get(name))
    .filter((i): i is USIntegration => i !== undefined && !DEDICATED_NAMES.has(i.name));

  const orphanNames = usForm.selectedIntegrations.filter(
    (name) => !integrationByName.has(name),
  );

  const generalSelectedCount = selectedItems.length + orphanNames.length;

  return (
    <div className="setup-diagnostic-page">
      <USPageHeader
        title="Integrations Needed"
        step="6 / 8 Steps"
        backTo="/create-centre/us/devices"
      />

      <div className="setup-diagnostic-card setup-diagnostic-card--us-wide">
        <h2 className="setup-diagnostic-card__heading">Integrations Needed</h2>

        <div className="setup-diagnostic-card__body">
          <div className="integration-search-prominent">
            <label className="integration-search-prominent__label" htmlFor="integration-search">
              Search integrations
            </label>
            <div className="device-search-container device-search-container--prominent">
              <div className="device-search-input-wrapper">
                <span className="device-search-icon" aria-hidden>
                  <SearchIcon />
                </span>
                <input
                  id="integration-search"
                  type="search"
                  className="device-search-input device-search-input--prominent"
                  placeholder="EHR, billing, middleware, lab network…"
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  onFocus={() => setIsFocused(true)}
                  onBlur={() => setTimeout(() => setIsFocused(false), 150)}
                  autoComplete="off"
                />
              </div>

              {isFocused && query.trim() && (
                <div className="device-search-dropdown device-search-dropdown--prominent">
                  {searchResults.map((integration) => (
                    <div
                      key={integration.id}
                      className="device-search-dropdown__item device-search-dropdown__item--integration"
                      onMouseDown={(e) => e.preventDefault()}
                      onClick={() => {
                        addIntegration(integration.name);
                        setQuery("");
                      }}
                    >
                      <div className="device-search-dropdown__item-main">
                        <div className="device-search-dropdown__name">{integration.name}</div>
                        <div className="device-search-dropdown__summary">{integration.summary}</div>
                      </div>
                      <span className="integration-search-dropdown__tag">{integration.category}</span>
                    </div>
                  ))}
                  {searchResults.length === 0 && (
                    <div className="device-search-dropdown__empty">No integrations found</div>
                  )}
                </div>
              )}
            </div>
          </div>

          <section className="integration-selected-section" aria-label="Selected integrations">
            <h3 className="integration-selected-section__title">
              Selected
              {generalSelectedCount > 0 && (
                <span className="integration-selected-section__count">{generalSelectedCount}</span>
              )}
            </h3>

            {generalSelectedCount === 0 ? (
              <p className="integration-selected-section__empty">
                Search above to add integrations your lab needs.
              </p>
            ) : (
              <div className="integration-checkbox-list integration-checkbox-list--selected">
                {selectedItems.map((integration) => (
                  <div
                    key={integration.id}
                    className="integration-checkbox-item integration-checkbox-item--checked"
                    onClick={() => toggleIntegration(integration.name)}
                    onKeyDown={(e) => {
                      if (e.key === "Enter" || e.key === " ") {
                        e.preventDefault();
                        toggleIntegration(integration.name);
                      }
                    }}
                    role="checkbox"
                    aria-checked
                    tabIndex={0}
                  >
                    <div className="integration-checkbox-item__box" aria-hidden>
                      <span className="integration-checkbox-item__check">✓</span>
                    </div>
                    <div className="integration-checkbox-item__body">
                      <div className="integration-checkbox-item__name">{integration.name}</div>
                      <div className="integration-checkbox-item__summary">{integration.summary}</div>
                    </div>
                    <span className="integration-checkbox-item__cat">{integration.category}</span>
                  </div>
                ))}
                {orphanNames.map((name) => (
                  <div
                    key={name}
                    className="integration-checkbox-item integration-checkbox-item--checked"
                    onClick={() => toggleIntegration(name)}
                    role="checkbox"
                    aria-checked
                    tabIndex={0}
                  >
                    <div className="integration-checkbox-item__box" aria-hidden>
                      <span className="integration-checkbox-item__check">✓</span>
                    </div>
                    <div className="integration-checkbox-item__body">
                      <div className="integration-checkbox-item__name">{name}</div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </section>

          <IntegrationPickerSection
            title="Fax"
            items={US_FAX_INTEGRATIONS}
            selectedNames={usForm.selectedIntegrations}
            onToggle={toggleIntegration}
          />

          <IntegrationPickerSection
            title="Eligibility Integration"
            items={US_ELIGIBILITY_INTEGRATIONS}
            selectedNames={usForm.selectedIntegrations}
            onToggle={toggleIntegration}
          />

          <button
            type="button"
            className="setup-diagnostic-continue"
            onClick={() => navigate("/create-centre/us/spoc")}
          >
            Confirm &amp; Continue
          </button>
        </div>
      </div>
    </div>
  );
}
