import { Demo } from '@/components/Demo';
import { Hook } from '@/components/Hook';

export default function App() {
  return (
    <main className="min-h-screen bg-background text-foreground">
      <Hook />
      <hr className="border-soft" />
      <Demo />
    </main>
  );
}
