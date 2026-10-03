import { useEffect, useState } from 'react';
import { prefersReducedMotion } from '@/lib/animations/gsap';

export interface DemoExchange { question: string; answer: string[] }
export type Phase = 'typing' | 'thinking' | 'answered';

export interface TypewriterState { question: string; phase: Phase; answerLines: number; exchange: DemoExchange }

/** Cycles sample support exchanges. Static (first exchange, fully shown) under reduced motion. */
export function useTypewriterScript(script: readonly DemoExchange[]): TypewriterState {
  const [index, setIndex] = useState(0);
  const [chars, setChars] = useState(() => (prefersReducedMotion() ? Infinity : 0));
  const [phase, setPhase] = useState<Phase>(() => (prefersReducedMotion() ? 'answered' : 'typing'));
  const [lines, setLines] = useState(() => (prefersReducedMotion() ? script[0]?.answer.length ?? 0 : 0));
  const exchange = script[index % script.length] as DemoExchange;

  useEffect(() => {
    if (prefersReducedMotion()) return undefined;
    let timer: ReturnType<typeof setTimeout>;
    const run = (step: () => void, ms: number) => { timer = setTimeout(step, ms); };

    const typing = (n: number) => {
      setChars(n);
      if (n < exchange.question.length) return run(() => typing(n + 1), 32);
      setPhase('thinking');
      return run(() => {
        setPhase('answered');
        const reveal = (l: number) => {
          setLines(l);
          if (l < exchange.answer.length) return run(() => reveal(l + 1), 420);
          return run(() => { setPhase('typing'); setChars(0); setLines(0); setIndex((i) => i + 1); }, 4200);
        };
        reveal(1);
      }, 1100);
    };
    run(() => typing(1), 900);
    return () => clearTimeout(timer);
  }, [exchange]);

  return { question: exchange.question.slice(0, chars), phase, answerLines: lines, exchange };
}
