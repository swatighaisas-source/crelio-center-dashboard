import type { PrefillFieldKey, PrefillSource } from "../../lib/usOnboardingPrefill";
import { useCreateCentre } from "../../context/CreateCentreContext";

export function USPrefillTag({ field }: { field: PrefillFieldKey }) {
  const { getPrefillSource } = useCreateCentre();
  const source = getPrefillSource(field);
  if (!source) return null;
  return (
    <span className={`us-prefill-tag us-prefill-tag--${source.toLowerCase()}`}>
      Prefilled · {source}
    </span>
  );
}

export function USPrefillSourceBadge({ source }: { source: PrefillSource }) {
  return (
    <span className={`us-prefill-tag us-prefill-tag--${source.toLowerCase()}`}>
      Prefilled · {source}
    </span>
  );
}
