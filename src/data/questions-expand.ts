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

// ===========================================================================
// Git & GitHub (git-github) — git-021〜038 / 参考書 git-intro の各章に対応
// ===========================================================================
const gitExpand: Question[] = [
  {
    id: "git-021",
    categoryId: "git-github",
    difficulty: "beginner",
    type: "choice",
    question:
      "`git add` でステージした変更だけを取り消し、作業ツリーの内容は保持するコマンドは?",
    choices: [
      "git checkout -- <file>",
      "git clean -f",
      "git revert HEAD",
      "git restore --staged <file> (旧: git reset HEAD <file>)",
    ],
    answerIndex: 3,
    hints: [
      "作業ツリーのファイル内容は消したくない。",
      "ステージ (index) から外すだけ。",
      "新しめの Git では restore --staged。",
    ],
    explanation: {
      summary:
        "git restore --staged <file> (または git reset HEAD <file>) でステージだけ解除し、作業ツリーの変更は残す。",
      reason:
        "git checkout -- / git restore <file> は作業ツリーの変更を破棄してしまう。git clean は未追跡ファイルの削除。混同するとせっかくの変更を失うので注意。",
    },
  },
  {
    id: "git-022",
    categoryId: "git-github",
    difficulty: "intermediate",
    type: "choice",
    question:
      "直前のコミットを取り消しつつ、その変更はステージに残したいときのコマンドは?",
    choices: [
      "git reset --hard HEAD~1",
      "git reset --soft HEAD~1",
      "git revert HEAD",
      "git commit --amend",
    ],
    answerIndex: 1,
    hints: [
      "--hard は変更まで消える (危険)。",
      "--soft はコミットだけ取り消し、変更はステージに戻る。",
      "やり直してコミットし直したいときに便利。",
    ],
    explanation: {
      summary:
        "git reset --soft HEAD~1 はコミットを取り消し、変更をステージ済みの状態に戻す。--mixed (既定) なら作業ツリーに、--hard なら変更ごと破棄。",
      reason:
        "revert は打ち消しコミットを新規追加する (履歴を残す)。amend は直前コミットを置き換える。push 済みのコミットを reset で書き換えると共有履歴が壊れるので、共有済みなら revert が安全。",
    },
  },
  {
    id: "git-023",
    categoryId: "git-github",
    difficulty: "intermediate",
    type: "choice",
    question:
      "すでに追跡済みのファイルを、.gitignore に書いた上で『追跡から外す (履歴やローカルのファイルは残す)』には?",
    choices: [
      "git rm --cached <file>",
      ".gitignore に書けば自動で外れる",
      "git untrack <file>",
      "git ignore <file>",
    ],
    answerIndex: 0,
    hints: [
      ".gitignore は『未追跡』ファイルにしか効かない。",
      "index から外すが、ディスク上のファイルは消さない。",
      "rm に --cached を付ける。",
    ],
    explanation: {
      summary:
        "git rm --cached <file> で index (追跡) から外す。ファイル自体は残るので、その後 .gitignore に追記してコミットすれば以後は無視される。",
      reason:
        ".gitignore は既に追跡中のファイルには効かない (よくある誤解)。誤って追跡してしまった .env などを外すときの定石。git untrack / git ignore というコマンドは存在しない。",
    },
  },
  {
    id: "git-024",
    categoryId: "git-github",
    difficulty: "intermediate",
    type: "choice",
    question: "git rebase の性質として正しいのは?",
    choices: [
      "必ずマージコミットを作る",
      "リモートブランチを削除する",
      "コミットを別の基点に付け替え、線形の履歴を作る (共有済みブランチでは避ける)",
      "履歴を完全に消去する",
    ],
    answerIndex: 2,
    hints: [
      "枝分かれを無くしてまっすぐな履歴に。",
      "コミットの親 (基点) を付け替える。",
      "公開済みを rebase すると他人の履歴とズレる。",
    ],
    explanation: {
      summary:
        "rebase はコミットを別の基点に載せ替えて線形な履歴を作る。merge と違いマージコミットを作らない。",
      reason:
        "履歴が読みやすくなる反面、コミットの ID が変わるため、push 済み (他人が pull 済み) のブランチを rebase すると齟齬が起きる。共有済みは merge、ローカル整理は rebase が原則。",
    },
  },
  {
    id: "git-025",
    categoryId: "git-github",
    difficulty: "intermediate",
    type: "choice",
    question: "fast-forward マージとは?",
    choices: [
      "コンフリクトを自動解決するマージ",
      "必ず新しいマージコミットを作るマージ",
      "履歴を書き換えるマージ",
      "分岐していないとき、ブランチポインタを前進させるだけのマージ (新コミットは作らない)",
    ],
    answerIndex: 3,
    hints: [
      "対象ブランチが現在地の直接の先にある場合。",
      "新しいコミットは生まれない。",
      "強制的にコミットを残したいなら --no-ff。",
    ],
    explanation: {
      summary:
        "マージ先が現在のブランチの直系の先にあるとき、ポインタを進めるだけで済むのが fast-forward。マージコミットは作られない。",
      reason:
        "分岐の事実を履歴に残したい場合は git merge --no-ff でマージコミットを強制できる。fast-forward 可能かどうかは枝分かれの有無で決まる。",
    },
  },
  {
    id: "git-026",
    categoryId: "git-github",
    difficulty: "intermediate",
    type: "choice",
    question: "git merge --no-ff の意味は?",
    choices: [
      "マージを禁止する",
      "fast-forward できる場合でもマージコミットを必ず作る",
      "コンフリクトを無視して強制マージする",
      "merge を rebase に変換する",
    ],
    answerIndex: 1,
    hints: [
      "ff = fast-forward。",
      "分岐の事実を履歴に残したいときに使う。",
      "feature ブランチの取り込みを 1 コミットで可視化できる。",
    ],
    explanation: {
      summary:
        "--no-ff は fast-forward 可能でもマージコミットを作り、『ここで feature を取り込んだ』という分岐の履歴を残す。",
      reason:
        "GitHub の『Create a merge commit』はこれに相当。レビュー単位を履歴に残せる。逆に履歴を直線に保ちたいチームは squash や rebase マージを選ぶ。",
    },
  },
  {
    id: "git-027",
    categoryId: "git-github",
    difficulty: "beginner",
    type: "choice",
    question: "git fetch と git pull の違いは?",
    choices: [
      "fetch は取得だけ、pull は取得 + 自動マージ (or rebase)",
      "まったく同じ",
      "pull は取得だけ、fetch がマージする",
      "fetch はローカルの変更を削除する",
    ],
    answerIndex: 0,
    hints: [
      "pull ≒ fetch + merge。",
      "fetch はローカルブランチを勝手に動かさない。",
      "まず fetch して差分を確認してから merge する人も多い。",
    ],
    explanation: {
      summary:
        "fetch はリモートの変更を取得するだけ (作業ブランチは動かない)。pull は fetch した上で現在のブランチへ merge (設定で rebase) する。",
      reason:
        "fetch してから git log や diff で内容を確認し、納得してから merge/rebase する方が安全。pull.rebase=true にすると pull が rebase ベースになる。",
    },
  },
  {
    id: "git-028",
    categoryId: "git-github",
    difficulty: "beginner",
    type: "choice",
    question:
      "新しいローカルブランチを初めてリモートへ push し、追跡 (上流) も設定するコマンドは?",
    choices: [
      "git push --all",
      "git remote add origin <branch>",
      "git push -u origin <branch>",
      "git track origin <branch>",
    ],
    answerIndex: 2,
    hints: [
      "-u は --set-upstream の短縮。",
      "以後は引数なしの git push / git pull で済む。",
      "remote add はリモート URL の登録 (別物)。",
    ],
    explanation: {
      summary:
        "git push -u origin <branch> でリモートへ push しつつ上流を設定。以降は git push / git pull を引数なしで使える。",
      reason:
        "git remote add はリモートリポジトリ自体の登録。git track というコマンドは無い。-u を付け忘れると毎回 origin/branch を指定する手間がかかる。",
    },
  },
  {
    id: "git-029",
    categoryId: "git-github",
    difficulty: "advanced",
    type: "choice",
    question:
      "rebase などで履歴を書き換えた後の push で、他人の更新を誤って上書きしない安全な強制 push は?",
    choices: [
      "git push --force (常に安全)",
      "強制 push に安全な方法は無い",
      "git push -f -f",
      "git push --force-with-lease",
    ],
    answerIndex: 3,
    hints: [
      "リモートが自分の想定と違っていたら拒否してほしい。",
      "--force は無条件上書きで危険。",
      "lease = 借用。想定どおりの時だけ上書き。",
    ],
    explanation: {
      summary:
        "git push --force-with-lease は、リモートが自分の知る状態と一致するときだけ上書きし、他人の新しい push があれば拒否する。",
      reason:
        "素の --force は他人のコミットを問答無用で消し得る。共有ブランチでの履歴書き換えは原則避け、やむを得ない場合も --force-with-lease を使う。main への force push は厳禁。",
    },
  },
  {
    id: "git-030",
    categoryId: "git-github",
    difficulty: "beginner",
    type: "choice",
    question: "作業中の変更を一時退避し、後で元に戻すコマンドは?",
    choices: [
      "git save / git load",
      "git stash で退避し、git stash pop で復帰",
      "git shelve / git unshelve",
      "git hide / git show",
    ],
    answerIndex: 1,
    hints: [
      "急ぎ別ブランチに切り替えたいが commit はしたくない時。",
      "退避は stash、取り出しは pop (or apply)。",
      "複数退避もスタックで管理できる。",
    ],
    explanation: {
      summary:
        "git stash で未コミットの変更を退避し、git stash pop で戻す。pop は取り出して削除、apply は残したまま適用。",
      reason:
        "git stash list で一覧、git stash -u で未追跡ファイルも含められる。コミットせずにブランチを切り替えたいときの定番。",
    },
  },
  {
    id: "git-031",
    categoryId: "git-github",
    difficulty: "advanced",
    type: "choice",
    question:
      "git reset --hard で誤って消したコミットを救い出すために使うのは?",
    choices: [
      "git reflog で過去の HEAD 位置を辿り、そのコミットへ戻す",
      "一度消したら復元は不可能",
      "git undo",
      "git fsck だけが唯一の手段",
    ],
    answerIndex: 0,
    hints: [
      "HEAD がどこを指してきたかの履歴が残っている。",
      "コミット自体は GC されるまで残る。",
      "そのハッシュへ git reset / git checkout で戻れる。",
    ],
    explanation: {
      summary:
        "git reflog は HEAD の移動履歴を記録しており、消したように見えるコミットのハッシュを見つけて git reset --hard <hash> 等で復元できる。",
      reason:
        "到達不能になったコミットも一定期間 GC されず残る。git undo というコマンドは無い。fsck でも辿れるが、まずは reflog が手軽。",
    },
  },
  {
    id: "git-032",
    categoryId: "git-github",
    difficulty: "intermediate",
    type: "choice",
    question:
      "すでに push 済み (共有済み) のコミットを、履歴を壊さず打ち消すには?",
    choices: [
      "git reset --hard で消す",
      "git rebase で消す",
      "git revert <commit> で打ち消しコミットを追加する",
      "git checkout で戻す",
    ],
    answerIndex: 2,
    hints: [
      "共有履歴は書き換えない。",
      "逆の変更を新しいコミットとして積む。",
      "他人の pull 済みでも齟齬が出ない。",
    ],
    explanation: {
      summary:
        "git revert は対象コミットの逆変更を新規コミットとして追加する。履歴を書き換えないため共有済みブランチでも安全。",
      reason:
        "reset / rebase は履歴そのものを変えるので、push 済みだと他人と齟齬が出る。公開済みのミスは revert で打ち消すのが原則。",
    },
  },
  {
    id: "git-033",
    categoryId: "git-github",
    difficulty: "advanced",
    type: "choice",
    question:
      "『ある時点では動いていたのに最近壊れた』バグの原因コミットを二分探索で特定するコマンドは?",
    choices: [
      "git blame だけで特定する",
      "git grep",
      "git log -p を全部読む",
      "git bisect (good/bad を指定して二分探索)",
    ],
    answerIndex: 3,
    hints: [
      "good なコミットと bad なコミットを起点にする。",
      "Git が中間を順に checkout してくれる。",
      "テストを自動化すれば run で全自動探索も可能。",
    ],
    explanation: {
      summary:
        "git bisect start → git bisect good <古い> / bad <新しい> で二分探索が始まり、各ステップで動作確認すると原因コミットを高速に特定できる。",
      reason:
        "git bisect run <テストコマンド> で自動化も可能。blame は行単位の最終変更者を見るもので、回帰の起点特定には bisect が向く。",
    },
  },
  {
    id: "git-034",
    categoryId: "git-github",
    difficulty: "intermediate",
    type: "choice",
    question: "別ブランチの特定の 1 コミットだけを現在のブランチに取り込むには?",
    choices: [
      "git merge <branch>",
      "git cherry-pick <commit>",
      "git apply しか方法が無い",
      "git rebase --onto だけ",
    ],
    answerIndex: 1,
    hints: [
      "ブランチ全体ではなく 1 コミットだけ。",
      "コミットハッシュを指定する。",
      "ホットフィックスを別ブランチへ展開する時など。",
    ],
    explanation: {
      summary:
        "git cherry-pick <commit> で指定コミットの変更を現在のブランチに複製適用する。",
      reason:
        "merge はブランチ全体を取り込む。cherry-pick は『この修正だけ別ブランチにも欲しい』ときに使う。コンフリクトしたら解決して git cherry-pick --continue。",
    },
  },
  {
    id: "git-035",
    categoryId: "git-github",
    difficulty: "advanced",
    type: "choice",
    question:
      "1 つのリポジトリで複数ブランチを別ディレクトリに同時チェックアウトして並行作業する機能は?",
    choices: [
      "git worktree add <path> <branch>",
      "リポジトリを clone し直すしかない",
      "git branch --parallel",
      "git checkout --multi",
    ],
    answerIndex: 0,
    hints: [
      "clone を増やさずに作業ツリーを追加する。",
      "レビュー用とコーディング用を同時に開ける。",
      "不要になったら git worktree remove。",
    ],
    explanation: {
      summary:
        "git worktree add <path> <branch> で、同一リポジトリの別ブランチを別ディレクトリに同時チェックアウトできる。",
      reason:
        ".git を共有しつつ作業ツリーだけ増やすので、clone を複製するより軽量。並行レビューや長時間ビルドの裏で別作業、などに便利。",
    },
  },
  {
    id: "git-036",
    categoryId: "git-github",
    difficulty: "intermediate",
    type: "choice",
    question:
      "GitHub CLI (gh) で、現在のブランチから main 向けに Pull Request を作るコマンドは?",
    choices: ["git pr", "gh request new", "gh pr create", "gh pull open"],
    answerIndex: 2,
    hints: [
      "gh が GitHub 公式 CLI。",
      "pr create でタイトル/本文を指定して作成。",
      "--fill で commit から自動補完も可能。",
    ],
    explanation: {
      summary:
        "gh pr create で PR を作成 (--title/--body、--fill で自動補完)。gh pr view / gh pr checkout などと組み合わせて CLI で完結できる。",
      reason:
        "git 本体に pr コマンドは無く、PR は GitHub の概念なので gh CLI (または Web) を使う。",
    },
  },
  {
    id: "git-037",
    categoryId: "git-github",
    difficulty: "intermediate",
    type: "choice",
    question:
      "『main への直接 push を禁止し、PR + CI 通過 + レビュー必須』を強制する GitHub の仕組みは?",
    choices: [
      ".gitignore に書く",
      "ローカルの git hooks だけで強制できる",
      "CODEOWNERS ファイルだけで自動的に強制される",
      "ブランチ保護ルール (Branch protection / Rulesets)",
    ],
    answerIndex: 3,
    hints: [
      "リポジトリ設定で対象ブランチに適用する。",
      "required status checks / required reviews を指定。",
      "ローカル hook はバイパス可能で強制力が弱い。",
    ],
    explanation: {
      summary:
        "ブランチ保護ルール (Rulesets / Branch protection) で、直接 push 禁止・必須チェック・必須レビュー数・linear history などをサーバー側で強制する。",
      reason:
        "ローカルの git hooks は各自がスキップでき強制力が弱い。CODEOWNERS は『誰のレビューが必要か』の指定で、強制自体は保護ルール側で行う。",
    },
  },
  {
    id: "git-038",
    categoryId: "git-github",
    difficulty: "beginner",
    type: "choice",
    question: "GitHub Actions のワークフロー定義ファイルの置き場所は?",
    choices: [
      "リポジトリ直下の ci.yml",
      ".github/workflows/ 配下の YAML ファイル",
      ".github/actions.yml",
      ".gitlab-ci.yml",
    ],
    answerIndex: 1,
    hints: [
      ".github ディレクトリの中。",
      "workflows フォルダに複数置ける。",
      "拡張子は .yml / .yaml。",
    ],
    explanation: {
      summary:
        ".github/workflows/ 配下に置いた .yml が GitHub Actions のワークフローとして認識される (1 ファイル = 1 ワークフロー、複数可)。",
      reason:
        "on: でトリガー (push / pull_request / schedule 等)、jobs: で実行内容を書く。.gitlab-ci.yml は GitLab 用で別物。",
    },
  },
];

