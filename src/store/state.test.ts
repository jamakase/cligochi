import { describe, it, expect, afterEach } from "vitest";
import { existsSync, unlinkSync, mkdirSync } from "node:fs";
import { join } from "node:path";
import { tmpdir } from "node:os";
import { defaultState, petStateToCounters, countersToSerialized } from "./state.js";

describe("state", () => {
  describe("defaultState", () => {
    it("creates valid default state for cat", () => {
      const state = defaultState("cat", "Whiskers");
      expect(state.petId).toBe("cat");
      expect(state.name).toBe("Whiskers");
      expect(state.stats.hunger).toBe(70);
      expect(state.stats.happiness).toBe(70);
      expect(state.stats.health).toBe(70);
      expect(state.traits).toEqual([]);
      expect(state.counters.commits).toBe(0);
      expect(Array.isArray(state.counters.languages)).toBe(true);
    });

    it("creates state with valid timestamps", () => {
      const before = Date.now();
      const state = defaultState("dragon", "Ember");
      const after = Date.now();
      expect(state.lastActive).toBeGreaterThanOrEqual(before);
      expect(state.lastActive).toBeLessThanOrEqual(after);
      expect(state.createdAt).toBeGreaterThanOrEqual(before);
      expect(state.createdAt).toBeLessThanOrEqual(after);
    });
  });

  describe("petStateToCounters", () => {
    it("converts serialized languages array to Set", () => {
      const state = defaultState("cat", "Whiskers");
      state.counters.languages = ["ts", "py", "go"];
      const counters = petStateToCounters(state);
      expect(counters.languages).toBeInstanceOf(Set);
      expect(counters.languages.size).toBe(3);
      expect(counters.languages.has("ts")).toBe(true);
    });
  });

  describe("countersToSerialized", () => {
    it("converts Set languages to array", () => {
      const counters = {
        commits: 5,
        fileSaves: 10,
        testRuns: 3,
        testPasses: 2,
        testFails: 1,
        errors: 0,
        sessions: 1,
        nightSessions: 0,
        forcePushes: 0,
        languages: new Set(["ts", "py"]),
        rapidCommits: 0,
        totalSessionMinutes: 0,
      };
      const serialized = countersToSerialized(counters);
      expect(Array.isArray(serialized.languages)).toBe(true);
      expect(serialized.languages).toContain("ts");
      expect(serialized.languages).toContain("py");
    });
  });
});
