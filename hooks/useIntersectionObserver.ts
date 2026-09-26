import { useEffect, useState, type RefObject } from "react";

interface UseIntersectionObserverProps {
	threshold?: number;
	root?: Element | null;
	rootMargin?: string;
	freezeOnceVisible?: boolean;
}

/**
 * Generic IntersectionObserver hook (plan §8).
 *
 * Returns the latest IntersectionObserverEntry for the observed element,
 * or undefined until the first observation fires. With
 * `freezeOnceVisible`, the observer disconnects after the first
 * intersection so consumers (count-ups, reveals) don't re-run.
 */
export function useIntersectionObserver(
	elementRef: RefObject<Element | null>,
	{
		threshold = 0,
		root = null,
		rootMargin = "0%",
		freezeOnceVisible = false,
	}: UseIntersectionObserverProps = {},
): IntersectionObserverEntry | undefined {
	const [entry, setEntry] = useState<IntersectionObserverEntry>();

	const frozen = entry?.isIntersecting && freezeOnceVisible;

	useEffect(() => {
		const node = elementRef?.current;
		const hasIOSupport = !!window.IntersectionObserver;

		if (!hasIOSupport || frozen || !node) return;

		const observerParams = { threshold, root, rootMargin };
		const observer = new IntersectionObserver(([obsEntry]) => setEntry(obsEntry), observerParams);

		observer.observe(node);

		return () => observer.disconnect();
	}, [elementRef, threshold, root, rootMargin, frozen]);

	return entry;
}
