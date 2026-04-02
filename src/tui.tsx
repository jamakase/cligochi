/** @jsxImportSource @opentui/solid */
import type { TuiPlugin, TuiPluginApi, TuiPluginModule } from "@opencode-ai/plugin/tui";
import { createSignal, createMemo, onCleanup, Show, For } from "solid-js";
import { Pet } from "./engine/pet.js";
import { checkTraits, getTraitDefinition } from "./engine/traits.js";
import { getReaction, shouldShowToast } from "./engine/reactions.js";
import { getPet } from "./pets/registry.js";
import { rollRandomPet } from "./pets/random.js";
import { load, save, defaultState, petStateToCounters, countersToSerialized } from "./store/state.js";
import type { PetState, Mood, TraitId, Rarity, Special, PetSpecies } from "./engine/types.js";

const id = "cligochi";

// Global visibility + pet state signals (shared between sidebar and commands)
const [sidebarVisible, setSidebarVisible] = createSignal(true);
const [globalPetVersion, setGlobalPetVersion] = createSignal(0);

function bumpPet() {
  setGlobalPetVersion((v) => v + 1);
}

function loadPet(): Pet | null {
  const state = load();
  if (!state) return null;
  const counters = petStateToCounters(state);
  return new Pet(state.petId, state.name, state.stats, state.traits, counters);
}

function createRandomPet(): Pet {
  const rolled = rollRandomPet();
  const initial = defaultState(rolled.id, rolled.name);
  save(initial);
  return new Pet(initial.petId, initial.name, initial.stats, initial.traits);
}

