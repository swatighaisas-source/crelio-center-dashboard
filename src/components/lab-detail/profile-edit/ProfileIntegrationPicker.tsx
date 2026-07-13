import { useMemo, useState } from "react";
import { SearchIcon } from "../../Icons";
import {
  US_EHR_INTEGRATIONS,
  US_ELIGIBILITY_INTEGRATIONS,
  US_FAX_INTEGRATIONS,
  US_SEARCHABLE_INTEGRATIONS,
  type USIntegration,
} from "../../../data/usIntegrations";

const NON_EHR_SEARCHABLE = US_SEARCHABLE_INTEGRATIONS.filter((i) => i.category !== "EHR");

const DEDICATED_NAMES = new Set([
  ...US_FAX_INTEGRATIONS.map((i) => i.name),
  ...US_ELIGIBILITY_INTEGRATIONS.map((i) => i.name),
]);

interface Props {
  selectedIntegrations: string[];
  onChange: (names: string[]) => void;
  compact?: boolean;
}

function toggleInList(selected: string[], name: string): string[] {
  return selected.includes(name)
    ? selected.filter((x) => x !== name)
    : [...selected, name];
}

function IntegrationCheckboxGrid({
  label,
  items,
  selectedNames,
  onToggle,
}: {
  label: string;
  items: USIntegration[];
  selectedNames: string[];
  onToggle: (name: string) => void;
}) {
  return (
    <div className="lab-profile-integration-grid-block">
      <span className="lab-profile-integration-grid-block__label">{label}</span>
      <div className="lab-profile-modal__choice-grid lab-profile-modal__choice-grid--integrations">
        {items.map((integration) => {
          const checked = selectedNames.includes(integration.name);
          return (
            <label
              key={integration.id}
              className={`lab-profile-modal__choice lab-profile-modal__choice--check${checked ? " lab-profile-modal__choice--selected" : ""}`}
            >
              <input
                type="checkbox"
                checked={checked}
                onChange={() => onToggle(integration.name)}
              />
              <span title={integration.summary}>{integration.name}</span>
            </label>
          );
        })}
      </div>
    </div>
  );
}

function CompactIntegrationPicker({ selectedIntegrations, onChange }: Props) {
  const [query, setQuery] = useState("");

  const ehrList = useMemo(() => {
    const lower = query.trim().toLowerCase();
    if (!lower) return US_EHR_INTEGRATIONS;
    return US_EHR_INTEGRATIONS.filter((i) => i.name.toLowerCase().includes(lower));
  }, [query]);

  const otherSearchMatches = useMemo(() => {
    const lower = query.trim().toLowerCase();
    if (!lower) return [];
    return NON_EHR_SEARCHABLE.filter(
      (i) =>
        !selectedIntegrations.includes(i.name) &&
        (i.name.toLowerCase().includes(lower) || i.category.toLowerCase().includes(lower)),
    ).slice(0, 4);
  }, [query, selectedIntegrations]);

  const otherSelected = useMemo(
    () =>
      selectedIntegrations.filter(
        (name) =>
          !US_EHR_INTEGRATIONS.some((e) => e.name === name) && !DEDICATED_NAMES.has(name),
      ),
    [selectedIntegrations],
  );

  function toggle(name: string) {
    onChange(toggleInList(selectedIntegrations, name));
  }

  return (
    <div className="lab-profile-integrations-compact">
      <div className="lab-profile-integrations-compact__ehr">
        <span className="lab-profile-integration-grid-block__label">EHR &amp; systems</span>
        <div className="device-search-input-wrapper device-search-input-wrapper--sm">
          <span className="device-search-icon" aria-hidden>
            <SearchIcon />
          </span>
          <input
            type="search"
            className="device-search-input device-search-input--sm"
            placeholder="Search EHR…"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            autoComplete="off"
          />
        </div>
        <ul className="lab-profile-integration-list" role="listbox" aria-label="EHR integrations">
          {ehrList.map((integration) => {
            const checked = selectedIntegrations.includes(integration.name);
            return (
              <li key={integration.id}>
                <label className="lab-profile-integration-list__item">
                  <input
                    type="checkbox"
                    checked={checked}
                    onChange={() => toggle(integration.name)}
                  />
                  <span>{integration.name}</span>
                </label>
              </li>
            );
          })}
          {query.trim() && ehrList.length === 0 && otherSearchMatches.length === 0 && (
            <li className="lab-profile-integration-list__empty">No matches</li>
          )}
          {query.trim() &&
            otherSearchMatches.map((integration) => {
              const checked = selectedIntegrations.includes(integration.name);
              return (
                <li key={`other-${integration.id}`}>
                  <label className="lab-profile-integration-list__item">
                    <input
                      type="checkbox"
                      checked={checked}
                      onChange={() => toggle(integration.name)}
                    />
                    <span>
                      {integration.name}
                      <em className="lab-profile-integration-list__cat">{integration.category}</em>
                    </span>
                  </label>
                </li>
              );
            })}
        </ul>
        {otherSelected.length > 0 && (
          <p className="lab-profile-integration-list__other" title={otherSelected.join(", ")}>
            Also selected: {otherSelected.join(", ")}
          </p>
        )}
      </div>

      <IntegrationCheckboxGrid
        label="Fax"
        items={US_FAX_INTEGRATIONS}
        selectedNames={selectedIntegrations}
        onToggle={toggle}
      />
      <IntegrationCheckboxGrid
        label="Eligibility"
        items={US_ELIGIBILITY_INTEGRATIONS}
        selectedNames={selectedIntegrations}
        onToggle={toggle}
      />
    </div>
  );
}

