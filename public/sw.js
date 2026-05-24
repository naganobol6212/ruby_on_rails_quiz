// CodeDojo Service Worker — オフライン読了 + アセットキャッシュ
const CACHE_VERSION = "codedojo-v1";
const APP_SHELL = ["/", "/offline", "/guide", "/roadmap", "/crud"];

self.addEventListener("install", (event) => {
  event.waitUntil(
    caches.open(CACHE_VERSION).then((cache) =>
      cache.addAll(APP_SHELL).catch(() => {
        // 個別失敗は無視 (初期導入時に prerender 前のパスでも動くように)
      }),
    ),
  );
  self.skipWaiting();
});

self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches
      .keys()
      .then((keys) =>
        Promise.all(
          keys
            .filter((k) => k !== CACHE_VERSION)
            .map((k) => caches.delete(k)),
        ),
      )
      .then(() => self.clients.claim()),
  );
});

self.addEventListener("fetch", (event) => {
  const { request } = event;
  if (request.method !== "GET") return;

  const url = new URL(request.url);
  if (url.origin !== self.location.origin) return;

  // Next.js の RSC / API は触らない
  if (url.pathname.startsWith("/_next/data/")) return;
  if (url.pathname.startsWith("/api/")) return;

  // HTML ナビゲーション: network-first → cache → /offline
  if (request.mode === "navigate" || request.destination === "document") {
    event.respondWith(networkFirst(request));
    return;
  }

  // 静的アセット (JS/CSS/画像/フォント): cache-first
  if (
    ["style", "script", "image", "font"].includes(request.destination) ||
    url.pathname.startsWith("/_next/static/") ||
    /\.(svg|png|jpg|jpeg|gif|webp|ico|woff2?)$/.test(url.pathname)
  ) {
    event.respondWith(cacheFirst(request));
    return;
  }

  // それ以外も network-first を試す
  event.respondWith(
    fetch(request).catch(() => caches.match(request)),
  );
});

async function networkFirst(request) {
  try {
    const response = await fetch(request);
    // 成功時はキャッシュも更新
    if (response.ok) {
      const cache = await caches.open(CACHE_VERSION);
      cache.put(request, response.clone());
    }
    return response;
  } catch {
    const cached = await caches.match(request, { ignoreSearch: true });
    if (cached) return cached;
    const offline = await caches.match("/offline");
    if (offline) return offline;
    return new Response(
      "<h1>オフライン</h1><p>このページはキャッシュされていません。</p>",
      { status: 503, headers: { "Content-Type": "text/html; charset=utf-8" } },
    );
  }
}

async function cacheFirst(request) {
  const cached = await caches.match(request);
  if (cached) return cached;
  try {
    const response = await fetch(request);
    if (response.ok) {
      const cache = await caches.open(CACHE_VERSION);
      cache.put(request, response.clone());
    }
    return response;
  } catch {
    return new Response("", { status: 504 });
  }
}
