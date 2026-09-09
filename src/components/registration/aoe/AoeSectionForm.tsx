import type { AoeQuestion, AoeSection } from "../../../data/aoeTypes";

interface Props {
  section: AoeSection;
  sectionTitle: string;
  getFieldValue: (questionId: string) => string;
  onFieldChange: (questionId: string, sectionId: string, value: string) => void;
}

function SignatureField({
  value,
  onChange,
}: {
  value: string;
  onChange: (value: string) => void;
}) {
  return (
    <div className="aoe-signature">
      <div
        className="aoe-signature__pad"
        role="img"
        aria-label="Signature pad"
        onClick={() => onChange(value || "signed")}
      >
        {value ? (
          <svg viewBox="0 0 200 60" className="aoe-signature__stroke" aria-hidden>
            <path
              d="M10,40 Q40,10 70,35 T130,25 T190,40"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
            />
          </svg>
        ) : (
          <span className="aoe-signature__placeholder">Click to sign</span>
        )}
      </div>
      {value ? (
        <button
          type="button"
          className="aoe-signature__clear"
          onClick={() => onChange("")}
        >
          Clear
        </button>
      ) : null}
    </div>
  );
}

function QuestionField({
  question,
  sectionId,
  value,
  onChange,
}: {
  question: AoeQuestion;
  sectionId: string;
  value: string;
  onChange: (questionId: string, sectionId: string, value: string) => void;
}) {
  const id = `aoe-q-${question.id}`;
  const label = (
    <>
      {question.label}
      {question.required ? <span className="aoe-field__required"> *</span> : null}
    </>
  );

  switch (question.type) {
    case "textarea":
      return (
        <label className="aoe-field" htmlFor={id}>
          <span className="aoe-field__label">{label}</span>
          <textarea
            id={id}
            className="aoe-field__textarea"
            value={value}
            rows={3}
            onChange={(e) => onChange(question.id, sectionId, e.target.value)}
            onBlur={(e) => onChange(question.id, sectionId, e.target.value)}
          />
        </label>
      );
    case "email":
      return (
        <label className="aoe-field" htmlFor={id}>
          <span className="aoe-field__label">{label}</span>
          <input
            id={id}
            type="email"
            className="aoe-field__input"
            value={value}
            onChange={(e) => onChange(question.id, sectionId, e.target.value)}
            onBlur={(e) => onChange(question.id, sectionId, e.target.value)}
          />
        </label>
      );
    case "date":
      return (
        <label className="aoe-field" htmlFor={id}>
          <span className="aoe-field__label">{label}</span>
          <input
            id={id}
            type="date"
            className="aoe-field__input"
            value={value}
            onChange={(e) => onChange(question.id, sectionId, e.target.value)}
            onBlur={(e) => onChange(question.id, sectionId, e.target.value)}
          />
        </label>
      );
    case "datetime":
      return (
        <label className="aoe-field" htmlFor={id}>
          <span className="aoe-field__label">{label}</span>
          <input
            id={id}
            type="datetime-local"
            className="aoe-field__input"
            value={value}
            onChange={(e) => onChange(question.id, sectionId, e.target.value)}
            onBlur={(e) => onChange(question.id, sectionId, e.target.value)}
          />
        </label>
      );
    case "signature":
      return (
        <div className="aoe-field">
          <span className="aoe-field__label">{label}</span>
          <SignatureField
            value={value}
            onChange={(next) => onChange(question.id, sectionId, next)}
          />
        </div>
      );
    default:
      return (
        <label className="aoe-field" htmlFor={id}>
          <span className="aoe-field__label">{label}</span>
          <input
            id={id}
            type="text"
            className="aoe-field__input"
            value={value}
            onChange={(e) => onChange(question.id, sectionId, e.target.value)}
            onBlur={(e) => onChange(question.id, sectionId, e.target.value)}
          />
        </label>
      );
  }
}

export function AoeSectionForm({
  section,
  sectionTitle,
  getFieldValue,
  onFieldChange,
}: Props) {
  return (
    <div className="aoe-section-form">
      <h3 className="aoe-section-form__title">{sectionTitle}</h3>
      <div className="aoe-section-form__fields">
        {section.questions.map((question) => (
          <QuestionField
            key={question.id}
            question={question}
            sectionId={section.id}
            value={getFieldValue(question.id)}
            onChange={onFieldChange}
          />
        ))}
      </div>
    </div>
  );
}
