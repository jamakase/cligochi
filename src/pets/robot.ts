import type { PetDefinition } from "../engine/types.js";

export const robot: PetDefinition = {
  id: "robot",
  name: "Byte",
  species: "Robot",
  description: "A logical robot who sparks on errors",
  rarity: "epic",
  art: {
    happy: [
      [
        " _____ ",
        "|     |",
        "| ^_^ |",
        "|_____|",
        " || || ",
        " /\\ /\\ ",
      ].join("\n"),
      [
        " _____ ",
        "|     |",
        "| -_- |",
        "|_____|",
        " || || ",
        " /\\ /\\ ",
      ].join("\n"),
    ],
    neutral: [
      [
        " _____ ",
        "|     |",
        "| o_o |",
        "|_____|",
        " || || ",
        " /\\ /\\ ",
      ].join("\n"),
      [
        " _____ ",
        "|     |",
        "| -_- |",
        "|_____|",
        " || || ",
        " /\\ /\\ ",
      ].join("\n"),
    ],
    sad: [
      [
        " _____ ",
        "|     |",
        "| ;_; |",
        "|_____|",
        " || || ",
        " /\\ /\\ ",
      ].join("\n"),
      [
        " _____ ",
        "|     |",
        "| -_- |",
        "|_____|",
        " || || ",
        " /\\ /\\ ",
      ].join("\n"),
    ],
    sleeping: [
      [
        " _____ ",
        "|     |",
        "| -_- |",
        "|_____|",
        " || || ",
        " /\\ /\\ ",
      ].join("\n"),
    ],
    angry: [
      [
        " _____ ",
        "|     |",
        "| >_< |",
        "|_____|",
        " || || ",
        " /\\ /\\ ",
      ].join("\n"),
      [
        " _____ ",
        "|     |",
        "| -_- |",
        "|_____|",
        " || || ",
        " /\\ /\\ ",
      ].join("\n"),
    ],
  },
  baseTraitModifiers: {
    wise: 5,
    cautious: 3,
  },
};
