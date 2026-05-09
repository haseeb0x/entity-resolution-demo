# **I**mproved **S**creening for **M**uslims

https://entity-resolution-demo.servicesforhaseeb.workers.dev

A demo of *Ism* (Improved Screening for Muslims), showcasing techniques which can be implemented into financial compliance screening software for more accurate entity-matching, and better customer outcomes for individuals with Arabic/Muslim names. Six Arabic & Muslim names are compared with a legacy string-matching screener, showing the structural mechanics by which compliance systems manufacture false positives at scale, leading to debanking of Muslims.

> Full report is available on request, detailing the problem & context, including an exploration of possible technique considered to create this solution. This is a demo of a working solution being implemented into a new payment facilitator. Scroll down to see Disclaimer. 

### The Problem

Muslim and Arabic names get flagged, screened, and debanked at far higher rates than others. The 2023 report by ISPU highlights decades of problems with Banking While Muslim — false arrests of individuals, blocked payments for businesses, and disrupted charitable disbursements from organizations such as LaunchGood.

The volume of false positives across financial compliance is staggering. Regulators read these rates not as caution but as evidence of poor technology. In many ways, the apparent discrimination Muslims face is a symptom of an underlying architectural failure in compliance screening.

Most systems are outdated, still relying on name matching as a proxy for entity resolution. Current systems compare strings — with fuzzy matching, phonetic encoding, edit distance — without resolving whether two records describe the same *entity*. Once flagged, analysts must review the transaction and examine additional attributes. This creates costs and slows economic activity. The false positive rate is therefore proportional to the frequency of matched tokens in the customer population.
### Arab Naming Conventions 

The problem is that these systems are prone to failure with Arabic/Muslim names.

This is partly due to naming patterns in the Arabic language itself, some of which, non-Arab Muslims also adopt. This includes high-frequency given names (Muhammad, Ahmad), patronymic structures (bin/ibn), tribal markers (al-Rashidi/Afridi), nasab chains, and transliteration variability (عبدالله → Abdullah / Abdallah / Abd Allah). These produce structurally higher collision rates in any string-matching system. This is compounded by the fact that since 9/11 and the Patriot Act, a disproportionate share of entries on the OFAC SDN list are Arabic names, many improperly transliterated, carrying high numbers of variations and alternative monikers. Financial institutions face severe penalties for missed matches, which cultivates a culture of over-cultivation. The result: astronomical false positive rates, cascading into screening failures and eventual debanking. Discrimination becomes structural.

