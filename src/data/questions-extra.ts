import type { Question } from "@/lib/types";

// 新カテゴリ用の追加問題集
// (RSpec, ログ調査, Git/GitHub, セキュリティ, デバッグ, Linux/CLI)
export const extraQuestions: Question[] = [
  // ===========================================================================
  // 🧪 RSpec テスト (8問)
  // ===========================================================================
  {
    id: "rspec-001",
    categoryId: "rspec",
    difficulty: "beginner",
    type: "choice",
    question:
      "RSpec で『テストグループ』を定義するメソッドはどれですか？",
    choices: ["spec", "test", "describe", "group"],
    answerIndex: 2,
    hints: [
      "テスト対象のクラスや機能をくくる外枠です。",
      "ネストして文脈を分けるときは context という別名もあります。",
      "Rails の rspec-rails でも標準で使われる、最上位の DSL です。",
    ],
    explanation: {
      summary:
        "`describe` はテスト対象 (クラス/機能) をグルーピングする DSL。",
      reason:
        "RSpec はテスト構造を文書化する設計。describe で『何をテストするか』、context で『どんな状況で』、it で『どう振る舞うべきか』を書くことで、テストコード自体が仕様書になります。",
      codeExample:
        "RSpec.describe User do\n  describe '#full_name' do\n    context '名と姓が両方ある場合' do\n      it '半角スペースで連結した文字列を返す' do\n        user = User.new(first: 'Alice', last: 'Smith')\n        expect(user.full_name).to eq 'Alice Smith'\n      end\n    end\n  end\nend",
    },
  },
  {
    id: "rspec-002",
    categoryId: "rspec",
    difficulty: "beginner",
    type: "choice",
    question:
      "次のコードで、`expect(result).to eq(42)` が意味することは？",
    code: "RSpec.describe Calculator do\n  it 'adds numbers' do\n    result = Calculator.add(40, 2)\n    expect(result).to eq(42)\n  end\nend",
    choices: [
      "result の型が Integer であることを検証する",
      "result が真であることを検証する",
      "result が 42 と等しいことを検証する (==)",
      "result が 42 のオブジェクトと同一であることを検証する (equal?)",
    ],
    answerIndex: 2,
    hints: [
      "`eq` は同値性 (equality) を表す matcher の略です。",
      "`equal` だと別の意味になります (object_id 比較)。",
      "Ruby の演算子で対応するものを思い出してみてください。",
    ],
    explanation: {
      summary:
        "`eq` は Ruby の `==` 比較。同じオブジェクトかは `equal` で別 matcher。",
      reason:
        "RSpec の主な等価系 matcher は: `eq` (==)、`eql` (.eql?、型も厳密)、`equal` (.equal?、object_id 比較)、`be` (truthy/falsey/同一)。テストの意図 (値が同じか / 同じインスタンスか) で使い分けます。",
      codeExample:
        "expect(1.0).to eq(1)        # OK (== は数値変換)\nexpect(1.0).to eql(1)       # NG (eql? は型厳密)\nexpect(obj1).to equal(obj2) # 同一インスタンスか\nexpect(value).to be true    # is exactly true",
    },
  },
  {
    id: "rspec-003",
    categoryId: "rspec",
    difficulty: "intermediate",
    type: "choice",
    question:
      "RSpec で『各 it の前に毎回実行したいセットアップ』を書くブロックは？",
    choices: ["after", "before(:each)", "before(:all)", "around"],
    answerIndex: 1,
    hints: [
      "頻出のフックです。エイリアスとして `before` 単体でも使えます。",
      "`:all` を指定すると全 example の前に 1 回だけ実行されます。",
      "それぞれの it の独立性を保ちたいので、毎回リセットするフックを選びます。",
    ],
    explanation: {
      summary:
        "`before(:each)` (= `before`) は各 example 前に毎回実行。各テストの独立性を保つ。",
      reason:
        "`:all` は全 example 前に 1 回 (副作用が残ると他のテストに影響するため非推奨)。`around(:each)` はテスト全体をブロックでラップ (DB transaction など)。後始末は `after`、テスト全体のクリーンアップに使う。",
      codeExample:
        "RSpec.describe User do\n  let(:user) { User.create!(name: 'Alice') }\n\n  before do                       # :each と同義\n    Rails.cache.clear\n  end\n\n  around do |example|\n    Time.use_zone('UTC') { example.run }\n  end\nend",
    },
  },
  {
    id: "rspec-004",
    categoryId: "rspec",
    difficulty: "intermediate",
    type: "text",
    question:
      "RSpec で『参照したときに初めて評価される、example 毎にリセットされる遅延変数』を定義するヘルパー名は？(英語1単語)",
    answers: ["let"],
    hints: [
      "メソッドのように呼び出すブロックを宣言します。",
      "強制的に評価したい場合は末尾に ! を付けたバリアントを使います。",
      "describe ブロック内で `xxx { 値 }` と書く DSL です。",
    ],
    explanation: {
      summary:
        "`let(:name) { ... }` は呼び出し時に初めて評価され、example 毎にキャッシュされる遅延変数。",
      reason:
        "`let` は使うときだけ計算するので、不要なテストでは生成コストがかからない。`let!` は強制的に before に実行 (副作用や DB レコードの先行作成に便利)。共有したい値は @ivar より let が推奨。",
      codeExample:
        "RSpec.describe Post do\n  let(:user) { create(:user) }                # 遅延\n  let!(:post) { create(:post, user: user) }   # 即座に作成\n\n  it { expect(post.user).to eq user }\nend",
      commonMistakes: [
        "let の中で @ivar を使うとキャッシュが効かない / 期待通り動かない原因に。",
        "let 内で副作用 (DB 書き込み等) を起こす場合、参照されないと実行されない罠がある。`let!` を検討。",
      ],
    },
  },
  {
    id: "rspec-005",
    categoryId: "rspec",
    difficulty: "intermediate",
    type: "choice",
    question:
      "テスト用データ生成 gem として Rails で最も広く使われているのは？",
    choices: ["faker", "minitest", "fixtures (Rails 標準)", "factory_bot"],
    answerIndex: 3,
    hints: [
      "DSL で柔軟にデータを定義できるのが特徴です。",
      "属性ごとにシーケンスや関連オブジェクトを定義できます。",
      "もとは thoughtbot 社が開発した有名 gem の現名称です。",
    ],
    explanation: {
      summary:
        "factory_bot は柔軟な DSL でテストデータを生成する gem (旧 factory_girl)。",
      reason:
        "fixtures (YAML) は固定でメンテが大変。factory_bot は trait/association/sequence/transient など強力。faker と組み合わせるとリアルなデータが生成可能。",
      codeExample:
        "# spec/factories/users.rb\nFactoryBot.define do\n  factory :user do\n    sequence(:email) { |n| \"user#{n}@example.com\" }\n    name { 'Alice' }\n    trait(:admin) { role { 'admin' } }\n    factory :admin_user, traits: [:admin]\n  end\nend\n\n# 使い方\ncreate(:user)              # DB に作る\nbuild(:user)               # メモリ上だけ\nbuild_stubbed(:user)       # DB を一切叩かない (速い)\ncreate(:admin_user)        # trait 適用",
    },
  },
  {
    id: "rspec-006",
    categoryId: "rspec",
    difficulty: "intermediate",
    type: "choice",
    question: "次のコードの意味は？",
    code: "allow(Notifier).to receive(:send).and_return(true)\nMyService.call\nexpect(Notifier).to have_received(:send).with(user_id: 1)",
    choices: [
      "Notifier をプライベートにする",
      "Notifier.send をスタブ化し、呼ばれたかと引数を検証",
      "Notifier クラスを置き換える",
      "Notifier の例外を捕捉する",
    ],
    answerIndex: 1,
    hints: [
      "外部依存をテスト中に置き換える典型イディオムです。",
      "allow は許可、expect は検証です。",
      "have_received は呼び出し履歴を検証する matcher。",
    ],
    explanation: {
      summary:
        "`allow(...).to receive` でメソッドをスタブ化、`have_received` で呼び出しを検証。",
      reason:
        "外部 API・メール送信・課金等の副作用をテストで実行したくない時に使う。`allow` は呼ばれた時の挙動を定義、`expect(...).to have_received` (spy パターン) で『呼ばれたこと』を後検証。`expect(...).to receive` は『呼ばれることを期待』を先に宣言する書き方。",
      codeExample:
        "# 戻り値を固定\nallow(Stripe).to receive(:charge).and_return(double(success?: true))\n\n# 例外を発生させる\nallow(Stripe).to receive(:charge).and_raise(Stripe::Error)\n\n# 引数毎に分岐\nallow(api).to receive(:fetch).with(1).and_return(:a)\nallow(api).to receive(:fetch).with(2).and_return(:b)\n\n# 呼び出し検証\nexpect(Notifier).to have_received(:send).twice",
    },
  },
  {
    id: "rspec-007",
    categoryId: "rspec",
    difficulty: "intermediate",
    type: "choice",
    question:
      "Rails で『コントローラを HTTP リクエストとしてテストする』推奨スペックタイプは？",
    choices: [
      "request spec",
      "feature spec",
      "model spec",
      "controller spec (古い、非推奨)",
    ],
    answerIndex: 0,
    hints: [
      "Rack/ミドルウェアを含めた本物に近いリクエストを送ります。",
      "Rails 5+ では controller spec の代わりに推奨されています。",
      "ファイル配置は spec/requests/ 配下。",
    ],
    explanation: {
      summary:
        "Rails 5+ では request spec が推奨。controller spec は内部 API を直接叩くので非推奨化。",
      reason:
        "request spec はミドルウェア込みで HTTP リクエストを送るため、ルーティング・controller・view を一気通貫でテスト可能。feature spec (Capybara) はブラウザ操作レベルの E2E、system spec は Capybara + headless browser での E2E。",
      codeExample:
        "# spec/requests/posts_spec.rb\nRSpec.describe 'Posts', type: :request do\n  describe 'POST /posts' do\n    it 'creates a post' do\n      expect {\n        post '/posts', params: { post: { title: 'hi' } }\n      }.to change(Post, :count).by(1)\n      expect(response).to redirect_to(post_path(Post.last))\n    end\n  end\nend",
    },
  },
  {
    id: "rspec-008",
    categoryId: "rspec",
    difficulty: "advanced",
    type: "choice",
    question:
      "次のうち、RSpec のテストが『遅い・脆い』時に最初に疑うべきポイントとして適切なものは？",
    choices: [
      "describe を全部消す",
      "expect を removed する",
      "rspec を minitest に書き換える",
      "create を build_stubbed や build に置き換えられないか",
    ],
    answerIndex: 3,
    hints: [
      "DB アクセスはテスト速度を大きく左右します。",
      "保存が不要なら DB を叩く理由はありません。",
      "オブジェクトの組み立てに方針があると、テストが速くなるはずです。",
    ],
    explanation: {
      summary:
        "DB を叩かない build_stubbed / build に置き換えると劇的に速くなる。",
      reason:
        "factory_bot の `create` は DB INSERT、`build` はメモリ上、`build_stubbed` は id 等まで偽装した完全メモリオブジェクト。バリデーションだけ確認なら build 系で十分。E2E / Request spec は create 必要。テスト時間が伸びる原因の多くは余計な create。",
      codeExample:
        "# 遅い (常に DB INSERT)\nlet(:user) { create(:user) }\n\n# 速い (メモリ上のみ)\nlet(:user) { build(:user) }              # save が必要なら create\nlet(:user) { build_stubbed(:user) }      # id 付き、AR 操作はモック\n\n# 検証だけなら build で十分\nit 'is valid' do\n  expect(build(:user)).to be_valid\nend",
      commonMistakes: [
        "let で create したオブジェクトを使わないテストがあると無駄に DB を叩いている。`let!` で必要な時だけ作る。",
      ],
    },
  },

  // ===========================================================================
  // 📜 ログ調査・運用 (8問)
  // ===========================================================================
  {
    id: "logs-001",
    categoryId: "logs",
    difficulty: "beginner",
    type: "choice",
    question:
      "Rails 開発環境で SQL / リクエストログを見るのに最も標準的なファイルは？",
    choices: [
      "log/runtime.log",
      "tmp/log.log",
      "log/development.log",
      "log/server.log",
    ],
    answerIndex: 2,
    hints: [
      "Rails は環境ごとに log/ 配下にログを出します。",
      "ファイル名はその環境名と一致します。",
      "本番は production.log、テストは test.log です。",
    ],
    explanation: {
      summary:
        "Rails は環境名のログファイルを `log/` に出力。dev=development.log、prod=production.log。",
      reason:
        "Rails のロガーはデフォルトで `Rails.root/log/#{Rails.env}.log` に書き出す。SQL/Rails アクション/エラーがそこに集約される。本番では Logrotate や CloudWatch 等で外部に流す。`tail -f log/development.log` で開発中のリアルタイム監視が定番。",
      codeExample:
        "# リアルタイム監視\ntail -f log/development.log\n\n# エラーだけ抽出\ngrep -E 'ERROR|FATAL' log/development.log\n\n# 直近 100 行\ntail -n 100 log/development.log\n\n# ログレベル設定 (config/environments/*.rb)\nconfig.log_level = :debug   # dev\nconfig.log_level = :info    # prod",
    },
  },
  {
    id: "logs-002",
    categoryId: "logs",
    difficulty: "beginner",
    type: "text",
    question:
      "ログファイルを末尾からリアルタイム監視するコマンドは `tail ???? log/development.log`。???? に入るオプションは？(短いほう、ハイフンで始まる)",
    answers: ["-f", "-F"],
    hints: [
      "follow の頭文字を表すオプションです。",
      "ログが追記されるたびに自動で画面に流れます。",
      "Ctrl-C で終了するまでフォロー継続します。",
    ],
    explanation: {
      summary: "`tail -f` でファイル末尾を follow (追記を自動表示)。",
      reason:
        "`-F` は大文字版で、ファイルがログローテーション等で再作成されても追従。本番のリアルタイム調査では `-F` の方が安全。`-n N` で末尾 N 行、`--pid=N` でプロセス終了とともに tail も終了。",
      codeExample:
        "tail -f log/development.log           # follow\ntail -F log/production.log            # ローテーション追従\ntail -n 200 log/production.log        # 末尾 200 行\ntail -f log/*.log                     # 複数ファイル同時\n\n# 巨大ログを開く時は less が便利\nless +F log/production.log           # follow モード\n# G で末尾へ、/word で検索",
    },
  },
  {
    id: "logs-003",
    categoryId: "logs",
    difficulty: "beginner",
    type: "choice",
    question:
      "ログから『2024-01-15 の ERROR ログだけ』を抽出するコマンドとして適切なのは？",
    choices: [
      "find / -name ERROR",
      "ls log/ | grep 2024",
      "cd log && more error",
      "grep '2024-01-15' log/production.log | grep ERROR",
    ],
    answerIndex: 3,
    hints: [
      "Unix のフィルタリングはパイプで繋ぐのが定番。",
      "grep を 2 回繋いで AND 条件を作ります。",
      "1 回目で日付、2 回目でレベルを絞ります。",
    ],
    explanation: {
      summary:
        "パイプで grep を多段に繋ぐと『AND』フィルタになる。",
      reason:
        "grep の AND は `|` で繋ぐ、もしくは `-E` で正規表現 `2024-01-15.*ERROR`。OR は `-E 'ERROR|FATAL'` か `egrep`。`-i` で大文字無視、`-v` で除外、`-A 3 -B 1` で前後の行も。実務で最も使われるイディオム。",
      codeExample:
        "# AND (パイプ)\ngrep '2024-01-15' production.log | grep ERROR\n\n# AND (正規表現)\ngrep -E '2024-01-15.*ERROR' production.log\n\n# OR\ngrep -E 'ERROR|FATAL|WARN' production.log\n\n# 前後の文脈を出す\ngrep -B 2 -A 5 'NoMethodError' production.log\n\n# 件数だけカウント\ngrep -c 'ERROR' production.log\n\n# 大文字小文字無視\ngrep -i 'error' production.log",
    },
  },
  {
    id: "logs-004",
    categoryId: "logs",
    difficulty: "intermediate",
    type: "choice",
    question:
      "Linux サーバ上で『systemd で起動しているサービスのログ』を見るコマンドは？",
    choices: [
      "cat /var/log/my-app",
      "journalctl -u my-app -f",
      "log -follow my-app",
      "service-log my-app",
    ],
    answerIndex: 1,
    hints: [
      "systemd 環境専用のログ管理ツールです。",
      "`-u` でユニット名 (サービス名) を指定。",
      "`-f` は tail と同じく follow。",
    ],
    explanation: {
      summary:
        "`journalctl -u <service> -f` で systemd 配下サービスのログを follow。",
      reason:
        "systemd 環境 (Ubuntu/Amazon Linux 等) の標準。`-u` ユニット名、`-f` フォロー、`-n 100` 件数、`--since '10 min ago'` 時間範囲、`-p err` ログレベル。古い Sysvinit 環境は `/var/log/` を `tail -f`。",
      codeExample:
        'journalctl -u puma -f                  # サービスを follow\njournalctl -u puma --since "1 hour ago"\njournalctl -u puma -p err              # error レベル以上\njournalctl -u puma -n 200              # 末尾 200 行\njournalctl --disk-usage                # ログサイズ確認\n\n# systemd を使わない場合\ntail -f /var/log/syslog\ntail -f /var/log/nginx/error.log',
    },
  },
  {
    id: "logs-005",
    categoryId: "logs",
    difficulty: "intermediate",
    type: "choice",
    question:
      "Rails コントローラ内で『現在のリクエスト情報を任意のメッセージで出す』のに使うのは？",
    choices: [
      "Rails.logger.info 'hello'",
      "print 'hello'",
      "console.log 'hello'",
      "puts 'hello'",
    ],
    answerIndex: 0,
    hints: [
      "puts はサーバ標準出力に出るだけで永続化されません。",
      "Rails のロガーには info/debug/warn/error/fatal のレベル別メソッドが揃っています。",
      "本番のログには出力レベル設定が効くものを選びます。",
    ],
    explanation: {
      summary:
        "`Rails.logger.info` (debug/warn/error/fatal) を使うと、環境別 log_level が効いて適切に絞れる。",
      reason:
        "`puts` は STDOUT 直書きで永続化されない。`Rails.logger` 経由なら設定された LogDevice (ファイル/CloudWatch/STDOUT) に出力されて、ログレベルで本番の出力量を制御できる。構造化ログにしたいなら `lograge` gem や `Rails.logger.info({user_id: 1}.to_json)`。",
      codeExample:
        "Rails.logger.debug 'detailed info'    # production では出ない\nRails.logger.info  'normal flow'\nRails.logger.warn  'unusual but recoverable'\nRails.logger.error 'something failed'\nRails.logger.fatal 'system unusable'\n\n# 構造化ログ (検索しやすい)\nRails.logger.info({\n  event: 'user_signup',\n  user_id: user.id,\n  duration_ms: 120\n}.to_json)\n\n# タグ付け\nRails.logger.tagged('SignUp', user.id) do\n  Rails.logger.info 'started'\nend",
    },
  },
  {
    id: "logs-006",
    categoryId: "logs",
    difficulty: "intermediate",
    type: "choice",
    question: "ログから 500 エラー上位 5 つの URL を集計するコマンドは？",
    code: "# nginx access log の例 (status, path, ...) が空白区切り",
    choices: [
      "ls -la access.log | head -5",
      "cat access.log",
      'grep " 500 " access.log | awk \'{print $7}\' | sort | uniq -c | sort -rn | head -5',
      "find access.log -name 500",
    ],
    answerIndex: 2,
    hints: [
      "Unix フィルタを 4-5 個パイプで連結します。",
      "`awk` で必要なカラムを取り出し、`sort | uniq -c` で集計、`sort -rn` で件数降順。",
      "実務では非常によく使う『集計の型』です。",
    ],
    explanation: {
      summary:
        "grep → awk → sort → uniq -c → sort -rn → head が Unix 集計の定番パイプライン。",
      reason:
        "ステップ別: (1) grep で 500 だけ抽出、(2) awk で対象列だけ抜く、(3) sort で uniq -c 用に整列、(4) uniq -c で同一値カウント、(5) sort -rn でカウント降順、(6) head -5 で上位だけ。この『grep → awk → sort | uniq -c → sort -rn』は『どんなログでも頻出値を出す』万能パターン。",
      codeExample:
        '# IP アドレス別アクセス数 Top 10\nawk \'{print $1}\' access.log | sort | uniq -c | sort -rn | head -10\n\n# 1分毎のリクエスト数\nawk \'{print substr($4, 2, 17)}\' access.log | sort | uniq -c\n\n# 4xx だけ集計\ngrep -E " 4[0-9]{2} " access.log | awk \'{print $9}\' | sort | uniq -c | sort -rn\n\n# Rails ログから ActionController::RoutingError を集計\ngrep RoutingError log/production.log | awk -F\'"\' \'{print $2}\' | sort | uniq -c | sort -rn | head',
    },
  },
  {
    id: "logs-007",
    categoryId: "logs",
    difficulty: "intermediate",
    type: "text",
    question:
      "巨大なログファイル (数GB) を末尾だけ確認 + 全文検索したい時に最適な、less に近いコマンドで、検索やフォローもできる定番ページャは？(英語1単語、4文字)",
    answers: ["less"],
    hints: [
      "more の上位互換的なツールです。",
      "上下移動・検索・F でフォローモードに切り替え可能。",
      "less is more という有名な言い回しの元になっています。",
    ],
    explanation: {
      summary: "`less` は対話的に巨大ファイルを閲覧・検索できる定番ページャ。",
      reason:
        "`less filename` で開き、矢印/PageUp/PageDown で移動、`/word` で前方検索 (`n` で次)、`?word` で後方検索、`G` で末尾へ、`g` で先頭、`F` で tail -f モード、`q` で終了。Rails ログを開いて検索しながら追える。",
      codeExample:
        "less log/production.log\n#   / + 検索ワード → 前方検索\n#   n → 次の一致\n#   G → 末尾へジャンプ\n#   F → tail -f モード (Ctrl-C で抜ける)\n#   q → 終了\n\n# 圧縮されたログも見られる (zless)\nzless log/production.log.1.gz\n\n# 行番号表示\nless -N log/production.log",
    },
  },
  {
    id: "logs-008",
    categoryId: "logs",
    difficulty: "advanced",
    type: "choice",
    question:
      "本番で発生した 500 エラーを調査する『正しい順序』として最も筋が良いものは？",
    choices: [
      "ログを全部削除して直す",
      "本番 DB を直接編集してから報告",
      "再現 → 仮説 → ログ確認 → 修正 → 再現テスト → デプロイ → 監視",
      "コードを書き換えて push → 動くまで繰り返す",
    ],
    answerIndex: 2,
    hints: [
      "原因が分からないまま修正を投入するのは禁じ手。",
      "ログから事実を集め、仮説を立て、検証可能な最小修正を出す流れがプロ。",
      "本番 DB の直書きは事故の元。",
    ],
    explanation: {
      summary:
        "事実収集 (ログ) → 仮説 → 検証 → 修正 → 再現テスト → デプロイ → 監視、の順が定石。",
      reason:
        "障害対応の鉄則: (1) 影響範囲の特定 (どのユーザー・どの操作)、(2) ログ・APM・Sentry 等で事実を集める、(3) 再現条件を特定、(4) 仮説を立てる、(5) 最小修正を作る、(6) 再現テスト、(7) デプロイ、(8) 監視継続。本番 DB の直書きは取り返しがつかないので最終手段、必ず複数人レビュー + バックアップ。",
      codeExample:
        "# 障害対応のチェックリスト (例)\n1. 影響範囲: 何人が、どんな操作で、何時から失敗?\n2. ログ収集:\n   tail -f log/production.log | grep ERROR\n   journalctl -u puma --since '15 min ago' -p err\n3. APM 確認: New Relic / Skylight / Datadog の異常メトリクス\n4. 再現: ステージングで同じ条件を試す\n5. 仮説: ログのスタックトレースから疑わしいコードを特定\n6. 最小修正: 関係ない変更は混ぜない\n7. テスト: 再現テストを追加\n8. デプロイ + post-mortem",
    },
  },

  // ===========================================================================
  // 🔧 Git & GitHub (8問)
  // ===========================================================================
  {
    id: "git-001",
    categoryId: "git-github",
    difficulty: "beginner",
    type: "choice",
    question:
      "現在のブランチに、別ブランチ feature を統合する 2 つの代表的なコマンドは？",
    choices: [
      "git clone feature / git init feature",
      "git merge feature / git rebase feature",
      "git pull feature / git push feature",
      "git checkout feature / git status feature",
    ],
    answerIndex: 1,
    hints: [
      "1 つは履歴を残した統合、もう 1 つは履歴を直列化する統合です。",
      "片方はマージコミットを作り、片方は履歴を書き換えます。",
      "コミュニティでは流派が分かれる選択肢。",
    ],
    explanation: {
      summary: "merge と rebase の 2 通り。履歴の見え方が変わる。",
      reason:
        "`merge` は両方の履歴を保持してマージコミットを作る。`rebase` は自分のコミットを相手の先端に積み直す (履歴がリニアに見える)。共有ブランチに対する rebase は禁忌 (履歴が書き換わる)。個人 feature ブランチでのみ rebase する流派が多い。",
      codeExample:
        "# 現在のブランチに main の最新を取り込む\ngit fetch origin\ngit merge origin/main       # マージコミット作成\ngit rebase origin/main      # 履歴を main の先端に積み直し\n\n# rebase 中のコンフリクト解決\n# (1) コンフリクトファイルを編集\n# (2) git add\n# (3) git rebase --continue\n# やめたい時: git rebase --abort\n\n# interactive rebase (履歴整理)\ngit rebase -i HEAD~3",
    },
  },
  {
    id: "git-002",
    categoryId: "git-github",
    difficulty: "beginner",
    type: "text",
    question:
      "直前のコミットメッセージだけを修正するコマンドは `git commit ???`。??? に入るオプションは？(--xxx形式)",
    answers: ["--amend"],
    hints: [
      "コミットを書き換えるオプションです。",
      "メッセージのみ・追加変更込み両方に使えます。",
      "push 済みのコミットに対しては禁忌 (force push が必要)。",
    ],
    explanation: {
      summary:
        "`git commit --amend` で直前コミットのメッセージや内容を修正。",
      reason:
        "未 push の直前コミットの typo 修正に最適。push 済みの場合は force push が必要なので、共有ブランチでは原則禁止。チーム規約で『PR 中の自分のブランチ』なら force push OK のことが多い。",
      codeExample:
        '# メッセージだけ修正\ngit commit --amend -m "新しいメッセージ"\n\n# 直前コミットにファイル追加を混ぜる\ngit add forgotten.rb\ngit commit --amend --no-edit\n\n# push 済みなら (個人ブランチのみ)\ngit push --force-with-lease origin feature/x',
      commonMistakes: [
        "main / master に対する --amend + force push は厳禁。",
        "`--force` より `--force-with-lease` の方が安全 (他人のコミットを上書きしない)。",
      ],
    },
  },
  {
    id: "git-003",
    categoryId: "git-github",
    difficulty: "beginner",
    type: "choice",
    question:
      "ステージング (add 済み) を取り消して unmodified に戻すコマンドは？",
    code: "$ git add foo.rb\n$ # foo.rb をステージから外したい",
    choices: [
      "git restore --staged foo.rb",
      "git delete foo.rb",
      "git remove --cache foo.rb",
      "git uncommit foo.rb",
    ],
    answerIndex: 0,
    hints: [
      "新しいコマンド (Git 2.23+) で安全に書けるようになっています。",
      "古いコマンドだと `git reset HEAD foo.rb` でも可能。",
      "ファイルの中身は変えずに、ステージング状態のみ戻します。",
    ],
    explanation: {
      summary:
        "`git restore --staged FILE` でステージング解除 (ファイル内容は保持)。",
      reason:
        "Git 2.23+ で `restore` / `switch` が導入。`restore --staged` (= 旧 `reset HEAD`)、`restore .` (= 旧 `checkout .`)、`switch` (= 旧 `checkout` のブランチ切替部分)。`checkout` のオーバーロードが多かったので分離された。",
      codeExample:
        "# add 取り消し (ステージ解除)\ngit restore --staged foo.rb\n\n# 編集内容を捨ててHEADの状態に戻す (危険、要注意)\ngit restore foo.rb\n\n# ブランチ切替\ngit switch main\ngit switch -c new-feature   # 新ブランチを作って切替\n\n# 旧式 (今でも使える)\ngit reset HEAD foo.rb\ngit checkout foo.rb",
    },
  },
  {
    id: "git-004",
    categoryId: "git-github",
    difficulty: "intermediate",
    type: "choice",
    question:
      "現在の作業途中の変更を『一時退避』して、後で取り出すコマンドは？",
    choices: ["git stash", "git pause", "git hide", "git pocket"],
    answerIndex: 0,
    hints: [
      "一時的に変更を引き出しにしまう機能。",
      "別ブランチに緊急で切り替えたい時に使います。",
      "後で `pop` または `apply` で復元できます。",
    ],
    explanation: {
      summary:
        "`git stash` で WIP を退避、`git stash pop` で復元。",
      reason:
        '急な hotfix で別ブランチに移る時、コミットしたくない WIP を退避するのに便利。`stash list` で一覧、`stash show` で内容、`stash drop` で削除。複数 stash を扱う時はメッセージ付きで `git stash push -m "msg"`。',
      codeExample:
        '# 退避\ngit stash                       # 名無し\ngit stash push -m "WIP: refactor"\ngit stash -u                    # untracked も含める\n\n# 一覧と復元\ngit stash list                  # 一覧\ngit stash show stash@{0}        # 中身確認\ngit stash pop                   # 最新を復元 + 削除\ngit stash apply stash@{1}       # 指定を復元 (削除しない)\n\n# 不要な stash 削除\ngit stash drop stash@{0}\ngit stash clear                 # 全削除',
    },
  },
  {
    id: "git-005",
    categoryId: "git-github",
    difficulty: "intermediate",
    type: "choice",
    question:
      "コンフリクトしたファイルの解消後、コミットに進む正しい順序は？",
    choices: [
      "git push --force だけで OK",
      "コミットを全て削除する",
      "ブランチを削除して作り直す",
      "コンフリクト箇所を編集 → git add ファイル → git commit (merge) または git rebase --continue",
    ],
    answerIndex: 3,
    hints: [
      "<<<<<<< / ======= / >>>>>>> のマーカーを編集で取り除きます。",
      "解決済みであることを git に伝える操作が次に必要です。",
      "最後にコミット (merge) か rebase --continue で次に進めます。",
    ],
    explanation: {
      summary:
        "コンフリクト解決 → git add (解決の合図) → commit (merge) または rebase --continue。",
      reason:
        "Git は『解決済みファイル』を `add` で受け取ってからじゃないと先に進めない仕様。merge 中なら `git commit` (デフォルトメッセージで OK)、rebase 中なら `git rebase --continue`。やめたいなら `git merge --abort` / `git rebase --abort` で元に戻せる。",
      codeExample:
        "# 1. コンフリクトファイル特定\ngit status\n# both modified: app/models/user.rb\n\n# 2. ファイルを開いて <<<<<<< ======= >>>>>>> を編集\nvim app/models/user.rb\n\n# 3. 解決の合図\ngit add app/models/user.rb\n\n# 4. コミット (merge) or 続行 (rebase)\ngit commit                       # merge の場合\ngit rebase --continue            # rebase の場合\n\n# やめる場合\ngit merge --abort\ngit rebase --abort\n\n# 便利: 差分ビュアー\ngit mergetool",
    },
  },
  {
    id: "git-006",
    categoryId: "git-github",
    difficulty: "intermediate",
    type: "choice",
    question:
      "GitHub CLI (gh) でカレントブランチから main 向けにプルリクエストを作成するコマンドは？",
    choices: [
      "gh push pr main",
      "gh request main",
      "gh branch --pr main",
      "gh pr create --base main",
    ],
    answerIndex: 3,
    hints: [
      "PR 操作はすべて `gh pr xxx` のサブコマンドにまとまっています。",
      "create / view / list / merge / close 等がよく使われます。",
      "対象ブランチを指定するのは `--base` オプション。",
    ],
    explanation: {
      summary:
        "`gh pr create --base main` でブラウザを開かずに PR 作成。",
      reason:
        "gh CLI は GitHub 公式 CLI。`gh pr create` で対話的に PR 作成、`--title` `--body` `--draft` `--base` `--reviewer` 等のオプション。`gh pr view` `gh pr checkout` `gh pr merge` も頻出。Claude Code のような AI ツールも gh CLI 経由で PR 操作することが多い。",
      codeExample:
        '# 対話的に作成\ngh pr create\n\n# 一発で作る\ngh pr create --base main --title "Add user signup" \\\n             --body "## Summary..." --reviewer alice,bob\n\n# 下書き作成\ngh pr create --draft\n\n# PR を見る/操作\ngh pr view 42                 # ブラウザで開かず確認\ngh pr view 42 --web           # ブラウザで開く\ngh pr checkout 42             # 同僚の PR をチェックアウト\ngh pr review --approve\ngh pr merge 42 --squash',
    },
  },
  {
    id: "git-007",
    categoryId: "git-github",
    difficulty: "intermediate",
    type: "choice",
    question:
      "誤って push した直前のコミットを巻き戻したいが、すでに他人が pull している可能性が高い。最も安全な対応は？",
    choices: [
      "リポジトリを削除して作り直す",
      "リモートの履歴を編集する",
      "git revert <SHA> で打ち消しコミットを追加して push",
      "git reset --hard HEAD~1 して force push",
    ],
    answerIndex: 2,
    hints: [
      "履歴を書き換えると、他人の手元が壊れる可能性があります。",
      "履歴を残しつつ『打ち消す』新コミットを追加する方法が安全。",
      "diff の反転コミットを自動で作るコマンドを使います。",
    ],
    explanation: {
      summary:
        "共有ブランチでは `git revert` (打ち消しコミット) が安全。`reset --hard` + force push は他人を壊す可能性。",
      reason:
        "revert は新しいコミットで変更を打ち消すので履歴改変なし。reset --hard は履歴を書き換えるので、他人がすでに pull していたら force push で大混乱。個人 feature ブランチで自分しか触っていないなら reset でも OK。",
      codeExample:
        "# 安全な打ち消し\ngit revert <SHA>                   # 単発\ngit revert <SHA1>..<SHA2>          # 範囲\ngit revert --no-commit <SHA1> <SHA2>  # まとめて 1 コミットに\n\n# 個人ブランチでだけ使える reset\ngit reset --hard HEAD~1\ngit push --force-with-lease       # team 規約で OK な場合のみ",
    },
  },
  {
    id: "git-008",
    categoryId: "git-github",
    difficulty: "advanced",
    type: "text",
    question:
      "Git のコミット履歴で特定の文字列が含まれた変更を grep する強力なオプションは `git log ?xxxx`。? に入る 1 文字オプションは？(大文字)",
    answers: ["-S", "S"],
    hints: [
      "Pickaxe (つるはし) と呼ばれる検索機能です。",
      "S オプションはコードの『追加/削除回数の変化』で検索。",
      "G オプションは正規表現マッチで広めに検索。",
    ],
    explanation: {
      summary:
        "`git log -S 'token'` (pickaxe) で『そのトークンの出現回数が変わったコミット』を抽出。",
      reason:
        "コードの『いつこの関数が消えた？』『この変数はどこで導入された？』を探すのに強力。`-S` はカウント変化、`-G` は正規表現マッチ。`--source` でブランチ情報、`-p` で diff も同時表示。",
      codeExample:
        '# あるメソッド名が追加/削除されたコミット\ngit log -S "def calculate_tax"\n\n# 正規表現で広めに\ngit log -G "TODO.*urgent"\n\n# diff も一緒に表示\ngit log -p -S "deprecated_method"\n\n# ファイル単位で\ngit log -S "secret_key" -- config/\n\n# 一括 blame (line ごとに誰が書いたか)\ngit blame app/models/user.rb',
    },
  },

  // ===========================================================================
  // 🛡️ セキュリティ (OWASP) (7問)
  // ===========================================================================
  {
    id: "sec-001",
    categoryId: "security",
    difficulty: "beginner",
    type: "choice",
    question:
      "Rails で『フォームから送られたデータをそのままモデルに渡すと、攻撃者が `is_admin` のような余分な属性を仕込めてしまう』脆弱性の名称は？",
    choices: [
      "Mass Assignment",
      "SQL Injection",
      "XSS",
      "CSRF",
    ],
    answerIndex: 0,
    hints: [
      "Rails 4 で `attr_accessible` から Strong Parameters に置き換わった背景の脆弱性です。",
      "意図しない属性を一括代入される攻撃手法。",
      "GitHub も 2012 年にこれに引っかかった有名事件があります。",
    ],
    explanation: {
      summary:
        "Mass Assignment 脆弱性: 許可してない属性 (is_admin 等) を一括代入される攻撃。Strong Parameters で防ぐ。",
      reason:
        "Rails 4 から `params.require(:user).permit(:name, :email)` の形が必須化。permit していない属性は無視される。`permit!` (全許可) は厳禁。属性追加時は permit list の更新を忘れがちで、新機能が動かない原因にもなるので気を付ける。",
      codeExample:
        "# 危険\nUser.create(params[:user])\n# → params[:user][:is_admin] = true を送られると admin 化\n\n# 安全 (Strong Parameters)\ndef user_params\n  params.require(:user).permit(:name, :email)\nend\nUser.create(user_params)",
    },
  },
  {
    id: "sec-002",
    categoryId: "security",
    difficulty: "beginner",
    type: "choice",
    question:
      "次のうち、SQL Injection の危険があるコードは？",
    choices: [
      "User.find_by(name: params[:name])",
      "User.where('name = ?', params[:name])",
      'User.where("name = \'#{params[:name]}\'")',
      "User.where(name: params[:name])",
    ],
    answerIndex: 2,
    hints: [
      "文字列に直接 params を埋め込んでしまっているのが危険。",
      "プレースホルダ (?) や Hash 形式なら安全。",
      "ユーザーが `'; DROP TABLE users;--` を送ってくる可能性を想像してみましょう。",
    ],
    explanation: {
      summary:
        "文字列に params を直接埋め込むのは SQL Injection の典型パターン。",
      reason:
        "`?` プレースホルダや Hash 形式は ActiveRecord が自動エスケープする。`#{}` 文字列補間は完全に Raw SQL を組み立てるので、ユーザー入力が混じった瞬間アウト。同様に `order(params[:sort])` も危険 (カラム名インジェクション)。",
      codeExample:
        '# ❌ 危険\nUser.where("name = \'#{params[:name]}\'")\nUser.where("name = #{params[:name]}")\n\n# ✅ 安全\nUser.where("name = ?", params[:name])\nUser.where("name = :n", n: params[:name])\nUser.where(name: params[:name])\n\n# order でも注意 (カラム名 injection)\nUser.order(params[:sort])              # 危険\nUser.order(name: :desc)                # 安全\nUser.order(User.sanitize_sql_for_order(params[:sort]))  # 検証込み',
    },
  },
  {
    id: "sec-003",
    categoryId: "security",
    difficulty: "intermediate",
    type: "choice",
    question:
      "Rails で CSRF 対策が標準で組み込まれている仕組みは？",
    choices: [
      "GET だけ受け付ける",
      "ApplicationController で protect_from_forgery (現在は CSRF トークンを form に自動挿入)",
      "全 POST を拒否する",
      "Cookie を使わない",
    ],
    answerIndex: 1,
    hints: [
      "form_with などのフォームヘルパが自動でトークンを埋め込みます。",
      "サーバ側は protect_from_forgery が標準で有効化されています。",
      "Rails 7 のデフォルトは null_session 戦略でセッションをクリアして弾く。",
    ],
    explanation: {
      summary:
        "Rails は form_with が自動で CSRF トークンを埋め込み、サーバ側で protect_from_forgery がチェック。",
      reason:
        "CSRF (Cross-Site Request Forgery) は『ログイン中のユーザーを悪用して別サイトから勝手に POST/PUT/DELETE を送る』攻撃。Rails は authenticity_token を hidden で埋め込み、session に保存したトークンと照合。API モード (ActionController::API) では本物のセッションが無いので、別途 JWT 等で対応。",
      codeExample:
        '# ApplicationController (デフォルト有効)\nclass ApplicationController < ActionController::Base\n  protect_from_forgery with: :exception\n  # Rails 5+ デフォルトは :exception\n  # API なら ActionController::API でそもそも不要\nend\n\n# form_with は自動でトークン埋め込み\n# <input type="hidden" name="authenticity_token" value="...">\n\n# JSON API でフロントが Rails 内蔵じゃない場合\n# X-CSRF-Token ヘッダで送る or skip_before_action :verify_authenticity_token',
    },
  },
  {
    id: "sec-004",
    categoryId: "security",
    difficulty: "intermediate",
    type: "choice",
    question:
      "ERB テンプレートで `<%= user_input %>` と書いたとき、XSS は自動で防がれる？",
    choices: [
      "防がれない",
      "ブラウザが防ぐ",
      "Rails では XSS は発生しない",
      "防がれる (HTML エスケープが自動)",
    ],
    answerIndex: 3,
    hints: [
      "Rails 3 以降は標準で出力エスケープ。",
      "raw / html_safe を明示的に呼ばない限り安全側。",
      "ただし html_safe を不用意に使うとアウトです。",
    ],
    explanation: {
      summary:
        "Rails 3+ は `<%= %>` で自動 HTML エスケープ。raw / html_safe を呼ぶと無効化される。",
      reason:
        "`<%= %>` は `ActiveSupport::SafeBuffer` で囲まれた文字列以外を自動エスケープ。`raw(str)` / `str.html_safe` / `<%== %>` (rare) は明示的にエスケープを切る。ユーザー入力に html_safe するのは絶対 NG。安全な HTML フラグメントを作るなら `content_tag` `tag.div` を使う。",
      codeExample:
        "# 安全\n<%= @user.name %>                       # 自動エスケープ\n<%= content_tag(:p, @user.bio) %>       # 安全\n<%= link_to @user.name, user_path(@user) %>\n\n# 危険\n<%= @user.bio.html_safe %>              # ユーザー入力をHTML扱い\n<%= raw @user.bio %>                    # 同上\n<%== @user.bio %>                       # 同上\n\n# サニタイズ (許可タグだけ通す)\n<%= sanitize @user.bio, tags: %w[p br b] %>",
    },
  },
  {
    id: "sec-005",
    categoryId: "security",
    difficulty: "intermediate",
    type: "text",
    question:
      "Rails 5.2+ で API キー等の秘密情報を暗号化して保存する仕組みのファイル名は `config/credentials.yml.???`。??? に入る拡張子は？",
    answers: ["enc"],
    hints: [
      "暗号化済みファイルを示す拡張子です。",
      "復号には config/master.key が必要。",
      "encrypted の略です。",
    ],
    explanation: {
      summary:
        "`config/credentials.yml.enc` (encrypted) を `master.key` で復号して使う。",
      reason:
        "git にコミットしても安全 (暗号化されているので)。master.key は .gitignore 必須、本番では RAILS_MASTER_KEY 環境変数で渡す。環境別 (`credentials/production.yml.enc`) も可能。",
      codeExample:
        "# 編集 (一時的に復号して $EDITOR で開く)\nEDITOR=vim rails credentials:edit\nEDITOR=vim rails credentials:edit --environment production\n\n# 参照\nRails.application.credentials.stripe[:secret_key]\nRails.application.credentials.dig(:aws, :access_key_id)\n\n# 本番デプロイ時\nRAILS_MASTER_KEY=xxx puma -e production\n\n# .gitignore に master.key を必ず追加",
    },
  },
  {
    id: "sec-006",
    categoryId: "security",
    difficulty: "advanced",
    type: "choice",
    question:
      "パスワードを DB に保存する正しいやり方は？",
    choices: [
      "MD5 でハッシュ化して保存する",
      "bcrypt 等のソルト付き遅いハッシュでハッシュ化して保存 (Rails なら has_secure_password)",
      "Base64 で保存する",
      "平文で保存する",
    ],
    answerIndex: 1,
    hints: [
      "平文 / 簡単なハッシュは流出時に総当たり攻撃で即解読されます。",
      "MD5 / SHA1 は速すぎるのでパスワードには不適。",
      "bcrypt は意図的に遅く設計されているのが特徴です。",
    ],
    explanation: {
      summary:
        "bcrypt + salt がパスワード保存の業界標準。Rails では has_secure_password で簡単に使える。",
      reason:
        "MD5/SHA は速すぎて GPU で総当たり可能。bcrypt は work factor (cost) でハッシュ計算を意図的に遅くする (現在の推奨は cost=12 程度)。salt が自動で各レコードに付くので、レインボーテーブル攻撃にも耐性。Rails の `has_secure_password` は bcrypt gem のラッパー。",
      codeExample:
        "# Gemfile\ngem 'bcrypt'\n\n# migration\nadd_column :users, :password_digest, :string\n\n# model\nclass User < ApplicationRecord\n  has_secure_password\n  # password と password_confirmation accessor が生える\n  # password_digest に bcrypt ハッシュが入る\nend\n\n# 使い方\nuser = User.new(password: 'secret', password_confirmation: 'secret')\nuser.save\nuser.authenticate('secret')      #=> user\nuser.authenticate('wrong')       #=> false\n\n# 注意: password_digest は logs に出さない (filter_parameters)",
    },
  },
  {
    id: "sec-007",
    categoryId: "security",
    difficulty: "advanced",
    type: "choice",
    question:
      "OWASP Top 10 (2021) で最新の最上位カテゴリ (A01) はどれ？",
    choices: [
      "CSRF",
      "Broken Access Control (壊れたアクセス制御)",
      "Injection",
      "XSS",
    ],
    answerIndex: 1,
    hints: [
      "ユーザーが本来アクセスできないリソースを取得・操作できてしまう問題。",
      "Rails では Pundit/CanCanCan で防ぐ層に当たります。",
      "管理者画面のURL直叩きなどで普通のユーザーが操作できる、というよくあるバグ。",
    ],
    explanation: {
      summary:
        "OWASP Top 10 (2021) の 1 位は Broken Access Control。Injection は 3 位に後退。",
      reason:
        "アクセス制御の不備が最も頻出。Rails では (1) before_action で認証 (authenticate_user!)、(2) Pundit / CanCanCan で認可ポリシー、(3) Strong Params で属性を限定、の三段構え。401 (認証失敗) と 403 (認可失敗) を区別する。",
      codeExample:
        "# Pundit の例\n# app/policies/post_policy.rb\nclass PostPolicy < ApplicationPolicy\n  def update?\n    user == record.user || user.admin?\n  end\nend\n\n# Controller\nclass PostsController < ApplicationController\n  before_action :authenticate_user!\n  def update\n    @post = Post.find(params[:id])\n    authorize @post                  # update? を呼ぶ\n    @post.update(post_params)\n  end\nend",
    },
  },

  // ===========================================================================
  // 🔬 デバッグ & パフォーマンス (7問)
  // ===========================================================================
  {
    id: "dbg-001",
    categoryId: "debugging",
    difficulty: "beginner",
    type: "choice",
    question:
      "Ruby/Rails で『コードの途中で実行を止めて対話的に変数を確認したい』時のデファクト gem は？",
    choices: ["rails-trace", "ruby-stop", "pry-rails / debug", "console.log"],
    answerIndex: 2,
    hints: [
      "Ruby 3.1+ から `debug` gem が標準同梱。",
      "古くは byebug、もう少し前は pry-byebug。",
      "ブレークポイントとして `binding.break` または `binding.pry` を書きます。",
    ],
    explanation: {
      summary:
        "Ruby 3.1+ は標準で debug gem を同梱。`binding.break` (または `binding.b`) で停止。古いコードベースは pry-byebug を使う。",
      reason:
        "コードに `binding.break` を置くとそこで対話プロンプトが立つ。変数を見たり (`step`/`next`/`continue`) ステップ実行できる。本番では絶対残さない (PR チェックで弾く)。",
      codeExample:
        "# Ruby 3.1+\nrequire 'debug'\ndef calculate\n  user = User.find(1)\n  binding.break    # ここで停止\n  user.update(...)\nend\n# (rdbg) p user\n# (rdbg) step\n# (rdbg) continue\n\n# pry-byebug (古いプロジェクト)\nrequire 'pry'\nbinding.pry\n\n# VSCode / Cursor / RubyMine ならブレークポイントで GUI から",
    },
  },
  {
    id: "dbg-002",
    categoryId: "debugging",
    difficulty: "beginner",
    type: "text",
    question:
      "Rails コンソールを起動するコマンドは？(短い形式、空白を含めて答えてOK)",
    answers: ["rails c", "rails console", "bin/rails console", "bin/rails c"],
    hints: [
      "Rails アプリ全体をロードした対話シェルです。",
      "短縮形 と フルネーム の両方が使えます。",
      "本番に繋ぐ時は `--sandbox` が安全。",
    ],
    explanation: {
      summary:
        "`rails c` (= `rails console`) で対話的に Rails 環境にアクセス。",
      reason:
        "DB レコードを確認・修正、サービスを試し撃ち、メソッドの挙動を試す、などに使う。`--sandbox` で終了時に全変更ロールバック。本番接続は事故の元なので、`-e production` 指定時は復唱して確認する習慣を。",
      codeExample:
        "rails c                       # development\nrails c --sandbox             # 変更が全ロールバック (安全モード)\nrails c -e production         # 本番 (要承認)\nRAILS_ENV=staging rails c\n\n# よく使う\nUser.last\nUser.where(active: true).count\nReload!   # コード変更を反映\nexit",
    },
  },
  {
    id: "dbg-003",
    categoryId: "debugging",
    difficulty: "intermediate",
    type: "choice",
    question:
      "Rails 開発中、N+1 クエリを自動検出して警告する定番 gem は？",
    choices: ["bullet", "rack-mini-profiler", "ahoy", "rambo"],
    answerIndex: 0,
    hints: [
      "development.rb に設定を書くと、検出時にブラウザに通知が出ます。",
      "Slack 通知や log 出力も対応。",
      "名前が動物 (闘牛) のような単語。",
    ],
    explanation: {
      summary:
        "bullet gem は N+1 とeager loading 不足を開発時に警告。",
      reason:
        "development.rb で `Bullet.enable = true` 等を設定。検出時にブラウザにアラート、コンソールに WARN、Slack 通知も可能。CI には組み込まず、開発時に拾うのが基本。本番のパフォーマンス監視は New Relic / Skylight / Scout などの APM。",
      codeExample:
        "# Gemfile\ngroup :development do\n  gem 'bullet'\nend\n\n# config/environments/development.rb\nconfig.after_initialize do\n  Bullet.enable        = true\n  Bullet.alert         = true   # ブラウザポップアップ\n  Bullet.bullet_logger = true   # log/bullet.log\n  Bullet.console       = true   # console.log\n  Bullet.add_footer    = true   # ブラウザ右下に表示\nend",
    },
  },
  {
    id: "dbg-004",
    categoryId: "debugging",
    difficulty: "intermediate",
    type: "choice",
    question:
      "SQL の遅さを調査するときに最初に使うコマンド句は？",
    choices: [
      "EXPLAIN <SQL>",
      "DESCRIBE <SQL>",
      "ANALYZE <SQL>",
      "WHY <SQL>",
    ],
    answerIndex: 0,
    hints: [
      "クエリプランナーが選んだ実行計画を表示します。",
      "PostgreSQL/MySQL/SQLite で共通の構文 (詳細は実装毎)。",
      "Rails では `Model.where(...).explain` で呼べます。",
    ],
    explanation: {
      summary:
        "`EXPLAIN <SQL>` で実行計画を表示。Rails では `relation.explain` でも見られる。",
      reason:
        "PostgreSQL なら `EXPLAIN ANALYZE` で実測時間込み。Seq Scan が出てたら index 不足、Nested Loop が深いなら JOIN 戦略を疑う。`EXPLAIN (ANALYZE, BUFFERS)` でキャッシュヒット率も。Rails の `relation.explain` は便利だが、結合や条件次第で本番 DB と差異が出ることもある。",
      codeExample:
        "# psql\nEXPLAIN SELECT * FROM users WHERE email = 'a@x';\nEXPLAIN ANALYZE SELECT * FROM users WHERE email = 'a@x';\n\n# Rails console\nUser.where(email: 'a@x').explain\n#=> EXPLAIN for: SELECT \"users\".* FROM \"users\" WHERE \"users\".\"email\" = $1\n#   Seq Scan on users  (cost=0.00.....)\n\n# インデックス追加\nadd_index :users, :email, unique: true",
    },
  },
  {
    id: "dbg-005",
    categoryId: "debugging",
    difficulty: "intermediate",
    type: "choice",
    question:
      "Rails で『どの SQL がどれだけ時間を使っているか』を画面上で可視化する開発用 gem は？",
    choices: [
      "factory_bot",
      "rack-mini-profiler",
      "byebug",
      "rspec",
    ],
    answerIndex: 1,
    hints: [
      "画面左上に小さなバッジが出て、クリックで詳細表示。",
      "SQL 実行時間 / レンダリング時間 / メモリ等を表示。",
      "本番でも限定的に有効化可能 (権限制御込み)。",
    ],
    explanation: {
      summary:
        "rack-mini-profiler はページ表示時間と SQL 別時間を画面に表示する開発用 gem。",
      reason:
        "ページの左上にバッジが出て、クリックで SQL 一覧・所要時間が見える。bullet と組み合わせると N+1 検出 + 時間プロファイリングが揃う。本番でも開発者だけ表示する設定が可能 (config/initializers/rack_profiler.rb)。",
      codeExample:
        "# Gemfile\ngem 'rack-mini-profiler'\ngem 'memory_profiler'         # メモリ統計を見るなら追加\ngem 'flamegraph'              # フレームグラフ生成\ngem 'stackprof'               # CPU プロファイル\n\n# 本番で特定ユーザーだけに表示\nRack::MiniProfiler.config.authorization_mode = :allow_authorized\n# その後 controller で\nRack::MiniProfiler.authorize_request if current_user&.admin?",
    },
  },
  {
    id: "dbg-006",
    categoryId: "debugging",
    difficulty: "advanced",
    type: "choice",
    question:
      "本番で『特定のリクエストが遅い』時の調査の進め方として最適なのは？",
    choices: [
      "アプリを再起動して様子見",
      "全リクエストにログを大量出力",
      "APM (New Relic 等) の Slow Transaction を確認 → 詳細 trace で SQL/外部 API を特定 → 再現環境で検証",
      "本番でブレークポイントを入れる",
    ],
    answerIndex: 2,
    hints: [
      "本番にデバッガを入れるのは禁忌。",
      "APM (Application Performance Monitoring) が現代の調査入口。",
      "事実 → 仮説 → 検証 を踏む流れがプロです。",
    ],
    explanation: {
      summary:
        "APM のスロークエリ/トランザクションを確認 → 詳細トレースで原因特定 → ステージングで再現が定石。",
      reason:
        "APM (New Relic / Skylight / Datadog / Scout) は本番のリクエスト毎の所要時間・SQL/外部API/メモリを記録。スロートランザクションをクリックすると詳細トレースが見られる。アプリログだけだと粒度が荒いので APM 必須。Sentry / Bugsnag はエラー監視で APM とは別物。",
      codeExample:
        "# 典型ステップ\n1. APM で『過去 1 時間で平均が遅いエンドポイント』を特定\n2. 個別 trace を開いて何で時間使ってるか確認 (SQL/API/Ruby)\n3. SQL なら EXPLAIN ANALYZE で実行計画確認\n4. ステージングでクエリを再現\n5. インデックス追加 / クエリ書き直し / キャッシュ追加\n6. デプロイ後に APM で改善確認\n\n# Skylight の例 (Gemfile)\ngem 'skylight'",
    },
  },
  {
    id: "dbg-007",
    categoryId: "debugging",
    difficulty: "advanced",
    type: "choice",
    question:
      "Ruby のメモリリークを調査する gem として最も適切なのは？",
    choices: ["memory_profiler / derailed_benchmarks", "rspec", "rails-erd", "ahoy"],
    answerIndex: 0,
    hints: [
      "オブジェクト生成 / 解放を観察する gem 群。",
      "Heroku のチームが作った derailed_benchmarks も有名。",
      "両者を組み合わせると、リクエスト毎のメモリ増加が分かる。",
    ],
    explanation: {
      summary:
        "memory_profiler や derailed_benchmarks でメモリ使用量を測定し、リクエスト後に解放されないオブジェクトを特定する。",
      reason:
        "Ruby はガベージコレクションを持つが、グローバル変数や class 変数、Thread.current 等への参照を残すとリークする。derailed_benchmarks は Rails アプリの起動時メモリ / リクエスト毎メモリを計測。memory_profiler は任意ブロックのオブジェクト生成を可視化。本番では `ObjectSpace.count_objects` や `GC.stat` も使う。",
      codeExample:
        "# Gemfile\ngem 'memory_profiler'\ngem 'derailed_benchmarks'\n\n# 計測\nrequire 'memory_profiler'\nreport = MemoryProfiler.report do\n  do_something_heavy\nend\nreport.pretty_print(to_file: 'profile.txt')\n\n# Rails アプリ全体のメモリ計測\nbundle exec derailed bundle:mem\nbundle exec derailed exec perf:mem_over_time\n\n# GC統計\nGC.stat\n#=> {count: ..., heap_allocated_pages: ...}",
    },
  },

  // ===========================================================================
  // 🐧 Linux & CLI (8問)
  // ===========================================================================
  {
    id: "cli-001",
    categoryId: "linux-cli",
    difficulty: "beginner",
    type: "choice",
    question:
      "カレントディレクトリ配下から拡張子 .rb のファイルを再帰的に検索するコマンドは？",
    choices: [
      "find . -name '*.rb'",
      "grep .rb",
      "ls -R *.rb",
      "search .rb",
    ],
    answerIndex: 0,
    hints: [
      "find はファイル名 / 属性で検索、grep はファイル内容を検索。",
      "再帰的に下り、パターンマッチでファイル名を検索するのが find です。",
      "クオートしないとシェルが先に展開してエラーになります。",
    ],
    explanation: {
      summary:
        "`find . -name '*.rb'` でカレント配下を再帰的に検索。",
      reason:
        "find は『ファイル名・サイズ・更新日時など属性で探す』ツール。grep は『ファイルの中身で探す』ツール。組み合わせは `find . -name '*.rb' -exec grep -l 'TODO' {} \\;` のようにできるが、`grep -r 'TODO' --include='*.rb' .` の方が短く速い。",
      codeExample:
        "# find: 名前で検索\nfind . -name '*.rb'\nfind . -name 'user*' -type f       # ファイルのみ\nfind . -name '*.log' -mtime +7     # 7日以上前\nfind . -name '*.tmp' -delete       # 検索 + 削除 (危険、要 dry-run)\nfind . -size +10M                  # 10MB 超\n\n# grep: 内容で検索\ngrep -r 'TODO' .                   # 再帰\ngrep -rn 'TODO' --include='*.rb' . # 行番号 + 拡張子フィルタ\ngrep -l 'TODO' file*.rb            # 一致したファイル名のみ\nrg 'TODO'                          # ripgrep (高速、推奨)",
    },
  },
  {
    id: "cli-002",
    categoryId: "linux-cli",
    difficulty: "beginner",
    type: "text",
    question:
      "実行中プロセスの一覧を見るコマンド (BSD オプション付き、よく使う組合せ) は `ps ???`。??? に入る短い組合せは？(3 文字以内)",
    answers: ["aux", "-ef", "ef"],
    hints: [
      "BSD スタイルなら 3 文字、System V スタイルなら 2-3 文字。",
      "BSD は a (全ユーザー) + u (詳細) + x (端末なし含む)。",
      "実務でよく使うのは BSD 形式の組合せ。",
    ],
    explanation: {
      summary:
        "`ps aux` (BSD) または `ps -ef` (Sys V) が業界標準のフル一覧。",
      reason:
        "`ps aux` で『全ユーザー (a) + 詳細表示 (u) + 端末なしも含む (x)』。`ps aux | grep ruby` が定番。`top` / `htop` で対話的に監視、`pgrep` で名前検索、`pkill` でシグナル送信。",
      codeExample:
        "ps aux                       # 全プロセス\nps aux | grep ruby          # ruby プロセス絞り込み\nps -ef --forest             # ツリー表示 (親子関係)\npgrep -fl puma              # puma を含むプロセスを名前で\n\n# 強制終了\nkill <PID>                  # SIGTERM (お願い)\nkill -9 <PID>               # SIGKILL (強制)\npkill -f sidekiq            # 名前で\n\n# CPU/メモリ監視\ntop                         # 標準\nhtop                        # 対話的、視覚的 (要インストール)",
    },
  },
  {
    id: "cli-003",
    categoryId: "linux-cli",
    difficulty: "beginner",
    type: "choice",
    question:
      "ファイル `app.log` を 1 ページずつ読みながら検索する標準的なコマンドは？",
    choices: ["echo app.log", "ls app.log", "ps app.log", "less app.log"],
    answerIndex: 3,
    hints: [
      "ページャ (pager) と呼ばれます。",
      "矢印キーで移動、/word で検索、F で follow モード。",
      "more の上位互換的なツール。",
    ],
    explanation: {
      summary:
        "`less` は対話的にファイルを閲覧できる標準ページャ。",
      reason:
        "操作: 矢印キー / PageUp/Down で移動、`/word` 前方検索、`?word` 後方検索、`n`/`N` 次/前の一致、`G` 末尾、`g` 先頭、`F` follow モード (Ctrl-C で抜ける)、`q` 終了。圧縮済みファイルは `zless`。",
      codeExample:
        "less app.log\nless +F app.log        # follow モードで起動 (= tail -f)\nless -N app.log        # 行番号表示\nless -S app.log        # 折り返さない (横スクロール)\nzless app.log.gz       # gzip 圧縮も読める\n\n# パイプにも使える\nps aux | less\njournalctl -u puma | less +F",
    },
  },
  {
    id: "cli-004",
    categoryId: "linux-cli",
    difficulty: "intermediate",
    type: "choice",
    question:
      "ディスク使用量を人間に読める形式で見るコマンドは？",
    choices: [
      "du -sh /var/log/*",
      "ls -size /var/log/*",
      "find /var/log -big",
      "ps -mem /var/log",
    ],
    answerIndex: 0,
    hints: [
      "du = disk usage の略。",
      "-h は人間が読みやすい形式 (K/M/G)。",
      "-s で各引数のサマリだけ表示。",
    ],
    explanation: {
      summary:
        "`du -sh path/*` で各パスのサイズを人間に読める形式で表示。",
      reason:
        "`du` はディレクトリ毎の使用量、`df` はパーティション毎の使用量。`-h` (human readable)、`-s` (summary)、`--max-depth=N` で深さ制限。本番で『どこが容量を食ってるか』調査の定番。",
      codeExample:
        "du -sh /var/log/*              # 直下の各ディレクトリのサイズ\ndu -sh ./* | sort -h           # ソート\ndu -h --max-depth=2 /var | sort -hr | head\n\n# パーティション\ndf -h                          # 全パーティション\ndf -h .                        # カレントのみ\n\n# 大きいファイル探す\nfind / -type f -size +100M 2>/dev/null | xargs ls -lh\n\n# 古いログ削除 (要確認)\nfind /var/log -name '*.log.*' -mtime +30 -delete",
    },
  },
  {
    id: "cli-005",
    categoryId: "linux-cli",
    difficulty: "intermediate",
    type: "choice",
    question:
      "リモートサーバに SSH 鍵で接続する基本コマンドは？",
    choices: [
      "ssh-connect user@host key",
      "telnet user@host",
      "ssh -i ~/.ssh/id_ed25519 user@host",
      "ssh password://user@host",
    ],
    answerIndex: 2,
    hints: [
      "-i で鍵ファイルを指定 (省略可、デフォルト鍵がある場合)。",
      "id_rsa は古め、id_ed25519 が現代の推奨。",
      "telnet は暗号化されないので NG。",
    ],
    explanation: {
      summary:
        "`ssh -i ~/.ssh/秘密鍵 user@host` で鍵認証 SSH 接続。`~/.ssh/config` で短縮可。",
      reason:
        "鍵生成は `ssh-keygen -t ed25519`。公開鍵 (.pub) をサーバの `~/.ssh/authorized_keys` に追加。`~/.ssh/config` に Host エイリアスを書くと `ssh prod` のように短縮できる。Forward (port forwarding) `ssh -L 5432:localhost:5432 prod` で DB トンネリングも可。",
      codeExample:
        "# 鍵生成\nssh-keygen -t ed25519 -C 'me@example.com'\n\n# 接続\nssh user@host\nssh -i ~/.ssh/specific_key user@host\nssh -p 2222 user@host        # 非標準ポート\n\n# ~/.ssh/config (推奨)\nHost prod\n    HostName 1.2.3.4\n    User deploy\n    IdentityFile ~/.ssh/prod_key\n    Port 2222\n# → ssh prod で接続可\n\n# ポートフォワード (本番 DB に手元から)\nssh -L 5432:localhost:5432 prod",
    },
  },
  {
    id: "cli-006",
    categoryId: "linux-cli",
    difficulty: "intermediate",
    type: "choice",
    question:
      "ファイルに対する権限の意味として正しいのは？",
    code: "$ ls -l\n-rw-r--r-- 1 alice users 100 Jan 1 app.rb",
    choices: [
      "実行のみ可能",
      "所有者: 読み書き / グループ: 読み / その他: 読み",
      "全員が読み書き可能",
      "誰も読めない",
    ],
    answerIndex: 1,
    hints: [
      "9 文字を 3 文字ずつに分解: 所有者 / グループ / その他。",
      "r=4, w=2, x=1 の合計が chmod の数字表現。",
      "rw-r--r-- は 644。",
    ],
    explanation: {
      summary:
        "rw-r--r-- は 644: 所有者 rw、グループ・その他 r のみ。",
      reason:
        "ls -l の左 10 文字: 1 文字目はタイプ (- ファイル / d ディレクトリ / l シンボリックリンク)、残り 9 文字を 3 つに分けて owner/group/other の rwx。数字表現は r=4 w=2 x=1。chmod で変更、chown で所有者変更。",
      codeExample:
        "# 権限変更\nchmod 644 app.rb              # rw-r--r--\nchmod 755 script.sh           # rwxr-xr-x\nchmod +x script.sh            # 実行権限を全員に\nchmod u+w,g-w file            # owner に w 追加、group から w 削除\n\n# 所有者変更\nchown deploy:deploy file\nchown -R deploy:deploy /app   # 再帰\n\n# よく見る組合せ\n# 644: 一般ファイル (rw-r--r--)\n# 755: 実行ファイル/ディレクトリ\n# 600: 鍵ファイル (rw-------)  ← SSH 鍵は必須\n# 700: 個人ディレクトリ",
    },
  },
  {
    id: "cli-007",
    categoryId: "linux-cli",
    difficulty: "intermediate",
    type: "choice",
    question:
      "標準出力をファイルに保存しつつ画面にも表示するコマンドは？",
    choices: [
      "command | tee output.log",
      "command >> output.log",
      "command < output.log",
      "command 2> output.log",
    ],
    answerIndex: 0,
    hints: [
      "T 字に分岐させるイメージのコマンド。",
      "ファイルに書きつつ次のコマンドにも流せる。",
      "ログを残しながら手元でも見たい時の定番。",
    ],
    explanation: {
      summary:
        "`tee` は標準入力を 1) ファイルに書き出し、2) 標準出力にも流す T 字パイプ。",
      reason:
        "`> file` (上書き) / `>> file` (追記) はファイルだけ。`| tee file` は同時に画面にも表示。`tee -a` で追記モード。`2>&1` で stderr も stdout に統合してから tee すれば全部キャプチャ。",
      codeExample:
        "# 実行ログをファイル + 画面\nrails db:migrate | tee migrate.log\n\n# 追記モード\nrun-script | tee -a run.log\n\n# stderr もまとめてキャプチャ\nbundle exec rspec 2>&1 | tee rspec.log\n\n# パイプの途中で記録\ngrep ERROR log/production.log | tee errors.log | wc -l\n# → errors.log にも保存しつつ件数表示",
    },
  },
  {
    id: "cli-008",
    categoryId: "linux-cli",
    difficulty: "advanced",
    type: "choice",
    question:
      "コマンドの出力 (例: 全ファイル名) を、別コマンドの引数として渡したい時に使うコマンドは？",
    choices: ["transfer", "xargs", "pipe", "redirect"],
    answerIndex: 1,
    hints: [
      "標準入力を空白区切りで分解して、別コマンドの引数にする。",
      "find ... | xargs rm のような形が典型。",
      "並列実行 (-P) もできる。",
    ],
    explanation: {
      summary:
        "`xargs` は標準入力を別コマンドの引数化する。`find ... | xargs cmd` が定番。",
      reason:
        "`echo a b c | rm` は動かないが、`echo a b c | xargs rm` は `rm a b c` 相当になる。`-I {}` でプレースホルダ指定、`-n N` で N 引数ずつ実行、`-P N` で N 並列、`-0` で NULL 区切り (find -print0 と組合せて空白を含むファイル名を安全に扱う)。",
      codeExample:
        "# 検索結果に対して別コマンド実行\nfind . -name '*.tmp' | xargs rm\nfind . -name '*.tmp' -print0 | xargs -0 rm  # ファイル名に空白OK\n\n# 1 件ずつ別位置に挿入\nfind . -name '*.rb' | xargs -I {} cp {} backup/\n\n# 並列実行\ncat urls.txt | xargs -P 8 -I {} curl -s {} -o /dev/null -w '%{http_code} {}\\n'\n\n# 引数の数を制限 (1 回のコマンドに N 個まで)\nls *.jpg | xargs -n 1 -I {} convert {} -resize 50% small_{}",
    },
  },

  // ===========================================================================
  // 🧪 RSpec 追加 (8問: shared_examples, subject, matcher, system spec 等)
  // ===========================================================================
  {
    id: "rspec-009",
    categoryId: "rspec",
    difficulty: "intermediate",
    type: "choice",
    question:
      "RSpec で『複数の describe / context から共通のテストブロックを呼び出して再利用する』仕組みは？",
    choices: [
      "merge_describe",
      "import_specs",
      "shared_examples / it_behaves_like",
      "include_module",
    ],
    answerIndex: 2,
    hints: [
      "テストのテンプレートを定義しておき、複数箇所から名前で呼び出します。",
      "DRY (Don't Repeat Yourself) をテストにも適用するイディオム。",
      "宣言ブロックと呼び出しキーワードがペアで存在し、後者は英語の慣用句『〇〇のように振る舞う』に近い名前。",
    ],
    explanation: {
      summary:
        "`shared_examples` でテンプレ宣言、`it_behaves_like` (または `include_examples`) で呼び出す。",
      reason:
        "ロールや属性が違うだけで同じ振る舞いを期待するクラスのテストを共通化できます。`it_behaves_like` は内部で新しい context を作り、`include_examples` はその場に展開します。Pundit ポリシーや Devise の認証テストで定番。",
      codeExample:
        "RSpec.shared_examples '読み取り専用ポリシー' do\n  it { is_expected.to permit_action(:show) }\n  it { is_expected.to forbid_action(:update) }\nend\n\nRSpec.describe PostPolicy do\n  subject { described_class.new(user, post) }\n  context 'ゲストユーザー' do\n    let(:user) { build_stubbed(:guest_user) }\n    it_behaves_like '読み取り専用ポリシー'\n  end\nend",
    },
  },
  {
    id: "rspec-010",
    categoryId: "rspec",
    difficulty: "intermediate",
    type: "choice",
    question:
      "次のコードで `subject` を省略形で書き直すと？",
    code: "describe Calculator do\n  describe '#add' do\n    subject { Calculator.new.add(2, 3) }\n    it { expect(subject).to eq 5 }\n  end\nend",
    choices: [
      "it.to eq 5",
      "省略はできない",
      "it { is_expected.to eq 5 }",
      "it { subject.must_equal 5 }",
    ],
    answerIndex: 2,
    hints: [
      "subject を明示せずに it ブロックから参照する書き方があります。",
      "受動態の英語表現で『〜であると期待される』を意味する記法。",
      "be 動詞の過去分詞を含む 12 文字程度のメソッドが暗黙の subject に対する expect を作ります。",
    ],
    explanation: {
      summary:
        "`it { is_expected.to MATCHER }` は `expect(subject).to MATCHER` の糖衣構文。",
      reason:
        "subject が明示されている、または描述対象クラスから暗黙生成されるとき、`is_expected` で短く書けます。さらに `it { is_expected.to eq(5) }` のような one-liner はテストコードが仕様書のように読めて美しい。",
      codeExample:
        "describe Array do\n  # described_class は Array、subject はその new\n  it { is_expected.to be_empty }    # expect(Array.new).to be_empty\nend\n\n# subject 明示 + named subject\ndescribe User do\n  subject(:user) { build(:user) }\n  it { is_expected.to be_valid }    # 暗黙\n  it 'has admin role' do\n    user.role = 'admin'             # 名前付き subject も使える\n    expect(user.role).to eq 'admin'\n  end\nend",
    },
  },
  {
    id: "rspec-011",
    categoryId: "rspec",
    difficulty: "intermediate",
    type: "choice",
    question:
      "次の matcher のうち、ブロック内で値が変わったかを検証するのは？",
    choices: [
      "change",
      "diff",
      "mutate",
      "alter",
    ],
    answerIndex: 0,
    hints: [
      "before / after の差分を検証する matcher です。",
      "DB レコード数増加のテストでよく使われます。",
      "英語で『変化する』を意味する一般動詞そのままの 1 単語。",
    ],
    explanation: {
      summary:
        "`expect { ... }.to change(obj, :method).by(N)` でブロック実行による値の変化を検証。",
      reason:
        "ブロック実行前後の値を比較して差分を確認する RSpec の強力な matcher。`from(x).to(y)` で具体値、`by(n)` で増減量を指定可能。`change(Model, :count)` で件数変化、複数同時は `.and` で連結。",
      codeExample:
        "expect { Post.create!(...) }.to change(Post, :count).by(1)\nexpect { user.deactivate }.to change(user, :active?).from(true).to(false)\n\n# 複数の変化を 1 回で検証\nexpect { register_user }\n  .to change(User, :count).by(1)\n  .and change(Profile, :count).by(1)\n  .and have_enqueued_mail(WelcomeMailer, :greet)",
    },
  },
  {
    id: "rspec-012",
    categoryId: "rspec",
    difficulty: "intermediate",
    type: "choice",
    question:
      "次のコードが検証していることは？",
    code: "expect { fetch_user }.to raise_error(ActiveRecord::RecordNotFound, /User with id/)",
    choices: [
      "fetch_user が nil を返す",
      "fetch_user の戻り値が ActiveRecord::Base",
      "fetch_user が指定例外を、指定メッセージパターン付きで投げる",
      "fetch_user が成功する",
    ],
    answerIndex: 2,
    hints: [
      "ブロック付き expect は副作用 (例外 / 出力など) を検証します。",
      "matcher 名に raise が含まれているのが大きなヒント。",
      "第2引数の正規表現は『例外メッセージにこの文字列が含まれるか』のチェック。",
    ],
    explanation: {
      summary:
        "`raise_error(クラス, パターン)` でブロック内の例外発生・クラス・メッセージを検証。",
      reason:
        "通常の `expect(value).to` は値を渡しますが、`expect { ... }` のブロック版は副作用 (例外発生・出力・状態変化) を捕捉します。`raise_error` は例外検証、`output` は標準出力、`change` は値変化用。",
      codeExample:
        "expect { invalid_op }.to raise_error(StandardError)\nexpect { invalid_op }.to raise_error(MyError, 'specific message')\nexpect { invalid_op }.to raise_error(MyError, /partial/)\n\n# 標準出力\nexpect { puts 'hi' }.to output(\"hi\\n\").to_stdout\n\n# 状態変化\nexpect { user.deactivate }.to change(user, :active?).from(true).to(false)",
    },
  },
  {
    id: "rspec-013",
    categoryId: "rspec",
    difficulty: "intermediate",
    type: "text",
    question:
      "ActiveRecord モデルのバリデーションテストを 1 行で書ける gem として広く使われるのは？(ハイフン付き 1 語、英語)",
    answers: ["shoulda-matchers", "shoulda"],
    hints: [
      "thoughtbot 社製、Rails コミュニティで人気。",
      "`it { is_expected.to validate_presence_of(:email) }` のように書けます。",
      "英語で『すべきだ』を意味する 1 単語に -matchers を付けた名前。",
    ],
    explanation: {
      summary:
        "`shoulda-matchers` は Rails 向けの宣言的 matcher 群 (validation / association / column 等)。",
      reason:
        "AR の検証コード `validates :email, presence: true, uniqueness: true` を 2 行のテストで網羅できる。一行 spec が増えてテストファイルがスッキリ。",
      codeExample:
        "# Gemfile (test)\ngem 'shoulda-matchers'\n\nRSpec.describe User do\n  it { is_expected.to validate_presence_of(:email) }\n  it { is_expected.to validate_uniqueness_of(:email).case_insensitive }\n  it { is_expected.to have_many(:posts).dependent(:destroy) }\n  it { is_expected.to belong_to(:account) }\n  it { is_expected.to have_db_index(:email).unique }\nend",
    },
  },
  {
    id: "rspec-014",
    categoryId: "rspec",
    difficulty: "intermediate",
    type: "choice",
    question:
      "ブラウザ操作 (クリック / 入力 / 表示確認) を含む E2E テストを書く Rails 推奨の spec タイプは？",
    choices: [
      "helper spec",
      "system spec (Capybara + headless browser)",
      "model spec",
      "view spec",
    ],
    answerIndex: 1,
    hints: [
      "Rails 5.1 から組み込み、Capybara + 実ブラウザを使います。",
      "JavaScript も実行できる本物に近い E2E テスト。",
      "DB / view / JS / フォーム送信を一気に通すフルスタックなテストタイプ。",
    ],
    explanation: {
      summary:
        "system spec は Capybara + headless browser (Selenium/Cuprite 等) でブラウザ操作レベルの E2E。",
      reason:
        "Rails 5.1+ では `bin/rails generate system_test` で雛形生成。`spec/system/` 配下に配置、`type: :system` 自動付与。screenshot 自動取得、JS 実行可能。request spec より遅いがリアルなテスト。CI で安定運用するには Cuprite が人気。",
      codeExample:
        "# spec/system/post_creation_spec.rb\nRSpec.describe 'Post creation', type: :system do\n  it 'creates a post' do\n    sign_in create(:user)\n    visit new_post_path\n    fill_in 'Title', with: 'Hello'\n    fill_in 'Body',  with: 'World'\n    click_button '投稿する'\n    expect(page).to have_text('作成しました')\n    expect(Post.last.title).to eq 'Hello'\n  end\nend\n\n# Cuprite を使う設定 (spec_helper.rb)\nCapybara.javascript_driver = :cuprite",
    },
  },
  {
    id: "rspec-015",
    categoryId: "rspec",
    difficulty: "intermediate",
    type: "choice",
    question:
      "外部 API への HTTP リクエストをテストで再生・記録する gem は？",
    choices: [
      "Capybara",
      "factory_bot",
      "Devise",
      "VCR (+ WebMock)",
    ],
    answerIndex: 3,
    hints: [
      "実 HTTP リクエストを最初の 1 回だけ記録、以降はカセットから再生。",
      "ビデオデッキの略のような 3 文字の名前。",
      "外部 API テストのデファクトで、WebMock と組み合わせて使うのが一般的。",
    ],
    explanation: {
      summary:
        "VCR は HTTP リクエスト/レスポンスを YAML に記録 (cassette) → 以降オフラインで再生する gem。",
      reason:
        "外部 API テストは速度・安定性・コスト面で問題があるので、VCR で実通信を 1 度だけ行い、以降は録画から再生。WebMock は『偽の HTTP レスポンスを返す』gem で、VCR はその上に再生機能を載せたイメージ。シークレットは filter で除外。",
      codeExample:
        "# Gemfile (test)\ngem 'vcr'\ngem 'webmock'\n\n# spec/rails_helper.rb\nVCR.configure do |c|\n  c.cassette_library_dir = 'spec/cassettes'\n  c.hook_into :webmock\n  c.filter_sensitive_data('<API_KEY>') { ENV['STRIPE_API_KEY'] }\nend\n\n# 使い方\nit 'fetches the user', :vcr do      # spec/cassettes/<auto_name>.yml\n  result = StripeClient.fetch_customer('cus_xxx')\n  expect(result['email']).to eq 'a@x'\nend",
    },
  },
  {
    id: "rspec-016",
    categoryId: "rspec",
    difficulty: "advanced",
    type: "choice",
    question:
      "RSpec で『開発中はこのテストだけ実行したい』時に使える、describe/it に付けるメタデータは？",
    choices: [
      ":hidden",
      ":only",
      ":private",
      ":focus (focus: true) と --tag focus",
    ],
    answerIndex: 3,
    hints: [
      "メタデータをタグで指定し、コマンドラインで絞り込む方法です。",
      "RSpec の `fdescribe` / `fit` を使うと自動でこのタグが付きます。",
      "英語で『集中』を意味する 5 文字のキーワード。",
    ],
    explanation: {
      summary:
        "`fit` / `fdescribe` で focus メタデータが付与、`--tag focus` で絞り込み実行。",
      reason:
        "巨大プロジェクトで全テスト実行が重い時に、注目したいテストだけ動かすイディオム。spec_helper で `config.filter_run_when_matching :focus` を設定すると、focus が無ければ全テスト、有れば focus だけが走る賢い切り替えに。`fit` をコミットしないよう pre-commit hook で弾くチームも多い。",
      codeExample:
        "# spec_helper.rb\nRSpec.configure do |c|\n  c.filter_run_when_matching :focus\nend\n\n# spec ファイル\nfit '注目したいテスト' do            # 自動で focus: true\n  ...\nend\n\nfdescribe '注目グループ' do          # 同上\n  it { ... }\nend\n\n# 一時的に無効化\nxit '無効化' do; end                # skip\npending '実装中' do; end",
    },
  },

  // ===========================================================================
  // 📜 ログ調査 追加 (8問: lograge, jq, X-Request-Id, ローテーション 等)
  // ===========================================================================
  {
    id: "logs-009",
    categoryId: "logs",
    difficulty: "intermediate",
    type: "choice",
    question:
      "Rails のデフォルトログを『1 リクエスト = 1 行の構造化ログ』に変換する人気 gem は？",
    choices: ["lograge", "logger-pretty", "json-rails", "log-aggregator"],
    answerIndex: 0,
    hints: [
      "デフォルト Rails ログは 1 リクエストで複数行に渡り集計しづらいのを解決します。",
      "1 行 1 リクエスト形式 (JSON 出力も可)、CloudWatch / Datadog 等での集計に最適。",
      "log + 集約 を意味する英語の合成で、英国読みっぽい綴り (-rage で終わる)。",
    ],
    explanation: {
      summary:
        "`lograge` は Rails ログを 1 リクエスト = 1 行に圧縮する gem。集計・パースが容易になる。",
      reason:
        "デフォルトの Rails ログは Started/Processing/Parameters/Rendered/Completed と複数行に渡るため検索・集計しづらい。lograge は status / duration / params / IP / controller#action 等を 1 行にまとめて出力。JSON formatter も使え、CloudWatch Logs Insights や Datadog で集計可能。",
      codeExample:
        "# Gemfile\ngem 'lograge'\n\n# config/environments/production.rb\nconfig.lograge.enabled = true\nconfig.lograge.formatter = Lograge::Formatters::Json.new\nconfig.lograge.custom_options = lambda do |event|\n  {\n    request_id: event.payload[:request_id],\n    user_id:    event.payload[:user_id],\n    params:     event.payload[:params].except('controller', 'action')\n  }\nend\n\n# 出力 (1 行)\n# {\"method\":\"GET\",\"path\":\"/posts/1\",\"status\":200,\"duration\":12.34,...}",
    },
  },
  {
    id: "logs-010",
    categoryId: "logs",
    difficulty: "intermediate",
    type: "text",
    question:
      "Rails が全リクエストに自動付与する『リクエスト追跡用のヘッダー名』は？(ハイフン区切り英語)",
    answers: ["X-Request-Id", "X-Request-ID", "x-request-id"],
    hints: [
      "ロードバランサ / Web サーバ / アプリ間でリクエストを横断追跡するための識別子。",
      "レスポンスヘッダにも含まれ、エラー報告時にユーザーに伝える ID として使われます。",
      "X- prefix + 機能名 + Id の慣習的なヘッダー名。Heroku / nginx 等が標準で発行。",
    ],
    explanation: {
      summary:
        "`X-Request-Id` は分散システムで 1 リクエストを横断追跡するための一意 ID。Rails / Heroku / nginx 等が自動付与。",
      reason:
        "ロードバランサがクライアントから受けた瞬間に発行 → アプリ / DB / ジョブにヘッダーで伝搬。Rails では `request.request_id` で参照可能。lograge と組み合わせると 1 行ログに含めて『この遅いリクエストの全旅程』を辿れる。Sentry / Bugsnag のエラーレポートにも付与すると追跡が劇的に楽。",
      codeExample:
        "# Controller / Job からアクセス\nRails.logger.info \"user_id=#{current_user.id} request_id=#{request.request_id}\"\n\n# lograge と組み合わせ\nconfig.lograge.custom_options = lambda do |event|\n  { request_id: event.payload[:request_id] }\nend\n\n# 外部 API 呼び出し時に伝搬\nHTTP.headers('X-Request-Id' => request.request_id).get(url)\n\n# Sidekiq Job への伝搬 (current_attributes 経由)\nclass MyJob < ApplicationJob\n  around_perform { |job, block| Current.request_id = job.arguments.last; block.call }\nend",
    },
  },
  {
    id: "logs-011",
    categoryId: "logs",
    difficulty: "intermediate",
    type: "choice",
    question:
      "JSON 形式のログを抽出・整形する CLI ツールは？",
    choices: ["jsed", "jq", "json-cli", "jconvert"],
    answerIndex: 1,
    hints: [
      "2 文字の短いコマンド名。",
      "ドットでフィールドアクセス、`.[]` で配列展開、`select()` でフィルタなど SQL に近い表現が書けます。",
      "Mac の brew, apt, yum どれでも標準的に入れられる定番ツール。",
    ],
    explanation: {
      summary:
        "`jq` は JSON 用の sed/awk。フィルタリング・整形・抽出を CLI で簡潔に書ける。",
      reason:
        "Rails 構造化ログ (lograge JSON) や API レスポンスの解析で必須。`.field` でフィールドアクセス、`select(条件)` でフィルタ、`map(...)` で変換、`group_by` で集計、`-r` で raw 文字列出力。`curl ... | jq` のように使うのが定番。",
      codeExample:
        '# 特定フィールドだけ抜き出し\ncat log.json | jq \'.path\'\n\n# 配列を展開して特定フィールドだけ\ncurl -s api.example.com/users | jq \'.[].name\'\n\n# 条件フィルタ + 集計\ncat log.json | jq \'select(.status >= 500) | .path\' | sort | uniq -c\n\n# CSV 出力\ncat users.json | jq -r \'.[] | [.id, .name, .email] | @csv\'\n\n# 整形 (pretty print)\ncurl -s api.example.com/posts | jq \'.\'',
    },
  },
  {
    id: "logs-012",
    categoryId: "logs",
    difficulty: "intermediate",
    type: "choice",
    question:
      "ログファイルが肥大化しすぎないよう、サイズ/日付で自動分割・圧縮・古いものを削除する Linux の標準ツールは？",
    choices: ["auto-purge", "logrotate", "log-cleaner", "ftruncate"],
    answerIndex: 1,
    hints: [
      "Cron 経由で日次実行されるのが標準的なセットアップ。",
      "/etc/logrotate.d/ 配下に設定ファイルを置く方式。",
      "英語で『ログを回転させる』をそのまま意味する 1 単語。",
    ],
    explanation: {
      summary:
        "`logrotate` は Linux 標準のログローテーション。設定ファイルでサイズ/日次/週次/圧縮ルールを宣言。",
      reason:
        "ディスク逼迫の主要因がログ蓄積。logrotate は cron 経由で自動回転、`copytruncate` でアプリ無停止での切り替えが定番。Rails 自体は再起動が必要なケースもあるので注意。Heroku / AWS ECS のようなマネージド環境では不要 (プラットフォームが管理)。",
      codeExample:
        "# /etc/logrotate.d/myapp\n/var/www/myapp/log/*.log {\n  daily                    # 1 日 1 回\n  rotate 14                # 14 世代保持\n  compress                 # gzip で圧縮\n  delaycompress\n  missingok                # ファイル無くてもエラーにしない\n  notifempty               # 空ならスキップ\n  copytruncate             # アプリの fd を維持しつつ truncate\n  postrotate\n    # 必要ならアプリにシグナル\n  endscript\n}\n\n# テスト実行\nlogrotate -d /etc/logrotate.d/myapp   # dry-run\nlogrotate -f /etc/logrotate.d/myapp   # 強制実行",
    },
  },
  {
    id: "logs-013",
    categoryId: "logs",
    difficulty: "intermediate",
    type: "choice",
    question:
      "Rails で『エラーを Slack / Sentry / Datadog に自動通知する』エラー監視 SaaS として広く使われるのは？",
    choices: [
      "Sentry / Rollbar / Honeybadger / Bugsnag",
      "GitHub Actions",
      "RubyGems",
      "Bundler",
    ],
    answerIndex: 0,
    hints: [
      "捕捉した例外を集約し、頻度・影響ユーザー・スタックトレースで一覧化する SaaS 群です。",
      "Slack / メール通知、課題追跡ツール (Jira/Linear 等) との連携も標準装備。",
      "選択肢の中で『エラー監視』専門の SaaS だけが並ぶグループを選んでください。",
    ],
    explanation: {
      summary:
        "エラー監視 SaaS: Sentry / Rollbar / Honeybadger / Bugsnag が代表的。APM (New Relic 等) とは別レイヤー。",
      reason:
        "本番のエラーをログだけで追うのは現実的ではない。エラー監視 SaaS は (1) スタックトレース集約、(2) 同一エラーのグルーピング、(3) 影響範囲 (ユーザー数 / セッション数)、(4) 通知 (Slack/Email/PagerDuty) を提供。Rails では各 gem を Gemfile に追加 + DSN 設定だけで稼働。",
      codeExample:
        "# Gemfile\ngem 'sentry-ruby'\ngem 'sentry-rails'\n\n# config/initializers/sentry.rb\nSentry.init do |config|\n  config.dsn = ENV['SENTRY_DSN']\n  config.traces_sample_rate = 0.1\n  config.environment = Rails.env\n  config.before_send = lambda do |event, _hint|\n    # PII を除去\n    event.user[:email] = nil\n    event\n  end\nend\n\n# 手動キャプチャ\nbegin\n  risky_operation\nrescue => e\n  Sentry.capture_exception(e, tags: { feature: 'payment' })\n  raise\nend",
    },
  },
  {
    id: "logs-014",
    categoryId: "logs",
    difficulty: "advanced",
    type: "choice",
    question:
      "本番でログレベルを一時的に DEBUG にしたい時の、再起動不要な定番アプローチは？",
    choices: [
      "config を git push してデプロイ",
      "Rails.logger.level = Logger::DEBUG を Rails console で実行",
      "/etc/rails.conf を編集",
      "Heroku を再起動",
    ],
    answerIndex: 1,
    hints: [
      "Rails コンソールから実行中のプロセスに対して動的に変更できます。",
      "ただしマルチプロセス環境 (Puma) では 1 ワーカーにしか効かないので注意。",
      "Logger::DEBUG / INFO / WARN / ERROR / FATAL の定数を代入する方法。",
    ],
    explanation: {
      summary:
        "Rails console から `Rails.logger.level = Logger::DEBUG` でその場で変更可能。ただしマルチワーカー環境では当該プロセスのみ。",
      reason:
        "本番で詳細ログが必要な障害時の対応。永続的に変更するには config 修正 + デプロイが必要。一時的なら console 経由が早い。マルチワーカー環境 (Puma 等) は全ワーカーには波及しないので、SIGUSR2 や signal handling でアプリ側に切替ロジックを実装する例もある。",
      codeExample:
        "# 一時的に DEBUG レベル (このコンソールセッション + 同プロセス)\nRails.logger.level = Logger::DEBUG\nRails.logger.debug 'now visible in production'\n\n# 元に戻す\nRails.logger.level = Logger::INFO\n\n# 全プロセスに波及するには Redis 等で共有 + 各プロセスでチェック\n# (簡易例)\nbefore_action do\n  Rails.logger.level = Redis.current.get('log_level').to_i\nend\n\n# 危険: 大量ログで disk を埋めない設計が前提",
    },
  },
  {
    id: "logs-015",
    categoryId: "logs",
    difficulty: "advanced",
    type: "choice",
    question:
      "次のコマンドの目的として最も適切なのは？",
    code: "ps -p $(lsof -t -i:3000) -o pid,etime,rss,cmd",
    choices: [
      "ポート 3000 を閉じる",
      "Rails アプリを再起動",
      "ファイルをロック",
      "ポート 3000 を使っているプロセスの起動時間・メモリ・コマンドを表示",
    ],
    answerIndex: 3,
    hints: [
      "コマンド置換 `$(...)` で内側を先に実行している点に注目。",
      "lsof -t -i:PORT は『そのポートを listen している PID のみ』を返します。",
      "ps -p PID -o ... は PID を指定して必要な情報だけを表示するオプション。",
    ],
    explanation: {
      summary:
        "lsof でポート使用 PID を取得 → ps でその起動時間・メモリ・コマンドラインを表示。本番調査の定番複合コマンド。",
      reason:
        "『なぜか重い』『誰がこのポート握ってる?』を一発で調べる。`lsof -i:PORT` の `-t` で PID のみ。`ps -o` で出力列を絞れる。組み合わせでスナップショット情報が見やすい。`netstat -tlnp` / `ss -tlnp` で同様の情報も取れる。",
      codeExample:
        "# 完全版\nlsof -i:3000                      # ポート 3000 を使うプロセス詳細\nlsof -t -i:3000                   # PID だけ\nss -tlnp | grep 3000              # ss でポート確認 (新しい net-tools)\nnetstat -tlnp | grep 3000         # netstat (古い)\n\n# プロセス詳細\nps -p <PID> -o pid,etime,rss,cmd\n#   etime: 起動からの経過時間\n#   rss:   実メモリ使用 (KB)\n#   cmd:   コマンドライン",
    },
  },
  {
    id: "logs-016",
    categoryId: "logs",
    difficulty: "advanced",
    type: "choice",
    question:
      "1 リクエストごとに『そのリクエスト中の全ログ』を後で追えるようにする Rails の仕組みは？",
    choices: [
      "Rails.cache.write",
      "Rails.cookies.write",
      "Rails.session.tagged",
      "Rails.logger.tagged ブロック (TaggedLogging)",
    ],
    answerIndex: 3,
    hints: [
      "ログ行の先頭に [tag] が付き、grep で 1 リクエスト分のログをまとめて抽出できるようになります。",
      "Rails 標準で、デフォルトでは request_id が付与されます。",
      "ロガーに対するブロック付きメソッドで、英語の『タグ付き』を意味する過去分詞。",
    ],
    explanation: {
      summary:
        "`Rails.logger.tagged('tag') { ... }` で囲むと内部のログ全行に prefix [tag] が付く。",
      reason:
        "デフォルトで `[request_id]` が付与されており、`grep <REQUEST_ID> log/production.log` で 1 リクエスト分のログを横断抽出できる。任意のタグ (user_id / feature) を追加可能。`config.log_tags = [:request_id, :remote_ip]` で全リクエストに自動付与もできる。",
      codeExample:
        "# config/environments/production.rb\nconfig.log_tags = [:request_id, :remote_ip]\n\n# 任意のブロック内でも追加\nRails.logger.tagged('SignUp', user.id) do\n  Rails.logger.info 'started'\n  process_signup\n  Rails.logger.info 'completed'\nend\n\n# ログ例\n# [abc-123-def] [192.168.1.1] [SignUp] [42] started\n\n# 1 リクエスト追跡\ngrep 'abc-123-def' log/production.log",
    },
  },

  // ===========================================================================
  // 🔧 Git & GitHub 追加 (8問: bisect, reflog, cherry-pick, GitHub Actions 等)
  // ===========================================================================
  {
    id: "git-009",
    categoryId: "git-github",
    difficulty: "intermediate",
    type: "choice",
    question:
      "『この機能、ある時点では動いていたのに最近壊れた』を二分探索で原因コミットを特定する Git コマンドは？",
    choices: ["git blame", "git binary", "git bisect", "git find"],
    answerIndex: 2,
    hints: [
      "コミット履歴を二分探索で絞り込む機能。",
      "good / bad コミットを指定すると、Git が真ん中を順に提示してくれます。",
      "英語で『二分する』を意味する 6 文字のコマンド名。",
    ],
    explanation: {
      summary:
        "`git bisect` は『動く版』と『壊れた版』の間を二分探索で『どのコミットで壊れたか』を見つけるツール。",
      reason:
        "100 コミット先で壊れていたら 1 個ずつ追うと大変だが、二分探索なら log2(100) ≈ 7 回で特定できる。回帰テストがあれば `git bisect run <test-script>` で自動化も可能。",
      codeExample:
        "# 開始\ngit bisect start\ngit bisect bad                 # 現在 (壊れている) を bad に\ngit bisect good v1.2.0         # 動いていた版を good に\n\n# Git が中間コミットを checkout する\n# 動作確認して回答\ngit bisect good                # 動く\n# または\ngit bisect bad                 # 壊れている\n\n# ループ → 原因コミット特定\n# bisect found: deadbeef is the first bad commit\n\n# 終了\ngit bisect reset\n\n# 自動化 (script の exit code 0=good, 非0=bad)\ngit bisect run rspec spec/regression_spec.rb",
    },
  },
  {
    id: "git-010",
    categoryId: "git-github",
    difficulty: "intermediate",
    type: "text",
    question:
      "誤って `git reset --hard` で消したコミットを救出するために、HEAD の移動履歴を見るコマンドは `git ???`。??? に入る 1 単語は？(英語)",
    answers: ["reflog"],
    hints: [
      "ref (参照) + log の合成語です。",
      "HEAD の動き (commit/reset/rebase/checkout 等) がすべて記録されています。",
      "デフォルトで 90 日間履歴を保持。",
    ],
    explanation: {
      summary:
        "`git reflog` は HEAD の移動履歴。`reset --hard` 等で消えたコミットも 90 日間は救出可能。",
      reason:
        "Git の『迷子コミット』救出ツール。`git reset --hard HEAD~5` でコミット 5 つ吹き飛ばしても、reflog で `HEAD@{1}` 等のラベルを使って復元可能。意外と知らない人が多いが、Git の安全網。`git fsck --lost-found` で完全に dangling になったコミットを探すこともできる。",
      codeExample:
        "# 履歴確認\ngit reflog\n# abc1234 HEAD@{0}: reset: moving to HEAD~5\n# def5678 HEAD@{1}: commit: 救いたいコミット\n# ...\n\n# 復元 (def5678 を取り戻す)\ngit reset --hard def5678\n# または\ngit reset --hard HEAD@{1}\n\n# 特定ブランチを誤って削除した\ngit reflog | grep <branch_name>\ngit branch <restored_name> <SHA>",
    },
  },
  {
    id: "git-011",
    categoryId: "git-github",
    difficulty: "intermediate",
    type: "choice",
    question:
      "別ブランチの特定の 1 コミットだけを現在のブランチに取り込むコマンドは？",
    choices: ["git cherry-pick <SHA>", "git copy <SHA>", "git import <SHA>", "git apply <SHA>"],
    answerIndex: 0,
    hints: [
      "果物に関連する複合語名のコマンド。",
      "他のブランチから『美味しい所どり』するイメージ。",
      "hotfix を main と develop の両方に取り込みたい時の定番。",
    ],
    explanation: {
      summary:
        "`git cherry-pick <SHA>` で指定コミットを現在ブランチに新しいコミットとして適用。",
      reason:
        "hotfix を main + develop 両方に入れたい時、リリースブランチからの逆輸入、緊急パッチの選択的適用などで使う。連続適用、コンフリクトしたら手動解決 + `--continue`。`-x` オプションで『元コミット情報』をメッセージに残せる。",
      codeExample:
        "# 1 コミット適用\ngit cherry-pick deadbeef\n\n# 範囲 (deadbeef を含まない deadbeef..feedface)\ngit cherry-pick deadbeef..feedface\n\n# 元コミット情報をメッセージに残す (履歴追跡用)\ngit cherry-pick -x deadbeef\n\n# コンフリクト解決後\ngit cherry-pick --continue\ngit cherry-pick --abort        # やめる",
    },
  },
  {
    id: "git-012",
    categoryId: "git-github",
    difficulty: "advanced",
    type: "choice",
    question:
      "1 つのリポジトリで複数ブランチを同時にチェックアウトして並行作業する Git の機能は？",
    choices: ["git multibranch", "git parallel", "git clone --multi", "git worktree"],
    answerIndex: 3,
    hints: [
      "別ディレクトリにブランチを展開し、本体は維持しつつ並行で見られます。",
      "git stash や master ⇔ feature 切替の手間を省きます。",
      "英語で『作業の樹』を意味する 1 単語。",
    ],
    explanation: {
      summary:
        "`git worktree add ../path branch` で別ディレクトリに別ブランチをチェックアウト。同時並行作業が可能。",
      reason:
        "feature ブランチで作業中に hotfix が降ってきた時、現状を stash せずに別ディレクトリで対応できる。Rails アプリで同時に複数 Rails サーバを起動する必要があるとき (e.g., 旧バージョンと新バージョン比較) にも便利。一時的に切ったツリーは `git worktree remove` で削除。",
      codeExample:
        "# 別ディレクトリにブランチを展開\ngit worktree add ../myapp-hotfix hotfix/x\ncd ../myapp-hotfix\n# 普通に作業 (元の作業ディレクトリには影響なし)\n\n# 一覧\ngit worktree list\n\n# 削除\ngit worktree remove ../myapp-hotfix\n\n# 注意: 同じブランチを複数 worktree で開くことはできない",
    },
  },
  {
    id: "git-013",
    categoryId: "git-github",
    difficulty: "intermediate",
    type: "choice",
    question:
      "GitHub で『push 時に自動でテストを走らせる』ファイルの配置場所は？",
    choices: [
      ".github/workflows/*.yml",
      ".circleci/config.yml",
      "Jenkinsfile",
      ".gitlab-ci.yml",
    ],
    answerIndex: 0,
    hints: [
      "GitHub 公式の CI/CD 機能 (GitHub Actions) で使う設定ファイル。",
      "ディレクトリ名は『.github』、その配下に workflows ディレクトリ。",
      "ファイル拡張子は YAML。",
    ],
    explanation: {
      summary:
        "GitHub Actions は `.github/workflows/*.yml` を自動検出して push / PR / cron トリガーで実行。",
      reason:
        "リポジトリ専用の CI/CD。`on:` でトリガー、`jobs:` で並列ジョブ、`steps:` で各コマンド。公開 marketplace の actions (例: `actions/checkout@v4`) を `uses:` で取り込み。Rails テンプレ: PostgreSQL サービス、bundler キャッシュ、rspec/rubocop 実行が一般的。",
      codeExample:
        "# .github/workflows/ci.yml\nname: CI\non:\n  push:\n    branches: [main]\n  pull_request:\nconcurrency:\n  group: ${{ github.workflow }}-${{ github.ref }}\n  cancel-in-progress: true\n\njobs:\n  test:\n    runs-on: ubuntu-latest\n    services:\n      postgres:\n        image: postgres:16\n        env: { POSTGRES_PASSWORD: postgres }\n        options: >-\n          --health-cmd pg_isready\n    steps:\n      - uses: actions/checkout@v4\n      - uses: ruby/setup-ruby@v1\n        with: { ruby-version: '3.3', bundler-cache: true }\n      - run: bundle exec rspec",
    },
  },
  {
    id: "git-014",
    categoryId: "git-github",
    difficulty: "intermediate",
    type: "choice",
    question:
      "GitHub で『main へ直接 push 禁止 / CI 通過必須 / レビュー 1 名以上』を強制する仕組みは？",
    choices: [
      "branch protection rule",
      "deploy keys",
      "secret scanning",
      "code owners only",
    ],
    answerIndex: 0,
    hints: [
      "Settings → Branches で設定する機能。",
      "PR を必須にして、CI / レビュー / 署名コミットなどのルールを強制。",
      "英語で『枝の保護ルール』を意味する 3 語。",
    ],
    explanation: {
      summary:
        "Branch Protection Rule で main 等への直接 push を禁止し、PR + CI + レビュー必須化。",
      reason:
        "main の品質保証の基本。`Settings → Branches → Add rule` で設定。主な項目: (1) Require PR before merging、(2) Require status checks to pass (CI 名指定)、(3) Require approvals N 名以上、(4) Require signed commits、(5) Restrict who can push、(6) Require linear history (merge commit 禁止 / squash 強制)。チーム規模に合わせてカスタマイズ。",
      codeExample:
        "# 設定後の挙動\n$ git push origin main\n# remote: error: GH006: Protected branch update failed\n# remote: error: At least 1 approving review is required\n\n# 代わりに必ず PR\n$ git checkout -b feature/x\n$ git push -u origin feature/x\n$ gh pr create --base main\n# CI 通過 + 1 名承認 → Merge ボタン有効化",
    },
  },
  {
    id: "git-015",
    categoryId: "git-github",
    difficulty: "intermediate",
    type: "choice",
    question:
      "コミットメッセージのスタイルとして広く採用される『feat / fix / docs / refactor 等の prefix』規約は？",
    choices: [
      "Semantic Style",
      "Atom Style",
      "Conventional Commits",
      "Strict Commits",
    ],
    answerIndex: 2,
    hints: [
      "Angular プロジェクトから広まった規約。",
      "type(scope): subject の形式で書きます。",
      "英語で『慣習的な』を意味する形容詞 + Commits。",
    ],
    explanation: {
      summary:
        "Conventional Commits は `type(scope): subject` 形式の規約。CHANGELOG 自動生成や semver と相性が良い。",
      reason:
        "代表的 type: feat (新機能 → MINOR)、fix (バグ修正 → PATCH)、docs / chore / style / refactor / test / perf / build / ci。`BREAKING CHANGE: ...` のフッターで MAJOR を発火。`semantic-release` / `release-please` などのツールで自動的にバージョン更新 + CHANGELOG + GitHub Release が作れる。",
      codeExample:
        "# 良い例\nfeat(auth): JWT による API 認証を追加\nfix(post): 公開済み投稿の編集で 500 エラーが出るバグを修正\ndocs(readme): デプロイ手順を Vercel 向けに刷新\nrefactor(user): pluck で N+1 を解消\n\n# BREAKING\nfeat(api)!: v1 を廃止、v2 のみサポート\n\nBREAKING CHANGE: GET /v1/users は 410 を返す。クライアントは v2 に移行が必要",
    },
  },
  {
    id: "git-016",
    categoryId: "git-github",
    difficulty: "advanced",
    type: "choice",
    question:
      "対話的 rebase (`git rebase -i HEAD~3`) でできない操作はどれ？",
    choices: [
      "コミットメッセージを書き換える",
      "コミットを跨いだファイル名の変更履歴を消す",
      "コミットの順番を入れ替える (reorder)",
      "複数コミットを 1 つに squash する",
    ],
    answerIndex: 1,
    hints: [
      "rebase -i のメニューは pick / reword / edit / squash / fixup / drop の組み合わせ。",
      "順番入れ替え・統合・編集・削除はできるが、ファイルレベルの履歴改変は別操作。",
      "rebase の中ではコミット単位の操作しかできず、ファイルの追跡履歴 (rename detection) は手出しできません。",
    ],
    explanation: {
      summary:
        "interactive rebase は『コミット単位』の操作 (順序入替/統合/書換/削除)。ファイル追跡の改変は filter-branch / git-filter-repo の領域。",
      reason:
        "メニューの主要キーワード: `pick` 採用、`reword` メッセージ書換、`edit` 一時停止して修正、`squash` 前のと統合してメッセージ編集、`fixup` 統合してメッセージ捨てる、`drop` 削除。順序入替は行を入れ替えるだけ。ファイル履歴の改変 (例: 機密情報を全履歴から削除) は `git filter-repo` (今は推奨) / 旧 `filter-branch`。",
      codeExample:
        "# 直近 5 コミットを整理\ngit rebase -i HEAD~5\n\n# エディタが開く\n# pick abc1 first feature\n# pick def2 typo fix\n# pick ghi3 lint\n# pick jkl4 second feature\n# pick mno5 fix for first\n\n# 編集後 (mno5 を abc1 にまとめる + ghi3 を捨てる)\n# pick abc1 first feature\n# fixup mno5 fix for first\n# pick def2 typo fix\n# drop ghi3 lint\n# pick jkl4 second feature\n\n# 機密情報削除は別ツール\ngit filter-repo --path config/secrets.yml --invert-paths",
    },
  },

  // ===========================================================================
  // 🛡️ セキュリティ 追加 (8問: HSTS, CSP, JWT, rack-attack, bundle audit 等)
  // ===========================================================================
  {
    id: "sec-008",
    categoryId: "security",
    difficulty: "intermediate",
    type: "choice",
    question:
      "ブラウザに『今後このサイトは HTTPS のみで接続する』を強制する HTTP ヘッダーは？",
    choices: [
      "X-Content-Type-Options",
      "Cache-Control",
      "Strict-Transport-Security (HSTS)",
      "X-Frame-Options",
    ],
    answerIndex: 2,
    hints: [
      "HTTP → HTTPS 自動アップグレードと、HTTPS なしアクセスのブロックを行う設定。",
      "max-age と includeSubDomains を指定するヘッダー。",
      "英語で『厳格な輸送セキュリティ』を意味する 3 単語ヘッダー名。",
    ],
    explanation: {
      summary:
        "`Strict-Transport-Security: max-age=N; includeSubDomains; preload` で HTTPS 強制 + ダウングレード攻撃防止。",
      reason:
        "HSTS を有効にするとブラウザは max-age 秒間 HTTP リクエストを HTTPS に自動変換、証明書エラー時もアクセス拒否。Rails では `config.force_ssl = true` で自動付与。`preload` はブラウザ組み込みリストに事前登録 (一度設定すると外せないので慎重に)。",
      codeExample:
        "# config/environments/production.rb\nconfig.force_ssl = true\n\n# レスポンスヘッダ\nStrict-Transport-Security: max-age=63072000; includeSubDomains; preload\n\n# 細かく制御\nconfig.ssl_options = {\n  hsts: {\n    expires: 1.year,\n    subdomains: true,\n    preload: true\n  }\n}\n\n# 関連の重要ヘッダ\n# X-Frame-Options: SAMEORIGIN     # クリックジャッキング対策\n# X-Content-Type-Options: nosniff # MIME sniffing 防止\n# Referrer-Policy: strict-origin-when-cross-origin",
    },
  },
  {
    id: "sec-009",
    categoryId: "security",
    difficulty: "intermediate",
    type: "choice",
    question:
      "ブラウザに『どこから来た JS/CSS/image なら実行を許可するか』のホワイトリストを指示する HTTP ヘッダーは？",
    choices: [
      "Access-Control-Allow-Origin (CORS)",
      "X-XSS-Protection",
      "Referrer-Policy",
      "Content-Security-Policy (CSP)",
    ],
    answerIndex: 3,
    hints: [
      "XSS の二次被害 (inject されたスクリプトの実行) を強力に防ぐ仕組み。",
      "default-src / script-src / style-src 等でドメインを許可リスト化します。",
      "Rails 5.2+ は `config/initializers/content_security_policy.rb` で DSL 提供。",
    ],
    explanation: {
      summary:
        "CSP は『許可された出所からだけリソース読み込み / インライン JS 禁止』をブラウザに指示する強力な XSS 対策。",
      reason:
        "XSS で attacker が <script> を仕込んでも、CSP で外部スクリプトを禁止していれば実行されない (二段の防御)。インライン JS も禁止できるので、`<script>alert(1)</script>` を埋め込まれても無効化。Rails の `content_security_policy do |policy| ... end` DSL で宣言。`script_src_nonce` で安全な手書きインライン許可も。",
      codeExample:
        "# config/initializers/content_security_policy.rb\nRails.application.config.content_security_policy do |policy|\n  policy.default_src :self, :https\n  policy.font_src    :self, :https, :data\n  policy.img_src     :self, :https, :data\n  policy.object_src  :none\n  policy.script_src  :self, :https\n  policy.style_src   :self, :https\n  policy.connect_src :self, :https, 'wss://example.com'\n  # nonce 自動生成して inline 許可\nend\n\nRails.application.config.content_security_policy_nonce_generator = ->(req) { SecureRandom.base64(16) }",
    },
  },
  {
    id: "sec-010",
    categoryId: "security",
    difficulty: "intermediate",
    type: "choice",
    question:
      "JWT (JSON Web Token) のセキュリティで『最重要の落とし穴』として有名なのは？",
    choices: [
      "Base64 が遅い",
      "JSON のパースに時間がかかる",
      "ペイロードが大きすぎる",
      "alg=none / 弱いアルゴリズムを許可してしまう (alg confusion)",
    ],
    answerIndex: 3,
    hints: [
      "署名アルゴリズム自体を改ざんされる攻撃。",
      "alg ヘッダで none を指定して署名を無効化、または HS256 ↔ RS256 を悪用するパターン。",
      "ライブラリ側で『許可するアルゴリズム』を明示する必要がある脆弱性。",
    ],
    explanation: {
      summary:
        "JWT の alg confusion: トークンの alg ヘッダを攻撃者が書き換えて検証ロジックを欺く。`alg=none` を許可しない、想定 alg を明示することで防ぐ。",
      reason:
        "歴史的に多くの JWT ライブラリが脆弱だった。例: alg=none を許可 → 署名なしで通る / RS256 (公開鍵) を HS256 (共有鍵) として処理 → 公開鍵で署名できてしまう。対策: (1) 検証時に許可 alg を配列で明示、(2) 適切な有効期限 (exp)、(3) シークレットを credentials で管理、(4) JTI で再利用防止。",
      codeExample:
        "require 'jwt'\n\n# ❌ 危険 (alg を自動検出するので攻撃者が改変可能)\nJWT.decode(token, secret)\n\n# ✅ 安全 (許可 alg を明示)\nJWT.decode(token, secret, true, { algorithm: 'HS256' })\n\n# 発行時\npayload = {\n  user_id: user.id,\n  exp: 1.hour.from_now.to_i,    # 短め推奨\n  iat: Time.current.to_i,\n  jti: SecureRandom.uuid        # 失効管理用\n}\nJWT.encode(payload, secret, 'HS256')",
    },
  },
  {
    id: "sec-011",
    categoryId: "security",
    difficulty: "intermediate",
    type: "choice",
    question:
      "Rails で『ログイン試行を 1 IP/1 分につき 5 回まで』に制限する定番 gem は？",
    choices: ["shield-rate", "rack-attack", "throttle-rate", "limiter"],
    answerIndex: 1,
    hints: [
      "Rack ミドルウェアとして動作。Rails 以外でも使えます。",
      "DSL で `throttle('logins/ip', limit: 5, period: 1.minute) do |req|...` のように書きます。",
      "rack + 攻撃を意味する英単語 のハイフン連結。",
    ],
    explanation: {
      summary:
        "`rack-attack` は IP / メールアドレス / URL 単位で『N 回 / N 秒』のレート制限ができる Rack ミドルウェア。",
      reason:
        "ブルートフォース対策 / DoS 緩和の標準解。`Rack::Attack.throttle` で制限、`Rack::Attack.blocklist` でブロック、`Rack::Attack.safelist` で除外。Redis をストアにすると複数プロセスで共有可能 (本番必須)。",
      codeExample:
        "# Gemfile\ngem 'rack-attack'\n\n# config/initializers/rack_attack.rb\nclass Rack::Attack\n  cache.store = ActiveSupport::Cache::RedisCacheStore.new(url: ENV['REDIS_URL'])\n\n  # ログイン: IP 単位 5 回 / 分\n  throttle('logins/ip', limit: 5, period: 1.minute) do |req|\n    req.ip if req.path == '/login' && req.post?\n  end\n\n  # ログイン: メールアドレス単位 5 回 / 分\n  throttle('logins/email', limit: 5, period: 1.minute) do |req|\n    req.params['email'].presence if req.path == '/login' && req.post?\n  end\n\n  blocklist('block bad bots') { |req| req.user_agent =~ /BadBot/ }\nend",
    },
  },
  {
    id: "sec-012",
    categoryId: "security",
    difficulty: "intermediate",
    type: "choice",
    question:
      "Rails ログから『password』『credit_card』等の機密値を自動マスキングする設定は？",
    choices: [
      "Rails.application.config.skip_params",
      "Rails.application.config.hide_log",
      "Rails.application.config.secret_log",
      "Rails.application.config.filter_parameters",
    ],
    answerIndex: 3,
    hints: [
      "Rails が自動でログに `[FILTERED]` と置換してくれる仕組み。",
      "config/initializers/filter_parameter_logging.rb がデフォルトで生成されます。",
      "params フィルタリングの設定。",
    ],
    explanation: {
      summary:
        "`config.filter_parameters += [:password, :credit_card]` でログから値を自動マスキング ([FILTERED] に置換)。",
      reason:
        "デフォルトで :passw, :secret, :token, :_key, :crypt, :salt, :certificate, :otp, :ssn が含まれる (Rails 6+)。アプリ独自の機密フィールド (:api_key, :credit_card) は追加。完全な値が必要な debug 時は別途構造化ログ等で。Sentry 等のエラーレポートにも有効。",
      codeExample:
        "# config/initializers/filter_parameter_logging.rb\nRails.application.config.filter_parameters += [\n  :password, :password_confirmation,\n  :credit_card, :cvv, :ssn,\n  :api_key, :token, :secret,\n]\n\n# ログ例 (フィルタ適用後)\n# Parameters: {\"user\"=>{\"email\"=>\"a@x\", \"password\"=>\"[FILTERED]\"}}\n\n# 関連: filter_redirect でリダイレクト先 URL の機密もマスク\nRails.application.config.filter_redirect += [\n  'oauth_token', 'access_token'\n]",
    },
  },
  {
    id: "sec-013",
    categoryId: "security",
    difficulty: "intermediate",
    type: "text",
    question:
      "Gemfile.lock 内の依存 gem に既知の脆弱性が無いかチェックする CLI ツールは `bundle ?????`。????? に入る英単語は？",
    answers: ["audit", "audit check"],
    hints: [
      "監査を意味する英単語そのまま。",
      "bundle audit gem を入れると bundler サブコマンドとして使えます。",
      "GitHub Dependabot も同じ思想の自動化。",
    ],
    explanation: {
      summary:
        "`bundle audit` は Ruby Advisory Database を参照して Gemfile.lock 内の既知脆弱性を検出する CLI。",
      reason:
        "CI に組み込むのが定番。bundler-audit gem を `bundle add --group development bundler-audit` → `bundle audit check --update` で実行。GitHub Dependabot / Snyk と組み合わせると、自動 PR で脆弱性 gem の更新を提案してくれる。",
      codeExample:
        "# インストール\ngem install bundler-audit\n\n# 実行\nbundle audit check --update\n# Updating ruby-advisory-db ...\n# Scanning ...\n# No vulnerabilities found\n\n# CI 組み込み (.github/workflows/ci.yml)\n- name: Audit dependencies\n  run: bundle exec bundle audit check --update\n\n# Dependabot 設定 (.github/dependabot.yml)\nversion: 2\nupdates:\n  - package-ecosystem: bundler\n    directory: '/'\n    schedule: { interval: weekly }",
    },
  },
  {
    id: "sec-014",
    categoryId: "security",
    difficulty: "advanced",
    type: "choice",
    question:
      "セッション Cookie に必須で付けるべきフラグの組み合わせは？",
    choices: [
      "Secure / HttpOnly / SameSite",
      "Cache / Compress / Versioned",
      "Public / Indexed / Compressed",
      "Persistent / Shared / Open",
    ],
    answerIndex: 0,
    hints: [
      "HTTPS 限定送信、JavaScript からの読取禁止、CSRF 緩和の 3 つを実現するフラグ群。",
      "Rails 6+ では SameSite=Lax がデフォルトで付与されます。",
      "セッションハイジャック / XSS 二次被害 / CSRF を一気に下げる組み合わせ。",
    ],
    explanation: {
      summary:
        "Secure (HTTPS 限定) / HttpOnly (JS から読めない) / SameSite (クロスサイト送信制限) の 3 つがセッション Cookie の必須セット。",
      reason:
        "Secure: 平文 HTTP では送信されない (盗聴対策)。HttpOnly: document.cookie からアクセス不能 (XSS 二次被害防止)。SameSite=Lax (デフォルト) / Strict (より厳格) / None (要 Secure): CSRF 緩和。Rails ではセッションストア設定で自動付与、独自 cookie は明示指定。",
      codeExample:
        "# config/initializers/session_store.rb\nRails.application.config.session_store :cookie_store,\n  key: '_myapp_session',\n  secure: Rails.env.production?,   # HTTPS 限定\n  httponly: true,                  # JS から読めない\n  same_site: :lax                  # CSRF 緩和\n\n# 独自 cookie\ncookies[:remember_me] = {\n  value: token,\n  expires: 1.year.from_now,\n  secure: Rails.env.production?,\n  httponly: true,\n  same_site: :strict\n}\n\n# 暗号化 cookie (改ざん防止)\ncookies.encrypted[:user_id] = current_user.id",
    },
  },
  {
    id: "sec-015",
    categoryId: "security",
    difficulty: "advanced",
    type: "choice",
    question:
      "ファイルアップロード機能のセキュリティ対策として最重要なのは？",
    choices: [
      "ファイル名を ROT13 で暗号化する",
      "アップロード後に削除する",
      "ZIP に圧縮する",
      "拡張子だけでなく Content-Type / マジックバイトで実コンテンツを検証し、別ドメイン or S3 から配信",
    ],
    answerIndex: 3,
    hints: [
      "拡張子だけのチェックは簡単に bypass される (foo.jpg と名乗る .exe など)。",
      "実際のコンテンツのマジックバイト (ファイル先頭の数バイト) を確認する必要があります。",
      "配信時にアプリと同じドメインから出すと XSS / セッション窃取の温床に。",
    ],
    explanation: {
      summary:
        "ファイルアップロードは『拡張子 + Content-Type + マジックバイト』の 3 段検証 + 別ドメイン / S3 配信 + サイズ制限が必要。",
      reason:
        "攻撃の典型: (1) 拡張子偽装で .html を上げて XSS、(2) .svg に script を仕込む、(3) 巨大ファイルで DoS、(4) アプリと同じドメイン配信で Cookie 盗難。対策: ActiveStorage + image_processing (Vips) で content_type 検証、許可拡張子の正規表現、サイズ制限、`config.action_dispatch.show_exceptions` 等。S3 等の別ドメインから配信すれば XSS 被害も限定的。",
      codeExample:
        "class Post < ApplicationRecord\n  has_one_attached :image\n  validate :image_type\n  validate :image_size\n\n  private\n\n  def image_type\n    return unless image.attached?\n    unless image.blob.content_type.start_with?('image/')\n      errors.add(:image, 'must be an image')\n    end\n    # 拡張子も検証\n    unless image.filename.extension.in?(%w[jpg jpeg png gif webp])\n      errors.add(:image, 'invalid extension')\n    end\n  end\n\n  def image_size\n    return unless image.attached?\n    if image.blob.byte_size > 5.megabytes\n      errors.add(:image, 'too large (max 5MB)')\n    end\n  end\nend",
    },
  },

  // ===========================================================================
  // 🔬 デバッグ&パフォーマンス 追加 (8問: ActiveRecord::QueryLog, GC, stackprof 等)
  // ===========================================================================
  {
    id: "dbg-008",
    categoryId: "debugging",
    difficulty: "intermediate",
    type: "choice",
    question:
      "Rails 7.1+ で『SQL クエリ発行元のコード位置を SQL コメントに自動付与』する標準機能は？",
    choices: [
      "Sequel::SourceMap",
      "Bullet::Annotator",
      "Marginalia / ActiveRecord::QueryLogs",
      "Sql::Tracer",
    ],
    answerIndex: 2,
    hints: [
      "SQL のコメントに /* application:MyApp, controller:Posts, action:index */ のような注釈が付きます。",
      "もとは marginalia gem の機能、Rails 7.1+ で標準化。",
      "DB ログから『この SQL はどこから呼ばれた』を即特定できる強力な機能。",
    ],
    explanation: {
      summary:
        "`ActiveRecord::QueryLogs` (Rails 7.1+) で SQL に呼び出し元情報をコメント付与。スロークエリ調査が劇的に楽。",
      reason:
        "本番の遅い SQL が見つかっても『どこから呼ばれたか』が分からないと修正できない。QueryLogs で controller/action/job 名がコメントとして付与されるので、DB のスロークエリログから即コードに到達可能。Rails 6 までは marginalia gem を使っていた。",
      codeExample:
        "# config/application.rb (Rails 7.1+)\nconfig.active_record.query_log_tags_enabled = true\nconfig.active_record.query_log_tags = [\n  :application, :controller, :action, :job,\n  { request_id: ->(context) { context[:controller]&.request&.request_id } }\n]\n\n# 出力される SQL\n# SELECT \"posts\".* FROM \"posts\"\n# /*application:MyApp,controller:posts,action:index,request_id:abc-123*/\n\n# Rails 6 までは marginalia gem\ngem 'marginalia'",
    },
  },
  {
    id: "dbg-009",
    categoryId: "debugging",
    difficulty: "intermediate",
    type: "choice",
    question:
      "Ruby のオブジェクトを見やすく整形して出力する標準的なデバッグ用メソッドは？",
    choices: ["dump", "fmt", "pp (pretty-print)", "view"],
    answerIndex: 2,
    hints: [
      "puts よりも構造を保って表示する 2 文字のメソッド。",
      "Hash や Array をインデント付きで出してくれます。",
      "標準ライブラリ pp 経由で require 不要 (Kernel 拡張)。",
    ],
    explanation: {
      summary:
        "`pp` (pretty-print) は Hash / Array / 入れ子オブジェクトをインデント付きで構造的に出力する標準デバッグメソッド。",
      reason:
        "`p` は inspect 結果を 1 行で出す。`pp` は構造を解析して複数行に整形。Rails でも `pp params.to_h` のように使う。さらに見やすくしたいなら awesome_print (`ap`) や amazing_print。",
      codeExample:
        "h = { user: { name: 'A', tags: %w[a b c] }, count: 100 }\n\np h\n# {:user=>{:name=>\"A\", :tags=>[\"a\", \"b\", \"c\"]}, :count=>100}\n\npp h\n# {:user=>{:name=>\"A\", :tags=>[\"a\", \"b\", \"c\"]},\n#  :count=>100}\n\n# Rails console でカラフルに\nrequire 'awesome_print'\nap h",
    },
  },
  {
    id: "dbg-010",
    categoryId: "debugging",
    difficulty: "intermediate",
    type: "choice",
    question:
      "現在の呼び出しスタック (どこから呼ばれたか) を確認する Ruby のメソッドは？",
    choices: [
      "stack / trace",
      "where / from",
      "backtrace",
      "caller / caller_locations",
    ],
    answerIndex: 3,
    hints: [
      "Kernel に定義されているメソッド。",
      "呼び出し元のファイル名:行数:メソッド名 の配列を返します。",
      "例外なしでも好きな位置でスタックを取得できます。",
    ],
    explanation: {
      summary:
        "`caller` は呼び出し元の文字列配列、`caller_locations` は Thread::Backtrace::Location オブジェクトの配列を返す。",
      reason:
        "『この処理がいつ・どこから呼ばれた?』のデバッグ。例外を投げなくてもスタック取得可能。`caller_locations(start, length)` でフレーム範囲を絞れる。Rails のソースコードを追う時にも便利。本番のロギングに混ぜると後追い調査が楽 (ただしオーバーヘッド注意)。",
      codeExample:
        "def mysterious_method\n  puts caller(1, 5)              # 直前のフレームから 5 つ\n  # /path/to/file.rb:42:in `block in <main>'\n  # /path/to/another.rb:10:in `each'\n\n  loc = caller_locations(1, 1).first\n  puts \"called from #{loc.path}:#{loc.lineno} #{loc.label}\"\nend\n\n# 例外起こさずに backtrace 風\ndef debug_here\n  Rails.logger.debug \"trace:\\n#{caller.first(10).join(\"\\n\")}\"\nend",
    },
  },
  {
    id: "dbg-011",
    categoryId: "debugging",
    difficulty: "intermediate",
    type: "choice",
    question:
      "Ruby アプリの CPU プロファイル (どのメソッドで時間使ってるか) を取得する代表的な gem は？",
    choices: ["stackprof / vernier", "memory_profiler", "byebug", "rspec"],
    answerIndex: 0,
    hints: [
      "サンプリング型のプロファイラ。低オーバーヘッドで本番計測にも使えます。",
      "出力はフレームグラフや list 形式で可視化。",
      "Ruby 公式インフラ的に推奨されてる 2 つの gem 名 (1 つは Stripe 製、もう 1 つは Shopify 製)。",
    ],
    explanation: {
      summary:
        "`stackprof` (Stripe) と `vernier` (Shopify) が現代の Ruby CPU プロファイラの定番。低オーバーヘッドで詳細解析が可能。",
      reason:
        "stackprof は wall/cpu/object モードを選べる定番。vernier は Ruby 3.2+ で公式推奨、より詳細な情報を取得可能。出力は flamegraph で可視化 (speedscope / firefox profiler で閲覧)。本番のサンプリングプロファイリングにも耐えうる性能。",
      codeExample:
        "# Gemfile\ngem 'stackprof'\ngem 'vernier'\n\n# 計測 (ブロック)\nrequire 'stackprof'\nresult = StackProf.run(mode: :cpu, raw: true) do\n  expensive_operation\nend\nStackProf::Report.new(result).print_text\n\n# vernier\nrequire 'vernier'\nVernier.profile(out: 'profile.json') do\n  expensive_operation\nend\n# → speedscope や firefox profiler で開く",
    },
  },
  {
    id: "dbg-012",
    categoryId: "debugging",
    difficulty: "intermediate",
    type: "choice",
    question:
      "Rails console の `app` オブジェクトでできることは？",
    choices: [
      "テンプレートをコンパイルする",
      "HTTP リクエストを送ってルーティング / コントローラの挙動を試す (app.get '/posts')",
      "Rails アプリを再起動する",
      "DB を削除する",
    ],
    answerIndex: 1,
    hints: [
      "Rails console から、ブラウザ経由のリクエストをシミュレートできます。",
      "ルーティングが正しいか、レスポンスの内容を見たい時に便利。",
      "GET / POST / PUT / DELETE すべて呼べます。",
    ],
    explanation: {
      summary:
        "`app` は Rails console のセッション。`app.get '/posts'` のように内部リクエストを送れる。helpers / params の検証にも便利。",
      reason:
        "console から: `app.get '/'` でリクエスト、`app.response.body` でレスポンス、`app.session` で session 確認、`app.cookies` で cookie。`helper` で view ヘルパー直接呼び出し、`controller` で現在の controller。ブラウザを開かずにルーティング・コントローラの挙動を試せる。",
      codeExample:
        "# Rails console\napp.get '/posts'\napp.response.status              #=> 200\napp.response.body                # HTML 本体\n\napp.post '/login', params: { email: 'a@x', password: 'pw' }\napp.cookies                      # 受け取った cookie\n\n# View Helper\nhelper.number_to_currency(12345)\n#=> \"$12,345.00\"\nhelper.link_to('home', '/')\n\n# 現在のコントローラ参照\ncontroller.params\ncontroller.request.headers",
    },
  },
  {
    id: "dbg-013",
    categoryId: "debugging",
    difficulty: "intermediate",
    type: "choice",
    question:
      "Rails 7+ で開発時にプロセス全体 (web + worker + tailwind 等) を起動する標準スクリプトは？",
    choices: [
      "bin/launch",
      "bin/up",
      "bin/dev (foreman / overmind 経由)",
      "bin/start_all",
    ],
    answerIndex: 2,
    hints: [
      "Rails 7 が生成する Procfile.dev を読み込むスクリプト。",
      "rails s + bin/jobs + tailwindcss --watch などを 1 コマンドで並行起動。",
      "ファイル名は短く `bin/` 配下に置かれる開発用エントリポイント。",
    ],
    explanation: {
      summary:
        "Rails 7+ は `bin/dev` で Procfile.dev を読み foreman/overmind 経由で複数プロセス並行起動 (web + jobs + asset watcher 等)。",
      reason:
        "従来は `rails s` だけだったが、Hotwire / CSS bundler / ジョブキューと組み合わさり、開発時に複数プロセスが必要に。bin/dev が Procfile.dev を見て foreman で起動。Overmind / Hivemind を入れれば対話的アタッチや個別再起動が可能。",
      codeExample:
        "# Procfile.dev (例)\nweb: bin/rails s\nworker: bundle exec sidekiq\ncss: bin/rails tailwindcss:watch\njs: yarn build --watch\n\n# 起動\nbin/dev\n\n# Overmind を使う場合\nbrew install overmind\nOVERMIND_NO_PORT=1 overmind start -f Procfile.dev\n\n# 個別プロセスを再起動\novermind restart worker",
    },
  },
  {
    id: "dbg-014",
    categoryId: "debugging",
    difficulty: "advanced",
    type: "choice",
    question:
      "Ruby のメモリ統計を取得する標準モジュールのメソッドは？",
    choices: [
      "GC.stat / GC.stat_heap",
      "Memory.info",
      "Heap.usage",
      "ObjectSpace.size",
    ],
    answerIndex: 0,
    hints: [
      "ガベージコレクションモジュール経由で統計が取れます。",
      "ヒープページ数、major/minor GC 回数、freelist サイズなどが見える。",
      "stat メソッドが Hash でメトリクスを返します。",
    ],
    explanation: {
      summary:
        "`GC.stat` は GC とヒープの統計 Hash を返す。アプリの『今のメモリ状況』を直接観察できる。",
      reason:
        "本番でメモリ使用量を監視する時の基本。count (GC 回数)、heap_allocated_pages (ヒープページ数)、total_allocated_objects (アプリ起動からの累計) など。差分を取ればリクエスト毎のオブジェクト生成数も見える。`GC.start` で手動 GC、`GC.disable / GC.enable` で一時停止 (パフォーマンスチューニング用)。",
      codeExample:
        "# 統計取得\nGC.stat\n#=> { count: 50, heap_allocated_pages: 500,\n#     total_allocated_objects: 1_234_567, ... }\n\n# 差分計測\nbefore = GC.stat[:total_allocated_objects]\nexpensive_operation\nafter  = GC.stat[:total_allocated_objects]\nputs \"objects allocated: #{after - before}\"\n\n# ObjectSpace\nObjectSpace.count_objects\n#=> { TOTAL: 100_000, FREE: 20_000, T_STRING: 30_000, ... }\n\n# プロセス全体のメモリ (RSS)\n`ps -p #{Process.pid} -o rss=`.to_i  # KB",
    },
  },
  {
    id: "dbg-015",
    categoryId: "debugging",
    difficulty: "advanced",
    type: "choice",
    question:
      "本番で『遅いリクエストの中身を Rails が自動で吐く詳細ログ』をどう取る？",
    choices: [
      "Rails console で再現",
      "config.active_support.report_deprecations / 0.5 秒以上は INFO に出る + APM の slow trace を組み合わせる",
      "puts でログ出力",
      "DB を再起動",
    ],
    answerIndex: 1,
    hints: [
      "Rails 自体には『遅いリクエストだけ詳細を出す』組込み機能は弱い。",
      "現代は APM (New Relic / Skylight / Datadog) で slow transaction trace を見るのが主流。",
      "ログだけで頑張ろうとすると追えないので APM 必須。",
    ],
    explanation: {
      summary:
        "Rails 単体での『遅いリクエストだけ詳細ログ』は限定的。本番は APM の slow transaction trace + lograge + Sentry の組合せが王道。",
      reason:
        "Rails ログは全リクエストに対して同じレベルしか出せない (全部 DEBUG にすると本番では出力過剰)。APM は SQL/外部API/Ruby メソッドの所要時間を自動計測し、遅い trace だけ詳細表示。Skylight (シンプル)、New Relic (機能豊富)、Datadog (インフラ含む)、Scout (Rails 特化) など選択肢あり。",
      codeExample:
        "# Skylight (代表例)\ngem 'skylight'\n\n# Skylight に独自計測を追加\nclass MyService\n  include Skylight::Helpers\n\n  instrument_method\n  def slow_operation\n    # ここの時間が自動で計測される\n  end\nend\n\n# Sentry でパフォーマンス計測\nSentry.init do |config|\n  config.traces_sample_rate = 0.1   # 10% サンプル\nend\n\n# Sentry の transaction span\nSentry.with_scope do |scope|\n  scope.set_transaction_name('UserSignup')\n  Sentry.start_transaction(name: 'signup', op: 'background.job')\nend",
    },
  },

  // ===========================================================================
  // 🐧 Linux & CLI 追加 (8問: alias, cron, screen/tmux, curl, ss, scp 等)
  // ===========================================================================
  {
    id: "cli-009",
    categoryId: "linux-cli",
    difficulty: "beginner",
    type: "choice",
    question:
      "シェルに『よく使うコマンドの短縮形』を定義する宣言は？",
    choices: [
      "shortcut gs='git status'",
      "define gs='git status'",
      "macro gs='git status'",
      "alias gs='git status'",
    ],
    answerIndex: 3,
    hints: [
      "5 文字の英単語、シェルの組み込みコマンド。",
      "~/.bashrc や ~/.zshrc に書いて永続化するのが定番。",
      "英語で『別名』を意味する単語そのまま。",
    ],
    explanation: {
      summary:
        "`alias name='command'` で短縮形を定義。~/.bashrc / ~/.zshrc に書くと永続化。",
      reason:
        "毎回打つコマンドは alias で短縮 → タイプミス減 + 作業速度アップ。複雑なら function を定義する。`unalias` で解除、`alias` 単体で一覧。Rails 開発者の定番: gs/ga/gc/gp、be (bundle exec)、rs (rails server)、rc (rails console)。",
      codeExample:
        "# ~/.zshrc に追加\nalias gs='git status'\nalias gc='git commit'\nalias gp='git push'\nalias gl='git log --oneline -20'\nalias be='bundle exec'\nalias rs='bin/rails server'\nalias rc='bin/rails console'\nalias rt='bundle exec rspec'\n\n# 関数 (引数を取りたい時)\nfunction mkcd() {\n  mkdir -p \"$1\" && cd \"$1\"\n}\n\n# 反映\nsource ~/.zshrc\n# または新しいシェルを起動",
    },
  },
  {
    id: "cli-010",
    categoryId: "linux-cli",
    difficulty: "intermediate",
    type: "choice",
    question:
      "Linux で定期実行を設定する伝統的なツールは？",
    choices: [
      "schedule / scheduletab",
      "timer / timertab",
      "loop / looptab",
      "cron / crontab",
    ],
    answerIndex: 3,
    hints: [
      "古くから Unix 系に標準搭載されている定期実行デーモン。",
      "crontab -e で編集、`分 時 日 月 曜 コマンド` の 5 フィールド形式。",
      "現代は systemd-timer も同等機能だが、伝統的なのは 4 文字の名前のツール。",
    ],
    explanation: {
      summary:
        "`cron` (デーモン) + `crontab` (設定編集コマンド) で定期実行を設定。`分 時 日 月 曜 コマンド` の書式。",
      reason:
        "`crontab -e` で個人ユーザーの cron 編集。`* * * * * cmd` は毎分、`0 3 * * *` は毎日 3 時、`*/5 * * * *` は 5 分毎。Rails では whenever gem で Ruby DSL から crontab を生成可能。systemd-timer はモダンな代替。",
      codeExample:
        "# 編集\ncrontab -e\n\n# 例: 毎日 3 時にバックアップ\n0 3 * * * /usr/local/bin/backup.sh >> /var/log/backup.log 2>&1\n\n# 5 分ごと\n*/5 * * * * curl -s https://example.com/heartbeat\n\n# 確認\ncrontab -l\n\n# Rails の whenever gem (Gemfile)\ngem 'whenever', require: false\n\n# config/schedule.rb\nevery 1.day, at: '3:00 am' do\n  rake 'cleanup:old_records'\nend",
    },
  },
  {
    id: "cli-011",
    categoryId: "linux-cli",
    difficulty: "intermediate",
    type: "choice",
    question:
      "SSH 接続を切ってもバックグラウンドで処理を続けたい時のターミナル多重化ツールは？",
    choices: [
      "nohup-only",
      "remote-exec",
      "tmux / screen",
      "ssh-keep / bg-runner",
    ],
    answerIndex: 2,
    hints: [
      "1 つのターミナルセッションに複数のウィンドウ / 分割を持てます。",
      "切断しても detach 状態で生存、後で再 attach 可能。",
      "Vim ユーザーや開発者に人気の 2 つのツール (新しい方と古い方)。",
    ],
    explanation: {
      summary:
        "`tmux` (推奨) / `screen` (古典的) はターミナル多重化ツール。detach/attach で SSH 切断後も処理が継続。",
      reason:
        "本番サーバで長時間処理 (デプロイ、データ移行、データ取得) を走らせる時、SSH 切断で停止しないように使う。tmux: `tmux new -s session_name` で開始、`Ctrl-b d` で detach、`tmux attach -t session_name` で再接続。screen も同等機能。`nohup cmd &` は単発バックグラウンド実行で多重化機能はない。",
      codeExample:
        "# tmux\ntmux new -s deploy             # 新規セッション開始\ntmux ls                        # セッション一覧\ntmux attach -t deploy          # 再接続\n# Ctrl-b d  → detach (中断せず抜ける)\n# Ctrl-b %  → 縦分割\n# Ctrl-b \"  → 横分割\n# Ctrl-b c  → 新ウィンドウ\n# Ctrl-b ,  → ウィンドウ名変更\n\n# screen\nscreen -S deploy               # 新規\nscreen -r deploy               # 再接続\n# Ctrl-a d  → detach\n\n# 一回限りのバックグラウンド実行\nnohup ./long_running.sh &\ndisown                         # 親シェル終了でも継続",
    },
  },
  {
    id: "cli-012",
    categoryId: "linux-cli",
    difficulty: "intermediate",
    type: "choice",
    question:
      "API を JSON POST でテストする `curl` のオプション組み合わせは？",
    code: '# /users に { "name": "Alice" } を POST したい',
    choices: [
      "curl -auto -post users",
      "curl -X POST -H 'Content-Type: application/json' -d '{\"name\":\"Alice\"}' http://localhost:3000/users",
      "curl POST http://localhost:3000/users name=Alice",
      "curl -file users.json",
    ],
    answerIndex: 1,
    hints: [
      "-X で HTTP メソッド、-H でヘッダ、-d でボディ指定が curl の基本。",
      "JSON を送るには Content-Type ヘッダを明示しないとサーバーで認識されません。",
      "API 動作確認・スクリプト・CI で頻出の組み合わせ。",
    ],
    explanation: {
      summary:
        "`curl -X POST -H 'Content-Type: application/json' -d '{...}' URL` が JSON POST の定型。",
      reason:
        "`-X METHOD` (POST/PUT/DELETE)、`-H 'Header: value'` 複数指定可、`-d` でボディ (or `--data-raw`)、`-i` でレスポンスヘッダも、`-v` で詳細、`-s` でプログレス非表示、`-w '%{http_code}'` でステータスコード抽出。jq と組み合わせると最強。",
      codeExample:
        '# JSON POST\ncurl -X POST -H \'Content-Type: application/json\' \\\n  -d \'{"name":"Alice","email":"a@x"}\' \\\n  http://localhost:3000/users\n\n# Authorization ヘッダ追加\ncurl -X GET -H \'Authorization: Bearer abc123\' \\\n  https://api.example.com/me\n\n# レスポンス + ステータスコード\ncurl -s -o /dev/null -w \'%{http_code}\\n\' https://example.com\n\n# JSON ファイル送信\ncurl -X POST -H \'Content-Type: application/json\' \\\n  --data @payload.json \\\n  http://localhost:3000/users\n\n# jq でレスポンス整形\ncurl -s https://api.example.com/users | jq \'.[] | .name\'',
    },
  },
  {
    id: "cli-013",
    categoryId: "linux-cli",
    difficulty: "intermediate",
    type: "choice",
    question:
      "現在 LISTEN しているポート一覧を表示する現代的なコマンドは？",
    choices: [
      "lsof / ss どちらも使える",
      "ss -tlnp",
      "ps -listen",
      "netstat -tlnp (古い)",
    ],
    answerIndex: 0,
    hints: [
      "netstat は古く、現代は ss が推奨されますが両方使えます。",
      "lsof -i:PORT もポート別に強力。",
      "全てのオプションが正しい選択肢が最後にあります。",
    ],
    explanation: {
      summary:
        "現代は `ss -tlnp` (Sys Vinfra)、ポート単位なら `lsof -i:PORT`。netstat は古いが現役。",
      reason:
        "`ss -tlnp`: t=TCP、l=Listen、n=数値表示、p=プロセス情報。`-u` で UDP、`-a` で全状態。`lsof -i:3000` でそのポートを使うプロセス特定。`netstat -tlnp` は古いが多くの環境に残る。`ss -s` でソケットサマリ。",
      codeExample:
        "# ss (推奨)\nss -tlnp                       # TCP listen 一覧 + プロセス\nss -tlnp | grep 3000           # ポート 3000\nss -ulnp                       # UDP\nss -s                          # サマリ\n\n# lsof (ポート別)\nlsof -i:3000                   # ポート 3000 を使うプロセス\nlsof -i tcp:3000               # TCP のみ\nlsof -i -P -n | grep LISTEN    # 全 listen ポート\n\n# netstat (古いが現役)\nnetstat -tlnp                  # ss と同等\nnetstat -tulnp | grep nginx",
    },
  },
  {
    id: "cli-014",
    categoryId: "linux-cli",
    difficulty: "intermediate",
    type: "choice",
    question:
      "ローカルファイルをリモートサーバに転送するコマンドは？",
    choices: [
      "cp -remote local.tar",
      "ssh-copy local.tar",
      "scp local.tar user@host:/path/",
      "ftp -upload local.tar",
    ],
    answerIndex: 2,
    hints: [
      "ssh + cp の合成的なコマンド名で 3 文字。",
      "SSH 認証を使うので鍵があれば自動。",
      "ディレクトリは -r で再帰コピー。",
    ],
    explanation: {
      summary:
        "`scp` (Secure Copy) は SSH 経由でファイルを安全に転送するコマンド。`scp local user@host:remote` の形式。",
      reason:
        "rsync より単純、SSH 鍵で認証。`-r` 再帰、`-P` ポート、`-i` 鍵指定。大量ファイル / 差分転送には `rsync` が高速 (再開可能 + 差分のみ)。クラウドストレージなら `aws s3 cp` / `gsutil cp` が定番。",
      codeExample:
        "# ローカル → リモート\nscp local.tar.gz user@host:/tmp/\nscp -r ./mydir user@host:/var/www/\n\n# リモート → ローカル\nscp user@host:/etc/nginx/nginx.conf ./\n\n# ポート指定\nscp -P 2222 file user@host:~/\n\n# 鍵指定\nscp -i ~/.ssh/prod_key file user@host:~/\n\n# rsync (差分転送、推奨)\nrsync -avz ./mydir user@host:/var/www/\nrsync -avz --exclude='.git' ./ user@host:/var/www/myapp/\n\n# AWS S3\naws s3 cp local.tar.gz s3://my-bucket/backups/\naws s3 sync ./mydir s3://my-bucket/myapp/",
    },
  },
  {
    id: "cli-015",
    categoryId: "linux-cli",
    difficulty: "intermediate",
    type: "choice",
    question:
      "ファイル / ディレクトリの違いを見やすく比較する CLI は？",
    choices: [
      "delta -compare",
      "diff -u (or colordiff)",
      "compare -file",
      "match -files",
    ],
    answerIndex: 1,
    hints: [
      "標準ツールで unified diff 形式 (+/-) を出します。",
      "色付けには colordiff や diff-so-fancy / delta を組み合わせる。",
      "patch コマンドで適用可能な形式 (パッチファイル) を生成します。",
    ],
    explanation: {
      summary:
        "`diff -u file1 file2` (unified) でパッチ可能な差分。色付けは `colordiff` / `delta` を組み合わせる。",
      reason:
        "プログラマ標準。`-u` unified、`-r` ディレクトリ再帰比較。生成した差分は `patch` で適用可能。Git の diff はこれの拡張。`delta` (Rust 製) を入れると git diff の見た目が一気に良くなる。",
      codeExample:
        "# 基本\ndiff file1 file2                # 標準形式\ndiff -u file1 file2             # unified (パッチ可)\ndiff -r dir1 dir2               # ディレクトリ再帰\n\n# 色付き\ncolordiff -u file1 file2\ndiff -u file1 file2 | delta\n\n# パッチ作成 + 適用\ndiff -u original.rb new.rb > my.patch\npatch original.rb < my.patch\n\n# Git の delta 設定\n# ~/.gitconfig\n[core]\n    pager = delta\n[delta]\n    syntax-theme = Monokai Extended\n    line-numbers = true",
    },
  },
  {
    id: "cli-016",
    categoryId: "linux-cli",
    difficulty: "advanced",
    type: "choice",
    question:
      "本番サーバの『ネットワーク疎通だけ』を最速で確認する基本コマンド組み合わせは？",
    choices: [
      "Rails console で確認",
      "GUI でリモートデスクトップ",
      "Slack で同僚に聞く",
      "ping (ICMP) + curl/telnet/nc でポート疎通 + dig/nslookup で名前解決",
    ],
    answerIndex: 3,
    hints: [
      "3 つの異なるレイヤー (ネットワーク到達 / ポート / DNS) を別々に検証するのが定石。",
      "それぞれが正常で初めて『接続できる』と言える。",
      "障害切り分けの基本 (Layer 3 → 4 → 7 と上に上がる)。",
    ],
    explanation: {
      summary:
        "ネットワーク調査の三種の神器: ping (到達)、curl/nc (ポート/HTTP)、dig (DNS)。レイヤーを切り分けて原因特定。",
      reason:
        "『繋がらない』には複数原因: (1) ネットワーク不通 (ping 失敗)、(2) ファイアウォール / ポート閉 (ping 通るが curl 失敗)、(3) DNS 解決失敗 (IP 直接なら通るがドメイン名で失敗)、(4) アプリ不調 (HTTP 5xx)、(5) 証明書 (HTTPS 失敗)。順に切り分けることで原因特定が早い。",
      codeExample:
        "# 1. 到達性 (ICMP)\nping -c 4 example.com\n\n# 2. ポート疎通 (TCP)\nnc -zv example.com 443         # netcat\ntelnet example.com 443         # 古典的\ncurl -v https://example.com    # アプリレイヤー\n\n# 3. DNS\ndig example.com                # 詳細\ndig +short example.com         # IP のみ\nnslookup example.com           # シンプル\nhost example.com\n\n# 4. ルート追跡\ntraceroute example.com         # 経路\nmtr example.com                # 連続監視\n\n# 5. HTTPS 証明書\nopenssl s_client -connect example.com:443 -servername example.com",
    },
  },

  // ===========================================================================
  // 💎 Ruby 基礎 追加 (rb-031〜rb-050, 20問)
  // ===========================================================================
  {
    id: "rb-031",
    categoryId: "ruby-basics",
    difficulty: "beginner",
    type: "choice",
    question: "次のコードの出力は？",
    code: "puts 7 / 2\nputs 7.0 / 2\nputs 7 / 2.0",
    choices: ["3.5 / 3.5 / 3.5", "3 / 3 / 3", "3.5 / 3 / 3", "3 / 3.5 / 3.5"],
    answerIndex: 3,
    hints: [
      "整数同士の割り算と、片方が浮動小数の場合で挙動が変わります。",
      "Ruby は型強制を行わず、整数 / 整数 は整数のままです。",
      "片方でも Float が混ざると結果は Float に昇格します。",
    ],
    explanation: {
      summary:
        "整数同士の `/` は整数除算 (切り捨て)。片方が Float なら結果も Float。",
      reason:
        "Ruby の `Integer#/` は商の整数部分を返す (`7 / 2 = 3`)。片方を Float にすれば自動昇格して通常の除算。`fdiv` を使うと常に Float: `7.fdiv(2) = 3.5`。金額計算は BigDecimal を使う。",
      codeExample:
        "7 / 2          #=> 3\n7.fdiv(2)      #=> 3.5\n7 % 2          #=> 1\n7.divmod(2)    #=> [3, 1]\nRational(7, 2) #=> (7/2)",
    },
  },
  {
    id: "rb-032",
    categoryId: "ruby-basics",
    difficulty: "beginner",
    type: "choice",
    question: "Ruby の if 文は値を返す式。次のコードの a の値は？",
    code: "a = if 5 > 3 then 'big' else 'small' end",
    choices: ["'small'", "nil", "true", "'big'"],
    answerIndex: 3,
    hints: [
      "Ruby の制御構文は式 (値を返す)。",
      "5 > 3 は真なので then 側が評価されます。",
      "if/elsif/else のいずれかの最後に評価された値が返り値になります。",
    ],
    explanation: {
      summary:
        "Ruby の if は『式』なので値を返す。条件成立した分岐の最後の式が値。",
      reason:
        "C 系言語と違い、Ruby では if/case/while/begin も式。代入や引数に直接使える。条件を満たす分岐が無い (else 無しで偽) と nil。",
      codeExample:
        "a = if x.positive? then 'pos' else 'neg' end\nb = case role\n    when 'admin' then 10\n    else 0\n    end\nc = if false then 'yes' end   #=> nil",
    },
  },
  {
    id: "rb-033",
    categoryId: "ruby-basics",
    difficulty: "beginner",
    type: "choice",
    question: "`5.times { |i| puts i }` で出力される最後の数は？",
    choices: ["0", "5", "4", "6"],
    answerIndex: 2,
    hints: [
      "`n.times` は 0 から始まる。",
      "ループは n 回繰り返すので i は 0 〜 n-1。",
      "n 回繰り返すと最後の i は n - 1。",
    ],
    explanation: {
      summary: "`n.times` は 0..n-1 を yield する n 回ループ。",
      reason:
        "Integer#times は 0 以上 n 未満で n 回ブロックを実行。1 始まりや終端含めるなら `upto` / Range を使う。",
      codeExample:
        "5.times { |i| puts i }      # 0,1,2,3,4\n1.upto(5) { |i| puts i }    # 1,2,3,4,5\n5.downto(1) { |i| puts i }  # 5,4,3,2,1\nArray.new(5) { |i| i * 2 }  #=> [0, 2, 4, 6, 8]",
    },
  },
  {
    id: "rb-034",
    categoryId: "ruby-basics",
    difficulty: "beginner",
    type: "text",
    question:
      '文字列補間 `"x = #{val}"` で値を埋め込む時、val に対して自動で呼ばれるメソッド名は？',
    answers: ["to_s"],
    hints: [
      "Object クラスに定義されている文字列化メソッド。",
      "デバッグ用は inspect / to_s の対関係。",
      "戻り値が String であることが求められるメソッドで、3 文字の英字名。",
    ],
    explanation: {
      summary: "`#{}` 内では自動的に `to_s` が呼ばれて文字列化される。",
      reason:
        "Object#to_s が基本。各クラスで上書きされる (Integer→'42'、Array→'[1, 2]'、nil→'')。`p` や `inspect` は別物で、文字列もクォート付き表示。",
      codeExample:
        '"#{42}"            #=> "42"\n"#{[1, 2]}"        #=> "[1, 2]"\n"#{nil}"           #=> ""\n42.inspect         #=> "42"\nnil.inspect        #=> "nil"\nformat("x=%d", 42) #=> "x=42"',
    },
  },
  {
    id: "rb-035",
    categoryId: "ruby-basics",
    difficulty: "beginner",
    type: "choice",
    question: "次のうち、Ruby の三項演算子の正しい書き方は？",
    choices: [
      "x > 0 -> 'pos' : 'neg'",
      "x > 0 ? 'pos' : 'neg'",
      "x > 0 if 'pos' else 'neg'",
      "x > 0 ? 'pos' | 'neg'",
    ],
    answerIndex: 1,
    hints: [
      "C 言語スタイルの記法。",
      "`condition ? true_value : false_value` の形式。",
      "1 行で書ける if/else のショートカット。",
    ],
    explanation: {
      summary: "`condition ? then : else` が三項演算子。",
      reason:
        "短い分岐に最適。複雑なら if/else に書き直す。ネストはアンチパターン。",
      codeExample:
        "label = x.positive? ? 'pos' : 'neg'\nname  = user&.name || 'guest'\ngrade = case score\n        when 90.. then 'A'\n        when 80.. then 'B'\n        else 'C'\n        end",
    },
  },
  {
    id: "rb-036",
    categoryId: "ruby-basics",
    difficulty: "beginner",
    type: "choice",
    question: "次のコードの出力は？",
    code: 'arr = [1, 2, 3]\narr.each { |n| puts n }\nputs arr.length',
    choices: ["3", "[1, 2, 3] 3", "1 2 3 3", "1 2 3"],
    answerIndex: 2,
    hints: [
      "each は各要素を順に出力します。",
      "ループ後に length が表示されます。",
      "出力は 4 行 (要素 3 つ + length 1 つ)。",
    ],
    explanation: {
      summary:
        "each は各要素にブロックを実行しレシーバを返す。length は要素数。",
      reason:
        "puts n は 3 回呼ばれ 1, 2, 3。最後に length=3。each の戻り値は arr 自身。配列を変換したいなら map を使う。",
      codeExample:
        "[1, 2, 3].each { |n| puts n }\n[1, 2, 3].each_with_index { |n, i| puts \"#{i}: #{n}\" }\n[1, 2, 3].length    #=> 3\n[1, 2, 3].size      #=> 3 (length のエイリアス)\n[1, 2, 3].count     #=> 3",
    },
  },
  {
    id: "rb-037",
    categoryId: "ruby-basics",
    difficulty: "beginner",
    type: "choice",
    question: "次のコードの出力は？",
    code: 'name = "Alice"\nputs name.length\nputs name.reverse',
    choices: ["5 / ecilA", "5 / Alice", "Alice / Alice", "4 / Alice"],
    answerIndex: 0,
    hints: [
      "String#length は文字数。",
      "String#reverse は文字を逆順にした新しい文字列を返す。",
      "Alice は 5 文字、逆順は 'ecilA'。",
    ],
    explanation: {
      summary: "`length` で文字数、`reverse` で逆順の新しい文字列。",
      reason:
        "どちらも非破壊。破壊版 `reverse!` で元を書き換える。マルチバイトでは `length` は文字数、`bytesize` はバイト数。",
      codeExample:
        '"Alice".length     #=> 5\n"あいう".length    #=> 3\n"あいう".bytesize  #=> 9\n"hello".reverse    #=> "olleh"\n"hello".chars      #=> ["h","e","l","l","o"]',
    },
  },
  {
    id: "rb-038",
    categoryId: "ruby-basics",
    difficulty: "intermediate",
    type: "choice",
    question: "次のコードの出力は？",
    code: 'def greet(name)\n  return "hi" if name.nil?\n  "hello, #{name}"\nend\n\nputs greet(nil)\nputs greet("Alice")',
    choices: [
      "hi / hi",
      "hi / hello, Alice",
      "hello,  / hello, Alice",
      "nil / hello, Alice",
    ],
    answerIndex: 1,
    hints: [
      "後置 if は条件成立時のみ前の式を実行。",
      "name が nil なら return で早期復帰。",
      "Alice の場合は最終行が評価されて返る。",
    ],
    explanation: {
      summary: "`return X if cond` は早期復帰の定型 (Guard Clause)。",
      reason:
        "メソッド冒頭で例外パターンを return すると本体のネストが減って読みやすい。`raise` も同様に後置可。",
      codeExample:
        "def divide(a, b)\n  return 0 if b.zero?\n  raise ArgumentError, 'negative' if a < 0\n  a / b\nend\n\ndef create\n  return redirect_to(login_path) unless current_user\n  # 本体...\nend",
    },
  },
  {
    id: "rb-039",
    categoryId: "ruby-basics",
    difficulty: "intermediate",
    type: "choice",
    question: "次のコードの出力は？",
    code: 'arr = ["a", "b", "c"]\narr.each_with_index { |x, i| puts "#{i}:#{x}" }',
    choices: ["1:a 2:b 3:c", "a:0 b:1 c:2", "0:c 1:b 2:a", "0:a 1:b 2:c"],
    answerIndex: 3,
    hints: [
      "each_with_index は (要素, 0 始まりのインデックス) を渡す。",
      "ブロック引数の順は (要素, index)。",
      "0:a 1:b 2:c の出力になる。",
    ],
    explanation: {
      summary:
        "`each_with_index` のブロック引数は `(要素, インデックス)` の順 (0 始まり)。",
      reason:
        "`each.with_index(n)` で開始インデックスを変更可 (1 始まりなら `with_index(1)`)。`map.with_index` で変換版。",
      codeExample:
        '%w[a b c].each_with_index { |x, i| puts "#{i}:#{x}" }\n# 0:a 1:b 2:c\n%w[a b c].each.with_index(1) { |x, i| puts "#{i}.#{x}" }\n# 1.a 2.b 3.c',
    },
  },
  {
    id: "rb-040",
    categoryId: "ruby-basics",
    difficulty: "intermediate",
    type: "text",
    question:
      "文字列の一部を別の文字列に置換する非破壊的なメソッド名は？(英語1単語、3文字)",
    answers: ["sub", "gsub"],
    hints: [
      "sub は最初の 1 件、gsub は全件。",
      "正規表現も渡せる。",
      "substitute の略。",
    ],
    explanation: {
      summary:
        "`sub` (最初の1件のみ) / `gsub` (全件) で文字列置換。正規表現にも対応。",
      reason:
        "第2引数に文字列 or ブロック。キャプチャを使うなら `\\1` 形式。破壊版は `sub!` / `gsub!`。",
      codeExample:
        '"hello world".sub("world", "Ruby")   #=> "hello Ruby"\n"hello hello".gsub("hello", "hi")    #=> "hi hi"\n"abc123".gsub(/\\d+/, "X")           #=> "abcX"\n"2024-01-15".sub(/(\\d+)-(\\d+)-(\\d+)/, \'\\3/\\2/\\1\')\n#=> "15/01/2024"',
    },
  },
  {
    id: "rb-041",
    categoryId: "ruby-basics",
    difficulty: "intermediate",
    type: "choice",
    question: "Ruby で複数の値を一度に返したい時のイディオムは？",
    code: "def min_max(arr)\n  [arr.min, arr.max]\nend\n\nlo, hi = min_max([3, 1, 4, 1, 5])",
    choices: [
      "配列で返して『多重代入』で受け取る",
      "Hash で返す",
      "クラスを作る",
      "ポインタを渡す",
    ],
    answerIndex: 0,
    hints: [
      "Ruby は多値返却の専用構文は無いが、配列 + 多重代入で実現できる。",
      "`a, b = [1, 2]` のように複数変数に同時代入。",
      "標準ライブラリ (divmod など) もこのパターンを採用。",
    ],
    explanation: {
      summary:
        "配列で返して `a, b = ...` の多重代入が Ruby の慣用句。",
      reason:
        "`a, b, *rest = [1, 2, 3, 4]` で残りも捕捉。Hash 返却もフィールド名が文書化される利点あり。",
      codeExample:
        "lo, hi = min_max([3, 1, 4])\na, b, *rest = [1, 2, 3, 4, 5]      # rest = [3,4,5]\na, *mid, b = [1, 2, 3, 4]          # mid = [2,3]\n\ndef stats(arr)\n  { min: arr.min, max: arr.max }\nend",
    },
  },
  {
    id: "rb-042",
    categoryId: "ruby-basics",
    difficulty: "intermediate",
    type: "choice",
    question: "次のコードの出力は？",
    code: "h = { name: 'Alice', age: 20 }\nh.each { |k, v| puts \"#{k}=#{v}\" }",
    choices: [
      "name age",
      "name:Alice age:20",
      "name=Alice age=20",
      "Alice 20",
    ],
    answerIndex: 2,
    hints: [
      "Hash#each はキーと値をブロックに渡す。",
      "ブロック引数 `|k, v|` で分解。",
      "`#{k}=#{v}` で 'name=Alice' のように出力。",
    ],
    explanation: {
      summary:
        "`Hash#each` はブロック引数 `|key, value|` で各要素を yield。",
      reason:
        "`each_pair` も同じ。`each_key` / `each_value` で片方。Ruby 1.9+ は順序保持 (挿入順)。",
      codeExample:
        "h.each_key   { |k| puts k }\nh.each_value { |v| puts v }\nh.select { |_, v| v.is_a?(String) }\nh.transform_values { |v| v.to_s }\nh.transform_keys(&:to_s)",
    },
  },
  {
    id: "rb-043",
    categoryId: "ruby-basics",
    difficulty: "intermediate",
    type: "choice",
    question: "次のコードの出力は？",
    code: 'puts "ruby".include?("ub")\nputs "ruby".start_with?("ru")\nputs "ruby".end_with?("by")',
    choices: [
      "true / false / true",
      "false / true / true",
      "true / true / false",
      "true / true / true",
    ],
    answerIndex: 3,
    hints: [
      "3 つとも文字列の包含チェック。",
      "include? は部分一致、start_with? は先頭、end_with? は末尾。",
      "ruby に ub を含む、ru で始まる、by で終わるのですべて true。",
    ],
    explanation: {
      summary:
        "include? / start_with? / end_with? は文字列の包含・前方一致・後方一致。",
      reason:
        "`start_with?` / `end_with?` は複数引数を取れる (OR)。正規表現で書く前にこちらで済むなら速くて読みやすい。",
      codeExample:
        '"hello.rb".end_with?(".rb", ".py")  #=> true\n"https://x".start_with?("http")     #=> true\n"ruby".match?(/^ru/)                #=> true',
    },
  },
  {
    id: "rb-044",
    categoryId: "ruby-basics",
    difficulty: "intermediate",
    type: "choice",
    question: "Ruby で `protected` メソッドの特徴として正しいのは？",
    choices: [
      "同じクラス・サブクラスの他インスタンスからレシーバ付きで呼べる",
      "外部から完全に隠蔽される",
      "クラスメソッドからのみ呼べる",
      "サブクラスからは呼べない",
    ],
    answerIndex: 0,
    hints: [
      "private より少し緩い可視性。",
      "比較メソッド (==/<=>) で対向オブジェクトのフィールドを覗くのに使われる。",
      "同クラス・サブクラスの『他インスタンス』から呼べる点が key。",
    ],
    explanation: {
      summary:
        "`protected` は同一クラス (or サブクラス) の他インスタンスからレシーバ付きで呼べる。",
      reason:
        "比較メソッドで便利。`def >(other); score > other.score; end` の `other.score` は private だと NG、protected なら OK。",
      codeExample:
        "class User\n  def initialize(score); @score = score; end\n\n  def >(other)\n    score > other.score\n  end\n\n  protected\n\n  def score; @score; end\nend",
    },
  },
  {
    id: "rb-045",
    categoryId: "ruby-basics",
    difficulty: "intermediate",
    type: "choice",
    question: "次のコードの出力は？",
    code: "h = Hash.new { |hash, key| hash[key] = [] }\nh[:a] << 1\nh[:a] << 2\nh[:b] << 3\np h",
    choices: [
      "{a: 1, b: 3}",
      "{}",
      "{a: [1, 2], b: [3]}",
      "{a: [1, 2, 3]}",
    ],
    answerIndex: 2,
    hints: [
      "Hash.new にブロックを渡すと『未定義キーアクセス時の挙動』を定義できる。",
      "ブロックはキー毎に呼ばれ、ここでは空配列をセットして返している。",
      "各キーが独立した配列を持つので、a と b は別配列。",
    ],
    explanation: {
      summary:
        "`Hash.new { |h, k| h[k] = [] }` でキー毎に独立した空配列を初期化するイディオム。",
      reason:
        "`Hash.new([])` だと全キーが同じ配列を共有してしまう。ブロック付きにすると毎回新しい配列を作って格納。グループ化や頻度カウントで頻出。",
      codeExample:
        "count = Hash.new(0)\n%w[a b a].each { |w| count[w] += 1 }\ncount  #=> {'a'=>2, 'b'=>1}",
      commonMistakes: [
        "`Hash.new([])` は全キーが同じ配列を共有する罠 → ブロック版を使う。",
      ],
    },
  },
  {
    id: "rb-046",
    categoryId: "ruby-basics",
    difficulty: "intermediate",
    type: "choice",
    question:
      "Ruby で『現在の例外オブジェクト』を rescue 句内で参照する書き方は？",
    choices: ["rescue (e)", "rescue with e", "rescue e", "rescue => e"],
    answerIndex: 3,
    hints: [
      "矢印 => で受け取る。",
      "クラスを限定するなら `rescue StandardError => e`、デフォルトは省略可。",
      "Hash の値受けと似た記法。",
    ],
    explanation: {
      summary: "`rescue => e` で StandardError 以下を捕捉し変数 e に格納。",
      reason:
        "`e.message` でメッセージ、`e.backtrace` でスタック、`e.class` でクラス、`e.cause` で原因例外。",
      codeExample:
        "begin\n  Integer('x')\nrescue ArgumentError => e\n  puts e.message\n  puts e.class\nrescue => e\nend",
    },
  },
  {
    id: "rb-047",
    categoryId: "ruby-basics",
    difficulty: "advanced",
    type: "choice",
    question: "次のコードの出力は？",
    code: "[1, 2, 3].lazy.map { |n| puts \"map #{n}\"; n * 2 }.first(2)",
    choices: [
      "Enumerator を返す",
      "map 1 / map 2 を出力して [2, 4]",
      "map 1〜3 すべて出力して [2, 4]",
      "何も出力せず [2, 4]",
    ],
    answerIndex: 1,
    hints: [
      "lazy はチェーンを遅延評価にする。",
      "first(2) は必要な分だけ map を実行。",
      "3 つ目の要素までは触らない。",
    ],
    explanation: {
      summary:
        "`Enumerable#lazy` で遅延評価に変換。必要な分だけ計算される。",
      reason:
        "巨大配列・無限列で重宝。終端メソッド (first/take/to_a 等) を呼ぶまで実行されない。",
      codeExample:
        "(1..).lazy.map { |n| n * n }.select { |n| n > 50 }.first(3)\n\nfibs = Enumerator.new do |y|\n  a, b = 0, 1\n  loop { y << a; a, b = b, a + b }\nend\nfibs.lazy.first(10)",
    },
  },
  {
    id: "rb-048",
    categoryId: "ruby-basics",
    difficulty: "advanced",
    type: "choice",
    question: "次のコードの出力は？",
    code: 'f = "hi"\nputs f.frozen?\nf.freeze\nputs f.frozen?',
    choices: [
      "false / true",
      "true / true",
      "false / false",
      "true / false",
    ],
    answerIndex: 0,
    hints: [
      "代入されただけの文字列は frozen ではない。",
      "freeze を明示的に呼ぶと frozen になる。",
      "通常 false → freeze 後 true。",
    ],
    explanation: {
      summary:
        "`.freeze` で凍結したオブジェクトは frozen? が true。普通の代入では false。",
      reason:
        "frozen object は変更不可。`# frozen_string_literal: true` で全文字列リテラル自動 freeze。Symbol は元から frozen。",
      codeExample:
        '"hi".frozen?           #=> false\n"hi".freeze.frozen?    #=> true\n:hello.frozen?         #=> true\n[1,2,3].freeze.push(4) # FrozenError',
    },
  },
  {
    id: "rb-049",
    categoryId: "ruby-basics",
    difficulty: "advanced",
    type: "text",
    question:
      "Ruby で『大きな整数を 1_000_000 のようにアンダースコア区切りで書ける』機能の名称は？(カタカナ または 英語)",
    answers: [
      "桁区切り",
      "アンダースコア区切り",
      "numeric separator",
      "数値リテラルセパレータ",
      "リテラルセパレータ",
      "underscore separator",
    ],
    hints: [
      "可読性を上げるための、数値リテラル内の記号。",
      "実行時には無視される (1_000_000 == 1000000)。",
      "Python / Java / JS ES2021 でも採用。",
    ],
    explanation: {
      summary:
        "数値リテラル内の `_` は無視される桁区切り。可読性向上のための機能。",
      reason:
        "`1_000_000` と書いても評価は `1000000`。負の数や Float、16 進数でも有効。多言語で採用。",
      codeExample:
        "1_000_000          #=> 1000000\n10_000.99          #=> 10000.99\n0xFF_FF_FF         #=> 16777215\nyearly = 4_800_000",
    },
  },
  {
    id: "rb-050",
    categoryId: "ruby-basics",
    difficulty: "advanced",
    type: "choice",
    question: "次のコードの出力は？",
    code: 'a = [1, 2]\nb = [1, 2]\nputs a == b\nputs a.equal?(b)\nputs a.eql?(b)',
    choices: [
      "true / false / true",
      "true / true / true",
      "false / false / false",
      "true / false / false",
    ],
    answerIndex: 0,
    hints: [
      "==: 内容比較 → 同じ。",
      "equal?: object_id 比較 → 別オブジェクト = false。",
      "eql?: Array は内容比較 (型厳密)、同じ整数なので true。",
    ],
    explanation: {
      summary:
        "Array では `==` も `eql?` も内容比較で true、`equal?` のみ object_id 比較で false。",
      reason:
        "`equal?` は『同一オブジェクトか』、`==` は『緩い等価』、`eql?` は『型を含む厳密等価 (Hash キーで使用)』。`[1] == [1.0]` は true だが `[1].eql?([1.0])` は false。",
      codeExample:
        "[1, 2].equal?([1, 2])   #=> false\n[1, 2] == [1, 2]        #=> true\n[1] == [1.0]            #=> true\n[1].eql?([1.0])         #=> false",
    },
  },

  // ===========================================================================
  // 📦 コレクション 追加 (col-017〜col-036, 20問)
  // ===========================================================================
  {
    id: "col-017",
    categoryId: "collections",
    difficulty: "beginner",
    type: "choice",
    question: "次のコードの出力は？",
    code: "puts [1, 2, 3, 4, 5].first(3).inspect",
    choices: [
      "[1, 2, 3, 4, 5]",
      "[1, 2, 3]",
      "[3, 4, 5]",
      "[1]",
    ],
    answerIndex: 1,
    hints: [
      "first(n) は配列の先頭 n 個を返す。",
      "対義語は last(n) で末尾 n 個。",
      "n を省略すると要素 1 つだけを返す (配列ではない)。",
    ],
    explanation: {
      summary: "`first(n)` / `last(n)` で先頭・末尾 n 個を取得。",
      reason:
        "`first` (引数なし) は要素 1 つ、`first(n)` は配列。`take(n)` / `drop(n)` で取得 / 除外。Range スライス `arr[0..2]` も同等。",
      codeExample:
        "[1,2,3,4,5].first      #=> 1\n[1,2,3,4,5].first(3)   #=> [1, 2, 3]\n[1,2,3,4,5].last(2)    #=> [4, 5]\n[1,2,3,4,5].take(3)    #=> [1, 2, 3]\n[1,2,3,4,5].drop(3)    #=> [4, 5]\n[1,2,3,4,5][0..2]      #=> [1, 2, 3]",
    },
  },
  {
    id: "col-018",
    categoryId: "collections",
    difficulty: "beginner",
    type: "choice",
    question: "次のコードの出力は？",
    code: "[1, 2, 3, nil, 4, nil].compact",
    choices: [
      "[1, 2, 3, 4]",
      "[1, 2, 3, nil, 4, nil]",
      "[]",
      "[nil, nil]",
    ],
    answerIndex: 0,
    hints: [
      "compact は配列から nil を全て除去。",
      "圧縮 (compact) するイメージ。",
      "破壊版 compact! もある。",
    ],
    explanation: {
      summary: "`Array#compact` は配列から nil 要素を除去した新しい配列を返す。",
      reason:
        "API レスポンスや map の結果に混じる nil を除去するのに便利。`reject(&:nil?)` と同じ。Hash 版は `Hash#compact` で値が nil のキーを除去。",
      codeExample:
        "[1, nil, 2, nil].compact          #=> [1, 2]\n[nil, nil].compact                #=> []\n\n# Hash 版 (Ruby 2.4+)\n{ a: 1, b: nil, c: 3 }.compact    #=> {a: 1, c: 3}\n\n# 破壊版\narr = [1, nil, 2]\narr.compact!\narr                               #=> [1, 2]\n\n# 関連: filter_map で nil を自動除去 (Ruby 2.7+)\n[1,2,3,4].filter_map { |n| n * 2 if n.even? }\n#=> [4, 8]",
    },
  },
  {
    id: "col-019",
    categoryId: "collections",
    difficulty: "beginner",
    type: "choice",
    question: "次のコードの出力は？",
    code: "[1, 2, 3].push(4, 5)",
    choices: [
      "TypeError",
      "[1, 2, 3, 4, 5]",
      "[1, 2, 3]",
      "[4, 5]",
    ],
    answerIndex: 1,
    hints: [
      "push は配列末尾に要素を追加する破壊的メソッド。",
      "複数引数を渡せる (一度に複数追加)。",
      "対義語は pop / shift / unshift。",
    ],
    explanation: {
      summary:
        "`push` は配列末尾に要素を追加 (破壊的)。`<<` の多引数版。",
      reason:
        "`push(a, b, c)` で複数を一度に。対は `pop` (末尾削除)、`unshift` (先頭追加)、`shift` (先頭削除)。これでスタック / キューが作れる。",
      codeExample:
        "arr = [1, 2, 3]\narr.push(4, 5)         # [1,2,3,4,5]\narr << 6               # [1,2,3,4,5,6] (push と同義、単一)\narr.pop                # 6, arr = [1,2,3,4,5]\narr.shift              # 1, arr = [2,3,4,5]\narr.unshift(0)         # [0,2,3,4,5]\n\n# スタック (LIFO)\nstack = []\nstack.push(1); stack.push(2); stack.pop   #=> 2\n\n# キュー (FIFO)\nqueue = []\nqueue.push(1); queue.push(2); queue.shift #=> 1",
    },
  },
  {
    id: "col-020",
    categoryId: "collections",
    difficulty: "beginner",
    type: "text",
    question:
      "配列の重複を除去するメソッド名は？(英語1単語、英字 4 文字、語幹は 'unique')",
    answers: ["uniq"],
    hints: [
      "unique を 4 文字に縮めた名前。",
      "順序を保ったまま重複除去。",
      "破壊版は末尾に ! を付ける。",
    ],
    explanation: {
      summary: "`Array#uniq` は重複を除去した新しい配列を返す。順序は保たれる。",
      reason:
        "重複判定は `eql?` と `hash`。ブロックを渡せば比較キーをカスタマイズ可。Set クラスを使うともっと高速だが、`uniq` の方が標準的。",
      codeExample:
        "[1, 2, 2, 3, 1].uniq          #=> [1, 2, 3]\n%w[a b A B].uniq               #=> ['a','b','A','B']\n%w[a b A B].uniq(&:downcase)   #=> ['a','b'] (小文字でユニーク化)\n\n# Hash で重複判定\nusers.uniq { |u| u[:email] }\n\n# 集合演算 (Array)\n[1,2,3] & [2,3,4]              #=> [2, 3] (積)\n[1,2,3] | [2,3,4]              #=> [1, 2, 3, 4] (和、自動 uniq)\n[1,2,3] - [2, 4]               #=> [1, 3] (差)",
    },
  },
  {
    id: "col-021",
    categoryId: "collections",
    difficulty: "intermediate",
    type: "choice",
    question: "次のコードの出力は？",
    code: "h1 = { a: 1, b: 2 }\nh2 = { b: 3, c: 4 }\np h1.merge(h2)",
    choices: [
      "{a: 1, b: 2, b: 3, c: 4}",
      "TypeError",
      "{a: 1, b: 3, c: 4}",
      "{a: 1, b: 2, c: 4}",
    ],
    answerIndex: 2,
    hints: [
      "merge は 2 つの Hash を合体させる。",
      "同じキーは『右側 (引数側)』が優先される。",
      "破壊版は merge!。",
    ],
    explanation: {
      summary:
        "`Hash#merge` は新 Hash を返す。同一キーは引数 (右) の値で上書き。",
      reason:
        "ブロックでマージロジックをカスタマイズ可: `h1.merge(h2) { |k, v1, v2| v1 + v2 }` で衝突時の合算。`merge!` で破壊的、`reverse_merge` (Rails) で逆優先 (デフォルト値設定に便利)。",
      codeExample:
        "{ a: 1 }.merge(b: 2)                  #=> {a: 1, b: 2}\n{ a: 1, b: 2 }.merge(b: 3)            #=> {a: 1, b: 3}\n{ a: 1 }.merge({ a: 2 }) { |k, v1, v2| v1 + v2 }\n#=> {a: 3}\n\n# Rails: reverse_merge (デフォルト値)\noptions = { format: :json }.reverse_merge(format: :html, locale: :ja)\n#=> {format: :json, locale: :ja}",
    },
  },
  {
    id: "col-022",
    categoryId: "collections",
    difficulty: "intermediate",
    type: "choice",
    question: "次のコードの出力は？",
    code: "[1, 2, 3, 4].partition { |n| n.even? }",
    choices: [
      "[[1, 3], [2, 4]]",
      "[[2, 4]]",
      "[1, 2, 3, 4]",
      "[[2, 4], [1, 3]]",
    ],
    answerIndex: 3,
    hints: [
      "partition は 1 回の走査で『条件に合う / 合わない』を 2 つの配列に分ける。",
      "結果は 2 要素の配列 (1 つ目が条件成立、2 つ目が不成立)。",
      "select + reject を 1 回でやる感じ。",
    ],
    explanation: {
      summary:
        "`partition` は条件成立 / 不成立で配列を 2 分割。`[成立, 不成立]` の形。",
      reason:
        "`select + reject` を 1 回の走査で実現するので効率的。多重代入と組み合わせて `evens, odds = arr.partition(&:even?)` のように書ける。`chunk` (連続する同条件をグルーピング) と用途が違う。",
      codeExample:
        "evens, odds = [1, 2, 3, 4, 5].partition(&:even?)\nevens   #=> [2, 4]\nodds    #=> [1, 3, 5]\n\n# Hash 版\nadults, minors = users.partition { |u| u.age >= 18 }\n\n# chunk (連続する同条件)\n[1, 1, 2, 2, 1].chunk(&:itself).to_a\n#=> [[1, [1, 1]], [2, [2, 2]], [1, [1]]]",
    },
  },
  {
    id: "col-023",
    categoryId: "collections",
    difficulty: "intermediate",
    type: "choice",
    question: "次のコードの出力は？",
    code: "[1, 2, 3].zip([10, 20, 30], [100, 200, 300])",
    choices: [
      "[[1, 10, 100], [2, 20, 200], [3, 30, 300]]",
      "[1, 2, 3, 10, 20, 30, 100, 200, 300]",
      "[[1, 2, 3], [10, 20, 30], [100, 200, 300]]",
      "TypeError",
    ],
    answerIndex: 0,
    hints: [
      "zip は要素ごとにペアにする。",
      "複数配列を渡すと『N要素のグループ』に。",
      "長さが違うと短い方で nil パディング。",
    ],
    explanation: {
      summary:
        "`zip` は要素ごとに『縦に揃えて配列の配列を作る』。複数引数も可。",
      reason:
        "DB の複数カラム結合、CSV のような行作成で頻出。`to_h` と組み合わせて `keys.zip(values).to_h` のイディオムが定番。長さ不一致なら短い方は nil。",
      codeExample:
        "[1, 2, 3].zip([10, 20, 30])\n#=> [[1, 10], [2, 20], [3, 30]]\n\n[1, 2, 3].zip([10, 20])           # 不足分は nil\n#=> [[1, 10], [2, 20], [3, nil]]\n\n# キー・値ペアから Hash\n[:a, :b, :c].zip([1, 2, 3]).to_h\n#=> {a: 1, b: 2, c: 3}",
    },
  },
  {
    id: "col-024",
    categoryId: "collections",
    difficulty: "intermediate",
    type: "choice",
    question: "次のコードの出力は？",
    code: "[1, 2, 3, 4, 5].any? { |n| n > 4 }\n[1, 2, 3, 4, 5].all? { |n| n > 0 }\n[1, 2, 3, 4, 5].none? { |n| n > 10 }",
    choices: [
      "true / true / true",
      "true / true / false",
      "false / false / true",
      "true / false / false",
    ],
    answerIndex: 0,
    hints: [
      "any? 1 つでも該当があれば true。",
      "all? 全要素が該当すれば true。",
      "none? 全く該当しなければ true。",
    ],
    explanation: {
      summary:
        "any? (一つでも) / all? (全て) / none? (誰も) / one? (ちょうど 1 つ) で集合判定。",
      reason:
        "Enumerable の述語メソッド。空配列に対しては all? は true (vacuous truth)、any? は false。`each.with_index.any?` のように index と組み合わせも可。",
      codeExample:
        "[1, 2, 3].any? { |n| n.even? }    #=> true\n[1, 2, 3].all? { |n| n > 0 }      #=> true\n[1, 2, 3].none? { |n| n > 5 }     #=> true\n[1, 2, 3].one? { |n| n == 2 }     #=> true\n[].all? { |n| n > 0 }             #=> true (空は all? が true)\n[].any?                            #=> false",
    },
  },
  {
    id: "col-025",
    categoryId: "collections",
    difficulty: "intermediate",
    type: "text",
    question:
      "Ruby 2.7+ で導入された、Array の各要素にブロックを適用し、結果が truthy な値だけを集めるメソッドは？(snake_case)",
    answers: ["filter_map"],
    hints: [
      "filter (= select) + map を 1 メソッドにまとめた名前。",
      "ブロックが nil/false を返した要素は結果に含まれない。",
      "`arr.map { ... }.compact` を 1 行で書けるイディオム。",
    ],
    explanation: {
      summary:
        "`filter_map` は map + 真偽フィルタを 1 度の走査で行う (Ruby 2.7+)。",
      reason:
        "`arr.map { ... }.compact` / `arr.select { ... }.map { ... }` の 2 段を 1 段にまとめる。パフォーマンス・可読性ともに改善。",
      codeExample:
        "[1, 2, 3, 4].filter_map { |n| n * 2 if n.even? }\n#=> [4, 8]\n\n[\"\", \"hi\", \"\", \"hello\"].filter_map { |s| s if !s.empty? }\n#=> ['hi', 'hello']\n\n# 旧式の書き方 (同等)\n[1,2,3,4].select(&:even?).map { |n| n * 2 }   #=> [4, 8]\n[1,2,3,4].map { |n| n * 2 if n.even? }.compact #=> [4, 8]",
    },
  },
  {
    id: "col-026",
    categoryId: "collections",
    difficulty: "intermediate",
    type: "choice",
    question: "次のコードの出力は？",
    code: "(1..5).step(2).to_a",
    choices: [
      "[1, 3, 5, 7]",
      "[1, 3, 5]",
      "[1, 2, 3, 4, 5]",
      "[2, 4]",
    ],
    answerIndex: 1,
    hints: [
      "Range#step は指定間隔で要素を取り出す。",
      "Ruby の step は開始値を含む。",
      "1 から 5 まで 2 刻みなので 1, 3, 5。",
    ],
    explanation: {
      summary: "`Range#step(n)` で n 刻みのイテレータを生成。",
      reason:
        "Integer 同士なら整数刻み、Float も可。文字列範囲 ('a'..'z').step(2) も使える。`Numeric#step` は単独でも使える: `1.step(10, 2) { ... }`。",
      codeExample:
        "(1..10).step(2).to_a          #=> [1, 3, 5, 7, 9]\n(1.0..2.0).step(0.5).to_a     #=> [1.0, 1.5, 2.0]\n1.step(10, 2) { |i| puts i }  # 1, 3, 5, 7, 9\n100.step(0, -10).to_a         #=> [100, 90, ..., 0]",
    },
  },
  {
    id: "col-027",
    categoryId: "collections",
    difficulty: "intermediate",
    type: "choice",
    question:
      "次のうち、Hash のキーを Symbol → String に一括変換するメソッドは？",
    choices: [
      "stringify_all",
      "convert_to_string",
      "to_s_keys",
      "transform_keys(&:to_s)",
    ],
    answerIndex: 3,
    hints: [
      "Hash#transform_keys はキーを変換する関数。",
      "ブロックで変換ロジックを渡す。",
      "`&:to_s` で各キーに `to_s` を適用するシンボル to_proc イディオム。",
    ],
    explanation: {
      summary:
        "`transform_keys(&:to_s)` で全キーを Symbol → String に変換。Hash 版は Ruby 2.5+。",
      reason:
        "`transform_values` でも値を一括変換。Rails の `stringify_keys` / `symbolize_keys` は ActiveSupport 拡張で同等の機能。Hash の Stringify は JSON 化の前処理で頻出。",
      codeExample:
        "{ a: 1, b: 2 }.transform_keys(&:to_s)\n#=> {'a' => 1, 'b' => 2}\n\n{ a: 1, b: 2 }.transform_values { |v| v * 10 }\n#=> {a: 10, b: 20}\n\n# Rails / ActiveSupport\n{ a: 1 }.stringify_keys           #=> {'a' => 1}\n{ 'a' => 1 }.symbolize_keys       #=> {a: 1}\n{ a: 1 }.deep_stringify_keys      # ネストも変換",
    },
  },
  {
    id: "col-028",
    categoryId: "collections",
    difficulty: "intermediate",
    type: "choice",
    question: "次のコードの出力は？",
    code: "['apple', 'banana', 'cherry'].tally",
    choices: [
      '["apple", "banana", "cherry"]',
      "3",
      '{"a"=>1, "b"=>1, "c"=>1}',
      '{"apple"=>1, "banana"=>1, "cherry"=>1}',
    ],
    answerIndex: 3,
    hints: [
      "Ruby 2.7+ の Enumerable メソッド。",
      "各要素の出現回数を Hash で返す。",
      "頻度カウントのワンライナー。",
    ],
    explanation: {
      summary:
        "`tally` は要素の出現回数を Hash で返す (Ruby 2.7+)。",
      reason:
        "頻度カウントの最短記法。従来は `each_with_object(Hash.new(0)) { |w, h| h[w] += 1 }` のように書いていた。`group_by(&:itself).transform_values(&:count)` でも同等。`tally_by` で変換キーで集計 (Ruby 3.1+)。",
      codeExample:
        "%w[a b a c a b].tally\n#=> {'a'=>3, 'b'=>2, 'c'=>1}\n\n# 文字数で集計 (Ruby 3.1+)\n%w[apple banana cherry].tally_by(&:length)\n#=> {5=>['apple'], 6=>['banana', 'cherry']}\n\n# 旧式\n%w[a b a].each_with_object(Hash.new(0)) { |w, h| h[w] += 1 }",
    },
  },
  {
    id: "col-029",
    categoryId: "collections",
    difficulty: "intermediate",
    type: "choice",
    question: "次のコードの出力は？",
    code: "[3, 1, 4, 1, 5].sort\n[3, 1, 4, 1, 5].sort.reverse\n[3, 1, 4, 1, 5].sort { |a, b| b <=> a }",
    choices: [
      "[3,1,4,1,5] / [5,1,4,1,3] / [1,1,3,4,5]",
      "全部 [1,1,3,4,5]",
      "[1,1,3,4,5] / [5,4,3,1,1] / [5,4,3,1,1]",
      "[1,1,3,4,5] / [1,1,3,4,5] / [5,4,3,1,1]",
    ],
    answerIndex: 2,
    hints: [
      "sort はデフォルトで昇順 (<=>)。",
      "降順は reverse 後 or ブロックで `b <=> a`。",
      "1 行目 = 昇順、2 行目 / 3 行目はどちらも降順 (同じ結果)。",
    ],
    explanation: {
      summary:
        "`sort` (引数なし) は <=> で昇順。降順は reverse か `b <=> a` ブロックで。",
      reason:
        "`sort` は破壊的でない (新配列)。`sort_by { |x| x }` は同等だがブロック評価コストが違う。降順の慣用句は `sort_by { |x| -x }` (符号反転) も。",
      codeExample:
        "[3, 1, 4].sort                #=> [1, 3, 4]\n[3, 1, 4].sort.reverse        #=> [4, 3, 1]\n[3, 1, 4].sort { |a, b| b <=> a }   #=> [4, 3, 1]\n\nusers.sort_by { |u| -u.score }      # 降順\nusers.sort_by { |u| [u.role, u.name] }  # 複数キー",
    },
  },
  {
    id: "col-030",
    categoryId: "collections",
    difficulty: "intermediate",
    type: "choice",
    question: "次のコードの出力は？",
    code: "h = { name: 'Alice', age: 20, role: 'admin' }\nh.values_at(:name, :role)",
    choices: [
      '{name: "Alice", role: "admin"}',
      "TypeError",
      '["Alice", "admin"]',
      '["Alice", "admin", 20]',
    ],
    answerIndex: 2,
    hints: [
      "values_at は複数キーの値を配列で取得。",
      "Hash と Array 両方にある。",
      "結果は配列 (Hash ではない)。",
    ],
    explanation: {
      summary:
        "`values_at(*keys)` は複数キーの値を配列で取得 (Hash/Array 共通)。",
      reason:
        "複数キーの一括取得 + 多重代入で取り出すのが慣用句。`slice` は Hash 部分集合を Hash で返す (Ruby 2.5+)。",
      codeExample:
        "h.values_at(:name, :role)        #=> ['Alice', 'admin']\nname, role = h.values_at(:name, :role)\n\n[10, 20, 30, 40].values_at(0, 2, -1)   #=> [10, 30, 40]\n\n# slice は Hash で返す\nh.slice(:name, :role)            #=> {name: 'Alice', role: 'admin'}\nh.except(:age)                   #=> {name: 'Alice', role: 'admin'}",
    },
  },
  {
    id: "col-031",
    categoryId: "collections",
    difficulty: "intermediate",
    type: "choice",
    question: "次のコードの出力は？",
    code: "[1, 2, 3].cycle(2) { |n| print n }",
    choices: [
      "1 2 3 (改行)",
      "123123",
      "111222333",
      "123",
    ],
    answerIndex: 1,
    hints: [
      "cycle は配列を繰り返す。",
      "引数なしは無限ループ (Ctrl-C 必要)。",
      "cycle(2) は 2 周分繰り返す。",
    ],
    explanation: {
      summary:
        "`Array#cycle(n)` は配列を n 周繰り返してブロック実行。引数なしは無限。",
      reason:
        "ローテーション処理、テーブルの行背景色交互 (`%w[odd even].cycle(rows)`)、無限ストリームのテスト等で便利。",
      codeExample:
        "%w[a b c].cycle(2) { |x| print x }   # ababca?\n#=> a b c a b c → 'abcabc'\n\n# 無限 (危険、注意)\n# %w[a b].cycle { |x| puts x }\n\n# 行の交互スタイル\nrows.each_with_index do |row, i|\n  bg = ['#fff', '#eee'][i % 2]\nend",
    },
  },
  {
    id: "col-032",
    categoryId: "collections",
    difficulty: "intermediate",
    type: "text",
    question:
      "重複を許さない集合を扱うために require して使う Ruby の標準クラスは？(英語1単語、4文字)",
    answers: ["Set", "set"],
    hints: [
      "Ruby 3.2+ では require 不要で使える。",
      "和集合 |、積集合 &、差集合 - などの演算が可能。",
      "Array より重複チェックが速い (内部 Hash 実装)。",
    ],
    explanation: {
      summary:
        "`Set` は重複を許さない順序なしコレクション。Ruby 3.2+ は require 不要。",
      reason:
        "include? の判定が Array (O(n)) より高速 (O(1))。集合演算 (積/和/差) も自然。順序を保ちたいなら Array#uniq、頻繁に存在チェックするなら Set。",
      codeExample:
        "require 'set'      # Ruby 3.2+ は不要\n\ns = Set[1, 2, 3]\ns.add(4)            #=> #<Set: {1,2,3,4}>\ns.include?(2)       #=> true\n\n# 集合演算\nSet[1,2,3] | Set[3,4]    #=> {1,2,3,4} (和)\nSet[1,2,3] & Set[2,3,4]  #=> {2,3} (積)\nSet[1,2,3] - Set[2]      #=> {1,3} (差)\n\n# Array から変換\n[1,2,3,1].to_set         #=> {1,2,3}",
    },
  },
  {
    id: "col-033",
    categoryId: "collections",
    difficulty: "advanced",
    type: "choice",
    question: "次のコードの出力は？",
    code: "[1, 2, 3].combination(2).to_a",
    choices: [
      "[[1, 2], [1, 3], [2, 3]]",
      "[[1, 2], [2, 1], [1, 3], [3, 1], [2, 3], [3, 2]]",
      "[1, 2, 3]",
      "[[1], [2], [3]]",
    ],
    answerIndex: 0,
    hints: [
      "combination は順序を区別しない『組合せ』。",
      "permutation は順序を区別する『順列』。",
      "[1,2,3] から 2 つ選ぶ組合せは 3 通り。",
    ],
    explanation: {
      summary:
        "`combination(n)` は順序無視の n 個選び。`permutation(n)` は順序ありの n 個並べ。",
      reason:
        "数学の組合せ・順列。`product` は複数配列のデカルト積。`repeated_combination` / `repeated_permutation` は重複を許す版。",
      codeExample:
        "[1,2,3].combination(2).to_a\n#=> [[1,2], [1,3], [2,3]]\n\n[1,2,3].permutation(2).to_a\n#=> [[1,2], [1,3], [2,1], [2,3], [3,1], [3,2]]\n\n[1,2].product([3,4])         #=> [[1,3],[1,4],[2,3],[2,4]]\n\n# トランプの組合せ全列挙\nsuits = %w[♠ ♥ ♦ ♣]\nranks = %w[A 2 3 4 5 6 7 8 9 10 J Q K]\nsuits.product(ranks).map { |s, r| \"#{s}#{r}\" }",
    },
  },
  {
    id: "col-034",
    categoryId: "collections",
    difficulty: "advanced",
    type: "choice",
    question: "次のコードの出力は？",
    code: "[1, 2, 3, 4, 5].chunk_while { |a, b| b - a == 1 }.to_a",
    choices: [
      "[[1, 2], [3, 4], [5]]",
      "[1, 2, 3, 4, 5]",
      "[[1, 2, 3, 4, 5]]",
      "[[1], [2], [3], [4], [5]]",
    ],
    answerIndex: 2,
    hints: [
      "chunk_while は連続する 2 要素が条件を満たす間グループ化。",
      "1→2, 2→3, 3→4, 4→5 はすべて +1 なので 1 グループ。",
      "結果はネスト配列。",
    ],
    explanation: {
      summary:
        "`chunk_while { |a, b| ... }` は連続する 2 要素が条件を満たす限り同じグループに。",
      reason:
        "連続する範囲の検出、連番のグルーピングなどに便利 (Ruby 2.3+)。`slice_when` は逆 (条件成立時に切る)。`chunk` は『値で』グルーピング。",
      codeExample:
        "[1, 2, 4, 5, 7].chunk_while { |a, b| b - a == 1 }.to_a\n#=> [[1, 2], [4, 5], [7]]\n\n# 同じカテゴリの連続を検出\n['a','a','b','b','a'].chunk_while { |x, y| x == y }.to_a\n#=> [['a','a'], ['b','b'], ['a']]\n\n# slice_when (逆: 条件で区切る)\n[1, 2, 4, 5, 7].slice_when { |a, b| b - a > 1 }.to_a\n#=> [[1, 2], [4, 5], [7]]",
    },
  },
  {
    id: "col-035",
    categoryId: "collections",
    difficulty: "advanced",
    type: "choice",
    question: "次のコードの出力は？",
    code: "[3, 1, 4, 1, 5].minmax",
    choices: [
      "[1, 5]",
      "[5, 1]",
      "5",
      "1",
    ],
    answerIndex: 0,
    hints: [
      "minmax は 1 回の走査で min と max を同時取得。",
      "結果は [min, max] の 2 要素配列。",
      "min と max を別々に呼ぶより効率的。",
    ],
    explanation: {
      summary:
        "`minmax` は 1 回の走査で [min, max] を返す。`min` + `max` を別々に呼ぶより効率的。",
      reason:
        "走査が 1 回で済むので O(n) で完了。`min_by`/`max_by` 版が `minmax_by` として存在。Ruby のコレクションには『一度に複数取得』の効率版がいくつかある (partition, minmax, sum + ブロック等)。",
      codeExample:
        "[3, 1, 4, 1, 5].minmax        #=> [1, 5]\nusers.minmax_by(&:score)      #=> [低い人, 高い人]\n\n# 個別\n[3, 1, 4].min                 #=> 1\n[3, 1, 4].max                 #=> 4\n[3, 1, 4].min(2)              #=> [1, 3] (下位 2)\n[3, 1, 4].max(2)              #=> [4, 3] (上位 2)",
    },
  },
  {
    id: "col-036",
    categoryId: "collections",
    difficulty: "advanced",
    type: "choice",
    question:
      "Enumerable の `each_cons(n)` と `each_slice(n)` の違いは？",
    choices: [
      "each_cons は移動窓 (重複あり)、each_slice は固定チャンク (重複なし)",
      "両者は同じ",
      "each_cons は破壊的、each_slice は非破壊的",
      "each_slice の方が遅い",
    ],
    answerIndex: 0,
    hints: [
      "each_cons(2) は [1,2], [2,3], [3,4] のように重なる窓。",
      "each_slice(2) は [1,2], [3,4] のように区切る。",
      "移動平均 (cons) vs バッチ処理 (slice) の使い分け。",
    ],
    explanation: {
      summary:
        "`each_cons(n)` は連続 n 要素の移動窓 (重複あり)。`each_slice(n)` は n 個ずつのチャンク (重複なし)。",
      reason:
        "each_cons: 株価の移動平均、隣接ペアの差分計算 など。each_slice: ページング、N 件ずつバッチ処理。",
      codeExample:
        "[1, 2, 3, 4, 5].each_cons(2).to_a\n#=> [[1,2], [2,3], [3,4], [4,5]]  (移動窓)\n\n[1, 2, 3, 4, 5].each_slice(2).to_a\n#=> [[1,2], [3,4], [5]]            (固定チャンク)\n\n# 移動平均\nprices.each_cons(5).map { |window| window.sum / 5.0 }\n\n# バッチ送信\nusers.each_slice(100) { |batch| Mailer.bulk(batch).deliver_later }",
    },
  },

  // ===========================================================================
  // 🧱 クラスとモジュール 追加 (oop-013〜oop-032, 20問)
  // ===========================================================================
  {
    id: "oop-013",
    categoryId: "ruby-oop",
    difficulty: "beginner",
    type: "choice",
    question: "次のコードの出力は？",
    code: 'class Point\n  def initialize(x, y)\n    @x, @y = x, y\n  end\nend\n\np = Point.new(3, 4)\nputs p.instance_variables',
    choices: [
      "[\"@x\", \"@y\"]",
      "[]",
      "[:@x, :@y]",
      "[3, 4]",
    ],
    answerIndex: 2,
    hints: [
      "instance_variables は定義されたインスタンス変数の Symbol 配列を返す。",
      "値ではなく『変数名 (シンボル形式)』が返る。",
      "リフレクションの基本メソッド。",
    ],
    explanation: {
      summary:
        "`instance_variables` は @ 付きシンボル配列。`instance_variable_get(:@x)` で値取得。",
      reason:
        "デバッグ・リフレクション用。Rails の `as_json` や ActiveRecord の `attributes` も内部で類似処理。getter を定義していなくても値を取り出せるが、通常は attr_reader を使う。",
      codeExample:
        'p.instance_variables             #=> [:@x, :@y]\np.instance_variable_get(:@x)      #=> 3\np.instance_variable_set(:@x, 100)\np.instance_variable_defined?(:@z) #=> false\n\n# クラスのインスタンスメソッド一覧\nPoint.instance_methods(false)     # 自身で定義したものだけ\nPoint.public_methods\nPoint.private_methods',
    },
  },
  {
    id: "oop-014",
    categoryId: "ruby-oop",
    difficulty: "beginner",
    type: "choice",
    question: "次のコードの出力は？",
    code: 'class Animal\nend\n\nputs Animal.new.class\nputs Animal.class\nputs Animal.ancestors.first',
    choices: [
      "Animal / Class / Animal",
      "Class / Class / Object",
      "Animal / Animal / Animal",
      "Object / Class / BasicObject",
    ],
    answerIndex: 0,
    hints: [
      "インスタンスの class はそのクラス自身。",
      "クラス自身の class は Class (Ruby ではクラスもオブジェクト)。",
      "ancestors の先頭は自分自身。",
    ],
    explanation: {
      summary:
        "Ruby では『クラスもオブジェクト』、その class は Class クラス。",
      reason:
        "Class < Module < Object < BasicObject の継承関係。クラスメソッドはクラスオブジェクトの特異メソッドとして実装されている。`ancestors` で継承チェーン全部見える。",
      codeExample:
        "Animal.new.class      #=> Animal\nAnimal.class          #=> Class\nClass.class           #=> Class (自己参照!)\nClass.superclass      #=> Module\nModule.superclass     #=> Object\nObject.superclass     #=> BasicObject\nBasicObject.superclass #=> nil",
    },
  },
  {
    id: "oop-015",
    categoryId: "ruby-oop",
    difficulty: "beginner",
    type: "text",
    question:
      "クラスメソッド (例: User.find) を定義する時の代表的な書き方は `def ???.method_name`。??? に入る 1 単語は？",
    answers: ["self"],
    hints: [
      "メソッドのレシーバを表す予約語。",
      "クラスの中で書くと『今このクラス自身』を指す。",
      "別の書き方として `class << self` の中で `def` する流派もある。",
    ],
    explanation: {
      summary: "`def self.method_name` でクラスメソッドを定義。",
      reason:
        "クラスの内部での `self` は『そのクラス自身』。`def self.x` でクラスの特異メソッド (= クラスメソッド)。複数定義するなら `class << self` の中で並べる方が見やすい。",
      codeExample:
        "class User\n  def self.find_by_email(email)\n    # ...\n  end\n\n  class << self        # 複数クラスメソッドをまとめて\n    def published\n      where(published: true)\n    end\n    def recent\n      order(created_at: :desc)\n    end\n  end\nend\n\nUser.find_by_email('a@x')\nUser.published.recent",
    },
  },
  {
    id: "oop-016",
    categoryId: "ruby-oop",
    difficulty: "intermediate",
    type: "choice",
    question: "次のコードの出力は？",
    code: 'class A\n  def hello; "A"; end\nend\n\nclass B < A\n  def hello; "B (" + super + ")"; end\nend\n\nputs B.new.hello',
    choices: [
      "A",
      "B",
      "A (B)",
      "B (A)",
    ],
    answerIndex: 3,
    hints: [
      "super で親クラスの同名メソッドを呼ぶ。",
      "戻り値を文字列連結している。",
      "B の hello は 'B (' + 'A' + ')' を返す。",
    ],
    explanation: {
      summary: "`super` は親クラスの同名メソッドを呼ぶ。戻り値も使える。",
      reason:
        "サブクラスで親を活かしつつ振る舞いを拡張する基本。`super` (引数省略) は現在の引数をそのまま、`super()` は引数なし、`super(a, b)` は指定引数。",
      codeExample:
        "class A\n  def initialize(name); @name = name; end\nend\n\nclass B < A\n  def initialize(name, age)\n    super(name)             # 親の initialize に name だけ渡す\n    @age = age\n  end\nend\n\n# super と super() の違い\n# super   引数引き継ぎ\n# super() 引数なしで呼ぶ",
    },
  },
  {
    id: "oop-017",
    categoryId: "ruby-oop",
    difficulty: "intermediate",
    type: "choice",
    question:
      "次のうち、Ruby の Comparable モジュールが Module の機能として要求する『定義すべきメソッド』は？",
    choices: [
      "< と > のみ",
      "== のみ",
      "<=> と == の両方",
      "<=> のみ",
    ],
    answerIndex: 3,
    hints: [
      "1 個だけ定義すれば残り (<, <=, ==, >=, >) は自動で得られる。",
      "宇宙船演算子と呼ばれる 3 文字の演算子。",
      "Ruby らしい『最小定義で最大恩恵』のパターン。",
    ],
    explanation: {
      summary:
        "`Comparable` は `<=>` を 1 つ定義すれば、< <= == >= > between? clamp が手に入る。",
      reason:
        "宇宙船演算子 `<=>` は -1/0/1 を返す比較。include Comparable するとこれを基に他の比較系が自動定義される。`Enumerable` も同様で `each` だけ定義すれば map/select/reduce が手に入る。",
      codeExample:
        "class Version\n  include Comparable\n  attr_reader :major, :minor\n  def initialize(s)\n    @major, @minor = s.split('.').map(&:to_i)\n  end\n  def <=>(other)\n    [major, minor] <=> [other.major, other.minor]\n  end\nend\n\nv1 = Version.new('1.2')\nv2 = Version.new('1.5')\nv1 < v2                    #=> true\nv1.between?(v1, v2)        #=> true\n[v2, v1].sort              #=> [v1, v2]",
    },
  },
  {
    id: "oop-018",
    categoryId: "ruby-oop",
    difficulty: "intermediate",
    type: "choice",
    question:
      "次の Module 関連メソッドのうち、『継承時に親子で名前空間も共有する』のはどれ？",
    choices: [
      "private メソッドは継承されない",
      "module 内で定義したクラス / 定数 (例: MyModule::User)",
      "include したインスタンスメソッドのみ",
      "extend したクラスメソッドのみ",
    ],
    answerIndex: 1,
    hints: [
      "Module は名前空間としての側面もあります。",
      "`module App; class User; end; end` は App::User として参照されます。",
      "include や継承のメソッド共有とは別の話。",
    ],
    explanation: {
      summary:
        "Module は (1) Mixin のためのメソッド集約、(2) 名前空間としてクラス/定数を抱える、の 2 役。",
      reason:
        "クラス階層が深くなる前に名前空間で整理するのが Rails 流。例: `Admin::UsersController` は `module Admin; class UsersController; end; end`。`ActiveRecord::Base`, `ActiveSupport::Concern` も同様の階層名前空間。",
      codeExample:
        "module Payment\n  class Charge; end\n  class Refund; end\n  module Stripe\n    class Client; end\n  end\n  ERROR_CODES = ['expired_card', 'insufficient_funds']\nend\n\nPayment::Charge.new\nPayment::Stripe::Client.new\nPayment::ERROR_CODES",
    },
  },
  {
    id: "oop-019",
    categoryId: "ruby-oop",
    difficulty: "intermediate",
    type: "choice",
    question:
      "Ruby の `attr_accessor :name` を素の Ruby で書き直すと？",
    choices: [
      "def name; @name; end と def name=(v); @name = v; end",
      "@name = nil",
      "self.name = name",
      "attr :name (どれも同じ)",
    ],
    answerIndex: 0,
    hints: [
      "attr_accessor は『getter + setter の自動生成マクロ』。",
      "getter は引数なしで @name を返すメソッド。",
      "setter はメソッド名末尾に = が付き、引数を受け取って @name に代入。",
    ],
    explanation: {
      summary:
        "`attr_accessor` は getter (`name`) と setter (`name=`) の 2 メソッドを自動定義するマクロ。",
      reason:
        "Ruby は『属性』専用構文を持たず、メソッドで実現する設計。`attr_reader` は getter のみ、`attr_writer` は setter のみ、`attr_accessor` は両方。インスタンス変数を直接公開するのではなく、すべてメソッド経由になる (= 後でロジック追加が容易)。",
      codeExample:
        "# マクロ\nclass User\n  attr_accessor :name\nend\n\n# 展開\nclass User\n  def name; @name; end\n  def name=(v); @name = v; end\nend\n\n# あとからロジック追加\nclass User\n  attr_reader :name\n  def name=(v)\n    @name = v.strip.downcase\n  end\nend",
    },
  },
  {
    id: "oop-020",
    categoryId: "ruby-oop",
    difficulty: "intermediate",
    type: "choice",
    question: "次のコードの出力は？",
    code: 'class Foo\n  def self.create\n    new.tap { |f| f.setup }\n  end\n  def setup\n    @ready = true\n  end\n  attr_reader :ready\nend\n\nputs Foo.create.ready',
    choices: [
      "true",
      "false",
      "nil",
      "NoMethodError",
    ],
    answerIndex: 0,
    hints: [
      "create は new + tap で setup を呼ぶ。",
      "tap はレシーバを返す。",
      "setup で @ready = true、reader で取得。",
    ],
    explanation: {
      summary:
        "`new.tap { |obj| obj.setup }` は『new + 初期化処理』を 1 行で書くイディオム。",
      reason:
        "tap はレシーバを返すので、メソッドチェーンの中で副作用を起こせる。Builder パターンやファクトリメソッドで定番。`then` (旧 `yield_self`) はブロック戻り値を返すので逆。",
      codeExample:
        "class Connection\n  def self.open(url)\n    new(url).tap(&:connect)\n  end\nend\n\n# 同じ意味\ndef self.open(url)\n  c = new(url)\n  c.connect\n  c\nend\n\n# then はブロック戻り値\n[1,2,3].then { |a| a.sum }    #=> 6\n[1,2,3].tap { |a| a.sum }     #=> [1,2,3]  (tap はレシーバ)",
    },
  },
  {
    id: "oop-021",
    categoryId: "ruby-oop",
    difficulty: "intermediate",
    type: "choice",
    question:
      "次のうち、Ruby の `module_function` の効果は？",
    choices: [
      "クラスメソッドを定義する",
      "モジュールメソッドとしてもインスタンスメソッド (private) としても使える",
      "メソッドを完全に隠す",
      "オーバーライドを禁止する",
    ],
    answerIndex: 1,
    hints: [
      "Math モジュールが典型的に使う仕組み。",
      "`Math.sqrt(2)` でも `include Math; sqrt(2)` でも呼べる。",
      "両方の呼び出しスタイルに対応する設計。",
    ],
    explanation: {
      summary:
        "`module_function` を宣言するとモジュールメソッドとしても、include した側の private インスタンスメソッドとしても使える。",
      reason:
        "Math/Kernel が代表例。`Math.sqrt(2)` で関数的に呼べるし、`include Math` すれば `sqrt(2)` で呼べる。両刀使いの便利機能。",
      codeExample:
        "module Calculator\n  module_function\n\n  def add(a, b)\n    a + b\n  end\nend\n\n# どちらでも呼べる\nCalculator.add(1, 2)              #=> 3\n\nclass Foo\n  include Calculator\n  def calc\n    add(1, 2)                     # private インスタンスメソッドとして\n  end\nend\nFoo.new.calc                       #=> 3",
    },
  },
  {
    id: "oop-022",
    categoryId: "ruby-oop",
    difficulty: "intermediate",
    type: "choice",
    question: "次のコードの出力は？",
    code: 'class Cat\n  def initialize(name); @name = name; end\n  def to_s; "Cat[#{@name}]"; end\n  def inspect; "<Cat name=#{@name}>"; end\nend\n\nputs Cat.new("Tama")\np Cat.new("Tama")',
    choices: [
      "Cat[Tama] / Cat[Tama]",
      "Tama / Tama",
      "Cat[Tama] / <Cat name=Tama>",
      "<Cat name=Tama> / Cat[Tama]",
    ],
    answerIndex: 2,
    hints: [
      "puts は to_s を呼ぶ。",
      "p は inspect を呼ぶ。",
      "両者は別のメソッド (デバッグ用と表示用)。",
    ],
    explanation: {
      summary: "`puts` は `to_s`、`p` は `inspect` を呼ぶ。両者は独立して上書きできる。",
      reason:
        "to_s はユーザー向けの『文字列化』、inspect はデバッグ用 (構造を見せる)。to_s だけ定義しても inspect は Object のデフォルト (`#<Cat:0x...>`) のまま。",
      codeExample:
        '# 文字列補間も to_s\n"#{Cat.new(\'T\')}"     #=> "Cat[T]"\n\n# 配列の inspect (各要素の inspect)\n[Cat.new(\'T\'), 42, "hi"].inspect\n#=> "[<Cat name=T>, 42, \\"hi\\"]"\n\n# Rails の inspect\nuser.inspect           #=> "#<User id: 1, name: ...>"\nuser.to_s              #=> "#<User:0x..>" or 自由に定義',
    },
  },
  {
    id: "oop-023",
    categoryId: "ruby-oop",
    difficulty: "intermediate",
    type: "choice",
    question:
      "Ruby の `is_a?` と `instance_of?` の違いは？",
    choices: [
      "両者は同じ",
      "is_a? は private を見る、instance_of? は public のみ",
      "is_a? は Class のみ、instance_of? は Module も",
      "is_a? は祖先 (継承/Mixin) も含む、instance_of? はそのクラス丁度のみ",
    ],
    answerIndex: 3,
    hints: [
      "1 つは継承関係を含めて判定、もう 1 つは厳密に同一クラス。",
      "include した Module も含むかどうか。",
      "1 が 1 つでも当てはまれば true、もう 1 つは == 比較に近い。",
    ],
    explanation: {
      summary:
        "`is_a?` (= `kind_of?`) は祖先全部 (継承 + Mixin) を見る。`instance_of?` はそのクラスのインスタンスだけ true。",
      reason:
        "Polymorphism を活かすなら `is_a?` を使う。`instance_of?` は型を厳密にチェックしたい時 (稀)。多くの場合 `respond_to?` で振る舞いベース判定の方が Duck Typing らしい。",
      codeExample:
        "1.is_a?(Integer)        #=> true\n1.is_a?(Numeric)        #=> true (継承)\n1.is_a?(Comparable)     #=> true (Mixin)\n1.instance_of?(Integer) #=> true\n1.instance_of?(Numeric) #=> false (継承先は不可)\n\n# Duck Typing 流\nif obj.respond_to?(:each)\n  obj.each { |x| ... }\nend",
    },
  },
  {
    id: "oop-024",
    categoryId: "ruby-oop",
    difficulty: "intermediate",
    type: "choice",
    question:
      "次のうち、Ruby のメソッドを別名で呼べるようにする宣言は？",
    choices: [
      "alias new_name original_name",
      "rename original new",
      "duplicate :original",
      "method_alias :new",
    ],
    answerIndex: 0,
    hints: [
      "メソッド名のエイリアスを作る Ruby のキーワード。",
      "クラス定義の中で `alias xx yy` のように書く。",
      "メソッドの代替版は alias_method (引数取れる)。",
    ],
    explanation: {
      summary:
        "`alias 新名 旧名` でメソッドの別名を作る。`alias_method` はメソッド版 (動的に使える)。",
      reason:
        "alias はキーワード (シンボル引数ではない: `alias size length`)。alias_method はメソッドなので動的に作れる (`alias_method :foo, :bar`)。Rails の `class_eval { alias_method ... }` でメタプログラミングに使う。",
      codeExample:
        "class String\n  alias len length          # キーワード形式\n  alias_method :length2, :length  # メソッド形式\nend\n\n'hello'.len           #=> 5\n'hello'.length2       #=> 5\n\n# 既存メソッドを保存しつつ上書き\nclass String\n  alias_method :__original_upcase, :upcase\n  def upcase\n    '[' + __original_upcase + ']'\n  end\nend\n'hi'.upcase          #=> '[HI]'",
    },
  },
  {
    id: "oop-025",
    categoryId: "ruby-oop",
    difficulty: "intermediate",
    type: "choice",
    question:
      "シングルトン (1 つしかインスタンスを作らない) を実装する Ruby 標準ライブラリは？",
    choices: [
      "Singleton.new(MyClass)",
      "require 'singleton' して include Singleton",
      "require 'unique'",
      "include OnlyOne",
    ],
    answerIndex: 1,
    hints: [
      "標準ライブラリの『singleton』を require。",
      "include すると new が private になり、`instance` で取得。",
      "アプリケーション全体で 1 つだけ持ちたい設定オブジェクト等に使う。",
    ],
    explanation: {
      summary:
        "`require 'singleton'` + `include Singleton` で `Class.instance` で唯一のインスタンスを取得 (new 不可)。",
      reason:
        "Rails の `Rails.application` も singleton 的。設定オブジェクト、リソースプール、ロガー等に使う。`new` を呼ぶと例外。`Singleton#instance` で常に同じインスタンスを返す。Thread-safe 実装。",
      codeExample:
        "require 'singleton'\n\nclass AppConfig\n  include Singleton\n  attr_accessor :db_url, :api_key\n  def initialize\n    @db_url = ENV['DATABASE_URL']\n  end\nend\n\nAppConfig.instance.db_url\nAppConfig.new            # NoMethodError: private method `new'\n\n# 同じインスタンス\nAppConfig.instance.equal?(AppConfig.instance)  #=> true",
    },
  },
  {
    id: "oop-026",
    categoryId: "ruby-oop",
    difficulty: "advanced",
    type: "choice",
    question:
      "Module の `prepend` を使うと何が違う？",
    choices: [
      "include の逆順 (祖先チェーンの末尾に挿入)",
      "クラスメソッドだけが含まれる",
      "include より優先度が高く、元メソッドを super で呼び出せる形でラップできる",
      "include と完全に同じ",
    ],
    answerIndex: 2,
    hints: [
      "prepend は元クラスの『前』に Module を差し込む。",
      "祖先チェーンで元クラスより先に呼ばれるので、上書き + super で元を呼べる。",
      "メソッドの計装 (logging, profiling) で便利。",
    ],
    explanation: {
      summary:
        "`prepend` は祖先チェーンでクラス自身より先に Module を挿入。上書き + super で元を呼べる『ラッパー』が作れる。",
      reason:
        "include は祖先の後 (= 同名メソッドは元クラス優先)、prepend は前 (= Module 優先)。`alias_method_chain` の代替として推奨。デコレータ・トレーシング・ロギングで重宝。",
      codeExample:
        "module LogCall\n  def call\n    puts \"calling #{self.class}\"\n    super              # 元のメソッド\n  end\nend\n\nclass Service\n  prepend LogCall\n  def call\n    'done'\n  end\nend\n\nService.new.call\n# calling Service\n#=> 'done'\n\nService.ancestors    #=> [LogCall, Service, Object, ...]",
    },
  },
  {
    id: "oop-027",
    categoryId: "ruby-oop",
    difficulty: "advanced",
    type: "choice",
    question:
      "Ruby 3.2+ で導入された『イミュータブルな値オブジェクト』を 1 行で作るクラスは？",
    choices: [
      "Value.create",
      "Immutable.struct",
      "Record.new",
      "Data.define",
    ],
    answerIndex: 3,
    hints: [
      "Struct の弟分。Ruby 3.2+ から標準。",
      "イミュータブル (setter なし) で == 等が自動定義。",
      "Elixir の struct や Java の record に近い。",
    ],
    explanation: {
      summary:
        "Ruby 3.2+ の `Data.define(:a, :b)` は読み取り専用の値オブジェクト。Struct より厳格。",
      reason:
        "Struct は setter があり mutable。Data は完全イミュータブルで、`==`/`hash`/`inspect` も自動。`with(field: value)` で新しいインスタンス生成 (Erlang/Elixir 風)。DTO や設定値の表現に最適。",
      codeExample:
        "User = Data.define(:name, :age)\nu = User.new(name: 'A', age: 20)\n# u = User.new('A', 20)  # 位置引数もOK\n\nu.name                    #=> 'A'\nu.name = 'B'              # NoMethodError\n\n# 新しいインスタンスを作る\nu2 = u.with(age: 21)      #=> #<data User name='A', age=21>\nu == User.new('A', 20)    #=> true",
    },
  },
  {
    id: "oop-028",
    categoryId: "ruby-oop",
    difficulty: "advanced",
    type: "choice",
    question: "次のコードの出力は？",
    code: 'class A\n  def initialize\n    @v = "A"\n  end\nend\n\nclass B < A\n  def initialize\n    @v = "B"\n  end\nend\n\nputs B.new.instance_variable_get(:@v)',
    choices: [
      "A",
      "nil",
      "TypeError",
      "B",
    ],
    answerIndex: 3,
    hints: [
      "サブクラスの initialize は親をオーバーライドする (super を呼ばないと親は走らない)。",
      "B の initialize で @v = 'B'。",
      "親 A の initialize は呼ばれない。",
    ],
    explanation: {
      summary:
        "サブクラスの initialize は親を自動で呼ばない。super を明示的に呼ぶ必要がある。",
      reason:
        "他言語と違って Ruby は親の initialize を自動継承しない。継承先で initialize を再定義したら super を呼ばないと親の初期化が走らない。`def initialize(*args); super; end` のように引数も引き継げる。",
      codeExample:
        "class A\n  def initialize; @v = 'A'; end\nend\n\nclass B < A\n  def initialize\n    super              # ここで @v = 'A' が走る\n    @v += ' + B'\n  end\nend\nB.new.instance_variable_get(:@v)   #=> 'A + B'\n\n# super 無しなら親の初期化はスキップ\nclass C < A\n  def initialize; @v = 'C'; end\nend\nC.new.instance_variable_get(:@v)   #=> 'C'",
    },
  },
  {
    id: "oop-029",
    categoryId: "ruby-oop",
    difficulty: "advanced",
    type: "choice",
    question: "次のコードの出力は？",
    code: 'module M\n  def hi; "M"; end\nend\n\nclass A\n  include M\n  def hi; "A " + super; end\nend\n\nputs A.new.hi',
    choices: [
      "A M",
      "M A",
      "A",
      "M",
    ],
    answerIndex: 0,
    hints: [
      "A の hi は 'A ' + super で M の hi を呼ぶ。",
      "include した Module は祖先チェーンで A の親側にいる。",
      "super で M#hi に到達して 'M' を取得。",
    ],
    explanation: {
      summary:
        "include した Module は祖先チェーンで親側。クラス内のメソッドから super で呼べる。",
      reason:
        "`A.ancestors` を見ると `[A, M, Object, ...]` の順。super は次の祖先 (= M) を探す。Mixin で機能拡張しつつ、super で元の振る舞いを保つパターン。",
      codeExample:
        "module Trackable\n  def save\n    track_save\n    super              # クラスの本来の save\n  end\n\n  private\n  def track_save\n    puts 'tracked'\n  end\nend\n\nclass Post\n  prepend Trackable        # prepend で前に挿入\n  def save\n    puts 'saving'\n  end\nend\n\nPost.new.save\n# tracked\n# saving",
    },
  },
  {
    id: "oop-030",
    categoryId: "ruby-oop",
    difficulty: "advanced",
    type: "choice",
    question: "次のコードの出力は？",
    code: 'class A\n  def self.inherited(subclass)\n    puts "#{subclass} inherits from #{self}"\n  end\nend\n\nclass B < A\nend',
    choices: [
      "何も出力しない",
      "TypeError",
      "B inherits from A",
      "A inherits from B",
    ],
    answerIndex: 2,
    hints: [
      "inherited はクラスが継承された瞬間に呼ばれるフック。",
      "subclass にはサブクラス自身が渡される。",
      "self は親クラス (= A)。",
    ],
    explanation: {
      summary:
        "`self.inherited(subclass)` はクラスが継承された瞬間に呼ばれるフック。Rails の ActiveRecord などが使う。",
      reason:
        "DSL や ORM の実装で頻出。`included` (Module が include された時)、`extended`、`prepended` も同様のフックがある。Rails の `ActiveRecord::Base` の継承時に各種マクロを動的に注入。",
      codeExample:
        "class Plugin\n  REGISTRY = []\n  def self.inherited(subclass)\n    REGISTRY << subclass\n  end\nend\n\nclass MyPlugin < Plugin; end\nclass YourPlugin < Plugin; end\n\nPlugin::REGISTRY     #=> [MyPlugin, YourPlugin]\n\n# 関連フック\nmodule M\n  def self.included(base); end\n  def self.extended(base); end\n  def self.prepended(base); end\nend",
    },
  },
  {
    id: "oop-031",
    categoryId: "ruby-oop",
    difficulty: "advanced",
    type: "choice",
    question: "次のコードの出力は？",
    code: 'class Foo\n  CONST = "hi"\n  def hi\n    CONST\n  end\nend\n\nclass Bar < Foo\nend\n\nputs Bar::CONST\nputs Bar.new.hi',
    choices: [
      "hi / hi",
      "NameError / hi",
      "hi / NameError",
      "両方 NameError",
    ],
    answerIndex: 0,
    hints: [
      "定数はクラスから継承される。",
      "サブクラスからは『親の定数』が直接参照可能。",
      "親で定義したメソッド内の CONST も問題なく解決。",
    ],
    explanation: {
      summary:
        "定数はクラス階層で継承される。Bar からも Bar::CONST で参照可、メソッド内も問題なし。",
      reason:
        "Ruby の定数解決は (1) レキシカルスコープ、(2) 継承チェーン、の順で探す。`Bar::CONST` で親の定数も見える。`Foo.const_get(:CONST)` で動的取得。`Module#constants` で一覧。",
      codeExample:
        "Bar::CONST                #=> 'hi'\nBar.new.hi                #=> 'hi'\nFoo.const_get(:CONST)     #=> 'hi'\nFoo.constants             #=> [:CONST]\n\n# サブクラスで上書き\nclass Bar < Foo\n  CONST = 'override'\nend\nBar::CONST                #=> 'override'\nFoo::CONST                #=> 'hi'  (親は不変)",
    },
  },
  {
    id: "oop-032",
    categoryId: "ruby-oop",
    difficulty: "advanced",
    type: "choice",
    question: "次のコードの出力は？",
    code: 'class A\n  @@count = 0\n  def initialize; @@count += 1; end\nend\n\nclass B < A\nend\n\n3.times { A.new }\n2.times { B.new }\nputs A.class_variable_get(:@@count)',
    choices: [
      "3",
      "2",
      "NameError",
      "5",
    ],
    answerIndex: 3,
    hints: [
      "@@ クラス変数は継承先と共有される。",
      "A 3 回 + B 2 回 = 5 回 initialize が呼ばれる。",
      "@@count は親子で同じ変数。",
    ],
    explanation: {
      summary:
        "`@@` クラス変数は継承先と共有される (混乱の原因)。現代は class << self のインスタンス変数推奨。",
      reason:
        "@@count は A と B で同じものを指す → 親子間の事故の元。現代の Ruby では『クラスのインスタンス変数 + class << self の attr_accessor』推奨。継承で独立カウントしたい場合に有効。",
      codeExample:
        "# 危険: クラス変数は共有\nclass A; @@n = 0; end\nclass B < A\n  @@n = 100         # A の @@n も書き換わる!\nend\n\n# 推奨: クラスのインスタンス変数\nclass A\n  class << self\n    attr_accessor :count\n  end\n  self.count = 0\n  def initialize\n    self.class.count = (self.class.count || 0) + 1\n  end\nend\nclass B < A; self.count = 0; end\n# A と B で独立",
    },
  },

  // ===========================================================================
  // ⚡ Ruby 上級 追加 (adv-023〜adv-037, 15問)
  // ===========================================================================
  {
    id: "adv-023",
    categoryId: "ruby-advanced",
    difficulty: "intermediate",
    type: "choice",
    question: "次のコードの出力は？",
    code: "result = [1, 2, 3].each { |n| puts n * 2 }\np result",
    choices: [
      "[1, 2, 3]",
      "[2, 4, 6]",
      "2 / 4 / 6 / [1, 2, 3]",
      "2 / 4 / 6 / [2, 4, 6]",
    ],
    answerIndex: 2,
    hints: [
      "each はブロックを実行するがレシーバを返す。",
      "出力は 2/4/6、result は [1, 2, 3]。",
      "map を使うと [2, 4, 6] になる。",
    ],
    explanation: {
      summary:
        "`each` はレシーバ自身を返す。配列の変換は `map`。",
      reason:
        "each は副作用 (puts 等) のための走査メソッド。変換した配列が欲しいなら map。result に each の戻り値を入れても元配列が入るだけで意味がない、というのが Ruby 初学者の典型的なつまずきポイント。",
      codeExample:
        "[1, 2, 3].each { |n| puts n * 2 }   # 出力 + 戻り値は [1,2,3]\n[1, 2, 3].map  { |n| n * 2 }        # 戻り値 [2, 4, 6]\n[1, 2, 3].each_with_object([]) { |n, acc| acc << n * 2 }\n#=> [2, 4, 6]",
    },
  },
  {
    id: "adv-024",
    categoryId: "ruby-advanced",
    difficulty: "intermediate",
    type: "choice",
    question:
      "Proc / Lambda / メソッドオブジェクトを統一的に呼び出すメソッドは？",
    choices: [
      ".invoke",
      ".execute",
      ".run",
      ".call (or .[] or .())",
    ],
    answerIndex: 3,
    hints: [
      "Ruby のプロックオブジェクト呼び出しメソッド。",
      "省略形として `.()` や `[]` も使える。",
      "メソッドオブジェクト (`method(:foo)`) も同じ。",
    ],
    explanation: {
      summary:
        "Proc/Lambda は `.call(args)` で呼び出し。省略形 `.()` `[]` も同じ。",
      reason:
        "`.call(1, 2)` / `.(1, 2)` / `[1, 2]` はすべて同等。`Method` オブジェクト (`obj.method(:foo)`) も `.call` で呼べる。これらを統一的に扱えるので、関数オブジェクトとしてコールバックに渡せる。",
      codeExample:
        "double = ->(x) { x * 2 }\n\ndouble.call(5)   #=> 10\ndouble.(5)        #=> 10\ndouble[5]         #=> 10\n\n# Method オブジェクト\ndef triple(x); x * 3; end\nm = method(:triple)\nm.call(5)         #=> 15\n\n# Proc を引数に取る関数\ndef apply(f, x); f.call(x); end\napply(double, 10) #=> 20",
    },
  },
  {
    id: "adv-025",
    categoryId: "ruby-advanced",
    difficulty: "intermediate",
    type: "choice",
    question: "次のコードの出力は？",
    code: 'arr = [1, 2, 3]\nresult = arr.inject(10) { |sum, n| sum + n }\nputs result',
    choices: [
      "16",
      "6",
      "60",
      "[10, 11, 13, 16]",
    ],
    answerIndex: 0,
    hints: [
      "inject(初期値) でブロックの累積を計算。",
      "初期値 10 から始めて 1, 2, 3 を順に足す。",
      "10 + 1 + 2 + 3 = 16。",
    ],
    explanation: {
      summary:
        "`inject(init) { |acc, x| ... }` は累積処理。初期値からブロックを繰り返し評価。",
      reason:
        "畳み込み (fold/reduce)。初期値省略時は配列の最初の要素が初期値。シンボル引数 `inject(:+)` でメソッド呼び出しに短縮可。`reduce` は同義語。",
      codeExample:
        "[1,2,3].inject(0) { |sum, n| sum + n }   #=> 6\n[1,2,3].inject(:+)                       #=> 6\n[1,2,3].inject(10, :+)                   #=> 16\n[1,2,3].inject(1, :*)                    #=> 6\n\n# Hash 構築 (each_with_object の方が安全)\n[1,2,3].inject({}) { |h, n| h[n] = n*n; h }\n#=> {1=>1, 2=>4, 3=>9}",
    },
  },
  {
    id: "adv-026",
    categoryId: "ruby-advanced",
    difficulty: "intermediate",
    type: "choice",
    question: "次のコードの出力は？",
    code: 'def call_block(&blk)\n  blk.call(10)\nend\n\nresult = call_block { |x| x + 5 }\nputs result',
    choices: [
      "nil",
      "15",
      "10",
      "5",
    ],
    answerIndex: 1,
    hints: [
      "&blk でブロックを Proc として受け取る。",
      "blk.call(10) でブロックに 10 を渡して呼び出す。",
      "x + 5 で 10 + 5 = 15。",
    ],
    explanation: {
      summary:
        "`&blk` 引数でブロックを Proc に変換して受け取る。`blk.call(args)` で実行。",
      reason:
        "ブロックを変数として保持・再利用したい時に使う。`yield` は手早いが、複数のブロックを扱う・条件で呼び分ける場合は明示的に Proc 化する方が柔軟。",
      codeExample:
        "def call_twice(&blk)\n  blk.call\n  blk.call\nend\ncall_twice { puts 'hi' }      # hi / hi\n\n# Proc を別関数に渡す\ndef execute(callback)\n  callback.call(42)\nend\nexecute(->(x) { puts x })     #=> 42\n\n# Method オブジェクト\nm = method(:puts)\nexecute(m)                    #=> 42",
    },
  },
  {
    id: "adv-027",
    categoryId: "ruby-advanced",
    difficulty: "intermediate",
    type: "choice",
    question: "Ruby の Proc と Lambda の引数チェックの違いは？",
    choices: [
      "両者は同じ",
      "Proc は厳密、Lambda は緩い",
      "Lambda は引数を取れない",
      "Lambda は厳密 (引数数違いで ArgumentError)、Proc は緩い (nil 補完 / 余分は無視)",
    ],
    answerIndex: 3,
    hints: [
      "Lambda は『関数』らしい厳密な振る舞い。",
      "Proc はブロックの延長で緩い (足りなければ nil)。",
      "ArgumentError の有無で見分けられる。",
    ],
    explanation: {
      summary:
        "Lambda は引数数を厳密にチェック (ArgumentError)。Proc は緩い (足りなければ nil、余分は無視)。",
      reason:
        "Proc は yield のラッパー的存在で、ブロックの延長として緩い設計。Lambda は関数オブジェクトなので厳密。return の挙動も違う (Lambda はラムダ自身から脱出、Proc は囲むメソッドから脱出)。",
      codeExample:
        "pr = Proc.new { |a, b| [a, b] }\nla = lambda      { |a, b| [a, b] }\nla2 = ->(a, b)   { [a, b] }   # 同じ\n\npr.call(1)           #=> [1, nil]\npr.call(1, 2, 3)     #=> [1, 2]  (余分は無視)\nla.call(1)           # ArgumentError\nla.call(1, 2, 3)     # ArgumentError\n\n# return の挙動\ndef test_proc\n  pr = Proc.new { return 1 }\n  pr.call\n  2                  # 到達しない\nend\ntest_proc  #=> 1",
    },
  },
  {
    id: "adv-028",
    categoryId: "ruby-advanced",
    difficulty: "intermediate",
    type: "choice",
    question: "次のコードの出力は？",
    code: 'def safe_div(a, b)\n  a / b\nrescue ZeroDivisionError\n  Float::INFINITY\nensure\n  puts "done"\nend\n\nputs safe_div(10, 0)',
    choices: [
      "ZeroDivisionError",
      "done / Infinity",
      "Infinity / done",
      "done / 0",
    ],
    answerIndex: 1,
    hints: [
      "ensure は例外の有無に関わらず最後に実行される。",
      "rescue で Float::INFINITY が返り値になる。",
      "ensure の puts が先に実行され、その後で戻り値が puts される。",
    ],
    explanation: {
      summary:
        "`ensure` は rescue 後・return 直前に実行される。後始末用。",
      reason:
        "ファイルクローズ・ロック解放・統計記録など、成功失敗に関わらず実行したい処理に使う。ensure 内で return すると本体の戻り値を上書きしてしまうので注意 (アンチパターン)。",
      codeExample:
        "def with_file(path)\n  f = File.open(path)\n  process(f)\nensure\n  f&.close       # 例外でも閉じる\nend\n\n# File.open のブロック版は ensure 不要\nFile.open('data.txt') do |f|\n  process(f)\nend  # ブロック抜けると自動 close",
    },
  },
  {
    id: "adv-029",
    categoryId: "ruby-advanced",
    difficulty: "intermediate",
    type: "choice",
    question: "次のコードの出力は？",
    code: 'class MyError < StandardError; end\n\nbegin\n  raise MyError, "boom"\nrescue => e\n  puts e.class\nend',
    choices: [
      "MyError",
      "StandardError",
      "RuntimeError",
      "Exception",
    ],
    answerIndex: 0,
    hints: [
      "rescue => e は StandardError 以下を捕捉。",
      "MyError は StandardError のサブクラスなので捕まる。",
      "e.class は実際の例外クラス (MyError)。",
    ],
    explanation: {
      summary:
        "カスタム例外は `< StandardError` で作る。`rescue => e` (引数省略) は StandardError 以下を捕捉。",
      reason:
        "アプリ独自の例外は必ず StandardError サブクラス (or 既存例外サブクラス) で作る。`Exception` 直下にすると `rescue =>` で捕まらず、SystemExit / Interrupt と同じ扱いになって障害対応で困る。",
      codeExample:
        "class PaymentError < StandardError; end\nclass CardDeclinedError < PaymentError; end\n\nbegin\n  raise CardDeclinedError, 'expired'\nrescue PaymentError => e          # 親で受けられる\n  puts e.class, e.message\nend\n\n# 階層を活かして個別ハンドル\nbegin\n  ...\nrescue CardDeclinedError => e\n  retry_payment\nrescue PaymentError => e\n  log(e)\nend",
    },
  },
  {
    id: "adv-030",
    categoryId: "ruby-advanced",
    difficulty: "intermediate",
    type: "text",
    question:
      "Ruby で『すべてのメソッド呼び出しを動的にハンドルする』ためのフックメソッド名は？(snake_case)",
    answers: ["method_missing"],
    hints: [
      "メソッド名が見つからない時に呼ばれる。",
      "Rails の dynamic finder (find_by_xxx) や OpenStruct で活用。",
      "オーバーライドする場合は respond_to_missing? もセットで実装するのがマナー。",
    ],
    explanation: {
      summary:
        "`method_missing(name, *args, &blk)` は未定義メソッド呼び出し時のフック。",
      reason:
        "メタプログラミングの定番。動的に振る舞いを生成・委譲できる。ペアの `respond_to_missing?` も必ず実装 (respond_to? の正しい挙動のため)。Rails の Active Record や Forwardable も内部で使う。",
      codeExample:
        "class Proxy\n  def initialize(target); @target = target; end\n\n  def method_missing(name, *args, &blk)\n    if @target.respond_to?(name)\n      @target.public_send(name, *args, &blk)\n    else\n      super\n    end\n  end\n\n  def respond_to_missing?(name, include_private = false)\n    @target.respond_to?(name, include_private) || super\n  end\nend",
    },
  },
  {
    id: "adv-031",
    categoryId: "ruby-advanced",
    difficulty: "advanced",
    type: "choice",
    question: "次のコードの出力は？",
    code: 'class Container\n  define_method(:items) do\n    @items ||= []\n  end\nend\n\nc = Container.new\nc.items << 1\nc.items << 2\nputs c.items.inspect',
    choices: [
      "[2]",
      "[]",
      "[[1], [2]]",
      "[1, 2]",
    ],
    answerIndex: 3,
    hints: [
      "define_method で動的にメソッドを定義。",
      "`@items ||= []` は初回 nil の時だけ初期化、以後は同じ配列を返す。",
      "1 と 2 を順に push して [1, 2]。",
    ],
    explanation: {
      summary:
        "`define_method` で動的にメソッド定義。クロージャを作るので外側変数を捕捉できる (def は不可)。",
      reason:
        "`def name; ...; end` はスコープゲートで外側変数を見られない。`define_method` はブロックを使うのでクロージャ。属性のループ定義で頻出 (attr_accessor 自前実装等)。",
      codeExample:
        "class User\n  [:name, :age, :email].each do |attr|\n    define_method(attr) do\n      instance_variable_get(\"@#{attr}\")\n    end\n    define_method(\"#{attr}=\") do |val|\n      instance_variable_set(\"@#{attr}\", val)\n    end\n  end\nend\n\nu = User.new\nu.name = 'Alice'\nu.name        #=> 'Alice'",
    },
  },
  {
    id: "adv-032",
    categoryId: "ruby-advanced",
    difficulty: "advanced",
    type: "choice",
    question: "次のコードの出力は？",
    code: 'class Foo\n  def call; "Foo"; end\nend\n\nf = Foo.new\nresult = case f\n         when Foo then "matched"\n         else "no"\n         end\nputs result',
    choices: [
      "Foo",
      "TypeError",
      "matched",
      "no",
    ],
    answerIndex: 2,
    hints: [
      "case/when は内部で === で比較。",
      "Class#=== はそのクラスのインスタンスかチェック。",
      "Foo === f は true なので matched。",
    ],
    explanation: {
      summary:
        "`case/when` は内部で `===` を使う。Class#=== は is_a? と同じ動作。",
      reason:
        "case の比較は `==` ではなく `===`。これにより `when Integer`, `when /regex/`, `when 1..10` が動く。各クラスが自分で `===` を定義している (Class, Regexp, Range, Proc 等)。Ruby 3.0+ の case/in パターンマッチは別の構文。",
      codeExample:
        "case value\nwhen Integer       then 'int'\nwhen String        then 'str'\nwhen /^\\d+$/       then 'digit string'\nwhen 1..10         then 'small'\nwhen ->(x) { x > 100 } then 'big'\nend\n\n# 内部的にはこれ\nInteger === 42         #=> true\n/^\\d/ === 'abc'        #=> false\n(1..10) === 5          #=> true",
    },
  },
  {
    id: "adv-033",
    categoryId: "ruby-advanced",
    difficulty: "advanced",
    type: "choice",
    question:
      "Ruby のブロック内で `return` を使うとどうなる？",
    choices: [
      "ArgumentError",
      "ブロックを呼んだメソッドから抜ける (Proc/yield の場合)、Lambda の場合はラムダから抜けるだけ",
      "ブロックだけ終わる",
      "プログラム全体が終了",
    ],
    answerIndex: 1,
    hints: [
      "Proc と Lambda で return の挙動が決定的に違う。",
      "Proc / yield 内の return は『定義された』メソッドから抜ける。",
      "Lambda 内の return はラムダ自身から抜けるだけ。",
    ],
    explanation: {
      summary:
        "Proc/yield 内 `return` は囲むメソッドから抜ける (危険)。Lambda 内 `return` はラムダから抜けるだけ。",
      reason:
        "Proc/yield は『ブロックの延長』なので、return は『元のメソッドの return』として解釈される。これが Proc の落とし穴で、メソッドの外で Proc.new { return } を呼ぶと LocalJumpError。Lambda は『関数』らしく自分で完結。",
      codeExample:
        "def proc_test\n  p = Proc.new { return 1 }\n  p.call\n  2          # 到達しない (return がメソッドを抜ける)\nend\nproc_test    #=> 1\n\ndef lambda_test\n  la = lambda { return 1 }\n  la.call\n  2          # 到達する\nend\nlambda_test  #=> 2\n\n# Proc をメソッド外で\np = Proc.new { return 1 }\np.call       # LocalJumpError",
    },
  },
  {
    id: "adv-034",
    categoryId: "ruby-advanced",
    difficulty: "advanced",
    type: "choice",
    question: "次のコードの出力は？",
    code: 'class Foo\n  def initialize\n    @bar = "B"\n  end\n  private\n  def secret; "S"; end\nend\n\nf = Foo.new\nputs f.send(:secret)',
    choices: [
      "nil",
      "B",
      "S",
      "NoMethodError",
    ],
    answerIndex: 2,
    hints: [
      "send は private/protected を貫通して呼べる。",
      "通常 f.secret は NoMethodError。",
      "send 経由なら private でも呼べてしまう。",
    ],
    explanation: {
      summary:
        "`send` は private/protected を含む全メソッドを呼べる。`public_send` は public のみ。",
      reason:
        "send はメタプログラミングで強力 (動的にメソッド呼び出し)。ただし可視性をバイパスするので、外部入力でメソッド名を組み立てる場合は厳禁。`public_send` を使えば private を呼ばない安全版になる。",
      codeExample:
        "class Foo\n  private\n  def secret; 'shh'; end\nend\n\nFoo.new.secret           # NoMethodError\nFoo.new.send(:secret)    #=> 'shh'  (バイパス)\nFoo.new.public_send(:secret)  # NoMethodError\n\n# 動的にメソッド呼び出し (危険)\nuser.public_send(params[:method])   # 必ず public_send + 許可リスト確認",
    },
  },
  {
    id: "adv-035",
    categoryId: "ruby-advanced",
    difficulty: "advanced",
    type: "choice",
    question: "次のコードの出力は？",
    code: "case [1, 2, 3]\nin [1, *rest]\n  puts \"rest: #{rest}\"\nin _\n  puts 'no'\nend",
    choices: [
      "rest: [2, 3]",
      "rest: [1, 2, 3]",
      "no",
      "SyntaxError",
    ],
    answerIndex: 0,
    hints: [
      "Ruby 3.0+ のパターンマッチング (case/in)。",
      "[1, *rest] は『最初が 1 で残りを rest に束縛』。",
      "残りは [2, 3]。",
    ],
    explanation: {
      summary:
        "Ruby 3.0+ の `case/in` パターンマッチング。`*rest` で残り全部を束縛。",
      reason:
        "Array や Hash の構造分解 + 値マッチ + 型チェックを 1 つの構文で。`in [1, *rest]` は『最初が 1 で残りは何でも』。`in {name: String => n}` は『name が String キーで値を n に束縛』。失敗時は NoMatchingPatternError。",
      codeExample:
        "case data\nin [1, *rest]\n  rest\nin { user: { name: String => n } }\n  n\nin Integer => x if x > 10\n  \"big: #{x}\"\nelse\n  'other'\nend\n\n# 1 行版 (Ruby 3.0+)\ndata in { name: String => name }\nputs name      # マッチすれば変数 name 束縛",
    },
  },
  {
    id: "adv-036",
    categoryId: "ruby-advanced",
    difficulty: "advanced",
    type: "choice",
    question: "次のコードの出力は？",
    code: 'thr = Thread.new { sleep 0.01; 42 }\nputs thr.value',
    choices: [
      "ThreadError",
      "42",
      "nil",
      "Thread",
    ],
    answerIndex: 1,
    hints: [
      "Thread.new はブロックを別スレッドで実行。",
      "thr.value は終了を待ってからブロックの戻り値を返す。",
      "ブロックの最後の式が 42。",
    ],
    explanation: {
      summary:
        "`Thread.new { ... }` で別スレッド実行、`.value` で終了待ち + 戻り値取得。",
      reason:
        "Ruby は MRI では GIL があるので CPU 並列は限定的、しかし IO 待ちでは効果あり。`thr.join` は終了待ちのみ (戻り値無し)、`thr.value` は戻り値も取れる。例外はスレッド内で発生したら .value 呼び出し時に再 raise。",
      codeExample:
        "# 並列 IO\nthreads = urls.map do |url|\n  Thread.new { Net::HTTP.get_response(URI(url)) }\nend\nresponses = threads.map(&:value)\n\n# Mutex で排他\nmutex = Mutex.new\ncounter = 0\n10.times.map do\n  Thread.new { mutex.synchronize { counter += 1 } }\nend.each(&:join)\n\n# 並列処理ライブラリ\n# Parallel.map(items) { |i| ... } や concurrent-ruby",
    },
  },
  {
    id: "adv-037",
    categoryId: "ruby-advanced",
    difficulty: "advanced",
    type: "choice",
    question: "次のコードの出力は？",
    code: 'class Foo\n  def self.const_missing(name)\n    "missing: #{name}"\nend\nend\n\nputs Foo::ANYTHING',
    choices: [
      "nil",
      "ANYTHING",
      "missing: ANYTHING",
      "NameError",
    ],
    answerIndex: 2,
    hints: [
      "const_missing は未定義定数アクセス時のフック。",
      "method_missing の定数版。",
      "Foo::ANYTHING が未定義なので呼ばれる。",
    ],
    explanation: {
      summary:
        "`const_missing(name)` は未定義定数アクセス時のフック。Rails の autoload もこれで実装。",
      reason:
        "Rails の Zeitwerk 以前の autoloader は const_missing でファイルをロードしていた。`module Foo; def self.const_missing(name); ... end; end`。今は Zeitwerk が違うアプローチを取るが、メタプロのコアな機能。",
      codeExample:
        "class Dictionary\n  def self.const_missing(name)\n    puts \"defining #{name}\"\n    const_set(name, \"VALUE OF #{name}\")\n  end\nend\n\nDictionary::HELLO\n# defining HELLO\n#=> 'VALUE OF HELLO'\n\nDictionary::HELLO    # 2 回目は定義済みなので const_missing は呼ばれない",
    },
  },

  // ===========================================================================
  // 🔎 コードリーディング 追加 (cr-013〜cr-027, 15問)
  // ===========================================================================
  {
    id: "cr-013",
    categoryId: "code-reading",
    difficulty: "intermediate",
    type: "choice",
    question: "次のコードの出力は？",
    code: 'words = ["ruby", "is", "fun"]\nresult = words.map { |w| w.length }.sum\nputs result',
    choices: ["3", "ruby is fun", "[4, 2, 3]", "9"],
    answerIndex: 3,
    hints: [
      "map で各単語の長さを取り出す。",
      "[4, 2, 3] の合計。",
      "4 + 2 + 3 = 9。",
    ],
    explanation: {
      summary:
        "map で [4, 2, 3] を取り出し、sum で 9。`sum { ... }` ブロック版なら 1 行で書ける。",
      reason:
        "メソッドチェーンの基本パターン。Ruby 2.4+ なら `words.sum(&:length)` も同等で 1 段短い。",
      codeExample:
        "words.map(&:length).sum     #=> 9\nwords.sum(&:length)         #=> 9 (Ruby 2.4+)\nwords.sum { |w| w.length }  #=> 9",
    },
  },
  {
    id: "cr-014",
    categoryId: "code-reading",
    difficulty: "intermediate",
    type: "choice",
    question: "次のコードの出力は？",
    code: 'h = { a: 1, b: 2, c: 3 }\nresult = h.select { |k, v| v.odd? }.keys\np result',
    choices: [
      "[1, 3]",
      "[:a, :b, :c]",
      "[:a, :c]",
      "[:b]",
    ],
    answerIndex: 2,
    hints: [
      "select で値が奇数のキー・値ペアを残す。",
      "残るのは {a: 1, c: 3}。",
      "keys で [:a, :c]。",
    ],
    explanation: {
      summary:
        "Hash#select はブロック条件を満たす要素だけの Hash を返す。`keys` でキー一覧。",
      reason:
        "Hash 版の filter。`Hash#reject` で逆。`filter_map` 相当の柔軟な選択は `each_pair` + 累積で書く。Hash の各メソッドは Array とは戻り値が異なる (Hash で返る)。",
      codeExample:
        "{ a: 1, b: 2 }.select { |k, v| v.odd? }   #=> {a: 1}\n{ a: 1, b: 2 }.reject { |k, v| v.odd? }   #=> {b: 2}\n{ a: 1, b: 2 }.filter_map { |k, v| k if v.odd? } #=> [:a]\n{ a: 1, b: 2 }.find { |k, v| v.odd? }    #=> [:a, 1] (Array で返る)",
    },
  },
  {
    id: "cr-015",
    categoryId: "code-reading",
    difficulty: "intermediate",
    type: "choice",
    question: "次のコードの出力は？",
    code: 'a = [1, 2, 3]\nb = a.dup\nb << 4\np a\np b',
    choices: [
      "[1, 2, 3, 4] / [1, 2, 3, 4]",
      "[1, 2, 3] / [1, 2, 3]",
      "[1, 2, 3, 4] / [1, 2, 3]",
      "[1, 2, 3] / [1, 2, 3, 4]",
    ],
    answerIndex: 3,
    hints: [
      "dup は浅いコピーを作る。",
      "b は a と別オブジェクト。",
      "b への push は a に影響しない。",
    ],
    explanation: {
      summary:
        "dup は新しいオブジェクトを返すので、b への変更は a に影響しない。",
      reason:
        "もし `b = a` (代入のみ) なら同じオブジェクトを指すので両方に変更が見える。dup で別オブジェクト化。ただし浅いコピーなので、ネストした配列内部までは複製されない (深いコピーが必要なら Marshal.load(Marshal.dump(obj)))。",
      codeExample:
        "a = [1, 2, 3]\nb = a                # 参照だけコピー\nb << 4\na                    #=> [1, 2, 3, 4] (両方変わる)\n\na = [1, 2, 3]\nb = a.dup\nb << 4\na                    #=> [1, 2, 3]   (独立)\n\n# 深いコピー\nnested = [[1], [2]]\ncopy = Marshal.load(Marshal.dump(nested))",
    },
  },
  {
    id: "cr-016",
    categoryId: "code-reading",
    difficulty: "intermediate",
    type: "choice",
    question: "次のコードの出力は？",
    code: 'arr = [1, 2, 3, 4, 5]\nresult = arr.reduce(0) { |sum, n| n.odd? ? sum + n : sum }\nputs result',
    choices: ["0", "9", "15", "6"],
    answerIndex: 1,
    hints: [
      "reduce(0) は初期値 0 から累積。",
      "ブロック内で奇数なら加算、偶数なら sum をそのまま。",
      "1 + 3 + 5 = 9。",
    ],
    explanation: {
      summary:
        "reduce で条件付き累積。奇数 (1, 3, 5) だけ加算 → 9。",
      reason:
        "select + sum の方が読みやすいが、reduce で 1 走査も可能。`arr.select(&:odd?).sum` も同じ結果でより素直。",
      codeExample:
        "arr.reduce(0) { |s, n| n.odd? ? s + n : s }  #=> 9\narr.select(&:odd?).sum                       #=> 9\narr.sum { |n| n.odd? ? n : 0 }                #=> 9\n\n# inject はエイリアス\narr.inject(0) { |s, n| n.odd? ? s + n : s }",
    },
  },
  {
    id: "cr-017",
    categoryId: "code-reading",
    difficulty: "intermediate",
    type: "choice",
    question: "次のコードの出力は？",
    code: 'class Counter\n  attr_reader :value\n  def initialize; @value = 0; end\n  def +(other); @value += other; self; end\nend\n\nc = Counter.new\nc + 10 + 20\nputs c.value',
    choices: ["10", "20", "0", "30"],
    answerIndex: 3,
    hints: [
      "+ メソッドが self を返すのでメソッドチェーン可能。",
      "c + 10 で @value = 10、(c + 10) は c 自身。",
      "+ 20 で @value = 30。",
    ],
    explanation: {
      summary:
        "演算子 `+` をメソッドとして定義し、self を返すことでチェーン可能に。流暢インターフェース (Fluent Interface) の例。",
      reason:
        "Ruby は演算子もメソッド。`def +(other); ...; end` で `c + x` の挙動を定義できる。self を返せば連続呼び出しが書ける (Builder パターンなど)。",
      codeExample:
        "# 演算子オーバーロード\nclass Vec\n  attr_reader :x, :y\n  def initialize(x, y); @x, @y = x, y; end\n  def +(o); Vec.new(x + o.x, y + o.y); end\n  def *(n); Vec.new(x * n, y * n); end\nend\n\nVec.new(1, 2) + Vec.new(3, 4)   #=> Vec(4, 6)\nVec.new(1, 2) * 3               #=> Vec(3, 6)",
    },
  },
  {
    id: "cr-018",
    categoryId: "code-reading",
    difficulty: "intermediate",
    type: "choice",
    question: "次のコードの出力は？",
    code: 'arr = [1, 2, 3, 4]\nresult = arr.each_with_object({}) do |n, h|\n  h[n] = n * n\nend\np result',
    choices: [
      "{1=>1, 2=>4, 3=>9, 4=>16}",
      "{1=>1, 2=>2, 3=>3, 4=>4}",
      "[1, 4, 9, 16]",
      "{}",
    ],
    answerIndex: 0,
    hints: [
      "each_with_object({}) は空 Hash を渡しながら累積。",
      "各 n をキー、n*n を値で格納。",
      "1→1, 2→4, 3→9, 4→16。",
    ],
    explanation: {
      summary:
        "each_with_object({}) で Hash を構築するイディオム。1 走査で n→n² の対応表を生成。",
      reason:
        "inject だと『最後にオブジェクトを返す』必要があるが、each_with_object はオブジェクト自身が常に返るので楽。後で `to_h` 経由でも書ける: `arr.map { |n| [n, n*n] }.to_h`。",
      codeExample:
        "# each_with_object\narr.each_with_object({}) { |n, h| h[n] = n * n }\n\n# map + to_h\narr.map { |n| [n, n * n] }.to_h\n\n# Hash#to_h with block (2.6+)\narr.to_h { |n| [n, n * n] }",
    },
  },
  {
    id: "cr-019",
    categoryId: "code-reading",
    difficulty: "intermediate",
    type: "choice",
    question: "次のコードの出力は？",
    code: 'class Foo\n  def initialize(arr); @arr = arr; end\n  def double; @arr.map { |n| n * 2 }; end\nend\n\nf = Foo.new([1, 2, 3])\nputs f.double.sum',
    choices: ["1 2 3", "12", "6", "[2, 4, 6]"],
    answerIndex: 1,
    hints: [
      "double は [2, 4, 6] を返す。",
      "sum で合計を計算。",
      "2 + 4 + 6 = 12。",
    ],
    explanation: {
      summary:
        "メソッドの戻り値にさらにメソッドチェーン。`double` が配列を返すので `.sum` が呼べる。",
      reason:
        "メソッドを小さく分けて、メソッドチェーンで組み立てる Ruby らしい書き方。`@arr.map(&:double)` のように even shorter にも書ける。",
      codeExample:
        "f.double      #=> [2, 4, 6]\nf.double.sum  #=> 12\nf.double.max  #=> 6",
    },
  },
  {
    id: "cr-020",
    categoryId: "code-reading",
    difficulty: "advanced",
    type: "choice",
    question: "次のコードの出力は？",
    code: 'arr = [1, 2, 3]\nresult = arr.zip([10, 20, 30]).map { |a, b| a + b }\np result',
    choices: [
      "[10, 40, 90]",
      "[[1, 10], [2, 20], [3, 30]]",
      "[11, 22, 33]",
      "[1, 2, 3, 10, 20, 30]",
    ],
    answerIndex: 2,
    hints: [
      "zip で [[1,10], [2,20], [3,30]] になる。",
      "map のブロック引数 |a, b| で各ペアを分解。",
      "a + b で 11, 22, 33。",
    ],
    explanation: {
      summary:
        "zip でペア化 → map のブロック引数で分解 → 各ペアを加算。",
      reason:
        "2 つの配列の要素ごとの計算で頻出パターン。zip + map (or transpose) で並列処理。`[arr1, arr2].transpose` も同等。",
      codeExample:
        "[1, 2, 3].zip([10, 20, 30]).map { |a, b| a + b }\n#=> [11, 22, 33]\n\n# transpose 版\n[[1, 2, 3], [10, 20, 30]].transpose.map { |a, b| a + b }\n\n# 3 配列\n[1,2].zip([3,4], [5,6])     #=> [[1,3,5], [2,4,6]]",
    },
  },
  {
    id: "cr-021",
    categoryId: "code-reading",
    difficulty: "advanced",
    type: "choice",
    question: "次のコードの出力は？",
    code: 'puts (1..10).each_with_index.select { |n, i| i.even? }.map(&:first).sum',
    choices: [
      "25",
      "30",
      "55",
      "15",
    ],
    answerIndex: 0,
    hints: [
      "each_with_index で [(1,0), (2,1), ..., (10,9)]。",
      "select で index が偶数のペア = [(1,0), (3,2), (5,4), (7,6), (9,8)]。",
      "map(&:first) で [1, 3, 5, 7, 9]、合計 25。",
    ],
    explanation: {
      summary:
        "Range → each_with_index → select (偶数インデックス) → 値だけ取り出し → 合計。最終的に奇数の和 = 25。",
      reason:
        "Enumerator チェーンの実例。`each_with_index` は (要素, 0始まりインデックス) のペアを返す。select のブロック引数 `|n, i|` で分解、map(&:first) で要素だけ抜き出す。",
      codeExample:
        "(1..10).each_with_index.select { |n, i| i.even? }.map(&:first).sum\n#=> 25 (1 + 3 + 5 + 7 + 9)\n\n# 同じ意味でもっと素直\n(1..10).each_slice(2).map(&:first).sum    #=> 25\n(1..10).step(2).sum                       #=> 25",
    },
  },
  {
    id: "cr-022",
    categoryId: "code-reading",
    difficulty: "advanced",
    type: "choice",
    question: "次のコードの出力は？",
    code: 'class Animal\n  def speak; "generic sound"; end\nend\n\nclass Dog < Animal\n  def speak; "wan!"; end\nend\n\nclass Puppy < Dog\nend\n\nputs Puppy.new.speak\nputs Puppy.ancestors.first(3).inspect',
    choices: [
      "wan! / [Dog, Puppy, Animal]",
      "generic sound / [Animal]",
      "wan! / [Puppy, Dog, Animal]",
      "generic sound / [Puppy, Animal, Dog]",
    ],
    answerIndex: 2,
    hints: [
      "Puppy は Dog のサブクラス、Dog の speak を継承。",
      "ancestors の先頭は自分、次に親、その次に祖父。",
      "[Puppy, Dog, Animal] の順。",
    ],
    explanation: {
      summary:
        "継承チェーン: Puppy → Dog → Animal → Object。Puppy.speak は最も近い Dog#speak を呼ぶ。",
      reason:
        "Ruby のメソッド探索は ancestors の順 (自分 → 親 → ... → Object)。`Puppy.ancestors` で [Puppy, Dog, Animal, Object, ...] が返る。include した Module もこのチェーンに入る。",
      codeExample:
        "Puppy.ancestors\n#=> [Puppy, Dog, Animal, Object, ...]\n\nclass Cat < Animal\n  include Comparable\nend\nCat.ancestors\n#=> [Cat, Comparable, Animal, Object, ...]",
    },
  },
  {
    id: "cr-023",
    categoryId: "code-reading",
    difficulty: "advanced",
    type: "choice",
    question: "次のコードの出力は？",
    code: 'h = Hash.new { |hash, key| hash[key] = "default-#{key}" }\nputs h[:foo]\nputs h[:foo]\nputs h.keys.inspect',
    choices: [
      "default-foo / default-foo / [:foo]",
      "default-foo / default-foo / []",
      "nil / nil / []",
      "default-foo / nil / [:foo]",
    ],
    answerIndex: 0,
    hints: [
      "Hash.new のブロックは未定義キーアクセス時に呼ばれ、値を生成 + 格納。",
      "1 回目アクセスで :foo が格納される。",
      "2 回目は既に格納済みなのでブロックは呼ばれず default-foo を返す。",
    ],
    explanation: {
      summary:
        "ブロック付き `Hash.new` は『未定義キーで何を返すか + 副作用 (格納)』を定義可能。1 度生成すると以降は同じ値を返す。",
      reason:
        "メモ化や遅延初期化のパターン。`hash[key] = default` の代入式自体が default を返すので、シンプル。",
      codeExample:
        "# メモ化\nfib = Hash.new do |h, n|\n  h[n] = n < 2 ? n : h[n - 1] + h[n - 2]\nend\nfib[10]    #=> 55\n\n# キャッシュ\ncache = Hash.new do |h, url|\n  h[url] = Net::HTTP.get(URI(url))\nend",
    },
  },
  {
    id: "cr-024",
    categoryId: "code-reading",
    difficulty: "advanced",
    type: "choice",
    question: "次のコードの出力は？",
    code: 'a = "hello"\nb = "hello"\nc = a\nputs a.equal?(b)\nputs a.equal?(c)',
    choices: [
      "false / false",
      "true / false",
      "false / true",
      "true / true",
    ],
    answerIndex: 2,
    hints: [
      "通常の文字列リテラルは毎回新しいオブジェクト。",
      "代入は参照コピーなので同一オブジェクト。",
      "frozen_string_literal が無ければ a と b は別オブジェクト。",
    ],
    explanation: {
      summary:
        "文字列リテラルは (frozen_string_literal 無効時) 毎回新規。代入は参照コピーなので同じオブジェクト。",
      reason:
        "`equal?` は object_id 比較。a と b は内容同じだが別オブジェクト = false。c = a で c も同じオブジェクトを指すので true。`# frozen_string_literal: true` を書くと同じ内容のリテラルは共有される。",
      codeExample:
        '"a".equal?("a")        #=> false\n"a".object_id          #=> 毎回違う\n\n# frozen_string_literal: true (マジックコメント)\n# "a".equal?("a")     #=> true (共有)\n# "a".object_id       #=> 同じ\n\n# Symbol は常に共有\n:a.equal?(:a)          #=> true',
    },
  },
  {
    id: "cr-025",
    categoryId: "code-reading",
    difficulty: "advanced",
    type: "choice",
    question: "次のコードの出力は？",
    code: 'begin\n  raise "first"\nrescue => e\n  begin\n    raise "second"\n  rescue => e2\n    puts e2.message\n    puts e2.cause.message\n  end\nend',
    choices: [
      "second / second",
      "second / first",
      "first / second",
      "first / first",
    ],
    answerIndex: 1,
    hints: [
      "rescue 内で再度 raise すると、元の例外が e.cause として記録される。",
      "e2 は 'second'、e2.cause は最初の 'first'。",
      "例外の連鎖 (chain) を遡れる。",
    ],
    explanation: {
      summary:
        "rescue 内で発生 / 再 raise した例外は、元の例外を `.cause` として保持する (例外チェーン)。",
      reason:
        "Ruby 2.1+ の例外チェーン。デバッグ時に『この例外の元になった例外』を辿れる。Sentry / Bugsnag 等のエラー監視 SaaS もこれを表示する。",
      codeExample:
        "begin\n  begin\n    raise IOError, 'file not found'\n  rescue => e\n    raise RuntimeError, 'failed to load'\n  end\nrescue => e\n  puts e.message       # failed to load\n  puts e.cause.message # file not found\n  puts e.cause.class   # IOError\nend",
    },
  },
  {
    id: "cr-026",
    categoryId: "code-reading",
    difficulty: "advanced",
    type: "choice",
    question: "次のコードの出力は？",
    code: 'class A\n  def m; "A"; end\nend\n\nmodule M1\n  def m; "M1 " + super; end\nend\n\nmodule M2\n  def m; "M2 " + super; end\nend\n\nclass B < A\n  include M1\n  include M2\nend\n\nputs B.new.m',
    choices: [
      "A M1 M2",
      "B M1 M2 A",
      "M2 M1 A",
      "M1 M2 A",
    ],
    answerIndex: 2,
    hints: [
      "include の順は祖先チェーンで逆になる (後 include した方が先)。",
      "B.ancestors = [B, M2, M1, A, ...]。",
      "B#m → M2#m → M1#m → A#m の順で super。",
    ],
    explanation: {
      summary:
        "後で include した Module の方が祖先チェーンで先 (= 優先)。`B.ancestors` は [B, M2, M1, A, ...]。",
      reason:
        "include は祖先チェーンの『先頭側』にスタックされる。後で include した方が新しいので、メソッド探索でも先に見つかる。複数 Mixin の優先順位を理解する基本。",
      codeExample:
        "B.ancestors\n#=> [B, M2, M1, A, Object, ...]\n\n# super チェーン\n# B#m が無い → M2#m が呼ばれる\n# M2#m の super → M1#m\n# M1#m の super → A#m\n# = 'M2 M1 A'",
    },
  },
  {
    id: "cr-027",
    categoryId: "code-reading",
    difficulty: "advanced",
    type: "choice",
    question: "次のコードの出力は？",
    code: 'arr = [1, 2, 3, 4]\nresult = arr.group_by(&:even?).transform_values(&:sum)\np result',
    choices: [
      "{false=>4, true=>6}",
      "{true=>4, false=>6}",
      "{true=>[2,4], false=>[1,3]}",
      "10",
    ],
    answerIndex: 0,
    hints: [
      "group_by(&:even?) で {true=>[2,4], false=>[1,3]}。",
      "transform_values で各値 (配列) を sum 化。",
      "true → 6 (2+4), false → 4 (1+3)。",
    ],
    explanation: {
      summary:
        "group_by で分類 → transform_values で各グループに集計関数適用。チェーンで集計処理が綺麗に書ける。",
      reason:
        "SQL の GROUP BY + 集計関数のような構造。`group_by(&:キー).transform_values(&:count)` で件数集計、`(&:sum)` で合計、`(&:size)` でも可。",
      codeExample:
        "users.group_by(&:role).transform_values(&:count)\n#=> {admin: 3, user: 17}\n\norders.group_by { |o| o.created_at.to_date }\n      .transform_values { |list| list.sum(&:price) }\n#=> {Date(2024-01-15) => 5000, ...}\n\n# tally でも書ける (頻度カウント特化)\nusers.map(&:role).tally    #=> {admin: 3, user: 17}",
    },
  },

  // ===========================================================================
  // 🛤️ Rails 規約 追加 (rails-011〜rails-025, 15問)
  // ===========================================================================
  {
    id: "rails-011",
    categoryId: "rails-convention",
    difficulty: "beginner",
    type: "text",
    question:
      "Rails で User モデルに対応するコントローラの慣習的なクラス名は？ (CamelCase)",
    answers: ["UsersController"],
    hints: [
      "コントローラ名は『複数形 + Controller』が慣習。",
      "User → Users + Controller。",
      "ファイルは app/controllers/users_controller.rb (snake_case)。",
    ],
    explanation: {
      summary:
        "コントローラは複数形 + Controller (例: UsersController)。ファイル名は snake_case。",
      reason:
        "RESTful 設計に従って『リソース集合』を扱うので複数形。Rails 規約: モデル単数 (User)、コントローラ複数 (UsersController)、テーブル複数 (users)、ファイル名は snake_case。",
      codeExample:
        "# app/models/user.rb\nclass User < ApplicationRecord; end\n\n# app/controllers/users_controller.rb\nclass UsersController < ApplicationController\n  def index; @users = User.all; end\nend\n\n# config/routes.rb\nresources :users",
    },
  },
  {
    id: "rails-012",
    categoryId: "rails-convention",
    difficulty: "beginner",
    type: "choice",
    question:
      "Rails アプリのディレクトリ構成で、ビジネスロジックを書くフォルダは？",
    choices: [
      "app/views",
      "app/controllers",
      "config",
      "app/models",
    ],
    answerIndex: 3,
    hints: [
      "MVC の M (Model) はビジネスロジック層。",
      "View は表示、Controller は仲介、config は設定。",
      "Fat Model, Skinny Controller の原則。",
    ],
    explanation: {
      summary:
        "Rails の MVC: Model がビジネスロジック層。Controller は薄く、Model にロジックを集める。",
      reason:
        "古典的な Rails のベストプラクティス『Fat Model, Skinny Controller』。Model が大きくなりすぎる場合は Service Object (app/services/)、Concern (app/models/concerns/) などに分割する。",
      codeExample:
        "# app/models/post.rb\nclass Post < ApplicationRecord\n  belongs_to :user\n  has_many :comments\n\n  scope :published, -> { where.not(published_at: nil) }\n\n  def publish!\n    update!(published_at: Time.current)\n    NotifyJob.perform_later(self)\n  end\nend",
    },
  },
  {
    id: "rails-013",
    categoryId: "rails-convention",
    difficulty: "beginner",
    type: "choice",
    question:
      "Rails アプリの環境別設定ファイルが置かれる場所は？",
    choices: [
      "settings/",
      "config/environments/",
      "config/environment/",
      "app/config/",
    ],
    answerIndex: 1,
    hints: [
      "config 配下に environments (複数形) ディレクトリ。",
      "development.rb / test.rb / production.rb の 3 つが標準。",
      "RAILS_ENV で切り替え。",
    ],
    explanation: {
      summary:
        "`config/environments/{development,test,production}.rb` で環境別設定。",
      reason:
        "各ファイルで `Rails.application.configure do ... end` ブロックに設定を書く。共通設定は `config/application.rb`。`RAILS_ENV` 環境変数で切替。`Rails.env.production?` でコード内判定。",
      codeExample:
        "# config/environments/production.rb\nRails.application.configure do\n  config.cache_classes = true\n  config.eager_load = true\n  config.consider_all_requests_local = false\n  config.action_controller.perform_caching = true\n  config.log_level = :info\n  config.force_ssl = true\nend\n\n# Rails.env\nRails.env                #=> 'development'\nRails.env.production?    #=> false\nRails.env.development?   #=> true",
    },
  },
  {
    id: "rails-014",
    categoryId: "rails-convention",
    difficulty: "intermediate",
    type: "choice",
    question:
      "Rails で名前空間付きモデル `Admin::User` のファイル配置は？",
    choices: [
      "app/models/Admin/User.rb",
      "app/models/admin_user.rb",
      "app/admin/models/user.rb",
      "app/models/admin/user.rb",
    ],
    answerIndex: 3,
    hints: [
      "Module 名 (Admin) は snake_case でディレクトリ化。",
      "Class 名 (User) は snake_case でファイル名。",
      "Zeitwerk autoloader は `モジュール名/クラス名.rb` の規約。",
    ],
    explanation: {
      summary:
        "名前空間 `Admin::User` → ファイル `app/models/admin/user.rb` (snake_case + ディレクトリ)。",
      reason:
        "Rails 6+ の Zeitwerk autoloader は『定数 ↔ ファイルパス』を厳格に対応付ける。`Admin::User` → `admin/user.rb`。違反すると autoload エラー (`expected file ... to define Admin::User`)。`zeitwerk:check` で違反検出。",
      codeExample:
        "# app/models/admin/user.rb\nmodule Admin\n  class User < ApplicationRecord\n    self.table_name = 'admin_users'\n  end\nend\n\n# app/controllers/admin/users_controller.rb\nmodule Admin\n  class UsersController < ApplicationController; end\nend\n\n# config/routes.rb\nnamespace :admin do\n  resources :users\nend",
    },
  },
  {
    id: "rails-015",
    categoryId: "rails-convention",
    difficulty: "intermediate",
    type: "choice",
    question:
      "Rails で『複数モデルに共通の機能』を切り出す慣習的な場所は？",
    choices: [
      "config/concerns/",
      "app/models/concerns/",
      "app/lib/",
      "app/shared/",
    ],
    answerIndex: 1,
    hints: [
      "concern (関心事) という名前。",
      "ActiveSupport::Concern を使う Module 群を置く。",
      "コントローラ用は app/controllers/concerns/ にも。",
    ],
    explanation: {
      summary:
        "Model 共通機能は `app/models/concerns/`、Controller 共通機能は `app/controllers/concerns/`。",
      reason:
        "Rails 4+ で導入された慣習。`extend ActiveSupport::Concern` した Module を置く。`include` するだけで Model にメソッド / scope / callbacks を注入できる。Soft Delete / Trackable / Auditable などの横断的機能に最適。",
      codeExample:
        "# app/models/concerns/soft_deletable.rb\nmodule SoftDeletable\n  extend ActiveSupport::Concern\n\n  included do\n    scope :active, -> { where(deleted_at: nil) }\n  end\n\n  def soft_delete!\n    update!(deleted_at: Time.current)\n  end\nend\n\n# 使用\nclass Post < ApplicationRecord\n  include SoftDeletable\nend\nPost.active",
    },
  },
  {
    id: "rails-016",
    categoryId: "rails-convention",
    difficulty: "intermediate",
    type: "text",
    question:
      "Rails で Gem を管理するファイル名は？(拡張子なし、英大文字始まり)",
    answers: ["Gemfile"],
    hints: [
      "拡張子なし、大文字 G 始まり。",
      "依存定義ファイル。ロック版は Gemfile.lock。",
      "Bundler が読み込む。",
    ],
    explanation: {
      summary:
        "`Gemfile` (拡張子なし、ルートに配置) で Bundler が依存を解決。`Gemfile.lock` がバージョンロック。",
      reason:
        "`bundle install` で `Gemfile` を解決し `Gemfile.lock` を生成。デプロイ時は lock を使って同一バージョンを再現。`group :development, :test do ... end` で環境別、`gem 'x', '~> 1.2'` でバージョン制約。",
      codeExample:
        "# Gemfile\nsource 'https://rubygems.org'\nruby '3.3.0'\n\ngem 'rails', '~> 7.1'\ngem 'pg', '~> 1.5'\ngem 'puma'\n\ngroup :development, :test do\n  gem 'rspec-rails'\n  gem 'factory_bot_rails'\nend\n\ngroup :development do\n  gem 'bullet'\nend\n\n# コマンド\n# bundle install\n# bundle update <gem>\n# bundle exec rspec",
    },
  },
  {
    id: "rails-017",
    categoryId: "rails-convention",
    difficulty: "intermediate",
    type: "choice",
    question:
      "Rails で初期化処理 (環境問わず) を 1 度だけ実行するファイルの置き場は？",
    choices: [
      "tmp/init/",
      "config/initializers/",
      "app/initializers/",
      "config/setup/",
    ],
    answerIndex: 1,
    hints: [
      "config 配下の initializers ディレクトリ。",
      "アルファベット順に読み込まれる (load_initializer)。",
      "gem 設定や定数定義に使う。",
    ],
    explanation: {
      summary:
        "`config/initializers/*.rb` が起動時 1 回だけ実行される。アルファベット順読み込み。",
      reason:
        "gem 設定 / グローバル定数 / Rack ミドルウェア追加 / モンキーパッチ等を置く。`config/application.rb` の後・`Rails.application.initialize!` 前に実行。順序依存があるなら名前を `01_xxx.rb` のように prefix。",
      codeExample:
        "# config/initializers/sentry.rb\nSentry.init do |config|\n  config.dsn = ENV['SENTRY_DSN']\nend\n\n# config/initializers/rack_attack.rb\nclass Rack::Attack\n  throttle('login/ip', limit: 5, period: 1.minute) do |req|\n    req.ip if req.path == '/login'\n  end\nend\n\n# config/initializers/filter_parameter_logging.rb (デフォルト存在)\nRails.application.config.filter_parameters += [:password]",
    },
  },
  {
    id: "rails-018",
    categoryId: "rails-convention",
    difficulty: "intermediate",
    type: "choice",
    question:
      "Rails 7+ で『フロントエンド用 JS/CSS をバンドルする』のに使われる手法は？",
    choices: [
      "rake task",
      "importmap-rails (デフォルト) / esbuild / webpack",
      "webpacker のみ",
      "yarn install のみ",
    ],
    answerIndex: 1,
    hints: [
      "Rails 7 はデフォルトで importmap (no-build) を採用。",
      "esbuild / webpack / rollup を選ぶこともできる (rails new -j ...)。",
      "Rails 6 までの webpacker は引退済み。",
    ],
    explanation: {
      summary:
        "Rails 7+ のデフォルトは importmap-rails (no-build)。esbuild/webpack/rollup から選択可。",
      reason:
        "webpacker は重く廃止された。importmap は npm パッケージを <script type='importmap'> で直接ロードしビルド不要。エコシステムが大きい場合は esbuild (-j esbuild) や webpack (-j webpack) を選択。`bin/dev` で並行起動。",
      codeExample:
        "# Rails 新規作成時\nrails new myapp -j esbuild --css tailwind\n\n# importmap (デフォルト)\n# config/importmap.rb\npin '@hotwired/turbo-rails', to: 'turbo.min.js'\npin '@hotwired/stimulus', to: 'stimulus.min.js'\n\n# esbuild\n# package.json\n\"scripts\": {\n  \"build\": \"esbuild app/javascript/*.* --bundle --outdir=app/assets/builds\"\n}",
    },
  },
  {
    id: "rails-019",
    categoryId: "rails-convention",
    difficulty: "intermediate",
    type: "choice",
    question:
      "Rails で『リクエスト処理を別スレッド / プロセスに移譲する』ジョブシステムの抽象化レイヤーは？",
    choices: [
      "Action Mailer",
      "Active Job",
      "Active Storage",
      "Action Cable",
    ],
    answerIndex: 1,
    hints: [
      "Sidekiq / Resque / GoodJob 等を抽象化。",
      "perform_later / perform_now で実行制御。",
      "ActiveXxx 系の標準モジュール。",
    ],
    explanation: {
      summary:
        "Active Job は Sidekiq/Resque/SolidQueue/GoodJob 等のキューバックエンドを統一する抽象化レイヤー。",
      reason:
        "Rails の標準。`ApplicationJob < ActiveJob::Base` を継承して `perform(args)` を定義、`MyJob.perform_later(args)` で非同期実行。バックエンドは config で切り替え。`retry_on` / `discard_on` でリトライ戦略。",
      codeExample:
        "# app/jobs/welcome_job.rb\nclass WelcomeJob < ApplicationJob\n  queue_as :default\n  retry_on Net::OpenTimeout, wait: :polynomially_longer, attempts: 3\n  discard_on ActiveRecord::RecordNotFound\n\n  def perform(user_id)\n    user = User.find(user_id)\n    WelcomeMailer.greet(user).deliver_now\n  end\nend\n\n# 呼び出し\nWelcomeJob.perform_later(user.id)\n\n# config/application.rb\nconfig.active_job.queue_adapter = :sidekiq",
    },
  },
  {
    id: "rails-020",
    categoryId: "rails-convention",
    difficulty: "intermediate",
    type: "choice",
    question:
      "Rails で『画像 / ファイルアップロード』の標準モジュールは？",
    choices: [
      "Paperclip (旧)",
      "CarrierWave (gem)",
      "Action Pack",
      "Active Storage",
    ],
    answerIndex: 3,
    hints: [
      "Rails 5.2+ で標準採用。",
      "S3 / Google Cloud / Azure / ローカルを統一インターフェースで扱える。",
      "Active で始まる Rails 標準モジュール。",
    ],
    explanation: {
      summary:
        "Active Storage は Rails 5.2+ 標準のファイル添付。S3/GCS/Azure/Disk をストレージ抽象化。",
      reason:
        "Model に `has_one_attached :avatar` / `has_many_attached :images` で添付関連を宣言。バリアント (リサイズ) は image_processing + libvips。`rails active_storage:install` でマイグレーション生成。旧 gem (paperclip / carrierwave) からの移行が一般的。",
      codeExample:
        "# rails active_storage:install\n# rails db:migrate\n\n# config/storage.yml\namazon:\n  service: S3\n  bucket: my-bucket\n\n# config/environments/production.rb\nconfig.active_storage.service = :amazon\n\n# Model\nclass User < ApplicationRecord\n  has_one_attached :avatar\n  has_many_attached :photos\nend\n\n# 添付\nuser.avatar.attach(io: File.open('a.jpg'), filename: 'a.jpg')\nuser.avatar.url\n\n# View\n<%= image_tag user.avatar.variant(resize_to_limit: [200, 200]) %>",
    },
  },
  {
    id: "rails-021",
    categoryId: "rails-convention",
    difficulty: "intermediate",
    type: "choice",
    question:
      "Rails で WebSocket を扱う標準モジュールは？",
    choices: [
      "Action Cable",
      "Active WebSocket",
      "Action Stream",
      "Active Channel",
    ],
    answerIndex: 0,
    hints: [
      "Rails 5+ で標準採用。",
      "Channel / Connection 概念で実装。",
      "Action で始まる Rails モジュール。",
    ],
    explanation: {
      summary:
        "Action Cable は Rails 5+ の WebSocket フレームワーク。Channel と Connection で双方向通信。",
      reason:
        "Hotwire (Turbo Streams) のリアルタイム更新もこの上に乗っている。本番では Redis をパブサブとして使う。`rails g channel ChatRoom` で雛形生成。",
      codeExample:
        "# app/channels/chat_channel.rb\nclass ChatChannel < ApplicationCable::Channel\n  def subscribed\n    stream_from \"chat_#{params[:room]}\"\n  end\n  def speak(data)\n    ActionCable.server.broadcast(\"chat_#{params[:room]}\", message: data['msg'])\n  end\nend\n\n# JS\nimport consumer from 'channels/consumer'\nconsumer.subscriptions.create({ channel: 'ChatChannel', room: 'lobby' }, {\n  received(data) { console.log(data.message) }\n})",
    },
  },
  {
    id: "rails-022",
    categoryId: "rails-convention",
    difficulty: "advanced",
    type: "choice",
    question:
      "Rails 7+ で SSE / WebSocket 不要の『部分 HTML 更新』を実現する仕組みは？",
    choices: [
      "Turbo Streams / Turbo Frames",
      "Action Cable",
      "Rails UJS",
      "Webpacker",
    ],
    answerIndex: 0,
    hints: [
      "Hotwire の中核技術。",
      "サーバから HTML フラグメントを返してブラウザが部分置換。",
      "Turbo の名前が付くフレームワーク。",
    ],
    explanation: {
      summary:
        "Turbo Frames は『部分 DOM の遅延読込・置換』、Turbo Streams は『WebSocket / HTTP で HTML フラグメントを broadcast』。",
      reason:
        "SPA 並みの UX を JS ほぼ書かずに実現。Frame: `<turbo-frame id='x'>` で囲んだ部分だけ更新。Stream: サーバから `<turbo-stream action='append' target='items'>` を返して DOM 操作。Rails 7+ デフォルト。",
      codeExample:
        "# Controller\ndef create\n  @comment = @post.comments.create!(comment_params)\n  respond_to do |format|\n    format.turbo_stream  # app/views/comments/create.turbo_stream.erb\n    format.html { redirect_to @post }\n  end\nend\n\n# create.turbo_stream.erb\n<%= turbo_stream.append 'comments' do %>\n  <%= render @comment %>\n<% end %>\n\n# Model でブロードキャスト\nclass Comment < ApplicationRecord\n  belongs_to :post\n  broadcasts_to ->(c) { [c.post, :comments] }\nend",
    },
  },
  {
    id: "rails-023",
    categoryId: "rails-convention",
    difficulty: "advanced",
    type: "choice",
    question:
      "Rails 6+ で複数 DB を同時に扱う仕組みのキーワードは？",
    choices: [
      "Multi-tenancy",
      "Shards-only",
      "Multi-Database (database.yml の primary/replica + connects_to)",
      "Polyglot",
    ],
    answerIndex: 2,
    hints: [
      "primary / replica の役割分担、シャーディング両対応。",
      "Model に `connects_to database: { ... }` を書いて指定。",
      "Rails 6 で公式に多 DB 対応が標準化。",
    ],
    explanation: {
      summary:
        "Rails 6+ は config/database.yml で primary/replica を分け、Model から `connects_to` で接続切替。`ActiveRecord::Base.connected_to(role: :reading) do ... end` も使える。",
      reason:
        "読み書き分離・シャーディング・複数 DB を Rails 標準で扱える。Migration も DB 別 (`rails db:migrate:primary` 等)。Active Record の `automatic_role_switching` で GET → reading、POST → writing 自動。",
      codeExample:
        "# config/database.yml\nproduction:\n  primary:\n    database: my_primary\n  primary_replica:\n    database: my_replica\n    replica: true\n\n# app/models/application_record.rb\nclass ApplicationRecord < ActiveRecord::Base\n  connects_to database: { writing: :primary, reading: :primary_replica }\nend\n\n# 一時的に切替\nActiveRecord::Base.connected_to(role: :reading) do\n  User.count\nend",
    },
  },
  {
    id: "rails-024",
    categoryId: "rails-convention",
    difficulty: "advanced",
    type: "choice",
    question:
      "Rails 7.1+ で導入された『 dockerfile + Kamal による自前デプロイ』のキーワードは？",
    choices: [
      "Heroku Buildpack",
      "Mina",
      "Kamal (旧 MRSK)",
      "Capistrano",
    ],
    answerIndex: 2,
    hints: [
      "37signals (Basecamp) が開発したデプロイツール。",
      "Docker + SSH ベースで複数サーバに無停止デプロイ。",
      "Rails 7.1+ で `bin/kamal` が新規アプリに同梱されるようになった。",
    ],
    explanation: {
      summary:
        "Kamal は Docker コンテナを複数サーバに SSH 経由でデプロイする現代的なツール。Heroku 等の PaaS を自前 VPS に置き換える選択肢。",
      reason:
        "Capistrano の後継的存在。Docker による不変インフラ + SSH デプロイ + Traefik による無停止切替。AWS EC2 / Hetzner / DigitalOcean 等の VPS で Heroku 並みの体験。Rails 7.1+ の `rails new` で `bin/kamal` が生成される。",
      codeExample:
        "# config/deploy.yml\nservice: myapp\nimage: user/myapp\nservers:\n  - 1.2.3.4\nregistry:\n  username: user\n  password:\n    - KAMAL_REGISTRY_PASSWORD\nenv:\n  secret:\n    - RAILS_MASTER_KEY\n\n# デプロイ\nkamal setup       # 初回\nkamal deploy      # 通常\nkamal rollback\nkamal app exec --reuse 'bin/rails console'",
    },
  },
  {
    id: "rails-025",
    categoryId: "rails-convention",
    difficulty: "advanced",
    type: "choice",
    question:
      "Rails 7.1+ で『DB ベースのジョブキュー』として標準採用された gem は？",
    choices: [
      "Solid Queue",
      "Sidekiq",
      "Resque",
      "GoodJob",
    ],
    answerIndex: 0,
    hints: [
      "37signals / Rails team が開発。",
      "Redis 不要、PostgreSQL/MySQL/SQLite で動く。",
      "Solid シリーズ (Solid Cache, Solid Queue, Solid Cable) の 1 つ。",
    ],
    explanation: {
      summary:
        "Solid Queue は Rails 8 で標準採用予定の DB ベースジョブキュー。Redis 不要、Active Job バックエンドとして動く。",
      reason:
        "従来の Sidekiq は Redis 必須でインフラが増える。Solid Queue は DB のみで動くので小〜中規模アプリに最適。同様に Solid Cache (DB キャッシュ)、Solid Cable (Action Cable 用) も登場。Rails 8 では Redis なしで一式そろう。",
      codeExample:
        "# Gemfile\ngem 'solid_queue'\n\n# config/queue.yml\nproduction:\n  workers:\n    - queues: '*'\n      threads: 5\n      processes: 1\n\n# config/application.rb\nconfig.active_job.queue_adapter = :solid_queue\n\n# 起動 (Procfile.dev)\nworker: bin/rails solid_queue:start",
    },
  },

  // ===========================================================================
  // 🔀 ルーティング & コントローラ 追加 (rt-013〜rt-027, 15問)
  // ===========================================================================
  {
    id: "rt-013",
    categoryId: "routing-controller",
    difficulty: "beginner",
    type: "choice",
    question: "次の routes.rb で生成される URL は？",
    code: "resources :posts, only: [:index, :show]",
    choices: [
      "GET /posts のみ",
      "RESTful 全 7 アクション",
      "GET /posts/:id のみ",
      "GET /posts と GET /posts/:id のみ",
    ],
    answerIndex: 3,
    hints: [
      "`only:` で生成するアクションを限定。",
      "[:index, :show] = 一覧 + 詳細。",
      "create / update / destroy 等は生成されない。",
    ],
    explanation: {
      summary:
        "`only:` (or `except:`) で resources が生成するアクションを絞る。",
      reason:
        "API のように『一覧と詳細だけ』『書き込みなし』のリソースで便利。`only: [:index]` の単発もよく使う。`except: [:destroy]` で逆指定。`resource` (単数) は :index 無しで個別リソース用。",
      codeExample:
        "resources :posts, only: [:index, :show]\n# GET    /posts          posts#index\n# GET    /posts/:id       posts#show\n\nresources :posts, except: [:destroy]\n# 6 つ (destroy 除く)\n\nresource :profile        # 単数形 (index 無し、id 無し)\n# GET    /profile/new\n# GET    /profile\n# POST   /profile\n# GET    /profile/edit\n# PATCH  /profile\n# DELETE /profile",
    },
  },
  {
    id: "rt-014",
    categoryId: "routing-controller",
    difficulty: "beginner",
    type: "choice",
    question: "次のルートで posts#search を呼ぶ URL は？",
    code: "resources :posts do\n  collection do\n    get :search\n  end\nend",
    choices: [
      "GET /posts/search",
      "GET /posts/:id/search",
      "GET /search/posts",
      "POST /posts/search",
    ],
    answerIndex: 0,
    hints: [
      "collection は『コレクション全体』に対するアクション。",
      "個別 ID は含まない。",
      "/posts/search の形。",
    ],
    explanation: {
      summary:
        "`collection do` ブロック内のアクションは `/リソース/アクション` 形式 (id なし)。`member do` は `/リソース/:id/アクション`。",
      reason:
        "RESTful の枠を超えるカスタムアクションの定義方法。collection: 集合に対する操作 (検索/一括ダウンロード)、member: 個別に対する操作 (公開/複製)。",
      codeExample:
        "resources :posts do\n  collection do\n    get :search        # GET /posts/search\n    get :export        # GET /posts/export\n  end\n  member do\n    post :publish      # POST /posts/:id/publish\n    post :duplicate    # POST /posts/:id/duplicate\n  end\nend\n\n# 短縮形\nresources :posts do\n  get :search, on: :collection\n  post :publish, on: :member\nend",
    },
  },
  {
    id: "rt-015",
    categoryId: "routing-controller",
    difficulty: "beginner",
    type: "choice",
    question: "Rails の controller で `params` の中身として正しいのは？",
    choices: [
      "URL のクエリのみ",
      "POST ボディのみ",
      "Cookie 全部",
      "URL パラメータ・クエリ・POST ボディが統合された Hash 様オブジェクト",
    ],
    answerIndex: 3,
    hints: [
      "params は全リクエスト情報を統合した便利オブジェクト。",
      "ActionController::Parameters クラス。",
      "URL パラメータ + クエリ + ボディが 1 つに。",
    ],
    explanation: {
      summary:
        "`params` は URL パスパラメータ、クエリ、POST ボディが統合された ActionController::Parameters オブジェクト。",
      reason:
        "GET `/posts/42?q=ruby` でも POST `/posts` (body: `{title: 'x'}`) でも、コントローラからは `params[:id]` `params[:q]` `params[:title]` で一律にアクセス可能。Strong Parameters の `permit` を通すまでは生データ扱い。",
      codeExample:
        "# GET /posts/42?q=ruby&sort=new\ndef show\n  params[:id]      #=> '42' (文字列)\n  params[:q]       #=> 'ruby'\n  params[:sort]    #=> 'new'\nend\n\n# POST /posts\ndef create\n  params[:post]              # フォームのトップレベル\n  params.dig(:post, :title)  # ネスト Hash\nend\n\n# Strong Parameters\ndef post_params\n  params.require(:post).permit(:title, :body)\nend",
    },
  },
  {
    id: "rt-016",
    categoryId: "routing-controller",
    difficulty: "intermediate",
    type: "choice",
    question:
      "次のルートで `resources :users` の URL Helper の組合せとして正しいのは？",
    choices: [
      "all_users / find_user / make_user",
      "index_users / show_users",
      "users_path / user_path(@user) / new_user_path / edit_user_path(@user)",
      "users_path / show_user_path / create_user_path / destroy_user_path",
    ],
    answerIndex: 2,
    hints: [
      "resources が生成するヘルパーは `リソース_path` / `単数_path` の 2 系統。",
      "編集系は `edit_リソース_path(モデル)`、新規は `new_リソース_path`。",
      "id 必要なヘルパーはモデルを渡せば OK。",
    ],
    explanation: {
      summary:
        "URL Helper: `users_path` (一覧/作成) / `user_path(@u)` (詳細/更新/削除) / `new_user_path` / `edit_user_path(@u)`。",
      reason:
        "`_path` は相対 URL、`_url` はフル URL。Model インスタンスを渡せばパスが自動生成。`link_to '詳細', @user` のように直接モデル渡しもできる。`rails routes` で一覧確認。",
      codeExample:
        "# resources :users\nusers_path              # /users\nuser_path(@user)        # /users/1\nnew_user_path           # /users/new\nedit_user_path(@user)   # /users/1/edit\nusers_url               # http://example.com/users\n\n# 直接モデル渡し\nlink_to '詳細', @user      # = user_path(@user)\nredirect_to @user          # = redirect_to user_path(@user)\nform_with model: @user     # 新規なら POST /users、編集なら PATCH /users/1",
    },
  },
  {
    id: "rt-017",
    categoryId: "routing-controller",
    difficulty: "intermediate",
    type: "choice",
    question:
      "次のうち、特定アクションでのみ `before_action` をスキップする書き方は？",
    choices: [
      "before_action :authenticate!, skip: [:index]",
      "skip_before_action :authenticate!, only: [:index]",
      "no_before_action :authenticate!",
      "remove_before_action :authenticate!",
    ],
    answerIndex: 1,
    hints: [
      "skip_xxx 系のメソッドがある。",
      "親コントローラで設定された before_action を子で無効化。",
      "only: / except: で対象アクションを絞る。",
    ],
    explanation: {
      summary:
        "`skip_before_action :method, only: [...]` で親コントローラの before_action を一部解除。",
      reason:
        "ApplicationController で全 controller に認証をかけて、SessionsController#new (ログインフォーム) だけ skip する典型パターン。before_action だけでなく after_action / around_action にも対応 (skip_after_action 等)。",
      codeExample:
        "class ApplicationController < ActionController::Base\n  before_action :authenticate_user!\nend\n\nclass SessionsController < ApplicationController\n  skip_before_action :authenticate_user!, only: [:new, :create]\n  def new; end\n  def create; end\nend",
    },
  },
  {
    id: "rt-018",
    categoryId: "routing-controller",
    difficulty: "intermediate",
    type: "choice",
    question:
      "次のうち、routes でサブドメイン (例: api.example.com) を判定する書き方は？",
    choices: [
      "route_subdomain('api')",
      "match :api",
      "constraints subdomain: 'api'",
      "subdomain :api",
    ],
    answerIndex: 2,
    hints: [
      "constraints でサブドメイン / フォーマット等の制約を指定。",
      "subdomain: 'api' で 'api.example.com' のみマッチ。",
      "API モードと Web モードを 1 アプリで両立する時に便利。",
    ],
    explanation: {
      summary:
        "`constraints subdomain: 'api'` でサブドメイン制限。`constraints format: :json`、IP 制限、Proc も可。",
      reason:
        "API と Web を同じ Rails で実装する時、`api.example.com` だけ API として処理する設計に使う。`constraints lambda { |req| ... }` で動的制限も可能 (Maintenance Mode 等)。",
      codeExample:
        "# config/routes.rb\nconstraints subdomain: 'api' do\n  namespace :api, path: '' do\n    resources :posts\n  end\nend\n\n# 動的制限\nconstraints lambda { |req| req.headers['X-Internal'] == ENV['KEY'] } do\n  mount RailsAdmin::Engine => '/admin'\nend\n\n# フォーマット\nconstraints format: :json do\n  resources :posts\nend",
    },
  },
  {
    id: "rt-019",
    categoryId: "routing-controller",
    difficulty: "intermediate",
    type: "choice",
    question:
      "次のうち、Rails のリダイレクトで PRG (Post/Redirect/Get) パターンを正しく実装しているのは？",
    choices: [
      "全部 render",
      "POST 成功時 redirect_to @post, 失敗時 render :new, status: :unprocessable_entity",
      "POST 成功時 render :show, 失敗時 redirect_to :new",
      "POST 成功時 head :ok, 失敗時 head :error",
    ],
    answerIndex: 1,
    hints: [
      "PRG パターン: 成功時はリダイレクト (ブラウザの戻る → 再送信を防ぐ)。",
      "失敗時はバリデーションエラー込みで再 render (PRG しない、フォーム状態を保持)。",
      "Turbo (Rails 7+) では :unprocessable_entity が必須。",
    ],
    explanation: {
      summary:
        "PRG: 成功 = redirect (再送信防止)、失敗 = render :new + 422 (フォーム再表示)。",
      reason:
        "POST 後そのまま render すると、ブラウザ更新で再送信ダイアログが出る (PRG はそれを防ぐ)。失敗時は redirect すると入力値が消えるので、render で再描画してエラー表示。Turbo はフォーム失敗で 422 を期待。",
      codeExample:
        "def create\n  @post = current_user.posts.build(post_params)\n  if @post.save\n    redirect_to @post, notice: '作成しました'\n  else\n    render :new, status: :unprocessable_entity\n  end\nend\n\ndef destroy\n  @post.destroy\n  redirect_to posts_path, notice: '削除しました', status: :see_other\nend",
    },
  },
  {
    id: "rt-020",
    categoryId: "routing-controller",
    difficulty: "intermediate",
    type: "choice",
    question:
      "Controller で flash メッセージを表示する書き方として正しいのは？",
    choices: [
      "flash[:notice] = '保存しました' (render と組合せ可)",
      "1 と 3 の両方",
      "redirect_to @post, notice: '保存しました'",
      "render :show, notice: '保存しました'",
    ],
    answerIndex: 1,
    hints: [
      "flash は次のリクエストまでセッションに保持。",
      "redirect_to のオプション or flash[:key] = ... の 2 通り。",
      "render は同一リクエスト内なので flash の代わりに flash.now を使う。",
    ],
    explanation: {
      summary:
        "redirect_to のオプション (notice/alert) は flash[:notice]/[:alert] へのショートカット。render では flash.now を使う。",
      reason:
        "flash は『次のリクエスト』まで生存するので redirect_to と相性が良い。render なら同一リクエスト内で表示するために `flash.now[:notice] = ...` (次のリクエストには持ち越さない)。View では `<% if flash[:notice] %>` で表示。",
      codeExample:
        "redirect_to @post, notice: '保存しました'\nredirect_to @post, alert: 'エラー'\nredirect_to @post, flash: { custom: '...' }\n\nrender :new, status: :unprocessable_entity\nflash.now[:alert] = '入力エラー'\n\n# View\n<% if notice %>\n  <div class='notice'><%= notice %></div>\n<% end %>",
    },
  },
  {
    id: "rt-021",
    categoryId: "routing-controller",
    difficulty: "intermediate",
    type: "text",
    question:
      "Rails で『未対応の URL に対して 404 を返す』ためのコントローラフックメソッドは `rescue_from ActiveRecord::?????, with: :not_found` の ????? に入るクラス名は？(CamelCase)",
    answers: ["RecordNotFound"],
    hints: [
      "ActiveRecord で find が失敗時に投げる例外。",
      "404 と紐付ける慣用句。",
      "Record + 見つからない 英語。",
    ],
    explanation: {
      summary:
        "`rescue_from ActiveRecord::RecordNotFound, with: :not_found` で 404 ハンドラを統一。",
      reason:
        "User.find(99999) が見つからない時に RecordNotFound が投げられる。デフォルトでは Rails が 404 ページを表示するが、API では JSON で返したい等カスタマイズしたいことが多い。`ActionController::RoutingError` (未定義 URL) は別物。",
      codeExample:
        "class ApplicationController < ActionController::Base\n  rescue_from ActiveRecord::RecordNotFound, with: :not_found\n  rescue_from ActionController::ParameterMissing, with: :bad_request\n\n  private\n  def not_found\n    render json: { error: 'not found' }, status: :not_found\n  end\n\n  def bad_request(e)\n    render json: { error: e.message }, status: :bad_request\n  end\nend",
    },
  },
  {
    id: "rt-022",
    categoryId: "routing-controller",
    difficulty: "intermediate",
    type: "choice",
    question:
      "次のうち、Rails の View ヘルパー (link_to 等) をコントローラから使えるようにする宣言は？",
    choices: [
      "expose :name",
      "include AllHelpers",
      "helper_method :name_in_controller",
      "view_method :name",
    ],
    answerIndex: 2,
    hints: [
      "controller のメソッドを view から呼べるようにする。",
      "current_user / signed_in? 等の認証ヘルパーで頻出。",
      "helper_xxx 系のメソッド。",
    ],
    explanation: {
      summary:
        "`helper_method :name` で controller のメソッドを view からも呼べるようにする。`current_user` 等で必須。",
      reason:
        "通常 controller のメソッドは view から見えない。`helper_method :current_user, :signed_in?` で view 側にも公開。Devise / Sorcery 等の認証 gem が活用している。`helper` (S 無し) は HelperModule 全体を読み込む。",
      codeExample:
        "class ApplicationController < ActionController::Base\n  helper_method :current_user, :signed_in?\n\n  private\n  def current_user\n    @current_user ||= User.find_by(id: session[:user_id])\n  end\n  def signed_in?\n    !!current_user\n  end\nend\n\n# View\n<% if signed_in? %>\n  Hello, <%= current_user.name %>\n<% end %>",
    },
  },
  {
    id: "rt-023",
    categoryId: "routing-controller",
    difficulty: "intermediate",
    type: "choice",
    question:
      "次のうち、Rails の routes で『api/v1』を URL prefix にしつつ Controller を `Api::V1::PostsController` にする書き方は？",
    choices: [
      "scope :api do; scope :v1 do; resources :posts; end; end",
      "match 'api/v1/posts'",
      "prefix 'api/v1' { resources :posts }",
      "namespace :api do; namespace :v1 do; resources :posts; end; end",
    ],
    answerIndex: 3,
    hints: [
      "namespace は URL prefix + コントローラ module スコープを両方かける。",
      "scope は URL prefix のみ。",
      "API バージョニングの定番パターン。",
    ],
    explanation: {
      summary:
        "`namespace :api do; namespace :v1 do; ... end; end` で URL prefix + コントローラ module を両方適用。",
      reason:
        "API バージョニングの定番。URL = `/api/v1/posts`、Controller = `Api::V1::PostsController`。ファイル = `app/controllers/api/v1/posts_controller.rb`。`scope` は URL のみ、`scope module: 'admin'` はモジュールのみ。",
      codeExample:
        "namespace :api do\n  namespace :v1 do\n    resources :posts\n  end\n  namespace :v2 do\n    resources :posts\n  end\nend\n\n# Controller\nmodule Api\n  module V1\n    class PostsController < ApplicationController\n      def index; @posts = Post.all; end\n    end\n  end\nend\n\n# URL: /api/v1/posts → Api::V1::PostsController#index",
    },
  },
  {
    id: "rt-024",
    categoryId: "routing-controller",
    difficulty: "advanced",
    type: "choice",
    question:
      "Rails で『Controller のアクション全体を 1 つのトランザクションで囲む』のに使える gem / ヘルパーは？",
    choices: [
      "around_action + ActiveRecord::Base.transaction",
      "before_action :start_transaction",
      "after_action :commit",
      "Rails 標準では不可",
    ],
    answerIndex: 0,
    hints: [
      "around_action はアクション前後をブロックでラップできる。",
      "ブロック内に yield を呼ぶことでアクション本体を実行。",
      "transaction とブロック構造の組み合わせ。",
    ],
    explanation: {
      summary:
        "`around_action` でアクションを transaction で包める。ただし通常は Service Object 側で transaction を持つほうが望ましい。",
      reason:
        "around_action はリクエスト前後をブロックでラップ。yield でアクション本体を実行。transaction や時間計測、ログタグ付けで使う。とはいえ controller でロジックを抱え過ぎるのはアンチパターンで、ロジックは Service / Model に移すべき。",
      codeExample:
        "class ApplicationController < ActionController::Base\n  around_action :wrap_in_transaction, if: :write_action?\n\n  private\n  def wrap_in_transaction\n    ActiveRecord::Base.transaction do\n      yield\n    end\n  end\n\n  def write_action?\n    %w[create update destroy].include?(action_name)\n  end\nend",
    },
  },
  {
    id: "rt-025",
    categoryId: "routing-controller",
    difficulty: "advanced",
    type: "choice",
    question:
      "次のうち、Rails コントローラから 『JSON だけ受け付ける』ように制限する書き方は？",
    choices: [
      "render json: only",
      "skip_html_format",
      "format :json",
      "respond_to do |format|; format.json { ... }; end (他は 406)",
    ],
    answerIndex: 3,
    hints: [
      "respond_to ブロックで複数フォーマット分岐。",
      "json ブロックだけ書けば他のフォーマットは 406 Not Acceptable。",
      "JSON API でよく使うパターン。",
    ],
    explanation: {
      summary:
        "`respond_to do |format|; format.json { render json: ... }; end` で対応フォーマットを制限。",
      reason:
        "リクエストの Accept ヘッダ (or URL 末尾 .json) で振り分け。json ブロックのみ書けば HTML リクエストは 406 で拒否。`respond_to :json` をクラスレベルで宣言する短縮形もあるが、各 action でフォーマット指定するほうが明示的。",
      codeExample:
        "def index\n  @posts = Post.all\n  respond_to do |format|\n    format.html             # views/posts/index.html.erb\n    format.json { render json: @posts }\n    format.xml  { render xml: @posts }\n  end\nend\n\n# クラスレベル制限\nclass Api::PostsController < ApplicationController\n  respond_to :json\n\n  def index\n    respond_with Post.all\n  end\nend",
    },
  },
  {
    id: "rt-026",
    categoryId: "routing-controller",
    difficulty: "advanced",
    type: "choice",
    question:
      "次のうち、Rails 7+ で API モードのコントローラの基底クラスとして適切なのは？",
    choices: [
      "ActiveRecord::API",
      "ActionController::API (View/Cookies/CSRF 等を含まない軽量版)",
      "ActionController::Base (Web 用)",
      "ApplicationRecord",
    ],
    answerIndex: 1,
    hints: [
      "Web 用は ActionController::Base、API 専用の軽量版は別クラス。",
      "View レイヤー、CSRF、Cookies 等を含まないので速い。",
      "`rails new --api` で生成される雛形。",
    ],
    explanation: {
      summary:
        "`ActionController::API` は API 専用の軽量基底クラス。View レイヤー・CSRF・Cookies 等を含まないので高速。",
      reason:
        "`rails new myapp --api` で生成。ApplicationController が `< ActionController::API` になる。Web ページが不要 (JSON API のみ) なら軽量化が効く。後から `< ActionController::Base` に変えれば Web 機能も復活。",
      codeExample:
        "# rails new myapp --api\n\n# app/controllers/application_controller.rb\nclass ApplicationController < ActionController::API\nend\n\nclass PostsController < ApplicationController\n  def index\n    render json: Post.all\n  end\nend\n\n# Web も両立するなら Base のままにして、API は別 namespace\nclass Api::ApplicationController < ActionController::API\nend",
    },
  },
  {
    id: "rt-027",
    categoryId: "routing-controller",
    difficulty: "advanced",
    type: "choice",
    question:
      "次のうち、Rails コントローラのキャッシュ機構として『View レンダリング全体を保存・再利用』するヘルパーは？",
    choices: [
      "method cache",
      "url_cache",
      "csrf_cache",
      "fragment cache (`<% cache @post do %> ... <% end %>`)",
    ],
    answerIndex: 3,
    hints: [
      "View 内で `cache` ヘルパーを使う。",
      "key にモデルを渡すと updated_at を見て自動失効。",
      "ロシアンドール (nested) パターンも可能。",
    ],
    explanation: {
      summary:
        "View 内の `<% cache @model do %>` でフラグメントキャッシュ。updated_at が変わると自動失効。ネストでロシアンドール。",
      reason:
        "重い View 描画 (リレーション含む) を Memcached/Redis にキャッシュ。`@model.cache_key` (例: `posts/1-20240115...`) でキー化されるので、更新時に自動失効。ネスト構造 (post の中に comment が cache) で内側だけ失効するロシアンドール。",
      codeExample:
        "# View (posts/_post.html.erb)\n<% cache @post do %>\n  <h1><%= @post.title %></h1>\n  <%= @post.body %>\n  <% @post.comments.each do |c| %>\n    <% cache c do %>\n      <p><%= c.body %></p>\n    <% end %>\n  <% end %>\n<% end %>\n\n# 設定 (config/environments/production.rb)\nconfig.action_controller.perform_caching = true\nconfig.cache_store = :redis_cache_store, { url: ENV['REDIS_URL'] }",
    },
  },

  // ===========================================================================
  // 🗄️ ActiveRecord 追加 (ar-024〜ar-038, 15問)
  // ===========================================================================
  {
    id: "ar-024",
    categoryId: "active-record",
    difficulty: "beginner",
    type: "choice",
    question:
      "User.where(active: true).first と User.find_by(active: true) の違いは？",
    choices: [
      "find_by は遅い",
      "ほぼ同じ (どちらも 1 件取得、無ければ nil)。find_by の方が意図が明確",
      "where.first は配列を返す",
      "find_by は ID 必須",
    ],
    answerIndex: 1,
    hints: [
      "両者とも条件にマッチする最初の 1 件を返す。",
      "無ければ nil。",
      "find_by の方が短く、意図が明示的。",
    ],
    explanation: {
      summary:
        "`find_by(条件)` は `where(条件).first` と同等。1 件取得 + 無ければ nil。`find_by!` は例外版。",
      reason:
        "`find(id)` は ID 指定 + 無ければ例外 (RecordNotFound)。`find_by` は任意条件 + 無ければ nil。`find_by!` で例外バリアントも使える。コード意図が明確になるので find_by 推奨。",
      codeExample:
        "User.find_by(email: 'a@x')      #=> User or nil\nUser.find_by!(email: 'a@x')     # 無ければ RecordNotFound\nUser.where(email: 'a@x').first  # 同等だが冗長\n\n# 複数条件\nUser.find_by(role: 'admin', active: true)",
    },
  },
  {
    id: "ar-025",
    categoryId: "active-record",
    difficulty: "beginner",
    type: "choice",
    question: "次のコードの SQL イメージは？",
    code: "User.where(name: nil)",
    choices: [
      "WHERE name = ''",
      "WHERE name = NULL",
      "WHERE name IS NULL",
      "WHERE name = 'nil'",
    ],
    answerIndex: 2,
    hints: [
      "Ruby の nil は SQL の NULL。",
      "ActiveRecord が自動的に IS NULL に変換。",
      "`= NULL` ではマッチしない (SQL の仕様)。",
    ],
    explanation: {
      summary:
        "`where(col: nil)` は SQL `WHERE col IS NULL` に変換される (= NULL ではマッチしないので AR が正しく処理)。",
      reason:
        "SQL では NULL = NULL は UNKNOWN になり真にならない。AR は nil を見たら自動で `IS NULL` に変換。逆は `where.not(col: nil)` で `IS NOT NULL`。`where(col: [nil, ''])` のような混在も正しく処理。",
      codeExample:
        "User.where(deleted_at: nil)            # WHERE deleted_at IS NULL\nUser.where.not(deleted_at: nil)        # WHERE deleted_at IS NOT NULL\nUser.where(name: ['Alice', nil])       # WHERE name IN ('Alice') OR name IS NULL\n\n# 範囲\nUser.where(age: 18..)                  # WHERE age >= 18\nUser.where(age: ..18)                  # WHERE age <= 18\nUser.where(age: 18..60)                # WHERE age BETWEEN 18 AND 60",
    },
  },
  {
    id: "ar-026",
    categoryId: "active-record",
    difficulty: "beginner",
    type: "text",
    question:
      "ActiveRecord の関連で『has_many と belongs_to の組合せ』を作るための、子テーブル側に必要なカラム名 (規約) は？(snake_case)",
    answers: ["user_id", "<親モデル名>_id", "parent_id"],
    hints: [
      "親のクラス名を snake_case にして _id を付ける。",
      "User has_many :posts なら posts テーブルに ??_id。",
      "外部キーカラムの命名規約。",
    ],
    explanation: {
      summary:
        "関連先モデル名 (単数) を snake_case にして `_id` を付けた外部キーカラム (例: `user_id`)。",
      reason:
        "Rails の規約。`User has_many :posts` + `Post belongs_to :user` なら posts テーブルに `user_id` (Integer)。マイグレーションで `t.references :user` または `add_reference :posts, :user, foreign_key: true` で生成。null: false + DB INDEX を必ず付ける。",
      codeExample:
        "# マイグレーション\nclass CreatePosts < ActiveRecord::Migration[7.1]\n  def change\n    create_table :posts do |t|\n      t.string :title\n      t.references :user, null: false, foreign_key: true\n      t.timestamps\n    end\n  end\nend\n\n# Model\nclass User < ApplicationRecord\n  has_many :posts, dependent: :destroy\nend\n\nclass Post < ApplicationRecord\n  belongs_to :user\nend",
    },
  },
  {
    id: "ar-027",
    categoryId: "active-record",
    difficulty: "intermediate",
    type: "choice",
    question:
      "次の Migration はどの操作を実行する？",
    code: "class AddIndexToUsersEmail < ActiveRecord::Migration[7.1]\n  def change\n    add_index :users, :email, unique: true\n  end\nend",
    choices: [
      "user_id にプライマリキーを追加",
      "外部キー制約を追加",
      "users.email に UNIQUE INDEX を追加",
      "email カラム自体を追加",
    ],
    answerIndex: 2,
    hints: [
      "add_index はインデックス追加。",
      "unique: true で UNIQUE 制約付き。",
      "メールアドレスの重複防止に有効。",
    ],
    explanation: {
      summary:
        "`add_index :users, :email, unique: true` で UNIQUE INDEX を追加。重複登録を DB レベルで防ぐ + 高速検索。",
      reason:
        "Model の uniqueness バリデーションだけだと race condition で重複が入りうる。DB の UNIQUE INDEX が最終防衛。同時に検索性能も向上。複合インデックスは `[:user_id, :post_id]` のように配列で渡す。",
      codeExample:
        "# 単一カラム\nadd_index :users, :email, unique: true\n\n# 複合インデックス\nadd_index :likes, [:user_id, :post_id], unique: true\n\n# 部分インデックス (PostgreSQL)\nadd_index :users, :email, unique: true, where: 'deleted_at IS NULL'\n\n# 削除\nremove_index :users, :email",
    },
  },
  {
    id: "ar-028",
    categoryId: "active-record",
    difficulty: "intermediate",
    type: "choice",
    question: "次のコードの SQL イメージは？",
    code: "User.includes(:posts).where(active: true)",
    choices: [
      "users だけ取得",
      "posts だけ取得",
      "users を取得 (active=true) + 別クエリで posts を IN で一括取得 (N+1 対策)",
      "users と posts を 1 つの JOIN で取得",
    ],
    answerIndex: 2,
    hints: [
      "includes は N+1 対策のための事前ロード。",
      "通常は 2 回のクエリ (users SELECT + posts WHERE user_id IN ...)。",
      "where 条件が posts に絡まない限り JOIN にはならない。",
    ],
    explanation: {
      summary:
        "`includes(:posts)` で users + posts を 2 クエリで事前ロード (preload 戦略)。posts 側に条件があると eager_load (LEFT JOIN) になる。",
      reason:
        "AR の includes は賢く preload / eager_load を切り替える。条件が関連テーブルに無ければ preload (別クエリ)、有れば eager_load (JOIN)。明示的にしたいなら `preload(:posts)` / `eager_load(:posts)` を直接使う。",
      codeExample:
        "# preload 戦略 (2 クエリ)\nUser.includes(:posts).where(active: true)\n# SELECT * FROM users WHERE active = true;\n# SELECT * FROM posts WHERE user_id IN (1, 2, 3, ...);\n\n# eager_load 戦略 (1 クエリ JOIN)\nUser.includes(:posts).where(posts: { published: true })\n# SELECT * FROM users LEFT JOIN posts ON ... WHERE posts.published = true\n\n# 明示\nUser.preload(:posts)        # 必ず別クエリ\nUser.eager_load(:posts)     # 必ず JOIN",
    },
  },
  {
    id: "ar-029",
    categoryId: "active-record",
    difficulty: "intermediate",
    type: "choice",
    question:
      "ActiveRecord の callback で『DB 書き込み完了 + transaction commit 後』に実行されるのは？",
    choices: [
      "after_update",
      "after_commit",
      "after_save",
      "after_create",
    ],
    answerIndex: 1,
    hints: [
      "after_save / after_create はトランザクション内なのでロールバックする可能性あり。",
      "メール送信や Job キューイング等の『取り返しがつかない処理』は commit 後が安全。",
      "after で始まる commit 関連の callback。",
    ],
    explanation: {
      summary:
        "`after_commit` はトランザクションがコミットされた後に実行される。メール送信・Job 投入・外部 API 通知に最適。",
      reason:
        "`after_save` / `after_create` / `after_update` は『コミット前』なので、ロールバックされた場合も実行されてしまう。`after_commit on: :create` のように分岐可能。`after_commit_everywhere` gem や `after_commit_callbacks` で柔軟化。",
      codeExample:
        "class User < ApplicationRecord\n  after_commit :send_welcome_email, on: :create\n  after_commit :notify_change,     on: %i[update destroy]\n\n  private\n\n  def send_welcome_email\n    WelcomeMailer.greet(self).deliver_later\n  end\n\n  def notify_change\n    NotifyJob.perform_later(id)\n  end\nend",
      commonMistakes: [
        "after_save / after_create でメール送信 / Job 投入すると、トランザクションがロールバックされても外部効果が発生する罠。after_commit を使う。",
      ],
    },
  },
  {
    id: "ar-030",
    categoryId: "active-record",
    difficulty: "intermediate",
    type: "choice",
    question:
      "次のうち、ActiveRecord の `validates :name, presence: true` で防げないものは？",
    choices: [
      "Rails コードからの空文字 / nil",
      "新規作成の空名前",
      "全角空白だけの名前 (presence は空文字扱い)",
      "DB の他クライアントから直接 NULL を INSERT される",
    ],
    answerIndex: 3,
    hints: [
      "Model のバリデーションは Rails アプリ経由でのみ動く。",
      "DB 直接アクセス (psql, 他言語アプリ) は素通り。",
      "最終防衛は DB の NOT NULL 制約。",
    ],
    explanation: {
      summary:
        "Model のバリデーションは Rails 経由でのみ効く。DB 直書き / 他アプリの INSERT は防げない。NOT NULL 制約 + UNIQUE INDEX が最終防衛。",
      reason:
        "AR のバリデーションは『便利な防壁』だが完璧ではない。DB の CHECK / NOT NULL / UNIQUE と組み合わせて二重防衛。マイグレーションで制約を明示する習慣を。",
      codeExample:
        "# DB レベル (NOT NULL + UNIQUE)\nclass CreateUsers < ActiveRecord::Migration[7.1]\n  def change\n    create_table :users do |t|\n      t.string :email, null: false\n      t.timestamps\n    end\n    add_index :users, :email, unique: true\n  end\nend\n\n# Model レベル (UX 親切なエラー)\nclass User < ApplicationRecord\n  validates :email, presence: true, uniqueness: true,\n                    format: { with: URI::MailTo::EMAIL_REGEXP }\nend",
    },
  },
  {
    id: "ar-031",
    categoryId: "active-record",
    difficulty: "intermediate",
    type: "choice",
    question:
      "ActiveRecord で『複数の属性値を `:draft, :published` の文字列セットに制限』する宣言は？",
    choices: [
      "validates :status, inclusion: { in: [:draft, :published] }",
      "1 と 2 の両方",
      "Rails 標準では不可",
      "enum status: { draft: 0, published: 1 }",
    ],
    answerIndex: 1,
    hints: [
      "enum は専用のクラスマクロで自動メソッドを生成。",
      "inclusion バリデーションでも値制限可能 (DB 列は任意)。",
      "両方とも実務でよく使われる。",
    ],
    explanation: {
      summary:
        "`enum status: { draft: 0, published: 1 }` で整数カラム ↔ シンボルのマッピング + 自動メソッド (draft?/published! 等) を生成。`inclusion` バリデーションでも文字列リスト制限可能。",
      reason:
        "enum は整数カラムを内部表現に使い、AR が透過的に変換。`user.draft?` / `user.published!` / `User.published` 等の便利メソッドが生える。Rails 7+ では Hash 形式が推奨 (旧 Array 形式は曖昧)。",
      codeExample:
        "class Post < ApplicationRecord\n  enum status: { draft: 0, published: 1, archived: 2 }\nend\n\n# 自動メソッド\npost.draft?           #=> true/false\npost.published!       # status を 1 に更新\nPost.published        # WHERE status = 1\n\n# scope や validation も自動\nPost.statuses         #=> {'draft' => 0, 'published' => 1, 'archived' => 2}\n\n# 旧式 (Rails 6 まで、整数で曖昧)\nenum status: %i[draft published archived]",
    },
  },
  {
    id: "ar-032",
    categoryId: "active-record",
    difficulty: "intermediate",
    type: "choice",
    question: "次のコードで生成される SQL は？",
    code: "Post.where(user_id: User.where(active: true))",
    choices: [
      "WHERE user_id IN (SELECT users.id FROM users WHERE active = true) (サブクエリ)",
      "WHERE user_id IS NULL",
      "全 Post を取得 (条件なし)",
      "SQL エラー",
    ],
    answerIndex: 0,
    hints: [
      "where に Relation を渡すとサブクエリになる。",
      "AR が SELECT id を自動で含める。",
      "IN (SELECT ...) の形。",
    ],
    explanation: {
      summary:
        "`where(col: Relation)` はサブクエリ化。`SELECT id` が自動で適用される。",
      reason:
        "JOIN を避けて IN サブクエリで書きたい場面に便利。AR が `Relation.select(:id)` を内側に展開する。配列を渡す `where(user_id: [...])` の動的版とも言える。pluck で先に配列化すると IN リテラル (2 クエリ) になる。",
      codeExample:
        "# サブクエリ (1 クエリ)\nPost.where(user_id: User.where(active: true))\n# WHERE user_id IN (SELECT id FROM users WHERE active = true)\n\n# 配列展開 (2 クエリ)\nactive_user_ids = User.where(active: true).pluck(:id)\nPost.where(user_id: active_user_ids)\n# SELECT id FROM users WHERE active = true\n# SELECT * FROM posts WHERE user_id IN (1,2,3,...)",
    },
  },
  {
    id: "ar-033",
    categoryId: "active-record",
    difficulty: "advanced",
    type: "choice",
    question:
      "ActiveRecord で『更新時に updated_at を自動更新せず、ある属性だけ INSERT した時刻を保持』する仕組みは？",
    choices: [
      "skip_timestamps",
      "config.skip_timestamps = true",
      "Rails 標準では不可",
      "touch: false オプション or `update_columns` 系メソッド",
    ],
    answerIndex: 3,
    hints: [
      "update_all / update_columns は updated_at を自動更新しない。",
      "save 系では touch: false が使える (Rails 6+)。",
      "ログ / 統計の更新で『updated_at を汚したくない』時に使う。",
    ],
    explanation: {
      summary:
        "`update_columns(...)` はバリデーション + コールバック + updated_at をすべてスキップ。`touch: false` で save 系の updated_at だけ抑制 (Rails 6+)。",
      reason:
        "ログイン日時更新 / カウンタ更新で updated_at を汚すと『最終編集日時』の意味が失われる。`update_columns` で DB 直接更新、または `update(attrs, touch: false)` のように touch を制御 (AR 7+ 対応箇所あり)。`touch` の有無に注意。",
      codeExample:
        "# updated_at をスキップ\nuser.update_columns(last_seen_at: Time.current)\n\n# 関連の touch (親の updated_at 更新)\nclass Comment < ApplicationRecord\n  belongs_to :post, touch: true\nend\ncomment.save     # comment 保存 + post.updated_at も更新\n\n# 通常の更新\nuser.update(name: 'A')      # validation + callbacks + updated_at",
    },
  },
  {
    id: "ar-034",
    categoryId: "active-record",
    difficulty: "advanced",
    type: "choice",
    question:
      "次のうち、ActiveRecord の `scope` と「クラスメソッド」の違いとして正しいのは？",
    choices: [
      "クラスメソッドは継承不可",
      "scope は必ず Relation を返す前提 (引数なし or nil 時も)。クラスメソッドは nil を返すと nil チェーンが切れる",
      "両者は完全に同じ",
      "scope は遅い",
    ],
    answerIndex: 1,
    hints: [
      "scope は内部で必ず Relation を返すように設計されている。",
      "クラスメソッドで条件付きに nil を返すと、その後のチェーンが落ちる (NoMethodError on nil)。",
      "条件付き scope は all/none で fallback するのが定石。",
    ],
    explanation: {
      summary:
        "scope は Relation 返却が保証される (nil 返却でも all() に変換)。クラスメソッドは nil を返すとチェーン破綻するので fallback で `all` / `none` を使う。",
      reason:
        "`scope :active_if_admin, ->(user) { where(active: true) if user.admin? }` は user が非 admin の時 `nil` を返すと、scope は all を返す (Rails 4+ の仕様)。クラスメソッドだと nil そのまま返るので scope の方が安全。",
      codeExample:
        "# scope (Relation 返却保証)\nscope :by_role, ->(role) { where(role: role) if role.present? }\nUser.by_role(nil)     # User.all (nil 返却 → all 変換)\n\n# クラスメソッド\ndef self.by_role(role)\n  return all if role.blank?    # 自分で all 返す必要あり\n  where(role: role)\nend",
    },
  },
  {
    id: "ar-035",
    categoryId: "active-record",
    difficulty: "advanced",
    type: "choice",
    question:
      "ActiveRecord の `Post.includes(:user).where(\"users.name LIKE ?\", \"%a%\")` が正しく動かないことがあるのは？",
    choices: [
      "users テーブルが大きすぎる",
      "LIKE は使えない",
      "always works",
      "includes が preload 戦略 (別クエリ) を選ぶと WHERE が posts のみに適用され、users.name 条件が SQL エラーになる。references(:users) で eager_load に強制",
    ],
    answerIndex: 3,
    hints: [
      "includes は条件次第で preload / eager_load を切替。",
      "文字列条件 (`users.name LIKE`) は AR が関連を認識しにくい。",
      "references(:users) で JOIN を強制すると解決。",
    ],
    explanation: {
      summary:
        "文字列 WHERE 条件は AR が関連を見抜けず preload になり、別クエリで users.name を参照できずエラー。`references(:users)` で eager_load を強制。",
      reason:
        "Hash 形式 (`where(users: { name: 'A' })`) なら AR が自動で JOIN になるが、文字列は判別不可。`references(:users)` を付けるか、最初から `joins(:user)` + `where('users.name LIKE ?', ...)` で書く。",
      codeExample:
        "# 動かない可能性あり\nPost.includes(:user).where(\"users.name LIKE ?\", \"%a%\")\n\n# 正しい (Hash + 自動 JOIN)\nPost.includes(:user).where(users: { name: 'Alice' })\n\n# 文字列条件なら references で JOIN 強制\nPost.includes(:user).references(:user).where(\"users.name LIKE ?\", \"%a%\")\n\n# シンプル (preload 不要なら)\nPost.joins(:user).where(\"users.name LIKE ?\", \"%a%\")",
    },
  },
  {
    id: "ar-036",
    categoryId: "active-record",
    difficulty: "advanced",
    type: "choice",
    question:
      "ActiveRecord で『1 つのカラムに JSON / Hash を保存』する宣言は？",
    choices: [
      "json :data",
      "attribute :data, :json",
      "serialize :data, JSON (or Coder) or PostgreSQL なら t.jsonb で型ネイティブ",
      "store_text :data",
    ],
    answerIndex: 2,
    hints: [
      "DB が PostgreSQL なら jsonb 型がネイティブ対応。",
      "MySQL なら JSON 型 (5.7+) または serialize で TEXT に保存。",
      "Rails の `serialize` メソッドで AR 側で変換指定。",
    ],
    explanation: {
      summary:
        "PostgreSQL なら `t.jsonb` 型 + `attribute :data, :jsonb` でネイティブ。MySQL なら JSON 型。汎用は `serialize :data, JSON` で TEXT 保存。",
      reason:
        "jsonb はインデックスや部分検索 (`@>` `?` 演算子) が使える本格的な型。serialize は YAML / JSON 等で TEXT カラムに保存 (検索性能は低)。Rails 5+ では `store_accessor` で Hash の特定キーを attribute のように扱える。",
      codeExample:
        "# PostgreSQL (推奨)\nclass AddDataToUsers < ActiveRecord::Migration[7.1]\n  def change\n    add_column :users, :preferences, :jsonb, default: {}\n  end\nend\n\n# Model\nclass User < ApplicationRecord\n  store_accessor :preferences, :theme, :locale\nend\n\nuser.theme = 'dark'\nuser.save\nuser.preferences      #=> {'theme' => 'dark'}\n\n# 検索 (PostgreSQL のみ)\nUser.where(\"preferences ->> 'theme' = ?\", 'dark')\n\n# 汎用 serialize\nclass Post < ApplicationRecord\n  serialize :meta, JSON\nend",
    },
  },
  {
    id: "ar-037",
    categoryId: "active-record",
    difficulty: "advanced",
    type: "choice",
    question:
      "ActiveRecord で『N+1 検出 + 自動最適化』を行う gem として正しいのは？",
    choices: [
      "rails-erd",
      "bullet (検出のみ) / Goldiloader (自動 eager loading)",
      "rspec / minitest",
      "factory_bot",
    ],
    answerIndex: 1,
    hints: [
      "bullet は『警告だけ』表示、開発時に気付くツール。",
      "Goldiloader は『自動で eager loading』を有効化する gem。",
      "両者は別の方向のアプローチ。",
    ],
    explanation: {
      summary:
        "bullet は N+1 検出 + 警告、Goldiloader は『関連を遅延ロード時に自動で eager load』する gem。役割が異なる。",
      reason:
        "bullet は『気付き』ツール、Goldiloader は『自動修正』。Goldiloader は開発体験を上げるが、隠れた問題を見えなくする (検出された方が学習になる) ので、本番チューニング段階で導入派 / 入れない派の両方がいる。",
      codeExample:
        "# bullet (検出)\ngem 'bullet'\n# config/environments/development.rb\nBullet.enable = true\nBullet.alert = true\n\n# Goldiloader (自動最適化)\ngem 'goldiloader'\n# 何も設定せず、user.posts へのアクセスで自動 eager load\nUser.all.each { |u| u.posts.size }   # 自動で includes(:posts) 同等",
    },
  },
  {
    id: "ar-038",
    categoryId: "active-record",
    difficulty: "advanced",
    type: "choice",
    question:
      "次のうち、ActiveRecord の `attribute` メソッドの用途として正しいのは？",
    choices: [
      "DB カラムに無い仮想属性 / 型変換 / デフォルト値を Model レベルで宣言",
      "新しい DB カラムを追加",
      "scope を定義する",
      "validation を追加する",
    ],
    answerIndex: 0,
    hints: [
      "Model 内で `attribute :name, :type, default: ...` のように書く。",
      "DB カラム不要で仮想属性を定義したり、既存カラムに型を上書きしたり。",
      "Form Object パターンでも頻出。",
    ],
    explanation: {
      summary:
        "`attribute :name, :type` は DB カラムに依存しない仮想属性、または既存カラムの型を上書き。Form Object / 値型変換に便利。",
      reason:
        "Rails 5+ で導入された Attributes API。`attribute :age, :integer` で型強制、`default: -> { ... }` で動的デフォルト、`attribute :search_query, :string` で DB カラム無しの仮想属性。Form Object (ActiveModel) と一緒に使うと強力。",
      codeExample:
        "class User < ApplicationRecord\n  # 既存カラムの型を上書き\n  attribute :preferences, :json, default: {}\n\n  # 仮想属性 (DB に無い)\n  attribute :full_name, :string\n\n  # 動的デフォルト\n  attribute :token, :string, default: -> { SecureRandom.hex }\nend\n\n# Form Object 例\nclass SignUpForm\n  include ActiveModel::Model\n  include ActiveModel::Attributes\n  attribute :email, :string\n  attribute :password, :string\n  attribute :agree_terms, :boolean, default: false\nend",
    },
  },

  // ===========================================================================
  // 🛠️ 実践課題 追加 (pr-013〜pr-022, 10問)
  // ===========================================================================
  {
    id: "pr-013",
    categoryId: "practical",
    difficulty: "intermediate",
    type: "practical",
    question:
      "ソフトデリート (論理削除) 機能を実装してください。`destroy` を呼ぶと deleted_at を設定するだけにし、デフォルトの query には削除済を含まないようにします。",
    requirements: [
      "Post モデルに deleted_at: datetime カラムを追加",
      "Post#destroy を上書きして deleted_at を Time.current にする",
      "デフォルト scope で `where(deleted_at: nil)` を適用",
      "`unscoped` または `with_deleted` で削除済も取得可能に",
      "concern として切り出して他モデルでも使える形に",
    ],
    sampleSolution:
      "# migration\nadd_column :posts, :deleted_at, :datetime\nadd_index :posts, :deleted_at\n\n# app/models/concerns/soft_deletable.rb\nmodule SoftDeletable\n  extend ActiveSupport::Concern\n\n  included do\n    default_scope { where(deleted_at: nil) }\n    scope :with_deleted, -> { unscope(where: :deleted_at) }\n    scope :only_deleted, -> { unscope(where: :deleted_at).where.not(deleted_at: nil) }\n  end\n\n  def destroy\n    update_column(:deleted_at, Time.current)\n  end\n\n  def restore!\n    update_column(:deleted_at, nil)\n  end\n\n  def deleted?\n    !deleted_at.nil?\n  end\nend\n\n# Model\nclass Post < ApplicationRecord\n  include SoftDeletable\nend",
    hints: [
      "default_scope で『削除済を見えなくする』。`unscope(where: :deleted_at)` で外せます。",
      "Concern にすることで複数モデルで再利用可能。",
      "本番運用では paranoia / discard 等の gem を使うのが安全。",
    ],
    reviewPoints: [
      "default_scope で deleted_at IS NULL を強制",
      "with_deleted / only_deleted で柔軟に取得",
      "destroy を上書き (update_column で callback 飛ばしてもよい)",
      "復元用の restore! メソッド",
      "Concern として横展開可能",
      "本番運用では discard / paranoia gem 検討",
    ],
    explanation: {
      summary:
        "default_scope + Concern で論理削除パターン。実運用は paranoia / discard gem 推奨。",
      reason:
        "削除済データを後から復元・監査したい時に有効。default_scope は副作用が大きい (joins 等で困る) ので、明示的に `where(deleted_at: nil)` する派もあり。本番では実績のある gem (discard が現代的) を使うと罠が少ない。",
      commonMistakes: [
        "default_scope は他の AR メソッドにも影響するので意図しない動作の原因になりやすい。明示 scope を推奨する流派も。",
        "destroy を上書きすると has_many :dependent との連携で罠が出る (子レコードまで dependent_destroy で消える等)。",
      ],
    },
  },
  {
    id: "pr-014",
    categoryId: "practical",
    difficulty: "intermediate",
    type: "practical",
    question:
      "ページネーション機能を実装してください。GET /posts?page=2&per=20 でページ毎に取得し、レスポンスヘッダで X-Total-Count, X-Page, X-Per を返します。",
    requirements: [
      "kaminari または pagy gem を使う",
      "page / per パラメータで制御",
      "X-Total-Count / X-Page / X-Per ヘッダーを応答",
      "デフォルト per_page = 20、最大 100",
      "scope に includes を含めて N+1 対策",
    ],
    sampleSolution:
      "# Gemfile\ngem 'kaminari'\n\n# Controller\nclass PostsController < ApplicationController\n  MAX_PER = 100\n\n  def index\n    per = (params[:per].to_i.positive? ? params[:per].to_i : 20).clamp(1, MAX_PER)\n    scope = Post.includes(:user).published.recent\n    @posts = scope.page(params[:page]).per(per)\n\n    response.headers['X-Total-Count'] = @posts.total_count.to_s\n    response.headers['X-Page']        = @posts.current_page.to_s\n    response.headers['X-Per']         = per.to_s\n    response.headers['X-Total-Pages'] = @posts.total_pages.to_s\n\n    render json: @posts.map { |p| post_json(p) }\n  end\n\n  private\n\n  def post_json(p)\n    {\n      id: p.id,\n      title: p.title,\n      author_name: p.user.name,\n      published_at: p.published_at&.iso8601\n    }\n  end\nend",
    hints: [
      "Kaminari なら .page(N).per(M) でチェーン。",
      "Pagy は軽量高速版で構文がやや異なる。",
      "ヘッダー応答はフロントエンドが UI で『次へ』ボタン制御に使える。",
    ],
    reviewPoints: [
      "per の上限を clamp で制限 (DoS 対策)",
      "includes で N+1 解消",
      "X-Total-Count / X-Page / X-Per を必ず応答",
      "page 不正値で 1 にフォールバック",
      "scope を別変数にしてヘッダー用 total_count を再利用 (count 1 回)",
    ],
    explanation: {
      summary:
        "Kaminari / Pagy + ヘッダーレスポンスが API ページネーションの定型。per の上限管理が DoS 対策で重要。",
      reason:
        "per=100000 のような攻撃を防ぐため必ず clamp。SPA フロントエンド (React/Vue) からは X-Total-Count を見て『次ページ有無』『進捗バー』を実装。Cursor-based pagination (page=cursor_id) は大規模データで page-based より高速。",
      commonMistakes: [
        "per 上限なし → 巨大ページで DB 過負荷 → DoS",
        "total_count を毎回計算 → COUNT(*) が重い。キャッシュやカーソル化検討。",
      ],
    },
  },
  {
    id: "pr-015",
    categoryId: "practical",
    difficulty: "intermediate",
    type: "practical",
    question:
      "全文検索エンドポイント GET /posts/search?q=ruby を実装してください。title / body から ILIKE で部分一致検索、N+1 対策込み。",
    requirements: [
      "scope :search を Post モデルに定義",
      "q が空なら全件 (filter なし)",
      "title または body のどちらかにマッチ (OR)",
      "PostgreSQL の ILIKE 使用 (大文字小文字無視)",
      "コントローラ /posts/search?q= から呼び出し",
      "SQL injection 安全な形 (プレースホルダ)",
    ],
    sampleSolution:
      "# Model\nclass Post < ApplicationRecord\n  scope :search, ->(q) {\n    next all if q.blank?\n    keyword = \"%#{sanitize_sql_like(q)}%\"\n    where('title ILIKE :k OR body ILIKE :k', k: keyword)\n  }\nend\n\n# Routes\nresources :posts do\n  collection { get :search }\nend\n\n# Controller\nclass PostsController < ApplicationController\n  def search\n    @posts = Post.includes(:user)\n                 .search(params[:q])\n                 .recent\n                 .page(params[:page]).per(20)\n    render :index\n  end\nend",
    hints: [
      "scope のブロック内で blank? チェックして all を返すと安全。",
      "sanitize_sql_like で `%`/`_` をエスケープ。",
      "SQL injection 対策はプレースホルダ (`?` or `:name`) 必須。",
    ],
    reviewPoints: [
      "scope で q.blank? を all にフォールバック",
      "sanitize_sql_like でユーザー入力の特殊文字エスケープ",
      "プレースホルダで SQL injection 防止",
      "ILIKE で大文字小文字無視 (MySQL なら LOWER(col) LIKE LOWER(?))",
      "N+1 対策の includes",
      "本格的なら pg_search / elasticsearch-rails / meilisearch 検討",
    ],
    explanation: {
      summary:
        "scope + sanitize_sql_like + プレースホルダで安全な全文検索。本格運用は pg_search / Elasticsearch。",
      reason:
        "ILIKE は手軽だが大規模では遅い。pg_search gem で trigram index、Elasticsearch / Meilisearch 等で本格的な検索 (日本語形態素解析、ハイライト、スコアリング) が可能。",
      commonMistakes: [
        "文字列補間で SQL injection。`where(\"title LIKE '%#{q}%'\")` は絶対 NG。",
        "LIKE のワイルドカード (%/_) を含むユーザー入力をエスケープ忘れ。",
      ],
    },
  },
  {
    id: "pr-016",
    categoryId: "practical",
    difficulty: "intermediate",
    type: "practical",
    question:
      "管理画面向けのカスタムバリデーター `EmailValidator` を実装してください。`validates :email, email: true` のように使えて、複数モデルで再利用可能。",
    requirements: [
      "ActiveModel::EachValidator を継承",
      "app/validators/email_validator.rb に配置",
      "RFC 5322 簡易チェック (URI::MailTo::EMAIL_REGEXP 程度)",
      "options: { allow_blank: true } / { domain: 'example.com' } を受け付ける",
      "User / Contact など複数モデルで `validates :email, email: true` で使える",
    ],
    sampleSolution:
      "# app/validators/email_validator.rb\nclass EmailValidator < ActiveModel::EachValidator\n  def validate_each(record, attribute, value)\n    return if options[:allow_blank] && value.blank?\n\n    unless value =~ URI::MailTo::EMAIL_REGEXP\n      record.errors.add(attribute, options[:message] || 'is not a valid email')\n      return\n    end\n\n    if (domain = options[:domain])\n      unless value.end_with?(\"@#{domain}\")\n        record.errors.add(attribute, \"must be on #{domain}\")\n      end\n    end\n  end\nend\n\n# 使い方\nclass User < ApplicationRecord\n  validates :email, presence: true, email: true\nend\n\nclass Admin < ApplicationRecord\n  validates :email, email: { domain: 'company.com' }\nend",
    hints: [
      "ActiveModel::EachValidator を継承し validate_each を実装。",
      "ファイル名はクラス名の snake_case (email_validator.rb) で autoload。",
      "options Hash で任意の設定値を受け取れる。",
    ],
    reviewPoints: [
      "ActiveModel::EachValidator 継承",
      "validate_each(record, attribute, value) シグネチャ",
      "errors.add でメッセージ追加",
      "options で柔軟性 (domain 制限、message カスタマイズ)",
      "ファイル配置 app/validators/ (autoload 対応)",
      "RFC 準拠は完璧ではないので、実運用は ActiveSupport::Notifications 連携や Truemail gem 検討",
    ],
    explanation: {
      summary:
        "カスタムバリデーターは ActiveModel::EachValidator 継承で簡単に作れる。複数モデル / 設定オプション対応。",
      reason:
        "validates :属性, :バリデーター名 で使う規約。`EmailValidator` クラス → `email: true` で参照される。validation の責務をモデルから切り出して再利用可能に。",
    },
  },
  {
    id: "pr-017",
    categoryId: "practical",
    difficulty: "intermediate",
    type: "practical",
    question:
      "Counter Cache を実装してください。Post の comments 数を毎回 COUNT せずに、posts.comments_count カラムで保持し自動更新。",
    requirements: [
      "posts テーブルに comments_count: integer (default 0) カラム追加",
      "Comment#belongs_to :post に counter_cache: true",
      "既存データの初期値を埋めるマイグレーション + reset_counters",
      "post.comments.size が COUNT クエリではなくキャッシュを参照",
    ],
    sampleSolution:
      "# migration\nclass AddCommentsCountToPosts < ActiveRecord::Migration[7.1]\n  def up\n    add_column :posts, :comments_count, :integer, default: 0, null: false\n    Post.find_each { |p| Post.reset_counters(p.id, :comments) }\n  end\n\n  def down\n    remove_column :posts, :comments_count\n  end\nend\n\n# Model\nclass Comment < ApplicationRecord\n  belongs_to :post, counter_cache: true\nend\n\n# 確認\npost.comments_count        # キャッシュ参照、COUNT クエリ無し\npost.comments.size         # キャッシュがあればそれを参照\n\n# カスタムカラム名にする場合\nbelongs_to :post, counter_cache: :total_comments_count",
    hints: [
      "counter_cache: true で Rails が自動で +1/-1 する。",
      "既存データには reset_counters で初期値を埋める必要あり。",
      "カラムは必ず default: 0, null: false。",
    ],
    reviewPoints: [
      "comments_count カラムを default: 0, null: false で追加",
      "belongs_to に counter_cache: true",
      "マイグレーション時に reset_counters で既存データ初期化",
      "post.comments.size がキャッシュ参照になる",
      "destroy / create でカウンタが自動更新される",
      "Race condition で稀にズレることがあるので、定期的に reset_counters で修正",
    ],
    explanation: {
      summary:
        "counter_cache はパフォーマンス改善の定番。COUNT クエリを 1 つの INTEGER 参照に置き換え。reset_counters で初期化。",
      reason:
        "投稿一覧でコメント数を表示するような UI で N+1 を回避。Comment.create / destroy で AR が自動でカウンタ更新。並行更新で稀にズレるので、月次バッチで reset_counters を呼んで補正するのが本番運用の定石。",
      commonMistakes: [
        "default: 0 を忘れて null になり計算がおかしくなる。",
        "delete_all は counter_cache を更新しない (destroy_all は更新)。",
      ],
    },
  },
  {
    id: "pr-018",
    categoryId: "practical",
    difficulty: "intermediate",
    type: "practical",
    question:
      "Polymorphic Association を使って、Post / Photo / Comment 等の複数モデルが共通の Like を持てる構造を実装してください。",
    requirements: [
      "likes テーブル: likeable_type (string) + likeable_id (integer) + user_id",
      "Like モデル: belongs_to :likeable, polymorphic: true",
      "Post / Photo / Comment などに has_many :likes, as: :likeable",
      "post.likes.count, photo.likes.count が透過的に動く",
      "適切な複合インデックス (likeable_type, likeable_id)",
    ],
    sampleSolution:
      "# migration\nclass CreateLikes < ActiveRecord::Migration[7.1]\n  def change\n    create_table :likes do |t|\n      t.references :likeable, polymorphic: true, null: false, index: true\n      t.references :user, null: false, foreign_key: true\n      t.timestamps\n    end\n    add_index :likes, [:user_id, :likeable_type, :likeable_id], unique: true\n  end\nend\n\n# Like モデル\nclass Like < ApplicationRecord\n  belongs_to :likeable, polymorphic: true\n  belongs_to :user\nend\n\n# 各モデル\nclass Post < ApplicationRecord\n  has_many :likes, as: :likeable, dependent: :destroy\nend\n\nclass Photo < ApplicationRecord\n  has_many :likes, as: :likeable, dependent: :destroy\nend\n\n# 使い方\npost.likes.create!(user: user)\npost.likes.count\nuser.likes.where(likeable_type: 'Post')",
    hints: [
      "t.references :likeable, polymorphic: true で likeable_type + likeable_id を一括生成。",
      "as: :likeable で belongs_to 側との対応を取る。",
      "ユニーク制約は (user_id + likeable_type + likeable_id) の複合インデックス。",
    ],
    reviewPoints: [
      "likeable_type + likeable_id の 2 カラム構成 (polymorphic: true)",
      "複合インデックス (重複防止 + 検索高速化)",
      "as: :likeable で has_many と belongs_to のマッピング",
      "dependent: :destroy で親削除時にクリーンアップ",
      "外部キー制約は user_id にだけ (likeable_id は polymorphic で制約できない)",
    ],
    explanation: {
      summary:
        "Polymorphic Association で複数モデルが共通の関連を持つ。データベース制約は粗いので、Model 側でしっかり validation。",
      reason:
        "Tag/Comment/Like のような『どのモデルにも紐付く』関連で便利。ただし likeable_id は外部キー制約 (FK) を張れないので参照整合性は弱い。重要な関連には通常の has_many :through の方が安全な場合も。",
      commonMistakes: [
        "polymorphic 関連は FK 制約が張れないので、孤立レコードが生まれやすい。dependent オプションを忘れない。",
        "JOIN クエリが少し複雑になる。explain で実行計画を確認。",
      ],
    },
  },
  {
    id: "pr-019",
    categoryId: "practical",
    difficulty: "advanced",
    type: "practical",
    question:
      "Webhook 受信エンドポイントを実装してください。Stripe の Webhook (POST /webhooks/stripe) を受け取り、署名検証 → イベント別ハンドル → 200 を返します。",
    requirements: [
      "POST /webhooks/stripe ルート (CSRF 除外)",
      "Stripe-Signature ヘッダで署名検証",
      "署名失敗時は 400 を返す",
      "event.type で分岐 (charge.succeeded / charge.failed 等)",
      "処理は ActiveJob で非同期化 (高速応答)",
      "冪等性 (同一 event.id は 1 度だけ処理)",
    ],
    sampleSolution:
      "# routes.rb\npost '/webhooks/stripe', to: 'webhooks/stripe#create'\n\n# app/controllers/webhooks/stripe_controller.rb\nclass Webhooks::StripeController < ActionController::API\n  def create\n    payload   = request.body.read\n    signature = request.headers['Stripe-Signature']\n    secret    = Rails.application.credentials.stripe[:webhook_secret]\n\n    begin\n      event = Stripe::Webhook.construct_event(payload, signature, secret)\n    rescue Stripe::SignatureVerificationError => e\n      Rails.logger.warn(\"Invalid Stripe signature: #{e.message}\")\n      return head :bad_request\n    end\n\n    # 冪等性: 既に処理済みなら無視\n    return head :ok if WebhookEvent.exists?(provider: 'stripe', event_id: event.id)\n\n    WebhookEvent.create!(provider: 'stripe', event_id: event.id, payload: event.to_h)\n    StripeWebhookJob.perform_later(event.id)\n    head :ok\n  end\nend\n\n# app/jobs/stripe_webhook_job.rb\nclass StripeWebhookJob < ApplicationJob\n  def perform(event_id)\n    record = WebhookEvent.find_by!(event_id: event_id)\n    event  = Stripe::Event.construct_from(record.payload)\n\n    case event.type\n    when 'charge.succeeded' then handle_charge_succeeded(event)\n    when 'charge.failed'    then handle_charge_failed(event)\n    end\n  end\nend",
    hints: [
      "ActionController::API + skip_before_action :verify_authenticity_token (CSRF 不要)。",
      "Stripe::Webhook.construct_event で署名検証 + payload パース。",
      "event.id を一意キーとして冪等性確保 (DB に保存)。",
      "重い処理は ActiveJob で非同期化、即座に 200 を返す。",
    ],
    reviewPoints: [
      "署名検証 (Stripe-Signature ヘッダ + secret)",
      "署名失敗で 400 を返す (リトライ対象に)",
      "冪等性: event.id を保存して二重処理防止",
      "Job 化で高速応答 (Stripe は数秒以内のレスポンスを要求)",
      "credentials.yml.enc に webhook_secret を保存",
      "CSRF はスキップ (API なので不要)",
    ],
    explanation: {
      summary:
        "Webhook は『署名検証 → 冪等性 → 非同期処理 → 200』が基本パターン。Stripe 以外も同様 (GitHub / Slack / Twilio)。",
      reason:
        "Webhook は外部から POST されるので CSRF 不要 (API モード)。署名検証で偽装防止。Stripe は失敗時に何度もリトライするので、同一イベントを 2 回処理しないよう event.id ベースで冪等性確保。本処理は Job 化して 200 を即返さないと Stripe からタイムアウトされる。",
      commonMistakes: [
        "CSRF 検証を有効にしたまま → 全リクエスト 422 になる。",
        "署名検証を忘れる → 任意の POST を受け付けるセキュリティ穴。",
        "冪等性無し → リトライで二重課金などの障害。",
      ],
    },
  },
  {
    id: "pr-020",
    categoryId: "practical",
    difficulty: "advanced",
    type: "practical",
    question:
      "Rate Limit を実装してください。/api/posts への匿名アクセスを IP 単位 60 req/min に制限。",
    requirements: [
      "rack-attack gem を使う",
      "認証ユーザーは制限なし、匿名のみ制限",
      "60 req/min を超えると 429 Too Many Requests",
      "レスポンスに Retry-After ヘッダ付与",
      "Redis をストアにする (本番想定)",
    ],
    sampleSolution:
      "# Gemfile\ngem 'rack-attack'\ngem 'redis'\n\n# config/initializers/rack_attack.rb\nclass Rack::Attack\n  redis = Redis.new(url: ENV.fetch('REDIS_URL', 'redis://localhost:6379/0'))\n  Rack::Attack.cache.store = ActiveSupport::Cache::RedisCacheStore.new(redis: redis)\n\n  throttle('api/anonymous', limit: 60, period: 1.minute) do |req|\n    if req.path.start_with?('/api/') && req.env['HTTP_AUTHORIZATION'].blank?\n      req.ip\n    end\n  end\n\n  self.throttled_responder = lambda do |req|\n    match_data = req.env['rack.attack.match_data']\n    retry_after = (match_data[:period] - (Time.now.to_i - match_data[:epoch_time])).ceil\n    [429,\n     { 'Content-Type' => 'application/json', 'Retry-After' => retry_after.to_s },\n     [{ error: 'Too many requests', retry_after: retry_after }.to_json]]\n  end\nend\n\n# config/application.rb\nconfig.middleware.use Rack::Attack",
    hints: [
      "throttle は IP / メール / URL 等で制限可能。",
      "block_for: { |req| req.path.start_with?('/api/') && unauthenticated? } で対象絞り込み。",
      "throttled_responder で 429 と Retry-After ヘッダを返す。",
    ],
    reviewPoints: [
      "throttle メソッドで limit + period 設定",
      "条件式で『匿名のみ』を対象に",
      "throttled_responder で 429 + Retry-After ヘッダ + JSON ボディ",
      "Redis をストア (本番マルチプロセス対応)",
      "rate limit を超えたユーザーを log に残す (監視で見られる)",
      "safelist で内部 IP を除外も検討",
    ],
    explanation: {
      summary:
        "rack-attack で DSL 的に rate limit / blocklist / safelist。本番は Redis ストアで複数プロセス共有。",
      reason:
        "API への DoS / ブルートフォース対策の基本。429 + Retry-After を返すと多くの HTTP クライアントが自動で待機。`fail2ban` 的に IP 単位でブロックすることも可。Cloudflare などの WAF と組み合わせると更に強固。",
      commonMistakes: [
        "store を memory のままにすると、Puma の各ワーカーが別カウントを持って制限が緩くなる。Redis 必須。",
        "limit を厳しくしすぎて正規ユーザーが弾かれる → 監視で検証必須。",
      ],
    },
  },
  {
    id: "pr-021",
    categoryId: "practical",
    difficulty: "advanced",
    type: "practical",
    question:
      "GET /api/v1/posts.csv で全 Post を CSV エクスポートする機能を実装してください。大量データに耐えるストリーム形式で。",
    requirements: [
      "CSV (id, title, author_name, published_at)",
      "大量データに耐えるためメモリにロードしない (find_each + ストリーミング)",
      "Content-Type: text/csv",
      "Content-Disposition: attachment; filename=\"posts-YYYYMMDD.csv\"",
      "UTF-8 BOM 付き (Excel で正しく表示)",
    ],
    sampleSolution:
      "require 'csv'\n\nclass Api::V1::PostsController < ApplicationController\n  def index\n    respond_to do |format|\n      format.json { ... }\n      format.csv  { stream_csv }\n    end\n  end\n\n  private\n\n  def stream_csv\n    headers['Content-Type'] = 'text/csv; charset=utf-8'\n    headers['Content-Disposition'] = %(attachment; filename=\"posts-#{Date.current.strftime('%Y%m%d')}.csv\")\n    headers['Cache-Control'] = 'no-cache'\n    headers['X-Accel-Buffering'] = 'no'\n\n    self.response_body = Enumerator.new do |y|\n      y << \"\\uFEFF\"                            # BOM\n      y << CSV.generate_line(%w[id title author_name published_at])\n\n      Post.includes(:user).published.find_each(batch_size: 1000) do |p|\n        y << CSV.generate_line([\n          p.id,\n          p.title,\n          p.user.name,\n          p.published_at&.iso8601\n        ])\n      end\n    end\n  end\nend",
    hints: [
      "response_body に Enumerator を渡すとストリーミング応答に。",
      "find_each(batch_size: N) で N 件ずつメモリにロード。",
      "UTF-8 BOM (\\uFEFF) を先頭に入れると Excel が UTF-8 として認識。",
    ],
    reviewPoints: [
      "find_each でメモリ効率 (全件ロードしない)",
      "Enumerator + response_body でストリーミング応答",
      "BOM 付与で Excel 互換",
      "Content-Disposition でファイル名 + ダウンロード強制",
      "X-Accel-Buffering: no で nginx のバッファリング無効化",
      "本格的なら ActiveJob で生成 + 完了通知 + S3 ダウンロードリンク",
    ],
    explanation: {
      summary:
        "CSV エクスポートはストリーミング + find_each で大量データ対応。Excel 互換のため BOM 付与。本格運用は非同期生成 + S3 配信。",
      reason:
        "巨大データを一括レスポンスするとメモリ不足 + タイムアウト。Enumerator でストリーム + find_each でバッチ取得。ユーザー体験 (待ち時間) を考慮すると、Job で生成 → メール / 通知 + S3 リンクの方が UX が良い場合も。",
      commonMistakes: [
        "Post.all.each で全件メモリ → OOM。",
        "Excel で開くと文字化け → BOM 忘れ。",
        "タイムアウト → nginx の buffer 無効化 (X-Accel-Buffering) 必須。",
      ],
    },
  },
  {
    id: "pr-022",
    categoryId: "practical",
    difficulty: "advanced",
    type: "practical",
    question:
      "Multi-Tenancy (マルチテナント) を実装してください。各 Account 配下にユーザー・データを分離し、デフォルトクエリで自動的に current_account のデータだけ取得。",
    requirements: [
      "Account モデル + 全 Model に account_id を持たせる",
      "ApplicationRecord に Current.account scope を自動適用",
      "ApplicationController で session/サブドメインから current_account 解決",
      "Current.account = Account.find(id) で thread-local に保持",
      "テストで Current.account を切替可能",
    ],
    sampleSolution:
      "# app/models/current.rb\nclass Current < ActiveSupport::CurrentAttributes\n  attribute :account, :user\nend\n\n# app/models/application_record.rb\nclass ApplicationRecord < ActiveRecord::Base\n  self.abstract_class = true\n\n  def self.inherited(subclass)\n    super\n    subclass.class_eval do\n      default_scope do\n        if column_names.include?('account_id') && Current.account\n          where(account_id: Current.account.id)\n        end\n      end\n    end\n  end\nend\n\n# Controller\nclass ApplicationController < ActionController::Base\n  before_action :set_current_account\n\n  private\n\n  def set_current_account\n    Current.account = Account.find_by(subdomain: request.subdomain)\n    Current.user    = current_user\n  end\nend\n\n# テスト\nbefore { Current.account = create(:account) }\nafter  { Current.reset }",
    hints: [
      "ActiveSupport::CurrentAttributes が Rails 5.2+ で thread / request 安全。",
      "default_scope で account_id を自動付与。",
      "before_action で subdomain or session から current_account 解決。",
      "本格的には apartment / acts_as_tenant gem 検討。",
    ],
    reviewPoints: [
      "Current.account を CurrentAttributes で thread/request safe に",
      "ApplicationRecord で default_scope を自動付与 (account_id カラム有無で判定)",
      "controller の before_action で current_account 解決",
      "テストで Current.account を切替可能 / after でリセット",
      "default_scope を悪用するとパフォーマンス問題 → acts_as_tenant gem の方が制御しやすい",
    ],
    explanation: {
      summary:
        "Multi-Tenancy は『各テナントのデータを完全分離』する設計。Row-Level (account_id 共有 DB)・Schema-Level (テナント毎 schema)・Database-Level (DB ごと分離) の 3 方式あり。",
      reason:
        "SaaS 開発の基本パターン。Row-Level が最も簡単 (account_id カラム + scope) だが、全テーブルに account_id 必須 + バグで他テナント漏洩のリスク。本格運用は acts_as_tenant gem が安全 (テスト時の漏洩検出機構あり)。schema 分離 (apartment gem) はマイグレーションが複雑。",
      commonMistakes: [
        "default_scope を忘れて他テナントのデータが混ざる事故。",
        "Job 内で Current が空になる → ActiveJob では明示的に渡す必要あり。",
        "テストで Current.reset を忘れて次のテストに状態が漏れる。",
      ],
    },
  },
];
