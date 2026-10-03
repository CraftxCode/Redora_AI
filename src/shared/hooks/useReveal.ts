import type { RefObject } from 'react';
import { fadeUp, staggerReveal } from '@/lib/animations/effects';
import { useGsap } from '@/lib/animations/useGsap';

/**
 * Declarative scroll reveals: `data-reveal` fades an element up, `data-stagger`
 * staggers the direct children of a container.
 */
export function useReveal(scope: RefObject<HTMLElement | null>): void {
  useGsap(scope, (el) => {
    el.querySelectorAll('[data-reveal]').forEach((n) => fadeUp(n));
    el.querySelectorAll('[data-stagger]').forEach((c) => staggerReveal(c, ':scope > *'));
  });
}
