// Approximate population frequencies (u-probabilities) for given names and
// family names. These are used in the Fellegi–Sunter weight calculation:
// matched fields with high u contribute small positive weight (the match is
// not informative because the name is common), while matched fields with low u
// contribute large positive weight. Values are demonstrative — real systems
// would derive these from the watchlist + customer base population.

export const givenNameFrequencies: Record<string, number> = {};
export const familyNameFrequencies: Record<string, number> = {};

// Defaults for unrecognized tokens.
export const DEFAULT_GIVEN_NAME_U = 0.005;
export const DEFAULT_FAMILY_NAME_U = 0.001;

export function lookupGivenNameU(token: string): number {
  return givenNameFrequencies[token.toLowerCase()] ?? DEFAULT_GIVEN_NAME_U;
}

export function lookupFamilyNameU(token: string): number {
  return familyNameFrequencies[token.toLowerCase()] ?? DEFAULT_FAMILY_NAME_U;
}
