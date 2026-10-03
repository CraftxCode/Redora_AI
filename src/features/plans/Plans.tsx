import { Check } from 'lucide-react';
import { ANNUAL_DISCOUNT, PLANS, annualTotal, formatUsd } from '@/data/redoraFacts';
import { cn } from '@/lib/cn';
import { Button } from '@/shared/components/Button';
import { Section, SectionHeading } from '@/shared/components/Section';
import { useChat } from '@/features/chat/state/ChatProvider';

export function Plans() {
  const { openPanel, send } = useChat();
  return (
    <Section id="plans" labelledBy="plans-title">
      <SectionHeading id="plans-title" title="Four plans. Fictional prices." description={`Demo pricing for the Redora platform. Annual billing is ${ANNUAL_DISCOUNT * 100}% cheaper. None of this is real commercial information.`} />
      <ul data-stagger className="mt-16 grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        {PLANS.map((p) => (
          <li key={p.id} className={cn('card-lift relative flex flex-col rounded-3xl border bg-surface-1 p-7', p.highlighted ? 'border-crimson/60 shadow-glow' : 'border-line-1')}>
            {p.highlighted && <span className="absolute right-5 top-5 rounded-full border border-crimson/50 bg-crimson/10 px-2.5 py-0.5 text-[0.68rem] text-crimson-soft">Most chosen</span>}
            <h3 className="font-display text-4xl leading-none">{p.name}</h3>
            <p className="mt-2 text-sm text-fg-dim">{p.blurb}</p>
            <p className="mt-8 flex items-baseline gap-1">
              <span className="font-display text-6xl leading-none">{formatUsd(p.priceMonthly)}</span>
              <span className="text-sm text-fg-dim">/month</span>
            </p>
            <p className="mt-1 h-5 text-xs text-fg-mute">{p.priceMonthly > 0 ? `or ${formatUsd(annualTotal(p))}/year` : 'No card needed'}</p>
            <ul className="mt-6 flex-1 space-y-2.5 text-sm text-fg-dim" aria-label={`${p.name} includes`}>
              {p.inherits && <li className="text-fg">Everything in Pro, plus:</li>}
              {p.features.map((f) => (
                <li key={f} className="flex items-start gap-2.5"><Check aria-hidden="true" className="mt-0.5 h-4 w-4 shrink-0 text-crimson-soft" />{f}</li>
              ))}
            </ul>
            <button type="button" onClick={() => { openPanel(); send(`What is ${p.name}?`, { entryId: `plan-${p.id}` }); }} className="mt-8 rounded-full border border-line-2 py-2.5 text-sm transition-colors hover:border-crimson/70 hover:bg-crimson/10">Ask about {p.name}</button>
          </li>
        ))}
      </ul>
      <p className="mt-6 text-xs text-fg-mute">DEMO · FICTIONAL pricing. Billing: Visa, Mastercard, PayPal, Bank Transfer.</p>
      <div className="mt-10" data-reveal><Button variant="ghost" onClick={openPanel}>Explore Redora</Button></div>
    </Section>
  );
}
