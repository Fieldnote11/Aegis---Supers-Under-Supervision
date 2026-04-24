(function() {
  const STORY = window.AEGIS_STORY;
  const HUBS = window.AEGIS_HUBS;
  if (!STORY || !HUBS) return;

  const scenes = STORY.scenes;

  function chapterWindow(chapter) {
    return [{ type: "chapterAtLeast", value: chapter }, { type: "chapterBefore", value: chapter + 1 }];
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

  function addVariants(sceneId, variants) {
    const scene = scenes[sceneId];
    if (!scene) return;
    scene.variants = scene.variants || [];
    scene.variants.push(...variants);
  }

  function choice(text, effects, extra = {}) {
    return {
      text,
      effects: effects || [],
      timeMinutes: extra.timeMinutes || 20,
      next: extra.next
    };
  }

  function addArcPack(pack) {
    const secondId = `${pack.id}_turn`;
    scenes[pack.id] = {
      chapter: pack.chapter,
      title: pack.title,
      location: pack.location,
      background: pack.background || "aegis",
      focus: pack.focus || "Seth",
      variants: pack.variants || [],
      text: pack.openText,
      choices: pack.openChoices.map((item) => choice(item.text, item.effects, { timeMinutes: item.timeMinutes || 20, next: secondId }))
    };

    scenes[secondId] = {
      chapter: pack.chapter,
      title: pack.turnTitle || pack.title,
      location: pack.location,
      background: pack.background || "aegis",
      focus: pack.turnFocus || pack.focus || "Seth",
      variants: pack.turnVariants || [],
      text: pack.turnText,
      choices: pack.closeChoices.map((item) => choice(item.text, item.effects, { timeMinutes: item.timeMinutes || 20, next: pack.returnScene }))
    };

    addActions(pack.locationId, [{
      id: pack.actionId || pack.id,
      label: pack.label,
      detail: pack.detail,
      once: pack.once !== false,
      hidden: Boolean(pack.hidden),
      conditions: [...chapterWindow(pack.chapter), ...(pack.conditions || [])],
      timeMinutes: pack.actionMinutes || 10,
      fatigue: typeof pack.fatigue === "number" ? pack.fatigue : 0.2,
      nextScene: pack.id
    }]);
  }

  function addTrainingPack(pack) {
    scenes[pack.id] = {
      chapter: pack.chapter,
      title: pack.title,
      location: pack.location,
      background: pack.background || "sim",
      focus: "Seth",
      variants: [
        { conditions: [{ type: "powerIs", value: "energy" }], text: pack.power.energy },
        { conditions: [{ type: "powerIs", value: "gravity" }], text: pack.power.gravity },
        { conditions: [{ type: "powerIs", value: "chronal" }], text: pack.power.chronal },
        { conditions: [{ type: "powerIs", value: "bio" }], text: pack.power.bio },
        { conditions: [{ type: "powerIs", value: "tech" }], text: pack.power.tech },
        { conditions: [{ type: "powerIs", value: "space" }], text: pack.power.space }
      ],
      text: pack.text,
      choices: pack.choices.map((item) => choice(item.text, item.effects, { timeMinutes: item.timeMinutes || 30, next: pack.returnScene }))
    };

    addActions(pack.locationId, [{
      id: pack.actionId || pack.id,
      label: pack.label,
      detail: pack.detail,
      repeatLimit: pack.repeatLimit || 2,
      conditions: [...chapterWindow(pack.chapter), ...(pack.conditions || [])],
      timeMinutes: pack.actionMinutes || 45,
      fatigue: typeof pack.fatigue === "number" ? pack.fatigue : 1.5,
      nextScene: pack.id
    }]);
  }

  addExits("cafeteria", ["blackwater_infirmary"]);
  addExits("common_lounge", ["rooftop"]);
  addExits("briefing_room", ["medical", "records_annex"]);

  [
    {
      id: "vol_c01_vance_intake_threshold",
      chapter: 1,
      title: "Vance, Intake Gravity",
      location: "Intake Hall",
      locationId: "security_desk",
      focus: "Vance",
      label: "Ask Vance about the intake rules",
      detail: "He is watching the first hour like it will become evidence later.",
      returnScene: "c01_hub_return_lecture",
      openText: [
        "Vance stands near the security desk with a tablet in one hand and a paper folder in the other, which somehow makes him look more dangerous than if he were carrying a weapon. The desk officer gives him updates in clipped sentences. He answers with shorter ones.",
        "When you approach, he does not soften. He does, however, angle his body so you are no longer speaking across the desk like a problem being processed.",
        "\"You want the version of the rules that fits on a poster,\" he says. \"Or the version that keeps people alive when the poster catches fire?\""
      ],
      openChoices: [
        { text: "Ask for the alive version, even if it sounds worse.", effects: [{ type: "relationship", key: "Vance", delta: 1 }, { type: "npc", key: "Vance", respect: 1, memory: "You asked for the hard version of intake before you had leverage." }, { type: "flag", key: "volVanceAliveVersion", value: true }] },
        { text: "Ask what residents usually misunderstand first.", effects: [{ type: "stat", key: "control", delta: 1 }, { type: "npc", key: "Vance", trust: 1, memory: "You asked Vance where new residents go wrong instead of asking how to look good." }, { type: "flag", key: "volVanceFirstMistake", value: true }] },
        { text: "Tell him rules get dangerous when nobody explains their purpose.", effects: [{ type: "stat", key: "independentPath", delta: 1 }, { type: "npc", key: "Vance", respect: 1, friction: 1, memory: "You challenged Vance on rule-making before he had decided whether you were teachable." }, { type: "flag", key: "volVanceRulePurpose", value: true }] }
      ],
      turnText: [
        "Vance looks at the intake floor. A blonde speedster is arguing with a vending machine. Two residents are comparing door locks. Someone laughs too loudly near Medical and then apologizes to nobody in particular.",
        "\"People think Aegis is here to make them obedient,\" he says. \"Obedience is brittle. I need judgment. Judgment keeps working after the first plan fails.\"",
        "He taps the folder once. Your name is on the tab. He has read more about you than he says, and less than everyone pretends."
      ],
      turnVariants: [
        { conditions: [{ type: "flag", key: "volVanceRulePurpose" }], text: ["Because you pushed on rules, Vance gives you the kind of look instructors save for difficult students who might become useful if they survive their own questions."] }
      ],
      closeChoices: [
        { text: "Tell him you can work with judgment better than obedience.", effects: [{ type: "relationship", key: "Vance", delta: 1 }, { type: "stat", key: "aegisTrust", delta: 1 }, { type: "flag", key: "volVanceJudgmentLine", value: true }] },
        { text: "Ask what happens when judgment disagrees with command.", effects: [{ type: "stat", key: "resolve", delta: 1 }, { type: "npc", key: "Vance", respect: 1, friction: 1 }, { type: "flag", key: "volVanceCommandQuestion", value: true }] },
        { text: "Say nothing and let the warning settle where it belongs.", effects: [{ type: "stat", key: "restraint", delta: 1 }, { type: "flag", key: "volVanceWarningSettled", value: true }] }
      ]
    },
    {
      id: "vol_c01_camille_julian_after_rules",
      chapter: 1,
      title: "Camille And Julian, First Read",
      location: "Lecture Hall A",
      locationId: "lecture_hall",
      focus: "Camille",
      label: "Stay near Camille and Julian after orientation",
      detail: "They are not whispering, which may be worse.",
      returnScene: "c01_hub_return_lecture",
      openText: [
        "The lecture hall empties around official language: stabilization, cohort, consent, liability, graduation pathways. Camille remains by the second row with her tablet closed. Julian remains because Camille remains, or because leaving last gives him a better exit line.",
        "\"The intake presentation always forgets tone,\" Julian says. \"They say support and everybody hears surveillance with snacks.\"",
        "Camille gives him one look. \"Some of them hear correctly.\""
      ],
      openChoices: [
        { text: "Ask Camille what the presentation deliberately avoided.", effects: [{ type: "relationship", key: "Camille", delta: 1 }, { type: "npc", key: "Camille", respect: 1, memory: "You asked Camille for the omitted truth instead of the flattering one." }, { type: "flag", key: "volCamilleOmittedTruth", value: true }] },
        { text: "Ask Julian whether jokes are cover or calibration.", effects: [{ type: "relationship", key: "Julian", delta: 1 }, { type: "npc", key: "Julian", trust: 1, memory: "You treated Julian's humor as a tool with a cost." }, { type: "flag", key: "volJulianJokeCalibration", value: true }] },
        { text: "Tell them both you hate being summarized before anyone has met you.", effects: [{ type: "relationship", key: "Camille", delta: 1 }, { type: "relationship", key: "Julian", delta: 1 }, { type: "stat", key: "resolve", delta: 1 }, { type: "flag", key: "volHatesSummary", value: true }] }
      ],
      turnText: [
        "Camille studies you with controlled interest. Julian studies Camille studying you and has the decency to look entertained by his own nosiness.",
        "\"Files are useful,\" Camille says. \"They are also lazy. They preserve the moment someone lost control and ask everyone else to pretend that was the whole person.\"",
        "Julian's smile thins. \"Beautifully said. Terrible institutional hobby.\""
      ],
      turnVariants: [
        { conditions: [{ type: "flag", key: "volJulianJokeCalibration" }], text: ["Julian keeps the next joke behind his teeth for half a beat. That restraint tells you more than the joke would have."] }
      ],
      closeChoices: [
        { text: "Tell Camille you want people around you who can spot lazy analysis.", effects: [{ type: "relationship", key: "Camille", delta: 1 }, { type: "npc", key: "Camille", trust: 1 }, { type: "flag", key: "volCamilleLazyAnalysis", value: true }] },
        { text: "Tell Julian his hobby seems to be making laziness louder.", effects: [{ type: "relationship", key: "Julian", delta: 1 }, { type: "npc", key: "Julian", respect: 1, friction: 1 }, { type: "flag", key: "volJulianLoudLaziness", value: true }] },
        { text: "Admit your file is not wrong, just incomplete in a way that scares you.", effects: [{ type: "relationship", key: "Camille", delta: 1 }, { type: "relationship", key: "Julian", delta: 1 }, { type: "npc", key: "Camille", concern: 1 }, { type: "npc", key: "Julian", trust: 1 }, { type: "flag", key: "volFileIncompleteFear", value: true }] }
      ]
    },
    {
      id: "vol_c01_ben_residence_noise",
      chapter: 1,
      title: "Ben, Room Noise",
      location: "Residence Wing",
      locationId: "residence_wing",
      focus: "Ben",
      label: "Talk with Ben about the residence wing",
      detail: "He is making the hallway feel less like intake by standing in it.",
      returnScene: "c01_hub_return_residence",
      openText: [
        "The residence wing is pretending to be normal with fresh sheets, room numbers, laundry carts, and staff trying not to stare when a trainee's suitcase floats six inches off the floor from stress.",
        "Ben catches the suitcase by the handle and lowers it without comment. The trainee mumbles thanks. Ben nods like being useful has always been easier than being noticed.",
        "\"First night is loud,\" he says. \"Even when nobody's talking.\""
      ],
      openChoices: [
        { text: "Ask what kind of loud he means.", effects: [{ type: "relationship", key: "Ben", delta: 1 }, { type: "npc", key: "Ben", trust: 1, memory: "You asked Ben about the quiet kind of impact instead of the obvious one." }, { type: "flag", key: "volBenQuietLoud", value: true }] },
        { text: "Tell him useful people need someone watching them too.", effects: [{ type: "relationship", key: "Ben", delta: 1 }, { type: "npc", key: "Ben", concern: -1, trust: 1 }, { type: "flag", key: "volBenWatchedToo", value: true }] },
        { text: "Joke that the walls better be rated for emotional damage.", effects: [{ type: "relationship", key: "Ben", delta: 1 }, { type: "npc", key: "Ben", trust: 1 }, { type: "flag", key: "volBenWallJoke", value: true }] }
      ],
      turnText: [
        "Ben looks down the hallway. A door shuts too hard. Someone laughs from a room they have not made theirs yet. Somewhere, a staff radio murmurs a code that means nothing to you and everything to people who sleep badly.",
        "\"At home, when something went wrong, everybody looked at me because I could take it,\" he says. \"Here, everyone can take something. Makes it harder to know who should.\"",
        "He says it without self-pity. That makes it heavier."
      ],
      turnVariants: [
        { conditions: [{ type: "flag", key: "volBenWatchedToo" }], text: ["Because you named his pattern early, Ben does not have to pretend he is only discussing architecture."] }
      ],
      closeChoices: [
        { text: "Tell him taking it is not the same as choosing it.", effects: [{ type: "relationship", key: "Ben", delta: 1 }, { type: "stat", key: "restraint", delta: 1 }, { type: "flag", key: "volBenChoiceLine", value: true }] },
        { text: "Ask who he trusts to say no when he forgets.", effects: [{ type: "npc", key: "Ben", trust: 1, concern: -1 }, { type: "flag", key: "volBenNoBackup", value: true }] },
        { text: "Admit you do not know yet what you can take without becoming it.", effects: [{ type: "relationship", key: "Ben", delta: 1 }, { type: "npc", key: "Ben", trust: 1 }, { type: "flag", key: "volBenSharedLimit", value: true }] }
      ]
    },
    {
      id: "vol_c01_piper_service_corridor",
      chapter: 1,
      title: "Piper, The Unofficial Map",
      location: "Service Corridors",
      locationId: "service_corridors",
      focus: "Piper",
      hidden: true,
      conditions: [{ type: "flag", key: "piperShortcuts" }],
      label: "Follow Piper through the service route",
      detail: "The unofficial map apparently comes with bad lighting.",
      returnScene: "c01_hub_return_common",
      openText: [
        "The service corridor is warmer than the public halls and full of pipes, access panels, laundry carts, and small signs written for people who already know the real rules. Piper moves through it like punctuation.",
        "\"This is not forbidden,\" she says. \"Forbidden has a different lock. This is discouraged, which is just forbidden with less budget.\"",
        "She slows enough to make the choice visible. You can follow the joke, challenge the risk, or ask why she is showing you this at all."
      ],
      openChoices: [
        { text: "Ask why she trusts you with a shortcut on day one.", effects: [{ type: "relationship", key: "Piper", delta: 1 }, { type: "npc", key: "Piper", trust: 1, concern: 1 }, { type: "flag", key: "volPiperWhyTrust", value: true }] },
        { text: "Tell her shortcuts are only useful if everyone gets out.", effects: [{ type: "stat", key: "heroPath", delta: 1 }, { type: "npc", key: "Piper", respect: 1, friction: 1 }, { type: "flag", key: "volPiperEveryoneOut", value: true }] },
        { text: "Keep pace and make one joke worse than hers.", effects: [{ type: "relationship", key: "Piper", delta: 1 }, { type: "stat", key: "audacity", delta: 1 }, { type: "flag", key: "volPiperBadJokePace", value: true }] }
      ],
      turnText: [
        "Piper stops beside an unmarked door and taps the frame twice. Somewhere inside the wall, a sensor changes its mind.",
        "\"I don't trust you,\" she says, too quick. Then she grimaces because the lie did not even make it out of the hallway alive. \"I trust pressure. People show you something under pressure. You looked scared and did not make it someone else's problem.\"",
        "For Piper, that appears to count as a background check."
      ],
      turnVariants: [
        { conditions: [{ type: "flag", key: "volPiperEveryoneOut" }], text: ["Your comment about everyone getting out stays with her. She pretends it does not by checking both ends of the corridor twice."] }
      ],
      closeChoices: [
        { text: "Tell her that is the nicest insult anyone has given you today.", effects: [{ type: "relationship", key: "Piper", delta: 1 }, { type: "npc", key: "Piper", trust: 1 }, { type: "flag", key: "volPiperNiceInsult", value: true }] },
        { text: "Ask what she shows people when pressure stops being funny.", effects: [{ type: "npc", key: "Piper", trust: 1, concern: 1 }, { type: "flag", key: "volPiperPressureNotFunny", value: true }] },
        { text: "Promise not to burn the shortcut unless it is the only clean exit.", effects: [{ type: "relationship", key: "Piper", delta: 1 }, { type: "stat", key: "control", delta: 1 }, { type: "flag", key: "volPiperShortcutPromise", value: true }] }
      ]
    },
    {
      id: "vol_c02_medical_consent",
      chapter: 2,
      title: "Medical, Consent Forms",
      location: "Medical",
      locationId: "medical",
      focus: "Vance",
      label: "Review the baseline consent forms",
      detail: "Medical has questions the assignment screen does not.",
      returnScene: "c02_hub_return_observation",
      openText: [
        "Medical has a quieter version of the baseline queue. People sit with clipboards, sleeves rolled, powers politely dormant or very much pretending to be. A medic hands you a consent form thick enough to count as light reading if you hate yourself.",
        "Vance is there too, not hovering, exactly. Supervising the distance between consent and pressure.",
        "\"You can ask questions,\" the medic says. \"If anyone made that sound optional, they were wrong.\""
      ],
      openChoices: [
        { text: "Ask what part of the test people most often regret agreeing to.", effects: [{ type: "stat", key: "control", delta: 1 }, { type: "npc", key: "Vance", respect: 1 }, { type: "flag", key: "volConsentRegretQuestion", value: true }] },
        { text: "Ask whether refusing a step damages your file.", effects: [{ type: "relationship", key: "Vance", delta: 1 }, { type: "stat", key: "aegisTrust", delta: 1 }, { type: "flag", key: "volConsentFileQuestion", value: true }] },
        { text: "Sign quickly before thinking too hard makes the pen heavier.", effects: [{ type: "stat", key: "resolve", delta: 1 }, { type: "status", key: "stress", value: "Tucked under procedure" }, { type: "flag", key: "volConsentSignedFast", value: true }] }
      ],
      turnText: [
        "The medic answers without flinching. Loss of control. Missing time. Feeling useful afterward and realizing usefulness made the violation easier to excuse.",
        "Vance closes your file. \"Aegis has a bad habit of rewarding residents for surviving things we should have prevented. That does not mean the work is fake. It means you watch the incentives.\"",
        "The form feels less like permission now and more like a weather report."
      ],
      turnVariants: [
        { conditions: [{ type: "flag", key: "volConsentFileQuestion" }], text: ["Because you asked about refusal, Vance makes sure the medic answers in front of a witness. The answer matters less than the witness."] }
      ],
      closeChoices: [
        { text: "Tell Vance you want to learn the work without worshiping the incentives.", effects: [{ type: "relationship", key: "Vance", delta: 1 }, { type: "stat", key: "aegisTrust", delta: 1 }, { type: "flag", key: "volWatchIncentives", value: true }] },
        { text: "Ask the medic to flag any test step you can pause safely.", effects: [{ type: "stat", key: "control", delta: 1 }, { type: "status", key: "condition", value: "Prepared" }, { type: "flag", key: "volMedicalPauseFlag", value: true }] },
        { text: "Keep the warning private and carry it into the queue.", effects: [{ type: "stat", key: "restraint", delta: 1 }, { type: "flag", key: "volConsentPrivateWarning", value: true }] }
      ]
    },
    {
      id: "vol_c02_theo_observation_number",
      chapter: 2,
      title: "Theo, The Second Number",
      location: "Observation Hall",
      locationId: "observation_hall",
      focus: "Theo",
      label: "Ask Theo what the numbers miss",
      detail: "He has found the part of the wall display that makes everyone look away.",
      returnScene: "c02_hub_return_observation",
      openText: [
        "Theo stands under the observation hall display with both hands wrapped around a coffee he has not touched. A graph climbs, dips, and climbs again. Someone in the chamber laughs when their own output makes the lights flicker.",
        "\"Peak output is a rude metric,\" Theo says. \"It makes everyone pretend the second number is not the important one.\"",
        "He points at the flat line after the spike. Recovery time. How long power keeps owning the room after the person wants it back."
      ],
      openChoices: [
        { text: "Ask how your recovery line is likely to behave.", effects: [{ type: "relationship", key: "Theo", delta: 1 }, { type: "npc", key: "Theo", trust: 1, memory: "You asked Theo about recovery instead of spectacle before baseline." }, { type: "flag", key: "volTheoRecoveryLine", value: true }] },
        { text: "Tell him people probably worship peak because recovery looks like fear.", effects: [{ type: "stat", key: "insight", delta: 1 }, { type: "npc", key: "Theo", respect: 1 }, { type: "flag", key: "volTheoPeakFear", value: true }] },
        { text: "Ask whether knowing the number ever makes him less afraid.", effects: [{ type: "relationship", key: "Theo", delta: 1 }, { type: "npc", key: "Theo", trust: 1, concern: -1 }, { type: "flag", key: "volTheoLessAfraid", value: true }] }
      ],
      turnText: [
        "Theo looks at the chamber instead of you. It gives him enough privacy to answer.",
        "\"Numbers make fear share the room with shape,\" he says. \"They do not remove it. Anyone who says they do is selling something or trying not to shake.\"",
        "The next trainee comes out smiling too hard. Recovery time blinks in yellow beside their name."
      ],
      turnVariants: [
        { conditions: [{ type: "flag", key: "volTheoLessAfraid" }], text: ["Theo's answer is not comforting. It is better than comforting: it is usable."] }
      ],
      closeChoices: [
        { text: "Tell him shape is enough for now.", effects: [{ type: "relationship", key: "Theo", delta: 1 }, { type: "stat", key: "control", delta: 1 }, { type: "flag", key: "volTheoShapeEnough", value: true }] },
        { text: "Ask him to call out recovery warnings even if you hate hearing them.", effects: [{ type: "relationship", key: "Theo", delta: 1 }, { type: "npc", key: "Theo", trust: 1, concern: -1 }, { type: "flag", key: "volTheoRecoveryWarnings", value: true }] },
        { text: "Joke that if he sees you shaking, he should blame institutional lighting.", effects: [{ type: "relationship", key: "Theo", delta: 1 }, { type: "npc", key: "Theo", trust: 1 }, { type: "flag", key: "volTheoLightingJoke", value: true }] }
      ]
    },
    {
      id: "vol_c02_rina_losing_well",
      chapter: 2,
      title: "Rina, Losing Well",
      location: "Training Wing",
      locationId: "training_wing",
      focus: "Rina",
      label: "Watch Rina reset after a failed drill",
      detail: "She is angry in a way that looks practiced.",
      returnScene: "c02_hub_return_sim",
      openText: [
        "Rina hits the training mat shoulder-first, rolls, comes up too fast, and nearly gets ordered back down by the trainer. The scoreboard marks the run as failed. Her expression makes the word look temporary.",
        "She spots you watching and points one gloved finger at the display. \"Do not say almost.\"",
        "The trainer starts resetting the lane. Rina keeps breathing through her nose like she is trying to out-stubborn oxygen."
      ],
      openChoices: [
        { text: "Tell her failed clean is better than successful stupid.", effects: [{ type: "relationship", key: "Rina", delta: 1 }, { type: "npc", key: "Rina", respect: 1, friction: 1 }, { type: "flag", key: "volRinaSuccessfulStupid", value: true }] },
        { text: "Ask what she learned before the board got rude.", effects: [{ type: "relationship", key: "Rina", delta: 1 }, { type: "npc", key: "Rina", trust: 1 }, { type: "flag", key: "volRinaLearnedQuestion", value: true }] },
        { text: "Say nothing until she decides whether you are audience or witness.", effects: [{ type: "stat", key: "restraint", delta: 1 }, { type: "npc", key: "Rina", respect: 1 }, { type: "flag", key: "volRinaWitnessSilence", value: true }] }
      ],
      turnText: [
        "Rina strips one glove off and flexes her fingers. The anger does not vanish. It changes direction.",
        "\"I hate losing,\" she says. \"I hate losing ugly more. I hate that Aegis is sometimes right about which is which.\"",
        "The scoreboard clears. She looks smaller for half a second without looking weaker."
      ],
      turnVariants: [
        { conditions: [{ type: "flag", key: "volRinaWitnessSilence" }], text: ["Because you waited, Rina does not have to waste the next sentence defending herself against help she did not ask for."] }
      ],
      closeChoices: [
        { text: "Offer to spot one reset, not coach the whole fight.", effects: [{ type: "relationship", key: "Rina", delta: 1 }, { type: "npc", key: "Rina", trust: 1 }, { type: "flag", key: "volRinaSpotReset", value: true }] },
        { text: "Tell her clean failure is still data worth respecting.", effects: [{ type: "stat", key: "control", delta: 1 }, { type: "npc", key: "Rina", respect: 1 }, { type: "flag", key: "volRinaCleanFailure", value: true }] },
        { text: "Challenge her to beat the ugly, not the board.", effects: [{ type: "relationship", key: "Rina", delta: 1 }, { type: "stat", key: "resolve", delta: 1 }, { type: "flag", key: "volRinaBeatUgly", value: true }] }
      ]
    },
    {
      id: "vol_c03_piper_lounge_stillness",
      chapter: 3,
      title: "Piper, Stillness Tax",
      location: "Common Lounge",
      locationId: "common_lounge",
      focus: "Piper",
      label: "Check on Piper after the baseline data",
      detail: "She is holding still badly enough to make it visible.",
      returnScene: "c03_hub_return_common",
      openText: [
        "Piper has claimed a couch arm and a bowl of snack mix with the authority of someone who intends to defend neither. Her foot taps once, stops, taps again, stops harder.",
        "\"The fun thing about Aegis,\" she says, \"is how they can make good news feel like a suspicious package.\"",
        "On the wall display, resident numbers rotate without names. Everyone watches anyway."
      ],
      openChoices: [
        { text: "Ask which part of the data made her go quiet.", effects: [{ type: "relationship", key: "Piper", delta: 1 }, { type: "npc", key: "Piper", trust: 1, concern: 1 }, { type: "flag", key: "volPiperDataQuiet", value: true }] },
        { text: "Tell her speed is not the same as being able to leave.", effects: [{ type: "stat", key: "insight", delta: 1 }, { type: "npc", key: "Piper", respect: 1, friction: 1 }, { type: "flag", key: "volPiperLeaveLine", value: true }] },
        { text: "Make fun of the snack mix because the feelings need a side door.", effects: [{ type: "relationship", key: "Piper", delta: 1 }, { type: "npc", key: "Piper", trust: 1 }, { type: "flag", key: "volPiperSnackSideDoor", value: true }] }
      ],
      turnText: [
        "Piper digs one pretzel out of the bowl and examines it like a legal problem.",
        "\"They clocked recovery gaps between my sprints,\" she says. \"Tiny. Not dangerous. Just enough for someone like Vance to look at me like I am a bridge with a crack in it.\"",
        "She smiles before the sentence gets to hurt. The smile does not fool you anymore."
      ],
      turnVariants: [
        { conditions: [{ type: "flag", key: "volPiperWhyTrust" }], text: ["Because she already told you pressure reveals people, she does not pretend this is only about numbers."] }
      ],
      closeChoices: [
        { text: "Tell her cracks are where inspection starts, not where people end.", effects: [{ type: "relationship", key: "Piper", delta: 1 }, { type: "npc", key: "Piper", trust: 1, concern: -1 }, { type: "flag", key: "volPiperCrackLine", value: true }] },
        { text: "Offer to sit through one boring recovery drill with her later.", effects: [{ type: "relationship", key: "Piper", delta: 1 }, { type: "stat", key: "restraint", delta: 1 }, { type: "flag", key: "volPiperRecoveryOffer", value: true }] },
        { text: "Let her keep the joke and steal the snack bowl as payment.", effects: [{ type: "relationship", key: "Piper", delta: 1 }, { type: "stat", key: "audacity", delta: 1 }, { type: "flag", key: "volPiperSnackTheft", value: true }] }
      ]
    },
    {
      id: "vol_c03_camille_report_language",
      chapter: 3,
      title: "Camille, Report Language",
      location: "Observation Hall",
      locationId: "observation_hall",
      focus: "Camille",
      label: "Ask Camille how reports become decisions",
      detail: "She has marked the same paragraph three times.",
      returnScene: "c03_hub_gallery",
      openText: [
        "Camille stands near the observation glass with a report preview open on her tablet. She has highlighted three phrases: unpredictable vector, unstable reserve, viable containment partner.",
        "\"The first two make command nervous,\" she says. \"The third makes them ambitious. That is the one I dislike.\"",
        "Her thumb hovers over the margin note field. She has not written anything yet."
      ],
      openChoices: [
        { text: "Ask what she would write if politics were not reading over her shoulder.", effects: [{ type: "relationship", key: "Camille", delta: 1 }, { type: "npc", key: "Camille", trust: 1 }, { type: "flag", key: "volCamilleNoPolitics", value: true }] },
        { text: "Tell her viable can be a dangerous compliment.", effects: [{ type: "stat", key: "insight", delta: 1 }, { type: "npc", key: "Camille", respect: 1 }, { type: "flag", key: "volCamilleDangerousCompliment", value: true }] },
        { text: "Ask whether she trusts her read of you yet.", effects: [{ type: "relationship", key: "Camille", delta: 1 }, { type: "npc", key: "Camille", friction: 1, trust: 1 }, { type: "flag", key: "volCamilleTrustRead", value: true }] }
      ],
      turnText: [
        "Camille finally types. Not safe. Not unsafe. High consequence under social pressure; improves when asked for intent before output.",
        "\"There,\" she says. \"Useful enough to survive committee, specific enough to annoy someone lazy.\"",
        "The sentence feels strange in your chest. Not praise. Not defense. Something more useful: a weaponized refusal to simplify you."
      ],
      turnVariants: [
        { conditions: [{ type: "flag", key: "volCamilleLazyAnalysis" }], text: ["The line calls back to your first conversation. Camille remembers lazy analysis the way other people remember birthdays."] }
      ],
      closeChoices: [
        { text: "Thank her for making the sentence harder to misuse.", effects: [{ type: "relationship", key: "Camille", delta: 1 }, { type: "stat", key: "aegisTrust", delta: 1 }, { type: "flag", key: "volCamilleHarderMisuse", value: true }] },
        { text: "Ask her to teach you how to write your own margin notes.", effects: [{ type: "relationship", key: "Camille", delta: 1 }, { type: "stat", key: "control", delta: 1 }, { type: "flag", key: "volCamilleMarginNotes", value: true }] },
        { text: "Tell her annoyance seems to be one of her civic virtues.", effects: [{ type: "relationship", key: "Camille", delta: 1 }, { type: "npc", key: "Camille", trust: 1 }, { type: "flag", key: "volCamilleCivicAnnoyance", value: true }] }
      ]
    },
    {
      id: "vol_c04_vance_training_damage",
      chapter: 4,
      title: "Vance, Damage Budget",
      location: "Training Wing",
      locationId: "training_wing",
      focus: "Vance",
      label: "Ask Vance about acceptable training damage",
      detail: "The mats are fresh, which means they expect damage to happen.",
      returnScene: "c04_hub_training",
      openText: [
        "A training crew replaces a cracked barrier panel while Vance watches the next group stretch. The broken panel is not dramatic. It is labeled, logged, and wheeled away.",
        "\"People outside think we are brutal because residents get hurt here,\" he says. \"They are not entirely wrong. They are also not around when someone untrained panics in a crowded subway.\"",
        "A medic checks the new panel's sensor strip, then gives Vance a thumbs-up."
      ],
      openChoices: [
        { text: "Ask who decides when training crosses from hard to cruel.", effects: [{ type: "relationship", key: "Vance", delta: 1 }, { type: "stat", key: "restraint", delta: 1 }, { type: "flag", key: "volVanceCruelLine", value: true }] },
        { text: "Tell him outside criticism is still data.", effects: [{ type: "stat", key: "foundationPath", delta: 1 }, { type: "npc", key: "Vance", respect: 1, friction: 1 }, { type: "flag", key: "volVanceCriticismData", value: true }] },
        { text: "Ask what injury taught him the lesson he trusts most.", effects: [{ type: "relationship", key: "Vance", delta: 1 }, { type: "npc", key: "Vance", trust: 1 }, { type: "flag", key: "volVanceTrustedInjury", value: true }] }
      ],
      turnText: [
        "Vance does not answer quickly. That is the first honest thing.",
        "\"Cruel is when pain is the point,\" he says. \"Hard is when pain is the cost of teaching something safer than the world will.\"",
        "He flexes one hand. Old scar tissue pulls white across two knuckles. He catches you noticing and lets you."
      ],
      turnVariants: [
        { conditions: [{ type: "matureContent" }], text: ["A resident in the next bay takes a hit badly enough that the room hears the joint go. The medic is moving before the swearing starts. Vance watches the response time more than the injury."] }
      ],
      closeChoices: [
        { text: "Tell him pain as cost still needs receipts.", effects: [{ type: "stat", key: "contractorPath", delta: 1 }, { type: "npc", key: "Vance", respect: 1 }, { type: "flag", key: "volPainNeedsReceipts", value: true }] },
        { text: "Ask him to call you out if you start treating pain like proof.", effects: [{ type: "relationship", key: "Vance", delta: 1 }, { type: "stat", key: "aegisTrust", delta: 1 }, { type: "flag", key: "volVancePainProof", value: true }] },
        { text: "Keep your eyes on the response team instead of the cracked panel.", effects: [{ type: "stat", key: "control", delta: 1 }, { type: "flag", key: "volResponseTeamLesson", value: true }] }
      ]
    },
    {
      id: "vol_c04_julian_attention_cost",
      chapter: 4,
      title: "Julian, Attention Cost",
      location: "Common Lounge",
      locationId: "common_lounge",
      focus: "Julian",
      label: "Talk with Julian about attention",
      detail: "He has made the worst chair in the lounge look intentional.",
      returnScene: "c04_hub_return_common",
      openText: [
        "Julian has rearranged two chairs, one lamp, and himself into a composition that makes the lounge look less institutional. A couple of residents keep glancing over, relieved to have something frivolous to resent.",
        "\"Attention is a tool,\" he says. \"Aegis uses it like a floodlight. I prefer a scalpel.\"",
        "The lamp flickers once. Julian makes the flicker look like timing."
      ],
      openChoices: [
        { text: "Ask what attention costs him when he cannot turn it off.", effects: [{ type: "relationship", key: "Julian", delta: 1 }, { type: "npc", key: "Julian", trust: 1, concern: 1 }, { type: "flag", key: "volJulianAttentionCost", value: true }] },
        { text: "Tell him a scalpel still cuts.", effects: [{ type: "stat", key: "insight", delta: 1 }, { type: "npc", key: "Julian", respect: 1, friction: 1 }, { type: "flag", key: "volJulianScalpelCuts", value: true }] },
        { text: "Ask him to make the room easier for someone else, not prettier.", effects: [{ type: "relationship", key: "Julian", delta: 1 }, { type: "stat", key: "heroPath", delta: 1 }, { type: "flag", key: "volJulianEasierRoom", value: true }] }
      ],
      turnText: [
        "Julian dims the lamp enough that the corner stops feeling staged and starts feeling private. The residents who kept glancing over relax by degrees, annoyed at being helped.",
        "\"There,\" he says. \"A public service disguised as vanity. My brand remains intact.\"",
        "Then, softer: \"Turning it off is harder when people only believe you are useful while performing.\""
      ],
      turnVariants: [
        { conditions: [{ type: "flag", key: "volJulianJokeCalibration" }], text: ["You hear the calibration now: joke, cover, truth, exit. He is letting you notice the order."] }
      ],
      closeChoices: [
        { text: "Tell him usefulness without performance should still count.", effects: [{ type: "relationship", key: "Julian", delta: 1 }, { type: "npc", key: "Julian", trust: 1 }, { type: "flag", key: "volJulianStillCounts", value: true }] },
        { text: "Ask who he becomes when the room does not need managing.", effects: [{ type: "relationship", key: "Julian", delta: 1 }, { type: "npc", key: "Julian", trust: 1, concern: 1 }, { type: "flag", key: "volJulianRoomNeed", value: true }] },
        { text: "Let the joke be the exit and thank him for the lighting.", effects: [{ type: "npc", key: "Julian", respect: 1 }, { type: "flag", key: "volJulianLightingThanks", value: true }] }
      ]
    },
    {
      id: "vol_c05_blackwater_infirmary_first",
      chapter: 5,
      title: "Blackwater Infirmary, City Triage",
      location: "Blackwater Infirmary",
      locationId: "blackwater_infirmary",
      focus: "Ben",
      label: "Visit the off-campus infirmary",
      detail: "Ben says knowing where healing lives is not pessimism.",
      returnScene: "c05_hub_return_prom",
      openText: [
        "Ben insists on walking past the Blackwater Infirmary before the dock assignment. Not inside at first. Just past it, so you know the doors, the street angle, the alley where emergency vehicles can cheat traffic.",
        "\"People make plans around impact,\" he says. \"They should make plans around after.\"",
        "Inside the glass doors, a nurse argues with a superhero in civilian clothes who clearly believes medical discharge is a negotiation."
      ],
      openChoices: [
        { text: "Ask Ben what after usually costs him.", effects: [{ type: "relationship", key: "Ben", delta: 1 }, { type: "npc", key: "Ben", trust: 1, concern: -1 }, { type: "flag", key: "volBenAfterCost", value: true }] },
        { text: "Tell him evacuation routes count as part of the power plan.", effects: [{ type: "stat", key: "control", delta: 1 }, { type: "npc", key: "Ben", respect: 1 }, { type: "flag", key: "volEvacPowerPlan", value: true }] },
        { text: "Ask if he trusts off-campus healers more than Aegis Medical.", effects: [{ type: "relationship", key: "Ben", delta: 1 }, { type: "stat", key: "independentPath", delta: 1 }, { type: "flag", key: "volBenOffCampusTrust", value: true }] }
      ],
      turnText: [
        "Ben watches the nurse win the argument with the patience of a saint and the authority of someone holding a clipboard.",
        "\"Aegis Medical knows our files,\" he says. \"City healers know what happens when files arrive late or wrong. Both matter.\"",
        "The infirmary doors open and release the smell of antiseptic, rain jackets, and someone reheating noodles in a staff microwave."
      ],
      turnVariants: [
        { conditions: [{ type: "matureContent" }], text: ["A man walks out with his forearm wrapped in translucent gel, the bones underneath lit by a diagnostic glow like a small city under glass. He looks annoyed, alive, and very carefully discharged."] }
      ],
      closeChoices: [
        { text: "Tell Ben aftercare belongs in the plan before anyone bleeds.", effects: [{ type: "relationship", key: "Ben", delta: 1 }, { type: "stat", key: "heroPath", delta: 1 }, { type: "flag", key: "volAftercareBeforeBleed", value: true }] },
        { text: "Memorize the infirmary route without making it dramatic.", effects: [{ type: "stat", key: "control", delta: 1 }, { type: "status", key: "condition", value: "Route-aware" }, { type: "flag", key: "volInfirmaryRouteKnown", value: true }] },
        { text: "Ask Ben who checks on him after he checks on everyone else.", effects: [{ type: "relationship", key: "Ben", delta: 1 }, { type: "npc", key: "Ben", trust: 1, concern: -1 }, { type: "flag", key: "volBenAfterCheck", value: true }] }
      ]
    },
    {
      id: "vol_c05_rina_dock_line",
      chapter: 5,
      title: "Rina, Dock Line",
      location: "East Dock",
      locationId: "east_dock",
      focus: "Rina",
      label: "Walk the dock line with Rina",
      detail: "She is treating the pier like a starting block with consequences.",
      returnScene: "c05_hub_dock",
      openText: [
        "Rina walks the dock line heel-to-toe, measuring boards, gaps, rust, and the slick places where seawater has opinions. She is not showing off. That makes the focus sharper.",
        "\"Everyone keeps saying field test like the field is neutral,\" she says. \"Fields have favorites. This one likes gravity and bad footing.\"",
        "She crouches, taps a loose plank, and marks it with chalk."
      ],
      openChoices: [
        { text: "Ask what she sees before speed turns it into instinct.", effects: [{ type: "relationship", key: "Rina", delta: 1 }, { type: "npc", key: "Rina", trust: 1, respect: 1 }, { type: "flag", key: "volRinaBeforeSpeed", value: true }] },
        { text: "Tell her the field is allowed to be hostile if the plan respects it.", effects: [{ type: "stat", key: "control", delta: 1 }, { type: "npc", key: "Rina", respect: 1 }, { type: "flag", key: "volRinaHostileField", value: true }] },
        { text: "Ask whether competition makes her sharper or just louder.", effects: [{ type: "npc", key: "Rina", respect: 1, friction: 1 }, { type: "stat", key: "resolve", delta: 1 }, { type: "flag", key: "volRinaCompetitionSharp", value: true }] }
      ],
      turnText: [
        "Rina gives you the loose plank's location, two better foot placements, and one insultingly accurate read on where Piper would improvise and make everyone else panic.",
        "\"Competition makes me honest,\" she says. \"The bad version makes me stupid. I am working on telling them apart before somebody else pays for the difference.\"",
        "She says it like admitting growth has personally offended her."
      ],
      turnVariants: [
        { conditions: [{ type: "flag", key: "volRinaCleanFailure" }], text: ["The phrase telling them apart lands differently because you already saw her choose clean failure over ugly victory."] }
      ],
      closeChoices: [
        { text: "Tell her honesty is better than winning if people can survive it.", effects: [{ type: "relationship", key: "Rina", delta: 1 }, { type: "stat", key: "heroPath", delta: 1 }, { type: "flag", key: "volRinaHonestySurvival", value: true }] },
        { text: "Ask her to call your stupid version before it gets expensive.", effects: [{ type: "relationship", key: "Rina", delta: 1 }, { type: "npc", key: "Rina", trust: 1 }, { type: "flag", key: "volRinaCallStupid", value: true }] },
        { text: "Mark the plank again and make the warning visible.", effects: [{ type: "stat", key: "restraint", delta: 1 }, { type: "flag", key: "volDockPlankMarked", value: true }] }
      ]
    },
    {
      id: "vol_c06_kaito_neutral_cost",
      chapter: 6,
      title: "Kaito, Cost Of Neutral",
      location: "Event Horizon",
      locationId: "event_horizon",
      focus: "Kaito",
      label: "Ask Kaito about neutral ground",
      detail: "He is polishing a glass like the glass has secrets.",
      returnScene: "c06_hub_event",
      openText: [
        "Kaito stands behind the bar while staff move through the Event Horizon with quiet choreography. Nobody bumps a chair. Nobody raises a voice. The room is too controlled to be relaxed.",
        "\"Neutral ground is not peace,\" Kaito says when you ask. \"Peace is expensive. Neutrality is a payment plan.\"",
        "He places water in front of you without asking whether you want it. The glass has a coaster before it touches wood."
      ],
      openChoices: [
        { text: "Ask who usually pays when neutrality fails.", effects: [{ type: "relationship", key: "Kaito", delta: 1 }, { type: "npc", key: "Kaito", respect: 1 }, { type: "flag", key: "volKaitoWhoPays", value: true }] },
        { text: "Tell him Aegis calls control support when the cameras are on.", effects: [{ type: "stat", key: "contractorPath", delta: 1 }, { type: "npc", key: "Kaito", trust: 1 }, { type: "flag", key: "volKaitoAegisControl", value: true }] },
        { text: "Ask whether his rules protect guests or protect leverage.", effects: [{ type: "relationship", key: "Kaito", delta: 1 }, { type: "npc", key: "Kaito", respect: 1, friction: 1 }, { type: "flag", key: "volKaitoLeverageRules", value: true }] }
      ],
      turnText: [
        "Kaito considers you like a man deciding whether a knife is a tool, a threat, or simply poorly stored.",
        "\"The person who pays is usually the one who thought rules were moral instead of structural,\" he says. \"My rules are doors. Doors do not love you. They open or they do not.\"",
        "Across the room, Piper laughs at something Julian says. Camille watches the exits anyway."
      ],
      turnVariants: [
        { conditions: [{ type: "flag", key: "noticedKaitoHospitality" }], text: ["Because you noticed his careful hospitality earlier, Kaito lets the metaphor sharpen without pretending he is being kind."] }
      ],
      closeChoices: [
        { text: "Tell him you prefer doors that admit what they are.", effects: [{ type: "relationship", key: "Kaito", delta: 1 }, { type: "stat", key: "independentPath", delta: 1 }, { type: "flag", key: "volKaitoHonestDoors", value: true }] },
        { text: "Ask what kind of door Aegis thinks you are.", effects: [{ type: "npc", key: "Kaito", trust: 1 }, { type: "stat", key: "insight", delta: 1 }, { type: "flag", key: "volKaitoAegisDoor", value: true }] },
        { text: "Leave the water untouched and thank him for the warning.", effects: [{ type: "npc", key: "Kaito", respect: 1 }, { type: "flag", key: "volKaitoUntouchedWater", value: true }] }
      ]
    },
    {
      id: "vol_c06_piper_after_rhea_silence",
      chapter: 6,
      title: "Piper, After The Door Opens",
      location: "Blackwater Promenade",
      locationId: "blackwater_promenade",
      focus: "Piper",
      label: "Walk with Piper after the Horizon tension",
      detail: "The city lights are doing a poor job pretending nothing happened.",
      returnScene: "c06_hub_return_prom",
      conditions: [{ type: "any", conditions: [{ type: "flag", key: "protectedPiperFirst" }, { type: "relationshipAtLeast", key: "Piper", value: 4 }] }],
      openText: [
        "Outside the Event Horizon, the promenade looks exactly the same. Couples walk under string lights. Food carts hiss. The bay keeps making soft public noises like the night did not briefly become a knife.",
        "Piper walks beside you with her hands in her jacket pockets. That is stranger than her running would be.",
        "\"I hate when villains have timing,\" she says. \"Feels like letting them edit the room.\""
      ],
      openChoices: [
        { text: "Ask what Rhea edited out of her.", effects: [{ type: "relationship", key: "Piper", delta: 1 }, { type: "npc", key: "Piper", trust: 1, concern: 1 }, { type: "flag", key: "volPiperRheaEdited", value: true }] },
        { text: "Tell her she gets to be angry before she gets useful.", effects: [{ type: "relationship", key: "Piper", delta: 1 }, { type: "stat", key: "heroPath", delta: 1 }, { type: "flag", key: "volPiperAngryBeforeUseful", value: true }] },
        { text: "Offer distraction and let her choose whether to take it.", effects: [{ type: "npc", key: "Piper", trust: 1 }, { type: "stat", key: "restraint", delta: 1 }, { type: "flag", key: "volPiperChosenDistraction", value: true }] }
      ],
      turnText: [
        "Piper stops at the rail. For once, she looks at the water instead of the possible exits.",
        "\"She edited out the part where I get to be new,\" Piper says. \"I was doing pretty well at pretending this place was just weird and stupid and maybe ours. Then an old threat walks in and reminds everybody the past has keys.\"",
        "She scrubs both hands over her face and laughs once, without humor."
      ],
      turnVariants: [
        { conditions: [{ type: "flag", key: "volPiperCrackLine" }], text: ["You remember the crack line from the lounge. This is not an inspection anymore. This is someone trying not to split where everyone can see."] }
      ],
      closeChoices: [
        { text: "Tell her the past can have keys and still not own the room.", effects: [{ type: "relationship", key: "Piper", delta: 1 }, { type: "npc", key: "Piper", trust: 1, concern: -1 }, { type: "flag", key: "volPiperPastKeys", value: true }] },
        { text: "Ask what ours would look like if she got to keep building it.", effects: [{ type: "relationship", key: "Piper", delta: 1 }, { type: "npc", key: "Piper", attraction: 1, trust: 1 }, { type: "flag", key: "volPiperOursQuestion", value: true }] },
        { text: "Stay quiet and let the water carry the answer she does not have.", effects: [{ type: "stat", key: "restraint", delta: 1 }, { type: "npc", key: "Piper", trust: 1 }, { type: "flag", key: "volPiperWaterQuiet", value: true }] }
      ]
    },
    {
      id: "vol_c07_vance_review_paperwork",
      chapter: 7,
      title: "Vance, Paperwork With Teeth",
      location: "Briefing Room",
      locationId: "briefing_room",
      focus: "Vance",
      label: "Ask Vance what the bait plan costs",
      detail: "He has three versions of the same plan and hates all of them.",
      returnScene: "c07_hub_bait",
      openText: [
        "The briefing room table holds maps, sim overlays, risk bands, and one mug of coffee that has clearly been abandoned for moral reasons. Vance moves a marker from one route to another and makes the whole plan look worse by improving it.",
        "\"Bait plans are paperwork with teeth,\" he says. \"Everybody signs because the alternative has claws.\"",
        "He does not look at you when he says everybody. That makes it land harder."
      ],
      openChoices: [
        { text: "Ask what line makes him cancel the plan.", effects: [{ type: "relationship", key: "Vance", delta: 1 }, { type: "stat", key: "control", delta: 1 }, { type: "flag", key: "volVanceCancelLine", value: true }] },
        { text: "Tell him consent under threat is still pressure.", effects: [{ type: "stat", key: "foundationPath", delta: 1 }, { type: "npc", key: "Vance", respect: 1, friction: 1 }, { type: "flag", key: "volConsentUnderThreat", value: true }] },
        { text: "Ask whether he has ever hated a right call.", effects: [{ type: "relationship", key: "Vance", delta: 1 }, { type: "npc", key: "Vance", trust: 1 }, { type: "flag", key: "volVanceHatedRightCall", value: true }] }
      ],
      turnText: [
        "Vance sets the marker down with care. Too much care.",
        "\"Yes,\" he says. \"If you stay in this work, you will too. The trick is not letting hatred of the cost become love of shortcuts.\"",
        "The room hums. Somewhere beyond the wall, the simulation dome waits to turn theory into injuries."
      ],
      turnVariants: [
        { conditions: [{ type: "flag", key: "volWatchIncentives" }], text: ["The incentive warning from Medical is back under the table. This plan rewards bravery. That does not mean bravery is the only thing happening."] }
      ],
      closeChoices: [
        { text: "Ask him to make cancellation feel permitted, not shameful.", effects: [{ type: "relationship", key: "Vance", delta: 1 }, { type: "stat", key: "aegisTrust", delta: 1 }, { type: "flag", key: "volCancelPermitted", value: true }] },
        { text: "Tell him you will not confuse hating the cost with refusing the work.", effects: [{ type: "stat", key: "resolve", delta: 1 }, { type: "npc", key: "Vance", respect: 1 }, { type: "flag", key: "volCostWorkDifference", value: true }] },
        { text: "Keep your doubt visible so the room cannot pretend you are eager bait.", effects: [{ type: "stat", key: "restraint", delta: 1 }, { type: "flag", key: "volVisibleDoubt", value: true }] }
      ]
    },
    {
      id: "vol_c07_medical_aftershock",
      chapter: 7,
      title: "Medical, Pre-Triage",
      location: "Medical",
      locationId: "medical",
      focus: "Piper",
      label: "Sit in Medical before the bait run",
      detail: "Piper is not hurt yet. Nobody likes the yet.",
      returnScene: "c07_hub_return_medical",
      openText: [
        "Medical before a dangerous assignment has a particular quiet: stocked carts, charged monitors, medics pretending readiness is not prophecy. Piper sits on the edge of an exam bed and bounces one heel until a nurse glares her into stillness.",
        "\"Pre-triage,\" Piper says. \"Very cool concept. Love being medically anticipated.\"",
        "She smiles at the nurse. The nurse does not fall for it."
      ],
      openChoices: [
        { text: "Ask Piper what she needs if the plan goes bad.", effects: [{ type: "relationship", key: "Piper", delta: 1 }, { type: "npc", key: "Piper", trust: 1, concern: -1 }, { type: "flag", key: "volPiperNeedsBadPlan", value: true }] },
        { text: "Ask the nurse what injuries the plan is quietly expecting.", effects: [{ type: "stat", key: "control", delta: 1 }, { type: "status", key: "condition", value: "Medically briefed" }, { type: "flag", key: "volMedicalExpectedInjuries", value: true }] },
        { text: "Tell Piper the joke can stay but the plan gets the truth.", effects: [{ type: "relationship", key: "Piper", delta: 1 }, { type: "npc", key: "Piper", respect: 1, friction: 1 }, { type: "flag", key: "volPiperJokeTruth", value: true }] }
      ],
      turnText: [
        "The nurse lists injuries like weather categories: concussion, joint trauma, thermal backlash, emotional shock that looks like attitude until it does not.",
        "Piper stops bouncing. Not because she is afraid. Because she is listening.",
        "\"If it goes bad,\" she says, \"do not chase me first unless I am the actual problem. I know that sounds noble and gross. I hate it too.\""
      ],
      turnVariants: [
        { conditions: [{ type: "matureContent" }], text: ["A tray beside the bed holds splints, sealant, bone foam, and a little blue packet labeled dental recovery. Piper notices you noticing and says, \"For the record, I like all my teeth where they are.\""] }
      ],
      closeChoices: [
        { text: "Promise to choose by need, not fear.", effects: [{ type: "relationship", key: "Piper", delta: 1 }, { type: "stat", key: "heroPath", delta: 1 }, { type: "flag", key: "volChooseNeedNotFear", value: true }] },
        { text: "Tell her she is allowed to be both teammate and person.", effects: [{ type: "relationship", key: "Piper", delta: 1 }, { type: "npc", key: "Piper", trust: 1, attraction: 1 }, { type: "flag", key: "volPiperTeammatePerson", value: true }] },
        { text: "Ask the nurse to write that down before bravery edits it.", effects: [{ type: "stat", key: "control", delta: 1 }, { type: "npc", key: "Piper", respect: 1 }, { type: "flag", key: "volNurseWritesNeed", value: true }] }
      ]
    },
    {
      id: "vol_c08_rina_runway_respect",
      chapter: 8,
      title: "Rina, Runway Respect",
      location: "Aegis Airbase",
      locationId: "airbase_hangar",
      focus: "Rina",
      label: "Ask Rina to read the runway",
      detail: "She is watching speed from the outside and hating how useful that is.",
      returnScene: "c08_hub_airbase",
      openText: [
        "Rina stands at the runway edge with a tablet she has bullied into showing timing intervals instead of safety language. Piper is far down the strip, a bright point waiting to become impossible.",
        "\"Speed is not one thing,\" Rina says. \"People who say fast like it explains anything should be sentenced to watching frame data until remorse.\"",
        "She scrubs backward through a test clip and points at the instant before acceleration becomes commitment."
      ],
      openChoices: [
        { text: "Ask what Piper is doing that the observers keep missing.", effects: [{ type: "relationship", key: "Rina", delta: 1 }, { type: "npc", key: "Rina", trust: 1, respect: 1 }, { type: "flag", key: "volRinaReadsPiper", value: true }] },
        { text: "Tell her speed deserves better than spectacle.", effects: [{ type: "relationship", key: "Rina", delta: 1 }, { type: "npc", key: "Rina", respect: 1 }, { type: "flag", key: "volSpeedNotSpectacle", value: true }] },
        { text: "Ask whether watching instead of racing feels like growth or punishment.", effects: [{ type: "npc", key: "Rina", trust: 1, friction: 1 }, { type: "stat", key: "insight", delta: 1 }, { type: "flag", key: "volRinaWatchingPunishment", value: true }] }
      ],
      turnText: [
        "Rina rewinds again. \"Piper smiles right before she commits because everyone expects fear to look solemn. It is actually where she puts the math.\"",
        "The clip plays. Piper grins, shifts her weight by an inch, and the whole runway changes.",
        "\"She is reckless,\" Rina says. \"She is also better than that word. Annoying.\""
      ],
      turnVariants: [
        { conditions: [{ type: "flag", key: "volRinaBeforeSpeed" }], text: ["You remember the dock line and realize Rina is giving Piper the same respect she gives terrain: hostile, specific, real."] }
      ],
      closeChoices: [
        { text: "Ask Rina to call the commitment point during the test.", effects: [{ type: "relationship", key: "Rina", delta: 1 }, { type: "stat", key: "control", delta: 1 }, { type: "flag", key: "volRinaCommitmentCall", value: true }] },
        { text: "Tell her better than the word is a useful kind of respect.", effects: [{ type: "npc", key: "Rina", trust: 1, respect: 1 }, { type: "flag", key: "volRinaUsefulRespect", value: true }] },
        { text: "Ask what word she hopes people use for her later.", effects: [{ type: "relationship", key: "Rina", delta: 1 }, { type: "npc", key: "Rina", trust: 1 }, { type: "flag", key: "volRinaLaterWord", value: true }] }
      ]
    },
    {
      id: "vol_c08_theo_medical_afterburn",
      chapter: 8,
      title: "Theo, Afterburn Math",
      location: "Medical",
      locationId: "medical",
      focus: "Theo",
      label: "Review the post-Rhea numbers with Theo",
      detail: "He is looking at the numbers like they have begun looking back.",
      returnScene: "c08_hub_return_medical",
      conditions: [{ type: "any", conditions: [{ type: "flag", key: "rheaErased" }, { type: "flag", key: "rheaContained" }, { type: "flag", key: "rheaEscaped" }] }],
      openText: [
        "Theo has the post-Rhea medical overlay open in a privacy corner. The screen shows stress markers, output spikes, recovery lag, and little red annotations that look far too tidy for what happened.",
        "\"The thing I hate,\" he says, \"is when data is correct and still not enough.\"",
        "He taps one point on the graph. Your body, after the fight, trying to decide whether survival was over."
      ],
      openChoices: [
        { text: "Ask what the graph says before he tells you what he thinks.", effects: [{ type: "relationship", key: "Theo", delta: 1 }, { type: "stat", key: "control", delta: 1 }, { type: "flag", key: "volTheoGraphFirst", value: true }] },
        { text: "Tell him he is allowed to have a reaction before a model.", effects: [{ type: "relationship", key: "Theo", delta: 1 }, { type: "npc", key: "Theo", trust: 1, concern: -1 }, { type: "flag", key: "volTheoReactionBeforeModel", value: true }] },
        { text: "Ask whether the numbers make you look dangerous or hurt.", effects: [{ type: "npc", key: "Theo", trust: 1, concern: 1 }, { type: "flag", key: "volTheoDangerousOrHurt", value: true }] }
      ],
      turnText: [
        "Theo answers the last question with too much care.",
        "\"Both,\" he says. \"And everyone will prefer whichever answer lets them do what they already wanted.\"",
        "He closes the graph before you can memorize the worst red mark. It is a mercy so deliberate it almost looks like anger."
      ],
      turnVariants: [
        { conditions: [{ type: "flag", key: "volTheoRecoveryWarnings" }], text: ["He remembers you asked for warnings. This one arrives wearing gentleness because blunt force would be cowardice."] }
      ],
      closeChoices: [
        { text: "Tell him you need people who can hold both answers.", effects: [{ type: "relationship", key: "Theo", delta: 1 }, { type: "npc", key: "Theo", trust: 1 }, { type: "flag", key: "volTheoBothAnswers", value: true }] },
        { text: "Ask him to stay angry if anger keeps the model honest.", effects: [{ type: "relationship", key: "Theo", delta: 1 }, { type: "stat", key: "foundationPath", delta: 1 }, { type: "flag", key: "volTheoHonestAnger", value: true }] },
        { text: "Let the graph close and focus on breathing once.", effects: [{ type: "stat", key: "restraint", delta: 1 }, { type: "status", key: "stress", value: "Measured, not gone" }, { type: "flag", key: "volClosedGraphBreath", value: true }] }
      ]
    },
    {
      id: "vol_c09_camille_private_exit",
      chapter: 9,
      title: "Camille, Exit Strategy",
      location: "Residence Wing",
      locationId: "residence_wing",
      focus: "Camille",
      label: "Find Camille before the last night",
      detail: "Her door is half open, which from Camille is a paragraph.",
      returnScene: "c09_hub_graduation_eve",
      openText: [
        "Camille's room is mostly packed. The word mostly is doing emotional work: uniforms folded, tablet docked, one jacket still on the chair as if leaving it out can slow time.",
        "She does not seem surprised to see you. \"Graduation creates terrible strategy,\" she says. \"Everyone mistakes an ending for clarity.\"",
        "On her desk, a blank transfer form waits beside a pen aligned perfectly with its edge."
      ],
      openChoices: [
        { text: "Ask what she would choose if no one could use it against her.", effects: [{ type: "relationship", key: "Camille", delta: 1 }, { type: "npc", key: "Camille", trust: 1, concern: 1 }, { type: "flag", key: "volCamilleUnusableChoice", value: true }] },
        { text: "Tell her clarity can be built after the ending, not before.", effects: [{ type: "relationship", key: "Camille", delta: 1 }, { type: "stat", key: "foundationPath", delta: 1 }, { type: "flag", key: "volCamilleAfterEnding", value: true }] },
        { text: "Ask whether the half-open door was an invitation or a tactical mistake.", effects: [{ type: "relationship", key: "Camille", delta: 1 }, { type: "npc", key: "Camille", trust: 1 }, { type: "flag", key: "volCamilleHalfDoor", value: true }] }
      ],
      turnText: [
        "Camille looks at the form instead of the door.",
        "\"If no one could use it against me,\" she says, \"I would admit that staying near people who know my control is not the same as trust has become useful. Personally inconvenient. Strategically relevant.\"",
        "The words are dry. Her voice is not."
      ],
      turnVariants: [
        { conditions: [{ type: "flag", key: "camilleRomance" }], text: ["The room changes around the unspoken personal part. Camille notices and does not retreat from it."] },
        { conditions: [{ type: "flag", key: "volCamilleHarderMisuse" }], text: ["This is another margin note, you realize. A precise sentence designed to survive misuse by refusing to be simple."] }
      ],
      closeChoices: [
        { text: "Tell her personally inconvenient can still be worth choosing.", effects: [{ type: "relationship", key: "Camille", delta: 1 }, { type: "npc", key: "Camille", trust: 1, attraction: 1 }, { type: "flag", key: "volCamilleWorthChoosing", value: true }] },
        { text: "Ask her to build the next strategy with people in it on purpose.", effects: [{ type: "relationship", key: "Camille", delta: 1 }, { type: "stat", key: "foundationPath", delta: 1 }, { type: "flag", key: "volCamillePeopleStrategy", value: true }] },
        { text: "Leave before the open door becomes something she has to defend.", effects: [{ type: "stat", key: "restraint", delta: 1 }, { type: "npc", key: "Camille", trust: 1 }, { type: "flag", key: "volCamilleDoorRespect", value: true }] }
      ]
    },
    {
      id: "vol_c09_julian_packing_show",
      chapter: 9,
      title: "Julian, Packing The Show",
      location: "Common Lounge",
      locationId: "common_lounge",
      focus: "Julian",
      label: "Help Julian pack the wrong things",
      detail: "He has somehow made a box look judgmental.",
      returnScene: "c09_hub_return_lounge",
      openText: [
        "Julian has brought three boxes to the common lounge and filled none of them correctly. One contains costume pieces, two books, emergency coffee, a broken spotlight lens, and a ceremonial sash he claims to hate while folding it carefully.",
        "\"Packing is barbaric,\" he says. \"Objects become evidence. Very rude of them.\"",
        "He lifts the broken lens, catches lounge light through it, and throws a small red star against the wall."
      ],
      openChoices: [
        { text: "Ask which object is evidence he does not want explained.", effects: [{ type: "relationship", key: "Julian", delta: 1 }, { type: "npc", key: "Julian", trust: 1, concern: 1 }, { type: "flag", key: "volJulianObjectEvidence", value: true }] },
        { text: "Tell him performance props count as survival gear if they kept him alive.", effects: [{ type: "relationship", key: "Julian", delta: 1 }, { type: "stat", key: "insight", delta: 1 }, { type: "flag", key: "volJulianSurvivalProps", value: true }] },
        { text: "Start sorting by emotional hazard instead of category.", effects: [{ type: "relationship", key: "Julian", delta: 1 }, { type: "npc", key: "Julian", trust: 1 }, { type: "flag", key: "volJulianEmotionalHazard", value: true }] }
      ],
      turnText: [
        "Julian lets you handle the broken lens. That seems more intimate than the sash, somehow.",
        "\"First field stage,\" he says. \"I cracked it making a decoy bigger than I was because I needed everyone looking at the lie instead of the evacuation route.\"",
        "He smiles without turning it into a punchline. The room feels briefly underlit and honest."
      ],
      turnVariants: [
        { conditions: [{ type: "flag", key: "julianRomance" }], text: ["If there is romance between you, it sits here without needing announcement: in the offered object, the unguarded explanation, the joke he chooses not to make."] },
        { conditions: [{ type: "flag", key: "volJulianStillCounts" }], text: ["You remember telling him usefulness without performance should count. This may be him testing whether you meant it."] }
      ],
      closeChoices: [
        { text: "Tell him the route mattered more than the size of the lie.", effects: [{ type: "relationship", key: "Julian", delta: 1 }, { type: "npc", key: "Julian", trust: 1 }, { type: "flag", key: "volJulianRouteMattered", value: true }] },
        { text: "Ask what he wants to keep if nobody is watching.", effects: [{ type: "relationship", key: "Julian", delta: 1 }, { type: "npc", key: "Julian", trust: 1, attraction: 1 }, { type: "flag", key: "volJulianNobodyWatching", value: true }] },
        { text: "Pack the lens carefully and label the box dangerous.", effects: [{ type: "stat", key: "restraint", delta: 1 }, { type: "npc", key: "Julian", respect: 1 }, { type: "flag", key: "volJulianDangerBox", value: true }] }
      ]
    },
    {
      id: "vol_c09_theo_no_tablet",
      chapter: 9,
      title: "Theo, No Tablet",
      location: "Courtyard",
      locationId: "courtyard",
      focus: "Theo",
      label: "Find Theo without his tablet",
      detail: "He is standing in the courtyard committing suspicious acts of presence.",
      returnScene: "c09_hub_graduation_eve",
      openText: [
        "Theo is in the courtyard with no tablet, no probability overlay, and both hands in his pockets like he is trying to look casual about disarmament.",
        "\"I left it upstairs,\" he says before you ask. \"This is either growth or an equipment failure. We are waiting on peer review.\"",
        "The ocean wind keeps trying to turn the moment symbolic. Theo seems personally offended by the attempt."
      ],
      openChoices: [
        { text: "Ask what he wants before he calculates whether wanting is safe.", effects: [{ type: "relationship", key: "Theo", delta: 1 }, { type: "npc", key: "Theo", trust: 1, concern: -1 }, { type: "flag", key: "volTheoWantBeforeSafe", value: true }] },
        { text: "Tell him leaving the tablet upstairs counts even if he hates counting it.", effects: [{ type: "relationship", key: "Theo", delta: 1 }, { type: "stat", key: "foundationPath", delta: 1 }, { type: "flag", key: "volTheoTabletCounts", value: true }] },
        { text: "Offer to be peer review and immediately abuse the authority.", effects: [{ type: "relationship", key: "Theo", delta: 1 }, { type: "npc", key: "Theo", trust: 1 }, { type: "flag", key: "volTheoPeerReviewJoke", value: true }] }
      ],
      turnText: [
        "Theo looks toward the water for a long time.",
        "\"I want to stop treating fear like evidence that I am the only adult in the room,\" he says. \"I want to be useful without disappearing into usefulness. I want several things I cannot prove are wise.\"",
        "The confession arrives flat and careful. It is still the bravest thing he has done all week."
      ],
      turnVariants: [
        { conditions: [{ type: "flag", key: "theoRomance" }], text: ["If there is romance between you, the third want hangs in the air with your name nearby and Theo's eyes carefully not checking whether you heard it."] },
        { conditions: [{ type: "flag", key: "volTheoBothAnswers" }], text: ["He is holding both answers now: dangerous and hurt, useful and human, afraid and still here."] }
      ],
      closeChoices: [
        { text: "Tell him unproven wise things are still allowed to be chosen.", effects: [{ type: "relationship", key: "Theo", delta: 1 }, { type: "npc", key: "Theo", trust: 1, attraction: 1 }, { type: "flag", key: "volTheoAllowedChosen", value: true }] },
        { text: "Ask him to let other adults stay in the room with him.", effects: [{ type: "relationship", key: "Theo", delta: 1 }, { type: "stat", key: "foundationPath", delta: 1 }, { type: "flag", key: "volTheoOtherAdults", value: true }] },
        { text: "Stand beside him and let neither of you optimize the silence.", effects: [{ type: "stat", key: "restraint", delta: 1 }, { type: "npc", key: "Theo", trust: 1 }, { type: "flag", key: "volTheoUnoptimizedSilence", value: true }] }
      ]
    },
    {
      id: "vol_c10_vance_last_warning",
      chapter: 10,
      title: "Vance, Last Warning",
      location: "Graduation Hall",
      locationId: "graduation_hall",
      focus: "Vance",
      label: "Ask Vance for the last warning",
      detail: "He looks like he has one more unpleasant kindness left.",
      returnScene: "c10_hub_graduation",
      openText: [
        "Graduation Hall is filling outside the side corridor: families, staff, investors, future employers, people with opinions wearing expensive jackets. Vance stands by the stage door and does not look at the crowd unless he has to.",
        "\"Last warning,\" he says when you approach. \"The room will offer you simpler versions of yourself. Hero. Asset. Threat. Symbol. Do not accept a smaller life because the label fits on a badge.\"",
        "It is almost sentimental. He ruins it by checking the fire exits."
      ],
      openChoices: [
        { text: "Ask which label he thinks will tempt you most.", effects: [{ type: "relationship", key: "Vance", delta: 1 }, { type: "npc", key: "Vance", trust: 1 }, { type: "flag", key: "volVanceTemptLabel", value: true }] },
        { text: "Tell him some labels still open doors people need opened.", effects: [{ type: "stat", key: "heroPath", delta: 1 }, { type: "npc", key: "Vance", respect: 1 }, { type: "flag", key: "volLabelsOpenDoors", value: true }] },
        { text: "Ask whether refusing labels becomes another kind of performance.", effects: [{ type: "stat", key: "independentPath", delta: 1 }, { type: "npc", key: "Vance", respect: 1, friction: 1 }, { type: "flag", key: "volRefusingLabelsPerformance", value: true }] }
      ],
      turnText: [
        "Vance listens to the room for a moment. Applause rises for someone else's entrance, swells, and dies.",
        "\"Hero will tempt you if people are watching. Threat will tempt you if they are afraid. Asset will tempt you when exhaustion makes usefulness feel like peace.\"",
        "He finally looks at you. \"The dangerous one is whichever lets you stop choosing.\""
      ],
      turnVariants: [
        { conditions: [{ type: "flag", key: "volCostWorkDifference" }], text: ["The bait-plan conversation echoes here. Right calls can be hated. Useful labels can still be traps."] }
      ],
      closeChoices: [
        { text: "Tell him you will keep choosing even when the room applauds.", effects: [{ type: "relationship", key: "Vance", delta: 1 }, { type: "stat", key: "resolve", delta: 1 }, { type: "flag", key: "volKeepChoosingApplause", value: true }] },
        { text: "Ask him to judge the choices, not the label.", effects: [{ type: "relationship", key: "Vance", delta: 1 }, { type: "stat", key: "aegisTrust", delta: 1 }, { type: "flag", key: "volJudgeChoices", value: true }] },
        { text: "Nod once because anything more would turn into a speech.", effects: [{ type: "stat", key: "restraint", delta: 1 }, { type: "flag", key: "volVanceNoSpeech", value: true }] }
      ]
    }
  ].forEach(addArcPack);

  [
    {
      id: "vol_c02_camille_observation_stairs",
      chapter: 2,
      title: "Camille, The Stairs Above Baseline",
      location: "Observation Hall",
      locationId: "observation_hall",
      focus: "Camille",
      label: "Find Camille above the baseline queue",
      detail: "She is watching the queue from the stairs like the angle matters.",
      returnScene: "c02_hub_return_observation",
      openText: [
        "Camille stands on the observation stairs with the queue below her and the chamber beyond the glass. From here, the room becomes geometry: who waits close to the wall, who stands with friends, who keeps moving, who keeps still too hard.",
        "\"People think tests begin when the door opens,\" she says. \"They begin in the line. Sometimes before the building.\"",
        "She does not say your line has already started. She does not need to."
      ],
      openChoices: [
        { text: "Ask what your waiting posture is saying.", effects: [{ type: "relationship", key: "Camille", delta: 1 }, { type: "npc", key: "Camille", trust: 1 }, { type: "flag", key: "volCamilleWaitingPosture", value: true }] },
        { text: "Tell her observation changes behavior, so she is already part of the test.", effects: [{ type: "npc", key: "Camille", respect: 1, friction: 1 }, { type: "stat", key: "insight", delta: 1 }, { type: "flag", key: "volCamilleObserverPart", value: true }] },
        { text: "Ask who in the queue is hiding fear best.", effects: [{ type: "relationship", key: "Camille", delta: 1 }, { type: "stat", key: "control", delta: 1 }, { type: "flag", key: "volCamilleFearRead", value: true }] }
      ],
      turnText: [
        "Camille does not answer quickly, which you are learning means she is deciding whether precision would become cruelty.",
        "\"Your posture says you are trying to make responsibility look calm,\" she says at last. \"That is better than making fear look brave. It is still a performance.\"",
        "Below, a trainee jokes too loudly and then checks whether anyone important laughed. Camille's eyes move once. She files the moment somewhere you cannot see."
      ],
      turnVariants: [
        { conditions: [{ type: "flag", key: "volHatesSummary" }], text: ["Because you told her you hate being summarized, Camille gives the read like a draft instead of a verdict. That difference is small and very much on purpose."] }
      ],
      closeChoices: [
        { text: "Tell her calm responsibility is the performance you can live with today.", effects: [{ type: "relationship", key: "Camille", delta: 1 }, { type: "stat", key: "restraint", delta: 1 }, { type: "flag", key: "volCamilleLiveWithCalm", value: true }] },
        { text: "Ask her to keep correcting the read when it gets lazy.", effects: [{ type: "relationship", key: "Camille", delta: 1 }, { type: "npc", key: "Camille", trust: 1 }, { type: "flag", key: "volCamilleCorrectLazyRead", value: true }] },
        { text: "Admit you would rather be afraid accurately than brave theatrically.", effects: [{ type: "npc", key: "Camille", respect: 1 }, { type: "stat", key: "control", delta: 1 }, { type: "flag", key: "volAfraidAccurately", value: true }] }
      ]
    },
    {
      id: "vol_c02_ben_cafeteria_weight",
      chapter: 2,
      title: "Ben, Breakfast Weight",
      location: "Cafeteria",
      locationId: "cafeteria",
      focus: "Ben",
      label: "Sit with Ben before baseline",
      detail: "He has chosen a table where nobody has to perform being fine.",
      returnScene: "c02_hub_return_cafeteria",
      openText: [
        "Ben eats breakfast like an athlete who has learned that dread burns calories too. Two seats across from him are empty, not because he is unfriendly, but because the table has become a quiet zone by accident.",
        "\"You can sit,\" he says. \"I am not using the silence in a proprietary way.\"",
        "A resident nearby drops a fork and flinches at the sound. Nobody laughs. Ben looks relieved by that."
      ],
      openChoices: [
        { text: "Ask whether baseline day feels worse for people built to endure.", effects: [{ type: "relationship", key: "Ben", delta: 1 }, { type: "npc", key: "Ben", trust: 1, memory: "You asked Ben whether endurance made testing easier or lonelier." }, { type: "flag", key: "volBenEndureBaseline", value: true }] },
        { text: "Tell him silence is useful when it does not become isolation.", effects: [{ type: "relationship", key: "Ben", delta: 1 }, { type: "npc", key: "Ben", concern: -1 }, { type: "flag", key: "volBenSilenceIsolation", value: true }] },
        { text: "Ask what he eats before a room tries to turn him into data.", effects: [{ type: "npc", key: "Ben", trust: 1 }, { type: "stat", key: "insight", delta: 1 }, { type: "flag", key: "volBenDataBreakfast", value: true }] }
      ],
      turnText: [
        "Ben nudges a carton of juice toward you without making it a gesture.",
        "\"People built to endure get mistaken for uncomplicated,\" he says. \"That is the part I hate. If I walk out fine, someone decides the hit was reasonable. If I do not, they decide I failed at being me.\"",
        "He says this while buttering toast. The ordinary motion makes the sentence worse."
      ],
      turnVariants: [
        { conditions: [{ type: "flag", key: "volBenChoiceLine" }], text: ["You remember telling him taking it is not the same as choosing it. Breakfast gives the sentence a second life."] }
      ],
      closeChoices: [
        { text: "Tell him fine is not the same as reasonable.", effects: [{ type: "relationship", key: "Ben", delta: 1 }, { type: "npc", key: "Ben", trust: 1 }, { type: "flag", key: "volBenFineReasonable", value: true }] },
        { text: "Ask him to tell you later if the room makes endurance too convenient.", effects: [{ type: "relationship", key: "Ben", delta: 1 }, { type: "stat", key: "foundationPath", delta: 1 }, { type: "flag", key: "volBenEnduranceConvenient", value: true }] },
        { text: "Take the juice and let the quiet be shared instead of explained.", effects: [{ type: "stat", key: "restraint", delta: 1 }, { type: "npc", key: "Ben", trust: 1 }, { type: "flag", key: "volBenSharedQuiet", value: true }] }
      ]
    },
    {
      id: "vol_c03_jordan_admin_ethics",
      chapter: 3,
      title: "Jordan, Gossip Ethics",
      location: "Admin Wing",
      locationId: "admin_wing",
      focus: "Jordan",
      label: "Ask Jordan how rumors move through Aegis",
      detail: "They are reading the admin hallway like a live feed.",
      returnScene: "c03_hub_return_admin",
      openText: [
        "Jordan sits on a low windowsill outside Admin, one foot braced against the wall, tablet dark in their lap. Staff move past with folders, coffee, and the practiced neutrality of people carrying other people's futures.",
        "\"Rumors are like ventilation,\" Jordan says. \"You can pretend the building is sealed, but everyone breathes the same air eventually.\"",
        "They nod toward a closed door where your baseline report is probably becoming less yours by the minute."
      ],
      openChoices: [
        { text: "Ask what rumors should never be allowed to do.", effects: [{ type: "relationship", key: "Jordan", delta: 1 }, { type: "npc", key: "Jordan", respect: 1 }, { type: "flag", key: "volJordanRumorLimits", value: true }] },
        { text: "Ask whether they spread truth or steer it.", effects: [{ type: "npc", key: "Jordan", trust: 1, friction: 1 }, { type: "stat", key: "insight", delta: 1 }, { type: "flag", key: "volJordanSteerTruth", value: true }] },
        { text: "Tell them you need warning more than reputation management.", effects: [{ type: "relationship", key: "Jordan", delta: 1 }, { type: "stat", key: "contractorPath", delta: 1 }, { type: "flag", key: "volJordanWarningOverReputation", value: true }] }
      ],
      turnText: [
        "Jordan rolls the tablet between their hands and does not turn it on.",
        "\"Rumors should never choose for somebody,\" they say. \"Warn, soften, translate, distract. Fine. But the moment gossip steals agency, it becomes another institution with worse fonts.\"",
        "They glance at you sideways. \"Do not tell anyone I have principles. It would ruin my little brand.\""
      ],
      turnVariants: [
        { conditions: [{ type: "flag", key: "jordanBoundarySet" }], text: ["Because you set a boundary with Jordan early, they give the principle without making you pay for it in embarrassment."] }
      ],
      closeChoices: [
        { text: "Tell them principles look good on the brand, unfortunately.", effects: [{ type: "relationship", key: "Jordan", delta: 1 }, { type: "npc", key: "Jordan", trust: 1 }, { type: "flag", key: "volJordanPrinciplesBrand", value: true }] },
        { text: "Ask them to warn you when the room starts choosing for you.", effects: [{ type: "relationship", key: "Jordan", delta: 1 }, { type: "npc", key: "Jordan", trust: 1, respect: 1 }, { type: "flag", key: "volJordanAgencyWarning", value: true }] },
        { text: "Promise not to make their ethics public unless the joke is perfect.", effects: [{ type: "relationship", key: "Jordan", delta: 1 }, { type: "stat", key: "audacity", delta: 1 }, { type: "flag", key: "volJordanEthicsJoke", value: true }] }
      ]
    },
    {
      id: "vol_c03_rina_medical_reset",
      chapter: 3,
      title: "Rina, Reset Protocol",
      location: "Medical",
      locationId: "medical",
      focus: "Rina",
      label: "Find Rina ignoring Medical advice",
      detail: "She is standing beside a chair with the energy of someone refusing furniture.",
      returnScene: "c03_hub_return_medical",
      openText: [
        "Rina is in Medical with a compression wrap around one ankle and a face that suggests the chair has insulted her family. The medic says sit. Rina remains upright through what appears to be pure litigation.",
        "\"It is not injured,\" she says. \"It is temporarily opinionated.\"",
        "The medic looks at you like you have been recruited by proximity."
      ],
      openChoices: [
        { text: "Tell Rina sitting down is not surrender unless she makes it one.", effects: [{ type: "relationship", key: "Rina", delta: 1 }, { type: "npc", key: "Rina", respect: 1, friction: 1 }, { type: "flag", key: "volRinaSittingNotSurrender", value: true }] },
        { text: "Ask the medic what the reset protocol is actually teaching.", effects: [{ type: "stat", key: "control", delta: 1 }, { type: "status", key: "condition", value: "Recovery-aware" }, { type: "flag", key: "volResetProtocolQuestion", value: true }] },
        { text: "Offer to stand there looking annoying until she follows instructions.", effects: [{ type: "relationship", key: "Rina", delta: 1 }, { type: "npc", key: "Rina", trust: 1 }, { type: "flag", key: "volRinaAnnoyingSupport", value: true }] }
      ],
      turnText: [
        "Rina sits with the theatrical restraint of a monarch accepting exile. The medic immediately looks less tired.",
        "\"Reset protocol,\" the medic says, \"teaches acceleration variants to stop treating pain as a finish-line tax. Pain changes mechanics. Mechanics change outcomes. Outcomes change who gets hurt.\"",
        "Rina looks away first. That may be the only way she can admit the medic won."
      ],
      turnVariants: [
        { conditions: [{ type: "matureContent" }], text: ["The wrap tightens and glows faint blue. Rina's jaw sets as micro-tears knit under the skin with a sharp internal pull. She refuses to curse, which seems medically unnecessary and personally important."] }
      ],
      closeChoices: [
        { text: "Tell Rina mechanics are allowed to matter more than pride.", effects: [{ type: "relationship", key: "Rina", delta: 1 }, { type: "stat", key: "restraint", delta: 1 }, { type: "flag", key: "volRinaMechanicsOverPride", value: true }] },
        { text: "Ask her what she changes next run because she sat down now.", effects: [{ type: "npc", key: "Rina", respect: 1, trust: 1 }, { type: "flag", key: "volRinaNextRunChange", value: true }] },
        { text: "Side with the medic out loud and accept Rina's glare as payment.", effects: [{ type: "npc", key: "Rina", friction: 1, respect: 1 }, { type: "stat", key: "resolve", delta: 1 }, { type: "flag", key: "volRinaMedicGlare", value: true }] }
      ]
    },
    {
      id: "vol_c04_camille_mercy_geometry",
      chapter: 4,
      title: "Camille, Mercy Geometry",
      location: "Simulation Block A",
      locationId: "simulation_block",
      focus: "Camille",
      label: "Ask Camille about force redirection",
      detail: "She is rebuilding a sim failure from angles instead of excuses.",
      returnScene: "c04_hub_return_sim",
      openText: [
        "Camille has a failed sim replay open in wireframe. The room is all arrows: force, counterforce, debris path, civilian path, your projected output if panic made the first decision.",
        "\"People call my power defensive,\" she says. \"That is comforting and incomplete.\"",
        "She rewinds the clip to the instant before a falling beam would have killed three simulated civilians. Her redirection line hits it hard enough to make defense look very much like violence with manners."
      ],
      openChoices: [
        { text: "Ask when mercy needs to hit hard.", effects: [{ type: "relationship", key: "Camille", delta: 1 }, { type: "npc", key: "Camille", trust: 1, respect: 1 }, { type: "flag", key: "volCamilleMercyHits", value: true }] },
        { text: "Tell her defensive is what people say when they do not want to fear precision.", effects: [{ type: "stat", key: "insight", delta: 1 }, { type: "npc", key: "Camille", respect: 1 }, { type: "flag", key: "volCamilleFearPrecision", value: true }] },
        { text: "Ask where your power fits in the diagram without becoming the whole diagram.", effects: [{ type: "relationship", key: "Camille", delta: 1 }, { type: "stat", key: "control", delta: 1 }, { type: "flag", key: "volCamilleDiagramFit", value: true }] }
      ],
      turnText: [
        "Camille draws a smaller arrow beside yours.",
        "\"There,\" she says. \"You do not need to be the solution. You need to be a trustworthy part of one.\"",
        "The sentence lands harder than praise. It suggests limits without contempt, and usefulness without ownership. It also suggests she has been thinking about where to place you."
      ],
      turnVariants: [
        { conditions: [{ type: "flag", key: "volCamilleMarginNotes" }], text: ["This is another margin note in a different language: force arrows instead of sentences, same refusal to let one label own the whole situation."] }
      ],
      closeChoices: [
        { text: "Tell her being part of the solution sounds better than being the weapon.", effects: [{ type: "relationship", key: "Camille", delta: 1 }, { type: "stat", key: "foundationPath", delta: 1 }, { type: "flag", key: "volCamillePartSolution", value: true }] },
        { text: "Ask her to call you out when you start occupying the whole board.", effects: [{ type: "relationship", key: "Camille", delta: 1 }, { type: "npc", key: "Camille", trust: 1 }, { type: "flag", key: "volCamilleCallWholeBoard", value: true }] },
        { text: "Challenge her to leave room for herself in the diagram too.", effects: [{ type: "npc", key: "Camille", trust: 1, friction: 1 }, { type: "flag", key: "volCamilleRoomForSelf", value: true }] }
      ]
    },
    {
      id: "vol_c04_ben_impact_room",
      chapter: 4,
      title: "Ben, The Impact Room",
      location: "Training Wing",
      locationId: "training_wing",
      focus: "Ben",
      label: "Watch Ben run an impact calibration",
      detail: "He is about to make a horrible sound look ordinary.",
      returnScene: "c04_hub_training",
      openText: [
        "Ben stands in the impact lane while a trainer checks the numbers twice. The rig is a blunt machine with polite warning lights. It looks like it was designed by someone who apologized to the budget, not the body.",
        "\"Calibration,\" Ben says. \"They need to know what I can take today, not what I took last month.\"",
        "The word today carries the whole lesson."
      ],
      openChoices: [
        { text: "Ask whether he gets to choose the number.", effects: [{ type: "relationship", key: "Ben", delta: 1 }, { type: "npc", key: "Ben", trust: 1 }, { type: "flag", key: "volBenChooseNumber", value: true }] },
        { text: "Ask the trainer what stops the drill.", effects: [{ type: "stat", key: "control", delta: 1 }, { type: "flag", key: "volBenDrillStop", value: true }] },
        { text: "Tell Ben he does not have to make it look easy for you.", effects: [{ type: "relationship", key: "Ben", delta: 1 }, { type: "npc", key: "Ben", concern: -1, trust: 1 }, { type: "flag", key: "volBenNotEasy", value: true }] }
      ],
      turnText: [
        "The rig hits him. The room hears it. Ben slides half a step, breathes out, and lifts one hand to signal reset.",
        "He is fine. You can see how dangerous that sentence is. Fine can become permission in a building that loves numbers.",
        "Ben catches your face and gives a small shrug that says yes, exactly."
      ],
      turnVariants: [
        { conditions: [{ type: "matureContent" }], text: ["The impact blooms under his skin in a dark flush before his absorption eats the worst of it. The bruise starts forming, then fades unevenly, leaving a yellow ghost where the force ran out of places to go."] }
      ],
      closeChoices: [
        { text: "Tell him fine needs witnesses who know what it costs.", effects: [{ type: "relationship", key: "Ben", delta: 1 }, { type: "npc", key: "Ben", trust: 1 }, { type: "flag", key: "volBenFineWitness", value: true }] },
        { text: "Ask the trainer to log the half-step, not just the absorption.", effects: [{ type: "stat", key: "aegisTrust", delta: 1 }, { type: "npc", key: "Ben", respect: 1 }, { type: "flag", key: "volBenHalfStepLogged", value: true }] },
        { text: "Let Ben decide whether to reset again without making your concern the center.", effects: [{ type: "stat", key: "restraint", delta: 1 }, { type: "npc", key: "Ben", trust: 1 }, { type: "flag", key: "volBenConcernNotCenter", value: true }] }
      ]
    },
    {
      id: "vol_c05_piper_dock_pressure",
      chapter: 5,
      title: "Piper, Dock Pressure",
      location: "East Dock",
      locationId: "east_dock",
      focus: "Piper",
      label: "Ask Piper why the dock test matters",
      detail: "She is cheerful in a way that has started to mean look closer.",
      returnScene: "c05_hub_dock",
      openText: [
        "Piper sits on a concrete barrier with the bay behind her and one heel kicking the rhythm of a song only she can hear. The field test is still technically unofficial, which means everyone is acting like permission and bad judgment are cousins.",
        "\"Today is simple,\" she says. \"You fly, ideally not into a boat. Theo worries. Camille judges us from a morally superior distance. I look incredible.\"",
        "The joke is polished. Too polished."
      ],
      openChoices: [
        { text: "Ask what she wants the test to prove if the jokes stop helping.", effects: [{ type: "relationship", key: "Piper", delta: 1 }, { type: "npc", key: "Piper", trust: 1, concern: 1 }, { type: "flag", key: "volPiperDockProve", value: true }] },
        { text: "Tell her incredible is less useful than honest today.", effects: [{ type: "npc", key: "Piper", respect: 1, friction: 1 }, { type: "stat", key: "control", delta: 1 }, { type: "flag", key: "volPiperHonestDock", value: true }] },
        { text: "Play along but keep your eyes on the exits and waterline.", effects: [{ type: "relationship", key: "Piper", delta: 1 }, { type: "stat", key: "restraint", delta: 1 }, { type: "flag", key: "volPiperPlayExits", value: true }] }
      ],
      turnText: [
        "Piper watches a gull dive for something silver and miss.",
        "\"I want it to prove Aegis does not get to be the only place where we learn,\" she says. \"Walls make people behave. Docks, streets, bars, bad weather, civilians with phones. That is where powers actually have to be true.\"",
        "She hops down from the barrier. The grin returns, but now you can see what it is carrying."
      ],
      turnVariants: [
        { conditions: [{ type: "flag", key: "volPiperOursQuestion" }], text: ["Later, when she asks what ours could be, this dock answer will be part of it: powers true outside the walls, people true outside the file."] }
      ],
      closeChoices: [
        { text: "Tell her outside the walls is exactly why the plan needs more care.", effects: [{ type: "relationship", key: "Piper", delta: 1 }, { type: "stat", key: "heroPath", delta: 1 }, { type: "flag", key: "volPiperOutsideCare", value: true }] },
        { text: "Tell her true sounds better than approved.", effects: [{ type: "relationship", key: "Piper", delta: 1 }, { type: "stat", key: "independentPath", delta: 1 }, { type: "flag", key: "volPiperTrueApproved", value: true }] },
        { text: "Ask her to call you back if outside starts turning into spectacle.", effects: [{ type: "npc", key: "Piper", trust: 1, respect: 1 }, { type: "flag", key: "volPiperCallSpectacle", value: true }] }
      ]
    },
    {
      id: "vol_c05_theo_transit_exit_math",
      chapter: 5,
      title: "Theo, Exit Math",
      location: "Transit Platform",
      locationId: "transit_platform",
      focus: "Theo",
      label: "Ask Theo about the dock's exit math",
      detail: "He has counted the ways back and does not like the total.",
      returnScene: "c05_hub_return_transit",
      openText: [
        "Theo stands under the transit schedule with his tablet angled against glare. The dock route is open on one side of the screen. The other side is full of evacuation estimates, tide notes, civilian density, and three tiny red triangles he keeps moving.",
        "\"Everyone loves an entrance,\" he says. \"Exits are where competence goes to be graded.\"",
        "A shuttle doors open. People get off laughing, unaware they have briefly become variables."
      ],
      openChoices: [
        { text: "Ask which exit worries him most.", effects: [{ type: "relationship", key: "Theo", delta: 1 }, { type: "npc", key: "Theo", trust: 1 }, { type: "flag", key: "volTheoWorstExit", value: true }] },
        { text: "Tell him exit math is not cowardice.", effects: [{ type: "relationship", key: "Theo", delta: 1 }, { type: "npc", key: "Theo", concern: -1 }, { type: "flag", key: "volTheoExitNotCowardice", value: true }] },
        { text: "Ask whether he ever gets tired of being the person who sees the way out.", effects: [{ type: "relationship", key: "Theo", delta: 1 }, { type: "npc", key: "Theo", trust: 1, concern: 1 }, { type: "flag", key: "volTheoTiredExit", value: true }] }
      ],
      turnText: [
        "Theo zooms in on the dock's service lane.",
        "\"This one,\" he says. \"Not because it is worst. Because it looks best until everybody reaches it at once.\"",
        "He closes the route map with a little more force than necessary. \"And yes. I get tired. Then I remember exits are where people survive the part nobody wanted to storyboard.\""
      ],
      turnVariants: [
        { conditions: [{ type: "flag", key: "volTheoShapeEnough" }], text: ["Shape is enough for now, you think again. Theo has turned fear into a map without pretending the map is courage."] }
      ],
      closeChoices: [
        { text: "Tell him you will take exits as seriously as entrances.", effects: [{ type: "relationship", key: "Theo", delta: 1 }, { type: "stat", key: "control", delta: 1 }, { type: "flag", key: "volExitsAsEntrances", value: true }] },
        { text: "Ask him to share the map with Jordan before rumor fills the gaps.", effects: [{ type: "relationship", key: "Jordan", delta: 1 }, { type: "relationship", key: "Theo", delta: 1 }, { type: "flag", key: "volTheoJordanMap", value: true }] },
        { text: "Tell him he is allowed to want someone else to hold the exit too.", effects: [{ type: "relationship", key: "Theo", delta: 1 }, { type: "npc", key: "Theo", trust: 1, concern: -1 }, { type: "flag", key: "volTheoSharedExit", value: true }] }
      ]
    },
    {
      id: "vol_c06_julian_mask_room",
      chapter: 6,
      title: "Julian, Mask Room",
      location: "Event Horizon",
      locationId: "event_horizon",
      focus: "Julian",
      label: "Find Julian away from the table",
      detail: "He is checking a mirror that is almost certainly checking him back.",
      returnScene: "c06_hub_event",
      openText: [
        "Julian is in the short corridor near the restrooms, adjusting his collar in a mirror framed by soft gold light. The Event Horizon has mirrors placed where people can pretend they are checking appearances instead of exits.",
        "\"I know,\" he says without turning. \"I wandered off dramatically. Very on brand. Deeply suspicious.\"",
        "The mirror catches the room behind you: Kaito's staff, Camille's sightlines, Piper's bright restless posture, Theo trying to look like a person at dinner and not a forecasting instrument."
      ],
      openChoices: [
        { text: "Ask what part of tonight he is performing for himself.", effects: [{ type: "relationship", key: "Julian", delta: 1 }, { type: "npc", key: "Julian", trust: 1 }, { type: "flag", key: "volJulianPerformSelf", value: true }] },
        { text: "Tell him the room is too polished to trust any reflection.", effects: [{ type: "stat", key: "insight", delta: 1 }, { type: "npc", key: "Julian", respect: 1 }, { type: "flag", key: "volJulianReflectionTrust", value: true }] },
        { text: "Ask if charm gets heavier around Kaito.", effects: [{ type: "relationship", key: "Julian", delta: 1 }, { type: "relationship", key: "Kaito", delta: 1 }, { type: "flag", key: "volJulianKaitoHeavy", value: true }] }
      ],
      turnText: [
        "Julian's smile becomes small enough to fit the mirror.",
        "\"Kaito knew me before Aegis knew what to do with me,\" he says. \"There are people who remember your escape routes before they became tricks. It is rude. Useful, but rude.\"",
        "He fixes the collar again though it was never wrong."
      ],
      turnVariants: [
        { conditions: [{ type: "flag", key: "volJulianNobodyWatching" }], text: ["Later, when he asks what he wants to keep if nobody is watching, this mirror will still be behind the question."] }
      ],
      closeChoices: [
        { text: "Tell him old witnesses do not own the current performance.", effects: [{ type: "relationship", key: "Julian", delta: 1 }, { type: "npc", key: "Julian", trust: 1 }, { type: "flag", key: "volJulianOldWitness", value: true }] },
        { text: "Ask what escape route he wants that is not a trick.", effects: [{ type: "relationship", key: "Julian", delta: 1 }, { type: "npc", key: "Julian", trust: 1, concern: 1 }, { type: "flag", key: "volJulianNotTrickExit", value: true }] },
        { text: "Let him have the mirror and guard the corridor for one minute.", effects: [{ type: "stat", key: "restraint", delta: 1 }, { type: "npc", key: "Julian", trust: 1 }, { type: "flag", key: "volJulianGuardMirror", value: true }] }
      ]
    },
    {
      id: "vol_c06_jordan_anchor_network",
      chapter: 6,
      title: "Jordan, Network Effects",
      location: "The Rusty Anchor",
      locationId: "rusty_anchor",
      focus: "Jordan",
      label: "Ask Jordan what Blackwater is saying",
      detail: "They have three napkins, two rumors, and one actual concern.",
      returnScene: "c06_hub_return_anchor",
      openText: [
        "Jordan has built a map on the table out of napkins, condiment packets, and one olive spear they claim represents Aegis command. The Rusty Anchor does not care. The jukebox is too loud to be subpoenaed.",
        "\"Blackwater loves us,\" Jordan says. \"Not emotionally. Economically. Heroes buy drinks, villains break windows, contractors tip well when guilty.\"",
        "They move the olive spear from one napkin to another."
      ],
      openChoices: [
        { text: "Ask what the city fears about Aegis but will not say directly.", effects: [{ type: "relationship", key: "Jordan", delta: 1 }, { type: "npc", key: "Jordan", trust: 1, respect: 1 }, { type: "flag", key: "volJordanCityFear", value: true }] },
        { text: "Tell them networks can protect people or just turn them into weather.", effects: [{ type: "stat", key: "foundationPath", delta: 1 }, { type: "npc", key: "Jordan", respect: 1 }, { type: "flag", key: "volJordanNetworkWeather", value: true }] },
        { text: "Ask why they keep choosing the table where they can see everyone leave.", effects: [{ type: "relationship", key: "Jordan", delta: 1 }, { type: "npc", key: "Jordan", trust: 1, concern: 1 }, { type: "flag", key: "volJordanExitTable", value: true }] }
      ],
      turnText: [
        "Jordan spins the olive spear.",
        "\"The city fears Aegis will train people to be useful somewhere else and leave Blackwater with the cleanup,\" they say. \"It also fears we will stay. Cities are extremely talented at wanting contradictory things from dangerous people.\"",
        "They point at the exit. \"And I sit here because exits tell the truth first.\""
      ],
      turnVariants: [
        { conditions: [{ type: "flag", key: "volJordanAgencyWarning" }], text: ["They promised to warn you when rooms choose for you. Apparently cities are just larger rooms with better food."] }
      ],
      closeChoices: [
        { text: "Ask them to tell you when Blackwater starts writing your role for you.", effects: [{ type: "relationship", key: "Jordan", delta: 1 }, { type: "npc", key: "Jordan", trust: 1 }, { type: "flag", key: "volJordanCityRoleWarning", value: true }] },
        { text: "Tell them cleanup is a future worth planning before it becomes blame.", effects: [{ type: "stat", key: "heroPath", delta: 1 }, { type: "npc", key: "Jordan", respect: 1 }, { type: "flag", key: "volCleanupBeforeBlame", value: true }] },
        { text: "Move the olive spear somewhere less insulting to Vance.", effects: [{ type: "relationship", key: "Jordan", delta: 1 }, { type: "relationship", key: "Vance", delta: 1 }, { type: "flag", key: "volOliveVanceMoved", value: true }] }
      ]
    },
    {
      id: "vol_c07_camille_lock_protocol",
      chapter: 7,
      title: "Camille, Lock Protocol",
      location: "Briefing Room",
      locationId: "briefing_room",
      focus: "Camille",
      label: "Review lock protocol with Camille",
      detail: "Her contingency map has become too specific to ignore.",
      returnScene: "c07_hub_bait",
      openText: [
        "Camille has a lock protocol projected on the briefing wall: primary hold, secondary redirect, abort angle, medical corridor, casualty line. It is precise enough to make optimism look unserious.",
        "\"If Rhea adapts inside your field, we do not improvise the ethics in real time,\" she says.",
        "The word ethics sits in the room like equipment nobody wants to carry and everyone needs."
      ],
      openChoices: [
        { text: "Ask what she needs from you before force becomes panic.", effects: [{ type: "relationship", key: "Camille", delta: 1 }, { type: "stat", key: "control", delta: 1 }, { type: "flag", key: "volCamilleBeforePanic", value: true }] },
        { text: "Tell her the abort route should protect Rhea too if possible.", effects: [{ type: "relationship", key: "Camille", delta: 1 }, { type: "stat", key: "heroPath", delta: 1 }, { type: "flag", key: "volCamilleProtectRheaToo", value: true }] },
        { text: "Ask whether she trusts you enough for the lock.", effects: [{ type: "relationship", key: "Camille", delta: 1 }, { type: "npc", key: "Camille", trust: 1, friction: 1 }, { type: "flag", key: "volCamilleTrustLock", value: true }] }
      ],
      turnText: [
        "Camille answers by moving your marker on the map, not out of the plan but away from center.",
        "\"I trust you more if the plan does not require you to be the moral center of every second,\" she says. \"No one should have to be that impressive while terrified.\"",
        "It is the closest thing to softness she has ever delivered in the shape of a tactical correction."
      ],
      turnVariants: [
        { conditions: [{ type: "flag", key: "volCamillePartSolution" }], text: ["She is still teaching you to be part of a solution instead of the whole weapon. The lesson has teeth now."] }
      ],
      closeChoices: [
        { text: "Tell her moving you off-center makes the plan easier to trust.", effects: [{ type: "relationship", key: "Camille", delta: 1 }, { type: "stat", key: "aegisTrust", delta: 1 }, { type: "flag", key: "volOffCenterTrust", value: true }] },
        { text: "Ask her to call the abort even if you are too deep to want it.", effects: [{ type: "relationship", key: "Camille", delta: 1 }, { type: "stat", key: "restraint", delta: 1 }, { type: "flag", key: "volCamilleAbortAuthority", value: true }] },
        { text: "Tell her no one should have to be that impressive alone.", effects: [{ type: "relationship", key: "Camille", delta: 1 }, { type: "npc", key: "Camille", trust: 1 }, { type: "flag", key: "volImpressiveAlone", value: true }] }
      ]
    },
    {
      id: "vol_c07_theo_abort_branch",
      chapter: 7,
      title: "Theo, Abort Branch",
      location: "Observation Hall",
      locationId: "observation_hall",
      focus: "Theo",
      label: "Ask Theo about the branch he keeps hiding",
      detail: "He has minimized the same window four times.",
      returnScene: "c07_hub_bait",
      openText: [
        "Theo sits in the observation hall with the bait-plan probabilities open and one branch minimized in the corner. He keeps minimizing it. The window keeps existing.",
        "\"Do not ask,\" he says, which is how you know he knows you have already noticed.",
        "The branch label is too small to read from where you stand. Theo's knuckles around the stylus are not."
      ],
      openChoices: [
        { text: "Ask anyway, gently.", effects: [{ type: "relationship", key: "Theo", delta: 1 }, { type: "npc", key: "Theo", trust: 1 }, { type: "flag", key: "volTheoAskHiddenBranch", value: true }] },
        { text: "Tell him he does not have to show you to stop carrying it alone.", effects: [{ type: "relationship", key: "Theo", delta: 1 }, { type: "npc", key: "Theo", concern: -1, trust: 1 }, { type: "flag", key: "volTheoCarryAlone", value: true }] },
        { text: "Ask what condition makes the branch morally different.", effects: [{ type: "stat", key: "insight", delta: 1 }, { type: "npc", key: "Theo", respect: 1 }, { type: "flag", key: "volTheoMoralCondition", value: true }] }
      ],
      turnText: [
        "Theo opens the branch for two seconds. Long enough.",
        "It is the version where the plan saves the most people by letting you take the worst hit alone. The probability is not high. That is not the same as merciful.",
        "\"I hate that it exists,\" Theo says. \"I hate that part of me still filed it correctly.\""
      ],
      turnVariants: [
        { conditions: [{ type: "flag", key: "volTheoExitNotCowardice" }], text: ["Exit math was not cowardice. This is not cowardice either. It is what happens when care has to look at ugly rooms."] }
      ],
      closeChoices: [
        { text: "Tell him filing it is not the same as choosing it.", effects: [{ type: "relationship", key: "Theo", delta: 1 }, { type: "npc", key: "Theo", concern: -1, trust: 1 }, { type: "flag", key: "volTheoFilingNotChoosing", value: true }] },
        { text: "Ask him to promise the branch has to pass through you before becoming plan.", effects: [{ type: "relationship", key: "Theo", delta: 1 }, { type: "stat", key: "control", delta: 1 }, { type: "flag", key: "volTheoBranchConsent", value: true }] },
        { text: "Let him close the window and sit beside the grief of knowing.", effects: [{ type: "stat", key: "restraint", delta: 1 }, { type: "npc", key: "Theo", trust: 1 }, { type: "flag", key: "volTheoGriefKnowing", value: true }] }
      ]
    },
    {
      id: "vol_c08_julian_runway_spectacle",
      chapter: 8,
      title: "Julian, Runway Spectacle",
      location: "Aegis Airbase",
      locationId: "airbase_hangar",
      focus: "Julian",
      label: "Ask Julian why he is watching the Mach test",
      detail: "He has made a folding chair look like theater seating.",
      returnScene: "c08_hub_airbase",
      openText: [
        "Julian sits near the airbase safety line in a folding chair he has improved with absolutely unauthorized lighting. The runway stretches behind him, flat and severe, the opposite of stagecraft.",
        "\"This test has terrible composition,\" he says. \"Too much concrete. Not enough emotional honesty.\"",
        "Then Piper laughs from across the strip and Julian's expression changes before he can make it a bit."
      ],
      openChoices: [
        { text: "Ask what he is actually afraid of watching.", effects: [{ type: "relationship", key: "Julian", delta: 1 }, { type: "npc", key: "Julian", trust: 1, concern: 1 }, { type: "flag", key: "volJulianRunwayFear", value: true }] },
        { text: "Tell him spectacle can be how people stay present.", effects: [{ type: "relationship", key: "Julian", delta: 1 }, { type: "npc", key: "Julian", respect: 1 }, { type: "flag", key: "volJulianSpectaclePresent", value: true }] },
        { text: "Ask if the lighting is helping Piper or helping him.", effects: [{ type: "npc", key: "Julian", trust: 1, friction: 1 }, { type: "stat", key: "insight", delta: 1 }, { type: "flag", key: "volJulianLightingForWhom", value: true }] }
      ],
      turnText: [
        "Julian looks at the runway, not the light.",
        "\"I am afraid she will be brilliant and everyone will clap so loudly they forget she is breakable,\" he says. \"Speed makes people stupid. Beauty too. Disaster, constantly.\"",
        "He flicks one glamour marker on. It paints the safety boundary clearer, less pretty than useful."
      ],
      turnVariants: [
        { conditions: [{ type: "flag", key: "volJulianRouteMattered" }], text: ["The glamour is another evacuation route wearing a costume. You know how to see it now."] }
      ],
      closeChoices: [
        { text: "Tell him making the safety line visible counts as care.", effects: [{ type: "relationship", key: "Julian", delta: 1 }, { type: "stat", key: "heroPath", delta: 1 }, { type: "flag", key: "volJulianVisibleSafety", value: true }] },
        { text: "Ask him to keep the applause honest afterward.", effects: [{ type: "relationship", key: "Julian", delta: 1 }, { type: "npc", key: "Julian", trust: 1 }, { type: "flag", key: "volJulianHonestApplause", value: true }] },
        { text: "Let him have the joke and thank him for the boundary.", effects: [{ type: "npc", key: "Julian", respect: 1 }, { type: "flag", key: "volJulianBoundaryThanks", value: true }] }
      ]
    },
    {
      id: "vol_c08_vance_abort_order",
      chapter: 8,
      title: "Vance, Abort Order",
      location: "Aegis Airbase",
      locationId: "airbase_hangar",
      focus: "Vance",
      label: "Ask Vance who calls abort",
      detail: "The answer should be simple. His face says it is not.",
      returnScene: "c08_hub_airbase",
      openText: [
        "Vance stands at the airbase command table with three comm channels open. Medical, runway control, observation team. The test has so many safety layers it starts to feel like a dare.",
        "\"Abort authority is mine,\" he says. \"Medical can force it. Piper can call it. You can call it. Camille can recommend it loudly enough that ignoring her becomes an act of stupidity.\"",
        "He checks the channel again. \"The problem is never who can call abort. The problem is who believes it in time.\""
      ],
      openChoices: [
        { text: "Ask how to make yourself believe it while adrenaline argues.", effects: [{ type: "relationship", key: "Vance", delta: 1 }, { type: "stat", key: "control", delta: 1 }, { type: "flag", key: "volVanceBelieveAbort", value: true }] },
        { text: "Tell him the test needs a shame-free abort or it is theater.", effects: [{ type: "stat", key: "aegisTrust", delta: 1 }, { type: "npc", key: "Vance", respect: 1, friction: 1 }, { type: "flag", key: "volShameFreeAbort", value: true }] },
        { text: "Ask whether Piper really gets to call it without being punished later.", effects: [{ type: "relationship", key: "Piper", delta: 1 }, { type: "npc", key: "Vance", trust: 1 }, { type: "flag", key: "volPiperAbortNoPunish", value: true }] }
      ],
      turnText: [
        "Vance keys the comm. \"Abort is not failure. Repeat back.\"",
        "Runway control repeats it. Medical repeats it. Piper repeats it with a joke attached. Camille repeats it like she has been waiting to sue the concept of hesitation.",
        "Vance looks at you last. The ritual is blunt. It works anyway."
      ],
      turnVariants: [
        { conditions: [{ type: "flag", key: "volCancelPermitted" }], text: ["You asked for cancellation to feel permitted, not shameful. Vance appears to have taken that personally in the useful direction."] }
      ],
      closeChoices: [
        { text: "Repeat it back without making it noble.", effects: [{ type: "relationship", key: "Vance", delta: 1 }, { type: "stat", key: "restraint", delta: 1 }, { type: "flag", key: "volAbortRepeated", value: true }] },
        { text: "Ask Piper to say it once without the joke.", effects: [{ type: "relationship", key: "Piper", delta: 1 }, { type: "npc", key: "Piper", trust: 1, friction: 1 }, { type: "flag", key: "volPiperNoJokeAbort", value: true }] },
        { text: "Thank Camille in advance for being loud if everyone else gets stupid.", effects: [{ type: "relationship", key: "Camille", delta: 1 }, { type: "npc", key: "Camille", respect: 1 }, { type: "flag", key: "volCamilleLoudAbort", value: true }] }
      ]
    },
    {
      id: "vol_c09_vance_campus_walk",
      chapter: 9,
      title: "Vance, Campus Walk",
      location: "Courtyard",
      locationId: "courtyard",
      focus: "Vance",
      label: "Walk the campus perimeter with Vance",
      detail: "He is inspecting nothing in a way that means everything.",
      returnScene: "c09_hub_graduation_eve",
      openText: [
        "Vance walks the courtyard perimeter at the speed of a man inspecting locks and memories. Graduation lights are already being tested near the hall. They make the campus look festive and temporary.",
        "\"Most residents spend the last night deciding whether they hated this place,\" he says. \"Healthy instinct. Incomplete analysis.\"",
        "He stops beside a rail where the ocean wind cuts between buildings."
      ],
      openChoices: [
        { text: "Ask whether he thinks Aegis deserves to be missed.", effects: [{ type: "relationship", key: "Vance", delta: 1 }, { type: "npc", key: "Vance", trust: 1 }, { type: "flag", key: "volVanceDeservesMissed", value: true }] },
        { text: "Tell him a place can help you and still owe you better.", effects: [{ type: "stat", key: "foundationPath", delta: 1 }, { type: "npc", key: "Vance", respect: 1 }, { type: "flag", key: "volPlaceOwesBetter", value: true }] },
        { text: "Ask what he hopes you remember when you are angry later.", effects: [{ type: "relationship", key: "Vance", delta: 1 }, { type: "stat", key: "insight", delta: 1 }, { type: "flag", key: "volVanceAngryLater", value: true }] }
      ],
      turnText: [
        "Vance rests both hands on the rail.",
        "\"Aegis does not deserve affection,\" he says. \"People might. Lessons might. The fact that you learned to stop without being made smaller might.\"",
        "He looks uncomfortable with his own generosity. That makes it easier to believe."
      ],
      turnVariants: [
        { conditions: [{ type: "flag", key: "volPainNeedsReceipts" }], text: ["Pain needed receipts. Maybe so does gratitude. Vance, annoyingly, seems willing to provide both."] }
      ],
      closeChoices: [
        { text: "Tell him you can carry the lesson without forgiving the institution.", effects: [{ type: "relationship", key: "Vance", delta: 1 }, { type: "stat", key: "independentPath", delta: 1 }, { type: "flag", key: "volCarryLessonNotForgive", value: true }] },
        { text: "Ask what he learned from residents he could not protect.", effects: [{ type: "npc", key: "Vance", trust: 1, concern: 1 }, { type: "flag", key: "volVanceCouldNotProtect", value: true }] },
        { text: "Let the rare kindness pass without making him defend it.", effects: [{ type: "stat", key: "restraint", delta: 1 }, { type: "relationship", key: "Vance", delta: 1 }, { type: "flag", key: "volVanceKindnessPass", value: true }] }
      ]
    },
    {
      id: "vol_c10_core_four_backstage",
      chapter: 10,
      title: "The Core Four, Backstage",
      location: "Graduation Hall",
      locationId: "graduation_hall",
      focus: "Seth",
      label: "Find the core four backstage",
      detail: "Piper, Camille, Julian, and Theo are all waiting badly in different ways.",
      returnScene: "c10_hub_graduation",
      openText: [
        "Backstage, the four of them occupy the same narrow hallway like a diagram of incompatible coping strategies. Piper is near the exit. Camille is near the sightline. Julian is near the mirror. Theo is near everyone and pretending that was not on purpose.",
        "For a second, none of them performs at you. No speed joke, no correction, no flourish, no probability hedge.",
        "The silence has weight because it belongs to all of you."
      ],
      openChoices: [
        { text: "Ask what each of them needs from you after the stage.", effects: [{ type: "relationship", key: "Piper", delta: 1 }, { type: "relationship", key: "Camille", delta: 1 }, { type: "relationship", key: "Julian", delta: 1 }, { type: "relationship", key: "Theo", delta: 1 }, { type: "flag", key: "volCoreFourNeedsAfter", value: true }] },
        { text: "Tell them you are scared the room will turn all of you into roles.", effects: [{ type: "relationship", key: "Theo", delta: 1 }, { type: "relationship", key: "Julian", delta: 1 }, { type: "stat", key: "resolve", delta: 1 }, { type: "flag", key: "volCoreFourRoleFear", value: true }] },
        { text: "Make one terrible joke because if nobody does, Julian will strain something.", effects: [{ type: "relationship", key: "Piper", delta: 1 }, { type: "relationship", key: "Julian", delta: 1 }, { type: "stat", key: "audacity", delta: 1 }, { type: "flag", key: "volCoreFourTerribleJoke", value: true }] }
      ],
      turnText: [
        "Piper says, \"Do not vanish into noble.\" Camille says, \"Do not let them define clean as compliant.\" Julian says, \"Do not become so symbolically important that you stop being interesting at dinner.\" Theo says, \"Do not make fear drive and then call it destiny.\"",
        "They all look embarrassed afterward, which is how you know every line was real.",
        "The stage manager calls your name from the far door. The hallway does not let go right away."
      ],
      turnVariants: [
        { conditions: [{ type: "flag", key: "volCamilleWorthChoosing" }], text: ["Camille's eyes stay on you a fraction longer than the others. Personally inconvenient. Still chosen."] },
        { conditions: [{ type: "flag", key: "volJulianNobodyWatching" }], text: ["Julian's joke is ready. He does not use it. That is its own kind of line."] },
        { conditions: [{ type: "flag", key: "volTheoAllowedChosen" }], text: ["Theo looks terrified and present. Both answers, held at once."] },
        { conditions: [{ type: "flag", key: "volPiperOursQuestion" }], text: ["Piper's exit is right there. She stays until you move first."] }
      ],
      closeChoices: [
        { text: "Tell them you need them as people, not backup roles.", effects: [{ type: "relationship", key: "Piper", delta: 1 }, { type: "relationship", key: "Camille", delta: 1 }, { type: "relationship", key: "Julian", delta: 1 }, { type: "relationship", key: "Theo", delta: 1 }, { type: "flag", key: "volCoreFourPeopleNotRoles", value: true }] },
        { text: "Promise nothing except that you will stay reachable.", effects: [{ type: "stat", key: "restraint", delta: 1 }, { type: "relationship", key: "Theo", delta: 1 }, { type: "relationship", key: "Piper", delta: 1 }, { type: "flag", key: "volCoreFourReachable", value: true }] },
        { text: "Step toward the stage with their words still louder than the crowd.", effects: [{ type: "stat", key: "resolve", delta: 1 }, { type: "status", key: "stress", value: "Grounded by the team" }, { type: "flag", key: "volCoreFourGrounded", value: true }] }
      ]
    }
  ].forEach(addArcPack);

  [
    {
      id: "vol_train_c02_first_language",
      chapter: 2,
      title: "Train Power: First Language",
      location: "Training Wing",
      locationId: "training_wing",
      label: "Train power: first language",
      detail: "Make the power answer a simple instruction before baseline makes it dramatic.",
      returnScene: "c02_hub_return_sim",
      power: {
        energy: ["Your reservoir wants impact, heat, motion, hunger. The drill asks for a smaller miracle: take in one regulated pulse, hold it for three breaths, release it into a grounded sink instead of into the room."],
        gravity: ["The gravity field starts as pressure behind your eyes. The drill asks you to make one weighted cone around a marker, then let it go without the floor remembering you were there."],
        chronal: ["The moment frays when you reach for it. The drill asks for one slowed second, counted aloud, then released before your panic can try to live inside it."],
        bio: ["The room's living signals arrive all at once: pulse, sweat, nerves, your own stress trying to vote twice. The drill asks you to hear without grabbing."],
        tech: ["The training rig greets your signal like a suspicious handshake. The drill asks you to ping one sensor, mute one light, and leave the rest of the room alone."],
        space: ["Distance goes soft around the marker. The drill asks you to fold one inch into half an inch, then unfold it cleanly enough that the measuring laser forgives you."]
      },
      text: [
        "The first real training block is not impressive. No one claps for clean beginnings. The instructor puts you in a marked circle and asks for repeatable, boring, documented control.",
        "That should make it easier. It does not. Boring power is still power, and power dislikes being told to use an indoor voice."
      ],
      choices: [
        { text: "Make the smallest clean output and stop before pride can improve it.", effects: [{ type: "stat", key: "control", delta: 1 }, { type: "powerXp", amount: 2 }, { type: "status", key: "energy", value: "Clean low-output response" }, { type: "flag", key: "volTrainedFirstLanguageClean", value: true }] },
        { text: "Push one step higher so you know where the edge starts.", effects: [{ type: "stat", key: "audacity", delta: 1 }, { type: "powerXp", amount: 2 }, { type: "status", key: "stress", value: "Edge mapped" }, { type: "flag", key: "volTrainedFirstLanguageEdge", value: true }] },
        { text: "Stop early and write down exactly what changed in your body.", effects: [{ type: "stat", key: "restraint", delta: 1 }, { type: "powerXp", amount: 1 }, { type: "stat", key: "insight", delta: 1 }, { type: "flag", key: "volTrainedFirstLanguageNotes", value: true }] }
      ]
    },
    {
      id: "vol_train_c04_damage_clock",
      chapter: 4,
      title: "Train Power: Damage Clock",
      location: "Simulation Block A",
      locationId: "simulation_block",
      label: "Train power: damage clock",
      detail: "Practice stopping before training damage turns into proof-seeking.",
      returnScene: "c04_hub_return_sim",
      fatigue: 2,
      power: {
        energy: ["The sim feeds you heat in measured bites until your release hand trembles. The lesson is not how much you can hold. The lesson is recognizing the tremor before it becomes permission."],
        gravity: ["The weighted field pulls at the mat, the dummy, your knees. You practice letting gravity become a boundary instead of a punishment."],
        chronal: ["The sim asks you to slow an incoming strike without trapping yourself inside the anticipation. Each held second makes the next second hungrier."],
        bio: ["The biofeedback rig throws pain echoes at you: not real injuries, but close enough for the body to argue. You practice listening without obeying every alarm."],
        tech: ["The rig starts lying on purpose. Fault lights, false heat warnings, fake sensor loss. You practice fixing the system without making the system the only thing you can hear."],
        space: ["The chamber makes distance unreliable: close targets far, far targets suddenly intimate. You practice returning the room to itself before anyone has to trust your guess."]
      },
      text: [
        "This drill has a medic in the room and no one pretends that is decorative. The instructor calls it damage-clock training: learning the interval between useful discomfort and stupid injury.",
        "Aegis wants the interval in your body, not just your head. That makes the lesson honest and deeply irritating."
      ],
      choices: [
        { text: "Call the stop the instant the interval turns ugly.", effects: [{ type: "stat", key: "restraint", delta: 2 }, { type: "powerXp", amount: 2 }, { type: "status", key: "condition", value: "Stopped before injury" }, { type: "flag", key: "volTrainedDamageClockStop", value: true }] },
        { text: "Hold long enough to learn the warning without crossing it.", effects: [{ type: "stat", key: "control", delta: 1 }, { type: "powerXp", amount: 3 }, { type: "status", key: "condition", value: "Sore, medically cleared" }, { type: "flag", key: "volTrainedDamageClockHold", value: true }] },
        { text: "Overreach once, then let Medical document the lesson.", effects: [{ type: "stat", key: "audacity", delta: 1 }, { type: "powerXp", amount: 3 }, { type: "status", key: "condition", value: "Banged up from training" }, { type: "status", key: "lastFight", value: "Damage-clock overreach" }, { type: "flag", key: "volTrainedDamageClockOverreach", value: true }] }
      ]
    },
    {
      id: "vol_train_c06_social_noise",
      chapter: 6,
      title: "Train Power: Social Noise",
      location: "Training Wing",
      locationId: "training_wing",
      label: "Train power: social-noise control",
      detail: "Run a control drill with crowd pressure and deliberate distraction.",
      returnScene: "c06_hub_return_transit",
      power: {
        energy: ["The speakers layer laughter, alarms, and Piper saying your name from three directions. The reservoir does not care which stimuli are fake. You have to care enough for both of you."],
        gravity: ["The crowd sim keeps moving through your field edge. Every careless shoulder becomes a question: support, stop, or let pass. Gravity wants clean authority. People are messy."],
        chronal: ["Conversation fragments arrive a half-beat out of order. The trick is not forcing the room to match you. The trick is letting time be noisy without making it yours."],
        bio: ["The bio-sim floods you with false pulses and nervous systems that feel almost real. You practice refusing intimacy with data that did not consent to become yours."],
        tech: ["Every device in the mock crowd requests attention: watches, comms, cameras, vending locks. You practice not becoming customer service for the entire building."],
        space: ["The sim changes personal distance without warning. Too close, too far, exits shifted by inches. You practice making space safe without making it empty."]
      },
      text: [
        "The social-noise drill is humiliating because it works. Aegis can make a quiet room difficult. Making a loud room safe is the actual job.",
        "By the third run, your power is less bothered by the distractions than you are. That feels unfair and useful."
      ],
      choices: [
        { text: "Prioritize civilian-safe output over impressive response time.", effects: [{ type: "stat", key: "control", delta: 1 }, { type: "stat", key: "heroPath", delta: 1 }, { type: "powerXp", amount: 2 }, { type: "flag", key: "volTrainedSocialCivilianSafe", value: true }] },
        { text: "Practice the risky fast answer until it stops feeling like luck.", effects: [{ type: "stat", key: "audacity", delta: 1 }, { type: "powerXp", amount: 3 }, { type: "status", key: "stress", value: "High but directed" }, { type: "flag", key: "volTrainedSocialFastAnswer", value: true }] },
        { text: "Abort three runs in a row and make the room respect the stop.", effects: [{ type: "stat", key: "restraint", delta: 2 }, { type: "powerXp", amount: 2 }, { type: "flag", key: "volTrainedSocialAbort", value: true }] }
      ]
    },
    {
      id: "vol_train_c08_mach_residue",
      chapter: 8,
      title: "Train Power: Mach Residue",
      location: "Aegis Airbase",
      locationId: "airbase_hangar",
      label: "Train power: Mach-residue handling",
      detail: "Prepare for what remains in you after catching impossible speed.",
      returnScene: "c08_hub_airbase",
      fatigue: 2.5,
      power: {
        energy: ["The runway rig feeds kinetic residue into your reservoir in controlled blasts. The hard part is not taking it. The hard part is not letting stored speed become mood."],
        gravity: ["The rig drops weight through false impacts, asking you to decide what gets heavier and what gets spared. Momentum tries to become judgment. You refuse the shortcut."],
        chronal: ["The airbase sensors play impact moments back at ugly angles. You practice letting a violent second pass through you without letting it keep a room inside your nerves."],
        bio: ["The catch rehearsal maps stress through muscle, ligament, pulse, and breath. You practice reading strain before it becomes injury, including your own."],
        tech: ["Telemetry drones swarm the catch lane, each one begging to be believed. You practice listening to the system without letting the system replace your body."],
        space: ["The runway feels too long until the test begins, then not long enough. You practice folding distance into mercy instead of spectacle."]
      },
      text: [
        "The Mach-residue drill exists because catching a speedster is not over when the body stops moving. The force has to go somewhere. Aegis would prefer somewhere that is not the nearest wall, person, or emotional decision.",
        "Piper watches from a safe distance and clearly hates every word in that phrase."
      ],
      choices: [
        { text: "Design a clean bleed-off pattern before Piper runs.", effects: [{ type: "stat", key: "control", delta: 2 }, { type: "powerXp", amount: 3 }, { type: "relationship", key: "Piper", delta: 1 }, { type: "flag", key: "volTrainedMachBleedOff", value: true }] },
        { text: "Practice holding the residue until the panic passes.", effects: [{ type: "stat", key: "restraint", delta: 2 }, { type: "powerXp", amount: 3 }, { type: "status", key: "energy", value: "Residue contained" }, { type: "flag", key: "volTrainedMachHold", value: true }] },
        { text: "Ask Piper to call the moment your posture changes.", effects: [{ type: "relationship", key: "Piper", delta: 1 }, { type: "stat", key: "control", delta: 1 }, { type: "powerXp", amount: 2 }, { type: "flag", key: "volTrainedMachPiperCall", value: true }] }
      ]
    },
    {
      id: "vol_train_c09_final_private",
      chapter: 9,
      title: "Train Power: Private Threshold",
      location: "Rooftop",
      locationId: "rooftop",
      label: "Train power: private threshold",
      detail: "Use the last night to make power growth feel chosen instead of provoked.",
      returnScene: "c09_hub_return_rooftop",
      fatigue: 1.8,
      power: {
        energy: ["The city below offers a thousand lights and not one useful audience. Your reservoir opens quietly. For once, the absence of crisis feels like part of the exercise."],
        gravity: ["The rooftop rail, the ocean, the pull in your chest: all of it becomes a quiet negotiation with weight. You practice setting something down without dropping it."],
        chronal: ["The last night keeps trying to become memory before it is over. You practice letting the moment stay whole without freezing it for evidence."],
        bio: ["Your body is tired in specific ways now. You know more of its language. The drill is listening without turning every ache into emergency."],
        tech: ["Campus systems hum under the rooftop like a sleeping city. You practice touching the network lightly enough that it stays asleep."],
        space: ["From the roof, distance tells the truth and lies at once. The world is wide. Your next life is close. You practice making room without tearing it open."]
      },
      text: [
        "No instructor runs this drill. No timer counts down. The rooftop gives you wind, rail, city lights, and enough privacy to admit power growth does not only happen when someone scares it out of you.",
        "You set the terms yourself. That makes the success quieter. It also makes it harder to dismiss."
      ],
      choices: [
        { text: "Train toward control because the future deserves fewer accidents.", effects: [{ type: "stat", key: "control", delta: 2 }, { type: "powerXp", amount: 3 }, { type: "stat", key: "heroPath", delta: 1 }, { type: "flag", key: "volTrainedPrivateControl", value: true }] },
        { text: "Train toward restraint because wanting more is not the same as needing it.", effects: [{ type: "stat", key: "restraint", delta: 2 }, { type: "powerXp", amount: 3 }, { type: "stat", key: "foundationPath", delta: 1 }, { type: "flag", key: "volTrainedPrivateRestraint", value: true }] },
        { text: "Train toward readiness because the world will not ask politely.", effects: [{ type: "stat", key: "resolve", delta: 1 }, { type: "stat", key: "audacity", delta: 1 }, { type: "powerXp", amount: 3 }, { type: "flag", key: "volTrainedPrivateReadiness", value: true }] }
      ]
    }
  ].forEach(addTrainingPack);

  addVariants("c09_graduation_eve", [
    {
      conditions: [{ type: "flag", key: "volPiperPastKeys" }],
      text: ["Piper's quiet at dinner is not empty. It has the shape of the promenade rail, the past with keys, and the stubborn decision to keep building something anyway."]
    },
    {
      conditions: [{ type: "flag", key: "volCamillePeopleStrategy" }],
      text: ["Camille watches the booth like a strategist and a person, both at once now. The difference matters because she is letting it matter."]
    },
    {
      conditions: [{ type: "flag", key: "volJulianRouteMattered" }],
      text: ["Julian's jokes keep arriving, but you can see the evacuation route under them: where he points attention, where he protects the softer exit."]
    },
    {
      conditions: [{ type: "flag", key: "volTheoBothAnswers" }],
      text: ["Theo listens without the tablet in his hands for once. He still sees branches. He is also learning not to abandon the room he is standing in."]
    }
  ]);

  addVariants("c10_graduation", [
    {
      conditions: [{ type: "flag", key: "volKeepChoosingApplause" }],
      text: ["Vance's last warning stays under the applause: do not accept a smaller life because the label fits on a badge."]
    },
    {
      conditions: [{ type: "flag", key: "volTrainedPrivateControl" }],
      text: ["The private threshold drill makes the public room less hungry. You know what your power feels like when nobody forces it to prove itself."]
    },
    {
      conditions: [{ type: "flag", key: "volTrainedPrivateReadiness" }],
      text: ["Readiness sits in your shoulders without turning them rigid. The world will not ask politely, but you are no longer waiting for permission to answer."]
    }
  ]);
})();


/* AUTHORING_PACKS_VOLUME_START */
(function () {
  "use strict";

  const STORY = window.AEGIS_STORY;
  if (!STORY) return;
  const scenes = STORY.scenes;

  Object.assign(scenes, {
    "add_c01_julian_cafeteria": {
      "chapter": 1,
      "title": "Soft Landing, Sharp Edges",
      "location": "Cafeteria",
      "background": "aegis",
      "focus": "Julian",
      "text": [
        "The cafeteria is brighter than the rest of the building, which somehow makes it feel less honest. Rows of tables, a drink station with one machine already blinking for maintenance, bulletin screens cycling through dietary notices, quiet reminders about support resources, and tomorrow's assessment schedule like that belongs next to soup. People collect trays with the careful, mildly dissociated movements of adults pretending routine can be assembled by repetition alone.",
        "Julian moves through the line like he has understood for years that grace is just efficiency performed with consideration for other people. He steps aside for a trainee balancing too much on one tray, catches a carton before it tips, says something soft enough that the other man laughs instead of apologizing, and then looks back at you as though none of that counted as effort.",
        "\"You noticed,\" he says, once the two of you have made it to a small table near the windows.",
        "\"Noticed what?\"",
        "\"That orientation was engineered for three audiences at once. The frightened, the resentful, and the people already planning how to game every policy in the packet.\" He peels the lid back from a cup of tea and inspects the color with mild distrust. \"Aegis adores pretending those are separate demographics.\"",
        "Up close, Julian's polish resolves into detail rather than distance. His sleeves are rolled with mathematical neatness. One ring. Clean nails. A face so under conscious management that the moments when amusement escapes it feel almost indecently candid.",
        "\"You do this a lot?\" you ask.",
        "\"What, triage atmospheres before they become embarrassing? Constantly. It's a calling. A curse. An excuse not to discuss my hobbies.\"",
        "He says it lightly, but the line lands with just enough control around it to suggest truth hiding in the joke.",
        "Around you, the room keeps moving. Ben laughs somewhere behind you, low and surprised. Piper is at the far counter arguing with a vending machine like it has offended her morally. Camille is reading while standing up, because apparently sitting is too casual to accompany institutional disappointment. Theo has chosen a table with sightlines to both exits and is pretending that was accidental.",
        "\"This place is full of adults who learned to become legible in self-defense,\" Julian says. \"It's dreadful for the complexion but fascinating for the rest of us.\"",
        "\"Us?\"",
        "\"The observant. The vain. The socially overqualified. Pick whichever category flatters me least.\" He takes a sip, makes a face at the tea, and continues anyway. \"The point is that Aegis isn't merely training powers. It's curating what kind of stories we will be allowed to become in public.\"",
        "That should sound theatrical from almost anyone else. From him, it sounds uncomfortably precise.",
        "\"And what story do they want from you?\" you ask.",
        "Julian glances at you over the rim of the cup. For the first time since sitting down, the expression he gives you is not polished on arrival. It is simply tired.",
        "\"Preferably one that photographs well and never bleeds in a way reporters can describe.\" Then the easier smile slips back into place. \"Forgive me. First-day charm. Usually I make people wait until at least dinner before I become unsuitably sincere.\"",
        "There is room here to laugh it off with him. There is also room not to."
      ],
      "choices": [
        {
          "text": "Tell him he's allowed to be sincere before dinner if the tea is this bad.",
          "effects": [
            {
              "type": "relationship",
              "key": "Julian",
              "delta": 2
            },
            {
              "type": "flag",
              "key": "c01_julian_private_ease",
              "value": true
            },
            {
              "type": "memory",
              "key": "Julian",
              "text": "You made room for sincerity instead of performing back at him."
            }
          ],
          "next": "c01_lounge"
        },
        {
          "text": "Say he sounds like someone who has already survived being packaged once.",
          "effects": [
            {
              "type": "relationship",
              "key": "Julian",
              "delta": 2
            },
            {
              "type": "relationship",
              "key": "Theo",
              "delta": 1
            },
            {
              "type": "flag",
              "key": "c01_julian_seen",
              "value": true
            },
            {
              "type": "memory",
              "key": "Julian",
              "text": "You saw the armor and did not mock it."
            }
          ],
          "next": "c01_lounge"
        },
        {
          "text": "Deflect with a joke about the tea being the real villain here.",
          "effects": [
            {
              "type": "relationship",
              "key": "Julian",
              "delta": 1
            },
            {
              "type": "stat",
              "key": "guardedness",
              "delta": 1
            },
            {
              "type": "flag",
              "key": "c01_julian_banter_only",
              "value": true
            }
          ],
          "next": "c01_lounge"
        }
      ]
    },
    "add_c01_theo_walk": {
      "chapter": 1,
      "title": "The Long Way Around",
      "location": "North Walkway",
      "background": "aegis",
      "focus": "Theo",
      "text": [
        "Theo does not exactly invite company. He simply fails to shake you off before the corridor turns into the north walkway and the opportunity to split cleanly passes. The glass along one side shows the training lawns, the perimeter fencing beyond them, and a slice of late light flattening over the campus grounds. The other side holds office doors, safety signage, and one framed donor plaque that somehow makes the whole building look guiltier.",
        "\"You actually answered the camera thing,\" you say.",
        "\"That was a mistake.\"",
        "\"You say that like I'm grading you.\"",
        "\"No,\" Theo says, adjusting the strap of the bag at his shoulder. \"I say it like this place probably is.\"",
        "His dry tone lands late enough that you almost miss it. When you laugh, he glances at you as if surprised you bothered to listen closely enough to catch the joke.",
        "\"You're new,\" he says after a moment. \"So maybe useful information: people here are going to sort you fast. Dangerous, stable, cooperative, exhausting, worth the paperwork, not worth the paperwork. They'll call it assessment because classification sounds impolite.\"",
        "\"And what category did you put me in?\"",
        "\"Underdetermined.\" His mouth tightens in what might, under generous conditions, count as humor. \"Which is irritating.\"",
        "A trainee bursts out of a side door farther down the hall with a staff escort at his elbow and a medic behind them. No sirens. No shouting. Just one set of people moving briskly and another pretending that makes it normal. Theo tracks the movement without stopping his own pace.",
        "\"Does that happen often?\" you ask.",
        "\"Often enough that no one in this building is impressed by calm voices anymore.\"",
        "The line should sound bleak. From him it sounds more like exhausted respect for reality.",
        "\"You always watch rooms like that?\"",
        "\"Only the ones with walls.\" He says it deadpan, then, perhaps because he can tell from your face that you are deciding whether he is joking, adds, \"Mostly yes.\"",
        "Outside, two trainees cross the lawn arguing with the intimate ferocity of people who met yesterday and immediately decided to matter to each other. A grounds cart hums past. Somewhere overhead, the ventilation kicks harder into life.",
        "\"Everyone here acts like power is the big problem,\" Theo says. \"Usually the real problem is what people start believing they're allowed to do once they think they've become necessary.\"",
        "He says it without looking at you. Not accusing. Not warning exactly. Just placing a piece on the board between you.",
        "It would be easy to leave the line there, nod, and keep moving. It would also be easy to test what happens when you do not."
      ],
      "choices": [
        {
          "text": "Tell him that sounds less like theory and more like experience.",
          "effects": [
            {
              "type": "relationship",
              "key": "Theo",
              "delta": 2
            },
            {
              "type": "flag",
              "key": "c01_theo_taken_seriously",
              "value": true
            },
            {
              "type": "memory",
              "key": "Theo",
              "text": "You treated his caution like intelligence, not nerves."
            }
          ],
          "next": "c01_ben_walk"
        },
        {
          "text": "Say you'll settle for becoming necessary later. First you'd like a room key.",
          "effects": [
            {
              "type": "relationship",
              "key": "Theo",
              "delta": 1
            },
            {
              "type": "relationship",
              "key": "Piper",
              "delta": 1
            },
            {
              "type": "flag",
              "key": "c01_theo_lightened",
              "value": true
            }
          ],
          "next": "c01_ben_walk"
        },
        {
          "text": "Ask whether he always meets people by handing them a warning label.",
          "effects": [
            {
              "type": "relationship",
              "key": "Theo",
              "delta": 1
            },
            {
              "type": "relationship",
              "key": "Camille",
              "delta": 1
            },
            {
              "type": "flag",
              "key": "c01_theo_friction_flirt",
              "value": true
            }
          ],
          "next": "c01_ben_walk"
        }
      ]
    },
    "add_c01_camille_corridor": {
      "chapter": 1,
      "title": "Measured Distance",
      "location": "Administrative Corridor",
      "background": "aegis",
      "focus": "Camille",
      "text": [
        "Camille does not invite you to follow her. She also does nothing to prevent it. Which, from her, appears to be the same thing as granting an audience.",
        "The administrative corridor is quieter than the common spaces and colder by a degree or two, the kind of temperature adjustment that suggests either server rooms nearby or someone on payroll who believes human beings think more clearly when mildly uncomfortable. Glass offices line one wall. Through one of them you catch a glimpse of Vance speaking to a staff member with the expression of a man who has learned that leadership consists largely of deciding which problems are allowed to become tomorrow's emergency.",
        "\"That was not permission,\" Camille says without looking back.",
        "\"No?\"",
        "\"No. It was an assessment of whether you understood subtext.\"",
        "\"And do I?\"",
        "She stops beside a narrow window overlooking the intake drive. Outside, a transport van pulls away from the curb. New arrivals tomorrow. More after that. The machine keeps eating names.",
        "\"You're still here,\" she says. \"So probably.\"",
        "Up close, her restraint reads less like coldness and more like expenditure management. Nothing in her is casual. Even stillness looks chosen. She slides the tablet under one arm, folds the other over it, and studies you with the frankness of someone who sees no reason to pretend people are not always making judgments.",
        "\"Most people misuse first impressions,\" she says. \"They either overshare because they mistake candor for depth, or they perform a version of themselves they cannot sustain. Both are inefficient.\"",
        "\"That's a bleak opening philosophy.\"",
        "\"It's an accurate one.\"",
        "The line is dry enough that it almost qualifies as humor. Almost.",
        "\"So what does an efficient first impression look like to you?\" you ask.",
        "\"Competence. Restraint. The ability to tell the difference between confidence and appetite.\"",
        "There is no visible challenge in her face. That makes the line feel more dangerous, not less.",
        "\"And if someone's appetite is competent?\"",
        "One eyebrow lifts by a fraction. \"Then the paperwork becomes more interesting.\"",
        "That gets a laugh out of you before you can help it. The corner of her mouth shifts, not quite into a smile but close enough to prove the machinery exists.",
        "\"Aegis rewards people who can remain useful while frightened,\" she says. \"That matters more than bravado. Fear is normal. Sloppiness is a choice.\"",
        "It is not a speech. It is not a warning. It is something more intimate than either, mostly because she is spending valuable honesty on you at all.",
        "\"And what if I don't enjoy being sorted into useful?\" you ask.",
        "\"Then decide early whether you intend to become difficult, exceptional, or both.\"",
        "She starts walking again, then glances back just long enough for the look to land like a knife set down gently on a table.",
        "\"For what it's worth,\" she says, \"you don't read as forgettable.\""
      ],
      "choices": [
        {
          "text": "Tell her that sounded dangerously close to a compliment.",
          "effects": [
            {
              "type": "relationship",
              "key": "Camille",
              "delta": 2
            },
            {
              "type": "flag",
              "key": "c01_camille_compliment",
              "value": true
            },
            {
              "type": "memory",
              "key": "Camille",
              "text": "You met her precision with deliberate confidence."
            }
          ],
          "next": "c01_room_assignment"
        },
        {
          "text": "Say you'll aim for exceptional and leave difficult available as needed.",
          "effects": [
            {
              "type": "relationship",
              "key": "Camille",
              "delta": 2
            },
            {
              "type": "relationship",
              "key": "Piper",
              "delta": 1
            },
            {
              "type": "flag",
              "key": "c01_camille_exceptional",
              "value": true
            }
          ],
          "next": "c01_room_assignment"
        },
        {
          "text": "Tell her you haven't decided whether being forgettable sounds restful.",
          "effects": [
            {
              "type": "relationship",
              "key": "Camille",
              "delta": 1
            },
            {
              "type": "relationship",
              "key": "Theo",
              "delta": 1
            },
            {
              "type": "flag",
              "key": "c01_camille_guarded",
              "value": true
            }
          ],
          "next": "c01_room_assignment"
        }
      ]
    },
    "add_c01_piper_stairs": {
      "chapter": 1,
      "title": "Half a Flight Ahead",
      "location": "East Stairwell",
      "background": "aegis",
      "focus": "Piper",
      "text": [
        "Piper does not so much leave the corridor as ricochet out of it. By the time you push through the stairwell door she is already halfway up the first flight, leaning over the rail toward you with a grin like she is delighted you passed some internal audit she never warned you about.",
        "\"Good,\" she says. \"You looked like you might be terminally reasonable for a second back there. I was preparing to stage an intervention.\"",
        "\"Against what?\"",
        "\"Institutional compliance. It's ugly on most people.\" She drops down two steps in one light burst of motion and then catches herself, as if the body wants to do more than the building has authorized. \"Before you ask, yes, I know there are cameras in here too. I object on principle, not because I have illusions.\"",
        "The stairwell smells faintly of dust and industrial cleaner. Somewhere above you a door bangs open and shut. Piper leans one shoulder to the wall, still vibrating with withheld movement.",
        "\"Do you always run on this much caffeine?\" you ask.",
        "\"No. Sometimes it's adrenaline. Sometimes denial. Sometimes the deeply spiritual power of refusing to let a bad system make me boring.\"",
        "She says everything like the sentence only just occurred to her and she trusts it anyway. It should read careless. Instead it feels practiced in the way some people practice not drowning.",
        "\"You hate it here already?\"",
        "\"I hate being managed like an incident report with cheekbones.\" The grin flashes and is gone just fast enough to make you doubt you saw the edge under it. \"But the people are promising. That's harder to resent.\"",
        "The line lands between the two of you with enough directness that it would be a waste to pretend not to hear it.",
        "She watches your face, openly curious, not embarrassed in the slightest by her own interest. That may be honesty. It may be courage. It may be recklessness wearing better lighting.",
        "\"What's your move?\" she asks. \"Not the packet answer. The real one. You going to be good, difficult, useful, gorgeous, catastrophic? There are subcategories if you need them.\"",
        "\"Comforting that you've built a taxonomy this fast.\"",
        "\"Please. I've been here long enough to know everyone is auditioning whether they mean to or not.\" She hooks her fingers over the rail. \"Question is whether you're auditioning for them or for yourself.\"",
        "Piper should feel chaotic. Instead she feels exact in a different direction than Camille: less measured, more immediate, but not less perceptive. She notices reactions with the body first. She clocks hesitation like velocity.",
        "\"And what's your category?\" you ask.",
        "\"Currently? Fast enough to be useful, charming enough to make that everyone's problem.\" She says it breezily, then studies you with sharp green interest. \"You can laugh. It was at least fifty percent serious.\"",
        "There is air in this conversation for flirtation, for honesty, for mutual trouble, or for one of you to flinch first."
      ],
      "choices": [
        {
          "text": "Tell her charming enough to be a problem sounds promising, actually.",
          "effects": [
            {
              "type": "relationship",
              "key": "Piper",
              "delta": 2
            },
            {
              "type": "flag",
              "key": "c01_piper_flirt_open",
              "value": true
            },
            {
              "type": "memory",
              "key": "Piper",
              "text": "You met her momentum with open interest."
            }
          ],
          "next": "c01_room_assignment"
        },
        {
          "text": "Say you'll decide what you are after you've seen who deserves what version.",
          "effects": [
            {
              "type": "relationship",
              "key": "Piper",
              "delta": 2
            },
            {
              "type": "relationship",
              "key": "Camille",
              "delta": 1
            },
            {
              "type": "flag",
              "key": "c01_piper_challenged",
              "value": true
            }
          ],
          "next": "c01_room_assignment"
        },
        {
          "text": "Ask what version of this place she hates most: the rules or the watching.",
          "effects": [
            {
              "type": "relationship",
              "key": "Piper",
              "delta": 1
            },
            {
              "type": "relationship",
              "key": "Theo",
              "delta": 1
            },
            {
              "type": "flag",
              "key": "c01_piper_serious_seen",
              "value": true
            }
          ],
          "next": "c01_room_assignment"
        }
      ]
    },
    "add_c01_med_spike": {
      "chapter": 1,
      "title": "Baseline, Not Comfort",
      "location": "Med Wing",
      "background": "med",
      "focus": "Seth",
      "text": [
        "The med wing is lit too gently to be reassuring. Soft panels. Sound-dampened floors. Doors that slide instead of swing, as if even noise might count as escalation here. The whole place has the unnerving calm of a facility that knows panic is easier to prevent than to treat.",
        "The problem with that strategy is that your body does not appear interested in participating.",
        "It starts small. A wrongness under the skin. A pressure misjudged by whatever part of you is still learning the difference between power and self. Then the sensation sharpens. The edges of your awareness go strange. Heat or drag or static or imbalance or too much not-quite-distance slides through your limbs like the power is testing whether you are built to contain it or merely adjacent to it.",
        "\"Easy,\" the medic says, which is one of those words that instantly becomes useless when spoken at the exact moment nothing about the situation feels easy.",
        "You are guided onto the edge of a narrow bed behind a privacy screen. A cuff bites at your arm. Something cool is pressed to the inside of your wrist. The medic asks questions in a competent, maddeningly level voice: dizziness, pain, visual disturbance, nausea, disorientation, involuntary discharge, perceived trigger. The list is too polished not to have history behind it.",
        "Another staff member is halfway through logging numbers on a tablet when the curtain shifts and someone pauses just outside.",
        "It is Ben first, broad frame filling part of the gap before he catches himself and steps back enough to stop looking like an accidental barricade. \"They said someone needed the bed,\" he says. \"I wasn't trying to stare.\"",
        "Behind him, farther down the corridor, Jordan has clearly noticed the situation and equally clearly decided that hovering visibly would be rude. They tilt their head once in something like silent acknowledgment and keep moving. A second later Piper nearly barrels around the corner, sees the screen, and stops with a full-body adjustment so abrupt it looks painful.",
        "\"You're okay?\" she says. Not joke-first. Not light. Just immediate.",
        "\"They are being evaluated,\" the medic says before you can answer. Which is probably meant to be helpful and somehow makes you feel more like a weather event than a person.",
        "Piper's jaw tightens. Camille appears behind her a heartbeat later, not because she was running but because she moves quickly enough that she rarely needs to. Her eyes flick once over the setup: equipment, posture, whether the room is controlled. Theo arrives last and looks like he hates all of it, including the fact that he is here to witness it.",
        "\"We're fine,\" you say, though the sentence lands with varying levels of credibility depending on who is hearing it.",
        "\"No one says 'we're fine' in med and means anything useful,\" Piper says.",
        "\"Piper,\" Camille says.",
        "\"What? I'm right.\"",
        "Julian does not crowd the curtain. He appears in the reflected glass of a cabinet first, then in the doorway itself, carrying two paper cups he absolutely did not have when he turned the last corridor. One goes to the nearest nurse without interrupting her work. The other he keeps. Of course he does.",
        "\"For whatever it's worth,\" he says lightly, gaze resting on you instead of the equipment, \"this is still a better first-day story than dying of paperwork.\"",
        "The line should be ridiculous. It helps anyway.",
        "The medic finishes the scan, checks the display, and exhales through the nose. \"Instability spike,\" she says. \"Not uncommon. We can stabilize symptoms. The larger issue is likely over-response to stress and novelty until training catches up.\"",
        "\"So,\" Piper says, folding her arms with all the brittle energy of a person trying very hard not to reveal she was worried, \"great news. You're normal for this building.\"",
        "Theo drags a hand over the back of his neck. \"That's a horrifying sentence.\"",
        "\"And yet,\" Julian says, lifting his cup in a little toast, \"comfortingly on-brand.\"",
        "Camille's attention stays on you. \"Can you stand?\" she asks.",
        "It is the simplest question in the room. It is also the one that feels most respectful."
      ],
      "choices": [
        {
          "text": "Admit you need another minute and let them see you not being invincible.",
          "effects": [
            {
              "type": "relationship",
              "key": "Camille",
              "delta": 1
            },
            {
              "type": "relationship",
              "key": "Theo",
              "delta": 1
            },
            {
              "type": "relationship",
              "key": "Julian",
              "delta": 1
            },
            {
              "type": "flag",
              "key": "c01_med_honest",
              "value": true
            },
            {
              "type": "status",
              "key": "condition",
              "value": "Stabilizing"
            }
          ],
          "next": "c01_intake_night"
        },
        {
          "text": "Tell Piper that if this counts as normal, she's banned from saying the place is boring.",
          "effects": [
            {
              "type": "relationship",
              "key": "Piper",
              "delta": 2
            },
            {
              "type": "relationship",
              "key": "Julian",
              "delta": 1
            },
            {
              "type": "flag",
              "key": "c01_med_banter",
              "value": true
            },
            {
              "type": "status",
              "key": "condition",
              "value": "Stabilizing"
            }
          ],
          "next": "c01_intake_night"
        },
        {
          "text": "Stand anyway. Slow. Controlled. Refuse to let the room decide what shape you're in.",
          "effects": [
            {
              "type": "relationship",
              "key": "Camille",
              "delta": 1
            },
            {
              "type": "relationship",
              "key": "Piper",
              "delta": 1
            },
            {
              "type": "stat",
              "key": "control",
              "delta": 1
            },
            {
              "type": "flag",
              "key": "c01_med_controlled",
              "value": true
            },
            {
              "type": "status",
              "key": "condition",
              "value": "Banged up"
            }
          ],
          "next": "c01_intake_night"
        }
      ]
    },
    "add_c01_ben_laundry": {
      "chapter": 1,
      "title": "Weight Distribution",
      "location": "Laundry Room",
      "background": "aegis",
      "focus": "Ben",
      "text": [
        "The laundry room is one of the few places in Aegis that feels honestly inhabited rather than professionally maintained. Someone left a sock on top of one machine like a tiny surrender flag. A marker-scrawled sign over the folding table reads IF IT'S BEEN HERE THREE DAYS IT BELONGS TO THE BUILDING NOW. The dryers hum. The air is warm and smells like detergent and the ghost of industrial-grade fabric softener.",
        "Ben is standing in front of one open machine with a basket balanced against one thigh, staring at a tangled knot of sheets like he is trying to negotiate with it on moral terms.",
        "\"I was told adulthood would contain less of this,\" he says when he notices you there. \"Or at least better rewards for surviving it.\"",
        "In the brighter, uglier honesty of the laundry room, he looks younger than he did in the hall and more tired around the edges. Not weak. Just used. There is a difference. People probably miss it because his body makes an argument on behalf of durability before he ever opens his mouth.",
        "\"You need help?\" you ask.",
        "\"Probably not. But I want help, which I think is different and should be socially protected.\"",
        "That earns a laugh out of you. He grins, relieved enough by the reaction that you suspect too many people default to treating him as dependable infrastructure.",
        "You help untangle the sheets. Ben folds with the square care of someone who was either raised by practical people or learned the hard way that chaos spreads when not actively opposed.",
        "\"So what's your deal?\" he asks after a minute. \"Actual deal. Not orientation-deal.\"",
        "\"You asking everybody?\"",
        "\"No. Some people answer like job interviews. You seem like you might not if I catch you off guard.\"",
        "It's such a quietly competent line that you glance at him again.",
        "\"People underestimate you,\" you say.",
        "\"Constantly. Sometimes it's useful. Sometimes it means they hand me the heavy thing and forget heavy isn't the same as mine.\" He shrugs one shoulder. \"Impact absorption. It's amazing how many adults hear that and immediately decide I exist to prove a bad idea survivable.\"",
        "There is no bitterness in the sentence, exactly. But there is shape around old irritation.",
        "\"That happen here too?\"",
        "\"Less than outside. Still enough that I notice who's asking me to hold the line and who's checking whether I wanted to.\"",
        "That lands harder than the easy tone suggests it should. Around here, choice and usefulness are going to blur fast. Ben sounds like someone who already knows what that costs.",
        "He lifts one folded towel, then another, and gives you a look equal parts amused and appraising. \"You seem like one of the ones who notices things. That can make you decent company or incredibly exhausting. Still collecting data.\""
      ],
      "choices": [
        {
          "text": "Tell him he can add 'good in a laundry crisis' to the data.",
          "effects": [
            {
              "type": "relationship",
              "key": "Ben",
              "delta": 2
            },
            {
              "type": "relationship",
              "key": "Julian",
              "delta": 1
            },
            {
              "type": "flag",
              "key": "c01_ben_easy",
              "value": true
            }
          ],
          "next": "c01_hub_after_orientation"
        },
        {
          "text": "Say you don't plan on treating him like a shield with a pulse.",
          "effects": [
            {
              "type": "relationship",
              "key": "Ben",
              "delta": 2
            },
            {
              "type": "relationship",
              "key": "Theo",
              "delta": 1
            },
            {
              "type": "flag",
              "key": "c01_ben_seen",
              "value": true
            },
            {
              "type": "memory",
              "key": "Ben",
              "text": "You recognized he is not just what he can absorb."
            }
          ],
          "next": "c01_hub_after_orientation"
        },
        {
          "text": "Ask who in this place actually checks whether he wants to carry something.",
          "effects": [
            {
              "type": "relationship",
              "key": "Ben",
              "delta": 1
            },
            {
              "type": "relationship",
              "key": "Camille",
              "delta": 1
            },
            {
              "type": "flag",
              "key": "c01_ben_question",
              "value": true
            }
          ],
          "next": "c01_hub_after_orientation"
        }
      ]
    },
    "add_c01_jordan_boundary": {
      "chapter": 1,
      "title": "Useful Information, Dangerous Hands",
      "location": "Common Room",
      "background": "aegis",
      "focus": "Jordan",
      "text": [
        "The common room is trying hard to pass itself off as a neutral social zone, which only works if you have never seen a room become political around a coffee table. There are two couches, one chair nobody takes because it somehow radiates confrontation, a television mounted high enough to discourage ownership, and three separate surfaces that already have packets, chargers, or mugs claiming territory.",
        "Jordan is on the arm of one couch with a tablet balanced on one knee, not really reading so much as watching everyone else pretend they are not watching each other. Their expression shifts when you come in: not surprise, exactly. More like a mental note being upgraded into a usable category.",
        "\"You have the look,\" they say, \"of someone who has already figured out this place is one-third training facility, one-third housing, and one-third an accidental social experiment with paperwork.\"",
        "\"Only one-third accidental?\"",
        "\"I'm trying to be generous on your first day.\"",
        "Jordan's humor lands clean and fast, but what sits underneath it is sharper than Piper's and less decorative than Julian's. They are not chasing sparkle for its own sake. They are watching where people lean when no one has formally assigned the room its shape yet.",
        "\"So what's your function?\" you ask.",
        "\"Depends who you ask. Officially? Pattern recognition with social emphasis. Unofficially? I know who's pretending to be fine, who's lying badly, and which arguments in this building are about ethics versus ego wearing ethics as a fake mustache.\"",
        "\"That sounds exhausting.\"",
        "\"Only when people assume knowing things means I owe them the inventory.\" They set the tablet down face-first beside them. \"Which is the useful first-day boundary, by the way. If I tell you something because it affects your safety, that's one thing. If you start treating me like a gossip faucet with excellent pronouns, I become much less charming.\"",
        "The line is said lightly enough to invite laughter, but not lightly enough to excuse misunderstanding.",
        "Across the room, Piper is losing a low-stakes argument about card games with Ben. Theo is pretending not to monitor it. Julian enters, surveys the room once, and chooses a chair that gives him both visibility and aesthetics. Camille is absent, which somehow still changes the room by absence alone.",
        "\"You and Camille get along?\" you ask before you can stop yourself.",
        "Jordan's grin widens. \"Interesting choice. See? This is why I never get bored.\"",
        "\"You didn't answer.\"",
        "\"She likes precision. I like precision. The difference is that she applies hers like a scalpel and I apply mine like a rumor with ethics.\" Jordan tips their head. \"For what it's worth, if she bothered noticing you on day one, congratulations. That's either excellent news or terrible. Possibly both.\"",
        "They study you another second, then add, \"The real question is whether you're the kind of person who gets more honest under pressure or more strategic. I should know before deciding whether to be helpful later.\""
      ],
      "choices": [
        {
          "text": "Tell Jordan you're strategic about systems and honest with people who earn it.",
          "effects": [
            {
              "type": "relationship",
              "key": "Jordan",
              "delta": 2
            },
            {
              "type": "relationship",
              "key": "Camille",
              "delta": 1
            },
            {
              "type": "flag",
              "key": "c01_jordan_boundary_respected",
              "value": true
            }
          ],
          "next": "c01_hub_after_orientation"
        },
        {
          "text": "Say you'll settle for not using anybody like a faucet.",
          "effects": [
            {
              "type": "relationship",
              "key": "Jordan",
              "delta": 2
            },
            {
              "type": "relationship",
              "key": "Theo",
              "delta": 1
            },
            {
              "type": "flag",
              "key": "c01_jordan_clean_hands",
              "value": true
            },
            {
              "type": "memory",
              "key": "Jordan",
              "text": "You accepted their boundary without trying to be cute about it."
            }
          ],
          "next": "c01_hub_after_orientation"
        },
        {
          "text": "Ask what category Jordan has you in so far.",
          "effects": [
            {
              "type": "relationship",
              "key": "Jordan",
              "delta": 1
            },
            {
              "type": "relationship",
              "key": "Julian",
              "delta": 1
            },
            {
              "type": "flag",
              "key": "c01_jordan_invited_read",
              "value": true
            }
          ],
          "next": "c01_hub_after_orientation"
        }
      ]
    },
    "add_c01_rooftop_breath": {
      "chapter": 1,
      "title": "Air Above Procedure",
      "location": "Rooftop Access",
      "background": "night",
      "focus": "Seth",
      "text": [
        "The rooftop access is technically not a rooftop, which is probably why Aegis allows it to exist. Half-enclosed, fenced, heavy with the sound of ventilation and the low electric hum of the campus at night. The air outside the door is colder than the corridors below and honest in a way recirculated air never manages.",
        "From here, Aegis Point looks less like an institution and more like a collection of intentions bolted together under budget constraints. Lit windows in blocks. Dark stretches between them. One sweep of security lighting over the perimeter at regular intervals. Somewhere farther out, the city pretending to be separate from all this.",
        "You are not alone for long.",
        "Whoever joins you depends on the route tone you've leaned toward, but the structure is the same: the chapter gives you a breath and asks what kind of person you are when no one is formally assessing you.",
        "If it is Piper, she arrives with her hands in the pockets of a jacket she should probably have abandoned for warmth and asks whether you came up here to escape the building or yourself. There is a grin with the question, but not enough of one to make the seriousness disappear.",
        "If it is Camille, she steps out, closes the door behind her with clinical quiet, and says the air is preferable to listening to half the floor pretend day one did not get under their skin. It is the closest thing to solidarity she has offered all day.",
        "If it is Julian, he leans against the railing and says the place looks almost beautiful from far enough away, which is true and therefore suspicious. Then he asks what version of yourself you are planning to give them tomorrow.",
        "If it is Theo, he comes up because sleep and first-day adrenaline have incompatible values, admits that without embarrassment, and asks whether your power feels more like an extension or an intrusion yet.",
        "If no core-four route is strong enough for a private rooftop scene, the moment can remain solitary: campus lights, first-day fatigue, the awareness that by this time tomorrow the place will know your name in a dozen different administrative contexts and maybe one or two human ones.",
        "Either way, the scene should feel like the first moment the chapter lets you breathe without demanding performance. That matters. The whole game will work better if the player gets moments where silence is not empty but chosen."
      ],
      "choices": [
        {
          "text": "Stay a little longer and be honest, if only once today.",
          "effects": [
            {
              "type": "relationship",
              "key": "Piper",
              "delta": 1
            },
            {
              "type": "relationship",
              "key": "Camille",
              "delta": 1
            },
            {
              "type": "relationship",
              "key": "Julian",
              "delta": 1
            },
            {
              "type": "relationship",
              "key": "Theo",
              "delta": 1
            },
            {
              "type": "flag",
              "key": "c01_rooftop_honest",
              "value": true
            }
          ],
          "next": "add_c01_common_room_night"
        },
        {
          "text": "Keep the moment light. First day gets enough of your blood already.",
          "effects": [
            {
              "type": "relationship",
              "key": "Piper",
              "delta": 1
            },
            {
              "type": "relationship",
              "key": "Julian",
              "delta": 1
            },
            {
              "type": "flag",
              "key": "c01_rooftop_light",
              "value": true
            }
          ],
          "next": "add_c01_common_room_night"
        },
        {
          "text": "Leave before the moment turns into something you'll have to remember too clearly.",
          "effects": [
            {
              "type": "relationship",
              "key": "Camille",
              "delta": 1
            },
            {
              "type": "relationship",
              "key": "Theo",
              "delta": 1
            },
            {
              "type": "stat",
              "key": "guardedness",
              "delta": 1
            },
            {
              "type": "flag",
              "key": "c01_rooftop_withdrew",
              "value": true
            }
          ],
          "next": "add_c01_common_room_night"
        }
      ]
    },
    "add_c02_camille_stairs": {
      "chapter": 2,
      "title": "Camille Stairs",
      "location": "Observation Stairwell",
      "background": "sim",
      "focus": "Camille",
      "text": [
        "Camille catches you on the stairwell that loops down from the observation deck to the review corridor below. It is quiet there in the institutional way of places built for transit, the sounds from the gallery arriving as softened echoes through concrete and metal. She has one hand on the rail, the other braced around a folder she is not reading because she is too busy studying you.",
        "\"You recover quickly,\" she says.",
        "It is not small talk. With her, almost nothing is.",
        "The stairwell light cuts sharp planes over her face and catches the gold seam in her black training jacket. Yesterday, she watched you the way people watch unstable machinery they might someday need to trust. Today the look is different. Not softer. More specific.",
        "\"If you expected me to be less vertical after that,\" you say, \"I'm deeply sorry to disappoint.\"",
        "A corner of her mouth shifts, not quite enough to be called a smile. \"I expected one of three things,\" she says. \"A crash. Showmanship. Or concealment. You chose...\" Her gaze flicks over you once. \"A stranger mix.\"",
        "Depending on how you moved through the first day, the line lands differently. If you challenged her and held up under it, she sounds almost interested. If you kept yourself guarded, there is still distance in it. If there was an unmistakable current between you yesterday, it shows now not in warmth but in attention sharp enough to feel physical.",
        "She steps aside just enough that the conversation becomes a choice rather than an interception. \"Baseline tests make people legible,\" she says. \"Or they think they do. That can be useful. It can also be dangerous.\"",
        "Below, a door opens. Voices rise and fade again. Somewhere deeper in the building, an alarm chirps once and is immediately silenced.",
        "\"You asked the right question yesterday,\" Camille says. \"Most people here are so desperate to prove they are extraordinary that they stop asking what the system is actually measuring. That tends to get other people hurt.\"",
        "It is, from her, almost generous.",
        "If you pushed too hard on day one, you can feel that she has not forgotten it. If you were precise, she has not forgotten that either. If you gave her a reason to think you only perform control when watched, this is the part where she waits to see if you contradict yourself.",
        "\"I'm not asking whether you can do impressive things,\" she says. \"I already know that answer. I'm asking whether you understand what impression costs once other people start building plans around it.\"",
        "It is both a professional question and absolutely not only that.",
        "The stairwell is empty. The place would be colder if not for the heat still riding under your skin from the test bay. Camille notices that too. Of course she does.",
        "\"You don't have to decide what I am this week,\" you say.",
        "\"No,\" she says, and there it is again, that almost-smile, gone fast. \"But I do have to decide whether you are careless. That part is time-sensitive.\"",
        "A few beats pass. The silence is not awkward. With her, silence feels like a surface you can step onto if you are careful.",
        "\"Tuesday and Thursday, Sim C,\" she says at last, referencing the invitation hanging between you since yesterday or offering its earlier shape if you deflected it. \"You can observe. Or prove me wrong in a more interesting way.\"",
        "She starts down the steps, then stops one landing below and glances back. \"And for the record,\" she says, \"if you decide to flirt with me, do not do it lazily.\"",
        "Then she continues down the stairwell like she did not just say that at all."
      ],
      "choices": [
        {
          "text": "Tell her lazy would insult both of you and ask what would count as interesting.",
          "effects": [
            {
              "type": "npc",
              "key": "Camille",
              "trust": 1,
              "respect": 0
            },
            {
              "type": "relationship",
              "key": "Camille",
              "delta": 2
            },
            {
              "type": "flag",
              "key": "add_c02_camille_stairs_choice_1",
              "value": true
            },
            {
              "type": "stat",
              "key": "control",
              "delta": 1
            }
          ],
          "timeMinutes": 15,
          "next": "c02_hub_return_observation"
        },
        {
          "text": "Say you'll take the invitation and keep the rest of the conversation pending.",
          "effects": [
            {
              "type": "npc",
              "key": "Camille",
              "trust": 0,
              "respect": 1
            },
            {
              "type": "relationship",
              "key": "Camille",
              "delta": 1
            },
            {
              "type": "flag",
              "key": "add_c02_camille_stairs_choice_2",
              "value": true
            },
            {
              "type": "stat",
              "key": "restraint",
              "delta": 1
            }
          ],
          "timeMinutes": 15,
          "next": "c02_hub_return_observation"
        },
        {
          "text": "Ask whether her concern is really about carelessness or about whether she can trust you under pressure.",
          "effects": [
            {
              "type": "npc",
              "key": "Camille",
              "trust": 0,
              "respect": 0
            },
            {
              "type": "relationship",
              "key": "Camille",
              "delta": 1
            },
            {
              "type": "flag",
              "key": "add_c02_camille_stairs_choice_3",
              "value": true
            },
            {
              "type": "stat",
              "key": "resolve",
              "delta": 1
            }
          ],
          "timeMinutes": 15,
          "next": "c02_hub_return_observation"
        },
        {
          "text": "Let her go with only a dry, 'Noted,' and save the rest for later.",
          "effects": [
            {
              "type": "npc",
              "key": "Camille",
              "trust": 0,
              "respect": 0
            },
            {
              "type": "relationship",
              "key": "Camille",
              "delta": 1
            },
            {
              "type": "flag",
              "key": "add_c02_camille_stairs_choice_4",
              "value": true
            },
            {
              "type": "stat",
              "key": "audacity",
              "delta": 1
            }
          ],
          "timeMinutes": 15,
          "next": "c02_hub_return_observation"
        }
      ]
    },
    "add_c02_piper_track": {
      "chapter": 2,
      "title": "Piper Track",
      "location": "Training Courtyard Track",
      "background": "sim",
      "focus": "Piper",
      "text": [
        "The training courtyard track is empty in the narrow slice of time between scheduled sessions, which in Aegis terms means it belongs to Piper for as long as no one with a clipboard claims otherwise. She is already there when you step out through the side doors, one foot on the painted inside line, the other bouncing restlessly against the ground as if standing still is a trick she can only manage while insulting it.",
        "She brightens when she sees you and hides it only slightly. \"Good,\" she says. \"You survived the thermally invasive judging circle. I was afraid they might keep you in a box.\"",
        "\"That would make your morning less interesting,\" you say.",
        "\"Exactly. Very rude to me personally.\"",
        "She starts walking before you answer, forcing you to either fall into step or make a point of not doing it. The track curves around a scrubbed rectangle of artificial turf and low observation cameras. Beyond the fencing, morning light turns the glass of the main facility pale and clean. Somewhere overhead, a drone shifts position with the quiet insect hum of constant supervision.",
        "Piper walks like she is half a second from accelerating even when she is trying not to. There is energy coiled in everything she does, even the way she glances over at you. Yesterday may have started something between you or not. Either way, today she is less interested in first impression and more interested in whether you can keep the rhythm.",
        "\"So,\" she says, \"what are we? Tragic cautionary tale? Facility favorite? Unlicensed fire hazard with suspicious cheekbones?\"",
        "\"Do those categories overlap?\"",
        "\"With enough confidence, absolutely.\"",
        "She cuts a look at you that goes sharp for a beat. \"You had the room,\" she says, meaning the baseline, the landing after, maybe more than that. \"Some people go weird when that happens. Bigger. Louder. Or they do that very annoying thing where they start pretending they never wanted attention in the first place.\"",
        "\"And which one are you hoping for?\"",
        "She laughs. \"I'm hoping you're fun and not stupid. That is an incredibly narrow market around here.\"",
        "If you gave her flirtation yesterday, she meets it now without coyness. If you did not, the edge is still there, just easier to call banter. What matters is that she is inviting you to decide whether this is an atmosphere or a direction.",
        "She stops at the curve and turns, walking backward for a few steps with the casual insolence of someone who trusts her body more than architecture. \"Race me to the gate,\" she says.",
        "\"That seems rigged.\"",
        "\"It is. Life is cruel. Keep up.\"",
        "Before you can answer, she flickers forward-not full speed, just enough to make the air between one second and the next feel edited. Then she is at the gate, one hand on the chain link, looking delighted with herself.",
        "When you get there, she leans in close enough that her grin becomes dangerous in a different way. \"See?\" she says softly. \"You look better moving.\"",
        "The sentence should be unserious. She says it like it is and isn't.",
        "Then her expression changes, not dramatically, just enough to let reality in. \"For what it's worth,\" she says, \"if they push you too hard too fast, don't make them drag it out of you by force of committee. Tell somebody before you turn into a cautionary mural.\"",
        "The sincerity lands because it arrives without warning.",
        "You study her for a second. The speed, the wit, the whole bright impossible presentation. Under it there is a woman who understands exactly how fast a body can turn from impressive to breakable.",
        "She sees you seeing it and immediately ruins the moment on purpose. \"Also,\" she says, lighter now, \"if you become a cautionary mural, I'm absolutely stealing the best quote from your plaque.\"",
        "\"Good to know your priorities.\"",
        "\"Oh, sweetheart, my priorities are excellent. They're just fast.\"",
        "The courtyard doors hiss open behind you as another training group spills out laughing too loudly, full of the ugly relief that comes after being measured and not found wanting. Piper glances back, then returns her attention to you like the rest of the facility is only weather.",
        "\"You coming to dinner later,\" she says, \"or are you planning to spend the whole day being mysteriously competent in hallways until people start writing fan fiction?\"",
        "It is the kind of question that can still be an invitation, or a dare, or both."
      ],
      "choices": [
        {
          "text": "Tell her dinner depends on whether she's planning to spend it flirting or trying to outrun the conversation.",
          "effects": [
            {
              "type": "npc",
              "key": "Piper",
              "trust": 1,
              "respect": 0,
              "attraction": 1
            },
            {
              "type": "relationship",
              "key": "Piper",
              "delta": 2
            },
            {
              "type": "flag",
              "key": "add_c02_piper_track_choice_1",
              "value": true
            },
            {
              "type": "stat",
              "key": "control",
              "delta": 1
            }
          ],
          "timeMinutes": 15,
          "next": "c02_hub_return_courtyard"
        },
        {
          "text": "Say yes to dinner and ask what she counts as 'fun and not stupid.'",
          "effects": [
            {
              "type": "npc",
              "key": "Piper",
              "trust": 0,
              "respect": 1
            },
            {
              "type": "relationship",
              "key": "Piper",
              "delta": 1
            },
            {
              "type": "flag",
              "key": "add_c02_piper_track_choice_2",
              "value": true
            },
            {
              "type": "stat",
              "key": "restraint",
              "delta": 1
            }
          ],
          "timeMinutes": 15,
          "next": "c02_hub_return_courtyard"
        },
        {
          "text": "Tell her you'll come if she promises not to turn concern into a joke every time it gets close to honest.",
          "effects": [
            {
              "type": "npc",
              "key": "Piper",
              "trust": 0,
              "respect": 0,
              "attraction": 1
            },
            {
              "type": "relationship",
              "key": "Piper",
              "delta": 1
            },
            {
              "type": "flag",
              "key": "add_c02_piper_track_choice_3",
              "value": true
            },
            {
              "type": "stat",
              "key": "resolve",
              "delta": 1
            }
          ],
          "timeMinutes": 15,
          "next": "c02_hub_return_courtyard"
        },
        {
          "text": "Deflect with a grin and tell her she's very demanding for someone rigging races before lunch.",
          "effects": [
            {
              "type": "npc",
              "key": "Piper",
              "trust": 0,
              "respect": 0
            },
            {
              "type": "relationship",
              "key": "Piper",
              "delta": 1
            },
            {
              "type": "flag",
              "key": "add_c02_piper_track_choice_4",
              "value": true
            },
            {
              "type": "stat",
              "key": "audacity",
              "delta": 1
            }
          ],
          "timeMinutes": 15,
          "next": "c02_hub_return_courtyard"
        }
      ]
    },
    "add_c02_julian_lounge": {
      "chapter": 2,
      "title": "Julian Lounge",
      "location": "Residence Lounge",
      "background": "aegis",
      "focus": "Julian",
      "text": [
        "Julian claims one corner of the residence lounge like it was designed specifically to flatter him. The couch is too angular to be comfortable, the coffee table is scarred with old mug rings, and the lighting is the kind of overhead wash that makes every human being look like a suspect in a procedural. He has somehow turned the whole arrangement into a look.",
        "He is not alone when you arrive; two trainees drift away within seconds, either because the conversation has ended or because Julian let them know it had. What remains is the faint scent of bad coffee, a muted wall screen running silent campus updates, and Julian studying you over the rim of a paper cup like the morning has finally supplied something worth his time.",
        "\"There you are,\" he says. \"I was beginning to think the observation deck had confiscated you for aesthetic reasons.\"",
        "\"If it had, I assume you'd have organized an appeal.\"",
        "\"Please. I would have organized a superior replacement and made the loss feel strategic.\"",
        "If yesterday gave the two of you a line to pick up, he does it cleanly. He never recaps. He simply proceeds as though continuity is a courtesy intelligent people extend to one another.",
        "He gestures at the opposite end of the couch. \"Sit. You're distressing the room by hovering like a man considering whether furniture is a trap.\"",
        "You sit.",
        "Julian folds one leg beneath himself and tilts his head. \"You did well this morning,\" he says. \"Not merely well enough to impress the kind of people who believe clipboards are character traits. Well enough to make several of the trainees currently pretending not to care care very much.\"",
        "\"Am I supposed to be grateful?\"",
        "\"No. Just informed.\" He watches you for a moment. \"This place has two favorite sports. The first is institutional overreach. The second is deciding who everyone is after one dramatic morning. I like to know which game is being played before I choose my outfit.\"",
        "There is a smile in it, but not just one.",
        "If you treated him seriously yesterday, there is less lacquer over the conversation now. If you only traded wit, he stays graceful and just off-center. If there was unmistakable interest, he lets it breathe without pressing.",
        "\"You know what the problem with dazzling people early is?\" he says.",
        "\"That there are worse problems?\"",
        "\"That they stop seeing the work and start seeing the myth. Then they either worship it, resent it, or ask it to save them from their own poor decisions. All very exhausting.\"",
        "He says it lightly. The exhaustion under it is real.",
        "You look around the lounge: the abandoned cards on the side table, the half-folded blanket somebody forgot on the chair, the bulletin board with three handwritten notices and one official memo no one bothered reading. Lived-in space always makes honesty easier. It gives lies more furniture to bump into.",
        "Julian follows your gaze. \"There's a very specific humiliation in realizing people here have already started assigning everyone roles,\" he says. \"The hot mess. The future hero. The cautionary tale. The one who'll burn out. The one who'll break somebody's heart by accident and then call it a scheduling issue.\"",
        "\"You say that like you've been assigned several.\"",
        "He laughs, delighted. \"Oh, I contain multitudes.\"",
        "His foot brushes yours under the low table. Possibly an accident. Almost certainly not. He leaves it there just long enough to be legible and then shifts, merciful enough to let you answer without making one.",
        "\"Tell me something true,\" he says. \"Not your file. Not your score. Something annoying and specific.\"",
        "It is a better line than \"tell me about yourself,\" and he knows it.",
        "Through the window beside the lounge, you can see people crossing the courtyard below, all of them carrying the posture of being watched. Inside, Julian has made a small island out of cheap furniture and timing.",
        "If you give him something real, it matters. If you dodge, he notices that too.",
        "When he finally smiles again, it is slower. \"Excellent,\" he says, whether because you answered well or because you answered like yourself. \"Now I know how dangerous you actually are.\""
      ],
      "choices": [
        {
          "text": "Give him something true and specific, then ask what role he thinks people assigned him first.",
          "effects": [
            {
              "type": "npc",
              "key": "Julian",
              "trust": 1,
              "respect": 0
            },
            {
              "type": "relationship",
              "key": "Julian",
              "delta": 2
            },
            {
              "type": "flag",
              "key": "add_c02_julian_lounge_choice_1",
              "value": true
            },
            {
              "type": "stat",
              "key": "control",
              "delta": 1
            }
          ],
          "timeMinutes": 15,
          "next": "c02_hub_return_common"
        },
        {
          "text": "Tell him the dangerous thing about you isn't the power and ask whether he says that to everyone he invites to the couch.",
          "effects": [
            {
              "type": "npc",
              "key": "Julian",
              "trust": 0,
              "respect": 1
            },
            {
              "type": "relationship",
              "key": "Julian",
              "delta": 1
            },
            {
              "type": "flag",
              "key": "add_c02_julian_lounge_choice_2",
              "value": true
            },
            {
              "type": "stat",
              "key": "restraint",
              "delta": 1
            }
          ],
          "timeMinutes": 15,
          "next": "c02_hub_return_common"
        },
        {
          "text": "Deflect with charm, then ask which role he thinks the facility is trying to hand you.",
          "effects": [
            {
              "type": "npc",
              "key": "Julian",
              "trust": 0,
              "respect": 0
            },
            {
              "type": "relationship",
              "key": "Julian",
              "delta": 1
            },
            {
              "type": "flag",
              "key": "add_c02_julian_lounge_choice_3",
              "value": true
            },
            {
              "type": "stat",
              "key": "resolve",
              "delta": 1
            }
          ],
          "timeMinutes": 15,
          "next": "c02_hub_return_common"
        },
        {
          "text": "Say he seems too practiced at this and ask what he hides inside the performance.",
          "effects": [
            {
              "type": "npc",
              "key": "Julian",
              "trust": 0,
              "respect": 0
            },
            {
              "type": "relationship",
              "key": "Julian",
              "delta": 1
            },
            {
              "type": "flag",
              "key": "add_c02_julian_lounge_choice_4",
              "value": true
            },
            {
              "type": "stat",
              "key": "audacity",
              "delta": 1
            }
          ],
          "timeMinutes": 15,
          "next": "c02_hub_return_common"
        }
      ]
    },
    "add_c02_theo_annex": {
      "chapter": 2,
      "title": "Theo Annex",
      "location": "Observation Booth Annex",
      "background": "sim",
      "focus": "Theo",
      "text": [
        "Theo is in the annex because of course he is. The room is half office, half technical afterthought: one long desk under a bank of monitors, two spare chairs that look borrowed from somewhere less cruel, cables tied back in careful bundles, printouts clipped to a board with color-coded tabs. It smells faintly of dust, coffee gone cold, and overheated electronics. There is no reason for it to feel private. It does anyway.",
        "He looks up when you step in and visibly debates whether to pretend you caught him busy. The debate lasts less than a second. \"Hi,\" he says, which for him contains more exposed surface than most people manage in a paragraph.",
        "\"Hi.\"",
        "He sets the tablet down face-first, a clear sign that whatever is on it matters and that he is choosing not to make you compete with it. If yesterday went well between you, the gesture lands as care. If it didn't, it still lands as effort.",
        "\"I pulled the telemetry because the official summary is useless,\" Theo says. \"They write those like the system itself passed judgment and no one made choices inside the room.\"",
        "You lean against the door frame instead of sitting immediately. \"And what did the telemetry say?\"",
        "He gives a short breath that could almost be a laugh. \"That depends on which moment you mean. The readouts liked your control. They hated your margin. There's a difference.\"",
        "He turns the monitor slightly toward you. Heat maps, motion traces, timing graphs-your morning translated into lines and colors that make it look both less personal and more intimate. Theo points without touching the screen. \"Here,\" he says. \"This is where the system expected drift. You didn't give it any. Here is where it thought you were going to compensate too hard. You didn't. And here...\" He pauses. \"Here is where it lost confidence because you stopped behaving like the average model.\"",
        "\"That sounds flattering in a very stressful way.\"",
        "\"It is.\"",
        "If you took him seriously in Chapter 1, he is steadier now, less likely to hedge every statement until it dies of caution. If you flirted with him, the room holds a different kind of charge-less bright than Piper, less sharpened than Camille, but unmistakable in how carefully he chooses words that suddenly matter more.",
        "\"The problem,\" Theo says, \"is that people here love anomalies right up until the anomaly means the safety assumptions are wrong.\"",
        "He looks at you then, properly. Not just at your numbers. At you.",
        "\"I don't want them to treat you like a thesis,\" he says. \"Or worse, like a future emergency they can get ahead of if they label it early.\"",
        "The honesty in it is so direct it nearly passes for accidental.",
        "There are a dozen ways to answer and all of them teach him something.",
        "From the hall outside comes the muffled clap of shoes on concrete, a burst of laughter, the distant grind of a cart being pushed somewhere it resents going. The facility goes on around the room. Theo remains still inside it, all that tension turned not inward but toward understanding.",
        "\"If I say that sounded protective,\" you ask, \"do you get embarrassed and throw me out?\"",
        "\"Yes,\" he says immediately. Then, after half a beat: \"Not actually. Probably.\"",
        "That gets you closer to a smile than anything in the telemetry graphs.",
        "He rubs a thumb across the edge of the tablet. \"I'm serious,\" he says, quieter now. \"People are already deciding what you mean. Try not to help the worst ones.\"",
        "It is concern, respect, fear, attraction, or some combination of all four depending on what the two of you have already made possible. That is what makes it feel alive."
      ],
      "choices": [
        {
          "text": "Tell him you trust his read more than the official summary and ask what the worst interpretation is.",
          "effects": [
            {
              "type": "npc",
              "key": "Theo",
              "trust": 1,
              "respect": 0
            },
            {
              "type": "relationship",
              "key": "Theo",
              "delta": 2
            },
            {
              "type": "flag",
              "key": "add_c02_theo_annex_choice_1",
              "value": true
            },
            {
              "type": "stat",
              "key": "control",
              "delta": 1
            }
          ],
          "timeMinutes": 15,
          "next": "c02_hub_return_observation"
        },
        {
          "text": "Say he sounds protective and ask whether that's professional concern or something less tidy.",
          "effects": [
            {
              "type": "npc",
              "key": "Theo",
              "trust": 0,
              "respect": 1
            },
            {
              "type": "relationship",
              "key": "Theo",
              "delta": 1
            },
            {
              "type": "flag",
              "key": "add_c02_theo_annex_choice_2",
              "value": true
            },
            {
              "type": "stat",
              "key": "restraint",
              "delta": 1
            }
          ],
          "timeMinutes": 15,
          "next": "c02_hub_return_observation"
        },
        {
          "text": "Step closer to the monitor and ask him to show you exactly where the system lost confidence.",
          "effects": [
            {
              "type": "npc",
              "key": "Theo",
              "trust": 0,
              "respect": 0,
              "attraction": 1
            },
            {
              "type": "relationship",
              "key": "Theo",
              "delta": 1
            },
            {
              "type": "flag",
              "key": "add_c02_theo_annex_choice_3",
              "value": true
            },
            {
              "type": "stat",
              "key": "resolve",
              "delta": 1
            }
          ],
          "timeMinutes": 15,
          "next": "c02_hub_return_observation"
        },
        {
          "text": "Tell him if he keeps sounding like this you're going to start assuming he wants you alive for personal reasons.",
          "effects": [
            {
              "type": "npc",
              "key": "Theo",
              "trust": 0,
              "respect": 0,
              "attraction": 1
            },
            {
              "type": "relationship",
              "key": "Theo",
              "delta": 1
            },
            {
              "type": "flag",
              "key": "add_c02_theo_annex_choice_4",
              "value": true
            },
            {
              "type": "stat",
              "key": "audacity",
              "delta": 1
            }
          ],
          "timeMinutes": 15,
          "next": "c02_hub_return_observation"
        }
      ]
    },
    "add_c02_med_assessment": {
      "chapter": 2,
      "title": "Med Assessment",
      "location": "Med Wing Assessment Bay",
      "background": "aegis",
      "focus": "Seth",
      "text": [
        "The assessment bay is too bright in the way medical spaces always are, as if enough clean light can bully the body into honesty. One wall is lined with sealed cabinets and unlabeled equipment. Another is glass set to privacy frost. The exam chair in the center of the room looks comfortable until you notice the restraint points folded flush along the arms and tell yourself not to.",
        "A medic whose badge reads ALVAREZ scans your wrist band and does not waste time pretending this is casual. \"Any dizziness, loss of time, sensory bleed, nausea, heat bloom, tremor, involuntary discharge, or dissociation after the baseline?\" she asks.",
        "The list is long enough to sound routine. That is not reassuring.",
        "If yesterday already put you in med, the room carries that memory in your body before it does in dialogue. If you lied then, there is a different edge to being here now. If you were honest, the medic's tone is cooler in the useful way that says she would rather have facts than composure.",
        "\"Depends,\" you say. \"Do I get a prize for collecting the full set?\"",
        "\"No. You get monitored.\"",
        "She gestures to the chair. You sit. A cuff tightens around your arm. Sensors settle cool against your skin. Somewhere behind the privacy glass, another trainee laughs too hard and then cuts off abruptly when someone tells them not to move.",
        "Alvarez watches the first wave of readings populate on her tablet. \"You're running hot,\" she says.",
        "\"That feels metaphorical.\"",
        "\"It isn't.\"",
        "The next few minutes are clinical and humiliating in the old human way: breath count, pupil response, fine motor test, questions about sleep, questions about appetite, questions that are really about whether your power is becoming a language your body speaks even when you are not trying. If your baseline went clean, the concern is precautionary. If it did not, the room knows it.",
        "\"Here's the part trainees hate,\" Alvarez says at one point. \"Your body doesn't care what your reputation is doing outside this room. It cares what you asked it to survive.\"",
        "You look at the restraint seams again. She notices. \"Those are for patients who become unsafe during intervention,\" she says matter-of-factly. \"Not for you unless you earn them.\"",
        "Comforting. In a bureaucratic nightmare sort of way.",
        "The assessment drags honesty out by refusing to be impressed with your denial. If you admit the aftereffects, the scene shifts. If you minimize, Alvarez documents that too. If you joke, she lets you. Up to a point.",
        "A knock comes at the half-open side door. Ben, carrying two fresh bottles of water and looking like he knows exactly how much he is intruding, pauses when he sees the sensors. \"Sorry,\" he says. \"I was told not to hover. This seemed like a loophole.\"",
        "Alvarez glances between the two of you and, because med staff are the most dangerous gossips in any institution, instantly understands more than she needs to. \"Five minutes,\" she says, already turning back to the tablet.",
        "Ben steps inside and hands you one of the bottles. \"You looked a little pale leaving the gallery,\" he says quietly.",
        "\"Glowing reviews from all departments.\"",
        "\"I'm serious.\"",
        "\"I know.\"",
        "If you treated him with real attention yesterday, he is warmer now, less cautious about showing concern. If you didn't, the scene still works, just a little more tentative. Either way, he does not make a show of being kind. He just is, and the room is steadier for it.",
        "Alvarez finishes the scan and taps the screen off. \"You're stable enough to walk,\" she says. \"You are not stable enough to decide stable means invincible. Hydrate. Eat something with actual salt in it. If you experience escalation, come back before the walls start looking optional.\"",
        "Ben waits until she leaves the bay to say, \"You going to do that thing where you promise to be smart and then immediately do the opposite?\"",
        "\"That depends. Does saying no make me a liar or a coward?\"",
        "\"It makes you tired.\"",
        "That lands closer than the cuff did.",
        "The lights in the assessment bay hum faintly overhead. Outside the frosted glass, the facility continues sorting, training, judging. Inside, your body has already voted on whether this place is abstract."
      ],
      "choices": [
        {
          "text": "Be honest with Alvarez about exactly what the baseline cost and thank Ben for checking in.",
          "effects": [
            {
              "type": "flag",
              "key": "add_c02_med_assessment_choice_1",
              "value": true
            },
            {
              "type": "stat",
              "key": "control",
              "delta": 1
            }
          ],
          "timeMinutes": 15,
          "next": "c02_hub_return_observation"
        },
        {
          "text": "Minimize everything to the medic, then make a joke to Ben so he won't push.",
          "effects": [
            {
              "type": "flag",
              "key": "add_c02_med_assessment_choice_2",
              "value": true
            },
            {
              "type": "stat",
              "key": "restraint",
              "delta": 1
            }
          ],
          "timeMinutes": 15,
          "next": "c02_hub_return_observation"
        },
        {
          "text": "Ask Alvarez what 'running hot' means in practical terms and ask Ben not to mention this to anyone.",
          "effects": [
            {
              "type": "flag",
              "key": "add_c02_med_assessment_choice_3",
              "value": true
            },
            {
              "type": "stat",
              "key": "resolve",
              "delta": 1
            }
          ],
          "timeMinutes": 15,
          "next": "c02_hub_return_observation"
        },
        {
          "text": "Tell Ben he can hover if he wants, then ask whether you looked that bad from outside.",
          "effects": [
            {
              "type": "flag",
              "key": "add_c02_med_assessment_choice_4",
              "value": true
            },
            {
              "type": "stat",
              "key": "audacity",
              "delta": 1
            }
          ],
          "timeMinutes": 15,
          "next": "c02_hub_return_observation"
        }
      ]
    },
    "add_c02_rina_warmup": {
      "chapter": 2,
      "title": "Rina Warmup",
      "location": "Sim Block Warm-Up Lane",
      "background": "sim",
      "focus": "Rina",
      "text": [
        "Rina is in the warm-up lane hitting a suspended target rig hard enough to make the whole chain assembly sing. The lane is half caged-off track, half impact station, with padded flooring and old scoring lights that blink red whenever someone forgets the difference between control and enthusiasm. She has tied her hair back badly, like she did it one-handed and resented the time it took. Sweat darkens the collar of her shirt. Her stance says she has been told to cool off and translated that instruction into violence with parameters.",
        "She notices you in the mirrored wall before she turns. \"You here to gloat,\" she asks, \"or did the facility finally assign me my own personalized cautionary tale?\"",
        "\"Maybe I came for the charming conversation.\"",
        "\"That was your first mistake.\"",
        "There is no softness in her, not yet. But there is honesty, which in some situations is better.",
        "If you met her eyes on the landing after baseline, this feels like the second beat of the same exchange. If you ignored her then, she makes you pay for the delay by being harder to read now.",
        "Rina throws another strike into the rig. The scoring lights flare. \"You've got everyone acting weird,\" she says. \"The careful ones are pretending they aren't impressed. The reckless ones are deciding whether to worship you or race you into a wall. Very flattering. Deeply annoying.\"",
        "\"And you?\"",
        "She finally turns fully toward you. \"I'm deciding whether you're actually good or just built for one very specific room.\"",
        "That lands fair enough to respect.",
        "The warm-up lane beyond her is full of little evidence that people live in their bodies here: taped wrists, abandoned water bottles, chalk streaks, handprints on the rail, the faint medicinal smell of muscle cream and old effort. Aegis loves data. The floor always tells the better story.",
        "Rina props a forearm on the target rig. \"You know what everyone does in this place?\" she asks. \"They say they care about control. What they mean is they care about not being embarrassed in front of command.\"",
        "\"Subtle distinction.\"",
        "\"Important distinction.\"",
        "It is the most revealing thing she has said so far, which means she either wants you to hear it or is too worked up to hide it. With Rina, both can be true at once.",
        "\"You coming at me because you think I had an easy morning,\" you ask, \"or because you think I made yours worse?\"",
        "\"Yes.\"",
        "That finally gets a crooked grin out of her, quick and feral.",
        "The conversation can go half a dozen ways from there. Competitive. Respectful. Needling. Interesting. What matters is that Rina does not want comfort from you. She wants clarity. She wants to know whether you are the kind of person who gets sharp when challenged or slippery when it stops being fun.",
        "A trainer calls something from the far end of the lane. Rina ignores it for another second and then says, \"If you're worth the problem, prove it more than once.\"",
        "Not an invitation exactly. Close enough to one."
      ],
      "choices": [
        {
          "text": "Tell her she'll have to settle for finding out repeatedly and ask what would count as proof.",
          "effects": [
            {
              "type": "npc",
              "key": "Rina",
              "trust": 1,
              "respect": 0
            },
            {
              "type": "relationship",
              "key": "Rina",
              "delta": 2
            },
            {
              "type": "flag",
              "key": "add_c02_rina_warmup_choice_1",
              "value": true
            },
            {
              "type": "stat",
              "key": "control",
              "delta": 1
            }
          ],
          "timeMinutes": 15,
          "next": "c02_hub_return_sim"
        },
        {
          "text": "Say one specific room was enough to get her attention and that seems like a decent start.",
          "effects": [
            {
              "type": "npc",
              "key": "Rina",
              "trust": 0,
              "respect": 1
            },
            {
              "type": "relationship",
              "key": "Rina",
              "delta": 1
            },
            {
              "type": "flag",
              "key": "add_c02_rina_warmup_choice_2",
              "value": true
            },
            {
              "type": "stat",
              "key": "restraint",
              "delta": 1
            }
          ],
          "timeMinutes": 15,
          "next": "c02_hub_return_sim"
        },
        {
          "text": "Ask whether she's angry at you or at the way Aegis turns every strong morning into a hierarchy.",
          "effects": [
            {
              "type": "npc",
              "key": "Rina",
              "trust": 0,
              "respect": 0
            },
            {
              "type": "relationship",
              "key": "Rina",
              "delta": 1
            },
            {
              "type": "flag",
              "key": "add_c02_rina_warmup_choice_3",
              "value": true
            },
            {
              "type": "stat",
              "key": "resolve",
              "delta": 1
            }
          ],
          "timeMinutes": 15,
          "next": "c02_hub_return_sim"
        },
        {
          "text": "Throw the challenge back and tell her to prove she's worth keeping up with.",
          "effects": [
            {
              "type": "npc",
              "key": "Rina",
              "trust": 0,
              "respect": 0
            },
            {
              "type": "relationship",
              "key": "Rina",
              "delta": 1
            },
            {
              "type": "flag",
              "key": "add_c02_rina_warmup_choice_4",
              "value": true
            },
            {
              "type": "stat",
              "key": "audacity",
              "delta": 1
            }
          ],
          "timeMinutes": 15,
          "next": "c02_hub_return_sim"
        }
      ]
    },
    "add_c02_vance_review": {
      "chapter": 2,
      "title": "Vance Review",
      "location": "Glass Review Corridor",
      "background": "aegis",
      "focus": "Vance",
      "text": [
        "Vance waits in the glass review corridor like the building itself appointed him there. The corridor runs behind the observation galleries in a hard clean line, one side transparent to the test floors below, the other stacked with dark doors and narrow windows wired with privacy tint. He stands with a tablet tucked under one arm and reading glasses in hand, which is somehow more intimidating than if he were armed.",
        "\"Walk with me,\" he says.",
        "Not a request. Not unkind either. Just command worn down to efficiency.",
        "The corridor makes your footsteps sound official. Below the glass, two trainees are setting up the next sequence under the eye of a technician who looks about nineteen and already terminally disappointed in humanity. Vance does not look down. He is interested in what the work means, not how dramatic it appears from above.",
        "\"You were noticed yesterday before you ever entered a test bay,\" he says. \"This morning did not reduce that problem.\"",
        "\"That sounds almost complimentary.\"",
        "\"It is an administrative concern.\"",
        "He says it dry enough to almost qualify as humor. Almost.",
        "If you gave him reasons in Chapter 1 to think you are serious, the conversation starts firmer and less suspicious. If you pushed against intake, joked through forms, or made your first impression difficult on purpose, none of that is forgotten. Vance is not sentimental about first days. He is also not careless with them.",
        "\"You do not need to impress me,\" he says. \"I need you to remain interpretable. Those are different goals, and trainees confuse them constantly.\"",
        "They walk a few steps in silence.",
        "\"Aegis does not punish power for being large,\" he continues. \"It intervenes when judgment fails to scale with it. That distinction is the only reason places like this can function.\"",
        "Through the glass you catch your reflection layered over the bay below. For a second you look like part of the system reviewing itself.",
        "\"If I make your paperwork ugly,\" you ask, \"is that my fault or a design flaw in your paperwork?\"",
        "Vance finally glances at you, and there it is-that brief dry approval he never gives away for free. \"That depends,\" he says, \"on whether the ugliness reflects complexity or ego.\"",
        "Fair enough.",
        "He stops near one of the dark doors and taps the tablet awake. Charts, notes, thermal curves, staff comments. You only see fragments before he angles it away. \"You're already accumulating advocates,\" he says. \"And speculators. Both groups are dangerous.\"",
        "\"That sounds reassuring.\"",
        "\"It is useful.\"",
        "He puts the glasses back on without wearing them. \"I'm telling you this early so you cannot later pretend surprise: people here will try to decide whether you are a project, a partner, a risk, or a future problem. Your behavior with them matters almost as much as your baseline numbers. Sometimes more.\"",
        "There is a version of this conversation that is pure warning. The actual thing is better than that. It is instruction from someone who has seen too many young supers mistake attention for permission.",
        "\"If you need recovery time,\" Vance says, \"take it before your body makes the decision without you. If you need help, ask before pride turns the request into incident response. And if one of your peers starts treating your instability like a personality trait, correct them.\"",
        "The line lands harder than most praise would.",
        "He studies you for one beat longer. \"You have not frightened me,\" he says. \"Do not make me regret the distinction.\"",
        "Then he dismisses you with a nod, which somehow feels more consequential than a lecture would have."
      ],
      "choices": [
        {
          "text": "Tell him you can work with interpretable and ask what mistake he sees most often here.",
          "effects": [
            {
              "type": "npc",
              "key": "Vance",
              "trust": 1,
              "respect": 0
            },
            {
              "type": "relationship",
              "key": "Vance",
              "delta": 2
            },
            {
              "type": "flag",
              "key": "add_c02_vance_review_choice_1",
              "value": true
            },
            {
              "type": "stat",
              "key": "control",
              "delta": 1
            }
          ],
          "timeMinutes": 15,
          "next": "c02_hub_return_observation"
        },
        {
          "text": "Say you'll take recovery seriously if Aegis learns not to confuse caution with weakness.",
          "effects": [
            {
              "type": "npc",
              "key": "Vance",
              "trust": 0,
              "respect": 1
            },
            {
              "type": "relationship",
              "key": "Vance",
              "delta": 1
            },
            {
              "type": "flag",
              "key": "add_c02_vance_review_choice_2",
              "value": true
            },
            {
              "type": "stat",
              "key": "restraint",
              "delta": 1
            }
          ],
          "timeMinutes": 15,
          "next": "c02_hub_return_observation"
        },
        {
          "text": "Ask whether 'advocates' includes him or whether this is still strictly an administrative concern.",
          "effects": [
            {
              "type": "npc",
              "key": "Vance",
              "trust": 0,
              "respect": 0
            },
            {
              "type": "relationship",
              "key": "Vance",
              "delta": 1
            },
            {
              "type": "flag",
              "key": "add_c02_vance_review_choice_3",
              "value": true
            },
            {
              "type": "stat",
              "key": "resolve",
              "delta": 1
            }
          ],
          "timeMinutes": 15,
          "next": "c02_hub_return_observation"
        },
        {
          "text": "Accept the warning cleanly and tell him he won't regret the distinction.",
          "effects": [
            {
              "type": "npc",
              "key": "Vance",
              "trust": 0,
              "respect": 0
            },
            {
              "type": "relationship",
              "key": "Vance",
              "delta": 1
            },
            {
              "type": "flag",
              "key": "add_c02_vance_review_choice_4",
              "value": true
            },
            {
              "type": "stat",
              "key": "audacity",
              "delta": 1
            }
          ],
          "timeMinutes": 15,
          "next": "c02_hub_return_observation"
        }
      ]
    },
    "add_c03_gallery_edges": {
      "chapter": 3,
      "title": "Gallery Edges",
      "location": "Observation Hall",
      "background": "sim",
      "focus": "Ensemble",
      "text": [
        "The observation hall outside Sim Block C is built like the facility expects half its lessons to happen in the doorway. One side is reinforced glass looking into the advanced bay. The other is a row of benches too narrow to invite comfort. Screens mounted overhead cycle through telemetry, scenario notes, and live camera feeds from angles that make everyone in the room feel briefly architectural.",
        "Julian is closest to the glass because of course he is, one shoulder against the wall, hands in his pockets, posture so relaxed it almost counts as a performance piece. Theo is reading the scenario brief as if refusing to look up might somehow stop the social part of the exercise from existing. Camille stands near the review tech station, attention divided between the sim setup and the room around it. Piper arrives late enough to imply she chose the timing on purpose and bright enough to make the fluorescent lights look underdressed.",
        "No one here is a stranger anymore. That is the chapter change. You are not family, not allies in any durable sense, but everybody has enough data now to begin forming narratives.",
        "\"Look at us,\" Julian says without taking his eyes off the glass. \"A little bouquet of ambition and poor impulse control.\"",
        "Theo lowers the tablet. \"Some of us are only here because command apparently thinks watching you all misread an exercise counts as education.\"",
        "Piper snorts. \"It does. Trauma is one of our core departments.\"",
        "Camille does not sigh, which somehow conveys more than sighing would. \"The scenario is not trauma,\" she says. \"It is containment. Try to keep the distinction alive for at least twenty minutes.\"",
        "\"Cruel,\" Julian murmurs. \"You ask so much.\"",
        "If you have tension with one of them already, the room folds around it instead of announcing it. Piper's glance lingers if you gave her reason. Camille's attention sharpens if you challenged or impressed her. Julian looks more amused when he already knows how your timing feels. Theo's caution either warms into curiosity or hardens into private audit, depending on whether you've treated him like a person or a forecasting tool.",
        "A resident from another cohort drifts close enough to listen and not close enough to join. Jordan passes through with a folder they definitely should not have and definitely do. Ben stops at the doorway long enough to ask who is overtraining this week and then keeps moving when nobody gives him a satisfying answer.",
        "The room is alive in a way the first days weren't. Less orientation. More orbit.",
        "Julian finally turns from the glass. \"You know what I find reassuring?\" he says. \"No matter how powerful people get in this building, they remain incapable of acting normal in a hallway.\"",
        "Piper props a shoulder against the bench. \"Normal is fake and usually boring.\"",
        "Theo looks at you, not them. \"The room is doing something useful right now,\" he says. \"It wants to know what kind of person you become when somebody else's standard is in front of you. Not your power. Your posture.\"",
        "\"That,\" Julian says, pointing at Theo, \"was disturbingly attractive as a sentence.\"",
        "Theo goes still with the particular expression of a man reconsidering every route that brought him here.",
        "Camille's mouth twitches at one corner, too small to be generous and too real to be missed. \"If the four of you are done auditioning for chaos in a government hallway,\" she says, \"watch carefully. Most people fail containment by trying to impress the room with how much force they can survive.\"",
        "Piper drags her gaze from you to Camille and back again. \"And here I thought the room's problem was that it didn't appreciate art.\"",
        "\"It doesn't,\" Camille says. \"It appreciates outcomes.\"",
        "That lands in different ways depending on who you are becoming. Hero material. Contractor material. An institutional asset. A problem people keep using because problems can be useful when pointed in the right direction. The beauty of Aegis is that it can tell you you're special and supervised in the same breath.",
        "The bay lights dim. Inside the glass, the scenario powers up with a pulse of violet against steel. The sound does not fully cross the barrier, but the pressure of it does.",
        "For one beat, nobody talks. Then Piper leans close enough that only you catch it.",
        "\"Pick a side carefully,\" she says, light as a joke and not a joke at all. \"These rooms have long memories.\""
      ],
      "choices": [
        {
          "text": "Stand with Piper and tell her long memories are only dangerous if people deserve them.",
          "effects": [
            {
              "type": "flag",
              "key": "add_c03_gallery_edges_choice_1",
              "value": true
            },
            {
              "type": "stat",
              "key": "control",
              "delta": 1
            }
          ],
          "timeMinutes": 15,
          "next": "c03_hub_gallery"
        },
        {
          "text": "Stand with Camille and ask what the room usually misses when it worships outcomes.",
          "effects": [
            {
              "type": "flag",
              "key": "add_c03_gallery_edges_choice_2",
              "value": true
            },
            {
              "type": "stat",
              "key": "restraint",
              "delta": 1
            }
          ],
          "timeMinutes": 15,
          "next": "c03_hub_gallery"
        },
        {
          "text": "Stand near Theo and say posture is easier to fake than people think.",
          "effects": [
            {
              "type": "flag",
              "key": "add_c03_gallery_edges_choice_3",
              "value": true
            },
            {
              "type": "stat",
              "key": "resolve",
              "delta": 1
            }
          ],
          "timeMinutes": 15,
          "next": "c03_hub_gallery"
        },
        {
          "text": "Angle toward Julian and ask whether he ever gets tired of watching people invent hierarchies in real time.",
          "effects": [
            {
              "type": "flag",
              "key": "add_c03_gallery_edges_choice_4",
              "value": true
            },
            {
              "type": "stat",
              "key": "audacity",
              "delta": 1
            }
          ],
          "timeMinutes": 15,
          "next": "c03_hub_gallery"
        }
      ]
    },
    "add_c03_julian_hall_mirror": {
      "chapter": 3,
      "title": "Julian Hall Mirror",
      "location": "Sim Block Hallway",
      "background": "sim",
      "focus": "Julian",
      "text": [
        "Julian catches you on the way out of the gallery while everybody else is still pretending to need water, paperwork, or a reason to hover. The sim hallway is lined with mirrored safety panels that turn motion into fragments. In them, you and Julian become a conversation composed out of shoulders, profiles, fluorescent glare, and the occasional ghost of somebody else passing behind you.",
        "\"It is fascinating,\" he says, strolling beside you as though the corridor belongs to the two of you by private lease, \"how quickly a supervised environment becomes a monarchy. One decent performance and suddenly everyone needs to decide whether they're threatened, interested, or preparing to marry into the dynasty.\"",
        "\"Your metaphors get more expensive when you're in a good mood.\"",
        "\"They get more accurate.\"",
        "He glances sideways. If Chapter 1 and 2 gave the two of you ease, it is already there. Not forced. Not coy. The pleasant danger of somebody who noticed your timing and kept it. If the route has leaned more cautious so far, the scene plays differently: less spark, more testing. Either way, Julian does not approach people by accident.",
        "He hooks a thumb toward the gallery behind you. \"Camille is going to pretend today was about standards. Theo is going to pretend it was about methodology. Piper is going to pretend it was about proving Aegis does not own the patent on velocity. All of them are lying a little. The room was about desire.\"",
        "\"That feels like a broad category.\"",
        "\"It is a broad category. One of my favorites.\"",
        "You laugh despite yourself. Julian smiles like he had that outcome at favorable odds.",
        "He slows near one of the mirrored panels and turns enough that the reflection catches both of you at once. \"Everybody wants something from somebody here,\" he says. \"Approval, relief, permission, competition, friction, rescue, a witness, a better version of themselves standing nearby so they can pretend that's contagious. The institution thinks in terms of control. The residents don't. Residents think in hunger.\"",
        "The line should sound cynical. It doesn't. Not with him. It sounds observant in the way some people are only after they've survived being looked at too hard.",
        "If you met him well in the first two chapters, he lets that familiarity breathe now. \"You,\" he says, \"have become a very interesting weather system. Which means people are going to start doing a rude little thing where they tell themselves stories about you and then punish you when you decline to act those stories out.\"",
        "\"Do you come with a guidebook?\"",
        "\"I am the guidebook. Please admire my binding.\"",
        "A door at the far end opens and closes. The corridor returns to quiet.",
        "Julian's tone shifts, not all the way serious, but close enough to touch it. \"You don't owe anyone a single coherent persona,\" he says. \"But you should decide which contradictions are yours on purpose. If you don't, this place will assign you some.\"",
        "That lands harder than it should. Maybe because it sounds like advice he had to learn the expensive way. Maybe because he doesn't dress it up as concern. He offers it like a tool, and somehow that is more intimate.",
        "You study him. The immaculate posture. The polished humor. The way he never quite stops performing even when the performance turns honest. \"And what contradictions are yours on purpose?\"",
        "He laughs softly, eyes on the mirrored panel instead of you. \"What a deeply unfair follow-up.\"",
        "\"So that's a lot.\"",
        "\"Oh, spectacularly.\"",
        "He finally meets your gaze then, and the room narrows with it. \"Here,\" he says, lighter again. \"A practical rule. Never tell the truth in this building exactly the same way twice. People start thinking they own the route.\"",
        "That is a Julian sentence if there ever was one: charming enough to survive daylight, sharp enough to leave a mark.",
        "At the intersection ahead, he stops. \"Come find me later if the day gets unbearable,\" he says. \"Or if it gets entertaining. I have equal professional interest in both.\"",
        "\"Professional.\"",
        "\"Absolutely. Don't cheapen what we have.\"",
        "Then he slips away toward the lounge with the impossible ease of a man who can leave a hallway looking more put together than he found it."
      ],
      "choices": [
        {
          "text": "Tell him that for someone who jokes this much, he gives suspiciously useful advice.",
          "effects": [
            {
              "type": "npc",
              "key": "Julian",
              "trust": 1,
              "respect": 0
            },
            {
              "type": "relationship",
              "key": "Julian",
              "delta": 2
            },
            {
              "type": "flag",
              "key": "add_c03_julian_hall_mirror_choice_1",
              "value": true
            },
            {
              "type": "stat",
              "key": "control",
              "delta": 1
            }
          ],
          "timeMinutes": 15,
          "next": "c03_hub_gallery"
        },
        {
          "text": "Ask what story the room is currently writing about you and make him answer honestly.",
          "effects": [
            {
              "type": "npc",
              "key": "Julian",
              "trust": 0,
              "respect": 1,
              "attraction": 1
            },
            {
              "type": "relationship",
              "key": "Julian",
              "delta": 1
            },
            {
              "type": "flag",
              "key": "add_c03_julian_hall_mirror_choice_2",
              "value": true
            },
            {
              "type": "stat",
              "key": "restraint",
              "delta": 1
            }
          ],
          "timeMinutes": 15,
          "next": "c03_hub_gallery"
        },
        {
          "text": "Step closer and say he seems to enjoy telling the truth sideways.",
          "effects": [
            {
              "type": "npc",
              "key": "Julian",
              "trust": 0,
              "respect": 0,
              "attraction": 1
            },
            {
              "type": "relationship",
              "key": "Julian",
              "delta": 1
            },
            {
              "type": "flag",
              "key": "add_c03_julian_hall_mirror_choice_3",
              "value": true
            },
            {
              "type": "stat",
              "key": "resolve",
              "delta": 1
            }
          ],
          "timeMinutes": 15,
          "next": "c03_hub_gallery"
        },
        {
          "text": "Deflect with humor and tell him he'll have to invoice you if the guidebook gets longer.",
          "effects": [
            {
              "type": "npc",
              "key": "Julian",
              "trust": 0,
              "respect": 0
            },
            {
              "type": "relationship",
              "key": "Julian",
              "delta": 1
            },
            {
              "type": "flag",
              "key": "add_c03_julian_hall_mirror_choice_4",
              "value": true
            },
            {
              "type": "stat",
              "key": "audacity",
              "delta": 1
            }
          ],
          "timeMinutes": 15,
          "next": "c03_hub_gallery"
        }
      ]
    },
    "add_c03_theo_annex_math": {
      "chapter": 3,
      "title": "Theo Annex Math",
      "location": "Records Annex",
      "background": "aegis",
      "focus": "Theo",
      "text": [
        "The records annex is one of those side spaces Aegis accidentally makes intimate by trying too hard to make them functional. Narrow shelving. Locked drawers. a wall terminal that hums louder than it should. Two task chairs and no decorative choices at all. The overhead light is slightly warmer than the hall outside, which makes the room feel like it belongs to somebody even though it clearly belongs to the system.",
        "Theo is there with three open windows on the terminal and the expression of a man midway through an argument with data. He looks up when you step in, surprised enough that it almost reads as guilt.",
        "\"I wasn't looking for your file,\" he says immediately.",
        "\"Comforting that you needed to clarify.\"",
        "\"I was looking at scenario metadata.\"",
        "\"That is either better or worse depending on the day.\"",
        "He exhales through his nose, half amused despite himself. That at least is progress.",
        "If Chapter 1 and 2 taught him you listen, the room opens faster. If they taught him you're volatile, he remains careful, but he doesn't ask you to leave. Theo's version of trust has always been less about warmth than about what he permits to remain in the room.",
        "He gestures at the terminal. \"The baseline review and the gallery exercise aren't separate. They share rating language. Not the exact categories. The assumptions under them.\"",
        "You move closer. On the screen: response latency, output discipline, collateral appetite, peer confidence effect. That last one sits there like somebody tried to turn social gravity into a number and nearly got away with it.",
        "\"The institution is trying to predict how other people behave around you,\" you say.",
        "\"The institution is trying to predict how dangerous everybody becomes once other people start believing in them.\" Theo's mouth tightens. \"It's not the same thing.\"",
        "No, it isn't. And the fact that he cares enough to make the distinction tells you more about him than the spreadsheet ever could.",
        "He points to one field. \"There. See that? Candidate pressure adaptation. Yesterday moved your score. Today probably moved it again.\"",
        "\"Do I get a prize if it keeps trending?\"",
        "\"Yes. More supervision.\"",
        "You bark out a laugh. Theo gives you a look like he regrets making a joke and is also a little pleased you caught it.",
        "He leans back against the desk, arms folding. \"I know Aegis is not evil,\" he says. \"That would actually be simpler. Most of the people running this place believe they're reducing harm. A lot of the time they are. The problem is that institutions treat legibility like mercy. If they can categorize you, they think they can protect you. Or use you safely. Or both.\"",
        "\"And what do you think?\"",
        "Theo holds your gaze for a beat. \"I think the category changes the person if they stay in it long enough.\"",
        "It is one of the most honest things he has said to you. Maybe because the room is small. Maybe because you took him seriously earlier in the story and he has not forgotten it. Maybe because he is tired of everybody else treating concern like pessimism.",
        "You look back at the screen. \"So what are you doing in here? Warning me? Helping them? Helping yourself?\"",
        "\"Yes,\" he says, and when you look at him again he is almost smiling. \"Pick whichever answer annoys you least.\"",
        "The annex is quiet around you. Somewhere outside, a cart rattles past. In here, the world narrows to data, fluorescent warmth, and Theo standing close enough to feel less theoretical than he did on day one.",
        "\"If you don't like the category,\" you say, \"help me break it.\"",
        "His face stills. Not with fear. With impact.",
        "\"That,\" he says after a moment, \"depends on whether you mean break it by becoming impossible to simplify or break it by giving them a more flattering simplification.\"",
        "\"Which one were you hoping for?\"",
        "Theo looks down at the terminal, then back up. \"The first one,\" he says quietly. \"The second one is how people end up trapped in jobs they mistake for identities.\"",
        "The line lands hard because it feels practiced. Maybe because it is.",
        "He reaches past you to close the metadata window. Not brushing you. Not quite avoiding it either. \"If you go into their rooms already desperate to prove yourself,\" he says, \"they don't even need to manipulate the outcome. You do it for them.\"",
        "There is care in the sentence. Care and warning. With Theo, that may be the earliest form of intimacy.",
        "When you step back toward the door, he does not stop you. He also doesn't return to the terminal immediately. He just watches you, measured and human in the same breath."
      ],
      "choices": [
        {
          "text": "Tell him he is allowed to warn you without pretending it's only about the math.",
          "effects": [
            {
              "type": "npc",
              "key": "Theo",
              "trust": 1,
              "respect": 0
            },
            {
              "type": "relationship",
              "key": "Theo",
              "delta": 2
            },
            {
              "type": "flag",
              "key": "add_c03_theo_annex_math_choice_1",
              "value": true
            },
            {
              "type": "stat",
              "key": "control",
              "delta": 1
            }
          ],
          "timeMinutes": 15,
          "next": "c03_hub_return_admin"
        },
        {
          "text": "Ask him what category he thinks you would hate most and make him answer.",
          "effects": [
            {
              "type": "npc",
              "key": "Theo",
              "trust": 0,
              "respect": 1
            },
            {
              "type": "relationship",
              "key": "Theo",
              "delta": 1
            },
            {
              "type": "flag",
              "key": "add_c03_theo_annex_math_choice_2",
              "value": true
            },
            {
              "type": "stat",
              "key": "restraint",
              "delta": 1
            }
          ],
          "timeMinutes": 15,
          "next": "c03_hub_return_admin"
        },
        {
          "text": "Say breaking the category sounds more interesting than pleasing it.",
          "effects": [
            {
              "type": "npc",
              "key": "Theo",
              "trust": 0,
              "respect": 0
            },
            {
              "type": "relationship",
              "key": "Theo",
              "delta": 1
            },
            {
              "type": "flag",
              "key": "add_c03_theo_annex_math_choice_3",
              "value": true
            },
            {
              "type": "stat",
              "key": "resolve",
              "delta": 1
            }
          ],
          "timeMinutes": 15,
          "next": "c03_hub_return_admin"
        },
        {
          "text": "Thank him for taking the risk of being honest and leave the door open for later.",
          "effects": [
            {
              "type": "npc",
              "key": "Theo",
              "trust": 0,
              "respect": 0,
              "attraction": 1
            },
            {
              "type": "relationship",
              "key": "Theo",
              "delta": 1
            },
            {
              "type": "flag",
              "key": "add_c03_theo_annex_math_choice_4",
              "value": true
            },
            {
              "type": "stat",
              "key": "audacity",
              "delta": 1
            }
          ],
          "timeMinutes": 15,
          "next": "c03_hub_return_admin"
        }
      ]
    },
    "add_c03_camille_report_language": {
      "chapter": 3,
      "title": "Camille Report Language",
      "location": "Observation Hall",
      "background": "sim",
      "focus": "Camille",
      "text": [
        "Camille is standing near the observation glass with a report draft open on her tablet, one thumb resting against the edge as if the document might otherwise try to escape. The hall has thinned out. The loudest residents have gone to turn their opinions into cafeteria currency. The quieter ones have either returned to training or found corners private enough to rehearse their resentment. Here, in the washed-out light reflected off the sim bay glass, what remains is the part of the process Aegis pretends is neutral.",
        "She does not look up right away. \"You're making the floor nervous,\" she says.",
        "You glance down at the line markings. \"They're very sensitive.\"",
        "\"Stand still and give them a break.\"",
        "You do, mostly because with Camille obedience can feel like a tactical choice instead of submission. When she finally angles the tablet enough for you to see, several phrases have been highlighted: volatile reserve profile, responsive under social pressure, candidate attracts peer attention, suitable for controlled escalation. Another phrase-viable containment partner-has been selected and then left untouched, as if she cannot decide whether to delete it or sharpen it into something dangerous.",
        "\"That one bothering you?\" you ask.",
        "\"All of them bother me,\" Camille says. \"That one is merely ambitious.\"",
        "The glass behind her reflects both of you back as silhouettes cut with fluorescent white. If earlier chapters built friction, it's still there; if they built spark, that too. With Camille the difference is often only visible in how exactly she chooses her words.",
        "\"Aegis likes language that sounds responsible while secretly applying pressure,\" she says. \"Viable is one of those words. It means useful enough to risk. It means committee members will start imagining scenarios with your name in them before you've had time to decide whether you want to be in the room.\"",
        "\"You make concern sound flattering.\"",
        "\"I make concern sound accurate.\"",
        "Fair.",
        "She scrolls down. There it is again: responsive under social pressure. You do not need to ask whether she wrote it. The answer is obvious. The more interesting question is why she bothered to make the note less lazy than the room deserved.",
        "Camille glances at you then, direct and unsoftened. \"Most people here think the danger is power without control,\" she says. \"Sometimes they're right. Sometimes the danger is power plus attention plus the wrong audience. Today gave you all three.\"",
        "It would be easier if she sounded merely clinical. She doesn't. The line lands with the unnerving weight of private seriousness.",
        "\"What would you write if politics weren't reading over your shoulder?\" you ask.",
        "Camille considers. With anybody else the pause might feel theatrical. With her it feels expensive. \"I would write that you improve when somebody asks for your intent before asking for output,\" she says at last. \"I would write that half the facility keeps misreading audacity as carelessness because it is easier than asking whether you know exactly what you are doing. I would write that whichever answer becomes true will depend less on your power than on who you keep closest.\"",
        "That last part hangs between you.",
        "If you have leaned toward her, the air changes. Not dramatically. Just enough to make you aware of the distance between your shoulders and the fact that it could become less if either of you stopped behaving.",
        "\"If I keep you close,\" you say, \"is that a recommendation or a warning?\"",
        "At that, finally, she smiles. Small. Sharp. Ruinous in proportion to how little of it she gives away. \"That depends,\" she says. \"Do you require one?\"",
        "\"Maybe I just enjoy collecting difficult women.\"",
        "\"Then your filing habits are poor.\"",
        "You laugh. She lets herself watch you do it for a second longer than is necessary.",
        "Then the smile is gone and the tablet is back between you like a shield she remembered she was holding. \"Tuesday and Thursday. Sim C. Observation first. Participation later if I decide you understand the shape of the room.\" Her gaze flicks to your face. \"And if you are going to flirt with me in government lighting, make it count.\"",
        "There it is again: impossible to confuse with accident, impossible to mistake for surrender.",
        "She taps one margin note into place. Not safe. Not unsafe. High consequence under social pressure. Improves when asked for intent before output.",
        "The sentence is not warm. It is better than warm. It is specific.",
        "When she locks the tablet and turns away, you realize the whole conversation was about language and almost none of it was."
      ],
      "choices": [
        {
          "text": "Tell her that making it count sounds dangerously close to a challenge.",
          "effects": [
            {
              "type": "npc",
              "key": "Camille",
              "trust": 1,
              "respect": 0
            },
            {
              "type": "relationship",
              "key": "Camille",
              "delta": 2
            },
            {
              "type": "flag",
              "key": "add_c03_camille_report_language_choice_1",
              "value": true
            },
            {
              "type": "stat",
              "key": "control",
              "delta": 1
            }
          ],
          "timeMinutes": 15,
          "next": "c03_hub_return_admin"
        },
        {
          "text": "Ask whether she always protects people by making them harder to misuse.",
          "effects": [
            {
              "type": "npc",
              "key": "Camille",
              "trust": 0,
              "respect": 1
            },
            {
              "type": "relationship",
              "key": "Camille",
              "delta": 1
            },
            {
              "type": "flag",
              "key": "add_c03_camille_report_language_choice_2",
              "value": true
            },
            {
              "type": "stat",
              "key": "restraint",
              "delta": 1
            }
          ],
          "timeMinutes": 15,
          "next": "c03_hub_return_admin"
        },
        {
          "text": "Accept the Sim C invitation and say you'll let the rest of the conversation ripen.",
          "effects": [
            {
              "type": "npc",
              "key": "Camille",
              "trust": 0,
              "respect": 0
            },
            {
              "type": "relationship",
              "key": "Camille",
              "delta": 1
            },
            {
              "type": "flag",
              "key": "add_c03_camille_report_language_choice_3",
              "value": true
            },
            {
              "type": "stat",
              "key": "resolve",
              "delta": 1
            }
          ],
          "timeMinutes": 15,
          "next": "c03_hub_return_admin"
        },
        {
          "text": "Step in just enough to ask whether she trusts her own read of you yet.",
          "effects": [
            {
              "type": "npc",
              "key": "Camille",
              "trust": 0,
              "respect": 0
            },
            {
              "type": "relationship",
              "key": "Camille",
              "delta": 1
            },
            {
              "type": "flag",
              "key": "add_c03_camille_report_language_choice_4",
              "value": true
            },
            {
              "type": "stat",
              "key": "audacity",
              "delta": 1
            }
          ],
          "timeMinutes": 15,
          "next": "c03_hub_return_admin"
        }
      ]
    },
    "add_c03_piper_stillness_tax": {
      "chapter": 3,
      "title": "Piper Stillness Tax",
      "location": "Common Lounge",
      "background": "aegis",
      "focus": "Piper",
      "text": [
        "Piper has claimed the couch arm like it owes her rent. One knee is up, one foot taps against the cushion and stops and taps again, and the snack bowl beside her looks less like food and more like a prop she has not remembered to interact with. The common lounge TV is on mute. Three residents at the far table are pretending to work. The whole room carries that post-review tone where nobody is relaxed enough to admit they're curious.",
        "Piper looks up when you enter and brightens so fast it almost counts as a slip. \"Hey,\" she says. \"The facility's favorite supervised weather event lives.\"",
        "\"You say that like there was doubt.\"",
        "\"There is always doubt. That's what makes things fun.\"",
        "It is a joke. Mostly. Under it you can hear the leftover edge from the baseline rooms, the gallery, Camille's invitation, the slow institutional way Aegis has of sorting people into lanes and pretending the lanes were there first.",
        "You take the seat opposite her or beside her depending on how brave the day has made you. Piper notices which. Piper notices everything; she just weaponizes denial as a social hobby.",
        "She tosses a pretzel in the air, catches it badly, and glares at physics. \"They're clocking my recovery gaps now,\" she says. \"Not dangerous. Not dramatic. Just enough for people with badges to start saying stupidly careful things near me.\"",
        "\"So that's why you're in such a peaceful mood.\"",
        "\"Right? I'm basically serenity with better cheekbones.\"",
        "If the two of you have built overt chemistry already, she doesn't bother pretending this is neutral. If you haven't, the scene still hums with the possibility of becoming something. That is the Piper trick: she can make a couch feel like a threshold.",
        "You ask what they said.",
        "Piper huffs out a laugh. \"Officially? That repeated high-speed deployment produces small but measurable recovery vulnerability windows. Unofficially? That if I keep acting like a human railgun with opinions, one day somebody's going to try and bench me for my own good.\"",
        "\"And what did you say?\"",
        "\"I said if they bench me, I'm stealing one of the carts and making it everybody's problem.\"",
        "You grin. She watches your mouth when you do and then, because subtlety is not her favorite toy, she leans back and says, \"See, that's what I like. You don't do that fake brave thing where people tell me I'm terrifying and then secretly mean fragile. It's boring.\"",
        "The room narrows a little.",
        "Piper shifts, one hand wrapped around the back of the couch now, gaze suddenly more direct. \"Here's the thing,\" she says. \"Everybody here wants to be seen as capable. Fine. Great. Love that for us. But the minute the system decides your capability makes you expensive, the people around you start changing. Staff get careful. Residents get weird. You get tempted to perform stability so nobody can use your concern as a leash.\"",
        "You are very aware now that she is no longer joking.",
        "\"If you start doing that,\" she says, \"don't do it with me.\"",
        "The line lands harder than it should because it sounds practiced. Not a generic moral. A private wound.",
        "You lean in, just enough to meet her halfway. \"What if I start doing it with everyone?\"",
        "\"Then I will tell you you're being stupid in increasingly creative language.\"",
        "\"Comforting.\"",
        "\"I'm here to help.\"",
        "At the far table, one of the residents gives up on pretending not to listen and gets up to leave. Piper watches them go, waits until the room settles again, then looks back at you with the bright edge gone for one unguarded second.",
        "\"I know I come off like I don't care who watches,\" she says. \"I care. I just hate giving them the satisfaction of seeing which part got under my skin.\"",
        "There it is. The real thing, appearing and retreating so fast you almost miss it.",
        "You don't miss it.",
        "Maybe you tell her that. Maybe you answer with humor because that's the language she made safe first. Maybe you say nothing and let the quiet prove you heard her. Whatever you do, the choice matters.",
        "Piper reaches for the snack bowl, thinks better of the pretzels, and lets it go again. \"Also,\" she says, lighter now because of course she does this the second the room gets real, \"if Camille keeps collecting you for special academic reasons, I reserve the right to be professionally suspicious.\"",
        "\"Professionally.\"",
        "\"Yes. I have standards. They're loose, irresponsible standards, but they're mine.\"",
        "You laugh. She smiles, pleased with herself and not hiding it. Then the smile softens at the edges, and for once she doesn't immediately ruin it.",
        "\"Just,\" she says. \"Don't let them teach you to stand still in the wrong ways.\""
      ],
      "choices": [
        {
          "text": "Tell her she gets to call you out if you start performing stability instead of being honest.",
          "effects": [
            {
              "type": "npc",
              "key": "Piper",
              "trust": 1,
              "respect": 0,
              "attraction": 1
            },
            {
              "type": "relationship",
              "key": "Piper",
              "delta": 2
            },
            {
              "type": "flag",
              "key": "add_c03_piper_stillness_tax_choice_1",
              "value": true
            },
            {
              "type": "stat",
              "key": "control",
              "delta": 1
            }
          ],
          "timeMinutes": 15,
          "next": "c03_hub_return_common"
        },
        {
          "text": "Ask whether her suspicion of Camille is tactical, personal, or just entertaining.",
          "effects": [
            {
              "type": "npc",
              "key": "Piper",
              "trust": 0,
              "respect": 1
            },
            {
              "type": "relationship",
              "key": "Piper",
              "delta": 1
            },
            {
              "type": "flag",
              "key": "add_c03_piper_stillness_tax_choice_2",
              "value": true
            },
            {
              "type": "stat",
              "key": "restraint",
              "delta": 1
            }
          ],
          "timeMinutes": 15,
          "next": "c03_hub_return_common"
        },
        {
          "text": "Move closer and say she seems awfully invested in your posture for a professional observer.",
          "effects": [
            {
              "type": "npc",
              "key": "Piper",
              "trust": 0,
              "respect": 0,
              "attraction": 1
            },
            {
              "type": "relationship",
              "key": "Piper",
              "delta": 1
            },
            {
              "type": "flag",
              "key": "add_c03_piper_stillness_tax_choice_3",
              "value": true
            },
            {
              "type": "stat",
              "key": "resolve",
              "delta": 1
            }
          ],
          "timeMinutes": 15,
          "next": "c03_hub_return_common"
        },
        {
          "text": "Deflect with humor, steal the snack bowl, and tell her she'd miss you if you got boring.",
          "effects": [
            {
              "type": "npc",
              "key": "Piper",
              "trust": 0,
              "respect": 0
            },
            {
              "type": "relationship",
              "key": "Piper",
              "delta": 1
            },
            {
              "type": "flag",
              "key": "add_c03_piper_stillness_tax_choice_4",
              "value": true
            },
            {
              "type": "stat",
              "key": "audacity",
              "delta": 1
            }
          ],
          "timeMinutes": 15,
          "next": "c03_hub_return_common"
        }
      ]
    },
    "add_c03_medical_residuum": {
      "chapter": 3,
      "title": "Medical Residuum",
      "location": "Medical Recovery Bay",
      "background": "aegis",
      "focus": "Seth",
      "text": [
        "The medical recovery bay looks kinder than it is. Softer lights. Pale curtains. Cabinets with rounded corners. Machines that make concern sound efficient. It is the kind of room institutions design when they want to reassure you they know exactly how damaged you are allowed to be.",
        "A medic whose name badge says NORA but whose tone says she has seen three dozen people try to flirt their way out of follow-up scans motions you toward the chair without much interest in your pride. \"Residual check,\" she says. \"Command wants confirmation that yesterday's adaptation and today's stress markers are not escalating each other.\"",
        "\"Romantic.\"",
        "\"Try not to make me write that down.\"",
        "You sit. The chair is warmer than expected. Sensors clip at wrist, collarbone, temple. The monitor wakes in pale green ladders of data that mean everything to someone and not much to you besides the general insult of becoming visible in a room designed for it.",
        "If Chapter 1 or 2 put your body on display in front of staff or friends, that residue is here. Not in melodrama. In familiarity. The med bay already knows the shape of you under pressure better than it should this early in the story.",
        "Nora studies the first sweep. \"You're holding more tension before output now,\" she says. \"Good news, bad news.\"",
        "\"You're going to say good first and mean the bad one more.\"",
        "\"Correct. Good news: adaptation. Bad news: adaptation usually means your system is learning faster than your habits.\"",
        "She adjusts the scanner head. It passes over your sternum with a cool hum that feels too close to being searched.",
        "The curtain to the next bay shifts. Ben's voice carries through once, low and apologetic, followed by a medic telling him apologizing does not reduce bruising. Down the hall, someone laughs too hard and turns it into coughing. This is what inhabited looks like at Aegis: everybody trying to become survivable in adjacent rooms.",
        "Nora glances toward your chart. \"You have opinions attached already.\"",
        "\"Do I get to pick them?\"",
        "\"No. You do get to decide whether they keep fitting.\"",
        "That is more useful than most official guidance has any right to be.",
        "She turns the monitor slightly. Terms flash in and out as the data updates: reserve volatility, recovery lag, cooperative response, social trigger sensitivity. One of the metrics bumps higher when somebody passes noisily in the hall. The machine notices before you do.",
        "\"You hate this,\" Nora says.",
        "\"I hate being translated by expensive furniture.\"",
        "\"Reasonable.\"",
        "She peels the temple sensor off and replaces it with a deeper-read strip. \"Listen carefully. A lot of residents make the same mistake once the building starts paying attention. They assume visibility means they must choose between control and honesty. That's nonsense. Control without honesty becomes performance. Honesty without control becomes a warning label. Our whole job is teaching you not to split yourself that stupidly.\"",
        "For a second the room goes very still. Not because the machine beeps. Because somebody finally said a true thing without dressing it up as doctrine.",
        "You ask if the chart is bad.",
        "Nora snorts. \"Bad charts are loud. Yours is argumentative.\"",
        "The curtain opens. Not all the way. Just enough for Jordan to slide half their face through and say, \"If you're not actively on fire, the lounge is taking bets on whether gallery review made you worse or merely more interesting.\"",
        "Nora points at them without looking. \"Out.\"",
        "Jordan disappears instantly, grinning. \"Worth it.\"",
        "The curtain falls closed again. Nora does not bother pretending she is irritated. \"See?\" she says. \"Inhabited.\"",
        "The scan finishes with a soft descending tone. She pulls the last sensor free and hands you a folded printout nobody your age should have to carry around about their own body.",
        "\"Rest if you need it,\" she says. \"Lie if you must. But don't confuse the two.\"",
        "When you stand, the room tilts only a little. Better than before. Not perfect. Real.",
        "On your way out, you catch your own reflection in the dark monitor for a split second-wired, watched, still standing. At Aegis Point, some days that is its own kind of victory."
      ],
      "choices": [
        {
          "text": "Ask Nora which part of the chart would worry her if she were you.",
          "effects": [
            {
              "type": "flag",
              "key": "add_c03_medical_residuum_choice_1",
              "value": true
            },
            {
              "type": "stat",
              "key": "control",
              "delta": 1
            }
          ],
          "timeMinutes": 15,
          "next": "c03_hub_return_medical"
        },
        {
          "text": "Tell her you'd rather hear the unfiltered version than the polite one.",
          "effects": [
            {
              "type": "flag",
              "key": "add_c03_medical_residuum_choice_2",
              "value": true
            },
            {
              "type": "stat",
              "key": "restraint",
              "delta": 1
            }
          ],
          "timeMinutes": 15,
          "next": "c03_hub_return_medical"
        },
        {
          "text": "Pocket the printout without reading it and head back out before the room can define you any longer.",
          "effects": [
            {
              "type": "flag",
              "key": "add_c03_medical_residuum_choice_3",
              "value": true
            },
            {
              "type": "stat",
              "key": "resolve",
              "delta": 1
            }
          ],
          "timeMinutes": 15,
          "next": "c03_hub_return_medical"
        },
        {
          "text": "Read the chart right there and force yourself not to flinch from your own data.",
          "effects": [
            {
              "type": "flag",
              "key": "add_c03_medical_residuum_choice_4",
              "value": true
            },
            {
              "type": "stat",
              "key": "audacity",
              "delta": 1
            }
          ],
          "timeMinutes": 15,
          "next": "c03_hub_return_medical"
        }
      ]
    },
    "add_c03_ben_reset_room": {
      "chapter": 3,
      "title": "Ben Reset Room",
      "location": "Training Wing Reset Room",
      "background": "sim",
      "focus": "Ben",
      "text": [
        "The reset room off the training wing is mostly mats, cold packs, taped fingers, and a wall fan powerful enough to sound judgmental. It exists for the ten minutes after people insist they are fine and before their bodies file appeals. Ben is in one of the folding chairs with an ice pack tucked against his shoulder and a resistance band looped around his hand, going through rehab motions with the patient misery of somebody who knows doing them badly will only waste more time later.",
        "He looks up when you step in. \"Good,\" he says. \"If you were another medic I was going to fake my death.\"",
        "\"You think they'd let that count as recovery?\"",
        "\"Depends how paperwork-heavy the death looked.\"",
        "You sit on the mat bench opposite him. The room smells faintly of menthol and rubber. Through the open half-door you can hear the training floor thudding under somebody else's problem.",
        "Ben finishes the repetition, drops the band, and rolls his shoulder with a wince he is trying not to make obvious. That's the thing about Ben. He does not dramatize. The pain is there anyway.",
        "\"You get assigned here?\" you ask.",
        "\"Voluntarily. Mostly.\" He shifts the ice pack. \"People think impact absorption means I don't mind being hit. Or that I should be grateful every time a drill needs someone large and durable to make the lesson feel official.\"",
        "The line is quiet. No self-pity. Just truth aired long enough to stop souring in the dark.",
        "If you noticed him properly in earlier chapters, he lets the conversation deepen faster. If you didn't, he is still kind; he is simply less interested in handing you the private version of his life for free.",
        "\"They mean well,\" Ben says. \"Usually. That's the irritating part. Bad intentions are easier to refuse.\"",
        "\"What's harder?\"",
        "\"When people call you reliable when they mean available.\"",
        "The fan hums. Somebody outside cheers a clean hit. Ben glances toward the door and then back at you, expression settling into the sort of openness that only comes from deciding not to waste energy on performance.",
        "\"I like helping,\" he says. \"I really do. But this place has a way of turning your best trait into your assigned labor. Piper gets speed. Camille gets discipline. Theo gets caution. Julian gets diplomacy. I get to stand where things hurt and make everyone feel better about it.\"",
        "It is one of the best explanations of Aegis you have heard: not because it is dramatic, but because it is specific.",
        "You tell him he can say no.",
        "He smiles at that, small and tired. \"Can,\" he says. \"Not always without becoming the problem instead of the solution.\"",
        "Fair again.",
        "He tosses the resistance band into the basket and leans forward, forearms on knees. \"You should decide early what people are allowed to consistently take from you,\" he says. \"Because if you're good at it, they won't ask forever. They'll just start building schedules around your willingness.\"",
        "That line belongs in the same drawer as Theo's warnings and Camille's margin notes: not warm exactly, but intimate because of how useful it is.",
        "He studies you for a second. \"You're under the microscope now,\" he adds. \"That means some people are going to come closer because they like you. Some because they think you change their odds. Learn the difference while it's still cheap.\"",
        "A trainer sticks their head in, sees the ice pack, and thinks better of whatever request they were going to make. Ben watches them leave and laughs once, without humor. \"See? Growth.\"",
        "You grin.",
        "When you stand to go, Ben catches the edge of the chair with one hand and says, almost casually, \"For what it's worth, I think you're doing okay. The watched version of this place makes everybody stranger.\"",
        "It shouldn't land as hard as it does. It does anyway.",
        "Because sometimes what a chapter needs is not another challenge. Sometimes it needs one person to say you do not look impossible from where they're sitting."
      ],
      "choices": [
        {
          "text": "Tell Ben he'll get a no from you if anyone tries to spend him like equipment in your vicinity.",
          "effects": [
            {
              "type": "npc",
              "key": "Ben",
              "trust": 1,
              "respect": 0
            },
            {
              "type": "relationship",
              "key": "Ben",
              "delta": 2
            },
            {
              "type": "flag",
              "key": "add_c03_ben_reset_room_choice_1",
              "value": true
            },
            {
              "type": "stat",
              "key": "control",
              "delta": 1
            }
          ],
          "timeMinutes": 15,
          "next": "c03_hub_return_training"
        },
        {
          "text": "Ask who Aegis keeps trying to turn him into when he isn't looking.",
          "effects": [
            {
              "type": "npc",
              "key": "Ben",
              "trust": 0,
              "respect": 1
            },
            {
              "type": "relationship",
              "key": "Ben",
              "delta": 1
            },
            {
              "type": "flag",
              "key": "add_c03_ben_reset_room_choice_2",
              "value": true
            },
            {
              "type": "stat",
              "key": "restraint",
              "delta": 1
            }
          ],
          "timeMinutes": 15,
          "next": "c03_hub_return_training"
        },
        {
          "text": "Thank him for the warning and admit you needed to hear it from someone not grading you.",
          "effects": [
            {
              "type": "npc",
              "key": "Ben",
              "trust": 0,
              "respect": 0
            },
            {
              "type": "relationship",
              "key": "Ben",
              "delta": 1
            },
            {
              "type": "flag",
              "key": "add_c03_ben_reset_room_choice_3",
              "value": true
            },
            {
              "type": "stat",
              "key": "resolve",
              "delta": 1
            }
          ],
          "timeMinutes": 15,
          "next": "c03_hub_return_training"
        },
        {
          "text": "Make a dry joke about becoming expensive enough that schedules have to negotiate first.",
          "effects": [
            {
              "type": "npc",
              "key": "Ben",
              "trust": 0,
              "respect": 0
            },
            {
              "type": "relationship",
              "key": "Ben",
              "delta": 1
            },
            {
              "type": "flag",
              "key": "add_c03_ben_reset_room_choice_4",
              "value": true
            },
            {
              "type": "stat",
              "key": "audacity",
              "delta": 1
            }
          ],
          "timeMinutes": 15,
          "next": "c03_hub_return_training"
        }
      ]
    },
    "add_c03_vance_glass_office": {
      "chapter": 3,
      "title": "Vance Glass Office",
      "location": "Admin Review Room",
      "background": "aegis",
      "focus": "Vance",
      "text": [
        "Vance's office is all glass, disciplined angles, and the sort of furniture chosen by people who distrust anything that looks like softness. The blinds are half-drawn, which means he wants privacy while still letting the hall believe in access. A tablet lies flat on the desk beside three paper folders, because men like Vance keep paper around for the same reason they keep old scars: as proof that consequences remain real after the systems update.",
        "He waves you in without standing. \"Sit.\"",
        "You do. The chair is deliberately comfortable enough to keep you from shifting around for excuses.",
        "Vance studies the file in front of him, then you, then the file again. \"You're adapting fast.\"",
        "There are a dozen ways that sentence could go. With him, the uncertainty is the point.",
        "\"To the training?\" you ask.",
        "\"To being watched.\"",
        "That is a better answer and a worse one.",
        "He folds his hands. \"Some residents get louder under review. Some shrink. Some decide every authority figure in the building is a personal insult and make that everybody's administrative burden. You are doing something else.\" His eyes narrow slightly. \"You're listening. Choosing. Letting rooms affect you without surrendering your center every time somebody with a credential breathes near you.\"",
        "You have no idea whether this is praise or a preliminary warning.",
        "Vance spares you for a beat, which is as close as he gets to mercy. \"That can make you useful,\" he says. \"It can also make you ambitious in ways people around you will encourage for the wrong reasons.\"",
        "There it is. The institutional version of concern. Less about whether you can survive power. More about what happens once other people decide you can.",
        "Depending on how you have treated him so far-honest, challenging, evasive, professional-the conversation bends. But he does remember. That matters. Vance is not warm, yet he is one of the few people in the building whose attention can feel steadier than the gossip.",
        "\"You've already drawn reactions,\" he says. \"Lane likes acceleration in all forms. Fairchild respects discipline and hunts inconsistency like a blood sport. Vale will turn social weather into a private art project if you let him. Mercer is trying to decide whether to trust what he sees when you're not under direct measurement.\"",
        "\"You do flattering group portraits.\"",
        "\"I do useful ones.\"",
        "He pushes the top page across the desk. You are not meant to keep it. Just see it. A summary line halfway down has been edited in his hand: candidate remains responsive to correction without visible submission. The phrasing is brutal and somehow oddly respectful.",
        "\"You're not a civilian problem,\" Vance says. \"You're not a finished operator either. Chapter three is where residents start mistaking attention for identity. Don't.\"",
        "You lean back. \"That your inspirational poster speech?\"",
        "\"No. If this were a poster, the font would be worse.\"",
        "Against all reasonable probability, that almost gets a laugh out of you. Vance notices and pretends not to.",
        "He taps the paper once. \"Here is what I care about. Not whether people are interested in you. They will be. Not whether your power scales. It does. I care whether increased pressure makes you more honest about your limits or more theatrical about your strengths.\"",
        "The office goes quiet after that. Outside the glass, two staffers pass by with clipboards and don't look in. Everyone at Aegis Point is always one room away from becoming a report.",
        "You ask him whether the answer affects graduation.",
        "\"Everything affects graduation.\"",
        "\"That's not an answer.\"",
        "\"It is in this building.\"",
        "Then, after a pause: \"The answer affects whether I spend political capital on you when this place decides it wants a cleaner version.\"",
        "That lands with more weight than any formal encouragement would have.",
        "Vance sits back. \"Don't make me defend a myth,\" he says. \"I have enough paperwork.\"",
        "For him, that is practically a blessing.",
        "When you stand, he has already picked the file up again. Dismissal and trust in the same gesture: he assumes you can leave a hard conversation without needing it translated into kindness on the way out.",
        "At the door, he adds, without looking up, \"And if you're going to make choices around the core group, make them clean. Ambiguity breeds accidents.\"",
        "He means tactically. He absolutely does not only mean tactically.",
        "The blinds catch the hall light as you step back into the corridor. In the reflection, for one second, you look like exactly the kind of person institutions become nervous about too late."
      ],
      "choices": [
        {
          "text": "Tell Vance you'd rather be defended as a problem than simplified into an asset.",
          "effects": [
            {
              "type": "npc",
              "key": "Vance",
              "trust": 1,
              "respect": 0
            },
            {
              "type": "relationship",
              "key": "Vance",
              "delta": 2
            },
            {
              "type": "flag",
              "key": "add_c03_vance_glass_office_choice_1",
              "value": true
            },
            {
              "type": "stat",
              "key": "control",
              "delta": 1
            }
          ],
          "timeMinutes": 15,
          "next": "c03_hub_return_admin"
        },
        {
          "text": "Ask whether he thinks clean choices are possible once people start mattering.",
          "effects": [
            {
              "type": "npc",
              "key": "Vance",
              "trust": 0,
              "respect": 1
            },
            {
              "type": "relationship",
              "key": "Vance",
              "delta": 1
            },
            {
              "type": "flag",
              "key": "add_c03_vance_glass_office_choice_2",
              "value": true
            },
            {
              "type": "stat",
              "key": "restraint",
              "delta": 1
            }
          ],
          "timeMinutes": 15,
          "next": "c03_hub_return_admin"
        },
        {
          "text": "Say you'll take useful over flattering every time and make him believe you mean it.",
          "effects": [
            {
              "type": "npc",
              "key": "Vance",
              "trust": 0,
              "respect": 0
            },
            {
              "type": "relationship",
              "key": "Vance",
              "delta": 1
            },
            {
              "type": "flag",
              "key": "add_c03_vance_glass_office_choice_3",
              "value": true
            },
            {
              "type": "stat",
              "key": "resolve",
              "delta": 1
            }
          ],
          "timeMinutes": 15,
          "next": "c03_hub_return_admin"
        },
        {
          "text": "Thank him for the warning and leave before the conversation can become permission.",
          "effects": [
            {
              "type": "npc",
              "key": "Vance",
              "trust": 0,
              "respect": 0
            },
            {
              "type": "relationship",
              "key": "Vance",
              "delta": 1
            },
            {
              "type": "flag",
              "key": "add_c03_vance_glass_office_choice_4",
              "value": true
            },
            {
              "type": "stat",
              "key": "audacity",
              "delta": 1
            }
          ],
          "timeMinutes": 15,
          "next": "c03_hub_return_admin"
        }
      ]
    },
    "add_c04_warmup_lane_rina": {
      "chapter": 4,
      "title": "Warmup Lane Rina",
      "location": "Sim Block Warm-Up Lane",
      "background": "sim",
      "focus": "Rina",
      "text": [
        "The warm-up lane outside Sim Chamber Three smells like rubber flooring, cleaning solvent, and the kind of tired recycled air that accumulates around places where people spend all day trying to outperform versions of themselves they already resent. A digital clock counts down to the next training slot in indifferent red numbers. Two first-years farther down the lane are pretending not to watch you while stretching with the intensity of people trying to make themselves disappear through competence.",
        "Rina is not pretending anything. She is finishing a sequence of acceleration starts that stop short of showing off only because she has too much pride to do something as obvious as show off in front of a room designed to measure it. Her breathing is even. Her expression is not. She clocks you, resets, and walks back toward the start line with the irritated energy of someone who would like the universe to stop producing people interesting enough to complicate her ranking of things.",
        "\"You look more rested than yesterday,\" she says.",
        "It is not quite a compliment. It is also not an insult. With Rina, the first useful skill is learning to identify the middle category: statements offered like a blade held flat instead of edge-first.",
        "\"If that's because you actually slept,\" she adds, \"good. If it's because you're trying to coast into a harder block looking pretty, that's less good.\"",
        "The lane behind her flashes green. She ignores it for one more second, studying you the way competitive people study weather systems. Not emotionally. Practically. You are not a friend in her head first. You are an outcome variable.",
        "\"That thing with the observation board yesterday?\" she says. \"People react weird when staff start taking notes like your mistakes might someday need policy language. Some of them get intimidated. Some of them get fascinated. Most of them get annoying. If anybody starts treating you like being watched is the same thing as being important, do yourself a favor and don't inhale.\"",
        "There is a rough kind of generosity in it. Not warmth. Not exactly. But the sort of field advice one fighter gives another when they think ego is about to make the next bruise more embarrassing than useful.",
        "For a second the two of you just stand there in the hum of the lane while the clock burns down another minute. It is the closest thing Rina ever offers to a quiet truce: no performance, no crowd, just one competitor deciding another deserves the unpolished version. People like her do not hand that out because they are nice. They hand it out because they hate waste.",
        "She glances toward the chamber doors. \"Camille's running this block, which means the point is going to be control under insult. She likes seeing what people reach for when they're frustrated. Not scared. Frustrated. Different crack in the wall.\"",
        "The timer flashes again. Rina starts to turn away, then stops. \"And if Piper gets in your ear before the doors open, remember she's very persuasive right up until you're the one paying for the consequences.\"",
        "That lands with just enough dryness to be funny. Barely."
      ],
      "choices": [
        {
          "text": "You sound like you've paid for a few of her consequences yourself.",
          "effects": [
            {
              "type": "npc",
              "key": "Rina",
              "trust": 1,
              "respect": 0
            },
            {
              "type": "relationship",
              "key": "Rina",
              "delta": 2
            },
            {
              "type": "flag",
              "key": "add_c04_warmup_lane_rina_choice_1",
              "value": true
            },
            {
              "type": "stat",
              "key": "control",
              "delta": 1
            }
          ],
          "timeMinutes": 15,
          "next": "c04_hub_return_sim"
        },
        {
          "text": "Thanks. Genuinely. I can work with useful.",
          "effects": [
            {
              "type": "npc",
              "key": "Rina",
              "trust": 0,
              "respect": 1
            },
            {
              "type": "relationship",
              "key": "Rina",
              "delta": 1
            },
            {
              "type": "flag",
              "key": "add_c04_warmup_lane_rina_choice_2",
              "value": true
            },
            {
              "type": "stat",
              "key": "restraint",
              "delta": 1
            }
          ],
          "timeMinutes": 15,
          "next": "c04_hub_return_sim"
        },
        {
          "text": "You make everyone sound like a hazard label.",
          "effects": [
            {
              "type": "npc",
              "key": "Rina",
              "trust": 0,
              "respect": 0
            },
            {
              "type": "relationship",
              "key": "Rina",
              "delta": 1
            },
            {
              "type": "flag",
              "key": "add_c04_warmup_lane_rina_choice_3",
              "value": true
            },
            {
              "type": "stat",
              "key": "resolve",
              "delta": 1
            }
          ],
          "timeMinutes": 15,
          "next": "c04_hub_return_sim"
        },
        {
          "text": "And what do I need to remember about you?",
          "effects": [
            {
              "type": "npc",
              "key": "Rina",
              "trust": 0,
              "respect": 0
            },
            {
              "type": "relationship",
              "key": "Rina",
              "delta": 1
            },
            {
              "type": "flag",
              "key": "add_c04_warmup_lane_rina_choice_4",
              "value": true
            },
            {
              "type": "stat",
              "key": "audacity",
              "delta": 1
            }
          ],
          "timeMinutes": 15,
          "next": "c04_hub_return_sim"
        }
      ]
    },
    "add_c04_camille_service_corridor": {
      "chapter": 4,
      "title": "Camille Service Corridor",
      "location": "Sim Chamber Service Corridor",
      "background": "sim",
      "focus": "Camille",
      "text": [
        "The service corridor behind Sim Chamber Three is narrower than the public approach and twice as honest. There are exposed conduit lines overhead, storage lockers built into the wall, and a rolling rack full of emergency foam canisters that does a poor job of making the day's purpose feel routine. Through the observation glass set into the inner door you can see the chamber standing empty and bright, clean in the way only rooms designed to be damaged repeatedly ever are.",
        "Camille is already there with a tablet in one hand and a stylus tucked behind one ear. She has changed into training blacks with violet piping at the shoulders, which somehow makes her look even more formal. On anyone else, it would read like costume. On her it reads like intent with seams.",
        "She glances up when you step in. No surprise. No wasted motion. \"You are on time,\" she says.",
        "It should not sound like praise. It almost does.",
        "She angles the tablet toward herself again. \"Today's point is not output. If I wanted output, I could get that from you by insulting your competence in front of a crowd and waiting sixty seconds.\"",
        "That earns the smallest pause from you before she continues, which is probably exactly why she said it.",
        "\"Today's point,\" she says, \"is whether you can remain legible when your instincts are under pressure. A stable operator is not someone who never reaches fast. It is someone whose fast choices can still be understood, trusted, and repeated.\"",
        "There is no audience here yet, which makes the corridor more dangerous in its own way. Privacy sharpens people. It means every word can afford to be more precise. If there has been tension between you before now-flirtation, friction, admiration, the very specific irritation of wanting her approval enough to notice when she withholds it-it fits strangely well in rooms like this. Rooms where nothing is being staged for the benefit of a third party.",
        "She locks the tablet and sets it aside. \"I do not care whether you impress them today.\"",
        "The lie is almost elegant. She sees the reaction cross your face and corrects with exacting honesty. \"I care less about that than whether you give them something sloppy to remember.\"",
        "That is more honest. More her.",
        "For a moment she studies you in silence. Not your power. You. The pressure you are carrying. The shape of your attention. The answer, apparently, satisfies some hidden threshold, because when she speaks again her voice is quieter.",
        "\"You have more instinct than discipline right now,\" she says. \"That is not an insult. It is a volatile resource. If you want me to help you sharpen it instead of merely survive it, then listen exactly once and decide whether you trust me enough to obey in public.\"",
        "That sentence does several things at once and she knows it. It offers instruction. It asks for trust without dressing the request up. It places both of you in the same future sentence. If there has been an overt current between you already, it hums harder here-not because she says anything soft, but because she does not bother pretending there is no intimacy in choosing who gets to direct your attention under pressure.",
        "Beyond the inner door, the chamber lights shift from white to warning amber and back again. Somewhere overhead the ventilation changes pitch. The whole corridor seems to tighten around the moment before a test begins, and Camille-of all people-looks most herself there. Not gentler. Not easier. Just unmistakably alive in a way she rarely lets the public parts show. You get the sense that she trusts pressure more than she trusts charm. The dangerous thing is that you are beginning to understand why."
      ],
      "choices": [
        {
          "text": "Give me the instruction clean. I'll decide what to do with it once I hear it.",
          "effects": [
            {
              "type": "npc",
              "key": "Camille",
              "trust": 1,
              "respect": 0
            },
            {
              "type": "relationship",
              "key": "Camille",
              "delta": 2
            },
            {
              "type": "flag",
              "key": "add_c04_camille_service_corridor_choice_1",
              "value": true
            },
            {
              "type": "stat",
              "key": "control",
              "delta": 1
            }
          ],
          "timeMinutes": 15,
          "next": "c04_hub_return_sim"
        },
        {
          "text": "I trust you more than I like how much I trust you.",
          "effects": [
            {
              "type": "npc",
              "key": "Camille",
              "trust": 0,
              "respect": 1
            },
            {
              "type": "relationship",
              "key": "Camille",
              "delta": 1
            },
            {
              "type": "flag",
              "key": "add_c04_camille_service_corridor_choice_2",
              "value": true
            },
            {
              "type": "stat",
              "key": "restraint",
              "delta": 1
            }
          ],
          "timeMinutes": 15,
          "next": "c04_hub_return_sim"
        },
        {
          "text": "If you want obedience, you should ask somebody easier.",
          "effects": [
            {
              "type": "npc",
              "key": "Camille",
              "trust": 0,
              "respect": 0,
              "attraction": 1
            },
            {
              "type": "relationship",
              "key": "Camille",
              "delta": 1
            },
            {
              "type": "flag",
              "key": "add_c04_camille_service_corridor_choice_3",
              "value": true
            },
            {
              "type": "stat",
              "key": "resolve",
              "delta": 1
            }
          ],
          "timeMinutes": 15,
          "next": "c04_hub_return_sim"
        },
        {
          "text": "Then sharpen it. I'm here.",
          "effects": [
            {
              "type": "npc",
              "key": "Camille",
              "trust": 0,
              "respect": 0
            },
            {
              "type": "relationship",
              "key": "Camille",
              "delta": 1
            },
            {
              "type": "flag",
              "key": "add_c04_camille_service_corridor_choice_4",
              "value": true
            },
            {
              "type": "stat",
              "key": "audacity",
              "delta": 1
            }
          ],
          "timeMinutes": 15,
          "next": "c04_hub_return_sim"
        }
      ]
    },
    "add_c04_julian_gallery_rail": {
      "chapter": 4,
      "title": "Julian Gallery Rail",
      "location": "Observation Gallery Rail",
      "background": "sim",
      "focus": "Julian",
      "text": [
        "The observation gallery rail is waist-high brushed steel polished by years of trainees leaning against it while pretending not to care how the next person performs. Below, the chamber lights cycle through pre-sim checks in sterile white bands. The room looks less like a classroom and more like an argument waiting for weather.",
        "Julian is already at the rail with one elbow hooked over it like he belongs in every room that could possibly contain drama. He has, somehow, made Aegis-issued casualwear look intentional. There is a paper cup in his hand that claims to contain coffee and probably mostly contains sugar. He glances sideways when you stop beside him and smiles without any of the brightness he uses when he wants to entertain a room.",
        "\"Look at us,\" he says. \"Adults with opinions near industrial glass. This is exactly what my guidance counselor pictured.\"",
        "Below, a technician wheels target units into place. Somewhere behind you, someone is making a very committed argument about safety thresholds and saying nothing remotely sexy despite the tone trying its best.",
        "Julian sips from the cup, makes a face that suggests the drink has offended him personally, and continues. \"There is a specific kind of day where everyone suddenly becomes fascinated by what kind of person you are under pressure. Mostly because they would prefer not to examine what kind of person they are under pressure. Congratulations on generating one.\"",
        "He says it lightly, but this is not throwaway banter. Nothing with him ever is once the room thins enough. If Chapters 1 through 3 put the two of you on a wavelength-through wit, flirtation, being unexpectedly honest in the right window of time-there is an ease here that feels less accidental than it did before. If not, the ease is still available. It just has more test to it.",
        "\"You know what I think Camille likes about this block?\" he asks. \"Not that she gets to correct people. She likes getting evidence. You can only argue with vibes for so long. Under pressure, everyone becomes proof of concept.\"",
        "He turns the cup in his hand. \"The trick is deciding what you are comfortable proving in public.\"",
        "There is a way to answer that that keeps this scene sparkling and safe. There is also a way to answer it that changes the air between you. Julian leaves both doors unlocked on purpose. That is part of his talent. He knows how to make an exchange feel elegant enough that you can step deeper into it without feeling cornered.",
        "A warning tone sounds below. The chamber is almost ready. Julian's gaze returns to the glass for a second, then back to you. \"For what it's worth,\" he says, softer now, \"I do not think you become more real only when you're failing. I just think some people stop lying as efficiently.\"",
        "That might be the kindest thing he has said to you so far. It might also be a challenge."
      ],
      "choices": [
        {
          "text": "Then watch closely. I would hate for you to miss the interesting part.",
          "effects": [
            {
              "type": "npc",
              "key": "Julian",
              "trust": 1,
              "respect": 0
            },
            {
              "type": "relationship",
              "key": "Julian",
              "delta": 2
            },
            {
              "type": "flag",
              "key": "add_c04_julian_gallery_rail_choice_1",
              "value": true
            },
            {
              "type": "stat",
              "key": "control",
              "delta": 1
            }
          ],
          "timeMinutes": 15,
          "next": "c04_hub_return_sim"
        },
        {
          "text": "If I embarrass myself, I expect you to make it sound artful later.",
          "effects": [
            {
              "type": "npc",
              "key": "Julian",
              "trust": 0,
              "respect": 1
            },
            {
              "type": "relationship",
              "key": "Julian",
              "delta": 1
            },
            {
              "type": "flag",
              "key": "add_c04_julian_gallery_rail_choice_2",
              "value": true
            },
            {
              "type": "stat",
              "key": "restraint",
              "delta": 1
            }
          ],
          "timeMinutes": 15,
          "next": "c04_hub_return_sim"
        },
        {
          "text": "You say things like that and then act surprised when people keep coming back to you.",
          "effects": [
            {
              "type": "npc",
              "key": "Julian",
              "trust": 0,
              "respect": 0
            },
            {
              "type": "relationship",
              "key": "Julian",
              "delta": 1
            },
            {
              "type": "flag",
              "key": "add_c04_julian_gallery_rail_choice_3",
              "value": true
            },
            {
              "type": "stat",
              "key": "resolve",
              "delta": 1
            }
          ],
          "timeMinutes": 15,
          "next": "c04_hub_return_sim"
        },
        {
          "text": "Public proof is overrated. I'm more interested in who remembers accurately after.",
          "effects": [
            {
              "type": "npc",
              "key": "Julian",
              "trust": 0,
              "respect": 0
            },
            {
              "type": "relationship",
              "key": "Julian",
              "delta": 1
            },
            {
              "type": "flag",
              "key": "add_c04_julian_gallery_rail_choice_4",
              "value": true
            },
            {
              "type": "stat",
              "key": "audacity",
              "delta": 1
            }
          ],
          "timeMinutes": 15,
          "next": "c04_hub_return_sim"
        }
      ]
    },
    "add_c04_theo_reset_room": {
      "chapter": 4,
      "title": "Theo Reset Room",
      "location": "Training Wing Reset Room",
      "background": "sim",
      "focus": "Theo",
      "text": [
        "The reset room is one of Aegis Point's more honest inventions. It is not comfortable enough to be called a lounge and not clinical enough to be mistaken for treatment. It is a room for cooling off without the insult of pretending nobody needs cooling off. There are two narrow couches, a hydration station, a wall-mounted fan that hums constantly, and a whiteboard covered in old marker ghosts from probabilities somebody gave up trying to scrub clean.",
        "Theo is standing at the board when you step in, marker uncapped, halfway through writing something that looks like either math or a personal grievance against certainty. He startles only a little, which means he expected a person, just maybe not you this quickly.",
        "\"Sorry,\" he says automatically, then looks irritated at himself for saying it. \"You can come in. I wasn't-this isn't secret.\"",
        "He glances at the board, where arrows and percentages already describe the training block more like a weather map than a recap. \"I was trying to figure out whether your second-wave correction was actually faster after the first mistake or if it just felt faster because everyone in the room had started bracing for disaster.\"",
        "The fact that this is how his brain processes concern would be funny if it were not also weirdly touching. The room is quiet enough that you can hear the marker click faintly against his thumbnail as he thinks. With Theo, attention always arrives carrying structure. That does not make it less personal. If anything, it makes it harder to dismiss as impulse.",
        "He caps the marker. \"For the record, I think Camille was right to push there. I also think people like using the word control when they really mean make me less afraid in your vicinity.\"",
        "The room's fan clicks as it oscillates. Somewhere outside, a weighted sled hits the floor hard enough to send a dull shiver through the wall. The whole building seems built around the assumption that nobody in it gets to have a private nervous system for very long.",
        "Theo leans a shoulder against the whiteboard. \"You do understand,\" he says, carefully, \"that the reason some of us are hard on you isn't because we want less of you. It's because rooms have started rearranging themselves around what happens when you are tired, or annoyed, or pushed too fast. That's not small.\"",
        "That is more personal than he probably intended to get in one sentence. Or maybe exactly as personal as he intended if prior chapters have taught him you do better with honesty than with handling.",
        "If there is overt tension between you already, it lives here differently than it does with Piper or Camille or Julian. Less combustion, more gravity. Theo does not move toward people dramatically. He reveals that he has already built space for them and lets that realization do its own damage.",
        "He rubs the back of his neck. \"Also, for the record, the thing you did in the gap between the second and third construct? That was either good adaptation or a terrible habit forming in real time. I haven't decided yet. Which is annoying, because I prefer categories.\"",
        "His mouth twitches like he hates that he just made a joke and knows you noticed."
      ],
      "choices": [
        {
          "text": "Then help me build the category before somebody else does it for us.",
          "effects": [
            {
              "type": "npc",
              "key": "Theo",
              "trust": 1,
              "respect": 0
            },
            {
              "type": "relationship",
              "key": "Theo",
              "delta": 2
            },
            {
              "type": "flag",
              "key": "add_c04_theo_reset_room_choice_1",
              "value": true
            },
            {
              "type": "stat",
              "key": "control",
              "delta": 1
            }
          ],
          "timeMinutes": 15,
          "next": "c04_hub_return_sim"
        },
        {
          "text": "You say terrifying things like they're technical notes.",
          "effects": [
            {
              "type": "npc",
              "key": "Theo",
              "trust": 0,
              "respect": 1
            },
            {
              "type": "relationship",
              "key": "Theo",
              "delta": 1
            },
            {
              "type": "flag",
              "key": "add_c04_theo_reset_room_choice_2",
              "value": true
            },
            {
              "type": "stat",
              "key": "restraint",
              "delta": 1
            }
          ],
          "timeMinutes": 15,
          "next": "c04_hub_return_sim"
        },
        {
          "text": "Do you ever stop looking at me like an emerging risk model?",
          "effects": [
            {
              "type": "npc",
              "key": "Theo",
              "trust": 0,
              "respect": 0
            },
            {
              "type": "relationship",
              "key": "Theo",
              "delta": 1
            },
            {
              "type": "flag",
              "key": "add_c04_theo_reset_room_choice_3",
              "value": true
            },
            {
              "type": "stat",
              "key": "resolve",
              "delta": 1
            }
          ],
          "timeMinutes": 15,
          "next": "c04_hub_return_sim"
        },
        {
          "text": "Keep being honest. I trust you more when you don't soften it.",
          "effects": [
            {
              "type": "npc",
              "key": "Theo",
              "trust": 0,
              "respect": 0,
              "attraction": 1
            },
            {
              "type": "relationship",
              "key": "Theo",
              "delta": 1
            },
            {
              "type": "flag",
              "key": "add_c04_theo_reset_room_choice_4",
              "value": true
            },
            {
              "type": "stat",
              "key": "audacity",
              "delta": 1
            }
          ],
          "timeMinutes": 15,
          "next": "c04_hub_return_sim"
        }
      ]
    },
    "add_c04_medical_aftertaste": {
      "chapter": 4,
      "title": "Medical Aftertaste",
      "location": "Medical Wing Scan Bay",
      "background": "aegis",
      "focus": "Seth",
      "text": [
        "The scan bay lighting is too soft to be kind. It is the sort of curated low-glare brightness designed to calm people who have already figured out they are being studied intimately. A narrow exam chair waits in the center of the room with more restraint options folded discreetly into its arms than anyone should find reassuring. The diagnostic rig hums overhead. Somewhere beyond the sliding partition, somebody laughs once and then winces hard enough to make the laugh sound like a mistake.",
        "The medic on duty tonight has the same neutral expression every Aegis medical professional seems to graduate with after enough months treating powers as both health event and liability category. She checks your pupils, asks whether the output left ringing in the ears, metallic taste, phantom temperature shift, pressure behind the eyes. She says all of it in a tone that suggests there are no wrong answers, only answers that will increase paperwork.",
        "There is always a moment during these scans where the body stops feeling like yours and starts feeling like a set of persuasive documents. The machine maps stress signatures, microtears, thermal drift, recovery lag. It turns effort into visible pattern. If earlier chapters taught you anything, it is that Aegis trusts pattern more than reassurance and measurable damage more than impossible resilience.",
        "\"Your system still spikes cleaner than we'd prefer,\" the medic says, eyes on the display. \"That is better than damage, but not simpler.\"",
        "Nothing here is ever simpler.",
        "The bay screen flickers as a new message queue appears on the side monitor. A training note from Camille. A concern-disguised-as-joke from Piper if she is already in that lane with you. A precise check-in from Theo if he is. Something elegant and harder to categorize from Julian if the two of you have already developed the habit of not saying simple things simply. None of it stops the scan from happening. It just makes the room feel less anonymous.",
        "The medic notices you noticing the queue and says, \"We can pause if you need a minute.\"",
        "Need is an interesting word in a place like this. Need can mean medically indicated. It can mean emotionally obvious. It can mean the point at which performance starts costing more than the building considers efficient. The bay smells faintly of antiseptic, plastic tubing, and cold mineral water. The curtain track above the next station rattles as someone is wheeled out under a blanket and still arguing with staff that they are fine.",
        "That is maybe the most Aegis sentence possible: I am fine, spoken while horizontal.",
        "The scanner shifts and throws a fresh wash of pale light over your hands. For a moment every tiny tremor in your fingers feels too visible to belong to you. The medic watches the readout instead of your face, which is somehow kinder and less kind at the same time. The machine does not care whether strain came from ambition, fear, attraction, or the humiliating desire to prove the room wrong. It only cares that strain leaves signatures. Around here, signatures become records, and records become versions of you that other people trust more than your own description.",
        "The medic lowers the scanner arm. \"I am required to ask whether you want the sanitized explanation, the useful explanation, or the one I would give someone I expected to come back in worse condition next week.\"",
        "The fact that she asks it with a straight face almost makes you laugh.",
        "\"None of these answers are secret,\" she adds. \"But they are different.\"",
        "That feels like Chapter 4 in one line. Nothing here is secret. Everything here is different depending on who says it, who hears it, and who has to live in the body afterward."
      ],
      "choices": [
        {
          "text": "Useful explanation. I can do fear later if necessary.",
          "effects": [
            {
              "type": "flag",
              "key": "add_c04_medical_aftertaste_choice_1",
              "value": true
            },
            {
              "type": "stat",
              "key": "control",
              "delta": 1
            }
          ],
          "timeMinutes": 15,
          "next": "c04_hub_return_common"
        },
        {
          "text": "Give me the real one. I am tired of being reassured in bureaucratic dialect.",
          "effects": [
            {
              "type": "flag",
              "key": "add_c04_medical_aftertaste_choice_2",
              "value": true
            },
            {
              "type": "stat",
              "key": "restraint",
              "delta": 1
            }
          ],
          "timeMinutes": 15,
          "next": "c04_hub_return_common"
        },
        {
          "text": "Can I answer after I check the messages first?",
          "effects": [
            {
              "type": "flag",
              "key": "add_c04_medical_aftertaste_choice_3",
              "value": true
            },
            {
              "type": "stat",
              "key": "resolve",
              "delta": 1
            }
          ],
          "timeMinutes": 15,
          "next": "c04_hub_return_common"
        },
        {
          "text": "Tell me the version you'd give someone you expected to survive this place on purpose.",
          "effects": [
            {
              "type": "flag",
              "key": "add_c04_medical_aftertaste_choice_4",
              "value": true
            },
            {
              "type": "stat",
              "key": "audacity",
              "delta": 1
            }
          ],
          "timeMinutes": 15,
          "next": "c04_hub_return_common"
        }
      ]
    },
    "add_c04_vance_review_window": {
      "chapter": 4,
      "title": "Vance Review Window",
      "location": "Glass Review Office",
      "background": "aegis",
      "focus": "Vance",
      "text": [
        "Vance's office manages the impossible trick of being both transparent and private. One wall is glass looking out over a lower training wing, so anyone passing can tell whether he is in the room and nobody can convincingly claim they were summoned into mystery. The rest is practical furniture, stacked folders, a coat hung precisely on the back of the door, and the kind of coffee machine owned by a man who has made peace with disappointment.",
        "He does not ask you to sit immediately. He watches you cross the threshold first, as if gait, fatigue, and whether you look like someone bracing for discipline are all part of the meeting before any words begin.",
        "\"You are not in trouble,\" he says.",
        "The sentence would be more comforting if people in authority ever understood how often they say it right before something unpleasant.",
        "Vance either notices that thought or predicts it from experience. \"That was not reassurance,\" he says. \"That was classification.\"",
        "At least he is honest.",
        "He gestures to the chair across from the desk. \"Camille says your corrections are getting faster. Medical says your body continues to make that both promising and annoying. The gallery says half the cohort now thinks they understand your instincts. They do not. But they have started building stories. I care about what stories you are helping them build.\"",
        "That is the Vance version of intimacy: not softness, exactly, but taking your future seriously enough to be severe about it.",
        "If earlier chapters have tilted your relationship with him one way or another, it colors the room now. Maybe he is seeing a recruit worth investing in. Maybe he is seeing a volatility case with good manners. Maybe he is seeing exactly the kind of talented adult Aegis was built to stop from becoming the center of a regional incident report. With him, positive attention and professional concern are often the same sentence with a different tie knot.",
        "He folds his hands. \"Pressure strips performance choices down to preference. Preference becomes habit. Habit becomes reputation. Reputation becomes policy. You understand the sequence?\"",
        "You do. That is the problem.",
        "Outside the glass, two residents carry training mats down the hall while pretending not to look into the office. The whole campus runs on that kind of almost-discretion. Vance waits long enough for the question to become heavier than the silence.",
        "\"What are you trying to become before other people finish deciding it for you?\""
      ],
      "choices": [
        {
          "text": "Reliable enough that fear isn't the most useful story available about me.",
          "effects": [
            {
              "type": "npc",
              "key": "Vance",
              "trust": 1,
              "respect": 0
            },
            {
              "type": "relationship",
              "key": "Vance",
              "delta": 2
            },
            {
              "type": "flag",
              "key": "add_c04_vance_review_window_choice_1",
              "value": true
            },
            {
              "type": "stat",
              "key": "control",
              "delta": 1
            }
          ],
          "timeMinutes": 15,
          "next": "c04_hub_return_common"
        },
        {
          "text": "Something this place can't flatten without losing the point.",
          "effects": [
            {
              "type": "npc",
              "key": "Vance",
              "trust": 0,
              "respect": 1
            },
            {
              "type": "relationship",
              "key": "Vance",
              "delta": 1
            },
            {
              "type": "flag",
              "key": "add_c04_vance_review_window_choice_2",
              "value": true
            },
            {
              "type": "stat",
              "key": "restraint",
              "delta": 1
            }
          ],
          "timeMinutes": 15,
          "next": "c04_hub_return_common"
        },
        {
          "text": "I am still figuring that out. I would rather do it honestly than fast.",
          "effects": [
            {
              "type": "npc",
              "key": "Vance",
              "trust": 0,
              "respect": 0
            },
            {
              "type": "relationship",
              "key": "Vance",
              "delta": 1
            },
            {
              "type": "flag",
              "key": "add_c04_vance_review_window_choice_3",
              "value": true
            },
            {
              "type": "stat",
              "key": "resolve",
              "delta": 1
            }
          ],
          "timeMinutes": 15,
          "next": "c04_hub_return_common"
        },
        {
          "text": "Useful first. Everything else can argue about itself later.",
          "effects": [
            {
              "type": "npc",
              "key": "Vance",
              "trust": 0,
              "respect": 0
            },
            {
              "type": "relationship",
              "key": "Vance",
              "delta": 1
            },
            {
              "type": "flag",
              "key": "add_c04_vance_review_window_choice_4",
              "value": true
            },
            {
              "type": "stat",
              "key": "audacity",
              "delta": 1
            }
          ],
          "timeMinutes": 15,
          "next": "c04_hub_return_common"
        }
      ]
    },
    "add_c04_ben_pool_edge": {
      "chapter": 4,
      "title": "Ben Pool Edge",
      "location": "Recovery Pool Deck",
      "background": "aegis",
      "focus": "Ben",
      "text": [
        "The recovery pool deck is humid in the peaceful, faintly medicinal way all rehab spaces are. Water slaps gently against tile. Overhead lights ripple in the surface and throw fractured blue up across the walls. Someone at the far end of the pool is doing painfully slow range-of-motion work under a therapist's supervision and cursing with admirable creativity under their breath.",
        "Ben sits on a bench near the towel shelves with one leg stretched out and an ice wrap balanced over his knee. He looks up when you come in and lifts a hand in greeting like he has already decided you are allowed to see him off-duty enough to limp.",
        "\"Before you ask,\" he says, \"no dramatic heroics. I landed wrong in a partner drill and my body objected to the paperwork.\"",
        "The line is dry enough to make clear he does not want pity, which is useful information in itself.",
        "There is something quietly important about seeing the strongest-looking people in the cohort be ordinary around pain. Aegis has a way of turning injury into trivia unless someone insists on the human part. Ben never insists loudly. He just lives in a body people assume can take more than it should and keeps choosing not to become bitter about it. That may be rarer than any power in the building.",
        "He studies your face for a second. \"You look like somebody trying to decide whether being told you're improving is good news or just a different brand of pressure.\"",
        "That is uncomfortably accurate.",
        "Ben shrugs one shoulder. \"For what it's worth, I think most of this place confuses endurance with virtue. Sometimes surviving a bad setup just means nobody changed the setup. Doesn't make you noble. Just makes you still there.\"",
        "The pool filter hums. The therapist at the far end tells somebody to breathe slower. Ben adjusts the ice wrap and grimaces once, fast enough that you almost miss it.",
        "\"If you keep getting better this fast,\" he says, \"people are going to start expecting you to be made for it. Don't let them skip the part where made for it still hurts.\"",
        "It is not a dramatic speech. Ben is too decent for theatrics. But the sentence lands harder because it sounds like something he had to learn alone and would rather hand over than watch somebody else bleed for it."
      ],
      "choices": [
        {
          "text": "You say that like you've been volunteered for other people's confidence a lot.",
          "effects": [
            {
              "type": "npc",
              "key": "Ben",
              "trust": 1,
              "respect": 0
            },
            {
              "type": "relationship",
              "key": "Ben",
              "delta": 2
            },
            {
              "type": "flag",
              "key": "add_c04_ben_pool_edge_choice_1",
              "value": true
            },
            {
              "type": "stat",
              "key": "control",
              "delta": 1
            }
          ],
          "timeMinutes": 15,
          "next": "c04_hub_return_common"
        },
        {
          "text": "Thanks. Really. Most people around here turn pain into a performance review.",
          "effects": [
            {
              "type": "npc",
              "key": "Ben",
              "trust": 0,
              "respect": 1
            },
            {
              "type": "relationship",
              "key": "Ben",
              "delta": 1
            },
            {
              "type": "flag",
              "key": "add_c04_ben_pool_edge_choice_2",
              "value": true
            },
            {
              "type": "stat",
              "key": "restraint",
              "delta": 1
            }
          ],
          "timeMinutes": 15,
          "next": "c04_hub_return_common"
        },
        {
          "text": "I don't want to become someone everybody only trusts when I'm breaking myself.",
          "effects": [
            {
              "type": "npc",
              "key": "Ben",
              "trust": 0,
              "respect": 0
            },
            {
              "type": "relationship",
              "key": "Ben",
              "delta": 1
            },
            {
              "type": "flag",
              "key": "add_c04_ben_pool_edge_choice_3",
              "value": true
            },
            {
              "type": "stat",
              "key": "resolve",
              "delta": 1
            }
          ],
          "timeMinutes": 15,
          "next": "c04_hub_return_common"
        },
        {
          "text": "Want company or quiet?",
          "effects": [
            {
              "type": "npc",
              "key": "Ben",
              "trust": 0,
              "respect": 0
            },
            {
              "type": "relationship",
              "key": "Ben",
              "delta": 1
            },
            {
              "type": "flag",
              "key": "add_c04_ben_pool_edge_choice_4",
              "value": true
            },
            {
              "type": "stat",
              "key": "audacity",
              "delta": 1
            }
          ],
          "timeMinutes": 15,
          "next": "c04_hub_return_common"
        }
      ]
    },
    "add_c04_piper_track_late": {
      "chapter": 4,
      "title": "Piper Track Late",
      "location": "Indoor Track",
      "background": "aegis",
      "focus": "Piper",
      "text": [
        "The indoor track after hours feels like a conspiracy with overhead lighting. The facility dims everything except the lane markers and the emergency path strips, leaving the oval washed in cool blue-white and shadow. Your footsteps sound clearer here. So does anyone else's. Piper is halfway around the curve when you step in, jogging at the lazy speed she uses when she is trying to convince herself she is resting.",
        "She spots you, rolls her eyes at being caught, and slows into a backward jog for three steps before turning fully. \"Before you start,\" she says, \"I know what rest is. I just disagree with most people's boring interpretation of it.\"",
        "Her hair is damp at the temples. Her breathing is light. There is a flush high on her cheekbones that makes her look younger for exactly one second before the usual sharp humor reasserts itself.",
        "For half a lap neither of you says anything. It is not awkward. It is the opposite of awkward, which is probably why it feels dangerous. Piper at full volume is easy to read. Piper choosing not to fill the air means she is letting the moment stand there without makeup. Her gaze flicks to you, away, back again, quick as a reflex she has not decided whether to trust.",
        "\"Also,\" she adds, falling into step beside you if you keep moving, \"Camille was absolutely insufferable today in the way only people being correct enjoy being.\"",
        "The track smells faintly of rubber, machine oil, and cool night air leaking in every time the side access door opens. Somewhere below, weights clank once in the strength room. The whole building is full of people pretending their bodies are not speaking louder than they are.",
        "Piper glances sideways. \"You were good today,\" she says, and because it is her the sentence arrives wearing a smirk as camouflage. \"Annoyingly. I liked you better when I had more room to condescend.\"",
        "If there has been overt flirtation already, the line tilts into it naturally. If there has not, the affection is still obvious enough to be a risk. Piper does not do sterile interest well. Even her caution tends to show up in motion.",
        "She cuts across lane one and hops lightly onto the inner curb. \"You know what sucks? Watching somebody get better and realizing that at some point the thing you're excited by is also the thing that could scare the hell out of you if it goes wrong.\"",
        "That lands heavier than most of what she says on purpose. She lets it stay there for a beat, then kicks at the rubber edge of the lane. \"Anyway. That's a gross sentence. Delete it from your memory.\"",
        "The invitation not to take her seriously is an old trick by now. So is the decision whether to honor it.",
        "You pace another stretch together. The lights hum. Her shoulder almost brushes yours once and then actually does on the next curve like the difference might plausibly be an accident. It is not. The air between you has crossed too many smaller lines already to pretend that one is random.",
        "\"I keep trying to figure out what your instinct is when nobody grades it,\" she says. \"Not in the chamber. Not in front of Camille. Not under glass. Just... you.\"",
        "It is the most personal question of the night, mostly because she asks it without giving herself anywhere to hide afterward."
      ],
      "choices": [
        {
          "text": "Come closer and maybe I'll tell you the version nobody else gets.",
          "effects": [
            {
              "type": "npc",
              "key": "Piper",
              "trust": 1,
              "respect": 0,
              "attraction": 1
            },
            {
              "type": "relationship",
              "key": "Piper",
              "delta": 2
            },
            {
              "type": "flag",
              "key": "add_c04_piper_track_late_choice_1",
              "value": true
            },
            {
              "type": "stat",
              "key": "control",
              "delta": 1
            }
          ],
          "timeMinutes": 15,
          "next": "c04_hub_return_courtyard"
        },
        {
          "text": "My instinct is usually a person before it's a tactic. That's the problem.",
          "effects": [
            {
              "type": "npc",
              "key": "Piper",
              "trust": 0,
              "respect": 1
            },
            {
              "type": "relationship",
              "key": "Piper",
              "delta": 1
            },
            {
              "type": "flag",
              "key": "add_c04_piper_track_late_choice_2",
              "value": true
            },
            {
              "type": "stat",
              "key": "restraint",
              "delta": 1
            }
          ],
          "timeMinutes": 15,
          "next": "c04_hub_return_courtyard"
        },
        {
          "text": "My instinct is still changing. Maybe that's the point.",
          "effects": [
            {
              "type": "npc",
              "key": "Piper",
              "trust": 0,
              "respect": 0
            },
            {
              "type": "relationship",
              "key": "Piper",
              "delta": 1
            },
            {
              "type": "flag",
              "key": "add_c04_piper_track_late_choice_3",
              "value": true
            },
            {
              "type": "stat",
              "key": "resolve",
              "delta": 1
            }
          ],
          "timeMinutes": 15,
          "next": "c04_hub_return_courtyard"
        },
        {
          "text": "What's yours, when nobody's timing it?",
          "effects": [
            {
              "type": "npc",
              "key": "Piper",
              "trust": 0,
              "respect": 0
            },
            {
              "type": "relationship",
              "key": "Piper",
              "delta": 1
            },
            {
              "type": "flag",
              "key": "add_c04_piper_track_late_choice_4",
              "value": true
            },
            {
              "type": "stat",
              "key": "audacity",
              "delta": 1
            }
          ],
          "timeMinutes": 15,
          "next": "c04_hub_return_courtyard"
        }
      ]
    },
    "add_c05_camille_promenade_angles": {
      "chapter": 5,
      "title": "Camille Promenade Angles",
      "location": "Blackwater Promenade",
      "background": "city",
      "focus": "Camille",
      "text": [
        "Camille slows near a jewelry store window that has already gone dark for the night. The display glass gives her the whole promenade at once: crowd movement, light bleed, the river-black water beyond the rail, your outline beside hers. She is not admiring anything in the case. She is using the reflection because it lets her watch the room without teaching the room what matters.\n\"People behave differently when the risk is social instead of physical,\" she says. \"Here, everyone is trying to preserve a story about themselves at the same time they are reacting to what is in front of them. It makes mistakes look cleaner than they are.\"\nThere is a tone inside the sentence that tells you she is not just talking about strangers buying fried shrimp under string lights. She means residents. Staff. Maybe you. Definitely herself, at least a little. That has become one of the more interesting things about her: the closer she gets to honest, the more exact she becomes instead of softer.\nThe window gives you both a stranger's angle on yourselves. If Chapter Two moved something between you out of the realm of clean theory and Chapter Three made it harder to pretend nobody noticed, the residue is here now. Not loud. Not named. Just present. Camille in public feels even more controlled than Camille under observation, which is saying something. She has the kind of poise that dares rooms to become simpler than they are.\nShe tips her chin toward a family trying to wrangle a child away from the rail. \"Watch the father,\" she says. \"He keeps his hand near the boy's hood but not on it. He wants the child to feel free without actually allowing him to be unsafe. That's half this institution in one gesture. The other half is paperwork.\"\nYou laugh despite yourself. One corner of her mouth shifts in acknowledgment. A full smile from Camille still feels like a classified event, but moments like this are how you learn the weather before the report is public.\n\"Tonight matters more than Vance will phrase it,\" she says. \"Off-campus practice changes people. Once you prove to yourself that you can function beyond the managed edges, you start negotiating with every future limit. Some people become more responsible afterward. Some become impossible.\"\nShe finally turns from the glass and looks at you directly. \"You do not strike me as someone who enjoys being fenced. That can produce excellent adults or exhausting ones. I would prefer not to spend the next year discovering which kind you are by reading incident summaries.\""
      ],
      "choices": [
        {
          "text": "Tell her she could ask directly instead of reading your future through window glass.",
          "effects": [
            {
              "type": "npc",
              "key": "Camille",
              "trust": 1,
              "respect": 0,
              "attraction": 1
            },
            {
              "type": "relationship",
              "key": "Camille",
              "delta": 2
            },
            {
              "type": "flag",
              "key": "add_c05_camille_promenade_angles_choice_1",
              "value": true
            },
            {
              "type": "stat",
              "key": "control",
              "delta": 1
            }
          ],
          "timeMinutes": 15,
          "next": "c05_hub_return_prom"
        },
        {
          "text": "Ask which answer would make her more likely to trust you outside the fence.",
          "effects": [
            {
              "type": "npc",
              "key": "Camille",
              "trust": 0,
              "respect": 1
            },
            {
              "type": "relationship",
              "key": "Camille",
              "delta": 1
            },
            {
              "type": "flag",
              "key": "add_c05_camille_promenade_angles_choice_2",
              "value": true
            },
            {
              "type": "stat",
              "key": "restraint",
              "delta": 1
            }
          ],
          "timeMinutes": 15,
          "next": "c05_hub_return_prom"
        },
        {
          "text": "Say you are trying very hard not to become an exhausting adult on purpose.",
          "effects": [
            {
              "type": "npc",
              "key": "Camille",
              "trust": 0,
              "respect": 0
            },
            {
              "type": "relationship",
              "key": "Camille",
              "delta": 1
            },
            {
              "type": "flag",
              "key": "add_c05_camille_promenade_angles_choice_3",
              "value": true
            },
            {
              "type": "stat",
              "key": "resolve",
              "delta": 1
            }
          ],
          "timeMinutes": 15,
          "next": "c05_hub_return_prom"
        },
        {
          "text": "Flirt cleanly: tell her she makes surveillance sound almost intimate.",
          "effects": [
            {
              "type": "npc",
              "key": "Camille",
              "trust": 0,
              "respect": 0,
              "attraction": 1
            },
            {
              "type": "relationship",
              "key": "Camille",
              "delta": 1
            },
            {
              "type": "flag",
              "key": "add_c05_camille_promenade_angles_choice_4",
              "value": true
            },
            {
              "type": "stat",
              "key": "audacity",
              "delta": 1
            }
          ],
          "timeMinutes": 15,
          "next": "c05_hub_return_prom"
        }
      ]
    },
    "add_c05_julian_anchor_corner": {
      "chapter": 5,
      "title": "Julian Anchor Corner",
      "location": "The Rusty Anchor",
      "background": "city",
      "focus": "Julian",
      "text": [
        "Julian claims the corner booth like he was born to make weak lighting flattering and cheap lacquer look deliberate. The Rusty Anchor is busy without being crowded, full of ferry workers, off-shift staff, students pretending not to stare at Aegis residents, and exactly the kind of locals who can smell sanctioned trouble from half a room away. Music hums beneath the conversations. Glass knocks against wood. Someone near the bar is losing an argument about sports with the confidence of a man who has never once been corrected by facts in time to matter.\nJulian slides a second drink menu toward you and then ignores it completely. \"There is a particular kind of evening,\" he says, \"where everyone pretends this is social and not pre-operational. You can tell because no one has relaxed enough to become stupid.\"\n\"Give Piper eight minutes,\" you say.\nHe smiles. \"Cruel. Fair. Slightly optimistic.\"\nIt is easier now than it was on day one to fall into his rhythm. That is part of the danger with Julian. He is fun in the way sharp things can be fun: elegant, quick, unexpectedly useful, and liable to leave you cut if you mistake polish for harmlessness. If earlier chapters taught him anything about you, you can feel him using it here. He does not ask broad questions. He picks lines that test how honest you are willing to be while still sitting in public.\nHe glances past you toward the room. \"Theo is on a transit platform turning exits into a religion. Camille is somewhere outside judging architecture by whether it can be weaponized into awareness. Piper is making tonight sound like a dare in heels. And you are here with me, which means one of three things.\"\n\"Only three?\"\n\"I believe in manageable theories.\" He ticks them off on two fingers. \"One: you wanted a quiet minute before the dock. Two: you wanted somebody who can tell you what this looks like from the outside. Three: you are beginning to suspect my company is unusually good for your emotional complexion.\"\nThere is enough humor in it to keep the air light, but only enough. Underneath the line, the real offer sits there: tell me what this is, or tell me what you need, or tell me how close you intend to stand without making me guess badly. The reason Julian works as a route at all is that he understands mood as infrastructure. He knows when a room is safe for wit and when wit is how someone survives the unsafe room. He also knows when he is being used as relief instead of chosen as a person. You can feel the distinction mattering now.\nHe leans back against the booth and watches you with that bright, merciless kindness of his. \"So. Which of the three saves your reputation tonight?\""
      ],
      "choices": [
        {
          "text": "Tell him you wanted someone who sees the outside angle and says it honestly.",
          "effects": [
            {
              "type": "npc",
              "key": "Julian",
              "trust": 1,
              "respect": 0,
              "attraction": 1
            },
            {
              "type": "relationship",
              "key": "Julian",
              "delta": 2
            },
            {
              "type": "flag",
              "key": "add_c05_julian_anchor_corner_choice_1",
              "value": true
            },
            {
              "type": "stat",
              "key": "control",
              "delta": 1
            }
          ],
          "timeMinutes": 15,
          "next": "c05_hub_return_anchor"
        },
        {
          "text": "Tell him his company is excellent for your emotional complexion, unfortunately.",
          "effects": [
            {
              "type": "npc",
              "key": "Julian",
              "trust": 0,
              "respect": 1
            },
            {
              "type": "relationship",
              "key": "Julian",
              "delta": 1
            },
            {
              "type": "flag",
              "key": "add_c05_julian_anchor_corner_choice_2",
              "value": true
            },
            {
              "type": "stat",
              "key": "restraint",
              "delta": 1
            }
          ],
          "timeMinutes": 15,
          "next": "c05_hub_return_anchor"
        },
        {
          "text": "Say you wanted quiet, then admit he is not exactly quiet but somehow still helped.",
          "effects": [
            {
              "type": "npc",
              "key": "Julian",
              "trust": 0,
              "respect": 0,
              "attraction": 1
            },
            {
              "type": "relationship",
              "key": "Julian",
              "delta": 1
            },
            {
              "type": "flag",
              "key": "add_c05_julian_anchor_corner_choice_3",
              "value": true
            },
            {
              "type": "stat",
              "key": "resolve",
              "delta": 1
            }
          ],
          "timeMinutes": 15,
          "next": "c05_hub_return_anchor"
        },
        {
          "text": "Deflect with style and make him work for the answer.",
          "effects": [
            {
              "type": "npc",
              "key": "Julian",
              "trust": 0,
              "respect": 0
            },
            {
              "type": "relationship",
              "key": "Julian",
              "delta": 1
            },
            {
              "type": "flag",
              "key": "add_c05_julian_anchor_corner_choice_4",
              "value": true
            },
            {
              "type": "stat",
              "key": "audacity",
              "delta": 1
            }
          ],
          "timeMinutes": 15,
          "next": "c05_hub_return_anchor"
        }
      ]
    },
    "add_c05_theo_transit_math": {
      "chapter": 5,
      "title": "Theo Transit Math",
      "location": "Transit Platform",
      "background": "city",
      "focus": "Theo",
      "text": [
        "The transit platform turns waiting into an architectural style. White line. Metal bench. Schedule display. Wind coming off the water hard enough to make paper decisions feel unserious. Theo stands under the route map with his tablet in one hand and the expression of somebody trying not to become the villain in his own evening by being correct too early.\nHe does not look up immediately when you step beside him. \"Before you ask,\" he says, \"yes, I know this is still technically supervised. No, 'technically' is not a comforting adverb.\"\nOn the tablet, the dock layout is carved into colored lanes: likely approach, bad approach, emergency route, emergency route if human beings behave like algorithms, emergency route if human beings behave like human beings. The last one has more annotations. That tracks.\n\"You did this for an unofficial test?\" you ask.\nTheo finally looks at you. \"I did this because if something goes wrong, I would prefer the post-incident argument not include the sentence no one thought about the ferry lane.\"\nThere are people around you in civilian clothes holding takeout, checking messages, leaning into each other, living lives that do not know your file number. That is the thing Chapter Five changes fastest: it reminds everyone that the world outside Aegis is not made of blank background extras waiting to be saved or endangered on schedule. Theo feels that more acutely than most. He always has. It makes him seem tense. It also makes him right a lot.\nIf earlier chapters gave the two of you any quiet trust, it gathers here easily. Theo is one of the few people in this cohort who becomes more open when taken seriously, not less. He does not need you to tell him not to worry. He needs to know worry is not the only thing he is allowed to bring to the table.\nHe taps the service lane with the stylus. \"Best-case exit if we have to clear fast. Worst-case bottleneck if anybody panics. And yes, I hear how glamorous I sound.\"\n\"You sound prepared.\"\nThat actually lands. His shoulders drop by about half an inch. On Theo, that counts as an emotional gesture.\n\"Prepared is just fear that learned enough math,\" he says. Then, a little quieter: \"I know tonight matters to Piper in a way she is trying not to state directly. I know it matters to you in a different way. I just need both of you to remember that momentum is not the same thing as control because it feels good in your lungs.\"\nOnly Theo could say something that clinical and make it sound like concern instead of a lecture. Or maybe the truth is that you already know what his concern sounds like now, and that is its own form of intimacy."
      ],
      "choices": [
        {
          "text": "Tell him exit math is one of the reasons you wanted him here.",
          "effects": [
            {
              "type": "npc",
              "key": "Theo",
              "trust": 1,
              "respect": 0,
              "attraction": 1
            },
            {
              "type": "relationship",
              "key": "Theo",
              "delta": 2
            },
            {
              "type": "flag",
              "key": "add_c05_theo_transit_math_choice_1",
              "value": true
            },
            {
              "type": "stat",
              "key": "control",
              "delta": 1
            }
          ],
          "timeMinutes": 15,
          "next": "c05_hub_return_transit"
        },
        {
          "text": "Ask what tonight matters to Piper as, in his view, if not just a stunt.",
          "effects": [
            {
              "type": "npc",
              "key": "Theo",
              "trust": 0,
              "respect": 1,
              "attraction": 1
            },
            {
              "type": "relationship",
              "key": "Theo",
              "delta": 1
            },
            {
              "type": "flag",
              "key": "add_c05_theo_transit_math_choice_2",
              "value": true
            },
            {
              "type": "stat",
              "key": "restraint",
              "delta": 1
            }
          ],
          "timeMinutes": 15,
          "next": "c05_hub_return_transit"
        },
        {
          "text": "Tell him you know momentum and control are different. You are trying to want the right one.",
          "effects": [
            {
              "type": "npc",
              "key": "Theo",
              "trust": 0,
              "respect": 0,
              "attraction": 1
            },
            {
              "type": "relationship",
              "key": "Theo",
              "delta": 1
            },
            {
              "type": "flag",
              "key": "add_c05_theo_transit_math_choice_3",
              "value": true
            },
            {
              "type": "stat",
              "key": "resolve",
              "delta": 1
            }
          ],
          "timeMinutes": 15,
          "next": "c05_hub_return_transit"
        },
        {
          "text": "Flirt carefully: say fear that learned math is still one of the better qualities in a person.",
          "effects": [
            {
              "type": "npc",
              "key": "Theo",
              "trust": 0,
              "respect": 0,
              "attraction": 1
            },
            {
              "type": "relationship",
              "key": "Theo",
              "delta": 1
            },
            {
              "type": "flag",
              "key": "add_c05_theo_transit_math_choice_4",
              "value": true
            },
            {
              "type": "stat",
              "key": "audacity",
              "delta": 1
            }
          ],
          "timeMinutes": 15,
          "next": "c05_hub_return_transit"
        }
      ]
    },
    "add_c05_vance_platform_clearance": {
      "chapter": 5,
      "title": "Vance Platform Clearance",
      "location": "Transit Platform",
      "background": "city",
      "focus": "Vance",
      "text": [
        "Vance is not off-campus in any way that reads as casual. Even without the jacket and cleared badge clipped under his coat, he would still move like a man who considers three kinds of failure before saying hello. The platform lights flatten everyone else. They sharpen him.\nHe watches one shuttle pull away before speaking. \"Field permission is not freedom,\" he says. \"It is expanded responsibility with worse weather and more witnesses.\"\nIt is the kind of sentence that should be annoying and, unfortunately, is not wrong enough to dismiss. By now you know his style. Vance does not waste speech on affection unless it can survive being overheard as policy. That means if he gives you anything human, it will arrive disguised as operational language and expect you to do the work of translation yourself.\n\"You have been trending,\" he continues, dry as old paper. \"Not just in output. In consequence. People are beginning to build expectations around how you behave when the room gets difficult. Tonight will either support those expectations or complicate them.\"\nA civilian family passes far enough away not to hear, close enough to remind you that he chose this location on purpose. Public enough to keep the tone clean. Private enough to make the message land. Vance believes in controlled environments even when he cannot literally build the walls.\n\"If something goes wrong,\" he says, \"I care less about whether you look impressive fixing it than whether everyone around you remains legible afterward. Chaos makes people feel powerful right before paperwork makes them unemployed.\"\nThere it is again: the strange paternal frequency he uses only when he is trying not to sound paternal at all. If earlier chapters put you on his radar as promising, difficult, volatile, or worth betting on, some version of that category is sitting between you now. He is not here to stop the night. He is here to make sure you understand he will remember it honestly.\nFor one second his gaze shifts past your shoulder toward the water and back. \"And for what it is worth,\" he says, even flatter than before, \"I am aware this is the point in training where residents start confusing expanded radius with maturity. Try not to embarrass me in front of civilians who pay taxes.\""
      ],
      "choices": [
        {
          "text": "Tell him you are more interested in coming back clean than looking spectacular.",
          "effects": [
            {
              "type": "npc",
              "key": "Vance",
              "trust": 1,
              "respect": 0
            },
            {
              "type": "relationship",
              "key": "Vance",
              "delta": 2
            },
            {
              "type": "flag",
              "key": "add_c05_vance_platform_clearance_choice_1",
              "value": true
            },
            {
              "type": "stat",
              "key": "control",
              "delta": 1
            }
          ],
          "timeMinutes": 15,
          "next": "c05_hub_return_transit"
        },
        {
          "text": "Say you can probably manage not to embarrass him if he keeps his standards realistic.",
          "effects": [
            {
              "type": "npc",
              "key": "Vance",
              "trust": 0,
              "respect": 1
            },
            {
              "type": "relationship",
              "key": "Vance",
              "delta": 1
            },
            {
              "type": "flag",
              "key": "add_c05_vance_platform_clearance_choice_2",
              "value": true
            },
            {
              "type": "stat",
              "key": "restraint",
              "delta": 1
            }
          ],
          "timeMinutes": 15,
          "next": "c05_hub_return_transit"
        },
        {
          "text": "Ask whether this is his version of saying he trusts you a little more now.",
          "effects": [
            {
              "type": "npc",
              "key": "Vance",
              "trust": 0,
              "respect": 0
            },
            {
              "type": "relationship",
              "key": "Vance",
              "delta": 1
            },
            {
              "type": "flag",
              "key": "add_c05_vance_platform_clearance_choice_3",
              "value": true
            },
            {
              "type": "stat",
              "key": "resolve",
              "delta": 1
            }
          ],
          "timeMinutes": 15,
          "next": "c05_hub_return_transit"
        },
        {
          "text": "Tell him honesty about consequences is the only reason you are still listening to him.",
          "effects": [
            {
              "type": "npc",
              "key": "Vance",
              "trust": 0,
              "respect": 0
            },
            {
              "type": "relationship",
              "key": "Vance",
              "delta": 1
            },
            {
              "type": "flag",
              "key": "add_c05_vance_platform_clearance_choice_4",
              "value": true
            },
            {
              "type": "stat",
              "key": "audacity",
              "delta": 1
            }
          ],
          "timeMinutes": 15,
          "next": "c05_hub_return_transit"
        }
      ]
    },
    "add_c05_piper_dock_pressure": {
      "chapter": 5,
      "title": "Piper Dock Pressure",
      "location": "East Dock",
      "background": "city",
      "focus": "Piper",
      "text": [
        "The old east dock smells like damp wood, rope, engine oil, and the patient kind of salt that can turn any bad decision into a permanent memory if you give it enough time. Lamps throw thin gold along the boards. The water underneath is so black it makes the city lights look stolen. Piper is already out near the railing, balanced on the edge like gravity is a rumor she only accepts when she is bored.\nWhen she hears you coming, she hops down and turns with that bright, dangerous smile of hers-the one that always lands somewhere between invitation and challenge. Theo is in the boathouse with a tablet and a face that says he plans to save the evening through sheer contempt for variables. Somewhere farther back, someone from dock maintenance is pretending not to notice the exact kind of supervised nonsense that keeps their overtime budget healthy.\n\"Okay,\" Piper says. \"Important update. This is either going to be the coolest thing we have done outside official paperwork or the dumbest. Possibly both. Theo says that means the margins matter. I say the margins can file a complaint if they survive.\"\nShe says it lightly, but tonight matters to her too much for the polish to fully hold. You can feel it under the grin. Chapter Five is the first time the world outside Aegis really leans back into your life and asks whether any of this training remains true without a safety rail and a debrief room waiting afterward. For Piper, that question is personal. She has always looked most alive when motion becomes identity. What she wants from the dock is not just data. It is proof that the version of herself she trusts in open air still exists when the stakes are real.\nIf the two of you have been circling each other since Chapter One, the proximity here does not help. Or maybe it helps exactly too much. The wind keeps catching strands of her hair and throwing them against her mouth. She keeps brushing them back with impatient fingers, talking fast enough that you could mistake the speed for simple excitement if you had not already learned the shape of her nerves.\n\"Camille thinks this is half field test, half future incident report,\" Piper says. \"Julian thinks the aesthetics are incredible and the liability is even better. Theo thinks we should all wear flotation vests and apologize to geometry. Vance probably sensed the disturbance in policy from across the district.\"\nShe steps closer, the grin easing into something less performative. \"I think this is the first thing in a while that's going to tell the truth about you without a room helping.\"\nThat lands between you hard enough to quiet the water for a second.\nPiper huffs a laugh. \"Which, yes, dramatic. I contain multitudes. But I mean it. Everybody is watched inside. Inside, even courage gets translated by walls. Out here, if you go hard, it is because you chose to. If you get careful, it is because you chose to. Nobody gets to blame fluorescent lighting for who they become over open water.\"\nThe dock creaks. Theo calls something about recalibrating the route. Piper ignores him for one more breath.\n\"So tell me before we do this,\" she says. \"What are you trying to prove tonight? To them, to yourself, to me, whatever order makes you least dishonest.\""
      ],
      "choices": [
        {
          "text": "Tell her you want to prove you can be dangerous without becoming sloppy.",
          "effects": [
            {
              "type": "npc",
              "key": "Piper",
              "trust": 1,
              "respect": 0,
              "attraction": 1
            },
            {
              "type": "relationship",
              "key": "Piper",
              "delta": 2
            },
            {
              "type": "flag",
              "key": "add_c05_piper_dock_pressure_choice_1",
              "value": true
            },
            {
              "type": "stat",
              "key": "control",
              "delta": 1
            }
          ],
          "timeMinutes": 15,
          "next": "c05_hub_dock"
        },
        {
          "text": "Tell her you want to know whether the version of you she believes in survives outside the fence.",
          "effects": [
            {
              "type": "npc",
              "key": "Piper",
              "trust": 0,
              "respect": 1,
              "attraction": 1
            },
            {
              "type": "relationship",
              "key": "Piper",
              "delta": 1
            },
            {
              "type": "flag",
              "key": "add_c05_piper_dock_pressure_choice_2",
              "value": true
            },
            {
              "type": "stat",
              "key": "restraint",
              "delta": 1
            }
          ],
          "timeMinutes": 15,
          "next": "c05_hub_dock"
        },
        {
          "text": "Tell her you want one thing that belongs to instinct before Aegis files it into procedure.",
          "effects": [
            {
              "type": "npc",
              "key": "Piper",
              "trust": 0,
              "respect": 0,
              "attraction": 1
            },
            {
              "type": "relationship",
              "key": "Piper",
              "delta": 1
            },
            {
              "type": "flag",
              "key": "add_c05_piper_dock_pressure_choice_3",
              "value": true
            },
            {
              "type": "stat",
              "key": "resolve",
              "delta": 1
            }
          ],
          "timeMinutes": 15,
          "next": "c05_hub_dock"
        },
        {
          "text": "Flirt openly: tell her you are trying to prove you listen better when she gets this close.",
          "effects": [
            {
              "type": "npc",
              "key": "Piper",
              "trust": 0,
              "respect": 0,
              "attraction": 1
            },
            {
              "type": "relationship",
              "key": "Piper",
              "delta": 1
            },
            {
              "type": "flag",
              "key": "add_c05_piper_dock_pressure_choice_4",
              "value": true
            },
            {
              "type": "stat",
              "key": "audacity",
              "delta": 1
            }
          ],
          "timeMinutes": 15,
          "next": "c05_hub_dock"
        }
      ]
    },
    "add_c05_rina_service_ramp": {
      "chapter": 5,
      "title": "Rina Service Ramp",
      "location": "Service Ramp",
      "background": "aegis",
      "focus": "Rina",
      "text": [
        "The service ramp that runs behind the boathouse is all damp concrete, stacked crates, coiled hoses, and the practical side of the dock nobody photographs. Rina is there tightening the wraps on one wrist like the act personally offended her. She glances up once, registers you, and decides not to waste time pretending either of you is accidental.\n\"Before you ask, no, I'm not helping,\" she says. \"I'm observing the kind of decision that turns into cautionary legends by midterms.\"\nThere is spray in the air from the waves hitting pylons below. Somewhere on the other side of the wall, Piper laughs too loudly at something Theo clearly meant as a warning. Rina listens to the sound with the expression of somebody who has known exactly three people in her life capable of making recklessness sound persuasive and trusts none of them.\n\"You know what's funny?\" she says. \"Everyone talks about field instincts like they're noble. Half the time field instincts are just the version of your habits that had less time to put on shoes.\"\nIt is such a specifically Rina sentence that you almost smile before deciding whether that would annoy or delight her. Hard to tell. Probably both.\nShe winds the wrap once more around her wrist and checks the tension with her teeth. \"If you panic, panic clean. If you show off, at least have the self-respect to do it on purpose. And if Piper talks you into acting like consequences are a later-you problem, remember later-you still has your face.\"\nThere is a rough respect hidden under the abrasion. Rina does not like wasted potential, and by now you qualify as exactly the kind of variable she hates leaving to bad luck. She is not here to comfort you. She is here to remind you that adults can ruin themselves in extremely professional ways if nobody says the sentence first.\nShe jerks her chin toward the water. \"Anyway. Try not to make the rest of us look boring by dying with flair.\""
      ],
      "choices": [
        {
          "text": "Thank her. Dryly. The advice is ugly, but useful.",
          "effects": [
            {
              "type": "npc",
              "key": "Rina",
              "trust": 1,
              "respect": 0
            },
            {
              "type": "relationship",
              "key": "Rina",
              "delta": 2
            },
            {
              "type": "flag",
              "key": "add_c05_rina_service_ramp_choice_1",
              "value": true
            },
            {
              "type": "stat",
              "key": "control",
              "delta": 1
            }
          ],
          "timeMinutes": 15,
          "next": "c05_hub_dock"
        },
        {
          "text": "Ask whether this is how she sounds when she cares about somebody's outcome.",
          "effects": [
            {
              "type": "npc",
              "key": "Rina",
              "trust": 0,
              "respect": 1
            },
            {
              "type": "relationship",
              "key": "Rina",
              "delta": 1
            },
            {
              "type": "flag",
              "key": "add_c05_rina_service_ramp_choice_2",
              "value": true
            },
            {
              "type": "stat",
              "key": "restraint",
              "delta": 1
            }
          ],
          "timeMinutes": 15,
          "next": "c05_hub_dock"
        },
        {
          "text": "Tell her later-you is increasingly tired of cleaning up current-you's theater.",
          "effects": [
            {
              "type": "npc",
              "key": "Rina",
              "trust": 0,
              "respect": 0
            },
            {
              "type": "relationship",
              "key": "Rina",
              "delta": 1
            },
            {
              "type": "flag",
              "key": "add_c05_rina_service_ramp_choice_3",
              "value": true
            },
            {
              "type": "stat",
              "key": "resolve",
              "delta": 1
            }
          ],
          "timeMinutes": 15,
          "next": "c05_hub_dock"
        },
        {
          "text": "Ask what she would do differently if she were taking the jump.",
          "effects": [
            {
              "type": "npc",
              "key": "Rina",
              "trust": 0,
              "respect": 0
            },
            {
              "type": "relationship",
              "key": "Rina",
              "delta": 1
            },
            {
              "type": "flag",
              "key": "add_c05_rina_service_ramp_choice_4",
              "value": true
            },
            {
              "type": "stat",
              "key": "audacity",
              "delta": 1
            }
          ],
          "timeMinutes": 15,
          "next": "c05_hub_dock"
        }
      ]
    },
    "add_c05_ben_towel_honesty": {
      "chapter": 5,
      "title": "Ben Towel Honesty",
      "location": "Blackwater Infirmary",
      "background": "aegis",
      "focus": "Ben",
      "text": [
        "Ben catches you just outside the curtain line with two paper cups and a towel draped over one shoulder like he has been promoted to extremely unofficial morale staff. He offers you the towel first, not the drink, which is such a Ben move it would be funny if it were not also quietly kind.\n\"Tea,\" he says, lifting one cup a little. \"Or whatever this place thinks tea is. The nurse said you needed heat more than pride right now.\"\nHe says it gently enough that it does not sting unless you want it to. Ben has gotten better, as the weeks have gone on, at speaking into silence without crowding it. He is still the easiest person in the cohort to underestimate if you only read surfaces. People see sturdy and translate it into simple. They should know better by now.\nHe watches you use the towel once, then leans a shoulder against the wall. \"Everybody likes outside until outside starts charging interest,\" he says. \"Don't let the weird version of guilt set in.\"\n\"Weird version?\"\n\"The one where surviving something turns into permission to act like nobody else got scared.\" He shrugs. \"I'm not saying you did that. I'm saying I've watched enough residents do it after a bad block that I know the smell of it.\"\nThere is no judgment in his face, only the steady practicality of someone who has spent enough time being the person people crash into to learn what comes after impact. For a support beat, that is exactly what Ben should do here: ground the chapter back into consequence without stealing its center.\nHe offers the second cup. \"Drink before Piper steals the heat out of the room by talking faster than oxygen.\""
      ],
      "choices": [
        {
          "text": "Thank him and admit the part after the landing is sometimes the harder part.",
          "effects": [
            {
              "type": "npc",
              "key": "Ben",
              "trust": 1,
              "respect": 0
            },
            {
              "type": "relationship",
              "key": "Ben",
              "delta": 2
            },
            {
              "type": "flag",
              "key": "add_c05_ben_towel_honesty_choice_1",
              "value": true
            },
            {
              "type": "stat",
              "key": "control",
              "delta": 1
            }
          ],
          "timeMinutes": 15,
          "next": "c05_relationship"
        },
        {
          "text": "Tell him he is getting annoyingly good at saying the sentence people actually need.",
          "effects": [
            {
              "type": "npc",
              "key": "Ben",
              "trust": 0,
              "respect": 1
            },
            {
              "type": "relationship",
              "key": "Ben",
              "delta": 1
            },
            {
              "type": "flag",
              "key": "add_c05_ben_towel_honesty_choice_2",
              "value": true
            },
            {
              "type": "stat",
              "key": "restraint",
              "delta": 1
            }
          ],
          "timeMinutes": 15,
          "next": "c05_relationship"
        },
        {
          "text": "Ask whether he really thinks the others got scared, or whether he is protecting your ego.",
          "effects": [
            {
              "type": "npc",
              "key": "Ben",
              "trust": 0,
              "respect": 0
            },
            {
              "type": "relationship",
              "key": "Ben",
              "delta": 1
            },
            {
              "type": "flag",
              "key": "add_c05_ben_towel_honesty_choice_3",
              "value": true
            },
            {
              "type": "stat",
              "key": "resolve",
              "delta": 1
            }
          ],
          "timeMinutes": 15,
          "next": "c05_relationship"
        },
        {
          "text": "Deflect, but take the tea and the towel anyway.",
          "effects": [
            {
              "type": "npc",
              "key": "Ben",
              "trust": 0,
              "respect": 0
            },
            {
              "type": "relationship",
              "key": "Ben",
              "delta": 1
            },
            {
              "type": "flag",
              "key": "add_c05_ben_towel_honesty_choice_4",
              "value": true
            },
            {
              "type": "stat",
              "key": "audacity",
              "delta": 1
            }
          ],
          "timeMinutes": 15,
          "next": "c05_relationship"
        }
      ]
    },
    "add_c05_camille_dock_cleanup": {
      "chapter": 5,
      "title": "Camille Dock Cleanup",
      "location": "East Dock",
      "background": "city",
      "focus": "Camille",
      "text": [
        "By the time Camille reaches you on the dock, the worst of the immediate motion is over and the worst of the emotional aftershock has just enough room to start being honest. Theo is still arguing with the telemetry under his breath. Piper is pacing a groove into the boards she will later deny creating. Somebody from dock operations is photographing the scorch pattern or splash radius with the bleak efficiency of a person who plans to email three departments and be annoyed by all of them tomorrow.\nCamille does not hurry. That is not because she does not care. With her, speed is usually what happens after the decision, not instead of it. She stops within arm's reach, takes in your shoulders, your breath, the angle of your weight over one leg, the state of the rail behind you, and only then speaks.\n\"Can you stand without lying?\" she asks.\nIt would sound cruel from almost anyone else. From her it lands as precision. She is not asking whether you can perform dignity. She is asking whether your body is still in usable dialogue with reality.\nWhen you answer, she nods once and looks out over the water where the black surface has already gone back to pretending the night belonged to it first. \"Good,\" she says. \"Then listen while you still dislike me enough to remember it accurately.\"\nThat gets a rough breath of laughter out of you before the ache shuts it down. Camille registers both pieces of the reaction. She always does. One day you are going to stop being surprised by how much she notices. Not today, apparently.\n\"The launch was not the problem,\" she says. \"The second correction nearly was. You tried to solve uncertainty with more force before you solved it with better information. That instinct will keep making sense to you right up until it kills the wrong person. So either unlearn it now or become disciplined enough that you can justify keeping it.\"\nIt is a brutal sentence. It is also, infuriatingly, one of the cleanest gifts in the room. Camille has never been interested in making the truth feel nice enough to keep. She is interested in making it useful enough to survive. By Chapter Five, that quality has started to matter differently. Not less sharp. More intimate. The closer she gets to caring what happens to you, the less she is willing to flatter the version of you that would fail under pressure.\nThe dock light catches in the gold at the edge of her irises when she finally looks straight at you again. \"You did something real tonight,\" she says, quieter now. \"That is precisely why the weaknesses inside it matter. Do not confuse my criticism with dismissal. If I thought you were unserious, I would have delegated the speech.\"\nThere it is: the nearest thing Camille gives to reassurance before she decides you have earned anything softer. The cold air off the bay turns every second more specific. Somewhere behind her, Piper swears at Theo for saying 'avoidable trajectory error' with the wrong amount of emotional tact. Jordan, if they are still nearby, is probably filing the whole tableau for later use. Ben is making sure nobody with a concussion gets theatrical. The room around you keeps moving. Camille's attention does not.\n\"Do you want the cleaner version for the report,\" she asks, \"or the truer one for yourself?\""
      ],
      "choices": [
        {
          "text": "Ask for the truer one. If you are going to hear it, hear the part that lasts.",
          "effects": [
            {
              "type": "npc",
              "key": "Camille",
              "trust": 1,
              "respect": 0
            },
            {
              "type": "relationship",
              "key": "Camille",
              "delta": 2
            },
            {
              "type": "flag",
              "key": "add_c05_camille_dock_cleanup_choice_1",
              "value": true
            },
            {
              "type": "stat",
              "key": "control",
              "delta": 1
            }
          ],
          "timeMinutes": 15,
          "next": "c05_relationship"
        },
        {
          "text": "Tell her the report can have the clean version. You want what she actually thinks.",
          "effects": [
            {
              "type": "npc",
              "key": "Camille",
              "trust": 0,
              "respect": 1,
              "attraction": 1
            },
            {
              "type": "relationship",
              "key": "Camille",
              "delta": 1
            },
            {
              "type": "flag",
              "key": "add_c05_camille_dock_cleanup_choice_2",
              "value": true
            },
            {
              "type": "stat",
              "key": "restraint",
              "delta": 1
            }
          ],
          "timeMinutes": 15,
          "next": "c05_relationship"
        },
        {
          "text": "Say you noticed she came after the landing instead of during it. Ask why.",
          "effects": [
            {
              "type": "npc",
              "key": "Camille",
              "trust": 0,
              "respect": 0
            },
            {
              "type": "relationship",
              "key": "Camille",
              "delta": 1
            },
            {
              "type": "flag",
              "key": "add_c05_camille_dock_cleanup_choice_3",
              "value": true
            },
            {
              "type": "stat",
              "key": "resolve",
              "delta": 1
            }
          ],
          "timeMinutes": 15,
          "next": "c05_relationship"
        },
        {
          "text": "Flirt with bad judgment and steady eye contact: tell her delegated speeches sound like a threat.",
          "effects": [
            {
              "type": "npc",
              "key": "Camille",
              "trust": 0,
              "respect": 0,
              "attraction": 1
            },
            {
              "type": "relationship",
              "key": "Camille",
              "delta": 1
            },
            {
              "type": "flag",
              "key": "add_c05_camille_dock_cleanup_choice_4",
              "value": true
            },
            {
              "type": "stat",
              "key": "audacity",
              "delta": 1
            }
          ],
          "timeMinutes": 15,
          "next": "c05_relationship"
        }
      ]
    },
    "add_c05_piper_walkback_after": {
      "chapter": 5,
      "title": "Piper Walkback After",
      "location": "Blackwater Promenade",
      "background": "city",
      "focus": "Piper",
      "text": [
        "The walk back from the infirmary starts with the kind of silence that only exists after everybody has run out of permission to joke. Blackwater Promenade is thinner now than it was before the dock. The food carts are closing. The busker has gone home. Wind pushes napkins and receipt slips along the pavement like tiny surrendered flags. Out over the rail, the bay is still black and patient, carrying no visible evidence that it nearly taught you something uglier than intended.\nPiper keeps pace beside you instead of ahead of you for once. That by itself says more than half the jokes she has not made yet. Her hands are stuffed in the pockets of her jacket. Her jaw keeps setting and unsetting as if she is in an argument with the version of herself that normally turns fear into momentum before anyone can inspect it too closely.\nWhen she finally speaks, it comes out low and direct enough to make the whole evening feel briefly defenseless. \"You scared me,\" she says.\nNo grin. No shrug. No decorative chaos around the sentence. Just the truth, clean and bare and impossible to misfile. This is why Piper works when she works. Not because she is fun, though she is. Not because she is fast, though she very much is. Because every now and then the performance burns off and what is underneath is so simple it takes your balance with it.\nYou walk three more steps before answering. She lets you. That matters too. Earlier chapters taught both of you some version of each other already: that she hates being managed, that you hate being translated incorrectly, that attraction can sound like teasing until the moment it has to survive something real. Tonight is where the route stops being hypothetical. Not committed, not resolved, not solved. Just impossible to keep calling accidental.\nPiper exhales hard through her nose. \"I know, I know. Dock. Risk. We all chose it. Theo had a spreadsheet. Camille had judgment prepared in six different calibers. I even had backup jokes. That's not the point.\" She kicks lightly at the seam where one paving stone meets the next. \"The point is I looked up and for one second it wasn't training anymore. It was just you, over water, and whether I was about to learn some absolute garbage about how replaceable people are.\"\nThe vulnerability in it is almost rude. Not because it is too much. Because she says it like you are adult enough to hold it without making her regret the honesty. That is its own challenge.\nA tram light rolls past at the far end of the promenade, painting both of you in brief moving silver. Piper glances at you then away again. \"So whatever version of tonight you're going to keep,\" she says, trying for lighter and not getting all the way there, \"make room for the part where I am very annoyed that I meant any of that.\"\nShe is close enough now that if you turned your wrist a little you could brush the back of her hand. Maybe that is why neither of you does. Maybe it is exactly why one of you will. The route can move here if you want it to. Friendship can, too. The difference is no longer theoretical. It is in the angle of the air between you and whether either of you decides to pretend that is still nothing.\nPiper tilts her head, one brow up. The old spark is coming back around the edges, but it is carrying more honesty than camouflage now. \"Well? Are you going to say something useful, or am I forced to survive being emotionally sincere on a public walkway for free?\""
      ],
      "choices": [
        {
          "text": "Tell her she does not get to call that free when you are still feeling it in your ribs.",
          "effects": [
            {
              "type": "npc",
              "key": "Piper",
              "trust": 1,
              "respect": 0
            },
            {
              "type": "relationship",
              "key": "Piper",
              "delta": 2
            },
            {
              "type": "flag",
              "key": "add_c05_piper_walkback_after_choice_1",
              "value": true
            },
            {
              "type": "stat",
              "key": "control",
              "delta": 1
            }
          ],
          "timeMinutes": 15,
          "next": "c05_relationship"
        },
        {
          "text": "Tell her you were scared too, and not only of the landing.",
          "effects": [
            {
              "type": "npc",
              "key": "Piper",
              "trust": 0,
              "respect": 1
            },
            {
              "type": "relationship",
              "key": "Piper",
              "delta": 1
            },
            {
              "type": "flag",
              "key": "add_c05_piper_walkback_after_choice_2",
              "value": true
            },
            {
              "type": "stat",
              "key": "restraint",
              "delta": 1
            }
          ],
          "timeMinutes": 15,
          "next": "c05_relationship"
        },
        {
          "text": "Step into the honesty and say the part between you stopped being casual a while ago.",
          "effects": [
            {
              "type": "npc",
              "key": "Piper",
              "trust": 0,
              "respect": 0,
              "attraction": 1
            },
            {
              "type": "relationship",
              "key": "Piper",
              "delta": 1
            },
            {
              "type": "flag",
              "key": "add_c05_piper_walkback_after_choice_3",
              "value": true
            },
            {
              "type": "stat",
              "key": "resolve",
              "delta": 1
            }
          ],
          "timeMinutes": 15,
          "next": "c05_relationship"
        },
        {
          "text": "Deflect with warmth: tell her emotionally sincere Piper is dangerously effective.",
          "effects": [
            {
              "type": "npc",
              "key": "Piper",
              "trust": 0,
              "respect": 0
            },
            {
              "type": "relationship",
              "key": "Piper",
              "delta": 1
            },
            {
              "type": "flag",
              "key": "add_c05_piper_walkback_after_choice_4",
              "value": true
            },
            {
              "type": "stat",
              "key": "audacity",
              "delta": 1
            }
          ],
          "timeMinutes": 15,
          "next": "c05_relationship"
        }
      ]
    },
    "add_c06_booth_currents": {
      "chapter": 6,
      "title": "Booth Currents",
      "location": "Event Horizon Main Floor Booth",
      "background": "city",
      "focus": "Ensemble",
      "text": [
        "The first ten minutes at the table are all about where bodies go.",
        "Camille takes the seat with the cleanest view of the floor and the fewest blind corners, which would be funny if it were not also clearly correct. Julian slides in opposite her like the room belongs to whoever looks least impressed by it. Piper claims your near side before the geometry finishes settling. Theo takes the outside edge where he can see both the exit corridor and the mirrored wall behind the bar. Kaito's staff appears and disappears with the eerie competence of people who have rehearsed emergencies they intend to prevent.",
        "The cocktails arrive with names too expensive to trust.",
        "The room itself keeps moving around you. Laughter from the balcony. a low argument from a booth near the far wall. the momentary flare of a lighter on the walkway. Somewhere near the back bar, someone in a midnight suit says the word extraction like it belongs in a love song. Blackwater has managed to build a nightlife district where nothing is casual, including the casualness.",
        "Julian lifts his glass. \"To us,\" he says. \"Still technically supervised.\"",
        "\"To us,\" Piper echoes. \"Still technically pretending that helps.\"",
        "Theo does not touch his drink. \"This place is built around controlled uncertainty.\"",
        "Camille glances at him. \"That is one phrase for it.\"",
        "\"What is your phrase?\" Piper asks.",
        "Camille's mouth goes almost thoughtful. \"A room designed by people who know they are interesting targets.\"",
        "That earns a look from Julian that could almost count as admiration if he were less committed to making admiration look decorative.",
        "Your own attention keeps catching on small things. The strategic placement of mirrors. The way two different patrons make eye contact with Kaito's staff instead of snapping fingers. The fact that a couple at the neighboring booth is clearly in the middle of an argument and still not raising their voices because this is a place where volume is a confession. If you were ever going to understand the difference between Aegis power and outside power, it might be in a room like this, where nobody is pretending the hierarchy came from ethics.",
        "Piper leans in close enough that you feel it before you register it. \"You good?\" she asks, low enough to make it private despite the room.",
        "Depending on the ground between you, the question lands differently. If the two of you have been building heat, it carries that with no apology. If you have been circling honesty more than flirtation, it lands like care trying very hard not to become vulnerability in public. If the road has been rougher, the fact that she asks at all matters.",
        "Across from you, Julian is talking to a server as if they are old allies from a crime he has not committed yet. He is not flirting exactly. He is conducting social weather. The result is that the entire table gets better service and less scrutiny, and he somehow makes that look effortless.",
        "Theo finally picks up his glass, studies the liquid as if one of its molecules may be lying, and says, \"I hate being right about a room.\"",
        "\"You're usually right about rooms?\" Piper asks.",
        "\"Not usually,\" Julian says before Theo can answer. \"Only when it would be most inconvenient for the rest of us.\"",
        "Camille's gaze cuts to you. \"What about you?\"",
        "It is a simple question if spoken by anyone else. Here, in this place, with everyone watching everyone while pretending not to, it becomes larger. What does the room do to you? Does it sharpen you? Make you restless? Tempt you? Raise your guard? Remind you that being wanted and being safe are not remotely the same category?",
        "At the next table, a woman with diamond-cold earrings laughs at something a man says and never once stops scanning the balcony. Near the bar, someone with a scar through one eyebrow is clearly armed and equally clearly not the most dangerous person in his group. The booth you are in is not safer than the rest of the room. It is simply a better angle from which to see the danger arrive.",
        "Piper's knee nudges yours under the table. Not by accident.",
        "Julian sees it because Julian sees everything he would find aesthetically useful later. Theo sees it because Theo notices all tension, chemical or catastrophic. Camille sees it because if you are in a room with her she sees most things worth noticing and several things that aren't.",
        "Nobody comments.",
        "That may be the kindest thing any of them do all night."
      ],
      "choices": [
        {
          "text": "Tell Camille the room feels like a lie expensive enough to become policy.",
          "effects": [
            {
              "type": "flag",
              "key": "add_c06_booth_currents_choice_1",
              "value": true
            },
            {
              "type": "stat",
              "key": "control",
              "delta": 1
            }
          ],
          "timeMinutes": 15,
          "next": "c06_hub_event"
        },
        {
          "text": "Tell Piper you're good because she's here, then decide whether the line lands as flirtation or trust.",
          "effects": [
            {
              "type": "flag",
              "key": "add_c06_booth_currents_choice_2",
              "value": true
            },
            {
              "type": "stat",
              "key": "restraint",
              "delta": 1
            }
          ],
          "timeMinutes": 15,
          "next": "c06_hub_event"
        },
        {
          "text": "Ask Theo what a room like this is trying to make people forget.",
          "effects": [
            {
              "type": "flag",
              "key": "add_c06_booth_currents_choice_3",
              "value": true
            },
            {
              "type": "stat",
              "key": "resolve",
              "delta": 1
            }
          ],
          "timeMinutes": 15,
          "next": "c06_hub_event"
        },
        {
          "text": "Let Julian teach you how to look like you belong before the room decides you don't.",
          "effects": [
            {
              "type": "flag",
              "key": "add_c06_booth_currents_choice_4",
              "value": true
            },
            {
              "type": "stat",
              "key": "audacity",
              "delta": 1
            }
          ],
          "timeMinutes": 15,
          "next": "c06_hub_event"
        }
      ]
    },
    "add_c06_julian_balcony": {
      "chapter": 6,
      "title": "Julian Balcony",
      "location": "Event Horizon Balcony",
      "background": "city",
      "focus": "Julian",
      "text": [
        "Julian steals you for air without once admitting that is what he is doing.",
        "One minute he is at the table making a joke about Blackwater people treating vice like a graduate degree. The next he is touching your sleeve lightly and nodding toward the balcony doors as if both of you happened to think of leaving the booth at the same moment. Outside, the music turns into architecture. The harbor wind gets up under the polished edges of the night and reminds you that the city still sits on water whether it likes to admit it or not.",
        "The balcony is narrow, lined with low railings and plants too healthy to be real. Below, Blackwater keeps performing itself. Above, the sky has gone black-blue and clean, with the kind of scattered cloud cover that throws the city back at itself in reflected color.",
        "Julian leans on the railing with practiced ease and then, after a beat, lets some of the practice go.",
        "\"I like rooms like this,\" he says. \"Not because they are honest. Because they are honest about being dishonest.\"",
        "\"Comforting.\"",
        "\"It can be.\" He glances at you. \"Aegis lies about what it is for your own good. Places like this lie because they respect appetite. Very different flavor.\"",
        "He says it lightly, but the sentence has a seam in it. If you have been paying attention since earlier chapters, you already know the shape of his armor: glamour, humor, perfect timing, a sense for where to stand when a room wants to become violent in a prettier font. You also know that none of that makes him shallow. If anything it makes him expensive to misunderstand.",
        "If you gave him an easier line in earlier chapters, he uses it now, letting the conversation stay buoyant until you decide otherwise. If you have seen him more sharply-if you have met performance with real attention instead of just admiration-there is less cushion in the silence between you. He is not simpler. He is less defended.",
        "Inside, behind the glass, you can still see the table. Piper's profile in motion. Theo speaking with one hand wrapped around his glass and the other sketching anxious geometry in the air. Camille looking like she was built to sit at the center of controlled danger and insult its standards by surviving it.",
        "Julian follows your gaze. \"People always say they want to be seen,\" he says. \"What they usually want is to be read correctly by one person before the room gets there first.\"",
        "The harbor wind catches the end of his sentence and carries it half away.",
        "\"This city,\" he says, \"has a gift for making everyone decide whether they are interesting enough to survive attention.\"",
        "\"You worried you won't?\"",
        "He laughs, too soft to count as deflection. \"No. I'm worried I will, and the room will decide that tells it everything.\"",
        "The line lands harder than he intended or perhaps exactly as hard. Either way, it is yours now.",
        "If you flirt, this is a good place to do it because the balcony makes privacy out of angle and glass. If you stay honest, it is a better place for that than the table was. If you push too hard, the city gives him a thousand beautiful ways to turn the conversation and you may not get another opening like this until much later.",
        "Inside, someone cheers. Outside, a boat horn cuts across the harbor with the melancholy confidence of something built to travel in bad weather.",
        "Julian turns toward you fully then, one elbow still on the rail. \"So,\" he says. \"Do I seem at home here, or merely well-lit?\""
      ],
      "choices": [
        {
          "text": "Tell him he looks at home anywhere he can control the read, and ask what happens when he can't.",
          "effects": [
            {
              "type": "npc",
              "key": "Julian",
              "trust": 1,
              "respect": 0
            },
            {
              "type": "relationship",
              "key": "Julian",
              "delta": 2
            },
            {
              "type": "flag",
              "key": "add_c06_julian_balcony_choice_1",
              "value": true
            },
            {
              "type": "stat",
              "key": "control",
              "delta": 1
            }
          ],
          "timeMinutes": 15,
          "next": "c06_hub_event"
        },
        {
          "text": "Tell him well-lit is still a kind of beautiful, then let the line sit between you.",
          "effects": [
            {
              "type": "npc",
              "key": "Julian",
              "trust": 0,
              "respect": 1
            },
            {
              "type": "relationship",
              "key": "Julian",
              "delta": 1
            },
            {
              "type": "flag",
              "key": "add_c06_julian_balcony_choice_2",
              "value": true
            },
            {
              "type": "stat",
              "key": "restraint",
              "delta": 1
            }
          ],
          "timeMinutes": 15,
          "next": "c06_hub_event"
        },
        {
          "text": "Say he seems careful, not comfortable, and wait to see if he rewards honesty.",
          "effects": [
            {
              "type": "npc",
              "key": "Julian",
              "trust": 0,
              "respect": 0,
              "attraction": 1
            },
            {
              "type": "relationship",
              "key": "Julian",
              "delta": 1
            },
            {
              "type": "flag",
              "key": "add_c06_julian_balcony_choice_3",
              "value": true
            },
            {
              "type": "stat",
              "key": "resolve",
              "delta": 1
            }
          ],
          "timeMinutes": 15,
          "next": "c06_hub_event"
        },
        {
          "text": "Deflect with a joke good enough to make him laugh and leave the rest for later.",
          "effects": [
            {
              "type": "npc",
              "key": "Julian",
              "trust": 0,
              "respect": 0,
              "attraction": 1
            },
            {
              "type": "relationship",
              "key": "Julian",
              "delta": 1
            },
            {
              "type": "flag",
              "key": "add_c06_julian_balcony_choice_4",
              "value": true
            },
            {
              "type": "stat",
              "key": "audacity",
              "delta": 1
            }
          ],
          "timeMinutes": 15,
          "next": "c06_hub_event"
        }
      ]
    },
    "add_c06_piper_backbar": {
      "chapter": 6,
      "title": "Piper Backbar",
      "location": "Event Horizon Back Bar",
      "background": "city",
      "focus": "Piper",
      "text": [
        "The back bar is quieter than the main floor by exactly the amount needed to make poor decisions sound intimate.",
        "Piper drifts there when the table gets too watched, trailing the last of her drink in one hand and restless energy in every other part of her. The bar itself runs dark and glossy under a line of low pendants that leave everyone's eyes easier to misread. Shelves of impossible bottles rise against mirror-black stone. A server slides past with a tray balanced on two fingers and never once glances at the argument taking shape in a nearby booth. Blackwater professionalism, apparently, includes pretending not to hear desire or blackmail until one of them tips.",
        "Piper leans both elbows on the bar and looks at the mirror instead of at you first. In the reflection, you get the version of her she does not stage for the whole room: less motion, more edge. The speed is still there. It always will be. But here it feels held instead of deployed.",
        "\"You ever get the sense,\" she says, \"that half these people are one bad sentence away from setting a yacht on fire?\"",
        "\"Only half?\"",
        "\"Fair.\"",
        "If the two of you have been flirting openly, the scene begins with existing heat. Not breathless. Not sudden. Accumulated. If the route has bent more toward trust, then what lives here is not spectacle but the peculiar intensity of being chosen privately in a room built for public attention. Either way, she brought you here because she wanted less witness, not more.",
        "Piper finally looks at you directly. \"I hate places like this,\" she says, too matter-of-fact for the line to be fake.",
        "That is not what her body says. Her body says she could own the room if she decided to, that she knows exactly how she scans in black and teal and a dangerous smile, that she could turn every polished surface into an accomplice if she were in the mood. The honesty is in the contradiction. She hates what rooms like this ask people to become. She is also very good at becoming it for fifteen minutes at a time.",
        "\"You hide it well,\" you say.",
        "\"Yeah.\" She tips the glass once, watching the liquid slide. \"That's not always the flex people think it is.\"",
        "Out on the floor, a burst of laughter ripples and dies. Piper's shoulders shift. Not tension exactly. Memory of it. The kind the body keeps after too many moments where speed was the only reason fear looked optional.",
        "If Chapter Five or earlier left her shaken in ways she joked through, you can feel the residue here. If you have steadied her before, there is less performance in this conversation. If you have only ever met her at full speed, this may be the first time she lets you see the other side of the trick.",
        "\"Everybody here is doing math,\" she says. \"How dangerous, how useful, how fun, how expensive, how likely to be worth the fallout. Aegis does it with forms. Blackwater does it with cheekbones.\"",
        "\"Which version do you hate more?\"",
        "Piper smiles without softness. \"Depends who I think I can outrun.\"",
        "She says it like a joke. She does not entirely mean it as one.",
        "Her fingers tap once against the side of the glass. Then stop. That alone feels like trust.",
        "\"You look good tonight,\" she says suddenly, because if Piper is going to move the conversation closer she will often do it at an angle first. \"Annoyingly good. It's making it harder to decide whether I want you on my side of the bar or my side of a terrible decision.\"",
        "It would be easy to make the moment shallow. She would even help if you seemed to need the out. It would be easy, too, to get too serious too fast and make her feel pinned in a room where she already hates how visible everything is. The right line is somewhere between: warm enough to meet her, steady enough not to crowd her, alive enough that she does not think you are choosing safety out of fear.",
        "The bartender sets down a fresh glass of water in front of Piper without being asked. She makes a face at the competence. \"See? Nightmare. They keep anticipating my needs. What if I wanted to self-destruct artistically?\"",
        "\"You'd make it look rehearsed.\"",
        "\"Exactly. Finally someone respects my process.\"",
        "She says it and then doesn't look away."
      ],
      "choices": [
        {
          "text": "Tell her terrible decisions are less interesting than staying, and ask whether she's ever tried that on purpose.",
          "effects": [
            {
              "type": "npc",
              "key": "Piper",
              "trust": 1,
              "respect": 0,
              "attraction": 1
            },
            {
              "type": "relationship",
              "key": "Piper",
              "delta": 2
            },
            {
              "type": "flag",
              "key": "add_c06_piper_backbar_choice_1",
              "value": true
            },
            {
              "type": "stat",
              "key": "control",
              "delta": 1
            }
          ],
          "timeMinutes": 15,
          "next": "c06_hub_event"
        },
        {
          "text": "Tell her she looks like trouble with excellent timing and see whether she takes the flirt or the warning.",
          "effects": [
            {
              "type": "npc",
              "key": "Piper",
              "trust": 0,
              "respect": 1,
              "attraction": 1
            },
            {
              "type": "relationship",
              "key": "Piper",
              "delta": 1
            },
            {
              "type": "flag",
              "key": "add_c06_piper_backbar_choice_2",
              "value": true
            },
            {
              "type": "stat",
              "key": "restraint",
              "delta": 1
            }
          ],
          "timeMinutes": 15,
          "next": "c06_hub_event"
        },
        {
          "text": "Say you're on her side of the bar already if she wants you there.",
          "effects": [
            {
              "type": "npc",
              "key": "Piper",
              "trust": 0,
              "respect": 0,
              "attraction": 1
            },
            {
              "type": "relationship",
              "key": "Piper",
              "delta": 1
            },
            {
              "type": "flag",
              "key": "add_c06_piper_backbar_choice_3",
              "value": true
            },
            {
              "type": "stat",
              "key": "resolve",
              "delta": 1
            }
          ],
          "timeMinutes": 15,
          "next": "c06_hub_event"
        },
        {
          "text": "Keep it playful and ask whether the water counts as Kaito declaring war on her fun.",
          "effects": [
            {
              "type": "npc",
              "key": "Piper",
              "trust": 0,
              "respect": 0
            },
            {
              "type": "relationship",
              "key": "Piper",
              "delta": 1
            },
            {
              "type": "flag",
              "key": "add_c06_piper_backbar_choice_4",
              "value": true
            },
            {
              "type": "stat",
              "key": "audacity",
              "delta": 1
            }
          ],
          "timeMinutes": 15,
          "next": "c06_hub_event"
        }
      ]
    },
    "add_c06_camille_service_corridor": {
      "chapter": 6,
      "title": "Camille Service Corridor",
      "location": "Event Horizon Service Corridor",
      "background": "city",
      "focus": "Camille",
      "text": [
        "Camille disappears from the table in the only way she ever disappears: efficiently enough that most people do not clock the exit until she has already become absence.",
        "You find her near the service corridor where the glamorous architecture gives up and admits the building needs hinges, storage, staff access, and ugly fluorescent honesty. A pair of service doors stands half open to reveal rolling carts, stacked glassware, and a narrow back staircase that probably matters more in an emergency than every beautiful line on the main floor combined.",
        "Camille is standing with one shoulder to the wall, water in hand, expression unreadable if you have not practiced.",
        "If you have, it is not unreadable now. It is busy.",
        "\"You left the floor,\" you say.",
        "\"So did you.\"",
        "\"You found the least decorative place in the building.\"",
        "\"I found the part of the building that would still function if the decorative part caught fire.\"",
        "That almost counts as humor. Here, in the fluorescence, it counts as intimacy.",
        "The service corridor does something useful to her. The polished danger of the main room is gone. In its place is a narrower frame, concrete under the expensive coat of the venue, a hum from the refrigeration system at the far end, the smell of citrus and detergent instead of perfume and money. Camille belongs anywhere she chooses to stand, but places like this strip away enough noise that you can hear the structure of her attention.",
        "She studies you for a moment. \"You are handling tonight better than I expected.\"",
        "Depending on your road together, the sentence can land as praise, challenge, or concern in formal clothes. If you have earned respect, it carries that openly. If the route between you is more friction than ease, then what shows is that she is still here checking instead of choosing indifference. If the chemistry has already sharpened, the air in the corridor does the rest without either of you needing to name it.",
        "\"You expected me badly?\"",
        "\"I expected Blackwater to tempt you into becoming louder than your judgment.\"",
        "\"Maybe it still will.\"",
        "Camille takes a sip of water, gaze never leaving you. \"Then I prefer to know whether I am accounting for a liability or a partner.\"",
        "There are a dozen ways to answer. Teasing works with her only if it has a spine. Honesty works best when it does not beg. Flirting works if it is deliberate enough to feel like a choice, not a spill.",
        "On the far side of the service door, two staffers pass with a crate between them, speaking quietly in a language you do not catch. The moment they are gone, the corridor goes private again.",
        "\"I do not trust rooms like this,\" Camille says, as if continuing a conversation she started alone two minutes before you arrived. \"They encourage appetite without demanding accountability. People confuse polish for restraint. It gets others hurt.\"",
        "\"And yet you're here.\"",
        "Her mouth shifts. \"So are you.\"",
        "It is not a dodge. It is a challenge to be specific.",
        "Maybe that is what sits between you most cleanly: specificity. She does not want the generic version of your courage. Or your care. Or your attraction. She wants to know what, exactly, you are doing and whether you will still be doing it when the room stops flattering you for it.",
        "When she moves, it is only to set her glass on the nearest shelf. The motion takes her half a step closer. Not enough to close the distance. Enough to make the distance matter.",
        "\"If tonight goes wrong,\" she says, \"I need to know which direction you run.\"",
        "You can hear the music through the wall again, thinner here, all pulse and no melody. The service corridor waits. The building waits. Camille, who rarely asks anything without already having a reason, waits too."
      ],
      "choices": [
        {
          "text": "Tell her you run toward the pressure point, not away, and ask whether that answer helps or worries her.",
          "effects": [
            {
              "type": "npc",
              "key": "Camille",
              "trust": 1,
              "respect": 0
            },
            {
              "type": "relationship",
              "key": "Camille",
              "delta": 2
            },
            {
              "type": "flag",
              "key": "add_c06_camille_service_corridor_choice_1",
              "value": true
            },
            {
              "type": "stat",
              "key": "control",
              "delta": 1
            }
          ],
          "timeMinutes": 15,
          "next": "c06_hub_event"
        },
        {
          "text": "Say you run toward the people who matter, then let her decide whether she counts herself among them.",
          "effects": [
            {
              "type": "npc",
              "key": "Camille",
              "trust": 0,
              "respect": 1
            },
            {
              "type": "relationship",
              "key": "Camille",
              "delta": 1
            },
            {
              "type": "flag",
              "key": "add_c06_camille_service_corridor_choice_2",
              "value": true
            },
            {
              "type": "stat",
              "key": "restraint",
              "delta": 1
            }
          ],
          "timeMinutes": 15,
          "next": "c06_hub_event"
        },
        {
          "text": "Tell her you do not run unless the room stops being useful, and watch whether practicality earns anything.",
          "effects": [
            {
              "type": "npc",
              "key": "Camille",
              "trust": 0,
              "respect": 0
            },
            {
              "type": "relationship",
              "key": "Camille",
              "delta": 1
            },
            {
              "type": "flag",
              "key": "add_c06_camille_service_corridor_choice_3",
              "value": true
            },
            {
              "type": "stat",
              "key": "resolve",
              "delta": 1
            }
          ],
          "timeMinutes": 15,
          "next": "c06_hub_event"
        },
        {
          "text": "Ask her the same question back and refuse to let her keep all the precision for herself.",
          "effects": [
            {
              "type": "npc",
              "key": "Camille",
              "trust": 0,
              "respect": 0
            },
            {
              "type": "relationship",
              "key": "Camille",
              "delta": 1
            },
            {
              "type": "flag",
              "key": "add_c06_camille_service_corridor_choice_4",
              "value": true
            },
            {
              "type": "stat",
              "key": "audacity",
              "delta": 1
            }
          ],
          "timeMinutes": 15,
          "next": "c06_hub_event"
        }
      ]
    },
    "add_c06_theo_sideoffice": {
      "chapter": 6,
      "title": "Theo Sideoffice",
      "location": "Event Horizon Side Office",
      "background": "city",
      "focus": "Theo",
      "text": [
        "Theo finds the side office because of course he does.",
        "It is not really an office so much as a tucked-away room behind the upper corridor with a desk, two dead monitors, a rolling chair, and a frosted panel looking down into the lower lounge. Probably staff overflow. Possibly emergency admin space. At the moment it is functioning as a place for one anxious probability nudge to breathe without being looked at by forty impeccably dressed opportunists.",
        "When you step in, Theo glances up like he expected the interruption and still has to decide whether he is relieved by it.",
        "\"This is not hiding,\" he says.",
        "\"It looks extremely like hiding.\"",
        "\"It is tactical recalibration.\"",
        "\"Right. Cowardice in a nicer shirt.\"",
        "That gets the ghost of a smile, which in Theo terms is practically fireworks.",
        "The room is dim except for the spill from the frosted panel and the low blue standby light on one of the monitors. Through the blurred glass, the motion of the main floor reduces to silhouettes: bodies bending toward each other, waitstaff crossing, someone laughing hard enough to throw their head back. It makes the whole room feel distant and immediate at once.",
        "Theo sets his drink on the desk untouched. \"I do not like rooms where everyone is performing motive and pretending that counts as disclosure.\"",
        "\"That's most rooms.\"",
        "\"Yes,\" he says, with all the tired gratitude of a man who hates being proved right by architecture. \"Which is part of the problem.\"",
        "If the two of you have already built something quieter together through earlier chapters, it pays off here. Theo is not easier, exactly, but he is more willing to let you see the machinery. If there has been attraction, the side office makes it more dangerous by making it gentle. If there has only been trust, then the scene still matters because Theo letting you into the recalibration space is not a casual choice.",
        "He rubs his thumb over the edge of the glass once. \"I keep trying to figure out whether tonight is the kind of thing people survive by relaxing into or by noticing too much.\"",
        "\"Those are annoyingly different skill sets.\"",
        "\"Theo specialty. Being bad at the useful version.\"",
        "You lean against the desk or stay standing or take the second chair-whatever you do, the room reacts by becoming more intimate than it has any right to be.",
        "\"That's not true,\" you say.",
        "He looks at you, cautious. \"Which part?\"",
        "\"The being bad at useful.\"",
        "Theo exhales, almost a laugh. \"You would be surprised how often anxiety gets mistaken for wisdom until the room needs someone charismatic.\"",
        "\"If it helps, I have watched charismatic people make terrible calls for five chapters.\"",
        "\"That does help, actually.\"",
        "The line settles between you. He studies it like he is checking whether he is allowed to keep it.",
        "If he trusted you earlier, this is where that trust deepens. If he did not, this is where the scene can still move because you came looking instead of waiting for him to make himself easier to approach. Theo notices effort. He also notices whether it is sincere.",
        "Through the frosted panel, movement ripples across the lower floor. Somebody important just arrived or somebody stupid just stood up. Theo's eyes flick there and back.",
        "\"I know what this place does,\" he says. \"It makes everyone choose a version of themselves they can defend in public. I am not great at choosing mine quickly.\"",
        "\"You don't have to be quick in here.\"",
        "He goes very still after that.",
        "It is a small sentence. It lands like a hand offered slowly enough not to spook anything.",
        "Theo's voice is quieter when he answers. \"That is not usually true.\"",
        "You could flirt now and it would work if you kept it careful. You could stay steady and the route would deepen another way. You could push too hard and watch him retreat behind politeness and analysis before you got the full answer to anything.",
        "Outside the door, heels pass and fade. The room remains a pocket in the evening where nothing glamorous can save either of you from honesty.",
        "Theo lifts his glass finally, takes one cautious sip, and grimaces. \"This tastes like expensive regret.\"",
        "\"Blackwater specialty.\"",
        "\"That and plausible deniability.\"",
        "He says it dryly. He still does not move away."
      ],
      "choices": [
        {
          "text": "Tell him you came because he matters more than performing comfort for the room.",
          "effects": [
            {
              "type": "npc",
              "key": "Theo",
              "trust": 1,
              "respect": 0,
              "attraction": 1
            },
            {
              "type": "relationship",
              "key": "Theo",
              "delta": 2
            },
            {
              "type": "flag",
              "key": "add_c06_theo_sideoffice_choice_1",
              "value": true
            },
            {
              "type": "stat",
              "key": "control",
              "delta": 1
            }
          ],
          "timeMinutes": 15,
          "next": "c06_hub_event"
        },
        {
          "text": "Ask what version of himself he is tired of defending and listen instead of rescuing him from the answer.",
          "effects": [
            {
              "type": "npc",
              "key": "Theo",
              "trust": 0,
              "respect": 1
            },
            {
              "type": "relationship",
              "key": "Theo",
              "delta": 1
            },
            {
              "type": "flag",
              "key": "add_c06_theo_sideoffice_choice_2",
              "value": true
            },
            {
              "type": "stat",
              "key": "restraint",
              "delta": 1
            }
          ],
          "timeMinutes": 15,
          "next": "c06_hub_event"
        },
        {
          "text": "Tell him expensive regret suits the evening and see whether he meets you halfway into flirtation.",
          "effects": [
            {
              "type": "npc",
              "key": "Theo",
              "trust": 0,
              "respect": 0,
              "attraction": 1
            },
            {
              "type": "relationship",
              "key": "Theo",
              "delta": 1
            },
            {
              "type": "flag",
              "key": "add_c06_theo_sideoffice_choice_3",
              "value": true
            },
            {
              "type": "stat",
              "key": "resolve",
              "delta": 1
            }
          ],
          "timeMinutes": 15,
          "next": "c06_hub_event"
        },
        {
          "text": "Keep it light, offer him an exit strategy for later, and make the promise without making it pressure.",
          "effects": [
            {
              "type": "npc",
              "key": "Theo",
              "trust": 0,
              "respect": 0
            },
            {
              "type": "relationship",
              "key": "Theo",
              "delta": 1
            },
            {
              "type": "flag",
              "key": "add_c06_theo_sideoffice_choice_4",
              "value": true
            },
            {
              "type": "stat",
              "key": "audacity",
              "delta": 1
            }
          ],
          "timeMinutes": 15,
          "next": "c06_hub_event"
        }
      ]
    },
    "add_c06_rhea_floor_freeze": {
      "chapter": 6,
      "title": "Rhea Floor Freeze",
      "location": "Event Horizon Main Floor",
      "background": "city",
      "focus": "Ensemble",
      "text": [
        "The shift in the room happens before you know why.",
        "Not loud. Not cinematic. One server changes direction without making it look like avoidance. A conversation at the far booth drops half a register. A man by the bar who has been radiating money and boredom all night suddenly remembers he has shoulders. Neutral houses do not panic in public. They simply begin making room for consequences.",
        "Then the door opens, and the reason walks in.",
        "Rhea Kane moves like the room owes her clarity and is about to pay it.",
        "Dark tactical cut to the clothes without the costume logic of someone trying to impress strangers. Hair pinned back with the kind of discipline that suggests she hates loose variables. The stillness around her is the first alarming thing, because stillness in people like that usually means every useful movement has already been priced. She takes one look across the main floor and the place seems to lose a degree of temperature.",
        "Piper stops smiling so fast it feels like whiplash.",
        "Julian's expression does not fall apart. It refines. Theo's hand tightens around his glass. Camille does not move at all, which in her case means she has already moved three steps ahead internally and is deciding which version the rest of you are allowed to see.",
        "Kaito does not rush to intercept. That is how you know the situation has skipped past simple. His staff redistributes almost invisibly, one near the lower stair, one near the side corridor, one by the balcony doors. Neutrality, apparently, has posture.",
        "Rhea's gaze touches the room in slices: balcony, bar mirror, exits, your table, the people around it, back to your table as if the first pass was courtesy and the second is where the work starts. When she smiles, it does nothing at all to ease the pressure.",
        "\"Julian,\" she says first, as if naming him acknowledges his hospitality and not his vulnerability. \"Your taste continues to exceed your judgment.\"",
        "Julian tips his head. \"Rhea. You look very much like trouble wearing good tailoring.\"",
        "\"I hate to disappoint you. This is practical.\"",
        "Piper's knee goes rigid against yours under the table. If you have been close to her lately, you feel the change before you fully parse it. Theo's eyes flick once toward the side office corridor as if recalculating every route at once. Camille's voice, when it comes, is level enough to cut.",
        "\"You know the rules,\" she says.",
        "Rhea glances at her. Something like recognition, respect, or merely interest passes there and vanishes. \"I know every room's rules,\" she says. \"The useful question is whether anyone intends to keep them.\"",
        "That is the point where the entire table becomes hyperreal. The shape of your own breathing. The condensation on the glass in Julian's hand. The song still playing over the speakers because the world is rude enough to continue providing soundtrack during the wrong kind of moment.",
        "A patron near the back pretends very hard not to be listening. Another one fails less elegantly. Nobody in the room is neutral emotionally anymore. They are merely obeying architecture.",
        "Rhea's attention lands on you then, fully. It is not appraisal in the ordinary sense. It feels more like she is comparing the story people tell about you to the actual object under the lighting. If prior chapters made your reputation larger, you can feel her checking whether the rumors oversold or undersold the danger. If your path has been more controlled, you can feel the different curiosity: whether restraint is conviction or leash.",
        "\"For a supervised group,\" she says, \"you've become inconveniently interesting.\"",
        "Piper makes a small sound that is almost a laugh and almost a warning.",
        "Camille's fingers rest on the table, still. Theo has not blinked in several seconds. Julian's posture remains lovely in a way that now reads as strategic rather than aesthetic. Kaito is watching from the bar with the expression of a man calculating how expensive a problem is allowed to become before the room starts sending invoices.",
        "Nobody here wants the first public escalation. That means the first move is social, and therefore vicious."
      ],
      "choices": [
        {
          "text": "Meet Rhea's look and ask whether interesting is the word people use when they don't want to say threatened.",
          "effects": [
            {
              "type": "flag",
              "key": "add_c06_rhea_floor_freeze_choice_1",
              "value": true
            },
            {
              "type": "stat",
              "key": "control",
              "delta": 1
            }
          ],
          "timeMinutes": 15,
          "next": "c06_after_rhea"
        },
        {
          "text": "Let Camille take the front line while you read who in the room is preparing for fallout.",
          "effects": [
            {
              "type": "flag",
              "key": "add_c06_rhea_floor_freeze_choice_2",
              "value": true
            },
            {
              "type": "stat",
              "key": "restraint",
              "delta": 1
            }
          ],
          "timeMinutes": 15,
          "next": "c06_after_rhea"
        },
        {
          "text": "Check Piper first with one low question and make the care unmistakable.",
          "effects": [
            {
              "type": "flag",
              "key": "add_c06_rhea_floor_freeze_choice_3",
              "value": true
            },
            {
              "type": "stat",
              "key": "resolve",
              "delta": 1
            }
          ],
          "timeMinutes": 15,
          "next": "c06_after_rhea"
        },
        {
          "text": "Tell Julian, without looking away from Rhea, that you are trusting his room read until the room stops deserving it.",
          "effects": [
            {
              "type": "flag",
              "key": "add_c06_rhea_floor_freeze_choice_4",
              "value": true
            },
            {
              "type": "stat",
              "key": "audacity",
              "delta": 1
            }
          ],
          "timeMinutes": 15,
          "next": "c06_after_rhea"
        }
      ]
    },
    "add_c07_records_annex_julian": {
      "chapter": 7,
      "title": "Records Annex Julian",
      "location": "Records Annex",
      "background": "aegis",
      "focus": "Julian",
      "text": [
        "The records annex is colder than the rest of Aegis Point by design.",
        "Not temperature. Intention.",
        "Everything here feels built to discourage dramatic revelation. Frosted glass. carpet that eats footsteps. rows of compact shelving with labels that sound innocuous until you realize each one is a drawer full of controlled disasters. Julian moves through the room like he has been underestimating it for years on purpose. He closes the door behind you with more care than secrecy, which is somehow worse.",
        "\"Before we begin,\" he says, already halfway to one of the wall terminals, \"I would like to state for the record that if this turns out to be nothing, I am going to become unbearable about having been efficient and attractive under fluorescent light.\"",
        "He glances over his shoulder to see whether the line lands. If you have already been meeting him where he lives, the look carries old ease under the polish. If you have been warmer with other people and only recently started leaning his way, the look has edge hidden under silk.",
        "He taps a key, waits, taps again with the patient loathing of a man personally insulted by lag. \"Aegis stores everything twice,\" he says. \"Once where people can find it if they have permission, and once where it can survive someone powerful deciding they prefer amnesia.\"",
        "\"Comforting,\" you say.",
        "\"Not remotely. But useful. Which is how most institutions justify themselves.\"",
        "The terminal blooms into folders. incident metadata. access logs. redacted interdepartmental notes. a stack of camera pulls from Event Horizon and the shuttle lane leading out of Blackwater. Julian skims them with unnerving speed, not because he is reckless but because he understands where information is trying not to be. Every so often he pauses and expands a panel you would have ignored.",
        "\"There.\" He points, not touching the glass. \"Two requests routed through a contractor credential that should have expired six weeks ago. One goes nowhere. One opens an observation packet tied to your baseline variance profile. That is either a miserable coincidence or the universe finally decided subtlety was cowardice.\"",
        "He says it lightly. The room does not let it stay light.",
        "You move closer. The screen throws pale bars across both of you. In the reflection, the angle of his shoulders looks controlled enough to fool anyone who has not learned what tension looks like when it chooses fashion as camouflage.",
        "\"You could have brought this to Vance already,\" you say.",
        "\"I could have done many admirable things,\" Julian says. \"I elected to confirm I wasn't hallucinating first. Heroism loves witnesses. Accuracy usually prefers a smaller audience.\"",
        "He opens another panel. This one is uglier. Training observation notations. cross-reference requests. one flagged phrase repeated often enough to become insulting: scalable event potential.",
        "Julian's expression changes at that. Barely. The difference is in the mouth. A line instead of a smile.",
        "\"There are words institutions use when they're afraid of a person and still want to sound reasonable about it,\" he says. \"Potential. volatility. asset. concern. They become very fond of nouns when they don't want to admit they mean someone with a pulse.\"",
        "If your route with him has been flirt-forward, this is the part where the air changes. Not because he suddenly turns intimate. Because he stops performing distance. If your route has been friend-leaning, the same moment lands as trust instead of charge.",
        "\"What do you need from me?\" he asks, and for once it is not phrased to entertain either of you.",
        "You tell him. Or you don't. But the room listens to the choice.",
        "\"I need honesty, even if it hurts.\" you say.",
        "Julian huffs one laugh. \"Dangerous thing to ask stylish people before lunch.\"",
        "He turns the screen just enough that it becomes yours too. \"Fine. Honest version. I think they are scared of what happens if you become exceptional in a direction they did not authorize. I think Vance is trying not to let that fear become policy. I think Camille knows exactly how close those two things already are. I think Piper wants to punch the entire concept of risk management in the throat. Theo would prefer all of us survive our principles. And I think you are now at the exact point where being charming about what's happening to you becomes a luxury.\"",
        "The annex hums softly around you. Somewhere two aisles over, a printer coughs like it regrets the future.",
        "Julian folds his arms. \"Now your turn. Honest version. Are you frightened of becoming what they think you are, or frightened they're right?\""
      ],
      "choices": [
        {
          "text": "I'm frightened of becoming useful enough that nobody asks what it costs.",
          "effects": [
            {
              "type": "npc",
              "key": "Julian",
              "trust": 1,
              "respect": 0
            },
            {
              "type": "relationship",
              "key": "Julian",
              "delta": 2
            },
            {
              "type": "flag",
              "key": "add_c07_records_annex_julian_choice_1",
              "value": true
            },
            {
              "type": "stat",
              "key": "control",
              "delta": 1
            }
          ],
          "timeMinutes": 15,
          "next": "c07_hub_return_records"
        },
        {
          "text": "I'm frightened of what happens if I stop caring whether they're right.",
          "effects": [
            {
              "type": "npc",
              "key": "Julian",
              "trust": 0,
              "respect": 1
            },
            {
              "type": "relationship",
              "key": "Julian",
              "delta": 1
            },
            {
              "type": "flag",
              "key": "add_c07_records_annex_julian_choice_2",
              "value": true
            },
            {
              "type": "stat",
              "key": "restraint",
              "delta": 1
            }
          ],
          "timeMinutes": 15,
          "next": "c07_hub_return_records"
        },
        {
          "text": "I'm not giving fear the deciding vote.",
          "effects": [
            {
              "type": "npc",
              "key": "Julian",
              "trust": 0,
              "respect": 0
            },
            {
              "type": "relationship",
              "key": "Julian",
              "delta": 1
            },
            {
              "type": "flag",
              "key": "add_c07_records_annex_julian_choice_3",
              "value": true
            },
            {
              "type": "stat",
              "key": "resolve",
              "delta": 1
            }
          ],
          "timeMinutes": 15,
          "next": "c07_hub_return_records"
        },
        {
          "text": "I need the files first. Feelings after.",
          "effects": [
            {
              "type": "npc",
              "key": "Julian",
              "trust": 0,
              "respect": 0
            },
            {
              "type": "relationship",
              "key": "Julian",
              "delta": 1
            },
            {
              "type": "flag",
              "key": "add_c07_records_annex_julian_choice_4",
              "value": true
            },
            {
              "type": "stat",
              "key": "audacity",
              "delta": 1
            }
          ],
          "timeMinutes": 15,
          "next": "c07_hub_return_records"
        }
      ]
    },
    "add_c07_medical_piper": {
      "chapter": 7,
      "title": "Medical Piper",
      "location": "Medical Recovery Bay",
      "background": "aegis",
      "focus": "Piper",
      "text": [
        "Medical recovery at Aegis is the one place people stop pretending speed solves everything.",
        "The bay lights are dimmed to the sort of fake gentleness large institutions use when they want the body to comply. Curtains slide instead of swish. Monitors speak in discreet green. The air smells like saline, alcohol wipes, and the expensive hand lotion the night nurse keeps hidden in a locked drawer because trainees steal comfort when it comes unsupervised.",
        "Piper is sitting sideways in the visitor chair by your bed like she has never once in her life accepted that chairs have intended directions. One boot is unlaced. Her elbow is on the mattress, not quite touching you. She has already stolen a packet of hospital crackers, crushed it absentmindedly, and left the dust on the little plastic table as evidence of emotional weather.",
        "\"You look terrible,\" she says the second your eyes open.",
        "\"Strong opener.\"",
        "\"It is. I practiced.\"",
        "The joke lands thinly, then lives. That is about as close to an apology as Piper gives when fear is still warm.",
        "If Chapter 1 and 2 gave the two of you an obvious spark, it surfaces here without needing to announce itself. She is closer than a casual friend would sit and angrier than one would dare. If the route is more platonic so far, the same energy reads as protective and irritable instead of charged. Either way, she is here first, and that matters.",
        "\"They kept saying 'observation' like I wasn't supposed to hear the panic in it,\" she mutters. \"Observation. Monitoring. temporary hold. everybody suddenly in love with nouns.\" She kicks lightly at the leg of the chair. \"I hate when adults get scared and start sounding professional about it.\"",
        "You glance at the monitors. She follows your eyes and leans back just enough to mock them. \"Yeah, congratulations. You're still bioluminescent enough to worry three departments and hot enough to power a neighborhood in a storm. Theo says that's not medically accurate. Camille says Theo should stop making it sound whimsical. Julian says if you survive this, he is buying you better shirts because near-death has not improved your taste.\"",
        "That gets you smiling despite yourself. Piper relaxes one degree and notices. Of course she notices.",
        "\"There,\" she says softly. \"That. Keep doing that. The part where you look like you are still in there.\"",
        "The room narrows around the sentence. Not because it is poetic. Because it is blunt enough to count.",
        "She rubs the heel of her hand over one eye and then looks annoyed that her body did something vulnerable without checking with her first. \"Look, I know everybody's doing their own version of concern right now. Camille gets sharper. Theo gets quieter and starts making the future sound like a hostage note. Julian gets nicer in ways that should probably be illegal. I get mean because if I don't get mean I might say the thing I am actually thinking, and then everyone wins and nobody needs that.\"",
        "\"What thing?\"",
        "Piper laughs once, no joy in it. \"No, see, that's exactly the kind of trap question people use when they want me to hand them my organs in alphabetical order.\"",
        "But she doesn't leave. She does the opposite. Her fingers hook briefly in the blanket near your wrist, then release like she hates being seen doing instinctive things.",
        "\"I don't like it when I can't get to you fast enough,\" she says, quieter. \"I especially don't like it when a room full of adults decides that makes me emotionally compromised instead of observant.\"",
        "A monitor chirps. Somewhere beyond the curtain, a medic says somebody's name with the patient tone of a saint being paid badly.",
        "Piper's mouth twists. \"If you tell me to calm down, I will commit theatrical crimes in this building.\""
      ],
      "choices": [
        {
          "text": "Then don't calm down. Stay.",
          "effects": [
            {
              "type": "npc",
              "key": "Piper",
              "trust": 1,
              "respect": 0,
              "attraction": 1
            },
            {
              "type": "relationship",
              "key": "Piper",
              "delta": 2
            },
            {
              "type": "flag",
              "key": "add_c07_medical_piper_choice_1",
              "value": true
            },
            {
              "type": "stat",
              "key": "control",
              "delta": 1
            }
          ],
          "timeMinutes": 15,
          "next": "c07_hub_return_medical"
        },
        {
          "text": "You noticed first. That matters to me.",
          "effects": [
            {
              "type": "npc",
              "key": "Piper",
              "trust": 0,
              "respect": 1,
              "attraction": 1
            },
            {
              "type": "relationship",
              "key": "Piper",
              "delta": 1
            },
            {
              "type": "flag",
              "key": "add_c07_medical_piper_choice_2",
              "value": true
            },
            {
              "type": "stat",
              "key": "restraint",
              "delta": 1
            }
          ],
          "timeMinutes": 15,
          "next": "c07_hub_return_medical"
        },
        {
          "text": "I need you fast, not furious.",
          "effects": [
            {
              "type": "npc",
              "key": "Piper",
              "trust": 0,
              "respect": 0
            },
            {
              "type": "relationship",
              "key": "Piper",
              "delta": 1
            },
            {
              "type": "flag",
              "key": "add_c07_medical_piper_choice_3",
              "value": true
            },
            {
              "type": "stat",
              "key": "resolve",
              "delta": 1
            }
          ],
          "timeMinutes": 15,
          "next": "c07_hub_return_medical"
        },
        {
          "text": "If this makes you want to run, run. Just come back.",
          "effects": [
            {
              "type": "npc",
              "key": "Piper",
              "trust": 0,
              "respect": 0,
              "attraction": 1
            },
            {
              "type": "relationship",
              "key": "Piper",
              "delta": 1
            },
            {
              "type": "flag",
              "key": "add_c07_medical_piper_choice_4",
              "value": true
            },
            {
              "type": "stat",
              "key": "audacity",
              "delta": 1
            }
          ],
          "timeMinutes": 15,
          "next": "c07_hub_return_medical"
        }
      ]
    },
    "add_c07_camille_lock_protocol_expanded": {
      "chapter": 7,
      "title": "Camille Lock Protocol Expanded",
      "location": "Administrative Corridor",
      "background": "aegis",
      "focus": "Camille",
      "text": [
        "Camille catches you outside the strategy room before anyone can call it a summons.",
        "The administrative corridor is quieter than the rest of the floor in a way that feels engineered. Sound goes soft here. Shoes stop mattering. Even the lights seem to understand that this is where Aegis keeps the conversations it wants to pretend are orderly. Through the glass behind Camille, you can see a board already filling with names, routes, and the kind of arrows people draw when they are trying to convince themselves a bad idea has enough geometry to become acceptable.",
        "She has a tablet under one arm and a slim black case in her hand. The case is familiar if you've been paying attention in training: lock cuffs, compact anchors, the equipment version of saying you would prefer a clean answer to a dramatic one.",
        "\"Before we go in,\" she says, \"we need to settle something that the room is too crowded to discuss honestly.\"",
        "She hands you the case. Not as a threat. As trust with sharp edges.",
        "\"If containment goes bad,\" she says, \"they will ask me to make a decision about you before they ask you to make one about yourself. I would like very much not to discover in front of an audience whether you understand that.\"",
        "Straight to the bone, as usual.",
        "\"You think they'll try to lock me down.\"",
        "\"I think they are frightened enough to call it stabilization and sleep better afterward.\" Her voice remains level. \"And I think Vance will fight for room if he believes you are still reachable in the ways that matter.\"",
        "The corridor gives you a clean look at her in hard light: no softness wasted, no motion decorative. But if your route with her has been growing, what stands out now is not the severity. It's the fact that she came to you before the meeting, alone, with the truth instead of the diluted version. In Camille language, that is practically a hand at your throat and cheek at once.",
        "She taps the case once. \"Open it.\"",
        "Inside: restraint anchors. two slim emitters. a keyed override. enough force-management hardware to hold someone dangerous for seconds that would feel like years.",
        "\"These are not for you,\" she says. \"Unless you make them for you.\"",
        "You look up. She doesn't blink.",
        "\"I need to know which of my judgments I can trust today. The tactical one that says you can hold. Or the human one that says if you slip, you'll hear us before you disappear into whatever this power wants when it stops asking permission.\"",
        "That is the closest she has come all chapter to saying she is afraid. She would probably deny it under oath and with excellent diction. It still counts.",
        "If you have been flirting in a way she recognizes as deliberate rather than messy, the air around the scene is charged without becoming soft. If your route is more trust-driven, the same exchange reads as brutal intimacy of another kind.",
        "\"Camille,\" you say.",
        "\"No,\" she says. \"Precise answers.\""
      ],
      "choices": [
        {
          "text": "If I go wrong, you pull me back. I won't mistake that for betrayal.",
          "effects": [
            {
              "type": "npc",
              "key": "Camille",
              "trust": 1,
              "respect": 0
            },
            {
              "type": "relationship",
              "key": "Camille",
              "delta": 2
            },
            {
              "type": "flag",
              "key": "add_c07_camille_lock_protocol_expanded_choice_1",
              "value": true
            },
            {
              "type": "stat",
              "key": "control",
              "delta": 1
            }
          ],
          "timeMinutes": 15,
          "next": "c07_before_bait"
        },
        {
          "text": "If I go wrong, I need warning before restraint.",
          "effects": [
            {
              "type": "npc",
              "key": "Camille",
              "trust": 0,
              "respect": 1
            },
            {
              "type": "relationship",
              "key": "Camille",
              "delta": 1
            },
            {
              "type": "flag",
              "key": "add_c07_camille_lock_protocol_expanded_choice_2",
              "value": true
            },
            {
              "type": "stat",
              "key": "restraint",
              "delta": 1
            }
          ],
          "timeMinutes": 15,
          "next": "c07_before_bait"
        },
        {
          "text": "If I go wrong, don't hesitate. Use the anchors.",
          "effects": [
            {
              "type": "npc",
              "key": "Camille",
              "trust": 0,
              "respect": 0
            },
            {
              "type": "relationship",
              "key": "Camille",
              "delta": 1
            },
            {
              "type": "flag",
              "key": "add_c07_camille_lock_protocol_expanded_choice_3",
              "value": true
            },
            {
              "type": "stat",
              "key": "resolve",
              "delta": 1
            }
          ],
          "timeMinutes": 15,
          "next": "c07_before_bait"
        },
        {
          "text": "If they try to lock me down for being scared, I expect you to stop them.",
          "effects": [
            {
              "type": "npc",
              "key": "Camille",
              "trust": 0,
              "respect": 0
            },
            {
              "type": "relationship",
              "key": "Camille",
              "delta": 1
            },
            {
              "type": "flag",
              "key": "add_c07_camille_lock_protocol_expanded_choice_4",
              "value": true
            },
            {
              "type": "stat",
              "key": "audacity",
              "delta": 1
            }
          ],
          "timeMinutes": 15,
          "next": "c07_before_bait"
        }
      ]
    },
    "add_c07_vance_review_expanded": {
      "chapter": 7,
      "title": "Vance Review Expanded",
      "location": "Glass Review Office",
      "background": "aegis",
      "focus": "Vance",
      "text": [
        "Vance's office has the irritating clarity of a place inhabited by a man who believes loose paper is a moral failure.",
        "The blinds are half-open. The glass wall gives him a view of the training floor and everyone on the training floor a silhouette of him refusing to sit until there is a reason. A printed packet rests on the desk beside a tablet and two pens aligned with military hostility. One chair faces him. The other is angled slightly toward the window, which is the closest he comes to admitting conversations might need options.",
        "He waits until the door closes before speaking. \"This meeting is unofficial,\" he says.",
        "\"Comforting.\"",
        "\"It shouldn't be.\" He gestures to the chair. \"Sit down.\"",
        "If Chapters 1 through 6 made you look compliant, volatile, useful, difficult, principled, or all of the above, Vance carries it in the way he studies you now. Not with surprise. With the accumulated weight of professional pattern recognition trying not to turn into cynicism.",
        "\"I am about to authorize a plan I dislike,\" he says. \"That does not mean I believe it is avoidable. It means the alternative risk profile is worse and less containable. I want that sentence understood before this becomes one more theatrical dispute about whether procedure has feelings.\"",
        "He slides the packet across the desk. The top page is clean enough to be insulting: targeted hostile response matrix. below it, not clean at all, your name threaded through enough boxes to make the body remember what a file can do to a person.",
        "\"The board is split,\" Vance says. \"Not on whether you were targeted. On what that means. One camp believes external attention confirms your strategic value. The other believes it confirms you're a liability multiplier. Both camps are made of cowards in different suits.\"",
        "That earns the smallest flicker of life from him, which is what passes for generosity here.",
        "\"And you?\" you ask.",
        "\"I think fear makes institutions stupid unless someone in the room has the discipline to embarrass it.\" He folds his hands behind his back. \"I also think you are approaching the point where raw power will not be your defining problem. Interpretation will.\"",
        "The word lands because it is not abstract. It means narrative. classification. who gets to say what your actions meant after the room stops shaking.",
        "Vance nods toward the packet. \"If we run this operation, I need to know what you will privilege when it gets ugly. Team cohesion. civilian protection. personal control. mission success. Don't give me hero slogans. Give me the order.\"",
        "It is not a trap. Which makes it worse. He wants the truth because he intends to use it."
      ],
      "choices": [
        {
          "text": "Civilian protection, team cohesion, mission success, personal control.",
          "effects": [
            {
              "type": "npc",
              "key": "Vance",
              "trust": 1,
              "respect": 0
            },
            {
              "type": "relationship",
              "key": "Vance",
              "delta": 2
            },
            {
              "type": "flag",
              "key": "add_c07_vance_review_expanded_choice_1",
              "value": true
            },
            {
              "type": "stat",
              "key": "control",
              "delta": 1
            }
          ],
          "timeMinutes": 15,
          "next": "c07_before_bait"
        },
        {
          "text": "Team cohesion, personal control, civilian protection, mission success.",
          "effects": [
            {
              "type": "npc",
              "key": "Vance",
              "trust": 0,
              "respect": 1
            },
            {
              "type": "relationship",
              "key": "Vance",
              "delta": 1
            },
            {
              "type": "flag",
              "key": "add_c07_vance_review_expanded_choice_2",
              "value": true
            },
            {
              "type": "stat",
              "key": "restraint",
              "delta": 1
            }
          ],
          "timeMinutes": 15,
          "next": "c07_before_bait"
        },
        {
          "text": "Mission success first. Everything else collapses if we fail.",
          "effects": [
            {
              "type": "npc",
              "key": "Vance",
              "trust": 0,
              "respect": 0
            },
            {
              "type": "relationship",
              "key": "Vance",
              "delta": 1
            },
            {
              "type": "flag",
              "key": "add_c07_vance_review_expanded_choice_3",
              "value": true
            },
            {
              "type": "stat",
              "key": "resolve",
              "delta": 1
            }
          ],
          "timeMinutes": 15,
          "next": "c07_before_bait"
        },
        {
          "text": "Personal control first. If I lose that, the rest stops mattering.",
          "effects": [
            {
              "type": "npc",
              "key": "Vance",
              "trust": 0,
              "respect": 0
            },
            {
              "type": "relationship",
              "key": "Vance",
              "delta": 1
            },
            {
              "type": "flag",
              "key": "add_c07_vance_review_expanded_choice_4",
              "value": true
            },
            {
              "type": "stat",
              "key": "audacity",
              "delta": 1
            }
          ],
          "timeMinutes": 15,
          "next": "c07_before_bait"
        }
      ]
    },
    "add_c07_jordan_signal": {
      "chapter": 7,
      "title": "Jordan Signal",
      "location": "Records Corridor",
      "background": "aegis",
      "focus": "Jordan",
      "text": [
        "Jordan catches you between doors, which is how they do most things that matter.",
        "The records corridor is barely a corridor at all, more a clean run of frosted side rooms and utility alcoves where people with access badges say dangerous things quietly. Jordan is leaning against the wall beside a fire cabinet, one heel braced behind them, looking like they got dressed with enough care to count as respect and enough understatement to pass through Aegis without becoming anyone's case study for personality.",
        "\"I have exactly ninety seconds before this becomes suspicious,\" they say. \"Maybe less if Vance is in one of his tragic little omniscient moods.\"",
        "\"You sound fond.\"",
        "\"Don't be absurd.\"",
        "They hand you a folded note card instead of a device. Smart. Less traceable. More insulting.",
        "\"This is not classified,\" Jordan says. \"It is socially expensive. Distinction matters. Two analysts on the review side are pushing different stories about you. One thinks you stabilize if attached to peers. One thinks peers are the destabilizing variable because your decisions get stranger when anybody matters to you. I thought you should know your emotional life now has a seating chart in three departments.\"",
        "There are days when Jordan's dry delivery is comforting. Today it feels like being cut with polished glass.",
        "\"Why tell me?\"",
        "Jordan's expression shifts by maybe half a degree. \"Because I prefer manipulations that declare themselves. And because if they turn your connections into a vulnerability model, the rest of us become notation on a board. I dislike being notation.\"",
        "That is, from Jordan, practically a love letter to personhood.",
        "They tap the card once. On it: two initials, a meeting code, and a time mark from earlier that morning. Enough to know the conversation happened. Not enough to make a legal case. Exactly enough to decide whether your next conversation with Vance, Camille, Theo, Piper, or Julian sounds different.",
        "\"Use it cleanly,\" Jordan says. \"If you throw it like a grenade, they'll only learn that I was right to be selective.\""
      ],
      "choices": [
        {
          "text": "I won't expose you. Thank you.",
          "effects": [
            {
              "type": "npc",
              "key": "Jordan",
              "trust": 1,
              "respect": 0
            },
            {
              "type": "relationship",
              "key": "Jordan",
              "delta": 2
            },
            {
              "type": "flag",
              "key": "add_c07_jordan_signal_choice_1",
              "value": true
            },
            {
              "type": "stat",
              "key": "control",
              "delta": 1
            }
          ],
          "timeMinutes": 15,
          "next": "c07_hub_return_records"
        },
        {
          "text": "Who else knows?",
          "effects": [
            {
              "type": "npc",
              "key": "Jordan",
              "trust": 0,
              "respect": 1
            },
            {
              "type": "relationship",
              "key": "Jordan",
              "delta": 1
            },
            {
              "type": "flag",
              "key": "add_c07_jordan_signal_choice_2",
              "value": true
            },
            {
              "type": "stat",
              "key": "restraint",
              "delta": 1
            }
          ],
          "timeMinutes": 15,
          "next": "c07_hub_return_records"
        },
        {
          "text": "Then I talk to Vance before he thinks the board gets to decide me.",
          "effects": [
            {
              "type": "npc",
              "key": "Jordan",
              "trust": 0,
              "respect": 0
            },
            {
              "type": "relationship",
              "key": "Jordan",
              "delta": 1
            },
            {
              "type": "flag",
              "key": "add_c07_jordan_signal_choice_3",
              "value": true
            },
            {
              "type": "stat",
              "key": "resolve",
              "delta": 1
            }
          ],
          "timeMinutes": 15,
          "next": "c07_hub_return_records"
        },
        {
          "text": "Then I tell the others what the board is doing to them too.",
          "effects": [
            {
              "type": "npc",
              "key": "Jordan",
              "trust": 0,
              "respect": 0
            },
            {
              "type": "relationship",
              "key": "Jordan",
              "delta": 1
            },
            {
              "type": "flag",
              "key": "add_c07_jordan_signal_choice_4",
              "value": true
            },
            {
              "type": "stat",
              "key": "audacity",
              "delta": 1
            }
          ],
          "timeMinutes": 15,
          "next": "c07_hub_return_records"
        }
      ]
    },
    "add_c07_ben_training_support": {
      "chapter": 7,
      "title": "Ben Training Support",
      "location": "Training Wing Reset Room",
      "background": "sim",
      "focus": "Ben",
      "text": [
        "Ben finds you in the reset room because Ben is very good at finding the place where people pretend they are only stopping for water.",
        "The reset room sits between the training floor and the med corridor like an institutional apology. Foam rollers in a bin. clean towels folded with suspicious precision. a refrigerator full of electrolyte packs that all taste like medicinal fruit. two benches. one vending machine with a broken card reader. It is the kind of room built for bodies after impact and feelings after they become inconvenient.",
        "Ben is carrying a duffel over one shoulder and two bottled waters in one hand. He offers one without asking whether you want it. Another quiet Ben talent: he is often right about the form care should take before anyone else has chosen the vocabulary.",
        "\"Heard they're finalizing the dome run,\" he says.",
        "\"News travels.\"",
        "\"At Aegis? Shocking.\"",
        "You take the water. He leans against the opposite bench and studies you with the open, unshowy attention that makes people confess things around him by accident.",
        "\"You okay?\" he asks.",
        "There are approximately twelve lies available. Ben gives each one just enough room to be possible without making any of them necessary.",
        "\"I'm functional,\" you say.",
        "Ben snorts. \"Terrible answer. Efficient, but terrible.\"",
        "He twists the cap off his own bottle. \"For what it's worth, I don't think everybody protecting you is the same thing as everybody deciding for you. A lot of people here are bad at telling the difference, but that doesn't mean there isn't one.\"",
        "Support characters like Ben matter most when the story lets them be right in plain clothes. This is one of those moments.",
        "\"And you?\" you ask. \"You think the plan is smart?\"",
        "Ben shrugs one shoulder. \"I think smart is a scam word. I think it's the least bad option with too many ways to turn ugly. I think Piper's mad because she cares. Theo's mad because he cares and wants the caring documented in triplicate. Camille's mad because the plan offends her standards and she's doing it anyway. Julian's mad because institutions always get weird when people stop being decorative to them.\"",
        "He takes a drink. \"And I think you're mad because all of them are right in different directions.\"",
        "That one lands.",
        "Ben gives you a crooked little smile. \"See? I can do menace too.\""
      ],
      "choices": [
        {
          "text": "Stay nearby when this starts.",
          "effects": [
            {
              "type": "npc",
              "key": "Ben",
              "trust": 1,
              "respect": 0
            },
            {
              "type": "relationship",
              "key": "Ben",
              "delta": 2
            },
            {
              "type": "flag",
              "key": "add_c07_ben_training_support_choice_1",
              "value": true
            },
            {
              "type": "stat",
              "key": "control",
              "delta": 1
            }
          ],
          "timeMinutes": 15,
          "next": "c07_hub_return_training"
        },
        {
          "text": "Tell me if I start sounding like I believe my own myth.",
          "effects": [
            {
              "type": "npc",
              "key": "Ben",
              "trust": 0,
              "respect": 1
            },
            {
              "type": "relationship",
              "key": "Ben",
              "delta": 1
            },
            {
              "type": "flag",
              "key": "add_c07_ben_training_support_choice_2",
              "value": true
            },
            {
              "type": "stat",
              "key": "restraint",
              "delta": 1
            }
          ],
          "timeMinutes": 15,
          "next": "c07_hub_return_training"
        },
        {
          "text": "You just summarized my life better than medical has.",
          "effects": [
            {
              "type": "npc",
              "key": "Ben",
              "trust": 0,
              "respect": 0
            },
            {
              "type": "relationship",
              "key": "Ben",
              "delta": 1
            },
            {
              "type": "flag",
              "key": "add_c07_ben_training_support_choice_3",
              "value": true
            },
            {
              "type": "stat",
              "key": "resolve",
              "delta": 1
            }
          ],
          "timeMinutes": 15,
          "next": "c07_hub_return_training"
        },
        {
          "text": "I need everyone less careful with me, not more.",
          "effects": [
            {
              "type": "npc",
              "key": "Ben",
              "trust": 0,
              "respect": 0
            },
            {
              "type": "relationship",
              "key": "Ben",
              "delta": 1
            },
            {
              "type": "flag",
              "key": "add_c07_ben_training_support_choice_4",
              "value": true
            },
            {
              "type": "stat",
              "key": "audacity",
              "delta": 1
            }
          ],
          "timeMinutes": 15,
          "next": "c07_hub_return_training"
        }
      ]
    },
    "add_c08_piper_runway_hold": {
      "chapter": 8,
      "title": "Piper Runway Hold",
      "location": "Runway Edge",
      "background": "sim",
      "focus": "Piper",
      "text": [
        "The runway edge is marked by a painted safety line that feels less like a rule and more like a dare. Wind drags low over the open concrete and throws the smell of hot asphalt, jet fuel, and salt from the distant bay into one hard strand. Out here the hangar noise thins. The whole airbase seems to narrow into distance, speed, and the bad idea of trying to beat either.",
        "Piper is standing with one sneaker half over the line, hands on hips, staring down the lane markers like she can already hear herself in them. The wind keeps stealing strands of hair across her face and she keeps ignoring it. That, more than anything, makes her look young and dangerous at once.",
        "\"You know,\" she says without turning, \"if someone from command says 'controlled escalation' one more time, I'm going to make them jog ten laps in a pencil skirt.\"",
        "\"That would improve the culture.\"",
        "\"Exactly. Reform.\"",
        "She glances over then, and because this is no longer day one, the look carries all the charge of whatever the two of you have and have not done with each other so far. If you flirted early and stayed brave about it, the current is clean and obvious. If you circled each other more carefully, it still lives there, just hidden under easier lines. If you have repeatedly chosen her in motion and then gone quiet when things got serious, she knows that too. Piper always knows when she is the version of you that only exists while the room is fun.",
        "\"Do you ever get tired,\" she asks, \"of being the thing everyone rearranges themselves around?\"",
        "The question lands so directly it takes a second to recognize it. Coming from anyone else it might sound like envy, accusation, concern. From her it sounds like all three and none cleanly separated.",
        "\"Do you?\" you ask.",
        "She gives a short laugh. \"Constantly. But I'm hot enough to make it a brand.\"",
        "Then the mask shifts. Only slightly. Enough.",
        "She steps off the line and starts walking parallel to the runway, slow for her, which means slow in the way a storm is slow when it is choosing a wall. \"Mach numbers are funny,\" she says. \"Everybody acts like they're achievements. They're actually threats with better marketing.\"",
        "The sentence should be ridiculous. It isn't.",
        "\"If I miss the stop,\" she says, still watching ahead, \"I hurt somebody. If I hit the stop and it still scares them, I become a problem anyway. If I hesitate, I get called soft. If I don't, I get called exactly what they were always worried I was.\"",
        "That is more honesty than she usually puts on a runway before noon. If you have earned it, you can hear that. If you have not, you can still hear that she is choosing to give it anyway because the concrete is too big for easy banter to fill.",
        "You fall into step beside her. The wind pulls your words sideways when you speak. \"And where do I fit in that speech?\"",
        "She smiles without humor. \"In the deeply inconvenient place where you might actually understand it.\"",
        "A transport plane taxis far off on a parallel strip, all distant weight and disciplined power. Piper watches it for a second, then looks at you again. \"I know what you do in rooms,\" she says. \"I'm less interested in that now. I want to know what you do when the room goes away.\"",
        "That is practically a confession from her.",
        "If you answer lightly, she will play there. If you answer honestly, she will let you. If you flirt, she will not run from it. Not here. Not now. The runway has eaten too much pretense already.",
        "\"You look like you want me to say something meaningful,\" you say.",
        "\"No,\" she says. \"I want you to say something true. Meaningful is what people say when they want to sound expensive.\"",
        "The laugh that gets out of you this time is real. She notices that too, and softens around the edges before catching herself.",
        "Then she leans closer and says, \"Also, if I hit Mach Five and live, you are legally required to be impressed in a way that borders on worship.\"",
        "\"I'll see what the paperwork allows.\"",
        "She bumps your shoulder with hers, quick and deliberate. \"Coward.\"",
        "Her grin returns, warmer now. \"Tell me one thing,\" she says. \"If this goes badly, what are you going to do? Not command. Not policy. You.\"",
        "You know from the way she asks that the answer matters more than the line itself. Whether you reassure, challenge, promise, flirt, or tell her a hard truth, she will remember which version you chose."
      ],
      "choices": [
        {
          "text": "Tell her you'll pull her back before the runway gets to decide for either of you.",
          "effects": [
            {
              "type": "npc",
              "key": "Piper",
              "trust": 1,
              "respect": 0
            },
            {
              "type": "relationship",
              "key": "Piper",
              "delta": 2
            },
            {
              "type": "flag",
              "key": "add_c08_piper_runway_hold_choice_1",
              "value": true
            },
            {
              "type": "stat",
              "key": "control",
              "delta": 1
            }
          ],
          "timeMinutes": 15,
          "next": "c08_hub_airbase"
        },
        {
          "text": "Say you'll trust her to make the stop and be there if she can't.",
          "effects": [
            {
              "type": "npc",
              "key": "Piper",
              "trust": 0,
              "respect": 1
            },
            {
              "type": "relationship",
              "key": "Piper",
              "delta": 1
            },
            {
              "type": "flag",
              "key": "add_c08_piper_runway_hold_choice_2",
              "value": true
            },
            {
              "type": "stat",
              "key": "restraint",
              "delta": 1
            }
          ],
          "timeMinutes": 15,
          "next": "c08_hub_airbase"
        },
        {
          "text": "Admit the idea of what both of you could do out here is terrifying and say that's not the same as wanting less of it.",
          "effects": [
            {
              "type": "npc",
              "key": "Piper",
              "trust": 0,
              "respect": 0,
              "attraction": 1
            },
            {
              "type": "relationship",
              "key": "Piper",
              "delta": 1
            },
            {
              "type": "flag",
              "key": "add_c08_piper_runway_hold_choice_3",
              "value": true
            },
            {
              "type": "stat",
              "key": "resolve",
              "delta": 1
            }
          ],
          "timeMinutes": 15,
          "next": "c08_hub_airbase"
        },
        {
          "text": "Step closer and tell her that if she wants worship, she could start by surviving long enough to collect it.",
          "effects": [
            {
              "type": "npc",
              "key": "Piper",
              "trust": 0,
              "respect": 0,
              "attraction": 1
            },
            {
              "type": "relationship",
              "key": "Piper",
              "delta": 1
            },
            {
              "type": "flag",
              "key": "add_c08_piper_runway_hold_choice_4",
              "value": true
            },
            {
              "type": "stat",
              "key": "audacity",
              "delta": 1
            }
          ],
          "timeMinutes": 15,
          "next": "c08_hub_airbase"
        }
      ]
    },
    "add_c08_camille_abort_geometry": {
      "chapter": 8,
      "title": "Camille Abort Geometry",
      "location": "Airbase Catwalk",
      "background": "sim",
      "focus": "Camille",
      "text": [
        "The catwalk above the hangar gives the illusion of distance without actually offering any. From up here you can see the full geometry of the airbase setup: the runway lanes cut into long certainty, the med tents clustered like a contingency made visible, the staging squares painted in temporary order, the little moving pieces of technicians and trainees pretending they are not all orbiting the same potential disaster.",
        "Camille is leaning over the rail, one hand resting on a clipboard covered in stop vectors and abort routes. The catwalk lights leave one side of her face in shadow and sharpen the other into clean planes. She does not turn when you approach. She already knows your footstep.",
        "\"I asked for a third abort net,\" she says. \"They gave me two and a lecture about confidence.\"",
        "\"That sounds like a love language here.\"",
        "\"It is. A deeply stupid one.\"",
        "Only then does she glance your way. Whatever the two of you have built so far-respect, tension, challenge, flirtation with edges on it, the feeling that every conversation is also a test and neither of you minds-that all arrives in the look before she says anything else.",
        "Below, Piper blurs one practice line and brakes clean, technicians lifting hands instinctively even though nothing went wrong. Theo is at medical for now, conferring with a field medic and pretending not to hover. Julian has found a place between the catwalk cameras where he can be useful without becoming scenery for the observers. Ben is checking the crash mats again because being reliable is apparently his hobby and his burden both.",
        "Camille taps the clipboard. \"Everyone thinks the main danger is output,\" she says. \"It isn't. The main danger is when people fall in love with the idea that one strong performance makes a system they can trust.\"",
        "She means power. She also means people. She almost certainly means both about you.",
        "The wind is colder up here. It pulls at the loose edge of her sleeve, at your jacket, at the pages clipped under her palm. If you are close enough with her to notice, she has not hidden the extra annotations. Distances. Redirect angles. Human bodies translated into numbers she would rather never need.",
        "\"You plan for all of us,\" you say.",
        "\"I plan for failure,\" she corrects. \"The names attached to it are incidental.\"",
        "A beat passes. She knows exactly how false that sounds.",
        "\"If that were true,\" you say, \"you wouldn't have separate handwriting for mine.\"",
        "That gets you the faintest actual smile, quick and dangerous as a blade turning in light. \"You should be less observant,\" she says.",
        "\"You should stop leaving evidence.\"",
        "\"I don't leave evidence. I leave structure.\"",
        "There it is again, the reason conversations with her feel better than most people's declarations. She is direct without being messy. Even when she is defensive, it comes sharpened.",
        "She finally turns fully toward you and sets the clipboard against the rail. \"This chapter is full of people who want you to become legible,\" she says. \"I'm less interested in that. I'm interested in whether you stay precise once other people start projecting what they need onto you.\"",
        "If you have already flirted with her openly, the line hums. If you have only circled, it still lands too close to the chest to be purely professional.",
        "\"You think I get imprecise when watched?\" you ask.",
        "\"I think people enjoy being misunderstood when the misunderstanding flatters them.\" Her gaze drops briefly to your mouth and returns to your eyes before it can be called anything accidental. \"I think that habit becomes expensive.\"",
        "Below you, an air horn sounds twice and a new crew clears the lane. The whole airbase seems to take one measured breath.",
        "Camille rests both forearms on the rail and looks back down. \"I know what you look like when you're trying to be careful,\" she says. \"I don't know yet what you look like when the careful version of you becomes inconvenient.\"",
        "It would be easy to answer with charm. It would work, up to a point. The problem with Camille is that she always knows the exact point.",
        "\"If I answer that honestly,\" you say, \"what do I get?\"",
        "She tilts her head just enough to acknowledge the terms. \"The same thing you always get from me,\" she says. \"A better question.\"",
        "It is somehow more intimate than a softer person would manage.",
        "Then, after a pause deliberate enough to count, she says, \"Also: if you intend to kiss me someday, don't make the mistake of doing it because you survived something dramatic. I would hate to discover your timing is sentimental.\"",
        "The sentence lands with perfect calm. The silence after it does not.",
        "She turns away first, which does not feel like retreat so much as trust that the line can live between you without collapsing under its own weight."
      ],
      "choices": [
        {
          "text": "Tell her sentimental timing would be an insult to both your standards.",
          "effects": [
            {
              "type": "npc",
              "key": "Camille",
              "trust": 1,
              "respect": 0
            },
            {
              "type": "relationship",
              "key": "Camille",
              "delta": 2
            },
            {
              "type": "flag",
              "key": "add_c08_camille_abort_geometry_choice_1",
              "value": true
            },
            {
              "type": "stat",
              "key": "control",
              "delta": 1
            }
          ],
          "timeMinutes": 15,
          "next": "c08_hub_return_medical"
        },
        {
          "text": "Ask whether that was a threat, an invitation, or her idea of stress management.",
          "effects": [
            {
              "type": "npc",
              "key": "Camille",
              "trust": 0,
              "respect": 1
            },
            {
              "type": "relationship",
              "key": "Camille",
              "delta": 1
            },
            {
              "type": "flag",
              "key": "add_c08_camille_abort_geometry_choice_2",
              "value": true
            },
            {
              "type": "stat",
              "key": "restraint",
              "delta": 1
            }
          ],
          "timeMinutes": 15,
          "next": "c08_hub_return_medical"
        },
        {
          "text": "Say you'll answer her better question after the runway, when neither of you can hide inside the work.",
          "effects": [
            {
              "type": "npc",
              "key": "Camille",
              "trust": 0,
              "respect": 0
            },
            {
              "type": "relationship",
              "key": "Camille",
              "delta": 1
            },
            {
              "type": "flag",
              "key": "add_c08_camille_abort_geometry_choice_3",
              "value": true
            },
            {
              "type": "stat",
              "key": "resolve",
              "delta": 1
            }
          ],
          "timeMinutes": 15,
          "next": "c08_hub_return_medical"
        },
        {
          "text": "Let the line stand and ask what she thinks the ugly version of your precision would look like.",
          "effects": [
            {
              "type": "npc",
              "key": "Camille",
              "trust": 0,
              "respect": 0
            },
            {
              "type": "relationship",
              "key": "Camille",
              "delta": 1
            },
            {
              "type": "flag",
              "key": "add_c08_camille_abort_geometry_choice_4",
              "value": true
            },
            {
              "type": "stat",
              "key": "audacity",
              "delta": 1
            }
          ],
          "timeMinutes": 15,
          "next": "c08_hub_return_medical"
        }
      ]
    },
    "add_c08_theo_medical_afterburn": {
      "chapter": 8,
      "title": "Theo Medical Afterburn",
      "location": "Medical Tent",
      "background": "aegis",
      "focus": "Theo",
      "text": [
        "The medical tent at the airbase has all the intimacy of a battlefield and all the bedside charm of a spreadsheet. Folding partitions try and fail to create privacy. Portable monitors click and chirp with tireless indifference. Somebody has labeled every tray twice, which means Theo looks slightly less miserable here than he would in a room with fewer attempts at order.",
        "He is standing near the far monitor rack with a tablet in one hand and a disposable cup of tea in the other, the tea almost certainly forgotten. A field medic is showing him a live threshold chart and regretting it because Theo is already asking the kind of question that forces people to admit whether their assumptions are decorative.",
        "When the medic is pulled away, Theo exhales through his nose and only then notices you close enough to count as a conversation instead of background.",
        "\"You look intact,\" he says.",
        "\"Your standards are romantic.\"",
        "\"I'm serious.\"",
        "\"I know.\"",
        "That is the thing with him now. By Chapter 8, if you have let him matter, you can hear the difference immediately between his dry voice and his actual fear. The line between them is still thin. It is just no longer invisible.",
        "He sets the tea down on a folding table crowded with blood-pressure cuffs and sealed packets. \"These thresholds are conservative in the wrong places,\" he says. \"They're built around catastrophic event prevention, which is good, but they underweight compounding stress markers once somebody decides they're still technically functional.\"",
        "\"You say that like it's about me.\"",
        "Theo gives you a look so direct it nearly counts as irritation. \"Because it is about you.\"",
        "A pause. He adjusts his grip on the tablet. \"And Piper,\" he adds, because he is not territorial enough to lie by omission. \"And frankly everyone here, but mostly the two of you.\"",
        "Outside the tent, somebody wheels a case across the concrete. The rattling sound rises and fades. The canvas walls snap softly in the wind.",
        "Theo lowers his voice. \"There's a version of this day where nothing dramatic happens and we still pay for it later,\" he says. \"People act like clean outcomes mean low cost. They don't.\"",
        "If you have treated him like a person rather than a warning system across the earlier chapters, the tension in his shoulders reads less like annoyance and more like trust straining against fear. If you flirted with him carefully and kept it honest, that too lives in the space between you now. Theo is not the kind of person who stops feeling because circumstances get bigger. He is the kind who feels more and tells you less unless you make it safe.",
        "You lean against the supply table. \"You came all the way to an airbase to tell me my bad decisions might have delayed consequences?\"",
        "\"No. I came all the way to an airbase because apparently this institution only respects advice once it's attached to a portable trauma unit.\"",
        "The dryness catches both of you by surprise. You laugh first. Theo looks startled by the fact that he managed it and then, grudgingly, pleased.",
        "\"That was almost a joke,\" you say.",
        "\"Don't spread it around.\"",
        "His hand hovers over the tablet screen. \"I don't need you to promise me something unrealistic,\" he says. \"I know what this chapter is. I know what you're going to be asked to hold. I just...\" He stops, recalibrates, starts again. \"I need you not to mistake surviving the event for having been fine.\"",
        "There is an intimacy in that sentence he will probably deny under oath.",
        "If earlier chapters established a quieter current between you, this is where it tightens. Not in spectacle. In the fact that Theo's version of tenderness sounds almost exactly like excellent risk communication until you listen closely enough to hear the person inside it.",
        "\"You assume I'm bad at recovery,\" you say.",
        "\"I assume you're good at enduring. Those aren't the same skill.\"",
        "That lands.",
        "The medic from before calls for him from the other end of the tent. Theo glances that way, then back to you, as if annoyed by the interruption and himself for caring that it is one.",
        "\"After this,\" he says, \"someone needs to make sure the official version of the day isn't cleaner than the real one.\"",
        "\"You volunteering?\"",
        "\"I'm making sure you know I'll notice if you lie.\"",
        "It is, somehow, one of the warmest things anybody has said to you all week."
      ],
      "choices": [
        {
          "text": "Tell him you don't want clean lies either and ask if he'll stay close enough to call them out.",
          "effects": [
            {
              "type": "npc",
              "key": "Theo",
              "trust": 1,
              "respect": 0,
              "attraction": 1
            },
            {
              "type": "relationship",
              "key": "Theo",
              "delta": 2
            },
            {
              "type": "flag",
              "key": "add_c08_theo_medical_afterburn_choice_1",
              "value": true
            },
            {
              "type": "stat",
              "key": "control",
              "delta": 1
            }
          ],
          "timeMinutes": 15,
          "next": "c08_hub_return_medical"
        },
        {
          "text": "Say enduring kept you alive before Aegis and ask whether he's offering to teach the other skill.",
          "effects": [
            {
              "type": "npc",
              "key": "Theo",
              "trust": 0,
              "respect": 1
            },
            {
              "type": "relationship",
              "key": "Theo",
              "delta": 1
            },
            {
              "type": "flag",
              "key": "add_c08_theo_medical_afterburn_choice_2",
              "value": true
            },
            {
              "type": "stat",
              "key": "restraint",
              "delta": 1
            }
          ],
          "timeMinutes": 15,
          "next": "c08_hub_return_medical"
        },
        {
          "text": "Admit he's right and thank him without making a joke out of it.",
          "effects": [
            {
              "type": "npc",
              "key": "Theo",
              "trust": 0,
              "respect": 0
            },
            {
              "type": "relationship",
              "key": "Theo",
              "delta": 1
            },
            {
              "type": "flag",
              "key": "add_c08_theo_medical_afterburn_choice_3",
              "value": true
            },
            {
              "type": "stat",
              "key": "resolve",
              "delta": 1
            }
          ],
          "timeMinutes": 15,
          "next": "c08_hub_return_medical"
        },
        {
          "text": "Step closer and tell him his version of concern is annoyingly effective.",
          "effects": [
            {
              "type": "npc",
              "key": "Theo",
              "trust": 0,
              "respect": 0,
              "attraction": 1
            },
            {
              "type": "relationship",
              "key": "Theo",
              "delta": 1
            },
            {
              "type": "flag",
              "key": "add_c08_theo_medical_afterburn_choice_4",
              "value": true
            },
            {
              "type": "stat",
              "key": "audacity",
              "delta": 1
            }
          ],
          "timeMinutes": 15,
          "next": "c08_hub_return_medical"
        }
      ]
    },
    "add_c08_julian_catwalk": {
      "chapter": 8,
      "title": "Julian Catwalk",
      "location": "Observation Catwalk",
      "background": "sim",
      "focus": "Julian",
      "text": [
        "The observation catwalk runs high along the hangar wall where the cameras have the best angle and the people below have the least privacy. It should feel merciless. Julian somehow makes it feel theatrical instead, leaning one elbow against the rail with a headset slung around his neck like he is halfway between stage manager and gorgeous liability.",
        "\"You made it,\" he says as you approach. \"I was worried Vance might keep you in a lockbox labeled 'do not escalate before lunch.'\"",
        "\"You say that like it isn't still an option.\"",
        "\"Oh, it's absolutely still an option. I'm just flattered you escaped long enough to visit.\"",
        "Below you the runway arrangement looks even stranger, all deliberate spacing and portable medicine. Piper flashes once at the line and vanishes back into stillness. Camille has three abort routes open at once. Theo is visible only as a dark head bent over monitor light. Ben is moving crash equipment with the stubborn grace of someone who has accepted that if disaster occurs, his body will be invited to negotiate with it first.",
        "Julian watches all of it, then tips his head toward you. \"You know what I find charming about Aegis?\" he says.",
        "\"Your courage in using that word here?\"",
        "\"That, yes. Also the way they pretend visibility is neutral. As if being watched by the right people somehow cleanses the violence out of it.\"",
        "That is why he matters. Beneath the style, he is one of the few people here who notices soft harm when it dresses itself in systems language.",
        "A wind gust rattles the catwalk mesh. He catches the rail and doesn't break his train of thought. \"Everyone's nerves are dressing differently today,\" he says. \"Piper's are all sparkle and contempt. Theo's are disguised as ethics. Camille's are pretending to be geometry. Yours...\" He lets the sentence hover. \"I'm still taking notes.\"",
        "If there has been flirtation between you, it glides through the line like a blade under silk. If there has only been the quieter closeness of being properly seen, this still lands intimate because Julian rarely offers undivided attention without charging interest later.",
        "\"What have you got so far?\" you ask.",
        "He studies you for a second, not mocking, not soft, simply exact. \"You become more honest the less decorative a room is,\" he says. \"Which is terrible news for anyone who enjoys flirting with you under chandeliers.\"",
        "\"Good thing there are no chandeliers.\"",
        "His mouth curves. \"Tragic.\"",
        "He pushes off the rail and walks a few steps down the catwalk, forcing you to follow if you want the conversation to continue. Down below, two airbase staffers are arguing by a signal case. Jordan is speaking to one of the shuttle drivers with the expression of someone rescuing the rest of you from a preventable social error. The runway takes all of it and turns it into pattern.",
        "Julian stops at the point where the catwalk windows look directly onto the threshold markers. \"Do you know what the worst version of today is for me?\" he asks.",
        "You expect spectacle. You expect collateral. You expect some gorgeous answer involving public perception.",
        "He surprises you. \"That you survive beautifully,\" he says, \"and everyone decides that means they finally understand you.\"",
        "The sentence lands like a door opening quietly in a room you did not know was locked.",
        "He looks away first, not because he regrets it but because he knows how strong the line is and has no intention of pretending it isn't. \"I'm very vain,\" he adds after a beat. \"But I do occasionally care about people for reasons that would disappoint my publicist.\"",
        "\"That's devastating news.\"",
        "\"I know. I may have to change brands.\"",
        "There is room here for banter if you want it, and he will meet you there all day. There is also room for the more dangerous option: answering with equal honesty.",
        "Below, somebody calls his name from the far end of the catwalk. He ignores it once.",
        "\"Whatever happens out there,\" he says, quieter now, \"don't let them make you only one thing because it's easier to catalog. It would be so embarrassingly boring.\"",
        "Then, because this is still Julian, he adds, \"And if you come back from the runway looking tragic and luminous, at least let me fix the angle before the report photos.\""
      ],
      "choices": [
        {
          "text": "Tell him if anyone gets to choose your angle after today, it should probably be him.",
          "effects": [
            {
              "type": "npc",
              "key": "Julian",
              "trust": 1,
              "respect": 0
            },
            {
              "type": "relationship",
              "key": "Julian",
              "delta": 2
            },
            {
              "type": "flag",
              "key": "add_c08_julian_catwalk_choice_1",
              "value": true
            },
            {
              "type": "stat",
              "key": "control",
              "delta": 1
            }
          ],
          "timeMinutes": 15,
          "next": "c08_hub_airbase"
        },
        {
          "text": "Say you'd rather come back complicated than luminous and ask whether he'll still like the result.",
          "effects": [
            {
              "type": "npc",
              "key": "Julian",
              "trust": 0,
              "respect": 1
            },
            {
              "type": "relationship",
              "key": "Julian",
              "delta": 1
            },
            {
              "type": "flag",
              "key": "add_c08_julian_catwalk_choice_2",
              "value": true
            },
            {
              "type": "stat",
              "key": "restraint",
              "delta": 1
            }
          ],
          "timeMinutes": 15,
          "next": "c08_hub_airbase"
        },
        {
          "text": "Admit he may be the only person here who notices the difference between being seen and being interpreted.",
          "effects": [
            {
              "type": "npc",
              "key": "Julian",
              "trust": 0,
              "respect": 0
            },
            {
              "type": "relationship",
              "key": "Julian",
              "delta": 1
            },
            {
              "type": "flag",
              "key": "add_c08_julian_catwalk_choice_3",
              "value": true
            },
            {
              "type": "stat",
              "key": "resolve",
              "delta": 1
            }
          ],
          "timeMinutes": 15,
          "next": "c08_hub_airbase"
        },
        {
          "text": "Deflect with a joke about giving him exclusive catastrophe rights and keep the softer answer for later.",
          "effects": [
            {
              "type": "npc",
              "key": "Julian",
              "trust": 0,
              "respect": 0
            },
            {
              "type": "relationship",
              "key": "Julian",
              "delta": 1
            },
            {
              "type": "flag",
              "key": "add_c08_julian_catwalk_choice_4",
              "value": true
            },
            {
              "type": "stat",
              "key": "audacity",
              "delta": 1
            }
          ],
          "timeMinutes": 15,
          "next": "c08_hub_airbase"
        }
      ]
    },
    "add_c08_ben_crashmats": {
      "chapter": 8,
      "title": "Ben Crashmats",
      "location": "Crash Mat Stack",
      "background": "aegis",
      "focus": "Ben",
      "text": [
        "Ben is knee-deep in crash mats because apparently nobody in command looked at a stack taller than a car and thought maybe it should be a two-person job. He has one shoulder under the top pad, guiding it into place against a low brace with the patient concentration of somebody determined not to let inconvenience become somebody else's emergency.",
        "\"You know,\" he says when he notices you, \"there are easier ways to flirt with danger than helping set up the part where we catch it.\"",
        "\"Speak from experience?\"",
        "\"My whole power set is speaking from experience.\"",
        "He lets the mat fall into place and straightens with a soft grunt. Even here, even now, Ben manages to bring the temperature of a room down by refusing to be impressed with his own capacity to take punishment. That steadiness matters more by Chapter 8 than it did earlier, because now the whole cohort understands exactly how often stability gets mistaken for consent.",
        "You help him with the next mat because not helping would be weird and because he deserves the gesture. Together you drag the corner into line.",
        "\"Everybody keeps looking at the runway,\" Ben says. \"I keep looking at where people land.\"",
        "That sentence says almost everything about him.",
        "He wipes his hands and glances toward the open lane. Piper is a streak of impossible confidence when she moves. Camille looks like she could arrest panic by posture alone. Theo is still at medical, trying to outthink catastrophe before it earns a body. Julian is up on the catwalk making observation look stylish, which should probably be illegal. Ben follows your gaze and smiles faintly.",
        "\"You all really care about each other now,\" he says. \"That seems like useful timing.\"",
        "\"Useful?\" you echo.",
        "\"Dangerous too,\" he says. \"But useful.\"",
        "If you treated him well in earlier chapters, there is warmth here that does not need ceremony. If you treated him like background infrastructure, the scene still works, just with more distance in it. Ben is forgiving, not blank.",
        "He checks the brace one more time. \"People think being the durable one means you don't notice when the room starts volunteering your body for things,\" he says. \"The funny part is, you notice earlier than anyone.\"",
        "That might be the most pointed he has ever been with you.",
        "You lean against the stack. \"You asking me not to let them?\"",
        "\"I'm asking you not to help them by accident.\"",
        "Fair.",
        "He says it without bitterness, which somehow makes it heavier. Earlier chapters established the pattern: Ben gets used because he can endure being used. Chapter 8 is where that starts reading less like a role and more like a warning.",
        "A medic calls across the hangar asking whether the north stack is secured. Ben lifts a hand in acknowledgment and then looks back at you.",
        "\"You don't have to be fine because the chapter is loud,\" he says. \"Nobody with a working brain expects that.\"",
        "\"Optimistic of you to assume a working brain.\"",
        "He grins. \"I said nobody. I'm not talking about Lane.\"",
        "The joke buys you both a second.",
        "Then, more quietly: \"Just remember people are going to take cues from you today. That's not fair, but it's true. If you act like pain doesn't count unless it drops you, everybody else out here is going to make bad decisions trying to keep up.\"",
        "It is a Ben line, which means it is kinder and more useful than almost anything command has said all morning."
      ],
      "choices": [
        {
          "text": "Tell him you hear him and ask what he needs from you if this turns ugly.",
          "effects": [
            {
              "type": "npc",
              "key": "Ben",
              "trust": 1,
              "respect": 0
            },
            {
              "type": "relationship",
              "key": "Ben",
              "delta": 2
            },
            {
              "type": "flag",
              "key": "add_c08_ben_crashmats_choice_1",
              "value": true
            },
            {
              "type": "stat",
              "key": "control",
              "delta": 1
            }
          ],
          "timeMinutes": 15,
          "next": "c08_hub_airbase"
        },
        {
          "text": "Say he deserves better than being everyone's default impact budget.",
          "effects": [
            {
              "type": "npc",
              "key": "Ben",
              "trust": 0,
              "respect": 1
            },
            {
              "type": "relationship",
              "key": "Ben",
              "delta": 1
            },
            {
              "type": "flag",
              "key": "add_c08_ben_crashmats_choice_2",
              "value": true
            },
            {
              "type": "stat",
              "key": "restraint",
              "delta": 1
            }
          ],
          "timeMinutes": 15,
          "next": "c08_hub_airbase"
        },
        {
          "text": "Joke about putting Piper in a padded room and then check if he's actually all right.",
          "effects": [
            {
              "type": "npc",
              "key": "Ben",
              "trust": 0,
              "respect": 0
            },
            {
              "type": "relationship",
              "key": "Ben",
              "delta": 1
            },
            {
              "type": "flag",
              "key": "add_c08_ben_crashmats_choice_3",
              "value": true
            },
            {
              "type": "stat",
              "key": "resolve",
              "delta": 1
            }
          ],
          "timeMinutes": 15,
          "next": "c08_hub_airbase"
        },
        {
          "text": "Promise him you won't perform invincibility if he promises not to volunteer his body for lazy planning.",
          "effects": [
            {
              "type": "npc",
              "key": "Ben",
              "trust": 0,
              "respect": 0
            },
            {
              "type": "relationship",
              "key": "Ben",
              "delta": 1
            },
            {
              "type": "flag",
              "key": "add_c08_ben_crashmats_choice_4",
              "value": true
            },
            {
              "type": "stat",
              "key": "audacity",
              "delta": 1
            }
          ],
          "timeMinutes": 15,
          "next": "c08_hub_airbase"
        }
      ]
    },
    "add_c08_transit_night": {
      "chapter": 8,
      "title": "Transit Night",
      "location": "Transit Platform",
      "background": "city",
      "focus": "Ensemble",
      "text": [
        "Night at the airbase transit platform feels borrowed. The floodlights hum. The shuttle line glows pale and patient. Beyond the fence, the runway is just a dark strip with occasional sweeps of moving light, as if the day took all the spectacle with it and left the bones behind. Everyone is quieter now, even Piper, though with her quiet still looks like a dare.",
        "The group has spread itself into the little islands people make when a shared event has been too large to metabolize in one room. Ben sits on the low concrete divider with a wrapped forearm and a sandwich he is not eating quickly enough to count as appetite. Jordan leans against the timetable post, reading the whole platform like it personally offended them. Theo is beside the heater tower with two paper cups, one of which is clearly for you if you choose to make that your business. Camille has taken the edge of the platform where she can watch both the shuttle approach line and the people who might pretend they do not need it. Julian is perched on a baggage case he absolutely should not have treated like furniture and is somehow making the whole exhausted scene look almost elegant.",
        "Piper is nearest the fence. Of course she is. She has the posture of someone who has finally stopped moving only because momentum itself got tired.",
        "No one says for a little while what the day was. That is another kind of continuity: knowing enough not to force the obvious.",
        "The shuttle ETA board flicks from seven minutes to six.",
        "Julian breaks first. \"I do think,\" he says, looking at nobody in particular, \"that if we are going to continue doing emotionally ruinous things together, someone should invest in better post-crisis beverages.\"",
        "Ben glances at the paper cup in his hand. \"Harsh. This is a perfectly respectable machine hot chocolate.\"",
        "\"It is tinted despair.\"",
        "Jordan does not look up. \"Those are called flavor notes.\"",
        "A laugh goes around the platform, thin but real.",
        "If the day left people closer, it shows here in who drifts toward whom. If it left a bruise somewhere specific, that shows too.",
        "Theo offers you the second cup without comment. The gesture is small enough to dodge if you want, meaningful enough not to be.",
        "Camille, still at the edge of the platform, says, \"Today clarified several things.\"",
        "Piper snorts. \"You say the hottest possible sentences like they're audit memos.\"",
        "Camille glances back over one shoulder. \"And yet you keep listening.\"",
        "\"Yeah, because sometimes you say terrifyingly useful things in that serial-killer tax-auditor voice.\"",
        "Julian presses one hand dramatically to his chest. \"Please never stop talking to each other. It gives the rest of us texture.\"",
        "That earns another small laugh, even from Theo.",
        "Rina is not with the group. You notice that because everybody notices absences after a day like this. Vance is somewhere farther down the platform with an airbase officer, locked into one of those conversations that are either administrative or life-changing and often both. Kaito is nowhere in sight because this is not his chapter. Rhea is nowhere visible because chapters like this are scary enough without inviting more ghosts in by name. The important thing is the people who are here and the lines the day has tightened between them.",
        "Piper finally pushes off the fence and walks back toward the cluster. \"I hate that I'm saying this,\" she announces, \"but Theo was right about like six things today.\"",
        "Theo blinks. \"That's not a normal amount of things to confess publicly.\"",
        "\"I know. I feel disgusting.\"",
        "\"You should,\" Camille says.",
        "Theo looks at you over the rim of his cup with that helpless little not-smile he gets when he cannot decide whether he is amused or embarrassed to be part of the joke. If you have built something with him, it catches there. If you have built something with Piper, it catches when she shoulders into your space on her way past and doesn't fully leave it. If you have built something with Camille, it catches in the fact that she keeps letting her eyes come back to you when she thinks no one is counting. With Julian it lives in the way he watches you without flattening you, as if the day made you harder to summarize and therefore more worth the trouble.",
        "Ben unwraps his sandwich all the way and points it vaguely at the lot of you. \"Can I say something incredibly sincere and make everyone uncomfortable?\"",
        "\"No,\" Jordan says.",
        "Ben ignores them. \"We're getting kind of bad at pretending we don't care when one of us gets hit.\"",
        "The platform goes still in the quiet human way that follows somebody telling the truth without flourish.",
        "Piper scratches the back of her neck. \"Counterpoint: I'm excellent at pretending.\"",
        "\"No,\" Theo says. \"You're just fast.\"",
        "Julian makes a pleased noise at that, not because it is cruel but because it is correct.",
        "Camille folds her arms tighter. \"Caring is not the operational problem,\" she says. \"The operational problem is what people do because of it.\"",
        "That sentence hangs there because she is right and because none of you are strangers anymore.",
        "You look down the platform, then back at the group. The shuttle lights appear far off, two white points growing cleaner as they approach. Aegis Point waits on the other end with its clean beds, ugly coffee, cameras, med forms, and the exact same people who are standing here now, just with less runway around them.",
        "Jordan finally pockets their phone. \"For the record,\" they say, \"if any of you try to process this entire day by silently staring at walls and then making one cryptic romantic decision, I will become violent.\"",
        "\"That sounds like support,\" Julian says.",
        "\"It is support.\"",
        "The shuttle nears. Doors hiss in preparation before the vehicle even stops. The platform light turns all of you a little paler than you are. Nobody rushes. Nobody hangs back. The choice is subtler than that: who stands nearest whom when there is finally a door home."
      ],
      "choices": [
        {
          "text": "Take Theo's cup, stand nearer to him, and ask what six things Piper admitted he was right about.",
          "effects": [
            {
              "type": "flag",
              "key": "add_c08_transit_night_choice_1",
              "value": true
            },
            {
              "type": "stat",
              "key": "control",
              "delta": 1
            }
          ],
          "timeMinutes": 15,
          "next": "c08_hub_return_transit"
        },
        {
          "text": "Drift to the fence with Piper for the last minute before boarding and let the charged silence say most of the thing.",
          "effects": [
            {
              "type": "flag",
              "key": "add_c08_transit_night_choice_2",
              "value": true
            },
            {
              "type": "stat",
              "key": "restraint",
              "delta": 1
            }
          ],
          "timeMinutes": 15,
          "next": "c08_hub_return_transit"
        },
        {
          "text": "Cross to Camille and ask what, specifically, today clarified for her.",
          "effects": [
            {
              "type": "flag",
              "key": "add_c08_transit_night_choice_3",
              "value": true
            },
            {
              "type": "stat",
              "key": "resolve",
              "delta": 1
            }
          ],
          "timeMinutes": 15,
          "next": "c08_hub_return_transit"
        },
        {
          "text": "Stay by Julian and tell him he was right that surviving beautifully is a dangerous kind of misunderstanding.",
          "effects": [
            {
              "type": "flag",
              "key": "add_c08_transit_night_choice_4",
              "value": true
            },
            {
              "type": "stat",
              "key": "audacity",
              "delta": 1
            }
          ],
          "timeMinutes": 15,
          "next": "c08_hub_return_transit"
        },
        {
          "text": "Stay with the full group and make the choice to belong to the cohort before any one private gravity.",
          "effects": [
            {
              "type": "flag",
              "key": "add_c08_transit_night_choice_5",
              "value": true
            },
            {
              "type": "stat",
              "key": "control",
              "delta": 1
            }
          ],
          "timeMinutes": 15,
          "next": "c08_hub_return_transit"
        }
      ]
    },
    "add_c08_kitchen_reentry": {
      "chapter": 8,
      "title": "Kitchen Reentry",
      "location": "Residence Kitchen",
      "background": "aegis",
      "focus": "Ensemble",
      "text": [
        "By the time the cohort makes it back to the residence kitchen, the fluorescent lights have turned the counters into a low-budget afterlife. Someone has left two cereal boxes open, one upright and one collapsed like a moral lesson. The ice machine hums. The table looks exactly the way it has since the earliest chapters and completely different because of who is around it now.",
        "No one announces the transition from runway to kitchen. That is why it works. Ben drops into a chair like gravity finally submitted the paperwork. Jordan immediately commandeers the good mug without asking. Piper raids the freezer for ice and comes back with half the tray because restraint continues to offend her. Theo checks the med discharge instructions one more time and pretends he is doing anything else. Camille leans against the counter with her arms folded, every inch of her saying she has not relaxed and perhaps never will. Julian opens the fridge, stares inside, and says, \"There is nothing in here that isn't either depressing or aggressively beige.\"",
        "\"That's our brand,\" Piper says around an ice cube.",
        "You move through the kitchen and the room moves around you in answer, not in the dramatic everyone-freezes way, but in the far more important way of tiny adjustments. People making room. People not leaving.",
        "Ben gets the first real bite of his sandwich. \"Wow,\" he says. \"Turns out food works better when you stop pretending it's optional.\"",
        "\"Revolutionary,\" Julian says.",
        "Jordan points the mug at the table. \"Anybody who says the phrase 'we should unpack what happened' gets exiled from the kitchen.\"",
        "\"Thank God,\" Piper says. \"I was going to have to fight Theo.\"",
        "Theo looks up from the instructions. \"Unfair. I would have used a softer phrase.\"",
        "\"You would have said 'contextualize,' which is worse.\"",
        "Camille closes her eyes briefly, either in exhaustion or prayer. \"You're all impossible.\"",
        "\"And yet here you are,\" Julian says.",
        "That lands harder than the joke deserves. Camille opens her eyes and does not answer because there is nothing false in it.",
        "If you have spent chapters building toward one person more than the others, the kitchen lets that show. Not in declarations. In where people stand, who they look for first when a joke lands, who they choose to ask the practical question that is not really practical. The room does not care whether the path is friendship or romance yet. It only cares whether it is honest.",
        "Piper slides the ice tray toward you with one finger. \"Trade offer,\" she says. \"You take these before your face starts lying, and I won't tell anyone you looked terrifyingly noble out there.\"",
        "\"You tell everyone I looked terrifyingly noble.\"",
        "\"That can absolutely be arranged.\"",
        "Theo finally folds the discharge sheet and sets it down. \"She's right about the ice,\" he says. \"Not about the noble part.\"",
        "Julian considers you from across the table. \"Disagree. You did have a sort of expensive ruin to you for thirty full seconds.\"",
        "\"Thirty?\" Camille says. \"You're low.\"",
        "That stops the room because even Camille seems faintly surprised she said it aloud.",
        "Piper recovers first, delighted. \"Oh, huge day for me. Not only am I alive, Fairchild is doing comparative thirst math in the kitchen.\"",
        "Camille takes the mug Jordan just set down, drinks from it without asking, and says, \"You remain exhausting.\"",
        "Jordan, deeply betrayed, says, \"That was my good mug.\"",
        "\"Then protect it better.\"",
        "The laughter this time is easier. Tired. Real. The kind that leaves room for bruises.",
        "The conversation drifts around the day. A detail from the runway. A complaint about command. A joke about the blanket. A correction to the joke. A silence that means more than the correction did.",
        "You can feel the private routes alive under the group shape: Piper's dangerous brightness turned warmer by relief, Camille's attention sharpened by what she saw, Theo's care stripped of some of its protective distance, Julian's reading of you made deeper by the parts of the day nobody else noticed in quite the same way.",
        "Eventually Jordan stands and says, \"I'm going to bed before any of you decide to have a meaningful conversation in front of me.\"",
        "\"That sounds fake,\" Piper says.",
        "\"It is self-defense.\"",
        "Ben pushes his chair back too. Theo gathers the discharge notes with him this time. Julian rinses a glass he never actually used. Camille sets Jordan's mug back on the counter with suspicious care. The room begins to dissolve in the ordinary way rooms do after they have briefly held something important.",
        "At the edge of it, there is always one more decision: who you leave with, who you stop, who you let the night carry a little farther."
      ],
      "choices": [
        {
          "text": "Follow Piper when she peels off from the kitchen and let the chapter end in motion.",
          "effects": [
            {
              "type": "flag",
              "key": "add_c08_kitchen_reentry_choice_1",
              "value": true
            },
            {
              "type": "stat",
              "key": "control",
              "delta": 1
            }
          ],
          "timeMinutes": 15,
          "next": "c08_private_threshold"
        },
        {
          "text": "Stop Camille before she leaves and refuse to let the day close on unfinished precision.",
          "effects": [
            {
              "type": "flag",
              "key": "add_c08_kitchen_reentry_choice_2",
              "value": true
            },
            {
              "type": "stat",
              "key": "restraint",
              "delta": 1
            }
          ],
          "timeMinutes": 15,
          "next": "c08_private_threshold"
        },
        {
          "text": "Ask Theo to walk with you and make the quieter honesty the chapter's final note.",
          "effects": [
            {
              "type": "flag",
              "key": "add_c08_kitchen_reentry_choice_3",
              "value": true
            },
            {
              "type": "stat",
              "key": "resolve",
              "delta": 1
            }
          ],
          "timeMinutes": 15,
          "next": "c08_private_threshold"
        },
        {
          "text": "Catch Julian on his way out and choose the route where wit gives way to something cleaner.",
          "effects": [
            {
              "type": "flag",
              "key": "add_c08_kitchen_reentry_choice_4",
              "value": true
            },
            {
              "type": "stat",
              "key": "audacity",
              "delta": 1
            }
          ],
          "timeMinutes": 15,
          "next": "c08_private_threshold"
        },
        {
          "text": "Stay in the kitchen a minute longer and let the ensemble bond matter before any private branch takes over.",
          "effects": [
            {
              "type": "flag",
              "key": "add_c08_kitchen_reentry_choice_5",
              "value": true
            },
            {
              "type": "stat",
              "key": "control",
              "delta": 1
            }
          ],
          "timeMinutes": 15,
          "next": "c08_private_threshold"
        }
      ]
    },
    "add_c09_camille_service_stair": {
      "chapter": 9,
      "title": "Camille Service Stair",
      "location": "Service Stair Landing",
      "background": "aegis",
      "focus": "Camille",
      "text": [
        "The service stair behind the residence wing is one of Camille's preferred evasions: not hidden enough to be suspicious, not public enough to invite commentary. The building hums through the walls. Somewhere below, a dryer knocks arrhythmically against the universe. Up here there is only clean concrete, a metal rail still warm from daytime heat, and Camille in shirtsleeves with her jacket folded over one arm like she is permitting herself exactly one degree of informality before correcting for it.",
        "She does not start with a greeting. She starts with a document. Of course she does. The page is covered in notes so severe they might qualify as a separate language. Liability clauses, exit triggers, ownership traps, operational definitions of service, supervision, force. The future, translated into the ways other people will try to domesticate it.",
        "\"You were going to sign something badly written tomorrow if I didn't intervene,\" she says.",
        "\"I appreciate the vote of confidence.\" ",
        "\"It isn't about confidence. It's pattern recognition.\" She hands you the marked-up copy. Your fingers brush. Her expression changes only by a fraction, but after months of learning her face that fraction lands like contact. \"You do not consistently mistake danger for permission. You do occasionally mistake urgency for clarity.\" ",
        "The line should annoy you. Instead it sounds alarmingly like care in Camille's accent. Below the stairwell door, voices rise and blur, then fade. The building is full of almost-departures tonight: footsteps pausing outside rooms, doors closing softer than usual, people deciding what kind of courage they can tolerate in themselves after midnight. Camille watches you scan the page, then finally leans one shoulder against the wall beside you.",
        "\"Do you know what Aegis is very good at?\" she asks.",
        "\"Documentation?\" ",
        "\"No. Documentation is a symptom. Aegis is very good at convincing frightened capable people that being legible to power is the same thing as being safe inside it. Sometimes that is true. Often enough to keep the machine moral in its own reflection. Not often enough to relax around it.\" ",
        "The stairwell light is ugly and does her no favors; somehow that makes the moment feel more intimate, not less. There is no performance surface here. No audience. No tactical room-reading to hide inside. Just the fact that she came looking for you with a pen, a warning, and more emotional exposure than she would ever call it by name.",
        "\"Why this one?\" you ask quietly, lifting the contract. \"Why me?\" ",
        "She should have an easy answer. Operational prudence. Team continuity. Future risk mitigation. Instead she goes still in a way that means the easier answers were available and discarded.",
        "\"Because,\" she says, and stops. Starts again. \"Because you are very good at making dangerous futures sound temporary. It would be inconvenient if I let you do that without opposition.\" ",
        "You look back down at the contract and notice where her handwriting changes pressure. The harder lines are not around money or image or authority. They are around autonomy, use of force, ownership, who gets to pull rank when something turns ugly. It is such a Camille distinction that your chest goes tight around it. She is not trying to make the future safe in the childish sense. She is trying to make it difficult for anyone to casually misuse the people inside it.",
        "In Camille language, the sentence is nearly reckless. The silence after it is not awkward. It is precise. It asks what kind of honesty you can stand tonight."
      ],
      "choices": [
        {
          "text": "Tell her she is allowed to call concern by its name, even if only here.",
          "effects": [
            {
              "type": "relationship",
              "key": "Camille",
              "delta": 2
            },
            {
              "type": "flag",
              "key": "c09_camille_named_concern",
              "value": true
            },
            {
              "type": "memory",
              "key": "Camille",
              "text": "You asked her to stop translating care into pure strategy."
            }
          ],
          "next": "c09_walk_piper"
        },
        {
          "text": "Thank her for the contract and the warning, then admit you came because being understood by her matters more than it should.",
          "effects": [
            {
              "type": "relationship",
              "key": "Camille",
              "delta": 2
            },
            {
              "type": "flag",
              "key": "c09_camille_matters",
              "value": true
            },
            {
              "type": "stat",
              "key": "foundationPath",
              "delta": 1
            }
          ],
          "next": "c09_walk_piper"
        },
        {
          "text": "Keep it measured: ask what she would strike first if she were designing a future no one could own.",
          "effects": [
            {
              "type": "relationship",
              "key": "Camille",
              "delta": 1
            },
            {
              "type": "flag",
              "key": "c09_camille_future_design",
              "value": true
            },
            {
              "type": "stat",
              "key": "restraint",
              "delta": 1
            }
          ],
          "next": "c09_walk_piper"
        }
      ]
    },
    "add_c09_julian_packing_show_v2": {
      "chapter": 9,
      "title": "Julian Packing Show V2",
      "location": "Residence Wing / Julian's Room",
      "background": "aegis",
      "focus": "Julian",
      "text": [
        "Julian's room looks less packed than curated, which is exactly what you would expect until you notice the actual tell: the open suitcase is only half full because he has spent the last twenty minutes moving the same three items from one side to the other and calling it discernment. The closet is mostly empty. The bed is neat except for a jacket, a pair of cufflinks, and a stack of shirts that say I am coping magnificently in several fabrics.",
        "\"Come in,\" he says without turning, which means he recognized your footfall or simply assumed the universe would send him an audience before he had to admit he was stalling.",
        "The room still carries traces of his usual defenses: the good cologne on the dresser, the mirror angled to flatter rather than confess, the small disciplined luxuries of someone who understands presentation as both art and armor. Tonight the armor is laid out in pieces.",
        "\"Tell me honestly,\" he says, lifting a charcoal shirt from the chair. \"Does choosing what version of yourself deserves to survive graduation count as growth, or merely vanity with a clipboard?\" ",
        "\"With you? Both.\" ",
        "He laughs, grateful in a way he does not try very hard to hide. The joke leaves a thin clean silence behind it. Outside, the hall carries the muffled rhythm of closing drawers and delayed goodbyes. The whole residence wing sounds like adults pretending to organize objects when the real work is deciding which selves can be carried without rupture.",
        "Julian sits on the edge of the desk instead of the bed. Safer geometry. Less implication. It does nothing to blunt the intimacy. \"I spent a lot of time here learning what kind of visibility felt survivable,\" he says. \"Aegis likes confidence when it photographs well and ambiguity when it can file it under promising but manageable. It has very little patience for a person who is visible on purpose.\" ",
        "\"And what are you on purpose?\" you ask.",
        "\"More than they budgeted for.\" ",
        "It lands with wit first, truth immediately after. You know enough now to hear both. Julian picks up one cufflink, turns it between thumb and forefinger, and smiles without ease. \"I dislike final nights,\" he says. \"They trick people into performing sincerity so aggressively they forget the gentler version exists.\" ",
        "\"There is a gentler version?\" ",
        "\"For a very selective market. You, unfortunately, have become eligible.\" ",
        "The room goes smaller around the sentence. Not cramped. Focused. The distance between you now feels like a decision rather than a measurement. Whatever this has been building toward, it is not abstract anymore.",
        "\"You can laugh,\" he says. \"I will survive it beautifully and complain in private.\" ",
        "There is a version of this conversation he could still turn into theater if he wanted. He could flirt harder, brighten the edges, make the whole thing feel like an exchange of elegant lines between pretty people with time to waste. He doesn't. That restraint does more to reveal him than any confession would. Julian without polish is not less deliberate. He is simply more expensive.",
        "The fact that he offers you the exit so elegantly is almost worse than if he demanded an answer."
      ],
      "choices": [
        {
          "text": "Cross the room and tell him gentleness suits him better than he thinks.",
          "effects": [
            {
              "type": "relationship",
              "key": "Julian",
              "delta": 2
            },
            {
              "type": "flag",
              "key": "c09_julian_gentleness",
              "value": true
            },
            {
              "type": "memory",
              "key": "Julian",
              "text": "You met his polish with tenderness instead of applause."
            }
          ],
          "next": "c09_last_private_moments"
        },
        {
          "text": "Tell him visibility is easier when someone in the room understands the trick and stays anyway.",
          "effects": [
            {
              "type": "relationship",
              "key": "Julian",
              "delta": 2
            },
            {
              "type": "flag",
              "key": "c09_julian_stayed_anyway",
              "value": true
            },
            {
              "type": "stat",
              "key": "independentPath",
              "delta": 1
            }
          ],
          "next": "c09_last_private_moments"
        },
        {
          "text": "Keep the tone bright and ask which shirt says heartbreak with administrative viability.",
          "effects": [
            {
              "type": "relationship",
              "key": "Julian",
              "delta": 1
            },
            {
              "type": "flag",
              "key": "c09_julian_bright_deflection",
              "value": true
            },
            {
              "type": "stat",
              "key": "audacity",
              "delta": 1
            }
          ],
          "next": "c09_last_private_moments"
        }
      ]
    },
    "add_c09_theo_archive_walk": {
      "chapter": 9,
      "title": "Theo Archive Walk",
      "location": "Archive Walkway",
      "background": "aegis",
      "focus": "Theo",
      "text": [
        "Theo is harder to find tonight because he is trying not to be found by the version of himself that wants one more spreadsheet. You locate him on the archive walkway between the records annex and the old lecture wing, standing at the glass with no tablet, no printouts, no list in his hand. The absence is so unusual it reads louder than panic.",
        "The campus lights silver the windows. Below, security carts hum past on quiet wheels. The whole place looks briefly harmless, which is its own kind of lie.",
        "\"I left the tablet in my room on purpose,\" he says before you can ask. \"I need credit for that.\" ",
        "\"You get partial credit. I can see you mentally formatting three columns right now.\" ",
        "\"Only three? That's generous.\" His mouth twitches. \"If I touched the tablet tonight, I was going to build one last model for tomorrow and then another one for the month after and then I was going to convince myself that thinking hard enough could eliminate all forms of grief.\" ",
        "\"Can it?\" ",
        "\"No. It can make grief look busy. Different skill.\" ",
        "You stop beside him at the window. The glass reflects the two of you back at yourselves: older than intake, more worn, somehow more recognizable. Theo folds his arms, then makes himself uncross them. Tiny acts of honesty are still acts of honesty.",
        "\"I've been trying to figure out which version of this is the dangerous one,\" he says quietly. \"Leaving, I mean. Staying would have been one kind of risk. Leaving is another. Building anything with people you care about is another. Pretending not to care is usually the worst one, but it comes with very clean paperwork.\" ",
        "There is no joke in it. Not because Theo cannot make one. Because he has decided not to hide inside one right now.",
        "\"Do you know what annoys me about you?\" he asks.",
        "\"This seems promising.\" ",
        "\"You make some decisions like you understand exactly how expensive they are, and then you make others like cost is just a rumor told by frightened people. I never know which version is coming until after I've already cared what happens to you.\" ",
        "The sentence lands like a confession that got dressed as irritation at the last second. Theo looks back and does not look away. Months ago he would have. Weeks ago he might have. Tonight he holds eye contact like he has calculated the risk and decided the alternative was worse.",
        "The walkway glass gives the campus back to you in reflection, and for one odd second you can see the entire arc in Theo's posture: the first-day caution, the middle-chapter frustration, the earned steadiness. He has not become less afraid. He has become less willing to let fear outsource his decisions. It makes the honesty in front of you feel larger, not because it is dramatic, but because it has been paid for slowly.",
        "\"I don't want to be useful to you only as a warning system,\" he says. \"I know that's part of what I am in this group. I'm good at it. But if that's all I am to you, tell me before tomorrow and let me have the dignity of being embarrassed once instead of repeatedly.\" "
      ],
      "choices": [
        {
          "text": "Tell him he was never only useful, and name one thing about him that changed you.",
          "effects": [
            {
              "type": "relationship",
              "key": "Theo",
              "delta": 2
            },
            {
              "type": "flag",
              "key": "c09_theo_changed_me",
              "value": true
            },
            {
              "type": "memory",
              "key": "Theo",
              "text": "You answered his fear with specificity instead of reassurance fog."
            }
          ],
          "next": "c09_last_private_moments"
        },
        {
          "text": "Admit you lean on him because you trust him, then ask what he wants to be besides careful.",
          "effects": [
            {
              "type": "relationship",
              "key": "Theo",
              "delta": 2
            },
            {
              "type": "flag",
              "key": "c09_theo_besides_careful",
              "value": true
            },
            {
              "type": "stat",
              "key": "contractorPath",
              "delta": 1
            }
          ],
          "next": "c09_last_private_moments"
        },
        {
          "text": "Keep it lighter: tell him partial credit is still statistically significant progress.",
          "effects": [
            {
              "type": "relationship",
              "key": "Theo",
              "delta": 1
            },
            {
              "type": "flag",
              "key": "c09_theo_partial_credit",
              "value": true
            },
            {
              "type": "stat",
              "key": "restraint",
              "delta": 1
            }
          ],
          "next": "c09_last_private_moments"
        }
      ]
    },
    "add_c09_piper_rooftop_long": {
      "chapter": 9,
      "title": "Piper Rooftop Long",
      "location": "Residence Rooftop",
      "background": "aegis",
      "focus": "Piper",
      "text": [
        "The roof has learned the shape of both of you. Same wind, same fenced edge, same city flattening itself into light beyond Blackwater as if distance could make any of it less complicated. Piper is already there with two cans balanced on the ledge and her jacket half off one shoulder, looking like motion paused by force instead of choice.",
        "\"You took forever,\" she says, which in Piper language can mean seconds, days, or emotional cowardice depending on tone. Tonight it means all three a little.",
        "Below, the campus paths glow in short institutional lines, the kind meant to imply safety while quietly demonstrating surveillance. Up here, the cameras are fewer, the air is cleaner, and every conversation feels half a degree more honest because nobody can pretend they ended up on a roof by accident.",
        "Piper knocks her shoulder into yours. Softly. Checking for solidity. \"Tomorrow they clap,\" she says. \"Then everybody acts like the weird part is over. As if getting stronger in public is somehow the normal half of this story.\" ",
        "\"You hate ceremonies.\" ",
        "\"I hate sanctioned narratives. Ceremonies are just sanctioned narratives with folding chairs.\" ",
        "The line buys her a few seconds, no more. You know her too well now. The joke is bright. The fear under it is brighter.",
        "\"I keep thinking about the first day,\" she says. \"You walking into intake like the building had insulted you personally. You had that look people get when they know they are in the right place and still resent being right.\" ",
        "You laugh. Piper smiles, pleased. \"See? It was a great face. Very stealable. Then you kept being...\" She gestures, searching. \"Annoying. In ways that became expensive.\" ",
        "\"That is not a compliment.\" ",
        "\"It is from me. Most people flatten out once you can predict them. You didn't. Even when I thought I had you, you kept picking weirdly decent options at the worst possible times. Or bad options for excellent reasons. Which is honestly worse, because it gets under the skin.\" ",
        "The roof wind presses your shirt against your ribs. Somewhere below, someone opens the stair door, hears voices, and decides not to interrupt. Piper waits. She can be patient when it matters. That might be the most dangerous thing about her.",
        "\"I know what everybody thinks we are,\" she says eventually. \"Or might be. Or have almost been for six straight chapters of emotional incompetence.\" ",
        "You turn your head. She is smiling again, but this time the smile is a blade she is holding by the right end.",
        "\"I'm serious,\" she says. \"I can do jokes all night, but I'm too tired to pretend I don't want an answer to the real version. Tomorrow changes who gets to assume things about us. I would prefer to get there first.\" ",
        "There it is. No speed to hide in. No mission to use as cover. Just Piper, the city, the roof, and the fact that some feelings become insulting if you keep calling them momentum.",
        "\"If you want this to be a thrill with great chemistry and terrible planning, say that. If you want friendship with reckless paperwork and no heartbreak, say that. If you want the version where I actually let it matter, then don't make me infer it from exit routes.\" ",
        "She reaches for the can again and misses it slightly before correcting. Anyone else would not notice. You do, because Piper's body has always been too exact for clumsy motion to mean nothing. The fear is real then, unmistakably. Not fear of you. Fear of naming something and having the naming make it vulnerable to daylight. Piper, who would rather hit a wall at Mach speed than stand still long enough to be interpreted, is giving you stillness on purpose.",
        "Nothing about the ask is casual. Nothing about it is manipulative either. She is not cornering you. She is refusing to run a half-truth into graduation because speed made it easy. It is one of the bravest things you have ever seen her do."
      ],
      "choices": [
        {
          "text": "Tell her you do not want to infer anything anymore, then choose her clearly.",
          "effects": [
            {
              "type": "relationship",
              "key": "Piper",
              "delta": 3
            },
            {
              "type": "flag",
              "key": "piperCommitted",
              "value": true
            },
            {
              "type": "memory",
              "key": "Piper",
              "text": "On the roof, you answered her directly instead of hiding in momentum."
            }
          ],
          "next": "c09_plan_reveal"
        },
        {
          "text": "Tell her she is one of your people no matter what, even if the exact shape still scares you.",
          "effects": [
            {
              "type": "relationship",
              "key": "Piper",
              "delta": 2
            },
            {
              "type": "flag",
              "key": "piperFuturePromise",
              "value": true
            },
            {
              "type": "memory",
              "key": "Piper",
              "text": "You promised her loyalty even while naming your uncertainty."
            }
          ],
          "next": "c09_plan_reveal"
        },
        {
          "text": "Tell her the truth: the feeling is real, but you refuse to lie about how complicated the future is.",
          "effects": [
            {
              "type": "relationship",
              "key": "Piper",
              "delta": 2
            },
            {
              "type": "flag",
              "key": "piperComplicatedTruth",
              "value": true
            },
            {
              "type": "stat",
              "key": "resolve",
              "delta": 1
            }
          ],
          "next": "c09_plan_reveal"
        }
      ]
    },
    "add_c09_ben_cafeteria_last_plate": {
      "chapter": 9,
      "title": "Ben Cafeteria Last Plate",
      "location": "Cafeteria After Close",
      "background": "aegis",
      "focus": "Ben",
      "text": [
        "The cafeteria after close is uglier and more honest than it ever is during service. Chairs are upside down on half the tables. The lights are dimmed just enough to admit that the room is mostly utilitarian. Ben is at the counter with a bowl the size of a moral event and a face that says he was aiming for private time, not secrecy.",
        "\"Before you say anything, this is strategic nutrition,\" he says. \"Not emotional support pasta.\" ",
        "\"Those seem compatible.\" ",
        "\"That's because you're intelligent.\" He nudges the extra fork your way with a look that pretends not to be grateful. Ben has always done that: offers help like it is casual, receives it like he is trying not to make it work for you.",
        "For a minute you just eat. It is a relief. Not every important scene needs to announce itself with choreography.",
        "\"You know what I hated most about this place at first?\" he asks. \"How fast everybody gets assigned a function. Tank. Asset. Risk. Pretty one. Smart one. Fast one. Problem. Like if they can name the shape, they don't have to think about the person inside it.\" ",
        "You say nothing. Ben doesn't need prompting tonight. He needs witness.",
        "\"I let them do it to me because I was good at the part they handed over,\" he says. \"Still am. But being good at carrying weight makes people weirdly comfortable forgetting to ask if you wanted it. You've been better than most about that. Just so you know.\" ",
        "The compliment lands harder than he intends. Ben notices and gives you an apologetic grimace for accidentally being sincere.",
        "\"Anyway,\" he says, recovering poorly, \"tomorrow I graduate and either become a responsible adult with a contract or continue making choices that concern Vance on a spiritual level. Feels important to eat carbs before that.\" "
      ],
      "choices": [
        {
          "text": "Tell him you noticed how often people leaned on him without asking, and you do not plan to be one more person who does that.",
          "effects": [
            {
              "type": "relationship",
              "key": "Ben",
              "delta": 2
            },
            {
              "type": "flag",
              "key": "c09_ben_seen",
              "value": true
            }
          ],
          "next": "c09_hub_return_cafeteria"
        },
        {
          "text": "Ask him what he wants when no one is asking what he can carry.",
          "effects": [
            {
              "type": "relationship",
              "key": "Ben",
              "delta": 2
            },
            {
              "type": "flag",
              "key": "c09_ben_asked_want",
              "value": true
            }
          ],
          "next": "c09_hub_return_cafeteria"
        },
        {
          "text": "Keep him company, eat the pasta, and let that count as respect without making him perform a revelation for it.",
          "effects": [
            {
              "type": "relationship",
              "key": "Ben",
              "delta": 1
            },
            {
              "type": "flag",
              "key": "c09_ben_quiet_company",
              "value": true
            }
          ],
          "next": "c09_hub_return_cafeteria"
        }
      ]
    },
    "add_c09_jordan_lounge_truth": {
      "chapter": 9,
      "title": "Jordan Lounge Truth",
      "location": "Common Lounge",
      "background": "aegis",
      "focus": "Jordan",
      "text": [
        "Jordan has colonized one corner of the common lounge with a blanket, two chargers, three rumor threads, and a bowl of candy of suspicious origin. The television is on mute with captions running under a local story nobody in the room is actually watching. Jordan looks up when you enter and gives you the expression they reserve for situations likely to become honest against everyone's better judgment.",
        "\"You look like someone making decisions with real-world consequences,\" they say. \"Disgusting. Sit down.\" ",
        "You do. The couch gives a tired squeak under your weight. Around the room, fragments of last-night energy keep flickering in and out: somebody laughing too hard near the vending machine, a door shutting upstairs, the distant hiss of a shower. Aegis sounds like a dorm again for maybe the last time.",
        "Jordan sets the phone facedown. \"This is the weirdest part of group dynamics,\" they say. \"The second everyone starts leaving, all the fake categories get louder before they die. Who mattered. Who was obvious. Who everyone thought would happen. Who didn't. Who never said anything and still somehow changed the room.\" ",
        "\"You make that sound less than healthy.\" ",
        "\"Oh, it is deeply unhealthy. I'm not endorsing it. I'm curating around it.\" Their grin softens. \"I'm telling you because people are already writing the summary version in their heads, and summary versions are where everyone gets flattened into the role that made other people comfortable.\" ",
        "Jordan leans back, studies you without cruelty, and adds, \"You don't actually belong in a summary. Which is great for you and terrible for anyone trying to keep score.\" ",
        "\"So what's the warning?\" you ask.",
        "\"Don't leave here by accident,\" they say immediately. \"Not emotionally. Not narratively. If there's something you mean to say to one of them, say it before distance turns everybody noble and stupid. Friendship counts, by the way. People forget that because romance photographs better.\" ",
        "They nudge the candy bowl toward you. \"Also, if you hurt any of my favorites in a way I could have forecast from body language alone, I reserve the right to become artistically unbearable about it.\" "
      ],
      "choices": [
        {
          "text": "Tell them they are insufferable and right, then ask which silence looks most dangerous from where they are sitting.",
          "effects": [
            {
              "type": "relationship",
              "key": "Jordan",
              "delta": 2
            },
            {
              "type": "flag",
              "key": "c09_jordan_named_silence",
              "value": true
            }
          ],
          "next": "c09_hub_return_lounge"
        },
        {
          "text": "Ask whether they think friendship survives graduation better than tension does.",
          "effects": [
            {
              "type": "relationship",
              "key": "Jordan",
              "delta": 2
            },
            {
              "type": "flag",
              "key": "c09_jordan_friendship_question",
              "value": true
            }
          ],
          "next": "c09_hub_return_lounge"
        },
        {
          "text": "Take the candy, tell them summary versions were never your plan, and leave it there.",
          "effects": [
            {
              "type": "relationship",
              "key": "Jordan",
              "delta": 1
            },
            {
              "type": "flag",
              "key": "c09_jordan_no_summary",
              "value": true
            }
          ],
          "next": "c09_hub_return_lounge"
        }
      ]
    },
    "add_c09_vance_campus_walk_v2": {
      "chapter": 9,
      "title": "Vance Campus Walk V2",
      "location": "Campus Path",
      "background": "aegis",
      "focus": "Vance",
      "text": [
        "Vance does not knock on doors this late unless somebody is dying or graduating. Tonight, mercifully, it is the second one. He catches you on the campus path with his hands in his coat pockets and the posture of a man trying very hard not to let a conversation sound like a ceremony.",
        "\"Walk,\" he says, which is how Vance offers privacy to people he respects.",
        "The path lights throw long bars across the concrete. Beyond the fence, Blackwater glows with the false confidence of a city that assumes it can absorb whatever comes out of Aegis as long as the paperwork is convincing.",
        "For a while Vance says nothing. He has always been better than most authority figures at letting silence do some of the work without turning it into a test. When he finally speaks, it is with the bluntness he uses when pretending not to care would be insulting.",
        "\"You caused more paperwork than average,\" he says. \"This is not automatically criticism.\" ",
        "\"I feel deeply affirmed.\" ",
        "\"Don't ruin the moment. You came in like a hazard profile with opinions. You're leaving like someone who understands that power is only half the problem. The other half is what story you build around using it.\" ",
        "The night air is cold enough to keep everyone honest. Vance watches the path ahead instead of you. Safer for both of you that way.",
        "\"Aegis does not produce good people,\" he says. \"It produces supervised outcomes. Sometimes those overlap. Sometimes they don't. I don't get to certify your character tomorrow. I get to certify your preparedness and hope the first one has kept up.\" ",
        "\"Do you think it did?\" you ask.",
        "\"Most days,\" he says too fast for performance. \"And when it didn't, you usually had the decency to let the consequences teach you something.\" ",
        "It is almost praise. From Vance, almost praise can rearrange a person's week.",
        "\"You don't owe the institution devotion,\" he says at last. \"You do owe whatever comes next your full attention. A lot of talented people mistake the first rebellion after graduation for freedom. It isn't. It's just another way to be led around by what you hate.\" "
      ],
      "choices": [
        {
          "text": "Tell him you heard the warning, and ask what he would call success if paperwork were not allowed to answer first.",
          "effects": [
            {
              "type": "relationship",
              "key": "Vance",
              "delta": 2
            },
            {
              "type": "flag",
              "key": "c09_vance_success_question",
              "value": true
            }
          ],
          "next": "c09_hub_graduation_eve"
        },
        {
          "text": "Thank him without dressing it up. Say he mattered, even when he was being impossible on purpose.",
          "effects": [
            {
              "type": "relationship",
              "key": "Vance",
              "delta": 2
            },
            {
              "type": "flag",
              "key": "c09_vance_mattered",
              "value": true
            }
          ],
          "next": "c09_hub_graduation_eve"
        },
        {
          "text": "Deflect with humor, but promise him one thing: you are not leaving here asleep at the wheel.",
          "effects": [
            {
              "type": "relationship",
              "key": "Vance",
              "delta": 1
            },
            {
              "type": "flag",
              "key": "c09_vance_not_asleep",
              "value": true
            }
          ],
          "next": "c09_hub_graduation_eve"
        }
      ]
    },
    "add_c09_med_night_scan": {
      "chapter": 9,
      "title": "Med Night Scan",
      "location": "Medical Night Desk",
      "background": "aegis",
      "focus": "Seth",
      "text": [
        "The med wing at night is all soft light and terrible truths. Daytime makes the place look procedural. Night makes it look intimate by force. A nurse at the front desk nods you through without commentary; by Chapter Nine, even your bad ideas have established precedent.",
        "The scan room is half-dark except for the monitor glow and the blue-white strip over the sink. You sit on the exam table in a paper gown that does absolutely nothing for dignity and wait for the machine to finish translating your recent life into visible damage. The room hums. Your pulse answers. Somewhere outside, a cart wheel catches on a seam in the floor and thumps twice before moving on.",
        "When the technician leaves you alone with the printout for a minute, you make the mistake of looking too hard. Stress markers. Healing lag. microtears that never quite got the memo about rest. A body that adapted because it had to, not because adaptation was clean.",
        "There is something clarifying about seeing consequence in grayscale. The story in your head is always more flattering. The body keeps more accurate minutes.",
        "You think about the first day you ended up here because your power wanted too much from ordinary life. You think about the people who saw it happen, the ones who kept seeing after that, the ones who learned the difference between you being dangerous and you being scared. The distinction matters more tonight because tomorrow you stop having an institution whose job includes noticing whether your hands shake after impact.",
        "The door opens softly. Maybe it is a medic. Maybe, if certain flags are live, it is one of the people who has learned the sound of your bad silence. Either way, the moment does not let you pretend your body is only an instrument. It is also the archive of every cost you chose and every cost you misjudged.",
        "You look down at the printout again. Not with self-pity. With the steadier dread of understanding that power always asks for an accountant eventually. The thought should push you toward caution. Somehow it also makes you fiercer about not spending yourself stupidly on futures that do not deserve the bill.",
        "When you dress again, slower than usual, it occurs to you that this is one of the last rooms in Aegis where nobody expects you to posture. There is a kind of mercy in that. There is also a kind of grief."
      ],
      "choices": [
        {
          "text": "Pocket the printout. If the body kept score, you are allowed to read the ledger and still choose the future anyway.",
          "effects": [
            {
              "type": "flag",
              "key": "c09_kept_scan_printout",
              "value": true
            },
            {
              "type": "stat",
              "key": "resolve",
              "delta": 1
            }
          ],
          "next": "c09_hub_graduation_eve"
        },
        {
          "text": "Leave the printout on the tray. You already know enough to carry; tonight you would rather carry people.",
          "effects": [
            {
              "type": "flag",
              "key": "c09_left_scan_printout",
              "value": true
            },
            {
              "type": "stat",
              "key": "restraint",
              "delta": 1
            }
          ],
          "next": "c09_hub_graduation_eve"
        },
        {
          "text": "Ask for a copy and then laugh at yourself for pretending that data has ever stopped you from feeling things anyway.",
          "effects": [
            {
              "type": "flag",
              "key": "c09_laughed_in_med",
              "value": true
            },
            {
              "type": "stat",
              "key": "control",
              "delta": 1
            }
          ],
          "next": "c09_hub_graduation_eve"
        }
      ]
    },
    "add_c09_rina_gallery_exit": {
      "chapter": 9,
      "title": "Rina Gallery Exit",
      "location": "Training Gallery",
      "background": "aegis",
      "focus": "Rina",
      "text": [
        "The training gallery smells like rubber, chalk, and old frustration. Rina is there because of course she is. Not training exactly. Standing in the half-dark with her hands in the pockets of her jacket, staring down at the empty floor like she intends to win one final argument against gravity before graduation.",
        "\"Relax. I'm not challenge-running the facility for sentimental reasons,\" she says when she hears you approach.",
        "\"Shame. That seemed healthy.\" ",
        "\"For me? Deeply.\" Her mouth twitches. Rina at peace still looks like a woman considering whether peace counts as surrender. \"I just wanted to see the room without everyone in it. Figure out which parts of me only exist because somebody else was standing over there being infuriating.\" ",
        "It is almost a compliment. From Rina, that counts. You lean on the rail beside her. The floor below is marked with old scuffs and repaired seams, the kind of evidence institutions keep sanding down without ever fully erasing.",
        "\"You know what I appreciated about you?\" she asks. \"You got more annoying as you got better. That's integrity. Most people become bland once they start winning. You just became more specifically yourself.\" ",
        "\"That might be the worst nice thing anyone has said to me.\" ",
        "\"You're welcome.\" She tips her chin toward the floor. \"Tomorrow everybody gets sorted into paths and contracts and whatever noble language they use now. Just don't get boring because someone offered you authority with dental.\" ",
        "It is exactly the kind of send-off only Rina would give: half a threat, half an endorsement, all edge."
      ],
      "choices": [
        {
          "text": "Tell her boredom was never the risk, but selling out might be.",
          "effects": [
            {
              "type": "relationship",
              "key": "Rina",
              "delta": 2
            },
            {
              "type": "flag",
              "key": "c09_rina_sellout",
              "value": true
            }
          ],
          "next": "c09_hub_graduation_eve"
        },
        {
          "text": "Ask whether she is actually going to miss having someone worth racing against.",
          "effects": [
            {
              "type": "relationship",
              "key": "Rina",
              "delta": 2
            },
            {
              "type": "flag",
              "key": "c09_rina_rivalry_honest",
              "value": true
            }
          ],
          "next": "c09_hub_graduation_eve"
        },
        {
          "text": "Leave it at mutual respect. Sometimes not ruining the tone is the right move.",
          "effects": [
            {
              "type": "relationship",
              "key": "Rina",
              "delta": 1
            },
            {
              "type": "flag",
              "key": "c09_rina_clean_exit",
              "value": true
            }
          ],
          "next": "c09_hub_graduation_eve"
        }
      ]
    },
    "add_c10_vance_admin_corridor": {
      "chapter": 10,
      "title": "Vance, Before The Microphone",
      "location": "Admin Wing Corridor",
      "background": "aegis",
      "focus": "Vance",
      "text": [
        "The admin corridor behind Graduation Hall smells like toner, old carpeting, and the last clean hour before an institution starts congratulating itself aloud. Vance is standing under a wall clock that has been three minutes fast since intake week, jacket on, collar straight, folder tucked under his arm in exactly the same way he has carried bad news, field authorizations, and disciplinary patience for months. The corridor is busy around him in the way a command center is busy when everyone has been ordered to look calm for civilians. Staff pass, lower their voices when they notice you, then keep moving.",
        "He watches them go before he looks at you properly. \"You clean up well,\" he says, which in anyone else's mouth would be a joke and in his lands as a field observation with suspicious traces of approval.",
        "\"That your official evaluation?\"",
        "\"No. The official evaluation is longer, uglier, and contains at least one sentence an attorney insisted was humane.\" He shifts the folder under his arm. \"This is the unofficial one. You made it. You made it with fewer catastrophes than the predictive models preferred. Do not get sentimental about that. The models are cowards.\"",
        "It would be easy for the scene to settle into commandant-and-trainee ritual. Vance does not let it. He glances down the corridor to make sure no one actually needs him for thirty seconds and then lowers his voice by a degree. \"You're not walking into a clean future. None of you are. What Aegis gives people at graduation is a certificate, a classification, and a dangerous amount of confidence in bureaucratic language. The language matters. It also fails under pressure. Remember the difference.\"",
        "This is the closest he ever comes to speaking like the man under the office. You have seen pieces of that man all year: in med bays after nights that ran too hot, in field debriefs when the report did not match the blood on the floor, in the moments where he let competence become care for exactly three seconds before locking it back under policy. Today the lock is looser. Not gone. Looser.",
        "\"You had opinions about me on day one,\" you say.",
        "\"I had contingency models,\" he says.",
        "\"That's a yes.\"",
        "\"You were volatile, smart, badly inclined to treat fear like an insult, and significantly more teachable than you wanted anyone to know.\" His mouth almost shifts. Almost. \"You are still at least three of those things. I consider the surviving percentage acceptable.\"",
        "The hallway hums around you. Somewhere through the doors, the first notes of soundcheck bleed faintly into the corridor and vanish. Vance follows the sound with his eyes and then comes back to you. \"Whatever path you choose after today, choose it as a person, not as a reaction. A lot of gifted people ruin their lives by letting the wrong institution define the size of their rebellion.\" He lets that sit. \"And if you decide to make my life administratively impossible, at least do it competently.\""
      ],
      "choices": [
        {
          "text": "Tell him you learned more from the moments Aegis failed cleanly than from the speeches where it pretended not to fail at all.",
          "effects": [
            {
              "type": "relationship",
              "key": "Vance",
              "delta": 2
            },
            {
              "type": "flag",
              "key": "add_c10_vance_admin_corridor_1",
              "value": true
            }
          ],
          "next": "c10_hub_return_admin"
        },
        {
          "text": "Ask whether this is his version of being proud of you, because his customer service voice could use work.",
          "effects": [
            {
              "type": "relationship",
              "key": "Vance",
              "delta": 1
            },
            {
              "type": "flag",
              "key": "add_c10_vance_admin_corridor_2",
              "value": true
            }
          ],
          "next": "c10_hub_return_admin"
        },
        {
          "text": "Thank him without making a joke out of it.",
          "effects": [
            {
              "type": "relationship",
              "key": "Vance",
              "delta": 2
            },
            {
              "type": "flag",
              "key": "add_c10_vance_admin_corridor_3",
              "value": true
            }
          ],
          "next": "c10_hub_return_admin"
        }
      ]
    },
    "add_c10_piper_side_door_v2": {
      "chapter": 10,
      "title": "Piper, Last Door V2",
      "location": "Graduation Hall Side Door",
      "background": "graduation",
      "focus": "Piper",
      "text": [
        "Piper is exactly where the building's emotional fire code would predict: half hidden beside the side door to Graduation Hall, one shoulder against the frame, program folded into quarters and then eighths and then a shape no longer pretending to be paper. The door behind her opens into service stairs and clean escape velocity. The hall beyond it is filling with family, officials, staff, and enough polished shoes to make a person with good instincts look for sabotage.",
        "She tracks you coming and tries for a grin before her face decides honesty is faster. \"Tell me this whole thing doesn't feel like a trap built by tasteful people,\" she says.",
        "\"Only tasteful on a technicality.\"",
        "\"Good. I needed at least one witness.\" She flicks the ruined program against your arm and then stills, gaze dropping just long enough to take inventory in the way she only does when she is actually worried. The habit would have looked casual months ago. It doesn't now. You know what she is checking for: sleep, bruising, whether you are wound too tight, whether today is hitting the parts of you that make power louder instead of cleaner.",
        "The side door window throws a strip of light across the floor between you. Through the glass you can see pieces of the hall: rows of chairs, floral arrangements Aegis absolutely overpaid for, the stage where Vance will soon say words like responsibility and integration and operational trust in a tone that will make half the crowd emotional by accident. Piper follows your glance and rolls her eyes hard enough to count as cardio.",
        "\"I know,\" she says. \"If any sentence starts with operational today, I'm leaving through this door and you can either come with me or become a cautionary tale about loyalty.\"",
        "\"That serious?\"",
        "She exhales through her nose. \"Annoyingly. Not because of the ceremony. Because endings make people weird. Because choices become real when there are witnesses. Because if I joke at exactly the right speed I can almost pretend today is just another threshold and not the one where everybody stops hiding what they want out of next.\"",
        "There it is. Not a confession, exactly. Piper does not hand those over wrapped and labeled unless the world is on fire. But it is closer than she would have let herself get at the beginning. The whole year with her has been like this: humor as velocity, honesty as something she catches only at the last possible second and decides whether to throw, pocket, or let hit the floor. Today she is tired enough, or brave enough, to let some of it land.",
        "\"You looked for me first,\" she says suddenly.",
        "\"You were at the exit.\"",
        "\"Deflection noted. Not accepted.\" Her voice softens before she can stop it. \"You looked for me first.\"",
        "The sentence is not about logistics and both of you know it. Whatever has been building between you - friendship sharpened to loyalty, attraction sharpened to danger, the possibility of something steadier than either of you trusted early on - it is standing in the doorway with you now. Piper leans her head back against the frame and laughs once without humor. \"I hate being easy to read. You're rude for learning the language.\"",
        "You could keep this playful. You could keep it survivable. You could also decide that on the morning everything becomes official, she deserves an answer not built entirely out of evasive charm."
      ],
      "choices": [
        {
          "text": "Tell her you looked for her first because some part of you has been orienting toward her for a while now.",
          "effects": [
            {
              "type": "relationship",
              "key": "Piper",
              "delta": 2
            },
            {
              "type": "flag",
              "key": "add_c10_piper_side_door_v2_1",
              "value": true
            }
          ],
          "next": "c10_hub_return_hall"
        },
        {
          "text": "Tell her the exit thing is annoyingly charming, but the real reason is that she makes hard days feel possible instead of merely survivable.",
          "effects": [
            {
              "type": "relationship",
              "key": "Piper",
              "delta": 2
            },
            {
              "type": "flag",
              "key": "add_c10_piper_side_door_v2_2",
              "value": true
            }
          ],
          "next": "c10_hub_return_hall"
        },
        {
          "text": "Keep it light on purpose: tell her if she bolts, you're at least stealing one of the expensive centerpieces on the way out.",
          "effects": [
            {
              "type": "relationship",
              "key": "Piper",
              "delta": 1
            },
            {
              "type": "flag",
              "key": "add_c10_piper_side_door_v2_3",
              "value": true
            }
          ],
          "next": "c10_hub_return_hall"
        }
      ]
    },
    "add_c10_camille_courtyard_honesty_v2": {
      "chapter": 10,
      "title": "Camille, Unsupervised Honesty V2",
      "location": "Courtyard Shade Rail",
      "background": "aegis",
      "focus": "Camille",
      "text": [
        "Camille is standing at the far courtyard rail where the ocean is visible between two decorative pines that have somehow survived years of sea wind and institutional landscaping. The view is almost offensively pretty. She does not look at it like a person enjoying scenery. She looks at it like a strategist using depth to think. Her jacket is folded over the rail, sleeves of her shirt rolled once, graduation folder tucked under one arm beneath a marked-up copy of something with enough red ink on it to suggest either legal review or personal offense.",
        "She hears you before you stop beside her. \"You took longer than I expected,\" she says.",
        "\"Good morning to you too.\"",
        "\"That was good morning. My usual version has less patience and worse posture.\" She glances at you then, quick and exact, and the severity softens by a degree that would be invisible to anyone who has not spent months earning the right to notice it. \"You look awake. I didn't know whether to classify that as discipline or malpractice.\"",
        "The ocean beyond the wall keeps throwing white light into the rail. Everything about the morning is brighter than the emotional reality deserves. Camille folds the paperwork once, aligning the corners with unnecessary precision, then sets it aside. That gesture by itself is intimate in her vocabulary. Choosing not to hold a task between herself and another person is practically a confession.",
        "\"I have revised three of the contractor clauses they plan to hand out after the speeches,\" she says. \"Two of the hero-track waivers. And one sponsorship packet that should probably be prosecuted on aesthetic grounds alone.\"",
        "\"You did legal triage before breakfast?\"",
        "\"No. During.\" The corner of her mouth threatens an expression and decides against it. \"You all keep mistaking graduation for release. It is negotiation. Some of you are going to need help remembering that when flattery gets expensive.\"",
        "It is a warning shaped exactly like care. She knows it. You know it. The honesty sits there between you with no decorative wrapping. Camille rests both hands on the rail and looks out over the water long enough to make the next sentence a decision instead of a reflex. \"I dislike preventable damage,\" she says. \"That includes contractual damage, reputational damage, and the kind caused by people agreeing to futures because someone said the word honor in a handsome room.\"",
        "\"And me specifically?\"",
        "Her answer is immediate enough to feel involuntary. \"You specifically are at risk of mistaking capability for insulation.\" She turns then, fully, which she does only when she intends not to hide behind the view. \"That is not criticism. It is a logistical concern.\"",
        "The line should be clinical. Instead it lands under your ribs. This has always been the strange, dangerous pleasure of Camille: the way her precision lets feeling arrive without dilution. If she wants you, she wants you on purpose. If she worries about you, the worry has already survived argument. If she trusts you, it is because the evidence held under pressure.",
        "Today she is not asking for evidence. She is offering something rarer: unsupervised honesty before the machinery starts moving again. The courtyard buzzes in the distance with people arranging chairs and pretending the future is procedural. Here, by the rail, the atmosphere narrows to the size of one decision and one woman who will not let you pretend not to understand it."
      ],
      "choices": [
        {
          "text": "Tell her you are not asking for safety from her. You are asking whether she intends to stay within reach when this becomes complicated.",
          "effects": [
            {
              "type": "relationship",
              "key": "Camille",
              "delta": 2
            },
            {
              "type": "flag",
              "key": "add_c10_camille_courtyard_honesty_v2_1",
              "value": true
            }
          ],
          "next": "c10_hub_return_courtyard"
        },
        {
          "text": "Tell her the only reason the future feels negotiable is that she taught you to read the fine print in power, not just paperwork.",
          "effects": [
            {
              "type": "relationship",
              "key": "Camille",
              "delta": 2
            },
            {
              "type": "flag",
              "key": "add_c10_camille_courtyard_honesty_v2_2",
              "value": true
            }
          ],
          "next": "c10_hub_return_courtyard"
        },
        {
          "text": "Match her tone: ask which clause she would strike first if the goal were not safety but freedom.",
          "effects": [
            {
              "type": "relationship",
              "key": "Camille",
              "delta": 1
            },
            {
              "type": "flag",
              "key": "add_c10_camille_courtyard_honesty_v2_3",
              "value": true
            }
          ],
          "next": "c10_hub_return_courtyard"
        }
      ]
    },
    "add_c10_julian_program_v2": {
      "chapter": 10,
      "title": "Julian, Final Draft V2",
      "location": "Admin Wing Program Table",
      "background": "aegis",
      "focus": "Julian",
      "text": [
        "Julian has occupied the little program table outside the admin office as if it were assigned to him by divine right and good lighting. A stack of ceremony booklets sits between two bowls of wrapped mints no one wants. The tablecloth is trying too hard. The program itself is worse. Julian is holding one copy with the weary fascination of a man forced to witness a crime against texture and sentence rhythm before noon.",
        "\"There you are,\" he says. \"I need a second opinion before I start correcting institutional prose with a pen and a personality disorder.\" He hands you the booklet and taps the opening line with one immaculate finger. \"Listen to this: integrated excellence through disciplined service. Tell me honestly whether the author should be fined or merely kept away from metaphors.\"",
        "It is absurd enough to save both of you from gravity for a second. You laugh. He visibly relaxes. That alone tells on him. Julian has gotten you out of too many spirals over the year for you to miss what he is doing now: creating levity so the room can hold whatever comes after it. His version of care has always involved air pressure management. Make it funny enough and the truth can enter without detonating.",
        "People move around you in waves - parents, donors, lower-level staff, graduates trying to look unstartled by their own formal clothes. Julian barely notices any of them. Or rather: he notices all of them and dismisses them as nonessential in the same motion. The only social performance he is truly interested in right now is yours and his, stripped to the draft version before the day edits it.",
        "\"I dislike ceremonies,\" he says more quietly, straightening the stack without looking at it. \"Not because they're artificial. I love artificial things. Properly done, artifice is simply honesty with tailoring. I dislike ceremonies because they tempt people to confuse applause with witness.\"",
        "\"And you're worried about which one this is?\"",
        "\"I am worried,\" he says, and then smiles because the naked admission seems to offend him less than expected, \"that once we all become very official in public, some things will become harder to say in private without sounding like delayed performance reviews.\" He takes the booklet back, folds it once, and lets it rest against his wrist. \"I would prefer not to become one of your tasteful regrets.\"",
        "The line is light on paper and devastating in person. Julian glances past you toward the hall and then back again, giving you the clean version of his attention. No stage lights. No audience he is playing to. Just the curated person and the uncurated feeling sharing a body a little too transparently for his comfort. There is something almost brave in the elegance of it. He is still himself. He is simply not hiding the risk.",
        "You remember how easy it would have been, early on, to mistake him for surface. That mistake is impossible now. Julian has always understood room tone, status tension, beauty, and shame better than most people in the building. What he asks for today is not to be admired for that. It is to be answered as a person rather than used as a mood.",
        "The admin lights are terrible. They flatten the air and make everyone look more tired than they meant to reveal. Somehow that helps. There is no glamour excuse here. If you answer him, you answer him without flattering conditions."
      ],
      "choices": [
        {
          "text": "Tell him he has never been decorative to you and he knows it.",
          "effects": [
            {
              "type": "relationship",
              "key": "Julian",
              "delta": 2
            },
            {
              "type": "flag",
              "key": "add_c10_julian_program_v2_1",
              "value": true
            }
          ],
          "next": "c10_hub_return_admin"
        },
        {
          "text": "Tell him if he becomes one of your regrets, it will only be because you were cowardly where he was clear.",
          "effects": [
            {
              "type": "relationship",
              "key": "Julian",
              "delta": 2
            },
            {
              "type": "flag",
              "key": "add_c10_julian_program_v2_2",
              "value": true
            }
          ],
          "next": "c10_hub_return_admin"
        },
        {
          "text": "Keep the tone half-playful, half-true: tell him he is far too expensive to become tasteful.",
          "effects": [
            {
              "type": "relationship",
              "key": "Julian",
              "delta": 1
            },
            {
              "type": "flag",
              "key": "add_c10_julian_program_v2_3",
              "value": true
            }
          ],
          "next": "c10_hub_return_admin"
        }
      ]
    },
    "add_c10_theo_last_probability_v2": {
      "chapter": 10,
      "title": "Theo, The Last Probability V2",
      "location": "Courtyard Overlook",
      "background": "aegis",
      "focus": "Theo",
      "text": [
        "Theo is at the far edge of the courtyard overlook where the stone wall drops low enough for the sea to claim more of the horizon. His program is folded into his back pocket instead of being read, which is how you know he has already wrung every useful pattern out of it and found none capable of reducing the real problem. He is holding a paper cup of coffee with both hands, not because it is cold but because it gives his hands a job while his brain does too many of them at once.",
        "When you step beside him, he gives you the tiniest visible exhale. \"Good,\" he says. \"You exist in approximately the place I expected. That helps.\"",
        "\"That's romantic.\"",
        "\"I'm having a vulnerable morning. Please don't weaponize sarcasm at me until I've had more caffeine.\" The dryness lands cleaner because he is not entirely joking. Theo looks more composed than he did in the first weeks, but graduation has a way of stripping people back to their original tells. His are all present: the careful stillness, the overworked honesty, the sense that every sentence has been considered against three likely futures before release.",
        "The ocean wind catches at the paper cup. He adjusts his grip and stares out at the water long enough that you could rescue him from the silence if you wanted. You don't. Theo notices and smiles in a way that is almost private. \"Thank you,\" he says.",
        "\"For what?\"",
        "\"Not assuming every pause is a problem to solve.\" He tips the cup toward the ceremony lawn. \"Everyone keeps behaving like today is a clean conclusion. It isn't. It's a permissions change. A visibility change. A risk multiplier disguised as a milestone. Which is fine. I like milestones. I'm simply suspicious of any social event built on the premise that a system has finished misunderstanding us.\"",
        "That is so perfectly Theo that affection arrives before thought. He glances at you, catches some version of that on your face, and goes on before the moment can embarrass him out of itself. \"I also know,\" he says more quietly, \"that some of my predictions about you were wrong. Not the large dangerous ones. Those were annoyingly robust. The human ones.\"",
        "\"Meaning?\"",
        "\"Meaning I thought you were more likely to become less reachable as you got stronger. Or more performative. Or more willing to let other people build explanations around you because it saved time. You did some of that,\" he adds, fair even now. \"But not all of it. You kept... choosing people in ways I didn't know if you would.\"",
        "It is one of the clearest things he has ever said to you about what this year has meant. Theo does not spend words loosely. If he is this direct now, it is because he has run out of patience for the fiction that precision and feeling are opposing categories. The courtyard noise behind you fades into useful blur. For a moment it is just the wall, the coffee, the wind off the water, and Theo looking at you like being understood might still surprise him despite all available evidence.",
        "\"I don't know what shape your life takes after today,\" he says. \"I know the system will offer you several flattering lies in exchange for compliance. I also know people will start calling selfishness strategy if you're competent enough. I would prefer,\" and here his voice catches on the edge of his own nerve and keeps going anyway, \"not to become someone you only remember when you need the honest answer.\""
      ],
      "choices": [
        {
          "text": "Tell him he has already become one of the honest answers, which is more dangerous and more important.",
          "effects": [
            {
              "type": "relationship",
              "key": "Theo",
              "delta": 2
            },
            {
              "type": "flag",
              "key": "add_c10_theo_last_probability_v2_1",
              "value": true
            }
          ],
          "next": "c10_hub_return_courtyard"
        },
        {
          "text": "Tell him you came over because today felt wrong without hearing what he really thought.",
          "effects": [
            {
              "type": "relationship",
              "key": "Theo",
              "delta": 2
            },
            {
              "type": "flag",
              "key": "add_c10_theo_last_probability_v2_2",
              "value": true
            }
          ],
          "next": "c10_hub_return_courtyard"
        },
        {
          "text": "Tell him he can stop pretending he is only useful as a warning label; you learned him better than that.",
          "effects": [
            {
              "type": "relationship",
              "key": "Theo",
              "delta": 1
            },
            {
              "type": "flag",
              "key": "add_c10_theo_last_probability_v2_3",
              "value": true
            }
          ],
          "next": "c10_hub_return_courtyard"
        }
      ]
    },
    "add_c10_ben_service_dock": {
      "chapter": 10,
      "title": "Ben, Water Cases And Other Things People Assume",
      "location": "Service Dock",
      "background": "graduation",
      "focus": "Ben",
      "text": [
        "The service dock behind the hall is cooler than the courtyard and uglier in a way that feels immediately trustworthy. No floral arrangements. No staged smiles. Just cracked yellow paint, stacked water cases, folding chairs waiting to be reclaimed by storage, and Ben carrying two boxes at once because the universe continues to volunteer him for weight whenever no one is looking too closely.",
        "He sets the cases down when he sees you and wipes one forearm across his forehead. \"Hey,\" he says. \"I escaped three separate congratulations from people who have definitely never met me and one donor who called me a big guy like he'd discovered weather.\"",
        "\"Rough morning.\"",
        "\"I've survived worse.\" The line comes out automatically enough to indict the habit. Ben notices that you noticed and huffs a laugh. \"Yeah. That. I'm trying to stop answering every concern like I'm an armored vehicle with feelings as aftermarket equipment.\"",
        "It is one of the cleanest support-character truths in the building and it lands exactly because he says it without self-pity. Ben has been useful all year. Reliable, sturdy, quietly central in the way institutions love and stories often undercredit. Graduation doesn't change that unless someone actually names it.",
        "The dock gate is open to the bay. Salt wind pushes through and lifts the edge of the ceremony banner draped around a maintenance cart. Inside, applause swells and drops. Out here, things feel less narrated. Ben leans back against the wall beside the stacked chairs and looks at you with the tired steadiness of someone who has decided not to be reduced by anyone's convenience today, including his own.",
        "\"You good?\" he asks. The question sounds simple. It isn't. Ben asks like a person willing to hold an honest answer without dramatizing it."
      ],
      "choices": [
        {
          "text": "Tell him the day feels too official to trust and thank him for asking like a real person instead of a staff form.",
          "effects": [
            {
              "type": "relationship",
              "key": "Ben",
              "delta": 2
            },
            {
              "type": "flag",
              "key": "add_c10_ben_service_dock_1",
              "value": true
            }
          ],
          "next": "c10_hub_graduation"
        },
        {
          "text": "Ask him what he wants after today, not what everyone keeps assuming he can carry.",
          "effects": [
            {
              "type": "relationship",
              "key": "Ben",
              "delta": 2
            },
            {
              "type": "flag",
              "key": "add_c10_ben_service_dock_2",
              "value": true
            }
          ],
          "next": "c10_hub_graduation"
        },
        {
          "text": "Keep it light and sit with him in the ugly honest air for a minute before going back in.",
          "effects": [
            {
              "type": "relationship",
              "key": "Ben",
              "delta": 1
            },
            {
              "type": "flag",
              "key": "add_c10_ben_service_dock_3",
              "value": true
            }
          ],
          "next": "c10_hub_graduation"
        }
      ]
    },
    "add_c10_jordan_admin_truth": {
      "chapter": 10,
      "title": "Jordan, What The Room Already Knows",
      "location": "Admin Balcony",
      "background": "aegis",
      "focus": "Jordan",
      "text": [
        "The admin balcony above the atrium is one of Jordan's preferred perches: enough height to read a room, enough distance that nobody can accuse them of causing the gossip they are clearly cataloging. They are leaning against the railing with a paper cup and an expression balanced perfectly between amused and merciful.",
        "\"You look like a person who just got assigned a future by committee,\" they say as you approach.",
        "\"You say that like it's visible.\"",
        "\"Everything is visible today. That's the problem with ceremonies. They lower the ambient noise and call it closure.\" Jordan glances down at the atrium, where graduates and families are already sorting into the social math that will decide who leaves with whom, who lingers, who pretends not to search for one person before anyone else. \"Relax. I'm not about to narrate your face back to you. I do, however, believe in quality assurance.\"",
        "They tap the rim of the cup against the railing once. \"People around you have narratives now. Not rumors. Narratives. Different species. More expensive. Piper's trying very hard to act like speed can solve category problems. Camille has the expression she gets when she has already accounted for risk and chosen involvement anyway. Julian looks like a person who has decided to make elegance answer for sincerity and then found out sincerity doesn't outsource cleanly. Theo,\" they add with a glance sharp enough to count as kindness, \"looks like someone who hates uncertainty except where you are concerned.\"",
        "Jordan lets the summary sit just long enough to feel dangerous and then softens the blade. \"I'm not saying any of this to be invasive. I'm saying it because once people leave Aegis, they lose the enforced proximity that made emotional ambiguity easy. Out there, neglect and indecision start looking a lot more similar from the receiving end.\"",
        "Only Jordan could deliver relational ethics like a weather report and make it land as care. The atrium below catches another wave of applause. Jordan follows it with their eyes and then smiles without mockery. \"For what it's worth, you got less frightening in some ways. More frightening in others. Overall? Better silhouette.\""
      ],
      "choices": [
        {
          "text": "Tell them you hate how right they usually are and ask which kind of indecision does the most damage.",
          "effects": [
            {
              "type": "relationship",
              "key": "Jordan",
              "delta": 2
            },
            {
              "type": "flag",
              "key": "add_c10_jordan_admin_truth_1",
              "value": true
            }
          ],
          "next": "c10_hub_graduation"
        },
        {
          "text": "Ask whether the room reads you as choosing anyone yet or just delaying elegantly.",
          "effects": [
            {
              "type": "relationship",
              "key": "Jordan",
              "delta": 1
            },
            {
              "type": "flag",
              "key": "add_c10_jordan_admin_truth_2",
              "value": true
            }
          ],
          "next": "c10_hub_graduation"
        },
        {
          "text": "Thank them for saying it plainly instead of letting everyone bruise themselves on implication.",
          "effects": [
            {
              "type": "relationship",
              "key": "Jordan",
              "delta": 2
            },
            {
              "type": "flag",
              "key": "add_c10_jordan_admin_truth_3",
              "value": true
            }
          ],
          "next": "c10_hub_graduation"
        }
      ]
    },
    "add_c10_after_stage_service_corridor": {
      "chapter": 10,
      "title": "The Quiet Immediately After",
      "location": "Service Corridor",
      "background": "graduation",
      "focus": "Seth",
      "text": [
        "The service corridor behind the stage is all scuffed tile, stacked floral buckets, spare podium hardware, and the bizarre vacuum that follows being publicly named in a room full of witnesses. One minute the ceremony is in your ears and on your skin - applause, lights, hands, the exact pressure of Vance's handshake, the surreal weightlessness of hearing your own name packaged as official success. The next minute there is only fluorescent hum and a folding chair left open against the wall like even furniture assumes people need a second to become private again.",
        "You stop there because your body does before your mind catches up. Graduation was never going to solve anything. You knew that. Still, some animal part of you expected the threshold to feel cleaner. Instead it feels like being translated in public and then handed back to yourself with new paperwork attached.",
        "The year presses through in fragments, not scenes: intake fear, bad coffee, the first time somebody laughed when you most needed it, the first time somebody stayed, the med lights, the off-campus air, the nights where care and strategy kept borrowing each other's clothes. You are no longer guessing whether these people matter. The question now is what shape of mattering survives daylight and jurisdiction.",
        "Voices drift faintly from one end of the corridor. Someone laughs - Julian, probably. Piper says something too fast to catch. Theo answers in the register he uses when he is trying not to sound emotionally invested and failing by fractions. Camille is quieter but somehow still changes the pressure of the air when she enters a space. The familiarity of that, of them, settles you more than the ceremony did.",
        "It occurs to you with embarrassing force that this may be the last time in a while all your choices still live in the same building. That thought does not ask for panic. It asks for honesty."
      ],
      "choices": [
        {
          "text": "Go find the others before the corridor turns this into a solo myth.",
          "effects": [
            {
              "type": "flag",
              "key": "c10_group_named",
              "value": true
            },
            {
              "type": "flag",
              "key": "add_c10_after_stage_service_corridor_1",
              "value": true
            }
          ],
          "next": "c10_goodbyes"
        },
        {
          "text": "Take one more breath and decide what kind of truth you can afford tonight.",
          "effects": [
            {
              "type": "flag",
              "key": "c10_self_named_truth",
              "value": true
            },
            {
              "type": "flag",
              "key": "add_c10_after_stage_service_corridor_2",
              "value": true
            }
          ],
          "next": "c10_goodbyes"
        }
      ]
    }
  });

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

  STORY.intentionalOrphans = Array.from(new Set([
    ...(STORY.intentionalOrphans || []),
    "c06_apartment_board",
    "c09_walk_piper"
  ]));

  redirect("c09_last_messages", "c09_three_before_roof", "add_c09_after_messages_table");
  redirect("c09_plan_reveal", "c09_sleep_or_not", "add_c09_final_shared_kitchen");
  redirect("c09_private_camille", "c09_walk_piper", "add_c09_piper_rooftop_long");
  redirect("c09_private_julian", "c09_walk_piper", "add_c09_piper_rooftop_long");
  redirect("c09_private_theo", "c09_walk_piper", "add_c09_piper_rooftop_long");
  redirect("c09_private_shared", "c09_walk_piper", "add_c09_piper_rooftop_long");
  redirect("c10_before_stage", "add_c10_backstage_core_four", "c10_graduation");
  redirect("c10_graduation", "add_c10_after_stage_service_corridor", "add_c10_backstage_core_four");
  redirect("c10_graduation", "c10_goodbyes", "add_c10_backstage_core_four");
  redirect("add_c10_backstage_core_four", "c10_goodbyes", "add_c10_after_stage_service_corridor");
  redirect("c10_goodbyes", "c10_dinner_reveal", "add_c10_restaurant_anteroom");
})();
/* AUTHORING_PACKS_VOLUME_END */
