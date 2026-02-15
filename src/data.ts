export interface CutterEntry {
  code: string;
  key: string;
}

/**
 * Convert the JSON table (array of [code, key] tuples) into a typed array.
 */
export function parseTable(raw: [string, string][]): CutterEntry[] {
  return raw.map(([code, key]) => ({ code, key }));
}
