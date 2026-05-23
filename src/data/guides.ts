import type { TrackId, CategoryId } from "@/lib/types";

// ===========================================================================
// 参考書 (Study Guide) の型定義
// ===========================================================================

export type GuideSection = {
  /** 見出し */
  heading: string;
  /** 本文 (改行を含むプレーンテキスト) */
  body: string;
  /** オプションのコード例 */
  code?: string;
  /** オプションのコードの言語 (シンタックスハイライト用ラベル) */
  language?: string;
  /** よくある落とし穴・補足 */
  notes?: string[];
};

export type GuideChapter = {
  id: string;
  /** 章タイトル */
  title: string;
  /** 短い導入 (リスト画面用) */
  intro: string;
  /** 想定読了時間 (分) */
  readingMinutes: number;
  /** 学習目標 (この章で何を理解すべきか) */
  objectives: string[];
  /** 公式/参考リンク */
  references?: { label: string; url: string }[];
  /** 章本体 (節の配列) */
  sections: GuideSection[];
  /** 理解度確認: 関連クイズ問題 ID */
  comprehensionQuestionIds?: string[];
  /** 要点まとめ (章末) */
  keyTakeaways: string[];
};

export type Guide = {
  id: string;
  trackId: TrackId;
  /** ガイド名 (例: 「Ruby の地図 — はじめての一冊」) */
  title: string;
  /** 1 行説明 */
  subtitle: string;
  /** どんな読者に */
  audience: string;
  /** 出典 (公式ドキュメント / 書籍 / リンク) */
  sources: { label: string; url: string }[];
  emoji: string;
  /** 章の配列 */
  chapters: GuideChapter[];
  /** どのカテゴリと関連が深いか (リンク用) */
  relatedCategoryIds?: CategoryId[];
};

// ===========================================================================
// 参考書データ
// ===========================================================================

