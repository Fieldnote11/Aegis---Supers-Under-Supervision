#!/usr/bin/env node
"use strict";

const fs = require("node:fs");
const path = require("node:path");
const http = require("node:http");
const { spawn } = require("node:child_process");

const root = path.resolve(__dirname, "..");
const buildDir = path.join(root, "build");
let pageUrl = "";
const autoKey = "aegis-choice-game:autosave";
const themeKey = "aegis-choice-game:theme";
const slotKey = (slot) => `aegis-choice-game:slot:${slot}`;
const chromePath = findChrome();
const port = 9300 + Math.floor(Math.random() * 400);
const profileDir = path.join(buildDir, `chrome-smoke-${port}`);

fs.mkdirSync(buildDir, { recursive: true });
fs.mkdirSync(profileDir, { recursive: true });

main().catch((error) => {
  console.error(error.stack || error.message || error);
  process.exitCode = 1;
});

async function main() {
  if (!global.WebSocket) throw new Error("This smoke test needs a Node runtime with global WebSocket support.");
  const staticServer = await startStaticServer();
  pageUrl = `http://127.0.0.1:${staticServer.address().port}/index.html`;
  const chrome = spawn(chromePath, [
    "--headless=new",
    "--disable-gpu",
    "--no-first-run",
    "--no-default-browser-check",
    "--remote-allow-origins=*",
    `--remote-debugging-port=${port}`,
    `--user-data-dir=${profileDir}`,
    "about:blank"
  ], { stdio: ["ignore", "pipe", "pipe"] });

  let stderr = "";
  chrome.stderr.on("data", (chunk) => {
    stderr += chunk.toString();
  });

  try {
    await waitForChrome();
    const results = [];
    results.push(await smokeViewport({ name: "mobile", width: 390, height: 844, mobile: true, exerciseEngine: true }));
    results.push(await smokeViewport({ name: "desktop", width: 1440, height: 900, mobile: false, exerciseEngine: false }));
    results.forEach((result) => {
      console.log(`${result.name}: viewport ${result.layout.width}x${result.layout.height}, overflow ${result.layout.overflow.length}, dark overflow ${result.dark.layout.overflow.length}, screenshot ${path.relative(root, result.screenshot)}`);
    });
    console.log("Browser smoke: old save normalization, autosave, manual save, training, and rest checks passed.");
  } finally {
    chrome.kill();
    staticServer.close();
    if (stderr.includes("FATAL")) {
      console.error(stderr.trim());
    }
  }
}

function startStaticServer() {
  const server = http.createServer((request, response) => {
    const url = new URL(request.url, "http://127.0.0.1");
    if (url.pathname === "/favicon.ico") {
      response.writeHead(204);
      response.end();
      return;
    }
    const requestPath = url.pathname === "/" ? "/index.html" : url.pathname;
    const filePath = path.resolve(root, `.${decodeURIComponent(requestPath)}`);
    if (!filePath.startsWith(root)) {
      response.writeHead(403);
      response.end("Forbidden");
      return;
    }
    fs.readFile(filePath, (error, data) => {
      if (error) {
        response.writeHead(404);
        response.end("Not found");
        return;
      }
      response.writeHead(200, { "Content-Type": contentType(filePath) });
      response.end(data);
    });
  });
  return new Promise((resolve) => {
    server.listen(0, "127.0.0.1", () => resolve(server));
  });
}

function contentType(filePath) {
  const ext = path.extname(filePath).toLowerCase();
  const types = {
    ".html": "text/html; charset=utf-8",
    ".css": "text/css; charset=utf-8",
    ".js": "text/javascript; charset=utf-8",
    ".json": "application/json; charset=utf-8",
    ".webmanifest": "application/manifest+json; charset=utf-8",
    ".svg": "image/svg+xml",
    ".png": "image/png"
  };
  return types[ext] || "application/octet-stream";
}

