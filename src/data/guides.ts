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
  /** オプションの Mermaid 図 (flowchart / sequence / classDiagram など) */
  diagram?: string;
  /** 図のキャプション (図のすぐ下に表示) */
  diagramCaption?: string;
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
            diagram: `flowchart TB
  subgraph INNER ["INNER JOIN"]
    direction LR
    A1["users<br/>(投稿あり)"]:::both --- B1["posts<br/>(著者あり)"]:::both
  end
  subgraph LEFT ["LEFT JOIN"]
    direction LR
    A2["users<br/>(全員)"]:::left --- B2["posts<br/>+ NULL 補完"]:::nullable
  end
  subgraph RIGHT ["RIGHT JOIN"]
    direction LR
    A3["users<br/>+ NULL 補完"]:::nullable --- B3["posts<br/>(全件)"]:::right
  end
  subgraph FULL ["FULL OUTER JOIN"]
    direction LR
    A4["users<br/>+ NULL"]:::nullable --- B4["posts<br/>+ NULL"]:::nullable
  end
  classDef both fill:#fef3c7,stroke:#f59e0b
  classDef left fill:#dbeafe,stroke:#3b82f6
  classDef right fill:#ddd6fe,stroke:#8b5cf6
  classDef nullable fill:#fee2e2,stroke:#ef4444,stroke-dasharray: 5 5`,
            diagramCaption: "JOIN の 4 種類 — どちらの行を『必ず残すか』と『NULL 補完するか』の違い",
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
            diagram: `sequenceDiagram
  participant Browser
  participant Server
  participant DB

  Browser->>Server: GET /dashboard
  Server-->>Browser: HTML (shell + Skeleton 1, Skeleton 2)
  Note over Browser: 早期 TTFB (即描画)
  par UserStats (fast)
    Server->>DB: SELECT stats
    DB-->>Server: 結果 (50ms)
    Server-->>Browser: <chunk> UserStats HTML
    Note over Browser: Skeleton 1 → 実 UI
  and Charts (slow)
    Server->>DB: 複雑な集計
    DB-->>Server: 結果 (800ms)
    Server-->>Browser: <chunk> Charts HTML
    Note over Browser: Skeleton 2 → 実 UI
  end`,
            diagramCaption: "Suspense + Streaming SSR: 全データ完了を待たず、準備できた部品から順に HTML を配信",
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

  // ---------- Next.js 入門ガイド ----------
  {
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
  },

  // ---------- Nuxt 入門ガイド ----------
  {
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
  },

  // ---------- Git 入門ガイド ----------
  {
    id: "git-intro",
    trackId: "git",
    title: "Git の地図 — 履歴を読む・書く・直す",
    subtitle:
      "Git の 3 エリア → ブランチ/マージ戦略 → リモート → 履歴修正と救出 → 高度操作 → GitHub/PR → GitHub Actions と運用、を 7 章で",
    audience:
      "git add / commit / push しか使えていない人、コンフリクトが怖い人、rebase / cherry-pick / bisect / reflog で困っている人",
    sources: [
      { label: "Pro Git Book (公式・無料・日本語あり)", url: "https://git-scm.com/book/ja/v2" },
      { label: "git-scm リファレンス", url: "https://git-scm.com/docs" },
      { label: "GitHub Docs", url: "https://docs.github.com/" },
    ],
    emoji: "🔧",
    relatedCategoryIds: ["git-github"],
    chapters: [
      {
        id: "git-3-areas-and-basics",
        title: "1. Git の 3 エリア — 作業ツリー / インデックス / リポジトリ",
        intro:
          "Git の心臓部は『3 つのエリア』。作業ツリー (ファイル) → インデックス (ステージ) → リポジトリ (コミット履歴)。これを掴めばあとのコマンドが地続きで理解できる。",
        readingMinutes: 7,
        objectives: [
          "作業ツリー / インデックス (ステージ) / リポジトリの 3 エリアを説明できる",
          "status / diff / diff --cached を読み分けられる",
          "commit / log / show でコミットを読める",
        ],
        sections: [
          {
            heading: "1.1 3 エリアの全体像",
            body: "Git はファイルを 3 つの状態で管理する。**作業ツリー (Working Tree)**: 実際のファイル。**インデックス (Index / Staging Area)**: 次のコミットに含める変更の予約箱。**ローカルリポジトリ**: 過去のコミット履歴 (.git/)。`add` で作業ツリー → インデックス、`commit` でインデックス → リポジトリ。",
            code: "[作業ツリー] -- git add --> [インデックス] -- git commit --> [リポジトリ]\n              <- git restore <-                  <- git reset <-\n\n# 例\necho 'hello' > foo.txt           # 作業ツリーを編集\ngit add foo.txt                   # インデックスに登録\ngit commit -m 'add foo'           # リポジトリへコミット\n\n# 取消の方向\ngit restore foo.txt               # 作業ツリーを最後のコミットに戻す (危険)\ngit restore --staged foo.txt      # インデックスから外す (作業ツリーは保つ)\ngit reset --soft HEAD~1           # 最新コミットを取消 (変更はインデックスに残す)\ngit reset --hard HEAD~1           # 最新コミットを取消 + 作業ツリーも巻き戻し (危険)",
            language: "bash",
            diagram: `flowchart LR
  WT["作業ツリー\\n(Working Tree)"] -- "git add" --> IDX["インデックス\\n(Staging)"]
  IDX -- "git commit" --> REPO["ローカルリポジトリ\\n(.git/)"]
  IDX -- "git restore --staged" --> WT
  REPO -- "git restore" --> WT
  REPO -- "git reset --soft" --> IDX
  REPO -- "git reset --hard" --> WT
  REPO -- "git push" --> REMOTE["リモート\\n(origin)"]
  REMOTE -- "git fetch / pull" --> REPO`,
            diagramCaption: "Git の 3 エリアと主要コマンドの流れ",
            notes: [
              "コミットは git の最小単位 (snapshot + parent + author + message)",
              ".git/ ディレクトリにすべての履歴が保存されている — リポジトリそのもの",
            ],
          },
          {
            heading: "1.2 status と diff を読む",
            body: "`git status` は現在の状態を要約。色付き 3 セクション (staged / not staged / untracked) を読み分ける。`git diff` は『インデックスに対する作業ツリーの差分』(まだ add してない変更)、`git diff --cached` は『最後のコミットに対するインデックスの差分』(add 済み未コミット)。",
            code: "$ git status\nOn branch main\nChanges to be committed:               <- add 済み (インデックス)\n  modified:   app/models/user.rb\nChanges not staged for commit:         <- まだ add していない\n  modified:   app/models/post.rb\nUntracked files:                       <- Git が追跡していない (.gitignore 候補)\n  config/secrets.yml\n\n# 差分の見方\ngit diff                          # 作業ツリー vs インデックス (まだ add していない)\ngit diff --cached                 # インデックス vs HEAD (add 済み未コミット)\ngit diff HEAD                     # 作業ツリー vs HEAD (両方の和)\ngit diff main..feature            # ブランチ間\ngit diff --stat                   # ファイル単位の追加/削除行サマリ\ngit diff -- app/                  # パス指定 (-- は曖昧さ解消)",
            language: "bash",
            notes: [
              ".gitignore で追跡したくないファイル (build 成果物 / .env / log) をパターン指定",
              "git diff の出力は `diff -u` と同じ unified diff 形式 (10 章 SQL ガイドにも同じ仕組み)",
            ],
          },
          {
            heading: "1.3 log と show — 履歴を読む",
            body: "`git log` で履歴一覧、`git show <SHA>` でそのコミットの詳細 (メッセージ + diff)。1 行表示 / グラフ / 著者・日付フィルタ / パス絞り込み・pickaxe 検索 (`-S`) が頻出。",
            code: "# 基本\ngit log                                    # フル詳細\ngit log --oneline                          # 1 行ずつ\ngit log --oneline --graph --all --decorate # 全ブランチ + グラフ + ラベル\ngit log -5                                  # 最新 5 件\ngit log --since='1 week ago'\ngit log --author='Alice'\ngit log -- app/models/user.rb              # ファイル指定\ngit log -p -- app/models/user.rb           # diff 付き\n\n# コミット詳細\ngit show HEAD                              # 最新コミット\ngit show abc1234                           # 指定 SHA\ngit show HEAD~3                            # 3 つ前\ngit show HEAD:app/models/user.rb           # そのコミット時点のファイル内容\n\n# pickaxe — 文字列が追加 / 削除されたコミットを検索 (8 章で再登場)\ngit log -S 'def calculate_tax'             # 出現回数の変化\ngit log -G 'TODO.*urgent'                   # 正規表現マッチ\n\n# blame — 行ごとに誰がいつ書いたか\ngit blame app/models/user.rb",
            language: "bash",
            notes: [
              "ログのカスタム書式: --pretty=format:'%h %an %s' のように整形できる",
              "fzf と組み合わせて `git log | fzf` でインタラクティブ履歴検索する流派も",
            ],
          },
        ],
        keyTakeaways: [
          "作業ツリー → インデックス → リポジトリ の 3 エリアを意識する",
          "git diff と git diff --cached を読み分ける — それぞれが見る境界が違う",
          "log / show / blame / log -S で履歴を強力に検索できる",
        ],
        comprehensionQuestionIds: ["git-003", "git-008"],
      },
      {
        id: "branches-and-merge-strategies",
        title: "2. ブランチとマージ戦略 — merge / rebase / fast-forward",
        intro:
          "Git の力は分岐と統合。`merge` で履歴を残しつつ統合、`rebase` で履歴を直列化。Fast-forward / merge commit / squash の 3 つを理解する。",
        readingMinutes: 9,
        objectives: [
          "branch / switch でブランチを切る・切り替えできる",
          "merge と rebase の挙動と使い分けを説明できる",
          "fast-forward / non-fast-forward / squash merge の差を読める",
        ],
        sections: [
          {
            heading: "2.1 branch と switch — ブランチ操作の現代スタイル",
            body: "Git 2.23+ から `switch` / `restore` が導入され、`checkout` のオーバーロードが分離された。ブランチ操作は **switch** が新しい標準。新ブランチ作成は `switch -c`、削除は `branch -d` (マージ済) / `-D` (強制)、リネームは `branch -m`。",
            code: "# 一覧\ngit branch                   # ローカル\ngit branch -a                 # リモート含む\ngit branch -vv                # 各ブランチの追跡先と最新 commit\n\n# 切替 (現代スタイル)\ngit switch main\ngit switch -c feature/login   # 作成 + 切替\ngit switch -c feature/x origin/feature/x   # リモート追跡で作成\n\n# 古典 (今でも使える)\ngit checkout main\ngit checkout -b feature/login\n\n# 削除\ngit branch -d feature/done    # マージ済み — 安全\ngit branch -D feature/done    # 強制 (未マージでも削除)\n\n# リネーム\ngit branch -m old-name new-name\ngit push origin :old-name new-name           # リモートも追従",
            language: "bash",
            notes: [
              "switch はブランチ専用、restore はファイル復元専用 — 役割が明確",
              "main / master 命名は GitHub 等のデフォルトを使う (チームで統一)",
            ],
          },
          {
            heading: "2.2 merge — 履歴を保持して統合",
            body: "`git merge feature` で『現在のブランチ』に feature を取り込む。先に進んでいなければ **fast-forward** (新コミットなし、ポインタを動かすだけ)、両方が分岐していれば **merge commit** が作られる (2 親の特別なコミット)。`--no-ff` で意図的に merge commit を残す流派もある。",
            code: "git switch main\ngit merge feature                   # 取り込み\n# Fast-forward → main のポインタが feature の先端へ移動 (新コミットなし)\n\n# 分岐している場合は merge commit が作られる\n# main:    A -- B -- C\n# feature:      \\\n#                D -- E\n# merge 後:\n# main:    A -- B -- C --------- M (parents: C, E)\n#                \\              /\n#                 D -- E -------\n\n# --no-ff で必ず merge commit を残す (PR の塊が見える)\ngit merge --no-ff feature\n\n# --squash で『1 コミットに圧縮』して取り込む (履歴がリニア + feature の細かい履歴は消える)\ngit merge --squash feature\ngit commit -m 'feat: login flow'\n\n# やめる\ngit merge --abort",
            language: "bash",
            diagram: `gitGraph
  commit id: "A"
  commit id: "B"
  branch feature
  checkout feature
  commit id: "D"
  commit id: "E"
  checkout main
  commit id: "C"
  merge feature id: "M"`,
            diagramCaption: "merge commit (M) によって両方の履歴が保持される",
            notes: [
              "--ff-only でつけると fast-forward 可能でなければエラーにできる (履歴が綺麗な状態を強制)",
              "GitHub の『Merge pull request』『Squash and merge』『Rebase and merge』は内部的にこれらを実行",
            ],
          },
          {
            heading: "2.3 rebase — 履歴を積み直して直列化",
            body: "`git rebase main` は『自分のコミットを main の先端に積み直す』。履歴がリニアになり、merge commit が無くなる。**共有ブランチに対する rebase は禁忌** (履歴が書き換わるので、他人が pull したものと整合性が壊れる)。個人 feature ブランチで使うのが鉄則。",
            code: "git switch feature\ngit rebase main                     # feature の commit を main の先端に積み直し\n\n# 図解\n# main:    A -- B -- C\n# feature:      \\\n#                D -- E\n# rebase 後:\n# main:    A -- B -- C\n# feature:           \\\n#                     D' -- E'    (新しい SHA、内容は同じ)\n\n# コンフリクト発生時\n# (1) ファイル編集で <<<<< ======= >>>>> を解決\n# (2) git add <file>\n# (3) git rebase --continue\ngit rebase --abort                  # やめる\ngit rebase --skip                   # この commit を捨てる\n\n# 上流ブランチに追随する一般的な流れ\ngit switch feature\ngit fetch origin\ngit rebase origin/main              # 最新の main を取り込んで feature を更新\ngit push --force-with-lease         # 個人ブランチなら OK",
            language: "bash",
            diagram: `gitGraph
  commit id: "A"
  commit id: "B"
  commit id: "C"
  branch feature
  checkout feature
  commit id: "D'"
  commit id: "E'"`,
            diagramCaption: "rebase 後: feature の commit は main の先端に新 SHA で積み直され、merge commit なしのリニア履歴に",
            notes: [
              "force push は --force でなく --force-with-lease を使う — 他人の commit を上書きしない",
              "PR レビュー中の feature ブランチで rebase + force-with-lease する流派は一般的",
            ],
          },
          {
            heading: "2.4 merge vs rebase — どっちを使うか",
            body: "**チーム / プロジェクトのポリシーで決める**。リニア履歴派 (rebase + squash merge) は GitHub Flow / trunk-based 派、履歴保持派 (merge --no-ff) は GitFlow 派に多い。判断の指針: 共有ブランチ (main) は履歴を残す or squash で 1 PR = 1 コミットに圧縮、個人 feature は rebase で main に追随。",
            code: "# パターン 1: Squash merge 派 (現代の多くの SaaS で主流)\n# - feature ブランチで自由にコミット\n# - PR を Squash merge で main に 1 コミットに圧縮して取り込む\n# - main の履歴がリニア + コミットメッセージが整う\n\n# パターン 2: Rebase + Merge 派 (リニア + 個別 commit を残す)\n# - feature を main に rebase してから merge --ff-only\n# - main は完全リニア、各コミットも残る\n\n# パターン 3: Merge --no-ff 派 (GitFlow)\n# - feature を main に merge --no-ff で取り込む\n# - merge commit が残り『どこからどこまでが PR』が明確\n\n# GitHub の設定で merge 方法を制限可\n# Settings → General → Pull Requests\n# [x] Allow squash merging  (推奨)\n# [ ] Allow merge commits\n# [ ] Allow rebase merging",
            language: "bash",
            notes: [
              "リポジトリの規約を最初に決める — 途中で変えると履歴が混乱",
              "main の commit メッセージは Conventional Commits (7 章) で揃えると CHANGELOG 生成が楽",
            ],
          },
        ],
        keyTakeaways: [
          "branch / switch / restore — 役割が分離した現代スタイルを使う",
          "merge は履歴保持 (fast-forward or merge commit)、rebase は直列化 (履歴書換)",
          "rebase は個人ブランチ専用 + force push は --force-with-lease",
          "プロジェクトのマージ方針 (Squash / Rebase / Merge --no-ff) を最初に決める",
        ],
        comprehensionQuestionIds: ["git-001"],
      },
      {
        id: "remote-and-collaboration",
        title: "3. リモートとコラボレーション — clone / fetch / pull / push",
        intro:
          "リモートリポジトリ (origin / upstream) と localの関係、fetch と pull の違い、tracking ブランチの仕組みを整理。",
        readingMinutes: 8,
        objectives: [
          "origin と upstream の役割を区別できる",
          "fetch / pull / pull --rebase の違いを説明できる",
          "tracking ブランチと push -u の意味を読める",
        ],
        sections: [
          {
            heading: "3.1 clone と remote の構造",
            body: "`git clone <url>` でリモートを丸ごとコピー (デフォルトの remote 名は **origin**)。フォーク経由なら自分の `origin` + 本家の `upstream` を持つのが一般的。`git remote -v` で確認、`git remote add upstream <url>` で追加。",
            code: "# 通常\ngit clone https://github.com/user/repo.git\n# → ./repo/ ができて origin が設定される\n\n# 確認\ngit remote -v\n# origin  https://github.com/user/repo.git (fetch)\n# origin  https://github.com/user/repo.git (push)\n\n# Fork パターン\ngit clone https://github.com/me/repo.git    # 自分の fork (origin)\ncd repo\ngit remote add upstream https://github.com/original/repo.git\ngit fetch upstream\ngit switch -c feature upstream/main          # 本家の main から派生\n\n# 別名変更 / 削除\ngit remote rename old new\ngit remote remove upstream\n\n# URL 変更\ngit remote set-url origin git@github.com:user/repo.git   # HTTPS → SSH",
            language: "bash",
            notes: [
              "main で SSH を使うと token のリフレッシュ不要 (鍵認証) — 開発機の鉄板",
              "HTTPS でも GitHub CLI (gh) や credential helper で token を保存できる",
            ],
          },
          {
            heading: "3.2 fetch / pull / pull --rebase の違い",
            body: "**fetch** はリモートの変更を取得するだけ (ローカルブランチには影響なし)。**pull** = fetch + merge。**pull --rebase** = fetch + rebase。CI / 整理された履歴を保ちたいチームは pull --rebase をデフォルトに設定することが多い。",
            code: "# fetch — リモートの状態を取ってくるだけ\ngit fetch                            # 全リモート\ngit fetch origin                      # origin だけ\ngit fetch origin main                 # 特定ブランチ\n# → origin/main の参照が更新されるが、main 自体は動かない\n\n# pull = fetch + merge\ngit pull origin main\n# → origin/main を取得して main に merge\n\n# pull --rebase = fetch + rebase\ngit pull --rebase origin main\n# → 自分のローカルコミットを origin/main の先端に積み直し (履歴リニア)\n\n# デフォルトを rebase に変える (.gitconfig)\ngit config --global pull.rebase true\n\n# 安全に最新を取り込む流儀\ngit fetch origin                      # まずは fetch だけ\ngit log HEAD..origin/main             # 差分を確認\ngit rebase origin/main                # 納得してから rebase\n# または\ngit merge origin/main",
            language: "bash",
            notes: [
              "『何が来るか分からないのに pull するな』派は fetch + log + merge/rebase を推奨",
              "pull の挙動は default branch ごとに違うのでドキュメント参照",
            ],
          },
          {
            heading: "3.3 push と tracking ブランチ",
            body: "`git push origin feature` でローカルの feature ブランチを送る。初回は `-u` (upstream 設定) を付けると以降 `git push` だけで OK。`--force-with-lease` は強制 push の安全版 (他人の commit を上書きしない)。",
            code: "# 初回 push (tracking 設定)\ngit push -u origin feature/login\n# 以降\ngit push                              # tracking 先 (origin/feature/login) に送る\ngit pull                              # tracking 元 から取る\n\n# 追跡関係の確認\ngit branch -vv\n# * feature/login abc1234 [origin/feature/login] commit msg\n\n# 別名で送る\ngit push origin local-name:remote-name\n\n# 削除\ngit push origin --delete feature/old\n# または\ngit push origin :feature/old\n\n# 強制 push (rebase / amend 後)\ngit push --force                       # ❌ 危険 (他人を上書き)\ngit push --force-with-lease            # ✅ 安全 (リモート未変更時のみ)\ngit push --force-if-includes           # ✅ さらに安全 (自分が最新を取得していることも確認)",
            language: "bash",
            notes: [
              "--force-with-lease をエイリアスにしておくと事故防止: alias gpfl='git push --force-with-lease'",
              "main / master へ force push を禁止するのは Branch Protection Rule (7 章)",
            ],
          },
        ],
        keyTakeaways: [
          "origin = 自分の clone 元、upstream = fork 元 (慣習)",
          "pull = fetch + merge、pull --rebase = fetch + rebase、迷ったら fetch して確認してから合流",
          "push -u で初回 tracking 設定、強制 push は --force-with-lease で安全に",
        ],
        comprehensionQuestionIds: [],
      },
      {
        id: "fixing-and-recovery",
        title: "4. 履歴の修正と救出 — amend / stash / reset / revert / reflog",
        intro:
          "Git は『間違えても救える』ツール。typo 修正 (amend)、WIP 退避 (stash)、巻き戻し (reset / revert)、迷子コミット復旧 (reflog) を整理する。",
        readingMinutes: 9,
        objectives: [
          "amend の安全な使い方 (push 済み禁止) を理解する",
          "reset --soft/--mixed/--hard と revert の違いを説明できる",
          "stash と reflog で『消したつもり』を救える",
        ],
        sections: [
          {
            heading: "4.1 commit --amend — 直前コミットの修正",
            body: "`git commit --amend` で『最後のコミット』を差し替え。メッセージだけ直すケース、忘れたファイルを混ぜるケース、両方に使える。**push 済みのコミットに対しては禁忌** (force push が必要 → 共有ブランチでは事故)。",
            code: "# メッセージだけ修正\ngit commit --amend -m '新しいメッセージ'\ngit commit --amend                     # エディタが開く\n\n# 忘れたファイルを混ぜる (メッセージはそのまま)\ngit add forgotten.rb\ngit commit --amend --no-edit\n\n# 作者を変える (誤って別人で commit した時)\ngit commit --amend --author='Alice <a@x>' --no-edit\n\n# push 済みの場合 (個人ブランチのみ)\ngit push --force-with-lease origin feature/x\n\n# ❌ NG\ngit push --force origin main           # main の amend + force は厳禁",
            language: "bash",
            notes: [
              "amend は『前の commit を捨てて新しい commit に置き換え』 → SHA が変わる",
              "PR 中の自分のブランチで amend → force-with-lease する流派は普通",
            ],
          },
          {
            heading: "4.2 stash — WIP を一時退避",
            body: "急に main の hotfix に切り替えたいが、今の編集を commit したくない時に `git stash`。退避した変更は `pop` (取り出し + 削除) / `apply` (取り出し + 残す) で復元。",
            code: "# 退避\ngit stash                              # 名無し\ngit stash push -m 'WIP: refactor user'\ngit stash -u                            # untracked も含める\ngit stash --keep-index                  # add 済みは残す\n\n# 一覧 / 内容\ngit stash list\n# stash@{0}: On feature/x: WIP: refactor user\n# stash@{1}: WIP on main: ...\ngit stash show stash@{0}                # ファイル一覧\ngit stash show -p stash@{0}             # diff\n\n# 復元\ngit stash pop                           # 最新を取り出し + 削除\ngit stash pop stash@{1}                 # 指定\ngit stash apply stash@{0}               # 取り出し + 残す\n\n# 削除\ngit stash drop stash@{0}\ngit stash clear                          # 全削除\n\n# 別ブランチに変換\ngit stash branch new-feature stash@{0}  # stash を新ブランチに",
            language: "bash",
            notes: [
              "stash は一時的な作業領域 — 数日寝かせると忘れる、ブランチ化が安全",
              "stash の競合解決は merge と同じ — 解決後 add",
            ],
          },
          {
            heading: "4.3 reset と revert — 巻き戻しの 2 流派",
            body: "**reset** は HEAD を動かす (履歴改変)。**revert** は『打ち消しコミット』を作る (履歴保持)。共有ブランチでは revert、個人ブランチで未 push なら reset。`--soft` / `--mixed` (デフォルト) / `--hard` の差は『どこまで影響を与えるか』。",
            code: "# reset の 3 段階\ngit reset --soft HEAD~1               # コミットだけ取消 (変更はインデックスに残る)\ngit reset --mixed HEAD~1              # コミット + インデックス取消 (作業ツリーは残る) — デフォルト\ngit reset --hard HEAD~1               # 全部消す (作業ツリーも巻き戻し、危険)\n\n# 図解\n# HEAD~1 を指す状態に戻す:\n# --soft  : 履歴のみ移動\n# --mixed : 履歴 + インデックスを移動 (作業ツリーは変更前のまま)\n# --hard  : 履歴 + インデックス + 作業ツリーを完全に巻き戻し\n\n# revert — 打ち消しコミットを作る (履歴保持、共有ブランチで安全)\ngit revert abc1234                    # 単発\ngit revert HEAD~3..HEAD                # 範囲 (HEAD~3 は含まない)\ngit revert --no-commit abc1234 def5678 # まとめて 1 コミット (--continue で完了)\n\n# どう使い分ける？\n# 自分の未 push commit → reset で消してもいい\n# 共有 (push 済み) commit → 必ず revert\n# main を 1 個前に戻したい → revert (force push 禁止)",
            language: "bash",
            notes: [
              "reset --hard は作業ツリーも壊れる — 退避していないと完全に消える",
              "reset の取消は reflog から HEAD@{1} を復元 (4.4)",
            ],
          },
          {
            heading: "4.4 reflog — 救出の最後の砦",
            body: "**reflog** は HEAD の移動履歴 (commit / reset / rebase / checkout 等を全部記録)。`git reset --hard` で吹き飛ばしたコミットも 90 日間は救える。Git の『安全網』なので必ず覚える。",
            code: "# 履歴確認\ngit reflog\n# abc1234 HEAD@{0}: reset: moving to HEAD~5\n# def5678 HEAD@{1}: commit: 救いたいコミット\n# ghi9012 HEAD@{2}: rebase finished: returning to refs/heads/feature\n# ...\n\n# 救出 — def5678 を取り戻す\ngit reset --hard def5678\n# または\ngit reset --hard HEAD@{1}\n\n# 削除したブランチを救出\ngit reflog | grep <branch_name>\ngit branch <restored_name> <SHA>\n\n# 完全に dangling (孤立) な commit を探す\ngit fsck --lost-found\n\n# reflog はリモートに反映されない (ローカル専用) — 期限は --expire で延長可\ngit config --global gc.reflogExpire '1.year'",
            language: "bash",
            notes: [
              "reflog は Git の隠れた SSD のようなもの — 知っていれば多くの事故から救える",
              "git gc で古い reflog がパージされる前に救出すること (デフォルト 90 日)",
            ],
          },
        ],
        keyTakeaways: [
          "amend は最後のコミットの差し替え — push 済みなら個人ブランチのみで",
          "stash で WIP 退避、ブランチ切替が安全に",
          "reset (履歴改変) vs revert (打ち消し commit) — 共有 = revert、個人 = reset",
          "reflog は『消した commit の救出ログ』、Git の最後の砦",
        ],
        comprehensionQuestionIds: ["git-002", "git-003", "git-004", "git-005", "git-007", "git-010"],
      },
      {
        id: "advanced-operations",
        title: "5. 高度操作 — cherry-pick / bisect / interactive rebase / worktree",
        intro:
          "歴史を縫う cherry-pick、バグを二分探索する bisect、コミットを編む interactive rebase、複数ブランチを同時に開く worktree。Git の上級ツールを整理。",
        readingMinutes: 10,
        objectives: [
          "cherry-pick で特定コミットを別ブランチへ取り込める",
          "bisect で『どのコミットで壊れたか』を二分探索できる",
          "interactive rebase でコミットを整える (squash / fixup / reorder / drop)",
          "worktree で複数ブランチを同時にチェックアウトできる",
        ],
        sections: [
          {
            heading: "5.1 cherry-pick — 美味しい所どり",
            body: "別ブランチの特定の 1 コミットだけを現在のブランチに取り込む。**hotfix を main と develop の両方に入れたい**、**リリースブランチからの逆輸入**などで頻出。`-x` で『元 commit 情報』をメッセージに残せる。",
            code: "# 1 コミット適用\ngit cherry-pick deadbeef\n\n# 範囲 (deadbeef を含まない deadbeef..feedface)\ngit cherry-pick deadbeef..feedface\n\n# 元コミット情報をメッセージに残す (履歴追跡用)\ngit cherry-pick -x deadbeef\n# → 'cherry picked from commit deadbeef' が footer に\n\n# コンフリクトしたら\n# (1) 編集\n# (2) git add <file>\n# (3) git cherry-pick --continue\ngit cherry-pick --abort                # やめる\ngit cherry-pick --skip                  # この commit をスキップ\n\n# よくあるユースケース: hotfix を main + develop 両方に\ngit switch hotfix/x\n# ... fix ...\ngit commit -m 'fix: 緊急バグ'\nSHA=$(git rev-parse HEAD)\ngit switch main && git cherry-pick $SHA\ngit switch develop && git cherry-pick $SHA",
            language: "bash",
          },
          {
            heading: "5.2 bisect — 二分探索でバグの原因コミット特定",
            body: "『ある時点では動いていたのに、今は壊れている』を二分探索で見つけるツール。`good` (動いていた) と `bad` (壊れた) を指定すると Git が中間 commit を順に提示。100 コミット先でも log2(100) ≈ 7 回で特定。",
            code: "# 開始\ngit bisect start\ngit bisect bad                          # 現在 (壊れている)\ngit bisect good v1.2.0                  # 動いていた版\n\n# Git が中間 commit を checkout する → 動作確認\n# 動く → git bisect good\n# 壊れている → git bisect bad\n# スキップ → git bisect skip (どっちか判断不能)\n\n# ループ → 原因 commit 特定\n# bisect found: deadbeef is the first bad commit\n\n# 終了\ngit bisect reset                         # 元の HEAD に戻る\n\n# 自動化 (テストスクリプトの exit code 0=good, 非0=bad)\ngit bisect start HEAD v1.2.0\ngit bisect run npm test\ngit bisect run rspec spec/regression_spec.rb\ngit bisect run sh -c 'cargo build && cargo test'",
            language: "bash",
            notes: [
              "bisect run はテストが冪等で速いほど威力を発揮する",
              "ビルドが通らない commit は git bisect skip でスキップ",
            ],
          },
          {
            heading: "5.3 interactive rebase — 履歴を編む",
            body: "`git rebase -i HEAD~N` で N 個前までのコミットを編集モードで開く。**pick** (採用)、**reword** (メッセージ書換)、**edit** (一時停止して修正)、**squash** (前と統合 + メッセージ編集)、**fixup** (前と統合 + メッセージ捨)、**drop** (削除)、**reorder** (行を入れ替え)。",
            code: "git rebase -i HEAD~5\n\n# エディタが開く\n# pick abc1 first feature\n# pick def2 typo fix\n# pick ghi3 lint\n# pick jkl4 second feature\n# pick mno5 fix for first\n\n# 編集後 (mno5 を abc1 の直後に統合 + ghi3 を捨てる + def2 のメッセージ修正)\n# pick abc1 first feature\n# fixup mno5 fix for first\n# reword def2 typo fix\n# drop ghi3 lint\n# pick jkl4 second feature\n\n# 保存 → エディタ閉じる → 順次適用\n# reword なら次に commit メッセージ編集が開く\n# edit なら『その時点で一時停止』 → ファイル修正後 git rebase --continue\n\n# コンフリクト発生時\ngit add <file>\ngit rebase --continue\ngit rebase --abort                       # やめる\n\n# よくあるパターン: 連続する fixup を 1 つの commit に\ngit commit --fixup abc1234              # fixup! コミットを作成\ngit rebase -i --autosquash HEAD~10      # 自動で fixup を統合",
            language: "bash",
            notes: [
              "interactive rebase は『コミット単位の編集』 — ファイルの追跡履歴 (rename 等) は触れない",
              "機密情報を全履歴から完全削除したいなら git filter-repo (新しい推奨ツール)",
            ],
          },
          {
            heading: "5.4 worktree — 同時に複数ブランチを開く",
            body: "`git worktree add ../path branch` で別ディレクトリに別ブランチをチェックアウトできる。元の作業中ディレクトリはそのまま、別ディレクトリで hotfix 対応 → 終わったら戻る。1 つの .git を共有するので clone より軽い。",
            code: "# 別ディレクトリにブランチを展開\ngit worktree add ../myapp-hotfix hotfix/urgent\ncd ../myapp-hotfix\n# 普通に作業 (元の作業ディレクトリには影響なし)\n\n# 新ブランチで作る (-b)\ngit worktree add -b feature/x ../myapp-feature main\n\n# 一覧\ngit worktree list\n# /home/user/myapp                abc1234 [feature/login]\n# /home/user/myapp-hotfix         def5678 [hotfix/urgent]\n# /home/user/myapp-feature        ghi9012 [feature/x]\n\n# 削除\ngit worktree remove ../myapp-hotfix\ngit worktree prune                      # 削除済み worktree のエントリ整理\n\n# 注意: 同じブランチを 2 つの worktree で開くことはできない",
            language: "bash",
            notes: [
              "feature 作業中に急ぎの hotfix 対応 / 旧バージョンと現バージョンを並べて比較などに",
              "Claude Code のような AI ツールでも worktree で並列作業を分離するのに使う",
            ],
          },
        ],
        keyTakeaways: [
          "cherry-pick で特定コミットだけを別ブランチに移植 (hotfix の二重取込み)",
          "bisect で『どのコミットで壊れたか』を log2(N) 回で特定",
          "interactive rebase + pick/reword/squash/fixup/drop で履歴を整える",
          "worktree で複数ブランチを同時にチェックアウト (stash 不要)",
        ],
        comprehensionQuestionIds: ["git-009", "git-011", "git-012", "git-016"],
      },
      {
        id: "github-and-pull-requests",
        title: "6. GitHub と Pull Request — gh CLI / レビュー / 保護",
        intro:
          "GitHub をブラウザではなく `gh` CLI で操る、PR レビューの実践、main を守る Branch Protection、Conventional Commits でメッセージを整える。",
        readingMinutes: 9,
        objectives: [
          "gh pr create / view / checkout / merge で PR をターミナルだけで回せる",
          "Branch Protection Rule で main を保護できる",
          "Conventional Commits の type / scope / breaking を書ける",
        ],
        sections: [
          {
            heading: "6.1 gh CLI — GitHub をターミナルで",
            body: "`gh` (GitHub CLI) は GitHub 公式 CLI。PR / Issue / Release / Run / repo すべてをターミナルから操作可能。`gh auth login` で初回認証、その後はトークン管理込み。`gh pr create` は対話 (タイトル・本文・base・reviewer) で PR 作成。",
            code: "# 認証\ngh auth login\n\n# PR 作成\ngh pr create                            # 対話的\ngh pr create --base main \\\n  --title 'feat: Add user signup' \\\n  --body  '## Summary...' \\\n  --reviewer alice,bob \\\n  --label bug,priority-high\ngh pr create --draft                    # 下書き\ngh pr create --fill                     # commit メッセージから自動補完\n\n# PR を見る\ngh pr list                              # 一覧 (自分のリポジトリ)\ngh pr view 42                           # ターミナルで\ngh pr view 42 --web                     # ブラウザで開く\ngh pr diff 42                           # 差分\ngh pr checkout 42                       # 同僚の PR をローカルにチェックアウト\n\n# レビュー\ngh pr review --approve\ngh pr review --request-changes -b 'コメント修正お願いします'\ngh pr review --comment -b '質問: ...'\n\n# マージ\ngh pr merge 42 --squash                 # squash merge\ngh pr merge 42 --rebase                 # rebase merge\ngh pr merge 42 --merge --auto           # CI 通過後に自動 merge\n\n# Issue / Release / Run\ngh issue list / create / view\ngh release list / create v1.0.0\ngh run list / view / rerun              # GitHub Actions",
            language: "bash",
            notes: [
              "AI ツール (Claude Code 等) が GitHub と連携する時も gh CLI 経由が多い",
              "alias gpc='gh pr create --fill' のようにエイリアス化すると爆速",
            ],
          },
          {
            heading: "6.2 PR レビューの実践",
            body: "良い PR の単位: **1 PR = 1 論理変更**、200〜400 行以下。レビュー側は (1) 何を達成するか (description)、(2) どう実現したか (diff)、(3) どうテストしたか (test plan) を確認。レビューコメントには suggestion ブロックで code を提案 (GitHub のクリックで apply 可)。",
            code: "# 良い PR description テンプレ (.github/pull_request_template.md)\n## Summary\n- 何を変えたか (1〜3 行)\n- 何のためか (リンク to Issue / RFC)\n\n## Test plan\n- [ ] ユニットテスト追加 (spec/...)\n- [ ] 手動テスト: ローカル + ステージング\n- [ ] スクリーンショット / GIF (UI 変更時)\n\n## Risk / Rollback\n- DB マイグレーション の reversible? Yes\n- feature flag: enabled by default? No → admin/* で ON\n\n# Suggestion ブロック (レビューコメント内で)\n# GitHub UI 上で書く\n```suggestion\nuser.full_name.presence || user.email\n```\n# クリックで apply → 自分の environment で再現せずに修正提案可\n\n# CODEOWNERS で自動レビュー割当\n# .github/CODEOWNERS\n*               @org/eng\n/db/migrate/    @org/dba @org/eng-lead\n/.github/       @org/sre",
            language: "markdown",
            notes: [
              "Conventional Comments (nit: / chore: / praise: ...) で『重要度』を明示する流派もある",
              "PR が大きい時は『先にスキーマ』『次にロジック』『最後にテスト』で 3 つに分けると速い",
            ],
          },
          {
            heading: "6.3 Branch Protection — main を守る",
            body: "`Settings → Branches → Add rule` で main / master を保護。直接 push 禁止 / CI 通過必須 / レビュー N 名必須 / linear history 強制 / 署名 commit 必須 などを組み合わせる。チームに合わせてカスタマイズ。",
            code: "# 推奨設定 (中規模チーム)\nBranch name pattern: main\n\n[x] Require a pull request before merging\n    [x] Require approvals: 1\n    [x] Dismiss stale pull request approvals when new commits are pushed\n    [x] Require review from Code Owners (CODEOWNERS で割当)\n\n[x] Require status checks to pass before merging\n    [x] Require branches to be up to date before merging\n    Required status checks:\n      - CI / test\n      - CI / lint\n      - CI / type-check\n\n[x] Require conversation resolution before merging\n[x] Require signed commits         # GPG / SSH 署名\n[x] Require linear history          # merge commit 禁止 (squash / rebase 強制)\n[ ] Allow force pushes              # OFF\n[ ] Allow deletions                 # OFF\n\nApply to administrators too. — 管理者にも適用 (重要)\n\n# 設定後の挙動\n$ git push origin main\n# remote: error: GH006: Protected branch update failed\n# remote: error: At least 1 approving review is required\n\n# Required check が無いと merge ボタンは灰色のまま",
            language: "bash",
            notes: [
              "Apply to administrators をオフにすると規約が形骸化 — 必ず ON",
              "Bot / Automation だけは bypass できるよう特定の AppId / Team を許可リストに",
            ],
          },
          {
            heading: "6.4 Conventional Commits — メッセージ規約",
            body: "コミットメッセージを `type(scope): subject` の形式に揃える規約。代表的 type: **feat** (新機能 → MINOR)、**fix** (バグ修正 → PATCH)、docs / chore / style / refactor / test / perf / build / ci。`BREAKING CHANGE:` フッターで MAJOR を発火。semantic-release / release-please で CHANGELOG と semver を自動化できる。",
            code: "# 形式: type(scope): subject\n#\n# [optional body]\n#\n# [optional footer(s)]\n\n# 良い例\nfeat(auth): JWT による API 認証を追加\nfix(post): 公開済み投稿の編集で 500 エラーが出るバグを修正\ndocs(readme): デプロイ手順を Vercel 向けに刷新\nrefactor(user): pluck で N+1 を解消\nperf(query): index 追加で /posts を 300ms → 30ms\nchore(deps): bump @types/node to 22.5.0\nci: run rspec in parallel on GH Actions\n\n# Breaking change (MAJOR)\nfeat(api)!: v1 を廃止、v2 のみサポート\n\nBREAKING CHANGE: GET /v1/users は 410 を返す。クライアントは v2 に移行が必要\n\n# 自動化\n# - semantic-release / release-please で CHANGELOG + GitHub Release + npm publish\n# - commitlint で commit メッセージの形式チェック (Husky と組合せ)\n\n# Squash merge の commit title を Conventional に強制\n# GitHub の Repository settings → Pull Requests → Default commit message → Pull request title and description",
            language: "text",
            notes: [
              "scope は機能領域 (auth / billing / user / api) を入れると CHANGELOG が読みやすい",
              "subject は命令形 (現在形)、英語なら大文字始まり、period なしが慣習",
            ],
          },
        ],
        keyTakeaways: [
          "gh CLI で PR / Issue / Run を全部ターミナルから (gh pr create / view / merge)",
          "Branch Protection Rule で main を守る — PR 必須 + CI 通過 + レビュー必須 + linear history",
          "Conventional Commits で type(scope): subject 形式、BREAKING CHANGE で MAJOR",
        ],
        comprehensionQuestionIds: ["git-006", "git-014", "git-015"],
      },
      {
        id: "github-actions-and-workflows",
        title: "7. GitHub Actions と運用 — CI / CD / Secrets",
        intro:
          "GitHub Actions で push / PR / cron / 手動の各トリガーから CI / CD を走らせる。matrix / cache / artifact / secrets / 環境別デプロイの基本を整理。",
        readingMinutes: 9,
        objectives: [
          ".github/workflows/*.yml の最小構成と主要キーワード (on / jobs / steps / uses) を読める",
          "matrix で複数バージョンをテスト、cache でビルドを高速化できる",
          "secrets / environments / OIDC で本番デプロイの基本を理解する",
        ],
        references: [
          { label: "GitHub Actions 公式", url: "https://docs.github.com/ja/actions" },
        ],
        sections: [
          {
            heading: "7.1 ワークフローの最小構成",
            body: "`.github/workflows/<name>.yml` を置くと GitHub Actions が自動検出。**on** でトリガー (push / pull_request / schedule / workflow_dispatch)、**jobs** で並列ジョブ、**steps** で各コマンド。`uses:` で公開 action (例: `actions/checkout@v4`) を取り込む。",
            code: "# .github/workflows/ci.yml\nname: CI\non:\n  push:\n    branches: [main]\n  pull_request:\n  workflow_dispatch:                  # 手動実行 (Actions タブからボタン)\n  schedule:\n    - cron: '0 9 * * 1'                # 月曜 9 時 (UTC)\n\nconcurrency:\n  group: ${{ github.workflow }}-${{ github.ref }}\n  cancel-in-progress: true             # 同じ PR の古い run はキャンセル\n\njobs:\n  test:\n    runs-on: ubuntu-latest\n    services:\n      postgres:\n        image: postgres:16\n        env: { POSTGRES_PASSWORD: postgres }\n        ports: ['5432:5432']\n        options: >-\n          --health-cmd pg_isready\n          --health-interval 10s\n          --health-timeout 5s\n          --health-retries 5\n    steps:\n      - uses: actions/checkout@v4\n      - uses: actions/setup-node@v4\n        with:\n          node-version: '22'\n          cache: 'npm'                 # node_modules キャッシュ\n      - run: npm ci\n      - run: npm run lint\n      - run: npm run test\n      - run: npm run build",
            language: "yaml",
            notes: [
              "concurrency + cancel-in-progress で『PR を連続 push した時の古い run を自動キャンセル』",
              "services でテスト用 DB / Redis を Docker で立ち上げ",
            ],
          },
          {
            heading: "7.2 matrix で複数バージョン同時テスト",
            body: "`strategy.matrix` で複数の OS / 言語バージョンを並列にテストできる。失敗で全体を止めたくなければ `fail-fast: false`。include / exclude で組み合わせを細かく調整。",
            code: "jobs:\n  test:\n    runs-on: ${{ matrix.os }}\n    strategy:\n      fail-fast: false\n      matrix:\n        os: [ubuntu-latest, macos-latest]\n        node: ['20', '22']\n        include:\n          - os: ubuntu-latest\n            node: '22'\n            coverage: true              # この組合せでだけ coverage 計測\n        exclude:\n          - os: macos-latest\n            node: '20'\n    steps:\n      - uses: actions/checkout@v4\n      - uses: actions/setup-node@v4\n        with: { node-version: ${{ matrix.node }}, cache: 'npm' }\n      - run: npm ci\n      - run: npm test\n      - if: matrix.coverage\n        run: npm run coverage\n      - if: matrix.coverage\n        uses: codecov/codecov-action@v4",
            language: "yaml",
          },
          {
            heading: "7.3 Secrets / Environments / OIDC",
            body: "**Secrets** は Settings → Secrets and variables → Actions で登録。`${{ secrets.NAME }}` で参照。**Environments** (production / staging) ごとに secrets を分離 + reviewer 必須化が可能。**OIDC** (OpenID Connect) で AWS / GCP に長期 IAM キーなしでデプロイできるのが現代の鉄板。",
            code: "# 通常 secrets\njobs:\n  deploy:\n    environment: production           # 環境を指定 (Settings → Environments で reviewer 必須化)\n    runs-on: ubuntu-latest\n    steps:\n      - uses: actions/checkout@v4\n      - run: ./deploy.sh\n        env:\n          STRIPE_KEY: ${{ secrets.STRIPE_KEY }}\n          DATABASE_URL: ${{ secrets.DATABASE_URL }}\n\n# OIDC で AWS にデプロイ (推奨、長期 IAM キー不要)\njobs:\n  deploy:\n    runs-on: ubuntu-latest\n    permissions:\n      id-token: write                  # OIDC token 取得\n      contents: read\n    steps:\n      - uses: actions/checkout@v4\n      - uses: aws-actions/configure-aws-credentials@v4\n        with:\n          role-to-assume: arn:aws:iam::123456789:role/gh-actions-deploy\n          aws-region: ap-northeast-1\n      - run: aws s3 sync ./dist s3://my-bucket/\n      - run: aws cloudfront create-invalidation --distribution-id $CF_ID --paths '/*'",
            language: "yaml",
            notes: [
              "Secrets はログに自動マスク — それでも echo しない、artifact に含めない",
              "OIDC は GCP / Azure / Vercel / Cloudflare などにも対応",
              "Environments の `Required reviewers` で本番デプロイを承認制に",
            ],
          },
          {
            heading: "7.4 ブランチ戦略の主要 3 流派",
            body: "**GitHub Flow** (現代の主流): main + 短命 feature ブランチ、main = 本番。**Trunk-based**: main 一本、feature flag で未完成機能を隠す。**GitFlow**: main / develop / feature / release / hotfix を使い分け (大規模・リリースサイクルが明確な場合)。チームに合った戦略を選ぶ。",
            code: "# GitHub Flow (推奨、Web サービス)\n# main: 常にデプロイ可能 (本番)\n# ↑ merge\n# feature/login, feature/signup (短命、PR ベース)\n#\n# 流れ:\n# 1. git switch -c feature/x main\n# 2. work + commit + push\n# 3. gh pr create --base main\n# 4. レビュー + CI 通過 → squash merge\n# 5. main → 自動デプロイ\n\n# Trunk-based (高頻度デプロイ、Google / Facebook 流)\n# main 一本、すべての作業を main に直接 (or 数時間で merge される短命 PR)\n# 未完成機能は feature flag で OFF にして main に入れる\n# 例: GrowthBook / LaunchDarkly / 自前 flag テーブル\n\n# GitFlow (リリースサイクルが明確、エンタープライズ / OSS)\n# main:    本番リリース版\n# develop: 次期リリースの開発版\n# feature/*: develop から派生、develop に戻る\n# release/*: develop から派生、main と develop に戻る\n# hotfix/*: main から派生、main と develop に戻る\n#\n# 現代の Web では複雑すぎることが多い — GitHub Flow に流れている",
            language: "text",
            notes: [
              "本番リリース頻度が日次以上なら GitHub Flow か Trunk-based、月次以下なら GitFlow も検討",
              "feature flag は Trunk-based / GitHub Flow とも相性が良い (未完成機能を main に入れて隠す)",
            ],
          },
        ],
        keyTakeaways: [
          "GitHub Actions は .github/workflows/*.yml、on で trigger / jobs で並列 / steps で実行",
          "matrix で複数バージョン並列、cache でビルド高速化",
          "Secrets は environment ごとに分離、本番は OIDC で長期キー不要",
          "GitHub Flow / Trunk-based / GitFlow をチームの規模とリリース頻度で選ぶ",
        ],
        comprehensionQuestionIds: ["git-013"],
      },
    ],
  },

  // ---------- Linux / CLI 入門ガイド ----------
  {
    id: "linux-intro",
    trackId: "linux",
    title: "Linux & CLI の地図 — シェル・パイプ・運用",
    subtitle:
      "ファイルシステム → テキスト処理 → find/xargs → I/O とパイプ → プロセスと権限 → ネットワーク → シェル自動化 を 7 章で",
    audience:
      "Web アプリは書けるが本番サーバで詰まる人、CLI でテキスト処理 (grep/sed/awk/jq) を流暢に書けるようになりたい人、sudo / chmod / systemd で迷子になる人",
    sources: [
      { label: "Linux Command Library", url: "https://linuxcommandlibrary.com/" },
      { label: "tldr pages (実例ベースの man)", url: "https://tldr.sh/" },
      { label: "ArchWiki (深い解説、Arch でなくても有用)", url: "https://wiki.archlinux.org/" },
    ],
    emoji: "🐧",
    relatedCategoryIds: ["linux-cli"],
    chapters: [
      {
        id: "filesystem-and-navigation",
        title: "1. ファイルシステムとナビゲーション — ls / cd / cp / mv / rm",
        intro:
          "Linux のファイルシステム階層 (/etc / /var / /home など) と、基本的なファイル操作コマンドを整理。すべての出発点。",
        readingMinutes: 7,
        objectives: [
          "FHS (Filesystem Hierarchy Standard) の主要ディレクトリの役割を説明できる",
          "ls / cd / pwd / cp / mv / rm / mkdir / ln の基本オプションを使える",
          "ワイルドカード (* / ? / [abc]) とブレース展開 ({a,b,c}) を読める",
        ],
        sections: [
          {
            heading: "1.1 FHS — 標準ディレクトリ構造",
            body: "Linux は『どこに何を置くか』が FHS で決まっている。本番運用で『どこのログ?どこの設定?』で迷わないために主要 10 個を覚える。**/etc** 設定、**/var** 可変データ (log / db / spool)、**/home** ユーザー、**/usr** インストール済み、**/tmp** 一時、**/opt** サードパーティ、**/proc** プロセス情報の仮想 FS。",
            code: "/\n├ bin/, sbin/      基本コマンド (今は /usr に統合される傾向)\n├ boot/            ブートローダ / カーネル\n├ dev/             デバイスファイル (/dev/null, /dev/tty)\n├ etc/             システム設定 (/etc/nginx, /etc/ssh)\n├ home/            ユーザー (/home/alice)\n├ lib/             共有ライブラリ\n├ media/, mnt/     マウントポイント\n├ opt/             サードパーティ (Slack, Chrome 等)\n├ proc/            プロセス情報 (仮想 FS, /proc/<pid>)\n├ root/            root ユーザーの HOME\n├ run/             ランタイム情報 (PID ファイル等)\n├ sys/             カーネル情報 (仮想 FS)\n├ tmp/             一時 (再起動でクリア)\n├ usr/             インストールされたソフト (/usr/bin, /usr/lib)\n└ var/             可変データ (/var/log, /var/lib/postgresql, /var/spool)",
            language: "text",
            notes: [
              "ログを探すなら /var/log/ がほぼ確実",
              "/etc/ は『プレーンテキストの設定ファイル』が原則 (バイナリ設定はモダンサービスで稀)",
              "/tmp/ は再起動で消える、/var/tmp/ は残る (微妙な差)",
            ],
          },
          {
            heading: "1.2 ls / cd / pwd と基本のファイル操作",
            body: "`ls` は表示、`cd` は移動、`pwd` は現在地。`ls -la` (隠しファイル + 詳細) と `ls -lh` (人間用サイズ) が頻出。`cd -` で直前のディレクトリに戻る、`cd ~` でホームディレクトリ。",
            code: "# 表示\nls                              # 一覧\nls -la                          # 隠しファイル + 詳細 (-l long, -a all)\nls -lh                          # サイズを人間用 (K/M/G)\nls -lt                          # 更新時刻順\nls -lS                          # サイズ順\nls -R                           # 再帰\n\n# 移動\ncd /var/log\ncd                              # ホームへ\ncd ~                            # 同上\ncd ~alice                       # alice の HOME\ncd -                            # 直前のディレクトリ (トグル)\npwd                             # 現在地表示\n\n# 作成・コピー・移動・削除\nmkdir -p path/to/dir            # -p で中間ディレクトリも作る\ntouch file.txt                  # 空ファイル (or タイムスタンプ更新)\ncp file.txt copy.txt\ncp -r dir new_dir               # 再帰\ncp -p file backup/              # パーミッション / 時刻も保持\nmv old new                       # リネーム / 移動\nrm file                         # 削除\nrm -rf dir                      # 再帰 + 強制 (危険、確認しないこと多し)\n\n# 安全な削除 (rm のかわりに mv + 確認)\nalias rm='rm -i'                # -i で逐次確認 (chunky だが安全)\n# または trash-cli を使う",
            language: "bash",
            notes: [
              "rm -rf / は『システム全削除』 — alias で rm -i にしている熟練者は多い",
              "macOS と Linux で ls / cp / sed のオプションが微妙に違う (GNU vs BSD)",
            ],
          },
          {
            heading: "1.3 ワイルドカードとブレース展開",
            body: "シェルが事前に展開する仕組み。**ワイルドカード** (glob): `*` (任意の 0+ 文字)、`?` (任意 1 文字)、`[abc]` (a/b/c のいずれか)。**ブレース展開**: `{a,b,c}` で `a b c` に展開。`{1..10}` で連番、`{a..z}` でアルファベット。",
            code: "# Glob (ワイルドカード)\nls *.rb                          # 拡張子 .rb\nls file?.txt                     # file1.txt, file2.txt 等\nls file[0-9].txt                 # 数字\nls **/*.rb                       # 再帰 (シェルが対応していれば、zsh はデフォルト)\nshopt -s globstar               # bash で ** を有効化\n\n# ブレース展開 (シェル側、glob ではない)\necho file{1,2,3}.txt             # file1.txt file2.txt file3.txt\necho {a..e}                      # a b c d e\necho {1..5}                      # 1 2 3 4 5\necho {01..05}                    # 01 02 03 04 05\necho {2024..2026}-01            # 2024-01 2025-01 2026-01\n\n# 組み合わせ\nmkdir -p project/{src,test,docs}/{lib,bin}\n# → project/src/lib, project/src/bin, project/test/lib, ... 計 6 つ\n\nmv file.txt{,.bak}               # file.txt → file.txt.bak (バックアップの常套句)\ncp config.yml{,.20260101}       # 日付付きバックアップ",
            language: "bash",
            notes: [
              "ブレース展開は『シェル側』で起き、glob は『ファイルが存在する場合のみ』展開",
              "クォート (`'*.rb'`) すると展開されない — find / grep などに渡す時に意図的に",
            ],
          },
          {
            heading: "1.4 シンボリックリンクとハードリンク",
            body: "**シンボリックリンク (ln -s)** は『別ファイルへの参照』(Windows のショートカット相当)。**ハードリンク (ln)** は『同じ inode への別名』。日常はほぼ symlink を使う。",
            code: "# シンボリックリンク (一般的)\nln -s /var/log/nginx/access.log ./access.log\nls -la access.log\n# lrwxrwxrwx ... access.log -> /var/log/nginx/access.log\n\n# 既存リンクを上書き\nln -sfn /new/path link            # -f 強制 -n リンク先がディレクトリでも上書き\n\n# ハードリンク (同じ inode)\nln file.txt hardlink.txt\nls -li                            # i オプションで inode 表示 (両方同じ番号)\n\n# 違い\n# symlink: 別ファイル、リンク先が消えるとリンク切れ\n# hardlink: 同一 inode、片方を消してもデータは残る (refcount が 0 になるまで)\n# hardlink はディレクトリには使えない、別ファイルシステムをまたげない\n\n# 実用例: dotfiles 管理\nln -s ~/dotfiles/.zshrc ~/.zshrc\nln -s ~/dotfiles/.vimrc ~/.vimrc",
            language: "bash",
            notes: [
              "dotfiles を git 管理 + symlink で本体に展開するのが慣習",
              "symlink は読み書きすると元ファイルに作用する (リンク先で操作される)",
            ],
          },
        ],
        keyTakeaways: [
          "FHS で /etc (設定) / /var (可変) / /home / /tmp / /proc の場所を把握",
          "ls -la / -lh / -lt の頻出オプション、cd - で直前へ",
          "ワイルドカード (*/?[]) と ブレース展開 ({a,b,c} / {1..10}) は別の仕組み",
          "ln -s でシンボリックリンク — dotfiles 管理の定番",
        ],
        comprehensionQuestionIds: [],
      },
      {
        id: "text-processing",
        title: "2. テキスト処理 — cat / less / grep / sed / awk / sort / uniq",
        intro:
          "Linux 哲学の中心『テキストはユニバーサルなインターフェース』。grep / sed / awk / sort / uniq を組み合わせるだけで log 解析の大部分が書ける。",
        readingMinutes: 10,
        objectives: [
          "cat / less / head / tail とページャを使い分けられる",
          "grep で行検索、sed で置換、awk で列処理を書ける",
          "sort / uniq / wc / cut / tr などをパイプで連結できる",
        ],
        sections: [
          {
            heading: "2.1 cat / less / head / tail — ファイルを覗く",
            body: "**cat** はファイルを連結して出力 (短いファイル向け)。**less** は対話的ページャ (長いファイル / log)。**head / tail** で先頭 / 末尾 N 行。`tail -f` は『追記を待ち受け』モード — 本番 log 監視の定番。",
            code: "cat app.log                          # 全部出す (短いファイル)\ncat file1 file2 > combined           # 連結\n\n# less (推奨、長いファイル / pipe)\nless app.log\nless +F app.log                       # follow モード (= tail -f)\nless -N app.log                        # 行番号\nless -S app.log                        # 折り返さず横スクロール\nzless app.log.gz                       # gzip も読める\n# キー: / 検索 / n 次 / N 前 / G 末尾 / g 先頭 / F follow / q 終了\n\n# head / tail\nhead -20 app.log                       # 先頭 20 行\ntail -20 app.log                       # 末尾 20 行\ntail -f app.log                        # 追記を流す (本番 log 監視)\ntail -F app.log                        # ファイル rotation にも対応\ntail -n +100 app.log                   # 100 行目以降\n\n# 複数ファイル監視\ntail -f /var/log/{nginx,puma}/*.log\n\n# 行カウント\nwc -l app.log                          # 行数\nwc -lwc app.log                        # 行 / 単語 / バイト",
            language: "bash",
            notes: [
              "less は pipe にも使える: `ps aux | less`、`journalctl -u puma | less +F`",
              "cat ファイル | command の代わりに `< ファイル command` でも同じ (UUOC: Useless Use Of Cat)",
            ],
          },
          {
            heading: "2.2 grep — 行検索",
            body: "`grep PATTERN FILE` で正規表現マッチする行を出力。`-r` 再帰、`-n` 行番号、`-i` 大文字小文字無視、`-v` 反転、`-c` 件数、`-l` ファイル名のみ、`-A N` `-B N` `-C N` で前後 N 行。現代は **ripgrep (rg)** が高速で推奨。",
            code: "# 基本\ngrep ERROR app.log\ngrep -i error app.log                  # 大文字小文字無視\ngrep -v INFO app.log                   # INFO を含まない行\ngrep -c ERROR app.log                  # ヒット件数\n\n# 再帰\ngrep -rn 'TODO' .                       # 行番号付き\ngrep -rn 'TODO' --include='*.rb' .     # 拡張子フィルタ\ngrep -rln 'TODO' .                      # ファイル名のみ\ngrep -rE 'fixme|todo' --include='*.rb' --exclude-dir=node_modules\n\n# 前後コンテキスト\ngrep -A 3 -B 3 ERROR app.log           # 前後 3 行\ngrep -C 3 ERROR app.log                # 上と同じ (Context)\n\n# 拡張正規表現 (-E) / Perl 互換 (-P)\ngrep -E 'ERROR|FATAL' app.log\ngrep -P '\\d{4}-\\d{2}-\\d{2}' app.log    # \\d などの PCRE\n\n# ripgrep (推奨、超高速)\nrg 'TODO'                              # 自動再帰 + .gitignore 尊重\nrg -t ruby 'def calculate'             # ファイルタイプフィルタ\nrg -A 3 'ERROR'\nrg --json 'foo' | jq                   # JSON 出力で構造化",
            language: "bash",
            notes: [
              "ripgrep は再帰がデフォルト + .gitignore 尊重 + 並列 — grep -r より 10 倍以上速いことも",
              "正規表現の基本: . 任意 1 文字 / * 0+ / + 1+ / ? 0 or 1 / [abc] / ^ 行頭 / $ 行末 / \\d 数字",
            ],
          },
          {
            heading: "2.3 sed — ストリームエディタ (置換)",
            body: "**sed** は標準入力をパターンマッチで変換するエディタ。最頻出は `s/old/new/g` (置換)。`-i` でファイル直接編集 (in-place)、`-n` で出力抑制、`p` で『マッチ行のみ出力』。",
            code: "# 基本: 置換\nsed 's/old/new/' file.txt              # 行頭の最初の 1 つ\nsed 's/old/new/g' file.txt             # 全箇所 (g = global)\nsed -i 's/old/new/g' file.txt          # ファイル直接編集 (危険、要バックアップ)\nsed -i.bak 's/old/new/g' file.txt      # .bak でバックアップを残しつつ\n\n# 区切り文字を変える (パス置換で /)\nsed 's|/old/path|/new/path|g' file\n\n# 拡張正規表現 -E\nsed -E 's/[0-9]+/NUM/g' file\n\n# 行範囲指定\nsed '5d' file                          # 5 行目を削除\nsed '10,20d' file                       # 10〜20 行目削除\nsed -n '10,20p' file                   # 10〜20 行目だけ出力 (-n で残りを抑制)\nsed '/^#/d' file                        # コメント行 (# 始まり) を削除\n\n# よくある実用パターン\nsed -i 's/localhost/example.com/g' nginx.conf\nsed -i 's/^DEBUG=true/DEBUG=false/' .env\nfind . -name '*.rb' | xargs sed -i 's/old_method/new_method/g'",
            language: "bash",
            notes: [
              "macOS の sed は BSD 系で `-i` の引数が違う (`-i ''` で空文字列を渡す) — GNU sed と差",
              "複雑な変換は sed より awk / perl / ruby -i -ne の方が読みやすい",
            ],
          },
          {
            heading: "2.4 awk — 列処理の万能ツール",
            body: "**awk** は『各行をフィールド (列) に分割して処理する』言語。`$1` `$2` ... で N 番目のフィールド、`NF` で全列数、`NR` で行番号。デフォルト区切りは空白、`-F` で変更。集計・サマリ・CSV 処理に強い。",
            code: "# ファイルの 1 列目だけ抽出 (空白区切り)\nawk '{print $1}' file.txt\n\n# 2 列目と 5 列目を CSV で\nawk '{print $2 \",\" $5}' file\nawk -v OFS=',' '{print $2, $5}' file   # OFS で出力区切り\n\n# 区切り変更\nawk -F: '{print $1}' /etc/passwd       # : 区切りで 1 列目 (ユーザー名)\nawk -F, '{print $3}' data.csv          # CSV の 3 列目\n\n# フィルタ\nawk '$3 > 100' file                    # 3 列目が 100 より大きい行\nawk '/ERROR/ {print $1, $5}' app.log   # ERROR 行の 1 列目と 5 列目\nawk 'NR > 1' file                       # ヘッダ行スキップ\nawk 'NF == 5' file                      # 5 列ある行だけ\n\n# 集計\nawk '{sum += $3} END {print sum}' file # 3 列目の合計\nawk '{sum += $3; count++} END {print sum/count}' file  # 平均\n\n# 連想配列 (頻度カウント)\nawk '{count[$1]++} END {for (k in count) print k, count[k]}' file | sort -k2 -nr\n\n# 実例: nginx access log の status コード集計\nawk '{print $9}' access.log | sort | uniq -c | sort -nr",
            language: "bash",
          },
          {
            heading: "2.5 sort / uniq / cut / tr — テキストパイプの相棒",
            body: "**sort** 並べ替え、**uniq** 連続重複行除去 (要事前 sort)、**cut** 列の切り出し、**tr** 文字単位変換。これらをパイプで繋ぐと log 集計の大半が書ける。",
            code: "# sort\nsort file.txt                          # 辞書順\nsort -n file.txt                       # 数値順\nsort -nr file.txt                      # 数値降順\nsort -k2 file.txt                      # 2 列目をキー\nsort -t, -k3 -n data.csv               # CSV の 3 列目を数値順\nsort -u file.txt                       # 重複除去 (uniq の代わり)\n\n# uniq (必ず sort してから)\nsort file.txt | uniq                   # 重複除去\nsort file.txt | uniq -c                # 件数付き\nsort file.txt | uniq -c | sort -nr     # 頻度降順\nsort file.txt | uniq -d                # 重複しているものだけ\n\n# cut — 列の切り出し (固定区切り)\ncut -d, -f1,3 data.csv                 # CSV の 1, 3 列目\ncut -c1-10 file.txt                    # 1〜10 文字目\ncut -d: -f1 /etc/passwd                # : 区切りで 1 列目\n\n# tr — 文字変換\necho 'Hello' | tr 'a-z' 'A-Z'          # HELLO (大文字化)\necho 'a b c' | tr ' ' '\\n'              # スペースを改行に\ncat file | tr -d '\\r'                   # CRLF → LF\ncat file | tr -s ' '                    # 連続空白を 1 つに圧縮\n\n# 王道の組合せ\n# /etc/passwd からユーザー名一覧\ncut -d: -f1 /etc/passwd | sort\n\n# log から ERROR の頻度 Top 5\ngrep ERROR app.log | awk '{print $5}' | sort | uniq -c | sort -nr | head -5\n\n# JSON は jq で\ncurl -s https://api.example.com/users | jq '.[] | .email' | sort | uniq",
            language: "bash",
            notes: [
              "uniq は必ず sort の後に — 連続行しか比較しない",
              "JSON は jq、CSV は csvkit / miller (mlr) が便利",
            ],
          },
        ],
        keyTakeaways: [
          "less + tail -f が log の友、grep / ripgrep で行検索",
          "sed s/old/new/g で置換、-i でファイル直接編集 (バックアップ推奨)",
          "awk で列処理 ($1/$NF/NR)、集計 (END で sum/avg)、頻度カウント (連想配列)",
          "sort | uniq -c | sort -nr が log 集計の鉄板パイプ",
        ],
        comprehensionQuestionIds: ["cli-001", "cli-003"],
      },
      {
        id: "find-and-xargs",
        title: "3. find と xargs — 検索と一括処理",
        intro:
          "find はファイル『属性』(名前 / 更新時刻 / サイズ / 種類) で検索する強力ツール。xargs で結果を別コマンドの引数に流し込めば、強力な一括処理パイプが完成する。",
        readingMinutes: 9,
        objectives: [
          "find の主要オプション (-name / -type / -mtime / -size) を使える",
          "xargs で標準入力を別コマンドの引数化、-0 / -I {} / -P で安全 + 並列実行できる",
          "find -exec と xargs の使い分けを判断できる",
        ],
        sections: [
          {
            heading: "3.1 find — 属性で検索",
            body: "`find PATH -CONDITION` の形式。`-name PATTERN` で名前、`-type f/d/l` でファイル / ディレクトリ / シンボリックリンク、`-mtime ±N` で N 日以内 / 以上、`-size +10M` でサイズ。複数条件は `-and` (省略可) / `-or` / `-not`。",
            code: "# 名前で検索\nfind . -name '*.rb'                    # 拡張子 .rb (要クォート — シェル展開回避)\nfind . -iname '*.RB'                    # 大文字小文字無視\nfind . -name 'user*' -type f           # ファイルのみ\n\n# 種類\nfind . -type d                          # ディレクトリ\nfind . -type l                          # symlink\nfind . -type f -empty                   # 空ファイル\n\n# 更新時刻\nfind /var/log -mtime -1                 # 1 日以内\nfind /var/log -mtime +30                # 30 日より前\nfind . -mmin -10                        # 10 分以内 (分単位)\nfind . -newer reference.txt              # reference.txt より新しい\n\n# サイズ\nfind / -size +100M -type f 2>/dev/null  # 100MB 超 (stderr 隠す)\nfind . -size 0                          # 0 バイト\n\n# 権限\nfind /etc -perm 644\nfind . -perm /u=w                       # owner に書込権限あり\n\n# 複数条件 + 除外\nfind . -name '*.log' -not -path './node_modules/*'\nfind . \\( -name '*.tmp' -or -name '*.bak' \\) -delete\n\n# 結果に対してコマンド実行 (-exec)\nfind . -name '*.tmp' -exec rm {} \\;            # 1 件ずつ rm を呼ぶ (遅い)\nfind . -name '*.tmp' -exec rm {} +              # まとめて rm に渡す (高速)\nfind . -name '*.rb' -exec grep -l 'TODO' {} +",
            language: "bash",
            notes: [
              "`-delete` は強力 — 必ず `find ... -print` で確認してから使う",
              "macOS の find (BSD) は -mtime が日単位 (`-mtime -1d`) など細部が違う",
            ],
          },
          {
            heading: "3.2 xargs — 標準入力を引数化",
            body: "`echo a b c | rm` は動かない (rm は標準入力を読まない) が、`echo a b c | xargs rm` は `rm a b c` 相当になる。`find ... | xargs cmd` が定番。`-I {}` でプレースホルダ、`-n N` で N 引数ずつ、`-P N` で N 並列。",
            code: "# 基本: 検索結果を引数化\nfind . -name '*.tmp' | xargs rm\nls *.log | xargs gzip                  # 全 log を gzip\n\n# ファイル名に空白がある可能性 → -print0 + -0 で NULL 区切り (安全)\nfind . -name '*.tmp' -print0 | xargs -0 rm\n\n# -I {} でプレースホルダ\nfind . -name '*.rb' | xargs -I {} cp {} backup/\n# {} の位置を指定可能\nls *.jpg | xargs -I {} convert {} -resize 50% small_{}\n\n# -n N で 1 回のコマンドに N 引数まで\nls *.jpg | xargs -n 1 -I {} echo processing {}\n\n# 並列実行 -P N (CPU を使い切る)\ncat urls.txt | xargs -P 8 -I {} curl -s {} -o /dev/null -w '%{http_code} {}\\n'\n\n# 確認モード -p (実行前に y/n)\nfind . -name '*.tmp' | xargs -p rm\n\n# 何も無い時は実行しない -r (GNU)\nfind . -name 'never_exists' | xargs -r rm",
            language: "bash",
            notes: [
              "ファイル名に空白 / 改行が含まれる可能性 → 必ず `-print0 | xargs -0` の組合せ",
              "`xargs -P` の並列はサーバ負荷に注意 — 試す時は `-P 2` から",
            ],
          },
          {
            heading: "3.3 find -exec vs xargs の使い分け",
            body: "両方とも『検索結果に対してコマンドを実行』だが、性能と書き心地が違う。`-exec ... +` (まとめて 1 回) と `xargs` はほぼ同等の性能。`-exec ... \\;` は 1 件ごとに呼ぶので遅い。並列化 / プレースホルダ自由配置が必要なら xargs。",
            code: "# 性能差\nfind . -name '*.rb' -exec wc -l {} \\;       # 1 ファイルずつ wc を呼ぶ (遅い)\nfind . -name '*.rb' -exec wc -l {} +         # まとめて 1 回呼ぶ (速い)\nfind . -name '*.rb' | xargs wc -l            # 同上 (速い)\n\n# 使い分けの目安\n# -exec ... +    : 単純なファイル削除・ファイル渡し\n# xargs          : 並列実行 / プレースホルダの自由配置 / 別コマンドへの input\n\n# 実用例\n# 1) 30 日以上前の .log を gzip\nfind /var/log -name '*.log' -mtime +30 -exec gzip {} \\;\n\n# 2) 全 .rb で 'old_method' を検索\nfind . -name '*.rb' -print0 | xargs -0 grep -l 'old_method'\n\n# 3) 並列でファイル変換 (xargs 必須)\nfind . -name '*.jpg' -print0 | xargs -0 -P 4 -I {} convert {} {}.webp\n\n# 4) Git で追跡されているファイルだけ対象 (rg / git のほうが速い)\ngit ls-files '*.rb' | xargs sed -i 's/old/new/g'\nrg -l 'old_method' --type ruby | xargs sed -i 's/old_method/new_method/g'",
            language: "bash",
          },
          {
            heading: "3.4 fd / ripgrep — 現代の代替",
            body: "**fd** (find の Rust 製代替) と **ripgrep (rg)** (grep の Rust 製代替) は、デフォルトで .gitignore を尊重 / 並列 / カラー出力。日常使いはこちらが圧倒的に速くて快適。",
            code: "# fd (find の代替)\nfd '\\.rb$'                            # 拡張子 .rb\nfd -t f 'config'                      # ファイル (-t f), 名前に 'config'\nfd -t d 'src'                         # ディレクトリ\nfd -e log                              # 拡張子で (--extension)\nfd -e log -E node_modules              # 除外\nfd --changed-within 1d                 # 1 日以内 (find の -mtime -1)\nfd -x rm                               # -x で実行 (find -exec ... +)\nfd -x gzip                              # 並列\n\n# ripgrep (grep の代替)\nrg 'TODO'                              # 自動再帰\nrg -t ruby 'def calculate'             # ファイルタイプ\nrg -A 3 -B 3 'ERROR'                    # 前後\nrg --json 'pattern' | jq               # JSON 出力\n\n# 組合せ\nfd -e rb -x sed -i 's/old/new/g'      # find + xargs + sed 相当を 1 行で",
            language: "bash",
            notes: [
              "fd / rg はインストール推奨 (brew / apt / cargo install)",
              "find / grep は『どこにでもある』ので最低限覚えておき、ローカルでは fd / rg を使うのが現代",
            ],
          },
        ],
        keyTakeaways: [
          "find は属性で検索 (-name / -type / -mtime / -size / -perm)",
          "xargs で結果を引数化、必ず -print0 + -0 で空白安全に",
          "-exec ... + と xargs はほぼ同等、並列なら xargs -P",
          "fd / ripgrep が現代の代替 — .gitignore 尊重 + 並列で圧倒的に速い",
        ],
        comprehensionQuestionIds: ["cli-001", "cli-008"],
      },
      {
        id: "io-and-pipes",
        title: "4. 標準入出力とパイプ — stdin / stdout / stderr / リダイレクト",
        intro:
          "Unix 哲学『プログラムは text streams を入出力する』。stdin / stdout / stderr の 3 つのストリームと、リダイレクト / パイプ / tee を整理。",
        readingMinutes: 8,
        objectives: [
          "stdin (0) / stdout (1) / stderr (2) のファイルディスクリプタを区別できる",
          "> / >> / 2> / &> / 2>&1 を読み書きできる",
          "tee / プロセス置換 (<(cmd)) で複雑な合流を扱える",
        ],
        sections: [
          {
            heading: "4.1 3 つのストリームとリダイレクト",
            body: "各プロセスは 3 つの『ストリーム』を持つ: **stdin (0)** 入力、**stdout (1)** 通常出力、**stderr (2)** エラー出力。リダイレクトでファイルに / から流せる。`>` 上書き、`>>` 追記、`<` 入力、`2>` stderr、`&>` 両方、`2>&1` stderr を stdout に統合。",
            code: "# 出力をファイルへ\ncmd > out.txt                          # stdout を out.txt に上書き\ncmd >> out.txt                         # 追記\n\n# 入力をファイルから\nsort < unsorted.txt\n\n# stderr のリダイレクト\ncmd 2> errors.log                      # stderr のみ\ncmd 2>> errors.log                     # 追記\ncmd 2>/dev/null                         # 捨てる (find で error を抑制する定番)\n\n# 両方\ncmd &> all.log                          # stdout + stderr (Bash 拡張)\ncmd > all.log 2>&1                     # 同上 (POSIX)\ncmd 2>&1 | grep ERROR                  # stderr も pipe で grep に流す\n\n# 入出力同時\ncmd < input.txt > output.txt 2> errors.log\n\n# ヒアドキュメント / ヒア文字列\ncat <<EOF > config.txt\nname = Alice\nage = 30\nEOF\n\ngrep foo <<< 'foo bar baz'             # ヒア文字列 (1 行入力)\n\n# /dev/null と /dev/stdin /dev/stdout\ncmd > /dev/null 2>&1                   # 全部捨てる\necho 'data' | jq < /dev/stdin",
            language: "bash",
            diagram: `flowchart LR
  IN["入力ファイル"] -- "&lt;" --> P["プロセス\\n(cmd)"]
  P -- "stdout (1)" --> OUT["out.txt\\n&gt; or &gt;&gt;"]
  P -- "stderr (2)" --> ERR["errors.log\\n2&gt; or 2&gt;&gt;"]
  P -- "stdout | pipe" --> NEXT["次のコマンド\\n(grep/sort/...)"]
  P -. "2&gt;&amp;1" .-> OUT
  P -. "2&gt;/dev/null" .-> NULL[("/dev/null")]`,
            diagramCaption: "stdin (0) / stdout (1) / stderr (2) とリダイレクト先",
            notes: [
              "`>` 上書きの事故防止: `set -o noclobber` で既存ファイルへの `>` をエラーに (`>|` で強制上書き)",
              "2>&1 の順序が大事: `cmd 2>&1 | less` (statement 内、2>&1 を pipe より先に)",
            ],
          },
          {
            heading: "4.2 パイプ — プロセス間の流し込み",
            body: "`A | B` は A の stdout を B の stdin に直結。複数のシンプルなツールを組み合わせる Unix 哲学の中核。`A | B | C` のように何段でも繋げる。`|` は stdout のみ、stderr も繋ぎたいなら `|&` (Bash 4+)。",
            code: "# 基本パイプ\nps aux | grep ruby                     # ps の出力を grep に\ncat app.log | grep ERROR | wc -l       # ERROR 行数\n\n# stderr も pipe (Bash 4+)\nstrange-cmd |& grep error              # = strange-cmd 2>&1 | grep error\n\n# よくある集計パイプ\n# Top 10 IP (nginx access.log)\nawk '{print $1}' access.log | sort | uniq -c | sort -nr | head\n\n# ファイル名一覧 (拡張子別件数)\nfind . -type f | sed 's/.*\\.//' | sort | uniq -c | sort -nr\n\n# 重い処理の途中状況を見る\nrails db:migrate 2>&1 | tee migrate.log\n\n# 速度監視\nfind / -type f 2>/dev/null | pv -l > /dev/null   # 行数進捗 (要 pv install)\n\n# Process 数の指定\ncat urls.txt | xargs -P 8 -I {} curl -s {} -o /dev/null -w '%{http_code} {}\\n'",
            language: "bash",
            notes: [
              "パイプの各段は『独立プロセス』として並行実行 — 1 段詰まると全部遅くなる",
              "巨大ファイルを全部メモリに載せない設計 — 1 行ずつ流して処理する",
            ],
          },
          {
            heading: "4.3 tee — T 字パイプで分岐",
            body: "**tee** は標準入力を (1) ファイルに書き出し、(2) 標準出力にも流す T 字パイプ。『ログに記録しつつ次のコマンドにも流す』時に必須。`-a` で追記モード。`stderr` も含めたいなら `2>&1` を tee の前に。",
            code: "# 実行ログをファイル + 画面\nrails db:migrate | tee migrate.log\n\n# 追記モード\nrun-script | tee -a run.log\n\n# stderr もまとめてキャプチャ\nbundle exec rspec 2>&1 | tee rspec.log\n\n# パイプの途中で記録\ngrep ERROR log/production.log | tee errors.log | wc -l\n# → errors.log にも保存しつつ件数表示\n\n# 複数ファイルに同時書き出し\necho 'hello' | tee a.txt b.txt c.txt\n\n# sudo で root 権限ファイルに書き込む裏ワザ\necho 'new line' | sudo tee -a /etc/hosts\n# `echo ... > /etc/hosts` は echo に sudo がかからないので NG",
            language: "bash",
            notes: [
              "`sudo echo 'x' > /etc/hosts` は失敗する (リダイレクトはシェル側で起き、sudo は echo にしかかからない)",
              "tee 経由で `sudo tee -a` が定番のワークアラウンド",
            ],
          },
          {
            heading: "4.4 プロセス置換 — <(cmd) と >(cmd)",
            body: "Bash 拡張。`<(cmd)` は『cmd の出力をファイルに見せかける』、`>(cmd)` は『書き込んだものを cmd の入力に流す』。`diff` で『コマンド A と B の出力を比較』が代表的ユースケース。",
            code: "# 2 つのコマンド出力を diff\ndiff <(ls dir1) <(ls dir2)\ndiff <(sort file1) <(sort file2)\n\n# 同じテキストを 2 つの処理に分岐\ncat huge.log | tee >(grep ERROR > errors.log) >(grep WARN > warns.log) > /dev/null\n\n# プロセス置換で複数 input を 1 つの cmd に\nparallel command ::: <(cat list1) <(cat list2)\n\n# ファイルの代わりに直接渡せる場面\nwhile IFS= read -r line; do\n  echo \"got: $line\"\ndone < <(curl -s https://api.example.com/lines)",
            language: "bash",
            notes: [
              "プロセス置換は Bash / Zsh 拡張 — POSIX sh (dash 等) では使えない",
              "コードレビュー時に最初は面食らうので、コメントを添えると親切",
            ],
          },
        ],
        keyTakeaways: [
          "stdin (0) / stdout (1) / stderr (2) — リダイレクトは番号で指定",
          "&> / 2>&1 で stderr も合流、>>/  >| で追記 / 強制上書き",
          "tee で『記録しつつ次へ流す』、sudo tee -a で root ファイルへ追記",
          "<(cmd) / >(cmd) のプロセス置換で diff やパイプ分岐",
        ],
        comprehensionQuestionIds: ["cli-007"],
      },
      {
        id: "processes-and-permissions",
        title: "5. プロセスと権限 — ps / kill / chmod / chown / sudo",
        intro:
          "プロセス一覧 (ps / top / htop)、シグナル (kill / pkill)、パーミッション (chmod / chown) と sudo の使い方を整理。本番運用の必修知識。",
        readingMinutes: 9,
        objectives: [
          "ps aux / top / htop でプロセスを観察できる、pgrep / pkill で名前検索 + シグナル送信",
          "rwx / 644 / 755 / 600 の権限を読み書きできる、umask を理解",
          "sudo / sudoers / sudo -i の差を理解する",
        ],
        sections: [
          {
            heading: "5.1 ps / top / htop / pgrep — プロセス観察",
            body: "`ps aux` (BSD スタイル) が業界標準のフル一覧。`top` / `htop` で対話的に監視 (CPU / メモリ降順)。`pgrep -fl puma` で名前検索、`pkill -f sidekiq` でシグナル送信。",
            code: "# プロセス一覧\nps aux                                 # 全プロセス (a 全ユーザー u 詳細 x 端末なし含む)\nps aux | grep ruby                     # 絞り込み\nps -ef --forest                        # ツリー表示 (親子関係)\nps -eo pid,user,%cpu,%mem,comm --sort=-%mem | head  # CPU/メモリ順\n\n# 対話的監視\ntop                                    # 標準\nhtop                                   # 視覚的 (要 install)\n# top の中で: P CPU 順 / M メモリ順 / k kill / 1 CPU コア別表示 / q 終了\n\n# 名前で検索\npgrep -fl puma                          # puma を含むプロセスを名前で\npgrep -u alice                          # alice のプロセス\n\n# シグナル送信\nkill <PID>                              # SIGTERM (お願い、graceful)\nkill -15 <PID>                          # SIGTERM (明示)\nkill -9 <PID>                           # SIGKILL (強制、データロス可能性)\nkill -HUP <PID>                         # SIGHUP (設定再読込)\npkill -f sidekiq                        # 名前マッチで kill\nkillall ruby                            # コマンド名で全部\n\n# シグナル一覧\nkill -l\n# 1) SIGHUP  2) SIGINT  3) SIGQUIT  9) SIGKILL  15) SIGTERM\n# 18) SIGCONT  19) SIGSTOP\n\n# Ctrl-C で送られるのは SIGINT (2)、Ctrl-Z は SIGTSTP (停止 — fg で再開)",
            language: "bash",
            notes: [
              "SIGTERM (15) は『お願い、終わって』 — アプリは cleanup できる",
              "SIGKILL (9) は『強制終了』 — アプリは何もできずに死ぬ (最後の手段)",
              "puma / sidekiq などは特定シグナルで graceful restart (SIGUSR2 / SIGTSTP)",
            ],
          },
          {
            heading: "5.2 パーミッション — rwx / 数字表現 / 特殊ビット",
            body: "`ls -l` の左 10 文字を読む。最初の 1 文字はタイプ (- ファイル / d ディレクトリ / l symlink)、残り 9 文字を 3 つに分けて **owner / group / other** の **rwx**。数字表現は r=4 w=2 x=1 の和。`chmod` で変更、`chown` で所有者変更。",
            code: "$ ls -l\n-rw-r--r-- 1 alice users 100 Jan 1 app.rb\n# 1 文字目: - (ファイル) / d (ディレクトリ) / l (symlink)\n# 次の 9 文字: owner=rw- / group=r-- / other=r--\n# 数字: 644 (r=4 w=2 x=1 の和)\n\n# 主要なパターン\n# 644 (-rw-r--r--) : 一般ファイル\n# 755 (-rwxr-xr-x) : 実行ファイル / ディレクトリ\n# 600 (-rw-------) : 鍵ファイル (SSH 秘密鍵は必須)\n# 700 (drwx------) : 個人ディレクトリ\n# 666 (-rw-rw-rw-) : 誰でも書き込み可 (危険、デバッグ用)\n# 777 (-rwxrwxrwx) : 誰でも何でも (絶対避ける)\n\n# chmod\nchmod 644 app.rb\nchmod 755 script.sh\nchmod +x script.sh                     # 全員に実行権限追加\nchmod u+w,g-w,o-r file                 # owner に w 追加 / group から w 削除 / other から r 削除\nchmod -R 755 dir                       # 再帰\n\n# chown\nchown deploy file\nchown deploy:deploy file                # owner:group\nchown -R deploy:deploy /app             # 再帰\n\n# 新規ファイルのデフォルト権限 (umask)\numask                                  # 現在の umask 表示 (例: 022)\n# 644 = 666 (デフォルト) - 022 (umask) で計算\numask 077                              # 個人ファイル用 (group/other 一切なし)\n\n# 特殊ビット\n# setuid (s) : 実行時に owner 権限で動く (例: /usr/bin/passwd)\n# setgid (s) : group の継承\n# sticky bit (t) : /tmp/ に付いている (他人のファイルを消せない)\nls -ld /tmp\n# drwxrwxrwt   ← t が sticky bit",
            language: "bash",
            notes: [
              "SSH 秘密鍵は 600 必須 (~/.ssh/id_ed25519) — それ以外だと ssh-add が拒否",
              "Web アプリ run-as ユーザーは『最小権限』 — root では絶対動かさない",
            ],
          },
          {
            heading: "5.3 sudo / sudoers — 権限昇格",
            body: "`sudo` は『指定コマンドを別ユーザー (デフォルト root) として実行』。`sudo -i` で root シェル、`sudo -u user cmd` で別ユーザー、`sudo !!` で直前を sudo で再実行。誰が何をできるかは `/etc/sudoers` (編集は `visudo` 必須)。",
            code: "# 基本\nsudo apt update                        # root 権限で実行\nsudo -i                                 # root シェル (環境ごと)\nsudo -s                                 # 現在のシェルで root\nsudo -u deploy bundle exec rake db:migrate    # deploy ユーザーで\n\n# パスワードキャッシュ (デフォルト 15 分)\nsudo -v                                 # キャッシュ更新\nsudo -k                                 # キャッシュ破棄\n\n# 直前のコマンドを sudo で再実行\nsudo !!\n\n# sudoers — 権限の定義 (visudo で編集 — syntax check 付き)\nsudo visudo\n# 例:\n# alice    ALL=(ALL:ALL) ALL          # alice は全 host で全コマンド可\n# deploy   ALL=(ALL) NOPASSWD: /bin/systemctl restart puma   # deploy は puma restart のみ pw 無し\n# %admin   ALL=(ALL) ALL               # admin グループ全員\n\n# CI / Bot 用に NOPASSWD を限定したコマンドだけ許す\ndeploy   ALL=NOPASSWD: /usr/bin/git -C /app pull, /bin/systemctl restart app\n\n# 注意\n# sudo で edit するファイルは『現在のユーザーのエディタ設定』が使われない\nsudoedit /etc/nginx/nginx.conf         # 推奨 (一時コピーを編集 → 保存で反映)\n# vs\nsudo vim /etc/nginx/nginx.conf         # root として vim 起動 (root の .vimrc を読む)",
            language: "bash",
            notes: [
              "/etc/sudoers の直接編集は厳禁 — visudo が syntax check してくれる",
              "本番で `sudo su -` (root 化) する代わりに、必要なコマンドだけ NOPASSWD で限定する方が安全",
            ],
          },
          {
            heading: "5.4 ディスク使用量と監視",
            body: "**du** はディレクトリ / ファイル単位、**df** はパーティション単位。`-h` で人間用 (K/M/G)、`-s` で summary。本番で『どこが容量を食ってる？』を高速調査する手順を覚える。",
            code: "# パーティション (全体)\ndf -h                                  # 全パーティション\ndf -h .                                # カレントのみ\ndf -i                                  # inode 使用量 (大量小ファイルでも枯渇する)\n\n# ディレクトリ単位 (ピンポイント調査)\ndu -sh /var/log/*                      # /var/log 直下を 1 行ずつ\ndu -sh ./* | sort -h                   # サイズ順\ndu -h --max-depth=2 /var | sort -hr | head -20\n\n# 大きいファイル探索\nfind / -type f -size +100M 2>/dev/null | xargs ls -lh 2>/dev/null\nfind /var/log -name '*.log.*' -mtime +30 -delete    # 古い log を削除\n\n# CPU / メモリ\nfree -h                                 # メモリ\nuptime                                  # load average (1m, 5m, 15m)\nvmstat 1                                # 1 秒ごとの統計\niostat -x 1                             # ディスク I/O\nsar -u 1 10                             # CPU 使用率 1 秒 x 10 回\n\n# プロセス別\nps -eo pid,user,%cpu,%mem,comm --sort=-%mem | head\nhtop                                    # 視覚的\n\n# 監視ツール\n# Prometheus + node_exporter, Datadog, New Relic, Grafana Cloud などが定番",
            language: "bash",
            notes: [
              "Load Average の目安: CPU コア数を超えると過負荷 (4 コアなら 4.0 以上は危険信号)",
              "df -i で inode 枯渇 — 大量ログを溜め込むサービスで稀に起きる",
            ],
          },
        ],
        keyTakeaways: [
          "ps aux + top/htop でプロセス観察、kill -15 → -9 の順で送信、特定アプリは graceful restart シグナルあり",
          "rwx / 644 / 755 / 600 を体で覚える、SSH 秘密鍵は 600 必須",
          "sudo は必要最小限 + sudoers で限定、visudo で編集",
          "du / df / free / uptime が本番監視の最初の 4 コマンド",
        ],
        comprehensionQuestionIds: ["cli-002", "cli-004", "cli-006"],
      },
      {
        id: "networking-and-ssh",
        title: "6. ネットワーク — SSH / SCP / curl / dig / ss / 障害切り分け",
        intro:
          "リモート接続 (ssh / scp / rsync)、HTTP テスト (curl / jq)、DNS / ポート確認 (dig / ss / nc / lsof)、障害切り分けの定石 (ping → port → DNS) を整理。",
        readingMinutes: 10,
        objectives: [
          "ssh / scp / rsync で安全にリモート操作・ファイル転送ができる",
          "curl で API テスト、ヘッダ・ボディ・ステータスコードを扱える",
          "ping / nc / dig / ss / lsof で『繋がらない』の原因をレイヤーで切り分ける",
        ],
        sections: [
          {
            heading: "6.1 SSH — 鍵認証と ~/.ssh/config",
            body: "`ssh user@host` でリモート接続。鍵は `ssh-keygen -t ed25519` で生成 (`id_rsa` は古い)、公開鍵 (.pub) をサーバの `~/.ssh/authorized_keys` に追加。`~/.ssh/config` に Host エイリアスを書くと `ssh prod` のように短縮。",
            code: "# 鍵生成 (推奨: ed25519)\nssh-keygen -t ed25519 -C 'me@example.com'\n# → ~/.ssh/id_ed25519 (秘密鍵, 600), ~/.ssh/id_ed25519.pub (公開鍵)\n\n# 公開鍵をサーバに登録\nssh-copy-id user@host                  # 自動で authorized_keys に追加\n# または手動: cat ~/.ssh/id_ed25519.pub | ssh user@host 'cat >> ~/.ssh/authorized_keys'\n\n# 接続\nssh user@host\nssh -i ~/.ssh/specific_key user@host    # 鍵指定\nssh -p 2222 user@host                   # 非標準ポート\n\n# ~/.ssh/config (強く推奨)\nHost prod\n    HostName 1.2.3.4\n    User deploy\n    IdentityFile ~/.ssh/prod_key\n    Port 2222\n    ServerAliveInterval 60               # keep-alive (60 秒ごと)\n\nHost *.internal.example.com\n    User admin\n    ProxyJump bastion                    # bastion 経由\n\nHost bastion\n    HostName bastion.example.com\n    User jump\n\n# → `ssh prod` でフル設定で接続、ProxyJump で多段 SSH も透過的\n\n# ポートフォワード (本番 DB に手元から)\nssh -L 5432:localhost:5432 prod         # ローカル 5432 → リモート 5432\npsql -h localhost -p 5432               # ローカルでアクセス\n\n# Remote forward (逆向き)\nssh -R 8080:localhost:3000 prod         # リモートの 8080 → 手元の 3000",
            language: "bash",
            notes: [
              "秘密鍵 (~/.ssh/id_ed25519) は 600 必須 — それ以外だと ssh が拒否",
              "ProxyJump (-J) で bastion 経由を 1 コマンドで",
              "ssh-agent で passphrase を一度入力すれば残りはキャッシュ",
            ],
          },
          {
            heading: "6.2 scp / rsync — ファイル転送",
            body: "**scp** は SSH 経由の単純コピー (小規模)、**rsync** は差分転送 + 再開可能 (大規模・継続同期に強い)。S3 / GCS なら `aws s3 cp` / `gsutil cp`。",
            code: "# scp (Secure Copy)\nscp local.tar.gz user@host:/tmp/        # ローカル → リモート\nscp -r ./mydir user@host:/var/www/     # 再帰\nscp user@host:/etc/nginx/nginx.conf .  # リモート → ローカル\nscp -P 2222 file user@host:~/          # ポート指定\nscp -i ~/.ssh/key file user@host:~/    # 鍵指定\n\n# rsync (差分転送、推奨)\nrsync -avz ./mydir user@host:/var/www/\n# -a archive (再帰 + perm + symlink 等を保存)\n# -v verbose\n# -z compression\nrsync -avz --exclude='.git' --exclude='node_modules' ./ user@host:/var/www/myapp/\nrsync -avz --delete src/ user@host:dest/    # dest にしかないファイルを削除 (双方向同期に近い)\nrsync -avz --dry-run ./ user@host:dest/     # 実行前のシミュレーション (必須)\n\n# 進捗バー\nrsync -avz --info=progress2 ./big-file user@host:~/\n\n# 中断 / 再開\n# rsync は途中で止めても、同じコマンドで再実行すれば差分だけ転送される\n\n# クラウドストレージ\naws s3 cp local.tar.gz s3://my-bucket/backups/\naws s3 sync ./mydir s3://my-bucket/myapp/ --delete\ngsutil cp local.tar.gz gs://my-bucket/backups/\nrclone copy local.tar.gz onedrive:/Backups/    # 多種クラウド対応",
            language: "bash",
            notes: [
              "rsync の `--dry-run` は必ず最初に — 意図しない削除を防ぐ",
              "本番デプロイの初期は rsync が定番、徐々に CI/CD or コンテナへ移行",
            ],
          },
          {
            heading: "6.3 curl + jq — HTTP テストと JSON 整形",
            body: "**curl** は HTTP/HTTPS/FTP などのクライアント。`-X` メソッド、`-H` ヘッダ、`-d` ボディ、`-i` レスポンスヘッダも表示、`-v` 詳細、`-s` 無音、`-w` 形式指定。**jq** で JSON を整形 / フィルタ。",
            code: "# 基本\ncurl https://example.com\ncurl -i https://example.com             # ヘッダも表示\ncurl -v https://example.com             # 詳細 (SSL ハンドシェイク等)\ncurl -s https://example.com             # プログレス非表示\n\n# POST\ncurl -X POST -H 'Content-Type: application/json' \\\n  -d '{\"name\":\"Alice\"}' \\\n  http://localhost:3000/users\n\n# JSON ファイル送信\ncurl -X POST -H 'Content-Type: application/json' \\\n  --data @payload.json \\\n  http://localhost:3000/users\n\n# 認証ヘッダ\ncurl -H 'Authorization: Bearer abc123' https://api.example.com/me\n\n# レスポンスステータスコード抽出\ncurl -s -o /dev/null -w '%{http_code}\\n' https://example.com\ncurl -s -o /dev/null -w 'time=%{time_total} status=%{http_code}\\n' https://example.com\n\n# Cookie\ncurl -c cookies.txt https://example.com/login   # 保存\ncurl -b cookies.txt https://example.com/me      # 利用\n\n# jq でレスポンス整形\ncurl -s https://api.example.com/users | jq                  # 整形表示\ncurl -s https://api.example.com/users | jq '.[].email'      # email フィールド抽出\ncurl -s https://api.example.com/users | jq 'map(.email)'    # 配列に\ncurl -s https://api.example.com/users | jq '.[] | select(.active==true)'\ncurl -s https://api.example.com/users | jq -r '.[].email'   # raw (quotes なし)\n\n# 並列リクエスト\ncat urls.txt | xargs -P 8 -I {} curl -s {} -o /dev/null -w '%{http_code} {}\\n'\n\n# HTTPie (curl の使いやすい代替)\nhttp POST localhost:3000/users name=Alice email=a@x\nhttp GET api.example.com/me Authorization:'Bearer abc'",
            language: "bash",
            notes: [
              "curl は POSIX 標準 — どこにでもある。HTTPie / xh はローカルで便利",
              "jq の `-r` (raw) は『文字列の quotes を外す』 — shell スクリプトで値を取り出す時に必須",
            ],
          },
          {
            heading: "6.4 障害切り分け — ping / nc / dig / ss / lsof",
            body: "『繋がらない』の原因は複数レイヤー。**Layer 3 到達** (ping)、**Layer 4 ポート** (nc / telnet)、**DNS** (dig / nslookup)、**Layer 7 HTTP** (curl)、**証明書** (openssl s_client)、**手元のリスナ** (ss / lsof) と順に切り分ける。",
            code: "# 1. 到達性 (ICMP / Layer 3)\nping -c 4 example.com                  # 4 回\nping -c 4 8.8.8.8                       # IP 直で (DNS 問題を切り分け)\n\n# 2. ポート疎通 (TCP / Layer 4)\nnc -zv example.com 443                  # netcat (z=スキャン v=verbose)\ntelnet example.com 443                  # 古典的 (もう非推奨)\n\n# 3. DNS\ndig example.com                         # 詳細 (推奨)\ndig +short example.com                  # IP のみ\ndig @8.8.8.8 example.com                # 別 DNS サーバで\ndig MX example.com                       # MX レコード\ndig NS example.com                       # NS レコード\nnslookup example.com\nhost example.com\n\n# 4. アプリ層 (HTTP / Layer 7)\ncurl -v https://example.com\ncurl -I https://example.com             # HEAD だけ (ヘッダ確認)\n\n# 5. ルート追跡 (どこで止まってる？)\ntraceroute example.com\nmtr example.com                          # 連続監視 (見やすい)\n\n# 6. HTTPS 証明書\nopenssl s_client -connect example.com:443 -servername example.com < /dev/null\nopenssl s_client -connect example.com:443 -servername example.com 2>&1 | openssl x509 -noout -dates  # 有効期限\n\n# 7. 手元の listen ポート\nss -tlnp                                # TCP listen 一覧 + プロセス (現代の標準)\nss -tlnp | grep 3000                    # ポート 3000\nlsof -i:3000                            # そのポートを使うプロセス\nlsof -i tcp:3000                        # TCP のみ\nnetstat -tlnp                           # 古い (環境によってはまだ現役)\n\n# 8. パケットレベル (重い、本気の調査)\ntcpdump -i eth0 -nn 'port 443' -w out.pcap\nwireshark out.pcap                       # GUI で開く",
            language: "bash",
            notes: [
              "切り分け順: ping → DNS → port → HTTP → 証明書 — 下から上へ",
              "本番調査は ping + curl -v + dig +short の 3 つで大半解決",
              "ss -tlnp は netstat の現代版 (Linux)、macOS は lsof -i や netstat",
            ],
          },
        ],
        keyTakeaways: [
          "SSH は ed25519 + ~/.ssh/config + ProxyJump で爆速、ポートフォワードで DB 経由も",
          "rsync は差分転送 + --dry-run、scp は単発、クラウドなら aws s3 cp",
          "curl + jq の組合せで API テスト + JSON 整形、-w でステータスコード抽出",
          "障害切り分けは『ping → DNS → port → HTTP → 証明書』の順で下から上に",
        ],
        comprehensionQuestionIds: ["cli-005", "cli-012", "cli-013", "cli-014", "cli-016"],
      },
      {
        id: "shell-automation-and-ops",
        title: "7. シェル自動化と運用 — alias / function / tmux / cron / systemd",
        intro:
          ".bashrc / .zshrc / alias / function でシェルを快適に、tmux / screen でセッション継続、cron / systemd-timer で定期実行、systemd でサービス管理。本番運用の総まとめ。",
        readingMinutes: 10,
        objectives: [
          "alias / function / 環境変数 / PATH を .bashrc / .zshrc に書ける",
          "tmux で SSH 切断耐性のあるセッション、分割ペインを扱える",
          "cron / crontab と systemd-timer の使い分け、systemd でサービス管理ができる",
        ],
        sections: [
          {
            heading: "7.1 alias / function と .bashrc / .zshrc",
            body: "`alias name='command'` で短縮、関数なら `function f() { ... }`。`~/.bashrc` (bash) / `~/.zshrc` (zsh) に書いて永続化。環境変数は `export KEY=value`、`PATH` は `export PATH=$HOME/bin:$PATH`。",
            code: "# ~/.zshrc (Zsh の例)\n# Alias\nalias gs='git status'\nalias gc='git commit'\nalias gp='git push'\nalias gl='git log --oneline -20'\nalias glg='git log --oneline --graph --all --decorate'\nalias gpfl='git push --force-with-lease'\nalias be='bundle exec'\nalias rs='bin/rails server'\nalias rc='bin/rails console'\nalias rt='bundle exec rspec'\nalias ll='ls -lah'\nalias ..='cd ..'\nalias ...='cd ../..'\n\n# Function (引数を取りたい時)\nfunction mkcd() {\n  mkdir -p \"$1\" && cd \"$1\"\n}\n\nfunction gclone() {\n  git clone \"$1\" && cd $(basename \"$1\" .git)\n}\n\nfunction extract() {\n  case \"$1\" in\n    *.tar.gz)  tar xzf \"$1\" ;;\n    *.tar.bz2) tar xjf \"$1\" ;;\n    *.zip)     unzip \"$1\" ;;\n    *.gz)      gunzip \"$1\" ;;\n    *) echo 'unknown' ;;\n  esac\n}\n\n# 環境変数 / PATH\nexport EDITOR=vim\nexport VISUAL=vim\nexport PAGER=less\nexport LANG=ja_JP.UTF-8\nexport PATH=\"$HOME/bin:$HOME/.local/bin:$PATH\"\nexport PATH=\"$HOME/.cargo/bin:$PATH\"\n\n# プロンプト (Zsh)\nautoload -U colors && colors\nPROMPT='%{$fg[green]%}%n@%m %{$fg[blue]%}%~ %{$reset_color%}$ '\n\n# 反映\nsource ~/.zshrc",
            language: "bash",
            notes: [
              "dotfiles を git 管理 + symlink で本体に置くのが定番 (1 章 1.4)",
              "Zsh + oh-my-zsh / Prezto / starship で見た目とプロンプトを強化する流派が多い",
              "fish shell は POSIX 非互換だが補完が強力 — 好みで",
            ],
          },
          {
            heading: "7.2 tmux / screen — ターミナル多重化",
            body: "1 つのターミナルセッションに複数ウィンドウ / 分割ペインを持てる。SSH を切っても detach 状態で生存し、後で attach で復帰可能。**tmux** (推奨)、**screen** (古典)、**zellij** (新興、設定不要)。",
            code: "# tmux 基本操作\ntmux new -s deploy                     # 新セッション (名前付き)\ntmux ls                                 # セッション一覧\ntmux attach -t deploy                   # 再接続\ntmux attach                              # 最新セッション\ntmux kill-session -t deploy             # 終了\n\n# tmux のキーバインド (prefix: Ctrl-b)\n# Ctrl-b d   detach (中断せず抜ける)\n# Ctrl-b c   新ウィンドウ\n# Ctrl-b ,   ウィンドウ名変更\n# Ctrl-b 0-9 ウィンドウ番号で切替\n# Ctrl-b n / p   次 / 前ウィンドウ\n# Ctrl-b %   縦分割 (左右)\n# Ctrl-b \"   横分割 (上下)\n# Ctrl-b 矢印   ペイン間移動\n# Ctrl-b x   ペイン閉じる\n# Ctrl-b z   ペインを全画面 (再度押すと戻る)\n# Ctrl-b [   コピーモード (vim-like で移動 + コピー)\n# Ctrl-b ?   キー一覧\n\n# ~/.tmux.conf (好みでカスタム)\nset -g prefix C-a                        # prefix を Ctrl-a に変更\nunbind C-b\nset -g mouse on                          # マウス操作有効\nset -g base-index 1                      # window 番号を 1 から\nbind '|' split-window -h                 # | で縦分割\nbind '-' split-window -v                 # - で横分割\n\n# screen (古典)\nscreen -S deploy                         # 新規\nscreen -r deploy                         # 再接続\n# Ctrl-a d  → detach\n\n# zellij (新興、デフォルトで分かりやすい)\nzellij                                   # 起動するとガイドが出る\n\n# 1 回限りのバックグラウンド実行 (多重化機能なし)\nnohup ./long_running.sh > out.log 2>&1 &\ndisown                                   # 親シェル終了でも継続",
            language: "bash",
            notes: [
              "本番サーバの長時間処理 (デプロイ・データ移行・dump) は必ず tmux 内で",
              "tmux の prefix を Ctrl-a に変えると Emacs / readline と被るので注意 — 慣れの問題",
            ],
          },
          {
            heading: "7.3 cron / systemd-timer — 定期実行",
            body: "**cron** は伝統的な定期実行デーモン。`crontab -e` で編集、`分 時 日 月 曜 コマンド` の 5 フィールド書式。**systemd-timer** はモダンな代替 (依存関係 / ログ統合 / 再試行が強い)。Rails では `whenever` gem が Ruby DSL から crontab を生成。",
            code: "# cron (個人ユーザー)\ncrontab -e                              # 編集\ncrontab -l                              # 確認\n\n# 書式: 分 時 日 月 曜 cmd\n# *  全部\n# */N N ごと\n# A,B,C カンマ列挙\n# A-B 範囲\n\n# 例\n*/5 * * * * curl -s https://example.com/heartbeat   # 5 分毎\n0 3 * * * /usr/local/bin/backup.sh >> /var/log/backup.log 2>&1   # 毎日 3:00\n0 9 * * 1 echo 'Monday meeting' | mail -s 'reminder' alice@x     # 月曜 9:00\n0 0 1 * * /opt/monthly-cleanup.sh                                  # 毎月 1 日\n\n# Rails の whenever (Ruby DSL → crontab 自動生成)\n# config/schedule.rb\nevery 1.day, at: '3:00 am' do\n  rake 'cleanup:old_records'\nend\nevery 5.minutes do\n  rake 'healthcheck:ping'\nend\n# bundle exec whenever --update-crontab で反映\n\n# systemd-timer (モダン)\n# /etc/systemd/system/backup.service\n[Unit]\nDescription=Daily backup\n[Service]\nType=oneshot\nExecStart=/usr/local/bin/backup.sh\nUser=deploy\n\n# /etc/systemd/system/backup.timer\n[Unit]\nDescription=Run backup daily\n[Timer]\nOnCalendar=*-*-* 03:00:00\nPersistent=true\n[Install]\nWantedBy=timers.target\n\n# 有効化\nsudo systemctl daemon-reload\nsudo systemctl enable --now backup.timer\nsystemctl list-timers                  # 全 timer 一覧 + 次回実行時刻",
            language: "bash",
            notes: [
              "cron は『stdout / stderr を root にメール送信』するのがデフォルト → 必ず `>> log 2>&1` で握り潰す",
              "systemd-timer の方がログ (journalctl) + 失敗時再試行 (Restart=) + 依存関係で強い",
              "cron は環境変数を読み込まない — シェル絶対パスや `source ~/.bashrc` を明示",
            ],
          },
          {
            heading: "7.4 systemd — サービス管理",
            body: "現代の Linux で『デーモンを動かす』の標準。**systemctl** で起動 / 停止 / 再起動 / 自動起動、**journalctl** でログ閲覧。サービス定義は `/etc/systemd/system/*.service`。",
            code: "# サービス操作 (systemctl)\nsudo systemctl start puma\nsudo systemctl stop puma\nsudo systemctl restart puma\nsudo systemctl reload puma              # 設定再読込 (アプリ次第)\nsudo systemctl status puma              # 状態確認\nsudo systemctl enable puma              # 自動起動 ON\nsudo systemctl disable puma              # 自動起動 OFF\nsudo systemctl enable --now puma        # ON + 即起動\n\n# ログ (journalctl)\njournalctl -u puma                       # puma のログ全部\njournalctl -u puma -f                    # tail -f 相当\njournalctl -u puma --since '1 hour ago'\njournalctl -u puma --since today\njournalctl -u puma -p err                 # err 以上のみ\njournalctl --vacuum-time=7d              # 古いログを削除\n\n# サービス定義 (/etc/systemd/system/myapp.service)\n[Unit]\nDescription=My Rails App\nAfter=network.target postgresql.service\nRequires=postgresql.service\n\n[Service]\nType=simple\nUser=deploy\nGroup=deploy\nWorkingDirectory=/var/www/myapp\nEnvironmentFile=/var/www/myapp/.env\nExecStart=/var/www/myapp/bin/rails server -e production -b 0.0.0.0\nExecReload=/bin/kill -USR2 $MAINPID    # アプリ次第\nRestart=on-failure\nRestartSec=5\nStandardOutput=journal\nStandardError=journal\n\n[Install]\nWantedBy=multi-user.target\n\n# 反映\nsudo systemctl daemon-reload\nsudo systemctl enable --now myapp\nsudo systemctl status myapp\njournalctl -u myapp -f                   # ログ tail\n\n# 失敗時の調査\nsystemctl status myapp                   # 直近のエラーが見える\njournalctl -u myapp -n 100 --no-pager    # 末尾 100 行",
            language: "bash",
            notes: [
              "Restart=on-failure + RestartSec=5 でクラッシュ時の自動復旧",
              "ログは syslog ではなく journal に統一 (journalctl で一括閲覧)",
              "Docker / Kubernetes 環境では systemd ではなくコンテナランタイムが担当",
            ],
          },
        ],
        keyTakeaways: [
          "alias / function / 環境変数を .bashrc / .zshrc にまとめて永続化、dotfiles を git 管理",
          "tmux で SSH 切断に強いセッション、分割ペイン、長時間処理は必ず内側で",
          "cron は古典 / systemd-timer はモダン (再試行 + journal 統合)",
          "systemctl + journalctl でサービス管理 / ログ閲覧、Restart=on-failure で自動復旧",
        ],
        comprehensionQuestionIds: ["cli-009", "cli-010", "cli-011", "cli-015"],
      },
    ],
  },

  // ---------- InfoSec 入門ガイド ----------
  {
    id: "infosec-intro",
    trackId: "infosec",
    title: "Web セキュリティの地図 — OWASP Top 10 と Rails の防御",
    subtitle:
      "OWASP Top 10 (2021) を軸に Web アプリの守り方を 7 章で。Injection / XSS / CSRF / 認証認可 / シークレット管理 / HTTPS / レート制限・依存監査",
    audience:
      "Rails / Web アプリを書くが OWASP / CSP / JWT / セッション設計でフワッとしている人、Pen Test や監査の前に最低限を整えたい人。Rails 中心だが他フレームワークでも応用可",
    sources: [
      { label: "OWASP Top 10 (2021)", url: "https://owasp.org/Top10/ja/" },
      { label: "Rails Security Guide (公式)", url: "https://railsguides.jp/security.html" },
      { label: "MDN Web Security", url: "https://developer.mozilla.org/ja/docs/Web/Security" },
    ],
    emoji: "🛡️",
    relatedCategoryIds: ["security"],
    chapters: [
      {
        id: "owasp-overview",
        title: "1. OWASP Top 10 と多層防御の考え方",
        intro:
          "OWASP Top 10 (2021) は Web 脆弱性のチェックリスト。1 位は Broken Access Control (アクセス制御)、Injection は 3 位に後退。脅威モデルと『多層防御 (defense in depth)』の発想を整理する。",
        readingMinutes: 7,
        objectives: [
          "OWASP Top 10 (2021) のカテゴリと頻出パターンを列挙できる",
          "認証 (Who you are) と認可 (What you can do) を分けて考えられる",
          "多層防御 — Strong Params / 認可 / バリデーション / WAF などを層として理解する",
        ],
        sections: [
          {
            heading: "1.1 OWASP Top 10 (2021) の主要 10 カテゴリ",
            body: "**A01 Broken Access Control**: 認可不備で本来見えない情報を取れる。**A02 Cryptographic Failures**: 通信 / 保存の暗号化不備。**A03 Injection**: SQL / コマンド / NoSQL injection。**A04 Insecure Design**: 設計段階の欠陥。**A05 Security Misconfiguration**: 設定ミス。**A06 Vulnerable Components**: 古い gem / lib。**A07 ID & Auth Failures**: 認証の不備。**A08 Software & Data Integrity**: CI/CD / 依存改ざん。**A09 Logging & Monitoring**: 検知漏れ。**A10 SSRF**: サーバ側リクエスト偽造。",
            code: "# OWASP Top 10 (2021) — Web アプリ脆弱性の頻出 10 カテゴリ\n#\n# 順位  カテゴリ                                   Rails 主な対策\n# A01   Broken Access Control                     Pundit / CanCanCan, before_action\n# A02   Cryptographic Failures                    HTTPS / HSTS, bcrypt, credentials.yml.enc\n# A03   Injection                                 ActiveRecord placeholder, sanitize\n# A04   Insecure Design                            脅威モデリング, レビュー\n# A05   Security Misconfiguration                  本番 config, default deny, CSP\n# A06   Vulnerable and Outdated Components         bundle audit, Dependabot\n# A07   Identification & Authentication Failures   has_secure_password, rack-attack\n# A08   Software and Data Integrity Failures       Signed cookies, SRI, CI checksum\n# A09   Security Logging & Monitoring Failures     filter_parameters, Sentry, audit log\n# A10   Server-Side Request Forgery (SSRF)         URL allowlist, internal IP block\n\n# 参考: https://owasp.org/Top10/ja/",
            language: "text",
            notes: [
              "Top 10 は『流行りの脆弱性』というより、頻発する分類 — 全部知ってる必要はないが、用語は知っておく",
              "Top 10 自体は数年に一度更新される (2017 → 2021)、ただ大枠は安定",
            ],
          },
          {
            heading: "1.2 認証 (AuthN) と認可 (AuthZ) を分ける",
            body: "セキュリティ初学者がよく混同する 2 つ。**認証 (Authentication)**: あなたが誰か (ログイン)。**認可 (Authorization)**: ログイン済みのあなたに何を許すか。HTTP ステータスも別: 認証失敗は **401 Unauthorized** (誤訳)、認可失敗は **403 Forbidden**。",
            code: "# 認証 (AuthN): ログイン\n# - has_secure_password / Devise / Sorcery / Clearance\n# - レスポンス: 401 (未認証)\n\nclass ApplicationController < ActionController::Base\n  before_action :authenticate_user!     # ログインしてなければ 401\nend\n\n# 認可 (AuthZ): 操作の許可\n# - Pundit / CanCanCan / 自前 (current_user.admin?)\n# - レスポンス: 403 (権限なし)\n\nclass PostsController < ApplicationController\n  def destroy\n    post = Post.find(params[:id])\n    authorize post                       # Pundit (権限なければ 403)\n    post.destroy\n  end\nend\n\n# 認可は『URL レベル』だけでなく『リソースレベル』で\n# - /posts/:id の URL を知っていれば見えてしまう (Insecure Direct Object Reference)\n# - Post.where(user: current_user).find(params[:id]) のように所有者でスコープ\n# - or Pundit policy で `record.user == user` を確認",
            language: "ruby",
            notes: [
              "401/403/404 の使い分けは熟練の領域。情報漏洩を避けるため『見つからない』と『権限なし』を 404 に統一する設計も",
              "URL 直叩きで他人のリソースが見えるバグ (IDOR) は最頻出 — 認可で必ず守る",
            ],
          },
          {
            heading: "1.3 多層防御 (Defense in Depth)",
            body: "1 つの対策に頼らず、複数の層で守る。例: ログイン画面の保護は (1) HTTPS + HSTS、(2) bcrypt パスワード、(3) rack-attack のレート制限、(4) MFA (TOTP)、(5) アクセスログ + 監視、(6) CSP、(7) Secure/HttpOnly/SameSite Cookie、と層を重ねる。1 つ破られても被害を限定。",
            code: "# 多層防御の例 — ログイン機能\n\n# Layer 1: 通信暗号化\n#  - config.force_ssl = true / HSTS / TLS 1.2+ / 適切な暗号スイート\n\n# Layer 2: 認証強度\n#  - bcrypt (cost=12)\n#  - 弱パスワード禁止 (NIST SP 800-63B: 長さ重視)\n#  - TOTP / WebAuthn (MFA)\n\n# Layer 3: ブルートフォース対策\n#  - rack-attack: IP/メール 単位 5 回 /分\n#  - 失敗時の遅延応答 (timing attack 緩和は別途定数時間比較)\n\n# Layer 4: セッション\n#  - Secure / HttpOnly / SameSite=Lax\n#  - 適切な expire\n#  - ログイン後にセッション ID 再生成 (固定化攻撃対策)\n\n# Layer 5: 認可\n#  - Pundit / CanCanCan\n#  - リソース所有者スコープ\n\n# Layer 6: 検知\n#  - filter_parameters でログ漏洩防止\n#  - Sentry / Datadog でエラー監視\n#  - 不正パターン検知 (ログイン失敗集中、IP からの大量 4xx 等)\n\n# Layer 7: 周辺\n#  - Dependabot / bundle audit で gem を最新に\n#  - WAF (Cloudflare / AWS WAF) で表面の異常を撥ねる",
            language: "ruby",
            notes: [
              "『完璧な 1 つの防御』ではなく『複数の不完全な防御を重ねる』のが現実解",
              "予算 / リスクに応じて層を増やす — スタートアップは 1〜4 層、エンタープライズは 7 層 + 監査",
            ],
          },
        ],
        keyTakeaways: [
          "OWASP Top 10 (2021) の 1 位は Broken Access Control、認可は最頻出の脆弱性源",
          "認証 (AuthN, 401) と認可 (AuthZ, 403) を必ず分けて考える",
          "1 つの対策に頼らず多層防御で『破られても被害を限定』",
        ],
        comprehensionQuestionIds: ["sec-007"],
      },
      {
        id: "injection",
        title: "2. Injection — SQL / コマンド / NoSQL の防御",
        intro:
          "Injection は『ユーザー入力を実行コードの一部にしてしまう』脆弱性。SQL Injection、コマンド Injection、NoSQL Injection を整理。Rails の placeholder と sanitize ヘルパを正しく使う。",
        readingMinutes: 9,
        objectives: [
          "SQL Injection の典型パターンを見抜き、ActiveRecord で安全に書ける",
          "コマンド Injection / NoSQL Injection を防げる",
          "order(params[:sort]) のようなカラム名 injection も意識する",
        ],
        sections: [
          {
            heading: "2.1 SQL Injection — placeholder と Hash 形式",
            body: "**文字列補間** (`#{params[:x]}`) で SQL を組むのは即アウト。`User.where(\"name = '#{params[:name]}'\")` に対し攻撃者が `' OR 1=1; --` を送ると認証回避。ActiveRecord の `?` placeholder / `:name` placeholder / Hash 形式を使えば自動エスケープされる。",
            code: "# ❌ 危険 (文字列補間)\nUser.where(\"name = '#{params[:name]}'\")\nUser.where(\"name = #{params[:name]}\")\nUser.find_by_sql(\"SELECT * FROM users WHERE id = #{params[:id]}\")\n\n# 攻撃例\n# params[:name] = \"' OR 1=1; --\"\n# → SELECT * FROM users WHERE name = '' OR 1=1; --'\n# → 全件返る\n\n# params[:name] = \"'; DROP TABLE users; --\"\n# → users テーブル削除\n\n# ✅ 安全 — placeholder\nUser.where(\"name = ?\", params[:name])\nUser.where(\"name = :n AND age > :a\", n: params[:name], a: 18)\nUser.find_by_sql([\"SELECT * FROM users WHERE id = ?\", params[:id]])\n\n# ✅ 安全 — Hash 形式 (推奨)\nUser.where(name: params[:name])\nUser.where(name: params[:name], active: true)\nUser.find_by(name: params[:name])\n\n# ✅ 範囲・配列も Hash 形式で\nUser.where(age: 18..65)\nUser.where(role: %w[admin editor])\nUser.where(created_at: 1.week.ago..)",
            language: "ruby",
            notes: [
              "ActiveRecord は placeholder と Hash 形式で値を自動エスケープ + 型変換",
              "raw SQL を書く必要があれば必ず sanitize_sql_for_conditions / find_by_sql + 配列形式",
            ],
          },
          {
            heading: "2.2 order / group / カラム名 Injection",
            body: "値はエスケープされても、**カラム名 / SQL キーワード** が動的だと別の Injection が起きる。`order(params[:sort])` は攻撃者が `id; DROP TABLE users` を送れる。`pluck` / `select` / `group` / `order` でユーザー入力を直接受けない、または allowlist で検証する。",
            code: "# ❌ 危険 (カラム名 injection)\nUser.order(params[:sort])              # → id; DROP TABLE users\nUser.group(params[:group])\nUser.pluck(params[:col])\n\n# ✅ allowlist で検証\nALLOWED_SORTS = %w[id name created_at]\nsort = ALLOWED_SORTS.include?(params[:sort]) ? params[:sort] : 'id'\nUser.order(sort)\n\n# ✅ Hash 形式 / 定数だけ受ける\nUser.order(name: :desc)\nUser.order(params[:sort] == 'name' ? { name: :desc } : { id: :desc })\n\n# ✅ Arel で型安全に\nUser.order(User.arel_table[:name].desc)\n\n# ✅ sanitize_sql_for_order (Rails 6+)\nUser.order(Arel.sql(User.sanitize_sql_for_order(params[:sort])))\n# ※ sanitize_sql_for_order は完璧ではない — 結局 allowlist が安全",
            language: "ruby",
            notes: [
              "Rails 6+ の Arel.sql(...) で『生 SQL を意図的に許可』を明示できる (それ以外は警告)",
              "ソート機能の UI は『プルダウン』にして allowlist と組合せるのが最も安全",
            ],
          },
          {
            heading: "2.3 コマンド Injection — shell に値を直接渡さない",
            body: "`system(\"convert #{params[:filename]} out.png\")` のような shell 経由のコマンド実行は、`; rm -rf /` のような注入を許す。Ruby なら **配列形式** (`system('convert', filename, 'out.png')`) で渡せば shell を経由せずに引数として安全に渡る。",
            code: "# ❌ 危険 (shell 経由)\nsystem(\"convert #{params[:filename]} out.png\")\nbacktick = `ls #{params[:dir]}`\nIO.popen(\"grep #{params[:q]} log.txt\")\n\n# 攻撃例: params[:filename] = 'a.jpg; rm -rf /'\n# → convert a.jpg; rm -rf / out.png\n\n# ✅ 安全 (配列形式 — shell 経由しない)\nsystem('convert', params[:filename], 'out.png')\nIO.popen(['grep', params[:q], 'log.txt'])\nOpen3.capture3('git', 'clone', params[:url])\n\n# ✅ allowlist で検証\nALLOWED_DIRS = %w[uploads tmp]\nif ALLOWED_DIRS.include?(params[:dir])\n  Dir.entries(\"/var/#{params[:dir]}\")\nend\n\n# ✅ Shellwords でエスケープ (どうしても shell 経由したい時)\nrequire 'shellwords'\nsystem(\"echo #{Shellwords.escape(user_input)}\")",
            language: "ruby",
            notes: [
              "system() / Kernel#` / Kernel#exec / IO.popen の文字列単一引数は shell 経由 → 配列形式で回避",
              "URL / ファイル名 / その他外部入力を shell に渡す処理を見たら必ず疑う",
            ],
          },
          {
            heading: "2.4 NoSQL Injection / その他の Injection",
            body: "MongoDB / Elasticsearch / Redis でも Injection は起きる。JSON クエリに直接 user input を入れると、`{ \"$gt\": \"\" }` を送られて全件マッチなど。Redis の Lua スクリプト / Elasticsearch の query string も注意。",
            code: "# ❌ MongoDB (Mongoid) で危険\nUser.where(name: params[:name])           # 通常はこれで OK\n# ただし params[:name] が Hash で来ると...\n# params = { name: { '$gt' => '' } }\n# → 全件 match\n\n# ✅ パラメータの型を強制\ndef user_params\n  params.require(:user).permit(:name)     # Strong Params で文字列強制\nend\nname = String(params[:name])               # 型変換\n\n# ❌ Elasticsearch query string\nclient.search(body: { query: { query_string: { query: params[:q] } } })\n# user input が AND OR ( ) などを含むと意図しない検索に\n\n# ✅ match query (構文を解釈しない)\nclient.search(body: { query: { match: { field: params[:q] } } })\n\n# ❌ LDAP / XPath / template injection (ERB / Jinja2 で user input を直接埋め込む)\nERB.new(params[:template]).result(binding)   # template injection 直行\n\n# ✅ template は固定ファイルから読み、変数だけ渡す",
            language: "ruby",
            notes: [
              "JSON API は『来たデータの型』を信用しない — Strong Params + 型変換で固める",
              "テンプレートエンジンに user input を渡すのは絶対避ける",
            ],
          },
        ],
        keyTakeaways: [
          "SQL は placeholder (?) / Hash 形式 / Arel — 文字列補間 #{} は禁忌",
          "order / group / カラム名は allowlist で検証、Arel.sql() で明示",
          "shell コマンドは配列形式で system('cmd', arg1, arg2) — 文字列単一は危険",
          "NoSQL / Elasticsearch / Template も Injection の対象、型と構文を制御",
        ],
        comprehensionQuestionIds: ["sec-002"],
      },
      {
        id: "xss-and-csp",
        title: "3. XSS と Content Security Policy",
        intro:
          "XSS (Cross-Site Scripting) は『他人のページに JS を仕込む』攻撃。Rails は自動 HTML エスケープで Reflected XSS をほぼ防ぐが、`html_safe` / `raw` で穴が開く。CSP で『二段の防御』を加える。",
        readingMinutes: 9,
        objectives: [
          "Reflected / Stored / DOM-based XSS の違いを説明できる",
          "Rails の自動エスケープと html_safe / sanitize の使い分けを書ける",
          "Content Security Policy で外部スクリプト / インライン JS を禁止できる",
        ],
        sections: [
          {
            heading: "3.1 XSS の 3 種類",
            body: "**Reflected XSS**: URL クエリの値がそのままページに出る (例: 検索結果の query 表示)。**Stored XSS**: DB に保存された不正 HTML が他人の画面で実行 (コメント欄 / プロフィール)。**DOM-based XSS**: クライアント JS で `innerHTML = location.hash` のように DOM 操作で発生。",
            code: "# Reflected XSS の例\n# URL: /search?q=<script>alert(1)</script>\n# 危険なテンプレート\n<%= raw \"Search results for: #{params[:q]}\" %>\n# → 攻撃者が URL を送りつけるだけで JS 実行\n\n# Stored XSS の例\n# user.bio に <script>steal_cookie()</script> が保存される\n<%= @user.bio.html_safe %>\n# → 他のユーザーがプロフィールを開く度に JS 実行\n\n# DOM-based XSS の例 (Client JS)\ndocument.getElementById('hello').innerHTML = location.hash  // ❌\nelement.textContent = location.hash                          // ✅ (textContent は HTML 解釈しない)",
            language: "ruby",
            notes: [
              "Reflected は『送りつけ攻撃』、Stored は『時限爆弾』、DOM-based は『フロント側で起きる』",
              "Cookie + XSS = アカウント乗っ取り (`document.cookie` で送信されるため HttpOnly 必須)",
            ],
          },
          {
            heading: "3.2 Rails の自動エスケープと html_safe の罠",
            body: "Rails 3+ は `<%= %>` で `ActiveSupport::SafeBuffer` 以外を自動エスケープ。`raw(str)` / `str.html_safe` / `<%== %>` は明示的にエスケープを切る — **ユーザー入力に html_safe するのは絶対 NG**。安全な HTML フラグメントを作るなら `content_tag` / `tag.div` / `sanitize`。",
            code: "# 安全 (自動エスケープ)\n<%= @user.name %>                       # < > & ' \" が &lt; 等に変換\n<%= @user.bio %>                        # 同上\n<%= content_tag(:p, @user.bio) %>       # 自動エスケープ + タグ生成\n<%= link_to @user.name, user_path(@user) %>\n<%= simple_format(@user.bio) %>         # 改行 → <br> しつつエスケープ\n\n# 危険 (エスケープ無効化)\n<%= @user.bio.html_safe %>              # ユーザー入力を HTML 扱い (絶対 NG)\n<%= raw @user.bio %>                     # 同上\n<%== @user.bio %>                        # 同上 (== は raw と同等)\n\n# 安全な使い方: html_safe は『コード側で書いた安全な HTML』にのみ\ndef alert_html(message)\n  content_tag(:div, class: 'alert') do\n    content_tag(:strong, 'Notice:') + ' ' + h(message)\n  end\nend\n\n# サニタイズ (許可タグだけ通す)\n<%= sanitize @user.bio, tags: %w[p br b i a],\n  attributes: %w[href title] %>\n\n# Markdown の場合は処理系の安全設定\nrequire 'redcarpet'\nrenderer = Redcarpet::Render::HTML.new(filter_html: true, no_styles: true)\nmarkdown = Redcarpet::Markdown.new(renderer, ...)\nmarkdown.render(@user.bio)              # HTML タグは除去される",
            language: "ruby",
            notes: [
              "ユーザー入力に html_safe を呼ぶコードを見たら必ずレビュー指摘",
              "Brakeman (静的解析) で html_safe / raw を自動検出できる",
            ],
          },
          {
            heading: "3.3 Content Security Policy (CSP)",
            body: "**CSP** は『どこから来た JS/CSS/img なら許可するか』をブラウザに指示する HTTP ヘッダ。XSS で `<script>` を仕込まれても、CSP が外部スクリプトを禁止していれば実行されない (**二段の防御**)。インライン JS も禁止できる。Rails 5.2+ は DSL を提供。",
            code: "# config/initializers/content_security_policy.rb\nRails.application.config.content_security_policy do |policy|\n  policy.default_src :self, :https\n  policy.font_src    :self, :https, :data\n  policy.img_src     :self, :https, :data\n  policy.object_src  :none                # <object>, Flash 等を完全禁止\n  policy.script_src  :self, :https\n  policy.style_src   :self, :https\n  policy.connect_src :self, :https, 'wss://example.com'\n  policy.frame_ancestors :none            # iframe 埋め込み禁止 (clickjacking 対策)\n  policy.base_uri    :self\n  policy.form_action :self                # フォーム送信先制限\n\n  # 違反レポート受信先 (Sentry / Report URI)\n  policy.report_uri  'https://example.report-uri.com/r/d/csp/enforce'\nend\n\n# インライン JS を許可したい時は nonce で\nRails.application.config.content_security_policy_nonce_generator = ->(req) { SecureRandom.base64(16) }\nRails.application.config.content_security_policy_nonce_directives = %w[script-src style-src]\n\n# ERB で nonce を埋め込む\n<%= javascript_tag nonce: true do %>\n  console.log('this inline JS is allowed via nonce')\n<% end %>\n\n# 段階導入: report-only で検出 → 違反を直してから enforce\nRails.application.config.content_security_policy_report_only = true",
            language: "ruby",
            notes: [
              "CSP の段階導入: report-only でログ収集 → 違反を解消 → enforce に切替",
              "GA / Stripe / Intercom など 3rd party SDK を入れる時は script_src に追加",
              "X-Frame-Options: DENY は CSP の frame-ancestors と重複 — モダンは CSP",
            ],
          },
          {
            heading: "3.4 関連の防御ヘッダ",
            body: "CSP 以外にも『付けておくべき』ヘッダがある。**X-Content-Type-Options: nosniff** (MIME sniffing 防止)、**Referrer-Policy** (Referer 漏洩制御)、**Permissions-Policy** (Camera / Mic / Geo 等の機能制限)。**X-XSS-Protection** は廃止 (今は CSP が代替)。",
            code: "# config/application.rb or initializers/secure_headers.rb\nclass ApplicationController < ActionController::Base\n  before_action :set_security_headers\n\n  private\n\n  def set_security_headers\n    response.headers['X-Content-Type-Options'] = 'nosniff'\n    response.headers['Referrer-Policy'] = 'strict-origin-when-cross-origin'\n    response.headers['Permissions-Policy'] = 'camera=(), microphone=(), geolocation=(self)'\n  end\nend\n\n# secure_headers gem (より宣言的)\n# Gemfile\ngem 'secure_headers'\n\n# config/initializers/secure_headers.rb\nSecureHeaders::Configuration.default do |config|\n  config.x_content_type_options = 'nosniff'\n  config.x_frame_options = 'DENY'\n  config.referrer_policy = %w[strict-origin-when-cross-origin]\n  config.csp = {\n    default_src: %w['self' https:],\n    script_src: %w['self' https:],\n    ...\n  }\nend\n\n# 検証ツール\n# https://securityheaders.com/ で URL を入れて A+ を目指す\n# https://csp-evaluator.withgoogle.com/ で CSP の評価",
            language: "ruby",
            notes: [
              "securityheaders.com で本番サイトを評価 — A+ を目指して足りないものを補う",
              "Rails 7+ は X-Frame-Options: SAMEORIGIN がデフォルト",
            ],
          },
        ],
        keyTakeaways: [
          "Rails の <%= %> は自動エスケープ、html_safe / raw を user input に使うのは絶対 NG",
          "CSP で『どこから JS/CSS を実行してよいか』を制限 — XSS の二段防御",
          "段階導入: CSP は report-only → enforce、定期的に securityheaders.com で確認",
          "X-Content-Type-Options / Referrer-Policy / Permissions-Policy も併せて設定",
        ],
        comprehensionQuestionIds: ["sec-004", "sec-009"],
      },
      {
        id: "csrf-session-cookie",
        title: "4. CSRF とセッション / Cookie の安全設計",
        intro:
          "CSRF (Cross-Site Request Forgery) は『ログイン中ユーザーを悪用して別サイトから勝手に POST』。Rails は authenticity_token で防御。セッション Cookie は Secure / HttpOnly / SameSite の 3 フラグを必ず付ける。",
        readingMinutes: 8,
        objectives: [
          "CSRF の仕組みと Rails の protect_from_forgery の動作を説明できる",
          "Secure / HttpOnly / SameSite の 3 フラグの役割を区別できる",
          "セッション固定化 / ハイジャック対策 (reset_session) を書ける",
        ],
        sections: [
          {
            heading: "4.1 CSRF の仕組みと Rails の protect_from_forgery",
            body: "ユーザーが Bank にログイン中、攻撃者のサイトを開くと `<form action='https://bank.com/transfer' method='POST'><input name='to' value='attacker'>` が自動 submit される。ブラウザは Bank のセッション Cookie を勝手に付けて送るので、Bank サーバから見ると本人のリクエスト。**authenticity_token** で『このフォームは自サイトから』を証明する。",
            code: "# ApplicationController (Rails 5+ デフォルト)\nclass ApplicationController < ActionController::Base\n  protect_from_forgery with: :exception\n  # invalid token → raise ActionController::InvalidAuthenticityToken\nend\n\n# form_with は自動で hidden 埋め込み\n<%= form_with model: @user do |f| %>\n  <!-- <input type=\"hidden\" name=\"authenticity_token\" value=\"...\"> が自動挿入 -->\n  <%= f.text_field :name %>\n<% end %>\n\n# JSON API でフロントが Rails の view から来ない場合\n# → meta タグから取り出してヘッダで送る\n<%= csrf_meta_tags %>\n# <meta name=\"csrf-token\" content=\"...\">\n\n# Client JS\nconst token = document.querySelector('meta[name=\"csrf-token\"]').content\nfetch('/api/x', {\n  method: 'POST',\n  headers: { 'X-CSRF-Token': token, 'Content-Type': 'application/json' },\n  body: JSON.stringify({ ... })\n})\n\n# 純粋な API (ActionController::API) では protect_from_forgery が不要\n# Bearer token (JWT) や session を使わない場合は CSRF が原理的に発生しない\nclass Api::BaseController < ActionController::API\n  # protect_from_forgery が無くて OK (session を使わないので)\nend",
            language: "ruby",
            diagram: `sequenceDiagram
  participant User as 被害者ブラウザ
  participant Evil as 攻撃者サイト<br/>(evil.com)
  participant Bank as bank.com

  User->>Bank: ログイン (session_id Cookie 取得)
  User->>Evil: 不審サイトを訪問
  Evil-->>User: 自動 POST フォーム (bank.com/transfer)
  User->>Bank: POST /transfer + Cookie 自動添付
  Note over Bank: ❌ Token 無し → 401/403
  Bank-->>User: protect_from_forgery で拒否`,
            diagramCaption: "CSRF: ブラウザは Cookie を自動添付するが、authenticity_token が無いと Rails が拒否する",
            notes: [
              "GET は副作用なしなので CSRF 対象外 (HTTP の決まり) — 副作用のある GET を作らない",
              "SameSite=Lax (Cookie) があれば多くの CSRF が自動で防がれる (4.2)",
            ],
          },
          {
            heading: "4.2 Cookie の Secure / HttpOnly / SameSite",
            body: "**Secure**: HTTPS でのみ送信 (盗聴対策)。**HttpOnly**: JavaScript からアクセス不可 (XSS 二次被害防止 — Cookie を盗まれない)。**SameSite=Lax** (デフォルト) / Strict / None: クロスサイトリクエストでの送信を制限 (CSRF 緩和)。",
            code: "# config/initializers/session_store.rb\nRails.application.config.session_store :cookie_store,\n  key: '_myapp_session',\n  secure: Rails.env.production?,   # HTTPS 限定\n  httponly: true,                  # JS から読めない (XSS 対策)\n  same_site: :lax                  # CSRF 緩和 (default 推奨)\n\n# Strict = 全クロスサイト遷移で送らない (UX が落ちる場面あり)\n# Lax    = top-level GET だけ送る (デフォルト推奨)\n# None   = 制限なし (要 Secure)\n\n# 独自 cookie\ncookies[:remember_me] = {\n  value: token,\n  expires: 1.year.from_now,\n  secure: Rails.env.production?,\n  httponly: true,\n  same_site: :strict\n}\n\n# 暗号化 cookie (改ざん防止)\ncookies.encrypted[:user_id] = current_user.id\n# 取得時 cookies.encrypted[:user_id] で復号\n\n# 署名のみ (改ざん防止だが内容は読める)\ncookies.signed[:user_id] = current_user.id\n\n# サイズ制限\n# Cookie は 4KB まで、超えるとブラウザが切り捨て\n# 大量データは session ID + サーバ側ストア (Redis 等) に",
            language: "ruby",
            notes: [
              "HttpOnly + Secure + SameSite=Lax の 3 つは『デフォルトで全 Cookie に付ける』",
              "暗号化 cookie のキーは Rails の secret_key_base (credentials) から派生",
            ],
          },
          {
            heading: "4.3 セッション固定化 / ハイジャック対策",
            body: "**セッション固定化 (Session Fixation)**: 攻撃者が予測可能な session ID を被害者に使わせてからログインさせ、同じ ID でアクセスする攻撃。対策はログイン成功直後の **reset_session** (新 ID を発行)。**セッションハイジャック**: Cookie 自体を盗む — Secure / HttpOnly / 短い expire / IP / User-Agent との照合で軽減。",
            code: "# ログイン処理 (Devise 等は自動でやってくれる)\nclass SessionsController < ApplicationController\n  def create\n    user = User.find_by(email: params[:email])\n    if user&.authenticate(params[:password])\n      reset_session                          # 旧 session を破棄 (固定化対策)\n      session[:user_id] = user.id\n      redirect_to dashboard_path\n    else\n      flash.now[:alert] = 'Invalid email or password'\n      render :new, status: :unauthorized\n    end\n  end\n\n  def destroy\n    reset_session                            # ログアウト時も全クリア\n    redirect_to root_path\n  end\nend\n\n# 追加のハイジャック対策\nsession[:user_agent_hash] = Digest::SHA256.hexdigest(request.user_agent.to_s)\n# 後で照合\nif session[:user_agent_hash] != Digest::SHA256.hexdigest(request.user_agent.to_s)\n  reset_session   # 環境が変わったら無効\nend\n\n# IP も照合する流派もあるが、モバイル / Wi-Fi 切替で頻繁にズレるので避けることも\n\n# 適切な expire\nRails.application.config.session_store :cookie_store,\n  expire_after: 30.minutes,                  # 短め\n  key: ...",
            language: "ruby",
            notes: [
              "MFA / WebAuthn を併用するとセッション盗難被害が劇的に下がる",
              "Remember-me cookie は別管理 (短い session + 長い remember token) が一般的",
            ],
          },
        ],
        keyTakeaways: [
          "CSRF は authenticity_token + SameSite=Lax の 2 段で防御、API なら origin 検証 / Bearer token",
          "Cookie は Secure / HttpOnly / SameSite の 3 フラグ全部、デフォルトで付ける",
          "ログイン成功直後に reset_session で固定化対策、短めの expire_after",
        ],
        comprehensionQuestionIds: ["sec-003", "sec-014"],
      },
      {
        id: "authn-and-authz",
        title: "5. 認証と認可 — bcrypt / Strong Params / Pundit / JWT",
        intro:
          "パスワードハッシュ (bcrypt)、Mass Assignment 対策 (Strong Params)、認可ポリシー (Pundit)、API 認証 (JWT) を整理。Pundit の例で『リソースレベル認可』も実装する。",
        readingMinutes: 10,
        objectives: [
          "bcrypt + has_secure_password でパスワードを安全に保存できる",
          "Strong Parameters で Mass Assignment を防げる",
          "Pundit Policy でリソース単位の認可を書ける、JWT の alg confusion を防げる",
        ],
        sections: [
          {
            heading: "5.1 パスワードハッシュ — bcrypt + has_secure_password",
            body: "**平文 / MD5 / SHA1 は絶対 NG**。MD5/SHA は速すぎて GPU で総当たり可能。**bcrypt** は cost (work factor) でハッシュ計算を意図的に遅くし、自動的にレコード毎の salt を付与。Rails では `has_secure_password` で 1 行宣言。",
            code: "# Gemfile\ngem 'bcrypt'\n\n# migration\nadd_column :users, :password_digest, :string\n\n# model\nclass User < ApplicationRecord\n  has_secure_password\n  # accessor: password / password_confirmation\n  # 保存時に bcrypt で hash → password_digest カラムに格納\n  # validates :password, presence: true, length: { minimum: 8 }, on: :create\nend\n\n# 使い方\nu = User.new(email: 'a@x', password: 'secret123', password_confirmation: 'secret123')\nu.save\nu.password_digest         # \"$2a$12$N9qo8uLOickgx2ZMRZoMye...\" (bcrypt hash)\n\nu.authenticate('secret123')   # returns user\nu.authenticate('wrong')        # returns false\n\n# Cost (work factor) の調整\nclass User < ApplicationRecord\n  has_secure_password\n  # 開発: 4 (高速)、本番: 12 (推奨、〜100ms)\n  BCRYPT_COST = Rails.env.test? ? BCrypt::Engine::MIN_COST : 12\nend\n\n# パスワード強度ポリシー (NIST SP 800-63B 推奨)\nvalidates :password,\n  length: { minimum: 12 },             # 長さ重視 (複雑性は副次的)\n  format: { without: /\\A(password|123456)\\z/i }  # よくある弱パス",
            language: "ruby",
            notes: [
              "bcrypt の cost は将来 14 や 15 に上げる流れ — HW 性能向上に追随",
              "より新しい argon2 / scrypt も選択肢 (argon2 gem)",
              "passwords は logs に出さない → filter_parameters (7 章)",
            ],
          },
          {
            heading: "5.2 Strong Parameters — Mass Assignment 対策",
            body: "**Mass Assignment**: 攻撃者が `is_admin=true` のような余分な属性を一括代入される脆弱性。Rails 4+ では `params.require(:user).permit(:name, :email)` を必須化。**permit していない属性は無視される**。`permit!` (全許可) は厳禁。",
            code: "# ❌ 危険 (params をそのまま渡す)\nclass UsersController < ApplicationController\n  def create\n    @user = User.create(params[:user])   # is_admin も入る可能性\n  end\nend\n\n# ✅ Strong Parameters\nclass UsersController < ApplicationController\n  def create\n    @user = User.new(user_params)\n    if @user.save\n      redirect_to @user\n    else\n      render :new, status: :unprocessable_entity\n    end\n  end\n\n  private\n\n  def user_params\n    params.require(:user).permit(:name, :email, :password, :password_confirmation)\n    # is_admin は permit していないので無視される\n  end\nend\n\n# ネストした params\ndef post_params\n  params.require(:post).permit(\n    :title, :body,\n    tags: [],                           # 配列\n    metadata: [:lang, :region],         # ネストしたオブジェクト\n    images_attributes: [:id, :file, :_destroy]   # has_many :images の form\n  )\nend\n\n# 管理者画面など『is_admin も許す』場面は条件で分岐\ndef user_params\n  permitted = [:name, :email]\n  permitted << :role if current_user.admin?     # admin だけ追加\n  params.require(:user).permit(*permitted)\nend\n\n# ❌ 禁忌\nparams.require(:user).permit!                   # 全許可 — 絶対使わない",
            language: "ruby",
            notes: [
              "新機能の form で属性を追加したら permit list の更新を忘れない (動かない原因にもなる)",
              "GitHub の 2012 年の Mass Assignment 事件が Rails 4 の Strong Params 導入の発端",
            ],
          },
          {
            heading: "5.3 Pundit — リソースレベルの認可",
            body: "**Pundit** はモデル毎の Policy クラスに認可ロジックをまとめる軽量 gem。各 action に対して `update?` / `destroy?` のようなメソッドを定義し、controller で `authorize @resource` を呼ぶ。`policy_scope` で一覧の絞り込みも統一できる。",
            code: "# Gemfile\ngem 'pundit'\n\n# rails g pundit:install → ApplicationPolicy が生成\n\n# app/policies/post_policy.rb\nclass PostPolicy < ApplicationPolicy\n  def index?\n    true                                  # 誰でも一覧 OK\n  end\n\n  def show?\n    record.published? || owner? || user&.admin?\n  end\n\n  def create?\n    user.present?                          # ログイン中ならば\n  end\n\n  def update?\n    owner? || user&.admin?                # 本人 or admin\n  end\n\n  def destroy?\n    owner? || user&.admin?\n  end\n\n  private\n\n  def owner?\n    record.user_id == user&.id\n  end\n\n  # 一覧の Scope (current_user が見られる Post に絞る)\n  class Scope < Scope\n    def resolve\n      if user&.admin?\n        scope.all\n      elsif user\n        scope.where('published = true OR user_id = ?', user.id)\n      else\n        scope.where(published: true)\n      end\n    end\n  end\nend\n\n# Controller\nclass PostsController < ApplicationController\n  before_action :authenticate_user!, except: [:index, :show]\n\n  def index\n    @posts = policy_scope(Post)            # Scope.resolve が呼ばれる\n  end\n\n  def show\n    @post = Post.find(params[:id])\n    authorize @post                        # show? を呼ぶ\n  end\n\n  def update\n    @post = Post.find(params[:id])\n    authorize @post                        # update? を呼ぶ\n    @post.update(post_params)\n  end\nend\n\n# 権限なしの場合は Pundit::NotAuthorizedError → 403 Forbidden に変換\nrescue_from Pundit::NotAuthorizedError do\n  render plain: 'Forbidden', status: :forbidden\nend",
            language: "ruby",
            notes: [
              "Pundit の代替: CanCanCan (DSL で一箇所定義) / Action Policy (より高速・最近人気)",
              "全 controller で authorize を呼び忘れていないか `after_action :verify_authorized` で強制",
            ],
          },
          {
            heading: "5.4 JWT — API 認証と alg confusion の罠",
            body: "**JWT (JSON Web Token)** は『Header.Payload.Signature』の 3 部 Base64 形式。API 認証の定番だが落とし穴も多い。最重要は **alg confusion**: トークンの alg ヘッダを攻撃者が書き換えて検証を欺く。**検証時に許可 alg を必ず明示**する。",
            code: "require 'jwt'\n\n# 発行\npayload = {\n  user_id: user.id,\n  exp: 1.hour.from_now.to_i,             # 必ず短く (アクセストークン)\n  iat: Time.current.to_i,\n  jti: SecureRandom.uuid                  # 失効管理用\n}\nsecret = Rails.application.credentials.jwt_secret\ntoken = JWT.encode(payload, secret, 'HS256')\n\n# ❌ 危険 — alg を自動検出 (攻撃者が alg=none / 別 alg に書き換え可能)\nJWT.decode(token, secret)\n\n# ✅ 安全 — 許可 alg を配列で明示\nJWT.decode(token, secret, true, { algorithm: 'HS256' })\n# または\nJWT.decode(token, secret, true, { algorithms: ['HS256'] })\n\n# よくある罠\n# 1. alg=none を許可 → 署名なしで通る (古いライブラリ)\n# 2. RS256 (公開鍵) を HS256 (共有鍵) として処理 → 公開鍵で署名できる (alg confusion)\n# 3. exp を検証していない → 期限切れトークンが永久に使える\n# 4. シークレットが弱い / git にコミット\n\n# 対策\n# - access token は短命 (5〜60 分)、refresh token を別管理\n# - secret は credentials に\n# - 即時失効が必要なら jti をブラックリストで保持\n# - HS256 (共有鍵) は対称 — 全サービスが同じ secret を持つ必要がある\n# - 公開できる検証なら RS256 / ES256 (非対称) を選ぶ\n\n# Rails 8 で導入された built-in token authentication も検討候補\n# https://github.com/rails/rails のリリースノート参照",
            language: "ruby",
            notes: [
              "JWT は『session の代替』として人気だが、失効が難しいので短命 + refresh の運用設計が必須",
              "Refresh token は DB に保存して失効可能に — JWT で全部やろうとしない",
            ],
          },
        ],
        keyTakeaways: [
          "パスワードは bcrypt + has_secure_password、cost は本番 12 を目安に",
          "Strong Params で Mass Assignment 防御、permit! は禁忌",
          "認可は Pundit / CanCanCan で『リソース単位』に書き、URL レベルだけに頼らない",
          "JWT は alg を明示 + exp 必須 + secret を credentials に、失効が要るなら jti ブラックリスト",
        ],
        comprehensionQuestionIds: ["sec-001", "sec-006", "sec-010"],
      },
      {
        id: "secrets-and-transport",
        title: "6. シークレット管理と通信 — credentials / HTTPS / HSTS",
        intro:
          "API キー / DB パスワード / 暗号鍵をどう保管するか (credentials.yml.enc / env)、HTTPS の強制 (force_ssl) と HSTS、SSRF / 内部 IP 保護まで通信周りを整理。",
        readingMinutes: 9,
        objectives: [
          "credentials.yml.enc + master.key の仕組みを説明できる、本番への RAILS_MASTER_KEY 流し込み",
          "force_ssl と HSTS の関係を理解、preload に乗せる前のチェックを書ける",
          "SSRF / オープンリダイレクト / Sub-Resource Integrity (SRI) を意識した実装ができる",
        ],
        sections: [
          {
            heading: "6.1 credentials.yml.enc — 暗号化シークレット管理",
            body: "Rails 5.2+ は **config/credentials.yml.enc** に暗号化された秘密情報を保存し、**config/master.key** で復号する。`.enc` ファイルは git にコミット OK (暗号化されているので)、`master.key` は **.gitignore 必須**。本番では `RAILS_MASTER_KEY` 環境変数で渡す。",
            code: "# 編集 (一時的に復号 → $EDITOR で開く → 保存で再暗号化)\nEDITOR=vim rails credentials:edit\n\n# 環境別 (推奨、6.0+)\nEDITOR=vim rails credentials:edit --environment production\n# → config/credentials/production.yml.enc + config/credentials/production.key\n\n# 中身 (YAML)\nstripe:\n  publishable_key: pk_live_xxx\n  secret_key: sk_live_xxx\naws:\n  access_key_id: AKIAxxx\n  secret_access_key: xxx\njwt_secret: xxx\nsecret_key_base: xxx\n\n# 参照\nRails.application.credentials.stripe[:secret_key]\nRails.application.credentials.dig(:aws, :access_key_id)\nRails.application.credentials.jwt_secret\n\n# 本番デプロイ時\nRAILS_MASTER_KEY=xxxxx puma -e production\n# または\necho 'RAILS_MASTER_KEY=xxxxx' > /etc/secrets/myapp.env\n# systemd service で EnvironmentFile=/etc/secrets/myapp.env\n\n# .gitignore (重要)\n/config/master.key\n/config/credentials/*.key\n\n# master.key を紛失すると復号不可 → 全 secret をローテーション必要",
            language: "ruby",
            notes: [
              "master.key は 1Password / Bitwarden などのチームシークレットで共有",
              "Heroku / Render / Vercel / fly.io 等は env 変数として設定するだけ",
              "credentials の代わりに dotenv / 環境変数派もあり (好み + 運用)",
            ],
          },
          {
            heading: "6.2 HTTPS の強制 — force_ssl と HSTS",
            body: "**force_ssl = true** で HTTP → HTTPS 自動リダイレクト + HSTS ヘッダ自動付与。**HSTS (Strict-Transport-Security)** はブラウザに『次回からは最初から HTTPS』を強制する仕組み。`preload` を有効にしてブラウザ組み込みリストに乗せると、初回アクセスから HTTPS。",
            code: "# config/environments/production.rb\nconfig.force_ssl = true\n# → 自動で以下を実行\n# - HTTP リクエストを HTTPS にリダイレクト (301)\n# - Strict-Transport-Security ヘッダを付与\n# - Cookie に Secure フラグを付与\n\n# 細かい制御\nconfig.ssl_options = {\n  hsts: {\n    expires: 1.year,                     # max-age\n    subdomains: true,                    # includeSubDomains\n    preload: true,                       # preload 対象に名乗り\n  },\n  redirect: { exclude: ->(request) { request.path.start_with?('/health') } }\n}\n\n# 生のヘッダ\n# Strict-Transport-Security: max-age=31536000; includeSubDomains; preload\n\n# HSTS preload リストへの登録 (一度乗ると外しにくいので注意)\n# https://hstspreload.org/ で確認 → 登録申請\n\n# 必須条件 (preload):\n# - 全サブドメインも HTTPS\n# - HTTP → HTTPS リダイレクトが動く\n# - max-age >= 31536000 (1 年)\n# - includeSubDomains + preload を含む\n\n# TLS バージョン / 暗号スイート (nginx / cloud LB 側で設定)\n# - TLS 1.2 以上のみ許可、1.0/1.1 は無効化\n# - 弱い暗号スイート (RC4, 3DES, MD5) を無効化\n# - Mozilla SSL Configuration Generator で適切な設定を生成\n#   https://ssl-config.mozilla.org/",
            language: "ruby",
            notes: [
              "Let's Encrypt + Certbot で無料証明書、cert-manager / Caddy なら自動更新",
              "HSTS preload は 1 度乗ると数年単位で外せない — staging で十分テストしてから",
            ],
          },
          {
            heading: "6.3 SSRF — サーバ側リクエスト偽造",
            body: "**SSRF**: ユーザーが指定した URL をサーバが fetch する機能で、内部 IP (169.254.169.254 の AWS metadata, 127.0.0.1, 10.0.0.0/8 など) を叩かれる攻撃。クラウド metadata 経由で IAM 認証情報まで盗まれる事例も。**URL allowlist + 内部 IP block** が必須。",
            code: "# ❌ 危険 — ユーザー指定 URL をそのまま fetch\ndef preview\n  uri = URI(params[:url])\n  response = Net::HTTP.get(uri)\n  render plain: response\nend\n\n# 攻撃: params[:url] = 'http://169.254.169.254/latest/meta-data/iam/security-credentials/'\n# → AWS の IAM 認証情報が漏洩\n\n# ✅ 対策 1: ホスト名 allowlist\nALLOWED_HOSTS = %w[example.com api.example.com]\nuri = URI(params[:url])\nraise 'Forbidden' unless ALLOWED_HOSTS.include?(uri.host)\n\n# ✅ 対策 2: 内部 IP の解決を block\nrequire 'resolv'\nrequire 'ipaddr'\n\nFORBIDDEN_RANGES = [\n  IPAddr.new('127.0.0.0/8'),\n  IPAddr.new('10.0.0.0/8'),\n  IPAddr.new('172.16.0.0/12'),\n  IPAddr.new('192.168.0.0/16'),\n  IPAddr.new('169.254.0.0/16'),         # link-local (AWS metadata)\n  IPAddr.new('::1/128'),\n  IPAddr.new('fc00::/7'),                # IPv6 ULA\n]\n\ndef safe_url?(url)\n  uri = URI(url)\n  return false unless %w[http https].include?(uri.scheme)\n  addrs = Resolv.getaddresses(uri.host)\n  addrs.any? && addrs.none? do |addr|\n    ip = IPAddr.new(addr)\n    FORBIDDEN_RANGES.any? { |r| r.include?(ip) }\n  end\nend\n\n# ✅ 対策 3: IMDSv2 を強制 (AWS の場合)\n# EC2 Instance Metadata Service v2 はトークン必須なので SSRF で叩きにくい\n\n# オープンリダイレクトも要注意\n# ❌ redirect_to params[:next]\n# 攻撃者が ?next=https://evil.com を仕込む → フィッシング助長\n# ✅ allowlist or 相対 URL のみ許可\nredirect_to(params[:next].start_with?('/') ? params[:next] : root_path)",
            language: "ruby",
            diagram: `sequenceDiagram
  participant Attacker as 攻撃者
  participant App as アプリサーバ<br/>(EC2 内部)
  participant Meta as 169.254.169.254<br/>(AWS metadata)

  Attacker->>App: POST /preview { url: "http://169.254.169.254/..." }
  Note over App: ❌ 検証なし<br/>fetch をそのまま実行
  App->>Meta: GET /latest/meta-data/iam/...
  Meta-->>App: IAM 認証情報
  App-->>Attacker: 認証情報が漏洩 🔥
  Note over App,Meta: ✅ 対策: ホスト allowlist + 内部 IP block + IMDSv2 強制`,
            diagramCaption: "SSRF: ユーザー入力 URL を検証せず fetch すると、サーバ内部からのみアクセス可能なリソースへ攻撃が伸びる",
            notes: [
              "AWS EC2 では IMDSv2 を強制すると SSRF からの metadata 流出が大幅に減る",
              "URL 経由の処理 (Webhook / OG 取得 / SSO redirect) は SSRF と Open Redirect の両方をレビュー",
            ],
          },
          {
            heading: "6.4 Sub-Resource Integrity (SRI) と 3rd party リソース",
            body: "CDN から CSS / JS を読み込む場合、**SRI (Sub-Resource Integrity)** で整合性ハッシュを指定するとファイル改ざんがブラウザ側で検出される。CDN の事故 (改ざん / 乗っ取り) でも自サイトに影響しない。",
            code: "<!-- SRI 付き script タグ -->\n<script\n  src=\"https://cdn.example.com/lib.min.js\"\n  integrity=\"sha384-oqVuAfXRKap7fdgcCY5uykM6+R9GqQ8K/uxy9rx7HNQlGYl1kPzQho1wx4JwY8wC\"\n  crossorigin=\"anonymous\"\n></script>\n\n<!-- ハッシュ生成 -->\n# shasum -b -a 384 lib.min.js | awk '{ print $1 }' | xxd -r -p | base64\n# → 'sha384-...' を integrity に貼り付け\n\n<!-- Rails の asset_pipeline で自動 SRI -->\n<!-- Sprockets / Webpacker の設定で integrity 属性が自動付与 -->\n\n<!-- 3rd party の取り扱い -->\n# - 自前ホスト推奨 (CDN を経由しない)\n# - CDN を使うなら SRI 必須\n# - GA / Stripe / Intercom など embed が変わるものは SRI を付けにくい → CSP で許可ホストを限定 (3 章)",
            language: "html",
            notes: [
              "SRI は『改ざん検出』 — CDN 乗っ取り / 攻撃者がアップロード等を検出",
              "CSP + SRI で『どこから読むか + 改ざんされていないか』の二段防御",
            ],
          },
        ],
        keyTakeaways: [
          "credentials.yml.enc + master.key (or RAILS_MASTER_KEY) で暗号化シークレット管理",
          "force_ssl + HSTS で HTTPS 強制、preload は staging で確認してから",
          "SSRF / Open Redirect は『URL allowlist + 内部 IP block』、IMDSv2 を強制",
          "CDN リソースは SRI + CSP で『どこから読むか × 改ざんされていないか』を両守り",
        ],
        comprehensionQuestionIds: ["sec-005", "sec-008"],
      },
      {
        id: "rate-limit-upload-deps",
        title: "7. レート制限・ファイルアップロード・依存監査",
        intro:
          "ブルートフォース対策 (rack-attack)、ファイルアップロードの 3 段検証、依存 gem の脆弱性監査 (bundle audit / Dependabot)、ログ漏洩防止 (filter_parameters) を整理。",
        readingMinutes: 9,
        objectives: [
          "rack-attack で IP / メールアドレス単位のレート制限を書ける",
          "ファイルアップロードの拡張子 / Content-Type / マジックバイトの 3 段検証を実装できる",
          "bundle audit / Dependabot で依存脆弱性を継続検知、filter_parameters でログ漏洩防止",
        ],
        sections: [
          {
            heading: "7.1 rack-attack — IP / アカウント単位のレート制限",
            body: "**rack-attack** は Rack ミドルウェアで動くレート制限 / ブロック / セーフリスト機能。ログイン試行 5 回/分、API 100 回/分、特定 IP 完全ブロックなどを宣言的に書ける。本番では Redis をストアにして複数プロセス間で共有。",
            code: "# Gemfile\ngem 'rack-attack'\n\n# config/application.rb\nconfig.middleware.use Rack::Attack\n\n# config/initializers/rack_attack.rb\nclass Rack::Attack\n  # ストアを Redis に (本番必須、複数プロセス間で共有)\n  cache.store = ActiveSupport::Cache::RedisCacheStore.new(url: ENV['REDIS_URL'])\n\n  # ログイン: IP 単位 5 回 / 分\n  throttle('logins/ip', limit: 5, period: 1.minute) do |req|\n    req.ip if req.path == '/login' && req.post?\n  end\n\n  # ログイン: メールアドレス単位 5 回 / 分 (IP 分散攻撃対策)\n  throttle('logins/email', limit: 5, period: 1.minute) do |req|\n    if req.path == '/login' && req.post?\n      req.params['email'].to_s.downcase.presence\n    end\n  end\n\n  # 一般 API: IP 単位 100 回 / 分\n  throttle('api/ip', limit: 100, period: 1.minute) do |req|\n    req.ip if req.path.start_with?('/api/')\n  end\n\n  # 完全ブロック (Bad Bot や攻撃元 IP)\n  blocklist('block bad bots') do |req|\n    req.user_agent =~ /BadBot|EvilCrawler/ || %w[1.2.3.4 5.6.7.8].include?(req.ip)\n  end\n\n  # 信頼できる IP は除外\n  safelist('allow office') do |req|\n    %w[203.0.113.0 198.51.100.0].include?(req.ip)\n  end\n\n  # 制限に引っかかった時のレスポンス\n  self.throttled_responder = lambda do |req|\n    [429, { 'Content-Type' => 'application/json' }, [{ error: 'Rate limit' }.to_json]]\n  end\n\n  # ログ (本番では監視ツールに送る)\n  ActiveSupport::Notifications.subscribe('rack.attack') do |_name, _start, _finish, _id, payload|\n    req = payload[:request]\n    Rails.logger.warn(\"[rack-attack] #{req.env['rack.attack.match_type']} #{req.ip} #{req.path}\")\n  end\nend\n\n# テスト\n# 5 回失敗 → 6 回目から 429\nfor i in {1..6}; do curl -X POST -d 'email=a@x&password=wrong' localhost:3000/login; done",
            language: "ruby",
            notes: [
              "メール単位の throttle は『パスワード総当たり』 vs 『複数 IP からの分散攻撃』両方に効く",
              "Cloudflare / AWS WAF など上流でもレート制限すると多層防御に",
            ],
          },
          {
            heading: "7.2 ファイルアップロード — 3 段検証 + 別ドメイン配信",
            body: "**拡張子だけのチェックは bypass される** (foo.jpg と名乗る .exe など)。**Content-Type ヘッダも偽装可能**。**マジックバイト (ファイル先頭の数バイト)** で実コンテンツを確認するのが安全。さらに **別ドメイン (S3 等) から配信**して XSS リスクを隔離。",
            code: "class Post < ApplicationRecord\n  has_one_attached :image\n\n  validate :image_size\n  validate :image_type\n  validate :image_filename\n\n  private\n\n  MAX_SIZE = 5.megabytes\n  ALLOWED_EXTS = %w[jpg jpeg png gif webp].freeze\n  ALLOWED_CONTENT_TYPES = %w[image/jpeg image/png image/gif image/webp].freeze\n\n  def image_size\n    return unless image.attached?\n    if image.blob.byte_size > MAX_SIZE\n      errors.add(:image, \"too large (max #{MAX_SIZE / 1.megabyte}MB)\")\n    end\n  end\n\n  def image_type\n    return unless image.attached?\n\n    # 1. Content-Type ヘッダ\n    unless ALLOWED_CONTENT_TYPES.include?(image.blob.content_type)\n      errors.add(:image, 'must be jpeg/png/gif/webp')\n      return\n    end\n\n    # 2. 拡張子\n    ext = image.filename.extension.downcase\n    unless ALLOWED_EXTS.include?(ext)\n      errors.add(:image, 'invalid extension')\n      return\n    end\n\n    # 3. マジックバイト (Marcel gem が ActiveStorage に同梱)\n    image.blob.open do |file|\n      detected = Marcel::MimeType.for(file)\n      unless ALLOWED_CONTENT_TYPES.include?(detected)\n        errors.add(:image, 'real content does not match')\n      end\n    end\n  end\n\n  def image_filename\n    return unless image.attached?\n    # ファイル名のパストラバーサル / 異常文字を除外\n    if image.filename.to_s =~ /\\A[\\w\\-. ]+\\z/\n      # ok\n    else\n      errors.add(:image, 'invalid filename')\n    end\n  end\nend\n\n# 別ドメイン配信 (S3 / CloudFront)\n# config/storage.yml\namazon:\n  service: S3\n  bucket: my-uploads\n  region: ap-northeast-1\n\n# config/environments/production.rb\nconfig.active_storage.service = :amazon\n\n# CDN ドメインを分けて XSS リスクを隔離\n# images.example.com から配信 → 仮に SVG に script を仕込まれてもメインドメインの cookie は使われない\n\n# 動的サイズ変換 (image_processing + libvips、ImageMagick よりはやめ + 安全)\n# Gemfile: gem 'image_processing'\n@post.image.variant(resize_to_limit: [800, 800]).processed",
            language: "ruby",
            notes: [
              "ImageMagick / libvips に脆弱性が見つかった事例多数 — バージョンを最新に + 入力サイズ制限",
              "SVG は <script> を含めるので XSS の温床 — 許可リストから外すか sanitize-svg を",
              "署名付き URL (S3 presigned) で直接アップロード → アプリサーバを経由しない構成も",
            ],
          },
          {
            heading: "7.3 依存監査 — bundle audit / Dependabot",
            body: "**bundle audit** (bundler-audit gem) は Ruby Advisory Database を参照して Gemfile.lock の既知脆弱性を検出する。CI に組み込みつつ、**Dependabot** (GitHub 標準) で『脆弱性のある gem の更新 PR を自動作成』するのが現代の鉄板。",
            code: "# Gemfile\ngroup :development, :test do\n  gem 'bundler-audit'\nend\n\n# 実行\nbundle exec bundle audit check --update\n# Updating ruby-advisory-db ...\n# Scanning ...\n# No vulnerabilities found\n\n# 出力例 (脆弱性検出時)\n# Name: nokogiri\n# Version: 1.13.0\n# Advisory: CVE-2022-29181\n# Criticality: High\n# URL: https://github.com/sparklemotion/nokogiri/security/advisories/...\n# Solution: upgrade to >= 1.13.8\n\n# CI 組み込み (.github/workflows/ci.yml)\nname: Security audit\non: [push, pull_request, schedule]\njobs:\n  audit:\n    runs-on: ubuntu-latest\n    steps:\n      - uses: actions/checkout@v4\n      - uses: ruby/setup-ruby@v1\n        with: { ruby-version: '3.3', bundler-cache: true }\n      - run: bundle exec bundle audit check --update\n\n# Dependabot 設定 (.github/dependabot.yml)\nversion: 2\nupdates:\n  - package-ecosystem: bundler\n    directory: '/'\n    schedule:\n      interval: weekly\n      day: monday\n    open-pull-requests-limit: 5\n    groups:\n      rails:\n        patterns: ['rails', 'action*', 'active*']\n  - package-ecosystem: npm\n    directory: '/'\n    schedule:\n      interval: weekly\n  - package-ecosystem: github-actions\n    directory: '/'\n    schedule:\n      interval: weekly\n\n# Brakeman — Rails 専用の静的解析 (SQL Injection / XSS / Mass Assignment などを検出)\ngem 'brakeman', group: [:development]\nbundle exec brakeman -A --no-pager\n\n# 他言語\n# npm audit / pnpm audit\n# pip-audit (Python)\n# cargo audit (Rust)\n# trivy / snyk (multi-language + コンテナ)",
            language: "ruby",
            notes: [
              "Dependabot で来た PR は CI 通れば原則 merge — 古い gem を放置すると Top 10 の A06 に",
              "Brakeman は CI に組み込み + Pull Request に SARIF 形式でレポート",
              "本番 image scan は Trivy / Snyk / Docker Scout などコンテナ層も",
            ],
          },
          {
            heading: "7.4 ログ漏洩防止 — filter_parameters と監査ログ",
            body: "Rails は `password` などの param をログから自動マスキング。**filter_parameters** にアプリ独自の機密 (`api_key`, `credit_card`, `ssn` 等) を追加する。**監査ログ** (誰が・いつ・何をしたか) は audited / paper_trail gem で別途残す。",
            code: "# config/initializers/filter_parameter_logging.rb\nRails.application.config.filter_parameters += [\n  :password, :password_confirmation,\n  :credit_card, :cvv, :ssn,\n  :api_key, :token, :secret,\n  :access_token, :refresh_token,\n  :otp, :pin,\n]\n\n# ログ例 (フィルタ適用後)\n# Parameters: {\"user\"=>{\"email\"=>\"a@x\", \"password\"=>\"[FILTERED]\"}}\n\n# リダイレクト先 URL の機密もマスク\nRails.application.config.filter_redirect += [\n  'oauth_token', 'access_token', 'authorization'\n]\n\n# Lograge / セミ構造化ログ (本番)\n# Gemfile\ngem 'lograge'\n\n# config/environments/production.rb\nconfig.lograge.enabled = true\nconfig.lograge.formatter = Lograge::Formatters::Json.new\nconfig.lograge.custom_options = ->(event) {\n  { time: Time.current.iso8601, request_id: event.payload[:request_id] }\n}\n\n# 監査ログ (audited gem)\nclass Post < ApplicationRecord\n  audited                                # 全変更を audits テーブルに記録\n  # audited only: [:title, :body]\nend\n\nPost.last.audits                          # 変更履歴 [{user, action, changes, created_at}, ...]\n\n# Sentry / Datadog / Honeybadger でエラー集約\n# config/initializers/sentry.rb\nSentry.init do |config|\n  config.dsn = Rails.application.credentials.sentry_dsn\n  config.send_default_pii = false         # PII を送らない\n  config.before_send = ->(event, hint) {\n    # 機密データを更にマスク\n    event\n  }\nend",
            language: "ruby",
            notes: [
              "ログには PII (Personally Identifiable Information) を入れない設計 — log aggregator に集める前にマスク",
              "監査ログは『誰が何をしたか』、調査 / 規制対応で必要 (GDPR / SOC2 等)",
              "Sentry / Datadog 等にも『個人情報を送らない』設定を必ず確認",
            ],
          },
        ],
        keyTakeaways: [
          "rack-attack で IP / メール / API パスのレート制限、本番は Redis ストアで共有",
          "ファイルアップロードは『拡張子 + Content-Type + マジックバイト』の 3 段検証 + 別ドメイン配信",
          "bundle audit + Dependabot + Brakeman を CI に組み込み、依存と静的解析を継続",
          "filter_parameters で機密ログ漏洩防止、監査ログは audited、エラー監視に PII を送らない",
        ],
        comprehensionQuestionIds: ["sec-011", "sec-012", "sec-013", "sec-015"],
      },
    ],
  },

  // ---------- DB 設計 入門ガイド ----------
  {
    id: "db-design-intro",
    trackId: "db-design",
    title: "DB 設計の地図 — 正規化からスキーマ進化まで",
    subtitle:
      "ER モデリング → 正規化 → PK/FK → リレーション設計パターン → INDEX 設計 → マイグレーション運用 (ZDD) → アンチパターン、を 7 章で",
    audience:
      "SQL は書けるが ER 設計 / 正規化 / 命名 / FK / マイグレーション運用 でフワッとしている人、本番テーブルに ALTER したくない人、polymorphic / EAV で迷子の人",
    sources: [
      { label: "SQL アンチパターン (Bill Karwin、書籍)", url: "https://www.oreilly.co.jp/books/9784873115894/" },
      { label: "PostgreSQL 公式 — Data Modeling", url: "https://www.postgresql.org/docs/current/ddl.html" },
      { label: "strong_migrations (Rails)", url: "https://github.com/ankane/strong_migrations" },
    ],
    emoji: "🗂️",
    relatedCategoryIds: ["db-design", "sql-basics", "sql-joins"],
    chapters: [
      {
        id: "er-and-normalization",
        title: "1. ER モデリングと正規化の基礎",
        intro:
          "DB 設計は『エンティティを抽出し、属性とリレーションで表現する』作業。1NF / 2NF / 3NF / BCNF を整理しつつ、現代の実務では 3NF 〜 BCNF を目指す。",
        readingMinutes: 8,
        objectives: [
          "Entity / Attribute / Relationship の関係を ER 図で書ける",
          "1NF / 2NF / 3NF の違いと更新異常 (update anomaly) の防止を説明できる",
          "意図的な非正規化が許されるケースを判断できる",
        ],
        sections: [
          {
            heading: "1.1 ER モデリング — Entity / Attribute / Relationship",
            body: "**Entity** はデータの主体 (User / Post / Order)、**Attribute** はその属性 (name / email / created_at)、**Relationship** はエンティティ間の関連 (User ─ has many ─ Posts)。最初は『業務の名詞を書き出す → 関係を矢印で結ぶ』のスケッチから。Mermaid の `erDiagram` でレビューに使いやすい。",
            code: "// 業務要件 → ER スケッチ\n// 『ユーザーは複数の投稿を持ち、投稿は複数のタグを持つ』\n// User --< Post >-- Tag (N:N 中間)",
            language: "text",
            diagram: `erDiagram
  USER ||--o{ POST : "has many"
  POST }o--o{ TAG  : "has many through post_tags"
  USER {
    bigint id PK
    text   email UK
    text   name
    timestamptz created_at
  }
  POST {
    bigint id PK
    bigint user_id FK
    text   title
    timestamptz published_at
  }
  TAG {
    bigint id PK
    text   name UK
  }
  POST_TAGS {
    bigint post_id FK
    bigint tag_id FK
  }
  POST ||--o{ POST_TAGS : ""
  TAG  ||--o{ POST_TAGS : ""`,
            diagramCaption: "ER 図の例: User 1:N Post、Post N:N Tag (中間テーブル POST_TAGS)",
            notes: [
              "ER は Conceptual (業務概念) → Logical (正規化済) → Physical (RDB 固有の型 / INDEX) の順で詳細化",
              "命名: PK = id (BIGINT or UUID)、外部キー = `<table_singular>_id` (user_id / post_id)",
            ],
          },
          {
            heading: "1.2 正規化 — 1NF / 2NF / 3NF",
            body: "**1NF**: セルは atomic (1 セル 1 値、繰り返し列なし)。**2NF**: 1NF + 部分関数従属がない (複合 PK の一部にだけ依存する属性を分離)。**3NF**: 2NF + 推移的従属がない (非キー → 非キーの連鎖を排除)。実務では『単一 PK + 3NF』が標準的なゴール。",
            code: "-- ❌ 1NF 違反 (繰り返し / 配列を 1 セルに)\npost(id, title, tags)         -- tags='ruby,rails,sql'\n\n-- ✅ 1NF (タグは別テーブル)\npost(id, title)\ntag(id, name)\npost_tags(post_id, tag_id)\n\n-- ❌ 2NF 違反 (複合 PK の一部にだけ依存)\norder_items(order_id, product_id, quantity, product_name)\n--                                              ^ product_id にだけ依存\n\n-- ✅ 2NF\norder_items(order_id, product_id, quantity)\nproducts(id, name)\n\n-- ❌ 3NF 違反 (推移的従属: id → department_id → department_name)\nemployees(id, name, department_id, department_name, department_floor)\n\n-- ✅ 3NF\nemployees(id, name, department_id)\ndepartments(id, name, floor)",
            language: "sql",
            notes: [
              "正規化の真の目的は『更新異常 (update anomaly) の防止』 — 同じ値が複数行にあると変更時の不整合リスク",
              "BCNF: 3NF より厳しい (全関数従属で左辺が候補キー)。実務では 3NF と区別しにくい場面が多い",
            ],
          },
          {
            heading: "1.3 意図的な非正規化 — 性能のためのトレードオフ",
            body: "厳密な正規化は『書き込み時の整合性 ◎、読み込み時に JOIN コスト ▲』。読み多 / 書き少のユースケースで意図的に冗長を入れる: **キャッシュカラム** (`posts.comment_count`)、**マテリアライズドビュー**、**集計テーブル**、**JSONB に小さなネストを入れる**。代わりに整合性は別途担保 (counter_culture gem、定期 batch、トリガー)。",
            code: "-- 例: counter cache\nCREATE TABLE users (id BIGINT PRIMARY KEY, post_count INT NOT NULL DEFAULT 0);\n\n-- 投稿追加時に user.post_count を +1 (Rails counter_cache)\nclass Post < ApplicationRecord\n  belongs_to :user, counter_cache: true   -- users.posts_count を自動更新\nend\nclass User < ApplicationRecord\n  has_many :posts\nend\n# users カラムは posts_count (Rails の規約)\n\n-- 例: マテリアライズドビュー (PostgreSQL)\nCREATE MATERIALIZED VIEW monthly_sales AS\nSELECT DATE_TRUNC('month', created_at) AS month,\n       SUM(amount) AS total\nFROM orders\nGROUP BY DATE_TRUNC('month', created_at);\nCREATE INDEX ON monthly_sales(month);\n\n-- 定期リフレッシュ (cron / sidekiq scheduled)\nREFRESH MATERIALIZED VIEW CONCURRENTLY monthly_sales;\n\n-- 例: 小規模ネストは JSONB で OK\nCREATE TABLE products (\n  id BIGINT PRIMARY KEY,\n  name TEXT,\n  attributes JSONB DEFAULT '{}'    -- 大量に増えない / クエリ少ない属性\n);",
            language: "sql",
            notes: [
              "『性能のために非正規化』は計測してから — 推測で冗長カラムを増やすと整合性が崩れる",
              "counter_cache の整合性は Rails の after_create / destroy フックに依存 — 直接 SQL 操作するとズレる",
            ],
          },
        ],
        keyTakeaways: [
          "Entity / Attribute / Relationship から ER 図で設計を可視化、レビューしやすく",
          "1NF (atomic) → 2NF (部分従属なし) → 3NF (推移従属なし)、実務は 3NF が標準ゴール",
          "正規化の目的は更新異常の防止、非正規化は『計測してから』",
        ],
        comprehensionQuestionIds: ["db-001", "db-002"],
      },
      {
        id: "primary-and-foreign-keys",
        title: "2. 主キーと外部キー設計 — surrogate / UUID / FK 制約",
        intro:
          "代理キー (surrogate key) vs 自然キー (natural key)、BIGINT vs UUID、FK 制約の貼り方と ON DELETE 戦略を整理。",
        readingMinutes: 9,
        objectives: [
          "Surrogate key を PK に使う理由を説明できる",
          "BIGINT / UUID v4 / UUID v7 / ULID の使い分けを判断できる",
          "FOREIGN KEY 制約と ON DELETE CASCADE / SET NULL / RESTRICT を書ける",
        ],
        sections: [
          {
            heading: "2.1 代理キー (surrogate) vs 自然キー (natural)",
            body: "**Surrogate key**: 業務的意味のない単なる識別子 (auto-increment ID、UUID)。**Natural key**: 業務上一意な値 (email、商品コード、ISBN)。実務は『PK は surrogate、業務的一意値は UNIQUE 制約付きの別カラム』が圧倒的に多い。理由: natural key は変わる (email 変更 / 会社統合)、長い (URL 公開時に重い)、漏洩リスク。",
            code: "-- ❌ Natural key を PK (email 変更で全 FK 連鎖更新)\nCREATE TABLE users (\n  email TEXT PRIMARY KEY,\n  name TEXT\n);\nCREATE TABLE posts (\n  id BIGINT PRIMARY KEY,\n  user_email TEXT REFERENCES users(email)   -- email 変更で多数行 UPDATE\n);\n\n-- ✅ Surrogate + UNIQUE\nCREATE TABLE users (\n  id BIGINT PRIMARY KEY GENERATED BY DEFAULT AS IDENTITY,\n  email TEXT UNIQUE NOT NULL,                -- 一意性は維持\n  name TEXT\n);\nCREATE TABLE posts (\n  id BIGINT PRIMARY KEY,\n  user_id BIGINT NOT NULL REFERENCES users(id)\n);\n-- → email が変わっても posts 側は何も触らない",
            language: "sql",
            notes: [
              "Rails 5+ は BIGINT がデフォルト PK (旧 INT は 21 億件で枯渇)",
              "ISBN や VIN (車両識別番号) は 'natural key っぽいが組織で発行される番号' — それでも PK には surrogate を推奨",
            ],
          },
          {
            heading: "2.2 BIGINT vs UUID — どっちを PK に？",
            body: "**BIGINT**: 短い (8 byte)、人間にも読みやすい、連番でデバッグしやすい、JOIN 高速。**UUID v4** (完全ランダム): 衝突しない / 分散 ID 生成 OK だが B-Tree ページ分割で挿入性能が劣化。**UUID v7 / ULID**: 時系列順 + ランダム、両方の利点。BIGINT 連番 + UUID 公開列の併用も実用的。",
            code: "-- 一般的: BIGINT 連番 PK\nCREATE TABLE posts (\n  id BIGINT PRIMARY KEY GENERATED BY DEFAULT AS IDENTITY,\n  ...\n);\n\n-- 分散 / 公開 URL に使う: UUID v7 (時系列順)\nCREATE TABLE posts (\n  id UUID PRIMARY KEY DEFAULT uuid_generate_v7(),   -- 拡張で生成\n  ...\n);\n\n-- 折衷案: 内部は BIGINT、公開は UUID (推奨)\nCREATE TABLE posts (\n  id BIGINT PRIMARY KEY GENERATED BY DEFAULT AS IDENTITY,\n  public_id UUID NOT NULL UNIQUE DEFAULT gen_random_uuid(),\n  ...\n);\n-- 内部 JOIN は BIGINT (速い)、公開 URL は public_id (推測されない)\n\n-- Rails (UUID PK)\n# config/initializers/...\nclass CreatePosts < ActiveRecord::Migration[7.1]\n  def change\n    create_table :posts, id: :uuid do |t|\n      t.references :user, null: false, foreign_key: true, type: :uuid\n      ...\n    end\n  end\nend",
            language: "sql",
            diagram: `flowchart TB
  BIGINT["BIGINT 連番<br/>1, 2, 3, ..."]:::good
  V4["UUID v4<br/>完全ランダム"]:::bad
  V7["UUID v7 / ULID<br/>時刻 + ランダム"]:::good

  BIGINT --> P1["✅ 8 byte<br/>✅ 連番でデバッグ容易<br/>✅ B-Tree 末尾追記で高速<br/>❌ 推測されやすい<br/>❌ 分散 ID 生成困難"]:::note
  V4 --> P2["❌ 16 byte<br/>❌ B-Tree ページ分割<br/>❌ 書き込み性能劣化<br/>✅ 完全分散・衝突なし<br/>✅ 推測されない"]:::note
  V7 --> P3["✅ 16 byte<br/>✅ 時系列順で高速<br/>✅ 分散 ID 生成<br/>✅ 推測されない<br/>△ 対応 lib が必要"]:::note

  classDef good fill:#dcfce7,stroke:#16a34a
  classDef bad fill:#fee2e2,stroke:#ef4444
  classDef note fill:#fef3c7,stroke:#f59e0b`,
            diagramCaption: "PK 選びの比較 — BIGINT / UUID v4 / UUID v7・ULID",
          },
          {
            heading: "2.3 FOREIGN KEY と ON DELETE 戦略",
            body: "FK は『参照先が存在する』を DB レベルで保証。`ON DELETE` で削除時の連鎖挙動を選ぶ: **CASCADE** (子も一緒に削除)、**SET NULL** (FK を NULL に)、**RESTRICT** / **NO ACTION** (子があれば削除拒否)。Rails の `dependent: :destroy` (アプリ層) と DB の `ON DELETE` (DB 層) は別物 — 両方理解して使う。",
            code: "-- CASCADE: 親を消すと子も消える (Post を消すと Comment も)\nCREATE TABLE comments (\n  id BIGINT PRIMARY KEY,\n  post_id BIGINT NOT NULL REFERENCES posts(id) ON DELETE CASCADE,\n  body TEXT\n);\n\n-- SET NULL: 親を消すと FK を NULL に (User 退会で投稿は残す)\nCREATE TABLE posts (\n  id BIGINT PRIMARY KEY,\n  user_id BIGINT REFERENCES users(id) ON DELETE SET NULL,\n  -- user_id NULL 許可必須\n  title TEXT\n);\n\n-- RESTRICT: 子があれば親の削除を拒否 (デフォルト)\nCREATE TABLE order_items (\n  id BIGINT PRIMARY KEY,\n  order_id BIGINT NOT NULL REFERENCES orders(id) ON DELETE RESTRICT\n);\n-- order に items があれば DELETE orders で例外\n\n-- Rails (migration)\nadd_reference :comments, :post, null: false, foreign_key: { on_delete: :cascade }\nadd_reference :posts, :user, foreign_key: { on_delete: :nullify }\n\n# モデル側\nclass Post < ApplicationRecord\n  has_many :comments, dependent: :destroy   -- アプリ層 (callback 走らせる)\n  # dependent: :delete_all                  -- callback 走らせない (高速、注意)\nend",
            language: "sql",
            notes: [
              "FK には自動で INDEX が貼られない (PG) — 別途 `CREATE INDEX` 推奨 (JOIN / 参照削除で必要)",
              "dependent: :destroy は callback を走らせる (重いが安全)、:delete_all は callback スキップ",
              "Rails の `foreign_key: true` は migration で FK 制約を生成、それと別に index も貼る",
            ],
          },
        ],
        keyTakeaways: [
          "PK は surrogate (BIGINT or UUID v7/ULID)、自然キーは UNIQUE 制約付きの別カラム",
          "BIGINT がデフォルト、URL 公開 / 分散には UUID v7 / ULID、UUID v4 は B-Tree 劣化",
          "FOREIGN KEY + ON DELETE CASCADE/SET NULL/RESTRICT で DB レベルの整合性、FK には INDEX も別途",
        ],
        comprehensionQuestionIds: ["db-003", "db-004", "db-017"],
      },
      {
        id: "relation-patterns",
        title: "3. リレーション設計パターン — 1:1 / 1:N / N:N / polymorphic",
        intro:
          "リレーションの 4 大パターンを実例で。N:N の中間テーブル、ポリモーフィック関連の使いどころと FK 整合性の代替策。",
        readingMinutes: 9,
        objectives: [
          "1:1 / 1:N / N:N / ポリモーフィックを判別できる",
          "中間テーブルを (post_id, tag_id) 複合 PK か別途 id + UNIQUE で設計できる",
          "ポリモーフィック関連の代替案 (専用テーブル / STI / GraphQL union) を比較できる",
        ],
        sections: [
          {
            heading: "3.1 1:1 — オプショナルな拡張属性",
            body: "ユーザーとプロフィール (詳細情報) を分けたい時など。**FK + UNIQUE 制約** で 1:1 を表現。あまり頻繁ではない情報、TEXT が大量の場合、Auth 用 / Profile 用の分離などで使う。1:0..1 (オプショナル 1:1) も同パターン。",
            code: "-- users + profiles (1:1 オプショナル)\nCREATE TABLE users (\n  id BIGINT PRIMARY KEY,\n  email TEXT UNIQUE NOT NULL\n);\nCREATE TABLE user_profiles (\n  id BIGINT PRIMARY KEY,\n  user_id BIGINT UNIQUE NOT NULL REFERENCES users(id) ON DELETE CASCADE,\n  bio TEXT,\n  avatar_url TEXT,\n  twitter_handle TEXT\n);\n-- UNIQUE (user_id) で 1:1 を強制\n\n-- Rails\nclass User < ApplicationRecord\n  has_one :user_profile, dependent: :destroy\nend\nclass UserProfile < ApplicationRecord\n  belongs_to :user\nend\n\n-- 使い分け\n-- 1:1 が常に必要 → 同じテーブルに統合 (users に bio カラム)\n-- オプショナル / 大量 TEXT / 別アクセス権限 → 別テーブル",
            language: "sql",
          },
          {
            heading: "3.2 1:N — N 側に FK",
            body: "User 1 : N Posts の典型。**N 側 (posts) に user_id を持たせる**。FK + NOT NULL (所有が必須なら) + INDEX。Rails では `belongs_to :user` (N 側) と `has_many :posts` (1 側)。",
            code: "CREATE TABLE users (id BIGINT PRIMARY KEY, name TEXT);\nCREATE TABLE posts (\n  id BIGINT PRIMARY KEY,\n  user_id BIGINT NOT NULL REFERENCES users(id) ON DELETE CASCADE,\n  title TEXT NOT NULL\n);\nCREATE INDEX idx_posts_user_id ON posts(user_id);\n\n-- Rails\nclass User < ApplicationRecord\n  has_many :posts, dependent: :destroy\nend\nclass Post < ApplicationRecord\n  belongs_to :user\nend\n\n-- ❌ N:1 を逆向きに表現 (users.post_ids INT[])\nALTER TABLE users ADD COLUMN post_ids BIGINT[];\n-- 配列で持つと FK 制約不可、逆引き遅い、JOIN 困難、集計困難\n-- → 必ず N 側に FK",
            language: "sql",
          },
          {
            heading: "3.3 N:N — 中間テーブル必須",
            body: "Post N : N Tags のように両方が複数を持つなら **中間テーブル** (join table / junction table)。複合 PK `(post_id, tag_id)` で同組み合わせ重複を防ぐ。中間テーブルが『独立したエンティティ』に育つことが多い (memberships は role / joined_at を持つ) → 最初から id + UNIQUE で組むと拡張に強い。",
            code: "-- シンプルな N:N\nCREATE TABLE posts (id BIGINT PRIMARY KEY, title TEXT);\nCREATE TABLE tags  (id BIGINT PRIMARY KEY, name TEXT UNIQUE);\nCREATE TABLE post_tags (\n  post_id BIGINT NOT NULL REFERENCES posts(id) ON DELETE CASCADE,\n  tag_id  BIGINT NOT NULL REFERENCES tags(id)  ON DELETE CASCADE,\n  PRIMARY KEY (post_id, tag_id)\n);\nCREATE INDEX idx_post_tags_tag_id ON post_tags(tag_id);   -- 逆引き用\n\n-- 属性を持つ中間 (推奨、拡張に強い)\nCREATE TABLE memberships (\n  id BIGINT PRIMARY KEY,\n  team_id BIGINT NOT NULL REFERENCES teams(id),\n  user_id BIGINT NOT NULL REFERENCES users(id),\n  role TEXT NOT NULL CHECK (role IN ('owner', 'admin', 'member')),\n  joined_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),\n  UNIQUE (team_id, user_id)\n);\n\n-- Rails (has_many :through が推奨、has_and_belongs_to_many は属性を持てない)\nclass Post < ApplicationRecord\n  has_many :post_tags, dependent: :destroy\n  has_many :tags, through: :post_tags\nend\nclass Tag < ApplicationRecord\n  has_many :post_tags, dependent: :destroy\n  has_many :posts, through: :post_tags\nend\nclass PostTag < ApplicationRecord\n  belongs_to :post\n  belongs_to :tag\nend",
            language: "sql",
            diagram: `erDiagram
  POST  ||--o{ POST_TAG : ""
  TAG   ||--o{ POST_TAG : ""
  POST {
    bigint id PK
    text   title
  }
  TAG {
    bigint id PK
    text   name UK
  }
  POST_TAG {
    bigint post_id FK
    bigint tag_id FK
  }`,
            diagramCaption: "N:N は中間テーブル POST_TAG で表現 — 両者に FK + 複合 PK",
          },
          {
            heading: "3.4 ポリモーフィック関連 — 柔軟だが FK が貼れない",
            body: "コメントを Post / Photo / Video など複数の親に付けたい時の選択肢。`commentable_type` (型名文字列) + `commentable_id` (FK 相当) を持つ。柔軟だが **FK 制約が貼れない → 孤児レコード発生のリスク**。代替案も検討する。",
            code: "-- ポリモーフィック\nCREATE TABLE comments (\n  id BIGINT PRIMARY KEY,\n  commentable_type TEXT NOT NULL,    -- 'Post', 'Photo', 'Video'\n  commentable_id   BIGINT NOT NULL,\n  body TEXT,\n  user_id BIGINT REFERENCES users(id),\n  created_at TIMESTAMPTZ\n);\nCREATE INDEX idx_comments_commentable\n  ON comments(commentable_type, commentable_id);   -- 必須\n\n-- Rails\nclass Comment < ApplicationRecord\n  belongs_to :commentable, polymorphic: true\nend\nclass Post < ApplicationRecord\n  has_many :comments, as: :commentable, dependent: :destroy\nend\nclass Photo < ApplicationRecord\n  has_many :comments, as: :commentable, dependent: :destroy\nend\n\n-- ⚠️ 孤児レコード防止 (定期チェック)\n-- 親が destroy されても、Rails の dependent: :destroy が走らないコードパス\n-- (raw SQL DELETE 等) で残ることがある\nSELECT * FROM comments\nWHERE commentable_type = 'Post'\n  AND commentable_id NOT IN (SELECT id FROM posts);\n\n-- 代替案\n-- 1. 専用テーブル: post_comments / photo_comments\n--    → 別々の belongs_to、FK 制約 OK、複雑性増\n-- 2. STI (Single Table Inheritance): commentables 1 テーブルに type で分岐\n--    → JOIN が単純、列が多くなる\n-- 3. アプリ層の polymorphic: GraphQL union, Service object で分岐",
            language: "sql",
            notes: [
              "ポリモーフィックは便利だが安易に使うと『データ整合性は祈り頼み』に",
              "本当に多態性が必要か検討 — Comment 専用テーブルでも実装は組める",
              "type カラムは class 名そのまま (リネーム時に DB 更新が必要)",
            ],
          },
        ],
        keyTakeaways: [
          "1:1 は user_id UNIQUE で表現、1:N は N 側に FK + NOT NULL + INDEX",
          "N:N は中間テーブル — 複合 PK か id + UNIQUE、属性が育つなら memberships 型で",
          "ポリモーフィックは FK 不可 — 孤児チェックを定期実行、代替案 (専用テーブル / STI) も検討",
        ],
        comprehensionQuestionIds: ["db-006", "db-007", "db-008"],
      },
      {
        id: "indexes-and-naming",
        title: "4. INDEX 設計と命名規約 — 設計時から効かせる",
        intro:
          "テーブル設計の時点で INDEX を意識する。複合 INDEX の順序、UNIQUE / 部分 INDEX、命名・型選び (TEXT vs VARCHAR、DECIMAL vs FLOAT) を整理。",
        readingMinutes: 9,
        objectives: [
          "WHERE / JOIN / ORDER BY で使うカラムに INDEX を設計時から貼れる",
          "複合 INDEX の左端ルール / 部分 INDEX を理解する",
          "金額は DECIMAL、文字列は TEXT、命名は snake_case + 複数形などの慣習を守れる",
        ],
        sections: [
          {
            heading: "4.1 設計時に INDEX を貼るカラム",
            body: "**外部キー** (user_id, post_id 等)、**UNIQUE 制約** (自動)、**WHERE 高頻度** (status, deleted_at)、**ORDER BY** (created_at)、**JOIN 条件**。PostgreSQL は FK に自動 INDEX を貼らない (MySQL は貼る) — Rails の migration で `index: true` を明示。",
            code: "CREATE TABLE posts (\n  id BIGINT PRIMARY KEY,\n  user_id BIGINT NOT NULL REFERENCES users(id),\n  status TEXT NOT NULL,\n  published_at TIMESTAMPTZ,\n  slug TEXT NOT NULL\n);\n\n-- 1. FK には必ず INDEX\nCREATE INDEX idx_posts_user_id ON posts(user_id);\n\n-- 2. URL / 一意な業務値\nCREATE UNIQUE INDEX idx_posts_slug ON posts(slug);\n\n-- 3. 一覧クエリ用の複合 INDEX (等値 → 範囲 → ORDER BY)\nCREATE INDEX idx_posts_status_published_at\n  ON posts(status, published_at DESC);\n-- WHERE status='published' ORDER BY published_at DESC が高速化\n\n-- Rails migration\nclass CreatePosts < ActiveRecord::Migration[7.1]\n  def change\n    create_table :posts do |t|\n      t.references :user, null: false, foreign_key: true   # FK + index 同時\n      t.string :status, null: false\n      t.timestamptz :published_at\n      t.string :slug, null: false\n      t.timestamps\n    end\n    add_index :posts, :slug, unique: true\n    add_index :posts, [:status, :published_at], order: { published_at: :desc }\n  end\nend",
            language: "sql",
            notes: [
              "INDEX を貼りすぎると INSERT / UPDATE が重くなる + ディスク増 → WHERE / JOIN / ORDER BY 実績ベースで",
              "複合 INDEX の順序は『等値 (=) → 範囲 (> < BETWEEN) → ORDER BY』が原則 (SQL ガイド 7 章を参照)",
            ],
          },
          {
            heading: "4.2 部分 INDEX と UNIQUE 制約の応用",
            body: "**部分 INDEX (PostgreSQL)**: `CREATE INDEX ... WHERE condition` で条件付きの INDEX。サイズが小さく、特定の検索に強い。ソフト削除と UNIQUE の組合せに必須。**Expression INDEX**: `CREATE INDEX ON users(LOWER(email))` で関数結果に INDEX。",
            code: "-- 公開済みの post だけに INDEX (サイズ小、検索高速)\nCREATE INDEX idx_posts_published\n  ON posts(published_at DESC)\n  WHERE published_at IS NOT NULL;\n\n-- ソフト削除 + UNIQUE\n-- 通常の UNIQUE だと『削除済み + 同 email の新規』が衝突\nCREATE UNIQUE INDEX idx_users_email_active\n  ON users(email)\n  WHERE deleted_at IS NULL;          -- 生存レコードだけ UNIQUE\n\n-- Expression INDEX (大文字小文字無視の検索)\nCREATE INDEX idx_users_lower_email ON users(LOWER(email));\n-- → WHERE LOWER(email) = 'a@x.com' で INDEX 使われる\n\n-- 複数カラムの式\nCREATE INDEX idx_users_full_name ON users((first_name || ' ' || last_name));\n\n-- Rails (migration)\nclass AddPartialIndexToUsers < ActiveRecord::Migration[7.1]\n  def change\n    add_index :users, :email, unique: true, where: 'deleted_at IS NULL'\n  end\nend",
            language: "sql",
            notes: [
              "MySQL は部分 INDEX が無いので、別カラムで実現 (deleted_at の代わりに 'active_email' を別途持つなど)",
              "INDEX 名は規約: `idx_<table>_<col1>_<col2>` / `<table>_<col>_unique` などチームで統一",
            ],
          },
          {
            heading: "4.3 命名規約 — snake_case + 複数形 + 共通サフィックス",
            body: "**テーブル名**: 複数形 snake_case (`users`, `order_items`)。**カラム名**: 単数 snake_case (`user_id`, `created_at`)。**外部キー**: `<table_singular>_id`。**Boolean**: `is_` / `has_` プレフィックス避けつつ、状態を表す動詞 (`active`, `published_at`)。**タイムスタンプ**: `_at` サフィックス (`created_at`, `published_at`)。**カウント**: `_count` サフィックス。",
            code: "-- ✅ 推奨\nusers, posts, order_items, post_tags\nid, user_id, post_id\ncreated_at, updated_at, published_at, deleted_at\nfollowers_count, posts_count\nemail, name, role, status\n\n-- ❌ よくある混乱\nUser, Posts                        -- PascalCase\nuserId, createdAt                  -- camelCase\nuser_email, user_password          -- テーブル名重複 (users.email で十分)\nemailAddress, emailAddrPlain       -- 縦割り型語彙\nbool_published, isPublished        -- prefix が冗長\nflag_active                        -- 'flag' が無意味\n\n-- 一貫したサフィックス\n_at      タイムスタンプ (TIMESTAMPTZ)\n_id      外部キー (BIGINT or UUID)\n_count   カウント\n_url     URL 文字列\n_path    ローカルパス\n_token   認証トークン (機密、filter_parameters)",
            language: "sql",
            notes: [
              "Rails の規約: テーブル `users` → モデル `User`、`user_id` → `belongs_to :user`、`created_at` → 自動更新",
              "予約語 (order, group, user 等) はクオート必要だが、避けるのが無難",
            ],
          },
          {
            heading: "4.4 適切なデータ型の選び方",
            body: "**整数**: BIGINT (Rails 5+ デフォルト、INT は 21 億で枯渇)。**文字列**: TEXT (PG では VARCHAR と性能同等、長さ制限なし)。**金額**: DECIMAL(10, 2) または整数 (cents)。**日時**: TIMESTAMPTZ (UTC + TZ 情報)。**Boolean**: BOOLEAN。**列挙**: TEXT + CHECK 制約 or ENUM 型。**JSON**: JSONB (PG、インデックス可能、推奨)。**UUID**: UUID 型。",
            code: "-- 推奨型\nCREATE TABLE orders (\n  id BIGINT PRIMARY KEY GENERATED BY DEFAULT AS IDENTITY,\n  user_id BIGINT NOT NULL REFERENCES users(id),\n  amount_cents BIGINT NOT NULL,                  -- 金額は整数 (or DECIMAL)\n  -- amount DECIMAL(15, 2) NOT NULL,              -- 代替案\n  currency CHAR(3) NOT NULL DEFAULT 'JPY',\n  status TEXT NOT NULL DEFAULT 'pending'\n    CHECK (status IN ('pending', 'paid', 'cancelled')),\n  metadata JSONB NOT NULL DEFAULT '{}'::jsonb,\n  external_id UUID,\n  is_subscription BOOLEAN NOT NULL DEFAULT FALSE,\n  notes TEXT,\n  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),\n  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()\n);\n\n-- ❌ アンチパターン\nid INT,                              -- 21 億件で枯渇\namount FLOAT,                        -- 浮動小数誤差\ncreated_at TIMESTAMP,                -- TZ なし (TIMESTAMPTZ 推奨)\nstatus VARCHAR(20),                  -- CHECK 制約なし (どんな値でも入る)\ndata TEXT,                           -- JSON を TEXT で保存 (JSONB が良い)\n\n-- Rails (migration)\nt.bigint   :user_id, null: false\nt.bigint   :amount_cents, null: false\nt.string   :currency, limit: 3, default: 'JPY', null: false\nt.string   :status, null: false, default: 'pending'\nt.jsonb    :metadata, null: false, default: {}\nt.boolean  :is_subscription, null: false, default: false\nt.timestamps                          -- created_at, updated_at",
            language: "sql",
          },
        ],
        keyTakeaways: [
          "FK / UNIQUE / WHERE 高頻度 / ORDER BY に INDEX、複合 INDEX は『等値→範囲→順序』",
          "部分 INDEX (PG) はソフト削除 + UNIQUE と相性 ◎、Expression INDEX で関数結果も",
          "命名: テーブル複数形 + snake_case、_id / _at / _count サフィックスで意図を明示",
          "型: BIGINT / TEXT / DECIMAL or 整数 / TIMESTAMPTZ / JSONB が現代の標準",
        ],
        comprehensionQuestionIds: ["db-005", "db-009", "db-010", "db-013", "db-014"],
      },
      {
        id: "migrations-and-zdd",
        title: "5. マイグレーションと Zero Downtime Deployment",
        intro:
          "本番 DB に DDL を打つ怖さと対策。NULL → backfill → NOT NULL の段階手順、CONCURRENTLY INDEX、strong_migrations gem の活用。",
        readingMinutes: 9,
        objectives: [
          "本番テーブルへの危険な ALTER (NOT NULL 一気追加 / 巨大 INDEX / ENUM 変更) を見分けられる",
          "段階的に NULL 追加 → backfill → NOT NULL の手順を書ける",
          "CONCURRENTLY INDEX、strong_migrations gem で安全装置を入れる",
        ],
        sections: [
          {
            heading: "5.1 危険な DDL のパターン",
            body: "PostgreSQL の ALTER TABLE は **ACCESS EXCLUSIVE ロック** を取り、テーブル全体を一時的に止める。短時間で終わる DDL なら OK、長時間ロックは本番停止と等価。危険な例: NOT NULL 一気追加 / DEFAULT 値追加 / カラム型変更 / 巨大 INDEX 作成 / ENUM 値追加。",
            code: "-- ❌ 危険 1: 巨大テーブルに NOT NULL DEFAULT を一気に\nALTER TABLE users ADD COLUMN role TEXT NOT NULL DEFAULT 'member';\n-- → 全行を更新するためテーブル書き換え (PG 11+ で改善されたが油断禁物)\n\n-- ❌ 危険 2: 巨大 INDEX を通常モードで作る\nCREATE INDEX idx_users_email ON users(email);\n-- → INDEX 完成まで書き込みブロック (PostgreSQL)\n\n-- ❌ 危険 3: カラム型変更\nALTER TABLE posts ALTER COLUMN title TYPE VARCHAR(500);\n-- → テーブル全体の書き換え\n\n-- ❌ 危険 4: ENUM 値の途中削除\nALTER TYPE post_status DROP VALUE 'archived';   -- できない (古いバージョン)\n\n-- ✅ 正解: 段階的に\n-- (1) NULL 許可で追加 (ファイルサイズの変更だけ)\nALTER TABLE users ADD COLUMN role TEXT;\n-- (2) backfill (小分け、アプリ稼働中)\nUPDATE users SET role = 'member' WHERE role IS NULL AND id BETWEEN 1 AND 10000;\n-- ... (繰り返し)\n-- (3) NOT NULL 制約 (全行に値があれば即時、短時間)\nALTER TABLE users ALTER COLUMN role SET NOT NULL;",
            language: "sql",
            notes: [
              "PG 11+ の `ADD COLUMN ... DEFAULT 定数` は『書き換えなし』に改善されたが、関数や式は依然書き換え",
              "Bluegreen Deployment 等のスキーマ移行プラットフォームもある",
            ],
          },
          {
            heading: "5.2 CONCURRENTLY INDEX — ノンブロッキング作成",
            body: "PostgreSQL の `CREATE INDEX CONCURRENTLY` は他のクエリをブロックせずに INDEX を作成する。代わりに時間はかかる (通常の 2〜3 倍)。本番では必須。Rails では `disable_ddl_transaction!` + `algorithm: :concurrently` で。",
            code: "-- ノンブロッキング INDEX 作成\nCREATE INDEX CONCURRENTLY idx_posts_user_id ON posts(user_id);\n-- → 他のクエリは継続実行可能、INDEX 完成まで時間がかかる\n\n-- ❌ 通常モード (本番禁止)\nCREATE INDEX idx_posts_user_id ON posts(user_id);\n-- → 書き込みブロック\n\n-- 失敗時のリカバリ\n-- CONCURRENTLY が中断するとIndex が INVALID 状態で残る\nSELECT indexname, indexdef FROM pg_indexes WHERE indexname = 'idx_posts_user_id';\n-- 確認後\nDROP INDEX CONCURRENTLY idx_posts_user_id;\n-- 再作成\n\n-- Rails (migration)\nclass AddIndexToPostsUser < ActiveRecord::Migration[7.1]\n  disable_ddl_transaction!         -- CONCURRENTLY は transaction の中で動かない\n\n  def change\n    add_index :posts, :user_id, algorithm: :concurrently\n  end\nend\n\n-- UNIQUE INDEX も同じ\nadd_index :users, :email, unique: true, algorithm: :concurrently",
            language: "sql",
            notes: [
              "CONCURRENTLY は MySQL では `ALGORITHM=INPLACE, LOCK=NONE` が相当 (MySQL 5.6+)",
              "CONCURRENTLY 中に重複データが入ると INDEX が INVALID 状態に → DROP + 再作成",
            ],
          },
          {
            heading: "5.3 strong_migrations — 危険を自動検出",
            body: "**strong_migrations** gem (Rails) は危険な migration を Rails の migrate 時に検出してエラーにし、安全な代替手順を提示してくれる。チーム全体で『うっかり』を防げる。`safety_assured` でレビュー済みの ALTER は許可可能。",
            code: "# Gemfile\ngem 'strong_migrations'\n\n# 危険な migration\nclass AddRoleToUsers < ActiveRecord::Migration[7.1]\n  def change\n    add_column :users, :role, :string, null: false, default: 'member'\n  end\nend\n\n# → migrate 時にエラー\n# === Dangerous operation detected #strong_migrations ===\n# Adding a column with a non-null default blocks reads and writes...\n# Instead:\n# 1. Add the column WITHOUT a default value\n# 2. Backfill the column\n# 3. Add the default value\n# 4. Add NOT NULL\n\n# 安全な書き方\nclass AddRoleToUsers < ActiveRecord::Migration[7.1]\n  def up\n    add_column :users, :role, :string\n  end\nend\n\nclass BackfillRoleOnUsers < ActiveRecord::Migration[7.1]\n  disable_ddl_transaction!\n\n  def up\n    User.unscoped.in_batches.update_all(role: 'member')\n  end\nend\n\nclass AddRoleNotNullToUsers < ActiveRecord::Migration[7.1]\n  def up\n    safety_assured { change_column_null :users, :role, false }\n  end\nend\n\n# レビュー済みで強制実行\nsafety_assured do\n  add_column :users, :role, :string, null: false, default: 'member'\nend",
            language: "ruby",
            notes: [
              "strong_migrations は『教科書』として優秀 — エラーメッセージに代替手順が書いてある",
              "ローカル / staging で十分テストしてから本番デプロイ",
            ],
          },
          {
            heading: "5.4 Zero Downtime Deployment の全体像",
            body: "新旧スキーマが共存する期間を許容するのが ZDD。**Expand → Migrate → Contract** の 3 段階: (1) 新カラム / テーブル追加 (古コードは無視)、(2) アプリを新スキーマ対応 + データ移行、(3) 古カラム削除。各ステップで複数デプロイを挟むのが基本。",
            code: `// 例: users.name (TEXT) を first_name / last_name に分割

// Step 1: Expand (新カラム追加、古いコードは無視)
ALTER TABLE users ADD COLUMN first_name TEXT;
ALTER TABLE users ADD COLUMN last_name TEXT;

// アプリ: name を書く時に first_name / last_name にも書く
class User < ApplicationRecord
  before_save :sync_name_parts
  def sync_name_parts
    if name_changed?
      self.first_name, self.last_name = name.split(' ', 2)
    end
  end
end

// → デプロイ

// Step 2: Migrate (backfill + アプリ移行)
// 既存データを backfill (小分け batch)
User.unscoped.in_batches do |batch|
  batch.each do |u|
    first, last = u.name.split(' ', 2)
    u.update_columns(first_name: first, last_name: last)
  end
end

// アプリの読み取り側を first_name / last_name に切替
// name アクセスを deprecated にする (warning だけ)
class User < ApplicationRecord
  def name
    ActiveSupport::Deprecation.warn('User#name is deprecated, use first_name + last_name')
    "#{first_name} #{last_name}"
  end
end

// → デプロイ

// Step 3: Contract (古いカラム削除)
class RemoveNameFromUsers < ActiveRecord::Migration[7.1]
  def up
    safety_assured { remove_column :users, :name }
  end
end

// → デプロイ
// この時点で古いコードを参照する process が残っていないこと
`,
            language: "ruby",
            notes: [
              "Expand → Migrate → Contract の 3 段階は最低でも 3 回デプロイが必要 (場合により 5〜6 回)",
              "各段階で『旧クライアント / 新クライアント / 旧 DB / 新 DB』が共存できる設計が必要",
              "DB スナップショット + Rollback 手順を必ず用意",
            ],
          },
        ],
        keyTakeaways: [
          "巨大テーブル DDL は段階的に: NULL 追加 → backfill → NOT NULL",
          "本番 INDEX は CONCURRENTLY (Rails: algorithm: :concurrently + disable_ddl_transaction!)",
          "strong_migrations で危険な migration を自動検出、教科書として優秀",
          "ZDD は Expand → Migrate → Contract の 3 段階で複数デプロイを挟む",
        ],
        comprehensionQuestionIds: ["db-012"],
      },
      {
        id: "audit-soft-delete-history",
        title: "6. 監査・ソフト削除・履歴 — DB 設計で残す情報",
        intro:
          "created_at / updated_at / deleted_at の意味、ソフト削除のメリデメ、変更履歴を残す paper_trail / audited、論理削除と UNIQUE の衝突解消。",
        readingMinutes: 9,
        objectives: [
          "Rails の timestamps カラムと業務的時刻 (published_at) の区別ができる",
          "ソフト削除 (deleted_at) と UNIQUE 制約の組合せを部分 INDEX で解決できる",
          "paper_trail / audited で履歴監査ログを設計できる",
        ],
        sections: [
          {
            heading: "6.1 タイムスタンプ — 3 種類の用途",
            body: "**システム時刻 (created_at / updated_at)**: Rails が自動更新。デバッグ・キャッシュキー・楽観ロック (lock_version でなくこれを使う場合も)。**業務時刻 (published_at / approved_at / completed_at)**: 業務イベントの発生時刻、`NULL = 未発生` で状態も表現。**監査時刻 (last_login_at / last_seen_at)**: ユーザー行動の最新時刻。全部 `TIMESTAMPTZ`、UTC で保存・表示時に変換が原則。",
            code: "CREATE TABLE posts (\n  id BIGINT PRIMARY KEY,\n  title TEXT NOT NULL,\n  body TEXT,\n  user_id BIGINT NOT NULL REFERENCES users(id),\n\n  -- システム時刻 (Rails timestamps、自動更新)\n  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),\n  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),\n\n  -- 業務時刻 (アプリ層で明示セット)\n  published_at TIMESTAMPTZ,                -- NULL = 下書き、時刻 = 公開済み\n  archived_at  TIMESTAMPTZ,                -- NULL = アクティブ\n  approved_at  TIMESTAMPTZ,\n\n  -- 削除時刻 (ソフト削除、後述)\n  deleted_at   TIMESTAMPTZ\n);\n\n-- 公開済みを取得\nSELECT * FROM posts\nWHERE deleted_at IS NULL\n  AND published_at IS NOT NULL\n  AND published_at <= NOW()\nORDER BY published_at DESC;\n\n-- 予約投稿\nUPDATE posts SET published_at = '2026-12-01 10:00' WHERE id = 1;\n\n-- Rails\nt.timestamps                              # created_at, updated_at\nt.timestamptz :published_at\nt.timestamptz :deleted_at",
            language: "sql",
            notes: [
              "全部 TIMESTAMPTZ で UTC 保存 → アプリ層で TZ 変換 (Time.zone.now)",
              "boolean published より published_at TIMESTAMPTZ NULL のほうが情報量が多い (公開時刻も分かる)",
            ],
          },
          {
            heading: "6.2 ソフト削除 — deleted_at + 部分 INDEX",
            body: "**物理削除しない代わりに `deleted_at` を埋める**。誤削除復元、監査、関連レコード保持に有効。デメリット: UNIQUE 制約と相性悪 (`email UNIQUE` で『削除済み + 同 email の新規』が衝突) → 部分 INDEX で解決。Rails では discard / paranoia gem。",
            code: "-- スキーマ\nALTER TABLE users ADD COLUMN deleted_at TIMESTAMPTZ;\n\n-- 部分 UNIQUE (PG) — 生存レコードだけ UNIQUE\nDROP INDEX users_email_key;     -- 既存の UNIQUE 制約があれば外す\nCREATE UNIQUE INDEX idx_users_email_active\n  ON users(email)\n  WHERE deleted_at IS NULL;\n\n-- 削除 / 復元\nUPDATE users SET deleted_at = NOW() WHERE id = 1;\nUPDATE users SET deleted_at = NULL  WHERE id = 1;\n\n-- 検索 (生存のみ)\nSELECT * FROM users WHERE deleted_at IS NULL;\n\n-- 削除済みを含めて検索 (監査・復元用)\nSELECT * FROM users;\nSELECT * FROM users WHERE deleted_at IS NOT NULL;\n\n-- Rails (discard gem 推奨、軽量で paranoia の罠が少ない)\n# Gemfile: gem 'discard'\nclass User < ApplicationRecord\n  include Discard::Model            # default_scope { kept } を提供\nend\n\nUser.discard(id)                    # deleted_at = NOW()\nUser.undiscard(id)                  # NULL に戻す\nUser.kept                           # 生存\nUser.discarded                      # 削除済み\nUser.with_discarded                 # 全件",
            language: "sql",
            diagram: `flowchart LR
  ACT["users<br/>deleted_at IS NULL"]:::active
  DEL["users<br/>deleted_at IS NOT NULL"]:::deleted
  ACT -- "discard()<br/>deleted_at = NOW()" --> DEL
  DEL -- "undiscard()<br/>deleted_at = NULL" --> ACT
  ACT -.->|"UNIQUE (email) WHERE deleted_at IS NULL"| IDX["部分 INDEX"]:::index
  classDef active fill:#dcfce7,stroke:#16a34a
  classDef deleted fill:#fee2e2,stroke:#ef4444
  classDef index fill:#fef3c7,stroke:#f59e0b`,
            diagramCaption: "ソフト削除 + 部分 UNIQUE INDEX で『削除済 + 同 email 再登録』を可能に",
            notes: [
              "MySQL は部分 INDEX 無し → 別カラム (active_email など) で代替",
              "GDPR の右forgotten では物理削除も必要 — 監査用に key/value だけ別テーブルに残すのも一案",
            ],
          },
          {
            heading: "6.3 変更履歴 — paper_trail / audited",
            body: "『誰がいつ何を変えたか』を別テーブルに記録。**paper_trail** は versions テーブルに変更前後の値を JSON で保存、reify でロールバック可能。**audited** は同様だが API が少し違う。コンプライアンス (SOX / GDPR / SOC2) で必須になることが多い。",
            code: "# Gemfile\ngem 'paper_trail'\n\n# rails g paper_trail:install\n# versions テーブルが作られる\n\n# Model\nclass Post < ApplicationRecord\n  has_paper_trail                              # 全 attr を追跡\n  # has_paper_trail only: [:title, :body]      # 一部だけ\n  # has_paper_trail ignore: [:updated_at]\nend\n\n# 使う\npost = Post.find(1)\npost.versions                                  # PaperTrail::Version の配列\npost.versions.last.object_changes              # { 'title' => ['Old', 'New'] }\npost.versions.last.reify                       # 1 つ前の Post オブジェクト復元\npost.versions.last.reify.save                  # ロールバック\n\n# whodunnit (誰が変更したか)\nclass ApplicationController < ActionController::Base\n  before_action :set_paper_trail_whodunnit\n  # → PaperTrail.request.whodunnit = current_user.id\nend\npost.versions.last.whodunnit                   # \"42\" (user_id)\n\n# audited も同様の機能\ngem 'audited'\nclass Post < ApplicationRecord\n  audited                                       # audits テーブル\nend\nPost.last.audits.last.audited_changes\n\n# DB スキーマ (paper_trail)\nCREATE TABLE versions (\n  id BIGINT PRIMARY KEY,\n  item_type TEXT NOT NULL,                     # 'Post'\n  item_id BIGINT NOT NULL,                     # post.id\n  event TEXT NOT NULL,                         # 'create', 'update', 'destroy'\n  whodunnit TEXT,                              # user_id (string)\n  object JSONB,                                # 変更前のオブジェクト全体\n  object_changes JSONB,                        # diff\n  created_at TIMESTAMPTZ\n);",
            language: "ruby",
            notes: [
              "ストレージ消費が増える — 重要モデルだけに絞る or 古いバージョンは定期 purge",
              "paper_trail の reify は ActiveRecord callback を呼ぶので、save 時の副作用に注意",
              "金融・医療系では audit log の改ざん不可性 (append-only) が要求される",
            ],
          },
        ],
        keyTakeaways: [
          "システム時刻 (created/updated_at) + 業務時刻 (published_at) + 削除時刻 (deleted_at) を区別",
          "ソフト削除は部分 UNIQUE INDEX (PG) で再登録可能に、discard gem が軽量",
          "paper_trail / audited で変更履歴を versions / audits に JSON 保存、whodunnit で誰がを記録",
        ],
        comprehensionQuestionIds: ["db-010", "db-011", "db-016", "db-018"],
      },
      {
        id: "antipatterns",
        title: "7. アンチパターン集 — EAV / 巨大 JSON / 配列カラム / N+1 を呼ぶ設計",
        intro:
          "DB 設計でよく見かける『一見便利だが後で苦しむ』パターン。EAV / 巨大 JSONB / 配列カラム / unbounded polymorphic / N+1 を誘発する設計を整理。",
        readingMinutes: 8,
        objectives: [
          "EAV / 配列カラム / 巨大 JSONB の落とし穴と代替案を説明できる",
          "『あとから INDEX が貼れない / 集計が辛い』設計を避けられる",
          "N+1 を誘発する設計 (counter cache なし / 過剰 polymorphic) を見抜ける",
        ],
        sections: [
          {
            heading: "7.1 EAV (Entity-Attribute-Value)",
            body: "属性を縦持ちで保存する設計。柔軟だが集計・型保証・JOIN が悪夢。商品カテゴリごとに違う属性 (服: サイズ / 色、本: ISBN) で誘惑される。**JSONB or サブタイプ別テーブル** で代替するのが現代。",
            code: "-- ❌ EAV (避ける)\nCREATE TABLE product_properties (\n  product_id BIGINT,\n  key TEXT,                                -- 'size', 'color', 'isbn'\n  value TEXT,                              -- '42', 'red', '978-...'\n  PRIMARY KEY (product_id, key)\n);\n-- 検索: WHERE key='size' AND value='M' の JOIN 地獄\n-- 型なし: '42' (string) vs 42 (int) で混乱\n-- 集計: SELECT AVG(value) は文字列なので不可\n\n-- ✅ 代替 1: JSONB (PostgreSQL)\nCREATE TABLE products (\n  id BIGINT PRIMARY KEY,\n  name TEXT,\n  category TEXT,\n  attributes JSONB NOT NULL DEFAULT '{}'::jsonb\n);\nCREATE INDEX idx_products_attrs ON products USING GIN (attributes);\n-- 検索\nSELECT * FROM products WHERE attributes @> '{\"size\":\"M\"}';\nSELECT * FROM products WHERE (attributes->>'price')::numeric > 1000;\n\n-- ✅ 代替 2: サブタイプ毎にテーブル\nCREATE TABLE clothes (\n  id BIGINT PRIMARY KEY,\n  product_id BIGINT REFERENCES products(id),\n  size TEXT NOT NULL,\n  color TEXT NOT NULL\n);\nCREATE TABLE books (\n  id BIGINT PRIMARY KEY,\n  product_id BIGINT REFERENCES products(id),\n  isbn TEXT UNIQUE,\n  author TEXT NOT NULL\n);\n-- → JOIN は明確、型保証、CHECK 制約も貼れる",
            language: "sql",
            notes: [
              "JSONB はバランスが良いが、頻繁にクエリする属性は通常カラムに昇格",
              "EAV を採用するなら、必ず value の型を別カラム (value_text / value_number) で分けてから",
            ],
          },
          {
            heading: "7.2 配列カラム / カンマ区切り",
            body: "`tags TEXT` に 'ruby,rails,sql' のようにカンマ区切りで保存、または `tag_ids BIGINT[]` で配列保存。**1NF 違反**で集計・検索・FK 制約が困難。N:N の中間テーブルに昇格すべき。例外: 順序を持つ小さい固定列 (色のチェックリスト 5 色など) は配列 / JSONB でも OK。",
            code: "-- ❌ カンマ区切り\nCREATE TABLE posts (\n  id BIGINT PRIMARY KEY,\n  tags TEXT                              -- 'ruby,rails,sql'\n);\n-- 検索: WHERE tags LIKE '%rails%' → 'preserve_rails' も hit、INDEX 効かず\n-- 追加: 既存値を読んで連結して書き直し (race condition)\n-- 削除: 同上\n\n-- ❌ 配列カラム (PostgreSQL 専用)\nALTER TABLE posts ADD COLUMN tag_ids BIGINT[];\n-- 検索: WHERE tag_ids @> ARRAY[5] は GIN index で速いが\n-- FK 制約が貼れない → 参照先削除で残骸\n-- JOIN: LATERAL UNNEST が必要で読みにくい\n\n-- ✅ 中間テーブル (N:N)\nCREATE TABLE post_tags (\n  post_id BIGINT REFERENCES posts(id) ON DELETE CASCADE,\n  tag_id  BIGINT REFERENCES tags(id),\n  PRIMARY KEY (post_id, tag_id)\n);\nCREATE INDEX idx_post_tags_tag_id ON post_tags(tag_id);\n\n-- 検索 (高速、明確)\nSELECT p.* FROM posts p\n  JOIN post_tags pt ON pt.post_id = p.id\n  JOIN tags t ON t.id = pt.tag_id\nWHERE t.name = 'rails';\n\n-- 配列が OK な例外\n-- 固定の小さい順序付きリスト (Roles: ['admin', 'editor'])\nALTER TABLE users ADD COLUMN roles TEXT[];\n-- ※ 値の集合が小さく、FK 関係がない場合のみ",
            language: "sql",
          },
          {
            heading: "7.3 巨大 JSONB / すべて JSON で済ます",
            body: "JSONB は強力だが『何でも JSON に詰める』のは別のアンチパターン。型保証・JOIN・INDEX・集計の全てが弱くなる。**頻繁にクエリする属性は通常カラムに、ネスト構造や疎な属性だけ JSONB に**。",
            code: "-- ❌ 全部 JSONB\nCREATE TABLE users (\n  id BIGINT PRIMARY KEY,\n  data JSONB NOT NULL                    -- {name, email, age, address, ...全部}\n);\n-- 検索: WHERE data->>'email' = 'a@x' は遅い (GIN index でも限界)\n-- 制約: メールユニーク? NULL? 型? 全てアプリ任せ\n-- JOIN: data->>'org_id' での結合は遅い + 型変換が必要\n\n-- ✅ 通常カラム + JSONB の役割分担\nCREATE TABLE users (\n  id BIGINT PRIMARY KEY,\n  email TEXT UNIQUE NOT NULL,            -- 頻出 + 制約あり → 通常カラム\n  name TEXT NOT NULL,\n  age INT,\n  org_id BIGINT REFERENCES organizations(id),\n\n  -- 疎な / 構造化された設定 (頻繁にクエリしない)\n  preferences JSONB NOT NULL DEFAULT '{}'::jsonb,\n  --   { 'theme': 'dark', 'notifications': { 'email': true, 'slack': false } }\n\n  -- 動的な属性 (商品の独自属性等、サブタイプ別テーブルが大袈裟な時)\n  metadata JSONB NOT NULL DEFAULT '{}'::jsonb\n);\nCREATE INDEX idx_users_prefs ON users USING GIN (preferences);\n\n-- JSONB のクエリ\nSELECT * FROM users WHERE preferences @> '{\"theme\":\"dark\"}';\nSELECT * FROM users WHERE preferences->'notifications'->>'email' = 'true';\n\n-- 頻繁にクエリする属性は通常カラムに昇格\n-- preferences->>'theme' を多用 → users.theme カラムに移行",
            language: "sql",
          },
          {
            heading: "7.4 N+1 を呼ぶ設計",
            body: "DB 設計レベルで N+1 を誘発するパターン: (1) カウントを毎回 SELECT させる (counter_cache なし)、(2) 過剰な polymorphic で eager load 困難、(3) 中間集計を毎回計算 (マテリアライズドビューが向く場面)。設計時に『この情報、N 回 SELECT されない?』をチェック。",
            code: "-- ❌ users.posts_count をリアルタイム計算\n-- 一覧表示で users.each { |u| u.posts.count } → N+1\n\n-- ✅ counter_cache\nALTER TABLE users ADD COLUMN posts_count INT NOT NULL DEFAULT 0;\n\n-- Rails\nclass Post < ApplicationRecord\n  belongs_to :user, counter_cache: true   -- users.posts_count を自動更新\nend\n\n-- 整合性チェック (定期 batch)\nUser.find_each do |u|\n  expected = u.posts.count\n  u.update_columns(posts_count: expected) if u.posts_count != expected\nend\n\n-- ❌ 過剰 polymorphic\nclass Notification < ApplicationRecord\n  belongs_to :notifiable, polymorphic: true  # Post, Comment, Photo, Video, Tag, ...\nend\n-- 一覧で includes(:notifiable) しても N+1 (各 type ごとに別クエリ)\n\n-- ✅ 専用テーブル + 限定的な polymorphic\nclass PostNotification < ApplicationRecord; belongs_to :post; end\nclass CommentNotification < ApplicationRecord; belongs_to :comment; end\n-- 必要な分だけ FK 付きで\n\n-- ❌ 中間集計を毎回\nSELECT user_id, COUNT(*) FROM orders WHERE created_at > NOW() - INTERVAL '30 days' GROUP BY user_id;\n-- リクエスト毎に走らせると遅い\n\n-- ✅ マテリアライズドビュー (PostgreSQL)\nCREATE MATERIALIZED VIEW user_monthly_orders AS\nSELECT user_id, COUNT(*) AS order_count\nFROM orders\nWHERE created_at > NOW() - INTERVAL '30 days'\nGROUP BY user_id;\nCREATE INDEX ON user_monthly_orders(user_id);\n\n-- 定期リフレッシュ (sidekiq scheduled / cron)\nREFRESH MATERIALIZED VIEW CONCURRENTLY user_monthly_orders;",
            language: "sql",
            notes: [
              "Rails の bullet gem を開発環境に入れて N+1 を自動検出",
              "本番では Skylight / New Relic 等で重いクエリを継続監視",
            ],
          },
        ],
        keyTakeaways: [
          "EAV / カンマ区切り / 配列カラム / 巨大 JSONB は『最初は便利、後で苦しむ』 — 中間テーブル / 通常カラムに昇格",
          "JSONB は『頻繁にクエリしない疎な属性』に限定、頻出は通常カラムに",
          "DB 設計時に counter_cache / マテリアライズドビュー で N+1 を誘発しないように",
          "bullet gem / Skylight で N+1 を継続検知",
        ],
        comprehensionQuestionIds: ["db-015"],
      },
    ],
  },
];

export const findGuide = (id: string) => guides.find((g) => g.id === id);

export const guidesByTrack = (trackId: TrackId) =>
  guides.filter((g) => g.trackId === trackId);
