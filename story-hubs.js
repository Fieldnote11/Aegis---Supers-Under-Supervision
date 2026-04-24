(function () {
  "use strict";

  const STORY = window.AEGIS_STORY;
  if (!STORY) return;
  const scenes = STORY.scenes;

  function redirect(sceneId, from, to) {
    const scene = scenes[sceneId];
    if (!scene || !scene.choices) return;
    scene.choices.forEach((choice) => {
      if (choice.next === from) choice.next = to;
      if (choice.next && choice.next.default === from) choice.next.default = to;
      if (choice.next && choice.next.cases) {
        choice.next.cases.forEach((item) => {
          if (item.scene === from) item.scene = to;
        });
      }
    });
  }

  function capEarlyRelationshipGains(sceneIds, maxDelta) {
    sceneIds.forEach((sceneId) => {
      const scene = scenes[sceneId];
      if (!scene || !scene.choices) return;
      scene.choices.forEach((choice) => {
        (choice.effects || []).forEach((effect) => {
          if (effect.type === "relationship" && effect.delta > maxDelta) {
            effect.delta = maxDelta;
          }
        });
      });
    });
  }

  Object.assign(scenes, {
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
        "Orientation is on your tablet now, which makes it feel less optional than the word voluntary ever did. Lecture Hall A is waiting across the intake level. So are the staff pretending the first hour tells them nothing.",
        "For the first time since the gate, nobody is physically moving you forward. Aegis Point opens around you in signs, glass corridors, security doors, vending machines, ocean glare, and the low hum of containment systems under the floor."
      ],
      choices: []
    },

    c01_hub_after_orientation: {
      chapter: 1,
      title: "Between Rules And Rumors",
      location: "Lecture Hall A",
      background: "aegis",
      focus: "Seth",
      hub: {
        assignmentId: "c01_find_lounge",
        locationId: "lecture_hall"
      },
      text: [
        "Orientation breaks apart into loose knots of residents. Staff stop hovering just enough to let the social weather declare itself. Your tablet has one friendly suggestion: find the common lounge before the evening schedule locks in.",
        "Aegis does not say it out loud, but this is a test too. People build alliances faster when nobody admits they are building them."
      ],
      choices: []
    },

    c01_hub_return_lecture: {
      chapter: 1,
      title: "Lecture Hall Drift",
      location: "Lecture Hall A",
      background: "aegis",
      focus: "Seth",
      hub: {
        assignmentId: "c01_find_lounge",
        locationId: "lecture_hall"
      },
      text: [
        "The lecture hall keeps emptying in stages. Every group that leaves makes the building feel less like a briefing and more like a place where your next choice can actually take root."
      ],
      choices: []
    },

    c01_hub_return_common: {
      chapter: 1,
      title: "Common Lounge Drift",
      location: "Common Lounge",
      background: "aegis",
      focus: "Seth",
      hub: {
        assignmentId: "c01_find_lounge",
        locationId: "common_lounge"
      },
      text: [
        "The common lounge keeps rearranging itself around jokes, glances, and people pretending not to wait for someone else to make the first real move."
      ],
      choices: []
    },

    c01_hub_return_cafeteria: {
      chapter: 1,
      title: "Cafeteria Drift",
      location: "Cafeteria",
      background: "aegis",
      focus: "Seth",
      hub: {
        assignmentId: "c01_find_lounge",
        locationId: "cafeteria"
      },
      text: [
        "The cafeteria noise settles back over you: trays, chairs, rumors, staff badges, and the particular silence that follows when someone with a volatile power laughs too loudly."
      ],
      choices: []
    },

    c01_hub_return_residence: {
      chapter: 1,
      title: "Residence Wing Drift",
      location: "Residence Wing",
      background: "aegis",
      focus: "Seth",
      hub: {
        assignmentId: "c01_find_lounge",
        locationId: "residence_wing"
      },
      text: [
        "The residence wing smells like fresh paint, laundry heat, and nervous people trying to make institutional hallways feel survivable."
      ],
      choices: []
    },

    c02_hub_baseline: {
      chapter: 2,
      title: "Before The Number",
      location: "Residence Wing",
      background: "aegis",
      focus: "Seth",
      hub: {
        assignmentId: "c02_report_baseline",
        locationId: "residence_wing"
      },
      text: [
        "Morning arrives with a baseline notification bright enough to feel personal. Simulation Block A is ready when you are, which is Aegis language for ready whether you are or not.",
        "The building has a different pressure before testing. Residents move with coffee, bravado, private rituals, and the small careful kindnesses people offer when nobody wants to be seen needing them."
      ],
      choices: []
    },

    c02_hub_return_cafeteria: {
      chapter: 2,
      title: "Breakfast Drift",
      location: "Cafeteria",
      background: "aegis",
      focus: "Seth",
      hub: {
        assignmentId: "c02_report_baseline",
        locationId: "cafeteria"
      },
      text: [
        "Breakfast keeps happening because the body is rude that way. Even dread needs calories, and Aegis appears to have standardized that into a laminated nutrition guide."
      ],
      choices: []
    },

    c02_hub_return_common: {
      chapter: 2,
      title: "Lounge Before Baseline",
      location: "Common Lounge",
      background: "aegis",
      focus: "Seth",
      hub: {
        assignmentId: "c02_report_baseline",
        locationId: "common_lounge"
      },
      text: [
        "The common lounge is quieter before baseline. The jokes still happen, but they are timed around people checking their tablets like the screens might change their fate out of politeness."
      ],
      choices: []
    },

    c02_hub_return_courtyard: {
      chapter: 2,
      title: "Courtyard Before Baseline",
      location: "Courtyard",
      background: "aegis",
      focus: "Seth",
      hub: {
        assignmentId: "c02_report_baseline",
        locationId: "courtyard"
      },
      text: [
        "Ocean air cuts through the courtyard and makes the whole facility feel briefly less sealed. Then a distant alarm chirps once, purely routine, and the spell breaks."
      ],
      choices: []
    },

    c02_hub_return_sim: {
      chapter: 2,
      title: "Simulation Block Queue",
      location: "Simulation Block A",
      background: "sim",
      focus: "Seth",
      hub: {
        assignmentId: "c02_report_baseline",
        locationId: "simulation_block"
      },
      text: [
        "The queue outside Simulation Block A moves by inches and nerve. Each door cycle swallows someone with a name and returns someone with a number."
      ],
      choices: []
    },

    c02_hub_return_observation: {
      chapter: 2,
      title: "Observation Hall Drift",
      location: "Observation Hall",
      background: "sim",
      focus: "Seth",
      hub: {
        assignmentId: "c02_report_baseline",
        locationId: "observation_hall"
      },
      text: [
        "The observation glass reflects you over the empty chamber beyond it. For a second, the reflection looks like another trainee waiting to see what you become."
      ],
      choices: []
    },

    c01_chat_piper_lounge: {
      chapter: 1,
      title: "Piper, Before The Couch",
      location: "Common Lounge",
      background: "aegis",
      focus: "Piper",
      text: [
        "Piper has claimed the back of a couch without sitting on it correctly. Her whole body points toward the nearest exit even while her grin pretends she is staying for the furniture.",
        "\"You look like you are deciding whether this place is a school, a prison, or a haunted office building,\" she says. \"Good news: it can multitask.\""
      ],
      choices: [
        {
          text: "Ask which rules are actually about safety and which ones are about control.",
          effects: [
            { type: "relationship", key: "Piper", delta: 1 },
            { type: "npc", key: "Piper", trust: 1, respect: 1, memory: "You asked which rules deserved respect instead of treating every shortcut like wisdom." },
            { type: "flag", key: "metPiper", value: true },
            { type: "flag", key: "piperRulesTalk", value: true }
          ],
          timeMinutes: 20,
          next: "c01_hub_return_common"
        },
        {
          text: "Tell her shortcuts sound useful, but harmless and safe are not the same thing.",
          effects: [
            { type: "stat", key: "control", delta: 1 },
            { type: "npc", key: "Piper", respect: 1, friction: 1, memory: "You challenged her favorite word for risk before you knew whether she would laugh it off." },
            { type: "flag", key: "metPiper", value: true },
            { type: "flag", key: "piperShortcutChallenged", value: true }
          ],
          timeMinutes: 20,
          next: "c01_hub_return_common"
        },
        {
          text: "Admit you are trying very hard not to look as overwhelmed as you feel.",
          effects: [
            { type: "relationship", key: "Piper", delta: 1 },
            { type: "npc", key: "Piper", trust: 1, concern: 1, memory: "You let her see the nerves under the intake face." },
            { type: "flag", key: "metPiper", value: true },
            { type: "flag", key: "piperSawNerves", value: true }
          ],
          timeMinutes: 20,
          next: "c01_hub_return_common"
        }
      ]
    },

    c01_chat_jordan_cafeteria: {
      chapter: 1,
      title: "Jordan, In The Line",
      location: "Cafeteria",
      background: "aegis",
      focus: "Jordan",
      text: [
        "Jordan Pike appears beside the vending machines with the confidence of someone who knows which cameras are decorative and which ones have opinions.",
        "\"First day tip,\" they say. \"Never trust the machine labeled protein pudding. It has committed crimes against texture.\""
      ],
      choices: [
        {
          text: "Ask what the room is saying about you when it thinks you cannot hear.",
          effects: [
            { type: "relationship", key: "Jordan", delta: 1 },
            { type: "npc", key: "Jordan", trust: 1, respect: 1, memory: "You asked for the shape of the room instead of asking whether people liked you." },
            { type: "flag", key: "metJordan", value: true },
            { type: "flag", key: "askedJordanRoomRead", value: true }
          ],
          timeMinutes: 20,
          next: "c01_hub_return_cafeteria"
        },
        {
          text: "Trade them one honest fear for one honest rumor.",
          effects: [
            { type: "relationship", key: "Jordan", delta: 1 },
            { type: "npc", key: "Jordan", trust: 1, concern: 1, memory: "You paid for gossip with truth instead of pretending you had none." },
            { type: "flag", key: "metJordan", value: true },
            { type: "flag", key: "tradedJordanFear", value: true }
          ],
          timeMinutes: 20,
          next: "c01_hub_return_cafeteria"
        },
        {
          text: "Tell them you are not ready to become anyone's headline.",
          effects: [
            { type: "stat", key: "restraint", delta: 1 },
            { type: "npc", key: "Jordan", respect: 1, friction: 1, memory: "You set a boundary before Jordan could turn you into material." },
            { type: "flag", key: "metJordan", value: true },
            { type: "flag", key: "jordanBoundarySet", value: true }
          ],
          timeMinutes: 15,
          next: "c01_hub_return_cafeteria"
        }
      ]
    },

    c01_chat_camille_lecture: {
      chapter: 1,
      title: "Camille, After The Rules",
      location: "Lecture Hall A",
      background: "aegis",
      focus: "Camille",
      text: [
        "Camille remains after orientation with a tablet balanced in one hand and Julian leaning nearby like the concept of witnesses owes him money.",
        "She does not introduce herself as important. She lets the silence do that and then says, \"You were watching the room instead of only the exits. That is not nothing.\""
      ],
      choices: [
        {
          text: "Ask what she saw that you missed.",
          effects: [
            { type: "relationship", key: "Camille", delta: 1 },
            { type: "npc", key: "Camille", trust: 1, respect: 1, memory: "You asked Camille for analysis before you asked for approval." },
            { type: "flag", key: "metCamille", value: true },
            { type: "flag", key: "askedCamilleWhatMissed", value: true }
          ],
          timeMinutes: 20,
          next: "c01_hub_return_lecture"
        },
        {
          text: "Tell her being watched makes people perform, and performance lies.",
          effects: [
            { type: "stat", key: "contractorPath", delta: 1 },
            { type: "npc", key: "Camille", respect: 1, friction: 1, memory: "You challenged the usefulness of observation while standing inside her favorite tool." },
            { type: "flag", key: "metCamille", value: true },
            { type: "flag", key: "camillePerformanceTheory", value: true }
          ],
          timeMinutes: 20,
          next: "c01_hub_return_lecture"
        },
        {
          text: "Say you are trying to learn the rules before deciding which ones deserve you.",
          effects: [
            { type: "relationship", key: "Camille", delta: 1 },
            { type: "stat", key: "control", delta: 1 },
            { type: "npc", key: "Camille", respect: 1, memory: "You framed compliance as a choice you were studying, not a posture you were wearing." },
            { type: "flag", key: "metCamille", value: true },
            { type: "flag", key: "camilleRulesDeserveYou", value: true }
          ],
          timeMinutes: 20,
          next: "c01_hub_return_lecture"
        }
      ]
    },

    c01_chat_ben_residence: {
      chapter: 1,
      title: "Ben, Near The Elevators",
      location: "Residence Wing",
      background: "aegis",
      focus: "Ben",
      text: [
        "Ben is by the residence elevators with a duffel bag over one shoulder, waiting while two trainees argue about whether their room doors are blast-rated or just emotionally unfriendly.",
        "\"They are normal doors,\" Ben says, then looks at the dent in one frame. \"Mostly.\""
      ],
      choices: [
        {
          text: "Ask how people keep from becoming their worst incident report.",
          effects: [
            { type: "relationship", key: "Ben", delta: 1 },
            { type: "stat", key: "restraint", delta: 1 },
            { type: "npc", key: "Ben", trust: 1, memory: "You asked Ben about surviving the identity Aegis writes down." },
            { type: "flag", key: "metBen", value: true },
            { type: "flag", key: "askedBenIncidentReports", value: true }
          ],
          timeMinutes: 20,
          next: "c01_hub_return_residence"
        },
        {
          text: "Ask whether impact absorption makes him brave or just harder to move.",
          effects: [
            { type: "relationship", key: "Ben", delta: 1 },
            { type: "stat", key: "control", delta: 1 },
            { type: "npc", key: "Ben", respect: 1, memory: "You asked whether endurance and bravery were the same thing." },
            { type: "flag", key: "metBen", value: true },
            { type: "flag", key: "benBraveQuestion", value: true }
          ],
          timeMinutes: 20,
          next: "c01_hub_return_residence"
        },
        {
          text: "Keep it practical and ask which hallway noise means staff are coming.",
          effects: [
            { type: "stat", key: "aegisTrust", delta: 1 },
            { type: "npc", key: "Ben", trust: 1, memory: "You let Ben teach you the building without making it a confession." },
            { type: "flag", key: "metBen", value: true },
            { type: "flag", key: "benHallwaySignals", value: true }
          ],
          timeMinutes: 15,
          next: "c01_hub_return_residence"
        }
      ]
    },

    c02_chat_piper_courtyard: {
      chapter: 2,
      title: "Piper, Borrowed Air",
      location: "Courtyard",
      background: "aegis",
      focus: "Piper",
      text: [
        "Piper is in the courtyard doing short sprints between two painted lines, never fast enough to scare the staff, never slow enough to look patient.",
        "\"Baseline day,\" she says, skidding to a stop. \"Where everyone learns whether their coping mechanism is data-compliant.\""
      ],
      choices: [
        {
          text: "Ask what she does with fear when outrunning it is not an option.",
          effects: [
            { type: "relationship", key: "Piper", delta: 1 },
            { type: "npc", key: "Piper", trust: 1, concern: 1, memory: "Before baseline, you asked Piper about fear without letting her make it only a joke." },
            { type: "flag", key: "piperFearQuestion", value: true }
          ],
          timeMinutes: 20,
          next: "c02_hub_return_courtyard"
        },
        {
          text: "Tell her jokes are useful, but only if she knows when to drop them.",
          effects: [
            { type: "stat", key: "resolve", delta: 1 },
            { type: "npc", key: "Piper", respect: 1, friction: 1, memory: "You challenged Piper to know the difference between cover and avoidance." },
            { type: "flag", key: "piperJokeBoundary", value: true }
          ],
          timeMinutes: 20,
          next: "c02_hub_return_courtyard"
        },
        {
          text: "Ask for one bad idea you can safely save for after the test.",
          effects: [
            { type: "relationship", key: "Piper", delta: 1 },
            { type: "stat", key: "audacity", delta: 1 },
            { type: "npc", key: "Piper", trust: 1, memory: "You gave Piper a future-tense joke instead of asking her to be serious on command." },
            { type: "flag", key: "piperFutureBadIdea", value: true }
          ],
          timeMinutes: 20,
          next: "c02_hub_return_courtyard"
        }
      ]
    },

    c02_chat_julian_lounge: {
      chapter: 2,
      title: "Julian, Off The Main Stage",
      location: "Common Lounge",
      background: "aegis",
      focus: "Julian",
      text: [
        "Julian has turned a corner table into a kingdom of one, complete with coffee, tablet, and an expression suggesting exile would be better lit.",
        "\"Baseline day is my favorite institutional ritual,\" he says. \"Everyone lies to themselves in public, then the sensors provide notes.\""
      ],
      choices: [
        {
          text: "Ask what he performs when nobody is worth performing for.",
          effects: [
            { type: "relationship", key: "Julian", delta: 1 },
            { type: "npc", key: "Julian", trust: 1, respect: 1, memory: "You asked Julian what the performance protected instead of clapping for it." },
            { type: "flag", key: "metJulian", value: true },
            { type: "flag", key: "julianPerformanceQuestion", value: true }
          ],
          timeMinutes: 20,
          next: "c02_hub_return_common"
        },
        {
          text: "Tell him sensors can measure output, not motive.",
          effects: [
            { type: "relationship", key: "Julian", delta: 1 },
            { type: "stat", key: "independentPath", delta: 1 },
            { type: "npc", key: "Julian", respect: 1, memory: "You gave Julian a better line about motive than the institution deserved." },
            { type: "flag", key: "metJulian", value: true },
            { type: "flag", key: "julianMotiveLine", value: true }
          ],
          timeMinutes: 20,
          next: "c02_hub_return_common"
        },
        {
          text: "Ask whether he is trying to calm people or control them.",
          effects: [
            { type: "stat", key: "control", delta: 1 },
            { type: "npc", key: "Julian", respect: 1, friction: 1, memory: "You named the sharp edge under Julian's charm." },
            { type: "flag", key: "metJulian", value: true },
            { type: "flag", key: "julianCharmEdge", value: true }
          ],
          timeMinutes: 20,
          next: "c02_hub_return_common"
        }
      ]
    },

    c02_chat_theo_cafeteria: {
      chapter: 2,
      title: "Theo, With The Ugly Math",
      location: "Cafeteria",
      background: "aegis",
      focus: "Theo",
      text: [
        "Theo has a tray, three unopened sugar packets, and a tablet showing probability branches he keeps rotating away whenever anyone passes.",
        "\"You are not supposed to read your own risk distribution before breakfast,\" he says. \"I am aware this has never stopped anyone interesting.\""
      ],
      choices: [
        {
          text: "Ask him for the risk he thinks people will politely ignore.",
          effects: [
            { type: "relationship", key: "Theo", delta: 1 },
            { type: "stat", key: "control", delta: 1 },
            { type: "npc", key: "Theo", trust: 1, respect: 1, memory: "You asked Theo for the ugly risk instead of demanding reassurance." },
            { type: "flag", key: "metTheo", value: true },
            { type: "flag", key: "theoUglyRisk", value: true }
          ],
          timeMinutes: 20,
          next: "c02_hub_return_cafeteria"
        },
        {
          text: "Tell him you want a human answer before the probability answer.",
          effects: [
            { type: "relationship", key: "Theo", delta: 1 },
            { type: "npc", key: "Theo", trust: 1, concern: -1, memory: "You asked Theo to stay human before he became useful." },
            { type: "flag", key: "metTheo", value: true },
            { type: "flag", key: "theoHumanAnswer", value: true }
          ],
          timeMinutes: 20,
          next: "c02_hub_return_cafeteria"
        },
        {
          text: "Tell him the math is helpful, but you are not outsourcing your nerve to it.",
          effects: [
            { type: "stat", key: "resolve", delta: 1 },
            { type: "npc", key: "Theo", respect: 1, friction: 1, memory: "You accepted Theo's numbers without letting them own the decision." },
            { type: "flag", key: "metTheo", value: true },
            { type: "flag", key: "theoMathBoundary", value: true }
          ],
          timeMinutes: 20,
          next: "c02_hub_return_cafeteria"
        }
      ]
    },

    c02_chat_rina_queue: {
      chapter: 2,
      title: "Rina, Three Places Ahead",
      location: "Simulation Block A",
      background: "sim",
      focus: "Rina",
      text: [
        "Rina Cross rolls one shoulder in the baseline queue, compact and coiled like someone who refuses to waste motion on nerves.",
        "She catches you looking. \"If you are going to stare, make it useful. What do you think they are really measuring?\""
      ],
      choices: [
        {
          text: "Tell her recovery time matters more than peak output.",
          effects: [
            { type: "relationship", key: "Rina", delta: 1 },
            { type: "stat", key: "control", delta: 1 },
            { type: "npc", key: "Rina", respect: 1, memory: "Before baseline, you answered Rina like a rival worth taking seriously." },
            { type: "flag", key: "metRina", value: true },
            { type: "flag", key: "rinaRecoveryTheory", value: true }
          ],
          timeMinutes: 15,
          next: "c02_hub_return_sim"
        },
        {
          text: "Tell her they are measuring who chases applause under pressure.",
          effects: [
            { type: "relationship", key: "Rina", delta: 1 },
            { type: "stat", key: "restraint", delta: 1 },
            { type: "npc", key: "Rina", respect: 1, memory: "You named the trap in front of someone built to chase finish lines." },
            { type: "flag", key: "metRina", value: true },
            { type: "flag", key: "rinaApplauseTrap", value: true }
          ],
          timeMinutes: 15,
          next: "c02_hub_return_sim"
        },
        {
          text: "Tell her you are here to beat the room, not her.",
          effects: [
            { type: "stat", key: "audacity", delta: 1 },
            { type: "npc", key: "Rina", friction: 1, respect: 1, memory: "You refused Rina's frame without backing away from the challenge." },
            { type: "flag", key: "metRina", value: true },
            { type: "flag", key: "rinaRoomNotHer", value: true }
          ],
          timeMinutes: 15,
          next: "c02_hub_return_sim"
        }
      ]
    },

    c02_chat_vance_glass: {
      chapter: 2,
      title: "Vance, Before The Glass",
      location: "Observation Hall",
      background: "sim",
      focus: "Vance",
      text: [
        "Vance stands near the observation glass with a tablet under one arm. He looks less like a lecturer here and more like part of the architecture.",
        "\"Baseline is not a verdict,\" he says without preamble. \"It is a first measurement. People ruin themselves trying to make first measurements flattering.\""
      ],
      choices: [
        {
          text: "Ask what he trusts more: a clean number or a clean stop.",
          effects: [
            { type: "relationship", key: "Vance", delta: 1 },
            { type: "stat", key: "control", delta: 1 },
            { type: "npc", key: "Vance", respect: 1, memory: "You asked Vance about stopping well instead of looking impressive." },
            { type: "flag", key: "metVance", value: true },
            { type: "flag", key: "vanceCleanStopQuestion", value: true }
          ],
          timeMinutes: 15,
          next: "c02_hub_return_observation"
        },
        {
          text: "Tell him you would rather underperform than lose control for applause.",
          effects: [
            { type: "relationship", key: "Vance", delta: 1 },
            { type: "stat", key: "aegisTrust", delta: 1 },
            { type: "npc", key: "Vance", trust: 1, respect: 1, memory: "You told Vance restraint mattered before the room rewarded spectacle." },
            { type: "flag", key: "metVance", value: true },
            { type: "flag", key: "vanceUnderperformLine", value: true }
          ],
          timeMinutes: 15,
          next: "c02_hub_return_observation"
        },
        {
          text: "Ask how many residents learn the wrong lesson from succeeding.",
          effects: [
            { type: "stat", key: "contractorPath", delta: 1 },
            { type: "npc", key: "Vance", respect: 1, memory: "You asked Vance about the danger of successful mistakes." },
            { type: "flag", key: "metVance", value: true },
            { type: "flag", key: "vanceSuccessTrap", value: true }
          ],
          timeMinutes: 15,
          next: "c02_hub_return_observation"
        }
      ]
    }
  });

  capEarlyRelationshipGains([
    "c01_arrival",
    "c01_orientation",
    "c01_shortcuts",
    "c01_ben_walk",
    "c01_camille_first",
    "c01_lounge",
    "c01_room_assignment",
    "c01_first_morning"
  ], 1);

  if (scenes.c01_orientation && scenes.c01_orientation.choices && scenes.c01_orientation.choices[0]) {
    scenes.c01_orientation.choices[0].text = "Ask Piper for the unofficial version before you find the lounge.";
  }

  redirect("c01_deep_doorway", "c01_arrival", "c01_hub_orientation");
  redirect("c01_orientation", "c01_lounge", "c01_hub_after_orientation");
  redirect("c01_ben_walk", "c01_lounge", "c01_hub_after_orientation");
  redirect("c01_shortcuts", "c01_lounge", "c01_hub_after_orientation");
  redirect("c01_camille_first", "c01_lounge", "c01_hub_after_orientation");
  redirect("c01_first_morning", "c02_deep_wake", "c02_hub_baseline");
  redirect("c01_first_morning", "c02_observation_deck", "c02_hub_baseline");
  redirect("c01_first_morning", "c02_baseline_intro", "c02_hub_baseline");

  STORY.intentionalOrphans = Array.from(new Set([
    ...(STORY.intentionalOrphans || []),
    "c01_arrival",
    "c01_camille_first"
  ]));

  window.AEGIS_HUBS = {
    version: 1,
    assignments: {
      c01_report_orientation: {
        title: "Report To Orientation",
        detail: "Lecture Hall A is ready when you are. Aegis will wait, but the room is already judging late arrivals.",
        targetLocation: "lecture_hall",
        targetAction: "attend-orientation",
        chapter: 1
      },
      c01_find_lounge: {
        title: "Find The Common Lounge",
        detail: "Orientation gave you the official map. The lounge is where the unofficial one starts making sense.",
        targetLocation: "common_lounge",
        targetAction: "join-lounge",
        chapter: 1
      },
      c02_report_baseline: {
        title: "Report To Baseline Testing",
        detail: "Simulation Block A is waiting. You can prepare, talk, train lightly, or walk into the number now.",
        targetLocation: "simulation_block",
        targetAction: "enter-baseline",
        chapter: 2
      }
    },
    locations: {
      intake_hall: {
        name: "Intake Hall",
        region: "Aegis Point",
        background: "aegis",
        description: [
          "The intake hall is too clean to be welcoming. Glass offices ring the floor, wall maps glow with polite arrows, and every security desk has the posture of a person who has practiced not flinching.",
          "New residents drift through in ones and twos, each trying to look like they understand where to stand."
        ],
        returnDescription: [
          "The intake hall keeps processing people without admitting how much life is changing under its lights."
        ],
        exits: [
          "lecture_hall",
          "cafeteria",
          "common_lounge",
          "residence_wing",
          "medical",
          "security_desk",
          { location: "service_corridors", hidden: true, conditions: [{ type: "flag", key: "piperShortcuts" }] }
        ],
        actions: [
          {
            id: "study-intake-map",
            label: "Study the facility map",
            detail: "Learn the first-floor routes before the building decides to feel personal.",
            once: true,
            timeMinutes: 15,
            fatigue: 0,
            text: [
              "The map is friendly in the way systems are friendly when they know friendliness is cheaper than panic. Lecture Hall A, cafeteria, residence wing, medical, training. The restricted doors are not named.",
              "You remember more than the route. You remember which spaces Aegis wants visible."
            ],
            effects: [
              { type: "stat", key: "control", delta: 1 },
              { type: "stat", key: "aegisTrust", delta: 1 },
              { type: "flag", key: "studiedAegisMap", value: true }
            ]
          },
          {
            id: "listen-to-building",
            label: "Listen to the building hum",
            detail: "Let your power feel the containment systems without reaching back.",
            once: true,
            timeMinutes: 15,
            fatigue: 0.3,
            text: [
              "Power runs under the floor in regulated veins. Your own power notices, interested and hungry in the abstract way a storm might be interested in a weather report.",
              "You do not pull. You only listen. That feels like a first small victory."
            ],
            effects: [
              { type: "stat", key: "restraint", delta: 1 },
              { type: "powerXp", amount: 1 },
              { type: "flag", key: "listenedToAegisSystems", value: true }
            ]
          }
        ]
      },

      lecture_hall: {
        name: "Lecture Hall A",
        region: "Aegis Point",
        background: "aegis",
        description: [
          "Lecture Hall A slopes down toward a reinforced stage, a red Aegis mark, and chairs arranged with just enough space between them to admit nobody trusts new residents with elbows.",
          "The exit signs are brighter than the motivational posters."
        ],
        returnDescription: [
          "Lecture Hall A feels different without Vance commanding the stage. It becomes just a room full of people deciding which rules they plan to survive."
        ],
        exits: [
          "intake_hall",
          "cafeteria",
          "common_lounge",
          "residence_wing",
          "courtyard",
          "security_desk"
        ],
        actions: [
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
              { type: "flag", key: "reportedToOrientation", value: true },
              { type: "flag", key: "attendedOrientation", value: true }
            ]
          },
          {
            id: "read-wall-rules",
            label: "Read the posted rules twice",
            detail: "The second read is where the real threats usually hide.",
            once: true,
            timeMinutes: 15,
            fatigue: 0,
            text: [
              "The rules are written for adults with lawyers: clear, cautious, and visibly revised after incidents nobody wanted to footnote.",
              "The most useful line is not about powers. It is about consent, observation, and who can request a review when staff overreach."
            ],
            effects: [
              { type: "stat", key: "contractorPath", delta: 1 },
              { type: "flag", key: "readPostedRules", value: true }
            ]
          },
          {
            id: "camille-lecture-chat",
            label: "Talk to Camille after the briefing",
            detail: "She is still reading the room after everyone else has started leaving it.",
            once: true,
            hidden: true,
            conditions: [
              { type: "flag", key: "attendedOrientation" },
              { type: "notFlag", key: "askedCamilleWhatMissed" }
            ],
            nextScene: "c01_chat_camille_lecture"
          }
        ]
      },

      residence_wing: {
        name: "Residence Wing",
        region: "Aegis Point",
        background: "aegis",
        description: [
          "The residence wing tries for hotel and lands on secure adult dorm. The floors are polished, the doors are reinforced, and every hallway camera looks expensive enough to have a name.",
          "You can hear people unpacking, arguing with tablets, and pretending the first night somewhere strange does not count if the furniture is institutional."
        ],
        returnDescription: [
          "The residence wing keeps offering ordinary noises in a building designed for extraordinary failures."
        ],
        exits: [
          "intake_hall",
          "cafeteria",
          "common_lounge",
          "courtyard",
          { location: "dorm_room", hidden: true, conditions: [{ type: "chapterAtLeast", value: 2 }] },
          { location: "rooftop", hidden: true, conditions: [{ type: "powerLevelAtLeast", value: 2 }] }
        ],
        actions: [
          {
            id: "ben-residence-chat",
            label: "Talk to Ben near the elevators",
            detail: "He is watching the hallway like he knows which kinds of silence matter.",
            once: true,
            hidden: true,
            conditions: [
              { type: "flag", key: "attendedOrientation" },
              { type: "notFlag", key: "askedBenIncidentReports" }
            ],
            nextScene: "c01_chat_ben_residence"
          },
          {
            id: "rest-residence",
            label: "Rest in the residence wing",
            detail: "Give your nervous system ninety minutes without being evaluated.",
            repeatLimit: 2,
            conditions: [{ type: "chapterAtLeast", value: 2 }],
            timeMinutes: 90,
            fatigue: -8,
            rest: true,
            text: [
              "You let the room be small for a while. No glass, no audience, no wall display waiting to turn you into a number.",
              "When you stand again, the day has fewer teeth."
            ],
            effects: [
              { type: "status", key: "condition", value: "Recovered" },
              { type: "status", key: "stress", value: "Low" }
            ]
          }
        ]
      },

      dorm_room: {
        name: "Dorm Room",
        region: "Aegis Point",
        background: "aegis",
        hidden: true,
        conditions: [{ type: "chapterAtLeast", value: 2 }],
        description: [
          "Your room is clean, narrow, and almost aggressively neutral. The bed is bolted down. The desk tablet is already awake. The window faces the water like Aegis wants credit for the view."
        ],
        returnDescription: [
          "Your room has not become home. It has become yours enough to close the door."
        ],
        exits: ["residence_wing"],
        actions: [
          {
            id: "review-schedule-room",
            label: "Review the baseline schedule",
            detail: "Check the times, routes, and fine print before the day can surprise you.",
            once: true,
            timeMinutes: 20,
            fatigue: 0,
            text: [
              "The baseline schedule is specific in the wrong places and vague in the worse ones. Output category, observation team, emergency support, resident rights.",
              "You mark the route to Simulation Block A and the line about requesting medical review after any abnormal sensory event."
            ],
            effects: [
              { type: "stat", key: "control", delta: 1 },
              { type: "flag", key: "reviewedBaselineSchedule", value: true }
            ]
          }
        ]
      },

      cafeteria: {
        name: "Cafeteria",
        region: "Aegis Point",
        background: "aegis",
        description: [
          "The cafeteria is loud enough to feel alive and reinforced enough to remind you why it has to be. Food stations glow under heat lamps. Conversation moves in pockets.",
          "People make room for each other without admitting they are tracking blast radius, sightlines, and who has had too much coffee."
        ],
        returnDescription: [
          "The cafeteria remains Aegis at its most honest: people eating under surveillance and trying to make it normal."
        ],
        exits: [
          "intake_hall",
          "lecture_hall",
          "common_lounge",
          "residence_wing",
          "courtyard",
          { location: "transit_platform", conditions: [{ type: "chapterAtLeast", value: 5 }], lockedText: "City access is not cleared yet." }
        ],
        actions: [
          {
            id: "eat-something",
            label: "Eat something practical",
            detail: "Not heroic. Extremely useful.",
            repeatLimit: 3,
            timeMinutes: 20,
            fatigue: 0,
            text: [
              "You eat food with protein, salt, and no dramatic symbolism. Your body appreciates the lack of metaphor."
            ],
            effects: [
              { type: "status", key: "stress", value: "Steady" }
            ]
          },
          {
            id: "jordan-cafeteria-chat",
            label: "Talk to Jordan by the vending machines",
            detail: "They seem to know the room before the room knows itself.",
            once: true,
            hidden: true,
            conditions: [
              { type: "notFlag", key: "metJordan" }
            ],
            nextScene: "c01_chat_jordan_cafeteria"
          },
          {
            id: "theo-cafeteria-chat",
            label: "Ask Theo about the baseline odds",
            detail: "He has ugly math and the expression of a person trying not to weaponize it.",
            once: true,
            hidden: true,
            conditions: [
              { type: "chapterAtLeast", value: 2 },
              { type: "notFlag", key: "theoUglyRisk" }
            ],
            nextScene: "c02_chat_theo_cafeteria"
          }
        ]
      },

      common_lounge: {
        name: "Common Lounge",
        region: "Aegis Point",
        background: "aegis",
        description: [
          "The common lounge is all glass, low couches, ocean light, and residents pretending not to study each other. Someone has already claimed the best corner. Someone else is pretending not to care.",
          "This is the kind of room where unofficial alliances start as jokes."
        ],
        returnDescription: [
          "The common lounge has settled into its own gravity: couches, gossip, careful distance, and people deciding who is worth a second conversation."
        ],
        exits: [
          "intake_hall",
          "lecture_hall",
          "cafeteria",
          "residence_wing",
          "courtyard",
          { location: "training_wing", conditions: [{ type: "chapterAtLeast", value: 2 }], lockedText: "Training access opens after first-night processing." }
        ],
        actions: [
          {
            id: "join-lounge",
            label: "Join the lounge conversation",
            detail: "Follow the current assignment and step into the social center of intake.",
            assignmentId: "c01_find_lounge",
            timeMinutes: 25,
            fatigue: 0.4,
            completeAssignment: true,
            nextScene: "c01_lounge",
            effects: [
              { type: "flag", key: "foundCommonLounge", value: true }
            ]
          },
          {
            id: "piper-lounge-chat",
            label: "Talk to Piper before the couch claims you",
            detail: "She has been treating gravity like a light suggestion since orientation ended.",
            once: true,
            hidden: true,
            conditions: [
              { type: "flag", key: "attendedOrientation" },
              { type: "notFlag", key: "piperRulesTalk" }
            ],
            nextScene: "c01_chat_piper_lounge"
          },
          {
            id: "watch-lounge-politics",
            label: "Watch the room before joining it",
            detail: "Let the seating chart confess before anyone starts talking.",
            once: true,
            timeMinutes: 15,
            fatigue: 0,
            text: [
              "The room sorts itself faster than staff could have assigned it. Confident people stand near exits. Lonely people pretend to check messages. Dangerous people do not always look dangerous.",
              "The useful thing is not who holds attention. It is who everyone checks before deciding whether to laugh."
            ],
            effects: [
              { type: "stat", key: "foundationPath", delta: 1 },
              { type: "flag", key: "readLoungePolitics", value: true }
            ]
          },
          {
            id: "julian-lounge-chat",
            label: "Talk to Julian off the main stage",
            detail: "He is alone with coffee, which somehow looks like a performance with a smaller audience.",
            once: true,
            hidden: true,
            conditions: [
              { type: "chapterAtLeast", value: 2 },
              { type: "notFlag", key: "julianPerformanceQuestion" }
            ],
            nextScene: "c02_chat_julian_lounge"
          }
        ]
      },

      training_wing: {
        name: "Training Wing",
        region: "Aegis Point",
        background: "sim",
        conditions: [{ type: "chapterAtLeast", value: 2 }],
        description: [
          "The training wing smells like mat cleaner, hot electronics, and ambition trying to look professional. Floor markings divide the room into ranges, control circles, and zones where staff are clearly tired of saying do not stand there.",
          "Nothing here is subtle. That is comforting in its own way."
        ],
        returnDescription: [
          "The training wing keeps its blunt honesty. Try, fail, measure, recover, repeat."
        ],
        exits: [
          "common_lounge",
          "simulation_block",
          "medical",
          "observation_hall",
          "courtyard"
        ],
        actions: [
          {
            id: "hub-control-loop",
            label: "Run a control loop",
            detail: "Small output, clean stop, no audience worth impressing.",
            repeatLimit: 2,
            timeMinutes: 60,
            fatigue: 2,
            text: [
              "The control loop is boring until it is not. You find the exact point where your power wants to make a statement and teach it to use an indoor voice.",
              "The room logs the clean stop. You feel the difference before the tablet does."
            ],
            effects: [
              { type: "stat", key: "control", delta: 1 },
              { type: "powerXp", amount: 1 },
              { type: "status", key: "condition", value: "Steady" },
              { type: "flag", key: "trainedInHubControl", value: true }
            ]
          },
          {
            id: "hub-restraint-drill",
            label: "Run a restraint drill",
            detail: "Hold the pressure without making the room prove you can.",
            repeatLimit: 2,
            timeMinutes: 60,
            fatigue: 2,
            text: [
              "The restraint drill does not reward spectacle. It rewards refusing spectacle while every nerve asks for release.",
              "By the end, your power is still loud. You are louder in the only way that matters."
            ],
            effects: [
              { type: "stat", key: "restraint", delta: 1 },
              { type: "powerXp", amount: 1 },
              { type: "status", key: "stress", value: "Focused" },
              { type: "flag", key: "trainedInHubRestraint", value: true }
            ]
          }
        ]
      },

      simulation_block: {
        name: "Simulation Block A",
        region: "Aegis Point",
        background: "sim",
        conditions: [{ type: "chapterAtLeast", value: 2 }],
        description: [
          "Simulation Block A is a corridor of sealed doors, wall displays, and quiet residents doing private math. The chamber beyond the glass does not look dramatic. It looks accurate.",
          "Accuracy may be worse."
        ],
        returnDescription: [
          "The simulation block queue keeps moving, one name at a time."
        ],
        exits: [
          "training_wing",
          "observation_hall",
          "medical",
          "cafeteria",
          "common_lounge"
        ],
        actions: [
          {
            id: "enter-baseline",
            label: "Enter the baseline queue",
            detail: "Follow the current assignment and let Aegis put a number beside your name.",
            assignmentId: "c02_report_baseline",
            timeMinutes: 15,
            fatigue: 0.5,
            completeAssignment: true,
            nextScene: "c02_deep_wake",
            effects: [
              { type: "flag", key: "reportedToBaseline", value: true }
            ]
          },
          {
            id: "rina-queue-chat",
            label: "Talk to Rina in the queue",
            detail: "She looks like she has already turned the baseline into a competition.",
            once: true,
            hidden: true,
            conditions: [
              { type: "chapterAtLeast", value: 2 },
              { type: "notFlag", key: "rinaRecoveryTheory" }
            ],
            nextScene: "c02_chat_rina_queue"
          },
          {
            id: "read-safety-wall",
            label: "Memorize the safety parameters",
            detail: "Every warning was written because someone made it necessary.",
            once: true,
            timeMinutes: 15,
            fatigue: 0,
            text: [
              "The safety wall is gentle and merciless. It lists pain, dizziness, dissociation, auditory distortion, missing time, involuntary output, and emotional escalation as reportable events.",
              "You memorize the list because pride is a bad medical plan."
            ],
            effects: [
              { type: "stat", key: "control", delta: 1 },
              { type: "stat", key: "aegisTrust", delta: 1 },
              { type: "flag", key: "memorizedHubSafetyWall", value: true }
            ]
          }
        ]
      },

      medical: {
        name: "Medical",
        region: "Aegis Point",
        background: "aegis",
        description: [
          "Medical is quiet, bright, and full of machines that look patient because machines do not have to fill out incident reports. A medic smiles with professional kindness and tired eyes.",
          "The room is built around the idea that dangerous people still get hurt."
        ],
        returnDescription: [
          "Medical keeps its soft lights and hard questions."
        ],
        exits: [
          "intake_hall",
          "residence_wing",
          "training_wing",
          "simulation_block",
          "observation_hall"
        ],
        actions: [
          {
            id: "medical-baseline-check",
            label: "Ask for a pre-baseline vitals check",
            detail: "Let someone measure the boring systems before Aegis measures the dangerous one.",
            once: true,
            conditions: [{ type: "chapterAtLeast", value: 2 }],
            timeMinutes: 20,
            fatigue: 0,
            text: [
              "The medic checks pulse, blood pressure, pupil response, and the small tremor in your hands that you had planned to ignore.",
              "\"Useful baseline,\" she says, and for once the word sounds like care instead of classification."
            ],
            effects: [
              { type: "status", key: "condition", value: "Checked" },
              { type: "stat", key: "aegisTrust", delta: 1 },
              { type: "flag", key: "medicalPreBaseline", value: true }
            ]
          }
        ]
      },

      observation_hall: {
        name: "Observation Hall",
        region: "Aegis Point",
        background: "sim",
        conditions: [{ type: "chapterAtLeast", value: 2 }],
        description: [
          "The observation hall overlooks a test chamber through glass thick enough to make the word trust feel theatrical. Staff stations face the room. Residents face the glass.",
          "This is where Aegis watches what power does to attention."
        ],
        returnDescription: [
          "The observation hall still reflects you over the chamber, making audience and subject share a face."
        ],
        exits: [
          "simulation_block",
          "training_wing",
          "medical",
          "admin_wing"
        ],
        actions: [
          {
            id: "vance-glass-chat",
            label: "Ask Vance about first measurements",
            detail: "He is watching the tests like the recovery matters more than the flash.",
            once: true,
            hidden: true,
            conditions: [
              { type: "chapterAtLeast", value: 2 },
              { type: "notFlag", key: "vanceCleanStopQuestion" }
            ],
            nextScene: "c02_chat_vance_glass"
          },
          {
            id: "watch-other-baselines",
            label: "Watch two baseline runs",
            detail: "Learn from people who do not know they are teaching.",
            once: true,
            timeMinutes: 20,
            fatigue: 0.2,
            text: [
              "The first resident stops too late and wins applause from nobody. The second stops early and looks disappointed until the evaluator nods.",
              "The lesson is ugly and useful: the room respects clean endings more than dramatic peaks."
            ],
            effects: [
              { type: "stat", key: "restraint", delta: 1 },
              { type: "flag", key: "watchedHubBaselines", value: true }
            ]
          }
        ]
      },

      courtyard: {
        name: "Courtyard",
        region: "Aegis Point",
        background: "aegis",
        description: [
          "The courtyard faces the ocean through a security fence dressed up as architecture. Planters break the wind. Benches bolt themselves to the ground with quiet institutional pessimism.",
          "It is one of the few places in Aegis Point where the sky gets the final word."
        ],
        returnDescription: [
          "The courtyard keeps offering air that does not belong to Aegis, which may be why residents keep coming back."
        ],
        exits: [
          "intake_hall",
          "lecture_hall",
          "cafeteria",
          "common_lounge",
          "residence_wing",
          { location: "rooftop", hidden: true, conditions: [{ type: "powerLevelAtLeast", value: 2 }] }
        ],
        actions: [
          {
            id: "courtyard-breath",
            label: "Take ten minutes of ocean air",
            detail: "Not training. Not hiding. Just letting the day unclench a little.",
            repeatLimit: 3,
            timeMinutes: 10,
            fatigue: 0,
            text: [
              "The ocean keeps moving without asking what Aegis thinks of it. You borrow that attitude for ten whole minutes."
            ],
            effects: [
              { type: "status", key: "stress", value: "Lower" }
            ]
          },
          {
            id: "piper-courtyard-chat",
            label: "Talk to Piper during sprint drills",
            detail: "She is moving just slowly enough for staff to pretend this is not training.",
            once: true,
            hidden: true,
            conditions: [
              { type: "chapterAtLeast", value: 2 },
              { type: "notFlag", key: "piperFearQuestion" }
            ],
            nextScene: "c02_chat_piper_courtyard"
          }
        ]
      },

      security_desk: {
        name: "Security Desk",
        region: "Aegis Point",
        background: "aegis",
        description: [
          "The security desk is half hospitality counter, half checkpoint. The staff smile like people trained to de-escalate arguments before they become architecture problems."
        ],
        returnDescription: [
          "The security desk remains politely immovable."
        ],
        exits: [
          "intake_hall",
          "lecture_hall",
          "admin_wing"
        ],
        actions: [
          {
            id: "ask-city-leave",
            label: "Ask how city leave works",
            detail: "Find the line between resident, trainee, and contained asset.",
            once: true,
            timeMinutes: 15,
            fatigue: 0,
            text: [
              "The answer is procedural enough to be calming and conditional enough to be insulting. City leave exists. So do approvals, escorts, incident holds, and categories nobody explains without a badge.",
              "You leave knowing more. You do not leave feeling freer."
            ],
            effects: [
              { type: "stat", key: "contractorPath", delta: 1 },
              { type: "flag", key: "askedAboutCityLeave", value: true }
            ]
          }
        ]
      },

      service_corridors: {
        name: "Service Corridors",
        region: "Aegis Point",
        background: "aegis",
        hidden: true,
        conditions: [{ type: "flag", key: "piperShortcuts" }],
        description: [
          "The service corridors are narrower, warmer, and much less interested in looking inspirational. Pipes, access panels, staff carts, camera blind spots. The building's honest face."
        ],
        returnDescription: [
          "The service corridors still feel like a secret even when they are only maintenance."
        ],
        exits: [
          "intake_hall",
          "common_lounge",
          "cafeteria"
        ],
        actions: [
          {
            id: "follow-piper-shortcut",
            label: "Follow Piper's shortcut route",
            detail: "Let the unofficial map become a scene instead of a rumor.",
            once: true,
            hidden: true,
            conditions: [
              { type: "flag", key: "attendedOrientation" },
              { type: "notFlag", key: "piperMischief" }
            ],
            nextScene: "c01_shortcuts"
          }
        ]
      },

      admin_wing: {
        name: "Admin Wing",
        region: "Aegis Point",
        background: "aegis",
        conditions: [{ type: "chapterAtLeast", value: 3 }],
        description: [
          "The admin wing has better carpet, quieter doors, and the sort of framed certificates that suggest every ethical problem eventually becomes a committee."
        ],
        returnDescription: [
          "The admin wing remains quiet enough to hide shouting in paperwork."
        ],
        lockedText: "Administrative access is not available during intake.",
        exits: [
          "security_desk",
          "observation_hall",
          { location: "records_annex", hidden: true, conditions: [{ type: "flag", key: "foundRecordsAnnex" }] }
        ],
        actions: []
      },

      records_annex: {
        name: "Records Annex",
        region: "Aegis Point",
        background: "aegis",
        hidden: true,
        conditions: [{ type: "flag", key: "foundRecordsAnnex" }],
        description: [
          "The records annex is not on the public map. That says enough before any screen wakes up."
        ],
        returnDescription: [
          "The records annex keeps its secrets in orderly folders, which may be the rudest kind."
        ],
        exits: ["admin_wing"],
        actions: []
      },

      rooftop: {
        name: "Rooftop",
        region: "Aegis Point",
        background: "aegis",
        hidden: true,
        conditions: [{ type: "powerLevelAtLeast", value: 2 }],
        description: [
          "The rooftop is all wind, safety rails, warning paint, and the dangerous relief of seeing the whole campus at once."
        ],
        returnDescription: [
          "The rooftop makes Aegis look smaller than it feels from inside."
        ],
        exits: ["residence_wing", "courtyard"],
        actions: []
      },

      transit_platform: {
        name: "Transit Platform",
        region: "Blackwater",
        background: "city",
        conditions: [{ type: "chapterAtLeast", value: 5 }],
        description: [
          "The transit platform is the line between supervised campus and city gravity. For now, the schedule is more promise than permission."
        ],
        returnDescription: [
          "The transit platform keeps suggesting exits Aegis has not approved yet."
        ],
        lockedText: "City access is not cleared yet.",
        exits: ["cafeteria", "blackwater_promenade"],
        actions: []
      },

      blackwater_promenade: {
        name: "Blackwater Promenade",
        region: "Blackwater",
        background: "city",
        conditions: [{ type: "chapterAtLeast", value: 5 }],
        description: [
          "The promenade runs along the water with tourist lights, food carts, and enough cameras to remind you city freedom has its own observers."
        ],
        returnDescription: [
          "The promenade keeps being beautiful in ways that do not ask permission."
        ],
        lockedText: "The city opens later.",
        exits: ["transit_platform", "east_dock", "rusty_anchor", "blackwater_infirmary"],
        actions: []
      },

      blackwater_infirmary: {
        name: "Blackwater Infirmary",
        region: "Blackwater",
        background: "city",
        conditions: [{ type: "chapterAtLeast", value: 5 }],
        description: [
          "Blackwater Infirmary sits between the promenade clinics and the emergency routes heroes try not to need. The sign is small. The reinforced doors are not.",
          "Inside, nurses, med-techs, and a licensed tissue specialist move with the calm of people who have seen powers turn bones into punctuation."
        ],
        returnDescription: [
          "The infirmary keeps its waiting room ordinary on purpose: coffee, forms, magazines, reinforced glass."
        ],
        lockedText: "Off-campus medical access opens later.",
        exits: ["blackwater_promenade", "transit_platform", "east_dock"],
        actions: [
          {
            id: "blackwater-infirmary-treatment",
            label: "Use the Blackwater infirmary",
            detail: "Get off-campus treatment before bruises become personality traits.",
            repeatLimit: 4,
            timeMinutes: 60,
            fatigue: -7,
            rest: true,
            recovery: true,
            text: [
              "The Blackwater staff treat power injuries like weather damage: serious, familiar, and nobody's favorite paperwork.",
              "By the time you leave, the worst of the ache has been translated into instructions, salve, and an appointment card you are absolutely expected to ignore at your peril."
            ],
            variants: [
              {
                conditions: [{ type: "matureContent" }],
                text: [
                  "A healer sets two fingers against the bad spot and tells you not to look heroic for thirty seconds. Heat crawls under the bruise; torn fibers knit with an unpleasant internal tug, and the sharp edge of pain drops from threat to memory."
                ]
              }
            ],
            effects: [
              { type: "status", key: "energy", value: "Medically cleared" },
              { type: "status", key: "lastFight", value: "Treated at Blackwater Infirmary" }
            ]
          }
        ]
      },

      east_dock: {
        name: "East Dock",
        region: "Blackwater",
        background: "city",
        conditions: [{ type: "chapterAtLeast", value: 5 }],
        description: [
          "The East Dock smells like salt, diesel, and choices that happen away from official rooms."
        ],
        returnDescription: [
          "The East Dock keeps its shadows practical."
        ],
        lockedText: "The dock is not relevant yet.",
        exits: ["blackwater_promenade"],
        actions: []
      },

      rusty_anchor: {
        name: "The Rusty Anchor",
        region: "Blackwater",
        background: "city",
        conditions: [{ type: "chapterAtLeast", value: 5 }],
        description: [
          "The Rusty Anchor is old wood, bad neon, and the kind of jukebox that survived because nobody wanted to fight it."
        ],
        returnDescription: [
          "The Rusty Anchor remains loud enough to make secrets lean closer."
        ],
        lockedText: "Off-campus social spaces open later.",
        exits: ["blackwater_promenade"],
        actions: []
      },

      event_horizon: {
        name: "Event Horizon",
        region: "Blackwater",
        background: "horizon",
        hidden: true,
        conditions: [{ type: "chapterAtLeast", value: 6 }],
        description: [
          "The Event Horizon is neutral ground with expensive lights, sharper exits, and people who know exactly what neutrality costs."
        ],
        returnDescription: [
          "The Event Horizon stays bright enough to make danger look curated."
        ],
        exits: ["blackwater_promenade"],
        actions: []
      }
    }
  };

  const HUBS = window.AEGIS_HUBS;

  function setChapterStart(chapterId, sceneId) {
    const chapter = STORY.chapters.find((item) => item.id === chapterId);
    if (chapter) chapter.start = sceneId;
  }

  function addHubScene(id, chapter, title, location, background, assignmentId, locationId, text) {
    scenes[id] = {
      chapter,
      title,
      location,
      background,
      focus: "Seth",
      hub: { assignmentId, locationId },
      text,
      choices: []
    };
  }

  function addChoiceScene(id, chapter, title, location, background, focus, text, choices) {
    scenes[id] = {
      chapter,
      title,
      location,
      background,
      focus,
      text,
      choices
    };
  }

  function hubChoice(text, effects, next, timeMinutes = 20) {
    return { text, effects, timeMinutes, next };
  }

  function addActions(locationId, actions) {
    const location = HUBS.locations[locationId];
    if (!location) return;
    location.actions = location.actions || [];
    actions.forEach((action) => {
      if (!location.actions.some((item) => item.id === action.id)) location.actions.push(action);
    });
  }

  function addExits(locationId, exits) {
    const location = HUBS.locations[locationId];
    if (!location) return;
    location.exits = location.exits || [];
    exits.forEach((exit) => {
      const exitId = typeof exit === "string" ? exit : exit.location;
      const exists = location.exits.some((item) => (typeof item === "string" ? item : item.location) === exitId);
      if (!exists) location.exits.push(exit);
    });
  }

  addHubScene(
    "c03_hub_gallery",
    3,
    "Before The Gallery",
    "Observation Hall",
    "sim",
    "c03_review_gallery",
    "observation_hall",
    [
      "The baseline numbers have already started changing how people look at you. Sim Block C is ready for observation review, which sounds passive until you remember observation is how Aegis turns people into policy.",
      "You can report to the gallery now, or spend a little time learning what the building thinks happened yesterday."
    ]
  );

  addHubScene(
    "c04_hub_training",
    4,
    "Before The Break",
    "Training Wing",
    "sim",
    "c04_report_training",
    "training_wing",
    [
      "Training Wing access feels different after the gallery. The room is not asking whether you have power anymore. It is asking what your instincts do when someone else depends on the answer.",
      "The mandatory block is waiting, but Aegis Point has enough corners for preparation, avoidance, and the bad habit of calling one the other."
    ]
  );

  addHubScene(
    "c05_hub_dock",
    5,
    "Before The Dock",
    "East Dock",
    "city",
    "c05_report_dock",
    "east_dock",
    [
      "Off-campus air hits differently. The East Dock is all water, diesel, gull-wire noise, and the sudden knowledge that Aegis walls were doing more emotional work than you wanted to admit.",
      "The unscheduled field test is not officially a field test. That is one of several reasons it feels exactly like one."
    ]
  );

  addHubScene(
    "c06_hub_event",
    6,
    "Before Event Horizon",
    "Event Horizon",
    "horizon",
    "c06_enter_horizon",
    "event_horizon",
    [
      "Blackwater dresses danger better than Aegis does. The Event Horizon waits behind a velvet line, glowing with neutral-ground confidence and the kind of security that knows every exit by first name.",
      "Tonight is supposed to be social. That has become a suspicious sentence in your life."
    ]
  );

  addHubScene(
    "c07_hub_bait",
    7,
    "Before The Bait",
    "Briefing Room",
    "aegis",
    "c07_report_bait",
    "briefing_room",
    [
      "The briefing room is too bright for the work being discussed. Every chair has been placed like someone wanted a conversation and planned an interrogation as a backup.",
      "The next assignment has Vektor's shadow under it. You can report now, but nobody around you is pretending this is only procedure."
    ]
  );

  addHubScene(
    "c08_hub_airbase",
    8,
    "Before Mach Five",
    "Airbase Hangar",
    "aegis",
    "c08_report_airbase",
    "airbase_hangar",
    [
      "The airbase hangar turns scale into architecture: runway lights, concrete, hangar doors, emergency teams, and a silence wide enough for something fast to become catastrophic.",
      "Piper's test is waiting. Aegis has made plans for failure. You have to decide what preparation means when success might also scare everyone."
    ]
  );

  addHubScene(
    "c09_hub_graduation_eve",
    9,
    "Before The Last Night",
    "Residence Wing",
    "aegis",
    "c09_begin_last_night",
    "residence_wing",
    [
      "Graduation eve makes Aegis Point feel temporary for the first time. Boxes appear outside rooms. Hallway jokes run warmer and shorter. People look at doors like they are practicing leaving.",
      "The main thread is waiting, but tonight has too many small goodbyes to pretend movement is only logistical."
    ]
  );

  addHubScene(
    "c10_hub_graduation",
    10,
    "Before The Stage",
    "Graduation Hall",
    "graduation",
    "c10_enter_graduation",
    "graduation_hall",
    [
      "Graduation Hall has been polished until it can almost pass for celebration. Families, officials, handlers, donors, residents, exits. Every future in the room has a security plan.",
      "The stage is ready. So are the people who want your life after Aegis to mean something useful to them."
    ]
  );

  Object.assign(HUBS.assignments, {
    c03_review_gallery: {
      title: "Report To Observation Gallery",
      detail: "Sim Block C is ready to review what the baseline revealed and what everyone thinks it means.",
      targetLocation: "observation_hall",
      targetAction: "begin-gallery-review",
      chapter: 3
    },
    c04_report_training: {
      title: "Report To Training Wing",
      detail: "The next mandatory block is about instinct, control, and what happens when pressure stops being theoretical.",
      targetLocation: "training_wing",
      targetAction: "begin-break-thermo",
      chapter: 4
    },
    c05_report_dock: {
      title: "Meet The Dock Team",
      detail: "The East Dock test is off the official schedule, which makes every preparation feel more personal.",
      targetLocation: "east_dock",
      targetAction: "begin-dock-test",
      chapter: 5
    },
    c06_enter_horizon: {
      title: "Enter Event Horizon",
      detail: "The neutral-ground venue is open. The night can stay social for exactly as long as the story allows.",
      targetLocation: "event_horizon",
      targetAction: "enter-event-horizon",
      chapter: 6
    },
    c07_report_bait: {
      title: "Report To The Bait Briefing",
      detail: "Aegis has a plan with your name in the risk column. The room is waiting.",
      targetLocation: "briefing_room",
      targetAction: "enter-bait-briefing",
      chapter: 7
    },
    c08_report_airbase: {
      title: "Step Into The Mach Test",
      detail: "The airbase team is ready. Piper is ready in the way people are ready when backing out would hurt worse.",
      targetLocation: "airbase_hangar",
      targetAction: "begin-mach-test",
      chapter: 8
    },
    c09_begin_last_night: {
      title: "Begin Graduation Eve",
      detail: "The dorm is full of last-night gravity. When you are ready, follow the thread toward the roof.",
      targetLocation: "residence_wing",
      targetAction: "begin-graduation-eve",
      chapter: 9
    },
    c10_enter_graduation: {
      title: "Enter Graduation",
      detail: "The ceremony starts when you step onto the official route. Everything after that becomes public.",
      targetLocation: "graduation_hall",
      targetAction: "enter-graduation",
      chapter: 10
    }
  });

  Object.assign(HUBS.locations, {
    briefing_room: {
      name: "Briefing Room",
      region: "Aegis Point",
      background: "aegis",
      conditions: [{ type: "chapterAtLeast", value: 7 }],
      description: [
        "The briefing room is glass, hard chairs, tactical screens, and the faint smell of coffee that has lost the will to help anyone.",
        "Aegis does not decorate rooms where people are asked to accept risk. Maybe decoration would make the questions look too human."
      ],
      returnDescription: [
        "The briefing room keeps its screens awake, ready to make danger look like a sequence of manageable boxes."
      ],
      exits: ["admin_wing", "observation_hall", "training_wing", "medical", "courtyard"],
      actions: []
    },
    airbase_hangar: {
      name: "Airbase Hangar",
      region: "Aegis Field Site",
      background: "aegis",
      conditions: [{ type: "chapterAtLeast", value: 8 }],
      description: [
        "The hangar is built for aircraft and emergency math. Crew carts move in clean lines. Medics check kits twice. The runway beyond the doors looks long until you imagine Piper crossing it at Mach speed.",
        "Everything here has been made large because the mistake cannot be."
      ],
      returnDescription: [
        "The airbase hangar keeps its breath held."
      ],
      exits: ["transit_platform", "medical", "observation_hall"],
      actions: []
    },
    graduation_hall: {
      name: "Graduation Hall",
      region: "Aegis Point",
      background: "graduation",
      conditions: [{ type: "chapterAtLeast", value: 10 }],
      description: [
        "The hall has banners, reserved seating, donor smiles, family nerves, staff earpieces, and three visible exits. Aegis can make even celebration look supervised.",
        "The stage waits with a microphone and a folder. Both are dangerous in different ways."
      ],
      returnDescription: [
        "The graduation hall keeps filling with futures that want names attached."
      ],
      exits: ["admin_wing", "courtyard", "residence_wing"],
      actions: []
    }
  });

  addExits("admin_wing", ["briefing_room", "graduation_hall"]);
  addExits("observation_hall", ["briefing_room", "airbase_hangar"]);
  addExits("training_wing", ["briefing_room"]);
  addExits("medical", ["briefing_room", "airbase_hangar"]);
  addExits("transit_platform", ["airbase_hangar", "blackwater_infirmary"]);
  addExits("blackwater_promenade", [{ location: "event_horizon", hidden: true, conditions: [{ type: "chapterAtLeast", value: 6 }] }]);
  addExits("east_dock", ["blackwater_infirmary"]);
  addExits("rusty_anchor", ["blackwater_infirmary"]);
  addExits("blackwater_infirmary", ["blackwater_promenade", "transit_platform", "east_dock"]);
  addExits("event_horizon", ["blackwater_promenade", "transit_platform"]);
  addExits("residence_wing", ["graduation_hall"]);

  addActions("observation_hall", [
    {
      id: "begin-gallery-review",
      label: "Begin the observation review",
      detail: "Follow the current assignment into Sim Block C's political weather.",
      assignmentId: "c03_review_gallery",
      timeMinutes: 20,
      fatigue: 0.4,
      completeAssignment: true,
      nextScene: "c03_deep_invitation",
      effects: [{ type: "flag", key: "reportedToGalleryReview", value: true }]
    },
    {
      id: "c03-gallery-checkin",
      label: "Talk through the gallery pressure",
      detail: "Camille, Julian, and Theo are each reading the same footage differently.",
      once: true,
      hidden: true,
      conditions: [{ type: "chapterAtLeast", value: 3 }, { type: "chapterBefore", value: 4 }],
      nextScene: "c03_chat_gallery_edges"
    },
    {
      id: "c03-review-footage",
      label: "Review yesterday's baseline footage",
      detail: "Watch without flinching from what the room recorded.",
      once: true,
      conditions: [{ type: "chapterAtLeast", value: 3 }, { type: "chapterBefore", value: 5 }],
      timeMinutes: 30,
      fatigue: 0.8,
      text: [
        "The footage is less dramatic than memory. That makes it worse. You can see the exact second where fear stopped being a feeling and became output.",
        "Rewatching does not make you smaller. It makes the next correction less imaginary."
      ],
      effects: [
        { type: "stat", key: "control", delta: 1 },
        { type: "stat", key: "contractorPath", delta: 1 },
        { type: "flag", key: "reviewedBaselineFootageHub", value: true }
      ]
    }
  ]);

  addActions("training_wing", [
    {
      id: "begin-break-thermo",
      label: "Begin the pressure block",
      detail: "Follow the current assignment into controlled failure and useful discomfort.",
      assignmentId: "c04_report_training",
      timeMinutes: 20,
      fatigue: 0.6,
      completeAssignment: true,
      nextScene: "c04_deep_solo",
      effects: [{ type: "flag", key: "reportedToPressureBlock", value: true }]
    },
    {
      id: "c04-pre-sim-checkin",
      label: "Ask what the room is really testing",
      detail: "Vance and Camille have different standards. Neither one is soft.",
      once: true,
      hidden: true,
      conditions: [{ type: "chapterAtLeast", value: 4 }, { type: "chapterBefore", value: 5 }],
      nextScene: "c04_chat_training_margin"
    },
    {
      id: "c04-pressure-dummy",
      label: "Run pressure-dummy reps",
      detail: "Train stopping power that wants to keep going.",
      repeatLimit: 2,
      conditions: [{ type: "chapterAtLeast", value: 4 }, { type: "chapterBefore", value: 8 }],
      timeMinutes: 60,
      fatigue: 2,
      text: [
        "The dummy does not care how impressive the output is. It only cares whether you can stop on command while your pulse argues.",
        "By the final rep, the stop arrives sooner. Not easy. Sooner."
      ],
      effects: [
        { type: "stat", key: "restraint", delta: 1 },
        { type: "powerXp", amount: 1 },
        { type: "flag", key: "pressureDummyReps", value: true }
      ]
    }
  ]);

  addActions("east_dock", [
    {
      id: "begin-dock-test",
      label: "Begin the dock test",
      detail: "Follow the current assignment into the unscheduled field problem.",
      assignmentId: "c05_report_dock",
      timeMinutes: 20,
      fatigue: 0.6,
      completeAssignment: true,
      nextScene: "c05_deep_after",
      effects: [{ type: "flag", key: "reportedToDockTest", value: true }]
    },
    {
      id: "c05-dock-checkin",
      label: "Talk before the dock goes loud",
      detail: "The team is loose in the way people get before doing something stupid on purpose.",
      once: true,
      hidden: true,
      conditions: [{ type: "chapterAtLeast", value: 5 }, { type: "chapterBefore", value: 6 }],
      nextScene: "c05_chat_dock_edges"
    },
    {
      id: "study-waterline",
      label: "Study the waterline",
      detail: "Field sites have physics before they have plans.",
      once: true,
      conditions: [{ type: "chapterAtLeast", value: 5 }],
      timeMinutes: 20,
      fatigue: 0.2,
      text: [
        "The dock gives you wind, wet concrete, bad angles, reflection glare, and civilians just far enough away to become a problem if anything runs loose.",
        "Aegis sim rooms never smell like diesel. They should."
      ],
      effects: [
        { type: "stat", key: "control", delta: 1 },
        { type: "flag", key: "studiedWaterline", value: true }
      ]
    }
  ]);

  addActions("event_horizon", [
    {
      id: "enter-event-horizon",
      label: "Enter the Event Horizon",
      detail: "Follow the current assignment into neutral ground and expensive bad ideas.",
      assignmentId: "c06_enter_horizon",
      timeMinutes: 20,
      fatigue: 0.4,
      completeAssignment: true,
      nextScene: "c06_deep_permission",
      effects: [{ type: "flag", key: "enteredEventHorizonHub", value: true }]
    },
    {
      id: "c06-horizon-checkin",
      label: "Check the room before the night starts",
      detail: "Julian, Kaito, and the exits all have opinions.",
      once: true,
      hidden: true,
      conditions: [{ type: "chapterAtLeast", value: 6 }, { type: "chapterBefore", value: 7 }],
      nextScene: "c06_chat_horizon_threshold"
    }
  ]);

  addActions("briefing_room", [
    {
      id: "enter-bait-briefing",
      label: "Enter the bait briefing",
      detail: "Follow the current assignment into the room where the plan gets teeth.",
      assignmentId: "c07_report_bait",
      timeMinutes: 20,
      fatigue: 0.5,
      completeAssignment: true,
      nextScene: "c07_deep_morning",
      effects: [{ type: "flag", key: "reportedToBaitBriefing", value: true }]
    },
    {
      id: "c07-bait-checkin",
      label: "Talk through the bait plan",
      detail: "Theo and Jordan are both worried. They are just doing it in different languages.",
      once: true,
      hidden: true,
      conditions: [{ type: "chapterAtLeast", value: 7 }, { type: "chapterBefore", value: 8 }],
      nextScene: "c07_chat_bait_conscience"
    },
    {
      id: "inspect-briefing-map",
      label: "Inspect the briefing map",
      detail: "Look for the assumption nobody is saying aloud.",
      once: true,
      conditions: [{ type: "chapterAtLeast", value: 7 }],
      timeMinutes: 20,
      fatigue: 0.2,
      text: [
        "The map has clean arrows and ugly implications. The safest route is not the route that protects dignity. The fastest route is not the route that protects bystanders.",
        "Plans show values no matter how hard they pretend to show logistics."
      ],
      effects: [
        { type: "stat", key: "restraint", delta: 1 },
        { type: "flag", key: "inspectedBaitMap", value: true }
      ]
    }
  ]);

  addActions("airbase_hangar", [
    {
      id: "begin-mach-test",
      label: "Begin the Mach test",
      detail: "Follow the current assignment into Piper's disaster-shaped threshold.",
      assignmentId: "c08_report_airbase",
      timeMinutes: 20,
      fatigue: 0.6,
      completeAssignment: true,
      nextScene: "c08_deep_review",
      effects: [{ type: "flag", key: "reportedToAirbase", value: true }]
    },
    {
      id: "c08-airbase-checkin",
      label: "Check in before the runway",
      detail: "Piper is joking. Rina is watching. Vance is counting failure modes.",
      once: true,
      hidden: true,
      conditions: [{ type: "chapterAtLeast", value: 8 }, { type: "chapterBefore", value: 9 }],
      nextScene: "c08_chat_airbase_hold"
    },
    {
      id: "walk-runway-line",
      label: "Walk the runway line",
      detail: "Let the scale of the test become physical before it becomes urgent.",
      once: true,
      conditions: [{ type: "chapterAtLeast", value: 8 }],
      timeMinutes: 25,
      fatigue: 0.4,
      text: [
        "The runway is longer on foot than it looked from the hangar. That matters. Human scale matters. A body crossing this much distance at impossible speed is still a body.",
        "You walk back slower than you walked out."
      ],
      effects: [
        { type: "stat", key: "restraint", delta: 1 },
        { type: "flag", key: "walkedRunwayLine", value: true }
      ]
    }
  ]);

  addActions("residence_wing", [
    {
      id: "begin-graduation-eve",
      label: "Begin graduation eve",
      detail: "Follow the current assignment into the last night before Aegis becomes past tense.",
      assignmentId: "c09_begin_last_night",
      timeMinutes: 20,
      fatigue: 0.3,
      completeAssignment: true,
      nextScene: "c09_deep_return",
      effects: [{ type: "flag", key: "beganGraduationEveHub", value: true }]
    },
    {
      id: "c09-last-night-checkin",
      label: "Take one last hallway lap",
      detail: "The people who mattered are scattered through the dorm like unfinished sentences.",
      once: true,
      hidden: true,
      conditions: [{ type: "chapterAtLeast", value: 9 }, { type: "chapterBefore", value: 10 }],
      nextScene: "c09_chat_last_night_hub"
    }
  ]);

  addActions("graduation_hall", [
    {
      id: "enter-graduation",
      label: "Enter graduation",
      detail: "Follow the current assignment onto the official route.",
      assignmentId: "c10_enter_graduation",
      timeMinutes: 15,
      fatigue: 0.2,
      completeAssignment: true,
      nextScene: "c10_deep_morning",
      effects: [{ type: "flag", key: "enteredGraduationHub", value: true }]
    },
    {
      id: "c10-before-stage-checkin",
      label: "Pause before the stage",
      detail: "One last private breath before the room starts calling it a future.",
      once: true,
      hidden: true,
      conditions: [{ type: "chapterAtLeast", value: 10 }],
      nextScene: "c10_chat_before_stage_hub"
    }
  ]);

  addChoiceScene("c03_chat_gallery_edges", 3, "Edges Of The Footage", "Observation Hall", "sim", "Camille", [
    "The observation hall has gone quiet between review blocks. Camille stands with a tablet tucked under one arm. Julian has found the one place with flattering light. Theo is pretending not to count the ways this gets weaponized.",
    "They are not arguing yet. They are arranging the battlefield for an argument."
  ], [
    hubChoice("Ask Camille what the footage proves and what it only suggests.", [
      { type: "relationship", key: "Camille", delta: 1 },
      { type: "npc", key: "Camille", trust: 1, respect: 1, memory: "You asked Camille to separate proof from pressure after the gallery review." },
      { type: "stat", key: "control", delta: 1 },
      { type: "flag", key: "c03CamilleProofTalk", value: true }
    ], "c03_hub_gallery"),
    hubChoice("Ask Julian how to survive becoming the room's favorite story.", [
      { type: "relationship", key: "Julian", delta: 1 },
      { type: "npc", key: "Julian", trust: 1, memory: "You asked Julian how to control attention without becoming it." },
      { type: "stat", key: "independentPath", delta: 1 },
      { type: "flag", key: "c03JulianStoryTalk", value: true }
    ], "c03_hub_gallery"),
    hubChoice("Ask Theo which concern he is not saying because it sounds unkind.", [
      { type: "relationship", key: "Theo", delta: 1 },
      { type: "npc", key: "Theo", trust: 1, concern: -1, memory: "You invited Theo to say the hard part without apologizing for it." },
      { type: "stat", key: "restraint", delta: 1 },
      { type: "flag", key: "c03TheoConcernTalk", value: true }
    ], "c03_hub_gallery")
  ]);

  addChoiceScene("c04_chat_training_margin", 4, "The Margin Of The Drill", "Training Wing", "sim", "Vance", [
    "Vance watches the room with the expression of a man grading both the disaster and the paperwork it will become. Camille stands near the scoring board, precise enough to make the numbers nervous.",
    "The next drill is not waiting for confidence. It is waiting for attendance."
  ], [
    hubChoice("Ask Vance what failure looks like when it is still useful.", [
      { type: "relationship", key: "Vance", delta: 1 },
      { type: "npc", key: "Vance", respect: 1, memory: "You asked Vance for useful failure instead of flattering success." },
      { type: "stat", key: "contractorPath", delta: 1 },
      { type: "flag", key: "c04VanceUsefulFailure", value: true }
    ], "c04_hub_training"),
    hubChoice("Ask Camille to call out the mistake she thinks you will make.", [
      { type: "relationship", key: "Camille", delta: 1 },
      { type: "npc", key: "Camille", trust: 1, respect: 1, memory: "You asked Camille for the warning before the drill made it expensive." },
      { type: "stat", key: "control", delta: 1 },
      { type: "flag", key: "c04CamilleMistakeCallout", value: true }
    ], "c04_hub_training"),
    hubChoice("Keep the question to yourself and spend the minute settling your pulse.", [
      { type: "stat", key: "restraint", delta: 1 },
      { type: "powerXp", amount: 1 },
      { type: "flag", key: "c04SettledBeforeDrill", value: true }
    ], "c04_hub_training")
  ]);

  addChoiceScene("c05_chat_dock_edges", 5, "Dockside Before The Bad Idea", "East Dock", "city", "Piper", [
    "Piper leans against a bollard like the dock personally invited her to be a problem. Ben checks sightlines. Rina watches the water like it insulted her.",
    "Everyone is pretending this is manageable. Everyone is good enough at pretending to make that worrying."
  ], [
    hubChoice("Ask Piper what she does when the bad idea is also the right one.", [
      { type: "relationship", key: "Piper", delta: 1 },
      { type: "npc", key: "Piper", trust: 1, attraction: 1, memory: "At the dock, you asked Piper about the difference between reckless and necessary." },
      { type: "stat", key: "independentPath", delta: 1 },
      { type: "flag", key: "c05PiperBadIdeaTalk", value: true }
    ], "c05_hub_dock"),
    hubChoice("Ask Ben to name the part of the plan that gets someone hurt.", [
      { type: "relationship", key: "Ben", delta: 1 },
      { type: "npc", key: "Ben", trust: 1, memory: "You asked Ben where the plan would put a body on the line." },
      { type: "stat", key: "restraint", delta: 1 },
      { type: "flag", key: "c05BenHurtPoint", value: true }
    ], "c05_hub_dock"),
    hubChoice("Tell Rina you want clean execution more than a spectacular win.", [
      { type: "relationship", key: "Rina", delta: 1 },
      { type: "npc", key: "Rina", respect: 1, friction: 1, memory: "You framed the dock test as execution instead of spectacle." },
      { type: "stat", key: "control", delta: 1 },
      { type: "flag", key: "c05RinaCleanExecution", value: true }
    ], "c05_hub_dock")
  ]);

  addChoiceScene("c06_chat_horizon_threshold", 6, "Threshold Etiquette", "Event Horizon", "horizon", "Julian", [
    "Julian adjusts his cuffs with theatrical calm. Kaito's staff watches the room without looking like staff. Somewhere past the music, the night is deciding what kind of story it wants to be.",
    "Neutral ground is still ground. It still has pressure points."
  ], [
    hubChoice("Ask Julian which mask he wears when everyone else is also performing.", [
      { type: "relationship", key: "Julian", delta: 1 },
      { type: "npc", key: "Julian", trust: 1, attraction: 1, memory: "At Event Horizon, you asked Julian which performance was actually armor." },
      { type: "flag", key: "c06JulianMaskTalk", value: true }
    ], "c06_hub_event"),
    hubChoice("Ask Kaito what neutral ground costs when nobody calls it a price.", [
      { type: "relationship", key: "Kaito", delta: 1 },
      { type: "npc", key: "Kaito", respect: 1, memory: "You asked Kaito what neutrality was charging before the bill arrived." },
      { type: "stat", key: "contractorPath", delta: 1 },
      { type: "flag", key: "c06KaitoNeutralCost", value: true }
    ], "c06_hub_event"),
    hubChoice("Map the exits before you let the night become social.", [
      { type: "stat", key: "control", delta: 1 },
      { type: "stat", key: "aegisTrust", delta: 1 },
      { type: "flag", key: "c06MappedHorizonExits", value: true }
    ], "c06_hub_event")
  ]);

  addChoiceScene("c07_chat_bait_conscience", 7, "Before The Hook", "Briefing Room", "aegis", "Theo", [
    "Theo has turned one corner of the briefing table into a nest of probability branches. Jordan sits sideways in a chair, watching people watch each other. Camille has not said the word bait since you entered.",
    "That does not make the word less present."
  ], [
    hubChoice("Ask Theo for the version of the plan he would refuse to sign.", [
      { type: "relationship", key: "Theo", delta: 1 },
      { type: "npc", key: "Theo", trust: 1, respect: 1, memory: "Before the bait plan, you asked Theo where refusal belonged." },
      { type: "stat", key: "restraint", delta: 1 },
      { type: "flag", key: "c07TheoRefusalLine", value: true }
    ], "c07_hub_bait"),
    hubChoice("Ask Jordan who is performing certainty for the room.", [
      { type: "relationship", key: "Jordan", delta: 1 },
      { type: "npc", key: "Jordan", trust: 1, memory: "You asked Jordan to read the room before certainty became contagious." },
      { type: "stat", key: "independentPath", delta: 1 },
      { type: "flag", key: "c07JordanCertaintyRead", value: true }
    ], "c07_hub_bait"),
    hubChoice("Tell Camille you want guardrails written before courage starts improvising.", [
      { type: "relationship", key: "Camille", delta: 1 },
      { type: "npc", key: "Camille", trust: 1, respect: 1, memory: "You asked Camille for guardrails before the bait plan moved." },
      { type: "stat", key: "foundationPath", delta: 1 },
      { type: "flag", key: "c07CamilleGuardrails", value: true }
    ], "c07_hub_bait")
  ]);

  addChoiceScene("c08_chat_airbase_hold", 8, "The Runway Holds Its Breath", "Airbase Hangar", "aegis", "Piper", [
    "Piper is loose in the way speedsters get when standing still becomes a public service. Rina watches the runway like she wants to race the concept of consequence. Vance checks his tablet and does not pretend this is normal.",
    "The hangar has room for aircraft, emergency teams, and one conversation before the test becomes motion."
  ], [
    hubChoice("Ask Piper what she needs from you if the joke drops out from under her.", [
      { type: "relationship", key: "Piper", delta: 1 },
      { type: "npc", key: "Piper", trust: 1, attraction: 1, memory: "Before Mach Five, you asked Piper what she needed when humor stopped holding." },
      { type: "stat", key: "restraint", delta: 1 },
      { type: "flag", key: "c08PiperNeedsTalk", value: true }
    ], "c08_hub_airbase"),
    hubChoice("Ask Rina what she sees in the runway that everyone else keeps missing.", [
      { type: "relationship", key: "Rina", delta: 1 },
      { type: "npc", key: "Rina", respect: 1, memory: "At the airbase, you asked Rina to read movement instead of merely chase it." },
      { type: "stat", key: "control", delta: 1 },
      { type: "flag", key: "c08RinaRunwayRead", value: true }
    ], "c08_hub_airbase"),
    hubChoice("Tell Vance you want the abort call early, clear, and human.", [
      { type: "relationship", key: "Vance", delta: 1 },
      { type: "npc", key: "Vance", trust: 1, respect: 1, memory: "You asked Vance to keep the abort call human before Mach Five." },
      { type: "stat", key: "aegisTrust", delta: 1 },
      { type: "flag", key: "c08VanceHumanAbort", value: true }
    ], "c08_hub_airbase")
  ]);

  addChoiceScene("c09_chat_last_night_hub", 9, "Hallway Gravity", "Residence Wing", "aegis", "Seth", [
    "The residence hallway has become a map of almost-goodbyes. Camille's door is half open. Julian has acquired someone else's packing tape. Theo is trying to make a checklist look casual. Piper is making none of it easier by being quiet.",
    "You have time for one pass before the night gathers itself."
  ], [
    hubChoice("Stop with Camille and ask what honesty costs after graduation.", [
      { type: "relationship", key: "Camille", delta: 1 },
      { type: "npc", key: "Camille", trust: 1, attraction: 1, memory: "On the last night, you asked Camille what honesty would cost after Aegis." },
      { type: "flag", key: "c09CamilleHonestyCost", value: true }
    ], "c09_hub_graduation_eve"),
    hubChoice("Let Julian turn the hallway into a joke until he says the real part.", [
      { type: "relationship", key: "Julian", delta: 1 },
      { type: "npc", key: "Julian", trust: 1, attraction: 1, memory: "On the last night, you stayed through Julian's joke until the real answer arrived." },
      { type: "flag", key: "c09JulianRealPart", value: true }
    ], "c09_hub_graduation_eve"),
    hubChoice("Ask Theo which item on the checklist scares him most.", [
      { type: "relationship", key: "Theo", delta: 1 },
      { type: "npc", key: "Theo", trust: 1, concern: -1, memory: "On the last night, you asked Theo which fear had earned its place." },
      { type: "flag", key: "c09TheoChecklistFear", value: true }
    ], "c09_hub_graduation_eve")
  ]);

  addChoiceScene("c10_chat_before_stage_hub", 10, "Before The Microphone", "Graduation Hall", "graduation", "Vance", [
    "The hallway behind Graduation Hall is narrow enough to make the ceremony feel like a machine feeding people onto a stage. Vance stands near the door. Piper, Camille, Julian, and Theo are all visible in different reflections.",
    "No one says good luck. Good luck would be too small."
  ], [
    hubChoice("Ask Vance what he hopes you refuse to become.", [
      { type: "relationship", key: "Vance", delta: 1 },
      { type: "npc", key: "Vance", trust: 1, memory: "Before graduation, you asked Vance what refusal should protect." },
      { type: "stat", key: "resolve", delta: 1 },
      { type: "flag", key: "c10VanceRefusal", value: true }
    ], "c10_hub_graduation"),
    hubChoice("Look for the people who changed the file and let them see you choose calm.", [
      { type: "relationship", key: "Piper", delta: 1 },
      { type: "relationship", key: "Camille", delta: 1 },
      { type: "relationship", key: "Julian", delta: 1 },
      { type: "relationship", key: "Theo", delta: 1 },
      { type: "stat", key: "restraint", delta: 1 },
      { type: "flag", key: "c10ChoseCalmBeforeStage", value: true }
    ], "c10_hub_graduation"),
    hubChoice("Stand alone for one minute and decide the future gets your name before anyone else's plan.", [
      { type: "stat", key: "independentPath", delta: 1 },
      { type: "stat", key: "resolve", delta: 1 },
      { type: "flag", key: "c10NameBeforePlan", value: true }
    ], "c10_hub_graduation")
  ]);

  function chapterWindow(chapter) {
    return [{ type: "chapterAtLeast", value: chapter }, { type: "chapterBefore", value: chapter + 1 }];
  }

  function onceChapterAction(id, chapter, label, detail, nextScene) {
    return {
      id,
      label,
      detail,
      once: true,
      hidden: true,
      conditions: chapterWindow(chapter),
      nextScene
    };
  }

  function trainingAction(id, chapter, label, detail, text, effects, fatigue = 1.5, timeMinutes = 45, repeatLimit = 2) {
    return {
      id,
      label,
      detail,
      repeatLimit,
      conditions: chapterWindow(chapter),
      timeMinutes,
      fatigue,
      text,
      effects: [
        ...effects,
        { type: "status", key: "energy", value: "Recently trained" }
      ]
    };
  }

  function addVariants(sceneId, variants) {
    const scene = scenes[sceneId];
    if (!scene) return;
    scene.variants = scene.variants || [];
    scene.variants.push(...variants);
  }

  function addChoiceEffects(sceneId, choiceText, effects) {
    const scene = scenes[sceneId];
    if (!scene || !scene.choices) return;
    const choice = scene.choices.find((item) => item.text === choiceText || item.text.startsWith(choiceText));
    if (!choice) return;
    choice.effects = choice.effects || [];
    choice.effects.push(...effects);
  }

  addVariants("c04_camille_test", [
    {
      conditions: [{ type: "matureContent" }],
      text: ["Aegis training does not pretend pain is symbolic. A resident two bays over gets folded wrong by a force wall, swears through a broken wrist, and is walking again twenty minutes later after a medic in blue gloves talks the bone back into line."]
    }
  ]);

  addVariants("c05_after_flight", [
    {
      conditions: [
        { type: "matureContent" },
        { type: "flag", key: "scorchedDock" }
      ],
      text: ["Your ribs complain when you breathe too deep, and the scorched strip across your jacket has the ugly sweet smell of fabric that got too close to real heat. Aegis medics call it superficial. Your nerves file a dissenting report."]
    },
    {
      conditions: [
        { type: "matureContent" },
        { type: "flag", key: "baySplashdown" }
      ],
      text: ["The water takes the worst of the impact and still hits like concrete. Your shoulder blooms hot, then numb, then hot again. The dock medic checks your pupils and tells you the bruise will look dramatic enough to impress nobody useful."]
    }
  ]);

  addVariants("c07_grapple", [
    {
      conditions: [{ type: "matureContent" }],
      text: ["Close contact strips the fight of comic-book distance. Rhea's bones shift under your grip as her physiology adapts around pressure; your own joints grind hard enough that the pain arrives white and clean. Somewhere behind you, a medic says standby like that word can hold a spine together."]
    },
    {
      conditions: [
        { type: "matureContent" },
        { type: "flag", key: "lethalCharge" }
      ],
      text: ["The charge inside you is not dramatic. It is surgical and horrible: heat, nerve, muscle, the exact amount of force required to make a body stop being a problem."]
    },
    {
      conditions: [
        { type: "matureContent" },
        { type: "flag", key: "triedContainment" }
      ],
      text: ["Containment is not gentle just because it is merciful. Rhea fights the hold until tendons stand out in her throat and your forearm shakes from keeping the pressure below the line where restraint becomes damage."]
    }
  ]);

  addVariants("c07_afteraction_erased", [
    {
      conditions: [{ type: "matureContent" }],
      text: ["The dome smells like ozone and pulverized flooring. There is no body to work on, which somehow makes the medics move faster: checking your hands, your pulse, your eyes, the hairline burns where released power backwashed across your skin."]
    }
  ]);

  addVariants("c07_afteraction_contained", [
    {
      conditions: [{ type: "matureContent" }],
      text: ["The containment team carries Rhea out alive and fighting sedation, one arm bent at an angle that keeps trying to correct itself. Your own hand has locked around the shape of the hold; the medic has to pry your fingers open one at a time."]
    }
  ]);

  addVariants("c07_afteraction_escaped", [
    {
      conditions: [{ type: "matureContent" }],
      text: ["The breach leaves practical damage: torn gloves, blood in someone's teeth, a medic pressing sealant into a cut before adrenaline can lie about how deep it is. Rhea escaped, but the dome still looks like she signed it."]
    }
  ]);

  addVariants("c08_mach5", [
    {
      conditions: [
        { type: "matureContent" },
        { type: "flag", key: "machFive" }
      ],
      text: ["Mach Five turns safety math into violence with better paperwork. The catch drives a shock through your skeleton so hard your teeth click shut. Piper skids out laughing, then limps three steps before the speed-healing catches up and the medics descend anyway."]
    },
    {
      conditions: [
        { type: "matureContent" },
        { type: "flag", key: "machThree" }
      ],
      text: ["Mach Three is the restrained version, which only means nobody loses consciousness. The impact still bruises deep enough that the airbase medic checks your ribs twice and tells Piper to stop grinning until her ankle finishes reknitting."]
    }
  ]);

  addChoiceEffects("c05_flight", "Use a warm air column to slow the fall and touch down clean.", [
    { type: "status", key: "condition", value: "Stable after landing" },
    { type: "status", key: "lastFight", value: "Dock flight: clean landing" }
  ]);

  addChoiceEffects("c05_flight", "Burst again, overcorrect, and skid back in with style points and scorch marks.", [
    { type: "status", key: "condition", value: "Scorched and bruised" },
    { type: "status", key: "lastFight", value: "Dock flight: scorched skid" }
  ]);

  addChoiceEffects("c05_flight", "Let the water catch you, absorb the impact, and climb out drenched.", [
    { type: "status", key: "condition", value: "Drenched, shoulder bruised" },
    { type: "status", key: "lastFight", value: "Dock flight: hard water landing" }
  ]);

  addChoiceEffects("c07_grapple", "Immobilize her completely, then finish it with lightning.", [
    { type: "status", key: "condition", value: "Power-burned and drained" }
  ]);

  addChoiceEffects("c07_grapple", "Maintain containment and call Camille to lock the field with you.", [
    { type: "status", key: "condition", value: "Hand trauma, severe strain" }
  ]);

  addChoiceEffects("c07_grapple", "Trust Piper to break the contact window while Theo calls the safest branch.", [
    { type: "status", key: "condition", value: "Bruised, supported" }
  ]);

  addChoiceEffects("c07_grapple", "Try to hold everyone safe at once, even if it means losing her.", [
    { type: "status", key: "condition", value: "Banged up, furious" }
  ]);

  addChoiceEffects("c08_airbase", "Start at Mach 2. Prove the baseline before getting stupid.", [
    { type: "status", key: "condition", value: "Stable, impact sore" },
    { type: "status", key: "lastFight", value: "Mach 2 catch" }
  ]);

  addChoiceEffects("c08_airbase", "\"Mach 3, Lane. Make it count.\"", [
    { type: "status", key: "condition", value: "Bruised by Mach 3 catch" },
    { type: "status", key: "lastFight", value: "Mach 3 catch" }
  ]);

  addChoiceEffects("c08_airbase", "Set Mach 3 as the hard bracket and make it a clean data run.", [
    { type: "status", key: "condition", value: "Bruised by Mach 3 catch" },
    { type: "status", key: "lastFight", value: "Mach 3 catch" }
  ]);

  addChoiceEffects("c08_airbase", "Whisper \"Mach 5\" and warn the observers not to get blown away.", [
    { type: "status", key: "condition", value: "Rattled from Mach 5 catch" },
    { type: "status", key: "stress", value: "Adrenaline crash pending" },
    { type: "status", key: "lastFight", value: "Mach 5 catch" }
  ]);

  [
    ["c03_hub_return_common", 3, "Common Lounge After Baseline", "Common Lounge", "aegis", "c03_review_gallery", "common_lounge", "The lounge is trying to become normal again. It is failing in useful ways: softer voices, more side glances, nobody quite sure whether to congratulate you or step back."],
    ["c03_hub_return_medical", 3, "Medical After Baseline", "Medical", "aegis", "c03_review_gallery", "medical", "Medical keeps its soft lights on you without pretending light is the same as comfort. Every machine here knows how to make concern sound like a beep."],
    ["c03_hub_return_training", 3, "Training Wing After Baseline", "Training Wing", "sim", "c03_review_gallery", "training_wing", "The training wing feels less theoretical now. The floor markings are not suggestions anymore. They are promises the building hopes you can keep."],
    ["c03_hub_return_admin", 3, "Admin Wing After Baseline", "Admin Wing", "aegis", "c03_review_gallery", "admin_wing", "The admin wing turns crisis into folder names. Somewhere behind the quiet doors, yesterday is becoming language that can outlive everyone who was there."],
    ["c04_hub_return_sim", 4, "Simulation Block Margin", "Simulation Block A", "sim", "c04_report_training", "simulation_block", "Simulation Block A keeps breathing in sealed-door cycles. Every resident who comes out has the same expression for half a second: I know something now."],
    ["c04_hub_return_courtyard", 4, "Courtyard Before Pressure", "Courtyard", "aegis", "c04_report_training", "courtyard", "The courtyard wind has opinions about pressure, none of them official. It makes room for nerves without filing a report."],
    ["c04_hub_return_common", 4, "Common Lounge Before Pressure", "Common Lounge", "aegis", "c04_report_training", "common_lounge", "The lounge is louder than the training wing and somehow less honest. People talk around fear until the shape of it appears in the gaps."],
    ["c05_hub_return_anchor", 5, "Rusty Anchor Drift", "The Rusty Anchor", "city", "c05_report_dock", "rusty_anchor", "The Rusty Anchor keeps the music just loud enough to let people choose whether they are confessing or only making conversation."],
    ["c05_hub_return_prom", 5, "Promenade Before The Dock", "Blackwater Promenade", "city", "c05_report_dock", "blackwater_promenade", "The promenade keeps selling ordinary life beside supervised danger: lights on the water, food-cart smoke, strangers with no idea your file exists."],
    ["c05_hub_return_transit", 5, "Transit Before The Dock", "Transit Platform", "city", "c05_report_dock", "transit_platform", "The transit platform turns movement into permission. Every arriving shuttle feels like a reminder that Aegis can open doors and still own the schedule."],
    ["c06_hub_return_prom", 6, "Promenade Before Horizon", "Blackwater Promenade", "city", "c06_enter_horizon", "blackwater_promenade", "Blackwater is dressed for night. The city has no idea whether you are here to be young, useful, dangerous, or all three in the wrong order."],
    ["c06_hub_return_transit", 6, "Transit Before Horizon", "Transit Platform", "city", "c06_enter_horizon", "transit_platform", "The transit platform looks different after dark. Everyone waiting has somewhere to be and at least one reason not to explain it."],
    ["c06_hub_return_anchor", 6, "Anchor Before Horizon", "The Rusty Anchor", "city", "c06_enter_horizon", "rusty_anchor", "The Rusty Anchor knows how to make nervous people look casual. That may be its actual power."],
    ["c07_hub_return_medical", 7, "Medical Before The Hook", "Medical", "aegis", "c07_report_bait", "medical", "Medical is preparing like the plan has already gone wrong. That is either pessimism or competence. Around Aegis, the difference gets blurry."],
    ["c07_hub_return_records", 7, "Records Annex Before The Hook", "Records Annex", "aegis", "c07_report_bait", "records_annex", "The records annex keeps its secrets in tidy rows, which only makes the secrets seem ruder."],
    ["c07_hub_return_training", 7, "Training Wing Before The Hook", "Training Wing", "sim", "c07_report_bait", "training_wing", "The training wing has no patience for moral uncertainty. It only asks whether you can stop, start, protect, and survive on command."],
    ["c08_hub_return_medical", 8, "Medical At The Airbase", "Medical", "aegis", "c08_report_airbase", "medical", "Medical has brought portable certainty to the airbase: kits, monitors, medics, and eyes that have already imagined the worst version of the next hour."],
    ["c08_hub_return_transit", 8, "Transit At The Airbase", "Transit Platform", "city", "c08_report_airbase", "transit_platform", "The shuttle line back to Aegis waits like an escape route nobody wants to need."],
    ["c09_hub_return_rooftop", 9, "Rooftop On The Last Night", "Rooftop", "aegis", "c09_begin_last_night", "rooftop", "The rooftop turns graduation eve into wind and distance. From up here, Aegis Point looks almost simple. That feels like a trick."],
    ["c09_hub_return_cafeteria", 9, "Cafeteria On The Last Night", "Cafeteria", "aegis", "c09_begin_last_night", "cafeteria", "The cafeteria is pretending this is only dinner. Everyone eating too slowly knows better."],
    ["c09_hub_return_lounge", 9, "Common Lounge On The Last Night", "Common Lounge", "aegis", "c09_begin_last_night", "common_lounge", "The common lounge has become a place for people to sit near the ending without admitting they came looking for it."],
    ["c10_hub_return_courtyard", 10, "Courtyard Before The Stage", "Courtyard", "aegis", "c10_enter_graduation", "courtyard", "The courtyard is too bright this morning. Even the ocean seems to be waiting for the speech to decide what kind of day this becomes."],
    ["c10_hub_return_admin", 10, "Admin Wing Before The Stage", "Admin Wing", "aegis", "c10_enter_graduation", "admin_wing", "The admin wing smells like toner, polish, and futures being edited before anyone signs them."],
    ["c10_hub_return_hall", 10, "Graduation Hall Before The Stage", "Graduation Hall", "graduation", "c10_enter_graduation", "graduation_hall", "Graduation Hall keeps filling. Every new voice makes the stage feel closer."]
  ].forEach(([id, chapter, title, location, background, assignmentId, locationId, text]) => {
    addHubScene(id, chapter, title, location, background, assignmentId, locationId, [text]);
  });

  addChoiceScene("c03_chat_piper_lounge_followup", 3, "Piper, Still Standing", "Common Lounge", "aegis", "Piper", [
    "Piper has found the arm of a couch and is using it like a launch rail she has chosen, heroically, not to launch from.",
    "\"I am being incredibly still,\" she says. \"There should be funding for this.\" Her grin lands late. Yesterday is under it."
  ], [
    hubChoice("Ask what stillness costs her when the room is watching.", [
      { type: "relationship", key: "Piper", delta: 1 },
      { type: "npc", key: "Piper", trust: 1, concern: -1, memory: "After baseline, you asked Piper what stillness cost her instead of treating her speed like a joke." },
      { type: "flag", key: "c03PiperStillnessCost", value: true }
    ], "c03_hub_return_common"),
    hubChoice("Offer a bad joke with an exit built into it.", [
      { type: "relationship", key: "Piper", delta: 1 },
      { type: "npc", key: "Piper", attraction: 1, trust: 1, memory: "You gave Piper humor that did not trap her inside the performance." },
      { type: "stat", key: "audacity", delta: 1 },
      { type: "flag", key: "c03PiperExitJoke", value: true }
    ], "c03_hub_return_common"),
    hubChoice("Tell her the jokes make it hard to know when she is asking for help.", [
      { type: "npc", key: "Piper", respect: 1, friction: 1, memory: "You called out Piper's deflection before it could become the whole relationship." },
      { type: "stat", key: "resolve", delta: 1 },
      { type: "flag", key: "c03PiperDeflectionNamed", value: true }
    ], "c03_hub_return_common")
  ]);

  addChoiceScene("c03_chat_ben_medical_followup", 3, "Ben, Quiet Triage", "Medical", "aegis", "Ben", [
    "Ben sits near the medical doors with an ice pack he does not seem to need and a paper cup of water he has not touched.",
    "He looks up when you arrive. \"People keep asking if I am okay because I look like I should be. That is a weird sentence.\""
  ], [
    hubChoice("Ask what he protects when nobody is actively falling.", [
      { type: "relationship", key: "Ben", delta: 1 },
      { type: "npc", key: "Ben", trust: 1, memory: "You asked Ben what protection meant when there was no obvious impact to absorb." },
      { type: "stat", key: "foundationPath", delta: 1 },
      { type: "flag", key: "c03BenQuietProtection", value: true }
    ], "c03_hub_return_medical"),
    hubChoice("Tell him sturdy people are still allowed to need backup.", [
      { type: "relationship", key: "Ben", delta: 1 },
      { type: "npc", key: "Ben", trust: 1, concern: -1, memory: "You reminded Ben that endurance was not the same as isolation." },
      { type: "stat", key: "restraint", delta: 1 },
      { type: "flag", key: "c03BenAllowedBackup", value: true }
    ], "c03_hub_return_medical"),
    hubChoice("Ask if he thinks Aegis confuses useful with safe.", [
      { type: "relationship", key: "Ben", delta: 1 },
      { type: "npc", key: "Ben", respect: 1, memory: "You asked Ben whether Aegis mistakes usefulness for safety." },
      { type: "stat", key: "contractorPath", delta: 1 },
      { type: "flag", key: "c03BenUsefulSafe", value: true }
    ], "c03_hub_return_medical")
  ]);

  addChoiceScene("c03_chat_rina_scoreboard", 3, "Rina, Scoreboard Mercy", "Training Wing", "sim", "Rina", [
    "Rina stands under the training-wing scoreboard with her arms folded, studying numbers that are not hers with the intensity of someone planning to defeat them anyway.",
    "\"They should not post half this data,\" she says. \"Unless the goal is making everyone stupid.\""
  ], [
    hubChoice("Ask what number she trusts least.", [
      { type: "relationship", key: "Rina", delta: 1 },
      { type: "npc", key: "Rina", respect: 1, memory: "You asked Rina which number lied instead of asking whether she was impressed." },
      { type: "stat", key: "control", delta: 1 },
      { type: "flag", key: "c03RinaDistrustsScoreboard", value: true }
    ], "c03_hub_return_training"),
    hubChoice("Tell her rivalry only works if both people survive it.", [
      { type: "npc", key: "Rina", respect: 1, friction: 1, memory: "You put a survival limit around rivalry before Rina could make it pure velocity." },
      { type: "stat", key: "restraint", delta: 1 },
      { type: "flag", key: "c03RinaRivalryLimit", value: true }
    ], "c03_hub_return_training"),
    hubChoice("Offer to trade one ugly lesson from your file for one from hers.", [
      { type: "relationship", key: "Rina", delta: 1 },
      { type: "npc", key: "Rina", trust: 1, memory: "You traded ugly lessons with Rina instead of posturing at the scoreboard." },
      { type: "flag", key: "c03RinaUglyLessonTrade", value: true }
    ], "c03_hub_return_training")
  ]);

  addChoiceScene("c03_chat_jordan_admin_wing", 3, "Jordan, Paper Weather", "Admin Wing", "aegis", "Jordan", [
    "Jordan is leaning near a corridor directory, watching staff carry folders with the expression of someone reading subtitles nobody else can see.",
    "\"Paper has weather,\" they say. \"Today is humid with liability.\""
  ], [
    hubChoice("Ask what the staff are trying not to say out loud.", [
      { type: "relationship", key: "Jordan", delta: 1 },
      { type: "npc", key: "Jordan", trust: 1, memory: "You trusted Jordan's read on administrative silence after baseline." },
      { type: "stat", key: "exposure", delta: 1 },
      { type: "flag", key: "c03JordanPaperWeather", value: true }
    ], "c03_hub_return_admin"),
    hubChoice("Ask Jordan what gossip should never be used for.", [
      { type: "relationship", key: "Jordan", delta: 1 },
      { type: "npc", key: "Jordan", respect: 1, memory: "You asked Jordan about restraint inside the gossip network." },
      { type: "stat", key: "restraint", delta: 1 },
      { type: "flag", key: "c03JordanGossipEthics", value: true }
    ], "c03_hub_return_admin"),
    hubChoice("Tell them you are not ready to become everyone's headline.", [
      { type: "npc", key: "Jordan", trust: 1, concern: 1, memory: "You admitted to Jordan that being a headline scared you." },
      { type: "flag", key: "c03JordanHeadlineFear", value: true }
    ], "c03_hub_return_admin")
  ]);

  addChoiceScene("c04_chat_theo_sim_margin", 4, "Theo, Bad Branches", "Simulation Block A", "sim", "Theo", [
    "Theo has three probability branches open and a fourth minimized like hiding it makes it less rude.",
    "\"The machine keeps labeling the least-bad options as acceptable,\" he says. \"I hate when math develops a management voice.\""
  ], [
    hubChoice("Ask him to show you the branch he hid.", [
      { type: "relationship", key: "Theo", delta: 1 },
      { type: "npc", key: "Theo", trust: 1, respect: 1, memory: "You asked Theo for the hidden branch instead of the comforting one." },
      { type: "stat", key: "control", delta: 1 },
      { type: "flag", key: "c04TheoHiddenBranch", value: true }
    ], "c04_hub_return_sim"),
    hubChoice("Tell him acceptable is not the same as chosen.", [
      { type: "relationship", key: "Theo", delta: 1 },
      { type: "npc", key: "Theo", concern: -1, memory: "You gave Theo language for refusing acceptable harm." },
      { type: "stat", key: "restraint", delta: 1 },
      { type: "flag", key: "c04TheoAcceptableChosen", value: true }
    ], "c04_hub_return_sim"),
    hubChoice("Ask whether he ever lets a good outcome be good.", [
      { type: "npc", key: "Theo", friction: 1, respect: 1, memory: "You challenged Theo to recognize good outcomes without punishing himself for the math." },
      { type: "stat", key: "resolve", delta: 1 },
      { type: "flag", key: "c04TheoGoodOutcomeChallenge", value: true }
    ], "c04_hub_return_sim")
  ]);

  addChoiceScene("c04_chat_piper_courtyard_pressure", 4, "Piper, Braking Distance", "Courtyard", "aegis", "Piper", [
    "Piper is walking the courtyard perimeter at a speed that would be normal for anyone else and clearly insulting to her.",
    "\"Vance says my braking distance has emotional implications,\" she says. \"Which is rude, because he is right.\""
  ], [
    hubChoice("Ask what she wants to stop for, not just stop before.", [
      { type: "relationship", key: "Piper", delta: 1 },
      { type: "npc", key: "Piper", trust: 1, attraction: 1, memory: "You asked Piper what was worth stopping for." },
      { type: "flag", key: "c04PiperStopFor", value: true }
    ], "c04_hub_return_courtyard"),
    hubChoice("Offer to time slow laps instead of fast ones.", [
      { type: "relationship", key: "Piper", delta: 1 },
      { type: "npc", key: "Piper", respect: 1, memory: "You treated Piper's slow work as training instead of punishment." },
      { type: "stat", key: "restraint", delta: 1 },
      { type: "flag", key: "c04PiperSlowLaps", value: true }
    ], "c04_hub_return_courtyard"),
    hubChoice("Tell her reckless is not the same as free.", [
      { type: "npc", key: "Piper", friction: 1, respect: 1, memory: "You named the difference between recklessness and freedom." },
      { type: "stat", key: "resolve", delta: 1 },
      { type: "flag", key: "c04PiperRecklessFree", value: true }
    ], "c04_hub_return_courtyard")
  ]);

  addChoiceScene("c04_chat_julian_lounge_attention", 4, "Julian, Honest Lighting", "Common Lounge", "aegis", "Julian", [
    "Julian is fixing a flickering lounge light by making the flicker look intentional. It is petty, beautiful, and somehow a public service.",
    "\"Attention is not the enemy,\" he says. \"Unpaid attention is. Very different tax bracket.\""
  ], [
    hubChoice("Ask what attention costs him when he cannot control it.", [
      { type: "relationship", key: "Julian", delta: 1 },
      { type: "npc", key: "Julian", trust: 1, memory: "You asked Julian about uncontrolled attention instead of admiring the performance." },
      { type: "flag", key: "c04JulianAttentionCost", value: true }
    ], "c04_hub_return_common"),
    hubChoice("Tell him his deflection is good, but not invisible.", [
      { type: "npc", key: "Julian", respect: 1, friction: 1, memory: "You saw Julian's deflection without making a spectacle of it." },
      { type: "stat", key: "control", delta: 1 },
      { type: "flag", key: "c04JulianDeflectionSeen", value: true }
    ], "c04_hub_return_common"),
    hubChoice("Help him turn the bad light into a room-wide bit.", [
      { type: "relationship", key: "Julian", delta: 1 },
      { type: "npc", key: "Julian", attraction: 1, trust: 1, memory: "You helped Julian make a room laugh without demanding sincerity first." },
      { type: "stat", key: "audacity", delta: 1 },
      { type: "flag", key: "c04JulianLightBit", value: true }
    ], "c04_hub_return_common")
  ]);

  addChoiceScene("c05_chat_jordan_anchor", 5, "Jordan, Local Color", "The Rusty Anchor", "city", "Jordan", [
    "Jordan has found a booth with sightlines to the door, the bar mirror, and two conversations that are pretending not to be about Aegis.",
    "\"The city has its own file on us,\" they say. \"It is just distributed across bartenders and people who smoke outside.\""
  ], [
    hubChoice("Ask what Blackwater knows that Aegis refuses to learn.", [
      { type: "relationship", key: "Jordan", delta: 1 },
      { type: "npc", key: "Jordan", trust: 1, respect: 1, memory: "At the Rusty Anchor, you asked Jordan what local knowledge could teach Aegis." },
      { type: "stat", key: "civilianPath", delta: 1 },
      { type: "flag", key: "c05JordanLocalKnowledge", value: true }
    ], "c05_hub_return_anchor"),
    hubChoice("Ask them to stop one rumor before it becomes useful.", [
      { type: "relationship", key: "Jordan", delta: 1 },
      { type: "npc", key: "Jordan", respect: 1, memory: "You asked Jordan to spend social capital on prevention, not advantage." },
      { type: "stat", key: "foundationPath", delta: 1 },
      { type: "flag", key: "c05JordanStoppedRumor", value: true }
    ], "c05_hub_return_anchor"),
    hubChoice("Tell them you hate how much you need the room read for you.", [
      { type: "npc", key: "Jordan", trust: 1, concern: 1, memory: "You admitted needing Jordan's read made you uncomfortable." },
      { type: "flag", key: "c05JordanNeedDiscomfort", value: true }
    ], "c05_hub_return_anchor")
  ]);

  addChoiceScene("c05_chat_camille_promenade", 5, "Camille, Civilian Angles", "Blackwater Promenade", "city", "Camille", [
    "Camille stands at the promenade rail, watching foot traffic instead of the water. Her eyes keep catching exits, bottlenecks, strollers, bikes, hands full of food.",
    "\"Sim civilians are kinder,\" she says. \"Real people improvise.\""
  ], [
    hubChoice("Ask her to teach you the first angle she checks.", [
      { type: "relationship", key: "Camille", delta: 1 },
      { type: "npc", key: "Camille", trust: 1, respect: 1, memory: "Camille taught you how she reads civilian angles before a field problem." },
      { type: "stat", key: "control", delta: 1 },
      { type: "flag", key: "c05CamilleCivilianAngles", value: true }
    ], "c05_hub_return_prom"),
    hubChoice("Ask whether control ever becomes an excuse to avoid trust.", [
      { type: "relationship", key: "Camille", delta: 1 },
      { type: "npc", key: "Camille", friction: 1, respect: 1, memory: "You challenged Camille on control and trust without turning it into a fight." },
      { type: "stat", key: "resolve", delta: 1 },
      { type: "flag", key: "c05CamilleControlTrust", value: true }
    ], "c05_hub_return_prom"),
    hubChoice("Stand quietly and let her finish mapping the crowd.", [
      { type: "npc", key: "Camille", trust: 1, memory: "You gave Camille quiet while she mapped the crowd." },
      { type: "stat", key: "restraint", delta: 1 },
      { type: "flag", key: "c05CamilleQuietMap", value: true }
    ], "c05_hub_return_prom")
  ]);

  addChoiceScene("c05_chat_vance_transit", 5, "Vance, Permission To Leave", "Transit Platform", "city", "Vance", [
    "Vance stands near the transit schedule with a paper cup of coffee and the bleak patience of a man who distrusts both paper and cups.",
    "\"Off-campus work makes people think the rules got smaller,\" he says. \"They got wider.\""
  ], [
    hubChoice("Ask which rule has saved the most lives.", [
      { type: "relationship", key: "Vance", delta: 1 },
      { type: "npc", key: "Vance", respect: 1, memory: "You asked Vance which rule had earned its place in blood." },
      { type: "stat", key: "aegisTrust", delta: 1 },
      { type: "flag", key: "c05VanceRuleEarned", value: true }
    ], "c05_hub_return_transit"),
    hubChoice("Ask which rule he would break for the right person.", [
      { type: "npc", key: "Vance", trust: 1, friction: 1, memory: "You asked Vance where his rules bend." },
      { type: "stat", key: "independentPath", delta: 1 },
      { type: "flag", key: "c05VanceRuleBends", value: true }
    ], "c05_hub_return_transit"),
    hubChoice("Tell him wide rules still need human judgment.", [
      { type: "relationship", key: "Vance", delta: 1 },
      { type: "npc", key: "Vance", respect: 1, memory: "You argued that field rules need human judgment." },
      { type: "stat", key: "contractorPath", delta: 1 },
      { type: "flag", key: "c05VanceHumanJudgment", value: true }
    ], "c05_hub_return_transit")
  ]);

  addChoiceScene("c06_chat_piper_promenade", 6, "Piper, Dress Shoes And Escape Routes", "Blackwater Promenade", "city", "Piper", [
    "Piper has dressed for the Event Horizon like someone dared her to prove tactical can flirt with expensive. She is still wearing shoes she could run in.",
    "\"Never trust an outfit you cannot flee in,\" she says. \"That is culture.\""
  ], [
    hubChoice("Ask whether she wants to flee tonight or stay for once.", [
      { type: "relationship", key: "Piper", delta: 1 },
      { type: "npc", key: "Piper", trust: 1, attraction: 1, memory: "Before Event Horizon, you asked Piper whether she wanted to flee or stay." },
      { type: "flag", key: "c06PiperStayOrFlee", value: true }
    ], "c06_hub_return_prom"),
    hubChoice("Compliment the exit strategy, not the outfit.", [
      { type: "relationship", key: "Piper", delta: 1 },
      { type: "npc", key: "Piper", respect: 1, memory: "You noticed Piper's practical escape plan before turning the moment pretty." },
      { type: "stat", key: "control", delta: 1 },
      { type: "flag", key: "c06PiperExitCompliment", value: true }
    ], "c06_hub_return_prom"),
    hubChoice("Tell her running is a plan, but not the only one.", [
      { type: "npc", key: "Piper", friction: 1, respect: 1, memory: "You challenged Piper to keep more than one plan ready." },
      { type: "stat", key: "restraint", delta: 1 },
      { type: "flag", key: "c06PiperMoreThanRunning", value: true }
    ], "c06_hub_return_prom")
  ]);

  addChoiceScene("c06_chat_theo_transit", 6, "Theo, Probability In A Nice Shirt", "Transit Platform", "city", "Theo", [
    "Theo is wearing a shirt with actual buttons and the expression of someone who distrusts buttons as a category.",
    "\"Social events are just combat encounters with plausible deniability,\" he says. \"That may be anxiety talking. Anxiety has excellent notes.\""
  ], [
    hubChoice("Ask him for one plan that is not a worst-case branch.", [
      { type: "relationship", key: "Theo", delta: 1 },
      { type: "npc", key: "Theo", trust: 1, concern: -1, memory: "You asked Theo to make one plan that was not built from dread." },
      { type: "flag", key: "c06TheoNotWorstCase", value: true }
    ], "c06_hub_return_transit"),
    hubChoice("Tell him plausible deniability is still a choice.", [
      { type: "relationship", key: "Theo", delta: 1 },
      { type: "npc", key: "Theo", respect: 1, memory: "You reminded Theo that ambiguous social pressure still contains choices." },
      { type: "stat", key: "restraint", delta: 1 },
      { type: "flag", key: "c06TheoDeniabilityChoice", value: true }
    ], "c06_hub_return_transit"),
    hubChoice("Ask if he wants an exit buddy or privacy.", [
      { type: "relationship", key: "Theo", delta: 1 },
      { type: "npc", key: "Theo", trust: 1, memory: "You gave Theo a choice between backup and space before Event Horizon." },
      { type: "flag", key: "c06TheoExitBuddy", value: true }
    ], "c06_hub_return_transit")
  ]);

  addChoiceScene("c06_chat_camille_anchor", 6, "Camille, Neutral Ground", "The Rusty Anchor", "city", "Camille", [
    "Camille has chosen a booth where the mirror behind the bar covers the door. She does not look proud of this. She looks correct.",
    "\"Neutral ground is a myth people maintain because open war is expensive,\" she says."
  ], [
    hubChoice("Ask what she trusts in a room built on mutually useful lies.", [
      { type: "relationship", key: "Camille", delta: 1 },
      { type: "npc", key: "Camille", trust: 1, memory: "You asked Camille what trust means on neutral ground." },
      { type: "stat", key: "contractorPath", delta: 1 },
      { type: "flag", key: "c06CamilleNeutralTrust", value: true }
    ], "c06_hub_return_anchor"),
    hubChoice("Tell her the myth still protects people if everyone believes it hard enough.", [
      { type: "relationship", key: "Camille", delta: 1 },
      { type: "npc", key: "Camille", respect: 1, memory: "You argued that shared myths can still protect real people." },
      { type: "stat", key: "foundationPath", delta: 1 },
      { type: "flag", key: "c06CamilleUsefulMyth", value: true }
    ], "c06_hub_return_anchor"),
    hubChoice("Ask whether she ever gets tired of seeing the weak point first.", [
      { type: "npc", key: "Camille", trust: 1, attraction: 1, memory: "You asked Camille about the cost of always seeing the weak point first." },
      { type: "flag", key: "c06CamilleWeakPointCost", value: true }
    ], "c06_hub_return_anchor")
  ]);

  addChoiceScene("c07_chat_piper_medical", 7, "Piper, The Quiet After", "Medical", "aegis", "Piper", [
    "Piper is not injured. That is apparently why Medical keeps trying to make her sit down.",
    "\"They keep saying observation like it is not detention with better lighting,\" she mutters. The joke tries to land and finds no floor."
  ], [
    hubChoice("Sit near her without making the silence perform.", [
      { type: "relationship", key: "Piper", delta: 1 },
      { type: "npc", key: "Piper", trust: 1, concern: -1, memory: "After the Vektor reveal, you sat with Piper without demanding a joke." },
      { type: "flag", key: "c07PiperQuietAfter", value: true }
    ], "c07_hub_return_medical"),
    hubChoice("Ask what she needs people to stop assuming.", [
      { type: "relationship", key: "Piper", delta: 1 },
      { type: "npc", key: "Piper", respect: 1, memory: "You asked Piper what assumption she wanted killed first." },
      { type: "stat", key: "resolve", delta: 1 },
      { type: "flag", key: "c07PiperBadAssumption", value: true }
    ], "c07_hub_return_medical"),
    hubChoice("Tell her speed does not make every exit her responsibility.", [
      { type: "relationship", key: "Piper", delta: 1 },
      { type: "npc", key: "Piper", trust: 1, memory: "You told Piper speed did not make every escape route her burden." },
      { type: "stat", key: "restraint", delta: 1 },
      { type: "flag", key: "c07PiperExitBurden", value: true }
    ], "c07_hub_return_medical")
  ]);

  addChoiceScene("c07_chat_julian_records", 7, "Julian, Redacted Applause", "Records Annex", "aegis", "Julian", [
    "Julian has found a records terminal and is not touching it, which somehow makes him look more guilty.",
    "\"Redactions are just dramatic lighting for bureaucracy,\" he says. \"Terrible font choice, though.\""
  ], [
    hubChoice("Ask what he does when the audience is the file.", [
      { type: "relationship", key: "Julian", delta: 1 },
      { type: "npc", key: "Julian", trust: 1, memory: "In the records annex, you asked Julian what performance means when the file is watching." },
      { type: "stat", key: "exposure", delta: 1 },
      { type: "flag", key: "c07JulianFileAudience", value: true }
    ], "c07_hub_return_records"),
    hubChoice("Help him read the gaps instead of the text.", [
      { type: "relationship", key: "Julian", delta: 1 },
      { type: "npc", key: "Julian", respect: 1, memory: "You helped Julian read redactions by shape instead of content." },
      { type: "stat", key: "control", delta: 1 },
      { type: "flag", key: "c07JulianReadGaps", value: true }
    ], "c07_hub_return_records"),
    hubChoice("Tell him the joke is good, but you need the fear under it.", [
      { type: "npc", key: "Julian", friction: 1, trust: 1, memory: "You asked Julian for the fear under the joke." },
      { type: "stat", key: "resolve", delta: 1 },
      { type: "flag", key: "c07JulianFearUnderJoke", value: true }
    ], "c07_hub_return_records")
  ]);

  addChoiceScene("c07_chat_ben_training", 7, "Ben, Impact Ethics", "Training Wing", "sim", "Ben", [
    "Ben is resetting impact pads by hand, slow and exact. Each one thumps into place like punctuation.",
    "\"People like me make plans look safer than they are,\" he says. \"Just because I can take a hit does not mean the plan was good.\""
  ], [
    hubChoice("Ask him how to tell backup from exploitation.", [
      { type: "relationship", key: "Ben", delta: 1 },
      { type: "npc", key: "Ben", trust: 1, respect: 1, memory: "You asked Ben how to distinguish backup from exploitation." },
      { type: "stat", key: "foundationPath", delta: 1 },
      { type: "flag", key: "c07BenBackupExploitation", value: true }
    ], "c07_hub_return_training"),
    hubChoice("Tell him taking the hit should never be the whole plan.", [
      { type: "relationship", key: "Ben", delta: 1 },
      { type: "npc", key: "Ben", respect: 1, memory: "You refused to let Ben's endurance become the whole strategy." },
      { type: "stat", key: "restraint", delta: 1 },
      { type: "flag", key: "c07BenNotWholePlan", value: true }
    ], "c07_hub_return_training"),
    hubChoice("Ask whether he wants permission to be angry about it.", [
      { type: "npc", key: "Ben", trust: 1, concern: -1, memory: "You made room for Ben's anger about being used as structural support." },
      { type: "flag", key: "c07BenPermissionAngry", value: true }
    ], "c07_hub_return_training")
  ]);

  addChoiceScene("c08_chat_camille_airbase", 8, "Camille, Abort Geometry", "Airbase Hangar", "aegis", "Camille", [
    "Camille has drawn three abort paths on a transparent display and rejected two of them with the same pen stroke.",
    "\"A good abort route is an apology made in advance,\" she says. \"It should be specific.\""
  ], [
    hubChoice("Ask her to walk you through the route she trusts least.", [
      { type: "relationship", key: "Camille", delta: 1 },
      { type: "npc", key: "Camille", trust: 1, respect: 1, memory: "At the airbase, Camille trusted you with the abort route she disliked most." },
      { type: "stat", key: "control", delta: 1 },
      { type: "flag", key: "c08CamilleAbortGeometry", value: true }
    ], "c08_hub_airbase"),
    hubChoice("Ask whether she is planning for Piper to fail or for Aegis to.", [
      { type: "npc", key: "Camille", friction: 1, respect: 1, memory: "You challenged Camille on whether the airbase plans distrusted Piper or Aegis." },
      { type: "stat", key: "resolve", delta: 1 },
      { type: "flag", key: "c08CamillePiperOrAegis", value: true }
    ], "c08_hub_airbase"),
    hubChoice("Tell her specific apologies still need someone brave enough to make them.", [
      { type: "relationship", key: "Camille", delta: 1 },
      { type: "npc", key: "Camille", attraction: 1, trust: 1, memory: "You told Camille her specific abort plans still needed brave execution." },
      { type: "flag", key: "c08CamilleSpecificApology", value: true }
    ], "c08_hub_airbase")
  ]);

  addChoiceScene("c08_chat_theo_medical", 8, "Theo, Probability Burn", "Medical", "aegis", "Theo", [
    "Theo is staring at a medical readout that is not his. The numbers update. His jaw tightens every time they do.",
    "\"Probability is not prediction,\" he says. \"Everyone knows that until a number gives them permission to stop thinking.\""
  ], [
    hubChoice("Ask which number he thinks people want to obey.", [
      { type: "relationship", key: "Theo", delta: 1 },
      { type: "npc", key: "Theo", trust: 1, respect: 1, memory: "At the airbase, you asked Theo which number people were ready to obey." },
      { type: "stat", key: "control", delta: 1 },
      { type: "flag", key: "c08TheoNumberObey", value: true }
    ], "c08_hub_return_medical"),
    hubChoice("Tell him he gets to be a person before he is a warning system.", [
      { type: "relationship", key: "Theo", delta: 1 },
      { type: "npc", key: "Theo", trust: 1, concern: -1, memory: "You told Theo he was allowed to be a person before he was a warning system." },
      { type: "flag", key: "c08TheoPersonBeforeWarning", value: true }
    ], "c08_hub_return_medical"),
    hubChoice("Ask him to call out your blind spot, not your odds.", [
      { type: "relationship", key: "Theo", delta: 1 },
      { type: "npc", key: "Theo", respect: 1, memory: "You asked Theo to name your blind spot instead of reciting odds." },
      { type: "stat", key: "restraint", delta: 1 },
      { type: "flag", key: "c08TheoBlindSpot", value: true }
    ], "c08_hub_return_medical")
  ]);

  addChoiceScene("c08_chat_ben_airbase", 8, "Ben, Runway Weight", "Airbase Hangar", "aegis", "Ben", [
    "Ben is helping a crew chief move crash mats. He lifts like he is trying not to make strength the point.",
    "\"Everyone keeps asking what happens if something hits me,\" he says. \"Nobody asks what happens if I cannot get there.\""
  ], [
    hubChoice("Ask what he needs from people who assume he can always get there.", [
      { type: "relationship", key: "Ben", delta: 1 },
      { type: "npc", key: "Ben", trust: 1, memory: "At the airbase, you asked Ben what he needed when he could not be everywhere." },
      { type: "stat", key: "foundationPath", delta: 1 },
      { type: "flag", key: "c08BenCannotBeEverywhere", value: true }
    ], "c08_hub_airbase"),
    hubChoice("Tell him the plan should protect him too.", [
      { type: "relationship", key: "Ben", delta: 1 },
      { type: "npc", key: "Ben", trust: 1, respect: 1, memory: "You insisted the airbase plan had to protect Ben too." },
      { type: "stat", key: "restraint", delta: 1 },
      { type: "flag", key: "c08BenProtectedToo", value: true }
    ], "c08_hub_airbase"),
    hubChoice("Ask him where the mat line should actually go.", [
      { type: "relationship", key: "Ben", delta: 1 },
      { type: "npc", key: "Ben", respect: 1, memory: "You trusted Ben's body-level read on the runway safety line." },
      { type: "stat", key: "control", delta: 1 },
      { type: "flag", key: "c08BenMatLine", value: true }
    ], "c08_hub_airbase")
  ]);

  addChoiceScene("c08_chat_jordan_transit", 8, "Jordan, Shuttle Truths", "Transit Platform", "city", "Jordan", [
    "Jordan is watching the airbase shuttle line with a paper coffee cup and the expression of someone counting exits by listening to tone.",
    "\"People get honest in transit,\" they say. \"Not verbally. Verbally they get worse. But the body leaks drafts.\""
  ], [
    hubChoice("Ask what the airbase team is leaking.", [
      { type: "relationship", key: "Jordan", delta: 1 },
      { type: "npc", key: "Jordan", trust: 1, memory: "At the airbase transit line, you asked Jordan what the team was leaking before anyone said it." },
      { type: "stat", key: "exposure", delta: 1 },
      { type: "flag", key: "c08JordanShuttleLeaks", value: true }
    ], "c08_hub_return_transit"),
    hubChoice("Ask them to tell you one thing that is true but not helpful.", [
      { type: "relationship", key: "Jordan", delta: 1 },
      { type: "npc", key: "Jordan", respect: 1, memory: "You asked Jordan for truth without forcing it to become useful." },
      { type: "stat", key: "restraint", delta: 1 },
      { type: "flag", key: "c08JordanUnhelpfulTruth", value: true }
    ], "c08_hub_return_transit"),
    hubChoice("Tell them you are tired of being everyone's emotional weather report.", [
      { type: "npc", key: "Jordan", trust: 1, concern: 1, memory: "You admitted to Jordan that being read all the time was wearing on you." },
      { type: "flag", key: "c08JordanWeatherReport", value: true }
    ], "c08_hub_return_transit")
  ]);

  addChoiceScene("c09_chat_piper_rooftop", 9, "Piper, No Running Start", "Rooftop", "aegis", "Piper", [
    "Piper is at the rooftop rail, hair snapping in the wind, feet planted. No rocking. No sprint posture. That is how you know she is working.",
    "\"Graduation is weird,\" she says. \"Feels like a starting gun pointed at a cliff.\""
  ], [
    hubChoice("Ask what she wants the first step after Aegis to be.", [
      { type: "relationship", key: "Piper", delta: 1 },
      { type: "npc", key: "Piper", trust: 1, attraction: 1, memory: "On graduation eve, you asked Piper what her first step after Aegis should be." },
      { type: "flag", key: "c09PiperFirstStep", value: true }
    ], "c09_hub_return_rooftop"),
    hubChoice("Tell her cliffs are easier with someone calling distance.", [
      { type: "relationship", key: "Piper", delta: 1 },
      { type: "npc", key: "Piper", trust: 1, memory: "You offered Piper distance calls for the cliff after Aegis." },
      { type: "stat", key: "foundationPath", delta: 1 },
      { type: "flag", key: "c09PiperDistanceCall", value: true }
    ], "c09_hub_return_rooftop"),
    hubChoice("Ask whether she is scared of leaving or of being followed.", [
      { type: "npc", key: "Piper", friction: 1, trust: 1, memory: "You asked Piper whether leaving or being followed scared her more." },
      { type: "stat", key: "resolve", delta: 1 },
      { type: "flag", key: "c09PiperLeavingFollowed", value: true }
    ], "c09_hub_return_rooftop")
  ]);

  addChoiceScene("c09_chat_ben_cafeteria", 9, "Ben, Last Tray", "Cafeteria", "aegis", "Ben", [
    "Ben has two desserts on his tray and the defensive posture of a man prepared to argue they are medically necessary.",
    "\"Last cafeteria dinner,\" he says. \"Feels historic. Tastes like institutional pudding.\""
  ], [
    hubChoice("Ask what he wants to carry out of here that is not duty.", [
      { type: "relationship", key: "Ben", delta: 1 },
      { type: "npc", key: "Ben", trust: 1, memory: "On the last night, you asked Ben what he wanted beyond duty." },
      { type: "flag", key: "c09BenBeyondDuty", value: true }
    ], "c09_hub_return_cafeteria"),
    hubChoice("Tell him the pudding deserves no one's loyalty.", [
      { type: "relationship", key: "Ben", delta: 1 },
      { type: "npc", key: "Ben", trust: 1, memory: "You made Ben laugh at the cafeteria instead of turning the last night heavy." },
      { type: "stat", key: "audacity", delta: 1 },
      { type: "flag", key: "c09BenPuddingTreason", value: true }
    ], "c09_hub_return_cafeteria"),
    hubChoice("Ask who checks on the protector after everyone leaves.", [
      { type: "relationship", key: "Ben", delta: 1 },
      { type: "npc", key: "Ben", concern: -1, trust: 1, memory: "You asked who checks on the protector after Aegis." },
      { type: "stat", key: "restraint", delta: 1 },
      { type: "flag", key: "c09BenProtectorCheck", value: true }
    ], "c09_hub_return_cafeteria")
  ]);

  addChoiceScene("c09_chat_jordan_lounge", 9, "Jordan, The Last Version", "Common Lounge", "aegis", "Jordan", [
    "Jordan is sitting on the back of a lounge chair, watching people exchange contact info with the solemnity of treaties.",
    "\"Everyone is deciding which version of themselves gets remembered,\" they say. \"It is adorable. Horrifying, but adorable.\""
  ], [
    hubChoice("Ask which version of you they think is most honest.", [
      { type: "relationship", key: "Jordan", delta: 1 },
      { type: "npc", key: "Jordan", trust: 1, respect: 1, memory: "On the last night, you asked Jordan which version of you was honest." },
      { type: "flag", key: "c09JordanHonestVersion", value: true }
    ], "c09_hub_return_lounge"),
    hubChoice("Ask what story they are tired of performing.", [
      { type: "relationship", key: "Jordan", delta: 1 },
      { type: "npc", key: "Jordan", trust: 1, memory: "You asked Jordan what social role they were tired of performing." },
      { type: "stat", key: "restraint", delta: 1 },
      { type: "flag", key: "c09JordanTiredStory", value: true }
    ], "c09_hub_return_lounge"),
    hubChoice("Tell them memory is allowed to be messy.", [
      { type: "npc", key: "Jordan", respect: 1, memory: "You told Jordan that messy memory was not failure." },
      { type: "stat", key: "foundationPath", delta: 1 },
      { type: "flag", key: "c09JordanMessyMemory", value: true }
    ], "c09_hub_return_lounge")
  ]);

  addChoiceScene("c09_chat_rina_training", 9, "Rina, Finish Line Theory", "Training Wing", "sim", "Rina", [
    "Rina is alone in the training wing, not running. She is standing at a finish marker like she has found it guilty.",
    "\"I used to think the point was crossing first,\" she says. \"Turns out there are better ways to lose and worse ways to win. Extremely irritating development.\""
  ], [
    hubChoice("Ask what kind of win she respects now.", [
      { type: "relationship", key: "Rina", delta: 1 },
      { type: "npc", key: "Rina", trust: 1, respect: 1, memory: "On the last night, you asked Rina what kind of victory she respected." },
      { type: "flag", key: "c09RinaRespectsWin", value: true }
    ], "c09_hub_graduation_eve"),
    hubChoice("Tell her a rival who learns is harder to beat.", [
      { type: "relationship", key: "Rina", delta: 1 },
      { type: "npc", key: "Rina", attraction: 1, respect: 1, memory: "You told Rina that learning made her harder to beat." },
      { type: "stat", key: "audacity", delta: 1 },
      { type: "flag", key: "c09RinaLearnsHarder", value: true }
    ], "c09_hub_graduation_eve"),
    hubChoice("Ask whether she wants the finish line or the next race.", [
      { type: "npc", key: "Rina", respect: 1, memory: "You asked Rina whether she wanted closure or momentum." },
      { type: "stat", key: "resolve", delta: 1 },
      { type: "flag", key: "c09RinaFinishOrRace", value: true }
    ], "c09_hub_graduation_eve")
  ]);

  addChoiceScene("c10_chat_camille_courtyard", 10, "Camille, Unsupervised Honesty", "Courtyard", "aegis", "Camille", [
    "Camille stands in the courtyard with the ceremony behind her and the ocean in front of her, as if choosing the harder witness.",
    "\"They are going to ask everyone what you became,\" she says. \"That is different from asking who you are.\""
  ], [
    hubChoice("Ask what answer she would trust from you.", [
      { type: "relationship", key: "Camille", delta: 1 },
      { type: "npc", key: "Camille", trust: 1, attraction: 1, memory: "Before graduation, you asked Camille what answer she would trust." },
      { type: "flag", key: "c10CamilleTrustedAnswer", value: true }
    ], "c10_hub_return_courtyard"),
    hubChoice("Tell her becoming is still an active verb.", [
      { type: "relationship", key: "Camille", delta: 1 },
      { type: "npc", key: "Camille", respect: 1, memory: "You told Camille that becoming remained active after Aegis." },
      { type: "stat", key: "foundationPath", delta: 1 },
      { type: "flag", key: "c10CamilleActiveVerb", value: true }
    ], "c10_hub_return_courtyard"),
    hubChoice("Ask whether she wants control or truth more today.", [
      { type: "npc", key: "Camille", friction: 1, trust: 1, memory: "You asked Camille whether control or truth mattered more today." },
      { type: "stat", key: "resolve", delta: 1 },
      { type: "flag", key: "c10CamilleControlTruth", value: true }
    ], "c10_hub_return_courtyard")
  ]);

  addChoiceScene("c10_chat_julian_admin", 10, "Julian, Final Draft", "Admin Wing", "aegis", "Julian", [
    "Julian is reading the ceremony program like it personally betrayed him.",
    "\"They made me sound inspirational,\" he says. \"I have never been so close to litigation.\""
  ], [
    hubChoice("Ask what line he would write for himself.", [
      { type: "relationship", key: "Julian", delta: 1 },
      { type: "npc", key: "Julian", trust: 1, memory: "Before graduation, you asked Julian to write his own line." },
      { type: "flag", key: "c10JulianOwnLine", value: true }
    ], "c10_hub_return_admin"),
    hubChoice("Tell him being seen badly is not the same as being unseen.", [
      { type: "relationship", key: "Julian", delta: 1 },
      { type: "npc", key: "Julian", respect: 1, memory: "You told Julian that bad visibility was not the same as invisibility." },
      { type: "stat", key: "independentPath", delta: 1 },
      { type: "flag", key: "c10JulianSeenBadly", value: true }
    ], "c10_hub_return_admin"),
    hubChoice("Help him vandalize the phrasing without changing the printout.", [
      { type: "relationship", key: "Julian", delta: 1 },
      { type: "npc", key: "Julian", attraction: 1, trust: 1, memory: "You helped Julian reclaim the ceremony program without actually breaking anything." },
      { type: "stat", key: "audacity", delta: 1 },
      { type: "flag", key: "c10JulianProgramVandal", value: true }
    ], "c10_hub_return_admin")
  ]);

  addChoiceScene("c10_chat_theo_courtyard", 10, "Theo, The Last Probability", "Courtyard", "aegis", "Theo", [
    "Theo has no tablet out. That is how you know this is serious.",
    "\"I know the odds of several things,\" he says. \"I am practicing not pretending that means I know what I want.\""
  ], [
    hubChoice("Ask what he wants without letting him answer in percentages.", [
      { type: "relationship", key: "Theo", delta: 1 },
      { type: "npc", key: "Theo", trust: 1, attraction: 1, memory: "Before graduation, you asked Theo what he wanted without percentages." },
      { type: "flag", key: "c10TheoNoPercentages", value: true }
    ], "c10_hub_return_courtyard"),
    hubChoice("Tell him uncertainty is not a moral failure.", [
      { type: "relationship", key: "Theo", delta: 1 },
      { type: "npc", key: "Theo", concern: -1, trust: 1, memory: "You told Theo uncertainty was not a moral failure." },
      { type: "stat", key: "restraint", delta: 1 },
      { type: "flag", key: "c10TheoUncertaintyAllowed", value: true }
    ], "c10_hub_return_courtyard"),
    hubChoice("Ask which future scares him because he actually wants it.", [
      { type: "npc", key: "Theo", trust: 1, friction: 1, memory: "You asked Theo which wanted future scared him." },
      { type: "stat", key: "resolve", delta: 1 },
      { type: "flag", key: "c10TheoWantedFuture", value: true }
    ], "c10_hub_return_courtyard")
  ]);

  addChoiceScene("c10_chat_piper_hall", 10, "Piper, Last Door", "Graduation Hall", "graduation", "Piper", [
    "Piper is beside a side door marked Staff Only, which means she has either found a shortcut or is emotionally outsourcing the decision to signage.",
    "\"This door definitely goes somewhere,\" she says. \"All doors are legally required to.\""
  ], [
    hubChoice("Ask if she wants the door open or just wants to know it could be.", [
      { type: "relationship", key: "Piper", delta: 1 },
      { type: "npc", key: "Piper", trust: 1, attraction: 1, memory: "Before graduation, you asked Piper whether she wanted the exit or the option." },
      { type: "flag", key: "c10PiperDoorOption", value: true }
    ], "c10_hub_return_hall"),
    hubChoice("Tell her you are staying through the speech, then deciding.", [
      { type: "relationship", key: "Piper", delta: 1 },
      { type: "npc", key: "Piper", respect: 1, memory: "You told Piper you would stay through the speech and still keep the choice yours." },
      { type: "stat", key: "resolve", delta: 1 },
      { type: "flag", key: "c10PiperStayThenDecide", value: true }
    ], "c10_hub_return_hall"),
    hubChoice("Offer to race her nowhere for ten seconds after this is over.", [
      { type: "relationship", key: "Piper", delta: 1 },
      { type: "npc", key: "Piper", attraction: 1, trust: 1, memory: "You promised Piper a race with no destination after graduation." },
      { type: "stat", key: "independentPath", delta: 1 },
      { type: "flag", key: "c10PiperRaceNowhere", value: true }
    ], "c10_hub_return_hall")
  ]);

  addActions("common_lounge", [
    onceChapterAction("c03-piper-lounge-followup", 3, "Talk with Piper about holding still", "She is joking in place, which means the joke is doing heavy lifting.", "c03_chat_piper_lounge_followup"),
    onceChapterAction("c04-julian-lounge-attention", 4, "Talk with Julian under the bad light", "He has turned a maintenance problem into theater. That is probably not the whole story.", "c04_chat_julian_lounge_attention"),
    onceChapterAction("c09-jordan-lounge-version", 9, "Talk with Jordan about last versions", "They are watching everyone decide how they want to be remembered.", "c09_chat_jordan_lounge")
  ]);

  addActions("medical", [
    onceChapterAction("c03-ben-medical-followup", 3, "Check on Ben outside Medical", "He looks fine in the way people use to avoid being checked on.", "c03_chat_ben_medical_followup"),
    onceChapterAction("c07-piper-medical-quiet", 7, "Sit with Piper in Medical", "She is not hurt, which has not stopped Medical from becoming a cage with soft lighting.", "c07_chat_piper_medical"),
    onceChapterAction("c08-theo-medical-probability", 8, "Talk with Theo near the monitors", "He is reading numbers like they might absolve somebody if he looks away.", "c08_chat_theo_medical"),
    {
      id: "aegis-medical-treatment",
      label: "Get patched up at Aegis Medical",
      detail: "Let Medical clear damage instead of pretending the status panel is therapy.",
      repeatLimit: 6,
      conditions: [{ type: "chapterAtLeast", value: 2 }],
      timeMinutes: 45,
      fatigue: -7,
      rest: true,
      recovery: true,
      text: [
        "Medical turns pain into a process: scan, question, treatment, warning, paperwork.",
        "The medic clears you for movement with the grave tone of someone who knows you will interpret that too generously."
      ],
      variants: [
        {
          conditions: [{ type: "matureContent" }],
          text: [
            "The scan catches the honest version of the damage: swollen joints, angry muscle fiber, one old stress line lighting up in yellow. A healer talks while the treatment burns cold under your skin, knitting the bad places back toward useful."
          ]
        }
      ],
      effects: [
        { type: "status", key: "energy", value: "Medically cleared" },
        { type: "status", key: "lastFight", value: "Treated at Aegis Medical" }
      ]
    }
  ]);

  addActions("training_wing", [
    onceChapterAction("c03-rina-scoreboard", 3, "Talk with Rina under the scoreboard", "She is studying the numbers like she plans to fight them personally.", "c03_chat_rina_scoreboard"),
    onceChapterAction("c07-ben-impact-ethics", 7, "Talk with Ben while he resets pads", "He is putting the room back together by hand.", "c07_chat_ben_training"),
    onceChapterAction("c09-rina-finish-line", 9, "Talk with Rina at the finish marker", "She is staring at the line like victory has become more complicated.", "c09_chat_rina_training"),
    trainingAction("c03-train-power-playback", 3, "Train power: playback correction", "Use yesterday's telemetry to practice a cleaner stop.", [
      "The drill replays the moment your output got ahead of you, then strips away the drama until only timing remains.",
      "You run it again. Smaller. Cleaner. Less interested in proving anything."
    ], [
      { type: "stat", key: "control", delta: 1 },
      { type: "powerXp", amount: 1 },
      { type: "flag", key: "c03TrainedPlaybackCorrection", value: true }
    ], 1.4, 45, 2),
    trainingAction("c04-train-power-pressure-stop", 4, "Train power: pressure stop", "Build the habit of shutting power down while the room is still asking for more.", [
      "The pressure stop drill is rude on purpose. It rewards the exact second where ego loses to command.",
      "By the last repetition, the stop does not feel gentle. It feels yours."
    ], [
      { type: "stat", key: "restraint", delta: 1 },
      { type: "powerXp", amount: 2 },
      { type: "flag", key: "c04TrainedPressureStop", value: true }
    ], 2, 60, 2),
    trainingAction("c06-train-power-crowd-suppression", 6, "Train power: crowd-safe output", "Practice low-output control with noise, movement, and distraction layered in.", [
      "The training wing simulates crowd noise badly, which somehow makes it more irritating.",
      "Your power wants clean conditions. You make it behave in messy ones."
    ], [
      { type: "stat", key: "control", delta: 1 },
      { type: "powerXp", amount: 1 },
      { type: "flag", key: "c06TrainedCrowdSafeOutput", value: true }
    ], 1.6, 45, 2),
    trainingAction("c07-train-power-abort-drills", 7, "Train power: abort drills", "Practice ending an output path before anyone else has to make the call.", [
      "The abort drill keeps interrupting you at the worst possible second. That is the point.",
      "You learn to treat interruption as part of control, not proof that control failed."
    ], [
      { type: "stat", key: "restraint", delta: 1 },
      { type: "powerXp", amount: 2 },
      { type: "flag", key: "c07TrainedAbortDrills", value: true }
    ], 2.2, 60, 2),
    trainingAction("c09-train-power-final-tune", 9, "Train power: final threshold tune", "Use the quiet before graduation to make the next level feel intentional.", [
      "The final tune is not flashy. It is repetition, breath, output, stop, output, stop, until the stop stops feeling like surrender.",
      "The unlock does not arrive like thunder. It arrives like a door you can open without kicking."
    ], [
      { type: "stat", key: "control", delta: 1 },
      { type: "stat", key: "resolve", delta: 1 },
      { type: "powerXp", amount: 2 },
      { type: "flag", key: "c09TrainedFinalTune", value: true }
    ], 2, 60, 2)
  ]);

  addActions("admin_wing", [
    onceChapterAction("c03-jordan-admin-paper", 3, "Talk with Jordan near the directory", "They are reading staff movement like a weather system.", "c03_chat_jordan_admin_wing"),
    onceChapterAction("c10-julian-admin-program", 10, "Talk with Julian over the program", "The official ceremony copy has offended him on a spiritual level.", "c10_chat_julian_admin"),
    {
      id: "c07-find-records-annex",
      label: "Trace the redacted routing stamp",
      detail: "Follow a boring paperwork clue to a less boring door.",
      once: true,
      hidden: true,
      conditions: [{ type: "chapterAtLeast", value: 7 }, { type: "notFlag", key: "foundRecordsAnnex" }],
      timeMinutes: 25,
      fatigue: 0.3,
      text: [
        "The routing stamp is dull, inconsistent, and therefore alive. It leads you past two ordinary office doors to a third that does not appear on the public map.",
        "The tablet updates without fanfare: Records Annex access recognized."
      ],
      effects: [
        { type: "flag", key: "foundRecordsAnnex", value: true },
        { type: "stat", key: "exposure", delta: 1 }
      ]
    }
  ]);

  addActions("simulation_block", [
    onceChapterAction("c04-theo-sim-margin", 4, "Talk with Theo over bad branches", "He has hidden the probability line he least wants to discuss.", "c04_chat_theo_sim_margin"),
    trainingAction("c05-train-power-field-sim", 5, "Train power: field-site sim", "Run a dock-shaped simulation before the real dock gets opinions.", [
      "The sim throws glare, wind shear, civilian movement, and bad footing into the room.",
      "It is not the dock. It is enough to make the dock less imaginary."
    ], [
      { type: "stat", key: "control", delta: 1 },
      { type: "powerXp", amount: 1 },
      { type: "flag", key: "c05TrainedFieldSiteSim", value: true }
    ], 1.7, 45, 2),
    trainingAction("c08-train-power-mach-catch", 8, "Train power: Mach catch rehearsal", "Practice absorbing or redirecting catastrophic motion without turning panic into output.", [
      "The sim cannot reproduce Piper at full speed, so it reproduces the part that matters: the sudden demand for a decision.",
      "You rehearse not being dazzled by speed. You rehearse staying useful."
    ], [
      { type: "stat", key: "restraint", delta: 1 },
      { type: "powerXp", amount: 2 },
      { type: "flag", key: "c08TrainedMachCatch", value: true }
    ], 2.4, 60, 2)
  ]);

  addActions("courtyard", [
    onceChapterAction("c04-piper-courtyard-pressure", 4, "Walk slow laps with Piper", "She is practicing stillness like it personally insulted her.", "c04_chat_piper_courtyard_pressure"),
    onceChapterAction("c10-camille-courtyard-honesty", 10, "Talk with Camille before the speech", "She is watching the ocean like it might give a cleaner answer than Aegis.", "c10_chat_camille_courtyard"),
    onceChapterAction("c10-theo-courtyard-probability", 10, "Talk with Theo without the tablet", "He is practicing wanting something without proving it first.", "c10_chat_theo_courtyard")
  ]);

  addActions("blackwater_promenade", [
    onceChapterAction("c05-camille-prom-civilians", 5, "Walk the civilian angles with Camille", "She is mapping the crowd before the dock can turn theoretical.", "c05_chat_camille_promenade"),
    onceChapterAction("c06-piper-prom-shoes", 6, "Talk with Piper about escape routes", "She is dressed for the night and still wearing shoes she can run in.", "c06_chat_piper_promenade")
  ]);

  addActions("rusty_anchor", [
    onceChapterAction("c05-jordan-anchor-local", 5, "Talk with Jordan in the corner booth", "They are reading Blackwater's unofficial file on Aegis.", "c05_chat_jordan_anchor"),
    onceChapterAction("c06-camille-anchor-neutral", 6, "Talk with Camille about neutral ground", "She found the booth with the best sightlines and the least trust.", "c06_chat_camille_anchor")
  ]);

  addActions("transit_platform", [
    onceChapterAction("c05-vance-transit-rules", 5, "Talk with Vance on the platform", "He is watching off-campus permission become a field risk.", "c05_chat_vance_transit"),
    onceChapterAction("c06-theo-transit-shirt", 6, "Talk with Theo before Event Horizon", "He has dressed like probability was invited and anxiety RSVP'd.", "c06_chat_theo_transit"),
    onceChapterAction("c08-jordan-transit-shuttle", 8, "Talk with Jordan near the shuttle line", "They are reading the airbase team by posture and bad coffee.", "c08_chat_jordan_transit")
  ]);

  addActions("records_annex", [
    onceChapterAction("c07-julian-records-redacted", 7, "Talk with Julian among redactions", "He is joking because the files are not.", "c07_chat_julian_records")
  ]);

  addActions("airbase_hangar", [
    onceChapterAction("c08-camille-airbase-abort", 8, "Talk with Camille over abort routes", "Her contingency map is too specific to be comforting.", "c08_chat_camille_airbase"),
    onceChapterAction("c08-ben-airbase-mats", 8, "Talk with Ben near the crash mats", "He is moving safety equipment like he knows plans can get lazy around him.", "c08_chat_ben_airbase"),
    trainingAction("c08-train-power-runway-load", 8, "Train power: runway load check", "Use the airbase scale to practice holding more without letting it steer you.", [
      "The runway makes your power feel huge and weirdly small at the same time.",
      "You do not chase the ceiling. You find the point where more power still answers to you."
    ], [
      { type: "stat", key: "control", delta: 1 },
      { type: "powerXp", amount: 2 },
      { type: "flag", key: "c08TrainedRunwayLoad", value: true }
    ], 2.2, 60, 2)
  ]);

  addActions("rooftop", [
    onceChapterAction("c09-piper-rooftop-starting-gun", 9, "Talk with Piper at the rail", "She is planted at the edge like running would be too easy.", "c09_chat_piper_rooftop"),
    {
      id: "c09-rooftop-power-breath",
      label: "Train power: rooftop breathwork",
      detail: "Use height, wind, and quiet to make your power answer without an audience.",
      repeatLimit: 2,
      conditions: chapterWindow(9),
      timeMinutes: 35,
      fatigue: 1,
      text: [
        "The wind tries to make the exercise cinematic. You refuse to help it.",
        "Inhale, output, stop. Inhale, want more, stop anyway. The city stays below you. Your power stays yours."
      ],
      effects: [
        { type: "stat", key: "restraint", delta: 1 },
        { type: "powerXp", amount: 1 },
        { type: "status", key: "stress", value: "Focused" },
        { type: "flag", key: "c09RooftopBreathwork", value: true }
      ]
    }
  ]);

  addActions("cafeteria", [
    onceChapterAction("c09-ben-cafeteria-last-tray", 9, "Talk with Ben over last dinner", "He has institutional pudding and thoughts about endings.", "c09_chat_ben_cafeteria")
  ]);

  addActions("graduation_hall", [
    onceChapterAction("c10-piper-hall-last-door", 10, "Talk with Piper by the side door", "She has found an exit and is pretending that is not emotionally revealing.", "c10_chat_piper_hall"),
    {
      id: "c10-ceremony-control-check",
      label: "Train power: ceremony control check",
      detail: "Run one final low-output check before the room turns public.",
      once: true,
      conditions: chapterWindow(10),
      timeMinutes: 20,
      fatigue: 0.4,
      text: [
        "No one cheers for a clean control check. That is why it matters.",
        "Your power answers quietly enough that the silence feels earned."
      ],
      effects: [
        { type: "stat", key: "control", delta: 1 },
        { type: "powerXp", amount: 1 },
        { type: "status", key: "energy", value: "Quietly ready" },
        { type: "flag", key: "c10CeremonyControlCheck", value: true }
      ]
    }
  ]);

  [
    [2, "c02_hub_baseline"],
    [3, "c03_hub_gallery"],
    [4, "c04_hub_training"],
    [5, "c05_hub_dock"],
    [6, "c06_hub_event"],
    [7, "c07_hub_bait"],
    [8, "c08_hub_airbase"],
    [9, "c09_hub_graduation_eve"],
    [10, "c10_hub_graduation"]
  ].forEach(([chapterId, sceneId]) => setChapterStart(chapterId, sceneId));

  redirect("c02_residence_after", "c03_deep_invitation", "c03_hub_gallery");
  redirect("c03_private_notes", "c04_deep_solo", "c04_hub_training");
  redirect("c04_debrief", "c05_deep_after", "c05_hub_dock");
  redirect("c05_rooftop_after", "c06_deep_permission", "c06_hub_event");
  redirect("c06_apartment_board", "c07_deep_morning", "c07_hub_bait");
  redirect("c07_jordan_signal", "c08_deep_review", "c08_hub_airbase");
  redirect("c08_private_threshold", "c09_deep_return", "c09_hub_graduation_eve");
  redirect("c09_sleep_or_not", "c10_deep_morning", "c10_hub_graduation");
})();