async function smokeViewport(viewport) {
  const target = await requestJson(`/json/new?${encodeURIComponent("about:blank")}`, { method: "PUT" });
  const cdp = await Cdp.connect(target.webSocketDebuggerUrl);
  const problems = [];
  cdp.onEvent((message) => {
    if (message.method === "Runtime.exceptionThrown") {
      problems.push(`Runtime exception: ${message.params.exceptionDetails.text}`);
    }
    if (message.method === "Runtime.consoleAPICalled" && message.params.type === "error") {
      const args = message.params.args || [];
      problems.push(`Console error: ${args.map((arg) => arg.value || arg.description || "").join(" ")}`);
    }
    if (message.method === "Log.entryAdded" && message.params.entry.level === "error") {
      const entry = message.params.entry;
      problems.push(`Log error: ${entry.text}${entry.url ? ` (${entry.url})` : ""}`);
    }
  });

  await cdp.send("Page.enable");
  await cdp.send("Runtime.enable");
  await cdp.send("Log.enable");
  await cdp.send("Emulation.setDeviceMetricsOverride", {
    width: viewport.width,
    height: viewport.height,
    deviceScaleFactor: 1,
    mobile: viewport.mobile
  });
  if (viewport.mobile) {
    await cdp.send("Emulation.setTouchEmulationEnabled", { enabled: true });
  }

  await navigate(cdp, pageUrl);
  await delay(400);

  await evalValue(cdp, "localStorage.clear(); true");
  await navigate(cdp, pageUrl);
  await delay(400);

  if (viewport.mobile) {
    await exerciseCreator(cdp);
  }

  const layout = await inspectLayout(cdp);
  if (layout.overflow.length) {
    throw new Error(`${viewport.name} layout overflow:\n${JSON.stringify(layout.overflow, null, 2)}`);
  }
  if (layout.scrollOverflow > 1) {
    throw new Error(`${viewport.name} document has horizontal overflow of ${layout.scrollOverflow}px.`);
  }

  const screenshot = path.join(buildDir, `browser-${viewport.name}.png`);
  const capture = await cdp.send("Page.captureScreenshot", { format: "png", captureBeyondViewport: false });
  fs.writeFileSync(screenshot, Buffer.from(capture.data, "base64"));

  const dark = await inspectDarkMode(cdp, viewport.name);

  if (viewport.exerciseEngine) {
    await exerciseOldSaveAndTasks(cdp);
  }

  await delay(100);
  if (problems.length) throw new Error(`${viewport.name} browser problems:\n${problems.join("\n")}`);
  cdp.close();
  return { name: viewport.name, layout, dark, screenshot };
}

async function inspectDarkMode(cdp, viewportName) {
  await evalValue(cdp, `localStorage.setItem(${JSON.stringify(themeKey)}, "dark"); true`);
  await navigate(cdp, pageUrl);
  await delay(300);
  const layout = await inspectLayout(cdp);
  if (layout.overflow.length) {
    throw new Error(`${viewportName} dark-mode layout overflow:\n${JSON.stringify(layout.overflow, null, 2)}`);
  }
  if (layout.scrollOverflow > 1) {
    throw new Error(`${viewportName} dark-mode document has horizontal overflow of ${layout.scrollOverflow}px.`);
  }
  const colors = await evalValue(cdp, `(() => {
    const sample = (selector) => getComputedStyle(document.querySelector(selector)).backgroundColor;
    return {
      dark: document.body.classList.contains("dark-mode"),
      dialog: sample(".start-dialog"),
      panel: sample(".pause-section"),
      button: sample(".text-btn")
    };
  })()`);
  if (!colors.dark) throw new Error(`${viewportName} did not apply dark mode from saved theme.`);
  const harsh = Object.entries(colors).filter(([key, color]) => key !== "dark" && isHarshWhite(color));
  if (harsh.length) throw new Error(`${viewportName} dark mode still has harsh white surfaces: ${JSON.stringify(colors)}`);
  const screenshot = path.join(buildDir, `browser-${viewportName}-dark.png`);
  const capture = await cdp.send("Page.captureScreenshot", { format: "png", captureBeyondViewport: false });
  fs.writeFileSync(screenshot, Buffer.from(capture.data, "base64"));
  return { layout, colors, screenshot };
}

