const fs = require("fs");
const vm = require("vm");

const STORY_FILES = ["story.js", "story-expansion.js", "story-deepening.js"];
const POWERS = ["energy", "gravity", "chronal", "bio", "tech", "space"];

function loadStory() {
  const ctx = { window: {} };
  STORY_FILES.forEach((file) => {
    vm.runInNewContext(fs.readFileSync(file, "utf8"), ctx, { filename: file });
  });
  return ctx.window.AEGIS_STORY;
}

function nextIds(next) {
  if (!next) return [];
  if (typeof next === "string") return [next];
  const out = [];
  if (next.default) out.push(next.default);
  (next.cases || []).forEach((item) => {
    if (item.scene) out.push(item.scene);
  });
  return out;
}

function graphReport(story) {
  const ids = new Set(Object.keys(story.scenes));
  const refs = [];
  Object.entries(story.scenes).forEach(([id, scene]) => {
    (scene.choices || []).forEach((choice, index) => {
      nextIds(choice.next).forEach((next) => refs.push([id, index, next]));
    });
  });

  const missing = refs.filter((item) => !ids.has(item[2]));
  const seen = new Set();
  function walk(id) {
    if (!ids.has(id) || seen.has(id)) return;
    seen.add(id);
    (story.scenes[id].choices || []).forEach((choice) => nextIds(choice.next).forEach(walk));
  }
  walk(story.initialScene);

  const orphans = [...ids].filter((id) => !seen.has(id)).sort();
  const incoming = {};
  ids.forEach((id) => { incoming[id] = 0; });
  refs.forEach(([, , next]) => {
    if (incoming[next] != null) incoming[next] += 1;
  });
  const zeroIncoming = Object.entries(incoming)
    .filter(([id, count]) => id !== story.initialScene && count === 0)
    .map(([id]) => id)
    .sort();

  return { scenes: ids.size, refs: refs.length, missing, orphans, zeroIncoming };
}

function wordReport(story) {
  const rows = [];
  let totalWords = 0;
  let totalScenes = 0;
  let totalChoices = 0;
  story.chapters.forEach((chapter) => {
    let scenes = 0;
    let words = 0;
    let choices = 0;
    Object.values(story.scenes).forEach((scene) => {
      if (scene.chapter !== chapter.id) return;
      scenes += 1;
      const texts = [...(scene.text || [])];
      (scene.variants || []).forEach((variant) => texts.push(...(variant.text || [])));
      (scene.choices || []).forEach((choice) => {
        texts.push(choice.text || "");
        choices += 1;
      });
      words += texts.join(" ").split(/\s+/).filter(Boolean).length;
    });
    totalWords += words;
    totalScenes += scenes;
    totalChoices += choices;
    rows.push({ chapter: chapter.id, title: chapter.title, scenes, choices, words });
  });
  return { rows, totalWords, totalScenes, totalChoices };
}

function rng(seed) {
  return () => {
    seed = (seed * 1664525 + 1013904223) >>> 0;
    return seed / 4294967296;
  };
}

