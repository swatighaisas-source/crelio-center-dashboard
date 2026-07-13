import type { CmsCliaRecord } from "../../../services/cmsCliaApi";

interface Props {
  npiRawFields: Record<string, string> | null;
  cliaRawRecord: CmsCliaRecord | null;
}

function RawTable({ rows }: { rows: [string, string][] }) {
  if (rows.length === 0) {
    return <p className="lab-registry-raw__empty">No fields returned.</p>;
  }
  return (
    <dl className="lab-registry-raw__table">
      {rows.map(([key, value]) => (
        <div key={key} className="lab-registry-raw__row">
          <dt>{key}</dt>
          <dd>{value}</dd>
        </div>
      ))}
    </dl>
  );
}

function cliaRawRows(record: CmsCliaRecord): [string, string][] {
  return Object.entries(record)
    .filter(([, v]) => v !== null && v !== undefined && String(v).trim() !== "")
    .map(([k, v]): [string, string] => [k, String(v)])
    .sort(([a], [b]) => a.localeCompare(b));
}

export function LabRegistryRawPanel({ npiRawFields, cliaRawRecord }: Props) {
  const npiRows = npiRawFields ? Object.entries(npiRawFields) : [];
  const cliaRows = cliaRawRecord ? cliaRawRows(cliaRawRecord) : [];

  if (npiRows.length === 0 && cliaRows.length === 0) return null;

  return (
    <div className="lab-registry-raw">
      {npiRows.length > 0 && (
        <section className="lab-registry-raw__block" aria-labelledby="lab-registry-raw-npi">
          <h4 id="lab-registry-raw-npi" className="lab-registry-raw__heading">
            NPI Registry (raw)
          </h4>
          <RawTable rows={npiRows} />
        </section>
      )}
      {cliaRows.length > 0 && (
        <section className="lab-registry-raw__block" aria-labelledby="lab-registry-raw-clia">
          <h4 id="lab-registry-raw-clia" className="lab-registry-raw__heading">
            CMS CLIA POS (raw)
          </h4>
          <p className="lab-registry-raw__hint">
            Full CMS Provider of Services extract fields for this certificate.
          </p>
          <div className="lab-registry-raw__scroll">
            <RawTable rows={cliaRows} />
          </div>
        </section>
      )}
    </div>
  );
}
