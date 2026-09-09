import { AMMONIA_AOE_FORM, DENGUE_NS1_AOE_FORM } from "./billTests";
import type { AoeFormDefinition, AoeQuestionType, AoeSection } from "./aoeTypes";
import {
  DEFAULT_AOE_CAPTURE_FREQUENCY,
  type AoeCaptureFrequency,
} from "./aoeTypes";

export type AoeConfigType = "Profile" | "Promotion" | "Store" | "Test" | "Bill";

export interface AoeConfigComponent {
  id: string;
  label: string;
  kind: "section" | AoeQuestionType;
  mandatory?: boolean;
  children?: AoeConfigComponent[];
}

export interface AoeMappedTest {
  testId: string;
  testName: string;
  testCode: string;
  sampleType: string;
}

export interface AoeConfigListItem {
  id: number;
  name: string;
  type: AoeConfigType;
  createdOn: string;
  enabled: boolean;
  description: string;
  /** Empty unless user enters a code — never invent values. */
  aoeCode: string;
  mappedTests: AoeMappedTest[];
  captureFrequency: AoeCaptureFrequency;
  iconFileName?: string;
  components: AoeConfigComponent[];
}

export const AOE_CONFIG_TYPE_ORDER: AoeConfigType[] = [
  "Profile",
  "Promotion",
  "Store",
  "Test",
  "Bill",
];

function sectionFromAoe(
  section: AoeSection,
  title: string,
): AoeConfigComponent {
  return {
    id: section.id,
    label: title,
    kind: "section",
    mandatory: true,
    children: section.questions.map((question) => ({
      id: question.id,
      label: question.label,
      kind: question.type,
      mandatory: question.required,
    })),
  };
}

function sectionsFromForm(form: AoeFormDefinition, titlePrefix: string): AoeConfigComponent[] {
  return form.sections.map((section, index) =>
    sectionFromAoe(section, `${titlePrefix}-${index + 1}`),
  );
}

export const mockAoeConfigurations: AoeConfigListItem[] = [
  {
    id: 95,
    name: "AOE fro Profile for collection of test",
    type: "Profile",
    createdOn: "May 28, 2026 at 12:14:22 PM",
    enabled: true,
    description: "",
    aoeCode: "",
    captureFrequency: DEFAULT_AOE_CAPTURE_FREQUENCY,
    mappedTests: [],
    components: [],
  },
  {
    id: 94,
    name: "Profile AOE Test",
    type: "Profile",
    createdOn: "May 20, 2026 at 10:02:11 AM",
    enabled: false,
    description: "",
    aoeCode: "",
    captureFrequency: DEFAULT_AOE_CAPTURE_FREQUENCY,
    mappedTests: [],
    components: [],
  },
  {
    id: 348,
    name: "AOE FOR Promotions (empty)",
    type: "Promotion",
    createdOn: "August 12, 2026 at 3:21:08 PM",
    enabled: false,
    description: "",
    aoeCode: "",
    captureFrequency: DEFAULT_AOE_CAPTURE_FREQUENCY,
    mappedTests: [],
    components: [],
  },
  {
    id: 347,
    name: "NAME",
    type: "Promotion",
    createdOn: "August 10, 2026 at 11:45:00 AM",
    enabled: false,
    description: "",
    aoeCode: "",
    captureFrequency: DEFAULT_AOE_CAPTURE_FREQUENCY,
    mappedTests: [],
    components: [],
  },
  {
    id: 350,
    name: "Store AOE4",
    type: "Store",
    createdOn: "August 15, 2026 at 9:30:44 AM",
    enabled: true,
    description: "",
    aoeCode: "",
    captureFrequency: DEFAULT_AOE_CAPTURE_FREQUENCY,
    mappedTests: [],
    components: [],
  },
  {
    id: 349,
    name: "AOE FOR Store",
    type: "Store",
    createdOn: "August 14, 2026 at 4:18:19 PM",
    enabled: true,
    description: "",
    aoeCode: "",
    captureFrequency: DEFAULT_AOE_CAPTURE_FREQUENCY,
    mappedTests: [],
    components: [],
  },
  {
    id: 96,
    name: "Dengue AOE",
    type: "Test",
    createdOn: "September 2, 2026 at 2:05:33 PM",
    enabled: false,
    description: DENGUE_NS1_AOE_FORM.description,
    aoeCode: "",
    captureFrequency: DEFAULT_AOE_CAPTURE_FREQUENCY,
    mappedTests: [
      {
        testId: "7063835",
        testName: "Dengue NS1",
        testCode: "SERO045",
        sampleType: "Serum",
      },
    ],
    components: sectionsFromForm(DENGUE_NS1_AOE_FORM, "Dengue Section"),
  },
  {
    id: 93,
    name: "Ammonia 2nd Process",
    type: "Test",
    createdOn: "September 1, 2026 at 1:12:09 PM",
    enabled: true,
    description: "",
    aoeCode: "",
    captureFrequency: DEFAULT_AOE_CAPTURE_FREQUENCY,
    mappedTests: [
      {
        testId: "761004-process-2",
        testName: "Ammonia 2nd Process",
        testCode: "A41-P2",
        sampleType: "Serum",
      },
    ],
    components: [
      {
        id: "test-1-section-1",
        label: "Test 1 | Section 1",
        kind: "section",
        mandatory: true,
        children: [
          {
            id: "t1-s1-q1",
            label: "Test 1 | Section 1 Question-1",
            kind: "text",
            mandatory: true,
          },
        ],
      },
    ],
  },
  {
    id: 88,
    name: "AOE for Ammonia",
    type: "Test",
    createdOn: "May 28, 2026 at 12:14:22 PM",
    enabled: false,
    description: AMMONIA_AOE_FORM.description,
    aoeCode: "",
    captureFrequency: DEFAULT_AOE_CAPTURE_FREQUENCY,
    mappedTests: [
      {
        testId: "761004",
        testName: "AMMONIA",
        testCode: "A41",
        sampleType: "Serum",
      },
      {
        testId: "7063835",
        testName: "Ammonia",
        testCode: "Ammonia - BIOC012",
        sampleType: "Serum",
      },
    ],
    iconFileName: "c7dc8f5e-980f-4a61-a88e-0b2b8abcba27.jpeg",
    components: [
      {
        id: "ammonia-section-1",
        label: "Ammonia Section-1",
        kind: "section",
        mandatory: true,
        children: (AMMONIA_AOE_FORM.sections[0]?.questions ?? []).map((question) => ({
          id: question.id,
          label: question.label,
          kind: question.type,
          mandatory: question.required,
        })),
      },
      {
        id: "ammonia-section-2",
        label: "Ammonia Section-2",
        kind: "section",
        mandatory: true,
        children: (AMMONIA_AOE_FORM.sections[1]?.questions ?? []).map((question) => ({
          id: question.id,
          label: question.label,
          kind: question.type,
          mandatory: question.required,
        })),
      },
      {
        id: "test-1-section-1",
        label: "Test 1 | Section 1",
        kind: "section",
        mandatory: true,
        children: [
          {
            id: "t1-s1-q1",
            label: "Test 1 | Section 1 Question-1",
            kind: "text",
            mandatory: true,
          },
        ],
      },
    ],
  },
  {
    id: 89,
    name: "Bill Level AOE",
    type: "Bill",
    createdOn: "May 28, 2026 at 12:20:01 PM",
    enabled: true,
    description: "",
    aoeCode: "",
    captureFrequency: DEFAULT_AOE_CAPTURE_FREQUENCY,
    mappedTests: [],
    components: [],
  },
];

