import { ChatConsole } from '@/features/chat/components/ChatConsole';
import { useChat } from '@/features/chat/state/ChatProvider';
import { ErrorBoundary } from '@/shared/components/ErrorBoundary';
import { Section, SectionHeading } from '@/shared/components/Section';

const SAMPLES = [
  'What is Redora?',
  'How do I reset my password?',
  'Which plan fits a team of eight that wants automations?',
  'Can I connect Redora to an imaginary service called XYZ?',
  'I think my account was hacked',
  'Why did my automation fail?',
];

export function InteractiveDemo() {
  const { send, panelOpen, status } = useChat();
  return (
    <Section id="ai-support" labelledBy="demo-title">
      <div className="grid items-start gap-12 lg:grid-cols-[1fr_1.05fr] lg:gap-14">
        <div>
          <SectionHeading id="demo-title" title="Try it. Ask anything about Redora." description="Common questions get an instant answer from the local knowledge base. Open-ended ones go to the AI, using only the few articles that matter." />
          <div className="mt-10" data-reveal>
            <h3 className="text-sm font-medium text-fg-dim">Try one of these</h3>
            <ul className="mt-4 flex flex-col items-stretch gap-2.5 sm:items-start">
              {SAMPLES.map((s) => (
                <li key={s}>
                  <button type="button" disabled={status === 'thinking'} onClick={() => send(s)} className="card-lift min-h-[44px] w-full rounded-2xl border border-line-1 bg-surface-1 px-4 py-2.5 text-left text-sm text-fg-dim hover:text-fg disabled:opacity-50 sm:w-auto">{s}</button>
                </li>
              ))}
            </ul>
          </div>
        </div>
        <div data-reveal className="relative">
          <div aria-hidden="true" className="absolute -inset-6 -z-10 rounded-[3rem] bg-crimson/10 blur-3xl" />
          <ErrorBoundary scope="demo-console" fallback={<p className="glass rounded-2xl p-6 text-sm">The demo console is unavailable. Browse the sections below or email support@redora-ai-demo.example (DEMO).</p>}>
            <ChatConsole variant="embedded" live={!panelOpen} inputId="demo-input" />
          </ErrorBoundary>
        </div>
      </div>
    </Section>
  );
}
