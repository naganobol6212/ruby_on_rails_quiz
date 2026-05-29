import type { Question } from "@/lib/types";

/**
 * 各トラックのロードマップを「しっかり理解できる」ボリュームに拡充するための
 * 追加問題集。トラックごとにブロックで追記していく。
 * - 既存カテゴリの ID 連番の続きで採番 (例: next-021〜)
 * - 正解位置は分散させ、選択肢は番号参照しない (順序非依存)
 * - 参考書 (guide) の章に対応づけて出題
 */

// ===========================================================================
// Next.js (nextjs-basics) — next-021〜038 / 参考書 nextjs-intro の各章に対応
// ===========================================================================
const nextjsExpand: Question[] = [
  {
    id: "next-021",
    categoryId: "nextjs-basics",
    difficulty: "beginner",
    type: "choice",
    question:
      "App Router で URL に現れない『ルートグループ (整理用フォルダ)』を作る命名は？",
    choices: ["[folder]", "(folder)", "_folder", "@folder"],
    answerIndex: 1,
    hints: [
      "URL セグメントには影響させたくない。",
      "丸括弧で囲む。",
      "(marketing) などでレイアウトを分けつつ URL は据え置ける。",
    ],
    explanation: {
      summary:
        "(folder) = Route Group。URL パスに影響せず、レイアウトやファイルを整理・分割できる。",
      reason:
        "[folder] は動的セグメント、@folder は並行ルート (slot)、_folder は慣習的に private フォルダ扱い。(marketing) と (shop) で別レイアウトを当てつつ URL は据え置く、といった使い分けに使う。",
    },
  },
  {
    id: "next-022",
    categoryId: "nextjs-basics",
    difficulty: "beginner",
    type: "choice",
    question:
      "App Router で、あるセグメントの読み込み中 UI を自動表示する予約ファイル名は？",
    choices: ["spinner.tsx", "pending.tsx", "loading.tsx", "fallback.tsx"],
    answerIndex: 2,
    hints: [
      "予約ファイル名 (規約) で自動的に効く。",
      "内部的には Suspense の fallback として使われる。",
      "同階層の page.tsx の読み込み中に出る。",
    ],
    explanation: {
      summary:
        "loading.tsx を置くと、その階層の読み込み中に自動で表示される (Suspense の fallback として機能)。",
      reason:
        "他の予約ファイル: layout.tsx (共通レイアウト) / error.tsx (エラー境界) / not-found.tsx / template.tsx / route.ts (API)。loading.tsx はストリーミングと組み合わさり、データ取得中に即座に骨組みを見せられる。",
    },
  },
  {
    id: "next-023",
    categoryId: "nextjs-basics",
    difficulty: "intermediate",
    type: "choice",
    question:
      "app/blog/[slug]/page.tsx で URL の slug を受け取る正しい方法は？(Next.js 15+)",
    choices: [
      "props の params を await して params.slug (params は Promise)",
      "props.query.slug を同期で読む",
      "必ず useParams() フックを使う",
      "export const slug で宣言する",
    ],
    answerIndex: 0,
    hints: [
      "Next.js 15 で params / searchParams は非同期になった。",
      "Server Component なら page を async にして await できる。",
      "useParams は Client Component 用のフック。",
    ],
    explanation: {
      summary:
        "Next.js 15+ では params / searchParams が Promise。Server Component では `const { slug } = await params` で取り出す。",
      reason:
        "Client Component で読むなら useParams() / useSearchParams() を使う。query というプロパティ名は Pages Router 時代の名残で App Router には無い。",
      codeExample:
        "// app/blog/[slug]/page.tsx (Server Component)\nexport default async function Page({\n  params,\n}: {\n  params: Promise<{ slug: string }>;\n}) {\n  const { slug } = await params;\n  return <h1>{slug}</h1>;\n}",
    },
  },
  {
    id: "next-024",
    categoryId: "nextjs-basics",
    difficulty: "beginner",
    type: "choice",
    question: "Client Component を宣言する方法は?",
    choices: [
      "ファイル先頭に 'use client' を書く",
      "ファイル先頭に 'use browser' を書く",
      "export const client = true",
      "何も書かない (App Router はデフォルトで Client)",
    ],
    answerIndex: 0,
    hints: [
      "App Router はデフォルトが Server Component。",
      "文字列ディレクティブをファイル先頭に置く。",
      "そのファイルから import される子も client 側に入る。",
    ],
    explanation: {
      summary:
        "ファイル先頭の 'use client' で Client Component になる。App Router の既定は Server Component。",
      reason:
        "'use client' は境界の宣言で、そこから import されるモジュールはクライアントバンドルに含まれる。状態・イベント・ブラウザ API を使うコンポーネントに付ける。",
    },
  },
  {
    id: "next-025",
    categoryId: "nextjs-basics",
    difficulty: "intermediate",
    type: "choice",
    question: "Server Component で『できない』ことは?",
    choices: [
      "async/await で直接 DB / API にアクセスする",
      "サーバー専用の秘密の環境変数を読む",
      "useState / useEffect / onClick などの状態・イベント・ブラウザ API",
      "子として Client Component をレンダリングする",
    ],
    answerIndex: 2,
    hints: [
      "サーバーで実行されるので対話状態は持てない。",
      "クリックハンドラやフックは Client Component の領分。",
      "DB アクセスや秘密の env 読み取りはむしろ Server の得意分野。",
    ],
    explanation: {
      summary:
        "Server Component は useState/useEffect/イベントハンドラなどの対話的機能を持てない。それらは Client Component で行う。",
      reason:
        "Server Component はサーバーでだけ実行されるため、DB 直アクセスや秘密 env の読み取りが安全にでき、JS をクライアントへ送らない利点がある。対話が必要な部分だけ 'use client' に切り出すのが定石。",
    },
  },
  {
    id: "next-026",
    categoryId: "nextjs-basics",
    difficulty: "advanced",
    type: "choice",
    question:
      "Server Component から Client Component へ『通常の関数』を props で渡すとどうなる?",
    choices: [
      "自動的に Server Action に変換される",
      "シリアライズできずエラーになる ('use server' を付けた Server Action は例外)",
      "問題なくそのまま動く",
      "クライアント側で自動的に再定義される",
    ],
    answerIndex: 1,
    hints: [
      "Server → Client の props はシリアライズ可能な値だけ。",
      "関数・クラスインスタンス・Symbol などは渡せない。",
      "ただし 'use server' を付けた関数 (Server Action) は特別に渡せる。",
    ],
    explanation: {
      summary:
        "Server → Client の props はシリアライズ可能でなければならず、通常の関数は渡せない。例外は 'use server' を付けた Server Action。",
      reason:
        "境界をまたぐ props は JSON 的にシリアライズして送られるため、関数や Date 以外の複雑なオブジェクトは渡せない。イベントハンドラが必要なら、その部分を Client Component 側で定義する。",
    },
  },
  {
    id: "next-027",
    categoryId: "nextjs-basics",
    difficulty: "intermediate",
    type: "choice",
    question:
      "App Router の fetch で『毎リクエスト必ず最新化 (キャッシュしない)』を明示する指定は?",
    choices: [
      "fetch(url, { cache: 'force-cache' })",
      "fetch(url, { static: true })",
      "fetch(url, { cache: 'no-store' })",
      "fetch(url, { ttl: 0 })",
    ],
    answerIndex: 2,
    hints: [
      "Web 標準の fetch オプション cache を使う。",
      "force-cache は逆に積極キャッシュ。",
      "no-store = 保存しない。",
    ],
    explanation: {
      summary:
        "cache: 'no-store' でそのリクエストをキャッシュせず毎回取得する (動的レンダリングになる)。",
      reason:
        "Next.js 15 以降は fetch のデフォルトが非キャッシュ寄りに変わったが、意図を明示するなら no-store。逆に積極的にキャッシュしたいなら force-cache、一定間隔の再生成なら next.revalidate を使う。",
    },
  },
  {
    id: "next-028",
    categoryId: "nextjs-basics",
    difficulty: "intermediate",
    type: "choice",
    question:
      "『60 秒ごとに再生成 (ISR)』したいときの fetch オプションは?",
    choices: [
      "fetch(url, { next: { revalidate: 60 } })",
      "fetch(url, { ttl: 60 })",
      "fetch(url, { cache: 60 })",
      "fetch(url, { maxAge: 60 })",
    ],
    answerIndex: 0,
    hints: [
      "Next.js 拡張の next オプションを使う。",
      "revalidate に秒数を渡す。",
      "セグメント単位なら export const revalidate = 60 でも可。",
    ],
    explanation: {
      summary:
        "next: { revalidate: 60 } で 60 秒の Incremental Static Regeneration。古いキャッシュを返しつつ裏で再生成する。",
      reason:
        "ページ全体なら `export const revalidate = 60` をセグメントに置く方法もある。オンデマンドで無効化したいときは revalidatePath / revalidateTag を使う。",
    },
  },
  {
    id: "next-029",
    categoryId: "nextjs-basics",
    difficulty: "advanced",
    type: "choice",
    question:
      "特定タグの付いたキャッシュをオンデマンドで無効化する関数は?",
    choices: [
      "invalidate('posts')",
      "reloadCache('posts')",
      "revalidateTag('posts') (fetch 側で next: { tags: ['posts'] })",
      "purge('posts')",
    ],
    answerIndex: 2,
    hints: [
      "fetch に next: { tags: [...] } を付けておく。",
      "更新時に Server Action / Route Handler から呼ぶ。",
      "パス単位なら revalidatePath。",
    ],
    explanation: {
      summary:
        "fetch に next: { tags: ['posts'] } を付け、更新時に revalidateTag('posts') を呼ぶとそのタグのキャッシュだけ無効化できる。",
      reason:
        "パス単位の無効化は revalidatePath('/posts')。タグは複数ページにまたがるキャッシュをまとめて更新したいときに便利。いずれも Server Action や Route Handler から呼ぶ。",
    },
  },
  {
    id: "next-030",
    categoryId: "nextjs-basics",
    difficulty: "intermediate",
    type: "choice",
    question: "Server Action を定義するディレクティブは?",
    choices: ["'use mutation'", "'use server'", "'use action'", "'server only'"],
    answerIndex: 1,
    hints: [
      "サーバーで実行される関数であることを宣言する。",
      "'use client' と対になる文字列ディレクティブ。",
      "関数の先頭、またはファイル先頭に書く。",
    ],
    explanation: {
      summary:
        "'use server' を関数 (またはファイル) 先頭に書くと Server Action になり、フォームの action やイベントから安全にサーバー処理を呼べる。",
      reason:
        "Server Action はフォーム送信やボタンから直接呼べ、API ルートを別途作らずにミューテーションが書ける。'use server' は『これはサーバーで動く』の宣言で、'use client' (クライアント境界) とは役割が逆。",
    },
  },
  {
    id: "next-031",
    categoryId: "nextjs-basics",
    difficulty: "intermediate",
    type: "choice",
    question:
      "Server Action でデータを更新した後、一覧ページの表示を最新化する関数は?",
    choices: [
      "location.reload()",
      "setState で再描画する",
      "useEffect で再取得する",
      "revalidatePath('/posts') (または revalidateTag)",
    ],
    answerIndex: 3,
    hints: [
      "サーバー側のキャッシュを無効化する。",
      "クライアントの reload ではなくサーバーの再検証。",
      "パス指定かタグ指定で再生成させる。",
    ],
    explanation: {
      summary:
        "Server Action 内で revalidatePath('/posts') を呼ぶと、そのパスのキャッシュが無効化され次の表示で最新になる。",
      reason:
        "ミューテーション後の定石。タグ運用なら revalidateTag。クライアント側の location.reload() は全再読込で非効率。Server Action + 再検証で必要な部分だけ更新する。",
    },
  },
  {
    id: "next-032",
    categoryId: "nextjs-basics",
    difficulty: "advanced",
    type: "choice",
    question:
      "同一レイアウト内で複数の領域を独立にレンダリングする『並行ルート (Parallel Routes)』のフォルダ規約は?",
    choices: [
      "@slot 形式 (例: @team, @analytics)",
      "[slot] 形式",
      "(slot) 形式",
      "#slot 形式",
    ],
    answerIndex: 0,
    hints: [
      "スロットを表す記号で始める。",
      "layout で props として受け取る (props.team など)。",
      "ダッシュボードで複数パネルを同時に出すのに便利。",
    ],
    explanation: {
      summary:
        "@folder (例 @team) が並行ルートのスロット。layout がそれぞれを props として受け取り、同時に独立してレンダリング・ストリーミングできる。",
      reason:
        "[slot] は動的セグメント、(slot) はルートグループ。並行ルートは独立した loading / error も持て、ダッシュボードのような複数領域 UI に向く。",
    },
  },
  {
    id: "next-033",
    categoryId: "nextjs-basics",
    difficulty: "advanced",
    type: "choice",
    question:
      "別ルートを現在の画面に重ねて表示 (モーダル等) する『インターセプトルート』の規約は?",
    choices: [
      "!folder",
      "~folder",
      "(.)folder / (..)folder などの規約",
      "^folder",
    ],
    answerIndex: 2,
    hints: [
      "相対の括弧記法でレベルを表す。",
      "(.) は同階層、(..) は 1 つ上。",
      "並行ルート (@modal) と組み合わせるのが定番。",
    ],
    explanation: {
      summary:
        "(.)folder / (..)folder / (...)folder でルートをインターセプトし、ソフトナビ時は現在の UI に重ねて (モーダル等)、直接アクセス時はフルページで表示できる。",
      reason:
        "写真一覧→写真詳細をモーダルで開きつつ、URL 直打ち/リロードでは詳細ページを出す、といった体験に使う。並行ルート @modal と組み合わせるのが定番パターン。",
    },
  },
  {
    id: "next-034",
    categoryId: "nextjs-basics",
    difficulty: "intermediate",
    type: "choice",
    question:
      "ページの一部だけを後から流し込む『ストリーミング』を実現する React の仕組みは?",
    choices: [
      "useEffect で遅延ロードする",
      "<Suspense fallback={...}> で遅い部分を囲む",
      "dynamic import でしか不可能",
      "App Router ではストリーミングはできない",
    ],
    answerIndex: 1,
    hints: [
      "loading.tsx の中身もこれで実現されている。",
      "境界の中が準備でき次第、差し込まれる。",
      "速い部分を先に見せ、遅い部分を後追いで表示。",
    ],
    explanation: {
      summary:
        "<Suspense> で遅いデータ取得部分を囲むと、その外側を先に表示し、準備でき次第ストリーミングで差し込める。",
      reason:
        "loading.tsx はページ全体を Suspense で包む糖衣。細かく Suspense を置けば、速いコンテンツを即表示しつつ遅い部分だけ後から出せ、体感速度が上がる。",
    },
  },
  {
    id: "next-035",
    categoryId: "nextjs-basics",
    difficulty: "intermediate",
    type: "choice",
    question: "middleware.ts の用途として適切なのは?",
    choices: [
      "重い画像処理やバッチ実行",
      "React コンポーネントのレンダリング",
      "大量データの DB クエリ実行",
      "リクエスト前の認証チェック・リダイレクト・ヘッダー書き換え (Edge で軽量に)",
    ],
    answerIndex: 3,
    hints: [
      "全リクエストの前段で軽量に動く。",
      "Edge ランタイムで実行される前提。",
      "重い処理やレンダリングには向かない。",
    ],
    explanation: {
      summary:
        "middleware はリクエストがルートに届く前に走る軽量レイヤ。認証チェック、リダイレクト、ヘッダー/Cookie 書き換え、A/B 振り分けなどに使う。",
      reason:
        "Edge で動くため起動は速いが、重い計算や DB アクセス、レンダリングには不向き。matcher で対象パスを絞って使うのが定石。",
    },
  },
  {
    id: "next-036",
    categoryId: "nextjs-basics",
    difficulty: "beginner",
    type: "choice",
    question:
      "ブラウザ (クライアント) に公開してよい環境変数の接頭辞は?",
    choices: ["PUBLIC_", "EXPOSE_", "NEXT_PUBLIC_", "CLIENT_"],
    answerIndex: 2,
    hints: [
      "ビルド時に値が焼き込まれる。",
      "Next.js 固有の接頭辞。",
      "接頭辞が無い env はサーバー側のみ。",
    ],
    explanation: {
      summary:
        "NEXT_PUBLIC_ で始まる環境変数だけがクライアントバンドルに含まれる (ビルド時に静的に置換)。それ以外はサーバー専用。",
      reason:
        "秘密情報 (API キー等) には絶対に NEXT_PUBLIC_ を付けない。クライアントで必要な公開値 (公開 URL など) にのみ使う。ビルド時に焼き込まれるため、変更後は再ビルドが必要。",
    },
  },
  {
    id: "next-037",
    categoryId: "nextjs-basics",
    difficulty: "advanced",
    type: "choice",
    question:
      "あるルートを『常にリクエスト時にレンダリング (動的) 』へ強制するセグメント設定は?",
    choices: [
      "export const dynamic = 'force-dynamic'",
      "export const ssr = true",
      "export const static = false",
      "'use dynamic'",
    ],
    answerIndex: 0,
    hints: [
      "Route Segment Config の 1 つ。",
      "値は 'auto' | 'force-dynamic' | 'error' | 'force-static'。",
      "逆に静的固定は 'force-static'。",
    ],
    explanation: {
      summary:
        "export const dynamic = 'force-dynamic' でそのセグメントを常に動的レンダリングにする。",
      reason:
        "他に revalidate / fetchCache / runtime などの Route Segment Config がある。force-static は逆に静的固定。通常は 'auto' で、使った API (cookies/headers/no-store fetch) に応じて自動判定される。",
    },
  },
  {
    id: "next-038",
    categoryId: "nextjs-basics",
    difficulty: "beginner",
    type: "choice",
    question: "next/image の <Image> を使う主な利点は?",
    choices: [
      "SEO 専用で画面には表示されない",
      "サイズ最適化・遅延読み込み・レイアウトシフト (CLS) 抑制を自動で行う",
      "必ず WebP に変換され画質が落ちる",
      "Server Component でしか使えない",
    ],
    answerIndex: 1,
    hints: [
      "パフォーマンス最適化が主目的。",
      "width/height か fill で領域を確保し CLS を防ぐ。",
      "遅延読み込みや適切なサイズ配信が自動。",
    ],
    explanation: {
      summary:
        "<Image> は自動で画像を最適化 (適切なサイズ・フォーマット配信、遅延読み込み、CLS 抑制) する。",
      reason:
        "width/height (または fill) で領域を確保してレイアウトシフトを防ぎ、ビューポート外は遅延読み込み。外部ドメインの画像は next.config の images.remotePatterns で許可が必要。",
    },
  },
];

export const expandQuestions: Question[] = [...nextjsExpand];
