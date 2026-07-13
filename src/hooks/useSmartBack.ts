import { useCallback } from "react";
import { useNavigate } from "react-router-dom";

/** Navigate to the previous in-app page, or fallback when history is empty (direct URL / refresh). */
export function useSmartBack(fallbackHref: string) {
  const navigate = useNavigate();

  return useCallback(() => {
    const idx = window.history.state?.idx;
    if (typeof idx === "number" && idx > 0) {
      navigate(-1);
    } else {
      navigate(fallbackHref);
    }
  }, [navigate, fallbackHref]);
}
