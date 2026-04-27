// Maps common romanizations of Arabic given/family names to a canonical form.
// Real systems use a transliteration engine like ICU's Arabic-Latin transform
// or BGN/PCGN tables; this lookup table covers only the variants relevant to
// the demo's six scenarios.
//
// Source pattern: each canonical form is followed by its common English
// variants (case-insensitive). Variants on both customer and watchlist sides
// are mapped to the same canonical form before Fellegi–Sunter compares them.

const aliasGroups: string[][] = [
  // Names with the "Abd-" prefix structure ("servant of"). These collapse
  // many spellings of "Abdullah / Abdallah" to one canonical form.
  ['abdullah', 'abdallah', 'abdulla', 'abd-allah', 'abdoallah', 'abdullaah'],
  ['muhammad', 'mohammad', 'mohammed', 'muhamed', 'mohamad', 'mohamet'],
  ['ahmad', 'ahmed', 'achmed', 'ahmet'],
  ['hassan', 'hasan', 'hassen', 'hasen'],
  ['ali', 'aly'],
  ['omar', 'umar', 'omer'],
  ['yusuf', 'yousef', 'youssef', 'yousuf', 'yousif'],
  ['ibrahim', 'ebrahim', 'ibraheem'],
  ['saif', 'sayf', 'seyf'],
  ['khaled', 'khalid', 'khaleed'],
  ['nasrallah', 'nasrullah', 'nasr-allah'],
];

// Tokens that are filler in Arabic naming (relational particles like "bin"
// "ibn" "bint" — "son of" / "daughter of") and should not contribute to
// comparisons.
const stopwords = new Set([
  'bin',
  'ibn',
  'ben',
  'bint',
  'al',
  'el',
  'el-',
  'al-',
]);

const aliasToCanonical: Record<string, string> = {};
for (const group of aliasGroups) {
  const canonical = group[0]!;
  for (const alias of group) aliasToCanonical[alias] = canonical;
}

function stripPrefix(token: string): string {
  // Strip leading "al-" / "el-" definite article so that "al-Ahmad" matches
  // "Ahmad". Hyphenated and non-hyphenated variants both handled.
  return token.replace(/^al-?/i, '').replace(/^el-?/i, '');
}

export function arabicNormalize(token: string): string {
  if (!token) return token;
  const lowered = token.toLowerCase().trim();
  if (stopwords.has(lowered)) return '';
  const stripped = stripPrefix(lowered);
  if (stopwords.has(stripped)) return '';
  return aliasToCanonical[stripped] ?? stripped;
}

// Rough check: returns whether a token is plausibly an Arabic-origin name.
// We don't restrict normalization to Arabic-detected tokens (the function is
// safe for Latin names too — they pass through unchanged), so this is here
// purely for reference in the UI layer.
export function looksArabic(token: string): boolean {
  const t = token.toLowerCase();
  return (
    /^al-/.test(t) ||
    /^el-/.test(t) ||
    Object.prototype.hasOwnProperty.call(aliasToCanonical, stripPrefix(t))
  );
}
