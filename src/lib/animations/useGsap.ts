import { useLayoutEffect, type DependencyList, type RefObject } from 'react';
import { NO_PREFERENCE_MOTION, gsap } from './gsap';

/**
 * Runs `setup` inside a gsap.context scoped to `scope`, only when the user has not
 * requested reduced motion. Everything created is reverted on unmount. `setup` may
 * return its own cleanup (e.g. a nested matchMedia).
 */
export function useGsap(scope: RefObject<HTMLElement | null>, setup: (scope: HTMLElement) => void | (() => void), deps: DependencyList = []): void {
  useLayoutEffect(() => {
    const el = scope.current;
    if (!el) return undefined;
    const mm = gsap.matchMedia();
    const ctx = gsap.context(() => {
      mm.add(NO_PREFERENCE_MOTION, () => setup(el));
    }, el);
    return () => {
      mm.revert();
      ctx.revert();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, deps);
}