export function getAoeConfiguration(id: number): AoeConfigListItem | undefined {
  return mockAoeConfigurations.find((item) => item.id === id);
}

function normalizeName(value: string): string {
  return value.trim().toLowerCase().replace(/\s+/g, " ");
}

/**
 * Find AOE configurations that map a billing test (by catalog testId or name).
 */
export function findAoeConfigsForBillTest(
  testId: string,
  testName: string,
  configs: AoeConfigListItem[] = mockAoeConfigurations,
): AoeConfigListItem[] {
  const normalizedName = normalizeName(testName);
  return configs.filter((config) =>
    config.mappedTests.some(
      (mapped) =>
        mapped.testId === testId ||
        normalizeName(mapped.testName) === normalizedName ||
        normalizeName(mapped.testName) === normalizeName(testId),
    ),
  );
}

/**
 * Find the preferred AOE configuration for a billing test.
 * Prefers enabled Test-type configs, then any Test-type match.
 */
export function findAoeConfigForBillTest(
  testId: string,
  testName: string,
  configs: AoeConfigListItem[] = mockAoeConfigurations,
): AoeConfigListItem | undefined {
  const matches = findAoeConfigsForBillTest(testId, testName, configs);
  return (
    matches.find((config) => config.type === "Test" && config.enabled) ??
    matches.find((config) => config.type === "Test") ??
    matches[0]
  );
}

export function groupAoeConfigurationsByType(
  items: AoeConfigListItem[],
): { type: AoeConfigType; items: AoeConfigListItem[] }[] {
  return AOE_CONFIG_TYPE_ORDER.map((type) => ({
    type,
    items: items.filter((item) => item.type === type),
  })).filter((group) => group.items.length > 0);
}

export function questionTypeLabel(kind: AoeConfigComponent["kind"]): string {
  switch (kind) {
    case "section":
      return "Section";
    case "text":
      return "Text";
    case "textarea":
      return "Textarea";
    case "email":
      return "Email";
    case "date":
      return "Date";
    case "datetime":
      return "DateTime";
    case "signature":
      return "Signature";
    default:
      return "Field";
  }
}
