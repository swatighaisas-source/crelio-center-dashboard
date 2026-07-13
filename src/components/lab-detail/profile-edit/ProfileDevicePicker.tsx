import { useMemo, useState } from "react";
import { SearchIcon } from "../../Icons";
import {
  US_DEVICES,
  deviceMatchesSelectedModality,
  getPopularityScore,
  normalizeSelectedModalities,
  type USDevice,
} from "../../../data/usDevices";
import type { USCustomDevice } from "../../../context/CreateCentreContext";

interface Props {
  modalities: string[];
  selectedDeviceIds: number[];
  customDevices: USCustomDevice[];
  onChange: (patch: { selectedDeviceIds: number[]; customDevices: USCustomDevice[] }) => void;
  compact?: boolean;
}

function CompactDevicePicker({
  modalities,
  selectedDeviceIds,
  customDevices,
  onChange,
}: Props) {
  const [query, setQuery] = useState("");
  const [isFocused, setIsFocused] = useState(false);

  const canonicalModalities = useMemo(
    () => normalizeSelectedModalities(modalities),
    [modalities],
  );

  const pool = useMemo(() => {
    const seen = new Set<number>();
    const list: USDevice[] = [];
    for (const mod of canonicalModalities) {
      for (const d of US_DEVICES) {
        if (!deviceMatchesSelectedModality(d.modality, mod)) continue;
        if (seen.has(d.id)) continue;
        seen.add(d.id);
        list.push(d);
      }
    }
    return list.sort((a, b) => getPopularityScore(a.brand) - getPopularityScore(b.brand));
  }, [canonicalModalities]);

  const searchResults = useMemo(() => {
    if (!query.trim()) return [];
    const lower = query.toLowerCase();
    return pool
      .filter(
        (d) =>
          !selectedDeviceIds.includes(d.id) && d.deviceName.toLowerCase().includes(lower),
      )
      .slice(0, 6);
  }, [query, pool, selectedDeviceIds]);

  const selectedDevices = pool.filter((d) => selectedDeviceIds.includes(d.id));

  function toggleDevice(id: number) {
    onChange({
      selectedDeviceIds: selectedDeviceIds.includes(id)
        ? selectedDeviceIds.filter((x) => x !== id)
        : [...selectedDeviceIds, id],
      customDevices,
    });
  }

  function addCustom(name: string) {
    const mod = canonicalModalities[0] ?? "Other";
    onChange({
      selectedDeviceIds,
      customDevices: [...customDevices, { modality: mod, name }],
    });
  }

  function removeCustom(name: string) {
    onChange({
      selectedDeviceIds,
      customDevices: customDevices.filter((d) => d.name !== name),
    });
  }

  if (canonicalModalities.length === 0) {
    return (
      <p className="lab-profile-section__hint lab-profile-section__hint--tight">
        Select modalities to add devices.
      </p>
    );
  }

  const exactMatch = pool.some((d) => d.deviceName.toLowerCase() === query.trim().toLowerCase());
  const showAddCustom =
    query.trim().length > 0 &&
    !exactMatch &&
    !customDevices.some((d) => d.name === query.trim());

  return (
    <div className="lab-profile-devices-compact">
      <div className="device-search-container device-search-container--inline">
        <div className="device-search-input-wrapper device-search-input-wrapper--sm">
          <span className="device-search-icon" aria-hidden>
            <SearchIcon />
          </span>
          <input
            type="text"
            className="device-search-input device-search-input--sm"
            placeholder="Search devices…"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onFocus={() => setIsFocused(true)}
            onBlur={() => setTimeout(() => setIsFocused(false), 150)}
          />
        </div>
        {isFocused && query.trim() && (
          <div className="device-search-dropdown device-search-dropdown--compact">
            {searchResults.map((d) => (
              <div
                key={d.id}
                className="device-search-dropdown__item device-search-dropdown__item--sm"
                onMouseDown={(e) => e.preventDefault()}
                onClick={() => {
                  toggleDevice(d.id);
                  setQuery("");
                }}
              >
                <span className="device-search-dropdown__name">{d.deviceName}</span>
                <span className="device-search-dropdown__brand">{d.modality}</span>
              </div>
            ))}
            {showAddCustom && (
              <div
                className="device-search-dropdown__add"
                onMouseDown={(e) => e.preventDefault()}
                onClick={() => {
                  addCustom(query.trim());
                  setQuery("");
                }}
              >
                + Add &quot;{query.trim()}&quot;
              </div>
            )}
            {searchResults.length === 0 && !showAddCustom && (
              <div className="device-search-dropdown__empty">No matches</div>
            )}
          </div>
        )}
      </div>
      {(selectedDevices.length > 0 || customDevices.length > 0) && (
        <div className="device-pills device-pills--compact">
          {selectedDevices.map((d) => (
            <span key={d.id} className="device-pill device-pill--sm">
              {d.deviceName}
              <button
                type="button"
                className="device-pill__remove"
                onClick={() => toggleDevice(d.id)}
                aria-label={`Remove ${d.deviceName}`}
              >
                ×
              </button>
            </span>
          ))}
          {customDevices.map((d) => (
            <span key={`${d.modality}-${d.name}`} className="device-pill device-pill--sm device-pill--custom">
              {d.name}
              <button
                type="button"
                className="device-pill__remove"
                onClick={() => removeCustom(d.name)}
                aria-label={`Remove ${d.name}`}
              >
                ×
              </button>
            </span>
          ))}
        </div>
      )}
    </div>
  );
}

