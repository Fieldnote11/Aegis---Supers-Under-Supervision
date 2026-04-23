# Story Authoring

The story is data-driven JavaScript. The browser loads the story files first, then the engine:

1. `story.js`
2. `story-expansion.js`
3. `story-deepening.js`
4. `game.js`

The base story lives in `story.js` under `window.AEGIS_STORY`.

The current expansion pass lives in `story-expansion.js`. It loads after `story.js`, adds extra scenes, and redirects existing choices into those scenes. Use it for add-on chapter material when you want to preserve the original base file.

The deepening pass lives in `story-deepening.js`. It loads after `story-expansion.js`, inserts five extra beats into each chapter, updates chapter restart points, and then rejoins the existing story.

## File Roles

- `story.js`: canonical base story object. Contains `chapters`, `characters`, `backgrounds`, the original `scenes`, default stats/status/relationships, and the initial scene id.
- `story-expansion.js`: additive layer. It mutates `window.AEGIS_STORY` after the base file loads, adds more scenes, and redirects some existing choices through those scenes.
- `story-deepening.js`: second additive layer. It adds extra chapter beats and changes chapter starts/rejoin points.
- `game.js`: engine and UI. It handles saves, state normalization, conditions, effects, power leveling, relationships, clock/fatigue, free-time tasks, and rendering.
- `docs/story-templates.js`: examples only. It is not loaded by the game.

For outside review, give Claude these files first:

```text
story.js
story-expansion.js
story-deepening.js
game.js
docs/story-authoring.md
docs/story-templates.js
scripts/validate-story.js
```

The story is not one file anymore. Treat `story.js` as the base and the other two story files as patches layered on top.

## How Branching Works

Every scene has an id and a `choices` array. A choice usually points to its next scene with `next: "scene_id"`.

Choices can also use conditional next routing:

```js
next: {
  default: "standard_scene",
  cases: [
    {
      conditions: [{ type: "flag", key: "rheaContained" }],
      scene: "contained_scene"
    }
  ]
}
```

The engine evaluates visible choices through `conditions`, applies `effects`, advances the clock, then enters the resolved next scene.

Edit these areas:

- `chapters`: chapter order and each chapter's starting scene.
- `characters`: NPC ages, pronouns, powers, roles, and portrait paths.
- `scenes`: all playable story cards, choices, branch logic, and consequences.

For copy/paste examples, open `docs/story-templates.js`. It is not loaded by the game; it is only an authoring scratchpad.

Each scene looks like this:

```js
scene_id_here: {
  chapter: 2,
  title: "Scene Title",
  location: "Aegis Point",
  background: "aegis",
  focus: "Piper",
  variants: [
    {
      conditions: [{ type: "flag", key: "metPiper" }],
      text: ["This paragraph appears only if the condition is true."]
    }
  ],
  text: [
    "Main paragraph one.",
    "Main paragraph two."
  ],
  choices: [
    {
      text: "Choice text the player sees.",
      timeMinutes: 30,
      effects: [
        { type: "relationship", key: "Piper", delta: 2 },
        { type: "stat", key: "control", delta: 1 },
        { type: "flag", key: "metPiper", value: true }
      ],
      next: "next_scene_id"
    }
  ]
}
```

## Adding A Scene

1. Add a new scene object inside `scenes`.
2. Give it a unique id such as `c03_piper_rooftop`.
3. Point an existing choice's `next` to that id.
4. Run `node scripts/validate-story.js`.

When adding scenes in `story-expansion.js`, the helper at the top can redirect existing choices:

```js
redirect("existing_scene_id", "old_next_scene_id", "new_scene_id");
```

Then make sure the new scene eventually points back to the intended route.

## Branching

Use `conditions` to show choices or text only when a previous choice made it valid.

Common conditions:

- `{ type: "flag", key: "piperRomance" }`
- `{ type: "notFlag", key: "piperRomance" }`
- `{ type: "relationshipAtLeast", key: "Camille", value: 6 }`
- `{ type: "statAtLeast", key: "control", value: 4 }`
- `{ type: "powerIs", value: "gravity" }`
- `{ type: "powerLevelAtLeast", value: 4 }`
- `{ type: "matureContent" }`

Use `any` when more than one route should unlock the same choice:

```js
conditions: [
  {
    type: "any",
    conditions: [
      { type: "flag", key: "trainedContainment" },
      { type: "statAtLeast", key: "restraint", value: 5 }
    ]
  }
]
```

## Effects

Common effects:

- `{ type: "relationship", key: "Theo", delta: 2 }`
- `{ type: "stat", key: "restraint", delta: 1 }`
- `{ type: "flag", key: "theoTrusted", value: true }`
- `{ type: "powerXp", amount: 2 }`
- `{ type: "status", key: "stress", value: "High" }`
- `{ type: "memory", key: "Piper", text: "You defended her in front of Camille." }`

Choices can also set `timeMinutes`. If omitted, the engine assigns 15 or 30 in-game minutes. Chapter transitions default to 30 minutes.

## Repeatable Tasks

Repeatable free-time tasks are engine-side gameplay, not story cards. Edit them in `game.js` under `FREE_TIME_TASKS`.

Each task can:

- Add stats or power XP.
- Adjust status.
- Raise a core-four relationship.
- Add a transcript entry when used.
- Consume time and add fatigue.

Training tasks are currently about 60 minutes, overcharge testing is 75 minutes, bond/check-in activities are 45 minutes, and rest blocks are 120 minutes. Rest clears the fatigue penalty and does not spend an activity slot.

The per-chapter activity budget is controlled by `chapterTaskLimit(scene)` in `game.js`. Fatigue penalties are temporary derived penalties, so resting clears them without permanently damaging the player's stats.

## Coherence Rule

When a scene can be reached from multiple earlier choices, do not assume the player has met a named character unless every route to that scene introduces them first.

Use a `variant` with `notFlag` to introduce someone if needed, or write the scene so it introduces the person in the main text.

## Validation

Run these after story edits:

```powershell
node --check story.js
node --check story-expansion.js
node --check story-deepening.js
node --check game.js
node scripts/validate-story.js
```

The validation script loads all story layers, checks missing `next` targets, unreachable/orphaned scenes, zero-incoming scenes, portrait/background/avatar assets, service worker cache coverage, chapter word counts, and randomized playthroughs across all player powers.

## Mobile

The game is a static web app. It can be hosted on Netlify, GitHub Pages, itch.io, or any HTTPS static host. `manifest.webmanifest` and `sw.js` let mobile browsers offer Add to Home Screen when hosted over HTTPS.
