// Sweep both matchers across every watchlist entry and return the top hit
// per system. Used by the Scenario 6 custom-input flow.

import type {
  Customer,
  EntityResolutionResultData,
  LegacyResult,
  WatchlistEntry,
} from '@/types';
import { watchlist } from '@/data/watchlist';
import { arabicNormalize } from './arabic-normalize';
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
}

export function screenCustomer(customer: Customer): ScreenResult {
  let bestLegacy: { entry: WatchlistEntry; result: LegacyResult } | null = null;
  let bestFs: {
    entry: WatchlistEntry;
    result: EntityResolutionResultData;
  } | null = null;
  for (const entry of watchlist) {
    const lg = legacyMatch(customer, entry);
    if (!bestLegacy || lg.similarity > bestLegacy.result.similarity) {
      bestLegacy = { entry, result: lg };
    }
    const fs = fellegiSunterMatch(customer, entry, {
      normalizeNameToken: arabicNormalize,
    });
    if (!bestFs || fs.matchProbability > bestFs.result.matchProbability) {
      bestFs = { entry, result: fs };
    }
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
  };
}
