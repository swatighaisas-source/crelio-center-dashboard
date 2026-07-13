import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import type { PaymentListEntry } from "../data/paymentList";

const STORAGE_KEY = "crelio-order-payments";

function orderPaymentKey(labId: number, orderId: number) {
  return `${labId}:${orderId}`;
}

function readStoredPayments(): Record<string, PaymentListEntry[]> {
  if (typeof window === "undefined") return {};
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    return raw ? (JSON.parse(raw) as Record<string, PaymentListEntry[]>) : {};
  } catch {
    return {};
  }
}

function writeStoredPayments(payments: Record<string, PaymentListEntry[]>) {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(payments));
  } catch {
    // Ignore quota / private mode errors.
  }
}

interface OrderPaymentListContextValue {
  getOrderPayments: (labId: number, orderId: number) => PaymentListEntry[];
  saveOrderPayments: (labId: number, orderId: number, entries: PaymentListEntry[]) => void;
}

const OrderPaymentListContext = createContext<OrderPaymentListContextValue | null>(null);

export function OrderPaymentListProvider({ children }: { children: ReactNode }) {
  const [paymentsByOrder, setPaymentsByOrder] = useState<Record<string, PaymentListEntry[]>>(
    () => readStoredPayments(),
  );

  const getOrderPayments = useCallback(
    (labId: number, orderId: number) => paymentsByOrder[orderPaymentKey(labId, orderId)] ?? [],
    [paymentsByOrder],
  );

  const saveOrderPayments = useCallback(
    (labId: number, orderId: number, entries: PaymentListEntry[]) => {
      setPaymentsByOrder((prev) => {
        const next = {
          ...prev,
          [orderPaymentKey(labId, orderId)]: entries,
        };
        writeStoredPayments(next);
        return next;
      });
    },
    [],
  );

  const value = useMemo(
    () => ({
      getOrderPayments,
      saveOrderPayments,
    }),
    [getOrderPayments, saveOrderPayments],
  );

  return (
    <OrderPaymentListContext.Provider value={value}>{children}</OrderPaymentListContext.Provider>
  );
}

export function useOrderPaymentList(labId: number, orderId: number) {
  const ctx = useContext(OrderPaymentListContext);
  if (!ctx) {
    throw new Error("useOrderPaymentList must be used within OrderPaymentListProvider");
  }

  return {
    savedPayments: ctx.getOrderPayments(labId, orderId),
    saveOrderPayments: (entries: PaymentListEntry[]) =>
      ctx.saveOrderPayments(labId, orderId, entries),
  };
}
