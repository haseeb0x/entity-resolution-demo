import {
  CircuitBoard,
  Database,
  Filter,
  GitBranch,
  ScanSearch,
  ShieldCheck,
} from 'lucide-react';


export function HowItWorks() {
  return (
    <section id="how" className="container-prose py-24">
      <h2>How it works</h2>

      <div className="mt-8 space-y-10">
        <div>
          <h3>The problem</h3>
          <div className="mt-3 space-y-3 text-stone-700">
            <p>
              Most legacy compliance screening systems decide whether a
              customer is on a sanctions list by comparing two names with a
              string-similarity score. Above a fixed threshold, they flag.
              That works against rare, Western-spelled names. It collapses
              against common ones — and Arabic names like Muhammad or Ahmad
              are common at population-frequency scales that break the
              underlying assumption.
            </p>
            <p>
              Entity resolution treats name as one signal among several.
              Date of birth, country, entity type, identifying numbers,
              and — when available — graph context all contribute log-odds
              weights to a final match probability. Crucially, the weight
              of each signal scales with how informative it is: a Muhammad
              match is worth less than a Yevgeny match because Muhammad is
              far more common.
            </p>
          </div>
        </div>

        <div>
          <h3>The architecture</h3>
          <p className="mt-3 text-stone-600">
            A production system threads these stages together:
          </p>
          <ul className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-2">
            <Step
              icon={<Database size={18} />}
              title="Structured ingress"
              body="Normalize names, dates, identifiers, and entity types into a canonical schema."
            />
            <Step
              icon={<Filter size={18} />}
              title="Probabilistic linkage"
              body="Score each candidate pair via Fellegi–Sunter. The same model used in this demo."
            />
            <Step
              icon={<GitBranch size={18} />}
              title="Graph context"
              body="Promote or demote matches based on shared counterparties, employer, or geography."
            />
            <Step
              icon={<ScanSearch size={18} />}
              title="Named-entity recognition"
              body="Extract entities from free-text fields (memos, narratives) so they can be linked too."
            />
            <Step
              icon={<CircuitBoard size={18} />}
              title="Risk tiering"
              body="Assemble decisive matches into prioritized alerts; route the rest to L1 review."
            />
            <Step
              icon={<ShieldCheck size={18} />}
              title="Model risk management"
              body="Audit, calibration, and bias monitoring across populations and name groups."
            />
          </ul>
        </div>

        {/* Read more section removed — this is a screening engine demo,
            not a portfolio landing page. */}
      </div>
    </section>
  );
}

function Step({
  icon,
  title,
  body,
}: {
  icon: React.ReactNode;
  title: string;
  body: string;
}) {
  return (
    <li className="rounded-md border border-soft bg-white p-4">
      <div className="flex items-center gap-2 text-stone-700">
        {icon}
        <p className="font-medium text-stone-900">{title}</p>
      </div>
      <p className="mt-1.5 text-sm text-stone-600">{body}</p>
    </li>
  );
}

