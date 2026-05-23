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
      "shared_examples / it_behaves_like",
      "include_module",
      "merge_describe",
      "import_specs",
    ],
    answerIndex: 0,
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
      "it { is_expected.to eq 5 }",
      "it { subject.must_equal 5 }",
      "it.to eq 5",
      "省略はできない",
    ],
    answerIndex: 0,
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
      "fetch_user が指定例外を、指定メッセージパターン付きで投げる",
      "fetch_user が成功する",
      "fetch_user が nil を返す",
      "fetch_user の戻り値が ActiveRecord::Base",
    ],
    answerIndex: 0,
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
      "system spec (Capybara + headless browser)",
      "model spec",
      "view spec",
      "helper spec",
    ],
    answerIndex: 0,
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
      "VCR (+ WebMock)",
      "Capybara",
      "factory_bot",
      "Devise",
    ],
    answerIndex: 0,
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
      ":focus (focus: true) と --tag focus",
      ":hidden",
      ":only",
      ":private",
    ],
    answerIndex: 0,
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
    choices: ["jq", "json-cli", "jconvert", "jsed"],
    answerIndex: 0,
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
    choices: ["logrotate", "log-cleaner", "ftruncate", "auto-purge"],
    answerIndex: 0,
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
      "Rails.logger.level = Logger::DEBUG を Rails console で実行",
      "/etc/rails.conf を編集",
      "Heroku を再起動",
      "config を git push してデプロイ",
    ],
    answerIndex: 0,
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
      "ポート 3000 を使っているプロセスの起動時間・メモリ・コマンドを表示",
      "ポート 3000 を閉じる",
      "Rails アプリを再起動",
      "ファイルをロック",
    ],
    answerIndex: 0,
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
      "Rails.logger.tagged ブロック (TaggedLogging)",
      "Rails.cache.write",
      "Rails.cookies.write",
      "Rails.session.tagged",
    ],
    answerIndex: 0,
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
    choices: ["git bisect", "git find", "git blame", "git binary"],
    answerIndex: 0,
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
    choices: ["git worktree", "git multibranch", "git parallel", "git clone --multi"],
    answerIndex: 0,
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
      "Conventional Commits",
      "Strict Commits",
      "Semantic Style",
      "Atom Style",
    ],
    answerIndex: 0,
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
      "コミットを跨いだファイル名の変更履歴を消す",
      "コミットの順番を入れ替える (reorder)",
      "複数コミットを 1 つに squash する",
      "コミットメッセージを書き換える",
    ],
    answerIndex: 0,
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
      "Strict-Transport-Security (HSTS)",
      "X-Frame-Options",
      "X-Content-Type-Options",
      "Cache-Control",
    ],
    answerIndex: 0,
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
      "Content-Security-Policy (CSP)",
      "Access-Control-Allow-Origin (CORS)",
      "X-XSS-Protection",
      "Referrer-Policy",
    ],
    answerIndex: 0,
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
      "alg=none / 弱いアルゴリズムを許可してしまう (alg confusion)",
      "Base64 が遅い",
      "JSON のパースに時間がかかる",
      "ペイロードが大きすぎる",
    ],
    answerIndex: 0,
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
    choices: ["rack-attack", "throttle-rate", "limiter", "shield-rate"],
    answerIndex: 0,
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
      "Rails.application.config.filter_parameters",
      "Rails.application.config.skip_params",
      "Rails.application.config.hide_log",
      "Rails.application.config.secret_log",
    ],
    answerIndex: 0,
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
      "拡張子だけでなく Content-Type / マジックバイトで実コンテンツを検証し、別ドメイン or S3 から配信",
      "ファイル名を ROT13 で暗号化する",
      "アップロード後に削除する",
      "ZIP に圧縮する",
    ],
    answerIndex: 0,
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
      "Marginalia / ActiveRecord::QueryLogs",
      "Sql::Tracer",
      "Sequel::SourceMap",
      "Bullet::Annotator",
    ],
    answerIndex: 0,
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
    choices: ["pp (pretty-print)", "view", "dump", "fmt"],
    answerIndex: 0,
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
      "caller / caller_locations",
      "stack / trace",
      "where / from",
      "backtrace",
    ],
    answerIndex: 0,
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
      "HTTP リクエストを送ってルーティング / コントローラの挙動を試す (app.get '/posts')",
      "Rails アプリを再起動する",
      "DB を削除する",
      "テンプレートをコンパイルする",
    ],
    answerIndex: 0,
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
      "bin/dev (foreman / overmind 経由)",
      "bin/start_all",
      "bin/launch",
      "bin/up",
    ],
    answerIndex: 0,
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
      "config.active_support.report_deprecations / 0.5 秒以上は INFO に出る + APM の slow trace を組み合わせる",
      "puts でログ出力",
      "DB を再起動",
      "Rails console で再現",
    ],
    answerIndex: 0,
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
      "alias gs='git status'",
      "shortcut gs='git status'",
      "define gs='git status'",
      "macro gs='git status'",
    ],
    answerIndex: 0,
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
      "cron / crontab",
      "schedule / scheduletab",
      "timer / timertab",
      "loop / looptab",
    ],
    answerIndex: 0,
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
      "tmux / screen",
      "ssh-keep / bg-runner",
      "nohup-only",
      "remote-exec",
    ],
    answerIndex: 0,
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
      "curl -X POST -H 'Content-Type: application/json' -d '{\"name\":\"Alice\"}' http://localhost:3000/users",
      "curl POST http://localhost:3000/users name=Alice",
      "curl -file users.json",
      "curl -auto -post users",
    ],
    answerIndex: 0,
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
      "ss -tlnp",
      "ps -listen",
      "netstat -tlnp (古い)",
      "lsof / ss どちらも使える",
    ],
    answerIndex: 3,
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
      "scp local.tar user@host:/path/",
      "ftp -upload local.tar",
      "cp -remote local.tar",
      "ssh-copy local.tar",
    ],
    answerIndex: 0,
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
      "diff -u (or colordiff)",
      "compare -file",
      "match -files",
      "delta -compare",
    ],
    answerIndex: 0,
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
      "ping (ICMP) + curl/telnet/nc でポート疎通 + dig/nslookup で名前解決",
      "Rails console で確認",
      "GUI でリモートデスクトップ",
      "Slack で同僚に聞く",
    ],
    answerIndex: 0,
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
];
