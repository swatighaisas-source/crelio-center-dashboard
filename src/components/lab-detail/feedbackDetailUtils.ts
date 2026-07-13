import type { FeedbackEntry, FeedbackModuleEntry } from "../../data/labDetails";
import { feedbackEntryNpsComment } from "../../data/labDetails";

export function npsLabel(score: number): string {
  if (score >= 9) return "Promoter";
  if (score >= 7) return "Passive";
  return "Detractor";
}

export function npsTone(score: number): "good" | "mid" | "low" {
  if (score >= 9) return "good";
  if (score >= 7) return "mid";
  return "low";
}

export function formatModuleRating(mod: FeedbackModuleEntry): string {
  if (mod.relevant === false) return "Not relevant";
  if (mod.rating > 0) return `${mod.rating}/5`;
  return "—";
}

export function moduleHasComments(mod: FeedbackModuleEntry): boolean {
  return Boolean(mod.presetComment?.trim() || mod.comment?.trim());
}

export function allModuleNamesFromHistory(history: FeedbackEntry[]): string[] {
  const names = new Set<string>();
  for (const entry of history) {
    for (const m of entry.modules) names.add(m.name);
  }
  return [...names];
}

export function moduleAtEntry(
  entry: FeedbackEntry,
  moduleName: string,
): FeedbackModuleEntry | undefined {
  return entry.modules.find((m) => m.name === moduleName);
}

export interface NpsMonthCell {
  key: string;
  label: string;
  year: number;
  nps: number | null;
  isCurrentMonth: boolean;
}

export function parseFeedbackEntryDate(dateStr: string): Date | null {
  const normalized = dateStr.replace(/(\d+)(st|nd|rd|th)/i, "$1").trim();
  const parsed = Date.parse(normalized);
  if (Number.isNaN(parsed)) return null;
  return new Date(parsed);
}

function monthKey(date: Date): string {
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}`;
}

/** Rolling 12 calendar months ending with the reference month (not Jan–Dec). */
export function buildLast12NpsMonths(
  history: FeedbackEntry[],
  refDate: Date = new Date(),
): NpsMonthCell[] {
  const months: NpsMonthCell[] = [];
  for (let offset = 11; offset >= 0; offset -= 1) {
    const d = new Date(refDate.getFullYear(), refDate.getMonth() - offset, 1);
    months.push({
      key: monthKey(d),
      label: d.toLocaleString("en-US", { month: "short" }),
      year: d.getFullYear(),
      nps: null,
      isCurrentMonth: offset === 0,
    });
  }

  const scoresByMonth = new Map<string, number[]>();
  for (const entry of history) {
    const parsed = parseFeedbackEntryDate(entry.date);
    if (!parsed) continue;
    const key = monthKey(parsed);
    const bucket = scoresByMonth.get(key) ?? [];
    bucket.push(entry.nps);
    scoresByMonth.set(key, bucket);
  }

  return months.map((cell) => {
    const scores = scoresByMonth.get(cell.key);
    if (!scores?.length) return cell;
    const avg = scores.reduce((sum, n) => sum + n, 0) / scores.length;
    return { ...cell, nps: Math.round(avg * 10) / 10 };
  });
}

export function getFeedbackEntriesForMonth(
  history: FeedbackEntry[],
  monthKeyValue: string,
): FeedbackEntry[] {
  return history.filter((entry) => {
    const parsed = parseFeedbackEntryDate(entry.date);
    if (!parsed) return false;
    return monthKey(parsed) === monthKeyValue;
  });
}

export function formatNpsMonthHeading(cell: NpsMonthCell): string {
  const d = new Date(cell.year, Number(cell.key.split("-")[1]) - 1, 1);
  return d.toLocaleString("en-US", { month: "long", year: "numeric" });
}

export { feedbackEntryNpsComment };
