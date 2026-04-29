## The Fellegi–Sunter model

The probabilistic record-linkage framework introduced by Fellegi and
Sunter in 1969 is the standard alternative. The model treats name as one
field among several and computes, for each field, a log-odds weight:

- **Agreement weight:** when the field agrees,
  `weight = log2(m / u)`
- **Disagreement weight:** when the field disagrees,
  `weight = log2((1 - m) / (1 - u))`

where `m` is the probability of agreement on that field given the two
records describe the same entity, and `u` is the probability of agreement
given they describe different entities (the population frequency). The
total log-odds is the sum across fields; the match probability is the
sigmoid of the total.

The crucial property: weight scales with informativeness. A "Muhammad"
match has a high `u` (population frequency of the name), so its
agreement weight is small. A "Yevgeny" match has a low `u`, so its
agreement weight is large. The model is doing the population-frequency
correction the threshold-based matcher cannot.

The demo implements this from scratch in
`src/lib/matching/fellegi-sunter.ts`. The `m` parameters are calibrated
per field (`m_dob = 0.99` because DOB rarely disagrees between same-person
records; `m_given = 0.99` because canonicalized names rarely disagree).
The `u` parameters for names come from a small frequency table modelled on
published anthroponymic studies; for other fields they are derived from
the watchlist + customer population structure.

## The role of canonicalization

The Fellegi–Sunter model assumes field-level agreement is a binary signal.
For names, this requires a canonicalization step that maps spelling
variants to a single canonical form before comparison. The demo
implements a small Arabic name canonicalizer
(`src/lib/matching/arabic-normalize.ts`) that handles the variants
relevant to the demo's scenarios. A production system would use a more
comprehensive transliteration table (BGN/PCGN, ALA-LC) and likely a
trained model that handles edge cases the lookup misses.

Scenario 3 of the demo illustrates the asymmetric value of
canonicalization: it not only reduces false positives ("Abdallah" and
"Abdullah" don't get treated as different names) but also reduces false
negatives (a customer ID romanized one way and a watchlist entry
romanized another way are correctly recognized as the same Arabic name).

## 5. Graph context

Even with frequency-aware name weighting, some scenarios escape attribute
matching. The demo's Scenario 5 is the canonical case: two people share
name, DOB, and country, but their counterparty networks have no overlap
at all. The Fellegi–Sunter model on attribute matching alone produces a
high match probability (P ≈ 1.0 from the field weights). The graph
context module recognizes that the absence of any shared neighbor is
itself evidence — high-confidence "different person, same identifiers"
signal — and contributes a strong negative log-odds adjustment that
flips the verdict from FLAG to CLEAR.

In production, graph context can come from many sources: known-good
employer relationships, observed counterparty networks, geographic
co-occurrence, shared addresses, account ownership graphs, and so on.
The pattern is the same in each case: when name + attributes match but
graph signals don't align, that disagreement carries weight.

## 6. Practical migration

The technical case for entity resolution in compliance screening is
well-established. The deployment case is harder, because most legacy
screening systems are deeply integrated with sanctions feeds, alert
queues, audit trails, and case-management tooling. A wholesale rip-and-
replace migration is rarely feasible.

A practical path:

1. **Stage 1 — Alert post-processor.** Deploy entity resolution as an
   alert re-scorer that ingests legacy alerts and computes a probability
   for each. Below a configurable threshold, the alert is auto-cleared
   with a documented audit trail; above, it routes to L1 review as
   before. This change is reversible, additive, and produces measurable
   savings on day one.
2. **Stage 2 — Pre-screening filter.** Use entity resolution to suppress
   pairs the legacy system would flag but that entity resolution is
   confident are safe. Coverage stays the same; alert volume drops.
3. **Stage 3 — Primary scoring.** With confidence built up over Stages 1
   and 2, replace the legacy similarity-and-threshold matcher entirely.

The model risk-management story for each stage is different and matters:
Stage 1 changes nothing about coverage and only improves analyst
efficiency, so the bar is low. Stage 3 replaces the screening primitive
itself and requires deeper validation against a labelled holdout.

## 7. What the demo doesn't show

- **Sanctions feed ingestion** — real systems must consume OFAC, UN, EU,
  HMT, and other lists, deduplicate across them, and handle list
  versioning.
- **Alert queue and case management** — investigation workflows, tier-2
  escalation, regulator-facing audit trails.
- **Adverse media screening** — name-matching against news corpora is its
  own challenge, with its own false positive distribution.
- **PEP screening** — politically-exposed-person lists overlap with
  sanctions but have different regulatory requirements.
- **Bias monitoring** — distributional analysis of alert and clearance
  rates across customer demographic groups.

Each of these is a substantial body of work. The demo is deliberately
narrow: it shows the core matching problem and the core matching fix.
