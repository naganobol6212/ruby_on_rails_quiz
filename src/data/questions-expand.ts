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

// ===========================================================================
// Linux & CLI (linux-cli) — cli-021〜038 / 参考書 linux-intro の各章に対応
// ===========================================================================
const linuxExpand: Question[] = [
  {
    id: "cli-021",
    categoryId: "linux-cli",
    difficulty: "beginner",
    type: "choice",
    question: "カレントディレクトリの絶対パスを表示するコマンドは?",
    choices: ["whereami", "pwd", "cwd", "path"],
    answerIndex: 1,
    hints: [
      "print working directory の略。",
      "今どこにいるかを確認する基本。",
      "シェルの $PWD にも入っている。",
    ],
    explanation: {
      summary: "pwd (print working directory) で現在地の絶対パスを表示する。",
      reason:
        "環境変数 $PWD でも同じ値が得られる。cd で移動、pwd で確認、が基本の往復。",
    },
  },
  {
    id: "cli-022",
    categoryId: "linux-cli",
    difficulty: "beginner",
    type: "choice",
    question: "1 つ上のディレクトリへ移動するコマンドは?",
    choices: ["cd ~", "cd -", "cd ..", "cd /"],
    answerIndex: 2,
    hints: [
      ".. は親ディレクトリを表す。",
      "~ はホーム、/ はルート。",
      "cd - は直前のディレクトリ。",
    ],
    explanation: {
      summary: "cd .. で親ディレクトリへ移動する。.. は『1 つ上』を表す相対パス。",
      reason:
        "cd ~ はホーム、cd / はルート、cd - は直前にいたディレクトリへ戻る。組み合わせて cd ../../foo のようにも書ける。",
    },
  },
  {
    id: "cli-023",
    categoryId: "linux-cli",
    difficulty: "beginner",
    type: "choice",
    question: "ファイルの中身を画面に出力する最も基本的なコマンドは?",
    choices: ["cat file", "open file", "read file", "show file"],
    answerIndex: 0,
    hints: [
      "concatenate の略。",
      "複数ファイルを連結もできる。",
      "長いファイルは less で見るのが快適。",
    ],
    explanation: {
      summary: "cat file でファイル内容を標準出力に表示する。複数指定で連結もできる。",
      reason:
        "長大なファイルは less file (スクロール可) や head / tail (先頭/末尾) が便利。cat の濫用 (cat file | grep) は grep file で済むことも多い。",
    },
  },
  {
    id: "cli-024",
    categoryId: "linux-cli",
    difficulty: "intermediate",
    type: "choice",
    question:
      "ファイル内で 'error' を含む行を抽出し、行番号も付けて表示するには?",
    choices: [
      "find error -n file",
      "sed 'error' file",
      "grep -n 'error' file",
      "awk 'error' file",
    ],
    answerIndex: 2,
    hints: [
      "grep が行抽出の基本。",
      "-n で行番号を付与。",
      "-i で大小無視、-r で再帰検索。",
    ],
    explanation: {
      summary:
        "grep -n 'error' file でマッチ行を行番号付きで抽出する。-i (大小無視) / -r (再帰) / -v (反転) もよく使う。",
      reason:
        "find はファイル検索、sed は変換・抽出、awk はフィールド処理が主用途。行のパターン抽出は grep が第一候補。",
    },
  },
  {
    id: "cli-025",
    categoryId: "linux-cli",
    difficulty: "intermediate",
    type: "choice",
    question:
      "テキストの各行で 'foo' を 'bar' に置換して出力する sed の書き方は?",
    choices: [
      "sed 's/foo/bar/g' file",
      "sed 'replace foo bar' file",
      "sed -e foo=bar file",
      "sed 'foo->bar' file",
    ],
    answerIndex: 0,
    hints: [
      "s/置換前/置換後/ が基本形。",
      "g で行内すべて (なければ各行最初の1つ)。",
      "-i で元ファイルを直接書き換え。",
    ],
    explanation: {
      summary:
        "sed 's/foo/bar/g' で各行の foo を bar に置換 (g は行内全置換)。-i を付けるとファイルを直接編集する。",
      reason:
        "区切り文字は変更可 (s|/path|/new|) でパス置換が楽になる。-i.bak でバックアップ付き編集。複雑な抽出は awk が向く。",
    },
  },
  {
    id: "cli-026",
    categoryId: "linux-cli",
    difficulty: "intermediate",
    type: "choice",
    question:
      "スペース区切りファイルの 2 列目だけを取り出すのに最も適すのは?",
    choices: [
      "grep 2 file",
      "sed 2 file",
      "cut -f2 file",
      "awk '{ print $2 }' file",
    ],
    answerIndex: 3,
    hints: [
      "$2 が 2 番目のフィールド。",
      "awk は空白区切りを既定で扱う。",
      "cut はデフォルトがタブ区切り (-d で変更)。",
    ],
    explanation: {
      summary:
        "awk '{ print $2 }' file で 2 列目を取り出す。awk は空白を既定の区切りとしてフィールド $1, $2... を扱う。",
      reason:
        "cut -f2 はデフォルトがタブ区切りなので、空白区切りには cut -d' ' -f2。条件や計算を伴うなら awk が柔軟。",
    },
  },
  {
    id: "cli-027",
    categoryId: "linux-cli",
    difficulty: "intermediate",
    type: "choice",
    question:
      "ログの行数をカウントして『多い順』に並べる定番パイプは? (例: アクセス元 IP 集計)",
    choices: [
      "sort file | wc -l",
      "sort file | uniq -c | sort -rn",
      "uniq file | grep -c",
      "cat file | head",
    ],
    answerIndex: 1,
    hints: [
      "uniq -c は連続する重複をカウント。",
      "uniq の前に sort で並べておく必要がある。",
      "sort -rn で数値の降順。",
    ],
    explanation: {
      summary:
        "sort file | uniq -c | sort -rn が頻度集計の定番。sort で揃え、uniq -c で件数、sort -rn で多い順。",
      reason:
        "uniq は『連続した』重複しか潰さないため前段の sort が必須。-r 降順、-n 数値ソート。上位だけなら末尾に | head。",
    },
  },
  {
    id: "cli-028",
    categoryId: "linux-cli",
    difficulty: "intermediate",
    type: "choice",
    question:
      "カレント以下から拡張子 .log のファイルを再帰的に探すコマンドは?",
    choices: [
      "find . -name '*.log'",
      "grep -r '*.log'",
      "ls -R *.log",
      "locate .log のみ",
    ],
    answerIndex: 0,
    hints: [
      "find <起点> -name <パターン>。",
      "パターンはクォートして展開を防ぐ。",
      "-type f でファイルのみ。",
    ],
    explanation: {
      summary:
        "find . -name '*.log' でカレント以下を再帰検索。パターンはクォートしてシェル展開を防ぐ。",
      reason:
        "-type f / -mtime -1 (1 日以内) / -size +10M など条件を重ねられる。grep は中身検索、ls -R は一覧表示で用途が違う。locate は事前 DB 依存。",
    },
  },
  {
    id: "cli-029",
    categoryId: "linux-cli",
    difficulty: "advanced",
    type: "choice",
    question:
      "find で見つけた多数のファイルをまとめて削除する、安全で効率的な書き方は?",
    choices: [
      "find . -name '*.tmp' | rm",
      "find . -name '*.tmp' -delete (または -print0 | xargs -0 rm)",
      "rm -rf $(find .)",
      "find . | grep tmp | delete",
    ],
    answerIndex: 1,
    hints: [
      "パイプで rm に直接渡すと空白入りファイル名で壊れる。",
      "-print0 と xargs -0 は NUL 区切りで安全。",
      "find 自体の -delete も使える。",
    ],
    explanation: {
      summary:
        "find . -name '*.tmp' -delete、または find ... -print0 | xargs -0 rm が安全。空白・改行を含むファイル名でも壊れない。",
      reason:
        "find | rm は rm が標準入力を引数にしないため動かない。$(find .) は空白で単語分割される危険。-print0 / xargs -0 の NUL 区切りが堅い。削除前に -print で確認を。",
    },
  },
  {
    id: "cli-030",
    categoryId: "linux-cli",
    difficulty: "intermediate",
    type: "choice",
    question: "コマンドの標準出力をファイルへ『追記』するリダイレクトは?",
    choices: ["cmd > file", "cmd >> file", "cmd | file", "cmd < file"],
    answerIndex: 1,
    hints: [
      "> は上書き、>> は追記。",
      "< は入力リダイレクト。",
      "標準エラーは 2> で分けられる。",
    ],
    explanation: {
      summary:
        ">> はファイル末尾へ追記、> は上書き (既存内容を消す)。< は標準入力をファイルから取る。",
      reason:
        "標準エラーは 2> file、両方まとめるなら > file 2>&1 (または &> file)。| はパイプで次コマンドへ繋ぐもので、ファイルには使わない。",
    },
  },
  {
    id: "cli-031",
    categoryId: "linux-cli",
    difficulty: "advanced",
    type: "choice",
    question: "標準出力と標準エラーの『両方』を同じファイルへ書くには?",
    choices: [
      "cmd > file 2>&1 (または cmd &> file)",
      "cmd > file 1>&2",
      "cmd 2> file > 2",
      "cmd >> 2 file",
    ],
    answerIndex: 0,
    hints: [
      "2>&1 は『stderr を stdout と同じ先へ』。",
      "順序が重要 (> file の後に 2>&1)。",
      "bash なら &> file が短縮形。",
    ],
    explanation: {
      summary:
        "cmd > file 2>&1 で stdout をファイルへ、続けて stderr も同じ先へ。bash では cmd &> file が短縮形。",
      reason:
        "2>&1 を > file より前に書くと、まだ file へ向いていない時点の stdout (=端末) に stderr が繋がり意図とズレる。順序が大事。",
    },
  },
  {
    id: "cli-032",
    categoryId: "linux-cli",
    difficulty: "intermediate",
    type: "choice",
    question:
      "コマンドの出力を『画面に表示しつつファイルにも保存』するには?",
    choices: [
      "cmd > file",
      "cmd | save file",
      "cmd | tee file",
      "cmd >> screen",
    ],
    answerIndex: 2,
    hints: [
      "T 字に分岐させるイメージ。",
      "標準出力にも流しつつファイルにも書く。",
      "追記は tee -a。",
    ],
    explanation: {
      summary:
        "cmd | tee file は出力を画面 (標準出力) に流しつつ file にも書き込む。追記は tee -a file。",
      reason:
        "sudo tee は『リダイレクトに sudo が効かない』問題の回避にも使う (echo x | sudo tee /etc/...)。> はファイルにだけ書き画面には出ない。",
    },
  },
  {
    id: "cli-033",
    categoryId: "linux-cli",
    difficulty: "beginner",
    type: "choice",
    question:
      "ファイルの権限を『所有者は読み書き実行、他は読み実行』(755) にするコマンドは?",
    choices: [
      "chmod 755 file",
      "chown 755 file",
      "chgrp 755 file",
      "umask 755 file",
    ],
    answerIndex: 0,
    hints: [
      "chmod は mode (権限) を変える。",
      "数字は r=4 w=2 x=1 の合計。",
      "所有者変更は chown。",
    ],
    explanation: {
      summary:
        "chmod 755 file で rwx r-x r-x。各桁は所有者/グループ/その他、値は r=4・w=2・x=1 の和。",
      reason:
        "chown は所有者、chgrp はグループの変更。umask は新規作成時のデフォルト権限のマスク。記号形式 chmod u+x file も使える。",
    },
  },
  {
    id: "cli-034",
    categoryId: "linux-cli",
    difficulty: "intermediate",
    type: "choice",
    question: "実行中プロセスを終了させるとき、まず送るべき『穏当な』シグナルは?",
    choices: [
      "kill -9 (SIGKILL) を最初に使う",
      "kill (SIGTERM, 既定) で終了を要求し、応じなければ -9",
      "kill -0 で強制終了",
      "kill -HUP が唯一の終了手段",
    ],
    answerIndex: 1,
    hints: [
      "既定の kill は SIGTERM (15)。",
      "SIGTERM はクリーンアップの余地を与える。",
      "SIGKILL (9) は捕捉不能の最終手段。",
    ],
    explanation: {
      summary:
        "まず kill <pid> (SIGTERM) で正常終了を促し、止まらなければ kill -9 <pid> (SIGKILL)。",
      reason:
        "SIGTERM はプロセスが後始末 (一時ファイル削除・接続クローズ) してから終われる。SIGKILL は捕捉・無視できず即殺するため、データ破損のリスクがあり最終手段。kill -0 は生存確認用 (終了しない)。",
    },
  },
  {
    id: "cli-035",
    categoryId: "linux-cli",
    difficulty: "intermediate",
    type: "choice",
    question:
      "リモートサーバへパスワードレスでログインするための公開鍵認証の鍵生成コマンドは?",
    choices: [
      "ssh-keygen -t ed25519",
      "ssh --generate-key",
      "openssl ssh-key",
      "ssh-add --new",
    ],
    answerIndex: 0,
    hints: [
      "鍵ペア (秘密鍵/公開鍵) を作る。",
      "ed25519 が現代の推奨アルゴリズム。",
      "公開鍵をサーバの authorized_keys に置く。",
    ],
    explanation: {
      summary:
        "ssh-keygen -t ed25519 で鍵ペアを生成し、公開鍵 (.pub) を ssh-copy-id でサーバの ~/.ssh/authorized_keys に登録するとパスワードレスログインできる。",
      reason:
        "秘密鍵は絶対に共有しない (パーミッション 600)。ssh-add は鍵をエージェントに登録するコマンド。アルゴリズムは ed25519 か rsa 4096 が推奨。",
    },
  },
  {
    id: "cli-036",
    categoryId: "linux-cli",
    difficulty: "intermediate",
    type: "choice",
    question: "現在 LISTEN 中のポートとプロセスを確認する現代的なコマンドは?",
    choices: [
      "ps -listen",
      "ss -tlnp",
      "ifconfig -ports",
      "route -n",
    ],
    answerIndex: 1,
    hints: [
      "ss は netstat の後継。",
      "t=TCP, l=LISTEN, n=数値, p=プロセス。",
      "lsof -i :PORT でも調べられる。",
    ],
    explanation: {
      summary:
        "ss -tlnp で LISTEN 中の TCP ポートとプロセスを表示する (netstat -tlnp の現代版)。",
      reason:
        "ss は iproute2 に含まれ netstat より高速。lsof -i :8080 で特定ポートを使うプロセスを特定するのも定番。ifconfig/route はインターフェースやルーティング表示。",
    },
  },
  {
    id: "cli-037",
    categoryId: "linux-cli",
    difficulty: "advanced",
    type: "choice",
    question: "堅牢なシェルスクリプトの冒頭に置く定番の安全策は?",
    choices: [
      "echo start を書くだけ",
      "set -euo pipefail",
      "trap だけを書く",
      "#!/bin/sh を消す",
    ],
    answerIndex: 1,
    hints: [
      "エラーで即停止、未定義変数で停止。",
      "パイプ途中の失敗も検知。",
      "事故を早期に止めるための定石。",
    ],
    explanation: {
      summary:
        "set -euo pipefail は、エラーで即終了 (-e)、未定義変数をエラー (-u)、パイプ途中の失敗も拾う (pipefail) という堅牢化の定番。",
      reason:
        "-e は途中失敗で暴走を防ぎ、-u はタイプミス変数を検出、pipefail は a | b で a が失敗しても b の成功で隠れるのを防ぐ。IFS 設定や trap によるクリーンアップと併用すると更に堅い。",
    },
  },
  {
    id: "cli-038",
    categoryId: "linux-cli",
    difficulty: "intermediate",
    type: "choice",
    question: "毎日決まった時刻にスクリプトを自動実行する仕組みは?",
    choices: [
      "シェルの alias",
      "cron (crontab -e で登録)",
      "ssh-agent",
      "history コマンド",
    ],
    answerIndex: 1,
    hints: [
      "crontab -e で編集する。",
      "分 時 日 月 曜日 の 5 フィールド。",
      "systemd timer という選択肢もある。",
    ],
    explanation: {
      summary:
        "cron で定期実行する。crontab -e に『分 時 日 月 曜日 コマンド』を書く (例: 0 3 * * * /path/job.sh で毎日 3 時)。",
      reason:
        "近年は systemd timer も有力 (ログ統合・依存制御)。cron は環境変数が乏しいので、スクリプト内で PATH 等を明示するとハマりにくい。",
    },
  },
];

