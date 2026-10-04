import { useRef } from 'react';
import { SITE } from '@/config/site';
import { gsap, hasFinePointer } from '@/lib/animations/gsap';
import { useGsap } from '@/lib/animations/useGsap';
import { Section } from '@/shared/components/Section';

const TECH = ['React', 'TypeScript', 'Tailwind', 'GSAP', 'Node.js', 'Express', 'Pollinations AI'];

export function Developer() {
  const cardRef = useRef<HTMLDivElement>(null);
  useGsap(cardRef, (el) => {
    gsap.to(el.querySelector('[data-float]'), { y: -8, duration: 3.2, ease: 'sine.inOut', repeat: -1, yoyo: true });
    if (!hasFinePointer()) return undefined;
    const rx = gsap.quickTo(el, 'rotationX', { duration: 0.6 });
    const ry = gsap.quickTo(el, 'rotationY', { duration: 0.6 });
    gsap.set(el, { transformPerspective: 900 });
    const move = (e: PointerEvent) => {
      const r = el.getBoundingClientRect();
      ry(((e.clientX - r.left) / r.width - 0.5) * 8);
      rx(-((e.clientY - r.top) / r.height - 0.5) * 8);
    };
    const leave = () => { rx(0); ry(0); };
    el.addEventListener('pointermove', move);
    el.addEventListener('pointerleave', leave);
    return () => { el.removeEventListener('pointermove', move); el.removeEventListener('pointerleave', leave); };
  });

  return (
    <Section id="developer" labelledBy="dev-title">
      <div className="grid items-center gap-12 lg:grid-cols-[1.3fr_1fr] lg:gap-14">
        <div data-reveal>
          <h2 id="dev-title" className="display-lg">Built by {SITE.developer.name}.</h2>
          <p className="mt-5 max-w-xl text-base leading-relaxed text-fg-dim sm:mt-6 sm:text-lg">
            Redora AI is an AI application engineering project created by {SITE.developer.name} to demonstrate modern frontend design, AI integration, API architecture and customer-support automation.
          </p>
          <ul className="mt-8 flex flex-wrap gap-2" aria-label="Technology">
            {TECH.map((t) => <li key={t} className="rounded-full border border-line-2 bg-white/[0.02] px-3.5 py-1.5 text-sm text-fg-dim">{t}</li>)}
          </ul>
        </div>
        <div ref={cardRef} data-reveal>
          <div data-float className="glass-strong relative overflow-hidden rounded-2xl p-6 shadow-panel sm:rounded-3xl sm:p-8">
            <div aria-hidden="true" className="absolute -right-12 -top-12 h-44 w-44 rounded-full bg-crimson/30 blur-3xl" />
            <p className="text-xs text-fg-mute">Designer &amp; developer</p>
            <p className="mt-3 font-display text-4xl leading-none sm:text-5xl">{SITE.developer.name}</p>
            <p className="mt-3 text-fg-dim">{SITE.developer.role}</p>
            <dl className="mt-8 space-y-3 border-t border-line-1 pt-6 text-sm">
              <div className="flex justify-between gap-4"><dt className="text-fg-mute">Project</dt><dd>{SITE.developer.project}</dd></div>
              <div className="flex justify-between gap-4"><dt className="text-fg-mute">Focus</dt><dd className="text-right">Frontend, AI integration, API design</dd></div>
            </dl>
          </div>
        </div>
      </div>
    </Section>
  );
}
