import { describe, it, expect } from "vitest";
import { Pet } from "./pet.js";

describe("Pet", () => {
  it("initializes with default stats", () => {
    const pet = new Pet("cat", "Whiskers");
    expect(pet.stats.hunger).toBe(70);
    expect(pet.stats.happiness).toBe(70);
    expect(pet.stats.health).toBe(70);
  });

  it("initializes with custom stats", () => {
    const pet = new Pet("cat", "Whiskers", { hunger: 50, happiness: 30 });
    expect(pet.stats.hunger).toBe(50);
    expect(pet.stats.happiness).toBe(30);
  });

  describe("feed()", () => {
    it("increases hunger by 10", () => {
      const pet = new Pet("cat", "Whiskers", { hunger: 50 });
      pet.feed();
      expect(pet.stats.hunger).toBe(60);
    });

    it("caps hunger at 100", () => {
      const pet = new Pet("cat", "Whiskers", { hunger: 95 });
      pet.feed();
      expect(pet.stats.hunger).toBe(100);
    });

    it("increments commit counter", () => {
      const pet = new Pet("cat", "Whiskers");
      pet.feed();
      expect(pet.counters.commits).toBe(1);
    });
  });

  describe("play()", () => {
    it("increases happiness by 15", () => {
      const pet = new Pet("cat", "Whiskers", { happiness: 50 });
      pet.play();
      expect(pet.stats.happiness).toBe(65);
    });

    it("caps happiness at 100", () => {
      const pet = new Pet("cat", "Whiskers", { happiness: 90 });
      pet.play();
      expect(pet.stats.happiness).toBe(100);
    });

    it("increments test counters", () => {
      const pet = new Pet("cat", "Whiskers");
      pet.play();
      expect(pet.counters.testPasses).toBe(1);
      expect(pet.counters.testRuns).toBe(1);
    });
  });

  describe("sadden()", () => {
    it("decreases happiness by 10", () => {
      const pet = new Pet("cat", "Whiskers", { happiness: 50 });
      pet.sadden();
      expect(pet.stats.happiness).toBe(40);
    });

    it("floors happiness at 0", () => {
      const pet = new Pet("cat", "Whiskers", { happiness: 5 });
      pet.sadden();
      expect(pet.stats.happiness).toBe(0);
    });
  });

  describe("tick()", () => {
    it("decays hunger by 1 and happiness by 0.5", () => {
      const pet = new Pet("cat", "Whiskers", { hunger: 50, happiness: 50 });
      pet.tick();
      expect(pet.stats.hunger).toBe(49);
      expect(pet.stats.happiness).toBe(49.5);
    });
  });

  describe("health", () => {
    it("is average of hunger and happiness", () => {
      const pet = new Pet("cat", "Whiskers", { hunger: 60, happiness: 40 });
      pet.feed(); // hunger=70, happiness=40 -> health=55
      expect(pet.stats.health).toBe(55);
    });
  });

  describe("getMood()", () => {
    it("returns happy when stats are high", () => {
      const pet = new Pet("cat", "Whiskers", { hunger: 80, happiness: 80, health: 80 });
      expect(pet.getMood()).toBe("happy");
    });

    it("returns neutral when stats are moderate", () => {
      const pet = new Pet("cat", "Whiskers", { hunger: 55, happiness: 55, health: 55 });
      expect(pet.getMood()).toBe("neutral");
    });

    it("returns sad when stats are low", () => {
      const pet = new Pet("cat", "Whiskers", { hunger: 35, happiness: 35, health: 35 });
      expect(pet.getMood()).toBe("sad");
    });

    it("returns angry when hunger is very low", () => {
      const pet = new Pet("cat", "Whiskers", { hunger: 10, happiness: 25, health: 20 });
      expect(pet.getMood()).toBe("angry");
    });

    it("returns sleeping when stats are very low but not hungry", () => {
      const pet = new Pet("cat", "Whiskers", { hunger: 25, happiness: 20, health: 20 });
      expect(pet.getMood()).toBe("sleeping");
    });
  });

  describe("handleEvent()", () => {
    it("handles commit event", () => {
      const pet = new Pet("cat", "Whiskers", { hunger: 50 });
      pet.handleEvent("commit");
      expect(pet.stats.hunger).toBe(60);
      expect(pet.counters.commits).toBe(1);
    });

    it("handles file_save event", () => {
      const pet = new Pet("cat", "Whiskers", { hunger: 50 });
      pet.handleEvent("file_save");
      expect(pet.stats.hunger).toBe(52);
      expect(pet.counters.fileSaves).toBe(1);
    });

    it("handles test_pass event", () => {
      const pet = new Pet("cat", "Whiskers", { happiness: 50 });
      pet.handleEvent("test_pass");
      expect(pet.stats.happiness).toBe(65);
    });

    it("handles test_fail event", () => {
      const pet = new Pet("cat", "Whiskers", { happiness: 50 });
      pet.handleEvent("test_fail");
      expect(pet.stats.happiness).toBe(40);
      expect(pet.counters.testFails).toBe(1);
    });

    it("handles error event", () => {
      const pet = new Pet("cat", "Whiskers", { happiness: 50 });
      pet.handleEvent("error");
      expect(pet.stats.happiness).toBe(40);
      expect(pet.counters.errors).toBe(1);
    });

    it("handles session_start event", () => {
      const pet = new Pet("cat", "Whiskers");
      pet.handleEvent("session_start");
      expect(pet.counters.sessions).toBe(1);
    });

    it("handles idle event", () => {
      const pet = new Pet("cat", "Whiskers", { happiness: 50 });
      pet.handleEvent("idle");
      expect(pet.stats.happiness).toBe(47);
    });

    it("handles force_push event", () => {
      const pet = new Pet("cat", "Whiskers");
      pet.handleEvent("force_push");
      expect(pet.counters.forcePushes).toBe(1);
    });
  });

  describe("traits", () => {
    it("adds a trait", () => {
      const pet = new Pet("cat", "Whiskers");
      expect(pet.addTrait("cautious")).toBe(true);
      expect(pet.getTraits()).toContain("cautious");
    });

    it("does not add duplicate traits", () => {
      const pet = new Pet("cat", "Whiskers");
      pet.addTrait("cautious");
      expect(pet.addTrait("cautious")).toBe(false);
      expect(pet.getTraits().length).toBe(1);
    });
  });
});
