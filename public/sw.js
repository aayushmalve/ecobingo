const CACHE_NAME = "ecobingo-shell-v2";
const APP_SHELL = ["/", "/offline", "/manifest.webmanifest", "/icon.svg"];
const STATIC_PREFIX = "/_next/static/";

self.addEventListener("install", (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => cache.addAll(APP_SHELL))
      .then(() => self.skipWaiting())
  );
});

self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches.keys()
      .then((keys) => Promise.all(
        keys
          .filter((key) => key.startsWith("ecobingo-shell-") && key !== CACHE_NAME)
          .map((key) => caches.delete(key))
      ))
      .then(() => self.clients.claim())
  );
});

self.addEventListener("fetch", (event) => {
  const request = event.request;

  if (request.method !== "GET") return;

  const url = new URL(request.url);

  if (url.origin !== self.location.origin) return;
  if (url.pathname.startsWith("/api/")) return;
  if (url.pathname.startsWith("/_next/webpack-hmr")) return;

  // Pages: network first, cached page or offline page as fallback.
  if (request.mode === "navigate") {
    event.respondWith((async () => {
      const cache = await caches.open(CACHE_NAME);

      try {
        const response = await fetch(request);

        if (response.ok) {
          await cache.put(request, response.clone());

          if (url.pathname === "/") {
            await cache.put("/", response.clone());
          }
        }

        return response;
      } catch {
        return (await cache.match(request))
          || (url.pathname !== "/" ? await cache.match("/") : null)
          || (await cache.match("/offline"))
          || Response.error();
      }
    })());

    return;
  }

  // Cache versioned Next.js assets for offline use.
  if (
    url.pathname.startsWith(STATIC_PREFIX) ||
    url.pathname === "/icon.svg"
  ) {
    event.respondWith((async () => {
      const cached = await caches.match(request);

      if (cached) return cached;

      try {
        const response = await fetch(request);

        if (response.ok) {
          const cache = await caches.open(CACHE_NAME);
          await cache.put(request, response.clone());
        }

        return response;
      } catch {
        return Response.error();
      }
    })());
  }
});
