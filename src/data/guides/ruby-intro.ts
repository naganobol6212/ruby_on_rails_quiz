import type { Guide } from "./types";

export const rubyIntroGuide: Guide = {
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
};
