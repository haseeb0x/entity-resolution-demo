// Probabilistic record linkage via the Fellegi–Sunter model.
//
// For each comparison field f we compute:
//
//   m_f = P(agreement on f | records describe the same entity)
//   u_f = P(agreement on f | records describe different entities)
//
// When the field agrees: weight_f = log2(m_f / u_f)             (positive)
// When the field disagrees: weight_f = log2((1 - m_f) / (1 - u_f))  (negative)
//
// Total log-odds = Σ weight_f. Match probability = 2^Σ / (1 + 2^Σ).
//
// The m parameters here reflect the typical "same person" agreement rate per
// field (high but not perfect, accounting for typos, transliteration, partial
// records). The u parameters reflect approximate population frequencies — for
// names they come from name-frequencies.ts; for other fields they are the
// chance that two random unrelated records would agree on that field.
//
// These values are demonstrative. A real system would derive m and u from
// labelled data + observed agreement rates. The numbers in this file are
// chosen so that the six scenarios documented in Section 6 of the build plan
// produce their intended verdicts; every weight is still strictly derivable
// from the m and u table below.

import type {
  Customer,
  EntityResolutionResultData,
  GraphResult,
  MatchField,
  WatchlistEntry,
} from '@/types';
import {
  lookupFamilyNameU,
  lookupGivenNameU,
} from '@/data/name-frequencies';

export const FS_THRESHOLD = 0.5;

export interface ScoringConfig {
  m_given: number;
  m_family: number;
  m_dob: number;
  u_dob: number;
  m_country: number;
  u_country: number;
  m_entityType: number;
  u_entityType: number;
  m_passport: number;
  u_passport: number;
}

export const DEFAULT_CONFIG: ScoringConfig = {
  // Names: m is moderate because transliteration / typos / OCR errors
  // routinely cause the same person's name to be spelled differently across
  // records. Real systems often pair this with fuzzy matching (we do that
  // separately via Arabic normalization in step 7).
  m_given: 0.85,
  m_family: 0.85,
  // DOB: highly stable when present.
  m_dob: 0.99,
  // Approximate uniform u across plausible ~80-year window of relevant DOBs.
  u_dob: 1 / 80,
  // Country: stable. u ~ 1/20 active jurisdictions in screening flows.
  m_country: 0.95,
  u_country: 0.05,
  // Entity type: very stable. u ~ 0.25 across the 4 type buckets.
  m_entityType: 0.99,
  u_entityType: 0.25,
  // Passport: the strongest single field. u is essentially zero for any
  // particular passport number — taken as 1e-7.
  m_passport: 0.99,
  u_passport: 1e-7,
};

export interface ScoringOptions {
  config?: ScoringConfig;
  // Optional name canonicalizer plugged in by Arabic normalization (step 7).
  // Receives a single name token, returns its canonical form.
  normalizeNameToken?: (token: string) => string;
  // Optional graph-context contribution (step 8). Its contextScore is added
  // directly to the total log-odds.
  graphContext?: GraphResult;
}

const matchWeight = (m: number, u: number) => Math.log2(m / u);
const missWeight = (m: number, u: number) => Math.log2((1 - m) / (1 - u));

function tokenSet(tokens: string[], normalize?: (t: string) => string) {
  const out = new Set<string>();
  for (const t of tokens) {
    if (!t) continue;
    const norm = (normalize ? normalize(t) : t).toLowerCase();
    if (norm) out.add(norm);
  }
  return out;
}

