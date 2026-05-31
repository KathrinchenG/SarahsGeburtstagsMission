const CACHE_NAME = "sarah-mission-cache-v2";

const CORE_ASSETS = [
  "./",
  "./index.html",
  "./style.css",
  "./app.js",
  "./manifest.json",
  "./data/riddles.js",
  "./service-worker.js",
  "./sw.js"
];

const IMAGE_ASSETS = [
  "./assets/images/terminal.svg",
  "./assets/images/intro/Intro_1.jpg",
  "./assets/images/intro/Intro_2.jpg",
  "./assets/images/intro/Intro_3.jpg",
  "./assets/images/intro/Intro_4.jpg",
  "./assets/images/intro/Intro_5.jpg",
  "./assets/images/intro/Intro_6.jpg",
  "./assets/images/intro/Intro_7.jpg",
  "./assets/images/clocks/clock1.jpg",
  "./assets/images/clocks/clock2.jpg",
  "./assets/images/clocks/clock3.jpg",
  "./assets/images/clocks/clock4.jpg",
  "./assets/images/outro/Outro_1.jpg",
  "./assets/images/outro/Outro_2.jpg",
  "./assets/images/songs/Song 3a.jpg",
  "./assets/images/songs/Song 6a.jpg",
  "./assets/icons/icon-192.png",
  "./assets/icons/icon-512.png"
];

const AUDIO_ASSETS = [
  "./assets/audio/Song 1a.m4a",
  "./assets/audio/Song 2a.m4a",
  "./assets/audio/Song 4a.m4a",
  "./assets/audio/Song 5a.m4a",
  "./assets/audio/success.mp3",
  "./assets/audio/error.mp3"
];

const PRECACHE_ASSETS = [...CORE_ASSETS, ...IMAGE_ASSETS, ...AUDIO_ASSETS];

self.addEventListener("install", (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then(async (cache) => {
      const results = await Promise.allSettled(
        PRECACHE_ASSETS.map((url) => cache.add(new Request(url, { cache: "reload" })))
      );
      const rejected = results.filter((result) => result.status === "rejected");
      if (rejected.length > 0) {
        // Keep install resilient if optional files are missing.
        console.warn("Some assets failed to cache during install", rejected.length);
      }
    })
  );
  self.skipWaiting();
});

self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(
        keys
          .filter((key) => key !== CACHE_NAME)
          .map((key) => caches.delete(key))
      )
    )
  );
  self.clients.claim();
});

self.addEventListener("fetch", (event) => {
  if (event.request.method !== "GET") {
    return;
  }

  event.respondWith(
    caches.match(event.request).then((cachedResponse) => {
      if (cachedResponse) {
        return cachedResponse;
      }

      return fetch(event.request)
        .then((networkResponse) => {
          if (!networkResponse || networkResponse.status !== 200 || networkResponse.type !== "basic") {
            return networkResponse;
          }

          const responseToCache = networkResponse.clone();
          caches.open(CACHE_NAME).then((cache) => {
            cache.put(event.request, responseToCache);
          });

          return networkResponse;
        })
        .catch(() => {
          if (event.request.mode === "navigate") {
            return caches.match("./index.html");
          }
          return caches.match(event.request);
        });
    })
  );
});
