import { Bell, Fingerprint, KeyRound, Lock, ScrollText, Users } from 'lucide-react';
import { Section, SectionHeading } from '@/shared/components/Section';

const ITEMS = [
  { icon: Lock, title: 'Encrypted connections', body: 'HTTPS everywhere, with stored credentials encrypted.' },
  { icon: Users, title: 'Role-based access', body: 'Owners, admins and members see only what they should.' },
  { icon: Fingerprint, title: 'Two-factor authentication', body: 'A second check at sign-in, with recovery codes you keep.' },
  { icon: KeyRound, title: 'Session management', body: 'Review active devices and sign out the ones you don’t recognise.' },
  { icon: Bell, title: 'Login alerts', body: 'Get an email when a new device signs in.' },
  { icon: ScrollText, title: 'Audit logs', body: 'Business plan: a record of sign-ins, permissions and workspace actions.' },
];

export function Security() {
  return (
    <Section id="security" labelledBy="security-title">
      <div className="grid gap-12 lg:grid-cols-[1fr_1.4fr] lg:gap-14">
        <div>
          <SectionHeading id="security-title" title="The assistant never asks for your password." description="Redora AI will not request passwords, one-time codes, recovery codes, API secrets or card security codes. If you paste one, it warns you and stops." />
          <p data-reveal className="mt-8 max-w-md rounded-2xl border border-crimson/30 bg-crimson/[0.06] p-5 text-sm leading-relaxed text-fg-dim">
            If you think your account is compromised: change your password, enable two-factor authentication, review active sessions, then contact support.
          </p>
        </div>
        <ul data-stagger className="grid gap-4 sm:grid-cols-2">
          {ITEMS.map(({ icon: Icon, title, body }) => (
            <li key={title} className="card-lift rounded-2xl border border-line-1 bg-surface-1 p-6 sm:rounded-3xl">
              <Icon aria-hidden="true" className="h-5 w-5 text-crimson-soft" />
              <h3 className="mt-6 text-lg font-medium">{title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-fg-dim">{body}</p>
            </li>
          ))}
        </ul>
      </div>
    </Section>
  );
}
