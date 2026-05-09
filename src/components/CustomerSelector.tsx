import { useState, useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { EntityResolutionResult } from './EntityResolutionResult';
import { LegacyResult } from './LegacyResult';
import { MechanismPanel } from './MechanismPanel';
import { TransactionContext } from './TransactionContext';
import { GraphPanel } from './GraphPanel';
import { customerDatabase } from '@/data/customer-database';
import { graphData } from '@/data/graph-data';
import { computeGraphContext } from '@/lib/matching/graph-context';
import { screenCustomer, type ScreenResult } from '@/lib/matching/screen';
import type { Customer, GraphResult } from '@/types';

function NoHitCard({
  title,
  tone,
  body,
}: {
  title: string;
  tone: string;
  body: string;
}) {
  return (
    <Card className="h-full">
      <CardHeader>
        <p className={`text-xs font-semibold uppercase tracking-wider ${tone}`}>
          {title}
        </p>
        <CardTitle className="mt-1">No hit</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          <Badge tone="clear">CLEAR</Badge>
          <p className="text-sm text-stone-600">{body}</p>
        </div>
      </CardContent>
    </Card>
  );
}

function CustomerCard({
  customer,
  isActive,
  onClick,
}: {
  customer: Customer;
  isActive: boolean;
  onClick: () => void;
}) {
  return (
    <button
      onClick={onClick}
      className={`w-full rounded-md border px-3 py-2.5 text-left transition-colors ${
        isActive
          ? 'border-stone-900 bg-stone-900 text-white'
          : 'border-stone-200 bg-white text-stone-900 hover:border-stone-400 hover:bg-stone-50'
      }`}
    >
      <p className={`text-sm font-medium ${isActive ? 'text-white' : 'text-stone-900'}`}>
        {customer.fullName}
      </p>
      <p className={`mt-0.5 text-xs ${isActive ? 'text-stone-300' : 'text-stone-500'}`}>
        {customer.occupation} · {customer.city}
      </p>
    </button>
  );
}

export function CustomerSelector() {
  const [selectedId, setSelectedId] = useState<string | null>(null);

  const selected = useMemo(
    () => customerDatabase.find((c) => c.id === selectedId) ?? null,
    [selectedId],
  );

  const results: ScreenResult | null = useMemo(
    () => (selected ? screenCustomer(selected) : null),
    [selected],
  );

  // Compute graph context independently for display. Use the legacy match's
  // watchlist entry (since it's always the name-collision target) so the
  // graph panel shows the right pair even when ER clears below threshold.
  const displayGraphContext: { ctx: GraphResult; entryId: string; entryName: string } | null =
    useMemo(() => {
      if (!selected || !results) return null;
      // Prefer legacy match entry; fall back to best ER entry for graph display
      const hit = results.legacy ?? results.pairedEntityResolution;
      if (!hit) return null;
      const entry = hit.bestEntry;
      const ctx = computeGraphContext(selected, entry, graphData);
      return { ctx, entryId: entry.id, entryName: entry.fullName };
    }, [selected, results]);

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Customer database — 20 profiles</CardTitle>
          <p className="mt-1 text-sm text-stone-600">
            Each person below is fictional. Each name matches an entry on the
            OFAC SDN list. Select one to screen it through both systems.
          </p>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 gap-2 sm:grid-cols-3 md:grid-cols-4">
            {customerDatabase.map((c) => (
              <CustomerCard
                key={c.id}
                customer={c}
                isActive={selectedId === c.id}
                onClick={() =>
                  setSelectedId(selectedId === c.id ? null : c.id)
                }
              />
            ))}
          </div>
        </CardContent>
      </Card>

      {selected && results && (
        <div key={selected.id} className="scenario-enter space-y-6">
          <TransactionContext customer={selected} />

          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            {results.legacy ? (
              <LegacyResult
                result={results.legacy.result}
                watchlistEntry={results.legacy.bestEntry}
              />
            ) : (
              <NoHitCard
                title="Legacy name-matching system"
                tone="text-flag"
                body="No watchlist entry exceeded the 0.85 Jaro–Winkler threshold."
              />
            )}
            {results.pairedEntityResolution ? (
              <EntityResolutionResult
                result={results.pairedEntityResolution.result}
                watchlistEntry={results.pairedEntityResolution.bestEntry}
              />
            ) : (
              <NoHitCard
                title="Entity resolution"
                tone="text-clear"
                body="No watchlist entry crossed the 50% match-probability threshold after weighing all available attributes and graph context."
              />
            )}
          </div>

          {results.pairedEntityResolution && (
            <MechanismPanel result={results.pairedEntityResolution.result} />
          )}

          {/* Graph panel — shown for all 20 customers */}
          {displayGraphContext && (
            <GraphPanel
              customerId={selected.id}
              watchlistEntryId={displayGraphContext.entryId}
              customerLabel={selected.fullName}
              watchlistLabel={`${displayGraphContext.entryName} (SDN)`}
              graphContext={displayGraphContext.ctx}
            />
          )}
        </div>
      )}
    </div>
  );
}