// ===========================================================================
// セキュリティ (security) — sec-021〜038 / 参考書 infosec-intro の各章に対応
// ===========================================================================
const securityExpand: Question[] = [
  {
    id: "sec-021",
    categoryId: "security",
    difficulty: "beginner",
    type: "choice",
    question: "OWASP Top 10 とは何か?",
    choices: [
      "人気の Web フレームワーク 10 選",
      "暗号化アルゴリズムの規格",
      "ペネトレーションテスト用ツール",
      "Web アプリの代表的なセキュリティリスクをまとめたコミュニティ文書",
    ],
    answerIndex: 3,
    hints: [
      "OWASP は非営利のセキュリティコミュニティ。",
      "数年ごとに改訂されるリスクのランキング。",
      "アクセス制御不備・インジェクション等が並ぶ。",
    ],
    explanation: {
      summary:
        "OWASP Top 10 は Web アプリで頻出・影響大のセキュリティリスクをまとめた定番文書。設計・レビューのチェックリストとして使われる。",
      reason:
        "2021 年版では『アクセス制御の不備』が 1 位。LLM 向けの OWASP LLM Top 10 など派生もある。ツールでも規格でもなく『リスクの地図』。",
    },
  },
  {
    id: "sec-022",
    categoryId: "security",
    difficulty: "beginner",
    type: "choice",
    question: "セキュア設計の原則『最小権限 (least privilege)』とは?",
    choices: [
      "各主体に、業務に必要な最小限の権限だけを与える",
      "全員に管理者権限を与えて運用を楽にする",
      "認証を省略して速度を上げる",
      "ログを一切残さない",
    ],
    answerIndex: 0,
    hints: [
      "万一侵害されても被害範囲を限定するため。",
      "DB ユーザーも用途別に権限を分ける。",
      "『念のため広めに権限』は事故のもと。",
    ],
    explanation: {
      summary:
        "最小権限は、各ユーザー/プロセス/トークンに必要最小限の権限だけ与える原則。侵害時の被害 (横展開) を抑える。",
      reason:
        "DB は読み取り専用ユーザーとマイグレーション用を分ける、API トークンはスコープを絞る、など。多層防御 (defense in depth) と並ぶ基本原則。",
    },
  },
  {
    id: "sec-023",
    categoryId: "security",
    difficulty: "intermediate",
    type: "choice",
    question: "SQL インジェクションの最も確実な対策は?",
    choices: [
      "入力を全部 trim する",
      "DB のエラーメッセージを隠す",
      "プレースホルダ (パラメータ化クエリ / プリペアドステートメント) を使う",
      "テーブル名を秘密にする",
    ],
    answerIndex: 2,
    hints: [
      "SQL 文と値を分離するのが本質。",
      "文字列連結でクエリを組み立てない。",
      "エラー隠蔽は緩和にすぎない。",
    ],
    explanation: {
      summary:
        "値をプレースホルダで渡すパラメータ化クエリにすれば、入力が SQL 構文として解釈されず SQLi を根本的に防げる。",
      reason:
        "文字列連結 (\"... WHERE name='\" + input + \"'\") が温床。ORM でも生 SQL/文字列連結を使うと危険。エラー隠蔽・名前の秘匿は補助的でしかない。",
    },
  },
  {
    id: "sec-024",
    categoryId: "security",
    difficulty: "intermediate",
    type: "choice",
    question: "「ORM を使えば SQL インジェクションは絶対に起きない」は正しい?",
    choices: [
      "正しい。ORM は完全に安全",
      "誤り。生 SQL 片や文字列連結 (where(\"name = '#{x}'\") 等) を使えば依然起きる",
      "ORM はむしろ SQLi を増やす",
      "ORM は SQL を一切使わない",
    ],
    answerIndex: 1,
    hints: [
      "ORM の生 SQL / 文字列補間メソッドが抜け道。",
      "プレースホルダを使う API なら安全。",
      "『安全な道具を安全に使う』のが要点。",
    ],
    explanation: {
      summary:
        "ORM は通常パラメータ化してくれるが、生 SQL や文字列補間を使う API (例: 文字列連結の where) を使えば SQLi は起きる。",
      reason:
        "ActiveRecord の where(\"name = '#{params[:q]}'\") などが典型的な穴。ORM でもプレースホルダ (?, :key) を使うことが重要。",
    },
  },
  {
    id: "sec-025",
    categoryId: "security",
    difficulty: "intermediate",
    type: "choice",
    question: "XSS (クロスサイトスクリプティング) の基本対策は?",
    choices: [
      "通信を HTTPS にする",
      "パスワードを長くする",
      "CSRF トークンを付ける",
      "出力時にコンテキストに応じたエスケープ + 入力検証 + CSP",
    ],
    answerIndex: 3,
    hints: [
      "ユーザー入力を HTML/JS として実行させない。",
      "出力する場所 (HTML本文/属性/JS/URL) で必要なエスケープが違う。",
      "CSP は被害を緩和する多層防御。",
    ],
    explanation: {
      summary:
        "XSS は出力時のエスケープが中心対策。HTML 本文・属性・JS・URL の各コンテキストで適切にエスケープし、CSP で被害を緩和する。",
      reason:
        "多くのテンプレートエンジン (React/JSX 含む) は既定でエスケープする。HTTPS や CSRF トークンは XSS そのものの対策ではない (別の脅威向け)。",
    },
  },
  {
    id: "sec-026",
    categoryId: "security",
    difficulty: "intermediate",
    type: "choice",
    question:
      "React で dangerouslySetInnerHTML を使うときの注意は?",
    choices: [
      "信頼できない HTML を渡すと XSS になる。サニタイズ (DOMPurify 等) が必須",
      "React が自動でサニタイズするので安全",
      "SSR では無効化されるので問題ない",
      "XSS とは無関係",
    ],
    answerIndex: 0,
    hints: [
      "名前のとおり『危険』。",
      "React の自動エスケープを迂回する。",
      "外部由来の HTML はサニタイズしてから。",
    ],
    explanation: {
      summary:
        "dangerouslySetInnerHTML は React の自動エスケープを迂回するため、信頼できない HTML を入れると XSS になる。DOMPurify 等でサニタイズしてから渡す。",
      reason:
        "通常の {value} 埋め込みは自動エスケープされ安全。生 HTML を入れたい場面 (リッチテキスト等) はサニタイズ必須で、可能なら使用自体を避ける。",
    },
  },
  {
    id: "sec-027",
    categoryId: "security",
    difficulty: "advanced",
    type: "choice",
    question: "Content-Security-Policy (CSP) の主な役割は?",
    choices: [
      "通信を暗号化する",
      "パスワードをハッシュ化する",
      "読み込み可能なスクリプト等の出所を制限し、XSS の被害を緩和する",
      "SQL を検証する",
    ],
    answerIndex: 2,
    hints: [
      "ヘッダーで許可するリソースの出所を宣言。",
      "インラインスクリプトの実行を制限できる。",
      "XSS を『防ぐ』より『被害を抑える』多層防御。",
    ],
    explanation: {
      summary:
        "CSP は許可するスクリプト/スタイル/画像などの出所をヘッダーで制限し、XSS が混入しても任意スクリプト実行や外部送信を抑える緩和策。",
      reason:
        "script-src 'self' などで自サイト由来のみ許可、インライン実行は nonce/hash で制御。あくまで多層防御の一枚で、出力エスケープと併用する。",
    },
  },
  {
    id: "sec-028",
    categoryId: "security",
    difficulty: "intermediate",
    type: "choice",
    question: "CSRF (クロスサイトリクエストフォージェリ) 攻撃とは?",
    choices: [
      "DB に不正な SQL を注入する",
      "ログイン中ユーザーのブラウザから、本人の意図しないリクエストを正規サイトへ送らせる",
      "パスワードを総当たりする",
      "XSS の別名",
    ],
    answerIndex: 1,
    hints: [
      "被害者の Cookie (認証情報) が自動送信されることを悪用。",
      "罠サイトのフォームや img から正規サイトへ送らせる。",
      "『本人の権限で勝手に操作』される。",
    ],
    explanation: {
      summary:
        "CSRF は、ログイン中ユーザーのブラウザに自動付与される Cookie を悪用し、本人が意図しない操作 (送金・設定変更等) を正規サイトに実行させる攻撃。",
      reason:
        "ブラウザがクロスサイトでも Cookie を送る性質が前提。SQLi/XSS とは別の脅威。対策は CSRF トークンや SameSite Cookie。",
    },
  },
  {
    id: "sec-029",
    categoryId: "security",
    difficulty: "intermediate",
    type: "choice",
    question: "CSRF の代表的な対策の組み合わせは?",
    choices: [
      "出力エスケープを徹底する",
      "HTTPS にするだけ",
      "パスワードを暗号化する",
      "CSRF トークン (同期トークン) + Cookie の SameSite 属性",
    ],
    answerIndex: 3,
    hints: [
      "フォームに予測不能なトークンを埋め込む。",
      "SameSite=Lax/Strict でクロスサイト送信を抑制。",
      "出力エスケープは XSS 対策で別物。",
    ],
    explanation: {
      summary:
        "CSRF トークン (フォーム/ヘッダーに予測不能な値を入れ検証) と、Cookie の SameSite=Lax/Strict を併用するのが定番。",
      reason:
        "多くのフレームワークが CSRF トークンを標準提供。SameSite はクロスサイトの Cookie 送信を制限し多層防御になる。HTTPS だけでは防げない。",
    },
  },
  {
    id: "sec-030",
    categoryId: "security",
    difficulty: "intermediate",
    type: "choice",
    question: "セッション Cookie に付けるべき属性の組み合わせは?",
    choices: [
      "属性は何も付けない",
      "Secure だけ付ければ十分",
      "HttpOnly + Secure + SameSite",
      "Path 属性だけ",
    ],
    answerIndex: 2,
    hints: [
      "JS から読めなくする属性は?",
      "HTTPS でのみ送る属性は?",
      "クロスサイト送信を抑える属性は?",
    ],
    explanation: {
      summary:
        "HttpOnly (JS から参照不可=XSS でのトークン窃取を防ぐ) + Secure (HTTPS のみ送信) + SameSite (CSRF 緩和) を付ける。",
      reason:
        "HttpOnly により document.cookie で盗めなくなる。Secure で平文送信を防ぐ。SameSite=Lax が多くの場合の既定的に妥当。",
    },
  },
  {
    id: "sec-031",
    categoryId: "security",
    difficulty: "intermediate",
    type: "choice",
    question: "パスワードの安全な保存方法は?",
    choices: [
      "bcrypt / argon2 / scrypt などソルト付きの専用ハッシュで保存",
      "平文で保存する",
      "MD5 / SHA-1 でハッシュして保存",
      "可逆暗号で保存していつでも復号できるようにする",
    ],
    answerIndex: 0,
    hints: [
      "高速ハッシュ (MD5/SHA) は総当たりに弱い。",
      "ソルトでレインボーテーブルを無効化。",
      "意図的に遅い (計算コストの高い) ハッシュが良い。",
    ],
    explanation: {
      summary:
        "パスワードは bcrypt / argon2 / scrypt などの『意図的に遅い・ソルト付き』専用ハッシュで保存する。",
      reason:
        "MD5/SHA-1/SHA-256 は高速ゆえ総当たりに弱い。平文・可逆暗号は漏洩時に致命的。argon2 は現代の推奨。コストパラメータで強度を調整する。",
    },
  },
  {
    id: "sec-032",
    categoryId: "security",
    difficulty: "beginner",
    type: "choice",
    question: "認証 (Authentication) と認可 (Authorization) の違いは?",
    choices: [
      "まったく同じ意味",
      "認証=権限の付与、認可=本人確認",
      "認可が必ず認証より先に行われる",
      "認証=誰であるかを確認、認可=その人に何を許すかを判断",
    ],
    answerIndex: 3,
    hints: [
      "AuthN = 本人確認、AuthZ = 権限判定。",
      "ログインが認証、アクセス可否が認可。",
      "順序は認証 → 認可。",
    ],
    explanation: {
      summary:
        "認証 (AuthN) は『誰か』を確認すること、認可 (AuthZ) は『その人に何を許すか』を判断すること。順序は認証 → 認可。",
      reason:
        "ログインは認証、管理者ページにアクセスできるかの判定は認可。両者を混同すると、ログインだけ見て権限チェックを忘れる (アクセス制御不備) 事故につながる。",
    },
  },
  {
    id: "sec-033",
    categoryId: "security",
    difficulty: "advanced",
    type: "choice",
    question: "JWT をセッション代わりに使うときの注意として正しいのは?",
    choices: [
      "署名されているので payload に秘密情報を入れてよい",
      "署名検証が必須・失効 (無効化) が難しい・payload に秘密情報を入れない",
      "改ざんし放題なので使うべきでない",
      "有効期限は設定不要",
    ],
    answerIndex: 1,
    hints: [
      "JWT の payload は base64 で誰でも読める (暗号化ではない)。",
      "サーバー側で即時失効しにくい。",
      "alg=none や鍵取り違えに注意。",
    ],
    explanation: {
      summary:
        "JWT は署名で改ざん検知するが payload は誰でも読める (暗号化ではない)。署名検証必須、秘密情報は入れない、失効は短い有効期限 + リフレッシュやブラックリストで補う。",
      reason:
        "ステートレスゆえサーバー側で即時 revoke しにくいのが弱点。alg=none 受け入れや署名鍵の取り違えは典型的な脆弱性。短命アクセストークン + リフレッシュトークンが定番。",
    },
  },
  {
    id: "sec-034",
    categoryId: "security",
    difficulty: "intermediate",
    type: "choice",
    question:
      "アクセス制御不備の典型『IDOR』(安全でない直接オブジェクト参照) とは?",
    choices: [
      "パスワードが短いこと",
      "HTTPS を使っていないこと",
      "URL/パラメータの id を他人の値に変えると、他人のリソースが見えたり操作できてしまう",
      "Cookie が暗号化されていないこと",
    ],
    answerIndex: 2,
    hints: [
      "/orders/123 を /orders/124 に変えたら他人の注文が見える、など。",
      "『所有者チェック』の欠落が原因。",
      "推測されにくい ID だけでは対策にならない。",
    ],
    explanation: {
      summary:
        "IDOR は、リクエスト中の id 等を改変すると本来アクセスできない他人のリソースに到達できてしまう不備。サーバー側で『そのユーザーが対象を操作してよいか』の認可チェックが抜けているのが原因。",
      reason:
        "UUID 化 (推測困難化) は緩和にすぎず、根本対策は所有権/権限の検証。OWASP の『アクセス制御の不備』の代表例。",
    },
  },
  {
    id: "sec-035",
    categoryId: "security",
    difficulty: "beginner",
    type: "choice",
    question: "API キーや DB パスワードなど秘密情報の管理として適切なのは?",
    choices: [
      "ソースコードにハードコードする",
      "フロントエンドの JS に埋め込む",
      "Git リポジトリにコミットして共有する",
      "環境変数 / シークレットマネージャで管理し、リポジトリには入れない",
    ],
    answerIndex: 3,
    hints: [
      "クライアントに出る場所には絶対に置かない。",
      "リポジトリ履歴に残ると回収が難しい。",
      ".env はコミットせず .gitignore。",
    ],
    explanation: {
      summary:
        "秘密情報は環境変数やシークレットマネージャ (Vault / クラウドの Secrets) で管理し、リポジトリやクライアントバンドルに含めない。",
      reason:
        "一度コミットすると履歴から完全削除は困難で、漏洩時はキーのローテーションが必要。フロントの JS は誰でも読めるので秘密は置けない。",
    },
  },
  {
    id: "sec-036",
    categoryId: "security",
    difficulty: "beginner",
    type: "choice",
    question: "通信の暗号化 (TLS / HTTPS) が主に守るものは?",
    choices: [
      "盗聴・改ざん・なりすまし (中間者攻撃) からの保護",
      "SQL インジェクション",
      "XSS",
      "CSRF",
    ],
    answerIndex: 0,
    hints: [
      "通信経路上の脅威に対する対策。",
      "暗号化 + 完全性 + サーバー認証。",
      "アプリ内部の脆弱性 (SQLi/XSS) は別問題。",
    ],
    explanation: {
      summary:
        "TLS/HTTPS は通信を暗号化し、盗聴・改ざん・なりすまし (中間者攻撃) を防ぐ。サーバー証明書で接続先の正当性も検証する。",
      reason:
        "経路の保護であって、アプリ内部の SQLi/XSS/CSRF は別途対策が必要。HSTS で常時 HTTPS を強制するのも定石。",
    },
  },
  {
    id: "sec-037",
    categoryId: "security",
    difficulty: "intermediate",
    type: "choice",
    question:
      "ログインエンドポイントへの総当たり (ブルートフォース) 攻撃を緩和するのは?",
    choices: [
      "パスワードを平文で保存する",
      "CSRF トークンを付ける",
      "レート制限 + アカウントロック + CAPTCHA / 多要素認証 (MFA)",
      "HTTPS にするだけ",
    ],
    answerIndex: 2,
    hints: [
      "試行回数そのものを抑える。",
      "一定回数失敗でロック/遅延。",
      "MFA は突破難度を大きく上げる。",
    ],
    explanation: {
      summary:
        "レート制限・連続失敗でのロックや遅延・CAPTCHA・MFA を組み合わせて総当たりを緩和する。",
      reason:
        "クレデンシャルスタッフィング (漏洩パスワードの使い回し攻撃) には MFA が特に有効。CSRF トークンや HTTPS は総当たり自体は止めない。",
    },
  },
  {
    id: "sec-038",
    categoryId: "security",
    difficulty: "advanced",
    type: "choice",
    question:
      "npm などの依存ライブラリのサプライチェーンリスク対策として適切なのは?",
    choices: [
      "何も対策しない",
      "常に最新版を無条件で自動導入する",
      "ロックファイルを削除して毎回最新解決にする",
      "ロックファイルで固定 + 脆弱性監査 (npm audit 等) + 出所/メンテ状況の確認",
    ],
    answerIndex: 3,
    hints: [
      "lockfile で再現性のある依存を固定。",
      "既知脆弱性は監査ツールで検出。",
      "怪しい/放置されたパッケージは避ける。",
    ],
    explanation: {
      summary:
        "lockfile (package-lock.json 等) で依存を固定し、npm audit / Dependabot で脆弱性を監視、導入前に出所・メンテ状況・人気度を確認する。",
      reason:
        "無条件の最新追従は悪意ある更新 (依存の乗っ取り) を取り込むリスク。タイポスクワッティングや slopsquatting にも注意。lockfile 削除は再現性を失い危険。",
    },
  },
];

