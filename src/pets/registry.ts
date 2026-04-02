import type { PetDefinition } from "../engine/types.js";
import { cat } from "./cat.js";
import { dragon } from "./dragon.js";
import { robot } from "./robot.js";
import { buildGeneratedPets } from "./generator.js";

const HANDCRAFTED_PETS: PetDefinition[] = [cat, dragon, robot];

const ALL_PETS: PetDefinition[] = [...HANDCRAFTED_PETS, ...buildGeneratedPets()];

export function getPets(): PetDefinition[] {
  return ALL_PETS;
}

export function getPet(id: string): PetDefinition | undefined {
  return ALL_PETS.find((p) => p.id === id);
}
