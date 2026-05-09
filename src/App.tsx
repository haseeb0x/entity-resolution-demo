import { ApiSection } from '@/components/ApiSection';
import { Demo } from '@/components/Demo';
import { Hook } from '@/components/Hook';
import { HowItWorks } from '@/components/HowItWorks';

export default function App() {
  return (
    <main className="min-h-screen bg-background text-foreground">
      <Hook />
      <hr className="border-soft" />
      <Demo />
      <hr className="border-soft" />
      <HowItWorks />
      <hr className="border-soft" />
      <ApiSection />
      <Footer />
    </main>
  );
}

function Footer() {
  return (
    <footer className="border-t border-soft bg-stone-50">
      <div className="container-prose py-10 text-sm text-stone-600">
        <p>
          This is a demonstration of a screening engine, not to be used in
          production. Watchlist entries are modelled on the public OFAC SDN
          list. All customer records are synthetic.
        </p>
      </div>
    </footer>
  );
}
