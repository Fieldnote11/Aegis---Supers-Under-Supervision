(function () {
  "use strict";

  const STORY = window.AEGIS_STORY;
  if (!STORY) return;
  const scenes = STORY.scenes;

  function redirectAll(from, to) {
    Object.values(scenes).forEach((scene) => {
      (scene.choices || []).forEach((choice) => {
        if (choice.next === from) choice.next = to;
        if (choice.next && choice.next.default === from) choice.next.default = to;
        if (choice.next && choice.next.cases) {
          choice.next.cases.forEach((item) => {
            if (item.scene === from) item.scene = to;
          });
        }
      });
    });
  }

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

  function setChapterStart(chapterId, sceneId) {
    const chapter = STORY.chapters.find((item) => item.id === chapterId);
    if (chapter) chapter.start = sceneId;
  }

  function makeChoice(text, effects) {
    return { text, effects: effects || [] };
  }

  const chapters = [
    {
      id: 1,
      entry: "c01_arrival",
      background: "aegis",
      beats: [
        {
          slug: "gate",
          title: "The Gate Decides Nothing",
          location: "Aegis Intake Gate",
          focus: "Seth",
          text: [
            "The first choice Aegis gives you is where to stand while the gate scans your file. There are painted lines on the concrete, little red boxes for luggage, and a polite instruction screen telling new residents to keep hands visible. Nobody says the quiet part aloud: a building made for people like you assumes every nervous movement might become an incident.",
            "Ocean wind moves over the intake plaza hard enough to snap the flags straight. Somewhere under the clean concrete, generators hum in a rhythm that does not match the waves. You can feel power everywhere: in the fence, in the sensors, in the trained posture of the staff pretending not to stare.",
            "The tablet in your hand lists you as an adult voluntary intake, age twenty-four, high ceiling, unknown lower boundary. It does not say lonely. It does not say relieved. It does not say that walking in by choice still feels like surrender if you look at it from the wrong angle."
          ],
          choices: [
            makeChoice("Stand exactly where the line tells you and let Aegis see calm first.", [
              { type: "stat", key: "control", delta: 1 },
              { type: "stat", key: "aegisTrust", delta: 1 },
              { type: "flag", key: "enteredOnTheLine", value: true }
            ]),
            makeChoice("Step half an inch outside the box, just to see who notices.", [
              { type: "stat", key: "audacity", delta: 1 },
              { type: "stat", key: "independentPath", delta: 1 },
              { type: "flag", key: "testedIntakeLine", value: true }
            ]),
            makeChoice("Close your eyes, breathe, and make the power sit down before anyone asks.", [
              { type: "stat", key: "restraint", delta: 1 },
              { type: "powerXp", amount: 1 },
              { type: "flag", key: "settledAtGate", value: true }
            ])
          ]
        },
        {
          slug: "paperwork",
          title: "Paperwork With Teeth",
          location: "Intake Processing",
          focus: "Vance",
          text: [
            "Processing is less dramatic than the gate and somehow more invasive. A medic checks your pulse. A legal officer explains consent with the precision of someone who has seen consent challenged in court. A power tech asks whether your output changes when you are startled, praised, cornered, insulted, or touched by someone you trust.",
            "Aegis writes everything down. Not because paper can stop you. Because paper can prove who knew what before something went wrong.",
            "Commandant Vance passes through the glass-walled office beyond processing. He does not stop. He does not need to. His glance lands once, sharp and brief, and you understand that the file has already been read by someone who thinks in contingencies."
          ],
          choices: [
            makeChoice("Answer the invasive questions completely. Data beats rumor.", [
              { type: "stat", key: "aegisTrust", delta: 1 },
              { type: "stat", key: "contractorPath", delta: 1 },
              { type: "flag", key: "intakeFullyDisclosed", value: true }
            ]),
            makeChoice("Answer truthfully, but keep the private parts private.", [
              { type: "stat", key: "restraint", delta: 1 },
              { type: "stat", key: "civilianPath", delta: 1 },
              { type: "flag", key: "intakePrivacyLine", value: true }
            ]),
            makeChoice("Ask who gets access to your file before you give them another sentence.", [
              { type: "stat", key: "resolve", delta: 1 },
              { type: "stat", key: "independentPath", delta: 1 },
              { type: "relationship", key: "Vance", delta: 1 },
              { type: "flag", key: "askedFileAccess", value: true }
            ])
          ]
        },
        {
          slug: "cohort",
          title: "Adult Supervision",
          location: "Orientation Queue",
          focus: "Piper",
          text: [
            "The cohort is older than the word trainee suggests. Nobody here is a kid with a backpack and a permission slip. The visible age range sits in the twenties, which makes the nervous flirting, territorial glances, and carefully casual power displays feel less like school and more like a workplace where everyone could break the building during a bad lunch.",
            "You clock categories before names: the speedster who cannot quite stand still, the listener pretending not to listen, the competitor with her jaw set, the composed woman flanked by two people who understand orbit. Aegis calls this intake. The room calls it a food chain and waits to see where you land.",
            "The smartest thing would be to stay quiet until the rules become visible. The human thing is wanting someone to make the room less sterile before it swallows you whole."
          ],
          choices: [
            makeChoice("Let the speedster catch you looking and do not pretend otherwise.", [
              { type: "relationship", key: "Piper", delta: 1 },
              { type: "stat", key: "audacity", delta: 1 },
              { type: "flag", key: "noticedPiperFirst", value: true }
            ]),
            makeChoice("Watch the composed woman's table and map the orbit before joining anything.", [
              { type: "relationship", key: "Camille", delta: 1 },
              { type: "stat", key: "control", delta: 1 },
              { type: "flag", key: "mappedCamilleOrbit", value: true }
            ]),
            makeChoice("Stay alone long enough to hear what people say when they think you are not playing.", [
              { type: "relationship", key: "Jordan", delta: 1 },
              { type: "stat", key: "exposure", delta: 1 },
              { type: "flag", key: "listenedBeforeSpeaking", value: true }
            ])
          ]
        },
        {
          slug: "first_schedule",
          title: "Your First Schedule",
          location: "Resident Services",
          focus: "Seth",
          text: [
            "Resident Services issues your room assignment, meal access, emergency beacon, training calendar, and a list of things that sound optional until you see the attendance policy. Orientation. Baseline. Psychological intake. Supervised free time. Rest block. Rest block is written in the same font as tactical evaluation, which tells you exactly how many residents have tried to skip it.",
            "Your schedule has gaps. That is not kindness. That is Aegis watching what people do when nobody is issuing direct orders. Train too much and you become a risk pattern. Socialize too much and you become leverage. Hide too much and you become an unknown.",
            "The gap between official control and actual choice is small, but it is real. It may be the only place your life still belongs entirely to you."
          ],
          choices: [
            makeChoice("Plan your free blocks around training first.", [
              { type: "stat", key: "control", delta: 1 },
              { type: "powerXp", amount: 1 },
              { type: "flag", key: "trainingFirstSchedule", value: true }
            ]),
            makeChoice("Plan around people first. Allies beat clean calendars.", [
              { type: "relationship", key: "Piper", delta: 1 },
              { type: "relationship", key: "Jordan", delta: 1 },
              { type: "flag", key: "peopleFirstSchedule", value: true }
            ]),
            makeChoice("Circle every required rest block. You are not giving fatigue a free shot.", [
              { type: "stat", key: "restraint", delta: 1 },
              { type: "stat", key: "civilianPath", delta: 1 },
              { type: "flag", key: "respectedRestEarly", value: true }
            ])
          ]
        },
        {
          slug: "doorway",
          title: "Before The Room Opens",
          location: "Residence Elevator",
          focus: "Seth",
          text: [
            "The elevator rises through the residence tower with your duffel at your feet and your file in the system below. Aegis is already becoming a set of layers: the public version with white walls and ocean views, the staff version with locked doors, the resident version made of shortcuts and warnings, and the private version you will only learn by making mistakes.",
            "You catch your reflection in the elevator doors. Adult. Voluntary. Dangerous enough for reinforced glass. Human enough to hope the bed is comfortable.",
            "When the doors open, the hallway smells faintly like laundry detergent, ozone, and microwaved noodles. Someone laughs behind a closed door. Someone else curses at a vending machine. The ordinary sounds hit harder than the gate did."
          ],
          choices: [
            makeChoice("Walk in like this is a place you intend to survive.", [
              { type: "stat", key: "resolve", delta: 1 },
              { type: "flag", key: "intendedToSurvive", value: true }
            ]),
            makeChoice("Walk in like this is a place that still has to earn you.", [
              { type: "stat", key: "independentPath", delta: 1 },
              { type: "stat", key: "audacity", delta: 1 },
              { type: "flag", key: "aegisMustEarn", value: true }
            ]),
            makeChoice("Walk in quietly and save your energy for the first real test.", [
              { type: "stat", key: "restraint", delta: 1 },
              { type: "stat", key: "control", delta: 1 },
              { type: "flag", key: "savedEnergyForBaseline", value: true }
            ])
          ]
        }
      ]
    },
    {
      id: 2,
      entry: "c02_observation_deck",
      background: "sim",
      beats: [
        {
          slug: "wake",
          title: "Baseline Morning",
          location: "Residence Wing",
          focus: "Seth",
          text: [
            "Baseline morning arrives with a notification tone that is too cheerful for the work it announces. Your tablet shows a map to Simulation Block A, a reminder to hydrate, and a paragraph explaining that fear responses are normal. The paragraph is correct. That does not make it less irritating.",
            "The residence wing is awake in uneven pieces. Someone jogs in place outside the elevator. Someone else sits on the carpet with their head between their knees. Aegis staff do not hurry anyone, which is its own kind of pressure. They have seen every version of panic and know which ones become paperwork.",
            "Your power answers the morning before you do. It shifts under your skin, not out of control, not calm, just present. A thing with appetite waiting to learn the rules of the room."
          ],
          choices: [
            makeChoice("Eat breakfast even though nerves make it taste like cardboard.", [
              { type: "stat", key: "restraint", delta: 1 },
              { type: "flag", key: "ateBeforeBaseline", value: true }
            ]),
            makeChoice("Warm up privately until your output feels smooth.", [
              { type: "stat", key: "control", delta: 1 },
              { type: "powerXp", amount: 1 },
              { type: "flag", key: "warmedBeforeBaseline", value: true }
            ]),
            makeChoice("Walk straight to the sim block. Waiting is worse than testing.", [
              { type: "stat", key: "resolve", delta: 1 },
              { type: "stat", key: "audacity", delta: 1 },
              { type: "flag", key: "rushedBaseline", value: true }
            ])
          ]
        },
        {
          slug: "queue",
          title: "The Queue",
          location: "Simulation Block A",
          focus: "Rina",
          text: [
            "The queue outside Simulation Block A has the tense manners of a courtroom. People make jokes in quiet voices. Nobody laughs too loudly. Rina Cross stands three places ahead, rolling one shoulder like she is about to step into a ring instead of a calibrated room with liability waivers.",
            "A wall display cycles through resident numbers, output categories, and safety reminders. The reminders are written gently, which somehow makes them worse. Do not discharge toward observers. Do not attempt to exceed assigned parameters. Do not conceal pain, dizziness, auditory distortion, dissociation, or missing time.",
            "The room is built to find the truth under the performance. That means the only real question is which truth you give it."
          ],
          choices: [
            makeChoice("Ask Rina what score she is trying to beat.", [
              { type: "relationship", key: "Rina", delta: 1 },
              { type: "stat", key: "audacity", delta: 1 },
              { type: "flag", key: "challengedRinaQueue", value: true }
            ]),
            makeChoice("Study the wall display and memorize every safety parameter.", [
              { type: "stat", key: "control", delta: 1 },
              { type: "stat", key: "aegisTrust", delta: 1 },
              { type: "flag", key: "memorizedSafetyParameters", value: true }
            ]),
            makeChoice("Keep your eyes off the numbers. You are not here to become one.", [
              { type: "stat", key: "resolve", delta: 1 },
              { type: "stat", key: "independentPath", delta: 1 },
              { type: "flag", key: "refusedToBeNumber", value: true }
            ])
          ]
        },
        {
          slug: "glass",
          title: "Behind The Glass",
          location: "Observation Hall",
          focus: "Vance",
          text: [
            "Through the observation glass, the baseline chamber looks almost empty. That is the trick. Empty rooms make consequences easier to see. Every scorch mark, frost bloom, shock wave, and fracture belongs to someone. The room remembers better than people do.",
            "Vance stands with a tablet under one arm, watching residents finish their runs. He does not look impressed by spectacle. He looks interested in recovery time, in how quickly a resident stops after success, in whether their eyes seek applause or exits.",
            "You realize that Aegis is not only measuring what you can do. It is measuring what power does to your attention."
          ],
          choices: [
            makeChoice("Make attention part of the test. Track observer reactions without chasing them.", [
              { type: "stat", key: "control", delta: 1 },
              { type: "relationship", key: "Vance", delta: 1 },
              { type: "flag", key: "trackedObservers", value: true }
            ]),
            makeChoice("Ignore the glass. The target matters more than the audience.", [
              { type: "stat", key: "restraint", delta: 1 },
              { type: "stat", key: "heroPath", delta: 1 },
              { type: "flag", key: "ignoredAudience", value: true }
            ]),
            makeChoice("Let them watch. A little fear now might buy space later.", [
              { type: "stat", key: "aegisFear", delta: 1 },
              { type: "stat", key: "foundationPath", delta: 1 },
              { type: "flag", key: "acceptedBaselineFear", value: true }
            ])
          ]
        },
        {
          slug: "numbers",
          title: "Small Numbers Matter",
          location: "Calibration Annex",
          focus: "Seth",
          text: [
            "A tech explains the baseline scoring bands while pretending the bands are neutral. Five hundred is the pass mark. Eight hundred requires review. Above that, someone with a better title comes into the room. Below the visible scale, smaller numbers matter more: start time, stop time, leakage, recovery, drift.",
            "The tech tells you the strongest residents are not the ones who can make the biggest number. They are the ones who can make the number they meant to make twice in a row. It is practical advice. It also sounds like a moral philosophy with better math.",
            "Your hands feel steady. Your thoughts do not. That may be the most honest starting point available."
          ],
          choices: [
            makeChoice("Practice stopping twice before you practice hitting hard.", [
              { type: "stat", key: "control", delta: 2 },
              { type: "powerXp", amount: 1 },
              { type: "flag", key: "doubleStopPractice", value: true }
            ]),
            makeChoice("Ask what happens to residents who exceed the review band.", [
              { type: "stat", key: "aegisFear", delta: 1 },
              { type: "stat", key: "contractorPath", delta: 1 },
              { type: "flag", key: "askedReviewBand", value: true }
            ]),
            makeChoice("Keep your best output private until the room earns it.", [
              { type: "stat", key: "restraint", delta: 1 },
              { type: "stat", key: "independentPath", delta: 1 },
              { type: "flag", key: "keptBestOutputPrivate", value: true }
            ])
          ]
        },
        {
          slug: "threshold",
          title: "At The Threshold",
          location: "Sim Door",
          focus: "Seth",
          text: [
            "Your name appears on the display. Conversation fades in the way people fade when they want to witness without being caught witnessing. The chamber door opens. Cold air rolls out, scrubbed clean and dry enough to make your teeth feel too sharp.",
            "For one second, you understand why some people become addicted to being watched. Attention turns fear into shape. It gives the body something to push against. The danger is mistaking that shape for control.",
            "You step forward with Aegis behind you, the target ahead, and the power waiting like a held breath."
          ],
          choices: [
            makeChoice("Enter as a professional. Clean start, clean stop.", [
              { type: "stat", key: "control", delta: 1 },
              { type: "stat", key: "contractorPath", delta: 1 },
              { type: "flag", key: "baselineProfessionalEntry", value: true }
            ]),
            makeChoice("Enter as a protector. If the room fails, nobody outside it pays.", [
              { type: "stat", key: "restraint", delta: 1 },
              { type: "stat", key: "heroPath", delta: 1 },
              { type: "flag", key: "baselineProtectorEntry", value: true }
            ]),
            makeChoice("Enter as yourself. Let them update their categories afterward.", [
              { type: "stat", key: "resolve", delta: 1 },
              { type: "stat", key: "independentPath", delta: 1 },
              { type: "flag", key: "baselineSelfEntry", value: true }
            ])
          ]
        }
      ]
    },
    {
      id: 3,
      entry: "c03_gallery_pressure",
      background: "sim",
      beats: [
        {
          slug: "invitation",
          title: "Invitation Weight",
          location: "Main Walkway",
          focus: "Camille",
          text: [
            "Camille's invitation to observe Sim Block C follows you through the next day like a second schedule. It is not romantic on its face. It is not hostile either. That is what makes it heavy. A clear threat would be easier. A clear flirtation would be simpler. This is an assessment wearing good manners.",
            "Piper says Camille collects talented people the way other people collect expensive knives. Jordan says that is unfair because knives do not usually come with scholarship paperwork. Theo, overhearing from two tables away, says Camille does not collect people. She builds systems and gets annoyed when people insist on being variables.",
            "By evening, you know enough to understand that attending is a choice about more than training."
          ],
          choices: [
            makeChoice("Treat the invitation as professional and arrive with notes.", [
              { type: "relationship", key: "Camille", delta: 1 },
              { type: "stat", key: "control", delta: 1 },
              { type: "flag", key: "arrivedWithNotes", value: true }
            ]),
            makeChoice("Treat it as social politics and ask Piper what land mines to avoid.", [
              { type: "relationship", key: "Piper", delta: 1 },
              { type: "stat", key: "independentPath", delta: 1 },
              { type: "flag", key: "askedPiperLandmines", value: true }
            ]),
            makeChoice("Treat it as an opening and ask Theo what Camille actually respects.", [
              { type: "relationship", key: "Theo", delta: 1 },
              { type: "stat", key: "contractorPath", delta: 1 },
              { type: "flag", key: "askedTheoCamilleRespect", value: true }
            ])
          ]
        },
        {
          slug: "gallery",
          title: "The Gallery Has Teeth",
          location: "Advanced Simulation Bay",
          focus: "Julian",
          text: [
            "Sim Block C's gallery is built like a theater for people who pretend not to enjoy theater. Tiered seats, reinforced glass, clean sightlines, and enough sensors to turn every raised eyebrow into data. Julian sees you notice and smiles like he has been waiting for someone to appreciate the staging.",
            "Residents settle around you. Some want Camille to impress them. Some want her to fail in a way they can safely discuss later. Most want both. The air is full of ambition dressed as commentary.",
            "Julian leans close enough to be heard without performing for the room. \"First rule. Nobody here is objective. Second rule. The ones who claim objectivity are usually the most fun to expose.\""
          ],
          choices: [
            makeChoice("Ask Julian what he wants exposed.", [
              { type: "relationship", key: "Julian", delta: 2 },
              { type: "stat", key: "audacity", delta: 1 },
              { type: "flag", key: "askedJulianExpose", value: true }
            ]),
            makeChoice("Watch who watches Camille instead of watching Camille.", [
              { type: "relationship", key: "Jordan", delta: 1 },
              { type: "stat", key: "exposure", delta: 1 },
              { type: "flag", key: "watchedWatchers", value: true }
            ]),
            makeChoice("Focus on the exercise. Gossip can wait until after impact.", [
              { type: "stat", key: "control", delta: 1 },
              { type: "stat", key: "restraint", delta: 1 },
              { type: "flag", key: "ignoredGalleryGossip", value: true }
            ])
          ]
        },
        {
          slug: "team",
          title: "People As Systems",
          location: "Sim Block C",
          focus: "Theo",
          text: [
            "Before the exercise starts, Theo walks you through the scenario with the anxious precision of someone who trusts math more than rooms. He points out load paths, energy sinks, probable failure states, and the places where a flashy solution would look good for three seconds before making the fourth second catastrophic.",
            "Camille listens without interrupting. Julian adds color commentary. Piper, who is not officially part of the group, appears near the door with a snack and a look that says unofficial is just official without better branding.",
            "The team dynamic is not softness. It is engineering. Each person knows who will overreach, who will hesitate, who will turn fear into jokes, and who will need the truth said plainly before it becomes expensive."
          ],
          choices: [
            makeChoice("Ask Theo for the failure state nobody likes saying aloud.", [
              { type: "relationship", key: "Theo", delta: 2 },
              { type: "stat", key: "control", delta: 1 },
              { type: "flag", key: "askedTheoFailureState", value: true }
            ]),
            makeChoice("Ask Piper what the official group misses by excluding speed.", [
              { type: "relationship", key: "Piper", delta: 2 },
              { type: "stat", key: "independentPath", delta: 1 },
              { type: "flag", key: "askedSpeedExclusion", value: true }
            ]),
            makeChoice("Ask Camille whether people are systems or people first.", [
              { type: "relationship", key: "Camille", delta: 2 },
              { type: "stat", key: "foundationPath", delta: 1 },
              { type: "flag", key: "peopleOrSystems", value: true }
            ])
          ]
        },
        {
          slug: "standard",
          title: "The Standard",
          location: "Gallery Rail",
          focus: "Camille",
          text: [
            "Camille's standard becomes visible before the sim begins. She does not demand perfection. Perfection is too brittle. She demands recovery, clean communication, and the discipline to abandon a pretty solution when the room changes shape.",
            "That is why people resent her. Not because she is wrong, but because her correctness leaves fewer hiding places. Talent can hide inside chaos. Excellence cannot. Excellence has to repeat itself while people are watching.",
            "The thought lands uncomfortably close to your baseline. Aegis is not the only thing measuring you. People are deciding whether your power is a storm, a tool, a promise, or a warning."
          ],
          choices: [
            makeChoice("Decide Camille's standard is useful even when it is irritating.", [
              { type: "relationship", key: "Camille", delta: 1 },
              { type: "stat", key: "control", delta: 1 },
              { type: "flag", key: "acceptedCamilleStandard", value: true }
            ]),
            makeChoice("Decide standards need escape hatches or they become cages.", [
              { type: "relationship", key: "Theo", delta: 1 },
              { type: "stat", key: "independentPath", delta: 1 },
              { type: "flag", key: "standardsNeedExits", value: true }
            ]),
            makeChoice("Decide you want a standard high enough to scare the room.", [
              { type: "stat", key: "audacity", delta: 1 },
              { type: "stat", key: "foundationPath", delta: 1 },
              { type: "flag", key: "wantedScaryStandard", value: true }
            ])
          ]
        },
        {
          slug: "before",
          title: "Before The Sim Starts",
          location: "Gallery Seats",
          focus: "Seth",
          text: [
            "The lights dim. The room quiets. The scenario loads behind the glass in layers: floor grid, hazard shell, civilian markers, unstable core. The system makes danger appear with clean edges, which is a lie every trained person in the gallery understands and accepts.",
            "Piper catches your eye from the door and gives you a quick two-finger salute. Julian looks amused. Theo looks worried in a way that is beginning to feel less like distrust and more like care with bad posture. Camille does not look away from the field.",
            "You came here to observe. Aegis has a way of making observation into participation."
          ],
          choices: [
            makeChoice("Observe the mechanics first.", [
              { type: "stat", key: "control", delta: 1 },
              { type: "stat", key: "contractorPath", delta: 1 },
              { type: "flag", key: "observedMechanicsFirst", value: true }
            ]),
            makeChoice("Observe the people first.", [
              { type: "relationship", key: "Piper", delta: 1 },
              { type: "relationship", key: "Theo", delta: 1 },
              { type: "flag", key: "observedPeopleFirst", value: true }
            ]),
            makeChoice("Observe Camille first, because pretending otherwise would be dishonest.", [
              { type: "relationship", key: "Camille", delta: 2 },
              { type: "stat", key: "resolve", delta: 1 },
              { type: "flag", key: "observedCamilleFirst", value: true }
            ])
          ]
        }
      ]
    },
    {
      id: 4,
      entry: "c04_anchor",
      background: "sim",
      beats: [
        {
          slug: "solo",
          title: "Solo Means Witnessed",
          location: "Sim Chamber Three",
          focus: "Seth",
          text: [
            "The phrase solo test is a lie with useful branding. You will be alone inside the chamber, but the observation room will be full. Camille will watch for standards. Vance will watch for control. Piper will watch for the human under the file. Theo will watch probabilities misbehave. Julian will probably watch everyone watching you.",
            "The test brief is simple enough to be suspicious: contain a thermal construct, prevent breach, preserve civilian markers, keep output under review threshold. Aegis never needs complicated language to make a room dangerous.",
            "Your power feels larger this morning, not stronger exactly, but more awake. Growth is not always a gift. Sometimes it is a door opening before you know what is on the other side."
          ],
          choices: [
            makeChoice("Write the objective in your own words: protect the markers, then win.", [
              { type: "stat", key: "heroPath", delta: 1 },
              { type: "stat", key: "restraint", delta: 1 },
              { type: "flag", key: "soloProtectFirst", value: true }
            ]),
            makeChoice("Write the objective as a control problem: define the room, then own it.", [
              { type: "stat", key: "control", delta: 1 },
              { type: "stat", key: "contractorPath", delta: 1 },
              { type: "flag", key: "soloControlProblem", value: true }
            ]),
            makeChoice("Write nothing. Plans are useful until the room starts lying.", [
              { type: "stat", key: "audacity", delta: 1 },
              { type: "stat", key: "resolve", delta: 1 },
              { type: "flag", key: "soloNoPlan", value: true }
            ])
          ]
        },
        {
          slug: "warmup",
          title: "Warm-Up Lies",
          location: "Prep Bay",
          focus: "Camille",
          text: [
            "Camille finds you in the prep bay and does not ask whether you are nervous. That might be kindness. It might be efficiency. She checks the sim brief, the chamber assignment, the safety override schedule, and then your face.",
            "\"Warm up,\" she says. \"Not to impress anyone. To remove excuses.\"",
            "It is the kind of advice that sounds cold until you realize it is permission. A good warm-up is a way of telling panic that it does not get to pretend it was ambushed."
          ],
          choices: [
            makeChoice("Warm up exactly as Camille recommends.", [
              { type: "relationship", key: "Camille", delta: 1 },
              { type: "stat", key: "control", delta: 1 },
              { type: "powerXp", amount: 1 },
              { type: "flag", key: "camilleWarmup", value: true }
            ]),
            makeChoice("Ask Camille whether she ever gets nervous before a test.", [
              { type: "relationship", key: "Camille", delta: 2 },
              { type: "stat", key: "resolve", delta: 1 },
              { type: "flag", key: "askedCamilleNerves", value: true }
            ]),
            makeChoice("Tell Camille you prefer excuses with better tailoring.", [
              { type: "relationship", key: "Julian", delta: 1 },
              { type: "relationship", key: "Camille", delta: 1 },
              { type: "stat", key: "audacity", delta: 1 },
              { type: "flag", key: "tailoredExcuses", value: true }
            ])
          ]
        },
        {
          slug: "anchor",
          title: "Anchor Point",
          location: "Sim Threshold",
          focus: "Piper",
          text: [
            "Piper catches you before the chamber door. She is trying for casual and almost succeeds. The speed in her makes stillness look like a decision she has to keep making. \"If this gets stupid,\" she says, \"make it our kind of stupid. Survivable. Mockable later.\"",
            "It is not a grand speech. It helps more than a grand speech would have.",
            "You realize everyone keeps offering versions of the same thing: Camille gives standards, Theo gives failure states, Julian gives distance through humor, Piper gives the promise that you can come back from being impressive and still be a person."
          ],
          choices: [
            makeChoice("Tell Piper you will keep it mockable.", [
              { type: "relationship", key: "Piper", delta: 2 },
              { type: "stat", key: "restraint", delta: 1 },
              { type: "flag", key: "promisedMockable", value: true }
            ]),
            makeChoice("Tell Piper she is officially your bad-idea quality control.", [
              { type: "relationship", key: "Piper", delta: 2 },
              { type: "stat", key: "independentPath", delta: 1 },
              { type: "flag", key: "piperQualityControl", value: true }
            ]),
            makeChoice("Do not joke. Tell her you heard her.", [
              { type: "relationship", key: "Piper", delta: 2 },
              { type: "stat", key: "resolve", delta: 1 },
              { type: "flag", key: "heardPiperBeforeSolo", value: true }
            ])
          ]
        },
        {
          slug: "failstate",
          title: "Theo's Bad Version",
          location: "Observation Hall",
          focus: "Theo",
          text: [
            "Theo sends you a diagram three minutes before start. It is labeled BAD VERSION in all caps. The diagram shows the construct breaching high, the civilian markers scattering, your output chasing the breach, and the whole sim becoming a story where every correct reaction is too late.",
            "Under the diagram he writes: you do not have to be faster than the emergency if you refuse to create the emergency.",
            "It is not comforting. It is useful. Theo's care does not always arrive soft. Sometimes it arrives as a map of how things go wrong."
          ],
          choices: [
            makeChoice("Thank Theo and use the diagram as your first priority list.", [
              { type: "relationship", key: "Theo", delta: 2 },
              { type: "stat", key: "control", delta: 1 },
              { type: "flag", key: "usedTheoBadVersion", value: true }
            ]),
            makeChoice("Send back: rude, accurate, appreciated.", [
              { type: "relationship", key: "Theo", delta: 1 },
              { type: "relationship", key: "Julian", delta: 1 },
              { type: "flag", key: "rudeAccurateAppreciated", value: true }
            ]),
            makeChoice("Keep the diagram private. You need the warning without the audience.", [
              { type: "relationship", key: "Theo", delta: 1 },
              { type: "stat", key: "restraint", delta: 1 },
              { type: "flag", key: "keptTheoDiagramPrivate", value: true }
            ])
          ]
        },
        {
          slug: "door",
          title: "Door Open",
          location: "Sim Chamber Three",
          focus: "Seth",
          text: [
            "When the chamber opens, the construct is already forming behind the safety glass: a bright, wrong shape with too many angles, heat folding around itself in a way that makes the air look bruised. The civilian markers are little blue ghosts around the room.",
            "The sim announces readiness. The observation glass darkens. Your own reflection fades out until there is only the field, the target, and the first clean second before consequence.",
            "Aegis loves first seconds. They look controllable."
          ],
          choices: [
            makeChoice("Enter with the civilian markers already mapped.", [
              { type: "stat", key: "heroPath", delta: 1 },
              { type: "stat", key: "control", delta: 1 },
              { type: "flag", key: "mappedMarkersBeforeSolo", value: true }
            ]),
            makeChoice("Enter with the construct's leak paths already named.", [
              { type: "stat", key: "contractorPath", delta: 1 },
              { type: "stat", key: "control", delta: 1 },
              { type: "flag", key: "namedLeakPathsBeforeSolo", value: true }
            ]),
            makeChoice("Enter with one rule: nobody outside the chamber gets to define your limit.", [
              { type: "stat", key: "independentPath", delta: 1 },
              { type: "stat", key: "resolve", delta: 1 },
              { type: "flag", key: "definedOwnLimit", value: true }
            ])
          ]
        }
      ]
    },
    {
      id: 5,
      entry: "c05_blind_spot",
      background: "aegis",
      beats: [
        {
          slug: "after",
          title: "After The Solo Test",
          location: "Residence Wing",
          focus: "Seth",
          text: [
            "After the solo test, Aegis gives you a status report, a protein bar, and a rest recommendation written in the tone of a threat. The body does not know the danger was simulated. Your nerves keep reaching for a room that is no longer there.",
            "People treat you differently after a clean test. Some make more eye contact. Some make less. A few look relieved, which bothers you more than fear would. Relief means they had already imagined a worse version and were waiting to see whether you became it.",
            "The dock invitation arrives during that strange afterspace, from Piper, with no subject line and three words: want to fly?"
          ],
          choices: [
            makeChoice("Answer yes before caution can make a committee.", [
              { type: "relationship", key: "Piper", delta: 2 },
              { type: "stat", key: "audacity", delta: 1 },
              { type: "flag", key: "dockImmediateYes", value: true }
            ]),
            makeChoice("Ask what Vance would call this if he saw it.", [
              { type: "relationship", key: "Vance", delta: 1 },
              { type: "stat", key: "aegisTrust", delta: 1 },
              { type: "flag", key: "askedVanceDockAngle", value: true }
            ]),
            makeChoice("Ask Piper who else knows.", [
              { type: "relationship", key: "Piper", delta: 1 },
              { type: "stat", key: "restraint", delta: 1 },
              { type: "flag", key: "askedDockWitnesses", value: true }
            ])
          ]
        },
        {
          slug: "permission",
          title: "The Shape Of Permission",
          location: "East Walkway",
          focus: "Piper",
          text: [
            "Piper insists the dock test is not illegal, which is not the same as saying it is authorized. She has a gift for treating locked doors as design suggestions. She also knows exactly where the cameras turn slow and which guards prefer plausible deniability.",
            "\"It's not about breaking rules,\" she says, which is how you know it is partly about breaking rules. \"It's about seeing what you can do when the room isn't built by people already scared of the answer.\"",
            "That lands harder than it should. Aegis tests for safety. Piper is asking about joy, which may be the more dangerous variable."
          ],
          choices: [
            makeChoice("Tell Piper joy is allowed to have safety rails.", [
              { type: "relationship", key: "Piper", delta: 1 },
              { type: "stat", key: "restraint", delta: 1 },
              { type: "flag", key: "joyWithRails", value: true }
            ]),
            makeChoice("Tell Piper Aegis does not own every answer.", [
              { type: "relationship", key: "Piper", delta: 2 },
              { type: "stat", key: "independentPath", delta: 1 },
              { type: "flag", key: "aegisDoesNotOwnAnswers", value: true }
            ]),
            makeChoice("Ask if this is a test, a date, or a crime.", [
              { type: "relationship", key: "Piper", delta: 2 },
              { type: "stat", key: "audacity", delta: 1 },
              { type: "flag", key: "testDateCrime", value: true }
            ])
          ]
        },
        {
          slug: "dockmath",
          title: "Dock Math",
          location: "East Dock",
          focus: "Theo",
          text: [
            "Theo arrives with a tablet because apparently rumors move faster than Piper only when the rumor is a safety violation. He has wind estimates, tide tables, concrete stress tolerances, and the facial expression of someone who has already argued with himself for helping.",
            "Camille arrives thirty seconds later with a calmer expression and worse implications. Julian follows with drinks he absolutely should not have acquired from the staff lounge.",
            "The dock test stops being a secret and becomes something stranger: a shared decision that everyone can still pretend was spontaneous if the paperwork gets ugly."
          ],
          choices: [
            makeChoice("Let Theo define the abort conditions.", [
              { type: "relationship", key: "Theo", delta: 2 },
              { type: "stat", key: "control", delta: 1 },
              { type: "flag", key: "theoAbortConditions", value: true }
            ]),
            makeChoice("Let Camille define the success standard.", [
              { type: "relationship", key: "Camille", delta: 2 },
              { type: "stat", key: "foundationPath", delta: 1 },
              { type: "flag", key: "camilleDockStandard", value: true }
            ]),
            makeChoice("Let Julian narrate because plausible deniability deserves production value.", [
              { type: "relationship", key: "Julian", delta: 2 },
              { type: "stat", key: "exposure", delta: 1 },
              { type: "flag", key: "julianDockNarration", value: true }
            ])
          ]
        },
        {
          slug: "waterline",
          title: "Waterline Nerves",
          location: "Dock Edge",
          focus: "Seth",
          text: [
            "The ocean below the dock is black glass, reflecting campus lights in broken strips. Piper bounces on her heels. Camille watches the geometry. Theo watches the numbers. Julian watches everyone watching, because of course he does.",
            "You stand at the edge and feel the old argument return: power as danger, power as freedom, power as proof. Aegis can measure the first. It can authorize some forms of the second. It is terrible at the third.",
            "The wind comes off the water. The dock creaks. For one clean second, the night waits."
          ],
          choices: [
            makeChoice("Make the first attempt modest and repeatable.", [
              { type: "stat", key: "control", delta: 2 },
              { type: "powerXp", amount: 1 },
              { type: "flag", key: "modestDockAttempt", value: true }
            ]),
            makeChoice("Make the first attempt beautiful enough to be remembered.", [
              { type: "stat", key: "audacity", delta: 1 },
              { type: "relationship", key: "Julian", delta: 1 },
              { type: "powerXp", amount: 1 },
              { type: "flag", key: "beautifulDockAttempt", value: true }
            ]),
            makeChoice("Make the first attempt safe enough that Theo breathes again.", [
              { type: "relationship", key: "Theo", delta: 1 },
              { type: "stat", key: "restraint", delta: 2 },
              { type: "flag", key: "theoBreathesDock", value: true }
            ])
          ]
        },
        {
          slug: "afterglow",
          title: "After The Splash",
          location: "East Dock",
          focus: "Piper",
          text: [
            "Whether the test ends in clean lift, hard landing, or a splash nobody will admit was funny, the dock feels different afterward. The group has crossed a line together. Not a catastrophic one. Maybe not even a bad one. But a line does not have to explode to matter.",
            "Piper's smile is bright enough to make the floodlights jealous. Camille says something about repeatability. Theo says something about never doing that again without a waiver. Julian says the waiver would make an excellent souvenir.",
            "You realize the night was not only about power. It was about who chose to stand close to it."
          ],
          choices: [
            makeChoice("Thank them like a team, not an audience.", [
              { type: "relationship", key: "Piper", delta: 1 },
              { type: "relationship", key: "Camille", delta: 1 },
              { type: "relationship", key: "Julian", delta: 1 },
              { type: "relationship", key: "Theo", delta: 1 },
              { type: "flag", key: "thankedDockTeam", value: true }
            ]),
            makeChoice("Thank Piper privately for making power feel like fun again.", [
              { type: "relationship", key: "Piper", delta: 2 },
              { type: "flag", key: "piperMadePowerFun", value: true }
            ]),
            makeChoice("Ask Camille what she would change before the next attempt.", [
              { type: "relationship", key: "Camille", delta: 2 },
              { type: "stat", key: "control", delta: 1 },
              { type: "flag", key: "askedCamilleDockIteration", value: true }
            ])
          ]
        }
      ]
    },
    {
      id: 6,
      entry: "c06_blackwater_drive",
      background: "city",
      beats: [
        {
          slug: "permission",
          title: "Off Campus",
          location: "West Lot",
          focus: "Julian",
          text: [
            "Leaving campus with Julian driving feels like stepping out of one genre and into another. Aegis recedes behind reinforced glass and policy. Blackwater waits ahead with neon, traffic, old money, and the specific danger of places where nobody is officially supervising the powerful adults.",
            "Julian's car is too quiet for how fast it moves. Piper complains that this ruins the point of speed. Camille sits with one knee crossed over the other, watching the city like it is a negotiation. Theo checks the route twice and pretends not to.",
            "The Event Horizon is supposed to be dinner. Everyone knows that is not all it is."
          ],
          choices: [
            makeChoice("Ask Julian what kind of place names itself after no escape.", [
              { type: "relationship", key: "Julian", delta: 2 },
              { type: "stat", key: "audacity", delta: 1 },
              { type: "flag", key: "askedEventHorizonName", value: true }
            ]),
            makeChoice("Check with Theo before the city swallows the route.", [
              { type: "relationship", key: "Theo", delta: 1 },
              { type: "stat", key: "restraint", delta: 1 },
              { type: "flag", key: "checkedTheoRoute", value: true }
            ]),
            makeChoice("Let yourself enjoy being off campus before the night complicates it.", [
              { type: "relationship", key: "Piper", delta: 1 },
              { type: "stat", key: "civilianPath", delta: 1 },
              { type: "flag", key: "enjoyedOffCampus", value: true }
            ])
          ]
        },
        {
          slug: "restaurant",
          title: "The Horizon Room",
          location: "Event Horizon",
          focus: "Kaito",
          text: [
            "The Event Horizon hides behind a black door with no sign, which is either classy or annoying depending on how hungry you are. Inside, the restaurant is all low light, private booths, impossible sightlines, and staff who notice everything while appearing to notice nothing.",
            "Kaito greets Julian by name and treats the rest of you like interesting weather. He is polite to Piper, respectful to Camille, careful with Theo, and too measured with you. That last part tells you your file arrived before dinner did.",
            "No one says villain. No one says target. No one says Aegis leak. The room is too expensive for obvious words."
          ],
          choices: [
            makeChoice("Let Kaito know you notice careful hospitality.", [
              { type: "relationship", key: "Kaito", delta: 2 },
              { type: "stat", key: "control", delta: 1 },
              { type: "flag", key: "noticedKaitoHospitality", value: true }
            ]),
            makeChoice("Let Julian handle the room. This is his stage.", [
              { type: "relationship", key: "Julian", delta: 2 },
              { type: "stat", key: "foundationPath", delta: 1 },
              { type: "flag", key: "trustedJulianStage", value: true }
            ]),
            makeChoice("Sit where you can see every exit.", [
              { type: "stat", key: "contractorPath", delta: 1 },
              { type: "stat", key: "resolve", delta: 1 },
              { type: "flag", key: "watchedRestaurantExits", value: true }
            ])
          ]
        },
        {
          slug: "table",
          title: "Table Chemistry",
          location: "Private Booth",
          focus: "Piper",
          text: [
            "Dinner starts almost normal, which is how trouble gets room to build momentum. Piper steals fries off your plate because speed apparently applies to property law. Julian recommends something expensive with a straight face. Camille critiques the recommendation and orders it anyway. Theo watches the staff patterns between bites.",
            "The table has a rhythm now. Not effortless. Effortless is a lie people tell after practice becomes invisible. This is practiced in real time, the five of you learning when to push, when to soften, and who needs a joke before a hard truth.",
            "For a few minutes, Aegis feels far away. That is usually when stories punish people."
          ],
          choices: [
            makeChoice("Keep the table light and give everyone one clean breath.", [
              { type: "relationship", key: "Piper", delta: 1 },
              { type: "relationship", key: "Julian", delta: 1 },
              { type: "stat", key: "civilianPath", delta: 1 },
              { type: "flag", key: "keptDinnerLight", value: true }
            ]),
            makeChoice("Ask Camille whether she trusts rooms like this.", [
              { type: "relationship", key: "Camille", delta: 2 },
              { type: "stat", key: "contractorPath", delta: 1 },
              { type: "flag", key: "askedCamilleRoomTrust", value: true }
            ]),
            makeChoice("Ask Theo what feels wrong.", [
              { type: "relationship", key: "Theo", delta: 2 },
              { type: "stat", key: "control", delta: 1 },
              { type: "flag", key: "askedTheoWrongness", value: true }
            ])
          ]
        },
        {
          slug: "signal",
          title: "The Wrong Signal",
          location: "Event Horizon",
          focus: "Theo",
          text: [
            "Theo notices the wrongness first because Theo always notices the part of the room that refuses to average out. A server takes three seconds too long at a table with no food. Kaito's smile changes by one degree. Piper's knee stops bouncing. Camille's hand stills near her water glass.",
            "Then your power reacts.",
            "Not a surge. Not a warning exactly. More like recognition. Somewhere near the edge of the restaurant, something hungry brushes the world, and the reservoir inside you answers before you have a name for it."
          ],
          choices: [
            makeChoice("Signal the table quietly. No panic, no performance.", [
              { type: "relationship", key: "Theo", delta: 1 },
              { type: "stat", key: "control", delta: 2 },
              { type: "flag", key: "quietSignalEventHorizon", value: true }
            ]),
            makeChoice("Stand first and make yourself the obvious target.", [
              { type: "stat", key: "heroPath", delta: 1 },
              { type: "stat", key: "audacity", delta: 1 },
              { type: "flag", key: "obviousTargetEventHorizon", value: true }
            ]),
            makeChoice("Tell Piper to move only when she sees your hand close.", [
              { type: "relationship", key: "Piper", delta: 2 },
              { type: "stat", key: "restraint", delta: 1 },
              { type: "flag", key: "piperHandSignal", value: true }
            ])
          ]
        },
        {
          slug: "before_breach",
          title: "Before The Breach",
          location: "Event Horizon",
          focus: "Seth",
          text: [
            "There is a last moment before violence where everything becomes insultingly detailed. The condensation on Theo's glass. The angle of Camille's shoulders. Julian's expression losing its performance. Piper's fingers flexing once against the booth.",
            "You can still choose the shape of the first second. That may be the only mercy.",
            "Aegis trained you for controlled rooms. The city is about to ask whether the training survives contact with people you care about."
          ],
          choices: [
            makeChoice("Anchor the group before you answer the threat.", [
              { type: "relationship", key: "Piper", delta: 1 },
              { type: "relationship", key: "Camille", delta: 1 },
              { type: "relationship", key: "Julian", delta: 1 },
              { type: "relationship", key: "Theo", delta: 1 },
              { type: "stat", key: "restraint", delta: 1 },
              { type: "flag", key: "anchoredGroupBeforeBreach", value: true }
            ]),
            makeChoice("Answer the threat before it finishes introducing itself.", [
              { type: "stat", key: "audacity", delta: 2 },
              { type: "stat", key: "aegisFear", delta: 1 },
              { type: "flag", key: "preemptedBreach", value: true }
            ]),
            makeChoice("Wait half a breath for the pattern Theo saw.", [
              { type: "relationship", key: "Theo", delta: 1 },
              { type: "stat", key: "control", delta: 1 },
              { type: "stat", key: "contractorPath", delta: 1 },
              { type: "flag", key: "waitedForPattern", value: true }
            ])
          ]
        }
      ]
    },
    {
      id: 7,
      entry: "c07_before_bait",
      background: "sim",
      beats: [
        {
          slug: "morning",
          title: "The Morning After Contact",
          location: "Aegis Medical",
          focus: "Vance",
          text: [
            "Aegis medical smells like antiseptic, coffee, and people pretending they slept. The Event Horizon report has already grown teeth. Vektor is no longer a rumor with expensive lawyers. Rhea Kane is no longer a name in someone else's file.",
            "Vance reviews the facts without raising his voice. That makes them worse. External hostile contact. Targeted intelligence. Unclear leak vector. Unknown escalation ceiling. You sit under fluorescent lights while the adults in charge decide which category of danger you have become.",
            "The worst part is that some of their fear is reasonable."
          ],
          choices: [
            makeChoice("Cooperate fully. The threat is bigger than pride.", [
              { type: "relationship", key: "Vance", delta: 2 },
              { type: "stat", key: "aegisTrust", delta: 1 },
              { type: "flag", key: "cooperatedAfterContact", value: true }
            ]),
            makeChoice("Cooperate, but ask who leaked enough for Vektor to aim.", [
              { type: "stat", key: "foundationPath", delta: 1 },
              { type: "stat", key: "resolve", delta: 1 },
              { type: "flag", key: "pressedLeakAfterContact", value: true }
            ]),
            makeChoice("Make it clear fear is not the same as authority.", [
              { type: "stat", key: "independentPath", delta: 1 },
              { type: "stat", key: "audacity", delta: 1 },
              { type: "flag", key: "fearNotAuthority", value: true }
            ])
          ]
        },
        {
          slug: "fallout",
          title: "Friend Fallout",
          location: "Residence Kitchen",
          focus: "Piper",
          text: [
            "The residence kitchen becomes headquarters because every crisis eventually needs bad coffee. Piper sits on the counter until Camille tells her to get off for sanitary reasons. Piper gets off, then sits on a different counter. Julian calls that compliance. Theo does not look up from the tablet.",
            "Nobody says they were scared at first. They argue logistics, camera gaps, Rhea's entry path, Vektor's likely goals. Then the practical words run out and fear is still in the room, waiting to be admitted.",
            "Piper breaks first. \"So we are all agreed? Whoever aimed her at us gets introduced to consequences.\""
          ],
          choices: [
            makeChoice("Agree, but define consequences before anger defines them.", [
              { type: "relationship", key: "Piper", delta: 1 },
              { type: "relationship", key: "Theo", delta: 1 },
              { type: "stat", key: "restraint", delta: 1 },
              { type: "flag", key: "definedConsequences", value: true }
            ]),
            makeChoice("Agree without softening it. They came for your people.", [
              { type: "relationship", key: "Piper", delta: 2 },
              { type: "stat", key: "audacity", delta: 1 },
              { type: "stat", key: "villainPath", delta: 1 },
              { type: "flag", key: "theyCameForYourPeople", value: true }
            ]),
            makeChoice("Ask Camille what response survives politics.", [
              { type: "relationship", key: "Camille", delta: 2 },
              { type: "stat", key: "foundationPath", delta: 1 },
              { type: "flag", key: "askedCamillePoliticalResponse", value: true }
            ])
          ]
        },
        {
          slug: "bait",
          title: "Designing The Trap",
          location: "Strategy Room",
          focus: "Theo",
          text: [
            "Theo hates the bait plan before anyone finishes describing it. That is not cowardice. It is math with a conscience. The model says Rhea is most likely to strike when you are isolated, emotionally loaded, and apparently underprotected. The model also says giving her that condition on purpose is, in Theo's words, deeply, aggressively stupid.",
            "Camille says stupid can be engineered into acceptable if the failure states are boxed correctly. Piper says acceptable is not the brand she would choose. Julian says bait always sounds less humiliating when someone else is the worm.",
            "Everyone looks at you because the plan only works if your danger becomes the door."
          ],
          choices: [
            makeChoice("Let Theo write the abort trigger and promise to obey it.", [
              { type: "relationship", key: "Theo", delta: 3 },
              { type: "stat", key: "restraint", delta: 1 },
              { type: "flag", key: "theoAbortPromise", value: true }
            ]),
            makeChoice("Let Camille design the containment geometry.", [
              { type: "relationship", key: "Camille", delta: 2 },
              { type: "stat", key: "control", delta: 1 },
              { type: "flag", key: "camilleTrapGeometry", value: true }
            ]),
            makeChoice("Let Piper define the extraction route, because speed is mercy when plans fail.", [
              { type: "relationship", key: "Piper", delta: 2 },
              { type: "stat", key: "heroPath", delta: 1 },
              { type: "flag", key: "piperExtractionRoute", value: true }
            ])
          ]
        },
        {
          slug: "private",
          title: "Private Terms",
          location: "Residence Hall",
          focus: "Seth",
          text: [
            "Before the plan goes official, each person catches you privately in their own way. Piper with a joke that fails to hide the worry. Camille with a tactical correction that is also concern if you know how to read it. Julian with a dramatic warning disguised as gossip. Theo with a final probability branch he does not want to say aloud.",
            "They are not asking you to be safe. Safe left the table when Rhea walked through the door. They are asking you to come back as yourself.",
            "That is a harder promise."
          ],
          choices: [
            makeChoice("Promise Piper you will come back mockable.", [
              { type: "relationship", key: "Piper", delta: 2 },
              { type: "flag", key: "promisedPiperMockableReturn", value: true }
            ]),
            makeChoice("Promise Camille you will not confuse power with proof.", [
              { type: "relationship", key: "Camille", delta: 2 },
              { type: "stat", key: "control", delta: 1 },
              { type: "flag", key: "promisedCamilleNoProof", value: true }
            ]),
            makeChoice("Promise Theo the abort trigger is real.", [
              { type: "relationship", key: "Theo", delta: 2 },
              { type: "stat", key: "restraint", delta: 1 },
              { type: "flag", key: "promisedTheoAbortReal", value: true }
            ])
          ]
        },
        {
          slug: "threshold",
          title: "The Trap Opens",
          location: "Simulation Dome",
          focus: "Seth",
          text: [
            "The Simulation Dome is too clean for bait. Bait should involve mud, blood, something honest. Instead there are polished floors, hidden emitters, emergency shutters, and an observation ring full of people pretending they are not emotionally invested in the outcome.",
            "Rhea's file sits on your tablet until you close it. Files flatten people into patterns. Useful, but incomplete. Whatever Rhea is, she is about to become present tense.",
            "The dome lights dim. Somewhere in the building, alarms go quiet on purpose. You step into the trap and feel the power answer."
          ],
          choices: [
            makeChoice("Enter with the abort trigger first in your mind.", [
              { type: "stat", key: "restraint", delta: 2 },
              { type: "relationship", key: "Theo", delta: 1 },
              { type: "flag", key: "enteredTrapWithAbort", value: true }
            ]),
            makeChoice("Enter with the containment geometry first.", [
              { type: "stat", key: "control", delta: 2 },
              { type: "relationship", key: "Camille", delta: 1 },
              { type: "flag", key: "enteredTrapWithGeometry", value: true }
            ]),
            makeChoice("Enter with one rule: she does not get to touch your people again.", [
              { type: "stat", key: "resolve", delta: 2 },
              { type: "relationship", key: "Piper", delta: 1 },
              { type: "flag", key: "enteredTrapForPeople", value: true }
            ])
          ]
        }
      ]
    },
    {
      id: 8,
      entry: "c08_airbase",
      background: "aegis",
      beats: [
        {
          slug: "review",
          title: "After The Review Board",
          location: "Aegis Hangar Hall",
          focus: "Seth",
          text: [
            "After the review board, the hangar hallway feels too large and too small at the same time. Too large because every sound echoes. Too small because the decision you made with Rhea follows you through it, taking up more space than your body.",
            "Aegis has words for outcomes: contained, neutralized, escaped, acceptable, escalated, pending review. Your friends have faces. The faces are harder.",
            "Piper finds you first because speed is not only movement. Sometimes speed is refusing to let someone be alone with the worst version of a room."
          ],
          choices: [
            makeChoice("Let Piper be there without making her make it funny.", [
              { type: "relationship", key: "Piper", delta: 2 },
              { type: "stat", key: "resolve", delta: 1 },
              { type: "flag", key: "letPiperBeSerious", value: true }
            ]),
            makeChoice("Ask for the next training block. Motion beats spiraling.", [
              { type: "stat", key: "control", delta: 1 },
              { type: "powerXp", amount: 1 },
              { type: "flag", key: "askedTrainingAfterReview", value: true }
            ]),
            makeChoice("Ask where Theo is.", [
              { type: "relationship", key: "Theo", delta: 2 },
              { type: "stat", key: "restraint", delta: 1 },
              { type: "flag", key: "askedWhereTheoAfterReview", value: true }
            ])
          ]
        },
        {
          slug: "airbase",
          title: "Runway Permission",
          location: "Aegis Airbase",
          focus: "Piper",
          text: [
            "The airbase is where Aegis puts things too loud, fast, or embarrassing for the central campus. Prototype aircraft sleep in hangars. Reinforced strips run toward the water. The wind has room to become a decision.",
            "Piper explains the plan with a grin that would not survive court scrutiny. She hits you at speed. You absorb the kinetic force. Everybody learns something. Theo makes a noise that suggests this plan has personally betrayed him.",
            "The idea is absurd. It is also, annoyingly, good training. Your power needs real force. Piper needs someone who can let her run all the way into impact without turning either of you into a memorial plaque."
          ],
          choices: [
            makeChoice("Set strict speed brackets before the first impact.", [
              { type: "relationship", key: "Theo", delta: 1 },
              { type: "stat", key: "control", delta: 2 },
              { type: "flag", key: "setMachBrackets", value: true }
            ]),
            makeChoice("Let Piper set the pace, but keep abort authority yourself.", [
              { type: "relationship", key: "Piper", delta: 2 },
              { type: "stat", key: "restraint", delta: 1 },
              { type: "flag", key: "piperPaceSelfAbort", value: true }
            ]),
            makeChoice("Ask Camille what would make this repeatable instead of lucky.", [
              { type: "relationship", key: "Camille", delta: 2 },
              { type: "stat", key: "foundationPath", delta: 1 },
              { type: "flag", key: "camilleMachRepeatable", value: true }
            ])
          ]
        },
        {
          slug: "firsthit",
          title: "Impact Lessons",
          location: "Runway",
          focus: "Seth",
          text: [
            "The first controlled impact teaches you three things. Piper is faster than fear. Your power likes force more than you like admitting. The body reacts to being hit even when the hit becomes fuel.",
            "The second impact teaches you that confidence is not the same as stability. The third teaches you that Piper's grin gets sharper when she is scared and refusing to show it.",
            "Training stops being a stunt. It becomes a language. Speed asks whether you can receive it. Your answer gets cleaner every time."
          ],
          choices: [
            makeChoice("Focus on clean absorption over impressive release.", [
              { type: "stat", key: "control", delta: 2 },
              { type: "powerXp", amount: 2 },
              { type: "flag", key: "cleanMachAbsorption", value: true }
            ]),
            makeChoice("Focus on catching Piper safely after each hit.", [
              { type: "relationship", key: "Piper", delta: 2 },
              { type: "stat", key: "restraint", delta: 1 },
              { type: "flag", key: "caughtPiperSafely", value: true }
            ]),
            makeChoice("Focus on how much force you can hold before Aegis gets afraid.", [
              { type: "stat", key: "audacity", delta: 1 },
              { type: "stat", key: "aegisFear", delta: 1 },
              { type: "powerXp", amount: 2 },
              { type: "flag", key: "testedMachFearLine", value: true }
            ])
          ]
        },
        {
          slug: "audience",
          title: "People Near The Blast",
          location: "Runway Edge",
          focus: "Julian",
          text: [
            "By the time the speed climbs, everyone has moved farther back except the people too stubborn or too invested to pretend distance is neutral. Julian claps after one impact, then stops when Theo looks like he might throw the tablet at him.",
            "Camille does not tell you to stop. That means more than encouragement would. Piper rolls her shoulders at the far end of the runway, a bright point of motion against the evening light.",
            "You understand suddenly that being trusted with someone's speed is intimate in a way nobody prepared you for. She is making herself a disaster and trusting you to make disaster survivable."
          ],
          choices: [
            makeChoice("Tell Piper the next run only happens if she still wants it after breathing.", [
              { type: "relationship", key: "Piper", delta: 2 },
              { type: "stat", key: "restraint", delta: 1 },
              { type: "flag", key: "askedPiperBreatheMach", value: true }
            ]),
            makeChoice("Tell Theo to call the limit without apologizing for caring.", [
              { type: "relationship", key: "Theo", delta: 2 },
              { type: "stat", key: "control", delta: 1 },
              { type: "flag", key: "theoCanCallLimit", value: true }
            ]),
            makeChoice("Tell Julian if he narrates your death you will haunt his wardrobe.", [
              { type: "relationship", key: "Julian", delta: 2 },
              { type: "stat", key: "audacity", delta: 1 },
              { type: "flag", key: "hauntJulianWardrobe", value: true }
            ])
          ]
        },
        {
          slug: "ceiling",
          title: "The Higher Ceiling",
          location: "Runway Center",
          focus: "Seth",
          text: [
            "The higher ceiling is not a number. It is a sensation: the moment your power stops feeling like a tool you hold and starts feeling like a horizon moving with you. Piper waits at distance. The observers wait at the edge. Aegis waits inside every sensor pointed at your chest.",
            "You could be careful and still change the file forever. You could be reckless and survive, which is worse because survival can make recklessness look wise in hindsight.",
            "The runway lights flicker. The wind drops. Piper moves."
          ],
          choices: [
            makeChoice("Meet the impact with everything disciplined in you.", [
              { type: "stat", key: "control", delta: 2 },
              { type: "stat", key: "restraint", delta: 1 },
              { type: "powerXp", amount: 2 },
              { type: "flag", key: "disciplinedMachMeet", value: true }
            ]),
            makeChoice("Meet it with trust first. Piper is not a projectile. She is Piper.", [
              { type: "relationship", key: "Piper", delta: 3 },
              { type: "stat", key: "resolve", delta: 1 },
              { type: "flag", key: "trustedPiperMach", value: true }
            ]),
            makeChoice("Meet it knowing everyone will see what Aegis has been underestimating.", [
              { type: "stat", key: "aegisFear", delta: 1 },
              { type: "stat", key: "foundationPath", delta: 1 },
              { type: "powerXp", amount: 2 },
              { type: "flag", key: "aegisUnderestimatedMach", value: true }
            ])
          ]
        }
      ]
    },
    {
      id: 9,
      entry: "c09_graduation_eve",
      background: "city",
      beats: [
        {
          slug: "return",
          title: "Returning With Thunder In Your Chest",
          location: "Residence Wing",
          focus: "Seth",
          text: [
            "Returning from the airbase with impossible kinetic force still banked under your ribs makes every hallway feel underbuilt. The lights are normal. The walls are normal. You are the part of the scene that does not fit the scale anymore.",
            "Graduation is tomorrow, which sounds like closure until you think about it for half a second. Aegis is not ending. It is becoming optional in ways that may make it more dangerous.",
            "Your room contains a suitcase, a formal jacket, three unread messages, and the sudden awareness that leaving a place can hurt even when the place was never gentle."
          ],
          choices: [
            makeChoice("Release a harmless thread of stored force before you enter the residence wing.", [
              { type: "stat", key: "control", delta: 2 },
              { type: "powerXp", amount: 1 },
              { type: "flag", key: "bledForceBeforeDorm", value: true }
            ]),
            makeChoice("Keep the force banked. You need to know how long you can carry it.", [
              { type: "stat", key: "audacity", delta: 1 },
              { type: "powerXp", amount: 2 },
              { type: "flag", key: "carriedMachForce", value: true }
            ]),
            makeChoice("Ask Theo to monitor you until the readings stop arguing.", [
              { type: "relationship", key: "Theo", delta: 2 },
              { type: "stat", key: "restraint", delta: 1 },
              { type: "flag", key: "theoMonitoredMachAfter", value: true }
            ])
          ]
        },
        {
          slug: "packing",
          title: "Objects With Receipts",
          location: "Residence Room",
          focus: "Seth",
          text: [
            "Packing is not about objects until it is. The intake tablet. The training jacket. The keycard with a worn edge. The hoodie that smells faintly like dock wind. The cup Piper stole and then insisted was morally communal. The note Theo left under your door because saying it out loud would have made it harder.",
            "Aegis gave you a room. People made it a life by leaving evidence behind.",
            "The suitcase stays open because closing it would make the next part official."
          ],
          choices: [
            makeChoice("Pack the jacket. You earned it, even if you outgrow what it means.", [
              { type: "stat", key: "heroPath", delta: 1 },
              { type: "relationship", key: "Vance", delta: 1 },
              { type: "flag", key: "deepPackedJacket", value: true }
            ]),
            makeChoice("Leave the jacket. You are not carrying their symbol for free.", [
              { type: "stat", key: "independentPath", delta: 1 },
              { type: "stat", key: "resolve", delta: 1 },
              { type: "flag", key: "deepLeftJacket", value: true }
            ]),
            makeChoice("Pack the practical things first. Sentiment can wait until the bag closes.", [
              { type: "stat", key: "contractorPath", delta: 1 },
              { type: "stat", key: "restraint", delta: 1 },
              { type: "flag", key: "packedPracticalFirst", value: true }
            ])
          ]
        },
        {
          slug: "messages",
          title: "Messages Nobody Sends Cleanly",
          location: "Residence Room",
          focus: "Seth",
          text: [
            "The messages come in clusters. Piper sends a rooftop photo with no caption. Camille sends a document titled post-graduation vulnerabilities and pretends that is not emotional. Julian sends a reservation link, three jokes, and one sentence without punctuation: do not vanish without making it dramatic. Theo sends a checklist and then, two minutes later, sorry. ignore item seven.",
            "You read them all twice. Then a third time for the parts they did not say.",
            "Relationships are not side routes anymore. They are load-bearing."
          ],
          choices: [
            makeChoice("Answer Piper first because some exits are also invitations.", [
              { type: "relationship", key: "Piper", delta: 2 },
              { type: "stat", key: "independentPath", delta: 1 },
              { type: "flag", key: "deepAnsweredPiperFirst", value: true }
            ]),
            makeChoice("Answer Camille first because architecture matters before the roof goes on.", [
              { type: "relationship", key: "Camille", delta: 2 },
              { type: "stat", key: "foundationPath", delta: 1 },
              { type: "flag", key: "deepAnsweredCamilleFirst", value: true }
            ]),
            makeChoice("Answer Theo first because item seven is probably the important one.", [
              { type: "relationship", key: "Theo", delta: 2 },
              { type: "stat", key: "contractorPath", delta: 1 },
              { type: "flag", key: "deepAnsweredTheoFirst", value: true }
            ])
          ]
        },
        {
          slug: "future",
          title: "Future Shapes",
          location: "Rooftop Access",
          focus: "Piper",
          text: [
            "The rooftop is technically closed, which at this point feels like tradition. Piper meets you by the maintenance door with a grin, two contraband sodas, and the specific posture of someone pretending the future is not standing directly behind her.",
            "Blackwater glows beyond the campus. Somewhere out there are hero licenses, private contracts, corporate foundations, quiet apartments, bad ideas with good branding, and people who would happily call you a villain if it made their fear sound principled.",
            "Piper looks at the city instead of you when she says, \"We could build something that does not ask permission from cowards.\""
          ],
          choices: [
            makeChoice("Say yes to the shape of it, but not yet to every method.", [
              { type: "relationship", key: "Piper", delta: 2 },
              { type: "stat", key: "restraint", delta: 1 },
              { type: "flag", key: "yesButMethodsMatter", value: true }
            ]),
            makeChoice("Say Aegis taught you enough to know permission is often a costume.", [
              { type: "relationship", key: "Piper", delta: 2 },
              { type: "stat", key: "independentPath", delta: 2 },
              { type: "flag", key: "permissionIsCostume", value: true }
            ]),
            makeChoice("Say you want the others in the room before the dream becomes a secret.", [
              { type: "relationship", key: "Camille", delta: 1 },
              { type: "relationship", key: "Theo", delta: 1 },
              { type: "stat", key: "foundationPath", delta: 1 },
              { type: "flag", key: "wantOthersBeforeSecret", value: true }
            ])
          ]
        },
        {
          slug: "dawn",
          title: "Before Dawn",
          location: "Residence Wing",
          focus: "Seth",
          text: [
            "Sleep comes late and badly. Your room is too quiet. The power is too quiet. The future is not quiet at all.",
            "You think about the first day: the gate, the file, the line on the concrete, the first person who smiled like trouble might be survivable. You think about Rhea. About Vance. About Piper's speed becoming trust. About Camille's standards, Julian's theater, Theo's fear refusing to become cowardice.",
            "By dawn, you do not have certainty. You have something less comfortable and more useful: a choice you will have to keep making after the credits would normally roll."
          ],
          choices: [
            makeChoice("Start graduation day with the official path still possible.", [
              { type: "stat", key: "heroPath", delta: 1 },
              { type: "stat", key: "aegisTrust", delta: 1 },
              { type: "flag", key: "deepOfficialStillPossible", value: true }
            ]),
            makeChoice("Start graduation day with an exit route mapped.", [
              { type: "stat", key: "independentPath", delta: 1 },
              { type: "stat", key: "resolve", delta: 1 },
              { type: "flag", key: "deepExitRouteMapped", value: true }
            ]),
            makeChoice("Start graduation day refusing false promises in any direction.", [
              { type: "stat", key: "civilianPath", delta: 1 },
              { type: "stat", key: "restraint", delta: 1 },
              { type: "flag", key: "deepNoFalsePromises", value: true }
            ])
          ]
        }
      ]
    },
    {
      id: 10,
      entry: "c10_before_stage",
      background: "graduation",
      beats: [
        {
          slug: "morning",
          title: "Graduation Morning",
          location: "Aegis Atrium",
          focus: "Seth",
          text: [
            "Graduation morning turns Aegis into theater. Chairs appear in clean rows. Flowers soften corners that were designed to survive impact. Staff wear formal jackets and the carefully neutral expressions of people about to celebrate residents they may still classify as risks.",
            "Your folder waits somewhere behind the stage. It contains scores, clearance recommendations, post-program options, and language polished enough to make ownership sound like opportunity.",
            "People keep saying congratulations. It lands strangely. You are not sure whether you survived Aegis, became part of it, or learned how to leave with enough of yourself intact to make that distinction matter."
          ],
          choices: [
            makeChoice("Review the official options before the ceremony.", [
              { type: "stat", key: "contractorPath", delta: 1 },
              { type: "stat", key: "control", delta: 1 },
              { type: "flag", key: "reviewedOfficialOptions", value: true }
            ]),
            makeChoice("Ignore the folder until it is in your hand.", [
              { type: "stat", key: "resolve", delta: 1 },
              { type: "stat", key: "independentPath", delta: 1 },
              { type: "flag", key: "ignoredFolderUntilHand", value: true }
            ]),
            makeChoice("Find the people who matter before the institution gets its speech.", [
              { type: "relationship", key: "Piper", delta: 1 },
              { type: "relationship", key: "Camille", delta: 1 },
              { type: "relationship", key: "Julian", delta: 1 },
              { type: "relationship", key: "Theo", delta: 1 },
              { type: "flag", key: "foundPeopleBeforeSpeech", value: true }
            ])
          ]
        },
        {
          slug: "folder",
          title: "The Folder Has Weight",
          location: "Aegis Atrium",
          focus: "Vance",
          text: [
            "Vance gives speeches the way some people handle blades: carefully, with no wasted movement. He talks about responsibility, integration, restraint, public trust. He does not say fear. He does not say money. He does not say that powerful adults become political facts the moment they step outside supervised walls.",
            "When your name is called, the walk to the stage feels longer than the building. The folder is heavier than paper should be.",
            "Vance holds your eye as he hands it over. Whatever he thinks of your choices, he knows they were choices. That is not forgiveness. It might be respect."
          ],
          choices: [
            makeChoice("Accept the folder like a license you intend to honor.", [
              { type: "relationship", key: "Vance", delta: 2 },
              { type: "stat", key: "heroPath", delta: 1 },
              { type: "flag", key: "acceptedFolderAsLicense", value: true }
            ]),
            makeChoice("Accept it like evidence, not permission.", [
              { type: "stat", key: "independentPath", delta: 1 },
              { type: "stat", key: "resolve", delta: 1 },
              { type: "flag", key: "acceptedFolderAsEvidence", value: true }
            ]),
            makeChoice("Ask Vance quietly whether the recommendation is his or Aegis's.", [
              { type: "relationship", key: "Vance", delta: 2 },
              { type: "stat", key: "contractorPath", delta: 1 },
              { type: "flag", key: "askedVanceRecommendationOwner", value: true }
            ])
          ]
        },
        {
          slug: "goodbyes",
          title: "Goodbyes Refuse To Behave",
          location: "Atrium Edge",
          focus: "Piper",
          text: [
            "Goodbyes after graduation refuse to behave like goodbyes. Piper says she will see you at dinner and steals a flower from an arrangement. Camille says not to sign anything without review, which is apparently her version of tenderness. Julian says the lighting was a crime. Theo says he uploaded backups of three plans and then apologizes for making that sound normal.",
            "The atrium buzzes around you. Families, sponsors, staff, residents trying to become alumni without looking scared. Everyone is crossing a threshold and pretending thresholds are decorative.",
            "You can feel the group waiting for you to choose the next room."
          ],
          choices: [
            makeChoice("Keep everyone together. The next room is shared.", [
              { type: "relationship", key: "Piper", delta: 1 },
              { type: "relationship", key: "Camille", delta: 1 },
              { type: "relationship", key: "Julian", delta: 1 },
              { type: "relationship", key: "Theo", delta: 1 },
              { type: "flag", key: "deepKeptEveryoneTogether", value: true }
            ]),
            makeChoice("Take one private minute with the person whose absence would change the future most.", [
              { type: "stat", key: "resolve", delta: 1 },
              { type: "flag", key: "deepPrivateMinute", value: true }
            ]),
            makeChoice("Leave the atrium before Aegis can turn the goodbye into another evaluation.", [
              { type: "stat", key: "independentPath", delta: 1 },
              { type: "relationship", key: "Piper", delta: 1 },
              { type: "flag", key: "leftAtriumFast", value: true }
            ])
          ]
        },
        {
          slug: "dinner",
          title: "Dinner Before The Decision",
          location: "Private Restaurant",
          focus: "Camille",
          text: [
            "Dinner begins with ceremony fatigue and ends up becoming a constitutional crisis with appetizers. The folder sits in the middle of the table for ten full minutes before anyone admits everyone is looking at it.",
            "Camille wants structure sturdy enough to survive pressure. Piper wants freedom with teeth. Theo wants safeguards that cannot become leashes. Julian wants narrative control because people fear less efficiently when they are looking at the wrong thing. Vance, absent from the table, still somehow has a chair in the conversation.",
            "They are not asking you to shrink. They are asking what keeps power from eating the reasons you wanted it."
          ],
          choices: [
            makeChoice("Ask Camille to design the guardrails before anyone designs the brand.", [
              { type: "relationship", key: "Camille", delta: 2 },
              { type: "stat", key: "foundationPath", delta: 2 },
              { type: "flag", key: "deepCamilleGuardrails", value: true }
            ]),
            makeChoice("Ask Piper what freedom costs if you refuse to make it cruel.", [
              { type: "relationship", key: "Piper", delta: 2 },
              { type: "stat", key: "independentPath", delta: 2 },
              { type: "flag", key: "deepPiperFreedomCost", value: true }
            ]),
            makeChoice("Ask Theo what safeguard he would trust even on your worst day.", [
              { type: "relationship", key: "Theo", delta: 2 },
              { type: "stat", key: "contractorPath", delta: 1 },
              { type: "stat", key: "restraint", delta: 1 },
              { type: "flag", key: "deepTheoWorstDaySafeguard", value: true }
            ])
          ]
        },
        {
          slug: "choice",
          title: "Before The Position Hardens",
          location: "Private Restaurant",
          focus: "Seth",
          text: [
            "There is a moment before the final decision hardens where every route is still imaginable. Hero license. Aegis contract. Independent operation. Foundation power. Quiet civilian life. Self-rule sharp enough that other people will call it villainy before they ask who made the alternatives so small.",
            "No ending is clean. Clean endings are for stories that do not have to survive the next morning.",
            "The people at the table know different versions of you. The folder knows one. Aegis knows one. Rhea knows one, if Rhea is still alive to know anything. The future will be built from whichever version you choose to keep feeding."
          ],
          choices: [
            makeChoice("Choose from care first. Power follows the people it protects.", [
              { type: "stat", key: "heroPath", delta: 1 },
              { type: "stat", key: "restraint", delta: 1 },
              { type: "flag", key: "finalCareFirst", value: true }
            ]),
            makeChoice("Choose from freedom first. Permission has had long enough.", [
              { type: "stat", key: "independentPath", delta: 1 },
              { type: "stat", key: "resolve", delta: 1 },
              { type: "flag", key: "finalFreedomFirst", value: true }
            ]),
            makeChoice("Choose from design first. A future this dangerous needs architecture.", [
              { type: "stat", key: "foundationPath", delta: 1 },
              { type: "stat", key: "control", delta: 1 },
              { type: "flag", key: "finalDesignFirst", value: true }
            ])
          ]
        }
      ]
    }
  ];

  chapters.forEach((chapter) => {
    const firstId = `c${String(chapter.id).padStart(2, "0")}_deep_${chapter.beats[0].slug}`;
    if (chapter.id === 1) STORY.initialScene = firstId;
    redirectAll(chapter.entry, firstId);
    setChapterStart(chapter.id, firstId);
  });

  chapters.forEach((chapter) => {
    chapter.beats.forEach((beat, index) => {
      const sceneId = `c${String(chapter.id).padStart(2, "0")}_deep_${beat.slug}`;
      const nextBeat = chapter.beats[index + 1];
      const next = nextBeat
        ? `c${String(chapter.id).padStart(2, "0")}_deep_${nextBeat.slug}`
        : chapter.entry;
      scenes[sceneId] = {
        chapter: chapter.id,
        title: beat.title,
        location: beat.location,
        background: beat.background || chapter.background,
        focus: beat.focus || "Seth",
        text: beat.text,
        choices: beat.choices.map((choice) => ({ ...choice, next }))
      };
    });
  });

  const chapter8Start = (STORY.chapters.find((item) => item.id === 8) || {}).start || "c08_airbase";

  if (scenes.c01_first_morning) {
    scenes.c01_first_morning.text = [
      "Breakfast is where Aegis pretends everyone is normal. Nobody floats. Nobody throws sparks. Nobody admits the spoons are reinforced after an incident with a magnetokinetic resident and a bad breakup.",
      "Camille sits two tables away with Julian and Theo, their conversation low and contained. Ben eats alone but not unhappily. Rina watches the room with a competitor's patience.",
      "By the time your tray is empty, the first baseline notification appears on every wall display. Simulation Block A. Ten minutes. No late arrivals."
    ];
    scenes.c01_first_morning.variants = [
      ...(scenes.c01_first_morning.variants || []),
      {
        conditions: [{ type: "flag", key: "metJordan" }],
        text: ["Jordan Pike is already working the breakfast room by the time you sit down, collecting tension and turning it into jokes before anyone can weaponize it."]
      },
      {
        conditions: [{ type: "notFlag", key: "metJordan" }],
        text: ["A nonbinary trainee in a yellow jacket catches the shape of the room faster than anyone else. They introduce themself as Jordan Pike by sliding into a chair, naming three rumors you have not heard yet, and ranking two of them as lazy writing."]
      }
    ];
  }

  if (scenes.c01_shortcuts && scenes.c01_shortcuts.choices) {
    scenes.c01_shortcuts.text = scenes.c01_shortcuts.text.map((line) =>
      line.startsWith("Jordan keeps pace")
        ? "Jordan Pike keeps pace like they planned to join the tour all along. They call it social navigation. Piper calls it knowing where the good snacks are. Either way, the unofficial map of Aegis is already more useful than the official one."
        : line
    );
    scenes.c01_shortcuts.choices.forEach((choice) => {
      choice.effects = choice.effects || [];
      if (!choice.effects.some((effect) => effect.type === "flag" && effect.key === "metJordan")) {
        choice.effects.push({ type: "flag", key: "metJordan", value: true });
      }
    });
  }

  Object.assign(scenes, {
    c07_vektor_processing: {
      chapter: 7,
      title: "Designed For You",
      location: "Aegis Briefing Room",
      background: "aegis",
      focus: "Seth",
      text: [
        "The words stay on the table after the board stops talking. Designed for you. Not improvised. Not random violence with your name attached afterward. Rhea was an attack shaped around your file.",
        "That changes the room. Vance looks older under the briefing lights. Camille's jaw tightens like she has found a flaw in the building itself. Theo goes very still, because a leak is not a probability branch. It is a person, a system, or both.",
        "You realize the worst part is not that Vektor wanted to test your power. It is that someone believed they knew enough about you to build the question."
      ],
      variants: [
        {
          conditions: [{ type: "flag", key: "askedVektorLeak" }],
          text: ["Because you asked the leak question out loud, the silence afterward has a target. Nobody can pretend the test only came from outside the walls."]
        },
        {
          conditions: [{ type: "flag", key: "rheaContained" }],
          text: ["Rhea is alive somewhere below you, which means the designed test might still have an answer locked inside it."]
        },
        {
          conditions: [{ type: "flag", key: "rheaErased" }],
          text: ["If Rhea was the only witness who knew the shape of the design, the crater becomes evidence and absence at the same time."]
        }
      ],
      choices: [
        {
          text: "Ask for the leak investigation in writing before anyone calls this contained.",
          effects: [
            { type: "relationship", key: "Vance", delta: 1 },
            { type: "stat", key: "foundationPath", delta: 1 },
            { type: "stat", key: "resolve", delta: 1 },
            { type: "flag", key: "demandedLeakRecord", value: true }
          ],
          timeMinutes: 30,
          next: "c07_jordan_signal"
        },
        {
          text: "Tell the board Vektor got one thing wrong: you are not a file alone.",
          effects: [
            { type: "relationship", key: "Piper", delta: 1 },
            { type: "relationship", key: "Camille", delta: 1 },
            { type: "relationship", key: "Theo", delta: 1 },
            { type: "stat", key: "heroPath", delta: 1 },
            { type: "flag", key: "notAFileAlone", value: true }
          ],
          timeMinutes: 15,
          next: "c07_jordan_signal"
        },
        {
          text: "Keep your reaction controlled and watch who looks relieved by that.",
          effects: [
            { type: "stat", key: "control", delta: 1 },
            { type: "stat", key: "contractorPath", delta: 1 },
            { type: "flag", key: "watchedLeakReactions", value: true }
          ],
          timeMinutes: 15,
          next: "c07_jordan_signal"
        }
      ]
    },

    c07_jordan_signal: {
      chapter: 7,
      title: "The Signal Around The Signal",
      location: "Residence Stairwell",
      background: "aegis",
      focus: "Jordan",
      text: [
        "Jordan catches you in the stairwell instead of the hall, which tells you they are taking this seriously. The building is already turning the review board into rumor: some versions make you a hero, some make you a weapon, some make Vektor sound like weather instead of a decision.",
        "\"People think gossip is noise,\" Jordan says. \"It is not. It is how institutions test which story they can get away with.\"",
        "For once, their grin does not arrive first. Jordan looks tired, sharp, and very aware that a story about you can become a cage before anyone calls it policy."
      ],
      variants: [
        {
          conditions: [{ type: "relationshipAtLeast", key: "Jordan", value: 4 }],
          text: ["Because you made room for Jordan before this, they give you the cleaner truth: three staff feeds are contradicting each other, and one contradiction smells expensive."]
        },
        {
          conditions: [{ type: "relationshipBelow", key: "Jordan", value: 2 }],
          text: ["You have not given Jordan many reasons to spend social capital on you. They are here anyway, which makes the warning harder to dismiss."]
        }
      ],
      choices: [
        {
          text: "Ask Jordan to trace the contradiction, not just soften the rumor.",
          effects: [
            { type: "relationship", key: "Jordan", delta: 2 },
            { type: "stat", key: "foundationPath", delta: 1 },
            { type: "flag", key: "jordanTracesLeak", value: true },
            { type: "npc", key: "Jordan", trust: 1, respect: 1, memory: "You treated their network as intelligence, not gossip." }
          ],
          timeMinutes: 30,
          next: chapter8Start
        },
        {
          text: "Ask Jordan to protect the people who stood near you in the report.",
          effects: [
            { type: "relationship", key: "Jordan", delta: 2 },
            { type: "relationship", key: "Piper", delta: 1 },
            { type: "stat", key: "heroPath", delta: 1 },
            { type: "flag", key: "jordanProtectsTeamNarrative", value: true }
          ],
          timeMinutes: 30,
          next: chapter8Start
        },
        {
          text: "Tell Jordan not to sand the edges off the story. People should be nervous.",
          effects: [
            { type: "relationship", key: "Jordan", delta: 1 },
            { type: "stat", key: "aegisFear", delta: 1 },
            { type: "stat", key: "independentPath", delta: 1 },
            { type: "flag", key: "keptDangerousNarrative", value: true }
          ],
          timeMinutes: 15,
          next: chapter8Start
        }
      ]
    },

    c08_rina_wall: {
      chapter: 8,
      title: "Wall Check",
      location: "Auxiliary Training Gym",
      background: "aegis",
      focus: "Rina",
      text: [
        "Rina is waiting in the auxiliary gym when the hangar finally lets you leave. No audience. No Piper. No Camille with a clipboard, no Julian turning fear into lighting, no Theo giving the room permission to be worried.",
        "She tosses you a wrapped hand strap. \"You keep getting judged by people who already care whether you survive. Useful. Biased.\"",
        "The challenge under it is not simple jealousy. Rina wants to know whether your control holds when the person across from you does not soften the room."
      ],
      variants: [
        {
          conditions: [{ type: "flag", key: "challengedRinaQueue" }],
          text: ["This started in the baseline queue, with her asking what number you thought you were. Now she has seen enough to ask a better question."]
        },
        {
          conditions: [{ type: "flag", key: "rinaRivalry" }],
          text: ["The old rivalry is still there. It has just learned a second language: respect."]
        },
        {
          conditions: [{ type: "flag", key: "rheaEscaped" }],
          text: ["With Rhea loose, Rina's impatience has a sharper edge. She is not testing your pride. She is testing whether another breach breaks you."]
        }
      ],
      choices: [
        {
          text: "Accept the spar, strict contact rules, no theatrics.",
          effects: [
            { type: "relationship", key: "Rina", delta: 3 },
            { type: "stat", key: "control", delta: 1 },
            { type: "powerXp", amount: 2 },
            { type: "flag", key: "rinaProperScene", value: true },
            { type: "flag", key: "rinaCleanSpar", value: true },
            { type: "npc", key: "Rina", respect: 2, trust: 1, memory: "You gave her a real test without turning it into a show." }
          ],
          timeMinutes: 45,
          next: "c08_private_threshold"
        },
        {
          text: "Ask what she is actually angry about before anyone throws a punch.",
          effects: [
            { type: "relationship", key: "Rina", delta: 3 },
            { type: "stat", key: "restraint", delta: 1 },
            { type: "flag", key: "rinaProperScene", value: true },
            { type: "flag", key: "heardRinaFear", value: true },
            { type: "npc", key: "Rina", trust: 2, concern: -1, memory: "You noticed the fear underneath her challenge and did not mock it." }
          ],
          timeMinutes: 30,
          next: "c08_private_threshold"
        },
        {
          text: "Tell her the future needs rivals who will say when the shot is bad.",
          effects: [
            { type: "relationship", key: "Rina", delta: 2 },
            { type: "stat", key: "audacity", delta: 1 },
            { type: "stat", key: "independentPath", delta: 1 },
            { type: "flag", key: "rinaProperScene", value: true },
            { type: "flag", key: "rinaWildcardOffer", value: true }
          ],
          timeMinutes: 30,
          next: "c08_private_threshold"
        }
      ]
    },

    c09_last_private_moments: {
      chapter: 9,
      title: "The Last Private Door",
      location: "Residence Wing",
      background: "aegis",
      focus: "Seth",
      text: [
        "The residence wing settles into that strange last-night quiet: doors opening, closing, opening again because someone forgot how to leave a place cleanly.",
        "Piper is waiting near the rooftop access, but the hallway gives you one more private door before the future starts moving. Camille, Julian, and Theo have all left traces tonight. The question is which one you answer in person.",
        "Some choices do not change the plot loudly. They change who believes they were chosen before the world got complicated."
      ],
      variants: [
        {
          conditions: [
            { type: "matureContent" },
            { type: "flag", key: "camilleCommitted" }
          ],
          text: ["Camille's room is all control until the door closes. Then control becomes permission, careful and mutual, with nothing left to prove to Aegis."]
        },
        {
          conditions: [
            { type: "matureContent" },
            { type: "flag", key: "julianCommitted" }
          ],
          text: ["Julian leaves the performance in the hall. Behind the closed door, the night is quieter, warmer, and too honest to survive narration."]
        },
        {
          conditions: [
            { type: "matureContent" },
            { type: "flag", key: "theoCommitted" }
          ],
          text: ["Theo asks once, clearly, because consent matters more to him when fear is in the room. The answer gives the night a shape neither of you has to explain."]
        }
      ],
      choices: [
        {
          text: "Take Camille's ten minutes seriously enough to call them what they are.",
          conditions: [
            { type: "any", conditions: [
              { type: "flag", key: "camilleCommitted" },
              { type: "relationshipAtLeast", key: "Camille", value: 8 }
            ] }
          ],
          effects: [
            { type: "relationship", key: "Camille", delta: 2 },
            { type: "stat", key: "foundationPath", delta: 1 },
            { type: "flag", key: "camilleLastPrivateMoment", value: true },
            { type: "npc", key: "Camille", trust: 1, attraction: 1, memory: "You gave her the private honesty she asked for before graduation." }
          ],
          timeMinutes: 30,
          next: "c09_private_camille"
        },
        {
          text: "Let Julian steal five minutes and then admit you wanted him to.",
          conditions: [
            { type: "any", conditions: [
              { type: "flag", key: "julianCommitted" },
              { type: "relationshipAtLeast", key: "Julian", value: 8 }
            ] }
          ],
          effects: [
            { type: "relationship", key: "Julian", delta: 2 },
            { type: "stat", key: "audacity", delta: 1 },
            { type: "flag", key: "julianLastPrivateMoment", value: true },
            { type: "npc", key: "Julian", trust: 1, attraction: 1, memory: "You met him somewhere the performance could finally rest." }
          ],
          timeMinutes: 30,
          next: "c09_private_julian"
        },
        {
          text: "Find Theo and make the promise without turning it into a strategy document.",
          conditions: [
            { type: "any", conditions: [
              { type: "flag", key: "theoCommitted" },
              { type: "relationshipAtLeast", key: "Theo", value: 8 }
            ] }
          ],
          effects: [
            { type: "relationship", key: "Theo", delta: 2 },
            { type: "stat", key: "restraint", delta: 1 },
            { type: "flag", key: "theoLastPrivateMoment", value: true },
            { type: "npc", key: "Theo", trust: 1, attraction: 1, memory: "You gave his fear room without letting it own the night." }
          ],
          timeMinutes: 30,
          next: "c09_private_theo"
        },
        {
          text: "Keep the hallway open and let the goodbyes stay shared.",
          effects: [
            { type: "relationship", key: "Piper", delta: 1 },
            { type: "stat", key: "restraint", delta: 1 },
            { type: "flag", key: "keptLastGoodbyesShared", value: true }
          ],
          timeMinutes: 15,
          next: "c09_private_shared"
        }
      ]
    },

    c09_private_camille: {
      chapter: 9,
      title: "Camille's Ten Minutes",
      location: "Residence Wing",
      background: "aegis",
      focus: "Camille",
      text: [
        "Camille has already packed. Of course she has. Her jacket is folded with military precision, her tablet is face down, and the room looks less lived-in than strategically withdrawn from service.",
        "She says ten minutes, then uses the first one badly. Not because she wastes it. Because she stands there trying to decide which truth will survive being spoken.",
        "\"I am not asking you to become safer,\" Camille says at last. \"I am asking whether I am allowed to expect you to become more honest when the stakes get worse.\""
      ],
      variants: [
        {
          conditions: [{ type: "flag", key: "camilleCommitted" }],
          text: ["The commitment between you does not soften her standards. It makes them personal enough to hurt in the right places."]
        },
        {
          conditions: [{ type: "matureContent" }],
          text: ["When the door closes, the restraint stays mutual instead of cold. Whatever happens after graduation, this part belongs to neither Aegis nor the Fairchild name."]
        }
      ],
      choices: [
        {
          text: "Promise her honesty before strategy, even when strategy would be easier.",
          effects: [
            { type: "relationship", key: "Camille", delta: 1 },
            { type: "stat", key: "control", delta: 1 },
            { type: "flag", key: "camilleHonestyPromise", value: true }
          ],
          timeMinutes: 15,
          next: "c09_walk_piper"
        },
        {
          text: "Tell her you want her in the room precisely because she will not flatter the danger.",
          effects: [
            { type: "relationship", key: "Camille", delta: 1 },
            { type: "stat", key: "foundationPath", delta: 1 },
            { type: "flag", key: "camilleNeededInRoom", value: true }
          ],
          timeMinutes: 15,
          next: "c09_walk_piper"
        }
      ]
    },

    c09_private_julian: {
      chapter: 9,
      title: "Julian Offstage",
      location: "Residence Balcony",
      background: "aegis",
      focus: "Julian",
      text: [
        "Julian steals the balcony because of course he does. The city lights below give him a stage, but he leans on the rail like someone too tired to use it.",
        "\"I have been thinking,\" he says, which is already alarming. \"If we do something stupid after graduation, people will call it spectacle because I am nearby. They will call it corruption because Camille is nearby. They will call it dangerous because you are nearby.\"",
        "The joke arrives late and gentle. \"Personally, I resent being the least legally complicated part of a plan.\""
      ],
      variants: [
        {
          conditions: [{ type: "flag", key: "julianCommitted" }],
          text: ["The mask is still there, but around you he lets it sit crooked. That feels more intimate than any speech he could have made."]
        },
        {
          conditions: [{ type: "matureContent" }],
          text: ["Behind the closed balcony door, Julian lets the night become private without making it small. For once, the performance knows when to leave."]
        }
      ],
      choices: [
        {
          text: "Ask him to help control the story without letting the story control him.",
          effects: [
            { type: "relationship", key: "Julian", delta: 1 },
            { type: "stat", key: "independentPath", delta: 1 },
            { type: "flag", key: "julianControlsStory", value: true }
          ],
          timeMinutes: 15,
          next: "c09_walk_piper"
        },
        {
          text: "Tell him the honest part matters more than the beautiful part.",
          effects: [
            { type: "relationship", key: "Julian", delta: 1 },
            { type: "stat", key: "resolve", delta: 1 },
            { type: "flag", key: "julianHonestOverBeautiful", value: true }
          ],
          timeMinutes: 15,
          next: "c09_walk_piper"
        }
      ]
    },

    c09_private_theo: {
      chapter: 9,
      title: "Theo's Item Seven",
      location: "Study Nook",
      background: "aegis",
      focus: "Theo",
      text: [
        "Theo is in the study nook with two tablets, one empty coffee cup, and the expression of a man negotiating with futures that refuse to behave.",
        "He has deleted item seven from the checklist three times. You can tell because the cursor keeps returning to the blank space like guilt with a refresh rate.",
        "\"Item seven was selfish,\" Theo says. \"It said do not let the plan become more important than coming back.\""
      ],
      variants: [
        {
          conditions: [{ type: "flag", key: "theoCommitted" }],
          text: ["The promise between you does not make him less afraid. It gives him somewhere honest to put the fear."]
        },
        {
          conditions: [{ type: "matureContent" }],
          text: ["Theo asks for the private thing plainly, because ambiguity is not tenderness to him. The answer stays quiet, careful, and enough."]
        }
      ],
      choices: [
        {
          text: "Put item seven back on the list and sign your name under it.",
          effects: [
            { type: "relationship", key: "Theo", delta: 1 },
            { type: "stat", key: "restraint", delta: 1 },
            { type: "flag", key: "theoItemSevenSigned", value: true }
          ],
          timeMinutes: 15,
          next: "c09_walk_piper"
        },
        {
          text: "Tell him fear gets a vote because fear has kept people alive.",
          effects: [
            { type: "relationship", key: "Theo", delta: 1 },
            { type: "stat", key: "contractorPath", delta: 1 },
            { type: "flag", key: "theoFearGetsVote", value: true }
          ],
          timeMinutes: 15,
          next: "c09_walk_piper"
        }
      ]
    },

    c09_private_shared: {
      chapter: 9,
      title: "Shared Hallway",
      location: "Residence Wing",
      background: "aegis",
      focus: "Seth",
      text: [
        "You leave the hallway open. Not because nobody matters enough for privacy, but because the last night already has too many doors closing.",
        "Camille passes with a nod that contains three warnings and one almost-smile. Julian salutes you with a stolen graduation flower. Theo says he sent the checklist and then immediately tells you which parts to ignore.",
        "It is not an intimate goodbye. It is a group refusing to make goodbye useful for Aegis."
      ],
      choices: [
        {
          text: "Carry the shared goodbye with you to the roof.",
          effects: [
            { type: "relationship", key: "Camille", delta: 1 },
            { type: "relationship", key: "Julian", delta: 1 },
            { type: "relationship", key: "Theo", delta: 1 },
            { type: "flag", key: "sharedHallwayGoodbye", value: true }
          ],
          timeMinutes: 15,
          next: "c09_walk_piper"
        }
      ]
    }
  });

  redirect("c07_review_board", chapter8Start, "c07_vektor_processing");
  redirect("c07_review_board", "c08_airbase", "c07_vektor_processing");
  redirect("c08_friend_pressure", "c08_private_threshold", "c08_rina_wall");
  redirect("c09_last_messages", "c09_walk_piper", "c09_last_private_moments");

  if (scenes.c10_ending && scenes.c10_ending.variants) {
    scenes.c10_ending.variants.push(
      {
        conditions: [
          { type: "matureContent" },
          { type: "flag", key: "piperRomance" }
        ],
        text: ["Mature romance thread: With Piper, the private life is still fast, reckless, and carefully chosen. The door closes before the world gets to make it content."]
      },
      {
        conditions: [
          { type: "matureContent" },
          { type: "flag", key: "camilleCommitted" }
        ],
        text: ["Mature romance thread: Camille's intimacy is not surrender. It is precision offered willingly, a private architecture built where leverage cannot reach."]
      },
      {
        conditions: [
          { type: "matureContent" },
          { type: "flag", key: "julianCommitted" }
        ],
        text: ["Mature romance thread: Julian keeps one joke ready and does not need it. That is how you know the door has closed on a real thing."]
      },
      {
        conditions: [
          { type: "matureContent" },
          { type: "flag", key: "theoCommitted" }
        ],
        text: ["Mature romance thread: Theo stays present without translating the moment into risk. For him, that is not small. For you, it becomes part of the ending."]
      }
    );
  }
})();


