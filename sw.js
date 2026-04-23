const CACHE_NAME = "aegis-playtest-v8";
const FILES = [
  "./",
  "./index.html",
  "./style.css",
  "./game.js",
  "./story.js",
  "./story-expansion.js",
  "./story-deepening.js",
  "./manifest.webmanifest",
  "./assets/aegis-mark.svg",
  "./assets/backgrounds/aegis-point.svg",
  "./assets/backgrounds/blackwater.svg",
  "./assets/backgrounds/event-horizon.svg",
  "./assets/backgrounds/graduation.svg",
  "./assets/backgrounds/sim-dome.svg",
  "./assets/avatars/female-1.png",
  "./assets/avatars/female-2.png",
  "./assets/avatars/female-3.png",
  "./assets/avatars/female-4.png",
  "./assets/avatars/female-5.png",
  "./assets/avatars/male-1.png",
  "./assets/avatars/male-2.png",
  "./assets/avatars/male-3.png",
  "./assets/avatars/male-4.png",
  "./assets/avatars/male-5.png",
  "./assets/portraits/ben.png",
  "./assets/portraits/camille.png",
  "./assets/portraits/jordan.png",
  "./assets/portraits/julian.png",
  "./assets/portraits/kaito.png",
  "./assets/portraits/piper.png",
  "./assets/portraits/rhea.png",
  "./assets/portraits/rina.png",
  "./assets/portraits/theo.png",
  "./assets/portraits/vance.png",
  "./assets/portraits/ben.svg",
  "./assets/portraits/camille.svg",
  "./assets/portraits/jordan.svg",
  "./assets/portraits/julian.svg",
  "./assets/portraits/kaito.svg",
  "./assets/portraits/piper.svg",
  "./assets/portraits/rhea.svg",
  "./assets/portraits/rina.svg",
  "./assets/portraits/seth.svg",
  "./assets/portraits/theo.svg",
  "./assets/portraits/vance.svg"
];

self.addEventListener("install", (event) => {
  event.waitUntil(caches.open(CACHE_NAME).then((cache) => cache.addAll(FILES)));
});

self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches.keys().then((keys) => Promise.all(keys.filter((key) => key !== CACHE_NAME).map((key) => caches.delete(key))))
  );
});

self.addEventListener("fetch", (event) => {
  event.respondWith(caches.match(event.request).then((cached) => cached || fetch(event.request)));
});
