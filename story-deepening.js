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
            "Commandant Vance passes through the glass-walled office beyond processing. She does not stop. She does not need to. Her glance lands once, sharp and brief, and you understand that the file has already been read by someone who thinks in contingencies."
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
            "Vance stands with a tablet under one arm, watching residents finish their runs. She does not look impressed by spectacle. She looks interested in recovery time, in how quickly a resident stops after success, in whether their eyes seek applause or exits.",
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
            makeChoice("Ask what Vance would call this if she saw it.", [
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
            "Vance reviews the facts without raising her voice. That makes them worse. External hostile contact. Targeted intelligence. Unclear leak vector. Unknown escalation ceiling. You sit under fluorescent lights while the adults in charge decide which category of danger you have become.",
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
            "Vance gives speeches the way some people handle blades: carefully, with no wasted movement. She talks about responsibility, integration, restraint, public trust. She does not say fear. She does not say money. She does not say that powerful adults become political facts the moment they step outside supervised walls.",
            "When your name is called, the walk to the stage feels longer than the building. The folder is heavier than paper should be.",
            "Vance holds your eye as she hands it over. Whatever she thinks of your choices, she knows they were choices. That is not forgiveness. It might be respect."
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
            makeChoice("Ask Vance quietly whether the recommendation is hers or Aegis's.", [
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