function FullIntegrationPicker({ selectedIntegrations, onChange }: Props) {
  const [query, setQuery] = useState("");
  const [isFocused, setIsFocused] = useState(false);

  const integrationByName = useMemo(
    () => new Map(US_SEARCHABLE_INTEGRATIONS.map((i) => [i.name, i])),
    [],
  );

  const searchResults = useMemo(() => {
    if (!query.trim()) return [];
    const lower = query.toLowerCase();
    return US_SEARCHABLE_INTEGRATIONS.filter((i) => {
      if (selectedIntegrations.includes(i.name)) return false;
      return (
        i.name.toLowerCase().includes(lower) ||
        i.category.toLowerCase().includes(lower) ||
        i.summary.toLowerCase().includes(lower)
      );
    }).slice(0, 8);
  }, [query, selectedIntegrations]);

  function toggleIntegration(name: string) {
    onChange(toggleInList(selectedIntegrations, name));
  }

  function addIntegration(name: string) {
    if (!selectedIntegrations.includes(name)) {
      onChange([...selectedIntegrations, name]);
    }
  }

  const selectedItems = selectedIntegrations
    .map((name) => integrationByName.get(name))
    .filter((i): i is USIntegration => i !== undefined && !DEDICATED_NAMES.has(i.name));

  const orphanNames = selectedIntegrations.filter((name) => !integrationByName.has(name));

  return (
    <div className="lab-profile-integrations">
      <div className="integration-search-prominent">
        <label className="integration-search-prominent__label" htmlFor="profile-integration-search">
          Search integrations
        </label>
        <div className="device-search-container device-search-container--prominent">
          <div className="device-search-input-wrapper">
            <span className="device-search-icon" aria-hidden>
              <SearchIcon />
            </span>
            <input
              id="profile-integration-search"
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
        <h3 className="integration-selected-section__title">Selected</h3>
        {selectedItems.length === 0 && orphanNames.length === 0 ? (
          <p className="integration-selected-section__empty">Search above to add integrations.</p>
        ) : (
          <div className="integration-checkbox-list integration-checkbox-list--compact">
            {selectedItems.map((integration) => (
              <div
                key={integration.id}
                className="integration-checkbox-item integration-checkbox-item--checked integration-checkbox-item--compact"
                onClick={() => toggleIntegration(integration.name)}
                role="checkbox"
                aria-checked
                tabIndex={0}
              >
                <div className="integration-checkbox-item__box" aria-hidden>
                  <span className="integration-checkbox-item__check">✓</span>
                </div>
                <div className="integration-checkbox-item__name">{integration.name}</div>
              </div>
            ))}
            {orphanNames.map((name) => (
              <div
                key={name}
                className="integration-checkbox-item integration-checkbox-item--checked integration-checkbox-item--compact"
                onClick={() => toggleIntegration(name)}
                role="checkbox"
                aria-checked
                tabIndex={0}
              >
                <div className="integration-checkbox-item__box" aria-hidden>
                  <span className="integration-checkbox-item__check">✓</span>
                </div>
                <div className="integration-checkbox-item__name">{name}</div>
              </div>
            ))}
          </div>
        )}
      </section>

      <IntegrationCheckboxGrid
        label="Fax"
        items={US_FAX_INTEGRATIONS}
        selectedNames={selectedIntegrations}
        onToggle={toggleIntegration}
      />
      <IntegrationCheckboxGrid
        label="Eligibility"
        items={US_ELIGIBILITY_INTEGRATIONS}
        selectedNames={selectedIntegrations}
        onToggle={toggleIntegration}
      />
    </div>
  );
}

export function ProfileIntegrationPicker({ compact, ...props }: Props) {
  if (compact) {
    return <CompactIntegrationPicker {...props} />;
  }
  return <FullIntegrationPicker {...props} />;
}
