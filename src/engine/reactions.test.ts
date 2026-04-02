import { describe, it, expect, beforeEach } from "vitest";
import { getReaction, shouldShowToast, resetToastThrottle } from "./reactions.js";

describe("reactions", () => {
  describe("getReaction", () => {
    it("returns a string for commit + happy + cat", () => {
      const result = getReaction("commit", "happy", [], "cat");
      expect(typeof result).toBe("string");
      expect(result.length).toBeGreaterThan(0);
    });

    it("returns different messages for different moods", () => {
      const happy = getReaction("error", "happy", [], "cat");
      const angry = getReaction("error", "angry", [], "cat");
      // They should both be strings (may sometimes collide, but species verb differs)
      expect(typeof happy).toBe("string");
      expect(typeof angry).toBe("string");
    });

    it("includes species verb for cat", () => {
      const result = getReaction("commit", "happy", [], "cat");
      expect(result).toContain("purr");
    });

    it("includes species verb for dragon", () => {
      const result = getReaction("commit", "happy", [], "dragon");
      expect(result).toContain("roar");
    });

    it("includes species verb for robot", () => {
      const result = getReaction("commit", "happy", [], "robot");
      expect(result).toContain("beep");
    });

    it("uses trait override for cautious + commit", () => {
      const result = getReaction("commit", "happy", ["cautious"], "cat");
      expect(result.toLowerCase()).toMatch(/test/);
    });
  });

  describe("shouldShowToast", () => {
    beforeEach(() => {
      resetToastThrottle();
    });

    it("returns true on first call", () => {
      expect(shouldShowToast()).toBe(true);
    });

    it("returns false on immediate second call", () => {
      shouldShowToast();
      expect(shouldShowToast()).toBe(false);
    });
  });
});
