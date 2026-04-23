const fs = require("fs");
const path = require("path");

const root = path.resolve(__dirname, "..");
const portraitDir = path.join(root, "assets", "portraits");
const avatarDir = path.join(root, "assets", "avatars");

fs.mkdirSync(portraitDir, { recursive: true });
fs.mkdirSync(avatarDir, { recursive: true });

const npcSpecs = {
  seth: ["#d89a71", "#d7a037", "#c53030", "calm", "short", "#36d2df", "left"],
  piper: ["#e2a982", "#f2c850", "#0b98a8", "spark", "ponytail", "#ff5148", "right"],
  camille: ["#bd8065", "#15151c", "#6d4ab0", "sharp", "long", "#f0c84a", "left"],
  julian: ["#c58c6d", "#32221c", "#d33a36", "smirk", "swept", "#ffd866", "right"],
  theo: ["#b98263", "#211c1c", "#2d8b5a", "soft", "messy", "#35d1e1", "left"],
  jordan: ["#d29a73", "#704327", "#d8ae2c", "bright", "short", "#8b5fd1", "right"],
  ben: ["#9f674e", "#11141a", "#2d8b5a", "steady", "short", "#35d1e1", "left"],
  rina: ["#b8755f", "#11131a", "#ce2f32", "hard", "bob", "#f4c542", "right"],
  vance: ["#c99776", "#68727b", "#202632", "stern", "swept", "#e13b32", "left"],
  kaito: ["#c28668", "#171414", "#252a33", "knowing", "swept", "#f4c542", "right"],
  rhea: ["#c57663", "#871a34", "#6d4ab0", "danger", "wild", "#ff5148", "left"]
};

const avatarSpecs = {
  male: [
    ["#dc9f78", "#c9962c", "#c53030", "calm", "short", "#35d1e1", "left"],
    ["#c48768", "#36231c", "#0b98a8", "sharp", "swept", "#ffd95c", "right"],
    ["#9f674e", "#11141a", "#278458", "steady", "short", "#35d1e1", "left"],
    ["#ce916d", "#744225", "#7652b8", "smirk", "messy", "#ff594f", "right"],
    ["#bc8566", "#d9d1bd", "#f1c232", "soft", "swept", "#15171d", "left"]
  ],
  female: [
    ["#dba27d", "#f1c232", "#0b98a8", "spark", "ponytail", "#ff594f", "right"],
    ["#c58c6d", "#15151c", "#7652b8", "sharp", "long", "#f4c542", "left"],
    ["#9f674e", "#744225", "#c53030", "steady", "bob", "#35d1e1", "right"],
    ["#d09a78", "#d9d1bd", "#2f8f57", "soft", "long", "#7652b8", "left"],
    ["#b8755f", "#b84b70", "#f1c232", "danger", "wild", "#35d1e1", "right"]
  ],
  neutral: [
    ["#c99070", "#0b98a8", "#171414", "calm", "messy", "#f4c542", "left"],
    ["#bd8466", "#7652b8", "#f1c232", "smirk", "swept", "#15171d", "right"],
    ["#9f6b52", "#2f8f57", "#c53030", "sharp", "short", "#35d1e1", "left"],
    ["#d0a07d", "#6f777b", "#0b98a8", "soft", "bob", "#ff594f", "right"],
    ["#bd8566", "#f1c232", "#7652b8", "steady", "long", "#35d1e1", "left"]
  ]
};

function hairPath(style) {
  return {
    short: "M55 90c-7-34 15-62 55-62 35 0 58 23 52 59-23-16-70-21-107 3Z",
    swept: "M49 89c1-36 25-64 65-64 27 0 50 15 57 43-40-16-71-8-122 21Z",
    messy: "M48 89c0-35 24-64 61-64 32 0 56 19 62 48-15-8-23-5-34-19-8 15-23 8-36 22-13-13-27 1-53 13Z",
    ponytail: "M48 91c-4-38 19-67 59-67 35 0 59 25 55 60-26-17-73-17-114 7ZM154 78c27 7 34 32 22 53-18-16-30-30-43-38Z",
    long: "M43 98c-5-46 21-76 65-76s69 30 65 77c-6 48-13 78-27 95-12-40-67-40-79 0-15-19-20-50-24-96Z",
    bob: "M45 98c-5-42 20-74 64-74 41 0 66 31 63 72-5 27-15 48-26 64-7-27-70-27-77 0-12-16-20-37-24-62Z",
    wild: "M37 98c7-50 30-79 75-79 41 0 68 27 75 75-21-9-30-22-38-40-10 17-23 10-35 33-18-22-38 2-77 11Z"
  }[style] || hairPath("short");
}

function faceLines(mood) {
  return {
    calm: ["M77 101h15", "M126 101h15", "M91 128c14 7 28 7 41 0"],
    spark: ["M75 98l19 6", "M125 104l19-6", "M88 129c14 13 34 13 48-1"],
    bright: ["M76 98c6 5 12 5 18 0", "M125 98c6 5 12 5 18 0", "M88 129c15 12 35 12 50 0"],
    sharp: ["M74 103l21-7", "M124 96l21 7", "M92 129c12 4 25 4 37 0"],
    smirk: ["M77 101h16", "M127 99l17 5", "M91 128c17 12 32 5 45-4"],
    soft: ["M78 100c5 4 10 4 15 0", "M126 100c5 4 10 4 15 0", "M93 130c12 6 26 6 39 0"],
    steady: ["M76 101h18", "M125 101h18", "M93 129h38"],
    hard: ["M74 104l22-8", "M123 96l22 8", "M94 131c10 2 22 2 33 0"],
    stern: ["M76 102l19-5", "M124 97l19 5", "M94 130h35"],
    knowing: ["M78 101h15", "M127 97l16 5", "M91 128c16 8 30 5 42-3"],
    danger: ["M73 105l23-10", "M123 95l23 10", "M91 131c14 8 31 3 44-5"]
  }[mood] || faceLines("calm");
}

