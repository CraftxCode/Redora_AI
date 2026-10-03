import { SITE } from '@/config/site';
import { Logo } from './Navbar';

const LINKS = [
  { label: 'AI Support', href: '#ai-support' },
  { label: 'Features', href: '#features' },
  { label: 'Plans', href: '#plans' },
  { label: 'Security', href: '#security' },
  { label: 'FAQ', href: '#faq' },
  { label: 'Developer', href: '#developer' },
];

export function Footer() {
  return (
    <footer className="relative border-t border-line-1 bg-ink-950/80 px-5 pb-10 pt-16 sm:px-8">
      <div className="mx-auto grid max-w-7xl gap-12 md:grid-cols-[1.4fr_1fr_1fr]">
        <div>
          <Logo />
          <p className="mt-5 max-w-xs text-fg-dim">{SITE.footerLine}</p>
          <p className="mt-6 max-w-xs text-xs leading-relaxed text-fg-mute">Redora is a fictional product. All plans, prices, policies, emails and links are DEMO data used for portfolio and educational purposes.</p>
        </div>
        <nav aria-label="Footer">
          <h2 className="text-sm font-medium text-fg">Explore</h2>
          <ul className="mt-4 space-y-2.5 text-sm text-fg-dim">
            {LINKS.map((l) => (
              <li key={l.href}><a href={l.href} className="transition-colors hover:text-crimson-soft">{l.label}</a></li>
            ))}
          </ul>
        </nav>
        <div>
          <h2 className="text-sm font-medium text-fg">Developer</h2>
          <p className="mt-4 text-sm text-fg-dim">{SITE.developer.name}</p>
          <p className="text-sm text-fg-mute">{SITE.developer.role}</p>
        </div>
      </div>
      <div className="mx-auto mt-14 flex max-w-7xl flex-col justify-between gap-2 border-t border-line-1 pt-6 text-xs text-fg-dim sm:flex-row">
        <p>{SITE.independentLine}</p>
        <p>© {SITE.year} Redora AI · {SITE.developer.credit}</p>
      </div>
    </footer>
  );
}