async function exerciseCreator(cdp) {
  await evalValue(cdp, "document.querySelector('#showCreatorBtn').click(); true");
  await delay(150);
  const creator = await evalValue(cdp, `(() => {
    const input = document.querySelector("#playerNameInput");
    const avatarImages = [...document.querySelectorAll("#avatarChoices img")];
    return {
      visible: !document.querySelector("#creatorView").classList.contains("hidden"),
      nameValue: input.value,
      avatarCount: avatarImages.length,
      loadedAvatars: avatarImages.filter((img) => img.complete && img.naturalWidth > 0).length,
      powerCount: document.querySelectorAll("#powerChoices .power-card").length
    };
  })()`);
  if (!creator.visible) throw new Error("Creator view did not open.");
  if (creator.nameValue !== "") throw new Error("Creator name input should start blank.");
  if (creator.avatarCount !== 5 || creator.loadedAvatars !== 5) throw new Error(`Expected 5 loaded avatar options, saw ${creator.loadedAvatars}/${creator.avatarCount}.`);
  if (creator.powerCount < 6) throw new Error(`Expected scalable power choices, saw ${creator.powerCount}.`);
  await evalValue(cdp, "document.querySelector('#backToOpenBtn').click(); true");
  await delay(150);
}

async function exerciseOldSaveAndTasks(cdp) {
  const oldSave = {
    version: "old-save",
    currentScene: "c01_arrival",
    profile: {
      name: "Old Save",
      gender: "robot",
      pronouns: "bad",
      avatarId: "missing",
      avatar: "data:image/svg+xml;base64,old",
      powerId: "bogus",
      matureContent: true
    },
    power: { id: "bogus", name: "Broken", level: 99, xp: -4, milestones: ["Unknown"] },
    stats: { control: "2" },
    relationships: { Piper: 4 },
    status: { condition: "Old" },
    clock: { day: 1, minute: 480, fatigue: 14, fatigueWarning: true, hardWarning: true },
    tasks: {},
    flags: {},
    history: [],
    chapterSnapshots: {}
  };

  await evalValue(cdp, `localStorage.clear(); localStorage.setItem(${JSON.stringify(slotKey(1))}, ${JSON.stringify(JSON.stringify(oldSave))}); true`);
  await navigate(cdp, pageUrl);
  await delay(400);

  const slotSummary = await evalValue(cdp, `document.querySelector("#startSaveSlots .slot p").textContent`);
  if (!slotSummary.includes("Old Save")) throw new Error(`Old manual save did not render in open menu: ${slotSummary}`);

  await evalValue(cdp, `document.querySelector("#startSaveSlots .slot .text-btn").click(); true`);
  await delay(200);
  let auto = await readAutoSave(cdp);
  if (auto.profile.gender !== "neutral") throw new Error(`Old save gender did not normalize: ${auto.profile.gender}`);
  if (auto.profile.avatar !== "assets/avatars/male-1.png") throw new Error(`Old avatar did not normalize: ${auto.profile.avatar}`);
  if (auto.profile.powerId !== "energy" || auto.power.id !== "energy") throw new Error("Old power id did not normalize to energy.");
  if (auto.clock.fatigue !== 14) throw new Error(`Expected fatigue clamp to 14, got ${auto.clock.fatigue}.`);

  await evalValue(cdp, `document.querySelector("#saveLoadBtn").click(); true`);
  await delay(150);
  const restIndex = await taskIndex(cdp, "Rest Block");
  await evalValue(cdp, `document.querySelectorAll("#taskList .task-btn")[${restIndex}].click(); true`);
  await delay(200);
  auto = await readAutoSave(cdp);
  if (auto.clock.fatigue >= 8 || auto.clock.fatigueWarning || auto.clock.hardWarning) {
    throw new Error(`Rest did not clear fatigue penalty: ${JSON.stringify(auto.clock)}`);
  }
  if (auto.status.condition !== "Recovered" || auto.status.stress !== "Low") {
    throw new Error(`Rest did not restore status: ${JSON.stringify(auto.status)}`);
  }

  const controlIndex = await taskIndex(cdp, "Control Loop");
  await evalValue(cdp, `document.querySelectorAll("#taskList .task-btn")[${controlIndex}].click(); true`);
  await delay(200);
  auto = await readAutoSave(cdp);
  if (!auto.tasks["1"] || auto.tasks["1"].used !== 1 || auto.tasks["1"].completed["control-loop"] !== 1) {
    throw new Error(`Training task did not record correctly: ${JSON.stringify(auto.tasks)}`);
  }
  if ((auto.stats.control || 0) < 3 || auto.power.xp < 1) {
    throw new Error("Training task did not apply stat/power effects.");
  }

  await evalValue(cdp, `document.querySelectorAll("#saveSlots .slot")[1].querySelector(".text-btn").click(); true`);
  await delay(100);
  const manualSaved = await evalValue(cdp, `Boolean(localStorage.getItem(${JSON.stringify(slotKey(2))}))`);
  if (!manualSaved) throw new Error("Manual save slot 2 was not written.");

  await evalValue(cdp, `document.querySelector("#pauseDialog").close(); document.querySelector("#choices .choice-btn").click(); true`);
  await delay(250);
  auto = await readAutoSave(cdp);
  if (auto.currentScene === "c01_arrival") throw new Error("Story choice did not advance to a new scene.");
  if (!auto.history.some((entry) => entry.type === "choice")) throw new Error("Story choice did not write a choice transcript entry.");
  if (auto.clock.minute <= 660) throw new Error(`Story choice did not advance time after rest/training: ${JSON.stringify(auto.clock)}`);

  const speechTiles = await evalValue(cdp, `(() => {
    const tiles = [...document.querySelectorAll(".speech-entry .speaker-tile img")];
    return {
      count: tiles.length,
      loaded: tiles.filter((img) => img.complete && img.naturalWidth > 0).length
    };
  })()`);
  if (speechTiles.count < 2 || speechTiles.loaded !== speechTiles.count) {
    throw new Error(`Speaker portrait tiles did not render/load: ${JSON.stringify(speechTiles)}`);
  }

  const capture = await cdp.send("Page.captureScreenshot", { format: "png", captureBeyondViewport: false });
  fs.writeFileSync(path.join(buildDir, "browser-mobile-play.png"), Buffer.from(capture.data, "base64"));
}

