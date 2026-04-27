// Network-context contribution to the entity-resolution score.
//
// Given a customer and a watchlist entity that already match on name + DOB +
// country (so the field-level Fellegi–Sunter score argues for a match), the
// graph asks: do these two entities share *any* neighbors? If yes, the match
// is reinforced. If no, despite all the field-level agreement, that absence
// is itself strong evidence that the two records describe different people
// who happen to share a name.
//
// The contextScore is added directly to the total log-odds. The values here
// are calibrated so that Scenario 5 — name + DOB + country all agreeing,
// network completely disjoint — flips from FLAG to CLEAR. Per the build plan,
// graph context is a flip mechanism for Scenario 5 only; other scenarios are
// not affected because they don't reach the high-baseline branch.

import type { Customer, GraphData, GraphResult, WatchlistEntry } from '@/types';

export function computeGraphContext(
  customer: Customer,
  watchlistEntry: WatchlistEntry,
  graph: GraphData,
): GraphResult {
  const customerNeighbors = neighborsOf(customer.id, graph);
  const watchlistNeighbors = neighborsOf(watchlistEntry.id, graph);
  const shared = customerNeighbors.filter((n) =>
    watchlistNeighbors.includes(n),
  );

  let contextScore: number;
  if (customerNeighbors.length === 0 || watchlistNeighbors.length === 0) {
    // Insufficient graph data on at least one side — graph contributes
    // nothing rather than an uninformed penalty.
    contextScore = 0;
  } else if (shared.length === 0) {
    // Two well-connected nodes with no overlapping neighbors. This is the
    // "different person with same name" signal.
    contextScore = -28;
  } else if (shared.length === 1) {
    contextScore = +1.5;
  } else {
    contextScore = +3.0 + shared.length * 0.5;
  }

  return {
    customerNeighbors,
    watchlistNeighbors,
    sharedNeighbors: shared,
    contextScore,
  };
}

function neighborsOf(nodeId: string, graph: GraphData): string[] {
  const out: string[] = [];
  for (const e of graph.edges) {
    if (e.source === nodeId) out.push(e.target);
    else if (e.target === nodeId) out.push(e.source);
  }
  return out;
}
