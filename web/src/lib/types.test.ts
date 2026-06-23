import { describe, expect, it } from "vitest";
import { AVATAR_COLORS, TYPE_META, type OppType } from "@/lib/types";

describe("TYPE_META", () => {
  const types: OppType[] = ["automation", "innovation", "cost", "docs", "techdebt", "transfer"];

  it("has an entry for every opportunity type", () => {
    for (const t of types) {
      expect(TYPE_META[t]).toBeDefined();
      expect(TYPE_META[t].label.length).toBeGreaterThan(0);
    }
  });

  it("uses valid hex colors for bg and fg", () => {
    const hex = /^#[0-9A-Fa-f]{6}$/;
    for (const t of types) {
      expect(TYPE_META[t].bg).toMatch(hex);
      expect(TYPE_META[t].fg).toMatch(hex);
    }
  });
});

describe("AVATAR_COLORS", () => {
  it("is a non-empty palette of hex colors", () => {
    expect(AVATAR_COLORS.length).toBeGreaterThan(0);
    for (const c of AVATAR_COLORS) {
      expect(c).toMatch(/^#[0-9A-Fa-f]{6}$/);
    }
  });
});
