import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import {
  findAoeConfigForBillTest,
  findAoeConfigsForBillTest,
  getAoeConfiguration,
  mockAoeConfigurations,
} from "../data/aoeConfiguration";
import {
  DEFAULT_AOE_CAPTURE_FREQUENCY,
  type AoeCaptureFrequency,
} from "../data/aoeTypes";
import { readLabStorageRecord, writeLabStorageRecord, labScopedKey } from "../lib/labStorage";

const AOE_CONFIG_STORAGE_KEY = "crelio-aoe-config-by-lab";

type AoeConfigByLab = Record<
  string,
  {
    /** Last AOE Capture Frequency saved from any AOE Configuration form. */
    captureFrequency?: AoeCaptureFrequency;
    byConfigId?: Record<string, AoeCaptureFrequency>;
  }
>;

function labKey(labId: number) {
  return String(labId);
}

function readConfigByLab(): AoeConfigByLab {
  return readLabStorageRecord<AoeConfigByLab>(AOE_CONFIG_STORAGE_KEY);
}

function writeConfigByLab(all: AoeConfigByLab) {
  writeLabStorageRecord(AOE_CONFIG_STORAGE_KEY, all);
}

function defaultFrequencyForConfig(configId: number): AoeCaptureFrequency {
  return getAoeConfiguration(configId)?.captureFrequency ?? DEFAULT_AOE_CAPTURE_FREQUENCY;
}

interface LabAoeConfigContextValue {
  getCaptureFrequency: (labId: number) => AoeCaptureFrequency;
  getCaptureFrequencyForConfig: (labId: number, configId: number) => AoeCaptureFrequency;
  setCaptureFrequencyForConfig: (
    labId: number,
    configId: number,
    frequency: AoeCaptureFrequency,
  ) => void;
  getCaptureFrequencyForTest: (
    labId: number,
    testId: string,
    testName: string,
  ) => AoeCaptureFrequency;
}

const LabAoeConfigContext = createContext<LabAoeConfigContextValue | null>(null);

export function LabAoeConfigProvider({ children }: { children: ReactNode }) {
  const [configByLab, setConfigByLab] = useState<AoeConfigByLab>(() => readConfigByLab());

  const getCaptureFrequencyForConfig = useCallback(
    (labId: number, configId: number): AoeCaptureFrequency => {
      const stored = configByLab[labKey(labId)]?.byConfigId?.[String(configId)];
      if (stored) return stored;
      return defaultFrequencyForConfig(configId);
    },
    [configByLab],
  );

  const setCaptureFrequencyForConfig = useCallback(
    (labId: number, configId: number, frequency: AoeCaptureFrequency) => {
      setConfigByLab((prev) => {
        const key = labKey(labId);
        const existing = prev[key] ?? {};
        const next: AoeConfigByLab = {
          ...prev,
          [key]: {
            ...existing,
            captureFrequency: frequency,
            byConfigId: {
              ...(existing.byConfigId ?? {}),
              [String(configId)]: frequency,
            },
          },
        };
        writeConfigByLab(next);
        return next;
      });
    },
    [],
  );

  const getCaptureFrequencyForTest = useCallback(
    (labId: number, testId: string, testName: string): AoeCaptureFrequency => {
      const labConfig = configByLab[labKey(labId)];
      const matches = findAoeConfigsForBillTest(testId, testName, mockAoeConfigurations);

      // Prefer an explicit override saved on any matching AOE Configuration form.
      for (const match of matches) {
        const stored = labConfig?.byConfigId?.[String(match.id)];
        if (stored) return stored;
      }

      // Prefer the last Capture Frequency saved from AOE Configuration (lab-wide).
      if (labConfig?.captureFrequency) {
        return labConfig.captureFrequency;
      }

      const preferred =
        findAoeConfigForBillTest(testId, testName, matches) ?? matches[0];
      if (preferred) {
        return defaultFrequencyForConfig(preferred.id);
      }

      return DEFAULT_AOE_CAPTURE_FREQUENCY;
    },
    [configByLab],
  );

  const getCaptureFrequency = useCallback(
    (labId: number): AoeCaptureFrequency => {
      return (
        configByLab[labKey(labId)]?.captureFrequency ?? DEFAULT_AOE_CAPTURE_FREQUENCY
      );
    },
    [configByLab],
  );

  const value = useMemo(
    () => ({
      getCaptureFrequency,
      getCaptureFrequencyForConfig,
      setCaptureFrequencyForConfig,
      getCaptureFrequencyForTest,
    }),
    [
      getCaptureFrequency,
      getCaptureFrequencyForConfig,
      setCaptureFrequencyForConfig,
      getCaptureFrequencyForTest,
    ],
  );

  return (
    <LabAoeConfigContext.Provider value={value}>{children}</LabAoeConfigContext.Provider>
  );
}

export function useLabAoeConfig(labId: number) {
  const ctx = useContext(LabAoeConfigContext);
  if (!ctx) {
    throw new Error("useLabAoeConfig must be used within LabAoeConfigProvider");
  }

  const captureFrequency = ctx.getCaptureFrequency(labId);

  return {
    captureFrequency,
    getCaptureFrequencyForConfig: (configId: number) =>
      ctx.getCaptureFrequencyForConfig(labId, configId),
    setCaptureFrequencyForConfig: (configId: number, frequency: AoeCaptureFrequency) =>
      ctx.setCaptureFrequencyForConfig(labId, configId, frequency),
    getCaptureFrequencyForTest: (testId: string, testName: string) =>
      ctx.getCaptureFrequencyForTest(labId, testId, testName),
    /** Resolver for bill AOE queues — governed by mapped AOE Configuration flag. */
    resolveFrequencyForTest: (testId: string, testName = "") =>
      ctx.getCaptureFrequencyForTest(labId, testId, testName),
  };
}

export function getAoeConfigStorageKey(labId: number) {
  return labScopedKey(labId, "aoe-capture-frequency");
}
