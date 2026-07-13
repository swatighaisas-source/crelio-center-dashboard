import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import { readLabStorageRecord, writeLabStorageRecord } from "../lib/labStorage";
import {
  createDefaultPaymentModes,
  formatPaymentModeLabel,
  type PaymentModeRow,
} from "../data/paymentModes";

const PAYMENT_MODES_STORAGE_KEY = "crelio-payment-modes-by-lab";

type PaymentModesByLab = Record<string, PaymentModeRow[]>;

function labKey(labId: number) {
  return String(labId);
}

function readPaymentModesByLab(): PaymentModesByLab {
  return readLabStorageRecord<PaymentModesByLab>(PAYMENT_MODES_STORAGE_KEY);
}

function writePaymentModesForLab(labId: number, rows: PaymentModeRow[]) {
  const all = readPaymentModesByLab();
  writeLabStorageRecord(PAYMENT_MODES_STORAGE_KEY, {
    ...all,
    [labKey(labId)]: rows,
  });
}

interface PaymentModesContextValue {
  getPaymentModes: (labId: number) => PaymentModeRow[];
  savePaymentModes: (labId: number, rows: PaymentModeRow[]) => void;
  getVisiblePaymentModeOptions: (labId: number) => { value: string; label: string }[];
}

const PaymentModesContext = createContext<PaymentModesContextValue | null>(null);

export function PaymentModesProvider({ children }: { children: ReactNode }) {
  const [paymentModesByLab, setPaymentModesByLab] = useState<PaymentModesByLab>(() =>
    readPaymentModesByLab(),
  );

  const getPaymentModes = useCallback(
    (labId: number) => {
      const saved = paymentModesByLab[labKey(labId)];
      if (saved) return saved;
      return createDefaultPaymentModes();
    },
    [paymentModesByLab],
  );

  const savePaymentModes = useCallback((labId: number, rows: PaymentModeRow[]) => {
    writePaymentModesForLab(labId, rows);
    setPaymentModesByLab((prev) => ({ ...prev, [labKey(labId)]: rows }));
  }, []);

  const getVisiblePaymentModeOptions = useCallback(
    (labId: number) => {
      return getPaymentModes(labId)
        .filter((row) => row.showToLab && row.name.trim())
        .map((row) => ({
          value: row.name.trim(),
          label: formatPaymentModeLabel(row.name.trim()),
        }));
    },
    [getPaymentModes],
  );

  const value = useMemo(
    () => ({
      getPaymentModes,
      savePaymentModes,
      getVisiblePaymentModeOptions,
    }),
    [getPaymentModes, savePaymentModes, getVisiblePaymentModeOptions],
  );

  return (
    <PaymentModesContext.Provider value={value}>{children}</PaymentModesContext.Provider>
  );
}

export function usePaymentModes(labId: number) {
  const ctx = useContext(PaymentModesContext);
  if (!ctx) {
    throw new Error("usePaymentModes must be used within PaymentModesProvider");
  }

  const paymentModes = ctx.getPaymentModes(labId);
  const visiblePaymentModeOptions = useMemo(
    () => ctx.getVisiblePaymentModeOptions(labId),
    [ctx, labId, paymentModes],
  );

  return {
    paymentModes,
    visiblePaymentModeOptions,
    savePaymentModes: (rows: PaymentModeRow[]) => ctx.savePaymentModes(labId, rows),
  };
}
