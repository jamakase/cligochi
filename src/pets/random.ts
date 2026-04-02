import type { PetDefinition, Rarity } from "../engine/types.js";
import { getPets } from "./registry.js";

const RARITY_WEIGHTS: Record<Rarity, number> = {
  common: 100,
  uncommon: 40,
  rare: 15,
  epic: 5,
  legendary: 2,
};

export function rollRandomPet(): PetDefinition {
  const pets = getPets();
  const weighted = pets.map((pet) => ({
    pet,
    weight: RARITY_WEIGHTS[pet.rarity],
  }));
  const totalWeight = weighted.reduce((sum, w) => sum + w.weight, 0);
  let roll = Math.random() * totalWeight;
  for (const entry of weighted) {
    roll -= entry.weight;
    if (roll <= 0) return entry.pet;
  }
  return pets[0];
}
