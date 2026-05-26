import type { Guide } from "./types";

export const javascriptIntroGuide: Guide = {
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
};
