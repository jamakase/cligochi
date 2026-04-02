import { cat } from "./cat.js";
import { dragon } from "./dragon.js";
import { robot } from "./robot.js";
import { buildGeneratedPets } from "./generator.js";
const HANDCRAFTED_PETS = [cat, dragon, robot];
const ALL_PETS = [...HANDCRAFTED_PETS, ...buildGeneratedPets()];
export function getPets() {
    return ALL_PETS;
}
export function getPet(id) {
    return ALL_PETS.find((p) => p.id === id);
}
