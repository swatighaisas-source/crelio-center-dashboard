import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import type { CreateCentreForm } from "../data/labs";
import type { PrefillFieldKey, PrefillSource } from "../lib/usOnboardingPrefill";
import {
  createEmptyMember,
  type TeamMemberDraft,
} from "./teamMembers";

export interface AccountForm {
  yourName: string;
  email: string;
  mobile: string;
  country: string;
  city: string;
}

export interface BusinessForm {
  registeredBusinessName: string;
  teamSize: string;
  services: string[];
}

export type AccountConfigurationType =
  | "basic-lab"
  | "advanced-lab"
  | "covid"
  | "collection"
  | "radiology-pacs";

export const CONFIGURATION_OPTIONS: {
  id: AccountConfigurationType;
  title: string;
  description: string;
  recommended?: boolean;
}[] = [
  {
    id: "basic-lab",
    title: "Basic Laboratory Setup with Sample Barcoding (Recommended)",
    description: "Barcoding, Sample Automation, Interfacing with Lab Instruments",
    recommended: true,
  },
  {
    id: "advanced-lab",
    title: "Advanced Laboratory Setup (NABL & CAP)",
    description: "Sample Automation, Analytics, QC & TAT",
  },
  {
    id: "covid",
    title: "COVID-19 Laboratory Setup",
    description:
      "SARS-CoV2 (COVID-19) Testing, COVID-19 Dashboard, TRFs & Patient History as per Govt.",
  },
  {
    id: "collection",
    title: "Collection Centre Setup",
    description: "Patient Registration, Billing & Finance MIS",
  },
  {
    id: "radiology-pacs",
    title: "Advanced Radiology & Laboratory Setup + PACS",
    description: "Pathology & Radiology Workflows, Multiple Doctors, PACS, Finance",
  },
];

export type ReportTemplateType = "standard" | "nabl-cap" | "barcode";

export const REPORT_TEMPLATE_OPTIONS: {
  id: ReportTemplateType;
  label: string;
}[] = [
  { id: "standard", label: "Standard Report Template" },
  { id: "nabl-cap", label: "NABL/ CAP Report Template" },
  { id: "barcode", label: "Report Template with Barcode" },
];

export const SERVICE_OPTIONS = [
  { id: "lab-testing", label: "Labratory Testing" },
  { id: "immunoassays", label: "Immunoassays" },
  { id: "histo-cytology", label: "Histo / Cytology" },
  { id: "mri-ct", label: "MRI / CT" },
  { id: "other", label: "Other" },
  { id: "clinical-pathology", label: "Clinical Pathology" },
  { id: "microbiology", label: "Microbiology" },
  { id: "radiology-xray", label: "Radiology - X-ray" },
  { id: "pet", label: "PET" },
] as const;

const EMPTY_BUSINESS: BusinessForm = {
  registeredBusinessName: "",
  teamSize: "",
  services: [],
};

const EMPTY_ACCOUNT: AccountForm = {
  yourName: "Husain Rampurawala",
  email: "husain@livehealth.in",
  mobile: "8087443919",
  country: "India",
  city: "Pune, Maharashtra, India",
};

export type USLabArchetype =
  | "physician-office"
  | "independent"
  | "reference"
  | "specialty"
  | "d2c";

export type USVolume = "lt50" | "50-200" | "200-500" | "500plus";

export type USPlanTier = "smart" | "optimized" | "pro" | "power";

export interface USSPOCEntry {
  name: string;
  email: string;
  phone: string;
}

export interface USCustomDevice {
  modality: string;
  name: string;
}

export interface USForm {
  npi: string;
  cliaNumber: string;
  manualEntry: boolean;
  labName: string;
  labAddress: string;
  labCity: string;
  labState: string;
  labZip: string;
  taxonomyCode: string;
  labArchetype: USLabArchetype;
  selectedModalities: string[];
  volume: USVolume;
  locations: string;
  userCount: string;
  selectedDeviceIds: number[];
  customDevices: USCustomDevice[];
  selectedIntegrations: string[];
  spocOwner: USSPOCEntry;
  spocLabDirector: USSPOCEntry;
  spocImplCoord: USSPOCEntry;
  spocOther: USSPOCEntry & { role: string };
  spocAllSame: boolean;
  selectedPlan: USPlanTier;
}

const EMPTY_SPOC: USSPOCEntry = { name: "", email: "", phone: "" };

