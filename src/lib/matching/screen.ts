// Sweep both matchers across every watchlist entry and return the top hit
// per system. Used by the customer database screening flow (Scenario 6).
//
// When graph data is available, graph context is computed for each candidate
// pair and folded into the Fellegi–Sunter score. This allows the graph to
// contribute its disjointness signal even in the sweep.

import type {
  Customer,
  EntityResolutionResultData,
  LegacyResult,
  WatchlistEntry,
} from '@/types';
import { watchlist } from '@/data/watchlist';
import { graphData } from '@/data/graph-data';
import { arabicNormalize } from './arabic-normalize';
import { computeGraphContext } from './graph-context';
import {
  FS_THRESHOLD,
  fellegiSunterMatch,
} from './fellegi-sunter';
import { LEGACY_THRESHOLD, legacyMatch } from './legacy';

export interface ScreenResult {
  legacy: {
    bestEntry: WatchlistEntry;
    result: LegacyResult;
  } | null;
  entityResolution: {
    bestEntry: WatchlistEntry;
    result: EntityResolutionResultData;
  } | null;
  /** ER result for the *same* watchlist entry that legacy flagged. This is
   *  the comparison we always want to display: "Legacy says match. ER says
   *  no." Picking the globally highest ER probability would show a random
   *  entry (e.g. John Smith) because graph context penalizes the intended
   *  collision target so heavily that unrelated entries without graph data
   *  end up with higher (but still tiny) probabilities. */
  pairedEntityResolution: {
    bestEntry: WatchlistEntry;
    result: EntityResolutionResultData;
  } | null;
}

export function screenCustomer(customer: Customer): ScreenResult {
  let bestLegacy: { entry: WatchlistEntry; result: LegacyResult } | null = null;
  let bestFs: {
    entry: WatchlistEntry;
    result: EntityResolutionResultData;
  } | null = null;
  for (const entry of watchlist) {
    // Skip organizations / vessels / aircraft when screening natural persons
    // to avoid noise in the sweep. Entity-type mismatch is already penalized
    // by Fellegi–Sunter, but pre-filtering keeps the top-match selection
    // focused on the most relevant collision.
    if (
      customer.entityType === 'natural_person' &&
      entry.entityType !== 'natural_person'
    ) {
      continue;
    }

    const lg = legacyMatch(customer, entry);
    if (!bestLegacy || lg.similarity > bestLegacy.result.similarity) {
      bestLegacy = { entry, result: lg };
    }

    // Compute graph context if both nodes exist in the graph.
    const graphContext = computeGraphContext(customer, entry, graphData);
    const useGraph =
      graphContext.customerNeighbors.length > 0 &&
      graphContext.watchlistNeighbors.length > 0;

    const fs = fellegiSunterMatch(customer, entry, {
      normalizeNameToken: arabicNormalize,
      graphContext: useGraph ? graphContext : undefined,
    });
    if (!bestFs || fs.matchProbability > bestFs.result.matchProbability) {
      bestFs = { entry, result: fs };
    }
  }
  // Compute the ER result for the same entry that legacy flagged, so the
  // UI can show "Legacy flagged this pair → ER evaluated the same pair."
  let paired: { bestEntry: WatchlistEntry; result: EntityResolutionResultData } | null = null;
  if (bestLegacy && bestLegacy.result.similarity >= LEGACY_THRESHOLD) {
    const entry = bestLegacy.entry;
    const graphContext = computeGraphContext(customer, entry, graphData);
    const useGraph =
      graphContext.customerNeighbors.length > 0 &&
      graphContext.watchlistNeighbors.length > 0;
    const fs = fellegiSunterMatch(customer, entry, {
      normalizeNameToken: arabicNormalize,
      graphContext: useGraph ? graphContext : undefined,
    });
    paired = { bestEntry: entry, result: fs };
  }

  return {
    legacy:
      bestLegacy && bestLegacy.result.similarity >= LEGACY_THRESHOLD
        ? { bestEntry: bestLegacy.entry, result: bestLegacy.result }
        : null,
    entityResolution:
      bestFs && bestFs.result.matchProbability >= FS_THRESHOLD
        ? { bestEntry: bestFs.entry, result: bestFs.result }
        : null,
    pairedEntityResolution: paired,
  };
}
