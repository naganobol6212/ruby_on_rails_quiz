import type { Guide } from "./types";

export const nuxtIntroGuide: Guide = {
    id: "nuxt-intro",
    trackId: "nuxt",
    title: "Nuxt の地図 — Vue 3 + Nitro でフルスタック",
    subtitle:
      "Nuxt 3 を 7 章で。ディレクトリ規約 → Vue 3 / Composition API → ルーティングと layouts → useFetch / Nitro → useState / Pinia → SSR/SPA/SSG/ISR → SEO/エラー/本番運用",
    audience:
      "Vue は触ったことがあるが Nuxt 3 の世界観 (auto-import / Nitro / useState / routeRules) で迷子になる人、Next.js 経験者で Nuxt の差分を効率よく掴みたい人",
    sources: [
      { label: "Nuxt 公式ドキュメント", url: "https://nuxt.com/docs" },
      { label: "Vue 3 公式ドキュメント", url: "https://ja.vuejs.org/" },
      { label: "Nitro (server engine)", url: "https://nitro.unjs.io/" },
    ],
    emoji: "💚",
    relatedCategoryIds: ["nuxt-basics"],
    chapters: [
      {
        id: "nuxt-conventions",
        title: "1. Nuxt の世界観 — ディレクトリ規約と自動 import",
        intro:
          "Nuxt 3 は『規約 (Convention) で生産性を上げる』フレームワーク。各ディレクトリの役割と自動 import の仕組みを最初に押さえる。",
        readingMinutes: 7,
        objectives: [
          "Nuxt 3 の主要ディレクトリ 10 個の役割を説明できる",
          "components / composables / utils の自動 import を活用できる",
          "app.vue / nuxt.config.ts / package.json の最小構成を読める",
        ],
        sections: [
          {
            heading: "1.1 規約ディレクトリ 10 種",
            body: "Nuxt 3 は『どのディレクトリに何を置くか』が決まっており、それぞれに専用の挙動 (自動 import / ルーティング / API 化 など) が結びついている。最小限覚えるべきは pages / components / composables / server / layouts / middleware / plugins / public / assets / stores。",
            code: "プロジェクトルート/\n├ app.vue                ルートコンポーネント (全画面の入口、<NuxtLayout> + <NuxtPage />)\n├ nuxt.config.ts         Nuxt 全体設定\n├ package.json\n├ tsconfig.json\n├ pages/                 ← URL ルートに自動マッピング\n├ components/            ← 自動 import (PascalCase)\n├ composables/           ← use* 関数を自動 import\n├ utils/                 ← ヘルパー関数を自動 import\n├ server/                ← Nitro サーバ (API / middleware / plugins)\n│   ├ api/               → /api/* エンドポイント\n│   ├ middleware/        サーバミドルウェア\n│   └ routes/            任意の URL のサーバルート\n├ layouts/               <slot /> を持つ共通レイアウト\n├ middleware/            クライアント側ルートミドルウェア\n├ plugins/               起動時に動かす plugin\n├ public/                そのまま配信 (favicon.ico など)\n├ assets/                ビルドパイプラインを通る (画像 / scss)\n└ stores/                Pinia ストア (任意、規約名)",
            language: "text",
            notes: [
              "Vue 2 / Nuxt 2 経験者は 'pages の中に書く' は同じだが、Composition API + 自動 import + Nitro が大きく違う",
              "規約に乗ると設定がほとんど要らない — 逆にディレクトリ名を変えると挙動が止まる",
            ],
          },
          {
            heading: "1.2 app.vue と <NuxtPage> / <NuxtLayout>",
            body: "`app.vue` がルートコンポーネント。最小構成は `<NuxtPage />` だけ書く。layouts/ を使うなら `<NuxtLayout>` で囲み、layout を動的に切替可能。`<NuxtLink>` で内部遷移、`<NuxtLoadingIndicator>` でページ遷移時のローディングバー。",
            code: "<!-- app.vue (最小) -->\n<template>\n  <NuxtPage />\n</template>\n\n<!-- app.vue (layout + 遷移バー) -->\n<template>\n  <NuxtLoadingIndicator color=\"#00DC82\" />\n  <NuxtLayout>\n    <NuxtPage />\n  </NuxtLayout>\n</template>\n\n<!-- 内部ナビゲーション -->\n<template>\n  <NuxtLink to=\"/about\">About</NuxtLink>\n  <NuxtLink :to=\"`/posts/${post.id}`\">Read</NuxtLink>\n</template>",
            language: "vue",
            notes: [
              "<NuxtLink> は <a> をラップしてクライアント遷移 + prefetch を自動化",
              "<NuxtPage> は現在のルートに対応する pages/*.vue を描画する『出口』",
            ],
          },
          {
            heading: "1.3 自動 import — components / composables / utils",
            body: "Nuxt 3 は `components/` `composables/` `utils/` 配下のファイルを **import 文なしで** 使えるよう自動登録する。ファイル名がそのまま識別子になる (components は PascalCase、composables は use* 命名)。Vue API (ref / computed / watch) や Nuxt API (useFetch / useState) も全部自動 import。",
            code: "// components/Button.vue は <Button /> として使える\n// components/admin/Header.vue は <AdminHeader /> (ネスト = プレフィックス)\n// components/forms/TextField.vue は <FormsTextField />\n\n// composables/useFavorites.ts\nexport const useFavorites = () => {\n  const list = useState<number[]>('favorites', () => [])\n  function add(id: number) {\n    if (!list.value.includes(id)) list.value.push(id)\n  }\n  return { list, add }\n}\n\n// pages/list.vue — import 文ゼロで動く\n<script setup lang=\"ts\">\nconst { list, add } = useFavorites()    // composables から auto\nconst count = ref(0)                      // Vue API も auto\nconst doubled = computed(() => count.value * 2)\nconst { data } = await useFetch('/api/posts')   // Nuxt API も auto\n</script>",
            language: "vue",
            notes: [
              "自動 import の型補完は `.nuxt/` 配下の型ファイルが生成される (dev server 起動で更新)",
              "ライブラリ (pinia など) の API も `imports.presets` で auto-import 化可",
              "明示 import したい時は普通に書いても OK — 衝突しない",
            ],
          },
          {
            heading: "1.4 nuxt.config.ts と modules",
            body: "`nuxt.config.ts` で全体設定。`modules` 配列に Nuxt Module を並べると、依存追加とセットアップが一気に終わる (Tailwind / Pinia / i18n / Image / Auth など豊富)。`runtimeConfig` で環境変数、`routeRules` でルート毎のレンダリング戦略 (6 章で詳述)。",
            code: "// nuxt.config.ts\nimport { defineNuxtConfig } from 'nuxt/config'\n\nexport default defineNuxtConfig({\n  compatibilityDate: '2026-01-01',         // 機能の固定日付\n  devtools: { enabled: true },\n\n  modules: [\n    '@nuxtjs/tailwindcss',\n    '@pinia/nuxt',\n    '@nuxt/image',\n    '@nuxtjs/i18n',\n    '@nuxt/content',                        // markdown を CMS 的に\n  ],\n\n  // 環境変数 (8 章で詳述)\n  runtimeConfig: {\n    apiSecret: '',                          // server 専用\n    public: {\n      baseUrl: 'http://localhost:3000',\n    },\n  },\n\n  // ルート毎の戦略\n  routeRules: {\n    '/': { prerender: true },\n    '/blog/**': { swr: 3600 },\n    '/admin/**': { ssr: false },\n  },\n\n  // CSS のグローバル取込\n  css: ['~/assets/css/main.css'],\n})",
            language: "typescript",
            notes: [
              "compatibilityDate を固定すると、Nitro / Nuxt の挙動を予測可能にできる",
              "modules はインストール (`npm i -D @pinia/nuxt`) + config に追加で完了",
            ],
          },
        ],
        keyTakeaways: [
          "Nuxt は規約優先 — 10 種の主要ディレクトリと役割を覚える",
          "app.vue → <NuxtLayout> → <NuxtPage> の入れ子で画面が描かれる",
          "components / composables / utils + Vue/Nuxt API は import なしで使える",
          "nuxt.config.ts の modules / runtimeConfig / routeRules が拡張の入り口",
        ],
        comprehensionQuestionIds: ["nuxt-001", "nuxt-010", "nuxt-011", "nuxt-020"],
      },
      {
        id: "vue-composition-basics",
        title: "2. Vue 3 / Composition API — ref・computed・watch とテンプレート構文",
        intro:
          "Nuxt 3 は Vue 3 + `<script setup>` + Composition API が前提。リアクティビティの基本 (ref / reactive / computed / watch) とテンプレート構文 (v-if / v-for / v-model) を整理。",
        readingMinutes: 9,
        objectives: [
          "ref と reactive の使い分け、.value の必要なタイミングを説明できる",
          "computed と watch / watchEffect を場面で使い分けられる",
          "v-if / v-for / v-model / :prop / @event の基本構文を読み書きできる",
        ],
        sections: [
          {
            heading: "2.1 <script setup> と ref / reactive",
            body: "Vue 3 の現代スタイルは `<script setup>`。中で `ref` (プリミティブ向け) と `reactive` (オブジェクト向け) を使ってリアクティブな値を作る。JS 側では `.value` でアクセス (ref のみ)、テンプレート内では自動アンラップされるので `.value` 不要。",
            code: "<script setup lang=\"ts\">\nimport { ref, reactive } from 'vue'\n\n// プリミティブは ref\nconst count = ref(0)\nconst name = ref('Alice')\n\n// オブジェクトは reactive (もしくは ref(obj) でも OK)\nconst user = reactive({ name: 'A', age: 20 })\n\nfunction increment() {\n  count.value++      // JS 側は .value\n  user.age++         // reactive は直接\n}\n</script>\n\n<template>\n  <p>{{ count }} / {{ name }}</p>   <!-- テンプレートは .value 不要 -->\n  <p>{{ user.name }} ({{ user.age }})</p>\n  <button @click=\"increment\">+1</button>\n</template>",
            language: "vue",
            notes: [
              "迷ったら ref で OK — オブジェクトでも ref に入れられる (ref({...}))",
              "reactive は分割代入 / 置き換え (user = {...}) でリアクティブを失う罠 — 使うなら直接書き換える",
            ],
          },
          {
            heading: "2.2 computed と watch / watchEffect",
            body: "`computed(() => expr)` は依存リアクティブが変わった時だけ再評価しキャッシュ (React の useMemo + 自動依存追跡)。`watch(source, cb)` は対象を明示し旧値・新値を受ける、`watchEffect(fn)` は中で参照したリアクティブを自動追跡 (deps 配列いらず)。",
            code: "<script setup lang=\"ts\">\nimport { ref, computed, watch, watchEffect } from 'vue'\n\nconst count = ref(0)\nconst threshold = ref(10)\n\n// computed — 同じ template で複数回参照されても 1 回しか走らない\nconst doubled = computed(() => count.value * 2)\nconst overThreshold = computed(() => count.value > threshold.value)\n\n// getter + setter の computed\nconst first = ref('Ada'); const last = ref('Lovelace')\nconst fullName = computed({\n  get: () => `${first.value} ${last.value}`,\n  set: (v) => { [first.value, last.value] = v.split(' ') }\n})\n\n// watch — 明示的、旧値も取れる\nwatch(count, (newVal, oldVal) => {\n  console.log(oldVal, '->', newVal)\n})\nwatch([count, threshold], ([c, t]) => { /* 複数 source */ })\nwatch(count, fn, { immediate: true, deep: true })\n\n// watchEffect — 自動追跡\nwatchEffect(() => {\n  // 中で参照したリアクティブが変わると再実行\n  console.log(count.value, threshold.value)\n})\n</script>",
            language: "vue",
            notes: [
              "computed は副作用 NG — 計算結果を返すだけ",
              "watch の deep は配列/オブジェクト内部まで監視 (重いので必要な時のみ)",
              "watchEffect は依存配列の書き忘れがない代わりに、副作用範囲が読みにくい — 明示性が欲しい時は watch",
            ],
          },
          {
            heading: "2.3 テンプレート構文 — v-if / v-for / v-model",
            body: "Vue のテンプレートディレクティブ。`v-if` (DOM 出し入れ) と `v-show` (CSS display 切替) の差、`v-for` には `:key` 必須、`v-model` で双方向バインディング、`:prop` で属性、`@event` でイベントハンドラ。Vue 3 から Fragment (複数 root) OK。",
            code: "<template>\n  <!-- 条件分岐 -->\n  <p v-if=\"loading\">Loading...</p>\n  <p v-else-if=\"error\">Error: {{ error.message }}</p>\n  <ul v-else>\n    <!-- v-for + :key (key は React と同じく安定 ID 推奨) -->\n    <li v-for=\"item in items\" :key=\"item.id\">\n      {{ item.name }}\n    </li>\n  </ul>\n\n  <!-- v-model (双方向) — input/textarea/select/カスタムコンポーネント -->\n  <input v-model=\"query\" placeholder=\"Search\" />\n  <input v-model.number=\"age\" type=\"number\" />        <!-- 修飾子 .number で数値化 -->\n  <input v-model.trim=\"username\" />                   <!-- .trim で前後空白除去 -->\n\n  <!-- :prop で属性バインド、@event でイベント -->\n  <button :disabled=\"!valid\" @click=\"submit\">Submit</button>\n  <a :href=\"`/posts/${id}`\" @click.prevent=\"openModal\">Read</a>\n\n  <!-- スロット (children) -->\n  <Card title=\"Hello\">\n    <p>Body content</p>\n    <template #footer>\n      <small>Footer</small>\n    </template>\n  </Card>\n\n  <!-- Vue 3 — Fragment (複数 root) OK -->\n  <h1>Title</h1>\n  <p>Body</p>\n</template>",
            language: "vue",
            notes: [
              "v-if と v-for を同じ要素に併用しない (Vue 3 で優先順位が逆転) — `<template v-for>` で別レイヤに",
              "v-model はカスタムコンポーネントにも適用可 — props.modelValue + emit('update:modelValue')",
              "@click.prevent / @click.stop / @keyup.enter などイベント修飾子が豊富",
            ],
          },
          {
            heading: "2.4 props と emit — コンポーネント間通信",
            body: "親 → 子は `defineProps`、子 → 親は `defineEmits`。`<script setup>` のマクロで型注釈もそのまま書ける。`provide` / `inject` で深いツリーを越えて値を渡せる (React の Context に相当)。",
            code: "<!-- components/Button.vue -->\n<script setup lang=\"ts\">\nconst props = defineProps<{\n  label: string\n  variant?: 'primary' | 'secondary'\n  disabled?: boolean\n}>()\n\nconst emit = defineEmits<{\n  click: [event: MouseEvent]\n  submit: [value: string]\n}>()\n\nfunction onClick(e: MouseEvent) {\n  emit('click', e)\n}\n</script>\n\n<template>\n  <button :class=\"variant\" :disabled=\"disabled\" @click=\"onClick\">\n    {{ label }}\n  </button>\n</template>\n\n<!-- 使う側 -->\n<Button label=\"Save\" variant=\"primary\" @click=\"handleSave\" />\n\n<!-- provide / inject (深いツリーで値を共有) -->\n<script setup>\n// 上位\nimport { provide, ref } from 'vue'\nconst theme = ref('light')\nprovide('theme', theme)\n\n// 下位 (どんなに深くても)\nconst theme = inject('theme')\n</script>",
            language: "vue",
            notes: [
              "defineProps / defineEmits は import 不要のコンパイラマクロ",
              "props は readonly — 子の中で書き換えない (emit で親に通知)",
              "深い共有でかつアプリ全体なら Pinia / useState の方が typed で扱いやすい",
            ],
          },
        ],
        keyTakeaways: [
          "<script setup> + Composition API が現代の標準",
          "ref/reactive、JS 側は .value (ref のみ)、template は自動アンラップ",
          "computed は『派生値 + キャッシュ』、watch は『副作用』、watchEffect は『依存自動追跡』",
          "v-if / v-for + :key / v-model / :prop / @event とイベント修飾子",
          "defineProps / defineEmits で型付きのコンポーネント API",
        ],
        comprehensionQuestionIds: ["nuxt-002", "nuxt-009", "nuxt-013", "nuxt-014", "nuxt-018"],
      },
      {
        id: "routing-and-layouts",
        title: "3. ルーティングとレイアウト — pages / NuxtLink / layouts / middleware",
        intro:
          "Nuxt 3 はファイルベースルーティング。`pages/` のファイル構造がそのまま URL に。layouts でヘッダ/フッタを共有し、middleware で遷移時のガード処理を書く。",
        readingMinutes: 9,
        objectives: [
          "pages/ の構造から URL マッピングを読める、動的ルート / catch-all を書ける",
          "layouts/default.vue とページ単位 layout 切替を扱える",
          "client middleware と global middleware を書き分け、definePageMeta を使える",
        ],
        sections: [
          {
            heading: "3.1 pages/ → URL の対応",
            body: "`pages/index.vue` が `/`、`pages/about.vue` が `/about`、`pages/users/[id].vue` が `/users/:id`、`pages/blog/[...slug].vue` がキャッチオール。動的セグメントは `useRoute().params.id` で取得。`<NuxtLink>` で内部遷移、外部リンクは生 `<a>`。",
            code: "pages/\n  index.vue              → /\n  about.vue              → /about\n  users/\n    index.vue            → /users\n    [id].vue             → /users/:id (動的)\n    [id]/                 ← ディレクトリ + index.vue でもネスト可\n      index.vue          → /users/:id\n      edit.vue           → /users/:id/edit\n  blog/\n    [...slug].vue        → /blog/* (キャッチオール)\n\n<!-- pages/users/[id].vue -->\n<script setup lang=\"ts\">\nconst route = useRoute()\nconst id = route.params.id    // string\nconst { data: user } = await useFetch(`/api/users/${id}`)\n</script>\n\n<template>\n  <h1>{{ user?.name }}</h1>\n  <NuxtLink :to=\"`/users/${id}/edit`\">Edit</NuxtLink>\n</template>",
            language: "vue",
            notes: [
              "`/users/[id]/edit.vue` のような階層分けはディレクトリで自然に表現できる",
              "ネストした layout が必要なら親に `<NuxtPage />` を含む親ページを置く (ネストルート)",
            ],
          },
          {
            heading: "3.2 NuxtLink とプログラム遷移 (navigateTo / useRouter)",
            body: "内部遷移は `<NuxtLink to=\"...\">` (自動 prefetch + クライアント遷移)。プログラム的には `navigateTo('/path')` が一番簡単 (Server Component 的な処理でも使える)。Vue Router の `useRouter()` も使える。`navigateTo` は通常 throw する形で動くので Server side の middleware で安全。",
            code: "<!-- 内部リンク (Nuxt 推奨) -->\n<NuxtLink to=\"/about\">About</NuxtLink>\n<NuxtLink :to=\"{ name: 'users-id', params: { id: 3 } }\">User 3</NuxtLink>\n\n<!-- 外部リンクは生 <a> -->\n<a href=\"https://example.com\" target=\"_blank\" rel=\"noreferrer\">External</a>\n\n<!-- プログラム的遷移 (どこでも使える) -->\n<script setup>\nasync function login() {\n  await $fetch('/api/login', { method: 'POST', body: form })\n  await navigateTo('/dashboard')           // 推奨\n  // または\n  // const router = useRouter()\n  // router.push('/dashboard')\n}\n</script>\n\n<!-- middleware や server から -->\nreturn navigateTo('/login', { redirectCode: 302 })\nthrow createError({ statusCode: 404, statusMessage: 'Not Found' })",
            language: "vue",
            notes: [
              "navigateTo は middleware / page setup / server で安全に使える",
              "クライアント遷移は History API、フルリロードはほぼ起きない",
            ],
          },
          {
            heading: "3.3 layouts と definePageMeta",
            body: "`layouts/default.vue` がデフォルトレイアウト。`<slot />` の位置にページが入る。ページ側で `definePageMeta({ layout: 'admin' })` を書くと `layouts/admin.vue` に切替。動的に切り替えたい時は `<NuxtLayout :name=\"layoutName\">` を app.vue で使う。",
            code: "<!-- layouts/default.vue -->\n<template>\n  <AppHeader />\n  <main class=\"container mx-auto\">\n    <slot />                          <!-- ここにページが入る -->\n  </main>\n  <AppFooter />\n</template>\n\n<!-- layouts/admin.vue -->\n<template>\n  <div class=\"grid grid-cols-[200px_1fr]\">\n    <AdminSidebar />\n    <slot />\n  </div>\n</template>\n\n<!-- pages/admin/index.vue -->\n<script setup>\ndefinePageMeta({\n  layout: 'admin',\n  middleware: ['auth'],\n  // title: '...'   ← useHead で代用 (7 章)\n})\n</script>\n\n<!-- レイアウト無しにしたい場合 -->\ndefinePageMeta({ layout: false })\n\n<!-- 動的切替 (app.vue で) -->\n<template>\n  <NuxtLayout :name=\"dynamicLayout\">\n    <NuxtPage />\n  </NuxtLayout>\n</template>",
            language: "vue",
            notes: [
              "definePageMeta はコンパイラマクロ — pages/*.vue の <script setup> 内でのみ動く",
              "layout は遷移時に再レンダリングされない (状態保持) — Next.js App Router と同じ",
            ],
          },
          {
            heading: "3.4 middleware — ルートガード",
            body: "`middleware/` に置いた `defineNuxtRouteMiddleware` がルートミドルウェア。ファイル名に `.global.ts` を付けると全ルートに自動適用、`auth.ts` のような通常名は `definePageMeta({ middleware: ['auth'] })` で個別指定。Server 専用なら `server/middleware/` を使う。",
            code: "// middleware/auth.ts (named — 個別指定)\nexport default defineNuxtRouteMiddleware((to, from) => {\n  const user = useUserStore()\n  if (!user.isAuthenticated) {\n    return navigateTo({\n      path: '/login',\n      query: { from: to.fullPath },\n    })\n  }\n})\n\n// middleware/analytics.global.ts (全ルートに自動適用)\nexport default defineNuxtRouteMiddleware((to) => {\n  if (process.client) {\n    gtag('event', 'page_view', { page_path: to.fullPath })\n  }\n})\n\n// pages/admin/index.vue\n<script setup>\ndefinePageMeta({ middleware: ['auth'] })   // auth.ts を呼ぶ\n</script>\n\n// abortNavigation / navigateTo / undefined のいずれかを返す\nexport default defineNuxtRouteMiddleware((to) => {\n  if (to.path === '/forbidden') {\n    return abortNavigation('Forbidden')      // 遷移キャンセル\n  }\n  // undefined を返せば続行\n})",
            language: "typescript",
            notes: [
              "global は実行順が ABC 順 — 順序が大事なら数字プレフィックス (`01.analytics.global.ts`)",
              "サーバ側で API リクエスト前に何かしたいなら server/middleware/*.ts (defineEventHandler を返す)",
            ],
          },
        ],
        keyTakeaways: [
          "pages/ の構造 = URL、動的は [id] / キャッチオールは [...slug]",
          "<NuxtLink> で prefetch 付き内部遷移、プログラム的には navigateTo",
          "layouts/default.vue + definePageMeta({ layout: 'xxx' }) でレイアウト切替",
          "middleware は client (auth.ts) と global (.global.ts) + server/middleware/ を使い分け",
        ],
        comprehensionQuestionIds: ["nuxt-001", "nuxt-006", "nuxt-007"],
      },
      {
        id: "data-fetching",
        title: "4. データ取得 — useFetch / useAsyncData / Nitro (server/api)",
        intro:
          "Nuxt 3 のデータ取得は useFetch / useAsyncData で SSR ↔ クライアント間の重複フェッチを自動で防ぐ。サーバー API は Nitro による `server/api/` で書ける。",
        readingMinutes: 10,
        objectives: [
          "useFetch / useAsyncData / $fetch の使い分けを説明できる",
          "server/api/ で REST 風のエンドポイントを書ける (defineEventHandler)",
          "lazy / pick / transform / refresh などのオプションを使える",
        ],
        sections: [
          {
            heading: "4.1 useFetch / useAsyncData / $fetch",
            body: "**useFetch(url)** は URL ベースで SSR と統合したデータ取得 (重複フェッチ防止)。**useAsyncData(key, fn)** は任意の async 関数を SSR-safe に実行。**$fetch(url)** は単発の HTTP リクエスト (SSR 統合なし) — イベントハンドラ内で叩く用。",
            code: "<script setup lang=\"ts\">\n// useFetch (URL ベース、SSR 統合)\nconst { data: posts, pending, error, refresh } = await useFetch('/api/posts')\n\n// 型付き\ntype Post = { id: number; title: string }\nconst { data } = await useFetch<Post[]>('/api/posts')\n\n// useAsyncData (任意の async)\nconst { data: users } = await useAsyncData('users', () =>\n  $fetch('/api/users')\n)\n\n// 動的 URL — クエリ / params の変化で再フェッチ\nconst query = ref('')\nconst { data } = await useFetch('/api/search', {\n  query: { q: query },                    // q を watch、変化で再フェッチ\n})\n\n// イベント内 (SSR 不要、単発)\nasync function save() {\n  await $fetch('/api/posts', {\n    method: 'POST',\n    body: form.value,\n  })\n  await refresh()                          // 一覧を再取得\n}\n</script>",
            language: "vue",
            notes: [
              "useFetch / useAsyncData は SSR で取ったデータを payload にシリアライズしてクライアントに渡す — ハイドレーション後の再フェッチを防ぐ",
              "$fetch は ofetch ラッパーで Server / Client 両方で動く同じ API",
            ],
          },
          {
            heading: "4.2 主要オプション — lazy / pick / transform / watch",
            body: "**lazy: true** で await せず非同期のまま (pending を見ながら描画)。**pick** でレスポンスから必要なキーだけ抜く (payload 削減)。**transform** で取得後に整形。**watch** で再フェッチをトリガーするリアクティブを指定 (デフォルトでは URL / query / params が変わると自動再フェッチ)。**server: false** で SSR 時の取得をスキップ。",
            code: "<script setup>\n// lazy — await しない\nconst { data, pending } = useFetch('/api/heavy', { lazy: true })\n\n// pick — 必要キーだけ取得 (payload に余分なフィールドが入らない)\nconst { data } = await useFetch('/api/user', {\n  pick: ['id', 'name'],\n})\n\n// transform — 整形\nconst { data } = await useFetch('/api/posts', {\n  transform: (raw: Post[]) =>\n    raw.map((p) => ({ ...p, slug: p.title.toLowerCase().replace(/ /g, '-') })),\n})\n\n// watch — 任意の ref を監視\nconst page = ref(1)\nconst { data } = await useFetch('/api/posts', {\n  query: { page },                         // page 変化で再フェッチ\n  watch: [page],                            // 明示も可\n})\n\n// server: false — クライアントだけで実行 (SSR スキップ)\nconst { data } = useFetch('/api/me', { server: false })\n\n// onResponse / onRequest インターセプタ\nconst { data } = await useFetch('/api/posts', {\n  onRequest({ options }) { options.headers = { ...options.headers, 'X-Foo': '1' } },\n  onResponseError({ response }) { console.error(response.status) },\n})\n</script>",
            language: "vue",
          },
          {
            heading: "4.3 Nitro — server/api/ で REST エンドポイント",
            body: "`server/api/` 配下にファイルを置くと `/api/<path>` でアクセス可能。`defineEventHandler` で実装し、`readBody` / `getQuery` / `getRouterParam` などのヘルパで Request を扱う。HTTP メソッド別にしたい時は `.get.ts` / `.post.ts` のサフィックス。",
            code: "// server/api/posts.get.ts → GET /api/posts\nexport default defineEventHandler(async (event) => {\n  return await db.post.findMany({ orderBy: { createdAt: 'desc' } })\n})\n\n// server/api/posts.post.ts → POST /api/posts\nexport default defineEventHandler(async (event) => {\n  const body = await readBody(event)\n  return await db.post.create({ data: body })\n})\n\n// 動的: server/api/posts/[id].get.ts → GET /api/posts/123\nexport default defineEventHandler(async (event) => {\n  const id = getRouterParam(event, 'id')!\n  const post = await db.post.findUnique({ where: { id: Number(id) } })\n  if (!post) throw createError({ statusCode: 404, message: 'Not Found' })\n  return post\n})\n\n// クエリパラメータ\nexport default defineEventHandler((event) => {\n  const { q, page = '1' } = getQuery(event)   // ?q=foo&page=2\n  return search(String(q), Number(page))\n})\n\n// 認証 (Cookie / Header から)\nexport default defineEventHandler(async (event) => {\n  const token = getHeader(event, 'authorization')?.replace('Bearer ', '')\n  if (!token) throw createError({ statusCode: 401 })\n  const session = await verify(token)\n  setHeader(event, 'X-User-Id', String(session.userId))\n  return session\n})",
            language: "typescript",
            notes: [
              "Nitro は Node / Cloudflare Workers / Deno など複数 runtime に build できる server engine",
              "`server/routes/foo.ts` で任意の URL も書ける (HTML を返す等)",
              "defineEventHandler の中で throw createError({...}) → そのまま HTTP エラーレスポンスに",
            ],
          },
          {
            heading: "4.4 エラーハンドリングと再取得",
            body: "useFetch の戻り値 `error` で API エラーを掴む。`refresh()` で再取得、`clear()` でデータをクリア。global なエラー監視は `vueApp.config.errorHandler` または `error.vue` (7 章)。",
            code: "<script setup>\nconst { data, error, pending, refresh, clear } = await useFetch('/api/posts')\n\nasync function reload() {\n  await refresh()\n}\n\nfunction reset() {\n  clear()                                    // data を null に\n}\n</script>\n\n<template>\n  <p v-if=\"pending\">Loading...</p>\n  <div v-else-if=\"error\">\n    <p>Error: {{ error.message }}</p>\n    <button @click=\"refresh\">Retry</button>\n  </div>\n  <PostList v-else :items=\"data ?? []\" />\n</template>\n\n<!-- POST 後の一覧再取得 -->\n<script setup>\nconst { data, refresh } = await useFetch('/api/posts')\nasync function add(form: PostInput) {\n  await $fetch('/api/posts', { method: 'POST', body: form })\n  await refresh()\n}\n</script>",
            language: "vue",
          },
        ],
        keyTakeaways: [
          "useFetch = URL + SSR 統合 / useAsyncData = 任意 async + SSR 統合 / $fetch = 単発",
          "lazy / pick / transform / watch / server: false で挙動を細かく制御",
          "Nitro の server/api/ + defineEventHandler で REST エンドポイント、`.get.ts` `.post.ts` でメソッド分離",
          "POST 後は refresh() で関連 useFetch を再取得",
        ],
        comprehensionQuestionIds: ["nuxt-003", "nuxt-004"],
      },
      {
        id: "state-management",
        title: "5. 状態管理 — useState / composables / Pinia",
        intro:
          "Nuxt 3 の状態管理は 3 層。コンポーネント内は ref、軽量グローバルは useState、複雑なドメイン状態は Pinia。役割で使い分ける。",
        readingMinutes: 8,
        objectives: [
          "ref / useState / Pinia をスコープで使い分けられる",
          "useState で SSR-safe な共有状態を書ける",
          "Pinia ストアを Composition API スタイルで定義できる",
        ],
        sections: [
          {
            heading: "5.1 ref はコンポーネントスコープ、useState は SSR-safe な共有",
            body: "`ref` はそのコンポーネントだけで有効。複数ページにまたがって共有したい場合は `useState(key, () => initial)` を使う。これは Nuxt 提供の SSR 対応 ref で、サーバで作った値がクライアントにシリアライズされて引き継がれる。",
            code: "<!-- ref はコンポーネントごと (別ページに行くと消える) -->\n<script setup>\nconst count = ref(0)\n</script>\n\n<!-- useState は『キー単位でアプリ全体共有』+ SSR 値を引き継ぐ -->\n<script setup>\nconst theme = useState<'light' | 'dark'>('theme', () => 'light')\nconst toggle = () => (theme.value = theme.value === 'light' ? 'dark' : 'light')\n</script>\n\n<!-- 他のページや composable から同じキーを使うと同じ値 -->\n<script setup>\nconst theme = useState('theme')               // 既存の値を取得\n</script>",
            language: "vue",
            notes: [
              "useState の初期値関数は SSR で 1 回呼ばれる — クライアントは payload から復元",
              "Composable と組み合わせると『型付きグローバル ref』のように扱える (5.2)",
            ],
          },
          {
            heading: "5.2 composables で『型付きストア』風に",
            body: "useState を Composable 関数で包むと、import 不要で型付きの API を提供できる。小〜中規模の状態管理は Pinia を入れずにこのパターンで十分なことが多い。",
            code: "// composables/useFavorites.ts\nexport const useFavorites = () => {\n  const ids = useState<number[]>('favorites', () => [])\n\n  const has = (id: number) => ids.value.includes(id)\n\n  function toggle(id: number) {\n    ids.value = has(id) ? ids.value.filter(i => i !== id) : [...ids.value, id]\n  }\n\n  return { ids, has, toggle }\n}\n\n// 使う側 (import 不要)\n<script setup>\nconst { ids, has, toggle } = useFavorites()\n</script>\n\n<template>\n  <button @click=\"toggle(post.id)\">\n    {{ has(post.id) ? '★' : '☆' }}\n  </button>\n</template>",
            language: "vue",
          },
          {
            heading: "5.3 Pinia — 公式推奨のストア",
            body: "より複雑なドメイン状態 (認証ユーザー、カート、Editor) は Pinia が向く。`defineStore(id, setupFn)` で Composition API 風に state / getters / actions を定義。`@pinia/nuxt` モジュールで自動 import + SSR 統合。",
            code: "// nuxt.config.ts\nmodules: ['@pinia/nuxt']\n\n// stores/user.ts\nexport const useUserStore = defineStore('user', () => {\n  const user = ref<User | null>(null)\n  const isLoggedIn = computed(() => user.value !== null)\n  const isAdmin = computed(() => user.value?.role === 'admin')\n\n  async function login(email: string, password: string) {\n    const result = await $fetch<User>('/api/login', {\n      method: 'POST',\n      body: { email, password },\n    })\n    user.value = result\n  }\n\n  function logout() {\n    user.value = null\n  }\n\n  return { user, isLoggedIn, isAdmin, login, logout }\n})\n\n// 使う側\n<script setup>\nconst userStore = useUserStore()\nconst { user, isLoggedIn } = storeToRefs(userStore)   // 分割代入してもリアクティブを保つ\n</script>\n\n<template>\n  <p v-if=\"isLoggedIn\">Hello, {{ user?.name }}</p>\n  <button v-else @click=\"userStore.login(email, password)\">Login</button>\n</template>",
            language: "typescript",
            notes: [
              "storeToRefs を使わずに分割代入するとリアクティブが切れる — Pinia 利用時の落とし穴",
              "@pinia/nuxt を入れると defineStore / storeToRefs も自動 import",
              "ActionsとGettersの戻り値も含めて TS の型推論が効くため、Vuex より型安全",
            ],
          },
          {
            heading: "5.4 永続化と SSR の注意",
            body: "ブラウザを閉じても残したい値は LocalStorage / Cookie に保存。Nuxt は `useCookie` を提供しており SSR-safe。Pinia は `pinia-plugin-persistedstate` で自動永続化が定番。LocalStorage は client-only のため `process.client` ガードや `onMounted` で初期化する。",
            code: "<!-- useCookie (SSR-safe) -->\n<script setup>\nconst token = useCookie('token', { sameSite: 'lax', secure: true, maxAge: 60 * 60 * 24 })\ntoken.value = 'xxx'                            // setter\n</script>\n\n<!-- Pinia 永続化 -->\n// nuxt.config.ts\nmodules: ['@pinia/nuxt', 'pinia-plugin-persistedstate/nuxt']\n\n// stores/cart.ts\nexport const useCartStore = defineStore('cart', () => { /* ... */ }, {\n  persist: true                                // localStorage に自動保存\n})\n\n<!-- LocalStorage を直接使う場合 -->\n<script setup>\nconst draft = ref('')\nonMounted(() => {\n  draft.value = localStorage.getItem('draft') ?? ''\n})\nwatch(draft, (v) => {\n  if (process.client) localStorage.setItem('draft', v)\n})\n</script>",
            language: "vue",
          },
        ],
        keyTakeaways: [
          "ref = コンポーネント、useState = アプリ全体 + SSR-safe、Pinia = 複雑なドメイン状態",
          "composables で useState を包むと型付きの軽量ストア風 API になる",
          "Pinia は Composition API スタイル + storeToRefs でリアクティブを保つ",
          "永続化は useCookie / pinia-plugin-persistedstate、ブラウザ専用 API は process.client / onMounted で囲む",
        ],
        comprehensionQuestionIds: ["nuxt-005", "nuxt-019"],
      },
      {
        id: "rendering-modes",
        title: "6. レンダリングモード — SSR / SPA / SSG / ISR / Hybrid",
        intro:
          "Nuxt はデフォルト Universal (SSR + Hydration)。`ssr: false` で SPA、`routeRules` でルート毎に Prerender / SWR / SSR / SPA を選べるハイブリッド構成も可能。",
        readingMinutes: 9,
        objectives: [
          "SSR / SPA / SSG / ISR / SWR の違いを説明できる",
          "ssr: false で SPA 化、routeRules でルート毎の戦略を指定できる",
          "client-only / server-only コンポーネント (.client.vue / .server.vue / <ClientOnly>) を使い分けられる",
        ],
        sections: [
          {
            heading: "6.1 5 つのレンダリング戦略",
            body: "**SSR (Universal)**: サーバで HTML 生成 → クライアントで Hydration。Nuxt のデフォルト。**SPA**: クライアントだけで描画 (`ssr: false`)。**SSG (Static)**: ビルド時に HTML 生成 (`prerender: true`)。**ISR / SWR (Stale-While-Revalidate)**: キャッシュした HTML を返しつつ裏で再生成 (`swr: 3600`)。**Hybrid**: routeRules でルート毎に切替。",
            code: "// nuxt.config.ts\n\n// 完全 SPA\nexport default defineNuxtConfig({\n  ssr: false,\n})\n\n// 完全 SSG (静的サイト)\n// $ npx nuxt generate\nexport default defineNuxtConfig({\n  nitro: {\n    prerender: { routes: ['/', '/about', '/blog/foo'] },\n  },\n})\n\n// Hybrid (推奨) — ルート毎に戦略\nexport default defineNuxtConfig({\n  routeRules: {\n    '/': { prerender: true },                       // ビルド時 SSG\n    '/blog/**': { swr: 3600 },                       // 1h SWR (古い HTML を返しつつ裏で更新)\n    '/products/**': { swr: 600 },\n    '/admin/**': { ssr: false },                    // 管理画面は SPA でログインゲート\n    '/api/**': { cors: true },                       // CORS 有効化\n    '/old/**': { redirect: '/new' },\n    '/sitemap.xml': { headers: { 'Cache-Control': 'max-age=86400' } },\n  },\n})",
            language: "typescript",
            notes: [
              "Nuxt の SWR は『stale な HTML をすぐ返しつつ裏でビルド』 → ISR と同じ目的",
              "管理画面など Authn 必須のページは SPA + ログイン後にデータ取得が定番",
              "完全 SSG は外部 API / DB を直接呼ばない構成と相性が良い",
            ],
          },
          {
            heading: "6.2 generate / prerender — 静的サイト化",
            body: "ビルド時に HTML をすべて吐き出す『静的サイト』にしたい場合は `nuxt generate` (内部的に prerender)。デフォルトは `/` から到達可能な内部リンクを辿って全ページを生成。動的ルート (`/users/[id]`) は `nitro.prerender.routes` で明示する。",
            code: "// nuxt.config.ts\nexport default defineNuxtConfig({\n  nitro: {\n    prerender: {\n      crawlLinks: true,                              // 内部リンクを辿る (default)\n      routes: [\n        '/sitemap.xml',\n        '/blog/foo',                                   // 動的ルートを明示\n        '/users/1', '/users/2', '/users/3',\n      ],\n      // 失敗時の挙動\n      failOnError: false,\n      ignore: ['/admin'],                              // 除外パス\n    },\n  },\n})\n\n// 実行\n// $ npx nuxt generate\n// → .output/public/ に static HTML\n\n// 動的に列挙したい場合 — ビルド時 hook で計算\nimport { defineNuxtConfig } from 'nuxt/config'\n\nexport default defineNuxtConfig({\n  hooks: {\n    async 'prerender:routes'(ctx) {\n      const posts = await $fetch('https://api.example.com/posts')\n      posts.forEach((p: any) => ctx.routes.add(`/blog/${p.slug}`))\n    },\n  },\n})",
            language: "typescript",
          },
          {
            heading: "6.3 ClientOnly / .client.vue / .server.vue",
            body: "ブラウザ専用 API (window / localStorage / canvas) を使うコンポーネントは SSR でエラーになる。回避策は 3 つ: (1) コンポーネント名を `.client.vue` にする → SSR スキップ、(2) `<ClientOnly>` でラップ → 子だけ client、(3) `<ClientOnly fallback=>` で SSR 中の代替表示。逆に `.server.vue` でサーバ専用も可能。",
            code: "<!-- 方法 1: ファイル名サフィックス -->\n<!-- components/MyChart.client.vue -->\n<script setup>\nimport { Chart } from 'chart.js'\n// window / Chart などブラウザ API OK\n</script>\n\n<!-- 方法 2: ClientOnly でラップ -->\n<template>\n  <ClientOnly fallback-tag=\"div\" fallback=\"Loading chart...\">\n    <MyChart :data=\"data\" />\n  </ClientOnly>\n</template>\n\n<!-- 方法 3: process.client / onMounted で防御 -->\n<script setup>\nconst width = ref(0)\nonMounted(() => {\n  width.value = window.innerWidth          // SSR では走らない\n})\n</script>\n\n<!-- .server.vue — サーバ専用 (DB アクセスをコンポーネント内で完結) -->\n<!-- components/PostList.server.vue -->\n<script setup>\nconst posts = await db.post.findMany()   // クライアントには bundle されない\n</script>",
            language: "vue",
            notes: [
              ".client.vue は完全に SSR をスキップ → ハイドレーション中はその位置に何も無い",
              "Lighthouse 等のスコアで気になるなら fallback 付き <ClientOnly> でスケルトンを出す",
              ".server.vue はクライアントに bundle されないので、機密ロジックを含めても OK",
            ],
          },
          {
            heading: "6.4 Edge / Node / Cloudflare — デプロイターゲット",
            body: "Nuxt の server (Nitro) は複数の runtime に build できる。`nitro.preset` で `node-server` (デフォルト) / `vercel` / `vercel-edge` / `cloudflare-pages` / `netlify` / `bun` / `aws-lambda` などを指定。`nuxt build` 後に `.output/` ができ、対応する起動コマンドで動く。",
            code: "// nuxt.config.ts\nexport default defineNuxtConfig({\n  nitro: {\n    preset: 'cloudflare-pages',           // Cloudflare Pages 用\n    // preset: 'vercel-edge',              // Vercel Edge\n    // preset: 'node-server',              // Node (デフォルト)\n    // preset: 'aws-lambda',\n    // preset: 'bun',\n  },\n})\n\n// 起動 (Node の場合)\n// $ node .output/server/index.mjs\n\n// 環境変数 NITRO_PRESET でも上書き可\n// $ NITRO_PRESET=cloudflare-pages npx nuxt build",
            language: "typescript",
            notes: [
              "Edge ランタイム (Cloudflare Workers / Vercel Edge) は Node 専用 API (fs 等) が使えない — DB アクセスは HTTP 経由 (PlanetScale / Neon / Hyperdrive など) に",
              "preset を変えるだけで `.output/` の構造が変わる — Nuxt がやってくれる",
            ],
          },
        ],
        keyTakeaways: [
          "Nuxt のデフォルトは SSR (Universal)、ssr: false で SPA、prerender で SSG、swr で ISR 相当",
          "routeRules でルート毎に prerender / swr / ssr / redirect / headers を細かく制御",
          ".client.vue / <ClientOnly> でブラウザ専用 API を安全に扱う、.server.vue で機密ロジックをサーバ限定",
          "nitro.preset で Node / Vercel / Cloudflare / AWS Lambda などへ build ターゲット切替",
        ],
        comprehensionQuestionIds: ["nuxt-012", "nuxt-016"],
      },
      {
        id: "seo-errors-deploy",
        title: "7. SEO・エラーハンドリング・本番運用",
        intro:
          "useHead / useSeoMeta で <head> 制御、error.vue でアプリ全体のエラー UI、runtimeConfig で環境変数、nitro preset で本番デプロイ。",
        readingMinutes: 10,
        objectives: [
          "useSeoMeta / useHead で動的メタタグ・OG・canonical を制御できる",
          "error.vue でグローバルエラー UI、createError で任意のエラー発生を扱える",
          "runtimeConfig (server / public) と .env の関係を理解する、本番デプロイの基本フローを書ける",
        ],
        references: [
          { label: "Nuxt SEO ガイド (公式)", url: "https://nuxt.com/docs/getting-started/seo-meta" },
          { label: "Nuxt deploy (公式)", url: "https://nuxt.com/docs/getting-started/deployment" },
        ],
        sections: [
          {
            heading: "7.1 useSeoMeta / useHead — 動的 <head>",
            body: "`useSeoMeta({ title, description, ogTitle, ... })` は SEO 用に型付きで主要メタを設定できる便利版。より低レベルに `<title>` `<link>` `<meta>` 全般を扱いたい時は `useHead({ title, meta, link, script })`。値に getter (関数 or computed) を渡すとリアクティブに更新される。",
            code: "<script setup lang=\"ts\">\nconst { data: post } = await useFetch(`/api/posts/${useRoute().params.slug}`)\n\n// SEO 専用 (型付き、推奨)\nuseSeoMeta({\n  title: () => post.value?.title,\n  description: () => post.value?.excerpt,\n  ogTitle: () => post.value?.title,\n  ogImage: () => post.value?.coverUrl,\n  ogType: 'article',\n  twitterCard: 'summary_large_image',\n})\n\n// 低レベル (link / script など)\nuseHead({\n  htmlAttrs: { lang: 'ja' },\n  link: [\n    { rel: 'canonical', href: () => `https://example.com/posts/${post.value?.slug}` },\n    { rel: 'icon', href: '/favicon.ico' },\n  ],\n  script: [\n    { src: 'https://cdn.example.com/script.js', defer: true },\n  ],\n  meta: [\n    { name: 'theme-color', content: '#00DC82' },\n  ],\n})\n</script>",
            language: "vue",
            notes: [
              "useSeoMeta は型補完で OG / Twitter / Article 用のキーが全部出る",
              "値に関数 / computed を渡せばリアクティブに更新 — 動的タイトルは getter 形式で",
            ],
          },
          {
            heading: "7.2 error.vue と createError — エラーハンドリング",
            body: "プロジェクトルート直下に `error.vue` を置くと、404 / 500 / その他全部の表示を担当。props の `error` でステータスとメッセージを受ける。任意の場所で `throw createError({ statusCode: 404 })` を投げると error.vue に飛ぶ。`clearError({ redirect: '/' })` でリセット + 遷移。",
            code: "<!-- error.vue (プロジェクトルート直下) -->\n<script setup lang=\"ts\">\nimport type { NuxtError } from '#app'\n\nconst props = defineProps<{ error: NuxtError }>()\n\nuseSeoMeta({ title: `${props.error.statusCode} | エラー` })\n\nconst handleError = () => clearError({ redirect: '/' })\n</script>\n\n<template>\n  <div class=\"min-h-screen grid place-items-center\">\n    <div class=\"text-center\">\n      <h1 class=\"text-6xl font-bold\">{{ error.statusCode }}</h1>\n      <p class=\"mt-4 text-zinc-600\">{{ error.statusMessage || error.message }}</p>\n      <button class=\"mt-6 rounded bg-emerald-500 px-4 py-2 text-white\" @click=\"handleError\">\n        ホームへ戻る\n      </button>\n    </div>\n  </div>\n</template>\n\n<!-- 任意の場所で 404 を投げる -->\n<script setup>\nconst { data: post } = await useFetch(`/api/posts/${id}`)\nif (!post.value) {\n  throw createError({ statusCode: 404, statusMessage: 'Post not found', fatal: true })\n}\n</script>\n\n<!-- server/api でも同じ -->\nexport default defineEventHandler(async (event) => {\n  const post = await db.post.findUnique(...)\n  if (!post) throw createError({ statusCode: 404 })\n  return post\n})",
            language: "vue",
            notes: [
              "fatal: true で error.vue に遷移、false だと『useError の値が更新される』だけ",
              "クライアント側の予期せぬエラーは onErrorCaptured / vueApp.config.errorHandler でロギング (Sentry など)",
            ],
          },
          {
            heading: "7.3 runtimeConfig と .env",
            body: "`nuxt.config.ts` の `runtimeConfig` で環境変数を宣言する。`runtimeConfig` 直下は **server 専用**、`public` 配下は **クライアントに公開**。`useRuntimeConfig()` で取得。`.env` の値は `NUXT_XXX` (server) / `NUXT_PUBLIC_XXX` (public) でキーを上書きできる。",
            code: "// nuxt.config.ts\nexport default defineNuxtConfig({\n  runtimeConfig: {\n    // Server 専用 (クライアントに漏れない)\n    apiSecret: '',\n    databaseUrl: '',\n\n    public: {\n      // クライアントにも公開 (バンドルに埋め込まれる)\n      baseUrl: 'http://localhost:3000',\n      gaId: '',\n    },\n  },\n})\n\n// .env (gitignore 対象)\nNUXT_API_SECRET=sk_live_xxx              # runtimeConfig.apiSecret に入る\nNUXT_DATABASE_URL=postgresql://...\nNUXT_PUBLIC_BASE_URL=https://example.com  # public.baseUrl に入る\nNUXT_PUBLIC_GA_ID=G-XXX\n\n// 使う側\n<script setup>\nconst config = useRuntimeConfig()\nconsole.log(config.public.baseUrl)         // クライアント / サーバ両方 OK\n// console.log(config.apiSecret)            // server でしかアクセスしてはいけない\n</script>\n\n// server/api/* では問題なく\nexport default defineEventHandler(() => {\n  const { apiSecret } = useRuntimeConfig()\n  return fetch('https://api.example.com/x', { headers: { Authorization: `Bearer ${apiSecret}` } })\n})",
            language: "typescript",
            notes: [
              "public 配下に書いたものは『クライアントに渡る前提』 — 機密を入れない",
              "NUXT_PUBLIC_XXX = public.xxx、NUXT_XXX = ルート直下のキーに対応",
              ".env はチーム共有しない (代わりに .env.example をコミット)",
            ],
          },
          {
            heading: "7.4 本番ビルド・デプロイ",
            body: "`nuxt build` で `.output/` が生成 (server + static)。Node なら `node .output/server/index.mjs` で起動。Vercel / Netlify / Cloudflare Pages にデプロイするなら nitro preset を切り替えるだけで OK。静的サイトなら `nuxt generate` で `.output/public/` を CDN 配信。",
            code: "# 依存インストール\nnpm ci\n\n# Production build (SSR)\nnpx nuxt build\n# → .output/server/, .output/public/\n\n# 起動 (Node)\nnode .output/server/index.mjs\n# or PORT=8080 HOST=0.0.0.0 node .output/server/index.mjs\n\n# 静的サイト (SSG)\nnpx nuxt generate\n# → .output/public/ を S3 / Netlify / Cloudflare Pages にアップロード\n\n# Dockerfile (Node 自前ホスト)\nFROM node:22-alpine AS build\nWORKDIR /app\nCOPY package*.json ./\nRUN npm ci\nCOPY . .\nRUN npx nuxt build\n\nFROM node:22-alpine AS runner\nWORKDIR /app\nENV NODE_ENV=production\nCOPY --from=build /app/.output ./.output\nEXPOSE 3000\nCMD [\"node\", \".output/server/index.mjs\"]\n\n# Vercel — リポジトリを import すれば preset 自動検出\n# Cloudflare Pages — Build command: nuxt build / preset: cloudflare-pages\n# Netlify — Build command: nuxt build / preset: netlify\n",
            language: "bash",
            notes: [
              "Vercel と Cloudflare Pages は preset を自動検出するケースが多い",
              "本番デプロイ前に NUXT_PUBLIC_BASE_URL を更新するのを忘れない (canonical / OG に効く)",
              "ヘルスチェックは server/api/health.get.ts などで `return { status: 'ok' }` を返すと便利",
            ],
          },
        ],
        keyTakeaways: [
          "useSeoMeta / useHead で動的 <head>。getter 形式でリアクティブに",
          "error.vue + createError でアプリ全体のエラー UI、clearError で復帰",
          "runtimeConfig は server / public を必ず分ける、.env は NUXT_PUBLIC_ プレフィックスがクライアント露出",
          "nuxt build → .output/、preset を切り替えるだけで Node / Vercel / Cloudflare に対応",
        ],
        comprehensionQuestionIds: ["nuxt-008", "nuxt-015", "nuxt-017"],
      },
    ],
};
