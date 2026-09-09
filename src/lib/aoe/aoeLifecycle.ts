import type { BillLineItem } from "../../data/aoeTypes";
import {
  createBillLineItem,
  findCatalogTest,
  reindexLineItems,
} from "../../data/billTests";
import { removeAoeAnswersForLineItem } from "./aoeResponseStore";

export function addTestToBill(
  items: BillLineItem[],
  testId: string,
): BillLineItem[] {
  const catalogEntry = findCatalogTest(testId);
  if (!catalogEntry) return items;
  const next = [...items, createBillLineItem(catalogEntry, items.length)];
  return reindexLineItems(next);
}

export function removeLineItemFromBill(
  items: BillLineItem[],
  lineItemId: string,
): BillLineItem[] {
  const next = items.filter((item) => item.id !== lineItemId);
  return reindexLineItems(next);
}

export function updateLineItemQty(
  items: BillLineItem[],
  lineItemId: string,
  qty: number,
): BillLineItem[] {
  return items.map((item) =>
    item.id === lineItemId ? { ...item, qty: Math.max(1, qty) } : item,
  );
}

export function moveLineItemUp(
  items: BillLineItem[],
  lineItemId: string,
): BillLineItem[] {
  const index = items.findIndex((item) => item.id === lineItemId);
  if (index <= 0) return items;
  const next = [...items];
  [next[index - 1], next[index]] = [next[index], next[index - 1]];
  return reindexLineItems(next);
}

export function moveLineItemDown(
  items: BillLineItem[],
  lineItemId: string,
): BillLineItem[] {
  const index = items.findIndex((item) => item.id === lineItemId);
  if (index < 0 || index >= items.length - 1) return items;
  const next = [...items];
  [next[index], next[index + 1]] = [next[index + 1], next[index]];
  return reindexLineItems(next);
}

export function handleRemoveLineItemWithAoeCleanup(
  labId: number,
  billId: string,
  items: BillLineItem[],
  lineItemId: string,
): BillLineItem[] {
  removeAoeAnswersForLineItem(labId, billId, items, lineItemId);
  return removeLineItemFromBill(items, lineItemId);
}
