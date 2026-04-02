import type { Mood } from "../engine/types.js";
export type EyeSet = {
    happy: string;
    neutral: string;
    sad: string;
    sleeping: string;
    angry: string;
    blink: string;
};
export type MouthSet = {
    happy: string;
    neutral: string;
    sad: string;
    sleeping: string;
    angry: string;
};
export type BodyTemplate = {
    species: string;
    build: (eyes: string, mouth: string, accessory?: string) => string;
};
export declare const EYES: Record<string, EyeSet>;
export declare const MOUTHS: Record<string, MouthSet>;
export declare const BODY_TEMPLATES: Record<string, BodyTemplate>;
import type { Rarity } from "../engine/types.js";
export type VariantSpec = {
    id: string;
    name: string;
    description: string;
    eyeKey: string;
    mouthKey: string;
    accessory?: string;
    traitModifiers: Partial<Record<string, number>>;
    rarity?: Rarity;
};
export declare function buildArt(templateKey: string, eyeKey: string, mouthKey: string, accessory?: string): Record<Mood, string[]>;
