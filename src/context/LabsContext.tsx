import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import {
  INITIAL_LAB_ROWS,
  type LabRow,
  type CreateCentreForm,
  labRowFromCreateForm,
} from "../data/labs";
import type { FeedbackEntry, LabDetail, LabOnboardingSnapshot } from "../data/labDetails";
import type { LabWorkflowConfig } from "../data/labWorkflowConfig";
import {
  type LabUserRole,
  type HomeLandingPreference,
  type FeedbackState,
  type NpsFeedbackSubmission,
  INITIAL_FEEDBACK_STATE,
} from "../data/labHome";
import {
  createDefaultProfile,
  type LabUserProfile,
} from "../data/labUserProfile";
import {
  lifecycleDetailStatus,
  type LabLifecycleState,
} from "../data/labLifecycle";
import {
  EMPTY_VERIFICATION_STATE,
  type VerificationState,
  type VerificationItemId,
} from "../data/labOnboardingVerification";
import type { ScannerDevice } from "../data/scannerVendors";
import { CENTER_USERS, type CenterUser } from "../data/centerUsers";

type DetailOverrides = Record<number, Partial<LabDetail>>;

interface LabsContextValue {
  labs: LabRow[];
  summary: {
    totalCount: number;
    totalMrrInr: number;
    totalMrrUsd: number;
    rows: number;
  };
  detailOverrides: DetailOverrides;
  addLab: (form: CreateCentreForm) => LabRow;
  getLabDetail: (id: number) => LabDetail | undefined;
  updateLabOnboardingSnapshot: (id: number, snapshot: LabOnboardingSnapshot) => void;
  updateLabTrackedFeedbackFeatures: (id: number, featureIds: string[]) => void;
  updateLabWorkflowConfig: (id: number, patch: Partial<LabWorkflowConfig>) => void;
  homeShortcuts: string[];
  setHomeShortcuts: (shortcuts: string[]) => void;
  activeRole: LabUserRole;
  setActiveRole: (role: LabUserRole) => void;
  feedbackState: FeedbackState;
  submitNps: (labId: number, submission: NpsFeedbackSubmission) => void;
  resetFeedback: () => void;
  landingPreference: HomeLandingPreference | null;
  setLandingPreference: (preference: HomeLandingPreference) => void;
  getUserProfile: (labId: number) => LabUserProfile;
  updateUserProfile: (labId: number, patch: Partial<LabUserProfile>) => void;
  getLabLifecycleState: (labId: number) => LabLifecycleState;
  updateLabLifecycleState: (labId: number, state: LabLifecycleState) => void;
  getVerificationState: (labId: number) => VerificationState;
  setVerificationItem: (labId: number, itemId: VerificationItemId, verified: boolean) => void;
  initiateGoLive: (labId: number) => string;
  confirmGoLive: (labId: number, otp: string) => { success: boolean; error?: string };
  getLabScanners: (labId: number) => ScannerDevice[];
  saveLabScanner: (labId: number, device: ScannerDevice) => void;
  removeLabScanner: (labId: number, scannerId: string) => void;
  getLabUsers: (labId: number) => CenterUser[];
  createLabUser: (labId: number, user: CenterUser) => void;
  updateLabUser: (labId: number, userId: string, patch: Partial<CenterUser>) => void;
}

const LabsContext = createContext<LabsContextValue | null>(null);

