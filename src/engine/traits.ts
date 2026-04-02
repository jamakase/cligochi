import type { TraitDefinition, TraitId, EventCounters } from "./types.js";

export const TRAITS: TraitDefinition[] = [
  {
    id: "cautious",
    name: "Cautious",
    description: "Earned by running lots of tests",
    check: (c) => c.testRuns >= 50,
  },
  {
    id: "nocturnal",
    name: "Nocturnal",
    description: "Earned by coding late at night",
    check: (c) => c.nightSessions >= 10,
  },
  {
    id: "speedster",
    name: "Speedster",
    description: "Earned by frequent rapid commits",
    check: (c) => c.rapidCommits >= 20,
  },
  {
    id: "stubborn",
    name: "Stubborn",
    description: "Earned by many force-pushes",
    check: (c) => c.forcePushes >= 5,
  },
  {
    id: "wise",
    name: "Wise",
    description: "Earned by long coding sessions with few errors",
    check: (c) => c.totalSessionMinutes >= 6000,
  },
  {
    id: "polyglot",
    name: "Polyglot",
    description: "Earned by working in 3+ languages",
    check: (c) => c.languages.size >= 3,
  },
];

export function checkTraits(
  counters: EventCounters,
  existingTraits: Set<TraitId>,
): TraitId[] {
  const newTraits: TraitId[] = [];
  for (const trait of TRAITS) {
    if (!existingTraits.has(trait.id) && trait.check(counters)) {
      newTraits.push(trait.id);
    }
  }
  return newTraits;
}

export function getTraitDefinition(id: TraitId): TraitDefinition | undefined {
  return TRAITS.find((t) => t.id === id);
}
