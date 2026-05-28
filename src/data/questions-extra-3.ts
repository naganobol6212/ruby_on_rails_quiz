import type { Question } from "@/lib/types";

/**
 * 拡充クイズ (第 3 弾): 残り 6 カテゴリを 20 問に底上げ (+60 問)
 * - js-basics +5 (js-016〜020)
 * - js-functions +10 (jsf-011〜020)
 * - js-async +10 (jsa-011〜020)
 * - sql-basics +10 (sql-026〜035)
 * - sql-joins +12 (sql-036〜047)
 * - sql-advanced +13 (sql-048〜060)
 */
export const extraQuestions3: Question[] = [
  // ===========================================================================
  // 🟨 JS 基礎 拡張 (js-016 〜 js-020)
  // ===========================================================================
  {
    id: "js-016",
    categoryId: "js-basics",
    difficulty: "intermediate",
    type: "choice",
    question:
      "次の式 `a ?? b` (nullish coalescing) と `a || b` (logical OR) の違いは？",
    choices: [
      "?? は型エラー",
      "|| は廃止",
      "?? は null/undefined の時だけ b を返す。|| は falsy (0/'')も b を返す",
      "完全に同じ",
    ],
    answerIndex: 2,
    hints: [
      "0 や '' を有効な値として扱いたい時に ?? を使う。",
      "|| は『falsy ならフォールバック』、?? は『nullish ならフォールバック』。",
      "ES2020 で導入。",
    ],
    explanation: {
      summary:
        "`??` は null / undefined のみフォールバック、`||` は全 falsy (0, '', false, NaN, null, undefined) でフォールバック。0 や '' を許容する設定では `??` 必須。",
      reason:
        "`const port = config.port || 3000` だと config.port が 0 の時に 3000 になり意図しない。`config.port ?? 3000` なら 0 を保持。優先順位の関係で `(a ?? b) || c` のように `||`/`&&` と混ぜる時は括弧必須 (構文エラー)。`??=` 代入版もある (`x ??= 5` で nullish 時のみ代入)。",
      codeExample:
        "// || (falsy なら b)\nconsole.log(0 || 'default')        // 'default' ← 0 を捨てる\nconsole.log('' || 'default')       // 'default'\nconsole.log(false || 'default')    // 'default'\nconsole.log(null || 'default')     // 'default'\n\n// ?? (nullish なら b)\nconsole.log(0 ?? 'default')        // 0 ← 残る\nconsole.log('' ?? 'default')       // ''\nconsole.log(false ?? 'default')    // false\nconsole.log(null ?? 'default')     // 'default'\nconsole.log(undefined ?? 'default')// 'default'\n\n// 実用: 設定のデフォルト\nconst port = config.port ?? 3000   // 0 を許容\nconst name = user.name || 'Anonymous'  // '' をデフォルト扱い\n\n// 代入版\nlet x = null\nx ??= 5      // x は 5\nlet y = 0\ny ??= 5      // y は 0 (代入されない)\n\n// ?? と || / && は混ぜると syntax error (括弧必須)\n// a ?? b || c                       // SyntaxError\n(a ?? b) || c                         // OK",
    },
  },
  {
    id: "js-017",
    categoryId: "js-basics",
    difficulty: "intermediate",
    type: "choice",
    question:
      "`user?.address?.city` (optional chaining) の挙動として正しいのは？",
    choices: [
      "user が null だと TypeError",
      "全部 string で連結",
      "city が null なら例外",
      "user / user.address のどれかが null/undefined なら全体が undefined、エラーにならない",
    ],
    answerIndex: 3,
    hints: [
      "?. は左側が nullish なら短絡して undefined を返す。",
      "?. は array / function 呼び出しにも使える (arr?.[0]、fn?.())。",
      "ES2020 で導入。",
    ],
    explanation: {
      summary:
        "Optional chaining `?.` は左辺が null/undefined なら短絡して undefined を返す。深いネストの存在チェックを簡潔に。`?.()` / `?.[]` でメソッド呼び出し / 配列アクセスにも。",
      reason:
        "従来の `user && user.address && user.address.city` の冗長さを解消。注意: `??` と組み合わせて `user?.name ?? 'Anonymous'` でデフォルト値。代入の左辺には使えない (`obj?.prop = 1` は syntax error)。delete は OK (`delete obj?.prop`)。",
      codeExample:
        "const user = { address: { city: 'Tokyo' } }\nconst empty = {}\n\nuser?.address?.city       // 'Tokyo'\nempty?.address?.city      // undefined (エラーにならない)\nnull?.address?.city       // undefined\nundefined?.foo?.bar       // undefined\n\n// 配列アクセス\nconst arr = [{ name: 'Alice' }]\narr?.[0]?.name            // 'Alice'\narr?.[5]?.name            // undefined\n\n// メソッド呼び出し\nconst obj = { foo: () => 42 }\nobj.foo?.()               // 42\nobj.bar?.()               // undefined (bar が無くてもエラーにならない)\n\n// 組み合わせ\nconst name = user?.profile?.name ?? 'Anonymous'\nconst port = config?.server?.port ?? 3000\n\n// 短絡: 左が undefined なら右は評価されない\nlet count = 0\nundefined?.foo(count++)   // count++ は実行されない\nconsole.log(count)        // 0",
    },
  },
  {
    id: "js-018",
    categoryId: "js-basics",
    difficulty: "intermediate",
    type: "choice",
    question:
      "JS で『オブジェクトを deep clone する』モダンな標準 API は？",
    choices: [
      "Object.assign({}, obj)",
      "JSON.parse(JSON.stringify(obj))",
      "spread {...obj}",
      "structuredClone(obj) (ES2022、ブラウザ + Node 17+ 標準)",
    ],
    answerIndex: 3,
    hints: [
      "Object.assign や spread は『1 階層だけ』(shallow copy)。",
      "JSON ハックは関数 / Date / Map / Set / undefined を失う。",
      "structuredClone は循環参照 OK、Date / Map / Set / TypedArray OK。",
    ],
    explanation: {
      summary:
        "`structuredClone(obj)` は ES2022 で標準化された deep clone API。循環参照対応、Date / Map / Set / TypedArray / ArrayBuffer 等もサポート。`{...obj}` は shallow copy、JSON hack は型情報を失う。",
      reason:
        "Object.assign / spread は 1 階層だけ複製 → ネストオブジェクトは参照共有 (mutate で元も変わる)。`JSON.parse(JSON.stringify(x))` は function/Date/undefined/Symbol/BigInt/Map/Set を失う + 循環参照で例外。structuredClone は HTML Living Standard 由来で postMessage と同じアルゴリズム。注意: 関数 / DOM ノード / Error の一部 / WeakMap は clone 不可。",
      codeExample:
        "const obj = {\n  name: 'Alice',\n  date: new Date(),\n  tags: new Set(['a', 'b']),\n  meta: { id: 1, nested: { x: 10 } },\n}\n\n// ❌ shallow copy (ネストは共有)\nconst s1 = { ...obj }\ns1.meta.nested.x = 999\nobj.meta.nested.x                  // 999 ← 元も変わる\n\n// ❌ JSON hack (型情報を失う)\nconst s2 = JSON.parse(JSON.stringify(obj))\ns2.date instanceof Date            // false (string になる)\ns2.tags                            // {} (Set が消える)\n\n// ✅ structuredClone (ES2022)\nconst s3 = structuredClone(obj)\ns3.date instanceof Date            // true\ns3.tags instanceof Set             // true\ns3.meta.nested.x = 999\nobj.meta.nested.x                  // 10 ← 元は変わらない\n\n// 循環参照\nconst circular = { a: 1 }\ncircular.self = circular\nstructuredClone(circular)          // OK\nJSON.stringify(circular)            // TypeError\n\n// ❌ 関数は clone 不可\nstructuredClone({ fn: () => {} })  // DataCloneError\n\n// 別解: lodash の cloneDeep (function も対応)\nimport { cloneDeep } from 'lodash-es'\ncloneDeep(obj)                      // function も含めて clone",
    },
  },
  {
    id: "js-019",
    categoryId: "js-basics",
    difficulty: "advanced",
    type: "choice",
    question:
      "JS の Symbol の主な用途として正しいのは？",
    choices: [
      "オブジェクトのキー衝突を避ける一意な識別子 / well-known Symbol で iteration 等の挙動を customize",
      "数値計算の高速化",
      "文字列の代替",
      "DOM 操作",
    ],
    answerIndex: 0,
    hints: [
      "Symbol('x') と Symbol('x') は別の値 (一意)。",
      "Symbol.iterator / Symbol.asyncIterator / Symbol.toPrimitive 等は仕様で予約。",
      "オブジェクトキーとして使うとライブラリ間で衝突しない。",
    ],
    explanation: {
      summary:
        "Symbol は『一意な識別子』。同じ description でも `Symbol('x') !== Symbol('x')`。オブジェクトのキー衝突回避 + Well-Known Symbol (`Symbol.iterator`) で言語仕様の挙動をカスタマイズ。",
      reason:
        "ライブラリが既存オブジェクトに『内部用プロパティ』を付ける時、Symbol キーなら他コードと衝突しない。`Object.keys()` / `for...in` / `JSON.stringify` で列挙されない → 隠しプロパティとして使える (見るには `Object.getOwnPropertySymbols()`)。Well-Known Symbol で `for...of` 対応 (Symbol.iterator)、暗黙変換 (Symbol.toPrimitive) などをカスタムクラスで実装可能。Symbol.for/keyFor はグローバルレジストリ。",
      codeExample:
        "// 一意性\nconst a = Symbol('id')\nconst b = Symbol('id')\na === b                            // false (description が同じでも別)\nString(a)                          // 'Symbol(id)'\n\n// オブジェクトの隠しキー\nconst INTERNAL = Symbol('internal')\nconst user = { name: 'Alice', [INTERNAL]: 'secret' }\nObject.keys(user)                  // ['name']\nJSON.stringify(user)               // '{\"name\":\"Alice\"}' (Symbol 無視)\nObject.getOwnPropertySymbols(user) // [Symbol(internal)] (取得)\n\n// Well-Known Symbol\nclass Range {\n  constructor(start, end) { this.start = start; this.end = end }\n  [Symbol.iterator]() {\n    let i = this.start\n    const end = this.end\n    return {\n      next() {\n        return i <= end ? { value: i++, done: false } : { value: undefined, done: true }\n      }\n    }\n  }\n}\n\nfor (const n of new Range(1, 5)) console.log(n)  // 1 2 3 4 5\n[...new Range(1, 3)]               // [1, 2, 3]\n\n// Symbol.toPrimitive (型変換のフック)\nclass Temperature {\n  constructor(c) { this.celsius = c }\n  [Symbol.toPrimitive](hint) {\n    if (hint === 'number') return this.celsius\n    if (hint === 'string') return `${this.celsius}°C`\n    return this.celsius                    // default\n  }\n}\nconst t = new Temperature(25)\n+t                                  // 25 (number)\n`${t}`                              // '25°C' (string)\n\n// グローバル Symbol レジストリ\nconst x = Symbol.for('app.user')\nconst y = Symbol.for('app.user')\nx === y                             // true (グローバル共有)",
    },
  },
  {
    id: "js-020",
    categoryId: "js-basics",
    difficulty: "intermediate",
    type: "choice",
    question:
      "`typeof null` と `null instanceof Object` の結果は？",
    choices: [
      "両方 true",
      "'object' と false (typeof null は歴史的バグ、instanceof は false)",
      "'null' と true",
      "'undefined' と false",
    ],
    answerIndex: 1,
    hints: [
      "typeof null === 'object' は JS の有名な歴史的バグ。",
      "instanceof は prototype チェーンを辿るが null は対象外。",
      "null 判定は `=== null` で。",
    ],
    explanation: {
      summary:
        "`typeof null === 'object'` (歴史的バグ、修正されると既存コードが壊れるので永久に維持)。`null instanceof Object` は false (null は prototype を持たない)。null 判定は `x === null` か `x == null` (null + undefined 両方)。",
      reason:
        "typeof の主要結果: 'undefined' / 'boolean' / 'number' / 'bigint' / 'string' / 'symbol' / 'function' / 'object' (これに null と配列が含まれる)。Array は `Array.isArray(x)` で判定 (typeof は 'object')。`typeof undeclaredVar === 'undefined'` で未宣言変数を安全にチェック可 (例外にならない唯一の例外)。instanceof は prototype.constructor を辿る (iframe またぎだと別ウィンドウの Object と一致しない罠も)。",
      codeExample:
        "// typeof\ntypeof undefined          // 'undefined'\ntypeof null               // 'object'  ← 歴史的バグ\ntypeof true               // 'boolean'\ntypeof 42                 // 'number'\ntypeof 42n                // 'bigint'\ntypeof 'hi'               // 'string'\ntypeof Symbol()           // 'symbol'\ntypeof function() {}      // 'function'\ntypeof {}                 // 'object'\ntypeof []                 // 'object'  ← 配列も object\ntypeof undeclaredVar      // 'undefined' (例外にならない)\n\n// instanceof\n[] instanceof Array              // true\n[] instanceof Object              // true (配列は object のサブ)\n{} instanceof Object              // true\nnull instanceof Object            // false\nundefined instanceof Object       // false\n\n// 判定の慣用句\nx === null                        // null だけ\nx === undefined                   // undefined だけ\nx == null                         // null OR undefined (緩い比較、推奨されることも)\nArray.isArray(x)                  // 配列か (typeof でなく)\nObject.prototype.toString.call(x) // '[object Array]' 等、最も正確\n\n// typeof でクラスを判定できない (instanceof を)\nclass Foo {}\nconst f = new Foo()\ntypeof f                          // 'object'\nf instanceof Foo                  // true\nf.constructor === Foo             // true (こちらが iframe またぎでも安全)\nf.constructor.name                // 'Foo'",
    },
  },

  // ===========================================================================
  // 🟨 JS 関数 拡張 (jsf-011 〜 jsf-020)
  // ===========================================================================
  {
    id: "jsf-011",
    categoryId: "js-functions",
    difficulty: "intermediate",
    type: "choice",
    question: "次のコードの実行結果は？",
    code: "const obj = {\n  name: 'Alice',\n  greet: function() { return `Hello ${this.name}` },\n  greetArrow: () => `Hello ${this.name}`\n}\nconsole.log(obj.greet())\nconsole.log(obj.greetArrow())",
    choices: [
      "'Hello Alice' と 'Hello undefined' — アロー関数は this を bind しない (上位スコープの this)",
      "両方 'Hello Alice'",
      "両方 'Hello undefined'",
      "型エラー",
    ],
    answerIndex: 0,
    hints: [
      "function() の this は呼び出し方で決まる (obj.greet() なら obj)。",
      "アロー関数は『定義時の this』を継承 (lexical this)。",
      "メソッド定義にアロー関数を使うと罠。",
    ],
    explanation: {
      summary:
        "アロー関数は this を自前で持たず、定義時の外側スコープの this を継承 (lexical this)。`obj.greetArrow()` の this は obj ではなく外側 (module top-level なら undefined / strict)。",
      reason:
        "function() の this: 呼び出し方で決まる (`obj.f()` なら obj、`f()` なら undefined、`new F()` なら新インスタンス)。アローの this: 定義位置で静的決定 → setTimeout / map のコールバックで this を保ちたい時に有用。逆にオブジェクトメソッド / class prototype メソッドにアロー関数を使うと罠。",
      codeExample:
        "// function 形式のメソッド\nconst obj1 = { count: 0, inc: function() { this.count++ } }\nobj1.inc()                              // this = obj1, count: 1\nconst f = obj1.inc\nf()                                     // this = undefined (strict)\n\n// アロー関数 (this を継承)\nclass Timer {\n  constructor() { this.seconds = 0 }\n  start() {\n    setInterval(() => { this.seconds++ }, 1000)   // this = Timer\n  }\n  startBad() {\n    setInterval(function() { this.seconds++ }, 1000)  // this = undefined\n  }\n}\n\n// React class field + arrow で this を bind\nclass Button extends React.Component {\n  handleClick = () => { this.setState({ ... }) }\n  render() { return <button onClick={this.handleClick}>Click</button> }\n}",
    },
  },
  {
    id: "jsf-012",
    categoryId: "js-functions",
    difficulty: "intermediate",
    type: "choice",
    question: "`fn.call(ctx, a, b)`、`fn.apply(ctx, [a, b])`、`fn.bind(ctx, a)` の違いは？",
    choices: [
      "call は廃止",
      "call/apply は即実行 (call は引数を個別、apply は配列)、bind は『新関数を返す』",
      "全部同じ",
      "bind は即実行",
    ],
    answerIndex: 1,
    hints: [
      "call: 個別引数で即実行。apply: 配列引数で即実行。bind: this 固定の新関数を返す。",
      "spread (`fn(...args)`) で apply の用途は減った。",
      "bind は部分適用も可能。",
    ],
    explanation: {
      summary:
        "`fn.call(ctx, ...args)` と `fn.apply(ctx, args)` は即実行。call は引数を個別、apply は配列で渡す。`fn.bind(ctx, ...preset)` は『this と一部引数を固定した新関数』を返す (実行しない)。",
      reason:
        "用途: call / apply は他オブジェクトのメソッドを借りる (`Array.prototype.slice.call(arrayLike)`)。bind はコールバックに渡す時に this 固定。spread (`fn(...args)`) で apply の必要性は減った。bind の戻り値は新関数 (毎回新参照 → React 依存配列の罠)。",
      codeExample:
        "function greet(g, p) { return `${g}, ${this.name}${p}` }\nconst alice = { name: 'Alice' }\n\ngreet.call(alice, 'Hello', '!')           // 'Hello, Alice!'\ngreet.apply(alice, ['Hello', '!'])         // 'Hello, Alice!'\nconst greetAlice = greet.bind(alice)\ngreetAlice('Hi', '.')                       // 'Hi, Alice.'\n\n// bind は部分適用\nconst sayHelloAlice = greet.bind(alice, 'Hello')\nsayHelloAlice('!')                          // 'Hello, Alice!'\n\n// 他オブジェクトのメソッドを借りる\nArray.prototype.slice.call(arguments)\n\n// 現代は spread / rest で代用\nMath.max(...arr)                            // apply の代替\n\n// bind の罠: 毎回新関数\nfn.bind(this) === fn.bind(this)             // false\n// → useEffect の依存配列に bind を入れると無限ループ",
    },
  },
  {
    id: "jsf-013",
    categoryId: "js-functions",
    difficulty: "intermediate",
    type: "choice",
    question: "次のコードのカウンタは何を出力する？",
    code: "function makeCounter() {\n  let count = 0\n  return function() { count++; return count }\n}\nconst c = makeCounter()\nconsole.log(c(), c(), c())",
    choices: [
      "0, 0, 0",
      "エラー",
      "1, 2, 3 — クロージャで count が保持される",
      "1, 1, 1 — 毎回 0 にリセット",
    ],
    answerIndex: 2,
    hints: [
      "内側の関数が外側の変数を参照し続ける = クロージャ。",
      "makeCounter の呼び出しが終わっても count は GC されない。",
      "プライベート状態を関数で表現する古典パターン。",
    ],
    explanation: {
      summary:
        "**クロージャ**: 内側の関数が外側スコープの変数を『閉じ込めて』参照し続ける。`makeCounter()` 終了後も count は残り、返された関数からアクセス可能。プライベート状態の実現手段。",
      reason:
        "JS の関数は『定義された場所の lexical scope』を参照可能 → 外側の変数を捕捉。Module パターン / debounce / メモ化など多くのパターンの基礎。注意: var ループ罠 → let で各反復ごとに新スコープ。メモリリーク (DOM 要素を捕捉した closure が GC されない) にも注意。",
      codeExample:
        "// プライベート状態\nfunction makeCounter() {\n  let count = 0\n  return { inc: () => ++count, get: () => count }\n}\nconst c = makeCounter()\nc.inc(); c.inc()\nc.get()                                // 2\nc.count                                // undefined (アクセス不可)\n\n// var ループ罠\nfor (var i = 0; i < 3; i++) {\n  setTimeout(() => console.log(i), 100)\n}\n// 3 3 3 (全部同じ i)\n\nfor (let i = 0; i < 3; i++) {\n  setTimeout(() => console.log(i), 100)\n}\n// 0 1 2\n\n// debounce\nfunction debounce(fn, ms) {\n  let timer\n  return function(...args) {\n    clearTimeout(timer)\n    timer = setTimeout(() => fn(...args), ms)\n  }\n}\n\n// メモ化\nfunction memoize(fn) {\n  const cache = new Map()\n  return (arg) => cache.has(arg) ? cache.get(arg) : (cache.set(arg, fn(arg)), cache.get(arg))\n}",
    },
  },
  {
    id: "jsf-014",
    categoryId: "js-functions",
    difficulty: "intermediate",
    type: "choice",
    question: "次のコードの結果は？",
    code: "const sum = [1, 2, 3, 4]\n  .filter(n => n % 2 === 0)\n  .map(n => n * 10)\n  .reduce((acc, n) => acc + n, 0)\nconsole.log(sum)",
    choices: ["100", "20", "0", "60"],
    answerIndex: 3,
    hints: [
      "filter で偶数 → [2, 4]。",
      "map で 10 倍 → [20, 40]。",
      "reduce で合計 → 60。",
    ],
    explanation: {
      summary:
        "[1,2,3,4] → filter で [2,4] → map で [20,40] → reduce で 60。**filter / map / reduce** は配列処理の中心 3 大高階関数。すべてイミュータブル (元配列を変えず新配列を返す)。",
      reason:
        "reduce は最も汎用 (filter / map も reduce で実装可能)。`reduce(fn, initialValue)` の初期値を省略すると最初の要素が acc になる (空配列で省略すると TypeError)。チェーンは毎回新配列を作るので大量データだと遅い → for ループ or transducer / generator で。",
      codeExample:
        "const nums = [1, 2, 3, 4, 5]\n\n// filter / map / reduce\nnums.filter(n => n > 2)                // [3, 4, 5]\nnums.filter(Boolean)                    // truthy のみ\nnums.map(n => n * 2)                    // [2, 4, 6, 8, 10]\nnums.reduce((a, n) => a + n, 0)        // 15\n\n// group by (reduce)\nconst users = [{ role: 'admin' }, { role: 'user' }, { role: 'admin' }]\nusers.reduce((acc, u) => {\n  ;(acc[u.role] ??= []).push(u)\n  return acc\n}, {})\n\n// その他頻出\nnums.find(n => n > 3)                   // 4\nnums.some(n => n > 4)                   // true\nnums.every(n => n > 0)                  // true\nnums.flat()                             // ネスト平坦化\nnums.flatMap(n => [n, n * 2])         // map + flat",
    },
  },
  {
    id: "jsf-015",
    categoryId: "js-functions",
    difficulty: "intermediate",
    type: "choice",
    question: "デフォルト引数 + rest parameter で関数を書く時の正しい構文は？",
    choices: [
      "function f(a, b = 10, ...rest) {} — rest は最後、デフォルト引数の後",
      "function f(...rest, a, b = 10) {}",
      "function f(a = 10, b, ...rest, c) {}",
      "function f(rest..., a) {}",
    ],
    answerIndex: 0,
    hints: [
      "rest parameter は必ず引数の末尾に 1 つだけ。",
      "デフォルト引数は引数が undefined の時に評価。",
      "デフォルト値の中で前の引数を参照できる。",
    ],
    explanation: {
      summary:
        "`function f(a, b = default, ...rest)` の順序。rest は最後 1 つ。デフォルト引数は `undefined` の時に評価 (null は評価されない)。デフォルト値の中で前の引数を参照可能。",
      reason:
        "ES2015 導入。それまでは `b = b || 10` で 0 や '' を意図せず default に置き換える罠があった。`arguments` (古典) は Array ではない (slice 不可) + アロー関数では使えない → rest が現代の主流。`{ a, b = 10 } = {}` で分割代入のデフォルトも。",
      codeExample:
        "function greet(name = 'Anonymous', greeting = 'Hello') {\n  return `${greeting}, ${name}!`\n}\ngreet()                                // 'Hello, Anonymous!'\ngreet(undefined, 'Hi')                 // 'Hi, Anonymous!' (undefined で default)\ngreet(null)                            // 'Hello, null!' (null は default にならない)\n\n// 前の引数を参照\nfunction box(w = 1, h = w, d = w + h) { return { w, h, d } }\nbox(2)                                 // { w: 2, h: 2, d: 4 }\n\n// rest (配列)\nfunction sum(...nums) { return nums.reduce((a, b) => a + b, 0) }\nsum(1, 2, 3, 4)                        // 10\n\n// 分割代入のデフォルト\nfunction request({ url, method = 'GET', timeout = 5000 } = {}) { ... }\nrequest()                              // 全部 default\n\n// arguments (アローでは使えない)\nfunction old() { return Array.from(arguments) }\nconst arrow = (...args) => args        // 現代版\n\n// f.length\nfunction f(a, b, c = 10, d) {}\nf.length                               // 2 (default 以降を除く)",
    },
  },
  {
    id: "jsf-016",
    categoryId: "js-functions",
    difficulty: "intermediate",
    type: "choice",
    question: "次のコードはどちらが実行できる？",
    code: "console.log(decl())\nconsole.log(expr())\nfunction decl() { return 'decl' }\nconst expr = function() { return 'expr' }",
    choices: [
      "decl() が ReferenceError",
      "decl() は OK、expr() は ReferenceError (関数宣言は hoist されるが const は TDZ)",
      "両方 OK",
      "両方エラー",
    ],
    answerIndex: 1,
    hints: [
      "`function name() {}` は完全に巻き上げられる (定義込み)。",
      "`const x = function() {}` は const の TDZ で参照不可。",
      "let/const は宣言行まで TDZ。",
    ],
    explanation: {
      summary:
        "**関数宣言** (`function f() {}`) は完全 hoisting で先頭から呼べる。**関数式** (`const f = function() {}`) は const の Temporal Dead Zone で宣言前にアクセスすると ReferenceError。",
      reason:
        "var は宣言だけ巻き上げ (値は undefined)、let/const は巻き上げあり (TDZ で参照不可)、function 宣言は定義込みで完全巻き上げ、class 宣言は TDZ。**現代の慣習は const + arrow** で hoisting に依存しないコードを書く (読みやすい)。",
      codeExample:
        "// 関数宣言 (完全 hoist)\nconsole.log(add(1, 2))                 // 3\nfunction add(a, b) { return a + b }\n\n// 関数式 / arrow (TDZ)\nconsole.log(sub(1, 2))                 // ReferenceError\nconst sub = (a, b) => a - b\n\n// var の場合 (古典)\nconsole.log(mul)                       // undefined (var だけ巻き上げ)\nconsole.log(mul(2, 3))                 // TypeError\nvar mul = (a, b) => a * b\n\n// let / const の TDZ\nconsole.log(x)                         // ReferenceError\nlet x = 5\n\n// 推奨: 全部 const + arrow / function expression\nconst add = (a, b) => a + b\nconst process = function process(items) { ... }   // named function expr (stack trace 用)",
    },
  },
  {
    id: "jsf-017",
    categoryId: "js-functions",
    difficulty: "advanced",
    type: "choice",
    question: "IIFE (Immediately Invoked Function Expression) の主な用途は？",
    choices: [
      "型チェック",
      "ES2020 で導入",
      "関数を即実行 + スコープ分離 — ES Modules 登場前のグローバル汚染回避手段、現代は限定的",
      "高速化",
    ],
    answerIndex: 2,
    hints: [
      "(function() { ... })() の形。",
      "関数式を作って即呼び出し → 内部変数を外に漏らさない。",
      "ES6+ の block scope + Modules で出番は減ったが、UMD パターン等で見る。",
    ],
    explanation: {
      summary:
        "**IIFE** は `(function() { ... })()` の形で『関数を作って即実行』。スコープを作って変数を外に漏らさないために使われた (ES Modules 以前のグローバル汚染対策)。現代はモジュールシステムで代替可。",
      reason:
        "歴史的用途: jQuery プラグイン / UMD で `$` を渡して受ける、ライブラリ全体を 1 つの IIFE で囲む。現代でも便利な場面: top-level await 不可な環境で async 即実行 (`(async () => { await fetch(...) })()`)、レガシーコード理解には必須。",
      codeExample:
        "// 古典 IIFE\n(function() {\n  var privateVar = 'secret'\n  window.MyLib = { method: () => privateVar }\n})()\n\n// パラメータを渡す\n(function($) { $.fn.plugin = function() { ... } })(jQuery)\n\n// async IIFE (top-level await 不可な環境)\n;(async () => {\n  const data = await fetch('/api')\n  console.log(await data.json())\n})()\n\n// 現代の代替: block scope\n{\n  const privateVar = 'secret'\n  window.MyLib = { ... }\n}\n\n// 現代の代替: ES Modules\nconst privateVar = 'secret'           // module-private\nexport const publicMethod = () => privateVar\n\n// 現代の async: top-level await (ES2022, Module 限定)\nconst data = await fetch('/api')",
    },
  },
  {
    id: "jsf-018",
    categoryId: "js-functions",
    difficulty: "intermediate",
    type: "choice",
    question: "純粋関数 (pure function) の定義は？",
    choices: [
      "型注釈がある",
      "高速",
      "非同期",
      "同じ入力に対して常に同じ出力 + 副作用なし (外部状態を変えない / I/O しない)",
    ],
    answerIndex: 3,
    hints: [
      "数学的な関数 (f(x) = x + 1) と同じ性質。",
      "テスト容易 / 並列化容易 / メモ化可能 / Redux reducer の前提。",
      "Date.now()・Math.random()・グローバル状態に依存しない。",
    ],
    explanation: {
      summary:
        "**Pure function**: (1) 同じ引数 → 同じ戻り値 (referential transparency)、(2) 副作用なし (引数の mutate / グローバル変更 / I/O / 例外で停止 しない)。テスト・並列化・メモ化に強い。",
      reason:
        "副作用を一箇所に集中させる『関数型コア + 命令型シェル』が現代の設計指針。React の useState updater (`setState(prev => prev + 1)`)、Redux reducer、Vuex mutations 等が pure を要求。実用上 100% pure は無理 → 副作用境界を明確に。",
      codeExample:
        "// ✅ Pure\nfunction add(a, b) { return a + b }\nfunction double(arr) { return arr.map(x => x * 2) }   // 元配列を mutate しない\n\n// ❌ Impure (グローバル状態)\nlet total = 0\nfunction addToTotal(n) { total += n; return total }\n\n// ❌ Impure (引数 mutate)\nfunction pushItem(arr, item) { arr.push(item); return arr }\n// → 純粋版\nfunction pushPure(arr, item) { return [...arr, item] }\n\n// ❌ Impure (I/O / 時刻)\nfunction logTime(msg) { console.log(`[${Date.now()}] ${msg}`) }\n\n// Redux reducer (pure 必須)\nfunction reducer(state, action) {\n  switch (action.type) {\n    case 'INC': return { ...state, count: state.count + 1 }\n    case 'SET': return { ...state, count: action.value }\n    default: return state\n  }\n}",
    },
  },
  {
    id: "jsf-019",
    categoryId: "js-functions",
    difficulty: "advanced",
    type: "choice",
    question: "関数の `f.length` は何を返す？",
    choices: [
      "デフォルト値や rest より前の引数の数 (function f(a, b, c = 10, ...rest) なら 2)",
      "関数本体の行数",
      "総引数数",
      "実行回数",
    ],
    answerIndex: 0,
    hints: [
      "デフォルト値や rest parameter は length にカウントされない。",
      "関数のアリティ (引数の数) をメタプログラミングで使う。",
      "Express の error middleware は length === 4 で区別される。",
    ],
    explanation: {
      summary:
        "`f.length` は『デフォルト値や rest より前の必須引数の数』。`f(a, b, c = 10, ...r)` なら 2。Express の error handler が引数 4 つで判定されたり、curry 化ライブラリで利用。",
      reason:
        "メタプログラミング用途。curry 化、Express の middleware vs error handler 判定 (4 引数なら error handler)、DI コンテナ。`arguments.length` は『実際に渡された引数数』で別物。",
      codeExample:
        "function f1(a, b, c) {}\nf1.length                              // 3\nfunction f2(a, b = 10, c) {}\nf2.length                              // 1 (default 以降は数えない)\nfunction f3(a, ...rest) {}\nf3.length                              // 1\n\n// arguments.length は実際に渡された数\nfunction g(a, b, c) { return arguments.length }\ng(1)                                   // 1\ng(1, 2, 3, 4, 5)                       // 5\n\n// Express の判定\nfunction errorHandler(err, req, res, next) { ... }\nerrorHandler.length                    // 4 → error handler\nfunction middleware(req, res, next) { ... }\nmiddleware.length                      // 3 → 通常 middleware\n\n// 自作 curry\nfunction curry(fn) {\n  return function curried(...args) {\n    return args.length >= fn.length\n      ? fn(...args)\n      : (...more) => curried(...args, ...more)\n  }\n}",
    },
  },
  {
    id: "jsf-020",
    categoryId: "js-functions",
    difficulty: "advanced",
    type: "choice",
    question: "カリー化 (currying) と部分適用 (partial application) の違いは？",
    choices: [
      "部分適用は async 専用",
      "カリー化: N 引数関数を 1 引数関数の連鎖に分解。部分適用: 引数の一部を固定して引数の少ない関数を返す",
      "完全に同じ",
      "カリー化は廃止",
    ],
    answerIndex: 1,
    hints: [
      "curry(f)(a)(b)(c) — 1 つずつ。",
      "partial(f, a) — 一部固定、残りはまとめて渡せる。",
      "関数型プログラミングのコンポジションで活躍。",
    ],
    explanation: {
      summary:
        "**カリー化**: `add(a, b, c)` を `add(a)(b)(c)` に変換。**部分適用**: 引数の一部を先に固定して引数の少ない関数を作る。bind は部分適用の組込み機能。pipe / compose と組み合わせて関数合成。",
      reason:
        "関数型プログラミングの基礎。Ramda / lodash/fp の関数はデフォルトでカリー化済み (引数順が data-last)。部分適用は React event handler でも頻出 (`onClick={() => handleClick(id)}` は実質部分適用)。性能: 大量呼び出しでは関数生成オーバーヘッドあり。",
      codeExample:
        "// カリー化\nconst curry = (fn) => {\n  return function curried(...args) {\n    return args.length >= fn.length\n      ? fn(...args)\n      : (...more) => curried(...args, ...more)\n  }\n}\nconst add = curry((a, b, c) => a + b + c)\nadd(1)(2)(3)                          // 6\nadd(1, 2)(3)                          // 6\nadd(1, 2, 3)                          // 6\n\n// 部分適用\nconst partial = (fn, ...presets) => (...rest) => fn(...presets, ...rest)\nfunction greet(g, p, name) { return `${g}, ${name}${p}` }\nconst sayHello = partial(greet, 'Hello', '!')\nsayHello('Alice')                     // 'Hello, Alice!'\n\n// bind は組込み部分適用\nconst sayHelloBound = greet.bind(null, 'Hello', '!')\n\n// 関数合成\nconst pipe = (...fns) => (x) => fns.reduce((v, f) => f(v), x)\nconst normalize = pipe(\n  s => s.trim(),\n  s => s.toLowerCase(),\n  s => `${s}@example.com`\n)\nnormalize('  ALICE  ')                // 'alice@example.com'",
    },
  },

  // ===========================================================================
  // 🟨 JS 非同期 拡張 (jsa-011 〜 jsa-020)
  // ===========================================================================
  {
    id: "jsa-011",
    categoryId: "js-async",
    difficulty: "intermediate",
    type: "choice",
    question: "Promise.all / allSettled / race / any の違いは？",
    choices: [
      "全部同じ",
      "race は廃止",
      "any は ES5",
      "all=全成功で resolve・1 失敗で即 reject / allSettled=全完了を待ち status 配列 / race=最初に確定したもの / any=最初に成功 (全失敗で AggregateError)",
    ],
    answerIndex: 3,
    hints: [
      "all は失敗に弱い (1 つで全体失敗)。",
      "allSettled は『全部待って結果を集める』。",
      "race は『先着勝ち』、any は『先着の成功』。",
    ],
    explanation: {
      summary:
        "Promise の組合せ: **all** (全成功、1 失敗で即 reject)、**allSettled** (全完了を待ち {status, value/reason}[] を返す)、**race** (最初に settle したもの)、**any** (最初に成功、全失敗で AggregateError)。",
      reason:
        "all は AWS / DB 等の重要 API には弱い → 部分失敗を許容する allSettled が現代の主流。race はタイムアウト実装、any はフォールバック。AbortController で残りを cancel するパターンも。",
      codeExample:
        "// all (全成功、1 失敗で即 reject)\nconst [users, posts, comments] = await Promise.all([\n  fetch('/users'), fetch('/posts'), fetch('/comments')\n])\n\n// allSettled (全完了を待つ)\nconst results = await Promise.allSettled([fetch('/a'), fetch('/b')])\nfor (const r of results) {\n  if (r.status === 'fulfilled') console.log('ok:', r.value)\n  else console.log('failed:', r.reason)\n}\n\n// race (タイムアウト実装)\nconst timeout = (ms) => new Promise((_, rej) => setTimeout(() => rej(new Error('timeout')), ms))\nconst data = await Promise.race([fetch('/api'), timeout(5000)])\n\n// any (最初に成功、フォールバック)\nconst response = await Promise.any([\n  fetch('https://primary.example.com'),\n  fetch('https://mirror.example.com'),\n])",
    },
  },
  {
    id: "jsa-012",
    categoryId: "js-async",
    difficulty: "intermediate",
    type: "choice",
    question: "async/await のエラーハンドリングで推奨される書き方は？",
    choices: [
      "if (await) で判定",
      "エラーは catch できない",
      "try/catch で囲む (await の throw を捕捉)",
      ".then().catch() のみ",
    ],
    answerIndex: 2,
    hints: [
      "await は reject された Promise を throw に変換。",
      "try/catch でほぼ同期的に書ける。",
      "複数 await を 1 つの try で囲むと『どれが失敗したか』が分かりにくい問題も。",
    ],
    explanation: {
      summary:
        "async 関数内では `try/catch` で await の throw を捕捉。`.catch()` も併用可。複数 await を 1 try で囲むと失敗箇所が分かりにくいので、必要なら個別に。finally で cleanup。",
      reason:
        "await で reject が throw に変換される → 普通の try/catch で扱える。Promise.all との組合せで部分失敗を扱うなら allSettled の方が向く。エラーを上に投げたいなら catch せずそのまま (async 関数は自動で Promise を返す)。",
      codeExample:
        "// 基本\nasync function fetchUser(id) {\n  try {\n    const r = await fetch(`/api/users/${id}`)\n    if (!r.ok) throw new Error(`HTTP ${r.status}`)\n    return await r.json()\n  } catch (err) {\n    console.error('failed:', err)\n    throw err\n  } finally {\n    console.log('cleanup')\n  }\n}\n\n// 個別 try で失敗箇所明示\nasync function process() {\n  let user, posts\n  try { user = await fetchUser(1) } catch { return null }\n  try { posts = await fetchPosts(user.id) } catch { posts = [] }\n  return { user, posts }\n}\n\n// .catch() の併用\nconst data = await fetch('/api').catch(err => { console.error(err); return null })",
    },
  },
  {
    id: "jsa-013",
    categoryId: "js-async",
    difficulty: "advanced",
    type: "choice",
    question: "次のコードの出力順は？",
    code: "console.log('1')\nsetTimeout(() => console.log('2'), 0)\nPromise.resolve().then(() => console.log('3'))\nconsole.log('4')",
    choices: [
      "1, 3, 4, 2",
      "1, 4, 3, 2 — マイクロタスク (Promise) はタスク (setTimeout) より先",
      "1, 2, 3, 4",
      "1, 4, 2, 3",
    ],
    answerIndex: 1,
    hints: [
      "同期実行 → マイクロタスクキュー → タスクキュー の順。",
      "Promise.then はマイクロタスク、setTimeout はマクロタスク。",
      "マイクロタスクは『現在のスタックが空になった直後』に全部実行される。",
    ],
    explanation: {
      summary:
        "**Event Loop**: 同期実行 → マイクロタスクキュー (Promise.then / queueMicrotask / MutationObserver) を空になるまで → タスクキュー (setTimeout / setInterval / I/O) 1 つ → 再びマイクロタスク。マイクロタスクが先。",
      reason:
        "setTimeout(0) でも『次のタスク』まで遅延。Promise.then はマイクロタスクなので同じイベントループ内で同期処理直後に走る。Node.js では process.nextTick がさらに優先、setImmediate は『次のタスク』に。",
      codeExample:
        "console.log('1')\nsetTimeout(() => console.log('2'), 0)\nPromise.resolve().then(() => console.log('3'))\nqueueMicrotask(() => console.log('4'))\nconsole.log('5')\n// 1, 5, 3, 4, 2\n\n// 連鎖したマイクロタスクも『先』\nPromise.resolve()\n  .then(() => { console.log('a'); return Promise.resolve() })\n  .then(() => console.log('b'))\nsetTimeout(() => console.log('c'), 0)\nconsole.log('d')\n// d, a, b, c\n\n// Node.js\nprocess.nextTick(() => console.log('nextTick'))   // 最優先\nPromise.resolve().then(() => console.log('promise'))\nsetImmediate(() => console.log('immediate'))\nsetTimeout(() => console.log('timeout'), 0)",
    },
  },
  {
    id: "jsa-014",
    categoryId: "js-async",
    difficulty: "intermediate",
    type: "choice",
    question: "fetch をキャンセル可能にする標準 API は？",
    choices: [
      "AbortController + signal — fetch(url, { signal: ctrl.signal })",
      "fetch.cancel()",
      "clearFetch()",
      "fetch は cancel 不可",
    ],
    answerIndex: 0,
    hints: [
      "AbortController.abort() で signal が abort 状態に。",
      "fetch / addEventListener / setTimeout (新) が signal 対応。",
      "React useEffect の cleanup で fetch をキャンセルする定番パターン。",
    ],
    explanation: {
      summary:
        "`AbortController` + `signal` で fetch をキャンセル。`ctrl.abort()` で signal が aborted に → fetch が AbortError で reject。`addEventListener({ signal })` で listener も自動解除可能。AbortSignal.timeout(ms) で組込みタイムアウト。",
      reason:
        "Web 標準。React useEffect で『コンポーネント unmount 時に在中の fetch を中断』するのに必須。AbortSignal.timeout(5000) (ES2022) でタイムアウト、AbortSignal.any([s1, s2]) で複数 signal を合成。",
      codeExample:
        "// 基本\nconst ctrl = new AbortController()\nfetch('/api/data', { signal: ctrl.signal })\n  .catch(err => {\n    if (err.name === 'AbortError') console.log('cancelled')\n  })\nsetTimeout(() => ctrl.abort(), 5000)\n\n// AbortSignal.timeout (ES2022)\nfetch('/api', { signal: AbortSignal.timeout(5000) })\n\n// AbortSignal.any で合成\nconst userCancel = new AbortController()\nconst signal = AbortSignal.any([userCancel.signal, AbortSignal.timeout(5000)])\n\n// React useEffect\nuseEffect(() => {\n  const ctrl = new AbortController()\n  fetch(`/api/users/${id}`, { signal: ctrl.signal })\n    .then(r => r.json()).then(setUser)\n    .catch(err => { if (err.name !== 'AbortError') setError(err) })\n  return () => ctrl.abort()\n}, [id])\n\n// addEventListener も signal 対応\nbtn.addEventListener('click', handler, { signal: ctrl.signal })\nctrl.abort()                              // listener も解除",
    },
  },
  {
    id: "jsa-015",
    categoryId: "js-async",
    difficulty: "intermediate",
    type: "choice",
    question: "次のコードの結果は？",
    code: "Promise.resolve(1)\n  .then(x => x + 1)\n  .then(x => Promise.resolve(x * 2))\n  .then(x => x + 10)\n  .then(console.log)",
    choices: ["12", "4", "TypeError", "14"],
    answerIndex: 3,
    hints: [
      "1 → +1 = 2 → *2 = 4 → +10 = 14。",
      "then() の戻り値が Promise なら自動で unwrap される。",
      "then() は新しい Promise を返すのでチェーン可能。",
    ],
    explanation: {
      summary:
        "`.then(fn)` は fn の戻り値で新 Promise を返す。fn が値を返せば resolve、Promise を返せば自動 unwrap。チェーン可能で、エラーは下流の .catch まで bubble。",
      reason:
        "Promise の合成性の根幹。then の中で throw すると次の .catch までスキップ、return Promise.reject(err) も同じ。.finally(fn) は値を変えずに cleanup 実行。",
      codeExample:
        "// 自動 unwrap\nPromise.resolve(1)\n  .then(x => x + 1)              // 2\n  .then(x => Promise.resolve(x * 2))   // 4 (auto unwrap)\n  .then(x => x + 10)              // 14\n\n// throw は .catch へ\nPromise.resolve(1)\n  .then(x => { throw new Error('oops') })\n  .then(x => console.log('skipped'))   // skip\n  .catch(err => console.error(err))\n  .then(() => console.log('still runs'))\n\n// finally\nPromise.resolve(1).then(...).catch(...).finally(() => console.log('cleanup'))",
    },
  },
  {
    id: "jsa-016",
    categoryId: "js-async",
    difficulty: "intermediate",
    type: "choice",
    question: "次の 2 つのコードの違いは？",
    code: "// A\nfor (const url of urls) {\n  await fetch(url)\n}\n\n// B\nawait Promise.all(urls.map(u => fetch(u)))",
    choices: [
      "A の方が速い",
      "B はエラー",
      "A は順次 (1 つずつ完了を待つ)、B は並列 (同時に発火) — B の方が遥かに速い",
      "完全に同じ",
    ],
    answerIndex: 2,
    hints: [
      "for + await は順次実行 (waterfall)。",
      "Promise.all + map で並列発火 → 並列に待つ。",
      "100 件の fetch なら A は 100 倍遅い。",
    ],
    explanation: {
      summary:
        "**for + await** は順次 (合計時間 = 各時間の総和)。**Promise.all + map** は並列発火 (合計時間 = 最も遅いもの)。独立した I/O は必ず並列に。",
      reason:
        "順次にすべきケース: 後の処理が前の結果に依存、レート制限の遵守、メモリ消費を抑える。中間案: p-limit で並列数制限。",
      codeExample:
        "// ❌ 順次 (遅い)\nfor (const url of urls) {\n  const r = await fetch(url)\n  results.push(await r.json())\n}\n// 10 個 × 100ms = 1000ms\n\n// ✅ 並列\nconst results = await Promise.all(\n  urls.map(async url => {\n    const r = await fetch(url)\n    return r.json()\n  })\n)\n// 10 個 並列 = 100ms\n\n// 並列数制限 (p-limit)\nimport pLimit from 'p-limit'\nconst limit = pLimit(5)\nawait Promise.all(urls.map(u => limit(() => fetch(u))))\n\n// 順次が必要なケース\nconst user = await fetchUser(1)\nconst posts = await fetchPosts(user.id)   // user に依存",
    },
  },
  {
    id: "jsa-017",
    categoryId: "js-async",
    difficulty: "intermediate",
    type: "choice",
    question: "ES2022 で導入された Top-Level await の使える場所は？",
    choices: [
      "Node.js のみ",
      "ES Module (.mjs / type=module / Next.js Server Component) — CommonJS では使えない",
      "全 JS ファイル",
      "ブラウザのみ",
    ],
    answerIndex: 1,
    hints: [
      "Module 直下で await を書ける。",
      "CommonJS (require) では使えない (同期前提)。",
      "依存初期化やデータプリフェッチで便利。",
    ],
    explanation: {
      summary:
        "**Top-Level await** は ES Module 直下で await を書ける機能。CommonJS では使えない。Server Component で `await db.query(...)` を直接書けるのはこれ + RSC の組合せ。",
      reason:
        "Module 間の依存解決時に await を待ってから次の Module が初期化される。注意: 起動時間が伸びる、デッドロックのリスク (循環依存 + await)。",
      codeExample:
        "// config.mjs\nconst response = await fetch('https://api.example.com/config')\nexport const config = await response.json()\n\n// Next.js Server Component\nexport default async function Page() {\n  const posts = await db.post.findMany()\n  return <div>{posts.map(...)}</div>\n}\n\n// 動的 import + top-level await\nconst { default: lib } = await import('./heavy-lib.js')\nlib.init()\n\n// CommonJS では使えない → IIFE で\n;(async () => {\n  const data = await fetch(...)\n})()",
    },
  },
  {
    id: "jsa-018",
    categoryId: "js-async",
    difficulty: "advanced",
    type: "choice",
    question: "次のうち、setTimeout(0) より早く実行されるものは？",
    choices: [
      "setImmediate (Node)",
      "DOM イベント",
      "queueMicrotask / Promise.resolve().then / MutationObserver (マイクロタスク)",
      "setInterval(0)",
    ],
    answerIndex: 2,
    hints: [
      "マイクロタスクは『現在のスタック空になり次第』即実行。",
      "setTimeout/setImmediate はタスク (次のループ)。",
      "Node の process.nextTick はさらに優先。",
    ],
    explanation: {
      summary:
        "マイクロタスクは現在のスタック完了直後に全処理 → タスクが 1 つ走る。マイクロタスクが先。",
      reason:
        "用途: マイクロタスクは『DOM 同期更新』『state 反映後のフック』など即時で確実な実行。タスクは『次の描画ループ』『他イベント処理を挟む』時。requestAnimationFrame は『次の描画前』、requestIdleCallback は『暇な時』。",
      codeExample:
        "// マイクロタスク (即)\nqueueMicrotask(() => console.log('microtask'))\nPromise.resolve().then(() => console.log('promise'))\n\n// タスク (次のループ)\nsetTimeout(() => console.log('timeout'), 0)\nsetImmediate?.(() => console.log('immediate'))   // Node\n\n// 描画系\nrequestAnimationFrame(() => console.log('raf'))   // 次の描画前\nrequestIdleCallback(() => console.log('idle'))    // 暇な時\n\nconsole.log('sync')\n// 出力: sync, microtask, promise, timeout, raf, idle\n\n// 重い処理を分割 (UI 凍結回避)\nasync function processLarge(items) {\n  for (let i = 0; i < items.length; i++) {\n    process(items[i])\n    if (i % 100 === 0) await new Promise(r => setTimeout(r, 0))\n  }\n}",
    },
  },
  {
    id: "jsa-019",
    categoryId: "js-async",
    difficulty: "advanced",
    type: "choice",
    question: "次のコードに含まれる問題は？",
    code: "async function deleteAll(ids) {\n  for (const id of ids) {\n    await fetch(`/api/${id}`, { method: 'DELETE' })\n  }\n}",
    choices: [
      "ids が array じゃない",
      "順次実行で遅い + 1 失敗で残り中断 + try/catch なし — 並列 + allSettled で改善",
      "問題なし",
      "async が抜けている",
    ],
    answerIndex: 1,
    hints: [
      "順次の for + await は独立 I/O で非常に遅い。",
      "途中で throw されると残りが実行されない。",
      "並列実行 + Promise.allSettled でエラー耐性。",
    ],
    explanation: {
      summary:
        "改善: (1) Promise.all で並列化 (allSettled なら部分失敗 OK)、(2) try/catch でエラー対応、(3) p-limit で並列数制限、(4) 大量なら bulk delete API を検討。",
      reason:
        "順次の問題: 100 件 × 50ms = 5 秒、並列なら 50ms。1 件失敗で残り 99 件が delete されない。allSettled なら全件試行 + 失敗結果も収集。",
      codeExample:
        "// ✅ 並列 + allSettled\nasync function deleteAll(ids) {\n  const results = await Promise.allSettled(\n    ids.map(id => fetch(`/api/${id}`, { method: 'DELETE' }))\n  )\n  const failed = results.filter((r, i) => r.status === 'rejected').map((r, i) => ids[i])\n  return { successCount: results.length - failed.length, failed }\n}\n\n// concurrency control\nimport pLimit from 'p-limit'\nasync function deleteAll(ids) {\n  const limit = pLimit(10)\n  return Promise.allSettled(\n    ids.map(id => limit(() => fetch(`/api/${id}`, { method: 'DELETE' })))\n  )\n}\n\n// 理想: bulk API\nawait fetch('/api/bulk-delete', {\n  method: 'POST',\n  body: JSON.stringify({ ids }),\n  headers: { 'Content-Type': 'application/json' },\n})",
    },
  },
  {
    id: "jsa-020",
    categoryId: "js-async",
    difficulty: "advanced",
    type: "choice",
    question: "メインスレッドをブロックする重い計算を別スレッドで実行する標準 API は？",
    choices: [
      "Web Worker (Browser) / worker_threads (Node.js)",
      "setTimeout(0)",
      "Promise",
      "async/await",
    ],
    answerIndex: 0,
    hints: [
      "JS はシングルスレッドなので CPU バウンドで UI が固まる。",
      "Web Worker で別スレッド実行、postMessage で通信。",
      "DOM アクセス不可、構造化 clone でデータ受け渡し。",
    ],
    explanation: {
      summary:
        "**Web Worker** (ブラウザ) / **worker_threads** (Node.js) で別スレッド実行。postMessage で構造化 clone でデータ送受信。DOM アクセス不可だが OffscreenCanvas / Fetch / IndexedDB はある。Comlink ライブラリで RPC 風に。",
      reason:
        "JS 本体はシングルスレッド → 重い計算が UI をブロック。Web Worker で別スレッドに逃がす。SharedArrayBuffer + Atomics で共有メモリも (要 COOP/COEP)。Service Worker は別目的 (ネットワーク proxy、PWA)。",
      codeExample:
        "// worker.js\nself.addEventListener('message', (e) => {\n  const result = heavyCalculation(e.data)\n  self.postMessage(result)\n})\n\n// main.js\nconst worker = new Worker('worker.js')\nworker.postMessage({ size: 1000000 })\nworker.addEventListener('message', (e) => console.log(e.data))\nworker.terminate()\n\n// Module Worker\nconst worker = new Worker(new URL('./worker.ts', import.meta.url), { type: 'module' })\n\n// Comlink で RPC 風\nimport { expose, wrap } from 'comlink'\n// worker:\nexpose({ async heavyCalc(data) { return processIt(data) } })\n// main:\nconst api = wrap(new Worker('worker.ts', { type: 'module' }))\nconst result = await api.heavyCalc(data)\n\n// Node.js worker_threads\nimport { Worker } from 'node:worker_threads'\nconst worker = new Worker('./worker.js', { workerData: { ... } })",
    },
  },

  // ===========================================================================
  // 🗃️ SQL 基礎 拡張 (sql-026 〜 sql-035)
  // ===========================================================================
  {
    id: "sql-026",
    categoryId: "sql-basics",
    difficulty: "intermediate",
    type: "choice",
    question: "ページネーションの 2 番目のページ (1 ページ 20 件) を取得する SQL は？",
    choices: [
      "SELECT ... PAGE 2",
      "SELECT ... SKIP 1 TAKE 20",
      "SELECT ... ORDER BY id LIMIT 20 OFFSET 20",
      "SELECT ... LIMIT 20, 40",
    ],
    answerIndex: 2,
    hints: [
      "LIMIT N で N 行、OFFSET M で先頭から M 行スキップ。",
      "OFFSET ベースは深いページで遅くなる (1000 ページ目で 20000 行スキャン)。",
      "大規模では keyset pagination (WHERE id > last_id) を使う。",
    ],
    explanation: {
      summary:
        "`ORDER BY 列 LIMIT 20 OFFSET 20` で 21〜40 行目。**OFFSET ベース** は実装が単純だが深いページで遅い。大規模では **keyset pagination** (`WHERE id > last_id ORDER BY id LIMIT 20`)。",
      reason:
        "OFFSET は『該当行までスキャンしてから捨てる』 → 100 万行の最後尾近くは 100 万行スキャン。keyset は INDEX を使って『どこから始めるか』を直接指定 → O(log N + page_size)。MySQL は `LIMIT offset, count` 構文もある。COUNT(*) を毎回計算すると重い → 別途キャッシュ。",
      codeExample:
        "-- OFFSET ベース (簡単だが深いページで遅い)\nSELECT * FROM posts\nORDER BY created_at DESC, id DESC\nLIMIT 20 OFFSET 40;                  -- 3 ページ目 (41〜60 行)\n\n-- 総ページ数のために COUNT (重いので注意)\nSELECT COUNT(*) FROM posts WHERE published = true;\n\n-- Keyset pagination (高速、推奨)\n-- 1 ページ目\nSELECT * FROM posts\nORDER BY id DESC LIMIT 20;\n-- 2 ページ目以降は最後の id を渡す\nSELECT * FROM posts\nWHERE id < ?      -- last_id\nORDER BY id DESC LIMIT 20;\n\n-- 複数列でソートする keyset\nSELECT * FROM posts\nWHERE (created_at, id) < (?, ?)      -- last_created_at, last_id\nORDER BY created_at DESC, id DESC LIMIT 20;\n\n-- MySQL の短縮形\nSELECT * FROM posts LIMIT 40, 20;    -- OFFSET 40, LIMIT 20\n\n-- Rails\nPost.order(id: :desc).limit(20).offset(40)\nPost.order(id: :desc).where('id < ?', last_id).limit(20)",
    },
  },
  {
    id: "sql-027",
    categoryId: "sql-basics",
    difficulty: "intermediate",
    type: "choice",
    question: "ORDER BY で『NULL を末尾に置く』(降順) 標準 SQL の指定は？",
    choices: [
      "ORDER BY ISNULL(col), col DESC",
      "ORDER BY NULL DESC",
      "ORDER BY col DESC NULLS LAST",
      "ORDER BY col DESC EXCEPT NULL",
    ],
    answerIndex: 2,
    hints: [
      "PostgreSQL / Oracle は NULLS FIRST / NULLS LAST をサポート。",
      "MySQL は古典的に対応せず → ORDER BY col IS NULL, col DESC で代用。",
      "デフォルト挙動は DB によって違う (PG は DESC で NULL が先、ASC で後)。",
    ],
    explanation: {
      summary:
        "`ORDER BY col DESC NULLS LAST` で NULL を末尾に。PostgreSQL / Oracle は NULLS FIRST / NULLS LAST をサポート。MySQL は無いので `ORDER BY col IS NULL, col DESC` (ISNULL は MySQL 関数で 1/0 を返す) で代用。",
      reason:
        "DB のデフォルト: PostgreSQL は ASC → NULL 末尾、DESC → NULL 先頭。Oracle はその逆。MySQL は ASC → NULL 先頭、DESC → NULL 末尾。明示的に指定する方が portable + 意図が明確。",
      codeExample:
        "-- PostgreSQL / Oracle\nSELECT name, deleted_at FROM users\nORDER BY deleted_at DESC NULLS LAST;\n-- 削除日が新しい順、未削除 (NULL) は末尾\n\nSELECT name, published_at FROM posts\nORDER BY published_at ASC NULLS LAST;\n-- 古い順、未公開 (NULL) は末尾\n\n-- MySQL (NULLS LAST が無い、代用)\nSELECT * FROM users\nORDER BY deleted_at IS NULL, deleted_at DESC;\n-- IS NULL は 1/0 を返す → 0 (NOT NULL) を先に、NULL を後に\n\n-- 別解: COALESCE で代用 (注意: 値の範囲を考慮)\nSELECT * FROM users\nORDER BY COALESCE(deleted_at, '9999-12-31') DESC;\n\n-- Rails では string で書くか arel\nPost.order(Arel.sql('published_at DESC NULLS LAST'))",
    },
  },
  {
    id: "sql-028",
    categoryId: "sql-basics",
    difficulty: "intermediate",
    type: "choice",
    question: "次のクエリの結果は？",
    code: "SELECT DISTINCT role FROM users;\n-- users.role = 'admin', 'user', 'admin', 'user', 'admin'",
    choices: [
      "1 行",
      "エラー",
      "2 行: 'admin', 'user' — 重複排除",
      "5 行",
    ],
    answerIndex: 2,
    hints: [
      "DISTINCT は SELECT 結果から重複を排除。",
      "DISTINCT col1, col2 は両方の組合せが UNIQUE。",
      "DISTINCT ON (PostgreSQL) は『col の値ごとに最初の 1 行』。",
    ],
    explanation: {
      summary:
        "`DISTINCT` は SELECT 結果の重複行を排除。`SELECT DISTINCT a, b` は (a, b) ペアでユニーク化。PostgreSQL の `DISTINCT ON (col)` は『col 値ごとに 1 行 (ORDER BY で選ぶ)』。",
      reason:
        "GROUP BY と似た用途だが、DISTINCT は集約関数なしで重複排除だけ。INDEX が効くと高速、無いと全件ソート。`COUNT(DISTINCT col)` で重複なしカウント。DISTINCT ON は PG 専用拡張、他 DB では window function で代用 (`ROW_NUMBER() OVER (PARTITION BY col)`)。",
      codeExample:
        "-- 単一列\nSELECT DISTINCT role FROM users;\n-- ['admin', 'user']\n\n-- 複数列 (組合せで UNIQUE)\nSELECT DISTINCT country, city FROM users;\n-- (JP, Tokyo), (JP, Osaka), (US, NY), ...\n\n-- DISTINCT COUNT\nSELECT COUNT(DISTINCT user_id) FROM page_views;\n-- ユニークユーザー数\n\n-- DISTINCT ON (PostgreSQL のみ)\n-- ユーザーごとの最新投稿\nSELECT DISTINCT ON (user_id) user_id, title, created_at\nFROM posts\nORDER BY user_id, created_at DESC;\n\n-- 標準 SQL での代替 (window function)\nSELECT user_id, title, created_at FROM (\n  SELECT *, ROW_NUMBER() OVER (PARTITION BY user_id ORDER BY created_at DESC) AS rn\n  FROM posts\n) t WHERE rn = 1;\n\n-- Rails\nUser.distinct.pluck(:role)\nPageView.distinct.count(:user_id)",
    },
  },
  {
    id: "sql-029",
    categoryId: "sql-basics",
    difficulty: "intermediate",
    type: "choice",
    question: "LIKE のワイルドカードで『大文字小文字を区別しない』PostgreSQL 演算子は？",
    choices: [
      "LIKE LOWER",
      "FUZZY LIKE",
      "ILIKE — case-insensitive な LIKE (PostgreSQL 拡張)",
      "LIKE IGNORE CASE",
    ],
    answerIndex: 2,
    hints: [
      "% は 0+ 文字、_ は 1 文字のワイルドカード。",
      "MySQL の LIKE は照合順序によりデフォルトで case-insensitive。",
      "標準 SQL なら LOWER(col) LIKE LOWER('...') で代用。",
    ],
    explanation: {
      summary:
        "PostgreSQL は `ILIKE` で case-insensitive。MySQL の LIKE は照合順序 (collation) でデフォルト ci。標準的には `LOWER(col) LIKE LOWER('...')`。前方一致 `'pattern%'` は INDEX 利用可、ワイルドカード先頭 `'%pattern'` は full scan。",
      reason:
        "ワイルドカード: `%` (0+ 文字)、`_` (1 文字)。エスケープ: `LIKE 'a\\_b' ESCAPE '\\\\'`。先頭ワイルドカード問題: `LIKE '%foo'` は B-Tree INDEX が効かない → trigram (PG: pg_trgm extension) + GIN index、または全文検索 (tsvector / Elasticsearch)。",
      codeExample:
        "-- 前方一致 (INDEX 効く)\nSELECT * FROM users WHERE email LIKE 'admin%';\n\n-- 部分一致 (INDEX 効かない、要 trigram or 全文検索)\nSELECT * FROM users WHERE email LIKE '%@example.com';\n\n-- PostgreSQL: case-insensitive\nSELECT * FROM users WHERE email ILIKE 'ADMIN%';\n\n-- 標準 SQL での case-insensitive\nSELECT * FROM users WHERE LOWER(email) LIKE LOWER('ADMIN%');\n\n-- 関数 INDEX (PG)\nCREATE INDEX idx_users_lower_email ON users(LOWER(email));\n\n-- ワイルドカードのエスケープ\nSELECT * FROM tags WHERE name LIKE 'a\\_b' ESCAPE '\\\\';\n\n-- pg_trgm (前方一致でない曖昧検索)\nCREATE EXTENSION pg_trgm;\nCREATE INDEX idx_users_email_trgm ON users USING GIN (email gin_trgm_ops);\nSELECT * FROM users WHERE email % 'admn';   -- 類似度検索\n\n-- 全文検索 (PostgreSQL)\nSELECT * FROM posts WHERE to_tsvector('english', body) @@ to_tsquery('cat & dog');\n\n-- Rails\nUser.where('email ILIKE ?', \"%#{q}%\")\nUser.where('LOWER(email) LIKE ?', \"%#{q.downcase}%\")",
    },
  },
  {
    id: "sql-030",
    categoryId: "sql-basics",
    difficulty: "intermediate",
    type: "choice",
    question: "次の 2 つのクエリは同じ結果になる？",
    code: "-- A\nSELECT * FROM products WHERE price BETWEEN 100 AND 500;\n\n-- B\nSELECT * FROM products WHERE price >= 100 AND price <= 500;",
    choices: [
      "BETWEEN は両端を含まない",
      "B の方が速い",
      "結果が異なる",
      "はい、完全に同等 (BETWEEN は両端を含む)",
    ],
    answerIndex: 3,
    hints: [
      "BETWEEN A AND B は『A 以上 B 以下』(両端含む)。",
      "NULL は対象外 (BETWEEN も IN も)。",
      "IN (1, 2, 3) は OR の連鎖と同等。",
    ],
    explanation: {
      summary:
        "`BETWEEN A AND B` は `>= A AND <= B` と完全同等 (両端含む)。`NOT BETWEEN` で範囲外。`col IN (1, 2, 3)` は `col = 1 OR col = 2 OR col = 3` と同等。NULL は IN / BETWEEN の対象外。",
      reason:
        "IN は OR 連鎖より読みやすく、INDEX も効く。`NOT IN (...)` で NULL を含むサブクエリは罠 (NULL を含むと全部 false 扱い) → NOT EXISTS の方が安全。日付の BETWEEN は時刻含むので注意 (`created_at BETWEEN '2024-01-01' AND '2024-01-31'` は 01-31 00:00:00 まで)。",
      codeExample:
        "-- BETWEEN (両端含む)\nSELECT * FROM products WHERE price BETWEEN 100 AND 500;\n-- = WHERE price >= 100 AND price <= 500\n\n-- NOT BETWEEN\nSELECT * FROM products WHERE price NOT BETWEEN 100 AND 500;\n\n-- 日付の罠\nSELECT * FROM orders WHERE created_at BETWEEN '2024-01-01' AND '2024-01-31';\n-- 01-31 00:00:00 までしか含まない (1/31 中の注文は漏れる)\n-- → 半開区間で\nSELECT * FROM orders WHERE created_at >= '2024-01-01' AND created_at < '2024-02-01';\n\n-- IN (OR の代替)\nSELECT * FROM users WHERE role IN ('admin', 'editor', 'owner');\n-- = WHERE role = 'admin' OR role = 'editor' OR role = 'owner'\n\n-- NOT IN の NULL 罠\nSELECT * FROM orders\nWHERE customer_id NOT IN (SELECT id FROM banned_customers);\n-- banned_customers.id に 1 つでも NULL があると全部 false → 0 件\n-- ✅ NOT EXISTS で書き換え\nSELECT * FROM orders o\nWHERE NOT EXISTS (SELECT 1 FROM banned_customers b WHERE b.id = o.customer_id);\n\n-- Rails\nProduct.where(price: 100..500)        -- BETWEEN\nProduct.where(price: 100...500)       -- 半開 (PG: >= 100 AND < 500)\nUser.where(role: ['admin', 'editor'])  -- IN",
    },
  },
  {
    id: "sql-031",
    categoryId: "sql-basics",
    difficulty: "intermediate",
    type: "choice",
    question: "SQL の CASE 式の主な用途は？",
    choices: [
      "ループ処理",
      "DDL のみ",
      "JOIN の高速化",
      "条件分岐で SELECT 結果や WHERE / ORDER BY 内で値を切り替える (if/else 相当)",
    ],
    answerIndex: 3,
    hints: [
      "CASE WHEN ... THEN ... ELSE ... END の構文。",
      "SELECT / WHERE / ORDER BY / GROUP BY どこでも使える。",
      "集計 (SUM, COUNT) と組み合わせて条件付き集計が定番。",
    ],
    explanation: {
      summary:
        "`CASE WHEN cond THEN val ELSE val END` で条件分岐。SELECT で値を変換、ORDER BY でカスタムソート、GROUP BY で動的なグループ化、集計関数と組み合わせて『条件付き COUNT / SUM』。",
      reason:
        "CASE には 2 形式: searched (`CASE WHEN cond THEN ...`)、simple (`CASE col WHEN val THEN ...`)。`COALESCE(a, b)` は `CASE WHEN a IS NULL THEN b ELSE a END` の糖衣構文。条件付き集計 (`COUNT(CASE WHEN ... THEN 1 END)`) はピボットテーブルの基本。",
      codeExample:
        "-- SELECT で変換\nSELECT name, age,\n  CASE\n    WHEN age < 18 THEN 'minor'\n    WHEN age < 65 THEN 'adult'\n    ELSE 'senior'\n  END AS age_group\nFROM users;\n\n-- 簡略形 (col の値で分岐)\nSELECT name,\n  CASE role\n    WHEN 'admin' THEN '管理者'\n    WHEN 'user' THEN '一般'\n    ELSE 'その他'\n  END AS role_jp\nFROM users;\n\n-- 条件付き集計 (ピボット風)\nSELECT\n  COUNT(*) AS total,\n  COUNT(CASE WHEN status = 'paid' THEN 1 END) AS paid_count,\n  COUNT(CASE WHEN status = 'pending' THEN 1 END) AS pending_count,\n  SUM(CASE WHEN status = 'paid' THEN amount ELSE 0 END) AS paid_amount\nFROM orders;\n\n-- WHERE 内\nSELECT * FROM users\nWHERE CASE WHEN role = 'admin' THEN true ELSE active END;\n\n-- ORDER BY (カスタム順)\nSELECT * FROM tasks\nORDER BY CASE priority\n  WHEN 'urgent' THEN 1\n  WHEN 'high' THEN 2\n  WHEN 'normal' THEN 3\n  ELSE 4\nEND;\n\n-- COALESCE / NULLIF\nCOALESCE(a, b, c)              -- 最初の non-NULL\nNULLIF(a, b)                    -- a = b なら NULL、違えば a",
    },
  },
  {
    id: "sql-032",
    categoryId: "sql-basics",
    difficulty: "intermediate",
    type: "choice",
    question: "PostgreSQL で『UPDATE して更新後の値を返す』構文は？",
    choices: [
      "UPDATE ... LET ...",
      "UPDATE ... SET ... WHERE ... RETURNING *",
      "UPDATE ... GET ...",
      "UPDATE ... OUTPUT ...",
    ],
    answerIndex: 1,
    hints: [
      "PostgreSQL / Oracle の拡張。",
      "INSERT / UPDATE / DELETE で RETURNING を使うと結果が返る。",
      "クエリ往復を 1 回に減らせる (UPDATE + SELECT を統合)。",
    ],
    explanation: {
      summary:
        "PostgreSQL の `RETURNING *` で UPDATE / INSERT / DELETE 後の行を返す。クエリ 1 回で完結 → 往復削減。MySQL は持たない (Oracle / SQL Server は OUTPUT 句で同等)。",
      reason:
        "用途: 更新後の値を即取得 (タイムスタンプの自動更新を確認)、上書き前の値を取る (DELETE RETURNING で audit log)、generated column の値を取る。Rails の `Model#save` は内部で RETURNING を使って id 等を取得 (PG)。",
      codeExample:
        "-- UPDATE + RETURNING\nUPDATE users SET name = 'Bob', updated_at = NOW() WHERE id = 1\nRETURNING id, name, updated_at;\n\n-- INSERT + RETURNING (auto increment id を取得)\nINSERT INTO posts (title, user_id) VALUES ('Hello', 1)\nRETURNING id, created_at;\n\n-- DELETE + RETURNING (audit log)\nDELETE FROM users WHERE id = 1\nRETURNING *;\n\n-- 集計\nUPDATE orders SET status = 'paid' WHERE id IN (1, 2, 3)\nRETURNING id, status, amount;\n-- 複数行返る\n\n-- WITH (CTE) と組合せ\nWITH deleted AS (\n  DELETE FROM old_logs WHERE created_at < NOW() - INTERVAL '90 days' RETURNING *\n)\nINSERT INTO archived_logs SELECT * FROM deleted;\n\n-- Rails (PG では内部で RETURNING を使用)\nuser = User.create!(name: 'Alice')\nuser.id                       # 自動採番された id (RETURNING で取得済み)\n\n-- 明示的に RETURNING\nResult = ActiveRecord::Base.connection.exec_query(\n  \"UPDATE users SET name = 'Bob' WHERE id = 1 RETURNING *\"\n)",
    },
  },
  {
    id: "sql-033",
    categoryId: "sql-basics",
    difficulty: "advanced",
    type: "choice",
    question: "PostgreSQL で『INSERT して、既存なら UPDATE』(UPSERT) の構文は？",
    choices: [
      "UPSERT INTO ...",
      "INSERT OR REPLACE",
      "MERGE INTO ...",
      "INSERT ... ON CONFLICT (col) DO UPDATE SET ...",
    ],
    answerIndex: 3,
    hints: [
      "PostgreSQL: ON CONFLICT 構文。",
      "MySQL: INSERT ... ON DUPLICATE KEY UPDATE。",
      "SQLite: INSERT OR REPLACE / INSERT ... ON CONFLICT (3.24+)。",
    ],
    explanation: {
      summary:
        "PostgreSQL: `INSERT ... ON CONFLICT (col) DO UPDATE SET ...` で UPSERT。MySQL: `INSERT ... ON DUPLICATE KEY UPDATE`。標準 SQL の `MERGE` は PG 15+ で対応。EXCLUDED 仮想テーブルで INSERT しようとした値を参照。",
      reason:
        "用途: 集計テーブルの加算更新 (`view_count = view_count + 1`)、設定値の保存 (key/value)、外部データの同期。CONFLICT の対象は UNIQUE 制約 (PK or UNIQUE INDEX)。DO NOTHING で『既存なら何もしない』、複合 UNIQUE は `ON CONFLICT (col1, col2)`。",
      codeExample:
        "-- PostgreSQL UPSERT\nINSERT INTO settings (key, value)\nVALUES ('theme', 'dark')\nON CONFLICT (key) DO UPDATE SET\n  value = EXCLUDED.value,\n  updated_at = NOW();\n\n-- 集計テーブルへの加算\nINSERT INTO page_views (path, count, date)\nVALUES ('/home', 1, CURRENT_DATE)\nON CONFLICT (path, date) DO UPDATE SET\n  count = page_views.count + 1;\n\n-- DO NOTHING (既存なら無視)\nINSERT INTO users (email, name) VALUES ('a@x.com', 'Alice')\nON CONFLICT (email) DO NOTHING;\n\n-- 複合 UNIQUE\nINSERT INTO memberships (team_id, user_id, role)\nVALUES (1, 5, 'member')\nON CONFLICT (team_id, user_id) DO UPDATE SET role = EXCLUDED.role;\n\n-- RETURNING と組合せ\nINSERT INTO tags (name) VALUES ('rails')\nON CONFLICT (name) DO UPDATE SET name = EXCLUDED.name\nRETURNING id, name;\n\n-- MySQL\nINSERT INTO settings (key, value) VALUES ('theme', 'dark')\nON DUPLICATE KEY UPDATE value = VALUES(value), updated_at = NOW();\n\n-- Rails (PG 推奨)\nUser.upsert({ email: 'a@x.com', name: 'Alice' }, unique_by: :email)\nUser.upsert_all([{...}, {...}], unique_by: :email)",
    },
  },
  {
    id: "sql-034",
    categoryId: "sql-basics",
    difficulty: "intermediate",
    type: "choice",
    question: "次のクエリの意味は？",
    code: "SELECT name,\n  (SELECT COUNT(*) FROM posts WHERE user_id = users.id) AS post_count\nFROM users;",
    choices: [
      "型エラー",
      "1 行だけ取得",
      "スカラーサブクエリ — 各 user 行ごとに posts.count を実行 (相関サブクエリ、N+1 風)",
      "JOIN と同じ",
    ],
    answerIndex: 2,
    hints: [
      "サブクエリが外側の users.id を参照 = 相関サブクエリ。",
      "実装は『各 user 行に対して posts 全体を走査』 → 遅い可能性。",
      "JOIN + GROUP BY の方が高速なことが多い。",
    ],
    explanation: {
      summary:
        "**スカラーサブクエリ** (1 列 1 行を返す) を SELECT 内で使用。外側の users.id を参照する **相関サブクエリ** で、各行ごとに subquery を実行 → N+1 風。LEFT JOIN + GROUP BY か、counter_cache カラムの方が高速。",
      reason:
        "現代の RDB は相関サブクエリを内部で hash join / semi-join に書き換える最適化があるので必ずしも遅くないが、INDEX が無いと致命的。実行計画を EXPLAIN で確認。counter_cache (集計列をテーブルに持つ) や materialized view も選択肢。",
      codeExample:
        "-- スカラーサブクエリ (各行ごとに実行)\nSELECT name,\n  (SELECT COUNT(*) FROM posts WHERE user_id = users.id) AS post_count\nFROM users;\n\n-- 同等の LEFT JOIN + GROUP BY (一般に高速)\nSELECT u.name, COUNT(p.id) AS post_count\nFROM users u\nLEFT JOIN posts p ON p.user_id = u.id\nGROUP BY u.id, u.name;\n\n-- counter_cache (高速、追加カラムが必要)\nSELECT name, posts_count FROM users;\n\n-- 同じ user に複数の集計\nSELECT u.name,\n  (SELECT COUNT(*) FROM posts WHERE user_id = u.id) AS post_count,\n  (SELECT COUNT(*) FROM comments WHERE user_id = u.id) AS comment_count\nFROM users u;\n-- → JOIN + GROUP BY 2 回や lateral join に\n\n-- LATERAL JOIN (PG、相関サブクエリの代替)\nSELECT u.name, p.post_count\nFROM users u\nLEFT JOIN LATERAL (\n  SELECT COUNT(*) AS post_count FROM posts WHERE user_id = u.id\n) p ON true;",
    },
  },
  {
    id: "sql-035",
    categoryId: "sql-basics",
    difficulty: "intermediate",
    type: "choice",
    question: "NULL を持つ列の比較で正しいのは？",
    choices: [
      "col = NULL で NULL の行が hit",
      "col = NULL は false",
      "= と IS NULL は同等",
      "col = NULL は常に NULL (true でも false でもない) — IS NULL を使う",
    ],
    answerIndex: 3,
    hints: [
      "SQL の 3 値論理: true / false / NULL。",
      "WHERE は true の行だけ返す → NULL は除外される。",
      "IS NULL / IS NOT NULL で明示的に判定。",
    ],
    explanation: {
      summary:
        "SQL は **3 値論理** (true / false / NULL)。`col = NULL` は常に NULL (true でも false でもない) → 行は hit しない。NULL 判定は `IS NULL` / `IS NOT NULL`。`NULL = NULL` も NULL。",
      reason:
        "3 値論理は他言語と異なる罠。`WHERE col != 'x'` は col が NULL の行を除外 (NULL は != でも = でも NULL)。GROUP BY は NULL を 1 つのグループに、ORDER BY は NULL を末尾 or 先頭 (DB により)、DISTINCT は NULL を 1 つの値として扱う。COUNT(col) は NULL を除外、COUNT(*) は含む。",
      codeExample:
        "-- ❌ NULL の行が hit しない\nSELECT * FROM users WHERE deleted_at = NULL;        -- 常に 0 件\nSELECT * FROM users WHERE deleted_at != NULL;       -- 同じく 0 件\n\n-- ✅ IS NULL / IS NOT NULL\nSELECT * FROM users WHERE deleted_at IS NULL;       -- 削除されていない\nSELECT * FROM users WHERE deleted_at IS NOT NULL;   -- 削除済み\n\n-- WHERE の罠 (!= でも NULL 除外)\nSELECT * FROM users WHERE role != 'admin';\n-- → role が NULL の行も除外される (期待は admin 以外 + NULL)\n-- ✅ 明示的に\nSELECT * FROM users WHERE role != 'admin' OR role IS NULL;\nSELECT * FROM users WHERE COALESCE(role, '') != 'admin';\n\n-- COUNT の挙動\nSELECT COUNT(*) FROM users;                          -- 全行 (NULL 含む)\nSELECT COUNT(role) FROM users;                       -- role が NOT NULL の行\nSELECT COUNT(DISTINCT role) FROM users;              -- NULL を除いてユニーク数\n\n-- 集計関数も NULL を除外\nSELECT AVG(score) FROM tests;                        -- NULL は計算対象外\nSELECT SUM(amount) FROM orders;                      -- NULL の amount は無視\n\n-- COALESCE / NULLIF\nCOALESCE(score, 0)                                   -- NULL を 0 に\nNULLIF(value, 0)                                     -- value = 0 なら NULL に (0 除算回避等)\n\n-- IS DISTINCT FROM (NULL も等価判定、PG)\nSELECT * FROM users WHERE col IS DISTINCT FROM 'x';\n-- col != 'x' OR col IS NULL と等価\n\n-- Rails\nUser.where(deleted_at: nil)            -- IS NULL\nUser.where.not(deleted_at: nil)        -- IS NOT NULL",
    },
  },

  // ===========================================================================
  // 🔗 SQL 結合 拡張 (sql-036 〜 sql-047)
  // ===========================================================================
  {
    id: "sql-036",
    categoryId: "sql-joins",
    difficulty: "intermediate",
    type: "choice",
    question: "CROSS JOIN とは？",
    choices: [
      "INNER JOIN と同じ",
      "OUTER JOIN の一種",
      "JOIN の最適化",
      "デカルト積 — 全行 × 全行の組合せ (条件なし)、N × M 行を返す",
    ],
    answerIndex: 3,
    hints: [
      "ON 句なしで全組合せ。",
      "100 行 × 100 行 = 10000 行になる、注意。",
      "シリーズ生成 / 全組合せが必要な集計で使う。",
    ],
    explanation: {
      summary:
        "**CROSS JOIN** は条件なしで全行の組合せ (デカルト積)。N 行 × M 行 = N×M 行を返す。意図せず発生すると爆発的に行数が増える事故 → ON 忘れの INNER JOIN は自動で CROSS と等価に。",
      reason:
        "用途: 日付シリーズ × ユーザーで『全ユーザー × 全日付の空テーブル』を作って LEFT JOIN で穴埋め (アクティビティ集計の典型)、サイズ × 色の全組合せ生成、月別レポートのテンプレート。`generate_series` (PG) と組み合わせて時系列の穴埋めが定番。",
      codeExample:
        "-- 全組合せ (デカルト積)\nSELECT u.id, c.name\nFROM users u\nCROSS JOIN colors c;\n-- users 100 × colors 5 = 500 行\n\n-- 暗黙の CROSS JOIN (FROM に複数テーブル)\nSELECT * FROM users, colors;        -- = CROSS JOIN\n\n-- 日次アクティビティ集計 (穴埋め)\nWITH date_range AS (\n  SELECT generate_series(\n    DATE '2024-01-01',\n    DATE '2024-01-31',\n    INTERVAL '1 day'\n  )::date AS day\n),\nactive_users AS (\n  SELECT DISTINCT user_id FROM activity\n  WHERE created_at >= '2024-01-01'\n)\nSELECT u.user_id, d.day, COUNT(a.id) AS action_count\nFROM active_users u\nCROSS JOIN date_range d\nLEFT JOIN activity a ON a.user_id = u.user_id AND DATE(a.created_at) = d.day\nGROUP BY u.user_id, d.day\nORDER BY u.user_id, d.day;\n-- → 各ユーザー × 各日 (アクション 0 件の日も 0 として出力)\n\n-- 商品の全バリエーション\nSELECT s.size, c.color\nFROM sizes s CROSS JOIN colors c;",
    },
  },
  {
    id: "sql-037",
    categoryId: "sql-joins",
    difficulty: "intermediate",
    type: "choice",
    question: "従業員の上司情報を 1 つのテーブルから取得する書き方は？",
    code: "-- employees(id, name, manager_id) — manager_id は同じテーブルの id を参照",
    choices: [
      "RECURSIVE JOIN",
      "CROSS JOIN",
      "別テーブル分離が必須",
      "SELF JOIN — 同じテーブルにエイリアスを 2 つ付けて JOIN",
    ],
    answerIndex: 3,
    hints: [
      "同テーブルを 2 つの別名で JOIN。",
      "manager_id を持って自己参照する階層構造の頻出パターン。",
      "深い階層は再帰 CTE (sql-005x で別途)。",
    ],
    explanation: {
      summary:
        "**SELF JOIN** は同じテーブルに別名を付けて JOIN。階層構造 (organization tree、コメントツリー、カテゴリ階層) で頻出。多階層は再帰 CTE が必要。",
      reason:
        "1 階層だけなら LEFT JOIN で済む。複数階層を一度に取りたい時は recursive CTE。インデックス設計時に manager_id (parent_id) に INDEX 必須 (再帰展開で頻繁にアクセス)。N+1 を避けるため、UI 側で 1 度に階層を取って木構造に組み立てる。",
      codeExample:
        "-- 自己参照テーブル\nCREATE TABLE employees (\n  id BIGINT PRIMARY KEY,\n  name TEXT,\n  manager_id BIGINT REFERENCES employees(id)\n);\nCREATE INDEX idx_employees_manager ON employees(manager_id);\n\n-- SELF JOIN: 従業員 + 上司名 (1 階層)\nSELECT e.name AS employee, m.name AS manager\nFROM employees e\nLEFT JOIN employees m ON m.id = e.manager_id;\n\n-- 2 階層 (上司の上司)\nSELECT e.name AS employee,\n       m.name AS manager,\n       g.name AS grandmanager\nFROM employees e\nLEFT JOIN employees m ON m.id = e.manager_id\nLEFT JOIN employees g ON g.id = m.manager_id;\n\n-- 多階層 → 再帰 CTE\nWITH RECURSIVE chain AS (\n  -- 起点 (本人)\n  SELECT id, name, manager_id, 0 AS depth\n  FROM employees WHERE id = 5\n  UNION ALL\n  -- 再帰: 上司を辿る\n  SELECT e.id, e.name, e.manager_id, c.depth + 1\n  FROM employees e\n  JOIN chain c ON c.manager_id = e.id\n)\nSELECT * FROM chain ORDER BY depth;\n\n-- 似たパターン: コメントツリー、カテゴリ階層、地域階層",
    },
  },
  {
    id: "sql-038",
    categoryId: "sql-joins",
    difficulty: "intermediate",
    type: "choice",
    question: "次の 2 つの JOIN は同じ結果？",
    code: "-- A\nSELECT * FROM users u JOIN posts p ON u.id = p.user_id;\n\n-- B\nSELECT * FROM users u JOIN posts p USING (user_id);  -- ※ users にも user_id があれば",
    choices: [
      "B はエラー",
      "USING は両テーブルに同名カラムがある場合の短縮形 — 列が 1 つに統合される",
      "全く別物",
      "USING は廃止",
    ],
    answerIndex: 1,
    hints: [
      "USING (col) は両テーブルに同名の col がある時に書ける。",
      "JOIN 結果で col が 1 つに統合される (ON だと u.col と p.col が両方残る)。",
      "NATURAL JOIN は全同名カラムを自動 USING するが危険。",
    ],
    explanation: {
      summary:
        "`USING (col)` は両テーブルに同名カラムがある時の短縮形。`ON a.col = b.col` と等価だが、結果に col が 1 つだけ (ON だと両方残る)。`NATURAL JOIN` は全同名カラムで自動 JOIN だが、新カラム追加で予期せぬ JOIN が発生する罠で避けるのが定石。",
      reason:
        "USING は SELECT 結果が綺麗だが、Rails / ActiveRecord は基本 ON を生成。NATURAL JOIN は便利だが暗黙的すぎる → スキーマ変更で意味が変わる。命名規約 (user_id / post_id) を統一していれば USING は使いやすい。",
      codeExample:
        "-- ON (明示的、推奨)\nSELECT * FROM orders o\nJOIN customers c ON o.customer_id = c.id;\n\n-- USING (両テーブルに同名の列)\n-- orders.id と customers.id が両方ある場合\nSELECT * FROM orders\nJOIN customers USING (id);            -- id が結果に 1 つ\n\n-- ON だと両方残る (SELECT * の時に id が 2 つ表示される問題)\nSELECT * FROM orders o\nJOIN customers c ON o.id = c.id;     -- o.id と c.id 両方\n\n-- NATURAL JOIN (危険、避ける)\nSELECT * FROM orders NATURAL JOIN customers;\n-- 両テーブルの『全同名カラム』で自動 JOIN\n-- スキーマ変更 (例: 両方に updated_at 追加) で意味が変わる\n\n-- 安全な書き方\nSELECT * FROM orders o\nJOIN customers c ON o.customer_id = c.id\nWHERE c.active = true;\n\n-- Rails の生成 SQL\nOrder.joins(:customer)\n# SELECT orders.* FROM orders INNER JOIN customers ON customers.id = orders.customer_id",
    },
  },
  {
    id: "sql-039",
    categoryId: "sql-joins",
    difficulty: "advanced",
    type: "choice",
    question: "NATURAL JOIN を本番コードで使うべきでない主な理由は？",
    choices: [
      "遅い",
      "MySQL でしか動かない",
      "結果が空になる",
      "スキーマ進化 (新カラム追加) で意図せず JOIN 条件が変わるリスク、明示性に欠ける",
    ],
    answerIndex: 3,
    hints: [
      "両テーブルの『全同名カラム』で自動 JOIN。",
      "後から updated_at / created_at 等を両方に追加すると JOIN 結果が変わる。",
      "USING や ON で明示するのが堅牢。",
    ],
    explanation: {
      summary:
        "**NATURAL JOIN は使わない**が定石。両テーブルの『全同名カラム』で自動 JOIN するため、後からカラム追加で『気づかぬうちに JOIN 条件が変わる』。USING (col) か ON で明示的に書くべし。",
      reason:
        "例: users (id, name, created_at) と orders (id, user_id, created_at)。NATURAL JOIN は id だけでなく created_at でも一致を要求 → 普通は 0 行。コードレビューで疑問符が付くし、教科書 / 仕様書では出てくるが実務では原則禁止。",
      codeExample:
        "-- NATURAL JOIN の罠\nCREATE TABLE users (id BIGINT, name TEXT);\nCREATE TABLE orders (id BIGINT, user_id BIGINT, amount DECIMAL);\n\n-- 初期\nSELECT * FROM orders NATURAL JOIN users;\n-- 両テーブルの id で JOIN (意図と違うかも、orders.id = users.id?)\n\n-- 後で created_at を追加\nALTER TABLE users ADD COLUMN created_at TIMESTAMPTZ;\nALTER TABLE orders ADD COLUMN created_at TIMESTAMPTZ;\n\n-- NATURAL JOIN の結果が変わる\nSELECT * FROM orders NATURAL JOIN users;\n-- 今は id + created_at の両方一致を要求 → 0 行になる\n\n-- ✅ 明示的に\nSELECT * FROM orders o\nJOIN users u ON u.id = o.user_id;\n\n-- USING も比較的安全 (列を明示)\nSELECT * FROM order_items\nJOIN products USING (product_id);\n\n-- 教科書での出現例 (実務避ける)\nSELECT * FROM departments NATURAL JOIN employees;",
    },
  },
  {
    id: "sql-040",
    categoryId: "sql-joins",
    difficulty: "advanced",
    type: "choice",
    question: "PostgreSQL の LATERAL JOIN の主な用途は？",
    choices: [
      "INDEX 専用",
      "テーブル削除",
      "サブクエリが『各左テーブル行』を参照可能 — 行ごとのトップ N / 関数 JOIN で重宝",
      "並列実行",
    ],
    answerIndex: 2,
    hints: [
      "通常のサブクエリは外側を参照不可、LATERAL なら参照可。",
      "『各ユーザーの最新 3 投稿』のような行ごと TOP-N に最適。",
      "PostgreSQL / Oracle / SQL Server (CROSS APPLY) で利用可能。",
    ],
    explanation: {
      summary:
        "**LATERAL JOIN** はサブクエリが外側の行を参照可能。行ごとの TOP N、`generate_series` 等の集合関数を行ごとに展開、複雑な計算を再利用するなどに使う。SQL Server は同等の `CROSS APPLY` / `OUTER APPLY`。",
      reason:
        "GROUP BY + DISTINCT ON / ROW_NUMBER の代替で『各ユーザーの最新 N 件』『各カテゴリの上位 5 商品』などをエレガントに書ける。実行計画は INNER LATERAL JOIN として展開、INDEX が効くと高速。MySQL は LATERAL を持たない (8.0.14+ で対応)。",
      codeExample:
        "-- 各ユーザーの最新 3 投稿\nSELECT u.id, u.name, p.title, p.created_at\nFROM users u,\nLATERAL (\n  SELECT title, created_at\n  FROM posts\n  WHERE user_id = u.id\n  ORDER BY created_at DESC\n  LIMIT 3\n) p;\n\n-- LEFT JOIN LATERAL (投稿 0 件のユーザーも残す)\nSELECT u.id, u.name, p.title\nFROM users u\nLEFT JOIN LATERAL (\n  SELECT title FROM posts WHERE user_id = u.id ORDER BY created_at DESC LIMIT 1\n) p ON true;\n\n-- generate_series を行ごとに\nSELECT u.id, d.day\nFROM users u,\nLATERAL generate_series(\n  u.signup_date,\n  u.signup_date + INTERVAL '30 days',\n  INTERVAL '1 day'\n) AS d(day);\n-- 各ユーザーの登録後 30 日分の日付を生成\n\n-- 複雑な計算の再利用\nSELECT o.id, calc.total, calc.tax, calc.grand_total\nFROM orders o,\nLATERAL (\n  SELECT\n    SUM(amount) AS total,\n    SUM(amount) * 0.1 AS tax,\n    SUM(amount) * 1.1 AS grand_total\n  FROM order_items WHERE order_id = o.id\n) calc;\n\n-- SQL Server の同等 (CROSS APPLY)\nSELECT * FROM users u\nCROSS APPLY (SELECT TOP 3 * FROM posts WHERE user_id = u.id) p;",
    },
  },
  {
    id: "sql-041",
    categoryId: "sql-joins",
    difficulty: "advanced",
    type: "choice",
    question: "『A にあって B に無い』(ANTI JOIN) の最も推奨される書き方は？",
    choices: [
      "NOT EXISTS (NULL 安全 + INDEX 効果 + 早期終了)",
      "NOT IN (サブクエリ)",
      "LEFT JOIN ... WHERE b.id IS NULL",
      "EXCEPT",
    ],
    answerIndex: 0,
    hints: [
      "NOT IN はサブクエリ結果に NULL を含むと『全部 false』になる罠。",
      "NOT EXISTS は NULL 安全 + 多くの DB で最適化済み。",
      "LEFT JOIN + IS NULL も等価だが可読性で劣る。",
    ],
    explanation: {
      summary:
        "ANTI JOIN は 3 通り書ける。**NOT EXISTS** が最推奨 (NULL 安全 + INDEX 効果 + 早期終了)。**NOT IN** は NULL 罠で危険。**LEFT JOIN + IS NULL** は同等性能だが冗長。",
      reason:
        "NOT IN の罠: サブクエリ結果に 1 つでも NULL があると、`x NOT IN (1, NULL)` は『x != 1 AND x != NULL』 → NULL 比較で NULL → WHERE で除外。NOT EXISTS は 1 行見つかれば早期終了するので大規模で速い。EXCEPT は完全な集合差で重複排除を含む (UNION 系)。",
      codeExample:
        "-- ✅ NOT EXISTS (推奨)\nSELECT * FROM users u\nWHERE NOT EXISTS (\n  SELECT 1 FROM orders o WHERE o.user_id = u.id\n);\n-- 注文ゼロのユーザー\n\n-- ❌ NOT IN (NULL 罠)\nSELECT * FROM users\nWHERE id NOT IN (SELECT user_id FROM orders);\n-- orders.user_id に NULL があると 0 件になる\n\n-- ✅ NOT IN の安全版\nSELECT * FROM users\nWHERE id NOT IN (SELECT user_id FROM orders WHERE user_id IS NOT NULL);\n\n-- LEFT JOIN + IS NULL (等価、冗長)\nSELECT u.*\nFROM users u\nLEFT JOIN orders o ON o.user_id = u.id\nWHERE o.id IS NULL;\n\n-- EXCEPT (完全集合差、重複排除)\nSELECT id FROM users\nEXCEPT\nSELECT user_id FROM orders;\n-- → 注文ゼロのユーザー id のみ (重複排除済み)\n\n-- 性能比較\n-- NOT EXISTS: O(n) で早期終了\n-- NOT IN: 全件評価 (NULL なしの場合)、NULL 含むと 0 件\n-- LEFT JOIN: 全件 LEFT JOIN してから filter (大規模で重い)\n\n-- Rails\nUser.where.missing(:orders)                          -- LEFT JOIN + IS NULL\nUser.where.not(id: Order.select(:user_id))           -- NOT IN (罠あり)",
    },
  },
  {
    id: "sql-042",
    categoryId: "sql-joins",
    difficulty: "intermediate",
    type: "choice",
    question: "『A の中で B に存在するもの』(SEMI JOIN) の慣用句は？",
    choices: [
      "SELECT DISTINCT a.* FROM ...",
      "LATERAL",
      "EXISTS (...) — 結果は A の列のみ、1 件見つかれば早期終了",
      "INNER JOIN B (重複あり)",
    ],
    answerIndex: 2,
    hints: [
      "EXISTS / IN サブクエリは『あるかないかだけ』判定。",
      "INNER JOIN は B 側が複数あると A 側を重複させる。",
      "1 件見つかれば早期終了するので高速。",
    ],
    explanation: {
      summary:
        "SEMI JOIN は『A の中で B に存在するもの』。**EXISTS** が最適 (早期終了、A 列のみ)。**IN** も同等だがリスト渡しでサブクエリ最適化が変わる。INNER JOIN は B 側が多対 1 の時に A を重複させる罠。",
      reason:
        "INNER JOIN で重複させたくない時に EXISTS。例: 投稿を 1 件以上持つユーザーを取りたい (重複なし)。EXISTS は SELECT 内の列が無視される (`SELECT 1` でも `SELECT *` でも結果同じ)、早期終了で大量行に強い。SQL ガイド 4 章でも触れる。",
      codeExample:
        "-- ✅ EXISTS (重複なし、早期終了)\nSELECT * FROM users u\nWHERE EXISTS (\n  SELECT 1 FROM posts p WHERE p.user_id = u.id\n);\n-- 投稿が 1 件以上あるユーザー\n\n-- IN (同等)\nSELECT * FROM users\nWHERE id IN (SELECT user_id FROM posts);\n\n-- ❌ INNER JOIN だと重複\nSELECT u.*\nFROM users u\nJOIN posts p ON p.user_id = u.id;\n-- u は posts 件数だけ重複する\n\n-- ✅ DISTINCT で回避 (重い)\nSELECT DISTINCT u.*\nFROM users u\nJOIN posts p ON p.user_id = u.id;\n\n-- 性能: EXISTS が一般に最速\n-- INDEX (posts.user_id) があれば EXISTS は O(n) で各 user について 1 件検索\n\n-- 複雑条件\nSELECT * FROM users u\nWHERE EXISTS (\n  SELECT 1 FROM orders o\n  WHERE o.user_id = u.id\n    AND o.created_at > NOW() - INTERVAL '30 days'\n    AND o.amount > 1000\n);\n-- 30 日以内に 1000 円超の注文があるユーザー\n\n-- Rails\nUser.where('EXISTS (SELECT 1 FROM posts WHERE posts.user_id = users.id)')\nUser.joins(:posts).distinct                          -- INNER JOIN + DISTINCT (重い)\nUser.where(id: Post.select(:user_id))                -- IN サブクエリ",
    },
  },
  {
    id: "sql-043",
    categoryId: "sql-joins",
    difficulty: "intermediate",
    type: "choice",
    question: "UNION と UNION ALL の違いは？",
    choices: [
      "UNION は重複排除 (DISTINCT 相当で遅い)、UNION ALL は重複そのまま (速い)",
      "完全に同じ",
      "UNION は廃止",
      "UNION ALL は順序を保証",
    ],
    answerIndex: 0,
    hints: [
      "UNION は内部で SORT + DISTINCT が走る。",
      "重複が無いと分かっているなら UNION ALL の方が圧倒的に速い。",
      "両者とも列の型 / 数が一致している必要あり。",
    ],
    explanation: {
      summary:
        "**UNION** は両クエリの結果を結合 + 重複排除 (SORT が走るので遅い)。**UNION ALL** は重複そのまま (速い)。デフォルト UNION ALL を選び、重複排除が本当に必要な時だけ UNION。",
      reason:
        "両側のクエリは列数 + 列の型が一致。順序は保証されない (ORDER BY を最後に)。INTERSECT (両方にあるもの)、EXCEPT (A から B を引く) も同じ系統。LIMIT は最後のクエリだけでなく全体に効く。",
      codeExample:
        "-- UNION ALL (推奨、速い)\nSELECT id, name FROM employees WHERE department = 'eng'\nUNION ALL\nSELECT id, name FROM contractors WHERE department = 'eng';\n-- 結果に重複あり\n\n-- UNION (重複排除、遅い)\nSELECT email FROM users\nUNION\nSELECT email FROM customers;\n-- 重複 email は 1 つに\n\n-- 列の数 + 型を揃える\nSELECT id, name, NULL AS extra FROM a\nUNION ALL\nSELECT id, name, type FROM b;\n-- a に extra 列が無いので NULL で埋める\n\n-- ORDER BY は最後だけ (全体に効く)\nSELECT id FROM a\nUNION ALL\nSELECT id FROM b\nORDER BY id;\n\n-- LIMIT も全体\n(SELECT id FROM a ORDER BY id LIMIT 5)\nUNION ALL\n(SELECT id FROM b ORDER BY id LIMIT 5);\n-- 各サブクエリに LIMIT を個別に → 括弧 + ORDER BY/LIMIT を個別に\n\n-- INTERSECT / EXCEPT\nSELECT id FROM a INTERSECT SELECT id FROM b;   -- 両方にある\nSELECT id FROM a EXCEPT SELECT id FROM b;       -- a から b を引く\n\n-- 用途例\n-- アクティブユーザー = ログインユーザー UNION 注文ユーザー\nSELECT user_id FROM logins WHERE created_at > NOW() - INTERVAL '7 days'\nUNION\nSELECT user_id FROM orders WHERE created_at > NOW() - INTERVAL '7 days';",
    },
  },
  {
    id: "sql-044",
    categoryId: "sql-joins",
    difficulty: "advanced",
    type: "choice",
    question: "INTERSECT と EXCEPT の用途は？",
    choices: [
      "INTERSECT = 両方にある (積集合) / EXCEPT = A にあって B に無い (差集合) — 重複排除込み",
      "JOIN の別名",
      "GROUP BY の別名",
      "ORDER BY の別名",
    ],
    answerIndex: 0,
    hints: [
      "UNION と同じ集合演算ファミリー。",
      "INTERSECT ALL / EXCEPT ALL で重複保持 (PG)。",
      "MySQL は INTERSECT / EXCEPT を持たない (8.0.31+ で対応)。",
    ],
    explanation: {
      summary:
        "**INTERSECT** = 両方にある集合 (積)、**EXCEPT** = A にあって B に無い (差)。デフォルトで重複排除。`INTERSECT ALL` / `EXCEPT ALL` で重複保持 (PostgreSQL)。MySQL は 8.0.31+ で対応。",
      reason:
        "用途: 『重複ユーザー検出』(INTERSECT)、『削除されたデータの検出』(EXCEPT)、『データ移行の差分確認』。性能: 内部で SORT が走るので大規模では遅い → EXISTS / NOT EXISTS の方が高速な場合も。",
      codeExample:
        "-- INTERSECT (両方にある)\nSELECT email FROM customers\nINTERSECT\nSELECT email FROM newsletter_subscribers;\n-- 両方にいるユーザー\n\n-- EXCEPT (A - B)\nSELECT id FROM users\nEXCEPT\nSELECT user_id FROM orders;\n-- 注文をしていないユーザー\n\n-- 重複保持 (PG)\nSELECT x FROM a INTERSECT ALL SELECT x FROM b;\nSELECT x FROM a EXCEPT ALL SELECT x FROM b;\n\n-- データ移行の差分確認\nSELECT id, name FROM old_db.users\nEXCEPT\nSELECT id, name FROM new_db.users;\n-- 移行で失われた行\n\n-- 用途: 重複検出\nSELECT email, COUNT(*) FROM users GROUP BY email HAVING COUNT(*) > 1;\n-- これでも代替可能、INTERSECT は『別ソースとの比較』に強い\n\n-- 性能比較\n-- INTERSECT: SORT + UNIQUE で重い → EXISTS の方が速い場合も\n-- EXCEPT: 同様、NOT EXISTS の代替を検討",
    },
  },
  {
    id: "sql-045",
    categoryId: "sql-joins",
    difficulty: "advanced",
    type: "choice",
    question: "3 テーブル以上の JOIN で性能を出すために重要なのは？",
    choices: [
      "JOIN 条件のカラム (FK / 結合キー) に INDEX、選択性の高い WHERE を早めに評価、EXPLAIN で plan 確認",
      "JOIN の順序は性能に無関係",
      "サブクエリにする",
      "INDEX 不要",
    ],
    answerIndex: 0,
    hints: [
      "JOIN 条件のカラムには INDEX 必須。",
      "WHERE で行数が大幅に絞れるテーブルから処理が始まると速い。",
      "Optimizer は JOIN 順を自動で並び替えるが、heuristics 失敗もあり EXPLAIN で確認。",
    ],
    explanation: {
      summary:
        "(1) JOIN 条件カラムに INDEX、(2) WHERE で大幅に絞れる側から処理、(3) `EXPLAIN ANALYZE` で実際の plan / 行数 / 時間を確認、(4) 必要なら `STRAIGHT_JOIN` (MySQL) / pg_hint_plan で JOIN 順を強制。",
      reason:
        "PostgreSQL の cost-based optimizer は統計情報 (ANALYZE) で行数推定 → JOIN 順を最適化。統計が古いと misestimate で遅い plan を選ぶ。`ANALYZE table` で更新。実測時間と推定行数が大きく外れている場合は統計を再収集 or extended statistics を考慮。",
      codeExample:
        "-- 3 テーブル JOIN\nSELECT u.name, p.title, c.body\nFROM users u\nJOIN posts p ON p.user_id = u.id\nJOIN comments c ON c.post_id = p.id\nWHERE u.country = 'JP'\n  AND p.published = true;\n\n-- 必須 INDEX\nCREATE INDEX idx_posts_user_id ON posts(user_id);\nCREATE INDEX idx_comments_post_id ON comments(post_id);\nCREATE INDEX idx_users_country ON users(country);\nCREATE INDEX idx_posts_published ON posts(published) WHERE published;  -- partial\n\n-- EXPLAIN で確認\nEXPLAIN (ANALYZE, BUFFERS) SELECT ... ;\n-- → Nested Loop / Hash Join / Merge Join を確認\n-- → rows と actual rows の乖離をチェック\n\n-- 統計更新\nANALYZE users;\nANALYZE posts;\nANALYZE comments;\n\n-- VACUUM ANALYZE で同時に\nVACUUM ANALYZE;\n\n-- 計画ヒント (PG: pg_hint_plan extension)\n/*+ HashJoin(u p) IndexScan(p idx_posts_user_id) */\nSELECT ... ;\n\n-- MySQL の JOIN 順強制\nSELECT STRAIGHT_JOIN ... FROM a JOIN b ON ... ;   -- FROM の順で JOIN",
    },
  },
  {
    id: "sql-046",
    categoryId: "sql-joins",
    difficulty: "intermediate",
    type: "choice",
    question: "次の 2 つは同じ結果になる？",
    code: "-- A\nSELECT name FROM users WHERE id IN (SELECT user_id FROM posts);\n\n-- B\nSELECT u.name FROM users u JOIN posts p ON p.user_id = u.id;",
    choices: [
      "結果は近いが B は posts の数だけ重複する (DISTINCT が無いと u は重複)",
      "完全に同じ",
      "A はエラー",
      "B の方が遅い",
    ],
    answerIndex: 0,
    hints: [
      "IN サブクエリは『あるかないか』(SEMI JOIN) → 重複なし。",
      "INNER JOIN は B 側の件数だけ A 側を増やす。",
      "重複なしが欲しいなら EXISTS / IN を使う。",
    ],
    explanation: {
      summary:
        "サブクエリ (IN / EXISTS) は SEMI JOIN で重複なし。INNER JOIN は B 側が多対 1 の時に A 側を重複させる。重複なしが欲しいなら EXISTS / IN、DISTINCT で repair も可能。",
      reason:
        "現代の DB はサブクエリと JOIN を内部で同じ実行計画に変換する場合が多い (semi-join 最適化)。可読性: 『あるかないか』なら EXISTS、『複数取得 + 集計』なら JOIN + GROUP BY。N+1 を避けるため、関連データを 1 度に取りたい時は JOIN + includes (Rails)。",
      codeExample:
        "-- IN / EXISTS: SEMI JOIN (重複なし)\nSELECT name FROM users WHERE id IN (SELECT user_id FROM posts);\nSELECT name FROM users u WHERE EXISTS (SELECT 1 FROM posts p WHERE p.user_id = u.id);\n\n-- INNER JOIN: 重複あり (posts の件数だけ u が増える)\nSELECT u.name FROM users u JOIN posts p ON p.user_id = u.id;\n\n-- INNER JOIN + DISTINCT (重複排除、重い)\nSELECT DISTINCT u.name FROM users u JOIN posts p ON p.user_id = u.id;\n\n-- 関連データも取りたい (INNER JOIN が正解)\nSELECT u.name, p.title FROM users u JOIN posts p ON p.user_id = u.id;\n\n-- LEFT JOIN は『投稿なしユーザーも含む』\nSELECT u.name, p.title FROM users u LEFT JOIN posts p ON p.user_id = u.id;\n\n-- 集計と組合せ\nSELECT u.name, COUNT(p.id) AS post_count\nFROM users u LEFT JOIN posts p ON p.user_id = u.id\nGROUP BY u.id, u.name;\n\n-- 使い分け\n-- 重複なし + B 列不要: EXISTS / IN\n-- B 列も欲しい: JOIN\n-- B が無い場合も A を残す: LEFT JOIN\n-- 集計: JOIN + GROUP BY (重複問題に注意)",
    },
  },
  {
    id: "sql-047",
    categoryId: "sql-joins",
    difficulty: "advanced",
    type: "choice",
    question: "FROM 句の中で書くサブクエリ (derived table) の用途は？",
    choices: [
      "中間結果を一時テーブルのように扱い、その上で集計 / JOIN — CTE (WITH) の前身",
      "INDEX の代替",
      "JOIN の禁止",
      "削除専用",
    ],
    answerIndex: 0,
    hints: [
      "FROM (SELECT ... FROM ...) AS alias の形。",
      "段階的な処理を 1 クエリで書く時に使う。",
      "WITH (CTE) の方が読みやすい場合が多い。",
    ],
    explanation: {
      summary:
        "**Derived table** (FROM 句のサブクエリ) は中間結果を仮想テーブル化。`FROM (SELECT ... ) AS t` の形。**WITH (CTE)** が読みやすい代替。段階的な集計、ピボット風処理、複雑な WHERE で使う。",
      reason:
        "CTE は MySQL 8+ / PG / Oracle で利用可、複数の中間結果を名前付きで書ける + 再帰可。Derived table はネストが深くなるので可読性で劣るが古い MySQL でも動く。実行計画上は同等が多い (現代の最適化器)。",
      codeExample:
        "-- Derived table (FROM 句サブクエリ)\nSELECT t.user_id, t.total\nFROM (\n  SELECT user_id, SUM(amount) AS total\n  FROM orders\n  GROUP BY user_id\n) AS t\nJOIN users u ON u.id = t.user_id\nWHERE t.total > 10000;\n\n-- CTE (WITH) で同等 (読みやすい、推奨)\nWITH user_totals AS (\n  SELECT user_id, SUM(amount) AS total\n  FROM orders\n  GROUP BY user_id\n)\nSELECT u.name, t.total\nFROM user_totals t\nJOIN users u ON u.id = t.user_id\nWHERE t.total > 10000;\n\n-- 複数の中間結果\nWITH active_users AS (\n  SELECT id FROM users WHERE last_login_at > NOW() - INTERVAL '7 days'\n),\nbig_spenders AS (\n  SELECT user_id FROM orders WHERE amount > 10000\n)\nSELECT u.* FROM users u\nWHERE u.id IN (SELECT id FROM active_users)\n  AND u.id IN (SELECT user_id FROM big_spenders);\n\n-- 再帰 CTE (Derived では不可)\nWITH RECURSIVE category_tree AS (\n  SELECT id, name, parent_id, 0 AS depth FROM categories WHERE parent_id IS NULL\n  UNION ALL\n  SELECT c.id, c.name, c.parent_id, t.depth + 1\n  FROM categories c JOIN category_tree t ON c.parent_id = t.id\n)\nSELECT * FROM category_tree;\n\n-- PostgreSQL: CTE は『最適化フェンス』だったが PG 12+ で inline 化されるように",
    },
  },

  // ===========================================================================
  // 📈 SQL 上級 拡張 (sql-048 〜 sql-060)
  // ===========================================================================
  {
    id: "sql-048",
    categoryId: "sql-advanced",
    difficulty: "advanced",
    type: "choice",
    question: "標準 SQL のトランザクション分離レベル 4 つを弱い順に並べると？",
    choices: [
      "全部同じ",
      "READ UNCOMMITTED < READ COMMITTED < REPEATABLE READ < SERIALIZABLE",
      "SERIALIZABLE < REPEATABLE READ < READ COMMITTED < READ UNCOMMITTED",
      "REPEATABLE READ < READ COMMITTED < SERIALIZABLE < READ UNCOMMITTED",
    ],
    answerIndex: 1,
    hints: [
      "弱い = 並行性 ◎・整合性 ▲、強い = 並行性 ▲・整合性 ◎。",
      "READ UNCOMMITTED は dirty read を許容 (PG では実装上 RC と同じ)。",
      "PostgreSQL のデフォルトは READ COMMITTED、MySQL InnoDB は REPEATABLE READ。",
    ],
    explanation: {
      summary:
        "弱い順: **READ UNCOMMITTED** (dirty read OK) < **READ COMMITTED** (commit 済みのみ見える、PG デフォルト) < **REPEATABLE READ** (同一 TX 内で同じ行は同じ値、MySQL InnoDB デフォルト) < **SERIALIZABLE** (完全直列化と等価)。",
      reason:
        "防げる現象: dirty read (未 commit を読む) / non-repeatable read (同じ行が変わる) / phantom read (新行が出現)。SERIALIZABLE は全防止だが性能コスト大 + デッドロックリスク増。PG の SERIALIZABLE は SSI (Serializable Snapshot Isolation) で MVCC 基盤、競合検出で abort。",
      codeExample:
        "-- 分離レベルの設定\nBEGIN;\nSET TRANSACTION ISOLATION LEVEL SERIALIZABLE;\n-- or READ COMMITTED, REPEATABLE READ, READ UNCOMMITTED\n...\nCOMMIT;\n\n-- セッション全体に\nSET DEFAULT_TRANSACTION_ISOLATION TO 'serializable';\n\n-- PostgreSQL の挙動 (READ UNCOMMITTED は実装上 RC と同じ)\nSHOW transaction_isolation;\n\n-- 防げる現象\n-- Dirty Read: 未 commit を読む → READ COMMITTED 以上で防止\n-- Non-repeatable Read: 同じ行が再 SELECT で変わる → REPEATABLE READ で防止\n-- Phantom Read: WHERE で新たな行が出現 → SERIALIZABLE で防止\n\n-- 性能トレードオフ\n-- 強い分離 → ロック増 → デッドロック増 → リトライ実装が必要\n-- 弱い分離 → アプリ側で整合性を補完 (楽観ロック等)\n\n-- 一般的な選択\n-- 通常: READ COMMITTED (PG デフォルト)\n-- 整合性重要 + 短い TX: REPEATABLE READ\n-- 厳格な整合性 (会計等): SERIALIZABLE + リトライ\n\n-- Rails\nActiveRecord::Base.transaction(isolation: :serializable) do\n  # ... 処理\nrescue ActiveRecord::SerializationFailure\n  retry  # シリアライゼーション失敗で再試行\nend",
    },
  },
  {
    id: "sql-049",
    categoryId: "sql-advanced",
    difficulty: "advanced",
    type: "choice",
    question: "PostgreSQL の MVCC で『同じトランザクション内で同じ行が違う値に見える』現象を防ぐ分離レベルは？",
    choices: [
      "REPEATABLE READ 以上 — Snapshot を TX 開始時点で固定",
      "READ UNCOMMITTED",
      "READ COMMITTED",
      "MVCC では不可",
    ],
    answerIndex: 0,
    hints: [
      "READ COMMITTED は『各 SELECT 時点の snapshot』 → 同じ TX 内でも値が変わりうる。",
      "REPEATABLE READ は『TX 開始時の snapshot』を固定。",
      "PG の MVCC は snapshot ベースで実装、各行に xmin/xmax を持つ。",
    ],
    explanation: {
      summary:
        "**READ COMMITTED** は各 SELECT で『現在の commit 済み snapshot』を見るので、TX 内で値が変わりうる (non-repeatable read)。**REPEATABLE READ** 以上は『TX 開始時の snapshot』を維持。PG の MVCC は MVCC スナップショットで実装。",
      reason:
        "MVCC (Multi-Version Concurrency Control): 各行に xmin (作成 TX) / xmax (削除 TX) を持ち、各 TX は自分の snapshot に見える行だけ取得。**ロックフリー読み込み**が可能。VACUUM が古いバージョンを掃除。長時間 TX があると bloat (肥大化)、`pg_stat_activity` で長時間 TX を監視。",
      codeExample:
        "-- READ COMMITTED の挙動 (PG デフォルト)\n-- TX1\nBEGIN;\nSELECT amount FROM accounts WHERE id = 1;  -- 100\n-- TX2 が COMMIT で amount = 200 に\nSELECT amount FROM accounts WHERE id = 1;  -- 200 (変わる)\nCOMMIT;\n\n-- REPEATABLE READ\nBEGIN;\nSET TRANSACTION ISOLATION LEVEL REPEATABLE READ;\nSELECT amount FROM accounts WHERE id = 1;  -- 100\n-- TX2 が COMMIT で amount = 200 に\nSELECT amount FROM accounts WHERE id = 1;  -- 100 (固定)\nCOMMIT;\n\n-- MVCC の確認\nSELECT xmin, xmax, * FROM accounts WHERE id = 1;\n-- xmin: 作成 TX 番号、xmax: 削除 TX 番号 (0 なら未削除)\n\n-- 長時間 TX が引き起こす bloat\n-- TX が長時間 open → 古い行バージョンが VACUUM できず肥大化\nSELECT pid, query_start, state, query\nFROM pg_stat_activity\nWHERE state != 'idle' AND query_start < NOW() - INTERVAL '1 hour';\n\n-- 強制 VACUUM\nVACUUM (VERBOSE, ANALYZE) accounts;\nVACUUM FULL accounts;          -- テーブル全体を書き換え (ロック取る、本番注意)",
    },
  },
  {
    id: "sql-050",
    categoryId: "sql-advanced",
    difficulty: "advanced",
    type: "choice",
    question: "『行を読んだ後に確実に自分が更新する』ための悲観ロック構文は？",
    choices: [
      "SELECT WITH LOCK",
      "BEGIN EXCLUSIVE",
      "LOCK SELECT",
      "SELECT ... FOR UPDATE (他の TX が同じ行に SELECT FOR UPDATE / UPDATE できなくなる)",
    ],
    answerIndex: 3,
    hints: [
      "FOR UPDATE で行ロック、競合する TX は待たされる。",
      "SKIP LOCKED で『他がロック中の行はスキップ』(キュー実装に便利)。",
      "NOWAIT で『すぐ取れなければ即エラー』。",
    ],
    explanation: {
      summary:
        "`SELECT ... FOR UPDATE` で行ロック (悲観ロック)。他 TX は同じ行を FOR UPDATE / UPDATE / DELETE で待たされる。`SKIP LOCKED` でロック中をスキップ (job queue 実装で人気)、`NOWAIT` で即エラー。",
      reason:
        "用途: 在庫の更新 / 金額の加算 / ID 採番。楽観ロック (lock_version カラム + UPDATE 時の WHERE で衝突検知) の代替。デッドロック注意: 2 つの TX が違う順で同じ行をロックすると発生 → 同じ順序で取る規約 / アプリでリトライ。FOR SHARE は読み取りロック (他は読めるが UPDATE は待たされる)。",
      codeExample:
        "-- 悲観ロック (在庫減算)\nBEGIN;\nSELECT stock FROM products WHERE id = 1 FOR UPDATE;\n-- 他 TX は同じ行を SELECT FOR UPDATE / UPDATE できない (待つ)\nUPDATE products SET stock = stock - 1 WHERE id = 1;\nCOMMIT;\n\n-- SKIP LOCKED (キュー実装)\nBEGIN;\nSELECT * FROM jobs\nWHERE status = 'pending'\nORDER BY created_at\nLIMIT 1\nFOR UPDATE SKIP LOCKED;     -- 他が処理中の job はスキップ\n-- 取得した job を処理\nUPDATE jobs SET status = 'processing' WHERE id = ?;\nCOMMIT;\n\n-- NOWAIT (即エラー)\nSELECT * FROM products WHERE id = 1 FOR UPDATE NOWAIT;\n-- 他がロック中なら即 ERROR: could not obtain lock\n\n-- FOR SHARE (読み取り共有ロック)\nSELECT * FROM products WHERE id = 1 FOR SHARE;\n-- 他の SELECT FOR SHARE は OK、UPDATE は待つ\n\n-- 楽観ロック (Rails の lock_version)\nclass Product < ApplicationRecord\n  # lock_version カラムがあれば自動で楽観ロック\nend\np = Product.find(1)\np.stock -= 1\np.save!   -- UPDATE ... WHERE id = 1 AND lock_version = 5\n          -- 他が更新済みなら ActiveRecord::StaleObjectError\n\n-- Rails で悲観ロック\nProduct.transaction do\n  p = Product.lock.find(1)         -- FOR UPDATE\n  p.update!(stock: p.stock - 1)\nend\n\nProduct.lock('FOR UPDATE SKIP LOCKED').first",
    },
  },
  {
    id: "sql-051",
    categoryId: "sql-advanced",
    difficulty: "advanced",
    type: "choice",
    question: "デッドロックを避ける一般的な戦略は？",
    choices: [
      "デッドロックは防げない",
      "(1) 全 TX で同じ順序でロックを取る、(2) TX を短く、(3) 失敗時の自動リトライを実装、(4) 必要に応じて SERIALIZABLE で SSI に任せる",
      "ロックを使わない",
      "SLEEP で待つ",
    ],
    answerIndex: 1,
    hints: [
      "デッドロックは『2 つの TX が違う順序で同じ行をロック』で発生。",
      "DB がデッドロック検出して片方を abort。",
      "アプリで rescue + retry が必須。",
    ],
    explanation: {
      summary:
        "対策: (1) **同じ順序でロック**を取る規約 (id 昇順、テーブル名アルファベット順)、(2) TX を短くしてロック時間を最小化、(3) **失敗時のリトライ実装** (rescue + retry with backoff)、(4) PG SERIALIZABLE で SSI に任せて競合時 abort + リトライ。",
      reason:
        "DB はデッドロックを検出して 1 つの TX を abort (Postgres は deadlock_timeout 後にチェック)。アプリは `ActiveRecord::Deadlocked` 等を rescue してリトライ。`pg_locks` / `pg_stat_activity` で現在のロック状況を監視。長時間 TX や巨大バッチでロック競合が増える → 小分けにする。",
      codeExample:
        "-- デッドロックの例\n-- TX1: id=1 をロック → id=2 待ち\n-- TX2: id=2 をロック → id=1 待ち\n-- → DB が検出して片方 abort\n\n-- ✅ 同じ順序で取る (id 昇順)\nBEGIN;\nSELECT * FROM accounts WHERE id IN (1, 2) ORDER BY id FOR UPDATE;\n-- → 必ず id=1 → id=2 の順でロック → デッドロック回避\nUPDATE accounts SET amount = amount + 100 WHERE id = 1;\nUPDATE accounts SET amount = amount - 100 WHERE id = 2;\nCOMMIT;\n\n-- リトライ実装 (Rails)\ndef transfer(from_id, to_id, amount)\n  retries = 0\n  begin\n    ActiveRecord::Base.transaction do\n      # id 昇順でロック\n      first, second = [from_id, to_id].minmax\n      accounts = Account.where(id: [first, second]).lock.order(:id)\n      from_acc = accounts.find { |a| a.id == from_id }\n      to_acc = accounts.find { |a| a.id == to_id }\n      from_acc.update!(amount: from_acc.amount - amount)\n      to_acc.update!(amount: to_acc.amount + amount)\n    end\n  rescue ActiveRecord::Deadlocked\n    retries += 1\n    if retries < 3\n      sleep(0.1 * retries)        # backoff\n      retry\n    else\n      raise\n    end\n  end\nend\n\n-- 現在のロック状況確認 (PG)\nSELECT pid, relation::regclass, mode, granted, query\nFROM pg_locks l\nJOIN pg_stat_activity a USING (pid)\nWHERE NOT granted;                   -- 待っているロック\n\n-- デッドロック検出までの時間\nSHOW deadlock_timeout;               -- default 1s",
    },
  },
  {
    id: "sql-052",
    categoryId: "sql-advanced",
    difficulty: "intermediate",
    type: "choice",
    question: "PostgreSQL の `EXPLAIN ANALYZE` の出力で重要な情報は？",
    choices: [
      "ファイルサイズ",
      "サーバ稼働時間",
      "actual rows / planned rows の乖離、実際の実行時間 (actual time)、各ノードのコスト、使われた INDEX",
      "クエリの行数のみ",
    ],
    answerIndex: 2,
    hints: [
      "EXPLAIN (推定) と EXPLAIN ANALYZE (実測) は別物。",
      "rows=推定 vs actual rows=実測 の乖離が大きいと統計古い (ANALYZE が必要)。",
      "Seq Scan / Index Scan / Bitmap / Hash Join 等のノード種別を見る。",
    ],
    explanation: {
      summary:
        "`EXPLAIN ANALYZE` で実測値: **actual rows** vs 推定 rows、**actual time**、ノード種別 (Seq Scan / Index Scan / Hash Join 等)、Filter で除外された行数、Buffers (BUFFERS オプションで)。推定と実測の乖離は統計古い → ANALYZE。",
      reason:
        "実行計画の読み方: ボトムアップ (深いノードから)、`->` が子ノード、cost は『開始コスト..総コスト』、rows は推定。ANALYZE オプションで実測、BUFFERS で I/O ページ数、FORMAT JSON で構造化。pgMustard / explain.depesz.com で可視化。",
      codeExample:
        "-- 推定だけ (実行しない)\nEXPLAIN SELECT * FROM users WHERE email = 'a@x.com';\n-- Index Scan using idx_users_email on users  (cost=0.29..8.31 rows=1 width=...)\n--   Index Cond: (email = 'a@x.com'::text)\n\n-- 実測 (実行する、コストかかる)\nEXPLAIN ANALYZE SELECT * FROM users WHERE email = 'a@x.com';\n-- Index Scan using idx_users_email on users\n--   (cost=0.29..8.31 rows=1 width=...)\n--   (actual time=0.012..0.013 rows=1 loops=1)\n--   Index Cond: (email = 'a@x.com'::text)\n-- Planning Time: 0.123 ms\n-- Execution Time: 0.045 ms\n\n-- 詳細\nEXPLAIN (ANALYZE, BUFFERS, FORMAT JSON)\nSELECT u.name, COUNT(p.id)\nFROM users u\nLEFT JOIN posts p ON p.user_id = u.id\nGROUP BY u.id, u.name;\n\n-- 重要指標\n-- rows = 1000 vs actual rows = 100000 → 統計が古い、ANALYZE が必要\n-- Seq Scan on large_table → INDEX が無い or 統計上 INDEX が損と判定された\n-- Hash Join + 大量メモリ → work_mem 不足で disk に spill\n-- Filter: ... Rows Removed by Filter: 99999 → WHERE が選択性低い (INDEX 検討)\n\n-- 統計更新\nANALYZE users;\nANALYZE (VERBOSE);\n\n-- auto_explain (slow query の plan を log に)\n-- postgresql.conf\nshared_preload_libraries = 'auto_explain'\nauto_explain.log_min_duration = '100ms'\nauto_explain.log_analyze = on\n\n-- pg_stat_statements で頻出 / 遅いクエリの集計\nSELECT query, calls, mean_exec_time, total_exec_time\nFROM pg_stat_statements\nORDER BY mean_exec_time DESC LIMIT 20;",
    },
  },
  {
    id: "sql-053",
    categoryId: "sql-advanced",
    difficulty: "advanced",
    type: "choice",
    question: "PostgreSQL の Seq Scan / Index Scan / Bitmap Index Scan の違いは？",
    choices: [
      "Seq Scan=全件走査、Index Scan=INDEX 経由で 1 行ずつ、Bitmap=INDEX で対象 page を集め一括取得 (中庸の選択性で最速)",
      "全部同じ",
      "Bitmap は廃止",
      "Index Scan が常に最速",
    ],
    answerIndex: 0,
    hints: [
      "選択性 (取り出す行数 / 全体) で最適な走査が変わる。",
      "Seq Scan: 大量行 / 統計不足。Index Scan: 少数行。Bitmap: 中庸。",
      "Optimizer がコスト比較で選ぶ。",
    ],
    explanation: {
      summary:
        "**Seq Scan**: 全件読む (選択性 低・統計不足・テーブル小)。**Index Scan**: INDEX で 1 行ずつ取得 (選択性 高、少数行)。**Bitmap Heap Scan**: INDEX で対象 page を集めて一括取得 (中庸の選択性で最速)。Optimizer が選ぶ。",
      reason:
        "全件の 1% 未満: Index Scan、1〜10%: Bitmap、10% 超: Seq Scan が一般的な目安。INDEX が複数あれば Bitmap And/Or で組合せ可能。Index Only Scan は INDEX だけで全列を満たせる場合 (VACUUM 後の visibility map 必要)。`SET enable_seqscan = off` で強制可能 (デバッグ用)。",
      codeExample:
        "-- Seq Scan (全件走査)\nEXPLAIN SELECT * FROM users;\n-- Seq Scan on users  (cost=0.00..1234 rows=10000 width=...)\n\n-- Index Scan (少数行)\nEXPLAIN SELECT * FROM users WHERE email = 'a@x.com';\n-- Index Scan using idx_users_email on users\n--   Index Cond: (email = '...')\n\n-- Bitmap Heap Scan (中庸)\nEXPLAIN SELECT * FROM posts WHERE created_at > NOW() - INTERVAL '1 day';\n-- Bitmap Heap Scan on posts\n--   ->  Bitmap Index Scan on idx_posts_created_at\n--         Index Cond: (created_at > ...)\n\n-- 複数 INDEX の組合せ (Bitmap And)\nEXPLAIN SELECT * FROM posts\nWHERE category = 'tech' AND created_at > NOW() - INTERVAL '7 days';\n-- BitmapAnd\n--   Bitmap Index Scan on idx_posts_category\n--   Bitmap Index Scan on idx_posts_created_at\n\n-- Index Only Scan (INDEX だけで満たせる)\nEXPLAIN SELECT id FROM users WHERE email = 'a@x.com';\n-- Index Only Scan using idx_users_email on users\n--   Heap Fetches: 0           ← 0 なら高速\n\n-- VACUUM が必要 (Visibility Map)\nVACUUM users;\n\n-- 強制で挙動確認 (デバッグ)\nSET enable_seqscan = off;\nSET enable_indexscan = off;\nSET enable_bitmapscan = off;",
    },
  },
  {
    id: "sql-054",
    categoryId: "sql-advanced",
    difficulty: "advanced",
    type: "choice",
    question: "EXPLAIN の cost (例: cost=0.29..8.31) の意味は？",
    choices: [
      "行数",
      "start_cost..total_cost — 開始までと完了までの推定コスト (page I/O や CPU の重み付け単位)",
      "実測時間 (ms)",
      "ファイルサイズ",
    ],
    answerIndex: 1,
    hints: [
      "コストは『単位なしの推定値』、ms ではない。",
      "start_cost: 最初の行を返すまで。total_cost: 全行を返すまで。",
      "LIMIT 付きクエリでは start_cost が低いプランが好まれる。",
    ],
    explanation: {
      summary:
        "PG の cost は **単位なしの推定値** (seq_page_cost を基準に各操作の重み付け)。`cost=A..B` で **A=最初の行までのコスト**、**B=全行までのコスト**。LIMIT がある時は A が低いプラン (Index Scan 等) が選ばれる傾向。実時間ではない。",
      reason:
        "コストパラメータ: `seq_page_cost` (1.0、デフォルト)、`random_page_cost` (4.0、SSD なら 1.1 推奨)、`cpu_tuple_cost`、`cpu_index_tuple_cost`、`cpu_operator_cost`。SSD 環境では `random_page_cost = 1.1` に下げると Index Scan が選ばれやすくなり性能向上。`EXPLAIN ANALYZE` の actual time (ms) と乖離していたら統計古い or 設定不適切。",
      codeExample:
        "-- cost の見方\nEXPLAIN SELECT * FROM users ORDER BY id LIMIT 10;\n--                                    QUERY PLAN\n-- ----------------------------------------------------------------\n-- Limit  (cost=0.29..0.62 rows=10 width=...)\n--   ->  Index Scan using users_pkey on users  (cost=0.29..3300 rows=100000)\n-- ↑ start_cost=0.29 (最初の行まで)、total=0.62 (10 行目まで)\n\n-- start_cost vs total_cost の使い分け\n-- LIMIT 付き: start_cost が低い Index Scan が有利\n-- 全件取得: total_cost が低い Seq Scan が有利\n\n-- コストパラメータ調整 (SSD 環境)\nALTER SYSTEM SET random_page_cost = 1.1;\nSELECT pg_reload_conf();\n\n-- 統計の精度を上げる\nALTER TABLE users ALTER COLUMN status SET STATISTICS 1000;\n-- カラムごとの統計サンプル数 (default 100)\nANALYZE users;\n\n-- Extended Statistics (列間の相関)\nCREATE STATISTICS users_country_city (dependencies) ON country, city FROM users;\nANALYZE users;\n\n-- pg_class でテーブル統計確認\nSELECT relname, reltuples, relpages FROM pg_class WHERE relname = 'users';",
    },
  },
  {
    id: "sql-055",
    categoryId: "sql-advanced",
    difficulty: "advanced",
    type: "choice",
    question: "PostgreSQL の VACUUM と ANALYZE の役割は？",
    choices: [
      "ANALYZE は INDEX 作成",
      "VACUUM = 古い行バージョンを掃除 (MVCC で発生) / ANALYZE = 統計情報を更新 (Optimizer 用)",
      "両方バックアップ",
      "VACUUM はテーブル削除",
    ],
    answerIndex: 1,
    hints: [
      "MVCC で UPDATE / DELETE すると古い行が残る → VACUUM で回収。",
      "Optimizer は統計 (行数 / 値の分布) で plan を決める → ANALYZE で更新。",
      "autovacuum が背景で自動実行 (チューニング可能)。",
    ],
    explanation: {
      summary:
        "**VACUUM**: MVCC で発生した古い行バージョン (dead tuple) を掃除 → ディスク領域を解放 / visibility map を更新。**ANALYZE**: 統計情報 (行数 / 値の分布) を収集 → Optimizer の plan 精度向上。`VACUUM ANALYZE` で両方。autovacuum が自動実行。",
      reason:
        "UPDATE / DELETE は古い行を残し新行を追加 (MVCC) → bloat 発生。VACUUM で回収するが領域は OS には戻らない (FULL で戻る)。autovacuum は閾値 (`autovacuum_vacuum_threshold` + `autovacuum_vacuum_scale_factor`) で起動。大規模テーブルでは閾値を厳しく (`scale_factor` を小さく)。pgstattuple で dead tuple 率確認。",
      codeExample:
        "-- 通常 VACUUM (ロック取らず並行 OK)\nVACUUM users;\nVACUUM VERBOSE users;\n\n-- VACUUM + ANALYZE\nVACUUM (VERBOSE, ANALYZE) users;\n\n-- VACUUM FULL (テーブル全体を書き換え、ACCESS EXCLUSIVE ロック、本番注意)\nVACUUM FULL users;\n-- → ディスク領域を OS に返却 (通常 VACUUM はテーブル内で再利用)\n\n-- ANALYZE 単独\nANALYZE users;\nANALYZE users(status);          -- 特定列だけ\n\n-- dead tuple の確認\nSELECT relname, n_live_tup, n_dead_tup, last_vacuum, last_autovacuum\nFROM pg_stat_user_tables\nWHERE n_dead_tup > 0\nORDER BY n_dead_tup DESC;\n\n-- bloat 検出 (pgstattuple extension)\nCREATE EXTENSION pgstattuple;\nSELECT * FROM pgstattuple('users');\n-- dead_tuple_percent が高いと bloat\n\n-- autovacuum の設定\nSHOW autovacuum;\nSHOW autovacuum_vacuum_scale_factor;   -- default 0.2 (20% で起動)\n\n-- テーブル個別設定 (大規模テーブル)\nALTER TABLE big_table SET (\n  autovacuum_vacuum_scale_factor = 0.05,    -- 5% で起動\n  autovacuum_analyze_scale_factor = 0.05\n);\n\n-- VACUUM FULL の代替 (pg_repack extension、ロックなしで再構築)\n-- pg_repack -t users -d mydb",
    },
  },
  {
    id: "sql-056",
    categoryId: "sql-advanced",
    difficulty: "advanced",
    type: "choice",
    question: "PostgreSQL の HOT (Heap-Only Tuple) Update の利点は？",
    choices: [
      "JOIN が速い",
      "INDEX を更新せず同じ page 内で新バージョンを作る → INDEX bloat を減らし高速",
      "DELETE が速くなる",
      "INDEX が増える",
    ],
    answerIndex: 1,
    hints: [
      "通常の UPDATE は INDEX も新行を指すように更新する。",
      "HOT は『INDEX 対象外のカラム』を同 page 内で更新する場合に発動。",
      "fillfactor (page の空き比率) を下げると HOT 発動率が上がる。",
    ],
    explanation: {
      summary:
        "**HOT Update**: INDEX 対象外のカラムだけ更新 + 同じ page に空きあり → INDEX 更新スキップ + 同 page 内に新バージョン。INDEX bloat を防ぎ高速。`fillfactor` を下げて空きを確保すると発動率向上。",
      reason:
        "通常の UPDATE: 新行を別 page に作成 + INDEX も新行を指すよう更新 (INDEX bloat の原因)。HOT が効くと INDEX 不変 → 書き込み 1 つ少ない。確認: `pg_stat_user_tables.n_tup_hot_upd / n_tup_upd` で HOT 率。頻繁に UPDATE するテーブル (status カラム等) は `fillfactor = 80` などで調整。",
      codeExample:
        "-- fillfactor を下げて HOT 領域を確保\nALTER TABLE orders SET (fillfactor = 80);\nVACUUM FULL orders;             -- 反映のため (本番注意)\n\n-- HOT 率の確認\nSELECT relname,\n       n_tup_upd,\n       n_tup_hot_upd,\n       round(100.0 * n_tup_hot_upd / NULLIF(n_tup_upd, 0), 1) AS hot_pct\nFROM pg_stat_user_tables\nWHERE n_tup_upd > 0\nORDER BY n_tup_upd DESC;\n\n-- HOT 発動条件\n-- (1) UPDATE するカラムが全 INDEX に含まれない\n-- (2) 同じ page に新行を置く空きがある (fillfactor)\n\n-- ❌ HOT 効かない例\nUPDATE orders SET status = 'paid' WHERE id = 1;\n-- status に INDEX があると HOT 不発\n\n-- ✅ HOT 効く例\nUPDATE orders SET notes = 'updated' WHERE id = 1;\n-- notes に INDEX が無く、fillfactor で空きがあれば HOT\n\n-- bloat 検出\nSELECT schemaname, tablename, pg_size_pretty(pg_relation_size(schemaname||'.'||tablename))\nFROM pg_tables\nORDER BY pg_relation_size(schemaname||'.'||tablename) DESC LIMIT 10;\n\n-- INDEX bloat\nSELECT * FROM pg_indexes WHERE indexname LIKE 'idx_orders%';\n-- REINDEX INDEX で再構築 (本番 CONCURRENTLY)\nREINDEX INDEX CONCURRENTLY idx_orders_user_id;",
    },
  },
  {
    id: "sql-057",
    categoryId: "sql-advanced",
    difficulty: "intermediate",
    type: "choice",
    question: "大量データを高速に bulk insert する PostgreSQL のコマンドは？",
    choices: [
      "MASS INSERT",
      "COPY (バイナリ / CSV から直接、INSERT より圧倒的に速い)",
      "INSERT INTO ... VALUES (1), (2), (3) ...",
      "BULK INSERT",
    ],
    answerIndex: 1,
    hints: [
      "COPY は WAL とパーサーをスキップするため超高速。",
      "INSERT の数十倍速い。",
      "psql の \\copy はクライアント側ファイル、サーバ側ファイルは COPY。",
    ],
    explanation: {
      summary:
        "`COPY table FROM 'file' WITH (FORMAT csv, HEADER true)` で CSV から高速 bulk insert。INSERT より数十倍速い。psql の `\\copy` でクライアント側ファイル、SQL の `COPY` はサーバ側パス (権限要)。",
      reason:
        "高速の理由: パーサーをスキップ、prepared statement 不要、WAL の overhead 削減、内部で page を直接構築。COPY 中に他クエリは継続可能。`COPY ... TO` で export も。pg_dump も内部で COPY を使う。CSV / バイナリ / カスタム区切り対応。",
      codeExample:
        "-- サーバ側ファイル (CSV)\nCOPY users (id, name, email)\nFROM '/path/to/users.csv'\nWITH (FORMAT csv, HEADER true);\n\n-- クライアント側 (psql)\n\\copy users FROM 'users.csv' WITH (FORMAT csv, HEADER true)\n\n-- stdin から (pipe で渡す)\npsql -c \"\\copy users FROM stdin WITH (FORMAT csv, HEADER true)\" < users.csv\n\n-- 一部列だけ\nCOPY users (email, name) FROM '/tmp/users.csv' CSV HEADER;\n\n-- export (TO)\nCOPY (SELECT * FROM users WHERE active) TO '/tmp/active_users.csv' CSV HEADER;\n\n-- バイナリ\nCOPY users TO '/tmp/users.bin' WITH (FORMAT binary);\n\n-- 性能比較\n-- 100 万行 INSERT: 30 秒\n-- 100 万行 COPY: 1 秒\n\n-- アプリ層から (Ruby pg gem)\nrequire 'pg'\nconn = PG.connect(...)\nconn.copy_data \"COPY users FROM STDIN WITH CSV\" do\n  CSV.foreach('users.csv', headers: true) do |row|\n    conn.put_copy_data(row.to_s)\n  end\nend\n\n-- Rails activerecord-import gem も bulk insert 用\nUser.import users_array, batch_size: 1000\n# → INSERT INTO ... VALUES (...), (...), (...) を batch で\n\n-- 大規模初期データロードでの追加 tips\n-- 1. INDEX / FK 制約を一時 drop → load 後に再作成\n-- 2. autovacuum を一時 OFF\n-- 3. UNLOGGED TABLE で高速 (WAL なし、crash で失う)",
    },
  },
  {
    id: "sql-058",
    categoryId: "sql-advanced",
    difficulty: "advanced",
    type: "choice",
    question: "PostgreSQL で『どのクエリが遅いか』を集計・分析する標準 extension は？",
    choices: [
      "pg_top",
      "pg_slow",
      "pg_query_log",
      "pg_stat_statements — クエリごとの実行回数 / 平均時間 / 総時間 / I/O を集計",
    ],
    answerIndex: 3,
    hints: [
      "クエリのテンプレート単位 (パラメータ違いを統合) で集計。",
      "shared_preload_libraries に追加 + extension 作成。",
      "実際のサーバを再起動して読み込ませる。",
    ],
    explanation: {
      summary:
        "**pg_stat_statements** は extension で、クエリのテンプレート単位 (パラメータを `$1` に正規化) で実行回数 / 平均時間 / 総時間 / shared block I/O を集計。本番パフォーマンス監視の標準。",
      reason:
        "セットアップ: `postgresql.conf` の `shared_preload_libraries = 'pg_stat_statements'` + 再起動 + `CREATE EXTENSION pg_stat_statements`。`pg_stat_statements_reset()` でリセット。slow query log (`log_min_duration_statement`) と組み合わせて『たまに遅い』も『常に遅い』も両方追える。pg_stat_kcache、auto_explain 等の周辺 extension も有用。",
      codeExample:
        "-- セットアップ\n-- postgresql.conf\nshared_preload_libraries = 'pg_stat_statements'\npg_stat_statements.track = all\n\n-- 再起動後\nCREATE EXTENSION pg_stat_statements;\n\n-- TOP 20 の遅いクエリ (平均時間順)\nSELECT\n  query,\n  calls,\n  total_exec_time / 1000 AS total_sec,\n  mean_exec_time AS avg_ms,\n  (100 * total_exec_time / SUM(total_exec_time) OVER ())::numeric(5,2) AS pct\nFROM pg_stat_statements\nORDER BY mean_exec_time DESC\nLIMIT 20;\n\n-- 総時間消費 TOP\nSELECT query, calls, total_exec_time, mean_exec_time\nFROM pg_stat_statements\nORDER BY total_exec_time DESC LIMIT 20;\n\n-- I/O が重いクエリ\nSELECT query, shared_blks_hit, shared_blks_read, shared_blks_dirtied\nFROM pg_stat_statements\nORDER BY shared_blks_read DESC LIMIT 20;\n\n-- リセット\nSELECT pg_stat_statements_reset();\n\n-- slow query log (postgresql.conf)\nlog_min_duration_statement = 100         -- 100ms 超を log に\nlog_statement = 'mod'                     -- UPDATE/INSERT/DELETE を log\nlog_temp_files = 0                        -- temp file 作成も log\n\n-- auto_explain (slow query の plan も自動 log)\nshared_preload_libraries = 'pg_stat_statements,auto_explain'\nauto_explain.log_min_duration = '100ms'\nauto_explain.log_analyze = on\n\n-- 周辺ツール\n-- pgBadger: log を解析してレポート HTML\n-- pganalyze: SaaS で pg_stat_statements を可視化\n-- pgwatch2: Grafana ダッシュボード",
    },
  },
  {
    id: "sql-059",
    categoryId: "sql-advanced",
    difficulty: "advanced",
    type: "choice",
    question: "PostgreSQL の Connection Pool として PgBouncer の主な役割は？",
    choices: [
      "INDEX 自動作成",
      "バックアップ",
      "アプリ ↔ PG 間の接続プール — 大量のアプリ接続を少数の PG 接続に多重化、PG プロセス爆発を防ぐ",
      "クエリ高速化",
    ],
    answerIndex: 2,
    hints: [
      "PG は接続ごとに 1 プロセスを起動するので接続数が増えると重い。",
      "PgBouncer が間に入り、アプリの大量接続を少数の PG 接続に集約。",
      "Pool mode: session / transaction / statement。",
    ],
    explanation: {
      summary:
        "**PgBouncer** はアプリと PG の間の接続プール。アプリの 1000 接続を PG の 50 接続に多重化し、PG のメモリ消費 + プロセス起動コストを劇的に削減。Pool mode: **session** (接続単位、prepared statement OK) / **transaction** (TX 単位、最も多重化、prepared statement 注意) / **statement** (statement 単位、autocommit 必須)。",
      reason:
        "PG は接続ごとに 1 プロセス → メモリ ~10MB/接続 → 1000 接続で 10GB。Rails / Django 等の Web アプリは Worker 数 × 接続数 → すぐに数百。transaction mode が一般的な選択 (Rails / Sidekiq でよく使う)。Heroku / Supabase 等のマネージド PG は PgBouncer 同梱が多い。pgcat (Rust 製) や Supavisor (Elixir 製) も最近の選択肢。",
      codeExample:
        "-- pgbouncer.ini\n[databases]\nmyapp = host=pg.example.com port=5432 dbname=myapp\n\n[pgbouncer]\nlisten_addr = 0.0.0.0\nlisten_port = 6432\npool_mode = transaction          ; session / transaction / statement\nmax_client_conn = 1000           ; アプリ側からの最大接続\ndefault_pool_size = 25           ; 各 DB / user で PG への接続数\nreserve_pool_size = 5\n\n-- アプリ側の接続先を PG (5432) ではなく PgBouncer (6432) に\nDATABASE_URL=postgres://user:pass@pgbouncer:6432/myapp\n\n-- Rails の prepared_statements 設定\n# config/database.yml\nproduction:\n  adapter: postgresql\n  url: <%= ENV['DATABASE_URL'] %>\n  prepared_statements: false     # transaction mode で必須\n  advisory_locks: false\n\n-- Pool mode の選択\n-- session: 接続全期間 1:1、prepared statement / temp table OK、多重化少\n-- transaction: TX 中だけ占有、最も多重化、prepared statement 注意\n-- statement: 各 statement で別接続、autocommit のみ\n\n-- 監視\nSHOW POOLS;\nSHOW STATS;\nSHOW CLIENTS;\n\n-- PG 側の max_connections\nSHOW max_connections;            -- default 100\n-- → PgBouncer 経由なら 100 で十分、直結アプリだと不足\n\n-- 代替\n-- pgcat: Rust 製、shard 対応\n-- Supavisor: Elixir 製、Supabase で使用\n-- ActiveRecord 5.2+ ConnectionPool は app 内 pool (PgBouncer の代わりにならない)",
    },
  },
  {
    id: "sql-060",
    categoryId: "sql-advanced",
    difficulty: "advanced",
    type: "choice",
    question: "PostgreSQL の宣言的テーブルパーティショニングの主な利点は？",
    choices: [
      "巨大テーブルを paritition で分割 → クエリで partition pruning が効く、メンテ (VACUUM / 削除) が partition 単位で軽い",
      "INDEX が不要に",
      "JOIN が無効化",
      "サイズが減る",
    ],
    answerIndex: 0,
    hints: [
      "PARTITION BY RANGE / LIST / HASH で分割。",
      "古い partition だけ DROP で削除 (DELETE より圧倒的に速い)。",
      "log / events / metrics などの時系列テーブルで頻出。",
    ],
    explanation: {
      summary:
        "**Declarative Partitioning** (PG 10+) で巨大テーブルを論理的に分割。**partition pruning** で WHERE 条件に該当する partition だけスキャン、月次ローテーションで古い partition を DROP (DELETE より圧倒的に速い)。RANGE / LIST / HASH で分割可。",
      reason:
        "用途: 時系列テーブル (events, logs, metrics)、テナント分離 (HASH)、地域分割 (LIST)。注意: PK / UNIQUE はパーティションキーを含む必要、FK も制約あり、パーティション数が多いと plan 時間増。pg_partman extension で自動運用、Citus / TimescaleDB は更に強化。",
      codeExample:
        "-- RANGE パーティショニング (時系列)\nCREATE TABLE events (\n  id BIGINT NOT NULL,\n  user_id BIGINT NOT NULL,\n  created_at TIMESTAMPTZ NOT NULL,\n  data JSONB,\n  PRIMARY KEY (id, created_at)   -- partition key を PK に含む\n) PARTITION BY RANGE (created_at);\n\n-- 月別 partition\nCREATE TABLE events_2024_01 PARTITION OF events\n  FOR VALUES FROM ('2024-01-01') TO ('2024-02-01');\nCREATE TABLE events_2024_02 PARTITION OF events\n  FOR VALUES FROM ('2024-02-01') TO ('2024-03-01');\nCREATE INDEX ON events_2024_01 (user_id);   -- partition ごとに INDEX\n\n-- partition pruning\nEXPLAIN SELECT * FROM events\nWHERE created_at >= '2024-02-01' AND created_at < '2024-02-15';\n-- → events_2024_02 だけスキャン (他は無視)\n\n-- 古い partition を高速削除\nDROP TABLE events_2024_01;     -- DELETE より圧倒的に速い、INDEX bloat も無し\n\n-- LIST パーティショニング (国別など)\nCREATE TABLE orders (\n  id BIGINT, country TEXT, amount DECIMAL,\n  PRIMARY KEY (id, country)\n) PARTITION BY LIST (country);\nCREATE TABLE orders_jp PARTITION OF orders FOR VALUES IN ('JP');\nCREATE TABLE orders_us PARTITION OF orders FOR VALUES IN ('US');\nCREATE TABLE orders_other PARTITION OF orders DEFAULT;\n\n-- HASH パーティショニング (均等分散)\nCREATE TABLE sessions (\n  id BIGINT, user_id BIGINT NOT NULL, data JSONB,\n  PRIMARY KEY (id, user_id)\n) PARTITION BY HASH (user_id);\nCREATE TABLE sessions_0 PARTITION OF sessions FOR VALUES WITH (MODULUS 4, REMAINDER 0);\nCREATE TABLE sessions_1 PARTITION OF sessions FOR VALUES WITH (MODULUS 4, REMAINDER 1);\nCREATE TABLE sessions_2 PARTITION OF sessions FOR VALUES WITH (MODULUS 4, REMAINDER 2);\nCREATE TABLE sessions_3 PARTITION OF sessions FOR VALUES WITH (MODULUS 4, REMAINDER 3);\n\n-- pg_partman で自動運用\nCREATE EXTENSION pg_partman;\nSELECT partman.create_parent(\n  p_parent_table => 'public.events',\n  p_control => 'created_at',\n  p_type => 'native',\n  p_interval => 'monthly'\n);\n-- → 月次 partition を自動作成、古いものを retention period で削除\n\n-- TimescaleDB (時系列特化)\nSELECT create_hypertable('events', 'created_at', chunk_time_interval => INTERVAL '1 day');\n-- 日次 chunk で自動 partition、圧縮 / 集計も自動",
    },
  },
];
