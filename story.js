window.AEGIS_STORY = {
  version: "0.1.0",
  title: "Aegis: Supers Under Supervision",
  initialScene: "c01_arrival",
  player: {
    name: "Seth Cormac",
    age: 24,
    role: "Bottomless absorption and energy release",
    portrait: "assets/avatars/male-1.png"
  },
  defaultStats: {
    control: 0,
    restraint: 0,
    audacity: 0,
    heat: 1,
    cold: 0,
    resolve: 0,
    exposure: 0,
    collateral: 0,
    aegisTrust: 0,
    aegisFear: 0,
    heroPath: 0,
    contractorPath: 0,
    independentPath: 0,
    villainPath: 0,
    foundationPath: 0,
    civilianPath: 0
  },
  defaultRelationships: {
    Piper: 0,
    Camille: 0,
    Julian: 0,
    Theo: 0,
    Jordan: 0,
    Rina: 0,
    Ben: 0,
    Kaito: 0,
    Rhea: 0,
    Vance: 0
  },
  defaultStatus: {
    condition: "Stable",
    energy: "Dormant",
    stress: "Low",
    classification: "New intake",
    lastFight: "None"
  },
  chapters: [
    { id: 1, title: "Pressure Cooker", start: "c01_arrival" },
    { id: 2, title: "Five Hundred Degrees", start: "c02_baseline_intro" },
    { id: 3, title: "Sim Block C", start: "c03_observe" },
    { id: 4, title: "Break Thermo", start: "c04_anchor" },
    { id: 5, title: "Unscheduled Field Test", start: "c05_dock_setup" },
    { id: 6, title: "The Event Horizon", start: "c06_event_horizon" },
    { id: 7, title: "Bait Wrapped In Bureaucracy", start: "c07_bait" },
    { id: 8, title: "Mach Five", start: "c08_airbase" },
    { id: 9, title: "Last Night In The Dorm", start: "c09_graduation_eve" },
    { id: 10, title: "The Difficult Position", start: "c10_graduation" }
  ],
  characters: {
    Seth: {
      age: 24,
      pronouns: "he/him",
      power: "Bottomless absorption and energy release",
      role: "Absorption Variant",
      portrait: "assets/avatars/male-1.png"
    },
    Piper: {
      age: 25,
      pronouns: "she/her",
      power: "Mach 5 speed",
      role: "Mach 5 speedster",
      portrait: "assets/portraits/piper.png"
    },
    Camille: {
      age: 27,
      pronouns: "she/her",
      power: "Force redirection",
      role: "Force redirection specialist",
      portrait: "assets/portraits/camille.png"
    },
    Julian: {
      age: 28,
      pronouns: "he/him",
      power: "Light and sound glamour",
      role: "Light and sound glamourist",
      portrait: "assets/portraits/julian.png"
    },
    Theo: {
      age: 26,
      pronouns: "he/him",
      power: "Probability nudging",
      role: "Probability analyst",
      portrait: "assets/portraits/theo.png"
    },
    Ben: {
      age: 24,
      pronouns: "he/him",
      power: "Impact absorption",
      role: "Impact absorber",
      portrait: "assets/portraits/ben.png"
    },
    Jordan: {
      age: 25,
      pronouns: "they/them",
      power: "Social pattern reading",
      role: "Selective-hearing gossip engine",
      portrait: "assets/portraits/jordan.png"
    },
    Rina: {
      age: 24,
      pronouns: "she/her",
      power: "Kinetic acceleration",
      role: "Kinetic rival",
      portrait: "assets/portraits/rina.png"
    },
    Kaito: {
      age: "mid-40s",
      pronouns: "he/him",
      power: "Neutral-ground leverage",
      role: "Neutral-ground proprietor",
      portrait: "assets/portraits/kaito.png"
    },
    Rhea: {
      age: "mid-30s",
      pronouns: "she/her",
      power: "Adaptive combat physiology",
      role: "Vektor hunter",
      portrait: "assets/portraits/rhea.png"
    },
    Vance: {
      age: "mid-50s",
      pronouns: "he/him",
      power: "Aegis command authority",
      role: "Aegis command",
      portrait: "assets/portraits/vance.png"
    }
  },
  backgrounds: {
    aegis: "assets/backgrounds/aegis-point.svg",
    sim: "assets/backgrounds/sim-dome.svg",
    horizon: "assets/backgrounds/event-horizon.svg",
    city: "assets/backgrounds/blackwater.svg",
    graduation: "assets/backgrounds/graduation.svg"
  },
  scenes: {
    c01_arrival: {
      chapter: 1,
      title: "Pressure Cooker",
      location: "Aegis Intake Hall",
      background: "aegis",
      focus: "Seth",
      text: [
        "You arrive at Aegis Point with a duffel bag, a file full of incident reports, and the official explanation that this is not a prison, not a military camp, and not exactly a school.",
        "The intake packet calls it an adult stabilization cohort: ages twenty-two to twenty-eight, old enough to have a life, young enough for Aegis to pretend reshaping it is mentorship.",
        "Aegis exists for one reason: control. Some people leave as licensed heroes. Some leave as private security, research assets, or civilians who can finally move through a normal day without fearing a power spike. Learning not to level a city block because you got angry is the non-optional part.",
        "The intake hall is crowded with other adult trainees, staff, and people trying very hard not to look like they are measuring everyone else. A blonde woman in a red jacket catches you noticing the service corridor and grins like she knows a better map than the one in your packet.",
        "Across the room, a composed woman in black reviews a tablet while two men flank her: one polished enough to make standing still look rehearsed, one watching exits like the ceiling might ask a question. You do not know their names yet. You only know the room seems to bend around them."
      ],
      choices: [
        {
          text: "Attend orientation first. Shenanigans can wait five minutes.",
          effects: [
            { type: "stat", key: "restraint", delta: 1 },
            { type: "stat", key: "aegisTrust", delta: 1 },
            { type: "stat", key: "heroPath", delta: 1 },
            { type: "relationship", key: "Vance", delta: 1 },
            { type: "flag", key: "attendedOrientation", value: true }
          ],
          next: "c01_orientation"
        },
        {
          text: "Answer the blonde woman's grin and ask if the unofficial map is better.",
          effects: [
            { type: "relationship", key: "Piper", delta: 2 },
            { type: "relationship", key: "Jordan", delta: 1 },
            { type: "stat", key: "audacity", delta: 1 },
            { type: "stat", key: "independentPath", delta: 1 },
            { type: "stat", key: "exposure", delta: 1 },
            { type: "flag", key: "piperShortcuts", value: true }
          ],
          next: "c01_shortcuts"
        },
        {
          text: "Cross the room and ask the composed woman if she is studying the room or the people in it.",
          effects: [
            { type: "relationship", key: "Camille", delta: 2 },
            { type: "relationship", key: "Julian", delta: 1 },
            { type: "stat", key: "audacity", delta: 1 },
            { type: "stat", key: "foundationPath", delta: 1 },
            { type: "flag", key: "camilleEarly", value: true }
          ],
          next: "c01_camille_first"
        }
      ]
    },
    c01_orientation: {
      chapter: 1,
      title: "Officially Not A Prison",
      location: "Lecture Hall A",
      background: "aegis",
      focus: "Vance",
      text: [
        "Commandant Vance explains the rules with the calm of someone who has watched enough people learn them the hard way. Mandatory therapy. Simulation schedules. City leave restrictions. Containment procedures.",
        "A blonde trainee drops into the seat beside you halfway through and whispers commentary without moving her mouth. When the lights come up, she offers a quick grin. \"Piper Lane. You survived the friendly version.\"",
        "Near the aisle, Ben Calder waits with the patience of someone who has seen too many people pretend they are fine on day one."
      ],
      choices: [
        {
          text: "Go with Piper to the lounge. Orientation earned you at least one unofficial answer.",
          effects: [
            { type: "relationship", key: "Piper", delta: 1 },
            { type: "stat", key: "heroPath", delta: 1 },
            { type: "flag", key: "orientationCredit", value: true }
          ],
          next: "c01_lounge"
        },
        {
          text: "Ask Ben to walk with you and explain what people are really worried about.",
          effects: [
            { type: "relationship", key: "Ben", delta: 2 },
            { type: "stat", key: "restraint", delta: 1 },
            { type: "stat", key: "civilianPath", delta: 1 },
            { type: "flag", key: "benTrust", value: true }
          ],
          next: "c01_ben_walk"
        }
      ]
    },
    c01_shortcuts: {
      chapter: 1,
      title: "Strategic Brownies",
      location: "Service Corridor",
      background: "aegis",
      focus: "Piper",
      text: [
        "\"Official map's for people who enjoy getting lost politely,\" the blonde woman says. \"Piper Lane. Welcome to the expensive box where they teach disasters to use coasters.\"",
        "Piper leads you through a service corridor, into the warm chocolate smell of the main kitchen, and out again with a brownie in your hand before your intake packet has even settled in your bag.",
        "Jordan keeps pace like he planned to join the tour all along. He calls it social navigation. Piper calls it knowing where the good snacks are. Either way, the unofficial map of Aegis is already more useful than the official one."
      ],
      choices: [
        {
          text: "Thank the chef and keep moving before Piper escalates to felony pastry.",
          effects: [
            { type: "relationship", key: "Jordan", delta: 1 },
            { type: "stat", key: "restraint", delta: 1 },
            { type: "stat", key: "aegisTrust", delta: 1 }
          ],
          next: "c01_lounge"
        },
        {
          text: "Tell Piper this was a clean operation and you respect the professionalism.",
          effects: [
            { type: "relationship", key: "Piper", delta: 2 },
            { type: "stat", key: "audacity", delta: 1 },
            { type: "stat", key: "independentPath", delta: 1 },
            { type: "flag", key: "piperMischief", value: true }
          ],
          next: "c01_lounge"
        }
      ]
    },
    c01_ben_walk: {
      chapter: 1,
      title: "Impact Absorber",
      location: "Main Hall Walkway",
      background: "aegis",
      focus: "Seth",
      text: [
        "Ben walks with an unhurried steadiness that makes the campus feel less like a machine designed to sort dangerous people by category.",
        "He tells you his power is impact absorption. Not flashy, he says. Useful. He can brace someone else through contact, share the hit, make sure the person beside him survives the moment."
      ],
      choices: [
        {
          text: "Tell him that keeping people alive sounds better than flashy.",
          effects: [
            { type: "relationship", key: "Ben", delta: 2 },
            { type: "stat", key: "restraint", delta: 1 }
          ],
          next: "c01_lounge"
        },
        {
          text: "Ask if he can take energy too, or only force.",
          effects: [
            { type: "relationship", key: "Ben", delta: 1 },
            { type: "stat", key: "control", delta: 1 },
            { type: "flag", key: "benPowerQuestion", value: true }
          ],
          next: "c01_lounge"
        }
      ]
    },
    c01_camille_first: {
      chapter: 1,
      title: "The File Does Not Say Pizza",
      location: "Intake Hall",
      background: "aegis",
      focus: "Camille",
      text: [
        "The woman looks up before you finish crossing the room. \"Camille Fairchild,\" she says, with the precision of someone setting terms.",
        "\"Julian Hart,\" says the polished man, delighted by the existence of an audience. \"And that is Theo Arden, currently calculating whether this conversation can injure anyone.\"",
        "\"Your file says high-output absorption variant,\" Camille says. \"Tell me something it does not say.\""
      ],
      choices: [
        {
          text: "\"I like pizza.\"",
          effects: [
            { type: "relationship", key: "Camille", delta: 1 },
            { type: "relationship", key: "Julian", delta: 2 },
            { type: "flag", key: "pizzaDataPoint", value: true }
          ],
          next: "c01_lounge"
        },
        {
          text: "Make one clean contained flame, then let it vanish without warming the air.",
          effects: [
            { type: "relationship", key: "Camille", delta: 2 },
            { type: "relationship", key: "Julian", delta: 1 },
            { type: "stat", key: "control", delta: 1 },
            { type: "stat", key: "audacity", delta: 1 },
            { type: "stat", key: "aegisFear", delta: 1 },
            { type: "stat", key: "exposure", delta: 1 },
            { type: "flag", key: "cleanFlame", value: true }
          ],
          next: "c01_lounge"
        },
        {
          text: "\"I do better when people underestimate me.\"",
          effects: [
            { type: "relationship", key: "Camille", delta: 1 },
            { type: "relationship", key: "Theo", delta: 1 },
            { type: "stat", key: "restraint", delta: 1 },
            { type: "stat", key: "contractorPath", delta: 1 },
            { type: "flag", key: "guardedFirst", value: true }
          ],
          next: "c01_lounge"
        }
      ]
    },
    c01_lounge: {
      chapter: 1,
      title: "Home Base",
      location: "Common Lounge",
      background: "aegis",
      focus: "Piper",
      variants: [
        {
          conditions: [
            { type: "notFlag", key: "piperShortcuts" },
            { type: "flag", key: "attendedOrientation" }
          ],
          text: ["Piper claims the corner couch before anyone else can. She waves you over like the decision was made before you entered."]
        },
        {
          conditions: [
            { type: "notFlag", key: "piperShortcuts" },
            { type: "notFlag", key: "attendedOrientation" }
          ],
          text: ["The blonde woman from intake drops onto a corner couch and gives you a name: Piper Lane. She waves you over like the decision was made before you entered."]
        },
        {
          conditions: [{ type: "notFlag", key: "camilleEarly" }],
          text: ["The composed woman from intake enters with the two men you noticed earlier. Piper mutters their names under her breath: Camille Fairchild, Julian Hart, Theo Arden."]
        }
      ],
      text: [
        "The common lounge is all glass, low couches, ocean light, and residents pretending not to study each other.",
        "Camille's attention lands on your couch. Piper goes still for half a second, then covers it with a grin.",
        "\"You've been noticed,\" Julian says when they reach you. \"That usually comes with expectations. Occasionally with better snacks.\""
      ],
      choices: [
        {
          text: "Put on a tiny show: a perfect flame, one heartbeat long.",
          effects: [
            { type: "relationship", key: "Camille", delta: 2 },
            { type: "relationship", key: "Julian", delta: 1 },
            { type: "relationship", key: "Piper", delta: 1 },
            { type: "stat", key: "control", delta: 1 },
            { type: "stat", key: "audacity", delta: 1 },
            { type: "stat", key: "aegisFear", delta: 1 },
            { type: "stat", key: "exposure", delta: 1 },
            { type: "flag", key: "loungeShow", value: true }
          ],
          next: "c02_baseline_intro"
        },
        {
          text: "Let Piper handle the social pressure and stay loose.",
          effects: [
            { type: "relationship", key: "Piper", delta: 2 },
            { type: "stat", key: "restraint", delta: 1 },
            { type: "stat", key: "independentPath", delta: 1 },
            { type: "flag", key: "piperClaimsSpace", value: true }
          ],
          next: "c02_baseline_intro"
        },
        {
          text: "Ask Theo what he means by which way you will lean.",
          effects: [
            { type: "relationship", key: "Theo", delta: 2 },
            { type: "stat", key: "control", delta: 1 },
            { type: "stat", key: "contractorPath", delta: 1 },
            { type: "flag", key: "theoEarly", value: true }
          ],
          next: "c02_baseline_intro"
        }
      ]
    },
    c02_baseline_intro: {
      chapter: 2,
      title: "Five Hundred Degrees",
      location: "Simulation Block A",
      background: "sim",
      focus: "Seth",
      variants: [
        {
          conditions: [{ type: "relationshipAtLeast", key: "Theo", value: 5 }],
          text: ["Theo's callouts are faster than the sim telemetry. He trusts you enough to stop hedging, and that makes his warnings sharper."]
        },
        {
          conditions: [{ type: "relationshipAtLeast", key: "Julian", value: 5 }],
          text: ["Julian's decoys do not just look like you. They carry your little habits, your posture, your annoying confidence. He has been paying attention."]
        },
        {
          conditions: [{ type: "relationshipAtLeast", key: "Camille", value: 6 }],
          text: ["Camille gives fewer instructions than she could. That is its own kind of trust. She is letting you choose the moment."]
        },
        {
          conditions: [{ type: "powerIs", value: "gravity" }],
          text: ["The block is still calibrated for heat, but the deeper test is inertia: can you make force behave without turning the room into math debris?"]
        },
        {
          conditions: [{ type: "powerIs", value: "chronal" }],
          text: ["The target clock has been tied into the heat sensors. Aegis wants proof you can change a moment without stealing the room's entire timeline."]
        },
        {
          conditions: [{ type: "powerIs", value: "bio" }],
          text: ["The block is laced with synthetic tissue and pain receptors that are not alive but are rude enough to pretend. The test is control without harm."]
        },
        {
          conditions: [{ type: "powerIs", value: "tech" }],
          text: ["The target is wired to three redundant sensor stacks. The test is whether you command the system or merely bully it into lying."]
        },
        {
          conditions: [{ type: "powerIs", value: "space" }],
          text: ["Aegis has boxed the target inside nested range markers. The test is whether distance remains a rule when you are nervous."]
        }
      ],
      text: [
        "The first control baseline is almost insulting in its simplicity: heat the target block to exactly five hundred degrees Celsius. Three attempts. No collateral. No dramatics.",
        "The resident before you overshoots badly enough to trigger red lights. Another barely warms the target. Then the intercom says your name."
      ],
      choices: [
        {
          text: "Pin the target's mass until every sensor agrees with your version of still.",
          conditions: [{ type: "powerIs", value: "gravity" }],
          effects: [
            { type: "stat", key: "control", delta: 2 },
            { type: "stat", key: "restraint", delta: 1 },
            { type: "powerXp", amount: 2 },
            { type: "stat", key: "contractorPath", delta: 1 },
            { type: "flag", key: "gravityBaseline", value: true }
          ],
          next: "c02_after"
        },
        {
          text: "Hold the target inside one obedient second until the readout lands exactly where you want it.",
          conditions: [{ type: "powerIs", value: "chronal" }],
          effects: [
            { type: "stat", key: "control", delta: 2 },
            { type: "stat", key: "restraint", delta: 1 },
            { type: "powerXp", amount: 2 },
            { type: "stat", key: "aegisTrust", delta: 1 },
            { type: "flag", key: "chronalBaseline", value: true }
          ],
          next: "c02_after"
        },
        {
          text: "Tune the synthetic tissue response until the fake nerves stop screaming and start listening.",
          conditions: [{ type: "powerIs", value: "bio" }],
          effects: [
            { type: "stat", key: "control", delta: 1 },
            { type: "stat", key: "restraint", delta: 2 },
            { type: "powerXp", amount: 2 },
            { type: "stat", key: "heroPath", delta: 1 },
            { type: "flag", key: "bioBaseline", value: true }
          ],
          next: "c02_after"
        },
        {
          text: "Make the rig confess clean data instead of forcing the numbers by brute signal.",
          conditions: [{ type: "powerIs", value: "tech" }],
          effects: [
            { type: "stat", key: "control", delta: 2 },
            { type: "relationship", key: "Theo", delta: 1 },
            { type: "powerXp", amount: 2 },
            { type: "stat", key: "contractorPath", delta: 1 },
            { type: "flag", key: "techBaseline", value: true }
          ],
          next: "c02_after"
        },
        {
          text: "Fold the target's leak paths inward until the heat has nowhere to escape.",
          conditions: [{ type: "powerIs", value: "space" }],
          effects: [
            { type: "stat", key: "control", delta: 2 },
            { type: "stat", key: "audacity", delta: 1 },
            { type: "powerXp", amount: 2 },
            { type: "stat", key: "exposure", delta: 1 },
            { type: "flag", key: "spaceBaseline", value: true }
          ],
          next: "c02_after"
        },
        {
          text: "Hit five hundred exactly. No flare. No thermal bleed. Just the number.",
          effects: [
            { type: "stat", key: "control", delta: 2 },
            { type: "stat", key: "restraint", delta: 1 },
            { type: "relationship", key: "Vance", delta: 1 },
            { type: "stat", key: "aegisTrust", delta: 2 },
            { type: "stat", key: "contractorPath", delta: 1 },
            { type: "stat", key: "exposure", delta: 1 },
            { type: "flag", key: "perfectBaseline", value: true }
          ],
          next: "c02_after"
        },
        {
          text: "Make it memorable: a contained star, still exactly five hundred at the target.",
          effects: [
            { type: "stat", key: "control", delta: 1 },
            { type: "stat", key: "audacity", delta: 2 },
            { type: "relationship", key: "Camille", delta: 1 },
            { type: "stat", key: "aegisFear", delta: 2 },
            { type: "stat", key: "foundationPath", delta: 1 },
            { type: "stat", key: "exposure", delta: 2 },
            { type: "flag", key: "baselineShowmanship", value: true }
          ],
          next: "c02_after"
        },
        {
          text: "Underplay it. Pass cleanly and let people wonder what you held back.",
          effects: [
            { type: "stat", key: "control", delta: 1 },
            { type: "stat", key: "restraint", delta: 2 },
            { type: "relationship", key: "Ben", delta: 1 },
            { type: "stat", key: "aegisTrust", delta: 1 },
            { type: "stat", key: "civilianPath", delta: 1 },
            { type: "flag", key: "understatedBaseline", value: true }
          ],
          next: "c02_after"
        }
      ]
    },
    c02_after: {
      chapter: 2,
      title: "Word Travels Fast",
      location: "Sim Block Corridor",
      background: "aegis",
      focus: "Piper",
      text: [
        "Piper is waiting outside the heavy doors, arms crossed, smile sharp. Jordan Pike, whose grin suggests he already knows three versions of the story, leans near the wall. Ben Calder stands beside him, steadier and harder to read.",
        "\"Five hundred on the nose,\" Jordan says. \"People are going to talk.\"",
        "Ben gives you a steadier look. \"They were going to talk anyway. This just gives them better material.\"",
        "Across the hall, Rina Cross catches your eye like she is deciding whether to be impressed or offended."
      ],
      choices: [
        {
          text: "\"Waiting for the post-test review, Lane?\"",
          effects: [
            { type: "relationship", key: "Piper", delta: 2 },
            { type: "flag", key: "flirtPiperBaseline", value: true }
          ],
          next: "c02_lecture_choice"
        },
        {
          text: "Ask Ben if precision like that is really unusual.",
          effects: [
            { type: "relationship", key: "Ben", delta: 2 },
            { type: "stat", key: "restraint", delta: 1 }
          ],
          next: "c02_lecture_choice"
        },
        {
          text: "Ask Jordan how fast the story is moving.",
          effects: [
            { type: "relationship", key: "Jordan", delta: 2 },
            { type: "stat", key: "exposure", delta: 1 },
            { type: "stat", key: "independentPath", delta: 1 },
            { type: "flag", key: "gossipPulse", value: true }
          ],
          next: "c02_lecture_choice"
        },
        {
          text: "Meet Rina's glare instead of pretending you missed it.",
          effects: [
            { type: "relationship", key: "Rina", delta: 2 },
            { type: "stat", key: "audacity", delta: 1 },
            { type: "flag", key: "rinaRivalry", value: true }
          ],
          next: "c02_lecture_choice"
        }
      ]
    },
    c02_lecture_choice: {
      chapter: 2,
      title: "Consequences",
      location: "Main Walkway",
      background: "aegis",
      focus: "Seth",
      text: [
        "Jordan offers a shortcut to the interesting part of the day. Ben points out that the next lecture covers consequences. Piper admits that while the lecture is boring, consequences do tend to matter around here."
      ],
      choices: [
        {
          text: "Go to the lecture. Knowing consequences seems useful.",
          effects: [
            { type: "stat", key: "restraint", delta: 1 },
            { type: "relationship", key: "Vance", delta: 1 },
            { type: "stat", key: "aegisTrust", delta: 1 },
            { type: "stat", key: "heroPath", delta: 1 },
            { type: "flag", key: "knowsConsequences", value: true }
          ],
          next: "c02_gym"
        },
        {
          text: "Follow Jordan toward whatever he considers the real action.",
          effects: [
            { type: "relationship", key: "Jordan", delta: 2 },
            { type: "stat", key: "audacity", delta: 1 },
            { type: "stat", key: "exposure", delta: 1 },
            { type: "stat", key: "independentPath", delta: 1 },
            { type: "flag", key: "skippedRules", value: true }
          ],
          next: "c02_gym"
        }
      ]
    },
    c02_gym: {
      chapter: 2,
      title: "An Efficient Proposal",
      location: "Rec Center",
      background: "aegis",
      focus: "Camille",
      text: [
        "Camille finds you in the rec center after reviewing the baseline footage.",
        "\"My training group meets Tuesday and Thursday evenings in Sim Block C,\" she says. \"Advanced scenarios. High stress. High precision. You're invited to observe.\"",
        "Piper watches from the side, bright energy held very still."
      ],
      choices: [
        {
          text: "\"See you there.\" Then go back to lifting.",
          effects: [
            { type: "relationship", key: "Camille", delta: 2 },
            { type: "stat", key: "audacity", delta: 1 },
            { type: "stat", key: "foundationPath", delta: 1 },
            { type: "flag", key: "camilleInviteAccepted", value: true }
          ],
          next: "c03_observe"
        },
        {
          text: "Ask why Piper is not invited if the group cares about excellence.",
          effects: [
            { type: "relationship", key: "Piper", delta: 2 },
            { type: "relationship", key: "Camille", delta: 1 },
            { type: "stat", key: "independentPath", delta: 1 },
            { type: "flag", key: "championedPiper", value: true }
          ],
          next: "c03_observe"
        },
        {
          text: "Keep it professional and ask for the scenario parameters.",
          effects: [
            { type: "stat", key: "control", delta: 1 },
            { type: "stat", key: "restraint", delta: 1 },
            { type: "stat", key: "contractorPath", delta: 1 },
            { type: "relationship", key: "Camille", delta: 1 }
          ],
          next: "c03_observe"
        }
      ]
    },
    c03_observe: {
      chapter: 3,
      title: "Sim Block C",
      location: "Advanced Simulation Bay",
      background: "sim",
      focus: "Camille",
      text: [
        "Sim Block C is quieter than the standard bays, polished enough to feel expensive and dangerous at the same time.",
        "Camille's group runs a containment exercise around a violet energy anomaly. Leo builds amber barriers, Mara turns the air dense and silent, Elara flickers around the core like a skipping frame. Camille barely moves, and when force surges toward the ceiling, she arrests it with one hand.",
        "The exercise is clean, controlled, and beautiful in the way a blade can be beautiful."
      ],
      choices: [
        {
          text: "Ask why destroying the anomaly does not count as containment.",
          effects: [
            { type: "stat", key: "control", delta: 1 },
            { type: "relationship", key: "Camille", delta: 2 },
            { type: "stat", key: "contractorPath", delta: 1 },
            { type: "flag", key: "containmentQuestion", value: true }
          ],
          next: "c03_observations"
        },
        {
          text: "\"Manage, obliterate. Tomato, tomato.\"",
          effects: [
            { type: "stat", key: "audacity", delta: 1 },
            { type: "relationship", key: "Camille", delta: 1 },
            { type: "relationship", key: "Julian", delta: 1 },
            { type: "stat", key: "foundationPath", delta: 1 },
            { type: "flag", key: "teasedContainment", value: true }
          ],
          next: "c03_observations"
        },
        {
          text: "Watch quietly and track the rhythm of the team.",
          effects: [
            { type: "stat", key: "restraint", delta: 1 },
            { type: "stat", key: "control", delta: 1 },
            { type: "stat", key: "heroPath", delta: 1 },
            { type: "relationship", key: "Theo", delta: 1 }
          ],
          next: "c03_observations"
        }
      ]
    },
    c03_observations: {
      chapter: 3,
      title: "Acceptable",
      location: "Advanced Simulation Bay",
      background: "sim",
      focus: "Camille",
      text: [
        "When the anomaly collapses, Camille turns to you. \"Observations?\"",
        "The others pretend not to listen. They are all listening."
      ],
      choices: [
        {
          text: "Name the failure point: the lower-left barrier lag before Mara over-extended.",
          effects: [
            { type: "stat", key: "control", delta: 2 },
            { type: "relationship", key: "Camille", delta: 2 },
            { type: "relationship", key: "Theo", delta: 1 },
            { type: "stat", key: "contractorPath", delta: 1 },
            { type: "flag", key: "readTheSim", value: true }
          ],
          next: "c03_invite"
        },
        {
          text: "\"Awesome powers. Good teamwork. Restraint. Control. Acceptable.\"",
          effects: [
            { type: "stat", key: "audacity", delta: 1 },
            { type: "relationship", key: "Camille", delta: 1 },
            { type: "relationship", key: "Julian", delta: 1 },
            { type: "stat", key: "foundationPath", delta: 1 },
            { type: "flag", key: "acceptableJab", value: true }
          ],
          next: "c03_invite"
        },
        {
          text: "Say the team made it look clean because everyone knew when not to act.",
          effects: [
            { type: "stat", key: "restraint", delta: 1 },
            { type: "relationship", key: "Camille", delta: 1 },
            { type: "stat", key: "heroPath", delta: 1 },
            { type: "relationship", key: "Theo", delta: 1 }
          ],
          next: "c03_invite"
        },
        {
          text: "Hold Camille's stare a beat too long and tell her the cleanest part was watching her choose restraint.",
          effects: [
            { type: "stat", key: "control", delta: 1 },
            { type: "relationship", key: "Camille", delta: 3 },
            { type: "stat", key: "foundationPath", delta: 1 },
            { type: "flag", key: "camilleRomance", value: true },
            { type: "flag", key: "camilleSpark", value: true }
          ],
          next: "c03_invite"
        }
      ]
    },
    c03_invite: {
      chapter: 3,
      title: "Your Turn",
      location: "Advanced Simulation Bay",
      background: "sim",
      focus: "Camille",
      text: [
        "\"Your turn,\" Camille says. \"Saturday. 0900. Solo Level Two containment. No team. No margin for error.\"",
        "Piper's name is not in the invitation."
      ],
      choices: [
        {
          text: "Tell Camille she is underestimating Piper.",
          effects: [
            { type: "relationship", key: "Piper", delta: 3 },
            { type: "relationship", key: "Camille", delta: 1 },
            { type: "stat", key: "independentPath", delta: 1 },
            { type: "flag", key: "advocatedPiper", value: true }
          ],
          next: "c03_piper_door"
        },
        {
          text: "\"Only Level Two?\"",
          effects: [
            { type: "relationship", key: "Camille", delta: 2 },
            { type: "stat", key: "audacity", delta: 1 },
            { type: "stat", key: "foundationPath", delta: 1 },
            { type: "flag", key: "levelTwoTease", value: true }
          ],
          next: "c03_piper_door"
        },
        {
          text: "Accept and ask what counts as a clean pass.",
          effects: [
            { type: "relationship", key: "Camille", delta: 1 },
            { type: "stat", key: "control", delta: 1 },
            { type: "stat", key: "contractorPath", delta: 1 },
            { type: "stat", key: "restraint", delta: 1 }
          ],
          next: "c03_piper_door"
        }
      ]
    },
    c03_piper_door: {
      chapter: 3,
      title: "Doorway Speedster",
      location: "Seth's Dorm",
      background: "aegis",
      focus: "Piper",
      text: [
        "Piper knocks and opens the door in almost the same motion.",
        "\"So,\" she says, bright and curious. \"How was the show? Did Camille make you take notes while they saved the imaginary world?\""
      ],
      choices: [
        {
          text: "\"Boundaries, Lane.\" Say it like a joke, but mean it enough.",
          effects: [
            { type: "relationship", key: "Piper", delta: 1 },
            { type: "stat", key: "restraint", delta: 1 },
            { type: "flag", key: "setPiperBoundary", value: true }
          ],
          next: "c04_anchor"
        },
        {
          text: "Tell her the group is strong and Camille is dangerous in a very educational way.",
          effects: [
            { type: "relationship", key: "Piper", delta: 2 },
            { type: "relationship", key: "Camille", delta: 1 },
            { type: "flag", key: "honestWithPiper", value: true }
          ],
          next: "c04_anchor"
        },
        {
          text: "Brag that Camille wants you alone in a sim on Saturday.",
          effects: [
            { type: "stat", key: "audacity", delta: 1 },
            { type: "relationship", key: "Camille", delta: 1 },
            { type: "relationship", key: "Piper", delta: -1 },
            { type: "flag", key: "pokedPiperJealousy", value: true }
          ],
          next: "c04_anchor"
        }
      ]
    },
    c04_anchor: {
      chapter: 4,
      title: "Break Thermo",
      location: "The Rusty Anchor",
      background: "city",
      focus: "Piper",
      text: [
        "The Rusty Anchor is weathered wood, salt air, local beer, and enough Aegis residents pretending they are normal adults to qualify as theater.",
        "Piper leans across the table. \"Tomorrow, Camille is going to push whatever instinct you trust most. What's the actual plan?\"",
        "Jordan waits with the solemn curiosity of a man who knows the gossip value of a good answer."
      ],
      choices: [
        {
          text: "\"Freeze the output. Burn only what I mean to burn. Keep the room intact.\"",
          effects: [
            { type: "relationship", key: "Piper", delta: 1 },
            { type: "relationship", key: "Jordan", delta: 1 },
            { type: "stat", key: "audacity", delta: 1 },
            { type: "stat", key: "independentPath", delta: 1 },
            { type: "flag", key: "breakThermo", value: true }
          ],
          next: "c04_camille_test"
        },
        {
          text: "Admit cold control is newer and you will have to choose it on purpose.",
          effects: [
            { type: "relationship", key: "Piper", delta: 2 },
            { type: "stat", key: "restraint", delta: 1 },
            { type: "stat", key: "cold", delta: 1 },
            { type: "stat", key: "heroPath", delta: 1 },
            { type: "flag", key: "coldHonesty", value: true }
          ],
          next: "c04_camille_test"
        },
        {
          text: "Ask Jordan who is taking bets on the outcome.",
          effects: [
            { type: "relationship", key: "Jordan", delta: 2 },
            { type: "stat", key: "exposure", delta: 1 },
            { type: "stat", key: "independentPath", delta: 1 },
            { type: "flag", key: "baselineBettingPool", value: true }
          ],
          next: "c04_camille_test"
        }
      ]
    },
    c04_camille_test: {
      chapter: 4,
      title: "Contained Sun",
      location: "Sim Chamber Three",
      background: "sim",
      focus: "Camille",
      text: [
        "Camille starts simple. A point of heat no larger than your palm. Thirty seconds. Minimum spectacle.",
        "The observation deck is full enough to be annoying. Jordan gives you a thumbs-up from the rail. Camille's eyes never leave your hands."
      ],
      choices: [
        {
          text: "Make a tiny contained sun. Cosmic hot. Razor edges. No bleed.",
          effects: [
            { type: "stat", key: "control", delta: 2 },
            { type: "stat", key: "audacity", delta: 2 },
            { type: "stat", key: "heat", delta: 1 },
            { type: "relationship", key: "Camille", delta: 2 },
            { type: "stat", key: "aegisFear", delta: 2 },
            { type: "stat", key: "foundationPath", delta: 1 },
            { type: "stat", key: "exposure", delta: 2 },
            { type: "flag", key: "containedSun", value: true }
          ],
          next: "c04_construct"
        },
        {
          text: "Give Camille the clean baseline she asked for and nothing extra.",
          effects: [
            { type: "stat", key: "control", delta: 2 },
            { type: "stat", key: "restraint", delta: 1 },
            { type: "relationship", key: "Camille", delta: 1 },
            { type: "stat", key: "aegisTrust", delta: 1 },
            { type: "stat", key: "contractorPath", delta: 1 },
            { type: "flag", key: "cleanAssessment", value: true }
          ],
          next: "c04_construct"
        },
        {
          text: "Ask to start with cold. Make the weak side stronger.",
          effects: [
            { type: "stat", key: "cold", delta: 2 },
            { type: "stat", key: "control", delta: 1 },
            { type: "relationship", key: "Camille", delta: 1 },
            { type: "stat", key: "contractorPath", delta: 1 },
            { type: "flag", key: "coldFocus", value: true }
          ],
          next: "c04_construct"
        }
      ]
    },
    c04_construct: {
      chapter: 4,
      title: "Instinct",
      location: "Sim Chamber Three",
      background: "sim",
      focus: "Seth",
      text: [
        "The chamber becomes a rain-slick city street. A construct slides out of an alley, all shadow and unstable plasma. It lunges.",
        "You have less than a thought before instinct decides what kind of person you are under pressure."
      ],
      choices: [
        {
          text: "Heat. A white-hot lance through the construct before it closes.",
          effects: [
            { type: "stat", key: "heat", delta: 1 },
            { type: "stat", key: "audacity", delta: 1 },
            { type: "stat", key: "aegisFear", delta: 1 },
            { type: "flag", key: "heatInstinct", value: true }
          ],
          next: "c04_second_wave"
        },
        {
          text: "Cold. Raise ice walls and force yourself away from the default.",
          effects: [
            { type: "stat", key: "cold", delta: 2 },
            { type: "stat", key: "control", delta: 1 },
            { type: "stat", key: "restraint", delta: 1 },
            { type: "flag", key: "coldInstinct", value: true }
          ],
          next: "c04_second_wave"
        },
        {
          text: "Absorb the construct's energy and learn what it is made of.",
          effects: [
            { type: "stat", key: "control", delta: 1 },
            { type: "stat", key: "exposure", delta: 1 },
            { type: "stat", key: "contractorPath", delta: 1 },
            { type: "flag", key: "absorptionReveal", value: true }
          ],
          next: "c04_second_wave"
        }
      ]
    },
    c04_second_wave: {
      chapter: 4,
      title: "Dual Application",
      location: "Sim Chamber Three",
      background: "sim",
      focus: "Camille",
      text: [
        "Camille confirms what you both already know: under pressure, you reached for the tool that felt most natural. Then she adds variables.",
        "Three adaptive constructs emerge. Faster. Smarter. Hungry enough to make the observation deck go quiet."
      ],
      choices: [
        {
          text: "Build ice walls to trap them, then cut through the gaps with heat.",
          effects: [
            { type: "stat", key: "control", delta: 2 },
            { type: "stat", key: "cold", delta: 1 },
            { type: "stat", key: "heat", delta: 1 },
            { type: "relationship", key: "Camille", delta: 2 },
            { type: "flag", key: "trainedContainment", value: true },
            { type: "flag", key: "dualApplication", value: true }
          ],
          next: "c05_dock_setup"
        },
        {
          text: "Let one close and take its whole charge into your reserves.",
          effects: [
            { type: "stat", key: "audacity", delta: 2 },
            { type: "stat", key: "control", delta: 1 },
            { type: "stat", key: "exposure", delta: 2 },
            { type: "stat", key: "aegisFear", delta: 1 },
            { type: "flag", key: "trainedAbsorption", value: true },
            { type: "flag", key: "absorbedConstruct", value: true }
          ],
          next: "c05_dock_setup"
        },
        {
          text: "Ask Camille if Level Three is available, since this is getting educational.",
          effects: [
            { type: "relationship", key: "Camille", delta: 2 },
            { type: "stat", key: "audacity", delta: 1 },
            { type: "stat", key: "foundationPath", delta: 1 },
            { type: "flag", key: "trainedPressure", value: true },
            { type: "flag", key: "camilleChallenge", value: true }
          ],
          next: "c05_dock_setup"
        }
      ]
    },
    c05_dock_setup: {
      chapter: 5,
      title: "Unscheduled Field Test",
      location: "East Dock",
      background: "aegis",
      focus: "Piper",
      text: [
        "At 8:55 PM, the old east dock is all black water, damp wood, and one flickering lamp. Piper appears beside you with a whisper of displaced air. Theo is tucked in the boathouse with a tablet and the haunted focus of a man committing a spreadsheet crime.",
        "Tonight's experiment: pulse propulsion. The official Aegis term would probably include six more words and a warning label."
      ],
      choices: [
        {
          text: "\"Full throttle.\" Launch yourself over the water.",
          effects: [
            { type: "relationship", key: "Piper", delta: 2 },
            { type: "relationship", key: "Theo", delta: 1 },
            { type: "stat", key: "audacity", delta: 2 },
            { type: "stat", key: "independentPath", delta: 1 },
            { type: "stat", key: "aegisFear", delta: 1 },
            { type: "stat", key: "exposure", delta: 1 },
            { type: "flag", key: "fullThrottleDock", value: true }
          ],
          next: "c05_flight"
        },
        {
          text: "Stage it. Small hop, telemetry check, then bigger pulse.",
          effects: [
            { type: "relationship", key: "Theo", delta: 2 },
            { type: "stat", key: "control", delta: 1 },
            { type: "stat", key: "restraint", delta: 1 },
            { type: "stat", key: "aegisTrust", delta: 1 },
            { type: "stat", key: "contractorPath", delta: 1 },
            { type: "flag", key: "stagedDockTest", value: true }
          ],
          next: "c05_flight"
        },
        {
          text: "Ask Theo for the cleanest route through the blind spots.",
          effects: [
            { type: "relationship", key: "Theo", delta: 2 },
            { type: "stat", key: "control", delta: 1 },
            { type: "stat", key: "contractorPath", delta: 1 },
            { type: "flag", key: "theoCleanLogs", value: true }
          ],
          next: "c05_flight"
        }
      ]
    },
    c05_flight: {
      chapter: 5,
      title: "Human Cannonball",
      location: "Above The Bay",
      background: "city",
      focus: "Seth",
      text: [
        "The first pulse launches you hard enough that the pier becomes a sketch line beneath your feet. The bay opens below, dark and cold. Gravity notices you.",
        "Piper's voice snaps from the dock. Theo calls out vector corrections with the strained calm of someone watching math become weather."
      ],
      choices: [
        {
          text: "Use a warm air column to slow the fall and touch down clean.",
          effects: [
            { type: "stat", key: "control", delta: 2 },
            { type: "relationship", key: "Theo", delta: 1 },
            { type: "stat", key: "aegisTrust", delta: 1 },
            { type: "flag", key: "softLanding", value: true },
            { type: "status", key: "energy", value: "Thermal lift stirred" }
          ],
          next: "c05_after_flight"
        },
        {
          text: "Burst again, overcorrect, and skid back in with style points and scorch marks.",
          effects: [
            { type: "stat", key: "audacity", delta: 2 },
            { type: "relationship", key: "Piper", delta: 1 },
            { type: "stat", key: "collateral", delta: 1 },
            { type: "stat", key: "aegisFear", delta: 1 },
            { type: "status", key: "stress", value: "Elevated" },
            { type: "flag", key: "scorchedDock", value: true }
          ],
          next: "c05_after_flight"
        },
        {
          text: "Let the water catch you, absorb the impact, and climb out drenched.",
          effects: [
            { type: "relationship", key: "Piper", delta: 1 },
            { type: "relationship", key: "Theo", delta: 1 },
            { type: "stat", key: "restraint", delta: 1 },
            { type: "stat", key: "civilianPath", delta: 1 },
            { type: "status", key: "condition", value: "Drenched, unharmed" },
            { type: "flag", key: "baySplashdown", value: true }
          ],
          next: "c05_after_flight"
        }
      ]
    },
    c05_after_flight: {
      chapter: 5,
      title: "Balloons",
      location: "East Dock",
      background: "aegis",
      focus: "Camille",
      text: [
        "Theo's tablet shows data he will want to argue with for days. Piper looks thrilled in the way that usually means a bad idea is becoming a plan.",
        "Then Camille steps out of the shadows, hands in the pockets of her dark jacket.",
        "\"Balloons,\" she repeats after your explanation. \"I suppose that is one way to describe directional thermal impulse.\""
      ],
      choices: [
        {
          text: "Ask Camille for the critique she clearly came prepared to give.",
          effects: [
            { type: "relationship", key: "Camille", delta: 2 },
            { type: "stat", key: "control", delta: 1 },
            { type: "stat", key: "foundationPath", delta: 1 },
            { type: "flag", key: "invitedCamilleCritique", value: true }
          ],
          next: "c05_relationship"
        },
        {
          text: "Thank the audience and leave before the night turns into another evaluation.",
          effects: [
            { type: "relationship", key: "Piper", delta: 1 },
            { type: "stat", key: "restraint", delta: 1 },
            { type: "stat", key: "independentPath", delta: 1 },
            { type: "flag", key: "leftDockEarly", value: true }
          ],
          next: "c05_relationship"
        },
        {
          text: "Ask if she has ever thrown herself through the air with telekinesis.",
          effects: [
            { type: "relationship", key: "Camille", delta: 1 },
            { type: "stat", key: "audacity", delta: 1 },
            { type: "stat", key: "foundationPath", delta: 1 },
            { type: "flag", key: "telekineticFlightJoke", value: true }
          ],
          next: "c05_relationship"
        }
      ]
    },
    c05_relationship: {
      chapter: 5,
      title: "The Fastest Constant",
      location: "Residence Wing",
      background: "aegis",
      focus: "Piper",
      text: [
        "Later, the campus is quiet enough that every footstep sounds like a decision. Piper walks beside you, electric energy tucked under warm honesty.",
        "She is fun, yes. Chaos, yes. But her place in your life is not fixed by momentum alone. It will be shaped by what you choose to make true."
      ],
      choices: [
        {
          text: "Lean into the chemistry with Piper. No pretending it is casual.",
          effects: [
            { type: "relationship", key: "Piper", delta: 3 },
            { type: "stat", key: "resolve", delta: 1 },
            { type: "stat", key: "independentPath", delta: 1 },
            { type: "flag", key: "piperCommitted", value: true },
            { type: "flag", key: "piperRomance", value: true }
          ],
          next: "c06_event_horizon"
        },
        {
          text: "Keep it charged but undefined. Teasing feels safer than naming it.",
          effects: [
            { type: "relationship", key: "Piper", delta: 1 },
            { type: "stat", key: "audacity", delta: 1 },
            { type: "stat", key: "independentPath", delta: 1 },
            { type: "flag", key: "keptPiperPlayful", value: true },
            { type: "flag", key: "piperSlowBurn", value: true }
          ],
          next: "c06_event_horizon"
        },
        {
          text: "Make it trust first. Ask what she wants from the partnership, not the adrenaline.",
          effects: [
            { type: "relationship", key: "Piper", delta: 2 },
            { type: "stat", key: "restraint", delta: 1 },
            { type: "stat", key: "contractorPath", delta: 1 },
            { type: "flag", key: "piperHonestTalk", value: true },
            { type: "flag", key: "piperTrustedPartner", value: true }
          ],
          next: "c06_event_horizon"
        }
      ]
    },
    c06_event_horizon: {
      chapter: 6,
      title: "The Event Horizon",
      location: "Blackwater City",
      background: "horizon",
      focus: "Julian",
      text: [
        "Julian's connection opens a matte black door in Blackwater. The Event Horizon is neutral ground, if neutral ground can hum with bass, impossible cocktails, and people whose shadows do not obey them.",
        "Kaito, the proprietor, watches your group with the exhausted calm of a man who has banned better-dressed disasters."
      ],
      choices: [
        {
          text: "Slide into the booth across from Camille and let the room watch itself.",
          effects: [
            { type: "relationship", key: "Camille", delta: 2 },
            { type: "relationship", key: "Julian", delta: 1 },
            { type: "stat", key: "foundationPath", delta: 1 },
            { type: "flag", key: "satWithCamille", value: true }
          ],
          next: "c06_theo"
        },
        {
          text: "Claim the spot beside Piper before anyone can make it interesting.",
          effects: [
            { type: "relationship", key: "Piper", delta: 2 },
            { type: "stat", key: "independentPath", delta: 1 },
            { type: "flag", key: "piperPublicClaim", value: true }
          ],
          next: "c06_theo"
        },
        {
          text: "Wave Theo over before he starts measuring the ceiling's anxiety.",
          effects: [
            { type: "relationship", key: "Theo", delta: 2 },
            { type: "stat", key: "contractorPath", delta: 1 },
            { type: "flag", key: "theoIncluded", value: true }
          ],
          next: "c06_theo"
        },
        {
          text: "Let Julian turn the entrance into theater, then admit you enjoy being the person he is performing for.",
          effects: [
            { type: "relationship", key: "Julian", delta: 3 },
            { type: "stat", key: "independentPath", delta: 1 },
            { type: "flag", key: "julianRomance", value: true },
            { type: "flag", key: "julianSpark", value: true }
          ],
          next: "c06_theo"
        }
      ]
    },
    c06_theo: {
      chapter: 6,
      title: "Probability With Garnish",
      location: "The Event Horizon",
      background: "horizon",
      focus: "Theo",
      text: [
        "Theo admits that he does more than calculate probability. Sometimes, if the variables align, he can nudge one branch into being slightly more likely.",
        "Julian immediately turns this knowledge into ambiance. The lights flicker. Kaito does not look up, which lands worse than a warning."
      ],
      choices: [
        {
          text: "Push Theo to live a little, but keep it kind.",
          effects: [
            { type: "relationship", key: "Theo", delta: 1 },
            { type: "relationship", key: "Julian", delta: 1 },
            { type: "stat", key: "independentPath", delta: 1 },
            { type: "flag", key: "theoTeased", value: true }
          ],
          next: "c06_rhea_arrives"
        },
        {
          text: "Respect the anxiety and ask how the nudge actually works.",
          effects: [
            { type: "relationship", key: "Theo", delta: 3 },
            { type: "stat", key: "restraint", delta: 1 },
            { type: "stat", key: "contractorPath", delta: 1 },
            { type: "flag", key: "theoTrusted", value: true }
          ],
          next: "c06_rhea_arrives"
        },
        {
          text: "Tell Julian that Kaito said no powers, and you would like to survive the drink menu.",
          effects: [
            { type: "relationship", key: "Julian", delta: 2 },
            { type: "relationship", key: "Kaito", delta: 1 },
            { type: "flag", key: "noPowersReminder", value: true }
          ],
          next: "c06_rhea_arrives"
        },
        {
          text: "Stay with Theo at the edge of the booth until his breathing steadies.",
          effects: [
            { type: "relationship", key: "Theo", delta: 3 },
            { type: "stat", key: "restraint", delta: 1 },
            { type: "stat", key: "contractorPath", delta: 1 },
            { type: "flag", key: "theoRomance", value: true },
            { type: "flag", key: "theoSpark", value: true }
          ],
          next: "c06_rhea_arrives"
        }
      ]
    },
    c06_rhea_arrives: {
      chapter: 6,
      title: "The Hunter",
      location: "The Event Horizon",
      background: "horizon",
      focus: "Rhea",
      text: [
        "The door opens. A woman in dark tactical gear steps inside with predatory stillness. Conversations thin. Piper goes still near you, all that speed suddenly held behind her teeth.",
        "\"Rhea Kane,\" Piper murmurs. \"Vektor. Not supposed to be anywhere near Aegis.\"",
        "Rhea's smile is not friendly. It is not even amused. It is the expression of someone deciding where to put the first cut."
      ],
      choices: [
        {
          text: "Call across the music: \"The hell do you want?\"",
          effects: [
            { type: "stat", key: "audacity", delta: 2 },
            { type: "stat", key: "exposure", delta: 1 },
            { type: "stat", key: "aegisFear", delta: 1 },
            { type: "stat", key: "villainPath", delta: 1 },
            { type: "flag", key: "challengedRhea", value: true }
          ],
          next: "c06_after_rhea"
        },
        {
          text: "Let Camille lead while you read Rhea's thermal signature.",
          effects: [
            { type: "relationship", key: "Camille", delta: 2 },
            { type: "stat", key: "control", delta: 1 },
            { type: "stat", key: "foundationPath", delta: 1 },
            { type: "flag", key: "deferredToCamille", value: true }
          ],
          next: "c06_after_rhea"
        },
        {
          text: "Check Piper first. Rhea can wait half a second.",
          effects: [
            { type: "relationship", key: "Piper", delta: 2 },
            { type: "relationship", key: "Theo", delta: 1 },
            { type: "stat", key: "heroPath", delta: 1 },
            { type: "flag", key: "protectedPiperFirst", value: true }
          ],
          next: "c06_after_rhea"
        }
      ]
    },
    c06_after_rhea: {
      chapter: 6,
      title: "The Trap Discussion",
      location: "Julian's Apartment",
      background: "city",
      focus: "Camille",
      text: [
        "Rhea leaves without throwing a punch. The absence of violence feels less like mercy than timing.",
        "At Julian's apartment, the group tears the encounter apart. Theo thinks she will strike during a training sim or city leave. Piper wants bait. Julian loves bait because it comes with staging. Camille cares about whether the trap survives contact with the hunter."
      ],
      choices: [
        {
          text: "Agree to bait her in a simulation and make yourself the obvious star.",
          effects: [
            { type: "stat", key: "audacity", delta: 1 },
            { type: "relationship", key: "Camille", delta: 1 },
            { type: "relationship", key: "Theo", delta: 1 },
            { type: "stat", key: "contractorPath", delta: 1 },
            { type: "flag", key: "baitPlan", value: true }
          ],
          next: "c07_bait"
        },
        {
          text: "Insist on looping Vance into the security layer, even if it costs freedom.",
          effects: [
            { type: "relationship", key: "Vance", delta: 2 },
            { type: "stat", key: "restraint", delta: 2 },
            { type: "stat", key: "aegisTrust", delta: 2 },
            { type: "stat", key: "heroPath", delta: 1 },
            { type: "flag", key: "informedVance", value: true }
          ],
          next: "c07_bait"
        },
        {
          text: "\"You point, I shoot.\"",
          effects: [
            { type: "relationship", key: "Piper", delta: 2 },
            { type: "relationship", key: "Julian", delta: 1 },
            { type: "stat", key: "audacity", delta: 1 },
            { type: "stat", key: "villainPath", delta: 1 },
            { type: "flag", key: "cannonPlan", value: true }
          ],
          next: "c07_bait"
        }
      ]
    },
    c07_bait: {
      chapter: 7,
      title: "Bait Wrapped In Bureaucracy",
      location: "Simulation Dome",
      background: "sim",
      focus: "Seth",
      variants: [
        {
          conditions: [{ type: "relationshipAtLeast", key: "Piper", value: 7 }],
          text: ["Piper has stopped running like speed is the whole trick. Her turns cut cleaner now, rescue lines planned three moves ahead instead of improvised on charm."]
        },
        {
          conditions: [{ type: "relationshipAtLeast", key: "Camille", value: 7 }],
          text: ["Camille redirects collapsing debris before it becomes a crisis. Her restraint has sharpened into something that looks almost like mercy until you see what it can stop."]
        },
        {
          conditions: [{ type: "relationshipAtLeast", key: "Julian", value: 7 }],
          text: ["Julian's decoys have improved past simple glamour. They make noise, cast wrong shadows, and carry just enough thermal lie to bother the sim's threat model."]
        },
        {
          conditions: [{ type: "relationshipAtLeast", key: "Theo", value: 7 }],
          text: ["Theo does not sound like a man guessing anymore. His probability nudges arrive as clipped little certainties, each one expensive and necessary."]
        }
      ],
      text: [
        "The official schedule says high-stress urban containment. Unofficially, Julian calls it bait wrapped in bureaucracy.",
        "Piper extracts civilians at impossible speed. Julian throws decoys with your swagger and just enough insulting accuracy. Theo tracks branches until his voice goes thin. Camille says, \"Stay central. Let her come to you.\""
      ],
      choices: [
        {
          text: "Hold central and wait for the cue. No impulse moves.",
          effects: [
            { type: "stat", key: "restraint", delta: 2 },
            { type: "stat", key: "control", delta: 1 },
            { type: "stat", key: "aegisTrust", delta: 1 },
            { type: "flag", key: "listenedToTeam", value: true }
          ],
          next: "c07_rhea_face"
        },
        {
          text: "Flood the dome with a bright energy beacon and dare her to bite.",
          effects: [
            { type: "stat", key: "audacity", delta: 2 },
            { type: "stat", key: "exposure", delta: 2 },
            { type: "stat", key: "aegisFear", delta: 1 },
            { type: "flag", key: "loudBait", value: true }
          ],
          next: "c07_rhea_face"
        },
        {
          text: "Thermal scan without flaring. Let her mistake stillness for ignorance.",
          effects: [
            { type: "stat", key: "control", delta: 2 },
            { type: "relationship", key: "Theo", delta: 1 },
            { type: "flag", key: "thermalScan", value: true }
          ],
          next: "c07_rhea_face"
        },
        {
          text: "Anchor Julian's decoys to your real heat signature so Rhea has to parse the lie.",
          conditions: [
            { type: "relationshipAtLeast", key: "Julian", value: 4 },
            { type: "any", conditions: [
              { type: "flag", key: "thermalScan" },
              { type: "flag", key: "cleanFlame" },
              { type: "statAtLeast", key: "control", value: 5 }
            ] }
          ],
          effects: [
            { type: "relationship", key: "Julian", delta: 2 },
            { type: "stat", key: "control", delta: 1 },
            { type: "flag", key: "julianHeatAnchors", value: true }
          ],
          next: "c07_rhea_face"
        }
      ]
    },
    c07_rhea_face: {
      chapter: 7,
      title: "Pretty Star",
      location: "Simulation Dome",
      background: "sim",
      focus: "Rhea",
      text: [
        "A holographic civilian dissolves. Rhea Kane stands ten feet away, hands in her pockets, smiling like she has been there the whole time.",
        "\"No flinch,\" she says. \"No panic. Just assessment. You're not what I expected from the brochure.\"",
        "The dome goes quiet enough for your heartbeat to sound tactical."
      ],
      choices: [
        {
          text: "Use your practiced cold control: take heat, light, motion, and leave her in cosmic stillness.",
          conditions: [
            { type: "any", conditions: [
              { type: "statAtLeast", key: "cold", value: 3 },
              { type: "flag", key: "coldFocus" },
              { type: "flag", key: "coldInstinct" }
            ] }
          ],
          effects: [
            { type: "stat", key: "cold", delta: 2 },
            { type: "stat", key: "audacity", delta: 1 },
            { type: "flag", key: "cosmicCold", value: true }
          ],
          next: "c07_grapple"
        },
        {
          text: "Apply the Sim Block C lesson: contain first, remove exits second.",
          conditions: [
            { type: "any", conditions: [
              { type: "flag", key: "trainedContainment" },
              { type: "flag", key: "readTheSim" },
              { type: "statAtLeast", key: "restraint", value: 5 }
            ] }
          ],
          effects: [
            { type: "stat", key: "restraint", delta: 2 },
            { type: "stat", key: "control", delta: 1 },
            { type: "flag", key: "containmentOpening", value: true }
          ],
          next: "c07_grapple"
        },
        {
          text: "Load a heat-plasma response and make sure she sees the warning before it fires.",
          conditions: [
            { type: "any", conditions: [
              { type: "statAtLeast", key: "heat", value: 3 },
              { type: "flag", key: "containedSun" },
              { type: "flag", key: "heatInstinct" }
            ] }
          ],
          effects: [
            { type: "stat", key: "heat", delta: 1 },
            { type: "stat", key: "audacity", delta: 1 },
            { type: "stat", key: "aegisFear", delta: 1 },
            { type: "flag", key: "lethalCharge", value: true }
          ],
          next: "c07_grapple"
        },
        {
          text: "Trust the newest edge of your power, the part Aegis does not have a clean label for yet.",
          conditions: [{ type: "powerLevelAtLeast", value: 4 }],
          effects: [
            { type: "stat", key: "control", delta: 2 },
            { type: "powerXp", amount: 2 },
            { type: "stat", key: "exposure", delta: 1 },
            { type: "flag", key: "powerBreakthrough", value: true }
          ],
          next: "c07_grapple"
        },
        {
          text: "Drain the space around her without committing to the kill.",
          effects: [
            { type: "stat", key: "restraint", delta: 2 },
            { type: "stat", key: "control", delta: 1 },
            { type: "flag", key: "triedContainment", value: true }
          ],
          next: "c07_grapple"
        },
        {
          text: "Keep her talking long enough to draw out why Vektor marked you.",
          effects: [
            { type: "relationship", key: "Theo", delta: 1 },
            { type: "relationship", key: "Julian", delta: 1 },
            { type: "flag", key: "gotVektorHint", value: true }
          ],
          next: "c07_grapple_dialogue"
        }
      ]
    },
    c07_grapple_dialogue: {
      chapter: 7,
      title: "The Mark",
      location: "Simulation Dome",
      background: "sim",
      focus: "Rhea",
      text: [
        "Rhea appreciates the question enough to make it worse.",
        "\"Vektor likes systems,\" she says. \"Locks. Doors. People who think they are doors. You? You look like a key that forgot it was a bomb.\"",
        "Theo swears over comms. Camille says, \"Enough.\" Piper is already closing in."
      ],
      choices: [
        {
          text: "Grab Rhea before she can turn the reveal into another trick.",
          effects: [
            { type: "stat", key: "control", delta: 1 },
            { type: "flag", key: "rheaGrabbedAfterHint", value: true }
          ],
          next: "c07_grapple"
        },
        {
          text: "Signal Piper to cut off the exit while you keep Rhea focused.",
          effects: [
            { type: "relationship", key: "Piper", delta: 2 },
            { type: "stat", key: "restraint", delta: 1 },
            { type: "flag", key: "piperCutsExit", value: true }
          ],
          next: "c07_grapple"
        }
      ]
    },
    c07_grapple: {
      chapter: 7,
      title: "Contact",
      location: "Simulation Dome",
      background: "sim",
      focus: "Seth",
      text: [
        "Your hand closes around Rhea's forearm. She is warm. Alive. Adapting faster than any model Theo can say out loud.",
        "You feel muscles, nerves, heat, electrical impulse, kinetic potential. All of it can be taken. All of it can be stopped.",
        "Piper appears at the edge of the frozen zone. \"Seth,\" she says, low and urgent."
      ],
      variants: [
        {
          conditions: [{ type: "flag", key: "julianHeatAnchors" }],
          text: ["One of Julian's anchored decoys collapses behind Rhea at exactly the right second. It buys you a cleaner grip than you deserved."]
        },
        {
          conditions: [{ type: "flag", key: "piperCutsExit" }],
          text: ["Piper is already blocking the escape lane before Rhea finishes smiling. That is what trust looks like at speed."]
        },
        {
          conditions: [{ type: "flag", key: "containmentOpening" }],
          text: ["The containment pattern is not instinct anymore. It is trained muscle, cold logic, and Camille's voice in your memory saying destruction is rarely clean."]
        },
        {
          conditions: [{ type: "flag", key: "powerBreakthrough" }],
          text: ["The new layer opens under your skin like a trapdoor. Not more force exactly. More authority. Rhea feels it too, and for the first time her smile misses a beat."]
        },
        {
          conditions: [{ type: "powerIs", value: "energy" }],
          text: ["Your reservoir does what reservoirs do: it takes in catastrophe and waits for you to decide what shape catastrophe should have on the way out."]
        },
        {
          conditions: [{ type: "powerIs", value: "gravity" }],
          text: ["Weight becomes a language under your palm. Rhea's balance, your stance, the dome itself: all of it starts negotiating with you at once."]
        },
        {
          conditions: [{ type: "powerIs", value: "chronal" }],
          text: ["The second stretches thin enough to show its threads. Rhea is still fast, but fast means less when the moment itself has to ask your permission."]
        },
        {
          conditions: [{ type: "powerIs", value: "bio" }],
          text: ["Her adaptations speak in pulse, nerve, blood, and pain. Your power answers in the same language, intimate enough to be terrifying."]
        },
        {
          conditions: [{ type: "powerIs", value: "tech" }],
          text: ["The dome telemetry stutters. Sensors, locks, lights, emergency gates: the machines taste your signal and hesitate like witnesses changing testimony."]
        },
        {
          conditions: [{ type: "powerIs", value: "space" }],
          text: ["Distance buckles around your grip. Rhea is ten feet away and nowhere to run, both true, both suddenly your decision."]
        }
      ],
      choices: [
        {
          text: "Immobilize her completely, then finish it with lightning.",
          conditions: [
            { type: "any", conditions: [
              { type: "flag", key: "cosmicCold" },
              { type: "flag", key: "lethalCharge" },
              { type: "flag", key: "trainedAbsorption" },
              { type: "statAtLeast", key: "audacity", value: 6 }
            ] }
          ],
          effects: [
            { type: "stat", key: "audacity", delta: 2 },
            { type: "stat", key: "control", delta: 1 },
            { type: "stat", key: "aegisFear", delta: 3 },
            { type: "stat", key: "villainPath", delta: 2 },
            { type: "relationship", key: "Piper", delta: 1 },
            { type: "relationship", key: "Theo", delta: -1 },
            { type: "flag", key: "rheaErased", value: true },
            { type: "status", key: "condition", value: "Drained, standing" },
            { type: "status", key: "energy", value: "Critical discharge spent" },
            { type: "status", key: "stress", value: "Shock masked by adrenaline" },
            { type: "status", key: "classification", value: "Unbounded event under review" },
            { type: "status", key: "lastFight", value: "Rhea Kane erased" }
          ],
          next: "c07_afteraction_erased"
        },
        {
          text: "Maintain containment and call Camille to lock the field with you.",
          conditions: [
            { type: "any", conditions: [
              { type: "flag", key: "triedContainment" },
              { type: "flag", key: "containmentOpening" },
              { type: "relationshipAtLeast", key: "Camille", value: 6 },
              { type: "statAtLeast", key: "restraint", value: 6 }
            ] }
          ],
          effects: [
            { type: "stat", key: "restraint", delta: 3 },
            { type: "stat", key: "control", delta: 1 },
            { type: "stat", key: "aegisTrust", delta: 3 },
            { type: "stat", key: "contractorPath", delta: 1 },
            { type: "relationship", key: "Camille", delta: 2 },
            { type: "relationship", key: "Theo", delta: 1 },
            { type: "flag", key: "rheaContained", value: true },
            { type: "status", key: "condition", value: "Severe strain, no injury" },
            { type: "status", key: "energy", value: "Massive cold sink active" },
            { type: "status", key: "stress", value: "High but controlled" },
            { type: "status", key: "classification", value: "Containment anomaly" },
            { type: "status", key: "lastFight", value: "Rhea Kane contained" }
          ],
          next: "c07_afteraction_contained"
        },
        {
          text: "Trust Piper to break the contact window while Theo calls the safest branch.",
          conditions: [
            { type: "relationshipAtLeast", key: "Piper", value: 7 },
            { type: "relationshipAtLeast", key: "Theo", value: 5 }
          ],
          effects: [
            { type: "stat", key: "restraint", delta: 2 },
            { type: "stat", key: "control", delta: 1 },
            { type: "relationship", key: "Piper", delta: 2 },
            { type: "relationship", key: "Theo", delta: 2 },
            { type: "stat", key: "aegisTrust", delta: 2 },
            { type: "flag", key: "teamSave", value: true },
            { type: "flag", key: "rheaContained", value: true },
            { type: "status", key: "condition", value: "Shaken, supported" },
            { type: "status", key: "energy", value: "Shared containment discharge" },
            { type: "status", key: "stress", value: "High, stabilized by team" },
            { type: "status", key: "classification", value: "Team-linked anomaly" },
            { type: "status", key: "lastFight", value: "Rhea Kane contained by team action" }
          ],
          next: "c07_afteraction_contained"
        },
        {
          text: "Release enough force to throw her out of the dome instead of killing her.",
          effects: [
            { type: "stat", key: "audacity", delta: 1 },
            { type: "stat", key: "exposure", delta: 2 },
            { type: "stat", key: "collateral", delta: 1 },
            { type: "stat", key: "aegisFear", delta: 2 },
            { type: "relationship", key: "Piper", delta: -1 },
            { type: "flag", key: "rheaEscaped", value: true },
            { type: "status", key: "condition", value: "Bruised by recoil" },
            { type: "status", key: "energy", value: "Unstable reserve spike" },
            { type: "status", key: "stress", value: "High" },
            { type: "status", key: "classification", value: "Breach risk" },
            { type: "status", key: "lastFight", value: "Rhea Kane escaped" }
          ],
          next: "c07_afteraction_escaped"
        },
        {
          text: "Try to hold everyone safe at once, even if it means losing her.",
          conditions: [
            { type: "statAtLeast", key: "heroPath", value: 2 },
            { type: "notFlag", key: "cosmicCold" }
          ],
          effects: [
            { type: "stat", key: "restraint", delta: 2 },
            { type: "stat", key: "heroPath", delta: 1 },
            { type: "relationship", key: "Vance", delta: 1 },
            { type: "relationship", key: "Piper", delta: 1 },
            { type: "flag", key: "savedCiviliansLostRhea", value: true },
            { type: "flag", key: "rheaEscaped", value: true },
            { type: "status", key: "condition", value: "Uninjured, furious" },
            { type: "status", key: "energy", value: "Containment spent on evacuation" },
            { type: "status", key: "stress", value: "High" },
            { type: "status", key: "classification", value: "Protective asset" },
            { type: "status", key: "lastFight", value: "Civilians saved, Rhea escaped" }
          ],
          next: "c07_afteraction_escaped"
        }
      ]
    },
    c07_afteraction_erased: {
      chapter: 7,
      title: "After-Action: Erasure",
      location: "Simulation Dome",
      background: "sim",
      focus: "Piper",
      statusReport: true,
      variants: [
        {
          conditions: [{ type: "relationshipAtLeast", key: "Ben", value: 3 }],
          text: ["Ben is waiting outside medical with a steady look and no stupid questions. That kind of normal lands harder than applause."]
        },
        {
          conditions: [{ type: "relationshipAtLeast", key: "Jordan", value: 3 }],
          text: ["Jordan catches one look at your face and stops three separate rumors before they grow teeth. For once, gossip works in your favor."]
        },
        {
          conditions: [{ type: "relationshipAtLeast", key: "Rina", value: 2 }],
          text: ["Rina watches the security response from the far end of the corridor. There is rivalry in her stare still, but less doubt than before."]
        }
      ],
      text: [
        "The dome goes white. Thunder detonates inside the simulation walls. When the light fades, Rhea Kane is gone and the floor remembers her as a crater.",
        "Piper reaches you first, hands on your shoulders, eyes bright with shock and relief. Camille's report is clinical. Theo's tablet shakes. Julian still finds room for one sharp line because performance is easier than panic.",
        "Commandant Vance arrives with security and the expression of someone watching an asset become a category problem."
      ],
      choices: [
        {
          text: "Give the debrief clinically: containment failed, lethal force was necessary.",
          effects: [
            { type: "relationship", key: "Vance", delta: 2 },
            { type: "relationship", key: "Camille", delta: 1 },
            { type: "stat", key: "restraint", delta: 1 },
            { type: "stat", key: "aegisTrust", delta: 1 },
            { type: "stat", key: "contractorPath", delta: 1 },
            { type: "flag", key: "clinicalDebrief", value: true }
          ],
          next: "c08_airbase"
        },
        {
          text: "\"Don't fuck with us.\" Let the statement stand.",
          effects: [
            { type: "relationship", key: "Piper", delta: 2 },
            { type: "relationship", key: "Julian", delta: 1 },
            { type: "stat", key: "exposure", delta: 1 },
            { type: "stat", key: "aegisFear", delta: 1 },
            { type: "stat", key: "independentPath", delta: 1 },
            { type: "flag", key: "dontFuckWithUs", value: true }
          ],
          next: "c08_airbase"
        },
        {
          text: "Admit to Piper that it shook you more than you want to show.",
          effects: [
            { type: "relationship", key: "Piper", delta: 3 },
            { type: "relationship", key: "Theo", delta: 2 },
            { type: "stat", key: "restraint", delta: 1 },
            { type: "stat", key: "heroPath", delta: 1 },
            { type: "flag", key: "vulnerableAfterRhea", value: true }
          ],
          next: "c08_airbase"
        }
      ]
    },
    c07_afteraction_contained: {
      chapter: 7,
      title: "After-Action: Stasis",
      location: "Simulation Dome",
      background: "sim",
      focus: "Camille",
      statusReport: true,
      variants: [
        {
          conditions: [{ type: "flag", key: "teamSave" }],
          text: ["No one gets the victory alone. Piper's timing, Theo's branch call, Camille's lock, and your absorption field leave a cleaner kind of silence behind."]
        },
        {
          conditions: [{ type: "relationshipAtLeast", key: "Rina", value: 2 }],
          text: ["Rina finds you afterward and says only, \"That was cleaner than I expected.\" From her, it almost counts as flowers."]
        }
      ],
      text: [
        "Camille's force redirection locks into your cold sink with surgical precision. Rhea freezes in a field that contains motion, heat, and the nasty little adaptations still trying to crawl through her body.",
        "Security floods the dome. Vance looks at Rhea, then at you, and understands that the restraint was not a lack of power. It was the more frightening option.",
        "Theo looks like he might cry from relief or math. Possibly both."
      ],
      choices: [
        {
          text: "Give Vance every detail and insist Rhea is still dangerous.",
          effects: [
            { type: "relationship", key: "Vance", delta: 2 },
            { type: "relationship", key: "Theo", delta: 1 },
            { type: "stat", key: "restraint", delta: 1 },
            { type: "stat", key: "aegisTrust", delta: 2 },
            { type: "stat", key: "heroPath", delta: 1 },
            { type: "flag", key: "warnedVanceRhea", value: true }
          ],
          next: "c08_airbase"
        },
        {
          text: "Thank Camille for catching the field at the right second.",
          effects: [
            { type: "relationship", key: "Camille", delta: 2 },
            { type: "stat", key: "control", delta: 1 },
            { type: "stat", key: "foundationPath", delta: 1 },
            { type: "flag", key: "thankedCamilleField", value: true }
          ],
          next: "c08_airbase"
        },
        {
          text: "Check Piper first. The report can wait one breath.",
          effects: [
            { type: "relationship", key: "Piper", delta: 2 },
            { type: "stat", key: "independentPath", delta: 1 },
            { type: "flag", key: "checkedPiperAfterContainment", value: true }
          ],
          next: "c08_airbase"
        }
      ]
    },
    c07_afteraction_escaped: {
      chapter: 7,
      title: "After-Action: Breach",
      location: "Simulation Dome",
      background: "sim",
      focus: "Rhea",
      statusReport: true,
      variants: [
        {
          conditions: [{ type: "relationshipAtLeast", key: "Jordan", value: 3 }],
          text: ["Jordan's whisper network lights up before the official alert finishes cycling. He cannot erase the breach, but he can muddy who gets blamed for it."]
        },
        {
          conditions: [{ type: "relationshipAtLeast", key: "Ben", value: 3 }],
          text: ["Ben stays close during the walk to medical, one calm body between you and the stares. It is not a solution, but it is a brace."]
        }
      ],
      text: [
        "Your blast folds the dome's false street around Rhea and throws her through the breach doors. By the time security systems recover, she is gone.",
        "Piper does not yell. Her restraint lands harder than anger. Camille's silence is a scalpel. Theo keeps repeating the same probability under his breath, as if saying the number enough times might make it smaller.",
        "Vance arrives to a damaged dome, a living threat in the wind, and your name at the center of the report."
      ],
      choices: [
        {
          text: "Own the mistake and ask Vance for pursuit authority.",
          effects: [
            { type: "relationship", key: "Vance", delta: 1 },
            { type: "stat", key: "restraint", delta: 1 },
            { type: "stat", key: "aegisTrust", delta: 1 },
            { type: "stat", key: "heroPath", delta: 1 },
            { type: "flag", key: "askedPursuitAuthority", value: true }
          ],
          next: "c08_airbase"
        },
        {
          text: "Tell Piper you will finish it if Rhea comes near her again.",
          effects: [
            { type: "relationship", key: "Piper", delta: 1 },
            { type: "stat", key: "audacity", delta: 1 },
            { type: "stat", key: "villainPath", delta: 1 },
            { type: "flag", key: "promisedFinishRhea", value: true }
          ],
          next: "c08_airbase"
        },
        {
          text: "Ask Theo to find the branch where she runs next.",
          effects: [
            { type: "relationship", key: "Theo", delta: 2 },
            { type: "stat", key: "contractorPath", delta: 1 },
            { type: "flag", key: "theoTracksRhea", value: true }
          ],
          next: "c08_airbase"
        }
      ]
    },
    c08_airbase: {
      chapter: 8,
      title: "Mach Five",
      location: "Aegis Airbase",
      background: "aegis",
      focus: "Piper",
      variants: [
        {
          conditions: [{ type: "flag", key: "piperRomance" }],
          text: ["Piper sells the airbase idea with affection and challenge braided together: she wants to know exactly what you can catch."]
        },
        {
          conditions: [{ type: "flag", key: "piperSlowBurn" }],
          text: ["Piper keeps the airbase mood bright and dangerous, leaving the charge between you unnamed. Whatever it is, it still has weight."]
        },
        {
          conditions: [{ type: "flag", key: "piperTrustedPartner" }],
          text: ["Piper frames the airbase test as partnership, not romance: trust, velocity, and the frankly unreasonable confidence that you can hold still when physics tries to file a complaint."]
        },
        {
          conditions: [{ type: "flag", key: "rheaErased" }],
          text: ["Rhea's crater is still in everyone's head when Piper pulls you toward the airbase. Her answer to fear is practical and reckless: prove there is at least one impossible force you can catch without flinching."]
        },
        {
          conditions: [{ type: "flag", key: "rheaContained" }],
          text: ["Rhea is alive in a stasis cell, and that makes the air feel heavier. Piper decides the next useful step is proving there is at least one force in the world you can catch without hesitation."]
        },
        {
          conditions: [{ type: "flag", key: "rheaEscaped" }],
          text: ["Rhea is loose. Nobody says it while you walk to the airbase. Piper's jaw is set, and every training pass looks a little like a promise."]
        },
        {
          conditions: [{ type: "relationshipAtLeast", key: "Piper", value: 9 }],
          text: ["Piper's acceleration has changed since the first week. It is not just faster; it is smarter, layered with feints, pressure changes, and enough trust to aim all of it at you."]
        },
        {
          conditions: [{ type: "relationshipAtLeast", key: "Camille", value: 9 }],
          text: ["Camille has the observation field tuned before anyone asks. She is not catching Piper. She is catching the consequences of Piper, which may be harder."]
        },
        {
          conditions: [{ type: "relationshipAtLeast", key: "Julian", value: 8 }],
          text: ["Julian throws a glamour overlay across the runway so the shockwave paints itself in color. It is obnoxious, useful, and technically beautiful."]
        },
        {
          conditions: [{ type: "relationshipAtLeast", key: "Theo", value: 8 }],
          text: ["Theo has three abort branches ready and one branch he refuses to name. The confidence in his voice is new. The fear is still there, just better trained."]
        },
        {
          conditions: [{ type: "powerIs", value: "gravity" }],
          text: ["For you, catching Piper means catching momentum, mass, and the runway's argument with both of them."]
        },
        {
          conditions: [{ type: "powerIs", value: "chronal" }],
          text: ["For you, catching Piper means choosing which fraction of the impact gets to happen first."]
        },
        {
          conditions: [{ type: "powerIs", value: "bio" }],
          text: ["For you, catching Piper means reading the living stress of two bodies before physics writes the bruise."]
        },
        {
          conditions: [{ type: "powerIs", value: "tech" }],
          text: ["For you, catching Piper means the runway sensors, telemetry drones, and warning lights all become part of your nervous system."]
        },
        {
          conditions: [{ type: "powerIs", value: "space" }],
          text: ["For you, catching Piper means deciding how much runway needs to exist between arrival and impact."]
        }
      ],
      text: [
        "Piper stands at the far end of the strip, blonde hair bright in the late light. \"Rule one: don't move. Rule two: absorb the kinetic energy, not the field. Rule three: try not to fly into the ocean.\"",
        "Camille, Julian, and Theo appear at the edge of the grounds, drawn by concern, curiosity, and whatever Julian is calling professional interest today."
      ],
      choices: [
        {
          text: "Start at Mach 2. Prove the baseline before getting stupid.",
          effects: [
            { type: "stat", key: "control", delta: 1 },
            { type: "relationship", key: "Piper", delta: 1 },
            { type: "powerXp", amount: 2 },
            { type: "stat", key: "aegisTrust", delta: 1 },
            { type: "status", key: "energy", value: "Kinetic charge rising" }
          ],
          next: "c08_mach5"
        },
        {
          text: "\"Mach 3, Lane. Make it count.\"",
          conditions: [{ type: "flag", key: "piperRomance" }],
          effects: [
            { type: "relationship", key: "Piper", delta: 2 },
            { type: "stat", key: "audacity", delta: 1 },
            { type: "powerXp", amount: 3 },
            { type: "stat", key: "independentPath", delta: 1 },
            { type: "status", key: "energy", value: "Heavy kinetic load" },
            { type: "flag", key: "machThree", value: true }
          ],
          next: "c08_mach5"
        },
        {
          text: "Set Mach 3 as the hard bracket and make it a clean data run.",
          conditions: [{ type: "notFlag", key: "piperRomance" }],
          effects: [
            { type: "relationship", key: "Piper", delta: 1 },
            { type: "relationship", key: "Theo", delta: 1 },
            { type: "stat", key: "control", delta: 1 },
            { type: "powerXp", amount: 3 },
            { type: "stat", key: "aegisTrust", delta: 1 },
            { type: "status", key: "energy", value: "Heavy kinetic load" },
            { type: "flag", key: "machThree", value: true }
          ],
          next: "c08_mach5"
        },
        {
          text: "Whisper \"Mach 5\" and warn the observers not to get blown away.",
          effects: [
            { type: "relationship", key: "Piper", delta: 3 },
            { type: "stat", key: "audacity", delta: 2 },
            { type: "powerXp", amount: 4 },
            { type: "stat", key: "exposure", delta: 1 },
            { type: "stat", key: "aegisFear", delta: 1 },
            { type: "status", key: "energy", value: "Massive kinetic load contained" },
            { type: "flag", key: "machFive", value: true }
          ],
          next: "c08_mach5"
        }
      ]
    },
    c08_mach5: {
      chapter: 8,
      title: "After-Action: Speedster Impact",
      location: "Aegis Airbase",
      background: "aegis",
      focus: "Piper",
      statusReport: true,
      variants: [
        {
          conditions: [{ type: "relationshipAtLeast", key: "Rina", value: 2 }],
          text: ["Rina hears about the run before the dust settles. By dinner, she has already challenged Piper to a race she absolutely should not be allowed to schedule."]
        },
        {
          conditions: [{ type: "relationshipAtLeast", key: "Camille", value: 8 }],
          text: ["Camille watches the Mach test like it confirms three theories and creates four worse ones."]
        }
      ],
      text: [
        "Piper vanishes. The impact never moves you. You catch her in your arms as the sonic boom arrives late and shakes the runway around you.",
        "Julian applauds. Theo looks like he is about to submit a formal complaint to physics. Camille watches you like she just saw a boundary turn into a weapon.",
        "All that kinetic energy sits inside you, enormous and obedient."
      ],
      choices: [
        {
          text: "Do not release it. Let restraint be the point.",
          effects: [
            { type: "stat", key: "restraint", delta: 2 },
            { type: "relationship", key: "Piper", delta: 1 },
            { type: "relationship", key: "Theo", delta: 1 },
            { type: "stat", key: "aegisTrust", delta: 1 },
            { type: "stat", key: "civilianPath", delta: 1 },
            { type: "status", key: "stress", value: "Settling" },
            { type: "flag", key: "heldMachEnergy", value: true }
          ],
          next: "c09_graduation_eve"
        },
        {
          text: "Ask if you should release it, purely to watch Theo suffer.",
          effects: [
            { type: "stat", key: "audacity", delta: 1 },
            { type: "relationship", key: "Julian", delta: 1 },
            { type: "relationship", key: "Camille", delta: 1 },
            { type: "stat", key: "foundationPath", delta: 1 },
            { type: "flag", key: "jokedReleaseMach", value: true }
          ],
          next: "c09_graduation_eve"
        },
        {
          text: "Bleed a harmless aurora across the runway lights to prove control.",
          effects: [
            { type: "stat", key: "control", delta: 2 },
            { type: "stat", key: "exposure", delta: 1 },
            { type: "relationship", key: "Vance", delta: 1 },
            { type: "stat", key: "aegisTrust", delta: 1 },
            { type: "stat", key: "contractorPath", delta: 1 },
            { type: "flag", key: "kineticAurora", value: true }
          ],
          next: "c09_graduation_eve"
        }
      ]
    },
    c09_graduation_eve: {
      chapter: 9,
      title: "Pizza After Thunder",
      location: "Blackwater Restaurant",
      background: "city",
      focus: "Julian",
      text: [
        "Julian knows a discreet pizza place with private booths and food too expensive to call comfort food. The five of you end up in the back, carrying the emotional hangover of a day that should have been three separate emergencies.",
        "Graduation is tomorrow. After that, Aegis stops being home base and starts being a place that might file reports about you."
      ],
      choices: [
        {
          text: "Ask Camille, Julian, and Theo what they intend to do after Aegis.",
          effects: [
            { type: "relationship", key: "Camille", delta: 1 },
            { type: "relationship", key: "Julian", delta: 1 },
            { type: "relationship", key: "Theo", delta: 1 },
            { type: "stat", key: "foundationPath", delta: 1 },
            { type: "flag", key: "askedTheirFutures", value: true }
          ],
          next: "c09_walk_piper"
        },
        {
          text: "Test the waters with \"theatrical adventures\" and watch who flinches.",
          effects: [
            { type: "stat", key: "audacity", delta: 1 },
            { type: "relationship", key: "Julian", delta: 2 },
            { type: "relationship", key: "Camille", delta: 1 },
            { type: "stat", key: "independentPath", delta: 1 },
            { type: "flag", key: "testedWaters", value: true }
          ],
          next: "c09_walk_piper"
        },
        {
          text: "Keep dinner light. Give everyone one night without a mission briefing.",
          effects: [
            { type: "stat", key: "restraint", delta: 1 },
            { type: "relationship", key: "Piper", delta: 1 },
            { type: "stat", key: "civilianPath", delta: 1 },
            { type: "flag", key: "delayedReveal", value: true }
          ],
          next: "c09_walk_piper"
        },
        {
          text: "Ask Camille for ten minutes after dinner where neither of you pretends this is only strategy.",
          conditions: [{ type: "flag", key: "camilleRomance" }],
          effects: [
            { type: "relationship", key: "Camille", delta: 2 },
            { type: "stat", key: "resolve", delta: 1 },
            { type: "stat", key: "foundationPath", delta: 1 },
            { type: "flag", key: "camilleCommitted", value: true }
          ],
          next: "c09_walk_piper"
        },
        {
          text: "Let Julian walk you out and ask which part of the performance was for everyone else.",
          conditions: [{ type: "flag", key: "julianRomance" }],
          effects: [
            { type: "relationship", key: "Julian", delta: 2 },
            { type: "stat", key: "audacity", delta: 1 },
            { type: "stat", key: "independentPath", delta: 1 },
            { type: "flag", key: "julianCommitted", value: true }
          ],
          next: "c09_walk_piper"
        },
        {
          text: "Stay back with Theo and make one clear promise: fear gets a seat, not the steering wheel.",
          conditions: [{ type: "flag", key: "theoRomance" }],
          effects: [
            { type: "relationship", key: "Theo", delta: 2 },
            { type: "stat", key: "restraint", delta: 1 },
            { type: "stat", key: "contractorPath", delta: 1 },
            { type: "flag", key: "theoCommitted", value: true }
          ],
          next: "c09_walk_piper"
        }
      ]
    },
    c09_walk_piper: {
      chapter: 9,
      title: "Holding Pattern",
      location: "Campus Path",
      background: "aegis",
      focus: "Piper",
      text: [
        "Walking back through Aegis for the last time feels heavier than either of you expected. Piper says the dorms were never a life so much as a holding pattern. The grey area beyond the gates is the only place that feels real.",
        "The plan you two have been circling finally has shape: hit predatory corporate money, build a legitimate charity front, help people, live well, stay faster than the story they tell about you."
      ],
      variants: [
        {
          conditions: [{ type: "flag", key: "piperRomance" }],
          text: ["With Piper, the plan feels intimate before it feels strategic. She is not just in the getaway route. She is in the reason you keep testing exits at all."]
        },
        {
          conditions: [{ type: "flag", key: "piperSlowBurn" }],
          text: ["With Piper, the plan keeps a grin on it. Neither of you names the charge directly, so every practical detail starts to feel like a dare."]
        },
        {
          conditions: [{ type: "flag", key: "piperTrustedPartner" }],
          text: ["With Piper, the plan feels like a pact between capable people. Trust does not have to be romantic to be dangerous."]
        },
        {
          conditions: [
            { type: "matureContent" },
            { type: "flag", key: "piperRomance" }
          ],
          text: ["The private part of the night stays private: a closed door, a shared laugh, and the rare luxury of wanting something that is not tactical."]
        },
        {
          conditions: [{ type: "flag", key: "camilleCommitted" }],
          text: ["Piper clocks the Camille situation with one raised eyebrow and exactly zero mercy. Then she gets practical, because complicated feelings are still allowed to have getaway routes."]
        },
        {
          conditions: [
            { type: "matureContent" },
            { type: "flag", key: "camilleCommitted" }
          ],
          text: ["Camille's goodbye is controlled enough to be deniable and direct enough that neither of you bothers denying it once the hallway turns quiet."]
        },
        {
          conditions: [{ type: "flag", key: "julianCommitted" }],
          text: ["Julian's goodbye lingers behind you like cologne and a dare. Piper notices, files the information for future blackmail, and keeps walking."]
        },
        {
          conditions: [
            { type: "matureContent" },
            { type: "flag", key: "julianCommitted" }
          ],
          text: ["Julian leaves spectacle at the door for once. What remains is still dramatic, just softer, and not something he intends to let the others narrate."]
        },
        {
          conditions: [{ type: "flag", key: "theoCommitted" }],
          text: ["Theo's promise stays with you as you walk. Piper does not make a joke about it, which is how you know she understands it matters."]
        },
        {
          conditions: [
            { type: "matureContent" },
            { type: "flag", key: "theoCommitted" }
          ],
          text: ["Theo's version of bold is quiet: fingers linked, forehead against yours, no audience, no probability model, just the decision to stay in the room."]
        }
      ],
      choices: [
        {
          text: "Test Piper's resolve. Ask if she would rather go sanctioned after all.",
          effects: [
            { type: "relationship", key: "Piper", delta: 2 },
            { type: "stat", key: "resolve", delta: 1 },
            { type: "stat", key: "independentPath", delta: 1 },
            { type: "flag", key: "testedPiperResolve", value: true }
          ],
          next: "c09_plan_reveal"
        },
        {
          text: "Admit the hero route would be easier, even if it would feel smaller.",
          effects: [
            { type: "stat", key: "restraint", delta: 1 },
            { type: "relationship", key: "Piper", delta: 1 },
            { type: "stat", key: "heroPath", delta: 1 },
            { type: "stat", key: "civilianPath", delta: 1 },
            { type: "flag", key: "heroRouteDoubt", value: true }
          ],
          next: "c09_plan_reveal"
        },
        {
          text: "Joke that you could both be regular villains, then make clear you mean better than that.",
          effects: [
            { type: "stat", key: "audacity", delta: 1 },
            { type: "relationship", key: "Piper", delta: 1 },
            { type: "stat", key: "villainPath", delta: 1 },
            { type: "flag", key: "villainJoke", value: true }
          ],
          next: "c09_plan_reveal"
        }
      ]
    },
    c09_plan_reveal: {
      chapter: 9,
      title: "Say It Out Loud",
      location: "Residence Elevator",
      background: "aegis",
      focus: "Piper",
      text: [
        "Piper says disappearing would be easy. She does not want easy. She wants to build something.",
        "You both know the next move changes the shape of your friendships. Tell the others, and they become witnesses or accomplices. Do not tell them, and you start the future with a lie."
      ],
      choices: [
        {
          text: "After graduation, invite the five to dinner and tell them everything.",
          effects: [
            { type: "relationship", key: "Piper", delta: 2 },
            { type: "stat", key: "resolve", delta: 2 },
            { type: "stat", key: "independentPath", delta: 2 },
            { type: "flag", key: "revealPlan", value: true }
          ],
          next: "c10_graduation"
        },
        {
          text: "Disappear with Piper first. Build the operation before asking anyone to risk themselves.",
          effects: [
            { type: "relationship", key: "Piper", delta: 1 },
            { type: "stat", key: "restraint", delta: 1 },
            { type: "stat", key: "independentPath", delta: 1 },
            { type: "stat", key: "villainPath", delta: 1 },
            { type: "flag", key: "disappearPlan", value: true }
          ],
          next: "c10_graduation"
        },
        {
          text: "Postpone the reveal until you have a real target and not just a manifesto.",
          effects: [
            { type: "relationship", key: "Theo", delta: 1 },
            { type: "stat", key: "restraint", delta: 1 },
            { type: "stat", key: "contractorPath", delta: 1 },
            { type: "flag", key: "postponePlan", value: true }
          ],
          next: "c10_graduation"
        }
      ]
    },
    c10_graduation: {
      chapter: 10,
      title: "The Folder",
      location: "Aegis Atrium",
      background: "graduation",
      focus: "Seth",
      text: [
        "Graduation smells like floor polish and speeches about responsibility. Commandant Vance's handshake gives away nothing. Your folder certifies control. Piper's grin suggests the folder is only part of the story.",
        "Afterward, the atrium buzzes with people trying to say goodbye without admitting they are terrified of the next door.",
        "Camille is near the refreshment table. Julian is holding court. Theo is near the exit, gripping his folder like a shield."
      ],
      choices: [
        {
          text: "Make the dinner a stage: expensive, formal, all five of you.",
          effects: [
            { type: "relationship", key: "Julian", delta: 2 },
            { type: "relationship", key: "Camille", delta: 1 },
            { type: "stat", key: "foundationPath", delta: 1 },
            { type: "flag", key: "dinnerStage", value: true }
          ],
          next: "c10_dinner_reveal"
        },
        {
          text: "Invite Theo warmly. Inner circle means him too.",
          effects: [
            { type: "relationship", key: "Theo", delta: 3 },
            { type: "stat", key: "contractorPath", delta: 1 },
            { type: "flag", key: "theoInnerCircle", value: true }
          ],
          next: "c10_dinner_reveal"
        },
        {
          text: "Keep Piper close and call it a celebration when Camille asks.",
          effects: [
            { type: "relationship", key: "Piper", delta: 2 },
            { type: "stat", key: "independentPath", delta: 1 },
            { type: "flag", key: "piperFinalClaim", value: true }
          ],
          next: "c10_dinner_reveal"
        }
      ]
    },
    c10_dinner_reveal: {
      chapter: 10,
      title: "The Difficult Position",
      location: "Private Restaurant",
      background: "city",
      focus: "Camille",
      variants: [
        {
          conditions: [{ type: "flag", key: "agencyFearBoundary" }],
          text: ["The table already knows the shape of the argument. They care about you, and they are starting to worry about where care becomes permission."]
        },
        {
          conditions: [{ type: "flag", key: "romanceTension" }],
          text: ["There is emotional math under the dinner conversation now. Nobody makes a scene. That does not make it simple."]
        },
        {
          conditions: [{ type: "flag", key: "agencyPiperCollateral" }],
          text: ["Piper is funny, until the subject brushes collateral. Then she is very carefully not funny at all."]
        }
      ],
      text: [
        "The restaurant is all warm wood, candlelight, and food too expensive to arrive without choreography. Julian orders like a man auditioning for a lifestyle magazine. Camille arrives exactly on time.",
        "For a while, you let dinner be dinner. Then Camille says the Vektor intrusion was a statement. The table turns toward you.",
        "This is the moment your choices have been building toward. This is the moment Theo has been dreading without knowing why."
      ],
      choices: [
        {
          text: "Say it directly: rob predatory corporations, build a charity front, help people.",
          effects: [
            { type: "stat", key: "resolve", delta: 2 },
            { type: "relationship", key: "Piper", delta: 2 },
            { type: "relationship", key: "Camille", delta: 1 },
            { type: "relationship", key: "Julian", delta: 1 },
            { type: "relationship", key: "Theo", delta: -1 },
            { type: "stat", key: "independentPath", delta: 2 },
            { type: "flag", key: "directReveal", value: true }
          ],
          next: "c10_reactions"
        },
        {
          text: "Frame it as leverage and infrastructure: a legitimate foundation with dirty funding.",
          effects: [
            { type: "stat", key: "restraint", delta: 2 },
            { type: "relationship", key: "Theo", delta: 2 },
            { type: "relationship", key: "Camille", delta: 1 },
            { type: "stat", key: "foundationPath", delta: 2 },
            { type: "stat", key: "contractorPath", delta: 1 },
            { type: "flag", key: "charityFrame", value: true }
          ],
          next: "c10_reactions"
        },
        {
          text: "Make it theatrical: costumes, false signatures, impossible entrances, no boring crimes.",
          effects: [
            { type: "relationship", key: "Julian", delta: 3 },
            { type: "stat", key: "audacity", delta: 2 },
            { type: "stat", key: "exposure", delta: 1 },
            { type: "stat", key: "independentPath", delta: 1 },
            { type: "stat", key: "foundationPath", delta: 1 },
            { type: "flag", key: "theatricalReveal", value: true }
          ],
          next: "c10_reactions"
        },
        {
          text: "Do not reveal it. Finish dessert, leave smiling, and vanish with Piper.",
          conditions: [{ type: "flag", key: "disappearPlan" }],
          effects: [
            { type: "relationship", key: "Piper", delta: 1 },
            { type: "stat", key: "restraint", delta: 1 },
            { type: "flag", key: "secretExit", value: true }
          ],
          next: "c10_final_path"
        }
      ]
    },
    c10_reactions: {
      chapter: 10,
      title: "Witnesses Or Accomplices",
      location: "Private Restaurant",
      background: "city",
      focus: "Theo",
      text: [
        "Silence drops over the table. Not shock exactly. More like a chessboard after a significant move.",
        "Camille says it puts Baseline Three in a difficult position. Julian says, with real feeling, that he has been bored for years. Theo says they will come after you, and he means it as care, not accusation.",
        "Piper's leg is tense against yours, ready to run if this turns bad. It does not turn bad. Not yet."
      ],
      choices: [
        {
          text: "Ask Camille to design operational security if she is going to criticize it anyway.",
          conditions: [
            { type: "relationshipAtLeast", key: "Camille", value: 6 }
          ],
          effects: [
            { type: "relationship", key: "Camille", delta: 3 },
            { type: "stat", key: "control", delta: 1 },
            { type: "flag", key: "camilleAdvisor", value: true }
          ],
          next: "c10_final_path"
        },
        {
          text: "Ask Julian for access, guest lists, galas, and anything with dramatic lighting.",
          conditions: [
            { type: "relationshipAtLeast", key: "Julian", value: 5 }
          ],
          effects: [
            { type: "relationship", key: "Julian", delta: 3 },
            { type: "flag", key: "galaLead", value: true }
          ],
          next: "c10_final_path"
        },
        {
          text: "Ask Theo to keep the operation from becoming exactly what it hates.",
          conditions: [
            { type: "relationshipAtLeast", key: "Theo", value: 5 },
            { type: "notFlag", key: "agencyTheoRheaErased" }
          ],
          effects: [
            { type: "relationship", key: "Theo", delta: 3 },
            { type: "stat", key: "restraint", delta: 1 },
            { type: "flag", key: "theoConscience", value: true }
          ],
          next: "c10_final_path"
        },
        {
          text: "Accept Theo's line: he will build guardrails, not excuses.",
          conditions: [
            { type: "relationshipAtLeast", key: "Theo", value: 5 },
            { type: "flag", key: "agencyTheoRheaErased" }
          ],
          effects: [
            { type: "relationship", key: "Theo", delta: 1 },
            { type: "stat", key: "restraint", delta: 2 },
            { type: "flag", key: "theoBoundaryAccepted", value: true },
            { type: "memory", key: "Theo", text: "You accepted his ethical boundary instead of demanding loyalty as proof." }
          ],
          next: "c10_final_path"
        },
        {
          text: "Ask Jordan to shape the rumor before the city shapes you.",
          conditions: [
            { type: "relationshipAtLeast", key: "Jordan", value: 4 }
          ],
          effects: [
            { type: "relationship", key: "Jordan", delta: 3 },
            { type: "stat", key: "independentPath", delta: 1 },
            { type: "flag", key: "rumorBroker", value: true }
          ],
          next: "c10_final_path"
        },
        {
          text: "Ask Ben to be the brace: the person who says when the line is moving.",
          conditions: [
            { type: "relationshipAtLeast", key: "Ben", value: 4 }
          ],
          effects: [
            { type: "relationship", key: "Ben", delta: 3 },
            { type: "stat", key: "restraint", delta: 1 },
            { type: "flag", key: "benAnchor", value: true }
          ],
          next: "c10_final_path"
        },
        {
          text: "Keep Rina close as a rival, not a follower.",
          conditions: [
            { type: "relationshipAtLeast", key: "Rina", value: 3 }
          ],
          effects: [
            { type: "relationship", key: "Rina", delta: 3 },
            { type: "stat", key: "audacity", delta: 1 },
            { type: "flag", key: "rinaWildcard", value: true }
          ],
          next: "c10_final_path"
        },
        {
          text: "Tell them no pressure. You and Piper can walk out alone if that is the cleaner choice.",
          effects: [
            { type: "relationship", key: "Piper", delta: 2 },
            { type: "stat", key: "restraint", delta: 1 },
            { type: "flag", key: "noPressureExit", value: true }
          ],
          next: "c10_final_path"
        }
      ]
    },
    c10_final_path: {
      chapter: 10,
      title: "What Comes After Aegis",
      location: "Private Restaurant",
      background: "city",
      focus: "Seth",
      text: [
        "The table has stopped being a dinner table. It is a map with candles on it.",
        "Aegis gave you language for control. Your friends gave you reasons to care what control costs. Now the future needs a shape."
      ],
      choices: [
        {
          text: "Go sanctioned. Become the kind of hero Aegis can point to without lying too much.",
          conditions: [
            { type: "any", conditions: [
              { type: "statAtLeast", key: "heroPath", value: 3 },
              { type: "statAtLeast", key: "aegisTrust", value: 6 },
              { type: "relationshipAtLeast", key: "Vance", value: 4 }
            ] }
          ],
          effects: [
            { type: "flag", key: "finalHero", value: true },
            { type: "status", key: "classification", value: "Sanctioned hero candidate" }
          ],
          next: "c10_ending"
        },
        {
          text: "Set terms with Aegis. Contractor, not property.",
          conditions: [
            { type: "any", conditions: [
              { type: "statAtLeast", key: "contractorPath", value: 3 },
              { type: "statAtLeast", key: "aegisTrust", value: 5 },
              { type: "relationshipAtLeast", key: "Vance", value: 3 }
            ] }
          ],
          effects: [
            { type: "flag", key: "finalContractor", value: true },
            { type: "status", key: "classification", value: "Independent Aegis contractor" }
          ],
          next: "c10_ending"
        },
        {
          text: "Go independent. Help people, hit monsters in suits, and stay unowned.",
          conditions: [
            { type: "any", conditions: [
              { type: "statAtLeast", key: "independentPath", value: 4 },
              { type: "flag", key: "revealPlan" },
              { type: "relationshipAtLeast", key: "Piper", value: 7 }
            ] }
          ],
          effects: [
            { type: "flag", key: "finalIndependent", value: true },
            { type: "status", key: "classification", value: "Off-book independent operator" }
          ],
          next: "c10_ending"
        },
        {
          text: "Use institutional power against itself. Build through Camille, foundations, and locked doors.",
          conditions: [
            { type: "any", conditions: [
              { type: "statAtLeast", key: "foundationPath", value: 4 },
              { type: "relationshipAtLeast", key: "Camille", value: 8 },
              { type: "flag", key: "camilleAdvisor" }
            ] }
          ],
          effects: [
            { type: "flag", key: "finalFoundation", value: true },
            { type: "status", key: "classification", value: "Foundation-linked strategic asset" }
          ],
          next: "c10_ending"
        },
        {
          text: "Stop pretending. If no one can restrain you, no one gets to rule you.",
          conditions: [
            { type: "any", conditions: [
              { type: "statAtLeast", key: "villainPath", value: 3 },
              { type: "statAtLeast", key: "aegisFear", value: 5 },
              { type: "flag", key: "dontFuckWithUs" }
            ] }
          ],
          effects: [
            { type: "flag", key: "finalVillain", value: true },
            { type: "status", key: "classification", value: "Uncontained hostile potential" }
          ],
          next: "c10_ending"
        },
        {
          text: "Walk away from the machine. Control means choosing not to be a weapon.",
          conditions: [
            { type: "any", conditions: [
              { type: "statAtLeast", key: "civilianPath", value: 3 },
              { type: "statAtLeast", key: "restraint", value: 7 },
              { type: "flag", key: "delayedReveal" }
            ] }
          ],
          effects: [
            { type: "flag", key: "finalCivilian", value: true },
            { type: "status", key: "classification", value: "Voluntary civilian control track" }
          ],
          next: "c10_ending"
        },
        {
          text: "Do not let anyone name it yet. Leave the future open and dangerous.",
          effects: [
            { type: "flag", key: "finalOpen", value: true },
            { type: "status", key: "classification", value: "Unresolved post-Aegis trajectory" }
          ],
          next: "c10_ending"
        }
      ]
    },
    c10_ending: {
      chapter: 10,
      title: "End Of Pilot",
      location: "Blackwater City",
      background: "city",
      focus: "Piper",
      ending: true,
      variants: [
        {
          conditions: [{ type: "flag", key: "finalHero" }],
          text: ["Final path: Sanctioned Hero. You choose legitimacy, visibility, and rules you may eventually have to break from inside the costume."]
        },
        {
          conditions: [{ type: "flag", key: "finalContractor" }],
          text: ["Final path: Aegis Contractor. You offer Aegis usefulness without ownership, which is either maturity or a future negotiation with weapons drawn."]
        },
        {
          conditions: [{ type: "flag", key: "finalIndependent" }],
          text: ["Final path: Independent Operator. The city will call you hero, criminal, myth, and problem depending on who lost money that week."]
        },
        {
          conditions: [{ type: "flag", key: "finalFoundation" }],
          text: ["Final path: Foundation Power. Camille's world opens its polished doors, and every resource comes with a shadow shaped like leverage."]
        },
        {
          conditions: [{ type: "flag", key: "finalVillain" }],
          text: ["Final path: Self-Rule. You reject the sanctioned vocabulary entirely. Whether that makes you a villain or merely honest depends on who writes the incident report."]
        },
        {
          conditions: [{ type: "flag", key: "finalCivilian" }],
          text: ["Final path: Civilian Control. You refuse to become anyone's symbol. The quiet choice may be the hardest one for a person built like a natural disaster."]
        },
        {
          conditions: [{ type: "flag", key: "finalOpen" }],
          text: ["Final path: Unnamed. You leave the table with no formal answer, which keeps every door open and every observer nervous."]
        },
        {
          conditions: [{ type: "flag", key: "piperRomance" }],
          text: ["Relationship thread: Piper is not simply along for the future. She is emotionally in it with you, bright-eyed and all-in, and the city will learn to read that as either romance, weakness, or warning."]
        },
        {
          conditions: [{ type: "flag", key: "piperSlowBurn" }],
          text: ["Relationship thread: Piper remains unresolved in the most Piper way possible: close, charged, grinning at danger, and not yet translated into a label anyone else gets to use."]
        },
        {
          conditions: [{ type: "flag", key: "piperTrustedPartner" }],
          text: ["Relationship thread: Piper is your trusted partner first. The bond is not lesser for being undefined; it is cleaner, and in some ways harder to exploit."]
        },
        {
          conditions: [{ type: "flag", key: "camilleCommitted" }],
          text: ["Relationship thread: Camille chooses you with precision, not surrender. The future with her has strategy, leverage, and the unsettling comfort of being understood by someone who can still surprise you."]
        },
        {
          conditions: [
            { type: "flag", key: "camilleRomance" },
            { type: "notFlag", key: "camilleCommitted" }
          ],
          text: ["Relationship thread: Camille's interest stopped being hypothetical the moment you met her standards and then refused to be simple. With her, affection feels like a locked room you both enjoy solving from the inside."]
        },
        {
          conditions: [{ type: "flag", key: "julianCommitted" }],
          text: ["Relationship thread: Julian lets the mask stay crooked around you. The performance still dazzles, but now you can see where the laugh catches, and he trusts you not to make a spectacle of the wound."]
        },
        {
          conditions: [
            { type: "flag", key: "julianRomance" },
            { type: "notFlag", key: "julianCommitted" }
          ],
          text: ["Relationship thread: Julian makes danger look expensive and grief look rehearsed, but the performance changes when it is for you. The joke is still sharp. The sincerity under it is sharper."]
        },
        {
          conditions: [{ type: "flag", key: "theoCommitted" }],
          text: ["Relationship thread: Theo does not promise certainty. He promises presence, which is harder for him and more honest for both of you. Every future he fears now has one branch where he stays."]
        },
        {
          conditions: [
            { type: "flag", key: "theoRomance" },
            { type: "notFlag", key: "theoCommitted" }
          ],
          text: ["Relationship thread: Theo does not become fearless. He chooses you with the fear still present, which makes the choice quieter, braver, and much harder for the future to knock loose."]
        },
        {
          conditions: [
            { type: "relationshipAtLeast", key: "Camille", value: 8 },
            { type: "notFlag", key: "piperRomance" },
            { type: "notFlag", key: "camilleRomance" }
          ],
          text: ["Relationship thread: Camille has noticed the open space in your orbit. Her interest remains strategic, personal, and very much not harmless."]
        },
        {
          conditions: [{ type: "powerLevelAtLeast", value: 7 }],
          text: ["Power thread: Aegis calls the file stable because the alternative requires more paperwork. Your power has crossed from dangerous talent into city-scale leverage, and every ending now has to make room for what you can become."]
        },
        {
          conditions: [{ type: "flag", key: "romanceTension" }],
          text: ["Romance consequence: More than one heart has a legitimate claim on the truth now. The future does not punish that automatically, but it will punish cowardice if you try to make honesty optional."]
        },
        {
          conditions: [{ type: "flag", key: "theoBoundaryAccepted" }],
          text: ["NPC agency: Theo stays close because you let his conscience remain his own. That makes him less controllable and more trustworthy."]
        },
        {
          conditions: [
            { type: "flag", key: "camilleAdvisor" },
            { type: "flag", key: "galaLead" },
            { type: "flag", key: "theoConscience" }
          ],
          text: ["Ending thread: The Five-Person Problem. Camille has standards, Julian has doors, Theo has a conscience, Piper has velocity, and you have a plan large enough to make all of them accomplices."]
        },
        {
          conditions: [{ type: "flag", key: "secretExit" }],
          text: ["Ending thread: Ghosts In Blackwater. You and Piper leave the dinner clean, smiling, and unconfessed. By morning, Aegis has two graduates on paper and two rumors moving faster than traffic cameras."]
        },
        {
          conditions: [{ type: "flag", key: "rheaEscaped" }],
          text: ["Open threat: Rhea Kane is still alive. Whatever future you build now has a hunter inside the margins, and Vektor already knows what kind of key you might be."]
        },
        {
          conditions: [{ type: "flag", key: "rheaErased" }],
          text: ["Known consequence: Commandant Vance saw enough to classify you as more than a graduate. Baseline Three will not forget the crater, even if the public never sees it."]
        },
        {
          conditions: [{ type: "flag", key: "rheaContained" }],
          text: ["Known consequence: Rhea's containment proves your restraint is as dangerous as your force. Aegis has a living prisoner and a new reason to study you."]
        },
        {
          conditions: [{ type: "flag", key: "dontFuckWithUs" }],
          text: ["Reputation: In the halls of Aegis, your statement becomes shorter every time it is repeated. Do not touch what belongs to the energy sink."]
        }
      ],
      text: [
        "The pilot ends with Blackwater glittering beyond the glass.",
        "Whatever you become next, it will not fit cleanly on an Aegis form."
      ],
      choices: []
    }
  }
};
