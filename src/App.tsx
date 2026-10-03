import { ChatLauncher } from '@/features/chat/components/ChatLauncher';
import { ChatProvider } from '@/features/chat/state/ChatProvider';
import { FinalCta } from '@/features/cta/FinalCta';
import { Developer } from '@/features/developer/Developer';
import { InteractiveDemo } from '@/features/demo/InteractiveDemo';
import { Faq } from '@/features/faq/Faq';
import { Features } from '@/features/features/Features';
import { Hero } from '@/features/hero/Hero';
import { HowItWorks } from '@/features/how-it-works/HowItWorks';
import { Integrations } from '@/features/integrations/Integrations';
import { Background } from '@/features/layout/Background';
import { Footer } from '@/features/layout/Footer';
import { Navbar } from '@/features/layout/Navbar';
import { ProductModules } from '@/features/modules/ProductModules';
import { Plans } from '@/features/plans/Plans';
import { Security } from '@/features/security/Security';
import { Troubleshooting } from '@/features/troubleshooting/Troubleshooting';
import { ErrorBoundary } from '@/shared/components/ErrorBoundary';

const Safe = ({ name, children }: { name: string; children: React.ReactNode }) => (
  <ErrorBoundary scope={name} fallback={null}>{children}</ErrorBoundary>
);

export function App() {
  return (
    <ChatProvider>
      <a href="#ai-support" className="sr-only z-[60] rounded-full bg-crimson px-4 py-2 focus:not-sr-only focus:fixed focus:left-4 focus:top-4">Skip to the AI demo</a>
      <Background />
      <Navbar />
      <main>
        <Safe name="hero"><Hero /></Safe>
        <Safe name="demo"><InteractiveDemo /></Safe>
        <Safe name="how"><HowItWorks /></Safe>
        <Safe name="features"><Features /></Safe>
        <Safe name="modules"><ProductModules /></Safe>
        <Safe name="plans"><Plans /></Safe>
        <Safe name="security"><Security /></Safe>
        <Safe name="integrations"><Integrations /></Safe>
        <Safe name="troubleshooting"><Troubleshooting /></Safe>
        <Safe name="faq"><Faq /></Safe>
        <Safe name="developer"><Developer /></Safe>
        <Safe name="cta"><FinalCta /></Safe>
      </main>
      <Footer />
      <ChatLauncher />
    </ChatProvider>
  );
}
