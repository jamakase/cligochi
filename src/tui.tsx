/** @jsxImportSource @opentui/solid */
import type { TuiPlugin, TuiPluginApi, TuiPluginModule } from "@opencode-ai/plugin/tui";
import { createSignal, createMemo, onCleanup, Show, For } from "solid-js";
import { Pet } from "./engine/pet.js";
import { checkTraits } from "./engine/traits.js";
import { getReaction, shouldShowToast, resetToastThrottle } from "./engine/reactions.js";
import { getPet, getPets } from "./pets/registry.js";
import { rollRandomPet } from "./pets/random.js";
import { getTraitDefinition, TRAITS } from "./engine/traits.js";
import { load, save, defaultState, petStateToCounters, countersToSerialized } from "./store/state.js";
import type { PetState, Mood, TraitId, Rarity } from "./engine/types.js";

const id = "cligochi";

function loadPet(): Pet | null {
  const state = load();
  if (!state) return null;
  const counters = petStateToCounters(state);
  return new Pet(state.petId, state.name, state.stats, state.traits, counters);
}

function createPet(): Pet {
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

function statBar(value: number, width: number = 10): string {
  const filled = Math.round((value / 100) * width);
  const empty = width - filled;
  return "\u2588".repeat(filled) + "\u2591".repeat(empty);
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

function moodEmoji(mood: Mood): string {
  switch (mood) {
    case "happy": return ":)";
    case "neutral": return ":|";
    case "sad": return ":(";
    case "sleeping": return "-.-";
    case "angry": return ">:(";
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

  // Decay timer
  const decayTimer = setInterval(() => {
    const p = pet();
    if (!p) return;
    p.tick();
    checkAndAward(p);
    savePet(p);
    refreshPet();
  }, 5 * 60 * 1000);

  // Refresh on events
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
    return pet();
  });

  return (
    <Show when={currentPet()} fallback={
      <box gap={0}>
        <text fg={props.api.theme.current.textMuted}>Run /cligochi to get your pet!</text>
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

            <box paddingTop={1} gap={0}>
              <text fg={props.api.theme.current.textMuted}>
                HNG {statBar(p().stats.hunger)} {Math.round(p().stats.hunger)}
              </text>
              <text fg={props.api.theme.current.textMuted}>
                HAP {statBar(p().stats.happiness)} {Math.round(p().stats.happiness)}
              </text>
              <text fg={props.api.theme.current.textMuted}>
                HP  {statBar(p().stats.health)} {Math.round(p().stats.health)}
              </text>
            </box>

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

const tui: TuiPlugin = async (api) => {
  // Register sidebar slot
  api.slots.register({
    order: 200,
    slots: {
      sidebar_content(_ctx: unknown, props: { session_id: string }) {
        return <PetSidebar api={api} sessionId={props.session_id} />;
      },
    },
  });

  // Register /cligochi command
  api.command.register(() => [
    {
      title: "Cligochi",
      value: "cligochi",
      description: "View your virtual pet's status",
      category: "Pet",
      slash: {
        name: "cligochi",
      },
      onSelect: () => {
        const isFirstRun = !load();
        const p = isFirstRun ? createPet() : loadPet()!;
        const def = getPet(p.petId);
        if (!def) return;

        if (isFirstRun) {
          const artText = def.art["happy"][0] ?? "";
          const lines = [
            artText,
            "",
            `You got ${p.name} the ${def.species}!`,
            rarityDisplay(def.rarity),
            "",
            `"${def.description}"`,
            "",
            `Hunger:    ${statBar(p.stats.hunger)} ${Math.round(p.stats.hunger)}%`,
            `Happiness: ${statBar(p.stats.happiness)} ${Math.round(p.stats.happiness)}%`,
            `Health:    ${statBar(p.stats.health)} ${Math.round(p.stats.health)}%`,
          ];
          api.ui.toast({
            variant: "success",
            title: "A new companion appears!",
            message: lines.join("\n"),
            duration: 15000,
          });
          return;
        }

        const mood = p.getMood();
        const artText = def.art[mood][0] ?? "";
        const traits = p.getTraits().map((t) => {
          const d = getTraitDefinition(t);
          return d ? d.name : t;
        });

        const lines = [
          artText,
          "",
          `${p.name} the ${def.species} (${mood}) - ${rarityDisplay(def.rarity)}`,
          "",
          `Hunger:    ${statBar(p.stats.hunger)} ${Math.round(p.stats.hunger)}%`,
          `Happiness: ${statBar(p.stats.happiness)} ${Math.round(p.stats.happiness)}%`,
          `Health:    ${statBar(p.stats.health)} ${Math.round(p.stats.health)}%`,
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
      },
    },
  ]);
};

const plugin: TuiPluginModule & { id: string } = {
  id,
  tui,
};

export default plugin;
