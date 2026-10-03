import { DEVELOPER } from '@/data/redoraFacts';

export const SITE = {
  name: 'Redora AI',
  tagline: 'Support that actually understands.',
  footerLine: 'AI-powered support for the Redora platform.',
  independentLine: 'An independent AI application engineering project.',
  developer: DEVELOPER,
  year: 2026,
} as const;

export interface NavItem { label: string; href: string; id: string }

export const NAV_ITEMS: readonly NavItem[] = [
  { label: 'Home', href: '#home', id: 'home' },
  { label: 'AI Support', href: '#ai-support', id: 'ai-support' },
  { label: 'Features', href: '#features', id: 'features' },
  { label: 'Plans', href: '#plans', id: 'plans' },
  { label: 'Security', href: '#security', id: 'security' },
  { label: 'FAQ', href: '#faq', id: 'faq' },
];

export const SECTION_IDS = ['home', 'ai-support', 'how-it-works', 'features', 'modules', 'plans', 'security', 'integrations', 'troubleshooting', 'faq', 'developer'] as const;
