import type { CodingEvent, Mood, TraitId, PetSpecies } from "./types.js";
export declare function shouldShowToast(): boolean;
export declare function resetToastThrottle(): void;
export declare function getReaction(event: CodingEvent, mood: Mood, traits: TraitId[], species: PetSpecies): string;
