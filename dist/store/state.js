import { existsSync, mkdirSync, readFileSync, writeFileSync, renameSync } from "node:fs";
import { join, dirname } from "node:path";
import { homedir } from "node:os";
const STATE_DIR = join(homedir(), ".config", "opencode", "plugins");
const STATE_FILE = join(STATE_DIR, "cligochi-state.json");
export function getStatePath() {
    return STATE_FILE;
}
function rollSpecial() {
    const roll = () => Math.floor(Math.random() * 8) + 3; // 3-10
    return {
        strength: roll(),
        perception: roll(),
        endurance: roll(),
        charisma: roll(),
        intelligence: roll(),
        agility: roll(),
        luck: roll(),
    };
}
export function defaultState(petId, name) {
    return {
        petId,
        name,
        stats: { hunger: 70, happiness: 70, health: 70 },
        special: rollSpecial(),
        traits: [],
        counters: {
            commits: 0,
            fileSaves: 0,
            testRuns: 0,
            testPasses: 0,
            testFails: 0,
            errors: 0,
            sessions: 0,
            nightSessions: 0,
            forcePushes: 0,
            languages: [],
            rapidCommits: 0,
            totalSessionMinutes: 0,
        },
        lastActive: Date.now(),
        createdAt: Date.now(),
    };
}
export function load() {
    try {
        if (!existsSync(STATE_FILE))
            return null;
        const raw = readFileSync(STATE_FILE, "utf-8");
        return JSON.parse(raw);
    }
    catch {
        return null;
    }
}
export function save(state) {
    const dir = dirname(STATE_FILE);
    if (!existsSync(dir)) {
        mkdirSync(dir, { recursive: true });
    }
    const tmpFile = STATE_FILE + ".tmp";
    writeFileSync(tmpFile, JSON.stringify(state, null, 2), "utf-8");
    renameSync(tmpFile, STATE_FILE);
}
export function petStateToCounters(state) {
    const c = state.counters;
    return {
        ...c,
        languages: new Set(c.languages),
    };
}
export function countersToSerialized(counters) {
    return {
        ...counters,
        languages: [...counters.languages],
    };
}
