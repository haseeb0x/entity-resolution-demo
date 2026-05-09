# Entity Resolution Demo — Project Knowledge

## What this is

An interactive single-page demo that shows how entity resolution reduces false positives in compliance/sanctions screening, especially for Arabic/Muslim names. It compares a legacy name-only matcher against a Fellegi-Sunter probabilistic model with graph context. Live at Cloudflare Pages, auto-deploys from `main`.

The owner's position: this is a **screening engine demonstration**, not a teaching toy. Remove "portfolio piece" language. The footer reads: "This is a demonstration of a screening engine, not to be used in production."

## Stack

- React 18 + TypeScript + Vite
- Tailwind CSS v3 + shadcn/ui (stone palette, `#FAFAF9` bg, `#1C1917` text)
- No backend — all matching runs client-side
- Cloudflare Pages deploy (build: `npm run build`, output: `dist`)
- Git repo: `github.com/haseeb0x/entity-resolution-demo`
- Git config: user.name="demo", user.email="demo@local"

## Architecture

### Two matchers, side by side

1. **Legacy** (`src/lib/matching/legacy.ts`): Jaro-Winkler on `fullName` only. Threshold 0.85. Flags on name similarity alone — this is the baseline that produces false positives.

2. **Entity Resolution** (`src/lib/matching/fellegi-sunter.ts`): Fellegi-Sunter probabilistic record linkage. Per-field log-odds weights (given name, family name, DOB, country, entity type) summed and passed through sigmoid. Threshold 50%. Optionally includes graph context score.

### Key files

| File | Purpose |
|---|---|
| `src/lib/matching/fellegi-sunter.ts` | Core FS math. m/u probabilities, log2 weights, sigmoid. |
| `src/lib/matching/legacy.ts` | Jaro-Winkler, name-only. Must NOT read DOB/country. |
| `src/lib/matching/graph-context.ts` | Graph penalty: `-3.5 * min(customerNeighbors, watchlistNeighbors)` for zero shared neighbors. |
| `src/lib/matching/arabic-normalize.ts` | Alias groups + prefix stripping. Checks alias map BEFORE stripping to avoid mangling "Ali" → "i". |
| `src/lib/matching/screen.ts` | Sweeps both matchers across full watchlist. Returns `pairedEntityResolution` — ER result for the SAME entry legacy flagged. |
| `src/lib/matching/smoke-test.ts` | Verifies 5 scenarios + 20-person database. Run with `npx tsx -e "import { runSmokeTest } from './src/lib/matching/smoke-test'; runSmokeTest();"` |
| `src/data/watchlist.ts` | ~50 OFAC SDN entries (10 Arabic PNs, 5 Western PNs, 5 vessels, 5 orgs, 20 collision targets, 13 shells). |
| `src/data/customer-database.ts` | 20 synthetic Muslim customer profiles with PSP-relevant attributes. |
| `src/data/graph-data.ts` | ~160 nodes, ~130 edges. Customer → employer/bank/merchant/utility. Watchlist → sanctioned orgs/shells. |
| `src/data/name-frequencies.ts` | u-probabilities for ~50 names. DEFAULT_GIVEN_NAME_U=0.005, DEFAULT_FAMILY_NAME_U=0.001. |
| `src/data/scenarios.ts` | 6 scenario definitions. s1-s5 are curated pairs. s6 is the 20-person database. |
| `src/data/customers.ts` | 5 original scenario customers (separate from the 20-person DB). |
| `src/components/CustomerSelector.tsx` | Scenario 6 UI — grid of 20 profiles, shows both cards + mechanism + graph. |
| `src/components/Demo.tsx` | Orchestrates scenario tabs. |
| `src/components/EntityResolutionResult.tsx` | ER card: "Fellegi-Sunter threshold 50%, Matched against, Match probability, verdict". |
| `src/components/MechanismPanel.tsx` | Expandable weight table showing per-field m/u/weight. |
| `src/components/GraphPanel.tsx` | Network visualization for any customer-watchlist pair. |

### The 6 scenarios

| # | ID | Legacy | ER | Teaching point |
|---|---|---|---|---|
| 1 | s1_common_name | FLAG | CLEAR | Common name collision (Muhammad Ahmad) |
| 2 | s2_vessel_vs_person | FLAG | CLEAR | Entity type mismatch (person vs vessel) |
| 3 | s3_transliteration | CLEAR | FLAG | Arabic normalization catches variant spelling |
| 4 | s4_true_positive | FLAG | FLAG | True positive — all attributes match |
| 5 | s5_graph_disambiguation | FLAG | CLEAR | Graph context flips: 8 neighbors each, 0 shared |
| 6 | s6_database | — | — | 20-person database sweep |

### The 20-person customer database

