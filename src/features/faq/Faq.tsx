import { useId, useState } from 'react';
import { Plus } from 'lucide-react';
import { cn } from '@/lib/cn';
import { Section, SectionHeading } from '@/shared/components/Section';

const FAQS = [
  { q: 'Is Redora a real product?', a: 'No. Redora is a fictional platform created for a portfolio and educational demo. Plans, prices, policies and URLs are all DEMO data.' },
  { q: 'Does every question use the AI?', a: 'No. Common questions such as plans, password reset or contact details are answered instantly from a local knowledge base. The AI is used for open-ended or multi-part questions.' },
  { q: 'What happens if the AI is unavailable?', a: 'You will see a clear message with Try Again, Browse Support Topics and Contact Support. The best matching local answer is still shown, so the site stays useful.' },
  { q: 'Is it safe to paste my password to get help?', a: 'Never. Redora AI does not need passwords, one-time codes, recovery codes, API secrets or card security codes, and it will warn you if you include them.' },
  { q: 'What is the refund policy?', a: 'Within 14 days of your first paid purchase you can request a refund. Renewals are normally non-refundable unless there was a billing error.' },
  { q: 'Which integrations are supported?', a: 'Slack, Google Drive, GitHub, Notion, Zapier and Google Calendar. Other services are not currently listed.' },
];

export function Faq() {
  const [open, setOpen] = useState<number | null>(0);
  const base = useId();
  return (
    <Section id="faq" labelledBy="faq-title">
      <div className="grid gap-14 lg:grid-cols-[1fr_1.5fr]">
        <SectionHeading id="faq-title" title="Questions, answered." />
        <ul data-stagger className="divide-y divide-line-1 border-y border-line-1">
          {FAQS.map((f, i) => {
            const isOpen = open === i;
            return (
              <li key={f.q}>
                <h3>
                  <button type="button" aria-expanded={isOpen} aria-controls={`${base}-${i}`} onClick={() => setOpen(isOpen ? null : i)} className="flex w-full items-center justify-between gap-6 py-6 text-left text-lg">
                    {f.q}
                    <Plus aria-hidden="true" className={cn('h-5 w-5 shrink-0 text-crimson-soft transition-transform duration-500', isOpen && 'rotate-[135deg]')} />
                  </button>
                </h3>
                <div id={`${base}-${i}`} role="region" aria-label={f.q} className={cn('grid transition-[grid-template-rows,opacity] duration-500 ease-out', isOpen ? 'grid-rows-[1fr] opacity-100' : 'grid-rows-[0fr] opacity-0')}>
                  <div className="overflow-hidden"><p className="max-w-xl pb-6 leading-relaxed text-fg-dim">{f.a}</p></div>
                </div>
              </li>
            );
          })}
        </ul>
      </div>
    </Section>
  );
}
