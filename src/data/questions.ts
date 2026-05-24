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
      codeExample:
        '"hello".upcase      #=> "HELLO"\n"HELLO".downcase    #=> "hello"\n"hello".capitalize  #=> "Hello"\n"Hello".swapcase    #=> "hELLO"\n\n# 破壊版\ns = "hello"\ns.upcase!  #=> "HELLO"\ns          #=> "HELLO"',
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
    hints: [
      "ダブルクォートとシングルクォートには違いがあります。",
      "式展開 `#{}` が動くのはどちらか？",
      "シングルクォートでは `#{}` がそのまま文字列として表示されます。",
    ],
    explanation: {
      summary: "ダブルクォートのみ式展開とエスケープシーケンスが有効。",
      reason:
        'シングルクォート文字列はリテラル通り (ほぼ raw string)、ダブルクォート文字列は `#{式}` の式展開と `\\n` などのエスケープシーケンスを解釈します。パフォーマンス差はほぼ無いので「式展開・改行コードを使うか」で選び、なるべくダブルクォート優位で書く流派が多いです。',
      codeExample:
        'n = 3\n"#{n} 回"    #=> "3 回"\n\'#{n} 回\'   #=> "#{n} 回"\n\n"a\\nb"   #=> "a\nb" (改行)\n\'a\\nb\'  #=> "a\\\\nb" (バックスラッシュとn)',
      commonMistakes: [
        "Rubocop の Style/StringLiterals は式展開不要ならシングルクォート推奨だが、Rails アプリの多くはダブルクォート統一。プロジェクト規約に合わせる。",
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
      codeExample:
        "10.respond_to?(:even?)   #=> true\n\"a\".respond_to?(:even?)  #=> false\n10.respond_to?(:foo)     #=> false\n\n# Duck Typing\nif obj.respond_to?(:each)\n  obj.each { |x| puts x }\nend",
      commonMistakes: [
        "`respond_to?` はプライベートメソッドを検出しない。第2引数に true を渡すと検出する: `obj.respond_to?(:foo, true)`",
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
      codeExample:
        '123.to_s        #=> "123"\n"123".to_i      #=> 123\n"abc".to_i      #=> 0 (失敗時)\nInteger("abc")  #=> ArgumentError (厳格版)\n\n3.14.to_i       #=> 3 (切り捨て)\n"3.14".to_f     #=> 3.14',
      commonMistakes: [
        "`to_i` は失敗時に 0 を返す。エラーで気付きたい時は Kernel の `Integer(\"abc\")` を使う。",
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
    hints: [
      "デフォルト引数が定義されています。",
      "引数なしで呼ぶと、デフォルト値が使われます。",
      "引数指定があれば渡した値、無ければ仮引数の右辺が `name` に入る、と整理して 2 つの出力を順に組み立ててください。",
    ],
    explanation: {
      summary: "デフォルト引数は呼び出し時に引数省略するとその値が使われる。",
      reason:
        "Ruby のメソッドは `def name(arg = デフォルト値)` でデフォルト引数を設定できます。デフォルト値は呼び出し毎に評価されるので、`Time.now` のような動的な値も使えます。",
      codeExample:
        'def log(msg, time = Time.now)\n  puts "[#{time}] #{msg}"\nend\n\nlog("起動")  # 毎回 Time.now が評価される\n\n# キーワード引数も可\ndef create(name:, role: "user")\n  { name: name, role: role }\nend\ncreate(name: "Alice")  #=> {name: "Alice", role: "user"}',
      commonMistakes: [
        "デフォルトに `Time.now` を入れた場合、メソッド呼び出し毎に評価される (Python と違って定義時には評価されない)。これは Python と Ruby の重要な差。",
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
    hints: [
      "`unless` は「〜でない限り」という意味の英語。",
      "`if !condition` と等価です。",
      "「条件を反転した if」であり、Ruby で falsy として扱われる値はちょうど 2 種類だけだったことを思い出してください。",
    ],
    explanation: {
      summary: "`unless` は条件が false / nil の時に実行 (if の逆)。",
      reason:
        "`unless cond` は `if !cond` と等価で、否定条件を自然な英語で書けるシンタックスシュガー。後置 unless 修飾子も使えます: `do_something unless condition`。",
      codeExample:
        'unless user.admin?\n  redirect_to root_path\nend\n# 同じ意味\nif !user.admin?\n  redirect_to root_path\nend\n\n# 後置記法\nreturn unless valid?\nputs "OK" unless errors.any?',
      commonMistakes: [
        "`unless ~ else` は読みにくいので避ける (RuboCop でも警告)。`if` で書き直す。",
        "複雑な条件 (`unless a && !b`) も避ける。否定の入れ子は混乱の元。",
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
      codeExample:
        '# 従来\nname = user.nil? ? nil : user.profile.nil? ? nil : user.profile.name\n\n# &. を使うと\nname = user&.profile&.name\n\n# 配列のアクセス\narr&.[](0)        # 配列が nil でも安全\n\n# 注意: false に対しても呼ばれる (nil だけ短絡)\nfalse&.to_s       #=> "false" (呼ばれる)\nnil&.to_s         #=> nil    (呼ばれない)',
      commonMistakes: [
        "`&.` の乱用は nil 安全と見せかけて bug を隠す。本来 nil であってはならない箇所では明示的に検証する。",
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
    hints: [
      "`+` は文字列同士、数値同士で挙動が違います。",
      "文字列 + 文字列 は結合、数値 + 数値 は加算。",
      "1 行目は文字列同士の結合、2 行目は整数同士の加算として動くので、結果の見た目がまったく異なります。",
    ],
    explanation: {
      summary: "型変換しないと文字列結合と加算が混在する。",
      reason:
        "Ruby は型に厳格 (strict typing) なので、`\"10\" + 20` のような暗黙変換はせず `TypeError` を投げます。明示的に `to_s` / `to_i` で揃える必要があります。",
      codeExample:
        '"10" + "20"   #=> "1020"   # 文字列結合\n10 + 20       #=> 30       # 加算\n"10" + 20     #=> TypeError\n"10".to_i + 20 #=> 30\n10.to_s + "20" #=> "1020"',
      commonMistakes: [
        "JS 経験者が `\"10\" + 20` を 30 と勘違いするが、Ruby はエラー。明示変換が必要。",
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
      codeExample:
        'MAX_SIZE = 100      # 定数\nPi = 3.14           # これも定数\nclass User; end     # 定数 User に Class を代入しているのと同じ\n\n# 定数の再代入は警告\nMAX_SIZE = 200      # warning: already initialized constant MAX_SIZE\n\n# でも中身は変更できる (mutable オブジェクトの場合)\nLIST = []\nLIST << 1           # 警告なし',
      commonMistakes: [
        "定数は値の再代入で警告するが、中身の変更 (mutate) は防げない。`.freeze` で対策。`LIST = [].freeze`",
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
      codeExample:
        "a = [1, 2, 3]\nb = a       # b と a は同じオブジェクトを指す\n\na = a + [4] # 新しい配列が a に\na  #=> [1,2,3,4]\nb  #=> [1,2,3]\n\n# 破壊的にすると\na = [1, 2, 3]\nb = a\na << 4\nb  #=> [1,2,3,4]   ← b も変わる",
      commonMistakes: [
        "`+=` も `<<` も同じだと思いがちだが、`a += [4]` は `a = a + [4]` の糖衣構文で非破壊。`<<` だけが破壊的。",
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
      codeExample:
        '"abc" == "abc"      #=> true   (値が同じ)\n"abc".equal?("abc") #=> false  (別オブジェクト)\n\n1 == 1.0            #=> true   (数値として等価)\n1.eql?(1.0)         #=> false  (型が違う)\n1.equal?(1)         #=> true   (Integer はキャッシュ)\n\n# Hash のキー比較は eql?\n{ 1 => "a" }[1.0]   #=> nil    (eql? で違うので)',
      commonMistakes: [
        "Hash のキーは `eql?` と `hash` で比較されるため、`1` と `1.0` は別キーとして扱われる。",
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
      codeExample:
        '[1,2,3].tap { |a| puts "middle: #{a}" }.map { |x| x*2 }\n# middle: [1, 2, 3]\n#=> [2, 4, 6]\n\n# 初期化\nUser.new.tap do |u|\n  u.name = "Alice"\n  u.age  = 20\nend\n\n# then は変換用\n[1,2,3].then { |a| a.sum }   #=> 6',
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
      codeExample:
        'a = "abc".freeze\nb = a.dup     # 凍結解除される\nc = a.clone   # 凍結も維持\n\nb.frozen?  #=> false\nc.frozen?  #=> true\n\n# どちらも別オブジェクト\na.equal?(b)  #=> false\na.equal?(c)  #=> false',
      commonMistakes: [
        "dup / clone は「浅いコピー (shallow copy)」。中の配列や Hash までは複製しないので注意。深いコピーが欲しければ `Marshal.load(Marshal.dump(obj))`。",
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
      codeExample:
        '# app/models/user.rb\nclass User < ApplicationRecord\n  # 規約通りなら自動でテーブル "users" を使う\nend\n\n# 非規約のテーブル名を使う場合\nclass LegacyUser < ApplicationRecord\n  self.table_name = "legacy_user_data"\nend\n\n# Inflector で確認\n"user".pluralize       #=> "users"\n"person".pluralize     #=> "people"\n"BlogPost".tableize    #=> "blog_posts"',
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
      codeExample:
        '# Controller: 受け取って Model に依頼、View へ\nclass PostsController < ApplicationController\n  def show\n    @post = Post.find(params[:id])   # Model から取得\n  end                                  # View (show.html.erb) で表示\nend\n\n# Model: データ操作 + ロジック\nclass Post < ApplicationRecord\n  belongs_to :author, class_name: "User"\n  def excerpt(length = 100)\n    body.first(length)\n  end\nend\n\n# View: テンプレート\n# app/views/posts/show.html.erb\n# <h1><%= @post.title %></h1>',
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
      codeExample:
        "# app/controllers/blog_posts_controller.rb\nclass BlogPostsController < ApplicationController\n  def index\n    @posts = BlogPost.recent\n  end\nend\n\n# routes\nresources :blog_posts\n\n# URL helpers\nblog_posts_path     # /blog_posts\nblog_post_path(1)   # /blog_posts/1",
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
      codeExample:
        "# 規約に従う\nclass User < ApplicationRecord; end\n# → テーブル: users, 主キー: id, 自動で動く\n\n# 規約から外れる\nclass LegacyUser < ApplicationRecord\n  self.table_name        = \"tbl_users\"\n  self.primary_key       = \"user_no\"\n  self.inheritance_column = \"type_code\"\nend",
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
      codeExample:
        '# app/helpers/application_helper.rb\nmodule ApplicationHelper\n  def format_price(yen)\n    "¥#{number_with_delimiter(yen)}"\n  end\nend\n\n# View で\n<%= format_price(@product.price) %>\n# => ¥1,200\n\n# Rails 標準の便利 helper\n<%= link_to "詳細", post_path(@post) %>\n<%= time_ago_in_words(@post.created_at) %>',
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
      codeExample:
        '# app/services/post_publisher.rb\nclass PostPublisher\n  def initialize(post); @post = post; end\n  def call\n    @post.update!(published_at: Time.current)\n    NotifyMailer.published(@post).deliver_later\n  end\nend\n\n# Controller から\nPostPublisher.new(@post).call\n\n# Concern (Module で共有)\n# app/models/concerns/soft_deletable.rb\nmodule SoftDeletable\n  extend ActiveSupport::Concern\n  included do\n    scope :active, -> { where(deleted_at: nil) }\n  end\nend',
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
      codeExample:
        '# config/database.yml\ndevelopment:\n  adapter: postgresql\n  database: myapp_dev\ntest:\n  database: myapp_test\nproduction:\n  url: <%= ENV["DATABASE_URL"] %>\n\n# コード内\nif Rails.env.production?\n  send_email\nelse\n  Rails.logger.info "skipped"\nend',
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
      codeExample:
        '# 例\napp/models/user.rb                  → User\napp/models/blog_post.rb             → BlogPost\napp/controllers/admin/users_controller.rb\n                                    → Admin::UsersController\napp/services/posts/publisher.rb     → Posts::Publisher\n\n# 規約違反の例 (エラーになる)\n# app/models/user.rb の中で class Person を定義 → NameError',
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
      codeExample:
        "# 本番接続で起動 (危険なので慎重に)\nRAILS_ENV=production rails console\n# または\nrails console -e production\n\n# サンドボックスモード (終了時に全変更ロールバック)\nrails console --sandbox\nRAILS_ENV=production rails c --sandbox\n\n# Rails 7+ で immutable な調査推奨パターン\nuser = User.find(1)\nuser.attributes  # 確認のみ",
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
      codeExample:
        '# 編集 (一時的に復号して $EDITOR で開く)\nEDITOR=vim rails credentials:edit\n# または環境別\nEDITOR=vim rails credentials:edit --environment production\n\n# コード内で参照\nRails.application.credentials.aws[:access_key_id]\nRails.application.credentials.dig(:stripe, :secret_key)\n\n# 本番環境変数\nRAILS_MASTER_KEY="abc..." # ECS/Heroku 等で設定',
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
    hints: [
      "1対多の関係です。",
      "`has_*` の系統。",
      "User 側 (= 親) から見て複数の Post を持つ関係なので、メソッド名は「複数を持つ」を意味する 8 文字で、引数は複数形のシンボル。",
    ],
    explanation: {
      summary: "1対多は親 `has_many`、子 `belongs_to`。",
      reason:
        "子側 (posts テーブル) に `user_id` 外部キーが必要。`belongs_to` は Rails 5+ で必須デフォルト (nil 不可)。`optional: true` で null 許容。",
      codeExample:
        'class User < ApplicationRecord\n  has_many :posts, dependent: :destroy\nend\n\nclass Post < ApplicationRecord\n  belongs_to :user                  # user_id NOT NULL\n  belongs_to :category, optional: true  # null OK\nend\n\n# 使い方\nuser = User.find(1)\nuser.posts             # User の Post 一覧\nuser.posts.create!(title: "Hi")\npost.user              # Post の User\n\n# マイグレーション\nt.references :user, null: false, foreign_key: true',
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
      codeExample:
        "User.find(1)              # 例外 ActiveRecord::RecordNotFound\nUser.find_by(id: 1)       # nil\nUser.find_by(email: 'a')  # 条件でも使える\nUser.where(id: 1).first   # nil\n\n# 複数取得\nUser.find([1, 2, 3])      # 例外 (1つでも無いと)\nUser.where(id: [1,2,3])   # 集合",
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
      codeExample:
        "# 危険 (100万件あったらOOM)\nUser.all.each { |u| u.send_email }\n\n# 安全\nUser.find_each(batch_size: 500) { |u| u.send_email }\n\n# バッチ毎に処理\nUser.in_batches(of: 1000) do |batch|\n  batch.update_all(active: true)\nend",
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
      codeExample:
        "# N+1 (悪)\nPost.all.each { |p| puts p.user.name }\n# SELECT * FROM posts;\n# SELECT * FROM users WHERE id = 1;\n# SELECT * FROM users WHERE id = 2;  ← N+1\n\n# 対策\nPost.includes(:user).each { |p| puts p.user.name }\n# SELECT * FROM posts;\n# SELECT * FROM users WHERE id IN (1,2,...);\n\n# JOIN したい (条件付き)\nPost.eager_load(:user).where(users: { active: true })",
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
      codeExample:
        "# 生成\nrails g migration AddNameToUsers name:string\n\n# 中身 (自動生成される)\nclass AddNameToUsers < ActiveRecord::Migration[7.1]\n  def change\n    add_column :users, :name, :string\n  end\nend\n\n# 関連の追加\nrails g migration AddUserRefToPosts user:references\n# → add_reference :posts, :user, null: false, foreign_key: true\n\nrails db:migrate\nrails db:rollback",
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
      codeExample:
        "class User < ApplicationRecord\n  validates :name,  presence: true, length: { maximum: 50 }\n  validates :email, presence: true, uniqueness: true,\n                    format: { with: URI::MailTo::EMAIL_REGEXP }\n  validates :age,   numericality: { greater_than_or_equal_to: 0 }\n\n  validate :name_must_not_contain_admin  # カスタム\n\n  private\n\n  def name_must_not_contain_admin\n    errors.add(:name, \"can't include 'admin'\") if name&.include?(\"admin\")\n  end\nend",
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
      codeExample:
        "class Post < ApplicationRecord\n  scope :published, -> { where(published: true) }\n  scope :recent,    -> { order(created_at: :desc) }\n  scope :by_year,   ->(year) { where(year: year) }\nend\n\nPost.published.recent.by_year(2024)\n# SELECT * FROM posts WHERE published=true AND year=2024\n# ORDER BY created_at DESC\n\n# クラスメソッドでも同等\ndef self.published\n  where(published: true)\nend",
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
      codeExample:
        "u = User.new                           # 必須項目空\nu.save                                #=> false\nu.errors.full_messages                #=> [\"Name can't be blank\"]\nu.save!                               # ActiveRecord::RecordInvalid\n\n# トランザクション内では ! 系を使う\nActiveRecord::Base.transaction do\n  user.save!\n  account.save!                       # 失敗すれば両方ロールバック\nend",
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
      codeExample:
        "# IN\nPost.where(user_id: [1,2,3])\n\n# BETWEEN\nPost.where(created_at: 1.week.ago..)\n\n# IS NULL\nPost.where(deleted_at: nil)\n\n# プレースホルダ\nPost.where('title LIKE ?', \"%#{q}%\")\nPost.where('title LIKE :q', q: \"%#{q}%\")\n\n# ❌ 危険 (SQL injection)\n# Post.where(\"title = '#{user_input}'\")\n\n# OR\nPost.where(user_id: 1).or(Post.where(user_id: 2))",
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
      codeExample:
        'class Post < ApplicationRecord\n  before_validation :set_slug\n  before_save       :strip_whitespace\n  after_create      :send_notification\n  before_destroy    :prevent_if_published\n\n  private\n\n  def set_slug\n    self.slug ||= title.parameterize\n  end\n\n  def strip_whitespace\n    self.title = title&.strip\n  end\n\n  def send_notification\n    NotifyJob.perform_later(self)\n  end\n\n  def prevent_if_published\n    throw :abort if published?\n  end\nend',
      commonMistakes: [
        "コールバックの乱用はテストしにくくなる。複雑な処理は Service Object などに切り出すのが現代的。",
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
      codeExample:
        "# UI フォーム\ndef create\n  @user = User.create(user_params)\n  if @user.persisted?\n    redirect_to @user\n  else\n    render :new, status: :unprocessable_entity\n  end\nend\n\n# Job / トランザクション内\nActiveRecord::Base.transaction do\n  user    = User.create!(name: 'A')\n  account = Account.create!(user: user)\nend  # 失敗すれば自動 ROLLBACK",
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
      codeExample:
        "# 高速 (コールバック飛ばす)\nUser.where(active: false).update_all(active: true, updated_at: Time.current)\nPost.where(spam: true).delete_all\n\n# 1件ずつ呼ぶ (コールバックあり)\nUser.where(active: false).each(&:destroy)\nUser.where(active: false).destroy_all\n\n# パフォーマンス比較\n# update_all:  1 クエリ\n# update each: N クエリ + コールバック",
      commonMistakes: [
        "update_all は updated_at を自動更新しない。必要なら明示的に渡す。",
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
      codeExample:
        "# has_many :through (推奨)\nclass User < ApplicationRecord\n  has_many :memberships\n  has_many :groups, through: :memberships\nend\n\nclass Membership < ApplicationRecord\n  belongs_to :user\n  belongs_to :group\n  # role などの追加カラムが持てる\nend\n\nclass Group < ApplicationRecord\n  has_many :memberships\n  has_many :users, through: :memberships\nend\n\n# HABTM (シンプル、属性不要)\nclass User < ApplicationRecord\n  has_and_belongs_to_many :groups\nend\n# groups_users テーブル (user_id, group_id) が必要",
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
      codeExample:
        "# 関連で実演\nuser = User.find(1)\nuser.posts                # まだロードしない\nuser.posts.count          # SELECT COUNT(*) FROM posts\nuser.posts.size           # SELECT COUNT(*) FROM posts (同じ)\nuser.posts.length         # SELECT * FROM posts → length\n\nuser.posts.to_a           # ロード完了\nuser.posts.count          # また COUNT クエリ (無駄)\nuser.posts.size           # ロード済み配列の length (賢い)\nuser.posts.length         # 配列の length",
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
      codeExample:
        '# migration\nadd_column :users, :lock_version, :integer, default: 0, null: false\n\n# 使い方は普通\nuser = User.find(1)        # lock_version = 5\nuser.name = "Alice"\nuser.save                  # WHERE lock_version = 5\n# 別プロセスが先に更新していたら StaleObjectError\n\nbegin\n  user.save!\nrescue ActiveRecord::StaleObjectError\n  retry  # 再読込して再試行\nend',
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
      codeExample:
        "has_many :posts, dependent: :destroy           # 1件ずつ destroy\nhas_many :posts, dependent: :delete_all        # 一括 DELETE\nhas_many :posts, dependent: :nullify           # posts.user_id = NULL\nhas_many :posts, dependent: :restrict_with_error\nhas_many :posts, dependent: :restrict_with_exception\n\n# Active Storage や paper_trail を使うなら :destroy 必須\n# (ファイル削除や履歴記録のため)",
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
      codeExample:
        '# migration\nadd_index :likes, [:user_id, :post_id], unique: true\n\n# model\nclass Like < ApplicationRecord\n  belongs_to :user\n  belongs_to :post\n  validates :user_id, uniqueness: { scope: :post_id }\nend\n\n# それでも race で DB エラーが出ることはあるので rescue\nLike.create(user: u, post: p)\nrescue ActiveRecord::RecordNotUnique\n  # 既に存在\nend',
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
      codeExample:
        '# 危険な例\nrename_column :users, :email, :email_address  # 旧コード壊れる\n\n# ゼロダウン的な対応\n# Step 1: 新カラム追加 + 同期\nadd_column :users, :email_address, :string\n# アプリ側で両方に書き込む期間\n\n# Step 2: バックフィル (バッチ)\nUser.in_batches { |b| b.update_all("email_address = email") }\n\n# Step 3: 旧カラム削除 (全コードが新カラム参照に)\nremove_column :users, :email\n\n# strong_migrations gem で警告\ngem "strong_migrations"',
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
      codeExample:
        '"hello world" =~ /o(.)/    # マッチ位置 4 を返す\n$~              #=> #<MatchData "o " 1:" ">\n$~[0]           #=> "o " (マッチ全体)\n$~[1]           #=> " " (1番目のキャプチャ)\n$1              #=> " " (同じ)\n\n# 名前付きキャプチャ\n"2024-01-15" =~ /(?<year>\\d+)-(?<month>\\d+)/\n$~[:year]       #=> "2024"',
      commonMistakes: [
        "`$1` などのグローバル変数は使い捨て。マルチスレッドや別マッチで上書きされるので、安全な MatchData オブジェクトを変数で受けるのが良い。",
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
    explanation: {
      summary:
        "`String#scan(regexp)` はマッチした部分文字列を配列で返す。",
      reason:
        "`match` は最初のマッチ 1 件、`scan` は全マッチを配列で。キャプチャグループがあるとキャプチャごとに配列の配列を返す: `scan(/(\\w+)=(\\w+)/) #=> [[\"a\",\"1\"], ...]`。",
      codeExample:
        '"abc-123-xyz".scan(/\\d+/)        #=> ["123"]\n"a1b2c3".scan(/[a-z](\\d)/)        #=> [["1"], ["2"], ["3"]]\n"name=alice&age=20".scan(/(\\w+)=(\\w+)/)\n#=> [["name","alice"], ["age","20"]]\n\n# Hash 化\n"name=alice&age=20".scan(/(\\w+)=(\\w+)/).to_h\n#=> {"name"=>"alice", "age"=>"20"}',
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
      codeExample:
        '"  hello  ".strip       #=> "hello"\n"  hello  ".lstrip      #=> "hello  "\n"  hello  ".rstrip      #=> "  hello"\n"\\n\\t  hi \\n".strip    #=> "hi"\n\n# 文字列全体から空白を削除\n"a b c".gsub(/\\s/, "")  #=> "abc"\n"a b c".tr(" ", "")     #=> "abc"',
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
      codeExample:
        '"abc,def,ghi".split(",")          #=> ["abc","def","ghi"]\n"  a   b   c  ".split             #=> ["a","b","c"] (連続空白で分割)\n\n# 結合\n["a","b","c"].join("-")           #=> "a-b-c"\n\n# CSV パース\nrequire "csv"\nCSV.parse("a,b,c\\n1,2,3")\n#=> [["a","b","c"], ["1","2","3"]]',
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
    hints: [
      "`Date + 整数` は日付加算。",
      "1月31日 + 1日 = 2月1日。",
      "Date クラスは日数計算を月またぎで正しく処理。",
    ],
    explanation: {
      summary: "Date オブジェクト + 整数 は日付加算 (月またぎ・うるう年も正しく処理)。",
      reason:
        "`Date` は date 標準ライブラリ。`Date + n` は n 日後、`Date - other_date` は日数差 (Rational)。`Date.today`, `Date.parse`, `Date#strftime` も頻出。",
      codeExample:
        'require "date"\nDate.new(2024, 1, 31) + 1     #=> #<Date: 2024-02-01>\nDate.today                     # 今日\nDate.parse("2024-12-25")       # 文字列パース\nDate.today.strftime("%Y/%m/%d")\n\n# Date と DateTime と Time\n# Date     : 日付のみ\n# DateTime : 日付 + 時刻 (廃止予定的、Time 推奨)\n# Time     : 時刻 (タイムゾーン対応)',
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
      codeExample:
        'Time.now                  # システムローカル\nTime.now.utc              # UTC に変換\nTime.now.strftime("%Y-%m-%d %H:%M:%S")\n\n# Rails (ActiveSupport)\nTime.current              #=> Time.zone.now\nTime.zone.now\n1.hour.ago                # 1時間前\n3.days.from_now           # 3日後\nTime.zone                 #=> #<ActiveSupport::TimeZone: Tokyo>',
      commonMistakes: [
        "Rails で `Time.now` を直接使うとタイムゾーンが OS 依存になりバグの元。`Time.current` を使う。",
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
      codeExample:
        '# 書き込み (自動 close)\nFile.open("data.txt", "w") do |f|\n  f.puts "line1"     # 改行つき\n  f.print "line2"    # 改行なし\nend\n\n# 1 行ずつ読み込み (大きいファイル向け)\nFile.foreach("data.txt") do |line|\n  puts line.chomp\nend\n\n# 一括\ncontent = File.read("data.txt")\nlines   = File.readlines("data.txt")  # 行配列',
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
      codeExample:
        'ENV["PATH"]                 # 取得 (nil 可)\nENV.fetch("DATABASE_URL")   # 無ければ例外\nENV.fetch("RAILS_ENV", "development")  # デフォルト指定\n\n# 全環境変数\nENV.to_h\n\n# 設定 (現在プロセスのみ)\nENV["FOO"] = "bar"\n\n# Rails の credentials を使う方がベター\nRails.application.credentials.aws[:key]',
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
      codeExample:
        'begin\n  begin\n    raise "first"\n  rescue => e\n    raise ArgumentError, "second"\n  end\nrescue ArgumentError => e\n  puts "caught: #{e.message}"   # caught: second\nend\n\n# 例外チェーンを保持\nbegin\n  raise OriginalError\nrescue => e\n  raise NewError, "wrapped"     # e が e.cause として保持される\nend',
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
      codeExample:
        "# 良い例\nclass MyError < StandardError; end\n\n# rescue StandardError (引数省略時のデフォルト)\nbegin\n  ...\nrescue => e          # = rescue StandardError => e\n  log(e)\nend\n\n# ダメな例 (Ctrl-C も捕まえてしまう)\nbegin\n  ...\nrescue Exception => e    # NG\nend",
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
      codeExample:
        's = "hello"\ns[0..2]       #=> "hel"\ns[0..]        #=> "hello"\ns[-3..]       #=> "llo"\ns[1, 3]       #=> "ell"\ns[10]         #=> nil  (範囲外)\ns[/l+/]       #=> "ll" (正規表現マッチ)\ns[/(\\w)\\w/, 1] #=> "h" (キャプチャ)',
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
      codeExample:
        '3.times { |i| puts i }       # 0, 1, 2\n1.upto(3) { |i| puts i }     # 1, 2, 3\n3.downto(1) { |i| puts i }   # 3, 2, 1\n1.step(10, 2) { |i| puts i } # 1, 3, 5, 7, 9\n\n# Array.new も times パターン\nArray.new(3) { |i| i * 2 }   #=> [0, 2, 4]',
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
      codeExample:
        "User.pluck(:email)\n#=> [\"a@x\", \"b@y\", ...]\n# SELECT \"users\".\"email\" FROM \"users\"\n\nUser.pluck(:id, :name)\n#=> [[1, \"Alice\"], [2, \"Bob\"], ...]\n\n# 重複しない\nUser.distinct.pluck(:role)\n\n# pluck で COUNT などの式も書ける\nUser.group(:role).pluck(:role, Arel.sql('COUNT(*)'))",
      commonMistakes: [
        "pluck は AR コールバックや関連ロードをスキップする。オブジェクトとして扱いたい時は使えない。",
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
      codeExample:
        "# 取得 or 作成 (保存)\nuser = User.find_or_create_by(email: 'a@x') do |u|\n  u.name = 'Alice'\nend\n\n# 取得 or 初期化のみ (未保存)\nuser = User.find_or_initialize_by(email: 'a@x')\nuser.name = 'Alice'\nuser.save\n\n# race 対策\nuser = User.find_or_create_by(email: 'a@x')\nrescue ActiveRecord::RecordNotUnique\nuser = User.find_by(email: 'a@x')",
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
      codeExample:
        'class User < ApplicationRecord\n  has_many :tagging\n  has_many :tags, through: :tagging\nend\n\nclass Tagging < ApplicationRecord\n  belongs_to :user\n  belongs_to :tag\n  # added_at, role などの追加属性が持てる\nend\n\nclass Tag < ApplicationRecord\n  has_many :tagging\n  has_many :users, through: :tagging\nend\n\nuser.tags << Tag.find(1)   # 中間レコードを自動作成',
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
      codeExample:
        "ActiveRecord::Base.transaction do\n  user.save!                       # 失敗で例外 → ロールバック\n  account.save!\nend\n\n# 例外伝播なしでロールバック\nActiveRecord::Base.transaction do\n  do_something\n  raise ActiveRecord::Rollback if condition\nend\n\n# ネスト (savepoint)\nActiveRecord::Base.transaction do\n  user.save!\n  ActiveRecord::Base.transaction(requires_new: true) do\n    inner.save!\n  end\nend",
      commonMistakes: [
        "transaction 内で `save` (! なし) して if 分岐すると、save が false でもロールバックされない。必ず `!` 系か `raise ActiveRecord::Rollback`。",
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
      codeExample:
        "Post.joins(:user)\n    .where(users: { active: true })\n    .group('users.id')\n    .count\n#=> {1=>5, 2=>3, ...} (user_id => post count)\n\n# user オブジェクト付きで\nresult = User.left_joins(:posts).group('users.id').count('posts.id')\n\n# 集計後の条件\nPost.group(:user_id).having('count(*) > ?', 10).count",
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
