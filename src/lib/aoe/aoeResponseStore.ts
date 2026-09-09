import { readLabStorageRecord, writeLabStorageRecord } from "../labStorage";
import type {
  AoeAnswer,
  AoeCaptureFrequency,
  BillLineItem,
  LegacyAoeAnswer,
} from "../../data/aoeTypes";
import { createLineItemId } from "../../data/aoeTypes";
import { getAnchorLineItemId } from "./aoeInstanceQueue";

const AOE_RESPONSES_STORAGE_KEY = "crelio-aoe-responses-by-lab";

type AoeResponsesByLab = Record<string, Record<string, LegacyAoeAnswer[]>>;

/** In-memory store for tests (avoids localStorage in vitest). */
let memoryStore: AoeResponsesByLab | null = null;

function labKey(labId: number) {
  return String(labId);
}

function billKey(billId: string) {
  return billId;
}

function readAll(): AoeResponsesByLab {
  if (memoryStore !== null) return memoryStore;
  return readLabStorageRecord<AoeResponsesByLab>(AOE_RESPONSES_STORAGE_KEY);
}

function writeAll(data: AoeResponsesByLab) {
  if (memoryStore !== null) {
    memoryStore = data;
    return;
  }
  writeLabStorageRecord(AOE_RESPONSES_STORAGE_KEY, data);
}

function responseIdentityKey(
  answer: Pick<AoeAnswer, "lineItemId" | "instanceIndex" | "questionId">,
) {
  const instanceIndex = answer.instanceIndex ?? 1;
  return `${answer.lineItemId}::${instanceIndex}::${answer.questionId}`;
}

/** Resolve legacy answers missing lineItemId to the first matching test row. */
export function migrateLegacyAnswers(
  raw: LegacyAoeAnswer[],
  lineItems: BillLineItem[],
): AoeAnswer[] {
  return raw.map((answer) => {
    if (answer.lineItemId) {
      return {
        ...(answer as AoeAnswer),
        instanceIndex: answer.instanceIndex ?? 1,
      };
    }
    const anchorId =
      getAnchorLineItemId(lineItems, answer.testId) ??
      lineItems.find((item) => item.testId === answer.testId)?.id ??
      "";
    return {
      billId: answer.billId,
      lineItemId: anchorId,
      instanceIndex: answer.instanceIndex ?? 1,
      testId: answer.testId,
      formId: answer.formId,
      sectionId: answer.sectionId,
      questionId: answer.questionId,
      value: answer.value,
      metadata: answer.metadata,
    };
  });
}

export function getBillAoeAnswers(
  labId: number,
  billId: string,
  lineItems: BillLineItem[],
): AoeAnswer[] {
  const all = readAll();
  const raw = all[labKey(labId)]?.[billKey(billId)] ?? [];
  return migrateLegacyAnswers(raw, lineItems);
}

/** Copy AOE answers from a draft/registration bill onto a confirmed order bill id. */
export function copyBillAoeAnswers(
  labId: number,
  fromBillId: string,
  toBillId: string,
): AoeAnswer[] {
  const all = readAll();
  const raw = all[labKey(labId)]?.[billKey(fromBillId)] ?? [];
  const copied = raw.map((answer) => ({
    ...answer,
    billId: toBillId,
  }));
  if (copied.length > 0) {
    saveBillAoeAnswers(labId, toBillId, copied as AoeAnswer[]);
  }
  return copied as AoeAnswer[];
}

export function saveBillAoeAnswers(
  labId: number,
  billId: string,
  answers: AoeAnswer[],
) {
  const all = readAll();
  const lab = { ...(all[labKey(labId)] ?? {}) };
  lab[billKey(billId)] = answers;
  writeAll({ ...all, [labKey(labId)]: lab });
}

export function upsertAoeAnswer(
  labId: number,
  billId: string,
  lineItems: BillLineItem[],
  answer: AoeAnswer,
) {
  const existing = getBillAoeAnswers(labId, billId, lineItems);
  const key = responseIdentityKey(answer);
  const next = existing.filter(
    (item) => responseIdentityKey(item) !== key,
  );
  next.push(answer);
  saveBillAoeAnswers(labId, billId, next);
}

export function removeAoeAnswersForLineItem(
  labId: number,
  billId: string,
  lineItems: BillLineItem[],
  lineItemId: string,
) {
  const existing = getBillAoeAnswers(labId, billId, lineItems);
  const next = existing.filter((answer) => answer.lineItemId !== lineItemId);
  saveBillAoeAnswers(labId, billId, next);
}

export function clearBillAoeAnswers(labId: number, billId: string) {
  const all = readAll();
  const lab = { ...(all[labKey(labId)] ?? {}) };
  delete lab[billKey(billId)];
  writeAll({ ...all, [labKey(labId)]: lab });
}

/**
 * Resolve storage anchor for read/write based on capture frequency.
 * ONCE_PER_TEST uses the first row, qty slot 1 for that testId.
 */
export function resolveStorageAnchor(
  lineItemId: string,
  instanceIndex: number,
  testId: string,
  lineItems: BillLineItem[],
  frequency: AoeCaptureFrequency,
): { lineItemId: string; instanceIndex: number } {
  if (frequency === "ONCE_PER_TEST_INSTANCE") {
    return { lineItemId, instanceIndex };
  }
  return {
    lineItemId: getAnchorLineItemId(lineItems, testId) ?? lineItemId,
    instanceIndex: 1,
  };
}

/** @deprecated Use resolveStorageAnchor */
export function resolveStorageLineItemId(
  lineItemId: string,
  _testId: string,
  _lineItems: BillLineItem[],
  _frequency: AoeCaptureFrequency,
): string {
  return lineItemId;
}

export function getAnswerValue(
  answers: AoeAnswer[],
  lineItemId: string,
  instanceIndex: number,
  questionId: string,
): string {
  return (
    answers.find(
      (answer) =>
        answer.lineItemId === lineItemId &&
        (answer.instanceIndex ?? 1) === instanceIndex &&
        answer.questionId === questionId,
    )?.value ?? ""
  );
}

/** In-memory store for tests (avoids localStorage in vitest). */
export function useMemoryAoeStore() {
  memoryStore = {};
}

export function clearMemoryAoeStore() {
  memoryStore = null;
}

export function getBillAoeAnswersInStore(
  labId: number,
  billId: string,
  lineItems: BillLineItem[],
): AoeAnswer[] {
  return getBillAoeAnswers(labId, billId, lineItems);
}

export function saveBillAoeAnswersInStore(
  labId: number,
  billId: string,
  answers: AoeAnswer[],
) {
  saveBillAoeAnswers(labId, billId, answers);
}

export function upsertAoeAnswerInStore(
  labId: number,
  billId: string,
  lineItems: BillLineItem[],
  answer: AoeAnswer,
) {
  upsertAoeAnswer(labId, billId, lineItems, answer);
}

export function removeAoeAnswersForLineItemInStore(
  labId: number,
  billId: string,
  lineItems: BillLineItem[],
  lineItemId: string,
) {
  removeAoeAnswersForLineItem(labId, billId, lineItems, lineItemId);
}

export function clearBillAoeAnswersInStore(labId: number, billId: string) {
  clearBillAoeAnswers(labId, billId);
}

export function cloneBillLineItemsWithoutAoe(
  items: BillLineItem[],
): BillLineItem[] {
  return items.map((item, index) => ({
    ...item,
    id: createLineItemId(),
    sortIndex: index,
  }));
}
