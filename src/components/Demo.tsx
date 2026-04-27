import { useMemo, useState } from 'react';
import { ComparisonPanel } from './ComparisonPanel';
import { CustomInputForm } from './CustomInputForm';
import { GraphPanel } from './GraphPanel';
import { MechanismPanel } from './MechanismPanel';
import { ScenarioSelector } from './ScenarioSelector';
import { TransactionContext } from './TransactionContext';
import { findCustomer } from '@/data/customers';
import { graphData } from '@/data/graph-data';
import { findScenario, scenarios } from '@/data/scenarios';
import { findWatchlistEntry } from '@/data/watchlist';
import { arabicNormalize } from '@/lib/matching/arabic-normalize';
import { fellegiSunterMatch } from '@/lib/matching/fellegi-sunter';
import { computeGraphContext } from '@/lib/matching/graph-context';
import { legacyMatch } from '@/lib/matching/legacy';

export function Demo() {
  const [activeId, setActiveId] = useState<string>(scenarios[0]!.id);
  const scenario = findScenario(activeId);

  const data = useMemo(() => {
    if (!scenario) return null;
    if (scenario.id === 's6_custom') return null;
    const customer = findCustomer(scenario.customerId);
    const entry = findWatchlistEntry(scenario.watchlistEntryId);
    if (!customer || !entry) return null;
    const graphContext = scenario.showGraph
      ? computeGraphContext(customer, entry, graphData)
      : undefined;
    return {
      customer,
      entry,
      legacy: legacyMatch(customer, entry),
      fs: fellegiSunterMatch(customer, entry, {
        normalizeNameToken: arabicNormalize,
        graphContext,
      }),
      graphContext,
    };
  }, [scenario]);

  return (
    <section id="demo" className="container-prose py-20">
      <div className="mb-8">
        <h2>The demo</h2>
        <p className="mt-2 text-stone-600">
          Pick a scenario. The same input goes to both systems. Compare the
          verdicts.
        </p>
      </div>

      <div className="space-y-6">
        <ScenarioSelector activeId={activeId} onChange={setActiveId} />

        {scenario && scenario.id !== 's6_custom' && (
          <p className="rounded-md border border-soft bg-stone-50 px-4 py-3 text-sm text-stone-700">
            <span className="font-medium text-stone-900">Teaching point. </span>
            {scenario.teachingPoint}
          </p>
        )}

        {data && (
          <>
            <TransactionContext customer={data.customer} />
            <ComparisonPanel
              legacy={data.legacy}
              entityResolution={data.fs}
              watchlistEntry={data.entry}
            />
            <MechanismPanel result={data.fs} />
            {scenario?.showGraph && data.graphContext && (
              <GraphPanel graphContext={data.graphContext} />
            )}
          </>
        )}

        {scenario?.id === 's6_custom' && <CustomInputForm />}
      </div>
    </section>
  );
}
