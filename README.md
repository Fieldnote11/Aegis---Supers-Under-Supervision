# Aegis: Supers Under Supervision

A static JavaScript choices-matter game adapted from the provided Aegis source material.

Open `index.html` in a browser to play. No build step is required.

Story editing notes are in `docs/story-authoring.md`, with copy/paste scene patterns in `docs/story-templates.js`.

## Technical Shape

- Static browser app: `index.html`, `style.css`, `story.js`, `story-expansion.js`, `story-deepening.js`, `game.js`
- Open Game menu with autosave recovery, manual save selection, and New Game flow
- Character creation: player name, gender presentation, light pronoun selection, 5 icon choices per presentation, scalable power selection, and optional mature-scene toggle
- Character ages are explicit: the main character is fixed at 24, the trainee cohort is mid-to-late 20s, and older NPCs use mature age bands
- Autosave after each choice using `localStorage`
- Three manual save slots
- Chapter restart without free backtracking
- Pause menu with save/load, autosave recovery, dark mode, repeatable free-time tasks, and story progress
- Program clock: story movements consume 15-30 in-game minutes, training tasks take about an hour, and rest blocks take two hours
- Fatigue system: pushing too long creates a temporary control/restraint/resolve penalty until the player rests
- Story data separated from engine code
- Deterministic flags, stats, relationships, hidden consequences, conditional choices
- Dispatch-style chapter-complete summaries with outcome, power growth, bond shifts, consequences, and status
- Internal NPC dossiers with ages, pronouns, powers, relationship dimensions, romance status, memory, and agency notes; player-facing UI only shows vague bond signals
- Relationship dimensions track trust, attraction, respect, friction, and concern alongside the legacy relationship score
- NPC agency can create consequences when the player becomes too frightening, careless, lethal, or emotionally tangled
- Power leveling through mandatory story training, optional story choices, and repeatable free-time drills, with milestone unlocks instead of a power tree
- Repeatable tasks include control drills, restraint conditioning, overcharge testing, scenario review, recovery, and core-four relationship check-ins
- Player stat circle covering Power, Control, Restraint, Instinct, Insight, and Resolve
- Combat/after-action status reports after major fights
- Comic-panel UI with reusable SVG backgrounds, local PNG portraits, and avatar slots
- Portrait/avatar assets live in `assets/portraits` and `assets/avatars`; source uploads/sheets are preserved under `assets/source`
- Story validation lives in `scripts/validate-story.js` and checks graph links, orphaned scenes, asset paths, service worker cache coverage, and randomized playthroughs
- Relationship routes are choice-driven: Piper, Camille, Julian, and Theo all have romance flags, continuation choices, and ending payoffs, with Piper still available as slow-burn or trusted partner
- Romance boundaries support sparks, slow burns, commitments, multi-romance tension, and route-specific ethical limits
- Training choices affect later crisis options: heat, cold, absorption, restraint, containment, showmanship, and power level can unlock or reshape fight choices
- Major power moments include bespoke flavor for energy, gravity, chronal, bio, tech, and spatial powers
- Power choices have early training implications, crisis text, finale interpretation, and different pressure in key tests
- The core relationship cast's powers visibly mature across later chapters when the player invests in them
- Finale paths are gated by accumulated play: sanctioned hero, Aegis contractor, independent operator, foundation/corporate power, villainous self-rule, civilian control, or an unresolved open path
- Endings include a "Why This Ending" report summarizing route pressure, strongest bond, romance state, power level, and key consequences

## Chapter Spine

1. Pressure Cooker
2. Five Hundred Degrees
3. Sim Block C
4. Break Thermo
5. Unscheduled Field Test
6. The Event Horizon
7. Bait Wrapped In Bureaucracy
8. Mach Five
9. Last Night In The Dorm
10. The Difficult Position

The pilot currently adapts the intake-to-graduation arc and leaves clear hooks for the post-Aegis Meridian/Robin Hood operation.

## Mobile Playtest

This can be sent to testers as a static web folder or zip. For mobile without an app store, host the folder on an HTTPS static host such as Netlify, GitHub Pages, or itch.io. Mobile browsers can then use Add to Home Screen; saves remain local to that browser/device.

## Validation

Run the local checks before sending a build:

```powershell
node --check game.js
node --check story.js
node --check story-expansion.js
node --check story-deepening.js
node --check sw.js
node --check scripts/generate-portraits.js
node --check scripts/validate-story.js
node --check scripts/browser-smoke.js
node --check docs/story-templates.js
node scripts/validate-story.js
node scripts/browser-smoke.js
```

## Current Manuscript Scale

The current playable manuscript is about 20k unique story words before repeatable task text and replayed branches. The new deepening layer adds 50 chapter beat scenes and gives every chapter a longer runway, but this is still not yet a true 30-minute chapter draft. Hitting that target across ten chapters likely means continuing the manuscript toward roughly 45k-60k unique playable words, with more branch-specific scenes rather than repeated filler.
