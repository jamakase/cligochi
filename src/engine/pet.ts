import type { Stats, Mood, CodingEvent, EventCounters, TraitId, PetSpecies } from "./types.js";

const STAT_MAX = 100;
const STAT_MIN = 0;

function clamp(value: number): number {
  return Math.max(STAT_MIN, Math.min(STAT_MAX, value));
}

export class Pet {
  stats: Stats;
  counters: EventCounters;
  traits: Set<TraitId>;
  petId: PetSpecies;
  name: string;

  constructor(
    petId: PetSpecies,
    name: string,
    stats?: Partial<Stats>,
    traits?: TraitId[],
    counters?: Partial<EventCounters>,
  ) {
    this.petId = petId;
    this.name = name;
    this.stats = {
      hunger: stats?.hunger ?? 70,
      happiness: stats?.happiness ?? 70,
      health: stats?.health ?? 70,
    };
    this.traits = new Set(traits ?? []);
    this.counters = {
      commits: counters?.commits ?? 0,
      fileSaves: counters?.fileSaves ?? 0,
      testRuns: counters?.testRuns ?? 0,
      testPasses: counters?.testPasses ?? 0,
      testFails: counters?.testFails ?? 0,
      errors: counters?.errors ?? 0,
      sessions: counters?.sessions ?? 0,
      nightSessions: counters?.nightSessions ?? 0,
      forcePushes: counters?.forcePushes ?? 0,
      languages: counters?.languages ?? new Set(),
      rapidCommits: counters?.rapidCommits ?? 0,
      totalSessionMinutes: counters?.totalSessionMinutes ?? 0,
    };
  }

  feed(): void {
    this.stats.hunger = clamp(this.stats.hunger + 10);
    this.counters.commits++;
    this.updateHealth();
  }

  play(): void {
    this.stats.happiness = clamp(this.stats.happiness + 15);
    this.counters.testPasses++;
    this.counters.testRuns++;
    this.updateHealth();
  }

  sadden(): void {
    this.stats.happiness = clamp(this.stats.happiness - 10);
    this.updateHealth();
  }

  tick(): void {
    this.stats.hunger = clamp(this.stats.hunger - 1);
    this.stats.happiness = clamp(this.stats.happiness - 0.5);
    this.updateHealth();
  }

  handleEvent(event: CodingEvent): void {
    switch (event) {
      case "commit":
        this.feed();
        break;
      case "file_save":
        this.stats.hunger = clamp(this.stats.hunger + 2);
        this.counters.fileSaves++;
        this.updateHealth();
        break;
      case "test_pass":
        this.play();
        break;
      case "test_fail":
        this.sadden();
        this.counters.testFails++;
        this.counters.testRuns++;
        break;
      case "error":
        this.sadden();
        this.counters.errors++;
        break;
      case "session_start": {
        this.counters.sessions++;
        const hour = new Date().getHours();
        if (hour >= 22 || hour < 5) {
          this.counters.nightSessions++;
        }
        break;
      }
      case "idle":
        this.stats.happiness = clamp(this.stats.happiness - 3);
        this.updateHealth();
        break;
      case "force_push":
        this.counters.forcePushes++;
        break;
      default:
        break;
    }
  }

  private updateHealth(): void {
    this.stats.health = clamp(
      (this.stats.hunger + this.stats.happiness) / 2,
    );
  }

  getMood(): Mood {
    const { hunger, happiness, health } = this.stats;
    const avg = (hunger + happiness + health) / 3;

    if (avg >= 70) return "happy";
    if (avg >= 50) return "neutral";
    if (avg >= 30) return "sad";
    if (hunger < 20) return "angry";
    return "sleeping";
  }

  addTrait(trait: TraitId): boolean {
    if (this.traits.has(trait)) return false;
    this.traits.add(trait);
    return true;
  }

  getTraits(): TraitId[] {
    return [...this.traits];
  }
}
