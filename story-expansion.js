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

  Object.assign(scenes, {
    c01_room_assignment: {
      chapter: 1,
      title: "Room Assignment",
      location: "Aegis Residence Wing",
      background: "aegis",
      focus: "Seth",
      variants: [
        {
          conditions: [{ type: "flag", key: "piperShortcuts" }],
          text: ["Piper walks you to the residence wing by a route that avoids three cameras and one staff desk. She calls this hospitality. Jordan calls it a statistical improvement over being processed."]
        },
        {
          conditions: [{ type: "flag", key: "camilleEarly" }],
          text: ["Camille's parting advice follows you down the hall: learn which parts of your power answer to intent, and which parts answer to fear."]
        },
        {
          conditions: [{ type: "flag", key: "orientationCredit" }],
          text: ["Orientation has left you with rules, signatures, and a mild suspicion that Aegis uses paperwork as a containment field."]
        }
      ],
      text: [
        "Your room is clean, narrow, and expensive in the way institutional furniture becomes expensive when someone is afraid of lawsuits. The window faces the ocean. The bed is bolted down. The desk has a tablet already loaded with your schedule.",
        "The first week is dense enough to feel punitive: baseline control, threat modeling, supervised recreation, psychological intake, and a blank space labeled personal adaptation period. That last one sounds voluntary until you notice it has a room number.",
        "Aegis wants you rested for tomorrow. Your power does not care what Aegis wants. It sits under your ribs like a second pulse, quiet for now, waiting to learn what kind of life you are going to build around it."
      ],
      choices: [
        {
          text: "Read the schedule twice and mark every mandatory evaluation.",
          effects: [
            { type: "stat", key: "control", delta: 1 },
            { type: "stat", key: "aegisTrust", delta: 1 },
            { type: "flag", key: "scheduleStudied", value: true }
          ],
          next: "c01_intake_night"
        },
        {
          text: "Ignore the tablet and test how honest the window lock is.",
          effects: [
            { type: "stat", key: "audacity", delta: 1 },
            { type: "stat", key: "independentPath", delta: 1 },
            { type: "flag", key: "testedWindowLock", value: true }
          ],
          next: "c01_intake_night"
        },
        {
          text: "Sit on the floor and breathe until the power stops feeling like weather.",
          effects: [
            { type: "stat", key: "restraint", delta: 1 },
            { type: "powerXp", amount: 1 },
            { type: "flag", key: "firstNightBreathing", value: true }
          ],
          next: "c01_intake_night"
        }
      ]
    },
    c01_intake_night: {
      chapter: 1,
      title: "The First Quiet",
      location: "Residence Wing",
      background: "aegis",
      focus: "Seth",
      text: [
        "Quiet does not arrive all at once. It leaks in through the vent hum, the distant crash of waves, and the occasional laugh from the hall. Every sound reminds you that Aegis is full of people who can break normal life by accident.",
        "Your file sits open on the tablet. It uses neutral language for things that did not feel neutral while they were happening: uncontrolled discharge, environmental damage, emergency response, civilian exposure. It reads like someone translated panic into legal grammar.",
        "The file ends with a simple line: candidate demonstrates high ceiling and unknown lower boundary. It is the kind of sentence that looks clinical until you understand it means nobody knows how bad it gets if you lose."
      ],
      choices: [
        {
          text: "Add your own note: control is not obedience.",
          effects: [
            { type: "stat", key: "resolve", delta: 1 },
            { type: "stat", key: "independentPath", delta: 1 },
            { type: "flag", key: "controlNotObedience", value: true }
          ],
          next: "c01_first_morning"
        },
        {
          text: "Add your own note: if people are scared, give them proof.",
          effects: [
            { type: "stat", key: "control", delta: 1 },
            { type: "stat", key: "heroPath", delta: 1 },
            { type: "flag", key: "proofMatters", value: true }
          ],
          next: "c01_first_morning"
        },
        {
          text: "Close the file. Tonight you are a person, not a case study.",
          effects: [
            { type: "stat", key: "restraint", delta: 1 },
            { type: "stat", key: "civilianPath", delta: 1 },
            { type: "flag", key: "closedFileFirstNight", value: true }
          ],
          next: "c01_first_morning"
        }
      ]
    },
    c01_first_morning: {
      chapter: 1,
      title: "Breakfast Rules",
      location: "Dining Hall",
      background: "aegis",
      focus: "Piper",
      variants: [
        {
          conditions: [{ type: "relationshipAtLeast", key: "Piper", value: 2 }],
          text: ["Piper finds you before coffee does. She has already formed opinions about the oatmeal, two staff members, and the moral failure of scheduling baselines before lunch."]
        },
        {
          conditions: [{ type: "relationshipBelow", key: "Piper", value: 2 }],
          text: ["Piper Lane appears at your table with a tray and the confidence of someone who thinks strangers are just friends who have not been useful yet."]
        }
      ],
      text: [
        "Breakfast is where Aegis pretends everyone is normal. Nobody floats. Nobody throws sparks. Nobody admits the spoons are reinforced after an incident with a magnetokinetic resident and a bad breakup.",
        "Camille sits two tables away with Julian and Theo, their conversation low and contained. Ben eats alone but not unhappily. Jordan moves between tables like news has a gravitational pull. Rina watches the room with a competitor's patience.",
        "By the time your tray is empty, the first baseline notification appears on every wall display. Simulation Block A. Ten minutes. No late arrivals."
      ],
      choices: [
        {
          text: "Ask Piper what people really expect from a first baseline.",
          effects: [
            { type: "relationship", key: "Piper", delta: 1 },
            { type: "stat", key: "control", delta: 1 },
            { type: "flag", key: "askedPiperBaseline", value: true }
          ],
          next: "c02_baseline_intro"
        },
        {
          text: "Watch Camille's table and try to read the hierarchy.",
          effects: [
            { type: "relationship", key: "Camille", delta: 1 },
            { type: "relationship", key: "Julian", delta: 1 },
            { type: "stat", key: "foundationPath", delta: 1 },
            { type: "flag", key: "watchedCamilleTable", value: true }
          ],
          next: "c02_baseline_intro"
        },
        {
          text: "Walk to the sim block alone. Let the first number be yours.",
          effects: [
            { type: "stat", key: "resolve", delta: 1 },
            { type: "stat", key: "restraint", delta: 1 },
            { type: "flag", key: "walkedAloneBaseline", value: true }
          ],
          next: "c02_baseline_intro"
        }
      ]
    },

    c02_observation_deck: {
      chapter: 2,
      title: "Observation Deck",
      location: "Simulation Block A",
      background: "sim",
      focus: "Vance",
      text: [
        "The observation deck is where Aegis turns people into data. Vance stands behind the glass with two analysts and a medic. Nobody looks cruel. That almost makes it worse. Cruelty would be easier to hate than professionalism.",
        "Residents cycle through the room before you. One overcorrects and freezes the target solid. Another panics when the block cracks. A woman with blue tattoos turns the air around her hand into a glassy shimmer and gets a quiet nod from the evaluator.",
        "Your name appears on the wall. The sim door unlocks with a sound that is too small for the size of the moment."
      ],
      choices: [
        {
          text: "Enter without looking back at the glass.",
          effects: [
            { type: "stat", key: "resolve", delta: 1 },
            { type: "flag", key: "ignoredObservationDeck", value: true }
          ],
          next: "c02_baseline_intro"
        },
        {
          text: "Look back long enough to make sure Vance sees you calm.",
          effects: [
            { type: "relationship", key: "Vance", delta: 1 },
            { type: "stat", key: "aegisTrust", delta: 1 },
            { type: "flag", key: "signaledVanceCalm", value: true }
          ],
          next: "c02_baseline_intro"
        },
        {
          text: "Let the power stir once, just enough to remind yourself it answers.",
          effects: [
            { type: "powerXp", amount: 1 },
            { type: "stat", key: "audacity", delta: 1 },
            { type: "flag", key: "stirredPowerBeforeBaseline", value: true }
          ],
          next: "c02_baseline_intro"
        }
      ]
    },
    c02_control_lab: {
      chapter: 2,
      title: "Small Numbers",
      location: "Calibration Lab",
      background: "sim",
      focus: "Seth",
      text: [
        "After the baseline, they do not let you leave immediately. A tech escorts you into a smaller room lined with target plates, impact gel, thermal sinks, and three chairs bolted to the floor. The scale of the room tells you what Aegis considers progress: smaller outputs, cleaner stops, less drama.",
        "The tech does not ask what your power feels like. She asks what it does when you are tired, startled, praised, cornered. Aegis cares less about what you can do at your best than what leaks out when you are annoyed.",
        "That is the first useful thing anyone has taught you today."
      ],
      choices: [
        {
          text: "Practice stopping at exactly half output.",
          effects: [
            { type: "stat", key: "control", delta: 2 },
            { type: "powerXp", amount: 1 },
            { type: "flag", key: "halfOutputDrill", value: true }
          ],
          next: "c02_residence_after"
        },
        {
          text: "Practice holding full output without releasing it.",
          effects: [
            { type: "stat", key: "restraint", delta: 2 },
            { type: "powerXp", amount: 1 },
            { type: "flag", key: "heldFullOutput", value: true }
          ],
          next: "c02_residence_after"
        },
        {
          text: "Ask what happens if the measurements say you are too dangerous.",
          effects: [
            { type: "stat", key: "aegisFear", delta: 1 },
            { type: "stat", key: "contractorPath", delta: 1 },
            { type: "flag", key: "askedTooDangerous", value: true }
          ],
          next: "c02_residence_after"
        }
      ]
    },
    c02_residence_after: {
      chapter: 2,
      title: "After The Number",
      location: "Residence Wing",
      background: "aegis",
      focus: "Seth",
      variants: [
        {
          conditions: [{ type: "flag", key: "perfectBaseline" }],
          text: ["Five hundred exactly should feel like victory. Instead it follows you around as a rumor with decimals."]
        },
        {
          conditions: [{ type: "flag", key: "baselineShowmanship" }],
          text: ["The contained star is already growing in the retelling. By dinner, someone claims the observation glass shook. It did not. That may not matter."]
        }
      ],
      text: [
        "The hallway outside your room is full of ordinary sounds: showers running, someone laughing too loudly, music leaking from under a door. The normality feels constructed, but not false. People are trying to live here.",
        "Your tablet flashes with the next day's invitation from Camille's training group. Under it, a message from Piper: if anyone asks, the brownies were medicinal.",
        "Aegis is beginning to divide itself into official and unofficial maps. The question is which one you will trust when they disagree."
      ],
      choices: [
        {
          text: "Confirm Camille's invitation before overthinking it.",
          effects: [
            { type: "relationship", key: "Camille", delta: 1 },
            { type: "flag", key: "confirmedCamilleInvite", value: true }
          ],
          next: "c03_observe"
        },
        {
          text: "Reply to Piper first. The unofficial map has better snacks.",
          effects: [
            { type: "relationship", key: "Piper", delta: 1 },
            { type: "stat", key: "independentPath", delta: 1 },
            { type: "flag", key: "piperTextFirst", value: true }
          ],
          next: "c03_observe"
        },
        {
          text: "Ask Theo for the non-public risk model on Sim Block C.",
          conditions: [{ type: "relationshipAtLeast", key: "Theo", value: 1 }],
          effects: [
            { type: "relationship", key: "Theo", delta: 1 },
            { type: "stat", key: "control", delta: 1 },
            { type: "flag", key: "askedTheoRiskModel", value: true }
          ],
          next: "c03_observe"
        }
      ]
    },

    c03_gallery_pressure: {
      chapter: 3,
      title: "Gallery Pressure",
      location: "Advanced Simulation Bay",
      background: "sim",
      focus: "Camille",
      text: [
        "Observing Camille's group is not passive. The gallery has its own pressure. You stand behind the glass with a dozen residents who know enough to judge and not enough to be kind.",
        "Leo, Mara, and Elara move like people who have trained together long enough to fight without speaking. Camille does not command every second. She waits, corrects one angle, and lets the team feel the consequences of almost being wrong.",
        "That restraint is harder than domination. It asks everyone in the room to believe she could take over and chooses not to."
      ],
      choices: [
        {
          text: "Study Camille's restraint instead of her power.",
          effects: [
            { type: "relationship", key: "Camille", delta: 1 },
            { type: "stat", key: "restraint", delta: 1 },
            { type: "flag", key: "studiedCamilleRestraint", value: true }
          ],
          next: "c03_observe"
        },
        {
          text: "Study the team's timing, especially where Theo would call risk.",
          effects: [
            { type: "relationship", key: "Theo", delta: 1 },
            { type: "stat", key: "control", delta: 1 },
            { type: "flag", key: "studiedTeamTiming", value: true }
          ],
          next: "c03_observe"
        },
        {
          text: "Study the audience. Gossip is data if you hate yourself enough.",
          effects: [
            { type: "relationship", key: "Jordan", delta: 1 },
            { type: "stat", key: "exposure", delta: 1 },
            { type: "flag", key: "studiedAudience", value: true }
          ],
          next: "c03_observe"
        }
      ]
    },
    c03_after_gallery: {
      chapter: 3,
      title: "Standards",
      location: "Sim Block Hallway",
      background: "aegis",
      focus: "Camille",
      text: [
        "After the exercise, the hallway turns into a court without a judge. Residents offer opinions in careful voices. Camille accepts praise like it is raw material and criticism like it is overdue maintenance.",
        "Julian catches you watching and smiles. \"Careful. People who admire standards either become excellent or insufferable. Occasionally both.\"",
        "Theo, beside him, does not smile. \"Standards are useful. Worship is not.\" The correction is quiet enough that only the three of you hear it."
      ],
      choices: [
        {
          text: "Tell Camille the standard is useful because it is visible.",
          effects: [
            { type: "relationship", key: "Camille", delta: 2 },
            { type: "stat", key: "control", delta: 1 },
            { type: "flag", key: "praisedVisibleStandards", value: true }
          ],
          next: "c03_observations"
        },
        {
          text: "Tell Theo standards become cages when nobody questions them.",
          effects: [
            { type: "relationship", key: "Theo", delta: 2 },
            { type: "stat", key: "independentPath", delta: 1 },
            { type: "flag", key: "questionedStandards", value: true }
          ],
          next: "c03_observations"
        },
        {
          text: "Tell Julian you are aiming for excellent, insufferable if necessary.",
          effects: [
            { type: "relationship", key: "Julian", delta: 2 },
            { type: "stat", key: "audacity", delta: 1 },
            { type: "flag", key: "insufferableIfNecessary", value: true }
          ],
          next: "c03_observations"
        }
      ]
    },
    c03_private_notes: {
      chapter: 3,
      title: "Notes Nobody Asked For",
      location: "Residence Wing",
      background: "aegis",
      focus: "Seth",
      text: [
        "That night, your tablet contains three unofficial notes. Piper sends commentary on Camille's face when you answered. Julian sends a drink menu from a place you are not cleared to visit. Theo sends one line: ask what a scenario is measuring before you decide how to win.",
        "Aegis's official note is shorter: candidate demonstrates adaptive attention under social pressure. You read it twice before realizing it means they noticed who you cared about impressing.",
        "Tomorrow's solo containment sim sits on the schedule like a dare with a room number."
      ],
      choices: [
        {
          text: "Write a prep plan around control, not impact.",
          effects: [
            { type: "stat", key: "control", delta: 1 },
            { type: "stat", key: "contractorPath", delta: 1 },
            { type: "flag", key: "controlPrepPlan", value: true }
          ],
          next: "c04_anchor"
        },
        {
          text: "Write a prep plan around protecting people first.",
          effects: [
            { type: "stat", key: "restraint", delta: 1 },
            { type: "stat", key: "heroPath", delta: 1 },
            { type: "flag", key: "protectionPrepPlan", value: true }
          ],
          next: "c04_anchor"
        },
        {
          text: "Write no plan. Sleep matters more than pretending certainty exists.",
          effects: [
            { type: "stat", key: "resolve", delta: 1 },
            { type: "stat", key: "civilianPath", delta: 1 },
            { type: "flag", key: "sleptBeforeCamilleTest", value: true }
          ],
          next: "c04_anchor"
        }
      ]
    },

    c04_pre_sim: {
      chapter: 4,
      title: "Before The Door Opens",
      location: "Sim Chamber Three",
      background: "sim",
      focus: "Camille",
      text: [
        "Camille arrives ten minutes early. Of course she does not say early. She says prepared. The difference matters to her, and maybe that is the first honest thing you understand about her.",
        "She reviews the sim rules without looking at the tablet. No lethal force unless authorized. No collapse of structural supports. No improvising outside bounds unless the sim creates civilian risk. She says that last part like she expects you to hear the trap.",
        "Piper is not on the approved observer list. Theo is, somehow, because probability risk apparently counts as equipment. Julian is present because Camille failed to forbid him in writing."
      ],
      choices: [
        {
          text: "Ask Camille what the test is really measuring.",
          effects: [
            { type: "relationship", key: "Camille", delta: 1 },
            { type: "stat", key: "control", delta: 1 },
            { type: "flag", key: "askedRealMeasure", value: true }
          ],
          next: "c04_camille_test"
        },
        {
          text: "Ask Theo which failure branch he hates most.",
          effects: [
            { type: "relationship", key: "Theo", delta: 1 },
            { type: "stat", key: "restraint", delta: 1 },
            { type: "flag", key: "askedTheoFailureBranch", value: true }
          ],
          next: "c04_camille_test"
        },
        {
          text: "Ask Julian if he takes requests from doomed performers.",
          effects: [
            { type: "relationship", key: "Julian", delta: 1 },
            { type: "stat", key: "audacity", delta: 1 },
            { type: "flag", key: "askedJulianRequests", value: true }
          ],
          next: "c04_camille_test"
        }
      ]
    },
    c04_medical_scan: {
      chapter: 4,
      title: "The Cost Of Clean",
      location: "Medical Wing",
      background: "aegis",
      focus: "Seth",
      text: [
        "After Camille's sim, medical runs scans that pretend not to be invasive by using polite lighting. The medic asks whether the power leaves a taste, a sound, a pressure behind the eyes. She checks boxes when you answer and different boxes when you hesitate.",
        "The scan shows stress but not damage. That sounds like good news until the medic explains that Aegis worries more when the body looks fine after impossible output. A normal injury has boundaries. Your power keeps refusing to provide them.",
        "A message from Camille arrives during the scan: acceptable improvement. From Piper: if acceptable is her version of flirting, I am suing."
      ],
      choices: [
        {
          text: "Tell medical everything. Unknown limits are still limits.",
          effects: [
            { type: "stat", key: "aegisTrust", delta: 1 },
            { type: "stat", key: "control", delta: 1 },
            { type: "flag", key: "honestMedicalScan", value: true }
          ],
          next: "c04_second_wave"
        },
        {
          text: "Hold back the part that felt good.",
          effects: [
            { type: "stat", key: "aegisFear", delta: 1 },
            { type: "stat", key: "villainPath", delta: 1 },
            { type: "flag", key: "hidPowerPleasure", value: true }
          ],
          next: "c04_second_wave"
        },
        {
          text: "Ask for the raw scan data and learn the language they use about you.",
          effects: [
            { type: "stat", key: "contractorPath", delta: 1 },
            { type: "relationship", key: "Theo", delta: 1 },
            { type: "flag", key: "requestedScanData", value: true }
          ],
          next: "c04_second_wave"
        }
      ]
    },
    c04_debrief: {
      chapter: 4,
      title: "Debrief Without Applause",
      location: "Observation Gallery",
      background: "sim",
      focus: "Camille",
      text: [
        "Camille's debrief is precise enough to feel surgical. She names the moments you chose well, then the moments you chose late. She does not soften either list.",
        "Julian lounges against the wall and pretends not to be listening. Theo is not pretending. Piper, who is still not officially on the list, appears in the doorway with a vending machine drink and the look of someone daring anyone to remove her.",
        "For the first time, the argument around you is not whether you are dangerous. Everyone in the room has accepted that. The argument is what kind of dangerous you are becoming."
      ],
      choices: [
        {
          text: "Take the criticism cleanly. Improvement is more useful than pride.",
          effects: [
            { type: "relationship", key: "Camille", delta: 2 },
            { type: "stat", key: "control", delta: 1 },
            { type: "flag", key: "acceptedCamilleCritique", value: true }
          ],
          next: "c05_dock_setup"
        },
        {
          text: "Ask Piper what it looked like from outside the approved list.",
          effects: [
            { type: "relationship", key: "Piper", delta: 2 },
            { type: "stat", key: "independentPath", delta: 1 },
            { type: "flag", key: "askedPiperOutsideView", value: true }
          ],
          next: "c05_dock_setup"
        },
        {
          text: "Ask the room what kind of dangerous they need you to be.",
          effects: [
            { type: "stat", key: "resolve", delta: 1 },
            { type: "stat", key: "exposure", delta: 1 },
            { type: "flag", key: "askedKindOfDangerous", value: true }
          ],
          next: "c05_dock_setup"
        }
      ]
    },

    c05_blind_spot: {
      chapter: 5,
      title: "Blind Spot Math",
      location: "Boathouse",
      background: "city",
      focus: "Theo",
      text: [
        "Theo's map of the old dock looks less like a map than a confession. Camera arcs, patrol timings, maintenance gaps, weather drift, power draw. Every blind spot has a reason, and every reason makes Aegis look less omniscient.",
        "\"This is not permission,\" Theo says before you can ask. \"This is risk reduction after someone else already decided to be irresponsible.\"",
        "Piper salutes him with two fingers. \"He means you're welcome.\" Theo does not dignify that with a response, but he does move the safest route three centimeters left."
      ],
      choices: [
        {
          text: "Promise Theo you will abort if the risk model spikes.",
          effects: [
            { type: "relationship", key: "Theo", delta: 2 },
            { type: "stat", key: "restraint", delta: 1 },
            { type: "flag", key: "promisedTheoAbort", value: true }
          ],
          next: "c05_dock_setup"
        },
        {
          text: "Ask Piper how many times she has used this route.",
          effects: [
            { type: "relationship", key: "Piper", delta: 1 },
            { type: "stat", key: "audacity", delta: 1 },
            { type: "flag", key: "askedPiperRouteHistory", value: true }
          ],
          next: "c05_dock_setup"
        },
        {
          text: "Memorize the gaps. Systems reveal themselves where they fail.",
          effects: [
            { type: "stat", key: "control", delta: 1 },
            { type: "stat", key: "contractorPath", delta: 1 },
            { type: "flag", key: "memorizedBlindSpots", value: true }
          ],
          next: "c05_dock_setup"
        }
      ]
    },
    c05_waterline: {
      chapter: 5,
      title: "Waterline",
      location: "Old East Dock",
      background: "city",
      focus: "Piper",
      text: [
        "The dock smells like salt, rust, and bad ideas that have survived previous generations. Piper moves across the boards with easy speed, slowing only when she remembers not everyone experiences distance as a suggestion.",
        "For a few minutes, the test is not a test. It is wind, water, and the strange relief of choosing danger instead of having it assigned. Then your power answers the bay, and the quiet changes.",
        "The water below reflects every light on campus. Aegis looks beautiful from here. That feels like a trick."
      ],
      choices: [
        {
          text: "Tell Piper the view almost makes Aegis look harmless.",
          effects: [
            { type: "relationship", key: "Piper", delta: 1 },
            { type: "stat", key: "independentPath", delta: 1 },
            { type: "flag", key: "aegisLooksHarmless", value: true }
          ],
          next: "c05_flight"
        },
        {
          text: "Tell Theo the route is clean enough and wait for his correction.",
          effects: [
            { type: "relationship", key: "Theo", delta: 1 },
            { type: "stat", key: "control", delta: 1 },
            { type: "flag", key: "waitedTheoCorrection", value: true }
          ],
          next: "c05_flight"
        },
        {
          text: "Say nothing. Let the power listen to the bay.",
          effects: [
            { type: "powerXp", amount: 2 },
            { type: "stat", key: "resolve", delta: 1 },
            { type: "flag", key: "listenedToBay", value: true }
          ],
          next: "c05_flight"
        }
      ]
    },
    c05_rooftop_after: {
      chapter: 5,
      title: "After The Alarm Does Not Ring",
      location: "Residence Roof",
      background: "aegis",
      focus: "Piper",
      text: [
        "The alarm never rings. That should make the night feel like success. Instead, the silence sharpens around the three of you as you climb to the residence roof and look back toward the dock.",
        "Piper is flushed with triumph, but not careless. Theo keeps checking his tablet as if the consequences might still arrive late. You can feel your own power settling, not dormant anymore, just satisfied.",
        "That is the part nobody put in the file. Power can feel satisfied. The knowledge lands badly and stays."
      ],
      choices: [
        {
          text: "Tell Piper the test worked because she trusted you.",
          effects: [
            { type: "relationship", key: "Piper", delta: 2 },
            { type: "stat", key: "resolve", delta: 1 },
            { type: "flag", key: "piperTrustDock", value: true }
          ],
          next: "c05_relationship"
        },
        {
          text: "Tell Theo he was right to worry.",
          effects: [
            { type: "relationship", key: "Theo", delta: 2 },
            { type: "stat", key: "restraint", delta: 1 },
            { type: "flag", key: "theoRightToWorry", value: true }
          ],
          next: "c05_relationship"
        },
        {
          text: "Admit the power felt satisfied and watch both reactions.",
          effects: [
            { type: "relationship", key: "Piper", delta: 1 },
            { type: "relationship", key: "Theo", delta: 1 },
            { type: "stat", key: "aegisFear", delta: 1 },
            { type: "flag", key: "admittedPowerSatisfaction", value: true }
          ],
          next: "c05_relationship"
        }
      ]
    },

    c06_blackwater_drive: {
      chapter: 6,
      title: "Blackwater Window",
      location: "Aegis Shuttle",
      background: "city",
      focus: "Julian",
      text: [
        "Blackwater City rises out of the coast in glass, concrete, neon, and old money trying on new names. The shuttle carries you through security gates and into streets where Aegis uniforms stop being normal.",
        "Julian narrates the city like he owns at least three scandals in every district. Camille corrects him twice. Piper asks which district has the best rooftops. Theo watches traffic patterns and says nothing until he says, \"Too many exits.\"",
        "That is the mood before The Event Horizon: dressed up, joking, and quietly counting doors."
      ],
      choices: [
        {
          text: "Ask Julian which doors matter tonight.",
          effects: [
            { type: "relationship", key: "Julian", delta: 2 },
            { type: "stat", key: "foundationPath", delta: 1 },
            { type: "flag", key: "askedJulianDoors", value: true }
          ],
          next: "c06_event_horizon"
        },
        {
          text: "Ask Theo which exits worry him.",
          effects: [
            { type: "relationship", key: "Theo", delta: 2 },
            { type: "stat", key: "contractorPath", delta: 1 },
            { type: "flag", key: "askedTheoExits", value: true }
          ],
          next: "c06_event_horizon"
        },
        {
          text: "Ask Piper which rooftop she would steal if rooftops could be stolen.",
          effects: [
            { type: "relationship", key: "Piper", delta: 2 },
            { type: "stat", key: "independentPath", delta: 1 },
            { type: "flag", key: "askedPiperRooftops", value: true }
          ],
          next: "c06_event_horizon"
        }
      ]
    },
    c06_aftershock: {
      chapter: 6,
      title: "No One Laughs Right",
      location: "Blackwater Alley",
      background: "city",
      focus: "Camille",
      text: [
        "After Rhea leaves, nobody laughs correctly. Julian tries first and fails by making the joke too sharp. Piper's hands keep opening and closing. Theo looks at every reflection as if one of them might make a decision.",
        "Camille gets everyone moving. Not fast. Not visibly frightened. Just moving, because standing still would let the room decide what happened before you do.",
        "The city outside The Event Horizon has not changed. Cars pass. Someone argues on a balcony. A siren cuts across two blocks and fades. The normal world is rude enough to continue."
      ],
      choices: [
        {
          text: "Let Camille set the pace. Panic needs a leader less than it needs direction.",
          effects: [
            { type: "relationship", key: "Camille", delta: 2 },
            { type: "stat", key: "control", delta: 1 },
            { type: "flag", key: "letCamillePace", value: true }
          ],
          next: "c06_after_rhea"
        },
        {
          text: "Stay close to Piper until her hands stop shaking.",
          effects: [
            { type: "relationship", key: "Piper", delta: 2 },
            { type: "stat", key: "resolve", delta: 1 },
            { type: "flag", key: "steadiedPiperAfterRhea", value: true }
          ],
          next: "c06_after_rhea"
        },
        {
          text: "Ask Theo for the first actionable fact, not the whole fear spiral.",
          effects: [
            { type: "relationship", key: "Theo", delta: 2 },
            { type: "stat", key: "contractorPath", delta: 1 },
            { type: "flag", key: "groundedTheoAfterRhea", value: true }
          ],
          next: "c06_after_rhea"
        }
      ]
    },
    c06_apartment_board: {
      chapter: 6,
      title: "The Board",
      location: "Julian's Apartment",
      background: "city",
      focus: "Julian",
      text: [
        "Julian's apartment looks like a magazine spread until Camille starts turning it into a war room. Glass table, city view, expensive lighting, and now a wall display full of Rhea Kane's known movements.",
        "Vektor is not a name so much as a pressure system: private labs, shell companies, missing assets, paid silence. Nobody in the room says villain. That word belongs to news feeds and children. The adults use contractor, threat actor, liability, unknown sponsor.",
        "Piper says villain anyway. It helps more than anyone wants to admit."
      ],
      choices: [
        {
          text: "Call Vektor what it is. Some clarity is worth sounding naive.",
          effects: [
            { type: "relationship", key: "Piper", delta: 1 },
            { type: "stat", key: "heroPath", delta: 1 },
            { type: "flag", key: "calledVektorVillain", value: true }
          ],
          next: "c07_bait"
        },
        {
          text: "Ask Camille who profits if Vektor gets you.",
          effects: [
            { type: "relationship", key: "Camille", delta: 2 },
            { type: "stat", key: "foundationPath", delta: 1 },
            { type: "flag", key: "askedProfitMotive", value: true }
          ],
          next: "c07_bait"
        },
        {
          text: "Ask Julian what doors Vektor can open in Blackwater.",
          effects: [
            { type: "relationship", key: "Julian", delta: 2 },
            { type: "stat", key: "independentPath", delta: 1 },
            { type: "flag", key: "askedVektorDoors", value: true }
          ],
          next: "c07_bait"
        }
      ]
    },

    c07_before_bait: {
      chapter: 7,
      title: "Before The Trap",
      location: "Simulation Dome",
      background: "sim",
      focus: "Seth",
      text: [
        "The dome is too clean. Crews have reset the urban sim three times, removing anything that might make the trap look like a trap. That almost makes it obvious.",
        "Vance signs off from the observation deck. Camille stands at ground level with you because she refused to supervise from behind glass. Piper runs extraction paths until even she looks tired. Julian tunes decoys. Theo keeps one hand on his tablet and one hand near his radio.",
        "Everyone has a role. Yours is to be valuable enough that Rhea risks reaching for you."
      ],
      choices: [
        {
          text: "Thank the team before the sim begins.",
          effects: [
            { type: "relationship", key: "Piper", delta: 1 },
            { type: "relationship", key: "Camille", delta: 1 },
            { type: "relationship", key: "Theo", delta: 1 },
            { type: "flag", key: "thankedTeamBeforeTrap", value: true }
          ],
          next: "c07_bait"
        },
        {
          text: "Ask Vance if the official record will admit this was bait.",
          effects: [
            { type: "relationship", key: "Vance", delta: 1 },
            { type: "stat", key: "contractorPath", delta: 1 },
            { type: "flag", key: "askedVanceBaitRecord", value: true }
          ],
          next: "c07_bait"
        },
        {
          text: "Keep quiet. Let the role settle before the threat arrives.",
          effects: [
            { type: "stat", key: "restraint", delta: 1 },
            { type: "powerXp", amount: 1 },
            { type: "flag", key: "quietBeforeTrap", value: true }
          ],
          next: "c07_bait"
        }
      ]
    },
    c07_medbay_fallout: {
      chapter: 7,
      title: "Medical Does Not Blink",
      location: "Medical Wing",
      background: "aegis",
      focus: "Seth",
      text: [
        "Medical does not blink at blood, bruises, stasis residue, or the kind of silence that follows a fight everyone knows could have ended worse. They put you in a chair and start asking questions in the order that keeps people alive.",
        "Where did the power start? Where did it stop? Did you choose the stop, or did the stop choose itself? The medic does not judge the answers. That is worse, somehow. Judgment would give you something to push against.",
        "Outside the curtain, voices rise and fall. Piper wants in. Camille wants the report first. Theo wants numbers. Julian wants everyone to stop pretending wants are strategy."
      ],
      choices: [
        {
          text: "Ask for Piper first.",
          effects: [
            { type: "relationship", key: "Piper", delta: 2 },
            { type: "stat", key: "independentPath", delta: 1 },
            { type: "flag", key: "askedPiperMedbay", value: true }
          ],
          next: "c07_review_board"
        },
        {
          text: "Ask for Camille and the report.",
          effects: [
            { type: "relationship", key: "Camille", delta: 2 },
            { type: "stat", key: "control", delta: 1 },
            { type: "flag", key: "askedCamilleReport", value: true }
          ],
          next: "c07_review_board"
        },
        {
          text: "Ask for Theo's numbers before memory starts editing itself.",
          effects: [
            { type: "relationship", key: "Theo", delta: 2 },
            { type: "stat", key: "contractorPath", delta: 1 },
            { type: "flag", key: "askedTheoNumbers", value: true }
          ],
          next: "c07_review_board"
        }
      ]
    },
    c07_review_board: {
      chapter: 7,
      title: "Review Board",
      location: "Aegis Briefing Room",
      background: "aegis",
      focus: "Vance",
      text: [
        "The review board meets before the adrenaline has fully left your hands. Vance, two analysts, a legal observer, Camille, and a silent security officer sit around a table that looks built to make truth uncomfortable.",
        "They ask whether you believe you were in control. They ask whether you believe control is enough. They ask what you would do differently. Nobody asks whether you were scared. Aegis tends to treat fear as weather: relevant, measurable, not allowed to excuse structural failure.",
        "By the end, one fact is clear. Rhea was not only an attack. She was a test someone outside Aegis designed for you."
      ],
      choices: [
        {
          text: "Argue that control held where it mattered.",
          effects: [
            { type: "stat", key: "aegisTrust", delta: 1 },
            { type: "stat", key: "contractorPath", delta: 1 },
            { type: "flag", key: "arguedControlHeld", value: true }
          ],
          next: "c08_airbase"
        },
        {
          text: "Admit control is not enough without people who can call you back.",
          effects: [
            { type: "relationship", key: "Piper", delta: 1 },
            { type: "relationship", key: "Theo", delta: 1 },
            { type: "stat", key: "restraint", delta: 1 },
            { type: "flag", key: "admittedNeedTeam", value: true }
          ],
          next: "c08_airbase"
        },
        {
          text: "Ask why Vektor had enough information to build the test.",
          effects: [
            { type: "relationship", key: "Vance", delta: 1 },
            { type: "stat", key: "foundationPath", delta: 1 },
            { type: "flag", key: "askedVektorLeak", value: true }
          ],
          next: "c08_airbase"
        }
      ]
    },

    c07_group_process_vektor: {
      chapter: 7,
      title: "The Shape Of The Test",
      location: "Aegis Briefing Room",
      background: "aegis",
      focus: "Theo",
      variants: [
        {
          conditions: [{ type: "flag", key: "rheaErased" }],
          text: ["Nobody says the crater makes the answer harder. Nobody needs to. If Rhea was carrying part of Vektor's design, then part of the design died with her."]
        },
        {
          conditions: [{ type: "flag", key: "rheaContained" }],
          text: ["Rhea being alive does not make the room easier. It makes the room recursive: a prisoner, a test, a witness, and a threat all held in one containment field."]
        },
        {
          conditions: [{ type: "flag", key: "rheaEscaped" }],
          text: ["Rhea being loose turns every sentence into a countdown. Vektor designed the test, and one of its instruments walked away with notes."]
        },
        {
          conditions: [{ type: "flag", key: "piperRomance" }],
          text: ["Piper keeps close without touching you, as if the inches between you are the only polite thing left in the room."]
        },
        {
          conditions: [{ type: "flag", key: "camilleRomance" }],
          text: ["Camille's composure has gone narrow. It is not distance. It is anger given architecture."]
        },
        {
          conditions: [{ type: "flag", key: "julianRomance" }],
          text: ["Julian has stopped performing for the board. That is how you know the joke would cost too much right now."]
        },
        {
          conditions: [{ type: "flag", key: "theoRomance" }],
          text: ["Theo looks at you like every branch where this was preventable has become personally insulting."]
        }
      ],
      text: [
        "The review board adjourns, but nobody moves at first. Vektor designed the test for you. The phrase stays on the table after the tablets go dark.",
        "Piper breaks the silence with a quiet, furious laugh. Camille starts sorting the implications before anyone asks. Julian looks toward the door like the room itself might be compromised. Theo keeps replaying one line under his breath: designed, not improvised.",
        "The attack is over. The shape of it is not."
      ],
      choices: [
        {
          text: "Ask Theo what the designed test was trying to learn.",
          effects: [
            { type: "relationship", key: "Theo", delta: 2 },
            { type: "stat", key: "contractorPath", delta: 1 },
            { type: "flag", key: "askedTheoVektorDesign", value: true }
          ],
          next: "c07_vektor_processing"
        },
        {
          text: "Ask Camille what part of Aegis failed loudly enough for Vektor to hear.",
          effects: [
            { type: "relationship", key: "Camille", delta: 2 },
            { type: "stat", key: "foundationPath", delta: 1 },
            { type: "flag", key: "askedCamilleVektorLeak", value: true }
          ],
          next: "c07_vektor_processing"
        },
        {
          text: "Let Piper and Julian keep the room human before it becomes only evidence.",
          effects: [
            { type: "relationship", key: "Piper", delta: 1 },
            { type: "relationship", key: "Julian", delta: 1 },
            { type: "stat", key: "restraint", delta: 1 },
            { type: "flag", key: "keptVektorRoomHuman", value: true }
          ],
          next: "c07_vektor_processing"
        }
      ]
    },

    c08_hangar_ceiling: {
      chapter: 8,
      title: "Ceiling",
      location: "Aegis Hangar",
      background: "aegis",
      focus: "Seth",
      text: [
        "After the Mach test, Aegis gives you a hangar because no one wants to find out what the stored energy does in a dorm room. The space is huge, cold, and still too small for what sits inside you.",
        "Piper's impact has become a second sun under your ribs. It is not pain. It is promise, which may be more dangerous. Every breath teaches you how much force can fit inside a person who looks calm.",
        "Camille watches from the painted safety line. Theo watches the instruments. Julian watches you, which is somehow less comfortable than either."
      ],
      choices: [
        {
          text: "Bleed the energy into the grounding rig one careful layer at a time.",
          effects: [
            { type: "stat", key: "control", delta: 2 },
            { type: "powerXp", amount: 2 },
            { type: "flag", key: "groundedMachCarefully", value: true }
          ],
          next: "c08_friend_pressure"
        },
        {
          text: "Hold it longer than requested, just to learn the edge.",
          effects: [
            { type: "stat", key: "audacity", delta: 1 },
            { type: "stat", key: "aegisFear", delta: 1 },
            { type: "powerXp", amount: 3 },
            { type: "flag", key: "heldMachTooLong", value: true }
          ],
          next: "c08_friend_pressure"
        },
        {
          text: "Ask Piper to stay where you can see her while you release it.",
          effects: [
            { type: "relationship", key: "Piper", delta: 2 },
            { type: "stat", key: "resolve", delta: 1 },
            { type: "flag", key: "piperReleaseAnchor", value: true }
          ],
          next: "c08_friend_pressure"
        }
      ]
    },
    c08_friend_pressure: {
      chapter: 8,
      title: "The People Near The Blast",
      location: "Aegis Hangar",
      background: "aegis",
      focus: "Camille",
      text: [
        "The release leaves the hangar lights flickering and the instruments arguing with themselves. Nobody cheers. That matters. The people closest to you are learning not to confuse survival with success.",
        "Camille says the ceiling is higher than Aegis wants to admit. Theo says ceiling is the wrong metaphor. Piper says if anyone calls you an asset again, she is going to become a workplace incident. Julian offers to make the incident elegant.",
        "For a moment, affection and fear stand in the same room without pretending to be opposites."
      ],
      choices: [
        {
          text: "Tell them affection cannot be allowed to make you less accountable.",
          effects: [
            { type: "relationship", key: "Theo", delta: 1 },
            { type: "relationship", key: "Camille", delta: 1 },
            { type: "stat", key: "restraint", delta: 1 },
            { type: "flag", key: "accountableToFriends", value: true }
          ],
          next: "c08_private_threshold"
        },
        {
          text: "Tell them fear cannot be allowed to make you less alive.",
          effects: [
            { type: "relationship", key: "Piper", delta: 1 },
            { type: "relationship", key: "Julian", delta: 1 },
            { type: "stat", key: "independentPath", delta: 1 },
            { type: "flag", key: "fearNotLessAlive", value: true }
          ],
          next: "c08_private_threshold"
        },
        {
          text: "Ask what each of them would do if Aegis tried to lock you down.",
          effects: [
            { type: "stat", key: "exposure", delta: 1 },
            { type: "stat", key: "resolve", delta: 1 },
            { type: "flag", key: "askedLockdownQuestion", value: true }
          ],
          next: "c08_private_threshold"
        }
      ]
    },
    c08_stored_sun: {
      chapter: 8,
      title: "Stored Sun",
      location: "Aegis Hangar Corridor",
      background: "aegis",
      focus: "Seth",
      variants: [
        {
          conditions: [{ type: "flag", key: "machFive" }],
          text: ["Mach Five does not leave like a sound. It stays in you as a private weather system, bright and impossible, looking for a moral shape."]
        },
        {
          conditions: [{ type: "flag", key: "machThree" }],
          text: ["Mach Three was supposed to be a number on a test plan. Inside you, it feels less like data and more like proof that the ceiling moved again."]
        },
        {
          conditions: [{ type: "flag", key: "heldMachEnergy" }],
          text: ["Because you held the energy instead of showing it off, the pressure has nowhere theatrical to go. It becomes intimate, which may be worse."]
        },
        {
          conditions: [{ type: "flag", key: "kineticAurora" }],
          text: ["The harmless aurora is gone from the runway lights, but your skin remembers the ease of making impossible force beautiful."]
        },
        {
          conditions: [{ type: "powerIs", value: "gravity" }],
          text: ["Your power keeps translating the impact into weight: Piper's speed, the runway, your stance, the future trying to put mass on every choice."]
        },
        {
          conditions: [{ type: "powerIs", value: "chronal" }],
          text: ["Time around the impact still feels misfiled. One second stretched long enough to hold a person, a disaster, and a decision."]
        },
        {
          conditions: [{ type: "powerIs", value: "space" }],
          text: ["Distance no longer feels innocent. Piper crossed the runway; your power folded the consequence into your body; the map has not looked trustworthy since."]
        }
      ],
      text: [
        "The hangar corridor is quieter than the runway, which makes the energy inside you louder.",
        "Aegis staff give you space with the precision of people who have protocols for what not to say. Their restraint is professional. Their fear still has a temperature.",
        "You walk slowly because walking normally would feel dishonest. There is a sun under your ribs, and everyone who saw the catch is trying to decide whether it means safety or escalation."
      ],
      choices: [
        {
          text: "Name the feeling as fear before it can disguise itself as control.",
          effects: [
            { type: "stat", key: "restraint", delta: 1 },
            { type: "relationship", key: "Theo", delta: 1 },
            { type: "flag", key: "namedMachFear", value: true }
          ],
          next: "c08_witness_line"
        },
        {
          text: "Treat the stored force like data. Map what it does to your breathing, pulse, and focus.",
          effects: [
            { type: "stat", key: "control", delta: 1 },
            { type: "powerXp", amount: 1 },
            { type: "relationship", key: "Camille", delta: 1 },
            { type: "flag", key: "mappedStoredForce", value: true }
          ],
          next: "c08_witness_line"
        },
        {
          text: "Let yourself feel the wonder without immediately apologizing for it.",
          effects: [
            { type: "stat", key: "audacity", delta: 1 },
            { type: "relationship", key: "Piper", delta: 1 },
            { type: "relationship", key: "Julian", delta: 1 },
            { type: "flag", key: "allowedMachWonder", value: true }
          ],
          next: "c08_witness_line"
        }
      ]
    },
    c08_witness_line: {
      chapter: 8,
      title: "Witness Line",
      location: "Observation Rail",
      background: "aegis",
      focus: "Camille",
      variants: [
        {
          conditions: [{ type: "relationshipAtLeast", key: "Piper", value: 9 }],
          text: ["Piper keeps looking at her own hands like she is replaying the moment they became survivable in someone else's arms."]
        },
        {
          conditions: [{ type: "relationshipAtLeast", key: "Camille", value: 9 }],
          text: ["Camille watches the staff watching you. Her attention has become a blade pointed away from your back."]
        },
        {
          conditions: [{ type: "relationshipAtLeast", key: "Julian", value: 8 }],
          text: ["Julian tries three expressions before settling on no expression at all. Apparently even he has situations where the line read fails."]
        },
        {
          conditions: [{ type: "relationshipAtLeast", key: "Theo", value: 8 }],
          text: ["Theo has not stopped writing notes. The notes are not only about the test. Some of them are about how people looked at you afterward."]
        },
        {
          conditions: [{ type: "flag", key: "rheaEscaped" }],
          text: ["Rhea's absence sharpens every reaction. Nobody wants to admit they are comparing Piper's impact to the strike that got away."]
        }
      ],
      text: [
        "They line up at the observation rail without meaning to: Piper still flushed from the run, Camille too composed, Theo too pale, Julian too quiet.",
        "No one asks whether you are okay. The answer would be too small for what they watched.",
        "What they saw was not simply power. They saw you decide what happened to someone else's disaster after it entered your hands."
      ],
      choices: [
        {
          text: "Ask what they saw, not what the instruments recorded.",
          effects: [
            { type: "relationship", key: "Piper", delta: 1 },
            { type: "relationship", key: "Camille", delta: 1 },
            { type: "relationship", key: "Theo", delta: 1 },
            { type: "flag", key: "askedWitnessesWhatTheySaw", value: true }
          ],
          next: "c08_breath_between"
        },
        {
          text: "Ask what scared them most and do not defend yourself while they answer.",
          effects: [
            { type: "relationship", key: "Camille", delta: 1 },
            { type: "relationship", key: "Theo", delta: 1 },
            { type: "stat", key: "restraint", delta: 1 },
            { type: "flag", key: "askedWitnessFear", value: true }
          ],
          next: "c08_breath_between"
        },
        {
          text: "Make one bad joke so the room remembers you are still in it.",
          effects: [
            { type: "relationship", key: "Piper", delta: 1 },
            { type: "relationship", key: "Julian", delta: 1 },
            { type: "stat", key: "resolve", delta: 1 },
            { type: "flag", key: "jokedAfterMachWitness", value: true }
          ],
          next: "c08_breath_between"
        }
      ]
    },
    c08_breath_between: {
      chapter: 8,
      title: "The Breath Between",
      location: "Aegis Hangar",
      background: "aegis",
      focus: "Seth",
      variants: [
        {
          conditions: [{ type: "flag", key: "namedMachFear" }],
          text: ["Fear, once named, does not leave. It becomes easier to carry because it stops pretending to be the whole room."]
        },
        {
          conditions: [{ type: "flag", key: "mappedStoredForce" }],
          text: ["The numbers help. They do not comfort you, exactly, but they give the impossible edges you can touch without bleeding."]
        },
        {
          conditions: [{ type: "flag", key: "allowedMachWonder" }],
          text: ["The wonder is still there, stubborn and bright. You understand why Aegis distrusts it. You also understand why you need it."]
        }
      ],
      text: [
        "The threshold report waits on your tablet. Aegis wants categories: stable, elevated, controlled, concerning. It does not have a checkbox for feeling more human and less containable at the same time.",
        "For a few minutes, nobody asks anything from you. The hangar breathes around the stored force. Your body keeps proving it can hold more than your vocabulary can.",
        "Soon you will have to translate the experience into something Aegis can store. Before that, you get one honest breath."
      ],
      choices: [
        {
          text: "Bleed one harmless thread of force into the grounding line and watch it vanish.",
          effects: [
            { type: "stat", key: "control", delta: 1 },
            { type: "powerXp", amount: 1 },
            { type: "status", key: "energy", value: "Kinetic reserve tapering" },
            { type: "flag", key: "bledThreadBeforeReport", value: true }
          ],
          next: "c08_rina_wall"
        },
        {
          text: "Keep it banked a little longer. You need to know what carrying it does to you.",
          effects: [
            { type: "stat", key: "audacity", delta: 1 },
            { type: "stat", key: "aegisFear", delta: 1 },
            { type: "powerXp", amount: 1 },
            { type: "flag", key: "carriedMachIntoReport", value: true }
          ],
          next: "c08_rina_wall"
        },
        {
          text: "Write the first sentence of the report before Aegis can write it for you.",
          effects: [
            { type: "stat", key: "restraint", delta: 1 },
            { type: "stat", key: "contractorPath", delta: 1 },
            { type: "flag", key: "startedOwnMachReport", value: true }
          ],
          next: "c08_rina_wall"
        }
      ]
    },
    c08_private_threshold: {
      chapter: 8,
      title: "Private Threshold",
      location: "Residence Wing",
      background: "aegis",
      focus: "Seth",
      text: [
        "That night, your room feels smaller than it did on arrival. Not because Aegis changed it. Because you did. Power has a way of making walls look like opinions.",
        "Your tablet asks for a self-assessment. Rate perceived control. Rate stress. Rate urge to discharge. Rate confidence in post-graduation placement. The numbers look ridiculous, then useful, then ridiculous again.",
        "You answer anyway, because the future is beginning to ask for receipts."
      ],
      choices: [
        {
          text: "Report honestly, even where the answers look bad.",
          effects: [
            { type: "stat", key: "aegisTrust", delta: 1 },
            { type: "stat", key: "control", delta: 1 },
            { type: "flag", key: "honestThresholdReport", value: true }
          ],
          next: "c09_graduation_eve"
        },
        {
          text: "Write the report Aegis can handle and keep the rest for yourself.",
          effects: [
            { type: "stat", key: "independentPath", delta: 1 },
            { type: "stat", key: "restraint", delta: 1 },
            { type: "flag", key: "editedThresholdReport", value: true }
          ],
          next: "c09_graduation_eve"
        },
        {
          text: "Send the real version to Theo and the official version to Aegis.",
          conditions: [{ type: "relationshipAtLeast", key: "Theo", value: 5 }],
          effects: [
            { type: "relationship", key: "Theo", delta: 2 },
            { type: "stat", key: "contractorPath", delta: 1 },
            { type: "flag", key: "theoHasRealThreshold", value: true }
          ],
          next: "c09_graduation_eve"
        }
      ]
    },

    c09_packing: {
      chapter: 9,
      title: "Packing",
      location: "Residence Wing",
      background: "aegis",
      focus: "Seth",
      text: [
        "Packing takes less time than expected. Aegis gave you a room, not a life. Still, objects collect meaning when they survive a crisis with you: the intake tablet, the training jacket, the keycard with its worn edge, the cup Piper stole and insisted was communal now.",
        "Every item asks what kind of future it belongs to. Hero. Contractor. Fugitive. Founder. Civilian. Villain, if the story is told by someone who needed you obedient.",
        "The suitcase stays open on the bed while messages arrive faster than you answer them."
      ],
      choices: [
        {
          text: "Pack the Aegis jacket. You earned it, even if you outgrow it.",
          effects: [
            { type: "stat", key: "heroPath", delta: 1 },
            { type: "relationship", key: "Vance", delta: 1 },
            { type: "flag", key: "packedAegisJacket", value: true }
          ],
          next: "c09_graduation_eve"
        },
        {
          text: "Leave the jacket folded on the bed.",
          effects: [
            { type: "stat", key: "independentPath", delta: 1 },
            { type: "stat", key: "resolve", delta: 1 },
            { type: "flag", key: "leftAegisJacket", value: true }
          ],
          next: "c09_graduation_eve"
        },
        {
          text: "Pack only what you would carry if you had to run tonight.",
          effects: [
            { type: "stat", key: "villainPath", delta: 1 },
            { type: "stat", key: "restraint", delta: 1 },
            { type: "flag", key: "packedRunBag", value: true }
          ],
          next: "c09_graduation_eve"
        }
      ]
    },
    c09_last_messages: {
      chapter: 9,
      title: "Last Messages",
      location: "Residence Wing",
      background: "aegis",
      focus: "Seth",
      text: [
        "The last night fills with messages nobody quite knows how to send. Piper sends a rooftop photo with no caption. Camille sends a clean list of legal vulnerabilities in post-graduation contracts. Julian sends an invitation to trouble disguised as dinner. Theo sends a document titled if this becomes a bad idea.",
        "None of them say goodbye. Aegis has trained everyone too well for that. Goodbye sounds like admitting the structure mattered.",
        "You read each message twice and begin to understand that relationships are not side routes. They are infrastructure."
      ],
      choices: [
        {
          text: "Answer Piper first. Some futures need a getaway driver.",
          effects: [
            { type: "relationship", key: "Piper", delta: 2 },
            { type: "stat", key: "independentPath", delta: 1 },
            { type: "flag", key: "answeredPiperLastNight", value: true }
          ],
          next: "c09_plan_reveal"
        },
        {
          text: "Answer Camille first. Some futures need architecture.",
          effects: [
            { type: "relationship", key: "Camille", delta: 2 },
            { type: "stat", key: "foundationPath", delta: 1 },
            { type: "flag", key: "answeredCamilleLastNight", value: true }
          ],
          next: "c09_plan_reveal"
        },
        {
          text: "Answer Theo first. Some futures need a conscience with admin access.",
          effects: [
            { type: "relationship", key: "Theo", delta: 2 },
            { type: "stat", key: "contractorPath", delta: 1 },
            { type: "flag", key: "answeredTheoLastNight", value: true }
          ],
          next: "c09_plan_reveal"
        }
      ]
    },
    c09_three_before_roof: {
      chapter: 9,
      title: "Three Before The Roof",
      location: "Residence Hall",
      background: "aegis",
      focus: "Camille",
      variants: [
        {
          conditions: [{ type: "flag", key: "answeredCamilleLastNight" }],
          text: ["Because you answered Camille first, she arrives with fewer preambles than usual. That might be the closest she comes to admitting relief in public."]
        },
        {
          conditions: [{ type: "flag", key: "answeredTheoLastNight" }],
          text: ["Because you answered Theo first, he has already revised his checklist twice and apologized for one of the revisions without showing you which one."]
        },
        {
          conditions: [{ type: "flag", key: "answeredPiperLastNight" }],
          text: ["Because you answered Piper first, Julian makes a show of checking whether everyone else has been emotionally abandoned in a speedster-shaped priority queue."]
        },
        {
          conditions: [{ type: "flag", key: "camilleCommitted" }],
          text: ["Camille's goodbye has weight because it is not only strategic. She lets you see that, which costs her more than the words do."]
        },
        {
          conditions: [{ type: "flag", key: "julianCommitted" }],
          text: ["Julian's jokes keep circling the thing he wants to say until even he gets tired of the orbit."]
        },
        {
          conditions: [{ type: "flag", key: "theoCommitted" }],
          text: ["Theo stands close enough that the promise between you becomes part of the hallway architecture."]
        },
        {
          conditions: [
            { type: "relationshipAtLeast", key: "Camille", value: 8 },
            { type: "notFlag", key: "camilleCommitted" }
          ],
          text: ["Camille gives you a final operational warning with enough personal concern under it to make both of you pretend not to notice."]
        },
        {
          conditions: [
            { type: "relationshipAtLeast", key: "Julian", value: 8 },
            { type: "notFlag", key: "julianCommitted" }
          ],
          text: ["Julian offers to make your future look deliberate even if it begins as panic with better lighting."]
        },
        {
          conditions: [
            { type: "relationshipAtLeast", key: "Theo", value: 8 },
            { type: "notFlag", key: "theoCommitted" }
          ],
          text: ["Theo does not call it a goodbye. He calls it continuity planning, which fools nobody and helps him breathe."]
        }
      ],
      text: [
        "Camille, Julian, and Theo catch you in the residence hall before the roof can claim the last word.",
        "It should be a small thing: three people, one hallway, graduation in the morning. Instead it feels like the last quiet room before every future gets loud.",
        "Piper has a rooftop waiting. These three have a different kind of gravity: architecture, story, and conscience, all asking what shape you will keep when Aegis stops supervising the answer."
      ],
      choices: [
        {
          text: "Tell Camille the future needs someone willing to make care structural.",
          conditions: [{ type: "relationshipAtLeast", key: "Camille", value: 5 }],
          effects: [
            { type: "relationship", key: "Camille", delta: 1 },
            { type: "stat", key: "foundationPath", delta: 1 },
            { type: "flag", key: "camilleFarewellWeight", value: true }
          ],
          next: "c09_last_private_moments"
        },
        {
          text: "Tell Julian the honest story matters more than the clean one.",
          conditions: [{ type: "relationshipAtLeast", key: "Julian", value: 5 }],
          effects: [
            { type: "relationship", key: "Julian", delta: 1 },
            { type: "stat", key: "independentPath", delta: 1 },
            { type: "flag", key: "julianFarewellWeight", value: true }
          ],
          next: "c09_last_private_moments"
        },
        {
          text: "Tell Theo the safeguards matter because people matter.",
          conditions: [{ type: "relationshipAtLeast", key: "Theo", value: 5 }],
          effects: [
            { type: "relationship", key: "Theo", delta: 1 },
            { type: "stat", key: "restraint", delta: 1 },
            { type: "flag", key: "theoFarewellWeight", value: true }
          ],
          next: "c09_last_private_moments"
        },
        {
          text: "Let the three of them stand with you without turning it into a pitch.",
          effects: [
            { type: "relationship", key: "Camille", delta: 1 },
            { type: "relationship", key: "Julian", delta: 1 },
            { type: "relationship", key: "Theo", delta: 1 },
            { type: "flag", key: "sharedThreeFarewell", value: true }
          ],
          next: "c09_last_private_moments"
        }
      ]
    },
    c09_sleep_or_not: {
      chapter: 9,
      title: "Sleep Or Something Like It",
      location: "Residence Wing",
      background: "aegis",
      focus: "Seth",
      text: [
        "Sleep does not come cleanly. It arrives in pieces: ten minutes of dark, a flash of Rhea's smile, the pressure of Piper's impact, Camille's voice saying acceptable, Theo's hands shaking around a tablet, Julian laughing too late.",
        "The power stays quiet. That almost scares you more. Quiet can mean stable. Quiet can mean waiting.",
        "By dawn, you have not solved the future. You have only decided you are done letting other people name it first."
      ],
      choices: [
        {
          text: "Start graduation day with the official plan intact.",
          effects: [
            { type: "stat", key: "aegisTrust", delta: 1 },
            { type: "stat", key: "restraint", delta: 1 },
            { type: "flag", key: "officialPlanDawn", value: true }
          ],
          next: "c10_graduation"
        },
        {
          text: "Start graduation day with an exit plan.",
          effects: [
            { type: "stat", key: "independentPath", delta: 1 },
            { type: "stat", key: "resolve", delta: 1 },
            { type: "flag", key: "exitPlanDawn", value: true }
          ],
          next: "c10_graduation"
        },
        {
          text: "Start graduation day with no promises you do not mean.",
          effects: [
            { type: "stat", key: "civilianPath", delta: 1 },
            { type: "stat", key: "control", delta: 1 },
            { type: "flag", key: "noFalsePromisesDawn", value: true }
          ],
          next: "c10_graduation"
        }
      ]
    },

    c10_before_stage: {
      chapter: 10,
      title: "Before The Folder",
      location: "Aegis Atrium",
      background: "graduation",
      focus: "Seth",
      text: [
        "The atrium has been transformed by chairs, flowers, banners, and the collective decision to pretend institutional ceremonies make dangerous transitions orderly.",
        "Families cluster near the back. Sponsors stand near the front. Staff move like stagehands. Residents who spent months learning not to explode now adjust collars, smooth jackets, and make jokes with too much force behind them.",
        "Your folder waits on the table with your name on it. Paper should not feel heavy. This paper does."
      ],
      choices: [
        {
          text: "Find Piper before the ceremony starts.",
          effects: [
            { type: "relationship", key: "Piper", delta: 1 },
            { type: "flag", key: "foundPiperBeforeStage", value: true }
          ],
          next: "c10_graduation"
        },
        {
          text: "Find Camille before the ceremony starts.",
          effects: [
            { type: "relationship", key: "Camille", delta: 1 },
            { type: "flag", key: "foundCamilleBeforeStage", value: true }
          ],
          next: "c10_graduation"
        },
        {
          text: "Stand alone and let the room look at what it helped make.",
          effects: [
            { type: "stat", key: "resolve", delta: 1 },
            { type: "flag", key: "stoodAloneBeforeStage", value: true }
          ],
          next: "c10_graduation"
        }
      ]
    },
    c10_goodbyes: {
      chapter: 10,
      title: "Goodbyes In Disguise",
      location: "Aegis Atrium",
      background: "graduation",
      focus: "Piper",
      text: [
        "After the ceremony, nobody says goodbye honestly. They say see you at dinner, send me the file, do not sign anything without me, try not to get arrested before dessert.",
        "Vance gives you the folder and holds your eye a second longer than the ceremony requires. Maybe warning. Maybe respect. Maybe the exact blend Aegis considers mentorship.",
        "Piper bumps your shoulder. Camille checks the exits. Julian complains about the lighting. Theo watches your folder like it might start a fire."
      ],
      choices: [
        {
          text: "Keep the group together and move toward dinner.",
          effects: [
            { type: "relationship", key: "Piper", delta: 1 },
            { type: "relationship", key: "Camille", delta: 1 },
            { type: "relationship", key: "Julian", delta: 1 },
            { type: "relationship", key: "Theo", delta: 1 },
            { type: "flag", key: "keptGroupTogether", value: true }
          ],
          next: "c10_dinner_reveal"
        },
        {
          text: "Ask Vance whether he believes the folder tells the truth.",
          effects: [
            { type: "relationship", key: "Vance", delta: 2 },
            { type: "stat", key: "contractorPath", delta: 1 },
            { type: "flag", key: "askedVanceFolderTruth", value: true }
          ],
          next: "c10_dinner_reveal"
        },
        {
          text: "Slip the folder into your bag unopened.",
          effects: [
            { type: "stat", key: "independentPath", delta: 1 },
            { type: "stat", key: "resolve", delta: 1 },
            { type: "flag", key: "folderUnopened", value: true }
          ],
          next: "c10_dinner_reveal"
        }
      ]
    },
    c10_last_vote: {
      chapter: 10,
      title: "Last Vote",
      location: "Private Restaurant",
      background: "city",
      focus: "Theo",
      text: [
        "The dinner table has become a government with terrible bylaws. Everyone has a vote. Nobody has authority. That might be why it feels more honest than Aegis.",
        "Piper wants freedom with teeth. Camille wants structure sturdy enough to survive contact with money. Julian wants spectacle because spectacle controls where people look. Theo wants a failsafe that cannot be turned into a leash.",
        "They are not asking you to become smaller. They are asking what will keep power from eating the reasons you wanted it."
      ],
      choices: [
        {
          text: "Promise the future gets guardrails before it gets branding.",
          effects: [
            { type: "stat", key: "restraint", delta: 1 },
            { type: "relationship", key: "Theo", delta: 1 },
            { type: "relationship", key: "Camille", delta: 1 },
            { type: "flag", key: "guardrailsBeforeBranding", value: true }
          ],
          next: "c10_final_path"
        },
        {
          text: "Promise the future stays free before it becomes respectable.",
          effects: [
            { type: "stat", key: "independentPath", delta: 1 },
            { type: "relationship", key: "Piper", delta: 1 },
            { type: "relationship", key: "Julian", delta: 1 },
            { type: "flag", key: "freedomBeforeRespectable", value: true }
          ],
          next: "c10_final_path"
        },
        {
          text: "Give Camille authority to design the guardrails before anyone starts improvising.",
          effects: [
            { type: "relationship", key: "Camille", delta: 2 },
            { type: "stat", key: "foundationPath", delta: 1 },
            { type: "flag", key: "camilleAdvisor", value: true },
            { type: "flag", key: "guardrailsBeforeImpulse", value: true }
          ],
          next: "c10_final_path"
        },
        {
          text: "Make the line plain: anyone who tries to own you gets an example.",
          effects: [
            { type: "relationship", key: "Piper", delta: 1 },
            { type: "relationship", key: "Julian", delta: 1 },
            { type: "stat", key: "aegisFear", delta: 1 },
            { type: "stat", key: "villainPath", delta: 1 },
            { type: "flag", key: "dontFuckWithUs", value: true },
            { type: "flag", key: "ownershipWarning", value: true }
          ],
          next: "c10_final_path"
        },
        {
          text: "Promise nothing except that you will choose in the open.",
          effects: [
            { type: "stat", key: "resolve", delta: 1 },
            { type: "stat", key: "civilianPath", delta: 1 },
            { type: "flag", key: "chooseInOpen", value: true }
          ],
          next: "c10_final_path"
        }
      ]
    }
  });

  redirect("c01_lounge", "c02_baseline_intro", "c01_room_assignment");
  redirect("c01_first_morning", "c02_baseline_intro", "c02_observation_deck");
  redirect("c02_gym", "c03_observe", "c02_control_lab");
  redirect("c02_residence_after", "c03_observe", "c03_gallery_pressure");
  redirect("c03_observe", "c03_observations", "c03_after_gallery");
  redirect("c03_piper_door", "c04_anchor", "c03_private_notes");
  redirect("c04_anchor", "c04_camille_test", "c04_pre_sim");
  redirect("c04_construct", "c04_second_wave", "c04_medical_scan");
  redirect("c04_second_wave", "c05_dock_setup", "c04_debrief");
  redirect("c04_debrief", "c05_dock_setup", "c05_blind_spot");
  redirect("c05_dock_setup", "c05_flight", "c05_waterline");
  redirect("c05_relationship", "c06_event_horizon", "c05_rooftop_after");
  redirect("c05_rooftop_after", "c05_relationship", "c06_blackwater_drive");
  redirect("c06_after_rhea", "c07_bait", "c06_aftershock");
  redirect("c06_aftershock", "c06_after_rhea", "c06_apartment_board");
  redirect("c06_apartment_board", "c07_bait", "c07_before_bait");
  redirect("c07_afteraction_erased", "c08_airbase", "c07_medbay_fallout");
  redirect("c07_afteraction_contained", "c08_airbase", "c07_medbay_fallout");
  redirect("c07_afteraction_escaped", "c08_airbase", "c07_medbay_fallout");
  redirect("c07_review_board", "c08_airbase", "c07_group_process_vektor");
  redirect("c08_mach5", "c09_graduation_eve", "c08_hangar_ceiling");
  redirect("c08_friend_pressure", "c08_private_threshold", "c08_stored_sun");
  redirect("c09_graduation_eve", "c09_walk_piper", "c09_packing");
  redirect("c09_packing", "c09_graduation_eve", "c09_last_messages");
  redirect("c09_last_messages", "c09_plan_reveal", "c09_walk_piper");
  redirect("c09_last_messages", "c09_walk_piper", "c09_three_before_roof");
  redirect("c09_plan_reveal", "c10_graduation", "c09_sleep_or_not");
  redirect("c09_sleep_or_not", "c10_graduation", "c10_before_stage");
  redirect("c10_graduation", "c10_dinner_reveal", "c10_goodbyes");
  redirect("c10_reactions", "c10_final_path", "c10_last_vote");
})();