| Feature                                                     | Effect on screening                                                                                                                         |
| ----------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------- |
| High-frequency given names (Muhammad, Ahmad, Ali, Abdullah) | Exponentially more partial matches against sanctions lists; "Ahmed" appears on watchlists *and* belongs to millions of legitimate customers |
| Patronyms (bin/ibn + father's namel, Abu)                   | Token-level similarity across unrelated individuals; "Abdullah bin Muhammad" and "Muhammad bin Abdullah" share all tokens                   |
| Tribal/clan names (al-Rashidi, al-Tamimi, Afridi)           | Shared surname components across large populations                                                                                          |
| Nasab chains (multi-generational lineage)                   | Long names with many matchable substrings; more tokens, more collision surface                                                              |
| Transliteration variability                                 | عبدالله → Abdullah / Abdallah / Abd Allah / Abdulla — each a valid romanization                                                             |
| Honorifics and religious titles                             | Additional tokens that may or may not appear on lists                                                                                       |

> As the payment platform switched to the large bank's compliance software, 50 percent of LaunchGood's donors in the United Kingdom were rejected. **When they prodded further, they found that they had "too many Muslim and Arabic names" that were throwing off their software.** Sadly, yet predictably, six months later, they received an email from their account manager at the platform saying their parent bank had made the decision to offboard LaunchGood. Similarly to the previous payment platform, there was no justification, warning, nor opportunity to challenge the decision. — https://www.aljazeera.com/opinions/2023/4/4/banking-as-an-american-muslim-its-a-horror

---
### The Solution Architecture

There are many structural reasons for these compliance failures resulting in adverse outcomes for Muslims. The false positive crisis is at the heart of it, and is a general problem that extends beyond Muslims. It’s fix won’t simply be better name-matching through fuzzy techniques like Jaro-Winkler, or simply ingesting more information (though it would be good start.)

The solution proposed here is a multi-attribute entity matching, with a layered architecture, combining: 

1. Frequency-aware probabilistic weighting, through Fellegi-Sunter (primarily for structured KYC data & sanctions lists)
2. **Named Entity Recognition (NER)** for unstructured adverse media
	1. Transformer-based extraction (BERT-NER, multilingual models) feeding the same entity graph, unifying the data model.
3. Graph-based entity resolution: resolving entities across siloed data and running network analysis on the resolved graph. The frontier is graph, not string. Beneficial ownership, transaction rings, and shell structures only emerge here.
4. Leveraging data-rich payments through the ISO 20022 standard
5. Whitelists with mandatory re-screening on list updates (per OFAC’s 2015 False Hit List Guidance) 

### Demo

The companion prototypes are illustrative implementations of Layers 1, 2, and 4 of the architecture:

| Prototype                     | Layer | Description                                                                                                     |
| ----------------------------- | ----- | --------------------------------------------------------------------------------------------------------------- |
| `multi_attribute_matching.py` | 1     | Multi-attribute entity matching using structured KYC and ISO 20022 fields                                       |
| `fellegi_sunter.py`           | 2     | Probabilistic record linkage with frequency-aware weights, demonstrating downweighting of high-frequency tokens |
| `iso20022_screening.py`       | 1     | Sanctions screening against OFAC SDN using structured ISO 20022 payment data                                    |
| `ner_entity_resolution.py`    | 4     | NER-based entity extraction from adverse media, with disambiguation for Arabic names                            |
| `demo.py`                     | —     | End-to-end combination                                                                                          |

>Note: Not production code. They demonstrate per-layer mechanics on small/medium synthetic datasets. Prototypes were created to illustrate the shift from string matching to entity resolution. 

The result is more accurate screening. Consider two individuals named Ahmed Khan, both Pakistani nationals—one sanctioned, one not. They share a name and nationality, yet differ in every particular that matters. Frequency-aware weighting resolves this ambiguity with precision: high-frequency names like "Ahmed" are down-weighted as contributing minimal discriminatory evidence, while passport numbers, dates of birth, and address matches are up-weighted to carry the bulk of the score. The entity is then resolved through graph resolution. A payment facilitator, lacking the full network context behind these names, nonetheless gains visibility into origin signals—Ahmed Khan's credit card issued by a Canadian bank, for instance—intelligence they would never have surfaced without cross-network screening that draws on what Canadian institutions already know.

#### Scenarios 

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

The Arabic-name problem is the canary. A system that handles Arabic names well is a system whose matching is robust to high-frequency tokens, structured similarity, and transliteration variance — which is to say, a system that resolves entities rather than matches strings.
### Stack 

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

## Disclaimer

> This research was conducted in 2024 while I was working for a payment facilitator serving Muslim communities. A more sophisticated version of these solutions is to be deployed in this payfacs offering. This is a working demo of the work I did for that.

Since this research was completed, the compliance industry has moved aggressively in the direction this analysis pointed toward. Entity resolution is now the standard framing, but leveraging far more data points than this research anticipated. More significantly, the industry has leapfrogged rule-based and classical ML approaches entirely in favor of agentic AI systems: autonomous agents that conduct full alert investigations, write disposition narratives, and clear false positives with explainable audit trails. The prototypes here are not competitive with these commercial solutions that have been made possible by the advancement of foundation models. This demonstrates that the problem facing the compliance industry — and customers with Arabic and Muslim names who were debanked — could be solved by improving screening techniques in compliance software.

- **Illustrative watchlist**: watchlist entries are modelled on the public
  OFAC SDN list. Some reference deceased or widely documented designees;
  others are representative samples. This is not a live screening source.
  Inclusion on the SDN list represents U.S. Treasury designation, not
  criminal conviction.
- **Demonstration only**: the _m_ and _u_ parameters are calibrated for narrative clarity, not empirical fit on a particular population.

---
