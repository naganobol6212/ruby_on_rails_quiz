import type { Question } from "@/lib/types";

export const questions: Question[] = [
  // ===========================================================================
  // Ruby 基礎 (18問)
  // ===========================================================================
  {
    id: "rb-001",
    categoryId: "ruby-basics",
    difficulty: "beginner",
    type: "choice",
    question:
      "Ruby で「変更不可な、一意な識別子として使われる軽量オブジェクト」を表すリテラルはどれですか？",
    choices: ['"hello"', ":hello", "'hello'", "%w[hello]"],
    answerIndex: 1,
    choiceExplanations: [
      "ダブルクォート文字列リテラル。式展開やエスケープが使えるが、同じ値でも呼び出すたびに新しい String オブジェクトが作られるので「一意な識別子」には不向き。",
      "正解。Symbol リテラル。同じ名前なら常に同じオブジェクト (object_id 一致) で immutable。Hash のキーや状態フラグの定番。",
      "シングルクォート文字列。リテラル通り (式展開なし) の String を作るが、Symbol と違って一意性はない。",
      "%w[ ... ] は「シンボルではなく文字列」の配列リテラル。例えば %w[a b c] は ['a','b','c']。シンボル配列が欲しいなら %i[a b c]。",
    ],
    hints: [
      "文字列とは違い、同じ値であれば常にメモリ上で同じオブジェクトになります。",
      "頭にコロンが付くリテラルです。Hash のキーなどでよく使われます。",
      "選択肢の中で、文字列リテラルとは構文が違う「短く軽量な識別子」を選んでください。クラス名は Symbol。",
    ],
    explanation: {
      summary: "Symbol は immutable で一意なオブジェクト。",
      reason:
        "文字列リテラルは同じ内容でも呼び出すたびに新しいオブジェクトが作られますが、Symbol は同じ名前なら常に同一オブジェクト (object_id が一致) になります。そのため Hash のキーや状態フラグに使うとメモリ効率・比較速度の両面で有利です。",
      beginnerExplanation:
        "「文字列」と「シンボル」は見た目が似ていますが別物です。\n\n文字列 \"hello\" は、書くたびに新しい紙にメモを書くイメージ。同じ \"hello\" でも、書いた紙が違えば別のオブジェクトです。比較するときも「中身を 1 文字ずつ照合」する必要があります。\n\nシンボル :hello は、最初に登場したときに 1 つだけ作られて、その後はみんなが同じものを参照します。なので「これと同じか?」の比較が一瞬で済むし、メモリも節約できます。\n\nRuby では、内部のキー (Hash のキー、ステータス名など、人間が決めた限定的な識別子) を扱うときに Symbol を使うのが定番です。一方、ユーザーが入力した文字 (名前・メッセージなど、変化する可能性のあるもの) は String のままにしておきます。",
      modelSelfExplanation: {
        conclusion:
          "Ruby で「変更不可で一意な軽量識別子」を表すのは Symbol で、リテラルは `:hello` のようにコロン付きで書く。",
        reason:
          "Symbol は同じ名前なら常に同一オブジェクト (object_id が一致) になる immutable な値で、Ruby 内部でも特別扱いされる。これにより Hash のキー検索や状態比較が `==` (内容比較) ではなく `equal?` (同一性比較) で高速に行え、メモリ使用量も最小限で済む。一方 String は同じ文字列でもリテラルごとに新規オブジェクトが作られるため、識別子用途には向かない。",
        example:
          "たとえば Rails の `user.role == :admin` のような状態比較や、`{ name: \"Alice\", age: 20 }` の Hash キー、ActiveRecord の `where(status: :published)` などがすべて Symbol を使う場面。「あらかじめ決まった限定的な名前」なので Symbol が最適。",
        pitfall:
          "外部入力 (params など) を `to_sym` で Symbol 化すると、攻撃者に無制限にシンボルを作られメモリリークになるアンチパターン。Ruby 2.2+ で GC 対象にはなったが、原則として「ユーザー入力は文字列のまま扱う」のが安全。",
      },
      codeExample:
        '"hello".object_id  #=> 70...A (毎回違う)\n"hello".object_id  #=> 70...B\n:hello.object_id   #=> 1234 (常に同じ)\n:hello.object_id   #=> 1234\n\n# Hash のキーは Symbol が定番\nuser = { name: "Alice", age: 20 }',
      commonMistakes: [
        "ユーザー入力を Symbol 化 (`to_sym`) すると、外部から無制限にシンボルが生成されてメモリリークの原因になる (Ruby 2.2+ では GC されるが避けるのが無難)。",
      ],
      references: [
        {
          label: "Ruby 公式リファレンス: Symbol クラス",
          url: "https://docs.ruby-lang.org/ja/latest/class/Symbol.html",
        },
        {
          label: "Ruby 公式リファレンス: リテラル (シンボル / %記法)",
          url: "https://docs.ruby-lang.org/ja/latest/doc/spec=2fliteral.html",
        },
      ],
    },
  },
  {
    id: "rb-002",
    categoryId: "ruby-basics",
    difficulty: "beginner",
    type: "choice",
    question: "次のコードの実行結果はどれですか？",
    code: "puts nil.to_s.length",
    choices: ["NoMethodError", "0", "nil", "4"],
    answerIndex: 1,
    choiceExplanations: [
      "nil でも NilClass に `to_s` が定義されているのでエラーにはならない。エラーになるのは `nil.length` のように直接呼んだ場合。",
      "正解。`nil.to_s` は空文字列 `\"\"` を返し、その `length` は 0。",
      "puts は値を文字列化して出力するため、結果が nil でもそのまま 'nil' という文字列が表示される。だがそもそもこの式の戻り値は 0 (Integer) で nil ではない。",
      "`nil.to_s` は 'nil' の 3 文字や 'null' の 4 文字ではなく、空文字 `\"\"` を返す。文字列化が「文字としての nil」を返すと考えると間違える。",
    ],
    hints: [
      "`nil` には `to_s` メソッドがあり、エラーにはなりません。",
      "`nil.to_s` は空文字列 `\"\"` を返します。",
      "空文字列の長さがいくつになるかを思い出せば、選択肢の数値が 1 つに絞れます。",
    ],
    explanation: {
      summary: "`nil.to_s` は空文字列 `\"\"`、その length は 0。",
      reason:
        "Ruby では nil もオブジェクトで、NilClass に `to_s` / `to_a` / `to_i` などの変換メソッドが定義されています。to_s は空文字を、to_a は空配列を、to_i は 0 を返すように設計されており、メソッドチェーンを切らずに済みます。",
      beginnerExplanation:
        "他の言語 (JavaScript の null や Java の null) と違い、Ruby の nil は「ただの空っぽ」ではなく **NilClass のインスタンスというれっきとしたオブジェクト** です。\n\nだから nil に対してもメソッドを呼べます。ただし呼べるのは NilClass に定義されているメソッドだけ。`nil.to_s` や `nil.to_a` は定義されているのでエラーにならず、それぞれ「空っぽの文字列」「空っぽの配列」を返します。\n\nこの設計のおかげで、データが nil かもしれない場面で `if obj.nil?` のガードを書かずに、`obj.to_s.length` のように安全に連結できます。「nil でも空文字として扱われる」ことが分かっていれば、その後の length は当然 0 になります。\n\n一方で `nil.length` のように NilClass に定義されていないメソッドを呼ぶと NoMethodError になります。「nil でも呼べるメソッド」と「呼べないメソッド」を区別するのが大事です。",
      modelSelfExplanation: {
        conclusion:
          "`nil.to_s.length` は 0 を出力する。`nil.to_s` が空文字列 `\"\"` を返し、その length が 0 になるから。",
        reason:
          "Ruby の nil は NilClass のインスタンスで、メソッドを持つオブジェクト。NilClass#to_s は空文字列を返すよう仕様で定義されている (`to_a` は空配列、`to_i` は 0 を返す)。これは「nil 経由でメソッドチェーンを途切れさせない」ための設計判断で、長いチェーン中の nil ガードを省略できる。",
        example:
          "たとえば Rails の view で `<%= user.name.to_s.upcase %>` のように書けば、user.name が nil でも空文字 → 空文字の upcase で安全に表示できる。`@user.profile.to_a.each { ... }` も nil 安全に each できる。",
        pitfall:
          "ただし NilClass に定義されていない `nil.length` や `nil.upcase` は NoMethodError になる。文字列前提のメソッドを呼ぶ前に `.to_s` を挟むか、`&.length` のぼっち演算子で nil を伝搬させる。",
      },
      codeExample:
        'nil.to_s     #=> ""\nnil.to_a     #=> []\nnil.to_i     #=> 0\nnil.inspect  #=> "nil"\n\n# だから安全にチェインできる\nputs (user&.name || "ゲスト").upcase',
      commonMistakes: [
        '`nil.length` は NoMethodError。`nil&.length` (ぼっち演算子) で nil を返すように。',
        "`nil.to_s` を空文字判定に使う際は注意。`nil.to_s.empty? #=> true`",
      ],
      references: [
        {
          label: "Ruby 公式リファレンス: NilClass",
          url: "https://docs.ruby-lang.org/ja/latest/class/NilClass.html",
        },
        {
          label: "Ruby 公式リファレンス: NilClass#to_s",
          url: "https://docs.ruby-lang.org/ja/latest/method/NilClass/i/to_s.html",
        },
      ],
    },
  },
  {
    id: "rb-003",
    categoryId: "ruby-basics",
    difficulty: "beginner",
    type: "choice",
    question:
      "Ruby で「偽 (falsy)」と評価される値はどれですか？(最も正確なもの)",
    choices: ["0", '""', "[]", "false と nil のみ"],
    answerIndex: 3,
    choiceExplanations: [
      "Ruby では 0 は truthy。`if 0` は条件成立。これは JS/Python と異なる重要な差。",
      "Ruby では空文字列 `\"\"` も truthy。`if \"\"` は条件成立。JS では falsy なので要注意。",
      "Ruby では空配列 `[]` も truthy。`if []` は条件成立。配列が空かを調べるには `array.empty?` を使う。",
      "正解。Ruby で falsy なのは false と nil の 2 つだけ。「値の有無 (nil)」と「論理的な偽 (false)」だけが偽で、他はすべて真として扱う最小設計。",
    ],
    hints: [
      "JavaScript や Python とは異なるので注意。",
      '`if 0 then puts "truthy" end` は何を出力するか考えてみましょう。',
      "他の動的言語と違い、Ruby では「値が無い」と「真偽の偽」だけを偽と扱う最小設計になっています。",
    ],
    explanation: {
      summary: "Ruby で falsy なのは `false` と `nil` だけ。",
      reason:
        "C/JavaScript/Python では 0 や 空文字列 / 空配列も falsy ですが、Ruby は false と nil のみが falsy。他はすべて truthy です。これは設計上「値の有無 (nil) と論理的な偽 (false) を区別する」ためで、整数や空コレクションも「ある値」として扱います。",
      beginnerExplanation:
        "他の言語を経験している人ほどハマるポイントです。\n\nJavaScript では `if (0)` や `if (\"\")` は実行されません (falsy)。Python でも同じく、0 や空リスト [] や空文字列 \"\" は False 扱いです。\n\nですが Ruby では **false と nil 以外は全部 true** として扱います。つまり 0 も、\"\" も、[] も、{} も、`if` の条件に置けば全部成立してブロックが実行されます。\n\nこれは「値があるかどうか (nil)」と「論理的に真か偽か (false)」だけを偽として扱う、シンプルな設計です。数値の 0 や空のコレクションも「立派な値」なので真扱い、というわけです。\n\nそのため Ruby で「配列が空か?」を判定したいなら `if array` ではダメで、`if array.empty?` のように専用メソッドを使います。",
      modelSelfExplanation: {
        conclusion:
          "Ruby で falsy な値は `false` と `nil` の 2 つだけ。それ以外 (0 や空文字列 `\"\"`、空配列 `[]`、空ハッシュ `{}` も含めて) はすべて truthy。",
        reason:
          "Ruby の設計思想として「値の有無 (nil) と論理的な偽 (false) は区別すべき特殊な状態であり、それ以外は『存在する値』として真として扱う」というシンプルなルールが採用されている。これにより、整数の 0 や空のコレクションも『有意な値』として扱え、`if obj` という条件で「obj が存在するか (= nil でも false でもないか)」を端的に判定できる。",
        example:
          "たとえば `def find_user(id); ...end` が見つからないとき nil を返すなら、`if user = find_user(id)` で「見つかったときだけ実行」を 1 行で書ける。`array.empty?` のチェックを忘れて `if array then process(array) end` と書いても、空配列 `[]` は truthy なので process が実行されてしまう。",
        pitfall:
          "JS/Python の感覚で `if array` と書くと、空配列でも条件が成立してしまう。Ruby では `array.empty?` や `array.any?` のように専用メソッドを使うのが正しい。逆に「nil ガード」だけなら `if obj` で十分。",
      },
      codeExample:
        'if 0       then puts "truthy" end  # => truthy\nif ""      then puts "truthy" end  # => truthy\nif []      then puts "truthy" end  # => truthy\nif false   then puts "truthy" end  # => 出力なし\nif nil     then puts "truthy" end  # => 出力なし',
      commonMistakes: [
        "JS/Python から来ると `if array.length == 0` ではなく `if array` で空判定したくなるが Ruby では誤り。`array.empty?` を使う。",
      ],
      references: [
        {
          label: "Ruby 公式リファレンス: 制御構造 (条件式と真偽値)",
          url: "https://docs.ruby-lang.org/ja/latest/doc/spec=2fcontrol.html",
        },
      ],
    },
  },
  {
    id: "rb-004",
    categoryId: "ruby-basics",
    difficulty: "beginner",
    type: "choice",
    question: "次のコードの出力は？",
    code: 'a = "hello"\nb = a\nb << " world"\nputs a',
    choices: ["hello", "hello world", "world", "TypeError"],
    answerIndex: 1,
    choiceExplanations: [
      "`b = a` は値のコピーではなく参照のコピー。b への破壊的変更は同じオブジェクトを指す a からも見える。",
      "正解。`b << \" world\"` は同じ String オブジェクトを破壊的に変更するので、a も b も指している中身が `\"hello world\"` になる。",
      "代入の場合 (`b = \" world\"`) なら b だけ変わるが、`<<` は元のオブジェクトを書き換える別物。",
      "Ruby の `<<` は文字列同士で型エラーになる演算子ではない (concat と等価)。型不整合エラーが出るのは数値と文字列の `+` などの場合。",
    ],
    hints: [
      "`a = b` は参照のコピー (同じオブジェクトを指す) です。",
      "`<<` は破壊的メソッドで、文字列自身を変更します。",
      "a と b は同じオブジェクトを指しており、片方を破壊的に変更すると参照元から見ても変化が反映されます。",
    ],
    explanation: {
      summary:
        "`<<` は破壊的に文字列を変更するため、同じオブジェクトを参照している a も変わって見える。",
      reason:
        "Ruby の変数はオブジェクトへの参照です。`b = a` で同じ String オブジェクトを 2 つの変数が指します。`<<` (concat) は新しい文字列を作らずにそのオブジェクト自体を変更するため、a 側にも反映されます。",
      beginnerExplanation:
        "Ruby の変数は「値そのもの」ではなく **「オブジェクトを指す矢印 (参照)」** です。\n\n`a = \"hello\"` を実行すると、メモリ上に \"hello\" という String オブジェクトが 1 つ作られ、変数 a がそれを指します。次に `b = a` と書くと、b は a と同じオブジェクトを指す矢印になります。コピーは作られません。\n\nここで `b << \" world\"` を実行します。`<<` は **既存のオブジェクトの中身を書き換える** 破壊的メソッドで、新しい String を作らずに同じオブジェクトに \" world\" を追記します。a も同じオブジェクトを指しているので、a から覗いても中身は \"hello world\" になっています。\n\nもし a を変えたくなければ、`b = a + \" world\"` (新しい String を返す非破壊的な `+`) や、`b = a.dup` (複製を作る) を使います。",
      modelSelfExplanation: {
        conclusion:
          "出力は `hello world`。`<<` が破壊的メソッドで、a と b が同じ String オブジェクトを参照しているため、b 経由の変更が a にも反映される。",
        reason:
          "Ruby では `b = a` は値コピーではなく参照コピーで、a と b は同じオブジェクトを指す。`<<` (alias: concat) は元のオブジェクトを直接書き換えるため、片方の変数経由で変更してももう片方から見ても変化が反映される。これに対し `b = a + \" world\"` は新しい String を生成して b に代入するだけで、a は元のまま。",
        example:
          "たとえば配列でも同じ。`arr = [1,2]; copy = arr; copy << 3` の後 arr は `[1,2,3]` になる。実務では「メソッド引数の配列を破壊的に変更したら呼び出し元にも影響した」というバグの典型例。`arr.dup` や `arr.frozen?` チェックで防ぐ。",
        pitfall:
          "`<<` (破壊的) と `+` (非破壊的) は紛らわしい。さらに `+=` は実は `a = a + b` の糖衣構文なので非破壊的という罠もある。意図を明確にしたいなら freeze や frozen_string_literal を使う。",
      },
      codeExample:
        'a = "hello"\nb = a\nb << " world"   # 破壊的、a も変わる\na  #=> "hello world"\n\n# 非破壊的にする\na = "hello"\nb = a + " world"  # 新しい String が返る\na  #=> "hello"\n\n# 完全に複製する\nb = a.dup',
      commonMistakes: [
        "`+=` は実は非破壊的 (`a = a + b`)。`<<` や `concat` だけが破壊的。",
        "イミュータブルにしたいなら `String#freeze` または `frozen_string_literal: true` マジックコメントを使う。",
      ],
      references: [
        {
          label: "Ruby 公式リファレンス: String#<< (concat)",
          url: "https://docs.ruby-lang.org/ja/latest/method/String/i/=3c=3c.html",
        },
        {
          label: "Ruby 公式リファレンス: Object#dup と freeze",
          url: "https://docs.ruby-lang.org/ja/latest/method/Object/i/dup.html",
        },
      ],
    },
  },
  {
    id: "rb-005",
    categoryId: "ruby-basics",
    difficulty: "beginner",
    type: "choice",
    question: "次のうち、Ruby のメソッド命名規則として正しいものは？",
    choices: [
      "破壊的メソッドは末尾に `!` を付ける慣習がある",
      "真偽値を返すメソッドは末尾に `?` を付ける慣習がある",
      "プライベートメソッドは末尾に `_` を付ける慣習がある",
      "1 と 2 の両方",
    ],
    answerIndex: 3,
    choiceExplanations: [
      "正しい慣習ではあるが、これだけでは不完全。`?` 付きの述語メソッド慣習も同時に存在する。",
      "正しい慣習ではあるが、これだけでは不完全。`!` 付きの破壊的メソッド慣習も同時に存在する。",
      "誤り。アンダースコアで可視性を表す慣習は Ruby にはない (Python の `_foo` のような慣習を混同している)。Ruby では `private` キーワードで明示する。",
      "正解。`!` (破壊的または要注意) と `?` (真偽値を返す) の 2 つは Ruby の標準的な命名慣習で、メソッド名の一部として認識される。",
    ],
    hints: [
      "`String#upcase!` のような破壊版のメソッドがあります。",
      "`Array#empty?`、`Integer#even?` のような述語メソッドがあります。",
      "破壊版・述語の慣習は両方とも実在しますが、可視性 (public/private) を末尾記号で区別する慣習はありません。",
    ],
    explanation: {
      summary:
        "`!` = 破壊的 / 注意が必要、`?` = 真偽値を返す、という慣習。",
      reason:
        "`!` と `?` はメソッド名の一部として認識される識別子で、Ruby のメソッド命名慣習として広く使われます。`!` は『破壊的』というより『驚きがある・要注意』のサインで、対応する非破壊版が存在する時に付けるのが原則 (例: `sort` と `sort!`)。",
      beginnerExplanation:
        "Ruby のメソッド名には、英数字以外に末尾に `!` と `?` の 2 つの記号を入れられます。これらはちゃんと意味があって、ライブラリの利用者にヒントを伝えるための慣習です。\n\n**`?` (クエスチョン) は「はい / いいえで答える質問」のメソッド** に付けます。`empty?` は「空ですか?」、`include?` は「含んでいますか?」、`even?` は「偶数ですか?」のように、true か false を返すメソッドの末尾に付けます。コードを読むときに「これは判定メソッドだな」と一目で分かります。\n\n**`!` (エクスクラメーション) は「注意してね」のサイン** です。多くの場合「元のオブジェクトを書き換える破壊的なメソッド」に付けます。`upcase` は新しい文字列を返すだけですが、`upcase!` は元の文字列そのものを大文字に変えてしまいます。同じ名前で `!` 無しの非破壊版が存在するときに付けるのが原則です。\n\nアンダースコア `_foo` で private を表すのは Python の慣習で、Ruby では `private` キーワードで明示します。混同しないように。",
      modelSelfExplanation: {
        conclusion:
          "Ruby の命名慣習として `!` 付き (破壊的・要注意) と `?` 付き (真偽値を返す) の 2 つが実在する。アンダースコア付きで可視性を表す慣習は Ruby には無い。",
        reason:
          "`!` と `?` はメソッド名の一部として Ruby パーサに認識される識別子。ライブラリ利用者に「このメソッドは要注意 / 判定用」というコントラクトを名前だけで伝えるための歴史的な慣習で、標準ライブラリ (String, Array, Hash, Integer など) でも一貫して使われている。一方で可視性は `private` / `protected` キーワードで明示的に宣言する文化なので、名前の prefix/suffix で表す慣習は存在しない。",
        example:
          "たとえば `arr = [3,1,2]` に対し `arr.sort` は `[1,2,3]` を返すだけで arr は変わらないが、`arr.sort!` は arr 自体を並び替える。`5.even?` は false、`6.even?` は true。Rails では `user.save` (失敗時 false を返す) と `user.save!` (失敗時例外を投げる) のように、`!` で「失敗時の挙動が違う」という意味でも使われる。",
        pitfall:
          "「`!` は破壊的」と単純化しすぎると Rails の `save!` (例外を投げる、非破壊的) などで混乱する。`!` は『非破壊版より驚きがある』全般のサインと覚えるのが安全。また `?` メソッドが必ず true/false を返すとは限らず、`Regexp#match` のように MatchData/nil を返すものもあるので戻り値はドキュメントで要確認。",
      },
      codeExample:
        'str = "hello"\nstr.upcase   #=> "HELLO" (元は変わらず)\nstr.upcase!  #=> "HELLO" (str 自体が変わる)\n\n[].empty?      #=> true\n5.zero?        #=> false\n3.odd?         #=> true\n"abc".include?("b") #=> true',
      commonMistakes: [
        "対応する非破壊版が無いのに `!` を付けるのは慣習違反 (例: `delete!` が単独であるのは紛らわしい)。",
        "`?` 付きメソッドは true/false ではなく nil/値 を返すこともある (例: `Regexp#match?` は true/false だが `Regexp#match` は MatchData/nil)。",
      ],
      references: [
        {
          label: "Ruby 公式リファレンス: メソッド呼び出し (識別子の規則)",
          url: "https://docs.ruby-lang.org/ja/latest/doc/spec=2fcall.html",
        },
        {
          label: "RuboCop Style/MethodCallWithoutArgsParentheses 等の Style cops",
          url: "https://docs.rubocop.org/rubocop/cops_naming.html",
        },
      ],
    },
  },
  {
    id: "rb-006",
    categoryId: "ruby-basics",
    difficulty: "beginner",
    type: "text",
    question:
      '"hello world" を全て大文字に変換する String のメソッド名は？(メソッド名のみ、例: foo_bar)',
    answers: ["upcase"],
    hints: [
      "String クラスのインスタンスメソッドです。",
      "反対のメソッドは `downcase` です。",
      "`downcase` の対になる動詞 1 つで、6 文字のメソッド名です。`!` を付けた破壊版もペアで存在します。",
    ],
    explanation: {
      summary: "`String#upcase` は文字列をすべて大文字に変換する。",
      reason:
        "大文字小文字変換系は upcase / downcase / capitalize (先頭だけ大文字) / swapcase (大小入れ替え) の 4 つ。すべて末尾に `!` を付けた破壊版も存在します。",
      beginnerExplanation:
        "Ruby の String クラスには、大文字小文字を切り替える便利なメソッドが 4 つそろっています。\n\n- `upcase` → 全部を大文字にする (例: \"Hello\" → \"HELLO\")\n- `downcase` → 全部を小文字にする (例: \"Hello\" → \"hello\")\n- `capitalize` → 先頭だけ大文字、残りは小文字 (例: \"hello world\" → \"Hello world\")\n- `swapcase` → 大文字と小文字を入れ替え (例: \"Hello\" → \"hELLO\")\n\nどれも非破壊的に新しい文字列を返します。元の文字列も変えたいときは末尾に `!` を付けた破壊版 (`upcase!`, `downcase!`, ...) を使います。\n\nメソッド名はそのまま英語の動詞なので「大文字化したい → up + case で upcase」と覚えると忘れません。",
      modelSelfExplanation: {
        conclusion:
          "メソッド名は `upcase`。String の非破壊的メソッドで、新しい大文字版の文字列を返す。",
        reason:
          "Ruby の文字列ケース変換は upcase / downcase / capitalize / swapcase の 4 種類で、命名は英語の動詞そのまま。upcase は U+0041〜U+005A の範囲 (アスキー大文字) に加え、Ruby 2.4 以降はマルチバイト文字 (ä → Ä など Unicode 全般) にも対応している。",
        example:
          "たとえばユーザーが入力した email を保存前に正規化したいなら `email = params[:email].downcase.strip`。記事タイトルを画面表示で強調したいときは `title.upcase`。先頭だけ大文字にしたい人名表記なら `name.capitalize`。",
        pitfall:
          "破壊版 `upcase!` は変更がなかった場合 (元から全部大文字) は nil を返す仕様。`x = str.upcase!; x.length` のように直接チェインすると NoMethodError になる。返り値で判断したいなら非破壊版を使う。",
      },
      codeExample:
        '"hello".upcase      #=> "HELLO"\n"HELLO".downcase    #=> "hello"\n"hello".capitalize  #=> "Hello"\n"Hello".swapcase    #=> "hELLO"\n\n# 破壊版\ns = "hello"\ns.upcase!  #=> "HELLO"\ns          #=> "HELLO"',
      commonMistakes: [
        "破壊版 `upcase!` は変更がなければ nil を返す。チェインしていると NoMethodError の原因になる。",
      ],
      references: [
        {
          label: "Ruby 公式リファレンス: String#upcase",
          url: "https://docs.ruby-lang.org/ja/latest/method/String/i/upcase.html",
        },
        {
          label: "Ruby 公式リファレンス: String クラス (大小変換メソッド一覧)",
          url: "https://docs.ruby-lang.org/ja/latest/class/String.html",
        },
      ],
    },
  },
  {
    id: "rb-007",
    categoryId: "ruby-basics",
    difficulty: "intermediate",
    type: "choice",
    question: "次のコードの出力は？",
    code: 'name = "Alice"\nputs "Hello, #{name}!"\nputs \'Hello, #{name}!\'',
    choices: [
      "Hello, Alice! / Hello, Alice!",
      "Hello, Alice! / Hello, #{name}!",
      "Hello, #{name}! / Hello, Alice!",
      "両方ともエラー",
    ],
    answerIndex: 1,
    choiceExplanations: [
      "両方で式展開が動くわけではない。シングルクォートは式展開を解釈しないので 2 行目は文字どおり表示される。",
      "正解。ダブルクォートは式展開と `\\n` などのエスケープを解釈、シングルクォートはリテラル通り (`\\\\` と `\\'` だけは解釈)。",
      "順序が逆。式展開が動くのはダブルクォートの方なので 1 行目で `Alice` に置換される。",
      "シングルクォートでも `#{...}` は単なる文字として扱われるだけでエラーにはならない。",
    ],
    hints: [
      "ダブルクォートとシングルクォートには違いがあります。",
      "式展開 `#{}` が動くのはどちらか？",
      "シングルクォートでは `#{}` がそのまま文字列として表示されます。",
    ],
    explanation: {
      summary: "ダブルクォートのみ式展開とエスケープシーケンスが有効。",
      reason:
        'シングルクォート文字列はリテラル通り (ほぼ raw string)、ダブルクォート文字列は `#{式}` の式展開と `\\n` などのエスケープシーケンスを解釈します。パフォーマンス差はほぼ無いので「式展開・改行コードを使うか」で選び、なるべくダブルクォート優位で書く流派が多いです。',
      beginnerExplanation:
        "Ruby の文字列にはクォート (引用符) が 2 種類あって、見た目は似ていても挙動が違います。\n\n- **ダブルクォート `\"...\"`** は『中身を解釈する』クォート。`#{変数や式}` を書くと、その値で置き換えられます (これを「式展開」または「文字列補間」と呼びます)。また `\\n` (改行)、`\\t` (タブ) のようなエスケープシーケンスも展開します。\n- **シングルクォート `'...'`** は『書いたまま』のクォート。`#{name}` と書いても文字としての \"#{name}\" がそのまま入ります。エスケープも `\\\\` (バックスラッシュ自身) と `\\'` (シングルクォート自身) の 2 種類しか解釈しません。\n\nつまり「変数の値を埋め込みたい」「改行を入れたい」場合はダブルクォート、「`#{}` や `\\n` を文字として残したい (例: 正規表現や JSON の生文字列)」場合はシングルクォート、と使い分けます。\n\nどちらでも作られるオブジェクトはただの String なので、できあがった後は区別がありません。書く側の表現の違いだけです。",
      modelSelfExplanation: {
        conclusion:
          "1 行目は `Hello, Alice!`、2 行目は `Hello, #{name}!` が出力される。ダブルクォートは式展開を解釈し、シングルクォートはリテラル通り扱うから。",
        reason:
          "Ruby のパーサはクォートの種類を見て解釈モードを切り替える。ダブルクォートでは `#{}` の中身を Ruby 式として評価して文字列化、さらに `\\n`/`\\t`/`\\\\` などのバックスラッシュ列をエスケープとして解釈する。シングルクォートはほぼ raw string で、`\\'` と `\\\\` の 2 種類だけ解釈する。",
        example:
          "たとえばログ出力なら `\"[#{Time.now}] #{level}: #{msg}\"` のようにダブルクォートで変数を埋め込むのが定番。逆に正規表現や Windows パス、サンプルコードを文字列として表示したいときは `'C:\\\\Users\\\\#{name}'` のようにシングルクォートで生のまま書ける。",
        pitfall:
          "RuboCop のデフォルト規約 (Style/StringLiterals) は『式展開不要ならシングルクォート』だが、Rails アプリの多くは可読性重視でダブルクォート統一にしている。プロジェクト全体のスタイルに合わせるのが優先。さらに、シングルクォート内で `\\n` を書いても改行にはならず文字列として 2 文字 (`\\` と `n`) になる点もハマりやすい。",
      },
      codeExample:
        'n = 3\n"#{n} 回"    #=> "3 回"\n\'#{n} 回\'   #=> "#{n} 回"\n\n"a\\nb"   #=> "a\nb" (改行)\n\'a\\nb\'  #=> "a\\\\nb" (バックスラッシュとn)',
      commonMistakes: [
        "Rubocop の Style/StringLiterals は式展開不要ならシングルクォート推奨だが、Rails アプリの多くはダブルクォート統一。プロジェクト規約に合わせる。",
        "シングルクォート内で `\\n` を書いても改行にはならない (文字としての `\\n`)。改行が欲しいなら必ずダブルクォート。",
      ],
      references: [
        {
          label: "Ruby 公式リファレンス: 文字列リテラル (式展開・エスケープ)",
          url: "https://docs.ruby-lang.org/ja/latest/doc/spec=2fliteral.html#string",
        },
      ],
    },
  },
  {
    id: "rb-008",
    categoryId: "ruby-basics",
    difficulty: "intermediate",
    type: "choice",
    question: "次のコードの出力は？",
    code: "x = 10\nputs x.respond_to?(:even?) ? x.even? : 'no method'",
    choices: ["true", "false", "'no method'", "NoMethodError"],
    answerIndex: 0,
    choiceExplanations: [
      "正解。Integer は `even?` を持つので三項演算子の条件は true。さらに 10 は偶数なので `10.even?` が true を返す。",
      "false になるのは 10 が奇数の場合だが、10 は偶数。",
      "respond_to? の戻り値が false (= メソッドを持たない) の場合に出るが、Integer は標準で even? を持つのでこの分岐には来ない。",
      "メソッドを持たないオブジェクトに直接 `even?` を呼ぶと出るが、ここでは respond_to? で事前にガードしているので発生しない。",
    ],
    hints: [
      "`respond_to?` は、そのオブジェクトがメソッドを持っているかを返します。",
      "`Integer#even?` は標準メソッドです。",
      "Integer は標準で `even?` を持つので、三項演算子の左辺 (条件) は真。`even?` 自体の戻り値で 10 の偶奇を判断してください。",
    ],
    explanation: {
      summary:
        "Integer は `even?` を持ち、10 は偶数なので true が出力される。",
      reason:
        "`respond_to?(:メソッド名)` はオブジェクトがそのメソッドを呼べるかを返します。動的にメソッド存在をチェックしたいときに使います。Duck Typing と組み合わせて型ではなく振る舞いで分岐できます。",
      beginnerExplanation:
        "このコードは「ガード付きメソッド呼び出し」の典型例です。順を追って読みましょう。\n\n1. `x = 10` で x に整数 10 を代入。\n2. `x.respond_to?(:even?)` で「x は `even?` というメソッドを持っているか?」を問い合わせます。Integer クラスには `even?` が定義されているので、これは true を返します。\n3. 三項演算子 `条件 ? A : B` は、条件が真なら A、偽なら B を返す書き方です。今回は条件が真なので A の `x.even?` が評価されます。\n4. `10.even?` は『10 は偶数か?』。偶数なので true が返り、puts で出力されます。\n\nなぜ `x.even?` を直接呼ばずに `respond_to?` でガードするかというと、x が将来 Integer 以外 (例えば文字列や nil) になっても安全だからです。これを **Duck Typing (ダックタイピング)** と言い、『型ではなく振る舞いで分岐する』Ruby らしい書き方です。",
      modelSelfExplanation: {
        conclusion:
          "出力は `true`。Integer は標準で `even?` を持つので respond_to? の判定が true となり、その後の `10.even?` も偶数なので true を返すから。",
        reason:
          "`respond_to?(:sym)` はオブジェクトがそのメソッドを呼び出せる状態にあるかを問い合わせる仕組み。クラスを直接調べる代わりに『振る舞いを満たすか』で分岐する Duck Typing の核となるメソッド。三項演算子と組み合わせれば、メソッドがあるときだけ呼び、無ければフォールバック値を返す安全なディスパッチが書ける。",
        example:
          "実務では、複数の型を受け取る関数で `if obj.respond_to?(:each); obj.each { ... }; end` のように使う。Enumerable をミックスインした自作クラスでも、Array でも、Range でも同じコードで処理できる。Rails の serializer などでも、オブジェクトが特定の表現メソッドを持つかで分岐する場面で頻出。",
        pitfall:
          "`respond_to?` はデフォルトでは public メソッドしか検出しない。private メソッドも含めたいなら第 2 引数に true を渡す: `obj.respond_to?(:foo, true)`。また `method_missing` で動的にメソッドを生成しているオブジェクトには嘘の結果を返すことがあるので、その場合は `respond_to_missing?` 側も実装する必要がある。",
      },
      codeExample:
        "10.respond_to?(:even?)   #=> true\n\"a\".respond_to?(:even?)  #=> false\n10.respond_to?(:foo)     #=> false\n\n# Duck Typing\nif obj.respond_to?(:each)\n  obj.each { |x| puts x }\nend",
      commonMistakes: [
        "`respond_to?` はプライベートメソッドを検出しない。第2引数に true を渡すと検出する: `obj.respond_to?(:foo, true)`",
        "`method_missing` で動的にメソッドを定義する場合、対になる `respond_to_missing?` も実装しないと respond_to? が嘘を返す。",
      ],
      references: [
        {
          label: "Ruby 公式リファレンス: Object#respond_to?",
          url: "https://docs.ruby-lang.org/ja/latest/method/Object/i/respond_to=3f.html",
        },
        {
          label: "Ruby 公式リファレンス: Integer#even?",
          url: "https://docs.ruby-lang.org/ja/latest/method/Integer/i/even=3f.html",
        },
      ],
    },
  },
  {
    id: "rb-009",
    categoryId: "ruby-basics",
    difficulty: "intermediate",
    type: "text",
    question:
      "整数 `123` を文字列 `\"123\"` に変換するメソッド名は？(メソッド名のみ)",
    answers: ["to_s"],
    hints: [
      "to_xxx 系の変換メソッドの 1 つ。",
      "to_string ではありません。",
      "Ruby の変換メソッドは `to_` + クラスを表す 1 文字の組み合わせが多く、String 用は s 1 文字。",
    ],
    explanation: {
      summary: "`to_s` は to string の略。",
      reason:
        "Ruby の型変換は `to_s` (文字列)、`to_i` (整数)、`to_f` (浮動小数)、`to_a` (配列)、`to_h` (ハッシュ) など短縮形で統一されています。`to_str` のような末尾フル名は「暗黙の変換」を意味し、内部用です。",
      beginnerExplanation:
        "Ruby の型変換メソッドは `to_` + クラスを表す短い文字で統一されています。一度覚えれば全クラスで通用するルールです。\n\n- `to_s` → 文字列 (String) へ。例: `123.to_s` → `\"123\"`\n- `to_i` → 整数 (Integer) へ。例: `\"42\".to_i` → `42`\n- `to_f` → 浮動小数 (Float) へ。例: `\"3.14\".to_f` → `3.14`\n- `to_a` → 配列 (Array) へ。例: `(1..3).to_a` → `[1, 2, 3]`\n- `to_h` → ハッシュ (Hash) へ。例: `[[:a, 1]].to_h` → `{a: 1}`\n- `to_sym` → シンボル (Symbol) へ。例: `\"hello\".to_sym` → `:hello`\n\n書きながら覚えるなら **to_ + クラスの頭文字 1 文字 (Symbol だけは sym と 3 文字)** と憶えるとシンプルです。`to_string` や `to_integer` のような長い名前ではない、というのが他の言語からの移行でつまずきやすいポイントです。\n\n表示や文字列補間 (`\"#{x}\"`) では自動的に to_s が呼ばれるので、明示的に書かなくても文字列化されることが多いですが、型を確実に揃えたいときには手動で `to_s` を付けます。",
      modelSelfExplanation: {
        conclusion:
          "メソッド名は `to_s` (to string の略)。整数 123 に対して呼ぶと文字列 `\"123\"` を返す。",
        reason:
          "Ruby は明示的な型変換メソッドを `to_` + 短い接尾辞で統一している (to_s / to_i / to_f / to_a / to_h / to_sym)。すべてのクラスでこの命名が一貫しているため、組み込み型でもユーザー定義クラスでもメソッド名を覚え直す必要がない。文字列補間や `puts` の出力時には自動で to_s が呼ばれるので、自作クラスに `def to_s` を実装すれば見栄えのいい文字列化を提供できる。",
        example:
          "たとえばログ出力で `\"User ##{user_id}\"` と書くと、user_id が Integer なら自動的に to_s が呼ばれて文字列に埋め込まれる。HTTP リクエストの URL 組み立てでも `\"/users/#{id}.json\"` のように整数を文字列に混ぜる場面で必須。自分で URL を組み立てる Rails のコントローラなどで頻繁に登場。",
        pitfall:
          "`to_s` は失敗しない (どんな値も何らかの文字列を返す) が、対になる `to_i` は失敗時に 0 を返す仕様で、入力エラーに気付けない。厳密にしたいなら Kernel の `Integer(\"abc\")` を使うと ArgumentError で例外が出る。また `to_str` は別物で、Ruby 内部の『暗黙の型変換』に使う特別なメソッドなので一般コードでは呼ばない。",
      },
      codeExample:
        '123.to_s        #=> "123"\n"123".to_i      #=> 123\n"abc".to_i      #=> 0 (失敗時)\nInteger("abc")  #=> ArgumentError (厳格版)\n\n3.14.to_i       #=> 3 (切り捨て)\n"3.14".to_f     #=> 3.14',
      commonMistakes: [
        "`to_i` は失敗時に 0 を返す。エラーで気付きたい時は Kernel の `Integer(\"abc\")` を使う。",
        "`to_s` と `to_str` は別物。to_str は Ruby 内部の暗黙変換用で、一般コードで呼ぶことはほぼない。",
      ],
      references: [
        {
          label: "Ruby 公式リファレンス: Object#to_s",
          url: "https://docs.ruby-lang.org/ja/latest/method/Object/i/to_s.html",
        },
        {
          label: "Ruby 公式リファレンス: Kernel.#Integer (厳格な変換)",
          url: "https://docs.ruby-lang.org/ja/latest/method/Kernel/m/Integer.html",
        },
      ],
    },
  },
  {
    id: "rb-010",
    categoryId: "ruby-basics",
    difficulty: "intermediate",
    type: "choice",
    question: "次のコードの出力は？",
    code: 'def greet(name = "world")\n  "hello, #{name}"\nend\n\nputs greet\nputs greet("Ruby")',
    choices: [
      "hello, / hello, Ruby",
      "hello, world / hello, Ruby",
      "ArgumentError / hello, Ruby",
      "hello, world / hello, world",
    ],
    answerIndex: 1,
    choiceExplanations: [
      "引数を省略した時に空文字になるのは Python の `def f(x=None)` などの場合。Ruby ではデフォルト値 `\"world\"` が使われるので空にはならない。",
      "正解。1 回目は引数省略でデフォルトの `\"world\"`、2 回目は明示的に渡した `\"Ruby\"` が name に入る。",
      "デフォルト引数があるため引数なしでも ArgumentError にはならない。エラーになるのはデフォルトのない必須引数を省略した時だけ。",
      "2 回目は明示的に \"Ruby\" を渡しているので、デフォルト値ではなくその値が name に入る。明示指定はデフォルトより優先される。",
    ],
    hints: [
      "デフォルト引数が定義されています。",
      "引数なしで呼ぶと、デフォルト値が使われます。",
      "引数指定があれば渡した値、無ければ仮引数の右辺が `name` に入る、と整理して 2 つの出力を順に組み立ててください。",
    ],
    explanation: {
      summary: "デフォルト引数は呼び出し時に引数省略するとその値が使われる。",
      reason:
        "Ruby のメソッドは `def name(arg = デフォルト値)` でデフォルト引数を設定できます。デフォルト値は呼び出し毎に評価されるので、`Time.now` のような動的な値も使えます。",
      beginnerExplanation:
        "メソッド定義の `def greet(name = \"world\")` は『引数 name のデフォルト値は \"world\" ですよ』という意味です。\n\n- `greet` (引数なし) で呼ぶと、name には \"world\" が入って `\"hello, world\"` が返ります。\n- `greet(\"Ruby\")` で呼ぶと、name には \"Ruby\" が入って `\"hello, Ruby\"` が返ります。\n\n**ポイント**: Ruby のデフォルト値は『呼び出し時に評価される』という性質があります。これは Python と違うところで、Python では `def f(x=[])` のように書くとリスト [] が定義時に 1 度だけ作られて使い回されてしまう (有名な落とし穴) ですが、Ruby では呼び出すたびに右辺が評価されるので毎回新しい値が使われます。\n\nそのため `def log(msg, time = Time.now)` と書けば、`time` は呼び出すたびに最新の時刻になります。動的なデフォルト値が安全に使えます。\n\nなお Ruby にはキーワード引数 (`def f(name:, role: \"user\")`) もあり、引数の意味を呼び出し側で明示できます。引数が増えてきたらキーワード引数にした方が読みやすくなります。",
      modelSelfExplanation: {
        conclusion:
          "1 行目は `hello, world`、2 行目は `hello, Ruby`。デフォルト引数 `name = \"world\"` は引数省略時のフォールバック値で、明示的に値を渡せばその値で上書きされる。",
        reason:
          "Ruby はメソッド定義で `仮引数 = 式` の形でデフォルト値を指定でき、呼び出し時に対応する位置の引数が省略されたら式を評価して使う。式は呼び出しごとに毎回評価されるため、Time.now や [] のような動的な値も毎回新規に作られて使われる。これは Python のように『定義時に 1 度だけ評価して使い回す』タイプの言語との重要な違い。",
        example:
          "実務では Rails のコントローラで `def index(page: params[:page] || 1)` のように使ったり、ユーティリティで `def http_client(adapter: Faraday.default_adapter)` のように差し替え可能なデフォルトを書く。ロガーの実装で `def log(msg, level: :info, at: Time.now)` のように複数の動的デフォルトを組み合わせるのも定番。",
        pitfall:
          "デフォルト値は呼び出しごとに毎回評価されるので、重い処理 (DB 問い合わせなど) をデフォルト値に書くと意外なコストになる。また、デフォルト引数の後ろに必須引数を置くと ArgumentError の原因になりやすいので、必須を前 / デフォルト付きを後ろに並べるのが原則 (キーワード引数を使うとこの制約から解放される)。",
      },
      codeExample:
        'def log(msg, time = Time.now)\n  puts "[#{time}] #{msg}"\nend\n\nlog("起動")  # 毎回 Time.now が評価される\n\n# キーワード引数も可\ndef create(name:, role: "user")\n  { name: name, role: role }\nend\ncreate(name: "Alice")  #=> {name: "Alice", role: "user"}',
      commonMistakes: [
        "デフォルトに `Time.now` を入れた場合、メソッド呼び出し毎に評価される (Python と違って定義時には評価されない)。これは Python と Ruby の重要な差。",
        "デフォルト引数の後ろに必須引数を置くと読みにくく ArgumentError の原因になる。順番は『必須 → デフォルト付き → *args → キーワード → &block』が定石。",
      ],
      references: [
        {
          label: "Ruby 公式リファレンス: メソッド定義 (デフォルト引数 / キーワード引数)",
          url: "https://docs.ruby-lang.org/ja/latest/doc/spec=2fdef.html",
        },
      ],
    },
  },
  {
    id: "rb-011",
    categoryId: "ruby-basics",
    difficulty: "intermediate",
    type: "choice",
    question:
      "Ruby の `unless` 文の説明として正しいものは？",
    choices: [
      "条件が true の時に実行する (if と同じ)",
      "条件が false / nil の時に実行する (if の反対)",
      "条件が nil の時のみ実行する",
      "条件が 0 の時に実行する",
    ],
    answerIndex: 1,
    choiceExplanations: [
      "if と同じ挙動になるのは順番が逆。unless は if の反対で、条件が偽 (falsy) のときだけ実行する。",
      "正解。`unless cond` は `if !cond` と等価。Ruby の falsy は false と nil の 2 つだけなので、cond がそのどちらかのときに本体が実行される。",
      "nil のときだけ実行するわけではない。false でも実行されるし、それ以外の値 (0, \"\", [] など) では実行されない。",
      "Ruby で 0 は truthy なので、unless の条件が 0 だと本体は実行されない。",
    ],
    hints: [
      "`unless` は「〜でない限り」という意味の英語。",
      "`if !condition` と等価です。",
      "「条件を反転した if」であり、Ruby で falsy として扱われる値はちょうど 2 種類だけだったことを思い出してください。",
    ],
    explanation: {
      summary: "`unless` は条件が false / nil の時に実行 (if の逆)。",
      reason:
        "`unless cond` は `if !cond` と等価で、否定条件を自然な英語で書けるシンタックスシュガー。後置 unless 修飾子も使えます: `do_something unless condition`。",
      beginnerExplanation:
        "`unless` は英語の「〜でない限り」「〜でなければ」をそのままコードにしたキーワードです。\n\n`unless 条件 then 本体 end` と書くと、**条件が偽 (false か nil) のときだけ** 本体が実行されます。これは `if !条件 then 本体 end` とまったく同じ意味です。\n\nなぜわざわざ unless があるかというと、否定形を `!` で書くと『!』が小さくて見落としやすいから。`unless user.admin?` は「管理者でない限り」と自然に読めますが、`if !user.admin?` は「もし NOT 管理者なら」とちょっと考える必要があります。\n\nさらに後置記法も便利です: `return unless valid?` は「正常でないならその場で return」という意味で、ガード節 (関数の冒頭で異常系を早めに抜ける書き方) によく使われます。\n\n注意点: `unless ... else` のように else 節を付けると逆さまの分岐になって読みにくいので避けます。否定条件の if が必要なときだけ unless を使う、というルールが目安です。",
      modelSelfExplanation: {
        conclusion:
          "`unless cond` は cond が false または nil のときだけ本体を実行する。意味的に `if !cond` と等価で、否定条件を自然な英語で書くためのシンタックスシュガー。",
        reason:
          "Ruby の制御構文は『英語として自然に読めること』を重視して設計されており、否定条件のガードや早期 return を読み下し可能にするため unless が用意されている。Ruby の真偽判定では false と nil だけが falsy なので、unless の発火条件はその 2 値に限られる。後置修飾子も使えて `do_something unless condition` の 1 行で書ける。",
        example:
          "Rails のコントローラで「ログイン済みでなければサインインへ」というガードを `redirect_to new_session_path unless logged_in?` と 1 行で書ける。サービス層なら `raise InvalidInput unless params[:email].present?` のように、不正な状態を早く弾くのに使う。",
        pitfall:
          "`unless ... else` は二重否定で読みにくいので避け、`if cond ... else ... end` に書き直すのが定石 (RuboCop の Style/UnlessElse も警告)。同様に `unless a && !b` のような複合否定も混乱の元なので、条件を変数に抜き出すか if で書き直すと安全。",
      },
      codeExample:
        'unless user.admin?\n  redirect_to root_path\nend\n# 同じ意味\nif !user.admin?\n  redirect_to root_path\nend\n\n# 後置記法\nreturn unless valid?\nputs "OK" unless errors.any?',
      commonMistakes: [
        "`unless ~ else` は読みにくいので避ける (RuboCop でも警告)。`if` で書き直す。",
        "複雑な条件 (`unless a && !b`) も避ける。否定の入れ子は混乱の元。",
      ],
      references: [
        {
          label: "Ruby 公式リファレンス: 制御構造 (unless)",
          url: "https://docs.ruby-lang.org/ja/latest/doc/spec=2fcontrol.html#unless",
        },
        {
          label: "RuboCop Style/UnlessElse",
          url: "https://docs.rubocop.org/rubocop/cops_style.html#styleunlesselse",
        },
      ],
    },
  },
  {
    id: "rb-012",
    categoryId: "ruby-basics",
    difficulty: "intermediate",
    type: "text",
    question:
      "ある変数 `x` が nil でなければそのメソッドを呼び、nil なら nil を返す Ruby の演算子は？(記号のみ、例: ?=)",
    answers: ["&.", "&. "],
    hints: [
      "「ぼっち演算子」と呼ばれます。",
      "Ruby 2.3 で導入されました。",
      "JavaScript の `?.` に相当する 2 文字の記号で、通常のメソッド呼び出しのドットを少し変えた形です。",
    ],
    explanation: {
      summary: "`&.` (ぼっち演算子) はレシーバが nil なら nil を返す。",
      reason:
        "メソッドチェーンの途中で nil が来る可能性がある時、毎回 `if x` のガードを書かずに済みます。JavaScript の Optional Chaining (`?.`) や C# の `?.` と同等。",
      beginnerExplanation:
        "`&.` は **「ぼっち演算子 (lonely operator)」** と呼ばれます。`&` が一人ぼっちで座っている人に見えるのが名前の由来です。\n\n使い方は通常のメソッド呼び出しの `.` を `&.` に置き換えるだけ。違いは「レシーバ (左側のオブジェクト) が nil のときの振る舞い」です。\n\n- 通常の `user.name`: user が nil だと `NoMethodError: undefined method 'name' for nil` でクラッシュ。\n- `user&.name`: user が nil だと `nil` が返って何も起きない (短絡)。user が nil 以外なら通常通り name を呼ぶ。\n\nメソッドチェーンの途中で nil が来うる場面で特に便利です。`user&.profile&.name` と書けば、user か profile のどちらかが nil でも自然に nil が伝搬し、エラーになりません。\n\nJavaScript の Optional Chaining `user?.profile?.name` や C# の `?.` と同じ考え方です。Ruby 2.3 で導入されました。\n\n注意点: 『短絡するのは nil のときだけ』なので、false に対しては普通にメソッドが呼ばれます (`false&.to_s` は `\"false\"` を返す)。",
      modelSelfExplanation: {
        conclusion:
          "演算子は `&.` (ぼっち演算子)。レシーバが nil なら短絡して nil を返し、それ以外なら通常通りメソッドを呼ぶ。",
        reason:
          "Ruby 2.3 で導入された Safe Navigation Operator で、nil の伝搬を 1 文字の記号で簡潔に書けるようにする糖衣構文。意味としては `x.nil? ? nil : x.foo` と等価だが、表現がコンパクトでメソッドチェーンが読みやすくなる。短絡判定は false ではなく nil 限定なので、ブール値を返すメソッドチェーンに対しても直感に近い挙動を保てる。",
        example:
          "Rails で `current_user&.admin?` を if 文の条件に置くと、未ログイン時 (nil) は nil = falsy として扱われ管理画面を非表示にできる。`order&.items&.sum(:total)` のような集計でも、order が無いケースを 1 行で安全に処理できる。",
        pitfall:
          "`&.` の乱用は本来の nil ガードを隠してバグの温床になる。『ここは nil でないはず』という設計上の前提がある場所では、明示的に `raise` で気付く方が安全。また `&.` で短絡したときは nil が返るので、後続のチェーンで `.length` 等を呼ぶと結局 NoMethodError になり得る点も注意。",
      },
      codeExample:
        '# 従来\nname = user.nil? ? nil : user.profile.nil? ? nil : user.profile.name\n\n# &. を使うと\nname = user&.profile&.name\n\n# 配列のアクセス\narr&.[](0)        # 配列が nil でも安全\n\n# 注意: false に対しても呼ばれる (nil だけ短絡)\nfalse&.to_s       #=> "false" (呼ばれる)\nnil&.to_s         #=> nil    (呼ばれない)',
      commonMistakes: [
        "`&.` の乱用は nil 安全と見せかけて bug を隠す。本来 nil であってはならない箇所では明示的に検証する。",
        "`&.` で nil を返したあと、後続のチェーンに非 `&.` の `.` が混ざると結局 NoMethodError になる。",
      ],
      references: [
        {
          label: "Ruby 公式リファレンス: メソッド呼び出し (&. の項)",
          url: "https://docs.ruby-lang.org/ja/latest/doc/spec=2fcall.html",
        },
      ],
    },
  },
  {
    id: "rb-013",
    categoryId: "ruby-basics",
    difficulty: "intermediate",
    type: "choice",
    question: "次のコードの出力は？",
    code: 'a = "10"\nb = 20\nputs a + b.to_s\nputs a.to_i + b',
    choices: ["1020 / 30", "30 / 30", "1020 / 1020", "TypeError / 30"],
    answerIndex: 0,
    choiceExplanations: [
      "正解。1 行目は文字列同士の `+` なので結合 (\"10\" + \"20\" = \"1020\")、2 行目は整数同士の `+` なので加算 (10 + 20 = 30)。",
      "1 行目で文字列を整数として加算するには `a.to_i + b` のように変換が必要。`a + b.to_s` は文字列結合になる。",
      "2 行目では a を `to_i` で整数にしているので、整数同士の加算となり 30 になる。文字列結合ではない。",
      "両方とも明示的に型変換しているので TypeError にはならない。エラーになるのは型変換せずに混在させた場合 (`\"10\" + 20`)。",
    ],
    hints: [
      "`+` は文字列同士、数値同士で挙動が違います。",
      "文字列 + 文字列 は結合、数値 + 数値 は加算。",
      "1 行目は文字列同士の結合、2 行目は整数同士の加算として動くので、結果の見た目がまったく異なります。",
    ],
    explanation: {
      summary: "型変換しないと文字列結合と加算が混在する。",
      reason:
        "Ruby は型に厳格 (strict typing) なので、`\"10\" + 20` のような暗黙変換はせず `TypeError` を投げます。明示的に `to_s` / `to_i` で揃える必要があります。",
      beginnerExplanation:
        "Ruby の `+` 演算子は、両側の型によって意味が変わる **オーバーロードされた演算子** です。\n\n- 文字列 + 文字列 → **連結** (`\"hello\" + \" world\"` → `\"hello world\"`)\n- 整数 + 整数 → **加算** (`10 + 20` → `30`)\n- 配列 + 配列 → **結合** (`[1] + [2]` → `[1, 2]`)\n\nだから 1 行目の `a + b.to_s` は文字列 `\"10\"` と文字列 `\"20\"` の連結で `\"1020\"`、2 行目の `a.to_i + b` は整数 10 と整数 20 の加算で 30 になります。\n\nここで重要なのは、**Ruby は型の自動変換 (暗黙変換) をしない** という性質です。JavaScript なら `\"10\" + 20` が `\"1020\"` になる (数値が文字列に勝手に変換される) ところを、Ruby は `TypeError: no implicit conversion of Integer into String` と例外を投げます。\n\n意図しない結果を防げる安全設計ですが、その代わり開発者が `to_s` や `to_i` を明示的に書いて型を揃える必要があります。",
      modelSelfExplanation: {
        conclusion:
          "出力は 1 行目 `1020`、2 行目 `30`。Ruby の `+` は両辺の型で意味が変わり、文字列同士なら連結、整数同士なら加算になる。型混在のままだと TypeError なので明示変換が必須。",
        reason:
          "Ruby は静的型ではないが暗黙の型強制 (JS のような coercion) は行わない言語設計。Numeric#+ は数値同士、String#+ は文字列同士のみ受け取り、型違いには TypeError を投げる。これにより『数値と文字列をうっかり混ぜたバグ』を実行時に早く検知できる代わりに、開発者が to_s / to_i / to_f / Integer() / Float() などで明示変換する責務を負う。",
        example:
          "実務では、HTTP リクエストで受け取った params は基本すべて文字列なので、ID で DB を引くなら `User.find(params[:id].to_i)` のように整数化する。金額計算で `\"100\".to_i + tax` や、ログ出力で `\"User #{user.id}: #{age.to_s}\"` (実は文字列補間が自動 to_s してくれる) など、境界で型変換するのが定石。",
        pitfall:
          "`\"abc\".to_i` はエラーにならず 0 を返すので、入力バリデーション目的では使えない。厳密に検証したいなら Kernel の `Integer(\"abc\")` (例外を投げる) や正規表現マッチを併用する。逆に文字列補間 `\"#{x}\"` は自動的に to_s が呼ばれるので、ログや簡単な文字列組み立てでは明示変換不要。",
      },
      codeExample:
        '"10" + "20"   #=> "1020"   # 文字列結合\n10 + 20       #=> 30       # 加算\n"10" + 20     #=> TypeError\n"10".to_i + 20 #=> 30\n10.to_s + "20" #=> "1020"',
      commonMistakes: [
        "JS 経験者が `\"10\" + 20` を 30 と勘違いするが、Ruby はエラー。明示変換が必要。",
        "`to_i` は失敗時 0 を返すのでバリデーションには不向き。厳密な変換は `Integer(str)`。",
      ],
      references: [
        {
          label: "Ruby 公式リファレンス: String#+",
          url: "https://docs.ruby-lang.org/ja/latest/method/String/i/=2b.html",
        },
        {
          label: "Ruby 公式リファレンス: Integer#+",
          url: "https://docs.ruby-lang.org/ja/latest/method/Integer/i/=2b.html",
        },
      ],
    },
  },
  {
    id: "rb-014",
    categoryId: "ruby-basics",
    difficulty: "intermediate",
    type: "choice",
    question:
      "Ruby で「定数」を表す慣習はどれ？",
    choices: [
      "頭文字を小文字にする (例: my_const)",
      "頭文字を大文字にする (例: MyConst)",
      "全文字を大文字にする (例: MY_CONST)",
      "2 と 3 の両方が定数として解釈される",
    ],
    answerIndex: 3,
    choiceExplanations: [
      "小文字始まりはローカル変数。`my_const = 100` は単なる変数で、定数の警告は出ない。",
      "正しいが不完全。`MyConst` は確かに定数だが、`MY_CONST` も同じく定数として扱われる。",
      "正しいが不完全。`MY_CONST` は確かに定数だが、`MyConst` (クラス名形式) も同じく定数。",
      "正解。Ruby の構文ルールは『先頭が大文字かどうか』だけを見て定数判定する。CamelCase / SNAKE_CASE どちらも定数。",
    ],
    hints: [
      "Ruby は変数か定数かを識別子の最初の文字で判定します。",
      "頭文字が大文字 = 定数、それ以外 = 変数。",
      "Ruby の構文では「先頭の文字が大文字かどうか」だけが定数判定の条件で、それ以降の大小は問われません。",
    ],
    explanation: {
      summary:
        "Ruby では頭文字が大文字ならすべて定数扱い (クラス名も定数の一種)。",
      reason:
        "Ruby は構文上の区別を識別子の頭文字で行います: 小文字始まり = ローカル変数、大文字始まり = 定数、`@` = インスタンス変数、`@@` = クラス変数、`$` = グローバル変数。クラス名 `User` も実は `Object` の定数。",
      beginnerExplanation:
        "Ruby は識別子 (名前) の **頭文字** を見て、それが何かを判断します。\n\n- `name` (小文字始まり) → ローカル変数\n- `Name` や `NAME` (大文字始まり) → **定数**\n- `@name` → インスタンス変数\n- `@@name` → クラス変数\n- `$name` → グローバル変数\n\n大事なのは「2 文字目以降の大小は関係ない」こと。`MaxSize`, `MAX_SIZE`, `Maxsize` すべて定数として解釈されます。慣習として、**普通の定数は SCREAMING_SNAKE_CASE (`MAX_SIZE`)、クラス名は CamelCase (`UserService`)** と使い分けますが、Ruby の構文上の扱いはどちらも同じ『定数』です。\n\n面白いのは `class User ... end` も実は「`User` という定数に Class オブジェクトを代入している」のと等価だということ。だから `User` という名前を呼べば対応するクラスにアクセスできます。\n\nRuby の定数は『再代入すると警告だけ出して許す』という緩めの設計です。本当に変更不可にしたいなら `.freeze` を付けます。",
      modelSelfExplanation: {
        conclusion:
          "Ruby は識別子の頭文字が大文字なら無条件で定数扱いになる。`MyConst` (CamelCase) も `MY_CONST` (SCREAMING_SNAKE) も両方とも定数。",
        reason:
          "Ruby の lexer は識別子の先頭 1 文字でカテゴリを決定する設計で、変数 / 定数 / インスタンス変数 / クラス変数 / グローバル変数を 1 文字目で構文的に区別する。これにより『大文字で始まる名前を呼ぶと、現在のスコープにある定数を解決する』というルールが一貫して適用でき、クラス名 (User) や定数 (MAX_SIZE) を同じ仕組みで扱える。慣習的な使い分け (CamelCase = クラス / モジュール、SCREAMING_SNAKE = 値) は単なるコーディングスタイルで、構文上は同じ定数。",
        example:
          "`class User; end` は『User という定数に Class オブジェクトを代入する』のと等価で、`User = Class.new` と書くのとほぼ同じ。Rails の `MAX_LOGIN_ATTEMPTS = 5` や `DEFAULT_ROLE = :user` のような設定値も、`Admin = User` のようなエイリアスも全部同じ仕組みで動く。",
        pitfall:
          "Ruby の定数は『代入を変えると警告は出るが許される』緩い設計。さらに **中身が mutable なオブジェクトなら破壊的変更は警告も無く通る** (例: `LIST = []; LIST << 1` は警告なし)。本当に不変にしたいなら `LIST = [].freeze` のように freeze する、または Rails の `Hash#with_indifferent_access` のような不変ラッパを使う。",
      },
      codeExample:
        'MAX_SIZE = 100      # 定数\nPi = 3.14           # これも定数\nclass User; end     # 定数 User に Class を代入しているのと同じ\n\n# 定数の再代入は警告\nMAX_SIZE = 200      # warning: already initialized constant MAX_SIZE\n\n# でも中身は変更できる (mutable オブジェクトの場合)\nLIST = []\nLIST << 1           # 警告なし',
      commonMistakes: [
        "定数は値の再代入で警告するが、中身の変更 (mutate) は防げない。`.freeze` で対策。`LIST = [].freeze`",
      ],
      references: [
        {
          label: "Ruby 公式リファレンス: 変数と定数",
          url: "https://docs.ruby-lang.org/ja/latest/doc/spec=2fvariables.html",
        },
        {
          label: "Ruby 公式リファレンス: Object#freeze",
          url: "https://docs.ruby-lang.org/ja/latest/method/Object/i/freeze.html",
        },
      ],
    },
  },
  {
    id: "rb-015",
    categoryId: "ruby-basics",
    difficulty: "advanced",
    type: "choice",
    question: "次のコードの出力は？",
    code: "a = [1, 2, 3]\nb = a\na = a + [4]\np a\np b",
    choices: [
      "[1,2,3,4] / [1,2,3]",
      "[1,2,3,4] / [1,2,3,4]",
      "[1,2,3] / [1,2,3]",
      "[1,2,3] / [1,2,3,4]",
    ],
    answerIndex: 0,
    choiceExplanations: [
      "正解。`a = a + [4]` で a の指す先だけが新配列に更新される。b は元の配列を指したままなので [1,2,3]。",
      "両方 [1,2,3,4] になるのは `a << 4` のような破壊的操作の場合。`a + [4]` は新配列を返すので b には影響しない。",
      "`a = a + [4]` で a の参照は確かに切り替わるので [1,2,3,4] になる。a が変わっていない結果は誤り。",
      "順序が逆。再代入されたのは a の方なので a が [1,2,3,4]。b は元の配列を指し続けて [1,2,3] のまま。",
    ],
    hints: [
      "`a + [4]` は新しい配列を返します (非破壊)。",
      "`a = ...` で a の参照先が新しい配列に変わります。",
      "a の再代入で a の指す先だけが新オブジェクトに切り替わり、b は元のオブジェクトを指したまま変化しません。",
    ],
    explanation: {
      summary:
        "`+` は新しい配列を返すので、a を再代入しても b には影響しない。",
      reason:
        "Ruby の代入は『参照のコピー』。`a + [4]` は新しい Array を生成し、`a = ...` で a の指す先を更新するだけ。元の配列は変わらず、b はそれを指したまま。一方 `a << 4` や `a.push(4)` だと破壊的で b も変わって見えます。",
      beginnerExplanation:
        "Ruby の変数は『箱』ではなく『矢印 (参照)』だと考えると、この挙動が腑に落ちます。\n\n1. `a = [1, 2, 3]` → メモリ上に配列 [1,2,3] が 1 つ作られ、a がそれを指す矢印になる。\n2. `b = a` → b は a と同じ配列を指す矢印になる。**コピーは作られない**。\n3. `a = a + [4]` → `a + [4]` は **新しい配列 [1,2,3,4]** を作って返す。続く `a = ...` で a の矢印を新配列に **付け替える**。元の配列 [1,2,3] は変更されていない。b はそれを指したまま。\n4. 結果: a は [1,2,3,4] (新配列)、b は [1,2,3] (元の配列のまま)。\n\n**ここがポイント**: `+` は非破壊的 (新オブジェクトを返す) だから、`a` の矢印を付け替えるだけで `b` には影響しません。\n\n対比として `a << 4` を使うと話は変わります。`<<` は **元の配列を直接書き換える** 破壊的メソッド。b と a が同じ配列を指しているので、a << 4 の後は b 経由で見ても [1,2,3,4] になっています。\n\nそして `+=` は罠です。`a += [4]` は `a = a + [4]` の糖衣構文 (非破壊)。見た目が破壊的に見えても実は新配列を作って付け替えているだけ。だから `<<` と `+=` は挙動が違うんです。",
      modelSelfExplanation: {
        conclusion:
          "a は [1,2,3,4]、b は [1,2,3]。`a + [4]` が新しい配列を生成し、`a = ...` で a の参照を付け替えるだけだから、元の配列を指す b は変化しない。",
        reason:
          "Ruby の変数はオブジェクトへの参照で、代入は『矢印の付け替え』。`Array#+` は新しい配列インスタンスを返す非破壊的メソッドで、レシーバ側を一切変更しない。`a = a + [4]` は『a が指す配列に対し + を計算 → 新配列を生成 → a の矢印だけを更新』という 3 段階の操作で、b は元の配列を指し続ける。破壊的に追加する `<<` (push の別名) や `concat` は元の配列を書き換えるため、共有参照経由で b 側にも影響が見える。",
        example:
          "メソッド引数の防御として『副作用を出したくないので新配列を返す』のが Ruby の慣用句。例えば `def add(arr, x); arr + [x]; end` なら呼び出し側に影響を与えない。逆に意図せず `arr << x` を書くと、呼び出し側のオブジェクトを書き換えてしまい、デバッグしにくいバグになる。Rails の has_many コレクションでも、`@user.posts + Post.recent` (新配列) と `@user.posts << post` (DB に保存される破壊的追加) では意味がまったく違う。",
        pitfall:
          "`+=` は破壊的に見えて実は非破壊的という Ruby の有名な罠。`a += [4]` は `a = a + [4]` の糖衣構文で、新オブジェクトを作って付け替えるだけ。一方 `<<` や `push` や `concat` は元のオブジェクトを直接書き換える。共有参照がある場面では『非破壊 = a を再代入で切り替え』『破壊 = a と b 両方に影響』を意識しないとバグの原因になる。",
      },
      codeExample:
        "a = [1, 2, 3]\nb = a       # b と a は同じオブジェクトを指す\n\na = a + [4] # 新しい配列が a に\na  #=> [1,2,3,4]\nb  #=> [1,2,3]\n\n# 破壊的にすると\na = [1, 2, 3]\nb = a\na << 4\nb  #=> [1,2,3,4]   ← b も変わる",
      commonMistakes: [
        "`+=` も `<<` も同じだと思いがちだが、`a += [4]` は `a = a + [4]` の糖衣構文で非破壊。`<<` だけが破壊的。",
      ],
      references: [
        {
          label: "Ruby 公式リファレンス: Array#+",
          url: "https://docs.ruby-lang.org/ja/latest/method/Array/i/=2b.html",
        },
        {
          label: "Ruby 公式リファレンス: Array#<< (push)",
          url: "https://docs.ruby-lang.org/ja/latest/method/Array/i/=3c=3c.html",
        },
      ],
    },
  },
  {
    id: "rb-016",
    categoryId: "ruby-basics",
    difficulty: "advanced",
    type: "choice",
    question:
      "Ruby の `==` と `equal?` の違いとして正しいものは？",
    choices: [
      "`==` は値が等しいか、`equal?` は同一オブジェクトかをチェック",
      "`==` は同一オブジェクトか、`equal?` は値が等しいかをチェック",
      "両方とも同じ動作",
      "`equal?` は Ruby に存在しない",
    ],
    answerIndex: 0,
    choiceExplanations: [
      "正解。`==` は『値が等しいか』(各クラスが意味を定義)、`equal?` は『object_id が一致するか』(同一オブジェクト性)。",
      "役割が逆。記号 `==` が値比較、メソッド名 `equal?` が同一性比較。他言語経験者がハマりやすい。",
      "Object#== の標準実装は equal? と同じ (同一性) だが、String や Integer などほとんどのクラスで == は値比較に override されているので動作は異なる。",
      "`equal?` は Object クラスに定義された実在のメソッドで、object_id 比較を行う。",
    ],
    hints: [
      "`equal?` は object_id 比較。",
      "`==` はオブジェクトの定義に従う (Object 標準は equal? と同じだが多くのクラスで override)。",
      "2 文字記号の方が「値としての等しさ」、メソッド呼び出しの方が「同一オブジェクトか」、と役割が逆にならないよう注意。",
    ],
    explanation: {
      summary:
        "`==` は『値の等価性』、`equal?` は『同一オブジェクト性』(object_id 比較)。",
      reason:
        "Ruby には 3 段階の等価判定があります: `equal?` (同一)、`eql?` (型も含めた厳密等価、Hash で使用)、`==` (緩い等価、各クラスで定義)。多くのケースで使うのは `==`。`equal?` はあまり override すべきではありません。",
      beginnerExplanation:
        "Ruby の等価判定には実は **3 段階** あります。混乱しがちですが、用途が違うので一度整理すれば迷いません。\n\n1. **`equal?`** — 「同じオブジェクトか?」を判定 (内部的に object_id を比較)。たとえ中身が同じでも、別のオブジェクトなら false。Object クラスで実装されていて、ほぼ override すべきではない。\n2. **`==`** — 「値として等しいか?」を判定。各クラスが意味を決める。String なら文字列内容、Array なら要素列、ユーザー定義クラスなら自分で定義可能。普段の比較はこれ。\n3. **`eql?`** — 「型も含めて厳密に等しいか?」。Hash のキー比較で使われる。`1` と `1.0` は `==` だと true だが `eql?` では false。\n\n名前と役割が直感に反するのが落とし穴です: 短い記号 `==` が緩い値比較、明示的なメソッド名 `equal?` が厳密な同一性比較。Java や C# の `==` と `equals()` の関係に近いですが、Ruby はメソッド名がさらに 1 つ多いと覚えてください。\n\n普段のコードで使うのはほぼ常に `==` です。`equal?` は「これとこれは本当に同じインスタンス?」を確かめたいデバッグ的な場面でのみ使います。",
      modelSelfExplanation: {
        conclusion:
          "Ruby では `==` が『値の等価性』(各クラスが定義)、`equal?` が『同一オブジェクト性』(object_id 比較) を意味する。普段使うのは `==`。",
        reason:
          "Ruby は 3 段階の等価判定を提供する: `equal?` (同一性、object_id 比較、override 非推奨) / `==` (緩い値比較、各クラスで定義) / `eql?` (厳密な型一致を含む値比較、Hash キー検索で使用)。これにより『値として等しいか』『型まで含めて等しいか』『そもそも同じ物か』を別々のメソッドで尋ねられ、用途に応じて使い分けられる。Object#== の既定実装は equal? と同じだが、String / Numeric / Array / Hash など主要クラスで == は値比較に上書きされている。",
        example:
          "Rails の test で `assert_equal expected, actual` は内部で `==` を使う。Hash のキーで Integer と Float を区別したい場合は eql? の挙動を意識する必要があり、たとえば `{ 1 => 'a' }[1.0]` は nil を返す (1 と 1.0 は ==-true だが eql?-false なので別キー扱い)。ActiveRecord でも `user1 == user2` は ID 一致で値比較、`user1.equal?(user2)` は同じインスタンスかどうかを判定する。",
        pitfall:
          "ユーザー定義クラスで `==` を override したら、ハッシュキーとして使うために `eql?` と `hash` メソッドもセットで実装しないと Hash や Set が誤動作する。また `equal?` を override するのは原則禁止 (object_id 比較が壊れると Ruby の挙動全般が予測不能になる)。",
      },
      codeExample:
        '"abc" == "abc"      #=> true   (値が同じ)\n"abc".equal?("abc") #=> false  (別オブジェクト)\n\n1 == 1.0            #=> true   (数値として等価)\n1.eql?(1.0)         #=> false  (型が違う)\n1.equal?(1)         #=> true   (Integer はキャッシュ)\n\n# Hash のキー比較は eql?\n{ 1 => "a" }[1.0]   #=> nil    (eql? で違うので)',
      commonMistakes: [
        "Hash のキーは `eql?` と `hash` で比較されるため、`1` と `1.0` は別キーとして扱われる。",
        "`==` を override したクラスを Hash キーに使うなら `eql?` と `hash` も合わせて実装する。",
      ],
      references: [
        {
          label: "Ruby 公式リファレンス: Object#==",
          url: "https://docs.ruby-lang.org/ja/latest/method/Object/i/=3d=3d.html",
        },
        {
          label: "Ruby 公式リファレンス: Object#equal?",
          url: "https://docs.ruby-lang.org/ja/latest/method/Object/i/equal=3f.html",
        },
        {
          label: "Ruby 公式リファレンス: Object#eql?",
          url: "https://docs.ruby-lang.org/ja/latest/method/Object/i/eql=3f.html",
        },
      ],
    },
  },
  {
    id: "rb-017",
    categoryId: "ruby-basics",
    difficulty: "advanced",
    type: "text",
    question:
      "Ruby で「メソッドチェーンを途中で評価したい」「中間値を確認したい」時に便利な、ブロック内の値を返す Object クラスのメソッドは？(メソッド名のみ)",
    answers: ["tap"],
    hints: [
      "Ruby 1.9 で追加されました。",
      "ブロックを実行するが、戻り値はレシーバ自身。",
      "3 文字の短いメソッド名で、英語で「軽く叩く・覗く」というニュアンス。`then` と対の関係です。",
    ],
    explanation: {
      summary: "`tap` はレシーバを返すブロック付きメソッド。デバッグに便利。",
      reason:
        "メソッドチェーンの途中で値を覗き見たり、初期化中のオブジェクトに対する設定処理をまとめたいときに使います。`then` (旧 `yield_self`) はブロックの戻り値を返すので逆のユースケース。",
      beginnerExplanation:
        "`tap` はとても便利な小さなメソッドです。役割を一言で言うと **「ブロックで何か処理しつつ、戻り値はレシーバそのまま」**。\n\n具体的に何が嬉しいかというと:\n\n**1. メソッドチェーンの途中で覗き見できる**\n`[1,2,3].map { ... }.select { ... }.sort` のようなチェーンの途中で中間結果を確認したいとき、`.tap { |x| p x }` を挟むだけで pp 出力できます。チェーンを分解しなくて済む。\n\n**2. 初期化処理をまとめられる**\n```ruby\nuser = User.new.tap do |u|\n  u.name = \"Alice\"\n  u.age  = 20\nend\n```\n`User.new` を返しつつ、ブロック内で設定もできる。3 行が 1 つの『user 初期化ブロック』に視覚的にまとまる。\n\n**3. ログを挟める**\n`return value.tap { |v| logger.info \"returning #{v}\" }` のように、return 直前にログを残せる。\n\n対義語的な存在として `then` (旧 `yield_self`) があります。tap は『副作用だけしてレシーバを返す』、then は『ブロックの結果に変換して返す』。チェーンを **覗くだけ → tap、変換 → then** と覚えると整理しやすいです。",
      modelSelfExplanation: {
        conclusion:
          "メソッド名は `tap`。ブロックにレシーバを渡して実行しつつ、戻り値はレシーバ自身を返す Object のインスタンスメソッド。",
        reason:
          "Ruby 1.9 で導入された `Object#tap` は『副作用を伴うチェーン途中の処理』を表現するためのメソッドで、ブロックの戻り値ではなくレシーバを返す点が `then` (旧 yield_self、ブロックの戻り値を返す) と対になる。これにより、メソッドチェーンを切らずにデバッグ出力・ロギング・初期化のためのブロックを挿入でき、コードの流れが視覚的に保たれる。",
        example:
          "Rails のコントローラで `@user = User.new.tap { |u| u.set_default_settings }` のように初期化と設定をまとめる。サービス層で `result.tap { |r| Rails.logger.info(\"computed: #{r.inspect}\") }` のように return 直前のログ。テストデータ生成で `posts.tap { |arr| arr << featured_post unless arr.include?(featured_post) }` のような後付け処理。",
        pitfall:
          "tap の中で意図せずレシーバを破壊的に変更すると、呼び出し元の値も変わってしまう。tap は『副作用ありで OK』なメソッドだが、書き換えるつもりなのか覗くだけなのかコメントなどで明示しないと、読み手が困る。また、変換が目的なら必ず then を使い、tap で `obj.tap { |o| o.transform }` のようにレシーバを書き換えるのは避けるのが定石。",
      },
      codeExample:
        '[1,2,3].tap { |a| puts "middle: #{a}" }.map { |x| x*2 }\n# middle: [1, 2, 3]\n#=> [2, 4, 6]\n\n# 初期化\nUser.new.tap do |u|\n  u.name = "Alice"\n  u.age  = 20\nend\n\n# then は変換用\n[1,2,3].then { |a| a.sum }   #=> 6',
      commonMistakes: [
        "変換が目的なら `then` (旧 yield_self) を使う。tap でレシーバを書き換えて変換代わりにすると読み手が混乱する。",
      ],
      references: [
        {
          label: "Ruby 公式リファレンス: Object#tap",
          url: "https://docs.ruby-lang.org/ja/latest/method/Object/i/tap.html",
        },
        {
          label: "Ruby 公式リファレンス: Object#then (yield_self)",
          url: "https://docs.ruby-lang.org/ja/latest/method/Object/i/then.html",
        },
      ],
    },
  },
  {
    id: "rb-018",
    categoryId: "ruby-basics",
    difficulty: "advanced",
    type: "choice",
    question: "次のコードの出力は？",
    code: 'a = "abc"\nb = a.dup\nc = a.clone\nputs a.equal?(b)\nputs a.equal?(c)',
    choices: ["true / true", "true / false", "false / false", "false / true"],
    answerIndex: 2,
    choiceExplanations: [
      "true になるのは同じオブジェクト同士の equal? 比較のみ。dup と clone はどちらも別オブジェクトを返すので true にはならない。",
      "dup は別オブジェクトなので equal? は false。順番に true が来ることはない。",
      "正解。dup と clone はどちらも『新しい別オブジェクト』を返すので、object_id を比較する equal? は両方とも false。",
      "clone も dup と同じく別オブジェクトを返すので equal? は false。違いは凍結や特異メソッドのコピー方針であって object_id は別。",
    ],
    hints: [
      "`dup` と `clone` はどちらもオブジェクトの複製を作ります。",
      "`equal?` は object_id 比較。",
      "dup も clone もどちらも『新しいオブジェクトを返す』点では共通なので、object_id 比較の結果はそろいます。",
    ],
    explanation: {
      summary:
        "dup も clone も新しいオブジェクトを返すので、equal? は両方とも false。",
      reason:
        "違いは: `clone` は frozen 状態と特異メソッドもコピーするのに対し、`dup` はコピーしません。通常は `dup` で十分。`equal?` は object_id 比較なので、複製したらどちらも別オブジェクト = false。",
      beginnerExplanation:
        "Ruby でオブジェクトを複製する方法は 2 つあります: **`dup`** と **`clone`**。両方とも『中身が同じ別オブジェクト』を作る点では共通ですが、コピーする情報の範囲が違います。\n\n- **`dup`** = 軽量コピー。中身 (インスタンス変数) はコピーするが、**frozen 状態と特異メソッドはコピーしない**。複製はミュータブルな普通のオブジェクトとして生まれる。\n- **`clone`** = 完全コピー。中身に加えて **frozen 状態も特異メソッドも維持** する。元が凍結されていたら複製も凍結されている。\n\n今回のコードでは:\n- `a = \"abc\"` → 元の文字列。\n- `b = a.dup` → a と同じ \"abc\" を持つ別オブジェクト (object_id は別)。\n- `c = a.clone` → 同じく a と同じ \"abc\" を持つ別オブジェクト (object_id は別)。\n\n`equal?` は **object_id を比較** するメソッドなので、a と b、a と c はどちらも別オブジェクト = false です。違いが現れるのは `frozen?` を比べたときで、`\"abc\".freeze` を元にしていたら dup は false、clone は true になります。\n\n**普段使うのはほぼ `dup`** で十分です。`clone` は『凍結された設定オブジェクトを書き換えたコピーが欲しい』のような特殊な場面でしか使いません。",
      modelSelfExplanation: {
        conclusion:
          "出力は両方とも `false`。dup も clone もそれぞれ新しい別オブジェクトを返すので、object_id を比較する `equal?` はどちらも false になる。",
        reason:
          "`dup` と `clone` はオブジェクトの浅い複製を作るメソッドで、結果として返るのは元と内容が同じだが別 ID を持つ新オブジェクト。両者の違いは『コピーする付加情報の範囲』で、clone は frozen 状態と特異メソッドまでコピーし、dup はクラスとインスタンス変数のみコピーする。`equal?` は object_id の同一性しか見ないので、複製である以上どちらも false。\n\nなお、これらは『浅い (shallow) コピー』で、内部の配列や Hash はコピー元と共有される。深い複製が必要なら `Marshal.load(Marshal.dump(obj))` などを使う。",
        example:
          "Rails の設定オブジェクトで『デフォルト設定を凍結しておき、必要なときだけ複製して書き換える』場合は `clone` を使うと凍結が解けて安心 (実は `clone(freeze: false)` でも明示できる)。逆に普通のデータコピーは `dup` で十分。テストで『元のオブジェクトを変えたくないけど操作したい』場合に `obj.dup.tap { |o| o.transform! }` のように書く。",
        pitfall:
          "`dup` / `clone` は **shallow copy** で、内部の配列・Hash・他オブジェクトはコピー先と共有される。`a = { list: [1,2] }; b = a.dup; b[:list] << 3` をすると a[:list] も [1,2,3] になる。本当に独立した複製が欲しければ `Marshal.load(Marshal.dump(obj))` で深いコピーを取るか、各属性を個別に dup する必要がある。",
      },
      codeExample:
        'a = "abc".freeze\nb = a.dup     # 凍結解除される\nc = a.clone   # 凍結も維持\n\nb.frozen?  #=> false\nc.frozen?  #=> true\n\n# どちらも別オブジェクト\na.equal?(b)  #=> false\na.equal?(c)  #=> false',
      commonMistakes: [
        "dup / clone は「浅いコピー (shallow copy)」。中の配列や Hash までは複製しないので注意。深いコピーが欲しければ `Marshal.load(Marshal.dump(obj))`。",
      ],
      references: [
        {
          label: "Ruby 公式リファレンス: Object#dup",
          url: "https://docs.ruby-lang.org/ja/latest/method/Object/i/dup.html",
        },
        {
          label: "Ruby 公式リファレンス: Object#clone",
          url: "https://docs.ruby-lang.org/ja/latest/method/Object/i/clone.html",
        },
      ],
    },
  },

  // ===========================================================================
  // コレクション (16問)
  // ===========================================================================
  {
    id: "col-001",
    categoryId: "collections",
    difficulty: "beginner",
    type: "choice",
    question: "次のコードの出力は？",
    code: "[1, 2, 3].map { |n| n * 2 }",
    choices: ["[1, 2, 3]", "[2, 4, 6]", "6", "[1, 4, 9]"],
    answerIndex: 1,
    hints: [
      "`map` は配列の各要素を変換した新しい配列を返します。",
      "ブロック `{ |n| n * 2 }` は各要素を 2 倍にします。",
      "元と同じ要素数の配列が返り、各要素はブロック適用後の値に置き換わります。",
    ],
    explanation: {
      summary: "`map` は要素変換用。新しい配列を返す。",
      reason:
        "`Enumerable#map` (別名 `collect`) は各要素にブロックを適用した結果の配列を返します。元の配列は変更されません (`map!` は破壊版)。関数型プログラミングでお馴染みの操作。",
      codeExample:
        "[1, 2, 3].map { |n| n * 2 }       #=> [2, 4, 6]\n[1, 2, 3].map(&:to_s)             #=> [\"1\", \"2\", \"3\"]\n[1, 2, 3].map.with_index { |n, i| \"#{i}: #{n}\" }\n#=> [\"0: 1\", \"1: 2\", \"2: 3\"]\n\n# Hash も map できる\n{ a: 1, b: 2 }.map { |k, v| [k, v * 2] }\n#=> [[:a, 2], [:b, 4]]  (配列が返る点に注意)\n{ a: 1, b: 2 }.transform_values { |v| v * 2 }\n#=> {a: 2, b: 4}",
      commonMistakes: [
        "Hash#map は配列を返す。Hash のまま返したいなら `transform_values` / `transform_keys` / `to_h` を使う。",
      ],
    },
  },
  {
    id: "col-002",
    categoryId: "collections",
    difficulty: "beginner",
    type: "choice",
    question:
      "Hash から値を取り出す際、キーが存在しない場合に nil ではなくデフォルト値を返すメソッドは？",
    code: "h = { a: 1 }\nh.???(:b, 99)",
    choices: ["[]", "dig", "fetch", "find"],
    answerIndex: 2,
    hints: [
      "`h[:b]` だと nil が返ります。",
      "第2引数にデフォルト値を取れるメソッドです。",
      "選択肢のうち、デフォルト値・ブロック・例外発生の 3 通りを呼び分けられる多機能な 1 つを選んでください。",
    ],
    explanation: {
      summary: "`Hash#fetch(key, default)` はキーが無いとき default を返す。",
      reason:
        "`[]` でアクセスすると無いキーは黙って nil。`fetch` はデフォルト不在なら KeyError を投げてくれるので「あるはずのキーが無い」バグを早期発見できます。設定値の読み込みに最適。",
      codeExample:
        'h = { a: 1 }\nh[:b]              #=> nil\nh.fetch(:b, 99)    #=> 99\nh.fetch(:b)        #=> KeyError\nh.fetch(:b) { |k| "missing #{k}" }  #=> "missing b"\n\n# ネスト Hash のアクセスは dig\nh = { user: { name: "Alice" } }\nh.dig(:user, :name)   #=> "Alice"\nh.dig(:user, :age)    #=> nil (途中で無くても安全)',
      commonMistakes: [
        '設定読み込みで `config["key"]` を多用すると typo で nil が伝播する。`fetch` で早期失敗が安全。',
      ],
    },
  },
  {
    id: "col-003",
    categoryId: "collections",
    difficulty: "beginner",
    type: "choice",
    question: "次のコードと等価なものは？",
    code: "[1, 2, 3, 4].select { |n| n.even? }",
    choices: [
      "[1, 2, 3, 4].filter { |n| n.even? }",
      "[1, 2, 3, 4].reject { |n| n.even? }",
      "[1, 2, 3, 4].map { |n| n.even? }",
      "[1, 2, 3, 4].each { |n| n.even? }",
    ],
    answerIndex: 0,
    hints: [
      "`select` は条件に合う要素だけを残します。",
      "`reject` は逆に条件に合う要素を除外します。",
      "他言語で「絞り込み」によく使われる名前のメソッドが、Ruby 2.6 で `select` のエイリアスとして追加されました。",
    ],
    explanation: {
      summary: "Ruby 2.6+ で `filter` は `select` のエイリアス。",
      reason:
        "`select` と `filter` はエイリアス関係。`reject` はその逆 (条件に合わない要素を残す)。`map` は変換、`each` は単に走査するだけで元の配列を返します。命名選びは Rails/Ruby コミュニティでは `select` 派が多いです。",
      codeExample:
        "[1,2,3,4].select { |n| n.even? }  #=> [2, 4]\n[1,2,3,4].reject { |n| n.even? }  #=> [1, 3]\n[1,2,3,4].partition { |n| n.even? } #=> [[2,4], [1,3]]\n\n# Hash も select/reject 可能\n{ a: 1, b: 2, c: 3 }.select { |_, v| v.odd? }\n#=> {a: 1, c: 3}",
    },
  },
  {
    id: "col-004",
    categoryId: "collections",
    difficulty: "beginner",
    type: "text",
    question:
      "[3, 1, 4, 1, 5, 9, 2, 6] の合計値を求めるメソッド名は？(メソッド名のみ)",
    answers: ["sum"],
    hints: [
      "Ruby 2.4 以降に追加された Enumerable のメソッド。",
      "古くは `inject(:+)` でも同じことができました。",
      "Excel や他言語にもよくある「合計」を表す 3 文字の英単語そのままです。",
    ],
    explanation: {
      summary: "`Enumerable#sum` は要素の合計を返す (Ruby 2.4+)。",
      reason:
        "古いコードでは `inject(:+)` または `reduce(:+)` と書きました。`sum` の方が読みやすく速い。初期値とブロックも渡せます。",
      codeExample:
        '[1,2,3].sum              #=> 6\n[1,2,3].sum(100)         #=> 106 (初期値)\n[1,2,3].sum { |n| n*2 }  #=> 12  (ブロックで変換+合計)\n\n# 浮動小数の合計は誤差に注意\n[0.1, 0.2].sum  #=> 0.30000000000000004\n# 正確に: BigDecimal を使う',
    },
  },
  {
    id: "col-005",
    categoryId: "collections",
    difficulty: "intermediate",
    type: "choice",
    question: "次のコードの出力は？",
    code: 'puts [1, 2, 3].inject(0) { |sum, n| sum + n }',
    choices: ["6", "10", "0", "[1, 2, 3]"],
    answerIndex: 0,
    hints: [
      "`inject(初期値) { |acc, x| ... }` は accumulator パターン。",
      "初期値 0 から始めて、各要素を加算。",
      "初期値に各要素を順番に足し込んだ結果、ちょうど 1〜3 の総和に一致します。",
    ],
    explanation: {
      summary: "`inject` (= reduce) は畳み込み操作。初期値 + 各要素の累積。",
      reason:
        "関数型でいう fold/reduce。`inject(init) { |acc, x| acc に対する操作 }` で、左から順に処理。シンボル省略形 `inject(:+)` は `inject { |a,b| a+b }` と同じ。",
      codeExample:
        "[1,2,3].inject(0) { |s, n| s + n }    #=> 6\n[1,2,3].inject(:+)                    #=> 6\n[1,2,3].inject(1) { |p, n| p * n }    #=> 6\n[1,2,3].inject(:*)                    #=> 6\n\n# 最大値\n[3,1,4].inject { |a,b| a > b ? a : b } #=> 4\n# でも普通は\n[3,1,4].max  #=> 4",
    },
  },
  {
    id: "col-006",
    categoryId: "collections",
    difficulty: "intermediate",
    type: "choice",
    question: "次のコードの出力は？",
    code: '[[1, "a"], [2, "b"], [3, "c"]].to_h',
    choices: [
      '{1=>"a", 2=>"b", 3=>"c"}',
      '[1, "a", 2, "b", 3, "c"]',
      "TypeError",
      '{"a"=>1, "b"=>2, "c"=>3}',
    ],
    answerIndex: 0,
    hints: [
      "`to_h` は [key, value] ペアの配列を Hash に変換します。",
      "各内側配列の最初の要素がキー、2番目が値。",
      "選択肢のうち、整数 (内側配列の 0 番目) がキー、文字 (1 番目) が値になっている Hash を選んでください。",
    ],
    explanation: {
      summary: "`to_h` は [key, value] 形式の配列を Hash に変換。",
      reason:
        "ペア配列 → Hash は頻出パターン。Ruby 2.6+ ではブロック付き `to_h { |x| [k, v] }` で変換ロジックも書けます。",
      codeExample:
        '[[1,"a"], [2,"b"]].to_h   #=> {1=>"a", 2=>"b"}\n\n# ブロック付き (2.6+)\n[1,2,3].to_h { |n| [n, n.to_s] }   #=> {1=>"1", 2=>"2", 3=>"3"}\n\n# zip でペアを作って to_h\n[:a, :b, :c].zip([1, 2, 3]).to_h   #=> {a:1, b:2, c:3}\n\n# 元の Hash を変換\n{ a: 1, b: 2 }.map { |k, v| [k, v*2] }.to_h\n# => {a:2, b:4}  (transform_values の方が綺麗)',
    },
  },
  {
    id: "col-007",
    categoryId: "collections",
    difficulty: "intermediate",
    type: "choice",
    question: "次のコードの出力は？",
    code: '[1, 2, 3, 4, 5].each_slice(2).to_a',
    choices: [
      "[[1, 2], [3, 4], [5]]",
      "[1, 3, 5]",
      "[[1, 2], [2, 3], [3, 4], [4, 5]]",
      "[1, 2, 3, 4, 5]",
    ],
    answerIndex: 0,
    hints: [
      "`each_slice(n)` は n 個ずつに区切ります。",
      "余りは最後の塊に含まれます。",
      "5 要素を 2 個ずつ束ねるので 2 個・2 個・1 個に分かれ、最後の組だけ要素数が違う形になります。",
    ],
    explanation: {
      summary: "`each_slice(n)` は n 個ずつチャンクに分割する。",
      reason:
        "ページネーション、バッチ処理、N列に並べる表示などで頻用。`each_cons(n)` は連続する n 個 (移動窓) を返すので似て非なるもの。",
      codeExample:
        "[1,2,3,4,5].each_slice(2).to_a\n#=> [[1,2], [3,4], [5]]\n\n[1,2,3,4,5].each_cons(2).to_a\n#=> [[1,2], [2,3], [3,4], [4,5]]\n\n# Rails: 1000件ずつ DB から取り出して処理\nUser.find_each(batch_size: 1000) { |u| ... }",
    },
  },
  {
    id: "col-008",
    categoryId: "collections",
    difficulty: "intermediate",
    type: "text",
    question:
      "[1, 2, 3, 4, 5] を逆順に並び替えた配列を返すメソッド名は？(メソッド名のみ)",
    answers: ["reverse"],
    hints: [
      "Array にも String にも存在するメソッドです。",
      "破壊版は `reverse!`。",
      "「逆」を意味する英単語そのままの 7 文字。同名のメソッドが文字列にもあり、`olleh` のような結果を返します。",
    ],
    explanation: {
      summary: "`Array#reverse` は要素を逆順にした新しい配列を返す。",
      reason:
        "順序の反転は配列・文字列で共通の `reverse`。破壊版 `reverse!` もあり。Enumerable には `reverse_each` もあって、ブロックを逆順に実行できます。",
      codeExample:
        '[1,2,3].reverse        #=> [3, 2, 1]\n"hello".reverse        #=> "olleh"\n\n[1,2,3].reverse_each { |n| puts n }\n# 3\n# 2\n# 1\n\n# 配列のソート + 逆順\n[3,1,2].sort.reverse   #=> [3, 2, 1]\n# または\n[3,1,2].sort { |a,b| b <=> a }   #=> [3, 2, 1]',
    },
  },
  {
    id: "col-009",
    categoryId: "collections",
    difficulty: "intermediate",
    type: "choice",
    question: "次のコードの出力は？",
    code: '["apple", "banana", "cherry"].group_by { |w| w.length }',
    choices: [
      '{5=>["apple"], 6=>["banana", "cherry"]}',
      '{"a"=>["apple"], "b"=>["banana"], "c"=>["cherry"]}',
      '[5, 6, 6]',
      '["apple", "banana", "cherry"]',
    ],
    answerIndex: 0,
    hints: [
      "`group_by` はブロックの戻り値をキーにして要素をグルーピング。",
      "apple は 5 文字、banana と cherry は 6 文字。",
      "ブロックの戻り値 (length) ごとに要素が配列として束ねられた Hash 形式になります。",
    ],
    explanation: {
      summary:
        "`group_by` はブロック戻り値をキーに { キー => [要素…] } を返す。",
      reason:
        "ピボット・集計の入口。SQL の GROUP BY 相当を Ruby のコレクションで実現。Rails でも `User.all.group_by(&:role)` のように使えます。",
      codeExample:
        '[1,2,3,4,5,6].group_by { |n| n % 3 }\n#=> {1=>[1,4], 2=>[2,5], 0=>[3,6]}\n\n# シンプルに件数だけ欲しい時は tally (2.7+)\n["a", "b", "a", "c", "a"].tally\n#=> {"a"=>3, "b"=>1, "c"=>1}\n\nusers.group_by(&:role).transform_values(&:count)\n#=> {"admin"=>3, "user"=>17}',
    },
  },
  {
    id: "col-010",
    categoryId: "collections",
    difficulty: "intermediate",
    type: "choice",
    question:
      "Array#each と Array#map の最大の違いは？",
    choices: [
      "each は破壊的、map は非破壊的",
      "each は元の配列を返す、map はブロックの戻り値の配列を返す",
      "each は Hash には使えない、map は使える",
      "両者は完全に同じ",
    ],
    answerIndex: 1,
    hints: [
      "戻り値に注目してください。",
      "each はループ用、map は変換用。",
      "破壊性や利用可能なオブジェクトの違いではなく、「最終的に何が返ってくるか」に焦点を当てた選択肢が正解です。",
    ],
    explanation: {
      summary:
        "each はレシーバ自身を返す (副作用用)、map は変換後の新しい配列を返す。",
      reason:
        "each はループ目的 (puts や DB 書き込みなど副作用) で、戻り値は使わない前提。map は変換目的で戻り値を使う。誤って each で配列を生成しようとすると `result = [].tap { |a| arr.each { |x| a << x*2 } }` のように冗長になるので map を使う。",
      codeExample:
        "result = [1,2,3].each { |n| n * 2 }   # 戻り値は [1,2,3]\nresult = [1,2,3].map  { |n| n * 2 }   # 戻り値は [2,4,6]\n\n# 副作用が目的なら each\n[1,2,3].each { |n| puts n }\n\n# 配列が欲しいなら map\ndoubled = [1,2,3].map { |n| n * 2 }",
      commonMistakes: [
        "`arr.each.map { ... }` のように混ぜると Enumerator 経由になり遅い。普通は `arr.map { ... }`",
      ],
    },
  },
  {
    id: "col-011",
    categoryId: "collections",
    difficulty: "intermediate",
    type: "text",
    question:
      "[1, 2, 3] と [4, 5, 6] を要素ごとにペアにして [[1,4],[2,5],[3,6]] にするメソッド名は？(メソッド名のみ)",
    answers: ["zip"],
    hints: [
      "Python の zip と同じ機能。",
      "Array のメソッドです。",
      "ファイル圧縮の拡張子と同じ綴りの 3 文字メソッドで、「噛み合わせる」イメージのまま命名されています。",
    ],
    explanation: {
      summary: "`zip` は複数配列を要素ごとに結合する。",
      reason:
        "並列処理や `to_h` と組み合わせて辞書化するのに使う。長さが違うと短い側で nil パディング。",
      codeExample:
        "[1,2,3].zip([4,5,6])     #=> [[1,4],[2,5],[3,6]]\n[1,2,3].zip([4,5])       #=> [[1,4],[2,5],[3,nil]]\n[:a,:b,:c].zip([1,2,3]).to_h\n#=> {a:1, b:2, c:3}\n\n# 3 配列以上も可\n[1,2].zip([3,4], [5,6])  #=> [[1,3,5], [2,4,6]]",
    },
  },
  {
    id: "col-012",
    categoryId: "collections",
    difficulty: "intermediate",
    type: "choice",
    question: "次のコードの出力は？",
    code: "(1..5).reduce(:+)",
    choices: ["15", "[1,2,3,4,5]", "1..5", "ArgumentError"],
    answerIndex: 0,
    hints: [
      "`(1..5)` は Range オブジェクトで Enumerable。",
      "`reduce(:+)` は累積で全要素を加算。",
      "Range は配列化されずに直接畳み込まれるので、結果は配列でも Range でもなく単一の整数。1〜5 の総和を計算してください。",
    ],
    explanation: {
      summary: "Range も Enumerable なので reduce が使える。",
      reason:
        "Range は始点..終点を表すオブジェクトで、Enumerable をインクルードしているので map, select, reduce, sum などが使える。reduce(:+) はシンボル渡しの省略記法。",
      codeExample:
        "(1..5).to_a       #=> [1, 2, 3, 4, 5]\n(1..5).sum        #=> 15\n(1..5).reduce(:+) #=> 15\n(1...5).to_a      #=> [1, 2, 3, 4]  (... は終点除外)\n\n('a'..'e').to_a   #=> [\"a\",\"b\",\"c\",\"d\",\"e\"]",
    },
  },
  {
    id: "col-013",
    categoryId: "collections",
    difficulty: "advanced",
    type: "choice",
    question: "次のコードの出力は？",
    code: "h = Hash.new(0)\n%w[a b a c a b].each { |w| h[w] += 1 }\np h",
    choices: [
      '{"a"=>3, "b"=>2, "c"=>1}',
      "{}",
      "NoMethodError",
      '{"a"=>1, "b"=>1, "c"=>1}',
    ],
    answerIndex: 0,
    hints: [
      "`Hash.new(0)` は存在しないキーアクセス時のデフォルト値を 0 にします。",
      "ループで各単語のカウントを +1 しています。",
      "頻度カウントの定番イディオム。",
    ],
    explanation: {
      summary:
        "`Hash.new(0)` でデフォルト値 0 を設定すると、カウントが簡潔に書ける。",
      reason:
        "通常 `h[\"a\"]` は無いキーなら nil。`Hash.new(0)` を使うと 0 が返るので `+= 1` がそのまま書ける。Ruby 2.7+ なら `tally` の方が短い。",
      codeExample:
        '# 手書きカウント\nh = Hash.new(0)\n%w[a b a].each { |w| h[w] += 1 }\nh  #=> {"a"=>2, "b"=>1}\n\n# Ruby 2.7+\n%w[a b a].tally   #=> {"a"=>2, "b"=>1}\n\n# group_by 経由\n%w[a b a].group_by(&:itself).transform_values(&:count)\n#=> {"a"=>2, "b"=>1}',
      commonMistakes: [
        "`Hash.new([])` のように mutable オブジェクトを default にすると全キーが同じ配列を共有してしまう。`Hash.new { |h, k| h[k] = [] }` を使う。",
      ],
    },
  },
  {
    id: "col-014",
    categoryId: "collections",
    difficulty: "advanced",
    type: "choice",
    question: "次のコードの出力は？",
    code: "users = [\n  {name: 'Alice', age: 30},\n  {name: 'Bob',   age: 25},\n  {name: 'Carol', age: 35}\n]\nusers.sort_by { |u| u[:age] }.first[:name]",
    choices: ["Alice", "Bob", "Carol", "nil"],
    answerIndex: 1,
    hints: [
      "`sort_by` で age 順にソート。",
      "最年少が先頭に来ます。",
      "ソート後の先頭要素は「最も age が小さい人」になります。各人物の年齢を比べて最小の名前を選んでください。",
    ],
    explanation: {
      summary:
        "`sort_by { |x| キー }` でキーごとにソート。`sort` より速くて読みやすい。",
      reason:
        "`sort` は `<=>` でブロックを毎回比較に使うので n log n 回の評価。`sort_by` は各要素のキーを 1 回だけ計算してキャッシュ (Schwartzian transform) するので、複雑なキーで効率的。",
      codeExample:
        "users.sort_by { |u| u[:age] }\n#=> Bob(25), Alice(30), Carol(35)\n\n# 逆順\nusers.sort_by { |u| -u[:age] }\n# または\nusers.sort_by { |u| u[:age] }.reverse\n\n# 複数キー\nusers.sort_by { |u| [u[:age], u[:name]] }\n\n# Rails の AR では DB でソート\nUser.order(:age)",
      commonMistakes: [
        "`sort { |a,b| a[:age] <=> b[:age] }` でも書けるが冗長。`sort_by` を優先。",
      ],
    },
  },
  {
    id: "col-015",
    categoryId: "collections",
    difficulty: "advanced",
    type: "text",
    question:
      "[1, [2, [3, [4]]]] を平坦化して [1, 2, 3, 4] にするメソッド名は？(メソッド名のみ)",
    answers: ["flatten"],
    hints: [
      "ネストした配列を 1 次元化します。",
      "引数で深さ指定可能。",
      "「平らにする」を意味する英単語そのまま 7 文字のメソッド名で、CSS の flat とも語源が同じ。",
    ],
    explanation: {
      summary: "`Array#flatten` は入れ子配列を平坦化する。",
      reason:
        "引数で何段まで展開するかを指定できる。`flatten(1)` で 1 段だけ。`flat_map` は map + flatten(1) のショートカット。",
      codeExample:
        "[1, [2, [3, [4]]]].flatten     #=> [1, 2, 3, 4]\n[1, [2, [3, [4]]]].flatten(1)  #=> [1, 2, [3, [4]]]\n\n# flat_map (= collect_concat)\n[[1,2], [3,4]].flat_map { |a| a.map { |n| n*2 } }\n#=> [2, 4, 6, 8]\n# 同等\n[[1,2], [3,4]].map { |a| a.map { |n| n*2 } }.flatten(1)",
    },
  },
  {
    id: "col-016",
    categoryId: "collections",
    difficulty: "advanced",
    type: "choice",
    question:
      "次のうち、Enumerable#each_with_object と inject の違いとして正しいものは？",
    choices: [
      "each_with_object は破壊的に object を変更しつつ object を返す、inject は累積結果を返す",
      "両者は完全に同じ",
      "inject は破壊的、each_with_object は非破壊的",
      "each_with_object は Hash には使えない",
    ],
    answerIndex: 0,
    hints: [
      "両方とも累積処理に使えます。",
      "`each_with_object` のブロック引数は (要素, object) の順。",
      "片方は「ブロックの最後の式」を次の acc に運び、もう片方は最初に渡したオブジェクトをずっと使い回して最後にそれを返します。",
    ],
    explanation: {
      summary:
        "each_with_object は object を渡し続けて最後に object を返す。inject はブロック戻り値が次の acc。",
      reason:
        "可変オブジェクト (Array, Hash) を構築するなら `each_with_object` の方が安全。inject は戻り値を間違えると acc が壊れる落とし穴がある。",
      codeExample:
        '# each_with_object: object を渡しながら破壊変更\nresult = [1,2,3].each_with_object({}) do |n, h|\n  h[n] = n * 2\nend\n#=> {1=>2, 2=>4, 3=>6}\n\n# inject だと戻り値を必ず返す必要がある\nresult = [1,2,3].inject({}) do |h, n|\n  h[n] = n * 2\n  h   # ← これを忘れると nil で壊れる！\nend',
      commonMistakes: [
        "inject で Hash 構築する時に最後の `h` を書き忘れて nil が次に渡る。each_with_object なら起きない。",
      ],
    },
  },

  // ===========================================================================
  // クラスとモジュール (12問)
  // ===========================================================================
  {
    id: "oop-001",
    categoryId: "ruby-oop",
    difficulty: "beginner",
    type: "choice",
    question:
      "次のクラス定義で、外部から `user.name` で取得・`user.name = \"x\"` で設定できるようにする宣言は？",
    code: "class User\n  ???\nend",
    choices: [
      "attr_reader :name",
      "attr_writer :name",
      "attr_accessor :name",
      "property :name",
    ],
    answerIndex: 2,
    hints: [
      "reader = 取得のみ、writer = 設定のみ。",
      "両方欲しい時に使うのは accessor。",
      "reader と writer の両方を一度に定義する `attr_*` 系のメソッドを選んでください。`property` は Ruby には存在しません。",
    ],
    explanation: {
      summary:
        "`attr_accessor` は getter + setter を一括で定義する糖衣構文。",
      reason:
        "Ruby ではインスタンス変数 `@name` は外部から直接読めません。`attr_*` は getter/setter メソッドを自動生成するマクロです。",
      codeExample:
        'class User\n  attr_accessor :name           # getter + setter\n  attr_reader   :id             # getter のみ\n  attr_writer   :password       # setter のみ\nend\n\n# 自動展開されるイメージ\nclass User\n  def name; @name; end\n  def name=(v); @name = v; end\nend\n\nu = User.new\nu.name = "Alice"\nu.name  #=> "Alice"',
      commonMistakes: [
        "`attr_accessor` を使うと全プロパティが書き換え可能になる。書き換えさせたくないなら `attr_reader` のみにする。",
      ],
    },
  },
  {
    id: "oop-002",
    categoryId: "ruby-oop",
    difficulty: "beginner",
    type: "choice",
    question: "次のコードの出力は？",
    code: 'class Animal\n  def initialize(name)\n    @name = name\n  end\n  def greet\n    "Hi, I am #{@name}"\n  end\nend\n\nputs Animal.new("Pochi").greet',
    choices: ["Hi, I am @name", "Hi, I am Pochi", "NoMethodError", "nil"],
    answerIndex: 1,
    hints: [
      "`initialize` はコンストラクタ。`new` で呼ばれる。",
      "`@name` はインスタンス変数。",
      "コンストラクタで渡された引数がインスタンス変数に保存され、greet 内の式展開で実際の値に置き換わります。",
    ],
    explanation: {
      summary:
        "`initialize` が `new` 時に呼ばれ、`@name` でインスタンス変数を持つ。",
      reason:
        "クラスのインスタンス化は `Animal.new(args)` → 内部で `initialize(args)` が呼ばれます。インスタンス変数 `@xxx` は各オブジェクト毎に独立。クラス変数 `@@xxx` は全インスタンスで共有。",
      codeExample:
        'class Animal\n  attr_reader :name\n  def initialize(name)\n    @name = name\n  end\nend\n\na = Animal.new("Pochi")\na.name  #=> "Pochi"\n\n# new に渡した引数が initialize に渡る\nclass User\n  def initialize(name:, age: 0)\n    @name, @age = name, age\n  end\nend\nUser.new(name: "Alice", age: 20)',
      commonMistakes: [
        "`initialize` の戻り値は無視される (常に self が返る)。明示的に return しても無意味。",
      ],
    },
  },
  {
    id: "oop-003",
    categoryId: "ruby-oop",
    difficulty: "beginner",
    type: "choice",
    question:
      "クラス Dog が Animal を継承する Ruby の書き方は？",
    choices: [
      "class Dog extends Animal",
      "class Dog < Animal",
      "class Dog : Animal",
      "class Dog inherits Animal",
    ],
    answerIndex: 1,
    hints: [
      "JavaScript や Java とは違う構文。",
      "`<` 記号を使います。",
      "Java の `extends` や Python の括弧、C# の `:` ではなく、Ruby は『より小さい』を表す不等号 1 文字で継承関係を書きます。",
    ],
    explanation: {
      summary: "Ruby の継承は `class Child < Parent`。",
      reason:
        "Ruby は単一継承 (多重継承は Module/Mixin で実現)。`<` の方向は『部分集合』というイメージ。`Object` が全クラスのルート (BasicObject が真のルート)。",
      codeExample:
        'class Animal\n  def greet; "Hi"; end\nend\n\nclass Dog < Animal\n  def greet\n    super + " wan!"   # 親のメソッドを呼ぶ\n  end\nend\n\nDog.new.greet      #=> "Hi wan!"\nDog.ancestors      #=> [Dog, Animal, Object, ..., BasicObject]',
    },
  },
  {
    id: "oop-004",
    categoryId: "ruby-oop",
    difficulty: "intermediate",
    type: "choice",
    question:
      "親クラスの同名メソッドを呼び出す Ruby のキーワードは？",
    choices: ["parent", "super", "this.super", "base"],
    answerIndex: 1,
    hints: [
      "1単語のキーワード。",
      "メソッド内で `super` と書くだけで親の同名メソッドを呼びます。",
      "Java や JavaScript と同じく『上位 (親)』を表す 5 文字の英単語そのままです。",
    ],
    explanation: {
      summary: "`super` は親クラスの同名メソッドを呼ぶ。",
      reason:
        "`super` (引数省略) は現在のメソッドに渡された引数をそのまま渡す。`super()` (空括弧) は明示的に引数なし。`super(a, b)` は指定引数で呼ぶ。",
      codeExample:
        'class Animal\n  def initialize(name)\n    @name = name\n  end\nend\n\nclass Dog < Animal\n  def initialize(name, breed)\n    super(name)        # name だけ渡す\n    @breed = breed\n  end\nend\n\n# super と super() の違い\nclass A\n  def m(x); puts "A: #{x}"; end\nend\nclass B < A\n  def m(x)\n    super       # x をそのまま渡す ⇒ "A: 1"\n    super()     # 引数なし ⇒ ArgumentError\n  end\nend',
      commonMistakes: [
        "`super` (括弧なし) と `super()` (空括弧) は別物。前者は現在の引数を引き継ぐ。",
      ],
    },
  },
  {
    id: "oop-005",
    categoryId: "ruby-oop",
    difficulty: "intermediate",
    type: "choice",
    question:
      "Ruby の Module の主な用途として正しくないものは？",
    choices: [
      "メソッドの集まりを定義して include で取り込む (Mixin)",
      "名前空間を提供する (例: ActiveRecord::Base)",
      "定数の集まりを提供する (例: Math::PI)",
      "new でインスタンス化する",
    ],
    answerIndex: 3,
    hints: [
      "Module はクラスとは違ってインスタンス化できません。",
      "Mixin, 名前空間, 定数群はすべて Module の役割。",
      "Mixin・名前空間・定数群はすべて Module の正規の使い方。残り 1 つだけが Class でしかできない操作です。",
    ],
    explanation: {
      summary: "Module は new できない。Mixin / 名前空間 / 定数群が役割。",
      reason:
        "Module は Class の親クラス (`Class < Module`)。Class は new でインスタンス化できる Module、と考えると整理しやすい。include / prepend / extend で他クラスにメソッドを混ぜ込む (Mixin) のが主用途。",
      codeExample:
        'module Greetable\n  def greet\n    "Hello, #{name}"\n  end\nend\n\nclass User\n  include Greetable    # インスタンスメソッドとして取り込み\n  attr_reader :name\n  def initialize(name); @name = name; end\nend\n\nUser.new("Alice").greet  #=> "Hello, Alice"\n\n# 名前空間\nmodule MyApp\n  class User; end       # MyApp::User\nend\n\n# 定数の集まり\nmodule Color\n  RED   = "#f00"\n  BLUE  = "#00f"\nend\nColor::RED  #=> "#f00"',
    },
  },
  {
    id: "oop-006",
    categoryId: "ruby-oop",
    difficulty: "intermediate",
    type: "choice",
    question:
      "include / prepend / extend の違いとして正しいものは？",
    choices: [
      "include = インスタンスメソッドに、extend = 特異メソッド (クラスメソッド) に、prepend = include の逆順 (前置)",
      "三者は同じ",
      "include = クラスメソッドに、extend = インスタンスメソッドに",
      "prepend は廃止された",
    ],
    answerIndex: 0,
    hints: [
      "include はインスタンスメソッドを追加。",
      "extend は特異メソッド (= クラスメソッドや単体オブジェクトのメソッド) を追加。",
      "prepend は親より前 (より優先) に Mixin を差し込む。",
    ],
    explanation: {
      summary:
        "include = インスタンス側、extend = 特異 (クラス) 側、prepend = 親より優先順位高く差し込む。",
      reason:
        "Ruby のメソッド探索順 (ancestors) は: prepend ← 自クラス ← include ← 親クラス ... の順。prepend は元メソッドを上書きしてラップする時 (例: alias 不要なメソッド計装) に便利。",
      codeExample:
        'module M\n  def hi; "M"; end\nend\n\nclass A\n  include M       # A の祖先: [A, M, Object,...]\n  def hi; "A"; end\nend\nA.new.hi  #=> "A"  (Aが優先)\n\nclass B\n  prepend M       # B の祖先: [M, B, Object,...]\n  def hi; "B"; end\nend\nB.new.hi  #=> "M"  (Mが優先!)\n\nclass C\n  extend M\nend\nC.hi      #=> "M"  (クラスメソッドとして)',
    },
  },
  {
    id: "oop-007",
    categoryId: "ruby-oop",
    difficulty: "intermediate",
    type: "text",
    question:
      "クラスメソッドを定義するときに使う、`def` の前の語句は？(1単語、例: foo)",
    answers: ["self"],
    hints: [
      "`def self.method_name` で定義します。",
      "他にも `class << self` の中で `def` する書き方もあります。",
      "クラス定義文の直下では「現在のクラス自身」を指す 4 文字の擬似変数で、メソッド内では「現在のインスタンス」になります。",
    ],
    explanation: {
      summary: "`def self.method_name` でクラスメソッドを定義。",
      reason:
        "Ruby のクラスメソッドは『クラスオブジェクトの特異メソッド』として実装されている。`self` (= 現在のクラス) の特異メソッドという意味で `def self.foo`。",
      codeExample:
        "class User\n  def self.count\n    100\n  end\n\n  # 別の書き方 (まとめて定義したい時)\n  class << self\n    def find_by(name); end\n    def create!(attrs); end\n  end\nend\n\nUser.count   #=> 100\n\n# Rails では .scope や class method を自然に書ける\nclass User < ApplicationRecord\n  def self.active\n    where(active: true)\n  end\nend",
    },
  },
  {
    id: "oop-008",
    categoryId: "ruby-oop",
    difficulty: "intermediate",
    type: "choice",
    question:
      "Ruby の `private` メソッドの説明として正しいものは？",
    choices: [
      "サブクラスからも呼び出せない",
      "明示的なレシーバ (self を含む) を付けて呼べない",
      "別のオブジェクトの同じメソッドも呼べない",
      "クラス外から完全に隠蔽される (リフレクションでも見えない)",
    ],
    answerIndex: 1,
    hints: [
      "Java の private とは少し違います。",
      "サブクラスからは呼べます。",
      "private は『継承可否』『リフレクション可否』ではなく、『呼び出し時のレシーバ記法』に制約をかける、と覚えてください。",
    ],
    explanation: {
      summary:
        "Ruby の private は『明示的なレシーバを付けられない』だけ。サブクラスからは呼べる。",
      reason:
        "他言語の private とはセマンティクスが違います。あくまで『同じインスタンスのメソッドからのみ、レシーバ省略形で呼べる』という制約。サブクラスからは呼び放題で、`send` でも呼べてしまう (リフレクションでは隠蔽されない)。",
      codeExample:
        'class User\n  def public_m\n    private_m         # OK\n    self.private_m    # Ruby 2.7+ なら setter のみOK、それ以外NG\n  end\n\n  private\n\n  def private_m; "private"; end\nend\n\nUser.new.public_m       # OK\nUser.new.private_m      # NoMethodError (private method)\nUser.new.send(:private_m) # 呼べてしまう\n\n# サブクラスからも呼べる\nclass Admin < User\n  def call; private_m; end   # OK\nend',
      commonMistakes: [
        "Ruby 2.7+ では private な setter は `self.foo = x` の形でのみ呼べるよう拡張された。",
      ],
    },
  },
  {
    id: "oop-009",
    categoryId: "ruby-oop",
    difficulty: "advanced",
    type: "choice",
    question:
      "次のうち、Comparable モジュールを include して `<=>` だけ定義すると自動で得られるメソッドの組として正しいのは？",
    choices: [
      "<, >, <=, >=, ==, between?, clamp",
      "+, -, *, /",
      "each, map, select",
      "to_s, inspect, ==",
    ],
    answerIndex: 0,
    hints: [
      "Comparable は順序比較に関するメソッドを提供。",
      "`<=>` (宇宙船演算子) で 1 個定義すると比較系がまとめて手に入る。",
      "サイズ比較系メソッドがまとめて入ります。",
    ],
    explanation: {
      summary:
        "Comparable は `<=>` を 1 つ定義すれば < <= == >= > between? clamp が手に入る。",
      reason:
        "宇宙船演算子 `<=>` は -1/0/1 を返す比較。Comparable はこれを使って大小比較系メソッドを生成。同様に Enumerable は each を定義すれば map/select/reduce などが付いてくる。",
      codeExample:
        'class Version\n  include Comparable\n  attr_reader :major, :minor\n  def initialize(s)\n    @major, @minor = s.split(".").map(&:to_i)\n  end\n  def <=>(other)\n    [major, minor] <=> [other.major, other.minor]\n  end\nend\n\nv1 = Version.new("1.2")\nv2 = Version.new("1.5")\nv1 < v2                #=> true\nv1.between?(v1, v2)    #=> true\nv1.clamp(v1, v2)       #=> v1',
    },
  },
  {
    id: "oop-010",
    categoryId: "ruby-oop",
    difficulty: "advanced",
    type: "choice",
    question:
      "Ruby の Struct クラスの主な用途として正しいものは？",
    choices: [
      "属性をいくつか持つ軽量な値オブジェクトを簡単に作る",
      "巨大なデータ集合を保存する",
      "DB と接続する",
      "並列処理を行う",
    ],
    answerIndex: 0,
    hints: [
      "Struct はクラスを 1 行で作れるショートカット。",
      "attr_accessor + initialize + ==/hash が自動定義。",
      "DB 接続・大量データ保存・並列処理のためのクラスではなく、Hash 代わりに使う軽量データ型としての位置づけです。",
    ],
    explanation: {
      summary:
        "Struct は属性付き値オブジェクトを簡単に作るためのクラスファクトリ。",
      reason:
        "DTO / 値オブジェクト / 簡易レコードの即席実装に最適。Ruby 3.2 で `Data.define` が正式導入され、イミュータブル版の Struct として推奨されつつある。",
      codeExample:
        'Point = Struct.new(:x, :y) do\n  def distance\n    Math.sqrt(x**2 + y**2)\n  end\nend\n\np = Point.new(3, 4)\np.x                #=> 3\np.distance         #=> 5.0\np == Point.new(3,4) #=> true (値で比較)\n\n# Ruby 3.2+ のイミュータブル版\nUser = Data.define(:name, :age)\nu = User.new(name: "Alice", age: 20)\nu.name = "x"   # NoMethodError (immutable)',
    },
  },
  {
    id: "oop-011",
    categoryId: "ruby-oop",
    difficulty: "advanced",
    type: "text",
    question:
      "クラス内で、現在のクラス自身を参照するキーワードは？(1単語)",
    answers: ["self"],
    hints: [
      "メソッド内では現在のインスタンス、クラス定義文の直下では現在のクラス。",
      "JavaScript の `this` に近い。",
      "Python の `self` 引数や Java の `this` に当たる擬似変数で、Ruby では 4 文字、最初は s で始まります。",
    ],
    explanation: {
      summary:
        "`self` は文脈で意味が変わる: メソッド内ではインスタンス、クラス本体ではクラス自身、def self.foo ではクラス自身。",
      reason:
        "Ruby の `self` は『今コードを実行している主体』。`puts self` の出力で常に確認できる。クラス本体 (`class Foo; ... end`) の直下では Foo クラス自身を指している。",
      codeExample:
        'class User\n  puts self     # User\n\n  def instance_method\n    self        # User のインスタンス\n  end\n\n  def self.class_method\n    self        # User クラス\n  end\nend',
    },
  },
  {
    id: "oop-012",
    categoryId: "ruby-oop",
    difficulty: "advanced",
    type: "choice",
    question:
      "Ruby の attr_accessor と Struct の使い分けとして適切なものは？",
    choices: [
      "属性が多い・ロジックも持つクラス → attr_accessor、軽量な値オブジェクト → Struct",
      "両者は等価で好みで選ぶ",
      "Struct は廃止予定で attr_accessor のみ使うべき",
      "attr_accessor は遅いので Struct を使うべき",
    ],
    answerIndex: 0,
    hints: [
      "Struct は ==, hash, inspect, to_a などが自動。",
      "ロジックを書くクラスは attr_accessor で普通に書いた方が見やすい。",
      "両者は等価ではなく、どちらかが廃止予定でもなく、速度差が決め手でもありません。役割の住み分けで考えるのが正解。",
    ],
    explanation: {
      summary:
        "ロジック中心 → class + attr_accessor、純粋な値の入れ物 → Struct / Data.define。",
      reason:
        "Struct は値の比較 (==) や hash がデフォルトで実装されるなど『値オブジェクト』として使いやすい設計。一方ビジネスロジックを書きたいクラスは普通に class で書くのが見通しが良い。",
      codeExample:
        '# ロジック付きクラス\nclass User\n  attr_accessor :name, :email\n  def initialize(name:, email:)\n    @name, @email = name, email\n  end\n\n  def admin?; email.end_with?("@company.com"); end\nend\n\n# 値オブジェクト\nMoney = Struct.new(:amount, :currency)\nm1 = Money.new(100, "JPY")\nm2 = Money.new(100, "JPY")\nm1 == m2  #=> true',
    },
  },

  // ===========================================================================
  // Ruby 上級 (14問)
  // ===========================================================================
  {
    id: "adv-001",
    categoryId: "ruby-advanced",
    difficulty: "intermediate",
    type: "choice",
    question: "次のコードの出力は？",
    code: "def execute\n  yield 10\nend\n\nresult = execute { |x| x * 3 }\nputs result",
    choices: ["10", "30", "nil", "LocalJumpError"],
    answerIndex: 1,
    hints: [
      "`yield` はブロックを呼び出します。",
      "`yield 10` は渡されたブロックに 10 を渡して実行。",
      "ブロックは渡されているので LocalJumpError にはなりません。yield に渡した値とブロックの式を掛け合わせた結果を考えてください。",
    ],
    explanation: {
      summary: "`yield` は渡されたブロックを呼ぶ。最後の式の戻り値が結果。",
      reason:
        "Ruby のメソッドは暗黙的にブロックを受け取れる (`yield` で呼び出し)。`do...end` または `{...}` で渡す。明示的に Proc として受け取りたい時は `&blk` 引数を使う。",
      codeExample:
        'def execute\n  yield 10        # ブロック呼び出し\nend\nexecute { |x| x * 3 }  #=> 30\n\n# ブロックの有無をチェック\ndef safe\n  return "no block" unless block_given?\n  yield\nend\nsafe                   #=> "no block"\nsafe { "with block" }  #=> "with block"\n\n# 明示的に Proc として受け取る\ndef store(&blk)\n  blk.call\nend\nstore { "hello" }',
      commonMistakes: [
        "ブロックが渡されてないのに `yield` すると LocalJumpError。`block_given?` でチェックする。",
      ],
    },
  },
  {
    id: "adv-002",
    categoryId: "ruby-advanced",
    difficulty: "intermediate",
    type: "choice",
    question: "Proc と Lambda の違いとして正しいものは？",
    choices: [
      "Lambda は引数チェックが厳密、Proc は緩い",
      "Lambda 内の return はラムダから抜ける、Proc 内の return は呼び出し元メソッドから抜ける",
      "両者の違いは引数チェックと return の挙動",
      "Proc と Lambda は完全に同じ",
    ],
    answerIndex: 2,
    hints: [
      "Lambda の方が「関数らしい」厳密な挙動。",
      "Proc は「ブロックを切り出した」緩い挙動。",
      "選択肢のうち、片方の挙動だけを言っているものではなく、両者の差分を網羅的に説明しているものを選んでください。",
    ],
    explanation: {
      summary:
        "Lambda は引数厳密 + return でラムダ脱出、Proc は引数緩い + return で呼び出し元脱出。",
      reason:
        "Proc.new / proc メソッドはブロックの延長で、引数省略は nil で埋め、return は『呼び出し元メソッド』から抜ける (危険)。Lambda は関数オブジェクトで、引数数が違うと ArgumentError、return はラムダから抜けるだけ。",
      codeExample:
        'pr = Proc.new   { |a, b| [a, b] }\nla = lambda     { |a, b| [a, b] }\n# 別記法\nla = ->(a, b)   { [a, b] }\n\npr.call(1)        #=> [1, nil]    (緩い)\nla.call(1)        # ArgumentError (厳密)\n\n# return の差\ndef pr_test\n  pr = Proc.new { return 1 }\n  pr.call\n  2          # 到達しない (return がメソッドを抜ける)\nend\npr_test  #=> 1\n\ndef la_test\n  la = -> { return 1 }\n  la.call\n  2          # 到達する\nend\nla_test  #=> 2',
    },
  },
  {
    id: "adv-003",
    categoryId: "ruby-advanced",
    difficulty: "intermediate",
    type: "choice",
    question: "次のコードの出力は？",
    code: "begin\n  raise 'oops'\nrescue => e\n  puts \"caught: #{e.message}\"\nend",
    choices: ["caught: oops", "oops", "RuntimeError", "何も出力されない"],
    answerIndex: 0,
    hints: [
      "`raise 'oops'` は RuntimeError を発生。",
      "`rescue => e` で例外を捕捉して e に格納。",
      "`e.message` でメッセージ取得。",
    ],
    explanation: {
      summary: "`rescue => e` で例外を捕捉。`e.message` でメッセージ取得。",
      reason:
        "`raise 'メッセージ'` は RuntimeError を投げる短縮形。クラスを指定するなら `raise MyError, 'msg'`。rescue は class を指定しないと StandardError 以下のみ捕捉 (Exception 全体ではない)。",
      codeExample:
        'begin\n  raise ArgumentError, "bad input"\nrescue ArgumentError => e\n  puts "ArgumentError: #{e.message}"\nrescue StandardError => e\n  puts "other: #{e.message}"\nensure\n  puts "always runs"   # 例外有無に関わらず実行\nend\n\n# メソッド全体を rescue\ndef parse(s)\n  Integer(s)\nrescue ArgumentError\n  0\nend',
      commonMistakes: [
        "`rescue Exception => e` は SystemExit や Interrupt も捕捉してしまうので絶対避ける。`StandardError` (デフォルト) を使う。",
      ],
    },
  },
  {
    id: "adv-004",
    categoryId: "ruby-advanced",
    difficulty: "intermediate",
    type: "text",
    question:
      "begin/rescue ブロックで「例外があってもなくても必ず実行する」処理を書くキーワードは？(1単語)",
    answers: ["ensure"],
    hints: [
      "try/finally の finally に相当。",
      "DB接続のクローズなどクリーンアップに使います。",
      "「保証する」を意味する 6 文字の英単語そのままで、Java/JS の `finally` に相当します。",
    ],
    explanation: {
      summary: "`ensure` は例外の有無に関わらず必ず実行される。",
      reason:
        "ファイルクローズ、DB接続解放、ロック解除など『絶対やりたい後処理』に使う。例外で抜けた時も ensure は実行されるので安全。",
      codeExample:
        'def with_file\n  f = File.open("data.txt")\n  process(f)\nrescue => e\n  log_error(e)\nensure\n  f&.close   # 例外があっても閉じる\nend\n\n# File.open はブロック付きで使えば ensure 不要\nFile.open("data.txt") do |f|\n  process(f)\nend',
    },
  },
  {
    id: "adv-005",
    categoryId: "ruby-advanced",
    difficulty: "intermediate",
    type: "choice",
    question:
      "次のコードと等価なものは？\n[1,2,3].map { |n| n.to_s }",
    choices: [
      "[1,2,3].map(&:to_s)",
      "[1,2,3].map(:to_s)",
      "[1,2,3].each(&:to_s)",
      "[1,2,3].map.to_s",
    ],
    answerIndex: 0,
    hints: [
      "シンボルにアンパサンド `&` を付けるとブロックに変換できます。",
      "`Symbol#to_proc` の機能。",
      "選択肢のうち、`map` (= 変換用) かつ Symbol を Proc に変換する記法を含んでいるものは 1 つだけです。",
    ],
    explanation: {
      summary:
        "`&:method_name` は Symbol#to_proc でブロックに変換するイディオム。",
      reason:
        "`&` は引数の前に付けると Proc 化して `yield` 用ブロックとして渡す。Symbol には to_proc が定義されており、`:foo.to_proc` は `->(x) { x.foo }` 相当のラムダを作る。短く書ける定番イディオム。",
      codeExample:
        '[1,2,3].map(&:to_s)         #=> ["1","2","3"]\n[1,2,3].select(&:odd?)       #=> [1, 3]\n["a","b"].map(&:upcase)      #=> ["A","B"]\n\n# 等価なフル形式\n[1,2,3].map { |x| x.to_s }\n\n# 引数を取るメソッドには使えない\n# users.map(&:greet, "Hi")  ← ダメ\nusers.map { |u| u.greet("Hi") }',
    },
  },
  {
    id: "adv-006",
    categoryId: "ruby-advanced",
    difficulty: "advanced",
    type: "choice",
    question: "次のコードの出力は？",
    code: "class Foo\n  def method_missing(name, *args)\n    \"called: #{name}\"\n  end\nend\n\nputs Foo.new.anything",
    choices: ["called: anything", "NoMethodError", "nil", "anything"],
    answerIndex: 0,
    hints: [
      "`method_missing` は未定義メソッド呼び出し時のフック。",
      "メタプログラミングで動的にメソッドを実装する手法。",
      "未定義メソッド名がフックの第 1 引数 (Symbol) として渡されるので、エラーにはならず文字列の一部に組み込まれます。",
    ],
    explanation: {
      summary:
        "`method_missing` は未定義メソッド呼び出し時のフック。動的メソッド定義に使われる。",
      reason:
        "Ruby は呼び出されたメソッドが無い時、最後の手段として `method_missing(name, *args, &blk)` を呼ぶ。Rails の `find_by_name`、OpenStruct、ActiveModel::AttributeMethods など多くの『魔法』の実装方法。",
      codeExample:
        'class Proxy\n  def initialize(target); @target = target; end\n  def method_missing(name, *args, &blk)\n    puts "delegating: #{name}"\n    @target.public_send(name, *args, &blk)\n  end\n  def respond_to_missing?(name, include_private = false)\n    @target.respond_to?(name, include_private)\n  end\nend\n\nProxy.new([1,2,3]).length  # delegating: length →3',
      commonMistakes: [
        "method_missing を override したら必ず `respond_to_missing?` も override する (`respond_to?` が正しく動くため)。",
      ],
    },
  },
  {
    id: "adv-007",
    categoryId: "ruby-advanced",
    difficulty: "advanced",
    type: "text",
    question:
      "Ruby で実行時にメソッドを動的に定義するメソッド名は？(1単語、Module の private インスタンスメソッド)",
    answers: ["define_method"],
    hints: [
      "Module のメソッドです。",
      "`define_method(:foo) { ... }` でメソッドを動的定義。",
      "「メソッドを定義する」の英単語をそのまま snake_case にした形で、アンダースコア区切り 2 単語のメソッド名です。",
    ],
    explanation: {
      summary:
        "`define_method` で実行時に動的にメソッドを定義できる (メタプログラミング)。",
      reason:
        "ループでメソッド群を一括定義したり、設定に応じてメソッド生成したりする時に使う。`def` と違ってクロージャを作る (周囲の変数を捕捉する) のが大きな違い。",
      codeExample:
        'class User\n  [:name, :email, :age].each do |attr|\n    define_method(attr) do\n      instance_variable_get("@#{attr}")\n    end\n\n    define_method("#{attr}=") do |val|\n      instance_variable_set("@#{attr}", val)\n    end\n  end\nend\n# attr_accessor と同じことを動的に実装\n\nu = User.new\nu.name = "Alice"\nu.name  #=> "Alice"',
    },
  },
  {
    id: "adv-008",
    categoryId: "ruby-advanced",
    difficulty: "advanced",
    type: "choice",
    question: "次のコードの出力は？",
    code: "arr = [1, 2, 3]\nputs arr.each.class\nputs arr.each.next",
    choices: [
      "Enumerator / 1",
      "Array / 1",
      "Enumerator / nil",
      "Array / nil",
    ],
    answerIndex: 0,
    hints: [
      "ブロックを渡さない each はどんなオブジェクトを返す？",
      "Enumerator は遅延・外部イテレータ的に使えるオブジェクト。",
      "`#next` で次の要素を取り出せる。",
    ],
    explanation: {
      summary:
        "ブロック無し each は Enumerator を返す。`next` で外部イテレータとして使える。",
      reason:
        "Enumerable のメソッド (each / map / select 等) はブロック無し呼び出しで Enumerator を返す。チェーンや遅延評価、外部イテレータ的処理に便利。`Enumerator::Lazy` で無限列も扱える。",
      codeExample:
        '[1,2,3].each              # Enumerator: #<Enumerator: [1,2,3]:each>\n[1,2,3].map.with_index { |x, i| "#{i}:#{x}" }\n#=> ["0:1", "1:2", "2:3"]\n\n# 外部イテレータ\ne = [1,2,3].each\ne.next  #=> 1\ne.next  #=> 2\n\n# 無限列を扱う\n(1..).lazy.map { |n| n*n }.first(5)\n#=> [1, 4, 9, 16, 25]',
    },
  },
  {
    id: "adv-009",
    categoryId: "ruby-advanced",
    difficulty: "advanced",
    type: "choice",
    question: "次のコードの出力は？",
    code: "module M\n  def self.hello\n    'from M'\n  end\nend\n\nclass A\n  include M\nend\n\nputs A.hello rescue puts 'no method'\nputs M.hello",
    choices: [
      "no method / from M",
      "from M / from M",
      "no method / no method",
      "両方 NoMethodError",
    ],
    answerIndex: 0,
    hints: [
      "`def self.hello` は Module の特異メソッド (= モジュール直接呼び出し用)。",
      "include しても特異メソッドはコピーされない。",
      "include はインスタンスメソッドだけを取り込むので、Module 側に直接定義した特異メソッドは include 先のクラスからは呼べません。",
    ],
    explanation: {
      summary:
        "Module の特異メソッド (`def self.x`) は include 先のクラスメソッドにはならない。",
      reason:
        "クラスメソッドとして取り込みたい場合は `extend` を使うか、`module ClassMethods` パターン (Rails でお馴染み) を使う。",
      codeExample:
        'module M\n  def self.singleton_m; "singleton"; end   # M.singleton_m のみ可\n  def instance_m; "instance"; end           # include 先で呼べる\nend\n\nclass A\n  include M\nend\n\nA.singleton_m       # NoMethodError\nA.new.instance_m    # "instance"\n\n# クラスメソッドも取り込みたい Rails パターン\nmodule M\n  def instance_m; end\n  module ClassMethods\n    def class_m; end\n  end\n  def self.included(base)\n    base.extend(ClassMethods)\n  end\nend',
    },
  },
  {
    id: "adv-010",
    categoryId: "ruby-advanced",
    difficulty: "advanced",
    type: "choice",
    question:
      "Ruby のクロージャ (lambda/proc) が持つ最大の特徴は？",
    choices: [
      "定義時のスコープの変数を捕捉する",
      "実行時にしか変数を見ない",
      "グローバル変数のみアクセスできる",
      "変数を一切捕捉しない",
    ],
    answerIndex: 0,
    hints: [
      "クロージャ = 関数 + 環境。",
      "lambda 定義時に見えていた変数を覚えている。",
      "外側のローカル変数を内側から書き換えもできる。",
    ],
    explanation: {
      summary:
        "クロージャは定義時のレキシカルスコープを捕捉して持ち運ぶ。",
      reason:
        "lambda/proc は定義された場所の外側変数を覚え、後で実行しても見える。React の useCallback で hook の値を閉じ込めるのと同じ概念。これによりカウンタなどの状態を関数で表現できる。",
      codeExample:
        'def make_counter\n  count = 0\n  -> { count += 1 }\nend\n\nc = make_counter\nc.call  #=> 1\nc.call  #=> 2\nc.call  #=> 3\n# count は make_counter のローカル変数だが、\n# lambda がそれを捕捉して保持し続ける',
    },
  },
  {
    id: "adv-011",
    categoryId: "ruby-advanced",
    difficulty: "advanced",
    type: "choice",
    question:
      "次のコードのうち、ブロックを Lambda に変換して受け取る正しい書き方は？",
    code: "def foo(???)\n  ???.call\nend",
    choices: [
      "def foo(blk); blk.call; end",
      "def foo(&blk); blk.call; end",
      "def foo(*blk); blk.call; end",
      "def foo(blk:); blk.call; end",
    ],
    answerIndex: 1,
    hints: [
      "ブロックは引数の最後に `&blk` で受け取ります。",
      "`&` を付けるとブロック ↔ Proc 変換。",
      "選択肢の引数定義のうち、ブロックを Proc に変換して受け取るための prefix 記号を付けたものを選んでください。",
    ],
    explanation: {
      summary:
        "`def foo(&blk)` で渡されたブロックを Proc として `blk` に格納できる。",
      reason:
        "ブロックは通常 `yield` で呼ぶが、明示的に変数に格納したい時は `&blk` で受け取る。逆に Proc/Lambda を呼び出し時にブロックとして渡したい時も `&` を使う: `arr.each(&my_proc)`。",
      codeExample:
        'def call_twice(&blk)\n  blk.call\n  blk.call\nend\ncall_twice { puts "hi" }\n# hi\n# hi\n\n# Proc をブロックとして渡す\nupcase = ->(s) { s.upcase }\n["a","b"].map(&upcase)   #=> ["A","B"]\n\n# シンボルを Proc 化\n["a","b"].map(&:upcase)  #=> ["A","B"]',
    },
  },
  {
    id: "adv-012",
    categoryId: "ruby-advanced",
    difficulty: "advanced",
    type: "text",
    question:
      "Ruby で Module/Class に対して、後付けでメソッドを追加・上書きする手法 (慣習的な呼称) を何と呼ぶ？(カタカナ、5文字以上)",
    answers: [
      "モンキーパッチ",
      "モンキーパッチング",
      "Monkey Patch",
      "monkey patch",
      "オープンクラス",
    ],
    hints: [
      "クラスを後から開いて足す = open class。",
      "コミュニティでは `〇〇 patch` と呼ばれる。",
      "Ruby/Python 界隈で「動物の名前 + 修正」と呼ぶ俗称か、または「class を再オープンする」を直訳した呼び方、いずれかで答えてください。",
    ],
    explanation: {
      summary:
        "既存クラス・モジュールに後付けでメソッドを追加・上書きすることをモンキーパッチと呼ぶ。",
      reason:
        "Ruby はクラスをいつでも再オープン可能。既存挙動を変えたい時に使えるが、思わぬ箇所に影響するため『Refinements』 (限定スコープでパッチ) や `prepend` (元メソッドを呼べる形でラップ) の方が安全。",
      codeExample:
        'class String\n  def shout\n    upcase + "!!"\n  end\nend\n\n"hello".shout   #=> "HELLO!!"\n\n# Refinements (限定スコープ)\nmodule StringExt\n  refine String do\n    def shout; upcase + "!!"; end\n  end\nend\n\nusing StringExt   # この行以降のスコープのみ有効\n"hi".shout',
    },
  },
  {
    id: "adv-013",
    categoryId: "ruby-advanced",
    difficulty: "advanced",
    type: "choice",
    question:
      "Ruby の Garbage Collection 戦略として現在 (Ruby 2.1+) 主に採用されているのは？",
    choices: [
      "参照カウント方式",
      "Mark and Sweep (世代別)",
      "コピーGC",
      "GCは行わない",
    ],
    answerIndex: 1,
    hints: [
      "参照カウントは循環参照に弱いので採用していません。",
      "Mark and Sweep が基本で、若い世代と古い世代を分ける『世代別GC』。",
      "古典的なマーク&スイープを土台に、寿命の短い若い世代と長く生きる古い世代を分けて効率化する手法が採用されています。",
    ],
    explanation: {
      summary:
        "Ruby は Mark and Sweep ベースの世代別 GC (RGenGC) を採用。",
      reason:
        "Ruby 2.1 で世代別 GC (Restricted Generational GC) が導入され、生まれて間もないオブジェクトを優先的にスキャンして高速化。2.2 でインクリメンタル GC、3.0 以降は Variable Width Allocation など継続的に改良されている。",
      codeExample:
        "# GC を手動実行\nGC.start\n\n# GC 統計\nGC.stat\n#=> {count: 23, heap_allocated_pages: 100, ...}\n\n# 一時的に GC 無効化 (パフォーマンスチューニング用)\nGC.disable\n# ... 処理 ...\nGC.enable\n\n# ObjectSpace で生存オブジェクト調査\nObjectSpace.count_objects",
    },
  },
  {
    id: "adv-014",
    categoryId: "ruby-advanced",
    difficulty: "advanced",
    type: "choice",
    question: "次のコードの出力は？",
    code: "result = case 'hello'\n         in String => s if s.length > 3\n           \"long: #{s}\"\n         in String\n           \"short\"\n         end\nputs result",
    choices: [
      "long: hello",
      "short",
      "nil",
      "SyntaxError",
    ],
    answerIndex: 0,
    hints: [
      "Ruby 3.0+ のパターンマッチング `case/in` 構文。",
      "`String => s` で型チェック + 束縛、`if` でガード句。",
      "値の型と長さの両方が最初の節の条件を満たすかを確認すれば、どの枝が選ばれて何が出力されるかが決まります。",
    ],
    explanation: {
      summary:
        "Ruby 3.0+ の case/in はパターンマッチング。型チェック、束縛、ガード句が書ける。",
      reason:
        "従来の `case/when` (==/=== 比較) より強力。Hash や Array の構造分解、型ベースマッチ、配列のスプラットなど Elixir/Rust 風の表現が可能。",
      codeExample:
        'case { name: "Alice", age: 20 }\nin { name: String => n, age: 18.. => a }\n  "#{n} (#{a})"\nin { name: }\n  "anonymous"\nend\n\n# 配列の分解\ncase [1, 2, 3]\nin [1, *rest]\n  "rest: #{rest}"\nend\n\n# 値の型と条件を一気に\ncase response\nin { status: 200..299, body: String => b }\n  parse(b)\nin { status: 404 }\n  "not found"\nend',
    },
  },

  // ===========================================================================
  // Rails 規約 (10問)
  // ===========================================================================
  {
    id: "rails-001",
    categoryId: "rails-convention",
    difficulty: "beginner",
    type: "text",
    question:
      "Rails で `User` モデルに対応するデータベースのテーブル名は？(慣習通りの名前)",
    answers: ["users"],
    hints: [
      "Rails は「設定より規約 (Convention over Configuration)」が基本。",
      "テーブル名はモデル名を複数形にした snake_case です。",
      "モデル名をそのまま英語の複数形にして、全文字を小文字にしたものがテーブル名になります。",
    ],
    explanation: {
      summary: "モデル名 (単数 CamelCase) → テーブル名 (複数 snake_case)。",
      reason:
        "Rails の規約: モデル `User` → テーブル `users`、`BlogPost` → `blog_posts`、`Person` → `people` (不規則複数形は ActiveSupport::Inflector が処理)。手動で変えたい時は `self.table_name = \"...\"` で上書きできる。",
      beginnerExplanation:
        "Rails には **『規約に従えば設定不要』** という強い思想 (Convention over Configuration) があり、モデル名とテーブル名にもこのルールが効いています。\n\n基本ルール:\n- モデル名は **単数の CamelCase** (`User`, `BlogPost`)\n- テーブル名は **複数の snake_case** (`users`, `blog_posts`)\n\nRails 内部の Inflector (語形変化エンジン) が、英語の文法に従って自動変換します:\n```ruby\n'User'.tableize      # => 'users'\n'BlogPost'.tableize  # => 'blog_posts'\n'Person'.pluralize   # => 'people'   (不規則複数形も対応)\n'Mouse'.pluralize    # => 'mice'\n```\n\nつまり、`class User < ApplicationRecord` と書くだけで、自動的に `users` テーブルが対応付けられ、`User.find(1)` で `SELECT * FROM users WHERE id = 1` が発行されます。**設定ファイルは何も書きません**。これが Rails の生産性の源泉です。\n\nもし既存の DB に合わせて違うテーブル名を使いたい場合は `self.table_name = '...'` で明示的に上書きできます。レガシーシステムとの統合で頻出します。",
      modelSelfExplanation: {
        conclusion:
          "テーブル名は `users`。Rails の規約として、モデル名 (単数 CamelCase) は対応するテーブル名 (複数 snake_case) に自動マッピングされる。",
        reason:
          "Rails の ActiveRecord はクラス名を ActiveSupport::Inflector に渡して『snake_case 化 + pluralize』することでテーブル名を導出する。これにより設定を書かずにモデルと DB が自動接続でき、開発者は本質的なコードに集中できる。Inflector は単純な s 付加だけでなく『person → people』『child → children』のような不規則複数形にも対応している。",
        example:
          "実務では `class Order < ApplicationRecord` と書けば自動で `orders` テーブルに接続、`class BlogPost` なら `blog_posts` に接続される。レガシー DB と統合する場合は `self.table_name = 'tbl_users'` のように上書きするが、規約に従えるなら従う方が新規参加者の学習コストが下がる。",
        pitfall:
          "日本語ドメイン名を直訳してモデル化すると、英語の語形変化に対応しない単語 (`Sheep` → `sheep` のように単複同形、独自の業務用語) でトラブルになる。`ActiveSupport::Inflector.inflections do |inflect| inflect.uncountable 'fish' end` のように個別ルールを追加できる。さらに `apply` → `applies`、`category` → `categories` のような y 終わりの単語も Inflector が処理するが、独自命名で `Statuses` のような複数形にせずあえて `Status` のままにすると衝突しやすい。",
      },
      codeExample:
        '# app/models/user.rb\nclass User < ApplicationRecord\n  # 規約通りなら自動でテーブル "users" を使う\nend\n\n# 非規約のテーブル名を使う場合\nclass LegacyUser < ApplicationRecord\n  self.table_name = "legacy_user_data"\nend\n\n# Inflector で確認\n"user".pluralize       #=> "users"\n"person".pluralize     #=> "people"\n"BlogPost".tableize    #=> "blog_posts"',
      commonMistakes: [
        "独自の業務用語で英語複数形に対応していない単語 (Sheep / Fish 等) は Inflector に手動登録する。",
      ],
      references: [
        {
          label: "Rails Guides: Active Record Basics (公式)",
          url: "https://guides.rubyonrails.org/active_record_basics.html#naming-conventions",
        },
        {
          label: "Rails API: ActiveSupport::Inflector",
          url: "https://api.rubyonrails.org/classes/ActiveSupport/Inflector.html",
        },
      ],
    },
  },
  {
    id: "rails-002",
    categoryId: "rails-convention",
    difficulty: "beginner",
    type: "choice",
    question: "MVC の役割として正しいものは？",
    choices: [
      "Model: HTML描画 / View: DB処理 / Controller: 入力検証",
      "Model: DB/ビジネスロジック / View: HTML描画 / Controller: 入出力の橋渡し",
      "Model: ルーティング / View: ビジネスロジック / Controller: HTML描画",
      "Model: 設定ファイル / View: テスト / Controller: ログ",
    ],
    answerIndex: 1,
    choiceExplanations: [
      "役割が完全に入れ替わっている。Model が HTML を描画したり、View が DB を扱ったりすることはない。",
      "正解。Model = データとビジネスロジック、View = 表示、Controller = リクエストを受けて Model に依頼し View へ渡す仲介役。",
      "ルーティングは MVC ではなく Rails の routes.rb の担当。Model がルーティングを持つことはない。",
      "MVC とは無関係の役割を並べただけ。設定ファイルは config/、テストは test/、ログは log/ に置く。",
    ],
    hints: [
      "Model はデータとそれに関するロジックを担当。",
      "View はユーザーに見せる部分。",
      "Controller は HTTP リクエストを受け取って Model と View の橋渡しをする役割。役割が入れ替わっている選択肢は誤りです。",
    ],
    explanation: {
      summary:
        "Model = データ/ロジック、View = 表示、Controller = 仲介役。",
      reason:
        "Rails では Skinny Controller, Fat Model が原則だが、Model が膨らみすぎる場合は Service Object, Form Object, Query Object などのパターンで分割するのが一般的。",
      beginnerExplanation:
        "**MVC (Model-View-Controller)** は Web アプリの設計パターンで、責務を 3 つに分けて整理する考え方です。Rails は MVC を採用した代表的なフレームワークです。\n\n各レイヤーの役割を具体例で:\n\n**Model**: データ + ロジックを扱う\n- 例: `User`, `Post` などのクラス\n- DB のテーブルと 1:1 対応 (ActiveRecord)\n- バリデーション、関連付け、ビジネスルール (例: `discount_price`, `publishable?`) を持つ\n\n**View**: 画面に出す HTML / JSON を作る\n- 例: `app/views/posts/show.html.erb`\n- `@post.title` のように Model のデータを表示するだけ\n- ロジックは最小限 (テンプレート言語で if / each ぐらい)\n\n**Controller**: リクエストを受けて Model と View をつなぐ\n- 例: `PostsController#show`\n- `params` から ID を取り出して Model に問い合わせ、結果をインスタンス変数に詰めて View に渡す\n- 自分ではビジネスロジックを持たない (持つと Fat Controller になる)\n\n**Rails の流れ**: ブラウザがリクエスト → ルーティングが該当 Controller に振り分け → Controller が Model に問い合わせ → 取得した結果を View が HTML 化して返す → ブラウザが表示。\n\n**Rails 流の慣用句**: **「Skinny Controller, Fat Model」** = コントローラは薄く、モデルに振る舞いを集める。ただし Model が肥大化したら Service Object / Form Object / Decorator などに分割します。",
      modelSelfExplanation: {
        conclusion:
          "Model はデータとビジネスロジック、View は表示テンプレート、Controller は HTTP リクエストを受けて Model に依頼し View へ橋渡しする仲介役。",
        reason:
          "MVC は責務分離 (Separation of Concerns) の代表的なアーキテクチャパターンで、『データの扱い』『表示』『リクエスト処理』を別レイヤーに分けることで、変更の影響範囲を局所化し、再利用性とテスト容易性を高める。Rails は Convention で各レイヤーのファイル配置 (app/models, app/views, app/controllers) と命名規則を定義しており、開発者が責務の境界を意識しやすい設計になっている。",
        example:
          "ブログアプリで『記事を表示する』場合、URL `/posts/1` のリクエストがルーティングで `PostsController#show` に振り分けられ、コントローラが `@post = Post.find(params[:id])` で Model に問い合わせる。Model はメソッド `@post.published?` のようなビジネスルールを持つ。View `show.html.erb` は `<%= @post.title %>` のように受け取ったデータを表示する。コントローラ自体はビジネスロジックを持たない。",
        pitfall:
          "Controller に if 分岐や DB クエリを直書きしすぎる『Fat Controller』、View に SQL を書く、Model にビューロジックを書くなど、責務の混在が起きやすい。原則『Skinny Controller, Fat Model』を守り、Model が肥大化したら Service Object / Form Object / Query Object / Decorator (Draper / ActiveDecorator) などに分割する。View で `@user.name.present? ? @user.name : 'ゲスト'` のような条件分岐を書きたくなったら helpers / decorator に切り出す。",
      },
      codeExample:
        '# Controller: 受け取って Model に依頼、View へ\nclass PostsController < ApplicationController\n  def show\n    @post = Post.find(params[:id])   # Model から取得\n  end                                  # View (show.html.erb) で表示\nend\n\n# Model: データ操作 + ロジック\nclass Post < ApplicationRecord\n  belongs_to :author, class_name: "User"\n  def excerpt(length = 100)\n    body.first(length)\n  end\nend\n\n# View: テンプレート\n# app/views/posts/show.html.erb\n# <h1><%= @post.title %></h1>',
      commonMistakes: [
        "Controller に if 分岐や生 SQL を書きすぎる『Fat Controller』。Model または Service に振り分ける。",
        "View で `@user.posts.where(...).map { ... }` のような複雑な処理を書く。Model のメソッドや scope に切り出す。",
      ],
      references: [
        {
          label: "Rails Guides: Getting Started — MVC (公式)",
          url: "https://guides.rubyonrails.org/getting_started.html",
        },
      ],
    },
  },
  {
    id: "rails-003",
    categoryId: "rails-convention",
    difficulty: "beginner",
    type: "text",
    question:
      "`BlogPost` モデルに対応するコントローラーの慣習的なファイル名は？(例: app/controllers/xxx.rb の xxx 部分)",
    answers: ["blog_posts_controller", "blog_posts_controller.rb"],
    hints: [
      "コントローラー名は複数形 + `Controller` が慣習。",
      "ファイル名は snake_case。",
      "モデル名を複数形にして snake_case にし、末尾に _controller を付ければ Zeitwerk の規約に合致します。",
    ],
    explanation: {
      summary:
        "コントローラー: クラスは `BlogPostsController`、ファイルは `blog_posts_controller.rb`。",
      reason:
        "Rails のオートロードは『定数名 ↔ ファイル名 (snake_case)』の対応を前提とする (Zeitwerk)。命名規則を守らないと autoload エラーになる。",
      beginnerExplanation:
        "Rails のコントローラーには **3 つの命名ルール** がそろっていて、これを守ることで設定なしに自動連携します。\n\n**1. クラス名は『モデルの複数形 + Controller』**\n```\nUser     → UsersController\nBlogPost → BlogPostsController\n```\n複数形なのは『コントローラーが扱うのはリソースの「集合」』という意味合い。Rails の RESTful 設計に基づきます。\n\n**2. ファイル名は『クラス名を snake_case にしたもの』**\n```\nUsersController     → app/controllers/users_controller.rb\nBlogPostsController → app/controllers/blog_posts_controller.rb\n```\n\n**3. 配置は `app/controllers/` 配下**\nさらにネスト (Admin::UsersController) なら `app/controllers/admin/users_controller.rb` のようにディレクトリ階層 = 名前空間。\n\nこの規約を守ると **Zeitwerk autoloader** が自動で読み込んでくれます。違反すると `NameError: expected file to define constant X` が出るので、エラーメッセージから命名のズレを発見できます。\n\nさらに `resources :blog_posts` のように routes に書くだけで、`BlogPostsController` の 7 つの標準アクション (index / show / new / create / edit / update / destroy) と対応する URL ヘルパー (`blog_posts_path`, `blog_post_path(@post)` 等) が自動生成されます。命名規則を守ることで多くの便利機能が無料で手に入ります。",
      modelSelfExplanation: {
        conclusion:
          "ファイル名は `blog_posts_controller` (.rb 拡張子付きで `blog_posts_controller.rb`)。クラス名 `BlogPostsController` を snake_case に変換した形で、Rails の Zeitwerk autoloader はこの『定数名 ↔ ファイル名』対応を前提に動く。",
        reason:
          "Rails 6+ で標準採用された Zeitwerk autoloader は『大文字始まりの定数を見つけたらクラス名を snake_case 化して対応するファイルを探す』というシンプルなルールで動く。これにより require 文を書かずに自動で必要なクラスが読み込まれ、起動時間と開発体験が改善する。コントローラーの規約 (複数形 + Controller サフィックス) は RESTful な設計を促す Rails の意図的なガイドで、routes の `resources` と連携して 7 アクション + URL ヘルパーを自動生成する仕組みの基盤になっている。",
        example:
          "コマンドで `rails g controller BlogPosts index show` を実行すると、自動的に `app/controllers/blog_posts_controller.rb` が生成され、対応する view ディレクトリ `app/views/blog_posts/` と routes エントリも作られる。Admin 名前空間下なら `rails g controller Admin::Posts` で `app/controllers/admin/posts_controller.rb` (`class Admin::PostsController`) になる。",
        pitfall:
          "命名規則を破ると Zeitwerk が `expected file app/controllers/x.rb to define constant Y` というエラーを起動時に出す。よくあるミス: ファイル名は `users_controller.rb` なのにクラス名を `class UserController` (単数) と書いてしまう、`app/controllers/v1/users_controller.rb` を作りつつクラスを `class UsersController` (名前空間なし) としてしまう、など。エラーメッセージはかなり親切なのでそれに従えば解決できる。",
      },
      codeExample:
        "# app/controllers/blog_posts_controller.rb\nclass BlogPostsController < ApplicationController\n  def index\n    @posts = BlogPost.recent\n  end\nend\n\n# routes\nresources :blog_posts\n\n# URL helpers\nblog_posts_path     # /blog_posts\nblog_post_path(1)   # /blog_posts/1",
      commonMistakes: [
        "ファイル名は複数形 (`blog_posts_controller.rb`) なのにクラスを単数形 (`BlogPostController`) と書く。Zeitwerk エラーになる。",
        "名前空間 (Admin::) を使うときディレクトリを掘り忘れる。`Admin::UsersController` なら `app/controllers/admin/users_controller.rb`。",
      ],
      references: [
        {
          label: "Rails Guides: Autoloading and Reloading Constants (公式)",
          url: "https://guides.rubyonrails.org/autoloading_and_reloading_constants.html",
        },
      ],
    },
  },
  {
    id: "rails-004",
    categoryId: "rails-convention",
    difficulty: "intermediate",
    type: "choice",
    question:
      "Rails の Convention over Configuration (CoC) の意味として正しいものは？",
    choices: [
      "設定ファイルが多いほど良い",
      "規約に従えば設定が不要になる思想",
      "設定より配置を重視する",
      "コンフィグはすべて手動で書くべき",
    ],
    answerIndex: 1,
    choiceExplanations: [
      "Rails の思想と正反対。設定ファイルを最小化するために規約を導入している。",
      "正解。Convention over Configuration =『設定より規約』、つまり標準的な命名・配置のルールに従う限り設定不要で動く思想。",
      "『配置を重視』ではなく『規約 (Convention) を優先』。配置も規約の一部だが、それだけが本質ではない。",
      "CoC は逆で、手動設定を最小化する思想。手動でなんでも書くのは Configuration over Convention の世界 (Java EE 等の旧来のスタイル)。",
    ],
    hints: [
      "DHH の Rails 設計哲学。",
      "命名規則やディレクトリ構成に従えば、ほぼ設定ゼロで動く。",
      "「設定 vs 規約」のどちらを優先する思想か、という対比で読み解くと自然に絞り込めます。",
    ],
    explanation: {
      summary:
        "規約に従えば設定不要になる、Rails の中心思想。",
      reason:
        "テーブル名、ファイル名、クラス名、ルーティングなどに規約があり、それに従う限り設定ファイルを書かなくて良い。これが Rails の生産性の源泉。一方で『規約から外れる』時に逆に大変になる側面もある。",
      beginnerExplanation:
        "**Convention over Configuration (CoC)** = **「設定より規約」** は、Rails の生みの親 DHH が掲げた中心思想です。\n\n**従来のフレームワーク**: 何かを動かすには大量の設定ファイルが必要 (XML, properties など)。例えば Java の Hibernate では、エンティティクラスとテーブル名の対応を XML で 1 つずつ宣言していた。\n\n**Rails の思想**: 標準的な命名や配置のルールを決めておき、それに従う限り設定はゼロでいい。例えば:\n- `class User < ApplicationRecord` と書けば自動で `users` テーブルに接続\n- `app/controllers/users_controller.rb` に置けば自動でロード\n- `resources :users` と書けば 7 アクション + URL ヘルパーが自動生成\n\nこれにより **本質的なコードに集中** でき、ボイラープレートが激減します。Rails の生産性の源泉です。\n\n**トレードオフ**: 規約から外れた瞬間に逆にハマりやすくなる。レガシー DB との統合で `table_name = 'tbl_users'` を書かないといけない、独自のディレクトリ構造を使うと autoload が効かない、など。**できる限り規約に従う** のが Rails アプリの暗黙の合意です。\n\n類似思想: **DRY (Don't Repeat Yourself)** = 同じ情報を 2 か所に書かない。CoC と組み合わせて『1 か所に書いて全自動で連動』というスタイルを生み出しています。",
      modelSelfExplanation: {
        conclusion:
          "Convention over Configuration (CoC) =『規約に従えば設定が不要になる』Rails の中心思想。命名・配置・関連付けに標準ルールを定め、それに従う限りボイラープレート設定ゼロでアプリが動く。",
        reason:
          "従来のフレームワークが XML や YAML で何百行もの設定を要求していたのに対し、Rails は『標準的な書き方をすればフレームワーク側がよしなに推論する』という設計を選んだ。これにより 90% の標準的なケースを設定なしで処理でき、開発者は本質的なドメインロジックに集中できる。一方で 10% の特殊ケース (レガシー DB、独自規約) では明示的に上書きする必要があり、規約を破ると逆に学習コストが上がる、というトレードオフを抱えている。",
        example:
          "新規 Rails アプリを `rails new` で作って `rails g scaffold Post title:string body:text` を実行すると、Model / Controller / View / Migration / Test / Routes が一括生成されて、すぐ動く CRUD が手に入る。これはすべて CoC のおかげで設定ファイルを書く必要がない。逆にレガシーシステム連携で `self.table_name = 'tbl_user_data'`、`self.primary_key = 'user_no'` のように規約から外れると、追加コードが増え、新規参加者が戸惑うコストも増える。",
        pitfall:
          "Rails は『規約を知っていることが前提』のフレームワークなので、初学者は『なぜこれで動くのか』が見えにくく、ブラックボックスに感じやすい。規約を理解しないまま規約外のことを始めるとデバッグが極端に難しくなる。逆に、規約に従ってさえいれば多くのことが自動で繋がるので、最初の数ヶ月は『規約を知る』ことに投資するのが結果的に最速。",
      },
      codeExample:
        "# 規約に従う\nclass User < ApplicationRecord; end\n# → テーブル: users, 主キー: id, 自動で動く\n\n# 規約から外れる\nclass LegacyUser < ApplicationRecord\n  self.table_name        = \"tbl_users\"\n  self.primary_key       = \"user_no\"\n  self.inheritance_column = \"type_code\"\nend",
      commonMistakes: [
        "規約を知らずに『なぜ動いているのか分からない』状態でカスタマイズを始めると、デバッグが極端に難しい。先に Rails Guides を一通り読むのが最速。",
      ],
      references: [
        {
          label: "Rails Doctrine (DHH による公式エッセイ)",
          url: "https://rubyonrails.org/doctrine",
        },
        {
          label: "Rails Guides: Getting Started",
          url: "https://guides.rubyonrails.org/getting_started.html",
        },
      ],
    },
  },
  {
    id: "rails-005",
    categoryId: "rails-convention",
    difficulty: "intermediate",
    type: "choice",
    question:
      "Rails のディレクトリ `app/helpers/` の主な用途は？",
    choices: [
      "DB接続の設定ファイル置き場",
      "View で使う補助メソッドの置き場",
      "テストの fixture 置き場",
      "ルーティングの設定",
    ],
    answerIndex: 1,
    choiceExplanations: [
      "DB 接続の設定は `config/database.yml`。helpers にはコードのモジュールが入る。",
      "正解。`app/helpers/` は View テンプレート (ERB) で呼び出す補助メソッドを置く場所。`number_with_delimiter` や独自の `format_price` などをここに切り出す。",
      "Fixture (テストデータ) は `test/fixtures/` または `spec/fixtures/`。helpers とは別物。",
      "ルーティングは `config/routes.rb`。helpers ディレクトリには配置しない。",
    ],
    hints: [
      "View テンプレート (ERB) から呼び出すメソッド。",
      "リンク生成や日付フォーマットなど。",
      "ディレクトリ名そのまま「helper (補助役)」のためのフォルダで、DB 設定や fixture 置き場ではありません。",
    ],
    explanation: {
      summary:
        "helpers は View で使うユーティリティメソッド (link_to, number_with_delimiter など) の置き場。",
      reason:
        "ERB 内でロジックが膨らんだら helpers に切り出す。コントローラ毎に自動ロードされ、グローバルに使えるようになる (config.action_controller.include_all_helpers = true デフォルト)。",
      beginnerExplanation:
        "**`app/helpers/`** は **View で使う『補助メソッド (helper)』** を置くディレクトリです。\n\nERB テンプレート内で `<%= ... %>` の中に複雑なロジックを書くと読みにくくなります。例えばこんなコードは避けたい:\n```erb\n<%= '¥' + product.price.to_s.reverse.scan(/.{1,3}/).join(',').reverse %>\n```\n\n代わりに helpers に切り出して、View からはシンプルに呼ぶ:\n```ruby\n# app/helpers/application_helper.rb\nmodule ApplicationHelper\n  def format_price(yen)\n    \"¥#{number_with_delimiter(yen)}\"\n  end\nend\n```\n```erb\n<%= format_price(@product.price) %>  <%# => ¥1,200 %>\n```\n\nRails 標準でもよく使う helper がたくさん用意されています:\n- `link_to('詳細', post_path(@post))` — `<a>` タグ生成\n- `number_with_delimiter(1234567)` — `1,234,567`\n- `time_ago_in_words(post.created_at)` — `3 minutes ago`\n- `truncate(text, length: 100)` — 長文の省略\n- `image_tag('logo.png')` — `<img>` タグ生成\n\n**配置**: `app/helpers/application_helper.rb` (全 View 共通) または `app/helpers/posts_helper.rb` (PostsController の View 用)。デフォルトでは `config.action_controller.include_all_helpers = true` なのですべての helper がすべての View で使える。\n\n**最近の Rails 流派**: helpers が肥大化したら **ViewComponent** や **Decorator (Draper)** で表示ロジックをオブジェクト化する設計が好まれることもあります。",
      modelSelfExplanation: {
        conclusion:
          "`app/helpers/` は View で使う補助メソッド (helper) を置くディレクトリ。`link_to` や日付フォーマット、独自の表示ロジックなどをモジュールにまとめて View から呼び出せるようにする。",
        reason:
          "View 内の ERB テンプレートに複雑なロジックを直接書くと、HTML と Ruby が混在して可読性が低下する。helper はこの表示ロジックを Ruby のメソッドとして抜き出し、テスト可能・再利用可能にする仕組み。Rails 標準で `link_to` / `number_with_delimiter` / `truncate` などが提供され、独自のものも `app/helpers/` 配下にモジュールとして配置すれば全 View から使える。Rails は『View はテンプレート、ロジックは helper / model』という分業を推奨しており、その境界を明示する場所として helpers が位置付けられている。",
        example:
          "実務では金額表示 `format_price`、日付の和暦表示 `japanese_date(date)`、ステータスの色付き表示 `status_label(post)`、SNS 共有ボタン生成 `tweet_button(text)`、ユーザーアイコン表示 `user_avatar(user, size: 40)` など、表示に関わる小さなロジックを集約する。複数の View で同じ表示が必要な場面で特に威力を発揮する。",
        pitfall:
          "helper にビジネスロジック (例: 価格計算、税率判定) を書いてしまうと、Model から呼べず再利用性が低下する。helper はあくまで『表示のための整形』に限定し、ビジネスロジックは Model / Service に置く。さらに helper が大量に増えるとグローバル名前空間が汚染されてメソッド名衝突が起きるので、肥大化したら ViewComponent / Decorator (Draper, ActiveDecorator) でクラス化するのが現代的なアプローチ。",
      },
      codeExample:
        '# app/helpers/application_helper.rb\nmodule ApplicationHelper\n  def format_price(yen)\n    "¥#{number_with_delimiter(yen)}"\n  end\nend\n\n# View で\n<%= format_price(@product.price) %>\n# => ¥1,200\n\n# Rails 標準の便利 helper\n<%= link_to "詳細", post_path(@post) %>\n<%= time_ago_in_words(@post.created_at) %>',
      commonMistakes: [
        "helper にビジネスロジック (例: 税計算) を書く。Model に置いて Model.tax(...) を helper / View から呼ぶ。",
        "helper が肥大化したら ViewComponent / Decorator でクラス化する。",
      ],
      references: [
        {
          label: "Rails Guides: Action View Helpers (公式)",
          url: "https://guides.rubyonrails.org/action_view_helpers.html",
        },
      ],
    },
  },
  {
    id: "rails-006",
    categoryId: "rails-convention",
    difficulty: "intermediate",
    type: "choice",
    question:
      "Rails アプリで「ロジックを再利用したいので Model でも Controller でもないクラスを作る」時、配置場所として一般的なのは？",
    choices: [
      "app/services/",
      "app/lib/",
      "app/models/concerns/",
      "上記いずれも一般的な選択肢",
    ],
    answerIndex: 3,
    choiceExplanations: [
      "正しい配置の 1 つだが他にも選択肢がある。Service Object パターン用。複雑な処理を 1 つの『動詞』クラスに切り出す。",
      "正しい配置の 1 つだが他にも選択肢がある。汎用ユーティリティや拡張ロジックを置く `app/lib/` (または `lib/` 直下)。",
      "正しい配置の 1 つだが他にも選択肢がある。Concern (Module による振る舞いの共有) 用で、複数モデルで共通処理を mixin する場面で使う。",
      "正解。Rails は意図的に正解の Service レイヤを規定していないため、上記すべてが現場で広く採用される定番パターン。",
    ],
    hints: [
      "Rails には『正解』が無いが、複数のパターンが定着しています。",
      "Service Object, Concerns, lib それぞれ用途が異なる。",
      "コミュニティでは複数の流派が共存しています。",
    ],
    explanation: {
      summary:
        "Service Object 用に `app/services/`、Mixin 用に `concerns/`、汎用は `app/lib/` が定番。",
      reason:
        "Rails は意図的に Service レイヤを定義していないため、コミュニティで複数パターンが発達: (1) Service Object (`app/services/`), (2) Concern (Module で振る舞いを共有), (3) Form Object, Query Object, Decorator など。Rails 5+ では `app/` 直下のサブディレクトリは自動的に autoload される。",
      beginnerExplanation:
        "Rails は **意図的に『MVC 以外のレイヤ』を規定していません**。これは『フレームワークが指図しすぎず、アプリの規模や流派に合わせて選べるようにする』という DHH の方針です。\n\nその結果、コミュニティで複数のパターンが定着しました:\n\n**1. Service Object (`app/services/`)**\n- 1 つの『動詞』を表すクラス。`PostPublisher`, `OrderCheckout` など。\n- メソッドは大抵 `call` 1 つだけ。`PostPublisher.new(post).call` で実行。\n- Model が肥大化した『複数モデルにまたがる処理』をここに切り出す。\n\n**2. Concern (`app/models/concerns/` や `app/controllers/concerns/`)**\n- Module で振る舞いを共有する仕組み。`include Searchable`, `include SoftDeletable` のように使う。\n- 複数モデルで同じ scope やメソッドを共有したいときに。\n\n**3. lib (`app/lib/` または `lib/` 直下)**\n- 汎用的なユーティリティ。`MyApp::CsvExporter`, `MyApp::Wrapper::SlackClient` など。\n- フレームワーク非依存の純 Ruby コード向き。\n\nさらに **Form Object** (複雑なフォーム用)、**Query Object** (複雑なクエリ用)、**Decorator** (表示ロジック専用) など、用途別の細かいパターンもあります。\n\n**選び方**: 困ったらまず Service Object で始めるのが今のデファクト。Rails 5+ では `app/` 直下に独自ディレクトリを掘れば自動で autoload されるので、`app/services/`, `app/queries/`, `app/forms/` などを必要に応じて作っていけば OK。",
      modelSelfExplanation: {
        conclusion:
          "Rails は意図的に Service レイヤを規定していないため、`app/services/` (Service Object)、`app/models/concerns/` (Module 共有)、`app/lib/` (汎用ユーティリティ) など複数のパターンがすべて『一般的な選択肢』として共存している。",
        reason:
          "DHH は『Rails は意見の押し付けが強いフレームワーク (opinionated)』である一方で、アプリの規模や設計流派は多様なため、Service レイヤだけは意図的に空白にして自由に選べるようにした。これによりコミュニティで Service Object / Concern / Form Object / Query Object / Decorator など複数の有名パターンが発達し、それぞれ用途が異なる。Rails 5+ では `app/` 直下のサブディレクトリは autoload されるため、独自レイヤを追加するコストも低い。",
        example:
          "実務では: 『記事を公開する処理 (DB 更新 + メール送信 + Slack 通知)』を Service Object `PostPublisher.new(post).call` に集約、複数モデルが持つ『論理削除』を Concern `module SoftDeletable` で共有、CSV エクスポート機能を `app/lib/csv_exporter.rb` で汎用化、複雑な検索画面のパラメータ束ね役を Form Object `PostSearchForm` で表現、というように使い分ける。チームの好みや規模で選択は変わる。",
        pitfall:
          "『Service Object に何でも詰め込む』『Concern を mixin しすぎてどのクラスに何があるか分からなくなる』のような乱用が起きやすい。Service は 1 つの動詞 / 1 つの責務に限定 (Single Responsibility)、Concern は 2 つ以上の場所で再利用する場合のみ、と方針を決めておく。チーム内で『どのパターンをどう使うか』のスタイルガイドを早めに合意するのが大切。",
      },
      codeExample:
        '# app/services/post_publisher.rb\nclass PostPublisher\n  def initialize(post); @post = post; end\n  def call\n    @post.update!(published_at: Time.current)\n    NotifyMailer.published(@post).deliver_later\n  end\nend\n\n# Controller から\nPostPublisher.new(@post).call\n\n# Concern (Module で共有)\n# app/models/concerns/soft_deletable.rb\nmodule SoftDeletable\n  extend ActiveSupport::Concern\n  included do\n    scope :active, -> { where(deleted_at: nil) }\n  end\nend',
      commonMistakes: [
        "Service Object に複数の責務を詰め込みすぎる。1 動詞 / 1 クラスを徹底する。",
        "Concern を多用して『どのモデルに何がある』が分からなくなる。2 か所以上で再利用する場合のみ使う。",
      ],
      references: [
        {
          label: "Rails Guides: Active Support Concern",
          url: "https://api.rubyonrails.org/classes/ActiveSupport/Concern.html",
        },
      ],
    },
  },
  {
    id: "rails-007",
    categoryId: "rails-convention",
    difficulty: "intermediate",
    type: "text",
    question:
      "Rails の `config/database.yml` で扱う、開発/テスト/本番などを切り替える概念名は？(英語1単語)",
    answers: ["environment", "environments", "Environment"],
    hints: [
      "`RAILS_ENV` 環境変数で切り替えるアレ。",
      "development / test / production の総称。",
      "`RAILS_ENV` の `ENV` 部分のフル単語そのままで、日本語の「環境」を意味する 11 文字の英単語です。",
    ],
    explanation: {
      summary:
        "Rails の environment は development / test / production などの実行環境を表す。",
      reason:
        "`Rails.env` で現在の環境を取得 (`Rails.env.production?` でブール判定可)。環境ごとに `config/environments/development.rb` 等で設定を分離。`RAILS_ENV` 環境変数で切り替える。",
      beginnerExplanation:
        "Rails は 1 つのコードベースを **複数の『環境 (environment)』** で動かせるよう設計されています。標準で 3 つの環境が用意されています。\n\n- **development** — 開発中のローカル環境。エラー時に詳細なスタックトレース表示、コード変更で自動リロード。\n- **test** — テスト実行時の環境。DB はテスト専用、ランダムシードや fixtures が動く。\n- **production** — 本番運用の環境。アセットは事前コンパイル、エラーは汎用ページ、ログ最小限。\n\n切り替えは **`RAILS_ENV` 環境変数** で:\n```bash\nRAILS_ENV=production rails server\nRAILS_ENV=test rails test\n```\n\n**コードから現在の環境を取る**: `Rails.env`\n```ruby\nRails.env             # => 'development' などの文字列\nRails.env.production? # => true/false の便利メソッド\nif Rails.env.production?\n  send_real_email\nelse\n  Rails.logger.info 'skipped (non-prod)'\nend\n```\n\n**環境ごとの設定** は `config/environments/{development,test,production}.rb` に書きます。例えば本番だけ `config.cache_classes = true` (起動高速化、コード自動リロード無効) のように切り替えます。\n\n**追加の環境** も自由に作れます。`staging` 環境を作るなら `config/environments/staging.rb` を追加し、`RAILS_ENV=staging` で起動。クラウドの本番手前環境を分けたい場面で頻出です。",
      modelSelfExplanation: {
        conclusion:
          "概念名は **environment** (Rails 環境)。development / test / production などの実行モードを表し、`RAILS_ENV` 環境変数や `Rails.env` で参照・切り替えする。",
        reason:
          "1 つのコードベースを開発・テスト・本番のように異なる目的で動かす際、設定 (DB 接続先、ログレベル、メール送信先、キャッシュ戦略など) を切り替える必要がある。Rails はこの軸を『environment』として 1 級の概念にし、`config/database.yml` / `config/environments/*.rb` / `Rails.env` API などで一貫して扱える。標準の 3 環境に加え、staging のような独自環境も追加できる柔軟性を持つ。",
        example:
          "本番だけ `Stripe.api_key = ENV.fetch('STRIPE_LIVE_KEY')`、開発では `Stripe.api_key = 'sk_test_...'` のように分岐。テスト環境では `config.action_mailer.delivery_method = :test` でメール送信せず ActionMailer::Base.deliveries に貯める。Rails.env.production? でしか実行したくない処理 (Slack 通知など) を if 分岐で守る。",
        pitfall:
          "`if Rails.env.production?` を散在させるとテストが書きづらくなる。本来は『ActionMailer の delivery_method 設定』のような形で設定オブジェクト側に環境差を閉じ込め、ビジネスロジックは環境分岐を持たないのが望ましい。さらに RAILS_ENV と RACK_ENV の取り違え、staging を作ったのに `Rails.env.staging?` メソッドが定義されていないなどのハマりも頻発する (`config.eager_load = true` などの環境固有設定を staging.rb で明示する必要)。",
      },
      codeExample:
        '# config/database.yml\ndevelopment:\n  adapter: postgresql\n  database: myapp_dev\ntest:\n  database: myapp_test\nproduction:\n  url: <%= ENV["DATABASE_URL"] %>\n\n# コード内\nif Rails.env.production?\n  send_email\nelse\n  Rails.logger.info "skipped"\nend',
      commonMistakes: [
        "ビジネスロジックに `if Rails.env.production?` を散在させない。設定オブジェクトに閉じ込めるのが望ましい。",
        "独自環境 (staging 等) を作ったら `Rails.env.staging?` が動くよう `config/environments/staging.rb` を明示。",
      ],
      references: [
        {
          label: "Rails Guides: Configuring Rails Applications (公式)",
          url: "https://guides.rubyonrails.org/configuring.html",
        },
      ],
    },
  },
  {
    id: "rails-008",
    categoryId: "rails-convention",
    difficulty: "intermediate",
    type: "choice",
    question:
      "次のうち、Rails の autoload (Zeitwerk) で正しく読み込まれるファイルとクラスの組は？",
    choices: [
      "app/models/blog_post.rb → BlogPost",
      "app/models/blog_post.rb → Blog::Post",
      "app/models/BlogPost.rb → BlogPost",
      "app/models/blogpost.rb → BlogPost",
    ],
    answerIndex: 0,
    choiceExplanations: [
      "正解。snake_case ファイル名 `blog_post.rb` ↔ CamelCase 定数 `BlogPost` が Zeitwerk の規約。ディレクトリが無ければ名前空間も無い。",
      "`Blog::Post` (名前空間あり) と対応するのは `app/models/blog/post.rb` (ディレクトリで階層を表現)。`blog_post.rb` ではない。",
      "Zeitwerk はファイル名を snake_case 前提で解釈する。`BlogPost.rb` (CamelCase) は規約違反で読み込まれない。",
      "`blogpost.rb` のように単語の区切りが無いと『BlogPost』には対応しない (むしろ『Blogpost』として読まれる)。",
    ],
    hints: [
      "ファイル名は snake_case。",
      "ディレクトリは名前空間 (module) に対応。",
      "ファイル名は単純な snake_case、対応するクラスは CamelCase。ディレクトリが無ければ名前空間 (`::`) も付きません。",
    ],
    explanation: {
      summary:
        "ファイル名 snake_case ↔ 定数 CamelCase、ディレクトリ ↔ 名前空間 (module) が Zeitwerk の規約。",
      reason:
        "Rails 6+ は Zeitwerk autoloader を採用。命名規則を厳守する代わりに高速・正確。違反すると `NameError: expected X to define constant Y` のエラー。`zeitwerk:check` で違反を検出可能。",
      beginnerExplanation:
        "Rails 6 以降は **Zeitwerk (ツァイトヴェルク)** という autoloader を標準採用しています。これは『定数名とファイル名・パスを 1 対 1 で対応させる』というルールで動きます。\n\n**マッピングルール**:\n```\napp/models/user.rb                                → User\napp/models/blog_post.rb                           → BlogPost\napp/controllers/admin/users_controller.rb         → Admin::UsersController\napp/services/posts/publisher.rb                   → Posts::Publisher\n```\n\n**3 つの規則**:\n1. **ファイル名は snake_case** (`blog_post.rb`)\n2. **定数名は CamelCase** (`BlogPost`)\n3. **ディレクトリは名前空間 (module/class)** (`admin/` → `Admin::`)\n\n**規約違反の例**:\n- `app/models/user.rb` の中で `class Person` を定義 → `expected to define User, but it didn't` エラー\n- `app/models/BlogPost.rb` (CamelCase ファイル名) → ファイルが見つからない\n- `app/services/posts_publisher.rb` で `class Posts::Publisher` を定義 → 階層が違う\n\n**チェック**: `bin/rails zeitwerk:check` を実行すると、autoload 規則違反を一括検出してくれます。CI に組み込むのがおすすめ。\n\n**メリット**: require 文を書く必要なし、起動高速、ホットリロードも正確。**デメリット**: 規約から外れると即エラー、レガシーコードの移行時にハマりやすい (Rails 6 移行ガイドが詳しい)。",
      modelSelfExplanation: {
        conclusion:
          "Zeitwerk の正しい対応は `app/models/blog_post.rb → BlogPost`。snake_case ファイル名と CamelCase 定数、ディレクトリと名前空間 (module/class) が厳密に対応する。",
        reason:
          "Zeitwerk は Rails 6 で導入された新世代 autoloader で、『定数名から逆引きでファイルパスを決定する』方針を採用。これにより lazy loading の精度と速度が大幅に向上した。代償として規約違反 (ファイル名と定数名の不一致、ディレクトリ階層と名前空間の不一致) は即エラーになるが、エラーメッセージが親切で『どこをどう直すべきか』が明示される。`bin/rails zeitwerk:check` で起動時に違反を一括検出できる。",
        example:
          "Admin 用の Users コントローラーを作るなら `app/controllers/admin/users_controller.rb` に `class Admin::UsersController` (または `module Admin; class UsersController` のネスト構文)。Posts 名前空間下の Publisher サービスなら `app/services/posts/publisher.rb` に `class Posts::Publisher`。STI のサブクラスでも同じく `app/models/post.rb` (Post) → `app/models/featured_post.rb` (FeaturedPost) のように 1 ファイル 1 クラスを徹底する。",
        pitfall:
          "Rails 6 への移行で旧 Classic autoloader からの切り替え時、複数定数を 1 ファイルに詰めていたコードが軒並み壊れる。lib/ 配下のコードや acronym 設定 (例: `API`, `JSON` を含む定数) を Inflector に登録し忘れて autoload エラーになる、というハマりも頻発。Zeitwerk のドキュメントと Rails 6 移行ガイドが必読。",
      },
      codeExample:
        '# 例\napp/models/user.rb                  → User\napp/models/blog_post.rb             → BlogPost\napp/controllers/admin/users_controller.rb\n                                    → Admin::UsersController\napp/services/posts/publisher.rb     → Posts::Publisher\n\n# 規約違反の例 (エラーになる)\n# app/models/user.rb の中で class Person を定義 → NameError',
      commonMistakes: [
        "1 ファイルに複数の定数を詰めると Zeitwerk が混乱する。1 ファイル 1 定数を徹底。",
        "頭文字略語 (API, JSON, HTTP) を含む定数は Inflector の acronym 設定が必要。例: `inflect.acronym 'API'`。",
      ],
      references: [
        {
          label: "Rails Guides: Autoloading and Reloading Constants (Zeitwerk)",
          url: "https://guides.rubyonrails.org/autoloading_and_reloading_constants.html",
        },
      ],
    },
  },
  {
    id: "rails-009",
    categoryId: "rails-convention",
    difficulty: "advanced",
    type: "choice",
    question:
      "`rails console` を `production` 環境で起動するコマンドは？",
    choices: [
      "rails c --production",
      "RAILS_ENV=production rails console",
      "rails console:production",
      "rails console -e prod",
    ],
    answerIndex: 1,
    choiceExplanations: [
      "`--production` のような独自フラグは存在しない。Rails は環境を `-e` オプションか `RAILS_ENV` 環境変数で指定する。",
      "正解。Unix シェル流儀で環境変数を先頭に付けて起動する一般的な書き方。`rails c -e production` でも同じ。",
      "`console:production` のような Rake タスク風サブコマンドは存在しない。",
      "オプション名は `-e` (短) または `--environment` (長) で値は `production` (完全名)。`-e prod` の略は受け付けない。",
    ],
    hints: [
      "`RAILS_ENV` 環境変数で環境を指定します。",
      "`-e production` オプションでも可。",
      "`--production` や `:production` のような独自構文は存在せず、Unix シェル流儀で環境変数を先頭に付けて起動するのが正解。",
    ],
    explanation: {
      summary:
        "`RAILS_ENV=production rails console` (もしくは `rails c -e production`)。",
      reason:
        "本番DBに繋いで調査・対応する時に使う。データを壊さないよう sandbox モード (`rails c --sandbox`) も併用すると、終了時にトランザクションがロールバックされて安全。",
      beginnerExplanation:
        "**Rails console** は対話型シェル (IRB ベース) で、Rails アプリの中身を直接触れる強力なツールです。本番環境で障害調査やワンショット修正をするときに使います。\n\n**起動コマンド**:\n```bash\n# 環境変数で指定 (Unix 流儀)\nRAILS_ENV=production rails console\n\n# オプションで指定 (Rails 流儀)\nrails console -e production\nrails c -e production       # 省略形\n```\n\n**本番接続の危険性**: 本番 DB に直接繋がるので、誤って `User.destroy_all` などを実行すると本当にデータが消えます。**最初に必ず sandbox モードを試す** のが鉄則:\n\n```bash\nRAILS_ENV=production rails c --sandbox\n```\n\n`--sandbox` を付けると **コンソール終了時に全変更がロールバック** されます。調査だけで変更しないつもりでも、念のため sandbox で開く習慣を付けるのが安全。\n\n**運用上の慣習**:\n1. 本番コンソール接続は最小限のメンバーに権限を絞る (SSH or kubectl の権限管理)\n2. 操作ログを取る (記録なしの本番変更は禁忌)\n3. 重要な変更は必ずペアでレビュー\n4. 可能なら『Web 管理画面』『専用スクリプト + PR』で行い、コンソール直接操作を避ける\n\n**Rails 7+** ではより安全な仕組みとして web console / interactive debugger が充実してきていますが、本番障害対応では今でも `rails c` が定番です。",
      modelSelfExplanation: {
        conclusion:
          "本番環境で console を起動するなら `RAILS_ENV=production rails console` (または `rails c -e production`)。`--production` のような独自フラグや `:production` 風サブコマンドは存在しない。",
        reason:
          "Rails の CLI は POSIX 流儀に従い、環境指定は『環境変数 RAILS_ENV』または『-e / --environment オプション』のいずれかを使う。コンソール起動時に Rails アプリ全体 (eager load) を読み込んでから対話シェルを開くので、本番設定 (production の eager load、ログレベル、DB 接続先など) で動作確認・調査ができる。本番に直結する以上、誤操作のリスクが高いため `--sandbox` の併用で『終了時に全変更ロールバック』する習慣が推奨される。",
        example:
          "障害調査で『あるユーザのデータが壊れていないか確認』なら `rails c --sandbox -e production` で起動し、`user = User.find(123); user.posts.count` のように参照だけ。修正が必要な場合は別途 PR にマイグレーションや専用 rake task を書いてレビュー後にデプロイするのが安全。緊急時の一時パッチでも『コンソール操作の前後で必ず DB スナップショット』を取るチームが多い。",
        pitfall:
          "本番コンソールでうっかり `User.destroy_all` や `Post.update_all(deleted: true)` を実行すると即座に全レコードが破壊される。`-e production` の打ち間違いで dev 環境のつもりが本番だった、というのも頻発。チームで『本番 console 接続は必ず sandbox から』『破壊系メソッドは禁止』『操作内容は Slack / Notion に残す』などの運用ガイドラインを作る。さらに rails-config_for / paranoia gem 等で『破壊的操作の二重確認』を仕込むのも有効。",
      },
      codeExample:
        "# 本番接続で起動 (危険なので慎重に)\nRAILS_ENV=production rails console\n# または\nrails console -e production\n\n# サンドボックスモード (終了時に全変更ロールバック)\nrails console --sandbox\nRAILS_ENV=production rails c --sandbox\n\n# Rails 7+ で immutable な調査推奨パターン\nuser = User.find(1)\nuser.attributes  # 確認のみ",
      commonMistakes: [
        "本番で素の `rails c` を打ってしまい update / destroy を誤実行。`--sandbox` を習慣化する。",
        "本番コンソール操作の記録が残らない。Slack / Notion など共有先に必ずログを残す運用ルールを作る。",
      ],
      references: [
        {
          label: "Rails Guides: The Rails Command Line (公式)",
          url: "https://guides.rubyonrails.org/command_line.html#bin-rails-console",
        },
      ],
    },
  },
  {
    id: "rails-010",
    categoryId: "rails-convention",
    difficulty: "advanced",
    type: "choice",
    question:
      "Rails で『環境別の秘密情報』を暗号化して管理する仕組みは？",
    choices: [
      "ENV ファイル (.env)",
      "config/secrets.yml (Rails 4)",
      "config/credentials.yml.enc + EDITOR=vim rails credentials:edit",
      "config/database.yml に直書き",
    ],
    answerIndex: 2,
    choiceExplanations: [
      "`.env` は dotenv gem の機能で Rails 標準ではない。平文で OS の環境変数に展開する仕組みで、暗号化はされない。",
      "`secrets.yml` は Rails 4 で導入された旧来の仕組み (平文 YAML)。Rails 5.2 で credentials に置き換えられ非推奨。",
      "正解。Rails 5.2 以降の公式機構。`config/credentials.yml.enc` を `master.key` で暗号化保存し、リポジトリに含めても安全。`EDITOR=vim rails credentials:edit` で一時復号して編集できる。",
      "DB 接続情報を `database.yml` に直書きするのは典型的なアンチパターン。本番接続文字列がリポジトリに混入してセキュリティリスクになる。",
    ],
    hints: [
      "Rails 5.2 以降で導入された仕組み。",
      "暗号化されたファイルをリポジトリに含め、master.key で復号。",
      "Rails 5.2 以降の正式機構で、ファイル名末尾は `.enc` (encrypted)。`secrets.yml` や `.env` は旧来の手段で公式の解ではありません。",
    ],
    explanation: {
      summary:
        "Rails 5.2+ は credentials.yml.enc + master.key で暗号化シークレット管理。",
      reason:
        "`config/master.key` (gitignore 必須) で `credentials.yml.enc` を復号。本番には RAILS_MASTER_KEY 環境変数で渡す。Rails 6 からは環境別 (`config/credentials/production.yml.enc`) も可能。",
      beginnerExplanation:
        "**Encrypted Credentials** は Rails 5.2 から導入された **公式の秘密情報管理機構** です。API キーやパスワードのような秘密情報を Git にコミットしても安全に管理できます。\n\n**仕組み**:\n- 平文の秘密情報は `config/credentials.yml.enc` に **暗号化された状態** で保存される\n- 復号には `config/master.key` (32 文字のランダム文字列) が必要\n- `master.key` は `.gitignore` で必ず除外する\n- 本番環境では `RAILS_MASTER_KEY` 環境変数で master key を渡す\n\n**編集 (一時的に復号して $EDITOR で開く)**:\n```bash\nEDITOR=vim rails credentials:edit\n```\nエディタを閉じると自動的に暗号化されて保存される。\n\n**コードから参照**:\n```ruby\nRails.application.credentials.aws[:access_key_id]\nRails.application.credentials.dig(:stripe, :secret_key)\nRails.application.credentials.fetch(:github_token)  # 無ければ KeyError\n```\n\n**Rails 6+ では環境別** にも対応:\n```bash\nEDITOR=vim rails credentials:edit --environment production\n# config/credentials/production.yml.enc が生成される\n```\n\n**従来との比較**:\n- `secrets.yml` (Rails 4) — 平文 YAML、Git に入れたら漏洩リスク → 非推奨\n- `.env` (dotenv) — 平文、Rails 標準ではない → 開発環境では使う場面もあるが本番は credentials 推奨\n- `database.yml` 直書き — アンチパターン、絶対にやらない\n\n**運用ベストプラクティス**:\n- `master.key` は安全な場所 (1Password, AWS Secrets Manager) に複製を保管\n- 本番には `RAILS_MASTER_KEY` 環境変数で注入 (ECS, Heroku, k8s Secret)\n- 万一漏洩したら master.key を rotate (再生成 → 再暗号化 → 全環境に再配布)",
      modelSelfExplanation: {
        conclusion:
          "Rails 5.2 以降の公式機構は **`config/credentials.yml.enc` + `master.key`**。`EDITOR=vim rails credentials:edit` で一時復号して編集する。`.env` や旧 `secrets.yml` は標準ではない / 非推奨。",
        reason:
          "従来の Rails では平文 YAML (`secrets.yml`) や OS 環境変数 (`ENV`) で秘密情報を管理していたが、リポジトリに含めると漏洩、含めないと管理が煩雑というジレンマがあった。Rails 5.2 で導入された Encrypted Credentials は『暗号化したファイルをリポジトリに含め、復号鍵 (master.key) だけを安全に配布』することで両方を解決。Rails 6 からは環境別 (development/staging/production) のクレデンシャルも管理できる。",
        example:
          "Stripe / AWS / SendGrid / Slack の API キーを `EDITOR=vim rails credentials:edit` で 1 ファイルに集約管理。Rails コードでは `Stripe.api_key = Rails.application.credentials.stripe[:secret_key]` のように参照する。本番デプロイ時には ECS タスク定義や k8s Secret で `RAILS_MASTER_KEY` を環境変数として注入。",
        pitfall:
          "`master.key` を Git にコミットしてしまうと、暗号化の意味が無くなり全 credentials が漏洩する。`.gitignore` に必ず登録し、新規参加者には Slack DM / 1Password で個別に共有。さらに『複数人で credentials を編集すると暗号化バイナリのコンフリクトが解消困難』なので、編集はチームで調整するか、staging.yml.enc に分割するなどの工夫が必要。master.key を rotate する手順 (旧キーで復号 → 新キーで再暗号化 → 全環境配布) もドキュメント化しておく。",
      },
      codeExample:
        '# 編集 (一時的に復号して $EDITOR で開く)\nEDITOR=vim rails credentials:edit\n# または環境別\nEDITOR=vim rails credentials:edit --environment production\n\n# コード内で参照\nRails.application.credentials.aws[:access_key_id]\nRails.application.credentials.dig(:stripe, :secret_key)\n\n# 本番環境変数\nRAILS_MASTER_KEY="abc..." # ECS/Heroku 等で設定',
      commonMistakes: [
        "`master.key` を Git にコミットしてしまう。`.gitignore` で除外を徹底し、新規参加者には別途共有。",
        "credentials の暗号化ファイルでコンフリクトが起きる。チームで編集タイミングを調整するか、環境別ファイルに分割する。",
      ],
      references: [
        {
          label: "Rails Guides: Securing Rails Applications (公式・Custom credentials)",
          url: "https://guides.rubyonrails.org/security.html#custom-credentials",
        },
      ],
    },
  },

  // ===========================================================================
  // ルーティング & コントローラ (12問)
  // ===========================================================================
  {
    id: "rt-001",
    categoryId: "routing-controller",
    difficulty: "beginner",
    type: "choice",
    question:
      "`config/routes.rb` に `resources :posts` と書いたとき、自動生成されないルートはどれ？",
    choices: [
      "GET /posts (index)",
      "GET /posts/new (new)",
      "GET /posts/:id (show)",
      "GET /posts/search (search)",
    ],
    answerIndex: 3,
    hints: [
      "`resources` は RESTful な 7 アクションを生成。",
      "index, show, new, create, edit, update, destroy の 7 つ。",
      "RESTful の標準セット (index/show/new/create/edit/update/destroy) に当てはまらないアクション名が 1 つだけ混じっています。",
    ],
    explanation: {
      summary:
        "`resources` は 7 つの RESTful ルートを生成。カスタムは別途。",
      reason:
        "生成される 7 つ: index (GET /), show (GET /:id), new (GET /new), create (POST /), edit (GET /:id/edit), update (PATCH/PUT /:id), destroy (DELETE /:id)。`rails routes` で確認可。",
      codeExample:
        "# 7つすべて生成\nresources :posts\n\n# 一部だけ生成\nresources :posts, only:   [:index, :show]\nresources :posts, except: [:destroy]\n\n# カスタムアクション\nresources :posts do\n  collection do\n    get :search           # /posts/search\n  end\n  member do\n    post :publish         # /posts/:id/publish\n  end\nend\n\n# 単数形 resource (id 無し、1リソース用)\nresource :profile         # /profile (show/edit/update/destroy)",
    },
  },
  {
    id: "rt-002",
    categoryId: "routing-controller",
    difficulty: "beginner",
    type: "choice",
    question:
      "URL `/posts/42` の `42` をコントローラで取得するには？",
    choices: [
      "params[:id]",
      "params.id",
      "request[:id]",
      "session[:id]",
    ],
    answerIndex: 0,
    hints: [
      "params は ActionController::Parameters のインスタンス。",
      "Hash のように `[:キー]` で取り出します。",
      "ドット (`.id`) ではなく Hash と同じ角括弧アクセスを使うのが Rails の標準。`request`/`session` ではフォームや URL のパラメータは取れません。",
    ],
    explanation: {
      summary: "params[:id] で URL のパスパラメータを取得。",
      reason:
        "params には URL パラメータ・クエリパラメータ・POST ボディが統合されて入る。`params[:id]` は常に文字列なので、数値が欲しい時は `params[:id].to_i`、ただし `Post.find(params[:id])` は自動で変換してくれる。",
      codeExample:
        "class PostsController < ApplicationController\n  def show\n    @post = Post.find(params[:id])  # /posts/42 → 42\n  end\n\n  def create\n    # params[:post] でフォーム全体取得\n    @post = Post.new(post_params)\n  end\n\n  private\n\n  def post_params\n    params.require(:post).permit(:title, :body)\n  end\nend",
    },
  },
  {
    id: "rt-003",
    categoryId: "routing-controller",
    difficulty: "beginner",
    type: "choice",
    question: "コントローラから別 URL にリダイレクトするメソッドは？",
    choices: ["redirect_to", "render", "forward", "goto"],
    answerIndex: 0,
    hints: [
      "HTTP 302 を返してブラウザを別URLに飛ばします。",
      "`render` は同じレスポンス内でテンプレートを描画するメソッド。",
      "選択肢のうち、HTTP 302 (Location ヘッダー付き) を返すことを名前で表しているメソッドは 1 つだけです。",
    ],
    explanation: {
      summary: "`redirect_to` は HTTP リダイレクト、`render` は描画。",
      reason:
        "両者は混同しやすい: redirect_to は新しい HTTP リクエストを発生させ URL も変わる (PRG パターンで使用)。render は同一リクエスト内で別テンプレートを表示するだけで URL は変わらない。",
      codeExample:
        '# POST /posts → /posts/1 (PRG: Post-Redirect-Get)\ndef create\n  @post = Post.create(post_params)\n  if @post.persisted?\n    redirect_to @post, notice: "作成しました"\n  else\n    render :new, status: :unprocessable_entity\n  end\nend\n\n# その他\nredirect_to root_path\nredirect_back(fallback_location: root_path)\nredirect_to @post, status: :see_other  # 303 (DELETE 後の推奨)',
      commonMistakes: [
        "Turbo (Rails 7+) では form 失敗時は `status: :unprocessable_entity` を付けないと正しくフォーム再表示されない。",
      ],
    },
  },
  {
    id: "rt-004",
    categoryId: "routing-controller",
    difficulty: "intermediate",
    type: "choice",
    question:
      "コントローラで、全アクション実行前にユーザー認証を行う Rails 標準の仕組みは？",
    choices: ["before_filter", "before_action", "around_filter", "after_action"],
    answerIndex: 1,
    hints: [
      "Rails 4 以前は別名でした。",
      "`before_*` 系のメソッドです。",
      "Rails 4 で `_filter` 系から `_action` 系へリネームされ、現在は after や around も含めて `_action` 命名で統一されています。",
    ],
    explanation: {
      summary: "Rails 5+ は `before_action` が標準 (`before_filter` は廃止)。",
      reason:
        "`before_action :method` でアクション実行前にフィルターを実行。`only:` / `except:` で対象アクションを絞れる。複数連結可能。`after_action`, `around_action` も同様。",
      codeExample:
        "class PostsController < ApplicationController\n  before_action :authenticate_user!\n  before_action :set_post, only: %i[show edit update destroy]\n  before_action :authorize!, only: %i[edit update destroy]\n\n  def show; end\n  def edit; end\n\n  private\n\n  def set_post\n    @post = Post.find(params[:id])\n  end\n\n  def authorize!\n    redirect_to root_path unless @post.user == current_user\n  end\nend",
    },
  },
  {
    id: "rt-005",
    categoryId: "routing-controller",
    difficulty: "intermediate",
    type: "text",
    question:
      "params から `name` と `email` だけを取り出し、不正なキー混入を防ぐ Rails の仕組みを何と呼ぶ？(カタカナまたは英語)",
    answers: [
      "Strong Parameters",
      "strong parameters",
      "strong_parameters",
      "ストロングパラメータ",
      "ストロングパラメーター",
    ],
    hints: [
      "Rails 4 で導入。",
      "`params.require(:user).permit(:name, :email)` のように書きます。",
      "Mass Assignment 脆弱性を防ぐための仕組み。",
    ],
    explanation: {
      summary:
        "Strong Parameters は permit で許可したキーだけを通し、Mass Assignment 攻撃を防ぐ。",
      reason:
        "Rails 3 までは Model 側で `attr_accessible` で防いでいたが、Controller 責務に移った。`require` で必須キー、`permit` で許可キーを宣言。",
      codeExample:
        "def create\n  @user = User.new(user_params)\n  ...\nend\n\nprivate\n\ndef user_params\n  params.require(:user).permit(:name, :email, :age)\nend\n\n# ネスト\nparams.require(:post).permit(\n  :title, :body,\n  tag_ids: [],                  # 配列\n  comments_attributes: [:body]  # ネスト Hash\n)\n\n# Rails 7.1+ params.expect\nparams.expect(user: [:name, :email])",
      commonMistakes: [
        "`permit!` (引数なし) で全許可は Mass Assignment 脆弱性を再導入してしまうので絶対避ける。",
      ],
    },
  },
  {
    id: "rt-006",
    categoryId: "routing-controller",
    difficulty: "intermediate",
    type: "choice",
    question:
      "`resources :posts do; resources :comments; end` でネスト したとき、生成されるルートの URL パターンとして正しいのは？",
    choices: [
      "/comments",
      "/posts/:post_id/comments",
      "/posts/comments/:id",
      "/posts/:id/comments/:id",
    ],
    answerIndex: 1,
    hints: [
      "ネストリソースは親 ID をパスに含めます。",
      "`/posts/:post_id/comments` の形になります。",
      "親リソースの id はパスパラメータとして `{単数形}_id` のキーで渡され、子リソース側はその下にネストして並びます。",
    ],
    explanation: {
      summary:
        "ネストリソースは `/parent/:parent_id/child` の URL になる。",
      reason:
        "親子関係を URL に表現できる。ただし深くネストすると URL が長くなり保守性が落ちるので、ネストは 1 段までに留めるのが定石 (shallow ネストオプションで深いネストを浅くできる)。",
      codeExample:
        "resources :posts do\n  resources :comments\nend\n# GET    /posts/:post_id/comments\n# POST   /posts/:post_id/comments\n# GET    /comments/:id   ← 出ない (出すには shallow)\n\n# shallow ネスト (推奨)\nresources :posts do\n  resources :comments, shallow: true\nend\n# index/create だけ親付き、その他は /comments/:id\n\n# コントローラ\nclass CommentsController < ApplicationController\n  def create\n    @post = Post.find(params[:post_id])\n    @comment = @post.comments.create!(comment_params)\n  end\nend",
    },
  },
  {
    id: "rt-007",
    categoryId: "routing-controller",
    difficulty: "intermediate",
    type: "choice",
    question:
      "Rails で routes ファイルから URL Helper を使うコードとして適切なのは？",
    choices: [
      "posts_url",
      "url_for(controller: 'posts')",
      "post_path(post)",
      "上記すべて使える",
    ],
    answerIndex: 3,
    hints: [
      "`resources :posts` を書くと自動でヘルパーが生成されます。",
      "`_path` (相対) と `_url` (絶対) の 2 種類。",
      "`url_for` でハッシュ指定もできる。",
    ],
    explanation: {
      summary:
        "URL Helper は resources から自動生成。_path (相対) / _url (絶対) の両方。",
      reason:
        "`resources :posts` で `posts_path` `post_path(post)` `new_post_path` `edit_post_path(post)` などが生成。引数にモデルインスタンスを渡せば `post_path(post)` のように書ける。",
      codeExample:
        '# routes\nresources :posts\n\n# 生成される helpers\nposts_path              # "/posts"\npost_path(@post)        # "/posts/1"\nnew_post_path           # "/posts/new"\nedit_post_path(@post)   # "/posts/1/edit"\n\n# _url は host 込み\nposts_url               # "http://example.com/posts"\n\n# link_to などでよく使う\n<%= link_to "詳細", post_path(@post) %>\n<%= link_to "詳細", @post %>           # ←モデル渡しでもOK',
    },
  },
  {
    id: "rt-008",
    categoryId: "routing-controller",
    difficulty: "intermediate",
    type: "choice",
    question: "次の routes.rb の効果は？",
    code: 'namespace :admin do\n  resources :users\nend',
    choices: [
      "/users → AdminController#users",
      "/admin/users → Admin::UsersController",
      "/users → Admin::UsersController",
      "/admin/users → UsersController",
    ],
    answerIndex: 1,
    hints: [
      "`namespace` は URL とコントローラ両方に prefix を付ける。",
      "URL: `/admin/users`、コントローラ: `Admin::UsersController`。",
      "URL とクラス名の両方に `admin` が乗る形が正解。片方にしか付かない選択肢は誤りです。",
    ],
    explanation: {
      summary:
        "`namespace` は URL prefix + module スコープ。`/admin/users` ↔ `Admin::UsersController`。",
      reason:
        "管理画面など、URL もコントローラも別空間にしたい時に使う。URL だけ prefix したい (コントローラはそのまま) なら `scope '/admin'`、コントローラだけ namespace したいなら `scope module: 'admin'`。",
      codeExample:
        "namespace :admin do\n  resources :users\nend\n# /admin/users → Admin::UsersController\n# ファイル: app/controllers/admin/users_controller.rb\n\n# URL だけ /admin、コントローラは普通の UsersController\nscope '/admin' do\n  resources :users\nend\n# /admin/users → UsersController\n\n# コントローラだけ Admin::、URL は普通\nscope module: 'admin' do\n  resources :users\nend\n# /users → Admin::UsersController",
    },
  },
  {
    id: "rt-009",
    categoryId: "routing-controller",
    difficulty: "intermediate",
    type: "text",
    question:
      "ルーティング一覧 (routes.rb の効果) を確認する Rails コマンドは？(コマンド全体、例: rails xxxxx)",
    answers: [
      "rails routes",
      "rake routes",
      "bin/rails routes",
      "rails routes -c posts",
    ],
    hints: [
      "Rails 5+ では `rails` コマンドに統合。",
      "古いバージョンは `rake routes`。",
      "`rails` の後ろに、設問の URL/ルート構成を表す英単語の複数形 1 語を続けます。",
    ],
    explanation: {
      summary: "`rails routes` で全ルート一覧表示。",
      reason:
        "URL Helper, HTTP メソッド, URL, コントローラ#アクションが一覧表示される。膨大な場合は `-c コントローラ名` で絞り込み、`-g キーワード` で grep。ブラウザでは `/rails/info/routes` でも見られる (開発環境)。",
      codeExample:
        '# 全ルート\nrails routes\n\n# 特定コントローラのみ\nrails routes -c posts\n\n# 文字列でフィルタ\nrails routes -g admin\n\n# 例: 出力\n# Prefix Verb   URI Pattern        Controller#Action\n#  posts GET    /posts(.:format)   posts#index\n#        POST   /posts(.:format)   posts#create\n#   post GET    /posts/:id         posts#show',
    },
  },
  {
    id: "rt-010",
    categoryId: "routing-controller",
    difficulty: "advanced",
    type: "choice",
    question:
      "次のうち、Rails コントローラの `render` で正しくないものは？",
    choices: [
      "render :edit",
      'render json: @user',
      "render plain: 'hello'",
      "render redirect_to: root_path",
    ],
    answerIndex: 3,
    hints: [
      "`render` はテンプレートやデータを描画。",
      "リダイレクトは `redirect_to` (別メソッド)。",
      "render の引数は描画対象 (テンプレート名・json・plain など) を取るもので、別メソッドであるリダイレクトを混ぜ込むことはできません。",
    ],
    explanation: {
      summary:
        "render はレンダリング、redirect_to はリダイレクト。混ぜたオプションは無い。",
      reason:
        "render と redirect_to は別物。render の主なオプション: :template/:partial/:json/:xml/:plain/:html/:status/:layout/:file 等。1 アクションで render と redirect_to を両方書くと `DoubleRenderError`。",
      codeExample:
        "render :show                       # 別テンプレ\nrender 'posts/index'\nrender json: @user                 # JSON\nrender json: @user, status: :created\nrender plain: 'Hello'              # text/plain\nrender html: '<b>Hi</b>'.html_safe # HTML 文字列\nrender file: '/path/to/file'\nrender layout: false               # レイアウト無し\nrender nothing: true, status: 204  # ← Rails 5+ は head :no_content\n\n# レンダリング後は return で抜ける (DoubleRenderError 回避)\nreturn render(json: {error:'x'}, status: 422) if invalid?",
    },
  },
  {
    id: "rt-011",
    categoryId: "routing-controller",
    difficulty: "advanced",
    type: "choice",
    question:
      "Rails 7 で Hotwire (Turbo) を使った場合、form 送信が失敗した時に `:unprocessable_entity` ステータスで再 render するのはなぜ？",
    choices: [
      "200 でも何でも動くが慣習",
      "Turbo は 4xx でないとフォームの再表示を行わない",
      "200 だと Rails が例外を投げる",
      "Devise の制約",
    ],
    answerIndex: 1,
    hints: [
      "Turbo はフォームの内容を Turbo Stream として再描画する。",
      "200 OK だとリダイレクト扱いになってフォームが消えてしまう。",
      "Turbo はステータスコードでフォーム送信の成否を判定するため、2xx 系を返すとフォームが消えて意図しない挙動になります。",
    ],
    explanation: {
      summary:
        "Turbo はフォーム送信失敗時に 4xx を期待。`status: :unprocessable_entity` (422) で再 render する。",
      reason:
        "Rails 7 の Turbo は、フォーム送信レスポンスを判定: 2xx ならリダイレクト/成功、4xx ならフォーム再表示として `<turbo-frame>` を差し替える。200 で再 render するとフォームが破棄され画面が空白になる。",
      codeExample:
        'def create\n  @post = Post.new(post_params)\n  if @post.save\n    redirect_to @post, notice: "Created"\n  else\n    render :new, status: :unprocessable_entity  # ← 重要 (422)\n  end\nend\n\ndef update\n  if @post.update(post_params)\n    redirect_to @post\n  else\n    render :edit, status: :unprocessable_entity\n  end\nend',
    },
  },
  {
    id: "rt-012",
    categoryId: "routing-controller",
    difficulty: "advanced",
    type: "choice",
    question:
      "`rescue_from` の正しい使い方は？",
    choices: [
      "コントローラで特定例外をキャッチして共通処理を書く",
      "Model のバリデーションエラーを捕まえる",
      "View のレンダリング失敗を捕まえる",
      "ルーティングエラーを捕まえる",
    ],
    answerIndex: 0,
    hints: [
      "コントローラのクラスマクロ。",
      "特定の例外クラスをコントローラレベルでハンドリングする。",
      "`rescue_from ActiveRecord::RecordNotFound, with: :not_found` のように書きます。",
    ],
    explanation: {
      summary:
        "`rescue_from` はコントローラ内で発生した例外を共通ハンドリングする宣言。",
      reason:
        "全アクションで try/rescue を書く代わりに、ApplicationController で `rescue_from ActiveRecord::RecordNotFound` などまとめてハンドルできる。404/403/500 ページ生成や、API エラー JSON 返却に便利。",
      codeExample:
        "class ApplicationController < ActionController::Base\n  rescue_from ActiveRecord::RecordNotFound, with: :not_found\n  rescue_from Pundit::NotAuthorizedError, with: :forbidden\n  rescue_from StandardError, with: :server_error if Rails.env.production?\n\n  private\n\n  def not_found\n    render 'errors/404', status: :not_found\n  end\n\n  def forbidden\n    render 'errors/403', status: :forbidden\n  end\nend",
    },
  },

  // ===========================================================================
  // ActiveRecord (18問)
  // ===========================================================================
  {
    id: "ar-001",
    categoryId: "active-record",
    difficulty: "beginner",
    type: "choice",
    question:
      "User が複数の Post を持つ関係を表す ActiveRecord の宣言は？",
    code: "class User < ApplicationRecord\n  ???\nend",
    choices: [
      "has_one :posts",
      "belongs_to :posts",
      "has_many :posts",
      "has_and_belongs :posts",
    ],
    answerIndex: 2,
    choiceExplanations: [
      "`has_one` は『1 対 1 で 1 つだけ持つ』関係 (例: User has_one :profile)。引数も単数形にすべき。複数持つ関係には使わない。",
      "`belongs_to` は子側 (外部キーを持つ側) で使う宣言。User → Post の親側で使うのは誤り。さらに引数も単数形で書く。",
      "正解。1 対多で『複数を持つ親側』が `has_many`、引数は複数形のシンボル `:posts`。",
      "`has_and_belongs_to_many` (HABTM) は中間テーブルを使う多対多の関係。1 対多ではない上、メソッド名も短縮形は存在しない。",
    ],
    hints: [
      "1対多の関係です。",
      "`has_*` の系統。",
      "User 側 (= 親) から見て複数の Post を持つ関係なので、メソッド名は「複数を持つ」を意味する 8 文字で、引数は複数形のシンボル。",
    ],
    explanation: {
      summary: "1対多は親 `has_many`、子 `belongs_to`。",
      reason:
        "子側 (posts テーブル) に `user_id` 外部キーが必要。`belongs_to` は Rails 5+ で必須デフォルト (nil 不可)。`optional: true` で null 許容。",
      beginnerExplanation:
        "ActiveRecord の関連付け (associations) の基本パターンです。\n\n**1 対多** は最もよく使う関係です。例: 1 人の User が複数の Post を持つ。\n\n親側 (User) → `has_many :posts`\n子側 (Post) → `belongs_to :user`\n\n**ポイント**:\n- 親側のメソッド名は **複数形** (`:posts`)\n- 子側のメソッド名は **単数形** (`:user`)\n- **外部キー (user_id) は『多』側 (Post 側)** のテーブルに置く\n\nマイグレーションでは:\n```ruby\nt.references :user, null: false, foreign_key: true\n# → user_id INTEGER NOT NULL + 外部キー制約\n```\n\n**使い方**:\n```ruby\nuser.posts                      # SELECT * FROM posts WHERE user_id = 1\nuser.posts.create!(title: 'Hi') # user_id を自動でセット\npost.user                       # SELECT * FROM users WHERE id = post.user_id\n```\n\n**Rails 5 以降**、`belongs_to` はデフォルトで **必須 (NOT NULL 相当)**。`user_id` が nil のままだと validation エラーになります。null を許可したい場合は `belongs_to :category, optional: true` のように明示します。\n\n**親が消えたら子も消したい** なら `has_many :posts, dependent: :destroy` (またはより高速な `dependent: :delete_all`、関連は残したい場合は `:nullify`)。\n\n**関連の種類**: 1対1 (`has_one` + `belongs_to`)、多対多 (`has_many :through` 推奨、HABTM は中間モデル不要だが拡張性に劣る)、ポリモーフィック関連 (`belongs_to :commentable, polymorphic: true`) など。",
      modelSelfExplanation: {
        conclusion:
          "正しい宣言は `has_many :posts`。1 対多の関係で『複数を持つ親側』が has_many、子側が belongs_to、外部キー (user_id) は子テーブル (posts) に置く。",
        reason:
          "ActiveRecord の関連付けは DSL で宣言するだけで、対応する getter / setter / クエリメソッドが自動生成される。has_many は『この親は対応する複数の子レコードを持つ』ことを表し、引数は対応する子モデルの複数形シンボル。Rails は内部でこの宣言を見て user.posts のクエリを posts WHERE user_id = ? に変換する。外部キーは必ず多側に置くのが RDB の原則で、has_many の側ではなく belongs_to の側 (Post) のテーブルに user_id カラムを作る。",
        example:
          "ブログアプリで User has_many :posts, dependent: :destroy / Post belongs_to :user とすれば、user.posts.create!(title: 'hi') で user_id 自動セット、user.destroy で関連 posts も削除される。さらに `has_many :comments, through: :posts` のように through 経由で多段の関連も簡単に書ける。",
        pitfall:
          "Rails 5+ では belongs_to がデフォルトで required (nil 不可) なので、optional: true を付け忘れると既存データの保存時に validation エラー。さらに dependent: :destroy は『子レコードごとに callback 起動』するため大量データだと遅く、純粋削除なら :delete_all が高速。逆に N+1 を生まないために has_many 経由でアクセスする場合は includes でプリロードする。",
      },
      codeExample:
        'class User < ApplicationRecord\n  has_many :posts, dependent: :destroy\nend\n\nclass Post < ApplicationRecord\n  belongs_to :user                  # user_id NOT NULL\n  belongs_to :category, optional: true  # null OK\nend\n\n# 使い方\nuser = User.find(1)\nuser.posts             # User の Post 一覧\nuser.posts.create!(title: "Hi")\npost.user              # Post の User\n\n# マイグレーション\nt.references :user, null: false, foreign_key: true',
      commonMistakes: [
        "Rails 5+ で belongs_to の optional 指定を忘れると、null が許される設計のはずがバリデーションエラーになる。",
        "dependent: :destroy は callback 起動で遅い。純粋削除でいいなら :delete_all を検討。",
      ],
      references: [
        {
          label: "Rails Guides: Active Record Associations (公式)",
          url: "https://guides.rubyonrails.org/association_basics.html",
        },
      ],
    },
  },
  {
    id: "ar-002",
    categoryId: "active-record",
    difficulty: "beginner",
    type: "choice",
    question:
      "User テーブルから id が 1 のレコードを取得する最も慣習的なコードは？",
    choices: [
      "User.where(id: 1)",
      "User.find(1)",
      "User.select(1)",
      "User.get(1)",
    ],
    answerIndex: 1,
    choiceExplanations: [
      "`where` は条件にマッチするレコードを Relation (配列ライク) で返す。単一レコードが欲しいなら `.first` を続けるか find を使う。さらに where は『見つからなくても空配列』なので例外にならない。",
      "正解。`find(id)` は主キー指定で 1 件取得、見つからなければ ActiveRecord::RecordNotFound 例外を投げる。コントローラで使うと自動で 404 ページが返るので RESTful な show アクションでは定番。",
      "`select` は『SELECT 句のカラムを指定する』メソッドで、ID で絞り込む用途ではない。`User.select(:id, :name)` のように使う。",
      "ActiveRecord に `get` メソッドは無い。RESTful の HTTP メソッド名と混同しないように。",
    ],
    hints: [
      "`where` は ActiveRecord::Relation を返します。",
      "1件取得 + 無ければ例外 = ?",
      "選択肢のうち、Relation ではなく単一レコードを返し、見つからなければ ActiveRecord::RecordNotFound を投げる 4 文字メソッドを選んでください。",
    ],
    explanation: {
      summary:
        "`find(id)` は 1 件 + 無ければ RecordNotFound 例外。",
      reason:
        "`find` は主キー指定、無ければ例外 (404 として自動処理されることも)。`find_by(条件)` は条件で 1 件、無ければ nil。`where(id: 1).first` は条件マッチ 1 件、無ければ nil。意図に応じて使い分ける。",
      beginnerExplanation:
        "ActiveRecord で『1 件取得する』にはいくつかの選択肢があり、使い分けが重要です。\n\n**`find(id)`** — 主キー指定、無ければ例外\n```ruby\nUser.find(1)    # SELECT * FROM users WHERE id = 1 LIMIT 1\n               # 無ければ ActiveRecord::RecordNotFound\n```\nコントローラの show / edit / update / destroy アクションで使う定番。RecordNotFound は Rails が自動で 404 ページに変換してくれる。\n\n**`find_by(条件)`** — 条件で 1 件、無ければ nil\n```ruby\nUser.find_by(email: 'a@example.com')\n# 無ければ nil (例外なし)\n```\nメールアドレスやユーザー名で検索する場面で使う。nil 判定を自分で書く必要あり。\n\n**`where(条件).first`** — Relation 経由で 1 件、無ければ nil\n```ruby\nUser.where(active: true).first\n```\nさらに絞り込みやチェインが必要なときに。\n\n**使い分けの目安**:\n- ID で 1 件取得 → `find(id)` (404 自動)\n- 任意のカラムで 1 件取得 → `find_by(条件)`\n- 複雑な検索の最初の 1 件 → `where(条件).first`\n\n**複数取得**:\n```ruby\nUser.find([1, 2, 3])       # 配列。1 つでも無いと例外\nUser.where(id: [1, 2, 3])  # 見つかった分だけ。例外なし\n```\n\n**ベストプラクティス**: 『無ければ 404 にしたい』なら find、『無ければ nil でフォールバック』なら find_by を使う。意図がコードから読めるようになる。",
      modelSelfExplanation: {
        conclusion:
          "正解は `User.find(1)`。主キー指定で 1 件取得し、無ければ ActiveRecord::RecordNotFound 例外を投げる ActiveRecord の基本メソッド。",
        reason:
          "`find(id)` は『主キー検索 + 必ず 1 件返す』というセマンティクスを持ち、見つからないことが『データ不整合や URL 偽造』を意味するため例外で即座に止める設計。Rails のコントローラでは未捕捉の RecordNotFound が自動で 404 レスポンスに変換されるため、show / edit / update / destroy のような『この ID のレコードが存在する前提』のアクションで使うと簡潔。一方 `find_by` や `where(...).first` は『見つからない可能性が業務上ある』場面 (任意検索) で使い、nil を返してアプリ側で if 分岐する。",
        example:
          "PostsController#show なら `@post = Post.find(params[:id])` の 1 行で取得 + 404 自動が完成。一方ログイン処理では `user = User.find_by(email: params[:email])` でメール検索 (見つからない可能性あり)、`if user&.authenticate(params[:password])` で進む。複数取得は `User.where(active: true).where('last_login_at > ?', 1.week.ago)` のように Relation チェインで絞り込む。",
        pitfall:
          "`find` を任意検索 (email など) で使うと『見つからない = 想定内のフロー』なのに例外で止まってしまう。逆に `find_by` を ID 検索で使うと 404 を返すために自分で if nil の分岐を書く必要が出る。意図によって使い分けるのが大事。さらに `find(non_existing_id)` の例外をうっかり rescue Exception で握ると 404 が機能しなくなるので注意。",
      },
      codeExample:
        "User.find(1)              # 例外 ActiveRecord::RecordNotFound\nUser.find_by(id: 1)       # nil\nUser.find_by(email: 'a')  # 条件でも使える\nUser.where(id: 1).first   # nil\n\n# 複数取得\nUser.find([1, 2, 3])      # 例外 (1つでも無いと)\nUser.where(id: [1,2,3])   # 集合",
      commonMistakes: [
        "任意検索 (email など) で find を使うと例外で止まる。find_by を使って nil 判定する。",
        "ID 検索で find_by を使うと 404 自動処理が効かず、自前で nil チェックが必要になる。",
      ],
      references: [
        {
          label: "Rails Guides: Active Record Query Interface (公式)",
          url: "https://guides.rubyonrails.org/active_record_querying.html",
        },
      ],
    },
  },
  {
    id: "ar-003",
    categoryId: "active-record",
    difficulty: "beginner",
    type: "choice",
    question:
      "次のうち、User テーブルの全件取得後にメモリ上で繰り返す危険なコードは？",
    choices: [
      "User.all.each",
      "User.find_each",
      "User.order(:id).limit(10).each",
      "User.in_batches",
    ],
    answerIndex: 0,
    choiceExplanations: [
      "正解。`User.all.each` は SELECT * FROM users で全件メモリにロードする。100 万件あれば数 GB のメモリを使い OOM になり得る。",
      "`find_each` は内部でデフォルト 1000 件ずつのバッチ処理を行うのでメモリ効率が良い。安全な書き方。",
      "`limit(10)` で取得件数を制限しているので、最悪でも 10 件しかメモリに載らない。安全。",
      "`in_batches` はバッチ単位で処理する API。`update_all` などで効率的に一括更新できる。安全。",
    ],
    hints: [
      "`User.all` は全件メモリにロード。",
      "大量データだとメモリ不足。",
      "バッチ処理用のメソッド (find_each, in_batches) や limit を付けた取得は安全で、それらに当てはまらない 1 つだけが危険な選択肢です。",
    ],
    explanation: {
      summary:
        "`User.all.each` は全件 SELECT してメモリに載せる。大量データで OOM の原因。",
      reason:
        "`find_each` は 1000 件 (デフォルト) ずつ取得しメモリ効率良い。`in_batches` はバッチ自体を渡してくれるのでさらに柔軟。本番でログ集計などするなら必須。",
      beginnerExplanation:
        "**ActiveRecord の大量データ処理** で必ず知るべきパターンです。\n\n**危険**: `User.all.each`\n```ruby\nUser.all.each { |u| u.send_email }\n# SELECT * FROM users;  ← 全件メモリにロード!\n```\n開発環境では 100 件しかなくて気付かなくても、本番に 100 万ユーザーいたら数 GB のメモリを消費して **OOM (メモリ不足) でサーバーがクラッシュ** します。\n\n**安全 1**: `User.find_each`\n```ruby\nUser.find_each(batch_size: 1000) { |u| u.send_email }\n# SELECT * FROM users WHERE id > ? ORDER BY id LIMIT 1000;\n# (内部で繰り返し、1000 件ずつ処理)\n```\nデフォルトで 1000 件ずつバッチ処理してくれる。メモリは常に 1000 件分しか使わない。\n\n**安全 2**: `User.in_batches`\n```ruby\nUser.in_batches(of: 1000) do |batch|\n  batch.update_all(active: true)  # バッチ単位で UPDATE\nend\n```\nバッチ自体 (Relation) が渡されるので、一括 UPDATE / DELETE が可能。`update_all` は callback / validation をスキップするので超高速。\n\n**安全 3**: `limit` で件数制限\n```ruby\nUser.order(:created_at).limit(10).each { ... }\n```\n最初の N 件だけ処理する場面で使う。\n\n**実務原則**:\n- 大量データを `.each` で回す → 必ず `find_each` か `in_batches`\n- 一括更新 → `update_all` を活用\n- 開発時に件数が少なくてもクセを付ける\n- 本番監視で『メモリ急増』アラートが出たら大抵 `.all.each` パターンを疑う",
      modelSelfExplanation: {
        conclusion:
          "危険なのは `User.all.each`。`User.all` が全件 SELECT してメモリにロードするため、大量データではメモリ不足 (OOM) を引き起こす。find_each / in_batches / limit を使うのが安全。",
        reason:
          "ActiveRecord の `all` や `where` は遅延評価される Relation を返すが、`each` を呼ぶと SELECT が走り全レコードがメモリに展開される。データ件数が小規模なら気にならないが、本番運用で 10 万・100 万件規模になると数百 MB〜数 GB の RAM を一気に使い、Ruby プロセス自体が落ちる原因になる。find_each は内部で『主キーで ORDER + 範囲条件で LIMIT バッチ』を繰り返し、常に一定メモリで処理する設計。in_batches は『バッチ単位の Relation』を渡してくれるので update_all / delete_all のような一括操作と相性が良い。",
        example:
          "rake task で『全ユーザーに通知メールを送る』なら `User.find_each(batch_size: 500) { |u| NotifierMailer.notice(u).deliver_later }` が定番。バックグラウンドジョブで『非アクティブユーザー判定』なら `User.where('last_login_at < ?', 1.year.ago).in_batches.update_all(active: false)` で一括 UPDATE が高速。集計レポートで全件処理が必須なら find_each + メモリプロファイラで監視する。",
        pitfall:
          "find_each はデフォルトで主キー (id) で ORDER するため、ORDER 句を付けると上書きされて意図しない順序になる。さらに in_batches で update_all を使うと callback / validation がスキップされるため、updated_at の自動更新やイベント通知が走らない (必要なら手動で touch / 個別 save する)。limit を付けた find_each はバージョンによって挙動が違うので注意 (Rails 7+ で改善)。",
      },
      codeExample:
        "# 危険 (100万件あったらOOM)\nUser.all.each { |u| u.send_email }\n\n# 安全\nUser.find_each(batch_size: 500) { |u| u.send_email }\n\n# バッチ毎に処理\nUser.in_batches(of: 1000) do |batch|\n  batch.update_all(active: true)\nend",
      commonMistakes: [
        "find_each に ORDER 句を渡すと上書きされる (内部で id ORDER を使うため)。",
        "update_all は callback / validation をスキップする。updated_at 自動更新や通知が走らない。",
      ],
      references: [
        {
          label: "Rails Guides: Batch Querying (find_each / in_batches)",
          url: "https://guides.rubyonrails.org/active_record_querying.html#retrieving-multiple-objects-in-batches",
        },
      ],
    },
  },
  {
    id: "ar-004",
    categoryId: "active-record",
    difficulty: "intermediate",
    type: "choice",
    question:
      "N+1 問題を回避するためのメソッドは？",
    choices: ["preload", "includes", "eager_load", "上記すべて"],
    answerIndex: 3,
    choiceExplanations: [
      "正しいが不完全。preload は別クエリ (IN 句) で先読みする方法だが、他にも eager_load (JOIN) と includes (自動選択) がある。",
      "正しいが不完全。includes は内部で preload か eager_load を自動選択するが、明示的に使い分けたいときに preload / eager_load を直接呼ぶこともある。",
      "正しいが不完全。eager_load は LEFT JOIN で 1 クエリにまとめる方法。条件 (WHERE) で子テーブル参照したいときに使う。",
      "正解。preload (別クエリ) / eager_load (JOIN) / includes (自動選択) の 3 つすべてが N+1 対策のための関連プリロード手段。",
    ],
    hints: [
      "関連レコードを事前にロードします。",
      "それぞれ別クエリ / JOIN / 自動選択。",
      "preload・eager_load・includes は『別クエリで先読み』『JOIN で先読み』『自動選択』とアプローチは違いますが、目的は共通しています。",
    ],
    explanation: {
      summary:
        "preload (別クエリ)、eager_load (LEFT JOIN)、includes (自動選択) すべて N+1 対策。",
      reason:
        "preload は SELECT を 2 つに分ける (子テーブル条件 WHERE 不可)。eager_load は LEFT JOIN で 1 クエリ (条件 OK だが結果が膨らむ)。includes は条件無ければ preload、条件あれば eager_load を選ぶ。検出には bullet gem が便利。",
      beginnerExplanation:
        "**N+1 問題** は Rails で最もよく見るパフォーマンス問題です。\n\n**症状**:\n```ruby\nposts = Post.all       # SELECT * FROM posts;  (1 クエリ)\nposts.each do |p|\n  puts p.user.name     # SELECT * FROM users WHERE id = N;  (各回ごとに 1 クエリ)\nend\n```\n投稿が 100 件あれば **1 + 100 = 101 クエリ** が走り、DB が窒息します。これが N+1 (= 1 + N) 問題の語源。\n\n**3 つの対策メソッド**:\n\n**1. `preload`** — 別クエリで先読み (IN 句)\n```ruby\nPost.preload(:user).each { |p| puts p.user.name }\n# SELECT * FROM posts;\n# SELECT * FROM users WHERE id IN (1,2,3,...);\n# → 合計 2 クエリ\n```\n\n**2. `eager_load`** — LEFT JOIN で 1 クエリにまとめる\n```ruby\nPost.eager_load(:user).each { |p| puts p.user.name }\n# SELECT posts.*, users.* FROM posts LEFT JOIN users ON ...\n# → 1 クエリだが結果セットが大きくなる\n```\n\n**3. `includes`** — 自動で preload か eager_load を選択\n```ruby\nPost.includes(:user).each { ... }\n# 条件 (WHERE) なし → preload を選ぶ\nPost.includes(:user).where(users: { active: true })\n# 条件 (子テーブル参照) あり → eager_load を選ぶ\n```\n\n**使い分け**:\n- 子テーブルで絞り込みたい (`where(users: ...)`) → `eager_load` か `includes`\n- 関連を表示するだけ → `preload` (シンプル)\n- 迷ったら `includes` (自動選択)\n\n**検出ツール**: `bullet` gem を入れると N+1 が発生したときに開発環境で警告 / ログ出力してくれる。CI でも検出できるので必須レベルのツール。",
      modelSelfExplanation: {
        conclusion:
          "正解は『上記すべて』。preload / eager_load / includes の 3 つすべてが N+1 対策の関連プリロード手段で、それぞれ別クエリ / JOIN / 自動選択というアプローチの違いがある。",
        reason:
          "ActiveRecord の関連は遅延ロードがデフォルトのため、繰り返し処理で関連にアクセスすると個別 SELECT が走り N+1 問題になる。これを防ぐために『事前にまとめてロードする』API が 3 種類用意されている: preload は『IN 句で子テーブルを別クエリで取得』(子テーブルの WHERE 条件は使えない、シンプルで意図が読みやすい)、eager_load は『LEFT OUTER JOIN で 1 クエリ』(子テーブルの WHERE が使えるが結果が冗長になりがち)、includes は『WHERE 句の参照を見て自動で preload か eager_load を選ぶ』(便利だが意図がやや不透明)。状況によって最適解が変わるため、開発者が使い分ける。",
        example:
          "ブログ一覧で投稿者名を表示するなら `Post.preload(:author).each { |p| puts p.author.name }` で 2 クエリに。アクティブなユーザーの投稿だけ絞り込みたいなら `Post.eager_load(:user).where(users: { active: true })` で 1 クエリの JOIN。複雑な多段の関連 (post.comments.includes(:user)) では includes に任せると自動でいい感じに分かれる。bullet gem を仕込んでおけば N+1 漏れを CI / 開発時に検出できる。",
        pitfall:
          "eager_load は LEFT JOIN なので親テーブルの行数が膨らみ、ActiveRecord が distinct を内部で打つことがある。preload は子テーブルの WHERE 条件が使えず (使うと別の WHERE になってしまう)、ハマりやすい。includes は便利だが、where に子テーブル参照を入れているのに preload が選ばれてエラーになる、というケースもあり、明示的に preload / eager_load を使い分けるのが安全な現場もある。さらに ActiveRecord は 4 階層以上の深い preload で n+m+l 問題になることがあり、polymorphic 関連は preload が複雑化する。",
      },
      codeExample:
        "# N+1 (悪)\nPost.all.each { |p| puts p.user.name }\n# SELECT * FROM posts;\n# SELECT * FROM users WHERE id = 1;\n# SELECT * FROM users WHERE id = 2;  ← N+1\n\n# 対策\nPost.includes(:user).each { |p| puts p.user.name }\n# SELECT * FROM posts;\n# SELECT * FROM users WHERE id IN (1,2,...);\n\n# JOIN したい (条件付き)\nPost.eager_load(:user).where(users: { active: true })",
      commonMistakes: [
        "eager_load の LEFT JOIN で結果行が膨らみ、distinct で重複排除が必要になる。",
        "polymorphic 関連は preload / includes が複雑化する。明示的に :commentable_type ごとに分岐するパターンがある。",
        "bullet gem を入れずに本番リリース → ユーザー増加で N+1 が一斉に火を吹く。開発初期から入れる。",
      ],
      references: [
        {
          label: "Rails Guides: Eager Loading Associations (公式)",
          url: "https://guides.rubyonrails.org/active_record_querying.html#eager-loading-associations",
        },
        {
          label: "bullet gem (N+1 検出)",
          url: "https://github.com/flyerhzm/bullet",
        },
      ],
    },
  },
  {
    id: "ar-005",
    categoryId: "active-record",
    difficulty: "intermediate",
    type: "text",
    question:
      "users テーブルに `name` カラムを追加するマイグレーションを生成するコマンドは `rails generate migration ???`。??? に入る部分を答えてください (例: AddXxxToYyy 形式)。",
    answers: [
      "AddNameToUsers name:string",
      "AddNameToUsers",
      "add_name_to_users",
      "add_name_to_users name:string",
    ],
    hints: [
      "命名規則: `Add{カラム名}To{テーブル名}` (CamelCase)。",
      "生成時にカラム型も指定できます: `name:string`",
      "CamelCase の `Add{追加するカラム}To{対象テーブル}` 形式が定石。空白区切りでカラム名と型を続けるとマイグレーション本体も自動生成されます。",
    ],
    explanation: {
      summary:
        "`rails g migration AddNameToUsers name:string` でカラム追加マイグレが生成。",
      reason:
        "命名規則 `Add(Columns)To(Table)` / `Remove(Columns)From(Table)` を守ると、Rails が自動でマイグレーションの本体を書いてくれる (型を指定した場合のみ)。`rails db:migrate` で適用、`rails db:rollback` で 1 つ戻る。",
      beginnerExplanation:
        "Rails のマイグレーション生成は、**ファイル名の命名規則** を見て自動的に内容を推測してくれます。\n\n**カラム追加の定型**:\n```bash\nrails g migration AddNameToUsers name:string\n```\n生成されるファイル:\n```ruby\nclass AddNameToUsers < ActiveRecord::Migration[7.1]\n  def change\n    add_column :users, :name, :string\n  end\nend\n```\n\n**命名パターン**:\n| ファイル名 | 推測される動作 |\n|---|---|\n| `AddXxxToYyy` | `add_column :yyy, :xxx, ...` |\n| `RemoveXxxFromYyy` | `remove_column :yyy, :xxx, ...` |\n| `CreateYyy` | `create_table :yyy do |t| ... end` |\n| `RenameYyyXxxToZzz` | `rename_column :yyy, :xxx, :zzz` (手動編集要) |\n\n**カラム型** は `name:string` のように `:` 区切りで指定:\n- `string` (短い文字列、デフォルト 255 文字)\n- `text` (長い文字列、ブログ本文など)\n- `integer`, `bigint`, `decimal`\n- `boolean`, `date`, `datetime`, `time`\n- `references` (外部キー、`user:references` → `user_id` + 外部キー制約)\n\n**コマンド一覧**:\n```bash\nrails g migration AddNameToUsers name:string   # 生成\nrails db:migrate                                # 適用\nrails db:rollback                               # 1 つ戻る\nrails db:migrate:status                         # 状況確認\nrails db:migrate VERSION=20240101000000         # 特定バージョンまで\n```\n\n**規約から外れた処理** (rename, データ移行など) は手動でマイグレーションを書きます。`change` メソッドが reverse 不能な操作 (raw SQL など) を含む場合は `up` / `down` を分けて書く必要があります。",
      modelSelfExplanation: {
        conclusion:
          "正解は `AddNameToUsers name:string`。Rails の generator はファイル名 (`Add(Column)To(Table)`) からマイグレーション本体を推測し、`name:string` の型指定でカラム追加コードまで自動生成する。",
        reason:
          "Rails のマイグレーション generator は『命名規則 + 引数で型指定』というシンプルな DSL を持ち、命名パターン (`AddXxxToYyy`, `RemoveXxxFromYyy`, `CreateYyy`) を見て対応する Schema 変更コードを生成する。これにより開発者は SQL の DDL を直接書かずに、Ruby DSL で DB 変更を表現でき、git の差分管理・ロールバックも統一的に扱える。型指定 (`name:string`, `user:references`) は ActiveRecord の Column 型システムと対応し、PostgreSQL / MySQL などの差異を吸収する。",
        example:
          "実務では『新機能で users に biography カラム追加』なら `rails g migration AddBiographyToUsers biography:text`、『投稿に画像URL追加』なら `rails g migration AddImageUrlToPosts image_url:string`、『リレーション追加』なら `rails g migration AddAuthorRefToPosts author:references` (内部で `add_reference :posts, :author, foreign_key: true` を生成) のように使う。レビュー時には生成ファイルの中身を必ず確認してから db:migrate する。",
        pitfall:
          "本番運用中の DB に対するマイグレーションは『無停止 (zero downtime) で実行可能か』を要検討。例えば NOT NULL 制約付きカラムを既存テーブルに追加すると、既存行で NULL になり違反する。対策: ①まず default 値付きで追加 → ②既存データ更新 → ③NOT NULL に変更、と 3 段階に分ける。さらに大規模テーブルの ALTER は数十分〜数時間ロックすることがあるため、強制改名や型変更は時間外実施 + バックアップが基本。",
      },
      codeExample:
        "# 生成\nrails g migration AddNameToUsers name:string\n\n# 中身 (自動生成される)\nclass AddNameToUsers < ActiveRecord::Migration[7.1]\n  def change\n    add_column :users, :name, :string\n  end\nend\n\n# 関連の追加\nrails g migration AddUserRefToPosts user:references\n# → add_reference :posts, :user, null: false, foreign_key: true\n\nrails db:migrate\nrails db:rollback",
      commonMistakes: [
        "本番テーブルに NOT NULL カラムを即追加 → 既存行で違反。default 値経由 / バックフィル経由で段階的に。",
        "大規模テーブルの ALTER でロックが長時間続く。バックアップと時間外実施で。",
      ],
      references: [
        {
          label: "Rails Guides: Active Record Migrations (公式)",
          url: "https://guides.rubyonrails.org/active_record_migrations.html",
        },
      ],
    },
  },
  {
    id: "ar-006",
    categoryId: "active-record",
    difficulty: "intermediate",
    type: "choice",
    question:
      "次のうち、ActiveRecord の validation の正しい書き方は？",
    code: "class User < ApplicationRecord\n  ???\nend",
    choices: [
      "validate :name, presence: true",
      "validates :name, presence: true",
      "validation :name, required: true",
      "ensure :name, present: true",
    ],
    answerIndex: 1,
    choiceExplanations: [
      "`validate` (単数) はカスタムバリデーションメソッド名を渡すための DSL。標準ルール (presence など) は使えない。`validates` (複数) と混同しやすい罠。",
      "正解。`validates :属性, ルール: 値` が標準のバリデーション宣言形式。複数形であることに注意。",
      "`validation` というメソッドは存在しない。さらにオプション名も `presence` であって `required` ではない。",
      "`ensure` は例外処理 (begin/rescue/ensure) のキーワードで、ActiveRecord と無関係。",
    ],
    hints: [
      "`validate` (単数) と `validates` (複数) は別物。",
      "標準のバリデーションは `validates` (複数形)。",
      "メソッド名は複数形の `validates`、必須チェックのオプション名は `presence`。両方が正しく揃っている選択肢を選んでください。",
    ],
    explanation: {
      summary:
        "標準バリデーションは `validates :属性, ルール: 値`。`validate`(単数) はカスタムメソッド用。",
      reason:
        "Rails は `validates` (複数) を提供。`validate` (単数) はカスタムメソッド名を渡すのに使う。間違うと意外と気付かれずに『バリデーションが動かない』状態になる。",
      beginnerExplanation:
        "ActiveRecord のバリデーション宣言には **2 つの似たメソッド** があり、初学者が必ずハマるポイントです。\n\n**`validates` (複数形)** — 標準バリデーション用\n```ruby\nvalidates :name,  presence: true, length: { maximum: 50 }\nvalidates :email, presence: true, uniqueness: true,\n                  format: { with: URI::MailTo::EMAIL_REGEXP }\nvalidates :age,   numericality: { greater_than_or_equal_to: 0 }\n```\n\n**`validate` (単数形)** — カスタムバリデーションメソッド用\n```ruby\nvalidate :name_must_not_contain_admin\n\nprivate\n\ndef name_must_not_contain_admin\n  errors.add(:name, \"can't include 'admin'\") if name&.include?('admin')\nend\n```\n\n**標準ルール (validates で使える)**:\n- `presence: true` — 必須\n- `uniqueness: true` — DB 内でユニーク\n- `length: { minimum: 6, maximum: 100 }` — 文字数\n- `format: { with: /\\A.+@.+\\z/ }` — 正規表現\n- `numericality: { greater_than: 0 }` — 数値の範囲\n- `inclusion: { in: %w[draft published] }` — 列挙値\n- `confirmation: true` — `password_confirmation` 一致\n\n**間違うと**: `validate :name, presence: true` のように単数 `validate` で書くと、Ruby としてはエラーにならず **黙ってバリデーションが動かない** 状態になります (`:name` がメソッド名と解釈され、`presence: true` がオプションとして無視される)。本番でデータ汚染が起きるまで気付かない、というのが典型的なバグです。\n\n**実行タイミング**: `save` / `update` / `valid?` 時に走り、失敗時は `errors` に詳細が積まれ、`save` が false を返す (`save!` は例外)。",
      modelSelfExplanation: {
        conclusion:
          "正解は `validates :name, presence: true`。複数形の `validates` が標準バリデーション用のクラスマクロで、属性名 + 検証ルールのハッシュを渡す。単数の `validate` はカスタムバリデーションメソッド名を登録するための別物。",
        reason:
          "Rails は宣言的なバリデーション DSL を提供しており、`validates` 1 つの呼び出しで複数のルール (presence / length / format / uniqueness など) を組み合わせられる。これは ActiveModel::Validations の仕組みに基づき、内部的には各ルールを Validator クラスとして登録 → save 時に順に評価する。`validate` (単数) はカスタムロジックを書きたいときの『メソッド名を登録する』用途で、似ているが役割が異なる。命名が紛らわしいのは Rails の歴史的経緯による既知の落とし穴。",
        example:
          "ユーザモデルで `validates :email, presence: true, uniqueness: { case_sensitive: false }, format: { with: URI::MailTo::EMAIL_REGEXP }` のように 1 行で 3 ルール。複雑な業務ルール (例: 営業時間内のみ予約可) はカスタム validate メソッドに切り出し、`validate :within_business_hours` で登録。コントローラ側では `if @user.save; redirect_to user_path; else; render :new, status: :unprocessable_entity; end` の形でエラー画面に分岐。",
        pitfall:
          "`validate :name, presence: true` のように単数 `validate` を間違って使うと、Ruby としてはエラーにならず黙ってバリデーションが効かない『静かなバグ』になる。テストで明示的に `expect(User.new.tap(&:valid?).errors[:name]).to include(\"can't be blank\")` のようなチェックを書くか、rubocop-rails の検出に頼る。さらに DB 制約と validation の二重化を忘れない: validation は『アプリ内の安全網』、DB 制約 (NOT NULL, UNIQUE) は『最後の砦』として両方掛けるのが原則。",
      },
      codeExample:
        "class User < ApplicationRecord\n  validates :name,  presence: true, length: { maximum: 50 }\n  validates :email, presence: true, uniqueness: true,\n                    format: { with: URI::MailTo::EMAIL_REGEXP }\n  validates :age,   numericality: { greater_than_or_equal_to: 0 }\n\n  validate :name_must_not_contain_admin  # カスタム\n\n  private\n\n  def name_must_not_contain_admin\n    errors.add(:name, \"can't include 'admin'\") if name&.include?(\"admin\")\n  end\nend",
      commonMistakes: [
        "`validate` (単数) と `validates` (複数) を取り違える。前者はカスタム用、後者は標準ルール用。",
        "uniqueness バリデーションだけでは並行 INSERT の競合を防げない。DB に UNIQUE インデックスも必須。",
      ],
      references: [
        {
          label: "Rails Guides: Active Record Validations (公式)",
          url: "https://guides.rubyonrails.org/active_record_validations.html",
        },
      ],
    },
  },
  {
    id: "ar-007",
    categoryId: "active-record",
    difficulty: "intermediate",
    type: "choice",
    question:
      "`Post.where(published: true).order(:created_at)` のような共通クエリを再利用可能にする ActiveRecord の機能は？",
    choices: ["scope", "where_chain", "filter", "queryable"],
    answerIndex: 0,
    choiceExplanations: [
      "正解。`scope :name, -> { ... }` でクエリに名前を付け、`Post.published.recent` のようにチェーンできる ActiveRecord の標準機能。",
      "ActiveRecord には `where_chain` というクラスマクロは存在しない。WhereChain は内部のクラスで、`where.not(...)` のような書き方の裏で使われる。",
      "Rails には `filter` というクエリ DSL はない。Enumerable#filter とは別物。",
      "`queryable` という ActiveRecord メソッドは存在しない。意味的には scope が担当。",
    ],
    hints: [
      "Model 内に名前を付けてクエリを保存する仕組み。",
      "`scope :name, -> { ... }` と書きます。",
      "「クエリの適用範囲 (=有効範囲)」を意味する 5 文字の英単語そのままで、ActiveRecord にはこの名前のクラスマクロがあります。",
    ],
    explanation: {
      summary:
        "scope はクエリの再利用ブロック。チェーン可能で読みやすい。",
      reason:
        "scope は ActiveRecord::Relation を返すラムダ。チェーンしても 1 つのクエリにまとまる。クラスメソッドでも同じことができるが、引数なしの単純なものは scope の方が宣言的。",
      beginnerExplanation:
        "**scope** は ActiveRecord の **『よく使うクエリに名前を付けて再利用する』** 仕組みです。\n\n**従来 (重複)**:\n```ruby\nPost.where(published: true).order(created_at: :desc)\nPost.where(published: true).where(featured: true)\nPost.where(published: true).where('created_at > ?', 1.week.ago)\n```\n同じ `where(published: true)` を何度も書いて DRY 違反。\n\n**scope で集約**:\n```ruby\nclass Post < ApplicationRecord\n  scope :published, -> { where(published: true) }\n  scope :recent,    -> { order(created_at: :desc) }\n  scope :featured,  -> { where(featured: true) }\n  scope :by_year,   ->(year) { where(year: year) }   # 引数付き\nend\n\nPost.published.recent\nPost.published.featured.by_year(2024)\n```\nクエリが **英文のように読める** ようになり、変更も 1 箇所で済みます。\n\n**特徴**:\n- ラムダで包む (`-> { ... }`) ことで遅延評価される (毎回最新の値を使う、例えば `Time.current`)\n- 必ず Relation を返す (= チェーン可能)\n- nil を返したい場合は `none` を使う (`scope :recent, -> { where(...) || none }`)\n\n**scope vs クラスメソッド**: 単純なものは scope、複雑なロジック (引数チェック、分岐) はクラスメソッドの方が読みやすい:\n```ruby\nscope :recent, -> { where('created_at > ?', 1.week.ago) }       # シンプル\n\ndef self.search(query)\n  return all if query.blank?\n  where('title LIKE ?', \"%#{sanitize_sql_like(query)}%\")\nend                                                              # 複雑\n```\n\n**注意**: scope のブロック内で `nil` を返すと意図せず `Post.all` のように振る舞ってしまう (Rails 4 から `none` を返すのが推奨)。",
      modelSelfExplanation: {
        conclusion:
          "正解は `scope`。ActiveRecord のクラスマクロで、よく使う `where` / `order` / `joins` などの組み合わせに名前を付けて再利用可能にし、チェーン可能なクエリ DSL を提供する。",
        reason:
          "scope は内部的に『ラムダを受け取り、それを返すクラスメソッドを定義する』だけのシンプルな仕組みで、戻り値は ActiveRecord::Relation。Relation 同士は `.merge` でつなげられるので、`Post.published.recent.where(user_id: 1)` のように DSL 的にチェーンできる。クエリのドメイン用語化 (例: `published`, `featured`, `recent`) によりコードが業務概念で読めるようになり、変更の影響範囲も Model 内に閉じる。",
        example:
          "Rails アプリで頻出: `User.active.admin.recent_login` のように複数 scope のチェーンで複雑な条件を表現、`Order.between(today.beginning_of_month, today.end_of_month).completed.sum(:total)` で月次売上集計、`Post.published.includes(:author).recent.limit(10)` でトップページ用記事取得。Controller や View で生の where を書く代わりに scope を使うことで、ビジネスルールがモデルに集約される。",
        pitfall:
          "scope の中で `nil` や false を返すと『条件無し』として扱われ意図しないクエリになる。Rails 4 からは `none` (空 Relation) を返すのが推奨。さらに scope を多用すると Model が肥大化しやすいので、複雑な検索条件は Query Object パターン (`PostSearchQuery.new(scope, params).call`) に切り出すと管理しやすい。引数付き scope は遅延評価を活用できるが、引数が多くなるとクラスメソッドの方が引数バリデーションを書きやすい。",
      },
      codeExample:
        "class Post < ApplicationRecord\n  scope :published, -> { where(published: true) }\n  scope :recent,    -> { order(created_at: :desc) }\n  scope :by_year,   ->(year) { where(year: year) }\nend\n\nPost.published.recent.by_year(2024)\n# SELECT * FROM posts WHERE published=true AND year=2024\n# ORDER BY created_at DESC\n\n# クラスメソッドでも同等\ndef self.published\n  where(published: true)\nend",
      commonMistakes: [
        "scope のブロックで条件によって nil を返してしまう → 意図せず全件取得になる。`none` を返す。",
        "scope が多すぎて Model が肥大化したら Query Object に分離する。",
      ],
      references: [
        {
          label: "Rails Guides: Active Record Query — Scopes (公式)",
          url: "https://guides.rubyonrails.org/active_record_querying.html#scopes",
        },
      ],
    },
  },
  {
    id: "ar-008",
    categoryId: "active-record",
    difficulty: "intermediate",
    type: "choice",
    question:
      "`User#save` が失敗する原因として最も典型的なのは？",
    choices: [
      "DB に接続できない時のみ",
      "validation に失敗した時",
      "クラスにメソッドが無い時",
      "Ruby のバージョンが古い時",
    ],
    answerIndex: 1,
    choiceExplanations: [
      "DB 接続不可は例外 (ActiveRecord::ConnectionNotEstablished) で、false ではなく即落ちる。save が false を返す通常の理由ではない。",
      "正解。`save` は内部で validation を実行し、失敗すると false を返す (例外は投げない)。これが最も典型的な失敗パターン。",
      "メソッド不在は NoMethodError 例外で即時クラッシュ。save が false を返すこととは別物。",
      "Ruby バージョンの問題はそもそもアプリが起動しないので、save 単体の挙動には関係ない。",
    ],
    hints: [
      "`save` はバリデーションを実行します。",
      "バリデーション失敗時は false を返す (例外を投げない)。",
      "`save!` は失敗時に例外を投げる版。",
    ],
    explanation: {
      summary:
        "save はバリデーション失敗で false を返す。save! は例外。",
      reason:
        "`save` / `update` は失敗時 false を返すので、`if @user.save` で分岐するのが定石。例外で確実に検知したいなら `save!` / `update!` / `create!`。トランザクション内では例外でないとロールバックされない点に注意。",
      beginnerExplanation:
        "ActiveRecord の `save` メソッドの **挙動** を正しく理解するのは重要です。\n\n**`save` の流れ**:\n1. バリデーション (`validates` で宣言したルール) を実行\n2. 失敗があれば `errors` に詳細を積み、**false を返して終了** (例外は投げない)\n3. 成功すれば DB に INSERT/UPDATE して **true を返す**\n\n**典型的な分岐パターン**:\n```ruby\nif @user.save\n  redirect_to @user, notice: '保存しました'\nelse\n  render :new, status: :unprocessable_entity\n  # @user.errors を View で表示\nend\n```\n\n**`!` 付きメソッド**: `save!` / `update!` / `create!` は失敗時に **例外** (`ActiveRecord::RecordInvalid`) を投げます。\n\n**使い分け**:\n- ユーザー入力 → `save` (失敗は想定内、エラーを画面に表示)\n- システム内部の保存で『失敗するはずがない』 → `save!` (失敗したら即座に例外で気付く)\n- **トランザクション内では必ず `!` 系**: トランザクションは例外でしかロールバックされないため:\n\n```ruby\nActiveRecord::Base.transaction do\n  user.save!     # 失敗すれば例外\n  account.save!  # 例外で両方ロールバック\nend\n\n# ❌ NG: save (例外なし) だと部分保存になる\nActiveRecord::Base.transaction do\n  user.save     # false でも継続\n  account.save  # user が壊れた状態で account も保存\nend\n```\n\n**`update_columns` / `update_all` の罠**: これらは **validation も callback もスキップ** する。データ汚染を起こしやすいので、業務ロジックでは原則使わない (rake task で慎重に使うレベル)。",
      modelSelfExplanation: {
        conclusion:
          "`save` が失敗する最も典型的な原因は **バリデーション失敗**。`save` は内部で validation を実行し、失敗すると false を返して `errors` に詳細を積む。例外は投げないので呼び出し側で if 分岐するのが定石。",
        reason:
          "ActiveRecord の `save` はトランザクション → validation → callback → SQL 発行 → callback の流れで動き、validation 段階で違反があれば false を返して安全に止まる設計。これは『入力エラーは想定内なので例外より戻り値で扱う方が呼び出し側のコードがきれい』という思想による。一方で『絶対に失敗してはいけない』場面 (内部処理やトランザクションの途中) では `save!` を使い、失敗時に即座に例外で気付かせる。トランザクションは例外でないとロールバックされないため、複数モデル更新では必ず ! 系を使う。",
        example:
          "コントローラの create アクションで `if @user.save; redirect_to @user; else; render :new; end` のように分岐し、失敗時は View で `@user.errors.full_messages` を表示。決済処理のように複数モデルを更新する Service では `ActiveRecord::Base.transaction do; payment.save!; order.update!(status: :paid); end` で原子性を保証。バックグラウンドジョブのリトライ判定でも、save! → RecordInvalid を rescue して特定のエラーだけ再スケジュールする、というパターンが多い。",
        pitfall:
          "トランザクション内で `save` (! なし) を使うと、validation 失敗時に false が返るだけでトランザクションはロールバックされず、半端な状態が DB に残る。必ず `save!` を使う。さらに `update_columns` / `update_all` は validation も callback も丸ごとスキップするため、業務コードで使うとデータ不整合の温床。`touch` (updated_at だけ更新) も意外と気付きにくい副作用 (関連 cache のパージなど) があるので注意。",
      },
      codeExample:
        "u = User.new                           # 必須項目空\nu.save                                #=> false\nu.errors.full_messages                #=> [\"Name can't be blank\"]\nu.save!                               # ActiveRecord::RecordInvalid\n\n# トランザクション内では ! 系を使う\nActiveRecord::Base.transaction do\n  user.save!\n  account.save!                       # 失敗すれば両方ロールバック\nend",
      commonMistakes: [
        "トランザクション内で save (! なし) を使い、validation 失敗時にロールバックされない。",
        "update_columns / update_all は validation・callback をスキップするので、データ整合性が必要な場面では使わない。",
      ],
      references: [
        {
          label: "Rails Guides: Active Record Validations — How to Trigger",
          url: "https://guides.rubyonrails.org/active_record_validations.html#when-does-validation-happen",
        },
      ],
    },
  },
  {
    id: "ar-009",
    categoryId: "active-record",
    difficulty: "intermediate",
    type: "choice",
    question: "次のコードの SQL イメージは？",
    code: "Post.where(user_id: [1, 2, 3]).where('created_at > ?', 1.week.ago)",
    choices: [
      "WHERE user_id IN (1,2,3) AND created_at > '...'",
      "WHERE user_id = 1 OR 2 OR 3",
      "WHERE user_id BETWEEN 1 AND 3",
      "WHERE user_id IS NULL",
    ],
    answerIndex: 0,
    choiceExplanations: [
      "正解。ActiveRecord は『配列 → IN 句』『where のチェーン → AND』に変換。プレースホルダ `?` で安全にバインドされる。",
      "ActiveRecord は OR 条件を自動展開せず、`.or(...)` メソッドを使う必要がある。配列はあくまで IN 句。",
      "BETWEEN になるのは Range (`1..3`) を渡した場合。配列 `[1, 2, 3]` は IN になる。",
      "IS NULL は値として nil を渡した場合 (`where(user_id: nil)`)。配列の場合は IN。",
    ],
    hints: [
      "配列を渡すと `IN` 句になります。",
      "where のチェーンは AND で連結。",
      "プレースホルダ `?` は SQL injection 対策。",
    ],
    explanation: {
      summary:
        "where に配列 → IN、文字列 + プレースホルダ → 安全なバインド。",
      reason:
        "ActiveRecord は条件式を SQL に変換: 配列 → IN、Range → BETWEEN、nil → IS NULL。文字列条件はプレースホルダ (`?` または `:name`) で SQL injection を防ぐ。直接文字列補間は危険。",
      beginnerExplanation:
        "ActiveRecord の `where` メソッドは、**Ruby の値の型を見て自動的に SQL に変換** してくれる賢い API です。\n\n**値の型と SQL 変換**:\n```ruby\nPost.where(user_id: 1)         # WHERE user_id = 1\nPost.where(user_id: [1,2,3])   # WHERE user_id IN (1,2,3)\nPost.where(user_id: 1..10)     # WHERE user_id BETWEEN 1 AND 10\nPost.where(user_id: nil)       # WHERE user_id IS NULL\nPost.where(created_at: ...3.days.ago)  # WHERE created_at < ...\n```\n\n**where のチェーン** は **AND** で連結:\n```ruby\nPost.where(user_id: 1).where('created_at > ?', 1.week.ago)\n# WHERE user_id = 1 AND created_at > '...'\n```\n\n**OR にしたい** ときは `.or` を使う (`||` ではない):\n```ruby\nPost.where(user_id: 1).or(Post.where(user_id: 2))\n# WHERE user_id = 1 OR user_id = 2\n```\n\n**🚨 SQL Injection 対策**: 文字列条件は **必ずプレースホルダ** を使う:\n```ruby\n# ✅ 安全\nPost.where('title LIKE ?', \"%#{q}%\")\nPost.where('title LIKE :q', q: \"%#{q}%\")\n\n# ❌ 危険 (ユーザー入力をそのまま埋め込み)\nPost.where(\"title = '#{user_input}'\")\n# user_input が \"'; DROP TABLE posts; --\" だったら全消し!\n```\n\nハッシュ構文 (`where(name: q)`) は内部で自動的にプレースホルダ化されるので、可能ならハッシュ構文を優先。\n\n**LIKE のワイルドカード**: ユーザー入力に含まれる `%` `_` も特別な意味を持つので `ActiveRecord::Base.sanitize_sql_like(input)` でエスケープ:\n```ruby\nq = sanitize_sql_like(params[:q])\nPost.where('title LIKE ?', \"%#{q}%\")\n```",
      modelSelfExplanation: {
        conclusion:
          "結果は `WHERE user_id IN (1,2,3) AND created_at > '...'`。ActiveRecord は『配列 → IN 句』『where のチェーン → AND』『プレースホルダ ? → 安全なバインド変数』に自動変換する。",
        reason:
          "ActiveRecord の where は Arel と呼ばれる内部 SQL ビルダを使い、Ruby の値の型 (Integer / Array / Range / nil) を見て対応する SQL 構文に変換する。これにより開発者は SQL の構文を意識せず Ruby のデータ構造で条件を書けるが、同時に文字列直接埋め込み (`\"title = '#{q}'\"`) は SQL Injection の温床になるため、プレースホルダ (`?` 位置パラメータか `:name` 名前付き) でバインド変数化する責務がある。複雑な OR / 副問合せは ActiveRecord の `.or` / `.merge` / Arel API で書ける。",
        example:
          "実務では『特定ユーザの最近の投稿』を `Post.where(user_id: user_ids).where('created_at > ?', 1.week.ago)` で取得、『削除されていない投稿』を `Post.where(deleted_at: nil)`、『先月の注文』を `Order.where(created_at: previous_month_range)` のように Ruby のデータ構造で表現する。ユーザー入力の検索は必ずプレースホルダ経由で。",
        pitfall:
          "**SQL Injection の温床は文字列補間**: `where(\"name = '#{q}'\")` のように書くと脆弱。必ず `where('name = ?', q)` や `where(name: q)` を使う。さらに LIKE 検索では `%` `_` を `sanitize_sql_like` でエスケープしないとユーザー入力でフルスキャンを誘発できる。ActiveRecord はハッシュ構文だと自動的に安全化されるが、生 SQL を混ぜると油断しやすい。Brakeman などの静的解析ツールを CI に入れて検出するのが現実的。",
      },
      codeExample:
        "# IN\nPost.where(user_id: [1,2,3])\n\n# BETWEEN\nPost.where(created_at: 1.week.ago..)\n\n# IS NULL\nPost.where(deleted_at: nil)\n\n# プレースホルダ\nPost.where('title LIKE ?', \"%#{q}%\")\nPost.where('title LIKE :q', q: \"%#{q}%\")\n\n# ❌ 危険 (SQL injection)\n# Post.where(\"title = '#{user_input}'\")\n\n# OR\nPost.where(user_id: 1).or(Post.where(user_id: 2))",
      commonMistakes: [
        "文字列補間で SQL Injection を作る。必ずプレースホルダか hash 構文。",
        "LIKE 検索で `%` `_` をエスケープし忘れる。`sanitize_sql_like` を通す。",
        "OR を `||` で繋ごうとする。ActiveRecord は `.or(...)` メソッドを使う。",
      ],
      references: [
        {
          label: "Rails Guides: Active Record Query — Conditions (公式)",
          url: "https://guides.rubyonrails.org/active_record_querying.html#conditions",
        },
        {
          label: "OWASP: SQL Injection Prevention Cheat Sheet",
          url: "https://cheatsheetseries.owasp.org/cheatsheets/SQL_Injection_Prevention_Cheat_Sheet.html",
        },
      ],
    },
  },
  {
    id: "ar-010",
    categoryId: "active-record",
    difficulty: "intermediate",
    type: "text",
    question:
      "ActiveRecord でレコード保存前に自動実行されるコールバックの名称は？(英語、1単語+前置詞、例: before_xxx)",
    answers: ["before_save", "before_create", "before_validation"],
    hints: [
      "`before_*` の系統。",
      "代表的なものは before_validation, before_save, before_create, before_update。",
      "「保存前」を表す英語 prefix と、save / create / validation などのライフサイクル名を `_` でつなげた形式が正解。",
    ],
    explanation: {
      summary:
        "before_validation / before_save / before_create / before_update などのコールバックがある。",
      reason:
        "ライフサイクルフックで前処理 (default 値設定、slug 生成など) を行う。複雑になりすぎたら Service Object に分離。before_destroy で関連削除制御も可。",
      beginnerExplanation:
        "ActiveRecord は **レコードのライフサイクル** (生成・保存・削除など) の **前後にフック** を仕込めます。これを **コールバック (callback)** と呼びます。\n\n**よく使うコールバック**:\n- `before_validation` — バリデーション直前。default 値設定、データ正規化\n- `before_save` — 保存 (INSERT/UPDATE) 直前\n- `before_create` — INSERT 直前 (新規作成時のみ)\n- `before_update` — UPDATE 直前 (更新時のみ)\n- `after_save` — 保存後 (副作用に注意)\n- `after_create` — INSERT 後 (通知メール送信など)\n- `before_destroy` — 削除直前 (削除可否の判定)\n- `after_destroy` — 削除後\n\n**典型例**:\n```ruby\nclass Post < ApplicationRecord\n  before_validation :set_slug\n  before_save       :strip_whitespace\n  after_create      :send_notification\n  before_destroy    :prevent_if_published\n\n  private\n\n  def set_slug\n    self.slug ||= title.parameterize\n  end\n\n  def strip_whitespace\n    self.title = title&.strip\n  end\n\n  def send_notification\n    NotifyJob.perform_later(self)\n  end\n\n  def prevent_if_published\n    throw :abort if published?   # 削除を中止\n  end\nend\n```\n\n**注意点 (アンチパターン)**:\n1. **コールバック地獄**: 1 つのモデルに 10 個も callback を積むと、保存時の挙動が予測不能になり、テストも困難。**Service Object** に切り出すのが現代的。\n2. **外部 API 呼び出し**: callback 内で外部 API を呼ぶと、トランザクションが長期化したり、API 失敗で保存が止まったりする。**`after_commit`** で非同期ジョブにするのが安全。\n3. **副作用の連鎖**: callback がさらに別モデルを保存し、それが callback を起動し、と連鎖するとデバッグ困難。`autosave: false` で防御。\n\n**現代的なアプローチ**: 単純なデータ正規化 (slug 生成、空白除去) は callback で OK。複雑な業務ロジックは Service Object に切り出す。Form Object (`reform` gem 等) で永続化と分離するパターンも流派の 1 つ。",
      modelSelfExplanation: {
        conclusion:
          "保存前に自動実行されるコールバックは `before_save` (より厳密には `before_validation` / `before_create` / `before_update` も含む `before_*` 系)。`before_save` は INSERT / UPDATE 共通で保存直前に呼ばれる。",
        reason:
          "ActiveRecord は『保存・更新・削除』の各ライフサイクルに対し前後 (before/after/around) のフックを用意し、データ正規化や副作用処理を宣言的に書ける。before_validation は validation 直前、before_save は INSERT/UPDATE 直前 (validation 後、SQL 発行前)、before_create / before_update はそれぞれ新規 / 更新時のみ、と粒度が分かれており、適切なタイミングを選ぶことで責務を分離できる。これは Observer パターンの実装で、Active Record パターンの中核機能。",
        example:
          "ブログ記事で `before_validation :set_slug` で title から URL スラグ生成、`before_save :strip_whitespace` で前後空白除去、`after_create_commit :notify_followers` でフォロワーに非同期通知、`before_destroy :prevent_if_featured` で注目記事は削除禁止、というように使う。Devise gem は内部で `before_save` を多用してパスワードハッシュ化を行っている。",
        pitfall:
          "コールバックを multi-step で連鎖させると挙動が追えなくなる『コールバック地獄』のアンチパターンに陥りやすい。複雑な業務ロジックは Service Object に切り出すのが現代的。さらに `after_save` で外部 API を呼ぶとトランザクションが長期化したり、API 失敗で保存自体が rollback されたりするため、外部副作用は `after_commit` で非同期ジョブ (`*_later`) にするのが安全。テスト時にも `Post.skip_callback(:save, :before, :strip_whitespace)` のように一時オフできることを覚えておくとデバッグが楽。",
      },
      codeExample:
        'class Post < ApplicationRecord\n  before_validation :set_slug\n  before_save       :strip_whitespace\n  after_create      :send_notification\n  before_destroy    :prevent_if_published\n\n  private\n\n  def set_slug\n    self.slug ||= title.parameterize\n  end\n\n  def strip_whitespace\n    self.title = title&.strip\n  end\n\n  def send_notification\n    NotifyJob.perform_later(self)\n  end\n\n  def prevent_if_published\n    throw :abort if published?\n  end\nend',
      commonMistakes: [
        "コールバックの乱用はテストしにくくなる。複雑な処理は Service Object などに切り出すのが現代的。",
        "callback 内で外部 API を同期呼び出し → トランザクション長期化 / API 失敗で保存中止。after_commit + 非同期ジョブが安全。",
      ],
      references: [
        {
          label: "Rails Guides: Active Record Callbacks (公式)",
          url: "https://guides.rubyonrails.org/active_record_callbacks.html",
        },
      ],
    },
  },
  {
    id: "ar-011",
    categoryId: "active-record",
    difficulty: "intermediate",
    type: "choice",
    question:
      "`User.create(name: 'A')` と `User.create!(name: 'A')` の違いは？",
    choices: [
      "create は同期、create! は非同期",
      "create は失敗時 nil ライクな未保存オブジェクトを返す、create! は失敗時 例外",
      "create は配列、create! は単体",
      "両方完全に同じ",
    ],
    answerIndex: 1,
    choiceExplanations: [
      "両方とも同期実行。Rails で非同期にしたいなら ActiveJob (`SaveJob.perform_later`) など別の仕組みを使う。",
      "正解。`!` 無しは失敗時にも未保存のオブジェクト (errors 付き) を返す。`!` 付きは ActiveRecord::RecordInvalid 例外を投げる。",
      "両方とも単一レコード生成。複数生成は `create([{...}, {...}])` のように配列を渡す別パターン。",
      "戻り値と例外の挙動が違うので完全に同じではない。",
    ],
    hints: [
      "`!` 系は失敗で例外を投げます。",
      "create は失敗しても未保存のオブジェクトを返します (errors を持つ)。",
      "API では create!、UI 画面では create + if 文の使い分けが多い。",
    ],
    explanation: {
      summary:
        "`!` 付きは失敗で RecordInvalid 例外、! なしは失敗時 errors を持つオブジェクトを返す。",
      reason:
        "コントローラの create アクションでは `@user = User.create(params)` → `if @user.persisted?` で分岐するが、トランザクションや Job 内では `User.create!` で例外を投げてもらわないとロールバックされない・失敗が検知されない。",
      beginnerExplanation:
        "`create` 系メソッドにも `!` 有無の違いがあります。**save と同じ思想** ですが、こちらは `new + save` を 1 行にまとめた『新規作成 + 即保存』の便利メソッドです。\n\n**`User.create(name: 'A')`** — 失敗しても例外を投げない\n- バリデーション失敗時、保存されない (= `persisted?` が false)\n- 戻り値は **未保存の User オブジェクト** (errors 付き)\n- 呼び出し側で `if @user.persisted?` か `@user.valid?` で分岐\n\n**`User.create!(name: 'A')`** — 失敗時に例外\n- バリデーション失敗時、`ActiveRecord::RecordInvalid` 例外\n- 成功時は保存済みの User オブジェクトを返す\n\n**使い分け**:\n```ruby\n# UI フォーム (失敗は想定内、エラー画面に戻す)\ndef create\n  @user = User.create(user_params)\n  if @user.persisted?\n    redirect_to @user\n  else\n    render :new, status: :unprocessable_entity\n  end\nend\n\n# Job / トランザクション (失敗は想定外、即例外で気付かせる)\nActiveRecord::Base.transaction do\n  user    = User.create!(name: 'A')\n  account = Account.create!(user: user)\nend  # 失敗すれば自動 ROLLBACK\n\n# seed データ / 一括投入 (失敗は致命的)\n100.times { |i| User.create!(name: \"u#{i}\") }\n```\n\n**注意**: `create` を Job やトランザクション内で使うと、失敗が静かに無視されてバグの温床になります。**システム内部の保存は必ず `!` 系** を使うのが原則です。",
      modelSelfExplanation: {
        conclusion:
          "`create` はバリデーション失敗時に未保存のオブジェクト (errors 付き) を返す。`create!` は失敗時に ActiveRecord::RecordInvalid 例外を投げる。",
        reason:
          "ActiveRecord は『失敗は戻り値で扱う』(create / save / update) と『失敗は例外で扱う』(create! / save! / update!) を両方提供することで、ユースケースに応じた使い分けを可能にしている。UI フォームのように『失敗は想定内 (= 画面に戻す)』なら戻り値で分岐、Job やトランザクションのように『失敗は想定外 (= ロールバック)』なら例外で気付かせる。これにより呼び出し側の意図がコードから読み取れる。",
        example:
          "コントローラの create アクションでは `@user = User.create(user_params); if @user.persisted?; redirect_to @user; else; render :new; end` の定型。一方バックグラウンドジョブ内では `Notification.create!(user: u, body: msg)` を使い、失敗時は ActiveJob の retry 機構に乗せる。seed データやテストデータ生成では `User.create!` 一択 (失敗が静かに無視されるとデバッグ困難)。",
        pitfall:
          "トランザクションやバックグラウンドジョブ内で `create` (! なし) を使うと、validation 失敗が静かに無視されて『何も保存されていない』状態になり、ロールバックも発火しない。本番でデータ欠損が起きてから気付くケースが多発する。原則『システム内部の保存は ! 系』を徹底し、`create` (戻り値分岐) は『ユーザー入力を受け取るコントローラ』限定にする。",
      },
      codeExample:
        "# UI フォーム\ndef create\n  @user = User.create(user_params)\n  if @user.persisted?\n    redirect_to @user\n  else\n    render :new, status: :unprocessable_entity\n  end\nend\n\n# Job / トランザクション内\nActiveRecord::Base.transaction do\n  user    = User.create!(name: 'A')\n  account = Account.create!(user: user)\nend  # 失敗すれば自動 ROLLBACK",
      commonMistakes: [
        "Job やトランザクション内で create (! なし) を使い、失敗が静かに無視される。",
        "create の戻り値を保存成功と勘違いして次の処理に進む。`persisted?` か `valid?` で分岐する。",
      ],
      references: [
        {
          label: "Rails API: ActiveRecord::Persistence#save vs save!",
          url: "https://api.rubyonrails.org/classes/ActiveRecord/Persistence.html",
        },
      ],
    },
  },
  {
    id: "ar-012",
    categoryId: "active-record",
    difficulty: "advanced",
    type: "choice",
    question:
      "`User.update_all(active: true)` の挙動として正しいものは？",
    choices: [
      "コールバック・バリデーションをスキップして直接 UPDATE",
      "全レコードに対して save を呼び出す (バリデーション通る)",
      "メモリ上のオブジェクトだけ更新 (DB は変わらない)",
      "User.all の Array を返す",
    ],
    answerIndex: 0,
    choiceExplanations: [
      "正解。`update_all` は 1 つの SQL UPDATE 文を実行し、validation / callback / タイムスタンプ自動更新もすべてスキップする高速メソッド。",
      "save を呼ぶのは `each(&:save)` のように 1 件ずつ処理するパターン。update_all は SQL を直接打つので save は呼ばれない。",
      "DB は変わる。むしろ DB を直接変更してアプリ側のキャッシュは古いまま、というのが落とし穴の 1 つ。",
      "戻り値は『更新された行数 (Integer)』。配列ではない。",
    ],
    hints: [
      "`_all` 系は『直接 SQL 実行』。",
      "コールバック・バリデーションが動きません。",
      "高速ですが、整合性を保つには注意が必要。",
    ],
    explanation: {
      summary:
        "`update_all` / `delete_all` はコールバック・バリデーション・タイムスタンプを飛ばして直接 SQL。",
      reason:
        "高速バッチ処理用。`updated_at` 自動更新も走らないので、必要なら `updated_at: Time.current` を含める。`destroy_all` / `update_each` ならコールバックは走る。",
      beginnerExplanation:
        "**`update_all` / `delete_all`** は **ActiveRecord の通常フローを全部スキップ** して直接 SQL を発行する高速メソッドです。\n\n**スキップされるもの**:\n- ✗ バリデーション (`validates`)\n- ✗ コールバック (`before_save`, `after_update` 等)\n- ✗ `updated_at` の自動更新\n- ✗ optimistic locking (`lock_version`)\n- ✗ ActiveRecord のインスタンスメソッド\n\n**スキップされないもの**:\n- ✓ DB の制約 (NOT NULL, UNIQUE, 外部キー)\n- ✓ DB トリガー\n\n**使い分け**:\n```ruby\n# 高速 (1 クエリで終わる、コールバック飛ばす)\nUser.where(active: false).update_all(active: true, updated_at: Time.current)\n# UPDATE users SET active = true, updated_at = '...' WHERE active = false;\n\n# 1 件ずつ (N クエリ + コールバック)\nUser.where(active: false).each { |u| u.update(active: true) }\n```\n\n**いつ使う?**:\n- 大量データの一括フラグ更新 (例: 1 年以上ログインなしのユーザーを非アクティブ化)\n- マイグレーションでのデータ移行\n- パフォーマンス critical な処理\n\n**いつ使わない?**:\n- 業務ロジックを含む保存 (callback で通知メール送信などしたい場面)\n- 監査ログを残す必要がある場面 (PaperTrail などの gem は callback ベース)\n- updated_at が必要な場面 (明示的に `updated_at: Time.current` を渡せば回避可)\n\n**罠**: `update_all` 後に DB を読み返さないと、アプリのメモリ上のオブジェクトは古いまま。`@user.reload` で再読込が必要。",
      modelSelfExplanation: {
        conclusion:
          "`update_all` は SQL UPDATE を直接 1 発で実行し、ActiveRecord のバリデーション・コールバック・updated_at の自動更新・optimistic locking など、通常の save 経路にあるあらゆるフックをすべてスキップする。",
        reason:
          "ActiveRecord の `save` 系メソッドは 1 件ずつ Ruby 側で validation → callback → SQL → callback の流れを通すため、何万件ものデータ更新では膨大なオーバーヘッドが発生する。`update_all` / `delete_all` はこの Ruby 経路を完全にバイパスして単一 SQL を発行することで、桁違いの高速化を実現する。代わりに『updated_at が更新されない』『業務ロジックが走らない』『キャッシュが古くなる』など複数の副作用があるため、用途を限定して使う必要がある。",
        example:
          "rake task で『1 年以上ログインなしのユーザーを非アクティブ化』なら `User.where('last_login_at < ?', 1.year.ago).update_all(active: false, updated_at: Time.current)` で 1 クエリで完了。マイグレーションで『新しく追加した published カラムを既存記事に true で埋める』なら `Post.where(published_at: ...).update_all(published: true)`。逆に『新規ユーザー登録時の welcome メール送信』など callback で副作用が必要な場面では決して update_all を使わない。",
        pitfall:
          "`updated_at` が自動更新されないため、UI 側のキャッシュ無効化や ETag が正しく動かなくなる。必要なら `update_all(active: true, updated_at: Time.current)` のように明示的に渡す。さらにアプリのメモリ上のオブジェクトは古いままなので、後続処理で `@user.reload` を入れないと意図しない挙動になる。validation スキップでデータ不整合 (例: NOT NULL 制約違反、NULL になり得る値) を作ってしまうケースも頻出。",
      },
      codeExample:
        "# 高速 (コールバック飛ばす)\nUser.where(active: false).update_all(active: true, updated_at: Time.current)\nPost.where(spam: true).delete_all\n\n# 1件ずつ呼ぶ (コールバックあり)\nUser.where(active: false).each(&:destroy)\nUser.where(active: false).destroy_all\n\n# パフォーマンス比較\n# update_all:  1 クエリ\n# update each: N クエリ + コールバック",
      commonMistakes: [
        "update_all は updated_at を自動更新しない。必要なら明示的に渡す。",
        "update_all 後にメモリ上のオブジェクトは古いまま。`@user.reload` で再読込する。",
        "validation スキップで NULL 違反などのデータ不整合を作る。事前にデータの正当性を保証する。",
      ],
      references: [
        {
          label: "Rails API: ActiveRecord::Relation#update_all",
          url: "https://api.rubyonrails.org/classes/ActiveRecord/Relation.html#method-i-update_all",
        },
      ],
    },
  },
  {
    id: "ar-013",
    categoryId: "active-record",
    difficulty: "advanced",
    type: "choice",
    question:
      "多対多関係を表現する2つの主要な書き方は？",
    choices: [
      "has_many :through と has_and_belongs_to_many",
      "has_many :belongs と has_many :many",
      "belongs_to :many と has_one :many",
      "join と include",
    ],
    answerIndex: 0,
    choiceExplanations: [
      "正解。`has_many :through` は中間モデル (Ruby クラス) ありの書き方、`has_and_belongs_to_many` (HABTM) は中間テーブルだけで Model 不要の書き方。",
      "`has_many :belongs` も `has_many :many` も実在しない構文。Rails の関連 DSL ではない。",
      "`belongs_to :many` は存在しない (belongs_to は単数形のみ)。多対多の表現ではない。",
      "`joins` / `includes` はクエリ実行時の機能で、関連定義 DSL ではない。",
    ],
    hints: [
      "中間テーブルを使う書き方が 2 種類。",
      "`has_many :through` は中間モデルを明示。",
      "中間モデル (Ruby クラス) を作るか、中間テーブル (DB のみ) で済ませるかの 2 派閥があり、選択肢にはその両方が並んでいます。",
    ],
    explanation: {
      summary:
        "多対多は has_many :through (中間モデルあり) と has_and_belongs_to_many (HABTM) の 2 通り。基本は :through 推奨。",
      reason:
        "HABTM は中間テーブルのみで Model 不要なので軽量だが、中間に属性 (created_at など) を持てない。実務では拡張性のため `has_many :through` (中間 Model あり) が推奨される。",
      beginnerExplanation:
        "**多対多関係** (例: User と Group の関係 — 1 人のユーザーが複数のグループに所属、1 つのグループに複数のユーザーが所属) を Rails で表現する書き方は 2 つあります。\n\n**1. `has_many :through` (推奨)**\n中間モデル (Ruby クラス) を明示する書き方。\n```ruby\nclass User < ApplicationRecord\n  has_many :memberships\n  has_many :groups, through: :memberships\nend\n\nclass Membership < ApplicationRecord\n  belongs_to :user\n  belongs_to :group\n  # role や joined_at など追加カラムを持てる\nend\n\nclass Group < ApplicationRecord\n  has_many :memberships\n  has_many :users, through: :memberships\nend\n```\nテーブル: `users`, `groups`, `memberships (user_id, group_id, role, joined_at, ...)`\n\n**メリット**: 中間モデルに **追加情報** を持てる (例: メンバーシップごとの role, 加入日時)。**Membership** クラスで callback や validation も書ける。\n\n**2. `has_and_belongs_to_many` (HABTM)**\n中間テーブルだけで Model を作らない簡易書き方。\n```ruby\nclass User < ApplicationRecord\n  has_and_belongs_to_many :groups\nend\n\nclass Group < ApplicationRecord\n  has_and_belongs_to_many :users\nend\n```\nテーブル: `users`, `groups`, `groups_users (user_id, group_id)` (テーブル名は両モデル名のアルファベット順 + 複数形)\n\n**メリット**: コードが少なくて済む (中間モデル不要)。**デメリット**: 中間に属性を持てない、callback も使えない。\n\n**現代の慣習**: **常に `has_many :through` を使う** のが Rails コミュニティの共通理解。最初は追加属性が不要でも、後で必要になる確率が高いから。HABTM は legacy code でのみ見かけます。",
      modelSelfExplanation: {
        conclusion:
          "多対多関係を表現する 2 つの主要な書き方は `has_many :through` (中間モデル明示) と `has_and_belongs_to_many` (HABTM、中間モデル不要)。実務では拡張性のため `has_many :through` が推奨される。",
        reason:
          "RDB の多対多は『中間テーブル (junction table)』で表現するのが定番だが、Rails の DSL では『中間に Ruby のモデルクラスを作るか作らないか』で 2 つの書き方が用意されている。`has_many :through` は中間モデル (例: Membership) を作るため、関連自体に属性 (role, joined_at) や validation・callback を持たせられる。`HABTM` は中間テーブルだけで Model を作らないため記述量が少ないが、関連自体には何も乗せられない。設計上、要件が変化したときに HABTM から through への移行は手間が大きいため、初手から through を採用するのが定石。",
        example:
          "ユーザがグループに属する SNS なら User has_many :memberships / Membership belongs_to :user, :group / Group has_many :memberships で、Membership に role (admin / member / viewer) や joined_at を持たせる。記事にタグ付けする CMS なら Post has_many :taggings / Tagging belongs_to :post, :tag / Tag has_many :taggings の構造。many-to-many は through を覚えれば 90% カバーできる。",
        pitfall:
          "HABTM で始めて後から中間属性が必要になると『HABTM → has_many :through への移行マイグレーション』が必要になり、データ移行と DSL 書き換えで工数がかかる。新規開発なら最初から through を選ぶ。さらに through 関連は include / preload の階層が深くなりがちなので N+1 に注意 (`Post.includes(:tags)` ではなく `Post.includes(:taggings, :tags)` のように明示が必要なケースあり)。",
      },
      codeExample:
        "# has_many :through (推奨)\nclass User < ApplicationRecord\n  has_many :memberships\n  has_many :groups, through: :memberships\nend\n\nclass Membership < ApplicationRecord\n  belongs_to :user\n  belongs_to :group\n  # role などの追加カラムが持てる\nend\n\nclass Group < ApplicationRecord\n  has_many :memberships\n  has_many :users, through: :memberships\nend\n\n# HABTM (シンプル、属性不要)\nclass User < ApplicationRecord\n  has_and_belongs_to_many :groups\nend\n# groups_users テーブル (user_id, group_id) が必要",
      commonMistakes: [
        "HABTM で始めて後から拡張するのは手間。最初から `has_many :through` で。",
        "中間テーブルに UNIQUE インデックス (user_id + group_id) を貼り忘れて重複登録される。",
      ],
      references: [
        {
          label: "Rails Guides: Many-to-Many Associations (公式)",
          url: "https://guides.rubyonrails.org/association_basics.html#the-has-many-through-association",
        },
      ],
    },
  },
  {
    id: "ar-014",
    categoryId: "active-record",
    difficulty: "advanced",
    type: "choice",
    question:
      "`User.count` と `users.size` (関連の size) の挙動として正しいのは？",
    choices: [
      "count は常に SQL COUNT、size はロード済みなら配列の length、未ロードなら COUNT",
      "両者は完全に同じ",
      "size は SQL COUNT、count はメモリ上",
      "size はロード必須",
    ],
    answerIndex: 0,
    choiceExplanations: [
      "正解。`count` は問答無用で `SELECT COUNT(*)` を発行、`size` はロード状況を判断して『ロード済みなら配列の length、未ロードなら COUNT』と賢く動く。",
      "完全に同じではない。ロード後の挙動が異なり、size の方がパフォーマンスに優しい。",
      "逆。`count` が常に COUNT クエリ、`size` がロード済みならメモリ上の length。",
      "size はロード必須ではない。未ロード時は COUNT クエリで件数だけ取得する。",
    ],
    hints: [
      "`count` は問答無用で COUNT クエリ。",
      "`size` はキャッシュを賢く使う。",
      "`length` は配列を強制ロード。",
    ],
    explanation: {
      summary:
        "count: 常に SQL COUNT。size: 関連がロード済みなら配列 length、未ロードなら COUNT。length: 強制ロード後 length。",
      reason:
        "パフォーマンス上の使い分けが重要。既にロード済みのコレクションに `count` するとまた COUNT クエリが飛んで無駄。逆に未ロードに `length` すると全件ロードしてしまう。`size` が一番安全。",
      beginnerExplanation:
        "ActiveRecord で **件数を取る 3 つの方法** は微妙に挙動が違い、パフォーマンスに直結します。\n\n**`count`** — 常に SQL COUNT クエリを発行\n```ruby\nuser.posts.count   # SELECT COUNT(*) FROM posts WHERE user_id = 1;\n```\nどんな状態でも問答無用で COUNT。**ロード済みでも再度クエリ** が走るので無駄になることがある。\n\n**`size`** — 賢く判断\n- ロード済み → 配列の `length` (メモリ上で完結)\n- 未ロード → COUNT クエリ\n```ruby\nuser.posts.size    # 未ロードなら COUNT、ロード済みなら length\n```\n\n**`length`** — 強制的に配列をロードしてから length\n```ruby\nuser.posts.length  # SELECT * FROM posts → 全件メモリに → length\n```\n大量データだと OOM の原因。\n\n**実演**:\n```ruby\nuser = User.find(1)\nuser.posts                # まだロードしない (Relation)\nuser.posts.count          # SELECT COUNT(*) FROM posts (1 クエリ)\nuser.posts.size           # SELECT COUNT(*) FROM posts (同じ)\nuser.posts.length         # SELECT * FROM posts → length (全件ロード)\n\nuser.posts.to_a           # ロード完了\nuser.posts.count          # また SELECT COUNT(*) (無駄!)\nuser.posts.size           # ロード済み配列の length (賢い)\nuser.posts.length         # 配列の length\n```\n\n**使い分けルール**:\n- View で `<%= user.posts.size %>` と表示するだけ → **`size` (最も安全)**\n- 後で `user.posts.each` で表示も予定 → **`length`** (どうせ全件ロードする)\n- 大量データで件数だけ知りたい → **`count`** (COUNT クエリ強制)\n\n**`counter_cache`** を使うと、has_many 側に件数カラムを持って `count` を超高速化できます (例: `belongs_to :user, counter_cache: true` で users.posts_count カラムが自動更新)。",
      modelSelfExplanation: {
        conclusion:
          "`count` は常に SQL COUNT を発行、`size` はロード状況を判断して『ロード済みなら配列 length、未ロードなら COUNT』、`length` は配列を強制ロードしてから length。size が最も賢いデフォルト。",
        reason:
          "ActiveRecord は『すでにロードされているコレクション』『まだ DB に問い合わせていない Relation』の 2 状態を持つため、件数取得にもいくつかの最適化された手段がある。count はクエリ最適化や HAVING / GROUP BY で COUNT 結果が変わる場面で確実に SQL を打ちたいときに使う。length は『どうせ全件メモリに載せる』場面で他の操作と組み合わせて使う。size は両者の中間で、状況に応じて賢く挙動を変えるのでデフォルトとして推奨される。",
        example:
          "ブログ記事一覧で `<%= @posts.size %> 件` のように View で表示するなら size 一択 (Controller で `@posts = Post.includes(:author).limit(20)` していたら .to_a でロードされた後の length になる)。逆に大規模テーブルで『今何件あるか』だけ知りたい監視スクリプトでは `Post.count` で確実に COUNT 句を発行する。投稿数が頻繁に参照される場面では counter_cache で users.posts_count カラムを持たせ、`user.posts.count` を `user.posts_count` (DB の 1 カラム読み出し) に置き換える定番最適化がある。",
        pitfall:
          "ロード済みの関連に対して count を呼ぶと、せっかくロード済みなのに再度 COUNT クエリが走って無駄。view で `@posts.each do; end` の後に `@posts.count` を書くと N+1 ならぬ『無駄な COUNT』。逆に未ロードの relation に length を呼ぶと全件メモリにロードしてしまい OOM の温床になる。基本は size、明示的に COUNT を飛ばしたいときだけ count を使う、と覚える。",
      },
      codeExample:
        "# 関連で実演\nuser = User.find(1)\nuser.posts                # まだロードしない\nuser.posts.count          # SELECT COUNT(*) FROM posts\nuser.posts.size           # SELECT COUNT(*) FROM posts (同じ)\nuser.posts.length         # SELECT * FROM posts → length\n\nuser.posts.to_a           # ロード完了\nuser.posts.count          # また COUNT クエリ (無駄)\nuser.posts.size           # ロード済み配列の length (賢い)\nuser.posts.length         # 配列の length",
      commonMistakes: [
        "ロード済みのコレクションに count を呼んで無駄な COUNT クエリを発行する。",
        "未ロードの relation に length を呼んで全件ロードで OOM になる。",
      ],
      references: [
        {
          label: "Rails API: ActiveRecord::Relation#count vs size vs length",
          url: "https://api.rubyonrails.org/classes/ActiveRecord/Relation.html#method-i-count",
        },
      ],
    },
  },
  {
    id: "ar-015",
    categoryId: "active-record",
    difficulty: "advanced",
    type: "text",
    question:
      "ActiveRecord で楽観的ロック (Optimistic Locking) を有効にするには、テーブルに何という名前のカラムを追加する？(snake_case)",
    answers: ["lock_version"],
    hints: [
      "Rails 規約の特別なカラム名。",
      "整数型でデフォルト 0。",
      "「ロック (排他制御) 用の version 番号」を意味する 2 単語の snake_case で、Rails が自動的にインクリメントしてくれる規約名です。",
    ],
    explanation: {
      summary:
        "`lock_version` カラム (integer, default 0) を追加すると楽観的ロックが有効に。",
      reason:
        "並行更新で『古いバージョン』を上書きしようとすると `ActiveRecord::StaleObjectError` を投げる仕組み。update 時に `WHERE id = ? AND lock_version = ?` を付けてくれて、ヒットしなければ例外。",
      beginnerExplanation:
        "**楽観的ロック (Optimistic Locking)** は『**衝突は滅多に起きないはず** と楽観して、起きたときだけ検出する』排他制御の方式です。\n\n**仕組み**:\n1. テーブルに `lock_version` (integer, default 0) カラムを追加\n2. 読み込み時に lock_version の値も取得\n3. UPDATE 時に `WHERE id = ? AND lock_version = ?` を付ける + `lock_version` を +1\n4. 別プロセスが先に更新していたら `lock_version` が変わっていて WHERE がヒットせず、`ActiveRecord::StaleObjectError` 例外\n\n```ruby\n# migration\nadd_column :users, :lock_version, :integer, default: 0, null: false\n\n# 使い方 (コードは普通)\nuser = User.find(1)        # name='Alice', lock_version=5\nuser.name = 'Bob'\nuser.save\n# 実際のSQL:\n# UPDATE users SET name='Bob', lock_version=6\n# WHERE id=1 AND lock_version=5;\n```\n\n**衝突したとき** (別プロセスが先に lock_version=6 に更新済みだった):\n```ruby\nbegin\n  user.save!\nrescue ActiveRecord::StaleObjectError\n  # 1. ユーザーに『他の人が編集しました』と通知\n  # 2. 再読込してリトライ\n  user.reload\n  user.name = 'Bob'\n  retry\nend\n```\n\n**用途**:\n- 同時編集が稀な業務 (ブログ記事の編集など)\n- ロック取得のオーバーヘッドを避けたい\n- ユーザーに『衝突しました』と画面で通知できる\n\n**悲観的ロック (`lock!` / `with_lock`)** との対比:\n- 楽観的: 衝突は稀という前提、ロックなし、UPDATE 時に検出\n- 悲観的: 必ず衝突するという前提、`SELECT ... FOR UPDATE` で行ロック取得\n\nクリティカルな金銭計算など『衝突したら困る』場面では悲観的ロック (`Account.lock.find(1)`) を使います。",
      modelSelfExplanation: {
        conclusion:
          "カラム名は `lock_version` (integer, default 0)。これを追加すると ActiveRecord が自動的に楽観的ロック (Optimistic Locking) を有効化し、UPDATE 時に WHERE 句で lock_version を比較・+1 する。",
        reason:
          "楽観的ロックは『同時更新は稀』という前提のもと、行ロックを取らずに『更新時に version が変わっていたら衝突と判定』する軽量な排他制御。`lock_version` という Rails 規約のカラム名を持つだけで、ActiveRecord が UPDATE 句に `WHERE ... AND lock_version = ?` と `SET lock_version = lock_version + 1` を自動で付加し、影響行数が 0 なら StaleObjectError を投げる。実装変更は不要 (Model も Controller も普通の save コードで OK)。",
        example:
          "ブログ記事の編集画面で『別のタブで先に保存されていたら、後の保存をブロックして警告』なら lock_version を入れるだけで実現できる。設定画面・プロフィール編集・在庫数の調整など『衝突は滅多に起きないが、起きたら通知したい』場面で使う。逆に決済処理や在庫減算のように『絶対衝突を避けたい』なら悲観的ロック (`Account.lock.find(1)` で `SELECT ... FOR UPDATE`) を使う。",
        pitfall:
          "楽観的ロックの再試行 (retry) を無限ループにすると、衝突が続く場合に CPU を食いつぶす。再試行回数の上限を設けるか、`StaleObjectError` をユーザーに画面で通知して手動で再操作させる。さらに lock_version カラムを忘れて手動で更新すると整合性が崩れる (lock_version 自体も WHERE 対象なので、update_all で別途インクリメントする時は明示的に渡す)。`belongs_to` の `touch: true` で関連レコードの updated_at を更新する場合も、lock_version の整合性に注意。",
      },
      codeExample:
        '# migration\nadd_column :users, :lock_version, :integer, default: 0, null: false\n\n# 使い方は普通\nuser = User.find(1)        # lock_version = 5\nuser.name = "Alice"\nuser.save                  # WHERE lock_version = 5\n# 別プロセスが先に更新していたら StaleObjectError\n\nbegin\n  user.save!\nrescue ActiveRecord::StaleObjectError\n  retry  # 再読込して再試行\nend',
      commonMistakes: [
        "StaleObjectError の retry を無限ループにする。再試行回数の上限を設ける。",
        "update_all で lock_version カラムを更新せず整合性が崩れる。",
      ],
      references: [
        {
          label: "Rails API: Optimistic Locking",
          url: "https://api.rubyonrails.org/classes/ActiveRecord/Locking/Optimistic.html",
        },
        {
          label: "Rails API: Pessimistic Locking",
          url: "https://api.rubyonrails.org/classes/ActiveRecord/Locking/Pessimistic.html",
        },
      ],
    },
  },
  {
    id: "ar-016",
    categoryId: "active-record",
    difficulty: "advanced",
    type: "choice",
    question:
      "`has_many :posts, dependent: :destroy` と `dependent: :delete_all` の違いは？",
    choices: [
      "両者は完全に同じ",
      ":destroy は各 Post のコールバックを呼ぶ、:delete_all は SQL で一括削除",
      ":delete_all は遅い",
      ":destroy は関連を残す",
    ],
    answerIndex: 1,
    choiceExplanations: [
      "両者の挙動は異なる。destroy は 1 件ずつ Post#destroy を呼ぶ (callback 起動)、delete_all は単一 DELETE 文。",
      "正解。:destroy は『Post の destroy callback (before_destroy 等) を 1 件ずつ起動』、:delete_all は『SQL の DELETE 文を 1 発で発行』(callback スキップ)。",
      "逆。:delete_all の方が高速 (callback なし、1 クエリ)。:destroy は安全だが遅い。",
      "destroy は関連を消す。残すのは :nullify (外部キーを NULL に)。",
    ],
    hints: [
      "`:destroy` は 1 件ずつ destroy (コールバック発火)。",
      "`:delete_all` は 1 つの DELETE SQL。",
      "コールバック呼ぶか呼ばないかで使い分け。",
    ],
    explanation: {
      summary:
        "`:destroy` はコールバック発火 (Post の destroy フック実行)、`:delete_all` は SQL 一括削除。",
      reason:
        "Post に `before_destroy` などのフックがある場合、`:delete_all` だとそれが実行されない。代わりに高速。`:nullify` は関連カラムを NULL に、`:restrict_with_error` は子があれば削除を拒否する。",
      beginnerExplanation:
        "親レコード削除時に **関連レコードをどうするか** を `dependent:` オプションで指定します。\n\n**主要なオプション**:\n\n| オプション | 挙動 | 速度 | callback |\n|---|---|---|---|\n| `:destroy` | 1 件ずつ Post#destroy を呼ぶ | 遅い | ✓ 起動 |\n| `:delete_all` | DELETE 文 1 発 | 高速 | ✗ スキップ |\n| `:nullify` | posts.user_id を NULL に | 高速 | ✗ |\n| `:restrict_with_error` | 子があれば削除を拒否 (errors に追加) | — | — |\n| `:restrict_with_exception` | 子があれば DeleteRestrictionError 例外 | — | — |\n| (なし) | 関連は無視 (孤児になる) | — | — |\n\n**使い分け**:\n```ruby\n# 子側でも処理を実行したい (例: Active Storage で添付ファイル削除、PaperTrail で履歴記録)\nhas_many :posts, dependent: :destroy\n\n# 単純削除で OK、callback 不要、件数多い\nhas_many :posts, dependent: :delete_all\n\n# 子は残す (例: 退会したユーザーの投稿は残しておきたい)\nhas_many :posts, dependent: :nullify\n\n# 子があったら親を消させない\nhas_many :posts, dependent: :restrict_with_error\n```\n\n**罠**: `:delete_all` は callback をスキップするので、`Active Storage` の添付ファイル削除や `paper_trail` の履歴記録などが実行されません。**それらを使うなら必ず `:destroy`** にする (gem 側のドキュメントに必ず書かれている)。\n\n**DB の外部キー制約 (`on_delete: :cascade` 等)** と組み合わせると、アプリ層と DB 層の両方で挙動を制御できます。たとえば dependent: :destroy + DB の cascade は二重保険になりますが、callback が冪等でない場合は注意。",
      modelSelfExplanation: {
        conclusion:
          "`dependent: :destroy` は子レコード 1 件ずつ Post#destroy を呼んで callback を起動する。`dependent: :delete_all` は SQL の DELETE 文 1 発で一括削除し、callback も validation も全部スキップする。",
        reason:
          "親レコード削除時の挙動は『子を消すかどうか』『callback を呼ぶかどうか』『どれくらい高速か』のトレードオフで決まる。:destroy は Ruby 経路を通るので Active Storage の添付削除や paper_trail の履歴記録など、callback に乗った副作用が必要な場面で必須。:delete_all は callback 不要な大量データの単純削除で使うと N クエリが 1 クエリに圧縮されて劇的に高速化する。:nullify や :restrict_* は『子は残す』『子があるときは親削除を禁止』など、用途ごとの選択肢。",
        example:
          "ユーザの記事に画像 (Active Storage) や履歴 (paper_trail) が付いている場合、`has_many :posts, dependent: :destroy` で 1 件ずつ削除して関連ファイルや履歴も整合性を保つ。退会ユーザの投稿は残したい SNS なら `:nullify` で user_id を NULL に、グループに最後の管理者がいるなら削除禁止したいときは `:restrict_with_error`、テストデータの大量削除では `:delete_all` で高速処理、というように使い分ける。",
        pitfall:
          ":delete_all は callback をスキップするので、Active Storage / paper_trail / cancan のような callback ベースの gem を使っている場合『関連ファイルだけが残る』などの整合性破壊が起きる。さらに :destroy は dependent な関連が多段に絡むと N 倍の N 倍のクエリで遅くなる (1 ユーザ → 100 投稿 → 各投稿に 10 コメント = 1001 クエリ)。大規模データでは事前に soft delete (deleted_at カラム) を検討する。",
      },
      codeExample:
        "has_many :posts, dependent: :destroy           # 1件ずつ destroy\nhas_many :posts, dependent: :delete_all        # 一括 DELETE\nhas_many :posts, dependent: :nullify           # posts.user_id = NULL\nhas_many :posts, dependent: :restrict_with_error\nhas_many :posts, dependent: :restrict_with_exception\n\n# Active Storage や paper_trail を使うなら :destroy 必須\n# (ファイル削除や履歴記録のため)",
      commonMistakes: [
        ":delete_all で Active Storage の添付ファイルだけが残る → :destroy にする。",
        "多段 dependent: :destroy で N+1 クエリで激遅 → soft delete を検討。",
      ],
      references: [
        {
          label: "Rails Guides: Association — dependent option (公式)",
          url: "https://guides.rubyonrails.org/association_basics.html#options-for-has-many-dependent",
        },
      ],
    },
  },
  {
    id: "ar-017",
    categoryId: "active-record",
    difficulty: "advanced",
    type: "choice",
    question:
      "Rails で複合 unique 制約 (例: user_id + post_id の組み合わせをユニーク) を設定する際、最も適切な方法は？",
    choices: [
      "validates :user_id, uniqueness: true のみ",
      "DB の UNIQUE INDEX 制約のみ",
      "model の uniqueness バリデーション + DB の UNIQUE INDEX 両方",
      "Ruby のコードで重複チェックする",
    ],
    answerIndex: 2,
    choiceExplanations: [
      "validation だけだと『validation チェック → INSERT』の間に別プロセスが INSERT すると重複が許される (race condition)。",
      "DB の UNIQUE 制約だけだと、保存時に RecordNotUnique 例外になり UX が悪い (フォームで親切に教えられない)。",
      "正解。validation で UX を守り、DB INDEX で並行 INSERT のすり抜けを完全に防ぐ二段構え。さらに `rescue ActiveRecord::RecordNotUnique` で最後の保険を掛ける。",
      "アプリ層の Ruby チェックも race を防げず、コードも分散して保守性が落ちる。Rails の DSL に任せる。",
    ],
    hints: [
      "validation だけだと並行リクエストですり抜けることがある。",
      "DB の制約だけだと UX エラーメッセージが出しにくい。",
      "片方だけでは『UX』『並行リクエストでのすり抜け』のどちらかが弱いままになるため、両方を重ねるのが Rails の定石。",
    ],
    explanation: {
      summary:
        "model の uniqueness バリデーション + DB の UNIQUE INDEX を両方設定するのが定石。",
      reason:
        "uniqueness バリデーションは race condition (同時挿入) で重複を許してしまう。DB INDEX があれば DB レベルで防げる。両方あればフォームでも親切なエラー、DB レベルでも確実。",
      beginnerExplanation:
        "Rails の **`uniqueness` バリデーション単体は実は race condition で抜ける** ことを知っているかが大事です。\n\n**問題**: uniqueness バリデーションの流れ\n1. SELECT で『同じ値が既に存在しないか』チェック\n2. 存在しなければ INSERT\n\nプロセス A と B が同時に同じ値を保存しようとすると、両方が Step 1 で『存在しない』と判定 → 両方が INSERT 成功 → **重複データが入る**。\n\n**解決**: **validation + DB UNIQUE INDEX の二段構え**\n```ruby\n# migration\nadd_index :likes, [:user_id, :post_id], unique: true\n\n# model\nclass Like < ApplicationRecord\n  belongs_to :user\n  belongs_to :post\n  validates :user_id, uniqueness: { scope: :post_id }\nend\n```\n\n**役割分担**:\n- **validation**: フォーム送信時に親切なエラーメッセージ (\"already taken\") を出す UX のため\n- **DB UNIQUE**: 並行リクエストでも絶対に重複させない真の防御\n\n**さらに保険**: コード側で `RecordNotUnique` を rescue\n```ruby\nbegin\n  Like.create!(user: u, post: p)\nrescue ActiveRecord::RecordNotUnique\n  # 別プロセスが先に作成済み → 既存を再利用するなど\n  Like.find_by(user: u, post: p)\nend\n```\n\n**実装パターン**:\n1. マイグレーションで `add_index ..., unique: true`\n2. モデルで `validates ..., uniqueness: { scope: :other_column }`\n3. 必要に応じて `find_or_create_by` + RecordNotUnique rescue\n\n**まとめ**: 『validation だけ』も『DB だけ』も不完全。**両方を使う** のが Rails の作法です。",
      modelSelfExplanation: {
        conclusion:
          "model の `uniqueness` バリデーション + DB の UNIQUE INDEX を両方設定するのが Rails の定石。validation は UX のため、DB INDEX は並行 INSERT の race condition を防ぐため。",
        reason:
          "ActiveRecord の uniqueness バリデーションは『SELECT で存在チェック → INSERT』という 2 段階で動くため、2 プロセスが同時に同じ値を保存しようとすると両方とも『存在しない』と判定して両方 INSERT 成功する race condition の脆弱性がある。DB の UNIQUE 制約は『INSERT 時に DB エンジンが原子的にチェック』するため race を防げるが、Ruby 側から見ると『save が例外で落ちる』だけでフォームに親切なメッセージを返せない。二段構えにすると『通常時は validation で UX、極めて稀な race 時は DB が砦』という役割分担で完璧な防御になる。",
        example:
          "SNS の『いいね』は 1 ユーザが 1 投稿に 1 回だけ → `likes` テーブルに `add_index :likes, [:user_id, :post_id], unique: true` + Model で `validates :user_id, uniqueness: { scope: :post_id }`。さらに `Like.create!` を `rescue ActiveRecord::RecordNotUnique` で囲み、競合時は既存レコードを返す。スタンプラリーの一意トークンや、メール認証コードも同じパターンで防御する。",
        pitfall:
          "validation だけでは race condition でデータ汚染が起きる。本番リリース後に重複データが見つかってバグレポートで初めて気付く、というのが典型。DB INDEX だけでは UX が悪い (一般ユーザーに 500 エラーが返るとサポート対応が増える)。さらに既存データに重複があると add_index :unique => true が失敗するので、事前に重複データのクリーンアップが必要。マイグレーション時に `disable_ddl_transaction!` + `add_index ... algorithm: :concurrently` で本番無停止 INDEX 追加するテクニックも頻出。",
      },
      codeExample:
        '# migration\nadd_index :likes, [:user_id, :post_id], unique: true\n\n# model\nclass Like < ApplicationRecord\n  belongs_to :user\n  belongs_to :post\n  validates :user_id, uniqueness: { scope: :post_id }\nend\n\n# それでも race で DB エラーが出ることはあるので rescue\nLike.create(user: u, post: p)\nrescue ActiveRecord::RecordNotUnique\n  # 既に存在\nend',
      commonMistakes: [
        "validation だけで防御したつもりが race で重複データができる。必ず DB UNIQUE も。",
        "既存データに重複があると add_index で失敗。先に DELETE / UPDATE でクリーンアップ。",
      ],
      references: [
        {
          label: "Rails Guides: Validations — uniqueness (公式)",
          url: "https://guides.rubyonrails.org/active_record_validations.html#uniqueness",
        },
      ],
    },
  },
  {
    id: "ar-018",
    categoryId: "active-record",
    difficulty: "advanced",
    type: "choice",
    question:
      "Rails のマイグレーション運用で、本番でやってはいけない/慎重にすべき操作はどれ？",
    choices: [
      "既存テーブルに add_column (default 値あり、大きなテーブル)",
      "既存テーブルから remove_column",
      "rename_column (本番で稼働中)",
      "上記すべて要注意",
    ],
    answerIndex: 3,
    choiceExplanations: [
      "正しいが不完全。default 値ありの add_column は PG 11+ でメタデータのみ更新 (高速) だが、それ以前は全行更新で長時間ロック。",
      "正しいが不完全。remove_column 後にアプリが旧カラム参照を続けると落ちる。デプロイ順序の調整が必要。",
      "正しいが不完全。rename_column は旧名と新名が両方読める時期が無いとデプロイ中にエラー。",
      "正解。すべての挙動を理解した上で慎重に実施する必要がある。strong_migrations gem で機械的に検出するのが安全。",
    ],
    hints: [
      "大きなテーブルへの ALTER は長時間ロックを引き起こすことがある。",
      "rename_column はデプロイ中に新旧コード両方が動く時間があり危険。",
      "ゼロダウンタイムを目指すなら多段階デプロイが定石。",
    ],
    explanation: {
      summary:
        "大規模テーブルの ALTER、rename、default 値付き add_column はゼロダウンタイム的に要注意。",
      reason:
        "PostgreSQL では default 値ありの add_column は 11+ でメタデータのみ更新 (高速) だが、それ以前は全行更新。rename_column は旧コードが落ちる前にカラムが消えるので、二段階デプロイ (両方読める時期を作る) が必要。本番運用では strong_migrations gem で危険な操作を検出すると良い。",
      beginnerExplanation:
        "本番運用中の DB に対するマイグレーションは **『無停止 (zero downtime) で実行できるか』** が最重要です。\n\n**よくある危険操作**:\n\n**1. 大規模テーブルへの ALTER (default 値あり add_column)**\n```ruby\nadd_column :users, :biography, :text, default: ''  # 1000万行で 30 分ロック...\n```\nPostgreSQL 11+ ではメタデータのみ更新で一瞬。それ以前 / MySQL ではテーブル書き換えで長時間ロック → サービス停止。\n\n**2. remove_column**\n```ruby\nremove_column :users, :legacy_field\n```\nデプロイ中に『旧コード (legacy_field を参照) + 新マイグレーション (カラム削除済み)』が同時に動く瞬間がある → NoMethodError 多発。\n\n**3. rename_column**\n```ruby\nrename_column :users, :email, :email_address\n```\nこれも同じく、デプロイのタイミングで一瞬コードと DB が不整合になる。\n\n**ゼロダウン運用の定石 (多段デプロイ)**:\n```ruby\n# Step 1: 新カラム追加 (旧も残す)\nadd_column :users, :email_address, :string\n# アプリ側: 書き込み時に両方更新する遷移期間\n\n# Step 2: バックフィル (バッチで既存データ移行)\nUser.in_batches { |b| b.update_all('email_address = email') }\n\n# Step 3: 全コード新カラム参照に切替 + デプロイ\n\n# Step 4: 旧カラム削除\nremove_column :users, :email\n```\n\n**機械的に検出**: **`strong_migrations` gem** を入れると、危険なマイグレーション (NOT NULL 追加、rename、危険な default など) を CI で自動検出してくれます:\n```ruby\n# Gemfile\ngem 'strong_migrations'\n\n# 危険なマイグレーションは即エラー\n# === Dangerous operation detected #strong_migrations ===\n# Adding a column with a default is dangerous in Rails < 5.2...\n```\n\n**運用 Tips**:\n- マイグレーションは **必ず staging で先に試す**\n- 大規模 ALTER は **メンテナンスウィンドウ** で実施\n- PostgreSQL 11+ への upgrade で多くの問題が緩和される\n- `disable_ddl_transaction!` + `algorithm: :concurrently` で並行 INDEX 作成 (PG)\n- `up` / `down` で reverse 可能性を担保",
      modelSelfExplanation: {
        conclusion:
          "本番運用中の DB に対するマイグレーションでは、大規模 ALTER (add_column with default)・remove_column・rename_column のすべてが要注意。長時間ロック・デプロイタイミングでの新旧コード不整合・rollback 困難など複数のリスクがある。",
        reason:
          "Rails のマイグレーションは DSL がシンプルなため気軽に書けるが、本番 DB では『テーブルロック中はアクセスが詰まる』『デプロイ中はコードと DB の整合が一瞬崩れる』『一度実行すると元に戻しにくい』などの本質的な難しさがある。特に長時間ロックは『気付かないうちにユーザーリクエストが詰まる → 5xx エラー連発』の典型シナリオ。多段デプロイ (新カラム追加 → バックフィル → コード切替 → 旧カラム削除) で『旧コードと新コードが共存できる時期』を作るのが ゼロダウンタイム運用の鉄則。strong_migrations gem は機械的にこれらの罠を検出する仕組みで、本番運用しているチームでは必須レベル。",
        example:
          "本番 1000 万ユーザーのテーブルに NOT NULL カラムを追加する場合: ①default 値で add_column (PG 11+ ならメタデータ更新で高速)、②バックグラウンドジョブで既存行に値をバックフィル、③NOT NULL 制約を別マイグレーションで追加、と 3 段階に分ける。rename_column は ①新カラム追加 ②両方に書く期間 ③バックフィル ④コード新カラム参照に ⑤旧カラム削除、と 5 段階。これらは GitHub やクックパッドなど大規模 Rails サービスでも実践されている王道パターン。",
        pitfall:
          "rake task と違って rails db:migrate は **コミット間で他のコネクションをブロックする** ことがある。MySQL では特に大規模テーブルの ALTER で長時間ロック → アプリ全体がレスポンス遅延。さらに rollback (db:rollback) が可能なマイグレーションを書く責任があり、`change` メソッドだけで自動 reverse できない場合は `up` / `down` を明示する。strong_migrations を入れずに本番運用すると、致命的なマイグレーションがデプロイされるまで気付けない。",
      },
      codeExample:
        '# 危険な例\nrename_column :users, :email, :email_address  # 旧コード壊れる\n\n# ゼロダウン的な対応\n# Step 1: 新カラム追加 + 同期\nadd_column :users, :email_address, :string\n# アプリ側で両方に書き込む期間\n\n# Step 2: バックフィル (バッチ)\nUser.in_batches { |b| b.update_all("email_address = email") }\n\n# Step 3: 旧カラム削除 (全コードが新カラム参照に)\nremove_column :users, :email\n\n# strong_migrations gem で警告\ngem "strong_migrations"',
      commonMistakes: [
        "default 値付き add_column を MySQL や PG 10 以下で実行 → 全行更新で長時間ロック。",
        "rename_column を 1 マイグレーションで実行 → デプロイ中に旧コードが落ちる。",
        "strong_migrations なしで運用 → 危険な操作が CI で検出できない。",
      ],
      references: [
        {
          label: "strong_migrations gem",
          url: "https://github.com/ankane/strong_migrations",
        },
        {
          label: "Rails Guides: Migrations — Cautions",
          url: "https://guides.rubyonrails.org/active_record_migrations.html",
        },
      ],
    },
  },

  // ===========================================================================
  // コードリーディング (12問)
  // ===========================================================================
  {
    id: "cr-001",
    categoryId: "code-reading",
    difficulty: "beginner",
    type: "choice",
    question: "次のコードを実行した時の出力は？",
    code: "arr = [1, 2, 3, 4, 5]\nresult = arr.each_with_object([]) do |n, acc|\n  acc << n * 2 if n.odd?\nend\np result",
    choices: ["[2, 6, 10]", "[1, 3, 5]", "[2, 4, 6, 8, 10]", "[]"],
    answerIndex: 0,
    hints: [
      "`each_with_object([])` は空配列を畳み込みの容器として渡します。",
      "`if n.odd?` で奇数だけが対象。",
      "奇数フィルタを通った要素だけを 2 倍して空配列に push していくので、結果の要素数は元配列の半分になります。",
    ],
    explanation: {
      summary:
        "奇数だけを 2 倍にして配列に積む処理。each_with_object は『畳み込み容器』を渡しながら累積する。",
      reason:
        "1,2,3,4,5 を順に処理。奇数 (1,3,5) の時のみ acc に 2倍した値を push。偶数はスキップ。最終的に [2, 6, 10] を返す。inject だと『最後の式を必ず返す』必要があるが each_with_object は不要。",
      codeExample:
        "# 同じ意味で書くなら\narr.select(&:odd?).map { |n| n * 2 }\n#=> [2, 6, 10]\n\n# filter_map (Ruby 2.7+) で 1 行\narr.filter_map { |n| n * 2 if n.odd? }\n#=> [2, 6, 10]",
    },
  },
  {
    id: "cr-002",
    categoryId: "code-reading",
    difficulty: "beginner",
    type: "choice",
    question: "次のコードの出力は？",
    code: 'def greet(name, greeting: "Hello")\n  "#{greeting}, #{name}!"\nend\n\nputs greet("Alice")\nputs greet("Bob", greeting: "Hi")',
    choices: [
      "Hello, Alice! / Hi, Bob!",
      "Hello, Alice! / Hello, Bob!",
      "ArgumentError / Hi, Bob!",
      "nil / Hi, Bob!",
    ],
    answerIndex: 0,
    hints: [
      "`greeting:` はキーワード引数 (デフォルト値あり)。",
      "1回目は省略 → デフォルト 'Hello'。",
      "デフォルト値 + 上書き値で出力が変わる組み合わせを順に追えば、ArgumentError や nil の選択肢は除外できます。",
    ],
    explanation: {
      summary:
        "キーワード引数はデフォルト値が使われ、明示すれば上書きされる。",
      reason:
        "`greeting: 'Hello'` は呼び出し時に省略可能。1 回目は省略 → 'Hello, Alice!'。2 回目は `greeting: 'Hi'` を渡している → 'Hi, Bob!'。Ruby 3.0+ では位置引数とキーワード引数が完全分離されたので、`greet('Bob', 'Hi')` のように位置で渡すと ArgumentError。",
      codeExample:
        '# Ruby 3.0+ では位置引数とキーワード引数が厳格に分離\ngreet("Bob", "Hi")            # ArgumentError\ngreet("Bob", greeting: "Hi")  # OK\n\n# 必須キーワード引数 (デフォルトなし)\ndef create(name:)\n  ...\nend\ncreate           # ArgumentError: missing keyword: name\ncreate(name: "A")',
    },
  },
  {
    id: "cr-003",
    categoryId: "code-reading",
    difficulty: "intermediate",
    type: "choice",
    question: "次のコードの出力は？",
    code: 'h = { a: 1, b: 2, c: 3 }\nresult = h.reduce(0) do |sum, (key, value)|\n  sum + value\nend\nputs result',
    choices: ["6", "[6]", "{a: 1, b: 2, c: 3}", "TypeError"],
    answerIndex: 0,
    hints: [
      "Hash の reduce は要素として [key, value] の配列を渡します。",
      "ブロック引数で `(key, value)` のように分解。",
      "ブロックは初期値 + value を返すので、結果はキーには関係なく値の総和そのものになります。",
    ],
    explanation: {
      summary:
        "Hash の reduce では要素は [key, value] 配列。`(key, value)` で分解できる。",
      reason:
        "Hash#each は [key, value] の配列を yield する。reduce のブロック引数で `(k, v)` と書くと自動分解 (destructuring)。`value` だけ合計したいなら `h.values.sum` のほうがシンプル。",
      codeExample:
        "# 同じ意味でもっと素直に\nh.values.sum  #=> 6\nh.sum { |_, v| v }  #=> 6\n\n# キーと値の両方を使う場合は reduce が便利\nh.reduce(0) { |sum, (k, v)| sum + (k == :a ? v * 10 : v) }\n#=> 1*10 + 2 + 3 = 15",
    },
  },
  {
    id: "cr-004",
    categoryId: "code-reading",
    difficulty: "intermediate",
    type: "choice",
    question: "次のコードの出力は？",
    code: "class Counter\n  @@count = 0\n  def initialize\n    @@count += 1\n  end\n  def self.count\n    @@count\n  end\nend\n\n3.times { Counter.new }\nputs Counter.count",
    choices: ["0", "1", "3", "NameError"],
    answerIndex: 2,
    hints: [
      "`@@count` はクラス変数。全インスタンスで共有。",
      "`Counter.new` するたびに +1。",
      "クラス変数は全インスタンスで共有されるので、new された回数だけ単調に +1 されていきます。",
    ],
    explanation: {
      summary:
        "クラス変数 (@@) はクラス + 全インスタンスで共有される。",
      reason:
        "`@@count` はクラスにひも付く 1 つの変数で、`initialize` 内で `+= 1` するたびに全体カウンタが増える。3 回 new したので 3。クラスメソッド `self.count` から参照すると 3 が返る。継承先と共有してしまうので、現代では `class << self; attr_accessor :count; end` のように特異クラスのインスタンス変数にする方が安全。",
      codeExample:
        "# 推奨される書き方 (クラスのインスタンス変数)\nclass Counter\n  class << self\n    attr_accessor :count\n  end\n  self.count = 0\n  def initialize\n    self.class.count += 1\n  end\nend",
      commonMistakes: [
        "クラス変数 @@count は継承時に親子で共有されて意図しないバグの原因になる。クラスのインスタンス変数 (@count) を class << self で公開する方が安全。",
      ],
    },
  },
  {
    id: "cr-005",
    categoryId: "code-reading",
    difficulty: "intermediate",
    type: "choice",
    question: "次のコードの出力は？",
    code: "def calc(arr)\n  arr.each_with_index.map { |x, i| x * (i + 1) }.sum\nend\n\nputs calc([10, 20, 30])",
    choices: ["60", "140", "100", "180"],
    answerIndex: 1,
    hints: [
      "`each_with_index` は (要素, インデックス) を渡します。",
      "i は 0,1,2 なので (i+1) は 1,2,3。",
      "各要素を (index+1) 倍にしてから合計するので、単純合計 (60) より大きく、最大要素の 3 倍より少し大きい値になります。",
    ],
    explanation: {
      summary:
        "各要素に (インデックス+1) を掛けて合計する処理。",
      reason:
        "10×1 + 20×2 + 30×3 = 140。`each_with_index` は要素と 0 始まりのインデックスを yield する Enumerator。`with_index(1)` で 1 始まりにできる。",
      codeExample:
        "# 1始まりにする\n[10, 20, 30].each.with_index(1).map { |x, i| x * i }.sum\n#=> 140\n\n# zip でも書ける\narr.zip(1..).map { |x, i| x * i }.sum",
    },
  },
  {
    id: "cr-006",
    categoryId: "code-reading",
    difficulty: "intermediate",
    type: "choice",
    question: "次のコードの出力は？",
    code: "class Animal\n  def sound\n    'generic'\n  end\nend\n\nclass Dog < Animal\n  def sound\n    \"#{super} + bark\"\n  end\nend\n\nclass Puppy < Dog\n  def sound\n    \"#{super} + yip\"\n  end\nend\n\nputs Puppy.new.sound",
    choices: [
      "generic + bark + yip",
      "generic + yip",
      "bark + yip",
      "yip",
    ],
    answerIndex: 0,
    hints: [
      "`super` は親クラスの同名メソッドを呼ぶ。",
      "Puppy#sound → super で Dog#sound → super で Animal#sound。",
      "下から上に辿って文字列が積まれていく。",
    ],
    explanation: {
      summary:
        "super チェーンで親→孫の順に評価され、結果が文字列で積み上がる。",
      reason:
        "Puppy#sound が呼ばれ、内部の `super` で Dog#sound が呼ばれる。Dog#sound の中の `super` で Animal#sound → 'generic'。これを使って Dog は 'generic + bark'、それを使って Puppy は 'generic + bark + yip' を返す。",
      codeExample:
        "# ancestors で継承チェーンを確認\nPuppy.ancestors\n#=> [Puppy, Dog, Animal, Object, ...]\n\n# super と super() の違い\n#   super   → 現在のメソッドの引数をそのまま親に渡す\n#   super() → 引数なしで親を呼ぶ",
    },
  },
  {
    id: "cr-007",
    categoryId: "code-reading",
    difficulty: "intermediate",
    type: "choice",
    question: "次のコードの出力は？",
    code: 'arr = ["apple", "banana", "cherry", "avocado"]\n\nresult = arr\n  .select { |w| w.start_with?("a") }\n  .map(&:length)\n  .max\n\nputs result',
    choices: ["7", "5", "6", "nil"],
    answerIndex: 0,
    hints: [
      "`select` で 'a' で始まる単語 → ['apple', 'avocado']。",
      "`map(&:length)` で長さを取得 → [5, 7]。",
      "select で残った単語の length を比べて最大を取るので、最終結果は元の単語の文字数のうちの 1 つ。",
    ],
    explanation: {
      summary:
        "'a' で始まる単語の最大文字数を求めるパイプライン。",
      reason:
        "select で apple, avocado を抽出 → map で長さ [5, 7] → max で 7。Rails/Ruby ではこのようなメソッドチェーンが頻出。読みやすさのため改行 + インデントを推奨。",
      codeExample:
        '# 1 行で書くと\narr.select { |w| w.start_with?("a") }.map(&:length).max\n\n# filter_map を使って圧縮 (Ruby 2.7+)\narr.filter_map { |w| w.length if w.start_with?("a") }.max',
    },
  },
  {
    id: "cr-008",
    categoryId: "code-reading",
    difficulty: "intermediate",
    type: "choice",
    question: "次のコードの出力は？",
    code: "def maybe_set(value)\n  value ||= 'default'\n  value\nend\n\nputs maybe_set(nil)\nputs maybe_set(false)\nputs maybe_set('hi')",
    choices: [
      "default / default / hi",
      "default / false / hi",
      "nil / false / hi",
      "default / default / default",
    ],
    answerIndex: 0,
    hints: [
      "`||=` は『nil または false なら代入』。",
      "false も falsy なので 'default' で上書きされる。",
      "3 つの変数の元の値が nil/false/truthy のどれかを順番に判定し、||= が代入を行う条件と照らし合わせてください。",
    ],
    explanation: {
      summary:
        "`||=` は nil/false 両方で発火する。false を保持したい時は注意。",
      reason:
        "`a ||= b` は `a = a || b` の糖衣構文。a が nil または false なら b を代入。false を有効な値として保持したいなら `a = b if a.nil?` のように `.nil?` で明示判定する。",
      codeExample:
        "# false を保持したい場合\nvalue = b if value.nil?\n\n# Hash でデフォルト値 (false も保持)\nh[:key] = default unless h.key?(:key)\nh.fetch(:key, default)\n\n# Hash#fetch なら nil/false も区別可\nh = { flag: false }\nh.fetch(:flag, true)   #=> false (キーが存在するので)\nh[:flag] || true       #=> true (falseだと上書きされてしまう)",
      commonMistakes: [
        "boolean フラグに `||=` を使うと false が上書きされてバグになる。",
      ],
    },
  },
  {
    id: "cr-009",
    categoryId: "code-reading",
    difficulty: "advanced",
    type: "choice",
    question: "次のコードの出力は？",
    code: "users = [\n  { name: 'Alice', score: 80 },\n  { name: 'Bob',   score: 95 },\n  { name: 'Carol', score: 72 },\n  { name: 'Dave',  score: 88 }\n]\n\ntop = users.sort_by { |u| -u[:score] }.first(2).map { |u| u[:name] }\nputs top.join(', ')",
    choices: [
      "Bob, Dave",
      "Alice, Bob",
      "Carol, Alice",
      "Bob, Alice",
    ],
    answerIndex: 0,
    hints: [
      "`-u[:score]` で降順ソート (大きい方が先頭)。",
      "上位 2 名は Bob (95) と Dave (88)。",
      "name だけ抜き出して join。",
    ],
    explanation: {
      summary:
        "スコア降順 → 上位 2 名 → 名前抽出 → カンマ結合のパイプライン。",
      reason:
        "score 降順: Bob(95), Dave(88), Alice(80), Carol(72)。first(2) で Bob と Dave。map で name 取り出し → join で 'Bob, Dave'。`sort_by { -x }` は降順の定番イディオム。`sort_by { x }.reverse` も同じ意味だが計算量は同等。",
      codeExample:
        "# max_by を使うと sort+first より速い\nusers.max_by(2) { |u| u[:score] }.map { |u| u[:name] }\n#=> ['Bob', 'Dave']\n\n# Rails の ActiveRecord ならDBでソート\nUser.order(score: :desc).limit(2).pluck(:name)",
    },
  },
  {
    id: "cr-010",
    categoryId: "code-reading",
    difficulty: "advanced",
    type: "choice",
    question: "次のコードの出力は？",
    code: "result = []\n\n[1, 2, 3].each do |i|\n  [10, 20].each do |j|\n    result << i * j\n  end\nend\n\nputs result.inspect",
    choices: [
      "[10, 20, 20, 40, 30, 60]",
      "[10, 20, 30]",
      "[10, 30, 60]",
      "[60]",
    ],
    answerIndex: 0,
    hints: [
      "二重ループの直積。",
      "i=1: 1*10, 1*20 → 10, 20",
      "外側ループの各値ごとに内側の全要素との積が積み上がるので、最終配列の長さは外側要素数 × 内側要素数 になります。",
    ],
    explanation: {
      summary:
        "ネストした each による直積。1×{10,20}, 2×{10,20}, 3×{10,20}。",
      reason:
        "外側ループの各 i に対して内側ループが回り、ペアを生成。`product` メソッドを使うと同じことが宣言的に書ける。",
      codeExample:
        "# product で書き直し\n[1, 2, 3].product([10, 20]).map { |a, b| a * b }\n#=> [10, 20, 20, 40, 30, 60]\n\n# flat_map でも書ける\n[1,2,3].flat_map { |i| [10,20].map { |j| i * j } }",
    },
  },
  {
    id: "cr-011",
    categoryId: "code-reading",
    difficulty: "advanced",
    type: "choice",
    question: "次のコードの出力は？",
    code: "module Greeter\n  def greet\n    \"Hi, I'm #{name}\"\n  end\nend\n\nclass User\n  include Greeter\n  attr_reader :name\n  def initialize(name)\n    @name = name\n  end\nend\n\nclass Admin < User\n  def greet\n    \"[ADMIN] #{super}\"\n  end\nend\n\nputs Admin.new('Alice').greet",
    choices: [
      "[ADMIN] Hi, I'm Alice",
      "[ADMIN] Hi, I'm ",
      "Hi, I'm Alice",
      "NoMethodError",
    ],
    answerIndex: 0,
    hints: [
      "Admin#greet → super で User の祖先チェーンを辿る。",
      "User 自身には greet 無し → Greeter#greet が呼ばれる。",
      "Admin → User → Greeter の祖先チェーンを super で辿るので、Greeter が返す挨拶文に Admin の prefix が付いた形になります。",
    ],
    explanation: {
      summary:
        "super は祖先チェーンを辿って一致するメソッドを探す。Mixin (include) も探索対象。",
      reason:
        "Admin#greet 内の super は親方向 (User → Greeter → Object) を順に探す。User に greet が無くても Greeter#greet が見つかるのでそれが呼ばれる。`Admin.ancestors` で順序を確認できる。",
      codeExample:
        "Admin.ancestors\n#=> [Admin, User, Greeter, Object, ...]\n\n# super は次の祖先のメソッドを呼ぶ\n#   Admin#greet -> User (greet なし) -> Greeter#greet が呼ばれる",
    },
  },
  {
    id: "cr-012",
    categoryId: "code-reading",
    difficulty: "advanced",
    type: "choice",
    question: "次のコードの出力は？",
    code: "def safe_divide(a, b)\n  a / b\nrescue ZeroDivisionError\n  Float::INFINITY\nrescue => e\n  e.class.name\nend\n\nputs safe_divide(10, 2)\nputs safe_divide(10, 0)\nputs safe_divide(10, 'x')",
    choices: [
      "5 / Infinity / TypeError",
      "5 / 0 / TypeError",
      "5 / Infinity / nil",
      "5 / Float::INFINITY / String",
    ],
    answerIndex: 0,
    hints: [
      "1 回目: 10/2 = 5。",
      "2 回目: ZeroDivisionError → Float::INFINITY。",
      "3 回目は数値と文字列の演算でクラスとして実行できず、rescue 内で例外クラス名 (の文字列) が出力されます。",
    ],
    explanation: {
      summary:
        "メソッド末尾 rescue で例外をハンドリング。複数 rescue 句で例外クラス別に分岐できる。",
      reason:
        "メソッド全体を begin/end で囲んだのと同等。先にマッチした rescue 句が実行される。`rescue =>` (デフォルト) は StandardError 以下を捕まえる。`Exception` を直接 rescue するのは SystemExit などを捕まえてしまうため避ける。Float::INFINITY は puts で 'Infinity' と表示される。",
      codeExample:
        "# メソッドの末尾 rescue\ndef parse(s)\n  Integer(s)\nrescue ArgumentError\n  0\nend\n\n# begin/rescue/ensure フル形式\nbegin\n  risky\nrescue SpecificError => e\n  handle(e)\nrescue => e\n  log(e)\nensure\n  cleanup\nend",
    },
  },

  // ===========================================================================
  // Ruby 基礎 追加 (Silver 対策: 正規表現・Time・IO・String 詳細) 12問
  // ===========================================================================
  {
    id: "rb-019",
    categoryId: "ruby-basics",
    difficulty: "intermediate",
    type: "choice",
    question: "次のコードの出力は？",
    code: '"hello world" =~ /o(.)/\nputs $~[1]\nputs $1',
    choices: [" / ", "o / o", "rl / rl", "nil / nil"],
    answerIndex: 0,
    choiceExplanations: [
      "正解。`/o(.)/` は最初の 'o' (hello の o) にマッチし、続く 1 文字 ' ' (hello の後のスペース) がキャプチャされる。$~[1] と $1 はどちらも同じ最初のキャプチャを参照する。",
      "'o' になるのはキャプチャの外側 (マッチ全体の一部) 自体を指しているわけではない。()で囲んだ中だけがキャプチャされる。",
      "'rl' は 'world' の o の次の 2 文字。`/o(.)/` は 1 文字キャプチャなので 'rl' ではなく ' ' (スペース 1 文字)。",
      "マッチは成功するので nil にはならない。マッチ失敗時は $~ も $1 も nil になるが、ここでは hello の o が見つかる。",
    ],
    hints: [
      "`=~` は正規表現マッチ。マッチ位置を返す。",
      "`$~` は最後のマッチ全体の MatchData。`$1` は最初のキャプチャグループ。",
      "キャプチャは『o の次の 1 文字』。元の文字列で o の隣に来ている文字が何かを確認すれば、$1 の中身が見えてきます。",
    ],
    explanation: {
      summary:
        "`$~[1]` と `$1` は同じ意味で、1番目のキャプチャグループを返す。",
      reason:
        "'hello world' に対し `/o(.)/` は最初の 'o' (hello の o) にマッチ。次の文字 ' ' (スペース) がキャプチャされる。`$~` (Regexp.last_match) は最後のマッチ情報、`$1`〜`$9` は対応するキャプチャ。",
      beginnerExplanation:
        "正規表現マッチで使う **特殊なグローバル変数** の話です。\n\n`'hello world' =~ /o(.)/` を実行すると、Ruby は文字列を左から走査して最初の 'o' を見つけます (hello の 'o')。次に `(.)` で 1 文字キャプチャしようとして、'o' の隣のスペース ' ' を捕まえます。\n\n**マッチの結果はいくつかの『特殊変数』に自動で入ります**:\n- `$~` (\"$tilde\") — 最後のマッチの **MatchData オブジェクト全体**。マッチ全体や全てのキャプチャを含む。`Regexp.last_match` と同じもの。\n- `$~[0]` — マッチした文字列全体 (今回は \"o \")\n- `$~[1]` — 1 番目のキャプチャグループ (今回は \" \")\n- `$1`, `$2`, ... — それぞれ `$~[1]`, `$~[2]`, ... の **省略記法**\n\nだから `$~[1]` と `$1` は **同じものを違う書き方で参照** しています。両方とも \" \" (スペース 1 文字) を返し、puts するとそれぞれスペースが 1 行ずつ出ます。\n\n**注意**: これらの `$` 変数はマッチが起きるたびに上書きされる『使い捨て』なので、結果を後で使いたい場合は変数に保存しておくのが安全です: `m = 'hello world'.match(/o(.)/); m[1]`",
      modelSelfExplanation: {
        conclusion:
          "出力は両方とも ' ' (スペース 1 文字)。`$~[1]` と `$1` は同じ最初のキャプチャグループを参照する別記法。",
        reason:
          "Ruby の正規表現マッチ (=~) は副作用として複数の特殊変数を更新する: `$~` には最後のマッチを表す MatchData が、`$1` `$2` ... には対応するキャプチャグループの文字列が、`$&` にはマッチ全体が入る。`$~[n]` は MatchData をインデックスアクセスする書き方で、結果として `$n` と同じ値を返す。今回 `/o(.)/` は文字 'o' とその直後の任意 1 文字にマッチし、'hello' の 'o' とそれに続くスペースをキャプチャするので両者とも ' ' を返す。",
        example:
          "正規表現で日付やキー=値を抽出する場面で頻出: `'2024-01-15' =~ /(\\d{4})-(\\d{2})/` のあと $1 が '2024'、$2 が '01'。ただし最近のスタイルガイドでは可読性のために `'2024-01-15'.match(/(\\d{4})-(\\d{2})/) { |m| [m[1], m[2]] }` のように MatchData を明示的に受け取って使う書き方が推奨される。",
        pitfall:
          "`$1` 等のグローバル変数は **マッチが起きるたびに上書き** されるので、複数の場所でマッチを併用すると意図せず値が変わる。マルチスレッドではさらに危険。安全策は `m = str.match(re); m[1]` のように MatchData を変数に受け取ること。また、マッチ失敗時は $~ も $1 も nil になるので、参照前にマッチ成否を確認する。",
      },
      codeExample:
        '"hello world" =~ /o(.)/    # マッチ位置 4 を返す\n$~              #=> #<MatchData "o " 1:" ">\n$~[0]           #=> "o " (マッチ全体)\n$~[1]           #=> " " (1番目のキャプチャ)\n$1              #=> " " (同じ)\n\n# 名前付きキャプチャ\n"2024-01-15" =~ /(?<year>\\d+)-(?<month>\\d+)/\n$~[:year]       #=> "2024"',
      commonMistakes: [
        "`$1` などのグローバル変数は使い捨て。マルチスレッドや別マッチで上書きされるので、安全な MatchData オブジェクトを変数で受けるのが良い。",
      ],
      references: [
        {
          label: "Ruby 公式リファレンス: 正規表現 (特殊変数 $~ / $1)",
          url: "https://docs.ruby-lang.org/ja/latest/doc/spec=2fregexp.html",
        },
        {
          label: "Ruby 公式リファレンス: MatchData クラス",
          url: "https://docs.ruby-lang.org/ja/latest/class/MatchData.html",
        },
      ],
    },
  },
  {
    id: "rb-020",
    categoryId: "ruby-basics",
    difficulty: "intermediate",
    type: "choice",
    question: "次のコードの出力は？",
    code: '"abc-123-xyz".scan(/\\d+/)',
    choices: [
      '["123"]',
      '["1", "2", "3"]',
      '["abc", "xyz"]',
      "nil",
    ],
    answerIndex: 0,
    hints: [
      "`scan` はマッチした文字列を全部配列で返す。",
      "`/\\d+/` は連続する数字。",
      "`+` は 1 文字以上の繰り返しを 1 つのマッチとして扱うので、結果配列の要素は 3 つではなく 1 つになります。",
    ],
    choiceExplanations: [
      "正解。`\\d+` は『連続する数字を可能な限り長く』マッチさせる量指定子なので、'123' 全体が 1 つのマッチとなり配列に 1 要素入る。",
      "1 文字ずつ分割されるのは `\\d` (量指定なし) を `scan` した場合 (`'123'.scan(/\\d/)` → `['1','2','3']`)。`\\d+` は連続を 1 つにまとめる。",
      "`\\d+` は数字にマッチするので、英字 'abc' や 'xyz' は対象外。英字を抜きたいなら `/[a-z]+/`。",
      "scan はマッチが無いと空配列 `[]` を返す (`nil` ではない)。今回はマッチがあるのでさらに該当なし。",
    ],
    explanation: {
      summary:
        "`String#scan(regexp)` はマッチした部分文字列を配列で返す。",
      reason:
        "`match` は最初のマッチ 1 件、`scan` は全マッチを配列で。キャプチャグループがあるとキャプチャごとに配列の配列を返す: `scan(/(\\w+)=(\\w+)/) #=> [[\"a\",\"1\"], ...]`。",
      beginnerExplanation:
        "`String#scan` は **「正規表現にマッチする部分を全部抜き出して配列にする」** メソッドです。1 行で『文字列からパターンに合うものを全部回収』できる便利な道具です。\n\n仕組みを順を追って見ましょう。\n\n1. 文字列 `'abc-123-xyz'` を左から走査。\n2. パターン `/\\d+/` (= 数字 1 文字以上の連続) を探す。\n3. 'a', 'b', 'c', '-' はマッチしない。'1', '2', '3' で連続マッチして '123' を 1 つのマッチとして確定。\n4. 続けて 'x', 'y', 'z' はマッチせず、文字列末尾に到達。\n5. 結果として **マッチした文字列の配列** `['123']` を返す。\n\n**ポイント**: `+` の量指定子は『可能な限り長く』マッチを伸ばすので、'123' は 1 文字ずつではなくまとめて 1 つのマッチになります。もし `/\\d/` (量指定なし) なら 1 文字ずつ別マッチになって `['1','2','3']` になります。\n\nさらに、**キャプチャグループがあるパターンを scan に渡すと『キャプチャの配列の配列』** を返します:\n```ruby\n'name=alice&age=20'.scan(/(\\w+)=(\\w+)/)\n#=> [['name', 'alice'], ['age', '20']]\n```\nこれを `to_h` すると一気にハッシュにできるので、URL クエリパーサや簡易設定ファイル解析でよく使います。",
      modelSelfExplanation: {
        conclusion:
          "結果は `['123']`。`String#scan(regexp)` は文字列内でパターンにマッチした全部分を配列にして返し、`\\d+` は連続する数字をひとまとまりにマッチさせるため、'abc-123-xyz' から数字部分 '123' が 1 要素として抽出される。",
        reason:
          "`scan` は内部で正規表現を繰り返し適用し、マッチが取れる限り左から右へ進めて全マッチを配列に集める。量指定子 `+` (1 回以上の繰り返し) は『可能な限り長く取る』ため、123 は 3 つではなく 1 つのマッチになる。scan の戻り値の構造は『パターンにキャプチャグループが無ければ String の配列、あれば各マッチのキャプチャを配列にしたものの配列』というルール。\n\n対比として `match` / `match?` は最初のマッチだけを扱い、`gsub` は置換、`split` は区切りで分解、と用途が異なる。",
        example:
          "ログから IP アドレスを全部取り出す `log.scan(/\\d+\\.\\d+\\.\\d+\\.\\d+/)`、URL クエリを Hash 化する `query.scan(/(\\w+)=([^&]+)/).to_h`、HTML から `<img src=\"...\">` をすべて拾う `html.scan(/<img\\s+src=\"([^\"]+)\"/)` など、テキストからパターンに合うデータを一括収集する場面で頻出。",
        pitfall:
          "キャプチャグループの有無で戻り値の構造が変わるのが落とし穴。`(\\d+)` (キャプチャあり) と `\\d+` (キャプチャなし) では、前者が `[['123']]` (要素は配列)、後者が `['123']` (要素は文字列) を返す。さらに括弧でグループ化するだけの場合 (非キャプチャ `(?:...)`) も覚えておくと、意図せず配列のネストが深くなる事故を避けられる。",
      },
      codeExample:
        '"abc-123-xyz".scan(/\\d+/)        #=> ["123"]\n"a1b2c3".scan(/[a-z](\\d)/)        #=> [["1"], ["2"], ["3"]]\n"name=alice&age=20".scan(/(\\w+)=(\\w+)/)\n#=> [["name","alice"], ["age","20"]]\n\n# Hash 化\n"name=alice&age=20".scan(/(\\w+)=(\\w+)/).to_h\n#=> {"name"=>"alice", "age"=>"20"}',
      commonMistakes: [
        "キャプチャグループの有無で戻り値の構造が変わる。非キャプチャグループ `(?:...)` でグループ化だけしたい場面では `(?:` を使う。",
      ],
      references: [
        {
          label: "Ruby 公式リファレンス: String#scan",
          url: "https://docs.ruby-lang.org/ja/latest/method/String/i/scan.html",
        },
        {
          label: "Ruby 公式リファレンス: 正規表現 (量指定子・グループ化)",
          url: "https://docs.ruby-lang.org/ja/latest/doc/spec=2fregexp.html",
        },
      ],
    },
  },
  {
    id: "rb-021",
    categoryId: "ruby-basics",
    difficulty: "intermediate",
    type: "text",
    question:
      '"  hello  " の前後の空白を取り除いて "hello" を返す String のメソッド名は？(メソッド名のみ)',
    answers: ["strip"],
    hints: [
      "前後だけ削除するメソッド。",
      "左だけは `lstrip`、右だけは `rstrip`。",
      "`lstrip` / `rstrip` から左右を表す接頭辞 (l / r) を取り除いた、5 文字の共通部分がメソッド名になります。",
    ],
    explanation: {
      summary: "`String#strip` は前後の空白文字を削除する。",
      reason:
        "削除対象はスペース・タブ・改行 (\\t \\n \\r 等)。中央の空白は残る。`lstrip` / `rstrip` で片側のみ。フォーム入力の正規化で頻出。",
      beginnerExplanation:
        "`strip` は **「文字列の前後にくっついた空白を取り除く」** メソッドです。string trimming の Ruby 版と覚えると馴染みやすいです。\n\n削除対象は『空白系の文字』全般で、半角スペース・タブ (\\t)・改行 (\\n)・キャリッジリターン (\\r) などが含まれます。**文字列の中央にある空白は残る** ので、`'  hello world  '.strip` は `'hello world'` (中央のスペースは残る) になります。\n\nバリエーション:\n- `strip` → 両端を削除\n- `lstrip` → 左 (先頭) だけ削除\n- `rstrip` → 右 (末尾) だけ削除\n\n似たメソッドに `chomp` がありますが、こちらは **末尾の改行を 1 つだけ** 削除する用途。`gets` で読み込んだ行末改行を消すときによく使います。\n\nさらに『中央の空白も全部消したい』なら正規表現で `gsub(/\\s/, '')` や `tr(' ', '')`、『複数空白を 1 つにまとめたい』なら `squeeze(' ')` などを使い分けます。フォーム入力の前処理、CSV のパース、URL の正規化など、現場で 1 日に何回も書くメソッドです。",
      modelSelfExplanation: {
        conclusion:
          "メソッド名は `strip`。String#strip は文字列の前後に付いた空白系文字 (スペース・タブ・改行など) を削除した新しい文字列を返す。",
        reason:
          "Ruby の文字列正規化は用途別に細かいメソッドが揃っていて、`strip` は両端、`lstrip` / `rstrip` は片側、`chomp` は末尾の改行だけ、`squeeze` は連続文字の縮約、と役割を分けて持っている。strip は『削除対象が複数種類の空白文字』『削除位置が両端』というユースケースを 1 メソッドで簡潔に表すために標準で用意されている。",
        example:
          "フォーム入力の正規化で `email = params[:email].to_s.strip.downcase` のようにメソッドチェーンの中に組み込むのが定番。CSV の値処理、ログのトリミング、ユーザ名・氏名の表示前整形など『境界での空白除去』は実務で頻出。",
        pitfall:
          "全角スペース (U+3000) は Ruby 2.4+ では strip の対象に **含まれない** (\\s に該当しないため)。日本語入力で全角空白を取り除きたいなら `str.gsub(/[\\u{3000}\\s]+/, '')` のように明示するか、`str.gsub(/\\A[[:space:]]+|[[:space:]]+\\z/, '')` のように POSIX 文字クラスを使う。strip だけだと全角スペースが残るバグになりがち。",
      },
      codeExample:
        '"  hello  ".strip       #=> "hello"\n"  hello  ".lstrip      #=> "hello  "\n"  hello  ".rstrip      #=> "  hello"\n"\\n\\t  hi \\n".strip    #=> "hi"\n\n# 文字列全体から空白を削除\n"a b c".gsub(/\\s/, "")  #=> "abc"\n"a b c".tr(" ", "")     #=> "abc"',
      commonMistakes: [
        "全角スペース (U+3000) は strip の対象外。日本語入力の正規化では `gsub(/[\\u{3000}\\s]+/, '')` のように明示する。",
      ],
      references: [
        {
          label: "Ruby 公式リファレンス: String#strip",
          url: "https://docs.ruby-lang.org/ja/latest/method/String/i/strip.html",
        },
      ],
    },
  },
  {
    id: "rb-022",
    categoryId: "ruby-basics",
    difficulty: "intermediate",
    type: "choice",
    question: "次のコードの出力は？",
    code: '"abc,def,ghi".split(",").map(&:upcase)',
    choices: [
      '["ABC", "DEF", "GHI"]',
      '["ABCDEFGHI"]',
      '"ABC,DEF,GHI"',
      "ArgumentError",
    ],
    answerIndex: 0,
    choiceExplanations: [
      "正解。split でカンマ区切り 3 要素配列、map(&:upcase) で各要素を大文字化。配列構造はそのまま、要素だけが変換される。",
      "結合 (join) はしていないので 1 つの文字列にはならない。連結したいなら `.join('')` を追加する。",
      "文字列のままにはならない。split が呼ばれた時点で結果は配列になり、map もまた配列を返す。",
      "split / map / &:upcase はどれも標準のメソッドで、引数の型もマッチしているので例外は起きない。",
    ],
    hints: [
      "`split(\",\")` でカンマ区切り配列に。",
      "`map(&:upcase)` で各要素を大文字化。",
      "split で 3 要素の配列になり、map(&:upcase) は配列のまま各要素を大文字化するので、最終形は配列のまま要素数が変わらない選択肢です。",
    ],
    explanation: {
      summary:
        "split で文字列を配列化 → map(&:upcase) で各要素を大文字化。",
      reason:
        "`String#split(sep)` は区切り文字で配列分割。引数省略時は空白で分割。逆操作は `Array#join(sep)`。CSV っぽいパースで使うが、本格的な CSV は標準ライブラリ `csv` を使う。",
      beginnerExplanation:
        "2 ステップに分解して読みましょう。\n\n**Step 1: `'abc,def,ghi'.split(',')`**\n文字列を `,` で分割して配列を作ります。結果は `['abc', 'def', 'ghi']`。文字列の split は SQL の `STRING_SPLIT` や Python の `str.split` と同じ感覚です。\n\n**Step 2: `.map(&:upcase)`**\n配列の各要素に対して `upcase` を呼び、結果を新しい配列にまとめます。`&:upcase` は『シンボル `:upcase` を Proc 化してブロックとして渡す』短縮記法で、`{ |x| x.upcase }` と同じ意味になります。1 引数のメソッドを呼ぶだけのときに頻出する書き方です。\n\n結果として `['ABC', 'DEF', 'GHI']` が返ります。**map は配列の形を保ったまま、中身だけ変換** するメソッドなので、要素数は元と同じ 3 のままです。\n\n**逆操作** が必要なら `Array#join(',')` で配列を区切り文字付きの文字列に戻せます: `['ABC','DEF','GHI'].join(',')` → `'ABC,DEF,GHI'`。\n\n**本格的な CSV パース** には標準ライブラリの `csv` を使います。クォート対応や改行を含むセルなど split では扱えない仕様に対応しています。",
      modelSelfExplanation: {
        conclusion:
          "結果は `['ABC', 'DEF', 'GHI']`。split がカンマで 3 要素配列に分解し、map が各要素を upcase で大文字化、map は配列構造を保つので最終形も 3 要素配列。",
        reason:
          "Ruby のコレクション操作は『データ構造を保ったまま要素を変換する map』『絞り込む select/filter』『畳み込む reduce』のように関数型的な命名で揃っている。今回の `split → map(&:upcase)` は『文字列を配列に分解 → 各要素を変換』というパイプライン的な書き方の典型で、`&:upcase` の Symbol-to-Proc 記法と組み合わせて 1 行で表現できる。",
        example:
          "現場では URL クエリのパース `query.split('&').map { |kv| kv.split('=') }`、CSV ライクなログ整形 `line.split(\"\\t\").map(&:strip)`、タグの正規化 `tags_str.split(',').map(&:downcase).map(&:strip).uniq` など、文字列を配列に展開してから各要素を加工するのは日常的に登場するパターン。",
        pitfall:
          "split は『区切り文字が連続するとき空文字を要素として含めるかどうか』が引数で変わる。`'a,,b'.split(',')` は `['a', '', 'b']`、`'a,b,'.split(',')` は `['a', 'b']` (末尾の空要素は削除)。末尾も残したいなら第 2 引数に -1 を渡す: `split(',', -1)`。さらに本格的な CSV (クォート・改行含む) は split では正しく扱えないので必ず標準ライブラリ `csv` を使う。",
      },
      codeExample:
        '"abc,def,ghi".split(",")          #=> ["abc","def","ghi"]\n"  a   b   c  ".split             #=> ["a","b","c"] (連続空白で分割)\n\n# 結合\n["a","b","c"].join("-")           #=> "a-b-c"\n\n# CSV パース\nrequire "csv"\nCSV.parse("a,b,c\\n1,2,3")\n#=> [["a","b","c"], ["1","2","3"]]',
      commonMistakes: [
        "split の戻り値は末尾の空文字を切り捨てる仕様。末尾も残したいなら第 2 引数に -1 を渡す (`split(',', -1)`)。",
        "本格的な CSV (クォート・改行・エスケープ) は split では扱えない。標準ライブラリ `csv` を使う。",
      ],
      references: [
        {
          label: "Ruby 公式リファレンス: String#split",
          url: "https://docs.ruby-lang.org/ja/latest/method/String/i/split.html",
        },
        {
          label: "Ruby 公式リファレンス: Enumerable#map",
          url: "https://docs.ruby-lang.org/ja/latest/method/Enumerable/i/map.html",
        },
      ],
    },
  },
  {
    id: "rb-023",
    categoryId: "ruby-basics",
    difficulty: "intermediate",
    type: "choice",
    question: "次のコードの出力は？",
    code: 'require "date"\nputs Date.new(2024, 1, 31) + 1',
    choices: ["2024-02-01", "2024-01-32", "ArgumentError", "2024-02-29"],
    answerIndex: 0,
    choiceExplanations: [
      "正解。Date#+ は『n 日後』を返す。1月31日 + 1 日 = 2月1日。月またぎ・年またぎ・うるう年も自動で処理される。",
      "Date は『1 月 32 日』のような無効日付を持たない。月の境界を超えると自動的に翌月へ繰り上がる。",
      "整数の加算は Date クラスでサポートされた正規の演算なのでエラーにならない。Date - Date のような演算結果は Rational になる。",
      "2024 年は閏年だが、1 月 31 日 + 1 日は 2 月 1 日。2 月 29 日になるのは『+ 29』の場合。",
    ],
    hints: [
      "`Date + 整数` は日付加算。",
      "1月31日 + 1日 = 2月1日。",
      "Date クラスは日数計算を月またぎで正しく処理。",
    ],
    explanation: {
      summary: "Date オブジェクト + 整数 は日付加算 (月またぎ・うるう年も正しく処理)。",
      reason:
        "`Date` は date 標準ライブラリ。`Date + n` は n 日後、`Date - other_date` は日数差 (Rational)。`Date.today`, `Date.parse`, `Date#strftime` も頻出。",
      beginnerExplanation:
        "Ruby の `Date` クラスは、**日付の計算を人間の感覚通りに正しく処理してくれる** 便利なクラスです。標準ライブラリなので `require 'date'` が必要です。\n\n基本的な使い方:\n- `Date.new(2024, 1, 31)` → 2024 年 1 月 31 日の Date オブジェクト\n- `Date + 整数` → その日数後の Date を返す\n- `Date - Date` → 2 つの日付の日数差 (Rational)\n- `Date.today` → 今日\n- `Date.parse('2024-12-25')` → 文字列をパース\n- `date.strftime('%Y/%m/%d')` → 任意フォーマットで文字列化\n\n今回のコード `Date.new(2024, 1, 31) + 1` は『2024 年 1 月 31 日の 1 日後』を求めます。1 月は 31 日まで、それ以降は 2 月なので、結果は **2024 年 2 月 1 日**。Ruby が月の境界を自動で扱ってくれるので、`'2024-01-32'` のような無効日付になることはありません。\n\n**Date, DateTime, Time の使い分け**:\n- `Date` → 日付のみ (時刻なし)。生年月日、締切日などに。\n- `Time` → 日付 + 時刻 + タイムゾーン。現在の Ruby ではこれが主役。\n- `DateTime` → 日付 + 時刻 (Time より古い、現在は非推奨気味)。\n\n迷ったら **Time** を使えば OK です。`Time.now` で現在時刻、`Time.parse` で文字列パース。",
      modelSelfExplanation: {
        conclusion:
          "出力は `2024-02-01`。`Date + 整数` は『n 日後』を表す日付演算で、1月31日に 1 日を足すと月をまたいで 2 月 1 日になる。",
        reason:
          "Ruby の Date クラスはユリウス暦・グレゴリオ暦の変換まで含めて日付計算を内部で正しく扱う。`Date#+(Integer)` は『n 日後』、`Date#-(Date)` は『日数差 (Rational)』、`Date#-(Integer)` は『n 日前』と演算子オーバーロードで自然に書ける。月末・年末・うるう年などの境界も内部で考慮されるので、開発者は『日数加算したい』という意図だけ書けば正しい結果が得られる。",
        example:
          "現場では『3 日後に通知』のような営業日計算で `Date.today + 3`、『有効期限まであと何日』で `(expires_on - Date.today).to_i`、『先月の同じ日』で `date << 1` (Date#<< は『n か月前』)、『来月の同じ日』で `date >> 1` のように使う。Rails では ActiveSupport の `1.day.from_now`、`3.business_days.from_now` のような拡張も併用される。",
        pitfall:
          "Date の加算は『日数』ベース。『1 か月後』をしたいなら `date + 1` ではなく `date >> 1` (`Date#>>`) を使う。さらに『1 か月後に該当日が無い』場合 (1 月 31 日の 1 か月後 = 2 月 28/29 日) は自動で月末へ丸められるので、振替日・支払日のような業務日付では仕様を要確認。タイムゾーンが絡む場面では Date ではなく Time / ActiveSupport::TimeWithZone を使う。",
      },
      codeExample:
        'require "date"\nDate.new(2024, 1, 31) + 1     #=> #<Date: 2024-02-01>\nDate.today                     # 今日\nDate.parse("2024-12-25")       # 文字列パース\nDate.today.strftime("%Y/%m/%d")\n\n# Date と DateTime と Time\n# Date     : 日付のみ\n# DateTime : 日付 + 時刻 (廃止予定的、Time 推奨)\n# Time     : 時刻 (タイムゾーン対応)',
      commonMistakes: [
        "『1 か月後』は `date + 30` ではなく `date >> 1`。30 日加算と 1 か月後は別物。",
      ],
      references: [
        {
          label: "Ruby 公式リファレンス: Date クラス",
          url: "https://docs.ruby-lang.org/ja/latest/class/Date.html",
        },
        {
          label: "Ruby 公式リファレンス: Date#+",
          url: "https://docs.ruby-lang.org/ja/latest/method/Date/i/=2b.html",
        },
      ],
    },
  },
  {
    id: "rb-024",
    categoryId: "ruby-basics",
    difficulty: "intermediate",
    type: "choice",
    question:
      "次のうち、現在のシステム時刻を取得する正しい Ruby コードは？",
    choices: [
      "Time.now",
      "Time.current",
      "DateTime.today",
      "Date.time",
    ],
    answerIndex: 0,
    choiceExplanations: [
      "正解。`Time.now` は標準 Ruby に組み込みの『現在のシステムローカル時刻』。`require` 不要で動く。",
      "Rails (ActiveSupport) 拡張のメソッド。`config.time_zone` を尊重するので Rails アプリ内では推奨だが、純 Ruby では未定義。",
      "DateTime に `today` メソッドはあるが、これは『今日の DateTime』であり時刻部分は 0:00:00 になる。現在時刻ではない。",
      "Date クラスに `time` メソッドは存在しない。Date は日付のみを扱うクラス。",
    ],
    hints: [
      "標準 Ruby (Rails 無し) で動くもの。",
      "Rails の `Time.current` は ActiveSupport 拡張。",
      "ActiveSupport (`Time.current`) や DateTime/Date 固有の選択肢を除外すれば、組み込みクラスのもっとも素直な書き方が残ります。",
    ],
    explanation: {
      summary:
        "Pure Ruby: `Time.now`。Rails 環境: `Time.current` (タイムゾーン考慮)。",
      reason:
        "`Time.now` はシステムローカル時刻。Rails の `Time.current` は `Time.zone.now` のラッパーで、`config.time_zone = 'Tokyo'` を尊重する。本番環境は常に UTC で保存、表示時に zone 変換が定石。",
      beginnerExplanation:
        "Ruby で現在時刻を取る方法は `Time.now` です。これは Ruby に最初から組み込まれている **Time クラス** のクラスメソッドで、追加で何も require せずに使えます。\n\n```ruby\nTime.now\n#=> 2024-05-24 14:30:12 +0900\n```\n\n返ってくる Time オブジェクトはシステムのタイムゾーン (TZ 環境変数や OS の設定) でフォーマットされます。\n\n**Rails アプリでは少し違います**。Rails には ActiveSupport が拡張した `Time.current` というメソッドがあって、これは `Time.zone.now` の別名です。Rails の `config.time_zone = 'Tokyo'` のようなアプリ全体のタイムゾーン設定を尊重するので、サーバの OS タイムゾーンに左右されない安全な現在時刻取得になります。\n\n**本番運用の定石**:\n- DB には **常に UTC で保存** (Rails のデフォルト)\n- 計算・比較も UTC ベースで行う\n- ユーザーに見せる直前で `Time.current` や `in_time_zone` でローカル時刻に変換\n\nDateTime クラスや Date クラスにも似たメソッドがありますが、現在は `Time` を使うのが推奨です。DateTime は古い API で、Time の方が高速かつタイムゾーン対応が充実しています。",
      modelSelfExplanation: {
        conclusion:
          "純 Ruby で現在時刻を取るなら `Time.now`。Rails アプリ内では ActiveSupport が拡張した `Time.current` (= `Time.zone.now`) を使い、アプリ設定のタイムゾーンを尊重するのが定石。",
        reason:
          "`Time.now` は Ruby 組み込みで、OS のタイムゾーン (TZ 環境変数等) に基づいて現在時刻を返す。Rails では `config.time_zone` でアプリ全体のタイムゾーンを宣言できるが、`Time.now` はこれを無視する。そこで ActiveSupport が `Time.current` を提供し、内部で `Time.zone.now` を呼ぶことで、サーバの OS 設定に依存しないアプリ統一のタイムゾーン挙動を保証する。",
        example:
          "Rails アプリでは『DB は UTC で保存、表示は Time.zone.now や in_time_zone で変換』が定石。`created_at` を画面に出すなら `<%= post.created_at.in_time_zone.strftime('%Y/%m/%d %H:%M') %>`、現在時刻と比較するなら `Time.current > deadline` のように常に zone 付きで揃える。バックグラウンドジョブやログでも `Time.current` を使い、`Time.now` は基本書かない。",
        pitfall:
          "Rails で `Time.now` を直接使うと OS のタイムゾーン (本番は UTC、開発機は JST など) によって結果が変わってバグの温床。さらに DB との比較で『timezone がズレた値』を渡すと SQL のインデックスが効かないこともある。Rails 規約として `Time.current` / `Date.current` / `Time.zone.parse` を統一して使い、`Time.now` / `Date.today` は避けるという rubocop-rails のルールが用意されている (`Rails/TimeZone`)。",
      },
      codeExample:
        'Time.now                  # システムローカル\nTime.now.utc              # UTC に変換\nTime.now.strftime("%Y-%m-%d %H:%M:%S")\n\n# Rails (ActiveSupport)\nTime.current              #=> Time.zone.now\nTime.zone.now\n1.hour.ago                # 1時間前\n3.days.from_now           # 3日後\nTime.zone                 #=> #<ActiveSupport::TimeZone: Tokyo>',
      commonMistakes: [
        "Rails で `Time.now` を直接使うとタイムゾーンが OS 依存になりバグの元。`Time.current` を使う。",
        "rubocop-rails の `Rails/TimeZone` cop が `Time.now` を警告。CI で機械的に防ぐと安全。",
      ],
      references: [
        {
          label: "Ruby 公式リファレンス: Time クラス",
          url: "https://docs.ruby-lang.org/ja/latest/class/Time.html",
        },
        {
          label: "Rails API: Time.current (ActiveSupport)",
          url: "https://api.rubyonrails.org/classes/Time.html#method-c-current",
        },
      ],
    },
  },
  {
    id: "rb-025",
    categoryId: "ruby-basics",
    difficulty: "intermediate",
    type: "choice",
    question: "次のコードの出力は？",
    code: 'File.open("/tmp/test.txt", "w") do |f|\n  f.puts "hello"\nend\n# ↑ ファイル書き込み\n\nputs File.read("/tmp/test.txt").chomp',
    choices: ["hello", "hello\\n", "nil", "Errno::ENOENT"],
    answerIndex: 0,
    choiceExplanations: [
      "正解。puts で 'hello\\n' を書き込み、File.read で全文読み込み、chomp で末尾の改行 1 つを除去すると 'hello' が残り、それを最後の puts が出力する。",
      "末尾の chomp によって改行が除去されるので、表示には改行は出ない。chomp を消すと puts 自身も改行を加えるので 2 つの改行が含まれた表示になる。",
      "ブロック内でちゃんと書き込み完了し File.read もファイル存在を確認できるので nil にはならない。",
      "ファイルは直前で生成されているので存在する。Errno::ENOENT は対象ファイルが無いときの例外。",
    ],
    hints: [
      "`File.open` のブロック付き形式は自動でクローズ。",
      "`f.puts \"hello\"` は 'hello\\n' を書き込み。",
      "puts は末尾に改行を付けて書き込みますが、最後に chomp を通すのでその改行はトリムされた状態になります。",
    ],
    explanation: {
      summary:
        "`File.open ... do |f|` のブロック付き形式は自動 close。File.read で一括読み込み + chomp で末尾改行除去。",
      reason:
        "ファイル操作はブロック付きで開くと例外時も自動 close。`'w'` 書き込み、`'r'` 読み込み、`'a'` 追記、`'r+'` 読み書き。`puts` は末尾改行付与、`print` は付与なし、`write` も付与なし。",
      beginnerExplanation:
        "Ruby のファイル操作の **基本パターン** が詰まったコードです。順を追って見ましょう。\n\n**1. ファイルを書き込みモード (`'w'`) で開く**\n```ruby\nFile.open('/tmp/test.txt', 'w') do |f|\n  f.puts 'hello'\nend\n```\n`File.open` の **ブロック付き形式** は『開いて、ブロック内で操作して、自動で閉じる』を 1 つにまとめてくれます。途中で例外が出ても確実にクローズされるので、ファイルディスクリプタリークの心配がありません。Python の `with open(...)`、JavaScript の try-with-resources パターンと同じ思想です。\n\nブロック内で `f.puts 'hello'` を呼ぶと、'hello' に **改行 \\n が付いて** ファイルに書き込まれます。puts は『put string with newline』の略です。改行をつけたくないなら `f.print` や `f.write` を使います。\n\n**2. 読み込み**\n```ruby\nFile.read('/tmp/test.txt')\n#=> \"hello\\n\"\n```\n`File.read` はファイル内容を一括で文字列として取得します。puts で書いた改行 \\n も入っています。\n\n**3. 末尾の改行を除去**\n`.chomp` で文字列末尾の改行 (1 つだけ) を取り除いて 'hello' に。\n\n**4. 出力**\n最後の `puts` が 'hello' を画面に出力します。\n\nまとめると **`hello`** (改行は chomp で除去済み、puts が新たに 1 つ改行を足して表示) が出力されます。",
      modelSelfExplanation: {
        conclusion:
          "出力は `hello`。File.open のブロック付き形式で `'hello\\n'` を書き込み、File.read で読み戻し chomp で末尾改行を除去した結果を puts で表示するため、画面上は『hello』の 1 行になる。",
        reason:
          "ブロック付き `File.open` は『開く → 渡されたブロックを実行 → 例外の有無に関わらず close する』をひとまとめにする Ruby のイディオム (Resource Acquisition Is Initialization 相当)。これにより file descriptor リークが防げる。puts はレシーバ (IO や stdout) に文字列を書き、末尾に改行を補完するメソッド。chomp は末尾の改行 1 つを除去する。これらの組み合わせで『書き込み → 読み戻し → 整形 → 表示』というファイル操作の一連の流れになる。",
        example:
          "実務では設定ファイルやログの読み書き、テンポラリファイル経由のデータ受け渡し、CSV/JSON のエクスポートなど多くの場面で File.open のブロック形式を使う。Rails アプリでも `Tempfile.open` や `CSV.open` などブロック形式の API が標準で揃っており、利用者は close を忘れる心配がない。",
        pitfall:
          "ブロック無しの `f = File.open(path, 'w'); f.puts 'x'` のような書き方は、例外が出ると close されないままになりリソースリーク・ロック残留の原因になる。例外ハンドリングが必要でも `File.open(path, 'w') do |f| ... end` のブロック形式に統一するのが安全。さらに大きなファイルを `File.read` で一括読み込むとメモリを大量消費するので、ログのような巨大ファイルは `File.foreach` で 1 行ずつ処理する。",
      },
      codeExample:
        '# 書き込み (自動 close)\nFile.open("data.txt", "w") do |f|\n  f.puts "line1"     # 改行つき\n  f.print "line2"    # 改行なし\nend\n\n# 1 行ずつ読み込み (大きいファイル向け)\nFile.foreach("data.txt") do |line|\n  puts line.chomp\nend\n\n# 一括\ncontent = File.read("data.txt")\nlines   = File.readlines("data.txt")  # 行配列',
      commonMistakes: [
        "ブロック無しで `File.open` してから close 忘れはリソースリークの定番。常にブロック付きで書く。",
        "大きいファイルを `File.read` で一括読みするとメモリを大量消費する。行処理なら `File.foreach`。",
      ],
      references: [
        {
          label: "Ruby 公式リファレンス: File クラス",
          url: "https://docs.ruby-lang.org/ja/latest/class/File.html",
        },
        {
          label: "Ruby 公式リファレンス: IO#puts / IO#print / IO#write",
          url: "https://docs.ruby-lang.org/ja/latest/method/IO/i/puts.html",
        },
      ],
    },
  },
  {
    id: "rb-026",
    categoryId: "ruby-basics",
    difficulty: "intermediate",
    type: "choice",
    question: "Ruby で環境変数 PATH を取得する正しい書き方は？",
    choices: [
      "ENV['PATH']",
      "ENV.PATH",
      "$ENV[:PATH]",
      "Environment.get('PATH')",
    ],
    answerIndex: 0,
    choiceExplanations: [
      "正解。ENV は『Hash のような特殊オブジェクト』で、文字列キーを `[]` で渡してアクセスする。シンボルキーは不可。",
      "ENV はメソッドベースの API を持たない。`.PATH` のような構文では取れない。",
      "`$ENV` という特殊変数は Ruby に存在しない。グローバル変数は `$」で始まるが、環境変数は ENV が担当する。",
      "Environment クラスや `.get` メソッドは Ruby 標準にない。Java の `System.getenv` の感覚で書くとハマる。",
    ],
    hints: [
      "`ENV` は擬似 Hash オブジェクト。",
      "`[]` でアクセスする。",
      "メソッドアクセス (`.PATH`) でも特殊変数 (`$`) でもなく、Hash 風に文字列キーで取り出す書き方が正解。",
    ],
    explanation: {
      summary:
        "`ENV` は環境変数を扱う特殊な Hash 様オブジェクト。`ENV['KEY']` でアクセス。",
      reason:
        "`ENV[key]` で取得 (無ければ nil)、`ENV[key] = val` で設定、`ENV.fetch(key)` で必須化、`ENV.to_h` で Hash 化。`.env` ファイルで管理するなら dotenv gem を使うのが定番。",
      beginnerExplanation:
        "Ruby で OS の環境変数 (`PATH`, `HOME`, `DATABASE_URL` など) にアクセスするには **`ENV`** という特殊なグローバル定数を使います。\n\n`ENV` は **Hash のように振る舞うオブジェクト** で、文字列キーで `[]` アクセスします:\n```ruby\nENV['PATH']         # 取得 (見つからなければ nil)\nENV['NEW_VAR'] = 'x'  # 設定 (現在プロセスのみ有効)\n```\n\n**重要な使い分け**:\n- `ENV['KEY']` → 無ければ nil (静かに失敗)\n- `ENV.fetch('KEY')` → 無ければ KeyError 例外 (必須項目に推奨)\n- `ENV.fetch('KEY', 'default')` → 無ければデフォルト値\n\n本番環境で必須の環境変数は **`fetch` を使う** のが安全です。`ENV['DATABASE_URL']` が nil のままアプリが起動すると、後で謎のエラーで落ちて原因究明が大変だからです。\n\n**Rails アプリでは secrets / credentials の方が推奨** されます。Rails 5.2+ の `Rails.application.credentials` は暗号化済みファイルで秘密情報を管理でき、API キーやパスワードを安全にバージョン管理できます。環境変数はそれが使えないコンテナ環境などの本番設定で使う、というのが現代的な棲み分けです。",
      modelSelfExplanation: {
        conclusion:
          "正解は `ENV['PATH']`。ENV は Ruby が用意した Hash 様オブジェクトで、文字列キーを `[]` で渡して環境変数を読み書きする。",
        reason:
          "ENV は『プロセス起動時の環境変数をラップした擬似 Hash』で、`[]` / `[]=` / `each` / `to_h` などの Hash 風 API を提供する。シンボルキーや method-style アクセス (`ENV.PATH`) はサポートされず、必ず String キーで `[]` を使う。これは ENV が OS の環境変数ストア (C 文字列) を直接バックエンドにしているための制約。",
        example:
          "実務では DB 接続文字列を `DATABASE_URL = ENV.fetch('DATABASE_URL')`、Redis URL を `ENV.fetch('REDIS_URL', 'redis://localhost:6379/0')`、外部 API キーを `Stripe.api_key = ENV.fetch('STRIPE_SECRET_KEY')` のように受け取る。dotenv gem を使うと `.env` ファイルを開発環境で読み込めて、本番では実環境変数が使われるという定石。",
        pitfall:
          "`ENV['KEY']` は無いと nil を返すので、後で NoMethodError が出るまで気付かない。本番で必須の値は `ENV.fetch('KEY')` で起動時に明示的にコケるようにする。さらに ENV にシークレットを入れて Slack やログに `inspect` してしまうリークも頻発するので、Rails credentials などの暗号化された格納先を併用するのが現代的。",
      },
      codeExample:
        'ENV["PATH"]                 # 取得 (nil 可)\nENV.fetch("DATABASE_URL")   # 無ければ例外\nENV.fetch("RAILS_ENV", "development")  # デフォルト指定\n\n# 全環境変数\nENV.to_h\n\n# 設定 (現在プロセスのみ)\nENV["FOO"] = "bar"\n\n# Rails の credentials を使う方がベター\nRails.application.credentials.aws[:key]',
      commonMistakes: [
        "`ENV['KEY']` で nil を許すと後で謎の NoMethodError になる。必須は `ENV.fetch('KEY')`。",
        "ENV はシンボルキー (`:PATH`) では引けない。必ず文字列キーで。",
      ],
      references: [
        {
          label: "Ruby 公式リファレンス: ENV",
          url: "https://docs.ruby-lang.org/ja/latest/class/ENV.html",
        },
        {
          label: "Rails Guides: Configuring credentials (公式 Rails)",
          url: "https://guides.rubyonrails.org/security.html#environmental-security",
        },
      ],
    },
  },
  {
    id: "rb-027",
    categoryId: "ruby-basics",
    difficulty: "advanced",
    type: "choice",
    question: "次のコードの出力は？",
    code: 'begin\n  raise StandardError, "first"\nrescue => e\n  raise ArgumentError, "second"\nrescue ArgumentError => e\n  puts "caught: #{e.message}"\nend',
    choices: [
      "caught: second",
      "caught: first",
      "ArgumentError: second (uncaught)",
      "何も出力されない",
    ],
    answerIndex: 2,
    choiceExplanations: [
      "rescue ブロック内で再 raise した例外は、同じ begin に並んでいる別の rescue 句では拾われない。同じ begin の rescue 句は『begin 本体で出た例外』だけが対象。",
      "first は最初の rescue で受け取られ、その中で別の例外を raise しているので first が puts されることはない。",
      "正解。最初の rescue 句内で `raise ArgumentError` が出るが、同じ begin の 2 つ目の rescue では拾えず外側に伝播する。begin の外に補捉する仕組みが無ければ未捕捉のまま終了する。",
      "ArgumentError が外側に伝播するので、何も出力されないのではなく『未捕捉例外』としてプログラムが落ちる。",
    ],
    hints: [
      "rescue 句は上から順に評価される。",
      "最初の rescue で StandardError を捕捉、その中で再 raise。",
      "rescue ブロックの中で再 raise した例外は、同じ begin に並んでいる別の rescue 句では拾われず、外側に抜けていきます。",
    ],
    explanation: {
      summary:
        "rescue 句内で発生/再 raise された例外は、同じ begin の他の rescue では捕捉されず外側に伝播する。",
      reason:
        "begin/rescue は『rescue で捕まえる対象は begin 本体のみ』。rescue 句の中で再 raise すると、そのまま外に飛ぶ (同じ begin の他の rescue には行かない)。第2のArgumentError → 未捕捉のまま外へ。",
      beginnerExplanation:
        "Ruby の `begin / rescue` の **スコープルール** を理解しているか問う問題です。\n\n大事なのは: **rescue 句がカバーするのは「begin 本体」だけ。同じ begin に並んでいる別の rescue 句の中で出た例外は、その rescue 自身では拾えない**。\n\nコードの流れを追いましょう。\n\n1. `begin` 本体で `raise StandardError, 'first'` が出る。\n2. 1 つ目の `rescue => e` がこれを捕まえる (引数省略 = StandardError をデフォルトで捕捉)。\n3. その rescue 句の中で `raise ArgumentError, 'second'` を新たに発生させる。\n4. **ここで Ruby は『同じ begin の別の rescue 句にも見せる』とはしない**。rescue 内で出た例外はそのまま **外側に伝播** する。\n5. 外側に他の begin/rescue が無いので、プログラムは **未捕捉例外** で落ちる。\n\nこの設計の理由は『無限ループ回避』。rescue で出た例外を同じ begin で延々と捕まえ続けるとデバッグ困難なループになるので、Ruby は『rescue は begin 本体専用』というシンプルなルールに統一しています。\n\n**もし 2 段階で捕まえたい場合** は、内側にもう 1 つ begin/rescue を作って入れ子にします:\n```ruby\nbegin\n  begin\n    raise 'first'\n  rescue => e\n    raise ArgumentError, 'second'\n  end\nrescue ArgumentError => e\n  puts \"caught: #{e.message}\"\nend\n```\nこれなら 'caught: second' が出力されます。",
      modelSelfExplanation: {
        conclusion:
          "出力は無く ArgumentError が未捕捉のまま外へ伝播する。rescue 句の中で raise した例外は、同じ begin に並ぶ他の rescue 句では拾えず、外側に抜けていく仕様だから。",
        reason:
          "Ruby の begin/rescue のスコープは『rescue が捕捉する対象は begin 本体だけ』というシンプルなルール。rescue 句自体は『例外処理のためのコード』であって、そこで新たに raise された例外は同じ begin の別の rescue にも else にも届かない。これにより rescue 句が連鎖的に発火する難読化を避け、例外伝播の流れを直感的に保っている。2 段階で捕まえたければ begin を入れ子にするのが正しい書き方。",
        example:
          "例外をラップして再 raise する Rails のサービスオブジェクトで頻出: 内側で `rescue ActiveRecord::RecordNotFound => e; raise NotFoundError.new('user gone', cause: e); end` のように包んで上に渡し、外側のコントローラの begin/rescue で捕まえる、というレイヤード設計。raise した例外には `cause` (元の例外) が自動でぶら下がり、ログには両方が出る。",
        pitfall:
          "rescue 内での raise が同じ begin の他の rescue で捕まえられると勘違いすると、例外が握りつぶされたり想定外の例外型が外に飛んでサービス全体を巻き込む。さらに `rescue Exception` (StandardError ではなく Exception を捕捉) のような乱用は SignalException や SystemExit まで吸ってしまい、Ctrl-C で止められないバグの原因。原則『StandardError とそのサブクラス』だけを rescue する。",
      },
      codeExample:
        'begin\n  begin\n    raise "first"\n  rescue => e\n    raise ArgumentError, "second"\n  end\nrescue ArgumentError => e\n  puts "caught: #{e.message}"   # caught: second\nend\n\n# 例外チェーンを保持\nbegin\n  raise OriginalError\nrescue => e\n  raise NewError, "wrapped"     # e が e.cause として保持される\nend',
      commonMistakes: [
        "同じ begin の rescue 連鎖で捕まえられると思い込んでバグの温床に。2 段階補捉が必要なら begin を入れ子にする。",
        "`rescue Exception` は SignalException や SystemExit まで捕まえてしまう。原則 `StandardError` 系のみに限定する。",
      ],
      references: [
        {
          label: "Ruby 公式リファレンス: 例外処理 (begin/rescue)",
          url: "https://docs.ruby-lang.org/ja/latest/doc/spec=2fcontrol.html#begin",
        },
      ],
    },
  },
  {
    id: "rb-028",
    categoryId: "ruby-basics",
    difficulty: "advanced",
    type: "text",
    question:
      "Ruby のすべての標準例外クラスの『推奨される共通親』 (Exception ではなく、ユーザーがアプリで rescue すべきデフォルトの親) のクラス名は？(英語、PascalCase)",
    answers: ["StandardError"],
    hints: [
      "`rescue` を class 指定なしで書いた時のデフォルト捕捉範囲。",
      "Exception > StandardError > RuntimeError などの階層。",
      "Exception の直下にある『標準』な親クラスで、PascalCase の 2 単語 (Standard + Error) を連結した名前です。",
    ],
    explanation: {
      summary:
        "rescue のデフォルト捕捉対象は StandardError。Exception を直接 rescue するのは厳禁。",
      reason:
        "Exception の直下には SystemExit (exit時)、Interrupt (Ctrl-C)、NoMemoryError、SignalException など『プログラム制御に関わる重要例外』が含まれる。これらを rescue するとアプリが落ちないバグを生む。アプリ用のカスタム例外も `< StandardError` で定義する。",
      beginnerExplanation:
        "Ruby の例外クラスは木構造になっています。トップに `Exception` があり、その下に色々な例外が並びます。\n\n```\nException\n├── SystemExit         (exit 時)\n├── SignalException    (シグナル)\n│    └── Interrupt     (Ctrl-C)\n├── NoMemoryError\n├── ScriptError        (文法エラー系)\n└── StandardError      ← ★ アプリで扱う共通の親\n     ├── RuntimeError  (raise 'msg' のデフォルト)\n     ├── ArgumentError\n     ├── TypeError\n     ├── ZeroDivisionError\n     └── ...\n```\n\n**重要なルール**: アプリのコードで `rescue` するときは **必ず `StandardError` 以下** を対象にする。`Exception` を直接 rescue してはいけない。\n\nなぜなら `Exception` 直下にある `SystemExit` (`exit` 呼び出し)、`SignalException` (`Ctrl-C`)、`NoMemoryError` などは『プログラムの制御に関わる特別な例外』で、アプリが勝手に握りつぶしてはいけないものだから。`rescue Exception` を書くと Ctrl-C でアプリが止まらなくなって、運用上の悪夢になります。\n\n```ruby\n# 良い例\nrescue => e          # = rescue StandardError => e (デフォルト)\nrescue StandardError => e\nrescue ArgumentError => e\n\n# ダメな例\nrescue Exception => e  # ← Ctrl-C や exit も握りつぶす!\n```\n\n**自作の例外クラス** も必ず `< StandardError` で定義します:\n```ruby\nclass MyAppError < StandardError; end\nclass InvalidInputError < MyAppError; end\n```\n\nこうしておけば、`rescue MyAppError => e` でアプリ固有の例外群をひとまとめに捕まえられて、他のシステム例外と混同しません。",
      modelSelfExplanation: {
        conclusion:
          "推奨される共通親は `StandardError`。Ruby の例外階層では Exception の直下にあり、`rescue` 句の引数省略時のデフォルト捕捉対象でもある。",
        reason:
          "Exception の直下には SystemExit / Interrupt (Ctrl-C) / NoMemoryError / SignalException など『プログラム制御に関わるシステム例外』が並んでおり、これらを安易に rescue するとアプリが止まらない・終了処理が走らないといった重大なバグになる。StandardError はこうした制御系例外を除いた『アプリで起こりうる通常のエラー』をまとめる中継クラスとして用意されており、ユーザコードで捕捉すべき正しいレベル。さらに `rescue` の引数を省略するとデフォルトで StandardError が指定された扱いになるので、安全側に倒れる設計。",
        example:
          "Rails のサービス層で独自の業務例外を作るとき `class PaymentFailedError < StandardError; end`、`class InvalidStateError < StandardError; end` のように StandardError を継承する。コントローラやジョブで `rescue_from PaymentFailedError, with: :handle_payment_failure` のような捕捉を書ける。逆に rake タスクで `begin ... rescue Exception => e` と書いてしまうと、Ctrl-C で止められないジョブが量産される。",
        pitfall:
          "ライブラリの中にはあえて Exception を直接継承する例外もある (例: Sidekiq の `Sidekiq::Shutdown` は SignalException 系)。これらは『アプリで rescue してはいけない』というシグナルなので、`rescue StandardError` に絞ることで自然に除外できる。さらに自作例外を Exception 直下に置くと利用者が StandardError 捕捉から漏らしてしまうので、必ず StandardError 系に置く。",
      },
      codeExample:
        "# 良い例\nclass MyError < StandardError; end\n\n# rescue StandardError (引数省略時のデフォルト)\nbegin\n  ...\nrescue => e          # = rescue StandardError => e\n  log(e)\nend\n\n# ダメな例 (Ctrl-C も捕まえてしまう)\nbegin\n  ...\nrescue Exception => e    # NG\nend",
      commonMistakes: [
        "`rescue Exception` は SystemExit / Interrupt / NoMemoryError まで捕まえる。原則 StandardError 以下のみ。",
        "自作例外を Exception 直下に置くと利用者が StandardError 捕捉から漏らす。必ず StandardError 系に。",
      ],
      references: [
        {
          label: "Ruby 公式リファレンス: Exception クラス階層",
          url: "https://docs.ruby-lang.org/ja/latest/class/Exception.html",
        },
        {
          label: "Ruby 公式リファレンス: StandardError",
          url: "https://docs.ruby-lang.org/ja/latest/class/StandardError.html",
        },
      ],
    },
  },
  {
    id: "rb-029",
    categoryId: "ruby-basics",
    difficulty: "advanced",
    type: "choice",
    question: "次のコードの出力は？",
    code: 'puts "hello"[0..2]\nputs "hello"[-3..]\nputs "hello"[1, 3]',
    choices: [
      "hel / llo / ell",
      "hel / llo / llo",
      "ell / hel / llo",
      "hel / hello / ell",
    ],
    answerIndex: 0,
    choiceExplanations: [
      "正解。[0..2] が index 0〜2 で 'hel'、[-3..] が末尾から 3 文字 'llo'、[1,3] が index 1 から 3 文字 'ell'。",
      "3 つ目は (start, length) の形なので、index 1 から 3 文字 = 'ell' になる。'llo' は -3 から 3 文字の場合。",
      "1 つ目は Range なので index 0〜2、つまり 'hel'。'ell' は 1 始まりで 3 文字を指定したときの結果。",
      "2 つ目 `[-3..]` は『-3 から末尾まで』の Range なので 'llo' の 3 文字。'hello' 全体にはならない。",
    ],
    hints: [
      "`str[range]` で部分文字列。",
      "`str[start, length]` で開始位置 + 長さ。",
      "負のインデックスは末尾から。",
    ],
    explanation: {
      summary:
        "String のスライス: [start..end] / [start..]/ [start, length] / [-n..]。",
      reason:
        "Ruby の文字列スライスは Range と (start, length) の両方をサポート。`[-3..]` は末尾から 3 文字 (... の終了側省略で末尾まで)。`[1, 3]` は index 1 から 3 文字。",
      beginnerExplanation:
        "Ruby の文字列スライス (部分取得) には **3 つの書き方** があります。一度覚えると一気に表現力が上がります。\n\n**1. Range で範囲指定** `s[start..end]`\n`'hello'[0..2]` → index 0, 1, 2 = `'hel'`。`..` は両端を含む、`...` は終端を除く (`0...3` も 'hel')。\n\n**2. 開始位置 + 長さ** `s[start, length]`\n`'hello'[1, 3]` → index 1 から 3 文字 = `'ell'`。Range より直感的に書ける場面が多い。\n\n**3. 負のインデックス** で末尾から数える\n`'hello'[-3..]` → 末尾から 3 番目 (index 2 の 'l') から最後まで = `'llo'`。Ruby 2.6+ で導入された **endless range** (`-3..`) を使うと『末尾まで』を簡潔に書ける。\n\n他にも:\n- `s[10]` → nil (範囲外でもエラーにならない)\n- `s[/l+/]` → 正規表現マッチした部分 'll'\n- `s[/(\\w)\\w/, 1]` → 正規表現の第 1 キャプチャ 'h'\n- `s[0]` → 1 文字 'h' (Ruby 1.9+ では文字、それ以前は文字コード)\n\nRange と (start, length) の使い分けは『開始と終了が分かっているか、開始と長さが分かっているか』で選びます。配列スライスもほぼ同じ仕様 (`arr[0..2]`, `arr[1, 3]`) なので、文字列も配列も同じ感覚で扱えます。",
      modelSelfExplanation: {
        conclusion:
          "出力は `hel / llo / ell`。Ruby の String#[] は Range・開始位置+長さ・負のインデックスなど複数の指定方法を持ち、それぞれ違う部分を返す。",
        reason:
          "Ruby の String#[] は柔軟な多態 API で、引数の種類に応じて挙動を切り替える: Integer 1 つなら 1 文字、Range なら範囲、Integer 2 つなら (開始, 長さ)、Regexp ならマッチした部分、Regexp + Integer ならキャプチャグループ。負のインデックスは末尾を起点とし、endless range (`-3..`) は『そこから末尾まで』を意味する。これにより 1 つのメソッドで多様な切り出しパターンを表現でき、Array#[] とも仕様が揃っているため学習コストが低い。",
        example:
          "実務では文字列の頭 N 文字でログを省略 (`message[0, 100]`)、末尾のファイル拡張子取得 (`filename[/\\.\\w+\\z/]`)、URL のパス部分抽出、ハッシュタグやメンションのトリミングなどで多用される。Rails の view ヘルパー `truncate` も内部的にはこうしたスライスを使う。",
        pitfall:
          "範囲外を Range で指定すると nil ではなく『可能な範囲だけ』を返す挙動が直感に反することがある (`'abc'[1..10]` → 'bc')。さらに『1 文字取得』と『1 要素配列取得』の違いに注意: `'abc'[0]` は 'a' (文字) だが、Ruby 1.8 以前は ASCII コード 97 が返る古い挙動があった (現在は廃止)。マルチバイト文字を扱う場面では byte 単位 vs 文字単位の混同 (byteslice vs []) にも注意。",
      },
      codeExample:
        's = "hello"\ns[0..2]       #=> "hel"\ns[0..]        #=> "hello"\ns[-3..]       #=> "llo"\ns[1, 3]       #=> "ell"\ns[10]         #=> nil  (範囲外)\ns[/l+/]       #=> "ll" (正規表現マッチ)\ns[/(\\w)\\w/, 1] #=> "h" (キャプチャ)',
      commonMistakes: [
        "Range で範囲外を指定すると nil ではなく『可能な部分のみ』が返る。`'abc'[1..10]` → 'bc'。",
        "マルチバイト文字列で byte 単位の操作が必要なら `byteslice` を使う。`[]` は文字単位。",
      ],
      references: [
        {
          label: "Ruby 公式リファレンス: String#[] (slice)",
          url: "https://docs.ruby-lang.org/ja/latest/method/String/i/=5b=5d.html",
        },
      ],
    },
  },
  {
    id: "rb-030",
    categoryId: "ruby-basics",
    difficulty: "advanced",
    type: "choice",
    question:
      "Ruby の Integer の特殊なメソッド `times` は何回ブロックを実行する？",
    code: "5.times { |i| puts i }",
    choices: ["0,1,2,3,4 の 5 回", "1,2,3,4,5 の 5 回", "0,1,2,3,4,5 の 6 回", "実行されない"],
    answerIndex: 0,
    choiceExplanations: [
      "正解。`n.times` は 0 から n-1 までの整数を順にブロック変数に渡す。配列インデックスと同じ 0 始まり。",
      "1 始まりにしたいなら `1.upto(5)` を使う。`5.times` は 0 始まりで n 回。",
      "6 回ではない。5.times は『n 回』なのできっちり 5 回。0..4 で 5 つ。",
      "5 は 0 より大きいのでブロックは実行される。0 や負数のときに限り 0 回 (実行されない)。",
    ],
    hints: [
      "`n.times` は n 回繰り返す。",
      "ブロック変数は 0 から n-1 まで。",
      "配列のインデックスと同じく 0 始まりで、ブロックには n 個分の連番が順に渡されます。",
    ],
    explanation: {
      summary:
        "`n.times { |i| ... }` は 0..n-1 を i に渡してブロックを n 回実行。",
      reason:
        "Integer の繰り返しイディオム。`upto` `downto` `step` も類似。Ruby らしいコンパクトな書き方。",
      beginnerExplanation:
        "`n.times` は **「n 回繰り返す」** の最短表記です。Ruby らしい『数値自身がメソッドを持つ』設計が表れた典型例です。\n\n```ruby\n5.times { |i| puts i }\n# 0\n# 1\n# 2\n# 3\n# 4\n```\n\nブロック変数 `i` には 0, 1, 2, ... と **0 始まりで n-1 まで** が順に入ります。配列のインデックスと同じ感覚で、ループカウンタを別途用意しなくて済みます。\n\n**仲間のメソッド** (Integer の繰り返しイディオム):\n- `n.times` → 0 から n-1 (n 回)\n- `m.upto(n)` → m から n (n - m + 1 回)\n- `m.downto(n)` → m から n まで降順\n- `m.step(n, step)` → m から n まで step 刻み\n\n```ruby\n3.times { |i| puts i }       # 0, 1, 2\n1.upto(3) { |i| puts i }     # 1, 2, 3\n3.downto(1) { |i| puts i }   # 3, 2, 1\n1.step(10, 2) { |i| puts i } # 1, 3, 5, 7, 9\n```\n\n他の言語の `for i in 0..n-1` や `while` で書きがちなループを 1 行で表現できるのが Ruby らしいところ。さらに `Array.new(n) { |i| ... }` も同じパターンで、n 要素の配列を初期化できます: `Array.new(3) { |i| i * 2 }` → `[0, 2, 4]`。\n\n**回数自体が要らない繰り返し** (副作用だけ) なら `5.times { do_something }` のようにブロック変数を省略します。",
      modelSelfExplanation: {
        conclusion:
          "`5.times { |i| puts i }` は 0, 1, 2, 3, 4 の 5 回ブロックを実行する。`n.times` は 0 から n-1 までの整数を順にブロック変数に渡す Integer の繰り返しメソッド。",
        reason:
          "Ruby は『数値もオブジェクト』という設計で、Integer 自体にループ系メソッド (times / upto / downto / step) を持たせている。`times` は内部的に 0 から n-1 まで Enumerator として列挙する仕組みで、ブロックを渡せばその回数だけ実行し、ブロックを省略すれば Enumerator が返るので map / each_with_index と組み合わせた関数的な書き方もできる。0 始まりなのは配列インデックスと整合性を取るためで、Ruby の他のイテレータ (each_with_index など) とも歩調を揃えている。",
        example:
          "リトライ処理 `3.times { try || break }`、テストデータ生成 `Array.new(5) { |i| User.new(name: \"u#{i}\") }`、画面の空行出力 `n.times { puts }`、進捗バーの単純カウントアップなど、ループ回数が事前に分かっている場面で頻出。Rails では `5.times { Post.create!(title: 'sample') }` のように seed データ作成にもよく使う。",
        pitfall:
          "0 以下を渡すとブロックは実行されない (`0.times { puts 1 }` は何も出ない、`-3.times` も同様)。1 始まりの繰り返しをしたい場面で `(1..n).each` と書く方が読みやすい場合もある。逆に『回数を後で変える可能性がある』『コレクションが既にある』なら `array.each` で十分なので times に固執しない。",
      },
      codeExample:
        '3.times { |i| puts i }       # 0, 1, 2\n1.upto(3) { |i| puts i }     # 1, 2, 3\n3.downto(1) { |i| puts i }   # 3, 2, 1\n1.step(10, 2) { |i| puts i } # 1, 3, 5, 7, 9\n\n# Array.new も times パターン\nArray.new(3) { |i| i * 2 }   #=> [0, 2, 4]',
      commonMistakes: [
        "0 以下を渡すとブロックは実行されない。負数で謎の挙動になるなら値の事前チェックを忘れない。",
        "1 始まりが欲しいなら `1.upto(n)` か `(1..n).each` を使う。`(0...n).each { |i| ... i + 1 }` のように調整して書くと読みにくい。",
      ],
      references: [
        {
          label: "Ruby 公式リファレンス: Integer#times",
          url: "https://docs.ruby-lang.org/ja/latest/method/Integer/i/times.html",
        },
        {
          label: "Ruby 公式リファレンス: Integer#upto / #downto / #step",
          url: "https://docs.ruby-lang.org/ja/latest/class/Integer.html",
        },
      ],
    },
  },

  // ===========================================================================
  // Ruby 上級 追加 (Gold 対策: メタプロ詳細・パターンマッチ) 8問
  // ===========================================================================
  {
    id: "adv-015",
    categoryId: "ruby-advanced",
    difficulty: "advanced",
    type: "choice",
    question: "次のコードの出力は？",
    code: 'class Foo\nend\n\nfoo = Foo.new\nfoo.instance_eval do\n  @bar = 42\nend\nputs foo.instance_variable_get(:@bar)',
    choices: ["42", "nil", "NameError", "0"],
    answerIndex: 0,
    hints: [
      "`instance_eval` はレシーバの self を切り替えてブロックを実行。",
      "ブロック内の `@bar` は foo のインスタンス変数。",
      "instance_eval ブロック内で self が foo に切り替わるため、`@bar = 42` の代入が後で `foo.instance_variable_get` で取り出せる値になります。",
    ],
    explanation: {
      summary:
        "`instance_eval` はオブジェクトの内部状態を直接操作するメタプロの定番。",
      reason:
        "ブロックの self を一時的にレシーバに切り替えるため、`@xxx` でインスタンス変数を直接操作できる。RSpec の `describe ... do` や DSL の実装に多用。`class_eval` (= module_eval) はクラスの定義スコープに入る。",
      codeExample:
        'class Empty; end\n\ne = Empty.new\ne.instance_eval do\n  @name = "Alice"\n  def shout              # 特異メソッド定義\n    "HI"\n  end\nend\n\ne.instance_variable_get(:@name)  #=> "Alice"\ne.shout                          #=> "HI"\n\n# class_eval (クラス本体の中に入る)\nClass.new.class_eval do\n  define_method(:greet) { "hi" }\nend',
    },
  },
  {
    id: "adv-016",
    categoryId: "ruby-advanced",
    difficulty: "advanced",
    type: "choice",
    question: "次のコードの出力は？",
    code: "class Foo\n  def secret\n    'shh'\n  end\n  private :secret\nend\n\nputs Foo.new.send(:secret)",
    choices: ["shh", "NoMethodError", "nil", "secret"],
    answerIndex: 0,
    hints: [
      "`send` は private メソッドも呼べる。",
      "`public_send` だと public のみ。",
      "send は可視性を無視して呼べるので、private メソッドの戻り値がそのまま得られます。NoMethodError にはなりません。",
    ],
    explanation: {
      summary:
        "`send` は private/protected も無視して呼べる。public しか呼ばないなら `public_send`。",
      reason:
        "`send` はメタプロ用に強力に設計されており、可視性をバイパスする。意図せずカプセル化を破壊する可能性があるため、外部から呼ぶなら `public_send` を使うのが安全。",
      codeExample:
        'class Foo\n  private\n  def secret; "shh"; end\nend\n\nFoo.new.secret              # NoMethodError (private)\nFoo.new.send(:secret)       #=> "shh" (バイパス)\nFoo.new.public_send(:secret) # NoMethodError (尊重)\n\n# 動的にメソッド名を組み立てて呼び出すパターン\nattrs.each do |a|\n  obj.public_send("#{a}=", values[a])\nend',
    },
  },
  {
    id: "adv-017",
    categoryId: "ruby-advanced",
    difficulty: "advanced",
    type: "text",
    question:
      "オブジェクトに対して『そのオブジェクトだけに有効なメソッド』を実行時に追加する仕組みの名称は？(カタカナ、〇〇メソッド)",
    answers: [
      "特異メソッド",
      "特異メソッド (singleton method)",
      "Singleton Method",
      "singleton method",
    ],
    hints: [
      "クラス全体ではなく、特定のインスタンスに対してだけ追加できるメソッド。",
      "`def obj.method_name` または `obj.define_singleton_method(:name) { ... }`。",
      "英語名は『Singleton Method』。日本語訳は『〇〇メソッド』の形で、〇〇の部分は『特殊で唯一』を意味する漢字 2 文字です。",
    ],
    explanation: {
      summary:
        "特異メソッド (Singleton Method) は特定オブジェクトだけに定義されるメソッド。",
      reason:
        "Ruby ではすべてのオブジェクトが暗黙の特異クラス (singleton class) を持つ。`def obj.foo` で定義したメソッドはこの特異クラスに入る。クラスメソッドも実はクラスオブジェクトの特異メソッド。",
      codeExample:
        'str = "hello"\ndef str.shout\n  upcase + "!!"\nend\nstr.shout         #=> "HELLO!!"\n"other".shout     # NoMethodError\n\n# 別の書き方\nstr.define_singleton_method(:greet) { "hi" }\n\n# クラスメソッドも特異メソッド\nclass Foo\n  def self.bar; end   # Foo の特異メソッド\nend\nFoo.singleton_class.instance_methods(false)\n#=> [:bar]',
    },
  },
  {
    id: "adv-018",
    categoryId: "ruby-advanced",
    difficulty: "advanced",
    type: "choice",
    question: "次のコードの出力は？",
    code: "module Loggable\n  def self.included(base)\n    puts \"included into #{base}\"\n    base.extend(ClassMethods)\n  end\n\n  module ClassMethods\n    def class_meth\n      'class!'\n    end\n  end\nend\n\nclass User\n  include Loggable\nend\n\nputs User.class_meth",
    choices: [
      "included into User / class!",
      "class!",
      "NoMethodError",
      "included into User",
    ],
    answerIndex: 0,
    hints: [
      "`self.included(base)` はクラスに include された瞬間に呼ばれるフック。",
      "中で `base.extend(ClassMethods)` してクラスメソッドを追加。",
      "include の瞬間にフックで `puts` が走り、その後 ClassMethods のメソッド呼び出しも成功するので、出力は 2 行になります。",
    ],
    explanation: {
      summary:
        "`included` フックで base.extend(ClassMethods) するのが、include だけでクラスメソッドも入れる Rails 流のパターン。",
      reason:
        "Module には include / extend / prepend のフック (`included` / `extended` / `prepended`) が用意されている。Rails の Concern (`extend ActiveSupport::Concern`) はこれを綺麗に書ける糖衣構文を提供する。",
      codeExample:
        'module Trackable\n  extend ActiveSupport::Concern  # Rails 流\n\n  included do\n    scope :recent, -> { order(created_at: :desc) }  # クラスメソッド扱い\n  end\n\n  def track!                  # インスタンスメソッド\n    update(tracked_at: Time.current)\n  end\n\n  class_methods do\n    def archived\n      where.not(archived_at: nil)\n    end\n  end\nend',
    },
  },
  {
    id: "adv-019",
    categoryId: "ruby-advanced",
    difficulty: "advanced",
    type: "choice",
    question: "次のコードの出力は？",
    code: "case { user: { name: 'Alice', age: 20 }, role: 'admin' }\nin { user: { name: String => n }, role: 'admin' }\n  puts \"admin: #{n}\"\nin { user: { name: String => n } }\n  puts \"user: #{n}\"\nend",
    choices: ["admin: Alice", "user: Alice", "NoMatchingPatternError", "nil"],
    answerIndex: 0,
    hints: [
      "Ruby 3.0+ のパターンマッチング。",
      "ネスト Hash 構造を一気に分解 + 型チェック + 値マッチ。",
      "case/in の各節を上から順に試して最初にマッチするのはどこか、入力 Hash の role 値と照らし合わせて判定してください。",
    ],
    explanation: {
      summary:
        "case/in はネスト Hash の構造分解 + 型チェック + 値マッチが一度に書ける強力構文。",
      reason:
        "Ruby 3.0 で正式導入された Pattern Matching。`String => n` は『String 型なら n に束縛』。`role: 'admin'` は値マッチ。マッチしない場合 `else` 無しだと NoMatchingPatternError。",
      codeExample:
        'response = { status: 200, body: { id: 1, name: "x" } }\n\ncase response\nin { status: 200..299, body: { id: Integer => id } }\n  puts "OK id=#{id}"\nin { status: 4.. , body: { error: String => msg } }\n  puts "error: #{msg}"\nin { status: }\n  puts "unknown status: #{status}"\nend\n\n# 配列の分解\ncase [1, 2, 3, 4]\nin [first, *rest]\n  [first, rest]   #=> [1, [2,3,4]]\nend',
    },
  },
  {
    id: "adv-020",
    categoryId: "ruby-advanced",
    difficulty: "advanced",
    type: "choice",
    question:
      "Ruby の Refinements (using) の最大の特徴は？",
    choices: [
      "ファイル/モジュールスコープ限定でクラスにメソッドを追加できる",
      "全プロセスでメソッドを追加",
      "クラスを動的に作成する",
      "クラスを削除する",
    ],
    answerIndex: 0,
    hints: [
      "モンキーパッチを限定スコープに閉じ込める。",
      "`refine Class do ... end` で定義、`using Module` で適用。",
      "通常のオープンクラス (= プロセス全体に波及) と違い、Refinements は `using` を書いた範囲だけに影響を閉じ込めるのが核心。",
    ],
    explanation: {
      summary:
        "Refinements (using) はモンキーパッチのスコープを限定する仕組み。",
      reason:
        "通常の `class String; def x; end; end` は全体に影響するが、Refinements は `using` した位置以降のスコープ (ファイル/モジュール) でのみ有効。標準ライブラリ拡張時の副作用を抑える。Gold 試験頻出。",
      codeExample:
        "module StringExt\n  refine String do\n    def shout\n      upcase + \"!!\"\n    end\n  end\nend\n\nclass MyClass\n  using StringExt\n  def call\n    \"hi\".shout   # OK\n  end\nend\n\n\"hi\".shout       # NoMethodError (スコープ外)",
    },
  },
  {
    id: "adv-021",
    categoryId: "ruby-advanced",
    difficulty: "advanced",
    type: "choice",
    question:
      "Fiber の主な用途として正しいものは？",
    choices: [
      "プロセス並列",
      "OS スレッド並列",
      "協調的なコルーチン (明示的に切り替える軽量実行単位)",
      "GC",
    ],
    answerIndex: 2,
    hints: [
      "Fiber = 軽量な実行単位。",
      "OS スレッドではなく、自分で `resume` `yield` で切り替える。",
      "ジェネレータや非同期 IO の基盤。",
    ],
    explanation: {
      summary:
        "Fiber は『手動で切り替える軽量コルーチン』。プリエンプトされず明示的に resume/yield。",
      reason:
        "Thread はプリエンプティブ (OS が自動で切り替える)、Fiber は協調的 (自分で切り替える)。Ruby 3.0+ の Fiber Scheduler により非同期 IO の基盤として活用 (Async gem 等)。",
      codeExample:
        'fib = Fiber.new do\n  Fiber.yield 1\n  Fiber.yield 2\n  3\nend\n\nfib.resume    #=> 1\nfib.resume    #=> 2\nfib.resume    #=> 3\nfib.resume    # FiberError: dead\n\n# 無限列生成 (lazy みたいに)\ncounter = Fiber.new do\n  n = 0\n  loop { Fiber.yield(n += 1) }\nend\n3.times { puts counter.resume }   # 1, 2, 3',
    },
  },
  {
    id: "adv-022",
    categoryId: "ruby-advanced",
    difficulty: "advanced",
    type: "choice",
    question: "次のコードの出力は？",
    code: 'puts "あいう".encoding\nputs "あいう".bytesize\nputs "あいう".length',
    choices: [
      "UTF-8 / 9 / 3",
      "ASCII-8BIT / 3 / 3",
      "UTF-8 / 3 / 3",
      "UTF-8 / 9 / 9",
    ],
    answerIndex: 0,
    hints: [
      "Ruby 文字列のデフォルトエンコーディングは UTF-8。",
      "ひらがな 1 文字は UTF-8 で 3 バイト。",
      "length は文字数、bytesize はバイト数。",
    ],
    explanation: {
      summary:
        "Ruby の String は『文字列 + エンコーディング』のセット。length は文字数、bytesize はバイト数。",
      reason:
        "Ruby M17N: 文字列ごとに encoding を持つ。`force_encoding` で再解釈、`encode` で変換。マルチバイトで `length != bytesize`、`each_char` で文字単位イテレート。",
      codeExample:
        's = "あいう"\ns.encoding      #=> #<Encoding:UTF-8>\ns.length        #=> 3 (文字数)\ns.bytesize      #=> 9 (バイト数)\ns.bytes         #=> [227,129,130,...]\ns.each_char.to_a #=> ["あ","い","う"]\n\n# エンコーディング変換\ns.encode("Shift_JIS")\ns.force_encoding("ASCII-8BIT")   # 再解釈 (バイト列は変わらず)',
    },
  },

  // ===========================================================================
  // ActiveRecord 追加 (実務頻出) 5問
  // ===========================================================================
  {
    id: "ar-019",
    categoryId: "active-record",
    difficulty: "intermediate",
    type: "choice",
    question:
      "ActiveRecord で `pluck(:id)` と `select(:id).map(&:id)` の違いは？",
    choices: [
      "pluck は値の配列を直接返す (高速)、select.map は AR オブジェクト経由",
      "両者は完全に同じ",
      "pluck は遅い",
      "select は使えない",
    ],
    answerIndex: 0,
    choiceExplanations: [
      "正解。`pluck` は SQL の SELECT 結果を直接 Ruby の配列に変換 (AR インスタンスを作らない)、`select.map` は AR インスタンスを作ってからメソッドを呼ぶので 2 倍くらい遅い。",
      "結果として同じ値が取れるが、内部の処理 (AR インスタンス生成の有無) が違うのでパフォーマンスは別物。",
      "逆。`pluck` の方が速い。AR インスタンスのオーバーヘッドがないため。",
      "select は使える。普通の Relation メソッドで、SELECT 句を絞るのが本来の用途。",
    ],
    hints: [
      "`pluck` は SELECT した値を Array で直接返す。",
      "`select` は AR インスタンスを返すのでオブジェクト生成のコスト。",
      "AR インスタンスを生成するコストの有無が、特に大量データを扱うときの性能差として現れます。",
    ],
    explanation: {
      summary:
        "pluck は値配列を直接返すので軽い。select.map は AR オブジェクトを作るので重い。",
      reason:
        "`pluck(:column)` は SQL の SELECT 結果を直接 Array にする。AR インスタンスを作らないので速く、メモリも少ない。複数カラムなら `pluck(:id, :name)` で配列の配列。プレ計算した値が欲しいだけの時に使う。",
      beginnerExplanation:
        "**`pluck`** は **『値だけ欲しい』ときの軽量版** メソッドです。\n\n**比較**:\n```ruby\n# ❌ 重い: AR インスタンスを 100 万個作る\nUser.select(:email).map(&:email)\n# 1. SELECT email FROM users\n# 2. 各行から User インスタンス生成 (100 万個)\n# 3. .email で属性を取り出す\n\n# ✅ 軽い: 直接配列\nUser.pluck(:email)\n# SELECT email FROM users\n# → [\"a@x\", \"b@y\", ...]\n```\n\n**速度差**: 大量データで **2〜10 倍** の差が出ます (AR インスタンス生成は意外と重い)。\n\n**使い方バリエーション**:\n```ruby\n# 1 カラム\nUser.pluck(:email)\n#=> ['a@x', 'b@y', ...]\n\n# 複数カラム → 配列の配列\nUser.pluck(:id, :name)\n#=> [[1, 'Alice'], [2, 'Bob'], ...]\n\n# 条件付き\nUser.where(active: true).pluck(:id)\n\n# 重複排除\nUser.distinct.pluck(:role)\n\n# 集計 (Arel.sql で生 SQL も書ける)\nUser.group(:role).pluck(:role, Arel.sql('COUNT(*)'))\n```\n\n**`pluck` を使うべき場面**:\n- ID リストだけ取りたい (`User.pluck(:id)` → 別クエリの WHERE id IN ...)\n- メアドだけ取りたい (`User.pluck(:email)` → メール一斉送信用)\n- 集計結果だけ取りたい\n\n**`pluck` を使ってはいけない場面**:\n- そのモデルのメソッドを呼びたい (`user.full_name`) → AR インスタンスが必要\n- 関連を辿りたい (`user.posts`) → AR インスタンスが必要\n- callback を実行したい\n\n**Tip**: `ids` メソッドは `pluck(:primary_key)` のショートカット:\n```ruby\nUser.where(active: true).ids  # [1, 5, 7, ...]\n```\n\n`Post.where(user_id: User.active.ids)` の代わりに `Post.where(user: User.active)` (サブクエリ) の方が DB 1 往復で済むので、必要に応じて使い分けます。",
      modelSelfExplanation: {
        conclusion:
          "`pluck` は SQL の SELECT 結果を **直接 Ruby の配列** に変換するので軽量・高速。`select.map` は AR インスタンスを 1 行ごとに生成してからメソッドを呼ぶため、オブジェクト生成のオーバーヘッドが大きい。",
        reason:
          "ActiveRecord のレコードは『DB の行 → User インスタンス』に変換するため、各属性を ActiveModel::Attributes 経由で型変換し、コールバックや dirty tracking の仕組みを初期化するオブジェクト生成のコストがかかる。大量データではこのオーバーヘッドが支配的になり、AR インスタンス不要 (値だけ欲しい) なら pluck で SQL → Ruby Array に直結する方が桁違いに速い。pluck は単一カラム → 値の配列、複数カラム → 配列の配列、distinct や group との組み合わせも対応する柔軟な API。",
        example:
          "メール一斉送信で『全アクティブユーザのメアドだけ』なら `User.active.pluck(:email)` で必要最低限を取得。N+1 を回避するために『関連先の ID 集合』を取りたいときは `Post.where(user_id: User.active.pluck(:id))` ではなく `Post.where(user: User.active)` のサブクエリ化が更に高速。集計レポートで『役割ごとのユーザ数』なら `User.group(:role).count` か `User.group(:role).pluck(:role, Arel.sql('COUNT(*)'))` で 1 クエリで完結。",
        pitfall:
          "pluck は AR インスタンスを作らないので、attribute の type cast (例: serialize した hash の復元) や callback がスキップされる。decimal カラムを pluck すると BigDecimal が返るが、`select.map(&:price)` だと Money 型として復元される、というような違いに注意。さらに pluck の結果に対して where 条件を後付けはできない (Array になっているため Relation メソッドが使えない)。大量データの処理では『pluck で ID だけ取得 → find_each で 1 件ずつ処理』のような 2 段構えも有効。",
      },
      codeExample:
        "User.pluck(:email)\n#=> [\"a@x\", \"b@y\", ...]\n# SELECT \"users\".\"email\" FROM \"users\"\n\nUser.pluck(:id, :name)\n#=> [[1, \"Alice\"], [2, \"Bob\"], ...]\n\n# 重複しない\nUser.distinct.pluck(:role)\n\n# pluck で COUNT などの式も書ける\nUser.group(:role).pluck(:role, Arel.sql('COUNT(*)'))",
      commonMistakes: [
        "pluck は AR コールバックや関連ロードをスキップする。オブジェクトとして扱いたい時は使えない。",
        "Arel.sql を使わない生 SQL は SQL Injection の温床になる。必ず Arel.sql でラップしてバインド変数を使う。",
      ],
      references: [
        {
          label: "Rails API: ActiveRecord::Calculations#pluck",
          url: "https://api.rubyonrails.org/classes/ActiveRecord/Calculations.html#method-i-pluck",
        },
      ],
    },
  },
  {
    id: "ar-020",
    categoryId: "active-record",
    difficulty: "intermediate",
    type: "choice",
    question:
      "ActiveRecord で `find_or_create_by` と `find_or_initialize_by` の違いは？",
    choices: [
      "find_or_create_by は無ければ DB に保存、find_or_initialize_by はメモリ上に new するだけ",
      "両者は同じ",
      "find_or_create_by は遅い",
      "find_or_initialize_by は廃止",
    ],
    answerIndex: 0,
    choiceExplanations: [
      "正解。`find_or_create_by` は『見つからなければ create (DB INSERT)』、`find_or_initialize_by` は『見つからなければ new (メモリ上のみ、save 未実行)』。",
      "保存するかしないかの根本的な違いがある。同じではない。",
      "速度の差ではなく『DB に保存するかしないか』が違い。",
      "find_or_initialize_by は現役の API。廃止されていない。",
    ],
    hints: [
      "「初期化のみ」と「保存まで」の違い。",
      "initialize は new と同等で .save が必要。",
      "create_by は内部で .create を呼ぶ。",
    ],
    explanation: {
      summary:
        "find_or_create_by は無ければ save、find_or_initialize_by は new するだけ (要 .save)。",
      reason:
        "find_or_create_by は便利だが race condition の可能性あり (DB 制約と組み合わせて RecordNotUnique を rescue するのが安全)。`find_or_create_by!` は失敗時に例外を投げる版。",
      beginnerExplanation:
        "**`find_or_*` 系メソッド** は『**取得 or 新規作成**』を 1 行で書ける便利メソッドです。\n\n**`find_or_create_by(条件)`** — 取得 or 保存\n```ruby\nuser = User.find_or_create_by(email: 'a@x.com')\n# 既にあればそれを返す\n# 無ければ User.create(email: 'a@x.com') して返す\n\n# 追加属性を渡したい場合はブロックで\nuser = User.find_or_create_by(email: 'a@x.com') do |u|\n  u.name = 'Alice'   # 新規作成時のみセット (取得時は呼ばれない)\nend\n```\n\n**`find_or_initialize_by(条件)`** — 取得 or メモリ上 new (未保存)\n```ruby\nuser = User.find_or_initialize_by(email: 'a@x.com')\n# 既にあればそれを返す\n# 無ければ User.new(email: 'a@x.com') して返す (まだ DB に保存されていない!)\n\nuser.name = 'Alice'\nuser.save  # 明示的に保存\n```\n\n**使い分け**:\n- すぐ保存したい → `find_or_create_by`\n- 追加情報を設定してから保存したい → `find_or_initialize_by` + `save`\n- 例外で気付きたい → `find_or_create_by!`\n\n**🚨 Race Condition の罠**:\nfind_or_create_by の内部実装は実は:\n1. `SELECT * FROM users WHERE email = 'a@x.com'`\n2. 無ければ `INSERT INTO users ...`\n\nプロセス A と B が同時実行すると、両方とも Step 1 で『無い』と判定 → 両方 INSERT → **重複データ**!\n\n**対策** — DB の UNIQUE 制約 + rescue:\n```ruby\nbegin\n  user = User.find_or_create_by(email: 'a@x.com')\nrescue ActiveRecord::RecordNotUnique\n  # 別プロセスが先に作成済み\n  user = User.find_by(email: 'a@x.com')\nend\n```\n\n**より安全な現代的 API**: Rails 6+ の `upsert`:\n```ruby\nUser.upsert({ email: 'a@x.com', name: 'Alice' }, unique_by: :email)\n# DB の ON CONFLICT を使うので race フリー (PG / MySQL 対応)\n```",
      modelSelfExplanation: {
        conclusion:
          "`find_or_create_by` は『見つからなければ create (DB INSERT)』、`find_or_initialize_by` は『見つからなければ new (メモリ上のみ、save が必要)』。前者はすぐ保存、後者は追加属性をセットしてから明示的に save。",
        reason:
          "ActiveRecord の find_or_* シリーズは『取得 or 新規』のイディオムを 1 行で書くための便利メソッド。create 版は内部で create を呼ぶので DB INSERT まで実行し戻り値は永続化済みオブジェクト、initialize 版は new のみで未保存オブジェクトを返すため、その後に validation や属性設定をしてから明示的に save する流れになる。両者とも内部的に『SELECT で検索 → 見つからなければ INSERT/new』という流れで、race condition (並行 INSERT) を防げないことに注意。",
        example:
          "ユーザのプロフィール作成で『初回アクセス時のみ作成、それ以降は取得』なら `Profile.find_or_create_by(user: current_user) { |p| p.display_name = current_user.email.split('@').first }` で初期化と作成を 1 行に。複雑な初期化が必要なら `tag = Tag.find_or_initialize_by(name: 'ruby'); tag.color = '#cc0000' if tag.new_record?; tag.save`。race フリーが必要なら Rails 6+ の `upsert` を使う。",
        pitfall:
          "**Race condition** が起きやすい (SELECT → INSERT の間に別プロセスが INSERT すると重複が作られる)。DB の UNIQUE 制約とセットで `rescue ActiveRecord::RecordNotUnique` で再 find する、または Rails 6+ の `upsert` (DB の ON CONFLICT を使用) を採用するのが安全。さらに find_or_create_by のブロックは『新規作成時のみ』実行されるので、『取得時にも何かしたい』なら戻り値を受け取った後で if/then 分岐する必要がある。",
      },
      codeExample:
        "# 取得 or 作成 (保存)\nuser = User.find_or_create_by(email: 'a@x') do |u|\n  u.name = 'Alice'\nend\n\n# 取得 or 初期化のみ (未保存)\nuser = User.find_or_initialize_by(email: 'a@x')\nuser.name = 'Alice'\nuser.save\n\n# race 対策\nuser = User.find_or_create_by(email: 'a@x')\nrescue ActiveRecord::RecordNotUnique\nuser = User.find_by(email: 'a@x')",
      commonMistakes: [
        "find_or_create_by は race condition で重複データを作れる。DB の UNIQUE 制約 + rescue で対処。",
        "Rails 6+ なら `upsert` (DB の ON CONFLICT 利用) の方が race フリーで安全。",
      ],
      references: [
        {
          label: "Rails API: find_or_create_by / find_or_initialize_by",
          url: "https://api.rubyonrails.org/classes/ActiveRecord/Relation.html#method-i-find_or_create_by",
        },
        {
          label: "Rails API: upsert (Rails 6+)",
          url: "https://api.rubyonrails.org/classes/ActiveRecord/Persistence/ClassMethods.html#method-i-upsert",
        },
      ],
    },
  },
  {
    id: "ar-021",
    categoryId: "active-record",
    difficulty: "intermediate",
    type: "text",
    question:
      "ActiveRecord で関連 (has_many 等) の中間テーブル名を変えたい時の DSL オプション名は？(英語1単語、コロン付き要素を答えてOK 例: foo:)",
    answers: [
      "through",
      "through:",
      ":through",
    ],
    hints: [
      "`has_many :tags, through: :tagging` のように書く中間モデルを指定するオプション。",
      "中間モデル名を指定。",
      "「〜を通して」を意味する英単語 1 語そのままで、`has_many :xxx, ???: :中間モデル名` の `???` 部分にあたります。",
    ],
    explanation: {
      summary:
        "`has_many :through` で多対多の中間モデルを指定する。",
      reason:
        "`has_many :through` は中間に Model を置く多対多の標準パターン。中間モデルに追加の属性 (role, joined_at など) を持たせられる利点がある。HABTM (`has_and_belongs_to_many`) は中間 Model 不要だが拡張性が低い。",
      beginnerExplanation:
        "**`through:`** は **多対多関係** で中間モデルを指定するオプションです。\n\n**使い方**:\n```ruby\nclass User < ApplicationRecord\n  has_many :memberships             # 中間モデル\n  has_many :groups, through: :memberships  # ↑経由でアクセス\nend\n\nclass Membership < ApplicationRecord\n  belongs_to :user\n  belongs_to :group\n  # role, joined_at などの追加属性も持てる\nend\n\nclass Group < ApplicationRecord\n  has_many :memberships\n  has_many :users, through: :memberships\nend\n```\n\n**使う場面**:\n1. **多対多関係** (典型: User ↔ Group, Post ↔ Tag, Recipe ↔ Ingredient)\n2. **多段の has_many** (例: Author → Books → Reviews を `has_many :reviews, through: :books` で 1 hop に圧縮)\n\n**便利な動作**:\n```ruby\nuser.groups          # 中間テーブル経由で Group を取得\nuser.groups << Group.find(1)  # 中間レコードを自動作成 (Membership.create!)\nuser.groups.destroy(group)    # 中間レコードを自動削除\n```\n\n**HABTM との違い** (再掲):\n| | `has_many :through` | `has_and_belongs_to_many` |\n|---|---|---|\n| 中間モデル | あり (Membership クラス) | なし (中間テーブルのみ) |\n| 追加属性 | 持てる (role, joined_at) | 持てない |\n| callback | 中間で書ける | 書けない |\n| 拡張性 | ◎ | × |\n\n**現代の Rails では常に `through` を使うのが推奨** です。\n\n**source オプション**: 中間モデル名と関連名が異なる場合に使う:\n```ruby\nhas_many :followed_users, through: :follows, source: :followed\n```\n（follows テーブル上は `followed_id` だが、Ruby 側では `followed_users` という名前でアクセスしたい場合）",
      modelSelfExplanation: {
        conclusion:
          "オプション名は `through:`。`has_many :tags, through: :tagging` のように書き、中間モデル (Tagging) を経由して多対多関係を表現する。",
        reason:
          "Rails の多対多関係は中間モデル経由で表現するのが標準で、`through:` オプションで『どの has_many 関連を経由するか』を宣言する。これにより中間レコードの自動生成・削除、has_many の連鎖 (has_many :through を更に through する)、追加属性へのアクセスなど、関連オブジェクトを 1 つのコレクションのように扱える DSL が手に入る。HABTM は中間モデルがないため拡張性が低く、現代では非推奨気味の扱い。",
        example:
          "ブログ記事のタグ機能で Post has_many :taggings / Tagging belongs_to :post, :tag / Tag has_many :taggings + has_many :posts, through: :taggings。記事に `post.tags << Tag.find_by(name: 'ruby')` でタグ付け、`post.tags.where('created_at > ?', 1.day.ago)` で新しいタグだけ取得など、Tag を直接持つかのような自然な API になる。SNS のフォロー機能 (User → Follows → Followed Users) も典型例。",
        pitfall:
          "through 関連は内部で JOIN を行うため、N+1 を避けるには `includes(:taggings, :tags)` のように両方プリロードが必要なケースがある。さらに polymorphic な中間モデル (例: Tag は Post / Comment 両方に付く) では source_type の指定が必要になり複雑化する。クラス名と関連名が異なる場合は source: オプションで明示する必要がある。",
      },
      codeExample:
        'class User < ApplicationRecord\n  has_many :tagging\n  has_many :tags, through: :tagging\nend\n\nclass Tagging < ApplicationRecord\n  belongs_to :user\n  belongs_to :tag\n  # added_at, role などの追加属性が持てる\nend\n\nclass Tag < ApplicationRecord\n  has_many :tagging\n  has_many :users, through: :tagging\nend\n\nuser.tags << Tag.find(1)   # 中間レコードを自動作成',
      commonMistakes: [
        "polymorphic 中間モデル (Tag が Post / Comment に共通) では source_type の指定が必要。",
        "through 経由の関連でも N+1 が起きる。`includes(:taggings, :tags)` で両方プリロード。",
      ],
      references: [
        {
          label: "Rails Guides: has_many :through (公式)",
          url: "https://guides.rubyonrails.org/association_basics.html#the-has-many-through-association",
        },
      ],
    },
  },
  {
    id: "ar-022",
    categoryId: "active-record",
    difficulty: "advanced",
    type: "choice",
    question:
      "次のうち、ActiveRecord の `transaction` の挙動として正しいものは？",
    choices: [
      "ブロック内で例外が出ると自動 ROLLBACK、正常終了で COMMIT",
      "save の失敗 (false 戻り) でも自動 ROLLBACK",
      "ブロック外で発生した例外もキャッチする",
      "再 raise されない",
    ],
    answerIndex: 0,
    choiceExplanations: [
      "正解。transaction は『ブロックを正常に抜ければ COMMIT、内部で例外が出れば ROLLBACK』というシンプルな挙動。整合性が必要な複数 INSERT/UPDATE をまとめる定番。",
      "save (! なし) が false を返してもそれは例外ではないのでロールバックされない。!  系か `raise ActiveRecord::Rollback` を使う必要がある。",
      "transaction の効果はブロック内に限定。ブロック外の例外には関与しない。",
      "ActiveRecord::Rollback は内部で握りつぶされるが、それ以外の例外は外側へ再 raise される。",
    ],
    hints: [
      "transaction は例外でロールバック、正常で commit。",
      "`save` (`!` なし) で false が返っても例外ではないのでロールバックされない。",
      "整合性のため、トランザクション内では `!` 系を使う。",
    ],
    explanation: {
      summary:
        "transaction は例外で ROLLBACK。save (! なし) は false を返すだけで例外ではないので注意。",
      reason:
        "整合性が必要な複数 INSERT/UPDATE は transaction で囲み、内部では `save!` `create!` `update!` で例外を出して確実にロールバックさせる。`raise ActiveRecord::Rollback` を投げると、例外伝播せずにロールバックだけする。",
      beginnerExplanation:
        "**`ActiveRecord::Base.transaction`** は **複数の DB 操作を 1 つの原子的な処理にまとめる** 仕組みです。\n\n**基本ルール**:\n- ブロックを **正常に抜ければ COMMIT** (確定)\n- ブロック内で **例外が出れば ROLLBACK** (取り消し)\n\n**典型的な使い方**:\n```ruby\nActiveRecord::Base.transaction do\n  user.save!                       # 失敗で例外 → 全ロールバック\n  account.save!                    # 同じく\n  payment.charge!                  # 外部 API も含めるなら注意\nend\n# ここを通れば COMMIT\n```\n\n**🚨 罠**: `save` (! なし) は **失敗時に false を返すだけで例外を投げない** ので、ロールバックされません!\n```ruby\n# ❌ 危険\nActiveRecord::Base.transaction do\n  user.save                        # false でも継続\n  account.save                     # user が壊れた状態で account も保存される\nend\n\n# ✅ 正しい\nActiveRecord::Base.transaction do\n  user.save!\n  account.save!                    # どちらか失敗で両方ロールバック\nend\n```\n\n**例外を伝播させずにロールバックだけしたい場合**:\n```ruby\nActiveRecord::Base.transaction do\n  user.do_something\n  raise ActiveRecord::Rollback if condition\n  # この特殊な例外だけは外に伝播しない (ロールバックのみ)\nend\n```\n\n**ネスト (savepoint)**: デフォルトでは『最外側のトランザクションだけ』有効。内部の transaction はネストしない:\n```ruby\nActiveRecord::Base.transaction do\n  user.save!\n  ActiveRecord::Base.transaction(requires_new: true) do\n    inner.save!  # ここだけロールバック可能 (SAVEPOINT)\n  end\nend\n```\n\n**外部 API を含めない**: トランザクション中に外部 API を呼ぶと、API 失敗で DB ロールバック → でも API 側は完了している、という不整合が起きやすい。**API 呼び出しは after_commit で非同期に** するのが安全:\n```ruby\nActiveRecord::Base.transaction do\n  order.update!(status: :paid)\n  # SlackNotifier.send(order) ← ここでは呼ばない!\nend\n# transaction の外で\nSlackNotifyJob.perform_later(order.id)\n```",
      modelSelfExplanation: {
        conclusion:
          "transaction は『ブロック内で例外が出れば ROLLBACK、正常終了で COMMIT』というシンプルな挙動。`save` (! なし) は false を返すだけで例外ではないため、トランザクション内では必ず `!` 系か `raise ActiveRecord::Rollback` を使う。",
        reason:
          "transaction はトランザクション境界 (BEGIN / COMMIT / ROLLBACK) を Ruby のブロックで明示する仕組みで、Ruby の例外伝播メカニズムに乗って『ブロック内で例外が出れば DB の ROLLBACK を発行して例外を再 raise する』というシンプルな実装。これにより複数モデル更新の原子性 (all-or-nothing) を保証できる。!  系のメソッド (save!, create!, update!) は失敗時に ActiveRecord::RecordInvalid を投げるので、transaction と組み合わせると意図通りにロールバックが効く。`raise ActiveRecord::Rollback` だけが例外として外に伝播せず内部で握りつぶされる特殊な例外で、『ロールバックしたいが上位に影響を与えたくない』場合に使う。",
        example:
          "決済処理で `transaction do; order.update!(status: :paid); inventory.decrement!(qty); payment_record.create!(amount: total); end` のように『DB 更新が全部成功するか全部失敗するか』を保証。失敗時に部分的に payment_record だけ残るような不整合を防ぐ。Stripe API などの外部呼び出しは `after_commit :enqueue_notify` で非同期化し、トランザクション境界の外で実行するのが定石。",
        pitfall:
          "transaction 内で `save` (! なし) を使うと、validation 失敗時に false が返るだけでロールバックされず、半端な状態が COMMIT される。さらに、transaction 内で外部 API を呼ぶと『API 完了 → DB ロールバック』で逆方向の不整合が起きる (例: 決済サービスは引き落とし済みなのに DB は未更新)。外部 API は `after_commit` フックで非同期実行する。さらにネストした transaction はデフォルトでは『同じ』として扱われ、内側のロールバックが外側に影響しないので、本当にネストしたければ `requires_new: true` で SAVEPOINT を使う。",
      },
      codeExample:
        "ActiveRecord::Base.transaction do\n  user.save!                       # 失敗で例外 → ロールバック\n  account.save!\nend\n\n# 例外伝播なしでロールバック\nActiveRecord::Base.transaction do\n  do_something\n  raise ActiveRecord::Rollback if condition\nend\n\n# ネスト (savepoint)\nActiveRecord::Base.transaction do\n  user.save!\n  ActiveRecord::Base.transaction(requires_new: true) do\n    inner.save!\n  end\nend",
      commonMistakes: [
        "transaction 内で `save` (! なし) して if 分岐すると、save が false でもロールバックされない。必ず `!` 系か `raise ActiveRecord::Rollback`。",
        "transaction 内で外部 API を呼ぶ → API 完了後の DB ロールバックで不整合。after_commit で非同期化。",
        "ネスト transaction は requires_new: true なしでは内側のロールバックが効かない。",
      ],
      references: [
        {
          label: "Rails API: ActiveRecord::Transactions (公式)",
          url: "https://api.rubyonrails.org/classes/ActiveRecord/Transactions/ClassMethods.html",
        },
      ],
    },
  },
  {
    id: "ar-023",
    categoryId: "active-record",
    difficulty: "advanced",
    type: "choice",
    question: "次のコードの SQL イメージは？",
    code: "Post.joins(:user).where(users: { active: true }).group('users.id').count",
    choices: [
      "user ごとの post 件数を返す Hash",
      "全 post を返す",
      "全 user を返す",
      "SyntaxError",
    ],
    answerIndex: 0,
    choiceExplanations: [
      "正解。joins で INNER JOIN、where で users.active 絞り込み、group で GROUP BY users.id、count で COUNT(*) という集計クエリ。結果は `{user_id => post_count}` の Hash。",
      "Post の一覧 (Relation) は group + count で集計結果に変換される。AR レコードは返さない。",
      "User オブジェクトは返さない。group が users.id でグループ化はするが、count は件数の Hash を返す。",
      "構文的には完全に有効な ActiveRecord メソッドチェーン。SyntaxError は起きない。",
    ],
    hints: [
      "`joins` で内部結合、`where` で users.active で絞り込み。",
      "`group` でユーザー単位、`count` で件数集計。",
      "group(:何か).count は『グループ化キー → 件数』の Hash を返すため、Post や User の AR レコード一覧そのものは返ってきません。",
    ],
    explanation: {
      summary:
        "joins + group + count は SQL の集計クエリ。ユーザーごとの post 件数集計。",
      reason:
        "`joins(:user)` は INNER JOIN、`group` は GROUP BY、`count` は COUNT(*) 相当。結果は `{グループキー => count}` の Hash。`having` で集計後の条件、`pluck` と組み合わせて配列化も可。`includes` (LEFT OUTER JOIN 別クエリ) と混同しないこと。",
      beginnerExplanation:
        "**ActiveRecord の集計クエリ** の典型パターンです。SQL の `JOIN + WHERE + GROUP BY + COUNT` を Ruby DSL で書く方法。\n\n**コードを分解**:\n```ruby\nPost.joins(:user)                          # INNER JOIN users ON posts.user_id = users.id\n    .where(users: { active: true })        # WHERE users.active = true\n    .group('users.id')                     # GROUP BY users.id\n    .count                                 # SELECT COUNT(*) ...\n```\n\n**生成 SQL** (PostgreSQL):\n```sql\nSELECT users.id, COUNT(*)\nFROM posts\nINNER JOIN users ON posts.user_id = users.id\nWHERE users.active = true\nGROUP BY users.id;\n```\n\n**戻り値**: `Hash` で `{user_id => post_count}`\n```ruby\n#=> {1=>5, 2=>3, 7=>12, ...}\n```\n\n**`joins` vs `includes` の違い**:\n| | `joins` | `includes` |\n|---|---|---|\n| SQL | INNER JOIN | LEFT JOIN または 2 クエリ (preload) |\n| 用途 | 絞り込み / 集計 | N+1 回避 (関連オブジェクト読み込み) |\n| AR インスタンス | 親のみ | 親 + 関連も |\n\n**集計後の条件 (HAVING)**:\n```ruby\n# 投稿 10 件以上のユーザだけ\nPost.group(:user_id).having('count(*) > ?', 10).count\n#=> {1=>15, 7=>23, ...}\n```\n\n**User オブジェクト付きで欲しい場合**:\n```ruby\n# UserId 集計を Hash で取得した後で User を引く\ncounts = Post.group(:user_id).count\nUser.where(id: counts.keys).each do |u|\n  puts \"#{u.name}: #{counts[u.id]}\"\nend\n\n# または counter_cache カラムで事前計算 (高速)\nclass Post < ApplicationRecord\n  belongs_to :user, counter_cache: true   # users.posts_count を自動更新\nend\nUser.order(posts_count: :desc).limit(10)\n```\n\n**他の集計メソッド**: `sum`, `average`, `minimum`, `maximum` も group と組み合わせ可能:\n```ruby\nOrder.group(:user_id).sum(:total)\n#=> {1=>15000, 2=>3000, ...}\n```",
      modelSelfExplanation: {
        conclusion:
          "クエリは『user ごとの投稿件数を Hash で返す』集計。joins で INNER JOIN、where で絞り込み、group で GROUP BY、count で COUNT(*) を発行し、結果は `{user_id => post_count}` の Hash。",
        reason:
          "ActiveRecord は SQL の集計機能 (JOIN / WHERE / GROUP BY / HAVING / 各種集計関数) を Ruby メソッドチェーンで宣言的に書ける。`group.count` の戻り値は AR レコード一覧ではなく『グループキー → 件数』の Hash になる、というのが集計 API の特徴。これは『Relation のままだとレコード抽出だが、count や sum などの集計関数を呼んだ瞬間に SQL の結果が集計値の Hash に変換される』というルール。",
        example:
          "ダッシュボード画面で『アクティブユーザ別の投稿数』を `Post.joins(:user).where(users: { active: true }).group('users.id').count` で算出、『月別売上』を `Order.group(\"date_trunc('month', created_at)\").sum(:total)` で集計、『カテゴリ別の最高価格』を `Product.group(:category).maximum(:price)` で取得。counter_cache カラムを使えば事前計算で高速化可能。",
        pitfall:
          "joins は INNER JOIN なので親に対応する子が無いレコードは結果から除外される (LEFT JOIN したいなら left_joins / includes)。group 句に SELECT 句以外のカラムが含まれると PostgreSQL では『must appear in the GROUP BY clause』エラー。`pluck` と組み合わせる際は Arel.sql で生 SQL を安全にラップする (Rails 6.1+ で SQL Injection 対策強化)。さらに大規模テーブルでは GROUP BY が重いので、counter_cache や事前集計テーブルでの最適化を検討する。",
      },
      codeExample:
        "Post.joins(:user)\n    .where(users: { active: true })\n    .group('users.id')\n    .count\n#=> {1=>5, 2=>3, ...} (user_id => post count)\n\n# user オブジェクト付きで\nresult = User.left_joins(:posts).group('users.id').count('posts.id')\n\n# 集計後の条件\nPost.group(:user_id).having('count(*) > ?', 10).count",
      commonMistakes: [
        "joins は INNER JOIN なので子が無い親は除外される。LEFT JOIN したいなら left_joins / includes。",
        "group 句で SELECT カラムが GROUP BY に含まれないと PostgreSQL エラー。",
        "大規模テーブルの GROUP BY は重い。counter_cache や materialized view を検討。",
      ],
      references: [
        {
          label: "Rails Guides: Joining Tables (joins / left_joins) 公式",
          url: "https://guides.rubyonrails.org/active_record_querying.html#joining-tables",
        },
        {
          label: "Rails Guides: Calculations (count / sum / group) 公式",
          url: "https://guides.rubyonrails.org/active_record_querying.html#calculations",
        },
      ],
    },
  },

  // ===========================================================================
  // 実践課題 (12問) - 未経験から実務即戦力レベルの課題
  // ===========================================================================
  {
    id: "pr-001",
    categoryId: "practical",
    difficulty: "beginner",
    type: "practical",
    question:
      "FizzBuzz: 1 から 100 までの整数を出力。3 の倍数で 'Fizz'、5 の倍数で 'Buzz'、両方の倍数で 'FizzBuzz' を出力するスクリプトを書いてください。",
    requirements: [
      "1 から 100 までループする",
      "3 の倍数のとき 'Fizz' を出力",
      "5 の倍数のとき 'Buzz' を出力",
      "15 の倍数のとき 'FizzBuzz' を出力",
      "それ以外は数字をそのまま出力",
    ],
    sampleSolution:
      "(1..100).each do |n|\n  if n % 15 == 0\n    puts 'FizzBuzz'\n  elsif n % 3 == 0\n    puts 'Fizz'\n  elsif n % 5 == 0\n    puts 'Buzz'\n  else\n    puts n\n  end\nend\n\n# 別解 (case/in パターンマッチ Ruby 3.0+)\n(1..100).each do |n|\n  case [n % 3, n % 5]\n  in [0, 0] then puts 'FizzBuzz'\n  in [0, _] then puts 'Fizz'\n  in [_, 0] then puts 'Buzz'\n  else           puts n\n  end\nend",
    hints: [
      "modulo 演算子 `%` で割り算の余りを取得できます。",
      "条件の順序が重要。15 の倍数を先にチェックしないと Fizz/Buzz に取られる。",
      "if/elsif/else または case/in パターンマッチで書けます。",
    ],
    reviewPoints: [
      "15の倍数を最初にチェック (または 3 と 5 両方の条件を組み合わせる)",
      "数値そのままを出力する分岐を忘れていない",
      "1..100 (両端含む) と 1...100 (100含まず) の違いに注意",
      "puts は引数を to_s してから改行付きで出力する",
    ],
    explanation: {
      summary:
        "FizzBuzz は条件分岐の練習。15 の倍数チェックを最初に書くのがポイント。",
      reason:
        "FizzBuzz は分岐の評価順序の良い練習問題。% で余りを判定し、最も特殊なケース (15の倍数) から評価する。Ruby 3.0+ なら case/in でも書ける。",
      commonMistakes: [
        "3 の倍数 → 5 の倍数 → 15 の倍数 の順で書くと 15 が常に Fizz になってしまう。",
      ],
    },
  },
  {
    id: "pr-002",
    categoryId: "practical",
    difficulty: "beginner",
    type: "practical",
    question:
      "配列の要素を集計: 整数の配列を受け取り、合計・平均・最大・最小を Hash で返すメソッド `stats(arr)` を実装してください。",
    requirements: [
      "メソッド名は `stats`、引数は整数の配列",
      "戻り値は { sum: 〜, avg: 〜, max: 〜, min: 〜 } の Hash",
      "空配列が来たら全てのキーが nil の Hash を返す",
      "avg は Float (例: 3.5)",
    ],
    sampleSolution:
      "def stats(arr)\n  return { sum: nil, avg: nil, max: nil, min: nil } if arr.empty?\n\n  {\n    sum: arr.sum,\n    avg: arr.sum.to_f / arr.length,\n    max: arr.max,\n    min: arr.min,\n  }\nend\n\n# 動作確認\nstats([1, 2, 3, 4, 5])\n#=> {sum: 15, avg: 3.0, max: 5, min: 1}\nstats([])\n#=> {sum: nil, avg: nil, max: nil, min: nil}",
    hints: [
      "`Enumerable#sum`, `#max`, `#min` が標準で使えます。",
      "平均は `sum.to_f / length` (to_f しないと整数除算になる)。",
      "空配列の場合は早期 return で処理を分けましょう。",
    ],
    reviewPoints: [
      "空配列を最初にチェックしている (`max` などは空配列で nil を返すが、avg は ZeroDivisionError)",
      "avg を Float にする変換 (.to_f) を入れている",
      "sum, max, min を標準メソッドで簡潔に書いている",
      "戻り値は Hash で 4 つのキーを揃えている",
    ],
    explanation: {
      summary:
        "標準 Enumerable メソッドを使えば短く書ける。エッジケース (空配列) のハンドリングが重要。",
      reason:
        "実務でデータを集計する処理の最小ケース。空配列など『データが無いとき』の挙動を明示するのが重要 (nil を返すか、0 を返すか、例外を投げるかは要件次第)。to_f を忘れると整数除算で誤差。",
      commonMistakes: [
        "`arr.sum / arr.length` だと整数除算で 3 (本来は 3.0) になる。",
        "空配列で `[].max` は nil だが `[].sum / 0` は ZeroDivisionError。",
      ],
    },
  },
  {
    id: "pr-003",
    categoryId: "practical",
    difficulty: "intermediate",
    type: "practical",
    question:
      "CSV パーサ: 文字列 'name,age\\nAlice,20\\nBob,30' を受け取り、[{name: 'Alice', age: '20'}, {name: 'Bob', age: '30'}] のような Array of Hash に変換するメソッド `parse_csv(text)` を実装してください。",
    requirements: [
      "1 行目をヘッダーとして扱う",
      "残りの行を Hash に変換し、配列で返す",
      "ヘッダーはシンボル化する (例: :name)",
      "値は文字列のままで OK",
      "標準ライブラリ csv は使わず、自前で実装",
    ],
    sampleSolution:
      "def parse_csv(text)\n  lines = text.split(\"\\n\")\n  headers = lines.shift.split(',').map(&:to_sym)\n  lines.map do |line|\n    values = line.split(',')\n    headers.zip(values).to_h\n  end\nend\n\n# 動作確認\ntext = \"name,age\\nAlice,20\\nBob,30\"\nparse_csv(text)\n#=> [{name: \"Alice\", age: \"20\"}, {name: \"Bob\", age: \"30\"}]\n\n# 本格的にやるなら標準ライブラリ\nrequire 'csv'\nCSV.parse(text, headers: true, header_converters: :symbol).map(&:to_h)",
    hints: [
      "改行で分割、カンマで分割の 2 段階。",
      "`zip` でヘッダーと値をペアにする。",
      "ヘッダー配列と値配列をペアにする手段 (zip 等) を使ってから一気に Hash 化すると、`each` で 1 件ずつ詰める書き方より短く済みます。",
    ],
    reviewPoints: [
      "split('\\n') で行に分け、shift でヘッダーを取り出している",
      "headers.zip(values).to_h のイディオムを使っている",
      "ヘッダーをシンボル化している (to_sym)",
      "本格運用なら標準ライブラリ csv を使うべきと理解している",
    ],
    explanation: {
      summary:
        "split + zip + to_h は Ruby らしいイディオム。実運用は標準ライブラリ csv を推奨。",
      reason:
        "簡易 CSV パースは split で書けるが、ダブルクォート囲み、エスケープ、改行を含む値などのエッジケースに弱い。本番では `CSV.parse` を使うこと。練習としては手書きでイディオムを身につけるとよい。",
      commonMistakes: [
        "値にカンマが含まれる場合 (\"hello, world\") は split で正しくパースできない。",
        "BOM 付き UTF-8 CSV は最初の文字に注意。CSV ライブラリならオプションで処理可。",
      ],
    },
  },
  {
    id: "pr-004",
    categoryId: "practical",
    difficulty: "intermediate",
    type: "practical",
    question:
      "Rails モデル: User と Post の 1対多関係を設計してください。User 削除時は紐づく Post も削除、Post には title (必須、最大100文字) と body (必須) のバリデーションを設定。",
    requirements: [
      "User モデル: name (string, 必須)",
      "Post モデル: title, body, user_id (NOT NULL, FK)",
      "User has_many :posts (User 削除で Post も削除)",
      "Post belongs_to :user",
      "Post の title: 必須・最大 100 文字",
      "Post の body: 必須",
    ],
    sampleSolution:
      "# migration: db/migrate/xxx_create_users.rb\nclass CreateUsers < ActiveRecord::Migration[7.1]\n  def change\n    create_table :users do |t|\n      t.string :name, null: false\n      t.timestamps\n    end\n  end\nend\n\n# migration: db/migrate/xxx_create_posts.rb\nclass CreatePosts < ActiveRecord::Migration[7.1]\n  def change\n    create_table :posts do |t|\n      t.string :title, null: false\n      t.text :body, null: false\n      t.references :user, null: false, foreign_key: true\n      t.timestamps\n    end\n  end\nend\n\n# app/models/user.rb\nclass User < ApplicationRecord\n  has_many :posts, dependent: :destroy\n  validates :name, presence: true\nend\n\n# app/models/post.rb\nclass Post < ApplicationRecord\n  belongs_to :user\n  validates :title, presence: true, length: { maximum: 100 }\n  validates :body,  presence: true\nend",
    hints: [
      "外部キーは `t.references :user, foreign_key: true` で生成。",
      "`dependent: :destroy` で親削除時に子も削除。",
      "presence と length を 1 行の validates にまとめても良いですし、文字数は `length:` オプションで maximum を指定します。",
    ],
    reviewPoints: [
      "マイグレーションで null: false と foreign_key: true を両方指定",
      "User#has_many :posts に dependent: :destroy を指定",
      "Post#belongs_to :user (デフォルトで required)",
      "validates でモデル側の制約も二重に設定 (DB + Model)",
      "ファイル名・クラス名が Rails の規約通り (users_controller.rb etc.)",
    ],
    explanation: {
      summary:
        "DB 制約 (NOT NULL, FK) と Model バリデーションを両方設定するのが定石。",
      reason:
        "DB レベルでも Model レベルでも制約をかけることで、(1) DB が最終防衛線、(2) Model が UI 親切なエラーメッセージ。`dependent: :destroy` は孤立レコードを防ぐ。delete_all は速いがコールバックを飛ばすのでファイル添付などがあると不整合のリスク。",
      commonMistakes: [
        "validates だけで DB 制約を入れないと、コンソールや別アプリから不正データが入る。",
        "dependent: :destroy を忘れると、User 削除時に posts が残り orphan になる。",
      ],
    },
  },
  {
    id: "pr-005",
    categoryId: "practical",
    difficulty: "intermediate",
    type: "practical",
    question:
      "N+1 問題の解消: `Post.all.each { |p| puts p.user.name }` が N+1 になっています。これを 2 クエリで済むように修正してください。",
    requirements: [
      "全 Post を取得して各 user.name を出力する処理",
      "クエリ数は 2 (posts 取得 + users 取得) になるようにする",
      "結果は元コードと同じ",
      "includes / preload / eager_load のいずれかを使う",
    ],
    sampleSolution:
      "# 修正後\nPost.includes(:user).each { |p| puts p.user.name }\n\n# 発行される SQL\n# SELECT * FROM posts;\n# SELECT * FROM users WHERE id IN (1, 2, 3, ...);\n\n# 検出には bullet gem が便利 (Gemfile)\ngroup :development do\n  gem 'bullet'\nend\n\n# config/environments/development.rb\nconfig.after_initialize do\n  Bullet.enable        = true\n  Bullet.alert         = true\n  Bullet.bullet_logger = true\nend",
    hints: [
      "`includes(:関連名)` で関連を事前ロード。",
      "条件指定がなければ `preload`、JOIN したいなら `eager_load`、自動選択は `includes`。",
      "bullet gem で開発中の N+1 を自動検出できます。",
    ],
    reviewPoints: [
      "includes / preload / eager_load の違いを理解している",
      "発行クエリが 2 つになることを確認できる",
      "where で関連テーブルの条件を指定する場合は eager_load",
      "bullet gem の導入で早期検出する習慣",
    ],
    explanation: {
      summary:
        "includes が N+1 対策の基本。preload (別クエリ) と eager_load (JOIN) を内部で使い分け。",
      reason:
        "N+1 は Rails アプリの典型的なパフォーマンス問題。テンプレートで関連を参照するだけで発生。bullet gem は dev 環境で自動検出してくれるので必ず入れる。本番では skylight / scout / new relic 等の APM で検出。",
      commonMistakes: [
        "`includes(:user).where(users: { active: true })` は意外と eager_load 扱いになる。条件付き includes は references も指定する。",
        "joins は preload しないので関連オブジェクトアクセスで N+1 になる。",
      ],
    },
  },
  {
    id: "pr-006",
    categoryId: "practical",
    difficulty: "intermediate",
    type: "practical",
    question:
      "Rails スコープ: Post モデルに以下のスコープを定義してください。`published` (公開済み), `recent` (新しい順), `by_author(name)` (著者名で絞り込み, 関連 user.name で)",
    requirements: [
      "published: published_at が NULL でない",
      "recent: created_at の降順",
      "by_author(name): user.name = ? で絞り込み (joins 使用)",
      "Post.published.recent.by_author('Alice') がチェーン可能",
    ],
    sampleSolution:
      "class Post < ApplicationRecord\n  belongs_to :user\n\n  scope :published, -> { where.not(published_at: nil) }\n  scope :recent,    -> { order(created_at: :desc) }\n  scope :by_author, ->(name) { joins(:user).where(users: { name: name }) }\nend\n\n# 使用例\nPost.published.recent.by_author('Alice')\n# SELECT posts.* FROM posts\n# INNER JOIN users ON users.id = posts.user_id\n# WHERE posts.published_at IS NOT NULL\n#   AND users.name = 'Alice'\n# ORDER BY posts.created_at DESC",
    hints: [
      "`scope :name, -> { ... }` の形で定義。",
      "`where.not(col: nil)` で NOT NULL。",
      "関連テーブルのカラムで絞る scope は `joins` でテーブルを連結してから where のネストハッシュで条件を書くと SQL インジェクションも防げます。",
    ],
    reviewPoints: [
      "scope は lambda (`->`) で定義 (毎回評価のため)",
      "where.not で否定条件",
      "関連条件は `joins(:user).where(users: { ... })` の形",
      "チェーン可能 (ActiveRecord::Relation を返す)",
      "引数を取る scope は `->(arg) { ... }`",
    ],
    explanation: {
      summary:
        "scope は再利用可能なクエリ片。lambda で定義してチェーン可能にする。",
      reason:
        "scope は通常のクラスメソッドでも書けるが、宣言的に書ける利点がある。lambda で書く理由は『毎回評価』のため (定数だと初期化時の値で固定される)。チェーンしても 1 つの SQL にまとめられるのが ActiveRecord の強み。",
      commonMistakes: [
        "scope を `-> { Time.current }` で書くと毎回評価される (= 期待通り)。Proc.new だと、引数の数チェックが緩い。",
        "`includes` を含む scope は join 戦略に注意。",
      ],
    },
  },
  {
    id: "pr-007",
    categoryId: "practical",
    difficulty: "intermediate",
    type: "practical",
    question:
      "Rails コントローラ: PostsController で標準的な CRUD (index/show/new/create/edit/update/destroy) を実装してください。Strong Parameters でセキュリティ対策、`before_action` で重複削減。",
    requirements: [
      "RESTful 7 アクション",
      "set_post を before_action で抽出 (show/edit/update/destroy)",
      "post_params で title, body のみ permit",
      "create/update 失敗時は :unprocessable_entity で再 render",
      "destroy 後は :see_other (303) でリダイレクト (Turbo 対応)",
    ],
    sampleSolution:
      "class PostsController < ApplicationController\n  before_action :set_post, only: %i[show edit update destroy]\n\n  def index\n    @posts = Post.includes(:user).recent\n  end\n\n  def show; end\n\n  def new\n    @post = Post.new\n  end\n\n  def create\n    @post = current_user.posts.build(post_params)\n    if @post.save\n      redirect_to @post, notice: '作成しました'\n    else\n      render :new, status: :unprocessable_entity\n    end\n  end\n\n  def edit; end\n\n  def update\n    if @post.update(post_params)\n      redirect_to @post, notice: '更新しました'\n    else\n      render :edit, status: :unprocessable_entity\n    end\n  end\n\n  def destroy\n    @post.destroy\n    redirect_to posts_path, notice: '削除しました', status: :see_other\n  end\n\n  private\n\n  def set_post\n    @post = Post.find(params[:id])\n  end\n\n  def post_params\n    params.require(:post).permit(:title, :body)\n  end\nend",
    hints: [
      "before_action で共通処理を抽出。",
      "Strong Parameters: `params.require(:resource).permit(:fields)`。",
      "Turbo: form 失敗時は :unprocessable_entity、DELETE 後は :see_other。",
    ],
    reviewPoints: [
      "before_action で set_post を共通化",
      "Strong Parameters で permit を明示",
      "create/update 失敗時の status: :unprocessable_entity (Turbo 互換)",
      "destroy 後の status: :see_other (Turbo 7+ 推奨)",
      "ユーザーとの関連が必要なら current_user.posts.build を使う",
      "index で N+1 対策 (includes)",
    ],
    explanation: {
      summary:
        "RESTful コントローラのテンプレ。Strong Parameters と Turbo 互換ステータスが現代の必須項目。",
      reason:
        "Rails 7+ の Turbo 環境では HTTP ステータスコードがフォームの再表示挙動に影響する。`:unprocessable_entity` (422) で再描画、`:see_other` (303) で DELETE 後のリダイレクト。これらを忘れると Turbo が期待通り動かない。",
      commonMistakes: [
        "render :new で status を付け忘れると 200 で返り Turbo がリダイレクト扱いしてしまう。",
        "destroy 後のリダイレクトが 302 だと Turbo がフェッチを GET ではなく DELETE で行ってループになる。",
      ],
    },
  },
  {
    id: "pr-008",
    categoryId: "practical",
    difficulty: "advanced",
    type: "practical",
    question:
      "Service Object パターン: ユーザー登録時に『ユーザー作成 + 初期プロジェクト作成 + 歓迎メール送信』を行う SignUpUser サービスクラスを実装してください。失敗時はロールバック。",
    requirements: [
      "`SignUpUser.new(params).call` の形で呼べる",
      "User の作成、Project の作成、Mailer 送信を行う",
      "transaction でラップし、いずれか失敗ですべてロールバック",
      "成功時は user オブジェクト、失敗時は errors を返す",
      "app/services/sign_up_user.rb に配置",
    ],
    sampleSolution:
      "# app/services/sign_up_user.rb\nclass SignUpUser\n  Result = Struct.new(:success?, :user, :errors, keyword_init: true)\n\n  def initialize(params)\n    @params = params\n  end\n\n  def call\n    user = nil\n    ActiveRecord::Base.transaction do\n      user = User.create!(@params.slice(:name, :email, :password))\n      user.projects.create!(name: 'My First Project')\n    end\n    WelcomeMailer.greet(user).deliver_later\n    Result.new(success?: true, user: user, errors: [])\n  rescue ActiveRecord::RecordInvalid => e\n    Result.new(success?: false, user: e.record, errors: e.record.errors.full_messages)\n  end\nend\n\n# 使用例 (コントローラ)\ndef create\n  result = SignUpUser.new(user_params).call\n  if result.success?\n    sign_in(result.user)\n    redirect_to dashboard_path\n  else\n    @user = result.user\n    render :new, status: :unprocessable_entity\n  end\nend",
    hints: [
      "transaction でラップして失敗時に全ロールバック。",
      "`create!` (! 付き) で失敗時に例外 → ロールバック。",
      "メール送信はトランザクション外 (commit 後) に行う。",
      "戻り値は Struct や独自クラスで {success?, user, errors} の形に。",
    ],
    reviewPoints: [
      "transaction で囲んでいる",
      "create! (! 付き) で失敗を例外として扱っている",
      "メール送信は transaction 外 (失敗時に送らないため)",
      "戻り値が Struct/独自オブジェクトで呼び出し側が判定しやすい",
      "rescue で例外を捕まえて結果オブジェクトに変換",
      "deliver_later で非同期送信 (ActiveJob 経由)",
    ],
    explanation: {
      summary:
        "Service Object は controller/model が肥大化したロジックを切り出す定番パターン。transaction + 例外 + Struct 戻り値が定石。",
      reason:
        "Controller は HTTP 層、Model は DB ロジックに集中させ、複数 Model にまたがる業務ロジックは Service に切り出す。テスタブル・再利用可。Rails 公式では推奨されていないが、コミュニティで広く採用。dry-rb の dry-monads や Trailblazer Operation などの拡張パターンもある。",
      commonMistakes: [
        "transaction 内で deliver_later するとロールバックされても enqueue だけは残り、メールが送られる。",
        "save (! なし) を使うと例外が出ず transaction がロールバックされない。",
      ],
    },
  },
  {
    id: "pr-009",
    categoryId: "practical",
    difficulty: "advanced",
    type: "practical",
    question:
      "JSON API エンドポイント: GET /api/v1/posts で公開済み Post 一覧を JSON で返す API を実装してください。N+1 対策、ページネーション (page/per)、Total-Count ヘッダー付き。",
    requirements: [
      "ルート: namespace api do namespace v1 do resources :posts, only: %i[index] end end",
      "コントローラ: Api::V1::PostsController < ApplicationController",
      "認証: 一旦不要 (TODO 想定)",
      "JSON 構造: [{id, title, body, author_name, published_at}, ...]",
      "ページネーション (kaminari か pagy を仮定): page / per パラメータ",
      "レスポンスヘッダー X-Total-Count に総件数を入れる",
      "N+1 対策で includes(:user)",
    ],
    sampleSolution:
      "# config/routes.rb\nnamespace :api do\n  namespace :v1 do\n    resources :posts, only: %i[index show]\n  end\nend\n\n# app/controllers/api/v1/posts_controller.rb\nmodule Api\n  module V1\n    class PostsController < ApplicationController\n      def index\n        scope = Post.includes(:user).published.recent\n        @posts = scope.page(params[:page]).per(params[:per] || 20)\n\n        response.headers['X-Total-Count'] = scope.count.to_s\n        render json: @posts.map { |p|\n          {\n            id: p.id,\n            title: p.title,\n            body: p.body,\n            author_name: p.user.name,\n            published_at: p.published_at&.iso8601,\n          }\n        }\n      end\n    end\n  end\nend\n\n# Gemfile (kaminari の場合)\ngem 'kaminari'",
    hints: [
      "namespace でルートを分離。",
      "Kaminari (`page`/`per`) または Pagy を使う。",
      "X-Total-Count はフロントが全ページ数を知るのに便利。",
      "JsonRenderer や jbuilder, ActiveModel::Serializers でも書ける。",
    ],
    reviewPoints: [
      "namespace :api do namespace :v1 do ... end end で URL/モジュール両方をスコープ",
      "Post.includes(:user) で N+1 対策",
      "ページネーションを実装 (page, per を受け取る)",
      "X-Total-Count ヘッダーを設定 (フロントエンドが全件数を知るため)",
      "iso8601 など標準フォーマットで日付を返す",
      "本格的には jbuilder や JSON シリアライザを使うと保守しやすい",
    ],
    explanation: {
      summary:
        "RESTful API は URL/コントローラ階層・ページネーション・N+1 対策・標準ヘッダーの 4 点セットを意識。",
      reason:
        "実務 API は (1) versioning (v1, v2), (2) ページネーション, (3) 認証 (今回は省略), (4) パフォーマンス (N+1, インデックス) が重要。CORS 設定 (config/initializers/cors.rb) も別途必要。OpenAPI で API 仕様を文書化するとフロント連携が楽。",
      commonMistakes: [
        "ページネーションを忘れると 1 リクエストで全件返って爆発する。",
        "総件数を返さないとフロントが『次ページがあるか』判定できない。",
        "認証が必要な本番では JWT や API Key を導入。",
      ],
    },
  },
  {
    id: "pr-010",
    categoryId: "practical",
    difficulty: "advanced",
    type: "practical",
    question:
      "ActiveJob で非同期処理: ユーザー登録後にバックグラウンドで歓迎メール送信 + 統計記録を行う Job を実装してください。失敗時は最大 3 回リトライ。",
    requirements: [
      "Job 名: WelcomeJob、引数は user_id",
      "perform で User を find、メール送信、Stats 記録",
      "retry_on で 3 回までリトライ (一般的なネットワークエラー対象)",
      "discard_on ActiveRecord::RecordNotFound (User が消えていたらリトライしない)",
      "queue_as :default",
    ],
    sampleSolution:
      "# app/jobs/welcome_job.rb\nclass WelcomeJob < ApplicationJob\n  queue_as :default\n\n  retry_on Net::OpenTimeout, wait: :polynomially_longer, attempts: 3\n  retry_on Net::ReadTimeout, wait: :polynomially_longer, attempts: 3\n  discard_on ActiveRecord::RecordNotFound\n\n  def perform(user_id)\n    user = User.find(user_id)\n    WelcomeMailer.greet(user).deliver_now\n    UserSignupStats.record!(user)\n  end\nend\n\n# 呼び出し側\nWelcomeJob.perform_later(user.id)\n# またはメールなら\nWelcomeMailer.greet(user).deliver_later\n\n# 設定 (config/application.rb)\nconfig.active_job.queue_adapter = :sidekiq  # 本番は Sidekiq / GoodJob 等",
    hints: [
      "引数は ID (Object 全体ではなく) を渡すのが定石 (シリアライズの罠回避)。",
      "`retry_on` で特定例外を自動リトライ。`discard_on` でリトライ無しに破棄。",
      "本番では Sidekiq / GoodJob / SolidQueue などのキューバックエンドを使う。",
    ],
    reviewPoints: [
      "引数は ID (Active Job は GlobalID で AR を渡せるが、find を Job 側でやる方が安全)",
      "retry_on で一時的エラーに耐性",
      "discard_on で永続的エラー (レコード消失) は捨てる",
      "queue_as でキュー振り分け",
      "本番では Sidekiq などの adapter を設定",
      "deliver_later で Mailer 経由なら ActionMailer が内部で Job 化",
    ],
    explanation: {
      summary:
        "ActiveJob はキューアダプタ抽象化。引数は ID 渡し、retry_on/discard_on で適切なリトライ戦略。",
      reason:
        "メール送信や統計記録など『失敗してもいい/再試行可』の処理はバックグラウンドへ。リトライ戦略は (1) ネットワーク系は数回リトライ、(2) ロジックバグはリトライしないで失敗通知、と切り分ける。Sidekiq の場合は perform_in / perform_at で遅延実行もできる。",
      commonMistakes: [
        "AR インスタンスを直接 perform_later すると、シリアライズで GlobalID 経由になり、Job 実行時にレコードが消えていると ActiveJob::DeserializationError。ID 渡しが安全。",
        "transaction 内で perform_later すると、コミット前に Job が走ってレコードが見えない場合がある。after_commit や after_create_commit を使う。",
      ],
    },
  },
  {
    id: "pr-011",
    categoryId: "practical",
    difficulty: "advanced",
    type: "practical",
    question:
      "認証付き API: HTTP ヘッダー `Authorization: Bearer <token>` で User を特定し、トークンが無効なら 401 を返す `authenticate_api_user!` を ApplicationController に実装してください。",
    requirements: [
      "before_action :authenticate_api_user! で呼ぶ",
      "Authorization ヘッダーから Bearer トークンを取り出す",
      "User.find_by(api_token: token) で照合",
      "見つからなければ render json: {error: 'unauthorized'}, status: :unauthorized",
      "current_api_user メソッドで User オブジェクトにアクセス可能に",
    ],
    sampleSolution:
      "class ApplicationController < ActionController::API\n  private\n\n  def authenticate_api_user!\n    token = bearer_token\n    @current_api_user = User.find_by(api_token: token) if token\n    return if @current_api_user\n\n    render json: { error: 'unauthorized' }, status: :unauthorized\n  end\n\n  def current_api_user\n    @current_api_user\n  end\n\n  def bearer_token\n    auth = request.headers['Authorization']\n    return nil unless auth.present?\n    match = auth.match(/\\ABearer\\s+(.+)\\z/)\n    match && match[1]\n  end\nend\n\n# 使い方\nclass Api::V1::PostsController < ApplicationController\n  before_action :authenticate_api_user!\n  def index\n    @posts = current_api_user.posts\n    render json: @posts\n  end\nend",
    hints: [
      "Authorization ヘッダーは `request.headers['Authorization']` で取得。",
      "Bearer のあとに半角スペース + token。正規表現でパース。",
      "認証失敗は 401 (:unauthorized)、認可失敗は 403 (:forbidden)。",
      "本格運用は JWT (jwt gem) や Devise::Token 等を使う。",
    ],
    reviewPoints: [
      "Authorization ヘッダーから Bearer トークンを安全にパース",
      "DB の api_token カラムは has_secure_token や SecureRandom.hex で生成",
      "失敗時は 401 で {error: ...} を返す (404 ではない)",
      "current_api_user は @current_api_user のキャッシュを返す",
      "本格運用は JWT + 有効期限 + refresh token の仕組みを検討",
    ],
    explanation: {
      summary:
        "API 認証の基本: Bearer トークンを抽出 → DB 照合 → 失敗時 401。シンプルな token 認証から始めて要件次第で JWT 等へ。",
      reason:
        "HTTP 401 は認証 (誰か分からない)、403 は認可 (誰かは分かるが権限なし) を意味するので区別する。トークンは ActiveSupport::SecurityUtils.secure_compare でタイミング攻撃対策をするとさらに良い。",
      commonMistakes: [
        "User.find_by に nil トークンが渡ると全ユーザーの中の nil トークン User がヒットしてしまう。事前 nil チェック必須。",
        "トークンを == で比較するとタイミング攻撃の余地。`ActiveSupport::SecurityUtils.secure_compare` を使う。",
        "本番でトークンをログに出さない (filter_parameters 設定)。",
      ],
    },
  },
  {
    id: "pr-012",
    categoryId: "practical",
    difficulty: "advanced",
    type: "practical",
    question:
      "メタプログラミング応用: 任意のクラスに include すると、属性名のリストから getter/setter と #to_h を生成する Module `AttrHashable` を実装してください。",
    requirements: [
      "`define_attrs :name, :age` のような DSL を提供",
      "各属性に attr_accessor を作る",
      "`to_h` で {name: 値, age: 値} を返す",
      "include 対象のクラスを限定しない (どのクラスでも使える)",
      "ActiveSupport::Concern を使わずピュアな Ruby で書く",
    ],
    sampleSolution:
      "module AttrHashable\n  def self.included(base)\n    base.extend(ClassMethods)\n  end\n\n  module ClassMethods\n    def define_attrs(*names)\n      attr_accessor(*names)\n      # to_h を動的定義\n      define_method(:to_h) do\n        names.each_with_object({}) do |n, h|\n          h[n] = instance_variable_get(\"@#{n}\")\n        end\n      end\n      # 内部で保持しておくと __attrs__ で参照可\n      define_singleton_method(:__attrs__) { names }\n    end\n  end\nend\n\nclass User\n  include AttrHashable\n  define_attrs :name, :age\nend\n\nu = User.new\nu.name = 'Alice'\nu.age  = 20\nu.to_h            #=> {name: 'Alice', age: 20}\nUser.__attrs__    #=> [:name, :age]",
    hints: [
      "`included` フックで extend(ClassMethods) パターン。",
      "`define_method` でブロック内のローカル変数 (names) を捕捉できる (クロージャ)。",
      "getter/setter の量産は 1 つずつ define_method を呼ぶより、Ruby 組み込みの可変長引数版マクロを 1 行で呼ぶと簡潔です。",
    ],
    reviewPoints: [
      "self.included フックで extend(ClassMethods)",
      "define_method を使ってクロージャで names を保持",
      "instance_variable_get('@name') で動的に取得",
      "attr_accessor(*names) で展開",
      "ActiveSupport::Concern を使わない素の Ruby メタプロ",
      "テスト時に Object.const_set で動的にクラス作って試せる",
    ],
    explanation: {
      summary:
        "include + ClassMethods + define_method はメタプロの基本イディオム。Rails Concern も同じパターンの糖衣構文。",
      reason:
        "Module の `self.included(base)` フックで base.extend(ClassMethods) するパターンは Rails 全体で頻出。define_method はクロージャを作るので def では到達できない動的定義ができる。Gold 試験対策にも最適。",
      commonMistakes: [
        "def メソッド名 ... end で書くと names が見えないため動かない (def はスコープゲート)。define_method がクロージャを作るのが鍵。",
        "instance_variable_get の引数は :@name または '@name' (@ 必須)。",
      ],
    },
  },
];

export const questionsByCategory = (categoryId: string) =>
  questions.filter((q) => q.categoryId === categoryId);

export const findQuestion = (id: string) =>
  questions.find((q) => q.id === id);
