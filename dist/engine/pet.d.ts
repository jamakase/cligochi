import type { Stats, Mood, CodingEvent, EventCounters, TraitId, PetSpecies } from "./types.js";
export declare class Pet {
    stats: Stats;
    counters: EventCounters;
    traits: Set<TraitId>;
    petId: PetSpecies;
    name: string;
    constructor(petId: PetSpecies, name: string, stats?: Partial<Stats>, traits?: TraitId[], counters?: Partial<EventCounters>);
    feed(): void;
    play(): void;
    sadden(): void;
    tick(): void;
    handleEvent(event: CodingEvent): void;
    private updateHealth;
    getMood(): Mood;
    addTrait(trait: TraitId): boolean;
    getTraits(): TraitId[];
}