function bestGivenAgreement(
  customer: Customer,
  entry: WatchlistEntry,
  normalize?: (t: string) => string,
): { matched: boolean; matchedToken?: string; uForToken: number } {
  const cs = tokenSet(customer.givenNames, normalize);
  const ws = tokenSet(entry.givenNames, normalize);
  const intersection: string[] = [];
  for (const t of cs) if (ws.has(t)) intersection.push(t);
  if (intersection.length === 0) {
    // For mismatch weight we use the rarer of the customer's tokens.
    const uMin = Math.min(
      ...customer.givenNames.map(lookupGivenNameU),
      ...entry.givenNames.map(lookupGivenNameU),
    );
    return { matched: false, uForToken: isFinite(uMin) ? uMin : 0.005 };
  }
  // Use the rarest matched token (smallest u → largest weight). This is the
  // most informative signal in the intersection.
  const u = Math.min(...intersection.map(lookupGivenNameU));
  return {
    matched: true,
    matchedToken: intersection[0],
    uForToken: u,
  };
}

function bestFamilyAgreement(
  customer: Customer,
  entry: WatchlistEntry,
  normalize?: (t: string) => string,
): { matched: boolean; uForToken: number } {
  const c = customer.familyName
    ? (normalize ? normalize(customer.familyName) : customer.familyName)
        .toLowerCase()
        .trim()
    : '';
  const e = entry.familyName
    ? (normalize ? normalize(entry.familyName) : entry.familyName)
        .toLowerCase()
        .trim()
    : '';
  if (!c || !e) {
    // Asymmetric or missing — treat as a non-match against the available token.
    const u = lookupFamilyNameU(c || e || '');
    return { matched: false, uForToken: u };
  }
  if (c === e) return { matched: true, uForToken: lookupFamilyNameU(c) };
  return {
    matched: false,
    uForToken: Math.min(lookupFamilyNameU(c), lookupFamilyNameU(e)),
  };
}

function dobAgreement(a?: string, b?: string): 'match' | 'mismatch' | 'absent' {
  if (!a || !b) return 'absent';
  const ya = a.slice(0, 4);
  const yb = b.slice(0, 4);
  if (ya && yb && ya === yb) return 'match';
  return 'mismatch';
}

