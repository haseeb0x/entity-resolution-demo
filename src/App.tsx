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
      <Footer />
    </main>
  );
}

function Footer() {
  return (
    <footer className="border-t border-soft bg-stone-50">
      <div className="container-prose py-10 text-sm text-stone-600">
        <p>
          Watchlist entries are illustrative samples modelled on the public
          OFAC SDN list. Customer records are synthetic. This is a teaching
          demo, not a screening system.
        </p>
        <p className="mt-2">
          Built as a portfolio piece. Source on{' '}
          <a
            href="https://github.com/"
            className="underline-offset-4 hover:underline"
          >
            GitHub
          </a>
          .
        </p>
      </div>
    </footer>
  );
}