export function ProfileDevicePicker(props: Props) {
  if (props.compact) {
    return <CompactDevicePicker {...props} />;
  }

  return <ProfileDevicePickerFull {...props} />;
}

function ProfileDevicePickerFull({
  modalities,
  selectedDeviceIds,
  customDevices,
  onChange,
}: Omit<Props, "compact">) {
  const canonicalModalities = useMemo(
    () => normalizeSelectedModalities(modalities),
    [modalities],
  );

  const devicesByModality = useMemo(() => {
    const map = new Map<string, USDevice[]>();
    for (const mod of canonicalModalities) {
      const devices = US_DEVICES.filter((d) => deviceMatchesSelectedModality(d.modality, mod)).sort(
        (a, b) => getPopularityScore(a.brand) - getPopularityScore(b.brand),
      );
      map.set(mod, devices);
    }
    return map;
  }, [canonicalModalities]);

  function toggleDevice(id: number) {
    onChange({
      selectedDeviceIds: selectedDeviceIds.includes(id)
        ? selectedDeviceIds.filter((x) => x !== id)
        : [...selectedDeviceIds, id],
      customDevices,
    });
  }

  function addCustomDevice(modality: string, name: string) {
    onChange({
      selectedDeviceIds,
      customDevices: [...customDevices, { modality, name }],
    });
  }

  function removeCustomDevice(modality: string, name: string) {
    onChange({
      selectedDeviceIds,
      customDevices: customDevices.filter(
        (d) => !(d.modality === modality && d.name === name),
      ),
    });
  }

  if (canonicalModalities.length === 0) {
    return (
      <p className="lab-profile-section__hint">
        Select at least one modality above to add instruments.
      </p>
    );
  }

  return (
    <div className="device-search-groups">
      {canonicalModalities.map((mod) => (
        <DeviceSearchGroup
          key={mod}
          modality={mod}
          modalityDevices={devicesByModality.get(mod) ?? []}
          selectedDeviceIds={selectedDeviceIds}
          customDevices={customDevices.filter((d) => d.modality === mod).map((d) => d.name)}
          onToggleDevice={toggleDevice}
          onAddCustom={(name) => addCustomDevice(mod, name)}
          onRemoveCustom={(name) => removeCustomDevice(mod, name)}
        />
      ))}
    </div>
  );
}

function DeviceSearchGroup({
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

  const searchResults = useMemo(() => {
    if (!query.trim()) return [];
    const lower = query.toLowerCase();
    return modalityDevices
      .filter(
        (d) =>
          !selectedDeviceIds.includes(d.id) && d.deviceName.toLowerCase().includes(lower),
      )
      .slice(0, 5);
  }, [query, modalityDevices, selectedDeviceIds]);

  const exactMatch = modalityDevices.some(
    (d) => d.deviceName.toLowerCase() === query.trim().toLowerCase(),
  );
  const showAddCustom =
    query.trim().length > 0 && !exactMatch && !customDevices.includes(query.trim());

  const selectedModalityDevices = modalityDevices.filter((d) =>
    selectedDeviceIds.includes(d.id),
  );

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
            placeholder={`Search ${modality} devices…`}
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onFocus={() => setIsFocused(true)}
            onBlur={() => setTimeout(() => setIsFocused(false), 150)}
          />
        </div>

        {isFocused && query.trim() && (
          <div className="device-search-dropdown">
            {searchResults.map((d) => (
              <div
                key={d.id}
                className="device-search-dropdown__item"
                onMouseDown={(e) => e.preventDefault()}
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
                onMouseDown={(e) => e.preventDefault()}
                onClick={() => {
                  onAddCustom(query.trim());
                  setQuery("");
                }}
              >
                <span className="device-search-dropdown__add-icon">+</span>
                Add &quot;{query.trim()}&quot;
              </div>
            )}
            {searchResults.length === 0 && !showAddCustom && (
              <div className="device-search-dropdown__empty">No results found</div>
            )}
          </div>
        )}
      </div>

      <div className="device-pills">
        {selectedModalityDevices.map((d) => (
          <span key={d.id} className="device-pill">
            {d.deviceName}
            <button
              type="button"
              className="device-pill__remove"
              onClick={() => onToggleDevice(d.id)}
              aria-label={`Remove ${d.deviceName}`}
            >
              ×
            </button>
          </span>
        ))}
        {customDevices.map((name) => (
          <span key={name} className="device-pill device-pill--custom">
            {name}
            <button
              type="button"
              className="device-pill__remove"
              onClick={() => onRemoveCustom(name)}
              aria-label={`Remove ${name}`}
            >
              ×
            </button>
          </span>
        ))}
      </div>
    </div>
  );
}
