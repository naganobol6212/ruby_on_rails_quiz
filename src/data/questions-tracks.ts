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
      "undefined / undefined / object",
      "object / undefined / object",
      "null / undefined / array",
      "object / object / array",
    ],
    answerIndex: 1,
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
      "0 と '' のみ",
      "false, 0, '', null, undefined, NaN",
      "false, 0, [], {}, null",
      "false のみ",
    ],
    answerIndex: 1,
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
      "三者は同じ",
      "let は再代入不可",
      "const はグローバル、let はローカル",
      "var は関数スコープ + 巻き上げあり、let/const はブロックスコープ。const は再代入不可",
    ],
    answerIndex: 3,
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
      "name age",
      "obj.name obj.age",
      "undefined undefined",
      "Alice 20",
    ],
    answerIndex: 3,
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
      "5 undefined undefined",
      "TypeError",
      "5 1 2",
      "3 1 2",
    ],
    answerIndex: 2,
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
      "TypeError",
      "null",
      "no email",
      "undefined",
    ],
    answerIndex: 2,
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
      "[2, 4, 6, 8, 10]",
      "[3, 4, 5]",
      "[1, 2, 3, 4, 5]",
      "[6, 8, 10]",
    ],
    answerIndex: 3,
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
      "0 / 0 / 0",
      "undefined",
      "3 / 3 / 3",
      "0 / 1 / 2",
    ],
    answerIndex: 2,
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
      "${name}",
      "undefined",
      "TypeError",
      "hi, Alice",
    ],
    answerIndex: 3,
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
      "function キーワードで作られる関数",
      "this の自動バインディング",
      "関数が定義された時のスコープの変数を、後から実行されても参照できる仕組み",
      "JS の global object",
    ],
    answerIndex: 2,
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
      "['a', 'b', 'c']",
      "{}",
      "{ a: 0, b: 1, c: 2 }",
      "{ 0: 'a', 1: 'b', 2: 'c' }",
    ],
    answerIndex: 2,
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
      "1 → 2 → 3 → 4",
      "1 → 2 → 4 → 3",
      "1 → 3 → 4 → 2",
      "1 → 4 → 3 → 2",
    ],
    answerIndex: 3,
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
      "allSettled は遅い",
      "Promise.all は 1 つでも reject すると全体が reject、Promise.allSettled は全部の結果 (fulfilled/rejected) を返す",
      "両者は同じ",
      "Promise.all は順次、allSettled は並列",
    ],
    answerIndex: 1,
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
      "c → a → b",
      "b → a → c",
      "a → c → b",
      "a → b → c",
    ],
    answerIndex: 2,
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
      "throw された Error がそのまま伝播",
      "何も起きない (静かに失敗)",
      "プログラムが即終了",
      "未処理 Promise rejection の警告/エラー (Node なら UnhandledPromiseRejection)",
    ],
    answerIndex: 3,
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
      "function<number, number, number> add(a, b) {}",
      "type add = (number, number) => number",
      "function add(a: number, b: number): number { return a + b }",
      "function add(number a, number b) returns number {}",
    ],
    answerIndex: 2,
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
      "両者は完全に同じ",
      "interface は宣言マージ可、type は不可。実用上は混在を避けて統一する",
      "type alias は廃止された",
      "interface は遅い",
    ],
    answerIndex: 1,
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
      "両方 T",
      "両方 any",
      "a: string / b: number (各呼び出しで T が推論される)",
      "両方 unknown",
    ],
    answerIndex: 2,
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
      "createState",
      "useState",
      "useStore",
      "useLocalState",
    ],
    answerIndex: 1,
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
      "useEffect は同期処理用",
      "useEffect は引数を取らない",
      "useEffect(() => { ... }, [deps]) で副作用を実行、依存配列が変わった時に再実行",
      "useEffect は廃止された",
    ],
    answerIndex: 2,
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
      "items.map ではなく forEach にすべき",
      "li タグが間違っている",
      "問題なし",
      "key prop が無く、警告 + 再レンダリング時の差分検出が非効率",
    ],
    answerIndex: 3,
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
      "useCallback",
      "useRef",
      "useReducer",
      "useMemo",
    ],
    answerIndex: 3,
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
      "src/pages/about/index.tsx",
      "app/about/page.tsx",
      "pages/about.tsx (Pages Router 用)",
      "app/about.tsx",
    ],
    answerIndex: 1,
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
      "Client Component",
      "Static HTML",
      "Both equally",
      "Server Component (Server 側でレンダリング、JS バンドル無し)",
    ],
    answerIndex: 3,
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
      "handler.ts",
      "route.ts (or route.js)",
      "api.ts",
      "endpoint.ts",
    ],
    answerIndex: 1,
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
      "API Routes only",
      "RPC",
      "Server Actions (\"use server\" 注釈)",
      "Server Functions",
    ],
    answerIndex: 2,
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
      "cache.flush() のみ",
      "ブラウザリロードのみ",
      "キャッシュは無効化できない",
      "revalidatePath / revalidateTag / { cache: 'no-store' } / { next: { revalidate: 60 } }",
    ],
    answerIndex: 3,
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

  // ===========================================================================
  // 💚 Nuxt 基礎 (nuxt-001 〜 nuxt-020, 20問)
  // ===========================================================================
  {
    id: "nuxt-001",
    categoryId: "nuxt-basics",
    difficulty: "beginner",
    type: "choice",
    question: "Nuxt 3 で /about ページを作るときの正しいファイル配置は？",
    choices: [
      "pages/about.vue",
      "app/about.vue",
      "src/about.vue",
      "routes/about.vue",
    ],
    answerIndex: 0,
    hints: [
      "Nuxt は pages/ ディレクトリベースの自動ルーティング。",
      "ファイル名 = URL パスになる。",
      "pages/about.vue → /about。",
    ],
    explanation: {
      summary:
        "Nuxt はファイルベースルーティング。`pages/about.vue` → `/about`、`pages/users/[id].vue` → `/users/:id`。",
      reason:
        "Next.js Pages Router と同じ思想。`pages/index.vue` がトップ、`[param]` で動的、`[...slug]` でキャッチオール。`<NuxtLink to='/about'>` で内部遷移、`<NuxtPage />` でページコンテンツを描画。",
      codeExample:
        "pages/\n  index.vue            → /\n  about.vue            → /about\n  users/\n    index.vue          → /users\n    [id].vue           → /users/:id (動的)\n    [...slug].vue      → /users/* (catch-all)\n\n<template>\n  <NuxtLink to='/about'>About</NuxtLink>\n  <NuxtPage />\n</template>",
    },
  },
  {
    id: "nuxt-002",
    categoryId: "nuxt-basics",
    difficulty: "beginner",
    type: "choice",
    question: "Vue 3 Composition API で『リアクティブな変数』を作る関数は？",
    choices: ["useState (Nuxt 拡張)", "data()", "computed", "ref / reactive"],
    answerIndex: 3,
    hints: [
      "Vue 3 のリアクティブシステムの中核。",
      "プリミティブは ref、オブジェクトは reactive。",
      "ref は .value でアクセス、reactive は直接アクセス。",
    ],
    explanation: {
      summary:
        "`ref(initial)` (プリミティブ向け、.value でアクセス) と `reactive(obj)` (オブジェクト向け、直接アクセス) が Vue 3 のリアクティブの基本。",
      reason:
        "Composition API では `<script setup>` 内で ref / reactive を呼ぶ。テンプレート内では ref の .value は自動アンラップ。Nuxt 3 はサーバ/クライアント間の状態同期に `useState` も提供。",
      codeExample:
        "<script setup>\nimport { ref, reactive, computed } from 'vue'\n\nconst count = ref(0)\nconst user = reactive({ name: 'A', age: 20 })\nconst doubled = computed(() => count.value * 2)\n\nfunction increment() {\n  count.value++       // .value 必要\n  user.age++          // 直接\n}\n</script>",
    },
  },
  {
    id: "nuxt-003",
    categoryId: "nuxt-basics",
    difficulty: "beginner",
    type: "choice",
    question: "Nuxt 3 で API からデータを取得する標準コンポーザブルは？",
    choices: [
      "$nuxt.fetch",
      "asyncMethod",
      "useFetch / useAsyncData",
      "fetch.use()",
    ],
    answerIndex: 2,
    hints: [
      "use で始まるコンポーザブル関数。",
      "SSR / CSR で重複呼び出しを防ぐ仕組み。",
      "useFetch は URL ベース、useAsyncData はキー + 関数ベース。",
    ],
    explanation: {
      summary:
        "`useFetch(url)` は URL からデータ取得 + SSR 統合。`useAsyncData(key, fn)` は任意の async 関数。両方とも SSR ↔ クライアント間で重複フェッチ防止。",
      reason:
        "サーバーで取得したデータがクライアントに渡されるため、ハイドレーション時に再フェッチ不要。`data` / `pending` / `error` / `refresh` を返す。",
      codeExample:
        "<script setup>\nconst { data: posts, pending, error, refresh } = await useFetch('/api/posts')\nconst { data } = await useAsyncData('users', () => $fetch('/api/users'))\n</script>",
    },
  },
  {
    id: "nuxt-004",
    categoryId: "nuxt-basics",
    difficulty: "intermediate",
    type: "choice",
    question: "Nuxt 3 で API エンドポイントを作るディレクトリは？",
    choices: ["server/api/", "api/", "pages/api/", "endpoints/"],
    answerIndex: 0,
    hints: [
      "Nuxt 3 のサーバー機能 (Nitro) を使う配置。",
      "server/api/posts.ts → /api/posts。",
      "Next.js の Route Handler と似た構造。",
    ],
    explanation: {
      summary:
        "`server/api/` 配下に .ts/.js ファイルを置くと `/api/<path>` で API エンドポイントになる (Nitro)。`defineEventHandler` で実装。",
      reason:
        "Nuxt 3 は Nitro サーバを内蔵。`defineEventHandler` 内で `getQuery(event)` / `readBody(event)` 等のヘルパー。HTTP メソッド別なら `.get.ts` / `.post.ts` のサフィックス。",
      codeExample:
        "// server/api/posts.get.ts\nexport default defineEventHandler(async (event) => {\n  return await db.post.findMany()\n})\n\n// server/api/posts.post.ts\nexport default defineEventHandler(async (event) => {\n  const body = await readBody(event)\n  return await db.post.create({ data: body })\n})\n\n// 動的: server/api/posts/[id].ts\nexport default defineEventHandler(async (event) => {\n  const id = getRouterParam(event, 'id')\n  return await db.post.findUnique({ where: { id: Number(id) } })\n})",
    },
  },
  {
    id: "nuxt-005",
    categoryId: "nuxt-basics",
    difficulty: "intermediate",
    type: "choice",
    question: "Nuxt 3 でアプリ全体の状態管理に推奨されるのは？",
    choices: [
      "Redux",
      "context API",
      "Pinia (公式推奨) / useState",
      "Vuex (Vue 2 時代の旧式)",
    ],
    answerIndex: 2,
    hints: [
      "Vue 公式の新しいストアライブラリ。",
      "Composition API ベースで TypeScript 親和性が高い。",
      "Vuex の後継として推奨。",
    ],
    explanation: {
      summary:
        "Pinia は Vue 公式の新しい状態管理 (Vuex 後継)。Composition API ベースで TypeScript 親和性が高い。",
      reason:
        "Vuex に比べてシンプル + 型安全。`defineStore` で 1 つのストアを定義。state / getters / actions を持つ。Nuxt 3 の `useState` は軽量な SSR-safe ref で、複雑な状態には Pinia。",
      codeExample:
        "// stores/user.ts\nexport const useUserStore = defineStore('user', () => {\n  const name = ref('')\n  const isAdmin = computed(() => name.value === 'admin')\n  function setName(n: string) { name.value = n }\n  return { name, isAdmin, setName }\n})",
    },
  },
  {
    id: "nuxt-006",
    categoryId: "nuxt-basics",
    difficulty: "intermediate",
    type: "choice",
    question: "Nuxt 3 でレイアウトを定義するファイルは？",
    choices: [
      "layouts/default.vue",
      "layout/default.vue",
      "pages/_layout.vue",
      "components/Layout.vue",
    ],
    answerIndex: 0,
    hints: [
      "layouts/ ディレクトリ (複数形)。",
      "default.vue がデフォルトレイアウト。",
      "<slot /> でページコンテンツを差し込む。",
    ],
    explanation: {
      summary:
        "`layouts/default.vue` がデフォルト。複数のレイアウトを `layouts/admin.vue` などで定義し、ページから `definePageMeta({ layout: 'admin' })` で指定。",
      reason:
        "ヘッダー・フッター・サイドバーなどを共通化。`<NuxtLayout>` でレイアウトを動的に切り替え可。`<slot />` でページコンテンツを挿入する位置を指定。",
      codeExample:
        "<!-- layouts/default.vue -->\n<template>\n  <AppHeader />\n  <slot />\n  <AppFooter />\n</template>\n\n<!-- pages/admin.vue -->\n<script setup>\ndefinePageMeta({ layout: 'admin' })\n</script>",
    },
  },
  {
    id: "nuxt-007",
    categoryId: "nuxt-basics",
    difficulty: "intermediate",
    type: "text",
    question:
      "Nuxt 3 でページ表示前に認証チェックを行うために使うディレクトリ名は？(英語1単語)",
    answers: ["middleware"],
    hints: [
      "ルートのナビゲーションガード。",
      "middleware/auth.ts のようにファイル配置。",
      "定義は defineNuxtRouteMiddleware で。",
    ],
    explanation: {
      summary:
        "`middleware/` ディレクトリにルートミドルウェアを置く。`defineNuxtRouteMiddleware` で定義し、ページ側で `definePageMeta({ middleware: ['auth'] })` を指定。",
      reason:
        "認証チェック、リダイレクト、ロギング等のページ遷移時の処理。global ミドルウェア (`xxx.global.ts`) で全ページ対象、または individual で個別指定。",
      codeExample:
        "// middleware/auth.ts\nexport default defineNuxtRouteMiddleware((to, from) => {\n  const user = useUserStore()\n  if (!user.isAuthenticated) return navigateTo('/login')\n})\n\n// ページで使用\ndefinePageMeta({ middleware: ['auth'] })",
    },
  },
  {
    id: "nuxt-008",
    categoryId: "nuxt-basics",
    difficulty: "intermediate",
    type: "choice",
    question: "Nuxt 3 で環境変数を扱う仕組みは？",
    choices: [
      "nuxt.config.ts の runtimeConfig + useRuntimeConfig()",
      ".env だけ読み込めば自動",
      "process.env を直接参照",
      "useConfig()",
    ],
    answerIndex: 0,
    hints: [
      "runtimeConfig でサーバー専用とパブリックを分離。",
      "useRuntimeConfig() で取得。",
      ".env の値は NUXT_ プレフィックスで上書きできる。",
    ],
    explanation: {
      summary:
        "`nuxt.config.ts` の `runtimeConfig` で『サーバー専用』『public』を分け、コード側で `useRuntimeConfig()` で取得。`.env` の `NUXT_XXX` で上書き可。",
      reason:
        "クライアントに漏らしたくない値 (API キー) は runtimeConfig 直下、公開してよい値は `public:` 配下に。",
      codeExample:
        "// nuxt.config.ts\nruntimeConfig: {\n  apiSecret: '',                   // サーバ専用\n  public: { baseUrl: 'https://example.com' }\n}\n\n// .env: NUXT_API_SECRET=xxx\n// 使用\nconst config = useRuntimeConfig()\nconfig.public.baseUrl       // クライアント可\nconfig.apiSecret            // server/api でのみ",
    },
  },
  {
    id: "nuxt-009",
    categoryId: "nuxt-basics",
    difficulty: "intermediate",
    type: "choice",
    question: "Vue 3 のテンプレートで条件付き描画と繰り返しのディレクティブは？",
    choices: ["ng-if / ng-for", "if / for", "@if / @for", "v-if / v-for"],
    answerIndex: 3,
    hints: [
      "Vue のテンプレートディレクティブ。",
      "v- で始まる構文。",
      "Angular とは似て非なる構文。",
    ],
    explanation: {
      summary:
        "Vue は `v-if` / `v-else-if` / `v-else` / `v-show` / `v-for` / `v-model` などのディレクティブ。`v-for` には `:key` を必ず付ける。",
      reason:
        "`v-if` は DOM を出し入れ、`v-show` は CSS display 切替。`v-for` の key は React と同じく安定 ID を推奨。`v-model` で双方向、`:` で属性、`@` でイベント。",
      codeExample:
        "<template>\n  <p v-if='loading'>Loading...</p>\n  <ul v-else>\n    <li v-for='item in items' :key='item.id'>{{ item.name }}</li>\n  </ul>\n  <input v-model='username' />\n  <button @click='submit' :disabled='!valid'>Submit</button>\n</template>",
    },
  },
  {
    id: "nuxt-010",
    categoryId: "nuxt-basics",
    difficulty: "intermediate",
    type: "choice",
    question: "Nuxt 3 で『コンポーネントが自動 import される』ディレクトリは？",
    choices: ["ui/", "src/components/", "lib/", "components/"],
    answerIndex: 3,
    hints: [
      "components/ 配下のファイルは import 文なしで使える。",
      "ファイル名 = コンポーネント名 (PascalCase)。",
      "ネストするとプレフィックス付き名前。",
    ],
    explanation: {
      summary:
        "`components/` 配下のファイルは Nuxt が自動でグローバルに import 登録する。`components/Button.vue` は `<Button />` でそのまま使える。",
      reason:
        "ネスト構造はプレフィックスで解決。`components/admin/Header.vue` は `<AdminHeader />` として参照。型 / IDE 補完も自動生成。",
      codeExample:
        "components/\n  Button.vue              → <Button />\n  forms/\n    TextField.vue         → <FormsTextField />\n  admin/\n    Header.vue            → <AdminHeader />",
    },
  },
  {
    id: "nuxt-011",
    categoryId: "nuxt-basics",
    difficulty: "intermediate",
    type: "choice",
    question:
      "Nuxt 3 で自分専用の Composable (例: useFavorites) を作るディレクトリは？",
    choices: ["helpers/", "composables/", "utils/", "hooks/"],
    answerIndex: 1,
    hints: [
      "Composition API のコンポーザブル関数を置く専用ディレクトリ。",
      "自動 import される (use~ 命名)。",
      "React の Custom Hook に近い概念。",
    ],
    explanation: {
      summary:
        "`composables/useXxx.ts` を置くと自動 import。Vue Composition API のロジック再利用パターン。",
      reason:
        "React の Custom Hook と同じ思想。状態管理ロジック・API 呼び出しラッパー・タイマー処理などを切り出す。",
      codeExample:
        "// composables/useFavorites.ts\nexport const useFavorites = () => {\n  const list = useState<number[]>('favorites', () => [])\n  function add(id: number) { if (!list.value.includes(id)) list.value.push(id) }\n  return { list, add }\n}\n\n// 使用 (import 不要)\nconst { list, add } = useFavorites()",
    },
  },
  {
    id: "nuxt-012",
    categoryId: "nuxt-basics",
    difficulty: "intermediate",
    type: "choice",
    question:
      "Nuxt 3 でレンダリングモードを SPA (CSR のみ) にする設定は？",
    choices: [
      "pages/index.client.vue にする",
      "nuxt.config.ts に csr: true",
      "ssr: 'spa'",
      "nuxt.config.ts に ssr: false",
    ],
    answerIndex: 3,
    hints: [
      "ssr 設定で SSR を on/off。",
      "false で純粋な SPA モード。",
      "ハイブリッド (一部だけ SSR) は routeRules で。",
    ],
    explanation: {
      summary:
        "`nuxt.config.ts` の `ssr: false` で完全 SPA。`routeRules` で個別ページ単位の制御 (`{ ssr: false }` や `{ prerender: true }`) も可能。",
      reason:
        "Nuxt はデフォルト SSR (Universal)。`ssr: false` で SPA、`{ prerender: true }` で SSG、`{ swr: 3600 }` で stale-while-revalidate。",
      codeExample:
        "// nuxt.config.ts\nexport default defineNuxtConfig({\n  ssr: false,\n  routeRules: {\n    '/': { prerender: true },\n    '/blog/**': { swr: 3600 },\n    '/admin/**': { ssr: false }\n  }\n})",
    },
  },
  {
    id: "nuxt-013",
    categoryId: "nuxt-basics",
    difficulty: "intermediate",
    type: "choice",
    question: "Vue 3 で『複数の root 要素を持つテンプレート』は許される？",
    choices: [
      "Vue 2 と同じ制約",
      "許される (Fragment、Vue 2 では不可)",
      "許されない",
      "ラッパー div 必須",
    ],
    answerIndex: 1,
    hints: [
      "Vue 3 から Fragment サポート。",
      "Vue 2 ではテンプレートに 1 つの root が必須だった。",
      "React の <></> と同じ思想。",
    ],
    explanation: {
      summary:
        "Vue 3 から複数 root OK (Fragment サポート)。Vue 2 では 1 root 必須だったので大きな改善。",
      reason:
        "Vue 2 では `<template>` 直下に複数要素を置けず、`<div>` でラップする必要があった。Vue 3 / Nuxt 3 では不要。",
      codeExample:
        "<!-- Vue 3: OK -->\n<template>\n  <h1>Title</h1>\n  <p>Body</p>\n  <footer>Footer</footer>\n</template>",
    },
  },
  {
    id: "nuxt-014",
    categoryId: "nuxt-basics",
    difficulty: "intermediate",
    type: "choice",
    question: "Vue 3 の watch / watchEffect の違いは？",
    choices: [
      "両者は完全に同じ",
      "watch は対象を明示 + 旧値も取れる。watchEffect は依存自動追跡で旧値なし",
      "watch は遅い、watchEffect は速い",
      "watch は非推奨、watchEffect 一択",
    ],
    answerIndex: 1,
    hints: [
      "watch(source, callback) で source 指定。",
      "watchEffect(effect) は中で参照したリアクティブ値を自動追跡。",
      "useEffect (React) との対比で考えると分かりやすい。",
    ],
    explanation: {
      summary:
        "`watch(source, cb)` は対象を明示し、旧値と新値を受け取る。`watchEffect(fn)` は中で参照したリアクティブを自動追跡。",
      reason:
        "React の useEffect の依存配列を自動化したのが watchEffect。明示性が欲しい時は watch。",
      codeExample:
        "// watch: 明示\nwatch(count, (newVal, oldVal) => console.log(oldVal, newVal))\n\n// watchEffect: 自動追跡\nwatchEffect(() => {\n  console.log(count.value, name.value)\n})\n\n// 即実行\nwatch(count, fn, { immediate: true })",
    },
  },
  {
    id: "nuxt-015",
    categoryId: "nuxt-basics",
    difficulty: "intermediate",
    type: "choice",
    question:
      "Nuxt 3 でメタタグ (title, description, OG) を動的に設定する関数は？",
    choices: ["useMeta", "$head()", "setHead", "useHead / useSeoMeta"],
    answerIndex: 3,
    hints: [
      "コンポーザブル関数で head 操作。",
      "useSeoMeta はより便利 (型付き OG タグ等)。",
      "両者とも自動 import。",
    ],
    explanation: {
      summary:
        "`useHead({ title, meta, link })` で <head> 操作。`useSeoMeta({ title, ogTitle, description })` は SEO 用の便利版で型補完あり。",
      reason:
        "SSR で正しく <head> に反映 (CSR でもクライアントで更新)。動的タイトル、OG タグ、canonical URL、構造化データ等。",
      codeExample:
        "useSeoMeta({\n  title: () => post.value?.title,\n  ogTitle: () => post.value?.title,\n  description: () => post.value?.excerpt,\n  twitterCard: 'summary_large_image'\n})",
    },
  },
  {
    id: "nuxt-016",
    categoryId: "nuxt-basics",
    difficulty: "advanced",
    type: "choice",
    question: "Nuxt 3 でクライアント専用コンポーネントを作るには？",
    choices: [
      "ブラウザ専用ライブラリは使えない",
      "ComponentName.client.vue のサフィックス, or <ClientOnly> で囲む",
      "ssr: false コンポーネントオプション",
      "use client ディレクティブ (Next.js 流)",
    ],
    answerIndex: 1,
    hints: [
      "ファイル名サフィックス .client.vue。",
      "または <ClientOnly> で囲む。",
      "ブラウザ API (window, localStorage) を使うコンポーネント向け。",
    ],
    explanation: {
      summary:
        "コンポーネント名 `MyChart.client.vue` で SSR スキップ。`<ClientOnly>` ラップでも同等。`.server.vue` でサーバー専用も可。",
      reason:
        "window / localStorage / IntersectionObserver 等ブラウザ専用 API を使うコンポーネントは SSR でエラーになるので、`.client.vue` でクライアントだけで描画。",
      codeExample:
        "<!-- components/MyChart.client.vue -->\n<script setup>\nimport { Chart } from 'chart.js'\n</script>\n\n<!-- または ClientOnly で -->\n<ClientOnly fallback='Loading...'>\n  <MyChart :data='data' />\n</ClientOnly>",
    },
  },
  {
    id: "nuxt-017",
    categoryId: "nuxt-basics",
    difficulty: "advanced",
    type: "choice",
    question:
      "Nuxt 3 でエラーハンドリング全般 (404 / 500) を担当するファイルは？",
    choices: [
      "404.vue / 500.vue",
      "errors/index.vue",
      "error.vue (ルート直下)",
      "_error.vue",
    ],
    answerIndex: 2,
    hints: [
      "Nuxt 3 のエラーページは error.vue 1 つ。",
      "Next.js Pages Router の _error.tsx に近い。",
      "props.error にエラー情報。",
    ],
    explanation: {
      summary:
        "プロジェクトルート直下の `error.vue` がエラーページ。`error` props でステータス / メッセージを受け取り。",
      reason:
        "404, 500, その他全部一つの error.vue でハンドル。`clearError()` でリセット。`throw createError({ statusCode: 404 })` で任意のエラー発生も可。",
      codeExample:
        "<!-- error.vue -->\n<script setup>\nconst props = defineProps<{ error: any }>()\nconst handleError = () => clearError({ redirect: '/' })\n</script>\n\n<template>\n  <h1>{{ error.statusCode }}</h1>\n  <button @click='handleError'>ホームへ</button>\n</template>",
    },
  },
  {
    id: "nuxt-018",
    categoryId: "nuxt-basics",
    difficulty: "advanced",
    type: "choice",
    question: "Vue 3 で『状態が変わったときだけ再計算する』のに使う API は？",
    choices: ["watch", "computed", "ref", "reactive"],
    answerIndex: 1,
    hints: [
      "依存値が変わった時だけ再計算 + 結果をキャッシュ。",
      "React の useMemo に近い概念。",
      "依存値が変わらなければ呼び直しても同じ値を返す。",
    ],
    explanation: {
      summary:
        "`computed(() => expr)` は依存リアクティブが変わった時だけ再評価しキャッシュ。React の useMemo + リアクティブの自動依存追跡を合体させたもの。",
      reason:
        "重い計算 + リアクティブ依存 で使う。同じ template 内で複数回参照されても 1 回しか評価されない。",
      codeExample:
        "const filtered = computed(() =>\n  items.value.filter(n => n > threshold.value)\n)\n\n// getter + setter\nconst fullName = computed({\n  get: () => `${first.value} ${last.value}`,\n  set: (v) => { [first.value, last.value] = v.split(' ') }\n})",
    },
  },
  {
    id: "nuxt-019",
    categoryId: "nuxt-basics",
    difficulty: "advanced",
    type: "choice",
    question:
      "Nuxt 3 で『複数のページにまたがる共通の状態』を SSR 安全に保持する関数は？",
    choices: [
      "reactive",
      "localStorage",
      "useState (Nuxt 提供、SSR 安全な ref)",
      "ref",
    ],
    answerIndex: 2,
    hints: [
      "Nuxt が提供する SSR 対応の状態保持関数。",
      "キーで識別され、サーバ→クライアントへ値が渡される。",
      "ref と違い、page をまたいでも同じ値を共有。",
    ],
    explanation: {
      summary:
        "`useState(key, () => initial)` はキー単位で SSR 状態を共有 + クライアントに引き継ぐ Nuxt 公式の軽量ストア。Pinia より軽い用途に。",
      reason:
        "ref は componentscope。useState はキーベースの『アプリ全体で共有 + SSR 同期』する仕組み。複雑なロジックを伴う状態管理は Pinia、シンプルなフラグやカウンタは useState。",
      codeExample:
        "// 全コンポーネントで同じテーマ値を共有\nconst theme = useState('theme', () => 'light')\ntheme.value = 'dark'",
    },
  },
  {
    id: "nuxt-020",
    categoryId: "nuxt-basics",
    difficulty: "advanced",
    type: "choice",
    question: "Nuxt 3 のデフォルトのフォルダ構成として正しいのは？",
    choices: [
      "src/app / src/components のみ",
      "Rails のような MVC 配置",
      "完全自由 (規約なし)",
      "pages / components / composables / server / layouts / public / assets / middleware / plugins",
    ],
    answerIndex: 3,
    hints: [
      "Nuxt は規約ベース (Convention over Configuration)。",
      "各ディレクトリに明確な役割。",
      "ファイル名でルート自動生成等の機能を活用する。",
    ],
    explanation: {
      summary:
        "Nuxt 3 の規約フォルダ: pages (ルート) / components (UI) / composables (Hook) / server (API) / layouts / middleware / plugins / public / assets / stores (Pinia)。",
      reason:
        "それぞれのフォルダに明確な役割があり、自動 import や規約に沿った機能が動く。`nuxt.config.ts` で各種カスタマイズ。",
      codeExample:
        "/\n├ pages/              ← ルート\n├ components/         ← UI コンポーネント (自動 import)\n├ composables/        ← Composable 関数\n├ server/api/         ← API エンドポイント\n├ layouts/            ← レイアウト\n├ middleware/         ← ルートミドルウェア\n├ public/             ← そのまま配信\n├ nuxt.config.ts      ← 全体設定\n└ app.vue             ← ルートコンポーネント",
    },
  },

  // ===========================================================================
  // 🐍 Python 基礎 (py-001 〜 py-020, 20問)
  // ===========================================================================
  {
    id: "py-001",
    categoryId: "python-basics",
    difficulty: "beginner",
    type: "choice",
    question: "次のコードの出力は？",
    code: "print(type(None))\nprint(type([]))\nprint(type({}))",
    choices: [
      "TypeError",
      "<class 'NoneType'> / <class 'list'> / <class 'dict'>",
      "None / list / dict",
      "type / type / type",
    ],
    answerIndex: 1,
    hints: [
      "type() はオブジェクトのクラスを返す。",
      "None は単独で NoneType クラスのシングルトン。",
      "[] は list、{} は dict。",
    ],
    explanation: {
      summary:
        "`type(obj)` でクラス取得。None → NoneType、[] → list、{} → dict。",
      reason:
        "Python の `type()` は組み込み関数。`isinstance(obj, cls)` で型チェック (継承も考慮)。None 判定は `is None` で。",
      codeExample:
        "type(None)         # <class 'NoneType'>\ntype([])           # <class 'list'>\ntype({})           # <class 'dict'>\nisinstance(x, int)\nx is None",
    },
  },
  {
    id: "py-002",
    categoryId: "python-basics",
    difficulty: "beginner",
    type: "choice",
    question: "次のうち、Python の falsy 値の組み合わせは？",
    choices: [
      "False, 0, 0.0, '', [], {}, set(), None",
      "False のみ",
      "False, 0, None (空コレクションは truthy)",
      "0 のみ",
    ],
    answerIndex: 0,
    hints: [
      "Python は空コレクションも falsy 扱い (Ruby と逆)。",
      "False, 0, '', [], {}, set(), None。",
      "JavaScript と似ているが [] / {} は JS で truthy なので注意。",
    ],
    explanation: {
      summary:
        "Python の falsy: False, 0, 0.0, '', [], {}, set(), None。空コレクションも falsy。",
      reason:
        "Ruby (空配列も truthy) と JavaScript (空配列は truthy) との重要な差。`if mylist:` で『リストが空でないか』判定するイディオムが定番。",
      codeExample:
        "bool('')           # False\nbool([])           # False (Ruby/JS と違う)\nbool([0])          # True\n\nif my_list:        # 空でない時\n    process(my_list)",
    },
  },
  {
    id: "py-003",
    categoryId: "python-basics",
    difficulty: "beginner",
    type: "choice",
    question: "次のコードの出力は？",
    code: "x = 10\ny = 3\nprint(x // y)\nprint(x / y)\nprint(x % y)",
    choices: [
      "3 / 3 / 1",
      "TypeError",
      "3 / 3.3333... / 1",
      "3.33 / 3.33 / 1",
    ],
    answerIndex: 2,
    hints: [
      "// は整数除算 (切り捨て)。",
      "/ は通常の除算で float を返す (Python 3)。",
      "% は剰余。",
    ],
    explanation: {
      summary:
        "Python 3 では `/` は常に float、`//` は整数除算、`%` は剰余、`**` は冪乗。",
      reason:
        "Python 2 では `/` が整数同士で整数除算だったが、Python 3 で常に float。`divmod(x, y)` で商 + 余り。",
      codeExample:
        "10 / 3     # 3.3333\n10 // 3    # 3\n10 % 3     # 1\n2 ** 10    # 1024\ndivmod(10, 3)   # (3, 1)\n\n# 金額計算は decimal\nfrom decimal import Decimal\nDecimal('0.1') + Decimal('0.2')   # 0.3",
    },
  },
  {
    id: "py-004",
    categoryId: "python-basics",
    difficulty: "beginner",
    type: "text",
    question: "Python で文字列を整数に変換する組み込み関数名は？(英語1単語)",
    answers: ["int"],
    hints: [
      "型名そのまま関数として呼ぶ。",
      "Ruby の to_i、JS の parseInt と同等。",
      "数字以外を含むと ValueError。",
    ],
    explanation: {
      summary:
        "`int('42')` で文字列 → 整数。`int(3.7)` で float → 整数 (切り捨て)。失敗時は ValueError。",
      reason:
        "Python は型変換も型名関数で統一: `int()` / `float()` / `str()` / `list()` / `dict()` 等。",
      codeExample:
        "int('42')          # 42\nint(3.7)           # 3 (切り捨て)\nint('0x1A', 16)    # 26\nfloat('3.14')      # 3.14\nstr(42)            # '42'\nint('abc')         # ValueError",
    },
  },
  {
    id: "py-005",
    categoryId: "python-basics",
    difficulty: "beginner",
    type: "choice",
    question: "次のコードの出力は？",
    code: "fruits = ['apple', 'banana', 'cherry']\nprint(fruits[0])\nprint(fruits[-1])\nprint(fruits[1:3])",
    choices: [
      "1 / 3 / [2, 3]",
      "IndexError",
      "apple / cherry / ['banana', 'cherry']",
      "apple / apple / ['banana']",
    ],
    answerIndex: 2,
    hints: [
      "Python のリストは 0 始まり、負数は末尾から。",
      "[-1] は末尾 (last)。",
      "[1:3] はスライス (1 以上 3 未満)。",
    ],
    explanation: {
      summary:
        "Python リスト: `[0]` 先頭、`[-1]` 末尾、`[start:end]` スライス (end 含まず)、`[::-1]` で逆順。",
      reason:
        "Ruby の arr[0..2] と違い、Python の [1:3] は『1 以上 3 未満』。文字列も同じスライス可。",
      codeExample:
        "fruits[1:3]     # ['banana', 'cherry']\nfruits[:2]      # 先頭 2 つ\nfruits[2:]      # index 2 以降\nfruits[::-1]    # 逆順\n'hello'[::-1]   # 'olleh'",
    },
  },
  {
    id: "py-006",
    categoryId: "python-basics",
    difficulty: "intermediate",
    type: "choice",
    question: "次のコードの出力は？",
    code: "nums = [1, 2, 3, 4, 5]\nresult = [n * 2 for n in nums if n % 2 == 0]\nprint(result)",
    choices: ["[2, 4, 6, 8, 10]", "[1, 3, 5]", "[]", "[4, 8]"],
    answerIndex: 3,
    hints: [
      "リスト内包表記。",
      "条件 if n % 2 == 0 で偶数だけ、それを 2 倍。",
      "偶数は 2, 4 → 4, 8。",
    ],
    explanation: {
      summary:
        "リスト内包表記 `[式 for 変数 in iterable if 条件]` は filter + map を 1 行で書く Python の代表的イディオム。",
      reason:
        "Ruby の `arr.select.map`、JS の `arr.filter().map()` に相当。dict / set / generator も同じ構文。",
      codeExample:
        "[n * 2 for n in range(5)]\n[n for n in range(10) if n % 2 == 0]\n\n# dict 内包\n{k: v ** 2 for k, v in d.items()}\n\n# generator (メモリ効率良い)\nsum(n ** 2 for n in range(1000000))",
    },
  },
  {
    id: "py-007",
    categoryId: "python-basics",
    difficulty: "intermediate",
    type: "choice",
    question: "次のコードの出力は？",
    code: "def greet(name='world'):\n    return f'Hello, {name}!'\n\nprint(greet())\nprint(greet('Alice'))",
    choices: [
      "Hello, name! / Hello, Alice!",
      "TypeError",
      "Hello, world! / Hello, Alice!",
      "Hello, ! / Hello, Alice!",
    ],
    answerIndex: 2,
    hints: [
      "デフォルト引数 + f-string (フォーマット文字列)。",
      "引数省略時は 'world' が使われる。",
      "f'{var}' は Python 3.6+ の文字列補間。",
    ],
    explanation: {
      summary:
        "デフォルト引数 + f-string (Python 3.6+) の組合せ。`f'{name}'` で変数展開、`f'{expr:.2f}'` でフォーマット指定。",
      reason:
        "f-string は最も速く読みやすい文字列補間。`f'{name=}'` で名前付きデバッグ表示 (Python 3.8+)。",
      codeExample:
        "f'Hello, {name}!'\nf'{3.14:.2f}'                   # '3.14'\nf'{1000:,}'                     # '1,000'\nf'{name=}'                      # \"name='Alice'\"\n\n# 注意: デフォルト引数の罠\ndef bad(items=[]):              # ❌ 全呼び出しで共有\n    items.append(1)\ndef good(items=None):\n    if items is None: items = []",
    },
  },
  {
    id: "py-008",
    categoryId: "python-basics",
    difficulty: "intermediate",
    type: "choice",
    question: "次のコードの出力は？",
    code: "d = {'name': 'Alice', 'age': 20}\nprint(d.get('name'))\nprint(d.get('email', 'N/A'))",
    choices: [
      "Alice / None",
      "name / age",
      "KeyError",
      "Alice / N/A",
    ],
    answerIndex: 3,
    hints: [
      "dict.get(key) は存在しないキーで None。",
      "dict.get(key, default) でデフォルト値指定可。",
      "d[key] はキーが無いと KeyError なので注意。",
    ],
    explanation: {
      summary:
        "`dict.get(key, default)` で安全アクセス。`d[key]` は無いと KeyError。Ruby の Hash#fetch と類似。",
      reason:
        "`d.setdefault(key, [])` でキーが無ければ作って返す。`collections.defaultdict(list)` でも同じ用途。",
      codeExample:
        "d.get('x')              # None\nd.get('x', 0)           # 0\n\n# グループ化\nfrom collections import defaultdict\ngroups = defaultdict(list)\nfor item in items:\n    groups[item.key].append(item)",
    },
  },
  {
    id: "py-009",
    categoryId: "python-basics",
    difficulty: "intermediate",
    type: "choice",
    question: "Python で例外を捕捉する正しい構文は？",
    choices: [
      "begin / rescue / ensure",
      "do / catch",
      "try / except / else / finally",
      "try / catch / finally",
    ],
    answerIndex: 2,
    hints: [
      "Java / JS の try/catch に近いが catch ではなく except。",
      "else 句もあり (例外が出なかった時のみ)。",
      "finally は常に実行。",
    ],
    explanation: {
      summary:
        "Python: `try` / `except` (例外捕捉) / `else` (例外なし時) / `finally` (常に)。except に複数の型 + as e で受け取り。",
      reason:
        "`except (ValueError, TypeError) as e` で複数指定。`raise NewError from original` で例外チェーン。",
      codeExample:
        "try:\n    result = int(user_input)\nexcept ValueError as e:\n    print(f'invalid: {e}')\nexcept Exception as e:\n    print(f'error: {e}')\nelse:\n    print(f'parsed: {result}')\nfinally:\n    cleanup()",
    },
  },
  {
    id: "py-010",
    categoryId: "python-basics",
    difficulty: "intermediate",
    type: "choice",
    question: "Python で『with 文』を使う主な目的は？",
    choices: [
      "クラス定義",
      "型ヒント",
      "リソース (ファイル / ロック / 接続) を安全に開閉する (context manager)",
      "for ループの代替",
    ],
    answerIndex: 2,
    hints: [
      "ファイル open + close を自動化する仕組み。",
      "ブロック抜けで自動 close (例外時も)。",
      "Ruby の File.open ブロック付きに相当。",
    ],
    explanation: {
      summary:
        "`with` 文は context manager (`__enter__`/`__exit__`) を呼び、ブロック抜けで自動クリーンアップ。",
      reason:
        "`contextlib.contextmanager` デコレータで自作可。複数同時: `with open('a') as a, open('b') as b:`。",
      codeExample:
        "with open('data.txt') as f:\n    content = f.read()\n# ここで自動 close\n\n# 自作 context manager\nfrom contextlib import contextmanager\nfrom time import perf_counter\n\n@contextmanager\ndef timer(name):\n    start = perf_counter()\n    yield\n    print(f'{name}: {perf_counter() - start:.2f}s')",
    },
  },
  {
    id: "py-011",
    categoryId: "python-basics",
    difficulty: "intermediate",
    type: "choice",
    question: "次のコードの出力は？",
    code: "def add(*args, **kwargs):\n    print(args)\n    print(kwargs)\n\nadd(1, 2, 3, x=10, y=20)",
    choices: [
      "TypeError",
      "(1, 2, 3) / {'x': 10, 'y': 20}",
      "[1, 2, 3] / {'x': 10, 'y': 20}",
      "1 2 3 / x=10 y=20",
    ],
    answerIndex: 1,
    hints: [
      "*args は位置引数のタプル。",
      "**kwargs はキーワード引数の辞書。",
      "args = (1, 2, 3) は tuple、kwargs = {'x': 10, 'y': 20}。",
    ],
    explanation: {
      summary:
        "`*args` で位置引数を tuple 化、`**kwargs` でキーワード引数を dict 化。可変長引数を扱う標準パターン。",
      reason:
        "デコレータ・ラッパー関数で頻出。`*` / `**` は『展開』にも使える (`func(*list)` で list を位置引数として展開)。",
      codeExample:
        "show(1, 2, name='A')   # (1, 2) {'name': 'A'}\n\n# 展開\nnums = [1, 2, 3]\nfunc(*nums)            # func(1, 2, 3)\n\nopts = {'name': 'A', 'age': 20}\nfunc(**opts)            # func(name='A', age=20)",
    },
  },
  {
    id: "py-012",
    categoryId: "python-basics",
    difficulty: "intermediate",
    type: "choice",
    question:
      "Python で『反復可能な値 (iterable)』を 1 行で受け取って zip する関数は？",
    choices: ["zip(a, b)", "pair(a, b)", "combine(a, b)", "tuple.zip"],
    answerIndex: 0,
    hints: [
      "JavaScript / Ruby の zip と同じ意味。",
      "対応する要素を tuple ペアで返すイテレータ。",
      "長さが違うと短い方で打ち切り (zip_longest なら埋める)。",
    ],
    explanation: {
      summary:
        "`zip(iter1, iter2, ...)` で要素同士をペアにしたイテレータを返す。`dict(zip(keys, values))` で辞書化が定番。",
      reason:
        "並列に複数イテレーションを進める時に必須。`enumerate(iterable)` でインデックス付き。`itertools.zip_longest` で短い方を fillvalue で埋める。",
      codeExample:
        "list(zip([1, 2, 3], ['a', 'b', 'c']))\n# [(1, 'a'), (2, 'b'), (3, 'c')]\n\ndict(zip(['name', 'age'], ['A', 20]))\n\nfor i, x in enumerate(['a', 'b', 'c'], start=1):\n    print(i, x)",
    },
  },
  {
    id: "py-013",
    categoryId: "python-basics",
    difficulty: "intermediate",
    type: "choice",
    question:
      "Python の class 定義で『コンストラクタ』に相当する特殊メソッド名は？",
    choices: ["__init__", "__new__", "__construct", "init"],
    answerIndex: 0,
    hints: [
      "double underscore で囲む特殊メソッド (dunder)。",
      "オブジェクト生成時に自動で呼ばれる。",
      "self が第 1 引数。",
    ],
    explanation: {
      summary:
        "`__init__(self, ...)` がコンストラクタ (初期化メソッド)。生成は `__new__` だが通常は init のオーバーライドだけで OK。",
      reason:
        "Python はクラス周りに特殊メソッド (dunder) を多用: `__init__` 初期化、`__str__` to_s、`__repr__` inspect、`__eq__` `==`、`__lt__` `<`、`__add__` `+`、`__len__` len()、`__iter__` for ループ、`__call__` 関数呼び出し。",
      codeExample:
        "class User:\n    def __init__(self, name, age):\n        self.name = name\n        self.age = age\n    def __repr__(self):\n        return f'User(name={self.name!r}, age={self.age})'\n    def __eq__(self, other):\n        return isinstance(other, User) and self.name == other.name",
    },
  },
  {
    id: "py-014",
    categoryId: "python-basics",
    difficulty: "intermediate",
    type: "text",
    question:
      "Python の標準ライブラリで『データクラス』(自動 __init__/__repr__/__eq__) を生成するデコレータ名は？(英語1単語、小文字)",
    answers: ["dataclass"],
    hints: [
      "Python 3.7+ で導入された便利機能。",
      "`@dataclass` をクラスに付ける。",
      "Rails の Struct / TS の type に近い。",
    ],
    explanation: {
      summary:
        "`@dataclass` (`from dataclasses import dataclass`) でフィールドから __init__ / __repr__ / __eq__ を自動生成。",
      reason:
        "ボイラープレートの削減。`@dataclass(frozen=True)` でイミュータブル化。型ヒントが必須。`field(default_factory=list)` でデフォルトに mutable を使う時の罠回避。",
      codeExample:
        "from dataclasses import dataclass, field\n\n@dataclass\nclass User:\n    name: str\n    age: int = 0\n    tags: list[str] = field(default_factory=list)\n\nu = User(name='Alice', age=20)\nprint(u)            # User(name='Alice', age=20, tags=[])\nu == User('Alice', 20)   # True",
    },
  },
  {
    id: "py-015",
    categoryId: "python-basics",
    difficulty: "intermediate",
    type: "choice",
    question: "Python で関数の前に書いて挙動を変える @ で始まる記法は？",
    choices: [
      "デコレータ (decorator)",
      "アノテーション",
      "プラグマ",
      "アスペクト",
    ],
    answerIndex: 0,
    hints: [
      "@ で始まる、関数の上に書く記法。",
      "関数を引数に取って関数を返す高階関数。",
      "Flask の @app.route や @staticmethod など。",
    ],
    explanation: {
      summary:
        "デコレータ `@xxx` は関数 / クラスを引数に取って『変更された関数 / クラス』を返す高階関数を糖衣的に適用する記法。",
      reason:
        "クロスカッティング関心事 (ログ / 計測 / 認証 / キャッシュ) を関数本体に混ぜずに切り出せる。",
      codeExample:
        "from functools import wraps, lru_cache\n\ndef timer(func):\n    @wraps(func)\n    def inner(*args, **kwargs):\n        start = perf_counter()\n        result = func(*args, **kwargs)\n        print(f'{func.__name__}: {perf_counter() - start:.3f}s')\n        return result\n    return inner\n\n@timer\ndef heavy(): ...\n\n@lru_cache(maxsize=128)\ndef fib(n):\n    return n if n < 2 else fib(n-1) + fib(n-2)",
    },
  },
  {
    id: "py-016",
    categoryId: "python-basics",
    difficulty: "intermediate",
    type: "choice",
    question:
      "Python の class 継承で『親クラスの同名メソッドを呼ぶ』書き方は？",
    choices: [
      "super().method_name()",
      "parent.method_name()",
      "self.parent.method_name()",
      "@parent",
    ],
    answerIndex: 0,
    hints: [
      "Java / Ruby と同じ super。",
      "Python は super() で親クラスのプロキシを取得。",
      "self も自動で渡される。",
    ],
    explanation: {
      summary:
        "`super().method()` で親クラスのメソッド呼び出し。`super().__init__(args)` で親の初期化。",
      reason:
        "Python 3 では引数なしの `super()` が標準。多重継承では MRO (Method Resolution Order) に従って次のクラスへ。",
      codeExample:
        "class Dog(Animal):\n    def __init__(self, name, breed):\n        super().__init__(name)\n        self.breed = breed\n    def speak(self):\n        return super().speak() + ' + bark'\n\nprint(D.__mro__)   # MRO の確認",
    },
  },
  {
    id: "py-017",
    categoryId: "python-basics",
    difficulty: "advanced",
    type: "choice",
    question: "次のコードの出力は？",
    code: "def make_counter():\n    count = 0\n    def inner():\n        nonlocal count\n        count += 1\n        return count\n    return inner\n\nc = make_counter()\nprint(c(), c(), c())",
    choices: ["UnboundLocalError", "1 2 3", "1 1 1", "0 0 0"],
    answerIndex: 1,
    hints: [
      "クロージャ + nonlocal キーワード。",
      "nonlocal で外側スコープの変数を書き換えられる。",
      "JS の closure と同じ仕組み。",
    ],
    explanation: {
      summary:
        "`nonlocal` で外側の関数スコープの変数を書き換え可能に。Python のクロージャを書き換え可能にする鍵。",
      reason:
        "Python の代入は『新しいローカル変数の作成』が原則なので、外側の変数を変更したい時は `nonlocal` / `global` で明示する必要がある。",
      codeExample:
        "def make_counter():\n    count = 0\n    def inner():\n        nonlocal count\n        count += 1\n        return count\n    return inner\n\n# nonlocal なしだと書き込みでローカル化されてエラー",
    },
  },
  {
    id: "py-018",
    categoryId: "python-basics",
    difficulty: "advanced",
    type: "choice",
    question: "Python の Generator (yield 関数) の特徴として正しいのは？",
    choices: [
      "通常の関数より速い",
      "並列実行する",
      "戻り値が dict",
      "値を都度生成して返すイテレータ。メモリ効率が良く無限列も扱える",
    ],
    answerIndex: 3,
    hints: [
      "yield キーワードを使う関数。",
      "next() を呼ばれるたびに yield で 1 つずつ返す。",
      "Ruby の Enumerator や JS の generator (function*) に相当。",
    ],
    explanation: {
      summary:
        "Generator (`yield` で値を返す関数) は遅延評価のイテレータ。1 つずつ生成 → メモリ効率良 + 無限列対応。",
      reason:
        "大量データの逐次処理に最適。yield で実行を中断 (next() で再開)。",
      codeExample:
        "def count_up(start):\n    while True:\n        yield start\n        start += 1\n\n# generator expression\nsquares = (x ** 2 for x in range(1000000))\nsum(squares)\n\n# ファイル行ストリーミング\ndef read_lines(path):\n    with open(path) as f:\n        for line in f:\n            yield line.rstrip()",
    },
  },
  {
    id: "py-019",
    categoryId: "python-basics",
    difficulty: "advanced",
    type: "choice",
    question: "Python の主要なテストフレームワークは？",
    choices: [
      "Mocha",
      "pytest (推奨) / unittest (標準ライブラリ)",
      "RSpec",
      "Jest",
    ],
    answerIndex: 1,
    hints: [
      "pytest は現代的なデファクト。",
      "unittest は標準ライブラリで Java JUnit 風。",
      "pytest の方が記述が簡潔。",
    ],
    explanation: {
      summary:
        "現代の Python テストは `pytest` がデファクト。標準ライブラリには `unittest`。pytest はシンプルな assert 文 + fixture 機能で生産性高。",
      reason:
        "pytest: 関数として書ける、`assert` 文だけで OK、`fixture` で DI 的に依存を注入、`parametrize` でデータドリブンテスト。Mocking は `unittest.mock`。",
      codeExample:
        "import pytest\n\ndef test_add():\n    assert add(2, 3) == 5\n\n@pytest.fixture\ndef user():\n    return {'name': 'Alice'}\n\n@pytest.mark.parametrize('a,b,exp', [(1,2,3), (5,6,11)])\ndef test_add_table(a, b, exp):\n    assert add(a, b) == exp\n\nfrom unittest.mock import patch\n@patch('mymodule.api_call')\ndef test_with_mock(mock_api):\n    mock_api.return_value = {'ok': True}",
    },
  },
  {
    id: "py-020",
    categoryId: "python-basics",
    difficulty: "advanced",
    type: "choice",
    question:
      "Python のパッケージ管理 + 仮想環境のモダンなツールは？",
    choices: [
      "uv / poetry / pip + venv",
      "gem / bundler",
      "npm / yarn",
      "cargo",
    ],
    answerIndex: 0,
    hints: [
      "uv は最近 (2024 年〜) 高速で注目。",
      "poetry は pyproject.toml ベース、Bundler 的体験。",
      "古典は pip + venv の組合せ。",
    ],
    explanation: {
      summary:
        "現代の Python: `uv` (Astral 社、Rust 製、超高速、2024〜) / `poetry` (定番、依存ロック) / `pip + venv` (標準ライブラリ)。",
      reason:
        "Python のパッケージ管理は歴史的に難しかったが、最近は改善。`uv` は uv pip / uv add / uv run で開発体験が劇的に向上。`pyproject.toml` が標準フォーマット。",
      codeExample:
        "# uv (推奨)\nuv init myapp\nuv add requests pytest\nuv run python app.py\n\n# poetry\npoetry init\npoetry add requests\npoetry install\n\n# 古典 pip + venv\npython -m venv .venv\nsource .venv/bin/activate\npip install -r requirements.txt",
    },
  },

  // ===========================================================================
  // 🗃️ SQL 基礎 (sql-001 〜 sql-010, 10問)
  // ===========================================================================
  {
    id: "sql-001",
    categoryId: "sql-basics",
    difficulty: "beginner",
    type: "choice",
    question: "users テーブルから全カラムを取得する SQL は？",
    choices: [
      "GET users",
      "SELECT users",
      "FETCH * users",
      "SELECT * FROM users",
    ],
    answerIndex: 3,
    hints: [
      "`SELECT カラム FROM テーブル` が基本形。",
      "`*` で全カラム。",
      "FROM 句でテーブル指定。",
    ],
    explanation: {
      summary:
        "`SELECT カラム FROM テーブル` が SELECT の基本構文。`*` で全カラム取得。",
      reason:
        "`SELECT *` は手軽だが、本番では『必要なカラムだけ』指定する習慣を。INDEX 最適化、ネットワーク帯域節約、カラム追加時の予期しない変化を防ぐ。",
      codeExample:
        "SELECT * FROM users;\nSELECT id, name, email FROM users;\nSELECT id AS user_id, name FROM users;  -- エイリアス\nSELECT * FROM users LIMIT 10;\nSELECT * FROM users LIMIT 10 OFFSET 20;",
    },
  },
  {
    id: "sql-002",
    categoryId: "sql-basics",
    difficulty: "beginner",
    type: "choice",
    question: "active=true のユーザーだけを取得する SQL は？",
    choices: [
      "SELECT * FROM users WHERE active = true",
      "SELECT * FROM users IF active",
      "SELECT * FROM users HAVING active",
      "FILTER users active",
    ],
    answerIndex: 0,
    hints: [
      "WHERE 句で行をフィルタ。",
      "条件は = / != / > / < / IN / LIKE 等。",
      "HAVING は GROUP BY 後の集計フィルタ用。",
    ],
    explanation: {
      summary:
        "`WHERE 条件` で行をフィルタ。AND / OR / NOT で論理結合、IN / LIKE / IS NULL / BETWEEN もよく使う。",
      reason:
        "WHERE は『集計前』のフィルタ、HAVING は『集計後』のフィルタ。NULL は `= NULL` ではマッチしない (`IS NULL` を使う)。",
      codeExample:
        "SELECT * FROM users WHERE age >= 18 AND age < 65;\nSELECT * FROM users WHERE role IN ('admin', 'editor');\nSELECT * FROM users WHERE name LIKE 'A%';\nSELECT * FROM users WHERE email IS NULL;\nSELECT * FROM users WHERE created_at BETWEEN '2024-01-01' AND '2024-12-31';",
    },
  },
  {
    id: "sql-003",
    categoryId: "sql-basics",
    difficulty: "beginner",
    type: "choice",
    question: "ユーザーを年齢の昇順で取得する SQL は？",
    choices: [
      "SELECT * FROM users ORDER BY age",
      "SELECT * FROM users SORT age",
      "SELECT * FROM users ASCENDING age",
      "SELECT ORDER age FROM users",
    ],
    answerIndex: 0,
    hints: [
      "ORDER BY カラム [ASC|DESC]。",
      "デフォルトは ASC (昇順)。",
      "降順なら DESC。",
    ],
    explanation: {
      summary:
        "`ORDER BY カラム ASC|DESC` で並び替え。複数キーは `ORDER BY col1, col2 DESC`。",
      reason:
        "ASC がデフォルト省略可。複数キーで指定すると、最初のキーが同じ場合に次のキーで比較。",
      codeExample:
        "SELECT * FROM users ORDER BY age;\nSELECT * FROM users ORDER BY age DESC;\nSELECT * FROM users ORDER BY role, age DESC;\nSELECT * FROM users ORDER BY last_login DESC NULLS LAST;",
    },
  },
  {
    id: "sql-004",
    categoryId: "sql-basics",
    difficulty: "beginner",
    type: "choice",
    question: "ロール別にユーザー数を集計する SQL は？",
    choices: [
      "SELECT GROUP role FROM users",
      "SELECT role, COUNT(*) FROM users GROUP BY role",
      "SELECT role, COUNT FROM users",
      "COUNT users BY role",
    ],
    answerIndex: 1,
    hints: [
      "GROUP BY でグループ化、COUNT/SUM/AVG/MAX/MIN で集計。",
      "SELECT には集計関数とグループ化カラムのみ書ける。",
      "結果は (role, count) のペア。",
    ],
    explanation: {
      summary:
        "`GROUP BY col` + 集計関数 (COUNT/SUM/AVG/MAX/MIN) で集計。集計後の絞り込みは `HAVING`。",
      reason:
        "`COUNT(*)` 全行数、`COUNT(col)` NULL を除いた数、`COUNT(DISTINCT col)` ユニーク数。",
      codeExample:
        "SELECT role, COUNT(*) FROM users GROUP BY role;\nSELECT role, COUNT(*) AS cnt\nFROM users GROUP BY role\nHAVING COUNT(*) > 10;\nSELECT COUNT(DISTINCT email) FROM users;",
    },
  },
  {
    id: "sql-005",
    categoryId: "sql-basics",
    difficulty: "beginner",
    type: "choice",
    question: "新規ユーザーを追加する SQL は？",
    choices: [
      "ADD users name='Alice'",
      "CREATE users SET name='Alice'",
      "PUT users (name) VALUES ('Alice')",
      "INSERT INTO users (name, email) VALUES ('Alice', 'a@x')",
    ],
    answerIndex: 3,
    hints: [
      "INSERT INTO テーブル (カラム) VALUES (値)。",
      "カラム指定省略時は全カラムを順番に。",
      "複数行は VALUES (...), (...)。",
    ],
    explanation: {
      summary:
        "`INSERT INTO テーブル (col1, col2) VALUES (v1, v2)` で 1 行追加。複数行は VALUES を繰り返し。",
      reason:
        "カラム指定なしで INSERT すると全カラムを位置順で指定する必要があり、列の追加で壊れやすい。`RETURNING` 句 (PostgreSQL) で挿入後の値を取得可。",
      codeExample:
        "INSERT INTO users (name, email)\nVALUES ('Alice', 'a@x'),\n       ('Bob', 'b@x');\n\nINSERT INTO users (name) VALUES ('Alice')\nRETURNING id;\n\nINSERT INTO users_archive (name, email)\nSELECT name, email FROM users WHERE deleted_at IS NOT NULL;",
    },
  },
  {
    id: "sql-006",
    categoryId: "sql-basics",
    difficulty: "beginner",
    type: "choice",
    question: "id=1 のユーザーの name を更新する SQL は？",
    choices: [
      "UPDATE users SET name = 'B' WHERE id = 1",
      "SET users name = 'B' WHERE id = 1",
      "MODIFY users SET name = 'B'",
      "ALTER users name = 'B' WHERE id = 1",
    ],
    answerIndex: 0,
    hints: [
      "UPDATE テーブル SET カラム = 値 WHERE 条件。",
      "WHERE を忘れると全行更新で大事故。",
      "WHERE 必須を絶対に意識する。",
    ],
    explanation: {
      summary:
        "`UPDATE テーブル SET col=val WHERE 条件`。**WHERE 忘れると全行更新** で致命的。",
      reason:
        "本番でやらかしがちな事故 No.1。トランザクション内なら ROLLBACK 可能なので、本番では BEGIN; UPDATE; SELECT で確認; COMMIT; の習慣を。",
      codeExample:
        "UPDATE users SET name = 'B' WHERE id = 1;\n\n-- 複数カラム\nUPDATE users\nSET name = 'B', updated_at = NOW()\nWHERE id = 1;\n\n-- 安全: トランザクション\nBEGIN;\nUPDATE users SET name = 'B' WHERE id = 1;\nSELECT * FROM users WHERE id = 1;\nCOMMIT;   -- or ROLLBACK;",
    },
  },
  {
    id: "sql-007",
    categoryId: "sql-basics",
    difficulty: "beginner",
    type: "choice",
    question: "id=1 のユーザーを削除する SQL は？",
    choices: [
      "REMOVE FROM users WHERE id = 1",
      "DROP users WHERE id = 1",
      "DELETE users SET id = 1",
      "DELETE FROM users WHERE id = 1",
    ],
    answerIndex: 3,
    hints: [
      "DELETE FROM テーブル WHERE 条件。",
      "DROP TABLE は『テーブル自体を消す』なので別物。",
      "WHERE 必須 (忘れると全行削除)。",
    ],
    explanation: {
      summary:
        "`DELETE FROM テーブル WHERE 条件`。**WHERE 忘れると全行削除**。テーブル自体を消すのは `DROP TABLE`。",
      reason:
        "`DELETE` は行削除、`DROP TABLE` はテーブル自体削除、`TRUNCATE TABLE` は全行高速削除 + ID リセット。本番では論理削除 (deleted_at) を推奨。",
      codeExample:
        "DELETE FROM users WHERE id = 1;\nDELETE FROM sessions WHERE expires_at < NOW();\n\nTRUNCATE TABLE users;       -- 高速全削除\nDROP TABLE users;            -- テーブル自体削除\n\n-- 安全 (論理削除)\nUPDATE users SET deleted_at = NOW() WHERE id = 1;",
    },
  },
  {
    id: "sql-008",
    categoryId: "sql-basics",
    difficulty: "intermediate",
    type: "choice",
    question: "name の重複を除いて一覧する SQL は？",
    choices: [
      "SELECT DISTINCT name FROM users",
      "SELECT UNIQUE name FROM users",
      "SELECT name FROM users WHERE UNIQUE",
      "SELECT name FROM users GROUP",
    ],
    answerIndex: 0,
    hints: [
      "DISTINCT で重複を除去。",
      "SELECT の直後に DISTINCT。",
      "GROUP BY name でも同じ結果になる。",
    ],
    explanation: {
      summary:
        "`SELECT DISTINCT col` で重複除去。`COUNT(DISTINCT col)` でユニーク数。",
      reason:
        "複数カラムの組合せでユニークを取りたいなら `SELECT DISTINCT a, b FROM t`。",
      codeExample:
        "SELECT DISTINCT role FROM users;\nSELECT DISTINCT role, active FROM users;\nSELECT COUNT(DISTINCT email) FROM users;\n\n-- PostgreSQL の DISTINCT ON (グループ毎の代表 1 行)\nSELECT DISTINCT ON (user_id) *\nFROM orders\nORDER BY user_id, created_at DESC;",
    },
  },
  {
    id: "sql-009",
    categoryId: "sql-basics",
    difficulty: "intermediate",
    type: "text",
    question:
      "SQL で NULL かどうかを判定するキーワードは `??? NULL` (記号ではなく英語)。??? に入る句は？(英語1-2単語)",
    answers: ["IS", "IS NOT"],
    hints: [
      "= NULL ではマッチしない (SQL の三値論理)。",
      "NULL チェック専用キーワードを使う。",
      "IS / IS NOT のペア。",
    ],
    explanation: {
      summary:
        "NULL 判定は `IS NULL` / `IS NOT NULL` を使う。`= NULL` では真にならない (SQL の三値論理: TRUE/FALSE/UNKNOWN)。",
      reason:
        "SQL の `=` は『同じ値か』を判定するが、NULL は『値が不明』なので比較結果が UNKNOWN になり WHERE 句で除外される。",
      codeExample:
        "SELECT * FROM users WHERE email IS NULL;\nSELECT * FROM users WHERE email IS NOT NULL;\n\nSELECT id, COALESCE(name, 'Anonymous') AS display_name FROM users;\nSELECT NULLIF(score, 0) FROM exams;",
    },
  },
  {
    id: "sql-010",
    categoryId: "sql-basics",
    difficulty: "intermediate",
    type: "choice",
    question: "次のクエリ結果は？",
    code: "-- users: (id, name, age) = (1,A,20), (2,B,30), (3,C,40), (4,D,15)\nSELECT name FROM users\nWHERE age >= 18\nORDER BY age DESC\nLIMIT 2;",
    choices: ["C, B", "A, B", "B, C", "C, B, A"],
    answerIndex: 0,
    hints: [
      "age >= 18 で D (15) を除外 → A(20), B(30), C(40)。",
      "ORDER BY age DESC で C, B, A。",
      "LIMIT 2 で C, B。",
    ],
    explanation: {
      summary:
        "WHERE → ORDER BY → LIMIT の順に評価。条件で D 除外、降順ソートで C/B/A、上位 2 件で C/B。",
      reason:
        "SQL の論理的実行順序: FROM → WHERE → GROUP BY → HAVING → SELECT → ORDER BY → LIMIT。",
      codeExample:
        "-- 評価順:\n-- 1. FROM\n-- 2. WHERE\n-- 3. GROUP BY\n-- 4. HAVING\n-- 5. SELECT\n-- 6. ORDER BY\n-- 7. LIMIT\n\nSELECT * FROM users\nORDER BY id\nLIMIT 20 OFFSET 40;   -- 3 ページ目",
    },
  },

  // ===========================================================================
  // 🔗 SQL 結合 (sql-011 〜 sql-018, 8問)
  // ===========================================================================
  {
    id: "sql-011",
    categoryId: "sql-joins",
    difficulty: "beginner",
    type: "choice",
    question: "users と posts を user_id で結合する SQL は？",
    choices: [
      "SELECT * FROM users.posts",
      "JOIN users posts ON user_id",
      "SELECT * FROM users INNER JOIN posts ON users.id = posts.user_id",
      "SELECT * FROM users WHERE posts.user_id",
    ],
    answerIndex: 2,
    hints: [
      "INNER JOIN テーブル ON 条件 で結合。",
      "両テーブルで一致する行のみ。",
      "ON で結合条件指定。",
    ],
    explanation: {
      summary:
        "`INNER JOIN テーブル ON 結合条件` で内部結合 (両方にマッチする行のみ)。",
      reason:
        "JOIN は SQL の中核。INNER / LEFT / RIGHT / FULL。テーブルエイリアス (`users u`) で可読性向上。",
      codeExample:
        "SELECT u.name, p.title\nFROM users u\nINNER JOIN posts p ON u.id = p.user_id;\n\nSELECT u.name, p.title, c.body\nFROM users u\nJOIN posts p ON u.id = p.user_id\nJOIN comments c ON p.id = c.post_id;",
    },
  },
  {
    id: "sql-012",
    categoryId: "sql-joins",
    difficulty: "beginner",
    type: "choice",
    question: "INNER JOIN と LEFT JOIN の違いは？",
    choices: [
      "LEFT は左テーブルしか返さない",
      "INNER は両方一致する行のみ、LEFT は左テーブルの全行 (右側 NULL になりうる)",
      "両者は同じ",
      "INNER は遅い",
    ],
    answerIndex: 1,
    hints: [
      "INNER = 共通部分のみ。",
      "LEFT OUTER JOIN = 左テーブル全部 + マッチした右テーブル。",
      "マッチしない右側は NULL になる。",
    ],
    explanation: {
      summary:
        "INNER: 両側一致のみ。LEFT (OUTER): 左の全行 + 右マッチ (なければ NULL)。RIGHT: 逆。FULL: 両方の全行。",
      reason:
        "『投稿が無いユーザーも含めて表示したい』場合は LEFT JOIN。`WHERE posts.id IS NULL` で『投稿が無いユーザーだけ』(アンチジョイン) が抽出できる。",
      codeExample:
        "-- LEFT: 全ユーザー\nSELECT u.name, p.title\nFROM users u LEFT JOIN posts p ON u.id = p.user_id;\n\n-- アンチジョイン\nSELECT u.*\nFROM users u\nLEFT JOIN posts p ON u.id = p.user_id\nWHERE p.id IS NULL;",
    },
  },
  {
    id: "sql-013",
    categoryId: "sql-joins",
    difficulty: "intermediate",
    type: "choice",
    question: "各ユーザーの投稿数を集計する SQL は？",
    choices: [
      "SELECT * FROM users GROUP BY posts",
      "JOIN COUNT users posts",
      "SELECT u.name, COUNT(p.id) FROM users u LEFT JOIN posts p ON u.id = p.user_id GROUP BY u.id, u.name",
      "SELECT COUNT(users) FROM posts",
    ],
    answerIndex: 2,
    hints: [
      "JOIN + GROUP BY + COUNT の組合せ。",
      "LEFT JOIN で投稿 0 件のユーザーも含める。",
      "COUNT(p.id) は NULL を除く (= 投稿数)。",
    ],
    explanation: {
      summary:
        "`LEFT JOIN + GROUP BY + COUNT(関連カラム)` で『各親に対する子の件数』を集計。COUNT(*) ではなく COUNT(p.id) で NULL を除外。",
      reason:
        "ActiveRecord の `user.posts.count` の SQL 形。`COUNT(*)` だと LEFT JOIN で NULL の行も 1 と数えて投稿 0 件のユーザーが 1 になるバグ。",
      codeExample:
        "SELECT u.name, COUNT(p.id) AS post_count\nFROM users u\nLEFT JOIN posts p ON u.id = p.user_id\nGROUP BY u.id, u.name\nORDER BY post_count DESC;\n\n-- グループ毎の絞り込み\nSELECT u.name, COUNT(p.id) AS cnt\nFROM users u JOIN posts p ON u.id = p.user_id\nGROUP BY u.id\nHAVING COUNT(p.id) >= 5;",
    },
  },
  {
    id: "sql-014",
    categoryId: "sql-joins",
    difficulty: "intermediate",
    type: "choice",
    question: "次のうち、サブクエリの使い方として正しいのは？",
    choices: [
      "サブクエリは禁止",
      "WHERE のみ",
      "サブクエリは LIMIT 1 必須",
      "WHERE col IN (SELECT col FROM ...)、FROM (SELECT ...) サブテーブル、SELECT カラム (SELECT ...)",
    ],
    answerIndex: 3,
    hints: [
      "サブクエリは SELECT / FROM / WHERE / HAVING など多くの場所で使える。",
      "IN / EXISTS / スカラサブクエリ の 3 形式。",
      "相関サブクエリ (外側のクエリ参照) も可能。",
    ],
    explanation: {
      summary:
        "サブクエリは SELECT 内 (スカラ) / FROM (派生テーブル) / WHERE (IN / EXISTS) のどこでも使える。相関サブクエリも可。",
      reason:
        "EXISTS は『存在チェック』で IN より速い場合あり。複雑なら CTE (WITH 句) で可読性向上。",
      codeExample:
        "-- WHERE IN\nSELECT * FROM users\nWHERE id IN (SELECT user_id FROM orders WHERE total > 1000);\n\n-- WHERE EXISTS (相関)\nSELECT * FROM users u\nWHERE EXISTS (SELECT 1 FROM orders WHERE user_id = u.id AND total > 1000);\n\n-- FROM (派生テーブル)\nSELECT t.* FROM (\n  SELECT user_id, SUM(total) AS spent FROM orders GROUP BY user_id\n) t WHERE t.spent > 10000;",
    },
  },
  {
    id: "sql-015",
    categoryId: "sql-joins",
    difficulty: "intermediate",
    type: "choice",
    question: "セルフジョイン (自分自身との JOIN) の用途は？",
    choices: [
      "階層構造 (上司-部下、カテゴリ-親カテゴリ) や同じテーブル内の関連を表現",
      "テーブルを 2 倍に増やす",
      "INDEX を再構築",
      "セルフジョインは禁止",
    ],
    answerIndex: 0,
    hints: [
      "1 つのテーブルに親子関係 (employee.manager_id → employee.id) がある場合。",
      "別エイリアスで 2 回参照する。",
      "ツリー構造 / グラフ構造の 1 段表現。",
    ],
    explanation: {
      summary:
        "セルフジョインは同じテーブルを別エイリアスで複数回参照。親子関係や自己参照を扱う。階層が深い場合は再帰 CTE。",
      reason:
        "employees(id, name, manager_id) で各社員の上司名を取りたい時、`employees e JOIN employees m ON e.manager_id = m.id` のように同じテーブルを別名でジョイン。",
      codeExample:
        "SELECT e.name AS employee, m.name AS manager\nFROM employees e\nLEFT JOIN employees m ON e.manager_id = m.id;\n\n-- 再帰 CTE (PostgreSQL)\nWITH RECURSIVE cat_tree AS (\n  SELECT id, name, parent_id, 0 AS depth\n  FROM categories WHERE parent_id IS NULL\n  UNION ALL\n  SELECT c.id, c.name, c.parent_id, t.depth + 1\n  FROM categories c JOIN cat_tree t ON c.parent_id = t.id\n)\nSELECT * FROM cat_tree;",
    },
  },
  {
    id: "sql-016",
    categoryId: "sql-joins",
    difficulty: "intermediate",
    type: "choice",
    question: "次の SQL の結果は？",
    code: "-- users: (1,A), (2,B), (3,C)\n-- posts: (1,1,T1), (2,1,T2), (3,2,T3)\nSELECT u.name, p.title\nFROM users u\nLEFT JOIN posts p ON u.id = p.user_id;",
    choices: [
      "0 行",
      "A T1 / A T2 / B T3 / C NULL (4 行)",
      "A T1 / B T3 (2 行)",
      "C のみ (1 行)",
    ],
    answerIndex: 1,
    hints: [
      "LEFT JOIN なので users 全行が残る。",
      "A は 2 投稿、B は 1 投稿、C は 0 投稿。",
      "C は posts 側が NULL になる。",
    ],
    explanation: {
      summary:
        "LEFT JOIN: 左 (users) 全行を残し、右 (posts) は一致した行をそれぞれ展開、無ければ NULL。A→2 行、B→1 行、C→1 行 NULL。",
      reason:
        "1 対多の LEFT JOIN は親が複数の子と組み合わせて『複製』される。COUNT すると各親で複数行になる点に注意。GROUP BY で集計する典型パターン。",
      codeExample:
        "-- 上記 JOIN の結果\n-- name | title\n-- A    | T1\n-- A    | T2\n-- B    | T3\n-- C    | NULL\n\n-- 集計してユーザーごとの投稿数に\nSELECT u.name, COUNT(p.id) AS cnt\nFROM users u LEFT JOIN posts p ON u.id = p.user_id\nGROUP BY u.id, u.name;",
    },
  },
  {
    id: "sql-017",
    categoryId: "sql-joins",
    difficulty: "advanced",
    type: "choice",
    question: "N+1 問題を 1 つの SQL で解決するには？",
    choices: [
      "UPDATE で一括",
      "解決できない",
      "JOIN で関連テーブルをまとめて取得、または IN サブクエリで関連を一括取得",
      "ループで毎回 SELECT",
    ],
    answerIndex: 2,
    hints: [
      "JOIN で 1 クエリにまとめる、または IN で関連を一括取得 (2 クエリ)。",
      "ActiveRecord の includes / preload / eager_load と同じ思想。",
      "N 個別の SELECT を回避する。",
    ],
    explanation: {
      summary:
        "JOIN で 1 クエリ化、または『親一括取得 + 子を user_id IN (...) で一括取得』の 2 クエリ化で N+1 解消。",
      reason:
        "N+1 は『親 1 + 子 N』の合計 N+1 クエリが発行されてしまう古典的問題。SQL レベルでは JOIN + 適切な INDEX で解決。",
      codeExample:
        "-- 解決 1: JOIN\nSELECT u.*, p.*\nFROM users u\nLEFT JOIN posts p ON u.id = p.user_id;\n\n-- 解決 2: IN (preload 戦略)\n-- 1) SELECT * FROM users;\n-- 2) SELECT * FROM posts WHERE user_id IN (1, 2, 3, ...);",
    },
  },
  {
    id: "sql-018",
    categoryId: "sql-joins",
    difficulty: "advanced",
    type: "choice",
    question: "次のクエリの問題は？",
    code: "SELECT u.name, COUNT(p.id), AVG(o.total)\nFROM users u\nJOIN posts p ON u.id = p.user_id\nJOIN orders o ON u.id = o.user_id\nGROUP BY u.id, u.name;",
    choices: [
      "問題なし",
      "1 対多が 2 系統 JOIN されて posts × orders の直積になり、件数・平均が膨らむ",
      "JOIN は 1 つに制限される",
      "GROUP BY のカラムが足りない",
    ],
    answerIndex: 1,
    hints: [
      "1 user に対し posts も orders もそれぞれ複数あると、行が膨れ上がる (デカルト積)。",
      "COUNT(p.id) と AVG(o.total) が両方とも肥大化する。",
      "正しくは別々に集計して結合する。",
    ],
    explanation: {
      summary:
        "1 対多を 2 系統同時 JOIN するとデカルト積で行が膨れ上がり集計値が誤る。サブクエリで個別に集計してから結合するのが正解。",
      reason:
        "user 1 + posts 3 + orders 2 を JOIN すると 6 行になり、COUNT(p.id) = 6 (本来 3)、AVG(o.total) も歪む。経験者でもハマる罠。",
      codeExample:
        "-- ❌ デカルト積で値が歪む\n-- 上記参照\n\n-- ✅ 個別集計 + 結合\nSELECT u.name, post_stats.cnt, order_stats.avg_total\nFROM users u\nLEFT JOIN (\n  SELECT user_id, COUNT(*) AS cnt FROM posts GROUP BY user_id\n) post_stats ON post_stats.user_id = u.id\nLEFT JOIN (\n  SELECT user_id, AVG(total) AS avg_total FROM orders GROUP BY user_id\n) order_stats ON order_stats.user_id = u.id;",
    },
  },

  // ===========================================================================
  // 📈 SQL 上級 (sql-019 〜 sql-025, 7問)
  // ===========================================================================
  {
    id: "sql-019",
    categoryId: "sql-advanced",
    difficulty: "intermediate",
    type: "choice",
    question: "次の SQL の意味は？",
    code: "SELECT name, salary,\n  ROW_NUMBER() OVER (PARTITION BY department ORDER BY salary DESC) AS rank\nFROM employees;",
    choices: [
      "部門 (department) ごとに salary 降順の順位を付ける",
      "全社員に通し番号を振る",
      "salary 列を更新する",
      "department 列を削除する",
    ],
    answerIndex: 0,
    hints: [
      "ROW_NUMBER() OVER (...) はウィンドウ関数。",
      "PARTITION BY でグループ分け、ORDER BY でグループ内の順序。",
      "各部門ごとに 1, 2, 3, ... と順位が振られる。",
    ],
    explanation: {
      summary:
        "ウィンドウ関数 (`関数() OVER (PARTITION BY ... ORDER BY ...)`) はグループ内で順位 / 集計を 1 行ずつ計算。GROUP BY と違い、元の行数は保たれる。",
      reason:
        "ROW_NUMBER (連番)、RANK (同点で同順位、その後スキップ)、DENSE_RANK、LAG / LEAD (前後の行)、SUM/AVG OVER (移動集計) など。レポート / ランキング / 移動平均で必須。",
      codeExample:
        "-- ROW_NUMBER: 部門毎の給与ランキング\nSELECT name, department, salary,\n  ROW_NUMBER() OVER (PARTITION BY department ORDER BY salary DESC) AS rank\nFROM employees;\n\n-- LAG: 前の行の値\nSELECT date, value,\n  value - LAG(value) OVER (ORDER BY date) AS diff\nFROM daily_stats;\n\n-- 移動平均\nSELECT date, value,\n  AVG(value) OVER (ORDER BY date ROWS BETWEEN 6 PRECEDING AND CURRENT ROW) AS ma7\nFROM daily_stats;",
    },
  },
  {
    id: "sql-020",
    categoryId: "sql-advanced",
    difficulty: "intermediate",
    type: "text",
    question:
      "SQL で複雑なクエリを再利用可能な名前付き集合として書く構文の略称は？(英語3文字)",
    answers: ["CTE", "cte"],
    hints: [
      "WITH 句で定義される。",
      "Common Table Expression の略。",
      "サブクエリより可読性が高い。",
    ],
    explanation: {
      summary:
        "CTE (Common Table Expression) は `WITH 名前 AS (SELECT ...)` で定義する一時テーブル。可読性向上、再帰クエリにも使う。",
      reason:
        "深いネストのサブクエリを CTE に分解すると可読性 + 保守性が大幅向上。`WITH RECURSIVE` で階層構造のトラバース。",
      codeExample:
        "-- 単純 CTE\nWITH active_users AS (\n  SELECT * FROM users WHERE active = true\n),\nactive_posts AS (\n  SELECT * FROM posts WHERE published = true\n)\nSELECT au.name, COUNT(ap.id)\nFROM active_users au\nLEFT JOIN active_posts ap ON au.id = ap.user_id\nGROUP BY au.id;\n\n-- 再帰 CTE\nWITH RECURSIVE org AS (\n  SELECT id, name, manager_id, 1 AS lvl\n  FROM employees WHERE manager_id IS NULL\n  UNION ALL\n  SELECT e.id, e.name, e.manager_id, org.lvl + 1\n  FROM employees e JOIN org ON e.manager_id = org.id\n)\nSELECT * FROM org;",
    },
  },
  {
    id: "sql-021",
    categoryId: "sql-advanced",
    difficulty: "intermediate",
    type: "choice",
    question: "SQL でトランザクションを使う 3 つのキーワードは？",
    choices: [
      "START / END / RESET",
      "BEGIN (or START TRANSACTION) / COMMIT / ROLLBACK",
      "OPEN / CLOSE / CANCEL",
      "TRY / CATCH / FINALLY",
    ],
    answerIndex: 1,
    hints: [
      "BEGIN でトランザクション開始。",
      "COMMIT で確定、ROLLBACK で巻き戻し。",
      "ACID の A (Atomicity) を実現する仕組み。",
    ],
    explanation: {
      summary:
        "`BEGIN` → `COMMIT` (確定) または `ROLLBACK` (取消)。ACID 特性を保証。",
      reason:
        "複数の SQL を『1 つの単位』として扱い、全部成功か全部失敗かを保証。SAVEPOINT で部分ロールバックも可能。",
      codeExample:
        "BEGIN;\n  UPDATE accounts SET balance = balance - 100 WHERE id = 1;\n  UPDATE accounts SET balance = balance + 100 WHERE id = 2;\nCOMMIT;\n\n-- SAVEPOINT\nBEGIN;\n  INSERT INTO users(name) VALUES ('Alice');\n  SAVEPOINT sp1;\n  INSERT INTO users(name) VALUES ('NULL');\n  ROLLBACK TO sp1;\n  INSERT INTO users(name) VALUES ('Bob');\nCOMMIT;",
    },
  },
  {
    id: "sql-022",
    categoryId: "sql-advanced",
    difficulty: "intermediate",
    type: "choice",
    question: "SQL でクエリの実行計画を確認するキーワードは？",
    choices: [
      "TRACE",
      "ANALYZE_QUERY",
      "EXPLAIN (PostgreSQL/MySQL/SQLite 等で共通)",
      "PLAN",
    ],
    answerIndex: 2,
    hints: [
      "クエリの前に EXPLAIN を付ける。",
      "実行計画 (Seq Scan / Index Scan / Nested Loop など) が表示される。",
      "ANALYZE を付けると実測時間も。",
    ],
    explanation: {
      summary:
        "`EXPLAIN SQL` で実行計画表示。PostgreSQL なら `EXPLAIN ANALYZE` で実測時間込み。",
      reason:
        "Seq Scan (全件スキャン) が出てたら INDEX 不足、Nested Loop が深いなら JOIN 戦略を疑う。`EXPLAIN ANALYZE` は実際にクエリを実行するので、UPDATE / DELETE には注意。",
      codeExample:
        "EXPLAIN SELECT * FROM users WHERE email = 'a@x';\nEXPLAIN ANALYZE SELECT * FROM users WHERE email = 'a@x';\nEXPLAIN (ANALYZE, BUFFERS, VERBOSE) ...;\n\n-- 重要指標:\n-- Seq Scan: 全件スキャン (INDEX 検討)\n-- Index Scan: INDEX 使用 (◎)\n-- Nested Loop / Hash Join / Merge Join: JOIN 戦略\n-- rows=: 推定 / 実測行数",
    },
  },
  {
    id: "sql-023",
    categoryId: "sql-advanced",
    difficulty: "advanced",
    type: "choice",
    question: "次の WHERE 句のうち、INDEX が効きやすいのは？",
    choices: [
      "WHERE LOWER(email) = 'a@x'",
      "WHERE email LIKE '%@x'",
      "WHERE SUBSTR(email, 1, 3) = 'a@x'",
      "WHERE email = 'a@x'",
    ],
    answerIndex: 3,
    hints: [
      "INDEX は『カラム値そのまま』の比較で効く。",
      "関数で加工 (LOWER / SUBSTR) すると効かない。",
      "前方一致 LIKE 'A%' は効くが、後方 / 中央一致 '%X' は効かない。",
    ],
    explanation: {
      summary:
        "INDEX は『カラム = 定数』のような直接比較で効く。関数適用、後方一致 LIKE は効かない (関数 INDEX / GIN INDEX で対策可)。",
      reason:
        "WHERE 句でカラムに関数を適用すると INDEX が使われなくなる。LIKE は前方一致 ('A%') なら効くが、後方 ('%X') / 中間 は効かず Seq Scan。trigram INDEX (pg_trgm) で対応。",
      codeExample:
        "-- 効く\nWHERE email = 'a@x';\nWHERE email LIKE 'a%';\nWHERE created_at >= '2024-01-01';\n\n-- 効かない\nWHERE LOWER(email) = 'a@x';\nWHERE email LIKE '%@x';\n\n-- 対策: 関数 INDEX\nCREATE INDEX idx_users_email_lower ON users(LOWER(email));\n\n-- 対策: trigram INDEX (PostgreSQL)\nCREATE EXTENSION pg_trgm;\nCREATE INDEX idx_users_email_trgm ON users USING gin(email gin_trgm_ops);",
    },
  },
  {
    id: "sql-024",
    categoryId: "sql-advanced",
    difficulty: "advanced",
    type: "choice",
    question: "次の INDEX 設計のうち、最も効果的なのは？",
    code: "-- クエリ: WHERE user_id = 1 AND status = 'paid' ORDER BY created_at DESC",
    choices: [
      "CREATE INDEX ON orders(user_id)",
      "INDEX は不要",
      "CREATE INDEX ON orders(user_id, status, created_at DESC)",
      "CREATE INDEX ON orders(created_at)",
    ],
    answerIndex: 2,
    hints: [
      "WHERE + ORDER BY をカバーする複合 INDEX。",
      "カラム順は WHERE の等価条件 → 範囲条件 → ORDER BY の順が定石。",
      "user_id, status, created_at DESC でカバー。",
    ],
    explanation: {
      summary:
        "WHERE + ORDER BY を 1 つの複合 INDEX でカバー。カラム順は『等価フィルタ → 範囲フィルタ → ソート』の順が定石。",
      reason:
        "個別 INDEX より、複合 (user_id, status, created_at) が圧倒的に効率的。3 カラム全てを 1 つの INDEX で処理 → 純粋な Index Scan で完結。",
      codeExample:
        "-- 推奨: 複合 INDEX\nCREATE INDEX idx_orders_user_status_created\n  ON orders(user_id, status, created_at DESC);\n\n-- このクエリは Index Scan で完結\nSELECT *\nFROM orders\nWHERE user_id = 1 AND status = 'paid'\nORDER BY created_at DESC;\n\n-- 追加考慮:\n-- ・カラム順は『カーディナリティが高い順』も一つの指標\n-- ・INDEX は更新コスト (INSERT/UPDATE/DELETE) もあるので張りすぎ注意\n-- ・Covering Index (必要なカラムを全て INDEX に含めて Index Only Scan)",
    },
  },
  {
    id: "sql-025",
    categoryId: "sql-advanced",
    difficulty: "advanced",
    type: "choice",
    question: "次のクエリの問題と対策は？",
    code: "-- 1 億件の orders テーブルから過去 30 日の合計を集計\nSELECT user_id, SUM(total)\nFROM orders\nWHERE created_at >= NOW() - INTERVAL '30 days'\nGROUP BY user_id;",
    choices: [
      "created_at の INDEX 必須 + マテリアライズドビュー / 集計テーブルで事前計算",
      "全カラム取得を SELECT *",
      "クエリは速いので問題なし",
      "DBMS を変える",
    ],
    answerIndex: 0,
    hints: [
      "1 億件の Seq Scan は厳禁。",
      "created_at に INDEX。",
      "ダッシュボード用途なら事前集計テーブル / マテリアライズドビュー。",
    ],
    explanation: {
      summary:
        "大規模テーブルの集計は (1) WHERE カラムに INDEX、(2) 頻繁な集計はマテリアライズドビュー / 集計テーブルで事前計算。",
      reason:
        "1 億件のフルスキャンは数十秒〜分。created_at INDEX で『過去 30 日分』だけスキャンに絞る。それでも遅ければ、Materialized View や日次バッチで集計テーブルを作る。Partition (created_at で月別など) でさらに高速化。",
      codeExample:
        "-- 1. INDEX (最低限)\nCREATE INDEX idx_orders_created_at ON orders(created_at);\n\n-- 2. マテリアライズドビュー (PostgreSQL)\nCREATE MATERIALIZED VIEW user_monthly_total AS\nSELECT user_id, DATE_TRUNC('day', created_at) AS day, SUM(total) AS total\nFROM orders\nGROUP BY user_id, DATE_TRUNC('day', created_at);\nREFRESH MATERIALIZED VIEW user_monthly_total;\n\n-- 3. Partitioning\nCREATE TABLE orders (...) PARTITION BY RANGE (created_at);",
    },
  },

  // ===========================================================================
  // 🟨 JavaScript 追加 (js-011 〜 js-025, jsf-006 〜 jsf-010, jsa-006 〜 jsa-010, 15問)
  // ===========================================================================
  {
    id: "js-011",
    categoryId: "js-basics",
    difficulty: "intermediate",
    type: "choice",
    question: "次のコードの出力は？",
    code: "const a = { x: 1 }\nconst b = a\nb.x = 99\nconsole.log(a.x)",
    choices: ["undefined", "TypeError", "99", "1"],
    answerIndex: 2,
    hints: [
      "オブジェクトの代入は参照のコピー。",
      "a と b は同じオブジェクトを指す。",
      "b への変更は a にも見える。",
    ],
    explanation: {
      summary:
        "オブジェクト / 配列の代入は『参照のコピー』。同じオブジェクトを指すので変更が共有される。",
      reason:
        "プリミティブ (number/string/boolean) は値コピーだが、オブジェクトは参照。React の state を直接 mutate しないルール (`setState({...state, x: v})`) の理由でもある。複製は `{...obj}` (浅い)、`structuredClone(obj)` (深い)。",
      codeExample:
        "const a = { x: 1 }\nconst b = a\nb.x = 99\na.x   // 99 (両方変わる)\n\n// 浅いコピー\nconst c = { ...a }\nc.x = 100\na.x   // 99 (c は独立)\n\n// 深いコピー (現代)\nconst d = structuredClone(a)\n// 古典: JSON.parse(JSON.stringify(a))",
    },
  },
  {
    id: "js-012",
    categoryId: "js-basics",
    difficulty: "intermediate",
    type: "choice",
    question: "次のコードの出力は？",
    code: "console.log([1, 2, 3] + [4, 5, 6])",
    choices: [
      "TypeError",
      "1,2,34,5,6",
      "[1, 2, 3, 4, 5, 6]",
      "[1+4, 2+5, 3+6]",
    ],
    answerIndex: 1,
    hints: [
      "+ は両辺を文字列化して連結 (toString)。",
      "[1,2,3].toString() は '1,2,3'。",
      "結果は '1,2,3' + '4,5,6' = '1,2,34,5,6'。",
    ],
    explanation: {
      summary:
        "JS の `+` 演算子はオブジェクトを toString() で文字列化してから連結。配列を結合したいなら `concat` / `spread`。",
      reason:
        "JS の暗黙型変換の悪名高い例。`{} + []` も TypeScript の世界ではエラーになるが純 JS では `'[object Object]'`。配列結合は `arr1.concat(arr2)` / `[...arr1, ...arr2]`。",
      codeExample:
        "[1, 2, 3] + [4, 5, 6]      // '1,2,34,5,6' (!?)\n[1, 2, 3].concat([4, 5, 6])  // [1,2,3,4,5,6]\n[...[1, 2, 3], ...[4, 5, 6]] // [1,2,3,4,5,6]\n\n// 数値配列の和\n[1, 2, 3].reduce((a, b) => a + b, 0)  // 6",
    },
  },
  {
    id: "js-013",
    categoryId: "js-basics",
    difficulty: "intermediate",
    type: "choice",
    question:
      "次のコードで for...in と for...of の正しい使い分けは？",
    code: "const arr = ['a', 'b', 'c']\nfor (const ? in arr) { ... }\nfor (const ? of arr) { ... }",
    choices: [
      "in はキー (index)、of は値",
      "in は値、of はキー",
      "両者は同じ",
      "どちらも使えない",
    ],
    answerIndex: 0,
    hints: [
      "for...in: オブジェクトの key (配列なら index 文字列)。",
      "for...of: iterable の値。",
      "配列なら for...of の方が直感的。",
    ],
    explanation: {
      summary:
        "`for...in` はキー (object key / array index)、`for...of` は iterable の値を反復。配列なら for...of 推奨。",
      reason:
        "for...in は prototype のキーまで列挙する罠があり、配列にはほぼ使わない。`Object.keys/values/entries(obj)` の方が安全。for...of は Array / Map / Set / 文字列 / generator など iterable 全般。",
      codeExample:
        "const arr = ['a', 'b', 'c']\n\n// for...of (値)\nfor (const x of arr) console.log(x)   // 'a', 'b', 'c'\n\n// for...in (index、文字列に注意)\nfor (const i in arr) console.log(i)   // '0', '1', '2'\n\n// オブジェクト\nconst obj = { a: 1, b: 2 }\nfor (const k of Object.keys(obj)) ...\nfor (const [k, v] of Object.entries(obj)) ...\n\n// 配列のインデックス付き\nfor (const [i, x] of arr.entries()) ...",
    },
  },
  {
    id: "js-014",
    categoryId: "js-basics",
    difficulty: "intermediate",
    type: "choice",
    question:
      "Set と Map と Object の主な使い分けは？",
    choices: [
      "Object が常に速い",
      "Set: ユニーク値の集合、Map: 任意型キー、Object: 文字列キー + 設定値",
      "全て同じ",
      "Set は廃止",
    ],
    answerIndex: 1,
    hints: [
      "Set: 重複なしコレクション。",
      "Map: キーが文字列以外 (オブジェクトとか) もOK + 順序保証 + size プロパティ。",
      "Object: シンプルな辞書 / 設定値 (キーが文字列前提)。",
    ],
    explanation: {
      summary:
        "Set: ユニーク集合 (add/has/delete)。Map: 任意キーの辞書 (set/get、順序保証、size あり)。Object: シンプル辞書 (文字列キー + プロトタイプチェーン)。",
      reason:
        "Map は『for...of で順序保証』『size プロパティ』『キーがオブジェクト OK』が Object に対する利点。Object はリテラルが書きやすい + JSON 化が楽。重複除去は `new Set(arr)`、頻度カウントは Map で。",
      codeExample:
        "// Set\nconst s = new Set([1, 2, 2, 3])\nconsole.log([...s])    // [1, 2, 3]\ns.has(2)               // true\ns.add(4); s.delete(1)\n\n// Map\nconst m = new Map()\nm.set('a', 1)\nm.set({ x: 1 }, 'value')   // オブジェクトキーOK\nm.get('a')             // 1\nm.size                 // 2\nfor (const [k, v] of m) ...\n\n// 重複除去\nconst unique = [...new Set([1, 2, 2, 3])]",
    },
  },
  {
    id: "js-015",
    categoryId: "js-basics",
    difficulty: "advanced",
    type: "choice",
    question:
      "JavaScript の Symbol の用途として正しいのは？",
    choices: [
      "ユニークな識別子・プロパティキー・組み込みプロトコル (iterator など)",
      "文字列のラッパー",
      "数値の高速版",
      "Symbol は廃止された",
    ],
    answerIndex: 0,
    hints: [
      "Symbol() で常にユニークな値が作られる。",
      "オブジェクトのプロパティキーとして使える (衝突なし)。",
      "Symbol.iterator / Symbol.asyncIterator はプロトコル。",
    ],
    explanation: {
      summary:
        "Symbol はユニークな識別子。プロパティキー、組み込みプロトコル (iterator / asyncIterator) で使う。",
      reason:
        "Symbol を使うと『他コードと衝突しないプロパティ』を作れる (private 的)。`obj[Symbol.iterator]` で iterable 化、`Symbol.for('key')` でレジストリ共有。Ruby の Symbol とは別物 (JS のは『ユニーク識別子』、Ruby のは『軽量文字列』)。",
      codeExample:
        "const sym = Symbol('description')\nconst sym2 = Symbol('description')\nsym === sym2                    // false (常にユニーク)\n\n// プロパティキー\nconst PRIVATE = Symbol('private')\nobj[PRIVATE] = 'secret'\n\n// iterable 化\nclass Range {\n  constructor(s, e) { this.s = s; this.e = e }\n  *[Symbol.iterator]() {\n    for (let i = this.s; i <= this.e; i++) yield i\n  }\n}\n[...new Range(1, 3)]   // [1, 2, 3]",
    },
  },
  {
    id: "jsf-006",
    categoryId: "js-functions",
    difficulty: "intermediate",
    type: "choice",
    question:
      "次のうち、純粋関数 (Pure Function) の定義として正しいのは？",
    choices: [
      "関数の前に 'pure' キーワードを書く",
      "純粋関数は遅い",
      "Object を引数に取らない",
      "同じ入力には常に同じ出力 + 副作用なし (外部状態を変更しない)",
    ],
    answerIndex: 3,
    hints: [
      "関数型プログラミングの基本概念。",
      "テスト容易性・予測可能性が大きく向上。",
      "React の Component / useMemo の依存配列等でも重要。",
    ],
    explanation: {
      summary:
        "Pure Function は (1) 同じ入力で同じ出力、(2) 副作用なし。テストしやすく、メモ化やキャッシュも安全。",
      reason:
        "Date.now() / Math.random() / DOM 操作 / 外部 API / mutation を含む関数は impure。Pure に保つと並列化・キャッシュ・テストが容易。React の `useMemo(() => fn(deps))` は fn が pure であることを前提とする。",
      codeExample:
        "// pure (○)\nfunction add(a, b) { return a + b }\nfunction double(arr) { return arr.map(n => n * 2) }\n\n// impure (☓)\nlet count = 0\nfunction increment() { count++ }      // 副作用\nfunction now() { return Date.now() }  // 入力が同じでも出力が違う\nfunction sort(arr) { return arr.sort() }  // 引数を mutate\n\n// pure 版\nfunction sortPure(arr) { return [...arr].sort() }",
    },
  },
  {
    id: "jsf-007",
    categoryId: "js-functions",
    difficulty: "intermediate",
    type: "choice",
    question:
      "高階関数 (Higher-Order Function) の定義は？",
    choices: [
      "関数を引数に取る、または関数を返す関数",
      "関数の本体が長い",
      "ジェネリクスを使う関数",
      "async 関数",
    ],
    answerIndex: 0,
    hints: [
      "関数を値として扱える言語の機能。",
      "map / filter / reduce は典型的な高階関数。",
      "デコレータパターンの基礎。",
    ],
    explanation: {
      summary:
        "高階関数: 関数を引数に取る、または関数を返す関数。`map(fn)` / `setTimeout(fn, ms)` / `(x) => (y) => x + y` (カリー化) など。",
      reason:
        "関数型プログラミングの中核。コールバック、デコレータ、カリー化、関数合成すべて高階関数で構築。`Array.prototype.map/filter/reduce/forEach/find` がすべて高階関数。",
      codeExample:
        "// 関数を引数に\n[1, 2, 3].map(n => n * 2)\nsetTimeout(() => console.log('tick'), 1000)\n\n// 関数を返す (カリー化)\nconst add = a => b => a + b\nconst add10 = add(10)\nadd10(5)   // 15\n\n// デコレータ的\nconst withLog = fn => (...args) => {\n  console.log('calling', fn.name, args)\n  return fn(...args)\n}\nconst loggedAdd = withLog(add(10))",
    },
  },
  {
    id: "jsf-008",
    categoryId: "js-functions",
    difficulty: "intermediate",
    type: "choice",
    question: "次のコードの出力は？",
    code: "const arr = [1, 2, 3]\nconst doubled = arr.map(n => n * 2)\nconsole.log(arr)\nconsole.log(doubled)",
    choices: [
      "[1, 2, 3] / [2, 4, 6]",
      "[2, 4, 6] / [2, 4, 6]",
      "[1, 2, 3] / [1, 2, 3]",
      "TypeError",
    ],
    answerIndex: 0,
    hints: [
      "map は新しい配列を返す (非破壊的)。",
      "元の arr は変更されない。",
      "破壊的なら forEach + push か古典 for ループ。",
    ],
    explanation: {
      summary:
        "`Array.map` は新しい配列を返す。元の配列は変更されない (immutable)。",
      reason:
        "Array のメソッドは大半が非破壊的: map/filter/reduce/slice/concat。破壊的: push/pop/shift/unshift/splice/sort/reverse。React のような『state は immutable 推奨』の世界では map/filter/spread を多用。",
      codeExample:
        "// 非破壊 (○)\nconst doubled = arr.map(n => n * 2)\nconst odds = arr.filter(n => n % 2)\nconst copy = [...arr]\nconst sorted = [...arr].sort()    // ← spread でコピーしてから sort\n\n// 破壊的 (注意)\narr.push(4)\narr.pop()\narr.sort()        // 元を変える!\narr.splice(0, 1)",
    },
  },
  {
    id: "jsf-009",
    categoryId: "js-functions",
    difficulty: "advanced",
    type: "choice",
    question: "次のコードの出力は？",
    code: "function once(fn) {\n  let called = false\n  let result\n  return function(...args) {\n    if (!called) {\n      result = fn(...args)\n      called = true\n    }\n    return result\n  }\n}\n\nconst doOnce = once(() => Math.random())\nconsole.log(doOnce() === doOnce())",
    choices: ["undefined", "TypeError", "true", "false"],
    answerIndex: 2,
    hints: [
      "once は『1 回だけ実行 + 結果をキャッシュ』する高階関数。",
      "called フラグで 2 回目以降スキップ。",
      "doOnce() の戻り値は毎回同じ。",
    ],
    explanation: {
      summary:
        "クロージャ + フラグで『1 回だけ実行』のメモ化パターン。`lodash.once` も同じ実装。",
      reason:
        "初期化処理を 1 度だけ実行したい時、コストの高い計算をキャッシュしたい時に便利。React の useMemo / useRef を使った初期化、シングルトンパターンの実装等でも応用。",
      codeExample:
        "// once\nconst init = once(() => {\n  console.log('initializing...')\n  return loadConfig()\n})\ninit()    // 'initializing...' + config\ninit()    // config (再実行されない)\n\n// memoize (引数別にキャッシュ)\nfunction memoize(fn) {\n  const cache = new Map()\n  return (...args) => {\n    const key = JSON.stringify(args)\n    if (!cache.has(key)) cache.set(key, fn(...args))\n    return cache.get(key)\n  }\n}",
    },
  },
  {
    id: "jsf-010",
    categoryId: "js-functions",
    difficulty: "advanced",
    type: "choice",
    question: "次のコードの出力は？",
    code: "function* range(start, end) {\n  for (let i = start; i < end; i++) yield i\n}\n\nconst r = range(1, 4)\nconsole.log(r.next().value, r.next().value, r.next().value, r.next().done)",
    choices: ["TypeError", "1 2 3 true", "1 2 3 false", "1 2 3 undefined"],
    answerIndex: 1,
    hints: [
      "function* はジェネレータ関数。",
      "yield で値を返しつつ実行を停止、next() で再開。",
      "done は反復が終わったかを示す。",
    ],
    explanation: {
      summary:
        "ジェネレータ (`function*`) は `yield` で値を返しつつ実行を中断するイテレータ。`.next()` で `{ value, done }` を取得。",
      reason:
        "無限列・大量データの遅延処理・状態を持つイテレータに最適。`for...of` や `[...gen()]` で iterable として使える。Ruby の Enumerator や Python の generator に相当。Redux Saga 等のライブラリの基盤。",
      codeExample:
        "function* fibs() {\n  let [a, b] = [0, 1]\n  while (true) {\n    yield a\n    ;[a, b] = [b, a + b]\n  }\n}\n\nconst gen = fibs()\nconst first10 = []\nfor (let i = 0; i < 10; i++) first10.push(gen.next().value)\n// [0, 1, 1, 2, 3, 5, 8, 13, 21, 34]\n\n// for...of\nfor (const n of range(1, 5)) console.log(n)",
    },
  },
  {
    id: "jsa-006",
    categoryId: "js-async",
    difficulty: "intermediate",
    type: "choice",
    question:
      "fetch のエラーハンドリングで、HTTP 4xx/5xx を捕捉するには？",
    choices: [
      "res.ok / res.status をチェックして手動で throw",
      "catch だけで自動的に",
      "fetch は 4xx/5xx で throw する",
      "throw は不要",
    ],
    answerIndex: 0,
    hints: [
      "fetch は『ネットワークエラー』だけで reject する。",
      "4xx / 5xx は『正常レスポンス』扱い (resolved)。",
      "res.ok / res.status で手動チェックが必要。",
    ],
    explanation: {
      summary:
        "`fetch` は HTTP エラー (4xx/5xx) では reject しない (これは XHR 互換の歴史的経緯)。`res.ok` (status 200-299 で true) を見て手動で throw する。",
      reason:
        "axios や `ky` 等のライブラリは 4xx/5xx で自動 reject するが、生の fetch はネットワークエラーのみ。`if (!res.ok) throw new Error(...)` の処理を必ず入れる。",
      codeExample:
        "// 危険 (4xx/5xx を見逃す)\nconst res = await fetch(url)\nconst data = await res.json()   // エラーレスポンスもパースしてしまう\n\n// 安全\nconst res = await fetch(url)\nif (!res.ok) {\n  throw new Error(`HTTP ${res.status}: ${res.statusText}`)\n}\nconst data = await res.json()\n\n// try/catch\ntry {\n  const data = await fetchSafe(url)\n} catch (e) {\n  if (e instanceof TypeError) console.error('network error')\n  else console.error('http error', e)\n}",
    },
  },
  {
    id: "jsa-007",
    categoryId: "js-async",
    difficulty: "intermediate",
    type: "choice",
    question:
      "Promise を直列実行 (1 つずつ順に) するイディオムは？",
    choices: [
      "forEach + await",
      "for...of + await",
      "Promise.all",
      "items.map(await ...)",
    ],
    answerIndex: 1,
    hints: [
      "Promise.all は『並列』。",
      "直列は for...of + await が定石。",
      "forEach + await は動かない (await が無視される)。",
    ],
    explanation: {
      summary:
        "直列実行は `for (const item of items) { await fn(item) }`。並列は `Promise.all(items.map(fn))`。",
      reason:
        "`forEach` のコールバックは async でも awaited されない (forEach の戻り値が無視される)。配列に対する非同期処理は `for...of` (直列) か `Promise.all + map` (並列) の二択。並列度制御は `p-limit` 等のライブラリ。",
      codeExample:
        "// 直列 (1 つずつ)\nfor (const url of urls) {\n  const res = await fetch(url)\n  const data = await res.json()\n  console.log(data)\n}\n\n// 並列 (全部同時)\nconst results = await Promise.all(\n  urls.map(url => fetch(url).then(r => r.json()))\n)\n\n// 並列度制限\nimport pLimit from 'p-limit'\nconst limit = pLimit(5)\nconst results = await Promise.all(\n  urls.map(url => limit(() => fetch(url)))\n)\n\n// ❌ 動かない (forEach は await を無視)\nurls.forEach(async url => {\n  const data = await fetch(url)\n})",
    },
  },
  {
    id: "jsa-008",
    categoryId: "js-async",
    difficulty: "intermediate",
    type: "choice",
    question:
      "AbortController の主な用途は？",
    choices: [
      "Promise を resolve する",
      "fetch やタイマー等の非同期処理を中断 (キャンセル) する標準 API",
      "プログラム全体を停止する",
      "エラーを発生させる",
    ],
    answerIndex: 1,
    hints: [
      "AbortController + signal で非同期処理に『中断指示』を渡せる。",
      "React のクリーンアップで未完了 fetch をキャンセルする等。",
      "fetch / setTimeout / カスタム実装で広く対応。",
    ],
    explanation: {
      summary:
        "`AbortController` は非同期処理のキャンセル機構。`controller.signal` を fetch 等に渡し、`controller.abort()` で中断。",
      reason:
        "React の useEffect cleanup でアンマウント時に fetch をキャンセル、ユーザーが入力欄を素早く変更した時に古いリクエストを破棄、等で必須。`AbortSignal.timeout(ms)` (タイムアウト)、`AbortSignal.any([s1, s2])` (合成) も使える (modern)。",
      codeExample:
        "const controller = new AbortController()\nfetch(url, { signal: controller.signal })\n  .then(...)\n  .catch(e => {\n    if (e.name === 'AbortError') console.log('cancelled')\n    else throw e\n  })\n\n// 任意のタイミングでキャンセル\ncontroller.abort()\n\n// React useEffect でクリーンアップ\nuseEffect(() => {\n  const c = new AbortController()\n  fetch(url, { signal: c.signal }).then(setData)\n  return () => c.abort()\n}, [url])\n\n// タイムアウト\nfetch(url, { signal: AbortSignal.timeout(5000) })",
    },
  },
  {
    id: "jsa-009",
    categoryId: "js-async",
    difficulty: "advanced",
    type: "choice",
    question: "次のコードの出力順は？",
    code: "async function test() {\n  console.log('1')\n  await Promise.resolve()\n  console.log('2')\n}\ntest()\nconsole.log('3')",
    choices: ["3 → 1 → 2", "2 → 1 → 3", "1 → 3 → 2", "1 → 2 → 3"],
    answerIndex: 2,
    hints: [
      "async 関数は同期で実行開始。",
      "最初の await で『マイクロタスクキュー』に登録 + 関数の制御を返す。",
      "log('3') が先に実行され、その後マイクロタスクで log('2')。",
    ],
    explanation: {
      summary:
        "async 関数は同期実行開始 → 最初の await で中断して制御を返す → 同期コード継続 → マイクロタスクで再開。",
      reason:
        "`test()` 内の '1' は同期実行。`await Promise.resolve()` は『await された後の続き』をマイクロタスクキューに入れて、関数を一旦抜ける。同期コード `log('3')` が実行されてから、マイクロタスクで '2'。Event Loop の理解が必須。",
      codeExample:
        "async function f() {\n  console.log('A')\n  await Promise.resolve()\n  console.log('B')\n}\n\nconsole.log('1')\nf()\nconsole.log('2')\n// 1 → A → 2 → B\n\n// 詳しく\n// 同期: 1, A, 2 が出力\n// マイクロタスク: B (await Promise.resolve の継続)\n// マクロタスク (setTimeout 等) はその後",
    },
  },
  {
    id: "jsa-010",
    categoryId: "js-async",
    difficulty: "advanced",
    type: "choice",
    question:
      "非同期処理にタイムアウトを設ける現代的な書き方は？",
    choices: [
      "setTimeout で一括キャンセル",
      "JS にはタイムアウト機能なし",
      "AbortSignal.timeout(ms) を fetch に渡す / Promise.race で timeout Promise と競争",
      "while ループで時間チェック",
    ],
    answerIndex: 2,
    hints: [
      "AbortSignal.timeout (modern) または Promise.race パターン。",
      "fetch には signal オプション。",
      "古典は setTimeout + reject の Promise を race。",
    ],
    explanation: {
      summary:
        "現代: `AbortSignal.timeout(ms)` を fetch の signal に渡す。古典: `Promise.race([fetch(...), new Promise((_, rej) => setTimeout(() => rej(new Error('timeout')), ms))])`。",
      reason:
        "ネットワーク遅延でハングするのを防ぐ必須テクニック。本番では必ずタイムアウト設定。`AbortSignal.timeout()` は 2023+ で広くサポート、それ以前は手作り race パターン。",
      codeExample:
        "// 現代 (推奨)\nawait fetch(url, { signal: AbortSignal.timeout(5000) })\n\n// 古典 (Promise.race)\nfunction timeout(ms) {\n  return new Promise((_, rej) =>\n    setTimeout(() => rej(new Error('timeout')), ms)\n  )\n}\nconst result = await Promise.race([\n  fetch(url),\n  timeout(5000)\n])\n\n// AbortController で柔軟キャンセル\nconst c = new AbortController()\nsetTimeout(() => c.abort('user cancelled'), 5000)\nfetch(url, { signal: c.signal })",
    },
  },

  // ===========================================================================
  // 🔷 TypeScript 追加 (ts-006 〜 ts-020, 15問)
  // ===========================================================================
  {
    id: "ts-006",
    categoryId: "ts-basics",
    difficulty: "intermediate",
    type: "choice",
    question: "次のコードの型エラー箇所は？",
    code: "type Color = 'red' | 'green' | 'blue'\nlet c: Color = 'red'    // (1)\nc = 'yellow'             // (2)\nc = 'green'              // (3)\nlet d: Color = 'red'.toUpperCase()  // (4)",
    choices: [
      "(3) のみ",
      "全部 OK",
      "(2) と (4)",
      "(1) のみ",
    ],
    answerIndex: 2,
    hints: [
      "Color は 3 つのリテラルのみ許容。",
      "'yellow' は Color に含まれない。",
      "(4) の toUpperCase() は string を返すので Color 型と互換性なし。",
    ],
    explanation: {
      summary:
        "Literal Union (`'red' | 'green' | 'blue'`) はリテラル値のみ。`string` 型 (toUpperCase() の戻り) は assignable でない。",
      reason:
        "Literal Type は型を『特定の値』に絞り込む。`as Color` で型アサーション可能だが安全性が落ちる。`as const` でリテラル化が定番。狭い型を作って unsafe な代入を防ぐのが TS の真価。",
      codeExample:
        "type Color = 'red' | 'green' | 'blue'\n\nlet c: Color = 'red'        // OK\nc = 'green'                  // OK\nc = 'yellow'                 // Error\n\n// string → Literal はアサーションが必要\nconst s = 'red'.toUpperCase()       // type: string\nlet d: Color = s as Color           // 危険\n\n// as const でリテラル化\nconst colors = ['red', 'green', 'blue'] as const\ntype C = typeof colors[number]      // 'red' | 'green' | 'blue'",
    },
  },
  {
    id: "ts-007",
    categoryId: "ts-basics",
    difficulty: "intermediate",
    type: "choice",
    question:
      "TypeScript の Narrowing (型の絞り込み) で使える典型的な方法は？",
    choices: [
      "typeof / instanceof / in / リテラル比較 / ユーザー定義型ガード",
      "as キーワードのみ",
      "@ts-ignore",
      "any 型に変換",
    ],
    answerIndex: 0,
    hints: [
      "union 型を分岐で絞り込む。",
      "typeof は primitive、instanceof は class、in はプロパティ存在。",
      "リテラル discriminant も基本パターン。",
    ],
    explanation: {
      summary:
        "Narrowing 手法: `typeof x === 'string'` / `x instanceof Date` / `'key' in obj` / リテラル比較 / `x is T` (ユーザー定義型ガード)。",
      reason:
        "TS は実行時の型情報を持たないので、コード上の判定文 (typeof 等) で型を絞り込む。Discriminated Union (`{ kind: 'a', ... } | { kind: 'b', ... }`) は型安全な状態機械パターン。",
      codeExample:
        "function area(s: { kind: 'circle', r: number } | { kind: 'rect', w: number, h: number }) {\n  switch (s.kind) {\n    case 'circle': return Math.PI * s.r ** 2\n    case 'rect':   return s.w * s.h\n  }\n}\n\n// typeof / instanceof / in\nfunction process(x: string | Date) {\n  if (typeof x === 'string') return x.length\n  if (x instanceof Date)     return x.getTime()\n}\n\nfunction has(obj: { a: number } | { b: number }) {\n  if ('a' in obj) return obj.a\n  return obj.b\n}\n\n// ユーザー定義型ガード\nfunction isUser(x: unknown): x is User {\n  return typeof x === 'object' && x !== null && 'id' in x\n}",
    },
  },
  {
    id: "ts-008",
    categoryId: "ts-basics",
    difficulty: "intermediate",
    type: "choice",
    question:
      "TypeScript の `unknown` と `any` の違いは？",
    choices: [
      "any は廃止された",
      "両者は同じ",
      "unknown は使う前に型確認必須 (安全)、any は何でも可 (型チェック無効)",
      "unknown は遅い",
    ],
    answerIndex: 2,
    hints: [
      "unknown は any の安全版。",
      "unknown は narrowing しないと操作不可。",
      "外部 API レスポンス等の『型不明な値』には unknown を使う。",
    ],
    explanation: {
      summary:
        "`unknown` は型不明だが操作には narrowing 必須 (安全)。`any` は型チェックを全部無効化 (危険)。本番コードでは any を避けて unknown + 検証。",
      reason:
        "any は型システムから逃げるエスケープハッチ。unknown は『型は不明だが、ちゃんと検証してから使ってね』のメッセージ。`JSON.parse()` の戻りは any だが、`zod` などの検証ライブラリで unknown → 厳密な型に narrow。",
      codeExample:
        "// any (危険)\nlet a: any = 'hello'\na.foo.bar.baz       // 型チェック無し (実行時エラー)\n\n// unknown (安全)\nlet u: unknown = 'hello'\nu.length            // Error: unknown は操作不可\nif (typeof u === 'string') {\n  u.length          // OK (narrowing 後)\n}\n\n// 外部入力 (推奨パターン)\nimport { z } from 'zod'\nconst Schema = z.object({ name: z.string(), age: z.number() })\nfunction parse(input: unknown) {\n  return Schema.parse(input)  // 検証 + 型推論\n}",
    },
  },
  {
    id: "ts-009",
    categoryId: "ts-basics",
    difficulty: "intermediate",
    type: "text",
    question:
      "型定義から特定のキー (例: 'id' | 'name') の値の型を取り出す TS のユーティリティ型は？(英語、Camel)",
    answers: ["Pick", "Pick<T, K>"],
    hints: [
      "ユーティリティ型シリーズの 1 つ。",
      "Omit の対義語。",
      "Pick<User, 'id' | 'name'> で id と name だけ抽出。",
    ],
    explanation: {
      summary:
        "`Pick<T, K>` で T から K キーだけ抽出した型を作る。`Omit<T, K>` は逆 (K を除外)。",
      reason:
        "型の派生に頻出。Form 用 (Pick で必要なフィールドだけ)、API DTO 用 (Omit で id/timestamps を除外) 等。Mapped Type で自作も可能。",
      codeExample:
        "type User = { id: number; name: string; email: string; password: string }\n\ntype PublicUser = Omit<User, 'password'>           // {id, name, email}\ntype LoginInput = Pick<User, 'email' | 'password'> // {email, password}\ntype CreateUser = Omit<User, 'id'>                 // POST 用\ntype OptionalUser = Partial<User>                  // 全 optional\ntype ReadonlyUser = Readonly<User>                 // 全 readonly\n\n// 関数引数の型を取り出す\ntype Params = Parameters<typeof fn>\ntype Ret = ReturnType<typeof fn>",
    },
  },
  {
    id: "ts-010",
    categoryId: "ts-basics",
    difficulty: "intermediate",
    type: "choice",
    question: "次のジェネリクスの結果は？",
    code: "function first<T>(arr: T[]): T | undefined {\n  return arr[0]\n}\n\nconst a = first([1, 2, 3])\nconst b = first(['a', 'b'])\nconst c = first([])",
    choices: [
      "TypeScript エラー",
      "a: number | undefined / b: string | undefined / c: undefined",
      "全部 any",
      "全部 unknown",
    ],
    answerIndex: 1,
    hints: [
      "T は呼び出し毎に推論される。",
      "[1, 2, 3] → T = number、['a', 'b'] → T = string。",
      "[] → T = never (空配列の要素型) → never | undefined = undefined。",
    ],
    explanation: {
      summary:
        "ジェネリクス T は呼び出しごとに引数から推論される。空配列だと T = never (絞り込まれる)。",
      reason:
        "型推論の基本。明示的に `first<number>([])` と書けば T = number に固定可。`as` で実行時の型アサーションも可だが安全性低。`T extends ...` で制約付き。",
      codeExample:
        "first([1, 2])               // T = number, 戻り値 number | undefined\nfirst(['a'])                // T = string\nfirst<string>([])           // 明示 T = string\n\n// 制約付き\nfunction longest<T extends { length: number }>(a: T, b: T): T {\n  return a.length >= b.length ? a : b\n}\nlongest('hi', 'hello')      // OK\nlongest(42, 99)              // Error: number は length 持たない",
    },
  },
  {
    id: "ts-011",
    categoryId: "ts-basics",
    difficulty: "intermediate",
    type: "choice",
    question:
      "TypeScript の strict モードで有効化される主な厳しさは？",
    choices: [
      "全コードを再フォーマット",
      "ES5 にトランスパイル",
      "JS 機能を制限",
      "strictNullChecks / noImplicitAny / strictFunctionTypes / strictBindCallApply 等",
    ],
    answerIndex: 3,
    hints: [
      "strict: true で複数の厳格チェックを一括有効化。",
      "strictNullChecks: null/undefined を型として明示必須。",
      "noImplicitAny: 型推論できない場所で any 暗黙化を禁止。",
    ],
    explanation: {
      summary:
        "`tsconfig.json` の `strict: true` で strictNullChecks / noImplicitAny / strictFunctionTypes / strictBindCallApply / alwaysStrict / strictPropertyInitialization など全部 ON。",
      reason:
        "本番コードは strict 必須。strictNullChecks 無効だと `null` / `undefined` が全型に暗黙的に含まれ、ランタイムエラーが多発。新規プロジェクトは strict、既存は段階的に migration (`strict: false` から個別 ON)。",
      codeExample:
        "// tsconfig.json\n{\n  \"compilerOptions\": {\n    \"strict\": true,            // 推奨\n    \"noUncheckedIndexedAccess\": true,  // arr[0] が T | undefined になる (推奨)\n    \"exactOptionalPropertyTypes\": true,  // optional の挙動厳格化\n    \"noImplicitReturns\": true\n  }\n}\n\n// strictNullChecks の効果\nfunction find(arr: User[], id: number): User {\n  return arr.find(u => u.id === id)\n  //     ^ Error: User | undefined を User に代入できない\n}",
    },
  },
  {
    id: "ts-012",
    categoryId: "ts-basics",
    difficulty: "intermediate",
    type: "choice",
    question:
      "TypeScript で関数の戻り値が『絶対 return しない (例外を投げる / 無限ループ)』ことを表す型は？",
    choices: ["null", "never", "void", "undefined"],
    answerIndex: 1,
    hints: [
      "never は『絶対に値を返さない』を意味する型。",
      "void は『値を返さない (return 文なし)』。",
      "throw する関数や無限ループの戻り型は never。",
    ],
    explanation: {
      summary:
        "`never` は『到達不能な値の型』。例外を投げる関数 / 無限ループの戻り型。Union から要素を除外する効果 (Exhaustiveness Check) も。",
      reason:
        "`never` は『どの型のサブタイプ』でもあるが『どの型でもない』。`switch` の `default: const _: never = x` で網羅性チェック。Exhaustiveness Check で『新しいケースを追加し忘れた』をコンパイル時に検出。",
      codeExample:
        "function fail(msg: string): never {\n  throw new Error(msg)\n}\n\nfunction loop(): never {\n  while (true) {}\n}\n\n// Exhaustiveness Check\ntype Shape = { kind: 'circle' } | { kind: 'rect' }\nfunction area(s: Shape) {\n  switch (s.kind) {\n    case 'circle': return ...\n    case 'rect':   return ...\n    default: {\n      const _exhaustive: never = s   // 新しい kind 追加で Error\n      throw new Error()\n    }\n  }\n}",
    },
  },
  {
    id: "ts-013",
    categoryId: "ts-basics",
    difficulty: "intermediate",
    type: "choice",
    question: "次のうち、enum の代替として推奨されるのは？",
    choices: [
      "interface のみ",
      "class",
      "namespace",
      "as const オブジェクト + typeof",
    ],
    answerIndex: 3,
    hints: [
      "enum はランタイムにコード生成され、tree-shaking しにくい。",
      "as const で literal object → typeof でユニオン型化。",
      "TS team も最近は const enum / 普通の enum を避ける流れ。",
    ],
    explanation: {
      summary:
        "`enum` よりも `as const オブジェクト + typeof keyof` で値とユニオン型を同時定義するパターンが推奨されつつある。",
      reason:
        "`enum` はトランスパイル時に JS のオブジェクトが生成され、tree-shaking や型と値の重複定義の混乱を招く。`as const` パターンなら純粋な型レベルで、ランタイムコストもゼロ。`const enum` はインライン化されるが ts-loader 等で互換性問題あり。",
      codeExample:
        "// enum (旧)\nenum Status { Draft = 'draft', Published = 'published' }\n\n// 推奨: as const パターン\nconst Status = {\n  Draft: 'draft',\n  Published: 'published'\n} as const\ntype Status = typeof Status[keyof typeof Status]  // 'draft' | 'published'\n\n// 値\nStatus.Draft   // 'draft'\n\n// 型として\nfunction set(s: Status) { ... }",
    },
  },
  {
    id: "ts-014",
    categoryId: "ts-basics",
    difficulty: "intermediate",
    type: "choice",
    question:
      "TypeScript で『型を取得する』方法として正しいのは？",
    choices: [
      "typeof のみ",
      "型は実行時にしか取得できない",
      "type ofは廃止",
      "typeof / keyof / ReturnType / Parameters / インデックス型アクセス T[K]",
    ],
    answerIndex: 3,
    hints: [
      "typeof は値から型を抽出。",
      "keyof でオブジェクトのキーをユニオン型化。",
      "T['key'] や T[number] でインデックスアクセス型。",
    ],
    explanation: {
      summary:
        "型操作: `typeof x` (値から型)、`keyof T` (T のキー集合)、`T[K]` (インデックスアクセス)、`ReturnType<F>` / `Parameters<F>` (関数解析)、`Awaited<P>` (Promise の中身)。",
      reason:
        "型を派生させる演算子群。データの形状を一箇所で定義 → そこから派生型を生成すれば、変更時に追従が楽。`Awaited` で Promise<Promise<T>> も平坦化。",
      codeExample:
        "const config = { host: 'localhost', port: 3000 } as const\ntype Config = typeof config   // { host: 'localhost', port: 3000 }\n\ntype K = keyof Config         // 'host' | 'port'\ntype V = Config[keyof Config] // 'localhost' | 3000\ntype Host = Config['host']    // 'localhost'\n\n// 関数\nfunction fetchUser(id: number) { return Promise.resolve({ name: 'A' }) }\ntype Args = Parameters<typeof fetchUser>      // [number]\ntype Ret = ReturnType<typeof fetchUser>       // Promise<{ name: string }>\ntype User = Awaited<Ret>                       // { name: string }\n\n// 配列\nconst arr = [1, 'a', true] as const\ntype Element = typeof arr[number]   // 1 | 'a' | true",
    },
  },
  {
    id: "ts-015",
    categoryId: "ts-basics",
    difficulty: "advanced",
    type: "choice",
    question:
      "Mapped Type の例として正しいのは？",
    choices: [
      "{ [K in keyof T]: T[K] }",
      "T extends U ? X : Y",
      "T & U",
      "T | U",
    ],
    answerIndex: 0,
    hints: [
      "オブジェクトのキーをループして新しい型を作る。",
      "Partial / Required / Readonly の実装に使われている。",
      "[K in keyof T] の構文。",
    ],
    explanation: {
      summary:
        "Mapped Type: `{ [K in keyof T]: ... }` で T のキーを反復して新しい型を構築。Utility Types の多くがこの仕組み。",
      reason:
        "高度な型操作の中核。`?` / `readonly` の追加 / 削除、`+` / `-` で modifier 操作。Pick / Omit / Partial / Required / Readonly はすべて Mapped Type で実装。",
      codeExample:
        "// Partial の実装\ntype Partial<T> = { [K in keyof T]?: T[K] }\n\n// Required\ntype Required<T> = { [K in keyof T]-?: T[K] }\n\n// Readonly\ntype Readonly<T> = { readonly [K in keyof T]: T[K] }\n\n// 値を別の型に変換\ntype Stringified<T> = { [K in keyof T]: string }\ntype S = Stringified<{ a: number; b: boolean }>\n// { a: string; b: string }\n\n// Conditional Mapped Type\ntype NonFunctionKeys<T> = {\n  [K in keyof T]: T[K] extends Function ? never : K\n}[keyof T]",
    },
  },
  {
    id: "ts-016",
    categoryId: "ts-basics",
    difficulty: "advanced",
    type: "choice",
    question:
      "Conditional Type の構文として正しいのは？",
    choices: [
      "match T { U => X, _ => Y }",
      "T extends U ? X : Y",
      "T == U ? X : Y",
      "if T = U then X else Y",
    ],
    answerIndex: 1,
    hints: [
      "三項演算子に似た構文。",
      "T が U に assignable なら X、そうでなければ Y。",
      "ReturnType / Parameters 等の実装に使われている。",
    ],
    explanation: {
      summary:
        "`T extends U ? X : Y` で条件型。T が U に代入可能なら X、そうでなければ Y。`infer` と組み合わせて型変数を抽出可。",
      reason:
        "高度な型操作。`ReturnType<F> = F extends (...args: any) => infer R ? R : never` のように infer で型変数を捕捉。Distribute over Union: `T extends U ? ...` で T が union だと各メンバーに分配。",
      codeExample:
        "// 基本\ntype IsString<T> = T extends string ? true : false\ntype A = IsString<'hi'>      // true\ntype B = IsString<42>        // false\n\n// infer で型抽出\ntype ReturnType<F> = F extends (...args: any) => infer R ? R : never\ntype R = ReturnType<() => number>   // number\n\n// Array Element\ntype Elem<A> = A extends (infer T)[] ? T : never\ntype E = Elem<string[]>      // string\n\n// Distribute over Union\ntype ToArray<T> = T extends any ? T[] : never\ntype X = ToArray<string | number>   // string[] | number[]",
    },
  },
  {
    id: "ts-017",
    categoryId: "ts-basics",
    difficulty: "advanced",
    type: "choice",
    question:
      "次のうち、Template Literal Type の例として正しいのは？",
    choices: [
      "type Greet = template Hello",
      "type Greet = String('Hello')",
      "Template Literal Type は存在しない",
      "type Greet = `Hello, ${Name}`",
    ],
    answerIndex: 3,
    hints: [
      "TS 4.1+ で導入。",
      "JS のテンプレートリテラルと同じ構文を型レベルで。",
      "リテラル型の合成や CSS-in-JS の型推論で活用。",
    ],
    explanation: {
      summary:
        "TS 4.1+ で Template Literal Type が導入。型レベルで文字列リテラルを合成・分解。`${Type}` で展開。",
      reason:
        "API ルートの型、CSS 値、イベント名等の文字列ベースの型を強力に表現。`Uppercase<S>` / `Lowercase<S>` / `Capitalize<S>` の組込み型もあり。",
      codeExample:
        "type Name = 'Alice' | 'Bob'\ntype Greet = `Hello, ${Name}`\n// 'Hello, Alice' | 'Hello, Bob'\n\n// イベント名\ntype EventName<T extends string> = `on${Capitalize<T>}`\ntype E = EventName<'click'>   // 'onClick'\n\n// CSS\ntype Side = 'top' | 'right' | 'bottom' | 'left'\ntype Margin = `margin-${Side}`\n// 'margin-top' | 'margin-right' | ...\n\n// API ルート\ntype Method = 'GET' | 'POST'\ntype Path = '/users' | '/posts'\ntype Endpoint = `${Method} ${Path}`",
    },
  },
  {
    id: "ts-018",
    categoryId: "ts-basics",
    difficulty: "advanced",
    type: "choice",
    question:
      "次のうち、TypeScript の型レベル『if 文』として機能するのは？",
    choices: [
      "if ... else ...",
      "switch ...",
      "match ...",
      "Conditional Types (T extends U ? X : Y)",
    ],
    answerIndex: 3,
    hints: [
      "型レベルには runtime の制御構文は無い。",
      "Conditional Type が唯一の分岐機構。",
      "再帰 + Conditional Type で多くのロジックを表現できる。",
    ],
    explanation: {
      summary:
        "TS の型システムは Turing 完備で、Conditional Type で分岐、再帰で繰り返しを表現。型レベルプログラミングが可能。",
      reason:
        "型レベルでループ・分岐・再帰が書けるので、複雑な型変換 (snake_case → camelCase 等) も実装可。ただし複雑化するとコンパイル時間が悪化するので適度に。",
      codeExample:
        "// snake_case → camelCase 型変換\ntype CamelCase<S extends string> = S extends `${infer A}_${infer B}`\n  ? `${A}${Capitalize<CamelCase<B>>}`\n  : S\n\ntype X = CamelCase<'user_first_name'>   // 'userFirstName'\n\n// オブジェクトキーを変換\ntype ObjectCamelize<T> = {\n  [K in keyof T as CamelCase<K & string>]: T[K]\n}\n\n// Length カウント (再帰)\ntype Length<T extends any[]> = T['length']\ntype L = Length<[1, 2, 3]>    // 3",
    },
  },
  {
    id: "ts-019",
    categoryId: "ts-basics",
    difficulty: "advanced",
    type: "choice",
    question:
      "外部 JSON 入力を実行時に型検証 + TS の型推論にも反映できる人気ライブラリは？",
    choices: [
      "上記すべて (zod が現代の第一候補)",
      "zod (TypeScript-first スキーマ検証)",
      "joi (JS 用、TS 型推論は限定的)",
      "yup",
    ],
    answerIndex: 0,
    hints: [
      "実行時検証 + コンパイル時型推論 の両立。",
      "外部 API のレスポンス検証で必須。",
      "TypeScript エコシステムでデファクト。",
    ],
    explanation: {
      summary:
        "`zod` は TS-first のスキーマ検証ライブラリ。`z.object({...})` で実行時検証 + `z.infer<>` で型推論を取り出せる。joi / yup よりも型推論強力。",
      reason:
        "API レスポンス / フォーム入力 / 環境変数の検証で必須。fetch の戻りを `Schema.parse(json)` するだけで、不正なデータをはじき + TS の型として扱える。Next.js / tRPC / React Hook Form 連携も豊富。",
      codeExample:
        "import { z } from 'zod'\n\nconst UserSchema = z.object({\n  id: z.number(),\n  email: z.string().email(),\n  age: z.number().min(0).max(150).optional()\n})\n\ntype User = z.infer<typeof UserSchema>\n// { id: number; email: string; age?: number }\n\n// fetch 後の検証\nconst res = await fetch('/api/user/1')\nconst json = await res.json()\nconst user: User = UserSchema.parse(json)   // 失敗で ZodError\n\n// safeParse (例外なしバージョン)\nconst result = UserSchema.safeParse(json)\nif (result.success) {\n  result.data       // 型: User\n} else {\n  result.error      // ZodError\n}",
    },
  },
  {
    id: "ts-020",
    categoryId: "ts-basics",
    difficulty: "advanced",
    type: "choice",
    question:
      "tsconfig.json の `moduleResolution` 推奨設定 (現代の Node プロジェクト) は？",
    choices: [
      "bundler または node16 / nodenext",
      "classic (廃止予定)",
      "amd / umd",
      "なし",
    ],
    answerIndex: 0,
    hints: [
      "TypeScript 5.0+ で bundler が登場。",
      "Vite / esbuild / webpack 等のバンドラ環境では bundler が最適。",
      "純粋な Node.js 環境では node16 / nodenext。",
    ],
    explanation: {
      summary:
        "TS 5.0+ では `bundler` (Vite/esbuild/Next.js 等のバンドラ向け) または `node16` / `nodenext` (純 Node 向け) を使う。`node` (古い) や `classic` は避ける。",
      reason:
        "Node.js の ESM 対応 + バンドラの最適化を考慮した modern な設定。`bundler` は拡張子省略・JSON import などバンドラ機能を活用可。`node16` は Node の ESM/CJS 解決ルールに厳密に従う。",
      codeExample:
        "// tsconfig.json (Vite / Next.js / esbuild)\n{\n  \"compilerOptions\": {\n    \"target\": \"ES2022\",\n    \"module\": \"ESNext\",\n    \"moduleResolution\": \"bundler\",\n    \"strict\": true,\n    \"jsx\": \"preserve\"\n  }\n}\n\n// Node.js (Library / CLI)\n{\n  \"compilerOptions\": {\n    \"target\": \"ES2022\",\n    \"module\": \"NodeNext\",\n    \"moduleResolution\": \"NodeNext\",\n    \"strict\": true\n  }\n}",
    },
  },

  // ===========================================================================
  // ⚛️ React 追加 (react-006 〜 react-020, 15問)
  // ===========================================================================
  {
    id: "react-006",
    categoryId: "react-fundamentals",
    difficulty: "beginner",
    type: "choice",
    question:
      "React コンポーネントが再レンダリングされる主なトリガーは？",
    choices: [
      "手動で呼ばないと",
      "useState の setState 呼び出し / props の変化 / Context 値の変化 / 親の再レンダリング",
      "1 秒ごとに自動",
      "ブラウザのリサイズのみ",
    ],
    answerIndex: 1,
    hints: [
      "state / props / context が変わると再レンダリング。",
      "親が再レンダリングされると子も (memo で抑制可)。",
      "setState で同じ値を渡しても (Object.is 比較で同じなら) スキップ。",
    ],
    explanation: {
      summary:
        "再レンダリング条件: state 更新 / props 変化 / Context 値変化 / 親の再レンダリング。`Object.is` で同値判定し、変わってなければスキップ。",
      reason:
        "パフォーマンスの基本。不要な再レンダリングは `React.memo` (props 比較) / `useMemo` / `useCallback` で抑制可。React 19 の React Compiler は自動で多くの最適化を行う予定。",
      codeExample:
        "function Counter() {\n  const [n, setN] = useState(0)\n  return <button onClick={() => setN(n + 1)}>{n}</button>\n}\n\n// 同じ値の setState は再レンダリングなし\nsetN(0)\nsetN(0)   // 2 回目は何も起きない\n\n// React.memo で props 同じなら再レンダリングしない\nconst Child = React.memo(function Child({ value }) { ... })\n\n// useCallback で関数 props を安定化\nconst onClick = useCallback(() => doSomething(id), [id])",
    },
  },
  {
    id: "react-007",
    categoryId: "react-fundamentals",
    difficulty: "beginner",
    type: "choice",
    question: "次のコードの問題は？",
    code: "function Counter() {\n  const [n, setN] = useState(0)\n  return <button onClick={() => {\n    setN(n + 1)\n    setN(n + 1)\n  }}>{n}</button>\n}",
    choices: [
      "TypeError",
      "+2 されるので正しい",
      "無限ループ",
      "2 回 setN(n + 1) しても合計 +1 にしかならない (古い n を見ている)",
    ],
    answerIndex: 3,
    hints: [
      "setN(n + 1) はクロージャでキャプチャした n を使う。",
      "1 回目も 2 回目も n = 0 を見て setN(1) しているので合計 1 になる。",
      "関数形式 setN(prev => prev + 1) で解決。",
    ],
    explanation: {
      summary:
        "setState はクロージャで古い state を見るので、複数回呼ぶ時は関数形式 `setN(prev => prev + 1)` で安全に。",
      reason:
        "React は batching でレンダリングを 1 回にまとめる。`setN(n + 1)` を 2 回呼んでも n は同じ値なので、最終的に setN(1) を 2 回書いただけ。関数形式なら React が直前の state を渡してくれる。",
      codeExample:
        "// ❌ 古い state を見る\nfunction Counter() {\n  const [n, setN] = useState(0)\n  return <button onClick={() => {\n    setN(n + 1)\n    setN(n + 1)   // 同じく +1 しかしない\n  }}>{n}</button>\n}\n\n// ✅ 関数形式\nreturn <button onClick={() => {\n  setN(prev => prev + 1)\n  setN(prev => prev + 1)   // ちゃんと +2\n}}>{n}</button>",
    },
  },
  {
    id: "react-008",
    categoryId: "react-fundamentals",
    difficulty: "intermediate",
    type: "choice",
    question:
      "React の Context API の主な用途は？",
    choices: [
      "Redux の代替で全状態管理",
      "DB 接続",
      "ルーティング",
      "コンポーネントツリー深くまで props を渡さずに値を共有 (テーマ / 認証ユーザー / ロケール等)",
    ],
    answerIndex: 3,
    hints: [
      "Prop drilling (バケツリレー) を回避する API。",
      "頻繁に変わる state には不向き (再レンダリングが広範囲)。",
      "テーマ / 認証 / locale 等の『静的に近い』値に最適。",
    ],
    explanation: {
      summary:
        "Context は『コンポーネントツリーで共有する値』(テーマ / 認証 / 言語) の伝達。Provider で囲み、useContext で取得。",
      reason:
        "深いネストへの props 伝播を回避。ただし Context 値が変わると消費している全コンポーネントが再レンダリングするので、頻繁に変わる state には不向き (Redux / Zustand / Jotai で局所更新可)。",
      codeExample:
        "// 定義\nconst ThemeContext = createContext<'light' | 'dark'>('light')\n\n// Provider\nfunction App() {\n  const [theme, setTheme] = useState('light')\n  return (\n    <ThemeContext.Provider value={theme}>\n      <Page />\n    </ThemeContext.Provider>\n  )\n}\n\n// 消費\nfunction DeepChild() {\n  const theme = useContext(ThemeContext)\n  return <div className={theme}>...</div>\n}\n\n// React 19+ では <ThemeContext> 自体が Provider に\n<ThemeContext value={theme}>...",
    },
  },
  {
    id: "react-009",
    categoryId: "react-fundamentals",
    difficulty: "intermediate",
    type: "choice",
    question:
      "React で『フォーム入力を state と双方向同期』する制御コンポーネントの書き方は？",
    choices: [
      "form タグだけで自動",
      "v-model のような専用 syntax",
      "value + onChange で state を更新 (Controlled Component)",
      "ref で DOM 直接操作",
    ],
    answerIndex: 2,
    hints: [
      "value 属性で state を反映、onChange で更新。",
      "Vue の v-model はこれの糖衣構文。",
      "Uncontrolled は ref + defaultValue。",
    ],
    explanation: {
      summary:
        "Controlled: `<input value={x} onChange={(e) => setX(e.target.value)} />`。state が唯一の真実。Uncontrolled は ref + defaultValue で DOM を直接参照。",
      reason:
        "Controlled は state と UI が同期されてバリデーション・条件付き表示が書きやすい。Uncontrolled はパフォーマンス良く React Hook Form 等で活用。",
      codeExample:
        "// Controlled\nfunction Form() {\n  const [name, setName] = useState('')\n  return (\n    <form onSubmit={e => { e.preventDefault(); save(name) }}>\n      <input value={name} onChange={e => setName(e.target.value)} />\n      <button>Save</button>\n    </form>\n  )\n}\n\n// Uncontrolled\nfunction Form() {\n  const ref = useRef<HTMLInputElement>(null)\n  return (\n    <form onSubmit={e => { e.preventDefault(); save(ref.current!.value) }}>\n      <input ref={ref} defaultValue='' />\n    </form>\n  )\n}",
    },
  },
  {
    id: "react-010",
    categoryId: "react-fundamentals",
    difficulty: "intermediate",
    type: "choice",
    question:
      "useEffect の cleanup 関数 (return する関数) が呼ばれるタイミングは？",
    choices: [
      "アンマウント時のみ",
      "毎レンダリング後",
      "呼ばれない",
      "コンポーネントがアンマウントされる時 + 依存配列が変わって再実行される直前",
    ],
    answerIndex: 3,
    hints: [
      "useEffect の return は次の実行前 + アンマウント時に呼ばれる。",
      "subscribe / unsubscribe のペアで使う。",
      "依存変更時に古い effect の cleanup → 新 effect 実行。",
    ],
    explanation: {
      summary:
        "useEffect の return (cleanup) は (1) アンマウント時、(2) 依存配列が変わって effect が再実行される直前、の両方で呼ばれる。",
      reason:
        "subscribe → unsubscribe、setInterval → clearInterval、fetch → AbortController.abort() 等のペアでリソースリークを防ぐ。React 18+ の Strict Mode (開発) では effect が 2 回実行されるので、副作用は idempotent (冪等) に書く必要あり。",
      codeExample:
        "// タイマー\nuseEffect(() => {\n  const id = setInterval(tick, 1000)\n  return () => clearInterval(id)\n}, [])\n\n// fetch with AbortController\nuseEffect(() => {\n  const c = new AbortController()\n  fetch(url, { signal: c.signal })\n    .then(r => r.json())\n    .then(setData)\n  return () => c.abort()\n}, [url])\n\n// イベントリスナー\nuseEffect(() => {\n  const handler = () => setSize(window.innerWidth)\n  window.addEventListener('resize', handler)\n  return () => window.removeEventListener('resize', handler)\n}, [])",
    },
  },
  {
    id: "react-011",
    categoryId: "react-fundamentals",
    difficulty: "intermediate",
    type: "choice",
    question:
      "次のうち、複雑な state ロジックを扱う Hook は？",
    choices: [
      "useId",
      "useReducer (Redux 風の reducer + dispatch)",
      "useEffect",
      "useRef",
    ],
    answerIndex: 1,
    hints: [
      "useState の上位互換的存在。",
      "(state, action) => newState の reducer 関数。",
      "複雑な state 遷移ロジックを切り出せる。",
    ],
    explanation: {
      summary:
        "`useReducer(reducer, initial)` で `[state, dispatch]` を取得。Redux 風の state 管理を 1 コンポーネント内で。",
      reason:
        "useState が複数あって連動する場合や、state の更新ロジックが複雑な時に。reducer 関数を外部化すれば単体テスト可。Context + useReducer の組合せで簡易グローバル管理も。",
      codeExample:
        "type Action = { type: 'inc' } | { type: 'dec' } | { type: 'reset' }\nfunction reducer(state: number, action: Action): number {\n  switch (action.type) {\n    case 'inc':   return state + 1\n    case 'dec':   return state - 1\n    case 'reset': return 0\n  }\n}\n\nfunction Counter() {\n  const [n, dispatch] = useReducer(reducer, 0)\n  return (\n    <>\n      <p>{n}</p>\n      <button onClick={() => dispatch({ type: 'inc' })}>+</button>\n      <button onClick={() => dispatch({ type: 'reset' })}>reset</button>\n    </>\n  )\n}",
    },
  },
  {
    id: "react-012",
    categoryId: "react-fundamentals",
    difficulty: "intermediate",
    type: "choice",
    question:
      "React のグローバル状態管理ライブラリとして広く使われているのは？",
    choices: [
      "全部廃止",
      "useState のみで十分",
      "Context API のみ",
      "Zustand / Jotai / Redux Toolkit / Recoil (Meta) / TanStack Query (server state)",
    ],
    answerIndex: 3,
    hints: [
      "クライアント state: Zustand / Jotai / Redux / Recoil。",
      "Server state (API キャッシュ): TanStack Query / SWR。",
      "使い分けが現代の主流。",
    ],
    explanation: {
      summary:
        "用途別に: クライアント状態 = Zustand / Jotai / Redux Toolkit、サーバー状態 = TanStack Query / SWR、フォーム = React Hook Form。Redux は減少傾向、Zustand が軽量で人気上昇中。",
      reason:
        "『何でも Redux』時代は終わり、サーバーデータは TanStack Query、UI 状態は軽量 Zustand 等の使い分けが定石。Redux Toolkit (RTK) は Redux の現代版で、ボイラープレートが大幅減。",
      codeExample:
        "// Zustand (シンプル、人気上昇)\nimport { create } from 'zustand'\n\nconst useStore = create<State>((set) => ({\n  count: 0,\n  inc: () => set(s => ({ count: s.count + 1 }))\n}))\n\nfunction Counter() {\n  const { count, inc } = useStore()\n  return <button onClick={inc}>{count}</button>\n}\n\n// TanStack Query (サーバー状態)\nconst { data, isLoading, error } = useQuery({\n  queryKey: ['posts', id],\n  queryFn: () => fetch(`/api/posts/${id}`).then(r => r.json())\n})",
    },
  },
  {
    id: "react-013",
    categoryId: "react-fundamentals",
    difficulty: "intermediate",
    type: "choice",
    question:
      "React で『子コンポーネントの DOM ノードや関数』にアクセスする Hook は？",
    choices: [
      "useEffect",
      "useContext",
      "useRef (+ forwardRef で子の ref を親が受け取る)",
      "useState",
    ],
    answerIndex: 2,
    hints: [
      "useRef で ref オブジェクトを作成。",
      "ref={ref} で子の DOM 要素にバインド。",
      "再レンダリング不要な値の保持にも使える。",
    ],
    explanation: {
      summary:
        "`useRef(null)` で ref オブジェクトを作成し `ref.current` で DOM 要素にアクセス。`forwardRef` で子コンポーネント自身に ref を渡す (React 18 まで)。React 19+ では関数コンポーネントが ref を props として受け取れる。",
      reason:
        "DOM 操作 (input.focus(), scrollTo 等)、サードパーティライブラリ統合、再レンダリングしない値の保持 (タイマー ID 等)。useRef の値変更は再レンダリングをトリガーしない。",
      codeExample:
        "// DOM へのアクセス\nfunction Input() {\n  const inputRef = useRef<HTMLInputElement>(null)\n  useEffect(() => { inputRef.current?.focus() }, [])\n  return <input ref={inputRef} />\n}\n\n// 再レンダリング不要な値\nfunction Timer() {\n  const intervalRef = useRef<number>()\n  useEffect(() => {\n    intervalRef.current = setInterval(tick, 1000)\n    return () => clearInterval(intervalRef.current)\n  }, [])\n}\n\n// React 19+: ref を props として\nfunction MyInput({ ref }: { ref: Ref<HTMLInputElement> }) {\n  return <input ref={ref} />\n}",
    },
  },
  {
    id: "react-014",
    categoryId: "react-fundamentals",
    difficulty: "intermediate",
    type: "choice",
    question: "次のコードの問題は？",
    code: "function List({ items }) {\n  const filtered = items.filter(i => i.active)\n  const sorted = filtered.sort((a, b) => a.name.localeCompare(b.name))\n  return <ul>{sorted.map(i => <li key={i.id}>{i.name}</li>)}</ul>\n}",
    choices: [
      "問題なし",
      "filter().sort() の sort が破壊的で filtered を mutate、props.items にも影響する可能性",
      "filter は廃止",
      "sort は同期処理だから OK",
    ],
    answerIndex: 1,
    hints: [
      "Array.sort() は破壊的メソッド。",
      "filter は新配列を返すが、sort はその配列を直接ソート (元の配列の構造による)。",
      "props 由来のデータを mutate するのは React のルール違反。",
    ],
    explanation: {
      summary:
        "`Array.sort()` は破壊的 (元の配列を変更)。`filter().sort()` の sort は filter 結果を mutate するが、その要素は元の `items` と参照共有なのでバグの温床。`[...arr].sort()` で安全に。",
      reason:
        "React は『props は不変』を前提とする。props.items の要素の順序が思わぬところで変わると、再レンダリング時のバグや、親コンポーネントの整合性が崩れる。`toSorted()` (ES2023+) で非破壊版が使える。",
      codeExample:
        "// ❌ 破壊的\nconst sorted = items.filter(i => i.active).sort(...)\n\n// ✅ 非破壊\nconst sorted = [...items.filter(i => i.active)].sort(...)\n\n// ES2023+ (Node 20+ / 新ブラウザ)\nconst sorted = items.filter(i => i.active).toSorted((a, b) => ...)\n\n// useMemo で更に最適化\nconst sorted = useMemo(\n  () => [...items.filter(i => i.active)].sort((a, b) => a.name.localeCompare(b.name)),\n  [items]\n)",
    },
  },
  {
    id: "react-015",
    categoryId: "react-fundamentals",
    difficulty: "intermediate",
    type: "choice",
    question:
      "次のうち、React Suspense の正しい使い方は？",
    choices: [
      "<Suspense fallback={<Loading />}>{Component with suspending data fetch}</Suspense>",
      "クラスコンポーネントの async lifecycle",
      "Hook 全般のローディング",
      "Suspense は廃止",
    ],
    answerIndex: 0,
    hints: [
      "Suspense は『データ準備中』のフォールバック UI を提供。",
      "TanStack Query / Relay / Next.js App Router 等が対応。",
      "Server Component との組合せで真価を発揮。",
    ],
    explanation: {
      summary:
        "`<Suspense fallback={...}>` でデータ取得中のフォールバック表示。React 18+ で SSR 統合、Next.js App Router でフル活用。",
      reason:
        "従来 `if (loading) return <Loading />` をコンポーネント毎に書いていたのを宣言的に切り出せる。Server Component と組合せでストリーミング SSR (HTML を部分的に配信)。Error Boundary と並ぶ React の宣言的エラーハンドリング。",
      codeExample:
        "// Next.js App Router\n<Suspense fallback={<Skeleton />}>\n  <Posts />\n</Suspense>\n\n// Posts.tsx (Server Component)\nasync function Posts() {\n  const data = await db.post.findMany()   // suspending\n  return <PostList items={data} />\n}\n\n// クライアント側 (TanStack Query)\nimport { useSuspenseQuery } from '@tanstack/react-query'\nfunction Posts() {\n  const { data } = useSuspenseQuery({ queryKey: ['posts'], queryFn: ... })\n  return <PostList items={data} />\n}",
    },
  },
  {
    id: "react-016",
    categoryId: "react-fundamentals",
    difficulty: "intermediate",
    type: "choice",
    question:
      "Error Boundary の主な用途は？",
    choices: [
      "Promise の reject 捕捉",
      "全グローバルエラー",
      "ネットワークエラー",
      "子ツリーで発生した例外を捕捉してフォールバック UI を表示",
    ],
    answerIndex: 3,
    hints: [
      "クラスコンポーネントで componentDidCatch / static getDerivedStateFromError を実装。",
      "ライブラリ react-error-boundary を使うのが現代の主流。",
      "イベントハンドラ内のエラーは捕捉しない (try/catch を別途)。",
    ],
    explanation: {
      summary:
        "Error Boundary は子ツリーの render / lifecycle / Hook で発生した例外を捕捉。`react-error-boundary` ライブラリで関数コンポーネント風に書ける。",
      reason:
        "Suspense と並ぶ宣言的エラーハンドリング。イベントハンドラ内のエラー (`onClick={() => { throw ... }}`) は捕捉しない (それは普通の try/catch で)。Sentry 等のエラー監視と組合せて使うのが定番。",
      codeExample:
        "import { ErrorBoundary } from 'react-error-boundary'\n\nfunction Fallback({ error, resetErrorBoundary }) {\n  return (\n    <div>\n      <p>Error: {error.message}</p>\n      <button onClick={resetErrorBoundary}>Retry</button>\n    </div>\n  )\n}\n\n<ErrorBoundary\n  FallbackComponent={Fallback}\n  onError={(err) => Sentry.captureException(err)}\n  onReset={() => refetch()}\n>\n  <App />\n</ErrorBoundary>",
    },
  },
  {
    id: "react-017",
    categoryId: "react-fundamentals",
    difficulty: "intermediate",
    type: "choice",
    question:
      "React Hook のルール (Rules of Hooks) として正しいのは？",
    choices: [
      "クラスコンポーネントでも呼べる",
      "ルールなし",
      "最上位でのみ呼ぶ (条件分岐・ループ内 NG) + 関数コンポーネント or 他の Hook 内でのみ呼ぶ",
      "条件分岐内でも自由に呼べる",
    ],
    answerIndex: 2,
    hints: [
      "if / for / while の中で呼ぶと React が状態を見失う。",
      "Hook 名は use で始まる規約 (ESLint が認識)。",
      "react-hooks/rules-of-hooks ESLint プラグインで自動チェック。",
    ],
    explanation: {
      summary:
        "Hook ルール: (1) 最上位でのみ呼ぶ (条件分岐・ループ・try 内 NG)、(2) React 関数コンポーネント or 他の Hook 内のみ。`eslint-plugin-react-hooks` で自動チェック。",
      reason:
        "React は呼び出し順序で Hook の状態を識別 (内部的に linked list)。条件分岐で順序が変わると state が崩壊。命名 use* は ESLint が Hook と認識するため。早期 return も Hook 呼び出し前に。",
      codeExample:
        "// ❌ NG: 条件分岐内\nfunction Bad({ x }) {\n  if (x) {\n    const [n, setN] = useState(0)   // 条件で呼ばれたり呼ばれなかったり\n  }\n}\n\n// ✅ OK: 最上位\nfunction Good({ x }) {\n  const [n, setN] = useState(0)\n  if (!x) return null\n  return <p>{n}</p>\n}\n\n// ESLint 設定\n// .eslintrc\n{\n  \"plugins\": [\"react-hooks\"],\n  \"rules\": {\n    \"react-hooks/rules-of-hooks\": \"error\",\n    \"react-hooks/exhaustive-deps\": \"warn\"\n  }\n}",
    },
  },
  {
    id: "react-018",
    categoryId: "react-fundamentals",
    difficulty: "advanced",
    type: "choice",
    question:
      "React 19 の新機能として正しいのは？",
    choices: [
      "JSX の廃止",
      "use() Hook で Promise を await 風に / Server Actions / React Compiler / form actions",
      "Class Component の復活",
      "redux 内蔵",
    ],
    answerIndex: 1,
    hints: [
      "React 19 (2024 末リリース) の目玉機能。",
      "use() で Promise や Context を関数として消費。",
      "React Compiler で useMemo / useCallback の手動最適化が不要に。",
    ],
    explanation: {
      summary:
        "React 19 主要機能: `use(promise)` (Promise/Context を関数的に解決)、Server Actions (Form 統合)、React Compiler (自動メモ化)、`<form action={fn}>`、ref を props で受け取り。",
      reason:
        "React Compiler により多くの `useMemo` / `useCallback` が不要に。Server Components + Server Actions で Rails の form_with 的な開発体験。`useTransition` の改善で楽観的 UI も書きやすく。",
      codeExample:
        "// use() Hook (React 19+)\nimport { use, Suspense } from 'react'\n\nfunction Posts({ promise }) {\n  const posts = use(promise)   // suspense と統合\n  return <PostList items={posts} />\n}\n\n<Suspense fallback={<Loading />}>\n  <Posts promise={fetchPosts()} />\n</Suspense>\n\n// Form actions\nasync function createPost(formData: FormData) {\n  'use server'\n  await db.post.create({ data: ... })\n}\n<form action={createPost}>...</form>\n\n// React Compiler が自動最適化\n// → useMemo / useCallback の多くが不要に",
    },
  },
  {
    id: "react-019",
    categoryId: "react-fundamentals",
    difficulty: "advanced",
    type: "choice",
    question:
      "React のレンダリングパフォーマンス調査で最初に使うべきは？",
    choices: [
      "全部 useMemo を付ける",
      "ライブラリを Redux に変える",
      "React DevTools Profiler (タイムライン記録 + コンポーネント別レンダリング時間)",
      "console.log を大量に",
    ],
    answerIndex: 2,
    hints: [
      "React DevTools 拡張機能の Profiler タブ。",
      "コンポーネントの再レンダリング理由を特定可能。",
      "個別の対応 (memo/useMemo/useCallback) は『計測してから』が原則。",
    ],
    explanation: {
      summary:
        "React DevTools の Profiler でコンポーネント別の描画時間 + 再レンダリング理由を可視化。問題箇所を特定してから memo/useMemo を適用。",
      reason:
        "『推測するな、計測せよ』の鉄則。Profiler で具体的に遅いコンポーネントを見つけてから対策。`why-did-you-render` ライブラリで『なぜ再レンダリングしたか』をコンソールに出すのも便利。",
      codeExample:
        "// 計測手順\n// 1. React DevTools をインストール (ブラウザ拡張)\n// 2. Profiler タブを開く\n// 3. 録画ボタン押す\n// 4. 操作する\n// 5. 停止 → 各コンポーネントの描画時間が見える\n\n// why-did-you-render (開発時)\nimport whyDidYouRender from '@welldone-software/why-did-you-render'\nwhyDidYouRender(React)\n\nMyComponent.whyDidYouRender = true\n// 不要な再レンダリング時に console に理由が出る",
    },
  },
  {
    id: "react-020",
    categoryId: "react-fundamentals",
    difficulty: "advanced",
    type: "choice",
    question:
      "React で最もよくある useEffect の罠 / アンチパターンは？",
    choices: [
      "依存配列を省略 / 嘘の依存配列 / 派生状態を useEffect で同期 / async 関数を直接 useEffect に",
      "useEffect は使わない方が良い",
      "依存配列に全変数を入れる",
      "useEffect は廃止された",
    ],
    answerIndex: 0,
    hints: [
      "依存配列の漏れで stale closure。",
      "props から派生する値は useEffect で setState せず、レンダリング中に計算。",
      "async function を直接 useEffect に渡せない (戻り値が Promise なので)。",
    ],
    explanation: {
      summary:
        "useEffect の典型アンチパターン: (1) 依存配列ミス、(2) 派生状態の同期、(3) `async () => {}` を直接渡す、(4) cleanup 忘れ。",
      reason:
        "React 公式『You Might Not Need an Effect』ドキュメントに詳しい。Props から派生する値は useEffect で setState せず、レンダリング中に直接計算するのが正解。エフェクトは『外部システムとの同期』だけに使う。",
      codeExample:
        "// ❌ 派生状態の同期 (不要)\nuseEffect(() => {\n  setFullName(`${first} ${last}`)\n}, [first, last])\n\n// ✅ レンダリング中に計算\nconst fullName = `${first} ${last}`\n\n// ❌ async 関数を直接\nuseEffect(async () => {              // ← async は禁止\n  const data = await fetch(url)\n})\n\n// ✅ 中で async 関数を定義 + 呼ぶ\nuseEffect(() => {\n  async function run() {\n    const data = await fetch(url)\n    setData(data)\n  }\n  run()\n}, [url])\n\n// ❌ 依存漏れ\nuseEffect(() => {\n  console.log(count)\n}, [])  // count を使ってるのに deps に入ってない → stale closure",
    },
  },

  // ===========================================================================
  // ▲ Next.js 追加 (next-006 〜 next-020, 15問)
  // ===========================================================================
  {
    id: "next-006",
    categoryId: "nextjs-basics",
    difficulty: "intermediate",
    type: "choice",
    question:
      "Next.js App Router のレイアウト (layout.tsx) の特徴は？",
    choices: [
      "1 ファイルしか書けない",
      "ネスト構造で、再レンダリングをまたいで状態を保持 (URL 遷移時)",
      "ページごとに毎回再生成",
      "コンポーネントから使えない",
    ],
    answerIndex: 1,
    hints: [
      "layout.tsx は配置されたディレクトリ以下のすべてのページを包む。",
      "URL 遷移で同じ layout の場合、layout は再レンダリングされない (State 保持)。",
      "ネスト構造で複数のレイアウトを階層化可能。",
    ],
    explanation: {
      summary:
        "App Router のレイアウト: ネスト可能、URL 遷移時に共通部分は再レンダリングしない。`app/layout.tsx` がルート、各セクションに `app/blog/layout.tsx` 等で追加可能。",
      reason:
        "ヘッダー・フッター・サイドバーなど共通 UI を効率的に。State を保持するので、サイドバーのスクロール位置などが遷移で消えない。`children` prop でページコンテンツを描画。",
      codeExample:
        "// app/layout.tsx (ルート、必須)\nexport default function RootLayout({ children }: { children: React.ReactNode }) {\n  return (\n    <html lang='ja'>\n      <body>\n        <Header />\n        {children}\n      </body>\n    </html>\n  )\n}\n\n// app/blog/layout.tsx (セクション固有)\nexport default function BlogLayout({ children }) {\n  return (\n    <div className='grid grid-cols-[200px_1fr]'>\n      <BlogSidebar />\n      <main>{children}</main>\n    </div>\n  )\n}",
    },
  },
  {
    id: "next-007",
    categoryId: "nextjs-basics",
    difficulty: "intermediate",
    type: "choice",
    question:
      "Next.js App Router で動的セグメント (例: /users/123) の正しい配置は？",
    choices: [
      "app/users/$id.tsx",
      "app/users/_id_/page.tsx",
      "app/users/[id]/page.tsx で params.id として取得",
      "app/users/dynamic.tsx",
    ],
    answerIndex: 2,
    hints: [
      "[id] でブラケット記法。",
      "page.tsx で params.id でアクセス。",
      "[...slug] でキャッチオール、[[...slug]] でオプショナル。",
    ],
    explanation: {
      summary:
        "動的ルート `[param]`、キャッチオール `[...slug]`、オプショナルキャッチオール `[[...slug]]`。`params` は Promise なので await が必要 (Next.js 15+)。",
      reason:
        "ファイルベースルーティング。`[id]` は 1 セグメント、`[...slug]` は複数セグメント全部、`[[...slug]]` は『無しでもマッチ』。Next.js 15+ では `params` / `searchParams` が Promise になった。",
      codeExample:
        "// app/users/[id]/page.tsx\nexport default async function User({ params }: { params: Promise<{ id: string }> }) {\n  const { id } = await params\n  const user = await db.user.findUnique({ where: { id: Number(id) } })\n  return <UserCard user={user} />\n}\n\n// app/blog/[...slug]/page.tsx\n// /blog/a/b/c → params.slug = ['a', 'b', 'c']\n\n// generateStaticParams で SSG\nexport async function generateStaticParams() {\n  const users = await db.user.findMany()\n  return users.map(u => ({ id: u.id.toString() }))\n}",
    },
  },
  {
    id: "next-008",
    categoryId: "nextjs-basics",
    difficulty: "intermediate",
    type: "choice",
    question:
      "Next.js でクライアント遷移を行うコンポーネントは？",
    choices: [
      "<a href='/path'>",
      "router.push('/path') のみ",
      "<NavLink>",
      "<Link href='/path'> (next/link)",
    ],
    answerIndex: 3,
    hints: [
      "next/link の <Link> でクライアント遷移 (フルリロードしない)。",
      "<a> は通常の HTML リンク (フルリロード)。",
      "プログラム的遷移は useRouter().push() か redirect()。",
    ],
    explanation: {
      summary:
        "`<Link href='/'>` (`next/link`) で SPA 風のクライアント遷移 + prefetch。生の `<a>` はフルリロードするので避ける。",
      reason:
        "Link はビューポートに入ると自動 prefetch (本番のみ)。`prefetch={false}` で無効化、`prefetch={null}` でホバー時のみ。プログラム的遷移は `useRouter().push()`、Server Action 内は `redirect()`。",
      codeExample:
        "import Link from 'next/link'\n\n<Link href='/about'>About</Link>\n<Link href={`/users/${id}`} prefetch={false}>User</Link>\n\n// プログラム的遷移\n'use client'\nimport { useRouter } from 'next/navigation'\nfunction Button() {\n  const router = useRouter()\n  return <button onClick={() => router.push('/login')}>Login</button>\n}\n\n// Server Action 内\nimport { redirect } from 'next/navigation'\nexport async function createPost(formData: FormData) {\n  'use server'\n  const post = await db.post.create({ data: ... })\n  redirect(`/posts/${post.id}`)\n}",
    },
  },
  {
    id: "next-009",
    categoryId: "nextjs-basics",
    difficulty: "intermediate",
    type: "choice",
    question:
      "Next.js でデフォルトのレンダリング方式は？",
    choices: [
      "Pure SSG",
      "CSR のみ",
      "Server Component (サーバー側で実行 + HTML 配信、JS バンドル無し)",
      "Client Component",
    ],
    answerIndex: 2,
    hints: [
      "App Router のデフォルトは Server Component。",
      "JS バンドルがクライアントに送られないので軽い。",
      "useState / useEffect 等 Hook が必要なら 'use client' を付ける。",
    ],
    explanation: {
      summary:
        "App Router のデフォルトは Server Component。Server で実行 + HTML を配信、クライアントには最小限の JS のみ。`'use client'` ディレクティブで Client Component に切替。",
      reason:
        "Server Component の利点: (1) DB / 機密情報直接アクセス、(2) JS バンドル削減、(3) SEO 向上、(4) Streaming。インタラクティブな要素 (ボタンクリック、入力、フック) は Client Component に。",
      codeExample:
        "// Server Component (デフォルト)\nexport default async function Page() {\n  const posts = await db.post.findMany()   // DB 直接\n  return <PostList posts={posts} />\n}\n\n// Client Component\n'use client'\nimport { useState } from 'react'\nexport function Counter() {\n  const [n, setN] = useState(0)\n  return <button onClick={() => setN(n + 1)}>{n}</button>\n}\n\n// 混在 OK\n// Server Page が Client Counter を import & 描画",
    },
  },
  {
    id: "next-010",
    categoryId: "nextjs-basics",
    difficulty: "intermediate",
    type: "choice",
    question:
      "Next.js でデータ取得 (Server Component) の現代的な書き方は？",
    choices: [
      "コンポーネント内で async/await + fetch (キャッシュ統合)",
      "getStaticProps / getServerSideProps (Pages Router の旧式)",
      "useEffect + fetch",
      "Redux Saga",
    ],
    answerIndex: 0,
    hints: [
      "App Router の Server Component はそのまま async/await。",
      "fetch は Next.js が自動でキャッシュ統合。",
      "getStaticProps は Pages Router 時代の API。",
    ],
    explanation: {
      summary:
        "Server Component なら `async function Page() { const data = await fetch(url); ... }` で直接データ取得。fetch は Next.js が自動でキャッシュ / 再検証戦略を適用。",
      reason:
        "Pages Router の `getStaticProps` / `getServerSideProps` / `getInitialProps` は App Router で不要に。fetch のオプション (`cache`, `next.revalidate`, `next.tags`) でキャッシュ制御。並列フェッチも Promise.all で。",
      codeExample:
        "// 直接 fetch + キャッシュ統合\nexport default async function Page() {\n  const posts = await fetch('https://api.example.com/posts', {\n    next: { revalidate: 60, tags: ['posts'] }\n  }).then(r => r.json())\n  return <PostList items={posts} />\n}\n\n// 並列取得\nexport default async function Dashboard() {\n  const [users, posts, comments] = await Promise.all([\n    fetch(usersUrl).then(r => r.json()),\n    fetch(postsUrl).then(r => r.json()),\n    fetch(commentsUrl).then(r => r.json())\n  ])\n  return ...\n}",
    },
  },
  {
    id: "next-011",
    categoryId: "nextjs-basics",
    difficulty: "intermediate",
    type: "choice",
    question:
      "Next.js でリクエストをアプリ全体で前処理する middleware の配置は？",
    choices: [
      "config/middleware.ts",
      "middleware/",
      "ルート直下の middleware.ts (Edge Runtime)",
      "app/middleware.ts",
    ],
    answerIndex: 2,
    hints: [
      "プロジェクトルート (next.config.js と同階層) に 1 ファイル。",
      "Edge Runtime で動作 (Node.js ではない)。",
      "認証 / リダイレクト / A/B テストなどに使う。",
    ],
    explanation: {
      summary:
        "ルート直下の `middleware.ts` が全リクエストを処理。Edge Runtime (V8 isolate) で動くので軽量・高速・グローバル展開しやすい。",
      reason:
        "認証チェック (cookie/header)、リダイレクト、A/B テスト、国際化 (i18n)、リライト等で使う。`matcher` で対象パスを限定可。Edge Runtime なので Node.js 固有 API (fs 等) は使えない。",
      codeExample:
        "// middleware.ts\nimport { NextResponse } from 'next/server'\nimport type { NextRequest } from 'next/server'\n\nexport function middleware(req: NextRequest) {\n  const token = req.cookies.get('token')\n  if (!token && req.nextUrl.pathname.startsWith('/admin')) {\n    return NextResponse.redirect(new URL('/login', req.url))\n  }\n  return NextResponse.next()\n}\n\nexport const config = {\n  matcher: ['/admin/:path*', '/dashboard/:path*']\n}",
    },
  },
  {
    id: "next-012",
    categoryId: "nextjs-basics",
    difficulty: "intermediate",
    type: "choice",
    question:
      "Next.js でローディング UI を宣言的に表示するファイル名は？",
    choices: [
      "loader.tsx",
      "loading.tsx (Suspense 自動ラップ)",
      "spinner.tsx",
      "wait.tsx",
    ],
    answerIndex: 1,
    hints: [
      "App Router の規約ファイル。",
      "page.tsx と同階層に置くと自動で Suspense fallback に。",
      "他に error.tsx (Error Boundary), not-found.tsx (404)。",
    ],
    explanation: {
      summary:
        "`loading.tsx` を配置すると Next.js が自動で Suspense でラップし、データ取得中は loading.tsx が表示される。`error.tsx` / `not-found.tsx` も同様の規約。",
      reason:
        "App Router の規約ファイル群: `page.tsx` (ページ)、`layout.tsx` (レイアウト)、`loading.tsx` (Suspense fallback)、`error.tsx` (Error Boundary)、`not-found.tsx` (404)、`route.ts` (API)、`default.tsx` (Parallel Routes 用)。",
      codeExample:
        "// app/posts/loading.tsx\nexport default function Loading() {\n  return <div>Loading posts...</div>\n}\n\n// app/posts/error.tsx (Client Component 必須)\n'use client'\nexport default function Error({ error, reset }: {\n  error: Error & { digest?: string }\n  reset: () => void\n}) {\n  return (\n    <div>\n      <p>Error: {error.message}</p>\n      <button onClick={reset}>Retry</button>\n    </div>\n  )\n}\n\n// app/posts/not-found.tsx\nexport default function NotFound() {\n  return <p>Post not found</p>\n}",
    },
  },
  {
    id: "next-013",
    categoryId: "nextjs-basics",
    difficulty: "intermediate",
    type: "choice",
    question: "Next.js で画像を最適化する Image コンポーネントの import は？",
    choices: [
      "import Image from 'next/image'",
      "import { Image } from 'next'",
      "import Image from 'react'",
      "<img> をそのまま使う",
    ],
    answerIndex: 0,
    hints: [
      "next/image から default export。",
      "width / height 必須 (CLS 防止)。",
      "自動で WebP/AVIF 変換 + 画像サイズ最適化。",
    ],
    explanation: {
      summary:
        "`import Image from 'next/image'` で画像最適化コンポーネント。自動で WebP/AVIF 変換、サイズに応じた srcSet、lazy loading、CLS 防止 (width/height 必須)。",
      reason:
        "Web のパフォーマンス最適化で最も効くのが画像最適化。next/image は自動で複数フォーマット・サイズを生成。`<img>` をそのまま使うと最適化されない。`priority` で LCP 用、`placeholder='blur'` でブラーアップ。",
      codeExample:
        "import Image from 'next/image'\n\n// 静的画像\nimport hero from '@/public/hero.jpg'\n<Image src={hero} alt='Hero' placeholder='blur' priority />\n\n// リモート画像\n<Image\n  src='https://cdn.example.com/img.jpg'\n  alt='...'\n  width={800}\n  height={400}\n  sizes='(max-width: 768px) 100vw, 800px'\n/>\n\n// next.config.js でリモート画像を許可\nmodule.exports = {\n  images: {\n    remotePatterns: [\n      { protocol: 'https', hostname: 'cdn.example.com' }\n    ]\n  }\n}",
    },
  },
  {
    id: "next-014",
    categoryId: "nextjs-basics",
    difficulty: "advanced",
    type: "choice",
    question:
      "Next.js で『同一ページ内に複数の独立した非同期領域を並列描画』する機能は？",
    choices: [
      "Parallel Routes (@folder / Slot)",
      "Multi-Render",
      "Concurrent Page",
      "Split Routes",
    ],
    answerIndex: 0,
    hints: [
      "@フォルダ名 のディレクトリ (Slot) を使う。",
      "Layout の props に Slot 名で渡される。",
      "ダッシュボードや分割画面に使う。",
    ],
    explanation: {
      summary:
        "Parallel Routes: `app/dashboard/@team/page.tsx` のような `@slot` ディレクトリで Layout に複数の独立した children を渡せる。各 Slot は独自に loading / error 状態を持つ。",
      reason:
        "ダッシュボードで複数のウィジェットを並列表示、モーダル (intercepting routes との組合せ)、A/B テストなどに有用。",
      codeExample:
        "app/dashboard/\n  layout.tsx          ← props として @team, @analytics を受ける\n  page.tsx\n  @team/page.tsx\n  @analytics/page.tsx\n\n// layout.tsx\nexport default function Layout({\n  children,\n  team,\n  analytics\n}: {\n  children: React.ReactNode\n  team: React.ReactNode\n  analytics: React.ReactNode\n}) {\n  return (\n    <div className='grid grid-cols-3 gap-4'>\n      <main className='col-span-3'>{children}</main>\n      <div>{team}</div>\n      <div className='col-span-2'>{analytics}</div>\n    </div>\n  )\n}",
    },
  },
  {
    id: "next-015",
    categoryId: "nextjs-basics",
    difficulty: "advanced",
    type: "choice",
    question:
      "Next.js Server Action と Client Form の正しい統合パターンは？",
    choices: [
      "Server Action は廃止",
      "Server Action を form の action prop に渡す + useFormStatus / useFormState (useActionState) で状態管理",
      "API Route 必須",
      "useEffect で POST",
    ],
    answerIndex: 1,
    hints: [
      "form の action 属性に Server Action 関数を渡す。",
      "Client では useFormStatus でローディング状態、useActionState で結果。",
      "JS 無効でも動作 (Progressive Enhancement)。",
    ],
    explanation: {
      summary:
        "`<form action={serverAction}>` + Client で `useFormStatus` (`{ pending }`) と `useActionState` (旧 `useFormState`) で状態管理。JS が無効でも動く Progressive Enhancement。",
      reason:
        "Rails の form_with と似た開発体験。Server Action で DB 操作 + revalidatePath で再検証 + redirect。useFormStatus / useActionState はそのアクションが進行中か / エラーが起きたかを管理。",
      codeExample:
        "// Server Action\n'use server'\nasync function createPost(prev: any, formData: FormData) {\n  const title = formData.get('title') as string\n  if (!title) return { error: 'Title required' }\n  await db.post.create({ data: { title } })\n  revalidatePath('/posts')\n  redirect('/posts')\n}\n\n// Client Form\n'use client'\nimport { useActionState } from 'react'\nimport { useFormStatus } from 'react-dom'\n\nfunction SubmitButton() {\n  const { pending } = useFormStatus()\n  return <button disabled={pending}>{pending ? '...' : 'Submit'}</button>\n}\n\nexport function Form() {\n  const [state, action] = useActionState(createPost, { error: null })\n  return (\n    <form action={action}>\n      <input name='title' />\n      {state.error && <p>{state.error}</p>}\n      <SubmitButton />\n    </form>\n  )\n}",
    },
  },
  {
    id: "next-016",
    categoryId: "nextjs-basics",
    difficulty: "advanced",
    type: "choice",
    question:
      "Next.js でストリーミング SSR を実現する仕組みは？",
    choices: [
      "WebSocket 必須",
      "クライアント側で組み立て",
      "Next.js 15+ で廃止",
      "<Suspense> でラップしたコンポーネントが非同期解決され、HTML を順次配信",
    ],
    answerIndex: 3,
    hints: [
      "Suspense と Server Component の組合せ。",
      "サーバーから HTML をチャンクで配信。",
      "ページ全体待たずに見える部分から表示。",
    ],
    explanation: {
      summary:
        "Server Component + `<Suspense>` で自動的にストリーミング SSR。準備できた部分から順次 HTML を配信、Suspense 境界の遅い部分は fallback を先に送って後で置換。",
      reason:
        "ページ全体のデータ取得を待たずに HTML を配信開始 → TTFB / LCP が改善。Suspense 境界の中だけ非同期で順次解決。React 18 + Next.js App Router の真骨頂。",
      codeExample:
        "// app/dashboard/page.tsx\nexport default function Dashboard() {\n  return (\n    <div>\n      <h1>Dashboard</h1>\n      <Suspense fallback={<UserStatsSkeleton />}>\n        <UserStats />\n      </Suspense>\n      <Suspense fallback={<ChartsSkeleton />}>\n        <Charts />\n      </Suspense>\n    </div>\n  )\n}\n\n// UserStats が遅くても Charts は先に表示される\nasync function UserStats() {\n  const data = await slowQuery()\n  return <div>{...}</div>\n}",
    },
  },
  {
    id: "next-017",
    categoryId: "nextjs-basics",
    difficulty: "advanced",
    type: "choice",
    question:
      "Next.js で SEO 用メタデータを設定する標準 API は？",
    choices: [
      "<MetaTag>",
      "export const metadata / export function generateMetadata (動的)",
      "useMeta() Hook",
      "<Helmet />",
    ],
    answerIndex: 1,
    hints: [
      "App Router の規約 export。",
      "page.tsx / layout.tsx で metadata を export。",
      "動的な値 (DB から取得) は generateMetadata 関数。",
    ],
    explanation: {
      summary:
        "App Router では `export const metadata = { ... }` (静的) または `export async function generateMetadata({ params })` (動的) で <head> を制御。",
      reason:
        "title / description / OG / Twitter / canonical / robots など主要なメタタグをすべて型安全に設定可能。動的な値は generateMetadata を async で書ける。",
      codeExample:
        "// 静的\nexport const metadata: Metadata = {\n  title: 'My Blog',\n  description: '...',\n  openGraph: {\n    title: 'My Blog',\n    images: ['/og.png']\n  }\n}\n\n// 動的 (記事ページなど)\nexport async function generateMetadata(\n  { params }: { params: Promise<{ slug: string }> }\n): Promise<Metadata> {\n  const { slug } = await params\n  const post = await db.post.findUnique({ where: { slug } })\n  return {\n    title: post?.title,\n    description: post?.excerpt,\n    openGraph: { images: [post?.cover ?? '/default-og.png'] }\n  }\n}",
    },
  },
  {
    id: "next-018",
    categoryId: "nextjs-basics",
    difficulty: "advanced",
    type: "choice",
    question:
      "Next.js でデータの即時 UI 反映 (UI を先に更新 + あとで実 API 反映) を実現する Hook は？",
    choices: [
      "useImmediate",
      "useFutureState",
      "useFast",
      "useOptimistic (React 19+)",
    ],
    answerIndex: 3,
    hints: [
      "React 19+ で導入された Hook。",
      "Optimistic UI (楽観的更新) を簡単に。",
      "Server Action と組み合わせて使う。",
    ],
    explanation: {
      summary:
        "`useOptimistic` (React 19+) で楽観的 UI 更新。Server Action の応答を待たずに UI を更新 → 失敗時は自動でロールバック。",
      reason:
        "コメント投稿、いいね、削除等で UX が劇的に改善 (待ち時間ゼロに感じる)。Server Action と組み合わせて使う。Suspense と Transitions の延長線上にある React 19 の目玉機能。",
      codeExample:
        "'use client'\nimport { useOptimistic } from 'react'\n\nexport function CommentList({ comments }: { comments: Comment[] }) {\n  const [optimistic, addOptimistic] = useOptimistic<Comment[], string>(\n    comments,\n    (state, newCommentText) => [\n      ...state,\n      { id: 'temp', text: newCommentText, pending: true }\n    ]\n  )\n\n  async function add(formData: FormData) {\n    const text = formData.get('text') as string\n    addOptimistic(text)              // 即座に UI 更新\n    await addCommentAction(text)     // サーバー処理\n  }\n\n  return (\n    <>\n      {optimistic.map(c => (\n        <p key={c.id} style={{ opacity: c.pending ? 0.5 : 1 }}>{c.text}</p>\n      ))}\n      <form action={add}>\n        <input name='text' />\n      </form>\n    </>\n  )\n}",
    },
  },
  {
    id: "next-019",
    categoryId: "nextjs-basics",
    difficulty: "advanced",
    type: "choice",
    question:
      "Next.js で『ヘッダーやリンクから 1 回限り表示するモーダル』を URL ベースで作る機能は？",
    choices: [
      "そのような機能はない",
      "Intercepting Routes (@modal + (.) ファイル名)",
      "Modal Component のみ",
      "Dialog API",
    ],
    answerIndex: 1,
    hints: [
      "URL を変えながらモーダルを開く仕組み。",
      "リンク経由は『モーダル』、URL 直接は『フルページ』。",
      "Parallel Routes + Intercepting Routes の組合せ。",
    ],
    explanation: {
      summary:
        "Intercepting Routes (`(..)` `(.)` `(...)` プレフィックス) で『同じ URL でも導線によって異なる UI』を実現。Instagram のような『フィードから画像クリックでモーダル、直接 URL ならフルページ』を作れる。",
      reason:
        "ユーザー体験向上の高度な機能。`@modal/(...)photos/[id]/page.tsx` で『リンク経由 = モーダル』『直接アクセス = フルページ』。URL が共有可能なまま、UX を変えられる。",
      codeExample:
        "app/\n  layout.tsx                      ← children + modal Slot を受ける\n  @modal/\n    default.tsx                   ← デフォルト (null)\n    (.)photos/[id]/page.tsx       ← モーダル UI\n  photos/[id]/page.tsx            ← 直接アクセス時のフルページ\n\n// layout.tsx\nexport default function Layout({\n  children, modal\n}: { children: React.ReactNode; modal: React.ReactNode }) {\n  return (\n    <>\n      {children}\n      {modal}\n    </>\n  )\n}",
    },
  },
  {
    id: "next-020",
    categoryId: "nextjs-basics",
    difficulty: "advanced",
    type: "choice",
    question:
      "Next.js アプリの本番デプロイ先として推奨されるのは？",
    choices: [
      "本番では使えない",
      "AWS Lambda 必須",
      "Vercel (公式、最適化フル活用) / Netlify / Cloudflare Pages / 自前 Node",
      "Vercel のみ可能",
    ],
    answerIndex: 2,
    hints: [
      "Vercel は Next.js の開発元なので最も最適化。",
      "他のプラットフォームでも動くが、機能差あり (ISR, Edge Functions 等)。",
      "自前 Node でも standalone ビルドで動かせる。",
    ],
    explanation: {
      summary:
        "推奨: Vercel (最適化フル活用)。代替: Netlify / Cloudflare Pages (Edge 強み) / AWS Amplify / 自前 Node (`output: 'standalone'` でコンテナ化)。",
      reason:
        "Vercel は Next.js 公式インフラなので ISR / Image Optimization / Edge Functions / Analytics 全てフル対応。Cloudflare は Edge Runtime に強い。自前 Node は柔軟だが、ISR の実装に追加作業必要。",
      codeExample:
        "// 自前 Node デプロイの場合\n// next.config.js\nmodule.exports = {\n  output: 'standalone',   // Dockerfile に最適\n  images: {\n    unoptimized: false    // sharp が必要\n  }\n}\n\n// Dockerfile (シンプル)\nFROM node:22-alpine AS build\nWORKDIR /app\nCOPY . .\nRUN npm ci && npm run build\n\nFROM node:22-alpine\nWORKDIR /app\nCOPY --from=build /app/.next/standalone ./\nCOPY --from=build /app/.next/static ./.next/static\nCOPY --from=build /app/public ./public\nCMD ['node', 'server.js']",
    },
  },
];