async function taskIndex(cdp, label) {
  const index = await evalValue(cdp, `(() => [...document.querySelectorAll("#taskList .task-btn")].findIndex((button) => button.textContent.includes(${JSON.stringify(label)})))()`);
  if (index < 0) throw new Error(`Could not find task button: ${label}`);
  return index;
}

async function readAutoSave(cdp) {
  return evalValue(cdp, `JSON.parse(localStorage.getItem(${JSON.stringify(autoKey)}))`);
}

async function inspectLayout(cdp) {
  return evalValue(cdp, `(() => {
    const width = document.documentElement.clientWidth;
    const height = document.documentElement.clientHeight;
    const targets = document.querySelectorAll("dialog[open], .start-dialog, .open-grid, .creator-grid, .pause-section, .slot, .text-btn, .dialog-subtitle");
    const overflow = [];
    for (const el of targets) {
      const rect = el.getBoundingClientRect();
      if (rect.left < -1 || rect.right > width + 1) {
        overflow.push({
          selector: el.id ? "#" + el.id : "." + [...el.classList].join("."),
          left: Math.round(rect.left),
          right: Math.round(rect.right),
          width: Math.round(rect.width),
          viewport: width,
          text: el.textContent.trim().replace(/\\s+/g, " ").slice(0, 80)
        });
      }
    }
    return {
      width,
      height,
      scrollWidth: document.documentElement.scrollWidth,
      scrollOverflow: document.documentElement.scrollWidth - width,
      overflow
    };
  })()`);
}

