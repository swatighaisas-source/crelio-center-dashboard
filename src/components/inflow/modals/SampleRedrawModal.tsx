import { useMemo, useState } from "react";
import type { Sample } from "../../../data/inflow/mockSamples";

const redrawInstantComments = [
  "Sample requires redraw due to insufficient volume or quality issue.",
  "Redraw requested. Associated reports for selected services will be removed from the system.",
  "Please arrange recollection and confirm once the new sample is received.",
];

type Props = {
  sample: Sample;
  services: string[];
  onClose: () => void;
  onConfirm: (payload: {
    sampleId: string;
    selectedServices: string[];
    comment: string;
    sendEmailToPatient: boolean;
    sendEmailToAccount: boolean;
  }) => void;
};

export function SampleRedrawModal({ sample, services, onClose, onConfirm }: Props) {
  const [selectedServices, setSelectedServices] = useState<string[]>(
    services.length === 1 ? [services[0]] : [],
  );
  const [comment, setComment] = useState("");
  const [sendEmailToPatient, setSendEmailToPatient] = useState(false);
  const [sendEmailToAccount, setSendEmailToAccount] = useState(false);
  const [isInstantCommentOpen, setIsInstantCommentOpen] = useState(false);

  const allSelected = services.length > 0 && selectedServices.length === services.length;
  const selectedSet = useMemo(() => new Set(selectedServices), [selectedServices]);

  const toggleService = (service: string) => {
    setSelectedServices((current) =>
      current.includes(service) ? current.filter((item) => item !== service) : [...current, service],
    );
  };

  const toggleAll = () => {
    setSelectedServices(allSelected ? [] : [...services]);
  };

  const handleConfirm = () => {
    onConfirm({
      sampleId: sample.id,
      selectedServices,
      comment,
      sendEmailToPatient,
      sendEmailToAccount,
    });
  };

  return (
    <div className="sample-redraw-backdrop" onClick={onClose}>
      <section
        className="sample-redraw-modal"
        role="dialog"
        aria-modal="true"
        aria-label="Redraw sample confirmation"
        onClick={(event) => event.stopPropagation()}
      >
        <button className="sample-redraw-close" onClick={onClose} aria-label="Close">
          ×
        </button>

        <h2>Do you want to redraw this sample?</h2>
        <p className="sample-redraw-copy">
          Are you sure you want to redraw this sample? Select the services for which you want to redraw the sample.
          All the reports associated with the selected services will be Redrawn from the system. Click Cancel if you
          are not sure.
        </p>

        <div className="sample-redraw-services">
          <label className={allSelected ? "selected" : ""}>
            <input type="checkbox" checked={allSelected} onChange={toggleAll} />
            All
          </label>
          {services.map((service) => (
            <label className={selectedSet.has(service) ? "selected" : ""} key={service}>
              <input
                type="checkbox"
                checked={selectedSet.has(service)}
                onChange={() => toggleService(service)}
              />
              {service}
            </label>
          ))}
        </div>

        <label className="sample-redraw-comments">
          Comments
          <textarea placeholder="Enter Comments" value={comment} onChange={(event) => setComment(event.target.value)} />
        </label>

        <div className="instant-comment-picker">
          <button type="button" onClick={() => setIsInstantCommentOpen((open) => !open)}>
            Instant Comment
          </button>
          {isInstantCommentOpen ? (
            <div className="instant-comment-menu" role="menu">
              {redrawInstantComments.map((text) => (
                <button
                  key={text}
                  type="button"
                  onClick={() => {
                    setComment(text);
                    setIsInstantCommentOpen(false);
                  }}
                >
                  <span>{text}</span>
                </button>
              ))}
            </div>
          ) : null}
        </div>

        <div className="sample-redraw-notify">
          <label>
            <input
              type="checkbox"
              checked={sendEmailToPatient}
              onChange={(event) => setSendEmailToPatient(event.target.checked)}
            />
            Send Email to Patient
          </label>
          <label>
            <input
              type="checkbox"
              checked={sendEmailToAccount}
              onChange={(event) => setSendEmailToAccount(event.target.checked)}
            />
            Send Email to Account
          </label>
        </div>

        <footer className="sample-redraw-footer">
          <button type="button" onClick={onClose}>
            Cancel
          </button>
          <button type="button" className="primary" disabled={!selectedServices.length} onClick={handleConfirm}>
            Yes, I am sure
          </button>
        </footer>
      </section>
    </div>
  );
}
