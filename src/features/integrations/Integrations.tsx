import { INTEGRATIONS } from '@/data/redoraFacts';
import { Section, SectionHeading } from '@/shared/components/Section';

export function Integrations() {
  return (
    <Section id="integrations" labelledBy="integrations-title">
      <SectionHeading id="integrations-title" title="Connects to the tools you already use." description="Six documented integrations. Ask about anything else and you’ll get the nearest option." />
      <ul data-stagger className="mt-14 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {INTEGRATIONS.map((i) => (
          <li key={i.id} className="card-lift rounded-3xl border border-line-1 bg-surface-1 p-6">
            <div className="flex items-center justify-between gap-3">
              <h3 className="font-display text-3xl leading-none">{i.name}</h3>
              <span className="rounded-full border border-line-2 px-2.5 py-0.5 text-[0.68rem] text-fg-dim">{i.freePlan ? 'Every plan' : 'Starter and up'}</span>
            </div>
            <p className="mt-4 text-sm leading-relaxed text-fg-dim">{i.summary}</p>
          </li>
        ))}
      </ul>
    </Section>
  );
}
