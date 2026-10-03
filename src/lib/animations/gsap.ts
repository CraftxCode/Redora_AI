import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

export { gsap, ScrollTrigger };
export const NO_PREFERENCE_MOTION = '(prefers-reduced-motion: no-preference)';
export const prefersReducedMotion = (): boolean => window.matchMedia('(prefers-reduced-motion: reduce)').matches;
export const hasFinePointer = (): boolean => window.matchMedia('(hover: hover) and (pointer: fine)').matches;
