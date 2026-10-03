import { redoraKnowledge } from '@/data/redoraKnowledge';
import { useChat } from '@/features/chat/state/ChatProvider';
import { Section, SectionHeading } from '@/shared/components/Section';

const TOPICS = redoraKnowledge.filter((e) => e.id.startsWith('trouble-'));

export function Troubleshooting() {
  const { openPanel, send } = useChat();
  return (
    <Section id="troubleshooting" labelledBy="trouble-title">
      <SectionHeading id="trouble-title" title="Something broken? Start here." description="Fifteen common problems. Each answer gives the likely cause, a fix, an alternative and where to escalate." />
      <ul data-stagger className="mt-14 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {TOPICS.map((t) => (
          <li key={t.id}>
            <button type="button" onClick={() => { openPanel(); send(t.title, { entryId: t.id }); }} className="card-lift flex w-full items-center justify-between gap-3 rounded-2xl border border-line-1 bg-surface-1 px-5 py-4 text-left text-sm">
              <span>{t.title}</span>
              <span aria-hidden="true" className="text-crimson-soft">+</span>
            </button>
          </li>
        ))}
      </ul>
    </Section>
  );
}