function savePet(pet: Pet): void {
  const existing = load();
  const state: PetState = {
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
}

function hasPet(): boolean {
  return load() !== null;
}

function statBar(value: number, width: number = 10): string {
  const filled = Math.round((value / 100) * width);
  const empty = width - filled;
  return "\u2588".repeat(filled) + "\u2591".repeat(empty);
}

function moodEmoji(mood: Mood): string {
  switch (mood) {
    case "happy": return ":)";
    case "neutral": return ":|";
    case "sad": return ":(";
    case "sleeping": return "-.-";
    case "angry": return ">:(";
  }
}

function rarityDisplay(rarity: Rarity): string {
  switch (rarity) {
    case "common":    return "Common";
    case "uncommon":  return "★ Uncommon";
    case "rare":      return "★★ Rare";
    case "epic":      return "★★★ Epic";
    case "legendary": return "★★★★★ Legendary";
  }
}

function PetSidebar(props: { api: TuiPluginApi; sessionId: string }) {
  const [pet, setPet] = createSignal<Pet | null>(loadPet());
  const [lastReaction, setLastReaction] = createSignal("");
  const [tick, setTick] = createSignal(0);

  const refreshPet = () => {
    setTick((t) => t + 1);
    setPet(loadPet());
  };

  const decayTimer = setInterval(() => {
    const p = pet();
    if (!p) return;
    p.tick();
    checkAndAward(p);
    savePet(p);
    refreshPet();
  }, 5 * 60 * 1000);

  const unsubscribers = [
    props.api.event.on("file.edited", () => {
      const p = pet();
      if (!p) return;
      p.handleEvent("file_save");
      checkAndAward(p);
      savePet(p);
      maybeToast(props.api, p, "file_save");
      refreshPet();
    }),
    props.api.event.on("session.error", () => {
      const p = pet();
      if (!p) return;
      p.handleEvent("error");
      checkAndAward(p);
      savePet(p);
      maybeToast(props.api, p, "error");
      refreshPet();
    }),
    props.api.event.on("session.idle", () => {
      const p = pet();
      if (!p) return;
      p.handleEvent("idle");
      checkAndAward(p);
      savePet(p);
      maybeToast(props.api, p, "idle");
      refreshPet();
    }),
  ];

  onCleanup(() => {
    clearInterval(decayTimer);
    for (const unsub of unsubscribers) unsub();
  });

  function checkAndAward(p: Pet): void {
    const newTraits = checkTraits(p.counters, p.traits);
    for (const trait of newTraits) {
      p.addTrait(trait);
      const def = getTraitDefinition(trait);
      if (def) {
        props.api.ui.toast({
          variant: "success",
          title: "New Trait!",
          message: `${p.name} earned: ${def.name} - ${def.description}`,
          duration: 5000,
        });
      }
    }
  }

  function maybeToast(api: TuiPluginApi, p: Pet, event: Parameters<typeof getReaction>[0]): void {
    if (!shouldShowToast()) return;
    const def = getPet(p.petId);
    if (!def) return;
    const reaction = getReaction(event, p.getMood(), p.getTraits(), p.petId);
    setLastReaction(reaction);
    api.ui.toast({
      variant: "info",
      title: `${def.name} the ${def.species}`,
      message: reaction,
      duration: 3000,
    });
  }

  const currentPet = createMemo(() => {
    tick();
    const ver = globalPetVersion();
    if (ver > 0) setPet(loadPet());
    return pet();
  });

  return (
    <Show when={currentPet()} fallback={
      <box gap={0}>
        <text fg={props.api.theme.current.accent}>{"    *  *  *"}</text>
        <text fg={props.api.theme.current.accent}>{"   \\|/\\|/"}</text>
        <text fg={props.api.theme.current.accent}>{"  +---------+"}</text>
        <text fg={props.api.theme.current.accent}>{"  |  ~   ~  |"}</text>
        <text fg={props.api.theme.current.accent}>{"--+----+----+--"}</text>
        <text fg={props.api.theme.current.accent}>{"  |    |    |"}</text>
        <text fg={props.api.theme.current.accent}>{"  |  ? | ?  |"}</text>
        <text fg={props.api.theme.current.accent}>{"  |    |    |"}</text>
        <text fg={props.api.theme.current.accent}>{"  +---------+"}</text>
        <box paddingTop={1}>
          <text fg={props.api.theme.current.textMuted}>A mystery pet awaits...</text>
          <text fg={props.api.theme.current.textMuted}>Run /cligochi to open!</text>
        </box>
      </box>
    }>
      {(p: () => Pet) => {
        const petDef = createMemo(() => getPet(p().petId));
        const mood = createMemo(() => p().getMood());
        const artFrames = createMemo(() => petDef()?.art[mood()] ?? [""]);
        const art = createMemo(() => artFrames()[0] ?? "");
        const artLines = createMemo(() => art().split("\n"));

        return (
          <box gap={0}>
            <For each={artLines()}>
              {(line) => (
                <text fg={props.api.theme.current.accent}>{line}</text>
              )}
            </For>

            <text fg={props.api.theme.current.text}>
              <b>{p().name}</b>
              <span style={{ fg: props.api.theme.current.textMuted }}>
                {" "}the {petDef()?.species ?? "Pet"} {moodEmoji(mood())}
              </span>
            </text>
            <Show when={petDef()}>
              <text fg={props.api.theme.current.textMuted}>
                {rarityDisplay(petDef()!.rarity)}
              </text>
            </Show>

            <Show when={p().getTraits().length > 0}>
              <box paddingTop={1} gap={0}>
                <text fg={props.api.theme.current.text}>
                  <b>Traits</b>
                </text>
                <For each={p().getTraits()}>
                  {(traitId) => {
                    const def = getTraitDefinition(traitId);
                    return (
                      <text fg={props.api.theme.current.textMuted}>
                        {def ? `* ${def.name}` : `* ${traitId}`}
                      </text>
                    );
                  }}
                </For>
              </box>
            </Show>

            <Show when={lastReaction()}>
              <box paddingTop={1}>
                <text fg={props.api.theme.current.accent}>
                  "{lastReaction()}"
                </text>
              </box>
            </Show>
          </box>
        );
      }}
    </Show>
  );
}

function showActionMenu(api: TuiPluginApi) {
  const DialogSelect = api.ui.DialogSelect;
  api.ui.dialog.setSize("medium");
  api.ui.dialog.replace(() => (
    <DialogSelect
      title="Cligochi"
      options={[
        { title: "Status", value: "status", description: "View your pet's stats" },
        { title: "Pet", value: "pet", description: "Give your pet some love" },
        { title: "Feed", value: "feed", description: "Feed your hungry pet" },
      ]}
      onSelect={(option) => {
        api.ui.dialog.clear();
        const p = loadPet();
        if (!p) return;
        const def = getPet(p.petId);

        if (option.value === "status") {
          if (!def) return;
          const mood = p.getMood();
          const artText = def.art[mood]?.[0] ?? "";
          const traits = p.getTraits().map((t) => {
            const d = getTraitDefinition(t);
            return d ? d.name : t;
          });
          const s = load()?.special;
          const lines = [
            artText,
            "",
            `${p.name} the ${def.species} (${mood}) - ${rarityDisplay(def.rarity)}`,
            "",
            `S.P.E.C.I.A.L.`,
            `STR ${statBar((s?.strength ?? 5) * 10)} ${s?.strength ?? "?"}`,
            `PER ${statBar((s?.perception ?? 5) * 10)} ${s?.perception ?? "?"}`,
            `END ${statBar((s?.endurance ?? 5) * 10)} ${s?.endurance ?? "?"}`,
            `CHR ${statBar((s?.charisma ?? 5) * 10)} ${s?.charisma ?? "?"}`,
            `INT ${statBar((s?.intelligence ?? 5) * 10)} ${s?.intelligence ?? "?"}`,
            `AGI ${statBar((s?.agility ?? 5) * 10)} ${s?.agility ?? "?"}`,
            `LCK ${statBar((s?.luck ?? 5) * 10)} ${s?.luck ?? "?"}`,
          ];
          if (traits.length > 0) {
            lines.push("", "Traits: " + traits.join(", "));
          }
          api.ui.toast({
            variant: "info",
            title: "Cligochi Status",
            message: lines.join("\n"),
            duration: 10000,
          });
        } else if (option.value === "pet") {
          p.stats.happiness = Math.min(100, p.stats.happiness + 5);
          savePet(p);
          bumpPet();
          const petName = def?.name ?? p.name;
          const species = def?.species ?? "Pet";
          const reactions = [
            `${petName} purrs contentedly...`,
            `${petName} nuzzles your hand!`,
            `${petName} looks happy!`,
            `${petName} wags... wait, can a ${species} wag?`,
            `${petName} does a little dance!`,
          ];
          api.ui.toast({
            variant: "success",
            title: `Petting ${petName}`,
            message: reactions[Math.floor(Math.random() * reactions.length)]!,
            duration: 3000,
          });
        } else if (option.value === "feed") {
          p.feed();
          savePet(p);
          bumpPet();
          const petName = def?.name ?? p.name;
          const hungerPct = Math.round(p.stats.hunger);
          const reactions = [
            `${petName} gobbles it up! (hunger: ${hungerPct}%)`,
            `${petName} says: om nom nom! (hunger: ${hungerPct}%)`,
            `Delicious! ${petName} is satisfied. (hunger: ${hungerPct}%)`,
            `${petName} eats happily! (hunger: ${hungerPct}%)`,
          ];
          api.ui.toast({
            variant: "success",
            title: `Feeding ${petName}`,
            message: reactions[Math.floor(Math.random() * reactions.length)]!,
            duration: 3000,
          });
        }
      }}
    />
  ));
}

const tui: TuiPlugin = async (api) => {
  // Sidebar
  api.slots.register({
    order: 50,
    slots: {
      sidebar_content(_ctx: unknown, props: { session_id: string }) {
        return (
          <Show when={sidebarVisible()}>
            <PetSidebar api={api} sessionId={props.session_id} />
          </Show>
        );
      },
    },
  });

  // Commands
  api.command.register(() => [
    {
      title: "Cligochi",
      value: "cligochi",
      description: "Your virtual pet companion",
      category: "Pet",
      slash: { name: "cligochi" },
      onSelect: () => {
        if (!hasPet()) {
          const p = createRandomPet();
          const def = getPet(p.petId);
          bumpPet();
          setSidebarVisible(true);
          if (!def) return;
          const artText = def.art["happy"]?.[0] ?? "";
          const s = load()?.special;
          const lines = [
            artText,
            "",
            `You got ${p.name} the ${def.species}!`,
            rarityDisplay(def.rarity),
            "",
            `"${def.description}"`,
            "",
            `S.P.E.C.I.A.L.`,
            `STR ${statBar((s?.strength ?? 5) * 10)} ${s?.strength ?? "?"}`,
            `PER ${statBar((s?.perception ?? 5) * 10)} ${s?.perception ?? "?"}`,
            `END ${statBar((s?.endurance ?? 5) * 10)} ${s?.endurance ?? "?"}`,
            `CHR ${statBar((s?.charisma ?? 5) * 10)} ${s?.charisma ?? "?"}`,
            `INT ${statBar((s?.intelligence ?? 5) * 10)} ${s?.intelligence ?? "?"}`,
            `AGI ${statBar((s?.agility ?? 5) * 10)} ${s?.agility ?? "?"}`,
            `LCK ${statBar((s?.luck ?? 5) * 10)} ${s?.luck ?? "?"}`,
          ];
          api.ui.toast({
            variant: "success",
            title: "A new companion appears!",
            message: lines.join("\n"),
            duration: 15000,
          });
          return;
        }
        showActionMenu(api);
      },
    },
  ]);
};

const plugin: TuiPluginModule & { id: string } = {
  id,
  tui,
};

export default plugin;
