import { StatusDot } from '@/features/chat/components/StatusDot';
import { TypingIndicator } from '@/features/chat/components/TypingIndicator';
import { useTypewriterScript, type DemoExchange } from './useTypewriterScript';

const SCRIPT: readonly DemoExchange[] = [
  { question: 'How do I reset my password?', answer: ['You can reset it from the sign-in screen.', '1. Select “Forgot password”.', '2. Enter your Redora email.', '3. Open the reset email and choose a new password.'] },
  { question: 'Can I connect Redora to Slack?', answer: ['Yes. Slack is a documented integration.', 'Go to Settings → Integrations → Slack and approve access.', 'A basic connection is included on every plan.'] },
  { question: 'Why was I charged twice?', answer: ['A pending authorisation can look like a second charge.', 'Check Billing → History first.', 'If two charges are confirmed, email support for a refund review.'] },
];

/** Decorative, self-playing console for the hero. The real assistant lives in the AI Support section. */
export function HeroConsole() {
  const { question, phase, answerLines, exchange } = useTypewriterScript(SCRIPT);
  return (
    <div className="glass-strong relative w-full max-w-[460px] overflow-hidden rounded-3xl shadow-panel" role="img" aria-label="Animated preview of the Redora AI support console answering a customer question">
      <div aria-hidden="true">
        <div className="flex items-center justify-between border-b border-line-1 px-5 py-3.5">
          <div className="flex items-center gap-3">
            <span className="grid h-9 w-9 place-items-center rounded-full border border-crimson/50 bg-crimson/10"><span className="h-3 w-3 rounded-full bg-crimson-bright shadow-[0_0_14px_3px_rgba(255,48,48,.6)]" /></span>
            <div>
              <p className="flex items-center gap-3 text-sm font-semibold tracking-[0.12em]">REDORA AI <StatusDot /></p>
              <p className="text-xs text-fg-dim">Intelligent support assistant</p>
            </div>
          </div>
        </div>
        <div className="min-h-[300px] space-y-3 px-4 py-5">
          <div className="flex justify-end">
            <p className="max-w-[85%] rounded-2xl rounded-br-md bg-crimson/90 px-4 py-2.5 text-[0.935rem] text-white">
              {question}
              {phase === 'typing' && <span className="ml-0.5 inline-block h-4 w-px translate-y-0.5 animate-blink bg-white" />}
            </p>
          </div>
          {phase === 'thinking' && <ul><TypingIndicator /></ul>}
          {phase === 'answered' && (
            <div className="max-w-[92%] space-y-1.5 rounded-2xl rounded-bl-md border border-line-1 bg-surface-2 px-4 py-3 text-[0.935rem] leading-relaxed">
              {exchange.answer.slice(0, answerLines).map((l) => (
                <p key={l} className="animate-[fadeIn_.5s_ease-out_both]">{l}</p>
              ))}
            </div>
          )}
        </div>
        <div className="border-t border-line-1 px-4 py-3 text-xs text-fg-mute">Ask about plans, billing, security…</div>
      </div>
    </div>
  );
}
