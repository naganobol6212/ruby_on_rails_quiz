import type { Guide } from "./types";

export const infosecIntroGuide: Guide = {
    id: "infosec-intro",
    trackId: "infosec",
    title: "Web セキュリティの地図 — OWASP Top 10 と Rails の防御",
    subtitle:
      "OWASP Top 10 (2021) を軸に Web アプリの守り方を 7 章で。Injection / XSS / CSRF / 認証認可 / シークレット管理 / HTTPS / レート制限・依存監査",
    audience:
      "Rails / Web アプリを書くが OWASP / CSP / JWT / セッション設計でフワッとしている人、Pen Test や監査の前に最低限を整えたい人。Rails 中心だが他フレームワークでも応用可",
    sources: [
      { label: "OWASP Top 10 (2021)", url: "https://owasp.org/Top10/ja/" },
      { label: "Rails Security Guide (公式)", url: "https://railsguides.jp/security.html" },
      { label: "MDN Web Security", url: "https://developer.mozilla.org/ja/docs/Web/Security" },
    ],
    emoji: "🛡️",
    relatedCategoryIds: ["security"],
    chapters: [
      {
        id: "owasp-overview",
        title: "1. OWASP Top 10 と多層防御の考え方",
        intro:
          "OWASP Top 10 (2021) は Web 脆弱性のチェックリスト。1 位は Broken Access Control (アクセス制御)、Injection は 3 位に後退。脅威モデルと『多層防御 (defense in depth)』の発想を整理する。",
        readingMinutes: 7,
        objectives: [
          "OWASP Top 10 (2021) のカテゴリと頻出パターンを列挙できる",
          "認証 (Who you are) と認可 (What you can do) を分けて考えられる",
          "多層防御 — Strong Params / 認可 / バリデーション / WAF などを層として理解する",
        ],
        sections: [
          {
            heading: "1.1 OWASP Top 10 (2021) の主要 10 カテゴリ",
            body: "**A01 Broken Access Control**: 認可不備で本来見えない情報を取れる。**A02 Cryptographic Failures**: 通信 / 保存の暗号化不備。**A03 Injection**: SQL / コマンド / NoSQL injection。**A04 Insecure Design**: 設計段階の欠陥。**A05 Security Misconfiguration**: 設定ミス。**A06 Vulnerable Components**: 古い gem / lib。**A07 ID & Auth Failures**: 認証の不備。**A08 Software & Data Integrity**: CI/CD / 依存改ざん。**A09 Logging & Monitoring**: 検知漏れ。**A10 SSRF**: サーバ側リクエスト偽造。",
            code: "# OWASP Top 10 (2021) — Web アプリ脆弱性の頻出 10 カテゴリ\n#\n# 順位  カテゴリ                                   Rails 主な対策\n# A01   Broken Access Control                     Pundit / CanCanCan, before_action\n# A02   Cryptographic Failures                    HTTPS / HSTS, bcrypt, credentials.yml.enc\n# A03   Injection                                 ActiveRecord placeholder, sanitize\n# A04   Insecure Design                            脅威モデリング, レビュー\n# A05   Security Misconfiguration                  本番 config, default deny, CSP\n# A06   Vulnerable and Outdated Components         bundle audit, Dependabot\n# A07   Identification & Authentication Failures   has_secure_password, rack-attack\n# A08   Software and Data Integrity Failures       Signed cookies, SRI, CI checksum\n# A09   Security Logging & Monitoring Failures     filter_parameters, Sentry, audit log\n# A10   Server-Side Request Forgery (SSRF)         URL allowlist, internal IP block\n\n# 参考: https://owasp.org/Top10/ja/",
            language: "text",
            notes: [
              "Top 10 は『流行りの脆弱性』というより、頻発する分類 — 全部知ってる必要はないが、用語は知っておく",
              "Top 10 自体は数年に一度更新される (2017 → 2021)、ただ大枠は安定",
            ],
          },
          {
            heading: "1.2 認証 (AuthN) と認可 (AuthZ) を分ける",
            body: "セキュリティ初学者がよく混同する 2 つ。**認証 (Authentication)**: あなたが誰か (ログイン)。**認可 (Authorization)**: ログイン済みのあなたに何を許すか。HTTP ステータスも別: 認証失敗は **401 Unauthorized** (誤訳)、認可失敗は **403 Forbidden**。",
            code: "# 認証 (AuthN): ログイン\n# - has_secure_password / Devise / Sorcery / Clearance\n# - レスポンス: 401 (未認証)\n\nclass ApplicationController < ActionController::Base\n  before_action :authenticate_user!     # ログインしてなければ 401\nend\n\n# 認可 (AuthZ): 操作の許可\n# - Pundit / CanCanCan / 自前 (current_user.admin?)\n# - レスポンス: 403 (権限なし)\n\nclass PostsController < ApplicationController\n  def destroy\n    post = Post.find(params[:id])\n    authorize post                       # Pundit (権限なければ 403)\n    post.destroy\n  end\nend\n\n# 認可は『URL レベル』だけでなく『リソースレベル』で\n# - /posts/:id の URL を知っていれば見えてしまう (Insecure Direct Object Reference)\n# - Post.where(user: current_user).find(params[:id]) のように所有者でスコープ\n# - or Pundit policy で `record.user == user` を確認",
            language: "ruby",
            notes: [
              "401/403/404 の使い分けは熟練の領域。情報漏洩を避けるため『見つからない』と『権限なし』を 404 に統一する設計も",
              "URL 直叩きで他人のリソースが見えるバグ (IDOR) は最頻出 — 認可で必ず守る",
            ],
          },
          {
            heading: "1.3 多層防御 (Defense in Depth)",
            body: "1 つの対策に頼らず、複数の層で守る。例: ログイン画面の保護は (1) HTTPS + HSTS、(2) bcrypt パスワード、(3) rack-attack のレート制限、(4) MFA (TOTP)、(5) アクセスログ + 監視、(6) CSP、(7) Secure/HttpOnly/SameSite Cookie、と層を重ねる。1 つ破られても被害を限定。",
            code: "# 多層防御の例 — ログイン機能\n\n# Layer 1: 通信暗号化\n#  - config.force_ssl = true / HSTS / TLS 1.2+ / 適切な暗号スイート\n\n# Layer 2: 認証強度\n#  - bcrypt (cost=12)\n#  - 弱パスワード禁止 (NIST SP 800-63B: 長さ重視)\n#  - TOTP / WebAuthn (MFA)\n\n# Layer 3: ブルートフォース対策\n#  - rack-attack: IP/メール 単位 5 回 /分\n#  - 失敗時の遅延応答 (timing attack 緩和は別途定数時間比較)\n\n# Layer 4: セッション\n#  - Secure / HttpOnly / SameSite=Lax\n#  - 適切な expire\n#  - ログイン後にセッション ID 再生成 (固定化攻撃対策)\n\n# Layer 5: 認可\n#  - Pundit / CanCanCan\n#  - リソース所有者スコープ\n\n# Layer 6: 検知\n#  - filter_parameters でログ漏洩防止\n#  - Sentry / Datadog でエラー監視\n#  - 不正パターン検知 (ログイン失敗集中、IP からの大量 4xx 等)\n\n# Layer 7: 周辺\n#  - Dependabot / bundle audit で gem を最新に\n#  - WAF (Cloudflare / AWS WAF) で表面の異常を撥ねる",
            language: "ruby",
            notes: [
              "『完璧な 1 つの防御』ではなく『複数の不完全な防御を重ねる』のが現実解",
              "予算 / リスクに応じて層を増やす — スタートアップは 1〜4 層、エンタープライズは 7 層 + 監査",
            ],
          },
        ],
        keyTakeaways: [
          "OWASP Top 10 (2021) の 1 位は Broken Access Control、認可は最頻出の脆弱性源",
          "認証 (AuthN, 401) と認可 (AuthZ, 403) を必ず分けて考える",
          "1 つの対策に頼らず多層防御で『破られても被害を限定』",
        ],
        comprehensionQuestionIds: ["sec-007"],
      },
      {
        id: "injection",
        title: "2. Injection — SQL / コマンド / NoSQL の防御",
        intro:
          "Injection は『ユーザー入力を実行コードの一部にしてしまう』脆弱性。SQL Injection、コマンド Injection、NoSQL Injection を整理。Rails の placeholder と sanitize ヘルパを正しく使う。",
        readingMinutes: 9,
        objectives: [
          "SQL Injection の典型パターンを見抜き、ActiveRecord で安全に書ける",
          "コマンド Injection / NoSQL Injection を防げる",
          "order(params[:sort]) のようなカラム名 injection も意識する",
        ],
        sections: [
          {
            heading: "2.1 SQL Injection — placeholder と Hash 形式",
            body: "**文字列補間** (`#{params[:x]}`) で SQL を組むのは即アウト。`User.where(\"name = '#{params[:name]}'\")` に対し攻撃者が `' OR 1=1; --` を送ると認証回避。ActiveRecord の `?` placeholder / `:name` placeholder / Hash 形式を使えば自動エスケープされる。",
            code: "# ❌ 危険 (文字列補間)\nUser.where(\"name = '#{params[:name]}'\")\nUser.where(\"name = #{params[:name]}\")\nUser.find_by_sql(\"SELECT * FROM users WHERE id = #{params[:id]}\")\n\n# 攻撃例\n# params[:name] = \"' OR 1=1; --\"\n# → SELECT * FROM users WHERE name = '' OR 1=1; --'\n# → 全件返る\n\n# params[:name] = \"'; DROP TABLE users; --\"\n# → users テーブル削除\n\n# ✅ 安全 — placeholder\nUser.where(\"name = ?\", params[:name])\nUser.where(\"name = :n AND age > :a\", n: params[:name], a: 18)\nUser.find_by_sql([\"SELECT * FROM users WHERE id = ?\", params[:id]])\n\n# ✅ 安全 — Hash 形式 (推奨)\nUser.where(name: params[:name])\nUser.where(name: params[:name], active: true)\nUser.find_by(name: params[:name])\n\n# ✅ 範囲・配列も Hash 形式で\nUser.where(age: 18..65)\nUser.where(role: %w[admin editor])\nUser.where(created_at: 1.week.ago..)",
            language: "ruby",
            notes: [
              "ActiveRecord は placeholder と Hash 形式で値を自動エスケープ + 型変換",
              "raw SQL を書く必要があれば必ず sanitize_sql_for_conditions / find_by_sql + 配列形式",
            ],
          },
          {
            heading: "2.2 order / group / カラム名 Injection",
            body: "値はエスケープされても、**カラム名 / SQL キーワード** が動的だと別の Injection が起きる。`order(params[:sort])` は攻撃者が `id; DROP TABLE users` を送れる。`pluck` / `select` / `group` / `order` でユーザー入力を直接受けない、または allowlist で検証する。",
            code: "# ❌ 危険 (カラム名 injection)\nUser.order(params[:sort])              # → id; DROP TABLE users\nUser.group(params[:group])\nUser.pluck(params[:col])\n\n# ✅ allowlist で検証\nALLOWED_SORTS = %w[id name created_at]\nsort = ALLOWED_SORTS.include?(params[:sort]) ? params[:sort] : 'id'\nUser.order(sort)\n\n# ✅ Hash 形式 / 定数だけ受ける\nUser.order(name: :desc)\nUser.order(params[:sort] == 'name' ? { name: :desc } : { id: :desc })\n\n# ✅ Arel で型安全に\nUser.order(User.arel_table[:name].desc)\n\n# ✅ sanitize_sql_for_order (Rails 6+)\nUser.order(Arel.sql(User.sanitize_sql_for_order(params[:sort])))\n# ※ sanitize_sql_for_order は完璧ではない — 結局 allowlist が安全",
            language: "ruby",
            notes: [
              "Rails 6+ の Arel.sql(...) で『生 SQL を意図的に許可』を明示できる (それ以外は警告)",
              "ソート機能の UI は『プルダウン』にして allowlist と組合せるのが最も安全",
            ],
          },
          {
            heading: "2.3 コマンド Injection — shell に値を直接渡さない",
            body: "`system(\"convert #{params[:filename]} out.png\")` のような shell 経由のコマンド実行は、`; rm -rf /` のような注入を許す。Ruby なら **配列形式** (`system('convert', filename, 'out.png')`) で渡せば shell を経由せずに引数として安全に渡る。",
            code: "# ❌ 危険 (shell 経由)\nsystem(\"convert #{params[:filename]} out.png\")\nbacktick = `ls #{params[:dir]}`\nIO.popen(\"grep #{params[:q]} log.txt\")\n\n# 攻撃例: params[:filename] = 'a.jpg; rm -rf /'\n# → convert a.jpg; rm -rf / out.png\n\n# ✅ 安全 (配列形式 — shell 経由しない)\nsystem('convert', params[:filename], 'out.png')\nIO.popen(['grep', params[:q], 'log.txt'])\nOpen3.capture3('git', 'clone', params[:url])\n\n# ✅ allowlist で検証\nALLOWED_DIRS = %w[uploads tmp]\nif ALLOWED_DIRS.include?(params[:dir])\n  Dir.entries(\"/var/#{params[:dir]}\")\nend\n\n# ✅ Shellwords でエスケープ (どうしても shell 経由したい時)\nrequire 'shellwords'\nsystem(\"echo #{Shellwords.escape(user_input)}\")",
            language: "ruby",
            notes: [
              "system() / Kernel#` / Kernel#exec / IO.popen の文字列単一引数は shell 経由 → 配列形式で回避",
              "URL / ファイル名 / その他外部入力を shell に渡す処理を見たら必ず疑う",
            ],
          },
          {
            heading: "2.4 NoSQL Injection / その他の Injection",
            body: "MongoDB / Elasticsearch / Redis でも Injection は起きる。JSON クエリに直接 user input を入れると、`{ \"$gt\": \"\" }` を送られて全件マッチなど。Redis の Lua スクリプト / Elasticsearch の query string も注意。",
            code: "# ❌ MongoDB (Mongoid) で危険\nUser.where(name: params[:name])           # 通常はこれで OK\n# ただし params[:name] が Hash で来ると...\n# params = { name: { '$gt' => '' } }\n# → 全件 match\n\n# ✅ パラメータの型を強制\ndef user_params\n  params.require(:user).permit(:name)     # Strong Params で文字列強制\nend\nname = String(params[:name])               # 型変換\n\n# ❌ Elasticsearch query string\nclient.search(body: { query: { query_string: { query: params[:q] } } })\n# user input が AND OR ( ) などを含むと意図しない検索に\n\n# ✅ match query (構文を解釈しない)\nclient.search(body: { query: { match: { field: params[:q] } } })\n\n# ❌ LDAP / XPath / template injection (ERB / Jinja2 で user input を直接埋め込む)\nERB.new(params[:template]).result(binding)   # template injection 直行\n\n# ✅ template は固定ファイルから読み、変数だけ渡す",
            language: "ruby",
            notes: [
              "JSON API は『来たデータの型』を信用しない — Strong Params + 型変換で固める",
              "テンプレートエンジンに user input を渡すのは絶対避ける",
            ],
          },
        ],
        keyTakeaways: [
          "SQL は placeholder (?) / Hash 形式 / Arel — 文字列補間 #{} は禁忌",
          "order / group / カラム名は allowlist で検証、Arel.sql() で明示",
          "shell コマンドは配列形式で system('cmd', arg1, arg2) — 文字列単一は危険",
          "NoSQL / Elasticsearch / Template も Injection の対象、型と構文を制御",
        ],
        comprehensionQuestionIds: ["sec-002"],
      },
      {
        id: "xss-and-csp",
        title: "3. XSS と Content Security Policy",
        intro:
          "XSS (Cross-Site Scripting) は『他人のページに JS を仕込む』攻撃。Rails は自動 HTML エスケープで Reflected XSS をほぼ防ぐが、`html_safe` / `raw` で穴が開く。CSP で『二段の防御』を加える。",
        readingMinutes: 9,
        objectives: [
          "Reflected / Stored / DOM-based XSS の違いを説明できる",
          "Rails の自動エスケープと html_safe / sanitize の使い分けを書ける",
          "Content Security Policy で外部スクリプト / インライン JS を禁止できる",
        ],
        sections: [
          {
            heading: "3.1 XSS の 3 種類",
            body: "**Reflected XSS**: URL クエリの値がそのままページに出る (例: 検索結果の query 表示)。**Stored XSS**: DB に保存された不正 HTML が他人の画面で実行 (コメント欄 / プロフィール)。**DOM-based XSS**: クライアント JS で `innerHTML = location.hash` のように DOM 操作で発生。",
            code: "# Reflected XSS の例\n# URL: /search?q=<script>alert(1)</script>\n# 危険なテンプレート\n<%= raw \"Search results for: #{params[:q]}\" %>\n# → 攻撃者が URL を送りつけるだけで JS 実行\n\n# Stored XSS の例\n# user.bio に <script>steal_cookie()</script> が保存される\n<%= @user.bio.html_safe %>\n# → 他のユーザーがプロフィールを開く度に JS 実行\n\n# DOM-based XSS の例 (Client JS)\ndocument.getElementById('hello').innerHTML = location.hash  // ❌\nelement.textContent = location.hash                          // ✅ (textContent は HTML 解釈しない)",
            language: "ruby",
            notes: [
              "Reflected は『送りつけ攻撃』、Stored は『時限爆弾』、DOM-based は『フロント側で起きる』",
              "Cookie + XSS = アカウント乗っ取り (`document.cookie` で送信されるため HttpOnly 必須)",
            ],
          },
          {
            heading: "3.2 Rails の自動エスケープと html_safe の罠",
            body: "Rails 3+ は `<%= %>` で `ActiveSupport::SafeBuffer` 以外を自動エスケープ。`raw(str)` / `str.html_safe` / `<%== %>` は明示的にエスケープを切る — **ユーザー入力に html_safe するのは絶対 NG**。安全な HTML フラグメントを作るなら `content_tag` / `tag.div` / `sanitize`。",
            code: "# 安全 (自動エスケープ)\n<%= @user.name %>                       # < > & ' \" が &lt; 等に変換\n<%= @user.bio %>                        # 同上\n<%= content_tag(:p, @user.bio) %>       # 自動エスケープ + タグ生成\n<%= link_to @user.name, user_path(@user) %>\n<%= simple_format(@user.bio) %>         # 改行 → <br> しつつエスケープ\n\n# 危険 (エスケープ無効化)\n<%= @user.bio.html_safe %>              # ユーザー入力を HTML 扱い (絶対 NG)\n<%= raw @user.bio %>                     # 同上\n<%== @user.bio %>                        # 同上 (== は raw と同等)\n\n# 安全な使い方: html_safe は『コード側で書いた安全な HTML』にのみ\ndef alert_html(message)\n  content_tag(:div, class: 'alert') do\n    content_tag(:strong, 'Notice:') + ' ' + h(message)\n  end\nend\n\n# サニタイズ (許可タグだけ通す)\n<%= sanitize @user.bio, tags: %w[p br b i a],\n  attributes: %w[href title] %>\n\n# Markdown の場合は処理系の安全設定\nrequire 'redcarpet'\nrenderer = Redcarpet::Render::HTML.new(filter_html: true, no_styles: true)\nmarkdown = Redcarpet::Markdown.new(renderer, ...)\nmarkdown.render(@user.bio)              # HTML タグは除去される",
            language: "ruby",
            notes: [
              "ユーザー入力に html_safe を呼ぶコードを見たら必ずレビュー指摘",
              "Brakeman (静的解析) で html_safe / raw を自動検出できる",
            ],
          },
          {
            heading: "3.3 Content Security Policy (CSP)",
            body: "**CSP** は『どこから来た JS/CSS/img なら許可するか』をブラウザに指示する HTTP ヘッダ。XSS で `<script>` を仕込まれても、CSP が外部スクリプトを禁止していれば実行されない (**二段の防御**)。インライン JS も禁止できる。Rails 5.2+ は DSL を提供。",
            code: "# config/initializers/content_security_policy.rb\nRails.application.config.content_security_policy do |policy|\n  policy.default_src :self, :https\n  policy.font_src    :self, :https, :data\n  policy.img_src     :self, :https, :data\n  policy.object_src  :none                # <object>, Flash 等を完全禁止\n  policy.script_src  :self, :https\n  policy.style_src   :self, :https\n  policy.connect_src :self, :https, 'wss://example.com'\n  policy.frame_ancestors :none            # iframe 埋め込み禁止 (clickjacking 対策)\n  policy.base_uri    :self\n  policy.form_action :self                # フォーム送信先制限\n\n  # 違反レポート受信先 (Sentry / Report URI)\n  policy.report_uri  'https://example.report-uri.com/r/d/csp/enforce'\nend\n\n# インライン JS を許可したい時は nonce で\nRails.application.config.content_security_policy_nonce_generator = ->(req) { SecureRandom.base64(16) }\nRails.application.config.content_security_policy_nonce_directives = %w[script-src style-src]\n\n# ERB で nonce を埋め込む\n<%= javascript_tag nonce: true do %>\n  console.log('this inline JS is allowed via nonce')\n<% end %>\n\n# 段階導入: report-only で検出 → 違反を直してから enforce\nRails.application.config.content_security_policy_report_only = true",
            language: "ruby",
            notes: [
              "CSP の段階導入: report-only でログ収集 → 違反を解消 → enforce に切替",
              "GA / Stripe / Intercom など 3rd party SDK を入れる時は script_src に追加",
              "X-Frame-Options: DENY は CSP の frame-ancestors と重複 — モダンは CSP",
            ],
          },
          {
            heading: "3.4 関連の防御ヘッダ",
            body: "CSP 以外にも『付けておくべき』ヘッダがある。**X-Content-Type-Options: nosniff** (MIME sniffing 防止)、**Referrer-Policy** (Referer 漏洩制御)、**Permissions-Policy** (Camera / Mic / Geo 等の機能制限)。**X-XSS-Protection** は廃止 (今は CSP が代替)。",
            code: "# config/application.rb or initializers/secure_headers.rb\nclass ApplicationController < ActionController::Base\n  before_action :set_security_headers\n\n  private\n\n  def set_security_headers\n    response.headers['X-Content-Type-Options'] = 'nosniff'\n    response.headers['Referrer-Policy'] = 'strict-origin-when-cross-origin'\n    response.headers['Permissions-Policy'] = 'camera=(), microphone=(), geolocation=(self)'\n  end\nend\n\n# secure_headers gem (より宣言的)\n# Gemfile\ngem 'secure_headers'\n\n# config/initializers/secure_headers.rb\nSecureHeaders::Configuration.default do |config|\n  config.x_content_type_options = 'nosniff'\n  config.x_frame_options = 'DENY'\n  config.referrer_policy = %w[strict-origin-when-cross-origin]\n  config.csp = {\n    default_src: %w['self' https:],\n    script_src: %w['self' https:],\n    ...\n  }\nend\n\n# 検証ツール\n# https://securityheaders.com/ で URL を入れて A+ を目指す\n# https://csp-evaluator.withgoogle.com/ で CSP の評価",
            language: "ruby",
            notes: [
              "securityheaders.com で本番サイトを評価 — A+ を目指して足りないものを補う",
              "Rails 7+ は X-Frame-Options: SAMEORIGIN がデフォルト",
            ],
          },
        ],
        keyTakeaways: [
          "Rails の <%= %> は自動エスケープ、html_safe / raw を user input に使うのは絶対 NG",
          "CSP で『どこから JS/CSS を実行してよいか』を制限 — XSS の二段防御",
          "段階導入: CSP は report-only → enforce、定期的に securityheaders.com で確認",
          "X-Content-Type-Options / Referrer-Policy / Permissions-Policy も併せて設定",
        ],
        comprehensionQuestionIds: ["sec-004", "sec-009"],
      },
      {
        id: "csrf-session-cookie",
        title: "4. CSRF とセッション / Cookie の安全設計",
        intro:
          "CSRF (Cross-Site Request Forgery) は『ログイン中ユーザーを悪用して別サイトから勝手に POST』。Rails は authenticity_token で防御。セッション Cookie は Secure / HttpOnly / SameSite の 3 フラグを必ず付ける。",
        readingMinutes: 8,
        objectives: [
          "CSRF の仕組みと Rails の protect_from_forgery の動作を説明できる",
          "Secure / HttpOnly / SameSite の 3 フラグの役割を区別できる",
          "セッション固定化 / ハイジャック対策 (reset_session) を書ける",
        ],
        sections: [
          {
            heading: "4.1 CSRF の仕組みと Rails の protect_from_forgery",
            body: "ユーザーが Bank にログイン中、攻撃者のサイトを開くと `<form action='https://bank.com/transfer' method='POST'><input name='to' value='attacker'>` が自動 submit される。ブラウザは Bank のセッション Cookie を勝手に付けて送るので、Bank サーバから見ると本人のリクエスト。**authenticity_token** で『このフォームは自サイトから』を証明する。",
            code: "# ApplicationController (Rails 5+ デフォルト)\nclass ApplicationController < ActionController::Base\n  protect_from_forgery with: :exception\n  # invalid token → raise ActionController::InvalidAuthenticityToken\nend\n\n# form_with は自動で hidden 埋め込み\n<%= form_with model: @user do |f| %>\n  <!-- <input type=\"hidden\" name=\"authenticity_token\" value=\"...\"> が自動挿入 -->\n  <%= f.text_field :name %>\n<% end %>\n\n# JSON API でフロントが Rails の view から来ない場合\n# → meta タグから取り出してヘッダで送る\n<%= csrf_meta_tags %>\n# <meta name=\"csrf-token\" content=\"...\">\n\n# Client JS\nconst token = document.querySelector('meta[name=\"csrf-token\"]').content\nfetch('/api/x', {\n  method: 'POST',\n  headers: { 'X-CSRF-Token': token, 'Content-Type': 'application/json' },\n  body: JSON.stringify({ ... })\n})\n\n# 純粋な API (ActionController::API) では protect_from_forgery が不要\n# Bearer token (JWT) や session を使わない場合は CSRF が原理的に発生しない\nclass Api::BaseController < ActionController::API\n  # protect_from_forgery が無くて OK (session を使わないので)\nend",
            language: "ruby",
            diagram: `sequenceDiagram
  participant User as 被害者ブラウザ
  participant Evil as 攻撃者サイト<br/>(evil.com)
  participant Bank as bank.com

  User->>Bank: ログイン (session_id Cookie 取得)
  User->>Evil: 不審サイトを訪問
  Evil-->>User: 自動 POST フォーム (bank.com/transfer)
  User->>Bank: POST /transfer + Cookie 自動添付
  Note over Bank: ❌ Token 無し → 401/403
  Bank-->>User: protect_from_forgery で拒否`,
            diagramCaption: "CSRF: ブラウザは Cookie を自動添付するが、authenticity_token が無いと Rails が拒否する",
            notes: [
              "GET は副作用なしなので CSRF 対象外 (HTTP の決まり) — 副作用のある GET を作らない",
              "SameSite=Lax (Cookie) があれば多くの CSRF が自動で防がれる (4.2)",
            ],
          },
          {
            heading: "4.2 Cookie の Secure / HttpOnly / SameSite",
            body: "**Secure**: HTTPS でのみ送信 (盗聴対策)。**HttpOnly**: JavaScript からアクセス不可 (XSS 二次被害防止 — Cookie を盗まれない)。**SameSite=Lax** (デフォルト) / Strict / None: クロスサイトリクエストでの送信を制限 (CSRF 緩和)。",
            code: "# config/initializers/session_store.rb\nRails.application.config.session_store :cookie_store,\n  key: '_myapp_session',\n  secure: Rails.env.production?,   # HTTPS 限定\n  httponly: true,                  # JS から読めない (XSS 対策)\n  same_site: :lax                  # CSRF 緩和 (default 推奨)\n\n# Strict = 全クロスサイト遷移で送らない (UX が落ちる場面あり)\n# Lax    = top-level GET だけ送る (デフォルト推奨)\n# None   = 制限なし (要 Secure)\n\n# 独自 cookie\ncookies[:remember_me] = {\n  value: token,\n  expires: 1.year.from_now,\n  secure: Rails.env.production?,\n  httponly: true,\n  same_site: :strict\n}\n\n# 暗号化 cookie (改ざん防止)\ncookies.encrypted[:user_id] = current_user.id\n# 取得時 cookies.encrypted[:user_id] で復号\n\n# 署名のみ (改ざん防止だが内容は読める)\ncookies.signed[:user_id] = current_user.id\n\n# サイズ制限\n# Cookie は 4KB まで、超えるとブラウザが切り捨て\n# 大量データは session ID + サーバ側ストア (Redis 等) に",
            language: "ruby",
            notes: [
              "HttpOnly + Secure + SameSite=Lax の 3 つは『デフォルトで全 Cookie に付ける』",
              "暗号化 cookie のキーは Rails の secret_key_base (credentials) から派生",
            ],
          },
          {
            heading: "4.3 セッション固定化 / ハイジャック対策",
            body: "**セッション固定化 (Session Fixation)**: 攻撃者が予測可能な session ID を被害者に使わせてからログインさせ、同じ ID でアクセスする攻撃。対策はログイン成功直後の **reset_session** (新 ID を発行)。**セッションハイジャック**: Cookie 自体を盗む — Secure / HttpOnly / 短い expire / IP / User-Agent との照合で軽減。",
            code: "# ログイン処理 (Devise 等は自動でやってくれる)\nclass SessionsController < ApplicationController\n  def create\n    user = User.find_by(email: params[:email])\n    if user&.authenticate(params[:password])\n      reset_session                          # 旧 session を破棄 (固定化対策)\n      session[:user_id] = user.id\n      redirect_to dashboard_path\n    else\n      flash.now[:alert] = 'Invalid email or password'\n      render :new, status: :unauthorized\n    end\n  end\n\n  def destroy\n    reset_session                            # ログアウト時も全クリア\n    redirect_to root_path\n  end\nend\n\n# 追加のハイジャック対策\nsession[:user_agent_hash] = Digest::SHA256.hexdigest(request.user_agent.to_s)\n# 後で照合\nif session[:user_agent_hash] != Digest::SHA256.hexdigest(request.user_agent.to_s)\n  reset_session   # 環境が変わったら無効\nend\n\n# IP も照合する流派もあるが、モバイル / Wi-Fi 切替で頻繁にズレるので避けることも\n\n# 適切な expire\nRails.application.config.session_store :cookie_store,\n  expire_after: 30.minutes,                  # 短め\n  key: ...",
            language: "ruby",
            notes: [
              "MFA / WebAuthn を併用するとセッション盗難被害が劇的に下がる",
              "Remember-me cookie は別管理 (短い session + 長い remember token) が一般的",
            ],
          },
        ],
        keyTakeaways: [
          "CSRF は authenticity_token + SameSite=Lax の 2 段で防御、API なら origin 検証 / Bearer token",
          "Cookie は Secure / HttpOnly / SameSite の 3 フラグ全部、デフォルトで付ける",
          "ログイン成功直後に reset_session で固定化対策、短めの expire_after",
        ],
        comprehensionQuestionIds: ["sec-003", "sec-014"],
      },
      {
        id: "authn-and-authz",
        title: "5. 認証と認可 — bcrypt / Strong Params / Pundit / JWT",
        intro:
          "パスワードハッシュ (bcrypt)、Mass Assignment 対策 (Strong Params)、認可ポリシー (Pundit)、API 認証 (JWT) を整理。Pundit の例で『リソースレベル認可』も実装する。",
        readingMinutes: 10,
        objectives: [
          "bcrypt + has_secure_password でパスワードを安全に保存できる",
          "Strong Parameters で Mass Assignment を防げる",
          "Pundit Policy でリソース単位の認可を書ける、JWT の alg confusion を防げる",
        ],
        sections: [
          {
            heading: "5.1 パスワードハッシュ — bcrypt + has_secure_password",
            body: "**平文 / MD5 / SHA1 は絶対 NG**。MD5/SHA は速すぎて GPU で総当たり可能。**bcrypt** は cost (work factor) でハッシュ計算を意図的に遅くし、自動的にレコード毎の salt を付与。Rails では `has_secure_password` で 1 行宣言。",
            code: "# Gemfile\ngem 'bcrypt'\n\n# migration\nadd_column :users, :password_digest, :string\n\n# model\nclass User < ApplicationRecord\n  has_secure_password\n  # accessor: password / password_confirmation\n  # 保存時に bcrypt で hash → password_digest カラムに格納\n  # validates :password, presence: true, length: { minimum: 8 }, on: :create\nend\n\n# 使い方\nu = User.new(email: 'a@x', password: 'secret123', password_confirmation: 'secret123')\nu.save\nu.password_digest         # \"$2a$12$N9qo8uLOickgx2ZMRZoMye...\" (bcrypt hash)\n\nu.authenticate('secret123')   # returns user\nu.authenticate('wrong')        # returns false\n\n# Cost (work factor) の調整\nclass User < ApplicationRecord\n  has_secure_password\n  # 開発: 4 (高速)、本番: 12 (推奨、〜100ms)\n  BCRYPT_COST = Rails.env.test? ? BCrypt::Engine::MIN_COST : 12\nend\n\n# パスワード強度ポリシー (NIST SP 800-63B 推奨)\nvalidates :password,\n  length: { minimum: 12 },             # 長さ重視 (複雑性は副次的)\n  format: { without: /\\A(password|123456)\\z/i }  # よくある弱パス",
            language: "ruby",
            notes: [
              "bcrypt の cost は将来 14 や 15 に上げる流れ — HW 性能向上に追随",
              "より新しい argon2 / scrypt も選択肢 (argon2 gem)",
              "passwords は logs に出さない → filter_parameters (7 章)",
            ],
          },
          {
            heading: "5.2 Strong Parameters — Mass Assignment 対策",
            body: "**Mass Assignment**: 攻撃者が `is_admin=true` のような余分な属性を一括代入される脆弱性。Rails 4+ では `params.require(:user).permit(:name, :email)` を必須化。**permit していない属性は無視される**。`permit!` (全許可) は厳禁。",
            code: "# ❌ 危険 (params をそのまま渡す)\nclass UsersController < ApplicationController\n  def create\n    @user = User.create(params[:user])   # is_admin も入る可能性\n  end\nend\n\n# ✅ Strong Parameters\nclass UsersController < ApplicationController\n  def create\n    @user = User.new(user_params)\n    if @user.save\n      redirect_to @user\n    else\n      render :new, status: :unprocessable_entity\n    end\n  end\n\n  private\n\n  def user_params\n    params.require(:user).permit(:name, :email, :password, :password_confirmation)\n    # is_admin は permit していないので無視される\n  end\nend\n\n# ネストした params\ndef post_params\n  params.require(:post).permit(\n    :title, :body,\n    tags: [],                           # 配列\n    metadata: [:lang, :region],         # ネストしたオブジェクト\n    images_attributes: [:id, :file, :_destroy]   # has_many :images の form\n  )\nend\n\n# 管理者画面など『is_admin も許す』場面は条件で分岐\ndef user_params\n  permitted = [:name, :email]\n  permitted << :role if current_user.admin?     # admin だけ追加\n  params.require(:user).permit(*permitted)\nend\n\n# ❌ 禁忌\nparams.require(:user).permit!                   # 全許可 — 絶対使わない",
            language: "ruby",
            notes: [
              "新機能の form で属性を追加したら permit list の更新を忘れない (動かない原因にもなる)",
              "GitHub の 2012 年の Mass Assignment 事件が Rails 4 の Strong Params 導入の発端",
            ],
          },
          {
            heading: "5.3 Pundit — リソースレベルの認可",
            body: "**Pundit** はモデル毎の Policy クラスに認可ロジックをまとめる軽量 gem。各 action に対して `update?` / `destroy?` のようなメソッドを定義し、controller で `authorize @resource` を呼ぶ。`policy_scope` で一覧の絞り込みも統一できる。",
            code: "# Gemfile\ngem 'pundit'\n\n# rails g pundit:install → ApplicationPolicy が生成\n\n# app/policies/post_policy.rb\nclass PostPolicy < ApplicationPolicy\n  def index?\n    true                                  # 誰でも一覧 OK\n  end\n\n  def show?\n    record.published? || owner? || user&.admin?\n  end\n\n  def create?\n    user.present?                          # ログイン中ならば\n  end\n\n  def update?\n    owner? || user&.admin?                # 本人 or admin\n  end\n\n  def destroy?\n    owner? || user&.admin?\n  end\n\n  private\n\n  def owner?\n    record.user_id == user&.id\n  end\n\n  # 一覧の Scope (current_user が見られる Post に絞る)\n  class Scope < Scope\n    def resolve\n      if user&.admin?\n        scope.all\n      elsif user\n        scope.where('published = true OR user_id = ?', user.id)\n      else\n        scope.where(published: true)\n      end\n    end\n  end\nend\n\n# Controller\nclass PostsController < ApplicationController\n  before_action :authenticate_user!, except: [:index, :show]\n\n  def index\n    @posts = policy_scope(Post)            # Scope.resolve が呼ばれる\n  end\n\n  def show\n    @post = Post.find(params[:id])\n    authorize @post                        # show? を呼ぶ\n  end\n\n  def update\n    @post = Post.find(params[:id])\n    authorize @post                        # update? を呼ぶ\n    @post.update(post_params)\n  end\nend\n\n# 権限なしの場合は Pundit::NotAuthorizedError → 403 Forbidden に変換\nrescue_from Pundit::NotAuthorizedError do\n  render plain: 'Forbidden', status: :forbidden\nend",
            language: "ruby",
            notes: [
              "Pundit の代替: CanCanCan (DSL で一箇所定義) / Action Policy (より高速・最近人気)",
              "全 controller で authorize を呼び忘れていないか `after_action :verify_authorized` で強制",
            ],
          },
          {
            heading: "5.4 JWT — API 認証と alg confusion の罠",
            body: "**JWT (JSON Web Token)** は『Header.Payload.Signature』の 3 部 Base64 形式。API 認証の定番だが落とし穴も多い。最重要は **alg confusion**: トークンの alg ヘッダを攻撃者が書き換えて検証を欺く。**検証時に許可 alg を必ず明示**する。",
            code: "require 'jwt'\n\n# 発行\npayload = {\n  user_id: user.id,\n  exp: 1.hour.from_now.to_i,             # 必ず短く (アクセストークン)\n  iat: Time.current.to_i,\n  jti: SecureRandom.uuid                  # 失効管理用\n}\nsecret = Rails.application.credentials.jwt_secret\ntoken = JWT.encode(payload, secret, 'HS256')\n\n# ❌ 危険 — alg を自動検出 (攻撃者が alg=none / 別 alg に書き換え可能)\nJWT.decode(token, secret)\n\n# ✅ 安全 — 許可 alg を配列で明示\nJWT.decode(token, secret, true, { algorithm: 'HS256' })\n# または\nJWT.decode(token, secret, true, { algorithms: ['HS256'] })\n\n# よくある罠\n# 1. alg=none を許可 → 署名なしで通る (古いライブラリ)\n# 2. RS256 (公開鍵) を HS256 (共有鍵) として処理 → 公開鍵で署名できる (alg confusion)\n# 3. exp を検証していない → 期限切れトークンが永久に使える\n# 4. シークレットが弱い / git にコミット\n\n# 対策\n# - access token は短命 (5〜60 分)、refresh token を別管理\n# - secret は credentials に\n# - 即時失効が必要なら jti をブラックリストで保持\n# - HS256 (共有鍵) は対称 — 全サービスが同じ secret を持つ必要がある\n# - 公開できる検証なら RS256 / ES256 (非対称) を選ぶ\n\n# Rails 8 で導入された built-in token authentication も検討候補\n# https://github.com/rails/rails のリリースノート参照",
            language: "ruby",
            notes: [
              "JWT は『session の代替』として人気だが、失効が難しいので短命 + refresh の運用設計が必須",
              "Refresh token は DB に保存して失効可能に — JWT で全部やろうとしない",
            ],
          },
        ],
        keyTakeaways: [
          "パスワードは bcrypt + has_secure_password、cost は本番 12 を目安に",
          "Strong Params で Mass Assignment 防御、permit! は禁忌",
          "認可は Pundit / CanCanCan で『リソース単位』に書き、URL レベルだけに頼らない",
          "JWT は alg を明示 + exp 必須 + secret を credentials に、失効が要るなら jti ブラックリスト",
        ],
        comprehensionQuestionIds: ["sec-001", "sec-006", "sec-010"],
      },
      {
        id: "secrets-and-transport",
        title: "6. シークレット管理と通信 — credentials / HTTPS / HSTS",
        intro:
          "API キー / DB パスワード / 暗号鍵をどう保管するか (credentials.yml.enc / env)、HTTPS の強制 (force_ssl) と HSTS、SSRF / 内部 IP 保護まで通信周りを整理。",
        readingMinutes: 9,
        objectives: [
          "credentials.yml.enc + master.key の仕組みを説明できる、本番への RAILS_MASTER_KEY 流し込み",
          "force_ssl と HSTS の関係を理解、preload に乗せる前のチェックを書ける",
          "SSRF / オープンリダイレクト / Sub-Resource Integrity (SRI) を意識した実装ができる",
        ],
        sections: [
          {
            heading: "6.1 credentials.yml.enc — 暗号化シークレット管理",
            body: "Rails 5.2+ は **config/credentials.yml.enc** に暗号化された秘密情報を保存し、**config/master.key** で復号する。`.enc` ファイルは git にコミット OK (暗号化されているので)、`master.key` は **.gitignore 必須**。本番では `RAILS_MASTER_KEY` 環境変数で渡す。",
            code: "# 編集 (一時的に復号 → $EDITOR で開く → 保存で再暗号化)\nEDITOR=vim rails credentials:edit\n\n# 環境別 (推奨、6.0+)\nEDITOR=vim rails credentials:edit --environment production\n# → config/credentials/production.yml.enc + config/credentials/production.key\n\n# 中身 (YAML)\nstripe:\n  publishable_key: pk_live_xxx\n  secret_key: sk_live_xxx\naws:\n  access_key_id: AKIAxxx\n  secret_access_key: xxx\njwt_secret: xxx\nsecret_key_base: xxx\n\n# 参照\nRails.application.credentials.stripe[:secret_key]\nRails.application.credentials.dig(:aws, :access_key_id)\nRails.application.credentials.jwt_secret\n\n# 本番デプロイ時\nRAILS_MASTER_KEY=xxxxx puma -e production\n# または\necho 'RAILS_MASTER_KEY=xxxxx' > /etc/secrets/myapp.env\n# systemd service で EnvironmentFile=/etc/secrets/myapp.env\n\n# .gitignore (重要)\n/config/master.key\n/config/credentials/*.key\n\n# master.key を紛失すると復号不可 → 全 secret をローテーション必要",
            language: "ruby",
            notes: [
              "master.key は 1Password / Bitwarden などのチームシークレットで共有",
              "Heroku / Render / Vercel / fly.io 等は env 変数として設定するだけ",
              "credentials の代わりに dotenv / 環境変数派もあり (好み + 運用)",
            ],
          },
          {
            heading: "6.2 HTTPS の強制 — force_ssl と HSTS",
            body: "**force_ssl = true** で HTTP → HTTPS 自動リダイレクト + HSTS ヘッダ自動付与。**HSTS (Strict-Transport-Security)** はブラウザに『次回からは最初から HTTPS』を強制する仕組み。`preload` を有効にしてブラウザ組み込みリストに乗せると、初回アクセスから HTTPS。",
            code: "# config/environments/production.rb\nconfig.force_ssl = true\n# → 自動で以下を実行\n# - HTTP リクエストを HTTPS にリダイレクト (301)\n# - Strict-Transport-Security ヘッダを付与\n# - Cookie に Secure フラグを付与\n\n# 細かい制御\nconfig.ssl_options = {\n  hsts: {\n    expires: 1.year,                     # max-age\n    subdomains: true,                    # includeSubDomains\n    preload: true,                       # preload 対象に名乗り\n  },\n  redirect: { exclude: ->(request) { request.path.start_with?('/health') } }\n}\n\n# 生のヘッダ\n# Strict-Transport-Security: max-age=31536000; includeSubDomains; preload\n\n# HSTS preload リストへの登録 (一度乗ると外しにくいので注意)\n# https://hstspreload.org/ で確認 → 登録申請\n\n# 必須条件 (preload):\n# - 全サブドメインも HTTPS\n# - HTTP → HTTPS リダイレクトが動く\n# - max-age >= 31536000 (1 年)\n# - includeSubDomains + preload を含む\n\n# TLS バージョン / 暗号スイート (nginx / cloud LB 側で設定)\n# - TLS 1.2 以上のみ許可、1.0/1.1 は無効化\n# - 弱い暗号スイート (RC4, 3DES, MD5) を無効化\n# - Mozilla SSL Configuration Generator で適切な設定を生成\n#   https://ssl-config.mozilla.org/",
            language: "ruby",
            notes: [
              "Let's Encrypt + Certbot で無料証明書、cert-manager / Caddy なら自動更新",
              "HSTS preload は 1 度乗ると数年単位で外せない — staging で十分テストしてから",
            ],
          },
          {
            heading: "6.3 SSRF — サーバ側リクエスト偽造",
            body: "**SSRF**: ユーザーが指定した URL をサーバが fetch する機能で、内部 IP (169.254.169.254 の AWS metadata, 127.0.0.1, 10.0.0.0/8 など) を叩かれる攻撃。クラウド metadata 経由で IAM 認証情報まで盗まれる事例も。**URL allowlist + 内部 IP block** が必須。",
            code: "# ❌ 危険 — ユーザー指定 URL をそのまま fetch\ndef preview\n  uri = URI(params[:url])\n  response = Net::HTTP.get(uri)\n  render plain: response\nend\n\n# 攻撃: params[:url] = 'http://169.254.169.254/latest/meta-data/iam/security-credentials/'\n# → AWS の IAM 認証情報が漏洩\n\n# ✅ 対策 1: ホスト名 allowlist\nALLOWED_HOSTS = %w[example.com api.example.com]\nuri = URI(params[:url])\nraise 'Forbidden' unless ALLOWED_HOSTS.include?(uri.host)\n\n# ✅ 対策 2: 内部 IP の解決を block\nrequire 'resolv'\nrequire 'ipaddr'\n\nFORBIDDEN_RANGES = [\n  IPAddr.new('127.0.0.0/8'),\n  IPAddr.new('10.0.0.0/8'),\n  IPAddr.new('172.16.0.0/12'),\n  IPAddr.new('192.168.0.0/16'),\n  IPAddr.new('169.254.0.0/16'),         # link-local (AWS metadata)\n  IPAddr.new('::1/128'),\n  IPAddr.new('fc00::/7'),                # IPv6 ULA\n]\n\ndef safe_url?(url)\n  uri = URI(url)\n  return false unless %w[http https].include?(uri.scheme)\n  addrs = Resolv.getaddresses(uri.host)\n  addrs.any? && addrs.none? do |addr|\n    ip = IPAddr.new(addr)\n    FORBIDDEN_RANGES.any? { |r| r.include?(ip) }\n  end\nend\n\n# ✅ 対策 3: IMDSv2 を強制 (AWS の場合)\n# EC2 Instance Metadata Service v2 はトークン必須なので SSRF で叩きにくい\n\n# オープンリダイレクトも要注意\n# ❌ redirect_to params[:next]\n# 攻撃者が ?next=https://evil.com を仕込む → フィッシング助長\n# ✅ allowlist or 相対 URL のみ許可\nredirect_to(params[:next].start_with?('/') ? params[:next] : root_path)",
            language: "ruby",
            diagram: `sequenceDiagram
  participant Attacker as 攻撃者
  participant App as アプリサーバ<br/>(EC2 内部)
  participant Meta as 169.254.169.254<br/>(AWS metadata)

  Attacker->>App: POST /preview { url: "http://169.254.169.254/..." }
  Note over App: ❌ 検証なし<br/>fetch をそのまま実行
  App->>Meta: GET /latest/meta-data/iam/...
  Meta-->>App: IAM 認証情報
  App-->>Attacker: 認証情報が漏洩 🔥
  Note over App,Meta: ✅ 対策: ホスト allowlist + 内部 IP block + IMDSv2 強制`,
            diagramCaption: "SSRF: ユーザー入力 URL を検証せず fetch すると、サーバ内部からのみアクセス可能なリソースへ攻撃が伸びる",
            notes: [
              "AWS EC2 では IMDSv2 を強制すると SSRF からの metadata 流出が大幅に減る",
              "URL 経由の処理 (Webhook / OG 取得 / SSO redirect) は SSRF と Open Redirect の両方をレビュー",
            ],
          },
          {
            heading: "6.4 Sub-Resource Integrity (SRI) と 3rd party リソース",
            body: "CDN から CSS / JS を読み込む場合、**SRI (Sub-Resource Integrity)** で整合性ハッシュを指定するとファイル改ざんがブラウザ側で検出される。CDN の事故 (改ざん / 乗っ取り) でも自サイトに影響しない。",
            code: "<!-- SRI 付き script タグ -->\n<script\n  src=\"https://cdn.example.com/lib.min.js\"\n  integrity=\"sha384-oqVuAfXRKap7fdgcCY5uykM6+R9GqQ8K/uxy9rx7HNQlGYl1kPzQho1wx4JwY8wC\"\n  crossorigin=\"anonymous\"\n></script>\n\n<!-- ハッシュ生成 -->\n# shasum -b -a 384 lib.min.js | awk '{ print $1 }' | xxd -r -p | base64\n# → 'sha384-...' を integrity に貼り付け\n\n<!-- Rails の asset_pipeline で自動 SRI -->\n<!-- Sprockets / Webpacker の設定で integrity 属性が自動付与 -->\n\n<!-- 3rd party の取り扱い -->\n# - 自前ホスト推奨 (CDN を経由しない)\n# - CDN を使うなら SRI 必須\n# - GA / Stripe / Intercom など embed が変わるものは SRI を付けにくい → CSP で許可ホストを限定 (3 章)",
            language: "html",
            notes: [
              "SRI は『改ざん検出』 — CDN 乗っ取り / 攻撃者がアップロード等を検出",
              "CSP + SRI で『どこから読むか + 改ざんされていないか』の二段防御",
            ],
          },
        ],
        keyTakeaways: [
          "credentials.yml.enc + master.key (or RAILS_MASTER_KEY) で暗号化シークレット管理",
          "force_ssl + HSTS で HTTPS 強制、preload は staging で確認してから",
          "SSRF / Open Redirect は『URL allowlist + 内部 IP block』、IMDSv2 を強制",
          "CDN リソースは SRI + CSP で『どこから読むか × 改ざんされていないか』を両守り",
        ],
        comprehensionQuestionIds: ["sec-005", "sec-008"],
      },
      {
        id: "rate-limit-upload-deps",
        title: "7. レート制限・ファイルアップロード・依存監査",
        intro:
          "ブルートフォース対策 (rack-attack)、ファイルアップロードの 3 段検証、依存 gem の脆弱性監査 (bundle audit / Dependabot)、ログ漏洩防止 (filter_parameters) を整理。",
        readingMinutes: 9,
        objectives: [
          "rack-attack で IP / メールアドレス単位のレート制限を書ける",
          "ファイルアップロードの拡張子 / Content-Type / マジックバイトの 3 段検証を実装できる",
          "bundle audit / Dependabot で依存脆弱性を継続検知、filter_parameters でログ漏洩防止",
        ],
        sections: [
          {
            heading: "7.1 rack-attack — IP / アカウント単位のレート制限",
            body: "**rack-attack** は Rack ミドルウェアで動くレート制限 / ブロック / セーフリスト機能。ログイン試行 5 回/分、API 100 回/分、特定 IP 完全ブロックなどを宣言的に書ける。本番では Redis をストアにして複数プロセス間で共有。",
            code: "# Gemfile\ngem 'rack-attack'\n\n# config/application.rb\nconfig.middleware.use Rack::Attack\n\n# config/initializers/rack_attack.rb\nclass Rack::Attack\n  # ストアを Redis に (本番必須、複数プロセス間で共有)\n  cache.store = ActiveSupport::Cache::RedisCacheStore.new(url: ENV['REDIS_URL'])\n\n  # ログイン: IP 単位 5 回 / 分\n  throttle('logins/ip', limit: 5, period: 1.minute) do |req|\n    req.ip if req.path == '/login' && req.post?\n  end\n\n  # ログイン: メールアドレス単位 5 回 / 分 (IP 分散攻撃対策)\n  throttle('logins/email', limit: 5, period: 1.minute) do |req|\n    if req.path == '/login' && req.post?\n      req.params['email'].to_s.downcase.presence\n    end\n  end\n\n  # 一般 API: IP 単位 100 回 / 分\n  throttle('api/ip', limit: 100, period: 1.minute) do |req|\n    req.ip if req.path.start_with?('/api/')\n  end\n\n  # 完全ブロック (Bad Bot や攻撃元 IP)\n  blocklist('block bad bots') do |req|\n    req.user_agent =~ /BadBot|EvilCrawler/ || %w[1.2.3.4 5.6.7.8].include?(req.ip)\n  end\n\n  # 信頼できる IP は除外\n  safelist('allow office') do |req|\n    %w[203.0.113.0 198.51.100.0].include?(req.ip)\n  end\n\n  # 制限に引っかかった時のレスポンス\n  self.throttled_responder = lambda do |req|\n    [429, { 'Content-Type' => 'application/json' }, [{ error: 'Rate limit' }.to_json]]\n  end\n\n  # ログ (本番では監視ツールに送る)\n  ActiveSupport::Notifications.subscribe('rack.attack') do |_name, _start, _finish, _id, payload|\n    req = payload[:request]\n    Rails.logger.warn(\"[rack-attack] #{req.env['rack.attack.match_type']} #{req.ip} #{req.path}\")\n  end\nend\n\n# テスト\n# 5 回失敗 → 6 回目から 429\nfor i in {1..6}; do curl -X POST -d 'email=a@x&password=wrong' localhost:3000/login; done",
            language: "ruby",
            notes: [
              "メール単位の throttle は『パスワード総当たり』 vs 『複数 IP からの分散攻撃』両方に効く",
              "Cloudflare / AWS WAF など上流でもレート制限すると多層防御に",
            ],
          },
          {
            heading: "7.2 ファイルアップロード — 3 段検証 + 別ドメイン配信",
            body: "**拡張子だけのチェックは bypass される** (foo.jpg と名乗る .exe など)。**Content-Type ヘッダも偽装可能**。**マジックバイト (ファイル先頭の数バイト)** で実コンテンツを確認するのが安全。さらに **別ドメイン (S3 等) から配信**して XSS リスクを隔離。",
            code: "class Post < ApplicationRecord\n  has_one_attached :image\n\n  validate :image_size\n  validate :image_type\n  validate :image_filename\n\n  private\n\n  MAX_SIZE = 5.megabytes\n  ALLOWED_EXTS = %w[jpg jpeg png gif webp].freeze\n  ALLOWED_CONTENT_TYPES = %w[image/jpeg image/png image/gif image/webp].freeze\n\n  def image_size\n    return unless image.attached?\n    if image.blob.byte_size > MAX_SIZE\n      errors.add(:image, \"too large (max #{MAX_SIZE / 1.megabyte}MB)\")\n    end\n  end\n\n  def image_type\n    return unless image.attached?\n\n    # 1. Content-Type ヘッダ\n    unless ALLOWED_CONTENT_TYPES.include?(image.blob.content_type)\n      errors.add(:image, 'must be jpeg/png/gif/webp')\n      return\n    end\n\n    # 2. 拡張子\n    ext = image.filename.extension.downcase\n    unless ALLOWED_EXTS.include?(ext)\n      errors.add(:image, 'invalid extension')\n      return\n    end\n\n    # 3. マジックバイト (Marcel gem が ActiveStorage に同梱)\n    image.blob.open do |file|\n      detected = Marcel::MimeType.for(file)\n      unless ALLOWED_CONTENT_TYPES.include?(detected)\n        errors.add(:image, 'real content does not match')\n      end\n    end\n  end\n\n  def image_filename\n    return unless image.attached?\n    # ファイル名のパストラバーサル / 異常文字を除外\n    if image.filename.to_s =~ /\\A[\\w\\-. ]+\\z/\n      # ok\n    else\n      errors.add(:image, 'invalid filename')\n    end\n  end\nend\n\n# 別ドメイン配信 (S3 / CloudFront)\n# config/storage.yml\namazon:\n  service: S3\n  bucket: my-uploads\n  region: ap-northeast-1\n\n# config/environments/production.rb\nconfig.active_storage.service = :amazon\n\n# CDN ドメインを分けて XSS リスクを隔離\n# images.example.com から配信 → 仮に SVG に script を仕込まれてもメインドメインの cookie は使われない\n\n# 動的サイズ変換 (image_processing + libvips、ImageMagick よりはやめ + 安全)\n# Gemfile: gem 'image_processing'\n@post.image.variant(resize_to_limit: [800, 800]).processed",
            language: "ruby",
            notes: [
              "ImageMagick / libvips に脆弱性が見つかった事例多数 — バージョンを最新に + 入力サイズ制限",
              "SVG は <script> を含めるので XSS の温床 — 許可リストから外すか sanitize-svg を",
              "署名付き URL (S3 presigned) で直接アップロード → アプリサーバを経由しない構成も",
            ],
          },
          {
            heading: "7.3 依存監査 — bundle audit / Dependabot",
            body: "**bundle audit** (bundler-audit gem) は Ruby Advisory Database を参照して Gemfile.lock の既知脆弱性を検出する。CI に組み込みつつ、**Dependabot** (GitHub 標準) で『脆弱性のある gem の更新 PR を自動作成』するのが現代の鉄板。",
            code: "# Gemfile\ngroup :development, :test do\n  gem 'bundler-audit'\nend\n\n# 実行\nbundle exec bundle audit check --update\n# Updating ruby-advisory-db ...\n# Scanning ...\n# No vulnerabilities found\n\n# 出力例 (脆弱性検出時)\n# Name: nokogiri\n# Version: 1.13.0\n# Advisory: CVE-2022-29181\n# Criticality: High\n# URL: https://github.com/sparklemotion/nokogiri/security/advisories/...\n# Solution: upgrade to >= 1.13.8\n\n# CI 組み込み (.github/workflows/ci.yml)\nname: Security audit\non: [push, pull_request, schedule]\njobs:\n  audit:\n    runs-on: ubuntu-latest\n    steps:\n      - uses: actions/checkout@v4\n      - uses: ruby/setup-ruby@v1\n        with: { ruby-version: '3.3', bundler-cache: true }\n      - run: bundle exec bundle audit check --update\n\n# Dependabot 設定 (.github/dependabot.yml)\nversion: 2\nupdates:\n  - package-ecosystem: bundler\n    directory: '/'\n    schedule:\n      interval: weekly\n      day: monday\n    open-pull-requests-limit: 5\n    groups:\n      rails:\n        patterns: ['rails', 'action*', 'active*']\n  - package-ecosystem: npm\n    directory: '/'\n    schedule:\n      interval: weekly\n  - package-ecosystem: github-actions\n    directory: '/'\n    schedule:\n      interval: weekly\n\n# Brakeman — Rails 専用の静的解析 (SQL Injection / XSS / Mass Assignment などを検出)\ngem 'brakeman', group: [:development]\nbundle exec brakeman -A --no-pager\n\n# 他言語\n# npm audit / pnpm audit\n# pip-audit (Python)\n# cargo audit (Rust)\n# trivy / snyk (multi-language + コンテナ)",
            language: "ruby",
            notes: [
              "Dependabot で来た PR は CI 通れば原則 merge — 古い gem を放置すると Top 10 の A06 に",
              "Brakeman は CI に組み込み + Pull Request に SARIF 形式でレポート",
              "本番 image scan は Trivy / Snyk / Docker Scout などコンテナ層も",
            ],
          },
          {
            heading: "7.4 ログ漏洩防止 — filter_parameters と監査ログ",
            body: "Rails は `password` などの param をログから自動マスキング。**filter_parameters** にアプリ独自の機密 (`api_key`, `credit_card`, `ssn` 等) を追加する。**監査ログ** (誰が・いつ・何をしたか) は audited / paper_trail gem で別途残す。",
            code: "# config/initializers/filter_parameter_logging.rb\nRails.application.config.filter_parameters += [\n  :password, :password_confirmation,\n  :credit_card, :cvv, :ssn,\n  :api_key, :token, :secret,\n  :access_token, :refresh_token,\n  :otp, :pin,\n]\n\n# ログ例 (フィルタ適用後)\n# Parameters: {\"user\"=>{\"email\"=>\"a@x\", \"password\"=>\"[FILTERED]\"}}\n\n# リダイレクト先 URL の機密もマスク\nRails.application.config.filter_redirect += [\n  'oauth_token', 'access_token', 'authorization'\n]\n\n# Lograge / セミ構造化ログ (本番)\n# Gemfile\ngem 'lograge'\n\n# config/environments/production.rb\nconfig.lograge.enabled = true\nconfig.lograge.formatter = Lograge::Formatters::Json.new\nconfig.lograge.custom_options = ->(event) {\n  { time: Time.current.iso8601, request_id: event.payload[:request_id] }\n}\n\n# 監査ログ (audited gem)\nclass Post < ApplicationRecord\n  audited                                # 全変更を audits テーブルに記録\n  # audited only: [:title, :body]\nend\n\nPost.last.audits                          # 変更履歴 [{user, action, changes, created_at}, ...]\n\n# Sentry / Datadog / Honeybadger でエラー集約\n# config/initializers/sentry.rb\nSentry.init do |config|\n  config.dsn = Rails.application.credentials.sentry_dsn\n  config.send_default_pii = false         # PII を送らない\n  config.before_send = ->(event, hint) {\n    # 機密データを更にマスク\n    event\n  }\nend",
            language: "ruby",
            notes: [
              "ログには PII (Personally Identifiable Information) を入れない設計 — log aggregator に集める前にマスク",
              "監査ログは『誰が何をしたか』、調査 / 規制対応で必要 (GDPR / SOC2 等)",
              "Sentry / Datadog 等にも『個人情報を送らない』設定を必ず確認",
            ],
          },
        ],
        keyTakeaways: [
          "rack-attack で IP / メール / API パスのレート制限、本番は Redis ストアで共有",
          "ファイルアップロードは『拡張子 + Content-Type + マジックバイト』の 3 段検証 + 別ドメイン配信",
          "bundle audit + Dependabot + Brakeman を CI に組み込み、依存と静的解析を継続",
          "filter_parameters で機密ログ漏洩防止、監査ログは audited、エラー監視に PII を送らない",
        ],
        comprehensionQuestionIds: ["sec-011", "sec-012", "sec-013", "sec-015"],
      },
    ],
};
