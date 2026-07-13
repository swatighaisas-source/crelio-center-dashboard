import type { LabSPOC } from "../../data/labDetails";

interface Props {
  spocs: LabSPOC[];
}

export function SPOCCard({ spocs }: Props) {
  if (!spocs.length) return null;

  return (
    <div className="detail-card detail-card--compact">
      <div className="detail-card__header">
        <h3>Contacts</h3>
      </div>
      <div className="spoc-list">
        {spocs.map((spoc) => (
          <div key={spoc.email} className="spoc-list__item">
            <div className="spoc-list__avatar" aria-hidden>
              {spoc.name.charAt(0).toUpperCase()}
            </div>
            <div className="spoc-list__body">
              <div className="spoc-list__name">{spoc.name}</div>
              <div className="spoc-list__role">{spoc.role}</div>
              <div className="spoc-list__contact">
                <a href={`mailto:${spoc.email}`} className="spoc-list__link">
                  {spoc.email}
                </a>
                {spoc.phone && (
                  <span className="spoc-list__phone">{spoc.phone}</span>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
