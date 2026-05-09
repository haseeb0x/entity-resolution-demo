import { Terminal } from 'lucide-react';

export function ApiSection() {
  const curlExample = `curl -X POST https://entity-resolution-demo.pages.dev/api/screen \\
  -H "Content-Type: application/json" \\
  -d '{"fullName": "Ahmad Khan", "dob": "1985", "country": "PK"}'`;

  return (
    <section className="container-prose py-24">
      <h2>API</h2>

      <div className="mt-6 space-y-4 text-stone-700">
        <p>
          The same screening engine that powers this demo is available as a
          REST endpoint. Send a customer record, receive both legacy and
          entity-resolution verdicts with the full weight breakdown.
        </p>

        <div className="rounded-md border border-soft bg-stone-900 p-4">
          <div className="mb-2 flex items-center gap-2 text-xs text-stone-400">
            <Terminal size={14} />
            <span>POST /api/screen</span>
          </div>
          <pre className="overflow-x-auto text-sm leading-relaxed text-stone-200">
            <code>{curlExample}</code>
          </pre>
        </div>

        <p className="text-sm text-stone-500">
          Returns match probability, per-field log-odds weights, graph
          contribution, and a human-readable explanation. Accepts optional
          fields: givenNames, familyName, entityType, and counterparties.
        </p>
      </div>
    </section>
  );
}
