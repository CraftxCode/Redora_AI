import { Cpu, FolderKanban, Gauge, Terminal, Workflow, type LucideIcon } from 'lucide-react';
import { PRODUCTS } from '@/data/redoraFacts';
import { Section, SectionHeading } from '@/shared/components/Section';

const ICONS: Record<string, LucideIcon> = { workspace: FolderKanban, assist: Cpu, automate: Workflow, analytics: Gauge, api: Terminal };

export function ProductModules() {
  return (
    <Section id="modules" labelledBy="modules-title">
      <SectionHeading id="modules-title" title="Five products. One Redora." description="This is what the assistant knows inside out. Redora is a fictional platform created for this demo." />
      <ul data-stagger className="mt-12 divide-y divide-line-1 border-y border-line-1 sm:mt-16">
        {PRODUCTS.map((p) => {
          const Icon = ICONS[p.id] ?? Cpu;
          return (
            <li key={p.id} className="group grid gap-5 py-7 transition-colors hover:bg-white/[0.015] sm:gap-6 sm:py-9 md:grid-cols-[auto_1fr_1.2fr] md:items-start md:gap-12 md:px-4">
              <Icon aria-hidden="true" className="h-7 w-7 text-crimson-soft transition-transform duration-500 group-hover:scale-110" />
              <div>
                <h3 className="font-display text-3xl leading-none sm:text-4xl">{p.name}</h3>
                <p className="mt-3 max-w-sm text-fg-dim">{p.summary}</p>
              </div>
              <ul className="flex flex-wrap gap-2 md:justify-end" aria-label={`${p.name} capabilities`}>
                {p.features.map((f) => <li key={f} className="rounded-full border border-line-2 px-3 py-1 text-xs text-fg-dim">{f}</li>)}
              </ul>
            </li>
          );
        })}
      </ul>
    </Section>
  );
}
