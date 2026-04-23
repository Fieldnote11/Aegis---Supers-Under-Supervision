(function () {
  "use strict";

  const STORY = window.AEGIS_STORY;
  const SAVE_PREFIX = "aegis-choice-game";
  const AUTO_KEY = `${SAVE_PREFIX}:autosave`;
  const THEME_KEY = `${SAVE_PREFIX}:theme`;
  const SLOT_KEY = (slot) => `${SAVE_PREFIX}:slot:${slot}`;
  const POWER_THRESHOLDS = [0, 4, 9, 16, 25, 36, 50, 66, 84, 105];
  const START_TIME_MINUTES = 8 * 60;
  const FATIGUE_WARNING = 8;
  const FATIGUE_HARD_WARNING = 11;

  const GENDERS = [
    { id: "male", label: "Male" },
    { id: "female", label: "Female" },
    { id: "neutral", label: "Neutral" }
  ];

  const PRONOUNS = [
    { id: "he", label: "He/Him", subject: "he", object: "him", possessive: "his" },
    { id: "she", label: "She/Her", subject: "she", object: "her", possessive: "her" },
    { id: "they", label: "They/Them", subject: "they", object: "them", possessive: "their" }
  ];

  const NPC_DIMENSIONS = ["trust", "attraction", "respect", "friction", "concern"];
  const MAIN_NPCS = ["Piper", "Camille", "Julian", "Theo"];
  const ROMANCE_FLAG_MAP = {
    piperRomance: ["Piper", "Committed"],
    piperSlowBurn: ["Piper", "Slow burn"],
    piperTrustedPartner: ["Piper", "Trusted partner"],
    piperCommitted: ["Piper", "Committed"],
    piperFinalClaim: ["Piper", "Committed"],
    camilleRomance: ["Camille", "Spark"],
    camilleCommitted: ["Camille", "Committed"],
    julianRomance: ["Julian", "Spark"],
    julianCommitted: ["Julian", "Committed"],
    theoRomance: ["Theo", "Spark"],
    theoCommitted: ["Theo", "Committed"]
  };

  const MEMORY_BY_FLAG = {
    advocatedPiper: [["Piper", "You argued that Aegis was underestimating her."], ["Camille", "You challenged her read on Piper."]],
    protectedPiperFirst: [["Piper", "You checked on her before chasing Rhea's angle."]],
    piperRomance: [["Piper", "You made the chemistry explicit instead of hiding behind banter."]],
    piperSlowBurn: [["Piper", "You left the spark unnamed without denying it."]],
    piperTrustedPartner: [["Piper", "You chose trust without forcing a label onto it."]],
    camilleRomance: [["Camille", "You met her standards and made the interest personal."]],
    camilleCommitted: [["Camille", "You asked for honesty with the strategy stripped away."]],
    julianRomance: [["Julian", "You saw the performance and still answered the person underneath it."]],
    julianCommitted: [["Julian", "You asked which parts of the show were meant only for you."]],
    theoRomance: [["Theo", "You stayed with him when anxiety tried to turn into distance."]],
    theoCommitted: [["Theo", "You promised fear could have a seat without driving."]],
    rheaErased: [["Piper", "She saw what happens when you stop holding back."], ["Theo", "He has not stopped calculating the version where that went worse."], ["Camille", "She filed your force as both asset and warning."]],
    rheaContained: [["Piper", "She saw you choose restraint under impossible pressure."], ["Theo", "He trusts the branch where you listen."], ["Camille", "She saw control become more dangerous than spectacle."]],
    rheaEscaped: [["Piper", "Rhea getting away still sits under the jokes."], ["Theo", "He is tracking the probability of a second strike."], ["Camille", "She remembers the breach more than the excuse."]],
    galaLead: [["Julian", "You trusted him with doors, guest lists, and spectacle."]],
    theoConscience: [["Theo", "You asked him to keep the mission from curdling into hypocrisy."]],
    camilleAdvisor: [["Camille", "You asked her to design the guardrails instead of standing outside them."]]
  };

  const CHAPTER_RECAPS = {
    1: "Aegis stopped being abstract. You chose how to enter the room, who to trust first, and what kind of attention you were willing to invite.",
    2: "The baseline test gave Aegis numbers, but the corridor afterward gave everyone else a story about you.",
    3: "Sim Block C turned observation into politics. Camille, Piper, Theo, and Julian all learned something different from the same footage.",
    4: "Training made instinct visible. What you reached for under pressure became harder to dismiss as theory.",
    5: "The dock test crossed from sanctioned training into private risk, and the people who helped you now have their fingerprints on the secret.",
    6: "The Event Horizon turned a night out into contact with Vektor. The threat stopped being future tense.",
    7: "Rhea forced the question Aegis keeps circling: what do you do when total power is faster than permission?",
    8: "Piper's Mach test proved your power could hold a living disaster and still choose what happened next.",
    9: "Graduation eve put the future on the table before the ceremony could make anything official.",
    10: "The finale chose a shape for the life after Aegis, and the people closest to you learned what that choice costs."
  };

  const CONSEQUENCE_RECAPS = [
    ["piperRomance", "Piper is no longer just a fast exit route; the emotional stakes are named."],
    ["camilleRomance", "Camille has begun treating personal interest as a variable worth protecting."],
    ["julianRomance", "Julian let the performance crack in a way he cannot fully laugh off."],
    ["theoRomance", "Theo chose closeness even though certainty was not available."],
    ["rheaErased", "Aegis fear rose sharply after Rhea. Some people will call it survival. Others will call it evidence."],
    ["rheaContained", "Rhea's containment gave restraint a body count of zero and a file full of questions."],
    ["rheaEscaped", "Rhea remains an active threat, and everyone knows the next strike will be more personal."],
    ["romanceTension", "Multiple commitments made honesty part of the route, not a bonus virtue."],
    ["theoBoundaryAccepted", "Theo stayed because his conscience was allowed to stay too."],
    ["powerBreakthrough", "Your power crossed a line Aegis had not named yet."]
  ];

  const AVATAR_CATALOG = {
    male: [
      { id: "male-1", portrait: "assets/avatars/male-1.png" },
      { id: "male-2", portrait: "assets/avatars/male-2.png" },
      { id: "male-3", portrait: "assets/avatars/male-3.png" },
      { id: "male-4", portrait: "assets/avatars/male-4.png" },
      { id: "male-5", portrait: "assets/avatars/male-5.png" }
    ],
    female: [
      { id: "female-1", portrait: "assets/avatars/female-1.png" },
      { id: "female-2", portrait: "assets/avatars/female-2.png" },
      { id: "female-3", portrait: "assets/avatars/female-3.png" },
      { id: "female-4", portrait: "assets/avatars/female-4.png" },
      { id: "female-5", portrait: "assets/avatars/female-5.png" }
    ],
    neutral: [
      { id: "male-1", portrait: "assets/avatars/male-1.png" },
      { id: "male-2", portrait: "assets/avatars/male-2.png" },
      { id: "male-3", portrait: "assets/avatars/male-3.png" },
      { id: "male-4", portrait: "assets/avatars/male-4.png" },
      { id: "male-5", portrait: "assets/avatars/male-5.png" },
      { id: "female-1", portrait: "assets/avatars/female-1.png" },
      { id: "female-2", portrait: "assets/avatars/female-2.png" },
      { id: "female-3", portrait: "assets/avatars/female-3.png" },
      { id: "female-4", portrait: "assets/avatars/female-4.png" },
      { id: "female-5", portrait: "assets/avatars/female-5.png" }
    ]
  };

  const POWER_CATALOG = [
    {
      id: "energy",
      name: "Energy Absorption",
      codename: "Energy Sink",
      summary: "Absorb force, heat, light, electricity, and eventually impossible event-scale output.",
      terms: {
        adjective: "energy",
        force: "energy",
        counterforce: "null-energy",
        display: "radiance",
        spark: "flare",
        highOutput: "plasma",
        containment: "stasis shell",
        finisher: "lightning"
      },
      milestones: ["Ambient draw", "Directed release", "Kinetic storage", "Flight impulse", "Layered shields", "Field drain", "City-grid battery", "Multi-spectrum output", "Disaster-class containment", "Event-horizon reservoir"]
    },
    {
      id: "gravity",
      name: "Gravity Dominion",
      codename: "Mass Driver",
      summary: "Alter weight, inertia, vectors, and eventually fold battlefields into singularity math.",
      terms: {
        adjective: "gravitic",
        force: "mass",
        counterforce: "weightless null",
        display: "gravity shear",
        spark: "vector flare",
        highOutput: "singularity pressure",
        containment: "gravity cage",
        finisher: "tidal bolt"
      },
      milestones: ["Weight shift", "Vector shove", "Inertia brake", "Personal orbit", "Gravity shield", "Crushing well", "Mass inversion", "Tidal lance", "Localized singularity", "Planetary vector lock"]
    },
    {
      id: "chronal",
      name: "Chronal Control",
      codename: "Secondhand",
      summary: "Steal, lend, freeze, and accelerate time until moments become editable weapons.",
      terms: {
        adjective: "chronal",
        force: "time-pressure",
        counterforce: "stasis",
        display: "timeburn",
        spark: "clockflare",
        highOutput: "paradox light",
        containment: "time lock",
        finisher: "temporal strike"
      },
      milestones: ["Moment sense", "Reaction slip", "Pulse slow", "Personal haste", "Stasis touch", "Delayed release", "Branch echo", "Area freeze", "Causality stitch", "Timeline veto"]
    },
    {
      id: "bio",
      name: "Biokinetic Evolution",
      codename: "Living System",
      summary: "Control healing, adaptation, pain, bodies, and eventually rewrite survival itself.",
      terms: {
        adjective: "biokinetic",
        force: "metabolic surge",
        counterforce: "cellular stillness",
        display: "living bloom",
        spark: "nerve flare",
        highOutput: "evolutionary cascade",
        containment: "bio-lock",
        finisher: "neural storm"
      },
      milestones: ["Pain dampening", "Rapid healing", "Toxin purge", "Adaptive armor", "Nerve override", "Shared regeneration", "Predator adaptation", "Mass biofield", "Death refusal", "Species-scale rewrite"]
    },
    {
      id: "tech",
      name: "Technopathic Command",
      codename: "Root Access",
      summary: "Speak to machines, override systems, command networks, and eventually make cities answer.",
      terms: {
        adjective: "technopathic",
        force: "signal",
        counterforce: "dead air",
        display: "datafire",
        spark: "code flare",
        highOutput: "network storm",
        containment: "logic cage",
        finisher: "blackout spike"
      },
      milestones: ["Device whisper", "Sensor ghost", "Door override", "Drone call", "System shield", "Grid siphon", "City camera choir", "Infrastructure puppet", "Orbital intrusion", "Planetary root access"]
    },
    {
      id: "space",
      name: "Spatial Folding",
      codename: "Mapbreaker",
      summary: "Compress distance, open folds, cut angles, and eventually make location optional.",
      terms: {
        adjective: "spatial",
        force: "distance",
        counterforce: "folded void",
        display: "spacecut",
        spark: "rift flare",
        highOutput: "dimension shear",
        containment: "pocket cell",
        finisher: "rift strike"
      },
      milestones: ["Range sense", "Short fold", "Angle cut", "Blink step", "Pocket shield", "Portal brace", "Distance theft", "Room inversion", "Citywide gate", "Map overwrite"]
    }
  ];

  const FREE_TIME_TASKS = [
    {
      id: "control-loop",
      title: "Control Loop",
      kind: "Training",
      detail: (power) => `Run a low-output ${power.terms.containment} drill until the release stops jumping when your pulse does.`,
      reward: "1 hour | Control +1, power XP +1",
      duration: 60,
      fatigue: 2,
      effects: [
        { type: "stat", key: "control", delta: 1 },
        { type: "powerXp", amount: 1 },
        { type: "status", key: "stress", value: "Focused" }
      ],
      result: (power) => `You spend free time tuning ${power.terms.display} down to boring numbers. Boring, for once, feels like power you can keep.`
    },
    {
      id: "restraint-conditioning",
      title: "Restraint Conditioning",
      kind: "Training",
      detail: (power) => `Hold ${power.terms.force} under pressure, then let it go only when the room asks for it.`,
      reward: "1 hour | Restraint +1, power XP +1",
      duration: 60,
      fatigue: 2,
      effects: [
        { type: "stat", key: "restraint", delta: 1 },
        { type: "powerXp", amount: 1 },
        { type: "status", key: "condition", value: "Steady" }
      ],
      result: (power) => `The drill is simple: want the ${power.terms.highOutput}, refuse the shortcut, repeat until refusal becomes muscle memory.`
    },
    {
      id: "overcharge-test",
      title: "Overcharge Test",
      kind: "Training",
      detail: (power) => `Push the safe ceiling just enough to learn where ${power.terms.spark} starts turning into a reportable incident.`,
      reward: "75 minutes | Audacity +1, power XP +2, stress up",
      duration: 75,
      fatigue: 3,
      available: (_state, scene) => scene.chapter >= 2,
      effects: [
        { type: "stat", key: "audacity", delta: 1 },
        { type: "powerXp", amount: 2 },
        { type: "status", key: "stress", value: "Elevated" },
        { type: "status", key: "energy", value: "Primed" }
      ],
      result: (power) => `You find a higher edge on the ${power.terms.adjective} output. The edge finds you back, which is rude but educational.`
    },
    {
      id: "scenario-replay",
      title: "Scenario Replay",
      kind: "Analysis",
      detail: () => "Replay a recent choice from the cameras and look for the consequence you missed in the moment.",
      reward: "45 minutes | Resolve +1, contractor pressure +1",
      duration: 45,
      fatigue: 1,
      available: (_state, scene) => scene.chapter >= 2,
      effects: [
        { type: "stat", key: "resolve", delta: 1 },
        { type: "stat", key: "contractorPath", delta: 1 },
        { type: "status", key: "stress", value: "Alert" }
      ],
      result: () => "The replay does not make you feel better. It does make the next bad second a little less surprising."
    },
    {
      id: "recovery-block",
      title: "Rest Block",
      kind: "Rest",
      detail: () => "Sleep, stretch, eat something that was not dispensed by a machine, and let the file wait.",
      reward: "2 hours | clears fatigue penalty",
      duration: 120,
      fatigue: -9,
      rest: true,
      consumesSlot: false,
      effects: [
        { type: "status", key: "condition", value: "Recovered" },
        { type: "status", key: "stress", value: "Low" }
      ],
      result: () => "You give the day fewer ways to turn you into a reaction. Recovery counts, even when it refuses to look impressive."
    },
    {
      id: "bond-piper",
      title: "Check In: Piper",
      kind: "Bond",
      detail: () => "Find Piper where the rules get blurry and let the conversation stay honest under the jokes.",
      reward: "45 minutes | Piper bond +1",
      duration: 45,
      fatigue: 0.5,
      available: (currentState) => (currentState.relationships.Piper || 0) > 0,
      effects: [
        { type: "relationship", key: "Piper", delta: 1 },
        { type: "npc", key: "Piper", trust: 1, concern: -1 }
      ],
      result: () => "Piper makes it look easy until it is not. You stay past the punchline, and she notices."
    },
    {
      id: "bond-camille",
      title: "Check In: Camille",
      kind: "Bond",
      detail: () => "Ask Camille for the version of the plan she would write if politics were not in the room.",
      reward: "45 minutes | Camille bond +1",
      duration: 45,
      fatigue: 0.5,
      available: (currentState) => (currentState.relationships.Camille || 0) > 0,
      effects: [
        { type: "relationship", key: "Camille", delta: 1 },
        { type: "npc", key: "Camille", trust: 1, respect: 1 }
      ],
      result: () => "Camille answers like precision is a love language she would deny under oath."
    },
    {
      id: "bond-julian",
      title: "Check In: Julian",
      kind: "Bond",
      detail: () => "Let Julian pick the setting, then ask the question he keeps performing around.",
      reward: "45 minutes | Julian bond +1",
      duration: 45,
      fatigue: 0.5,
      available: (currentState) => (currentState.relationships.Julian || 0) > 0,
      effects: [
        { type: "relationship", key: "Julian", delta: 1 },
        { type: "npc", key: "Julian", trust: 1, respect: 1 }
      ],
      result: () => "Julian gives you three jokes, one dodge, and then one answer real enough to make the jokes matter."
    },
    {
      id: "bond-theo",
      title: "Check In: Theo",
      kind: "Bond",
      detail: () => "Sit with Theo and the ugly math until neither of you has to pretend certainty is available.",
      reward: "45 minutes | Theo bond +1",
      duration: 45,
      fatigue: 0.5,
      available: (currentState) => (currentState.relationships.Theo || 0) > 0,
      effects: [
        { type: "relationship", key: "Theo", delta: 1 },
        { type: "npc", key: "Theo", trust: 1, concern: -1 }
      ],
      result: () => "Theo relaxes by exactly one millimeter. For Theo, that is practically a standing ovation."
    }
  ];

  const els = {};
  let state;
  let creatorSelection = {
    gender: "male",
    pronouns: "he",
    avatarId: "male-1",
    powerId: "energy"
  };

  document.addEventListener("DOMContentLoaded", init);
  if ("serviceWorker" in navigator && /^https?:$/.test(window.location.protocol)) {
    navigator.serviceWorker.register("sw.js").catch(() => {});
  }

  function init() {
    cacheElements();
    applyTheme(localStorage.getItem(THEME_KEY) || "light");
    bindEvents();
    state = load(AUTO_KEY) || createState();
    if (state.history.length) {
      updateAutosaveStatus();
      render();
    } else {
      render();
    }
    setupCreator();
    openStartDialog();
  }

  function cacheElements() {
    Object.assign(els, {
      chapterKicker: document.getElementById("chapterKicker"),
      sceneHeading: document.getElementById("sceneHeading"),
      sceneLocation: document.getElementById("sceneLocation"),
      sceneArt: document.getElementById("sceneArt"),
      transcript: document.getElementById("transcript"),
      choices: document.getElementById("choices"),
      portrait: document.getElementById("portrait"),
      focusName: document.getElementById("focusName"),
      focusRole: document.getElementById("focusRole"),
      powerPanel: document.getElementById("powerPanel"),
      statWheel: document.getElementById("statWheel"),
      statusList: document.getElementById("statusList"),
      relationshipList: document.getElementById("relationshipList"),
      autosaveStatus: document.getElementById("autosaveStatus"),
      startDialog: document.getElementById("startDialog"),
      openGameView: document.getElementById("openGameView"),
      creatorView: document.getElementById("creatorView"),
      startAutosaveDetails: document.getElementById("startAutosaveDetails"),
      startAutosaveBtn: document.getElementById("startAutosaveBtn"),
      startSaveSlots: document.getElementById("startSaveSlots"),
      showCreatorBtn: document.getElementById("showCreatorBtn"),
      backToOpenBtn: document.getElementById("backToOpenBtn"),
      playerNameInput: document.getElementById("playerNameInput"),
      genderChoices: document.getElementById("genderChoices"),
      pronounChoices: document.getElementById("pronounChoices"),
      avatarChoices: document.getElementById("avatarChoices"),
      powerChoices: document.getElementById("powerChoices"),
      creatorMatureToggle: document.getElementById("creatorMatureToggle"),
      beginGameBtn: document.getElementById("beginGameBtn"),
      dossier: document.getElementById("dossier"),
      pauseDialog: document.getElementById("pauseDialog"),
      saveSlots: document.getElementById("saveSlots"),
      autosaveDetails: document.getElementById("autosaveDetails"),
      loadAutosaveBtn: document.getElementById("loadAutosaveBtn"),
      progressList: document.getElementById("progressList"),
      progressDetails: document.getElementById("progressDetails"),
      taskStatus: document.getElementById("taskStatus"),
      taskList: document.getElementById("taskList"),
      darkModeToggle: document.getElementById("darkModeToggle"),
      pauseMatureToggle: document.getElementById("pauseMatureToggle"),
      confirmDialog: document.getElementById("confirmDialog"),
      confirmTitle: document.getElementById("confirmTitle"),
      confirmBody: document.getElementById("confirmBody"),
      confirmAction: document.getElementById("confirmAction"),
      newGameBtn: document.getElementById("newGameBtn"),
      restartChapterBtn: document.getElementById("restartChapterBtn"),
      saveLoadBtn: document.getElementById("saveLoadBtn"),
      statusBtn: document.getElementById("statusBtn")
    });
  }

  function bindEvents() {
    els.newGameBtn.addEventListener("click", () => {
      confirmAction("New game", "Start a new intake file? Current autosave progress will be replaced once the new game begins.", () => {
        showCreatorView();
      });
    });

    els.restartChapterBtn.addEventListener("click", () => {
      const scene = getScene(state.currentScene);
      const chapter = getChapter(scene.chapter);
      confirmAction("Restart chapter", `Restart ${chapter.title} from its opening scene?`, () => {
        restartChapter(scene.chapter);
      });
    });

    els.saveLoadBtn.addEventListener("click", openPauseDialog);
    els.showCreatorBtn.addEventListener("click", showCreatorView);
    els.backToOpenBtn.addEventListener("click", showOpenGameView);
    els.beginGameBtn.addEventListener("click", () => {
      const profile = readCreatorProfile();
      if (!profile) return;
      state = createState(profile);
      els.startDialog.close();
      enterScene(STORY.initialScene);
    });
    els.startDialog.addEventListener("cancel", (event) => {
      if (!state.history.length) event.preventDefault();
    });
    els.startAutosaveBtn.addEventListener("click", () => {
      const loaded = load(AUTO_KEY);
      if (loaded) {
        state = loaded;
        els.startDialog.close();
        render({ scroll: true });
        updateAutosaveStatus();
      }
    });
    els.loadAutosaveBtn.addEventListener("click", () => {
      const loaded = load(AUTO_KEY);
      if (loaded) {
        state = loaded;
        els.pauseDialog.close();
        render({ scroll: true });
      }
    });
    els.darkModeToggle.addEventListener("change", () => {
      applyTheme(els.darkModeToggle.checked ? "dark" : "light");
    });
    els.pauseMatureToggle.addEventListener("change", () => {
      state.profile.matureContent = els.pauseMatureToggle.checked;
      save(AUTO_KEY);
      render();
    });
    els.statusBtn.addEventListener("click", () => {
      els.dossier.classList.toggle("hidden");
    });
  }

  function setupCreator() {
    renderGenderChoices();
    renderPronounChoices();
    renderAvatarChoices();
    renderPowerChoices();
  }

  function openStartDialog() {
    showOpenGameView();
    renderStartLoadOptions();
    els.startDialog.showModal();
  }

  function showOpenGameView() {
    els.openGameView.classList.remove("hidden");
    els.creatorView.classList.add("hidden");
    renderStartLoadOptions();
  }

  function showCreatorView() {
    if (els.pauseDialog.open) els.pauseDialog.close();
    if (!els.startDialog.open) els.startDialog.showModal();
    els.openGameView.classList.add("hidden");
    els.creatorView.classList.remove("hidden");
    renderAvatarChoices();
    renderPowerChoices();
  }

  function renderStartLoadOptions() {
    const autosave = load(AUTO_KEY);
    els.startAutosaveBtn.disabled = !autosave;
    els.startAutosaveDetails.textContent = autosave ? saveSummary(autosave) : "No autosave yet.";
    renderSaveSlots(els.startSaveSlots, { allowSave: false, closeDialog: els.startDialog });
  }

  function renderGenderChoices() {
    els.genderChoices.innerHTML = "";
    GENDERS.forEach((gender) => {
      const button = document.createElement("button");
      button.type = "button";
      button.className = `segment-btn${creatorSelection.gender === gender.id ? " selected" : ""}`;
      button.textContent = gender.label;
      button.addEventListener("click", () => {
        creatorSelection.gender = gender.id;
        creatorSelection.pronouns = gender.id === "female" ? "she" : gender.id === "neutral" ? "they" : "he";
        creatorSelection.avatarId = AVATAR_CATALOG[gender.id][0].id;
        renderGenderChoices();
        renderPronounChoices();
        renderAvatarChoices();
      });
      els.genderChoices.appendChild(button);
    });
  }

  function renderPronounChoices() {
    els.pronounChoices.innerHTML = "";
    PRONOUNS.forEach((pronoun) => {
      const button = document.createElement("button");
      button.type = "button";
      button.className = `segment-btn${creatorSelection.pronouns === pronoun.id ? " selected" : ""}`;
      button.textContent = pronoun.label;
      button.addEventListener("click", () => {
        creatorSelection.pronouns = pronoun.id;
        renderPronounChoices();
      });
      els.pronounChoices.appendChild(button);
    });
  }

  function renderAvatarChoices() {
    els.avatarChoices.innerHTML = "";
    AVATAR_CATALOG[creatorSelection.gender].forEach((avatar, index) => {
      const button = document.createElement("button");
      button.type = "button";
      button.className = `avatar-btn${creatorSelection.avatarId === avatar.id ? " selected" : ""}`;
      button.setAttribute("aria-label", `Icon ${index + 1}`);
      button.addEventListener("click", () => {
        creatorSelection.avatarId = avatar.id;
        renderAvatarChoices();
      });
      const img = document.createElement("img");
      img.alt = "";
      img.src = avatar.portrait;
      button.appendChild(img);
      els.avatarChoices.appendChild(button);
    });
  }

  function renderPowerChoices() {
    els.powerChoices.innerHTML = "";
    POWER_CATALOG.forEach((power) => {
      const button = document.createElement("button");
      button.type = "button";
      button.className = `power-card${creatorSelection.powerId === power.id ? " selected" : ""}`;
      button.addEventListener("click", () => {
        creatorSelection.powerId = power.id;
        renderPowerChoices();
      });
      const title = document.createElement("strong");
      title.textContent = power.name;
      const body = document.createElement("span");
      body.textContent = power.summary;
      button.append(title, body);
      els.powerChoices.appendChild(button);
    });
  }

  function readCreatorProfile() {
    const name = els.playerNameInput.value.trim();
    if (!name) {
      els.playerNameInput.setCustomValidity("Enter your character's name.");
      els.playerNameInput.reportValidity();
      return null;
    }
    els.playerNameInput.setCustomValidity("");
    const avatarDef = getAvatarDef(creatorSelection.gender, creatorSelection.avatarId);
    return {
      name,
      age: 24,
      gender: creatorSelection.gender,
      pronouns: creatorSelection.pronouns,
      avatarId: creatorSelection.avatarId,
      avatar: avatarDef.portrait,
      powerId: creatorSelection.powerId,
      matureContent: els.creatorMatureToggle.checked
    };
  }

  function createState(profileInput) {
    const profile = profileInput || defaultProfile();
    const powerDef = getPower(profile.powerId);
    return {
      version: STORY.version,
      currentScene: STORY.initialScene,
      profile,
      power: {
        id: powerDef.id,
        name: powerDef.name,
        level: 1,
        xp: 0,
        milestones: [powerDef.milestones[0]]
      },
      flags: {},
      stats: clone(STORY.defaultStats),
      relationships: clone(STORY.defaultRelationships),
      npcs: defaultNpcStates(),
      status: clone(STORY.defaultStatus),
      clock: defaultClock(),
      tasks: {},
      history: [],
      chapterSnapshots: {},
      startedAt: Date.now(),
      updatedAt: Date.now()
    };
  }

  function enterScene(sceneId, options = {}) {
    const scene = getScene(sceneId);
    state.currentScene = sceneId;
    state.history.push({
      type: "scene",
      sceneId,
      title: scene.title,
      speaker: scene.focus || "Seth",
      text: getSceneText(scene),
      at: Date.now()
    });
    if (scene.statusReport) {
      state.history.push({
        type: "status",
        title: "After-Action Status",
        status: clone(state.status),
        stats: pickFightStats(),
        at: Date.now()
      });
    }
    if (scene.ending) {
      state.history.push({
        type: "ending",
        title: "Why This Ending",
        lines: endingRationale(),
        at: Date.now()
      });
    }
    captureChapterSnapshot(scene);
    state.updatedAt = Date.now();
    if (options.autosave !== false) save(AUTO_KEY);
    render({ scroll: true });
  }

  function choose(choiceIndex) {
    const scene = getScene(state.currentScene);
    const choices = getVisibleChoices(scene);
    const choice = choices[choiceIndex];
    if (!choice) return;

    state.history.push({
      type: "choice",
      text: choice.text,
      at: Date.now()
    });

    const notices = applyEffects(choice.effects || []);
    if (choice.note) notices.push(choice.note);
    const nextSceneId = resolveNext(choice);
    const nextScene = getScene(nextSceneId);
    notices.push(...advanceClock(choiceMinutes(choice, scene, nextScene), "Story movement"));
    notices.forEach((notice) => {
      state.history.push({
        type: "notice",
        text: notice,
        at: Date.now()
      });
    });

    if (nextScene.chapter > scene.chapter) {
      pushChapterSummary(scene.chapter);
    }
    enterScene(nextSceneId);
  }

  function render(options = {}) {
    const scene = getScene(state.currentScene);
    const chapter = getChapter(scene.chapter);
    const focus = getFocus(scene.focus);
    const background = STORY.backgrounds[scene.background] || STORY.backgrounds.aegis;

    els.chapterKicker.textContent = `Chapter ${chapter.id}`;
    els.sceneHeading.textContent = scene.title;
    els.sceneLocation.textContent = scene.location || "";
    els.sceneArt.src = background;
    els.portrait.src = focus.portrait;
    els.focusName.textContent = focus.name || scene.focus || state.profile.name;
    els.focusRole.textContent = focus.role;

    renderTranscript();
    renderChoices(scene);
    renderPowerPanel();
    renderStatWheel();
    renderStatus();
    renderRelationships();

    if (options.scroll) {
      requestAnimationFrame(() => {
        els.transcript.scrollTop = els.transcript.scrollHeight;
      });
    }
  }

  function renderTranscript() {
    els.transcript.innerHTML = "";
    const fragment = document.createDocumentFragment();

    state.history.forEach((entry) => {
      const node = document.createElement("article");
      node.className = `entry ${entry.type === "status" ? "status-report" : entry.type}`;

      if (entry.type === "scene") {
        node.classList.add("speech-entry");
        const body = document.createElement("div");
        body.className = "entry-body";
        const speaker = document.createElement("div");
        speaker.className = "speaker";
        speaker.textContent = displaySpeaker(entry.speaker || "Scene");
        body.appendChild(speaker);
        entry.text.forEach((paragraph) => body.appendChild(paragraphNode(paragraph)));
        node.append(speakerTile(entry.speaker || "Seth", "Speaking"), body);
      } else if (entry.type === "choice") {
        node.classList.add("speech-entry", "player-entry");
        const body = document.createElement("div");
        body.className = "entry-body";
        const title = document.createElement("h3");
        title.textContent = state.profile.name;
        body.appendChild(title);
        body.appendChild(paragraphNode(entry.text));
        node.append(speakerTile("Seth", "You"), body);
      } else if (entry.type === "notice") {
        const title = document.createElement("h3");
        title.textContent = "Consequence";
        node.appendChild(title);
        node.appendChild(paragraphNode(entry.text));
      } else if (entry.type === "task") {
        const title = document.createElement("h3");
        title.textContent = entry.title || "Free Time";
        node.appendChild(title);
        node.appendChild(paragraphNode(entry.text));
      } else if (entry.type === "status") {
        const title = document.createElement("h3");
        title.textContent = entry.title;
        node.appendChild(title);
        Object.entries(entry.status).forEach(([key, value]) => {
          node.appendChild(paragraphNode(`${labelize(key)}: ${value}`));
        });
        node.appendChild(paragraphNode(`Fight balance: Control ${entry.stats.control}, Restraint ${entry.stats.restraint}, Exposure ${entry.stats.exposure}, Collateral ${entry.stats.collateral}.`));
      } else if (entry.type === "ending") {
        const title = document.createElement("h3");
        title.textContent = entry.title;
        node.appendChild(title);
        (entry.lines || []).forEach((line) => node.appendChild(paragraphNode(line)));
      } else if (entry.type === "chapterSummary") {
        const title = document.createElement("h3");
        title.textContent = entry.title;
        node.appendChild(title);
        (entry.lines || []).forEach((line) => node.appendChild(paragraphNode(line)));
      }

      fragment.appendChild(node);
    });

    els.transcript.appendChild(fragment);
  }

  function renderChoices(scene) {
    els.choices.innerHTML = "";
    const choices = getVisibleChoices(scene);

    if (!choices.length) {
      const wrapper = document.createElement("div");
      wrapper.className = "no-choices";
      const restart = document.createElement("button");
      restart.type = "button";
      restart.className = "text-btn";
      restart.textContent = "Restart Chapter";
      restart.addEventListener("click", () => restartChapter(scene.chapter));
      const fresh = document.createElement("button");
      fresh.type = "button";
      fresh.className = "text-btn";
      fresh.textContent = "New Game";
      fresh.addEventListener("click", () => {
        showCreatorView();
      });
      wrapper.append(restart, fresh);
      els.choices.appendChild(wrapper);
      return;
    }

    choices.forEach((choice, index) => {
      const button = document.createElement("button");
      button.type = "button";
      button.className = "choice-btn";
      button.addEventListener("click", () => choose(index));

      const badge = document.createElement("span");
      badge.className = "choice-index";
      badge.textContent = String(index + 1);

      const text = document.createElement("span");
      text.textContent = formatText(choice.text);

      button.append(badge, text);
      els.choices.appendChild(button);
    });
  }

  function renderStatus() {
    els.statusList.innerHTML = "";
    Object.entries(state.status).forEach(([key, value]) => {
      const row = document.createElement("div");
      row.className = "status-row";
      const dt = document.createElement("dt");
      dt.textContent = labelize(key);
      const dd = document.createElement("dd");
      dd.textContent = value;
      row.append(dt, dd);
      els.statusList.appendChild(row);
    });
    [
      ["programTime", formatClock()],
      ["fatigue", fatigueLabel()],
      ["restPenalty", fatiguePenalty() ? `-${fatiguePenalty()} control/restraint/resolve checks` : "None"]
    ].forEach(([key, value]) => {
      const row = document.createElement("div");
      row.className = "status-row";
      const dt = document.createElement("dt");
      dt.textContent = labelize(key);
      const dd = document.createElement("dd");
      dd.textContent = value;
      row.append(dt, dd);
      els.statusList.appendChild(row);
    });
  }

  function renderPowerPanel() {
    const power = state.power || defaultPowerState(state.profile.powerId);
    const def = getPower(power.id);
    const nextThreshold = POWER_THRESHOLDS[Math.min(power.level, POWER_THRESHOLDS.length - 1)] || POWER_THRESHOLDS[POWER_THRESHOLDS.length - 1];
    const prevThreshold = POWER_THRESHOLDS[Math.max(0, power.level - 1)] || 0;
    const progress = power.level >= 10 ? 100 : ((power.xp - prevThreshold) / Math.max(1, nextThreshold - prevThreshold)) * 100;
    const milestone = power.milestones[power.milestones.length - 1] || def.milestones[0];

    els.powerPanel.innerHTML = "";
    const row = document.createElement("div");
    row.className = "power-title-row";
    const name = document.createElement("span");
    name.textContent = def.name;
    const level = document.createElement("span");
    level.textContent = `Level ${power.level}`;
    row.append(name, level);

    const track = document.createElement("div");
    track.className = "power-track";
    const fill = document.createElement("i");
    fill.style.width = `${Math.max(4, Math.min(100, progress))}%`;
    track.appendChild(fill);

    const unlocked = document.createElement("div");
    unlocked.className = "power-milestone";
    unlocked.textContent = milestone;

    els.powerPanel.append(row, track, unlocked);
  }

  function renderStatWheel() {
    const values = getAttributeValues();
    const labels = [
      ["Power", values.power],
      ["Control", values.control],
      ["Restraint", values.restraint],
      ["Instinct", values.instinct],
      ["Insight", values.insight],
      ["Resolve", values.resolve]
    ];
    const cx = 110;
    const cy = 105;
    const maxRadius = 70;
    const points = labels.map(([, value], index) => {
      const angle = (-90 + index * 60) * Math.PI / 180;
      const radius = maxRadius * Math.min(10, Math.max(1, value)) / 10;
      return [cx + Math.cos(angle) * radius, cy + Math.sin(angle) * radius];
    });
    const grid = [2, 4, 6, 8, 10].map((step) => polygonPoints(labels.length, cx, cy, maxRadius * step / 10));
    const axes = labels.map((_, index) => {
      const angle = (-90 + index * 60) * Math.PI / 180;
      return [cx + Math.cos(angle) * maxRadius, cy + Math.sin(angle) * maxRadius];
    });
    const labelNodes = labels.map(([label, value], index) => {
      const angle = (-90 + index * 60) * Math.PI / 180;
      const x = cx + Math.cos(angle) * (maxRadius + 26);
      const y = cy + Math.sin(angle) * (maxRadius + 20);
      return `<text x="${x}" y="${y}" text-anchor="middle">${label} ${value}</text>`;
    }).join("");
    els.statWheel.innerHTML = `<svg viewBox="0 0 220 220" role="img" aria-label="Stat circle">
      ${grid.map((pts) => `<polygon class="grid-shape" points="${pts}"/>`).join("")}
      ${axes.map(([x, y]) => `<line class="axis-line" x1="${cx}" y1="${cy}" x2="${x}" y2="${y}"/>`).join("")}
      <polygon class="stat-shape" points="${points.map((p) => p.join(",")).join(" ")}"/>
      ${labelNodes}
    </svg>`;
  }

  function renderRelationships() {
    els.relationshipList.innerHTML = "";
    Object.entries(state.relationships).forEach(([name, value]) => {
      if (!MAIN_NPCS.includes(name) && value < 3) return;
      const row = document.createElement("div");
      row.className = "bond-signal";

      const label = document.createElement("span");
      label.textContent = name;

      const meter = document.createElement("span");
      meter.className = "meter";
      const fill = document.createElement("i");
      fill.style.width = `${Math.max(4, Math.min(100, (value + 5) * 10))}%`;
      meter.appendChild(fill);

      const score = document.createElement("span");
      score.className = "signal-value";
      score.textContent = signalName(value);

      row.append(label, meter, score);
      els.relationshipList.appendChild(row);
    });
  }

  function renderNpcDossiers(target, options = {}) {
    target.innerHTML = "";
    const names = dossierNames(options.compact);
    names.forEach((name) => {
      const character = STORY.characters[name];
      const npc = ensureNpcState(name);
      const value = state.relationships[name] || 0;
      const card = document.createElement("article");
      card.className = `npc-dossier${MAIN_NPCS.includes(name) ? " main" : ""}`;

      const header = document.createElement("div");
      header.className = "npc-head";
      const title = document.createElement("h3");
      title.textContent = name;
      const signal = document.createElement("span");
      signal.className = "npc-signal";
      signal.textContent = signalName(value);
      header.append(title, signal);

      const meta = document.createElement("p");
      meta.className = "npc-meta";
      meta.textContent = `Age ${character.age || "?"} | ${character.pronouns || "pronouns on file"} | ${character.power || character.role}`;

      const romance = document.createElement("p");
      romance.className = "npc-romance";
      romance.textContent = `Route: ${npc.romance}`;

      const dims = document.createElement("div");
      dims.className = "npc-dimensions";
      NPC_DIMENSIONS.forEach((dimension) => {
        dims.appendChild(dimensionNode(dimension, npc[dimension]));
      });

      const memory = document.createElement("p");
      memory.className = "npc-memory";
      memory.textContent = npc.memories.length ? npc.memories[npc.memories.length - 1] : "No defining memory yet.";

      card.append(header, meta, romance, dims, memory);
      if (!options.compact && npc.agency) {
        const agency = document.createElement("p");
        agency.className = "npc-agency";
        agency.textContent = npc.agency;
        card.appendChild(agency);
      }
      target.appendChild(card);
    });
  }

  function dimensionNode(label, value) {
    const row = document.createElement("div");
    row.className = "npc-dim";
    const name = document.createElement("span");
    name.textContent = labelize(label);
    const meter = document.createElement("span");
    meter.className = "meter";
    const fill = document.createElement("i");
    fill.style.width = `${Math.max(4, Math.min(100, (value || 0) * 10))}%`;
    meter.appendChild(fill);
    const score = document.createElement("span");
    score.className = "signal-value";
    score.textContent = String(value || 0);
    row.append(name, meter, score);
    return row;
  }

  function dossierNames(compact) {
    const names = Object.keys(STORY.defaultRelationships).filter((name) => STORY.characters[name]);
    if (!compact) return names;
    const visible = new Set(MAIN_NPCS);
    names.forEach((name) => {
      const npc = ensureNpcState(name);
      if ((state.relationships[name] || 0) >= 3 || npc.memories.length || npc.romance !== "None") visible.add(name);
    });
    return names.filter((name) => visible.has(name));
  }

  function renderProgress() {
    const currentScene = getScene(state.currentScene);
    const currentChapter = currentScene.chapter;
    els.progressList.innerHTML = "";
    STORY.chapters.forEach((chapter) => {
      const li = document.createElement("li");
      li.textContent = `${chapter.id}. ${chapter.title}`;
      if (chapter.id < currentChapter) li.className = "complete";
      if (chapter.id === currentChapter) li.className = "current";
      if (chapter.id > currentChapter) li.className = "locked";
      els.progressList.appendChild(li);
    });

    els.progressDetails.innerHTML = "";
    addProgressPill(`Current: ${getChapter(currentChapter).title}`);
    addProgressPill(`Scene: ${currentScene.title}`);
    addProgressPill(`Transcript entries: ${state.history.length}`);
    addProgressPill(`Flags set: ${Object.values(state.flags).filter(Boolean).length}`);
    addProgressPill(`Final path: ${currentFinalPath()}`);
    addProgressPill(`Power level: ${(state.power && state.power.level) || 1}`);
    addProgressPill(`Time: ${formatClock()}`);
    addProgressPill(`Fatigue: ${fatigueLabel()}`);
    const taskLimit = chapterTaskLimit(currentScene);
    const bucket = taskBucket(currentChapter);
    addProgressPill(taskLimit > 0 ? `Free time: ${bucket.used || 0}/${taskLimit}` : "Free time: closed");
  }

  function openPauseDialog() {
    renderSaveSlots(els.saveSlots, { allowSave: true, closeDialog: els.pauseDialog });
    renderProgress();
    renderTasks();
    renderAutosaveDetails();
    els.darkModeToggle.checked = document.body.classList.contains("dark-mode");
    els.pauseMatureToggle.checked = Boolean(state.profile.matureContent);
    els.pauseDialog.showModal();
  }

  function renderTasks() {
    if (!els.taskList || !els.taskStatus) return;
    const scene = getScene(state.currentScene);
    const chapterId = scene.chapter;
    const limit = chapterTaskLimit(scene);
    const bucket = taskBucket(chapterId);
    const used = bucket.used || 0;
    const remaining = Math.max(0, limit - used);
    const power = getPower((state.power && state.power.id) || state.profile.powerId);
    const tasks = FREE_TIME_TASKS.filter((task) => !task.available || task.available(state, scene));

    els.taskList.innerHTML = "";
    if (limit <= 0) {
      els.taskStatus.textContent = "Free time is closed during the finale and after ending scenes.";
    } else {
      els.taskStatus.textContent = `${formatClock()}. Activity slots ${used}/${limit} this chapter. Training takes about an hour; rest clears fatigue and does not spend a slot.`;
    }

    tasks.forEach((task) => {
      const button = document.createElement("button");
      button.type = "button";
      button.className = "task-btn";
      button.disabled = limit <= 0 || (task.consumesSlot !== false && remaining <= 0);
      button.addEventListener("click", () => performTask(task.id));

      const head = document.createElement("span");
      head.className = "task-head";
      const title = document.createElement("strong");
      title.textContent = task.title;
      const kind = document.createElement("span");
      kind.className = "task-kind";
      kind.textContent = task.kind;
      head.append(title, kind);

      const detail = document.createElement("span");
      detail.className = "task-detail";
      detail.textContent = typeof task.detail === "function" ? task.detail(power) : task.detail;

      const reward = document.createElement("span");
      reward.className = "task-reward";
      const count = bucket.completed && bucket.completed[task.id] ? ` | done ${bucket.completed[task.id]}x` : "";
      reward.textContent = `${task.reward}${count}`;

      button.append(head, detail, reward);
      els.taskList.appendChild(button);
    });
  }

  function performTask(taskId) {
    const task = FREE_TIME_TASKS.find((item) => item.id === taskId);
    const scene = getScene(state.currentScene);
    const limit = chapterTaskLimit(scene);
    const bucket = taskBucket(scene.chapter);
    const spendsSlot = task && task.consumesSlot !== false;
    if (!task || (task.available && !task.available(state, scene)) || limit <= 0 || (spendsSlot && (bucket.used || 0) >= limit)) {
      renderTasks();
      return;
    }

    const power = getPower((state.power && state.power.id) || state.profile.powerId);
    if (spendsSlot) bucket.used = (bucket.used || 0) + 1;
    bucket.completed[task.id] = (bucket.completed[task.id] || 0) + 1;
    state.history.push({
      type: "task",
      title: `Free Time: ${task.title}`,
      text: typeof task.result === "function" ? task.result(power) : task.result,
      at: Date.now()
    });

    const notices = applyEffects(resolveTaskEffects(task));
    notices.push(...advanceClock(task.duration || 45, task.title, {
      fatigue: task.fatigue || 0,
      rest: Boolean(task.rest)
    }));
    notices.forEach((notice) => {
      state.history.push({
        type: "notice",
        text: notice,
        at: Date.now()
      });
    });

    state.updatedAt = Date.now();
    save(AUTO_KEY);
    render({ scroll: true });
    if (els.pauseDialog.open) {
      renderTasks();
      renderProgress();
      renderAutosaveDetails();
    }
  }

  function resolveTaskEffects(task) {
    const effects = typeof task.effects === "function" ? task.effects(state) : task.effects;
    return clone(effects || []);
  }

  function taskBucket(chapterId) {
    if (!state.tasks) state.tasks = {};
    const key = String(chapterId);
    if (!state.tasks[key]) state.tasks[key] = { used: 0, completed: {} };
    if (!state.tasks[key].completed) state.tasks[key].completed = {};
    state.tasks[key].used = Math.max(0, Number(state.tasks[key].used) || 0);
    return state.tasks[key];
  }

  function chapterTaskLimit(scene) {
    if (!scene || scene.ending || scene.chapter >= 10 || !getVisibleChoices(scene).length) return 0;
    if (scene.chapter === 1) return 4;
    if (scene.chapter >= 7) return 6;
    return 7;
  }

  function addProgressPill(text) {
    const pill = document.createElement("span");
    pill.className = "progress-pill";
    pill.textContent = text;
    els.progressDetails.appendChild(pill);
  }

  function renderAutosaveDetails() {
    const autosave = load(AUTO_KEY);
    els.loadAutosaveBtn.disabled = !autosave;
    els.autosaveDetails.textContent = autosave ? saveSummary(autosave) : "No autosave yet.";
  }

  function renderSaveSlots(target = els.saveSlots, options = {}) {
    const allowSave = options.allowSave !== false;
    target.innerHTML = "";
    for (let slot = 1; slot <= 3; slot += 1) {
      const data = load(SLOT_KEY(slot));
      const card = document.createElement("section");
      card.className = "slot";

      const title = document.createElement("h3");
      title.textContent = `Slot ${slot}`;
      const details = document.createElement("p");
      details.textContent = data ? saveSummary(data) : "Empty";

      const actions = document.createElement("div");
      actions.className = "slot-actions";

      if (allowSave) {
        const saveBtn = document.createElement("button");
        saveBtn.type = "button";
        saveBtn.className = "text-btn";
        saveBtn.textContent = "Save";
        saveBtn.addEventListener("click", () => {
          save(SLOT_KEY(slot));
          renderSaveSlots(target, options);
        });
        actions.appendChild(saveBtn);
      }

      const loadBtn = document.createElement("button");
      loadBtn.type = "button";
      loadBtn.className = "text-btn";
      loadBtn.textContent = "Load";
      loadBtn.disabled = !data;
      loadBtn.addEventListener("click", () => {
        const loaded = load(SLOT_KEY(slot));
        if (loaded) {
          state = loaded;
          save(AUTO_KEY);
          if (options.closeDialog && options.closeDialog.open) options.closeDialog.close();
          render({ scroll: true });
        }
      });
      actions.appendChild(loadBtn);

      card.append(title, details, actions);
      target.appendChild(card);
    }
  }

  function saveSummary(savedState) {
    const scene = STORY.scenes[savedState.currentScene] || STORY.scenes[STORY.initialScene];
    const chapter = getChapter(scene.chapter);
    const when = new Date(savedState.updatedAt || Date.now()).toLocaleString();
    const profile = savedState.profile || defaultProfile();
    return `${profile.name} - ${chapter.title}: ${scene.title}. ${when}`;
  }

  function save(key) {
    state.updatedAt = Date.now();
    localStorage.setItem(key, JSON.stringify(state));
    if (key === AUTO_KEY) updateAutosaveStatus();
  }

  function load(key) {
    try {
      const raw = localStorage.getItem(key);
      if (!raw) return null;
      const loaded = JSON.parse(raw);
      if (!loaded || typeof loaded !== "object") return null;
      return normalizeState(loaded);
    } catch (error) {
      console.warn("Could not load save", error);
      return null;
    }
  }

  function normalizeState(loaded) {
    const profile = normalizeProfile(loaded.profile);
    return {
      ...createState(),
      ...loaded,
      profile,
      power: normalizePower(profile, loaded.power),
      stats: { ...STORY.defaultStats, ...(loaded.stats || {}) },
      relationships: { ...STORY.defaultRelationships, ...(loaded.relationships || {}) },
      npcs: normalizeNpcStates(loaded.npcs, { ...STORY.defaultRelationships, ...(loaded.relationships || {}) }),
      status: { ...STORY.defaultStatus, ...(loaded.status || {}) },
      clock: normalizeClock(loaded.clock),
      tasks: normalizeTasks(loaded.tasks),
      flags: loaded.flags || {},
      history: loaded.history || [],
      chapterSnapshots: loaded.chapterSnapshots || {}
    };
  }

  function normalizeProfile(loadedProfile) {
    const profile = { ...defaultProfile(), ...(loadedProfile || {}) };
    if (!AVATAR_CATALOG[profile.gender]) profile.gender = "neutral";
    if (!PRONOUNS.some((pronoun) => pronoun.id === profile.pronouns)) {
      profile.pronouns = profile.gender === "female" ? "she" : profile.gender === "neutral" ? "they" : "he";
    }
    const avatarDef = getAvatarDef(profile.gender, profile.avatarId);
    profile.avatarId = avatarDef.id;
    profile.avatar = avatarDef.portrait;
    if (!POWER_CATALOG.some((power) => power.id === profile.powerId)) profile.powerId = "energy";
    profile.age = 24;
    return profile;
  }

  function defaultProfile() {
    const avatarDef = getAvatarDef("male", "male-1");
    return {
      name: "Trainee",
      age: 24,
      gender: "male",
      pronouns: "he",
      avatarId: "male-1",
      avatar: avatarDef.portrait,
      powerId: "energy",
      matureContent: false
    };
  }

  function defaultClock() {
    return {
      day: 1,
      minute: START_TIME_MINUTES,
      fatigue: 0,
      fatigueWarning: false,
      hardWarning: false
    };
  }

  function defaultPowerState(powerId) {
    const def = getPower(powerId);
    return {
      id: def.id,
      name: def.name,
      level: 1,
      xp: 0,
      milestones: [def.milestones[0]]
    };
  }

  function normalizePower(profile, loadedPower) {
    const profilePowerId = (profile && profile.powerId) || "energy";
    const loadedPowerId = loadedPower && POWER_CATALOG.some((power) => power.id === loadedPower.id)
      ? loadedPower.id
      : profilePowerId;
    const base = defaultPowerState(loadedPowerId);
    const merged = { ...base, ...(loadedPower || {}), id: loadedPowerId };
    const def = getPower(merged.id);
    merged.name = def.name;
    merged.level = Math.max(1, Math.min(10, merged.level || 1));
    merged.xp = Math.max(0, merged.xp || 0);
    merged.milestones = Array.from(new Set([
      def.milestones[0],
      ...(merged.milestones || []).filter((milestone) => def.milestones.includes(milestone))
    ]));
    return merged;
  }

  function normalizeClock(loadedClock) {
    const base = defaultClock();
    const clock = { ...base, ...(loadedClock || {}) };
    clock.day = Math.max(1, Number(clock.day) || 1);
    clock.minute = Math.max(0, Number(clock.minute) || START_TIME_MINUTES);
    while (clock.minute >= 24 * 60) {
      clock.day += 1;
      clock.minute -= 24 * 60;
    }
    clock.fatigue = clamp(Number(clock.fatigue) || 0, 0, 14);
    clock.fatigueWarning = Boolean(clock.fatigueWarning);
    clock.hardWarning = Boolean(clock.hardWarning);
    return clock;
  }

  function normalizeTasks(loadedTasks) {
    return Object.entries(loadedTasks || {}).reduce((acc, [chapterId, bucket]) => {
      const completed = Object.entries((bucket && bucket.completed) || {}).reduce((taskAcc, [taskId, count]) => {
        taskAcc[taskId] = Math.max(0, Number(count) || 0);
        return taskAcc;
      }, {});
      acc[chapterId] = {
        used: Math.max(0, Number(bucket && bucket.used) || 0),
        completed
      };
      return acc;
    }, {});
  }

  function defaultNpcStates() {
    return Object.keys(STORY.defaultRelationships).reduce((acc, name) => {
      acc[name] = createNpcState(name, STORY.defaultRelationships[name] || 0);
      return acc;
    }, {});
  }

  function createNpcState(name, relationshipValue = 0) {
    return {
      trust: clamp(relationshipValue, 0, 10),
      attraction: 0,
      respect: clamp(Math.ceil(relationshipValue / 2), 0, 10),
      friction: 0,
      concern: 0,
      romance: "None",
      memories: [],
      agency: ""
    };
  }

  function normalizeNpcStates(loadedNpcs, relationships) {
    const base = defaultNpcStates();
    Object.keys(base).forEach((name) => {
      const loaded = (loadedNpcs && loadedNpcs[name]) || {};
      base[name] = {
        ...base[name],
        ...loaded,
        trust: clamp(Number(loaded.trust ?? base[name].trust), 0, 10),
        attraction: clamp(Number(loaded.attraction ?? base[name].attraction), 0, 10),
        respect: clamp(Number(loaded.respect ?? base[name].respect), 0, 10),
        friction: clamp(Number(loaded.friction ?? base[name].friction), 0, 10),
        concern: clamp(Number(loaded.concern ?? base[name].concern), 0, 10),
        romance: loaded.romance || base[name].romance,
        memories: Array.isArray(loaded.memories) ? loaded.memories.slice(-5) : [],
        agency: loaded.agency || ""
      };
      if (relationships && relationships[name] > 0 && !loaded.trust) {
        base[name].trust = clamp(relationships[name], 0, 10);
      }
    });
    return base;
  }

  function restartChapter(chapterId) {
    const snapshot = state.chapterSnapshots[String(chapterId)];
    if (snapshot) {
      const snapshots = state.chapterSnapshots;
      state = normalizeState({ ...clone(snapshot), chapterSnapshots: snapshots });
      save(AUTO_KEY);
      render({ scroll: true });
      return;
    }

    const chapter = getChapter(chapterId);
    enterScene(chapter.start);
  }

  function captureChapterSnapshot(scene) {
    const key = String(scene.chapter);
    if (state.chapterSnapshots[key]) return;
    state.chapterSnapshots[key] = {
      version: state.version,
      currentScene: state.currentScene,
      profile: clone(state.profile),
      power: clone(state.power),
      flags: clone(state.flags),
      stats: clone(state.stats),
      relationships: clone(state.relationships),
      npcs: clone(state.npcs),
      status: clone(state.status),
      clock: clone(state.clock || defaultClock()),
      tasks: clone(state.tasks || {}),
      history: clone(state.history),
      startedAt: state.startedAt,
      updatedAt: Date.now()
    };
  }

  function applyEffects(effects) {
    const notices = [];
    let trainingXp = 0;
    effects.forEach((effect) => {
      if (effect.type === "flag") {
        state.flags[effect.key] = effect.value;
        if (effect.value) {
          syncRomanceFromFlag(effect.key);
          applyFlagMemory(effect.key);
        }
      }
      if (effect.type === "stat") {
        state.stats[effect.key] = (state.stats[effect.key] || 0) + effect.delta;
        if (["control", "restraint", "heat", "cold", "resolve"].includes(effect.key)) {
          trainingXp += Math.max(0, effect.delta || 0);
        }
      }
      if (effect.type === "powerXp") {
        trainingXp += Math.max(0, effect.amount || 0);
      }
      if (effect.type === "relationship") {
        applyRelationshipDelta(effect.key, effect.delta);
      }
      if (effect.type === "npc") {
        applyNpcDeltas(effect.key, effect);
      }
      if (effect.type === "memory") {
        addNpcMemory(effect.key, effect.text);
      }
      if (effect.type === "romance") {
        setRomanceState(effect.key, effect.status || "Spark");
      }
      if (effect.type === "status") {
        state.status[effect.key] = effect.value;
      }
      if (effect.note && !effect.hidden) notices.push(effect.note);
    });
    const levelNotice = gainPowerXp(trainingXp);
    if (levelNotice) notices.push(levelNotice);
    notices.push(...runNpcAgency());
    return notices;
  }

  function choiceMinutes(choice, scene, nextScene) {
    if (typeof choice.timeMinutes === "number") return Math.max(0, choice.timeMinutes);
    if (nextScene && nextScene.chapter > scene.chapter) return 30;
    const trainingKeys = new Set(["control", "restraint", "heat", "cold", "resolve"]);
    const effects = choice.effects || [];
    if (effects.some((effect) => effect.type === "powerXp" || (effect.type === "stat" && trainingKeys.has(effect.key)))) {
      return 30;
    }
    return ((choice.text.length + scene.title.length) % 2 === 0) ? 15 : 30;
  }

  function advanceClock(minutes, reason, options = {}) {
    const notices = [];
    if (!state.clock) state.clock = defaultClock();
    const beforePenalty = fatiguePenalty();
    state.clock.minute += Math.max(0, Math.round(minutes || 0));
    while (state.clock.minute >= 24 * 60) {
      state.clock.day += 1;
      state.clock.minute -= 24 * 60;
    }

    if (options.rest) {
      const beforeFatigue = state.clock.fatigue;
      state.clock.fatigue = clamp(state.clock.fatigue + (options.fatigue || -9), 0, 14);
      state.clock.fatigueWarning = false;
      state.clock.hardWarning = false;
      state.status.condition = "Recovered";
      state.status.stress = "Low";
      if (beforeFatigue >= FATIGUE_WARNING) notices.push("Rest clears the fatigue penalty. Your control checks are back to normal.");
      else notices.push("You bank real rest before the file can turn it into another liability.");
      return notices;
    }

    state.clock.fatigue = clamp(state.clock.fatigue + (options.fatigue || 0.5), 0, 14);
    if (state.clock.fatigue >= FATIGUE_WARNING) {
      state.status.condition = "Fatigued";
      state.status.stress = "High";
      if (!state.clock.fatigueWarning) {
        state.clock.fatigueWarning = true;
        notices.push("Fatigue is now active. Until you rest, control, restraint, and resolve checks take a small penalty.");
      }
    }
    if (state.clock.fatigue >= FATIGUE_HARD_WARNING && !state.clock.hardWarning) {
      state.clock.hardWarning = true;
      notices.push(`${reason} pushes you past the smart limit. Rest soon or the penalty deepens.`);
    }
    if (fatiguePenalty() > beforePenalty && beforePenalty > 0) {
      notices.push("The fatigue penalty deepens. The next careful choice will cost more focus than it should.");
    }
    return notices;
  }

  function applyRelationshipDelta(name, delta) {
    state.relationships[name] = (state.relationships[name] || 0) + delta;
    const npc = ensureNpcState(name);
    if (delta >= 0) {
      npc.trust = clamp(npc.trust + delta, 0, 10);
      npc.respect = clamp(npc.respect + Math.ceil(delta / 2), 0, 10);
      if (npc.romance !== "None" && npc.romance !== "Trusted partner") {
        npc.attraction = clamp(npc.attraction + Math.ceil(delta / 2), 0, 10);
      }
    } else {
      npc.trust = clamp(npc.trust + delta, 0, 10);
      npc.friction = clamp(npc.friction + Math.abs(delta), 0, 10);
    }
  }

  function applyNpcDeltas(name, effect) {
    const npc = ensureNpcState(name);
    NPC_DIMENSIONS.forEach((dimension) => {
      if (typeof effect[dimension] === "number") {
        npc[dimension] = clamp(npc[dimension] + effect[dimension], 0, 10);
      }
    });
    if (effect.agency) npc.agency = effect.agency;
    if (effect.memory) addNpcMemory(name, effect.memory);
  }

  function syncRomanceFromFlag(flag) {
    const item = ROMANCE_FLAG_MAP[flag];
    if (!item) return;
    setRomanceState(item[0], item[1]);
  }

  function setRomanceState(name, status) {
    const npc = ensureNpcState(name);
    const oldStatus = npc.romance;
    npc.romance = romanceRank(status) >= romanceRank(oldStatus) ? status : oldStatus;
    if (npc.romance !== "None" && npc.romance !== "Trusted partner") {
      npc.attraction = clamp(npc.attraction + 2, 0, 10);
    }
  }

  function romanceRank(status) {
    const ranks = {
      None: 0,
      "Trusted partner": 1,
      "Slow burn": 2,
      Spark: 3,
      Committed: 4
    };
    return ranks[status] || 0;
  }

  function applyFlagMemory(flag) {
    (MEMORY_BY_FLAG[flag] || []).forEach(([name, text]) => addNpcMemory(name, text));
  }

  function addNpcMemory(name, text) {
    if (!text) return;
    const npc = ensureNpcState(name);
    if (npc.memories.includes(text)) return;
    npc.memories.push(text);
    npc.memories = npc.memories.slice(-5);
  }

  function runNpcAgency() {
    const notices = [];

    if (state.flags.rheaErased && !state.flags.agencyTheoRheaErased) {
      state.flags.agencyTheoRheaErased = true;
      applyNpcDeltas("Theo", {
        concern: 3,
        friction: 1,
        agency: "Theo will not rubber-stamp lethal certainty just because it worked once."
      });
      notices.push("Theo stops smoothing over the math. If you keep choosing lethal certainty, he may stay close emotionally and still refuse the plan.");
    }

    if (state.flags.rheaContained && !state.flags.agencyCamilleContainment) {
      state.flags.agencyCamilleContainment = true;
      applyNpcDeltas("Camille", {
        respect: 2,
        trust: 1,
        agency: "Camille is more willing to build with you when control remains part of the design."
      });
      notices.push("Camille adjusts her read on you: restraint under pressure is now evidence, not optimism.");
    }

    if ((state.stats.collateral || 0) >= 4 && !state.flags.agencyPiperCollateral) {
      state.flags.agencyPiperCollateral = true;
      applyNpcDeltas("Piper", {
        concern: 2,
        friction: 2,
        agency: "Piper will push back when the fun starts sounding like collateral."
      });
      notices.push("Piper keeps the grin, but the next joke has a warning under it: collateral is not a punchline.");
    }

    if ((state.stats.aegisFear || 0) >= 5 && !state.flags.agencyFearBoundary) {
      state.flags.agencyFearBoundary = true;
      ["Camille", "Theo"].forEach((name) => applyNpcDeltas(name, { concern: 2 }));
      notices.push("Your file is starting to scare the people who like you. That does not erase the bond, but it changes how they argue with you.");
    }

    const committed = MAIN_NPCS.filter((name) => ensureNpcState(name).romance === "Committed");
    if (committed.length > 1 && !state.flags.romanceTension) {
      state.flags.romanceTension = true;
      committed.forEach((name) => applyNpcDeltas(name, { friction: 1, concern: 1 }));
      notices.push("The emotional math is no longer invisible. If you commit to more than one person, honesty becomes part of the route, not a bonus scene.");
    }

    return notices;
  }

  function gainPowerXp(amount) {
    if (!amount || amount <= 0) return "";
    if (!state.power) state.power = defaultPowerState(state.profile.powerId);
    const def = getPower(state.power.id);
    const oldLevel = state.power.level;
    state.power.xp += amount;
    while (state.power.level < 10 && state.power.xp >= POWER_THRESHOLDS[state.power.level]) {
      state.power.level += 1;
      const milestone = def.milestones[state.power.level - 1];
      if (milestone && !state.power.milestones.includes(milestone)) {
        state.power.milestones.push(milestone);
      }
    }
    if (state.power.level > oldLevel) {
      const milestone = state.power.milestones[state.power.milestones.length - 1];
      state.status.energy = `${def.name} Level ${state.power.level}`;
      return `${def.name} grew to Level ${state.power.level}: ${milestone}.`;
    }
    return "";
  }

  function resolveNext(choice) {
    if (typeof choice.next === "string") return choice.next;
    if (!choice.next || !choice.next.cases) return STORY.initialScene;
    const found = choice.next.cases.find((item) => checkConditions(item.conditions || []));
    return found ? found.scene : choice.next.default;
  }

  function getSceneText(scene) {
    const text = [];
    (scene.variants || []).forEach((variant) => {
      if (checkConditions(variant.conditions || [])) {
        text.push(...variant.text);
      }
    });
    text.push(...(scene.text || []));
    return text;
  }

  function getVisibleChoices(scene) {
    return (scene.choices || []).filter((choice) => checkConditions(choice.conditions || []));
  }

  function pushChapterSummary(chapterId) {
    const chapter = getChapter(chapterId);
    const lines = buildChapterSummary(chapterId);
    state.history.push({
      type: "chapterSummary",
      title: `Chapter ${chapter.id} Complete: ${chapter.title}`,
      lines,
      at: Date.now()
    });
  }

  function buildChapterSummary(chapterId) {
    const chapter = getChapter(chapterId);
    const snapshot = state.chapterSnapshots[String(chapterId)] || {};
    const power = state.power || defaultPowerState(state.profile.powerId);
    const startPower = snapshot.power || defaultPowerState(state.profile.powerId);
    const relationshipLine = relationshipRecap(snapshot.relationships || {});
    const consequenceLine = consequenceRecap(snapshot.flags || {});
    const status = `Status: ${state.status.condition}; stress ${state.status.stress}; classification ${state.status.classification}.`;
    const clockLine = `Time: ${formatClock()}; fatigue ${fatigueLabel()}.`;
    const powerLine = power.level > (startPower.level || 1)
      ? `Power growth: ${power.name} rose from Level ${startPower.level || 1} to Level ${power.level}. Current unlock: ${power.milestones[power.milestones.length - 1]}.`
      : `Power state: ${power.name} Level ${power.level}. Current unlock: ${power.milestones[power.milestones.length - 1]}.`;

    return [
      CHAPTER_RECAPS[chapterId] || `${chapter.title} changed the shape of the file.`,
      powerLine,
      clockLine,
      relationshipLine,
      consequenceLine,
      status
    ];
  }

  function relationshipRecap(startRelationships) {
    const changes = Object.entries(state.relationships)
      .map(([name, value]) => [name, value - (startRelationships[name] || 0)])
      .filter(([, delta]) => delta !== 0)
      .sort((a, b) => Math.abs(b[1]) - Math.abs(a[1]))
      .slice(0, 4);
    if (!changes.length) return "Bonds: no major visible shift.";
    const parts = changes.map(([name, delta]) => `${name} ${delta > 0 ? "warmed" : "cooled"}`);
    return `Bonds: ${parts.join(", ")}.`;
  }

  function consequenceRecap(startFlags) {
    const found = CONSEQUENCE_RECAPS.find(([flag]) => state.flags[flag] && !startFlags[flag]);
    if (found) return `Consequence: ${found[1]}`;
    return "Consequence: Aegis recorded more than it explained.";
  }

  function checkConditions(conditions) {
    return conditions.every((condition) => {
      if (condition.type === "any") return (condition.conditions || []).some((item) => checkConditions([item]));
      if (condition.type === "all") return checkConditions(condition.conditions || []);
      if (condition.type === "flag") return Boolean(state.flags[condition.key]);
      if (condition.type === "notFlag") return !state.flags[condition.key];
      if (condition.type === "statAtLeast") return effectiveStat(condition.key) >= condition.value;
      if (condition.type === "statBelow") return effectiveStat(condition.key) < condition.value;
      if (condition.type === "powerLevelAtLeast") return ((state.power && state.power.level) || 1) >= condition.value;
      if (condition.type === "powerIs") return ((state.profile && state.profile.powerId) || "energy") === condition.value;
      if (condition.type === "matureContent") return Boolean(state.profile && state.profile.matureContent);
      if (condition.type === "npcAtLeast") return (ensureNpcState(condition.key)[condition.dimension] || 0) >= condition.value;
      if (condition.type === "relationshipAtLeast") return (state.relationships[condition.key] || 0) >= condition.value;
      if (condition.type === "relationshipBelow") return (state.relationships[condition.key] || 0) < condition.value;
      return true;
    });
  }

  function getScene(sceneId) {
    return STORY.scenes[sceneId] || STORY.scenes[STORY.initialScene];
  }

  function getChapter(chapterId) {
    return STORY.chapters.find((chapter) => chapter.id === chapterId) || STORY.chapters[0];
  }

  function getFocus(name) {
    if (!name || name === "Seth") {
      const def = getPower((state.profile && state.profile.powerId) || "energy");
      return {
        name: state.profile.name,
        role: `Age 24 | ${def.name} Variant`,
        portrait: state.profile.avatar
      };
    }
    const character = STORY.characters[name] || STORY.characters.Seth;
    return {
      ...character,
      role: character.age ? `Age ${character.age} | ${character.role}` : character.role
    };
  }

  function paragraphNode(text) {
    const p = document.createElement("p");
    p.textContent = formatText(text);
    return p;
  }

  function speakerTile(speakerKey, statusText) {
    const focus = getFocus(speakerKey);
    const tile = document.createElement("div");
    tile.className = "speaker-tile";

    const status = document.createElement("span");
    status.className = "speaker-status";
    status.textContent = statusText;

    const img = document.createElement("img");
    img.className = "speaker-portrait";
    img.src = focus.portrait;
    img.alt = `${displaySpeaker(speakerKey)} portrait`;

    const name = document.createElement("span");
    name.className = "speaker-name";
    name.textContent = displaySpeaker(speakerKey);

    tile.append(status, img, name);
    return tile;
  }

  function pickFightStats() {
    return {
      control: effectiveStat("control"),
      restraint: effectiveStat("restraint"),
      exposure: state.stats.exposure || 0,
      collateral: state.stats.collateral || 0
    };
  }

  function getAttributeValues() {
    const powerLevel = (state.power && state.power.level) || 1;
    return {
      power: Math.min(10, powerLevel + Math.ceil(((state.stats.heat || 0) + (state.stats.cold || 0) + effectiveStat("audacity")) / 3)),
      control: Math.min(10, 2 + effectiveStat("control")),
      restraint: Math.min(10, 2 + effectiveStat("restraint")),
      instinct: Math.min(10, 2 + Math.ceil((effectiveStat("audacity") + effectiveStat("resolve")) / 2)),
      insight: Math.min(10, 2 + Math.ceil(((state.relationships.Theo || 0) + (state.relationships.Julian || 0) + (state.stats.contractorPath || 0)) / 4)),
      resolve: Math.min(10, 2 + effectiveStat("resolve") + Math.floor(powerLevel / 3))
    };
  }

  function effectiveStat(key) {
    const base = state.stats[key] || 0;
    if (["control", "restraint", "resolve", "audacity"].includes(key)) {
      return Math.max(0, base - fatiguePenalty());
    }
    return base;
  }

  function fatiguePenalty() {
    const fatigue = (state.clock && state.clock.fatigue) || 0;
    if (fatigue >= FATIGUE_HARD_WARNING) return 2;
    if (fatigue >= FATIGUE_WARNING) return 1;
    return 0;
  }

  function polygonPoints(count, cx, cy, radius) {
    return Array.from({ length: count }, (_, index) => {
      const angle = (-90 + index * (360 / count)) * Math.PI / 180;
      return `${cx + Math.cos(angle) * radius},${cy + Math.sin(angle) * radius}`;
    }).join(" ");
  }

  function ensureNpcState(name) {
    if (!state.npcs) state.npcs = defaultNpcStates();
    if (!state.npcs[name]) state.npcs[name] = createNpcState(name, state.relationships[name] || 0);
    return state.npcs[name];
  }

  function clamp(value, min, max) {
    return Math.max(min, Math.min(max, Number.isFinite(value) ? value : min));
  }

  function signalName(value) {
    if (value >= 10) return "Locked";
    if (value >= 6) return "Strong";
    if (value >= 3) return "Warm";
    if (value <= -2) return "Tense";
    return "Open";
  }

  function formatClock(clock = state.clock || defaultClock()) {
    const total = Math.max(0, Math.round(clock.minute || 0));
    const hour24 = Math.floor(total / 60) % 24;
    const minute = total % 60;
    const suffix = hour24 >= 12 ? "PM" : "AM";
    const hour12 = hour24 % 12 || 12;
    return `Day ${clock.day || 1}, ${hour12}:${String(minute).padStart(2, "0")} ${suffix}`;
  }

  function fatigueLabel() {
    const fatigue = (state.clock && state.clock.fatigue) || 0;
    if (fatigue >= FATIGUE_HARD_WARNING) return `Overdrawn (${fatigue.toFixed(1)}/14)`;
    if (fatigue >= FATIGUE_WARNING) return `Tired (${fatigue.toFixed(1)}/14)`;
    if (fatigue >= 4) return `Warmed up (${fatigue.toFixed(1)}/14)`;
    return `Fresh (${fatigue.toFixed(1)}/14)`;
  }

  function currentFinalPath() {
    const paths = [
      ["finalHero", "Sanctioned hero"],
      ["finalContractor", "Aegis contractor"],
      ["finalIndependent", "Independent operator"],
      ["finalFoundation", "Foundation power"],
      ["finalVillain", "Self-rule"],
      ["finalCivilian", "Civilian control"],
      ["finalOpen", "Unnamed"]
    ];
    const found = paths.find(([flag]) => state.flags[flag]);
    return found ? found[1] : "Undecided";
  }

  function endingRationale() {
    const strongest = strongestRelationship();
    const power = state.power || defaultPowerState(state.profile.powerId);
    const pathStats = [
      ["Hero", state.stats.heroPath || 0],
      ["Contractor", state.stats.contractorPath || 0],
      ["Independent", state.stats.independentPath || 0],
      ["Foundation", state.stats.foundationPath || 0],
      ["Self-rule", state.stats.villainPath || 0],
      ["Civilian", state.stats.civilianPath || 0]
    ].sort((a, b) => b[1] - a[1]).slice(0, 2);
    const rhea = state.flags.rheaErased
      ? "Rhea was erased, so Aegis fear and moral fallout followed you into the finale."
      : state.flags.rheaContained
        ? "Rhea was contained, so restraint became one of your strongest arguments."
        : state.flags.rheaEscaped
          ? "Rhea escaped, leaving the future open with an active threat in the margins."
          : "Rhea's attack still shaped how everyone read your control.";
    const romance = MAIN_NPCS
      .map((name) => [name, ensureNpcState(name).romance])
      .filter(([, status]) => status !== "None")
      .map(([name, status]) => `${name}: ${status}`)
      .join(", ") || "No locked romance route";

    return [
      `Final route: ${currentFinalPath()}.`,
      `Strongest bond: ${strongest.name} (${signalName(strongest.value)}).`,
      `Relationship routes: ${romance}.`,
      `Power state: ${power.name} Level ${power.level}, with ${power.milestones[power.milestones.length - 1]}.`,
      `Power implication: ${powerImplication(power.id, power.level)}.`,
      `Path pressure: ${pathStats.map(([label, value]) => `${label} ${value}`).join(", ")}.`,
      rhea,
      state.flags.romanceTension ? "Romance consequence: multiple commitments made honesty a required part of the ending." : "Romance consequence: no unresolved multi-commitment tension was triggered."
    ];
  }

  function powerImplication(powerId, level) {
    const scope = level >= 7 ? "city-scale" : level >= 4 ? "field-ready" : "unstable";
    const lines = {
      energy: `your reservoir is now ${scope} leverage, useful anywhere force can be taken or returned`,
      gravity: `your mass control is now ${scope} leverage, changing fights by changing what movement costs`,
      chronal: `your time control is now ${scope} leverage, making timing itself part of your moral footprint`,
      bio: `your biokinesis is now ${scope} leverage, turning survival and harm into choices you have to own`,
      tech: `your technopathy is now ${scope} leverage, because infrastructure has started listening back`,
      space: `your spatial folding is now ${scope} leverage, making distance a rule you can negotiate`
    };
    return lines[powerId] || lines.energy;
  }

  function strongestRelationship() {
    const entries = Object.entries(state.relationships);
    if (!entries.length) return { name: "None", value: 0 };
    const [name, value] = entries.sort((a, b) => b[1] - a[1])[0];
    return { name, value };
  }

  function getPower(powerId) {
    return POWER_CATALOG.find((power) => power.id === powerId) || POWER_CATALOG[0];
  }

  function getAvatarDef(gender, avatarId) {
    const group = AVATAR_CATALOG[gender] || AVATAR_CATALOG.neutral;
    return group.find((avatar) => avatar.id === avatarId) || group[0];
  }

  function displaySpeaker(speaker) {
    return speaker === "Seth" ? state.profile.name : speaker;
  }

  function formatText(rawText) {
    let text = String(rawText || "");
    const profile = state.profile || defaultProfile();
    const power = getPower(profile.powerId);
    const terms = power.terms;
    text = text.replace(/\bMr\. Seth\b/g, `Mr. ${profile.name.split(" ").slice(-1)[0] || profile.name}`);
    text = text.replace(/\bSeth Cormac\b/g, profile.name);
    text = text.replace(/\bSeth\b/g, profile.name);
    if (power.id !== "energy") {
      const replacements = [
        [/\bEnergy Sink\b/g, power.codename],
        [/\bAbsorption Variant\b/g, `${power.name} Variant`],
        [/\babsorption variant\b/g, `${power.name.toLowerCase()} variant`],
        [/\bthermal\b/gi, terms.adjective],
        [/\bthermokinetic\b/gi, terms.adjective],
        [/\bthermo\b/gi, terms.adjective],
        [/\bheat\b/gi, terms.force],
        [/\bcold\b/gi, terms.counterforce],
        [/\bfire\b/gi, terms.display],
        [/\bflame\b/gi, terms.spark],
        [/\bplasma\b/gi, terms.highOutput],
        [/\bice\b/gi, terms.containment],
        [/\blightning\b/gi, terms.finisher]
      ];
      replacements.forEach(([pattern, replacement]) => {
        text = text.replace(pattern, replacement);
      });
    }
    return text;
  }

  function applyTheme(theme) {
    const dark = theme === "dark";
    document.body.classList.toggle("dark-mode", dark);
    localStorage.setItem(THEME_KEY, dark ? "dark" : "light");
    if (els.darkModeToggle) els.darkModeToggle.checked = dark;
  }

  function updateAutosaveStatus() {
    if (!els.autosaveStatus || !state) return;
    const scene = getScene(state.currentScene);
    const time = new Date(state.updatedAt || Date.now()).toLocaleTimeString([], {
      hour: "numeric",
      minute: "2-digit"
    });
    els.autosaveStatus.textContent = `Autosaved ${time} - ${scene.title}`;
  }

  function labelize(key) {
    return key.replace(/([A-Z])/g, " $1").replace(/^./, (char) => char.toUpperCase());
  }

  function confirmAction(title, body, onConfirm) {
    els.confirmTitle.textContent = title;
    els.confirmBody.textContent = body;
    const handler = (event) => {
      els.confirmDialog.removeEventListener("close", handler);
      if (event.target.returnValue === "confirm") onConfirm();
    };
    els.confirmDialog.addEventListener("close", handler);
    els.confirmDialog.showModal();
  }

  function clone(value) {
    return JSON.parse(JSON.stringify(value));
  }
})();
