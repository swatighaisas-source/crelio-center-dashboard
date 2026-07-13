import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import {
  CONFIGURED_DEFAULT_PAYMENT_ACCOUNT_IDS,
  DEFAULT_FINANCE_ACCOUNTS,
  getConfiguredAccountDefaultPaymentMode,
  type FinanceAccount,
} from "../data/financeAccounts";
import {
  labScopedKey,
  readLabStorageRecord,
  writeLabStorageRecord,
} from "../lib/labStorage";
import { paymentModesMatch } from "../data/paymentModes";

const ACCOUNT_DEFAULT_MODES_STORAGE_KEY = "crelio-account-default-payment-modes";

type DefaultModesByAccount = Record<string, string>;

function readStoredModes(): DefaultModesByAccount {
  return readLabStorageRecord<DefaultModesByAccount>(ACCOUNT_DEFAULT_MODES_STORAGE_KEY);
}

function writeStoredModes(modes: DefaultModesByAccount) {
  writeLabStorageRecord(ACCOUNT_DEFAULT_MODES_STORAGE_KEY, modes);
}

function seedLabDefaultsIfMissing(
  stored: DefaultModesByAccount,
  labId: number,
): DefaultModesByAccount {
  let changed = false;
  const next = { ...stored };

  for (const accountId of CONFIGURED_DEFAULT_PAYMENT_ACCOUNT_IDS) {
    const key = labScopedKey(labId, accountId);
    if (next[key]) continue;
    const seed = getConfiguredAccountDefaultPaymentMode(accountId);
    if (!seed) continue;
    next[key] = seed;
    changed = true;
  }

  if (changed) writeStoredModes(next);
  return changed ? next : stored;
}

interface AccountManagementContextValue {
  getAccounts: (labId: number) => FinanceAccount[];
  getDefaultPaymentMode: (labId: number, accountId: string) => string;
  getAccountsWithDefaultPaymentMode: (labId: number, modeName: string) => FinanceAccount[];
  setDefaultPaymentMode: (labId: number, accountId: string, mode: string) => void;
  transferDefaultPaymentModeForAccounts: (
    labId: number,
    accountIds: string[],
    newMode: string,
  ) => void;
  seedLabDefaults: (labId: number) => void;
}

const AccountManagementContext = createContext<AccountManagementContextValue | null>(null);

export function AccountManagementProvider({ children }: { children: ReactNode }) {
  const [defaultModesByAccount, setDefaultModesByAccount] = useState<DefaultModesByAccount>(
    () => readStoredModes(),
  );

  const seedLabDefaults = useCallback((labId: number) => {
    setDefaultModesByAccount((prev) => {
      const next = seedLabDefaultsIfMissing(prev, labId);
      return next === prev ? prev : next;
    });
  }, []);

  const getDefaultPaymentMode = useCallback(
    (labId: number, accountId: string) => {
      if (!CONFIGURED_DEFAULT_PAYMENT_ACCOUNT_IDS.has(accountId)) return "";
      const key = labScopedKey(labId, accountId);
      const stored = defaultModesByAccount[key];
      if (stored) return stored;
      return getConfiguredAccountDefaultPaymentMode(accountId);
    },
    [defaultModesByAccount],
  );

  const setDefaultPaymentMode = useCallback(
    (labId: number, accountId: string, mode: string) => {
      if (!CONFIGURED_DEFAULT_PAYMENT_ACCOUNT_IDS.has(accountId)) return;
      setDefaultModesByAccount((prev) => {
        const next = {
          ...prev,
          [labScopedKey(labId, accountId)]: mode,
        };
        writeStoredModes(next);
        return next;
      });
    },
    [],
  );

  const getAccounts = useCallback(
    (labId: number): FinanceAccount[] =>
      DEFAULT_FINANCE_ACCOUNTS.map((account) => ({
        ...account,
        defaultPaymentMode: getDefaultPaymentMode(labId, account.id),
      })),
    [getDefaultPaymentMode],
  );

  const getConfiguredAccounts = useCallback(
    (labId: number): FinanceAccount[] =>
      DEFAULT_FINANCE_ACCOUNTS.filter((account) =>
        CONFIGURED_DEFAULT_PAYMENT_ACCOUNT_IDS.has(account.id),
      ).map((account) => ({
        ...account,
        defaultPaymentMode: getDefaultPaymentMode(labId, account.id),
      })),
    [getDefaultPaymentMode],
  );

  const getAccountsWithDefaultPaymentMode = useCallback(
    (labId: number, modeName: string) => {
      if (!modeName.trim()) return [];
      return getConfiguredAccounts(labId).filter((account) =>
        paymentModesMatch(account.defaultPaymentMode, modeName),
      );
    },
    [getConfiguredAccounts],
  );

  const transferDefaultPaymentModeForAccounts = useCallback(
    (labId: number, accountIds: string[], newMode: string) => {
      if (!newMode.trim() || accountIds.length === 0) return;
      const allowedIds = accountIds.filter((accountId) =>
        CONFIGURED_DEFAULT_PAYMENT_ACCOUNT_IDS.has(accountId),
      );
      if (allowedIds.length === 0) return;
      setDefaultModesByAccount((prev) => {
        const next = { ...prev };
        for (const accountId of allowedIds) {
          next[labScopedKey(labId, accountId)] = newMode.trim();
        }
        writeStoredModes(next);
        return next;
      });
    },
    [],
  );

  const value = useMemo(
    () => ({
      getAccounts,
      getDefaultPaymentMode,
      getAccountsWithDefaultPaymentMode,
      setDefaultPaymentMode,
      transferDefaultPaymentModeForAccounts,
      seedLabDefaults,
    }),
    [
      getAccounts,
      getDefaultPaymentMode,
      getAccountsWithDefaultPaymentMode,
      setDefaultPaymentMode,
      transferDefaultPaymentModeForAccounts,
      seedLabDefaults,
    ],
  );

  return (
    <AccountManagementContext.Provider value={value}>
      {children}
    </AccountManagementContext.Provider>
  );
}

export function useAccountManagement(labId: number) {
  const ctx = useContext(AccountManagementContext);
  if (!ctx) {
    throw new Error("useAccountManagement must be used within AccountManagementProvider");
  }

  useEffect(() => {
    ctx.seedLabDefaults(labId);
  }, [ctx, labId]);

  return {
    accounts: ctx.getAccounts(labId),
    getDefaultPaymentMode: (accountId: string) => ctx.getDefaultPaymentMode(labId, accountId),
    getAccountsWithDefaultPaymentMode: (modeName: string) =>
      ctx.getAccountsWithDefaultPaymentMode(labId, modeName),
    setDefaultPaymentMode: (accountId: string, mode: string) =>
      ctx.setDefaultPaymentMode(labId, accountId, mode),
    transferDefaultPaymentModeForAccounts: (accountIds: string[], newMode: string) =>
      ctx.transferDefaultPaymentModeForAccounts(labId, accountIds, newMode),
  };
}