// ===========================================================================
// React (react-fundamentals) — react-031〜040 / 参考書 react-intro を補完
// ===========================================================================
const reactExpand: Question[] = [
  {
    id: "react-031",
    categoryId: "react-fundamentals",
    difficulty: "intermediate",
    type: "choice",
    question:
      "リストレンダリングで key に配列の index を使うのが問題になりやすいのはどんな場合?",
    choices: [
      "リストが並び替え・挿入・削除される場合 (状態や DOM が取り違えられる)",
      "リストが静的で順序も件数も不変の場合",
      "key を付けるとパフォーマンスが必ず落ちる",
      "React では key 自体が不要",
    ],
    answerIndex: 0,
    hints: [
      "key は要素の同一性を React に伝える。",
      "index は順序が変わると別要素を指す。",
      "安定した一意 ID を使うのが原則。",
    ],
    explanation: {
      summary:
        "並び替え・挿入・削除があるリストで index を key にすると、React が要素を取り違え、入力中の state や DOM がズレる。安定した一意 ID を使う。",
      reason:
        "順序・件数が完全に固定なら index でも実害は少ない。key は差分計算で『同じ要素か』を判断する identity なので、データ由来の安定 ID が理想。",
    },
  },
  {
    id: "react-032",
    categoryId: "react-fundamentals",
    difficulty: "intermediate",
    type: "choice",
    question:
      "前の状態に基づいて state を更新するとき推奨される書き方は?",
    choices: [
      "setCount(count + 1) を複数回呼ぶ",
      "setCount(c => c + 1) の関数型更新を使う",
      "count++ で直接書き換える",
      "useRef に入れて更新する",
    ],
    answerIndex: 1,
    hints: [
      "同一イベント内の複数更新はバッチされる。",
      "古い値を参照すると更新が取りこぼされる。",
      "関数型更新なら常に最新を受け取れる。",
    ],
    explanation: {
      summary:
        "setCount(c => c + 1) の関数型更新は、バッチされた更新でも常に最新の state を受け取るため安全。setCount(count+1) を連続で呼ぶと古い count を参照して取りこぼす。",
      reason:
        "React は同一イベント内の setState をまとめて処理する。直接 count++ は state を破壊し再レンダリングもされない。",
    },
  },
  {
    id: "react-033",
    categoryId: "react-fundamentals",
    difficulty: "intermediate",
    type: "choice",
    question: "state をイミュータブルに更新すべき理由は?",
    choices: [
      "メモリ節約のため",
      "TypeScript の制約だから",
      "React は参照の変化で再レンダリングを判断するため、直接書き換えると検知されない",
      "イミュータブルにする必要はない",
    ],
    answerIndex: 2,
    hints: [
      "オブジェクト/配列を直接 push/代入しない。",
      "新しい参照を作って渡す ([...arr], {...obj})。",
      "比較は基本的に参照 (Object.is) ベース。",
    ],
    explanation: {
      summary:
        "React は state の参照が変わったかで再レンダリングや memo の判定を行う。配列/オブジェクトを直接書き換えると参照が同じため変化が検知されない。新しい参照を作って更新する。",
      reason:
        "arr.push(x) ではなく setArr([...arr, x])、obj.k=v ではなく setObj({...obj, k:v})。Immer を使うと書き味を保ちつつイミュータブル更新できる。",
    },
  },
  {
    id: "react-034",
    categoryId: "react-fundamentals",
    difficulty: "advanced",
    type: "choice",
    question:
      "useEffect の依存配列を空 [] にした effect 内で state を参照すると古い値になることがある。これを何と呼ぶ?",
    choices: [
      "メモリリーク",
      "古いクロージャ (stale closure)",
      "ハイドレーションエラー",
      "無限ループ",
    ],
    answerIndex: 1,
    hints: [
      "effect は定義時の値を閉じ込める。",
      "依存に入れるか、ref で最新を読む。",
      "setInterval 内で state を読むときの定番の罠。",
    ],
    explanation: {
      summary:
        "依存配列に入れていない値を effect 内で参照すると、最初のレンダリング時点の値を掴み続ける『stale closure』になる。",
      reason:
        "対策は (1) 依存配列に入れる (2) 関数型更新 setX(x=>...) を使う (3) 最新値を useRef に同期して読む。setInterval のコールバックで count を読むケースが典型。",
    },
  },
  {
    id: "react-035",
    categoryId: "react-fundamentals",
    difficulty: "intermediate",
    type: "choice",
    question: "useMemo と useCallback の違いとして正しいのは?",
    choices: [
      "useMemo は『計算結果の値』を、useCallback は『関数そのもの』をメモ化する",
      "両者は完全に同じ",
      "useCallback は値を、useMemo は関数をメモ化する",
      "どちらも再レンダリングを止める",
    ],
    answerIndex: 0,
    hints: [
      "useCallback(fn, deps) ≒ useMemo(() => fn, deps)。",
      "依存が変わらない限り同じものを返す。",
      "再レンダリング自体は止めない (memo と併用)。",
    ],
    explanation: {
      summary:
        "useMemo は計算結果の値を、useCallback は関数の参照をメモ化する (useCallback(fn,deps) は useMemo(()=>fn,deps) と等価)。",
      reason:
        "目的は参照の安定化で、React.memo した子に安定した props を渡す・effect の依存を安定させる等に使う。これ自体は再レンダリングを止めない。過剰使用はかえって複雑化。",
    },
  },
  {
    id: "react-036",
    categoryId: "react-fundamentals",
    difficulty: "intermediate",
    type: "choice",
    question: "React.memo が再レンダリングを防げるのはどんなとき?",
    choices: [
      "常にすべての再レンダリングを防ぐ",
      "props が前回と (浅い比較で) 変わっていないとき",
      "state を持たないときだけ",
      "key を付けたときだけ",
    ],
    answerIndex: 1,
    hints: [
      "親の再レンダリングで子も再描画される既定動作を抑える。",
      "props の浅い比較で同じならスキップ。",
      "毎回新しいオブジェクト/関数を渡すと効かない。",
    ],
    explanation: {
      summary:
        "React.memo は props が浅い比較で前回と同じなら再レンダリングをスキップする。親が再描画されても props 不変なら子を描画し直さない。",
      reason:
        "props にインラインの {} や () => {} を渡すと毎回新参照になり memo が効かない (useMemo/useCallback で安定化が必要)。自前比較関数を第2引数で渡すことも可能。",
    },
  },
  {
    id: "react-037",
    categoryId: "react-fundamentals",
    difficulty: "intermediate",
    type: "choice",
    question: "いわゆる『prop drilling』を解消する手段として適切なのは?",
    choices: [
      "すべてグローバル変数にする",
      "Context API や状態管理ライブラリで必要な階層に直接届ける",
      "props を増やし続ける",
      "コンポーネントを 1 つに統合する",
    ],
    answerIndex: 1,
    hints: [
      "深い階層へ props を中継し続ける問題。",
      "Context は『多くの階層が参照する値』に向く。",
      "ただし Context の濫用は再レンダリング増の原因にも。",
    ],
    explanation: {
      summary:
        "prop drilling (props を多段中継する問題) は Context API や状態管理ライブラリ (Zustand/Jotai/Redux 等) で必要な場所へ直接渡して解消する。",
      reason:
        "Context はテーマ・認証ユーザー・ロケールなど『広く参照される値』向け。頻繁に変わる値を 1 つの大きな Context に入れると広範な再レンダリングを招くため分割や外部ストアを検討する。",
    },
  },
  {
    id: "react-038",
    categoryId: "react-fundamentals",
    difficulty: "advanced",
    type: "choice",
    question: "カスタムフック (useXxx) の主な目的は?",
    choices: [
      "CSS を共有するため",
      "状態を持つロジックを再利用可能な形に切り出すため",
      "コンポーネントを高速化する専用機能",
      "クラスコンポーネントを作るため",
    ],
    answerIndex: 1,
    hints: [
      "use で始まる関数で、内部で他のフックを呼べる。",
      "UI ではなくロジックの再利用。",
      "呼び出し側ごとに state は独立する。",
    ],
    explanation: {
      summary:
        "カスタムフックは useState/useEffect 等を内部で使う『状態付きロジック』を関数に切り出して再利用する仕組み (useFetch, useLocalStorage 等)。",
      reason:
        "命名は use で始める (フックのルール検出のため)。呼び出すコンポーネントごとに状態は独立。UI を共有するのはコンポーネント、ロジックを共有するのはカスタムフック。",
    },
  },
  {
    id: "react-039",
    categoryId: "react-fundamentals",
    difficulty: "intermediate",
    type: "choice",
    question: "制御コンポーネント (controlled component) とは?",
    choices: [
      "ref で DOM を直接操作する入力",
      "入力値を React の state で管理し、value と onChange で同期する入力",
      "defaultValue だけを設定する入力",
      "サーバーでのみ動く入力",
    ],
    answerIndex: 1,
    hints: [
      "value を state に束ねる。",
      "onChange で state を更新して反映。",
      "対する非制御は ref/defaultValue。",
    ],
    explanation: {
      summary:
        "制御コンポーネントは入力値を state が単一の真実として持ち、value={state} と onChange でフォームを同期する。バリデーションや整形を一元化しやすい。",
      reason:
        "非制御コンポーネントは defaultValue + ref で DOM 側に値を持たせ、必要時に読む。小さなフォームや非 React 連携では非制御も有効。",
    },
  },
  {
    id: "react-040",
    categoryId: "react-fundamentals",
    difficulty: "advanced",
    type: "choice",
    question: "React の Error Boundary が捕捉できないものは?",
    choices: [
      "子コンポーネントのレンダリング中の例外",
      "ライフサイクル中の例外",
      "イベントハンドラ内や非同期処理 (setTimeout/Promise) 内の例外",
      "コンストラクタ内の例外",
    ],
    answerIndex: 2,
    hints: [
      "Error Boundary はレンダリングツリーのエラー用。",
      "イベントハンドラは通常の try/catch。",
      "非同期の throw はレンダリング外。",
    ],
    explanation: {
      summary:
        "Error Boundary はレンダリング/ライフサイクル/コンストラクタ中のエラーを捕捉するが、イベントハンドラや setTimeout/Promise などの非同期エラーは捕捉しない (そこは try/catch で処理)。",
      reason:
        "Error Boundary はクラスの getDerivedStateFromError / componentDidCatch、または react-error-boundary で実装する。イベント/非同期は通常の例外処理が必要。",
    },
  },
];

