import type { AoeFormDefinition, BillLineItem } from "./aoeTypes";
import { createLineItemId } from "./aoeTypes";

export interface BillTestCatalogEntry {
  testId: string;
  testName: string;
  testCode: string;
  price: number;
  hasAoe: boolean;
}

export const BILL_TEST_CATALOG: BillTestCatalogEntry[] = [
  {
    testId: "test-ammonia",
    testName: "Ammonia",
    testCode: "BIOC012",
    price: 0,
    hasAoe: true,
  },
  {
    testId: "test-dengue-ns1",
    testName: "Dengue NS1",
    testCode: "SERO045",
    price: 726,
    hasAoe: true,
  },
  {
    testId: "test-afp",
    testName: "Alpha Feto Protein",
    testCode: "BIOC088",
    price: 450,
    hasAoe: false,
  },
  {
    testId: "test-cbc",
    testName: "CBC",
    testCode: "HEMA001",
    price: 101,
    hasAoe: false,
  },
];

export const DENGUE_NS1_AOE_FORM: AoeFormDefinition = {
  formId: "aoe-dengue-ns1",
  testId: "test-dengue-ns1",
  testName: "Dengue NS1",
  description: "This is an AOE Form for Dengue NS1 Test",
  sections: [
    {
      id: "dengue-section-1",
      title: "Section 1",
      questions: [
        {
          id: "dengue-s1-q1",
          label: "Sample collection site",
          type: "text",
          required: true,
        },
        {
          id: "dengue-s1-q2",
          label: "Clinical notes",
          type: "textarea",
          required: true,
        },
      ],
    },
  ],
};

export const AMMONIA_AOE_FORM: AoeFormDefinition = {
  formId: "aoe-ammonia",
  testId: "test-ammonia",
  testName: "Ammonia",
  description: "This an AOE Form for Ammonia Test",
  sections: [
    {
      id: "ammonia-section-1",
      title: "Section 1",
      questions: [
        {
          id: "ammonia-s1-q1",
          label: "Text Ammonia Section-1 Question-1",
          type: "text",
          required: true,
        },
        {
          id: "ammonia-s1-q2",
          label: "TextArea Ammonia Section-1 Question-1",
          type: "textarea",
          required: true,
        },
        {
          id: "ammonia-s1-q3",
          label: "Email Ammonia Section-1 Question-3",
          type: "email",
          required: true,
        },
      ],
    },
    {
      id: "ammonia-section-2",
      title: "Section 2",
      questions: [
        {
          id: "ammonia-s2-q1",
          label: "Address Ammonia Section-2 Question-1",
          type: "text",
          required: true,
        },
        {
          id: "ammonia-s2-q2",
          label: "Barcode Ammonia Section-2 Question-2",
          type: "text",
          required: true,
        },
        {
          id: "ammonia-s2-q3",
          label: "Date Ammonia Section-2 Question-3",
          type: "date",
          required: true,
        },
        {
          id: "ammonia-s2-q4",
          label: "Today's DateTime Ammonia Section-2 Question-4",
          type: "datetime",
          required: true,
        },
        {
          id: "ammonia-s2-q5",
          label: "Signature Ammonia Section-2 Question-4",
          type: "signature",
          required: true,
        },
      ],
    },
  ],
};

export const AOE_FORM_CATALOG: Record<string, AoeFormDefinition> = {
  "test-ammonia": AMMONIA_AOE_FORM,
  "test-dengue-ns1": DENGUE_NS1_AOE_FORM,
};

export function getAoeFormForTest(testId: string): AoeFormDefinition | undefined {
  return AOE_FORM_CATALOG[testId];
}

export function findCatalogTest(testId: string): BillTestCatalogEntry | undefined {
  return BILL_TEST_CATALOG.find((test) => test.testId === testId);
}

export function createBillLineItem(
  catalogEntry: BillTestCatalogEntry,
  sortIndex: number,
): BillLineItem {
  return {
    id: createLineItemId(),
    testId: catalogEntry.testId,
    testName: catalogEntry.testName,
    testCode: catalogEntry.testCode,
    qty: 1,
    price: catalogEntry.price,
    concession: 0,
    hasAoe: catalogEntry.hasAoe,
    sortIndex,
  };
}

export function createDefaultBillLineItems(): BillLineItem[] {
  const ammonia = findCatalogTest("test-ammonia");
  const dengue = findCatalogTest("test-dengue-ns1");
  const items: BillLineItem[] = [];
  if (ammonia) items.push(createBillLineItem(ammonia, 0));
  if (dengue) items.push(createBillLineItem(dengue, 1));
  return items;
}

export function reindexLineItems(items: BillLineItem[]): BillLineItem[] {
  return items.map((item, index) => ({ ...item, sortIndex: index }));
}