function simulate(story, power, seed) {
  const random = rng(seed);
  const state = {
    scene: story.initialScene,
    flags: {},
    stats: { ...story.defaultStats },
    relationships: { ...story.defaultRelationships },
    power: { id: power, level: 1 },
    matureContent: random() > 0.5
  };

  function check(condition) {
    if (condition.type === "any") return (condition.conditions || []).some(check);
    if (condition.type === "all") return (condition.conditions || []).every(check);
    if (condition.type === "flag") return Boolean(state.flags[condition.key]);
    if (condition.type === "notFlag") return !state.flags[condition.key];
    if (condition.type === "statAtLeast") return (state.stats[condition.key] || 0) >= condition.value;
    if (condition.type === "statBelow") return (state.stats[condition.key] || 0) < condition.value;
    if (condition.type === "relationshipAtLeast") return (state.relationships[condition.key] || 0) >= condition.value;
    if (condition.type === "relationshipBelow") return (state.relationships[condition.key] || 0) < condition.value;
    if (condition.type === "powerIs") return state.power.id === condition.value;
    if (condition.type === "powerLevelAtLeast") return state.power.level >= condition.value;
    if (condition.type === "matureContent") return state.matureContent;
    if (condition.type === "npcAtLeast") return true;
    return true;
  }

  function apply(effects) {
    (effects || []).forEach((effect) => {
      if (effect.type === "flag") state.flags[effect.key] = effect.value;
      if (effect.type === "stat") state.stats[effect.key] = (state.stats[effect.key] || 0) + effect.delta;
      if (effect.type === "relationship") state.relationships[effect.key] = (state.relationships[effect.key] || 0) + effect.delta;
      if (effect.type === "powerXp") state.power.level = Math.min(10, state.power.level + Math.ceil((effect.amount || 0) / 6));
    });
  }

  function resolveNext(choice) {
    const next = choice.next;
    if (typeof next === "string") return next;
    const found = (next.cases || []).find((item) => (item.conditions || []).every(check));
    return found ? found.scene : next.default;
  }

  const path = [];
  for (let step = 0; step < 360; step += 1) {
    const scene = story.scenes[state.scene];
    if (!scene) return { ok: false, reason: `missing ${state.scene}`, path };
    path.push(state.scene);
    if (scene.ending) return { ok: true, steps: step + 1, path };
    const choices = (scene.choices || []).filter((choice) => (choice.conditions || []).every(check));
    if (!choices.length) return { ok: false, reason: `no visible choices at ${state.scene}`, path };
    const choice = choices[Math.floor(random() * choices.length)];
    apply(choice.effects);
    state.scene = resolveNext(choice);
  }
  return { ok: false, reason: "step limit", path };
}

function assetReport(story) {
  const files = new Set();
  Object.values(story.backgrounds || {}).forEach((file) => files.add(file));
  Object.values(story.characters || {}).forEach((character) => {
    if (character.portrait) files.add(character.portrait);
  });
  ["male", "female"].forEach((group) => {
    for (let i = 1; i <= 5; i += 1) files.add(`assets/avatars/${group}-${i}.png`);
  });
  files.add("assets/aegis-mark.svg");

  const missing = [...files].filter((file) => !fs.existsSync(file));
  const serviceWorker = fs.existsSync("sw.js") ? fs.readFileSync("sw.js", "utf8") : "";
  const uncached = [...files].filter((file) => !serviceWorker.includes(`"./${file}"`));
  return { checked: files.size, missing, uncached };
}

function main() {
  const story = loadStory();
  const graph = graphReport(story);
  const words = wordReport(story);
  const assets = assetReport(story);

  console.log(`Story graph: ${graph.scenes} scenes, ${graph.refs} refs, ${graph.missing.length} missing, ${graph.orphans.length} orphaned, ${graph.zeroIncoming.length} zero-incoming.`);
  words.rows.forEach((row) => {
    console.log(`Chapter ${row.chapter}: ${row.scenes} scenes, ${row.choices} choices, ~${row.words} words`);
  });
  console.log(`Totals: ${words.totalScenes} scenes, ${words.totalChoices} choices, ~${words.totalWords} words`);
  console.log(`Assets: ${assets.checked} checked, ${assets.missing.length} missing, ${assets.uncached.length} not in service worker cache.`);

  const failures = [];
  POWERS.forEach((power) => {
    for (let seed = 1; seed <= 50; seed += 1) {
      const result = simulate(story, power, seed);
      if (!result.ok) {
        failures.push({ power, seed, reason: result.reason, tail: result.path.slice(-8) });
        break;
      }
    }
  });
  console.log(`Random playthroughs: ${POWERS.length * 50 - failures.length} / ${POWERS.length * 50} reached endings.`);

  const problems = [
    ...graph.missing.map((item) => `Missing next target from ${item[0]} choice ${item[1]} -> ${item[2]}`),
    ...graph.orphans.map((item) => `Unreachable scene: ${item}`),
    ...graph.zeroIncoming.map((item) => `Zero incoming scene: ${item}`),
    ...assets.missing.map((item) => `Missing asset: ${item}`),
    ...assets.uncached.map((item) => `Asset not cached by sw.js: ${item}`),
    ...failures.map((item) => `Playthrough failed for ${item.power}/${item.seed}: ${item.reason} tail=${item.tail.join(" > ")}`)
  ];

  if (problems.length) {
    console.error(problems.join("\n"));
    process.exit(1);
  }
}

main();
