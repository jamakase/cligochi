import { Pet } from "./engine/pet.js";
import { checkTraits } from "./engine/traits.js";
import { load, save, petStateToCounters, countersToSerialized } from "./store/state.js";
let pet = null;
let decayInterval = null;
let saveTimeout = null;
function ensurePet() {
    if (pet)
        return pet;
    const state = load();
    if (state) {
        const counters = petStateToCounters(state);
        pet = new Pet(state.petId, state.name, state.stats, state.traits, counters);
        return pet;
    }
    return null;
}
function savePetState() {
    if (!pet)
        return;
    if (saveTimeout)
        clearTimeout(saveTimeout);
    saveTimeout = setTimeout(() => {
        if (!pet)
            return;
        const existing = load();
        const state = {
            petId: pet.petId,
            name: pet.name,
            stats: { ...pet.stats },
            special: existing?.special ?? { strength: 5, perception: 5, endurance: 5, charisma: 5, intelligence: 5, agility: 5, luck: 5 },
            traits: pet.getTraits(),
            counters: countersToSerialized(pet.counters),
            lastActive: Date.now(),
            createdAt: existing?.createdAt ?? Date.now(),
        };
        save(state);
    }, 500);
}
function checkAndAwardTraits() {
    if (!pet)
        return;
    const newTraits = checkTraits(pet.counters, pet.traits);
    for (const trait of newTraits) {
        pet.addTrait(trait);
    }
    if (newTraits.length > 0) {
        savePetState();
    }
}
export const CligochiPlugin = async (_input) => {
    const hooks = {
        event: async ({ event }) => {
            const p = ensurePet();
            if (!p)
                return;
            switch (event.type) {
                case "session.created":
                    p.handleEvent("session_start");
                    decayInterval = setInterval(() => {
                        p.tick();
                        checkAndAwardTraits();
                        savePetState();
                    }, 5 * 60 * 1000);
                    break;
                case "file.edited":
                    p.handleEvent("file_save");
                    break;
                case "session.error":
                    p.handleEvent("error");
                    break;
                case "session.idle":
                    p.handleEvent("idle");
                    break;
                case "session.deleted":
                    p.handleEvent("session_end");
                    if (decayInterval) {
                        clearInterval(decayInterval);
                        decayInterval = null;
                    }
                    savePetState();
                    break;
                default:
                    return;
            }
            checkAndAwardTraits();
            savePetState();
        },
        "tool.execute.after": async (input, _output) => {
            const p = ensurePet();
            if (!p)
                return;
            if (input.tool === "bash" || input.tool === "shell") {
                const cmd = typeof input.args === "string" ? input.args : input.args?.command ?? "";
                if (/\b(test|jest|vitest|pytest|cargo test|go test|npm test)\b/i.test(cmd)) {
                    const output = _output.output ?? "";
                    if (/fail|error|FAIL/i.test(output)) {
                        p.handleEvent("test_fail");
                    }
                    else {
                        p.handleEvent("test_pass");
                    }
                }
                if (/\bgit\s+push\b.*--force\b/i.test(cmd) || /\bgit\s+push\b.*-f\b/i.test(cmd)) {
                    p.handleEvent("force_push");
                }
                if (/\bgit\s+commit\b/i.test(cmd)) {
                    p.handleEvent("commit");
                }
            }
            checkAndAwardTraits();
            savePetState();
        },
    };
    return hooks;
};
export default CligochiPlugin;