// ===========================================================================
// Nuxt (nuxt-basics) — nuxt-021〜038 / 参考書 nuxt-intro の各章に対応
// ===========================================================================
const nuxtExpand: Question[] = [
  {
    id: "nuxt-021",
    categoryId: "nuxt-basics",
    difficulty: "beginner",
    type: "choice",
    question:
      "Nuxt 3 で components/ や composables/ に置いた要素の import は?",
    choices: [
      "使うたびに毎回 import が必要",
      "nuxt.config で 1 つずつ登録が必要",
      "自動インポートされ import 不要",
      "app.vue でのみ使える",
    ],
    answerIndex: 2,
    hints: [
      "Nuxt の規約ディレクトリは特別扱い。",
      "components / composables / utils などが対象。",
      "コード量が減る代わりに、どこ由来か分かりにくい面も。",
    ],
    explanation: {
      summary:
        "Nuxt は components / composables / utils などの規約ディレクトリを自動インポートする。明示 import なしで使える。",
      reason:
        "ボイラープレートが減る一方、出所が分かりにくくなるため、必要なら #imports から明示 import もできる。Vue の ref / computed なども自動インポート対象。",
    },
  },
  {
    id: "nuxt-022",
    categoryId: "nuxt-basics",
    difficulty: "beginner",
    type: "choice",
    question: "ファイルベースルーティングのためにページを置くディレクトリは?",
    choices: ["pages/", "routes/", "views/", "app/pages/ のみ"],
    answerIndex: 0,
    hints: [
      "ファイル名がそのまま URL になる。",
      "このディレクトリがあると app.vue に <NuxtPage/> が要る。",
      "[id].vue で動的ルート。",
    ],
    explanation: {
      summary:
        "pages/ にファイルを置くとファイル名がルートになる (pages/about.vue → /about)。pages/ を使うときは app.vue に <NuxtPage /> が必要。",
      reason:
        "ネストや動的セグメント ([id].vue)、index.vue などの規約がある。pages/ が無い場合は app.vue が単一ページとして動く。",
    },
  },
  {
    id: "nuxt-023",
    categoryId: "nuxt-basics",
    difficulty: "beginner",
    type: "choice",
    question:
      "Nuxt の設定 (モジュール / ランタイム設定 / SSR 切替など) を書くファイルは?",
    choices: [
      "vite.config.ts",
      "package.json の nuxt キー",
      ".nuxtrc のみ",
      "nuxt.config.ts",
    ],
    answerIndex: 3,
    hints: [
      "defineNuxtConfig({ ... }) を export する。",
      "modules / runtimeConfig / routeRules などを書く。",
      "Vite 設定もこの中の vite キーで拡張できる。",
    ],
    explanation: {
      summary:
        "nuxt.config.ts に defineNuxtConfig({...}) で設定を書く。modules・runtimeConfig・routeRules・ssr などを集約する。",
      reason:
        "Vite 設定は nuxt.config の vite キーで拡張する。秘密値は runtimeConfig (サーバー)、公開値は runtimeConfig.public に置く。",
    },
  },
  {
    id: "nuxt-024",
    categoryId: "nuxt-basics",
    difficulty: "beginner",
    type: "choice",
    question: "Vue の ref と reactive の違いとして正しいのは?",
    choices: [
      "まったく同じもの",
      "ref はあらゆる値を包み .value でアクセス、reactive はオブジェクト/配列向けでプロパティに直接アクセス",
      "reactive はプリミティブ専用",
      "ref は SSR で使えない",
    ],
    answerIndex: 1,
    hints: [
      "プリミティブも入れたいなら ref。",
      "ref は script では .value、テンプレートでは自動アンラップ。",
      "reactive はオブジェクトをそのままリアクティブに。",
    ],
    explanation: {
      summary:
        "ref(x) は任意の値を包み script では .value で読み書き (テンプレートでは自動アンラップ)。reactive({...}) はオブジェクト/配列をリアクティブにし、プロパティへ直接アクセスする。",
      reason:
        "プリミティブ単体は ref、複数フィールドのまとまりは reactive、が目安。reactive は分割代入するとリアクティブ性が切れる点に注意 (toRefs で回避)。",
    },
  },
  {
    id: "nuxt-025",
    categoryId: "nuxt-basics",
    difficulty: "beginner",
    type: "choice",
    question:
      "既存の状態から派生する値を、依存が変わったときだけ再計算してキャッシュするには?",
    choices: [
      "computed(() => ...) を使う",
      "watch で手動更新する",
      "methods に書く",
      "ref を毎回手で書き換える",
    ],
    answerIndex: 0,
    hints: [
      "派生値はキャッシュされ、依存変化時のみ再計算。",
      "テンプレートで関数呼び出しするより効率的。",
      "副作用が要るなら watch。",
    ],
    explanation: {
      summary:
        "computed は依存するリアクティブ値が変わったときだけ再計算し、結果をキャッシュする。派生値の定番。",
      reason:
        "watch は『変化に反応して副作用を起こす』もので役割が違う。テンプレートでメソッド呼び出しすると毎レンダリング実行されるが、computed はキャッシュが効く。",
    },
  },
  {
    id: "nuxt-026",
    categoryId: "nuxt-basics",
    difficulty: "beginner",
    type: "choice",
    question: "Vue の <script setup> の特徴は?",
    choices: [
      "Options API 専用の構文",
      "export default { ... } が必須",
      "トップレベルで宣言した変数・関数がそのままテンプレートで使え、定型コードが減る",
      "this 経由でしかデータにアクセスできない",
    ],
    answerIndex: 2,
    hints: [
      "Composition API の糖衣構文。",
      "return 文が要らない。",
      "defineProps / defineEmits をコンパイラマクロで使える。",
    ],
    explanation: {
      summary:
        "<script setup> はトップレベルの変数・関数・import がそのままテンプレートに公開され、return が不要。Composition API を簡潔に書ける。",
      reason:
        "defineProps / defineEmits / defineExpose などのコンパイラマクロが使える。Options API の this ベースとは異なるスタイル。",
    },
  },
  {
    id: "nuxt-027",
    categoryId: "nuxt-basics",
    difficulty: "intermediate",
    type: "choice",
    question: "動的ルート pages/users/[id].vue でパラメータ id を取得するには?",
    choices: [
      "this.$route.params.id",
      "props.id (自動で渡る)",
      "useParams().id",
      "const route = useRoute(); route.params.id",
    ],
    answerIndex: 3,
    hints: [
      "Composition API では useRoute() を使う。",
      "this は <script setup> では使わない。",
      "params にセグメント名で入っている。",
    ],
    explanation: {
      summary:
        "useRoute() で現在のルート情報を取得し、route.params.id でセグメントを読む。",
      reason:
        "definePageMeta({ validate }) でパラメータ検証もできる。useParams という Composable は Nuxt には無い (Next.js と混同しやすい)。",
    },
  },
  {
    id: "nuxt-028",
    categoryId: "nuxt-basics",
    difficulty: "beginner",
    type: "choice",
    question: "Nuxt でクライアントサイドの画面遷移を行うコンポーネントは?",
    choices: [
      "<RouterView>",
      "<NuxtLink to=\"/about\">",
      "<NuxtPage>",
      "<a href> しか使えない",
    ],
    answerIndex: 1,
    hints: [
      "プリフェッチやアクティブ判定も付く。",
      "<NuxtPage> はページの描画先 (別物)。",
      "外部リンクは通常の <a>。",
    ],
    explanation: {
      summary:
        "<NuxtLink to=\"...\"> でクライアントサイド遷移 (SPA ナビゲーション)。表示領域のリンクは自動プリフェッチされる。",
      reason:
        "<NuxtPage> はマッチしたページをレンダリングする場所で役割が違う。外部 URL には素の <a> を使う (NuxtLink も外部判定はする)。",
    },
  },
  {
    id: "nuxt-029",
    categoryId: "nuxt-basics",
    difficulty: "intermediate",
    type: "choice",
    question: "特定ページに使うレイアウト (layouts/custom.vue) を指定するには?",
    choices: [
      "definePageMeta({ layout: 'custom' })",
      "nuxt.config で全ページ固定するしかない",
      "app.vue に直接書く",
      "ページ単位の指定はできない",
    ],
    answerIndex: 0,
    hints: [
      "ページの <script setup> 内で宣言する。",
      "layouts/ 配下のファイル名を指定。",
      "layout: false でレイアウト無しにもできる。",
    ],
    explanation: {
      summary:
        "definePageMeta({ layout: 'custom' }) でそのページのレイアウトを指定する (layouts/custom.vue)。layouts/default.vue が既定。",
      reason:
        "definePageMeta ではほかに middleware / pageTransition / validate なども設定できる。動的に切り替えるなら setPageLayout() を使う。",
    },
  },
  {
    id: "nuxt-030",
    categoryId: "nuxt-basics",
    difficulty: "intermediate",
    type: "choice",
    question:
      "SSR でサーバー/クライアントの二重取得を避けつつ、setup でデータ取得する Composable は?",
    choices: [
      "onMounted で毎回 fetch する",
      "axios をトップレベルで直接呼ぶ",
      "useFetch / useAsyncData",
      "fetch をそのまま await する",
    ],
    answerIndex: 2,
    hints: [
      "サーバーで取得した結果をハイドレーションで受け渡す。",
      "キーで重複取得を排除する。",
      "pending / error / data を返す。",
    ],
    explanation: {
      summary:
        "useFetch / useAsyncData は SSR でサーバー側取得した結果をペイロードでクライアントへ渡し、二重取得を防ぐ。data / pending / error / refresh を返す。",
      reason:
        "素の fetch をトップレベルで使うとサーバーとクライアントの両方で走り得る。onMounted の fetch はクライアントのみで SSR の利点を失う。useFetch は $fetch + useAsyncData の薄いラッパ。",
    },
  },
  {
    id: "nuxt-031",
    categoryId: "nuxt-basics",
    difficulty: "intermediate",
    type: "choice",
    question:
      "ボタン押下などイベント内で『その場で 1 回だけ』API を叩くのに適すのは?",
    choices: [
      "useFetch を呼ぶ",
      "useAsyncData を呼ぶ",
      "useState を使う",
      "$fetch(url) を直接呼ぶ",
    ],
    answerIndex: 3,
    hints: [
      "useFetch / useAsyncData は setup での取得向け。",
      "命令的な呼び出しには軽量な API。",
      "ofetch ベースで JSON 自動パースなど便利。",
    ],
    explanation: {
      summary:
        "イベントハンドラ等の命令的な呼び出しには $fetch(url) を使う。useFetch / useAsyncData は setup 内のデータ取得 (SSR 連携) 向け。",
      reason:
        "イベント内で useFetch を呼ぶと SSR 連携やライフサイクルの前提が崩れる。$fetch は ofetch ベースでベース URL やヘッダーも扱いやすい。",
    },
  },
  {
    id: "nuxt-032",
    categoryId: "nuxt-basics",
    difficulty: "advanced",
    type: "choice",
    question: "useFetch で同じデータの重複取得を防ぐ仕組みは?",
    choices: [
      "重複排除の仕組みは無い",
      "key (URL などから自動生成、明示も可) でキャッシュ・重複排除する",
      "localStorage に必ず保存する",
      "watch で監視するだけ",
    ],
    answerIndex: 1,
    hints: [
      "同じキーの取得結果は共有される。",
      "ペイロードに格納してハイドレーション時に再利用。",
      "明示的に key を渡して衝突を制御できる。",
    ],
    explanation: {
      summary:
        "useFetch / useAsyncData は key (URL 等から自動生成、または明示) で結果をキャッシュし、同一キーの重複取得を防ぐ。",
      reason:
        "SSR で取得した data はペイロードに載りクライアントで再利用される。動的引数を含む取得は key を明示してキャッシュ衝突を避けるとよい。",
    },
  },
  {
    id: "nuxt-033",
    categoryId: "nuxt-basics",
    difficulty: "advanced",
    type: "choice",
    question:
      "SSR セーフにコンポーネント間で状態を共有する Nuxt 組み込み Composable は?",
    choices: [
      "useState('key', () => initial)",
      "モジュールスコープに置いた素の ref",
      "window.__state に入れる",
      "provide / inject だけが唯一の手段",
    ],
    answerIndex: 0,
    hints: [
      "サーバーではリクエストごとに状態を分離する必要がある。",
      "モジュールの ref はリクエスト間で漏れる危険。",
      "キー付きで初期化する。",
    ],
    explanation: {
      summary:
        "useState('key', () => initial) は SSR でリクエストごとに分離され、かつペイロードでクライアントへ引き継がれる共有状態を提供する。",
      reason:
        "サーバーでモジュールスコープの ref を共有状態に使うと、複数リクエスト間で状態が漏れる (クロスリクエスト汚染)。大規模なら Pinia を使う。",
    },
  },
  {
    id: "nuxt-034",
    categoryId: "nuxt-basics",
    difficulty: "beginner",
    type: "choice",
    question: "Vue / Nuxt で現在推奨される状態管理ライブラリは?",
    choices: ["Vuex 4 が唯一の選択肢", "Redux", "Pinia", "状態管理ライブラリは使えない"],
    answerIndex: 2,
    hints: [
      "Vuex の後継として公式が推奨。",
      "Composition API 親和・型推論が良い。",
      "Nuxt では自動インポート連携もある。",
    ],
    explanation: {
      summary:
        "Pinia が Vue 公式推奨の状態管理ライブラリ (Vuex の事実上の後継)。型推論とDevTools が良く、Nuxt とも統合される。",
      reason:
        "小規模なら useState で十分。Redux は React 圏のライブラリ。Vuex は今もメンテされるが新規は Pinia が推奨。",
    },
  },
  {
    id: "nuxt-035",
    categoryId: "nuxt-basics",
    difficulty: "advanced",
    type: "choice",
    question:
      "Nuxt 3 でルートごとに SSR / 静的化 / キャッシュ / リダイレクト等を宣言的に指定する設定は?",
    choices: [
      "指定はできない",
      "middleware でのみ可能",
      "vite.config で指定する",
      "nuxt.config の routeRules",
    ],
    answerIndex: 3,
    hints: [
      "Nitro のハイブリッドレンダリング機能。",
      "パターンごとに prerender / ssr / swr / redirect を指定。",
      "1 アプリ内で静的と動的を混在できる。",
    ],
    explanation: {
      summary:
        "nuxt.config の routeRules でパスパターンごとに prerender / ssr:false (SPA) / swr / cache / redirect / headers を宣言できる (ハイブリッドレンダリング)。",
      reason:
        "例: '/blog/**': { swr: 3600 }、'/admin/**': { ssr: false }。ページ単位でレンダリング戦略を最適化できるのが Nuxt 3 (Nitro) の強み。",
    },
  },
  {
    id: "nuxt-036",
    categoryId: "nuxt-basics",
    difficulty: "intermediate",
    type: "choice",
    question: "ビルド時に静的 HTML を生成 (プリレンダリング) する方法は?",
    choices: [
      "SSR を切ればよい",
      "routeRules の prerender: true (または nuxi generate)",
      "プリレンダリングは不可",
      "useFetch を消す",
    ],
    answerIndex: 1,
    hints: [
      "静的ホスティング向け。",
      "全体生成は nuxi generate。",
      "一部だけなら routeRules で指定。",
    ],
    explanation: {
      summary:
        "routeRules: { '/path': { prerender: true } } で該当ルートをビルド時に静的生成。サイト全体は nuxi generate (ssr:false の純 SPA とは別)。",
      reason:
        "Nitro が静的 HTML を出力し CDN 配信できる。動的部分は SSR/CSR と混在可能 (ハイブリッド)。SSR を切る (ssr:false) のは SPA 化であり静的生成とは意味が異なる。",
    },
  },
  {
    id: "nuxt-037",
    categoryId: "nuxt-basics",
    difficulty: "beginner",
    type: "choice",
    question: "ページのタイトルや meta タグ (OGP 等) を設定する Composable は?",
    choices: [
      "useHead / useSeoMeta",
      "document.title を直接書き換える",
      "<head> に手書きするしかない",
      "useMeta は廃止され代替が無い",
    ],
    answerIndex: 0,
    hints: [
      "SSR でも正しく <head> に反映される。",
      "SEO 向けには専用の Composable がある。",
      "title / meta / link などを宣言的に。",
    ],
    explanation: {
      summary:
        "useHead({ title, meta, link, ... }) や、SEO 向けに型が整理された useSeoMeta({ title, ogTitle, description, ... }) で head を設定する。",
      reason:
        "SSR でサーバー描画時に <head> へ反映されるため SEO/OGP に有効。document.title 直書きは SSR で効かない。Nuxt 2 の head オプションの後継。",
    },
  },
  {
    id: "nuxt-038",
    categoryId: "nuxt-basics",
    difficulty: "advanced",
    type: "choice",
    question:
      "Nuxt で致命的エラーを発生させ、エラーページ (error.vue) を表示するには?",
    choices: [
      "console.error する",
      "useState('error') にセットする",
      "throw new Error だけで必ず error.vue が出る",
      "createError({ statusCode, statusMessage }) を throw する (error.vue で表示)",
    ],
    answerIndex: 3,
    hints: [
      "ステータスコード付きのエラーを投げる。",
      "fatal: true でフルページのエラー画面に。",
      "プロジェクト直下の error.vue が描画される。",
    ],
    explanation: {
      summary:
        "createError({ statusCode, statusMessage, fatal: true }) を throw すると、ルートの error.vue がフルページのエラー画面として表示される (showError でも可)。",
      reason:
        "素の throw new Error は SSR でハンドリングされるが、ステータスコードや表示制御を持たせるなら createError を使う。error.vue は error プロップでエラー内容を受け取る。",
    },
  },
];

export const expandQuestions: Question[] = [
  ...nextjsExpand,
  ...gitExpand,
  ...nuxtExpand,
];
