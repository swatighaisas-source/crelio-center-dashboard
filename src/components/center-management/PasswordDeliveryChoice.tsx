import type { PasswordDeliveryMethod } from "../../lib/userPassword";

interface Props {
  name: string;
  value: PasswordDeliveryMethod;
  onChange: (value: PasswordDeliveryMethod) => void;
  manualLabel?: string;
  emailLabel?: string;
  legend?: string;
  layout?: "inline" | "stacked";
}

export function PasswordDeliveryChoice({
  name,
  value,
  onChange,
  manualLabel = "Set password now",
  emailLabel = "Send Auto Generated Password over email",
  legend = "Password delivery",
  layout = "inline",
}: Props) {
  const stacked = layout === "stacked";

  return (
    <fieldset className={`ue-pw-choice${stacked ? " ue-pw-choice--stacked" : ""}`}>
      {!stacked && <legend className="ue-pw-choice__legend">{legend}</legend>}
      <div className={`ue-pw-choice__options${stacked ? " ue-pw-choice__options--stacked" : ""}`}>
        <label className={`ue-pw-choice__option${stacked ? " ue-pw-choice__option--stacked" : ""}`}>
          <input
            type="radio"
            name={name}
            value="manual"
            checked={value === "manual"}
            onChange={() => onChange("manual")}
          />
          <span>{manualLabel}</span>
        </label>
        <label className={`ue-pw-choice__option${stacked ? " ue-pw-choice__option--stacked" : ""}`}>
          <input
            type="radio"
            name={name}
            value="email"
            checked={value === "email"}
            onChange={() => onChange("email")}
          />
          <span>{emailLabel}</span>
        </label>
      </div>
    </fieldset>
  );
}
