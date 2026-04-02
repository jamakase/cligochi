export type Mood = "happy" | "neutral" | "sad" | "sleeping" | "angry";

export type Stats = {
  hunger: number;
  happiness: number;
  health: number;
};

export type Special = {
  strength: number;
  perception: number;
  endurance: number;
  charisma: number;
  intelligence: number;
  agility: number;
  luck: number;
};

export type EventCounters = {
  commits: number;
  fileSaves: number;
  testRuns: number;
  testPasses: number;
  testFails: number;
  errors: number;
  sessions: number;
  nightSessions: number;
  forcePushes: number;
  languages: Set<string>;
  rapidCommits: number;
  totalSessionMinutes: number;
};

export type TraitId =
  | "cautious"
  | "nocturnal"
  | "speedster"
  | "stubborn"
  | "wise"
  | "polyglot";

export type TraitDefinition = {
  id: TraitId;
  name: string;
  description: string;
  check: (counters: EventCounters) => boolean;
};

export type PetSpecies = string;

export type ArtFrames = Record<Mood, string[]>;

export type Rarity = "common" | "uncommon" | "rare" | "epic" | "legendary";

export type PetDefinition = {
  id: string;
  name: string;
  species: string;
  description: string;
  art: ArtFrames;
  rarity: Rarity;
  baseTraitModifiers: Partial<Record<TraitId, number>>;
};

export type PetState = {
  petId: PetSpecies;
  name: string;
  stats: Stats;
  special: Special;
  traits: TraitId[];
  counters: SerializedCounters;
  lastActive: number;
  createdAt: number;
};

export type SerializedCounters = Omit<EventCounters, "languages"> & {
  languages: string[];
};

export type CodingEvent =
  | "commit"
  | "file_save"
  | "test_pass"
  | "test_fail"
  | "error"
  | "session_start"
  | "session_end"
  | "idle"
  | "force_push";
