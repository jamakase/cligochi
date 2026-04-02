// ── Eye sets ────────────────────────────────────────────────────────────────
export const EYES = {
    round: { happy: "^.^", neutral: "o.o", sad: ";.;", sleeping: "-.-", angry: ">.<", blink: "-.-" },
    wide: { happy: "@.@", neutral: "O.O", sad: "Q.Q", sleeping: "-.-", angry: ">_<", blink: "-.-" },
    dot: { happy: "•.•", neutral: "·.·", sad: ",.,", sleeping: "-.-", angry: ">.<", blink: "---" },
    star: { happy: "*.* ", neutral: "o.o", sad: ";.;", sleeping: "-.-", angry: ">.<", blink: "-.-" },
    sparkle: { happy: "✦.✦", neutral: "o.o", sad: ";.;", sleeping: "-.-", angry: ">.< ", blink: "-.-" },
    sleepy: { happy: "^.^", neutral: "-.o", sad: ";.;", sleeping: "~.~", angry: ">.<", blink: "~.~" },
    pixel: { happy: "■.■", neutral: "□.□", sad: "▪.▪", sleeping: "─.─", angry: "▶.◀", blink: "─.─" },
};
// ── Mouth sets ───────────────────────────────────────────────────────────────
export const MOUTHS = {
    classic: { happy: "^", neutral: "_", sad: "v", sleeping: "o", angry: "D" },
    wave: { happy: "w", neutral: "~", sad: "u", sleeping: "z", angry: "W" },
    line: { happy: "‿", neutral: "—", sad: "⌒", sleeping: "ᴗ", angry: "⌐" },
    pout: { happy: "ω", neutral: "·", sad: "ε", sleeping: "3", angry: "Ω" },
};
// ── Body templates ───────────────────────────────────────────────────────────
export const BODY_TEMPLATES = {
    cat: {
        species: "Cat",
        build: (eyes, mouth, acc) => [
            acc ? `  /\\_/\\ ${acc}` : "  /\\_/\\  ",
            ` ( ${eyes} ) `,
            `  > ${mouth} <  `,
            " /|   |\\ ",
            "(_|   |_)",
        ].join("\n"),
    },
    dog: {
        species: "Dog",
        build: (eyes, mouth, acc) => [
            acc ? ` /^  ^\\ ${acc}` : " /^  ^\\ ",
            `( ${eyes}  )`,
            ` \\  ${mouth}  / `,
            "  |uu|  ",
            " /    \\ ",
        ].join("\n"),
    },
    dragon: {
        species: "Dragon",
        build: (eyes, mouth, acc) => [
            acc ? `  /\\_/| ${acc}` : "  /\\_/|  ",
            ` ( ${eyes} ) `,
            "~/     \\~",
            ` \\~~${mouth}~~/ `,
            "  \\___/  ",
        ].join("\n"),
    },
    robot: {
        species: "Robot",
        build: (eyes, mouth, acc) => [
            acc ? ` ___${acc}` : " _____ ",
            "|     |",
            `| ${eyes} |`,
            `|  ${mouth}  |`,
            "|_____|",
            " || || ",
        ].join("\n"),
    },
    bird: {
        species: "Bird",
        build: (eyes, mouth, acc) => [
            acc ? `  _${acc}_  ` : "  ___  ",
            ` (${eyes}) `,
            `  >${mouth}<  `,
            " /\\_/\\ ",
            "  | |  ",
        ].join("\n"),
    },
    fish: {
        species: "Fish",
        build: (eyes, mouth, acc) => [
            acc ? `  ><> ${acc}` : "  ><>  ",
            ` (${eyes}) `,
            `  ${mouth}    `,
            "  ><>  ",
            " ~~~~~",
        ].join("\n"),
    },
    bear: {
        species: "Bear",
        build: (eyes, mouth, acc) => [
            acc ? `(o   o)${acc}` : "(o   o)",
            ` (${eyes}) `,
            `  (${mouth})  `,
            " /   \\ ",
            "(     )",
        ].join("\n"),
    },
    bunny: {
        species: "Bunny",
        build: (eyes, mouth, acc) => [
            acc ? `(|) (|)${acc}` : "(|) (|)",
            ` (${eyes}) `,
            `  .${mouth}.  `,
            " (   ) ",
            "  U U  ",
        ].join("\n"),
    },
    fox: {
        species: "Fox",
        build: (eyes, mouth, acc) => [
            acc ? `/\\ /\\ ${acc}` : "/\\  /\\ ",
            `(${eyes})`,
            ` \\${mouth}/ `,
            " )  ( ",
            "(_  _)",
        ].join("\n"),
    },
    owl: {
        species: "Owl",
        build: (eyes, mouth, acc) => [
            acc ? ` ,___. ${acc}` : " ,___. ",
            `(${eyes})`,
            ` \\${mouth}/ `,
            " /MMM\\ ",
            "  | |  ",
        ].join("\n"),
    },
    frog: {
        species: "Frog",
        build: (eyes, mouth, acc) => [
            acc ? `O     O${acc}` : "O     O",
            ` (${eyes}) `,
            ` _${mouth}_  `,
            "(     )",
            " \\   / ",
        ].join("\n"),
    },
    ghost: {
        species: "Ghost",
        build: (eyes, mouth, acc) => [
            acc ? ` .~~~. ${acc}` : " .~~~. ",
            `(${eyes})`,
            ` \\${mouth}/ `,
            " |~~~| ",
            " |_|_| ",
        ].join("\n"),
    },
    penguin: {
        species: "Penguin",
        build: (eyes, mouth, acc) => [
            acc ? ` .___. ${acc}` : " .___. ",
            `(${eyes})`,
            `(  ${mouth}  )`,
            " |   | ",
            "(_)_(_)",
        ].join("\n"),
    },
    hamster: {
        species: "Hamster",
        build: (eyes, mouth, acc) => [
            acc ? `  ___ ${acc}` : "  ___  ",
            ` (${eyes}) `,
            `(  ${mouth}  )`,
            " >   < ",
            " (___) ",
        ].join("\n"),
    },
    snake: {
        species: "Snake",
        build: (eyes, mouth, acc) => [
            acc ? `  /\\ ${acc}` : "  /\\   ",
            ` (${eyes})`,
            ` \\${mouth}/ `,
            "  ~~   ",
            " /  \\  ",
        ].join("\n"),
    },
    bat: {
        species: "Bat",
        build: (eyes, mouth, acc) => [
            acc ? `/V\\ /V\\ ${acc}` : "/V\\ /V\\",
            ` (${eyes}) `,
            `  .${mouth}.  `,
            " (   ) ",
            "  \\_/  ",
        ].join("\n"),
    },
};
export function buildArt(templateKey, eyeKey, mouthKey, accessory) {
    const template = BODY_TEMPLATES[templateKey];
    const eyes = EYES[eyeKey];
    const mouth = MOUTHS[mouthKey];
    const moods = ["happy", "neutral", "sad", "sleeping", "angry"];
    const result = {};
    for (const mood of moods) {
        const normalEyes = eyes[mood];
        const blinkEyes = eyes.blink;
        const normalMouth = mouth[mood];
        const frame0 = template.build(normalEyes, normalMouth, accessory);
        if (mood === "sleeping") {
            result[mood] = [frame0];
        }
        else {
            const frame1 = template.build(blinkEyes, normalMouth, accessory);
            result[mood] = [frame0, frame1];
        }
    }
    return result;
}
