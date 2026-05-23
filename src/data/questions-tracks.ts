import type { Question } from "@/lib/types";

// JavaScript / TypeScript / React / Next.js / Nuxt / Python トラック用問題集
export const trackQuestions: Question[] = [
  // ===========================================================================
  // 🟨 JavaScript 基礎 (js-001 〜 js-010)
  // ===========================================================================
  {
    id: "js-001",
    categoryId: "js-basics",
    difficulty: "beginner",
    type: "choice",
    question: "次のコードの出力は？",
    code: "console.log(typeof null)\nconsole.log(typeof undefined)\nconsole.log(typeof [])",
    choices: [
      "object / undefined / object",
      "null / undefined / array",
      "object / object / array",
      "undefined / undefined / object",
    ],
    answerIndex: 0,
    hints: [
      "typeof null は歴史的なバグで知られる結果を返す。",
      "undefined だけは独自のプリミティブ型。",
      "配列は実際にはオブジェクトの一種。",
    ],
    explanation: {
      summary:
        "`typeof null` は 'object' (歴史的バグ)、`typeof undefined` は 'undefined'、配列は 'object'。",
      reason:
        "JavaScript 仕様の初期からの互換性バグで `typeof null === 'object'`。配列を判定するには `Array.isArray(arr)` を使う。null チェックは `=== null` か `== null` (undefined も含めて) で。",
      codeExample:
        "typeof null            // 'object' (バグ)\ntypeof undefined       // 'undefined'\ntypeof []              // 'object'\nArray.isArray([])      // true\ntypeof 42              // 'number'\ntypeof NaN             // 'number'\ntypeof function(){}    // 'function'\ntypeof Symbol()        // 'symbol'\n\n// null チェック\nval === null           // 厳密\nval == null            // null か undefined",
    },
  },
  {
    id: "js-002",
    categoryId: "js-basics",
    difficulty: "beginner",
    type: "choice",
    question: "次のうち、JavaScript の falsy な値の組合せは？",
    choices: [
      "false, 0, '', null, undefined, NaN",
      "false, 0, [], {}, null",
      "false のみ",
      "0 と '' のみ",
    ],
    answerIndex: 0,
    hints: [
      "if (val) で falsy 判定される値は限られている。",
      "空配列 [] と空オブジェクト {} は truthy。",
      "NaN も falsy なので注意 (=== NaN は常に false なので isNaN で判定)。",
    ],
    explanation: {
      summary:
        "JavaScript の falsy: `false`, `0`, `''` (空文字), `null`, `undefined`, `NaN`, `0n` (BigInt)。`[]` と `{}` は truthy。",
      reason:
        "Ruby と違い、空文字や 0 も falsy。空配列・空オブジェクトは truthy なので注意 (Python と逆)。`!!val` で boolean 変換、`val ?? default` (Nullish Coalescing) で null/undefined だけ判定。",
      codeExample:
        "// falsy\nBoolean(false)        // false\nBoolean(0)            // false\nBoolean('')           // false\nBoolean(null)         // false\nBoolean(undefined)    // false\nBoolean(NaN)          // false\n\n// truthy (Ruby と違う点)\nBoolean([])           // true (Ruby は true / Python は false)\nBoolean({})           // true\nBoolean('false')      // true (文字列)\n\n// null/undefined のみ判定\nval ?? 'default'      // null / undefined だけ default に",
    },
  },
  {
    id: "js-003",
    categoryId: "js-basics",
    difficulty: "beginner",
    type: "choice",
    question: "次のコードの出力は？",
    code: "console.log(1 == '1')\nconsole.log(1 === '1')\nconsole.log(0 == false)",
    choices: [
      "true / false / true",
      "true / true / true",
      "false / false / false",
      "true / false / false",
    ],
    answerIndex: 0,
    hints: [
      "== は型変換あり、=== は型も厳密。",
      "1 と '1' は緩い比較 (==) では一致。",
      "0 と false は緩い比較で一致 (false が 0 に変換される)。",
    ],
    explanation: {
      summary:
        "`==` は型変換ありの緩い比較、`===` は型も厳密。実務では `===` 推奨。",
      reason:
        "JS は歴史的に `==` が複雑な型変換を行うので、罠が多い (`'' == 0` は true、`null == undefined` は true 等)。ESLint の no-eq null ルールも `===` 強制。",
      codeExample:
        "// 緩い比較 (型変換)\n1 == '1'              // true\n0 == false            // true\n'' == false           // true\nnull == undefined     // true\nNaN == NaN            // false (例外)\n\n// 厳密比較 (推奨)\n1 === '1'             // false\n0 === false           // false\nNaN === NaN           // false\n\n// NaN 判定\nNumber.isNaN(NaN)     // true",
    },
  },
  {
    id: "js-004",
    categoryId: "js-basics",
    difficulty: "beginner",
    type: "choice",
    question:
      "let / const / var の違いとして正しいものは？",
    choices: [
      "var は関数スコープ + 巻き上げあり、let/const はブロックスコープ。const は再代入不可",
      "三者は同じ",
      "let は再代入不可",
      "const はグローバル、let はローカル",
    ],
    answerIndex: 0,
    hints: [
      "var は古い宣言で関数スコープ。",
      "let / const は ES6+ で導入されたブロックスコープ。",
      "const は再代入不可だが、オブジェクト内部は変更可能 (浅い不変)。",
    ],
    explanation: {
      summary:
        "var (関数スコープ + 巻き上げ) → let (ブロックスコープ + 再代入可) → const (ブロックスコープ + 再代入不可)。実務は const ファースト、必要なら let、var は使わない。",
      reason:
        "var の関数スコープは for ループ内で罠 (i がループ後も生存)、巻き上げで未定義参照が undefined になる。let/const で大半解決。const は再代入禁止だが Object/Array の中身は変更可 (浅い不変)。完全凍結は `Object.freeze(obj)`。",
      codeExample:
        "// var (避ける)\nfor (var i = 0; i < 3; i++) {}\nconsole.log(i)        // 3 (ループ外でも生存)\n\n// let / const\nfor (let j = 0; j < 3; j++) {}\nconsole.log(j)        // ReferenceError\n\nconst arr = [1, 2]\narr.push(3)           // OK (中身変更)\narr = [4, 5]          // TypeError (再代入不可)\nObject.freeze(arr)\narr.push(4)           // TypeError",
    },
  },
  {
    id: "js-005",
    categoryId: "js-basics",
    difficulty: "intermediate",
    type: "choice",
    question: "次のコードの出力は？",
    code: "const obj = { name: 'Alice', age: 20 }\nconst { name, age } = obj\nconsole.log(name, age)",
    choices: [
      "Alice 20",
      "name age",
      "obj.name obj.age",
      "undefined undefined",
    ],
    answerIndex: 0,
    hints: [
      "分割代入 (destructuring) でオブジェクトのプロパティを変数化。",
      "const { name, age } = obj は const name = obj.name; const age = obj.age と同義。",
      "ES6+ で導入された記法。",
    ],
    explanation: {
      summary:
        "オブジェクトの分割代入。`const { key1, key2 } = obj` でプロパティを変数として取り出す。",
      reason:
        "デフォルト値 `const { name = 'Anonymous' } = obj`、リネーム `const { name: n } = obj`、ネスト `const { user: { name } } = data` も可。配列分割 `const [a, b] = [1, 2]` と同じく ES6+。React props 受け取りで多用。",
      codeExample:
        "// オブジェクト\nconst { name, age } = { name: 'A', age: 20 }\nconst { name: n, age: a } = obj            // リネーム\nconst { name = 'Anonymous' } = obj         // デフォルト\nconst { user: { name } } = { user: { name: 'A' } }  // ネスト\n\n// 配列\nconst [first, second, ...rest] = [1, 2, 3, 4]\n// first=1, second=2, rest=[3,4]\n\n// React props\nfunction Greet({ name, age = 18 }) {\n  return <p>{name}, {age}</p>\n}",
    },
  },
  {
    id: "js-006",
    categoryId: "js-basics",
    difficulty: "intermediate",
    type: "choice",
    question: "次のコードの出力は？",
    code: "const a = [1, 2, 3]\nconst b = [...a, 4, 5]\nconst c = { ...{ x: 1 }, y: 2 }\nconsole.log(b.length, c.x, c.y)",
    choices: [
      "5 1 2",
      "3 1 2",
      "5 undefined undefined",
      "TypeError",
    ],
    answerIndex: 0,
    hints: [
      "スプレッド演算子 ...arr / ...obj。",
      "配列なら要素展開、オブジェクトならプロパティ展開。",
      "[...a, 4, 5] = [1, 2, 3, 4, 5]、{ ...{x:1}, y:2 } = {x:1, y:2}。",
    ],
    explanation: {
      summary:
        "`...` (スプレッド演算子) で配列/オブジェクトを展開コピー。シャローコピー、関数引数、合成パターンで頻出。",
      reason:
        "イミュータブル更新の基本。React/Redux で `{ ...state, count: state.count + 1 }` のように新オブジェクトを作る。配列も `[...arr, newItem]` で新配列。深いコピーが必要なら structuredClone(obj) (modern) or JSON.parse(JSON.stringify(obj))。",
      codeExample:
        "// 配列\nconst a = [1, 2, 3]\nconst b = [...a, 4, 5]              // [1,2,3,4,5]\nconst c = [...a]                     // 浅いコピー\n\n// オブジェクト\nconst u = { name: 'A', age: 20 }\nconst v = { ...u, age: 21 }          // {name:'A', age:21}\n\n// 関数引数\nfunction sum(...nums) { return nums.reduce((a, b) => a + b, 0) }\nsum(1, 2, 3)                          // 6\n\n// 関数呼び出し\nMath.max(...[1, 5, 3])               // 5",
    },
  },
  {
    id: "js-007",
    categoryId: "js-basics",
    difficulty: "intermediate",
    type: "text",
    question:
      "JavaScript で `null` または `undefined` の時のみデフォルト値を使う演算子は？ (記号、2文字)",
    answers: ["??"],
    hints: [
      "Nullish Coalescing Operator と呼ばれる。",
      "|| と違い、0 や '' は『値あり』として扱う。",
      "ES2020 で導入。",
    ],
    explanation: {
      summary:
        "`??` (Nullish Coalescing) は左辺が `null` / `undefined` の時のみ右辺を返す。`||` と違い 0 / '' / false を保持。",
      reason:
        "`val || 'default'` だと `val = 0` や `''` も置換されてしまうが、`val ?? 'default'` なら 0 / '' / false を保持。設定値のデフォルト処理で重宝。`??=` (Nullish Assignment) もペア。",
      codeExample:
        "0 || 'default'           // 'default' (0 が falsy)\n0 ?? 'default'           // 0 (保持)\n'' || 'default'          // 'default'\n'' ?? 'default'          // ''\nnull ?? 'default'        // 'default'\nundefined ?? 'default'   // 'default'\n\n// 代入\nlet val = null\nval ??= 'fallback'       // val = 'fallback'\n\n// Optional Chaining と組合せ\nuser?.profile?.name ?? 'guest'",
    },
  },
  {
    id: "js-008",
    categoryId: "js-basics",
    difficulty: "intermediate",
    type: "choice",
    question: "次のコードの出力は？",
    code: "const user = { name: 'Alice' }\nconsole.log(user?.profile?.email ?? 'no email')",
    choices: [
      "no email",
      "undefined",
      "TypeError",
      "null",
    ],
    answerIndex: 0,
    hints: [
      "Optional Chaining (?.) で profile が undefined の時にエラー回避。",
      "Nullish Coalescing (??) で undefined の時に default を返す。",
      "user.profile.email を try-catch なしで安全に取得。",
    ],
    explanation: {
      summary:
        "Optional Chaining (`?.`) + Nullish Coalescing (`??`) でネスト参照の安全アクセス + デフォルト。",
      reason:
        "`obj.a.b.c` で途中が undefined だと TypeError。`obj?.a?.b?.c ?? 'default'` で安全 + デフォルト。Ruby の `obj&.a&.b || 'default'` と似た仕組み。配列インデックス `arr?.[0]`、メソッド呼び出し `obj?.fn?.()` も可。",
      codeExample:
        "const user = { name: 'A' }\nuser?.profile?.email              // undefined\nuser?.profile?.email ?? 'none'    // 'none'\n\n// 配列\narr?.[0]\n\n// メソッド呼び出し\nuser?.greet?.()\n\n// 削除\ndelete obj?.field                  // obj が null なら何もしない",
    },
  },
  {
    id: "js-009",
    categoryId: "js-basics",
    difficulty: "intermediate",
    type: "choice",
    question: "次のコードの出力は？",
    code: "const arr = [1, 2, 3, 4, 5]\nconst result = arr.filter(n => n > 2).map(n => n * 2)\nconsole.log(result)",
    choices: [
      "[6, 8, 10]",
      "[2, 4, 6, 8, 10]",
      "[3, 4, 5]",
      "[1, 2, 3, 4, 5]",
    ],
    answerIndex: 0,
    hints: [
      "filter で 2 より大きい要素を残す → [3, 4, 5]。",
      "map で 2 倍する → [6, 8, 10]。",
      "Ruby の select + map に相当。",
    ],
    explanation: {
      summary:
        "Array#filter (Ruby の select) → Array#map のチェーン。関数型プログラミングの定番。",
      reason:
        "JavaScript 標準の Array メソッド: `filter` (条件)、`map` (変換)、`reduce` (畳み込み)、`forEach` (副作用)、`find` (最初の1件)、`some` (any?)、`every` (all?)。Ruby との対応関係を覚えておくと便利。",
      codeExample:
        "[1,2,3].filter(n => n.odd)              // 構文エラー (n.odd は無い)\n[1,2,3].filter(n => n % 2 === 1)        // [1, 3]\n[1,2,3].map(n => n * 2)                 // [2, 4, 6]\n[1,2,3].reduce((sum, n) => sum + n, 0)  // 6\n[1,2,3].find(n => n > 1)                // 2\n[1,2,3].some(n => n > 2)                // true\n[1,2,3].every(n => n > 0)               // true",
    },
  },
  {
    id: "js-010",
    categoryId: "js-basics",
    difficulty: "advanced",
    type: "choice",
    question: "次のコードの出力は？",
    code: "for (var i = 0; i < 3; i++) {\n  setTimeout(() => console.log(i), 0)\n}",
    choices: [
      "3 / 3 / 3",
      "0 / 1 / 2",
      "0 / 0 / 0",
      "undefined",
    ],
    answerIndex: 0,
    hints: [
      "var はループスコープを作らない。",
      "setTimeout のコールバックが実行される時には i = 3 (ループ終了後)。",
      "let に変えると 0 / 1 / 2 になる。",
    ],
    explanation: {
      summary:
        "`var` のスコープバグの典型。コールバック実行時には i = 3 (ループ終了後の値)。`let` ならブロックスコープでループ毎に新しい i を作る。",
      reason:
        "var はループブロックを作らないので、3 つの setTimeout はすべて『同じ i』を参照する。setTimeout は同期コードを終えてから実行されるので、見るのは i = 3。let なら各イテレーションで新しいバインディングを作るので 0/1/2。",
      codeExample:
        "// var の罠\nfor (var i = 0; i < 3; i++) {\n  setTimeout(() => console.log(i), 0)\n}\n// 3, 3, 3\n\n// let で解決\nfor (let i = 0; i < 3; i++) {\n  setTimeout(() => console.log(i), 0)\n}\n// 0, 1, 2\n\n// var で解決する旧式 (IIFE)\nfor (var i = 0; i < 3; i++) {\n  ;(function (n) {\n    setTimeout(() => console.log(n), 0)\n  })(i)\n}",
    },
  },

  // ===========================================================================
  // 𝑓 JavaScript 関数 (jsf-001 〜 jsf-005)
  // ===========================================================================
  {
    id: "jsf-001",
    categoryId: "js-functions",
    difficulty: "beginner",
    type: "choice",
    question: "次のコードの出力は？",
    code: "const greet = (name) => `hi, ${name}`\nconsole.log(greet('Alice'))",
    choices: [
      "hi, Alice",
      "${name}",
      "undefined",
      "TypeError",
    ],
    answerIndex: 0,
    hints: [
      "アロー関数の構文。",
      "テンプレートリテラル ` で文字列補間。",
      "${name} で変数展開。",
    ],
    explanation: {
      summary:
        "アロー関数 `(args) => body` と テンプレートリテラル `` `${var}` `` の組合せ。",
      reason:
        "アロー関数は短い記法 + this の挙動が違う (周囲の this を継承)。テンプレートリテラルは backtick (`) で囲み、`${expr}` で式展開。改行も保持される。",
      codeExample:
        "// アロー関数\nconst add = (a, b) => a + b\nconst square = n => n * n          // 1 引数なら括弧省略可\nconst noop = () => {}              // 引数なしは ()\nconst makeObj = () => ({ x: 1 })   // オブジェクトは ({...}) で囲む\n\n// テンプレートリテラル\n`hi, ${name}`\n`sum = ${a + b}`\n`複\n行も書ける`\n\n// タグ付きテンプレート (高度)\nfunction html(strings, ...values) { ... }\nhtml`<p>${name}</p>`",
    },
  },
  {
    id: "jsf-002",
    categoryId: "js-functions",
    difficulty: "intermediate",
    type: "choice",
    question: "次のコードの出力は？",
    code: "const obj = {\n  name: 'A',\n  greet() { return `hi, ${this.name}` },\n  arrow: () => `arrow: ${this?.name}`\n}\nconsole.log(obj.greet())\nconsole.log(obj.arrow())",
    choices: [
      "hi, A / arrow: undefined",
      "hi, A / arrow: A",
      "hi, undefined / arrow: A",
      "TypeError / TypeError",
    ],
    answerIndex: 0,
    hints: [
      "通常の method 構文の this はレシーバ (obj) を指す。",
      "アロー関数の this は『定義時のスコープ』を継承する (周囲の this)。",
      "obj 定義の外側のスコープには this.name は無い。",
    ],
    explanation: {
      summary:
        "通常関数の `this` はレシーバ、アロー関数の `this` は定義時の外側 this を継承 (レキシカル)。",
      reason:
        "アロー関数は『独自の this を持たない』ので、コールバック関数で this を保持したい時に便利。逆にオブジェクトメソッドとしては不向き。`bind/call/apply` も効かない。",
      codeExample:
        "// オブジェクトメソッド → 通常関数\nconst obj = {\n  name: 'A',\n  greet() { return this.name },          // OK\n  arrow: () => this.name                  // ❌ undefined\n}\n\n// コールバックでは逆\nclass Timer {\n  start() {\n    setInterval(() => {                   // アロー: this を継承\n      this.tick++\n    }, 1000)\n  }\n}",
    },
  },
  {
    id: "jsf-003",
    categoryId: "js-functions",
    difficulty: "intermediate",
    type: "choice",
    question:
      "クロージャの説明として正しいのは？",
    choices: [
      "関数が定義された時のスコープの変数を、後から実行されても参照できる仕組み",
      "JS の global object",
      "function キーワードで作られる関数",
      "this の自動バインディング",
    ],
    answerIndex: 0,
    hints: [
      "関数 + その関数が参照する周囲の変数 = クロージャ。",
      "外側スコープの変数を覚えて持ち運ぶ。",
      "カウンタ実装や React の useCallback で使う基本概念。",
    ],
    explanation: {
      summary:
        "クロージャ = 関数 + その定義時のスコープ。外側の変数を捕捉して『記憶』する。",
      reason:
        "JS の関数はファーストクラス + クロージャ性質を持つ。`makeCounter` のような関数の中で `let count = 0` を作ってクロージャで保持できる。React hooks や Promise チェーンでも本質的に活用。",
      codeExample:
        "function makeCounter() {\n  let count = 0\n  return () => ++count\n}\n\nconst counter = makeCounter()\ncounter()   // 1\ncounter()   // 2\ncounter()   // 3\n\n// React useState の内部も実質クロージャ\nfunction useState(initial) {\n  let state = initial\n  const setState = v => { state = v }\n  return [state, setState]\n}",
    },
  },
  {
    id: "jsf-004",
    categoryId: "js-functions",
    difficulty: "intermediate",
    type: "choice",
    question:
      "次のうち、`function.bind(obj)` の効果として正しいのは？",
    choices: [
      "this を obj に固定した新しい関数を返す",
      "obj 自身を関数化する",
      "関数を obj のメソッドとして登録する",
      "関数を実行する",
    ],
    answerIndex: 0,
    hints: [
      "this をハードコードした新しい関数を返す。",
      "実行はしない (call/apply は即実行)。",
      "イベントハンドラで this を保持したい時に使う。",
    ],
    explanation: {
      summary:
        "`fn.bind(obj)` は this を obj に固定した新関数を返す (即実行はしない)。`call(obj, ...args)` は即実行 + this 設定。",
      reason:
        "古典的に React class component で `this.handleClick = this.handleClick.bind(this)` するのに使った。現代ではアロー関数で代替できるので bind の出番は減ったが、知識として重要。",
      codeExample:
        "function greet() { return `hi, ${this.name}` }\n\nconst alice = { name: 'A' }\nconst greetAlice = greet.bind(alice)\ngreetAlice()                // 'hi, A'\n\n// call / apply は即実行\ngreet.call(alice)           // 'hi, A'\ngreet.apply(alice, [args])  // 'hi, A' (args 配列)\n\n// 引数も部分適用\nfunction add(a, b) { return a + b }\nconst add10 = add.bind(null, 10)\nadd10(5)                    // 15",
    },
  },
  {
    id: "jsf-005",
    categoryId: "js-functions",
    difficulty: "advanced",
    type: "choice",
    question: "次のコードの出力は？",
    code: "const arr = ['a', 'b', 'c']\nconst result = arr.reduce((acc, x, i) => {\n  acc[x] = i\n  return acc\n}, {})\nconsole.log(result)",
    choices: [
      "{ a: 0, b: 1, c: 2 }",
      "{ 0: 'a', 1: 'b', 2: 'c' }",
      "['a', 'b', 'c']",
      "{}",
    ],
    answerIndex: 0,
    hints: [
      "reduce で初期値 {} から累積。",
      "ブロック内で acc[x] = i (キー = 要素、値 = インデックス)。",
      "Array → Hash 構築の典型パターン。",
    ],
    explanation: {
      summary:
        "Array.reduce でオブジェクトを構築。`acc[key] = value; return acc` のパターン。",
      reason:
        "Array → Object 変換の定番。Ruby の `each_with_object({}) { |x, h| h[...] = ... }` に近い。`Object.fromEntries(arr.map(...))` でも書ける。",
      codeExample:
        "// reduce で\nconst byId = users.reduce((acc, u) => {\n  acc[u.id] = u\n  return acc\n}, {})\n\n// Object.fromEntries (より宣言的)\nconst byId = Object.fromEntries(users.map(u => [u.id, u]))\n\n// グループ化 (Ruby の group_by)\nconst byRole = users.reduce((acc, u) => {\n  ;(acc[u.role] ??= []).push(u)\n  return acc\n}, {})",
    },
  },

  // ===========================================================================
  // ⏳ JavaScript 非同期 (jsa-001 〜 jsa-005)
  // ===========================================================================
  {
    id: "jsa-001",
    categoryId: "js-async",
    difficulty: "beginner",
    type: "choice",
    question: "次のコードの出力順は？",
    code: "console.log('1')\nsetTimeout(() => console.log('2'), 0)\nPromise.resolve().then(() => console.log('3'))\nconsole.log('4')",
    choices: [
      "1 → 4 → 3 → 2",
      "1 → 2 → 3 → 4",
      "1 → 2 → 4 → 3",
      "1 → 3 → 4 → 2",
    ],
    answerIndex: 0,
    hints: [
      "同期コード → マイクロタスク (Promise) → マクロタスク (setTimeout) の順。",
      "1 → 4 が同期、3 はマイクロタスク、2 はマクロタスク。",
      "Event Loop の優先順位を覚える基本問題。",
    ],
    explanation: {
      summary:
        "Event Loop の優先順位: 同期コード → マイクロタスク (Promise.then, queueMicrotask) → マクロタスク (setTimeout, setInterval, I/O)。",
      reason:
        "JS はシングルスレッド + Event Loop。同期コード実行後、マイクロタスクキューを全部処理してからマクロタスクへ移る。`await` / `then` はマイクロタスク扱い。`setTimeout(fn, 0)` は最低 4ms 遅延 + マクロタスク。",
      codeExample:
        "console.log('start')           // 1\n\nsetTimeout(() => log('macro'), 0)  // マクロ (後回し)\nqueueMicrotask(() => log('micro')) // マイクロ\nPromise.resolve().then(() => log('then'))  // マイクロ\n\nconsole.log('end')             // 2\n\n// 出力: start → end → micro → then → macro",
    },
  },
  {
    id: "jsa-002",
    categoryId: "js-async",
    difficulty: "intermediate",
    type: "choice",
    question: "次のコードの結果は？",
    code: "async function get() {\n  const res = await fetch('/api')\n  const json = await res.json()\n  return json\n}",
    choices: [
      "Promise を返す関数 (await で中身を取り出せる)",
      "JSON オブジェクトを直接返す",
      "Response オブジェクトを返す",
      "string を返す",
    ],
    answerIndex: 0,
    hints: [
      "async 関数は常に Promise を返す。",
      "中の await はその Promise が解決するまで待つ。",
      "呼び出し側は `const data = await get()` のように await する。",
    ],
    explanation: {
      summary:
        "`async` 関数は常に Promise を返す。中の `await` で他の Promise を解決待ち。エラーは try/catch で。",
      reason:
        "async/await は Promise の糖衣構文。`.then().then()` のチェーンを同期コードのように書ける。`await` はマイクロタスクをトリガー。並列 await は `Promise.all([...])`。",
      codeExample:
        "// 順次 (合計 2 秒)\nconst a = await fetch1()\nconst b = await fetch2()\n\n// 並列 (合計 1 秒)\nconst [a, b] = await Promise.all([fetch1(), fetch2()])\n\n// エラーハンドリング\ntry {\n  const data = await api.fetch()\n} catch (e) {\n  console.error(e)\n}\n\n// 並列 + 失敗を分離\nconst results = await Promise.allSettled([f1(), f2(), f3()])\nresults.forEach(r => r.status === 'fulfilled' ? r.value : r.reason)",
    },
  },
  {
    id: "jsa-003",
    categoryId: "js-async",
    difficulty: "intermediate",
    type: "choice",
    question:
      "Promise.all と Promise.allSettled の違いは？",
    choices: [
      "Promise.all は 1 つでも reject すると全体が reject、Promise.allSettled は全部の結果 (fulfilled/rejected) を返す",
      "両者は同じ",
      "Promise.all は順次、allSettled は並列",
      "allSettled は遅い",
    ],
    answerIndex: 0,
    hints: [
      "all は『すべて成功』を求める。",
      "allSettled は『すべて終了』を求める (成否問わず)。",
      "片方の失敗で全体を諦めるか、それぞれの結果を受け取るかの違い。",
    ],
    explanation: {
      summary:
        "`Promise.all` は短絡型 (1 つ失敗で全体失敗)。`Promise.allSettled` は全完了型 (各結果を fulfilled/rejected で配列返却)。",
      reason:
        "all は『全部揃わないと処理進められない』時 (依存)、allSettled は『部分的失敗を許容』する時に使う。`Promise.race` は最初の 1 件の結果、`Promise.any` は最初の 1 件の成功。",
      codeExample:
        "// Promise.all: 1 つ失敗で全体 reject\ntry {\n  const [a, b, c] = await Promise.all([f1(), f2(), f3()])\n} catch (e) {\n  console.error('どれか失敗:', e)\n}\n\n// Promise.allSettled: 全結果\nconst results = await Promise.allSettled([f1(), f2(), f3()])\nresults.forEach(r => {\n  if (r.status === 'fulfilled') console.log(r.value)\n  else                          console.error(r.reason)\n})\n\n// race: 最初の 1 件 (成否問わず)\nawait Promise.race([f1(), timeout(5000)])\n\n// any: 最初の成功\nawait Promise.any([primary(), backup1(), backup2()])",
    },
  },
  {
    id: "jsa-004",
    categoryId: "js-async",
    difficulty: "intermediate",
    type: "choice",
    question: "次のコードの結果は？",
    code: "const p = new Promise(resolve => {\n  console.log('a')\n  resolve()\n})\np.then(() => console.log('b'))\nconsole.log('c')",
    choices: [
      "a → c → b",
      "a → b → c",
      "c → a → b",
      "b → a → c",
    ],
    answerIndex: 0,
    hints: [
      "Promise のコンストラクタ内は同期で実行される。",
      ".then のコールバックはマイクロタスクキューに入る。",
      "console.log('c') 後にマイクロタスクが処理される。",
    ],
    explanation: {
      summary:
        "Promise コンストラクタ内は同期実行。`.then` はマイクロタスク。",
      reason:
        "new Promise((resolve) => {...}) のブロックは即座に同期実行される (これが意外な落とし穴)。resolve() しても .then は登録だけ。同期コードを抜けてからマイクロタスクキューが消化される。",
      codeExample:
        "// 同期 → マイクロ\nconsole.log('1')\nnew Promise(r => { console.log('2'); r() }).then(() => console.log('3'))\nconsole.log('4')\n// 1, 2, 4, 3\n\n// ✗ よくある勘違い: Promise 化したから後回しになるはず\n// → コンストラクタ内は同期実行されてしまう",
    },
  },
  {
    id: "jsa-005",
    categoryId: "js-async",
    difficulty: "advanced",
    type: "choice",
    question: "次のコードのデフォルト挙動でエラー時に起きることは？",
    code: "async function risky() {\n  throw new Error('boom')\n}\nrisky()",
    choices: [
      "未処理 Promise rejection の警告/エラー (Node なら UnhandledPromiseRejection)",
      "throw された Error がそのまま伝播",
      "何も起きない (静かに失敗)",
      "プログラムが即終了",
    ],
    answerIndex: 0,
    hints: [
      "async 関数内の throw は Promise の reject になる。",
      "呼び出し側で .catch / try-catch しないと未処理。",
      "Node.js では UnhandledPromiseRejection 警告 → 将来クラッシュ。",
    ],
    explanation: {
      summary:
        "async 関数の throw は『Promise の reject』になる。呼び出し側で catch しないと『未処理 rejection』。",
      reason:
        "async 関数内で `throw new Error(...)` すると、戻り値の Promise が rejected 状態になる。`.catch()` か `try/await` で必ず処理。Node.js 15+ では未処理 rejection でプロセスが落ちる (デフォルト)。",
      codeExample:
        "// 危険\nasync function risky() { throw new Error('boom') }\nrisky()  // UnhandledPromiseRejection\n\n// 正しい\nrisky().catch(e => console.error(e))\n\n// または\ntry {\n  await risky()\n} catch (e) {\n  console.error(e)\n}\n\n// ブラウザ全体で捕捉\nwindow.addEventListener('unhandledrejection', e => {\n  Sentry.captureException(e.reason)\n})",
    },
  },

  // ===========================================================================
  // 🔷 TypeScript 基礎 (ts-001 〜 ts-005)
  // ===========================================================================
  {
    id: "ts-001",
    categoryId: "ts-basics",
    difficulty: "beginner",
    type: "choice",
    question:
      "次の型注釈で正しいものは？",
    code: "function add(a, b) { return a + b }",
    choices: [
      "function add(a: number, b: number): number { return a + b }",
      "function add(number a, number b) returns number {}",
      "function<number, number, number> add(a, b) {}",
      "type add = (number, number) => number",
    ],
    answerIndex: 0,
    hints: [
      "TypeScript の関数注釈は `param: Type`。",
      "戻り値の型は ): Type の形。",
      "C 言語スタイル (type name) ではなく ML 系 (name: type)。",
    ],
    explanation: {
      summary:
        "TypeScript の関数注釈: `function name(arg: Type): ReturnType { ... }`。アロー関数も同様。",
      reason:
        "関数の引数・戻り値・変数すべてに型注釈。戻り値は推論可能だが、公開 API では明示推奨 (戻り型が予期せず変わるのを防ぐ)。",
      codeExample:
        "function add(a: number, b: number): number {\n  return a + b\n}\n\nconst sub = (a: number, b: number): number => a - b\n\n// 戻り値の型注釈なし → 推論される (内部関数は省略可)\nconst double = (n: number) => n * 2\n\n// 型エイリアス\ntype Handler = (event: Event) => void",
    },
  },
  {
    id: "ts-002",
    categoryId: "ts-basics",
    difficulty: "beginner",
    type: "choice",
    question:
      "次のうち、interface と type alias の違いとして正しいのは？",
    choices: [
      "interface は宣言マージ可、type は不可。実用上は混在を避けて統一する",
      "type alias は廃止された",
      "interface は遅い",
      "両者は完全に同じ",
    ],
    answerIndex: 0,
    hints: [
      "interface は同名宣言が自動マージ (宣言マージ機能)。",
      "type alias は同名で再定義不可。",
      "それ以外の機能はほぼ同等。",
    ],
    explanation: {
      summary:
        "`interface` は宣言マージ機能あり、`type` はなし。union/intersection/関数型は type の方が書きやすい。混在を避けてプロジェクト内で統一推奨。",
      reason:
        "interface は React Component の props 定義で広く使われる (拡張しやすい)。type は union/conditional type/mapped type など高度な型操作で必須。基本は『データ構造 = interface、関数型・union = type』派と『常に type』派が混在。",
      codeExample:
        "// interface (宣言マージ可)\ninterface User { name: string }\ninterface User { age: number }      // OK、マージされる\n// User = { name: string; age: number }\n\n// type (再定義不可)\ntype User = { name: string }\ntype User = { age: number }         // Error\n\n// type の強み (union/intersection)\ntype Result = Success | Failure\ntype Combined = A & B\ntype Handler<T> = (event: T) => void",
    },
  },
  {
    id: "ts-003",
    categoryId: "ts-basics",
    difficulty: "intermediate",
    type: "choice",
    question:
      "次のコードのうち、型エラーになるのは？",
    code: "type User = { name: string; age?: number }\nconst u1: User = { name: 'A' }                // 1\nconst u2: User = { name: 'A', age: 20 }        // 2\nconst u3: User = { name: 'A', age: '20' }      // 3\nconst u4: User = { age: 20 }                    // 4",
    choices: [
      "3 と 4",
      "3 のみ",
      "4 のみ",
      "全部 OK",
    ],
    answerIndex: 0,
    hints: [
      "age? はオプショナル (省略可)。",
      "name は必須。",
      "age: '20' は string で型不一致。",
    ],
    explanation: {
      summary:
        "`age?: number` はオプショナル (省略可、または number)。name は必須。型不一致 (string が number に入る) はエラー。",
      reason:
        "`?` (Optional Property) は『undefined を許容』と同等 (`age?: number` ≒ `age: number | undefined`)。値必須は `?` なし。strictNullChecks 有効時は null 安全。",
      codeExample:
        "type User = {\n  name: string         // 必須\n  age?: number         // optional\n  email?: string\n  readonly id: number  // 読み取り専用\n}\n\n// 関数引数の optional\nfunction greet(name: string, greeting?: string) {\n  return `${greeting ?? 'Hello'}, ${name}`\n}\n\n// デフォルト値\nfunction greet(name: string, greeting = 'Hello') {\n  return `${greeting}, ${name}`\n}",
    },
  },
  {
    id: "ts-004",
    categoryId: "ts-basics",
    difficulty: "intermediate",
    type: "choice",
    question: "次のコードの型は？",
    code: "function identity<T>(x: T): T { return x }\nconst a = identity('hello')\nconst b = identity(42)",
    choices: [
      "a: string / b: number (各呼び出しで T が推論される)",
      "両方 unknown",
      "両方 T",
      "両方 any",
    ],
    answerIndex: 0,
    hints: [
      "<T> はジェネリクス (型変数)。",
      "呼び出し時に T が推論される。",
      "'hello' → T = string、42 → T = number。",
    ],
    explanation: {
      summary:
        "ジェネリクス `<T>` は呼び出しごとに型が決まる『型変数』。引数の型から推論される。",
      reason:
        "型安全 + 再利用性のための機能。配列メソッド (`Array<T>`)、Promise (`Promise<T>`)、React Component (`Component<Props>`) など多用。`T extends ...` で制約も付けられる。",
      codeExample:
        "function identity<T>(x: T): T { return x }\n\nidentity<string>('hi')   // 明示\nidentity(42)             // 推論 (T = number)\n\n// 制約付き\nfunction longest<T extends { length: number }>(a: T, b: T): T {\n  return a.length >= b.length ? a : b\n}\nlongest('hello', 'hi')       // OK (string は length あり)\nlongest([1, 2], [3, 4, 5])   // OK\nlongest(42, 99)              // Error: number に length 無し\n\n// 複数の型変数\nfunction pair<A, B>(a: A, b: B): [A, B] { return [a, b] }",
    },
  },
  {
    id: "ts-005",
    categoryId: "ts-basics",
    difficulty: "advanced",
    type: "choice",
    question:
      "次の型のうち、`User` から age プロパティを除いた型を作るのは？",
    choices: [
      "Omit<User, 'age'>",
      "Pick<User, 'age'>",
      "Partial<User>",
      "Required<User>",
    ],
    answerIndex: 0,
    hints: [
      "Utility Types シリーズの 1 つ。",
      "Omit は『除外』、Pick は『抽出』。",
      "Partial は全 optional、Required は全必須。",
    ],
    explanation: {
      summary:
        "`Omit<T, K>` は T から K キーを除外。`Pick<T, K>` は K だけ抽出。`Partial<T>` / `Required<T>` で全 optional/全必須。",
      reason:
        "Utility Types は TS 標準の型操作集。Omit/Pick/Partial/Required/Readonly/Record/ReturnType/Parameters 等。データ型を派生させる時に必須。",
      codeExample:
        "type User = { id: number; name: string; age: number }\n\nOmit<User, 'age'>                 // {id, name}\nPick<User, 'id' | 'name'>          // {id, name}\nPartial<User>                      // {id?, name?, age?}\nRequired<Partial<User>>            // {id, name, age}\nReadonly<User>                     // readonly 化\nRecord<string, User>               // { [key: string]: User }\n\n// 関数の戻り値型を取り出す\ntype R = ReturnType<typeof fn>",
    },
  },

  // ===========================================================================
  // ⚛️ React 基礎 (react-001 〜 react-005)
  // ===========================================================================
  {
    id: "react-001",
    categoryId: "react-fundamentals",
    difficulty: "beginner",
    type: "choice",
    question:
      "React で関数コンポーネントで状態を持つために使う Hook は？",
    choices: [
      "useState",
      "useStore",
      "useLocalState",
      "createState",
    ],
    answerIndex: 0,
    hints: [
      "Hook 名は use で始まる。",
      "返り値はタプル [現在の値, セッター]。",
      "Class Component の this.state に相当。",
    ],
    explanation: {
      summary:
        "`useState(initial)` は `[state, setState]` を返す Hook。コンポーネント内のローカル状態。",
      reason:
        "React 16.8+ の Hooks API。Class Component の `this.state` / `this.setState` の関数版。setState を呼ぶと再レンダリング。setState 内に関数を渡すと前回の state を受け取る (関数更新)。",
      codeExample:
        "function Counter() {\n  const [count, setCount] = useState(0)\n\n  return (\n    <>\n      <p>Count: {count}</p>\n      <button onClick={() => setCount(count + 1)}>+1</button>\n      <button onClick={() => setCount(c => c + 1)}>+1 (safe)</button>\n    </>\n  )\n}\n\n// 関数更新が必要なケース (前回の値に依存)\nsetCount(c => c + 1)   // 安全 (同期で複数回呼んでも正しく加算)\nsetCount(count + 1)    // 危険 (closure で古い count を見る)",
    },
  },
  {
    id: "react-002",
    categoryId: "react-fundamentals",
    difficulty: "beginner",
    type: "choice",
    question:
      "React の useEffect の使い方として正しいのは？",
    choices: [
      "useEffect(() => { ... }, [deps]) で副作用を実行、依存配列が変わった時に再実行",
      "useEffect は廃止された",
      "useEffect は同期処理用",
      "useEffect は引数を取らない",
    ],
    answerIndex: 0,
    hints: [
      "副作用 (DOM 操作、API 通信、購読) を扱う Hook。",
      "第 2 引数の依存配列で再実行のタイミング制御。",
      "クリーンアップ関数を return することで unmount/再実行前の処理。",
    ],
    explanation: {
      summary:
        "`useEffect(fn, deps)` でレンダリング後に副作用実行。`deps` が変わると再実行。`fn` から関数を return すれば cleanup。",
      reason:
        "副作用 (subscriptions, DOM, timers, fetch) を React の lifecycle と統合。`[]` で初回マウントのみ、`[var]` で var 変更時に再実行、依存配列省略で毎回再実行。`return () => unsubscribe()` で cleanup。",
      codeExample:
        "// 初回マウント時のみ\nuseEffect(() => {\n  const id = setInterval(() => tick(), 1000)\n  return () => clearInterval(id)   // cleanup\n}, [])\n\n// userId 変更時にデータ再取得\nuseEffect(() => {\n  let cancelled = false\n  fetch(`/users/${userId}`).then(r => {\n    if (!cancelled) setData(r)\n  })\n  return () => { cancelled = true }\n}, [userId])\n\n// 依存配列を忘れると毎レンダリングで再実行 (無限ループ注意)",
    },
  },
  {
    id: "react-003",
    categoryId: "react-fundamentals",
    difficulty: "intermediate",
    type: "choice",
    question: "次のコードの問題点は？",
    code: "function List({ items }) {\n  return items.map((item, i) => <li>{item.name}</li>)\n}",
    choices: [
      "key prop が無く、警告 + 再レンダリング時の差分検出が非効率",
      "items.map ではなく forEach にすべき",
      "li タグが間違っている",
      "問題なし",
    ],
    answerIndex: 0,
    hints: [
      "React のリスト描画では key prop が必須。",
      "key が無いと差分検出 (reconciliation) が効率的に動かない。",
      "key には『安定したユニーク値』(idなど) を使う、index は最終手段。",
    ],
    explanation: {
      summary:
        "リストレンダリングには `key` prop が必須。安定したユニーク ID を使う (index は並び替えで問題)。",
      reason:
        "React は key を使って『どの要素が同じか / 追加 / 削除 / 移動か』を判断。key 無しだと毎回全部再生成、index だと並び替えで子の state が消える。`<li key={item.id}>` のように DB の ID 等を使う。",
      codeExample:
        "// ❌ key 無し → 警告\nitems.map((item, i) => <li>{item.name}</li>)\n\n// ⚠️ index は最終手段 (並び替えで問題)\nitems.map((item, i) => <li key={i}>{item.name}</li>)\n\n// ✅ 安定 ID\nitems.map(item => <li key={item.id}>{item.name}</li>)\n\n// Fragment にも key 可\nitems.map(item => (\n  <Fragment key={item.id}>\n    <dt>{item.name}</dt>\n    <dd>{item.value}</dd>\n  </Fragment>\n))",
    },
  },
  {
    id: "react-004",
    categoryId: "react-fundamentals",
    difficulty: "intermediate",
    type: "choice",
    question:
      "React で『高コストな計算結果を再レンダリング間でキャッシュ』する Hook は？",
    choices: [
      "useMemo",
      "useCallback",
      "useRef",
      "useReducer",
    ],
    answerIndex: 0,
    hints: [
      "値をメモ化する Hook。",
      "useCallback は『関数』をメモ化、useMemo は『値』をメモ化。",
      "重い計算 (filter+sort+集計など) で使う。",
    ],
    explanation: {
      summary:
        "`useMemo(() => 計算, [deps])` で重い計算結果を依存配列が変わるまでキャッシュ。`useCallback` は関数版。",
      reason:
        "毎レンダリングで同じ計算をしないように。ただし安易な濫用は逆効果 (比較コストが上回ることも)。本当に重い処理 (大量データのフィルタ・ソート、子コンポーネントへの props 安定化) で使う。React Compiler (将来) で不要になる可能性。",
      codeExample:
        "// 重い計算をメモ化\nconst filtered = useMemo(\n  () => items.filter(i => i.matches(query)).sort(...),\n  [items, query]\n)\n\n// 関数を安定化 (子の memo を効かせる)\nconst handleClick = useCallback(() => {\n  doSomething(id)\n}, [id])\n\n<MemoChild onClick={handleClick} />\n\n// useRef は値の保持 + 再レンダリング不要\nconst countRef = useRef(0)\ncountRef.current++   // 再レンダリングしない",
    },
  },
  {
    id: "react-005",
    categoryId: "react-fundamentals",
    difficulty: "advanced",
    type: "choice",
    question:
      "次のうち、Custom Hook の正しい命名規則は？",
    choices: [
      "use で始まる (例: useFetch, useDebounce)",
      "Use で始まる (PascalCase)",
      "with で始まる",
      "$ で始まる",
    ],
    answerIndex: 0,
    hints: [
      "ESLint の rules-of-hooks がこの命名で判定する。",
      "React は『use で始まる関数は Hook』と認識。",
      "通常の関数とは区別する命名規約。",
    ],
    explanation: {
      summary:
        "Custom Hook は `use` 始まりで命名。React/ESLint が Hook ルールを適用するために必須。",
      reason:
        "Hook は最上位でしか呼べない (条件分岐内 NG)、関数コンポーネントか他の Hook 内でのみ呼べる、というルールがある。命名で識別される。`useFetch` `useDebounce` `useLocalStorage` 等、ロジックを再利用可能に切り出す。",
      codeExample:
        "function useDebounce<T>(value: T, ms: number): T {\n  const [debounced, setDebounced] = useState(value)\n  useEffect(() => {\n    const id = setTimeout(() => setDebounced(value), ms)\n    return () => clearTimeout(id)\n  }, [value, ms])\n  return debounced\n}\n\n// 使用\nfunction Search() {\n  const [q, setQ] = useState('')\n  const debounced = useDebounce(q, 300)\n  useEffect(() => {\n    if (debounced) fetch(`/api/search?q=${debounced}`)\n  }, [debounced])\n}",
    },
  },

  // ===========================================================================
  // ▲ Next.js 基礎 (next-001 〜 next-005)
  // ===========================================================================
  {
    id: "next-001",
    categoryId: "nextjs-basics",
    difficulty: "beginner",
    type: "choice",
    question:
      "Next.js 13+ の App Router で『/about ページを作る』正しいファイル配置は？",
    choices: [
      "app/about/page.tsx",
      "pages/about.tsx (Pages Router 用)",
      "app/about.tsx",
      "src/pages/about/index.tsx",
    ],
    answerIndex: 0,
    hints: [
      "App Router はディレクトリ + page.tsx 命名。",
      "Pages Router (pages/) は旧式。",
      "/about → app/about/page.tsx。",
    ],
    explanation: {
      summary:
        "App Router: `app/<route>/page.tsx`。動的ルートは `app/users/[id]/page.tsx`、レイアウトは `layout.tsx`。",
      reason:
        "Next.js 13+ の App Router はディレクトリベース。同じディレクトリに `layout.tsx`、`loading.tsx`、`error.tsx`、`not-found.tsx` を置ける。`[id]` で動的セグメント、`[...slug]` でキャッチオール、`(group)` でルートグループ。",
      codeExample:
        "app/\n  page.tsx                  → /\n  layout.tsx                ルートレイアウト (必須)\n  about/\n    page.tsx                → /about\n  blog/\n    layout.tsx              ブログ共通レイアウト\n    page.tsx                → /blog\n    [slug]/\n      page.tsx              → /blog/foo (動的)\n  api/\n    posts/\n      route.ts              → /api/posts (Route Handler)",
    },
  },
  {
    id: "next-002",
    categoryId: "nextjs-basics",
    difficulty: "beginner",
    type: "choice",
    question:
      "Next.js 13+ App Router でデフォルトのコンポーネントタイプは？",
    choices: [
      "Server Component (Server 側でレンダリング、JS バンドル無し)",
      "Client Component",
      "Static HTML",
      "Both equally",
    ],
    answerIndex: 0,
    hints: [
      "App Router のデフォルトは Server Component。",
      "useState / useEffect 等の Hook を使うなら 'use client' ディレクティブが必要。",
      "Server Component はクライアントに JS を送らないので軽い。",
    ],
    explanation: {
      summary:
        "App Router のデフォルトは Server Component (サーバーで実行 + HTML 配信、JS バンドルゼロ)。Hook 使用には `'use client'` でクライアント化が必要。",
      reason:
        "Server Component は DB アクセス / 機密情報 OK・JS バンドル削減・SEO 向上。Client Component は Hook / イベントハンドラ / ブラウザ API が必要な箇所のみ。混在可。`'use client'` ファイルはそこから下が client tree。",
      codeExample:
        "// app/page.tsx (デフォルト Server Component)\nimport { db } from '@/lib/db'\nexport default async function Home() {\n  const posts = await db.post.findMany()\n  return <PostList posts={posts} />\n}\n\n// app/components/counter.tsx\n'use client'\nimport { useState } from 'react'\nexport function Counter() {\n  const [n, setN] = useState(0)\n  return <button onClick={() => setN(n+1)}>{n}</button>\n}",
    },
  },
  {
    id: "next-003",
    categoryId: "nextjs-basics",
    difficulty: "intermediate",
    type: "choice",
    question:
      "Next.js App Router で API エンドポイントを作るファイル名は？",
    choices: [
      "route.ts (or route.js)",
      "api.ts",
      "endpoint.ts",
      "handler.ts",
    ],
    answerIndex: 0,
    hints: [
      "App Router の API は Route Handler。",
      "page.tsx と同じディレクトリ規約だが、ファイル名が違う。",
      "GET/POST 等を export する HTTP メソッド関数。",
    ],
    explanation: {
      summary:
        "Route Handler は `app/.../route.ts` に GET/POST/PUT/DELETE をエクスポート。Web 標準の Request/Response を使う。",
      reason:
        "Pages Router 時代の `pages/api/*.ts` から App Router 版に進化。fetch 互換の Request/Response API。NextRequest / NextResponse の Next.js 拡張も使える。",
      codeExample:
        "// app/api/posts/route.ts\nimport { NextRequest, NextResponse } from 'next/server'\n\nexport async function GET(req: NextRequest) {\n  const posts = await db.post.findMany()\n  return NextResponse.json(posts)\n}\n\nexport async function POST(req: NextRequest) {\n  const body = await req.json()\n  const post = await db.post.create({ data: body })\n  return NextResponse.json(post, { status: 201 })\n}\n\n// 動的ルート: app/api/posts/[id]/route.ts\nexport async function GET(req: NextRequest, { params }: { params: { id: string } }) {\n  ...\n}",
    },
  },
  {
    id: "next-004",
    categoryId: "nextjs-basics",
    difficulty: "intermediate",
    type: "choice",
    question:
      "Next.js でクライアント側からサーバー関数を呼ぶ機能は？",
    choices: [
      "Server Actions (\"use server\" 注釈)",
      "Server Functions",
      "API Routes only",
      "RPC",
    ],
    answerIndex: 0,
    hints: [
      "Next.js 13.4+ で安定化。",
      "関数の冒頭に 'use server' ディレクティブを書く。",
      "Form の action 属性に直接渡せる。",
    ],
    explanation: {
      summary:
        "Server Actions は `'use server'` で宣言された関数。クライアントから直接呼べる (内部は HTTP 経由)、フォーム action にも直接渡せる。",
      reason:
        "API Route を書かずに React 側からサーバー処理を呼べる。Form 統合で `<form action={serverAction}>`、`useTransition` でローディング、`revalidatePath` でキャッシュ無効化。Rails の form_with に近い感覚。",
      codeExample:
        "// app/actions.ts\n'use server'\n\nimport { revalidatePath } from 'next/cache'\n\nexport async function createPost(formData: FormData) {\n  const title = formData.get('title') as string\n  await db.post.create({ data: { title } })\n  revalidatePath('/posts')\n}\n\n// Client/Server どちらからも\n<form action={createPost}>\n  <input name='title' />\n  <button>Submit</button>\n</form>",
    },
  },
  {
    id: "next-005",
    categoryId: "nextjs-basics",
    difficulty: "advanced",
    type: "choice",
    question:
      "Next.js App Router でデータキャッシュを無効化する方法として正しいのは？",
    choices: [
      "revalidatePath / revalidateTag / { cache: 'no-store' } / { next: { revalidate: 60 } }",
      "cache.flush() のみ",
      "ブラウザリロードのみ",
      "キャッシュは無効化できない",
    ],
    answerIndex: 0,
    hints: [
      "fetch のオプション or revalidate 関数で制御。",
      "ISR (Incremental Static Regeneration) は revalidate 秒数で。",
      "Server Actions の中で revalidatePath を呼ぶのが定番。",
    ],
    explanation: {
      summary:
        "fetch にキャッシュオプション (`cache`/`next.revalidate`/`next.tags`) を渡し、`revalidatePath` / `revalidateTag` で無効化。",
      reason:
        "Next.js のデータキャッシュは多層。`fetch` のデフォルトは force-cache (永続)。`no-store` で毎回フェッチ、`{ next: { revalidate: 60 } }` で ISR (60 秒)、`{ next: { tags: ['posts'] } }` で tag 付け。Server Action 後に `revalidateTag('posts')` で関連キャッシュをまとめて無効化。",
      codeExample:
        "// 永続キャッシュ (デフォルト)\nawait fetch(url)\n\n// 毎回フェッチ\nawait fetch(url, { cache: 'no-store' })\n\n// ISR (60秒毎)\nawait fetch(url, { next: { revalidate: 60 } })\n\n// tag 付け\nawait fetch(url, { next: { tags: ['posts'] } })\n\n// 無効化\nimport { revalidatePath, revalidateTag } from 'next/cache'\nrevalidatePath('/posts')\nrevalidateTag('posts')",
    },
  },
];
