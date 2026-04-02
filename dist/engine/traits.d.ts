import type { TraitDefinition, TraitId, EventCounters } from "./types.js";
export declare const TRAITS: TraitDefinition[];
export declare function checkTraits(counters: EventCounters, existingTraits: Set<TraitId>): TraitId[];
export declare function getTraitDefinition(id: TraitId): TraitDefinition | undefined;
