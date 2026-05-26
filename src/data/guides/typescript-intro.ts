import type { Guide } from "./types";

export const typescriptIntroGuide: Guide = {
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
};
