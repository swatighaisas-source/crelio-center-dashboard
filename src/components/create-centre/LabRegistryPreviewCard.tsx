import {
  LAB_ARCHETYPE_LABELS,
  type CliaFetchPreview,
  type NpiFetchPreview,
} from "../../lib/usOnboardingPrefill";

interface LabRegistryPreviewCardProps {
  npi?: string;
  clia?: string;
  npiPreview: NpiFetchPreview | null;
  cliaPreview: CliaFetchPreview | null;
  /** Denser layout for modal tab (no inner scroll) */
  compact?: boolean;
}

function SourceChip({ source }: { source: "NPI" | "CLIA" }) {
  return (
    <span
      className={`lab-registry-card__chip lab-registry-card__chip--${source.toLowerCase()}`}
    >
      {source}
    </span>
  );
}

function confidenceClass(confidence: string): string {
  const c = confidence.toLowerCase();
  if (c.includes("high")) return "npi-confidence-badge--high";
  if (c.includes("low")) return "npi-confidence-badge--low";
  return "npi-confidence-badge--medium";
}

export function LabRegistryPreviewCard({
  npi,
  clia,
  npiPreview,
  cliaPreview,
  compact = false,
}: LabRegistryPreviewCardProps) {
  if (!npiPreview && !cliaPreview) return null;

  const displayName =
    cliaPreview?.facilityName ?? npiPreview?.labName ?? "—";
  const address = cliaPreview?.address ?? npiPreview?.practiceAddress ?? "—";
  const archetype =
    cliaPreview?.suggestedArchetype ?? npiPreview?.suggestedArchetype;
  const hasNpi = Boolean(npiPreview);
  const hasClia = Boolean(cliaPreview);

  const matchLabel =
    hasNpi && hasClia
      ? "NPI + CLIA"
      : hasNpi
        ? "NPI"
        : "CLIA";

  return (
    <div className={`lab-registry-card${compact ? " lab-registry-card--compact" : ""}`}>
      <header className="lab-registry-card__header">
        <div className="lab-registry-card__header-main">
          <h3 className="lab-registry-card__name">{displayName}</h3>
          <p className="lab-registry-card__subtitle">
            {compact
              ? `Matched from ${matchLabel}`
              : hasNpi && hasClia
                ? "Matched from NPI Registry and CMS CLIA (POS)"
                : hasNpi
                  ? "Matched from NPI Registry"
                  : "Matched from CMS CLIA (POS)"}
          </p>
        </div>
        <span className="lab-registry-card__demo-badge">Demo</span>
      </header>

      <div className="lab-registry-card__ids">
        {npi?.trim() && (
          <div className="lab-registry-card__id">
            <span className="lab-registry-card__id-label">NPI</span>
            <span className="lab-registry-card__id-value">{npi.trim()}</span>
          </div>
        )}
        {clia?.trim() && (
          <div className="lab-registry-card__id">
            <span className="lab-registry-card__id-label">CLIA</span>
            <span className="lab-registry-card__id-value">{clia.trim()}</span>
          </div>
        )}
      </div>

      <dl className="lab-registry-card__details">
        {npiPreview?.npiType && (
          <div className="lab-registry-card__row">
            <dt>Organization type</dt>
            <dd>
              {npiPreview.npiType}
              <SourceChip source="NPI" />
            </dd>
          </div>
        )}

        <div className="lab-registry-card__row lab-registry-card__row--wide">
          <dt>Address</dt>
          <dd>
            {address}
            {cliaPreview ? <SourceChip source="CLIA" /> : <SourceChip source="NPI" />}
          </dd>
        </div>

        {npiPreview && (
          <div className="lab-registry-card__row">
            <dt>Taxonomy</dt>
            <dd>
              <span className="lab-registry-card__taxonomy">
                <code>{npiPreview.taxonomyCode}</code>
                {npiPreview.taxonomyDescription}
              </span>
              <SourceChip source="NPI" />
            </dd>
          </div>
        )}

        {cliaPreview && (
          <>
            <div className="lab-registry-card__row">
              <dt>Certificate</dt>
              <dd>
                {cliaPreview.certificateType}
                <SourceChip source="CLIA" />
              </dd>
            </div>
            <div className="lab-registry-card__row">
              <dt>Facility type</dt>
              <dd>
                {cliaPreview.facilityType}
                <SourceChip source="CLIA" />
              </dd>
            </div>
            {cliaPreview.specialties.length > 0 && (
              <div className="lab-registry-card__row lab-registry-card__row--wide">
                <dt>Specialties</dt>
                <dd title={cliaPreview.specialties.join(" · ")}>
                  {cliaPreview.specialties.join(" · ")}
                  <SourceChip source="CLIA" />
                </dd>
              </div>
            )}
          </>
        )}

        <div className="lab-registry-card__row lab-registry-card__row--profile">
          <dt>Suggested profile</dt>
          <dd>
            {cliaPreview ? (
              <>
                <span className="lab-registry-card__profile-text">
                  {cliaPreview.suggestedProfile}
                  <span
                    className={`npi-confidence-badge ${confidenceClass(cliaPreview.profileConfidence)}`}
                  >
                    {cliaPreview.profileConfidence}
                  </span>
                </span>
                <span className="lab-registry-card__archetype">
                  → {LAB_ARCHETYPE_LABELS[cliaPreview.suggestedArchetype]}
                </span>
                <SourceChip source="CLIA" />
              </>
            ) : npiPreview ? (
              <>
                {npiPreview.suggestedLabType} →{" "}
                {archetype ? LAB_ARCHETYPE_LABELS[archetype] : "—"}
                <SourceChip source="NPI" />
              </>
            ) : null}
          </dd>
        </div>
      </dl>

      {hasNpi && hasClia && !compact && (
        <p className="lab-registry-card__footnote">
          Name and address use CLIA when both sources are present; taxonomy from NPI.
        </p>
      )}
    </div>
  );
}