// ===========================================================================
// Python (python-basics) — py-031〜040 / 参考書 python-intro を補完
// ===========================================================================
const pythonExpand: Question[] = [
  {
    id: "py-031",
    categoryId: "python-basics",
    difficulty: "advanced",
    type: "choice",
    question:
      "def f(x, items=[]): items.append(x); return items を f(1) → f(2) と呼ぶと?",
    choices: [
      "[1] の次に [1, 2] になる (デフォルト引数のリストが共有される罠)",
      "[1] の次に [2] になる",
      "毎回 [] から始まり [1] と [2]",
      "TypeError になる",
    ],
    answerIndex: 0,
    hints: [
      "デフォルト値は関数定義時に 1 度だけ評価される。",
      "可変オブジェクトをデフォルトにすると共有される。",
      "対策は None を既定にして関数内で生成。",
    ],
    explanation: {
      summary:
        "デフォルト引数は定義時に一度だけ生成され、可変オブジェクト (list/dict) だと呼び出し間で共有される。f(1)→[1]、f(2)→[1,2] になる。",
      reason:
        "対策は def f(x, items=None): if items is None: items = []。Python の有名な落とし穴。",
    },
  },
  {
    id: "py-032",
    categoryId: "python-basics",
    difficulty: "intermediate",
    type: "choice",
    question: "Python の is と == の違いは?",
    choices: [
      "まったく同じ",
      "is は値の比較、== は型の比較",
      "== は予約語ではない",
      "== は値の等価性、is は同一オブジェクト (id) かの比較",
    ],
    answerIndex: 3,
    hints: [
      "None の判定は is None が定石。",
      "== は __eq__ を呼ぶ。",
      "小さな int の is は実装依存でハマる。",
    ],
    explanation: {
      summary:
        "== は値の等価性 (__eq__)、is は同一オブジェクトか (id が同じか) を比較する。None / True / False の判定は is を使う。",
      reason:
        "a == b は中身が等しいか、a is b は同じ実体か。小さな整数や短い文字列はインターン (キャッシュ) され is が True になることがあり、値比較に is を使うとハマる。",
    },
  },
  {
    id: "py-033",
    categoryId: "python-basics",
    difficulty: "intermediate",
    type: "choice",
    question:
      "0〜9 のうち偶数だけ 2 乗したリストを作る、最も Python らしい書き方は?",
    choices: [
      "for ループで append する",
      "map と filter を必ず使う",
      "[n**2 for n in range(10) if n % 2 == 0] (リスト内包表記)",
      "while で添字を回す",
    ],
    answerIndex: 2,
    hints: [
      "[式 for x in 反復 if 条件]。",
      "読みやすく高速。",
      "巨大データはジェネレータ式 (...) も検討。",
    ],
    explanation: {
      summary:
        "リスト内包表記 [n**2 for n in range(10) if n % 2 == 0] が簡潔で速い。条件は if、変換は先頭の式。",
      reason:
        "メモリを抑えたい大規模データはジェネレータ式 (n**2 for ...) や辞書/集合内包表記も使える。多重ネストや複雑な内包は可読性が落ちるので通常ループに戻す判断も大事。",
    },
  },
  {
    id: "py-034",
    categoryId: "python-basics",
    difficulty: "intermediate",
    type: "choice",
    question: "def f(*args, **kwargs) の *args と **kwargs は何を受け取る?",
    choices: [
      "args はポインタ、kwargs は参照",
      "args は可変長の位置引数 (tuple)、kwargs は可変長のキーワード引数 (dict)",
      "両方とも list",
      "args が辞書、kwargs がタプル",
    ],
    answerIndex: 1,
    hints: [
      "* は位置引数をまとめる。",
      "** はキーワード引数をまとめる。",
      "呼び出し側で f(*list, **dict) と展開もできる。",
    ],
    explanation: {
      summary:
        "*args は余った位置引数をタプルで、**kwargs は余ったキーワード引数を辞書で受け取る。呼び出し側では f(*seq, **mapping) で展開できる。",
      reason:
        "ラッパー関数やデコレータで引数をそのまま委譲するのに多用する。順序は (位置, *args, キーワード専用, **kwargs)。",
    },
  },
  {
    id: "py-035",
    categoryId: "python-basics",
    difficulty: "intermediate",
    type: "choice",
    question: "ファイルを開いて確実に閉じる Python らしい書き方は?",
    choices: [
      "f = open(path); ... ; f.close() を必ず手で書く",
      "open しっぱなしで GC に任せる",
      "try/finally でしか書けない",
      "with open(path) as f: のコンテキストマネージャを使う",
    ],
    answerIndex: 3,
    hints: [
      "ブロックを抜けると自動で close。",
      "例外が起きてもクリーンアップされる。",
      "__enter__ / __exit__ を実装したオブジェクトで自作も可。",
    ],
    explanation: {
      summary:
        "with open(path) as f: はブロック終了時 (例外時も) に自動で close する。リソース管理の定石。",
      reason:
        "コンテキストマネージャは __enter__/__exit__ を持つオブジェクト。contextlib.contextmanager で関数からも作れる。複数同時に with a, b: と書ける。",
    },
  },
  {
    id: "py-036",
    categoryId: "python-basics",
    difficulty: "advanced",
    type: "choice",
    question: "yield を使ったジェネレータがリストと異なる主な利点は?",
    choices: [
      "必ず高速になる",
      "値を一度に全部メモリに展開せず、必要な分だけ遅延生成する",
      "並列実行される",
      "型チェックが効く",
    ],
    answerIndex: 1,
    hints: [
      "巨大/無限のシーケンスを扱える。",
      "一度に 1 要素ずつ生成。",
      "再走査はできない (使い切り)。",
    ],
    explanation: {
      summary:
        "ジェネレータは要素を遅延 (lazy) に 1 つずつ生成するため、巨大・無限のデータでもメモリを抑えられる。",
      reason:
        "list は全要素を即メモリに保持。ジェネレータは next() のたびに yield まで進む。ただし一度きりで再利用不可、len() も取れない点に注意。",
    },
  },
  {
    id: "py-037",
    categoryId: "python-basics",
    difficulty: "advanced",
    type: "choice",
    question: "@decorator (デコレータ) の本質的な仕組みは?",
    choices: [
      "関数名を変更する構文",
      "コメントの一種",
      "型注釈の別名",
      "関数を受け取り、ラップした新しい関数を返す高階関数を、@ で適用する糖衣構文",
    ],
    answerIndex: 3,
    hints: [
      "@deco は func = deco(func) と等価。",
      "前後処理 (ログ/計測/キャッシュ) を差し込める。",
      "functools.wraps でメタ情報を保つ。",
    ],
    explanation: {
      summary:
        "@deco は func = deco(func) の糖衣。デコレータは関数を受け取り、処理を包んだ関数を返す高階関数。",
      reason:
        "ログ・計測・キャッシュ (functools.lru_cache)・認可などの横断的関心を差し込める。元関数の名前/docstring を保つため内側に @functools.wraps(func) を付けるのが定石。",
    },
  },
  {
    id: "py-038",
    categoryId: "python-basics",
    difficulty: "advanced",
    type: "choice",
    question:
      "CPython の GIL の影響として正しいのは?",
    choices: [
      "GIL があると Python は一切並行処理できない",
      "CPU バウンドな処理はスレッドでは並列化しにくく、multiprocessing 等が有効",
      "I/O バウンドも並行化できない",
      "GIL は全実装に必須の言語仕様",
    ],
    answerIndex: 1,
    hints: [
      "GIL は同時に 1 スレッドしか Python バイトコードを実行させない。",
      "I/O 待ちでは解放されるのでスレッドも有効。",
      "CPU バウンドはプロセス分割が定石。",
    ],
    explanation: {
      summary:
        "GIL により CPU バウンドな処理はマルチスレッドで並列化しにくい。プロセスを分ける multiprocessing や C 拡張、(3.13+ の) free-threaded ビルドで回避する。I/O バウンドはスレッドや asyncio が有効。",
      reason:
        "GIL は CPython の実装上の仕組み (言語仕様ではない)。I/O 待ちや多くの C 拡張は GIL を解放するため、スレッドでも効果が出る。",
    },
  },
  {
    id: "py-039",
    categoryId: "python-basics",
    difficulty: "intermediate",
    type: "choice",
    question: "@dataclass を使う主な利点は?",
    choices: [
      "__init__ / __repr__ / __eq__ などを自動生成し、データ保持クラスを簡潔に書ける",
      "実行速度が必ず上がる",
      "型チェックを実行時に強制する",
      "継承を禁止する",
    ],
    answerIndex: 0,
    hints: [
      "フィールドを型注釈付きで宣言するだけ。",
      "ボイラープレートが大幅に減る。",
      "frozen=True で不変にもできる。",
    ],
    explanation: {
      summary:
        "@dataclass はフィールド宣言から __init__/__repr__/__eq__ などを自動生成し、データ中心のクラスを簡潔にする。frozen=True で不変、order=True で比較も付く。",
      reason:
        "型注釈は実行時に強制されない (静的チェックは mypy 等)。より厳密な検証が要るなら pydantic を使う選択肢もある。",
    },
  },
  {
    id: "py-040",
    categoryId: "python-basics",
    difficulty: "advanced",
    type: "choice",
    question:
      "ネストしたリスト a = [[1,2],[3]] を b = a[:] (浅いコピー) し、b[0].append(9) するとどうなる?",
    choices: [
      "b だけ変わり a は不変",
      "TypeError",
      "a も b も別物で何も影響しない",
      "a も変わる ([[1,2,9],[3]]) — 浅いコピーは内側のリストを共有するため",
    ],
    answerIndex: 3,
    hints: [
      "a[:] は最上位だけ新しいリスト。",
      "内側の要素は同じ参照を共有。",
      "完全に独立させるには copy.deepcopy。",
    ],
    explanation: {
      summary:
        "a[:] や list(a) は浅いコピーで、内側のオブジェクト (内部リスト) は共有される。b[0] は a[0] と同じ実体なので a も [[1,2,9],[3]] になる。",
      reason:
        "完全に独立させたいときは copy.deepcopy(a)。トップレベルだけ別物にしたい場合は浅いコピーで十分、というように使い分ける。",
    },
  },
];