/* AUTHORING_PACKS_DEEPENING_START */
(function () {
  "use strict";

  const STORY = window.AEGIS_STORY;
  if (!STORY) return;
  const scenes = STORY.scenes;

  Object.assign(scenes, {
    "add_c01_after_orientation_group": {
      "chapter": 1,
      "title": "After The Official Version",
      "location": "Lecture Hall A",
      "background": "aegis",
      "focus": "Piper",
      "text": [
        "Orientation ends the way corporate funerals probably do: with everyone pretending the handout made the emotional reality of the room more manageable. Chairs scrape. Packets close. Someone in the back mutters something that earns a sharp hush from staff and a grin from exactly three trainees.",
        "Piper swings her chair around backward before anyone else has fully stood. \"Okay,\" she says, bracing her arms on the top rail. \"Quick survey. On a scale from one to institutional incident, how badly did that speech make you want to sprint into the ocean?\"",
        "\"The ocean seems melodramatic,\" says the dark-haired man as he stands. Up close he looks even more exact than he did from across the hall. Not fragile. Not vain. Just composed with expensive precision. \"A parking structure would be less effort.\" He offers his hand like the room is not fluorescent and full of latent panic. \"Julian Hart.\"",
        "The one with the watchful gaze hesitates half a beat, visibly deciding whether introducing himself is socially required or merely likely to reduce future friction. \"Theo Arden,\" he says. His voice is lower than you expected, controlled in the way some people sound when they have already edited three more candid versions of the sentence before allowing one out.",
        "Camille closes her tablet with a quiet click. \"If any of you are going to test boundaries on day one, at least have the self-respect to do it intelligently.\"",
        "\"That,\" Piper says, pointing at her, \"is the most romantic thing anyone has said to me in six months.\"",
        "Camille does not blink. \"Your standards are feral.\"",
        "\"My standards,\" Piper says, standing in one fluid motion, \"are adaptive.\" Her attention swings back to you with shameless interest. \"You're new enough that this is still salvageable. Tell me you're at least entertaining ocean.\"",
        "Julian's mouth curves. \"I would like it noted for the record that I favor surviving the first afternoon before anyone commits to maritime rebellion.\"",
        "\"The cameras are everywhere,\" Theo says, then looks annoyed with himself for volunteering the observation.",
        "\"See?\" Piper says. \"This place comes with a live warning label.\"",
        "Camille shifts her attention to you now, not warm, not hostile, simply exact. \"Well?\" she says. \"Are you about to make an excellent first impression or a memorable one?\"",
        "You have the distinct sense that the wrong answer would be much more interesting than the right one.",
        "And maybe that is the problem."
      ],
      "choices": [
        {
          "text": "Tell Piper the ocean idea improves the packet immediately.",
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
              "key": "c01_piper_spark",
              "value": true
            }
          ],
          "next": "add_c01_piper_stairs"
        },
        {
          "text": "Ask Julian how many first impressions he edits per day as a public service.",
          "effects": [
            {
              "type": "relationship",
              "key": "Julian",
              "delta": 2
            },
            {
              "type": "relationship",
              "key": "Camille",
              "delta": 1
            },
            {
              "type": "flag",
              "key": "c01_julian_spark",
              "value": true
            }
          ],
          "next": "add_c01_julian_cafeteria"
        },
        {
          "text": "Ask Theo whether the cameras make him feel better or worse.",
          "effects": [
            {
              "type": "relationship",
              "key": "Theo",
              "delta": 2
            },
            {
              "type": "relationship",
              "key": "Camille",
              "delta": 1
            },
            {
              "type": "flag",
              "key": "c01_theo_spark",
              "value": true
            }
          ],
          "next": "add_c01_theo_walk"
        },
        {
          "text": "Tell Camille that intelligent boundary-testing sounds suspiciously like permission.",
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
              "key": "c01_camille_spark",
              "value": true
            }
          ],
          "next": "add_c01_camille_corridor"
        }
      ]
    },
    "add_c01_common_room_night": {
      "chapter": 1,
      "title": "People Live Here",
      "location": "Common Room",
      "background": "night",
      "focus": "Ensemble",
      "text": [
        "Night changes the common room without making it quieter. The overhead lighting is dimmed just enough that the place stops pretending to be multipurpose and starts admitting it is where people come when their rooms feel too small for whatever the day left in them.",
        "A half-finished card game claims one table. The television is on mute with subtitles no one is reading. Someone has abandoned a pair of shoes under the couch like an offering to shared space. There are fresh bruises on two people you have not learned the names of yet and a hot pack draped over one shoulder three seats over. It is the first time Aegis feels less like intake and more like residency.",
        "Piper is cross-legged on the floor, arguing that a game with this many rules is evidence of moral decline. Ben is across from her, dealing with immense gentleness for a man built like a structural solution. Julian is stretched into a chair with impossible elegance, providing commentary nobody asked for and everybody is secretly relying on. Theo has a book open on his lap and has turned exactly one page in twenty minutes. Camille is by the window with a mug in hand, not participating and not absent either, which somehow exerts more influence over the room than either choice should.",
        "\"New person,\" Piper says the second you enter, as though she called dibs on noticing first. \"Excellent. You can settle a dispute. Does this look like a game designed by sadists or bureaucrats?\"",
        "\"Those categories overlap,\" Theo says without looking up.",
        "\"Thank you, Theodore, your optimism continues to nourish us all,\" Julian replies.",
        "Theo does look up then, mostly to be annoyed. \"Don't call me Theodore like we're in a nineteenth-century boarding novel.\"",
        "\"Then stop speaking like one.\"",
        "Ben covers a laugh with the back of his hand and fails completely.",
        "Camille's gaze flicks toward you over the rim of her mug. \"I hope you have better judgment than to let this become your first civic duty.\"",
        "\"Too late,\" Piper says. \"They're here. They're involved. That's contract law.\"",
        "The room waits for your answer in five different ways.",
        "This is the first real cohort moment of the chapter: no orientation packet, no staged corridor impression, no single private conversation doing all the work. Just the shape people make around each other when the day has tired them enough to stop curating every angle.",
        "Piper needles because stillness makes her feel flammable. Camille withholds until she has reason not to. Julian keeps the room from bruising itself socially when no one notices he is doing it. Theo tracks fault lines before anyone else admits they are there. Ben absorbs slack and humor and the quiet labor of making a shared space function. Jordan drifts through once, takes in the room in one cut of the eyes, steals exactly one cracker off the table with the confidence of inherited rights, and leaves before anyone can assign them to a side.",
        "\"You're all alarmingly settled for people who met, what, hours ago?\" you say.",
        "\"Trauma bonding is efficient,\" Piper says.",
        "\"This is not trauma bonding,\" Camille says.",
        "\"No,\" Julian says. \"This is adult institutional exile with amenities.\"",
        "\"That is much worse branding,\" Ben says.",
        "Even Camille's mouth shifts, not quite into a smile but near enough that the room notices.",
        "The thing about shared spaces is that they create accidental intimacy. Someone gets tired and honest at the same time. Someone reveals a habit they did not know was visible. Someone chooses where to sit, and that choice turns out to matter. The chapter needs one scene where all of that starts.",
        "Piper thumps the floor beside her in invitation. Julian tilts his head toward the open chair nearest him. Theo does not gesture, but the edge of the couch beside him is clear in the way a deliberate silence can be clear. Camille's attention stays on you with an unreadable steadiness that somehow feels more specific than any invitation in the room.",
        "Whatever else today has been, this moment is simple in one important way: you are choosing where to place yourself."
      ],
      "choices": [
        {
          "text": "Drop to the floor beside Piper and let the room get loud around you.",
          "effects": [
            {
              "type": "relationship",
              "key": "Piper",
              "delta": 2
            },
            {
              "type": "relationship",
              "key": "Ben",
              "delta": 1
            },
            {
              "type": "flag",
              "key": "c01_common_sat_piper",
              "value": true
            },
            {
              "type": "memory",
              "key": "Piper",
              "text": "You chose movement and warmth on the first night."
            }
          ],
          "next": "c01_intake_night"
        },
        {
          "text": "Take the chair near Julian and see what he does with proximity.",
          "effects": [
            {
              "type": "relationship",
              "key": "Julian",
              "delta": 2
            },
            {
              "type": "relationship",
              "key": "Jordan",
              "delta": 1
            },
            {
              "type": "flag",
              "key": "c01_common_sat_julian",
              "value": true
            },
            {
              "type": "memory",
              "key": "Julian",
              "text": "You chose his orbit when the room widened."
            }
          ],
          "next": "c01_intake_night"
        },
        {
          "text": "Sit beside Theo and choose the quietest version of company.",
          "effects": [
            {
              "type": "relationship",
              "key": "Theo",
              "delta": 2
            },
            {
              "type": "relationship",
              "key": "Camille",
              "delta": 1
            },
            {
              "type": "flag",
              "key": "c01_common_sat_theo",
              "value": true
            },
            {
              "type": "memory",
              "key": "Theo",
              "text": "You treated quiet as an invitation instead of a wall."
            }
          ],
          "next": "c01_intake_night"
        },
        {
          "text": "Cross to the window and see whether Camille lets the distance stay formal.",
          "effects": [
            {
              "type": "relationship",
              "key": "Camille",
              "delta": 2
            },
            {
              "type": "relationship",
              "key": "Theo",
              "delta": 1
            },
            {
              "type": "flag",
              "key": "c01_common_sat_camille",
              "value": true
            },
            {
              "type": "memory",
              "key": "Camille",
              "text": "You chose her precision when the easier warmth was available."
            }
          ],
          "next": "c01_intake_night"
        }
      ]
    },
    "add_c02_queue_glass": {
      "chapter": 2,
      "title": "Queue Glass",
      "location": "Observation Gallery Queue",
      "background": "sim",
      "focus": "Seth",
      "text": [
        "The line outside the glass observation gallery moves in short, irritated increments. Every few feet there is another strip of yellow on the floor warning trainees where not to stand, as if standing two inches farther forward might make the day go easier. The wall on one side is all polished concrete and emergency signage. The other side is glass, thick enough to distort the edges of people moving beyond it. Technicians in dark Aegis uniforms wheel carts in and out of the baseline rooms with the briskness of people trying not to look impressed by anything.",
        "That alone tells you how this place works. Nothing is allowed to be dramatic out loud. Everything still is.",
        "If you turned heads on your first day, you can feel the residue of it now. Some of the looks in the queue arrive fast and vanish faster. Some linger. A few people do not bother pretending they are not measuring you. If you spent yesterday trying to stay small, the attention feels different-not absent, just sharper, like people are deciding whether the quiet was modesty or camouflage.",
        "Piper appears at your shoulder without enough warning to count as an approach. \"Good morning to the hottest new compliance risk on campus,\" she says, too cheerful for the hour.",
        "If you gave her anything to work with yesterday, her tone carries it. Not a recap. A continuation. If you did not, she still says it like she has already decided you are more fun than the posted safety rules.",
        "A little farther down the line, Camille is speaking to a tech with the kind of contained focus that makes everyone else unconsciously stand straighter. She glances your way once, briefly, the look precise enough to feel like an annotation. Not warm. Not cold. Filed.",
        "Julian leans against the wall near the secondary door, doing that impossible thing where he looks immaculate inside fluorescent institutional lighting. He gives you the faintest lift of his eyebrows. Theo is two places ahead of you in line, a tablet tucked against his chest, expression pinched in concentration. When he realizes you have noticed, he stops pretending to reread the same paragraph.",
        "Ben is near the end of the queue, balancing a paper cup of coffee he clearly did not need but wanted anyway. Jordan is beside him, saying something under their breath that makes Ben fail not to smile.",
        "It is only the second morning and the place already has currents.",
        "Over the speaker, a calm voice announces, \"Baseline sequence two will begin in six minutes. Trainees, report in assigned order. Any uncontrolled manifestation must be reported immediately.\"",
        "Piper leans closer. \"See? Beautiful. Nothing says romance like institutionalized surveillance and the promise of a possible migraine.\"",
        "Somewhere behind the glass, something bright flares and vanishes. The entire line goes still for a heartbeat, everyone trying not to look interested at once. Aegis Point, apparently, has decided the correct follow-up to yesterday is to line all of you up and ask what you do when watched."
      ],
      "choices": [
        {
          "text": "Angle toward Piper and ask whether she always flirts this early or only when there are witnesses.",
          "effects": [
            {
              "type": "flag",
              "key": "add_c02_queue_glass_choice_1",
              "value": true
            },
            {
              "type": "stat",
              "key": "control",
              "delta": 1
            }
          ],
          "timeMinutes": 15,
          "next": "c02_baseline_intro"
        },
        {
          "text": "Step up beside Theo and ask what he already knows that the rest of the line doesn't.",
          "effects": [
            {
              "type": "flag",
              "key": "add_c02_queue_glass_choice_2",
              "value": true
            },
            {
              "type": "stat",
              "key": "restraint",
              "delta": 1
            }
          ],
          "timeMinutes": 15,
          "next": "c02_baseline_intro"
        },
        {
          "text": "Catch Julian's eye and make a dry comment about the gallery treating all of you like zoo animals with paperwork.",
          "effects": [
            {
              "type": "flag",
              "key": "add_c02_queue_glass_choice_3",
              "value": true
            },
            {
              "type": "stat",
              "key": "resolve",
              "delta": 1
            }
          ],
          "timeMinutes": 15,
          "next": "c02_baseline_intro"
        },
        {
          "text": "Wait your turn in silence and let Camille make the next move if she wants one.",
          "effects": [
            {
              "type": "flag",
              "key": "add_c02_queue_glass_choice_4",
              "value": true
            },
            {
              "type": "stat",
              "key": "audacity",
              "delta": 1
            }
          ],
          "timeMinutes": 15,
          "next": "c02_baseline_intro"
        }
      ]
    },
    "add_c02_after_baseline_reactivity": {
      "chapter": 2,
      "title": "After Baseline Reactivity",
      "location": "Observation Gallery Landing",
      "background": "sim",
      "focus": "Piper",
      "text": [
        "The landing outside the baseline room smells faintly of hot metal, sanitizer, and the particular sharpness that follows a crowded test bay. Your pulse has not fully decided that the exercise is over. Neither, judging by the collection of people waiting just outside the doors, has anyone else.",
        "Piper is there first because of course she is. She has found the railing, perched against it like the narrow drop on the other side is decorative, and she is grinning in the bright dangerous way she gets when something either went extremely right or just barely failed to go wrong.",
        "\"Well,\" she says as the door seals behind you. \"That was obnoxiously attractive.\"",
        "If yesterday put any kind of charge between you, she does not waste time pretending it vanished overnight. If it did not, the line still lands like she means to see what you do with it.",
        "Jordan, standing a little behind her, makes a sound that could be a laugh or the beginning of one. \"I said thirty seconds before somebody started talking about you like contraband,\" they say. \"Lane over here nearly beat the buzzer.\"",
        "Ben takes you in with one of those steady looks that somehow manages to check for injury and ask how you are doing without making it public. \"You all right?\"",
        "Across the landing, Rina is finishing her own argument with a tech about thermal thresholds, kinetic tolerance, or possibly the general concept of being told to slow down. She breaks off long enough to look you over like she is deciding whether your score was impressive or merely annoying.",
        "Julian arrives from the far side of the gallery with the ease of someone who prefers to appear at exactly the moment a scene becomes interesting. \"It is very rude,\" he says, \"to make a whole room hold its breath before breakfast.\"",
        "Theo is slower. He comes out of the observation annex with a tablet still in hand, thumb braced against the edge hard enough to show tension. \"The telemetry lagged,\" he says, which is either his version of praise or panic depending on how well you already know him. \"For a second the system thought you were overshooting. Then it corrected.\"",
        "Camille does not interrupt. She exits last, exchanges a low sentence with the nearest staffer, and only then looks at you. There is thought in it. Calculation. Also, if you know how to read for it yet, the faintest implication that whatever happened in there moved you from abstract category to active concern.",
        "It all lands at once: the attention, the opinions, the way Aegis turns a single controlled demonstration into social weather.",
        "Jordan tilts their head. \"So,\" they say, \"do you want the official response, the honest response, or the one people are already telling each other in the cafeteria?\"",
        "Piper taps two fingers against the railing. \"I vote honest. The official response has never kissed anyone in its life.\"",
        "\"Neither have some of the trainees here,\" Rina says without looking over.",
        "\"That was one time,\" Julian replies, scandalized, and then, because it clearly was not one time, he smiles.",
        "Ben finally extends the coffee cup he is holding. \"Take this before you fall over and give all of them a story they do not deserve.\"",
        "If yesterday taught anyone anything, it is already in the room with you now. The test did not just measure control. It redistributed gravity."
      ],
      "choices": [
        {
          "text": "Take Ben's coffee, thank him, and ask Jordan for the honest version.",
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
              "key": "add_c02_after_baseline_reactivity_choice_1",
              "value": true
            },
            {
              "type": "stat",
              "key": "control",
              "delta": 1
            }
          ],
          "timeMinutes": 15,
          "next": "c02_after"
        },
        {
          "text": "Tell Piper she can keep the honest version if she gives you hers first.",
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
              "key": "add_c02_after_baseline_reactivity_choice_2",
              "value": true
            },
            {
              "type": "stat",
              "key": "restraint",
              "delta": 1
            }
          ],
          "timeMinutes": 15,
          "next": "c02_after"
        },
        {
          "text": "Ask Theo what exactly the telemetry thought you were doing.",
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
              "key": "add_c02_after_baseline_reactivity_choice_3",
              "value": true
            },
            {
              "type": "stat",
              "key": "resolve",
              "delta": 1
            }
          ],
          "timeMinutes": 15,
          "next": "c02_after"
        },
        {
          "text": "Meet Camille's look and ask whether that performance made her job easier or worse.",
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
              "key": "add_c02_after_baseline_reactivity_choice_4",
              "value": true
            },
            {
              "type": "stat",
              "key": "audacity",
              "delta": 1
            }
          ],
          "timeMinutes": 15,
          "next": "c02_after"
        }
      ]
    },
    "add_c02_control_lab_fallout": {
      "chapter": 2,
      "title": "Control Lab Fallout",
      "location": "Control Lab Recovery Hall",
      "background": "aegis",
      "focus": "Ensemble",
      "text": [
        "The recovery hall outside the control lab has been furnished by people who believe discomfort builds character. The benches are too narrow, the walls too white, the water dispenser too slow. Someone has tried to soften the place with a potted plant near the far door and only succeeded in giving the room one more witness.",
        "By the time you get there, half the people who matter to your day are already occupying the space like pieces on a board that moved themselves into position. Piper is sitting on the back of a bench instead of the seat. Camille stands with her shoulder against the wall, arms folded, entirely too composed for someone who has clearly been thinking. Julian has somehow acquired two cups of tea from nowhere. Theo is pretending the clipboard in his lap is an objective reason not to keep looking at you. Ben is at the dispenser filling paper cones of water one after another like he expects the room to need them. Jordan hovers near the doorway, where they can leave quickly if the conversation gets stupid. Rina drifts in late enough to imply she almost didn't.",
        "It would be too much if the facility had not trained all of you to orbit the same stress points already.",
        "Julian is the first to speak. \"I would like the record to show,\" he says, extending one of the cups toward you, \"that none of us were emotionally prepared for the degree of tension this corridor has apparently decided to host.\"",
        "\"That sounds like a you problem,\" Piper says, but she is smiling.",
        "\"Darling, everything is a me problem if I am dramatic enough.\"",
        "You take the tea or don't. Sit or don't. Either way, the room registers the choice.",
        "If Chapter 1 and earlier in the day have already tilted you toward one or two of them, the shape of the scene shifts around that gravity. Piper gets brighter if you move toward her. Camille watches harder if you don't. Theo makes himself smaller unless invited in. Julian covers any awkwardness with style before it hardens. The important thing is that the game is no longer \"have they noticed you.\" It is \"what are they doing with what they've noticed.\"",
        "Ben hands a water cone toward Rina without comment. She takes it after a beat, which in this room practically counts as tenderness.",
        "Jordan tilts their head. \"Since we are all pretending this is a normal amount of social pressure for one hallway, does anyone want to say the thing they're actually thinking?\"",
        "\"No,\" Camille says.",
        "\"Yes,\" Piper says at the exact same time.",
        "Julian places one hand over his heart. \"See? Team cohesion.\"",
        "Theo closes his eyes briefly, then looks at you. \"The control-lab report is going to shape how command handles you for the next few weeks,\" he says. \"Probably longer.\"",
        "Rina snorts. \"As if they weren't already doing that.\"",
        "\"They were,\" Theo says. \"Now they'll feel justified.\"",
        "The room quiets. Even Piper loses a little of the performance energy at that.",
        "Camille finally uncrosses her arms. \"Then the useful question,\" she says, \"is what kind of story you want the room writing about you before command finishes theirs.\"",
        "It is not a lecture. It is an opening.",
        "The hall hums softly around all of you. Down the corridor, a tech wheels a cart past without looking in, either because they know better or because at Aegis Point this many emotionally loaded people in one place is barely top ten for the day.",
        "Piper slides off the bench back and lands beside it. \"My vote,\" she says, \"is for a story where you're interesting, sane enough to keep, and only slightly catastrophic.\"",
        "\"Only slightly?\" Julian says. \"How timid of you.\"",
        "Theo rubs his thumb over the clipboard edge. \"My vote,\" he says more quietly, \"is for a story where people don't confuse exceptional with expendable.\"",
        "That stills the room for a beat.",
        "Camille's gaze flicks to him, then back to you. \"Reasonable,\" she says.",
        "Jordan, because they cannot help themselves, adds, \"My vote is for a story where all of you become less obvious before someone outside this building starts collecting you like anecdotes.\"",
        "Ben finally sits, elbows on knees, looking at you with the same blunt steadiness he brought into med. \"My vote,\" he says, \"is that you eat something before this place turns another conversation into a medical event.\"",
        "It breaks the tension just enough to breathe.",
        "No one laughs very hard. That is how you know the scene matters.",
        "What you say next will not define the whole chapter. It will define what this group thinks it is allowed to be with you."
      ],
      "choices": [
        {
          "text": "Tell them you want a story where people stop deciding what you are before asking, then look directly at one person you mean it for.",
          "effects": [
            {
              "type": "flag",
              "key": "add_c02_control_lab_fallout_choice_1",
              "value": true
            },
            {
              "type": "stat",
              "key": "control",
              "delta": 1
            }
          ],
          "timeMinutes": 15,
          "next": "add_c02_residence_table_night"
        },
        {
          "text": "Say sane enough to keep sounds like a low bar and ask who in the room is claiming to meet it.",
          "effects": [
            {
              "type": "flag",
              "key": "add_c02_control_lab_fallout_choice_2",
              "value": true
            },
            {
              "type": "stat",
              "key": "restraint",
              "delta": 1
            }
          ],
          "timeMinutes": 15,
          "next": "add_c02_residence_table_night"
        },
        {
          "text": "Tell Theo his version is the only one that matters and ask if he'll help you keep it true.",
          "effects": [
            {
              "type": "flag",
              "key": "add_c02_control_lab_fallout_choice_3",
              "value": true
            },
            {
              "type": "stat",
              "key": "resolve",
              "delta": 1
            }
          ],
          "timeMinutes": 15,
          "next": "add_c02_residence_table_night"
        },
        {
          "text": "Ask Camille what story she thinks you're writing already and let everyone else hear the answer.",
          "effects": [
            {
              "type": "flag",
              "key": "add_c02_control_lab_fallout_choice_4",
              "value": true
            },
            {
              "type": "stat",
              "key": "audacity",
              "delta": 1
            }
          ],
          "timeMinutes": 15,
          "next": "add_c02_residence_table_night"
        }
      ]
    },
    "add_c02_residence_table_night": {
      "chapter": 2,
      "title": "Residence Table Night",
      "location": "Residence Kitchen / Common Table",
      "background": "aegis",
      "focus": "Ensemble",
      "text": [
        "Night changes the residence kitchen more than any official lighting mode ever could. During the day it is traffic: coffee, complaints, people cutting across the room with one shoe half on and a file open in the other hand. At night it becomes territory. The overhead lights are dimmed to something almost humane. The refrigerator hum is loud enough to count as atmosphere. Someone has left a deck of cards spread across the table and abandoned a bowl of instant noodles on the counter beside a note that only says DON'T.",
        "By the time you drift in, the core of the room has already formed.",
        "Piper is sitting sideways in one of the chairs, knees hooked over the arm, impossible in a way that makes the furniture seem at fault. Julian has claimed the end of the table nearest the weak yellow lamp, where his face gets to have shadows. Theo is at the opposite side with a mug wrapped in both hands, looking like he did not mean to stay this long and then accidentally did. Camille arrives a minute later with a glass of water and the air of someone who would deny wanting company if asked directly. Ben is by the stove making grilled cheese for more people than he claims to have intended. Jordan wanders in and out with update fragments from the wider residence hall like a very selective news service. Rina passes through only long enough to steal half a sandwich and say something cutting enough to count as affection in her dialect.",
        "It is not a family. It is barely a cohort. It is something more interesting: the beginning of a room that may matter later.",
        "The conversation moves in layers. Jordan reports that one of the second-years has already decided your baseline was either staged or prophetic. Julian declares both options aesthetically unsound. Piper asks what your prophetic baseline would even predict and immediately answers herself with, \"Property damage and very confusing kissing.\" Ben nearly chokes on his own laugh.",
        "If you gave Piper room earlier, she uses it now. Not greedily. Confidently. She tosses you remarks like she expects you to catch them and is visibly pleased when you do.",
        "If you and Camille found a line together in the stairwell, it shows here not in overt attention but in a shift of gravity. She does not need to sit next to you to make the room aware she has an opinion.",
        "If Julian got something true from you in the lounge, he is lighter now, the performance no less polished but less defensive at the edges. He includes you differently. Theo does too, though his version is quieter. He asks one precise question halfway through the conversation that proves he has been tracking not just your power but your mood.",
        "Ben keeps feeding people. Jordan keeps noticing what everyone avoids saying. Even the room itself starts to feel complicit, warm from the stove and crowded enough that no one has to work too hard to justify staying.",
        "At some point Piper steals a piece of cheese directly off Ben's spatula and survives only because he is too fond of her to commit the homicide he briefly considers. Julian tells a story about a trainee from three years ago who tried to fake mystery by refusing to answer basic questions about his power and accidentally convinced half the campus he transformed into birds. Camille, incredibly, contributes a dry one-liner sharp enough to make Jordan put a hand to their chest in mock injury. Theo laughs into his mug and looks startled by the fact of it.",
        "That may be the truest thing in the room all night.",
        "Later, when the conversation thins and the hours make everyone a little more honest, the table splits into smaller currents. Ben starts on the dishes. Jordan peels off to follow one last rumor down the hall. Rina vanishes. What remains is the core four around you and the shape their attention makes.",
        "Piper asks what you were like before all this, and for once the question lands without sounding like small talk. Julian wants the version that would embarrass you least gracefully. Theo wants the real answer. Camille says nothing, which in its own way means she wants one too.",
        "You can feel the chapter narrowing toward what matters: not whether these people noticed you, but what kind of place you are making in one another's heads.",
        "Outside the kitchen windows, the facility has gone dark in patches, whole wings sleeping uneasily between drills and evaluations. Inside, the table has become a border crossing between institutional time and something human enough to remember.",
        "When the hour finally breaks, chairs scrape back. Mugs empty. Piper lingers longest without admitting it. Camille leaves with a look that promises this conversation is not over, only paused. Julian touches two fingers to the table in your direction like a private salute. Theo is the last to say goodnight, and somehow that matters.",
        "The kitchen returns to being a kitchen after they leave. The air does not."
      ],
      "choices": [
        {
          "text": "Answer Piper first and let the rest of the room hear the version of you that still feels unfinished.",
          "effects": [
            {
              "type": "flag",
              "key": "add_c02_residence_table_night_choice_1",
              "value": true
            },
            {
              "type": "stat",
              "key": "control",
              "delta": 1
            }
          ],
          "timeMinutes": 15,
          "next": "c02_residence_after"
        },
        {
          "text": "Give Julian the embarrassing story he asked for, then tell Theo the part of it that's actually true.",
          "effects": [
            {
              "type": "flag",
              "key": "add_c02_residence_table_night_choice_2",
              "value": true
            },
            {
              "type": "stat",
              "key": "restraint",
              "delta": 1
            }
          ],
          "timeMinutes": 15,
          "next": "c02_residence_after"
        },
        {
          "text": "Look to Camille and answer as if the question that matters is what you do with being watched.",
          "effects": [
            {
              "type": "flag",
              "key": "add_c02_residence_table_night_choice_3",
              "value": true
            },
            {
              "type": "stat",
              "key": "resolve",
              "delta": 1
            }
          ],
          "timeMinutes": 15,
          "next": "c02_residence_after"
        },
        {
          "text": "Deflect the whole thing with humor, then stay behind with whoever doesn't leave first.",
          "effects": [
            {
              "type": "flag",
              "key": "add_c02_residence_table_night_choice_4",
              "value": true
            },
            {
              "type": "stat",
              "key": "audacity",
              "delta": 1
            }
          ],
          "timeMinutes": 15,
          "next": "c02_residence_after"
        },
        {
          "text": "add_c02_queue_glass should reference yesterday's strongest Chapter 1 impression flags where available:",
          "effects": [
            {
              "type": "flag",
              "key": "add_c02_residence_table_night_choice_5",
              "value": true
            },
            {
              "type": "stat",
              "key": "control",
              "delta": 1
            }
          ],
          "timeMinutes": 15,
          "next": "c02_residence_after"
        },
        {
          "text": "add_c02_after_baseline_reactivity expands c02_after and should preserve any baseline-result-specific lines from the live file.",
          "effects": [
            {
              "type": "flag",
              "key": "add_c02_residence_table_night_choice_6",
              "value": true
            },
            {
              "type": "stat",
              "key": "restraint",
              "delta": 1
            }
          ],
          "timeMinutes": 15,
          "next": "c02_residence_after"
        },
        {
          "text": "add_c02_piper_track, add_c02_julian_lounge, add_c02_theo_annex, and add_c02_camille_stairs are the main private Chapter 2 continuity scenes. Each should return to the appropriate c02_hub_return_* scene.",
          "effects": [
            {
              "type": "flag",
              "key": "add_c02_residence_table_night_choice_7",
              "value": true
            },
            {
              "type": "stat",
              "key": "resolve",
              "delta": 1
            }
          ],
          "timeMinutes": 15,
          "next": "c02_residence_after"
        },
        {
          "text": "add_c02_med_assessment is optional unless instability/recovery flags trigger it automatically.",
          "effects": [
            {
              "type": "flag",
              "key": "add_c02_residence_table_night_choice_8",
              "value": true
            },
            {
              "type": "stat",
              "key": "audacity",
              "delta": 1
            }
          ],
          "timeMinutes": 15,
          "next": "c02_residence_after"
        },
        {
          "text": "add_c02_control_lab_fallout is the mandatory ensemble pulse scene for the back half of the chapter.",
          "effects": [
            {
              "type": "flag",
              "key": "add_c02_residence_table_night_choice_9",
              "value": true
            },
            {
              "type": "stat",
              "key": "control",
              "delta": 1
            }
          ],
          "timeMinutes": 15,
          "next": "c02_residence_after"
        },
        {
          "text": "add_c02_residence_table_night is the emotional close and should feed into or expand c02_residence_after.",
          "effects": [
            {
              "type": "flag",
              "key": "add_c02_residence_table_night_choice_10",
              "value": true
            },
            {
              "type": "stat",
              "key": "restraint",
              "delta": 1
            }
          ],
          "timeMinutes": 15,
          "next": "c02_residence_after"
        },
        {
          "text": "Do not let Chapter 2 private scenes ignore Chapter 1 chemistry or friction.",
          "effects": [
            {
              "type": "flag",
              "key": "add_c02_residence_table_night_choice_11",
              "value": true
            },
            {
              "type": "stat",
              "key": "resolve",
              "delta": 1
            }
          ],
          "timeMinutes": 15,
          "next": "c02_residence_after"
        },
        {
          "text": "Do not let support scenes outweigh the core four.",
          "effects": [
            {
              "type": "flag",
              "key": "add_c02_residence_table_night_choice_12",
              "value": true
            },
            {
              "type": "stat",
              "key": "audacity",
              "delta": 1
            }
          ],
          "timeMinutes": 15,
          "next": "c02_residence_after"
        },
        {
          "text": "Keep Vance, Rina, Ben, and Jordan meaningful but secondary.",
          "effects": [
            {
              "type": "flag",
              "key": "add_c02_residence_table_night_choice_13",
              "value": true
            },
            {
              "type": "stat",
              "key": "control",
              "delta": 1
            }
          ],
          "timeMinutes": 15,
          "next": "c02_residence_after"
        },
        {
          "text": "Make sure med continuity from Chapter 1 survives into Chapter 2 when applicable.",
          "effects": [
            {
              "type": "flag",
              "key": "add_c02_residence_table_night_choice_14",
              "value": true
            },
            {
              "type": "stat",
              "key": "restraint",
              "delta": 1
            }
          ],
          "timeMinutes": 15,
          "next": "c02_residence_after"
        },
        {
          "text": "Preserve Chapter 2 as a testing-and-sorting chapter, not a premature climax.",
          "effects": [
            {
              "type": "flag",
              "key": "add_c02_residence_table_night_choice_15",
              "value": true
            },
            {
              "type": "stat",
              "key": "resolve",
              "delta": 1
            }
          ],
          "timeMinutes": 15,
          "next": "c02_residence_after"
        }
      ]
    },
    "add_c03_admin_notice_board": {
      "chapter": 3,
      "title": "Admin Notice Board",
      "location": "Administrative Corridor",
      "background": "aegis",
      "focus": "Seth",
      "text": [
        "The administrative corridor outside resident review feels less like part of a school and more like the inside of a machine. The walls are soft gray, the floor polished to a waxed kind of indifference, the lighting bright enough to make everyone look a little more honest than they want to. At one end, a glass board cycles through schedules, assignment postings, medical reminders, and short antiseptic phrases about stabilization goals. At the other end, a pair of closed doors lead to the offices where staff turn yesterday into language that can follow you for years.",
        "Your name is on the board.",
        "Not publicly, exactly. A resident queue, an assignment tag, a review marker, and a little amber icon next to your baseline slot that means the building wants another look. It should be routine. Around here, routine is just danger that got a filing cabinet.",
        "People notice before they pretend not to. That is the first unwritten rule of Aegis Point: everyone minds their own business right after checking whether your business might become theirs.",
        "Jordan is leaning against the wall beside the board, coffee in hand, reading reactions more than text. They catch you clocking the icon and lift one shoulder. \"If it helps, amber is better than the red one.\"",
        "\"Deeply reassuring.\"",
        "\"It was meant to be.\"",
        "Ben is a few feet away, tying the wrist wrap on one hand with his teeth because his other arm is full of folded towels from the training wing. He glances at the board, then at you, then very deliberately at neither. It is the kindest thing anybody has done in the corridor all morning.",
        "Two residents you barely know go quiet when you step closer. One of them has the courtesy to look embarrassed about it. The other just looks curious. A staffer in navy passes through, taps the queue list on their tablet, and says your room number out loud to no one in particular, as if that counts as privacy because they did not also say your pulse rate.",
        "Across from the board, behind a pane of observation glass that turns reflections ghostly, Camille is speaking to a review tech. Even from here she looks composed enough to insult the concept of nerves. Julian is half turned toward her, apparently listening and absolutely eavesdropping. Theo stands with a tablet against his chest, brow knit so hard it almost counts as a frown. Piper is nowhere visible, which somehow makes the whole corridor feel slower.",
        "The board shifts. Your assignment changes from BASELINE SEQUENCE TWO to REVIEW GALLERY / SIM BLOCK C. Under it: REPORT TO OBSERVATION HALL. Under that: CANDIDATE PERFORMANCE TO BE DISCUSSED WITH SENIOR RESIDENTS.",
        "Discussed. Like weather. Like budget. Like whether anybody trusts you near expensive glass.",
        "Jordan watches your face. \"The fun thing,\" they say softly, \"is that there are three ways for people here to say you're interesting. One means they want to know you. One means they want to use you. One means they want seats when you explode.\"",
        "\"Which one is this?\"",
        "They tip their cup toward the amber icon. \"That depends on how you walk into the room.\"",
        "Ben finally gets the wrap set and offers the towels with the hand that is free, a tiny practical gesture with no real purpose except to interrupt the corridor's appetite. \"Ignore the board,\" he says. \"Or don't. Just don't let it decide your posture for you.\"",
        "That would be easier if the building did not feel like it was already drafting an opinion.",
        "Through the glass, Camille looks up. Not at the board. At you. Julian follows her glance and smiles like he enjoys being present for social weather. Theo notices a beat later and looks away too late to claim he was not looking. Whatever happened in the first two chapters, it lives in that sequence more clearly than anything on the board.",
        "Aegis does not need to announce that you are under review. It just has to put your name in the right hallway and let everyone else do the rest."
      ],
      "choices": [
        {
          "text": "Read the board long enough to make it obvious you are not afraid of what Aegis calls you.",
          "effects": [
            {
              "type": "flag",
              "key": "add_c03_admin_notice_board_choice_1",
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
          "text": "Ask Jordan which version of 'interesting' people have settled on so far.",
          "effects": [
            {
              "type": "flag",
              "key": "add_c03_admin_notice_board_choice_2",
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
          "text": "Take the towels from Ben and make a dry joke about being discussed like a zoning issue.",
          "effects": [
            {
              "type": "flag",
              "key": "add_c03_admin_notice_board_choice_3",
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
          "text": "Leave the board where it is and head for the observation hall before the corridor gets to enjoy you any longer.",
          "effects": [
            {
              "type": "flag",
              "key": "add_c03_admin_notice_board_choice_4",
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
    "add_c03_residence_kitchen_after_reports": {
      "chapter": 3,
      "title": "Residence Kitchen After Reports",
      "location": "Residence Kitchen",
      "background": "aegis",
      "focus": "Ensemble",
      "text": [
        "By night, the residence kitchen stops pretending to belong to the institution and starts pretending to belong to whoever got there first. The overhead lights are warmer than the rest of the wing. The refrigerator hums like a passive-aggressive witness. Somebody has left an unlabeled container on the top shelf that no one brave or stupid enough has claimed. The long table in the middle of the room has become the unofficial end point for people too wired to sleep and too tired to perform.",
        "Tonight, most of the important orbit ends up here.",
        "Ben is making toast with the seriousness of a man rebuilding civilization from carbohydrates. Jordan is on the counter swinging one boot against the cabinet doors in tiny taps, cataloguing everybody with the ease of a person who can tell when a room wants to become confession. Julian has stolen one of the good mugs from somewhere mysterious. Theo is sitting with his tablet facedown for once, which is somehow more intimate than if he had started speaking first. Camille arrives last, still in training black, carrying a folder she finally leaves on the edge of the table instead of in her hands. Piper appears two seconds after her with no food and every opinion.",
        "\"Look at us,\" Julian says. \"A support group for the administratively over-observed.\"",
        "\"We're not a support group,\" Piper says, dropping into the chair beside you or across from you depending on prior gravity. \"We're a complaint department with powers.\"",
        "Jordan lifts their mug. \"Accurate.\"",
        "What makes the scene work is that nobody here is pretending the chapter did not happen. The room remembers. If you sparked with somebody earlier, the table knows it without needing to discuss it. If there was friction, that too. If you landed badly in the gallery or surprisingly well in Vance's office or unusually hard in the med bay, people don't recap it. They fold around it.",
        "Ben sets the toast down. \"If anyone starts ranking the cohort by likelihood of becoming a classified incident,\" he says, \"I'm leaving.\"",
        "\"Then stay,\" Piper says. \"Because you know Jordan already has a spreadsheet.\"",
        "Jordan puts a hand to their chest. \"Spreadsheet is such a cruel word. I prefer dynamic social archive.\"",
        "Theo rubs at his forehead. \"That is somehow worse.\"",
        "Camille takes the empty seat nearest the end of the table, posture exact even here. \"If anyone is doing rankings, keep me out of it,\" she says.",
        "Julian turns to you. \"Terrible news. She's lying. Being ranked is one of her most natural habitats.\"",
        "Camille looks at him over the rim of the glass she has finally allowed herself. \"And yet somehow I survive your commentary.\"",
        "\"Barely. Heroically.\"",
        "Piper bumps your knee under the table if she's close enough. Or maybe your ankle. Or maybe nothing touches and the possibility is doing all the work. \"So,\" she says, eyes on you, \"what's the official verdict? Are you acclimating beautifully or becoming everyone's favorite committee fight?\"",
        "Jordan answers before you can. \"Both.\"",
        "\"Shocking,\" Julian says.",
        "If you choose honesty here, the scene can tilt intimate. If you choose wit, it stays bright. If you choose distance, the room registers it. This is one of those ensemble scenes where later route outcomes start being seeded not by giant declarations but by where you spend your sincerity.",
        "Theo asks whether the med follow-up changed anything. Not casually; carefully. Ben asks if you're eating enough. Julian wants to know whether the gallery made you want to overthrow hierarchy or date it. Piper says both is allowed. Camille, after a pause long enough to mean something, says some forms of hierarchy are simply people mistaking attention for merit. Then she looks at you in a way that makes it impossible to miss that the sentence is both general principle and specific test.",
        "You answer. Maybe to one of them. Maybe to all.",
        "Jordan slides off the counter and opens the fridge. \"The thing I enjoy most,\" they say, \"is that three weeks from now half this table will claim they saw all of this coming.\"",
        "\"Which half?\" Ben asks.",
        "\"The dishonest half.\"",
        "\"That doesn't narrow it much,\" Julian says.",
        "Even Camille laughs at that, very quietly. Theo notices and looks offended on principle. Piper notices Theo noticing and grins like she's been handed free entertainment.",
        "The kitchen goes loose for a minute after that. Safer. Not safe exactly. But human in a way the rest of the building keeps trying to professionalize out of you.",
        "Then the chapter turns one click more serious, because of course it does. Vance sends the next-day schedule to everyone's phones at the same time. The collective vibration on the table sounds absurdly like fate trying too hard.",
        "Piper checks hers and groans. Theo reads his and straightens. Julian glances once and says, \"Rude.\" Ben mutters something about mornings being fascist. Jordan cackles. Camille doesn't react outwardly at all, which is its own reaction.",
        "You read yours last.",
        "Tomorrow is a deeper room. More pressure. Less innocence. Aegis has decided whatever you were on arrival is no longer enough.",
        "The kitchen feels different after that. Still warm. Still inhabited. But narrower around the edges, as if the building has reached into the room to remind everyone that comfort here is a temporary weather pattern.",
        "Ben breaks it first by pushing the plate of toast closer to the center. \"Eat something,\" he says to the table at large. \"No one becomes more strategic on an empty stomach.\"",
        "\"That's not true,\" Julian says. \"Some of us become legendary.\"",
        "\"You become impossible.\"",
        "\"I contain multitudes.\"",
        "Piper looks at you then, not joking for one full second. \"See?\" she says softly. \"Long memories.\"",
        "Camille's gaze finds you a moment later, unreadable and not unreadable. Theo's does too, quieter but somehow harder to miss. Julian lifts his mug in a little salute that could mean good luck or do not get boring. Around them, the kitchen keeps being a kitchen-hum, glass, toast, late-hour shadows, bad jokes, the dull comfort of other people still being awake.",
        "This is how Chapter 3 should end: not with certainty, but with gravity. People mattering enough that tomorrow's rooms will feel different because they are in them."
      ],
      "choices": [
        {
          "text": "Answer the table honestly and let the room see that today's scrutiny actually got under your skin.",
          "effects": [
            {
              "type": "flag",
              "key": "add_c03_residence_kitchen_after_reports_choice_1",
              "value": true
            },
            {
              "type": "stat",
              "key": "control",
              "delta": 1
            }
          ],
          "timeMinutes": 15,
          "next": "c04_hub_training"
        },
        {
          "text": "Keep it light, trade jokes with Julian and Piper, and refuse to let the schedule own the mood.",
          "effects": [
            {
              "type": "flag",
              "key": "add_c03_residence_kitchen_after_reports_choice_2",
              "value": true
            },
            {
              "type": "stat",
              "key": "restraint",
              "delta": 1
            }
          ],
          "timeMinutes": 15,
          "next": "c04_hub_training"
        },
        {
          "text": "Turn to Theo with the real answer first and see who notices.",
          "effects": [
            {
              "type": "flag",
              "key": "add_c03_residence_kitchen_after_reports_choice_3",
              "value": true
            },
            {
              "type": "stat",
              "key": "resolve",
              "delta": 1
            }
          ],
          "timeMinutes": 15,
          "next": "c04_hub_training"
        },
        {
          "text": "Meet Camille's look across the table and say you'll decide tomorrow what kind of room it becomes.",
          "effects": [
            {
              "type": "flag",
              "key": "add_c03_residence_kitchen_after_reports_choice_4",
              "value": true
            },
            {
              "type": "stat",
              "key": "audacity",
              "delta": 1
            }
          ],
          "timeMinutes": 15,
          "next": "c04_hub_training"
        }
      ]
    },
    "add_c04_anchor_afterhours": {
      "chapter": 4,
      "title": "Anchor Afterhours",
      "location": "The Rusty Anchor",
      "background": "city",
      "focus": "Piper",
      "text": [
        "The Rusty Anchor is full in the way only a place near an Aegis campus can be full: not crowded exactly, but occupied by too many people pretending they are off the clock while still carrying themselves like something might explode if they relax their shoulders. The wood is weathered, the windows are streaked with salt and old rain, and the air smells like fried food, beer, and the electric-static scent of people who spent the day being measured. Somebody has put a game on the television over the bar with the sound off. Nobody is really watching it. Everyone is watching everyone else instead.",
        "Piper hooks one boot on the rung of her chair and leans in over the scarred table like tomorrow's training block is the kind of problem best solved by bad decisions and confidence. Jordan has somehow acquired fries that look too good for a waterfront bar. Ben sits half-turned toward the room the way people do when they are used to tracking exits without making a religion of it. If the last few days pushed you into the center of enough attention to be annoying, the residue is still on you here. Conversations nearby lower a little when your name drifts close. Not enough to become polite. Just enough to become careful.",
        "Piper catches you noticing and grins with exactly the amount of teeth that means she noticed first. \"Congratulations,\" she says. \"You are officially not background furniture anymore.\"",
        "Jordan points a fry at you. \"That stopped being true the moment administrative language started breeding around your existence.\"",
        "Ben snorts. \"That's the least comforting way to say somebody is doing well I have ever heard.\"",
        "\"Doing well is not the same thing as becoming a campus topic,\" Jordan says. \"Ask literally anyone who ever got good enough to require three meetings.\"",
        "Piper waves that off and turns back to you. \"Tomorrow Camille is going to take all the instincts you think are charming and attempt to file them into sharp little safety folders. So. What's the actual plan?\"",
        "The question sounds joking on the surface and less so underneath. That is becoming a theme with her. It is becoming a theme with all of them, maybe. Nobody asks simple questions here once they have seen you dangerous, tired, watched, and still trying to decide what kind of person to be in front of witnesses.",
        "If Chapter 3 ended with more people staring at you through glass than talking to you like a person, this table feels like relief with teeth. If it ended with sparks, or friction, or the strange sensation of being read more accurately than you intended, that is here too. Piper's attention is quicksilver-bright. Jordan's is clinical in a way that somehow still feels kind. Ben keeps glancing at you like he is checking whether you are actually resting between rounds or just acting like a person who rests.",
        "Piper taps the table once. \"You don't get to say 'wing it.' That's not a plan. That's what people call panic when it succeeds.\"",
        "Jordan nods solemnly. \"Correct. We banned the phrase after your second week.\"",
        "\"Lies,\" Piper says.",
        "\"Only spiritually,\" Jordan says.",
        "Ben looks at you instead of either of them. \"She's joking because she wants to know whether tomorrow is going to scare you enough to make you stupid. Different thing.\"",
        "For a second the room gets quieter in the way good rooms do when somebody says the real sentence plainly. Piper does not flinch from it. If anything, something in her face settles. This is what liking her starts to feel like, maybe. Not just speed and charm and the warm pressure of her orbit. The fact that she is easier to trust the second the performance drops and she lets the actual question stand there.",
        "Across the room, two upper-level residents are arguing quietly about containment protocols like divorced parents discussing a cursed dog. A server threads between tables with a tray balanced too expertly to be accidental. Somewhere near the back, somebody laughs too hard and gets shushed by a friend who still believes volume is what attracts trouble.",
        "Piper's eyes stay on you. \"So? Tomorrow. What kind of dangerous are you trying to be?\""
      ],
      "choices": [
        {
          "text": "Controlled enough that Camille doesn't get to enjoy correcting me.",
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
              "key": "add_c04_anchor_afterhours_choice_1",
              "value": true
            },
            {
              "type": "stat",
              "key": "control",
              "delta": 1
            }
          ],
          "timeMinutes": 15,
          "next": "c04_hub_training"
        },
        {
          "text": "Useful first. Impressive only if useful isn't enough.",
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
              "key": "add_c04_anchor_afterhours_choice_2",
              "value": true
            },
            {
              "type": "stat",
              "key": "restraint",
              "delta": 1
            }
          ],
          "timeMinutes": 15,
          "next": "c04_hub_training"
        },
        {
          "text": "Honestly? Depends what part of me gets there first.",
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
              "key": "add_c04_anchor_afterhours_choice_3",
              "value": true
            },
            {
              "type": "stat",
              "key": "resolve",
              "delta": 1
            }
          ],
          "timeMinutes": 15,
          "next": "c04_hub_training"
        },
        {
          "text": "Maybe I am done apologizing for looking dangerous in rooms built to test me.",
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
              "key": "add_c04_anchor_afterhours_choice_4",
              "value": true
            },
            {
              "type": "stat",
              "key": "audacity",
              "delta": 1
            }
          ],
          "timeMinutes": 15,
          "next": "c04_hub_training"
        }
      ]
    },
    "add_c04_debrief_crosscurrents": {
      "chapter": 4,
      "title": "Debrief Crosscurrents",
      "location": "Observation Gallery Debrief",
      "background": "sim",
      "focus": "Ensemble",
      "text": [
        "By the time the formal debrief finishes, the room has that strange hollow feeling training spaces get after something intense but controlled. The glass still reflects all of you faintly. The target projections are gone. The chamber below is back to white light and bare surfaces, as if it had not just spent an hour trying to reduce your instincts to evidence.",
        "Camille stands with her tablet down at her side now, which is as close to relaxed as she ever gets while still vertical. Piper has claimed the doorway on principle. Julian is perched against the wall beside the vending machine, sugar-coffee gone and somehow replaced by another one. Theo remains exactly where people leave themselves when they want to keep listening without becoming part of the furniture. The whole group looks more familiar than it should after only a few chapters. Pressure accelerates weird things.",
        "What lingers in the room is not the simple question of whether you succeeded. You did, in some sense. Or you failed interestingly enough to count as educational, which Aegis treats as a cousin of success whenever paperwork can tolerate it. What lingers is the fact that everyone in here saw a version of you with less distance between thought and action than usual.",
        "Piper breaks first. \"I am just saying,\" she announces, \"that if the official training metric is control under insult, Camille should not be allowed to enjoy herself that much.\"",
        "Camille does not look at her. \"I enjoy precision,\" she says.",
        "\"Mm,\" Piper says. \"And murder, academically.\"",
        "Julian lifts two fingers. \"To be fair, you also enjoy murder recreationally when provoked.\"",
        "\"Incorrect,\" Camille says. \"Only aesthetically.\"",
        "That almost gets a laugh out of Theo, which means the day has gone farther than any of you admit.",
        "Then the room tips from humor into something more useful. Not solemn. Just honest. Comments begin landing not like a pile-on, but like people setting their individual reads of you on the same table and waiting to see which ones survive contact.",
        "Piper wants to talk about speed of decision and whether hesitation looked like fear or recalculation. Camille wants to talk about repeatability and whether instinct without structure can ever be trusted by people standing nearby. Theo wants to talk about risk drift-small allowances turning into patterns. Julian, true to form, wants to talk about perception: what the room saw, what you meant, and how often those are quietly at war with each other.",
        "That is the shape of the real pressure now. Not just what you can do. How four different kinds of intelligence interpret what you do, and which of them you are foolish enough to ignore.",
        "If you came into Chapter 4 already carrying sparks or bruises with any of them, the discussion sharpens around those lines. Piper pushes faster where there is chemistry, as if daring both of you to admit you are already orbiting on purpose. Camille becomes cleaner and more exact the more she has something personal to hide. Julian gets more dangerous when he is being kind because he notices exactly where to place the sentence. Theo's honesty becomes warmer or harsher depending on whether you have given him reasons to believe he is heard.",
        "Nobody says any of that outright. Adults rarely do, not if they can help it. Instead they ask what you intended, what you learned, and what you plan to keep the next time the chamber offers you less time to be noble."
      ],
      "choices": [
        {
          "text": "Say it cleanly, all of you. I'd rather hear the real version than the polite one.",
          "effects": [
            {
              "type": "flag",
              "key": "add_c04_debrief_crosscurrents_choice_1",
              "value": true
            },
            {
              "type": "stat",
              "key": "control",
              "delta": 1
            }
          ],
          "timeMinutes": 15,
          "next": "add_c04_kitchen_after_closing"
        },
        {
          "text": "I learned that instinct is expensive if I make everyone else pay for it too.",
          "effects": [
            {
              "type": "flag",
              "key": "add_c04_debrief_crosscurrents_choice_2",
              "value": true
            },
            {
              "type": "stat",
              "key": "restraint",
              "delta": 1
            }
          ],
          "timeMinutes": 15,
          "next": "add_c04_kitchen_after_closing"
        },
        {
          "text": "I learned I like hearing you all argue about me more than I probably should.",
          "effects": [
            {
              "type": "flag",
              "key": "add_c04_debrief_crosscurrents_choice_3",
              "value": true
            },
            {
              "type": "stat",
              "key": "resolve",
              "delta": 1
            }
          ],
          "timeMinutes": 15,
          "next": "add_c04_kitchen_after_closing"
        },
        {
          "text": "I learned I still decide faster when somebody matters to me.",
          "effects": [
            {
              "type": "flag",
              "key": "add_c04_debrief_crosscurrents_choice_4",
              "value": true
            },
            {
              "type": "stat",
              "key": "audacity",
              "delta": 1
            }
          ],
          "timeMinutes": 15,
          "next": "add_c04_kitchen_after_closing"
        }
      ]
    },
    "add_c04_kitchen_after_closing": {
      "chapter": 4,
      "title": "Kitchen After Closing",
      "location": "Residence Kitchen",
      "background": "aegis",
      "focus": "Ensemble",
      "text": [
        "The residence kitchen after official quiet hours is one of the few places on campus where fatigue consistently wins over presentation. The overheads are dimmed to night mode. One stove light is still on over a pan somebody abandoned to soak. The refrigerator hums with the confidence of an appliance that has seen adults with powers make worse midnight decisions than leftovers. A hand-lettered note on the counter says LABEL YOUR SHIT and underneath it someone has written or ascend beyond ownership.",
        "It would be funny in any other building. Here it feels like philosophy.",
        "By the time you drift in, the chapter has already started gathering itself into aftermath. Piper is perched on the counter with a mug she insists contains tea and everyone else insists contains reckless amounts of sugar. Julian is leaning against the fridge in rolled sleeves like a man who could turn making toast into a social event. Theo is at the table with his knees angled out and a spoon in one hand, looking like he sat down for thirty seconds and accidentally committed to existing there for an hour. Camille stands at the sink rinsing out a glass with the exact same focus she uses on tactical notes, which is somehow both absurd and compelling.",
        "This is the version of the group that only exists once enough pressure has happened for everyone to get a little careless with composure. Piper talks faster when she is tired. Julian gets quieter before he gets theatrical again. Theo stops pretending all his useful thoughts are purely professional. Camille, somehow, becomes easier to read in profile than face-on.",
        "The conversation starts on training because of course it does. It starts there and then does the thing all real conversations do, sliding into what training actually means without admitting that's where it is headed. Ben passes through halfway with a towel over one shoulder and steals fruit from the bowl on the counter like a man who knows this room belongs equally to anyone upright enough to reach it. Jordan appears in the doorway long enough to contribute one terrifyingly accurate sentence about who in the cohort is already rewriting today's sim into tomorrow's gossip, then vanishes again before anyone can assign them emotional labor.",
        "No one is trying to impress anyone now. That may be the most dangerous condition of all.",
        "Camille sets the rinsed glass upside down by the sink. \"If today did anything useful,\" she says, \"it clarified that instinct is not your problem. Translation is.\"",
        "Julian smiles faintly. \"God, that's intimate of you.\"",
        "Piper points at him with the mug. \"See? This is why people keep wanting to date our problems.\"",
        "Theo very nearly chokes on nothing. Camille closes her eyes for half a second in a way that suggests she is either praying for patience or measuring homicide in teaspoons. You cannot tell which. Julian, the bastard, looks delighted.",
        "What saves the room from tipping into pure chaos is that underneath the jokes there is now something sturdy enough to hold weight. People here have seen each other under glass, in med, in anger, in embarrassment, in the quiet minutes after all of that. They have started building versions of one another that might actually survive contact with the next bad day.",
        "That is what Chapter 4 should leave behind. Not certainty. Density.",
        "If you have tilted hard toward one person already, the room registers it. Not with giant dramatic jealousy. With smaller, sharper things. The extra second before someone answers. The joke aimed half an inch more carefully. The way one person asks a direct question and another decides not to. If you have kept everyone on equal uncertain footing, the room reads that too. Adults are not less observant than teenagers about emotional gravity. They are just usually better at pretending observation counts as manners.",
        "Julian folds his arms. \"Well? Since we are all apparently trapped in a found-family pressure cooker with terrible institutional branding, what did today actually teach you?\"",
        "The question lands in the kitchen differently than it did in the gallery. Here it is less about evaluation and more about claim. About what version of the day you choose to carry forward into the night.",
        "Camille finally turns from the sink and rests one hip against the counter. Piper goes still in that quick alert way she has when something is about to matter. Theo looks down at his spoon and then back up, like even he knows the room has reached one of those small hinge moments people will pretend not to remember later. Julian, curse him, looks almost fond. Not entertained. Fond. It changes the temperature of the kitchen more than any joke has a right to.",
        "That is what is different now from Chapter 1. Nobody here is just a first impression anymore. Everybody in the room has survived enough of one another to start becoming real, and reality is harder to keep tidy than chemistry."
      ],
      "choices": [
        {
          "text": "That being trusted is heavier than being watched, and I am starting to feel the difference.",
          "effects": [
            {
              "type": "flag",
              "key": "add_c04_kitchen_after_closing_choice_1",
              "value": true
            },
            {
              "type": "stat",
              "key": "control",
              "delta": 1
            }
          ],
          "timeMinutes": 15,
          "next": "add_c05_promenade_release_window"
        },
        {
          "text": "That all of you are becoming impossible to ignore, which feels strategically terrible.",
          "effects": [
            {
              "type": "flag",
              "key": "add_c04_kitchen_after_closing_choice_2",
              "value": true
            },
            {
              "type": "stat",
              "key": "restraint",
              "delta": 1
            }
          ],
          "timeMinutes": 15,
          "next": "add_c05_promenade_release_window"
        },
        {
          "text": "That I am better than I was, and more dangerous too. I don't know yet if those are the same sentence.",
          "effects": [
            {
              "type": "flag",
              "key": "add_c04_kitchen_after_closing_choice_3",
              "value": true
            },
            {
              "type": "stat",
              "key": "resolve",
              "delta": 1
            }
          ],
          "timeMinutes": 15,
          "next": "add_c05_promenade_release_window"
        },
        {
          "text": "That this place gets less unbearable when the right people are in the room.",
          "effects": [
            {
              "type": "flag",
              "key": "add_c04_kitchen_after_closing_choice_4",
              "value": true
            },
            {
              "type": "stat",
              "key": "audacity",
              "delta": 1
            }
          ],
          "timeMinutes": 15,
          "next": "add_c05_promenade_release_window"
        }
      ]
    },
    "add_c05_promenade_release_window": {
      "chapter": 5,
      "title": "Promenade Release Window",
      "location": "Blackwater Promenade",
      "background": "city",
      "focus": "Ensemble",
      "text": [
        "Blackwater Promenade sells ordinary life with an almost insulting amount of confidence. Food carts hiss in the salt air. Couples argue over where to eat. A busker under the string lights is doing something earnest to a guitar that deserves better tuning and somehow winning people over anyway. Aegis let you off campus for this block, but it did not give you back anonymity with the privilege. You feel watched in a different register here: less like a file under glass, more like a dangerous thing pretending to be a person in public.\nThe others feel it too, each in their own style. Piper walks half a step ahead like freedom is something she bites first and asks questions later. Camille keeps scanning storefront reflections, crowd angles, and every piece of glass that could turn into a witness. Julian looks like he belongs here until you realize belonging is one of his more dangerous skills. Theo is trying very hard not to count exits with his face and failing just enough for you to recognize the effort. If Chapters One through Four taught the cohort anything, it is that being outside the fence does not make the social gravity weaker. It just makes it harder to blame the building for it.\nJordan disappears toward a corner booth at the Rusty Anchor with the kind of efficiency that suggests they have already acquired three opinions and one rumor without moving faster than a normal person. Ben lingers near the rail long enough to glance down at the water and back up like he is making peace with the fact that tonight's bad idea will be taking place over something cold enough to make every mistake feel sincere. Somewhere near the transit turnoff, a couple of civilians clock the Aegis lanyards and then do that polite-not-polite thing people do when they decide they are curious but not suicidal.\nPiper turns and walks backward for three steps, grinning at you. \"Look at this,\" she says, sweeping one hand toward the promenade like she personally authorized weather, lights, and snack options. \"Proof that the world continues existing even when Vance isn't narrating your liabilities.\"\n\"Temporary proof,\" Theo says. \"He could still appear behind one of those planters and ruin the atmosphere.\"\nJulian glances toward the waterline. \"If he does, I hope he at least has the courtesy to be cinematic about it.\"\nCamille does not look away from the storefront glass. \"If he appears behind a planter, the lesson will be that our perimeter awareness remains insulting.\" Then, after a beat that is almost generous: \"Try not to confuse permission with safety.\"\nIt lands exactly the way most useful things from her land: sharp, unsentimental, and more caring than the packaging would suggest. This far in, everyone here has already seen enough of you to know that your worst instincts are not abstract. Your best ones are not either. Off-campus air just means the choices wear different clothes."
      ],
      "choices": [
        {
          "text": "Walk beside Piper and let the evening feel a little less supervised for one block.",
          "effects": [
            {
              "type": "flag",
              "key": "add_c05_promenade_release_window_choice_1",
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
          "text": "Fall into step with Camille and ask what she sees in the reflections.",
          "effects": [
            {
              "type": "flag",
              "key": "add_c05_promenade_release_window_choice_2",
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
          "text": "Let Julian steal the tone for a minute and see what he does with it.",
          "effects": [
            {
              "type": "flag",
              "key": "add_c05_promenade_release_window_choice_3",
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
          "text": "Stay near Theo and ask what part of tonight makes him uneasy.",
          "effects": [
            {
              "type": "flag",
              "key": "add_c05_promenade_release_window_choice_4",
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
    "add_c05_waterline_commitment": {
      "chapter": 5,
      "title": "Waterline Commitment",
      "location": "Above Blackwater Bay",
      "background": "aegis",
      "focus": "Seth",
      "text": [
        "The first pulse tears the dock away from you so fast it stops being place and becomes geometry. Board line. Lamp line. Waterline. Then there is only air and the exact, humiliating clarity of discovering whether your body believes the promises your power has been making in controlled rooms.\nThe bay opens under you-cold, dark, indifferent, huge. Blackwater at night is not scenic from up here. It is honest. Honest about height, speed, consequence, and how little it would care if you turned one bad angle into a medical category. The city beyond the water glitters with the sort of distance that makes ordinary lives look serene from far enough away. Somewhere behind you Piper is shouting something half useful, half delighted. Theo's voice cuts through it with vector corrections precise enough to feel like hands on your spine. Every lesson from the last month arrives at once and refuses to stand in a line.\nFor one stretched second the impulse is simple: more. More output. More force. More refusal to fall like a normal person who made a normal mistake. Then every face you have been collecting since arrival flashes through the instinct with inconvenient timing. Camille asking whether your fast choices can be understood and repeated. Theo insisting exits are where competence gets graded. Julian laughing at the idea that image is fake just because it embarrasses practical people. Piper on the dock, too bright and too serious under the joke, asking what you were trying to prove.\nThat is the real Chapter Five threshold, maybe. Not the lift. Not the height. The fact that once power leaves the building, it starts dragging relationship and identity with it whether you invited them along or not. Out here your choices no longer read as abstract tendencies. They read as who you are becoming while witnesses exist.\nThe air column catches under you and slips. Your shoulder turns too hard. Water rushes up in one plane. The second corrective pulse bites. This is the part where training either becomes muscle memory or confession. Your body makes the decision half a beat before your pride can draft better copy for it.\nYou are aware, in a splinter-bright way, of everything at once: the salt on your lips, the ache along your ribs, the terrifying competence of gravity, the dock lights smearing gold over black water, the fact that surviving clean and looking clean are nowhere near the same thing. Aegis never had to say that. It built entire weeks around forcing you to learn it anyway."
      ],
      "choices": [
        {
          "text": "Take the clean route and accept that survival can look less heroic than spectacle.",
          "effects": [
            {
              "type": "flag",
              "key": "add_c05_waterline_commitment_choice_1",
              "value": true
            },
            {
              "type": "stat",
              "key": "control",
              "delta": 1
            }
          ],
          "timeMinutes": 15,
          "next": "c05_dock_setup"
        },
        {
          "text": "Overcorrect, fight the fall, and dare your body to keep up with your pride.",
          "effects": [
            {
              "type": "flag",
              "key": "add_c05_waterline_commitment_choice_2",
              "value": true
            },
            {
              "type": "stat",
              "key": "restraint",
              "delta": 1
            }
          ],
          "timeMinutes": 15,
          "next": "c05_dock_setup"
        },
        {
          "text": "Trust Theo's line over your own ego and ride the correction exactly.",
          "effects": [
            {
              "type": "flag",
              "key": "add_c05_waterline_commitment_choice_3",
              "value": true
            },
            {
              "type": "stat",
              "key": "resolve",
              "delta": 1
            }
          ],
          "timeMinutes": 15,
          "next": "c05_dock_setup"
        },
        {
          "text": "Commit to the risk because Piper was right: the room is gone, so the truth is yours.",
          "effects": [
            {
              "type": "flag",
              "key": "add_c05_waterline_commitment_choice_4",
              "value": true
            },
            {
              "type": "stat",
              "key": "audacity",
              "delta": 1
            }
          ],
          "timeMinutes": 15,
          "next": "c05_dock_setup"
        }
      ]
    },
    "add_c05_infirmary_after": {
      "chapter": 5,
      "title": "Infirmary After",
      "location": "Blackwater Infirmary",
      "background": "aegis",
      "focus": "Seth",
      "text": [
        "Blackwater Infirmary is smaller than the med wing on campus and somehow less comforting for it. There are only four beds behind partial curtains, one humming diagnostics cart, a wall cabinet with labeled trauma kits, and a nurse practitioner who has clearly treated enough Aegis-adjacent nonsense to stop asking questions the second she clocks the burns, the soaked fabric, or the way residents joke too hard when adrenaline is still leaking out through their teeth.\nThe fluorescent lights here are meaner than the ones at Aegis. Maybe that is unfair. Maybe the real problem is that outside the fence, injury feels less curricular and more personal. One second you were over black water proving something to yourself. The next you are on exam paper that crackles under your shoulders while someone checks your pupils and asks whether your hands are shaking because of output, cold, or ego.\n\"All three is an available answer,\" the practitioner says without looking up from the tablet.\nFrom the next bay comes the low thud of Ben setting down a plastic cup and the gentler thud of somebody-probably Jordan-telling Piper to stop trying to pace through solid furniture. Theo is arguing with the telemetry readout in a whisper because public panic embarrasses him. Camille, if she is still here, is quiet in the way she gets when she has already processed the event into lessons and is waiting to see whether you will do the same or waste her attention. Julian's voice floats in once, low and smooth, charming the staff in exactly the amount required to keep everyone from locking the place down emotionally.\nThe practitioner presses two fingers under your jaw and studies your eyes. \"You're fine enough to be annoying,\" she says. \"Congratulations. Whatever this was, do less of it at full force unless your paperwork is better than your landing looked.\"\nThat should make you laugh. It nearly does. But now that the room is no longer moving, the emotional backlash starts arriving in discrete pieces. Piper's face when you went up. Theo's voice when the angle changed. The sharp relief in your own lungs when the fall became survivable instead of cinematic. The truth of off-campus practice is that everybody who likes you has to experience your choices with less institutional padding. That is the cost nobody puts on the briefing sheet.\nA curtain shifts. Depending on the path behind you, one of them appears first-Piper still bright but furious at the floor, Theo carrying concern like a concealed weapon, Camille with an unreadable expression that means she has ten real things to say and is choosing the order, Julian leaning on the doorframe like he refuses to enter a room without improving its visual composition. Whoever it is, the sight of them hits harder than the medic's hands did. This is what continuity actually costs: by Chapter Five, people are no longer reacting to a resident. They are reacting to you specifically.\nThe practitioner steps back at last. \"Five minutes,\" she says to the doorway, with the tone of someone granting visiting hours to a scene already in progress. \"If any of you turn this into a confessional, take it outside. I mop around blood, not unresolved attraction.\""
      ],
      "choices": [
        {
          "text": "Make a joke first. If the room is going to hold concern, you would like some control over the tone.",
          "effects": [
            {
              "type": "flag",
              "key": "add_c05_infirmary_after_choice_1",
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
          "text": "Ask who looked the most worried. Immediately regret the honesty. Maybe not completely.",
          "effects": [
            {
              "type": "flag",
              "key": "add_c05_infirmary_after_choice_2",
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
          "text": "Say you know tonight looked worse than planned and mean it without hiding behind humor.",
          "effects": [
            {
              "type": "flag",
              "key": "add_c05_infirmary_after_choice_3",
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
          "text": "Ask whether anybody got hurt because of your landing before anything else.",
          "effects": [
            {
              "type": "flag",
              "key": "add_c05_infirmary_after_choice_4",
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
    "add_c05_residence_kitchen_return": {
      "chapter": 5,
      "title": "Residence Kitchen Return",
      "location": "Residence Kitchen",
      "background": "aegis",
      "focus": "Ensemble",
      "text": [
        "By the time you get back to the residence kitchen, the night has shifted out of operational time and into aftermath. The overhead lights are too bright for intimacy and not bright enough to stop it anyway. Somebody has abandoned toast in the oven long enough for the smell to become a warning. Jordan is perched on the counter with the ease of a person who has already decided they are not cleaning up anyone else's emotional debris unless offered snacks. Ben has changed into a clean shirt. Theo is drying his hair with a dish towel because apparently planning does not extend to remembering he got soaked helping with recovery on the dock. Julian has claimed the only chair in the room that looks like it belongs in a different, more forgiving building. Camille is standing at the sink with a mug she has not drunk from yet, and Piper is doing restless loops from table to fridge to table like if she stops moving the night might finally catch her.\nThis is the kind of scene a shorter story skips, which is precisely why it matters. Nobody here is in crisis anymore. That is different from being settled. Aegis keeps training residents to survive impact; the kitchen is where you find out what survival leaves in a room after adrenaline vacates the lease.\nJordan points at you with a spoon. \"Status report. Keep it under three lies.\"\n\"Is there a version of this where you ask normal questions?\" Theo says.\n\"No,\" Jordan says. \"And if there were, tonight would not qualify.\"\nPiper stops pacing long enough to lean both hands on the table and look at you with bright, furious relief she is pretending is still attitude. \"For the record,\" she says, \"if you ever decide to turn a landing into a near-spiritual experience over dark water again, I reserve the right to be dramatically offended first and supportive second.\"\n\"That's already your order for most things,\" Julian says.\nShe points at him without looking. \"You are not helping by being correct with cheekbones.\"\nJulian smiles into his cup. \"I rarely do.\"\nCamille finally drinks from the mug. \"The landing was not as bad as the correction before it,\" she says. \"Which is not praise. It is context. Learn to distinguish them if you want to survive adults.\"\nThat earns a laugh from Ben, a muttered complaint from Piper, and one of those tiny glances from Theo that means he appreciated the line even while disagreeing with its packaging. The kitchen holds the sound for a second. There it is again: the cohort hardening into something real enough to bruise each other honestly and still remain in the room.\nIf romance has been gathering anywhere, it sharpens here too-not in declarations, not necessarily, but in the specific way attention arranges itself after a scare. Who checks your hands. Who watches your mouth for the joke that means you are dodging. Who gives you space. Who refuses to. Who looks relieved in a way they will absolutely deny under oath.\nJordan swings one leg and asks, \"So was tonight proof that the institution underestimates us, proof that Theo should be allowed to assign adult supervision to all thrill-seekers, or proof that Piper should never be trusted near open water with a theory?\"\n\"Yes,\" Theo says at the exact same time Piper says, \"Rude,\" and Julian says, \"Deliciously all of the above.\"\nEven Camille's mouth twitches.\nOutside the kitchen windows the campus has gone mostly dark, but the water beyond the trees still throws back a faint borrowed shine. The world is bigger now than it was in Chapter One. That should be obvious. Tonight makes it intimate. Bigger means more witnesses, more consequences, more choices that cannot hide behind training architecture. Bigger also means more possible futures. The room can feel that without naming it yet.\nSomebody finally rescues the toast. Someone else opens a window. Piper ends one of her loops close enough to brush your arm in passing, either by accident or because the line between those things has become politically inconvenient. Theo's towel is still in his hands. Julian is watching everyone and pretending not to. Ben has settled into the kind of quiet that usually means he is making sure nobody gets left alone accidentally. Camille's mug is empty now. Jordan, of course, notices all of it.\nThis is not closure. It is better. It is the chapter teaching itself how to breathe after the bad idea survived contact with reality."
      ],
      "choices": [
        {
          "text": "Sit with the group and let the room hold the story without trying to dominate it.",
          "effects": [
            {
              "type": "flag",
              "key": "add_c05_residence_kitchen_return_choice_1",
              "value": true
            },
            {
              "type": "stat",
              "key": "control",
              "delta": 1
            }
          ],
          "timeMinutes": 15,
          "next": "add_c06_blackwater_window"
        },
        {
          "text": "Answer Jordan honestly enough to shift the tone from jokes to something real.",
          "effects": [
            {
              "type": "flag",
              "key": "add_c05_residence_kitchen_return_choice_2",
              "value": true
            },
            {
              "type": "stat",
              "key": "restraint",
              "delta": 1
            }
          ],
          "timeMinutes": 15,
          "next": "add_c06_blackwater_window"
        },
        {
          "text": "Turn toward the person you kept looking for most during the dock sequence.",
          "effects": [
            {
              "type": "flag",
              "key": "add_c05_residence_kitchen_return_choice_3",
              "value": true
            },
            {
              "type": "stat",
              "key": "resolve",
              "delta": 1
            }
          ],
          "timeMinutes": 15,
          "next": "add_c06_blackwater_window"
        },
        {
          "text": "Say as little as possible and let what happened do the talking for you.",
          "effects": [
            {
              "type": "flag",
              "key": "add_c05_residence_kitchen_return_choice_4",
              "value": true
            },
            {
              "type": "stat",
              "key": "audacity",
              "delta": 1
            }
          ],
          "timeMinutes": 15,
          "next": "add_c06_blackwater_window"
        }
      ]
    },
    "add_c06_blackwater_window": {
      "chapter": 6,
      "title": "Blackwater Window",
      "location": "Aegis Shuttle / Blackwater Approach",
      "background": "aegis",
      "focus": "Julian",
      "text": [
        "Blackwater looks expensive before it looks human.",
        "The shuttle clears the last security arm and the city opens in bands: harbor lights reflected in black water, towers trying very hard not to look like towers, rooftops made for people who enjoy being seen from other rooftops. The roads below are full without feeling crowded. Cars glide. Ferries cut white lines through the harbor. Somewhere to the east, a construction crane turns slow as a clock hand over a district that has not yet decided whether it belongs to money or teeth.",
        "Inside the shuttle, your group performs composure at four distinct speeds.",
        "Julian has one knee angled toward the window and one hand hooked lazily around the overhead rail, like the whole ride is a private screening he arranged for everyone else's benefit. The city sharpens him. Aegis fluorescent light makes him look precise; Blackwater makes him look inevitable.",
        "Piper has changed clothes and somehow still looks like she might outrun the tailoring if it annoyed her. She keeps checking reflections in the glass, not out of vanity but because the shuttle window gives her three angles at once: the harbor, the city, and the people riding toward it with her. Every so often she says something lightly irreverent just to stop the silence from acquiring a pulse.",
        "Camille has claimed the seat with the best line to the door. It is such a Camille decision that nobody bothers commenting on it. She is watching the city the way other people read tactical overlays. Bottlenecks. clear approaches. where the sidewalk narrows. where a sniper would hate the wind. where a crowd could become a trap because someone rich thought glass counted as architecture. Her attention would be disconcerting if it were not so reassuring.",
        "Theo is not pretending to enjoy any of this. He is wearing an actual button-up shirt because the dress code was phrased politely enough to function as an order, and he looks like he suspects the shirt of collaborating. His eyes keep moving between intersections, bridge spans, rooftop lines, and the mirrored black of the window whenever it throws your own faces back at you. Probability, apparently, can wear good fabric and still look worried.",
        "If Chapter Five left bruises on the group, they came along for the ride whether anyone admits it or not. Field pressure changed the temperature. Not in a melodramatic way. In the subtler way where everyone now knows exactly how quickly a casual assignment can become a story somebody has to survive.",
        "Julian breaks the silence first because of course he does. \"Blackwater,\" he says, gesturing toward the skyline like introducing a temperamental lover to the room. \"A city built on money laundering, private grief, and excellent late-night cocktails. Everyone please behave as if you were raised around scandal. It helps the staff.\"",
        "Piper snorts. \"That speech is somehow the least reassuring thing you have said all week.\"",
        "\"It is supposed to be aspirational.\"",
        "Theo does not look away from the window. \"Too many exits,\" he says.",
        "Julian glances at him. \"That is a very Theo way to describe a nightlife district.\"",
        "\"It is an accurate Theo way.\"",
        "Camille folds one leg over the other. \"Too many exits means too many angles of retreat and too many ways for someone else to define the room before you do.\"",
        "\"See?\" Julian says. \"Now we are all depressed professionally.\"",
        "You catch your own reflection between them for a second, broken by the motion of the shuttle and the hard cuts of city light. Aegis can treat you like a file because it built the cabinet. Blackwater does not know what to call you yet. That should feel like freedom. Instead it feels like being visible from more directions.",
        "Piper turns toward you. \"All right,\" she says. \"Honest survey. On a scale from one to criminally underdressed, how much am I about to hate a room full of people who smile like contracts?\"",
        "\"If you hate them fast enough,\" Julian says, \"it counts as discernment.\"",
        "Camille's eyes flick to you. Theo's do too, though his version is less obvious. The city keeps rising outside the glass. Somewhere below, two motorcycles carve between lanes like they were born annoyed. Somewhere above, the dark outline of a rooftop patio slips past, full of people who have never once in their lives wondered whether a room was measuring their power output.",
        "The shuttle dips into a turn.",
        "For one quiet stretch of road, all of you are only reflected together."
      ],
      "choices": [
        {
          "text": "Ask Julian which doors matter in a city built to look open.",
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
              "key": "add_c06_blackwater_window_choice_1",
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
          "text": "Ask Theo what, specifically, is making him count exits instead of people.",
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
              "key": "add_c06_blackwater_window_choice_2",
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
          "text": "Tell Piper she looks prepared to survive the room and wreck it if necessary.",
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
              "key": "add_c06_blackwater_window_choice_3",
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
          "text": "Ask Camille what she reads first when a place is trying this hard to look harmless.",
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
              "key": "add_c06_blackwater_window_choice_4",
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
    "add_c06_threshold_glass": {
      "chapter": 6,
      "title": "Threshold Glass",
      "location": "Event Horizon Threshold",
      "background": "city",
      "focus": "Kaito",
      "text": [
        "The Event Horizon does not announce itself with a sign so much as a decision.",
        "The entrance sits at the end of a narrow black corridor off a louder street, guarded only by discretion, a door with no visible handle, and two staff members dressed too well to be security and too still to be decorative. Music reaches you secondhand at first: bass through wall panels, vocals reduced to pulse and shape. Even before the door opens, the place feels curated against panic.",
        "When it does open, Blackwater pours through in slices-amber light, cut glass, bodies in expensive motion, the low collective hum of people who know they are being seen and are trying to weaponize it before it can be used on them.",
        "Kaito meets you at the threshold like he was not waiting and has simply always happened to stand exactly where leverage becomes hospitality.",
        "He is not dramatic. That is what makes him dangerous. Dark suit, no wasted motion, calm eyes that take in the whole group in a single pass and somehow leave no one feeling ignored. He shakes Julian's hand first, nods once to Camille as if recognizing someone who reads rooms for a living, clocks Theo's tension without naming it, and lets his attention land on Piper only long enough for her to grin at him like a challenge she is restraining for manners.",
        "When he looks at you, it is not warm, and it is not hostile. It is evaluative in the way a bridge might evaluate a truck.",
        "\"Julian,\" he says, voice pitched just above the music. \"You brought me better-dressed problems this time.\"",
        "Julian places one hand dramatically against his chest. \"Your faith in me is the only thing keeping this city alive.\"",
        "\"It is doing a poor job.\"",
        "Piper laughs. Camille absolutely does not. Theo studies the ceiling once and then the sightlines near the bar.",
        "Kaito opens the door wider. \"Neutral house,\" he says. \"That means three things. You do not start a fight. You do not continue a fight another person starts. You do not mistake the privacy of the room for secrecy outside it.\"",
        "\"The fourth thing?\" Camille asks.",
        "His mouth shifts by half a degree. \"If my staff moves, you move with them unless you enjoy losing choices.\"",
        "That lands.",
        "If you have already learned anything from Aegis, it is that rules reveal what a place has survived. The Event Horizon has survived people who confused invitation with control. It has survived people who thought neutral meant harmless. It has survived people who believed expensive rooms could not become violent if everyone inside used the right glassware.",
        "The main floor opens beyond him in layers. A bar of dark mirrored stone. booths cut into shadow. a suspended walkway with clear sight down to the lower lounge. a balcony running along one side like a second set of intentions. The clientele is a mix of money, appetite, contractors, social predators, and people too smart to name themselves in public. A woman in silver laughs with her whole mouth and none of her eyes. A man by the far booth checks a message and tucks whatever emotion it caused him neatly back under his collar.",
        "You feel the room register your group in real time. Not loudly. Rooms like this do not gasp. They adjust.",
        "Kaito watches that happen and does not interfere. \"Your table is already regretting you,\" he says.",
        "\"Then it understands us,\" Julian replies.",
        "Kaito's gaze returns to you for one beat longer than courtesy requires. If you have looked unstable in public before, you can feel him checking whether instability came dressed tonight. If you have looked controlled, you can feel the other question beneath it: whether the control is yours.",
        "\"Enjoy the house,\" he says. \"But do not ask it to love you.\"",
        "Then he steps aside, and the night acquires teeth."
      ],
      "choices": [
        {
          "text": "Tell Kaito you prefer honest doors and ask what his house charges when neutrality fails.",
          "effects": [
            {
              "type": "npc",
              "key": "Kaito",
              "trust": 1,
              "respect": 0
            },
            {
              "type": "relationship",
              "key": "Kaito",
              "delta": 2
            },
            {
              "type": "flag",
              "key": "add_c06_threshold_glass_choice_1",
              "value": true
            },
            {
              "type": "stat",
              "key": "control",
              "delta": 1
            }
          ],
          "timeMinutes": 15,
          "next": "c06_deep_permission"
        },
        {
          "text": "Ask Julian, quietly, whether he trusts Kaito or just understands him.",
          "effects": [
            {
              "type": "npc",
              "key": "Kaito",
              "trust": 0,
              "respect": 1
            },
            {
              "type": "relationship",
              "key": "Kaito",
              "delta": 1
            },
            {
              "type": "flag",
              "key": "add_c06_threshold_glass_choice_2",
              "value": true
            },
            {
              "type": "stat",
              "key": "restraint",
              "delta": 1
            }
          ],
          "timeMinutes": 15,
          "next": "c06_deep_permission"
        },
        {
          "text": "Let Camille enter first and fall in beside her like you're reading the room on purpose.",
          "effects": [
            {
              "type": "npc",
              "key": "Kaito",
              "trust": 0,
              "respect": 0
            },
            {
              "type": "relationship",
              "key": "Kaito",
              "delta": 1
            },
            {
              "type": "flag",
              "key": "add_c06_threshold_glass_choice_3",
              "value": true
            },
            {
              "type": "stat",
              "key": "resolve",
              "delta": 1
            }
          ],
          "timeMinutes": 15,
          "next": "c06_deep_permission"
        },
        {
          "text": "Brush Piper's wrist on the way in and ask if she wants company or a perimeter.",
          "effects": [
            {
              "type": "npc",
              "key": "Kaito",
              "trust": 0,
              "respect": 0
            },
            {
              "type": "relationship",
              "key": "Kaito",
              "delta": 1
            },
            {
              "type": "flag",
              "key": "add_c06_threshold_glass_choice_4",
              "value": true
            },
            {
              "type": "stat",
              "key": "audacity",
              "delta": 1
            }
          ],
          "timeMinutes": 15,
          "next": "c06_deep_permission"
        }
      ]
    },
    "add_c06_blackwater_aftershock": {
      "chapter": 6,
      "title": "Blackwater Aftershock",
      "location": "Blackwater Alley",
      "background": "aegis",
      "focus": "Camille",
      "text": [
        "Outside, the city has the indecency to keep functioning.",
        "A rideshare idles at the curb with music leaking through cracked windows. Someone on a balcony across the alley is having an argument about rent or betrayal or both. Two blocks over, a siren starts up, rises, and fades into distance. The Event Horizon door closes behind you with luxurious discretion, and the whole night changes shape around the fact that nobody in your group is joking correctly anymore.",
        "Camille gets everyone moving first. Not fast. Never fast enough to look like prey. Just enough motion to stop the room from owning the last frame.",
        "The alley is clean in the expensive-district way: brick washed recently, utility pipes painted matte black, one narrow spill of neon from a sign above the service lane. The harbor wind finds you harder here. So does adrenaline.",
        "Piper's hands are opening and closing like she is trying not to notice it. Theo is visibly running scenarios and hating all of them. Julian keeps looking over his shoulder not because he is afraid of being followed-though he might be-but because he is furious with the social geometry of the whole encounter and wants a cleaner ending than reality offered.",
        "Camille waits until the door is fully shut and Kaito's staff has gone back to pretending not to save people for a living. Then she turns.",
        "\"All right,\" she says. \"What do we know?\"",
        "It is the most merciful possible question because it forbids panic and confession equally.",
        "Theo answers first because his fear naturally arranges itself into bullet points. \"She wanted to be seen. She wanted us to know she could get inside the room. She wanted-\"",
        "\"Actionable,\" Camille says.",
        "Theo stops, swallows, begins again. \"She wanted us thinking in her timing, not ours.\"",
        "Julian exhales through his nose. \"The nerve of some women to weaponize entrance.\"",
        "Piper makes a strangled sound that could become a laugh if nobody touches it wrong. \"I hate that she did that in my favorite kind of place.\"",
        "If your route with Piper has developed, you can feel the tremor under the joke. If it has not, the tremor is still there. Camille notices either way. So do you.",
        "\"You all right?\" Ben is not here to ask the simple useful questions, so the burden lands in the group differently. Theo looks like he wants to ask it and doesn't trust his voice. Julian looks like he would rather set the whole district on fire than phrase concern badly. Camille looks like she already knows concern is implied and is trying to keep the frame intact long enough for it to matter.",
        "The alley makes truth easier because glamour has less to work with out here.",
        "Piper drags a hand through her hair once. \"I am fantastic,\" she says. \"In that I would currently lose a fistfight to a chair if the chair looked at me with enough confidence.\"",
        "Julian turns to her fully now, polished irony finally failing to cover care. \"You are not allowed to say charming things while obviously rattled. It ruins my brand.\"",
        "That gets the laugh he was aiming for, thin and real. Theo's shoulders loosen half an inch. Camille's attention shifts to you.",
        "\"If she wanted us off balance,\" Camille says, \"the first correction is deciding what part of that belongs to her and what part belongs to us.\"",
        "There it is again, the reason people follow her under pressure: she does not ask anyone to be less frightened than they are. She asks them to sort the fear into usable and useless.",
        "If earlier chapters have taught the group anything, this is where it cashes out. Who steadies whom. Who tells the truth. Who performs competence. Who actually has it. Who reaches for humor. Who reaches for structure. Who reaches for one particular person first.",
        "The alley holds all of that without comment."
      ],
      "choices": [
        {
          "text": "Tell Camille she has the frame and ask for the next useful move before anyone spirals.",
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
              "key": "add_c06_blackwater_aftershock_choice_1",
              "value": true
            },
            {
              "type": "stat",
              "key": "control",
              "delta": 1
            }
          ],
          "timeMinutes": 15,
          "next": "add_c06_apartment_board_night"
        },
        {
          "text": "Stay close to Piper until the joke drops and the honest version has room to breathe.",
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
              "key": "add_c06_blackwater_aftershock_choice_2",
              "value": true
            },
            {
              "type": "stat",
              "key": "restraint",
              "delta": 1
            }
          ],
          "timeMinutes": 15,
          "next": "add_c06_apartment_board_night"
        },
        {
          "text": "Ask Theo for the first actionable risk, not the whole catastrophe tree.",
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
              "key": "add_c06_blackwater_aftershock_choice_3",
              "value": true
            },
            {
              "type": "stat",
              "key": "resolve",
              "delta": 1
            }
          ],
          "timeMinutes": 15,
          "next": "add_c06_apartment_board_night"
        },
        {
          "text": "Tell Julian the room did not get to keep the read, and mean it enough for him to hear.",
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
              "key": "add_c06_blackwater_aftershock_choice_4",
              "value": true
            },
            {
              "type": "stat",
              "key": "audacity",
              "delta": 1
            }
          ],
          "timeMinutes": 15,
          "next": "add_c06_apartment_board_night"
        }
      ]
    },
    "add_c06_apartment_board_night": {
      "chapter": 6,
      "title": "Apartment Board Night",
      "location": "Julian's Apartment",
      "background": "city",
      "focus": "Ensemble",
      "text": [
        "Julian's apartment is the sort of place that looks like it was arranged by someone who understands both light and leverage.",
        "The city is all windows from up here, Blackwater thrown wide in glittering grids and harbor dark. The furniture is expensive without being fragile. The kitchen island holds three different bottles no one is touching and one aid kit somebody set down without admitting why. When Camille turns one wall display into a board of movements, names, photos, shell entities, and probable connections, the apartment stops being elegance and becomes infrastructure.",
        "Vektor fills the screen in fragments because organizations like that are easier to understand in patterns than in nouns. Lab fronts. procurement companies. security firms that are somehow never listed as security firms. government contracts with too much redaction and not enough shame. Missing assets. purchased silence. money moving through five hands so no one has to call it blood while it dries.",
        "Piper stands too close to the board and too far from everyone else until she catches herself doing it. Theo takes the end of the couch with his tablet and a face that says the probability trees are now personal enough to offend him. Camille remains upright because sitting would imply this is a conversation and not a necessary correction. Julian moves between the wall display and the kitchen like a host at his own disaster, which in fairness he sort of is.",
        "The room has changed since Chapter One. You can feel that without anyone narrating it. These people know each other now through pressure, injury, embarrassment, attraction, arguments, rescue, competence, and the strange intimacy of being seen at bad moments without being left alone in them. The apartment holds the accumulated charge.",
        "\"What she did tonight,\" Theo says, \"was establish initiative.\"",
        "Piper throws herself into one of the armchairs finally, restless energy still vibrating around the edges. \"What she did tonight was piss me off in custom lighting.\"",
        "\"That too,\" Julian says.",
        "Camille taps one highlighted line on the display. \"She also wanted to know whether we would go to ground, report upward, freelance, or fracture.\" Her gaze flicks through the room, landing briefly on each of you. \"So decide quickly whether anyone intends to help her answer.\"",
        "That lands where it should.",
        "If there is overt romance on any route, this room knows it even if nobody says the word. Not because people are gossiping. Because the group has become too observant and too invested not to notice who looks to whom first when danger turns deliberate.",
        "Kaito appears on one corner of the wall display for exactly forty seconds via a secure call and gives you the kind of update only neutral-ground proprietors can deliver: not a favor, not a warning, something structured in between. Then he disappears again, leaving the apartment fractionally less plausible as ordinary domestic space.",
        "Ben is not in the room, but his absence is felt in the empty patch near the kitchen where a steadier body would normally anchor things. Jordan has texted Julian three separate rumor fragments from lower Blackwater, which he reads aloud only after filtering them through taste and panic. Rina, somewhere else in the city, has apparently already concluded the answer to this situation is \"hit it harder,\" which makes Piper briefly fond and Camille briefly murderous.",
        "The board grows. So does the silence around it.",
        "Then Piper looks at you and says, \"Tell me we are not going to let her have the last word from tonight.\"",
        "The sentence is not only about the threat. That is what makes it dangerous.",
        "Theo looks up too, more careful but no less intent. Camille waits like she can survive any answer but will judge its architecture forever. Julian leans a hip against the counter, arms folded, eyes on you with all the easy polish stripped down to attention.",
        "This is the point where the chapter stops being about one room in Blackwater and becomes about what your group is turning into under pressure. Not at graduation. Not in theory. Now, in an apartment full of city light and bad options and people who are no longer hypothetical to one another.",
        "The board behind them glows white and blue over the dark glass. The night outside keeps going. The apartment does not."
      ],
      "choices": [
        {
          "text": "Say you want Vance looped in but not allowed to own the pace, and watch who respects the line.",
          "effects": [
            {
              "type": "flag",
              "key": "add_c06_apartment_board_night_choice_1",
              "value": true
            },
            {
              "type": "stat",
              "key": "control",
              "delta": 1
            }
          ],
          "timeMinutes": 15,
          "next": "c07_hub_bait"
        },
        {
          "text": "Say if Rhea wants initiative, she can have it right up until you take it back.",
          "effects": [
            {
              "type": "flag",
              "key": "add_c06_apartment_board_night_choice_2",
              "value": true
            },
            {
              "type": "stat",
              "key": "restraint",
              "delta": 1
            }
          ],
          "timeMinutes": 15,
          "next": "c07_hub_bait"
        },
        {
          "text": "Tell Piper she is not facing the next move alone, even if the room needs to hear that more than she does.",
          "effects": [
            {
              "type": "flag",
              "key": "add_c06_apartment_board_night_choice_3",
              "value": true
            },
            {
              "type": "stat",
              "key": "resolve",
              "delta": 1
            }
          ],
          "timeMinutes": 15,
          "next": "c07_hub_bait"
        },
        {
          "text": "Ask Theo and Camille for the clean version of the plan before anyone gets brave enough to ruin it.",
          "effects": [
            {
              "type": "flag",
              "key": "add_c06_apartment_board_night_choice_4",
              "value": true
            },
            {
              "type": "stat",
              "key": "audacity",
              "delta": 1
            }
          ],
          "timeMinutes": 15,
          "next": "c07_hub_bait"
        },
        {
          "text": "add_c06_blackwater_window expands c06_blackwater_drive and should reference Chapter 5 residue when possible.",
          "effects": [
            {
              "type": "flag",
              "key": "add_c06_apartment_board_night_choice_5",
              "value": true
            },
            {
              "type": "stat",
              "key": "control",
              "delta": 1
            }
          ],
          "timeMinutes": 15,
          "next": "c07_hub_bait"
        },
        {
          "text": "add_c06_threshold_glass can sit between c06_blackwater_drive and c06_event_horizon or be folded into the threshold conversation.",
          "effects": [
            {
              "type": "flag",
              "key": "add_c06_apartment_board_night_choice_6",
              "value": true
            },
            {
              "type": "stat",
              "key": "restraint",
              "delta": 1
            }
          ],
          "timeMinutes": 15,
          "next": "c07_hub_bait"
        },
        {
          "text": "add_c06_booth_currents is the mandatory ensemble pulse for the first half of the chapter.",
          "effects": [
            {
              "type": "flag",
              "key": "add_c06_apartment_board_night_choice_7",
              "value": true
            },
            {
              "type": "stat",
              "key": "resolve",
              "delta": 1
            }
          ],
          "timeMinutes": 15,
          "next": "c07_hub_bait"
        },
        {
          "text": "add_c06_julian_balcony, add_c06_piper_backbar, add_c06_camille_service_corridor, and add_c06_theo_sideoffice are the main private Chapter 6 beats. Each should return to c06_hub_event or the appropriate c06_hub_return_* scene.",
          "effects": [
            {
              "type": "flag",
              "key": "add_c06_apartment_board_night_choice_8",
              "value": true
            },
            {
              "type": "stat",
              "key": "audacity",
              "delta": 1
            }
          ],
          "timeMinutes": 15,
          "next": "c07_hub_bait"
        },
        {
          "text": "add_c06_rhea_floor_freeze expands c06_rhea_arrives without replacing the live branch outcomes.",
          "effects": [
            {
              "type": "flag",
              "key": "add_c06_apartment_board_night_choice_9",
              "value": true
            },
            {
              "type": "stat",
              "key": "control",
              "delta": 1
            }
          ],
          "timeMinutes": 15,
          "next": "c07_hub_bait"
        },
        {
          "text": "add_c06_blackwater_aftershock and add_c06_apartment_board_night are the emotional and strategic close for the chapter and should feed forward into Chapter 7 without losing the room's relational charge.",
          "effects": [
            {
              "type": "flag",
              "key": "add_c06_apartment_board_night_choice_10",
              "value": true
            },
            {
              "type": "stat",
              "key": "restraint",
              "delta": 1
            }
          ],
          "timeMinutes": 15,
          "next": "c07_hub_bait"
        },
        {
          "text": "Do not let Chapter 6 flatten Julian into pure host energy; this chapter is one of his best places to deepen.",
          "effects": [
            {
              "type": "flag",
              "key": "add_c06_apartment_board_night_choice_11",
              "value": true
            },
            {
              "type": "stat",
              "key": "resolve",
              "delta": 1
            }
          ],
          "timeMinutes": 15,
          "next": "c07_hub_bait"
        },
        {
          "text": "Keep Piper emotionally vivid without turning every scene into a Piper monopoly.",
          "effects": [
            {
              "type": "flag",
              "key": "add_c06_apartment_board_night_choice_12",
              "value": true
            },
            {
              "type": "stat",
              "key": "audacity",
              "delta": 1
            }
          ],
          "timeMinutes": 15,
          "next": "c07_hub_bait"
        },
        {
          "text": "Let Camille feel precise, not cold by default.",
          "effects": [
            {
              "type": "flag",
              "key": "add_c06_apartment_board_night_choice_13",
              "value": true
            },
            {
              "type": "stat",
              "key": "control",
              "delta": 1
            }
          ],
          "timeMinutes": 15,
          "next": "c07_hub_bait"
        },
        {
          "text": "Let Theo's anxiety read as intelligence under strain, not generic fear.",
          "effects": [
            {
              "type": "flag",
              "key": "add_c06_apartment_board_night_choice_14",
              "value": true
            },
            {
              "type": "stat",
              "key": "restraint",
              "delta": 1
            }
          ],
          "timeMinutes": 15,
          "next": "c07_hub_bait"
        },
        {
          "text": "Kaito and Rhea should matter a lot without becoming route-heavy.",
          "effects": [
            {
              "type": "flag",
              "key": "add_c06_apartment_board_night_choice_15",
              "value": true
            },
            {
              "type": "stat",
              "key": "resolve",
              "delta": 1
            }
          ],
          "timeMinutes": 15,
          "next": "c07_hub_bait"
        },
        {
          "text": "Preserve Blackwater as a place with its own rules, not just Aegis off-campus.",
          "effects": [
            {
              "type": "flag",
              "key": "add_c06_apartment_board_night_choice_16",
              "value": true
            },
            {
              "type": "stat",
              "key": "audacity",
              "delta": 1
            }
          ],
          "timeMinutes": 15,
          "next": "c07_hub_bait"
        }
      ]
    },
    "add_c07_morning_kitchen_fallout": {
      "chapter": 7,
      "title": "Morning Kitchen Fallout",
      "location": "Residence Kitchen",
      "background": "aegis",
      "focus": "Ensemble",
      "text": [
        "The kitchen is too bright for the kind of morning everyone is having.",
        "Someone opened every blind halfway, which means the sun arrives in thin, accusing bands across the counters and makes the stainless-steel appliances look more clinical than domestic. A coffee maker rattles like it resents labor. The table is littered with the remains of a night nobody fully admits they had: cups, protein wrappers, one abandoned legal pad with Theo's cramped notes marching over the page margin and into the title line like probability itself got impatient.",
        "Piper is already there when you walk in, perched on the counter in socks and black training pants, one leg bouncing hard enough to turn the cupboard door against her calf into a steady metronome. She stops when she sees you. Not because she meant to. Because she did not know she was waiting for proof you were upright.",
        "Camille is standing at the sink, phone face-down beside her, sleeves rolled precisely to the same point on both forearms. She has made coffee strong enough to count as a position statement. Julian is leaning in the doorway with his shoulder against the frame, dressed too well for a crisis meeting before breakfast and somehow making that look less vain than defensive. Theo is at the table in yesterday's shirt, glasses low on his nose, building boxes around the unboxable with a mechanical pencil and the kind of concentration that usually means he is one question away from becoming dangerous to paperwork.",
        "Nobody says good morning. That would imply sleep happened in a meaningful way.",
        "Piper breaks first. \"So,\" she says, voice lighter than her face. \"Options. One: we all pretend last night was normal and start discussing cereal. Two: we skip directly to who decided bait was a cute word for using you as a magnet.\"",
        "\"It is not bait yet,\" Camille says without turning around. \"At the moment it is a review problem with too many people improvising morality at it.\"",
        "\"A review problem,\" Piper repeats. \"Fantastic. That's much better. If something tries to kill him again, I assume we can bury it in an administrative appeal.\"",
        "Theo drags the pencil under a line on his page. \"If we're going to do this, I need people to stop speaking like emotion and logistics are mutually exclusive. We have a targeted hostile, an external coordinator, incomplete surveillance confidence, and a facility that is about to respond by increasing proximity between the target and the thing doing the targeting because institutions are often powered by cursed symmetry.\"",
        "Julian tips his head. \"There he is. The only man alive who can make doom sound like a peer-reviewed abstract.\"",
        "Theo does not look up. \"Thank you. I am miserable.\"",
        "That gets a brief, unwilling sound out of Camille that might almost be laughter if anyone here were in the mood to be generous about definitions.",
        "If Chapter 6 left physical damage in view, it hangs over the room now. A bandage. A guarded shoulder. A medic's tape mark at the wrist. Nobody stares. Everyone notices. Aegis has a way of teaching people the difference between politeness and negligence.",
        "Julian lifts his eyes to yours. \"The official position, in case you wanted one before the coffee finishes weaponizing itself, is that everyone in this room is very calm and very ready to make excellent decisions. The unofficial position is that I would like one hour in a locked records room and permission to stop being charming about this.\"",
        "Camille picks up two mugs, sets one near you without comment, and keeps the other. \"The unofficial position,\" she says, \"is that Vance will try to turn panic into process before noon. We should decide what we actually think before he does it for us.\"",
        "Piper slides off the counter. Up close, the energy around her reads less like recklessness and more like overspeed with nowhere decent to go. \"What I think is simple. Somebody aimed Rhea at us. Somebody wanted to see what he'd do.\" She flicks her gaze to you. \"What I want to know is whether we're going to stand here and let them keep treating that like a theory.\"",
        "The room shifts with that. Not physically. Relationally. It is one thing to survive contact. Another to admit the contact may have been designed.",
        "Theo finally looks up. \"We should not say 'us' when what they actually targeted was him.\"",
        "\"Cute distinction,\" Piper says.",
        "\"No, important distinction,\" Theo says, more force than volume. \"Because if the system decides he is the variable, the system protects itself by isolating the variable. That is what systems do when they are frightened.\"",
        "Julian watches you over the rim of a mug he absolutely did not pour himself. \"And because several people in this room are about to make emotional decisions and pretend the decisions are analytical until somebody calls them on it. Which, for the record, I deeply respect as a lifestyle and still think we should notice.\"",
        "Camille's eyes settle on you now, direct and exact. \"Before Vance starts assigning narratives, decide what yours is. Did last night make you want walls, witnesses, or distance?\""
      ],
      "choices": [
        {
          "text": "Witnesses. If they want to classify me, they can do it in front of people I trust.",
          "effects": [
            {
              "type": "flag",
              "key": "add_c07_morning_kitchen_fallout_choice_1",
              "value": true
            },
            {
              "type": "stat",
              "key": "control",
              "delta": 1
            }
          ],
          "timeMinutes": 15,
          "next": "c07_hub_bait"
        },
        {
          "text": "Walls. I'm done being available to everyone with a clipboard and a theory.",
          "effects": [
            {
              "type": "flag",
              "key": "add_c07_morning_kitchen_fallout_choice_2",
              "value": true
            },
            {
              "type": "stat",
              "key": "restraint",
              "delta": 1
            }
          ],
          "timeMinutes": 15,
          "next": "c07_hub_bait"
        },
        {
          "text": "Distance. I need one hour where nobody needs anything from me.",
          "effects": [
            {
              "type": "flag",
              "key": "add_c07_morning_kitchen_fallout_choice_3",
              "value": true
            },
            {
              "type": "stat",
              "key": "resolve",
              "delta": 1
            }
          ],
          "timeMinutes": 15,
          "next": "c07_hub_bait"
        },
        {
          "text": "No. I want a plan. Not comfort, not panic, not theater. A plan.",
          "effects": [
            {
              "type": "flag",
              "key": "add_c07_morning_kitchen_fallout_choice_4",
              "value": true
            },
            {
              "type": "stat",
              "key": "audacity",
              "delta": 1
            }
          ],
          "timeMinutes": 15,
          "next": "c07_hub_bait"
        }
      ]
    },
    "add_c07_bait_conscience_expanded": {
      "chapter": 7,
      "title": "Bait Conscience Expanded",
      "location": "Observation Hall",
      "background": "sim",
      "focus": "Theo",
      "text": [
        "The observation hall overlooks the simulation dome through thick reinforced glass, which is either reassuring or insulting depending on whether you are inside it when things go wrong.",
        "Theo is standing close enough to the glass to leave a faint ghost of himself in it. Below, crews are rebuilding streets nobody believes in: pop-up facades, wrecked taxis rolled into meaningful positions, fake fire escapes, a cheap little grocery storefront whose shattered windows can be replaced between runs faster than trust can. The city block under the dome is all suggestion and no mercy.",
        "A tablet glows in Theo's hands. Layers of route projections scroll under his thumb: interception windows, abort thresholds, extraction radius, worst-case branches with tiny red numerals that somehow manage to feel embarrassed to exist. He hears you before you speak and says, without turning, \"I have prepared three separate arguments for why this is a terrible plan. I hate all of them because none of them are strong enough to guarantee they win.\"",
        "\"Encouraging.\"",
        "\"It isn't meant to be.\"",
        "He finally looks at you. The exhaustion in his face has crossed the line where it almost looks serene. That happens to him sometimes when the fear gets specific enough. Vague fear makes him tight. Specific fear makes him precise.",
        "\"If we do this,\" he says, \"the official version will be that the dome is controlled, that personnel coverage is redundant, that med and extraction are stacked, that the target is understood, and that there are abort conditions. Most of that will even be technically true. The problem is that truth becomes less useful when someone on the other side knows the same script.\"",
        "You come to stand beside him. Below, the fake crosswalk has been repainted three times. It still looks temporary. So does courage, some days.",
        "\"Tell me the real objection,\" you say.",
        "Theo's mouth tightens. \"The real objection is that everyone keeps talking about whether the plan can work. That isn't the whole question. The question is what it trains all of us to accept if it does.\"",
        "He taps the screen and pulls up the central branch map. At the center is your position. Around it, concentric response rings. Piper. Camille. Julian. security teams. med. abort line. all the geometry of care translated into procedure.",
        "\"If this goes well,\" Theo says, \"Aegis learns that putting you in reach of danger on purpose can be strategic. If it goes badly, Aegis learns it anyway, just with paperwork attached.\"",
        "He hates that sentence as soon as he says it. You can see him wishing the truth were less true.",
        "\"And if we don't do it?\"",
        "\"Then Rhea chooses the timing instead of us. Vektor keeps initiative. More civilians become math. I know.\" He exhales through his nose. \"I am not objecting because I don't understand the argument. I am objecting because I do.\"",
        "The honesty in that lands harder than alarm would have.",
        "If your route with him has been deepening, this is one of the clearest places where overt romance can stop being theoretical. Not because he suddenly becomes bold in a cinematic way. Because he trusts you enough to let principle sound personal.",
        "\"I can write the abort branch,\" he says. \"The real one. Not the version Vance puts on the board for people who need confidence. The one where I say your name and you stop, no matter what your power is telling you, no matter what Piper is doing, no matter what Rhea says, no matter how close you are to being right.\"",
        "\"And if I don't?\"",
        "Theo meets your eyes. \"Then I learn something about you I am trying very hard not to learn that way.\"",
        "The line sits between you, severe and intimate in equal measure."
      ],
      "choices": [
        {
          "text": "Write it. If you call it, I stop.",
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
              "key": "add_c07_bait_conscience_expanded_choice_1",
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
          "text": "Write it, but only if you promise not to flinch too early.",
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
              "key": "add_c07_bait_conscience_expanded_choice_2",
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
          "text": "I can't promise that. Not if people are on the line.",
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
              "key": "add_c07_bait_conscience_expanded_choice_3",
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
          "text": "I need Camille's geometry and your trigger. Both.",
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
              "key": "add_c07_bait_conscience_expanded_choice_4",
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
    "add_c07_before_bait_fracture": {
      "chapter": 7,
      "title": "Before Bait Fracture",
      "location": "Strategy Room",
      "background": "aegis",
      "focus": "Ensemble",
      "text": [
        "The strategy room was designed by someone who believed rectangles could bully chaos into obedience.",
        "Everything in it is hard-edged and clean. The table. the wall displays. the overhead strips of white light. the sealed tray of useless pastries somebody always orders for meetings where nobody will be human long enough to want sugar. On the main screen, the dome layout rotates slowly: streets, choke points, camera cones, false storefronts, medical ingress, security fallback, Piper's extraction arcs, Camille's containment geometry, Theo's abort thresholds, Julian's decoy lanes, your position at the center like a confession dressed as a tactic.",
        "That last part is what nobody can stop staring at for long.",
        "Vance stands at the head of the table without behaving like it. Camille has already marked three revisions on the map in red. Theo has six tabs open and the expression of a man trying to prevent mathematics from becoming an obituary. Julian is seated for once, which is how you know he is angry. Piper is walking lazy circles around the room with all the violence of someone trying to keep motion inside the category of acceptable.",
        "\"Final pass,\" Vance says. \"We run exactly once. No heroics. No improvisation that is not justified in the moment and survivable in the paperwork after.\"",
        "\"Your gift for romance remains unmatched,\" Julian murmurs.",
        "Piper ignores him. \"I still hate that the center of the plan is 'let her touch him.'\"",
        "\"The center of the plan is layered response and zero solo gaps,\" Camille says.",
        "\"The center of the plan is him,\" Piper snaps.",
        "Nobody in the room can honestly disagree, which is why silence appears instead.",
        "Theo breaks it. \"The abort line is still non-negotiable. If I call it, the operation ends. We do not rationalize our way into one more second because the one more second looked useful.\"",
        "Piper spins toward him. \"You say that like time politely stops while we're making responsible decisions.\"",
        "\"I say it like there are outcomes worse than failing to catch Rhea today.\"",
        "\"Such as?\"",
        "Theo looks at you, then away. \"Teaching the building that using him like this works.\"",
        "That hits hard enough that even Julian stops helping the room breathe.",
        "Camille folds her arms. \"The building is going to learn something either way. The only question is whether it learns with our structure attached or without it.\"",
        "\"My favorite debate,\" Julian says. \"Which bad precedent would we like to set with excellent posture?\"",
        "Vance's voice cuts through before the room can become an argument people later pretend was strategic. \"Enough. We are not here to perform our discomfort. We are here to state it clearly enough that it can be accounted for.\"",
        "His eyes land on you. \"So account for it. Right now. In front of them. What do you need from this team to walk into that dome without lying to yourself?\"",
        "The question opens the room. Not gently.",
        "Piper stops moving. Camille goes still in the specific way that means every part of her attention is awake. Theo sets the tablet down face-first. Julian leans back, expression unreadable in a way that probably means too readable underneath.",
        "This is not the time for slogans. Everyone here would rather you said something dangerous and true than safe and generic."
      ],
      "choices": [
        {
          "text": "I need all of you honest, even if honesty makes the plan uglier.",
          "effects": [
            {
              "type": "flag",
              "key": "add_c07_before_bait_fracture_choice_1",
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
          "text": "I need nobody mistaking care for hesitation.",
          "effects": [
            {
              "type": "flag",
              "key": "add_c07_before_bait_fracture_choice_2",
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
          "text": "I need the abort line respected, even if I hate hearing it.",
          "effects": [
            {
              "type": "flag",
              "key": "add_c07_before_bait_fracture_choice_3",
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
          "text": "I need everyone ready to break the plan the instant it stops protecting people.",
          "effects": [
            {
              "type": "flag",
              "key": "add_c07_before_bait_fracture_choice_4",
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
    "add_c07_afteraction_kitchen": {
      "chapter": 7,
      "title": "Afteraction Kitchen",
      "location": "Residence Kitchen",
      "background": "aegis",
      "focus": "Ensemble",
      "text": [
        "By the time everyone makes it back to the kitchen, Aegis has already started writing the story for public consumption.",
        "You can tell because the internal screens in the hall are all dark and the secure comms channels have gone from frantic to bureaucratic. That is how institutions mourn control: by tightening language around it until nobody can breathe without authorization.",
        "The kitchen, by contrast, looks like a scene from a domestic disaster where the casualties were mostly caffeine and patience. Somebody has left med tape on the counter beside a bowl of cut fruit. Piper's jacket is over the back of a chair it definitely did not begin the day respecting. Theo is hunched over a tablet at the table, not typing, just staring at the same line as if it might apologize. Julian is at the sink rinsing blood or grime or simulation residue from his hands with the concentration of someone trying not to think about the shape of touch. Camille is by the fridge, very upright, very composed, which in her case is often a public service and a private emergency at the same time.",
        "The room reacts to your presence immediately and in four different dialects.",
        "Piper's head lifts first. If you asked her to stay in med earlier, or chose her when the room was worst, that look lands warmer and rougher all at once. If you didn't, there is still relief in it, but the edge stays sharper.",
        "Theo finally blinks and stands like his body forgot sitting was an option. Julian turns off the faucet. Camille's shoulders drop half an inch, which is roughly equivalent to another person's hand slipping from a weapon.",
        "\"Before anybody says anything stupid,\" Julian says, drying his hands on a towel that did not deserve this day, \"I would like to nominate the following truths for unanimous adoption. One: that was worse than the report will admit. Two: if anyone says 'within acceptable parameters' I will bite them. Three: everyone in this kitchen is too tired to be noble, so perhaps we could try honesty instead.\"",
        "\"Seconded,\" Piper says immediately.",
        "Theo rubs at his eyes. \"Motion carried.\"",
        "Camille looks at you. \"Start with whether you remember everything.\"",
        "The question is clinical only on the surface. Under it: Are you still here? Are you still reachable? Are we talking to you or the aftermath of you?",
        "Depending on the live route outcome, the emotional weather differs. If containment held cleanly, the room is running on relief sharpened by delayed fear. If Rhea slipped or the operation went ugly, everything is tighter, more brittle, more aware that one decision can become a permanent adjective.",
        "You answer. Then the room answers back.",
        "Piper plants both hands on the counter. \"I don't care what the board calls it. If they make this look clean on paper I am going to become a humanitarian problem.\"",
        "\"Try not to threaten policy with language that can be quoted in a hearing,\" Camille says.",
        "\"I was being poetic.\"",
        "\"You were being admissible.\"",
        "Julian points at both of them. \"See? This is why I stay beautiful. It gives me options when the rest of you insist on becoming case law.\"",
        "Theo lets out one exhausted laugh and then goes serious again. \"What the board says matters. Not because they're right. Because if they decide the operation proved something useful about him, that becomes precedent. If they decide it proved something frightening, that also becomes precedent. Either way, we're not discussing only tonight anymore.\"",
        "No one argues with that. The kitchen doesn't soften, exactly. It becomes truer."
      ],
      "choices": [
        {
          "text": "Then we decide what story gets told before they do.",
          "effects": [
            {
              "type": "flag",
              "key": "add_c07_afteraction_kitchen_choice_1",
              "value": true
            },
            {
              "type": "stat",
              "key": "control",
              "delta": 1
            }
          ],
          "timeMinutes": 15,
          "next": "c07_medbay_fallout"
        },
        {
          "text": "The story is simple: I was not alone in there.",
          "effects": [
            {
              "type": "flag",
              "key": "add_c07_afteraction_kitchen_choice_2",
              "value": true
            },
            {
              "type": "stat",
              "key": "restraint",
              "delta": 1
            }
          ],
          "timeMinutes": 15,
          "next": "c07_medbay_fallout"
        },
        {
          "text": "If they make me a precedent, I choose what kind.",
          "effects": [
            {
              "type": "flag",
              "key": "add_c07_afteraction_kitchen_choice_3",
              "value": true
            },
            {
              "type": "stat",
              "key": "resolve",
              "delta": 1
            }
          ],
          "timeMinutes": 15,
          "next": "c07_medbay_fallout"
        },
        {
          "text": "Tonight I need you as people before I need you as strategy.",
          "effects": [
            {
              "type": "flag",
              "key": "add_c07_afteraction_kitchen_choice_4",
              "value": true
            },
            {
              "type": "stat",
              "key": "audacity",
              "delta": 1
            }
          ],
          "timeMinutes": 15,
          "next": "c07_medbay_fallout"
        }
      ]
    },
    "add_c08_hangar_arrival": {
      "chapter": 8,
      "title": "Hangar Arrival",
      "location": "Airbase Hangar",
      "background": "sim",
      "focus": "Ensemble",
      "text": [
        "The airbase hangar is too open to feel safe and too busy to feel empty. Every sound travels farther than it should. Forklifts beep somewhere past a line of stacked equipment crates. Portable floodlights throw hard white bars across concrete. The crash mats waiting near the runway doors are a little too thick and a little too numerous to count as reassuring. Beyond the open hangar mouth, the runway glows under morning haze, long and flat and indifferent.",
        "Aegis has pulled half a mobile operation out here. Medics with field kits move between folding stations. Techs kneel over portable sensors, cursing softly at cables that refuse to behave in the wind. Two observers on the catwalk argue over camera angles like they are setting up a sports broadcast for the end of the world. It would all look absurd if the atmosphere were not so taut.",
        "The cohort arrives in pieces. Piper is first to make the hangar feel smaller, pacing the painted line near the doors with a restless energy that somehow does not read as fear until you already know her. Camille is speaking with one of the airbase coordinators, not deferential, not hostile, simply impossible to ignore. Julian has adapted to the industrial lighting in the insulting way he adapts to everything. Theo is near the portable monitor bank, eyes moving between the live numbers and the people they could eventually belong to.",
        "Ben is helping a medic with a folded stretcher. Rina studies the chalked braking markers like a rival's handwriting. Jordan lingers near the shuttle doors with a paper cup and the expression of someone reading the whole room for structural weakness.",
        "If the last few chapters changed how people look at you, it is all here now. Nobody announces that. Nobody needs to. The first days of attraction, friction, respect, caution, and misread confidence have hardened into operational habits. People make room for you faster. Or they do not. Their jokes bend sharper. Or kinder. They expect steadiness from you, or spectacle, or a problem disguised as a person. You can feel which one before anybody opens their mouth.",
        "A portable speaker cracks to life. \"Airbase review begins in nine minutes,\" a flat voice announces. \"All trainees remain in assigned zones until cleared by command.\"",
        "\"Assigned zones,\" Piper repeats, delighted and offended at once. \"Nothing good has ever followed that phrase.\"",
        "Julian glances toward the runway. \"On the contrary. Sometimes it is followed by money, helicopters, and one very regrettable gala.\"",
        "\"That sentence somehow made this worse,\" Theo says without looking up.",
        "Julian smiles faintly. \"You wound me.\"",
        "Camille breaks from the coordinator and crosses toward the painted briefing square. Her gaze catches yours on the way. If there has been tension building between you for chapters now, it sharpens here, because the hangar turns everything into line and distance and chosen proximity. Piper's glance lands too. Theo checks whether you look steady enough for this. Julian reads the room before he reads you. All of them, in different ways, are measuring not only what you can do, but who you become when the concrete opens up and there are no more walls to pretend you are contained by.",
        "Ben drops the stretcher into place and wipes one hand against his pants. \"This setup is either extremely responsible,\" he says, \"or a terrible sign.\"",
        "\"Both,\" Jordan says immediately. \"Almost certainly both.\"",
        "A gust sweeps through the hangar and lifts the edge of a loose safety tarp. Somewhere down the line a mechanic slams a toolbox shut. The whole space waits around itself, built for movement and currently crowded with people trying not to imagine the wrong kind.",
        "Vance steps up onto the low rolling platform the airbase crew has dragged in for briefings. Even before he speaks, the noise shifts. That is one of his uglier talents: he can make a room become the work in front of it.",
        "\"Eyes up,\" he says.",
        "You look anyway at the runway. At the markers. At the crash mats. At the med bay tarps. At the friends and almost-friends and dangerous almost-somethings now arranged around the same problem. Chapter by chapter, Aegis has been deciding what to call you. Today feels more like the first time the world might take its own guess."
      ],
      "choices": [
        {
          "text": "Drift toward Piper before briefing starts and ask whether she is excited or just vibrating out of principle.",
          "effects": [
            {
              "type": "flag",
              "key": "add_c08_hangar_arrival_choice_1",
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
          "text": "Cross to Theo's monitor bank and ask what the numbers are warning him about.",
          "effects": [
            {
              "type": "flag",
              "key": "add_c08_hangar_arrival_choice_2",
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
          "text": "Catch Camille on her way back from the coordinator and ask whether command looks worried enough for her taste.",
          "effects": [
            {
              "type": "flag",
              "key": "add_c08_hangar_arrival_choice_3",
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
          "text": "Join Julian near the catwalk shadow and make a dry comment about all this production value for one runway.",
          "effects": [
            {
              "type": "flag",
              "key": "add_c08_hangar_arrival_choice_4",
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
        },
        {
          "text": "Stay where you are, let the room come into focus, and watch who chooses you first.",
          "effects": [
            {
              "type": "flag",
              "key": "add_c08_hangar_arrival_choice_5",
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
        }
      ]
    },
    "add_c08_vance_brief": {
      "chapter": 8,
      "title": "Vance Brief",
      "location": "Portable Briefing Room",
      "background": "aegis",
      "focus": "Vance",
      "text": [
        "The portable briefing room is really just a section of the hangar boxed off by rolling dividers and bad optimism. Somebody has clipped aerial runway diagrams onto magnetic boards. Another somebody has tried to make the folding chairs look intentional. Coffee sits untouched near the wall because nobody trusts their own stomach enough to test it. Aegis has a particular gift for assembling temporary order in places built for motion.",
        "Vance stands at the head of the room with one palm braced on the table, the projector glow cutting across his shoulder and leaving the rest of him in hard-edged shadow. Behind him, runway maps show lane markers, abort points, medical stations, and a widening cone where the data team expects the worst of the pressure wake to go if things stop being theoretical.",
        "\"Today is not about proving how special you are,\" he says. \"It is about proving that you can remain useful when scale enters the room.\"",
        "There is a little movement at that. Rina shifts. Piper tilts her chair back on two legs until Camille looks at her and the chair comes down again without comment. Theo has already read the map and is now reading Vance instead. Julian's posture says casual; his attention says absolutely not casual.",
        "Vance taps the board. \"The airbase gives us range, wind exposure, independent medical, and enough sensor distance to stop lying to ourselves about what high-output performance looks like. It does not forgive stupidity.\"",
        "His eyes land on you then, not because he is singling you out theatrically but because everyone in the room already understands this chapter has you at the center of its geometry whether they say so or not. Whatever you have built with him so far-obedience, irritation, reluctant respect, the sense that he sees too much and says too little-travels with the look.",
        "\"If you experience instability, you report it.\" He lets the words sit. \"Immediately. I would rather write paperwork than watch a body hit concrete because somebody wanted to be impressive.\"",
        "\"Some of us can do both,\" Piper mutters.",
        "\"I heard that, Lane.\"",
        "\"I was devastated to learn sound still works here.\"",
        "A few people laugh, grateful for the crack in the pressure. It closes again quickly.",
        "Vance continues. \"Lane brackets the speed lane. The player anchors the central output benchmark. Fairchild handles abort contingencies. Arden monitors deviation projections. Hart manages observer bleed and crowd read.\"",
        "Julian raises one hand two inches. \"I adore being described like a mobile anti-chaos chandelier.\"",
        "\"Take the compliment and move on.\"",
        "Ben gets crash response. Jordan is attached to shuttle and transit coordination. Rina slots into auxiliary pressure track and independent comparison runs.",
        "Vance looks back to you. \"Every chapter before this one has given me a slightly different argument about what to do with you,\" he says. \"Today is your chance to stop being an argument and become a decision.\"",
        "It is not encouraging, exactly. Coming from him, it is close.",
        "He clicks to the next slide. A close-up of the runway appears with red hash marks at interval distances, black boxes marking dead zones, and one amber wedge labeled WATCHER BLEED. \"You have people out there who trust you,\" he says. \"You have people out there who don't. Act in a way that leaves both groups fewer reasons to be idiots.\"",
        "The room stays quiet.",
        "\"If you have concerns,\" he adds, and now the look sweeps everyone, \"raise them before the concrete does.\"",
        "Camille is the first to speak, precise and low, already in motion mentally. Theo follows with a question about response lag. Piper asks whether she gets credit if she breaks physics politely. Julian asks about observer line contamination with the airbase crew watching from the catwalk. The conversation turns practical because that is what trained fear looks like: people offering the part of themselves that can be useful.",
        "When Vance dismisses you, nobody surges for the door. Everyone leaves in the slower way people do when they know the real event begins on the other side of silence.",
        "As you step into the hangar light again, Vance stops you with two words. \"One minute.\"",
        "The others continue out. He waits until the divider muffles them before speaking again.",
        "\"You have a habit,\" he says, \"of making people pick a category for you before you decide whether you like it.\"",
        "You could argue. He would not care.",
        "\"Today,\" he says, \"pick your own. And then keep it. I'm tired of having to guess whether your restraint is real or mood-dependent.\"",
        "It is the kind of thing that could land as pressure or trust depending on what he has been to you so far. Either way, he is not speaking to you like a problem in storage. He is speaking to you like a variable already entering the math."
      ],
      "choices": [
        {
          "text": "Tell him restraint is real and ask whether he is prepared to trust it when it matters.",
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
              "key": "add_c08_vance_brief_choice_1",
              "value": true
            },
            {
              "type": "stat",
              "key": "control",
              "delta": 1
            }
          ],
          "timeMinutes": 15,
          "next": "c08_airbase"
        },
        {
          "text": "Ask whether this is his version of confidence or just a nicer form of threat.",
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
              "key": "add_c08_vance_brief_choice_2",
              "value": true
            },
            {
              "type": "stat",
              "key": "restraint",
              "delta": 1
            }
          ],
          "timeMinutes": 15,
          "next": "c08_airbase"
        },
        {
          "text": "Say you understand and ask what failure looks like from his side of the room.",
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
              "key": "add_c08_vance_brief_choice_3",
              "value": true
            },
            {
              "type": "stat",
              "key": "resolve",
              "delta": 1
            }
          ],
          "timeMinutes": 15,
          "next": "c08_airbase"
        },
        {
          "text": "Let the warning stand, thank him without softening it, and head back into the hangar.",
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
              "key": "add_c08_vance_brief_choice_4",
              "value": true
            },
            {
              "type": "stat",
              "key": "audacity",
              "delta": 1
            }
          ],
          "timeMinutes": 15,
          "next": "c08_airbase"
        }
      ]
    },
    "add_c08_afterburn_corridor": {
      "chapter": 8,
      "title": "Afterburn Corridor",
      "location": "Recovery Corridor",
      "background": "aegis",
      "focus": "Seth",
      "text": [
        "The recovery corridor behind the airbase medical line is narrow enough to feel almost domestic after the runway. Canvas partitions mute the worst of the noise. Portable fans fight a losing battle against heat and adrenaline. Every few feet there is another folding chair occupied by somebody trying to convince themselves that standing would look stronger. Nobody buys it.",
        "The concrete under your feet is real in a way it was not ten minutes ago. That is the first thing you notice after something like this: texture comes back meaner.",
        "A medic presses a cold pack into your hand with the brisk authority of someone who has watched enough gifted idiots postpone treatment until the body chooses for them. \"Sit,\" she says.",
        "\"I'm fine.\"",
        "\"Then you can be fine from a chair.\"",
        "You sit.",
        "Across from you, Theo is arguing softly with a data tech over whether the post-run telemetry should be classified as an acute event marker or a cumulative threshold breach. It is somehow one of the most Theo things he has ever done: turn care into argument because the argument has a better chance of being obeyed. Piper is at the far end of the corridor wrapped in a silver field blanket she appears to regard as a personal insult. Camille is speaking to Vance near the privacy curtain, posture rigid in that particular way she gets when she is furious enough to become immaculate. Julian is leaning against a supply cabinet, somehow the only person in the corridor who looks like he knows exactly how pale he is and has chosen not to mention it.",
        "Ben occupies a chair two down with one forearm strapped and the expression of a man trying to calculate whether he can still help move equipment if nobody catches him leaving. Jordan is blocking the exit in conversation with an airbase supervisor who very clearly underestimated them and is paying in full.",
        "If the runway did what it was supposed to do, everyone here now knows something new about you. If it did what these chapters are really about, you know something new about them too.",
        "The medic checks your pupils with a penlight. \"Nausea?\"",
        "\"Only emotionally.\"",
        "\"No jokes. Actual answer.\"",
        "\"Some.\"",
        "She writes it down with no visible appreciation for your charm.",
        "The privacy curtain near Vance stirs. Camille steps out first. Her eyes find you immediately. Whatever happened on the runway, whatever it confirmed or complicated between you, the line of her mouth says she has already sorted it into action items, concerns, and one category she does not intend to name in public. Piper sees the look and laughs once under her breath from the end of the corridor. Julian notices both of them noticing and looks delightfully miserable about being right that none of you are subtle under stress.",
        "This is what continuity looks like now. Not callbacks. Convergence.",
        "Theo finally wins his argument, or at least exhausts the tech into surrender, and crosses to you. He stops just short of crowding your chair. \"How bad?\" he asks.",
        "There are three or four honest answers to that question and only one of them is about pain.",
        "Before you can give one, Piper peels herself out of the blanket and crosses half the corridor in a few fast steps, silver foil swishing around her like she was knighted by emergency equipment. \"No,\" she says to Theo. \"I asked first with my eyes.\"",
        "\"You asked with a threat display.\"",
        "\"It was a caring threat display.\"",
        "Julian, from the cabinet, says, \"This is the least romantic group of body language I've ever found extremely revealing.\"",
        "Ben laughs once and regrets it.",
        "The whole corridor shifts around you. Not gently. Not cruelly. Just honestly. If the last chapters built attraction, loyalty, friction, protectiveness, dependence, and the occasional disaster of all five at once, this is the moment those threads all start pulling in the same place.",
        "Vance steps closer, stopping where command can still technically call itself detached. \"You're done for the hour,\" he says.",
        "\"Done,\" Piper repeats. \"He says that like time is real.\"",
        "\"It is if medical writes it on a form.\"",
        "Camille folds her arms. \"Then perhaps medical should write faster.\"",
        "The medic with the clipboard does not even blink. \"Perhaps trainees should stop behaving like durability is a personality.\"",
        "That shuts everyone up for almost two whole seconds.",
        "You look down at the cold pack sweating into your palm. The body cost is real. The room's attention is real. The impossible and inconvenient truth is that neither one cancels the other. People can want you, trust you, fear you, need you, be angry with you, and still ask whether your hands are shaking. Sometimes especially then.",
        "Julian pushes off the cabinet. \"I propose,\" he says, \"that once medical is done deciding whether we remain marketable, we relocate this extremely tense little collective to somewhere with less fluorescent honesty.\"",
        "\"Kitchen,\" Ben says immediately.",
        "\"Of course kitchen,\" Jordan calls without turning from the supervisor. \"This cohort processes every emotional event like a found family lawsuit.\"",
        "Piper points at them. \"See? That. I'm keeping that.\"",
        "The medic finally steps back. \"You're stable enough to walk,\" she says. \"Emotionally, I'm not billing.\"",
        "The corridor exhales. Not relief. Not yet. The kind of temporary release that only happens when everyone agrees to postpone the scarier conversation by moving it somewhere with chairs and worse lighting."
      ],
      "choices": [
        {
          "text": "Tell Theo and Piper both to stop hovering and then immediately undermine yourself by asking them not to go far.",
          "effects": [
            {
              "type": "flag",
              "key": "add_c08_afterburn_corridor_choice_1",
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
          "text": "Meet Camille's look first and ask whether the corridor version of you is still precise enough for her standards.",
          "effects": [
            {
              "type": "flag",
              "key": "add_c08_afterburn_corridor_choice_2",
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
          "text": "Ask Ben if he's coming to the kitchen and make it clear you mean him, not just the group.",
          "effects": [
            {
              "type": "flag",
              "key": "add_c08_afterburn_corridor_choice_3",
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
          "text": "Tell Julian he is absolutely not allowed to describe any of this as marketable again unless he is willing to sit beside you while he does it.",
          "effects": [
            {
              "type": "flag",
              "key": "add_c08_afterburn_corridor_choice_4",
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
        }
      ]
    },
    "add_c09_before_pizza_threshold": {
      "chapter": 9,
      "title": "Before Pizza Threshold",
      "location": "Residence Kitchen / Common Table",
      "background": "aegis",
      "focus": "Ensemble",
      "text": [
        "The kitchen is louder tonight than it has ever been and somehow more careful. Cabinet doors open and close with a restraint nobody showed during the first weeks. Pizza boxes sweat grease onto the counter beside somebody's expensive takeout and a six-pack that absolutely did not arrive through official channels. The room smells like tomato, detergent, and the last thin stretch of pretending tomorrow is only a ceremony.",
        "Piper is perched backward on a chair, one sneaker on the rung, flicking bottle caps at a paper cup and pretending the game matters more than the room. Camille is at the end of the counter with a folded stack of contracts and a pen she has clearly weaponized against bad wording. Julian has somehow turned carrying plates into a social function. Theo is leaning against the fridge with that tight, thoughtful stillness that means his brain has built three contingency plans and hates all of them on moral grounds.",
        "Ben reaches past you for paper towels and mutters that the kitchen was this clean for maybe four minutes after orientation and never again. Jordan is on the arm of the couch, scrolling messages with the expression of someone filtering rumors from sentiment in real time. The whole cohort is fraying around the edges in recognizably human ways: tired, overfond, not ready to say that out loud.",
        "Nobody calls this a goodbye dinner. That would make it too official and too sad. Instead it has the atmosphere of a storm shelter everybody chose on purpose. People drift in, steal slices, drift out. The center of gravity keeps snapping back to the same six bodies because whether or not Aegis signs off on your futures, this has become a shape your lives know how to hold.",
        "Piper points at the unopened stack of forms in Camille's hands. \"If you make us do paperwork before eating, I'm setting one of your folders on fire. Metaphorically if possible. Literally if morale requires it.\" ",
        "\"The phrase morale requires it should never be attached to arson,\" Theo says.",
        "\"Counterpoint: many institutional reforms would improve with a more committed relationship to morale,\" Julian says as he slides a plate your way.",
        "\"The line between reform and felony remains important,\" Camille says without looking up.",
        "Theo finally pushes off the fridge and takes the forms from Camille long enough to sort them into two stacks: practical and predatory. Camille allows this because she knows he is right and because tonight everyone is granting each other one extra inch of tenderness disguised as efficiency. Julian watches the exchange with a tired smile. Piper tracks your face instead, as if tonight she is more interested in what the room is doing to you than in winning whatever private game she started three bottle caps ago.",
        "The whole thing should be light. It almost is. But every joke tonight has a second shape under it. The under-shape is simple: tomorrow you stop being a contained problem and become a person with options, witnesses, and consequences. Everyone here knows it. Everyone here is handling that knowledge in their own accent."
      ],
      "choices": [
        {
          "text": "Tell them the room feels less like a send-off and more like a stress fracture everybody is trying to laugh through.",
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
              "key": "c09_named_the_room",
              "value": true
            }
          ],
          "next": "c09_graduation_eve"
        },
        {
          "text": "Ask who is actually planning to sleep tonight instead of hallucinating resilience until morning.",
          "effects": [
            {
              "type": "relationship",
              "key": "Julian",
              "delta": 1
            },
            {
              "type": "relationship",
              "key": "Camille",
              "delta": 1
            },
            {
              "type": "flag",
              "key": "c09_asked_about_sleep",
              "value": true
            }
          ],
          "next": "c09_graduation_eve"
        },
        {
          "text": "Lean against the counter and admit this is the first place that has felt like home by accident.",
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
              "key": "c09_named_home",
              "value": true
            }
          ],
          "next": "c09_graduation_eve"
        }
      ]
    },
    "add_c09_after_messages_table": {
      "chapter": 9,
      "title": "After Messages Table",
      "location": "Residence Lounge",
      "background": "aegis",
      "focus": "Ensemble",
      "text": [
        "The lounge fills in waves after the last messages go out. Nobody announces that this is the real gathering; it just becomes true by accumulation. A blanket appears over the back of the couch. Somebody steals the good lamp from the corner. Julian comes in with glasses that suggest ambition. Theo comes in without the tablet, which everyone correctly recognizes as an event. Camille arrives last and somehow makes lateness look like standards. Piper is already half sprawled across the armchair, shoes off, daring the room to admit anyone is sentimental.",
        "Tonight the air between you has layers. The first layer is noise: jokes, glass clinks, the low relief of people who are exhausted enough to stop curating every reaction. The second layer is memory. Intake. The labs. The hallway blood you pretended not to see. The fights you survived and the smaller cruelty of paperwork after them. The times one of you was sharp, or kind, or impossible, and everyone else had to build around it. The third layer is tomorrow.",
        "\"For legal reasons, I think at least one of you should become respectable,\" Jordan says from the floor.",
        "\"Absolutely not,\" Piper says.",
        "\"Define respectable,\" Julian says at the same time Theo asks, \"For whose legal reasons?\" ",
        "\"If anyone in this room becomes respectable in the ordinary sense, I will assume they were replaced,\" Camille says while pouring herself exactly half a drink.",
        "\"Vance would call that progress,\" Ben says from the kitchenette.",
        "\"Vance would call that documented,\" Jordan replies.",
        "The room breaks around the joke and reforms warmer. You realize, with the strange clarity that comes only when something is about to end, that this is what the group became while nobody was looking straight at it: not harmony, exactly. Not found family in the cheap universal sense either. Something sharper, choosier, more adult. A configuration of people who learned each other's damage patterns and kept showing up anyway.",
        "\"Okay,\" Piper says, tipping her head toward you. \"Last-night rule. No one gets to leave this room emotionally vague on purpose.\" ",
        "\"That sounds coercive,\" Theo says.",
        "\"Correct.\" ",
        "\"I support it entirely as long as I reserve the right to phrase myself beautifully,\" Julian says.",
        "\"He was always going to demand an exception,\" Camille says over the rim of her glass.",
        "\"He is an exception,\" Piper says. \"Several, medically.\" ",
        "The banter buys the room a landing strip. What it does not buy is escape. Everyone is too aware, too tired, too changed for that. This is the moment before people peel off into private conversations or deliberate solitude or one last terrible decision in a hallway. The group knows it. The group is pretending not to know it for each other's comfort.",
        "This is what the place gave you that none of the handbooks could admit to promising: adults sharp enough to wound, loyal enough to matter, and strange enough to keep each other from calcifying. The group has never been simple. That is why it survived. Simpler people would have split cleaner or stayed shallow. This version learned how to absorb contradiction without pretending contradiction was the same thing as doom.",
        "You can feel the routes branching under the floorboards: friendship spoken clearly, romance named or dodged, old tension granted dignity, promises made carefully enough to survive daylight. The chapter does not need fireworks. It needs courage with witnesses."
      ],
      "choices": [
        {
          "text": "Tell the room that whatever happens tomorrow, none of this counts as disposable just because the institution calls it complete.",
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
              "key": "c09_group_not_disposable",
              "value": true
            }
          ],
          "next": "c09_three_before_roof"
        },
        {
          "text": "Aim the honesty smaller: say the room got under your skin and you are done pretending otherwise.",
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
              "type": "relationship",
              "key": "Theo",
              "delta": 1
            },
            {
              "type": "flag",
              "key": "c09_room_under_skin",
              "value": true
            }
          ],
          "next": "c09_three_before_roof"
        },
        {
          "text": "Deflect with a smile, but promise one real thing: nobody here will need to guess whether they mattered to you.",
          "effects": [
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
              "type": "relationship",
              "key": "Piper",
              "delta": 1
            },
            {
              "type": "flag",
              "key": "c09_no_guessing",
              "value": true
            }
          ],
          "next": "c09_three_before_roof"
        }
      ]
    },
    "add_c09_final_shared_kitchen": {
      "chapter": 9,
      "title": "Final Shared Kitchen",
      "location": "Residence Kitchen Late",
      "background": "aegis",
      "focus": "Ensemble",
      "text": [
        "The kitchen is almost empty by the time the last private conversations burn themselves down into something survivable. One box of cold pizza remains on the counter under foil that fooled nobody. The overhead light above the sink has been switched off, leaving the room lit by the hood over the stove and the blue spill from the vending machines out in the hall. It turns the whole place into aftercare for an institution.",
        "Piper comes in first or last depending on your route order; with her, time on final nights is less a line than a dare. Camille arrives with two glasses she definitely did not steal and will never admit were borrowed. Julian appears like the room requested better lighting. Theo drifts in with his shoulders slightly lower than usual, as if honesty took some weight off by replacing it with a different one. No one remarks on who has spoken to whom. The mercy is intentional.",
        "Ben is there in socks, leaning against the fridge. Jordan sits cross-legged on the counter because rules are weakest after midnight. Even Rina passes through the doorway long enough to roll her eyes at all of you and take the last clean bottle from the rack. For one minute the whole cohort configuration is visible at once, not as statistics or pairings or favorite routes, but as the final shape of a year that did not know what it was making until now.",
        "Nobody gives a speech. That would cheapen it. Instead the room behaves like memory while you are still standing inside it. Someone laughs. Someone swears softly at a bent paper plate. Someone asks a practical question about time in the morning and gets three different answers delivered with incompatible confidence. The humanity of it is almost unbearable.",
        "Julian breaks the silence first. \"I would like it noted that if any of you become famous, I expect selective revisionism about how often I saved this group's collective dignity.\" ",
        "\"You improved presentation. That is not identical,\" Camille says.",
        "\"Cruel,\" Julian murmurs, hand to chest. \"And after everything.\" ",
        "\"She said not identical, not nonexistent. Try gratitude before martyrdom for once,\" Theo says.",
        "Julian stares at him. Piper nearly chokes laughing. \"Oh my God. He got hot when he started using the knife on purpose.\" ",
        "Theo covers his face with one hand. Ben laughs loud enough to startle himself. Even Camille's mouth gives up half a smile. The room loosens one final notch.",
        "Then the moment settles. The real one. The one under the joke. You look around and it hits with full force that these people will not belong to one building tomorrow. Whatever remains between you will remain because someone chose it and then kept choosing.",
        "Camille sets one of the glasses in front of you without asking if you want it. Julian fixes the foil over the pizza box with needless care. Piper steals half a crust from Ben's plate and takes the insult that follows as proof of affection. Theo straightens a stack of disposable cups nobody was offended by until he touched them. Tiny motions, all of them. Domestic in the accidental, unrepeatable way that hurts more because you know how rare it is.",
        "The beauty of that is obvious. So is the risk. You set your hand on the counter, grounding yourself in cheap laminate, cold air, leftover grease, and the fact that for all Aegis's paperwork, this may be the truest thing it ever produced: not obedience, not certainty, but a set of people who learned exactly how much damage they could do to each other and still reached for honesty anyway."
      ],
      "choices": [
        {
          "text": "Tell them the future can get strange if it wants, but you are done pretending this room was temporary in any way that matters.",
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
              "key": "c09_kitchen_not_temporary",
              "value": true
            }
          ],
          "next": "c09_sleep_or_not"
        },
        {
          "text": "Keep it simple: say you loved this place badly and these people better, and let them decide what to do with that.",
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
              "key": "c09_loved_badly",
              "value": true
            }
          ],
          "next": "c09_sleep_or_not"
        },
        {
          "text": "Say nothing dramatic. Just stay until the room empties, helping stack plates and making that your final promise.",
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
              "key": "c09_stayed_to_stack",
              "value": true
            }
          ],
          "next": "c09_sleep_or_not"
        }
      ]
    },
    "add_c10_morning_courtyard_pulse": {
      "chapter": 10,
      "title": "The Courtyard Before The Stage",
      "location": "Courtyard",
      "background": "aegis",
      "focus": "Ensemble",
      "text": [
        "The courtyard is too bright for a day that is technically ceremonial. Ocean light bounces off the glass and the pale stone so hard it makes everyone look overexposed, like the campus is trying to wash the last year into something clean enough for brochures. It does not succeed. The place still carries its real smells beneath the polish: salt, coffee, old electrical burn from the training wing, detergent from the residence hall, the faint medicinal sterility that seems to live permanently under the Aegis Point air system no matter how many windows they crack.",
        "Graduation chairs are arranged in disciplined rows out on the lawn beyond the archway. Staff keep crossing back and forth with tablets, clipboards, rolled programs, badges, and the particular face adults make when they are pretending ceremony is a form of control instead of a socially acceptable panic attack. The cohort has broken into familiar gravitational patterns without discussing it. Piper is near the side doors because of course she found the nearest exit first. Camille stands in a slice of shade with a folder under one arm and the look of a woman who has already corrected two errors no one else noticed. Julian has somehow made leaning against a pillar look like an editorial decision. Theo is reading a program as if enough scrutiny will expose where the danger is hiding inside the font.",
        "Ben is helping carry boxes of bottled water from a service cart because someone asked once and now the institution has mentally filed him under useful for heavy things unless reminded otherwise. Jordan is posted against the admin wall with a lanyard between their fingers and the expression of someone tracking seven quiet social implosions for quality assurance. Nobody is acting casual well, which is almost comforting. Graduation has done what major thresholds always do: it has reduced every coping style to its clearest, least-deniable silhouette.",
        "You are not the same person who arrived here. That fact is visible even before anyone says your name. Some of it lives in the obvious places: the way staff look at you now, the way certain doors open without paperwork, the difference between being escorted and being expected. Some of it lives in subtler evidence. The core four no longer orbit you like strangers deciding whether to invest. They hold position like people with history. The shape of that history changes depending on what you have done with it, but it is there. Nobody in this courtyard is meeting you for the first time anymore.",
        "Piper catches your eye first and flicks two fingers in a private gesture that could mean come here, don't get weird, or if you let this become emotionally sincere in public I will kill you. Julian lifts the folded ceremony program in a tiny salute. Theo glances up, sees you seeing him, then deliberately stops hiding behind the page. Camille takes one measured step toward the center of the courtyard and does not call your name. She never has to. The whole morning has the texture of a held breath no one wants to be responsible for releasing.",
        "There is no single correct place to begin. That feels earned. Early on, choices at Aegis often meant picking the least bad hallway. Today the choices feel stranger and more intimate than that. Who you approach first changes the tone. What you say first changes the day. Even the staff can feel it. Vance is out by the admin steps talking to someone from central, but his gaze cuts across the courtyard once and settles on you for half a second longer than protocol requires. It is not surveillance anymore. It is witness."
      ],
      "choices": [
        {
          "text": "Go to Piper by the side door before she turns the exit into a personality test.",
          "effects": [
            {
              "type": "relationship",
              "key": "Piper",
              "delta": 1
            },
            {
              "type": "flag",
              "key": "add_c10_morning_courtyard_pulse_1",
              "value": true
            }
          ],
          "next": "c10_chat_piper_hall"
        },
        {
          "text": "Cross to the courtyard shade and see what Camille has already corrected for everyone else.",
          "effects": [
            {
              "type": "relationship",
              "key": "Camille",
              "delta": 1
            },
            {
              "type": "flag",
              "key": "add_c10_morning_courtyard_pulse_2",
              "value": true
            }
          ],
          "next": "c10_chat_camille_courtyard"
        },
        {
          "text": "Take the program from Julian and let him insult the ceremony on aesthetic grounds.",
          "effects": [
            {
              "type": "relationship",
              "key": "Julian",
              "delta": 1
            },
            {
              "type": "flag",
              "key": "add_c10_morning_courtyard_pulse_3",
              "value": true
            }
          ],
          "next": "c10_chat_julian_admin"
        },
        {
          "text": "Ask Theo what the program is hiding if he is reading it like a threat assessment.",
          "effects": [
            {
              "type": "relationship",
              "key": "Theo",
              "delta": 1
            },
            {
              "type": "flag",
              "key": "add_c10_morning_courtyard_pulse_4",
              "value": true
            }
          ],
          "next": "c10_chat_theo_courtyard"
        },
        {
          "text": "Stay in the middle long enough to let the whole room react to you before choosing a direction.",
          "effects": [
            {
              "type": "flag",
              "key": "add_c10_morning_courtyard_pulse_5",
              "value": true
            }
          ],
          "next": "c10_hub_graduation"
        }
      ]
    },
    "add_c10_backstage_core_four": {
      "chapter": 10,
      "title": "Backstage, Four Directions",
      "location": "Backstage Corridor",
      "background": "graduation",
      "focus": "Ensemble",
      "text": [
        "Backstage is all black curtains, rolling cases, clipped whispers, and the stale heat that accumulates behind official performances. From the audience side, Graduation Hall looked finished: flowers in place, lights flattering, the speech landing where it was trained to land. Back here it is wires, water bottles, abandoned cue sheets, a tech rolling up extra cable with the thousand-yard stare of someone who has survived six institutional events in one fiscal quarter. The glamour is honest only from one side.",
        "Your folder is under your arm now. It weighs almost nothing and still manages to feel heavier than some injuries. Around you, the core four have instinctively reassembled after the stage traffic split the cohort into photographs, handshakes, and procedural congratulations. Piper arrived first, still buzzing too hot to stand still. Camille peeled off from a conversation with three donors who had mistaken self-possession for accessibility. Julian escaped a parent cluster that wanted to adopt him on sight. Theo made it through Vance, two staffers, and a surprise aunt from someone's family unit without visibly dissociating, which counts as operational excellence by any humane metric.",
        "For a few seconds nobody speaks. The silence isn't empty. It is the first private silence the five of you have had since the ceremony made everything public. The building hums through the walls. Applause leaks faintly from the hall as another name is called from a later section. Somewhere nearby, a photographer is arguing about sight lines with a staff coordinator in tones that imply both of them believe history depends on a centerpiece.",
        "Piper reaches out first and taps the edge of your folder. \"So that's it,\" she says. \"They put a grade on you and now society happens.\"",
        "\"That was almost a real sentence,\" Julian says.",
        "\"I'm evolving in front of you. Show respect.\"",
        "Camille sets her own folder on a rolling case as if it might contaminate the rest of the room with institutional optimism. \"The grades matter less than the permissions attached to them.\"",
        "\"That is the bleakest possible graduation quote,\" Theo says.",
        "\"It's also correct.\"",
        "Julian looks from one face to the next and then to you, the performance version of his charm briefly absent. \"I hate to be the one who says it, but there is no elegant way out of this moment. So. We should decide whether we are speaking like colleagues, accomplices, or people who will actually remain in one another's lives once the scheduling apps lose jurisdiction.\"",
        "Trust Julian to drag sentiment into the open by insulting its wardrobe. The corridor goes quiet around the line. Even Piper stills. Camille does not look away. Theo's mouth opens like he had three possible interventions prepared and none of them survive contact with the actual question. It lands hardest because all of you know the answer is not singular. The relationships here do not share one category. They never did.",
        "The whole year is in the room at once. The intake fear. The stupid jokes. The first time someone stayed in med. The worse time someone stayed in med. The arguments. The field pressure. The people who saw you ugly and stayed. The people you disappointed and still had to stand next to. The nights that made friendship feel too small a word and romance feel too neat a word and loyalty feel like the only honest one for a while. Backstage, in the half-dark behind the ceremony, all of that refuses summary.",
        "Maybe that is why the moment feels bearable. No one here is asking for summary. They are asking whether the thread holds when the institution stops holding it for you."
      ],
      "choices": [
        {
          "text": "Tell them whatever happens after today, this does not become a nostalgia story. You mean to keep these people in your actual life.",
          "effects": [
            {
              "type": "flag",
              "key": "c10_group_named",
              "value": true
            },
            {
              "type": "flag",
              "key": "add_c10_backstage_core_four_1",
              "value": true
            }
          ],
          "next": "c10_goodbyes"
        },
        {
          "text": "Say the truth plain: some of you are friends, some are more dangerous than that, and none of it is accidental anymore.",
          "effects": [
            {
              "type": "flag",
              "key": "c10_group_named",
              "value": true
            },
            {
              "type": "flag",
              "key": "add_c10_backstage_core_four_2",
              "value": true
            }
          ],
          "next": "c10_goodbyes"
        },
        {
          "text": "Deflect just enough to survive it: tell them if anyone cries backstage, the official narrative dies with them.",
          "effects": [
            {
              "type": "flag",
              "key": "c10_group_named",
              "value": true
            },
            {
              "type": "flag",
              "key": "add_c10_backstage_core_four_3",
              "value": true
            }
          ],
          "next": "c10_goodbyes"
        }
      ]
    },
    "add_c10_restaurant_anteroom": {
      "chapter": 10,
      "title": "Before The Candles Mean Anything",
      "location": "Private Restaurant Anteroom",
      "background": "city",
      "focus": "Ensemble",
      "text": [
        "The private restaurant is quieter than the hall was, which only makes the emotional acoustics more dangerous. Warm wood, low light, discreet staff, cutlery arranged with enough care to threaten intimacy by architecture alone. The anteroom outside the reserved table holds the five of you in a moment that still has one foot in public ceremony and one foot in whatever comes next. Jackets come off. Sleeves get rolled. Graduation folders are set aside like documents that have done everything they can do for the day.",
        "Julian is the only one who looks instantly plausible in a room this expensive, which should be annoying and is instead useful. Camille scans the table placements with one glance and visibly approves of the sight lines. Theo has already identified the two exits and the probable path a server will take with hot plates. Piper is pretending the mirror near the entry isn't catching all of you at once. In the reflection, the group looks almost unreal: too composed, too marked by history, too obviously on the edge of becoming something the institution did not fully script.",
        "No one sits immediately. That is telling. Dinner has not started yet; the truth has. There is a difference. The room holds all the unresolved categories you have been carrying: friendship that stopped being simple, attraction that survived stress, loyalty with teeth, affection that went public in private ways long before any official ending acknowledged it. A stranger would read a stylish gathering of graduates. A better observer would know the atmosphere is denser than that.",
        "Piper hooks a thumb under the collar of her jacket and says, \"If anyone says the phrase new chapter, I'm leaving money on the table and committing a misdemeanor.\"",
        "\"That would be theft adjacent, not technically a misdemeanor,\" Theo says automatically.",
        "\"I love that even now your idea of seduction is legal precision,\" Julian says.",
        "Camille pulls her chair out but does not sit. \"Can we have one conversation in this group that does not begin by pretending the obvious thing is avoidable?\"",
        "The obvious thing. Nobody asks her to define it. Nobody needs to. That is the relief and terror of this room. After months of orbit, impact, repair, and denial at varying levels of craftsmanship, the five of you have reached the stage where naming becomes possible and therefore dangerous. The restaurant staff have the decency to disappear for another minute. Even the candles seem tactful enough not to flicker too loudly.",
        "You are tired in the deep way that follows not just physical strain but sustained significance. Maybe that is why the honesty available in this room feels less impossible than it would have three months ago. Aegis gave all of you pressure, language, classification, and weirdly decent coffee. It also gave you enough repeated proximity to make evasions expensive.",
        "Whatever comes out at this table will not decide everything. But it will decide the tone of the future: what is admitted, what is chosen, what is offered, what is left elegantly unresolved. That is more than enough weight for one set of candles."
      ],
      "choices": [
        {
          "text": "Sit and tell them none of you came all this way to become polite strangers now.",
          "effects": [
            {
              "type": "flag",
              "key": "c10_group_named",
              "value": true
            },
            {
              "type": "flag",
              "key": "add_c10_restaurant_anteroom_1",
              "value": true
            }
          ],
          "next": "c10_dinner_reveal"
        },
        {
          "text": "Tell them the worst possible version of tonight would be acting like none of this matters because the room is expensive.",
          "effects": [
            {
              "type": "flag",
              "key": "c10_group_named",
              "value": true
            },
            {
              "type": "flag",
              "key": "add_c10_restaurant_anteroom_2",
              "value": true
            }
          ],
          "next": "c10_dinner_reveal"
        },
        {
          "text": "Try to save everyone with humor one more time and ask which one of them is most likely to get banned from a place like this first.",
          "effects": [
            {
              "type": "flag",
              "key": "c10_group_named",
              "value": true
            },
            {
              "type": "flag",
              "key": "add_c10_restaurant_anteroom_3",
              "value": true
            }
          ],
          "next": "c10_dinner_reveal"
        }
      ]
    },
    "add_c01_intake_overlap_to_orientation": {
      "chapter": 1,
      "title": "The Room Watches Back",
      "location": "Aegis Intake Hall",
      "background": "aegis",
      "focus": "Seth",
      "text": [
        "The intake hall is too clean to be comforting. The floors gleam without warmth. The walls are the kind of neutral color chosen by committee and approved by three different departments whose only common language is liability. The room smells faintly of coffee, printer heat, and somebody's attempt at calming citrus air freshener. It is a room designed to suggest order to people who have very recently reminded the world that order is conditional.",
        "No one here is loud. That would almost be easier. Instead there is the clipped, professionally softened rhythm of adults trying not to say the obvious thing out loud: none of you are here because your lives were going smoothly.",
        "A pair of staff at the front desk speak in careful, practiced tones to a broad-shouldered guy signing his name hard enough to dent the form. A medic wheels a cart past with the casual speed of someone who has learned to move fast without looking like panic. At the security glass, a woman in a navy blazer watches the room with her arms folded and a stillness that reads less like patience than readiness.",
        "And then there is the cluster that keeps pulling your eye.",
        "The blonde in the red jacket has a grin built for bad ideas and the posture of someone who has never once believed she would be the one to pay for them in full. She seems to occupy more space than her body technically should, all momentum even while standing still. Beside her is a woman in black so controlled she makes the clipboards look unruly. Her tablet is angled against one palm. Her gaze lifts only in slices, but each glance lands with unnerving precision, as if she does not look at anything without deciding what category it belongs in.",
        "The dark-haired man near them looks polished in a way that does not feel accidental. Not overdressed. Not showy. Just exact. He steps half a pace into an awkward lull between a staff member and another trainee, says something too low to catch, and the staffer's shoulders loosen instantly. Whatever he said, it was offered with perfect timing and no visible strain. He has the kind of ease that makes you suspicious on principle.",
        "The fourth member of the little gravity well is the easiest to miss if you are only looking for charisma. He is not striking because he is trying to be. He is striking because every line of him suggests contained attention. His eyes move from exits to hands to distance between bodies to the overhead cameras and back again like his brain has accepted that this is a room full of variables pretending to be furniture.",
        "The polished man catches you noticing him and tips his chin in brief acknowledgment, as if the two of you have already agreed this place deserves skepticism. The wary one follows the movement, sees where your attention is, and pauses long enough to register that you were scanning the room instead of performing calm for the benefit of strangers.",
        "You do not hear the blonde approach. One moment she is across the room. The next she is by your shoulder, hands in her pockets, grin crooked.",
        "\"Good,\" she says, as if you have just passed a test you did not know you were taking. \"You have the face of someone who understands this building has teeth.\"",
        "Behind her, the woman with the tablet glances up again. The movement is minimal. The effect is not. The polished man is openly amused now. The wary one looks like he dislikes the fact that he is interested at all.",
        "No one has formally introduced themselves. Somehow that already feels less important than whatever happens in the next ten seconds."
      ],
      "choices": [
        {
          "text": "Answer dryly that buildings only get teeth from the people inside them.",
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
              "type": "relationship",
              "key": "Theo",
              "delta": 1
            },
            {
              "type": "stat",
              "key": "audacity",
              "delta": 1
            },
            {
              "type": "flag",
              "key": "c01_noticed_room",
              "value": true
            }
          ],
          "next": "c01_orientation"
        },
        {
          "text": "Keep your answer polite and neutral. First day is too early to volunteer a personality.",
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
              "key": "restraint",
              "delta": 1
            },
            {
              "type": "flag",
              "key": "c01_firstday_guarded",
              "value": true
            }
          ],
          "next": "c01_orientation"
        },
        {
          "text": "Ask which one of them already wants to know whether you're dangerous or useful.",
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
              "type": "stat",
              "key": "exposure",
              "delta": 1
            },
            {
              "type": "flag",
              "key": "c01_danger_or_useful",
              "value": true
            }
          ],
          "next": "c01_orientation"
        }
      ]
    },
    "add_c01_intake_overlap_to_shortcuts": {
      "chapter": 1,
      "title": "The Room Watches Back",
      "location": "Aegis Intake Hall",
      "background": "aegis",
      "focus": "Seth",
      "text": [
        "The intake hall is too clean to be comforting. The floors gleam without warmth. The walls are the kind of neutral color chosen by committee and approved by three different departments whose only common language is liability. The room smells faintly of coffee, printer heat, and somebody's attempt at calming citrus air freshener. It is a room designed to suggest order to people who have very recently reminded the world that order is conditional.",
        "No one here is loud. That would almost be easier. Instead there is the clipped, professionally softened rhythm of adults trying not to say the obvious thing out loud: none of you are here because your lives were going smoothly.",
        "A pair of staff at the front desk speak in careful, practiced tones to a broad-shouldered guy signing his name hard enough to dent the form. A medic wheels a cart past with the casual speed of someone who has learned to move fast without looking like panic. At the security glass, a woman in a navy blazer watches the room with her arms folded and a stillness that reads less like patience than readiness.",
        "And then there is the cluster that keeps pulling your eye.",
        "The blonde in the red jacket has a grin built for bad ideas and the posture of someone who has never once believed she would be the one to pay for them in full. She seems to occupy more space than her body technically should, all momentum even while standing still. Beside her is a woman in black so controlled she makes the clipboards look unruly. Her tablet is angled against one palm. Her gaze lifts only in slices, but each glance lands with unnerving precision, as if she does not look at anything without deciding what category it belongs in.",
        "The dark-haired man near them looks polished in a way that does not feel accidental. Not overdressed. Not showy. Just exact. He steps half a pace into an awkward lull between a staff member and another trainee, says something too low to catch, and the staffer's shoulders loosen instantly. Whatever he said, it was offered with perfect timing and no visible strain. He has the kind of ease that makes you suspicious on principle.",
        "The fourth member of the little gravity well is the easiest to miss if you are only looking for charisma. He is not striking because he is trying to be. He is striking because every line of him suggests contained attention. His eyes move from exits to hands to distance between bodies to the overhead cameras and back again like his brain has accepted that this is a room full of variables pretending to be furniture.",
        "The polished man catches you noticing him and tips his chin in brief acknowledgment, as if the two of you have already agreed this place deserves skepticism. The wary one follows the movement, sees where your attention is, and pauses long enough to register that you were scanning the room instead of performing calm for the benefit of strangers.",
        "You do not hear the blonde approach. One moment she is across the room. The next she is by your shoulder, hands in her pockets, grin crooked.",
        "\"Good,\" she says, as if you have just passed a test you did not know you were taking. \"You have the face of someone who understands this building has teeth.\"",
        "Behind her, the woman with the tablet glances up again. The movement is minimal. The effect is not. The polished man is openly amused now. The wary one looks like he dislikes the fact that he is interested at all.",
        "No one has formally introduced themselves. Somehow that already feels less important than whatever happens in the next ten seconds."
      ],
      "choices": [
        {
          "text": "Answer dryly that buildings only get teeth from the people inside them.",
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
              "type": "relationship",
              "key": "Theo",
              "delta": 1
            },
            {
              "type": "stat",
              "key": "audacity",
              "delta": 1
            },
            {
              "type": "flag",
              "key": "c01_noticed_room",
              "value": true
            }
          ],
          "next": "c01_shortcuts"
        },
        {
          "text": "Keep your answer polite and neutral. First day is too early to volunteer a personality.",
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
              "key": "restraint",
              "delta": 1
            },
            {
              "type": "flag",
              "key": "c01_firstday_guarded",
              "value": true
            }
          ],
          "next": "c01_shortcuts"
        },
        {
          "text": "Ask which one of them already wants to know whether you're dangerous or useful.",
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
              "type": "stat",
              "key": "exposure",
              "delta": 1
            },
            {
              "type": "flag",
              "key": "c01_danger_or_useful",
              "value": true
            }
          ],
          "next": "c01_shortcuts"
        }
      ]
    },
    "add_c01_intake_overlap_to_camille": {
      "chapter": 1,
      "title": "The Room Watches Back",
      "location": "Aegis Intake Hall",
      "background": "aegis",
      "focus": "Seth",
      "text": [
        "The intake hall is too clean to be comforting. The floors gleam without warmth. The walls are the kind of neutral color chosen by committee and approved by three different departments whose only common language is liability. The room smells faintly of coffee, printer heat, and somebody's attempt at calming citrus air freshener. It is a room designed to suggest order to people who have very recently reminded the world that order is conditional.",
        "No one here is loud. That would almost be easier. Instead there is the clipped, professionally softened rhythm of adults trying not to say the obvious thing out loud: none of you are here because your lives were going smoothly.",
        "A pair of staff at the front desk speak in careful, practiced tones to a broad-shouldered guy signing his name hard enough to dent the form. A medic wheels a cart past with the casual speed of someone who has learned to move fast without looking like panic. At the security glass, a woman in a navy blazer watches the room with her arms folded and a stillness that reads less like patience than readiness.",
        "And then there is the cluster that keeps pulling your eye.",
        "The blonde in the red jacket has a grin built for bad ideas and the posture of someone who has never once believed she would be the one to pay for them in full. She seems to occupy more space than her body technically should, all momentum even while standing still. Beside her is a woman in black so controlled she makes the clipboards look unruly. Her tablet is angled against one palm. Her gaze lifts only in slices, but each glance lands with unnerving precision, as if she does not look at anything without deciding what category it belongs in.",
        "The dark-haired man near them looks polished in a way that does not feel accidental. Not overdressed. Not showy. Just exact. He steps half a pace into an awkward lull between a staff member and another trainee, says something too low to catch, and the staffer's shoulders loosen instantly. Whatever he said, it was offered with perfect timing and no visible strain. He has the kind of ease that makes you suspicious on principle.",
        "The fourth member of the little gravity well is the easiest to miss if you are only looking for charisma. He is not striking because he is trying to be. He is striking because every line of him suggests contained attention. His eyes move from exits to hands to distance between bodies to the overhead cameras and back again like his brain has accepted that this is a room full of variables pretending to be furniture.",
        "The polished man catches you noticing him and tips his chin in brief acknowledgment, as if the two of you have already agreed this place deserves skepticism. The wary one follows the movement, sees where your attention is, and pauses long enough to register that you were scanning the room instead of performing calm for the benefit of strangers.",
        "You do not hear the blonde approach. One moment she is across the room. The next she is by your shoulder, hands in her pockets, grin crooked.",
        "\"Good,\" she says, as if you have just passed a test you did not know you were taking. \"You have the face of someone who understands this building has teeth.\"",
        "Behind her, the woman with the tablet glances up again. The movement is minimal. The effect is not. The polished man is openly amused now. The wary one looks like he dislikes the fact that he is interested at all.",
        "No one has formally introduced themselves. Somehow that already feels less important than whatever happens in the next ten seconds."
      ],
      "choices": [
        {
          "text": "Answer dryly that buildings only get teeth from the people inside them.",
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
              "type": "relationship",
              "key": "Theo",
              "delta": 1
            },
            {
              "type": "stat",
              "key": "audacity",
              "delta": 1
            },
            {
              "type": "flag",
              "key": "c01_noticed_room",
              "value": true
            }
          ],
          "next": "c01_camille_first"
        },
        {
          "text": "Keep your answer polite and neutral. First day is too early to volunteer a personality.",
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
              "key": "restraint",
              "delta": 1
            },
            {
              "type": "flag",
              "key": "c01_firstday_guarded",
              "value": true
            }
          ],
          "next": "c01_camille_first"
        },
        {
          "text": "Ask which one of them already wants to know whether you're dangerous or useful.",
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
              "type": "stat",
              "key": "exposure",
              "delta": 1
            },
            {
              "type": "flag",
              "key": "c01_danger_or_useful",
              "value": true
            }
          ],
          "next": "c01_camille_first"
        }
      ]
    }
  });
})();
/* AUTHORING_PACKS_DEEPENING_END */
