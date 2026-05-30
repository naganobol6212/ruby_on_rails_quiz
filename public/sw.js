// CodeDojo Service Worker — オフライン読了 + アセットキャッシュ
//
// 重要: バージョン文字列を更新すると、新 SW の activate 時に旧キャッシュを掃除する。
// デプロイ後に古い JS が居座って画面が壊れる事故を防ぐため、ビルド成果物の挙動を
// 変えるような変更を入れたら必ず CACHE_VERSION を上げること。
const CACHE_VERSION = "codedojo-v2";
const APP_SHELL = ["/", "/offline", "/guide", "/roadmap", "/crud"];

// クライアントから即時切替を促されたら新 SW をすぐ activate する
self.addEventListener("message", (event) => {
  if (event.data && event.data.type === "SKIP_WAITING") {
    self.skipWaiting();
  }
});

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
      .then(() => self.clients.claim())
      // 旧 SW で動いていたタブを新コードで読み直す
      .then(() => self.clients.matchAll({ type: "window" }))
      .then((clients) => {
        for (const c of clients) {
          try {
            c.navigate(c.url);
          } catch {
            /* ナビゲーション拒否は無視 */
          }
        }
      }),
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

  // JS / CSS / Next 静的アセット: network-first
  //   ハッシュ付きファイル名 (Vercel のデプロイで毎回変わる) を cache-first にすると
  //   古いハッシュのまま新 HTML を読みに行って整合性が崩れるため、network-first にする。
  if (
    request.destination === "script" ||
    request.destination === "style" ||
    url.pathname.startsWith("/_next/static/")
  ) {
    event.respondWith(networkFirst(request));
    return;
  }

  // 画像 / フォント: cache-first (内容が安定しているため高速化)
  if (
    ["image", "font"].includes(request.destination) ||
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
