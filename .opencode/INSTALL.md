# Cligochi Installation

A virtual pet companion for OpenCode. The plugin auto-installs — no manual setup required.

## Install

Add `cligochi` to the `plugin` array in your OpenCode config:

**Global** (`~/.config/opencode/opencode.json`):
```json
{
  "plugin": ["cligochi"]
}
```

That's it. Restart OpenCode. The pet sidebar will appear with a mystery present — run `/cligochi` to roll your first pet.

## What it does

- Assigns you a random pet with rarity (Common → Legendary) and Fallout-style S.P.E.C.I.A.L. stats
- Pet lives in the sidebar and reacts to your coding: commits, file saves, test results, errors
- Run `/cligochi` to interact: view status, pet, or feed your companion
- Unlock traits over time: nocturnal, speedster, wise, cautious, stubborn, polyglot

## Verify

After restarting OpenCode, you should see a gift box in the sidebar. Run `/cligochi` to open it and meet your pet.
