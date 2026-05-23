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
    hints: [
      "文字列とは違い、同じ値であれば常にメモリ上で同じオブジェクトになります。",
      "頭にコロンが付くリテラルです。Hash のキーなどでよく使われます。",
      "答えは `:hello` (Symbol) です。",
    ],
    explanation: {
      summary: "Symbol は immutable で一意なオブジェクト。",
      reason:
        "文字列リテラルは同じ内容でも呼び出すたびに新しいオブジェクトが作られますが、Symbol は同じ名前なら常に同一オブジェクト (object_id が一致) になります。そのため Hash のキーや状態フラグに使うとメモリ効率・比較速度の両面で有利です。",
      codeExample:
        '"hello".object_id  #=> 70...A (毎回違う)\n"hello".object_id  #=> 70...B\n:hello.object_id   #=> 1234 (常に同じ)\n:hello.object_id   #=> 1234\n\n# Hash のキーは Symbol が定番\nuser = { name: "Alice", age: 20 }',
      commonMistakes: [
        "ユーザー入力を Symbol 化 (`to_sym`) すると、外部から無制限にシンボルが生成されてメモリリークの原因になる (Ruby 2.2+ では GC されるが避けるのが無難)。",
      ],
      references: [
        {
          label: "docs.ruby-lang.org - Symbol",
          url: "https://docs.ruby-lang.org/ja/latest/class/Symbol.html",
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
    hints: [
      "`nil` には `to_s` メソッドがあり、エラーにはなりません。",
      "`nil.to_s` は空文字列 `\"\"` を返します。",
      "空文字列の `length` は 0 です。",
    ],
    explanation: {
      summary: "`nil.to_s` は空文字列 `\"\"`、その length は 0。",
      reason:
        "Ruby では nil もオブジェクトで、NilClass に `to_s` / `to_a` / `to_i` などの変換メソッドが定義されています。to_s は空文字を、to_a は空配列を、to_i は 0 を返すように設計されており、メソッドチェーンを切らずに済みます。",
      codeExample:
        'nil.to_s     #=> ""\nnil.to_a     #=> []\nnil.to_i     #=> 0\nnil.inspect  #=> "nil"\n\n# だから安全にチェインできる\nputs (user&.name || "ゲスト").upcase',
      commonMistakes: [
        '`nil.length` は NoMethodError。`nil&.length` (ぼっち演算子) で nil を返すように。',
        "`nil.to_s` を空文字判定に使う際は注意。`nil.to_s.empty? #=> true`",
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
    hints: [
      "JavaScript や Python とは異なるので注意。",
      '`if 0 then puts "truthy" end` は何を出力するか考えてみましょう。',
      "Ruby では `false` と `nil` 以外はすべて truthy です。",
    ],
    explanation: {
      summary: "Ruby で falsy なのは `false` と `nil` だけ。",
      reason:
        "C/JavaScript/Python では 0 や 空文字列 / 空配列も falsy ですが、Ruby は false と nil のみが falsy。他はすべて truthy です。これは設計上「値の有無 (nil) と論理的な偽 (false) を区別する」ためで、整数や空コレクションも「ある値」として扱います。",
      codeExample:
        'if 0       then puts "truthy" end  # => truthy\nif ""      then puts "truthy" end  # => truthy\nif []      then puts "truthy" end  # => truthy\nif false   then puts "truthy" end  # => 出力なし\nif nil     then puts "truthy" end  # => 出力なし',
      commonMistakes: [
        "JS/Python から来ると `if array.length == 0` ではなく `if array` で空判定したくなるが Ruby では誤り。`array.empty?` を使う。",
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
    hints: [
      "`a = b` は参照のコピー (同じオブジェクトを指す) です。",
      "`<<` は破壊的メソッドで、文字列自身を変更します。",
      "結果として `a` も書き換わって見えます。",
    ],
    explanation: {
      summary:
        "`<<` は破壊的に文字列を変更するため、同じオブジェクトを参照している a も変わって見える。",
      reason:
        "Ruby の変数はオブジェクトへの参照です。`b = a` で同じ String オブジェクトを 2 つの変数が指します。`<<` (concat) は新しい文字列を作らずにそのオブジェクト自体を変更するため、a 側にも反映されます。",
      codeExample:
        'a = "hello"\nb = a\nb << " world"   # 破壊的、a も変わる\na  #=> "hello world"\n\n# 非破壊的にする\na = "hello"\nb = a + " world"  # 新しい String が返る\na  #=> "hello"\n\n# 完全に複製する\nb = a.dup',
      commonMistakes: [
        "`+=` は実は非破壊的 (`a = a + b`)。`<<` や `concat` だけが破壊的。",
        "イミュータブルにしたいなら `String#freeze` または `frozen_string_literal: true` マジックコメントを使う。",
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
    hints: [
      "`String#upcase!` のような破壊版のメソッドがあります。",
      "`Array#empty?`、`Integer#even?` のような述語メソッドがあります。",
      "プライベートメソッドの命名規則は特にありません。",
    ],
    explanation: {
      summary:
        "`!` = 破壊的 / 注意が必要、`?` = 真偽値を返す、という慣習。",
      reason:
        "`!` と `?` はメソッド名の一部として認識される識別子で、Ruby のメソッド命名慣習として広く使われます。`!` は『破壊的』というより『驚きがある・要注意』のサインで、対応する非破壊版が存在する時に付けるのが原則 (例: `sort` と `sort!`)。",
      codeExample:
        'str = "hello"\nstr.upcase   #=> "HELLO" (元は変わらず)\nstr.upcase!  #=> "HELLO" (str 自体が変わる)\n\n[].empty?      #=> true\n5.zero?        #=> false\n3.odd?         #=> true\n"abc".include?("b") #=> true',
      commonMistakes: [
        "対応する非破壊版が無いのに `!` を付けるのは慣習違反 (例: `delete!` が単独であるのは紛らわしい)。",
        "`?` 付きメソッドは true/false ではなく nil/値 を返すこともある (例: `Regexp#match?` は true/false だが `Regexp#match` は MatchData/nil)。",
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
      '答えは `upcase`。`"hello".upcase #=> "HELLO"`',
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
      "10 は偶数なので `even?` は true を返します。",
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
      "答えは `to_s`。逆は `to_i`。",
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
      '`greet` は "hello, world" を、`greet("Ruby")` は "hello, Ruby" を返します。',
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
      "false または nil の時に実行されます。",
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
      "答えは `&.`。`x&.foo` は `x.nil? ? nil : x.foo` と同義。",
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
      '"10" + "20" = "1020"、10 + 20 = 30',
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
      "クラス名 `User` も定数の一種。`MAX_SIZE` も定数。",
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
      "b は元の `[1,2,3]` を指したままです。",
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
      "1 == 1 → true、'a'.equal?('a') → false (別オブジェクト)",
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
      "答えは `tap`。デバッグや初期化処理で頻出。",
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
      "複製なので a とは別オブジェクト = どちらも false。",
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
      "1→2, 2→4, 3→6 で `[2, 4, 6]` になります。",
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
      "答えは `fetch`。",
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
      "Ruby 2.6 から `filter` は `select` の別名です。",
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
      "答えは `sum`。",
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
      "0 + 1 + 2 + 3 = 6",
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
      "結果は `{1=>\"a\", 2=>\"b\", 3=>\"c\"}`",
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
      "[1,2] / [3,4] / [5] になります。",
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
      "答えは `reverse`。",
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
      "結果は length をキーにしたハッシュ。",
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
      "each → 元の配列が戻り値、map → ブロックの戻り値を集めた配列。",
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
      "答えは `zip`。",
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
      "1+2+3+4+5 = 15",
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
      "Bob (25 歳) が最年少。",
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
      "答えは `flatten`。",
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
      "`inject` は最後のブロック戻り値が次の acc になりますが、`each_with_object` は object 自体を返します。",
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
      "答えは `attr_accessor :name`。",
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
      "Pochi が @name に代入され、greet で参照される。",
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
      "`class Dog < Animal` が正解。",
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
      "答えは `super`。",
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
      "答え: new できないのが Module の特徴。",
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
      "答えは `self`。",
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
      "`self.private_method` は NG ですが `private_method` (レシーバ省略) は OK。",
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
      "Hash より型がはっきりした値オブジェクトに使う。",
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
      "答えは `self`。",
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
      "値オブジェクトとして「他言語の record/data class 相当」が必要なら Struct。",
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
      "`{ |x| x * 3 }` に 10 が渡され、30 が返る。",
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
      "違いは 2 つ: 引数数のチェック、return の振る舞い。",
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
      "答えは `ensure`。",
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
      "答えは `(&:to_s)`。",
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
      "`anything` は未定義なので method_missing が呼ばれる。",
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
      "答えは `define_method`。",
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
      "A.hello は NoMethodError、M.hello は呼べる。",
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
      "答えは `&blk`。",
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
      "答えは「モンキーパッチ」または「オープンクラス」。",
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
      "Ruby 2.1+ で世代別 (RGenGC) 導入。",
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
      "'hello' は String かつ length > 3 なので最初の節にマッチ。",
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
      "答えは `users`。",
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
      "Controller はリクエストを受けて Model や View を呼び出します。",
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
      "答えは `blog_posts_controller` (クラス名は `BlogPostsController`)。",
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
      "「設定より規約」が直訳。",
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
      "答えは『View 用の補助メソッド』。",
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
      "答えは `environment` (環境)。",
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
      "`blog_post.rb` → `BlogPost`、`admin/users_controller.rb` → `Admin::UsersController`。",
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
      "両方の書き方が存在しますが、もっとも一般的なのは環境変数指定。",
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
      "答えは `credentials.yml.enc` + `rails credentials:edit`。",
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
      "`search` は標準ではない。",
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
      "URL の `:id` は `params[:id]` で取れます。",
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
      "答えは `redirect_to`。",
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
      "現在の慣習は `before_action :authenticate_user!` のような書き方。",
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
      "コントローラでは `params[:post_id]` でアクセス。",
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
      "ファイル配置: `app/controllers/admin/users_controller.rb`",
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
      "答えは `rails routes`。",
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
      "`render redirect_to:` は存在しないオプション。",
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
      "4xx 系で返すと「失敗」と認識してフォームに置き換える。",
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
      "`has_many :posts`。",
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
      "答えは `find`。",
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
      "`find_each` や `in_batches` でバッチ処理すべき。",
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
      "全部 N+1 対策に使えます。",
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
      "答え例: `AddNameToUsers name:string` (型省略可)",
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
      "答えは `validates :name, presence: true`。",
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
      "答えは `scope`。",
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
      "答えはいずれかでOK。",
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
      "`has_and_belongs_to_many` (HABTM) は中間テーブルのみ。",
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
      "答えは `lock_version`。",
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
      "両方が定石。",
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
      "奇数 1,3,5 を 2 倍した [2,6,10] が answer。",
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
      "2回目は明示的に 'Hi'。",
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
      "value を累積加算: 1 + 2 + 3 = 6。",
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
      "3 回 new されたので 3。",
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
      "10*1 + 20*2 + 30*3 = 10 + 40 + 90 = 140。",
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
      "`max` → 7。",
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
      "'hi' は truthy なのでそのまま。",
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
      "i=2: 2*10, 2*20 → 20, 40。i=3: 3*10, 3*20 → 30, 60。",
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
      "結果: '[ADMIN] Hi, I'm Alice'",
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
      "3 回目: Integer / String は TypeError → e.class.name = 'TypeError'。",
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
];

export const questionsByCategory = (categoryId: string) =>
  questions.filter((q) => q.categoryId === categoryId);

export const findQuestion = (id: string) =>
  questions.find((q) => q.id === id);
