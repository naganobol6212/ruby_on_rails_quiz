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
      "公式リファレンス + チェリー本 (プロを目指す人のためのRuby入門) のエッセンスを 7 章に圧縮した入門ガイド (基礎 → コレクション → OOP → 例外 → メタプロ → テスト → Gem)",
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
      {
        id: "exceptions",
        title: "4. 例外処理 — raise / rescue / ensure を使いこなす",
        intro:
          "Ruby の例外階層と begin/rescue/ensure/retry。Exception を直接 rescue しないという鉄則と、例外の使いどころ・避けどころ。",
        readingMinutes: 8,
        objectives: [
          "Exception / StandardError / カスタム例外の階層関係を理解する",
          "begin / rescue / else / ensure / retry の役割を区別できる",
          "『何を raise するか』『何を rescue するか』の設計判断ができる",
        ],
        references: [
          {
            label: "Ruby 公式: 例外処理",
            url: "https://docs.ruby-lang.org/ja/latest/doc/spec=2fcontrol.html#begin",
          },
          {
            label: "Ruby 公式: Exception クラス",
            url: "https://docs.ruby-lang.org/ja/latest/class/Exception.html",
          },
        ],
        sections: [
          {
            heading: "4.1 例外階層 — StandardError を捕まえる",
            body:
              "Ruby の例外は Exception を頂点としたツリー構造。アプリで rescue するべきは StandardError とその子。`SystemExit` (exit 呼び出し) や `Interrupt` (Ctrl-C) も Exception の子だが、これらを rescue するとアプリが止まらなくなる。`rescue` (クラス省略) は暗黙的に `rescue StandardError` を意味するので、こちらを使うのが安全。",
            code:
              "# 階層 (主要なもの)\n# Exception\n#   ├── SystemExit         (exit したとき)\n#   ├── Interrupt          (Ctrl-C)\n#   ├── NoMemoryError\n#   └── StandardError      ← アプリで rescue すべきはここ以下\n#         ├── ArgumentError\n#         ├── TypeError\n#         ├── ZeroDivisionError\n#         └── RuntimeError ← raise '...' のデフォルト\n\nbegin\n  do_something\nrescue ArgumentError => e   # 特定例外\n  log(e)\nrescue => e                  # = StandardError 全般\n  notify(e)\nend\n\n# ❌ 絶対避ける: SystemExit や Interrupt まで握る\nbegin\n  do_something\nrescue Exception => e\n  ...\nend",
            language: "ruby",
            notes: [
              "アプリ用のカスタム例外は必ず `class MyError < StandardError; end` で定義する",
              "rescue 句の評価順は『上から最初にマッチしたもの』。specific を上、汎用を下に",
            ],
          },
          {
            heading: "4.2 ensure / else / retry — 制御フローの脇役たち",
            body:
              "`ensure` は『正常終了でも例外発生でも必ず実行』(他言語の finally)。`else` は『正常終了したときだけ実行』(rescue されなかった時)。`retry` は rescue 節で『begin 節をもう一度試す』。リトライ回数を制限しないと無限ループになるので、必ずカウンタを付ける。",
            code:
              "# ファイルクローズの定型 (ブロック付き File.open なら ensure 不要)\nf = File.open('data.txt')\nbegin\n  process(f)\nrescue => e\n  log(e)\nelse\n  puts '正常終了'  # 例外なし時のみ\nensure\n  f.close   # 例外有無に関わらず必ず\nend\n\n# リトライ (上限付き)\nattempts = 0\nbegin\n  attempts += 1\n  call_external_api\nrescue Net::OpenTimeout\n  retry if attempts < 3\n  raise\nend",
            language: "ruby",
            notes: [
              "ensure 内で return すると外側の戻り値が上書きされる。純粋なクリーンアップのみに留める",
              "retry を使うときは必ずリトライ上限を設定。ActiveJob の `retry_on` などフレームワーク機能も検討",
            ],
          },
          {
            heading: "4.3 例外の設計 — 何を raise すべきか",
            body:
              "例外は『想定外の状況』を呼び出し元に伝える仕組み。バリデーションエラーのような『想定内』は戻り値 (Result オブジェクト) で扱う方が読みやすい場面も多い。Rails の `save` / `save!` の使い分けがその例。自作の例外クラスはエラー種別を語る命名 (`PaymentFailedError`, `InvalidStateError`) にし、StandardError を継承する。",
            code:
              "# カスタム例外定義\nclass PaymentError < StandardError; end\nclass InsufficientFundsError < PaymentError; end\n\n# 呼び出し側でクラスごとに分岐\nbegin\n  charge!\nrescue InsufficientFundsError\n  redirect_to top_up_path\nrescue PaymentError => e\n  notify_admin(e)\n  render :failed\nend\n\n# 例外チェーン (Ruby 2.1+)\nbegin\n  external_api\nrescue OriginalError => e\n  raise MyWrapperError, '失敗', cause: e   # e が e.cause として保持\nend",
            language: "ruby",
            notes: [
              "raise の引数は『例外クラス』『メッセージ』『cause』。`raise 'msg'` は RuntimeError の短縮形",
              "Rails の rescue_from でコントローラ全体の例外を共通ハンドリングできる",
            ],
          },
        ],
        keyTakeaways: [
          "rescue (クラス省略) は StandardError とその子だけを捕まえる。Exception を直接 rescue しない",
          "ensure は必ず実行されるリソース解放枠。return / raise を書くと挙動が壊れるので避ける",
          "想定内のエラーは戻り値 (Result/Form Object)、想定外は例外、と使い分ける",
        ],
        comprehensionQuestionIds: ["rb-027", "rb-028", "adv-003", "adv-004"],
      },
      {
        id: "metaprogramming",
        title: "5. メタプログラミング入門 — Ruby らしい『動的さ』を味方に",
        intro:
          "define_method / method_missing / instance_eval などの基本道具と、それらが Rails の DSL の裏でどう使われているかを理解する。",
        readingMinutes: 9,
        objectives: [
          "define_method と def の違い (クロージャ vs スコープゲート) を理解する",
          "method_missing + respond_to_missing? の組み合わせを書ける",
          "モンキーパッチ / prepend / Refinements の使い分けを判断できる",
        ],
        references: [
          {
            label: "Ruby 公式: Module#define_method",
            url: "https://docs.ruby-lang.org/ja/latest/method/Module/i/define_method.html",
          },
          {
            label: "Metaprogramming Ruby (Paolo Perrotta) — 定番書籍",
            url: "https://pragprog.com/titles/ppmetr2/metaprogramming-ruby-2/",
          },
        ],
        sections: [
          {
            heading: "5.1 define_method — 動的に getter/setter を作る",
            body:
              "`def` は新しいスコープを作るため、ループ変数を捕捉できない。`define_method` はブロックを受け取るのでクロージャとして動き、周囲の変数を捕捉できる。attr_accessor の自前実装が好例。",
            code:
              "class User\n  [:name, :email, :age].each do |attr|\n    define_method(attr) do\n      instance_variable_get(\"@#{attr}\")\n    end\n    define_method(\"#{attr}=\") do |val|\n      instance_variable_set(\"@#{attr}\", val)\n    end\n  end\nend\n# attr_accessor :name, :email, :age と同等",
            language: "ruby",
            notes: [
              "Rails の attr_accessor / scope / validates も内部で define_method を多用",
              "動的定義しすぎると IDE 補完が効かない。本当に動的にする必要があるかを毎回問う",
            ],
          },
          {
            heading: "5.2 method_missing — 未定義メソッドを動的にハンドル",
            body:
              "オブジェクトに存在しないメソッドが呼ばれると最後に method_missing が呼ばれる。これを override すれば『動的にメソッドを生やす』ことができる。ActiveRecord の `find_by_email` や OpenStruct の正体。`respond_to_missing?` も必ずセットで定義する (`respond_to?` が嘘をつかないように)。",
            code:
              "class Proxy\n  def initialize(target); @target = target; end\n\n  def method_missing(name, *args, &blk)\n    if @target.respond_to?(name)\n      @target.public_send(name, *args, &blk)\n    else\n      super\n    end\n  end\n\n  def respond_to_missing?(name, include_private = false)\n    @target.respond_to?(name, include_private) || super\n  end\nend\n\nProxy.new([1, 2, 3]).length   #=> 3 (Array に委譲)",
            language: "ruby",
            notes: [
              "method_missing は通常メソッドより遅い。頻繁に呼ばれるなら define_method で事前生成する",
              "respond_to_missing? を忘れると Duck Typing で『振る舞いがあるか』をチェックするコードが壊れる",
            ],
          },
          {
            heading: "5.3 オープンクラス vs Refinements",
            body:
              "Ruby はクラスをいつでも再オープン可能 (Open Class)。標準ライブラリを拡張する『モンキーパッチ』が書けるが、グローバルに影響するため他 gem との衝突リスクがある。`prepend` で super 経由のラップに、`Refinements (refine + using)` でスコープを限定するのが安全。",
            code:
              "# ❌ グローバル: アプリ全体で String#shout が有効に\nclass String\n  def shout; upcase + '!!'; end\nend\n\n# ✅ Refinements: using を書いたスコープだけで有効\nmodule StringExt\n  refine String do\n    def shout; upcase + '!!'; end\n  end\nend\n\nclass MyClass\n  using StringExt\n  def call\n    'hello'.shout   # ここでだけ shout が呼べる\n  end\nend\n'hello'.shout       # NoMethodError (スコープ外)",
            language: "ruby",
            notes: [
              "Rails の ActiveSupport は歴史的に多数のモンキーパッチを当てているが、現代の gem では Refinements を選ぶケースが増えている",
              "prepend は『元メソッドを super で呼べる形でラップ』する用途 (計装、ロギング)",
            ],
          },
        ],
        keyTakeaways: [
          "define_method はクロージャ。def では捕捉できない外側の変数を持ち回せる",
          "method_missing と respond_to_missing? は必ずセット。Duck Typing が壊れないように",
          "標準ライブラリの拡張は Refinements か別オブジェクト (Decorator) で局所化する",
        ],
        comprehensionQuestionIds: ["adv-006", "adv-007", "adv-012", "adv-020"],
      },
      {
        id: "testing",
        title: "6. テストと TDD — Minitest と RSpec、Mock/Stub の基本",
        intro:
          "Ruby 標準の Minitest と業界標準の RSpec、Red-Green-Refactor の TDD サイクル、Mock/Stub の使い分け。",
        readingMinutes: 9,
        objectives: [
          "Minitest と RSpec の構文の違いと使い分けを理解する",
          "Red → Green → Refactor の 3 ステップを意識して 1 機能を書ける",
          "Mock と Stub の違いを説明し、過剰なモックを避けられる",
        ],
        references: [
          {
            label: "RSpec Rails (公式)",
            url: "https://github.com/rspec/rspec-rails",
          },
          {
            label: "Better Specs (RSpec ベストプラクティス)",
            url: "https://www.betterspecs.org/",
          },
        ],
        sections: [
          {
            heading: "6.1 Minitest と RSpec — 二大テストフレームワーク",
            body:
              "Minitest は Ruby 標準で軽量・高速。RSpec は読みやすい DSL (describe/it) と豊富なマッチャーで Rails コミュニティで圧倒的シェア。新規プロジェクトは RSpec が多数派だが、Rails 公式は Minitest を推奨している点も知っておく。",
            code:
              "# Minitest\nrequire 'minitest/autorun'\n\nclass CalculatorTest < Minitest::Test\n  def test_addition\n    assert_equal 5, Calculator.add(2, 3)\n  end\nend\n\n# RSpec\nrequire 'spec_helper'\n\nRSpec.describe Calculator do\n  describe '.add' do\n    it 'returns the sum of two numbers' do\n      expect(Calculator.add(2, 3)).to eq 5\n    end\n  end\nend",
            language: "ruby",
            notes: [
              "Minitest は速度・依存の少なさが強み。Rails コミュニティの多数派は RSpec",
              "Better Specs はチェックリストとして有用 (1 it 1 expect, let の使い方など)",
            ],
          },
          {
            heading: "6.2 TDD のサイクル — Red / Green / Refactor",
            body:
              "1. **Red**: まず失敗するテストを書く (機能はまだ無いので赤になる) \n2. **Green**: 最小限の実装でテストを通す (汚くてもいい) \n3. **Refactor**: テストが通る状態を保ったままコードを綺麗にする\nこのサイクルを 5〜15 分で回す。テストが要件のドキュメントになり、設計の壊れも早く検知できる。",
            code:
              "# 例: Fizz の実装を TDD で\n# Step 1: Red (まだ Calculator.fizz が無いので失敗する)\nit 'returns Fizz when divisible by 3' do\n  expect(FizzBuzz.call(3)).to eq 'Fizz'\nend\n\n# Step 2: Green (とりあえず通す)\nclass FizzBuzz\n  def self.call(n)\n    'Fizz' if n % 3 == 0\n  end\nend\n\n# Step 3: Refactor (テストが通ったまま設計を改善)\nclass FizzBuzz\n  RULES = { 3 => 'Fizz', 5 => 'Buzz' }.freeze\n  def self.call(n)\n    RULES.map { |k, v| v if n % k == 0 }.compact.join.presence || n.to_s\n  end\nend",
            language: "ruby",
            notes: [
              "リファクタリングはテストが緑のまま行うのが原則。緑じゃなくなったらすぐ戻す",
              "TDD は速いフィードバックループが目的。1 サイクル 15 分以上かかったら粒度が大きすぎる",
            ],
          },
          {
            heading: "6.3 Mock と Stub — 過剰モックの罠",
            body:
              "**Stub**: 『メソッドの戻り値を差し替える』 — 入力に対する出力を固定する。\n**Mock**: 『メソッドが呼ばれることを期待する』 — 副作用 (DB 書込み、メール送信) の検証。\nDouble (= Test Double) という総称が両方を指す。**過剰なモック**は『テストは通るが本物は動かない』状態を生むので、外部 I/O (API / メール) はモック、純粋ロジックはモックせず実物を使うのが原則。",
            code:
              "# Stub: 戻り値の差し替え\nallow(Time).to receive(:current).and_return(Time.new(2026, 1, 1))\n\n# Mock: 呼び出されることを期待\nexpect(NotifyMailer).to receive(:welcome).with(user).and_call_original\n\n# instance_double で型安全な double\nuser = instance_double(User, name: 'Alice', admin?: true)\nexpect(user.name).to eq 'Alice'",
            language: "ruby",
            notes: [
              "instance_double / class_double は本物のクラスに存在するメソッドだけ stub 可能。本物がリネームされた時テストが壊れて気付ける",
              "過剰モックの兆候: テストの 80% が allow/expect で埋まっている → 設計を見直す",
            ],
          },
        ],
        keyTakeaways: [
          "RSpec が主流だが Minitest も実用十分。プロジェクトのスタイルガイドに従う",
          "TDD は Red → Green → Refactor の高速ループ。1 サイクル 15 分以下が目安",
          "外部 I/O はモック、純粋ロジックはモックしない。instance_double で型安全に",
        ],
        comprehensionQuestionIds: ["pr-001", "pr-007"],
      },
      {
        id: "gems-and-bundler",
        title: "7. Gem と Bundler — 依存関係を管理する",
        intro:
          "Gemfile / Gemfile.lock の役割、bundle update の安全な使い方、gem の作成と公開の基礎。",
        readingMinutes: 8,
        objectives: [
          "Gemfile / Gemfile.lock の役割と『なぜ両方コミットするか』を理解する",
          "bundle install / update / outdated の挙動を区別できる",
          "簡単な gem を作って rubygems.org に公開できる手順を知る",
        ],
        references: [
          {
            label: "Bundler 公式",
            url: "https://bundler.io/",
          },
          {
            label: "RubyGems Guides",
            url: "https://guides.rubygems.org/",
          },
        ],
        sections: [
          {
            heading: "7.1 Gemfile と Gemfile.lock",
            body:
              "Gemfile は『欲しい gem の宣言』。Gemfile.lock は『bundle install で確定した実際のバージョン』。両方コミットすることで『チーム全員が同じバージョンで動く』を保証する。本番デプロイでも `bundle install --deployment` で Gemfile.lock 通りにインストールするのが定石。",
            code:
              "# Gemfile\nsource 'https://rubygems.org'\n\nruby '3.3.0'\n\ngem 'rails', '~> 7.1.0'      # 7.1.x の最新まで OK、7.2 は不可\ngem 'pg', '>= 1.5'\ngem 'puma'\n\ngroup :development, :test do\n  gem 'rspec-rails'\n  gem 'factory_bot_rails'\nend\n\n# 開発者ローカルでだけ使う gem\ngroup :development do\n  gem 'bullet'\n  gem 'rubocop', require: false\nend",
            language: "ruby",
            notes: [
              "`~> 7.1.0` は『7.1.x の最新まで』(pessimistic version constraint)。バージョン更新の安全マージン",
              "`gem '...', github: 'user/repo'` で GitHub から直接読み込めるが、本番では版を固定する",
            ],
          },
          {
            heading: "7.2 bundle install / update / outdated",
            body:
              "**install**: Gemfile.lock があればそれを再現、無ければ Gemfile から解決して .lock を作る。\n**update**: 指定 gem (省略時は全部) を Gemfile.lock を無視して最新化。\n**outdated**: 古い gem を一覧表示するだけ。\n本番の手順: ローカルで `bundle update rails` → テスト → 通れば Gemfile.lock を commit → デプロイ。**未指定の `bundle update` は危険** (全 gem が動く)。",
            code:
              "$ bundle install         # Gemfile.lock 通りに揃える (初回 / CI)\n$ bundle outdated        # 古い gem を確認\n$ bundle update rails    # rails 関連だけ最新化\n$ bundle exec rspec      # bundle 経由で実行 (バージョン固定)",
            language: "bash",
            notes: [
              "本番デプロイ前は必ず `bundle install --deployment --without development test` で本番だけのインストール",
              "セキュリティ更新は `bundle audit` (bundler-audit gem) で脆弱性チェック",
            ],
          },
          {
            heading: "7.3 自作 gem の最小構成",
            body:
              "`bundle gem my_gem` でひな形を生成。lib/ に実装、my_gem.gemspec にメタデータ、README + LICENSE + テストを揃えれば最小構成は完成。`gem build` でパッケージ、`gem push` で rubygems.org に公開。社内 gem なら private な gem server (geminabox / Gemfury) を使う。",
            code:
              "$ bundle gem my_helper\n$ cd my_helper\n# lib/my_helper.rb を実装\n# my_helper.gemspec の TODO を埋める\n$ rake spec        # テスト\n$ gem build my_helper.gemspec\n$ gem push my_helper-0.1.0.gem   # rubygems.org に公開",
            language: "bash",
            notes: [
              "gemspec の license / homepage / source_code_uri は省略しない (rubygems で警告)",
              "Semantic Versioning (semver) に従い破壊的変更でメジャーを上げる",
            ],
          },
        ],
        keyTakeaways: [
          "Gemfile.lock も必ずコミット。チーム全員 + 本番で同じバージョンを再現するため",
          "`bundle update` (引数なし) は地雷。具体的に gem 名を指定する",
          "自作 gem は bundle gem でひな形 → semver で公開",
        ],
        comprehensionQuestionIds: ["rails-007", "rails-010"],
      },
    ],
  },

  // ---------- JavaScript 入門ガイド ----------
  {
    id: "javascript-intro",
    trackId: "javascript",
    title: "Modern JavaScript — ES2015+ の地図",
    subtitle:
      "MDN 公式 + You Don't Know JS のエッセンスを 7 章に。値とスコープ → 関数 → 非同期 → 配列 → OOP → ESM → TypeScript への橋渡し",
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
      {
        id: "arrays-and-iteration",
        title: "4. 配列とイテレーション — map / filter / reduce と Spread",
        intro:
          "MDN 標準の Array メソッドを実例で。for ループより宣言的に書く感覚と、Spread / Rest で配列を扱うイディオム。",
        readingMinutes: 7,
        objectives: [
          "map / filter / reduce / find / some / every を使い分けられる",
          "Spread (...) と Rest (...) の文脈による意味の違いを説明できる",
          "for...of と for...in の違いを理解する",
        ],
        references: [
          {
            label: "MDN: Array (配列)",
            url: "https://developer.mozilla.org/ja/docs/Web/JavaScript/Reference/Global_Objects/Array",
          },
        ],
        sections: [
          {
            heading: "4.1 map / filter / reduce の 3 本柱",
            body:
              "JavaScript の Array は『非破壊的な変換系メソッド』を豊富に持つ。`map` は要素変換 (要素数同じ)、`filter` は絞り込み (要素数減る)、`reduce` は畳み込み (1 つの値に集約)。チェーン可能で関数型スタイルが書ける。",
            code:
              "const nums = [1, 2, 3, 4, 5];\n\n// map: 全要素を変換\nnums.map(n => n * 2);\n// → [2, 4, 6, 8, 10]\n\n// filter: 条件で絞り込み\nnums.filter(n => n % 2 === 0);\n// → [2, 4]\n\n// reduce: 初期値 + 累積\nnums.reduce((acc, n) => acc + n, 0);\n// → 15\n\n// チェーン (偶数の二乗の合計)\nnums\n  .filter(n => n % 2 === 0)\n  .map(n => n * n)\n  .reduce((a, b) => a + b, 0);\n// → 4 + 16 = 20",
            language: "javascript",
            notes: [
              "map / filter は新しい配列を返す (非破壊)。元配列は変わらない",
              "Array.prototype.forEach は副作用専用 (戻り値 undefined)。値を返したいなら map",
              "find / some / every は条件評価系。find は最初の要素、some は『どれか true』、every は『全部 true』",
            ],
          },
          {
            heading: "4.2 Spread (...) と Rest (...) — 同じ記号、違う意味",
            body:
              "`...` は文脈で意味が変わる。**展開** (Spread) は『配列/オブジェクトをばらす』、**集約** (Rest) は『複数を 1 つの配列にまとめる』。関数引数の前後で見分ける癖を付ける。",
            code:
              "// Spread: 配列を展開\nconst a = [1, 2, 3];\nconst b = [...a, 4, 5];           // [1, 2, 3, 4, 5]\nconsole.log(Math.max(...a));      // 3 (関数呼び出しに展開)\n\n// オブジェクトの Spread (シャローコピー + 上書き)\nconst u = { name: 'Alice', age: 20 };\nconst v = { ...u, age: 21 };       // { name: 'Alice', age: 21 }\n\n// Rest: 残り引数を配列にまとめる\nfunction sum(first, ...rest) {\n  return first + rest.reduce((a, b) => a + b, 0);\n}\nsum(1, 2, 3, 4);                   // 10\n\n// 分割代入の Rest\nconst [head, ...tail] = [1, 2, 3, 4];\n// head = 1, tail = [2, 3, 4]",
            language: "javascript",
            notes: [
              "Spread は浅いコピーのみ。ネストオブジェクトは参照を共有する (深いコピーは structuredClone)",
              "Rest 引数は最後でしか使えない (function f(...rest, last) は構文エラー)",
            ],
          },
          {
            heading: "4.3 for...of / for...in / forEach の使い分け",
            body:
              "`for...of` は **値** を順に取り出す (配列・Map・Set・Generator など Iterable に使う)。`for...in` は **キー (プロパティ名)** を返す (主にオブジェクト用)。`forEach` は配列専用で副作用向き。配列処理では原則 `for...of` か関数型メソッド (map/filter/reduce) を使う。",
            code:
              "const arr = ['a', 'b', 'c'];\n\nfor (const value of arr) {\n  console.log(value);              // 'a', 'b', 'c'\n}\n\n// インデックスも欲しいなら entries()\nfor (const [i, value] of arr.entries()) {\n  console.log(i, value);            // 0 'a', 1 'b', ...\n}\n\nconst obj = { name: 'Alice', age: 20 };\nfor (const key in obj) {\n  console.log(key, obj[key]);       // name Alice, age 20\n}\n\n// Object のキー/値を扱う関数型 API\nObject.keys(obj);                   // ['name', 'age']\nObject.values(obj);                 // ['Alice', 20]\nObject.entries(obj);                // [['name', 'Alice'], ['age', 20]]",
            language: "javascript",
            notes: [
              "for...in は配列にも使えるが、prototype のプロパティも列挙して罠が多いので避ける",
              "非同期 for...await...of で async iterable を順に await できる",
            ],
          },
        ],
        keyTakeaways: [
          "map / filter / reduce で宣言的に書く。for ループに頼らない",
          "Spread / Rest は同じ ... でも『展開』『集約』の役割が逆。文脈で読む",
          "値を回すなら for...of。キーが欲しいなら Object.entries。配列の for...in は罠",
        ],
        comprehensionQuestionIds: ["js-007", "js-011"],
      },
      {
        id: "objects-and-classes",
        title: "5. オブジェクトとクラス — リテラルから class 構文 + プロトタイプ",
        intro:
          "JS のオブジェクトリテラル、class 構文、プロトタイプチェーン、継承の整理。Ruby のクラスとの違いも対比。",
        readingMinutes: 8,
        objectives: [
          "オブジェクトリテラルとクラス構文の関係を理解する",
          "プロトタイプチェーンが『継承の正体』であることを説明できる",
          "extends / super / static / private (#) の使い方を区別できる",
        ],
        references: [
          {
            label: "MDN: クラス (Classes)",
            url: "https://developer.mozilla.org/ja/docs/Web/JavaScript/Reference/Classes",
          },
          {
            label: "MDN: 継承とプロトタイプチェーン",
            url: "https://developer.mozilla.org/ja/docs/Web/JavaScript/Inheritance_and_the_prototype_chain",
          },
        ],
        sections: [
          {
            heading: "5.1 オブジェクトリテラル — 軽量な値の入れ物",
            body:
              "JS は『オブジェクトは Hash みたいなもの』で、リテラルが軽量。プロパティの短縮構文、計算プロパティ名、メソッド短縮形などモダン JS の便利機能が揃う。",
            code:
              "// プロパティ短縮 (変数名と同じならキー省略)\nconst name = 'Alice';\nconst age = 20;\nconst user = { name, age };\n// = { name: name, age: age }\n\n// メソッド短縮\nconst api = {\n  url: 'https://example.com',\n  fetch() {        // function キーワード省略\n    return fetch(this.url);\n  },\n};\n\n// 計算プロパティ名\nconst key = 'role';\nconst data = { [key]: 'admin', [`${key}Id`]: 1 };\n// { role: 'admin', roleId: 1 }\n\n// 分割代入で取り出し\nconst { name: userName, age: userAge = 0 } = user;\n// userName = 'Alice', userAge = 20",
            language: "javascript",
            notes: [
              "オブジェクトリテラル `{}` は『新しいオブジェクトを毎回作る』。useMemo などで参照同一性が重要な React の文脈で罠になる",
              "分割代入のデフォルト値 (`age = 0`) は値が undefined のときだけ発動。null には反応しない",
            ],
          },
          {
            heading: "5.2 class 構文 — シンタックスシュガーだが読みやすい",
            body:
              "ES2015 で導入された class は『プロトタイプベースの継承』の上に乗ったシンタックスシュガー。Ruby の class とは違い『内部はプロトタイプチェーン』。new で呼ぶ際に constructor が走る。",
            code:
              "class Animal {\n  static species = 'Animalia';  // クラスプロパティ\n  #secret;                       // プライベートフィールド (ES2022+)\n\n  constructor(name) {\n    this.name = name;\n    this.#secret = 'hidden';\n  }\n\n  greet() {\n    return `Hi, I'm ${this.name}`;\n  }\n\n  get displayName() {            // getter\n    return this.name.toUpperCase();\n  }\n}\n\nclass Dog extends Animal {\n  constructor(name, breed) {\n    super(name);                 // 親 constructor を必ず呼ぶ\n    this.breed = breed;\n  }\n\n  greet() {\n    return `${super.greet()} (wan)`;\n  }\n}\n\nconst d = new Dog('Pochi', 'Shiba');\nd.greet();         // 'Hi, I'm Pochi (wan)'\nd.displayName;     // 'POCHI'\nAnimal.species;    // 'Animalia'",
            language: "javascript",
            notes: [
              "`#field` は本物の private (ES2022+)。`_field` の慣習より厳密で、外からアクセスすると SyntaxError",
              "extends 後の constructor では `super(...)` を呼ぶ前に this を使うと ReferenceError",
            ],
          },
          {
            heading: "5.3 プロトタイプチェーン — JS の継承の正体",
            body:
              "class は内部的に『関数 + prototype オブジェクト + チェーン』。`d.greet()` は『d 自身に greet が無ければ d.__proto__ (= Dog.prototype) を見る → 無ければさらに上 (Animal.prototype)』と辿る。`Object.getPrototypeOf` で確認できる。",
            code:
              "Object.getPrototypeOf(d) === Dog.prototype;        // true\nObject.getPrototypeOf(Dog.prototype) === Animal.prototype; // true\nObject.getPrototypeOf(Animal.prototype) === Object.prototype; // true\n\n// instanceof はチェーンを上に辿って判定\nd instanceof Dog;       // true\nd instanceof Animal;    // true\nd instanceof Object;    // true\n\n// Ruby の ancestors 相当 (チェーンを配列化する自前関数)\nfunction ancestors(obj) {\n  const chain = [];\n  let cur = obj;\n  while (cur) {\n    chain.push(cur);\n    cur = Object.getPrototypeOf(cur);\n  }\n  return chain;\n}",
            language: "javascript",
            notes: [
              "プロトタイプを動的に書き換える `Object.setPrototypeOf` は遅いので推奨されない。クラス継承で十分",
              "TypeScript の `interface` / Java の `interface` のような『純粋な型契約』は JS には無い。Duck Typing",
            ],
          },
        ],
        keyTakeaways: [
          "オブジェクトリテラルは軽量。短縮プロパティ・計算キー・分割代入を活用",
          "class はシンタックスシュガー。中身はプロトタイプチェーン",
          "#field は本物の private。_field の慣習よりも安全",
        ],
        comprehensionQuestionIds: ["js-004", "js-011"],
      },
      {
        id: "modules-esm",
        title: "6. モジュール — ESM (import / export) と CommonJS",
        intro:
          "標準 ESM の import / export、CommonJS との互換、tree shaking、Node.js / ブラウザでの取り扱いの違いを整理。",
        readingMinutes: 7,
        objectives: [
          "named export / default export の使い分けを判断できる",
          "ESM と CommonJS の本質的な違いと相互運用を理解する",
          "tree shaking が効く / 効かない条件を知る",
        ],
        references: [
          {
            label: "MDN: JavaScript モジュール",
            url: "https://developer.mozilla.org/ja/docs/Web/JavaScript/Guide/Modules",
          },
          {
            label: "Node.js: ECMAScript Modules",
            url: "https://nodejs.org/api/esm.html",
          },
        ],
        sections: [
          {
            heading: "6.1 ESM の基本 — export と import",
            body:
              "`export` で公開するシンボルを宣言、`import` で取り込む。**named export** は名前そのままインポート、**default export** は import 名を自由に付けられる (1 ファイル 1 つまで)。チーム規約として『named を基本、default は控えめに』が今のトレンド。",
            code:
              "// math.js (export 側)\nexport const PI = 3.14;\nexport function add(a, b) { return a + b; }\nexport default function multiply(a, b) { return a * b; }\n\n// app.js (import 側)\nimport multiply, { PI, add } from './math.js';\n// default import (multiply) と named import を同時に\n\n// rename しながら named import\nimport { add as addNumbers } from './math.js';\n\n// すべて取り込む (空間オブジェクト)\nimport * as math from './math.js';\nmath.PI; math.add(1, 2);",
            language: "javascript",
            notes: [
              "named export はリファクタリングしやすい (リネームしたら import 側もエラーで気付く)",
              "default export はライブラリのトップレベル API などごく一部に限定",
            ],
          },
          {
            heading: "6.2 ESM と CommonJS — 同居の現実",
            body:
              "Node.js の歴史的経緯で `require / module.exports` の CommonJS と、標準 `import / export` の ESM が共存している。`package.json` の `\"type\": \"module\"` で ESM 扱い、ファイル拡張子 `.mjs` / `.cjs` でも切り替え可能。**ESM は同期 require できない**、**ESM から CommonJS を default import で読める** といった互換ルールがある。",
            code:
              "// CommonJS (Node.js の歴史的形式)\n// math.cjs\nfunction add(a, b) { return a + b; }\nmodule.exports = { add };\n\n// ESM 側で読む (default として読める)\nimport math from './math.cjs';\nmath.add(1, 2);\n\n// package.json\n// {\n//   \"type\": \"module\",  // .js を ESM 扱い\n//   ...\n// }",
            language: "javascript",
            notes: [
              "新規プロジェクトは ESM 推奨。フロントエンドのバンドラ (Vite/webpack) も ESM 中心",
              "ESM では __dirname / __filename が無い。`import.meta.url` から path を導出する",
            ],
          },
          {
            heading: "6.3 Tree Shaking — 使わない export を捨てる",
            body:
              "バンドラ (webpack / Rollup / esbuild) はビルド時に『import されていない export』を削って配信サイズを減らす。これが **tree shaking**。効くためには ESM の静的 import (`import { foo } from '...'`) が必要。CommonJS や動的 import は対象外。",
            code:
              "// utils.js\nexport function used() { /* ... */ }\nexport function unused() { /* ... */ }   // tree shaking で削除される\n\n// app.js\nimport { used } from './utils.js';\nused();\n// → ビルド後の bundle には used だけが含まれる",
            language: "javascript",
            notes: [
              "tree shaking は『副作用が無い』前提。グローバル変数を書き換える import は削られない",
              "package.json の \"sideEffects\": false を宣言すると tree shaking がより積極的に",
            ],
          },
        ],
        keyTakeaways: [
          "named export を基本、default export は控えめに。リファクタリングで気付ける",
          "ESM と CommonJS の境界 (.mjs / .cjs / type: module) を意識する",
          "Tree shaking は ESM の静的 import 限定。動的 import や CommonJS では効かない",
        ],
        comprehensionQuestionIds: [],
      },
      {
        id: "typescript-bridge",
        title: "7. TypeScript への橋渡し — 型注釈の最初の一歩",
        intro:
          "JS の延長線として TS を理解する。型注釈 / interface / type / Generics の入り口、tsconfig.json の strict、any との付き合い方。",
        readingMinutes: 8,
        objectives: [
          "プリミティブ型・配列・オブジェクト・関数の型注釈を書ける",
          "interface と type の使い分けを判断できる",
          "Generics の基本構文を読み書きできる",
          "any / unknown / never の違いを理解する",
        ],
        references: [
          {
            label: "TypeScript 公式 (Handbook)",
            url: "https://www.typescriptlang.org/docs/handbook/intro.html",
          },
          {
            label: "TypeScript: 5 分で始める",
            url: "https://www.typescriptlang.org/docs/handbook/typescript-in-5-minutes.html",
          },
        ],
        sections: [
          {
            heading: "7.1 型注釈の基本",
            body:
              "TS は『JS にコンパイル時の型チェックを足した拡張』。実行時には型情報が消える (zero runtime)。変数・関数引数・戻り値に型注釈を書くと、IDE 補完とエラー検出が劇的に改善する。",
            code:
              "// プリミティブ\nconst name: string = 'Alice';\nconst age: number = 20;\nconst active: boolean = true;\n\n// 配列\nconst tags: string[] = ['ruby', 'rails'];\nconst nums: Array<number> = [1, 2, 3];   // 同義\n\n// オブジェクト (inline)\nconst user: { name: string; age: number } = { name: 'A', age: 20 };\n\n// 関数\nfunction greet(name: string, greeting = 'Hi'): string {\n  return `${greeting}, ${name}`;\n}\n\n// アロー関数\nconst add = (a: number, b: number): number => a + b;",
            language: "typescript",
            notes: [
              "戻り値の型注釈は省略可 (推論される) だが、公開 API では明示すると壊れにくい",
              "`tsconfig.json` の `\"strict\": true` を必ず有効にする。半端な型は意味が薄い",
            ],
          },
          {
            heading: "7.2 interface vs type — 似ているが微妙に違う",
            body:
              "**interface**: オブジェクトの形を宣言。同名で複数回宣言すると **マージ** される (declaration merging)。\n**type**: 型エイリアス。Union (`A | B`) / Intersection (`A & B`) / Mapped Type など複雑な型表現が可能。\n単純なオブジェクトは interface、Union や複雑な型は type、と使い分ける流派が多い。",
            code:
              "// interface (オブジェクトの形)\ninterface User {\n  name: string;\n  age: number;\n}\ninterface User {       // 同名で追加 (declaration merging)\n  email: string;\n}\n// User は { name, age, email } になる\n\n// type (より柔軟)\ntype Status = 'draft' | 'published' | 'archived';   // Union\ntype Identifier = string | number;\ntype Reader = User & { canRead: true };               // Intersection\n\n// 関数型\ntype Handler = (event: Event) => void;",
            language: "typescript",
            notes: [
              "ライブラリ API の拡張ポイントには interface が向く (利用者がマージ可能)",
              "純粋な値オブジェクトには type の方が見やすい",
            ],
          },
          {
            heading: "7.3 Generics と any / unknown / never",
            body:
              "**Generics** は『型をパラメータ化』する。`Array<T>`, `Map<K, V>` などコンテナで多用。**any** は『型チェックを諦める』脱出口、**unknown** は『安全な any』(使う前に型ガードが必要)、**never** は『絶対に起きない型』。any を多用すると TS の意味が無くなるので、まず unknown を試す。",
            code:
              "// Generics: 汎用関数\nfunction first<T>(arr: T[]): T | undefined {\n  return arr[0];\n}\nfirst<number>([1, 2, 3]);          // number | undefined\nfirst(['a', 'b']);                  // 推論で string | undefined\n\n// Generics: 制約付き\nfunction pluck<T, K extends keyof T>(obj: T, key: K): T[K] {\n  return obj[key];\n}\npluck({ name: 'Alice' }, 'name');   // string\n\n// unknown は安全な any\nfunction parse(input: unknown): string {\n  if (typeof input === 'string') return input;\n  if (typeof input === 'number') return input.toString();\n  throw new Error('invalid');\n}\n\n// never (絶対に起きない)\nfunction fail(msg: string): never {\n  throw new Error(msg);\n}",
            language: "typescript",
            notes: [
              "any を書くたびに 1 杯コーヒーを我慢する、くらいの覚悟で。unknown + 型ガードを習慣に",
              "Generics の `extends` は『継承』ではなく『部分集合の制約』。`<T extends string>` は『T は string の部分集合』",
            ],
          },
        ],
        keyTakeaways: [
          "TS は JS の延長。型は実行時に消える (zero runtime cost)",
          "strict: true を必ず有効化。半端な型では意味が薄い",
          "any は最終手段。まず unknown + 型ガードを試す",
        ],
        comprehensionQuestionIds: [],
      },
    ],
  },

  // ---------- TypeScript 入門ガイド ----------
  {
    id: "typescript-intro",
    trackId: "typescript",
    title: "TypeScript の地図 — 型で守る JavaScript",
    subtitle:
      "TS 公式 Handbook のエッセンスを 7 章に。tsconfig と strict → 型システム → 関数とジェネリクス → オブジェクト型操作 → 型ガード → 非同期 → React/Next 連携",
    audience:
      "JavaScript は書けるが TypeScript は雰囲気で書いている人、型システムを体系的に学びたい人",
    sources: [
      { label: "TypeScript Handbook (公式)", url: "https://www.typescriptlang.org/docs/handbook/intro.html" },
      { label: "TypeScript Cheat Sheets", url: "https://www.typescriptlang.org/cheatsheets" },
      { label: "Total TypeScript (Matt Pocock)", url: "https://www.totaltypescript.com/" },
    ],
    emoji: "🔷",
    relatedCategoryIds: ["ts-basics"],
    chapters: [
      {
        id: "tsconfig-and-strict",
        title: "1. tsconfig と strict — 型の効き目を最大化する",
        intro:
          "TypeScript を始める最初の一歩は『どんな型チェックを ON にするか』。strict を有効にしないと TS の旨味は半減する。",
        readingMinutes: 7,
        objectives: [
          "tsconfig.json の主要オプションを説明できる",
          "strict / noUncheckedIndexedAccess / exactOptionalPropertyTypes の効果を理解する",
          "moduleResolution の bundler / nodenext を使い分けられる",
        ],
        references: [
          { label: "TSConfig Reference", url: "https://www.typescriptlang.org/tsconfig" },
        ],
        sections: [
          {
            heading: "1.1 strict: true から始める",
            body: "新規プロジェクトは必ず `strict: true` で始める。これは複数の厳格チェック (strictNullChecks / noImplicitAny / strictFunctionTypes 等) を一括 ON にする糖衣。strict が無効だと『null / undefined が全型に暗黙に含まれる』『型注釈忘れが any になる』など、実行時にしか気づけないバグの温床になる。",
            code: "// tsconfig.json (推奨)\n{\n  \"compilerOptions\": {\n    \"target\": \"ES2022\",\n    \"module\": \"ESNext\",\n    \"moduleResolution\": \"bundler\",\n    \"strict\": true,\n    \"noUncheckedIndexedAccess\": true,\n    \"exactOptionalPropertyTypes\": true,\n    \"noImplicitReturns\": true,\n    \"esModuleInterop\": true,\n    \"skipLibCheck\": true,\n    \"resolveJsonModule\": true,\n    \"jsx\": \"preserve\"\n  },\n  \"include\": [\"src/**/*\"]\n}",
            language: "json",
            notes: [
              "既存プロジェクトを段階的に strict 化するなら `strict: false` から個別フラグを 1 つずつ ON",
              "skipLibCheck: true は node_modules の .d.ts を再チェックしない (高速化)",
            ],
          },
          {
            heading: "1.2 noUncheckedIndexedAccess の効果",
            body: "配列やオブジェクトのインデックスアクセスを `T | undefined` にする。`arr[0]` が必ずあるとは限らない事実をコンパイラに認識させる。最初は煩わしいが、Map / Record / 配列アクセスの安全性が劇的に上がる。",
            code: "// noUncheckedIndexedAccess: false (デフォルト)\nconst arr: number[] = []\nconst x = arr[0]      // 型: number (実際は undefined だが嘘)\nx.toFixed(2)          // ランタイムエラー: Cannot read properties of undefined\n\n// noUncheckedIndexedAccess: true (推奨)\nconst x2 = arr[0]     // 型: number | undefined\nx2.toFixed(2)         // Error: x2 is possibly 'undefined'\nx2?.toFixed(2)        // OK\n\n// Record でも効く\nconst dict: Record<string, string> = {}\nconst v = dict['key'] // 型: string | undefined",
            language: "typescript",
          },
          {
            heading: "1.3 module と moduleResolution",
            body: "TS 5.0+ では `moduleResolution: 'bundler'` (Vite / Next.js / esbuild など) または `'nodenext'` (純 Node.js) が現代の標準。古い `node` / `classic` は使わない。`bundler` は拡張子省略・JSON import などバンドラ機能と整合する。",
            code: "// バンドラ環境 (Vite / Next.js / Remix / Astro)\n{\n  \"compilerOptions\": {\n    \"target\": \"ES2022\",\n    \"module\": \"ESNext\",\n    \"moduleResolution\": \"bundler\",\n    \"strict\": true,\n    \"jsx\": \"preserve\"\n  }\n}\n\n// 純粋な Node.js (CLI / ライブラリ)\n{\n  \"compilerOptions\": {\n    \"target\": \"ES2022\",\n    \"module\": \"NodeNext\",\n    \"moduleResolution\": \"NodeNext\",\n    \"strict\": true,\n    \"outDir\": \"dist\"\n  }\n}",
            language: "json",
            notes: [
              "bundler は .ts ファイルから `import './foo'` (拡張子省略) が許される",
              "nodenext は ESM/CJS 解決ルールに厳密に従う (拡張子 .js 必須など)",
            ],
          },
        ],
        keyTakeaways: [
          "strict: true は議論の余地なし。これが TS の前提",
          "noUncheckedIndexedAccess で配列/Record アクセスの罠を消す",
          "moduleResolution は bundler (フロント) か nodenext (Node) の二択",
        ],
        comprehensionQuestionIds: ["ts-011", "ts-020"],
      },
      {
        id: "type-system-basics",
        title: "2. 型システムの基礎 — primitive・union・literal・interface vs type",
        intro:
          "TS の型は構造的部分型 (structural typing)。形が合えば代入可。union/literal/intersection を使いこなすと表現力が一気に上がる。",
        readingMinutes: 8,
        objectives: [
          "primitive / object / array / tuple の型注釈を書ける",
          "union / intersection / literal type を使い分けられる",
          "interface と type alias の違いと使い分けを理解する",
        ],
        sections: [
          {
            heading: "2.1 基本の型注釈",
            body: "TS の型は値の後ろに `: Type` で書く (ML 系構文)。プリミティブは小文字 (`number` / `string` / `boolean` / `null` / `undefined` / `bigint` / `symbol`)。Number / String (大文字、ラッパオブジェクト) は使わない。",
            code: "// プリミティブ\nlet n: number = 1\nlet s: string = 'hi'\nlet b: boolean = true\nlet u: undefined = undefined\nlet x: null = null\n\n// 配列\nlet arr: number[] = [1, 2, 3]\nlet arr2: Array<number> = [1, 2, 3]   // 同等\n\n// タプル (長さと位置で型を固定)\nlet pair: [string, number] = ['A', 30]\nlet rgb: [number, number, number] = [255, 0, 0]\n\n// オブジェクト\nlet user: { name: string; age: number } = { name: 'A', age: 30 }\n\n// 関数\nconst add = (a: number, b: number): number => a + b\ntype Handler = (event: Event) => void",
            language: "typescript",
            notes: [
              "プリミティブは小文字。Number / String は使わない (オブジェクトラッパで意味が違う)",
              "戻り値の型は公開関数では明示推奨 (推論で勝手に変わるのを防ぐ)",
            ],
          },
          {
            heading: "2.2 union / intersection / literal",
            body: "`A | B` で union (どちらか)、`A & B` で intersection (両方)、リテラル値そのものを型にすると literal type。Literal Union で『取りうる値』を絞り込むのが TS の真骨頂。",
            code: "// Literal Type + Union\ntype Color = 'red' | 'green' | 'blue'\nlet c: Color = 'red'\nc = 'yellow'              // Error: 'yellow' is not assignable\n\n// Union\ntype ID = string | number\nfunction find(id: ID) { /* ... */ }\n\n// Intersection (両方の型を持つ)\ntype Named = { name: string }\ntype Aged = { age: number }\ntype Person = Named & Aged   // { name: string; age: number }\n\n// Discriminated Union (パターンマッチの基盤)\ntype Shape =\n  | { kind: 'circle'; r: number }\n  | { kind: 'rect'; w: number; h: number }\n\nfunction area(s: Shape): number {\n  switch (s.kind) {\n    case 'circle': return Math.PI * s.r ** 2\n    case 'rect':   return s.w * s.h\n  }\n}",
            language: "typescript",
          },
          {
            heading: "2.3 interface vs type alias",
            body: "ほぼ同等だが、`interface` は『宣言マージ』ができる (同名で書くと自動合成)。`type` は再定義不可だが union / intersection / 関数型・条件型などあらゆる型を表現できる。実務では『データ構造 = interface、union や utility = type』、または『常に type で統一』の二派が一般的。",
            code: "// interface (宣言マージ可、拡張に向く)\ninterface User { name: string }\ninterface User { age: number }   // OK、マージされる\n// User = { name: string; age: number }\n\ninterface Admin extends User { role: string }\n\n// type (再定義不可、表現力高い)\ntype Result<T> = { ok: true; value: T } | { ok: false; error: Error }\ntype Handler<T> = (event: T) => void\ntype Combined = Named & Aged\n\n// 同名再定義\ntype X = { a: number }\ntype X = { b: number }           // Error: Duplicate identifier",
            language: "typescript",
            notes: [
              "ライブラリの公開 API は『拡張されること』を見越して interface が好まれる傾向",
              "アプリケーション内の型はどちらでも OK。プロジェクトで統一する",
            ],
          },
          {
            heading: "2.4 optional / readonly / index signature",
            body: "`?` でオプショナル (省略可)、`readonly` で読み取り専用、`[k: string]: V` でインデックスシグネチャ。",
            code: "type User = {\n  readonly id: number      // 読み取り専用\n  name: string             // 必須\n  age?: number             // optional (省略可、または number)\n  email?: string\n}\n\nconst u: User = { id: 1, name: 'A' }   // age, email 省略 OK\nu.id = 2                                 // Error: readonly\n\n// Index Signature\ntype Dict = { [key: string]: number }\nconst d: Dict = { a: 1, b: 2 }\n\n// Record でも同等 (推奨)\ntype Dict2 = Record<string, number>",
            language: "typescript",
          },
        ],
        keyTakeaways: [
          "型は構造的 — 形が合えば代入可",
          "Literal Union と Discriminated Union が TS 表現力の中心",
          "interface vs type は宣言マージの有無が主な違い、混在を避けて統一",
        ],
        comprehensionQuestionIds: ["ts-001", "ts-002", "ts-003", "ts-006"],
      },
      {
        id: "functions-and-generics",
        title: "3. 関数とジェネリクス — 型変数で再利用性を獲得",
        intro:
          "関数の型注釈、オーバーロード、ジェネリクス (型変数) を押さえる。ジェネリクスは Array<T> / Promise<T> / React.Component<Props> と頻出。",
        readingMinutes: 9,
        objectives: [
          "関数型 / アロー関数 / 戻り値の型注釈を書ける",
          "ジェネリクス `<T>` の宣言と推論を理解する",
          "`T extends ...` で制約をつけられる",
        ],
        sections: [
          {
            heading: "3.1 関数の型注釈と推論",
            body: "関数の引数は必ず型注釈が必要 (strict 下では暗黙 any 不可)。戻り値は推論されるが、公開 API では明示推奨 (リファクタで気づかず型が変わるのを防ぐ)。",
            code: "// function 宣言\nfunction add(a: number, b: number): number {\n  return a + b\n}\n\n// アロー\nconst sub = (a: number, b: number): number => a - b\n\n// 内部関数は戻り値の推論で OK\nconst double = (n: number) => n * 2   // 推論: number\n\n// 関数型エイリアス\ntype BinaryOp = (a: number, b: number) => number\nconst mul: BinaryOp = (a, b) => a * b   // 引数の型は推論される\n\n// optional / default\nfunction greet(name: string, greeting?: string) {\n  return `${greeting ?? 'Hello'}, ${name}`\n}\nfunction greet2(name: string, greeting = 'Hello') {   // デフォルトで optional\n  return `${greeting}, ${name}`\n}",
            language: "typescript",
          },
          {
            heading: "3.2 ジェネリクスの基本",
            body: "`<T>` で型変数を宣言し、呼び出し時に推論される。`Array<T>` / `Promise<T>` / `Map<K, V>` は全部ジェネリクス。再利用性と型安全を両立するための核心機能。",
            code: "function identity<T>(x: T): T {\n  return x\n}\n\nidentity('hello')   // T = string、戻り値 string\nidentity(42)        // T = number、戻り値 number\nidentity<string>('explicit')   // 明示的に T 指定\n\n// 配列の先頭\nfunction first<T>(arr: T[]): T | undefined {\n  return arr[0]\n}\n\nfirst([1, 2, 3])    // T = number、戻り値 number | undefined\nfirst(['a', 'b'])   // T = string\nfirst([])           // T = never → 戻り値 undefined\n\n// 複数の型変数\nfunction pair<A, B>(a: A, b: B): [A, B] {\n  return [a, b]\n}\npair('A', 30)       // [string, number]",
            language: "typescript",
          },
          {
            heading: "3.3 制約付きジェネリクス (T extends ...)",
            body: "`T extends 何らかの型` で型変数に制約を付けられる。『length プロパティを持つ型』『key を持つ型』など、抽象的なシグネチャを書く時に必須。",
            code: "// length を持つ型に限定\nfunction longest<T extends { length: number }>(a: T, b: T): T {\n  return a.length >= b.length ? a : b\n}\n\nlongest('hello', 'hi')        // string OK\nlongest([1, 2], [3, 4, 5])    // 配列 OK\nlongest(42, 99)                // Error: number に length 無し\n\n// keyof でキー制約\nfunction getProp<T, K extends keyof T>(obj: T, key: K): T[K] {\n  return obj[key]\n}\n\nconst u = { name: 'A', age: 30 }\ngetProp(u, 'name')   // 戻り値: string\ngetProp(u, 'age')    // 戻り値: number\ngetProp(u, 'xxx')    // Error: 'xxx' は keyof U に含まれない",
            language: "typescript",
            notes: [
              "ジェネリクス引数が 1 つだけ使われるなら型変数化する必要はない (普通の引数で OK)",
              "T = SomeDefault で『デフォルト型変数』も書ける: `function fn<T = string>(x: T)`",
            ],
          },
        ],
        keyTakeaways: [
          "関数の引数は必ず型注釈、戻り値は公開 API のみ明示",
          "ジェネリクスは型変数。呼び出しごとに推論される",
          "`T extends ...` で制約。keyof と組み合わせると安全な動的アクセスが書ける",
        ],
        comprehensionQuestionIds: ["ts-004", "ts-010"],
      },
      {
        id: "object-and-type-ops",
        title: "4. オブジェクト型操作 — keyof / typeof / Mapped / Conditional / Utility",
        intro:
          "型を派生させる演算子群。`typeof` / `keyof` / `T[K]` / Mapped / Conditional / Utility Types を使うと、データ定義を 1 つ書くだけで派生型を自動生成できる。",
        readingMinutes: 10,
        objectives: [
          "`typeof` / `keyof` / `T[K]` で型を取り出せる",
          "Mapped Type の構文 `{ [K in keyof T]: ... }` を書ける",
          "Pick / Omit / Partial / Required / Readonly / Record の使い所を理解する",
        ],
        references: [
          { label: "Utility Types (公式)", url: "https://www.typescriptlang.org/docs/handbook/utility-types.html" },
        ],
        sections: [
          {
            heading: "4.1 typeof / keyof / T[K]",
            body: "`typeof x` で値から型を取り出す。`keyof T` で T のキーをユニオン型化。`T[K]` でインデックスアクセス型。`as const` と組み合わせると、ランタイムの値と型をぴったり同期できる。",
            code: "const config = { host: 'localhost', port: 3000 } as const\ntype Config = typeof config\n// { readonly host: 'localhost'; readonly port: 3000 }\n\ntype K = keyof Config           // 'host' | 'port'\ntype Host = Config['host']      // 'localhost'\ntype V = Config[keyof Config]   // 'localhost' | 3000\n\n// 関数の解析\nfunction fetchUser(id: number) {\n  return Promise.resolve({ name: 'A', age: 30 })\n}\ntype Args = Parameters<typeof fetchUser>    // [number]\ntype Ret = ReturnType<typeof fetchUser>     // Promise<{ name: string; age: number }>\ntype User = Awaited<Ret>                     // { name: string; age: number }\n\n// 配列要素\nconst arr = [1, 'a', true] as const\ntype Elem = typeof arr[number]   // 1 | 'a' | true",
            language: "typescript",
            notes: [
              "`as const` でリテラル化 (再代入不可 + 値もそのまま型に)",
              "`typeof x[number]` で配列の要素型を取り出すイディオム",
            ],
          },
          {
            heading: "4.2 Utility Types (Pick / Omit / Partial / Required / Readonly / Record)",
            body: "頻出ユーティリティ型。Form 用、API DTO 用などで型派生に多用する。一箇所で定義 → そこから派生で『変更時に追従が楽』。",
            code: "type User = {\n  id: number\n  name: string\n  email: string\n  password: string\n}\n\ntype PublicUser = Omit<User, 'password'>             // パスワード除外\ntype LoginInput = Pick<User, 'email' | 'password'>   // 抽出\ntype CreateUserInput = Omit<User, 'id'>              // POST 用 (id は自動採番)\ntype PartialUser = Partial<User>                     // 全 optional (PATCH 用)\ntype RequiredUser = Required<PartialUser>            // 全必須に戻す\ntype ReadonlyUser = Readonly<User>                   // 全 readonly\n\ntype Dict = Record<string, number>                   // { [k: string]: number }\ntype StatusMap = Record<'draft' | 'published', User[]>",
            language: "typescript",
          },
          {
            heading: "4.3 Mapped Type",
            body: "`{ [K in keyof T]: ... }` で T のキーを反復して新しい型を構築。Utility Types の多くがこれで実装されている。`?` / `readonly` の追加 (+) / 削除 (-) も書ける。",
            code: "// 自作 Partial (公式実装と同じ)\ntype MyPartial<T> = { [K in keyof T]?: T[K] }\n\n// 自作 Required (optional を剥がす)\ntype MyRequired<T> = { [K in keyof T]-?: T[K] }\n\n// 自作 Readonly\ntype MyReadonly<T> = { readonly [K in keyof T]: T[K] }\n\n// 値だけ別の型に変換\ntype Stringified<T> = { [K in keyof T]: string }\ntype S = Stringified<{ a: number; b: boolean }>\n// { a: string; b: string }\n\n// キーの rename (as 句)\ntype Getters<T> = { [K in keyof T as `get${Capitalize<K & string>}`]: () => T[K] }\ntype G = Getters<{ name: string; age: number }>\n// { getName: () => string; getAge: () => number }",
            language: "typescript",
          },
          {
            heading: "4.4 Conditional Type と infer",
            body: "`T extends U ? X : Y` で条件分岐。`infer` で型変数を捕捉できる。`ReturnType` / `Parameters` / `Awaited` などはこれで実装。Union に対しては『分配 (Distribute)』される。",
            code: "// 基本\ntype IsString<T> = T extends string ? true : false\ntype A = IsString<'hi'>          // true\ntype B = IsString<42>            // false\n\n// infer で戻り値型を抽出\ntype MyReturnType<F> = F extends (...args: any) => infer R ? R : never\ntype R = MyReturnType<() => Promise<string>>   // Promise<string>\n\n// 配列要素\ntype Elem<A> = A extends (infer T)[] ? T : never\ntype E = Elem<string[]>          // string\n\n// Distribute over Union (T が union だと各要素に分配)\ntype ToArray<T> = T extends any ? T[] : never\ntype X = ToArray<string | number>   // string[] | number[]\n\n// Template Literal Type (TS 4.1+)\ntype EventName<T extends string> = `on${Capitalize<T>}`\ntype EN = EventName<'click'>     // 'onClick'",
            language: "typescript",
            notes: [
              "Distribute を抑止したい時は `[T] extends [U]` のようにタプルで包む",
              "Conditional Type を多用するとコンパイル時間が悪化することがある — 適度に",
            ],
          },
        ],
        keyTakeaways: [
          "型は『値や別の型から派生』させる — typeof / keyof / T[K] が基本",
          "Utility Types (Pick / Omit / Partial / Record) を読めれば公式 .d.ts も読める",
          "Mapped + Conditional + infer で型レベル変換が書ける (TS は Turing 完備)",
        ],
        comprehensionQuestionIds: ["ts-005", "ts-009", "ts-014", "ts-015", "ts-016", "ts-017", "ts-018"],
      },
      {
        id: "narrowing-and-type-guards",
        title: "5. 型ガードと Narrowing — unknown を安全に扱う",
        intro:
          "TS は実行時の型情報を持たない。コード上の判定文 (typeof / instanceof / in / 比較) で型を絞り込む。unknown / never の使い分けも整理。",
        readingMinutes: 8,
        objectives: [
          "typeof / instanceof / in / リテラル比較で narrowing できる",
          "ユーザー定義型ガード `x is T` を書ける",
          "unknown と any の違い、never の使い所を説明できる",
        ],
        sections: [
          {
            heading: "5.1 narrowing の 5 手法",
            body: "Union 型を分岐内で絞り込む。`typeof` (primitive)、`instanceof` (class)、`'key' in obj` (プロパティ存在)、リテラル比較 (Discriminated Union)、ユーザー定義型ガード。",
            code: "// typeof\nfunction process(x: string | number) {\n  if (typeof x === 'string') return x.length    // x: string\n  return x.toFixed(2)                            // x: number\n}\n\n// instanceof\nfunction handle(e: Error | Date) {\n  if (e instanceof Date) return e.getTime()\n  return e.message\n}\n\n// in\nfunction has(obj: { a: number } | { b: number }) {\n  if ('a' in obj) return obj.a\n  return obj.b\n}\n\n// Discriminated Union (kind / tag による分岐)\ntype Shape =\n  | { kind: 'circle'; r: number }\n  | { kind: 'rect'; w: number; h: number }\n\nfunction area(s: Shape): number {\n  switch (s.kind) {\n    case 'circle': return Math.PI * s.r ** 2\n    case 'rect':   return s.w * s.h\n  }\n}",
            language: "typescript",
          },
          {
            heading: "5.2 ユーザー定義型ガード (x is T)",
            body: "`function isFoo(x): x is Foo` の戻り値型を `x is Foo` にすると、true を返した時に呼び出し側で x が Foo に絞り込まれる。外部 JSON / 任意の unknown 値を扱うときに必須。",
            code: "type User = { id: number; name: string }\n\nfunction isUser(x: unknown): x is User {\n  return (\n    typeof x === 'object' &&\n    x !== null &&\n    'id' in x && typeof (x as any).id === 'number' &&\n    'name' in x && typeof (x as any).name === 'string'\n  )\n}\n\nconst data: unknown = JSON.parse('{\"id\":1,\"name\":\"A\"}')\nif (isUser(data)) {\n  data.name   // 型: string\n}\n\n// アサーション関数 (戻り型 asserts x is T)\nfunction assertIsUser(x: unknown): asserts x is User {\n  if (!isUser(x)) throw new Error('not User')\n}\n\nassertIsUser(data)\ndata.name     // 以降は User として扱える",
            language: "typescript",
            notes: [
              "実務では zod / valibot などのスキーマライブラリで自動生成するのが安全",
              "アサーション関数は throw する系の検証で便利",
            ],
          },
          {
            heading: "5.3 unknown と any、never と void",
            body: "`any` は型チェックを完全に無効化する『エスケープハッチ』。本番コードでは避け、まず `unknown` + 型ガードを試す。`never` は『到達不能』、`void` は『戻り値なし』。",
            code: "// any (危険)\nlet a: any = 'hello'\na.foo.bar.baz       // 型チェック無し → 実行時エラー\n\n// unknown (安全)\nlet u: unknown = 'hello'\nu.length            // Error: narrowing 必須\nif (typeof u === 'string') u.length   // OK\n\n// never (絶対値を返さない)\nfunction fail(msg: string): never {\n  throw new Error(msg)\n}\nfunction loop(): never {\n  while (true) {}\n}\n\n// Exhaustiveness Check (網羅性チェック)\ntype Shape = { kind: 'circle' } | { kind: 'rect' }\nfunction area(s: Shape) {\n  switch (s.kind) {\n    case 'circle': return 1\n    case 'rect':   return 2\n    default: {\n      const _exhaustive: never = s   // 新しい kind を追加すると Error\n      throw new Error()\n    }\n  }\n}\n\n// void (戻り値を使わない)\ntype Listener = (e: Event) => void",
            language: "typescript",
          },
        ],
        keyTakeaways: [
          "narrowing は typeof / instanceof / in / リテラル比較 / 型ガードの 5 つ",
          "any は最終手段。まず unknown + 型ガード or zod で守る",
          "never で Exhaustiveness Check (新ケース追加時に必ずコンパイルエラー)",
        ],
        comprehensionQuestionIds: ["ts-007", "ts-008", "ts-012", "ts-013"],
      },
      {
        id: "async-and-promise",
        title: "6. 非同期と Promise の型 — async/await + エラーの型",
        intro:
          "Promise<T> / async 関数 / fetch の戻り型を整理。エラーは catch で unknown になるため、narrowing が必須。",
        readingMinutes: 7,
        objectives: [
          "async 関数の戻り値が必ず Promise になることを理解する",
          "Promise<T> の T を Awaited<T> で取り出せる",
          "catch (e: unknown) の正しい扱い方を書ける",
        ],
        sections: [
          {
            heading: "6.1 async / Promise<T> / Awaited",
            body: "`async function` の戻り値は必ず `Promise<T>`。T は return 値から推論される。`Promise<Promise<T>>` を平坦化したい時は `Awaited<T>` を使う。",
            code: "// async は必ず Promise を返す\nasync function fetchUser(id: number): Promise<User> {\n  const res = await fetch(`/api/user/${id}`)\n  return res.json() as Promise<User>   // 暫定キャスト (本番は zod 検証推奨)\n}\n\ntype User = { id: number; name: string }\n\n// 戻り値の推論 + Awaited\nasync function getId() { return 42 }\ntype R = ReturnType<typeof getId>    // Promise<number>\ntype N = Awaited<R>                   // number\n\n// 複数 await 並列化 (Promise.all)\nasync function loadAll(ids: number[]): Promise<User[]> {\n  return Promise.all(ids.map(fetchUser))\n}\n\n// Promise.allSettled で全件結果を取る\nconst settled = await Promise.allSettled(promises)\nfor (const r of settled) {\n  if (r.status === 'fulfilled') console.log(r.value)\n  else                          console.error(r.reason)\n}",
            language: "typescript",
            notes: [
              "Promise.all は 1 つでも reject すると全体が reject される (fail-fast)",
              "全件最後まで欲しいなら Promise.allSettled",
            ],
          },
          {
            heading: "6.2 catch (e: unknown) の扱い",
            body: "TS 4.4+ では `useUnknownInCatchVariables: true` (strict に含まれる) で catch の e は `unknown` になる。型ガードで Error か判定してから使う。",
            code: "try {\n  await fetchUser(1)\n} catch (e) {\n  // e の型: unknown\n  if (e instanceof Error) {\n    console.error(e.message)\n  } else {\n    console.error('unknown error', e)\n  }\n}\n\n// よくあるヘルパ\nfunction getErrorMessage(e: unknown): string {\n  if (e instanceof Error) return e.message\n  if (typeof e === 'string') return e\n  try { return JSON.stringify(e) } catch { return String(e) }\n}\n\n// throw する型は any (TS では throw に型は付かない)\n// 慣習: Error を継承したクラスを投げる\nclass NotFoundError extends Error {\n  constructor(public resource: string) {\n    super(`${resource} not found`)\n    this.name = 'NotFoundError'\n  }\n}\n\ntry {\n  throw new NotFoundError('User')\n} catch (e) {\n  if (e instanceof NotFoundError) console.error(e.resource)\n}",
            language: "typescript",
          },
          {
            heading: "6.3 fetch + zod で型安全な API クライアント",
            body: "fetch の戻り (`res.json()` は `any`) を直接信じない。zod でスキーマ検証してから型を取り出すのが現代の定番パターン。",
            code: "import { z } from 'zod'\n\nconst UserSchema = z.object({\n  id: z.number(),\n  name: z.string(),\n  email: z.string().email(),\n})\n\ntype User = z.infer<typeof UserSchema>\n// { id: number; name: string; email: string }\n\nasync function fetchUser(id: number): Promise<User> {\n  const res = await fetch(`/api/user/${id}`)\n  if (!res.ok) throw new Error(`HTTP ${res.status}`)\n  const json = await res.json()\n  return UserSchema.parse(json)   // 失敗で ZodError\n}\n\n// safeParse で例外を投げないバージョン\nasync function fetchUserSafe(id: number) {\n  const res = await fetch(`/api/user/${id}`)\n  const json = await res.json()\n  const r = UserSchema.safeParse(json)\n  return r.success ? { ok: true, user: r.data } as const\n                   : { ok: false, error: r.error } as const\n}",
            language: "typescript",
            notes: [
              "zod は TS-first。joi / yup よりも型推論が強力で現代の第一候補",
              "Next.js / tRPC / React Hook Form など主要ライブラリと連携多数",
            ],
          },
        ],
        keyTakeaways: [
          "async 関数の戻り値は必ず Promise<T>。Awaited<T> で剥がせる",
          "catch (e) は unknown。instanceof Error で narrowing する",
          "外部 API は zod で実行時検証 + 型推論を同時に取るのが鉄板",
        ],
        comprehensionQuestionIds: ["ts-008"],
      },
      {
        id: "react-and-nextjs",
        title: "7. React / Next.js との実践 — props / hooks / Server Components の型",
        intro:
          "React 18+ / Next.js 13+ の TS 連携。props の型、useState / useReducer / useRef の型推論、Server / Client Components の境界。",
        readingMinutes: 9,
        objectives: [
          "Function Component の props 型を書ける (React.FC は使うべきか)",
          "useState / useRef / useReducer の型注釈を理解する",
          "Server Component / Client Component の境界と Props のシリアライズ制約を理解する",
        ],
        references: [
          { label: "React TypeScript Cheatsheet", url: "https://react-typescript-cheatsheet.netlify.app/" },
          { label: "Next.js TypeScript", url: "https://nextjs.org/docs/app/api-reference/config/typescript" },
        ],
        sections: [
          {
            heading: "7.1 Function Component の props 型",
            body: "現代の React では `React.FC` は使わず、引数に直接 props 型を書くスタイルが推奨。children が必要なら明示的に書く (`React.FC` だと暗黙に children が入って邪魔)。",
            code: "// 推奨スタイル (React.FC を使わない)\ntype ButtonProps = {\n  label: string\n  onClick?: () => void\n  variant?: 'primary' | 'secondary'\n  children?: React.ReactNode   // 必要なら明示\n}\n\nexport function Button({ label, onClick, variant = 'primary', children }: ButtonProps) {\n  return (\n    <button className={variant} onClick={onClick}>\n      {label}\n      {children}\n    </button>\n  )\n}\n\n// HTML 属性を引き継ぎたい時\ntype InputProps = React.InputHTMLAttributes<HTMLInputElement> & {\n  label: string\n}\nexport function Input({ label, ...rest }: InputProps) {\n  return (\n    <label>\n      {label}\n      <input {...rest} />\n    </label>\n  )\n}",
            language: "typescript",
            notes: [
              "React.FC は children を暗黙に含むため、children を渡したくないコンポーネントで邪魔になる",
              "HTML 属性を引き継ぐ時は ComponentPropsWithoutRef<'button'> なども便利",
            ],
          },
          {
            heading: "7.2 useState / useRef / useReducer の型",
            body: "`useState` は初期値から推論されるが、null や union の場合は明示が必要。`useRef<T>(null)` は DOM 用、`useRef<T>(initial)` は mutable な値用 (current が T)。",
            code: "import { useState, useRef, useReducer } from 'react'\n\n// 推論で OK\nconst [count, setCount] = useState(0)             // number\nconst [name, setName] = useState('')              // string\n\n// 明示が必要 (null / union)\nconst [user, setUser] = useState<User | null>(null)\nconst [items, setItems] = useState<string[]>([])\n\n// useRef: DOM への参照 (current は T | null)\nconst inputRef = useRef<HTMLInputElement>(null)\ninputRef.current?.focus()\n\n// useRef: mutable な値 (current は T)\nconst timerRef = useRef<number | null>(null)\ntimerRef.current = window.setTimeout(() => {}, 1000)\n\n// useReducer\ntype State = { count: number }\ntype Action = { type: 'inc' } | { type: 'set'; value: number }\n\nfunction reducer(state: State, action: Action): State {\n  switch (action.type) {\n    case 'inc': return { count: state.count + 1 }\n    case 'set': return { count: action.value }\n  }\n}\nconst [state, dispatch] = useReducer(reducer, { count: 0 })",
            language: "typescript",
          },
          {
            heading: "7.3 Next.js App Router — Server / Client Components",
            body: "Next.js 13+ (App Router) は Server Components がデフォルト。`'use client'` を付けたファイルだけ Client Component。Server → Client への props は『シリアライズ可能』なものに限る (関数 / Date / Map などは渡せない)。",
            code: "// app/page.tsx (Server Component)\nimport { Counter } from './counter'\n\nexport default async function Page() {\n  const data = await fetch('https://api.example.com/items').then(r => r.json())\n  return (\n    <main>\n      <h1>Items</h1>\n      <Counter initial={data.count} />   {/* number = OK */}\n    </main>\n  )\n}\n\n// app/counter.tsx (Client Component)\n'use client'\nimport { useState } from 'react'\n\ntype Props = {\n  initial: number   // ✅ シリアライズ可\n  // onClick: () => void   ❌ Server → Client に関数は渡せない\n  // date: Date           ❌ Date もダメ (文字列にして渡す)\n}\n\nexport function Counter({ initial }: Props) {\n  const [n, setN] = useState(initial)\n  return <button onClick={() => setN(n + 1)}>{n}</button>\n}",
            language: "typescript",
            notes: [
              "Server → Client の props はシリアライズ可能なものに限る (string / number / boolean / null / 配列 / プレーンオブジェクト)",
              "関数を渡したい時は Server Action (`'use server'`) を使う",
            ],
          },
          {
            heading: "7.4 generateStaticParams と PageProps の型",
            body: "Next.js 15+ では params / searchParams が Promise になった。動的ルートの型は `Promise<{ slug: string }>` で受け取る。",
            code: "// app/posts/[slug]/page.tsx (Next 15+)\ntype PageProps = {\n  params: Promise<{ slug: string }>\n  searchParams: Promise<Record<string, string | string[] | undefined>>\n}\n\nexport default async function PostPage({ params }: PageProps) {\n  const { slug } = await params\n  const post = await fetchPost(slug)\n  return <article>{post.title}</article>\n}\n\n// 静的生成 (SSG) のパラメータ列挙\nexport async function generateStaticParams() {\n  const posts = await fetchAllPosts()\n  return posts.map(p => ({ slug: p.slug }))\n}\n\n// メタデータ\nexport async function generateMetadata({ params }: PageProps) {\n  const { slug } = await params\n  return { title: `Post: ${slug}` }\n}",
            language: "typescript",
            notes: [
              "Next.js 14 までは params が同期オブジェクトだったが、15 で Promise 化された (要 await)",
              "型を間違えるとビルド時にエラーが出る (App Router の型生成が厳密)",
            ],
          },
        ],
        keyTakeaways: [
          "React.FC は使わず、props 型を直接受ける書き方が現代の主流",
          "useRef<T>(null) と useRef<T>(initial) で current の型が変わる",
          "Server → Client の props はシリアライズ可能なものに限定",
          "Next.js 15+ は params が Promise — await 必須",
        ],
        comprehensionQuestionIds: [],
      },
    ],
  },

  // ---------- Python 入門ガイド ----------
  {
    id: "python-intro",
    trackId: "python",
    title: "Python の地図 — 静かで強い言語",
    subtitle:
      "公式 Tutorial + Fluent Python のエッセンスを 7 章に。基礎 → コレクションと内包表記 → 関数とデコレータ → クラスと dataclass → 例外と with → イテレータ/Generator → モダン開発 (型ヒント・pytest・uv)",
    audience:
      "Python を体系的に学びたい人、Ruby / JS から移ってきた人、データ・スクリプト・Web 用途で『土台』を固めたい人",
    sources: [
      { label: "Python 公式チュートリアル", url: "https://docs.python.org/ja/3/tutorial/" },
      { label: "Python 公式リファレンス", url: "https://docs.python.org/ja/3/library/" },
      { label: "PEP 8 (スタイルガイド)", url: "https://peps.python.org/pep-0008/" },
    ],
    emoji: "🐍",
    relatedCategoryIds: ["python-basics"],
    chapters: [
      {
        id: "values-and-syntax",
        title: "1. 値と構文 — インデントと f-string、Ruby/JS との違い",
        intro:
          "Python の基本構文 (インデントブロック、変数、組み込み型、真偽値、f-string) を整理。Ruby / JS との『うっかり差』を押さえる。",
        readingMinutes: 7,
        objectives: [
          "Python の基本型 (int / float / str / bool / None) と型変換関数 (int() / str() / float()) を扱える",
          "Python の falsy 値 (False / 0 / '' / [] / {} / None) を Ruby/JS と比較して説明できる",
          "f-string で文字列補間・フォーマット・デバッグ表示が書ける",
        ],
        sections: [
          {
            heading: "1.1 インデントと型",
            body: "Python はブロックを波括弧ではなく『インデント』で区切る。慣習的に半角スペース 4 個 (PEP 8)。型は動的だが、組み込み型は `int` / `float` / `str` / `bool` / `None` / `list` / `tuple` / `dict` / `set`。型は `type(x)` で取得、判定は `isinstance(x, T)`。",
            code: "# インデント = ブロック\nif x > 0:\n    print('positive')\nelse:\n    print('zero or negative')\n\n# 型\nprint(type(None))      # <class 'NoneType'>\nprint(type([]))        # <class 'list'>\nprint(type({}))        # <class 'dict'>\n\nisinstance(x, int)\nx is None              # None 判定は `is` (==ではなく)\n\n# 型変換は型名関数で統一\nint('42')              # 42\nfloat('3.14')          # 3.14\nstr(42)                # '42'\nint(3.7)               # 3 (切り捨て)",
            language: "python",
            notes: [
              "PEP 8 はインデント 4 spaces、最大 79 文字 / 行、import は標準→サードパーティ→ローカル",
              "tab と space を混ぜると IndentationError",
            ],
          },
          {
            heading: "1.2 演算子と数値",
            body: "Python 3 では `/` は常に float、`//` は整数除算 (切り捨て)、`%` は剰余、`**` は冪乗。金額計算は `decimal.Decimal` を使う (浮動小数点の誤差回避)。",
            code: "10 / 3          # 3.3333... (float)\n10 // 3         # 3        (整数除算)\n10 % 3          # 1        (剰余)\n2 ** 10         # 1024     (冪)\ndivmod(10, 3)   # (3, 1)   (商, 余り)\n\n# 浮動小数点の罠\n0.1 + 0.2 == 0.3      # False! (誤差)\n\n# decimal で正確に\nfrom decimal import Decimal\nDecimal('0.1') + Decimal('0.2')   # Decimal('0.3')",
            language: "python",
            notes: [
              "Python 2 は `/` が整数同士で整数除算 — Python 3 で挙動が変わったので注意",
              "金融計算・税計算は必ず Decimal、または整数 (cents) で扱う",
            ],
          },
          {
            heading: "1.3 真偽値と falsy",
            body: "Python の falsy は `False` / `0` / `0.0` / `''` / `[]` / `{}` / `set()` / `None`。空コレクションも falsy なので `if my_list:` で『空でないか』を判定するイディオムが定番。これは Ruby (空配列も truthy) や JS (空配列も truthy) と決定的に違う。",
            code: "bool(False)     # False\nbool(0)         # False\nbool('')        # False\nbool([])        # False    ← Ruby/JS と違う\nbool({})        # False    ← Ruby/JS と違う\nbool(None)      # False\nbool([0])       # True\n\n# よくあるイディオム\nif my_list:                 # 空でない時\n    process(my_list)\n\nname = user_input or 'guest'   # 空文字なら 'guest'",
            language: "python",
            notes: [
              "Ruby: nil / false 以外は全部 truthy (空配列も true)",
              "JavaScript: 空配列 [] / 空オブジェクト {} は truthy",
            ],
          },
          {
            heading: "1.4 f-string と文字列",
            body: "Python 3.6+ では `f'...'` で文字列補間。`{var}` で展開、`{expr:.2f}` でフォーマット指定、`{var=}` で名前付きデバッグ (3.8+)。`'''` / `\"\"\"` で複数行。",
            code: "name = 'Alice'\nage = 30\n\nf'Hello, {name}!'              # 'Hello, Alice!'\nf'{3.14159:.2f}'                # '3.14'\nf'{1000:,}'                     # '1,000'\nf'{name=}, {age=}'              # \"name='Alice', age=30\" (デバッグ)\n\n# 複数行\nmsg = f'''\nName: {name}\nAge:  {age}\n'''\n\n# 文字列メソッド\n'hello'.upper()                 # 'HELLO'\n'  hi  '.strip()                # 'hi'\n'a,b,c'.split(',')              # ['a', 'b', 'c']\n','.join(['a', 'b', 'c'])       # 'a,b,c'",
            language: "python",
            notes: [
              "% フォーマット (`'%s' % name`) や .format() は古い — f-string 推奨",
              "f-string は最も速い文字列補間 (PEP 498)",
            ],
          },
        ],
        keyTakeaways: [
          "ブロックはインデント、慣習は半角スペース 4 個 (PEP 8)",
          "空コレクションは falsy — Ruby/JS とは決定的に違う",
          "/ は float、// は整数除算、金額計算は Decimal",
          "文字列補間は f-string 一択",
        ],
        comprehensionQuestionIds: ["py-001", "py-002", "py-003", "py-004", "py-007"],
      },
      {
        id: "collections-and-comprehensions",
        title: "2. コレクションと内包表記 — list / tuple / dict / set",
        intro:
          "Python の 4 大コレクション型と、内包表記 (comprehension) でフィルタ + マップを 1 行で書くイディオムを身につける。",
        readingMinutes: 8,
        objectives: [
          "list / tuple / dict / set の特徴と使い分けを説明できる",
          "スライス `[start:end:step]` を使いこなせる",
          "list / dict / set / generator 内包表記を書ける",
        ],
        sections: [
          {
            heading: "2.1 4 大コレクション",
            body: "`list`: 順序あり / 可変。`tuple`: 順序あり / 不変 (ハッシュ可)。`dict`: キー → 値 / 順序あり (3.7+)。`set`: 重複なし / 順序なし。",
            code: "# list (順序あり、可変)\nfruits = ['apple', 'banana', 'cherry']\nfruits.append('date')\nfruits[0]                       # 'apple'\nfruits[-1]                      # 'date' (負数で末尾から)\n\n# tuple (順序あり、不変)\npoint = (1, 2, 3)\nx, y, z = point                 # アンパック\n\n# dict (順序あり = 挿入順、3.7+)\nuser = {'name': 'Alice', 'age': 20}\nuser['age']                     # 20\nuser.get('email', 'N/A')        # キーなしならデフォルト\nuser.keys() / user.values() / user.items()\n\n# set (重複なし、順序なし)\ntags = {'python', 'web', 'python'}\nlen(tags)                        # 2\ntags & other_tags                # 積集合\ntags | other_tags                # 和集合\ntags - other_tags                # 差集合",
            language: "python",
            notes: [
              "tuple は immutable → dict のキーや set の要素に使える (list は不可)",
              "dict の順序保証は Python 3.7+ から (CPython 3.6 で実装、3.7 で言語仕様化)",
            ],
          },
          {
            heading: "2.2 スライスとアンパック",
            body: "Python のスライス `[start:end:step]` は最強の構文の 1 つ。end は含まれない。負の数で末尾から、step で間引き / 逆順。文字列・list・tuple 全部対応。",
            code: "arr = [0, 1, 2, 3, 4, 5]\narr[1:3]            # [1, 2]    (1 以上 3 未満)\narr[:3]             # [0, 1, 2]  (先頭から 3 つ)\narr[3:]             # [3, 4, 5]  (3 から末尾まで)\narr[::-1]           # [5, 4, 3, 2, 1, 0]  逆順\narr[::2]            # [0, 2, 4]  飛ばし\n\n# 文字列も同じ\n'hello'[::-1]       # 'olleh'\n\n# アンパック\na, b, c = [1, 2, 3]\nfirst, *rest = [1, 2, 3, 4]     # first=1, rest=[2,3,4]\nfirst, *middle, last = [1, 2, 3, 4, 5]\n\n# 辞書のマージ (Python 3.9+)\nmerged = {**a, **b}\nmerged = a | b                   # 3.9+",
            language: "python",
          },
          {
            heading: "2.3 内包表記 (comprehensions)",
            body: "`[式 for 変数 in iterable if 条件]` で filter + map を 1 行で書ける Python の代表的イディオム。dict / set / generator 版もあり、メモリ効率を重視するなら generator (`()` で囲む)。",
            code: "# list 内包表記\n[n * 2 for n in range(5)]                # [0, 2, 4, 6, 8]\n[n for n in range(10) if n % 2 == 0]     # [0, 2, 4, 6, 8]\n[(x, y) for x in 'AB' for y in [1, 2]]   # 二重ループ\n\n# dict 内包表記\n{k: v ** 2 for k, v in d.items()}\n{name: age for name, age in zip(names, ages)}\n\n# set 内包表記\n{word.lower() for word in words}\n\n# generator (メモリ効率良)\nsum(n ** 2 for n in range(1_000_000))    # 全要素を保持しない\n\n# zip + enumerate\nlist(zip([1, 2, 3], ['a', 'b', 'c']))    # [(1,'a'),(2,'b'),(3,'c')]\nfor i, x in enumerate(['a', 'b', 'c'], start=1):\n    print(i, x)",
            language: "python",
            notes: [
              "巨大データは generator 式 (`()`) でメモリ節約",
              "内包表記が複雑になりすぎたら通常の for ループに分解する",
            ],
          },
          {
            heading: "2.4 collections モジュール",
            body: "標準ライブラリの `collections` には便利な dict 系コンテナが揃う。`defaultdict` (デフォルト値付き dict)、`Counter` (要素カウント)、`OrderedDict` / `deque` (両端キュー)、`namedtuple`。",
            code: "from collections import defaultdict, Counter, deque\n\n# defaultdict: 存在しないキーで自動初期化\ngroups = defaultdict(list)\nfor item in items:\n    groups[item.category].append(item)\n\n# Counter: 要素の出現数\nCounter('mississippi')      # {'i': 4, 's': 4, 'p': 2, 'm': 1}\nCounter(words).most_common(5)\n\n# deque: 両端 O(1) で追加/削除\nqueue = deque(['a', 'b', 'c'])\nqueue.appendleft('start')\nqueue.popleft()",
            language: "python",
          },
        ],
        keyTakeaways: [
          "list (可変) / tuple (不変・ハッシュ可) / dict (key-value) / set (重複なし) を使い分ける",
          "スライス [start:end:step] は最強のサブセット抽出構文",
          "内包表記で filter + map を 1 行に。巨大データは generator 式で",
          "defaultdict / Counter は『よく書く dict パターン』の最適化版",
        ],
        comprehensionQuestionIds: ["py-005", "py-006", "py-008", "py-012"],
      },
      {
        id: "functions-and-decorators",
        title: "3. 関数とデコレータ — *args / **kwargs / クロージャ / @decorator",
        intro:
          "Python の関数機能 (デフォルト引数、可変長引数、クロージャ、デコレータ) を整理。デコレータは Flask / FastAPI / pytest など至るところで使う。",
        readingMinutes: 9,
        objectives: [
          "デフォルト引数の罠 (mutable な default) を避けられる",
          "*args / **kwargs を読み書きできる",
          "デコレータを自作・適用できる",
        ],
        sections: [
          {
            heading: "3.1 関数定義とデフォルト引数の罠",
            body: "デフォルト引数は『関数定義時に 1 回だけ評価され、全呼び出しで共有される』。list / dict のような mutable をデフォルトに使うと、呼び出しを重ねるたびに状態が貯まる。回避は `None` をデフォルトにして関数内で `if x is None: x = []` する定型句。",
            code: "# 良くない (mutable な default)\ndef bad(items=[]):       # ← 全呼び出しで同じ list を共有\n    items.append(1)\n    return items\n\nbad()    # [1]\nbad()    # [1, 1]  ← 期待は [1]\nbad()    # [1, 1, 1]\n\n# 正しい\ndef good(items=None):\n    if items is None:\n        items = []\n    items.append(1)\n    return items\n\n# キーワード専用引数 (Python 3+)\ndef create_user(name, *, age=0, email=None):\n    # * 以降はキーワード引数として渡す必要あり\n    ...\ncreate_user('A', age=20)             # OK\ncreate_user('A', 20)                  # TypeError",
            language: "python",
            notes: [
              "list / dict / set のような mutable をデフォルトに直接書かない",
              "`*` を入れるとそれ以降はキーワード専用 — 引数の意図を明確にできる",
            ],
          },
          {
            heading: "3.2 *args と **kwargs",
            body: "`*args` で位置引数を tuple として、`**kwargs` でキーワード引数を dict として受ける。逆に呼び出し側でも `*list` / `**dict` で展開できる。ラッパー関数 / デコレータで頻出。",
            code: "def show(*args, **kwargs):\n    print(args)     # tuple\n    print(kwargs)   # dict\n\nshow(1, 2, 3, x=10, y=20)\n# (1, 2, 3)\n# {'x': 10, 'y': 20}\n\n# 展開 (unpack)\nnums = [1, 2, 3]\nfunc(*nums)         # func(1, 2, 3) と同じ\n\nopts = {'name': 'A', 'age': 20}\nfunc(**opts)        # func(name='A', age=20) と同じ\n\n# 任意の関数を中継するラッパー\ndef wrapper(func):\n    def inner(*args, **kwargs):\n        print('call', func.__name__)\n        return func(*args, **kwargs)\n    return inner",
            language: "python",
          },
          {
            heading: "3.3 クロージャと nonlocal",
            body: "内側の関数は外側の変数を捕捉する (クロージャ)。読み取りは自動だが、書き換えには `nonlocal` (関数スコープ) / `global` (モジュールスコープ) で明示する必要がある。これがないと『代入 = ローカル変数作成』になってしまう。",
            code: "def make_counter():\n    count = 0\n    def inner():\n        nonlocal count          # 外側の count を書き換える宣言\n        count += 1\n        return count\n    return inner\n\nc = make_counter()\nc(), c(), c()        # (1, 2, 3)\n\n# nonlocal なしだと\ndef make_counter_bad():\n    count = 0\n    def inner():\n        count += 1          # UnboundLocalError\n        return count\n    return inner",
            language: "python",
          },
          {
            heading: "3.4 デコレータ",
            body: "`@xxx` は関数を引数に取り『変更された関数』を返す高階関数の糖衣構文。ログ / 計測 / 認証 / キャッシュなど『関数本体に混ぜたくない関心事』を切り出せる。`functools.wraps` で元関数のメタデータ (__name__ / __doc__) を保つ。",
            code: "from functools import wraps, lru_cache\nfrom time import perf_counter\n\ndef timer(func):\n    @wraps(func)            # 元関数の __name__ を保つ\n    def inner(*args, **kwargs):\n        start = perf_counter()\n        result = func(*args, **kwargs)\n        print(f'{func.__name__}: {perf_counter() - start:.3f}s')\n        return result\n    return inner\n\n@timer\ndef heavy(n):\n    return sum(range(n))\n\n# 引数付きデコレータ (三段になる)\ndef retry(times):\n    def decorator(func):\n        @wraps(func)\n        def inner(*args, **kwargs):\n            for _ in range(times):\n                try:\n                    return func(*args, **kwargs)\n                except Exception:\n                    pass\n        return inner\n    return decorator\n\n@retry(times=3)\ndef call_api(): ...\n\n# 標準の便利デコレータ\n@lru_cache(maxsize=128)\ndef fib(n):\n    return n if n < 2 else fib(n-1) + fib(n-2)",
            language: "python",
            notes: [
              "@wraps を忘れると inner.__name__ が 'inner' になってデバッグ困難",
              "Flask の @app.route / FastAPI の @app.get / pytest の @pytest.fixture も全部デコレータ",
            ],
          },
        ],
        keyTakeaways: [
          "mutable な default 引数は使わない — None を使い関数内で初期化",
          "*args / **kwargs は『可変長引数の受け取り』と『呼び出し時の展開』両方で使う",
          "外側スコープの書き換えは nonlocal / global で明示",
          "デコレータ + functools.wraps で横断的関心事を切り出す",
        ],
        comprehensionQuestionIds: ["py-011", "py-015", "py-017"],
      },
      {
        id: "classes-and-dataclasses",
        title: "4. クラスと OOP — dunder メソッド・@dataclass・継承と super",
        intro:
          "Python のクラス定義、特殊メソッド (dunder)、`@dataclass` でのボイラープレート削減、継承と `super()` の使い方を整理。",
        readingMinutes: 9,
        objectives: [
          "`__init__` / `__repr__` / `__eq__` などの主要 dunder を書ける",
          "`@dataclass` で定型コードを自動生成できる",
          "`super().__init__()` で親クラスを初期化できる、MRO を理解する",
        ],
        sections: [
          {
            heading: "4.1 クラス定義と特殊メソッド (dunder)",
            body: "Python のクラスは `class` 文で定義。コンストラクタは `__init__(self, ...)`。`self` は第 1 引数として明示的に書く。`__str__` / `__repr__` / `__eq__` / `__lt__` / `__add__` / `__len__` / `__iter__` / `__call__` などの dunder メソッドで演算子・組み込み関数の挙動をカスタムできる。",
            code: "class User:\n    def __init__(self, name, age):\n        self.name = name\n        self.age = age\n\n    def __repr__(self):\n        return f'User(name={self.name!r}, age={self.age})'\n\n    def __eq__(self, other):\n        return isinstance(other, User) and self.name == other.name\n\n    def __hash__(self):\n        return hash(self.name)\n\n    def __lt__(self, other):\n        return self.age < other.age\n\nu = User('Alice', 20)\nrepr(u)             # \"User(name='Alice', age=20)\"\nu == User('Alice', 99)   # True (name で比較)\nsorted([u1, u2, u3])    # __lt__ で並び替え\n\n# クラス変数とインスタンス変数\nclass Counter:\n    total = 0           # クラス変数 (全インスタンス共有)\n    def __init__(self):\n        self.count = 0  # インスタンス変数",
            language: "python",
            notes: [
              "__repr__ は『デバッガで見て分かる文字列』、__str__ は『ユーザー向け』。__str__ 未定義なら __repr__ にフォールバック",
              "__eq__ を定義したら __hash__ も必ず定義 (一貫性のため)",
            ],
          },
          {
            heading: "4.2 @dataclass で定型を自動生成",
            body: "Python 3.7+ の `@dataclass` (from dataclasses import dataclass) はフィールド宣言から `__init__` / `__repr__` / `__eq__` を自動生成。`frozen=True` でイミュータブル化、`field(default_factory=list)` で mutable default の罠を回避。",
            code: "from dataclasses import dataclass, field\n\n@dataclass\nclass User:\n    name: str\n    age: int = 0\n    tags: list[str] = field(default_factory=list)   # mutable default の正解\n\nu = User(name='Alice', age=20)\nprint(u)            # User(name='Alice', age=20, tags=[])\nu == User('Alice', 20)   # True\n\n# frozen で不変クラスに\n@dataclass(frozen=True)\nclass Point:\n    x: float\n    y: float\n\np = Point(1.0, 2.0)\np.x = 99            # FrozenInstanceError\n\n# 比較や順序付け\n@dataclass(order=True)\nclass Task:\n    priority: int\n    name: str\n\nsorted([Task(2, 'B'), Task(1, 'A')])   # priority 順",
            language: "python",
            notes: [
              "type hint が必須 (`name: str` の形)",
              "Rails の Struct や TS の type に近い感覚で使える",
              "Pydantic はバリデーション付きの強化版 dataclass として API 入力に頻用",
            ],
          },
          {
            heading: "4.3 継承と super()",
            body: "`class Sub(Base):` で継承。`super()` で親クラスのメソッドを呼ぶ (Python 3 では引数不要)。多重継承では MRO (Method Resolution Order) に従って解決され、`Cls.__mro__` で確認できる。",
            code: "class Animal:\n    def __init__(self, name):\n        self.name = name\n    def speak(self):\n        return f'{self.name} makes a sound'\n\nclass Dog(Animal):\n    def __init__(self, name, breed):\n        super().__init__(name)         # 親の __init__ を呼ぶ\n        self.breed = breed\n    def speak(self):\n        base = super().speak()         # 親の speak の結果\n        return base + ' + bark!'\n\nd = Dog('Rex', 'Shiba')\nprint(d.speak())     # 'Rex makes a sound + bark!'\n\n# MRO の確認\nclass A: ...\nclass B(A): ...\nclass C(A): ...\nclass D(B, C): ...\nprint(D.__mro__)     # D -> B -> C -> A -> object",
            language: "python",
          },
          {
            heading: "4.4 プロパティとアクセス制御",
            body: "Python には『真の private』はない (慣習で `_name` をプライベート扱い)。`@property` で getter、`@x.setter` で setter を定義し、Ruby のアクセサ風に書ける。`@staticmethod` / `@classmethod` でクラスメソッド。",
            code: "class Temperature:\n    def __init__(self, celsius):\n        self._celsius = celsius\n\n    @property\n    def celsius(self):\n        return self._celsius\n\n    @celsius.setter\n    def celsius(self, value):\n        if value < -273.15:\n            raise ValueError('below absolute zero')\n        self._celsius = value\n\n    @property\n    def fahrenheit(self):\n        return self._celsius * 9 / 5 + 32\n\nt = Temperature(25)\nt.celsius            # 25      (メソッド呼び出しでなく属性アクセス)\nt.fahrenheit         # 77.0\nt.celsius = -500     # ValueError\n\n# classmethod / staticmethod\nclass Date:\n    def __init__(self, y, m, d): ...\n    @classmethod\n    def from_string(cls, s):\n        y, m, d = map(int, s.split('-'))\n        return cls(y, m, d)\n    @staticmethod\n    def is_valid(y, m, d): ...\n\nDate.from_string('2026-01-01')",
            language: "python",
            notes: [
              "慣習: `_name` は 'internal'、`__name` は name-mangling (継承先から隠す)",
              "@property は『属性アクセスのまま検証 / 計算結果を返す』ためのもの",
            ],
          },
        ],
        keyTakeaways: [
          "dunder メソッド (__init__ / __repr__ / __eq__ / __lt__ など) で演算子をカスタム",
          "@dataclass で __init__ / __repr__ / __eq__ を自動生成、frozen で不変化",
          "継承は super().method()、多重継承は __mro__ で順序確認",
          "private は慣習 (_name)。プロパティは @property で",
        ],
        comprehensionQuestionIds: ["py-013", "py-014", "py-016"],
      },
      {
        id: "exceptions-and-with",
        title: "5. 例外と with 文 — try / except / context manager",
        intro:
          "Python の例外処理 (try/except/else/finally) と、リソースの自動クリーンアップを担う `with` 文 (context manager) を整理。",
        readingMinutes: 7,
        objectives: [
          "try / except / else / finally の役割を区別できる",
          "適切な例外型を投げる・捕捉する (ValueError / TypeError / 自作例外)",
          "with 文と @contextmanager で安全なリソース管理を書ける",
        ],
        sections: [
          {
            heading: "5.1 try / except / else / finally",
            body: "Python の例外処理は 4 つの節を持つ。`except` で例外捕捉、`else` は例外が出なかった時のみ、`finally` は常に実行。複数の例外型をまとめて捕捉する書き方と、`as e` で例外オブジェクトを受け取る書き方を覚える。",
            code: "try:\n    result = int(user_input)\nexcept ValueError as e:\n    print(f'invalid number: {e}')\nexcept (TypeError, KeyError) as e:       # 複数まとめて\n    print(f'wrong type or key: {e}')\nexcept Exception as e:                    # 何でも (最終手段)\n    print(f'unknown error: {e}')\nelse:\n    print(f'parsed successfully: {result}')\nfinally:\n    cleanup()                              # 常に実行\n\n# 例外を投げる\nif age < 0:\n    raise ValueError(f'age must be >= 0, got {age}')\n\n# 元の例外を保持してチェーン\ntry:\n    parse(data)\nexcept ParseError as e:\n    raise MyAppError('parse failed') from e",
            language: "python",
            notes: [
              "`except Exception:` は広すぎる — 基本は具体的な型で捕捉",
              "`except:` (型なし) は SystemExit / KeyboardInterrupt まで捕えてしまうので NG",
            ],
          },
          {
            heading: "5.2 例外型の選び方",
            body: "標準例外を適切に使う: `ValueError` (値が不正)、`TypeError` (型が不正)、`KeyError` (dict キーなし)、`IndexError` (list インデックス)、`FileNotFoundError`、`PermissionError`、`RuntimeError` (一般)。ドメイン例外は `Exception` を継承して自作。",
            code: "# 自作例外\nclass NotFoundError(Exception):\n    def __init__(self, resource: str, id: int):\n        super().__init__(f'{resource} #{id} not found')\n        self.resource = resource\n        self.id = id\n\ntry:\n    user = find_user(id)\nexcept NotFoundError as e:\n    print(e.resource, e.id)\n\n# EAFP (Easier to Ask Forgiveness than Permission)\n# Pythonic な書き方: まず試して、失敗を例外で受ける\ntry:\n    value = d[key]\nexcept KeyError:\n    value = default\n\n# vs LBYL (Look Before You Leap)\nif key in d:\n    value = d[key]\nelse:\n    value = default",
            language: "python",
            notes: [
              "Python は EAFP スタイルが推奨 — race condition を避けやすく、コードも短い",
              "ただし dict は `d.get(key, default)` が最も Pythonic",
            ],
          },
          {
            heading: "5.3 with 文と context manager",
            body: "`with` 文はブロック開始時に `__enter__` を、終了時 (例外含む) に `__exit__` を呼ぶ仕組み。ファイル・ロック・接続などのリソースを安全に開閉する。`@contextmanager` で関数から context manager を作れる。",
            code: "# ファイルの自動 close\nwith open('data.txt') as f:\n    content = f.read()\n# ここで自動 close (例外発生時も)\n\n# 複数同時\nwith open('a.txt') as a, open('b.txt', 'w') as b:\n    b.write(a.read())\n\n# @contextmanager で自作\nfrom contextlib import contextmanager\nfrom time import perf_counter\n\n@contextmanager\ndef timer(name):\n    start = perf_counter()\n    try:\n        yield\n    finally:\n        print(f'{name}: {perf_counter() - start:.3f}s')\n\nwith timer('heavy'):\n    do_heavy_thing()\n\n# クラスで実装する版\nclass DBConnection:\n    def __enter__(self):\n        self.conn = connect()\n        return self.conn\n    def __exit__(self, exc_type, exc_val, tb):\n        self.conn.close()\n        return False        # False で例外を再 raise (Ture で握り潰す)",
            language: "python",
            notes: [
              "DB トランザクションの commit/rollback、ロック acquire/release も with で書くのが定番",
              "contextlib.suppress(Exception) で例外を意図的に握り潰すコンテキスト",
            ],
          },
        ],
        keyTakeaways: [
          "try / except / else / finally の役割を区別 (else は『例外が出なかった時』)",
          "適切な標準例外型を使い、ドメイン例外は Exception を継承して自作",
          "EAFP (まず試す) が Pythonic、dict は .get(key, default) でも OK",
          "with 文でリソースの安全な開閉、自作は @contextmanager が最短",
        ],
        comprehensionQuestionIds: ["py-009", "py-010"],
      },
      {
        id: "iterators-and-generators",
        title: "6. イテレータと Generator — yield で遅延評価",
        intro:
          "Python の for ループの裏側 (iter / next)、`yield` で関数を generator にする仕組み、`itertools` の便利関数を整理。",
        readingMinutes: 8,
        objectives: [
          "iterable と iterator の違いを説明できる",
          "yield 関数で generator を作れる、無限列を扱える",
          "itertools (chain / islice / groupby / product / accumulate) の代表例を使える",
        ],
        sections: [
          {
            heading: "6.1 iterable と iterator",
            body: "`iterable` = `__iter__` を持ち for ループ可能な対象 (list / tuple / str / dict / set / file など)。`iterator` = `__next__` を持ち値を 1 つずつ返すオブジェクト。`iter(iterable)` で iterator を取り出し、`next(iterator)` で 1 個進める。",
            code: "lst = [1, 2, 3]\nit = iter(lst)\nnext(it)        # 1\nnext(it)        # 2\nnext(it)        # 3\nnext(it)        # StopIteration\n\n# for は内部で iter + next を呼んでいる\nfor x in lst:\n    print(x)\n# ≒\nit = iter(lst)\nwhile True:\n    try:\n        x = next(it)\n    except StopIteration:\n        break\n    print(x)\n\n# 自作 iterable (__iter__ + __next__)\nclass Counter:\n    def __init__(self, n): self.n = n; self.i = 0\n    def __iter__(self): return self\n    def __next__(self):\n        if self.i >= self.n: raise StopIteration\n        self.i += 1\n        return self.i",
            language: "python",
          },
          {
            heading: "6.2 generator (yield 関数)",
            body: "`yield` を含む関数を呼ぶと『generator オブジェクト』が返る (関数本体はまだ実行されない)。`next()` で 1 つずつ実行し、yield で中断 → 次の next で再開。メモリ効率が極めて良く、無限列も扱える。",
            code: "def count_up(start=0):\n    while True:\n        yield start         # ここで中断 → next() で再開\n        start += 1\n\nc = count_up()\nnext(c)         # 0\nnext(c)         # 1\nnext(c)         # 2\n\n# 巨大データの逐次処理\ndef read_lines(path):\n    with open(path) as f:\n        for line in f:\n            yield line.rstrip()\n\nfor line in read_lines('huge.log'):\n    process(line)        # メモリに全部読まない\n\n# generator expression (内包表記の () 版)\nsquares = (x ** 2 for x in range(1_000_000))\nsum(squares)                 # 全要素を保持しない\n\n# yield from で他の generator を委譲\ndef flatten(nested):\n    for sub in nested:\n        yield from sub      # サブ generator の全要素を中継",
            language: "python",
            notes: [
              "generator は『一度使い切ったら終わり』(再度 iter しても何も出ない) — 必要なら関数を呼び直して新しい generator を得る",
              "巨大データ / 無限列 / ストリーミング処理で必須",
            ],
          },
          {
            heading: "6.3 itertools の常連",
            body: "標準ライブラリ `itertools` には iterator を組み合わせる関数が大量にある。代表は `chain` (連結)、`islice` (スライス)、`groupby` (連続する同値をまとめる)、`product` (デカルト積)、`combinations` / `permutations` / `accumulate`。",
            code: "from itertools import chain, islice, groupby, product, combinations, accumulate\n\nchain([1, 2], [3, 4])               # 1 2 3 4\nlist(islice(count_up(), 5))         # [0, 1, 2, 3, 4]  無限列を 5 個だけ\n\n# groupby は『連続する同値』をまとめる (要事前ソート)\ndata = [('A', 1), ('A', 2), ('B', 3), ('B', 4), ('A', 5)]\nfor key, group in groupby(data, key=lambda x: x[0]):\n    print(key, list(group))\n# A [('A',1),('A',2)]\n# B [('B',3),('B',4)]\n# A [('A',5)]              ← 連続のみまとめる\n\nlist(product([1, 2], ['a', 'b']))   # [(1,'a'),(1,'b'),(2,'a'),(2,'b')]\nlist(combinations([1, 2, 3], 2))    # [(1,2),(1,3),(2,3)]\nlist(accumulate([1, 2, 3, 4]))      # [1, 3, 6, 10]  累積和",
            language: "python",
          },
        ],
        keyTakeaways: [
          "for ループは iter + next の糖衣 — iterable / iterator の区別を理解",
          "yield 関数 = generator。遅延評価でメモリ効率良 + 無限列対応",
          "巨大データはまず generator 式 (`()`) と yield 関数を検討",
          "itertools (chain / islice / groupby / product / accumulate) は再発明しない",
        ],
        comprehensionQuestionIds: ["py-018"],
      },
      {
        id: "modern-python-workflow",
        title: "7. モダン Python — 型ヒント・pytest・uv / pyproject.toml",
        intro:
          "型ヒント (typing)、pytest によるテスト、uv / poetry / pip + venv によるパッケージ管理と仮想環境。実務で必須の開発体験を整理。",
        readingMinutes: 9,
        objectives: [
          "基本的な型ヒント (int / str / list[T] / dict[K, V] / Optional / Union) を書ける",
          "pytest で関数テスト・fixture・parametrize が書ける",
          "uv / poetry / pip + venv の関係を理解し、pyproject.toml を読める",
        ],
        references: [
          { label: "typing 公式", url: "https://docs.python.org/ja/3/library/typing.html" },
          { label: "pytest 公式", url: "https://docs.pytest.org/" },
          { label: "uv (Astral)", url: "https://docs.astral.sh/uv/" },
        ],
        sections: [
          {
            heading: "7.1 型ヒント (PEP 484, 3.5+)",
            body: "Python の型ヒントは『実行時の強制ではなく、ツールと人間のため』のもの。`mypy` / `pyright` / IDE が読んでチェック・補完してくれる。Python 3.10+ では `X | Y` で union、3.9+ で `list[int]` (大文字 List をインポート不要)。",
            code: "# 基本\ndef add(a: int, b: int) -> int:\n    return a + b\n\ndef greet(name: str, greeting: str = 'Hello') -> str:\n    return f'{greeting}, {name}'\n\n# コレクション (Python 3.9+)\ndef sum_all(nums: list[int]) -> int:\n    return sum(nums)\n\ndef count_words(text: str) -> dict[str, int]: ...\n\n# Optional / Union (3.10+)\ndef find_user(id: int) -> User | None: ...    # 3.10+\n# 3.9 以下なら\nfrom typing import Optional\ndef find_user(id: int) -> Optional[User]: ...\n\n# 自作型のエイリアス\nUserId = int\nfrom typing import TypeAlias\nJsonValue: TypeAlias = str | int | float | bool | None | dict | list\n\n# Protocol (構造的部分型、Duck Typing の型版)\nfrom typing import Protocol\nclass HasLength(Protocol):\n    def __len__(self) -> int: ...\n\ndef show_size(x: HasLength) -> None:\n    print(len(x))     # __len__ があれば何でも OK\n\n# 型チェック\n# $ pip install mypy\n# $ mypy your_file.py",
            language: "python",
            notes: [
              "型ヒントは runtime には影響しない (`int` と書いても string が渡せてしまう)",
              "mypy / pyright を CI に組み込み、エディタ補完を活かすのが目的",
              "Pydantic / FastAPI は型ヒントを runtime にも使って validation する",
            ],
          },
          {
            heading: "7.2 pytest によるテスト",
            body: "現代の Python テストは `pytest` がデファクト。`def test_xxx():` の関数を書いて `assert` するだけ。`@pytest.fixture` で依存注入、`@pytest.mark.parametrize` でデータドリブンテスト。標準の `unittest` よりずっと簡潔。",
            code: "# tests/test_calc.py\nimport pytest\nfrom calc import add, divide\n\ndef test_add():\n    assert add(2, 3) == 5\n\ndef test_divide_by_zero():\n    with pytest.raises(ZeroDivisionError):\n        divide(1, 0)\n\n# fixture (テストの前準備)\n@pytest.fixture\ndef sample_user():\n    return {'name': 'Alice', 'age': 20}\n\ndef test_user_name(sample_user):\n    assert sample_user['name'] == 'Alice'\n\n# parametrize (1 つのテストで複数ケース)\n@pytest.mark.parametrize('a,b,expected', [\n    (1, 2, 3),\n    (5, 6, 11),\n    (-1, 1, 0),\n])\ndef test_add_table(a, b, expected):\n    assert add(a, b) == expected\n\n# Mocking (unittest.mock)\nfrom unittest.mock import patch\n\n@patch('mymodule.api_call')\ndef test_with_mock(mock_api):\n    mock_api.return_value = {'ok': True}\n    assert mymodule.do_thing() == 'ok'\n\n# 実行\n# $ pytest -v\n# $ pytest -k 'add'           # 名前で絞り込み\n# $ pytest --cov=mypackage    # カバレッジ (pytest-cov)",
            language: "python",
          },
          {
            heading: "7.3 仮想環境とパッケージ管理",
            body: "Python は『システム全体に install しない』のが鉄則。プロジェクトごとに仮想環境 (venv) を作って隔離する。ツールは古典派 (pip + venv)、標準デファクト (poetry)、新興・高速 (uv) の 3 系統。",
            code: "# --- uv (推奨、2024〜) Astral 社の Rust 製、超高速 ---\nuv init myapp\ncd myapp\nuv add requests pytest                # 依存追加 + lockfile 更新\nuv add --dev mypy ruff\nuv run python app.py                  # venv を意識せずに実行\nuv run pytest\n\n# --- poetry (2018〜) 定番、pyproject.toml + poetry.lock ---\npoetry init\npoetry add requests\npoetry add --group dev pytest\npoetry install                        # lockfile から再現\npoetry run python app.py\n\n# --- 古典: pip + venv (標準ライブラリだけ) ---\npython -m venv .venv\nsource .venv/bin/activate             # Windows: .venv\\Scripts\\activate\npip install -r requirements.txt\npip install requests\npip freeze > requirements.txt\n\n# --- pyproject.toml (PEP 518/621、標準フォーマット) ---\n# [project]\n# name = 'myapp'\n# version = '0.1.0'\n# requires-python = '>=3.11'\n# dependencies = ['requests', 'pydantic>=2']\n# \n# [project.optional-dependencies]\n# dev = ['pytest', 'mypy', 'ruff']",
            language: "bash",
            notes: [
              "新規プロジェクトなら uv が最速かつ体験が良い (2025 年現在)",
              "既存プロジェクトの選択は『チームと CI が何を使っているか』に合わせる",
              "setup.py / requirements.txt は legacy — pyproject.toml が標準",
            ],
          },
          {
            heading: "7.4 リンタとフォーマッタ",
            body: "コード品質ツール: `ruff` (Rust 製、超高速、lint + format 統合)、`black` (フォーマッタの定番)、`mypy` / `pyright` (型チェック)。ruff は black 互換のフォーマッタも内蔵し、現代の第一候補。",
            code: "# ruff (推奨、2024〜)\nuv add --dev ruff\nuv run ruff check .              # lint\nuv run ruff format .             # format\n\n# pyproject.toml\n# [tool.ruff]\n# line-length = 100\n# select = ['E', 'F', 'I', 'N', 'W', 'B']\n# \n# [tool.ruff.format]\n# quote-style = 'double'\n\n# 古典: black + flake8 + isort + mypy\npip install black flake8 isort mypy\nblack .\nflake8 .\nisort .\nmypy src/",
            language: "bash",
            notes: [
              "CI で ruff check + ruff format --check + mypy を必ず通すのが現代の標準",
              "pre-commit フックに組み込むと『push 前に自動で守れる』",
            ],
          },
        ],
        keyTakeaways: [
          "型ヒントは runtime ではなく『ツールと人間のため』、mypy / pyright で活かす",
          "テストは pytest 一択。fixture + parametrize でデータドリブン",
          "新規は uv、定番は poetry、最小構成は pip + venv",
          "pyproject.toml が標準。ruff で lint + format をワンストップ",
        ],
        comprehensionQuestionIds: ["py-019", "py-020"],
      },
    ],
  },

  // ---------- SQL 入門ガイド ----------
  {
    id: "sql-intro",
    trackId: "sql",
    title: "SQL の地図 — 宣言的にデータを問い合わせる",
    subtitle:
      "SELECT → DML → 集約 → JOIN → サブクエリ/CTE → ウィンドウ関数 → パフォーマンス。PostgreSQL / MySQL / SQLite 共通の標準 SQL を 7 章で。",
    audience:
      "ORM (Rails / Prisma / Django) は使えるが生 SQL を読み書きしたい人、N+1 や Slow Query を自力で潰したい人",
    sources: [
      { label: "PostgreSQL 公式ドキュメント", url: "https://www.postgresql.org/docs/current/" },
      { label: "MySQL 8.0 リファレンス", url: "https://dev.mysql.com/doc/refman/8.0/ja/" },
      { label: "Use The Index, Luke!", url: "https://use-the-index-luke.com/ja" },
    ],
    emoji: "🗃️",
    relatedCategoryIds: ["sql-basics", "sql-joins", "sql-advanced"],
    chapters: [
      {
        id: "select-basics",
        title: "1. SELECT の基礎 — 投影・選択・並べ替え・制限",
        intro:
          "SQL は『どう取るか』ではなく『何が欲しいか』を書く宣言的言語。まずは SELECT / WHERE / ORDER BY / LIMIT を整理。",
        readingMinutes: 7,
        objectives: [
          "SELECT 文の基本形 (投影 / 選択 / 並べ替え / 制限) を書ける",
          "比較演算子 / IN / BETWEEN / LIKE / IS NULL を使い分けられる",
          "ORDER BY / LIMIT / OFFSET の挙動と組み合わせを理解する",
        ],
        sections: [
          {
            heading: "1.1 SELECT の構文 — 6 つのキーワード",
            body: "SQL の SELECT 文は 6 つの主要キーワードを順番に書く: `SELECT` (投影) → `FROM` (元) → `WHERE` (選択) → `GROUP BY` (集約) → `HAVING` (集約後の選択) → `ORDER BY` (並べ替え) → `LIMIT/OFFSET` (制限)。論理的な評価順は FROM → WHERE → GROUP BY → HAVING → SELECT → ORDER BY → LIMIT。",
            code: "-- 全カラム / 全行\nSELECT * FROM users;\n\n-- 必要なカラムだけ (推奨)\nSELECT id, name, email FROM users;\n\n-- 別名 (AS は省略可)\nSELECT name AS user_name, email AS contact FROM users;\nSELECT name user_name FROM users;          -- AS 省略\n\n-- 計算列\nSELECT id, name, age * 12 AS age_in_months FROM users;\n\n-- 重複排除\nSELECT DISTINCT role FROM users;",
            language: "sql",
            notes: [
              "本番コードで `SELECT *` は避ける — 必要なカラムを明示すると通信量・index 効率が改善",
              "SQL のキーワードは大文字推奨 (テーブル / カラムは小文字 snake_case) — 視覚的に区別しやすい",
            ],
          },
          {
            heading: "1.2 WHERE — 比較・IN・BETWEEN・LIKE・NULL",
            body: "WHERE で行を絞り込む。比較演算子 (`=` / `<>` / `<` / `>` / `<=` / `>=`)、`IN` (集合に含まれる)、`BETWEEN` (範囲)、`LIKE` (パターン)、`IS NULL` (NULL 判定)。NULL は `=` で比較できず必ず `IS NULL` / `IS NOT NULL` を使う点に注意。",
            code: "SELECT * FROM users WHERE active = true;\nSELECT * FROM users WHERE age >= 18 AND age < 65;\nSELECT * FROM users WHERE role IN ('admin', 'editor');\nSELECT * FROM users WHERE age BETWEEN 18 AND 64;     -- 両端含む\n\n-- パターンマッチ\nSELECT * FROM users WHERE name LIKE 'A%';            -- A で始まる\nSELECT * FROM users WHERE email LIKE '%@example.com';\nSELECT * FROM users WHERE name LIKE 'A_ice';         -- _ は任意 1 文字\n\n-- NULL は = で比較できない\nSELECT * FROM users WHERE deleted_at IS NULL;        -- ✅\nSELECT * FROM users WHERE deleted_at = NULL;         -- ❌ 常に空\n\n-- AND / OR / NOT\nSELECT * FROM users\nWHERE active = true AND (role = 'admin' OR role = 'editor');",
            language: "sql",
            notes: [
              "NULL は『値が無い』状態。= NULL は常に偽になる SQL の落とし穴 No.1",
              "前方一致 `'A%'` は INDEX が効くが、`'%@x'` (後方一致) は効かない",
            ],
          },
          {
            heading: "1.3 ORDER BY / LIMIT / OFFSET",
            body: "`ORDER BY` で並べ替え (デフォルト ASC、降順は DESC)。複数キー指定可。`LIMIT n` で先頭 n 件、`OFFSET m` で m 件スキップ。ページング (`LIMIT 20 OFFSET 40` で 3 ページ目) の定番。",
            code: "SELECT * FROM users ORDER BY created_at DESC;\nSELECT * FROM users ORDER BY age ASC, name ASC;       -- 複数キー\n\n-- 並べ替え + 上位 N 件\nSELECT * FROM products ORDER BY sales DESC LIMIT 10;\n\n-- ページング (1 ページ 20 件、3 ページ目)\nSELECT * FROM posts\nORDER BY published_at DESC\nLIMIT 20 OFFSET 40;\n\n-- NULL の並び順 (DB により差あり)\nSELECT * FROM users ORDER BY last_login DESC NULLS LAST;   -- PostgreSQL",
            language: "sql",
            notes: [
              "OFFSET は値が大きいほど遅くなる — Keyset Pagination (WHERE id < ?) が高速",
              "ORDER BY 無しで LIMIT すると順序は未定義 — 必ず ORDER BY を併用",
            ],
          },
        ],
        keyTakeaways: [
          "SQL は宣言的。何が欲しいかを書き、どう取るかは DB に任せる",
          "本番では SELECT * を避け、必要なカラムを明示",
          "NULL は IS NULL / IS NOT NULL でしか判定できない",
          "ORDER BY 無しの LIMIT は順序が未定義 — 必ず併用",
        ],
        comprehensionQuestionIds: ["sql-001", "sql-002", "sql-003", "sql-008"],
      },
      {
        id: "dml-and-transactions",
        title: "2. INSERT / UPDATE / DELETE とトランザクション",
        intro:
          "データを変更する DML (Data Manipulation Language) と、その変更を『全部成功か全部失敗か』にまとめるトランザクションを整理。",
        readingMinutes: 8,
        objectives: [
          "INSERT (単行 / 複数行 / SELECT から)、UPDATE、DELETE を書ける",
          "WHERE を忘れた UPDATE / DELETE の事故を防げる",
          "BEGIN / COMMIT / ROLLBACK と SAVEPOINT を使える",
        ],
        sections: [
          {
            heading: "2.1 INSERT — 行を追加する",
            body: "`INSERT INTO テーブル (カラム...) VALUES (値...)` が基本。複数行を 1 文で、`SELECT` の結果を流し込む `INSERT INTO ... SELECT` もある。`RETURNING` (PostgreSQL) で挿入後の id を取り出せる。",
            code: "-- 単行\nINSERT INTO users (name, email, role)\nVALUES ('Alice', 'a@example.com', 'admin');\n\n-- 複数行 (1 statement)\nINSERT INTO users (name, email) VALUES\n  ('Alice', 'a@x'),\n  ('Bob',   'b@x'),\n  ('Carol', 'c@x');\n\n-- SELECT の結果を挿入\nINSERT INTO archived_users (id, name)\nSELECT id, name FROM users WHERE active = false;\n\n-- 挿入後の値を取り出す (PostgreSQL)\nINSERT INTO users (name) VALUES ('Dave')\nRETURNING id, created_at;\n\n-- UPSERT (重複時は更新)  PostgreSQL\nINSERT INTO users (email, name) VALUES ('a@x', 'Alice')\nON CONFLICT (email) DO UPDATE SET name = EXCLUDED.name;",
            language: "sql",
            notes: [
              "複数行 INSERT は 1 文で書く方が高速 (ラウンドトリップ 1 回)",
              "MySQL の UPSERT は `INSERT ... ON DUPLICATE KEY UPDATE`",
            ],
          },
          {
            heading: "2.2 UPDATE / DELETE — WHERE を忘れない",
            body: "`UPDATE テーブル SET カラム = 値 WHERE 条件`。WHERE を忘れると **全行が更新される**。同様に DELETE も。検証クエリを先に SELECT で流し、件数が想定通りか確認してから実行するのが鉄則。",
            code: "-- UPDATE\nUPDATE users SET role = 'admin' WHERE id = 1;\nUPDATE users SET last_login = NOW() WHERE email = 'a@x';\n\n-- 複数カラム同時\nUPDATE users SET name = 'Alice A', role = 'admin' WHERE id = 1;\n\n-- 別テーブルの値で更新 (PostgreSQL)\nUPDATE users SET role = roles.name\nFROM roles WHERE users.role_id = roles.id;\n\n-- DELETE\nDELETE FROM users WHERE id = 1;\nDELETE FROM logs WHERE created_at < NOW() - INTERVAL '30 days';\n\n-- ✅ 事故防止: 先に SELECT で件数確認\nSELECT COUNT(*) FROM users WHERE role = 'guest';\nDELETE FROM users WHERE role = 'guest';\n\n-- ✅ トランザクションで囲む\nBEGIN;\nDELETE FROM users WHERE role = 'guest';\n-- 結果を確認してから\nCOMMIT;     -- or ROLLBACK;",
            language: "sql",
            notes: [
              "本番 DB を直接触る時は『SELECT で確認 → BEGIN で囲む → COMMIT』をクセに",
              "DELETE は本当に削除して良いか — 論理削除 (deleted_at) で代用するケースも多い",
            ],
          },
          {
            heading: "2.3 トランザクション — BEGIN / COMMIT / ROLLBACK",
            body: "複数の SQL を『1 つの単位』として扱う仕組み。途中で失敗したら ROLLBACK で全部巻き戻し、全部成功したら COMMIT で確定。ACID の A (Atomicity)。SAVEPOINT で部分ロールバックも可能。",
            code: "-- 銀行送金 (典型例)\nBEGIN;\n  UPDATE accounts SET balance = balance - 100 WHERE id = 1;\n  UPDATE accounts SET balance = balance + 100 WHERE id = 2;\nCOMMIT;\n-- どちらか失敗したら ROLLBACK で両方無かったことに\n\n-- SAVEPOINT (部分ロールバック)\nBEGIN;\n  INSERT INTO users(name) VALUES ('Alice');\n  SAVEPOINT sp1;\n  INSERT INTO users(name) VALUES (NULL);     -- 失敗するかも\n  ROLLBACK TO sp1;                             -- Alice は残る\n  INSERT INTO users(name) VALUES ('Bob');\nCOMMIT;\n\n-- 分離レベル (PostgreSQL のデフォルトは READ COMMITTED)\nBEGIN ISOLATION LEVEL SERIALIZABLE;\n  -- 最も厳しい分離レベル (並行更新を厳格に検出)\nCOMMIT;",
            language: "sql",
            notes: [
              "Web アプリは ORM (Rails の transaction do / Prisma の $transaction) でラップするのが普通",
              "ACID: Atomicity (原子性) / Consistency / Isolation / Durability",
              "分離レベルを上げると整合性は強くなるが、競合・デッドロックも増える",
            ],
          },
        ],
        keyTakeaways: [
          "INSERT は複数行を 1 文で。RETURNING で id を取り出せる (PG)",
          "UPDATE / DELETE は WHERE 忘れで全行消える事故 — 事前 SELECT + BEGIN で守る",
          "BEGIN / COMMIT / ROLLBACK で複数操作を atomic に",
          "SAVEPOINT で部分ロールバック、ISOLATION LEVEL で分離強度を調整",
        ],
        comprehensionQuestionIds: ["sql-005", "sql-006", "sql-007", "sql-021"],
      },
      {
        id: "aggregates-and-group-by",
        title: "3. 集計と GROUP BY — COUNT / SUM / AVG と HAVING",
        intro:
          "『何件あるか』『合計いくらか』『平均は』など、集計関数と GROUP BY でグループ化された集計を整理。",
        readingMinutes: 8,
        objectives: [
          "COUNT / SUM / AVG / MAX / MIN を使い分けられる",
          "GROUP BY で集計のキーを指定できる、HAVING との違いを説明できる",
          "COUNT(*) と COUNT(col) の違い (NULL の扱い) を理解する",
        ],
        sections: [
          {
            heading: "3.1 集計関数の基本",
            body: "`COUNT(*)` は全行数、`COUNT(col)` は col が NULL でない行数。`SUM` / `AVG` / `MAX` / `MIN` は対象カラムが NULL の行を無視する。`COUNT(DISTINCT col)` で重複除外。",
            code: "-- 全件数\nSELECT COUNT(*) FROM users;\n\n-- 重複なしのロール数\nSELECT COUNT(DISTINCT role) FROM users;\n\n-- 合計 / 平均 / 最大 / 最小\nSELECT\n  SUM(amount)   AS total,\n  AVG(amount)   AS mean,\n  MAX(amount)   AS top,\n  MIN(amount)   AS bottom,\n  COUNT(*)      AS rows\nFROM orders;\n\n-- COUNT(*) vs COUNT(col) — NULL の扱い\nSELECT\n  COUNT(*)            AS all_rows,        -- NULL も数える\n  COUNT(email)        AS with_email,      -- email が NULL でない行\n  COUNT(DISTINCT role) AS unique_roles\nFROM users;",
            language: "sql",
            notes: [
              "NULL は計算でも無視される (AVG は NULL を分母に含めない)",
              "COUNT(*) は最速。COUNT(1) と等価 (古い迷信で COUNT(1) が速いと言われたが嘘)",
            ],
          },
          {
            heading: "3.2 GROUP BY — グループ化された集計",
            body: "`GROUP BY` で『同じ値を持つ行』をまとめて 1 行に集約する。`SELECT` 句にはグループキー or 集計関数しか書けない (それ以外は SQL 標準ではエラー)。",
            code: "-- ロール別ユーザー数\nSELECT role, COUNT(*) AS cnt\nFROM users\nGROUP BY role\nORDER BY cnt DESC;\n\n-- 月別売上合計\nSELECT DATE_TRUNC('month', created_at) AS month,\n       SUM(amount) AS total\nFROM orders\nGROUP BY DATE_TRUNC('month', created_at)\nORDER BY month;\n\n-- 複数キーでグループ化\nSELECT country, role, COUNT(*)\nFROM users\nGROUP BY country, role;\n\n-- ❌ SQL 標準違反 (SELECT に集計でない列)\nSELECT name, COUNT(*) FROM users GROUP BY role;\n--     ^ name は role 内で複数あるので 1 つに決められない\n\n-- ✅ name を含めたいなら GROUP BY name も追加するか、集計する\nSELECT role, MAX(name), COUNT(*) FROM users GROUP BY role;",
            language: "sql",
            notes: [
              "MySQL の古いデフォルト (ONLY_FULL_GROUP_BY OFF) は SELECT に何でも書けるが、結果は未定義 — 危険",
              "GROUP BY の代わりに DISTINCT + ウィンドウ関数の方が読みやすいケースもある (6 章で)",
            ],
          },
          {
            heading: "3.3 HAVING — 集約後の絞り込み",
            body: "`WHERE` は集約前、`HAVING` は集約後の絞り込み。集計結果 (COUNT / SUM など) を条件にしたい時は HAVING を使う。",
            code: "-- ❌ WHERE で集計結果を使えない\nSELECT role, COUNT(*) FROM users\nWHERE COUNT(*) > 10                       -- Error\nGROUP BY role;\n\n-- ✅ HAVING を使う\nSELECT role, COUNT(*) AS cnt\nFROM users\nGROUP BY role\nHAVING COUNT(*) > 10\nORDER BY cnt DESC;\n\n-- WHERE と HAVING の併用 (active なユーザー内で、ロール別 10 人以上)\nSELECT role, COUNT(*) AS cnt\nFROM users\nWHERE active = true                       -- 集約前のフィルタ\nGROUP BY role\nHAVING COUNT(*) > 10                       -- 集約後のフィルタ\nORDER BY cnt DESC;",
            language: "sql",
            notes: [
              "可能なら WHERE で先に絞ってから集約 — その方が高速 (行数が減ってから集計)",
              "HAVING に集計関数以外 (例: role) を書くのは GROUP BY と同じ条件で WHERE に書ける",
            ],
          },
        ],
        keyTakeaways: [
          "COUNT(*) は全行、COUNT(col) は NULL を除外",
          "GROUP BY のキー or 集計関数しか SELECT に書けない (SQL 標準)",
          "WHERE は集約前、HAVING は集約後の絞り込み",
          "可能なら WHERE で先に絞り、行数を減らしてから集計",
        ],
        comprehensionQuestionIds: ["sql-004", "sql-008", "sql-009", "sql-010"],
      },
      {
        id: "joins",
        title: "4. JOIN — 複数テーブルをつなぐ",
        intro:
          "正規化されたデータを結合して 1 つの結果に。INNER / LEFT / RIGHT / FULL / CROSS / SELF JOIN と N+1 問題の解消を整理。",
        readingMinutes: 10,
        objectives: [
          "INNER JOIN と LEFT JOIN の違いを説明できる",
          "ON 句で結合条件を書ける、複数テーブルを連結できる",
          "N+1 問題を JOIN または IN で 1 つの SQL に集約できる",
        ],
        sections: [
          {
            heading: "4.1 INNER JOIN — 両方にある行だけ",
            body: "`A INNER JOIN B ON 条件` で両テーブルの行を結合。条件が成立した組み合わせのみ残る。デフォルトは INNER なので `JOIN` だけでも同じ。",
            code: "-- users と posts を user_id で結合\nSELECT u.name, p.title\nFROM users u\nJOIN posts p ON u.id = p.user_id;\n\n-- 投稿のない user は出てこない (INNER の特徴)\n\n-- 3 テーブル結合 (users → posts → comments)\nSELECT u.name, p.title, c.body\nFROM users u\nJOIN posts    p ON u.id = p.user_id\nJOIN comments c ON p.id = c.post_id;\n\n-- WHERE と組み合わせ\nSELECT u.name, p.title\nFROM users u\nJOIN posts p ON u.id = p.user_id\nWHERE u.active = true\n  AND p.published = true;",
            language: "sql",
            notes: [
              "テーブルに別名 (u / p / c) を付けると JOIN の連鎖が読みやすい",
              "ON 句は『結合条件』、WHERE 句は『結果の絞り込み』として書き分けるのが慣習",
            ],
          },
          {
            heading: "4.2 LEFT JOIN — 左テーブルは全行残す",
            body: "`A LEFT JOIN B ON 条件` で A 側は必ず残し、B 側が無ければ NULL で埋める。『投稿が 0 件の user も含めて一覧したい』『parent も子も両方一覧したい』などで頻出。",
            code: "-- 全 user (投稿 0 件の人も含む)\nSELECT u.id, u.name, p.title\nFROM users u\nLEFT JOIN posts p ON u.id = p.user_id;\n-- 投稿が無い user は p.title が NULL\n\n-- 投稿数 0 を含むカウント (COALESCE で 0 に揃える)\nSELECT u.id, u.name, COUNT(p.id) AS post_count\nFROM users u\nLEFT JOIN posts p ON u.id = p.user_id\nGROUP BY u.id, u.name;\n-- COUNT(p.id) は NULL を数えないので、投稿 0 件の人は 0 になる ◎\n\n-- ❌ NG パターン: WHERE で右テーブル条件を書くと INNER になる\nSELECT u.id, u.name, p.title\nFROM users u\nLEFT JOIN posts p ON u.id = p.user_id\nWHERE p.published = true;          -- ← published=true の post が無い user が消える\n\n-- ✅ 正しくは ON に書く\nSELECT u.id, u.name, p.title\nFROM users u\nLEFT JOIN posts p ON u.id = p.user_id AND p.published = true;",
            language: "sql",
            notes: [
              "LEFT JOIN + WHERE 右側条件は『見落としやすい INNER 化』 — ON に書くのが正解",
              "RIGHT JOIN は『LEFT JOIN の逆』 — 実務では LEFT に書き換える方が読みやすい",
              "FULL OUTER JOIN は両側残す。OR で結合した『どちらかにある』",
            ],
          },
          {
            heading: "4.3 SELF JOIN と CROSS JOIN",
            body: "SELF JOIN は同じテーブルに別名を付けて結合 (社員と上司、親カテゴリ等)。CROSS JOIN は全行のデカルト積 (組み合わせ全列挙) — 滅多に使わないが、日付テーブルとの結合などで稀に。",
            code: "-- SELF JOIN: 社員と上司\nSELECT e.name AS employee, m.name AS manager\nFROM employees e\nLEFT JOIN employees m ON e.manager_id = m.id;\n\n-- SELF JOIN: 同じカテゴリの 2 商品の組み合わせ\nSELECT a.name, b.name\nFROM products a\nJOIN products b ON a.category = b.category\nWHERE a.id < b.id;       -- 重複ペア除外\n\n-- CROSS JOIN: 全 user × 全月の表 (空でも 0 で埋めたい時など)\nSELECT u.id, m.month\nFROM users u\nCROSS JOIN generate_series(1, 12) AS m(month);",
            language: "sql",
          },
          {
            heading: "4.4 N+1 問題と JOIN/IN の活用",
            body: "ORM の典型的アンチパターン: ループの中で 1 件ずつ SELECT すると、N 件のループで N+1 回クエリが発行される。1 つの JOIN または `WHERE id IN (...)` に集約することで 2 回 (or 1 回) に減らせる。",
            code: "-- ❌ N+1 (ORM ループ中で 1 件ずつクエリ)\n-- SELECT * FROM users;                        -- 1 回\n-- SELECT * FROM posts WHERE user_id = 1;      -- N 回\n-- SELECT * FROM posts WHERE user_id = 2;\n-- ...\n\n-- ✅ JOIN で 1 SQL にまとめる\nSELECT u.id, u.name, p.id AS post_id, p.title\nFROM users u\nLEFT JOIN posts p ON u.id = p.user_id;\n\n-- ✅ 集計だけ欲しいなら集約クエリ 1 つで OK\nSELECT u.id, u.name, COUNT(p.id) AS post_count\nFROM users u\nLEFT JOIN posts p ON u.id = p.user_id\nGROUP BY u.id, u.name;\n\n-- ✅ ORM 流: id を集めてから IN で 1 回引く (preload)\n-- 1) SELECT id FROM users;\n-- 2) SELECT * FROM posts WHERE user_id IN (1, 2, 3, ...);",
            language: "sql",
            notes: [
              "Rails: `User.includes(:posts)` (preload / eager_load)",
              "Prisma: `prisma.user.findMany({ include: { posts: true } })`",
              "Django: `User.objects.prefetch_related('posts')`",
            ],
          },
        ],
        keyTakeaways: [
          "INNER は両方にある行だけ、LEFT は左を全部残し右を NULL で埋める",
          "LEFT JOIN 後の WHERE で右テーブル条件は INNER 化に注意 — ON に書く",
          "N+1 は JOIN / IN / ORM の preload で 1〜2 回のクエリに集約",
          "SELECT 句で `name, COUNT(*)` のような NULL 含む集計は COUNT(p.id) で 0 を返せる",
        ],
        comprehensionQuestionIds: ["sql-011", "sql-012", "sql-013", "sql-015", "sql-016", "sql-017"],
      },
      {
        id: "subqueries-and-cte",
        title: "5. サブクエリと CTE — クエリの中にクエリを書く",
        intro:
          "サブクエリ (IN / EXISTS / スカラ) と CTE (WITH 句) を使い、複雑な集計を段階的に組み立てる。",
        readingMinutes: 9,
        objectives: [
          "WHERE / FROM / SELECT 句のサブクエリを書き分けられる",
          "IN と EXISTS の違い、相関サブクエリの仕組みを理解する",
          "CTE (WITH 句) で多段クエリを読みやすく構造化できる、再帰 CTE で階層を辿れる",
        ],
        sections: [
          {
            heading: "5.1 サブクエリ — どこに書けるか",
            body: "サブクエリは括弧で囲んだ SELECT。`WHERE 句` (集合や値の比較)、`FROM 句` (一時表のように)、`SELECT 句` (スカラ値) のいずれにも書ける。",
            code: "-- WHERE 句: 集合 (IN)\nSELECT * FROM users\nWHERE id IN (SELECT user_id FROM orders WHERE amount > 1000);\n\n-- WHERE 句: スカラ (= や比較)\nSELECT * FROM users\nWHERE age > (SELECT AVG(age) FROM users);\n\n-- FROM 句: 中間結果を一時表のように\nSELECT t.role, AVG(t.cnt) AS avg_posts\nFROM (\n  SELECT u.role, COUNT(p.id) AS cnt\n  FROM users u LEFT JOIN posts p ON u.id = p.user_id\n  GROUP BY u.id, u.role\n) AS t\nGROUP BY t.role;\n\n-- SELECT 句: 各行に対する補助値\nSELECT u.name,\n       (SELECT COUNT(*) FROM posts p WHERE p.user_id = u.id) AS post_count\nFROM users u;",
            language: "sql",
            notes: [
              "SELECT 句のスカラサブクエリは『各行に対して 1 回実行される』ので大量行で遅くなる — JOIN + GROUP BY の方が速いことが多い",
            ],
          },
          {
            heading: "5.2 IN vs EXISTS、相関サブクエリ",
            body: "`IN` は値の集合との比較。`EXISTS` は存在判定 (1 件でも該当があれば true)。多くの DB ではオプティマイザがほぼ同等に変換するが、NULL が混じる時の挙動は要注意。",
            code: "-- IN (集合に含まれるか)\nSELECT * FROM users\nWHERE id IN (SELECT user_id FROM orders);\n\n-- EXISTS (存在判定、相関サブクエリ)\nSELECT * FROM users u\nWHERE EXISTS (\n  SELECT 1 FROM orders o WHERE o.user_id = u.id\n);\n\n-- NOT IN の罠 — サブクエリに NULL が混じると全体が NULL = 空結果\nSELECT * FROM users WHERE id NOT IN (SELECT user_id FROM orders);\n-- もし orders.user_id に NULL が 1 つでもあれば → 0 件\n\n-- ✅ 安全: NOT EXISTS\nSELECT * FROM users u\nWHERE NOT EXISTS (\n  SELECT 1 FROM orders o WHERE o.user_id = u.id\n);\n\n-- 相関サブクエリ: 外側の行に依存\nSELECT u.name,\n       (SELECT MAX(o.amount) FROM orders o WHERE o.user_id = u.id) AS max_amount\nFROM users u;",
            language: "sql",
            notes: [
              "NOT IN は NULL があると意図しない空結果 — NOT EXISTS か LEFT JOIN + IS NULL を使う",
              "EXISTS は最初の 1 件で打ち切れるので、存在判定だけなら IN より高速になることがある",
            ],
          },
          {
            heading: "5.3 CTE (WITH 句) で構造化",
            body: "CTE (Common Table Expression) は `WITH 名前 AS (SELECT ...)` で定義する一時的な名前付き結果集合。ネストしたサブクエリを階段状に分解できる。同じ CTE をクエリ内で複数回参照可。",
            code: "-- 段階的に組み立てる\nWITH active_users AS (\n  SELECT id, name FROM users WHERE active = true\n),\nrecent_posts AS (\n  SELECT user_id, title FROM posts\n  WHERE published_at > NOW() - INTERVAL '30 days'\n)\nSELECT au.name, COUNT(rp.user_id) AS recent_count\nFROM active_users au\nLEFT JOIN recent_posts rp ON au.id = rp.user_id\nGROUP BY au.id, au.name;\n\n-- 結果の確認しやすさ — CTE 1 つずつ単独で実行可\n-- WITH の途中まで切り出して動作確認できるのが大きな利点",
            language: "sql",
            notes: [
              "深いネストのサブクエリは可読性が悪い — CTE で名前を付けて段階分解",
              "PostgreSQL 12+ では CTE もインライン展開され、性能差はほぼなくなった",
            ],
          },
          {
            heading: "5.4 再帰 CTE — 階層構造を辿る",
            body: "`WITH RECURSIVE` で自分自身を参照する CTE を定義 → 階層構造 (組織図 / カテゴリツリー / コメントスレッド) を 1 SQL でトラバースできる。基底ケース → 再帰ケースを `UNION ALL` で繋ぐ。",
            code: "-- 組織図: 全社員と階層レベル\nWITH RECURSIVE org AS (\n  -- 基底: ルート (上司が NULL の人)\n  SELECT id, name, manager_id, 1 AS lvl\n  FROM employees\n  WHERE manager_id IS NULL\n\n  UNION ALL\n\n  -- 再帰: 直属の部下を 1 階層ずつ追加\n  SELECT e.id, e.name, e.manager_id, org.lvl + 1\n  FROM employees e\n  JOIN org ON e.manager_id = org.id\n)\nSELECT * FROM org ORDER BY lvl, id;\n\n-- カテゴリツリーで『あるカテゴリ配下を全部取る』にも使える\nWITH RECURSIVE descendants AS (\n  SELECT id, name, parent_id FROM categories WHERE id = 5\n  UNION ALL\n  SELECT c.id, c.name, c.parent_id\n  FROM categories c JOIN descendants d ON c.parent_id = d.id\n)\nSELECT * FROM descendants;",
            language: "sql",
            notes: [
              "再帰 CTE は無限ループ防止のため、終了条件 (lvl < 10 など) を入れることがある",
              "深い階層は再帰 CTE が便利だが、ネストが浅いなら通常 JOIN の方が速い",
            ],
          },
        ],
        keyTakeaways: [
          "サブクエリは WHERE / FROM / SELECT のどこにも書ける",
          "NOT IN は NULL の罠 — NOT EXISTS か LEFT JOIN + IS NULL に置き換える",
          "CTE で多段クエリを名前付きに分解、可読性 ↑",
          "WITH RECURSIVE で階層構造を 1 SQL でトラバース",
        ],
        comprehensionQuestionIds: ["sql-014", "sql-018", "sql-020"],
      },
      {
        id: "window-functions",
        title: "6. ウィンドウ関数 — 行を保ったまま集計する",
        intro:
          "GROUP BY と違って『元の行を保ったまま、グループ内で順位や移動平均を計算』するのがウィンドウ関数。レポート / ランキング / 時系列で必須。",
        readingMinutes: 9,
        objectives: [
          "ROW_NUMBER / RANK / DENSE_RANK の違いを説明できる",
          "PARTITION BY と ORDER BY を組み合わせてランキング・累積を計算できる",
          "LAG / LEAD / 移動平均 (ROWS BETWEEN) を書ける",
        ],
        sections: [
          {
            heading: "6.1 OVER 句の基本 — PARTITION BY と ORDER BY",
            body: "ウィンドウ関数の構文: `関数() OVER (PARTITION BY ... ORDER BY ...)`。`PARTITION BY` でグループ分け (省略時は全行)、`ORDER BY` でグループ内の順序を決める。GROUP BY と違い、元の行数は減らない。",
            code: "-- 部門毎の給与ランキング (元の行はそのまま、rank 列を追加)\nSELECT name, department, salary,\n  ROW_NUMBER() OVER (PARTITION BY department ORDER BY salary DESC) AS rank\nFROM employees;\n\n-- 全社の単純な給与順位 (PARTITION 無し)\nSELECT name, salary,\n  ROW_NUMBER() OVER (ORDER BY salary DESC) AS global_rank\nFROM employees;\n\n-- GROUP BY との対比\n-- GROUP BY: 各 department で 1 行に集約される\nSELECT department, AVG(salary) FROM employees GROUP BY department;\n\n-- ウィンドウ: 全社員の行を保ち、部門平均を各行に付ける\nSELECT name, department, salary,\n  AVG(salary) OVER (PARTITION BY department) AS dept_avg\nFROM employees;",
            language: "sql",
            notes: [
              "GROUP BY は『集約して行を減らす』、ウィンドウは『行を保ったまま集計列を足す』",
              "PARTITION BY 無しなら全行で 1 つのウィンドウ",
            ],
          },
          {
            heading: "6.2 ランキング関数の使い分け",
            body: "`ROW_NUMBER()` (重複なし、必ず連番)、`RANK()` (同点は同順位、その後スキップ)、`DENSE_RANK()` (同点は同順位、スキップなし)、`NTILE(n)` (n 分割の番号)。",
            code: "SELECT name, score,\n  ROW_NUMBER() OVER (ORDER BY score DESC) AS rn,\n  RANK()       OVER (ORDER BY score DESC) AS rk,\n  DENSE_RANK() OVER (ORDER BY score DESC) AS dr,\n  NTILE(4)     OVER (ORDER BY score DESC) AS quartile\nFROM exam;\n\n-- 例: A:100, B:100, C:90, D:80\n--    ROW_NUMBER  RANK  DENSE_RANK  NTILE(4)\n-- A      1        1        1          1\n-- B      2        1        1          1\n-- C      3        3        2          2\n-- D      4        4        3          3\n\n-- TOP-N per group (各部門の上位 3 人)\nSELECT * FROM (\n  SELECT name, department, salary,\n    ROW_NUMBER() OVER (PARTITION BY department ORDER BY salary DESC) AS rn\n  FROM employees\n) t WHERE rn <= 3;",
            language: "sql",
          },
          {
            heading: "6.3 LAG / LEAD と累積・移動集計",
            body: "`LAG(col, n)` は同じウィンドウ内の n 行前の値、`LEAD(col, n)` は n 行後。`SUM/AVG OVER (... ROWS BETWEEN ...)` で累積和や移動平均を計算できる。",
            code: "-- 前日との差分 (LAG)\nSELECT date, value,\n  value - LAG(value) OVER (ORDER BY date) AS diff\nFROM daily_stats;\n\n-- 翌行を覗く (LEAD)\nSELECT name, login_at,\n  LEAD(login_at) OVER (PARTITION BY user_id ORDER BY login_at) AS next_login\nFROM sessions;\n\n-- 累積和\nSELECT date, amount,\n  SUM(amount) OVER (ORDER BY date) AS cumulative\nFROM orders;\n\n-- 7 日間移動平均\nSELECT date, value,\n  AVG(value) OVER (\n    ORDER BY date\n    ROWS BETWEEN 6 PRECEDING AND CURRENT ROW\n  ) AS moving_avg_7\nFROM daily_stats;\n\n-- 部門毎の累積和\nSELECT department, name, salary,\n  SUM(salary) OVER (PARTITION BY department ORDER BY hire_date) AS cum_salary\nFROM employees;",
            language: "sql",
            notes: [
              "ROWS BETWEEN は『物理的な行範囲』、RANGE BETWEEN は『値の範囲』 (日付に便利)",
              "ウィンドウフレーム指定なしの SUM OVER (ORDER BY ...) は累積和 (デフォルト = RANGE)",
            ],
          },
        ],
        keyTakeaways: [
          "ウィンドウ関数は元の行を保ったまま集計列を足す (GROUP BY との最大の違い)",
          "ROW_NUMBER / RANK / DENSE_RANK を場面で使い分け",
          "TOP-N per group は ROW_NUMBER + サブクエリで一発",
          "LAG / LEAD / 移動集計 (ROWS BETWEEN) で時系列分析",
        ],
        comprehensionQuestionIds: ["sql-019", "sql-020"],
      },
      {
        id: "performance-and-index",
        title: "7. パフォーマンス — INDEX と EXPLAIN",
        intro:
          "Slow Query を倒すには INDEX 設計と EXPLAIN の読み方が必須。インデックスが効く条件、複合インデックスの順序、EXPLAIN の見方を整理。",
        readingMinutes: 10,
        objectives: [
          "INDEX が効く条件・効かない条件を判別できる",
          "複合インデックスの順序ルール (左端から使われる) を理解する",
          "EXPLAIN / EXPLAIN ANALYZE の主要な行 (Seq Scan / Index Scan / Nested Loop) を読める",
        ],
        references: [
          { label: "Use The Index, Luke! (日本語)", url: "https://use-the-index-luke.com/ja" },
          { label: "PostgreSQL: Performance Tips", url: "https://www.postgresql.org/docs/current/performance-tips.html" },
        ],
        sections: [
          {
            heading: "7.1 INDEX の基本 — B-Tree で何が速くなるか",
            body: "INDEX は B-Tree 構造で『カラムの値 → 行の位置』を高速に引ける補助データ。SELECT は速くなるが、INSERT / UPDATE / DELETE は INDEX 更新コストがかかるので **付けすぎは逆効果**。PRIMARY KEY と UNIQUE は自動的に INDEX が作られる。",
            code: "-- INDEX 作成\nCREATE INDEX idx_users_email ON users(email);\n\n-- 複合 INDEX (順序が重要、後述)\nCREATE INDEX idx_posts_user_status ON posts(user_id, status);\n\n-- UNIQUE INDEX (重複も禁止)\nCREATE UNIQUE INDEX idx_users_email_uniq ON users(email);\n\n-- 部分 INDEX (条件付き、PostgreSQL)\nCREATE INDEX idx_active_users ON users(email) WHERE active = true;\n\n-- 削除\nDROP INDEX idx_users_email;\n\n-- 既存 INDEX 一覧 (PostgreSQL)\nSELECT * FROM pg_indexes WHERE tablename = 'users';",
            language: "sql",
            notes: [
              "目安: WHERE / JOIN / ORDER BY で多用するカラムに INDEX を貼る",
              "更新頻度が高いカラムへの INDEX は INSERT/UPDATE が重くなる",
              "Cardinality (値の種類数) が低い (active=true/false 等) カラムは INDEX の効果が薄い",
            ],
          },
          {
            heading: "7.2 INDEX が効く条件・効かない条件",
            body: "INDEX は『カラム値そのままの比較』で効く。関数で加工 (`LOWER(email)` / `SUBSTR`) や型変換すると効かない。LIKE は前方一致 (`'A%'`) なら効くが、後方一致 (`'%X'`) / 中央 (`'%XY%'`) は効かない。",
            code: "-- ✅ INDEX 効く\nWHERE email = 'a@example.com'\nWHERE email LIKE 'a%'\nWHERE created_at > '2026-01-01'\nWHERE user_id IN (1, 2, 3)\n\n-- ❌ INDEX 効かない\nWHERE LOWER(email) = 'a@example.com'        -- 関数で加工\nWHERE SUBSTR(email, 1, 3) = 'a@x'\nWHERE email LIKE '%@example.com'              -- 後方一致\nWHERE email LIKE '%example%'                   -- 中央一致\nWHERE id + 1 = 100                              -- 演算\nWHERE created_at::date = '2026-01-01'          -- 型変換\n\n-- ✅ 対策: Expression INDEX を貼る (PostgreSQL)\nCREATE INDEX idx_users_lower_email ON users(LOWER(email));\n-- ↑ こうすると WHERE LOWER(email) = ... でも index 使われる\n\n-- 全文検索は別の仕組み (PostgreSQL は GIN + tsvector、Elasticsearch 等)\nCREATE INDEX idx_posts_body_gin ON posts USING GIN(to_tsvector('english', body));",
            language: "sql",
          },
          {
            heading: "7.3 複合 INDEX — 左端から順に効く",
            body: "`(a, b, c)` の複合 INDEX は **左端から順に** WHERE で使われた時にだけ効く。`WHERE a=...` ◎、`WHERE a=... AND b=...` ◎、`WHERE b=...` ✗、`WHERE a=... AND c=...` (b スキップ) は部分的にしか効かない。よく使う組み合わせを左に置く。",
            code: "-- 複合 INDEX\nCREATE INDEX idx_posts_user_status_date\n  ON posts(user_id, status, published_at);\n\n-- ✅ 効く\nWHERE user_id = 1\nWHERE user_id = 1 AND status = 'published'\nWHERE user_id = 1 AND status = 'published' AND published_at > '2026-01'\n\n-- ⚠️ 部分的に効く (user_id だけ)\nWHERE user_id = 1 AND published_at > '2026-01'    -- status をスキップ\n\n-- ❌ ほぼ効かない\nWHERE status = 'published'                          -- 先頭の user_id 無し\nWHERE published_at > '2026-01'\n\n-- ORDER BY も index 順と一致すれば速い\nSELECT * FROM posts\nWHERE user_id = 1 AND status = 'published'\nORDER BY published_at DESC;                          -- index の 3 番目と一致 ✓",
            language: "sql",
            notes: [
              "Cardinality が高いカラム (id / email など) を左に置くのが基本セオリー",
              "WHERE 等値 → 範囲 → ORDER BY の順で複合 INDEX を組むと効きやすい",
            ],
          },
          {
            heading: "7.4 EXPLAIN — 実行計画を読む",
            body: "クエリの前に `EXPLAIN` を付けると DB が選んだ実行計画が見える。`EXPLAIN ANALYZE` は実際に実行して実測時間も出す (UPDATE/DELETE に注意!)。`Seq Scan` (全件スキャン) が遅い時は INDEX 検討、`Nested Loop` の深さや `rows=` の見積もりズレもチェック。",
            code: "EXPLAIN SELECT * FROM users WHERE email = 'a@x';\nEXPLAIN ANALYZE SELECT * FROM users WHERE email = 'a@x';\nEXPLAIN (ANALYZE, BUFFERS, VERBOSE) SELECT * FROM users WHERE email = 'a@x';\n\n-- 主な node\n-- Seq Scan: 全件スキャン (テーブルが小さい / INDEX 無い時に登場)\n-- Index Scan: INDEX 経由でアクセス ◎\n-- Index Only Scan: INDEX だけで答えられる (最速)\n-- Bitmap Index Scan + Bitmap Heap Scan: 該当行が多い時の戦略\n-- Nested Loop / Hash Join / Merge Join: JOIN の戦略\n\n-- 重要な指標\n-- cost=0.00..8.00 rows=1 width=64\n-- ↑ コスト見積もり / 推定行数 / 平均バイト幅\n-- (ANALYZE 時) actual time=0.012..0.013 rows=1 loops=1\n-- ↑ 実測時間 / 実測行数 / ループ回数\n\n-- 改善前後の比較が王道のチューニング手順\n-- 1. EXPLAIN ANALYZE で測る\n-- 2. INDEX 追加 / クエリ書き換え\n-- 3. 再度 EXPLAIN ANALYZE で改善確認",
            language: "sql",
            notes: [
              "EXPLAIN ANALYZE は実際にクエリを実行するので、UPDATE/DELETE では BEGIN/ROLLBACK で囲む",
              "推定 rows と actual rows が大きくズレてたら統計情報が古い → `ANALYZE table_name` でリフレッシュ",
              "JOIN 大量 + Nested Loop が深い時は `work_mem` 不足の可能性 (Hash Join に切り替わらない)",
            ],
          },
          {
            heading: "7.5 N+1 と Slow Query の典型対策",
            body: "実務で頻出する『遅い SQL』のチェックリスト: N+1、不要な SELECT *、INDEX 無し、OFFSET 大、関数でカラム加工、巨大 IN リスト、巨大 OR、無駄な DISTINCT、無駄な COUNT(*)。",
            code: "-- ❌ N+1\nfor user in users:\n  SELECT * FROM posts WHERE user_id = ?;\n-- ✅ JOIN または preload\nSELECT u.*, p.*\nFROM users u LEFT JOIN posts p ON u.id = p.user_id;\n\n-- ❌ OFFSET 1000000 — 全件スキャンに近い\nSELECT * FROM posts ORDER BY id LIMIT 20 OFFSET 1000000;\n-- ✅ Keyset Pagination\nSELECT * FROM posts WHERE id < ? ORDER BY id DESC LIMIT 20;\n\n-- ❌ 巨大 IN (10000 件)\nSELECT * FROM users WHERE id IN (1, 2, ..., 10000);\n-- ✅ 一時表 / VALUES / JOIN に変える\n\n-- ❌ COUNT(*) を毎リクエスト\nSELECT COUNT(*) FROM huge_table;            -- 全件スキャン\n-- ✅ 統計表 (pg_stat_user_tables の reltuples)、または別途カウンタテーブル\n\n-- ❌ 関数で加工\nWHERE DATE(created_at) = '2026-01-01';      -- INDEX 効かない\n-- ✅ 範囲指定\nWHERE created_at >= '2026-01-01' AND created_at < '2026-01-02';",
            language: "sql",
            notes: [
              "Slow Query Log (PostgreSQL: log_min_duration_statement、MySQL: slow_query_log) で重いクエリを発見",
              "本番 DB は pg_stat_statements (PostgreSQL) で頻出 + 累積実行時間を可視化",
            ],
          },
        ],
        keyTakeaways: [
          "INDEX は『カラム値そのままの比較』で効く — 関数で加工すると無効",
          "複合 INDEX は左端から順に。等値 → 範囲 → ORDER BY の順で並べる",
          "EXPLAIN ANALYZE で実測 → INDEX 追加 → 再測定の繰り返し",
          "N+1 / 巨大 OFFSET / 関数加工 / COUNT(*) は典型 Slow Query パターン",
        ],
        comprehensionQuestionIds: ["sql-022", "sql-023", "sql-024", "sql-025"],
      },
    ],
  },

  // ---------- React 入門ガイド ----------
  {
    id: "react-intro",
    trackId: "react",
    title: "React の地図 — 宣言的 UI と Hooks の世界",
    subtitle:
      "公式 react.dev のエッセンスを 7 章に。JSX とコンポーネント → useState/useReducer → useEffect → Context/Custom Hook → フォーム/Ref → パフォーマンス → Suspense/Server Components",
    audience:
      "React を体系的に学び直したい人、useEffect の罠から抜け出したい人、React 19 / Server Components の流れに追いつきたい人",
    sources: [
      { label: "react.dev (公式)", url: "https://react.dev/" },
      { label: "You Might Not Need an Effect", url: "https://react.dev/learn/you-might-not-need-an-effect" },
      { label: "React TypeScript Cheatsheet", url: "https://react-typescript-cheatsheet.netlify.app/" },
    ],
    emoji: "⚛️",
    relatedCategoryIds: ["react-fundamentals"],
    chapters: [
      {
        id: "jsx-and-components",
        title: "1. JSX とコンポーネント — 宣言的 UI の出発点",
        intro:
          "React は『状態から UI を導出する』宣言的ライブラリ。JSX の読み方、Function Component、props、再レンダリングの 4 つのトリガーを整理。",
        readingMinutes: 7,
        objectives: [
          "JSX が `React.createElement(...)` の糖衣であることを理解する",
          "Function Component の props 型と children の扱いを書ける",
          "再レンダリングがいつ発生するか (state / props / context / 親) を説明できる",
        ],
        sections: [
          {
            heading: "1.1 JSX は関数呼び出しの糖衣",
            body: "`<Button color='red'>Save</Button>` は `React.createElement(Button, { color: 'red' }, 'Save')` に変換される。属性は props、子は children として渡る。HTML との差分: `class` → `className`、`for` → `htmlFor`、`onclick` → `onClick` (camelCase)、style は object (`style={{ color: 'red' }}`)、`{式}` で JS 式を埋め込む。",
            code: "// JSX\nfunction Card({ title, children }: { title: string; children: React.ReactNode }) {\n  return (\n    <div className=\"card\">\n      <h2>{title}</h2>\n      <div>{children}</div>\n    </div>\n  )\n}\n\n// 使う側\n<Card title=\"Hello\">\n  <p>This is body</p>\n</Card>\n\n// HTML との差分\n<input type=\"text\" className=\"input\" onChange={handle} />\n<label htmlFor=\"name\">Name</label>\n<div style={{ color: 'red', fontSize: 14 }}>...</div>\n\n// 条件レンダリング\n{user ? <Dashboard /> : <Login />}\n{items.length === 0 && <Empty />}\n\n// リスト (key 必須、後述)\n{items.map(item => <li key={item.id}>{item.name}</li>)}",
            language: "tsx",
            notes: [
              "JSX は React 専用ではなく、Vue や Solid でも使える文法 (実装は別)",
              "Fragment `<>...</>` でラッパー要素なしに複数要素を返せる",
              "boolean / null / undefined / false は何も描画されない (`{condition && <X />}` のパターンが成立する理由)",
            ],
          },
          {
            heading: "1.2 Function Component と props",
            body: "現代の React は Function Component が標準。class は新規では書かない。props は引数オブジェクトで受け取り、children は特別な props として `<Foo>...</Foo>` の中身が渡る。TypeScript では `React.FC` を使わず、引数に直接型を書くスタイルが推奨。",
            code: "type ButtonProps = {\n  label: string\n  onClick?: () => void\n  variant?: 'primary' | 'secondary'\n  children?: React.ReactNode\n}\n\nexport function Button({ label, onClick, variant = 'primary', children }: ButtonProps) {\n  return (\n    <button className={variant} onClick={onClick}>\n      {label}\n      {children}\n    </button>\n  )\n}\n\n// HTML 属性を継承したい時\ntype InputProps = React.InputHTMLAttributes<HTMLInputElement> & { label: string }\nexport function Input({ label, ...rest }: InputProps) {\n  return (\n    <label>\n      <span>{label}</span>\n      <input {...rest} />\n    </label>\n  )\n}",
            language: "tsx",
            notes: [
              "React.FC は children を暗黙に含むため避ける派が多数",
              "props は『不変』として扱う — 中で書き換えない",
            ],
          },
          {
            heading: "1.3 再レンダリングの 4 トリガー",
            body: "Function Component が再レンダリング (関数として再実行) されるのは: (1) 自分の state が更新、(2) props が変わった、(3) 購読中の Context 値が変わった、(4) 親が再レンダリングした。React は `Object.is` で同値判定し、同じなら再描画をスキップする (state 同値時)。",
            code: "function Counter() {\n  const [n, setN] = useState(0)\n  return <button onClick={() => setN(n + 1)}>{n}</button>\n}\n\n// 同じ値の setState は何もしない\nsetN(0)\nsetN(0)   // 2 回目は無視\n\n// 親が再レンダリングすると子も再レンダリング\nfunction Parent() {\n  const [, force] = useState(0)\n  return (\n    <>\n      <button onClick={() => force(n => n + 1)}>force</button>\n      <Child />   {/* Parent の更新で Child も再レンダリング */}\n    </>\n  )\n}\n\n// React.memo で『props 同じなら再レンダリングしない』\nconst Child = React.memo(function Child({ value }: { value: number }) {\n  return <div>{value}</div>\n})",
            language: "tsx",
            notes: [
              "再レンダリング = DOM 再生成ではない。React は仮想 DOM の差分 (reconciliation) でから実際の DOM 更新は最小限",
              "『再レンダリングは速い』のが React の哲学 — 安易な memo は逆効果",
            ],
          },
          {
            heading: "1.4 リストと key",
            body: "リストレンダリング (`items.map(item => <X />)`) には `key` prop が必須。React は key で『どの要素が同じか / 追加 / 削除 / 移動か』を判断する。`item.id` のような安定したユニーク値を使い、index は最終手段 (並び替えで子の state が消える)。",
            code: "// ❌ key なし → 警告 + 差分検出が非効率\nitems.map(item => <li>{item.name}</li>)\n\n// ⚠️ index は最終手段 (並び替えで問題)\nitems.map((item, i) => <li key={i}>{item.name}</li>)\n\n// ✅ 安定 ID\nitems.map(item => <li key={item.id}>{item.name}</li>)\n\n// Fragment にも key 可\nitems.map(item => (\n  <Fragment key={item.id}>\n    <dt>{item.name}</dt>\n    <dd>{item.value}</dd>\n  </Fragment>\n))",
            language: "tsx",
            notes: [
              "key は『同じ親の中で』ユニークなら OK — グローバルにユニークである必要はない",
              "key を変えると React は『別物』と判断して unmount → remount する (state リセットに使える)",
            ],
          },
        ],
        keyTakeaways: [
          "JSX は React.createElement の糖衣、HTML との細かな差 (className / htmlFor / camelCase) を覚える",
          "Function Component が標準、React.FC は使わず props 型を直接受ける",
          "再レンダリングのトリガーは state / props / context / 親の 4 つ",
          "リストの key は安定したユニーク ID を使う、index は最終手段",
        ],
        comprehensionQuestionIds: ["react-003", "react-006"],
      },
      {
        id: "state-with-usestate-and-usereducer",
        title: "2. 状態管理 — useState と useReducer",
        intro:
          "React の心臓部である状態管理。useState の基本、関数更新の罠、useReducer での複雑な遷移、派生状態を作らないという考え方を整理。",
        readingMinutes: 8,
        objectives: [
          "useState の関数形式 `setState(prev => ...)` を使うべき場面を判別できる",
          "オブジェクト state を不変に更新する書き方 (spread / immer) を知る",
          "useReducer で複雑な状態遷移を切り出せる、useState との使い分けができる",
        ],
        sections: [
          {
            heading: "2.1 useState の基本",
            body: "`const [state, setState] = useState(initial)` でローカル状態を持つ。`setState` の引数に値を渡すと置き換え、関数を渡すと『前回の state』を受け取って計算する (関数更新)。",
            code: "function Counter() {\n  const [count, setCount] = useState(0)\n  return (\n    <>\n      <p>Count: {count}</p>\n      <button onClick={() => setCount(count + 1)}>+1</button>\n      <button onClick={() => setCount(c => c + 1)}>+1 (関数更新)</button>\n    </>\n  )\n}\n\n// 初期値が重い計算なら遅延初期化\nconst [items, setItems] = useState(() => loadFromStorage())\n//                                  ^^^ 関数を渡すと初回のみ実行",
            language: "tsx",
            notes: [
              "useState の初期値は『初回レンダリング時にのみ評価』される — 関数で囲むと毎回の評価を避けられる",
              "TypeScript で `null` や union を扱うなら明示: `useState<User | null>(null)`",
            ],
          },
          {
            heading: "2.2 関数更新の罠 — 古い state を見るな",
            body: "`setN(n + 1)` をイベント内で 2 回呼んでも +1 にしかならない。クロージャでキャプチャした古い `n` を 2 回参照しているから。関数更新 `setN(prev => prev + 1)` なら React が直前の state を渡してくれて安全。",
            code: "// ❌ 古い state を見る\nfunction Counter() {\n  const [n, setN] = useState(0)\n  return <button onClick={() => {\n    setN(n + 1)         // n=0 → setN(1)\n    setN(n + 1)         // n は依然 0 → setN(1)  ← +2 ではなく +1\n  }}>{n}</button>\n}\n\n// ✅ 関数更新で安全に\nreturn <button onClick={() => {\n  setN(prev => prev + 1)\n  setN(prev => prev + 1)   // ちゃんと +2\n}}>{n}</button>\n\n// 非同期処理 (タイマー / await) でも同じ罠\nconst handle = async () => {\n  await sleep(1000)\n  setN(n + 1)              // 1 秒前の n を見る\n  setN(prev => prev + 1)   // 最新の state を見る\n}",
            language: "tsx",
            notes: [
              "『前の state に依存する更新』は常に関数更新を選ぶのが安全",
              "React 18+ は自動 batching でイベント外 (Promise / setTimeout) も batch 化される",
            ],
          },
          {
            heading: "2.3 オブジェクト / 配列の state を不変に更新",
            body: "React は『state はイミュータブル』を前提にして同値判定する。直接 mutate (push / splice / x.y = ...) すると React が変化に気づけず再レンダリングが起きない。spread (`...`) / immer / `toSorted` / `with` 等で新しい参照を作る。",
            code: "// ❌ 直接 mutate\nconst [user, setUser] = useState({ name: 'A', age: 20 })\nuser.age = 21\nsetUser(user)            // 同じ参照 → 再レンダリングされない\n\n// ✅ 新しいオブジェクトに\nsetUser({ ...user, age: 21 })\nsetUser(prev => ({ ...prev, age: prev.age + 1 }))\n\n// 配列\nconst [items, setItems] = useState<Item[]>([])\nsetItems([...items, newItem])                // 追加\nsetItems(items.filter(i => i.id !== id))     // 削除\nsetItems(items.map(i => i.id === id ? { ...i, done: true } : i))\n\n// ES2023+ の非破壊メソッド\nsetItems(items.toSorted((a, b) => a.name.localeCompare(b.name)))\nsetItems(items.toReversed())\nsetItems(items.with(0, newItem))   // index 0 を置換\n\n// 深いネストは immer が便利\nimport { produce } from 'immer'\nsetState(produce(draft => { draft.user.address.city = 'Tokyo' }))",
            language: "tsx",
            notes: [
              "破壊的: push / pop / shift / unshift / splice / sort / reverse",
              "非破壊的 (ES2023+): toSorted / toReversed / toSpliced / with",
              "深いネストは immer で『mutate っぽい書き方』ができる",
            ],
          },
          {
            heading: "2.4 useReducer — 複雑な状態遷移を切り出す",
            body: "state が複数あって連動する、更新ロジックが複雑、外部テストしたい — そんな時は `useReducer(reducer, initial)` で `[state, dispatch]` を取得。Redux と同じ思想を 1 コンポーネント内で。Discriminated Union で action を型付けすると堅牢。",
            code: "type State = { count: number; step: number }\ntype Action =\n  | { type: 'inc' }\n  | { type: 'dec' }\n  | { type: 'setStep'; step: number }\n  | { type: 'reset' }\n\nfunction reducer(state: State, action: Action): State {\n  switch (action.type) {\n    case 'inc':     return { ...state, count: state.count + state.step }\n    case 'dec':     return { ...state, count: state.count - state.step }\n    case 'setStep': return { ...state, step: action.step }\n    case 'reset':   return { count: 0, step: 1 }\n  }\n}\n\nfunction Counter() {\n  const [state, dispatch] = useReducer(reducer, { count: 0, step: 1 })\n  return (\n    <>\n      <p>{state.count}</p>\n      <button onClick={() => dispatch({ type: 'inc' })}>+{state.step}</button>\n      <button onClick={() => dispatch({ type: 'setStep', step: 5 })}>step=5</button>\n    </>\n  )\n}",
            language: "tsx",
            notes: [
              "reducer は純粋関数 — 同じ入力なら同じ出力、副作用なし",
              "Context + useReducer で簡易グローバル管理も可 (4 章)",
            ],
          },
        ],
        keyTakeaways: [
          "前の state に依存する更新は常に setState(prev => ...) を選ぶ",
          "state は不変。spread / 非破壊メソッド / immer で新しい参照を作る",
          "複雑な状態遷移は useReducer + Discriminated Union の action 型",
          "破壊的 sort / push を props 由来の配列に使わない (1 章 / 6 章にも関連)",
        ],
        comprehensionQuestionIds: ["react-001", "react-007", "react-011", "react-014"],
      },
      {
        id: "effects-and-useeffect",
        title: "3. 副作用と useEffect — 外部システムとの同期",
        intro:
          "useEffect は『外部システムとの同期』のための Hook。typical アンチパターン (派生状態 / async / 依存漏れ) を避けて正しく使う。",
        readingMinutes: 9,
        objectives: [
          "useEffect の発火タイミング (レンダー後 / deps 変化時) と cleanup の役割を説明できる",
          "依存配列の正しい書き方を知り、exhaustive-deps の警告に対処できる",
          "『You Might Not Need an Effect』の典型 4 パターンを判別できる",
        ],
        references: [
          { label: "You Might Not Need an Effect (公式)", url: "https://react.dev/learn/you-might-not-need-an-effect" },
        ],
        sections: [
          {
            heading: "3.1 useEffect の基本と cleanup",
            body: "`useEffect(fn, deps)` でレンダリング後に fn が走る。deps が変わると再実行。fn から関数を return すれば『次の実行前 / アンマウント時』に呼ばれる cleanup になる。subscribe → unsubscribe、setInterval → clearInterval のペアでリソースリークを防ぐ。",
            code: "// 初回マウントのみ\nuseEffect(() => {\n  console.log('mounted')\n  return () => console.log('unmounted')\n}, [])\n\n// タイマー\nuseEffect(() => {\n  const id = setInterval(() => tick(), 1000)\n  return () => clearInterval(id)\n}, [])\n\n// fetch + AbortController\nuseEffect(() => {\n  const ctrl = new AbortController()\n  fetch(`/api/users/${userId}`, { signal: ctrl.signal })\n    .then(r => r.json())\n    .then(setData)\n    .catch(e => { if (e.name !== 'AbortError') setError(e) })\n  return () => ctrl.abort()\n}, [userId])\n\n// イベント\nuseEffect(() => {\n  const onResize = () => setSize(window.innerWidth)\n  window.addEventListener('resize', onResize)\n  return () => window.removeEventListener('resize', onResize)\n}, [])",
            language: "tsx",
            notes: [
              "React 18+ の Strict Mode (開発) は effect を 2 回実行 — 副作用は冪等に書く",
              "deps を省略すると毎レンダリングで再実行 (ほぼ常に間違い)",
            ],
          },
          {
            heading: "3.2 依存配列とクロージャの落とし穴",
            body: "useEffect 内で参照する『state / props / コンポーネント内変数』はすべて依存配列に入れる (`react-hooks/exhaustive-deps` ESLint が自動チェック)。漏れると stale closure (古い値を見続ける) になる。依存を減らすには『useEffect 内で必要な値だけ参照』『派生は useMemo』『最新値の参照は ref』。",
            code: "// ❌ count を使ってるのに deps に入ってない\nuseEffect(() => {\n  const id = setInterval(() => {\n    console.log(count)        // 常に初回の count を見る\n  }, 1000)\n  return () => clearInterval(id)\n}, [])\n\n// ✅ deps に入れる (interval 毎回作り直しになる)\nuseEffect(() => {\n  const id = setInterval(() => console.log(count), 1000)\n  return () => clearInterval(id)\n}, [count])\n\n// ✅ ref で最新値を読む (interval は 1 回だけ)\nconst countRef = useRef(count)\nuseEffect(() => { countRef.current = count }, [count])\nuseEffect(() => {\n  const id = setInterval(() => console.log(countRef.current), 1000)\n  return () => clearInterval(id)\n}, [])",
            language: "tsx",
            notes: [
              "ESLint の exhaustive-deps 警告を勝手に // eslint-disable で消すのは危険",
              "依存に関数を入れる時は useCallback で安定化、または useEffect 内で関数定義",
            ],
          },
          {
            heading: "3.3 You Might Not Need an Effect — 不要な useEffect",
            body: "公式が強く警告するアンチパターン。props/state から導出できる『派生状態』を useEffect で setState すると、無駄な追加レンダーと同期バグの温床になる。レンダー中に計算するか、key prop でリセットするのが正解。",
            code: "// ❌ パターン 1: 派生状態を effect で同期\nfunction UserCard({ first, last }) {\n  const [fullName, setFullName] = useState('')\n  useEffect(() => { setFullName(`${first} ${last}`) }, [first, last])\n  return <p>{fullName}</p>\n}\n\n// ✅ レンダー中に計算\nfunction UserCard({ first, last }) {\n  const fullName = `${first} ${last}`\n  return <p>{fullName}</p>\n}\n\n// ❌ パターン 2: props 変化で state リセット\nfunction Profile({ userId }) {\n  const [comment, setComment] = useState('')\n  useEffect(() => { setComment('') }, [userId])   // userId 変化で空に\n  ...\n}\n\n// ✅ key で unmount → remount\n<Profile key={userId} userId={userId} />\n\n// ❌ パターン 3: イベントハンドラのロジックを effect に\nuseEffect(() => {\n  if (submitted) {\n    fetch('/api/submit', { method: 'POST', body: ... })\n    showToast()\n  }\n}, [submitted])\n\n// ✅ ハンドラに直接書く\nconst handleSubmit = async () => {\n  await fetch('/api/submit', ...)\n  showToast()\n}\n\n// ❌ パターン 4: async を直接 useEffect に\nuseEffect(async () => { ... })   // ← async は不可 (戻り値が Promise)\n\n// ✅ 内側で async 関数を定義 + 呼ぶ\nuseEffect(() => {\n  let cancelled = false\n  ;(async () => {\n    const data = await fetch(url).then(r => r.json())\n    if (!cancelled) setData(data)\n  })()\n  return () => { cancelled = true }\n}, [url])",
            language: "tsx",
            notes: [
              "useEffect の用途は『外部システムとの同期』(DOM 操作・タイマー・API 接続・購読) に絞る",
              "API 取得は TanStack Query / SWR / Suspense 統合の方が安全 (4 章 / 7 章)",
            ],
          },
        ],
        keyTakeaways: [
          "useEffect は『外部システムとの同期』専用、return で必ず cleanup",
          "依存配列は exhaustive-deps 警告に従う、最新値が欲しい時は ref",
          "派生状態は effect で同期せず、レンダー中に計算する",
          "state リセットは key prop での remount が定番",
        ],
        comprehensionQuestionIds: ["react-002", "react-010", "react-020"],
      },
      {
        id: "context-custom-hooks-and-state-libs",
        title: "4. 共有とコンポジション — Context / Custom Hook / 状態管理ライブラリ",
        intro:
          "ツリー越しに値を渡す Context、ロジックを再利用する Custom Hook、そしてグローバル状態管理ライブラリ (Zustand / TanStack Query) との使い分けを整理。",
        readingMinutes: 9,
        objectives: [
          "Context API の Provider と useContext を書ける、適不適を判断できる",
          "Custom Hook (`useXxx`) の命名規約と Hook ルールを理解する",
          "クライアント state / server state / フォーム state の使い分けを説明できる",
        ],
        sections: [
          {
            heading: "4.1 Context API — Prop drilling を避ける",
            body: "`createContext` で Context を作り、`<Context.Provider value={...}>` で囲み、`useContext(Context)` で消費。テーマ / 認証ユーザー / ロケールなど『静的に近い、ツリー全体で使う値』に最適。頻繁に変わる値だと、消費する全コンポーネントが再レンダリングするので不向き。",
            code: "type Theme = 'light' | 'dark'\nconst ThemeContext = createContext<Theme>('light')\n\n// Provider\nfunction App() {\n  const [theme, setTheme] = useState<Theme>('light')\n  return (\n    <ThemeContext.Provider value={theme}>\n      <button onClick={() => setTheme(t => t === 'light' ? 'dark' : 'light')}>toggle</button>\n      <Page />\n    </ThemeContext.Provider>\n  )\n}\n\n// 消費 (どんなに深くても)\nfunction DeepChild() {\n  const theme = useContext(ThemeContext)\n  return <div className={theme}>...</div>\n}\n\n// React 19+ は <Context value={...}> だけで OK (Provider 省略可)\n<ThemeContext value={theme}>...\n\n// Context + useReducer で簡易グローバル管理\nconst AuthContext = createContext<{ user: User | null; dispatch: Dispatch<AuthAction> } | null>(null)\nfunction AuthProvider({ children }) {\n  const [user, dispatch] = useReducer(authReducer, null)\n  return <AuthContext value={{ user, dispatch }}>{children}</AuthContext>\n}\nexport const useAuth = () => useContext(AuthContext)!",
            language: "tsx",
            notes: [
              "Context は『静的に近い値』向き — 高頻度更新は Zustand 等の方が局所更新できる",
              "Provider で value をオブジェクト即時生成すると毎レンダーで参照が変わる → useMemo で安定化推奨",
            ],
          },
          {
            heading: "4.2 Custom Hook — ロジックの再利用",
            body: "`use` で始まる関数を作れば Custom Hook。中で他の Hook を使えるので、複雑なロジック (Debounce / API fetch / フォーム / LocalStorage 同期) を切り出して複数コンポーネントで再利用できる。Hook ルール: 最上位でのみ呼ぶ・関数コンポーネント or 他の Hook 内のみ。",
            code: "// useDebounce: 値の変化を ms ミリ秒遅らせる\nfunction useDebounce<T>(value: T, ms: number): T {\n  const [debounced, setDebounced] = useState(value)\n  useEffect(() => {\n    const id = setTimeout(() => setDebounced(value), ms)\n    return () => clearTimeout(id)\n  }, [value, ms])\n  return debounced\n}\n\n// useLocalStorage: state を LocalStorage と同期\nfunction useLocalStorage<T>(key: string, initial: T) {\n  const [value, setValue] = useState<T>(() => {\n    const raw = localStorage.getItem(key)\n    return raw ? (JSON.parse(raw) as T) : initial\n  })\n  useEffect(() => {\n    localStorage.setItem(key, JSON.stringify(value))\n  }, [key, value])\n  return [value, setValue] as const\n}\n\n// 使う側\nfunction Search() {\n  const [q, setQ] = useState('')\n  const debounced = useDebounce(q, 300)\n  useEffect(() => {\n    if (debounced) search(debounced)\n  }, [debounced])\n  return <input value={q} onChange={e => setQ(e.target.value)} />\n}",
            language: "tsx",
            notes: [
              "Hook ルール: if / for / try の中で呼ばない — React は呼び出し順序で state を識別",
              "ESLint の `react-hooks/rules-of-hooks` + `exhaustive-deps` を必ず有効化",
            ],
          },
          {
            heading: "4.3 状態管理ライブラリの使い分け",
            body: "現代の React は『state の種類別に道具を選ぶ』のが定石: クライアント state は Zustand / Jotai / Redux Toolkit、サーバー state (API キャッシュ) は TanStack Query / SWR、フォームは React Hook Form / TanStack Form。何でも Redux の時代は終わった。",
            code: "// Zustand (軽量・人気、API 学習コスト低)\nimport { create } from 'zustand'\ntype State = { count: number; inc: () => void }\nconst useStore = create<State>((set) => ({\n  count: 0,\n  inc: () => set(s => ({ count: s.count + 1 })),\n}))\nfunction Counter() {\n  const { count, inc } = useStore()\n  return <button onClick={inc}>{count}</button>\n}\n\n// TanStack Query (サーバー state)\nimport { useQuery } from '@tanstack/react-query'\nfunction Posts({ id }: { id: number }) {\n  const { data, isLoading, error } = useQuery({\n    queryKey: ['post', id],\n    queryFn: () => fetch(`/api/posts/${id}`).then(r => r.json()),\n    staleTime: 60_000,\n  })\n  if (isLoading) return <Loading />\n  if (error) return <Error />\n  return <Article post={data!} />\n}\n\n// React Hook Form (フォーム)\nimport { useForm } from 'react-hook-form'\nfunction LoginForm() {\n  const { register, handleSubmit, formState: { errors } } = useForm<{ email: string; password: string }>()\n  return (\n    <form onSubmit={handleSubmit(login)}>\n      <input {...register('email', { required: true })} />\n      {errors.email && <p>required</p>}\n      <input type=\"password\" {...register('password')} />\n      <button>Login</button>\n    </form>\n  )\n}",
            language: "tsx",
            notes: [
              "API キャッシュは useState + useEffect で再発明しない — TanStack Query / SWR が完成度高",
              "フォームは入力ごとの再レンダーを抑えるため React Hook Form (uncontrolled ベース) が高速",
              "Redux は『時系列デバッグ / strict な状態管理が必要な大規模』向け — 軽い用途は Zustand で十分",
            ],
          },
        ],
        keyTakeaways: [
          "Context は静的に近い値 (テーマ / 認証) 向き、頻繁更新は不向き",
          "Custom Hook (use*) でロジックを再利用、ESLint の rules-of-hooks を信頼",
          "state は種類別に道具を選ぶ: クライアント = Zustand、server = TanStack Query、form = RHF",
        ],
        comprehensionQuestionIds: ["react-005", "react-008", "react-012", "react-017"],
      },
      {
        id: "forms-and-refs",
        title: "5. フォームと Ref — 制御コンポーネントと DOM アクセス",
        intro:
          "フォーム入力を state と同期する Controlled Component、DOM や永続値を扱う useRef、子の DOM を親に公開する forwardRef (React 19 では props に統合) を整理。",
        readingMinutes: 8,
        objectives: [
          "Controlled と Uncontrolled の違いを書き分けられる",
          "useRef を DOM 参照 / 再レンダリング不要な値の保持の 2 用途で使い分けられる",
          "forwardRef (React 18) と props ref (React 19) の書き方を知る",
        ],
        sections: [
          {
            heading: "5.1 Controlled Component (制御コンポーネント)",
            body: "`value` を state にバインドし、`onChange` で state を更新する書き方。React の state が『唯一の真実』となり、バリデーション・条件付き有効化・整形が書きやすい。Vue の `v-model` はこれの糖衣構文。",
            code: "function LoginForm() {\n  const [email, setEmail] = useState('')\n  const [password, setPassword] = useState('')\n  const isValid = email.includes('@') && password.length >= 8\n\n  return (\n    <form onSubmit={(e) => {\n      e.preventDefault()\n      login(email, password)\n    }}>\n      <input\n        type=\"email\"\n        value={email}\n        onChange={(e) => setEmail(e.target.value)}\n        required\n      />\n      <input\n        type=\"password\"\n        value={password}\n        onChange={(e) => setPassword(e.target.value)}\n      />\n      <button disabled={!isValid}>Login</button>\n    </form>\n  )\n}\n\n// useReducer で複数フィールドをまとめる\ntype FormState = { email: string; password: string; remember: boolean }\nfunction reducer(s: FormState, p: Partial<FormState>): FormState { return { ...s, ...p } }\nconst [form, update] = useReducer(reducer, { email: '', password: '', remember: false })\n<input value={form.email} onChange={e => update({ email: e.target.value })} />",
            language: "tsx",
            notes: [
              "input の `value` が undefined だと『Controlled → Uncontrolled に変わった』警告 — 初期値で空文字を必ず設定",
              "数値入力は `valueAsNumber` を使うか onChange で parseInt",
            ],
          },
          {
            heading: "5.2 Uncontrolled Component と useRef",
            body: "Uncontrolled は state を持たず DOM が真実、`ref` で値を読み出す方式。フィールド数が多い・パフォーマンスを優先する場合や、React Hook Form の内部実装でも使われる。`defaultValue` で初期値を渡す (value ではない)。",
            code: "function Form() {\n  const emailRef = useRef<HTMLInputElement>(null)\n  const passwordRef = useRef<HTMLInputElement>(null)\n\n  const handleSubmit = (e: React.FormEvent) => {\n    e.preventDefault()\n    login(emailRef.current!.value, passwordRef.current!.value)\n  }\n\n  return (\n    <form onSubmit={handleSubmit}>\n      <input ref={emailRef} type=\"email\" defaultValue=\"\" />\n      <input ref={passwordRef} type=\"password\" defaultValue=\"\" />\n      <button>Login</button>\n    </form>\n  )\n}",
            language: "tsx",
            notes: [
              "Controlled = state が真実、Uncontrolled = DOM が真実",
              "迷ったら Controlled が安全。パフォーマンス問題が出てから Uncontrolled / RHF に切り替え",
            ],
          },
          {
            heading: "5.3 useRef の 2 つの顔",
            body: "useRef は (1) DOM への参照、(2) 再レンダリングしない可変な値、の 2 用途。`ref.current` の代入は再レンダリングを発生させない (state とは違う) ので、タイマー ID やインスタンスを保持するのに最適。",
            code: "// (1) DOM 参照\nfunction Input() {\n  const inputRef = useRef<HTMLInputElement>(null)\n  useEffect(() => { inputRef.current?.focus() }, [])\n  return <input ref={inputRef} />\n}\n\n// スクロール\nconst boxRef = useRef<HTMLDivElement>(null)\nconst scrollToTop = () => boxRef.current?.scrollTo({ top: 0, behavior: 'smooth' })\n\n// (2) 再レンダリング不要な値\nfunction Timer() {\n  const intervalRef = useRef<number | null>(null)\n  const startedAtRef = useRef<number>(Date.now())\n\n  useEffect(() => {\n    intervalRef.current = window.setInterval(tick, 1000)\n    return () => {\n      if (intervalRef.current) window.clearInterval(intervalRef.current)\n    }\n  }, [])\n}\n\n// 最新値を closure に閉じ込めずに参照したい時\nconst countRef = useRef(count)\nuseEffect(() => { countRef.current = count }, [count])\nuseEffect(() => {\n  const id = setInterval(() => console.log(countRef.current), 1000)\n  return () => clearInterval(id)\n}, [])",
            language: "tsx",
            notes: [
              "ref.current は『描画と独立した可変領域』 — レンダー結果に影響する値は state を使う",
              "ref を読むタイミングはレンダー後 (useEffect / イベント) — レンダー中の参照は避ける",
            ],
          },
          {
            heading: "5.4 forwardRef と React 19 の props ref",
            body: "子コンポーネント自身の DOM を親が ref で取りたい時、React 18 までは `forwardRef` でラップが必要だった。React 19+ では関数コンポーネントが `ref` を普通の props として受け取れるようになり、forwardRef が不要に。",
            code: "// React 18 まで\nimport { forwardRef } from 'react'\nconst MyInput = forwardRef<HTMLInputElement, { label: string }>(\n  ({ label }, ref) => (\n    <label>\n      {label}\n      <input ref={ref} />\n    </label>\n  )\n)\n\n// 親\nconst ref = useRef<HTMLInputElement>(null)\n<MyInput ref={ref} label=\"name\" />\nref.current?.focus()\n\n// React 19+ (forwardRef 不要)\nfunction MyInput({ label, ref }: { label: string; ref: React.Ref<HTMLInputElement> }) {\n  return (\n    <label>\n      {label}\n      <input ref={ref} />\n    </label>\n  )\n}\n\n// useImperativeHandle で『公開する API』を絞る\nfunction MyInput({ ref }: { ref: React.Ref<{ focus: () => void; clear: () => void }> }) {\n  const inputRef = useRef<HTMLInputElement>(null)\n  useImperativeHandle(ref, () => ({\n    focus: () => inputRef.current?.focus(),\n    clear: () => { if (inputRef.current) inputRef.current.value = '' },\n  }))\n  return <input ref={inputRef} />\n}",
            language: "tsx",
            notes: [
              "useImperativeHandle は『DOM 全部ではなく特定の API だけ公開したい』時に使う",
              "ref をむやみに親に公開すると封じ込めが崩れるので最後の手段",
            ],
          },
        ],
        keyTakeaways: [
          "迷ったら Controlled、フォーム規模が大きいなら React Hook Form (Uncontrolled ベース)",
          "useRef は DOM 参照 + 再レンダリング不要な値の 2 用途",
          "React 19+ では ref が普通の props に — forwardRef は徐々に消える",
        ],
        comprehensionQuestionIds: ["react-009", "react-013"],
      },
      {
        id: "performance-and-rerenders",
        title: "6. パフォーマンスと再レンダリング — memo / useMemo / Profiler / React Compiler",
        intro:
          "再レンダリングは速いが、巨大な計算や大きな子ツリーは別。React.memo / useMemo / useCallback の使いどころと、Profiler での計測 → 対策 → 再計測のサイクルを整理。",
        readingMinutes: 9,
        objectives: [
          "React.memo / useMemo / useCallback の役割を区別できる",
          "本当に必要な場所だけメモ化する原則 (計測してから) を理解する",
          "React Compiler (React 19+) で自動メモ化される未来を知る",
        ],
        sections: [
          {
            heading: "6.1 React.memo — props 同値で再レンダリングをスキップ",
            body: "`React.memo(Component)` でラップすると、props が浅い比較 (`Object.is`) で同じなら再レンダリングをスキップ。親が再レンダリングしても子は不変。ただし props にオブジェクト / 関数 / 配列を渡すと毎回 new で参照が変わるので、`useMemo` / `useCallback` で安定化する必要がある。",
            code: "// 普通の子は親の再レンダリングで毎回再レンダリング\nfunction Child({ value }: { value: number }) {\n  console.log('render Child')\n  return <div>{value}</div>\n}\n\n// memo でラップ\nconst MemoChild = React.memo(function Child({ value }: { value: number }) {\n  console.log('render MemoChild')\n  return <div>{value}</div>\n})\n\nfunction Parent() {\n  const [n, setN] = useState(0)\n  return (\n    <>\n      <button onClick={() => setN(n + 1)}>{n}</button>\n      <Child value={42} />          {/* n 変化で毎回 render */}\n      <MemoChild value={42} />      {/* 42 のままなので skip */}\n    </>\n  )\n}\n\n// props に関数を渡すと... 毎回新しい参照\n<MemoChild value={42} onClick={() => doX(id)} />\n// ↑ onClick が毎回 new → memo が効かない\n\n// useCallback で安定化\nconst onClick = useCallback(() => doX(id), [id])\n<MemoChild value={42} onClick={onClick} />\n\n// オブジェクトも同様\nconst options = useMemo(() => ({ size: 10 }), [])\n<MemoChild options={options} />",
            language: "tsx",
            notes: [
              "memo は『浅い』比較。深いオブジェクトの中身比較が必要なら第 2 引数で custom 比較関数",
              "全 Component を memo にすると逆に重くなる (比較コスト) — 計測してから",
            ],
          },
          {
            heading: "6.2 useMemo / useCallback — いつ使うか",
            body: "`useMemo(() => expensive(), deps)` は重い計算結果のキャッシュ、`useCallback(fn, deps)` は関数自体のキャッシュ。本当に効くケースは: (1) memo 済みの子に渡すオブジェクト / 関数 props を安定化、(2) 確実に重い計算 (大量データの filter+sort)、(3) 派生値で useEffect の依存に入る関数 / オブジェクト。",
            code: "// ✅ 重い計算 (大量データのフィルタ + ソート)\nconst filtered = useMemo(\n  () => items.filter(i => i.matches(query)).sort((a, b) => a.name.localeCompare(b.name)),\n  [items, query]\n)\n\n// ✅ memo 済み子の props 安定化\nconst onClick = useCallback(() => doSomething(id), [id])\n<MemoChild onClick={onClick} />\n\n// ✅ useEffect の依存に入る値\nconst params = useMemo(() => ({ id, page }), [id, page])\nuseEffect(() => { fetch(buildUrl(params)) }, [params])\n\n// ❌ 安易な濫用 (比較コストが上回る)\nconst x = useMemo(() => a + b, [a, b])   // ← 単純加算には不要\nconst handler = useCallback(() => {}, [])  // ← 渡し先がない関数を安定化しても意味なし",
            language: "tsx",
            notes: [
              "useMemo / useCallback は『正しさ』のためではなく『性能最適化』のためのみ — 機能のために頼らない",
              "React Compiler (次節) が自動でやってくれる未来が来る",
            ],
          },
          {
            heading: "6.3 Profiler で計測 → 対策 → 再計測",
            body: "ブラウザ拡張 React DevTools の Profiler タブで『どのコンポーネントが何 ms で描画されたか / 再レンダリング理由』を可視化できる。『推測するな、計測せよ』。Why-Did-You-Render ライブラリで『なぜ再レンダリングしたか』を console に出すと props 差分も追える。",
            code: "// 計測手順\n// 1. ブラウザに React DevTools 拡張をインストール\n// 2. DevTools の『Profiler』タブを開く\n// 3. 録画ボタン (●) を押す\n// 4. アプリを操作する\n// 5. 録画停止\n// 6. 各コンポーネントの『描画時間』『再レンダリング回数』『理由』が見える\n\n// why-did-you-render (開発時)\nimport whyDidYouRender from '@welldone-software/why-did-you-render'\nif (process.env.NODE_ENV === 'development') {\n  whyDidYouRender(React, { trackAllPureComponents: true })\n}\nMyComponent.whyDidYouRender = true\n// 不要な再レンダリング時に console に props 差分が出る",
            language: "tsx",
            notes: [
              "Production ビルドは Profiler 用に別ビルドが必要 (Next.js は --profile フラグ)",
              "並行 Mode の commit / mount / update のフラグも色分けで見える",
            ],
          },
          {
            heading: "6.4 React Compiler — 自動メモ化の未来",
            body: "React Compiler (React 19 で実験的・2025 年に向けて安定化) はビルド時にコードを解析し、必要な useMemo / useCallback / memo を自動で挿入する。これにより手動メモ化のほとんどが不要になる予定。導入は Babel プラグイン or SWC プラグインで段階的に。",
            code: "// 現在 (手動メモ化)\nconst filtered = useMemo(\n  () => items.filter(i => i.active),\n  [items]\n)\nconst onClick = useCallback(() => action(id), [id])\n\n// React Compiler 適用後 (手動メモ化が不要に)\nconst filtered = items.filter(i => i.active)\nconst onClick = () => action(id)\n// Compiler が依存解析して自動でメモ化\n\n// Babel プラグイン (実験)\n// .babelrc\n// {\n//   \"plugins\": [\"babel-plugin-react-compiler\"]\n// }\n\n// eslint-plugin-react-compiler で Compiler 非互換コードを検出\n// (条件分岐内 Hook、mutate しているコード、etc)",
            language: "tsx",
            notes: [
              "Compiler の前提は『React のルール (Hook ルール + props/state を mutate しない) を守る』こと",
              "守れていれば手動メモ化を消していける — Compiler 導入前に ESLint + 型でルールを徹底",
            ],
          },
        ],
        keyTakeaways: [
          "React.memo は props 同値で再レンダリングスキップ、関数/オブジェクト props は useCallback/useMemo で安定化",
          "安易なメモ化は逆効果 — Profiler で計測してから",
          "React Compiler の到来で手動メモ化は減る方向 — ルールを守るコードが資産に",
        ],
        comprehensionQuestionIds: ["react-004", "react-019"],
      },
      {
        id: "suspense-error-boundary-and-rsc",
        title: "7. Suspense / Error Boundary / Server Components",
        intro:
          "宣言的にローディングとエラーを扱う Suspense と Error Boundary、そして React 19+ で本格化する Server Components / Server Actions / use() Hook を整理。",
        readingMinutes: 10,
        objectives: [
          "<Suspense fallback={...}> でデータ取得中の UI を宣言的に書ける",
          "Error Boundary (react-error-boundary) でツリー単位のエラーを捕捉できる",
          "Server / Client Components の境界、Server Actions、use() Hook の役割を理解する",
        ],
        references: [
          { label: "Server Components (公式)", url: "https://react.dev/reference/rsc/server-components" },
          { label: "Suspense (公式)", url: "https://react.dev/reference/react/Suspense" },
        ],
        sections: [
          {
            heading: "7.1 Suspense — ローディングを宣言的に",
            body: "`<Suspense fallback={<Loading />}>` で囲んだ中で『データ準備中』のコンポーネントが現れると、自動で fallback が表示される。TanStack Query (`useSuspenseQuery`)、Next.js App Router (Server Component の async)、Relay などが対応。`if (loading) return <Loading />` をコンポーネント毎に書く必要がなくなる。",
            code: "import { Suspense } from 'react'\n\n// Next.js App Router (Server Component)\nexport default function Page() {\n  return (\n    <main>\n      <h1>Posts</h1>\n      <Suspense fallback={<Skeleton />}>\n        <Posts />          {/* async Server Component、データ取得中は Skeleton */}\n      </Suspense>\n    </main>\n  )\n}\n\nasync function Posts() {\n  const posts = await db.post.findMany()\n  return <PostList items={posts} />\n}\n\n// クライアント (TanStack Query)\nimport { useSuspenseQuery } from '@tanstack/react-query'\nfunction Posts() {\n  const { data } = useSuspenseQuery({\n    queryKey: ['posts'],\n    queryFn: () => fetch('/api/posts').then(r => r.json()),\n  })\n  return <PostList items={data} />\n}",
            language: "tsx",
            notes: [
              "Suspense は『データ取得中 = まだ render できない』を React に伝える仕組み",
              "Next.js App Router では Suspense 境界ごとにストリーミング SSR (HTML を部分配信)",
            ],
          },
          {
            heading: "7.2 Error Boundary — ツリー単位のエラー捕捉",
            body: "render / lifecycle / Hook で発生した例外を捕捉してフォールバック UI を表示する仕組み。React 本体には class 版しかないので、関数コンポーネントで書きたいなら `react-error-boundary` ライブラリが定番。Sentry 等のエラー監視に統合するのが実務の鉄板。",
            code: "import { ErrorBoundary } from 'react-error-boundary'\n\nfunction Fallback({ error, resetErrorBoundary }: { error: Error; resetErrorBoundary: () => void }) {\n  return (\n    <div role=\"alert\">\n      <p>Something went wrong:</p>\n      <pre>{error.message}</pre>\n      <button onClick={resetErrorBoundary}>Retry</button>\n    </div>\n  )\n}\n\n<ErrorBoundary\n  FallbackComponent={Fallback}\n  onError={(err, info) => Sentry.captureException(err, { extra: info })}\n  onReset={() => refetch()}\n>\n  <Suspense fallback={<Loading />}>\n    <Posts />\n  </Suspense>\n</ErrorBoundary>",
            language: "tsx",
            notes: [
              "Error Boundary は『render 中』のエラーだけ捕捉 — イベントハンドラ内のエラーは普通の try/catch で",
              "非同期 (Promise / setTimeout) のエラーも対象外 — Promise 内で setState して、その値を render 時に throw する手も",
              "Suspense と組み合わせるとローディング (Suspense) + 失敗 (Error Boundary) を両方宣言的に",
            ],
          },
          {
            heading: "7.3 Server / Client Components の境界 (RSC)",
            body: "Next.js App Router など RSC 対応フレームワークでは、Server Component (デフォルト、ファイル末尾に `'use client'` 無し) と Client Component (`'use client'` 付き) の 2 種類が共存する。Server は async や DB 直接アクセスが書ける、Client は state / Hook が使える。境界を越える props は『シリアライズ可能』なものに限る。",
            code: "// app/page.tsx (Server Component — デフォルト)\nimport { Counter } from './counter'           // Client\nimport { db } from '@/lib/db'\n\nexport default async function Page() {\n  const items = await db.item.findMany()       // Server で DB アクセス\n  return (\n    <main>\n      <h1>Items</h1>\n      <ul>{items.map(i => <li key={i.id}>{i.name}</li>)}</ul>\n      <Counter initial={items.length} />        {/* number = OK */}\n    </main>\n  )\n}\n\n// app/counter.tsx (Client Component)\n'use client'\nimport { useState } from 'react'\n\ntype Props = {\n  initial: number\n  // onClick: () => void   ❌ 関数は Server → Client に渡せない\n  // date: Date            ❌ Date もダメ (文字列にして渡す)\n}\n\nexport function Counter({ initial }: Props) {\n  const [n, setN] = useState(initial)\n  return <button onClick={() => setN(n + 1)}>{n}</button>\n}",
            language: "tsx",
            notes: [
              "Server Component は『ブラウザに JS が配信されない』 — バンドルサイズ削減",
              "Client は state / useEffect / イベントハンドラ / ブラウザ API のために必要な時に限定",
              "シリアライズ可能 = string / number / boolean / null / 配列 / プレーンオブジェクト / Promise (React 19+)",
            ],
          },
          {
            heading: "7.4 use() Hook と Server Actions (React 19+)",
            body: "React 19 で `use(promise)` Hook が登場 — Promise を渡すと Suspense 統合で値を取り出せる (try/await 風)。`use(Context)` でも Context を読める。Server Actions (`'use server'` の関数) は `<form action={fn}>` 経由で Server 側関数を呼べ、Rails の `form_with` 的体験。",
            code: "// use(promise) — Promise を関数的に解決\nimport { use, Suspense } from 'react'\n\nfunction Posts({ promise }: { promise: Promise<Post[]> }) {\n  const posts = use(promise)        // suspense と統合\n  return <PostList items={posts} />\n}\n\nexport default function Page() {\n  const promise = fetchPosts()      // Promise を作るだけ (await しない)\n  return (\n    <Suspense fallback={<Loading />}>\n      <Posts promise={promise} />\n    </Suspense>\n  )\n}\n\n// Server Actions\n// app/actions.ts\n'use server'\nimport { db } from '@/lib/db'\nexport async function createPost(formData: FormData) {\n  const title = formData.get('title') as string\n  await db.post.create({ data: { title } })\n}\n\n// app/new-post.tsx\nimport { createPost } from './actions'\nexport default function NewPost() {\n  return (\n    <form action={createPost}>\n      <input name=\"title\" />\n      <button>Create</button>\n    </form>\n  )\n}\n\n// useTransition + 楽観的更新\nconst [pending, startTransition] = useTransition()\nstartTransition(async () => {\n  await createPost(formData)\n})\n\n// useOptimistic\nconst [optimisticTodos, addOptimistic] = useOptimistic(\n  todos,\n  (state, newTodo: Todo) => [...state, { ...newTodo, pending: true }]\n)",
            language: "tsx",
            notes: [
              "use() は if の中でも呼べる (Hook ルールの例外) — 条件付きで Promise を解決可能",
              "Server Actions の戻り値は『シリアライズ可能』なものに限る、エラーは throw でなく戻り値で返す慣習",
              "useTransition / useOptimistic で『送信中も UI を反応的に』",
            ],
          },
        ],
        keyTakeaways: [
          "<Suspense fallback={...}> でローディングを宣言的に、Error Boundary でエラーを宣言的に",
          "Server / Client Components の境界を意識、props はシリアライズ可能なものに",
          "React 19+ の use() / Server Actions / useOptimistic で『送信 → 反映』の体験が一段階上がる",
        ],
        comprehensionQuestionIds: ["react-015", "react-016", "react-018"],
      },
    ],
  },
];

export const findGuide = (id: string) => guides.find((g) => g.id === id);

export const guidesByTrack = (trackId: TrackId) =>
  guides.filter((g) => g.trackId === trackId);
