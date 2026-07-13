import { useEffect, useRef, useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { SearchIcon } from "../../../components/Icons";
import { USPageHeader } from "../../../components/create-centre/USPageHeader";
import { useCreateCentre } from "../../../context/CreateCentreContext";
import {
  US_DEVICES,
  getDevicesByModalities,
  deviceMatchesSelectedModality,
  normalizeSelectedModalities,
  getPopularityScore,
  type USDevice,
} from "../../../data/usDevices";

const MAX_PRE_CHECKED = 12;

function DeviceSearch({
  modality,
  modalityDevices,
  selectedDeviceIds,
  customDevices,
  onToggleDevice,
  onAddCustom,
  onRemoveCustom,
}: {
  modality: string;
  modalityDevices: USDevice[];
  selectedDeviceIds: number[];
  customDevices: string[];
  onToggleDevice: (id: number) => void;
  onAddCustom: (name: string) => void;
  onRemoveCustom: (name: string) => void;
}) {
  const [query, setQuery] = useState("");
  const [isFocused, setIsFocused] = useState(false);

  const selectedModalityDevices = modalityDevices.filter(d => selectedDeviceIds.includes(d.id));
  
  const searchResults = useMemo(() => {
    if (!query.trim()) return [];
    const lower = query.toLowerCase();
    return modalityDevices.filter(
      d => !selectedDeviceIds.includes(d.id) && d.deviceName.toLowerCase().includes(lower)
    ).slice(0, 5);
  }, [query, modalityDevices, selectedDeviceIds]);

  const exactMatch = modalityDevices.some(d => d.deviceName.toLowerCase() === query.trim().toLowerCase());
  const showAddCustom = query.trim().length > 0 && !exactMatch && !customDevices.includes(query.trim());

  return (
    <div className="device-search-group">
      <div className="device-search-group__header">
        <h3 className="device-search-group__title">{modality}</h3>
      </div>
      
      <div className="device-search-container">
        <div className="device-search-input-wrapper">
          <span className="device-search-icon" aria-hidden>
            <SearchIcon />
          </span>
          <input
            type="text"
            className="device-search-input"
            placeholder={`Search ${modality} devices...`}
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onFocus={() => setIsFocused(true)}
            onBlur={() => setTimeout(() => setIsFocused(false), 150)}
          />
        </div>

        {isFocused && query.trim() && (
          <div className="device-search-dropdown">
            {searchResults.map(d => (
              <div
                key={d.id}
                className="device-search-dropdown__item"
                onClick={() => {
                  onToggleDevice(d.id);
                  setQuery("");
                }}
              >
                <div className="device-search-dropdown__name">{d.deviceName}</div>
                <div className="device-search-dropdown__brand">{d.brand}</div>
              </div>
            ))}
            {showAddCustom && (
              <div
                className="device-search-dropdown__add"
                onClick={() => {
                  onAddCustom(query.trim());
                  setQuery("");
                }}
              >
                <span className="device-search-dropdown__add-icon">+</span>
                Add "{query.trim()}"
              </div>
            )}
            {searchResults.length === 0 && !showAddCustom && (
              <div className="device-search-dropdown__empty">No results found</div>
            )}
          </div>
        )}
      </div>

      <div className="device-pills">
        {selectedModalityDevices.map(d => (
          <span key={d.id} className="device-pill">
            <span className="device-pill__name">{d.deviceName}</span>
            <button
              type="button"
              className="device-pill__remove"
              onClick={() => onToggleDevice(d.id)}
              title="Remove device"
            >
              ×
            </button>
          </span>
        ))}
        {customDevices.map(name => (
          <span key={name} className="device-pill device-pill--custom">
            <span className="device-pill__name">{name}</span>
            <button
              type="button"
              className="device-pill__remove"
              onClick={() => onRemoveCustom(name)}
              title="Remove custom device"
            >
              ×
            </button>
          </span>
        ))}
        {selectedModalityDevices.length === 0 && customDevices.length === 0 && (
          <span className="device-pills__empty">No devices selected</span>
        )}
      </div>
    </div>
  );
}

export function USDevicesPage() {
  const navigate = useNavigate();
  const { usForm, updateUSForm } = useCreateCentre();
  const didPreselect = useRef(false);

  const canonicalModalities = normalizeSelectedModalities(usForm.selectedModalities);

  useEffect(() => {
    const byMod = getDevicesByModalities(canonicalModalities, 100);

    if (!didPreselect.current && usForm.selectedDeviceIds.length === 0 && byMod.length > 0) {
      didPreselect.current = true;
      // Preselect top popular devices across selected modalities
      const topIds = byMod
        .sort((a, b) => getPopularityScore(a.brand) - getPopularityScore(b.brand))
        .slice(0, MAX_PRE_CHECKED)
        .map((d) => d.id);
      updateUSForm({ selectedDeviceIds: topIds });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [usForm.selectedModalities.join(",")]);

  function toggleDevice(id: number) {
    const current = usForm.selectedDeviceIds;
    const next = current.includes(id) ? current.filter((x) => x !== id) : [...current, id];
    updateUSForm({ selectedDeviceIds: next });
  }

  function addCustomDevice(modality: string, name: string) {
    const exists = usForm.customDevices.some(d => d.modality === modality && d.name === name);
    if (!exists) {
      updateUSForm({ customDevices: [...usForm.customDevices, { modality, name }] });
    }
  }

  function removeCustomDevice(modality: string, name: string) {
    updateUSForm({ 
      customDevices: usForm.customDevices.filter(d => !(d.modality === modality && d.name === name))
    });
  }

  // Pre-calculate devices per modality (no max limit here, just filtered)
  const devicesByModality = new Map<string, USDevice[]>();
  for (const mod of canonicalModalities) {
    const devices = US_DEVICES.filter((d) => deviceMatchesSelectedModality(d.modality, mod))
      .sort((a, b) => getPopularityScore(a.brand) - getPopularityScore(b.brand));
    devicesByModality.set(mod, devices);
  }

  return (
    <div className="setup-diagnostic-page">
      <USPageHeader
        title="Device Selection"
        step="5 / 8 Steps"
        backTo="/create-centre/us/volume"
      />

      <div className="setup-diagnostic-card setup-diagnostic-card--us-wide">
        <h2 className="setup-diagnostic-card__heading">Device Selection</h2>

        <div className="setup-diagnostic-card__body">
          <div className="device-search-groups">
            {canonicalModalities.map((mod) => (
              <DeviceSearch
                key={mod}
                modality={mod}
                modalityDevices={devicesByModality.get(mod) || []}
                selectedDeviceIds={usForm.selectedDeviceIds}
                customDevices={usForm.customDevices.filter(d => d.modality === mod).map(d => d.name)}
                onToggleDevice={toggleDevice}
                onAddCustom={(name) => addCustomDevice(mod, name)}
                onRemoveCustom={(name) => removeCustomDevice(mod, name)}
              />
            ))}
          </div>

          <button
            type="button"
            className="setup-diagnostic-continue"
            onClick={() => navigate("/create-centre/us/integrations")}
          >
            Confirm &amp; Continue
          </button>
        </div>
      </div>
    </div>
  );
}
