import type { Guide } from "./types";

export const nextjsIntroGuide: Guide = {
    id: "nextjs-intro",
    trackId: "nextjs",
    title: "Next.js の地図 — App Router と RSC の世界",
    subtitle:
      "Next.js 13+ の App Router を 7 章で。ファイル規約 → Server/Client 境界 → Caching → Server Actions → Routing 応用 → Streaming/Suspense → 本番運用",
    audience:
      "React は書けるが Next.js の App Router / RSC / Server Actions / キャッシュ戦略で迷子になる人。Pages Router からの移行ガイドとしても",
    sources: [
      { label: "Next.js 公式ドキュメント (App Router)", url: "https://nextjs.org/docs" },
      { label: "App Router Learn (公式チュートリアル)", url: "https://nextjs.org/learn" },
      { label: "Vercel Blog", url: "https://vercel.com/blog" },
    ],
    emoji: "▲",
    relatedCategoryIds: ["nextjs-basics"],
    chapters: [
      {
        id: "app-router-file-conventions",
        title: "1. App Router のファイル規約 — page / layout / loading / error / route",
        intro:
          "Next.js 13+ の App Router はディレクトリベースのファイル規約。page.tsx / layout.tsx / loading.tsx / error.tsx / not-found.tsx / route.ts の役割と、動的ルートを整理。",
        readingMinutes: 8,
        objectives: [
          "App Router の主要な規約ファイル 6 つを書ける",
          "動的セグメント `[id]` / キャッチオール `[...slug]` / オプショナル `[[...slug]]` を使い分けられる",
          "ルートグループ `(group)` でルーティングに影響せずレイアウトを分離できる",
        ],
        sections: [
          {
            heading: "1.1 ファイル規約 6 つ",
            body: "App Router (Next 13.4+) は `app/` ディレクトリ配下のファイル名で挙動が決まる。`page.tsx` がそのパスのページ、`layout.tsx` がそのディレクトリ以下の共通レイアウト (state を保持)、`loading.tsx` が Suspense fallback、`error.tsx` が Error Boundary、`not-found.tsx` が 404、`route.ts` が API エンドポイント。",
            code: "app/\n  layout.tsx                 ルートレイアウト (必須、html/body を含む)\n  page.tsx                   → /\n  loading.tsx                ルート Suspense fallback\n  error.tsx                  ルート Error Boundary (Client 必須)\n  not-found.tsx              404\n  about/\n    page.tsx                 → /about\n  blog/\n    layout.tsx               /blog 配下の共通レイアウト\n    page.tsx                 → /blog\n    [slug]/                  動的セグメント\n      page.tsx               → /blog/foo\n      loading.tsx            セクション固有 fallback\n  api/\n    posts/\n      route.ts               → /api/posts (Route Handler)\n      [id]/\n        route.ts             → /api/posts/123",
            language: "text",
            notes: [
              "layout.tsx は URL 遷移をまたいで再レンダリングされない (state を保持)",
              "loading.tsx / error.tsx は自動で Suspense / Error Boundary でラップされる",
              "Pages Router (`pages/`) は App Router と共存可能だが、新規は App Router で",
            ],
          },
          {
            heading: "1.2 layout.tsx — ネスト可能な共通 UI",
            body: "ルート `app/layout.tsx` は必須で `<html>` と `<body>` を返す唯一の場所。各セクションに追加の layout.tsx を置くとネストする。children を render することでページが入る。URL 遷移時に同じ layout を共有していれば再レンダリングされず、サイドバーのスクロール位置などが保たれる。",
            code: "// app/layout.tsx (ルート、必須)\nimport './globals.css'\nexport default function RootLayout({ children }: { children: React.ReactNode }) {\n  return (\n    <html lang=\"ja\">\n      <body>\n        <Header />\n        {children}\n        <Footer />\n      </body>\n    </html>\n  )\n}\n\n// app/blog/layout.tsx (セクション固有)\nexport default function BlogLayout({ children }: { children: React.ReactNode }) {\n  return (\n    <div className=\"grid grid-cols-[200px_1fr] gap-8\">\n      <BlogSidebar />\n      <main>{children}</main>\n    </div>\n  )\n}\n\n// /blog/intro へアクセスすると:\n// RootLayout → BlogLayout → app/blog/[slug]/page.tsx の入れ子で描画",
            language: "tsx",
          },
          {
            heading: "1.3 動的セグメント — [id] / [...slug] / [[...slug]]",
            body: "`[id]` で 1 セグメントの動的ルート、`[...slug]` でキャッチオール (複数セグメント全部)、`[[...slug]]` でオプショナルキャッチオール (無しでもマッチ)。Next.js 15+ では `params` / `searchParams` が Promise になったので await が必要。",
            code: "// app/users/[id]/page.tsx (Next 15+)\ntype PageProps = {\n  params: Promise<{ id: string }>\n  searchParams: Promise<{ q?: string }>\n}\n\nexport default async function UserPage({ params, searchParams }: PageProps) {\n  const { id } = await params\n  const { q } = await searchParams\n  const user = await db.user.findUnique({ where: { id: Number(id) } })\n  return <UserCard user={user} />\n}\n\n// キャッチオール\n// app/docs/[...slug]/page.tsx\n// /docs/a/b/c → params.slug = ['a', 'b', 'c']\n\n// オプショナルキャッチオール\n// app/shop/[[...filter]]/page.tsx\n// /shop          → params.filter = undefined\n// /shop/sale     → params.filter = ['sale']\n// /shop/sale/men → params.filter = ['sale', 'men']\n\n// generateStaticParams で SSG\nexport async function generateStaticParams() {\n  const users = await db.user.findMany({ select: { id: true } })\n  return users.map(u => ({ id: u.id.toString() }))\n}",
            language: "tsx",
            notes: [
              "Next.js 15 で params/searchParams が Promise 化 — 14 までは同期オブジェクト",
              "generateStaticParams で列挙したパスはビルド時に SSG、未列挙は dynamic (or 404)",
            ],
          },
          {
            heading: "1.4 ルートグループ (group) と Route Handler",
            body: "`(group)` でディレクトリ名を URL に含めずに layout を分割できる (認証エリアと公開エリアで layout を変えるなど)。Route Handler (`route.ts`) は GET / POST / PUT / DELETE / PATCH を export して REST API を作る。Web 標準の Request / Response。",
            code: "// ルートグループの例\napp/\n  (marketing)/                ← URL に含まれない\n    layout.tsx                公開ページ用 layout\n    page.tsx                  → /\n    about/page.tsx            → /about\n  (app)/                      ← URL に含まれない\n    layout.tsx                認証必須 layout\n    dashboard/page.tsx        → /dashboard\n    settings/page.tsx         → /settings\n\n// Route Handler\n// app/api/posts/route.ts\nimport { NextRequest, NextResponse } from 'next/server'\nimport { db } from '@/lib/db'\n\nexport async function GET(req: NextRequest) {\n  const posts = await db.post.findMany()\n  return NextResponse.json(posts)\n}\n\nexport async function POST(req: NextRequest) {\n  const body = await req.json()\n  const post = await db.post.create({ data: body })\n  return NextResponse.json(post, { status: 201 })\n}\n\n// 動的ルート\n// app/api/posts/[id]/route.ts (Next 15+: params は Promise)\nexport async function GET(\n  req: NextRequest,\n  { params }: { params: Promise<{ id: string }> }\n) {\n  const { id } = await params\n  const post = await db.post.findUnique({ where: { id: Number(id) } })\n  if (!post) return NextResponse.json({ error: 'not found' }, { status: 404 })\n  return NextResponse.json(post)\n}",
            language: "tsx",
            notes: [
              "ルートグループは URL に影響しないので、layout の使い分けだけが目的",
              "Route Handler は Server Component の async fetch と用途が違う — 外部からの REST API として叩く時に使う",
            ],
          },
        ],
        keyTakeaways: [
          "App Router の主要規約: page / layout / loading / error / not-found / route の 6 ファイル",
          "layout はネスト可能・遷移で再レンダリングされない (state 保持)",
          "動的ルート [id] / [...slug] / [[...slug]] と generateStaticParams で SSG",
          "Next 15+ では params / searchParams は Promise — await 必須",
        ],
        comprehensionQuestionIds: ["next-001", "next-003", "next-006", "next-007"],
      },
      {
        id: "server-client-components",
        title: "2. Server / Client Components — 境界の引き方",
        intro:
          "App Router のデフォルトは Server Component。'use client' で Client 化する境界をどこに引くか、シリアライズ可能 props の制約を整理。",
        readingMinutes: 8,
        objectives: [
          "Server Component と Client Component それぞれの利点と制約を説明できる",
          "'use client' を境界の『葉』に置く設計原則を理解する",
          "Server → Client へ渡せる props (シリアライズ可能) の範囲を判別できる",
        ],
        sections: [
          {
            heading: "2.1 デフォルトは Server Component",
            body: "App Router では `'use client'` を付けないファイルはすべて Server Component。サーバーで実行されてから HTML が配信される。利点: (1) DB / 機密情報に直接アクセス、(2) JS バンドルがゼロ (クライアントに送られない)、(3) SEO 向上、(4) Streaming SSR。制約: state / Hook / イベントハンドラ / ブラウザ API が使えない。",
            code: "// app/page.tsx (Server Component — デフォルト)\nimport { db } from '@/lib/db'\n\nexport default async function Home() {\n  const posts = await db.post.findMany({          // DB 直接アクセス OK\n    where: { published: true },\n    orderBy: { createdAt: 'desc' },\n    take: 10,\n  })\n  return (\n    <main>\n      <h1>Recent Posts</h1>\n      <ul>\n        {posts.map(p => (\n          <li key={p.id}>{p.title}</li>          // useState などは使えない\n        ))}\n      </ul>\n    </main>\n  )\n}\n\n// 環境変数も Server なら自由にアクセス\nconst apiKey = process.env.PRIVATE_API_KEY      // クライアントには漏れない\n\n// 機密 token を fetch のヘッダに\nawait fetch('https://api.example.com/data', {\n  headers: { Authorization: `Bearer ${apiKey}` }\n})",
            language: "tsx",
            notes: [
              "Server Component の JS はクライアントに送られない → バンドルサイズ削減",
              "Server で例外を throw すると error.tsx (Client) でハンドルされる",
            ],
          },
          {
            heading: "2.2 'use client' — Client Component への切替",
            body: "ファイルの先頭に `'use client'` を書くと、そのファイルとそこから import される全コンポーネントが Client Component になる (Client tree)。state / Hook / イベント / ブラウザ API が必要な部分のみに使う。",
            code: "// app/components/counter.tsx\n'use client'\nimport { useState } from 'react'\n\nexport function Counter({ initial = 0 }: { initial?: number }) {\n  const [n, setN] = useState(initial)\n  return (\n    <button onClick={() => setN(n + 1)}>\n      Count: {n}\n    </button>\n  )\n}\n\n// app/page.tsx (Server Component)\nimport { Counter } from './components/counter'\n\nexport default async function Page() {\n  const stats = await db.stats.findFirst()\n  return (\n    <div>\n      <h1>Dashboard</h1>\n      <p>Total: {stats.total}</p>\n      <Counter initial={stats.total} />          {/* Server から Client に渡す */}\n    </div>\n  )\n}",
            language: "tsx",
            notes: [
              "'use client' は『そのファイルから下が Client tree』の宣言 — 各ファイルに書く必要はない",
              "Client 内から Server Component は import できない (children で受けるなら OK)",
            ],
          },
          {
            heading: "2.3 境界は『葉』に引く — Client tree を最小に",
            body: "悪い例: ページ全体に 'use client' → バンドルが膨らみ Server Component の利点が消える。良い例: インタラクティブな部品 (Counter / Modal / Form) だけ 'use client' にして、その周りは Server。Client Component の子に Server Component を渡す時は children pattern を使う。",
            code: "// ❌ ページ全体を Client 化 → バンドル膨張、DB 直接アクセス不可\n'use client'\nexport default function Page() {\n  const [n, setN] = useState(0)\n  return <main>...</main>\n}\n\n// ✅ Server をベースに、必要箇所だけ Client\n// app/page.tsx (Server)\nimport { ClientWidget } from './widget'\nimport { db } from '@/lib/db'\n\nexport default async function Page() {\n  const data = await db.dashboard.fetch()\n  return (\n    <main>\n      <Stats data={data} />\n      <ClientWidget initial={data.count} />\n    </main>\n  )\n}\n\n// ✅ children pattern: Client Component に Server を子として渡す\n// app/components/modal.tsx\n'use client'\nimport { useState } from 'react'\nexport function Modal({ children }: { children: React.ReactNode }) {\n  const [open, setOpen] = useState(false)\n  return (\n    <>\n      <button onClick={() => setOpen(true)}>Open</button>\n      {open && <div className=\"modal\">{children}</div>}\n    </>\n  )\n}\n\n// app/page.tsx (Server)\nimport { Modal } from './components/modal'\nimport { ExpensiveServerChart } from './chart'   // Server Component\n\nexport default async function Page() {\n  return (\n    <Modal>\n      <ExpensiveServerChart />                    {/* Server のまま中に */}\n    </Modal>\n  )\n}",
            language: "tsx",
            notes: [
              "『Client が必要 = ページ全部 Client』ではない。葉に押し下げる",
              "children として受け取る限り、Client の中に Server を入れられる",
            ],
          },
          {
            heading: "2.4 Server → Client の props はシリアライズ可能なものに",
            body: "Server Component から Client Component に渡す props は、JSON でシリアライズ可能なものに限られる: `string` / `number` / `boolean` / `null` / `undefined` / 配列 / プレーンオブジェクト / Promise (React 19+) / Map / Set / Date など。**関数は渡せない** (Server Actions 経由で別途扱う)。",
            code: "// Server Component\nimport { ClientChild } from './client-child'\n\nexport default async function Page() {\n  const user = await db.user.findFirst()\n  return (\n    <ClientChild\n      name={user.name}                  // ✅ string\n      age={user.age}                    // ✅ number\n      tags={['a', 'b', 'c']}            // ✅ string[]\n      meta={{ key: 'value' }}           // ✅ plain object\n      date={user.createdAt}             // ✅ Date (React 19+)\n      // onClick={() => {}}              // ❌ 関数は渡せない\n      // ref={ref}                       // ❌ ref も渡せない\n    />\n  )\n}\n\n// 関数を呼びたいなら Server Action 経由\nimport { deleteUser } from './actions'   // 'use server' の関数\n\n<ClientChild onDelete={deleteUser} />   // ✅ Server Action は OK\n\n// Promise を渡して Client で use() (React 19+)\nimport { use, Suspense } from 'react'\n\nfunction Page() {\n  const promise = fetchPosts()             // await しない\n  return (\n    <Suspense fallback={<Loading />}>\n      <ClientPosts promise={promise} />\n    </Suspense>\n  )\n}\n\n'use client'\nfunction ClientPosts({ promise }: { promise: Promise<Post[]> }) {\n  const posts = use(promise)\n  return <PostList items={posts} />\n}",
            language: "tsx",
            notes: [
              "Date や Map なども TC39 提案の Structured Clone Algorithm 拡張に追従して順次サポート",
              "React 19 で Promise の受け渡しが可能に — Server で fetch を始めて Client で use() する Streaming パターン",
            ],
          },
        ],
        keyTakeaways: [
          "App Router のデフォルトは Server Component — JS ゼロ・DB 直接アクセス OK",
          "'use client' は『葉』に引く — Client tree を最小化",
          "Client の中に Server を入れたい時は children pattern",
          "Server → Client の props はシリアライズ可能なものに限定 (関数は Server Action 経由)",
        ],
        comprehensionQuestionIds: ["next-002", "next-009"],
      },
      {
        id: "data-fetching-and-caching",
        title: "3. データ取得とキャッシング — fetch / revalidate / Tag",
        intro:
          "App Router の Server Component は async/await で直接 fetch。Next.js が fetch をラップしてキャッシュ統合する。デフォルト挙動・no-store・ISR・Tag 無効化を整理。",
        readingMinutes: 10,
        objectives: [
          "Server Component で async/await による直接 fetch を書ける",
          "fetch のキャッシュオプション (cache / next.revalidate / next.tags) を使い分けられる",
          "revalidatePath / revalidateTag で再生成のトリガーを書ける",
        ],
        references: [
          { label: "Caching in Next.js (公式)", url: "https://nextjs.org/docs/app/building-your-application/caching" },
        ],
        sections: [
          {
            heading: "3.1 async/await による直接 fetch",
            body: "App Router の Server Component は `async function` にして、内部で await を直接書ける。Pages Router の `getStaticProps` / `getServerSideProps` / `getInitialProps` は不要。fetch は Next.js が拡張していて、オプションでキャッシュ戦略を指定できる。",
            code: "// app/posts/page.tsx (Server Component)\nexport default async function PostsPage() {\n  const posts = await fetch('https://api.example.com/posts').then(r => r.json())\n  return <PostList items={posts} />\n}\n\n// DB 直接 (Prisma)\nexport default async function PostsPage() {\n  const posts = await db.post.findMany({ orderBy: { createdAt: 'desc' } })\n  return <PostList items={posts} />\n}\n\n// 並列取得 — Promise.all で同時実行 (Waterfall を避ける)\nexport default async function DashboardPage() {\n  const [users, posts, comments] = await Promise.all([\n    db.user.count(),\n    db.post.findMany({ take: 5 }),\n    db.comment.findMany({ take: 10 }),\n  ])\n  return <Dashboard users={users} posts={posts} comments={comments} />\n}\n\n// 順次 (依存あり)\nconst user = await db.user.findFirst()\nconst posts = await db.post.findMany({ where: { userId: user.id } })",
            language: "tsx",
            notes: [
              "並列化できる fetch は必ず Promise.all で並列に — 順次 await すると Waterfall で遅くなる",
              "page.tsx だけでなく layout.tsx や 各コンポーネントでも async/await で fetch できる",
            ],
          },
          {
            heading: "3.2 fetch のキャッシュ統合",
            body: "Next.js の fetch は標準より拡張されていて、第 2 引数でキャッシュ戦略を指定できる。`cache: 'force-cache'` (デフォルト、永続)、`cache: 'no-store'` (毎回フェッチ)、`next.revalidate: 60` (ISR、60 秒)、`next.tags: ['posts']` (Tag 付け)。注: Next.js 15 から fetch のデフォルトが no-store になった。",
            code: "// 永続キャッシュ (Next 14 までのデフォルト)\nawait fetch(url, { cache: 'force-cache' })\n\n// 毎回フェッチ (Next 15 からのデフォルト)\nawait fetch(url, { cache: 'no-store' })\n\n// ISR (Incremental Static Regeneration、60 秒毎に再生成)\nawait fetch(url, { next: { revalidate: 60 } })\n\n// Tag 付け (revalidateTag でまとめて無効化)\nawait fetch(url, { next: { tags: ['posts'] } })\n\n// route ごとのデフォルトを指定\n// app/posts/page.tsx\nexport const revalidate = 60         // この route のすべての fetch が 60 秒\nexport const dynamic = 'force-dynamic'  // 毎回 SSR\nexport const dynamic = 'force-static'   // 完全 SSG\n\n// fetch を使わない DB クエリのキャッシュは unstable_cache\nimport { unstable_cache } from 'next/cache'\nconst getCachedPosts = unstable_cache(\n  async () => db.post.findMany(),\n  ['posts'],\n  { tags: ['posts'], revalidate: 60 }\n)",
            language: "tsx",
            notes: [
              "Next.js 15 で fetch のデフォルトキャッシュ挙動が変更 (force-cache → no-store)",
              "ISR は『定期的に裏で再生成、訪問者には即座に古いキャッシュを返す』",
            ],
          },
          {
            heading: "3.3 revalidatePath / revalidateTag — 明示的無効化",
            body: "データ更新時 (Server Action や Webhook の中で) 関連するキャッシュを明示的に無効化する。`revalidatePath('/posts')` で特定ページのキャッシュ、`revalidateTag('posts')` で同じ tag を持つ fetch を一括無効化。Server Action の鉄板パターン。",
            code: "// app/actions.ts\n'use server'\nimport { revalidatePath, revalidateTag } from 'next/cache'\nimport { db } from '@/lib/db'\n\nexport async function createPost(formData: FormData) {\n  const title = formData.get('title') as string\n  await db.post.create({ data: { title } })\n\n  revalidatePath('/posts')        // /posts のキャッシュをクリア\n  // または\n  revalidateTag('posts')          // tag='posts' の fetch を全て無効化\n}\n\n// 投稿に紐づく複数キャッシュをまとめて無効化\nexport async function updatePost(id: number, data: PostInput) {\n  await db.post.update({ where: { id }, data })\n  revalidateTag('posts')           // 一覧キャッシュ\n  revalidateTag(`post-${id}`)      // 個別キャッシュ\n  revalidatePath(`/posts/${id}`)\n}\n\n// Route Handler から (例えば Webhook)\nexport async function POST(req: NextRequest) {\n  const { secret } = await req.json()\n  if (secret !== process.env.WEBHOOK_SECRET) {\n    return NextResponse.json({ error: 'unauthorized' }, { status: 401 })\n  }\n  revalidateTag('posts')\n  return NextResponse.json({ revalidated: true })\n}",
            language: "tsx",
            notes: [
              "tag は文字列なら何でも OK — `post-${id}` のような動的タグも便利",
              "revalidatePath はそのルートのキャッシュをまとめて (data + full route)",
            ],
          },
          {
            heading: "3.4 4 層キャッシュの全体像",
            body: "Next.js のキャッシュは多層 (Request Memoization / Data Cache / Full Route Cache / Router Cache)。理解しておくと挙動が読みやすい。普段は fetch のキャッシュオプションと revalidatePath/Tag だけで足りる。",
            code: "// (1) Request Memoization — 同一 render 内の同じ fetch を 1 回に dedupe\n// 同じ render tree で同じ URL を fetch しても 1 回しか飛ばない\n\n// (2) Data Cache — fetch / unstable_cache の結果、デプロイ間で永続\n// 'force-cache' / next.revalidate / next.tags で制御\n\n// (3) Full Route Cache — ビルド時 or revalidate 後の HTML をキャッシュ\n// dynamic = 'force-static' / 'force-dynamic' で挙動指定\n\n// (4) Router Cache — クライアント側、Link 遷移用の RSC ペイロードを保持\n// router.refresh() / revalidatePath() で更新\n\n// 図解 (簡易)\n// User → Router Cache (Client) → Full Route Cache → Data Cache → 外部 API/DB\n//          ↑ Link prefetch        ↑ revalidatePath   ↑ revalidateTag/fetch opts",
            language: "tsx",
            diagram: `flowchart LR
  U["👤 User<br/>(ブラウザ)"] --> RC["① Router Cache<br/>(Client / RSC payload)"]
  RC --> FRC["② Full Route Cache<br/>(HTML, build or revalidate)"]
  FRC --> DC["③ Data Cache<br/>(fetch / unstable_cache)"]
  DC --> RM["④ Request Memoization<br/>(同一 render 内 dedupe)"]
  RM --> EXT["外部 API / DB"]

  R1["router.refresh()<br/>revalidatePath()"] -.-> RC
  R2["revalidatePath()<br/>dynamic='force-dynamic'"] -.-> FRC
  R3["revalidateTag()<br/>cache: 'no-store'"] -.-> DC`,
            diagramCaption: "Next.js の 4 層キャッシュ — User からの距離が近いほどキャッシュが効くが、無効化操作の対象も増える",
            notes: [
              "ふつうは Data Cache (fetch オプション + revalidateTag) を意識すれば十分",
              "本番でキャッシュが思わぬ挙動なら、まず dynamic/revalidate を明示してみる",
            ],
          },
        ],
        keyTakeaways: [
          "Server Component で async/await + fetch、Promise.all で並列化",
          "fetch のキャッシュオプション (no-store / revalidate / tags) で戦略を制御",
          "Server Action 後は revalidatePath / revalidateTag で関連キャッシュをクリア",
          "Next 15 で fetch のデフォルトが no-store に — 明示するクセを",
        ],
        comprehensionQuestionIds: ["next-005", "next-010"],
      },
      {
        id: "server-actions-and-forms",
        title: "4. Server Actions とフォーム — Progressive Enhancement",
        intro:
          "'use server' で宣言した関数を `<form action={fn}>` に渡せば、JS 無し (Progressive Enhancement) でも動くフォームに。useFormStatus / useActionState / useOptimistic で UX を磨く。",
        readingMinutes: 9,
        objectives: [
          "Server Action ('use server') の定義方法と呼び出し方を書ける",
          "useFormStatus と useActionState で送信中・エラー状態を扱える",
          "useOptimistic で楽観的更新を実装できる",
        ],
        sections: [
          {
            heading: "4.1 Server Action の定義 — 関数 or ファイル単位",
            body: "Server Action は 2 通りの宣言方法がある。**ファイル単位**: ファイル冒頭に `'use server'` を書くと、その module の export 関数がすべて Server Action になる (Client から import 可)。**関数単位**: Server Component の中で関数定義の冒頭に `'use server'` を書く (その場で使うのに便利)。",
            code: "// 方法 1: ファイル単位 (推奨、import して再利用)\n// app/actions/post.ts\n'use server'\nimport { revalidatePath } from 'next/cache'\nimport { db } from '@/lib/db'\nimport { redirect } from 'next/navigation'\n\nexport async function createPost(formData: FormData) {\n  const title = formData.get('title') as string\n  if (!title) throw new Error('Title is required')\n  const post = await db.post.create({ data: { title } })\n  revalidatePath('/posts')\n  redirect(`/posts/${post.id}`)\n}\n\nexport async function deletePost(id: number) {\n  await db.post.delete({ where: { id } })\n  revalidatePath('/posts')\n}\n\n// Client から呼ぶ\n'use client'\nimport { deletePost } from '@/app/actions/post'\n\nfunction DeleteButton({ id }: { id: number }) {\n  return <button onClick={() => deletePost(id)}>Delete</button>\n}\n\n// 方法 2: 関数単位 (Server Component 内で使い切り)\nexport default function NewPost() {\n  async function create(formData: FormData) {\n    'use server'\n    await db.post.create({ data: { title: formData.get('title') as string } })\n  }\n  return (\n    <form action={create}>\n      <input name=\"title\" />\n      <button>Create</button>\n    </form>\n  )\n}",
            language: "tsx",
            notes: [
              "Server Action は内部で POST リクエスト → 専用エンドポイントが自動生成",
              "Client → Server に渡る引数もシリアライズ可能なものに限る (FormData / プリミティブなど)",
            ],
          },
          {
            heading: "4.2 form action と Progressive Enhancement",
            body: "`<form action={serverAction}>` に渡すと、JS が無効でもフォーム送信が動く (Progressive Enhancement)。サーバー側で FormData を受け取って処理 → revalidatePath / redirect。`<button formAction={otherAction}>` で 1 つの form に複数アクション。",
            code: "// app/posts/new/page.tsx (Server Component)\nimport { createPost } from '@/app/actions/post'\n\nexport default function NewPostPage() {\n  return (\n    <form action={createPost}>\n      <label>\n        Title\n        <input name=\"title\" required />\n      </label>\n      <label>\n        Body\n        <textarea name=\"body\" />\n      </label>\n      <button type=\"submit\">Create</button>\n    </form>\n  )\n}\n\n// 複数アクション (Save vs Publish)\nimport { savePost, publishPost } from '@/app/actions/post'\n\n<form action={savePost}>\n  <input name=\"title\" />\n  <button type=\"submit\">Save</button>\n  <button type=\"submit\" formAction={publishPost}>Publish</button>\n</form>\n\n// 引数を bind したい時\nimport { deletePost } from '@/app/actions/post'\nconst deleteWithId = deletePost.bind(null, post.id)\n<form action={deleteWithId}>\n  <button>Delete</button>\n</form>",
            language: "tsx",
            notes: [
              "form action は『JS 無効でも動く』が原則 — まず動くフォームを作って、useFormStatus などで UX を上乗せ",
            ],
          },
          {
            heading: "4.3 useFormStatus と useActionState",
            body: "**useFormStatus** (`react-dom`) は親 form の送信状態 (`{ pending }`) を取得する Client Hook。送信ボタンを disable するのに便利。**useActionState** (React 19、旧 useFormState) は Server Action の戻り値を state として保持し、エラー / バリデーション結果を表示する。",
            code: "// app/actions/post.ts\n'use server'\nexport type CreateState = { error?: string; success?: boolean }\n\nexport async function createPost(\n  prevState: CreateState,\n  formData: FormData\n): Promise<CreateState> {\n  const title = formData.get('title') as string\n  if (!title || title.length < 3) {\n    return { error: 'Title must be at least 3 chars' }\n  }\n  await db.post.create({ data: { title } })\n  revalidatePath('/posts')\n  return { success: true }\n}\n\n// app/posts/new/form.tsx (Client)\n'use client'\nimport { useActionState } from 'react'\nimport { useFormStatus } from 'react-dom'\nimport { createPost, type CreateState } from '@/app/actions/post'\n\nfunction SubmitButton() {\n  const { pending } = useFormStatus()\n  return (\n    <button type=\"submit\" disabled={pending}>\n      {pending ? 'Saving...' : 'Save'}\n    </button>\n  )\n}\n\nexport function NewPostForm() {\n  const [state, action] = useActionState<CreateState, FormData>(\n    createPost,\n    {}\n  )\n  return (\n    <form action={action}>\n      <input name=\"title\" />\n      {state.error && <p className=\"text-red-500\">{state.error}</p>}\n      {state.success && <p className=\"text-green-500\">Saved!</p>}\n      <SubmitButton />\n    </form>\n  )\n}",
            language: "tsx",
            notes: [
              "useFormStatus は form の中に置いた子コンポーネントでだけ動く (form の外では undefined)",
              "useActionState で『Server からの戻り値を保持』 → エラーやバリデーション結果を render",
            ],
          },
          {
            heading: "4.4 useOptimistic — 楽観的 UI",
            body: "Server Action の応答を待たずに UI を即座に更新する。失敗時は React が自動でロールバック。コメント投稿、いいね、Todo 追加・削除など『反応速度』が UX を左右する場面で効く。",
            code: "// app/comments/list.tsx (Client)\n'use client'\nimport { useOptimistic } from 'react'\nimport { addComment } from '@/app/actions/comment'\n\ntype Comment = { id: string; text: string; pending?: boolean }\n\nexport function CommentList({ comments }: { comments: Comment[] }) {\n  const [optimistic, addOptimistic] = useOptimistic<Comment[], string>(\n    comments,\n    (current, newText) => [\n      ...current,\n      { id: `temp-${Date.now()}`, text: newText, pending: true }\n    ]\n  )\n\n  async function action(formData: FormData) {\n    const text = formData.get('text') as string\n    addOptimistic(text)              // 即座に UI 反映\n    await addComment(text)            // Server 処理 (revalidate で実値に置換)\n  }\n\n  return (\n    <>\n      <ul>\n        {optimistic.map(c => (\n          <li key={c.id} style={{ opacity: c.pending ? 0.5 : 1 }}>\n            {c.text}\n          </li>\n        ))}\n      </ul>\n      <form action={action}>\n        <input name=\"text\" />\n        <button>Add</button>\n      </form>\n    </>\n  )\n}",
            language: "tsx",
            notes: [
              "useOptimistic は『楽観値を一時的に表示』 → revalidate 後に正の値で置き換わる",
              "Server Action が throw した場合、React が自動でロールバック",
            ],
          },
        ],
        keyTakeaways: [
          "Server Action は 'use server' で宣言、form action に渡せば JS 無しでも動く",
          "useFormStatus で送信中の disable、useActionState でエラー表示",
          "useOptimistic で『送信中も即時 UI 反映』、失敗時は自動ロールバック",
          "Server Action 後は revalidatePath / Tag でキャッシュ無効化が定番",
        ],
        comprehensionQuestionIds: ["next-004", "next-015", "next-018"],
      },
      {
        id: "routing-advanced",
        title: "5. Routing 応用 — Link / useRouter / Parallel / Intercepting",
        intro:
          "next/link によるクライアント遷移、useRouter / redirect でのプログラム的遷移、Parallel Routes と Intercepting Routes で複雑な UI を組む。",
        readingMinutes: 9,
        objectives: [
          "<Link> と <a> の違い、prefetch の挙動を説明できる",
          "useRouter / redirect / notFound でプログラム的遷移を扱える",
          "Parallel Routes (@slot) と Intercepting Routes ((.)) で複雑な UI を組める",
        ],
        sections: [
          {
            heading: "5.1 <Link> によるクライアント遷移と prefetch",
            body: "`next/link` の `<Link href=>` でクライアント遷移 (フルリロードしない SPA 風)。本番ビルドではビューポートに入ると自動で prefetch。生の `<a>` はフルリロードするので避ける。",
            code: "import Link from 'next/link'\n\n// 基本\n<Link href=\"/about\">About</Link>\n\n// 動的\n<Link href={`/users/${user.id}`}>{user.name}</Link>\n\n// prefetch 制御\n<Link href=\"/heavy\" prefetch={false}>Heavy page</Link>   // 完全 OFF\n<Link href=\"/foo\" prefetch={null}>Foo</Link>             // ホバー時のみ\n\n// クエリ・ハッシュ\n<Link href={{ pathname: '/search', query: { q: 'react' } }}>Search</Link>\n\n// 外部リンクは生 <a> (or 新タブ)\n<a href=\"https://example.com\" target=\"_blank\" rel=\"noreferrer\">External</a>",
            language: "tsx",
            notes: [
              "本番ビルドのみ prefetch が動く (開発では無効)",
              "Link を多用するページでは prefetch がコスト → 巨大リストでは {prefetch: false}",
            ],
          },
          {
            heading: "5.2 useRouter / redirect / notFound — プログラム的遷移",
            body: "**Client 側**は `useRouter()` の `push` / `replace` / `back` / `refresh` で遷移。**Server 側** (Server Component / Server Action) は `redirect()` / `notFound()` を throw する関数で遷移。Server Action 内で redirect を呼ぶのが定番。",
            code: "// Client: useRouter\n'use client'\nimport { useRouter } from 'next/navigation'\n\nfunction LoginButton() {\n  const router = useRouter()\n  return (\n    <button onClick={async () => {\n      await login()\n      router.push('/dashboard')      // 履歴に追加\n      // router.replace('/dashboard') // 履歴を置換\n      // router.back()                 // 戻る\n      // router.refresh()              // 現在ページの Server Component を再取得\n    }}>Login</button>\n  )\n}\n\n// Server: redirect / notFound\nimport { redirect, notFound } from 'next/navigation'\n\nexport default async function PostPage({ params }: PageProps) {\n  const { id } = await params\n  const post = await db.post.findUnique({ where: { id: Number(id) } })\n  if (!post) notFound()                  // not-found.tsx へ\n  if (!post.published) redirect('/posts')   // /posts へ遷移\n  return <Article post={post} />\n}\n\n// Server Action 内でも\n'use server'\nexport async function createPost(formData: FormData) {\n  const post = await db.post.create({ data: ... })\n  redirect(`/posts/${post.id}`)         // 完了後に遷移\n}",
            language: "tsx",
            notes: [
              "redirect は内部で throw — try/catch で囲むと意図せず捕捉してしまう",
              "router.refresh() は『現在の URL のままサーバーから再取得』 — Server Action 後の手動更新に便利",
            ],
          },
          {
            heading: "5.3 generateStaticParams と Streaming SSG",
            body: "動的ルートを SSG したい場合は `generateStaticParams` でビルド時のパラメータ集合を返す。返さなかったパスは初回アクセス時に動的レンダリング (dynamicParams のデフォルト動作)。",
            code: "// app/posts/[slug]/page.tsx\nexport async function generateStaticParams() {\n  const posts = await db.post.findMany({\n    where: { published: true },\n    select: { slug: true }\n  })\n  return posts.map(p => ({ slug: p.slug }))\n}\n\nexport default async function PostPage({\n  params\n}: { params: Promise<{ slug: string }> }) {\n  const { slug } = await params\n  const post = await db.post.findUnique({ where: { slug } })\n  if (!post) notFound()\n  return <Article post={post} />\n}\n\n// dynamicParams: false にすると、列挙してないパスは 404\nexport const dynamicParams = false\n\n// generateStaticParams を返さない + dynamic = 'force-static' で 100% SSG\nexport const dynamic = 'force-static'",
            language: "tsx",
          },
          {
            heading: "5.4 Parallel Routes (@slot) と Intercepting Routes",
            body: "**Parallel Routes**: `@folder` 名のディレクトリ (Slot) で同一 layout に複数 children を渡す → ダッシュボードの並列領域や、モーダル/フルページの切替に使う。**Intercepting Routes**: `(.)` `(..)` `(...)` プレフィックスで『リンク経由 = モーダル / 直接アクセス = フルページ』を実現できる (Instagram の写真モーダルのような UX)。",
            code: "// Parallel Routes\n// app/dashboard/\n//   layout.tsx              ← children + @team + @analytics を受ける\n//   page.tsx\n//   @team/page.tsx          → Slot team\n//   @team/default.tsx       → 他 route で表示する時のデフォルト\n//   @analytics/page.tsx     → Slot analytics\n\nexport default function Layout({\n  children,\n  team,\n  analytics,\n}: {\n  children: React.ReactNode\n  team: React.ReactNode\n  analytics: React.ReactNode\n}) {\n  return (\n    <div className=\"grid grid-cols-3 gap-4\">\n      <main className=\"col-span-3\">{children}</main>\n      <div>{team}</div>\n      <div className=\"col-span-2\">{analytics}</div>\n    </div>\n  )\n}\n\n// Intercepting Routes (リンク経由はモーダル、直接 URL はフルページ)\n// app/\n//   layout.tsx                            ← children + @modal を受ける\n//   @modal/\n//     default.tsx                          ← null (デフォルト)\n//     (.)photos/[id]/page.tsx              ← 同階層を intercept → モーダル\n//   photos/\n//     [id]/page.tsx                        ← フルページ\n//   feed/page.tsx                          ← <Link href={`/photos/${id}`}>\n\n// (.)  = 同階層を intercept\n// (..) = 1 つ上を intercept\n// (...) = ルートから intercept",
            language: "tsx",
            notes: [
              "Parallel Routes は各 Slot が独自の loading / error / not-found を持てる",
              "Intercepting Routes は URL が共有可能なまま、来訪方法で見せ方を変えられる",
            ],
          },
        ],
        keyTakeaways: [
          "<Link> でクライアント遷移 + 自動 prefetch、生 <a> は外部リンクや特殊用途のみ",
          "Server では redirect() / notFound() を throw、Client では useRouter().push()",
          "generateStaticParams で動的ルートを SSG、dynamicParams: false で 404 制御",
          "Parallel Routes (@slot) + Intercepting Routes ((.)) で『同一 URL でも UX を変える』",
        ],
        comprehensionQuestionIds: ["next-008", "next-014", "next-019"],
      },
      {
        id: "streaming-suspense-and-middleware",
        title: "6. Streaming / Suspense と Middleware — TTFB を縮め、入口で前処理",
        intro:
          "loading.tsx / error.tsx / 細粒度 Suspense で TTFB と体感速度を改善するストリーミング SSR と、Edge Runtime で動く middleware を整理。",
        readingMinutes: 9,
        objectives: [
          "loading.tsx と細粒度 Suspense でストリーミング SSR の挙動を理解できる",
          "error.tsx と global-error.tsx で Error Boundary を設定できる",
          "middleware.ts で認証 / リダイレクト / リライトを書ける",
        ],
        sections: [
          {
            heading: "6.1 loading.tsx と細粒度 Suspense",
            body: "`loading.tsx` を配置すると、そのセグメントの読み込み中に自動で表示される (Next.js が Suspense でラップ)。さらに細かく `<Suspense fallback={...}>` で囲めば、ページ内の特定のスローな部分だけを fallback にして他を先に配信する **Streaming SSR** ができる。",
            code: "// app/posts/loading.tsx — ページ全体の fallback\nexport default function Loading() {\n  return <div>Loading posts...</div>\n}\n\n// 細粒度 Streaming\n// app/dashboard/page.tsx\nimport { Suspense } from 'react'\n\nexport default function Dashboard() {\n  return (\n    <div>\n      <h1>Dashboard</h1>\n      <Suspense fallback={<UserStatsSkeleton />}>\n        <UserStats />\n      </Suspense>\n      <Suspense fallback={<ChartsSkeleton />}>\n        <Charts />\n      </Suspense>\n      <Suspense fallback={<ActivityFeedSkeleton />}>\n        <ActivityFeed />\n      </Suspense>\n    </div>\n  )\n}\n\n// 各非同期 Server Component が独立して解決 → 準備できた順に HTML が配信される\nasync function UserStats() {\n  const data = await slowQuery()    // 遅くても Charts は先に表示\n  return <div>...</div>\n}",
            language: "tsx",
            notes: [
              "Streaming SSR は HTTP/1.1 でも HTTP/2 でも動く (Transfer-Encoding: chunked)",
              "TTFB (Time To First Byte) と LCP の両方を改善できる",
            ],
          },
          {
            heading: "6.2 error.tsx と global-error.tsx",
            body: "`error.tsx` は Client Component 必須で、配下の Server / Client コンポーネントで発生した例外を捕捉。`reset` 関数で再試行できる。`global-error.tsx` はルート layout のエラーまで捕捉する最終フォールバック (html / body も自分で書く)。",
            code: "// app/posts/error.tsx ('use client' 必須)\n'use client'\nimport { useEffect } from 'react'\n\nexport default function Error({\n  error,\n  reset,\n}: {\n  error: Error & { digest?: string }\n  reset: () => void\n}) {\n  useEffect(() => {\n    Sentry.captureException(error)         // 監視に送る\n  }, [error])\n\n  return (\n    <div>\n      <h2>Something went wrong</h2>\n      <p>{error.message}</p>\n      <button onClick={reset}>Try again</button>\n    </div>\n  )\n}\n\n// app/global-error.tsx — ルート layout のエラーも捕捉\n'use client'\nexport default function GlobalError({ error, reset }: Props) {\n  return (\n    <html>\n      <body>\n        <h1>Fatal error</h1>\n        <button onClick={reset}>Reload</button>\n      </body>\n    </html>\n  )\n}\n\n// app/posts/not-found.tsx — notFound() で表示される\nexport default function NotFound() {\n  return <p>Post not found</p>\n}",
            language: "tsx",
            notes: [
              "error.tsx の error は本番では難読化される — error.digest を Sentry 等で照合",
              "イベントハンドラ内のエラーは捕捉しない (普通の try/catch で)",
            ],
          },
          {
            heading: "6.3 middleware.ts — 入口で全リクエストを前処理",
            body: "プロジェクトルートに置く `middleware.ts` は Edge Runtime (V8 isolate) で動き、すべての一致リクエストをハンドリングできる。認証チェック、リダイレクト、リライト、A/B テスト、i18n、ヘッダ追加に使う。`matcher` で対象 path を限定。Node 固有 API (fs / child_process) は使えない。",
            code: "// middleware.ts (プロジェクトルート、next.config.js と同階層)\nimport { NextResponse } from 'next/server'\nimport type { NextRequest } from 'next/server'\n\nexport function middleware(req: NextRequest) {\n  // 認証\n  const token = req.cookies.get('token')?.value\n  if (!token && req.nextUrl.pathname.startsWith('/admin')) {\n    const url = new URL('/login', req.url)\n    url.searchParams.set('from', req.nextUrl.pathname)\n    return NextResponse.redirect(url)\n  }\n\n  // リライト (URL は変えずに別の path を表示)\n  if (req.nextUrl.pathname === '/old-path') {\n    return NextResponse.rewrite(new URL('/new-path', req.url))\n  }\n\n  // ヘッダ追加\n  const res = NextResponse.next()\n  res.headers.set('X-Robots-Tag', 'noindex')\n  return res\n}\n\nexport const config = {\n  matcher: [\n    '/admin/:path*',\n    '/dashboard/:path*',\n    '/((?!api|_next/static|_next/image|favicon.ico).*)',\n  ],\n}",
            language: "tsx",
            notes: [
              "Edge Runtime は軽量 (V8 isolate) で立ち上がりが速い — 認証チェックに最適",
              "middleware の戻り値: NextResponse.next() (続行) / .redirect() / .rewrite() / .json()",
            ],
          },
        ],
        keyTakeaways: [
          "loading.tsx と細粒度 <Suspense> で Streaming SSR — TTFB / LCP 改善",
          "error.tsx (Client 必須) でツリー単位のエラー捕捉、reset で再試行",
          "middleware.ts は Edge Runtime で動き、認証 / リダイレクト / リライトの入口処理",
        ],
        comprehensionQuestionIds: ["next-011", "next-012", "next-016"],
      },
      {
        id: "production-deployment",
        title: "7. 本番運用 — Image / Metadata / 環境変数 / デプロイ",
        intro:
          "本番で効くパフォーマンス・SEO・デプロイの基本。next/image の最適化、metadata API、環境変数の Server/Client 切り分け、Vercel / 自前 Node のデプロイ。",
        readingMinutes: 10,
        objectives: [
          "next/image の最適化機能と必要 props を書ける",
          "metadata / generateMetadata で SEO 用 <head> を制御できる",
          "環境変数の Server 限定と NEXT_PUBLIC_ の差を理解できる、output: 'standalone' でコンテナデプロイ",
        ],
        references: [
          { label: "next/image (公式)", url: "https://nextjs.org/docs/app/api-reference/components/image" },
          { label: "Metadata (公式)", url: "https://nextjs.org/docs/app/api-reference/functions/generate-metadata" },
        ],
        sections: [
          {
            heading: "7.1 next/image — 画像最適化",
            body: "`import Image from 'next/image'`。自動で WebP/AVIF 変換、サイズに応じた srcSet、lazy loading、CLS 防止 (width/height 必須)。LCP 候補なら `priority`、ブラーアップは `placeholder='blur'`、レスポンシブは `sizes`。",
            code: "import Image from 'next/image'\nimport hero from '@/public/hero.jpg'   // 静的 import → width/height 自動推論 + blur 自動\n\n// 静的画像 (推奨)\n<Image\n  src={hero}\n  alt=\"Hero\"\n  placeholder=\"blur\"\n  priority                          // LCP 候補\n/>\n\n// リモート画像\n<Image\n  src=\"https://cdn.example.com/photo.jpg\"\n  alt=\"Product\"\n  width={800}\n  height={400}\n  sizes=\"(max-width: 768px) 100vw, 800px\"\n/>\n\n// fill (親要素のサイズに合わせる、親が relative 必須)\n<div style={{ position: 'relative', height: 300 }}>\n  <Image src={url} alt=\"\" fill sizes=\"100vw\" style={{ objectFit: 'cover' }} />\n</div>\n\n// next.config.js — リモートホスト許可\nmodule.exports = {\n  images: {\n    remotePatterns: [\n      { protocol: 'https', hostname: 'cdn.example.com' },\n      { protocol: 'https', hostname: '**.googleusercontent.com' },\n    ],\n  },\n}",
            language: "tsx",
            notes: [
              "width / height (or fill) 必須 — CLS (Cumulative Layout Shift) 防止のため",
              "Vercel ホスティングなら sharp ベースの最適化が自動、自前 Node は sharp install 推奨",
            ],
          },
          {
            heading: "7.2 metadata と generateMetadata — SEO の標準",
            body: "App Router では `export const metadata` (静的) と `export async function generateMetadata` (動的) で <head> を制御。title / description / OG / Twitter Card / canonical / robots / icon / viewport まで型安全に書ける。",
            code: "import type { Metadata } from 'next'\n\n// 静的\nexport const metadata: Metadata = {\n  title: { default: 'My Site', template: '%s | My Site' },\n  description: 'A great Next.js site',\n  openGraph: {\n    title: 'My Site',\n    description: 'A great Next.js site',\n    images: ['/og-default.png'],\n    type: 'website',\n  },\n  twitter: {\n    card: 'summary_large_image',\n    creator: '@example',\n  },\n  robots: { index: true, follow: true },\n  alternates: { canonical: 'https://example.com' },\n}\n\n// 動的 (記事ページなど)\nexport async function generateMetadata({\n  params\n}: { params: Promise<{ slug: string }> }): Promise<Metadata> {\n  const { slug } = await params\n  const post = await db.post.findUnique({ where: { slug } })\n  if (!post) return { title: 'Not Found' }\n  return {\n    title: post.title,                       // template により '<title> | My Site' になる\n    description: post.excerpt,\n    openGraph: {\n      title: post.title,\n      images: [post.coverUrl ?? '/og-default.png'],\n      type: 'article',\n      publishedTime: post.publishedAt.toISOString(),\n    },\n  }\n}\n\n// OG 画像を動的生成 (Edge)\n// app/og/route.tsx\nimport { ImageResponse } from 'next/og'\nexport async function GET() {\n  return new ImageResponse(\n    <div style={{ fontSize: 96, background: 'white', width: '100%', height: '100%' }}>\n      Hello OG!\n    </div>,\n    { width: 1200, height: 630 }\n  )\n}",
            language: "tsx",
            notes: [
              "title.template で全ページに統一サフィックス (`%s | My Site`) を付けられる",
              "robots.txt / sitemap.xml も app/robots.ts / app/sitemap.ts でファイル規約として生成可能",
            ],
          },
          {
            heading: "7.3 環境変数 — Server / Client の境界",
            body: "`.env.local` / `.env.production` 等に書く。**Server 限定**は普通の変数 (`process.env.PRIVATE_API_KEY`)、**Client にも公開**するなら `NEXT_PUBLIC_` プレフィックスが必須 (ビルド時にバンドルに埋め込まれる)。機密値は決して `NEXT_PUBLIC_` を付けない。",
            code: "# .env.local (gitignore 対象)\n# Server 専用 — Client バンドルに入らない\nDATABASE_URL=postgresql://...\nPRIVATE_API_KEY=sk_live_xxx\nNEXTAUTH_SECRET=xxx\n\n# Client にも公開 (ビルド時にバンドルに埋め込まれる)\nNEXT_PUBLIC_SITE_URL=https://example.com\nNEXT_PUBLIC_GA_ID=G-XXX\n\n# 使い方\n// Server Component / Route Handler / Server Action\nconst key = process.env.PRIVATE_API_KEY            // 'sk_live_xxx'\nconst db = await connect(process.env.DATABASE_URL!)\n\n// Client Component (NEXT_PUBLIC_ のみ)\n'use client'\nconst siteUrl = process.env.NEXT_PUBLIC_SITE_URL   // 'https://example.com'\n\n// 型補完を効かせる (env.d.ts)\ndeclare global {\n  namespace NodeJS {\n    interface ProcessEnv {\n      DATABASE_URL: string\n      PRIVATE_API_KEY: string\n      NEXT_PUBLIC_SITE_URL: string\n    }\n  }\n}\n\n// 起動時に env を zod でバリデーション (推奨)\nimport { z } from 'zod'\nexport const env = z.object({\n  DATABASE_URL: z.string().url(),\n  PRIVATE_API_KEY: z.string().min(1),\n  NEXT_PUBLIC_SITE_URL: z.string().url(),\n}).parse(process.env)",
            language: "tsx",
            notes: [
              "NEXT_PUBLIC_ はビルド時に文字列置換 — クライアントに見える前提で扱う",
              "env を zod で起動時バリデーションすると、本番投入前に設定ミスを検出できる",
            ],
          },
          {
            heading: "7.4 デプロイ — Vercel / Cloudflare / 自前 Node",
            body: "推奨は **Vercel** (Next.js 公式インフラ、ISR / Edge / Image Optimization フル対応)。**Cloudflare Pages** は Edge 強い、**Netlify** / **AWS Amplify** も可。**自前 Node** は `output: 'standalone'` で軽量サーバーを含む build を生成 → Docker 化が簡単。",
            code: "// next.config.js (自前 Node デプロイ向け)\nmodule.exports = {\n  output: 'standalone',          // .next/standalone に server.js が出力される\n  images: {\n    unoptimized: false,          // sharp が必要\n  },\n}\n\n// Dockerfile (Multi-stage)\nFROM node:22-alpine AS base\nWORKDIR /app\n\nFROM base AS deps\nCOPY package*.json ./\nRUN npm ci\n\nFROM base AS build\nCOPY --from=deps /app/node_modules ./node_modules\nCOPY . .\nRUN npm run build\n\nFROM base AS runner\nENV NODE_ENV=production\nCOPY --from=build /app/.next/standalone ./\nCOPY --from=build /app/.next/static ./.next/static\nCOPY --from=build /app/public ./public\nEXPOSE 3000\nCMD [\"node\", \"server.js\"]\n\n// Vercel\n// 1. GitHub に push\n// 2. https://vercel.com で import\n// 3. 環境変数を Vercel UI で設定\n// → 自動デプロイ + プレビュー URL\n\n// Cloudflare Pages (Edge Runtime 向け)\n// next.config.js で runtime: 'edge' を多用すると Cloudflare に最適\nexport const runtime = 'edge'   // route 毎に指定可",
            language: "Dockerfile",
            notes: [
              "Vercel が一番 Next.js の機能をフル活用できる (ISR / Image / Edge Functions / Analytics)",
              "Cloudflare は Edge Runtime に強み、Node 固有 API は使えないが起動が速い",
              "自前 Node は standalone build → Docker → ECS / GKE / Cloud Run などに",
            ],
          },
        ],
        keyTakeaways: [
          "next/image で WebP/AVIF 変換 + srcSet + lazy + CLS 防止 — width/height 必須",
          "metadata / generateMetadata で SEO 用 <head> を型安全に",
          "NEXT_PUBLIC_ は Client に漏れる — 機密値は付けない、zod で env バリデーション",
          "デプロイは Vercel が最速 / 自前 Node なら output: 'standalone' で軽量 Docker",
        ],
        comprehensionQuestionIds: ["next-013", "next-017", "next-020"],
      },
    ],
};
