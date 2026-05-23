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
    choices: ["test", "describe", "group", "spec"],
    answerIndex: 1,
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
      "result が 42 と等しいことを検証する (==)",
      "result が 42 のオブジェクトと同一であることを検証する (equal?)",
      "result の型が Integer であることを検証する",
      "result が真であることを検証する",
    ],
    answerIndex: 0,
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
    choices: ["before(:each)", "before(:all)", "around", "after"],
    answerIndex: 0,
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
    choices: ["fixtures (Rails 標準)", "factory_bot", "faker", "minitest"],
    answerIndex: 1,
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
      "Notifier.send をスタブ化し、呼ばれたかと引数を検証",
      "Notifier クラスを置き換える",
      "Notifier の例外を捕捉する",
      "Notifier をプライベートにする",
    ],
    answerIndex: 0,
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
      "controller spec (古い、非推奨)",
      "request spec",
      "feature spec",
      "model spec",
    ],
    answerIndex: 1,
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
      "create を build_stubbed や build に置き換えられないか",
      "describe を全部消す",
      "expect を removed する",
      "rspec を minitest に書き換える",
    ],
    answerIndex: 0,
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
      "log/development.log",
      "log/server.log",
      "log/runtime.log",
      "tmp/log.log",
    ],
    answerIndex: 0,
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
      "grep '2024-01-15' log/production.log | grep ERROR",
      "find / -name ERROR",
      "ls log/ | grep 2024",
      "cd log && more error",
    ],
    answerIndex: 0,
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
      "journalctl -u my-app -f",
      "log -follow my-app",
      "service-log my-app",
      "cat /var/log/my-app",
    ],
    answerIndex: 0,
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
      "puts 'hello'",
      "Rails.logger.info 'hello'",
      "print 'hello'",
      "console.log 'hello'",
    ],
    answerIndex: 1,
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
      'grep " 500 " access.log | awk \'{print $7}\' | sort | uniq -c | sort -rn | head -5',
      "find access.log -name 500",
      "ls -la access.log | head -5",
      "cat access.log",
    ],
    answerIndex: 0,
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
      "再現 → 仮説 → ログ確認 → 修正 → 再現テスト → デプロイ → 監視",
      "コードを書き換えて push → 動くまで繰り返す",
      "ログを全部削除して直す",
      "本番 DB を直接編集してから報告",
    ],
    answerIndex: 0,
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
      "git merge feature / git rebase feature",
      "git pull feature / git push feature",
      "git checkout feature / git status feature",
      "git clone feature / git init feature",
    ],
    answerIndex: 0,
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
      "コンフリクト箇所を編集 → git add ファイル → git commit (merge) または git rebase --continue",
      "git push --force だけで OK",
      "コミットを全て削除する",
      "ブランチを削除して作り直す",
    ],
    answerIndex: 0,
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
      "gh pr create --base main",
      "gh push pr main",
      "gh request main",
      "gh branch --pr main",
    ],
    answerIndex: 0,
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
      "git revert <SHA> で打ち消しコミットを追加して push",
      "git reset --hard HEAD~1 して force push",
      "リポジトリを削除して作り直す",
      "リモートの履歴を編集する",
    ],
    answerIndex: 0,
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
      "User.where('name = ?', params[:name])",
      'User.where("name = \'#{params[:name]}\'")',
      "User.where(name: params[:name])",
      "User.find_by(name: params[:name])",
    ],
    answerIndex: 1,
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
      "ApplicationController で protect_from_forgery (現在は CSRF トークンを form に自動挿入)",
      "全 POST を拒否する",
      "Cookie を使わない",
      "GET だけ受け付ける",
    ],
    answerIndex: 0,
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
      "防がれる (HTML エスケープが自動)",
      "防がれない",
      "ブラウザが防ぐ",
      "Rails では XSS は発生しない",
    ],
    answerIndex: 0,
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
      "平文で保存する",
      "MD5 でハッシュ化して保存する",
      "bcrypt 等のソルト付き遅いハッシュでハッシュ化して保存 (Rails なら has_secure_password)",
      "Base64 で保存する",
    ],
    answerIndex: 2,
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
      "Broken Access Control (壊れたアクセス制御)",
      "Injection",
      "XSS",
      "CSRF",
    ],
    answerIndex: 0,
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
    choices: ["pry-rails / debug", "console.log", "rails-trace", "ruby-stop"],
    answerIndex: 0,
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
      "rack-mini-profiler",
      "byebug",
      "rspec",
      "factory_bot",
    ],
    answerIndex: 0,
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
      "APM (New Relic 等) の Slow Transaction を確認 → 詳細 trace で SQL/外部 API を特定 → 再現環境で検証",
      "本番でブレークポイントを入れる",
      "アプリを再起動して様子見",
      "全リクエストにログを大量出力",
    ],
    answerIndex: 0,
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
    choices: ["less app.log", "echo app.log", "ls app.log", "ps app.log"],
    answerIndex: 0,
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
      "ssh -i ~/.ssh/id_ed25519 user@host",
      "ssh password://user@host",
      "ssh-connect user@host key",
      "telnet user@host",
    ],
    answerIndex: 0,
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
      "所有者: 読み書き / グループ: 読み / その他: 読み",
      "全員が読み書き可能",
      "誰も読めない",
      "実行のみ可能",
    ],
    answerIndex: 0,
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
    choices: ["xargs", "pipe", "redirect", "transfer"],
    answerIndex: 0,
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
];
