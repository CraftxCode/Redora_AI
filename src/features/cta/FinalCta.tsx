import { Button } from '@/shared/components/Button';
import { Section } from '@/shared/components/Section';
import { useChat } from '@/features/chat/state/ChatProvider';

export function FinalCta() {
  const { openPanel } = useChat();
  return (
    <Section id="cta" className="overflow-hidden" labelledBy="cta-title">
      <div aria-hidden="true" className="pointer-events-none absolute left-1/2 top-1/2 h-[28rem] w-[28rem] -translate-x-1/2 -translate-y-1/2 rounded-full bg-crimson/25 blur-[120px] sm:h-[46rem] sm:w-[46rem] sm:blur-[150px]" />
      <div data-reveal className="relative text-center">
        <h2 id="cta-title" className="display-xl mx-auto max-w-5xl text-balance">Ask. Understand. Solve.</h2>
        <p className="mx-auto mt-6 max-w-lg text-base text-fg-dim sm:mt-8 sm:text-lg">Open the assistant and ask it something real. It answers from the Redora knowledge base first, and the AI only when it needs to.</p>
        <div className="mt-8 flex flex-wrap justify-center gap-4 sm:mt-10"><Button onClick={openPanel}>ASK REDORA AI</Button></div>
      </div>
    </Section>
  );
}
