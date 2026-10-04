import { useState } from 'react';
import { KeyRound } from 'lucide-react';
import { SITE } from '@/config/site';
import { useHasPollinationsKey } from '@/shared/hooks/usePollinationsKey';
import { Logo } from './Navbar';
import { PollinationsConfig, type ConfigOutcome } from './PollinationsConfig';

const LINKS = [
  { label: 'AI Support', href: '#ai-support' },
  { label: 'Features', href: '#features' },
  { label: 'Plans', href: '#plans' },
  { label: 'Security', href: '#security' },
  { label: 'FAQ', href: '#faq' },
  { label: 'Developer', href: '#developer' },
];

const NOTICE: Record<ConfigOutcome, string> = {
  saved: 'Pollinations API key saved.',
  removed: 'Pollinations API key removed.',
};

export function Footer() {
  const [configOpen, setConfigOpen] = useState(false);
  const [notice, setNotice] = useState('');
  const hasKey = useHasPollinationsKey();

  const closeConfig = (outcome?: ConfigOutcome) => {
    setConfigOpen(false);
    setNotice(outcome ? NOTICE[outcome] : '');
  };

  return (
    // Extra bottom padding keeps the last row clear of the floating chat launcher.
    <footer className="relative border-t border-line-1 bg-ink-950/80 px-5 pb-24 pt-14 sm:px-8 sm:pb-28 sm:pt-16">
      <div className="mx-auto grid max-w-7xl gap-10 sm:grid-cols-2 lg:grid-cols-[1.4fr_1fr_1fr] lg:gap-12">
        <div className="sm:col-span-2 lg:col-span-1">
          <Logo />
          <p className="mt-5 max-w-xs text-fg-dim">{SITE.footerLine}</p>
          <p className="mt-6 max-w-xs text-xs leading-relaxed text-fg-mute">Redora is a fictional product. All plans, prices, policies, emails and links are DEMO data used for portfolio and educational purposes.</p>
        </div>
        <nav aria-label="Footer">
          <h2 className="text-sm font-medium text-fg">Explore</h2>
          <ul className="mt-4 grid grid-cols-2 gap-x-6 gap-y-1 text-sm text-fg-dim sm:block sm:space-y-1">
            {LINKS.map((l) => (
              <li key={l.href}><a href={l.href} className="inline-block rounded-sm py-1.5 transition-colors hover:text-crimson-soft">{l.label}</a></li>
            ))}
          </ul>
        </nav>
        <div>
          <h2 className="text-sm font-medium text-fg">Developer</h2>
          <p className="mt-4 text-sm text-fg-dim">{SITE.developer.name}</p>
          <p className="text-sm text-fg-mute">{SITE.developer.role}</p>
        </div>
      </div>
      <div className="mx-auto mt-12 flex max-w-7xl flex-col gap-3 border-t border-line-1 pt-6 text-xs text-fg-dim sm:mt-14 sm:flex-row sm:flex-wrap sm:items-center sm:justify-between">
        <p>{SITE.independentLine}</p>
        <p>© {SITE.year} Redora AI · {SITE.developer.credit}</p>
        <button
          type="button"
          onClick={() => setConfigOpen(true)}
          aria-haspopup="dialog"
          className="inline-flex items-center gap-1.5 self-start rounded-full py-1.5 text-fg-mute transition-colors hover:text-fg-dim sm:self-auto"
        >
          <KeyRound aria-hidden="true" className="h-3.5 w-3.5" />
          Pollinations API
          {hasKey && <span aria-hidden="true" className="h-1.5 w-1.5 rounded-full bg-crimson-soft" />}
          {hasKey && <span className="sr-only">(key added)</span>}
        </button>
      </div>
      <p role="status" className="sr-only">{notice}</p>
      {configOpen && <PollinationsConfig onClose={closeConfig} />}
    </footer>
  );
}
