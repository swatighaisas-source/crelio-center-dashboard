import type { USVolume } from "../context/CreateCentreContext";

export const US_VOLUME_OPTIONS: { id: USVolume; label: string }[] = [
  { id: "lt50", label: "< 50" },
  { id: "50-200", label: "50 – 200" },
  { id: "200-500", label: "200 – 500" },
  { id: "500plus", label: "500+" },
];

export const US_VOLUME_LABELS: Record<USVolume, string> = {
  lt50: "< 50 patients / day",
  "50-200": "50 – 200 patients / day",
  "200-500": "200 – 500 patients / day",
  "500plus": "500+ patients / day",
};

export function parseVolumeId(value?: string): USVolume | undefined {
  if (!value) return undefined;
  if (US_VOLUME_OPTIONS.some((o) => o.id === value)) return value as USVolume;
  return undefined;
}