export function LabsProvider({ children }: { children: ReactNode }) {
  const [labs, setLabs] = useState<LabRow[]>(INITIAL_LAB_ROWS);
  const [homeShortcuts, setHomeShortcuts] = useState<string[]>([]);
  const [activeRole, setActiveRole] = useState<LabUserRole>("owner");
  const [feedbackState, setFeedbackState] = useState<FeedbackState>(INITIAL_FEEDBACK_STATE);
  const [landingPreference, setLandingPreference] = useState<HomeLandingPreference | null>(null);
  const [scannerState, setScannerState] = useState<Record<number, ScannerDevice[]>>({});
  const [labUsersState, setLabUsersState] = useState<
    Record<number, { created: CenterUser[]; overrides: Record<string, Partial<CenterUser>> }>
  >({});
  const [userProfiles, setUserProfiles] = useState<Record<number, LabUserProfile>>({});
  const [verificationState, setVerificationState] = useState<Record<number, VerificationState>>({});
  const [otpState, setOtpState] = useState<Record<number, string>>({});
  const [detailOverrides, setDetailOverrides] = useState<DetailOverrides>({
    12922: {
      createdOn: "22nd May, 2026",
      email: "vaddirajudheeraj@gmail.com",
      labAbbreviation: "LH",
      accountManager: "Swamy Kethavath",
      mrr: 15104,
      planType: "Fixed recurring",
      expectedLiveNote: "19 Days Left | 0 Days in Onboarding",
      hasBillingDiscrepancy: true,
      address: "Denton, TX, United States",
      contact: "3195944108",
      spocs: [
        { role: "Owner", name: "Dheeraj Vaddiraj", email: "vaddirajudheeraj@gmail.com", phone: "+1 (319) 594-4108" },
        { role: "Lab Director", name: "Dr. Priya Mehta", email: "priya.mehta@diamondmedlab.com", phone: "+1 (410) 834-8601" },
        { role: "Implementation Co-ordinator", name: "Ravi Kiran", email: "ravi.kiran@diamondmedlab.com" },
      ],
      onboardingSnapshot: {
        npi: "1427588029",
        clia: "21D2130306",
        labArchetype: "reference",
        labType: "Reference / Hospital-based Lab",
        modalities: ["Hematology", "Blood Chemistry", "Molecular"],
        devices: ["Sysmex XN-1000", "Sysmex XN-2000", "Roche Cobas c501", "Roche Cobas 6800"],
        integrations: ["AthenaHealth", "Ellkay", "Kareo"],
        volume: "50-200",
        selectedPlan: "pro",
        timeline: "Plan: Pro",
        locations: "2",
        userCount: "15",
      },
      feedbackHistory: [
        {
          id: 1,
          date: "30th May, 2026",
          nps: 8,
          npsPresetComments: [
            "Generally works but reporting or billing workflow needs improvement",
            "Support is helpful but slower at peak times or holidays",
          ],
          npsComment:
            "The NPI prefill saved a lot of time. The modality selection could use clearer labels.",
          modules: [],
          by: "Dheeraj Vaddiraj",
        },
        {
          id: 2,
          date: "24th May, 2026",
          nps: 7,
          npsComment: "Initial demo was good. Need faster turnaround on billing setup.",
          modules: [
            {
              name: "B2B ordering",
              rating: 4,
              relevant: true,
              presetComment: "Mostly works for us; we may need a few adjustments.",
            },
            {
              name: "Billing integration",
              rating: 2,
              relevant: true,
              presetComment: "We have concerns — this does not match how we work today.",
              comment: "Waiting on payer list sync from AM.",
            },
            { name: "WhatsApp delivery", rating: 4, relevant: true },
          ],
          by: "Dr. Priya Mehta",
        },
      ],
      trackedFeedbackFeatureIds: [
        "ordering--appointments",
        "ordering--home-collection",
        "accession--sample-accession",
        "report-validation--auto-validation",
        "report-delivery--email-delivery",
        "billing--billing-integration",
      ],
      workflowConfig: {
        showNotifications: true,
        showActions: true,
      },
    },
  });
  const summary = useMemo(() => {
    const totalMrrInr = labs.reduce((sum, l) => sum + l.mrr, 0);
    return {
      totalCount: labs.length,
      totalMrrInr,
      totalMrrUsd: Math.round(totalMrrInr / 102.7),
      rows: labs.length,
    };
  }, [labs]);

  const addLab = useCallback((form: CreateCentreForm): LabRow => {
    let createdRow!: LabRow;
    setLabs((prev) => {
      const nextId = Math.max(12900, ...prev.map((l) => l.id)) + 1;
      const { row, detail } = labRowFromCreateForm(form, nextId);
      createdRow = row;
      setDetailOverrides((o) => ({ ...o, [nextId]: detail }));
      return [row, ...prev];
    });
    return createdRow;
  }, []);

  const getLabDetail = useCallback(
    (id: number): LabDetail | undefined => {
      const row = labs.find((r) => r.id === id);
      if (!row) return undefined;
      return buildLabDetail(row, detailOverrides[id]);
    },
    [labs, detailOverrides]
  );

  const submitNps = useCallback((labId: number, submission: NpsFeedbackSubmission) => {
    const submittedAt = new Date().toISOString();
    setFeedbackState({
      npsScore: submission.score,
      npsPresetComments: submission.presetComments,
      npsComment: submission.comment,
      submittedAt,
      step: "done",
    });

    setDetailOverrides((prev) => {
      const row = labs.find((item) => item.id === labId);
      if (!row) return prev;

      const existingDetail = buildLabDetail(row, prev[labId]);
      const history = existingDetail.feedbackHistory ?? [];
      const profile = userProfiles[labId];
      const submitter =
        profile?.name?.trim() ||
        existingDetail.spocs[0]?.name ||
        "Lab User";

      const entry: FeedbackEntry = {
        id: history.length > 0 ? Math.max(...history.map((item) => item.id)) + 1 : 1,
        date: formatToday(),
        nps: submission.score,
        npsPresetComments:
          submission.presetComments.length > 0 ? submission.presetComments : undefined,
        npsComment: submission.comment || undefined,
        modules: [],
        by: submitter,
      };

      return {
        ...prev,
        [labId]: {
          ...prev[labId],
          feedbackHistory: [entry, ...history],
        },
      };
    });

    setLabs((prev) =>
      prev.map((row) => (row.id === labId ? { ...row, nps: submission.score } : row)),
    );
  }, [labs, userProfiles]);

  const resetFeedback = useCallback(() => {
    setFeedbackState(INITIAL_FEEDBACK_STATE);
  }, []);

  const getUserProfile = useCallback(
    (labId: number): LabUserProfile => {
      if (userProfiles[labId]) return userProfiles[labId];
      const row = labs.find((l) => l.id === labId);
      const override = detailOverrides[labId];
      const email = override?.email ?? "contact@lab.example.com";
      const name = row?.name ?? "Lab User";
      const abbr = override?.labAbbreviation ?? row?.name.split(/\s+/)[0] ?? "Lab";
      return createDefaultProfile(name, email, abbr);
    },
    [userProfiles, labs, detailOverrides],
  );

  const updateUserProfile = useCallback((labId: number, patch: Partial<LabUserProfile>) => {
    setUserProfiles((prev) => {
      const row = labs.find((l) => l.id === labId);
      const override = detailOverrides[labId];
      const email = override?.email ?? "contact@lab.example.com";
      const name = row?.name ?? "Lab User";
      const abbr = override?.labAbbreviation ?? row?.name.split(/\s+/)[0] ?? "Lab";
      const current = prev[labId] ?? createDefaultProfile(name, email, abbr);
      return { ...prev, [labId]: { ...current, ...patch } };
    });
    if (patch.userRole) {
      setActiveRole(patch.userRole);
    }
  }, [labs, detailOverrides]);

  const updateLabOnboardingSnapshot = useCallback(
    (id: number, snapshot: LabOnboardingSnapshot) => {
      setDetailOverrides((prev) => ({
        ...prev,
        [id]: {
          ...prev[id],
          onboardingSnapshot: snapshot,
        },
      }));
    },
    []
  );

  const updateLabTrackedFeedbackFeatures = useCallback((id: number, featureIds: string[]) => {
    setDetailOverrides((prev) => ({
      ...prev,
      [id]: {
        ...prev[id],
        trackedFeedbackFeatureIds: featureIds,
      },
    }));
  }, []);

  const updateLabWorkflowConfig = useCallback((id: number, patch: Partial<LabWorkflowConfig>) => {
    setDetailOverrides((prev) => ({
      ...prev,
      [id]: {
        ...prev[id],
        workflowConfig: {
          ...prev[id]?.workflowConfig,
          ...patch,
        },
      },
    }));
  }, []);

  const getLabLifecycleState = useCallback(
    (labId: number): LabLifecycleState => {
      const row = labs.find((l) => l.id === labId);
      return row?.lifecycleState ?? "onboarding";
    },
    [labs],
  );

  const updateLabLifecycleState = useCallback((labId: number, state: LabLifecycleState) => {
    const statusLabel = lifecycleDetailStatus(state);
    setLabs((prev) =>
      prev.map((lab) => (lab.id === labId ? { ...lab, lifecycleState: state } : lab)),
    );
    setDetailOverrides((prev) => ({
      ...prev,
      [labId]: {
        ...prev[labId],
        status: statusLabel,
      },
    }));
  }, []);

  const getVerificationState = useCallback(
    (labId: number): VerificationState => {
      return verificationState[labId] ?? EMPTY_VERIFICATION_STATE;
    },
    [verificationState],
  );

  const setVerificationItem = useCallback(
    (labId: number, itemId: VerificationItemId, verified: boolean) => {
      setVerificationState((prev) => ({
        ...prev,
        [labId]: {
          ...(prev[labId] ?? EMPTY_VERIFICATION_STATE),
          [itemId]: verified,
        },
      }));
    },
    [],
  );

  const initiateGoLive = useCallback((labId: number): string => {
    const otp = "123456";
    setOtpState((prev) => ({ ...prev, [labId]: otp }));
    return otp;
  }, []);

  const getLabScanners = useCallback(
    (labId: number): ScannerDevice[] => scannerState[labId] ?? [],
    [scannerState],
  );

  const saveLabScanner = useCallback((labId: number, device: ScannerDevice) => {
    setScannerState((prev) => {
      const existing = prev[labId] ?? [];
      const index = existing.findIndex((s) => s.id === device.id);
      const next =
        index === -1
          ? [...existing, device]
          : existing.map((s, i) => (i === index ? device : s));
      return { ...prev, [labId]: next };
    });
  }, []);

  const removeLabScanner = useCallback((labId: number, scannerId: string) => {
    setScannerState((prev) => ({
      ...prev,
      [labId]: (prev[labId] ?? []).filter((s) => s.id !== scannerId),
    }));
  }, []);

  const getLabUsers = useCallback(
    (labId: number): CenterUser[] => {
      const bucket = labUsersState[labId];
      const overrides = bucket?.overrides ?? {};
      const base = CENTER_USERS.map((user) => ({ ...user, ...overrides[user.id] }));
      const baseIds = new Set(base.map((user) => user.id));
      const created = (bucket?.created ?? []).filter((user) => !baseIds.has(user.id));
      return [...base, ...created];
    },
    [labUsersState],
  );

  const createLabUser = useCallback((labId: number, user: CenterUser) => {
    setLabUsersState((prev) => {
      const bucket = prev[labId] ?? { created: [], overrides: {} };
      return {
        ...prev,
        [labId]: {
          ...bucket,
          created: [...bucket.created, user],
        },
      };
    });
  }, []);

  const updateLabUser = useCallback((labId: number, userId: string, patch: Partial<CenterUser>) => {
    setLabUsersState((prev) => {
      const bucket = prev[labId] ?? { created: [], overrides: {} };
      const createdIndex = bucket.created.findIndex((user) => user.id === userId);
      if (createdIndex !== -1) {
        const created = bucket.created.map((user, index) =>
          index === createdIndex ? { ...user, ...patch } : user,
        );
        return { ...prev, [labId]: { ...bucket, created } };
      }
      return {
        ...prev,
        [labId]: {
          ...bucket,
          overrides: {
            ...bucket.overrides,
            [userId]: { ...bucket.overrides[userId], ...patch },
          },
        },
      };
    });
  }, []);

  const confirmGoLive = useCallback(
    (labId: number, otp: string): { success: boolean; error?: string } => {
      const expectedOtp = otpState[labId];
      if (!expectedOtp) {
        return { success: false, error: "No OTP has been generated. Please request a new OTP." };
      }
      if (otp !== expectedOtp) {
        return { success: false, error: "Invalid OTP. Please check and try again." };
      }
      updateLabLifecycleState(labId, "live");
      setOtpState((prev) => {
        const next = { ...prev };
        delete next[labId];
        return next;
      });
      return { success: true };
    },
    [otpState, updateLabLifecycleState],
  );

  const value = useMemo(
    () => ({
      labs,
      summary,
      detailOverrides,
      addLab,
      getLabDetail,
      updateLabOnboardingSnapshot,
      updateLabTrackedFeedbackFeatures,
      updateLabWorkflowConfig,
      homeShortcuts,
      setHomeShortcuts,
      activeRole,
      setActiveRole,
      feedbackState,
      submitNps,
      resetFeedback,
      landingPreference,
      setLandingPreference,
      getUserProfile,
      updateUserProfile,
      getLabLifecycleState,
      updateLabLifecycleState,
      getVerificationState,
      setVerificationItem,
      initiateGoLive,
      confirmGoLive,
      getLabScanners,
      saveLabScanner,
      removeLabScanner,
      getLabUsers,
      createLabUser,
      updateLabUser,
    }),
    [
      labs,
      summary,
      detailOverrides,
      addLab,
      getLabDetail,
      updateLabOnboardingSnapshot,
      updateLabTrackedFeedbackFeatures,
      updateLabWorkflowConfig,
      homeShortcuts,
      activeRole,
      feedbackState,
      submitNps,
      resetFeedback,
      landingPreference,
      getUserProfile,
      updateUserProfile,
      getLabLifecycleState,
      updateLabLifecycleState,
      getVerificationState,
      setVerificationItem,
      initiateGoLive,
      confirmGoLive,
      getLabScanners,
      saveLabScanner,
      removeLabScanner,
      getLabUsers,
      createLabUser,
      updateLabUser,
    ]
  );

  return <LabsContext.Provider value={value}>{children}</LabsContext.Provider>;
}

