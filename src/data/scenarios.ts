import type { Scenario } from '@/types';

export const scenarios: Scenario[] = [
  {
    id: 's1_common_name',
    label: '1. Common name collision',
    description:
      'A Toronto software engineer shares a very common Arabic given-name pair with a sanctioned individual in Yemen.',
    customerId: 'cust_muhammad_toronto',
    watchlistEntryId: 'ofac_muhammad_ahmad',
    teachingPoint:
      'Name-token frequency matters. Multi-attribute matching prevents the most common false positive type.',
    showGraph: false,
  },
  {
    id: 's2_vessel_vs_person',
    label: '2. Vessel vs. person',
    description:
      'A retail customer named Carmela collides with a sanctioned Iranian-flagged vessel of the same name.',
    customerId: 'cust_carmela_hernandez',
    watchlistEntryId: 'ofac_vessel_carmela',
    teachingPoint:
      'Entity type is a first-class field that legacy name-only systems collapse.',
    showGraph: false,
  },
  {
    id: 's3_transliteration',
    label: '3. Transliteration variants',
    description:
      'A Saudi customer romanized as "Abdallah bin Muhammad" — the same Arabic name as the listed "Abdullah Mohammed" — written differently.',
    customerId: 'cust_abdallah_riyadh',
    watchlistEntryId: 'ofac_abdullah_mohammed',
    teachingPoint:
      'The same transliteration variability that causes false positives also causes false negatives. Arabic normalization fixes both directions.',
    showGraph: false,
  },
  {
    id: 's4_true_positive',
    label: '4. True positive',
    description:
      'A customer record whose attributes match a listed designee on every field. The system must not be silently lenient.',
    customerId: 'cust_prigozhin_dup',
    watchlistEntryId: 'ofac_yevgeny_prigozhin',
    teachingPoint:
      'Entity resolution is not "more lenient" — it correctly flags real matches, including when a passport number agrees.',
    showGraph: false,
  },
  {
    id: 's5_graph_disambiguation',
    label: '5. Graph disambiguation',
    description:
      'Two people share name, birth year, and country — but their counterparty networks have no overlap at all.',
    customerId: 'cust_ali_hassan_montreal',
    watchlistEntryId: 'ofac_ali_hassan_hezbollah',
    teachingPoint:
      'When name-and-attribute matching is not enough, graph context is what disambiguates. This is the only scenario that renders the network panel.',
    showGraph: true,
  },
  {
    id: 's6_custom',
    label: '6. Custom input',
    description:
      'Type a name, DOB, and country. The same comparison runs against the bundled watchlist.',
    customerId: '',
    watchlistEntryId: '',
    teachingPoint:
      'The same matching logic applies to arbitrary input. "No matches found" is itself a useful outcome.',
    showGraph: false,
  },
];

export function findScenario(id: string): Scenario | undefined {
  return scenarios.find((s) => s.id === id);
}