async function navigate(cdp, url) {
  const loaded = cdp.waitEvent("Page.loadEventFired", () => true, 10000);
  await cdp.send("Page.navigate", { url });
  await loaded;
}

async function evalValue(cdp, expression) {
  const result = await cdp.send("Runtime.evaluate", {
    expression,
    awaitPromise: true,
    returnByValue: true,
    userGesture: true
  });
  if (result.exceptionDetails) {
    throw new Error(result.exceptionDetails.exception.description || result.exceptionDetails.text);
  }
  return result.result.value;
}

async function waitForChrome() {
  const start = Date.now();
  while (Date.now() - start < 10000) {
    try {
      await requestJson("/json/version");
      return;
    } catch (_error) {
      await delay(100);
    }
  }
  throw new Error("Chrome devtools endpoint did not start.");
}

async function requestJson(route, options = {}) {
  const response = await fetch(`http://127.0.0.1:${port}${route}`, { method: options.method || "GET" });
  if (!response.ok) {
    throw new Error(`Chrome request failed ${response.status}: ${await response.text()}`);
  }
  return response.json();
}

function findChrome() {
  const candidates = [
    process.env.CHROME_PATH,
    "C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe",
    "C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe"
  ].filter(Boolean);
  const found = candidates.find((candidate) => fs.existsSync(candidate));
  if (!found) throw new Error("Could not find Chrome or Edge for browser smoke tests.");
  return found;
}

function delay(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

function isHarshWhite(color) {
  const channels = String(color).match(/\d+(\.\d+)?/g);
  if (!channels || channels.length < 3) return false;
  return channels.slice(0, 3).every((channel) => Number(channel) >= 245);
}

class Cdp {
  constructor(socket) {
    this.socket = socket;
    this.nextId = 1;
    this.pending = new Map();
    this.handlers = new Set();
    this.socket.addEventListener("message", (event) => {
      const message = JSON.parse(event.data);
      if (message.id && this.pending.has(message.id)) {
        const { resolve, reject } = this.pending.get(message.id);
        this.pending.delete(message.id);
        if (message.error) reject(new Error(`${message.error.message}: ${message.error.data || ""}`));
        else resolve(message.result || {});
        return;
      }
      this.handlers.forEach((handler) => handler(message));
    });
  }

  static async connect(url) {
    const socket = new WebSocket(url);
    await new Promise((resolve, reject) => {
      socket.addEventListener("open", resolve, { once: true });
      socket.addEventListener("error", reject, { once: true });
    });
    return new Cdp(socket);
  }

  send(method, params = {}) {
    const id = this.nextId++;
    this.socket.send(JSON.stringify({ id, method, params }));
    return new Promise((resolve, reject) => {
      this.pending.set(id, { resolve, reject });
      setTimeout(() => {
        if (this.pending.has(id)) {
          this.pending.delete(id);
          reject(new Error(`Timed out waiting for ${method}`));
        }
      }, 10000);
    });
  }

  onEvent(handler) {
    this.handlers.add(handler);
    return () => this.handlers.delete(handler);
  }

  waitEvent(method, predicate, timeoutMs) {
    return new Promise((resolve, reject) => {
      const timeout = setTimeout(() => {
        cleanup();
        reject(new Error(`Timed out waiting for ${method}`));
      }, timeoutMs);
      const cleanup = this.onEvent((message) => {
        if (message.method === method && (!predicate || predicate(message))) {
          cleanup();
          clearTimeout(timeout);
          resolve(message);
        }
      });
    });
  }

  close() {
    this.socket.close();
  }
}
