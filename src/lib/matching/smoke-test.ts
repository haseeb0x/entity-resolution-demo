// Dev-only sweep over all six scenarios. Verifies each produces the expected
// verdict from Section 6 of the build plan. Two scenarios (3 and 5) only
// reach their *final* verdict after later build steps add Arabic
// normalization and graph context; the expectations below reflect what
// is reachable at the current step.

import { findCustomer } from '@/data/customers';
import { findScenario, scenarios } from '@/data/scenarios';
import { findWatchlistEntry } from '@/data/watchlist';
import { fellegiSunterMatch } from './fellegi-sunter';
import { legacyMatch } from './legacy';

interface Expected {
  legacy: 'FLAG' | 'CLEAR';
  fs: 'FLAG' | 'CLEAR';
  note?: string;
}

const expectedByScenario: Record<string, Expected> = {
  s1_common_name: { legacy: 'FLAG', fs: 'CLEAR' },
  s2_vessel_vs_person: { legacy: 'FLAG', fs: 'CLEAR' },
  s3_transliteration: {
    legacy: 'CLEAR',
    fs: 'CLEAR',
    note: 'fs flips to FLAG once Arabic normalization is plugged in (step 7)',
  },
  s4_true_positive: { legacy: 'FLAG', fs: 'FLAG' },
  s5_graph_disambiguation: {
    legacy: 'FLAG',
    fs: 'FLAG',
    note: 'flips to CLEAR once graph context is plugged in (step 8)',
  },
};

export function runSmokeTest() {
  console.group('[smoke] Six-scenario verdict matrix');
  let passed = 0;
  let total = 0;
  for (const s of scenarios) {
    if (s.id === 's6_custom') continue;
    const expected = expectedByScenario[s.id];
    if (!expected) continue;
    const customer = findCustomer(s.customerId);
    const entry = findWatchlistEntry(s.watchlistEntryId);
    if (!customer || !entry) {
      console.error(`[smoke] missing data for scenario ${s.id}`);
      continue;
    }
    const legacy = legacyMatch(customer, entry);
    const fs = fellegiSunterMatch(customer, entry);
    const ok =
      legacy.verdict === expected.legacy && fs.verdict === expected.fs;
    total++;
    if (ok) passed++;
    console.log(
      `${ok ? '✓' : '✗'} ${s.id}: legacy=${legacy.verdict} (sim ${legacy.similarity.toFixed(2)})  fs=${fs.verdict} (P=${(fs.matchProbability * 100).toFixed(1)}%, logodds=${fs.totalLogOdds.toFixed(2)})${expected.note ? `  — ${expected.note}` : ''}`,
    );
  }
  console.log(`\n${passed}/${total} scenarios match expected verdicts.`);

  // Detailed dump for Scenario 1 (the canonical example).
  const s1 = findScenario('s1_common_name')!;
  const c = findCustomer(s1.customerId)!;
  const w = findWatchlistEntry(s1.watchlistEntryId)!;
  const fs = fellegiSunterMatch(c, w);
  console.group('\n[smoke] Scenario 1 detailed weight table');
  console.table(
    fs.fields.map((f) => ({
      field: f.fieldName,
      customer: f.customerValue,
      watchlist: f.watchlistValue,
      matched: f.matched,
      u: f.uProbability,
      weight: Number(f.weight.toFixed(3)),
    })),
  );
  console.log(`Σ log-odds = ${fs.totalLogOdds.toFixed(3)}`);
  console.log(`P(match) = ${(fs.matchProbability * 100).toFixed(2)}%`);
  console.groupEnd();
  console.groupEnd();
}