/* AUTHORING_PACKS_REDIRECTS_START */
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

  function retargetAllChoices(sceneId, to) {
    const scene = scenes[sceneId];
    if (!scene || !scene.choices) return;
    scene.choices.forEach((choice) => {
      choice.next = to;
    });
  }

  redirect("c01_arrival", "c01_orientation", "add_c01_intake_overlap_to_orientation");
  redirect("c01_arrival", "c01_shortcuts", "add_c01_intake_overlap_to_shortcuts");
  redirect("c01_arrival", "c01_camille_first", "add_c01_intake_overlap_to_camille");
  redirect("c01_orientation", "c01_lounge", "add_c01_after_orientation_group");
  redirect("c01_room_assignment", "c01_intake_night", "add_c01_common_room_night");

  redirect("c02_baseline_intro", "c02_after", "add_c02_after_baseline_reactivity");
  redirect("c02_control_lab", "c02_residence_after", "add_c02_control_lab_fallout");

  redirect("c02_residence_after", "c03_deep_invitation", "add_c03_admin_notice_board");
  redirect("c02_residence_after", "c03_hub_gallery", "add_c03_admin_notice_board");

  retargetAllChoices("add_c03_residence_kitchen_after_reports", "add_c04_anchor_afterhours");
  redirect("c03_private_notes", "c04_deep_solo", "add_c03_residence_kitchen_after_reports");
  redirect("c03_private_notes", "c04_hub_training", "add_c03_residence_kitchen_after_reports");

  redirect("c04_debrief", "c05_deep_after", "add_c04_debrief_crosscurrents");
  redirect("c04_debrief", "c05_hub_dock", "add_c04_debrief_crosscurrents");

  redirect("c05_after_flight", "c05_relationship", "add_c05_infirmary_after");
  redirect("c05_rooftop_after", "c06_deep_permission", "add_c05_residence_kitchen_return");
  redirect("c05_rooftop_after", "c06_hub_event", "add_c05_residence_kitchen_return");
  redirect("c05_rooftop_after", "c06_event_horizon", "add_c05_residence_kitchen_return");

  redirect("c06_aftershock", "c06_apartment_board", "add_c06_blackwater_aftershock");
  redirect("c06_rhea_arrives", "c06_after_rhea", "add_c06_rhea_floor_freeze");
  redirect("c06_apartment_board", "c07_bait", "add_c06_apartment_board_night");
  redirect("c06_apartment_board", "c07_deep_morning", "add_c06_apartment_board_night");
  redirect("c06_apartment_board", "c07_hub_bait", "add_c06_apartment_board_night");

  redirect("c07_deep_morning", "c07_deep_fallout", "add_c07_morning_kitchen_fallout");
  redirect("add_c07_bait_conscience_expanded", "c07_before_bait", "add_c07_before_bait_fracture");
  redirect("c07_afteraction_erased", "c07_medbay_fallout", "add_c07_afteraction_kitchen");
  redirect("c07_afteraction_contained", "c07_medbay_fallout", "add_c07_afteraction_kitchen");
  redirect("c07_afteraction_escaped", "c07_medbay_fallout", "add_c07_afteraction_kitchen");

  redirect("c07_jordan_signal", "c08_deep_review", "add_c08_hangar_arrival");
  redirect("c07_jordan_signal", "c08_hub_airbase", "add_c08_hangar_arrival");
  redirect("c08_rina_wall", "c08_private_threshold", "add_c08_afterburn_corridor");
  redirect("c08_stored_sun", "c08_private_threshold", "add_c08_afterburn_corridor");

  redirect("c09_packing", "c09_graduation_eve", "add_c09_before_pizza_threshold");
  redirect("c09_last_messages", "c09_plan_reveal", "add_c09_after_messages_table");
  redirect("add_c09_after_messages_table", "c09_plan_reveal", "add_c09_final_shared_kitchen");
  redirect("c09_last_private_moments", "c09_private_camille", "add_c09_camille_service_stair");
  redirect("c09_last_private_moments", "c09_private_julian", "add_c09_julian_packing_show_v2");
  redirect("c09_last_private_moments", "c09_private_theo", "add_c09_theo_archive_walk");
  redirect("c09_private_camille", "c09_walk_piper", "add_c09_piper_rooftop_long");
  redirect("c09_private_julian", "c09_walk_piper", "add_c09_piper_rooftop_long");
  redirect("c09_private_theo", "c09_walk_piper", "add_c09_piper_rooftop_long");
  redirect("c09_private_shared", "c09_walk_piper", "add_c09_piper_rooftop_long");
  redirect("add_c09_camille_service_stair", "c09_walk_piper", "add_c09_piper_rooftop_long");
  redirect("add_c09_julian_packing_show_v2", "c09_last_private_moments", "add_c09_piper_rooftop_long");
  redirect("add_c09_theo_archive_walk", "c09_last_private_moments", "add_c09_piper_rooftop_long");

  redirect("c10_before_stage", "c10_graduation", "add_c10_backstage_core_four");
  redirect("c10_graduation", "c10_goodbyes", "add_c10_after_stage_service_corridor");
  redirect("c10_goodbyes", "c10_dinner_reveal", "add_c10_restaurant_anteroom");
})();
/* AUTHORING_PACKS_REDIRECTS_END */
