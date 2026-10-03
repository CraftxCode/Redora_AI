import { createElement, type ElementType } from 'react';

interface Props {
  text: string;
  as?: ElementType;
  className?: string;
}

/**
 * Renders each word in a clipped wrapper so GSAP (splitReveal) can slide words up.
 * The full text is exposed to assistive tech via aria-label; spans are hidden.
 */
export function SplitText({ text, as = 'span', className }: Props) {
  return createElement(
    as,
    { className, 'aria-label': text },
    text.split(' ').map((word, i, all) => (
      <span key={`${word}-${i}`} aria-hidden="true">
        <span className="split-word"><span className="split-inner">{word}</span></span>
        {i < all.length - 1 ? ' ' : null}
      </span>
    )),
  );
}
