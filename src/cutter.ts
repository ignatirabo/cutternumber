import type { CutterEntry } from "./data";

/**
 * Strip diacritics from a string using Unicode NFD normalization.
 */
function stripDiacritics(s: string): string {
  return s.normalize("NFD").replace(/[\u0300-\u036f]/g, "");
}

/**
 * Title-case a single word: first letter uppercase, rest lowercase.
 */
function titleCaseWord(word: string): string {
  if (word.length === 0) return "";
  return word[0].toUpperCase() + word.slice(1).toLowerCase();
}

/**
 * Normalize user input to match the table's key convention.
 *
 * The table uses title-case with capitals encoding word boundaries:
 *   "San Fernando" → "SanFernando" (SanF ≠ Sanf)
 *   "Adams, John" → "Adams,John"
 *
 * Steps:
 * 1. Strip diacritics
 * 2. Trim
 * 3. Title-case each whitespace-delimited word
 * 4. Join without spaces (preserves commas, periods)
 */
export function normalizeInput(input: string): string {
  const stripped = stripDiacritics(input).trim();
  if (!stripped) return "";
  const words = stripped.split(/\s+/);
  return words.map(titleCaseWord).join("");
}

/**
 * Binary search: find the last entry where entry.key <= target.
 * Returns the index, or -1 if target is before all entries.
 */
function binarySearch(table: CutterEntry[], target: string): number {
  let lo = 0;
  let hi = table.length - 1;
  let result = -1;

  while (lo <= hi) {
    const mid = (lo + hi) >>> 1;
    if (table[mid].key <= target) {
      result = mid;
      lo = mid + 1;
    } else {
      hi = mid - 1;
    }
  }

  return result;
}

/**
 * Determine the prefix (initial letters) for a Cutter number.
 *
 * Rules:
 * - Vowels (A,E,I,O,U): 2 letters
 * - S (not followed by 'c'): 2 letters
 * - Sc: 3 letters
 * - Other consonants: 1 letter
 *
 * Prefix is formatted as: first letter uppercase, rest lowercase.
 */
function getPrefix(normalized: string): string {
  const first = normalized[0].toUpperCase();
  const vowels = "AEIOU";

  if (vowels.includes(first)) {
    // 2 letters
    return first + (normalized[1] ?? "").toLowerCase();
  }

  if (first === "S") {
    const second = (normalized[1] ?? "").toLowerCase();
    if (second === "c") {
      // Sc: 3 letters
      return first + second + (normalized[2] ?? "").toLowerCase();
    }
    // S (not Sc): 2 letters
    return first + second;
  }

  // Other consonants: 1 letter
  return first;
}

export interface CutterResult {
  /** The full Cutter number, e.g. "Ad211" */
  number: string;
  /** The prefix portion, e.g. "Ad" */
  prefix: string;
  /** The numeric code, e.g. "211" */
  code: string;
  /** The matched table entry key */
  matchedKey: string;
  /** The normalized form of the input */
  normalizedInput: string;
}

/**
 * Generate a Cutter-Sanborn number for the given input.
 */
export function cutterNumber(
  table: CutterEntry[],
  input: string
): CutterResult | null {
  const normalized = normalizeInput(input);
  if (!normalized) return null;

  const idx = binarySearch(table, normalized);
  if (idx === -1) return null;

  const entry = table[idx];
  const prefix = getPrefix(normalized);
  const code = entry.code;

  return {
    number: prefix + code,
    prefix,
    code,
    matchedKey: entry.key,
    normalizedInput: normalized,
  };
}
