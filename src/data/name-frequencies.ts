// Approximate population frequencies (u-probabilities) for given names and
// family names. These are used in the Fellegi–Sunter weight calculation:
// matched fields with high u contribute small positive weight (the match is
// not informative because the name is common), while matched fields with low
// u contribute large positive weight. Values here are demonstrative — real
// systems would derive them from the watchlist + customer base population.
//
// Sources of inspiration: published anthroponymic frequency studies for
// Arabic, Russian, and Hispanic names. The exact values are illustrative.

export const givenNameFrequencies: Record<string, number> = {
  // Arabic / Muslim given names — high frequency.
  muhammad: 0.04,
  mohammad: 0.04,
  mohammed: 0.04,
  ahmad: 0.025,
  ahmed: 0.025,
  ali: 0.02,
  abdullah: 0.015,
  abdallah: 0.012,
  hassan: 0.012,
  omar: 0.008,
  yusuf: 0.006,
  ibrahim: 0.005,
  khaled: 0.005,
  saif: 0.003,
  // Western European given names.
  john: 0.015,
  james: 0.012,
  william: 0.010,
  david: 0.010,
  // Russian / Eastern European.
  vladimir: 0.0012,
  viktor: 0.0009,
  dmitri: 0.0005,
  dmitry: 0.0005,
  yevgeny: 0.00012,
  ramzan: 0.00005,
  // Additional Arabic / Muslim given names.
  fatima: 0.015,
  noor: 0.008,
  ismail: 0.005,
  ayman: 0.003,
  // Hispanic.
  jose: 0.015,
  maria: 0.020,
  carmela: 0.001,
};

export const familyNameFrequencies: Record<string, number> = {
  // Arabic / Muslim family names.
  'al-rashidi': 0.0001,
  alrashidi: 0.0001,
  rashidi: 0.0002,
  nasrallah: 0.0008,
  'al-zawahiri': 0.00005,
  zawahiri: 0.00005,
  'al-bashir': 0.0005,
  ahmad: 0.025,
  ahmed: 0.025,
  mohammed: 0.04,
  muhammad: 0.04, // canonical post-normalization
  mohammad: 0.04,
  abdullah: 0.015, // canonical post-normalization
  abdallah: 0.012,
  hassan: 0.012,
  ali: 0.02,
  // Additional Arabic / Muslim family names.
  khan: 0.015,
  ibrahim: 0.005,
  rahman: 0.008,
  yusuf: 0.006,
  omar: 0.008,
  // Russian.
  prigozhin: 0.000001,
  utkin: 0.0001,
  bout: 0.000001,
  kadyrov: 0.00001,
  // Hispanic.
  hernandez: 0.005,
  garcia: 0.008,
  rodriguez: 0.007,
};

export const DEFAULT_GIVEN_NAME_U = 0.005;
export const DEFAULT_FAMILY_NAME_U = 0.001;

const norm = (s: string) => s.toLowerCase().trim();

export function lookupGivenNameU(token: string): number {
  return givenNameFrequencies[norm(token)] ?? DEFAULT_GIVEN_NAME_U;
}

export function lookupFamilyNameU(token: string): number {
  return familyNameFrequencies[norm(token)] ?? DEFAULT_FAMILY_NAME_U;
}
