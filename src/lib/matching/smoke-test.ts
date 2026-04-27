// Dev-only sanity check. Runs once at module load when DEV is true.
// In Step 4 this is replaced by a sweep over all six scenarios.

import type { Customer, WatchlistEntry } from '@/types';
import { fellegiSunterMatch } from './fellegi-sunter';
import { legacyMatch } from './legacy';

const customer: Customer = {
  id: 'cust_smoke',
  fullName: 'Muhammad Ahmad Al-Rashidi',
  givenNames: ['Muhammad', 'Ahmad'],
  familyName: 'Al-Rashidi',
  dob: '1985-03-15',
  country: 'CA',
  entityType: 'natural_person',
  isSynthetic: true,
  transactionDescription: 'Wire to family in Toronto',
};

const watchlistEntry: WatchlistEntry = {
  id: 'ofac_smoke',
  fullName: 'Muhammad Ahmad',
  givenNames: ['Muhammad'],
  familyName: 'Ahmad',
  dob: '1962',
  country: 'YE',
  entityType: 'natural_person',
  listSource: 'OFAC_SDN',
  sanctionsProgram: 'SDGT',
  listingDate: '2003-01-22',
  isSynthetic: false,
};

export function runSmokeTest() {
  // eslint-disable-next-line no-console
  console.group('[smoke] Scenario 1 — Common Name Collision');
  const legacy = legacyMatch(customer, watchlistEntry);
  // eslint-disable-next-line no-console
  console.log('Legacy:', legacy);
  const fs = fellegiSunterMatch(customer, watchlistEntry);
  // eslint-disable-next-line no-console
  console.log('Entity resolution:', {
    verdict: fs.verdict,
    matchProbability: fs.matchProbability,
    totalLogOdds: fs.totalLogOdds,
    explanation: fs.explanation,
  });
  // eslint-disable-next-line no-console
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
  // eslint-disable-next-line no-console
  console.groupEnd();
}
