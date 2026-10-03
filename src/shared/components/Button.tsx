import { useEffect, useRef, type AnchorHTMLAttributes, type ButtonHTMLAttributes, type ReactNode } from 'react';
import { ArrowRight } from 'lucide-react';
import { cn } from '@/lib/cn';
import { magneticHover } from '@/lib/animations/effects';

type Variant = 'primary' | 'ghost';

interface Common { variant?: Variant; children: ReactNode; className?: string; magnetic?: boolean; arrow?: boolean }
type AsButton = Common & ButtonHTMLAttributes<HTMLButtonElement> & { href?: undefined };
type AsLink = Common & AnchorHTMLAttributes<HTMLAnchorElement> & { href: string };

const base =
  'group inline-flex items-center gap-2 rounded-full px-6 py-3 text-sm font-medium tracking-wide transition-[transform,box-shadow,background-color,border-color] duration-300 hover:-translate-y-0.5 active:translate-y-0 disabled:opacity-50 disabled:hover:translate-y-0';
const variants: Record<Variant, string> = {
  primary: 'bg-crimson text-white shadow-glow hover:bg-crimson-bright',
  ghost: 'border border-line-2 bg-white/[0.02] text-fg hover:border-crimson/60 hover:bg-white/[0.05]',
};

export function Button(props: AsButton | AsLink) {
  const { variant = 'primary', children, className, magnetic = true, arrow = true, ...rest } = props;
  const wrapRef = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    if (!magnetic || !wrapRef.current) return undefined;
    return magneticHover(wrapRef.current, 0.22);
  }, [magnetic]);

  const classes = cn(base, variants[variant], className);
  const content = (
    <>
      {children}
      {arrow && <ArrowRight aria-hidden="true" className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />}
    </>
  );

  return (
    <span ref={wrapRef} className="inline-block">
      {'href' in rest && rest.href !== undefined ? (
        <a className={classes} {...(rest as AnchorHTMLAttributes<HTMLAnchorElement>)}>{content}</a>
      ) : (
        <button type="button" className={classes} {...(rest as ButtonHTMLAttributes<HTMLButtonElement>)}>{content}</button>
      )}
    </span>
  );
}
