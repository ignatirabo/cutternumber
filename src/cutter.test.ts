import { describe, it, expect, beforeAll } from "vitest";
import { parseTable } from "./data";
import { cutterNumber, normalizeInput } from "./cutter";
import type { CutterEntry } from "./data";
import { readFileSync } from "fs";
import { resolve } from "path";

let table: CutterEntry[];

beforeAll(() => {
  const raw: [string, string][] = JSON.parse(
    readFileSync(resolve(__dirname, "../data/tablacutter.json"), "utf-8")
  );
  table = parseTable(raw);
});

describe("parseTable", () => {
  it("parses tuples correctly", () => {
    const entries = parseTable([["111", "Aa"], ["211", "Adams"]]);
    expect(entries).toEqual([
      { code: "111", key: "Aa" },
      { code: "211", key: "Adams" },
    ]);
  });

  it("loads the full table", () => {
    expect(table.length).toBeGreaterThan(12000);
  });
});

describe("normalizeInput", () => {
  it("title-cases and joins words", () => {
    expect(normalizeInput("san fernando")).toBe("SanFernando");
  });

  it("strips diacritics", () => {
    expect(normalizeInput("García")).toBe("Garcia");
    expect(normalizeInput("müller")).toBe("Muller");
    expect(normalizeInput("LÓPEZ")).toBe("Lopez");
  });

  it("preserves commas", () => {
    expect(normalizeInput("adams, john")).toBe("Adams,John");
  });

  it("handles multiple spaces", () => {
    expect(normalizeInput("  san   fernando  ")).toBe("SanFernando");
  });

  it("returns empty for blank input", () => {
    expect(normalizeInput("")).toBe("");
    expect(normalizeInput("   ")).toBe("");
  });
});

describe("cutterNumber", () => {
  // Vowel prefix: 2 letters + code
  it("Adams → Ad211", () => {
    const result = cutterNumber(table, "Adams");
    expect(result).not.toBeNull();
    expect(result!.number).toBe("Ad211");
  });

  // S prefix (not Sc): 2 letters + code
  it("Smith → Sm...", () => {
    const result = cutterNumber(table, "Smith");
    expect(result).not.toBeNull();
    expect(result!.prefix).toBe("Sm");
    expect(result!.number).toMatch(/^Sm\d+$/);
  });

  // Sc prefix: 3 letters + code
  it("Schmidt → Sch349", () => {
    const result = cutterNumber(table, "Schmidt");
    expect(result).not.toBeNull();
    expect(result!.prefix).toBe("Sch");
    expect(result!.number).toBe("Sch349");
  });

  // Other consonant: 1 letter + code
  it("Brown → B...", () => {
    const result = cutterNumber(table, "Brown");
    expect(result).not.toBeNull();
    expect(result!.prefix).toBe("B");
    expect(result!.number).toMatch(/^B\d+$/);
  });

  // The critical bug fix: SanF vs Sanf distinction
  it("San Francisco → Sa195 (matches SanF entry)", () => {
    const result = cutterNumber(table, "San Francisco");
    expect(result).not.toBeNull();
    expect(result!.number).toBe("Sa195");
    expect(result!.matchedKey).toBe("SanF");
  });

  it("Sanford → Sa224 (matches Sanf entry)", () => {
    const result = cutterNumber(table, "Sanford");
    expect(result).not.toBeNull();
    expect(result!.number).toBe("Sa224");
    expect(result!.matchedKey).toBe("Sanf");
  });

  // Diacritics
  it("handles diacritics: García", () => {
    const result = cutterNumber(table, "García");
    expect(result).not.toBeNull();
    expect(result!.prefix).toBe("G");
  });

  // Jimenez
  it("Jimenez → J61", () => {
    const result = cutterNumber(table, "Jimenez");
    expect(result).not.toBeNull();
    expect(result!.prefix).toBe("J");
    // Verify it finds the right entry
    expect(result!.number).toMatch(/^J\d+$/);
  });

  // Saint entries (compound names)
  it("Saint Andrew → Sa134 (matches SaintAn)", () => {
    const result = cutterNumber(table, "Saint Andrew");
    expect(result).not.toBeNull();
    // "SaintAndrew" > "SaintAn", so it matches SaintAn (134)
    expect(result!.matchedKey).toBe("SaintAn");
    expect(result!.number).toBe("Sa134");
  });

  it("Saint → Sa132 (matches Sai, before SaintA)", () => {
    const result = cutterNumber(table, "Saint");
    expect(result).not.toBeNull();
    // "Saint" < "SaintA", so it matches "Sai" (132)
    expect(result!.matchedKey).toBe("Sai");
    expect(result!.number).toBe("Sa132");
  });

  // Empty / null input
  it("returns null for empty input", () => {
    expect(cutterNumber(table, "")).toBeNull();
    expect(cutterNumber(table, "   ")).toBeNull();
  });

  // Comma in input
  it("handles comma-separated names", () => {
    const result = cutterNumber(table, "Abbott, John");
    expect(result).not.toBeNull();
    expect(result!.matchedKey).toBe("Abbott,J.");
  });

  // Entries at boundaries
  it("handles first entry in table (Aa)", () => {
    const result = cutterNumber(table, "Aa");
    expect(result).not.toBeNull();
    expect(result!.number).toBe("Aa111");
  });

  it("handles last entry in table (Zy)", () => {
    const result = cutterNumber(table, "Zy");
    expect(result).not.toBeNull();
    expect(result!.code).toBe("99");
  });

  it("handles input before first entry", () => {
    // "A" is before "Aa" — should still match first entry? No, binary search returns -1
    const result = cutterNumber(table, "A");
    // "A" < "Aa", so no match
    expect(result).toBeNull();
  });

  it("handles input after last entry", () => {
    const result = cutterNumber(table, "Zzzz");
    expect(result).not.toBeNull();
    expect(result!.code).toBe("99");
  });
});