// ===========================================================================
// TypeScript (ts-basics) — ts-031〜040 / 参考書 typescript-intro を補完
// ===========================================================================
const typescriptExpand: Question[] = [
  {
    id: "ts-031",
    categoryId: "ts-basics",
    difficulty: "intermediate",
    type: "choice",
    question: "any と unknown の違いとして正しいのは?",
    choices: [
      "まったく同じ",
      "unknown の方が危険",
      "unknown は使う前に絞り込み (型ガード) が必要で安全、any は何でも素通しで型チェックを無効化する",
      "any は新しい、unknown は廃止予定",
    ],
    answerIndex: 2,
    hints: [
      "any は型チェックを切る『逃げ』。",
      "unknown はまず正体を確かめないと使えない。",
      "外部入力の受け口は unknown が安全。",
    ],
    explanation: {
      summary:
        "unknown は『型不明だが、使う前に narrowing (typeof/in/型ガード) が必須』で安全。any は型チェックを無効化し、以後何でも通すため危険。",
      reason:
        "外部 JSON や catch(e) の受け口は unknown にして検証してから使うのが安全。any は伝播してコードベース全体の型安全性を蝕む。",
    },
  },
  {
    id: "ts-032",
    categoryId: "ts-basics",
    difficulty: "intermediate",
    type: "choice",
    question: "interface と type の違いとして正しいのは?",
    choices: [
      "interface は宣言マージ (同名再宣言で合成) ができ、type はできない代わりに union/交差/条件型など何でも表せる",
      "type は廃止予定",
      "interface は関数型を表せない",
      "両者は完全に同一で違いはない",
    ],
    answerIndex: 0,
    hints: [
      "同名 interface を 2 回書くと合成される。",
      "type は union/intersection/mapped/conditional に強い。",
      "実務では用途で使い分けるか統一する。",
    ],
    explanation: {
      summary:
        "interface は宣言マージができ拡張に向く。type は union・交差・mapped/conditional types など広い表現ができる (再宣言は不可)。",
      reason:
        "ライブラリの公開型は拡張余地のため interface が好まれることも。union や utility 型は type が必須。プロジェクトでスタイルを統一すると良い。",
    },
  },
  {
    id: "ts-033",
    categoryId: "ts-basics",
    difficulty: "advanced",
    type: "choice",
    question:
      "type Shape = {kind:'circle';r:number} | {kind:'rect';w:number;h:number} を switch(s.kind) で分岐できるのは何のおかげ?",
    choices: [
      "any を使っているから",
      "TS では union は分岐できない",
      "型アサーションが必須だから",
      "判別可能ユニオン (discriminated union) — 共通のリテラル型タグ kind で絞り込めるから",
    ],
    answerIndex: 3,
    hints: [
      "共通のリテラルプロパティ (タグ) がある。",
      "kind の値ごとに型が確定する。",
      "default で never チェックすると網羅性も保証。",
    ],
    explanation: {
      summary:
        "各メンバーが共通のリテラル型タグ (kind) を持つ判別可能ユニオンなら、switch(s.kind) で各ケースの型が自動的に絞り込まれる。",
      reason:
        "default 分岐で const _exhaustive: never = s とすると、ケース追加時の漏れをコンパイルエラーで検出できる (網羅性チェック)。",
    },
  },
  {
    id: "ts-034",
    categoryId: "ts-basics",
    difficulty: "intermediate",
    type: "choice",
    question:
      "ジェネリクスで『T は id プロパティを持つ』ことを要求する書き方は?",
    choices: [
      "function f(x: T)",
      "function f<T extends { id: number }>(x: T)",
      "function f<T: {id:number}>(x: T)",
      "function f<T is {id:number}>(x: T)",
    ],
    answerIndex: 1,
    hints: [
      "制約は extends で表す。",
      "T が満たすべき形を書く。",
      "これで x.id に安全にアクセスできる。",
    ],
    explanation: {
      summary:
        "<T extends { id: number }> で型変数 T に制約を付ける。これにより関数内で x.id に型安全にアクセスできる。",
      reason:
        "extends は『〜に代入可能』の制約。keyof と組み合わせた <T, K extends keyof T> でプロパティ取得関数なども書ける。",
    },
  },
  {
    id: "ts-035",
    categoryId: "ts-basics",
    difficulty: "intermediate",
    type: "choice",
    question:
      "既存の型 User から『一部のプロパティだけ』を持つ型を作る Utility Type は?",
    choices: [
      "Partial<User> (全部オプショナル)",
      "Required<User>",
      "Pick<User, 'id' | 'name'>",
      "Readonly<User>",
    ],
    answerIndex: 2,
    hints: [
      "キーを選んで抜き出す。",
      "逆に除外するのは Omit。",
      "全部任意化は Partial。",
    ],
    explanation: {
      summary:
        "Pick<User, 'id' | 'name'> で指定キーだけの型を作る。逆に Omit<User, 'password'> は除外。Partial は全オプショナル化、Required はその逆。",
      reason:
        "他に Record<K,V>・Readonly<T>・ReturnType<F>・Parameters<F> などがある。Utility Types は既存型から派生型を安全に作る道具。",
    },
  },
  {
    id: "ts-036",
    categoryId: "ts-basics",
    difficulty: "advanced",
    type: "choice",
    question:
      "const obj = { mode: 'dark' } の mode の型を 'dark' リテラルに固定し、全体を readonly にするには?",
    choices: [
      "as const を付ける ({ mode: 'dark' } as const)",
      "as string を付ける",
      ": any を付ける",
      "何もしなくてもリテラル型になる",
    ],
    answerIndex: 0,
    hints: [
      "通常は mode が string に広がる (widening)。",
      "as const でリテラル + readonly に固定。",
      "設定オブジェクトや tuple 化に便利。",
    ],
    explanation: {
      summary:
        "as const を付けると値がリテラル型に固定され (mode: 'dark')、オブジェクト/配列は深く readonly になる。",
      reason:
        "通常 const obj = {mode:'dark'} でも obj.mode は string に広がる。as const で 'dark' に固定でき、配列は readonly tuple になる。union 定義の元にも使える。",
    },
  },
  {
    id: "ts-037",
    categoryId: "ts-basics",
    difficulty: "advanced",
    type: "choice",
    question:
      "function isString(x: unknown): x is string { return typeof x === 'string' } の x is string は何?",
    choices: [
      "ただのコメント",
      "実行時アサーション",
      "ユーザー定義型ガード (戻り値 true のとき呼び出し側で x が string に絞り込まれる)",
      "型エイリアス",
    ],
    answerIndex: 3,
    hints: [
      "戻り値の型に書く特別な述語。",
      "true を返すと呼び出し側で型が絞られる。",
      "複雑な判定を関数に切り出せる。",
    ],
    explanation: {
      summary:
        "x is string は型述語 (type predicate)。この関数が true を返すと、呼び出し側の if ブロック内で引数が string に絞り込まれる (ユーザー定義型ガード)。",
      reason:
        "typeof/instanceof/in で表せない複雑な判定を関数化できる。誤った述語を書くと安全性が崩れるので実装と述語を一致させる責任は開発者にある。",
    },
  },
  {
    id: "ts-038",
    categoryId: "ts-basics",
    difficulty: "advanced",
    type: "choice",
    question: "never 型はどんなときに現れる/使うか?",
    choices: [
      "あらゆる値を入れられる型",
      "null と同じ",
      "省略可能なプロパティの型",
      "決して値を持たない型 (返らない関数の戻り値、網羅性チェックの『あり得ない』分岐)",
    ],
    answerIndex: 3,
    hints: [
      "例外を投げ続ける/無限ループの関数の戻り値。",
      "union を絞り切った後の『残り』。",
      "switch の網羅性チェックで使う。",
    ],
    explanation: {
      summary:
        "never は『値を持ち得ない』型。常に throw する関数の戻り値や、判別可能ユニオンを全分岐で扱い切った後の default に現れる。",
      reason:
        "default で const _: never = x とすると、ケース追加漏れをコンパイルエラーにできる。any と逆で『どの型にも代入できない』のが never。",
    },
  },
  {
    id: "ts-039",
    categoryId: "ts-basics",
    difficulty: "intermediate",
    type: "choice",
    question:
      "strictNullChecks 有効下で user.profile?.name の ?. (オプショナルチェーン) は何をする?",
    choices: [
      "profile が null/undefined なら評価を打ち切り undefined を返す (例外を投げない)",
      "null を空文字に変換する",
      "必ず例外を投げる",
      "型エラーを無視する",
    ],
    answerIndex: 0,
    hints: [
      "左辺が null/undefined なら短絡。",
      "?? (null 合体) と組み合わせる。",
      "strictNullChecks で null 安全が型に現れる。",
    ],
    explanation: {
      summary:
        "?. は左辺が null/undefined のときに評価を止め undefined を返す (TypeError を防ぐ)。user.profile?.name ?? '匿名' のように ?? で既定値も与えられる。",
      reason:
        "strictNullChecks を有効にすると null/undefined が型に明示され、? や ?. を使った安全なアクセスが促される。?? は null/undefined のみを既定値に置換 (|| と違い 0/'' は通す)。",
    },
  },
  {
    id: "ts-040",
    categoryId: "ts-basics",
    difficulty: "advanced",
    type: "choice",
    question: "satisfies 演算子 (TS 4.9+) の利点は?",
    choices: [
      "型を完全に無視する",
      "実行時に型チェックする",
      "any にキャストする",
      "値が指定の型に適合するか検査しつつ、値そのものの具体的な (より狭い) 型推論を保てる",
    ],
    answerIndex: 3,
    hints: [
      "型注釈 (: T) だと推論が T まで広がる。",
      "as T は検査が甘い。",
      "satisfies は検査 + 推論維持の両取り。",
    ],
    explanation: {
      summary:
        "const config = {...} satisfies Config は、Config への適合を検査しつつ、各プロパティの具体的なリテラル型などの推論を維持する。",
      reason:
        ": Config だと値の型が Config に広がり個別キーのリテラル情報が失われる。as Config は適合検査が甘い。satisfies は『検査するが型は広げない』の両取り。",
    },
  },
];

export const expandQuestions: Question[] = [
  ...nextjsExpand,
  ...gitExpand,
  ...nuxtExpand,
  ...linuxExpand,
  ...securityExpand,
  ...reactExpand,
  ...pythonExpand,
  ...typescriptExpand,
];
