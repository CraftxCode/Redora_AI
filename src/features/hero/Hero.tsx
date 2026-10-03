import { useRef } from 'react';
import { useChat } from '@/features/chat/state/ChatProvider';
import { gsap, hasFinePointer } from '@/lib/animations/gsap';
import { splitReveal } from '@/lib/animations/effects';
import { useGsap } from '@/lib/animations/useGsap';
import { Button } from '@/shared/components/Button';
import { SplitText } from '@/shared/components/SplitText';

export function Hero() {
  const ref = useRef<HTMLElement>(null);
  const robotRef = useRef<HTMLDivElement>(null);
  const { openPanel } = useChat();

  useGsap(ref, (el) => {
    const tl = gsap.timeline({ defaults: { ease: 'power3.out' } });
    el.querySelectorAll('[data-split]').forEach((n, i) => splitReveal(n, { scroll: false, delay: 0.25 + i * 0.12 }));
    tl.from('[data-hero-fade]', { y: 22, autoAlpha: 0, stagger: 0.12, duration: 0.9, delay: 0.7 }, 0);
    if (robotRef.current) {
      tl.from(robotRef.current, { y: 50, rotateX: -12, rotateY: 8, scale: 0.94, autoAlpha: 0, transformPerspective: 1100, duration: 1.4, ease: 'power4.out' }, 0.5);
    }
    if (hasFinePointer() && robotRef.current) {
      const rx = gsap.quickTo(robotRef.current, 'rotationX', { duration: 0.8, ease: 'power3.out' });
      const ry = gsap.quickTo(robotRef.current, 'rotationY', { duration: 0.8, ease: 'power3.out' });
      const glow = el.querySelector('[data-hero-glow]');
      const gx = glow ? gsap.quickTo(glow, 'x', { duration: 1.2, ease: 'power3.out' }) : null;
      const gy = glow ? gsap.quickTo(glow, 'y', { duration: 1.2, ease: 'power3.out' }) : null;
      const move = (e: PointerEvent) => {
        const nx = e.clientX / window.innerWidth - 0.5;
        const ny = e.clientY / window.innerHeight - 0.5;
        ry(nx * 10); rx(-ny * 8); gx?.(nx * 60); gy?.(ny * 40);
      };
      el.addEventListener('pointermove', move);
      return () => el.removeEventListener('pointermove', move);
    }
    return undefined;
  });

  return (
    <section ref={ref} id="home" aria-labelledby="hero-title" className="relative flex min-h-[100svh] items-center overflow-hidden px-5 pb-20 pt-28 sm:px-8">
      <div data-hero-glow aria-hidden="true" className="absolute right-[-10%] top-[10%] h-[44rem] w-[44rem] rounded-full bg-crimson/20 blur-[140px]" />
      <div className="relative mx-auto grid w-full max-w-7xl items-center gap-14 lg:grid-cols-[1.25fr_1fr]">
        <div>
          <p data-hero-fade className="mb-6 inline-flex items-center gap-2 rounded-full border border-line-2 bg-white/[0.02] px-4 py-1.5 text-[0.7rem] font-medium tracking-[0.2em] text-fg-dim">
            <span aria-hidden="true" className="h-1.5 w-1.5 animate-pulse-dot rounded-full bg-crimson-bright" />AI CUSTOMER SUPPORT PLATFORM
          </p>
          <h1 id="hero-title" className="display-xl">
            <span className="block" data-split><SplitText text="Support that" /></span>
            <span className="block italic text-crimson-soft" data-split><SplitText text="actually understands." /></span>
          </h1>
          <p aria-hidden="true" data-hero-fade className="mt-8 flex flex-wrap gap-x-5 font-display text-2xl text-fg-dim sm:text-3xl">
            <span>ASK.</span><span>UNDERSTAND.</span><span className="text-fg">SOLVE.</span>
          </p>
          <p data-hero-fade className="mt-6 max-w-xl text-lg leading-relaxed text-fg-dim">
            Meet Redora AI — a fast, intelligent support assistant designed to answer product questions, guide users through problems and connect them with the right next step.
          </p>
          <div data-hero-fade className="mt-10 flex flex-wrap gap-4">
            <Button onClick={openPanel}>ASK REDORA AI</Button>
            <Button variant="ghost" href="#features">EXPLORE FEATURES</Button>
          </div>
        </div>
        <div ref={robotRef} className="relative flex justify-center lg:justify-end" style={{ transformStyle: 'preserve-3d' }}>
          <img
            src="/redora-robot.png"
            alt="Redora AI robot mascot"
            className="relative w-full max-w-[540px] object-contain drop-shadow-[0_24px_60px_rgba(229,9,20,.2)]"
            width="768"
            height="768"
            fetchPriority="high"
          />
        </div>
      </div>
    </section>
  );
}
