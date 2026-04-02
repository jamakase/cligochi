import type { CodingEvent, Mood, TraitId, PetSpecies } from "./types.js";

type ReactionTable = Record<string, string[]>;

const SPECIES_VERBS: Record<PetSpecies, { happy: string; sad: string; neutral: string }> = {
  cat: { happy: "*purrs*", sad: "*hisses*", neutral: "*meows*" },
  dragon: { happy: "*roars happily*", sad: "*whimpers*", neutral: "*grumbles*" },
  robot: { happy: "*beeps cheerfully*", sad: "*error beep*", neutral: "*whirrs*" },
};

const REACTIONS: Record<CodingEvent, ReactionTable> = {
  commit: {
    happy: ["fed! yum~", "thanks for the commit!", "delicious code!"],
    neutral: ["om nom nom", "food received", "a commit, cool"],
    sad: ["at least I got fed...", "food helps a little", "thanks, I guess"],
    sleeping: ["*munch munch* zzz", "sleep-eating...", "huh? food? zzz"],
    angry: ["finally some food!", "took you long enough!", "about time!"],
  },
  file_save: {
    happy: ["nice save!", "you're on fire!", "keep going!"],
    neutral: ["saved.", "noted.", "got it."],
    sad: ["...", "ok", "meh"],
    sleeping: ["zzz", "zzz", "zzz"],
    angry: ["whatever", "hmph", "fine"],
  },
  test_pass: {
    happy: ["woohoo! tests pass!", "green is my fav color!", "nailed it!"],
    neutral: ["tests pass, nice", "green.", "passing."],
    sad: ["oh, they pass...", "good I suppose", "at least something works"],
    sleeping: ["*dreams of green*", "zzz...pass...zzz"],
    angry: ["finally passing!", "was that so hard?!"],
  },
  test_fail: {
    happy: ["oops! we'll fix it!", "a challenge! fun!"],
    neutral: ["test failed.", "red.", "hmm."],
    sad: ["oh no...", "more failures...", "this makes me sad"],
    sleeping: ["*nightmare*", "zzz...red...zzz"],
    angry: ["UGH!", "broken AGAIN?!", "come ON!"],
  },
  error: {
    happy: ["oopsie! no worries~", "errors happen!"],
    neutral: ["error detected.", "something broke."],
    sad: ["oh no, not again...", "this hurts..."],
    sleeping: ["*twitches*", "zzz...error..."],
    angry: ["SERIOUSLY?!", "another one?!"],
  },
  session_start: {
    happy: ["hi! let's code!", "yay, you're here!", "ready to go!"],
    neutral: ["hey.", "welcome back.", "hello."],
    sad: ["oh, hi...", "you remembered me...", "hey..."],
    sleeping: ["*yawn* oh hi", "waking up...", "huh? morning?"],
    angry: ["oh. it's you.", "hmph. fine.", "let's just get this over with."],
  },
  session_end: {
    happy: ["bye! come back soon!", "great session!", "see ya!"],
    neutral: ["goodbye.", "later.", "bye."],
    sad: ["don't go...", "will you come back?", "bye..."],
    sleeping: ["zzz...bye...zzz"],
    angry: ["finally leaving?", "good riddance!", "about time."],
  },
  idle: {
    happy: ["*yawn* getting sleepy~", "taking a nap soon..."],
    neutral: ["still here?", "kinda bored...", "..."],
    sad: ["so bored...", "lonely...", "anyone there?"],
    sleeping: ["zzz", "zzz...zzz..."],
    angry: ["DO SOMETHING!", "I'm wasting away here!"],
  },
  force_push: {
    happy: ["living dangerously! fun!", "force push? bold!"],
    neutral: ["force pushed.", "brave choice."],
    sad: ["that's scary...", "be careful..."],
    sleeping: ["zzz...force...zzz"],
    angry: ["YEAH! FORCE IT!", "WHO NEEDS HISTORY?!"],
  },
};

const TRAIT_OVERRIDES: Partial<Record<TraitId, Partial<Record<CodingEvent, string[]>>>> = {
  cautious: {
    commit: ["did you run the tests first?", "hope you tested that!", "tests pass, right?"],
    force_push: ["that's dangerous! please be careful!", "my anxiety!"],
  },
  speedster: {
    commit: ["another one! let's go!", "speed run!", "gotta go fast!"],
  },
  nocturnal: {
    session_start: ["ah, the witching hour!", "night owl mode activated!", "the best coding happens at night"],
  },
  stubborn: {
    force_push: ["lol typical us", "force push gang!", "history is overrated"],
  },
};

let lastToastTime = 0;
const TOAST_THROTTLE_MS = 30_000;

export function shouldShowToast(): boolean {
  const now = Date.now();
  if (now - lastToastTime < TOAST_THROTTLE_MS) return false;
  lastToastTime = now;
  return true;
}

export function resetToastThrottle(): void {
  lastToastTime = 0;
}

function pickRandom<T>(arr: T[]): T {
  return arr[Math.floor(Math.random() * arr.length)]!;
}

export function getReaction(
  event: CodingEvent,
  mood: Mood,
  traits: TraitId[],
  species: PetSpecies,
): string {
  for (const trait of traits) {
    const overrides = TRAIT_OVERRIDES[trait]?.[event];
    if (overrides && overrides.length > 0) {
      return `${SPECIES_VERBS[species][mood === "happy" ? "happy" : mood === "angry" || mood === "sad" ? "sad" : "neutral"]} ${pickRandom(overrides)}`;
    }
  }

  const eventReactions = REACTIONS[event];
  const moodReactions = eventReactions[mood];
  if (!moodReactions || moodReactions.length === 0) {
    return SPECIES_VERBS[species].neutral;
  }

  const verb = SPECIES_VERBS[species][mood === "happy" ? "happy" : mood === "angry" || mood === "sad" ? "sad" : "neutral"];
  return `${verb} ${pickRandom(moodReactions)}`;
}
