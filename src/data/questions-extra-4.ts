import type { Question } from "@/lib/types";

/**
 * 既存 3 ティア (beginner / intermediate / advanced) の拡充パック。
 *
 * 方針:
 * - 王道トピックで実務で頻出する判断軸を問う
 * - 各問に choiceExplanations / 3 段階 hints / 公式 references を必ず含める
 * - シリアスな技術コアを淡々と問う (シナリオ語りは最小限)
 *
 * ID 規則: xt-{prefix}-{連番}
 */

export const extraQuestions4: Question[] = [
  // ===========================================================================
  // Ruby 全般 (6 問)
  // ===========================================================================
  {
    id: "xt-rb-001",
    categoryId: "ruby-basics",
    difficulty: "beginner",
    type: "choice",
    question:
      "`nil?` / `empty?` / `blank?` / `present?` の関係として正しいのは？",
    choices: [
      "`nil?` は Ruby 標準、 `empty?` も Ruby 標準だが文字列・配列・ハッシュ等のみ、 `blank?` / `present?` は Rails (ActiveSupport) 拡張で nil も空文字も空白文字も『空』 と判定する",
      "全て Ruby 標準。 `nil?` と `blank?` は同義",
      "`empty?` は nil に対しても呼び出せて nil なら true を返す",
      "`present?` は `!nil?` と同じ意味",
    ],
    answerIndex: 0,
    choiceExplanations: [
      "正解。 nil? は Object クラスのメソッド、 empty? は各クラス (String, Array, Hash 等) が個別に定義。 blank? / present? は Rails が Object 全般に生やす拡張で、 nil・false・空文字 (空白のみも含む)・空配列・空ハッシュ をすべて『blank』 と扱う。",
      "不正解。 blank? は Rails 拡張で、 nil? とは判定範囲が違う ('' や ' ' は nil? では false、 blank? では true)。",
      "不正解。 nil に対して empty? を呼ぶと NoMethodError。 nil をハンドルしたいなら blank? か `&.empty?`。",
      "不正解。 present? は `!blank?`。 単に `!nil?` ではなく、 空文字や空配列も false 扱いになる。",
    ],
    hints: [
      "nil? は全 Object の標準メソッド。 empty? は『中身』 を持てるオブジェクトのみ。",
      "blank? / present? は Rails (ActiveSupport) が追加する。",
      "`'   '.blank?` の結果を考えてみる。",
    ],
    explanation: {
      summary:
        "nil? と empty? は Ruby 標準だが対象範囲が違う。 blank? / present? は Rails 拡張で nil・空文字・空白・空配列をまとめて『空』 として扱える便利メソッド。",
      reason:
        "Ruby 標準の `nil?` は『そのオブジェクトが nil か』 を返すだけで、 `''` や `[]` には false を返す。 `empty?` は String / Array / Hash 等が個別に実装するメソッドで、 nil に呼ぶと NoMethodError。 Rails の ActiveSupport は Object に `blank?` を生やし、 nil / false / `''` / `'   '` (whitespace のみ) / `[]` / `{}` をすべて true 扱いにする。 `present?` はその逆 (`!blank?`)。 Rails アプリでは入力チェックで `params[:name].blank?` のように使うのが定石。",
      codeExample:
        "# Ruby 標準\nnil.nil?        # => true\n\"\".nil?         # => false\n\"\".empty?       # => true\nnil.empty?      # => NoMethodError\n\n# Rails (ActiveSupport)\nnil.blank?      # => true\n\"\".blank?       # => true\n\"   \".blank?    # => true   ← 空白のみも空扱い\n[].blank?       # => true\n{}.blank?       # => true\n\"hello\".blank?  # => false\n\n# present? は !blank?\n\"hello\".present? # => true\n\"\".present?     # => false",
      commonMistakes: [
        "API レスポンス 等で nil 来る可能性があるのに `params[:name].empty?` と書いて NoMethodError",
        "blank? と nil? を混同し、 空文字を許可してしまうバリデーション",
        "Ruby 標準スクリプト (Rails 外) で blank? を呼んで NoMethodError",
      ],
      references: [
        {
          label: "Rails API: Object#blank?",
          url: "https://api.rubyonrails.org/classes/Object.html#method-i-blank-3F",
        },
        {
          label: "Ruby: NilClass#nil?",
          url: "https://docs.ruby-lang.org/ja/latest/method/NilClass/i/nil=3f.html",
        },
      ],
    },
  },

  {
    id: "xt-col-001",
    categoryId: "collections",
    difficulty: "beginner",
    type: "choice",
    question:
      "次のコードの結果として正しいのは？\n\n```ruby\nnums = [1, 2, 3]\nresult = nums.each { |n| n * 2 }\n```",
    choices: [
      "`result` は `[1, 2, 3]` (元の配列がそのまま返る)",
      "`result` は `[2, 4, 6]` (倍にした新しい配列)",
      "`result` は `nil`",
      "`result` は `6` (最後の評価値)",
    ],
    answerIndex: 0,
    choiceExplanations: [
      "正解。 `each` はブロックの戻り値を集めず、 レシーバ (元の配列) をそのまま返す。 変換した新しい配列がほしいなら `map` を使う。",
      "不正解。 `[2, 4, 6]` を得たいなら `nums.map { |n| n * 2 }` を使う。 each はあくまで反復のためのメソッド。",
      "不正解。 each は nil ではなく レシーバ自身を返す。",
      "不正解。 ブロックの戻り値 (n * 2 の最後) ではなく、 each はレシーバを返す。",
    ],
    hints: [
      "each は『副作用のための反復』 で、 戻り値は重要視されない設計。",
      "新しい配列がほしい時のメソッドは何？",
      "`each` の戻り値はレシーバ (self)。",
    ],
    explanation: {
      summary:
        "`each` はレシーバを返す。 ブロックの戻り値を集めて新しい配列にしたいなら `map` を使う。",
      reason:
        "Ruby の `each` は『要素を順に処理する』 のが目的で、 戻り値はメソッドチェーン用にレシーバを返す仕様。 ブロックの中で `n * 2` を評価しても、 その値は捨てられる。 対して `map` (= collect) はブロックの戻り値を集めた新しい配列を返す。 この違いを理解していないと『each で変換したつもりが元のまま』 というバグを生む。",
      codeExample:
        "nums = [1, 2, 3]\n\n# each — 副作用のための反復、 戻り値はレシーバ\nnums.each { |n| n * 2 }       # => [1, 2, 3]\nnums.each { |n| puts n }      # => [1, 2, 3] (出力はする)\n\n# map — 変換した新しい配列を返す\nnums.map { |n| n * 2 }        # => [2, 4, 6]\nnums                          # => [1, 2, 3] (非破壊)\n\n# map! — 破壊的に元の配列を書き換える\nnums.map! { |n| n * 2 }       # => [2, 4, 6]\nnums                          # => [2, 4, 6]",
      commonMistakes: [
        "each でブロック内で変換したつもりが、 戻り値が変わらず混乱する",
        "map! と map の違いを知らず、 意図せず元の配列を破壊する",
        "副作用 (puts や DB 更新) のためなのに map を使い、 不要な配列を生成する",
      ],
      references: [
        {
          label: "Ruby: Array#each",
          url: "https://docs.ruby-lang.org/ja/latest/method/Array/i/each.html",
        },
        {
          label: "Ruby: Array#map",
          url: "https://docs.ruby-lang.org/ja/latest/method/Array/i/collect.html",
        },
      ],
    },
  },

  {
    id: "xt-col-002",
    categoryId: "collections",
    difficulty: "intermediate",
    type: "choice",
    question:
      "次のコードの出力は？\n\n```ruby\nresult = [1, 2, 3, 4].inject(10) { |acc, n| acc + n }\nputs result\n```",
    choices: ["20", "10", "24", "エラー"],
    answerIndex: 0,
    choiceExplanations: [
      "正解。 `inject(初期値)` は初期値からスタートして、 各要素について `acc + n` を計算。 10 + 1 + 2 + 3 + 4 = 20。",
      "不正解。 10 は初期値で、 そこから累積する。 加算は実行される。",
      "不正解。 24 は初期値なしの `inject(:+)` の結果 (1+2+3+4=10 ではないので注意、 1+2+3+4=10、 24 にもならない)。",
      "不正解。 構文も型も問題ない。 acc / n はそれぞれ累積値と現要素を受け取る。",
    ],
    hints: [
      "inject(初期値) は初期値を最初の acc に入れて反復する。",
      "ブロック最後の式の値が次の acc になる。",
      "最終的に acc が返る。",
    ],
    explanation: {
      summary:
        "`inject` (= reduce) は累積処理。 引数に渡した初期値を最初の acc とし、 各要素について計算した値が次の acc になる。",
      reason:
        "`inject(初期値) { |acc, n| ... }` は、 acc = 初期値 から始まり、 各要素 n について ブロックを評価し、 その戻り値を次の acc にする。 全要素を消化したら最後の acc を返す。 引数なし `inject` は最初の要素を初期値に使う (空配列だと nil)。 シンボル引数 `inject(:+)` は `inject { |a,n| a.send(:+, n) }` の省略形。",
      codeExample:
        "# 初期値あり\n[1, 2, 3, 4].inject(10) { |acc, n| acc + n }  # => 20\n\n# 初期値なし — 最初の要素が初期値\n[1, 2, 3, 4].inject { |acc, n| acc + n }      # => 10\n\n# シンボル省略形\n[1, 2, 3, 4].inject(:+)                       # => 10\n[1, 2, 3, 4].inject(100, :+)                  # => 110\n\n# 空配列の罠\n[].inject(:+)                                  # => nil (初期値なし)\n[].inject(0, :+)                              # => 0  (初期値あり)\n\n# Hash を累積結果として使う典型例\n[\"a\", \"b\", \"a\", \"c\"].inject(Hash.new(0)) do |h, w|\n  h[w] += 1\n  h\nend\n# => {\"a\"=>2, \"b\"=>1, \"c\"=>1}",
      commonMistakes: [
        "ブロック内で `h[w] += 1` だけ書いて Hash を返し忘れる (Integer を返すと次の acc が Integer になり TypeError)",
        "空配列で初期値なしを呼び、 nil が返って NoMethodError が後段で発生",
        "破壊的に acc を変更したのに値も返さず、 結果が壊れる",
      ],
      references: [
        {
          label: "Ruby: Enumerable#inject",
          url: "https://docs.ruby-lang.org/ja/latest/method/Enumerable/i/inject.html",
        },
      ],
    },
  },

  {
    id: "xt-oop-001",
    categoryId: "ruby-oop",
    difficulty: "intermediate",
    type: "choice",
    question: "`include` / `extend` / `prepend` の違いとして正しいのは？",
    choices: [
      "`include` はインスタンスメソッドとしてミックスイン、 `extend` はクラスメソッド (特異メソッド) としてミックスイン、 `prepend` はインスタンスメソッドだが探索順がそのクラス自身より前になる",
      "全て同じ意味で、 書き方の好みで使い分ける",
      "`include` はモジュール、 `extend` はクラス、 `prepend` は親クラスをミックスインする",
      "`prepend` は Ruby 1.8 以前のレガシー機能で現在は非推奨",
    ],
    answerIndex: 0,
    choiceExplanations: [
      "正解。 ancestors で確認できる探索順は、 prepend → 自分自身 → include → 親クラス、 となる。 extend は特定オブジェクト (クラスをオブジェクトと見れば クラスメソッド) に特異メソッドを生やす。",
      "不正解。 メソッド探索順 (ancestors) と、 インスタンス/クラスのどちら側に生えるかが根本的に異なる。",
      "不正解。 全てモジュールをミックスインする機能。 対象 (instance / class) と探索順が違う。",
      "不正解。 prepend は Ruby 2.0 で追加。 既存メソッドのフックを後付けする手段として現役。",
    ],
    hints: [
      "ancestors で MRO (メソッド探索順) を確認するとイメージしやすい。",
      "extend は『そのオブジェクトに特異メソッドを生やす』 と考える。",
      "prepend は『元のメソッドより先に呼ばれる』 — alias_method_chain の後継。",
    ],
    explanation: {
      summary:
        "include = インスタンスメソッドとして混入。 extend = レシーバオブジェクトの特異メソッドとして混入 (クラスに extend するとクラスメソッドになる)。 prepend = include と同じだが MRO で自分より前に挿入されるので、 元メソッドをラップできる。",
      reason:
        "メソッド探索 (Method Resolution Order, MRO) を考えると違いが鮮明になる。 例えば `class Foo; include M; end` の ancestors は `[Foo, M, Object, ...]` で、 同名メソッドは Foo が優先される。 `prepend M` だと `[M, Foo, Object, ...]` で M が優先されるため、 既存メソッドの前にフックを挟める (alias_method_chain の後継パターン)。 `extend` は特異クラスへの include で、 クラスに対して使えば クラスメソッドが生え、 個別インスタンスに対して使えばそのインスタンスだけが持つメソッドになる。",
      codeExample:
        "module M\n  def hello = \"M#hello\"\nend\n\n# include — インスタンスメソッドとして混入\nclass Foo\n  include M\nend\nFoo.new.hello  # => \"M#hello\"\nFoo.ancestors  # => [Foo, M, Object, ...]\n\n# extend — クラスメソッドとして混入 (= 特異クラスへの include)\nclass Bar\n  extend M\nend\nBar.hello      # => \"M#hello\"\n# Bar.new.hello # => NoMethodError\n\n# prepend — MRO で自分より前\nclass Baz\n  prepend M\n  def hello = \"Baz#hello\"\nend\nBaz.new.hello  # => \"M#hello\"  ← M が先に解決される\nBaz.ancestors  # => [M, Baz, Object, ...]\n\n# prepend の実用 — 既存メソッドのラップ (例: instrumentation)\nmodule LogAround\n  def call(*args)\n    Rails.logger.info(\"start\")\n    super\n    Rails.logger.info(\"end\")\n  end\nend\nMyService.prepend(LogAround)",
      commonMistakes: [
        "extend で混入したメソッドをインスタンスから呼ぼうとして NoMethodError",
        "alias_method_chain (Rails 5 で削除) の代替を知らず、 ad-hoc に override してしまう",
        "include したつもりが extend で書いていて、 期待した場所にメソッドが生えない",
      ],
      references: [
        {
          label: "Ruby: Module#include",
          url: "https://docs.ruby-lang.org/ja/latest/method/Module/i/include.html",
        },
        {
          label: "Ruby: Module#prepend",
          url: "https://docs.ruby-lang.org/ja/latest/method/Module/i/prepend.html",
        },
      ],
    },
  },

  {
    id: "xt-oop-002",
    categoryId: "ruby-oop",
    difficulty: "advanced",
    type: "choice",
    question:
      "`method_missing` で動的にメソッド呼び出しを処理するクラスを書く時、 ペアで実装すべきメソッドとその理由は？",
    choices: [
      "`respond_to_missing?` を必ずペアで実装する。 さもないと `respond_to?` が false を返し、 duck typing や `Object#methods`、 シリアライズ系ライブラリで誤動作する",
      "`method_added` を実装する。 method_missing で受けたメソッドを動的に定義するため",
      "ペアで実装すべきメソッドはない。 method_missing 単体で完結する",
      "`initialize` を必ず override する。 method_missing は親クラスの初期化を妨げるため",
    ],
    answerIndex: 0,
    choiceExplanations: [
      "正解。 method_missing だけ実装すると、 `obj.respond_to?(:foo)` は false を返してしまう。 これに頼っている標準ライブラリやサードパーティ (例: JSON シリアライザ、 ActiveModel) が誤動作する。 必ず respond_to_missing? もペアで実装する。",
      "不正解。 method_added は『メソッドが定義された時に呼ばれるフック』 で、 method_missing とは目的が違う。",
      "不正解。 respond_to_missing? を実装しないと、 多くのライブラリ (特に Rails 内部) が duck typing で false を見て分岐し、 期待しない挙動になる。",
      "不正解。 initialize の override は method_missing と無関係。",
    ],
    hints: [
      "`respond_to?` のデフォルト実装は、 実際に定義されたメソッドしか見ない。",
      "method_missing で受ける動的メソッドは『そこにあると装っている』 だけ。 装うなら respond_to? でも装う必要がある。",
      "Ruby が用意したフックの名前は `respond_to_missing?`。",
    ],
    explanation: {
      summary:
        "method_missing と respond_to_missing? はセットで実装する。 後者を忘れると `respond_to?` が false を返し、 duck typing に基づく挙動が壊れる。",
      reason:
        "Ruby の `respond_to?(:foo)` は、 デフォルトでは『定義されているメソッド』 だけを見て判定する。 method_missing で動的に処理しているメソッドは、 実体としては定義されていないため、 respond_to? は false を返す。 これでは『そのメソッドがあるかチェックして呼ぶ』 タイプのライブラリ (ActiveModel の属性アクセス、 to_json 系、 RSpec の `have_attributes` 等) が誤判定する。 Ruby はこれを補正するための公式フックとして `respond_to_missing?(name, include_private)` を用意している。 method_missing で扱える名前については、 ここでも true を返すように書くのが約束事。",
      codeExample:
        "# 良い例 — ペアで実装\nclass Proxy\n  def initialize(target)\n    @target = target\n  end\n\n  def method_missing(name, *args, **kwargs, &block)\n    if @target.respond_to?(name)\n      @target.public_send(name, *args, **kwargs, &block)\n    else\n      super\n    end\n  end\n\n  def respond_to_missing?(name, include_private = false)\n    @target.respond_to?(name, include_private) || super\n  end\nend\n\np = Proxy.new(\"hello\")\np.upcase                    # => \"HELLO\"\np.respond_to?(:upcase)      # => true   ← respond_to_missing? のおかげ\n\n# 悪い例 — respond_to_missing? なし\nclass BadProxy\n  def method_missing(name, *args)\n    \"called #{name}\"\n  end\nend\nBadProxy.new.foo                # => \"called foo\"\nBadProxy.new.respond_to?(:foo)  # => false  ← duck typing 壊れる",
      commonMistakes: [
        "method_missing は実装したが respond_to_missing? を忘れ、 JSON.dump や ActiveModel が壊れる",
        "method_missing の super を呼び忘れ、 想定外のメソッド名で NoMethodError ではなく予期せぬ動作になる",
        "method_missing で全てを処理してしまい、 typo の検出が遅れる",
      ],
      references: [
        {
          label: "Ruby: BasicObject#method_missing",
          url: "https://docs.ruby-lang.org/ja/latest/method/BasicObject/i/method_missing.html",
        },
        {
          label: "Ruby: Object#respond_to_missing?",
          url: "https://docs.ruby-lang.org/ja/latest/method/Object/i/respond_to_missing=3f.html",
        },
      ],
    },
  },

  {
    id: "xt-adv-001",
    categoryId: "ruby-advanced",
    difficulty: "advanced",
    type: "choice",
    question:
      "巨大なログファイル (10GB) から特定パターンの行を 100 件だけ抽出したい。 Ruby で最も適切なのは？",
    choices: [
      "`File.foreach` で 1 行ずつ読み、 `.lazy` を使って `select` → `first(100)` で評価を打ち切る",
      "`File.read` で全行をメモリに載せ、 `.select` してから `.first(100)`",
      "`File.readlines` で全行を配列化し、 `map` で処理",
      "shell の `grep | head -100` を `system` で実行する以外に Ruby で書く方法はない",
    ],
    answerIndex: 0,
    choiceExplanations: [
      "正解。 `File.foreach` は遅延的に 1 行ずつ読み、 `.lazy` で Enumerator を遅延化することで、 100 件揃った時点で残りのファイルを読まずに済む。 メモリ使用量は一定 (定数オーダー)。",
      "不正解。 10GB を File.read すると一気にメモリに載り OOM (Out of Memory) で落ちる。",
      "不正解。 readlines も全行を一気に配列化するので同様に OOM。",
      "不正解。 shell コマンドに頼らずとも `File.foreach.lazy` で同じ効率が出せる。 ポータビリティの面でも Ruby 内で完結する方が良い。",
    ],
    hints: [
      "10GB を一度にメモリに載せたらどうなるか考える。",
      "Ruby の Enumerator には『遅延評価』 のしくみがある。",
      "100 件揃ったら残りを読まずに止めたい。",
    ],
    explanation: {
      summary:
        "`File.foreach` + `Enumerator::Lazy` (`.lazy`) で、 ストリーム的に 1 行ずつ処理しつつ、 必要な件数が揃ったら評価を打ち切れる。 メモリ使用量はファイルサイズに依存しない。",
      reason:
        "通常の Enumerator は『全要素に対して操作 → 次のメソッドに配列で渡す』 ので、 大きな入力では全行を中間配列に持ってしまう。 `.lazy` を挟むと、 各要素について end-to-end でパイプライン処理し、 必要な分だけ評価する。 `first(100)` で 100 個揃ったら以降の行は読まれない。 File.foreach は元々ストリーミング読み込みなので、 メモリ使用量は (行の最大長 + バッファ) 程度に保たれる。 10GB ファイルでも 数十 MB で完走する。",
      codeExample:
        "# OK — ストリーミング + 遅延評価\nresults = File.foreach(\"huge.log\")\n               .lazy\n               .select { |line| line.include?(\"ERROR\") }\n               .first(100)\n# メモリ: 一定 (数十 MB), 全行は読まない\n\n# NG — 全行メモリに載せる\nresults = File.read(\"huge.log\")\n              .lines\n              .select { |line| line.include?(\"ERROR\") }\n              .first(100)\n# 10GB ファイルで OOM\n\n# NG — readlines も同様\nresults = File.readlines(\"huge.log\").select { ... }.first(100)\n\n# 応用: 変換 + filter を組み合わせても遅延される\n(1..Float::INFINITY).lazy\n                    .map { |n| n * 2 }\n                    .select { |n| n % 3 == 0 }\n                    .first(5)\n# => [6, 12, 18, 24, 30]",
      commonMistakes: [
        "`.lazy` を付けても最後に `.to_a` してしまい、 全件評価されて意味がなくなる",
        "`File.read` を本番のログ調査で叩いて OOM",
        "lazy の途中で `each` を使うと評価が確定するため、 `force` や `first(n)` で確定させる必要があることを知らない",
      ],
      references: [
        {
          label: "Ruby: Enumerator::Lazy",
          url: "https://docs.ruby-lang.org/ja/latest/class/Enumerator=3a=3aLazy.html",
        },
        {
          label: "Ruby: IO.foreach",
          url: "https://docs.ruby-lang.org/ja/latest/method/IO/s/foreach.html",
        },
      ],
    },
  },

  // ===========================================================================
  // Rails 系 (10 問)
  // ===========================================================================
  {
    id: "xt-ar-001",
    categoryId: "active-record",
    difficulty: "intermediate",
    type: "choice",
    question:
      "`find` / `find_by` / `where(...).first` の挙動の違いとして正しいのは？",
    choices: [
      "`find` は見つからない時 ActiveRecord::RecordNotFound を raise、 `find_by` と `where(...).first` は nil を返す。 性能は find / find_by が LIMIT 1 込みの 1 SQL、 where(...).first は条件次第で同等",
      "全て同じ挙動で、 書き方の好みで使い分ける",
      "`find_by` は配列を返す。 単体取得には不向き",
      "`find` は nil を返し、 `find_by` は例外を投げる",
    ],
    answerIndex: 0,
    choiceExplanations: [
      "正解。 find は primary key で引いて見つからなければ RecordNotFound を投げる (Rails の rescue_from で 404 にハンドリングしやすい)。 find_by(条件) は任意属性での検索で、 ヒットしなければ nil。 where(条件).first は ActiveRecord::Relation を介して LIMIT 1 を付ける。",
      "不正解。 例外を投げるか nil を返すかで明確に差がある。 これを混同するとエラーハンドリングが破綻する。",
      "不正解。 find_by は単体 (or nil) を返す。 配列を返すのは where や find_all。",
      "不正解。 逆。 find が例外、 find_by が nil。",
    ],
    hints: [
      "Rails の慣習では、 詳細ページの URL に対応する取得には find を使う (見つからなければ 404)。",
      "ユーザー入力で『あるかも知れない / ないかも知れない』 取得は find_by。",
      "Bang (!) 系もあるか考えてみる — find_by! は例外を投げる。",
    ],
    explanation: {
      summary:
        "`find` は PK で引く + 見つからなければ例外。 `find_by` は任意属性 + nil。 `where().first` は Relation 経由で LIMIT 1。 どれも 1 SQL で完結するが、 ない時の振る舞いが違う。",
      reason:
        "Rails コントローラで `User.find(params[:id])` を使えば、 存在しない id へのアクセスは RecordNotFound として rescue_from で 404 に丸めるパターンが定石。 一方で『メールアドレスがあれば取得、 なければ作成』 のような場面では find_by(email: ...) で nil を見て分岐するのが自然。 where().first は Relation を再利用したい時 (scope と組み合わせ等) に使う。 `find_by!` / `take!` / `first!` の Bang 系は『なければ例外』 を選べる。",
      codeExample:
        "# find — PK 指定、 ない時は例外\nUser.find(1)             # => #<User id: 1, ...> or RecordNotFound\nUser.find([1, 2, 3])     # => [User, User, User] (1 つでも欠けたら例外)\n\n# find_by — 任意条件、 ない時は nil\nUser.find_by(email: \"x@example.com\")   # => User or nil\nUser.find_by!(email: \"x@example.com\")  # => User or RecordNotFound\n\n# where().first — Relation 経由\nUser.where(active: true).where(\"age >= ?\", 20).first  # => User or nil\nUser.where(...).first!                                # => User or RecordNotFound\n\n# 典型的なコントローラ\nclass UsersController < ApplicationController\n  rescue_from ActiveRecord::RecordNotFound, with: :render_404\n\n  def show\n    @user = User.find(params[:id])    # 404 への変換は rescue_from\n  end\nend",
      commonMistakes: [
        "find_by の戻り値を `.email` で叩いて nil の場合に NoMethodError",
        "find を使ったのに rescue_from を設定しておらず、 500 エラーになる",
        "where(...).first をループ内で何度も呼び、 LIMIT 1 だが N+1 化する",
      ],
      references: [
        {
          label: "Rails Guides: Active Record クエリインタフェース — find",
          url: "https://guides.rubyonrails.org/active_record_querying.html#retrieving-a-single-object",
        },
      ],
    },
  },

  {
    id: "xt-ar-002",
    categoryId: "active-record",
    difficulty: "advanced",
    type: "choice",
    question:
      "`update` / `update_all` / `update_columns` の違いとして最も正確なのは？",
    choices: [
      "`update` はバリデーション・コールバック・updated_at すべて実行。 `update_columns` はバリデーション・コールバック・updated_at をすべてスキップして直接 UPDATE。 `update_all` は Relation 全体に対する一括 UPDATE で、 同じくスキップ + インスタンス化しない",
      "全て同じ。 速度の違いだけ",
      "`update_all` はコールバックのみ実行する",
      "`update_columns` はバリデーションを実行し、 update はスキップする",
    ],
    answerIndex: 0,
    choiceExplanations: [
      "正解。 これがハマる定番ポイント。 update は『安全だが遅い』、 update_columns は『速いが整合性に注意』、 update_all は『大量更新向け』 と覚える。 updated_at の挙動の差は監査ログでバグになりやすい。",
      "不正解。 バリデーション・コールバック・updated_at の有無は明確に異なる。",
      "不正解。 update_all はコールバックもバリデーションも実行しない (各レコードをインスタンス化すらしない)。",
      "不正解。 逆。 update がバリデーション実行、 update_columns はスキップする。",
    ],
    hints: [
      "コールバック (before_save 等) と バリデーション (presence: true 等) はどれが走るか？",
      "updated_at が更新されるかどうかを考える。",
      "巨大データの一括更新を『1 SQL で』 やりたい時はどれ？",
    ],
    explanation: {
      summary:
        "`update` = 安全 (バリデーション・コールバック・updated_at 全部)。 `update_columns` = 単一レコード直接 UPDATE (全部スキップ)。 `update_all` = Relation 一括 UPDATE (全部スキップ + インスタンス化なし)。 用途と整合性リスクを意識して使い分ける。",
      reason:
        "`user.update(name: 'x')` は通常の save パスを通り、 バリデーション失敗時は false を返し、 before_save / after_update 等のコールバックが走り、 updated_at が更新される。 `user.update_columns(name: 'x')` は SQL を直接発行し、 すべてのフック・updated_at をバイパスする (パフォーマンス重視やループ脱出に有用だが整合性は自己責任)。 `User.where(active: false).update_all(status: 'archived')` は ActiveRecord::Relation に対する一括更新で、 N レコードを 1 SQL で更新できる代わりにモデルのコールバックは一切走らない。 監査ログ系で updated_at を見ているとここで詰まる。",
      codeExample:
        "# update — フル機能、 1 件ずつ\nuser.update(name: \"new\")\n# SQL: UPDATE users SET name='new', updated_at=NOW() WHERE id=?\n# - validations: 走る\n# - callbacks: 走る (before_save, after_update, ...)\n# - updated_at: 更新される\n# - 戻り値: true / false\n\n# update_columns — スキップして直接 UPDATE\nuser.update_columns(name: \"new\")\n# SQL: UPDATE users SET name='new' WHERE id=?\n# - validations: スキップ\n# - callbacks: スキップ\n# - updated_at: 更新されない (!)\n# - 戻り値: true (or 例外)\n\n# update_all — Relation 全体に一括 UPDATE\nUser.where(active: false).update_all(status: \"archived\")\n# SQL: UPDATE users SET status='archived' WHERE active=false\n# - 各レコードはインスタンス化されない\n# - validations / callbacks: 一切走らない\n# - updated_at: デフォルト更新されない (Rails 6 以降 touch_all で別途)\n# - 戻り値: 影響を受けた行数",
      commonMistakes: [
        "update_columns を多用して updated_at が古いまま、 監査ログや『最近更新したレコード』 機能が壊れる",
        "update_all で大量更新したのに counter_cache や検索インデックス (Searchkick 等) が更新されず整合性が崩れる",
        "ループで `each { |u| u.update(...) }` を書いて N 回 SQL を発行 (update_all なら 1 SQL)",
      ],
      references: [
        {
          label: "Rails API: ActiveRecord::Persistence#update_columns",
          url: "https://api.rubyonrails.org/classes/ActiveRecord/Persistence.html#method-i-update_columns",
        },
        {
          label: "Rails API: ActiveRecord::Relation#update_all",
          url: "https://api.rubyonrails.org/classes/ActiveRecord/Relation.html#method-i-update_all",
        },
      ],
    },
  },

  {
    id: "xt-rt-001",
    categoryId: "routing-controller",
    difficulty: "intermediate",
    type: "choice",
    question:
      "Strong Parameters の `params.require(:user).permit(:name, :email)` で `require` と `permit` がそれぞれ担う役割として正しいのは？",
    choices: [
      "`require` はキーの存在を保証 (なければ ParameterMissing 例外)、 `permit` は許可するキーをホワイトリストで指定 (それ以外は除外)",
      "`require` も `permit` も単なる alias で同じ意味",
      "`require` はバリデーション、 `permit` は型変換",
      "`require` は HTTP 必須パラメータ、 `permit` は CORS の制御",
    ],
    answerIndex: 0,
    choiceExplanations: [
      "正解。 require は『:user キーが params に存在しないと ActionController::ParameterMissing を投げる』 ガード。 permit は『:user の中身のうち、 :name と :email だけを許可、 残りは silently 除外』 ホワイトリスト。 mass assignment 脆弱性 (例: admin: true を勝手に渡される) を防ぐ。",
      "不正解。 require と permit は責務が異なる。 両方揃って Strong Parameters の保護が完成する。",
      "不正解。 バリデーションはモデル側 (validates) の責務。 Strong Parameters はあくまで『受け入れるキー』 の制御。",
      "不正解。 HTTP / CORS の話ではない。",
    ],
    hints: [
      "歴史的背景: Rails 4 で導入された mass assignment 対策の仕組み。",
      "require は『なかったらエラー』、 permit は『あったら通す』。",
      "permit していないキーは silently に落ちる (例外は出ない)。",
    ],
    explanation: {
      summary:
        "`require(:user)` で『:user キー必須』 を保証し、 `permit(:name, :email)` で『この 2 つだけ許可』 する。 mass assignment 脆弱性を防ぐ Rails 標準の仕組み。",
      reason:
        "リクエストパラメータをそのまま `User.new(params[:user])` に渡すと、 攻撃者が `user[admin]=true` を送り込んで権限昇格できてしまう。 これを防ぐため Rails 4 で Strong Parameters が導入された。 `require` でキーの存在を例外で保証し (rescue_from で 400 に変換しやすい)、 `permit` で『どのキーだけを許可するか』 を明示する。 ネストした構造には `permit(profile_attributes: [:bio])` のように記述、 配列を許可するなら `tags: []` を使う。",
      codeExample:
        "class UsersController < ApplicationController\n  def create\n    @user = User.new(user_params)\n    if @user.save\n      redirect_to @user\n    else\n      render :new, status: :unprocessable_entity\n    end\n  end\n\n  private\n\n  def user_params\n    params.require(:user).permit(:name, :email,\n                                  profile_attributes: [:bio, :avatar],\n                                  tag_ids: [])\n  end\nend\n\n# 攻撃シナリオ — admin=true を送られても弾く\n# POST /users\n#   user[name]=alice\n#   user[email]=alice@example.com\n#   user[admin]=true   ← permit 外なので silently 除外\n\n# require が効くケース\n# POST /users (body 空)\n# => ActionController::ParameterMissing: param is missing or the value is empty: user\n\n# rescue_from で 400 に\nclass ApplicationController < ActionController::Base\n  rescue_from ActionController::ParameterMissing do |e|\n    render json: { error: e.message }, status: :bad_request\n  end\nend",
      commonMistakes: [
        "`permit!` (引数なし) で全許可にしてしまい mass assignment 脆弱性",
        "ネスト属性で配列 / Hash を permit 漏れし、 silently 値が落ちて『保存されない』 バグ",
        "API モードで params 形式が違うのに require(:user) で常に 400 が出る",
      ],
      references: [
        {
          label: "Rails Guides: Action Controller — Strong Parameters",
          url: "https://guides.rubyonrails.org/action_controller_overview.html#strong-parameters",
        },
      ],
    },
  },

  {
    id: "xt-rails-001",
    categoryId: "rails-convention",
    difficulty: "intermediate",
    type: "choice",
    question:
      "`ActiveSupport::Concern` を使った Concern モジュールの `included` ブロックの役割として正しいのは？",
    choices: [
      "include されたクラスのコンテキストで実行される。 `has_many` や `validates` などのクラスマクロを呼ぶ場所として使う",
      "include した側のインスタンスメソッドを定義する場所",
      "Concern を using ステートメントで読み込んだ時に走るフック",
      "ActiveSupport::Concern を継承するモジュールしか使えない、 Rails 独自の擬似コンストラクタ",
    ],
    answerIndex: 0,
    choiceExplanations: [
      "正解。 `included do ... end` の中身は『include されたクラス』 のクラスボディとして評価される。 has_many :books や validates :name, presence: true のような『クラスレベル DSL』 を Concern 側に書きたい時に使う。",
      "不正解。 インスタンスメソッドは module 直下に普通に書けば良い。 included はクラス側の DSL 用。",
      "不正解。 using は Refinement の話で別物。 Concern とは無関係。",
      "不正解。 ActiveSupport::Concern を extend したモジュールでのみ included ブロックが使えるのは事実だが、 役割の説明としては不十分。",
    ],
    hints: [
      "Concern を使う前は self.included(base) フックを手書きして base.has_many ... と書いていた。",
      "included ブロックの中で has_many や validates を呼べる。",
      "クラスマクロ (has_many 等) は『クラスボディで実行する』 もの。",
    ],
    explanation: {
      summary:
        "`included do ... end` の中身は include された側のクラスボディとして評価される。 Concern 内に `has_many` や `validates` を書きたい時のための糖衣構文。",
      reason:
        "Ruby 標準では、 モジュールが include された時のフックは `self.included(base)` を定義して `base.has_many :books` のように書く必要がある。 ActiveSupport::Concern はこのボイラープレートを `included do ... end` という DSL で書けるようにしてくれる。 さらに `class_methods do ... end` で extend ClassMethods 相当も書けるため、 Concern モジュールが Rails らしく簡潔になる。 ActiveSupport::Concern は依存解決もしてくれるので、 Concern が他の Concern に依存していても順序を気にしなくて良い。",
      codeExample:
        "# Concern の標準的な書き方\nmodule Trashable\n  extend ActiveSupport::Concern\n\n  included do\n    scope :alive, -> { where(deleted_at: nil) }\n    scope :trashed, -> { where.not(deleted_at: nil) }\n  end\n\n  class_methods do\n    def trash_threshold = 30.days\n  end\n\n  # インスタンスメソッドは普通に\n  def trash!\n    update!(deleted_at: Time.current)\n  end\n\n  def trashed?\n    deleted_at.present?\n  end\nend\n\nclass Post < ApplicationRecord\n  include Trashable\nend\n\nPost.alive          # included の scope が使える\nPost.trash_threshold # class_methods のメソッドが使える\npost.trash!         # インスタンスメソッド\n\n# ActiveSupport::Concern なしだと…\nmodule Trashable\n  def self.included(base)\n    base.scope :alive, -> { where(deleted_at: nil) }\n    base.extend ClassMethods\n  end\n\n  module ClassMethods\n    def trash_threshold = 30.days\n  end\nend\n# Concern を使う方が宣言的で読みやすい",
      commonMistakes: [
        "included ブロックの中で `self` を勘違いし、 module 側のメソッドを呼ぶつもりがクラス側を見る",
        "class_methods do ... end ではなく ClassMethods モジュールを手書きして混在させる",
        "Concern 内で他の Concern に依存する時、 ActiveSupport::Concern の依存解決を知らず順序を気にする",
      ],
      references: [
        {
          label: "Rails API: ActiveSupport::Concern",
          url: "https://api.rubyonrails.org/classes/ActiveSupport/Concern.html",
        },
      ],
    },
  },

  {
    id: "xt-rspec-001",
    categoryId: "rspec",
    difficulty: "beginner",
    type: "choice",
    question: "RSpec の `let` と `let!` の違いとして正しいのは？",
    choices: [
      "`let` は遅延評価 (初回参照時に実行)、 `let!` は each example の前に必ず先行評価される",
      "`let` は同期、 `let!` は非同期",
      "`let!` は読み取り専用変数を作る",
      "違いはなく、 書き方の好みで使い分ける",
    ],
    answerIndex: 0,
    choiceExplanations: [
      "正解。 `let(:user) { create(:user) }` は user を参照するまで作成されない。 `let!` は before(:each) と同等に必ず先行実行される。 『参照しないけど DB に作っておきたい』 ケースで使い分ける。",
      "不正解。 同期 / 非同期の話ではない。",
      "不正解。 let / let! ともに普通の参照を作る。",
      "不正解。 評価タイミングが明確に違い、 テストの可読性 / 速度に影響する。",
    ],
    hints: [
      "let の典型的な目的は『重い setup を必要な時だけ走らせる』。",
      "let! は『before に書くのと同じ』 と覚える。",
      "テストデータが『あるべき』 のか『参照したら作られる』 のかで使い分ける。",
    ],
    explanation: {
      summary:
        "`let` は遅延評価 (例 first call) で、 参照されない example では実行されない。 `let!` は必ず example の前に評価される (= before(:each) 相当)。",
      reason:
        "`let(:foo) { ... }` はメソッド定義に近く、 example の中で `foo` を呼んだ瞬間に評価される。 一度評価された結果は同じ example 内ではメモ化される。 `let!` は『前段で必ず作っておきたい』 ケース用で、 例えば『リストに 3 件あるとき』 のような事前データの用意に向く。 ただし参照されない example でも毎回作るのでテスト速度には影響する。 『たまたま参照しているだけ』 のデータは let、 『シナリオの前提として存在しなければならない』 データは let! で書くと意図が伝わる。",
      codeExample:
        "RSpec.describe Post do\n  let(:user) { create(:user) }        # 参照したら作成\n  let!(:tag) { create(:tag, name: \"news\") }  # before に必ず作成\n\n  it \"は author を持つ\" do\n    post = Post.new(author: user)     # ← ここで user が作成される\n    expect(post.author).to eq user\n  end\n\n  it \"は tag を持たない (が tag は DB にある)\" do\n    expect(Post.count).to eq 0\n    expect(Tag.count).to eq 1         # ← let! のおかげで DB にある\n  end\nend\n\n# 上のスペック実行で:\n# - 1 つ目: User と Tag が作られる\n# - 2 つ目: Tag のみ作られる (User は参照されないので)",
      commonMistakes: [
        "let! を多用してテストが遅くなる (必要なら let で十分なケースまで let!)",
        "let の遅延評価を忘れ、 example の前に副作用が起きる前提でテストを書いてしまう",
        "let のメモ化を信じて『毎回新しいインスタンス』 が欲しいケースで誤動作 (同じ example 内では同じインスタンス)",
      ],
      references: [
        {
          label: "RSpec: let and let!",
          url: "https://rspec.info/documentation/3.12/rspec-core/RSpec/Core/MemoizedHelpers/ClassMethods.html#let-instance_method",
        },
      ],
    },
  },

  {
    id: "xt-rspec-002",
    categoryId: "rspec",
    difficulty: "intermediate",
    type: "choice",
    question:
      "RSpec の `subject` と `is_expected` の使い方として最も適切なのは？",
    choices: [
      "暗黙の subject は `described_class.new` で、 `subject { ... }` で明示できる。 `is_expected.to ...` は `expect(subject).to ...` の糖衣構文で、 1 行 it とよく組み合わせる",
      "subject は describe ブロックでしか使えず、 context では使えない",
      "is_expected は subject を使わなくても、 直前の let を自動的に参照する",
      "subject を定義したら必ず is_expected で呼ばないとエラー",
    ],
    answerIndex: 0,
    choiceExplanations: [
      "正解。 `subject` は『このスペックの主役』 を宣言し、 `is_expected.to be_valid` のように 1 行で表現できる。 暗黙の subject (User の describe なら User.new) もあるが、 引数を渡したいなら明示的に subject { ... } を書く。",
      "不正解。 context でも使える。 階層をネストすれば subject を上書きできる。",
      "不正解。 is_expected は subject を参照する。 let を直接見ない。",
      "不正解。 subject を定義しても、 普通に expect(subject) で書いても良い。 is_expected は単に短く書くための糖衣。",
    ],
    hints: [
      "暗黙の subject = `described_class.new`。",
      "is_expected はテスト名と組み合わせて『何を確認しているか』 が一目で分かる。",
      "1 行 it (`it { is_expected.to ... }`) と相性が良い。",
    ],
    explanation: {
      summary:
        "`subject` で主役を宣言し、 `is_expected.to ...` で `expect(subject).to ...` を 1 行で書ける。 1 行 it と組み合わせると『何を検証しているか』 が DSL として読める。",
      reason:
        "RSpec の subject は『このブロックの主役オブジェクト』 を定義する。 何も書かなければ `described_class.new` が暗黙の subject になるが、 引数を渡したい場合や、 named subject (`subject(:user) { ... }`) で名前を付けたい場合は明示する。 `is_expected` は内部で `expect(subject)` を呼ぶだけのヘルパで、 1 行 it と組み合わせると `it { is_expected.to be_valid }` のように『DSL として読めるテスト』 が書ける。 大量の単純チェックを並べるバリデーション系スペックで特に有効。",
      codeExample:
        "RSpec.describe User do\n  # 暗黙の subject = User.new\n  it { is_expected.to validate_presence_of(:email) }\n\n  # 明示的な subject\n  subject { User.new(name: \"Alice\", email: \"a@example.com\") }\n  it { is_expected.to be_valid }\n  it { is_expected.to have_attributes(name: \"Alice\") }\n\n  # named subject — example の中で名前で参照できる\n  subject(:user) { User.new(name: \"Bob\") }\n  it \"name で名前を返す\" do\n    expect(user.name).to eq \"Bob\"\n  end\n\n  # context でネストして上書き\n  context \"管理者の場合\" do\n    subject { User.new(role: :admin) }\n    it { is_expected.to be_admin }\n  end\nend",
      commonMistakes: [
        "subject 内で `let` の値を上書きしてしまい、 example 間で副作用が出る",
        "named subject を定義しているのに is_expected を使い、 どの主役か曖昧になる",
        "大量に subject を上書きしすぎて、 結局どの subject に対するテストか追えなくなる",
      ],
      references: [
        {
          label: "RSpec: subject",
          url: "https://rspec.info/documentation/3.12/rspec-core/RSpec/Core/MemoizedHelpers/ClassMethods.html#subject-instance_method",
        },
      ],
    },
  },

  {
    id: "xt-logs-001",
    categoryId: "logs",
    difficulty: "intermediate",
    type: "choice",
    question:
      "本番環境で『あるユーザーのリクエストだけ』 を追跡するためにログに識別子を埋め込みたい。 Rails 標準で最も適切な仕組みは？",
    choices: [
      "`Rails.logger.tagged(\"user:#{current_user.id}\")` で囲むか、 ApplicationController で `Rails.application.config.log_tags` に lambda で設定する",
      "全リクエストで `Rails.logger.info \"user_id=...\"` を手書きで埋め込む",
      "Rails 標準ではできず、 サードパーティの APM (Datadog 等) が必須",
      "production.rb の `config.logger = nil` にして自前で書き直す",
    ],
    answerIndex: 0,
    choiceExplanations: [
      "正解。 `ActiveSupport::TaggedLogging` の機能で、 log_tags に lambda を登録すれば全リクエストの全ログ行に自動で `[user:123]` のようなタグが付く。 tagged ブロックを使えば任意のスコープで一時的にタグを追加できる。",
      "不正解。 全ログ行に手書きは現実的でない。 標準の TaggedLogging を使うべき。",
      "不正解。 Rails の TaggedLogging で十分。 APM は別目的 (メトリクス + tracing) で組み合わせると強力だが必須ではない。",
      "不正解。 logger を nil にすると Rails のログ機能が全壊する。",
    ],
    hints: [
      "ActiveSupport::TaggedLogging を調べる。",
      "config.log_tags に lambda を渡せる。",
      "リクエストごとに自動付与か、 ブロックスコープ手動付与か、 2 つのパターンがある。",
    ],
    explanation: {
      summary:
        "Rails 標準の `ActiveSupport::TaggedLogging` を使う。 全リクエスト共通のタグは `config.log_tags = [:uuid, ->(req){ ... }]`、 動的に追加するなら `Rails.logger.tagged(...) { ... }`。",
      reason:
        "Rails のログは標準で TaggedLogging でラップされており、 タグ文字列を行頭に `[tag]` 形式で挿入できる。 config.log_tags は ActionDispatch::Request を受け取る lambda 配列で、 リクエスト全体に渡るタグを定義する (request.uuid, current_user.id 等)。 一方 `Rails.logger.tagged(\"job:#{job_id}\") { ... }` は任意のブロック内のログ全てにタグを付ける。 これにより、 grep やログ集約サービス (CloudWatch, Datadog, Splunk) で『あるユーザーの一連の動き』 を時系列で追える。",
      codeExample:
        "# config/environments/production.rb\nRails.application.config.log_tags = [\n  :uuid,                              # ActionDispatch::Request#uuid\n  ->(req) { req.headers[\"X-Request-Id\"] || \"-\" },\n  ->(req) {\n    if (user_id = req.session[:user_id])\n      \"user:#{user_id}\"\n    else\n      \"guest\"\n    end\n  },\n]\n# 出力例:\n# [b7a1...e3] [-] [user:123] Started GET \"/posts\" for ...\n# [b7a1...e3] [-] [user:123] Processing by PostsController#index\n\n# 任意スコープで一時的に追加\nclass NotificationJob < ApplicationJob\n  def perform(user_id)\n    Rails.logger.tagged(\"job:NotificationJob\", \"user:#{user_id}\") do\n      Rails.logger.info \"送信開始\"\n      # ...\n      Rails.logger.info \"送信完了\"\n    end\n  end\nend",
      commonMistakes: [
        "log_tags に重い処理 (DB アクセス等) を入れて全リクエストで遅延",
        "tagged ブロックの中で例外が起きた時、 タグが解除されないと思い込む (実際は確実に解除される)",
        "current_user を log_tags 内で呼ぼうとして controller context がないため取得できない",
      ],
      references: [
        {
          label: "Rails Guides: Debugging — Tagged Logging",
          url: "https://guides.rubyonrails.org/debugging_rails_applications.html#tagged-logging",
        },
        {
          label: "Rails API: ActiveSupport::TaggedLogging",
          url: "https://api.rubyonrails.org/classes/ActiveSupport/TaggedLogging.html",
        },
      ],
    },
  },

  {
    id: "xt-dbg-001",
    categoryId: "debugging",
    difficulty: "intermediate",
    type: "choice",
    question:
      "Rails 7 以降で標準採用された対話型デバッガ `debug` gem の `binding.break` の説明として正しいのは？",
    choices: [
      "Ruby 3.1+ 標準同梱の `debug` gem を使い、 ブレークしたい行に `binding.break` (alias: `debugger`) を書くと、 そこでプロセスが停止して REPL に入れる。 IDE (VS Code 等) との連携も DAP 経由で標準化されている",
      "byebug gem の別名で、 機能は完全に同じ",
      "本番環境で安全に使えるデバッガで、 リモート接続専用",
      "`puts` の改良版で、 単に値を出力するだけ",
    ],
    answerIndex: 0,
    choiceExplanations: [
      "正解。 Rails 7 の Gemfile デフォルトは `debug` gem。 `binding.break` (= debugger) でブレーク、 next / step / continue / info locals 等のコマンドで操作できる。 DAP 対応で VS Code 等の IDE からも使える。",
      "不正解。 byebug は debug gem に置き換えられた前世代。 機能セットも違う。",
      "不正解。 本番で使うべきではない (プロセスを止める)。 リモート接続機能はあるが本番デバッグ向けではない。",
      "不正解。 puts と違って実行を停止して REPL に入る。",
    ],
    hints: [
      "Rails 7 の標準 Gemfile に何が入っているか確認する。",
      "Ruby 3.1 で標準同梱になった、 byebug の後継。",
      "DAP (Debug Adapter Protocol) 対応で IDE 連携が標準化された。",
    ],
    explanation: {
      summary:
        "Rails 7+ では `debug` gem が標準。 `binding.break` (alias: `debugger`) で停止し REPL に入る。 byebug の後継で、 Ruby 3.1+ 標準同梱、 DAP 対応 IDE と統合できる。",
      reason:
        "Rails 5〜6 では byebug が標準だったが、 Ruby 3.1 で `debug` gem (ruby/debug) が標準ライブラリ化され、 Rails 7 の Gemfile も debug に切り替わった。 主なコマンドは next (n) / step (s) / continue (c) / backtrace (bt) / info locals (i l) / pp 等。 byebug より高速で、 マルチスレッド対応・DAP 対応も入っているのが大きな違い。 開発環境では `binding.break` を仕込んで rails server で起動し、 リクエストがその行に到達すると REPL が開く。 本番で使うのは厳禁 (プロセスが止まる)。",
      codeExample:
        "# Gemfile (Rails 7+)\ngroup :development, :test do\n  gem \"debug\", platforms: %i[mri mingw x64_mingw]\nend\n\n# コントローラに仕込む\nclass UsersController < ApplicationController\n  def show\n    @user = User.find(params[:id])\n    binding.break    # ← ここで停止、 REPL が開く\n    @posts = @user.posts.recent\n  end\nend\n\n# REPL での操作例\n# (rdbg) i l       # ローカル変数一覧\n# (rdbg) pp @user  # オブジェクトを整形表示\n# (rdbg) n         # 次の行に進む\n# (rdbg) s         # ステップイン\n# (rdbg) bt        # スタックトレース\n# (rdbg) c         # 続行\n\n# IDE 連携 (VS Code)\n# rdbg --open でリモート接続させ、 DAP クライアントから接続",
      commonMistakes: [
        "本番に `binding.break` を残してデプロイし、 リクエストでプロセスが停止して全ユーザーがハング",
        "puts デバッグから抜け出せず、 ブレーク後の状態確認・ステップ実行の効率を活かせない",
        "byebug の感覚で書いて Rails 7 でコマンド名が違って戸惑う (基本コマンドは大半同じ)",
      ],
      references: [
        {
          label: "GitHub: ruby/debug",
          url: "https://github.com/ruby/debug",
        },
        {
          label: "Rails Guides: Debugging — debug gem",
          url: "https://guides.rubyonrails.org/debugging_rails_applications.html#debugging-with-the-debug-gem",
        },
      ],
    },
  },

  {
    id: "xt-dbg-002",
    categoryId: "debugging",
    difficulty: "advanced",
    type: "choice",
    question:
      "本番環境で N+1 クエリが疑われる。 bullet gem は development 専用で使えない。 最も効率的な調査手段は？",
    choices: [
      "ActiveSupport::Notifications で `sql.active_record` を購読してリクエストごとに SQL 件数を集計し、 閾値超過時にログ警告 or APM に送る (Datadog/New Relic の APM はこれを標準で見せる)",
      "production ログを全部 grep して目視で SQL を数える",
      "全コントローラに `puts ActiveRecord::Base.connection.exec_query` を仕込む",
      "本番で N+1 を検知する手段はない。 development で再現するしかない",
    ],
    answerIndex: 0,
    choiceExplanations: [
      "正解。 ActiveSupport::Notifications は Rails 内部のイベントを購読する公式機構で、 `sql.active_record` イベントを subscribe すれば全 SQL の発行を捕捉できる。 これをリクエスト単位でカウントし、 閾値 (例: 50 SQL) を超えたら警告ログを出す自前 middleware を書くか、 APM (Datadog/Scout/Skylight) を入れれば自動でハイライトしてくれる。",
      "不正解。 production.log は莫大な量で grep 集計は現実的でない。 集約が必要。",
      "不正解。 puts でログを汚すのは本番ではアンチパターン。 そもそも構造化されていない。",
      "不正解。 ActiveSupport::Notifications を使えば本番でも検知できる。",
    ],
    hints: [
      "Rails 内部のイベントを購読する仕組みは何？",
      "ActiveSupport::Notifications の `sql.active_record` イベント。",
      "APM (Datadog / Scout / Skylight) はこの仕組みを活用している。",
    ],
    explanation: {
      summary:
        "`ActiveSupport::Notifications.subscribe(\"sql.active_record\")` でリクエスト中の SQL を全部観測できる。 リクエスト単位でカウントして閾値超過を warn する middleware を書くか、 APM サービスに任せる。",
      reason:
        "Rails は内部の主要なイベント (sql.active_record, process_action.action_controller, render_template.action_view 等) を ActiveSupport::Notifications で publish している。 これを subscribe するだけで、 全 SQL の発行を捕捉できる。 リクエストの中で同じ SQL (or 同じ query テンプレート) が大量に出ていれば N+1 の強いサイン。 これをリクエスト単位で集計して、 例えば『1 リクエストで 50 SQL 超』 のような閾値を超えたらログに警告を出す中間ウェアを書くのが軽量な解。 商用 APM (Datadog APM, Scout APM, Skylight) はこれを高度に行い、 該当のエンドポイント・SQL を UI で可視化する。",
      codeExample:
        "# config/initializers/sql_count_monitor.rb\nclass SqlCountMonitor\n  THRESHOLD = 50  # 1 リクエスト 50 SQL 超で警告\n\n  def initialize(app)\n    @app = app\n  end\n\n  def call(env)\n    count = 0\n    queries = Hash.new(0)\n    sub = ActiveSupport::Notifications.subscribe(\"sql.active_record\") do |*args|\n      event = ActiveSupport::Notifications::Event.new(*args)\n      next if event.payload[:name] == \"SCHEMA\"  # メタデータは無視\n      count += 1\n      # query 正規化 (?, ?, ? を 1 つにまとめる)\n      key = event.payload[:sql].gsub(/\\d+|'[^']*'/, \"?\")\n      queries[key] += 1\n    end\n\n    status, headers, body = @app.call(env)\n\n    if count > THRESHOLD\n      Rails.logger.warn(\"[SQL_COUNT] #{count} queries: #{env['REQUEST_PATH']}\")\n      queries.select { |_, c| c >= 5 }.each do |sql, c|\n        Rails.logger.warn(\"  x#{c}: #{sql.truncate(200)}\")\n      end\n    end\n\n    [status, headers, body]\n  ensure\n    ActiveSupport::Notifications.unsubscribe(sub) if sub\n  end\nend\n\nRails.application.config.middleware.use SqlCountMonitor",
      commonMistakes: [
        "本番に APM もなく N+1 検知の仕組みも仕込んでおらず、 ユーザーから『遅い』 と言われて初めて気付く",
        "subscribe を ensure で unsubscribe しないとブロックがリークしてメモリリークの原因に",
        "全クエリをログに出してしまい、 ログ量爆発 + 個人情報漏洩リスク",
      ],
      references: [
        {
          label: "Rails Guides: Active Support Instrumentation",
          url: "https://guides.rubyonrails.org/active_support_instrumentation.html",
        },
        {
          label: "Rails API: ActiveSupport::Notifications",
          url: "https://api.rubyonrails.org/classes/ActiveSupport/Notifications.html",
        },
      ],
    },
  },

  {
    id: "xt-sec-001",
    categoryId: "security",
    difficulty: "advanced",
    type: "choice",
    question:
      "Rails 7 の `has_secure_password` がデフォルトで使うパスワードハッシュアルゴリズムと、 その妥当性として正しいのは？",
    choices: [
      "bcrypt を使い、 ストレッチング (cost) は調整可能。 GPU 攻撃に対する耐性のため OWASP は bcrypt / argon2 / scrypt を推奨しており、 一般的な Web アプリでは bcrypt + 適切な cost で十分とされる",
      "MD5 を使う。 速度重視の合理的選択",
      "SHA-256 を 1 回かけるだけで、 ストレッチングなし",
      "平文で DB に保存する。 SSL があるから問題ない",
    ],
    answerIndex: 0,
    choiceExplanations: [
      "正解。 has_secure_password は bcrypt gem に依存し、 cost (デフォルト 12) を調整できる。 bcrypt は意図的に遅く設計されたハッシュ関数で、 GPU・ASIC によるブルートフォース攻撃を抑制する。 OWASP Password Storage Cheat Sheet も bcrypt / argon2id / scrypt / PBKDF2 を推奨。",
      "不正解。 MD5 は壊滅的に脆弱で、 1 秒で数十億ハッシュ計算可能。 パスワード保存に使えば即座にレインボーテーブル攻撃で平文が漏れる。",
      "不正解。 SHA-256 単発はストレッチングがなく、 高速計算が可能なため不適。 SHA 系を使うなら PBKDF2 で大量反復させる必要があるが、 そもそも bcrypt 等の方が安全。",
      "不正解。 SSL は通信路の暗号化であって、 DB に平文保存することの言い訳にはならない。 DB 漏洩時に全アカウントが直ちに侵害される。",
    ],
    hints: [
      "Gemfile に何が追加されるか確認 (bcrypt-ruby)。",
      "ハッシュ関数は『高速』 が美徳ではない。 パスワードでは『遅い』 ことが価値。",
      "OWASP Password Storage Cheat Sheet を覚えておく。",
    ],
    explanation: {
      summary:
        "has_secure_password は bcrypt を使い cost を調整可能。 GPU 攻撃耐性のため bcrypt / argon2 / scrypt のいずれかを使うのが OWASP 推奨。 SHA や MD5 単発はパスワード保存に絶対使ってはいけない。",
      reason:
        "パスワード保存用ハッシュは、 通常のハッシュ関数 (高速性が美徳) とは目的が逆で、 意図的に遅くして総当たりを抑制する設計が必要。 bcrypt は Salt + ストレッチング (cost パラメータ) 込みのハッシュで、 cost 12 ならハッシュ 1 回あたり数十ミリ秒かかる。 これによりオフライン総当たり (GPU で 1 秒あたり数十億回試行) のコストが現実的でなくなる。 Rails の has_secure_password は内部で BCrypt::Password.create / new を呼ぶだけで、 自前実装に比べて圧倒的に安全。 cost はサーバ負荷とトレードオフで、 一般に 12 が現代的なバランス。",
      codeExample:
        "# Gemfile\ngem \"bcrypt\", \"~> 3.1.7\"\n\n# モデル\nclass User < ApplicationRecord\n  has_secure_password\nend\n\n# DB に password_digest カラムが必要\nadd_column :users, :password_digest, :string, null: false\n\n# 使い方\nuser = User.new(email: \"a@example.com\", password: \"secret\", password_confirmation: \"secret\")\nuser.save\nuser.password_digest  # => \"$2a$12$xxxxxxxx....\" (bcrypt 形式)\n\nuser.authenticate(\"secret\")        # => user (成功)\nuser.authenticate(\"wrong\")         # => false\n\n# cost を変える (テストで速くしたい等)\n# config/environments/test.rb\nconfig.after_initialize do\n  BCrypt::Engine.cost = BCrypt::Engine::MIN_COST  # 4\nend\n\n# やってはいけないアンチパターン\n# Digest::SHA256.hexdigest(password)     # 高速すぎて総当たりされる\n# Digest::MD5.hexdigest(password)        # 論外\n# user.password = password               # 平文保存は論外",
      commonMistakes: [
        "test 環境で cost を下げ忘れて全テストが激遅",
        "自前で Digest::SHA256 を使った『独自実装』 を本番に投入する",
        "password_digest を直接 update_columns で書き換えてしまい、 bcrypt 形式でない値が入る",
        "アプリの外で bcrypt 形式以外で生成したハッシュをそのまま保存して authenticate が機能しない",
      ],
      references: [
        {
          label: "Rails API: has_secure_password",
          url: "https://api.rubyonrails.org/classes/ActiveModel/SecurePassword/ClassMethods.html",
        },
        {
          label: "OWASP: Password Storage Cheat Sheet",
          url: "https://cheatsheetseries.owasp.org/cheatsheets/Password_Storage_Cheat_Sheet.html",
        },
      ],
    },
  },

  // ===========================================================================
  // SQL / DB 設計 (5 問)
  // ===========================================================================
  {
    id: "xt-sql-001",
    categoryId: "sql-basics",
    difficulty: "beginner",
    type: "choice",
    question: "`WHERE` と `HAVING` の違いとして正しいのは？",
    choices: [
      "WHERE は GROUP BY の前 (生行) に絞り込み、 HAVING は GROUP BY の後 (集計結果) に絞り込む。 集計関数 (COUNT, SUM 等) は HAVING でしか使えない",
      "WHERE は SELECT、 HAVING は UPDATE で使う",
      "WHERE は 1 つのテーブル、 HAVING は JOIN したテーブルで使う",
      "全く同じで、 書き方の好みで使い分ける",
    ],
    answerIndex: 0,
    choiceExplanations: [
      "正解。 SQL の論理処理順序は FROM → WHERE → GROUP BY → HAVING → SELECT → ORDER BY。 つまり WHERE で先に行を絞ってから集計し、 HAVING で集計後の結果を絞る。 そのため COUNT(*) > 5 のような集計条件は HAVING でしか書けない。",
      "不正解。 両方とも SELECT (SUBQUERY 含む) で使う。 UPDATE / DELETE では WHERE のみ。",
      "不正解。 テーブル数とは無関係。",
      "不正解。 評価タイミングが違うので、 書き換え可能とは限らない。 集計関数を WHERE に書くとエラー。",
    ],
    hints: [
      "SQL の論理処理順序を思い出す。 SELECT より前に WHERE と HAVING がある。",
      "COUNT(*) > 5 のような条件はどこに書ける？",
      "GROUP BY を挟むかどうかで使い分ける。",
    ],
    explanation: {
      summary:
        "WHERE = GROUP BY 前の行フィルタ、 HAVING = GROUP BY 後の集計結果フィルタ。 集計関数を使う条件は HAVING に書く。",
      reason:
        "SQL の論理処理順序 (実行順とは別、 意味論的な順序) は FROM → WHERE → GROUP BY → HAVING → SELECT → DISTINCT → ORDER BY → LIMIT。 WHERE は行単位の素のフィルタなので集計関数を参照できない (まだ集計されていない)。 HAVING はグルーピング後の各グループに対する条件で、 SUM / COUNT / AVG 等が使える。 例えば『投稿数が 10 件以上のユーザー』 は WHERE では書けず、 GROUP BY user_id + HAVING COUNT(*) >= 10 で表現する。",
      codeExample:
        "-- 投稿数が 10 件以上のユーザーを取得\nSELECT user_id, COUNT(*) AS post_count\nFROM posts\nWHERE deleted_at IS NULL    -- 生行のフィルタ (集計の前)\nGROUP BY user_id\nHAVING COUNT(*) >= 10        -- 集計結果のフィルタ\nORDER BY post_count DESC;\n\n-- ✗ NG: WHERE に集計関数\nSELECT user_id, COUNT(*) FROM posts\nWHERE COUNT(*) >= 10  -- ERROR: aggregate functions are not allowed in WHERE\nGROUP BY user_id;\n\n-- ✓ サブクエリで同等の書き換えは可能\nSELECT * FROM (\n  SELECT user_id, COUNT(*) AS c FROM posts GROUP BY user_id\n) AS t WHERE c >= 10;",
      commonMistakes: [
        "WHERE に集計関数を書いてエラー、 HAVING に書き換えて解決",
        "HAVING に集計を使わない条件を書いて、 WHERE で済むのに非効率",
        "GROUP BY なしで HAVING を使い、 全行が 1 グループとして扱われることに気付かない",
      ],
      references: [
        {
          label: "PostgreSQL: SELECT — HAVING",
          url: "https://www.postgresql.org/docs/current/sql-select.html#SQL-HAVING",
        },
      ],
    },
  },

  {
    id: "xt-sql-002",
    categoryId: "sql-joins",
    difficulty: "intermediate",
    type: "choice",
    question:
      "次のクエリで意図せず INNER JOIN 化してしまう罠の説明として正しいのは？\n\n```sql\nSELECT u.*, p.id AS post_id\nFROM users u\nLEFT JOIN posts p ON p.user_id = u.id\nWHERE p.published = true;\n```",
    choices: [
      "WHERE 句で `p.published = true` を書くと、 LEFT JOIN で右辺が NULL になった行 (= 投稿のないユーザー) も p.published が NULL になり条件から落ち、 結果的に INNER JOIN と同じになる。 残したいなら ON 句に条件を移すか、 `p.published = true OR p.id IS NULL` と書く",
      "LEFT JOIN は常に INNER JOIN と同じ結果を返す",
      "ORDER BY を付けないと自動的に INNER 化する",
      "Postgres と MySQL で挙動が違うので片方では問題ない",
    ],
    answerIndex: 0,
    choiceExplanations: [
      "正解。 これは『LEFT JOIN の罠』 として有名。 LEFT JOIN は右側が NULL でも左を残すが、 WHERE で右の列に条件を付けると NULL 行が条件不一致で消える。 正しい書き方は (1) ON 句に条件を入れる、 (2) WHERE で `OR p.id IS NULL` を許容、 のいずれか。",
      "不正解。 LEFT JOIN は通常 INNER と異なる結果を返す (左を残す)。 ただし上記のように WHERE 句で条件を付け間違えると同じ結果になる。",
      "不正解。 ORDER BY とは無関係。",
      "不正解。 SQL 標準の挙動で、 DB エンジン依存ではない。",
    ],
    hints: [
      "LEFT JOIN は『右が NULL でも左を残す』 が、 NULL に対する比較は何を返す？",
      "WHERE で `NULL = true` の評価結果は？",
      "条件を ON 句に書くか、 WHERE 句に書くかで意味が変わる。",
    ],
    explanation: {
      summary:
        "LEFT JOIN の右側列を WHERE 条件で使うと、 NULL 行 (一致なし) が条件不一致で消えて INNER JOIN と同じ結果になる。 残したい場合は条件を ON 句に書くか、 OR ... IS NULL を加える。",
      reason:
        "LEFT JOIN は『左テーブルの全行を残し、 右に一致がなければ右の列を NULL にする』。 ところが SQL の三値論理では `NULL = true` は true でも false でもなく UNKNOWN になり、 WHERE 句の判定では false 同様に扱われて行が落ちる。 結果として『投稿がないユーザー』 のような行も消え、 INNER JOIN と区別できなくなる。 これを防ぐには (a) フィルタ条件を ON 句に移す、 または (b) WHERE 句で `OR p.id IS NULL` を追加する。 ORM 経由でも同じ罠があるので注意。",
      codeExample:
        "-- ✗ NG: WHERE 句で右側列を条件にする\nSELECT u.id, p.id AS post_id\nFROM users u\nLEFT JOIN posts p ON p.user_id = u.id\nWHERE p.published = true;\n-- 結果: 投稿のないユーザーは消える (INNER JOIN と同じ)\n\n-- ✓ パターン 1: ON 句に条件を入れる\nSELECT u.id, p.id AS post_id\nFROM users u\nLEFT JOIN posts p\n  ON p.user_id = u.id AND p.published = true;\n-- 結果: 全ユーザーが残る (published=true 投稿がない人は p.id=NULL)\n\n-- ✓ パターン 2: WHERE で NULL を許容\nSELECT u.id, p.id AS post_id\nFROM users u\nLEFT JOIN posts p ON p.user_id = u.id\nWHERE p.published = true OR p.id IS NULL;\n\n-- Rails ActiveRecord で同じ罠\n# ✗ NG: WHERE 化される\nUser.left_joins(:posts).where(posts: { published: true })\n# ✓ ON 句に入れる (生 SQL 推奨)\nUser.joins(\"LEFT OUTER JOIN posts ON posts.user_id = users.id AND posts.published = true\")",
      commonMistakes: [
        "Rails の `left_joins(:posts).where(posts: { ... })` を書いて INNER 化に気付かない",
        "『LEFT JOIN したのに 0 件のはずのユーザーがいない』 と悩む",
        "EXPLAIN で実行計画を確認せず、 期待した結果と違うことに気付かない",
      ],
      references: [
        {
          label: "PostgreSQL: SELECT — Joined tables",
          url: "https://www.postgresql.org/docs/current/queries-table-expressions.html#QUERIES-JOIN",
        },
      ],
    },
  },

  {
    id: "xt-sql-003",
    categoryId: "sql-advanced",
    difficulty: "advanced",
    type: "choice",
    question:
      "『ユーザーごとに最新の投稿 1 件』 を SQL で取得したい。 最も効率的な方法は？",
    choices: [
      "ウィンドウ関数 `ROW_NUMBER() OVER (PARTITION BY user_id ORDER BY created_at DESC)` で各行に順位を付け、 サブクエリで rn = 1 だけ取り出す",
      "GROUP BY user_id して MAX(created_at) を取り、 元の posts と再 JOIN する (これでも動くが行が重複する可能性あり)",
      "全件取って Ruby 側で `group_by(&:user_id).map(&:last)` する",
      "PostgreSQL の DISTINCT ON を使う (これも有効で、 場合により Window より速い)",
    ],
    answerIndex: 0,
    choiceExplanations: [
      "正解。 ROW_NUMBER() を PARTITION BY user_id で割り当て、 created_at DESC で並べて rn=1 を取る、 が定番。 1 つの SQL で完結し、 同時刻ぴったりの重複も ORDER BY で 1 件に確定する。 D の DISTINCT ON も正しい解 (PostgreSQL 限定) で、 単純なケースでは ROW_NUMBER より高速。",
      "不正解。 GROUP BY + MAX(created_at) と再 JOIN は動くが、 同じ user_id・同じ created_at の投稿が複数あると重複する。 ROW_NUMBER なら確定的に 1 件。",
      "不正解。 全件を Ruby 側に持ってくるのはスケールしない (10 万ユーザーで死ぬ)。",
      "実は有効。 PostgreSQL の DISTINCT ON は『各 user_id の最初の 1 件』 を簡潔に書ける独自構文で、 多くの場合 Window 関数より高速。 ただし PostgreSQL 限定なので、 ポータビリティを考えると Window が無難。",
    ],
    hints: [
      "『各グループの 1 位だけ取り出す』 のは SQL の典型問題。",
      "Window 関数 (ROW_NUMBER, RANK, DENSE_RANK) のうちどれが適切？",
      "PARTITION BY と ORDER BY の意味を考える。",
    ],
    explanation: {
      summary:
        "Window 関数 `ROW_NUMBER() OVER (PARTITION BY user_id ORDER BY created_at DESC)` でユーザーごとに順位を付け、 サブクエリで rn = 1 を取り出す。 PostgreSQL 限定なら DISTINCT ON も有効。",
      reason:
        "『各グループの最新 1 件』 は、 GROUP BY + MAX で書こうとすると同値タイの扱いに悩まされ、 サブクエリも複雑になる。 Window 関数 ROW_NUMBER を使えば、 PARTITION BY で『どの単位で順位付けるか』、 ORDER BY で『何が 1 位か』 を明示でき、 同値タイも ORDER BY の二次ソート (例: id DESC) で確定的に 1 件に絞れる。 PostgreSQL であれば DISTINCT ON を使えば構文がさらに簡潔で、 多くの場合より高速 (ソート 1 回で済むため)。 Window は標準 SQL なので MySQL 8+ / SQL Server / Oracle でも同じ書き方で動く。",
      codeExample:
        "-- ROW_NUMBER パターン (ポータブル)\nWITH ranked AS (\n  SELECT\n    p.*,\n    ROW_NUMBER() OVER (\n      PARTITION BY user_id\n      ORDER BY created_at DESC, id DESC\n    ) AS rn\n  FROM posts p\n)\nSELECT * FROM ranked WHERE rn = 1;\n\n-- DISTINCT ON パターン (PostgreSQL 限定、 簡潔で高速)\nSELECT DISTINCT ON (user_id) *\nFROM posts\nORDER BY user_id, created_at DESC, id DESC;\n\n-- GROUP BY + 再 JOIN (古典、 重複に注意)\nSELECT p.*\nFROM posts p\nINNER JOIN (\n  SELECT user_id, MAX(created_at) AS latest\n  FROM posts GROUP BY user_id\n) m ON m.user_id = p.user_id AND m.latest = p.created_at;\n-- ↑ 同時刻ぴったりの投稿があると重複する\n\n-- Rails ActiveRecord で書くなら (PostgreSQL)\nPost.from(\n  Post.select(\"DISTINCT ON (user_id) *\")\n      .order(\"user_id, created_at DESC, id DESC\")\n)",
      commonMistakes: [
        "GROUP BY + MAX で取った結果に同値タイがあって重複し、 後段の表示でカウントがずれる",
        "ROW_NUMBER を使わず Ruby で全件 group_by して OOM",
        "ORDER BY の第二キー (id DESC 等) を入れず、 同時刻投稿でランダムに 1 件選ばれて再現性がない",
      ],
      references: [
        {
          label: "PostgreSQL: Window Functions",
          url: "https://www.postgresql.org/docs/current/tutorial-window.html",
        },
        {
          label: "PostgreSQL: DISTINCT ON",
          url: "https://www.postgresql.org/docs/current/sql-select.html#SQL-DISTINCT",
        },
      ],
    },
  },

  {
    id: "xt-db-001",
    categoryId: "db-design",
    difficulty: "intermediate",
    type: "choice",
    question:
      "複合インデックス `(user_id, created_at)` を貼った時、 そのインデックスが効くクエリの組合せとして正しいのは？",
    choices: [
      "WHERE user_id = ? や WHERE user_id = ? AND created_at >= ? は効く。 WHERE created_at >= ? 単体 (左端 user_id を含まない) は効かない (= 左端一致の原則)",
      "どんな順序のどんな組合せでも常に効く",
      "WHERE created_at >= ? 単体でも効く",
      "WHERE user_id = ? AND created_at >= ? は非効率で、 単独 INDEX を 2 つ貼った方が常に速い",
    ],
    answerIndex: 0,
    choiceExplanations: [
      "正解。 B-Tree 複合インデックスは『左端から連続して条件指定された部分』 のみ使える。 (user_id, created_at) なら user_id 単体や user_id + created_at は効くが、 created_at 単体は使えない。 これを『左端一致 (leftmost prefix) の原則』 と呼ぶ。",
      "不正解。 順序と左端一致が重要。 範囲検索が途中に入るとそれ以降の列は使えない、 等の制約もある。",
      "不正解。 left-most prefix 原則により、 先頭列 user_id がないと使えない。 created_at 単体検索が必要なら別途 INDEX が要る。",
      "不正解。 単独 INDEX 2 つでは index merge に依存することになり、 多くの場合複合 INDEX の方が高速。",
    ],
    hints: [
      "B-Tree の構造をイメージする。 user_id でまず分岐し、 その下に created_at で並ぶ。",
      "WHERE で『先頭から連続して』 列が指定されているか確認する。",
      "範囲検索が途中に入った場合の挙動も考える。",
    ],
    explanation: {
      summary:
        "複合 B-Tree インデックスは『左端一致 (leftmost prefix)』 で効く。 (a, b, c) なら a / a+b / a+b+c は効くが、 b 単体や b+c は効かない。",
      reason:
        "B-Tree インデックスは内部的にキー全体で並べ替えられた木構造で、 (user_id, created_at) なら『user_id でまず分岐 → 同じ user_id 内では created_at で並ぶ』。 そのため user_id を指定しないとどの枝にも進めず、 結果として全件スキャン (or 別 INDEX) になる。 また範囲検索 (>=, <, BETWEEN) は『そこで打ち止め』 となり、 (a, b, c) の b に範囲を使うと c は INDEX で絞り込めない (range の後ろは使えない原則)。 EXPLAIN で『Using index / Using where』 を確認しながら設計するのが鉄則。",
      codeExample:
        "-- 複合インデックス\nCREATE INDEX idx_posts_user_created ON posts (user_id, created_at);\n\n-- ✓ 効く: 左端 user_id を含む\nWHERE user_id = 1;\nWHERE user_id = 1 AND created_at >= '2025-01-01';\nWHERE user_id = 1 AND created_at >= '2025-01-01' ORDER BY created_at;\n\n-- ✗ 効かない (or 限定的): 左端を含まない / 順序が違う\nWHERE created_at >= '2025-01-01';  -- user_id がないので INDEX 使えず\nWHERE created_at = '2025-01-01';\n\n-- 範囲の後ろの列は使えない例\nCREATE INDEX idx_posts_a_b_c ON posts (a, b, c);\nWHERE a = 1 AND b >= 10 AND c = 5;\n-- a と b は INDEX で絞れるが c は使えない (b が範囲のため)\n\n-- EXPLAIN で確認\nEXPLAIN SELECT * FROM posts WHERE user_id = 1 AND created_at >= '...';\n-- type: range, key: idx_posts_user_created, key_len: ... — 効いている\n\n-- Rails で INDEX を貼る\nadd_index :posts, [:user_id, :created_at]",
      commonMistakes: [
        "WHERE 句の順序を入れ替えれば INDEX が効くと誤解する (実際は WHERE の記述順序ではなく『指定されている列』 が問題)",
        "範囲検索の後ろの列にも INDEX が効くと思い込み、 etag のような列を末尾に追加して効かないことに後で気付く",
        "INDEX を多用しすぎて書き込みが遅くなる (INSERT/UPDATE のたびに全 INDEX も更新)",
      ],
      references: [
        {
          label: "MySQL: Multiple-Column Indexes",
          url: "https://dev.mysql.com/doc/refman/8.0/en/multiple-column-indexes.html",
        },
        {
          label: "PostgreSQL: Multicolumn Indexes",
          url: "https://www.postgresql.org/docs/current/indexes-multicolumn.html",
        },
      ],
    },
  },

  {
    id: "xt-db-002",
    categoryId: "db-design",
    difficulty: "advanced",
    type: "choice",
    question:
      "ステータスを表す列 (例: order_status = pending / paid / shipped / cancelled) の設計として、 シニア視点で最もバランスが良いのは？",
    choices: [
      "VARCHAR + CHECK 制約 (or DB ENUM) + アプリ側で Rails の enum マクロ。 値が安定していて参照テーブルにする意味が薄く、 INDEX も効く。 将来値を追加するのも ALTER 1 回で済む",
      "INTEGER + アプリ側で定数マッピング (例: 0=pending, 1=paid)。 速度と容量だけを最優先",
      "別テーブル `order_statuses` を作って status_id で FK 参照。 ステータスは常に正規化すべき",
      "全て JSONB に詰める。 柔軟性が最重要",
    ],
    answerIndex: 0,
    choiceExplanations: [
      "正解。 VARCHAR + CHECK (or DB ENUM 型) は (1) 値が SQL クエリで読める、 (2) ダンプを目視で理解できる、 (3) INDEX が効く、 (4) Rails の enum マクロでアプリ側からも安全に扱える、 とバランスが良い。 値が頻繁に変わる場合は参照テーブルだが、 ステータスは通常そこまで頻繁に変わらない。",
      "不正解。 INTEGER は容量小さいが SQL クエリやダンプで意味が読めず、 アプリと DB の対応表がズレた時の事故が致命的。 旧 Rails (4 以前) ではこれが主流だったが、 現代では非推奨。",
      "不正解。 ステータスのような『値が安定した小数の選択肢』 を別テーブルに切り出すと、 JOIN コストが常時発生してメリットが薄い。 値が頻繁に追加される or 属性付き (色や説明文を持つ等) なら検討。",
      "不正解。 ステータスのような『限定された選択肢』 を JSONB に詰めるのは過剰な柔軟性で、 INDEX も効きにくく、 型安全性も失う。",
    ],
    hints: [
      "『値が安定している』 か『頻繁に追加される』 か。",
      "ダンプを開いた時に意味が分かるか。",
      "INDEX が効くか、 JOIN コストが発生するか。",
    ],
    explanation: {
      summary:
        "ステータスのような『値が安定した少数の選択肢』 は VARCHAR + CHECK 制約 (or DB ENUM) + Rails の enum マクロが王道。 INTEGER は意味が読めず、 別テーブルは JOIN コストが無駄、 JSONB は型安全性を失う。",
      reason:
        "ステータス値は通常、 設計時にほぼ確定し、 増えるとしても年に数回程度。 別テーブル化のメリット (動的追加・属性付与) が活きるケースは少なく、 一方で常時 JOIN するコストや、 ダンプ・ログ・ダッシュボードで意味が読めないデメリットが大きい。 VARCHAR + CHECK 制約なら DB レベルで値の整合性を保証でき、 INDEX も普通に効く。 Rails の `enum status: { pending: \"pending\", paid: \"paid\" }` と組み合わせれば、 アプリ側からは pending? / paid! のような型安全なインタフェースで操作できる。 旧来の Integer enum は容量メリットがあるものの、 ダンプを見た時に 0/1/2 が何を意味するか分からず、 マッピングがズレた時の事故が致命的になる。",
      codeExample:
        "# マイグレーション (PostgreSQL)\ncreate_table :orders do |t|\n  t.string :status, null: false, default: \"pending\"\n  t.timestamps\nend\nadd_index :orders, :status\n\n# CHECK 制約 で許容値を縛る\nexecute <<~SQL\n  ALTER TABLE orders\n  ADD CONSTRAINT chk_orders_status\n  CHECK (status IN ('pending', 'paid', 'shipped', 'cancelled'));\nSQL\n\n# モデル — Rails 7+ の enum (string ベース)\nclass Order < ApplicationRecord\n  enum :status, {\n    pending:   \"pending\",\n    paid:      \"paid\",\n    shipped:   \"shipped\",\n    cancelled: \"cancelled\",\n  }, prefix: true\nend\n\norder.status_pending?    # => true\norder.status_paid!       # status を paid に更新\nOrder.status_pending     # scope\n\n# PostgreSQL の ENUM 型を使うパターン (代替案)\nexecute <<~SQL\n  CREATE TYPE order_status_t AS ENUM ('pending', 'paid', 'shipped', 'cancelled');\nSQL\n# ALTER で値追加は ALTER TYPE order_status_t ADD VALUE 'refunded';\n\n# やってはいけない: Integer enum\n# enum :status, [:pending, :paid, :shipped]  # 0, 1, 2 になり意味不明",
      commonMistakes: [
        "Integer enum を使ってデータダンプを別環境にロードしたら順序が変わり、 意味が破壊される",
        "CHECK 制約を入れず、 アプリのバグで存在しないステータス値が混入する",
        "ステータスごとの label / color / 並び順を持つ拡張が出てきて、 後から参照テーブルに移行する大改修",
      ],
      references: [
        {
          label: "Rails API: ActiveRecord::Enum",
          url: "https://api.rubyonrails.org/classes/ActiveRecord/Enum.html",
        },
        {
          label: "PostgreSQL: ENUM types",
          url: "https://www.postgresql.org/docs/current/datatype-enum.html",
        },
      ],
    },
  },

  // ===========================================================================
  // その他 (4 問)
  // ===========================================================================
  {
    id: "xt-git-001",
    categoryId: "git-github",
    difficulty: "intermediate",
    type: "choice",
    question:
      "feature ブランチを main に取り込む時、 `git rebase` (+ merge --ff-only) と `git merge --squash` の違いとして正しいのは？",
    choices: [
      "rebase は feature 上の個別コミットを main の先端に並べ替えて 1 直線にし、 各コミット履歴を保つ。 merge --squash は全変更を 1 コミットにまとめて main に乗せ、 個別コミット履歴は捨てる。 用途で使い分ける",
      "全く同じ結果になる",
      "rebase は履歴を消し、 merge --squash は履歴を残す",
      "rebase は GitHub 専用、 merge --squash は GitLab 専用",
    ],
    answerIndex: 0,
    choiceExplanations: [
      "正解。 rebase は『コミットを保ったまま履歴を 1 本に揃える』、 squash merge は『PR ごとに 1 コミットに集約する』。 後者はチームで一貫した『PR = 1 コミット』 ポリシーを取る場合の定番。 PR レビューで途中の試行錯誤を残したいなら rebase。",
      "不正解。 結果のコミット数も履歴の見た目も大きく異なる。",
      "不正解。 逆。 squash merge こそ個別コミットを捨てる。",
      "不正解。 どちらも Git の機能で、 ホスティング (GitHub/GitLab/Bitbucket) は単に UI を提供しているだけ。",
    ],
    hints: [
      "git log でどう見えるかをイメージする。",
      "PR が 10 コミットあった時、 main にいくつ乗るか？",
      "途中の試行錯誤を残すべきか、 1 つに集約すべきかは方針次第。",
    ],
    explanation: {
      summary:
        "rebase = feature の個別コミットを main の先端に並べ直して 1 直線化、 個別履歴を保つ。 squash merge = 全変更を 1 コミットに集約して main に乗せる、 個別履歴は捨てる。 チームポリシーで使い分け。",
      reason:
        "rebase の特徴は『1 直線の履歴に整形しつつ、 各コミットの粒度を保つ』。 1 PR が論理的に分割された複数コミット (e.g., 『リファクタ』 → 『機能追加』 → 『テスト』) を残したい時に向く。 squash merge は『1 PR = 1 コミット』 を強制し、 main の履歴が PR 単位で読める利点があるが、 PR 内の段階的な変化は失われる。 GitHub の Pull Request では『Rebase and merge』 / 『Squash and merge』 / 『Create a merge commit』 の 3 つから選べ、 多くのチームは『Squash and merge』 をデフォルトに設定して main をクリーンに保つ。 大規模な変更や歴史的価値の高いリファクタは『Rebase and merge』 で個別コミットを残す、 という併用が現実的。",
      codeExample:
        "# === rebase + ff-only ===\n# feature ブランチで\ngit checkout feature\ngit rebase main           # feature のコミットを main の先端に並べ直す\ngit checkout main\ngit merge --ff-only feature   # 直線に伸ばすだけ (merge commit なし)\n\n# 結果 (git log --oneline):\n#   abc789 feature: テスト追加\n#   abc456 feature: 機能追加\n#   abc123 feature: リファクタ\n#   main-old\n\n# === squash merge ===\ngit checkout main\ngit merge --squash feature    # 変更を staged 状態にまとめる\ngit commit -m \"feature: 機能 X 実装 (#42)\"\n\n# 結果:\n#   def789 feature: 機能 X 実装 (#42)\n#   main-old\n# (feature ブランチの 3 コミットは消えて 1 つに)\n\n# GitHub の PR マージボタン\n# - Merge pull request          → merge commit 作成 (履歴に Y 字)\n# - Squash and merge            → 1 コミットに集約 (直線)\n# - Rebase and merge            → 個別コミットを 1 直線に",
      commonMistakes: [
        "main から rebase してきた feature を強引に push せず、 force push しなくて壊す (--force-with-lease を使う)",
        "squash merge した PR の feature ブランチで作業を続け、 後で重複コミットでマージ衝突",
        "チーム内で merge / rebase / squash の方針が統一されておらず、 履歴が混乱",
      ],
      references: [
        {
          label: "Git: git-rebase",
          url: "https://git-scm.com/docs/git-rebase",
        },
        {
          label: "GitHub Docs: About pull request merges",
          url: "https://docs.github.com/en/pull-requests/collaborating-with-pull-requests/incorporating-changes-from-a-pull-request/about-pull-request-merges",
        },
      ],
    },
  },

  {
    id: "xt-cli-001",
    categoryId: "linux-cli",
    difficulty: "beginner",
    type: "choice",
    question:
      "プロジェクト全体から `TODO` 文字列を grep したら、 ビルド成果物の中の バイナリにマッチして大量の文字化けが出てしまった。 これを抑える最も簡潔なオプションは？",
    choices: [
      "`grep -rI TODO .` — `-I` (大文字 I) でバイナリファイルを無視する",
      "`grep -ri TODO .` — `-i` (小文字 i) で大文字小文字を無視する",
      "`grep -rv TODO .` — `-v` で逆マッチさせる",
      "`grep -r --binary-only TODO .` — バイナリだけ対象にする",
    ],
    answerIndex: 0,
    choiceExplanations: [
      "正解。 `-I` (大文字) はバイナリファイルをスキップする grep のオプション。 ビルド成果物 (.o, .a, 画像等) を勝手に除外してくれる。 ripgrep (`rg`) なら デフォルトでバイナリ無視 + .gitignore 尊重で更に快適。",
      "不正解。 `-i` は case-insensitive。 バイナリ無視とは別の機能。",
      "不正解。 `-v` は反転マッチ (TODO を含まない行)。 求める動作と逆。",
      "不正解。 そんなオプションはない。 `--binary-files=` で挙動を細かく制御できるが質問の意図と逆。",
    ],
    hints: [
      "grep の man / `--help` でバイナリ関連のオプションを探す。",
      "大文字 I と 小文字 i は別のオプション。",
      "実務では ripgrep (rg) を入れるとデフォルトで快適。",
    ],
    explanation: {
      summary:
        "grep の `-I` (大文字) でバイナリファイルを無視する。 `-r` (再帰) と組み合わせて `grep -rI TODO .` が定番。 ripgrep (rg) ならデフォルトでバイナリ + .gitignore を尊重するので更に楽。",
      reason:
        "grep は対象ファイルがテキストかバイナリかを内部判定 (最初の数バイトに NUL があるか等) する。 `-I` は『バイナリと判定されたファイルを完全スキップ』 する。 同じカテゴリで `--binary-files=without-match` や `text` も使えるが、 `-I` が最も簡潔。 さらに `--exclude-dir=node_modules` 等で明示的にディレクトリを除外、 `--include='*.rb'` で拡張子を絞ることもできる。 ripgrep (`rg`) はこれらを全部デフォルトでよしなにやってくれるので、 ターミナル作業の効率が大幅に上がる。",
      codeExample:
        "# 基本: バイナリ無視 + 再帰\ngrep -rI \"TODO\" .\n\n# よく使う組合せ\ngrep -rIn \"TODO\" .           # -n で行番号も表示\ngrep -rIni \"todo\" .          # -i で大文字小文字無視\ngrep -rI --include='*.rb' \"TODO\" .   # Ruby ファイルだけ\ngrep -rI --exclude-dir={node_modules,.git,vendor} \"TODO\" .\n\n# ripgrep (rg) — 推奨\nrg TODO                      # デフォルトで .gitignore + バイナリ無視\nrg -t ruby TODO              # type filter (Ruby のみ)\nrg --files-with-matches TODO # マッチしたファイル名だけ\n\n# Mac の find と組み合わせる古典パターン\nfind . -type f -name '*.rb' -print0 | xargs -0 grep -nI TODO",
      commonMistakes: [
        "`grep -i` (case insensitive) と `grep -I` (binary skip) を混同する",
        "ビルド成果物のあるプロジェクトで grep が極端に遅い・出力が壊れることを我慢する",
        "ripgrep の存在を知らず、 grep + find で複雑なパイプを毎回組み立てる",
      ],
      references: [
        {
          label: "GNU grep manual",
          url: "https://www.gnu.org/software/grep/manual/grep.html",
        },
        {
          label: "ripgrep User Guide",
          url: "https://github.com/BurntSushi/ripgrep/blob/master/GUIDE.md",
        },
      ],
    },
  },

  {
    id: "xt-pr-001",
    categoryId: "practical",
    difficulty: "intermediate",
    type: "choice",
    question:
      "ステージング環境で再現しないのに、 本番環境のみで特定エンドポイントが 500 エラーで落ちる。 シニアエンジニアとして最初に取るべきアクションは？",
    choices: [
      "本番のログ / APM / エラートラッカ (Sentry 等) で実際のスタックトレースとリクエスト内容 (params, user, headers) を確認し、 ステージングとの『環境差分』 (データ・設定・スケール・依存サービス) を仮説リストアップ",
      "とりあえずアプリを再起動して様子を見る",
      "ステージングと本番でコードを比較し、 差分があれば本番を強制ロールバック",
      "本番で `binding.break` を仕込んで再現を待つ",
    ],
    answerIndex: 0,
    choiceExplanations: [
      "正解。 まず『何が起きたか』 (スタックトレース + 入力) を確証してから、 『なぜステージングで再現しないか』 (環境差分の仮説) を洗い出すのが王道。 環境差分の主要分類は (1) データ (本番にだけある特殊レコード)、 (2) 設定 (環境変数 / 機能フラグ)、 (3) スケール (並行数・データ量)、 (4) 外部依存 (本番のみの API キー・サードパーティ応答)。",
      "不正解。 再起動は症状を一時的に隠す可能性があり、 原因究明から遠ざかる。 真の原因が残ったまま再発する。",
      "不正解。 コード差分があるかを確認するのは良いが、 確認前にロールバックは性急。 直近のデプロイが原因かの確証も取らずに巻き戻すと別の問題を引き起こす可能性。",
      "不正解。 本番で binding.break はプロセスをハングさせて全ユーザーに影響。 絶対に避ける。 本番デバッグはログ / APM / dry-run 環境で。",
    ],
    hints: [
      "『何が起きたか』 と『なぜ起きたか』 は別。 まず前者を確証する。",
      "本番とステージングの差分はコードだけではない。",
      "再現しない不具合の原因は、 多くの場合データか設定か並行性。",
    ],
    explanation: {
      summary:
        "まず本番のログ / APM / Sentry で『何が起きたか』 (スタックトレース + 入力) を確証。 その後『なぜステージングで再現しないか』 を環境差分 (データ / 設定 / スケール / 外部依存) で仮説リストアップする。",
      reason:
        "再現しない本番障害は、 焦って手を動かす前に観測データを集めることが最も重要。 (1) Sentry / Rollbar / Honeybadger 等のエラートラッカで完全なスタックトレースを確認、 (2) APM (Datadog / New Relic / Scout) でリクエスト全体のタイムライン (DB / 外部 API / 何が遅延 or 失敗か) を見る、 (3) アプリログでリクエスト ID 単位の挙動を追う、 が三種の神器。 これで『例外の種類』 と『入力』 が分かれば、 多くのケースで原因が推定できる。 ステージングで再現しないのは大抵『データの違い』 (本番にだけある特殊レコード、 例: NULL を期待していない列の NULL、 想定外の長さの文字列、 タイムゾーン違いの日時)。 次点で『並行性』 (本番のみのロック競合 / レース) や『外部依存』 (本番のみのサードパーティ応答ズレ)。 ロールバックは『直近デプロイが原因と分かった時の即応』 として有効だが、 原因究明より優先するものではない。",
      codeExample:
        "# 障害対応の標準テンプレ (Slack や Issue で関係者に共有)\n\n## 概要\n- 環境: production\n- 影響: /api/v1/payments POST が 500 (5XX rate 3% に上昇)\n- 検知時刻: 2025-05-25 10:23 JST\n- 検知方法: Datadog の 5XX アラート\n\n## 確認した観測データ\n- Sentry: NoMethodError: undefined method `formatted_amount` for nil:NilClass\n  - スタック: PaymentsController#create:34\n- APM: 該当リクエストの payment.find_by が nil を返している\n- ログ: params[:order_id] が想定外形式 (前ゼロ付き文字列 \"00123\")\n\n## 仮説 (環境差分)\n1. データ差分: 本番のみ前ゼロ付き order_id が混入 (旧システム移行データ)\n2. 設定差分: なし (config diff 確認済み)\n3. スケール: 該当は低トラフィックエンドポイントで関係なし\n4. 外部依存: なし\n\n## 次のアクション\n- 仮説 1 を再現するため、 該当 order_id 形式をステージング DB に投入してテスト\n- 並行して、 controller で order_id を正規化する hotfix PR を準備",
      commonMistakes: [
        "ログを見ずに憶測でコードを修正し、 デプロイで状況が悪化する",
        "本番で binding.break や debugger を仕込む (プロセス停止で全ユーザー影響)",
        "Sentry / APM が未導入で、 障害時に観測手段がない",
        "ロールバックを最初の選択肢にして、 原因が別だった場合に時間を失う",
      ],
      references: [
        {
          label: "Google SRE Book: Practical Alerting",
          url: "https://sre.google/sre-book/practical-alerting/",
        },
      ],
    },
  },

  {
    id: "xt-js-001",
    categoryId: "js-basics",
    difficulty: "beginner",
    type: "choice",
    question:
      "JavaScript で `0 == \"\"` の結果と、 ESLint 等で推奨される比較演算子は？",
    choices: [
      "`true`。 `==` は型変換を伴う緩い比較で予期せぬ結果を生むため、 厳密等価 `===` (型も含めて比較) が推奨される",
      "`false`。 数値と文字列は常に等しくない",
      "`TypeError`。 異なる型は比較できない",
      "`undefined`。 比較できない値同士は undefined を返す",
    ],
    answerIndex: 0,
    choiceExplanations: [
      "正解。 `==` は両辺を共通の型に変換してから比較する。 `0 == \"\"` は両者が Number に変換されて 0 == 0 で true。 こうした暗黙変換はバグの温床なので、 ESLint の eqeqeq ルールも含め、 ほぼ全てのスタイルガイドが `===` (strict equality) を推奨する。",
      "不正解。 `==` の暗黙変換で true になる。 `===` なら false。",
      "不正解。 JavaScript の比較は型エラーにならず、 暗黙変換が走る (これが問題)。",
      "不正解。 比較演算子は boolean を返す。 undefined にはならない。",
    ],
    hints: [
      "JavaScript の `==` は『等価 (loose equality)』 で、 `===` は『厳密等価 (strict equality)』。",
      "`==` は型変換 (coercion) を行う。",
      "暗黙の型変換は意図しない結果を招きやすい。",
    ],
    explanation: {
      summary:
        "`==` は型変換あり、 `===` は型まで含めた厳密比較。 暗黙変換の罠を避けるため、 常に `===` を使うのが定石 (ESLint eqeqeq ルール)。",
      reason:
        "ECMAScript 仕様 (Abstract Equality Comparison) では `==` は両辺の型を見て複雑な変換規則を適用する: String と Number なら String を Number に変換、 Boolean は Number に変換、 Object はプリミティブに変換、 など。 結果として `0 == \"\"` (両方 0)、 `0 == false` (両方 0)、 `null == undefined` (特例 true)、 `[] == false` (両方 0) のような直感に反する true が量産される。 `===` (Strict Equality Comparison) は型が違えば即座に false を返すため、 こうした罠を完全に回避できる。 唯一の例外は `null == undefined` の判定で両方をまとめてチェックしたい時くらいで、 通常は `=== null` か `=== undefined` を明示する。",
      codeExample:
        "// == の罠\n0 == \"\"            // true\n0 == false         // true\n0 == \"0\"           // true\n\"\" == false        // true\nnull == undefined  // true (特例)\n[] == false        // true ([] → \"\" → 0、 false → 0)\n[0] == false       // true\n\"  \" == 0          // true (空白文字列 → 0)\n\n// === なら全部 false\n0 === \"\"           // false\n0 === false        // false\nnull === undefined // false\n\n// 推奨: 常に === を使う\nif (x === null || x === undefined) { /* ... */ }\n// or\nif (x == null) { /* null と undefined をまとめて (例外的に許容される書き方) */ }\n\n// ESLint で強制\n// .eslintrc.js\n// rules: { 'eqeqeq': ['error', 'always'] }\n\n// TypeScript なら strict mode で型不一致を弾けるが、\n// 動的型の値 (例: JSON 由来) を扱う時は依然として === が安全",
      commonMistakes: [
        "`== null` と `== undefined` を混在させて意図が不明確",
        "Object 同士の `==` で『等しい中身なら true』 と思い込む (実際は同じ参照のみ true)",
        "NaN は `NaN === NaN` でも false (Number.isNaN を使う) を知らない",
      ],
      references: [
        {
          label: "MDN: Equality comparisons and sameness",
          url: "https://developer.mozilla.org/en-US/docs/Web/JavaScript/Equality_comparisons_and_sameness",
        },
        {
          label: "ESLint: eqeqeq rule",
          url: "https://eslint.org/docs/latest/rules/eqeqeq",
        },
      ],
    },
  },
];