const EMPTY_US_FORM: USForm = {
  npi: "",
  cliaNumber: "",
  manualEntry: false,
  labName: "",
  labAddress: "",
  labCity: "",
  labState: "",
  labZip: "",
  taxonomyCode: "",
  labArchetype: "independent",
  selectedModalities: [],
  volume: "50-200",
  locations: "",
  userCount: "",
  selectedDeviceIds: [],
  customDevices: [],
  selectedIntegrations: [],
  spocOwner: { ...EMPTY_SPOC },
  spocLabDirector: { ...EMPTY_SPOC },
  spocImplCoord: { ...EMPTY_SPOC },
  spocOther: { ...EMPTY_SPOC, role: "" },
  spocAllSame: false,
  selectedPlan: "pro",
};

const EMPTY_FORM: CreateCentreForm = {
  labType: "standalone",
  name: "",
  phone: "",
  email: "",
  address: "",
  pincode: "",
  city: "",
  state: "",
  gstNumber: "",
  panNumber: "",
};

interface CreateCentreContextValue {
  usForm: USForm;
  updateUSForm: (patch: Partial<USForm>) => void;
  prefillSources: Partial<Record<PrefillFieldKey, PrefillSource>>;
  setPrefillSources: (sources: Partial<Record<PrefillFieldKey, PrefillSource>>) => void;
  mergePrefillSources: (sources: Partial<Record<PrefillFieldKey, PrefillSource>>) => void;
  getPrefillSource: (field: PrefillFieldKey) => PrefillSource | undefined;
  clearPrefillSources: () => void;
  account: AccountForm;
  updateAccount: (patch: Partial<AccountForm>) => void;
  business: BusinessForm;
  updateBusiness: (patch: Partial<BusinessForm>) => void;
  toggleService: (serviceId: string) => void;
  configurationType: AccountConfigurationType;
  setConfigurationType: (type: AccountConfigurationType) => void;
  reportTemplate: ReportTemplateType;
  setReportTemplate: (type: ReportTemplateType) => void;
  recommendedFontDefaults: boolean;
  setRecommendedFontDefaults: (value: boolean) => void;
  uploadLetterhead: "yes" | "no";
  setUploadLetterhead: (value: "yes" | "no") => void;
  letterheadHeaderPreview: string | null;
  letterheadFooterPreview: string | null;
  setLetterheadHeaderPreview: (url: string | null) => void;
  setLetterheadFooterPreview: (url: string | null) => void;
  newTeamMembers: TeamMemberDraft[];
  addTeamMember: () => void;
  removeTeamMember: (id: string) => void;
  updateTeamMember: (id: string, patch: Partial<TeamMemberDraft>) => void;
  form: CreateCentreForm;
  updateForm: (patch: Partial<CreateCentreForm>) => void;
  createdId: number | null;
  setCreatedId: (id: number | null) => void;
  reset: () => void;
}

const CreateCentreContext = createContext<CreateCentreContextValue | null>(null);