/* AUTHORING_PACKS_HUBS_START */
(function () {
  "use strict";

  const STORY = window.AEGIS_STORY;
  const HUBS = window.AEGIS_HUBS;
  if (!STORY || !HUBS) return;

  const scenes = STORY.scenes;
  const intentionalOrphans = new Set(STORY.intentionalOrphans || []);

  function chapterWindow(chapter) {
    return [{ type: "chapterAtLeast", value: chapter }, { type: "chapterBefore", value: chapter + 1 }];
  }

  function humanizeId(id) {
    return String(id || "")
      .replace(/^add_c\d+_/, "")
      .replace(/_v2$/, "")
      .replace(/_/g, " ")
      .replace(/\b\w/g, (m) => m.toUpperCase());
  }

  function addAction(locationId, config) {
    const location = HUBS.locations[locationId];
    if (!location) return;
    location.actions = location.actions || [];
    const existing = location.actions.find((item) => item.id === config.id);
    if (existing) Object.assign(existing, config);
    else location.actions.push(config);
  }

  function actionForScene(sceneId, locationId, chapter, label, detail, extra = {}) {
    const scene = scenes[sceneId];
    addAction(locationId, {
      id: extra.id || sceneId,
      label: label || (scene && scene.title) || humanizeId(sceneId),
      detail: detail || (scene && scene.location) || HUBS.locations[locationId]?.name || "Aegis Point",
      once: extra.once !== false,
      hidden: Boolean(extra.hidden),
      conditions: [...chapterWindow(chapter), ...(extra.conditions || [])],
      timeMinutes: extra.timeMinutes || 15,
      fatigue: typeof extra.fatigue === "number" ? extra.fatigue : 0.4,
      nextScene: sceneId,
      repeatLimit: extra.repeatLimit,
      assignmentId: extra.assignmentId,
      completeAssignment: extra.completeAssignment,
      effects: extra.effects
    });
  }

  function retargetAction(locationId, actionId, nextScene, extra = {}) {
    const location = HUBS.locations[locationId];
    if (!location || !location.actions) return;
    const action = location.actions.find((item) => item.id === actionId);
    if (!action) return;
    action.nextScene = nextScene;
    Object.assign(action, extra);
  }

  function redirect(sceneId, from, to) {
    const scene = scenes[sceneId];
    if (!scene || !scene.choices) return;
    scene.choices.forEach((choice) => {
      if (typeof choice.next === "string") {
        if (choice.next === from) choice.next = to;
        return;
      }
      if (!choice.next || typeof choice.next !== "object") return;
      if (choice.next.default === from) choice.next.default = to;
      (choice.next.cases || []).forEach((item) => {
        if (item.scene === from) item.scene = to;
      });
    });
  }

  function retargetAllChoices(sceneId, to) {
    const scene = scenes[sceneId];
    if (!scene || !scene.choices) return;
    scene.choices.forEach((choice) => {
      choice.next = to;
    });
  }

  [
    { locationId: "simulation_block", actionId: "enter-baseline", nextScene: "add_c02_queue_glass" },
    { locationId: "event_horizon", actionId: "enter-event-horizon", nextScene: "add_c06_threshold_glass" },
    { locationId: "briefing_room", actionId: "enter-bait-briefing", nextScene: "c07_deep_fallout" },
    { locationId: "airbase_hangar", actionId: "begin-mach-test", nextScene: "add_c08_vance_brief" },
    { locationId: "graduation_hall", actionId: "enter-graduation", nextScene: "c10_deep_morning" }
  ].forEach((item) => retargetAction(item.locationId, item.actionId, item.nextScene));

  retargetAction("lecture_hall", "attend-orientation", "add_c01_intake_overlap_to_orientation");
  addAction("intake_hall", {
    id: "aegis-pack-piper-shortcut",
    label: "Take Piper's shortcut first",
    detail: "Let Piper turn orientation into an unofficial route before the room settles.",
    once: true,
    hidden: false,
    conditions: chapterWindow(1),
    timeMinutes: 15,
    fatigue: 0.3,
    nextScene: "add_c01_intake_overlap_to_shortcuts"
  });
  addAction("intake_hall", {
    id: "aegis-pack-camille-intro",
    label: "Cross to Camille before the briefing",
    detail: "Step into the colder orbit first and see what it changes.",
    once: true,
    hidden: false,
    conditions: chapterWindow(1),
    timeMinutes: 15,
    fatigue: 0.3,
    nextScene: "add_c01_intake_overlap_to_camille"
  });

  [
    { sceneId: "add_c01_julian_cafeteria", locationId: "cafeteria", chapter: 1, label: "Talk with Julian before the tea dies", detail: "Let Julian turn a bad cafeteria table into something worth remembering." },
    { sceneId: "add_c01_theo_walk", locationId: "residence_wing", chapter: 1, label: "Walk with Theo instead of going straight to housing", detail: "Take the quieter route and see what Theo notices when the hallway empties." },
    { sceneId: "add_c01_med_spike", locationId: "medical", chapter: 1, label: "Check med after the power spike", detail: "Let Aegis medical decide whether first-day instability counts as paperwork or warning." },
    { sceneId: "add_c01_ben_laundry", locationId: "residence_wing", chapter: 1, label: "Help Ben in the laundry room", detail: "Do one practical thing with someone who understands useful quiet." },
    { sceneId: "add_c01_jordan_boundary", locationId: "cafeteria", chapter: 1, label: "Sit with Jordan before the room writes everyone down", detail: "Trade a little candor for a cleaner read on the cohort." },
    { sceneId: "add_c01_rooftop_breath", locationId: "rooftop", chapter: 1, label: "Go up for air", detail: "Find the first honest quiet the building allows." },
    { sceneId: "add_c02_camille_stairs", locationId: "observation_hall", chapter: 2, label: "Catch Camille on the stairwell", detail: "Let the baseline follow you into a more private kind of scrutiny." },
    { sceneId: "add_c02_piper_track", locationId: "courtyard", chapter: 2, label: "Find Piper on the training track", detail: "See what speed sounds like when the crowd is gone." },
    { sceneId: "add_c02_julian_lounge", locationId: "common_lounge", chapter: 2, label: "Find Julian in the lounge", detail: "Ask what he thinks the room is really learning from the tests." },
    { sceneId: "add_c02_theo_annex", locationId: "observation_hall", chapter: 2, label: "Pull Theo aside after the numbers land", detail: "Get the ugly version of the data before the hallway edits it." },
    { sceneId: "add_c02_med_assessment", locationId: "medical", chapter: 2, label: "Let medical run a second look", detail: "Find out what the baseline did to you once adrenaline stops lying." },
    { sceneId: "add_c02_rina_warmup", locationId: "simulation_block", chapter: 2, label: "Talk to Rina in the warm-up lane", detail: "See whether rivalry and useful advice can occupy the same sentence." },
    { sceneId: "add_c02_vance_review", locationId: "observation_hall", chapter: 2, label: "Catch Vance before the review settles", detail: "Ask the commandant what the gallery actually remembers." },
    { sceneId: "add_c03_gallery_edges", locationId: "observation_hall", chapter: 3, label: "Read the room outside Sim Block C", detail: "Catch the cohort in the hallway where observation becomes social weather." },
    { sceneId: "add_c03_julian_hall_mirror", locationId: "observation_hall", chapter: 3, label: "Let Julian steal the hallway for a minute", detail: "Hear what he thinks the room wants from your contradictions." },
    { sceneId: "add_c03_theo_annex_math", locationId: "records_annex", chapter: 3, label: "Find Theo in the records annex", detail: "Walk in on Theo trying to turn concern into arithmetic." },
    { sceneId: "add_c03_camille_report_language", locationId: "admin_wing", chapter: 3, label: "Read the language with Camille", detail: "See what happens when Camille has to translate you into file-safe words." },
    { sceneId: "add_c03_piper_stillness_tax", locationId: "common_lounge", chapter: 3, label: "Ask Piper what stillness costs", detail: "Let her talk about speed like a burden instead of a trick." },
    { sceneId: "add_c03_medical_residuum", locationId: "medical", chapter: 3, label: "Check the residual burn in medical", detail: "Find out what the building thinks lingers after a watched performance." },
    { sceneId: "add_c03_ben_reset_room", locationId: "training_wing", chapter: 3, label: "Take the reset room with Ben", detail: "Find out what endurance sounds like when nobody is pretending to admire it." },
    { sceneId: "add_c03_vance_glass_office", locationId: "admin_wing", chapter: 3, label: "Step into Vance's glass office", detail: "Ask what he thinks review rooms actually train into people." },
    { sceneId: "add_c04_warmup_lane_rina", locationId: "simulation_block", chapter: 4, label: "Talk to Rina in the warm-up lane", detail: "Get the competitor's version of what today's pressure is really testing." },
    { sceneId: "add_c04_camille_service_corridor", locationId: "simulation_block", chapter: 4, label: "Meet Camille in the service corridor", detail: "Let the rules go private before the chamber doors close." },
    { sceneId: "add_c04_julian_gallery_rail", locationId: "simulation_block", chapter: 4, label: "Find Julian at the gallery rail", detail: "Let him name what the room wants from you before the test begins." },
    { sceneId: "add_c04_theo_reset_room", locationId: "training_wing", chapter: 4, label: "Take the reset room with Theo", detail: "Catch Theo doing math about you instead of hiding that he cares." },
    { sceneId: "add_c04_medical_aftertaste", locationId: "medical", chapter: 4, label: "Sit through the medical aftertaste", detail: "Let the scan bay tell you what pressure cost in the body." },
    { sceneId: "add_c04_vance_review_window", locationId: "common_lounge", chapter: 4, label: "Catch Vance near the review window", detail: "Hear what command sees when repetition finally starts exposing character." },
    { sceneId: "add_c04_ben_pool_edge", locationId: "medical", chapter: 4, label: "Sit with Ben by the recovery pool", detail: "Talk to the one person nobody lets look breakable." },
    { sceneId: "add_c04_piper_track_late", locationId: "courtyard", chapter: 4, label: "Find Piper on the late track", detail: "See what speed looks like after too much scrutiny and not enough sleep." },
    { sceneId: "add_c05_camille_promenade_angles", locationId: "blackwater_promenade", chapter: 5, label: "Walk the promenade with Camille", detail: "Let Camille read the crowd and the future in the same motion." },
    { sceneId: "add_c05_julian_anchor_corner", locationId: "rusty_anchor", chapter: 5, label: "Take a corner table with Julian", detail: "Find the private line hidden under the bar-light performance." },
    { sceneId: "add_c05_theo_transit_math", locationId: "transit_platform", chapter: 5, label: "Catch Theo doing transit math", detail: "Ask what the branch model misses when real people start wanting things." },
    { sceneId: "add_c05_vance_platform_clearance", locationId: "transit_platform", chapter: 5, label: "Talk to Vance on the platform", detail: "Find out what clearance looks like when an adult institution says yes carefully." },
    { sceneId: "add_c05_piper_dock_pressure", locationId: "east_dock", chapter: 5, label: "Find Piper before the dock turns serious", detail: "Hear the joke version and the real version before launch." },
    { sceneId: "add_c05_rina_service_ramp", locationId: "east_dock", chapter: 5, label: "Catch Rina on the service ramp", detail: "See whether rivalry can survive the shift from sim pressure to water." },
    { sceneId: "add_c05_ben_towel_honesty", locationId: "blackwater_infirmary", chapter: 5, label: "Find Ben after the landing", detail: "Give the protector a moment where he is not carrying the whole room." },
    { sceneId: "add_c05_camille_dock_cleanup", locationId: "east_dock", chapter: 5, label: "Stay for the dock cleanup with Camille", detail: "Talk to Camille while adrenaline becomes logistics." },
    { sceneId: "add_c05_piper_walkback_after", locationId: "blackwater_promenade", chapter: 5, label: "Walk back with Piper after the infirmary", detail: "Let the private part of the dock test arrive on foot." },
    { sceneId: "add_c06_booth_currents", locationId: "event_horizon", chapter: 6, label: "Read the booth currents", detail: "Let Event Horizon show how power arranges itself when nobody says hero." },
    { sceneId: "add_c06_julian_balcony", locationId: "event_horizon", chapter: 6, label: "Step onto the balcony with Julian", detail: "Trade the room for harbor wind and the sharper version of his honesty." },
    { sceneId: "add_c06_piper_backbar", locationId: "event_horizon", chapter: 6, label: "Find Piper at the back bar", detail: "See how she jokes when neutral ground still feels like a trap." },
    { sceneId: "add_c06_camille_service_corridor", locationId: "event_horizon", chapter: 6, label: "Take the service corridor with Camille", detail: "Catch Camille where exits matter more than atmosphere." },
    { sceneId: "add_c06_theo_sideoffice", locationId: "event_horizon", chapter: 6, label: "Find Theo in the side office", detail: "Talk to Theo where probability gets quieter and more personal." },
    { sceneId: "add_c07_records_annex_julian", locationId: "records_annex", chapter: 7, label: "Ask Julian what the file is hiding", detail: "Let the redactions turn into a more private kind of conversation." },
    { sceneId: "add_c07_medical_piper", locationId: "medical", chapter: 7, label: "Find Piper in medical", detail: "Catch the version of Piper that shows up when the jokes are busy failing." },
    { sceneId: "add_c07_bait_conscience_expanded", locationId: "briefing_room", chapter: 7, label: "Interrogate the conscience of the bait plan", detail: "Push the moral part of the strategy until it stops hiding behind briefing language." },
    { sceneId: "add_c07_camille_lock_protocol_expanded", locationId: "briefing_room", chapter: 7, label: "Ask Camille about the lock protocol", detail: "Push the strategy until it stops pretending to be only procedural." },
    { sceneId: "add_c07_vance_review_expanded", locationId: "briefing_room", chapter: 7, label: "Ask Vance for the real review", detail: "Hear what the operation becomes once command strips the brief down to risk." },
    { sceneId: "add_c07_jordan_signal", locationId: "records_annex", chapter: 7, label: "Let Jordan read the room before the bait goes live", detail: "Use the network before certainty turns contagious." },
    { sceneId: "add_c07_ben_training_support", locationId: "training_wing", chapter: 7, label: "Take the training wing with Ben", detail: "Talk to Ben about what backup means when the trap is on purpose." },
    { sceneId: "add_c08_piper_runway_hold", locationId: "airbase_hangar", chapter: 8, label: "Hold the runway line with Piper", detail: "Let the impossible speed test become human before it becomes kinetic." },
    { sceneId: "add_c08_camille_abort_geometry", locationId: "medical", chapter: 8, label: "Ask Camille about the abort geometry", detail: "See what her trust looks like when failure has runway attached to it." },
    { sceneId: "add_c08_theo_medical_afterburn", locationId: "medical", chapter: 8, label: "Find Theo after the burn line", detail: "Catch Theo where the numbers stop behaving like enough." },
    { sceneId: "add_c08_julian_catwalk", locationId: "airbase_hangar", chapter: 8, label: "Take the catwalk with Julian", detail: "Watch the runway from above with someone who understands spectacle too well." },
    { sceneId: "add_c08_ben_crashmats", locationId: "airbase_hangar", chapter: 8, label: "Find Ben by the crash mats", detail: "Talk to the person everybody expects to absorb the rest of the plan." },
    { sceneId: "add_c08_transit_night", locationId: "transit_platform", chapter: 8, label: "Take the night transit back slowly", detail: "Let the airbase sit in your body long enough to turn into thought." },
    { sceneId: "add_c08_kitchen_reentry", locationId: "common_lounge", chapter: 8, label: "Reenter through the kitchen lights", detail: "Come back to campus through the lived-in parts instead of the heroic ones." },
    { sceneId: "add_c09_camille_service_stair", locationId: "residence_wing", chapter: 9, label: "Find Camille on the service stair", detail: "Take the quieter landing and let Camille say the part she would never stage." },
    { sceneId: "add_c09_julian_packing_show_v2", locationId: "residence_wing", chapter: 9, label: "Find Julian while he packs", detail: "Catch Julian in the version of honesty that only shows up when the room is almost over." },
    { sceneId: "add_c09_theo_archive_walk", locationId: "records_annex", chapter: 9, label: "Take the archive walk with Theo", detail: "Let Theo talk future, risk, and wanting without flattening any of them." },
    { sceneId: "add_c09_ben_cafeteria_last_plate", locationId: "cafeteria", chapter: 9, label: "Sit with Ben over the last cafeteria plate", detail: "Let the last night get practical and honest at the same time." },
    { sceneId: "add_c09_jordan_lounge_truth", locationId: "common_lounge", chapter: 9, label: "Find Jordan in the lounge", detail: "Ask for the social truth without making it perform." },
    { sceneId: "add_c09_vance_campus_walk_v2", locationId: "courtyard", chapter: 9, label: "Take the campus walk with Vance", detail: "Hear what the command voice says when graduation is close enough to touch." },
    { sceneId: "add_c09_med_night_scan", locationId: "medical", chapter: 9, label: "Take one last scan", detail: "Let the last night remember what the body cost too." },
    { sceneId: "add_c09_rina_gallery_exit", locationId: "training_wing", chapter: 9, label: "Catch Rina on the gallery exit", detail: "See what victory means to someone who hates decorative closure." },
    { sceneId: "add_c10_vance_admin_corridor", locationId: "admin_wing", chapter: 10, label: "Catch Vance in the admin corridor", detail: "Get the unofficial evaluation before the room calls it a ceremony." },
    { sceneId: "add_c10_piper_side_door_v2", locationId: "graduation_hall", chapter: 10, label: "Find Piper by the side door", detail: "Stand by the cleanest exit and see whether either of you means to take it." },
    { sceneId: "add_c10_camille_courtyard_honesty_v2", locationId: "courtyard", chapter: 10, label: "Take the shade rail with Camille", detail: "Let Camille say the unsupervised version before the stage starts." },
    { sceneId: "add_c10_julian_program_v2", locationId: "admin_wing", chapter: 10, label: "Let Julian rewrite the program with you", detail: "Find out what ceremony looks like when Julian stops pretending it is harmless." },
    { sceneId: "add_c10_theo_last_probability_v2", locationId: "courtyard", chapter: 10, label: "Take Theo's last probability walk", detail: "Ask Theo what he wants when percentages stop being enough." },
    { sceneId: "add_c10_ben_service_dock", locationId: "graduation_hall", chapter: 10, label: "Find Ben near the service dock", detail: "Check on the person everyone trusts with the heavy part of a threshold." },
    { sceneId: "add_c10_jordan_admin_truth", locationId: "admin_wing", chapter: 10, label: "Catch Jordan before the stage", detail: "Get the social truth while the admin wing is still pretending it can hold it." }
  ].forEach((item) => actionForScene(item.sceneId, item.locationId, item.chapter, item.label, item.detail));

  redirect("c02_residence_after", "c03_hub_gallery", "add_c03_admin_notice_board");
  redirect("c03_private_notes", "c04_hub_training", "add_c03_residence_kitchen_after_reports");
  retargetAllChoices("add_c03_residence_kitchen_after_reports", "add_c04_anchor_afterhours");
  redirect("c04_debrief", "c05_hub_dock", "add_c04_debrief_crosscurrents");
  redirect("c05_flight", "c05_after_flight", "add_c05_waterline_commitment");
  retargetAllChoices("add_c05_waterline_commitment", "c05_after_flight");
  redirect("c05_rooftop_after", "c06_hub_event", "add_c05_residence_kitchen_return");
  retargetAllChoices("add_c05_residence_kitchen_return", "add_c06_blackwater_window");
  retargetAllChoices("add_c06_blackwater_window", "c06_hub_event");
  redirect("c06_blackwater_drive", "add_c06_blackwater_window", "c06_event_horizon");
  redirect("c06_apartment_board", "c07_hub_bait", "add_c06_apartment_board_night");
  retargetAllChoices("add_c06_apartment_board_night", "c07_deep_morning");
  redirect("c07_deep_morning", "c07_deep_fallout", "add_c07_morning_kitchen_fallout");
  retargetAllChoices("add_c07_bait_conscience_expanded", "add_c07_before_bait_fracture");
  redirect("c07_afteraction_erased", "c07_medbay_fallout", "add_c07_afteraction_kitchen");
  redirect("c07_afteraction_contained", "c07_medbay_fallout", "add_c07_afteraction_kitchen");
  redirect("c07_afteraction_escaped", "c07_medbay_fallout", "add_c07_afteraction_kitchen");
  redirect("c07_jordan_signal", "c08_hub_airbase", "add_c08_hangar_arrival");
  retargetAllChoices("add_c08_hangar_arrival", "c08_deep_review");
  redirect("c08_rina_wall", "c08_private_threshold", "add_c08_afterburn_corridor");
  redirect("c08_private_threshold", "c09_hub_graduation_eve", "add_c09_before_pizza_threshold");
  redirect("c09_sleep_or_not", "c10_hub_graduation", "add_c10_morning_courtyard_pulse");

  STORY.intentionalOrphans = Array.from(new Set([
    ...intentionalOrphans,
    "c02_deep_glass",
    "c02_deep_numbers",
    "c02_deep_queue",
    "c02_deep_threshold",
    "c02_deep_wake",
    "c02_observation_deck",
    "c07_deep_fallout",
    "c07_deep_bait",
    "c07_deep_private",
    "c07_deep_threshold"
  ]));
})();
/* AUTHORING_PACKS_HUBS_END */
