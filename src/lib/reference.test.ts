import { describe, it, expect } from "vitest";
import { generateReference } from "./reference";

describe("generateReference", () => {
  it("generates a reference matching the expected MMK-YYYYMMDD-XXXXXX pattern", () => {
    const fixedDate = new Date("2026-10-24T12:00:00Z");
    const ref = generateReference(fixedDate);
    expect(ref).toMatch(/^MMK-20261024-[ABCDEFGHJKLMNPQRSTUVWXYZ23456789]{6}$/);
  });

  it("does not include ambiguous characters (0, O, 1, I)", () => {
    for (let i = 0; i < 50; i++) {
      const ref = generateReference();
      const codePart = ref.split("-")[2];
      expect(codePart).toBeDefined();
      expect(codePart).not.toMatch(/[0O1I]/);
    }
  });

  it("produces distinct references on subsequent calls", () => {
    const refs = new Set(Array.from({ length: 20 }, () => generateReference()));
    expect(refs.size).toBe(20);
  });
});