export const guides: Guide[] = [
  // ---------- Ruby 入門ガイド ----------
  {
    id: "ruby-intro",
    trackId: "ruby",
    title: "Ruby の地図 — はじめての一冊",
    subtitle:
      "公式リファレンス + チェリー本 (プロを目指す人のためのRuby入門) のエッセンスを 3 章に圧縮した入門ガイド",
    audience:
      "Ruby を初めて学ぶ人、JavaScript / Python 等から移ってきた人",
    sources: [
      { label: "Ruby 公式リファレンス", url: "https://docs.ruby-lang.org/ja/" },
      { label: "Ruby スタイルガイド", url: "https://rubystyle.guide/" },
    ],
    emoji: "💎",
    relatedCategoryIds: ["ruby-basics", "collections", "ruby-oop"],
    chapters: [
      {
        id: "values-and-control",
        title: "1. 値と制御構造 — Ruby の世界観",
        intro:
          "Ruby ではほぼ全てが『オブジェクト』。nil もメソッドを持ち、true/false の判定にも特徴がある。",
        readingMinutes: 6,
        objectives: [
          "Ruby の基本データ型 (Integer / Float / String / Symbol / nil / true/false) を区別できる",
          "Ruby の真偽値判定 (false と nil だけが偽) の特徴を説明できる",
          "if / unless / case-when を式として使えることを理解する",
        ],
        references: [
          {
            label: "公式: クラス階層",
            url: "https://docs.ruby-lang.org/ja/latest/class/index.html",
          },
        ],
        sections: [
          {
            heading: "1.1 すべてがオブジェクト",
            body: "Ruby ではプリミティブと呼ばれる『特別な値』がほとんど存在しない。整数 42 もメソッド `42.even?` を持ち、`nil` も `nil.to_s` (空文字列) や `nil.to_a` (空配列) を持つ。これにより『メソッドチェーンが安全に書ける』『分岐コードが減る』という Ruby 特有の書き味になる。",
            code: "42.even?           #=> true\nnil.to_s           #=> \"\"\nnil.to_a           #=> []\n[1, 2, 3].class    #=> Array\nArray.class        #=> Class (Class もまたオブジェクト)",
            language: "ruby",
            notes: [
              "他言語経験者の最初のつまずき: nil に対するメソッド呼び出しが NoMethodError にならないケースがある (to_s / to_a / to_i 等)",
            ],
          },
          {
            heading: "1.2 真偽値: false と nil だけが falsy",
            body: "Ruby の if 文で『偽』と評価される値は false と nil の 2 つだけ。0 / '' / [] は全て truthy。これは JavaScript / Python と異なるので注意。",
            code: "if 0    then puts \"truthy\" end  # → truthy\nif \"\"   then puts \"truthy\" end  # → truthy\nif []   then puts \"truthy\" end  # → truthy\nif nil  then puts \"truthy\" end  # 出力なし",
            language: "ruby",
            notes: [
              "空配列を『何もない』と判定したい場合は `arr.empty?` を使う。`if arr` だと常に truthy",
            ],
          },
          {
            heading: "1.3 制御構造は式 (値を返す)",
            body: "Ruby の if / case / while / begin は式として値を返す。これにより、最終行を return する関数や 1 行で代入する書き方が自然に書ける。",
            code: "grade = if score >= 80 then \"A\"\n        elsif score >= 60 then \"B\"\n        else \"C\"\n        end\n\n# case/when も同様\nlabel = case status\n        when :draft     then \"下書き\"\n        when :published then \"公開済\"\n        end",
            language: "ruby",
            notes: [
              "後置 if / unless: `return false unless valid?` のような Guard Clause パターンを多用する",
            ],
          },
        ],
        keyTakeaways: [
          "nil もメソッドを持つオブジェクト。to_s / to_a / to_i などで安全にチェイン可能",
          "Ruby の真偽値判定は false と nil だけが偽。他言語の感覚と違うので明示的に `.empty?` などを使う",
          "if / case は式。最終評価された値が戻り値になる",
        ],
        comprehensionQuestionIds: ["rb-001", "rb-002", "rb-003", "rb-032"],
      },
      {
        id: "collections-and-blocks",
        title: "2. コレクションとブロック — Ruby のしなやかさ",
        intro:
          "Array / Hash / Enumerable とブロックの組合せは Ruby の核心。map / select / inject の 3 つを使いこなせば多くのロジックが宣言的に書ける。",
        readingMinutes: 8,
        objectives: [
          "Array / Hash の基本操作と破壊的/非破壊的メソッドの違いを理解する",
          "ブロック (`{|x| ...}`) を yield で受け取る仕組みを説明できる",
          "map / select / inject (reduce) の使い分けができる",
        ],
        sections: [
          {
            heading: "2.1 Array と Hash",
            body: "Array は順序付きコレクション、Hash はキー・値のペア。どちらも Enumerable モジュールを include しているため、map / select / inject などの強力なメソッドを共有する。Hash のキーには Symbol を使うのが Ruby の慣習。",
            code: "arr = [1, 2, 3]\narr.first        #=> 1\narr.last         #=> 3\narr.push(4)      # 破壊的、arr は [1,2,3,4]\narr + [5]        # 非破壊、新しい配列\n\nh = { name: \"Alice\", age: 20 }\nh[:name]         #=> \"Alice\"\nh.fetch(:none, \"default\")\nh.each { |k, v| puts \"#{k}=#{v}\" }",
            language: "ruby",
            notes: [
              "破壊的メソッドは末尾に `!` が付くものが多い (push は例外)。破壊か非破壊かは `arr.object_id` を見比べる癖を付けると安全",
            ],
          },
          {
            heading: "2.2 ブロックは Ruby の関数引数",
            body: "メソッドの後ろに `do...end` または `{...}` で渡されるのが『ブロック』。メソッド側は `yield` でブロックを呼び出す。明示的に Proc として受け取る場合は `&blk` 引数を使う。",
            code: "def repeat(n)\n  n.times { yield }\nend\nrepeat(3) { puts \"hi\" }   # 'hi' を 3 回\n\ndef call_with(x, &blk)\n  blk.call(x)\nend\ncall_with(5) { |n| n * 2 }   #=> 10",
            language: "ruby",
            notes: [
              "ブロックは『軽量な関数』。each / map / each_with_index など Enumerable の多くがブロックを取る",
              "Symbol#to_proc により `arr.map(&:to_s)` のような短縮形が書ける",
            ],
          },
          {
            heading: "2.3 map / select / inject の 3 本柱",
            body: "map は変換、select は絞り込み、inject (reduce) は畳み込み。これら 3 つを組合せると大半の集合操作が宣言的に書ける。",
            code: "# map: 変換\n[1, 2, 3].map { |n| n * 2 }            #=> [2, 4, 6]\n\n# select: 絞り込み\n[1, 2, 3, 4].select { |n| n.even? }    #=> [2, 4]\n\n# inject: 畳み込み (初期値 + 累積)\n[1, 2, 3, 4].inject(0) { |sum, n| sum + n }   #=> 10\n[1, 2, 3, 4].inject(:+)                       #=> 10 (短縮形)\n\n# 組合せ: 偶数の二乗の和\n[1, 2, 3, 4].select(&:even?).map { |n| n ** 2 }.sum   #=> 20",
            language: "ruby",
            notes: [
              "メソッドチェーンの間でデバッグしたい時は `.tap { |x| p x }` を挟む",
              "Hash 構築は `each_with_object({})` が安全 (inject の罠を回避)",
            ],
          },
        ],
        keyTakeaways: [
          "Array / Hash は Enumerable を共有 → map / select / inject が両方で使える",
          "ブロックはメソッドの最後に渡せる軽量関数。yield で呼ぶか &blk で Proc 化",
          "map (変換) / select (絞り込み) / inject (累積) で多くの集合操作が宣言的に書ける",
        ],
        comprehensionQuestionIds: ["col-001", "col-002", "col-005", "col-013"],
      },
      {
        id: "classes-and-modules",
        title: "3. クラスとモジュール — Ruby らしいオブジェクト指向",
        intro:
          "Ruby はクラスベースの OOP に Mixin (モジュール) を組み合わせる。継承を深くせずに振る舞いを合成するのが Ruby らしさ。",
        readingMinutes: 7,
        objectives: [
          "class / module の定義と attr_accessor の役割を説明できる",
          "継承と Mixin (include / prepend / extend) の使い分けを理解する",
          "private / protected / public の可視性を把握する",
        ],
        sections: [
          {
            heading: "3.1 クラスの基本",
            body: "クラスは initialize で初期化、attr_accessor で getter/setter を一括定義。インスタンス変数は `@` で始まる。",
            code: "class User\n  attr_accessor :name, :age\n\n  def initialize(name:, age: 0)\n    @name = name\n    @age = age\n  end\n\n  def adult?\n    @age >= 18\n  end\nend\n\nu = User.new(name: \"Alice\", age: 20)\nu.name           #=> \"Alice\"\nu.adult?         #=> true",
            language: "ruby",
            notes: [
              "attr_accessor は getter/setter を生成するマクロ。読み取り専用なら attr_reader、書き込み専用なら attr_writer",
            ],
          },
          {
            heading: "3.2 Module による Mixin",
            body: "Ruby は単一継承だが、Module を include することで複数の振る舞いを混ぜ込める (Mixin)。Comparable / Enumerable などの標準モジュールが代表例。",
            code: "module Greetable\n  def greet\n    \"Hello, #{name}!\"\n  end\nend\n\nclass User\n  include Greetable\n  attr_reader :name\n  def initialize(name); @name = name; end\nend\n\nUser.new(\"Alice\").greet   #=> \"Hello, Alice!\"\n\n# 標準 Comparable: <=> を定義すれば < <= == >= > が自動で得られる\nclass Version\n  include Comparable\n  attr_reader :major, :minor\n  def initialize(s); @major, @minor = s.split('.').map(&:to_i); end\n  def <=>(other); [major, minor] <=> [other.major, other.minor]; end\nend",
            language: "ruby",
            notes: [
              "include はインスタンスメソッドに、extend はクラスメソッド (特異メソッド) に、prepend は元のメソッドより前 (super で元を呼べる) に挿入",
              "Rails の Concern は `extend ActiveSupport::Concern` で書く慣習化された Mixin パターン",
            ],
          },
          {
            heading: "3.3 可視性: public / private / protected",
            body: "デフォルトは public。private はレシーバ無しでのみ呼べる、protected は同クラス・サブクラスの他インスタンスからレシーバ付きで呼べる、という違いがある。",
            code: "class User\n  def public_action\n    do_secret_work\n  end\n\n  private\n\n  def do_secret_work\n    # User インスタンス内部からのみ呼べる\n  end\nend\n\nUser.new.public_action     # OK\nUser.new.do_secret_work    # NoMethodError",
            language: "ruby",
            notes: [
              "Ruby の private は他言語と意味が違う: 『明示的レシーバ (self を含む) では呼べない』だけ。サブクラスからは呼べる",
              "send を使うと private も呼べてしまう。意図しない外部呼び出しを防ぐには public_send を使う",
            ],
          },
        ],
        keyTakeaways: [
          "attr_accessor / attr_reader / attr_writer で getter/setter を一括宣言",
          "Module の include で複数の振る舞いを Mixin。継承の深いツリーを避ける",
          "private はレシーバ無し呼び出しの制約。完全な隠蔽ではない",
        ],
        comprehensionQuestionIds: ["oop-001", "oop-005", "oop-006", "rb-044"],
      },
    ],
  },

  // ---------- JavaScript 入門ガイド ----------
  {
    id: "javascript-intro",
    trackId: "javascript",
    title: "Modern JavaScript — ES2015+ の地図",
    subtitle:
      "MDN 公式 + You Don't Know JS のエッセンスを 3 章に。var/let/const から非同期処理まで",
    audience:
      "JavaScript を体系的に学び直したい人、フロントエンド/Node に入りたい人",
    sources: [
      { label: "MDN Web Docs (JavaScript)", url: "https://developer.mozilla.org/ja/docs/Web/JavaScript" },
      { label: "TC39 ECMAScript 仕様", url: "https://tc39.es/ecma262/" },
    ],
    emoji: "🟨",
    relatedCategoryIds: ["js-basics", "js-functions", "js-async"],
    chapters: [
      {
        id: "values-and-scopes",
        title: "1. 値とスコープ — 変数宣言の三択",
        intro:
          "let / const / var の違い、プリミティブと参照、truthy / falsy の罠を整理する。",
        readingMinutes: 6,
        objectives: [
          "let / const / var のスコープと再代入可否を区別できる",
          "プリミティブと参照型のコピー挙動の違いを説明できる",
          "==/=== の差、falsy 値、Nullish Coalescing (??) を使い分けられる",
        ],
        sections: [
          {
            heading: "1.1 let / const / var",
            body: "現代の JS では基本 const、再代入が必要なら let、var は使わない。var には『ホイスト + 関数スコープ』という古い癖があり、ループ内で罠が起きやすい。",
            code: "// var の罠: ループ後も生存\nfor (var i = 0; i < 3; i++) {}\nconsole.log(i)        // 3\n\n// let はブロックスコープ\nfor (let j = 0; j < 3; j++) {}\nconsole.log(j)        // ReferenceError\n\n// const は再代入不可だが、中身は変更可\nconst arr = [1, 2]\narr.push(3)           // OK\narr = [4]             // TypeError",
            language: "javascript",
            notes: [
              "const のオブジェクトの中身を完全に固定したいなら `Object.freeze(obj)`",
              "var はモダンコードベースでは出てこないので使わない",
            ],
          },
          {
            heading: "1.2 プリミティブと参照",
            body: "number / string / boolean / null / undefined / symbol / bigint はプリミティブで値コピー。object / array / function は参照型で代入は参照コピー。これが React の『state を直接 mutate しない』ルールの根拠でもある。",
            code: "// プリミティブ: 値コピー\nlet a = 1\nlet b = a\nb = 99\nconsole.log(a)        // 1\n\n// オブジェクト: 参照コピー\nconst x = { n: 1 }\nconst y = x\ny.n = 99\nconsole.log(x.n)      // 99\n\n// 浅いコピー\nconst z = { ...x }\n// 深いコピー\nconst deep = structuredClone(x)",
            language: "javascript",
            notes: [
              "structuredClone は ES2022+ の標準。古いブラウザ向けは JSON.parse(JSON.stringify(obj)) で代替",
            ],
          },
          {
            heading: "1.3 真偽値・== の罠・??",
            body: "JS の falsy は false / 0 / '' / null / undefined / NaN / 0n。`==` は緩い比較で罠が多いので `===` を使う。`??` (Nullish Coalescing) は null / undefined だけで右辺を採用 (`||` と違い 0 や '' を保持)。",
            code: "// falsy\nBoolean(0)            // false\nBoolean('')           // false\nBoolean([])           // true (空配列は truthy!)\nBoolean({})           // true\n\n// == の罠\n0 == false            // true\n'' == false           // true\nnull == undefined     // true\n\n// === を使う\n0 === false           // false\n\n// ??\nconst port = process.env.PORT ?? 3000   // PORT が 0 だったら 0 を採用\nconst port2 = process.env.PORT || 3000  // 0 は falsy なので 3000 になる罠",
            language: "javascript",
            notes: [
              "Ruby と違って JS では空配列 [] / 空オブジェクト {} は truthy",
              "?? + ?. (Optional Chaining) の組合せが nil 安全の現代形",
            ],
          },
        ],
        keyTakeaways: [
          "基本 const、再代入は let、var は禁止級",
          "オブジェクトの代入は参照コピー。複製は { ...obj } / structuredClone(obj)",
          "比較は === 一択。デフォルト値は || ではなく ?? を使う",
        ],
        comprehensionQuestionIds: ["js-002", "js-003", "js-004", "js-007", "js-011"],
      },
      {
        id: "functions-and-closures",
        title: "2. 関数 — クロージャと this の整理",
        intro:
          "アロー関数と通常関数の違い、クロージャの仕組み、this のスコープを押さえる。",
        readingMinutes: 7,
        objectives: [
          "アロー関数 / 通常関数の this の違いを説明できる",
          "クロージャ (関数が定義時の変数を覚えている性質) を理解する",
          "高階関数 / map / filter / reduce を使いこなす",
        ],
        sections: [
          {
            heading: "2.1 関数の 2 種類",
            body: "function 宣言は this を持つ、アロー関数 (=>) は this を外側のスコープから継承する。コールバック内で this を保ちたい時はアロー関数、オブジェクトのメソッドとしては通常関数を使う。",
            code: "// 通常関数: this はレシーバ\nconst obj = {\n  name: 'A',\n  greet() { return `hi, ${this.name}` }\n}\nobj.greet()           // 'hi, A'\n\n// アロー: this は定義時の外側\nclass Timer {\n  constructor() { this.n = 0 }\n  start() {\n    setInterval(() => { this.n++ }, 1000)   // this = Timer\n  }\n}\n\n// 注意: オブジェクトメソッドにアローを使うと this が undefined / window\nconst bad = {\n  name: 'A',\n  greet: () => `hi, ${this.name}`   // this は外側 (= undefined)\n}",
            language: "javascript",
          },
          {
            heading: "2.2 クロージャ",
            body: "クロージャ = 関数 + その関数が定義された時のスコープ。これにより『private な値を持つ関数』『カウンタ』『メモ化』などが書ける。React の useState の内部実装もクロージャ。",
            code: "function makeCounter() {\n  let count = 0\n  return () => ++count\n}\n\nconst c = makeCounter()\nc()    // 1\nc()    // 2\nc()    // 3\n// count は外側のローカル変数だが、返した関数が捕捉して保持",
            language: "javascript",
          },
          {
            heading: "2.3 高階関数 (map / filter / reduce)",
            body: "JS の Array には map / filter / reduce / some / every / find などの高階関数が標準装備。これらをチェインすると宣言的にデータ変換を書ける。",
            code: "const users = [\n  { name: 'A', age: 20, active: true },\n  { name: 'B', age: 30, active: false },\n  { name: 'C', age: 25, active: true }\n]\n\n// アクティブユーザーの平均年齢\nconst activeAges = users.filter(u => u.active).map(u => u.age)\nconst avg = activeAges.reduce((a, b) => a + b, 0) / activeAges.length\n\n// 一行で sum + count\nconst { total, count } = users\n  .filter(u => u.active)\n  .reduce((acc, u) => ({\n    total: acc.total + u.age,\n    count: acc.count + 1\n  }), { total: 0, count: 0 })",
            language: "javascript",
            notes: [
              "破壊的: push, pop, shift, unshift, splice, sort, reverse",
              "非破壊的: map, filter, slice, concat, flat, flatMap (ほぼ全て)",
              "sort や reverse でコピーが欲しい時は [...arr].sort() で先にコピー",
            ],
          },
        ],
        keyTakeaways: [
          "this を継承したい (コールバック内など) ならアロー関数、レシーバとして this を使うなら通常関数",
          "クロージャで private 状態を保持できる。React Hook の内部も同じ原理",
          "map / filter / reduce のチェインで宣言的にデータ変換を書く",
        ],
        comprehensionQuestionIds: [
          "jsf-001",
          "jsf-002",
          "jsf-003",
          "jsf-007",
          "jsf-008",
        ],
      },
      {
        id: "async-and-promise",
        title: "3. 非同期処理 — Promise / async-await / Event Loop",
        intro:
          "JS はシングルスレッド + Event Loop。非同期処理を正しく扱うには Promise と async/await の理解が必須。",
        readingMinutes: 7,
        objectives: [
          "Promise の状態 (pending / fulfilled / rejected) と then/catch チェインを理解する",
          "async / await の意味と try/catch でのエラーハンドリングを使える",
          "Promise.all / allSettled / race / any の使い分けができる",
        ],
        sections: [
          {
            heading: "3.1 Promise の基本",
            body: "Promise は『将来の値を表すオブジェクト』。pending → fulfilled / rejected の 3 状態。.then で成功、.catch で失敗をハンドル。fetch の戻り値は Promise。",
            code: "fetch('/api/users')\n  .then(res => res.json())\n  .then(users => console.log(users))\n  .catch(err => console.error(err))\n\n// 自前で Promise を作る\nfunction wait(ms) {\n  return new Promise(resolve => setTimeout(resolve, ms))\n}\n\nawait wait(1000)   // 1 秒待つ",
            language: "javascript",
            notes: [
              "fetch は 404 / 500 でも reject しない (ok チェック必須)",
              "Promise はチェイン可能。前段の戻り値が次段の引数",
            ],
          },
          {
            heading: "3.2 async / await",
            body: "async 関数は常に Promise を返す。中で await を使うと『その Promise が解決するまで関数の実行を中断』する糖衣構文。try / catch でエラーハンドル。",
            code: "async function loadUser(id) {\n  try {\n    const res = await fetch(`/api/users/${id}`)\n    if (!res.ok) throw new Error(`HTTP ${res.status}`)\n    return await res.json()\n  } catch (err) {\n    console.error('failed:', err)\n    return null\n  }\n}\n\n// 直列 vs 並列\n// ❌ 遅い (直列)\nconst a = await fetchA()\nconst b = await fetchB()\n\n// ✅ 速い (並列)\nconst [a, b] = await Promise.all([fetchA(), fetchB()])",
            language: "javascript",
          },
          {
            heading: "3.3 Event Loop と実行順",
            body: "JS はシングルスレッド。同期コード → マイクロタスク (Promise.then / queueMicrotask) → マクロタスク (setTimeout / setInterval) の順で処理される。これを理解するとデバッグが楽になる。",
            code: "console.log('1')\nsetTimeout(() => console.log('2'), 0)\nPromise.resolve().then(() => console.log('3'))\nconsole.log('4')\n// 出力: 1 → 4 → 3 → 2\n// (同期 → マイクロタスク → マクロタスク)",
            language: "javascript",
            notes: [
              "Promise.all: 1 つでも失敗で全体失敗",
              "Promise.allSettled: 全結果を { status, value/reason } で返す (部分失敗を許容)",
              "Promise.race: 最初に決定 (成否どちらでも) した結果",
              "Promise.any: 最初に成功した結果。全部失敗で AggregateError",
            ],
          },
        ],
        keyTakeaways: [
          "Promise は将来の値。fetch の戻り値が代表例",
          "async/await は Promise の糖衣構文。try/catch でエラー処理",
          "並列にできるものは Promise.all、失敗許容なら allSettled",
        ],
        comprehensionQuestionIds: ["jsa-001", "jsa-002", "jsa-003", "jsa-007"],
      },
    ],
  },
];

export const findGuide = (id: string) => guides.find((g) => g.id === id);

export const guidesByTrack = (trackId: TrackId) =>
  guides.filter((g) => g.trackId === trackId);
