# Story Authoring

The story is data-driven JavaScript. The browser loads the story files first, then the engine:

1. `story.js`
2. `story-expansion.js`
3. `story-deepening.js`
4. `story-hubs.js`
5. `game.js`

The base story lives in `story.js` under `window.AEGIS_STORY`.

The current expansion pass lives in `story-expansion.js`. It loads after `story.js`, adds extra scenes, and redirects existing choices into those scenes. Use it for add-on chapter material when you want to preserve the original base file.

The deepening pass lives in `story-deepening.js`. It loads after `story-expansion.js`, inserts five extra beats into each chapter, updates chapter restart points, and then rejoins the existing story.

The hub exploration pass lives in `story-hubs.js`. It loads after the deepening pass, adds the chapter-by-chapter location layer, defines current assignments, and redirects selected story beats into hub exploration.

## File Roles

- `story.js`: canonical base story object. Contains `chapters`, `characters`, `backgrounds`, the original `scenes`, default stats/status/relationships, and the initial scene id.
- `story-expansion.js`: additive layer. It mutates `window.AEGIS_STORY` after the base file loads, adds more scenes, and redirects some existing choices through those scenes.
- `story-deepening.js`: second additive layer. It adds extra chapter beats and changes chapter starts/rejoin points.
- `story-hubs.js`: hub/location layer. It defines `window.AEGIS_HUBS`, hub activation scenes, location data, assignment targets, optional interactions, and chapter exploration redirects.
- `game.js`: engine and UI. It handles saves, state normalization, conditions, effects, power leveling, relationships, clock/fatigue, free-time tasks, and rendering.
- `docs/story-templates.js`: examples only. It is not loaded by the game.

For outside review, give Claude these files first:

```text
story.js
story-expansion.js
story-deepening.js
story-hubs.js
game.js
docs/story-authoring.md
docs/story-templates.js
scripts/validate-story.js
```

The story is not one file anymore. Treat `story.js` as the base and the other story files as patches layered on top.

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

Hub scenes are different: a scene with a `hub` object activates location exploration instead of ordinary story choices. The visible choices come from `window.AEGIS_HUBS.locations`.

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

## Hub And Location Authoring

The hub layer lives in `story-hubs.js`. It has two parts:

- Hub activation scenes inside `window.AEGIS_STORY.scenes`.
- Location/assignment data inside `window.AEGIS_HUBS`.

A hub activation scene looks like this:

```js
c01_hub_orientation: {
  chapter: 1,
  title: "Find Your Feet",
  location: "Intake Hall",
  background: "aegis",
  focus: "Seth",
  hub: {
    assignmentId: "c01_report_orientation",
    locationId: "intake_hall"
  },
  text: [
    "Story prose that introduces the playable exploration beat."
  ],
  choices: []
}
```

The empty `choices` array is intentional. Once `hub` is active, the engine renders location actions and exits instead of normal scene choices.

### Adding A Current Assignment

Assignments tell the player what advances the plot:

```js
c01_report_orientation: {
  title: "Report To Orientation",
  detail: "Lecture Hall A is ready when you are.",
  targetLocation: "lecture_hall",
  targetAction: "attend-orientation",
  chapter: 1
}
```

The target action should live on the target location:

```js
{
  id: "attend-orientation",
  label: "Attend orientation",
  detail: "Follow the current assignment and let Vance explain the rules out loud.",
  assignmentId: "c01_report_orientation",
  timeMinutes: 30,
  fatigue: 0.4,
  completeAssignment: true,
  nextScene: "c01_orientation",
  effects: [
    { type: "flag", key: "reportedToOrientation", value: true }
  ]
}
```

When the player clicks that action, effects apply, time/fatigue update, autosave runs, the assignment is marked complete, and the story routes into `nextScene`.

### Adding A Location

Locations live under `window.AEGIS_HUBS.locations`:

```js
training_wing: {
  name: "Training Wing",
  region: "Aegis Point",
  background: "sim",
  conditions: [{ type: "chapterAtLeast", value: 2 }],
  description: [
    "First-visit description."
  ],
  returnDescription: [
    "Return-visit description."
  ],
  exits: [
    "common_lounge",
    "simulation_block",
    { location: "records_annex", hidden: true, conditions: [{ type: "flag", key: "foundRecordsAnnex" }] }
  ],
  actions: []
}
```

