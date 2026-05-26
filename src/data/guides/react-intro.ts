import type { Guide } from "./types";

export const reactIntroGuide: Guide = {
    id: "react-intro",
    trackId: "react",
    title: "React の地図 — 宣言的 UI と Hooks の世界",
    subtitle:
      "公式 react.dev のエッセンスを 7 章に。JSX とコンポーネント → useState/useReducer → useEffect → Context/Custom Hook → フォーム/Ref → パフォーマンス → Suspense/Server Components",
    audience:
      "React を体系的に学び直したい人、useEffect の罠から抜け出したい人、React 19 / Server Components の流れに追いつきたい人",
    sources: [
      { label: "react.dev (公式)", url: "https://react.dev/" },
      { label: "You Might Not Need an Effect", url: "https://react.dev/learn/you-might-not-need-an-effect" },
      { label: "React TypeScript Cheatsheet", url: "https://react-typescript-cheatsheet.netlify.app/" },
    ],
    emoji: "⚛️",
    relatedCategoryIds: ["react-fundamentals"],
    chapters: [
      {
        id: "jsx-and-components",
        title: "1. JSX とコンポーネント — 宣言的 UI の出発点",
        intro:
          "React は『状態から UI を導出する』宣言的ライブラリ。JSX の読み方、Function Component、props、再レンダリングの 4 つのトリガーを整理。",
        readingMinutes: 7,
        objectives: [
          "JSX が `React.createElement(...)` の糖衣であることを理解する",
          "Function Component の props 型と children の扱いを書ける",
          "再レンダリングがいつ発生するか (state / props / context / 親) を説明できる",
        ],
        sections: [
          {
            heading: "1.1 JSX は関数呼び出しの糖衣",
            body: "`<Button color='red'>Save</Button>` は `React.createElement(Button, { color: 'red' }, 'Save')` に変換される。属性は props、子は children として渡る。HTML との差分: `class` → `className`、`for` → `htmlFor`、`onclick` → `onClick` (camelCase)、style は object (`style={{ color: 'red' }}`)、`{式}` で JS 式を埋め込む。",
            code: "// JSX\nfunction Card({ title, children }: { title: string; children: React.ReactNode }) {\n  return (\n    <div className=\"card\">\n      <h2>{title}</h2>\n      <div>{children}</div>\n    </div>\n  )\n}\n\n// 使う側\n<Card title=\"Hello\">\n  <p>This is body</p>\n</Card>\n\n// HTML との差分\n<input type=\"text\" className=\"input\" onChange={handle} />\n<label htmlFor=\"name\">Name</label>\n<div style={{ color: 'red', fontSize: 14 }}>...</div>\n\n// 条件レンダリング\n{user ? <Dashboard /> : <Login />}\n{items.length === 0 && <Empty />}\n\n// リスト (key 必須、後述)\n{items.map(item => <li key={item.id}>{item.name}</li>)}",
            language: "tsx",
            notes: [
              "JSX は React 専用ではなく、Vue や Solid でも使える文法 (実装は別)",
              "Fragment `<>...</>` でラッパー要素なしに複数要素を返せる",
              "boolean / null / undefined / false は何も描画されない (`{condition && <X />}` のパターンが成立する理由)",
            ],
          },
          {
            heading: "1.2 Function Component と props",
            body: "現代の React は Function Component が標準。class は新規では書かない。props は引数オブジェクトで受け取り、children は特別な props として `<Foo>...</Foo>` の中身が渡る。TypeScript では `React.FC` を使わず、引数に直接型を書くスタイルが推奨。",
            code: "type ButtonProps = {\n  label: string\n  onClick?: () => void\n  variant?: 'primary' | 'secondary'\n  children?: React.ReactNode\n}\n\nexport function Button({ label, onClick, variant = 'primary', children }: ButtonProps) {\n  return (\n    <button className={variant} onClick={onClick}>\n      {label}\n      {children}\n    </button>\n  )\n}\n\n// HTML 属性を継承したい時\ntype InputProps = React.InputHTMLAttributes<HTMLInputElement> & { label: string }\nexport function Input({ label, ...rest }: InputProps) {\n  return (\n    <label>\n      <span>{label}</span>\n      <input {...rest} />\n    </label>\n  )\n}",
            language: "tsx",
            notes: [
              "React.FC は children を暗黙に含むため避ける派が多数",
              "props は『不変』として扱う — 中で書き換えない",
            ],
          },
          {
            heading: "1.3 再レンダリングの 4 トリガー",
            body: "Function Component が再レンダリング (関数として再実行) されるのは: (1) 自分の state が更新、(2) props が変わった、(3) 購読中の Context 値が変わった、(4) 親が再レンダリングした。React は `Object.is` で同値判定し、同じなら再描画をスキップする (state 同値時)。",
            code: "function Counter() {\n  const [n, setN] = useState(0)\n  return <button onClick={() => setN(n + 1)}>{n}</button>\n}\n\n// 同じ値の setState は何もしない\nsetN(0)\nsetN(0)   // 2 回目は無視\n\n// 親が再レンダリングすると子も再レンダリング\nfunction Parent() {\n  const [, force] = useState(0)\n  return (\n    <>\n      <button onClick={() => force(n => n + 1)}>force</button>\n      <Child />   {/* Parent の更新で Child も再レンダリング */}\n    </>\n  )\n}\n\n// React.memo で『props 同じなら再レンダリングしない』\nconst Child = React.memo(function Child({ value }: { value: number }) {\n  return <div>{value}</div>\n})",
            language: "tsx",
            notes: [
              "再レンダリング = DOM 再生成ではない。React は仮想 DOM の差分 (reconciliation) でから実際の DOM 更新は最小限",
              "『再レンダリングは速い』のが React の哲学 — 安易な memo は逆効果",
            ],
          },
          {
            heading: "1.4 リストと key",
            body: "リストレンダリング (`items.map(item => <X />)`) には `key` prop が必須。React は key で『どの要素が同じか / 追加 / 削除 / 移動か』を判断する。`item.id` のような安定したユニーク値を使い、index は最終手段 (並び替えで子の state が消える)。",
            code: "// ❌ key なし → 警告 + 差分検出が非効率\nitems.map(item => <li>{item.name}</li>)\n\n// ⚠️ index は最終手段 (並び替えで問題)\nitems.map((item, i) => <li key={i}>{item.name}</li>)\n\n// ✅ 安定 ID\nitems.map(item => <li key={item.id}>{item.name}</li>)\n\n// Fragment にも key 可\nitems.map(item => (\n  <Fragment key={item.id}>\n    <dt>{item.name}</dt>\n    <dd>{item.value}</dd>\n  </Fragment>\n))",
            language: "tsx",
            notes: [
              "key は『同じ親の中で』ユニークなら OK — グローバルにユニークである必要はない",
              "key を変えると React は『別物』と判断して unmount → remount する (state リセットに使える)",
            ],
          },
        ],
        keyTakeaways: [
          "JSX は React.createElement の糖衣、HTML との細かな差 (className / htmlFor / camelCase) を覚える",
          "Function Component が標準、React.FC は使わず props 型を直接受ける",
          "再レンダリングのトリガーは state / props / context / 親の 4 つ",
          "リストの key は安定したユニーク ID を使う、index は最終手段",
        ],
        comprehensionQuestionIds: ["react-003", "react-006"],
      },
      {
        id: "state-with-usestate-and-usereducer",
        title: "2. 状態管理 — useState と useReducer",
        intro:
          "React の心臓部である状態管理。useState の基本、関数更新の罠、useReducer での複雑な遷移、派生状態を作らないという考え方を整理。",
        readingMinutes: 8,
        objectives: [
          "useState の関数形式 `setState(prev => ...)` を使うべき場面を判別できる",
          "オブジェクト state を不変に更新する書き方 (spread / immer) を知る",
          "useReducer で複雑な状態遷移を切り出せる、useState との使い分けができる",
        ],
        sections: [
          {
            heading: "2.1 useState の基本",
            body: "`const [state, setState] = useState(initial)` でローカル状態を持つ。`setState` の引数に値を渡すと置き換え、関数を渡すと『前回の state』を受け取って計算する (関数更新)。",
            code: "function Counter() {\n  const [count, setCount] = useState(0)\n  return (\n    <>\n      <p>Count: {count}</p>\n      <button onClick={() => setCount(count + 1)}>+1</button>\n      <button onClick={() => setCount(c => c + 1)}>+1 (関数更新)</button>\n    </>\n  )\n}\n\n// 初期値が重い計算なら遅延初期化\nconst [items, setItems] = useState(() => loadFromStorage())\n//                                  ^^^ 関数を渡すと初回のみ実行",
            language: "tsx",
            notes: [
              "useState の初期値は『初回レンダリング時にのみ評価』される — 関数で囲むと毎回の評価を避けられる",
              "TypeScript で `null` や union を扱うなら明示: `useState<User | null>(null)`",
            ],
          },
          {
            heading: "2.2 関数更新の罠 — 古い state を見るな",
            body: "`setN(n + 1)` をイベント内で 2 回呼んでも +1 にしかならない。クロージャでキャプチャした古い `n` を 2 回参照しているから。関数更新 `setN(prev => prev + 1)` なら React が直前の state を渡してくれて安全。",
            code: "// ❌ 古い state を見る\nfunction Counter() {\n  const [n, setN] = useState(0)\n  return <button onClick={() => {\n    setN(n + 1)         // n=0 → setN(1)\n    setN(n + 1)         // n は依然 0 → setN(1)  ← +2 ではなく +1\n  }}>{n}</button>\n}\n\n// ✅ 関数更新で安全に\nreturn <button onClick={() => {\n  setN(prev => prev + 1)\n  setN(prev => prev + 1)   // ちゃんと +2\n}}>{n}</button>\n\n// 非同期処理 (タイマー / await) でも同じ罠\nconst handle = async () => {\n  await sleep(1000)\n  setN(n + 1)              // 1 秒前の n を見る\n  setN(prev => prev + 1)   // 最新の state を見る\n}",
            language: "tsx",
            notes: [
              "『前の state に依存する更新』は常に関数更新を選ぶのが安全",
              "React 18+ は自動 batching でイベント外 (Promise / setTimeout) も batch 化される",
            ],
          },
          {
            heading: "2.3 オブジェクト / 配列の state を不変に更新",
            body: "React は『state はイミュータブル』を前提にして同値判定する。直接 mutate (push / splice / x.y = ...) すると React が変化に気づけず再レンダリングが起きない。spread (`...`) / immer / `toSorted` / `with` 等で新しい参照を作る。",
            code: "// ❌ 直接 mutate\nconst [user, setUser] = useState({ name: 'A', age: 20 })\nuser.age = 21\nsetUser(user)            // 同じ参照 → 再レンダリングされない\n\n// ✅ 新しいオブジェクトに\nsetUser({ ...user, age: 21 })\nsetUser(prev => ({ ...prev, age: prev.age + 1 }))\n\n// 配列\nconst [items, setItems] = useState<Item[]>([])\nsetItems([...items, newItem])                // 追加\nsetItems(items.filter(i => i.id !== id))     // 削除\nsetItems(items.map(i => i.id === id ? { ...i, done: true } : i))\n\n// ES2023+ の非破壊メソッド\nsetItems(items.toSorted((a, b) => a.name.localeCompare(b.name)))\nsetItems(items.toReversed())\nsetItems(items.with(0, newItem))   // index 0 を置換\n\n// 深いネストは immer が便利\nimport { produce } from 'immer'\nsetState(produce(draft => { draft.user.address.city = 'Tokyo' }))",
            language: "tsx",
            notes: [
              "破壊的: push / pop / shift / unshift / splice / sort / reverse",
              "非破壊的 (ES2023+): toSorted / toReversed / toSpliced / with",
              "深いネストは immer で『mutate っぽい書き方』ができる",
            ],
          },
          {
            heading: "2.4 useReducer — 複雑な状態遷移を切り出す",
            body: "state が複数あって連動する、更新ロジックが複雑、外部テストしたい — そんな時は `useReducer(reducer, initial)` で `[state, dispatch]` を取得。Redux と同じ思想を 1 コンポーネント内で。Discriminated Union で action を型付けすると堅牢。",
            code: "type State = { count: number; step: number }\ntype Action =\n  | { type: 'inc' }\n  | { type: 'dec' }\n  | { type: 'setStep'; step: number }\n  | { type: 'reset' }\n\nfunction reducer(state: State, action: Action): State {\n  switch (action.type) {\n    case 'inc':     return { ...state, count: state.count + state.step }\n    case 'dec':     return { ...state, count: state.count - state.step }\n    case 'setStep': return { ...state, step: action.step }\n    case 'reset':   return { count: 0, step: 1 }\n  }\n}\n\nfunction Counter() {\n  const [state, dispatch] = useReducer(reducer, { count: 0, step: 1 })\n  return (\n    <>\n      <p>{state.count}</p>\n      <button onClick={() => dispatch({ type: 'inc' })}>+{state.step}</button>\n      <button onClick={() => dispatch({ type: 'setStep', step: 5 })}>step=5</button>\n    </>\n  )\n}",
            language: "tsx",
            notes: [
              "reducer は純粋関数 — 同じ入力なら同じ出力、副作用なし",
              "Context + useReducer で簡易グローバル管理も可 (4 章)",
            ],
          },
        ],
        keyTakeaways: [
          "前の state に依存する更新は常に setState(prev => ...) を選ぶ",
          "state は不変。spread / 非破壊メソッド / immer で新しい参照を作る",
          "複雑な状態遷移は useReducer + Discriminated Union の action 型",
          "破壊的 sort / push を props 由来の配列に使わない (1 章 / 6 章にも関連)",
        ],
        comprehensionQuestionIds: ["react-001", "react-007", "react-011", "react-014"],
      },
      {
        id: "effects-and-useeffect",
        title: "3. 副作用と useEffect — 外部システムとの同期",
        intro:
          "useEffect は『外部システムとの同期』のための Hook。typical アンチパターン (派生状態 / async / 依存漏れ) を避けて正しく使う。",
        readingMinutes: 9,
        objectives: [
          "useEffect の発火タイミング (レンダー後 / deps 変化時) と cleanup の役割を説明できる",
          "依存配列の正しい書き方を知り、exhaustive-deps の警告に対処できる",
          "『You Might Not Need an Effect』の典型 4 パターンを判別できる",
        ],
        references: [
          { label: "You Might Not Need an Effect (公式)", url: "https://react.dev/learn/you-might-not-need-an-effect" },
        ],
        sections: [
          {
            heading: "3.1 useEffect の基本と cleanup",
            body: "`useEffect(fn, deps)` でレンダリング後に fn が走る。deps が変わると再実行。fn から関数を return すれば『次の実行前 / アンマウント時』に呼ばれる cleanup になる。subscribe → unsubscribe、setInterval → clearInterval のペアでリソースリークを防ぐ。",
            code: "// 初回マウントのみ\nuseEffect(() => {\n  console.log('mounted')\n  return () => console.log('unmounted')\n}, [])\n\n// タイマー\nuseEffect(() => {\n  const id = setInterval(() => tick(), 1000)\n  return () => clearInterval(id)\n}, [])\n\n// fetch + AbortController\nuseEffect(() => {\n  const ctrl = new AbortController()\n  fetch(`/api/users/${userId}`, { signal: ctrl.signal })\n    .then(r => r.json())\n    .then(setData)\n    .catch(e => { if (e.name !== 'AbortError') setError(e) })\n  return () => ctrl.abort()\n}, [userId])\n\n// イベント\nuseEffect(() => {\n  const onResize = () => setSize(window.innerWidth)\n  window.addEventListener('resize', onResize)\n  return () => window.removeEventListener('resize', onResize)\n}, [])",
            language: "tsx",
            notes: [
              "React 18+ の Strict Mode (開発) は effect を 2 回実行 — 副作用は冪等に書く",
              "deps を省略すると毎レンダリングで再実行 (ほぼ常に間違い)",
            ],
          },
          {
            heading: "3.2 依存配列とクロージャの落とし穴",
            body: "useEffect 内で参照する『state / props / コンポーネント内変数』はすべて依存配列に入れる (`react-hooks/exhaustive-deps` ESLint が自動チェック)。漏れると stale closure (古い値を見続ける) になる。依存を減らすには『useEffect 内で必要な値だけ参照』『派生は useMemo』『最新値の参照は ref』。",
            code: "// ❌ count を使ってるのに deps に入ってない\nuseEffect(() => {\n  const id = setInterval(() => {\n    console.log(count)        // 常に初回の count を見る\n  }, 1000)\n  return () => clearInterval(id)\n}, [])\n\n// ✅ deps に入れる (interval 毎回作り直しになる)\nuseEffect(() => {\n  const id = setInterval(() => console.log(count), 1000)\n  return () => clearInterval(id)\n}, [count])\n\n// ✅ ref で最新値を読む (interval は 1 回だけ)\nconst countRef = useRef(count)\nuseEffect(() => { countRef.current = count }, [count])\nuseEffect(() => {\n  const id = setInterval(() => console.log(countRef.current), 1000)\n  return () => clearInterval(id)\n}, [])",
            language: "tsx",
            notes: [
              "ESLint の exhaustive-deps 警告を勝手に // eslint-disable で消すのは危険",
              "依存に関数を入れる時は useCallback で安定化、または useEffect 内で関数定義",
            ],
          },
          {
            heading: "3.3 You Might Not Need an Effect — 不要な useEffect",
            body: "公式が強く警告するアンチパターン。props/state から導出できる『派生状態』を useEffect で setState すると、無駄な追加レンダーと同期バグの温床になる。レンダー中に計算するか、key prop でリセットするのが正解。",
            code: "// ❌ パターン 1: 派生状態を effect で同期\nfunction UserCard({ first, last }) {\n  const [fullName, setFullName] = useState('')\n  useEffect(() => { setFullName(`${first} ${last}`) }, [first, last])\n  return <p>{fullName}</p>\n}\n\n// ✅ レンダー中に計算\nfunction UserCard({ first, last }) {\n  const fullName = `${first} ${last}`\n  return <p>{fullName}</p>\n}\n\n// ❌ パターン 2: props 変化で state リセット\nfunction Profile({ userId }) {\n  const [comment, setComment] = useState('')\n  useEffect(() => { setComment('') }, [userId])   // userId 変化で空に\n  ...\n}\n\n// ✅ key で unmount → remount\n<Profile key={userId} userId={userId} />\n\n// ❌ パターン 3: イベントハンドラのロジックを effect に\nuseEffect(() => {\n  if (submitted) {\n    fetch('/api/submit', { method: 'POST', body: ... })\n    showToast()\n  }\n}, [submitted])\n\n// ✅ ハンドラに直接書く\nconst handleSubmit = async () => {\n  await fetch('/api/submit', ...)\n  showToast()\n}\n\n// ❌ パターン 4: async を直接 useEffect に\nuseEffect(async () => { ... })   // ← async は不可 (戻り値が Promise)\n\n// ✅ 内側で async 関数を定義 + 呼ぶ\nuseEffect(() => {\n  let cancelled = false\n  ;(async () => {\n    const data = await fetch(url).then(r => r.json())\n    if (!cancelled) setData(data)\n  })()\n  return () => { cancelled = true }\n}, [url])",
            language: "tsx",
            notes: [
              "useEffect の用途は『外部システムとの同期』(DOM 操作・タイマー・API 接続・購読) に絞る",
              "API 取得は TanStack Query / SWR / Suspense 統合の方が安全 (4 章 / 7 章)",
            ],
          },
        ],
        keyTakeaways: [
          "useEffect は『外部システムとの同期』専用、return で必ず cleanup",
          "依存配列は exhaustive-deps 警告に従う、最新値が欲しい時は ref",
          "派生状態は effect で同期せず、レンダー中に計算する",
          "state リセットは key prop での remount が定番",
        ],
        comprehensionQuestionIds: ["react-002", "react-010", "react-020"],
      },
      {
        id: "context-custom-hooks-and-state-libs",
        title: "4. 共有とコンポジション — Context / Custom Hook / 状態管理ライブラリ",
        intro:
          "ツリー越しに値を渡す Context、ロジックを再利用する Custom Hook、そしてグローバル状態管理ライブラリ (Zustand / TanStack Query) との使い分けを整理。",
        readingMinutes: 9,
        objectives: [
          "Context API の Provider と useContext を書ける、適不適を判断できる",
          "Custom Hook (`useXxx`) の命名規約と Hook ルールを理解する",
          "クライアント state / server state / フォーム state の使い分けを説明できる",
        ],
        sections: [
          {
            heading: "4.1 Context API — Prop drilling を避ける",
            body: "`createContext` で Context を作り、`<Context.Provider value={...}>` で囲み、`useContext(Context)` で消費。テーマ / 認証ユーザー / ロケールなど『静的に近い、ツリー全体で使う値』に最適。頻繁に変わる値だと、消費する全コンポーネントが再レンダリングするので不向き。",
            code: "type Theme = 'light' | 'dark'\nconst ThemeContext = createContext<Theme>('light')\n\n// Provider\nfunction App() {\n  const [theme, setTheme] = useState<Theme>('light')\n  return (\n    <ThemeContext.Provider value={theme}>\n      <button onClick={() => setTheme(t => t === 'light' ? 'dark' : 'light')}>toggle</button>\n      <Page />\n    </ThemeContext.Provider>\n  )\n}\n\n// 消費 (どんなに深くても)\nfunction DeepChild() {\n  const theme = useContext(ThemeContext)\n  return <div className={theme}>...</div>\n}\n\n// React 19+ は <Context value={...}> だけで OK (Provider 省略可)\n<ThemeContext value={theme}>...\n\n// Context + useReducer で簡易グローバル管理\nconst AuthContext = createContext<{ user: User | null; dispatch: Dispatch<AuthAction> } | null>(null)\nfunction AuthProvider({ children }) {\n  const [user, dispatch] = useReducer(authReducer, null)\n  return <AuthContext value={{ user, dispatch }}>{children}</AuthContext>\n}\nexport const useAuth = () => useContext(AuthContext)!",
            language: "tsx",
            notes: [
              "Context は『静的に近い値』向き — 高頻度更新は Zustand 等の方が局所更新できる",
              "Provider で value をオブジェクト即時生成すると毎レンダーで参照が変わる → useMemo で安定化推奨",
            ],
          },
          {
            heading: "4.2 Custom Hook — ロジックの再利用",
            body: "`use` で始まる関数を作れば Custom Hook。中で他の Hook を使えるので、複雑なロジック (Debounce / API fetch / フォーム / LocalStorage 同期) を切り出して複数コンポーネントで再利用できる。Hook ルール: 最上位でのみ呼ぶ・関数コンポーネント or 他の Hook 内のみ。",
            code: "// useDebounce: 値の変化を ms ミリ秒遅らせる\nfunction useDebounce<T>(value: T, ms: number): T {\n  const [debounced, setDebounced] = useState(value)\n  useEffect(() => {\n    const id = setTimeout(() => setDebounced(value), ms)\n    return () => clearTimeout(id)\n  }, [value, ms])\n  return debounced\n}\n\n// useLocalStorage: state を LocalStorage と同期\nfunction useLocalStorage<T>(key: string, initial: T) {\n  const [value, setValue] = useState<T>(() => {\n    const raw = localStorage.getItem(key)\n    return raw ? (JSON.parse(raw) as T) : initial\n  })\n  useEffect(() => {\n    localStorage.setItem(key, JSON.stringify(value))\n  }, [key, value])\n  return [value, setValue] as const\n}\n\n// 使う側\nfunction Search() {\n  const [q, setQ] = useState('')\n  const debounced = useDebounce(q, 300)\n  useEffect(() => {\n    if (debounced) search(debounced)\n  }, [debounced])\n  return <input value={q} onChange={e => setQ(e.target.value)} />\n}",
            language: "tsx",
            notes: [
              "Hook ルール: if / for / try の中で呼ばない — React は呼び出し順序で state を識別",
              "ESLint の `react-hooks/rules-of-hooks` + `exhaustive-deps` を必ず有効化",
            ],
          },
          {
            heading: "4.3 状態管理ライブラリの使い分け",
            body: "現代の React は『state の種類別に道具を選ぶ』のが定石: クライアント state は Zustand / Jotai / Redux Toolkit、サーバー state (API キャッシュ) は TanStack Query / SWR、フォームは React Hook Form / TanStack Form。何でも Redux の時代は終わった。",
            code: "// Zustand (軽量・人気、API 学習コスト低)\nimport { create } from 'zustand'\ntype State = { count: number; inc: () => void }\nconst useStore = create<State>((set) => ({\n  count: 0,\n  inc: () => set(s => ({ count: s.count + 1 })),\n}))\nfunction Counter() {\n  const { count, inc } = useStore()\n  return <button onClick={inc}>{count}</button>\n}\n\n// TanStack Query (サーバー state)\nimport { useQuery } from '@tanstack/react-query'\nfunction Posts({ id }: { id: number }) {\n  const { data, isLoading, error } = useQuery({\n    queryKey: ['post', id],\n    queryFn: () => fetch(`/api/posts/${id}`).then(r => r.json()),\n    staleTime: 60_000,\n  })\n  if (isLoading) return <Loading />\n  if (error) return <Error />\n  return <Article post={data!} />\n}\n\n// React Hook Form (フォーム)\nimport { useForm } from 'react-hook-form'\nfunction LoginForm() {\n  const { register, handleSubmit, formState: { errors } } = useForm<{ email: string; password: string }>()\n  return (\n    <form onSubmit={handleSubmit(login)}>\n      <input {...register('email', { required: true })} />\n      {errors.email && <p>required</p>}\n      <input type=\"password\" {...register('password')} />\n      <button>Login</button>\n    </form>\n  )\n}",
            language: "tsx",
            notes: [
              "API キャッシュは useState + useEffect で再発明しない — TanStack Query / SWR が完成度高",
              "フォームは入力ごとの再レンダーを抑えるため React Hook Form (uncontrolled ベース) が高速",
              "Redux は『時系列デバッグ / strict な状態管理が必要な大規模』向け — 軽い用途は Zustand で十分",
            ],
          },
        ],
        keyTakeaways: [
          "Context は静的に近い値 (テーマ / 認証) 向き、頻繁更新は不向き",
          "Custom Hook (use*) でロジックを再利用、ESLint の rules-of-hooks を信頼",
          "state は種類別に道具を選ぶ: クライアント = Zustand、server = TanStack Query、form = RHF",
        ],
        comprehensionQuestionIds: ["react-005", "react-008", "react-012", "react-017"],
      },
      {
        id: "forms-and-refs",
        title: "5. フォームと Ref — 制御コンポーネントと DOM アクセス",
        intro:
          "フォーム入力を state と同期する Controlled Component、DOM や永続値を扱う useRef、子の DOM を親に公開する forwardRef (React 19 では props に統合) を整理。",
        readingMinutes: 8,
        objectives: [
          "Controlled と Uncontrolled の違いを書き分けられる",
          "useRef を DOM 参照 / 再レンダリング不要な値の保持の 2 用途で使い分けられる",
          "forwardRef (React 18) と props ref (React 19) の書き方を知る",
        ],
        sections: [
          {
            heading: "5.1 Controlled Component (制御コンポーネント)",
            body: "`value` を state にバインドし、`onChange` で state を更新する書き方。React の state が『唯一の真実』となり、バリデーション・条件付き有効化・整形が書きやすい。Vue の `v-model` はこれの糖衣構文。",
            code: "function LoginForm() {\n  const [email, setEmail] = useState('')\n  const [password, setPassword] = useState('')\n  const isValid = email.includes('@') && password.length >= 8\n\n  return (\n    <form onSubmit={(e) => {\n      e.preventDefault()\n      login(email, password)\n    }}>\n      <input\n        type=\"email\"\n        value={email}\n        onChange={(e) => setEmail(e.target.value)}\n        required\n      />\n      <input\n        type=\"password\"\n        value={password}\n        onChange={(e) => setPassword(e.target.value)}\n      />\n      <button disabled={!isValid}>Login</button>\n    </form>\n  )\n}\n\n// useReducer で複数フィールドをまとめる\ntype FormState = { email: string; password: string; remember: boolean }\nfunction reducer(s: FormState, p: Partial<FormState>): FormState { return { ...s, ...p } }\nconst [form, update] = useReducer(reducer, { email: '', password: '', remember: false })\n<input value={form.email} onChange={e => update({ email: e.target.value })} />",
            language: "tsx",
            notes: [
              "input の `value` が undefined だと『Controlled → Uncontrolled に変わった』警告 — 初期値で空文字を必ず設定",
              "数値入力は `valueAsNumber` を使うか onChange で parseInt",
            ],
          },
          {
            heading: "5.2 Uncontrolled Component と useRef",
            body: "Uncontrolled は state を持たず DOM が真実、`ref` で値を読み出す方式。フィールド数が多い・パフォーマンスを優先する場合や、React Hook Form の内部実装でも使われる。`defaultValue` で初期値を渡す (value ではない)。",
            code: "function Form() {\n  const emailRef = useRef<HTMLInputElement>(null)\n  const passwordRef = useRef<HTMLInputElement>(null)\n\n  const handleSubmit = (e: React.FormEvent) => {\n    e.preventDefault()\n    login(emailRef.current!.value, passwordRef.current!.value)\n  }\n\n  return (\n    <form onSubmit={handleSubmit}>\n      <input ref={emailRef} type=\"email\" defaultValue=\"\" />\n      <input ref={passwordRef} type=\"password\" defaultValue=\"\" />\n      <button>Login</button>\n    </form>\n  )\n}",
            language: "tsx",
            notes: [
              "Controlled = state が真実、Uncontrolled = DOM が真実",
              "迷ったら Controlled が安全。パフォーマンス問題が出てから Uncontrolled / RHF に切り替え",
            ],
          },
          {
            heading: "5.3 useRef の 2 つの顔",
            body: "useRef は (1) DOM への参照、(2) 再レンダリングしない可変な値、の 2 用途。`ref.current` の代入は再レンダリングを発生させない (state とは違う) ので、タイマー ID やインスタンスを保持するのに最適。",
            code: "// (1) DOM 参照\nfunction Input() {\n  const inputRef = useRef<HTMLInputElement>(null)\n  useEffect(() => { inputRef.current?.focus() }, [])\n  return <input ref={inputRef} />\n}\n\n// スクロール\nconst boxRef = useRef<HTMLDivElement>(null)\nconst scrollToTop = () => boxRef.current?.scrollTo({ top: 0, behavior: 'smooth' })\n\n// (2) 再レンダリング不要な値\nfunction Timer() {\n  const intervalRef = useRef<number | null>(null)\n  const startedAtRef = useRef<number>(Date.now())\n\n  useEffect(() => {\n    intervalRef.current = window.setInterval(tick, 1000)\n    return () => {\n      if (intervalRef.current) window.clearInterval(intervalRef.current)\n    }\n  }, [])\n}\n\n// 最新値を closure に閉じ込めずに参照したい時\nconst countRef = useRef(count)\nuseEffect(() => { countRef.current = count }, [count])\nuseEffect(() => {\n  const id = setInterval(() => console.log(countRef.current), 1000)\n  return () => clearInterval(id)\n}, [])",
            language: "tsx",
            notes: [
              "ref.current は『描画と独立した可変領域』 — レンダー結果に影響する値は state を使う",
              "ref を読むタイミングはレンダー後 (useEffect / イベント) — レンダー中の参照は避ける",
            ],
          },
          {
            heading: "5.4 forwardRef と React 19 の props ref",
            body: "子コンポーネント自身の DOM を親が ref で取りたい時、React 18 までは `forwardRef` でラップが必要だった。React 19+ では関数コンポーネントが `ref` を普通の props として受け取れるようになり、forwardRef が不要に。",
            code: "// React 18 まで\nimport { forwardRef } from 'react'\nconst MyInput = forwardRef<HTMLInputElement, { label: string }>(\n  ({ label }, ref) => (\n    <label>\n      {label}\n      <input ref={ref} />\n    </label>\n  )\n)\n\n// 親\nconst ref = useRef<HTMLInputElement>(null)\n<MyInput ref={ref} label=\"name\" />\nref.current?.focus()\n\n// React 19+ (forwardRef 不要)\nfunction MyInput({ label, ref }: { label: string; ref: React.Ref<HTMLInputElement> }) {\n  return (\n    <label>\n      {label}\n      <input ref={ref} />\n    </label>\n  )\n}\n\n// useImperativeHandle で『公開する API』を絞る\nfunction MyInput({ ref }: { ref: React.Ref<{ focus: () => void; clear: () => void }> }) {\n  const inputRef = useRef<HTMLInputElement>(null)\n  useImperativeHandle(ref, () => ({\n    focus: () => inputRef.current?.focus(),\n    clear: () => { if (inputRef.current) inputRef.current.value = '' },\n  }))\n  return <input ref={inputRef} />\n}",
            language: "tsx",
            notes: [
              "useImperativeHandle は『DOM 全部ではなく特定の API だけ公開したい』時に使う",
              "ref をむやみに親に公開すると封じ込めが崩れるので最後の手段",
            ],
          },
        ],
        keyTakeaways: [
          "迷ったら Controlled、フォーム規模が大きいなら React Hook Form (Uncontrolled ベース)",
          "useRef は DOM 参照 + 再レンダリング不要な値の 2 用途",
          "React 19+ では ref が普通の props に — forwardRef は徐々に消える",
        ],
        comprehensionQuestionIds: ["react-009", "react-013"],
      },
      {
        id: "performance-and-rerenders",
        title: "6. パフォーマンスと再レンダリング — memo / useMemo / Profiler / React Compiler",
        intro:
          "再レンダリングは速いが、巨大な計算や大きな子ツリーは別。React.memo / useMemo / useCallback の使いどころと、Profiler での計測 → 対策 → 再計測のサイクルを整理。",
        readingMinutes: 9,
        objectives: [
          "React.memo / useMemo / useCallback の役割を区別できる",
          "本当に必要な場所だけメモ化する原則 (計測してから) を理解する",
          "React Compiler (React 19+) で自動メモ化される未来を知る",
        ],
        sections: [
          {
            heading: "6.1 React.memo — props 同値で再レンダリングをスキップ",
            body: "`React.memo(Component)` でラップすると、props が浅い比較 (`Object.is`) で同じなら再レンダリングをスキップ。親が再レンダリングしても子は不変。ただし props にオブジェクト / 関数 / 配列を渡すと毎回 new で参照が変わるので、`useMemo` / `useCallback` で安定化する必要がある。",
            code: "// 普通の子は親の再レンダリングで毎回再レンダリング\nfunction Child({ value }: { value: number }) {\n  console.log('render Child')\n  return <div>{value}</div>\n}\n\n// memo でラップ\nconst MemoChild = React.memo(function Child({ value }: { value: number }) {\n  console.log('render MemoChild')\n  return <div>{value}</div>\n})\n\nfunction Parent() {\n  const [n, setN] = useState(0)\n  return (\n    <>\n      <button onClick={() => setN(n + 1)}>{n}</button>\n      <Child value={42} />          {/* n 変化で毎回 render */}\n      <MemoChild value={42} />      {/* 42 のままなので skip */}\n    </>\n  )\n}\n\n// props に関数を渡すと... 毎回新しい参照\n<MemoChild value={42} onClick={() => doX(id)} />\n// ↑ onClick が毎回 new → memo が効かない\n\n// useCallback で安定化\nconst onClick = useCallback(() => doX(id), [id])\n<MemoChild value={42} onClick={onClick} />\n\n// オブジェクトも同様\nconst options = useMemo(() => ({ size: 10 }), [])\n<MemoChild options={options} />",
            language: "tsx",
            notes: [
              "memo は『浅い』比較。深いオブジェクトの中身比較が必要なら第 2 引数で custom 比較関数",
              "全 Component を memo にすると逆に重くなる (比較コスト) — 計測してから",
            ],
          },
          {
            heading: "6.2 useMemo / useCallback — いつ使うか",
            body: "`useMemo(() => expensive(), deps)` は重い計算結果のキャッシュ、`useCallback(fn, deps)` は関数自体のキャッシュ。本当に効くケースは: (1) memo 済みの子に渡すオブジェクト / 関数 props を安定化、(2) 確実に重い計算 (大量データの filter+sort)、(3) 派生値で useEffect の依存に入る関数 / オブジェクト。",
            code: "// ✅ 重い計算 (大量データのフィルタ + ソート)\nconst filtered = useMemo(\n  () => items.filter(i => i.matches(query)).sort((a, b) => a.name.localeCompare(b.name)),\n  [items, query]\n)\n\n// ✅ memo 済み子の props 安定化\nconst onClick = useCallback(() => doSomething(id), [id])\n<MemoChild onClick={onClick} />\n\n// ✅ useEffect の依存に入る値\nconst params = useMemo(() => ({ id, page }), [id, page])\nuseEffect(() => { fetch(buildUrl(params)) }, [params])\n\n// ❌ 安易な濫用 (比較コストが上回る)\nconst x = useMemo(() => a + b, [a, b])   // ← 単純加算には不要\nconst handler = useCallback(() => {}, [])  // ← 渡し先がない関数を安定化しても意味なし",
            language: "tsx",
            notes: [
              "useMemo / useCallback は『正しさ』のためではなく『性能最適化』のためのみ — 機能のために頼らない",
              "React Compiler (次節) が自動でやってくれる未来が来る",
            ],
          },
          {
            heading: "6.3 Profiler で計測 → 対策 → 再計測",
            body: "ブラウザ拡張 React DevTools の Profiler タブで『どのコンポーネントが何 ms で描画されたか / 再レンダリング理由』を可視化できる。『推測するな、計測せよ』。Why-Did-You-Render ライブラリで『なぜ再レンダリングしたか』を console に出すと props 差分も追える。",
            code: "// 計測手順\n// 1. ブラウザに React DevTools 拡張をインストール\n// 2. DevTools の『Profiler』タブを開く\n// 3. 録画ボタン (●) を押す\n// 4. アプリを操作する\n// 5. 録画停止\n// 6. 各コンポーネントの『描画時間』『再レンダリング回数』『理由』が見える\n\n// why-did-you-render (開発時)\nimport whyDidYouRender from '@welldone-software/why-did-you-render'\nif (process.env.NODE_ENV === 'development') {\n  whyDidYouRender(React, { trackAllPureComponents: true })\n}\nMyComponent.whyDidYouRender = true\n// 不要な再レンダリング時に console に props 差分が出る",
            language: "tsx",
            notes: [
              "Production ビルドは Profiler 用に別ビルドが必要 (Next.js は --profile フラグ)",
              "並行 Mode の commit / mount / update のフラグも色分けで見える",
            ],
          },
          {
            heading: "6.4 React Compiler — 自動メモ化の未来",
            body: "React Compiler (React 19 で実験的・2025 年に向けて安定化) はビルド時にコードを解析し、必要な useMemo / useCallback / memo を自動で挿入する。これにより手動メモ化のほとんどが不要になる予定。導入は Babel プラグイン or SWC プラグインで段階的に。",
            code: "// 現在 (手動メモ化)\nconst filtered = useMemo(\n  () => items.filter(i => i.active),\n  [items]\n)\nconst onClick = useCallback(() => action(id), [id])\n\n// React Compiler 適用後 (手動メモ化が不要に)\nconst filtered = items.filter(i => i.active)\nconst onClick = () => action(id)\n// Compiler が依存解析して自動でメモ化\n\n// Babel プラグイン (実験)\n// .babelrc\n// {\n//   \"plugins\": [\"babel-plugin-react-compiler\"]\n// }\n\n// eslint-plugin-react-compiler で Compiler 非互換コードを検出\n// (条件分岐内 Hook、mutate しているコード、etc)",
            language: "tsx",
            notes: [
              "Compiler の前提は『React のルール (Hook ルール + props/state を mutate しない) を守る』こと",
              "守れていれば手動メモ化を消していける — Compiler 導入前に ESLint + 型でルールを徹底",
            ],
          },
        ],
        keyTakeaways: [
          "React.memo は props 同値で再レンダリングスキップ、関数/オブジェクト props は useCallback/useMemo で安定化",
          "安易なメモ化は逆効果 — Profiler で計測してから",
          "React Compiler の到来で手動メモ化は減る方向 — ルールを守るコードが資産に",
        ],
        comprehensionQuestionIds: ["react-004", "react-019"],
      },
      {
        id: "suspense-error-boundary-and-rsc",
        title: "7. Suspense / Error Boundary / Server Components",
        intro:
          "宣言的にローディングとエラーを扱う Suspense と Error Boundary、そして React 19+ で本格化する Server Components / Server Actions / use() Hook を整理。",
        readingMinutes: 10,
        objectives: [
          "<Suspense fallback={...}> でデータ取得中の UI を宣言的に書ける",
          "Error Boundary (react-error-boundary) でツリー単位のエラーを捕捉できる",
          "Server / Client Components の境界、Server Actions、use() Hook の役割を理解する",
        ],
        references: [
          { label: "Server Components (公式)", url: "https://react.dev/reference/rsc/server-components" },
          { label: "Suspense (公式)", url: "https://react.dev/reference/react/Suspense" },
        ],
        sections: [
          {
            heading: "7.1 Suspense — ローディングを宣言的に",
            body: "`<Suspense fallback={<Loading />}>` で囲んだ中で『データ準備中』のコンポーネントが現れると、自動で fallback が表示される。TanStack Query (`useSuspenseQuery`)、Next.js App Router (Server Component の async)、Relay などが対応。`if (loading) return <Loading />` をコンポーネント毎に書く必要がなくなる。",
            code: "import { Suspense } from 'react'\n\n// Next.js App Router (Server Component)\nexport default function Page() {\n  return (\n    <main>\n      <h1>Posts</h1>\n      <Suspense fallback={<Skeleton />}>\n        <Posts />          {/* async Server Component、データ取得中は Skeleton */}\n      </Suspense>\n    </main>\n  )\n}\n\nasync function Posts() {\n  const posts = await db.post.findMany()\n  return <PostList items={posts} />\n}\n\n// クライアント (TanStack Query)\nimport { useSuspenseQuery } from '@tanstack/react-query'\nfunction Posts() {\n  const { data } = useSuspenseQuery({\n    queryKey: ['posts'],\n    queryFn: () => fetch('/api/posts').then(r => r.json()),\n  })\n  return <PostList items={data} />\n}",
            language: "tsx",
            diagram: `sequenceDiagram
  participant Browser
  participant Server
  participant DB

  Browser->>Server: GET /dashboard
  Server-->>Browser: HTML (shell + Skeleton 1, Skeleton 2)
  Note over Browser: 早期 TTFB (即描画)
  par UserStats (fast)
    Server->>DB: SELECT stats
    DB-->>Server: 結果 (50ms)
    Server-->>Browser: <chunk> UserStats HTML
    Note over Browser: Skeleton 1 → 実 UI
  and Charts (slow)
    Server->>DB: 複雑な集計
    DB-->>Server: 結果 (800ms)
    Server-->>Browser: <chunk> Charts HTML
    Note over Browser: Skeleton 2 → 実 UI
  end`,
            diagramCaption: "Suspense + Streaming SSR: 全データ完了を待たず、準備できた部品から順に HTML を配信",
            notes: [
              "Suspense は『データ取得中 = まだ render できない』を React に伝える仕組み",
              "Next.js App Router では Suspense 境界ごとにストリーミング SSR (HTML を部分配信)",
            ],
          },
          {
            heading: "7.2 Error Boundary — ツリー単位のエラー捕捉",
            body: "render / lifecycle / Hook で発生した例外を捕捉してフォールバック UI を表示する仕組み。React 本体には class 版しかないので、関数コンポーネントで書きたいなら `react-error-boundary` ライブラリが定番。Sentry 等のエラー監視に統合するのが実務の鉄板。",
            code: "import { ErrorBoundary } from 'react-error-boundary'\n\nfunction Fallback({ error, resetErrorBoundary }: { error: Error; resetErrorBoundary: () => void }) {\n  return (\n    <div role=\"alert\">\n      <p>Something went wrong:</p>\n      <pre>{error.message}</pre>\n      <button onClick={resetErrorBoundary}>Retry</button>\n    </div>\n  )\n}\n\n<ErrorBoundary\n  FallbackComponent={Fallback}\n  onError={(err, info) => Sentry.captureException(err, { extra: info })}\n  onReset={() => refetch()}\n>\n  <Suspense fallback={<Loading />}>\n    <Posts />\n  </Suspense>\n</ErrorBoundary>",
            language: "tsx",
            notes: [
              "Error Boundary は『render 中』のエラーだけ捕捉 — イベントハンドラ内のエラーは普通の try/catch で",
              "非同期 (Promise / setTimeout) のエラーも対象外 — Promise 内で setState して、その値を render 時に throw する手も",
              "Suspense と組み合わせるとローディング (Suspense) + 失敗 (Error Boundary) を両方宣言的に",
            ],
          },
          {
            heading: "7.3 Server / Client Components の境界 (RSC)",
            body: "Next.js App Router など RSC 対応フレームワークでは、Server Component (デフォルト、ファイル末尾に `'use client'` 無し) と Client Component (`'use client'` 付き) の 2 種類が共存する。Server は async や DB 直接アクセスが書ける、Client は state / Hook が使える。境界を越える props は『シリアライズ可能』なものに限る。",
            code: "// app/page.tsx (Server Component — デフォルト)\nimport { Counter } from './counter'           // Client\nimport { db } from '@/lib/db'\n\nexport default async function Page() {\n  const items = await db.item.findMany()       // Server で DB アクセス\n  return (\n    <main>\n      <h1>Items</h1>\n      <ul>{items.map(i => <li key={i.id}>{i.name}</li>)}</ul>\n      <Counter initial={items.length} />        {/* number = OK */}\n    </main>\n  )\n}\n\n// app/counter.tsx (Client Component)\n'use client'\nimport { useState } from 'react'\n\ntype Props = {\n  initial: number\n  // onClick: () => void   ❌ 関数は Server → Client に渡せない\n  // date: Date            ❌ Date もダメ (文字列にして渡す)\n}\n\nexport function Counter({ initial }: Props) {\n  const [n, setN] = useState(initial)\n  return <button onClick={() => setN(n + 1)}>{n}</button>\n}",
            language: "tsx",
            notes: [
              "Server Component は『ブラウザに JS が配信されない』 — バンドルサイズ削減",
              "Client は state / useEffect / イベントハンドラ / ブラウザ API のために必要な時に限定",
              "シリアライズ可能 = string / number / boolean / null / 配列 / プレーンオブジェクト / Promise (React 19+)",
            ],
          },
          {
            heading: "7.4 use() Hook と Server Actions (React 19+)",
            body: "React 19 で `use(promise)` Hook が登場 — Promise を渡すと Suspense 統合で値を取り出せる (try/await 風)。`use(Context)` でも Context を読める。Server Actions (`'use server'` の関数) は `<form action={fn}>` 経由で Server 側関数を呼べ、Rails の `form_with` 的体験。",
            code: "// use(promise) — Promise を関数的に解決\nimport { use, Suspense } from 'react'\n\nfunction Posts({ promise }: { promise: Promise<Post[]> }) {\n  const posts = use(promise)        // suspense と統合\n  return <PostList items={posts} />\n}\n\nexport default function Page() {\n  const promise = fetchPosts()      // Promise を作るだけ (await しない)\n  return (\n    <Suspense fallback={<Loading />}>\n      <Posts promise={promise} />\n    </Suspense>\n  )\n}\n\n// Server Actions\n// app/actions.ts\n'use server'\nimport { db } from '@/lib/db'\nexport async function createPost(formData: FormData) {\n  const title = formData.get('title') as string\n  await db.post.create({ data: { title } })\n}\n\n// app/new-post.tsx\nimport { createPost } from './actions'\nexport default function NewPost() {\n  return (\n    <form action={createPost}>\n      <input name=\"title\" />\n      <button>Create</button>\n    </form>\n  )\n}\n\n// useTransition + 楽観的更新\nconst [pending, startTransition] = useTransition()\nstartTransition(async () => {\n  await createPost(formData)\n})\n\n// useOptimistic\nconst [optimisticTodos, addOptimistic] = useOptimistic(\n  todos,\n  (state, newTodo: Todo) => [...state, { ...newTodo, pending: true }]\n)",
            language: "tsx",
            notes: [
              "use() は if の中でも呼べる (Hook ルールの例外) — 条件付きで Promise を解決可能",
              "Server Actions の戻り値は『シリアライズ可能』なものに限る、エラーは throw でなく戻り値で返す慣習",
              "useTransition / useOptimistic で『送信中も UI を反応的に』",
            ],
          },
        ],
        keyTakeaways: [
          "<Suspense fallback={...}> でローディングを宣言的に、Error Boundary でエラーを宣言的に",
          "Server / Client Components の境界を意識、props はシリアライズ可能なものに",
          "React 19+ の use() / Server Actions / useOptimistic で『送信 → 反映』の体験が一段階上がる",
        ],
        comprehensionQuestionIds: ["react-015", "react-016", "react-018"],
      },
    ],
};
