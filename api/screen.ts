// POST /api/screen
//
// Cloudflare Pages Function that wraps the entity-resolution engine.
// Accepts a customer record, sweeps it against the built-in OFAC watchlist
// sample, and returns the legacy + ER results with full weight breakdown.
//
// This file is bundled by build-api.mjs into functions/api/screen.js
// so that all @/ path aliases are resolved at build time.

import type {
  EntityType,
  EntityResolutionResultData,
  LegacyResult,
} from '@/types';
import { watchlist } from '@/data/watchlist';
import { graphData } from '@/data/graph-data';
import { arabicNormalize } from '@/lib/matching/arabic-normalize';
import { computeGraphContext } from '@/lib/matching/graph-context';
import { fellegiSunterMatch, FS_THRESHOLD } from '@/lib/matching/fellegi-sunter';
import { legacyMatch, LEGACY_THRESHOLD } from '@/lib/matching/legacy';

// ── Request / response shapes ────────────────────────────────────────

interface ScreenRequest {
  fullName: string;
  givenNames?: string[];
  familyName?: string;
  dob?: string;
  country?: string;
  entityType?: EntityType;
  /** Optional graph neighbor IDs (employer, bank, merchant, etc.) */
  counterparties?: string[];
}

interface FieldResult {
  field: string;
  customerValue: string | undefined;
  watchlistValue: string | undefined;
  matched: boolean;
  weight: number;
}

interface ScreenResponse {
  customer: string;
  matchedAgainst: string;
  matchedAgainstId: string;
  matchedAgainstSource: string;
  matchedAgainstProgram: string | undefined;
  legacy: {
    similarity: number;
    threshold: number;
    verdict: 'FLAG' | 'CLEAR';
  };
  entityResolution: {
    matchProbability: number;
    totalLogOdds: number;
    threshold: number;
    verdict: 'FLAG' | 'CLEAR';
    fields: FieldResult[];
    graphContribution: number | null;
    explanation: string;
  };
}

interface ErrorResponse {
  error: string;
  details?: string;
}

// ── Helpers ──────────────────────────────────────────────────────────

function parseName(fullName: string): { givenNames: string[]; familyName: string } {
  const parts = fullName.trim().split(/\s+/);
  if (parts.length === 1) return { givenNames: parts, familyName: '' };
  return {
    givenNames: parts.slice(0, -1),
    familyName: parts[parts.length - 1]!,
  };
}

function corsHeaders(): Record<string, string> {
  return {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'POST, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type',
    'Content-Type': 'application/json',
  };
}

function jsonResponse(body: ScreenResponse | ErrorResponse, status = 200): Response {
  return new Response(JSON.stringify(body, null, 2), {
    status,
    headers: corsHeaders(),
  });
}

// ── Handler ──────────────────────────────────────────────────────────

export const onRequestOptions: PagesFunction = async () => {
  return new Response(null, { status: 204, headers: corsHeaders() });
};

export const onRequestPost: PagesFunction = async ({ request }) => {
  let body: ScreenRequest;
  try {
    body = await request.json() as ScreenRequest;
  } catch {
    return jsonResponse({ error: 'Invalid JSON body' }, 400);
  }

  if (!body.fullName || typeof body.fullName !== 'string') {
    return jsonResponse(
      { error: 'Missing required field: fullName', details: 'Provide at least { "fullName": "Ahmad Khan" }' },
      400,
    );
  }

  // Build a synthetic customer entity from the request.
  const { givenNames, familyName } = body.givenNames && body.familyName
    ? { givenNames: body.givenNames, familyName: body.familyName }
    : parseName(body.fullName);

  const customer = {
    id: '__api_input__',
    fullName: body.fullName.trim(),
    givenNames,
    familyName,
    dob: body.dob,
    country: body.country ?? '',
    entityType: (body.entityType ?? 'natural_person') as EntityType,
    counterparties: body.counterparties,
    isSynthetic: true as const,
    transactionDescription: '',
  };

  // Sweep: legacy picks best by name similarity, ER evaluates that same entry.
  let bestLegacy: { entry: (typeof watchlist)[number]; result: LegacyResult } | null = null;

  for (const entry of watchlist) {
    if (customer.entityType === 'natural_person' && entry.entityType !== 'natural_person') {
      continue;
    }
    const lg = legacyMatch(customer, entry);
    if (!bestLegacy || lg.similarity > bestLegacy.result.similarity) {
      bestLegacy = { entry, result: lg };
    }
  }

  if (!bestLegacy || bestLegacy.result.similarity < LEGACY_THRESHOLD) {
    return jsonResponse({
      error: 'No match',
      details: `No watchlist entry exceeded the ${LEGACY_THRESHOLD} Jaro-Winkler similarity threshold for "${body.fullName}".`,
    }, 200);
  }

  // Compute ER for the same entry legacy flagged.
  const entry = bestLegacy.entry;
  const graphCtx = computeGraphContext(customer, entry, graphData);
  const useGraph = graphCtx.customerNeighbors.length > 0 && graphCtx.watchlistNeighbors.length > 0;
  const er: EntityResolutionResultData = fellegiSunterMatch(customer, entry, {
    normalizeNameToken: arabicNormalize,
    graphContext: useGraph ? graphCtx : undefined,
  });

  const response: ScreenResponse = {
    customer: customer.fullName,
    matchedAgainst: entry.fullName,
    matchedAgainstId: entry.id,
    matchedAgainstSource: entry.listSource,
    matchedAgainstProgram: entry.sanctionsProgram,
    legacy: {
      similarity: Number(bestLegacy.result.similarity.toFixed(4)),
      threshold: LEGACY_THRESHOLD,
      verdict: bestLegacy.result.verdict,
    },
    entityResolution: {
      matchProbability: Number(er.matchProbability.toFixed(6)),
      totalLogOdds: Number(er.totalLogOdds.toFixed(3)),
      threshold: FS_THRESHOLD,
      verdict: er.verdict,
      fields: er.fields.map((f) => ({
        field: f.fieldName,
        customerValue: f.customerValue,
        watchlistValue: f.watchlistValue,
        matched: f.matched,
        weight: Number(f.weight.toFixed(3)),
      })),
      graphContribution: useGraph ? graphCtx.contextScore : null,
      explanation: er.explanation,
    },
  };

  return jsonResponse(response);
};
