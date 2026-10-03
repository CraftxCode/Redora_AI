import { useRef, type ReactNode } from 'react';
import { cn } from '@/lib/cn';
import { useReveal } from '@/shared/hooks/useReveal';

interface SectionProps { id: string; className?: string; children: ReactNode; labelledBy?: string }

export function Section({ id, className, children, labelledBy }: SectionProps) {
  const ref = useRef<HTMLElement>(null);
  useReveal(ref);
  return (
    <section ref={ref} id={id} aria-labelledby={labelledBy} className={cn('relative px-5 py-24 sm:px-8 md:py-36', className)}>
      <div className="mx-auto w-full max-w-7xl">{children}</div>
    </section>
  );
}

interface HeadingProps { id: string; title: string; description?: string; className?: string }

export function SectionHeading({ id, title, description, className }: HeadingProps) {
  return (
    <header className={cn('max-w-3xl', className)} data-reveal>
      <h2 id={id} className="display-lg text-balance">{title}</h2>
      {description && <p className="mt-6 max-w-xl text-lg leading-relaxed text-fg-dim">{description}</p>}
    </header>
  );
}
