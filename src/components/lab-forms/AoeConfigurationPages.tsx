import { useMemo, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import {
  getAoeConfiguration,
  groupAoeConfigurationsByType,
  mockAoeConfigurations,
  questionTypeLabel,
  type AoeConfigComponent,
  type AoeConfigListItem,
} from "../../data/aoeConfiguration";
import {
  AOE_CAPTURE_FREQUENCY_OPTIONS,
  type AoeCaptureFrequency,
} from "../../data/aoeTypes";
import { useLabAoeConfig } from "../../context/LabAoeConfigContext";

function Chevron({ open }: { open: boolean }) {
  return (
    <span
      className={`aoe-config-group__chevron${open ? " aoe-config-group__chevron--open" : ""}`}
      aria-hidden
    >
      <svg viewBox="0 0 12 8" width="10" height="7" fill="none">
        <path
          d="M1.5 1.5L6 6l4.5-4.5"
          stroke="currentColor"
          strokeWidth="1.3"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    </span>
  );
}

function FilterIcon() {
  return (
    <span className="aoe-config-table__filter" aria-hidden>
      <svg viewBox="0 0 12 12" width="10" height="10" fill="none">
        <path d="M1.5 2.5h9l-3.2 3.6V10l-2.6-1.2V6.1L1.5 2.5Z" stroke="currentColor" strokeWidth="1.1" />
      </svg>
    </span>
  );
}

function CopyIcon() {
  return (
    <svg viewBox="0 0 16 16" width="14" height="14" fill="none" aria-hidden>
      <rect x="5.5" y="5.5" width="7" height="8" rx="1" stroke="currentColor" strokeWidth="1.2" />
      <path d="M3.5 10.5V3.5A1 1 0 0 1 4.5 2.5h6" stroke="currentColor" strokeWidth="1.2" />
    </svg>
  );
}

function DragHandle() {
  return (
    <span className="aoe-comp-item__drag" aria-hidden>
      <svg viewBox="0 0 10 16" width="8" height="14" fill="currentColor">
        <circle cx="2.5" cy="3" r="1.1" />
        <circle cx="7.5" cy="3" r="1.1" />
        <circle cx="2.5" cy="8" r="1.1" />
        <circle cx="7.5" cy="8" r="1.1" />
        <circle cx="2.5" cy="13" r="1.1" />
        <circle cx="7.5" cy="13" r="1.1" />
      </svg>
    </span>
  );
}

function InfoIcon() {
  return (
    <span className="aoe-config-info" title="AOE type information" aria-label="AOE type information">
      <svg viewBox="0 0 16 16" width="14" height="14" fill="none">
        <circle cx="8" cy="8" r="6.25" stroke="currentColor" strokeWidth="1.2" />
        <path d="M8 7.2V11.2M8 5.2v.2" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" />
      </svg>
    </span>
  );
}

function CloudUploadIcon() {
  return (
    <svg viewBox="0 0 16 16" width="14" height="14" fill="none" aria-hidden>
      <path
        d="M4.5 11.5h7.2a2.7 2.7 0 0 0 .3-5.4 3.6 3.6 0 0 0-6.9-1.1A2.4 2.4 0 0 0 4.5 11.5Z"
        stroke="currentColor"
        strokeWidth="1.2"
      />
      <path d="M8 9.5V5.8M6.4 7.2 8 5.6l1.6 1.6" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" />
    </svg>
  );
}

export function AoeConfigurationListPage({ labId }: { labId: number }) {
  const navigate = useNavigate();
  const [configs, setConfigs] = useState(mockAoeConfigurations);
  const [collapsedTypes, setCollapsedTypes] = useState<Set<string>>(new Set());

  const groups = useMemo(() => groupAoeConfigurationsByType(configs), [configs]);

  const toggleType = (type: string) => {
    setCollapsedTypes((prev) => {
      const next = new Set(prev);
      if (next.has(type)) next.delete(type);
      else next.add(type);
      return next;
    });
  };

  const toggleEnabled = (id: number) => {
    setConfigs((prev) =>
      prev.map((item) => (item.id === id ? { ...item, enabled: !item.enabled } : item)),
    );
  };

  return (
    <section className="aoe-config-page">
      <header className="aoe-config-page__header">
        <div>
          <h1 className="aoe-config-page__title">AOE Form Configuration</h1>
          <p className="aoe-config-page__rows">Rows: {configs.length}</p>
        </div>
        <div className="aoe-config-page__actions">
          <button type="button" className="aoe-config-btn aoe-config-btn--outline">
            Export
          </button>
          <button type="button" className="aoe-config-btn aoe-config-btn--outline">
            Map Instance(s)
          </button>
          <button type="button" className="aoe-config-btn aoe-config-btn--outline">
            Add via Template
          </button>
          <button type="button" className="aoe-config-btn aoe-config-btn--primary">
            Add New Configuration
          </button>
        </div>
      </header>

      <div className="aoe-config-table-wrap">
        <table className="aoe-config-table">
          <thead>
            <tr>
              <th className="aoe-config-table__check">
                <input type="checkbox" aria-label="Select all" />
              </th>
              <th>
                <span className="aoe-config-table__th">
                  ID <span className="aoe-config-table__sort">▼</span>
                </span>
              </th>
              <th>
                <span className="aoe-config-table__th">
                  Configuration Name <FilterIcon />
                </span>
              </th>
              <th>
                <span className="aoe-config-table__th">
                  Type <FilterIcon />
                </span>
              </th>
              <th>
                <span className="aoe-config-table__th">
                  Created On <FilterIcon />
                </span>
              </th>
              <th>Status</th>
              <th />
            </tr>
          </thead>
          <tbody>
            {groups.map((group) => {
              const collapsed = collapsedTypes.has(group.type);
              return (
                <AoeConfigTypeGroup
                  key={group.type}
                  type={group.type}
                  count={group.items.length}
                  collapsed={collapsed}
                  items={group.items}
                  onToggle={() => toggleType(group.type)}
                  onToggleEnabled={toggleEnabled}
                  onOpen={(item) =>
                    navigate(`/lab/${labId}/center/aoe-configuration/${item.id}`)
                  }
                />
              );
            })}
          </tbody>
        </table>
      </div>
    </section>
  );
}

function AoeConfigTypeGroup({
  type,
  count,
  collapsed,
  items,
  onToggle,
  onToggleEnabled,
  onOpen,
}: {
  type: string;
  count: number;
  collapsed: boolean;
  items: AoeConfigListItem[];
  onToggle: () => void;
  onToggleEnabled: (id: number) => void;
  onOpen: (item: AoeConfigListItem) => void;
}) {
  return (
    <>
      <tr className="aoe-config-group-row">
        <td colSpan={7}>
          <button type="button" className="aoe-config-group" onClick={onToggle}>
            <Chevron open={!collapsed} />
            <strong>
              {type} ({count})
            </strong>
          </button>
        </td>
      </tr>
      {!collapsed &&
        items.map((item) => (
          <tr key={item.id} className="aoe-config-row">
            <td className="aoe-config-table__check">
              <input type="checkbox" aria-label={`Select ${item.name}`} />
            </td>
            <td className="aoe-config-row__id">{item.id}</td>
            <td>
              <button type="button" className="aoe-config-name" onClick={() => onOpen(item)}>
                {item.name}
              </button>
            </td>
            <td>{item.type}</td>
            <td className="aoe-config-row__date">{item.createdOn}</td>
            <td>
              <button
                type="button"
                className={`aoe-config-status${
                  item.enabled ? " aoe-config-status--enable" : " aoe-config-status--disable"
                }`}
                onClick={() => onToggleEnabled(item.id)}
              >
                {item.enabled ? "Enable" : "Disable"}
              </button>
            </td>
            <td>
              <button type="button" className="aoe-config-copy">
                <CopyIcon />
                Copy Configuration
              </button>
            </td>
          </tr>
        ))}
    </>
  );
}

export function AoeConfigurationEditPage({ labId }: { labId: number }) {
  const { configId } = useParams<{ configId: string }>();
  const numericId = Number(configId);
  const config = getAoeConfiguration(numericId);
  const { getCaptureFrequencyForConfig, setCaptureFrequencyForConfig } = useLabAoeConfig(labId);
  const [tab, setTab] = useState<"basic" | "components">("basic");
  const [enabled, setEnabled] = useState(config?.enabled ?? false);
  const [name, setName] = useState(config?.name ?? "");
  const [description, setDescription] = useState(config?.description ?? "");
  const [aoeType, setAoeType] = useState(config?.type ?? "Test");
  const [aoeCode, setAoeCode] = useState("");
  const [mappedTests, setMappedTests] = useState(config?.mappedTests ?? []);
  const [captureFrequency, setCaptureFrequency] = useState<AoeCaptureFrequency>(() =>
    config ? getCaptureFrequencyForConfig(config.id) : "ONCE_PER_TEST_INSTANCE",
  );
  const [selectedId, setSelectedId] = useState(config?.components[0]?.id ?? "");
  const [expandedSections, setExpandedSections] = useState<Set<string>>(
    () => new Set(config?.components[0] ? [config.components[0].id] : []),
  );

  if (!config) {
    return (
      <section className="aoe-config-page">
        <p>AOE configuration not found.</p>
        <Link to={`/lab/${labId}/center/aoe-configuration`}>Back to AOE Configuration</Link>
      </section>
    );
  }

  const selectedSection =
    config.components.find((item) => item.id === selectedId && item.kind === "section") ??
    config.components.find((item) => item.kind === "section");

  const selectSection = (section: AoeConfigComponent) => {
    setSelectedId(section.id);
    setExpandedSections((prev) => {
      const next = new Set(prev);
      next.add(section.id);
      return next;
    });
  };

  return (
    <section className="aoe-config-page aoe-config-page--edit">
      <div className="aoe-config-edit__crumb">
        <Link to={`/lab/${labId}/center/aoe-configuration`}>AOE Form Configuration</Link>
        <span>/</span>
        <span>Edit AOE Form Configuration</span>
      </div>

      <header className="aoe-config-edit__header">
        <h1 className="aoe-config-page__title">{config.name}</h1>
        <div className="aoe-config-page__actions">
          <button
            type="button"
            className={`aoe-config-btn${
              enabled ? " aoe-config-btn--outline-green" : " aoe-config-btn--danger"
            }`}
            onClick={() => setEnabled((value) => !value)}
          >
            {enabled ? "Enable" : "Disable"}
          </button>
          <button type="button" className="aoe-config-btn aoe-config-btn--primary">
            Save Changes
          </button>
        </div>
      </header>

      <div className="aoe-config-edit__tabs" role="tablist">
        <button
          type="button"
          role="tab"
          className={`aoe-config-edit__tab${tab === "basic" ? " aoe-config-edit__tab--active" : ""}`}
          aria-selected={tab === "basic"}
          onClick={() => setTab("basic")}
        >
          Basic Information
        </button>
        <button
          type="button"
          role="tab"
          className={`aoe-config-edit__tab${tab === "components" ? " aoe-config-edit__tab--active" : ""}`}
          aria-selected={tab === "components"}
          onClick={() => setTab("components")}
        >
          Form Components
        </button>
      </div>

      {tab === "basic" ? (
        <div className="aoe-config-basic">
          <div className="aoe-config-basic__row">
            <label className="aoe-config-basic__label" htmlFor="aoe-name">
              AOE Name <em>*</em>
            </label>
            <div className="aoe-config-basic__control">
              <input
                id="aoe-name"
                value={name}
                onChange={(event) => setName(event.target.value)}
              />
            </div>
          </div>

          <div className="aoe-config-basic__row aoe-config-basic__row--top">
            <span className="aoe-config-basic__label">Icon/Image</span>
            <div className="aoe-config-basic__control">
              <div className="aoe-config-upload">
                <button type="button" className="aoe-config-btn aoe-config-btn--upload">
                  Upload
                </button>
                {config.iconFileName ? (
                  <span className="aoe-config-upload__file">{config.iconFileName}</span>
                ) : null}
              </div>
              <p className="aoe-config-hint">*PNG, JPG, JPEG File Types Only</p>
            </div>
          </div>

          <div className="aoe-config-basic__row aoe-config-basic__row--top">
            <label className="aoe-config-basic__label" htmlFor="aoe-description">
              Description
            </label>
            <div className="aoe-config-basic__control">
              <textarea
                id="aoe-description"
                rows={4}
                value={description}
                onChange={(event) => setDescription(event.target.value)}
              />
            </div>
          </div>

          <div className="aoe-config-basic__row">
            <label className="aoe-config-basic__label" htmlFor="aoe-type">
              AOE Type <em>*</em>
            </label>
            <div className="aoe-config-basic__control aoe-config-basic__control--inline">
              <select
                id="aoe-type"
                value={aoeType}
                onChange={(event) => setAoeType(event.target.value as typeof aoeType)}
              >
                <option value="Test">Test</option>
                <option value="Bill">Bill</option>
                <option value="Profile">Profile</option>
                <option value="Promotion">Promotion</option>
                <option value="Store">Store</option>
              </select>
              <InfoIcon />
            </div>
          </div>

          <div className="aoe-config-basic__row">
            <label className="aoe-config-basic__label" htmlFor="aoe-code">
              AOE Code
            </label>
            <div className="aoe-config-basic__control">
              <input
                id="aoe-code"
                value={aoeCode}
                onChange={(event) => setAoeCode(event.target.value)}
                placeholder="Enter the AOE Process Code"
              />
            </div>
          </div>

          <div className="aoe-config-basic__row aoe-config-basic__row--top">
            <span className="aoe-config-basic__label">
              Map Test(s) <em>*</em>
            </span>
            <div className="aoe-config-basic__control">
              <div className="aoe-config-map-select">
                <select aria-label="Select Test(s)" defaultValue="">
                  <option value="" disabled>
                    Select Test(s)
                  </option>
                  <option value="761004">AMMONIA (761004)</option>
                  <option value="7063835">Ammonia (7063835)</option>
                  <option value="dengue">Dengue NS1</option>
                </select>
              </div>

              {mappedTests.length > 0 ? (
                <div className="aoe-config-map-table-wrap">
                  <p className="aoe-config-map-rows">Rows: {mappedTests.length}</p>
                  <table className="aoe-config-map-table">
                    <thead>
                      <tr>
                        <th>
                          <span className="aoe-config-table__th">
                            Test ID <FilterIcon />
                          </span>
                        </th>
                        <th>
                          <span className="aoe-config-table__th">
                            Test Name <FilterIcon />
                          </span>
                        </th>
                        <th>
                          <span className="aoe-config-table__th">
                            Test Code <FilterIcon />
                          </span>
                        </th>
                        <th>
                          <span className="aoe-config-table__th">
                            Sample Type <FilterIcon />
                          </span>
                        </th>
                        <th aria-label="Remove" />
                      </tr>
                    </thead>
                    <tbody>
                      {mappedTests.map((test) => (
                        <tr key={test.testId}>
                          <td>{test.testId}</td>
                          <td>{test.testName}</td>
                          <td>{test.testCode}</td>
                          <td>{test.sampleType}</td>
                          <td>
                            <button
                              type="button"
                              className="aoe-config-map-remove"
                              aria-label={`Remove ${test.testName}`}
                              onClick={() =>
                                setMappedTests((prev) =>
                                  prev.filter((row) => row.testId !== test.testId),
                                )
                              }
                            >
                              ×
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              ) : null}
            </div>
          </div>

          <div className="aoe-config-basic__row aoe-config-basic__row--top">
            <label className="aoe-config-basic__label" htmlFor="aoe-capture-frequency">
              AOE Capture Frequency
            </label>
            <div className="aoe-config-basic__control">
              <select
                id="aoe-capture-frequency"
                className="aoe-config-capture__select"
                value={captureFrequency}
                onChange={(event) => {
                  const next = event.target.value as AoeCaptureFrequency;
                  setCaptureFrequency(next);
                  setCaptureFrequencyForConfig(config.id, next);
                }}
              >
                {AOE_CAPTURE_FREQUENCY_OPTIONS.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
              <p className="aoe-config-hint aoe-config-capture__hint">
                Once per test: Capture AOE once for the test, regardless of quantity.
                <br />
                Once per test instance: Capture AOE separately for each occurrence of
                the test based on its quantity.
              </p>
            </div>
          </div>
        </div>
      ) : (
        <div className="aoe-config-components">
          <div className="aoe-config-components__toolbar">
            <button type="button" className="aoe-config-btn aoe-config-btn--primary aoe-config-btn--add">
              Add
              <span aria-hidden>▾</span>
            </button>
          </div>

          <div className="aoe-config-components__body">
            <aside className="aoe-comp-list">
              <h2 className="aoe-comp-list__title">
                Form Components ({config.components.length})
              </h2>
              <div className="aoe-comp-list__items">
                {config.components.map((section) => {
                  const isSelected = selectedSection?.id === section.id;
                  const isExpanded = expandedSections.has(section.id);
                  return (
                    <div key={section.id} className="aoe-comp-block">
                      <button
                        type="button"
                        className={`aoe-comp-item${isSelected ? " aoe-comp-item--active" : ""}`}
                        onClick={() => selectSection(section)}
                      >
                        <DragHandle />
                        <span className="aoe-comp-item__label">{section.label}</span>
                        <span className="aoe-comp-item__meta">
                          <span className="aoe-comp-item__type">Section</span>
                          <span className="aoe-comp-item__count">
                            {section.children?.length ?? 0}
                          </span>
                          <span className="aoe-comp-item__close" aria-hidden>
                            ×
                          </span>
                        </span>
                      </button>
                      {isExpanded &&
                        section.children?.map((child) => (
                          <div key={child.id} className="aoe-comp-child">
                            <DragHandle />
                            <span className="aoe-comp-child__label">{child.label}</span>
                            <span className="aoe-comp-child__type">
                              {questionTypeLabel(child.kind)}
                            </span>
                            <span className="aoe-comp-item__close" aria-hidden>
                              ×
                            </span>
                          </div>
                        ))}
                    </div>
                  );
                })}
              </div>
            </aside>

            <div className="aoe-comp-detail">
              <label className="aoe-comp-detail__field">
                <span>
                  Section Heading <em>*</em>
                </span>
                <input key={selectedSection?.id} defaultValue={selectedSection?.label ?? ""} />
              </label>

              <div className="aoe-comp-detail__field">
                <span>Section Icon</span>
                <button type="button" className="aoe-config-btn aoe-config-btn--upload-file">
                  <CloudUploadIcon />
                  Upload File
                </button>
                <p className="aoe-config-hint">*PNG, JPG, JPEG File Types Only</p>
              </div>

              <hr className="aoe-comp-detail__divider" />

              <h3 className="aoe-comp-detail__subtitle">Other Configuration</h3>

              <label className="aoe-comp-detail__field">
                <span>Section Code</span>
                <input placeholder="Add a Code for this Section" defaultValue="" />
              </label>

              <label className="aoe-comp-detail__check">
                <input type="checkbox" defaultChecked={selectedSection?.mandatory ?? true} />
                Mark as Mandatory
              </label>
              <label className="aoe-comp-detail__check">
                <input type="checkbox" />
                Hide Section
              </label>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