Use `conditions` for locked locations. If `hidden: true`, the location will not appear until its conditions are true. If it is not hidden, blocked exits appear disabled with `lockedText`.

### Adding An Interaction

A one-time local interaction:

```js
{
  id: "read-safety-wall",
  label: "Memorize the safety parameters",
  detail: "Every warning was written because someone made it necessary.",
  once: true,
  timeMinutes: 15,
  fatigue: 0,
  text: [
    "The safety wall is gentle and merciless."
  ],
  effects: [
    { type: "stat", key: "control", delta: 1 },
    { type: "flag", key: "memorizedSafetyWall", value: true }
  ]
}
```

A repeatable training activity:

```js
{
  id: "hub-control-loop",
  label: "Train power: control loop",
  detail: "Small output, clean stop, no audience worth impressing.",
  repeatLimit: 2,
  timeMinutes: 60,
  fatigue: 2,
  text: [
    "You teach the power to use an indoor voice."
  ],
  effects: [
    { type: "stat", key: "control", delta: 1 },
    { type: "powerXp", amount: 1 }
  ]
}
```

Use the `Train power:` label pattern for player-owned power growth. These actions should spend meaningful time, add fatigue, and include `powerXp` so the player can clearly connect training decisions to power leveling.

### Routing Into A Story Conversation

Use `nextScene` when an interaction should become an interactive story card with choices:

```js
{
  id: "piper-lounge-chat",
  label: "Talk to Piper before the couch claims you",
  detail: "She has been treating gravity like a light suggestion.",
  once: true,
  hidden: true,
  conditions: [{ type: "notFlag", key: "piperRulesTalk" }],
  nextScene: "c01_chat_piper_lounge"
}
```

Then make `c01_chat_piper_lounge` a normal story scene with choices. Each choice should route back to a hub return scene:

```js
{
  text: "Ask which rules are actually about safety and which ones are about control.",
  effects: [
    { type: "relationship", key: "Piper", delta: 1 },
    { type: "npc", key: "Piper", trust: 1, respect: 1 },
    { type: "flag", key: "piperRulesTalk", value: true }
  ],
  timeMinutes: 20,
  next: "c01_hub_return_common"
}
```

The return scene has its own `hub` object and reopens exploration in the right location.

### Hub Conditions

Hub actions and exits can use the same conditions as story choices, plus these hub-friendly checks:

- `{ type: "chapterAtLeast", value: 2 }`
- `{ type: "chapterBefore", value: 5 }`
- `{ type: "assignmentIs", value: "c02_report_baseline" }`
- `{ type: "locationVisited", value: "cafeteria" }`
- `{ type: "actionDone", value: "read-safety-wall" }`
- `{ type: "notActionDone", value: "read-safety-wall" }`
- `{ type: "actionCountAtLeast", value: "hub-control-loop", count: 2 }`

Keep early relationship deltas small. A first conversation should usually be `relationship +1`, an NPC dimension shift, a flag, or friction. Save larger visible bond changes for repeated choices and later chapters.

## Coherence Rule

When a scene can be reached from multiple earlier choices, do not assume the player has met a named character unless every route to that scene introduces them first.

Use a `variant` with `notFlag` to introduce someone if needed, or write the scene so it introduces the person in the main text.

## Validation

Run these after story edits:

```powershell
node --check story.js
node --check story-expansion.js
node --check story-deepening.js
node --check story-hubs.js
node --check game.js
node scripts/validate-story.js
```

The validation script loads all story layers, checks missing `next` targets, unreachable/orphaned scenes, zero-incoming scenes, portrait/background/avatar assets, service worker cache coverage, chapter word counts, and randomized playthroughs across all player powers.

## Mobile

The game is a static web app. It can be hosted on Netlify, GitHub Pages, itch.io, or any HTTPS static host. `manifest.webmanifest` and `sw.js` let mobile browsers offer Add to Home Screen when hosted over HTTPS.
