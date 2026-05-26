import type { Guide } from "./types";

export const pythonIntroGuide: Guide = {
    id: "python-intro",
    trackId: "python",
    title: "Python の地図 — 静かで強い言語",
    subtitle:
      "公式 Tutorial + Fluent Python のエッセンスを 7 章に。基礎 → コレクションと内包表記 → 関数とデコレータ → クラスと dataclass → 例外と with → イテレータ/Generator → モダン開発 (型ヒント・pytest・uv)",
    audience:
      "Python を体系的に学びたい人、Ruby / JS から移ってきた人、データ・スクリプト・Web 用途で『土台』を固めたい人",
    sources: [
      { label: "Python 公式チュートリアル", url: "https://docs.python.org/ja/3/tutorial/" },
      { label: "Python 公式リファレンス", url: "https://docs.python.org/ja/3/library/" },
      { label: "PEP 8 (スタイルガイド)", url: "https://peps.python.org/pep-0008/" },
    ],
    emoji: "🐍",
    relatedCategoryIds: ["python-basics"],
    chapters: [
      {
        id: "values-and-syntax",
        title: "1. 値と構文 — インデントと f-string、Ruby/JS との違い",
        intro:
          "Python の基本構文 (インデントブロック、変数、組み込み型、真偽値、f-string) を整理。Ruby / JS との『うっかり差』を押さえる。",
        readingMinutes: 7,
        objectives: [
          "Python の基本型 (int / float / str / bool / None) と型変換関数 (int() / str() / float()) を扱える",
          "Python の falsy 値 (False / 0 / '' / [] / {} / None) を Ruby/JS と比較して説明できる",
          "f-string で文字列補間・フォーマット・デバッグ表示が書ける",
        ],
        sections: [
          {
            heading: "1.1 インデントと型",
            body: "Python はブロックを波括弧ではなく『インデント』で区切る。慣習的に半角スペース 4 個 (PEP 8)。型は動的だが、組み込み型は `int` / `float` / `str` / `bool` / `None` / `list` / `tuple` / `dict` / `set`。型は `type(x)` で取得、判定は `isinstance(x, T)`。",
            code: "# インデント = ブロック\nif x > 0:\n    print('positive')\nelse:\n    print('zero or negative')\n\n# 型\nprint(type(None))      # <class 'NoneType'>\nprint(type([]))        # <class 'list'>\nprint(type({}))        # <class 'dict'>\n\nisinstance(x, int)\nx is None              # None 判定は `is` (==ではなく)\n\n# 型変換は型名関数で統一\nint('42')              # 42\nfloat('3.14')          # 3.14\nstr(42)                # '42'\nint(3.7)               # 3 (切り捨て)",
            language: "python",
            notes: [
              "PEP 8 はインデント 4 spaces、最大 79 文字 / 行、import は標準→サードパーティ→ローカル",
              "tab と space を混ぜると IndentationError",
            ],
          },
          {
            heading: "1.2 演算子と数値",
            body: "Python 3 では `/` は常に float、`//` は整数除算 (切り捨て)、`%` は剰余、`**` は冪乗。金額計算は `decimal.Decimal` を使う (浮動小数点の誤差回避)。",
            code: "10 / 3          # 3.3333... (float)\n10 // 3         # 3        (整数除算)\n10 % 3          # 1        (剰余)\n2 ** 10         # 1024     (冪)\ndivmod(10, 3)   # (3, 1)   (商, 余り)\n\n# 浮動小数点の罠\n0.1 + 0.2 == 0.3      # False! (誤差)\n\n# decimal で正確に\nfrom decimal import Decimal\nDecimal('0.1') + Decimal('0.2')   # Decimal('0.3')",
            language: "python",
            notes: [
              "Python 2 は `/` が整数同士で整数除算 — Python 3 で挙動が変わったので注意",
              "金融計算・税計算は必ず Decimal、または整数 (cents) で扱う",
            ],
          },
          {
            heading: "1.3 真偽値と falsy",
            body: "Python の falsy は `False` / `0` / `0.0` / `''` / `[]` / `{}` / `set()` / `None`。空コレクションも falsy なので `if my_list:` で『空でないか』を判定するイディオムが定番。これは Ruby (空配列も truthy) や JS (空配列も truthy) と決定的に違う。",
            code: "bool(False)     # False\nbool(0)         # False\nbool('')        # False\nbool([])        # False    ← Ruby/JS と違う\nbool({})        # False    ← Ruby/JS と違う\nbool(None)      # False\nbool([0])       # True\n\n# よくあるイディオム\nif my_list:                 # 空でない時\n    process(my_list)\n\nname = user_input or 'guest'   # 空文字なら 'guest'",
            language: "python",
            notes: [
              "Ruby: nil / false 以外は全部 truthy (空配列も true)",
              "JavaScript: 空配列 [] / 空オブジェクト {} は truthy",
            ],
          },
          {
            heading: "1.4 f-string と文字列",
            body: "Python 3.6+ では `f'...'` で文字列補間。`{var}` で展開、`{expr:.2f}` でフォーマット指定、`{var=}` で名前付きデバッグ (3.8+)。`'''` / `\"\"\"` で複数行。",
            code: "name = 'Alice'\nage = 30\n\nf'Hello, {name}!'              # 'Hello, Alice!'\nf'{3.14159:.2f}'                # '3.14'\nf'{1000:,}'                     # '1,000'\nf'{name=}, {age=}'              # \"name='Alice', age=30\" (デバッグ)\n\n# 複数行\nmsg = f'''\nName: {name}\nAge:  {age}\n'''\n\n# 文字列メソッド\n'hello'.upper()                 # 'HELLO'\n'  hi  '.strip()                # 'hi'\n'a,b,c'.split(',')              # ['a', 'b', 'c']\n','.join(['a', 'b', 'c'])       # 'a,b,c'",
            language: "python",
            notes: [
              "% フォーマット (`'%s' % name`) や .format() は古い — f-string 推奨",
              "f-string は最も速い文字列補間 (PEP 498)",
            ],
          },
        ],
        keyTakeaways: [
          "ブロックはインデント、慣習は半角スペース 4 個 (PEP 8)",
          "空コレクションは falsy — Ruby/JS とは決定的に違う",
          "/ は float、// は整数除算、金額計算は Decimal",
          "文字列補間は f-string 一択",
        ],
        comprehensionQuestionIds: ["py-001", "py-002", "py-003", "py-004", "py-007"],
      },
      {
        id: "collections-and-comprehensions",
        title: "2. コレクションと内包表記 — list / tuple / dict / set",
        intro:
          "Python の 4 大コレクション型と、内包表記 (comprehension) でフィルタ + マップを 1 行で書くイディオムを身につける。",
        readingMinutes: 8,
        objectives: [
          "list / tuple / dict / set の特徴と使い分けを説明できる",
          "スライス `[start:end:step]` を使いこなせる",
          "list / dict / set / generator 内包表記を書ける",
        ],
        sections: [
          {
            heading: "2.1 4 大コレクション",
            body: "`list`: 順序あり / 可変。`tuple`: 順序あり / 不変 (ハッシュ可)。`dict`: キー → 値 / 順序あり (3.7+)。`set`: 重複なし / 順序なし。",
            code: "# list (順序あり、可変)\nfruits = ['apple', 'banana', 'cherry']\nfruits.append('date')\nfruits[0]                       # 'apple'\nfruits[-1]                      # 'date' (負数で末尾から)\n\n# tuple (順序あり、不変)\npoint = (1, 2, 3)\nx, y, z = point                 # アンパック\n\n# dict (順序あり = 挿入順、3.7+)\nuser = {'name': 'Alice', 'age': 20}\nuser['age']                     # 20\nuser.get('email', 'N/A')        # キーなしならデフォルト\nuser.keys() / user.values() / user.items()\n\n# set (重複なし、順序なし)\ntags = {'python', 'web', 'python'}\nlen(tags)                        # 2\ntags & other_tags                # 積集合\ntags | other_tags                # 和集合\ntags - other_tags                # 差集合",
            language: "python",
            notes: [
              "tuple は immutable → dict のキーや set の要素に使える (list は不可)",
              "dict の順序保証は Python 3.7+ から (CPython 3.6 で実装、3.7 で言語仕様化)",
            ],
          },
          {
            heading: "2.2 スライスとアンパック",
            body: "Python のスライス `[start:end:step]` は最強の構文の 1 つ。end は含まれない。負の数で末尾から、step で間引き / 逆順。文字列・list・tuple 全部対応。",
            code: "arr = [0, 1, 2, 3, 4, 5]\narr[1:3]            # [1, 2]    (1 以上 3 未満)\narr[:3]             # [0, 1, 2]  (先頭から 3 つ)\narr[3:]             # [3, 4, 5]  (3 から末尾まで)\narr[::-1]           # [5, 4, 3, 2, 1, 0]  逆順\narr[::2]            # [0, 2, 4]  飛ばし\n\n# 文字列も同じ\n'hello'[::-1]       # 'olleh'\n\n# アンパック\na, b, c = [1, 2, 3]\nfirst, *rest = [1, 2, 3, 4]     # first=1, rest=[2,3,4]\nfirst, *middle, last = [1, 2, 3, 4, 5]\n\n# 辞書のマージ (Python 3.9+)\nmerged = {**a, **b}\nmerged = a | b                   # 3.9+",
            language: "python",
          },
          {
            heading: "2.3 内包表記 (comprehensions)",
            body: "`[式 for 変数 in iterable if 条件]` で filter + map を 1 行で書ける Python の代表的イディオム。dict / set / generator 版もあり、メモリ効率を重視するなら generator (`()` で囲む)。",
            code: "# list 内包表記\n[n * 2 for n in range(5)]                # [0, 2, 4, 6, 8]\n[n for n in range(10) if n % 2 == 0]     # [0, 2, 4, 6, 8]\n[(x, y) for x in 'AB' for y in [1, 2]]   # 二重ループ\n\n# dict 内包表記\n{k: v ** 2 for k, v in d.items()}\n{name: age for name, age in zip(names, ages)}\n\n# set 内包表記\n{word.lower() for word in words}\n\n# generator (メモリ効率良)\nsum(n ** 2 for n in range(1_000_000))    # 全要素を保持しない\n\n# zip + enumerate\nlist(zip([1, 2, 3], ['a', 'b', 'c']))    # [(1,'a'),(2,'b'),(3,'c')]\nfor i, x in enumerate(['a', 'b', 'c'], start=1):\n    print(i, x)",
            language: "python",
            notes: [
              "巨大データは generator 式 (`()`) でメモリ節約",
              "内包表記が複雑になりすぎたら通常の for ループに分解する",
            ],
          },
          {
            heading: "2.4 collections モジュール",
            body: "標準ライブラリの `collections` には便利な dict 系コンテナが揃う。`defaultdict` (デフォルト値付き dict)、`Counter` (要素カウント)、`OrderedDict` / `deque` (両端キュー)、`namedtuple`。",
            code: "from collections import defaultdict, Counter, deque\n\n# defaultdict: 存在しないキーで自動初期化\ngroups = defaultdict(list)\nfor item in items:\n    groups[item.category].append(item)\n\n# Counter: 要素の出現数\nCounter('mississippi')      # {'i': 4, 's': 4, 'p': 2, 'm': 1}\nCounter(words).most_common(5)\n\n# deque: 両端 O(1) で追加/削除\nqueue = deque(['a', 'b', 'c'])\nqueue.appendleft('start')\nqueue.popleft()",
            language: "python",
          },
        ],
        keyTakeaways: [
          "list (可変) / tuple (不変・ハッシュ可) / dict (key-value) / set (重複なし) を使い分ける",
          "スライス [start:end:step] は最強のサブセット抽出構文",
          "内包表記で filter + map を 1 行に。巨大データは generator 式で",
          "defaultdict / Counter は『よく書く dict パターン』の最適化版",
        ],
        comprehensionQuestionIds: ["py-005", "py-006", "py-008", "py-012"],
      },
      {
        id: "functions-and-decorators",
        title: "3. 関数とデコレータ — *args / **kwargs / クロージャ / @decorator",
        intro:
          "Python の関数機能 (デフォルト引数、可変長引数、クロージャ、デコレータ) を整理。デコレータは Flask / FastAPI / pytest など至るところで使う。",
        readingMinutes: 9,
        objectives: [
          "デフォルト引数の罠 (mutable な default) を避けられる",
          "*args / **kwargs を読み書きできる",
          "デコレータを自作・適用できる",
        ],
        sections: [
          {
            heading: "3.1 関数定義とデフォルト引数の罠",
            body: "デフォルト引数は『関数定義時に 1 回だけ評価され、全呼び出しで共有される』。list / dict のような mutable をデフォルトに使うと、呼び出しを重ねるたびに状態が貯まる。回避は `None` をデフォルトにして関数内で `if x is None: x = []` する定型句。",
            code: "# 良くない (mutable な default)\ndef bad(items=[]):       # ← 全呼び出しで同じ list を共有\n    items.append(1)\n    return items\n\nbad()    # [1]\nbad()    # [1, 1]  ← 期待は [1]\nbad()    # [1, 1, 1]\n\n# 正しい\ndef good(items=None):\n    if items is None:\n        items = []\n    items.append(1)\n    return items\n\n# キーワード専用引数 (Python 3+)\ndef create_user(name, *, age=0, email=None):\n    # * 以降はキーワード引数として渡す必要あり\n    ...\ncreate_user('A', age=20)             # OK\ncreate_user('A', 20)                  # TypeError",
            language: "python",
            notes: [
              "list / dict / set のような mutable をデフォルトに直接書かない",
              "`*` を入れるとそれ以降はキーワード専用 — 引数の意図を明確にできる",
            ],
          },
          {
            heading: "3.2 *args と **kwargs",
            body: "`*args` で位置引数を tuple として、`**kwargs` でキーワード引数を dict として受ける。逆に呼び出し側でも `*list` / `**dict` で展開できる。ラッパー関数 / デコレータで頻出。",
            code: "def show(*args, **kwargs):\n    print(args)     # tuple\n    print(kwargs)   # dict\n\nshow(1, 2, 3, x=10, y=20)\n# (1, 2, 3)\n# {'x': 10, 'y': 20}\n\n# 展開 (unpack)\nnums = [1, 2, 3]\nfunc(*nums)         # func(1, 2, 3) と同じ\n\nopts = {'name': 'A', 'age': 20}\nfunc(**opts)        # func(name='A', age=20) と同じ\n\n# 任意の関数を中継するラッパー\ndef wrapper(func):\n    def inner(*args, **kwargs):\n        print('call', func.__name__)\n        return func(*args, **kwargs)\n    return inner",
            language: "python",
          },
          {
            heading: "3.3 クロージャと nonlocal",
            body: "内側の関数は外側の変数を捕捉する (クロージャ)。読み取りは自動だが、書き換えには `nonlocal` (関数スコープ) / `global` (モジュールスコープ) で明示する必要がある。これがないと『代入 = ローカル変数作成』になってしまう。",
            code: "def make_counter():\n    count = 0\n    def inner():\n        nonlocal count          # 外側の count を書き換える宣言\n        count += 1\n        return count\n    return inner\n\nc = make_counter()\nc(), c(), c()        # (1, 2, 3)\n\n# nonlocal なしだと\ndef make_counter_bad():\n    count = 0\n    def inner():\n        count += 1          # UnboundLocalError\n        return count\n    return inner",
            language: "python",
          },
          {
            heading: "3.4 デコレータ",
            body: "`@xxx` は関数を引数に取り『変更された関数』を返す高階関数の糖衣構文。ログ / 計測 / 認証 / キャッシュなど『関数本体に混ぜたくない関心事』を切り出せる。`functools.wraps` で元関数のメタデータ (__name__ / __doc__) を保つ。",
            code: "from functools import wraps, lru_cache\nfrom time import perf_counter\n\ndef timer(func):\n    @wraps(func)            # 元関数の __name__ を保つ\n    def inner(*args, **kwargs):\n        start = perf_counter()\n        result = func(*args, **kwargs)\n        print(f'{func.__name__}: {perf_counter() - start:.3f}s')\n        return result\n    return inner\n\n@timer\ndef heavy(n):\n    return sum(range(n))\n\n# 引数付きデコレータ (三段になる)\ndef retry(times):\n    def decorator(func):\n        @wraps(func)\n        def inner(*args, **kwargs):\n            for _ in range(times):\n                try:\n                    return func(*args, **kwargs)\n                except Exception:\n                    pass\n        return inner\n    return decorator\n\n@retry(times=3)\ndef call_api(): ...\n\n# 標準の便利デコレータ\n@lru_cache(maxsize=128)\ndef fib(n):\n    return n if n < 2 else fib(n-1) + fib(n-2)",
            language: "python",
            notes: [
              "@wraps を忘れると inner.__name__ が 'inner' になってデバッグ困難",
              "Flask の @app.route / FastAPI の @app.get / pytest の @pytest.fixture も全部デコレータ",
            ],
          },
        ],
        keyTakeaways: [
          "mutable な default 引数は使わない — None を使い関数内で初期化",
          "*args / **kwargs は『可変長引数の受け取り』と『呼び出し時の展開』両方で使う",
          "外側スコープの書き換えは nonlocal / global で明示",
          "デコレータ + functools.wraps で横断的関心事を切り出す",
        ],
        comprehensionQuestionIds: ["py-011", "py-015", "py-017"],
      },
      {
        id: "classes-and-dataclasses",
        title: "4. クラスと OOP — dunder メソッド・@dataclass・継承と super",
        intro:
          "Python のクラス定義、特殊メソッド (dunder)、`@dataclass` でのボイラープレート削減、継承と `super()` の使い方を整理。",
        readingMinutes: 9,
        objectives: [
          "`__init__` / `__repr__` / `__eq__` などの主要 dunder を書ける",
          "`@dataclass` で定型コードを自動生成できる",
          "`super().__init__()` で親クラスを初期化できる、MRO を理解する",
        ],
        sections: [
          {
            heading: "4.1 クラス定義と特殊メソッド (dunder)",
            body: "Python のクラスは `class` 文で定義。コンストラクタは `__init__(self, ...)`。`self` は第 1 引数として明示的に書く。`__str__` / `__repr__` / `__eq__` / `__lt__` / `__add__` / `__len__` / `__iter__` / `__call__` などの dunder メソッドで演算子・組み込み関数の挙動をカスタムできる。",
            code: "class User:\n    def __init__(self, name, age):\n        self.name = name\n        self.age = age\n\n    def __repr__(self):\n        return f'User(name={self.name!r}, age={self.age})'\n\n    def __eq__(self, other):\n        return isinstance(other, User) and self.name == other.name\n\n    def __hash__(self):\n        return hash(self.name)\n\n    def __lt__(self, other):\n        return self.age < other.age\n\nu = User('Alice', 20)\nrepr(u)             # \"User(name='Alice', age=20)\"\nu == User('Alice', 99)   # True (name で比較)\nsorted([u1, u2, u3])    # __lt__ で並び替え\n\n# クラス変数とインスタンス変数\nclass Counter:\n    total = 0           # クラス変数 (全インスタンス共有)\n    def __init__(self):\n        self.count = 0  # インスタンス変数",
            language: "python",
            notes: [
              "__repr__ は『デバッガで見て分かる文字列』、__str__ は『ユーザー向け』。__str__ 未定義なら __repr__ にフォールバック",
              "__eq__ を定義したら __hash__ も必ず定義 (一貫性のため)",
            ],
          },
          {
            heading: "4.2 @dataclass で定型を自動生成",
            body: "Python 3.7+ の `@dataclass` (from dataclasses import dataclass) はフィールド宣言から `__init__` / `__repr__` / `__eq__` を自動生成。`frozen=True` でイミュータブル化、`field(default_factory=list)` で mutable default の罠を回避。",
            code: "from dataclasses import dataclass, field\n\n@dataclass\nclass User:\n    name: str\n    age: int = 0\n    tags: list[str] = field(default_factory=list)   # mutable default の正解\n\nu = User(name='Alice', age=20)\nprint(u)            # User(name='Alice', age=20, tags=[])\nu == User('Alice', 20)   # True\n\n# frozen で不変クラスに\n@dataclass(frozen=True)\nclass Point:\n    x: float\n    y: float\n\np = Point(1.0, 2.0)\np.x = 99            # FrozenInstanceError\n\n# 比較や順序付け\n@dataclass(order=True)\nclass Task:\n    priority: int\n    name: str\n\nsorted([Task(2, 'B'), Task(1, 'A')])   # priority 順",
            language: "python",
            notes: [
              "type hint が必須 (`name: str` の形)",
              "Rails の Struct や TS の type に近い感覚で使える",
              "Pydantic はバリデーション付きの強化版 dataclass として API 入力に頻用",
            ],
          },
          {
            heading: "4.3 継承と super()",
            body: "`class Sub(Base):` で継承。`super()` で親クラスのメソッドを呼ぶ (Python 3 では引数不要)。多重継承では MRO (Method Resolution Order) に従って解決され、`Cls.__mro__` で確認できる。",
            code: "class Animal:\n    def __init__(self, name):\n        self.name = name\n    def speak(self):\n        return f'{self.name} makes a sound'\n\nclass Dog(Animal):\n    def __init__(self, name, breed):\n        super().__init__(name)         # 親の __init__ を呼ぶ\n        self.breed = breed\n    def speak(self):\n        base = super().speak()         # 親の speak の結果\n        return base + ' + bark!'\n\nd = Dog('Rex', 'Shiba')\nprint(d.speak())     # 'Rex makes a sound + bark!'\n\n# MRO の確認\nclass A: ...\nclass B(A): ...\nclass C(A): ...\nclass D(B, C): ...\nprint(D.__mro__)     # D -> B -> C -> A -> object",
            language: "python",
          },
          {
            heading: "4.4 プロパティとアクセス制御",
            body: "Python には『真の private』はない (慣習で `_name` をプライベート扱い)。`@property` で getter、`@x.setter` で setter を定義し、Ruby のアクセサ風に書ける。`@staticmethod` / `@classmethod` でクラスメソッド。",
            code: "class Temperature:\n    def __init__(self, celsius):\n        self._celsius = celsius\n\n    @property\n    def celsius(self):\n        return self._celsius\n\n    @celsius.setter\n    def celsius(self, value):\n        if value < -273.15:\n            raise ValueError('below absolute zero')\n        self._celsius = value\n\n    @property\n    def fahrenheit(self):\n        return self._celsius * 9 / 5 + 32\n\nt = Temperature(25)\nt.celsius            # 25      (メソッド呼び出しでなく属性アクセス)\nt.fahrenheit         # 77.0\nt.celsius = -500     # ValueError\n\n# classmethod / staticmethod\nclass Date:\n    def __init__(self, y, m, d): ...\n    @classmethod\n    def from_string(cls, s):\n        y, m, d = map(int, s.split('-'))\n        return cls(y, m, d)\n    @staticmethod\n    def is_valid(y, m, d): ...\n\nDate.from_string('2026-01-01')",
            language: "python",
            notes: [
              "慣習: `_name` は 'internal'、`__name` は name-mangling (継承先から隠す)",
              "@property は『属性アクセスのまま検証 / 計算結果を返す』ためのもの",
            ],
          },
        ],
        keyTakeaways: [
          "dunder メソッド (__init__ / __repr__ / __eq__ / __lt__ など) で演算子をカスタム",
          "@dataclass で __init__ / __repr__ / __eq__ を自動生成、frozen で不変化",
          "継承は super().method()、多重継承は __mro__ で順序確認",
          "private は慣習 (_name)。プロパティは @property で",
        ],
        comprehensionQuestionIds: ["py-013", "py-014", "py-016"],
      },
      {
        id: "exceptions-and-with",
        title: "5. 例外と with 文 — try / except / context manager",
        intro:
          "Python の例外処理 (try/except/else/finally) と、リソースの自動クリーンアップを担う `with` 文 (context manager) を整理。",
        readingMinutes: 7,
        objectives: [
          "try / except / else / finally の役割を区別できる",
          "適切な例外型を投げる・捕捉する (ValueError / TypeError / 自作例外)",
          "with 文と @contextmanager で安全なリソース管理を書ける",
        ],
        sections: [
          {
            heading: "5.1 try / except / else / finally",
            body: "Python の例外処理は 4 つの節を持つ。`except` で例外捕捉、`else` は例外が出なかった時のみ、`finally` は常に実行。複数の例外型をまとめて捕捉する書き方と、`as e` で例外オブジェクトを受け取る書き方を覚える。",
            code: "try:\n    result = int(user_input)\nexcept ValueError as e:\n    print(f'invalid number: {e}')\nexcept (TypeError, KeyError) as e:       # 複数まとめて\n    print(f'wrong type or key: {e}')\nexcept Exception as e:                    # 何でも (最終手段)\n    print(f'unknown error: {e}')\nelse:\n    print(f'parsed successfully: {result}')\nfinally:\n    cleanup()                              # 常に実行\n\n# 例外を投げる\nif age < 0:\n    raise ValueError(f'age must be >= 0, got {age}')\n\n# 元の例外を保持してチェーン\ntry:\n    parse(data)\nexcept ParseError as e:\n    raise MyAppError('parse failed') from e",
            language: "python",
            notes: [
              "`except Exception:` は広すぎる — 基本は具体的な型で捕捉",
              "`except:` (型なし) は SystemExit / KeyboardInterrupt まで捕えてしまうので NG",
            ],
          },
          {
            heading: "5.2 例外型の選び方",
            body: "標準例外を適切に使う: `ValueError` (値が不正)、`TypeError` (型が不正)、`KeyError` (dict キーなし)、`IndexError` (list インデックス)、`FileNotFoundError`、`PermissionError`、`RuntimeError` (一般)。ドメイン例外は `Exception` を継承して自作。",
            code: "# 自作例外\nclass NotFoundError(Exception):\n    def __init__(self, resource: str, id: int):\n        super().__init__(f'{resource} #{id} not found')\n        self.resource = resource\n        self.id = id\n\ntry:\n    user = find_user(id)\nexcept NotFoundError as e:\n    print(e.resource, e.id)\n\n# EAFP (Easier to Ask Forgiveness than Permission)\n# Pythonic な書き方: まず試して、失敗を例外で受ける\ntry:\n    value = d[key]\nexcept KeyError:\n    value = default\n\n# vs LBYL (Look Before You Leap)\nif key in d:\n    value = d[key]\nelse:\n    value = default",
            language: "python",
            notes: [
              "Python は EAFP スタイルが推奨 — race condition を避けやすく、コードも短い",
              "ただし dict は `d.get(key, default)` が最も Pythonic",
            ],
          },
          {
            heading: "5.3 with 文と context manager",
            body: "`with` 文はブロック開始時に `__enter__` を、終了時 (例外含む) に `__exit__` を呼ぶ仕組み。ファイル・ロック・接続などのリソースを安全に開閉する。`@contextmanager` で関数から context manager を作れる。",
            code: "# ファイルの自動 close\nwith open('data.txt') as f:\n    content = f.read()\n# ここで自動 close (例外発生時も)\n\n# 複数同時\nwith open('a.txt') as a, open('b.txt', 'w') as b:\n    b.write(a.read())\n\n# @contextmanager で自作\nfrom contextlib import contextmanager\nfrom time import perf_counter\n\n@contextmanager\ndef timer(name):\n    start = perf_counter()\n    try:\n        yield\n    finally:\n        print(f'{name}: {perf_counter() - start:.3f}s')\n\nwith timer('heavy'):\n    do_heavy_thing()\n\n# クラスで実装する版\nclass DBConnection:\n    def __enter__(self):\n        self.conn = connect()\n        return self.conn\n    def __exit__(self, exc_type, exc_val, tb):\n        self.conn.close()\n        return False        # False で例外を再 raise (Ture で握り潰す)",
            language: "python",
            notes: [
              "DB トランザクションの commit/rollback、ロック acquire/release も with で書くのが定番",
              "contextlib.suppress(Exception) で例外を意図的に握り潰すコンテキスト",
            ],
          },
        ],
        keyTakeaways: [
          "try / except / else / finally の役割を区別 (else は『例外が出なかった時』)",
          "適切な標準例外型を使い、ドメイン例外は Exception を継承して自作",
          "EAFP (まず試す) が Pythonic、dict は .get(key, default) でも OK",
          "with 文でリソースの安全な開閉、自作は @contextmanager が最短",
        ],
        comprehensionQuestionIds: ["py-009", "py-010"],
      },
      {
        id: "iterators-and-generators",
        title: "6. イテレータと Generator — yield で遅延評価",
        intro:
          "Python の for ループの裏側 (iter / next)、`yield` で関数を generator にする仕組み、`itertools` の便利関数を整理。",
        readingMinutes: 8,
        objectives: [
          "iterable と iterator の違いを説明できる",
          "yield 関数で generator を作れる、無限列を扱える",
          "itertools (chain / islice / groupby / product / accumulate) の代表例を使える",
        ],
        sections: [
          {
            heading: "6.1 iterable と iterator",
            body: "`iterable` = `__iter__` を持ち for ループ可能な対象 (list / tuple / str / dict / set / file など)。`iterator` = `__next__` を持ち値を 1 つずつ返すオブジェクト。`iter(iterable)` で iterator を取り出し、`next(iterator)` で 1 個進める。",
            code: "lst = [1, 2, 3]\nit = iter(lst)\nnext(it)        # 1\nnext(it)        # 2\nnext(it)        # 3\nnext(it)        # StopIteration\n\n# for は内部で iter + next を呼んでいる\nfor x in lst:\n    print(x)\n# ≒\nit = iter(lst)\nwhile True:\n    try:\n        x = next(it)\n    except StopIteration:\n        break\n    print(x)\n\n# 自作 iterable (__iter__ + __next__)\nclass Counter:\n    def __init__(self, n): self.n = n; self.i = 0\n    def __iter__(self): return self\n    def __next__(self):\n        if self.i >= self.n: raise StopIteration\n        self.i += 1\n        return self.i",
            language: "python",
          },
          {
            heading: "6.2 generator (yield 関数)",
            body: "`yield` を含む関数を呼ぶと『generator オブジェクト』が返る (関数本体はまだ実行されない)。`next()` で 1 つずつ実行し、yield で中断 → 次の next で再開。メモリ効率が極めて良く、無限列も扱える。",
            code: "def count_up(start=0):\n    while True:\n        yield start         # ここで中断 → next() で再開\n        start += 1\n\nc = count_up()\nnext(c)         # 0\nnext(c)         # 1\nnext(c)         # 2\n\n# 巨大データの逐次処理\ndef read_lines(path):\n    with open(path) as f:\n        for line in f:\n            yield line.rstrip()\n\nfor line in read_lines('huge.log'):\n    process(line)        # メモリに全部読まない\n\n# generator expression (内包表記の () 版)\nsquares = (x ** 2 for x in range(1_000_000))\nsum(squares)                 # 全要素を保持しない\n\n# yield from で他の generator を委譲\ndef flatten(nested):\n    for sub in nested:\n        yield from sub      # サブ generator の全要素を中継",
            language: "python",
            notes: [
              "generator は『一度使い切ったら終わり』(再度 iter しても何も出ない) — 必要なら関数を呼び直して新しい generator を得る",
              "巨大データ / 無限列 / ストリーミング処理で必須",
            ],
          },
          {
            heading: "6.3 itertools の常連",
            body: "標準ライブラリ `itertools` には iterator を組み合わせる関数が大量にある。代表は `chain` (連結)、`islice` (スライス)、`groupby` (連続する同値をまとめる)、`product` (デカルト積)、`combinations` / `permutations` / `accumulate`。",
            code: "from itertools import chain, islice, groupby, product, combinations, accumulate\n\nchain([1, 2], [3, 4])               # 1 2 3 4\nlist(islice(count_up(), 5))         # [0, 1, 2, 3, 4]  無限列を 5 個だけ\n\n# groupby は『連続する同値』をまとめる (要事前ソート)\ndata = [('A', 1), ('A', 2), ('B', 3), ('B', 4), ('A', 5)]\nfor key, group in groupby(data, key=lambda x: x[0]):\n    print(key, list(group))\n# A [('A',1),('A',2)]\n# B [('B',3),('B',4)]\n# A [('A',5)]              ← 連続のみまとめる\n\nlist(product([1, 2], ['a', 'b']))   # [(1,'a'),(1,'b'),(2,'a'),(2,'b')]\nlist(combinations([1, 2, 3], 2))    # [(1,2),(1,3),(2,3)]\nlist(accumulate([1, 2, 3, 4]))      # [1, 3, 6, 10]  累積和",
            language: "python",
          },
        ],
        keyTakeaways: [
          "for ループは iter + next の糖衣 — iterable / iterator の区別を理解",
          "yield 関数 = generator。遅延評価でメモリ効率良 + 無限列対応",
          "巨大データはまず generator 式 (`()`) と yield 関数を検討",
          "itertools (chain / islice / groupby / product / accumulate) は再発明しない",
        ],
        comprehensionQuestionIds: ["py-018"],
      },
      {
        id: "modern-python-workflow",
        title: "7. モダン Python — 型ヒント・pytest・uv / pyproject.toml",
        intro:
          "型ヒント (typing)、pytest によるテスト、uv / poetry / pip + venv によるパッケージ管理と仮想環境。実務で必須の開発体験を整理。",
        readingMinutes: 9,
        objectives: [
          "基本的な型ヒント (int / str / list[T] / dict[K, V] / Optional / Union) を書ける",
          "pytest で関数テスト・fixture・parametrize が書ける",
          "uv / poetry / pip + venv の関係を理解し、pyproject.toml を読める",
        ],
        references: [
          { label: "typing 公式", url: "https://docs.python.org/ja/3/library/typing.html" },
          { label: "pytest 公式", url: "https://docs.pytest.org/" },
          { label: "uv (Astral)", url: "https://docs.astral.sh/uv/" },
        ],
        sections: [
          {
            heading: "7.1 型ヒント (PEP 484, 3.5+)",
            body: "Python の型ヒントは『実行時の強制ではなく、ツールと人間のため』のもの。`mypy` / `pyright` / IDE が読んでチェック・補完してくれる。Python 3.10+ では `X | Y` で union、3.9+ で `list[int]` (大文字 List をインポート不要)。",
            code: "# 基本\ndef add(a: int, b: int) -> int:\n    return a + b\n\ndef greet(name: str, greeting: str = 'Hello') -> str:\n    return f'{greeting}, {name}'\n\n# コレクション (Python 3.9+)\ndef sum_all(nums: list[int]) -> int:\n    return sum(nums)\n\ndef count_words(text: str) -> dict[str, int]: ...\n\n# Optional / Union (3.10+)\ndef find_user(id: int) -> User | None: ...    # 3.10+\n# 3.9 以下なら\nfrom typing import Optional\ndef find_user(id: int) -> Optional[User]: ...\n\n# 自作型のエイリアス\nUserId = int\nfrom typing import TypeAlias\nJsonValue: TypeAlias = str | int | float | bool | None | dict | list\n\n# Protocol (構造的部分型、Duck Typing の型版)\nfrom typing import Protocol\nclass HasLength(Protocol):\n    def __len__(self) -> int: ...\n\ndef show_size(x: HasLength) -> None:\n    print(len(x))     # __len__ があれば何でも OK\n\n# 型チェック\n# $ pip install mypy\n# $ mypy your_file.py",
            language: "python",
            notes: [
              "型ヒントは runtime には影響しない (`int` と書いても string が渡せてしまう)",
              "mypy / pyright を CI に組み込み、エディタ補完を活かすのが目的",
              "Pydantic / FastAPI は型ヒントを runtime にも使って validation する",
            ],
          },
          {
            heading: "7.2 pytest によるテスト",
            body: "現代の Python テストは `pytest` がデファクト。`def test_xxx():` の関数を書いて `assert` するだけ。`@pytest.fixture` で依存注入、`@pytest.mark.parametrize` でデータドリブンテスト。標準の `unittest` よりずっと簡潔。",
            code: "# tests/test_calc.py\nimport pytest\nfrom calc import add, divide\n\ndef test_add():\n    assert add(2, 3) == 5\n\ndef test_divide_by_zero():\n    with pytest.raises(ZeroDivisionError):\n        divide(1, 0)\n\n# fixture (テストの前準備)\n@pytest.fixture\ndef sample_user():\n    return {'name': 'Alice', 'age': 20}\n\ndef test_user_name(sample_user):\n    assert sample_user['name'] == 'Alice'\n\n# parametrize (1 つのテストで複数ケース)\n@pytest.mark.parametrize('a,b,expected', [\n    (1, 2, 3),\n    (5, 6, 11),\n    (-1, 1, 0),\n])\ndef test_add_table(a, b, expected):\n    assert add(a, b) == expected\n\n# Mocking (unittest.mock)\nfrom unittest.mock import patch\n\n@patch('mymodule.api_call')\ndef test_with_mock(mock_api):\n    mock_api.return_value = {'ok': True}\n    assert mymodule.do_thing() == 'ok'\n\n# 実行\n# $ pytest -v\n# $ pytest -k 'add'           # 名前で絞り込み\n# $ pytest --cov=mypackage    # カバレッジ (pytest-cov)",
            language: "python",
          },
          {
            heading: "7.3 仮想環境とパッケージ管理",
            body: "Python は『システム全体に install しない』のが鉄則。プロジェクトごとに仮想環境 (venv) を作って隔離する。ツールは古典派 (pip + venv)、標準デファクト (poetry)、新興・高速 (uv) の 3 系統。",
            code: "# --- uv (推奨、2024〜) Astral 社の Rust 製、超高速 ---\nuv init myapp\ncd myapp\nuv add requests pytest                # 依存追加 + lockfile 更新\nuv add --dev mypy ruff\nuv run python app.py                  # venv を意識せずに実行\nuv run pytest\n\n# --- poetry (2018〜) 定番、pyproject.toml + poetry.lock ---\npoetry init\npoetry add requests\npoetry add --group dev pytest\npoetry install                        # lockfile から再現\npoetry run python app.py\n\n# --- 古典: pip + venv (標準ライブラリだけ) ---\npython -m venv .venv\nsource .venv/bin/activate             # Windows: .venv\\Scripts\\activate\npip install -r requirements.txt\npip install requests\npip freeze > requirements.txt\n\n# --- pyproject.toml (PEP 518/621、標準フォーマット) ---\n# [project]\n# name = 'myapp'\n# version = '0.1.0'\n# requires-python = '>=3.11'\n# dependencies = ['requests', 'pydantic>=2']\n# \n# [project.optional-dependencies]\n# dev = ['pytest', 'mypy', 'ruff']",
            language: "bash",
            notes: [
              "新規プロジェクトなら uv が最速かつ体験が良い (2025 年現在)",
              "既存プロジェクトの選択は『チームと CI が何を使っているか』に合わせる",
              "setup.py / requirements.txt は legacy — pyproject.toml が標準",
            ],
          },
          {
            heading: "7.4 リンタとフォーマッタ",
            body: "コード品質ツール: `ruff` (Rust 製、超高速、lint + format 統合)、`black` (フォーマッタの定番)、`mypy` / `pyright` (型チェック)。ruff は black 互換のフォーマッタも内蔵し、現代の第一候補。",
            code: "# ruff (推奨、2024〜)\nuv add --dev ruff\nuv run ruff check .              # lint\nuv run ruff format .             # format\n\n# pyproject.toml\n# [tool.ruff]\n# line-length = 100\n# select = ['E', 'F', 'I', 'N', 'W', 'B']\n# \n# [tool.ruff.format]\n# quote-style = 'double'\n\n# 古典: black + flake8 + isort + mypy\npip install black flake8 isort mypy\nblack .\nflake8 .\nisort .\nmypy src/",
            language: "bash",
            notes: [
              "CI で ruff check + ruff format --check + mypy を必ず通すのが現代の標準",
              "pre-commit フックに組み込むと『push 前に自動で守れる』",
            ],
          },
        ],
        keyTakeaways: [
          "型ヒントは runtime ではなく『ツールと人間のため』、mypy / pyright で活かす",
          "テストは pytest 一択。fixture + parametrize でデータドリブン",
          "新規は uv、定番は poetry、最小構成は pip + venv",
          "pyproject.toml が標準。ruff で lint + format をワンストップ",
        ],
        comprehensionQuestionIds: ["py-019", "py-020"],
      },
    ],
};
