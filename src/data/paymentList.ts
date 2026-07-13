import { DEFAULT_PAYMENT_MODE_NAMES, formatPaymentModeLabel } from "./paymentModes";
import type { PaymentHistory } from "./inflow/mockOrders";

export interface PaymentListEntry {
  id: string;
  paymentMode: string;
  transactionId: string;
  bankDetailsComments: string;
  amount: string;
}

export interface PaymentListDraft {
  paymentMode: string;
  transactionId: string;
  bankDetailsComments: string;
  amount: string;
}

export function createEmptyPaymentListDraft(): PaymentListDraft {
  return {
    paymentMode: "",
    transactionId: "",
    bankDetailsComments: "",
    amount: "",
  };
}

export function createDefaultPaymentListEntries(
  defaultMode: string = DEFAULT_PAYMENT_MODE_NAMES[0],
): PaymentListEntry[] {
  if (!defaultMode) return [];
  return [
    {
      id: "entry-1",
      paymentMode: defaultMode,
      transactionId: "",
      bankDetailsComments: "",
      amount: "0.0",
    },
  ];
}

export function normalizePaymentModeName(mode: string): string {
  const trimmed = mode.trim();
  if (!trimmed) return "";

  const match = DEFAULT_PAYMENT_MODE_NAMES.find(
    (name) => name.toLowerCase() === trimmed.toLowerCase(),
  );
  return match ?? trimmed;
}

export function paymentHistoryToEntries(history: PaymentHistory[]): PaymentListEntry[] {
  return history.map((payment, index) => ({
    id: `entry-history-${index}-${payment.mode}`,
    paymentMode: normalizePaymentModeName(payment.mode),
    transactionId: "",
    bankDetailsComments: "",
    amount: String(payment.amount),
  }));
}

export function buildEntryModeOptions(
  entryMode: string,
  visibleOptions: { value: string; label: string }[],
): { value: string; label: string }[] {
  const options = new Map(
    visibleOptions.map((option) => [option.value.toLowerCase(), option]),
  );
  const normalized = entryMode.trim();

  if (normalized) {
    const key = normalized.toLowerCase();
    if (!options.has(key)) {
      options.set(key, {
        value: normalized,
        label: formatPaymentModeLabel(normalized),
      });
    }
  }

  return Array.from(options.values());
}

export function entriesToPaymentHistory(
  entries: PaymentListEntry[],
  orderDate: string,
  collectedBy = "Livehealth",
): PaymentHistory[] {
  return entries.map((entry) => ({
    mode: formatPaymentModeLabel(entry.paymentMode),
    type: "Patient Payment",
    serviceName: "-",
    amount: Number.parseFloat(entry.amount) || 0,
    transactionDate: orderDate,
    collectedBy,
  }));
}

export function getTotalPaymentAmount(entries: PaymentListEntry[]): number {
  return entries.reduce((sum, entry) => sum + (Number.parseFloat(entry.amount) || 0), 0);
}

/** Stable in-app key for registration Bill Patient draft payments per lab. */
export function getRegistrationBillDraftOrderId(labId: number): number {
  return -Math.abs(labId || 1);
}
