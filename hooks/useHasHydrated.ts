import { useSyncExternalStore } from "react";

/**
 * Hydration flag without an effect: false on the server and during the
 * first client paint, true once the component tree has hydrated.
 *
 * Used to keep entrance animations out of the critical path — an
 * opacity 0 → 1 fade on first paint delays LCP by its full duration,
 * while client-side route changes still animate normally (by then the
 * flag is true).
 */
export function useHasHydrated(): boolean {
	return useSyncExternalStore(
		() => () => {},
		() => true,
		() => false,
	);
}
