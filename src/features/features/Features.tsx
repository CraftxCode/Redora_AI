import { BookOpen, Code, Compass, Languages, MessageSquare, ShieldCheck, Sparkles, Wrench, type LucideIcon } from 'lucide-react';
import { Section, SectionHeading } from '@/shared/components/Section';

const FEATURES: ReadonlyArray<{ icon: LucideIcon; title: string; body: string; span?: string }> = [
  { icon: Sparkles, title: 'Intelligent answers', body: 'Answers are grounded in Redora’s own knowledge, so plans, limits and policies stay consistent.', span: 'lg:col-span-2' },
  { icon: MessageSquare, title: 'Conversational support', body: 'Ask in your own words and follow up naturally.' },
  { icon: Wrench, title: 'Fast troubleshooting', body: 'Every problem gets a cause, a fix, an alternative and an escalation path.' },
  { icon: ShieldCheck, title: 'Security-first design', body: 'The assistant never asks for passwords or codes, and warns you if you paste one.', span: 'lg:col-span-2' },
  { icon: BookOpen, title: 'Product knowledge', body: 'A structured knowledge base covers accounts, billing, features and integrations.' },
  { icon: Compass, title: 'Smart escalation', body: 'When a human is the right answer, you get the exact channel and what to include.' },
  { icon: Languages, title: 'Multilingual-ready', body: 'Ask in another language and the AI replies in kind.' },
  { icon: Code, title: 'Developer friendly', body: 'A typed API contract, a swappable AI provider and a documented architecture.' },
];

export function Features() {
  return (
    <Section id="features" labelledBy="features-title">
      <SectionHeading id="features-title" title="Built to answer, not to deflect." description="Eight things the assistant does differently." />
      <ul data-stagger className="mt-12 grid gap-4 sm:mt-16 sm:grid-cols-2 lg:grid-cols-4">
        {FEATURES.map(({ icon: Icon, title, body, span }) => (
          <li key={title} className={`card-lift group relative overflow-hidden rounded-2xl border border-line-1 bg-surface-1 p-6 sm:rounded-3xl sm:p-7 ${span ?? ''}`}>
            <div aria-hidden="true" className="absolute -right-10 -top-10 h-32 w-32 rounded-full bg-crimson/0 blur-3xl transition-colors duration-500 group-hover:bg-crimson/25" />
            <Icon aria-hidden="true" className="h-6 w-6 text-crimson-soft" />
            <h3 className="mt-8 font-display text-3xl leading-none sm:mt-10">{title}</h3>
            <p className="mt-3 text-sm leading-relaxed text-fg-dim">{body}</p>
          </li>
        ))}
      </ul>
    </Section>
  );
}
