# Entity Resolution as the Fix for Compliance Screening's False Positive Crisis

Muslim and Arabic names get flagged, screened, and debanked at far higher rates than others. The 2023 report by ISPU highlights decades of problems with Banking While Muslim — false arrests of individuals, blocked payments for businesses, and disrupted charitable disbursements from organizations such as LaunchGood.

The volume of false positives across financial compliance is staggering. Regulators read these rates not as caution but as evidence of poor technology. In many ways, the apparent discrimination Muslims face is a symptom of an underlying architectural failure in compliance screening.

Most systems are outdated, still relying on name matching as a proxy for entity resolution. Current systems compare strings — with fuzzy matching, phonetic encoding, edit distance — without resolving whether two records describe the same *entity*. Once flagged, analysts must review the transaction and examine additional attributes. This creates costs and slows economic activity. The false positive rate is therefore proportional to the frequency of matched tokens in the customer population.

The problem is that these systems are prone to failure with Arabic/Muslim names.

This is partly due to naming patterns in the Arabic language itself, some of which, non-Arab Muslims also adopt. High-frequency given names (Muhammad, Ahmad), patronymic structures (bin/ibn), tribal markers (al-Rashidi/Afridi), nasab chains, and transliteration variability (عبدالله → Abdullah / Abdallah / Abd Allah) produce structurally higher collision rates in any string-matching system. This is compounded by the fact that since 9/11 and the Patriot Act, a disproportionate share of entries on the OFAC SDN list are Arabic names — many improperly transliterated, carrying high numbers of variations and alternative monikers. Financial institutions face severe penalties for missed matches, which cultivates a culture of over-flagging. The result: astronomical false positive rates, cascading into screening failures and eventual debanking. Discrimination becomes structural.

| Feature | Effect on screening |
| --- | --- |
| High-frequency given names (Muhammad, Ahmad, Ali, Abdullah) | Exponentially more partial matches against sanctions lists; "Ahmed" appears on watchlists *and* belongs to millions of legitimate customers |
| Patronyms (bin/ibn + father's name) | Token-level similarity across unrelated individuals; "Abdullah bin Muhammad" and "Muhammad bin Abdullah" share all tokens |
| Tribal/clan names (al-Rashidi, al-Tamimi) | Shared surname components across large populations |
| Nasab chains (multi-generational lineage) | Long names with many matchable substrings; more tokens, more collision surface |
| Transliteration variability | عبدالله → Abdullah / Abdallah / Abd Allah / Abdulla — each a valid romanization |
| Honorifics and religious titles | Additional tokens that may or may not appear on lists |

https://www.aljazeera.com/opinions/2023/4/4/banking-as-an-american-muslim-its-a-horror

> As the payment platform switched to the large bank's compliance software, 50 percent of LaunchGood's donors in the United Kingdom were rejected. **When they prodded further, they found that they had "too many Muslim and Arabic names" that were throwing off their software.** Sadly, yet predictably, six months later, they received an email from their account manager at the platform saying their parent bank had made the decision to offboard LaunchGood. Similarly to the previous payment platform, there was no justification, warning, nor opportunity to challenge the decision.

---

The financial compliance industry's false positive crisis is not a calibration problem. It is a structural consequence of *name matching* standing in for *entity resolution*. The fix is not better fuzzy matching. It is a layered architecture combining structured payment data (ISO 20022), probabilistic record linkage (Fellegi-Sunter), graph-based entity resolution, and explainable ML — deployed against the right list at the right point in the workflow.

The proposed architecture spans five layers: ISO 20022 parsing, an entity resolution layer (Fellegi-Sunter with frequency-aware weights), a graph layer (basic UBO and counterparty resolution), a screening layer (multi-list, versioned), and a review layer (analyst workflow with explainability).

The key solution proposed in the report is multi-attribute entity matching on structured KYC data, with Fellegi-Sunter probabilistic weighting. For unstructured adverse media, NER-based entity extraction is proposed. Prototypes were created to illustrate the shift from string matching to entity resolution.

**Graph-based entity resolution.** What Quantexa is doing at HSBC and Standard Chartered: resolving entities across siloed data and running network analysis on the resolved graph. The frontier is graph, not string. Beneficial ownership, transaction rings, and shell structures only emerge here.

- **NER for adverse media.** Transformer-based extraction (BERT-NER, multilingual models) feeding the same entity graph, unifying the data model.
- **Risk tiering and verified whitelists.** Tier-specific thresholds; whitelists with mandatory re-screening on list updates (per OFAC's 2015 False Hit List Guidance).
- **Model risk management and explainability.** Per-field weight decomposition (Fellegi-Sunter) and inspectable graph resolution — defensible to regulators in a way deep learning alone is not.

---

The architecture is general. Its disproportionate benefit for Arabic and Muslim names is a consequence of three properties:

1. **Frequency-aware weights (Layer 2)** systematically downweight matches on high-frequency given names. "Muhammad" matching contributes minimal evidence; passport, DOB, and address matches contribute the bulk of the score. This directly inverts the failure mode where common given names dominate scoring.
2. **Multi-attribute matching on structured ingress (Layer 1)** means the system rarely makes a decision on name alone. ISO 20022 carries DOB, place of birth, nationality, and address as discrete fields. A "Muhammad" who shares a name with a sanctioned individual but has a different DOB and nationality is not a match.
3. **Graph-based disambiguation (Layer 3)** distinguishes between the *millions of legitimate Muhammads* in a customer population and the *specific Muhammad on a list* by their respective network contexts. Pure string matching cannot make this distinction; graph resolution is built for it.

The Arabic-name problem is the canary. A system that handles Arabic names well is a system whose matching is robust to high-frequency tokens, structured similarity, and transliteration variance — which is to say, a system that resolves entities rather than matches strings.

---

## Prototypes (Illustrative)

The companion prototypes are illustrative implementations of Layers 1, 2, and 4 of the architecture:

| Prototype | Layer | Description |
| --- | --- | --- |
| `multi_attribute_matching.py` | 1 | Multi-attribute entity matching using structured KYC and ISO 20022 fields |
| `fellegi_sunter.py` | 2 | Probabilistic record linkage with frequency-aware weights, demonstrating downweighting of high-frequency tokens |
| `iso20022_screening.py` | 1 | Sanctions screening against OFAC SDN using structured ISO 20022 payment data |
| `ner_entity_resolution.py` | 4 | NER-based entity extraction from adverse media, with disambiguation for Arabic names |
| `demo.py` | — | End-to-end combination |

These are not production code. They demonstrate per-layer mechanics on small synthetic datasets. Layer 3 (graph) is the natural next prototype and the one that would most clearly distinguish a serious build from a literature review.

## Disclaimer

This research was conducted in 2024 while I was working for a payment facilitator serving Muslim communities.

Since this research was completed, the compliance industry has moved aggressively in the direction this analysis pointed toward. Entity resolution is now the standard framing, but leveraging far more data points than this research imagined. More significantly, the industry has leapfrogged rule-based and classical ML approaches entirely in favor of agentic AI systems: autonomous agents that conduct full alert investigations, write disposition narratives, and clear false positives with explainable audit trails. The prototypes here are not competitive with these commercial solutions. They were never intended to be. They demonstrate that the problem facing the compliance industry — and customers with Arabic and Muslim names who were debanked — could be solved by improving screening techniques in compliance software.

Full report is available on request, detailing exact statistics, costs, solutions, and specific algorithms.
