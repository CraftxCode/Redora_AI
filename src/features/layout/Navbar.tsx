import { useEffect, useRef, useState } from 'react';
import { NAV_ITEMS, SITE } from '@/config/site';
import { cn } from '@/lib/cn';
import { gsap, prefersReducedMotion } from '@/lib/animations/gsap';
import { Button } from '@/shared/components/Button';
import { useActiveSection } from '@/shared/hooks/useActiveSection';
import { useScrolled } from '@/shared/hooks/useScrolled';
import { useChat } from '@/features/chat/state/ChatProvider';

const NAV_IDS = NAV_ITEMS.map((n) => n.id);

export function Logo({ className }: { className?: string }) {
  return (
    <a href="#home" aria-label={`${SITE.name} — home`} className={cn('flex items-center gap-2.5', className)}>
      <span aria-hidden="true" className="grid h-8 w-8 place-items-center rounded-full border border-crimson/60 shadow-[0_0_20px_-4px_rgba(229,9,20,.7)]">
        <span className="h-2.5 w-2.5 rounded-full bg-crimson-bright" />
      </span>
      <span className="font-display text-[1.7rem] leading-none tracking-tight">Redora <span className="italic text-crimson-soft">AI</span></span>
    </a>
  );
}

export function Navbar() {
  const scrolled = useScrolled(24);
  const active = useActiveSection(NAV_IDS);
  const { openPanel } = useChat();
  const [open, setOpen] = useState(false);
  const barRef = useRef<HTMLElement>(null);
  const toggleRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (!barRef.current || prefersReducedMotion()) return;
    const context = gsap.context(() => {
      gsap.from(barRef.current, { y: -12, duration: 0.45, ease: 'power3.out' });
    }, barRef);
    return () => context.revert();
  }, []);

  useEffect(() => {
    if (!open) return undefined;
    const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape') { setOpen(false); toggleRef.current?.focus(); } };
    document.body.style.overflow = 'hidden';
    window.addEventListener('keydown', onKey);
    return () => { document.body.style.overflow = ''; window.removeEventListener('keydown', onKey); };
  }, [open]);

  const ask = () => { setOpen(false); openPanel(); };

  return (
    <header
      ref={barRef}
      className={cn(
        'fixed inset-x-0 top-0 z-50 border-b transition-[height,background-color,border-color,box-shadow,backdrop-filter] duration-500',
        scrolled ? 'h-[60px] border-line-1 bg-ink-950/70 shadow-[0_8px_40px_-20px_rgba(229,9,20,.55)] backdrop-blur-xl' : 'h-20 border-transparent bg-transparent',
      )}
    >
      <nav aria-label="Primary" className="mx-auto flex h-full max-w-7xl items-center justify-between px-5 sm:px-8">
        <Logo />
        <ul className="hidden items-center gap-1 md:flex">
          {NAV_ITEMS.map((item) => (
            <li key={item.id}>
              <a
                href={item.href}
                aria-current={active === item.id ? 'true' : undefined}
                className={cn('relative rounded-full px-3.5 py-2 text-sm transition-colors hover:text-fg', active === item.id ? 'text-fg' : 'text-fg-dim')}
              >
                {item.label}
                <span aria-hidden="true" className={cn('absolute inset-x-3.5 -bottom-px h-px origin-left bg-crimson transition-transform duration-500', active === item.id ? 'scale-x-100' : 'scale-x-0')} />
              </a>
            </li>
          ))}
        </ul>
        <div className="flex items-center gap-3">
          <div className="hidden md:block"><Button onClick={openPanel} className="px-5 py-2">ASK AI</Button></div>
          <button
            ref={toggleRef}
            type="button"
            className="relative grid h-10 w-10 place-items-center rounded-full border border-line-2 md:hidden"
            aria-expanded={open}
            aria-controls="mobile-menu"
            aria-label={open ? 'Close menu' : 'Open menu'}
            onClick={() => setOpen((o) => !o)}
          >
            <span aria-hidden="true" className={cn('absolute h-px w-4 bg-fg transition-transform duration-300', open ? 'rotate-45' : '-translate-y-1.5')} />
            <span aria-hidden="true" className={cn('absolute h-px w-4 bg-fg transition-opacity duration-300', open ? 'opacity-0' : 'opacity-100')} />
            <span aria-hidden="true" className={cn('absolute h-px w-4 bg-fg transition-transform duration-300', open ? '-rotate-45' : 'translate-y-1.5')} />
          </button>
        </div>
      </nav>

      <div
        id="mobile-menu"
        inert={!open}
        className={cn('fixed inset-0 top-0 -z-10 bg-ink-950/95 pt-24 backdrop-blur-xl transition-all duration-500 md:hidden', open ? 'visible opacity-100' : 'invisible opacity-0')}
      >
        <ul className="space-y-1 px-6">
          {NAV_ITEMS.map((item, i) => (
            <li key={item.id} style={{ transitionDelay: open ? `${i * 55}ms` : '0ms' }} className={cn('transition-all duration-500', open ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0')}>
              <a href={item.href} onClick={() => setOpen(false)} className="block border-b border-line-1 py-4 font-display text-4xl">{item.label}</a>
            </li>
          ))}
        </ul>
        <div className="px-6 pt-8"><Button onClick={ask}>ASK AI</Button></div>
      </div>
    </header>
  );
}
