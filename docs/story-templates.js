// Copy/paste examples for adding branches to Aegis.
// These snippets are examples only; do not load this file in index.html.

const storyTemplates = {
// 1. Basic scene.
basic_scene_id: {
  chapter: 3,
  title: "Rooftop Calibration",
  location: "Aegis Rooftop",
  background: "aegis",
  focus: "Piper",
  text: [
    "Piper leans on the roof rail like gravity is a rumor she only partly respects.",
    "The city glows beyond Aegis Point, close enough to tempt and far enough to stay theoretical."
  ],
  choices: [
    {
      text: "Ask what she does when speed stops being fun.",
      timeMinutes: 30,
      effects: [
        { type: "relationship", key: "Piper", delta: 2 },
        { type: "flag", key: "askedPiperSpeedCost", value: true }
      ],
      next: "next_scene_id"
    }
  ]
},

// 2. Conditional scene text.
conditional_variant_scene: {
  chapter: 4,
  title: "After The Drill",
  location: "Sim Hallway",
  background: "sim",
  focus: "Camille",
  variants: [
    {
      conditions: [{ type: "flag", key: "camilleWarmup" }],
      text: ["Camille notices you used her warm-up sequence. She does not praise it. She also does not need to."]
    },
    {
      conditions: [{ type: "notFlag", key: "camilleWarmup" }],
      text: ["Camille glances at your breathing and files several opinions without saying any of them yet."]
    }
  ],
  text: [
    "The drill ends, but the pressure of it stays in the room."
  ],
  choices: [
    {
      text: "Ask for the critique before anyone softens it.",
      effects: [
        { type: "relationship", key: "Camille", delta: 1 },
        { type: "stat", key: "control", delta: 1 }
      ],
      next: "next_scene_id"
    }
  ]
},

// 3. Gated choices.
gated_choice_scene: {
  chapter: 6,
  title: "The Bad Probability",
  location: "Strategy Room",
  background: "aegis",
  focus: "Theo",
  text: [
    "Theo leaves one branch of the model unnamed until you ask."
  ],
  choices: [
    {
      text: "Ask Theo for the branch he is avoiding.",
      conditions: [{ type: "relationshipAtLeast", key: "Theo", value: 5 }],
      effects: [
        { type: "relationship", key: "Theo", delta: 2 },
        { type: "flag", key: "theoNamedWorstBranch", value: true }
      ],
      next: "theo_confession_scene"
    },
    {
      text: "Run the model yourself and look for the ugly number.",
      conditions: [{ type: "statAtLeast", key: "control", value: 5 }],
      effects: [
        { type: "stat", key: "contractorPath", delta: 1 },
        { type: "flag", key: "foundWorstBranchAlone", value: true }
      ],
      next: "model_scene"
    },
    {
      text: "Use the new power unlock to test the safer route.",
      conditions: [{ type: "powerLevelAtLeast", value: 4 }],
      effects: [
        { type: "powerXp", amount: 1 },
        { type: "flag", key: "usedPowerUnlockInPlanning", value: true }
      ],
      next: "power_route_scene"
    }
  ]
},

// 4. Branching next target.
branching_next_scene: {
  chapter: 7,
  title: "After The Trap",
  location: "Medical Observation",
  background: "aegis",
  focus: "Vance",
  text: [
    "The same question lands differently depending on what happened in the dome."
  ],
  choices: [
    {
      text: "Ask what Aegis is going to call the outcome.",
      effects: [{ type: "relationship", key: "Vance", delta: 1 }],
      next: {
        default: "standard_review_scene",
        cases: [
          {
            conditions: [{ type: "flag", key: "rheaErased" }],
            scene: "lethal_review_scene"
          },
          {
            conditions: [{ type: "flag", key: "rheaContained" }],
            scene: "containment_review_scene"
          },
          {
            conditions: [{ type: "flag", key: "rheaEscaped" }],
            scene: "escape_review_scene"
          }
        ]
      }
    }
  ]
}
};

// 5. Training/free-time activity shape. Edit FREE_TIME_TASKS in game.js.
const exampleTask = {
  id: "anchor-breathing",
  title: "Anchor Breathing",
  kind: "Training",
  detail: () => "Run a low-output breathing sequence until the power stops answering every intrusive thought.",
  reward: "1 hour | Control +1, fatigue +1",
  duration: 60,
  fatigue: 1,
  effects: [
    { type: "stat", key: "control", delta: 1 },
    { type: "status", key: "stress", value: "Focused" }
  ],
  result: () => "The power does not get smaller. It gets less loud, which is sometimes better."
};
