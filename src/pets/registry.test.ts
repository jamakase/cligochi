import { describe, it, expect } from "vitest";
import { getPets, getPet } from "./registry.js";
import type { Mood } from "../engine/types.js";

const ALL_MOODS: Mood[] = ["happy", "neutral", "sad", "sleeping", "angry"];

describe("pet registry", () => {
  it("has at least 3 pets", () => {
    expect(getPets().length).toBeGreaterThanOrEqual(3);
  });

  it("has at least 100 pets", () => {
    expect(getPets().length).toBeGreaterThanOrEqual(100);
  });

  it("includes cat, dragon, and robot", () => {
    const ids = getPets().map((p) => p.id);
    expect(ids).toContain("cat");
    expect(ids).toContain("dragon");
    expect(ids).toContain("robot");
  });

  describe("each pet", () => {
    for (const pet of getPets()) {
      describe(pet.id, () => {
        it("has required fields", () => {
          expect(pet.id).toBeTruthy();
          expect(pet.name).toBeTruthy();
          expect(pet.species).toBeTruthy();
          expect(pet.description).toBeTruthy();
        });

        for (const mood of ALL_MOODS) {
          it(`has ASCII art frames for mood: ${mood}`, () => {
            expect(pet.art[mood]).toBeTruthy();
            expect(Array.isArray(pet.art[mood])).toBe(true);
            expect(pet.art[mood].length).toBeGreaterThanOrEqual(1);
            expect(pet.art[mood][0].length).toBeGreaterThan(5);
          });
        }
      });
    }
  });

  describe("getPet", () => {
    it("returns cat by id", () => {
      const cat = getPet("cat");
      expect(cat).toBeDefined();
      expect(cat!.id).toBe("cat");
      expect(cat!.name).toBe("Whiskers");
    });

    it("returns undefined for invalid id", () => {
      const pet = getPet("unicorn");
      expect(pet).toBeUndefined();
    });
  });
});
