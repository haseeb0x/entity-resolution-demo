# Executive summary

**The problem.** Sanctions screening at most banks runs on name-matching
algorithms that compare two names with a string-similarity score and flag
above a fixed threshold. That works against rare names. It collapses
against common ones — and the collapse is concentrated on customers with
common Arabic and Muslim names, where population-frequency-scale
collisions are the rule, not the exception.

**The cost.** Roughly 95–98% of alerts are false positives. Each false
positive costs L1 review time (cumulatively, hundreds of millions of
dollars per year industry-wide) and pushes alert fatigue. Worse, the
distribution is uneven: a customer named Muhammad Ahmad gets reviewed at
several times the rate of a customer named John Smith for the same
underlying activity.

**The fix.** Entity resolution treats name as one signal among several. A
probabilistic record-linkage model (Fellegi–Sunter) sums log-odds
contributions from name, DOB, country, entity type, identifying numbers,
and graph context, weighting each field by how informative it is. A common
name match contributes a small positive weight; a rare name match
contributes a large one; attribute disagreements (DOB, country, entity
type) contribute proportionally large negative weights.

**What this demo shows.** Six small scenarios in which the legacy approach
and entity resolution disagree, with the math visible for every decision.
The scenarios cover the false-positive case (common Arabic name collision),
the entity-type case (vessel vs. person), the false-negative case
(transliteration variants), the true-positive case (full attribute match),
the graph-disambiguation case (same name + DOB + country, disjoint
networks), and a custom input mode.

**What it does not claim.** This is a demonstration, not a benchmark. The
_m_ and _u_ parameters are calibrated for narrative clarity. A production
system would derive them empirically from labelled data and the actual
customer + watchlist populations.

**Why it matters for fintech.** The technical fix here is well-known in
the record-linkage literature. The reason it isn't deployed everywhere is
inertia — most legacy screening systems are difficult to replace
incrementally. A practical path: deploy entity resolution as an alert
post-processor first (re-scoring legacy alerts to suppress the obvious
false positives), then migrate primary screening over time. The savings
on the post-processor stage alone justify the work.
