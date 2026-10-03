/**
 * Reusable GSAP effects. Every function must be called inside a gsap.context
 * (see useGsap) so that ScrollTriggers and tweens are cleaned up automatically.
 * Only transform/opacity are animated.
 */
import { gsap, hasFinePointer } from './gsap';

type Targets = Element | Element[] | NodeListOf<Element> | null;
const toArray = (t: Targets): Element[] => (!t ? [] : t instanceof Element ? [t] : Array.from(t));

interface RevealOptions { y?: number; delay?: number; duration?: number; start?: string; trigger?: Element | null }

export function fadeUp(targets: Targets, { y = 32, delay = 0, duration = 0.9, start = 'top 88%', trigger }: RevealOptions = {}) {
  const els = toArray(targets);
  if (!els.length) return null;
  return gsap.from(els, { y, autoAlpha: 0, duration, delay, ease: 'power3.out', scrollTrigger: { trigger: trigger ?? els[0], start, once: true } });
}

export function staggerReveal(container: Element | null, selector: string, { y = 28, stagger = 0.09, duration = 0.8, start = 'top 82%' }: { y?: number; stagger?: number; duration?: number; start?: string } = {}) {
  if (!container) return null;
  const items = container.querySelectorAll(selector);
  if (!items.length) return null;
  return gsap.from(items, { y, autoAlpha: 0, duration, stagger, ease: 'power3.out', scrollTrigger: { trigger: container, start, once: true } });
}

/** Animates `.split-inner` words rendered by <SplitText>. Pass `scroll: false` for above-the-fold text. */
export function splitReveal(container: Element | null, { stagger = 0.05, delay = 0, duration = 1, scroll = true, start = 'top 85%' }: { stagger?: number; delay?: number; duration?: number; scroll?: boolean; start?: string } = {}) {
  if (!container) return null;
  const words = container.querySelectorAll('.split-inner');
  if (!words.length) return null;
  return gsap.from(words, {
    yPercent: 115, duration, delay, stagger, ease: 'power4.out',
    ...(scroll ? { scrollTrigger: { trigger: container, start, once: true } } : {}),
  });
}

export function scaleIn(targets: Targets, { delay = 0, duration = 1, start = 'top 85%', trigger }: RevealOptions = {}) {
  const els = toArray(targets);
  if (!els.length) return null;
  return gsap.from(els, { scale: 0.94, autoAlpha: 0, duration, delay, ease: 'power3.out', scrollTrigger: { trigger: trigger ?? els[0], start, once: true } });
}

export function parallax(target: Element | null, { distance = 80, trigger }: { distance?: number; trigger?: Element | null } = {}) {
  if (!target) return null;
  return gsap.fromTo(target, { y: -distance / 2 }, {
    y: distance / 2, ease: 'none',
    scrollTrigger: { trigger: trigger ?? target.parentElement ?? target, start: 'top bottom', end: 'bottom top', scrub: 0.6 },
  });
}

/** Pins `section` and scrolls `track` horizontally. Desktop only — callers gate with matchMedia. */
export function horizontalScroll(section: HTMLElement, track: HTMLElement, onProgress?: (p: number) => void) {
  const distance = () => Math.max(0, track.scrollWidth - section.clientWidth);
  return gsap.to(track, {
    x: () => -distance(), ease: 'none',
    scrollTrigger: {
      trigger: section, pin: true, scrub: 0.5, start: 'top top', end: () => `+=${distance()}`,
      invalidateOnRefresh: true, anticipatePin: 1, onUpdate: (self) => onProgress?.(self.progress),
    },
  });
}

/** Subtle magnetic pull toward the pointer. Returns a cleanup function. */
export function magneticHover(el: HTMLElement, strength = 0.25): () => void {
  if (!hasFinePointer()) return () => undefined;
  const x = gsap.quickTo(el, 'x', { duration: 0.5, ease: 'power3.out' });
  const y = gsap.quickTo(el, 'y', { duration: 0.5, ease: 'power3.out' });
  const move = (e: PointerEvent) => {
    const r = el.getBoundingClientRect();
    x((e.clientX - (r.left + r.width / 2)) * strength);
    y((e.clientY - (r.top + r.height / 2)) * strength);
  };
  const leave = () => { x(0); y(0); };
  el.addEventListener('pointermove', move);
  el.addEventListener('pointerleave', leave);
  return () => {
    el.removeEventListener('pointermove', move);
    el.removeEventListener('pointerleave', leave);
    gsap.set(el, { x: 0, y: 0 });
  };
}