export function CreateCentreProvider({ children }: { children: ReactNode }) {
  const [account, setAccount] = useState<AccountForm>(EMPTY_ACCOUNT);
  const [business, setBusiness] = useState<BusinessForm>(EMPTY_BUSINESS);
  const [configurationType, setConfigurationType] =
    useState<AccountConfigurationType>("basic-lab");
  const [reportTemplate, setReportTemplate] = useState<ReportTemplateType>("standard");
  const [recommendedFontDefaults, setRecommendedFontDefaults] = useState(true);
  const [uploadLetterhead, setUploadLetterhead] = useState<"yes" | "no">("yes");
  const [letterheadHeaderPreview, setLetterheadHeaderPreview] = useState<string | null>(
    null
  );
  const [letterheadFooterPreview, setLetterheadFooterPreview] = useState<string | null>(
    null
  );
  const [usForm, setUSForm] = useState<USForm>(EMPTY_US_FORM);
  const [prefillSources, setPrefillSourcesState] = useState<
    Partial<Record<PrefillFieldKey, PrefillSource>>
  >({});
  const [form, setForm] = useState<CreateCentreForm>(EMPTY_FORM);
  const [newTeamMembers, setNewTeamMembers] = useState<TeamMemberDraft[]>([
    createEmptyMember(),
  ]);
  const [createdId, setCreatedId] = useState<number | null>(null);

  const addTeamMember = useCallback(() => {
    setNewTeamMembers((m) => [...m, createEmptyMember()]);
  }, []);

  const removeTeamMember = useCallback((id: string) => {
    setNewTeamMembers((m) => (m.length <= 1 ? m : m.filter((x) => x.id !== id)));
  }, []);

  const updateTeamMember = useCallback((id: string, patch: Partial<TeamMemberDraft>) => {
    setNewTeamMembers((m) => m.map((x) => (x.id === id ? { ...x, ...patch } : x)));
  }, []);

  const updateAccount = useCallback((patch: Partial<AccountForm>) => {
    setAccount((a) => ({ ...a, ...patch }));
  }, []);

  const updateBusiness = useCallback((patch: Partial<BusinessForm>) => {
    setBusiness((b) => ({ ...b, ...patch }));
  }, []);

  const toggleService = useCallback((serviceId: string) => {
    setBusiness((b) => {
      const has = b.services.includes(serviceId);
      return {
        ...b,
        services: has
          ? b.services.filter((s) => s !== serviceId)
          : [...b.services, serviceId],
      };
    });
  }, []);

  const updateUSForm = useCallback((patch: Partial<USForm>) => {
    setUSForm((f) => ({ ...f, ...patch }));
  }, []);

  const setPrefillSources = useCallback(
    (sources: Partial<Record<PrefillFieldKey, PrefillSource>>) => {
      setPrefillSourcesState(sources);
    },
    []
  );

  const mergePrefillSourcesCtx = useCallback(
    (sources: Partial<Record<PrefillFieldKey, PrefillSource>>) => {
      setPrefillSourcesState((prev) => ({ ...prev, ...sources }));
    },
    []
  );

  const getPrefillSource = useCallback(
    (field: PrefillFieldKey) => prefillSources[field],
    [prefillSources]
  );

  const clearPrefillSources = useCallback(() => {
    setPrefillSourcesState({});
  }, []);

  const updateForm = useCallback((patch: Partial<CreateCentreForm>) => {
    setForm((f) => ({ ...f, ...patch }));
  }, []);

  const reset = useCallback(() => {
    setPrefillSourcesState({});
    setUSForm(EMPTY_US_FORM);
    setAccount(EMPTY_ACCOUNT);
    setBusiness(EMPTY_BUSINESS);
    setConfigurationType("basic-lab");
    setReportTemplate("standard");
    setRecommendedFontDefaults(true);
    setUploadLetterhead("yes");
    setLetterheadHeaderPreview(null);
    setLetterheadFooterPreview(null);
    setNewTeamMembers([createEmptyMember()]);
    setForm(EMPTY_FORM);
    setCreatedId(null);
  }, []);

  const value = useMemo(
    () => ({
      usForm,
      updateUSForm,
      prefillSources,
      setPrefillSources,
      mergePrefillSources: mergePrefillSourcesCtx,
      getPrefillSource,
      clearPrefillSources,
      account,
      updateAccount,
      business,
      updateBusiness,
      toggleService,
      configurationType,
      setConfigurationType,
      reportTemplate,
      setReportTemplate,
      recommendedFontDefaults,
      setRecommendedFontDefaults,
      uploadLetterhead,
      setUploadLetterhead,
      letterheadHeaderPreview,
      letterheadFooterPreview,
      setLetterheadHeaderPreview,
      setLetterheadFooterPreview,
      newTeamMembers,
      addTeamMember,
      removeTeamMember,
      updateTeamMember,
      form,
      updateForm,
      createdId,
      setCreatedId,
      reset,
    }),
    [
      usForm,
      updateUSForm,
      prefillSources,
      setPrefillSources,
      mergePrefillSourcesCtx,
      getPrefillSource,
      clearPrefillSources,
      account,
      updateAccount,
      business,
      updateBusiness,
      toggleService,
      configurationType,
      reportTemplate,
      recommendedFontDefaults,
      uploadLetterhead,
      letterheadHeaderPreview,
      letterheadFooterPreview,
      newTeamMembers,
      form,
      updateForm,
      createdId,
      reset,
    ]
  );

  return (
    <CreateCentreContext.Provider value={value}>{children}</CreateCentreContext.Provider>
  );
}

export function useCreateCentre() {
  const ctx = useContext(CreateCentreContext);
  if (!ctx) throw new Error("useCreateCentre must be used within CreateCentreProvider");
  return ctx;
}

export const WIZARD_STEPS = [
  "type",
  "centre-details",
  "lab-details",
  "success",
  "setup-checklist",
  "tests",
  "pricing",
  "staff",
  "reports",
  "finish",
] as const;

export type WizardStep = (typeof WIZARD_STEPS)[number];

export function isWizardStep(s: string | undefined): s is WizardStep {
  return WIZARD_STEPS.includes(s as WizardStep);
}
