export const DEFAULT_PAYMENT_MODE_NAMES = [
  "Cash",
  "Credit Card",
  "Debit Card",
  "Swipe M/c",
  "Credit",
  "Cheque",
  "Wallets",
  "free",
  "Other",
] as const;

export type FieldRequirement = "mandatory" | "optional";

export interface PaymentModeRow {
  id: string;
  name: string;
  showToLab: boolean;
  isCustom: boolean;
  transactionId: FieldRequirement;
  bankDetailsComments: FieldRequirement;
}

export const FIELD_REQUIREMENT_OPTIONS: { value: FieldRequirement; label: string }[] = [
  { value: "mandatory", label: "Required" },
  { value: "optional", label: "Optional" },
];

export function createDefaultPaymentModes(): PaymentModeRow[] {
  return DEFAULT_PAYMENT_MODE_NAMES.map((name, index) => ({
    id: `default-${index}`,
    name,
    showToLab: true,
    isCustom: false,
    transactionId: "mandatory",
    bankDetailsComments: "mandatory",
  }));
}

export function createEmptyCustomPaymentMode(): PaymentModeRow {
  return {
    id: `custom-${Date.now()}`,
    name: "",
    showToLab: true,
    isCustom: true,
    transactionId: "mandatory",
    bankDetailsComments: "mandatory",
  };
}

export function formatPaymentModeLabel(name: string): string {
  if (!name) return "";
  if (name.toLowerCase() === "free") return "free";
  return name.toUpperCase();
}

export function paymentModesMatch(modeA: string, modeB: string): boolean {
  return modeA.trim().toLowerCase() === modeB.trim().toLowerCase();
}

export function getPaymentModeRequirements(
  paymentModes: PaymentModeRow[],
  modeName: string,
): { transactionId: FieldRequirement; bankDetailsComments: FieldRequirement } {
  const normalized = modeName.trim().toLowerCase();
  const row = paymentModes.find((item) => item.name.trim().toLowerCase() === normalized);
  return {
    transactionId: row?.transactionId ?? "optional",
    bankDetailsComments: row?.bankDetailsComments ?? "optional",
  };
}

export function fieldRequirementPlaceholder(requirement: FieldRequirement): string {
  return requirement === "mandatory" ? "Required" : "Optional";
}

export interface PaymentFieldErrors {
  transactionId?: boolean;
  bankDetailsComments?: boolean;
}

export function getPaymentFieldErrors(
  paymentModes: PaymentModeRow[],
  paymentMode: string,
  transactionId: string,
  bankDetailsComments: string,
): PaymentFieldErrors {
  if (!paymentMode.trim()) {
    return {};
  }

  const requirements = getPaymentModeRequirements(paymentModes, paymentMode);
  return {
    transactionId: requirements.transactionId === "mandatory" && !transactionId.trim(),
    bankDetailsComments:
      requirements.bankDetailsComments === "mandatory" && !bankDetailsComments.trim(),
  };
}

export function hasPaymentFieldErrors(errors: PaymentFieldErrors): boolean {
  return Boolean(errors.transactionId || errors.bankDetailsComments);
}

export function paymentModeRequiresDetails(
  paymentModes: PaymentModeRow[],
  modeName: string,
): boolean {
  const requirements = getPaymentModeRequirements(paymentModes, modeName);
  return (
    requirements.transactionId === "mandatory" ||
    requirements.bankDetailsComments === "mandatory"
  );
}
