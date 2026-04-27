// Legacy name-matching: a Jaro–Winkler similarity score over the full
// normalized name. This baseline mirrors what most legacy compliance
// screening systems do — and is intentionally limited to the name field. It
// does NOT consider DOB, country, entity type, or any other attribute. That
// limitation is the whole point of the demonstration.

import type { Customer, LegacyResult, WatchlistEntry } from '@/types';

export const LEGACY_THRESHOLD = 0.85;

function normalize(name: string): string {
  return name
    .toLowerCase()
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '') // strip diacritics
    .replace(/[^a-z\s]/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}

// Jaro similarity.
function jaro(s1: string, s2: string): number {
  if (s1 === s2) return 1;
  const len1 = s1.length;
  const len2 = s2.length;
  if (len1 === 0 || len2 === 0) return 0;
  const matchWindow = Math.max(0, Math.floor(Math.max(len1, len2) / 2) - 1);
  const s1Matches = new Array(len1).fill(false);
  const s2Matches = new Array(len2).fill(false);
  let matches = 0;
  for (let i = 0; i < len1; i++) {
    const lo = Math.max(0, i - matchWindow);
    const hi = Math.min(i + matchWindow + 1, len2);
    for (let j = lo; j < hi; j++) {
      if (s2Matches[j]) continue;
      if (s1[i] !== s2[j]) continue;
      s1Matches[i] = true;
      s2Matches[j] = true;
      matches++;
      break;
    }
  }
  if (matches === 0) return 0;
  let k = 0;
  let transpositions = 0;
  for (let i = 0; i < len1; i++) {
    if (!s1Matches[i]) continue;
    while (!s2Matches[k]) k++;
    if (s1[i] !== s2[k]) transpositions++;
    k++;
  }
  transpositions /= 2;
  return (
    (matches / len1 + matches / len2 + (matches - transpositions) / matches) /
    3
  );
}

// Jaro–Winkler with prefix scaling.
export function jaroWinkler(s1: string, s2: string): number {
  const j = jaro(s1, s2);
  if (j === 0) return 0;
  let prefix = 0;
  const max = Math.min(4, s1.length, s2.length);
  for (let i = 0; i < max; i++) {
    if (s1[i] === s2[i]) prefix++;
    else break;
  }
  return j + prefix * 0.1 * (1 - j);
}

export function legacyMatch(
  customer: Customer,
  entry: WatchlistEntry,
): LegacyResult {
  const a = normalize(customer.fullName);
  const b = normalize(entry.fullName);
  const similarity = jaroWinkler(a, b);
  const verdict: 'FLAG' | 'CLEAR' =
    similarity >= LEGACY_THRESHOLD ? 'FLAG' : 'CLEAR';
  const explanation =
    verdict === 'FLAG'
      ? `Name similarity ${similarity.toFixed(2)} ≥ ${LEGACY_THRESHOLD} threshold.`
      : `Name similarity ${similarity.toFixed(2)} below ${LEGACY_THRESHOLD} threshold.`;
  return { similarity, verdict, explanation };
}