export function useLabs() {
  const ctx = useContext(LabsContext);
  if (!ctx) throw new Error("useLabs must be used within LabsProvider");
  return ctx;
}

function buildLabDetail(row: LabRow, override?: Partial<LabDetail>): LabDetail {
  const base: LabDetail = {
    ...row,
    createdOn: formatToday(),
    email: "contact@lab.example.com",
    address: "Hyderabad, Telangana, India",
    comment: "-",
    expectedLiveDate: formatExpectedLiveDate(row.plannedLiveDate),
    expectedLiveNote: `${row.plannedLiveNote} | ${row.days} Days in Onboarding`,
    salesPerson: "Pavan",
    contact: "8008118118",
    zohoContactId: String(163024000066000000 + row.id),
    onboardingDays: row.days,
    status: lifecycleDetailStatus(row.lifecycleState),
    hasBillingDiscrepancy: false,
    labAbbreviation: row.name.split(" ")[0] ?? "Lab",
    currentPlan: "Advance Plan 2024 - IND",
    currentBalance: 0,
    planType: row.planType.replace("Recurring", "recurring").replace("Billing", "billing"),
    spocs: [{ role: "Owner", name: "Lab Owner", email: "contact@lab.example.com" }],
    onboardingSnapshot: {
      labType: row.labType,
      modalities: row.modalities ?? [],
      devices: [],
      integrations: [],
    },
    feedbackHistory:
      row.nps != null
        ? [
            {
              id: 1,
              date: formatToday(),
              nps: row.nps,
              modules: [],
              by: "Lab Owner",
            },
          ]
        : [],
  };
  return { ...base, ...override };
}

function formatExpectedLiveDate(planned: string): string {
  const match = planned.match(/^(\w+) (\d+), (\d+)$/);
  if (!match) return planned;
  const day = Number(match[2]);
  const suffix =
    day % 10 === 1 && day !== 11
      ? "st"
      : day % 10 === 2 && day !== 12
        ? "nd"
        : day % 10 === 3 && day !== 13
          ? "rd"
          : "th";
  return `${day}${suffix} ${match[1]}, ${match[3]}`;
}

function formatToday(): string {
  const d = new Date();
  const months = [
    "Jan", "Feb", "Mar", "Apr", "May", "Jun",
    "Jul", "Aug", "Sep", "Oct", "Nov", "Dec",
  ];
  const day = d.getDate();
  const suffix =
    day % 10 === 1 && day !== 11
      ? "st"
      : day % 10 === 2 && day !== 12
        ? "nd"
        : day % 10 === 3 && day !== 13
          ? "rd"
          : "th";
  return `${day}${suffix} ${months[d.getMonth()]}, ${d.getFullYear()}`;
}