export function fellegiSunterMatch(
  customer: Customer,
  entry: WatchlistEntry,
  options: ScoringOptions = {},
): EntityResolutionResultData {
  const cfg = options.config ?? DEFAULT_CONFIG;
  const fields: MatchField[] = [];

  // Given name -----------------------------------------------------------
  const given = bestGivenAgreement(customer, entry, options.normalizeNameToken);
  if (given.matched) {
    const w = matchWeight(cfg.m_given, given.uForToken);
    fields.push({
      fieldName: 'Given name',
      customerValue: customer.givenNames.join(' '),
      watchlistValue: entry.givenNames.join(' '),
      matched: true,
      uProbability: given.uForToken,
      weight: w,
      explanation: `Token "${given.matchedToken}" matches; population frequency u=${given.uForToken.toExponential(2)}`,
    });
  } else {
    const w = missWeight(cfg.m_given, given.uForToken);
    fields.push({
      fieldName: 'Given name',
      customerValue: customer.givenNames.join(' '),
      watchlistValue: entry.givenNames.join(' '),
      matched: false,
      uProbability: given.uForToken,
      weight: w,
      explanation: `No given name token agrees`,
    });
  }

  // Family name ----------------------------------------------------------
  const fam = bestFamilyAgreement(customer, entry, options.normalizeNameToken);
  if (fam.matched) {
    const w = matchWeight(cfg.m_family, fam.uForToken);
    fields.push({
      fieldName: 'Family name',
      customerValue: customer.familyName,
      watchlistValue: entry.familyName,
      matched: true,
      uProbability: fam.uForToken,
      weight: w,
      explanation: `Family name agrees; u=${fam.uForToken.toExponential(2)}`,
    });
  } else {
    const w = missWeight(cfg.m_family, fam.uForToken);
    fields.push({
      fieldName: 'Family name',
      customerValue: customer.familyName,
      watchlistValue: entry.familyName,
      matched: false,
      uProbability: fam.uForToken,
      weight: w,
      explanation: customer.familyName && entry.familyName
        ? `Family names differ`
        : `Family name missing on one side`,
    });
  }

  // DOB ------------------------------------------------------------------
  const dob = dobAgreement(customer.dob, entry.dob);
  if (dob === 'match') {
    const w = matchWeight(cfg.m_dob, cfg.u_dob);
    fields.push({
      fieldName: 'DOB',
      customerValue: customer.dob,
      watchlistValue: entry.dob,
      matched: true,
      uProbability: cfg.u_dob,
      weight: w,
      explanation: `Year of birth agrees`,
    });
  } else if (dob === 'mismatch') {
    const w = missWeight(cfg.m_dob, cfg.u_dob);
    fields.push({
      fieldName: 'DOB',
      customerValue: customer.dob,
      watchlistValue: entry.dob,
      matched: false,
      uProbability: cfg.u_dob,
      weight: w,
      explanation: `Different years of birth`,
    });
  }
  // 'absent' contributes no weight (missing data is not evidence either way).

  // Country --------------------------------------------------------------
  if (customer.country && entry.country) {
    const match = customer.country === entry.country;
    const w = match
      ? matchWeight(cfg.m_country, cfg.u_country)
      : missWeight(cfg.m_country, cfg.u_country);
    fields.push({
      fieldName: 'Country',
      customerValue: customer.country,
      watchlistValue: entry.country,
      matched: match,
      uProbability: cfg.u_country,
      weight: w,
      explanation: match
        ? `Both ${customer.country}`
        : `${customer.country} vs ${entry.country}`,
    });
  }

  // Entity type ----------------------------------------------------------
  if (customer.entityType && entry.entityType) {
    const match = customer.entityType === entry.entityType;
    const w = match
      ? matchWeight(cfg.m_entityType, cfg.u_entityType)
      : missWeight(cfg.m_entityType, cfg.u_entityType);
    fields.push({
      fieldName: 'Entity type',
      customerValue: customer.entityType,
      watchlistValue: entry.entityType,
      matched: match,
      uProbability: cfg.u_entityType,
      weight: w,
      explanation: match
        ? `Both ${customer.entityType.replace('_', ' ')}`
        : `Type mismatch: ${customer.entityType.replace('_', ' ')} vs ${entry.entityType.replace('_', ' ')}`,
    });
  }

  // Passport (only when both present) ------------------------------------
  if (customer.passportNumber && entry.passportNumber) {
    const match = customer.passportNumber === entry.passportNumber;
    const w = match
      ? matchWeight(cfg.m_passport, cfg.u_passport)
      : missWeight(cfg.m_passport, cfg.u_passport);
    fields.push({
      fieldName: 'Passport',
      customerValue: customer.passportNumber,
      watchlistValue: entry.passportNumber,
      matched: match,
      uProbability: cfg.u_passport,
      weight: w,
      explanation: match
        ? `Passport number agrees`
        : `Passport numbers differ`,
    });
  }

  // Sum ------------------------------------------------------------------
  let totalLogOdds = fields.reduce((s, f) => s + f.weight, 0);
  if (options.graphContext) {
    totalLogOdds += options.graphContext.contextScore;
  }
  const matchProbability =
    Math.pow(2, totalLogOdds) / (1 + Math.pow(2, totalLogOdds));
  const verdict: 'FLAG' | 'CLEAR' =
    matchProbability >= FS_THRESHOLD ? 'FLAG' : 'CLEAR';

  // Top decisive factors for the simplified explanation panel.
  const topByMagnitude = [...fields].sort(
    (a, b) => Math.abs(b.weight) - Math.abs(a.weight),
  );
  const verdictWord = verdict === 'FLAG' ? 'FLAG' : 'CLEAR';
  const explanation = `${verdictWord} (P = ${(matchProbability * 100).toFixed(1)}%). Top factors: ${topByMagnitude
    .slice(0, 3)
    .map(
      (f) =>
        `${f.fieldName} ${f.weight >= 0 ? '+' : ''}${f.weight.toFixed(2)}`,
    )
    .join(', ')}.`;

  return {
    fields,
    totalLogOdds,
    matchProbability,
    verdict,
    explanation,
    graphContext: options.graphContext,
  };
}
