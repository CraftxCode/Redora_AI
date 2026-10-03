import { useLayoutEffect, useRef } from 'react';
import { gsap, NO_PREFERENCE_MOTION } from '@/lib/animations/gsap';
import { horizontalScroll } from '@/lib/animations/effects';

const CHAPTERS = [
  { n: '01', title: 'ASK', line: 'Ask naturally.', body: 'Type a question the way you would say it. No menus to hunt through, no keywords to guess.' },
  { n: '02', title: 'UNDERSTAND', line: 'Redora finds the relevant information.', body: 'The question is matched against Redora’s own knowledge base. Only the few relevant articles are used, so answers stay accurate and fast.' },
  { n: '03', title: 'SOLVE', line: 'Get clear next steps.', body: 'You get steps you can follow, or the right support channel when a human is the better answer.' },
];

export function HowItWorks() {
  const sectionRef = useRef<HTMLElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);
  const barRef = useRef<HTMLDivElement>(null);

  // Not using useGsap: this section needs two distinct media modes (desktop pin vs. stacked).
  useLayoutEffect(() => {
    const section = sectionRef.current;
    const track = trackRef.current;
    if (!section || !track) return undefined;
    const mm = gsap.matchMedia();
    mm.add(`(min-width: 1024px) and ${NO_PREFERENCE_MOTION}`, () => {
      section.dataset.mode = 'horizontal';
      const tween = horizontalScroll(section, track, (p) => { if (barRef.current) barRef.current.style.transform = `scaleX(${p})`; });
      section.querySelectorAll('.story-panel h3').forEach((h) => {
        gsap.from(h, { yPercent: 30, autoAlpha: 0, duration: 1, ease: 'power3.out', scrollTrigger: { trigger: h, containerAnimation: tween, start: 'left 80%', toggleActions: 'play none none reverse' } });
      });
      return () => { delete section.dataset.mode; };
    });
    mm.add(`(max-width: 1023px) and ${NO_PREFERENCE_MOTION}`, () => {
      section.querySelectorAll('.story-panel').forEach((p) => gsap.from(p, { y: 40, autoAlpha: 0, duration: 0.9, ease: 'power3.out', scrollTrigger: { trigger: p, start: 'top 85%', once: true } }));
    });
    return () => mm.revert();
  }, []);

  return (
    <section ref={sectionRef} id="how-it-works" aria-labelledby="how-title" className="relative">
      <h2 id="how-title" className="sr-only">How Redora works</h2>
      <div ref={trackRef} className="story-track flex flex-col">
        {CHAPTERS.map((c) => (
          <article key={c.n} className="story-panel relative flex min-h-[70svh] items-center px-5 py-20 sm:px-8 lg:px-[8vw]">
            <span aria-hidden="true" className="display pointer-events-none absolute right-[4vw] top-1/2 -translate-y-1/2 text-[28vw] leading-none text-white/[0.025] lg:text-[22vw]">{c.n}</span>
            <div className="relative max-w-2xl">
              <p className="font-display text-xl text-crimson-soft">Chapter {c.n}</p>
              <h3 className="display-xl mt-3">{c.title}</h3>
              <p className="mt-6 font-display text-3xl text-fg sm:text-4xl">{c.line}</p>
              <p className="mt-5 max-w-lg text-lg leading-relaxed text-fg-dim">{c.body}</p>
            </div>
          </article>
        ))}
      </div>
      <div aria-hidden="true" className="absolute inset-x-0 bottom-8 mx-auto hidden h-px w-[min(60vw,520px)] bg-line-2 lg:[[data-mode=horizontal]_&]:block">
        <div ref={barRef} className="h-full origin-left scale-x-0 bg-crimson shadow-[0_0_12px_rgba(229,9,20,.9)]" />
      </div>
    </section>
  );
}
