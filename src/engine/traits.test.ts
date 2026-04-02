import { describe, it, expect } from "vitest";
import { checkTraits, getTraitDefinition, TRAITS } from "./traits.js";
import type { EventCounters, TraitId } from "./types.js";

function makeCounters(overrides: Partial<EventCounters> = {}): EventCounters {
  return {
    commits: 0,
    fileSaves: 0,
    testRuns: 0,
    testPasses: 0,
    testFails: 0,
    errors: 0,
    sessions: 0,
    nightSessions: 0,
    forcePushes: 0,
    languages: new Set(),
    rapidCommits: 0,
    totalSessionMinutes: 0,
    ...overrides,
  };
}

describe("traits", () => {
  it("has at least 6 trait definitions", () => {
    expect(TRAITS.length).toBeGreaterThanOrEqual(6);
  });

  describe("checkTraits", () => {
    it("unlocks cautious at 50 test runs", () => {
      const counters = makeCounters({ testRuns: 50 });
      const newTraits = checkTraits(counters, new Set());
      expect(newTraits).toContain("cautious");
    });

    it("does not unlock cautious below 50 test runs", () => {
      const counters = makeCounters({ testRuns: 49 });
      const newTraits = checkTraits(counters, new Set());
      expect(newTraits).not.toContain("cautious");
    });

    it("unlocks nocturnal at 10 night sessions", () => {
      const counters = makeCounters({ nightSessions: 10 });
      const newTraits = checkTraits(counters, new Set());
      expect(newTraits).toContain("nocturnal");
    });

    it("unlocks speedster at 20 rapid commits", () => {
      const counters = makeCounters({ rapidCommits: 20 });
      const newTraits = checkTraits(counters, new Set());
      expect(newTraits).toContain("speedster");
    });

    it("unlocks stubborn at 5 force pushes", () => {
      const counters = makeCounters({ forcePushes: 5 });
      const newTraits = checkTraits(counters, new Set());
      expect(newTraits).toContain("stubborn");
    });

    it("unlocks wise at 6000 session minutes", () => {
      const counters = makeCounters({ totalSessionMinutes: 6000 });
      const newTraits = checkTraits(counters, new Set());
      expect(newTraits).toContain("wise");
    });

    it("unlocks polyglot with 3+ languages", () => {
      const counters = makeCounters({ languages: new Set(["ts", "py", "go"]) });
      const newTraits = checkTraits(counters, new Set());
      expect(newTraits).toContain("polyglot");
    });

    it("does not return already-owned traits", () => {
      const counters = makeCounters({ testRuns: 50 });
      const existing = new Set<TraitId>(["cautious"]);
      const newTraits = checkTraits(counters, existing);
      expect(newTraits).not.toContain("cautious");
    });

    it("returns multiple new traits at once", () => {
      const counters = makeCounters({
        testRuns: 50,
        nightSessions: 10,
        forcePushes: 5,
      });
      const newTraits = checkTraits(counters, new Set());
      expect(newTraits).toContain("cautious");
      expect(newTraits).toContain("nocturnal");
      expect(newTraits).toContain("stubborn");
    });
  });

  describe("getTraitDefinition", () => {
    it("returns definition for valid trait", () => {
      const def = getTraitDefinition("cautious");
      expect(def).toBeDefined();
      expect(def!.name).toBe("Cautious");
    });

    it("returns undefined for invalid trait", () => {
      const def = getTraitDefinition("nonexistent" as TraitId);
      expect(def).toBeUndefined();
    });
  });
});
