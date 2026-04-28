# Entity Resolution Demo

An interactive single-page demo in which six Arabic and Muslim names 
enter a legacy string-matching screener and an entity resolution model side by side
— exposing, scenario by scenario, the structural mechanics by which compliant systems manufacture false positives at scale.

> **Live demo:**: https://entity-resolution-demo.servicesforhaseeb.workers.dev

Full report is available on request, detailing exact statistics, costs, solutions, and specific algorithms.


## Why this exists

False positive rates in compliance screening are a known industry problem —
roughly 95–98% of alerts on common configurations are noise. The cost of
that noise is concentrated unevenly: customers with common Arabic and Muslim
names bear it disproportionately, because the same name-matching algorithms
that work passably on rare Western European names collapse against
population-frequency-scale collisions on names like Muhammad, Ahmad, or
Abdullah.

Entity resolution treats name as one signal among several. Date of birth,
country, entity type, identifying numbers, and graph context all contribute
log-odds weights to a final match probability. Each signal's weight scales
with how informative it is — a Muhammad match is worth less than a Yevgeny
match because Muhammad is far more common in the population.

## What it demonstrates

Six scenarios, each with the same input fed to both systems:

1. **Common name collision.** A Toronto software engineer named Muhammad
   Ahmad Al-Rashidi vs. a sanctioned individual of the same given names in
   Yemen. The legacy system flags. Entity resolution clears.
2. **Vessel vs. person.** A retail customer named Carmela vs. a sanctioned
   Iranian-flagged vessel of the same name. Legacy flags; entity resolution
   clears on entity-type mismatch.
3. **Transliteration variants.** "Abdallah bin Muhammad" and "Abdullah
   Mohammed" — the same Arabic name, different romanizations. Legacy
   _misses_ (false negative). Entity resolution catches it after Arabic
   normalization.
4. **True positive.** A record matching Yevgeny Prigozhin on every field.
   Both systems flag. The point: entity resolution is not silently lenient.
5. **Graph disambiguation.** Two Ali Hassans, same DOB, same country,
   completely disjoint counterparty networks. Legacy flags; entity
   resolution clears on graph context.
6. **Custom input.** Type a name, DOB, and country. Run both matchers.

## How it works

- **Stack:** Vite + React 18 + TypeScript + Tailwind v3. No backend, no API,
  no auth — every line runs in the browser.
- **Matching:** A hand-rolled Jaro–Winkler implementation for the legacy
  baseline, and a hand-rolled Fellegi–Sunter probabilistic record linkage
  model for entity resolution. Per-field _m_ and _u_ parameters are
  documented in `src/lib/matching/fellegi-sunter.ts`. Arabic name
  canonicalization is in `src/lib/matching/arabic-normalize.ts`. Graph
  context (Scenario 5 only) is in `src/lib/matching/graph-context.ts`.
- **Data:** ~28 illustrative watchlist entries modelled on the public
  [OFAC SDN list](https://sanctionslist.ofac.treas.gov), plus six synthetic
  customer records and a small entity graph for Scenario 5.

The math is exposed: every scenario's mechanism panel has a "View the full
math" toggle that shows the Fellegi–Sunter weight table — every field, its
_m_ / _u_ values, and its contribution to the final log-odds.

## Disclaimers

- **Synthetic customers.** All customer records are invented. No real persons
  are described.
- **Illustrative watchlist.** Watchlist entries are modelled on the public
  OFAC SDN list. Some reference deceased or widely documented designees;
  others are representative samples. This is not a live screening source.
  Inclusion on the SDN list represents U.S. Treasury designation, not
  criminal conviction.
- **Demonstration only.** This is a teaching demo, not a compliance system.
  The _m_ and _u_ parameters are calibrated for narrative clarity, not
  empirical fit on a particular population.


## License

[MIT](LICENSE).