function energyShape(side, accent) {
  const left = side === "left";
  const x = left ? 22 : 168;
  return `
    <path d="M${x} 54l18-22-5 25 17-3-27 36 7-28-20 6Z" fill="${accent}" stroke="#090b10" stroke-width="4" stroke-linejoin="round"/>
    <circle cx="${left ? 28 : 190}" cy="166" r="15" fill="${accent}" opacity=".78" stroke="#090b10" stroke-width="4"/>
    <path d="M${left ? 19 : 181} 166h18M${left ? 28 : 190} 157v18" stroke="#f7f3da" stroke-width="4" stroke-linecap="round"/>
  `;
}

function portraitSvg(spec, label) {
  const [skin, hair, suit, mood, style, accent, side] = spec;
  const [leftEye, rightEye, mouth] = faceLines(mood);
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 220 220" role="img" aria-label="${label} portrait">
  <defs>
    <linearGradient id="back" x1="0" x2="1" y1="0" y2="1">
      <stop offset="0" stop-color="#27303f"/>
      <stop offset=".58" stop-color="#151922"/>
      <stop offset="1" stop-color="#0b0d13"/>
    </linearGradient>
    <pattern id="scan" width="10" height="10" patternUnits="userSpaceOnUse">
      <path d="M0 9h10" stroke="#ffffff" stroke-opacity=".08" stroke-width="1"/>
      <circle cx="2" cy="2" r="1" fill="#ffffff" opacity=".08"/>
    </pattern>
    <clipPath id="frameClip">
      <rect x="13" y="13" width="194" height="194" rx="4"/>
    </clipPath>
  </defs>
  <rect width="220" height="220" fill="#07090f"/>
  <rect x="8" y="8" width="204" height="204" rx="4" fill="#222a36" stroke="#090b10" stroke-width="8"/>
  <g clip-path="url(#frameClip)">
    <rect x="13" y="13" width="194" height="194" fill="url(#back)"/>
    <rect x="13" y="13" width="194" height="194" fill="url(#scan)"/>
    <path d="M-14 190 234 99v114H-14Z" fill="${accent}" opacity=".22"/>
    <path d="M13 13h194v30H13Z" fill="${accent}"/>
    <path d="M13 43h194" stroke="#090b10" stroke-width="6"/>
    <path d="M13 184h194v23H13Z" fill="#11151f"/>
    <path d="M28 195h70" stroke="${accent}" stroke-width="7" stroke-linecap="round"/>
    ${energyShape(side, accent)}
    <path d="M38 205c8-43 34-69 72-69s64 26 72 69H38Z" fill="${suit}" stroke="#090b10" stroke-width="8" stroke-linejoin="round"/>
    <path d="M73 149h74l-37 42-37-42Z" fill="#f3edda" stroke="#090b10" stroke-width="6" stroke-linejoin="round"/>
    <path d="${hairPath(style)}" fill="${hair}" stroke="#090b10" stroke-width="8" stroke-linejoin="round"/>
    <ellipse cx="110" cy="106" rx="48" ry="53" fill="${skin}" stroke="#090b10" stroke-width="8"/>
    <path d="M70 86c18-19 61-24 88 0" fill="none" stroke="${hair}" stroke-width="19" stroke-linecap="round"/>
    <path d="${leftEye}" fill="none" stroke="#090b10" stroke-width="7" stroke-linecap="round"/>
    <path d="${rightEye}" fill="none" stroke="#090b10" stroke-width="7" stroke-linecap="round"/>
    <path d="M109 105c-2 11-5 20-10 27 7 4 15 4 22 0" fill="none" stroke="#090b10" stroke-width="4" stroke-linecap="round"/>
    <path d="${mouth}" fill="none" stroke="#090b10" stroke-width="5" stroke-linecap="round"/>
    <path d="M48 16h39M144 16h48M31 31h20" stroke="#f7f3da" stroke-width="5" stroke-linecap="round" opacity=".75"/>
  </g>
</svg>
`;
}

function writeSvg(filePath, svg) {
  fs.writeFileSync(filePath, svg, "utf8");
}

Object.entries(npcSpecs).forEach(([name, spec]) => {
  writeSvg(path.join(portraitDir, `${name}.svg`), portraitSvg(spec, name));
});

Object.entries(avatarSpecs).forEach(([group, specs]) => {
  specs.forEach((spec, index) => {
    writeSvg(path.join(avatarDir, `${group}-${index + 1}.svg`), portraitSvg(spec, `${group} avatar ${index + 1}`));
  });
});

console.log(`Generated ${Object.keys(npcSpecs).length} NPC portraits and ${Object.values(avatarSpecs).flat().length} player avatars.`);