All 20 are fictional Muslims whose names exactly match an OFAC SDN entry (JW=1.00). All must produce: legacy=FLAG, ER=CLEAR. Current probabilities range 2%–35%.

Profiles span: DevOps Engineer (Shopify), Teacher, Junior Doctor (NHS), Financial Analyst (JPMorgan), Senior Accountant (PwC), Assembly Line Worker (Ford), Petroleum Engineer (BP), MSc Student (UCL), Retail Manager (Target), Dentist, Pharmacist, Software Developer (SAP), Policy Analyst (Gov Canada), Data Scientist (BBC), UX Designer (Spotify), Investment Analyst (BNP Paribas), Architect (SOM), IT Consultant (Accenture), Civil Engineer (AECOM), Medical Resident (King's College).

**Do not reintroduce occupation bias.** The owner explicitly flagged having too many delivery drivers/restaurant owners as prejudiced.

## Critical calibration details

### Graph penalty formula
```
contextScore = -3.5 * Math.min(customerNeighbors.length, watchlistNeighbors.length)
```
- Scenario 5 entities have 8 neighbors each → penalty = -28 → flips P from ~100% to 8.3%
- 20-customer DB entries have 4 customer / 2 watchlist neighbors → penalty = -7 → produces 2%–35%
- If one side has 0 neighbors, contextScore = 0 (no graph evidence)

### Arabic normalizer gotcha
`arabicNormalize` MUST check the alias map before prefix-stripping. Otherwise "Ali" → strip "Al" → "i" → default u=0.001 → inflated weight. The fix: early-return on alias match before calling `stripPrefix`.

### pairedEntityResolution (not bestEntityResolution)
`screenCustomer()` returns `pairedEntityResolution` — the ER result for the SAME watchlist entry that legacy flagged. DO NOT use highest-probability-across-all-entries — graph context crushes intended targets so far below zero that unrelated entries without graph data (e.g., John Smith) end up with higher probability. This was a real bug that showed 16/20 customers matched against John Smith.

### DOB collision: ofac_yusuf_ali
This entry's DOB was changed from 1985 to 1975 to avoid matching DB Yusuf Ali's DOB. With the reduced graph penalty (-7 instead of -28), a DOB match would push Yusuf Ali above the 50% threshold.

## Bugs found and fixed (don't reintroduce)

1. **Ali → i normalization bug**: `stripPrefix` regex `^al-?` matched "Ali". Fix: check alias map first.
2. **John Smith pairing bug**: ER picked globally highest probability, not the legacy-flagged entry. Fix: `pairedEntityResolution`.
3. **Yusuf Ali DOB match**: ofac_yusuf_ali DOB coincidentally matched customer DOB 1985. Fix: changed to 1975.
4. **Graph context 0.0% problem**: Fixed -28 penalty crushed all 20 customers to 0.0%. Fix: scale by min(neighbors).
5. **Occupation bias**: Early version had 8/20 profiles as delivery drivers/taxi drivers/restaurant owners. Owner called this out as prejudice. Fix: changed to professional roles.
6. **ER card inconsistency**: Scenario 6 showed a simplified "No hit" card instead of the full Fellegi-Sunter card. Fix: always render EntityResolutionResult using pairedEntityResolution.

## Production gaps (owner-approved roadmap, in priority order)

1. **Fuzzy name matching within FS** — token-level Jaro-Winkler inside the FS framework instead of binary match/no-match
2. **Date-distance scoring** — graduated penalty instead of binary year-match
3. **Passport field comparison** — most discriminating single field, already in type system
4. **Expand frequency table** — derive u-probabilities from census/SDN population data
5. **Alias expansion** — real SDN entries have 5-15 aliases each
6. **Geographic proximity scoring** — US/CA is a softer mismatch than US/AF

## Commands

```bash
npm run dev          # Dev server on :5173
npm run build        # Production build (target <500KB, currently ~310KB)
npx tsc --noEmit     # Type check

# Smoke test (5 scenarios + 20-person DB)
npx tsx -e "import { runSmokeTest } from './src/lib/matching/smoke-test'; runSmokeTest();"

# Diagnostic: check all 20 customer pairings
npx tsx -e "import { customerDatabase } from './src/data/customer-database'; import { screenCustomer } from './src/lib/matching/screen'; for (const c of customerDatabase) { const r = screenCustomer(c); console.log(c.fullName, r.pairedEntityResolution?.bestEntry.fullName, (r.pairedEntityResolution?.result.matchProbability*100).toFixed(1)+'%'); }"
```

## Style rules

- Stone palette, not shadows — borders only
- Muted red `#B91C1C` for FLAG, muted green `#15803D` for CLEAR
- No emojis in code or UI
- Footer: "This is a demonstration of a screening engine, not to be used in production."
- No "teaching demo", "portfolio piece", or "Read more" sections
