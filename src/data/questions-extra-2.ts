import type { Question } from "@/lib/types";

/**
 * 拡充クイズ (第 2 弾):
 * - 弱トラックを 20 問まで底上げ (Git +4, Linux +4, InfoSec +5)
 * - 主要トラック +10 問 (TypeScript / React / Python の応用)
 *
 * 合計 +約 40 問 (43 問)
 */
export const extraQuestions2: Question[] = [
  // ===========================================================================
  // 🔧 Git 拡張 (git-017 〜 git-020)
  // ===========================================================================
  {
    id: "git-017",
    categoryId: "git-github",
    difficulty: "intermediate",
    type: "choice",
    question:
      "annotated tag と lightweight tag の主な違いは？",
    choices: [
      "annotated は遅い",
      "lightweight は削除できない",
      "両者は完全に同じ",
      "annotated はオブジェクト (タガー / 日付 / メッセージ / 署名可) を持つ、lightweight は単なるブランチ風参照",
    ],
    answerIndex: 3,
    hints: [
      "リリースバージョンには annotated を使うのが慣習。",
      "git tag -a で annotated、git tag (フラグなし) で lightweight。",
      "GPG / SSH 署名は annotated にだけ付けられる。",
    ],
    explanation: {
      summary:
        "annotated tag は完全な Git オブジェクト (tagger / date / message / 署名)、lightweight は単なる commit への名前付き参照。リリース用は annotated 推奨。",
      reason:
        "annotated tag は `git show v1.0` でタガー情報・メッセージが見える + GPG/SSH 署名で改ざん検知。lightweight tag はブランチに近く、CI でリリース判定するときに『誰がいつ打ったか』を残しにくい。`git push --tags` で全部リモートに送る、`--follow-tags` で push する commit に紐づくものだけ。",
      codeExample:
        "# annotated (リリース推奨)\ngit tag -a v1.0.0 -m 'Release v1.0.0'\ngit tag -a v1.0.0 -m 'Release' abc1234   # 過去 commit に\ngit tag -s v1.0.0 -m '...'                # 署名付き (GPG)\n\n# lightweight (一時的なマーカー向け)\ngit tag tmp\n\n# 確認\ngit tag                                   # 一覧\ngit show v1.0.0                            # 詳細\ngit tag -d v1.0.0                          # ローカル削除\ngit push origin --delete v1.0.0           # リモート削除\n\n# push\ngit push origin v1.0.0                    # 単一\ngit push origin --tags                    # 全タグ\ngit push --follow-tags                    # commit に紐づく annotated だけ",
    },
  },
  {
    id: "git-018",
    categoryId: "git-github",
    difficulty: "advanced",
    type: "choice",
    question:
      "Git submodule の代わりに、より単純で衝突しにくい代替手段は？",
    choices: [
      "git stash",
      "git subtree (歴史も丸ごと取り込む) / 単なるパッケージマネージャ (npm / gem) で管理",
      "submodule 以外は存在しない",
      "git worktree",
    ],
    answerIndex: 1,
    hints: [
      "submodule は別 commit を指すポインタで、初心者が壊しがち。",
      "subtree は対象リポジトリの履歴を統合して『単一リポジトリ』のように扱える。",
      "現代は monorepo + npm/yarn workspaces や、package manager で代用が主流。",
    ],
    explanation: {
      summary:
        "submodule は『別リポジトリへの参照』だが、`git submodule update` を忘れがちでチーム運用が難しい。代替は `git subtree`、または npm/gem などのパッケージマネージャ。最近は monorepo + workspaces。",
      reason:
        "submodule の罠: clone 後に `--recursive` 忘れで空ディレクトリ、`git status` で参照 SHA がずれて意図しない commit が混入、CI で submodule の credential 設定が必要。subtree は履歴も統合 (リポジトリサイズは増えるが運用は単純)。pnpm workspaces / Turborepo / Nx でモノレポにして社内パッケージを参照する方が現代の主流。",
      codeExample:
        "# submodule (避けられるなら避ける)\ngit submodule add https://github.com/example/lib.git vendor/lib\ngit clone --recursive ...                  # 子も clone\ngit submodule update --init --recursive    # 既存リポジトリで初期化\n\n# subtree (より単純)\ngit subtree add --prefix=vendor/lib \\\n  https://github.com/example/lib.git main --squash\ngit subtree pull --prefix=vendor/lib \\\n  https://github.com/example/lib.git main --squash\n\n# Monorepo (推奨)\n# pnpm-workspace.yaml\npackages:\n  - 'packages/*'\n  - 'apps/*'\n# → 社内パッケージは workspace:* で参照、外部は npm install",
    },
  },
  {
    id: "git-019",
    categoryId: "git-github",
    difficulty: "advanced",
    type: "text",
    question:
      "Git の『一度解決したコンフリクトを次回自動で再適用する』機能は `git ?????`。????? に入る 6 文字の英単語は？",
    answers: ["rerere"],
    hints: [
      "Reuse Recorded Resolution の略。",
      "デフォルトでは無効、git config rerere.enabled true で有効化。",
      "rebase / merge を繰り返す長期 PR で威力を発揮。",
    ],
    explanation: {
      summary:
        "`rerere` (Reuse Recorded Resolution) は『一度解決したコンフリクトを記録 → 同じ conflict が再発時に自動再適用』する Git の隠れた機能。長期 feature ブランチの rebase で繰り返し同じ conflict を解くことを避ける。",
      reason:
        "有効化: `git config --global rerere.enabled true`。動作: merge 中に conflict 解決 → `.git/rr-cache/` に記録。再度同じ conflict が発生すると自動的に解決を適用 (`Resolved 'file.rb' using previous resolution`)。手動で確認は推奨 (誤適用防止)。複数人で長期 PR を扱うチームに特に有用。",
      codeExample:
        "# 有効化\ngit config --global rerere.enabled true\n\n# (1) conflict 発生 → 解決 → add → continue (記録される)\ngit rebase main\n# CONFLICT in app/models/user.rb\nvim app/models/user.rb                   # 解決\ngit add app/models/user.rb\ngit rebase --continue\n\n# (2) 後日、同じ conflict が再発した時\ngit rebase main\n# Resolved 'app/models/user.rb' using previous resolution\n# → 自動で解決が再適用される\n\n# 確認系\ngit rerere status                         # 記録中の conflict\ngit rerere diff                           # 解決内容の diff\ngit rerere forget app/models/user.rb     # 記録を消す",
    },
  },
  {
    id: "git-020",
    categoryId: "git-github",
    difficulty: "intermediate",
    type: "choice",
    question:
      "Git の commit / push 時に lint やテストを自動実行する標準的な仕組みは？",
    choices: [
      "package.json の scripts",
      ".git/hooks/* のスクリプト (or husky / lefthook / pre-commit 等のラッパー)",
      ".github/workflows のみ",
      "rake task",
    ],
    answerIndex: 1,
    hints: [
      "ローカルでサーバ側 CI を待たずに弾くための仕組み。",
      "pre-commit / pre-push / commit-msg などの hook を実行スクリプトとして書く。",
      "現代は husky / lefthook で `.husky/pre-commit` ファイルを git 管理。",
    ],
    explanation: {
      summary:
        "Git は `.git/hooks/` 配下のスクリプトを各操作前に実行する (pre-commit / pre-push / commit-msg ...)。`.git/` は共有されないので、husky / lefthook / pre-commit (Python) が git 管理可能なラッパーを提供。",
      reason:
        "pre-commit hook で lint + format + test を実行 → 失敗で commit を止める。CI を待たずローカルで弾けるので開発体験 ◎。husky は package.json と統合、lefthook は YAML 設定で多言語 OK、pre-commit (Python) は polyglot 対応。`--no-verify` でスキップ可だが、通常は禁止する。",
      codeExample:
        "# husky (Node.js)\nnpm install -D husky\nnpx husky init                            # .husky/ を作成\n\n# .husky/pre-commit\nnpm run lint && npm test\n\n# .husky/commit-msg\nnpx commitlint --edit $1                  # Conventional Commits 強制\n\n# lefthook (Ruby/Node/Go など多言語)\n# lefthook.yml\npre-commit:\n  parallel: true\n  commands:\n    rubocop:\n      glob: '*.{rb}'\n      run: bundle exec rubocop {staged_files}\n    rspec:\n      glob: '*.{rb}'\n      run: bundle exec rspec\n    eslint:\n      glob: '*.{js,ts,tsx}'\n      run: npx eslint {staged_files}\n\n# 直接 .git/hooks/pre-commit (古典)\n#!/bin/bash\nbundle exec rubocop --force-exclusion $(git diff --cached --name-only --diff-filter=ACM | grep '\\.rb$') || exit 1",
    },
  },

  // ===========================================================================
  // 🐧 Linux 拡張 (cli-017 〜 cli-020)
  // ===========================================================================
  {
    id: "cli-017",
    categoryId: "linux-cli",
    difficulty: "intermediate",
    type: "choice",
    question:
      "JSON を CLI で整形・抽出する標準ツールは？",
    choices: [
      "sed -j",
      "grep -j",
      "jq (JSON 専用) / yq (YAML/JSON 両対応)",
      "json-cli",
    ],
    answerIndex: 2,
    hints: [
      "API レスポンスの整形・フィルタに必須。",
      "`.[]` で配列展開、`.field` でフィールドアクセス。",
      "yq は jq 風の構文で YAML も扱える (Kubernetes YAML 編集で多用)。",
    ],
    explanation: {
      summary:
        "`jq` は JSON のクエリ + 整形ツール (CLI 版 SQL/XPath)。`.field`、`.[]`、`map / select / group_by` などの DSL を持つ。`yq` は同構文で YAML 対応。",
      reason:
        "curl の出力をパイプで `jq` に渡すのが API デバッグの定番。`-r` (raw) で文字列の quote を外し、シェルスクリプトに値を渡せる。`group_by` / `reduce` / `sort_by` で集計も。Kubernetes YAML 編集には yq が便利。",
      codeExample:
        "# 整形表示\ncurl -s https://api.example.com/users | jq\n\n# フィールド抽出\ncurl -s https://api.example.com/users | jq '.[].email'\ncurl -s https://api.example.com/users | jq -r '.[].email'   # quote なし\n\n# フィルタ\njq '.[] | select(.active == true)' users.json\n\n# 変換\njq '[.[] | {id, name, email}]' users.json    # 配列を再構築\n\n# 集計\njq 'map(.age) | add / length' users.json     # 平均年齢\njq 'group_by(.role) | map({role: .[0].role, count: length})' users.json\n\n# yq (YAML)\nyq '.metadata.name' deployment.yaml\nyq -i '.spec.replicas = 3' deployment.yaml   # in-place 編集\n\n# JSON Lines\ncat events.jsonl | jq -s 'group_by(.user_id) | map({user_id: .[0].user_id, count: length})'",
    },
  },
  {
    id: "cli-018",
    categoryId: "linux-cli",
    difficulty: "intermediate",
    type: "choice",
    question:
      "rsync で『削除も同期する』(送信元に無いファイルを送信先からも消す) オプションは？",
    choices: [
      "--mirror",
      "--delete",
      "--remove",
      "--sync-all",
    ],
    answerIndex: 1,
    hints: [
      "デフォルトでは送信元の追加・変更のみ反映、削除は反映されない。",
      "完全ミラー化したい時に使う (危険、要 --dry-run)。",
      "--delete-after / --delete-before でタイミング指定可。",
    ],
    explanation: {
      summary:
        "`rsync -avz --delete src/ dst/` で完全ミラー (src に無い dst のファイルを削除)。事故防止のため必ず `--dry-run` で先に確認。",
      reason:
        "デフォルト動作: 追加 / 変更のみ反映、削除は無視 → 不要ファイルが dst に残り続ける。`--delete` で『src を唯一の真実』として完全ミラー。注意: src を間違えると dst の全データが消える事故 → `--dry-run` 必須。安全策: `--delete-excluded` で除外したものも消す、`--max-delete=N` で N 個以上削除なら abort。",
      codeExample:
        "# 完全ミラー (危険、要確認)\nrsync -avz --delete --dry-run src/ user@host:/var/www/myapp/   # まずシミュレーション\nrsync -avz --delete src/ user@host:/var/www/myapp/             # 本実行\n\n# 安全装置\nrsync -avz --delete --max-delete=10 src/ host:/path/           # 10 個超なら abort\nrsync -avz --delete --exclude='.git' --exclude='node_modules' src/ host:/path/\n\n# 重要オプション\n-a       archive (recursive + perm + symlink + timestamp 等保存)\n-v       verbose\n-z       compression (転送時)\n-n       --dry-run と同じ\n--info=progress2                          # 進捗バー\n--bwlimit=10M                              # 帯域制限\n--delete-after                             # 転送完了後に削除\n--delete-before                            # 転送前に削除\n--checksum                                 # サイズ + mtime ではなく checksum 比較 (遅いが正確)",
    },
  },
  {
    id: "cli-019",
    categoryId: "linux-cli",
    difficulty: "advanced",
    type: "choice",
    question:
      "シェルスクリプトで『未定義変数を参照したらエラー』『パイプの途中で失敗したら停止』を有効化する慣用句は？",
    choices: [
      "set -euo pipefail",
      "set -strict",
      "set -i",
      "set -fail",
    ],
    answerIndex: 0,
    hints: [
      "-e: コマンド失敗で abort。",
      "-u: 未定義変数の参照で abort。",
      "-o pipefail: パイプの途中の失敗を捕捉。",
    ],
    explanation: {
      summary:
        "`set -euo pipefail` で『失敗で abort + 未定義変数禁止 + パイプ途中の失敗を捕捉』を有効化。すべての本番シェルスクリプト冒頭に置くのが慣習。",
      reason:
        "デフォルト bash は失敗を黙って続行する危険な挙動。例: `cd /nonexistent; rm -rf *` で `/` が消える事故が起きる。`set -e` で cd 失敗時に abort。`set -u` で typo した変数名を即座に検出。`-o pipefail` は `cmd1 | cmd2` の cmd1 失敗を捕捉 (デフォルトは cmd2 の終了コードだけ見る)。`IFS=$'\\n\\t'` も合わせて単語分割の罠を防げる。",
      codeExample:
        "#!/usr/bin/env bash\nset -euo pipefail\nIFS=$'\\n\\t'\n\n# -e: コマンド失敗で abort\ncd /var/www/myapp    # ここで失敗したら全部停止\n\n# -u: 未定義変数禁止\necho \"$USER_NAME\"    # USER_NAME が未定義なら error\necho \"${USER_NAME:-default}\"  # デフォルト値で回避可\n\n# -o pipefail\ncurl https://example.com | jq '.foo'\n# curl が失敗しても、デフォルトでは exit code は jq の (0)\n# pipefail が ON だと curl の exit code が伝わる\n\n# 一時的に解除\nset +e\ncommand_that_might_fail\nresult=$?\nset -e\n\n# 関数のエラーハンドル\ntrap 'echo \"Error at line $LINENO\"; exit 1' ERR",
    },
  },
  {
    id: "cli-020",
    categoryId: "linux-cli",
    difficulty: "advanced",
    type: "choice",
    question:
      "bash の `[ ... ]` (test) と `[[ ... ]]` (拡張テスト) の違いは？",
    choices: [
      "[ ] は廃止",
      "[[ ]] は数値専用",
      "[[ ]] は bash 拡張で正規表現 (=~) / && || 直接使用 / 文字列分割なし。POSIX 互換が必要なら [ ]",
      "両者は完全に同じ",
    ],
    answerIndex: 2,
    hints: [
      "[[ ]] は bash / zsh の拡張、POSIX (sh / dash) では使えない。",
      "[[ ]] は変数のクォートなしで安全、正規表現も。",
      "[ ] は POSIX 互換、可搬性が必要な時に。",
    ],
    explanation: {
      summary:
        "`[ ... ]` (`test` コマンド) は POSIX 互換、`[[ ... ]]` は bash/zsh の拡張で正規表現・論理演算子・変数の分割回避が強力。bash スクリプトでは `[[ ]]` 推奨。",
      reason:
        "`[ ]` は単なるコマンド (test) なので、`[ $var = 'x' ]` で var が空だと `[  = 'x' ]` になりエラー。`[[ ]]` は構文なので変数の安全な扱い。正規表現 `[[ $s =~ ^[0-9]+$ ]]`、ファイル比較 `[[ a -nt b ]]` (newer than) なども。POSIX 互換 (Alpine / dash) なら `[ ]` を使う。",
      codeExample:
        "# [[ ]] (bash / zsh、推奨)\nif [[ $name == 'Alice' ]]; then ... fi\nif [[ -z $var ]]; then echo empty; fi\nif [[ -f file.txt ]]; then echo exists; fi\nif [[ $var =~ ^[0-9]+$ ]]; then echo number; fi   # 正規表現\nif [[ $a -lt 5 && $b -gt 10 ]]; then ... fi       # 論理演算\nif [[ -f a && -f b ]]; then ... fi\n\n# [ ] (POSIX、可搬性)\nif [ \"$name\" = 'Alice' ]; then ... fi             # クォート必須\nif [ -z \"$var\" ]; then ... fi\nif [ -f a ] && [ -f b ]; then ... fi               # && は外で\n\n# 主要オプション\n-z str     文字列が空\n-n str     文字列が非空\n=  / !=    文字列比較\n-eq -ne -lt -le -gt -ge   数値比較\n-f -d -e -r -w -x -L      ファイル系\n-a / -o    AND / OR (古典、避ける)\n[[ ]] では && / || / ! を直接",
    },
  },

  // ===========================================================================
  // 🛡️ InfoSec 拡張 (sec-016 〜 sec-020)
  // ===========================================================================
  {
    id: "sec-016",
    categoryId: "security",
    difficulty: "advanced",
    type: "choice",
    question:
      "HSTS preload list に登録すると何が起きる？",
    choices: [
      "SEO が上がる",
      "登録すぐ解除できる",
      "ブラウザに最初から HTTPS のみで接続させる (初回 HTTP リクエストの隙を排除)、ただし登録解除に数年かかる",
      "PageSpeed が上がる",
    ],
    answerIndex: 2,
    hints: [
      "通常の HSTS は『一度 HTTPS で訪問後』に効く。",
      "preload list はブラウザに同梱されるので、初回アクセスから強制。",
      "登録は https://hstspreload.org/ で申請、解除は数ヶ月〜年単位。",
    ],
    explanation: {
      summary:
        "HSTS preload list はブラウザ (Chrome / Firefox / Safari 等) に組み込まれるドメインリスト。登録ドメインは初回アクセスから HTTPS 強制。一度登録すると解除が困難 (数年単位) なので staging で十分テストしてから。",
      reason:
        "通常 HSTS: 1 回 HTTPS で訪問 → 以降 HTTPS 強制。preload: ブラウザ起動時に既知 → 最初から強制。Sub Domain も含むので、登録後に旧サブドメインの HTTP のみサービスがあると停止する。条件: includeSubDomains + preload directive + max-age >= 31536000 (1 年)。証明書の更新失敗 / サブドメイン追加で死ぬ前に検証 + Removal フォームから何ヶ月もかかる。",
      codeExample:
        "# config/environments/production.rb\nconfig.force_ssl = true\nconfig.ssl_options = {\n  hsts: {\n    expires: 1.year,\n    subdomains: true,\n    preload: true                      # ← preload 対象\n  }\n}\n\n# レスポンスヘッダ\nStrict-Transport-Security: max-age=31536000; includeSubDomains; preload\n\n# 段階導入\n# 1. max-age=300 (5 分) で開始、preload なし\n# 2. max-age=86400 (1 日)、includeSubDomains 追加\n# 3. max-age=31536000 (1 年)、サブドメインも全部 HTTPS 確認\n# 4. preload directive 追加、本当に確信あるなら hstspreload.org で申請\n\n# 関連: SameSite Strict vs Lax\nset-cookie: session=...; Secure; HttpOnly; SameSite=Strict\n# Strict: 全クロスサイト遷移で送らない (外部サイトからのリンクで session 切れ)\n# Lax (推奨デフォルト): top-level GET だけ送る\n# None (要 Secure): 制限なし",
    },
  },
  {
    id: "sec-017",
    categoryId: "security",
    difficulty: "advanced",
    type: "choice",
    question:
      "パスワードハッシュアルゴリズムとして現代の OWASP 推奨は？",
    choices: [
      "MD5",
      "SHA-256",
      "Base64",
      "Argon2 (id) — 2015 PHC 優勝者、メモリハードで GPU 攻撃に強い。次点が bcrypt / scrypt",
    ],
    answerIndex: 3,
    hints: [
      "GPU で総当たりに強い = メモリハード (時間 + メモリの両方を要求)。",
      "Argon2id は時間 / メモリ / 並列度の 3 パラメータ。",
      "bcrypt は依然 widely deployed、Argon2 は新規プロジェクトに推奨。",
    ],
    explanation: {
      summary:
        "OWASP 2024 推奨: **Argon2id** (1 番)、bcrypt (2 番、cost 12+)、scrypt、PBKDF2 (FIPS 必要な時)。MD5/SHA1/SHA256 単発は絶対 NG (速すぎる)。",
      reason:
        "Argon2 は Password Hashing Competition (2013-2015) の優勝アルゴリズム。`id` 系統が現代推奨 (`i` (耐サイドチャネル) と `d` (耐 GPU) の混合)。パラメータ: timeCost (反復回数)、memoryCost (KB)、parallelism。bcrypt は cost factor のみで GPU 対策が弱い。Ruby は `argon2` gem、Node は `argon2` パッケージ、Python は `argon2-cffi`。`pwned-passwords` gem で漏洩済みパスワードのチェックも併用。",
      codeExample:
        "# Ruby (argon2 gem)\ngem 'argon2'\n\nrequire 'argon2'\nhasher = Argon2::Password.new(t_cost: 2, m_cost: 16, p_cost: 1)\nhash = hasher.create('user_password')\n# $argon2id$v=19$m=65536,t=2,p=1$...\n\nArgon2::Password.verify_password('user_password', hash)   # true / false\n\n# Node.js\nimport argon2 from 'argon2'\nconst hash = await argon2.hash(password, { type: argon2.argon2id })\nconst valid = await argon2.verify(hash, password)\n\n# bcrypt (依然 widely OK)\nrequire 'bcrypt'\nhash = BCrypt::Password.create('user_password', cost: 12)\nBCrypt::Password.new(hash) == 'user_password'\n\n# 漏洩済みパスワード除外 (haveibeenpwned API)\ngem 'pwned'\nuser.password.pwned?      # true なら登録拒否\n\n# OWASP のパラメータ目安\n# Argon2id: m=19MB, t=2, p=1  ~ サーバ性能で調整\n# bcrypt: cost 12 が現在の最低ライン",
    },
  },
  {
    id: "sec-018",
    categoryId: "security",
    difficulty: "advanced",
    type: "choice",
    question:
      "パスワードを使わない次世代認証として近年急速に普及している標準は？",
    choices: [
      "Passkeys (WebAuthn / FIDO2) — 端末の TouchID / FaceID / セキュリティキーで認証",
      "OAuth 1.0a",
      "OpenID 1.0",
      "Kerberos",
    ],
    answerIndex: 0,
    hints: [
      "WebAuthn は W3C 標準、FIDO2 は仕様セット。",
      "鍵ペアで認証 (秘密鍵は端末、サーバには公開鍵)。",
      "Apple / Google / Microsoft のアカウントも対応、フィッシング不可能。",
    ],
    explanation: {
      summary:
        "**Passkeys** (WebAuthn / FIDO2) はパスワードを使わない公開鍵認証。端末の Secure Enclave / TPM に秘密鍵、サーバには公開鍵を保存。指紋 / Face / PIN で認証 → 端末から秘密鍵で署名。フィッシング不可能 (オリジン拘束)。",
      reason:
        "技術: ブラウザの `navigator.credentials.create({ publicKey: ... })` で鍵生成。Cross-device: iCloud Keychain / Google Password Manager で端末間同期 (Apple/Google/Microsoft が標準対応)。実装ライブラリ: `webauthn-ruby` (Ruby)、`@simplewebauthn/server` (Node)、`fido2` (Python)。User Verification (UV) で 2 要素相当 (端末所持 + 生体)。MFA 不要・パスワード不要・フィッシング不可能の三重メリット。",
      codeExample:
        "# Rails (webauthn-ruby)\ngem 'webauthn'\n\nWebAuthn.configure do |config|\n  config.origin = 'https://example.com'\n  config.rp_name = 'Example'\nend\n\n# 登録 (Registration)\noptions = WebAuthn::Credential.options_for_create(\n  user: { id: user.webauthn_id, name: user.email }\n)\nsession[:current_registration] = { challenge: options.challenge }\n# → クライアントに送って navigator.credentials.create()\n\n# 認証 (Authentication)\noptions = WebAuthn::Credential.options_for_get(\n  allow: user.credentials.pluck(:webauthn_id)\n)\nsession[:current_authentication] = { challenge: options.challenge }\n\n# Client (Browser)\nconst credential = await navigator.credentials.get({\n  publicKey: { challenge: ..., allowCredentials: ... }\n})\n// 端末が UV (TouchID 等) を求め、署名を返す\n\n# 検証\nwebauthn_credential = WebAuthn::Credential.from_get(params)\nwebauthn_credential.verify(\n  session[:current_authentication]['challenge'],\n  public_key: user_credential.public_key,\n  sign_count: user_credential.sign_count\n)",
    },
  },
  {
    id: "sec-019",
    categoryId: "security",
    difficulty: "intermediate",
    type: "choice",
    question:
      "CDN から JS/CSS を読み込む際に『改ざんされていないこと』をブラウザが検証する仕組みは？",
    choices: [
      "X-Content-Type-Options",
      "Subresource Integrity (SRI) — integrity 属性に SHA-384 ハッシュを指定",
      "CORS",
      "HPKP (廃止)",
    ],
    answerIndex: 1,
    hints: [
      "<script integrity='sha384-...' src='https://cdn.example.com/lib.js'> の形式。",
      "CDN のファイルが改ざんされたらブラウザが実行を拒否。",
      "CSP と組み合わせると『どこから読むか × 改ざんされていないか』の二段防御。",
    ],
    explanation: {
      summary:
        "**SRI (Subresource Integrity)** は `<script integrity='sha384-...'>` で読み込み先のハッシュを宣言。CDN 改ざん / 乗っ取り時にブラウザが検出 → 実行拒否。CSP と組み合わせて二段防御。",
      reason:
        "ハッシュ生成: `openssl dgst -sha384 -binary lib.min.js | openssl base64 -A`。`crossorigin='anonymous'` も必須 (CORS で credentials を送らない宣言)。3rd party SDK で SRI が貼れないケースは『ファイルが変わる前提』のもの → 自前ホスト or CSP で許可ホスト固定が代替。Webpack / Vite では plugin で自動生成可能。",
      codeExample:
        "<!-- SRI 付き script タグ -->\n<script\n  src=\"https://cdn.jsdelivr.net/npm/library@1.2.3/dist/lib.min.js\"\n  integrity=\"sha384-oqVuAfXRKap7fdgcCY5uykM6+R9GqQ8K/uxy9rx7HNQlGYl1kPzQho1wx4JwY8wC\"\n  crossorigin=\"anonymous\"\n></script>\n\n<!-- ハッシュ生成 -->\n# Bash\nopenssl dgst -sha384 -binary lib.min.js | openssl base64 -A\n# → sha384-... を integrity に貼る\n\n# Node\nimport crypto from 'crypto'\nconst hash = crypto.createHash('sha384').update(file).digest('base64')\nconsole.log(`sha384-${hash}`)\n\n<!-- 複数ハッシュも書ける (バージョンアップ移行期) -->\n<script integrity=\"sha384-OLD sha384-NEW\" ...>\n\n<!-- Rails の asset_pipeline で自動 SRI -->\n# Sprockets / Webpacker の設定で integrity 属性が自動付与\n\n<!-- Vite の vite-plugin-sri -->\nimport sri from 'vite-plugin-sri'\nexport default { plugins: [sri()] }\n\n<!-- CSP + SRI = 二段防御 -->\nContent-Security-Policy:\n  script-src 'self' https://cdn.jsdelivr.net 'sha384-...'\n  require-sri-for script;",
    },
  },
  {
    id: "sec-020",
    categoryId: "security",
    difficulty: "intermediate",
    type: "choice",
    question:
      "次のコードに含まれる脆弱性は？",
    code: "def login\n  user = User.find_by(email: params[:email])\n  if user&.authenticate(params[:password])\n    session[:user_id] = user.id\n    redirect_to params[:next] || dashboard_path\n  end\nend",
    choices: [
      "SQL Injection",
      "XSS",
      "CSRF",
      "Open Redirect — params[:next] を検証なしで redirect_to に渡している (外部ドメインへ誘導可能)",
    ],
    answerIndex: 3,
    hints: [
      "params[:next] が 'https://evil.com' でも redirect_to が実行される。",
      "フィッシング助長 (ログイン成功 → 攻撃者サイトへ誘導)。",
      "allowlist か '/' 始まり (相対 URL) のみ許可で防ぐ。",
    ],
    explanation: {
      summary:
        "Open Redirect: ユーザー指定 URL を検証なしでリダイレクトするとフィッシング助長。allowlist or 相対 URL のみ許可で防ぐ。",
      reason:
        "攻撃シナリオ: `https://example.com/login?next=https://evil.com/fake-login`。被害者は信頼するドメインからアクセス → 成功後に attacker サイトへ → 偽ログイン画面で credential 再入力させられる。OWASP A10 (2017) として独立カテゴリだった。対策: 相対 URL (`/` 始まり) のみ、host が同じかチェック、または signed redirect token。",
      codeExample:
        "# ❌ 危険 (Open Redirect)\nredirect_to params[:next] || dashboard_path\n\n# ✅ 対策 1: 相対 URL のみ\nnext_path = params[:next]\nif next_path.is_a?(String) && next_path.start_with?('/') && !next_path.start_with?('//')\n  redirect_to next_path\nelse\n  redirect_to dashboard_path\nend\n\n# ✅ 対策 2: allowlist\nALLOWED_NEXT_PATHS = ['/', '/dashboard', '/settings', '/posts']\nredirect_to ALLOWED_NEXT_PATHS.include?(params[:next]) ? params[:next] : dashboard_path\n\n# ✅ 対策 3: 同ホストチェック\nrequire 'uri'\nuri = URI.parse(params[:next].to_s)\nif uri.host.nil? || uri.host == request.host\n  redirect_to params[:next]\nelse\n  redirect_to dashboard_path\nend\n\n# ✅ Rails 7+ — redirect_to の allow_other_host: false (デフォルト)\nredirect_to params[:next]                # 外部 host だと例外\nredirect_to params[:next], allow_other_host: true   # 明示的に許可\n\n# 関連: Reverse Tabnabbing (window.opener)\n<a href=\"https://example.com\" target=\"_blank\" rel=\"noopener noreferrer\">\n# rel=\"noopener\" で window.opener アクセスを防ぐ",
    },
  },

  // ===========================================================================
  // 🔷 TypeScript 拡張 (ts-021 〜 ts-030)
  // ===========================================================================
  {
    id: "ts-021",
    categoryId: "ts-basics",
    difficulty: "advanced",
    type: "choice",
    question:
      "TS 4.9+ で導入された『型は維持しつつ、その値が型に合致するかチェック』する演算子は？",
    choices: ["matches", "is", "ensures", "satisfies"],
    answerIndex: 3,
    hints: [
      "`as Color` だと『強制キャスト』、`satisfies Color` は『チェックのみで型保持』。",
      "リテラル型の絞り込みが効くのが大きな利点。",
      "Record<string, ...> の値の型を保ちつつ全キーをチェックするのに便利。",
    ],
    explanation: {
      summary:
        "`x satisfies T` は『x が T に合致するか検証 + 元の型 (狭い literal type) を維持』。`as T` は強制キャストで型を広げてしまうが、satisfies は推論を保つ。",
      reason:
        "典型例: `const colors = { red: '#f00', blue: '#00f' } satisfies Record<string, string>` で、colors.red の型は具体的な `'#f00'` のまま (`as` だと `string` に劣化)。設定オブジェクト / API レスポンスマッピング / Tailwind config などで頻出。TS 4.9+ で公式採用。",
      codeExample:
        "// ❌ as Cast (literal 型が失われる)\ntype Color = 'red' | 'green' | 'blue'\ntype Palette = Record<Color, string>\n\nconst palette = {\n  red: '#ff0000',\n  green: '#00ff00',\n  blue: '#0000ff',\n} as Palette\n\n// palette.red の型: string (具体値が失われた)\n\n// ✅ satisfies (literal 型を保ちつつ検証)\nconst palette = {\n  red: '#ff0000',\n  green: '#00ff00',\n  blue: '#0000ff',\n} satisfies Palette\n\n// palette.red の型: '#ff0000' (literal が保たれる)\n// 全 Color キーが揃っているか自動チェック\n\n// 全キーチェックの強力さ\nconst icons = {\n  user: 'user.svg',\n  post: 'post.svg',\n  // tag: ...                          // ❌ 抜けがあれば error\n} satisfies Record<'user' | 'post' | 'tag', string>\n\n// メソッドの戻り値型保持\nconst config = {\n  port: 3000,\n  host: 'localhost',\n  log: (msg: string) => console.log(msg),\n} satisfies { port: number; host: string; log: Function }\n// config.port は 3000 (literal)、log の引数型も保持",
    },
  },
  {
    id: "ts-022",
    categoryId: "ts-basics",
    difficulty: "advanced",
    type: "choice",
    question:
      "TS で『配列の最後の要素の型を取り出す』高度な型操作は？",
    choices: [
      "Last<T>",
      "T.tail",
      "T extends [...any, infer Last] ? Last : never",
      "T[T.length - 1]",
    ],
    answerIndex: 2,
    hints: [
      "Variadic Tuple Types (TS 4.0+) と Conditional Type + infer の組合せ。",
      "`...any` で『何個でも前』、`infer Last` で最後を捕捉。",
      "型レベルでの再帰や配列操作の基礎パターン。",
    ],
    explanation: {
      summary:
        "Variadic Tuple Types `[...any, infer Last]` で配列の最後を抽出。同様に First は `[infer F, ...any]`、Init は `[...infer R, any]`、Tail は `[any, ...infer R]`。",
      reason:
        "型レベルプログラミングの基本ツール。`Parameters<F>` の最後の引数を取る、Curry 化、Tuple の操作などで多用。再帰と組み合わせると Object のキー paths を全列挙したり、snake_case → camelCase 変換のような高度な型変換も実装可能。",
      codeExample:
        "// 配列の Head / Tail / Last / Init\ntype Head<T extends any[]> = T extends [infer H, ...any] ? H : never\ntype Tail<T extends any[]> = T extends [any, ...infer R] ? R : never\ntype Last<T extends any[]> = T extends [...any, infer L] ? L : never\ntype Init<T extends any[]> = T extends [...infer I, any] ? I : never\n\ntype X = Head<[1, 2, 3]>      // 1\ntype Y = Last<[1, 2, 3]>      // 3\ntype Z = Tail<[1, 2, 3]>      // [2, 3]\n\n// Length\ntype Length<T extends any[]> = T['length']\ntype L = Length<[1, 2, 3, 4]>  // 4\n\n// Reverse (再帰)\ntype Reverse<T extends any[]> = T extends [infer H, ...infer R]\n  ? [...Reverse<R>, H]\n  : []\ntype R = Reverse<[1, 2, 3]>    // [3, 2, 1]\n\n// Concat\ntype Concat<A extends any[], B extends any[]> = [...A, ...B]\ntype C = Concat<[1, 2], [3, 4]>  // [1, 2, 3, 4]\n\n// 実用: 関数の最後の引数を取る (callback 等)\ntype LastParam<F> = F extends (...args: infer A) => any\n  ? Last<A>\n  : never\ntype LP = LastParam<(a: string, b: number, cb: () => void) => void>\n// → () => void",
    },
  },
  {
    id: "ts-023",
    categoryId: "ts-basics",
    difficulty: "intermediate",
    type: "choice",
    question:
      "次の `as const` の効果として正しいのは？",
    code: "const config = { host: 'localhost', port: 3000 } as const",
    choices: [
      "全プロパティが readonly + literal 型に固定 (host: 'localhost', port: 3000)",
      "オブジェクトが凍結 (Object.freeze と同等)",
      "配列に変換される",
      "何も起きない",
    ],
    answerIndex: 0,
    hints: [
      "型レベルの変更のみ (runtime 挙動は変わらない)。",
      "リテラル型として保持されるので、Union 型の生成元として使える。",
      "as const + typeof + [number] で配列リテラルから Union 抽出するのが定番。",
    ],
    explanation: {
      summary:
        "`as const` (const assertion) は値のリテラル型を保ち、全プロパティを readonly にする型レベル指示。`{ host: 'localhost' as const }` のように個別にも適用可。配列リテラルに付けるとタプル + readonly に。",
      reason:
        "用途: (1) 設定オブジェクトの値を狭く保つ、(2) 配列リテラルから Union 型を抽出 (`typeof arr[number]`)、(3) Discriminated Union の tag を literal に。Runtime には影響しないので Object.freeze ではない (mutate 自体は JS としては可能)。",
      codeExample:
        "// as const なし\nconst config1 = { host: 'localhost', port: 3000 }\n// 型: { host: string; port: number }\n\n// as const あり\nconst config2 = { host: 'localhost', port: 3000 } as const\n// 型: { readonly host: 'localhost'; readonly port: 3000 }\n\n// 配列リテラルから Union 抽出\nconst ROLES = ['admin', 'editor', 'viewer'] as const\ntype Role = typeof ROLES[number]   // 'admin' | 'editor' | 'viewer'\n\n// → ROLES.includes(x as Role) のように型安全に使える\nROLES.includes(input as Role)\n\n// Discriminated Union の作成\nconst actions = {\n  add: (x: number) => ({ type: 'ADD' as const, payload: x }),\n  remove: (x: number) => ({ type: 'REMOVE' as const, payload: x }),\n}\nactions.add(1)        // { type: 'ADD'; payload: number }\nactions.remove(2)     // { type: 'REMOVE'; payload: number }\n// reducer の Discriminated Union 自動生成パターン\n\n// オブジェクトのキー Union\nconst PERMISSIONS = { READ: 1, WRITE: 2, ADMIN: 4 } as const\ntype PermKey = keyof typeof PERMISSIONS    // 'READ' | 'WRITE' | 'ADMIN'\ntype PermValue = typeof PERMISSIONS[PermKey]   // 1 | 2 | 4\n\n// satisfies と併用 (TS 4.9+)\nconst config = { host: 'localhost', port: 3000 } as const satisfies Config",
    },
  },
  {
    id: "ts-024",
    categoryId: "ts-basics",
    difficulty: "intermediate",
    type: "choice",
    question:
      "TS の『Control Flow Analysis』で次のコードの x の型は？",
    code: "function example(x: string | number | null) {\n  if (x == null) return\n  if (typeof x === 'string') {\n    x.toUpperCase()\n    return\n  }\n  // ここでの x の型は？\n  x.toFixed(2)\n}",
    choices: [
      "number (string と null を narrow した残り)",
      "string | number",
      "any",
      "never",
    ],
    answerIndex: 0,
    hints: [
      "TS は if 分岐で型を絞り込む (narrowing)。",
      "early return で false 分岐の型が排除される。",
      "最後の行に到達する時点で、残りは number のみ。",
    ],
    explanation: {
      summary:
        "TS の Control Flow Analysis: if + early return で型が段階的に絞られる。`x == null` は null と undefined を排除、`typeof x === 'string'` で string を排除 → 残り number。",
      reason:
        "narrowing 手法: `typeof` / `instanceof` / `in` / リテラル比較 / ユーザー定義型ガード (`x is T`)。`!= null` (緩い比較) は null と undefined 両方排除 (`!== null` だと undefined が残る)。Discriminated Union (`switch (s.kind)`) でも同じく分岐ごとに型が絞られる。",
      codeExample:
        "// 基本の narrowing\nfunction f1(x: string | number | null) {\n  if (x == null) return                  // null/undefined 排除\n  if (typeof x === 'string') {\n    x.toUpperCase()                     // x: string\n    return\n  }\n  x.toFixed(2)                          // x: number\n}\n\n// in 演算子\nfunction f2(obj: { a: number } | { b: number }) {\n  if ('a' in obj) return obj.a\n  return obj.b\n}\n\n// Discriminated Union (kind / tag)\ntype Shape = { kind: 'circle'; r: number } | { kind: 'rect'; w: number; h: number }\nfunction area(s: Shape) {\n  switch (s.kind) {\n    case 'circle': return Math.PI * s.r ** 2\n    case 'rect':   return s.w * s.h\n  }\n}\n\n// 網羅性チェック (Exhaustiveness Check)\nfunction area2(s: Shape) {\n  switch (s.kind) {\n    case 'circle': return Math.PI * s.r ** 2\n    case 'rect':   return s.w * s.h\n    default: {\n      const _: never = s              // 新 kind 追加で error\n      throw new Error('unreachable')\n    }\n  }\n}\n\n// ユーザー定義型ガード\nfunction isString(x: unknown): x is string {\n  return typeof x === 'string'\n}\nif (isString(input)) input.toUpperCase()",
    },
  },
  {
    id: "ts-025",
    categoryId: "ts-basics",
    difficulty: "intermediate",
    type: "choice",
    question:
      "次のうち、ユーティリティ型として『誤り』を含むのは？",
    choices: [
      "Partial<T>",
      "Required<T>",
      "Readonly<T>",
      "Optional<T> (TS 標準ではない、Partial<T> が正しい)",
    ],
    answerIndex: 3,
    hints: [
      "標準には Partial / Required / Readonly があるが Optional はない。",
      "Optional は他言語 (Java / Kotlin) の概念。",
      "TS 標準: Partial / Required / Readonly / Pick / Omit / Record 等。",
    ],
    explanation: {
      summary:
        "TS 標準には `Optional<T>` は存在しない。全 optional にしたいなら `Partial<T>`。Optional は他言語の null 安全型の概念。",
      reason:
        "TS 標準のユーティリティ型 (主要): **Partial<T>** 全 optional、**Required<T>** 全必須、**Readonly<T>** 全 readonly、**Pick<T, K>** 抽出、**Omit<T, K>** 除外、**Record<K, V>** マップ、**NonNullable<T>** null/undefined 除外、**ReturnType<F>** 戻り値型、**Parameters<F>** 引数型、**Awaited<P>** Promise 中身、**Exclude<T, U>** Union から除外、**Extract<T, U>** Union から抽出。",
      codeExample:
        "type User = { id: number; name: string; email: string; password: string }\n\n// 基本\ntype PartialUser = Partial<User>     // {id?, name?, email?, password?}\ntype ReadonlyUser = Readonly<User>   // {readonly id; readonly name; ...}\ntype RequiredUser = Required<PartialUser>   // partial を required に戻す\n\n// 派生\ntype LoginInput = Pick<User, 'email' | 'password'>\ntype PublicUser = Omit<User, 'password'>\ntype UserWithoutId = Omit<User, 'id'>      // POST 用\n\n// Union 操作\ntype A = Extract<'a' | 'b' | 'c', 'a' | 'd'>   // 'a' (両方にある)\ntype B = Exclude<'a' | 'b' | 'c', 'a'>          // 'b' | 'c'\ntype N = NonNullable<string | null | undefined>  // string\n\n// 関数解析\nfunction fetchUser(id: number): Promise<User> { ... }\ntype Args = Parameters<typeof fetchUser>    // [number]\ntype Ret = ReturnType<typeof fetchUser>      // Promise<User>\ntype U = Awaited<Ret>                         // User\n\n// Record\ntype StatusMap = Record<'draft' | 'published', User[]>\n// { draft: User[]; published: User[] }\n\n// 自作: Optional (一部だけ optional)\ntype Optional<T, K extends keyof T> = Omit<T, K> & Partial<Pick<T, K>>\ntype UserWithOptionalEmail = Optional<User, 'email'>\n// { id; name; password; email?: string }",
    },
  },
  {
    id: "ts-026",
    categoryId: "ts-basics",
    difficulty: "advanced",
    type: "choice",
    question:
      "TS でグローバル変数 (`window.myApp`) や 3rd party ライブラリの型を拡張する仕組みは？",
    choices: [
      "window.myApp = ... と JS 側だけ",
      "拡張できない",
      "declare global { interface Window { myApp: ... } } / declare module で .d.ts に書く",
      "type Window だけ書く",
    ],
    answerIndex: 2,
    hints: [
      "Ambient declaration と呼ばれる。",
      "interface の宣言マージ機能を使って既存の Window / Process / Express.Request 等に追加。",
      "src/types/global.d.ts のような .d.ts ファイルに書く。",
    ],
    explanation: {
      summary:
        "`declare global` ブロック内で `interface Window { myApp: ... }` のように既存の interface に追加 (宣言マージ)。3rd party の types は `declare module 'lib-name'` で拡張。",
      reason:
        "TypeScript の interface は『宣言マージ』を許す → 既存型に追加できる。`.d.ts` (ambient declaration file) に書くのが慣習。Express の Request に user フィールドを足す、Window にカスタムプロパティを足す、CSS modules の型定義などで頻出。`tsconfig.json` の `include` / `typeRoots` に入れて読み込ませる。",
      codeExample:
        "// src/types/global.d.ts\nexport {}                                  // module 化\n\ndeclare global {\n  interface Window {\n    myApp: { version: string; debug: boolean }\n    gtag: (...args: any[]) => void\n    dataLayer: any[]\n  }\n\n  namespace NodeJS {\n    interface ProcessEnv {\n      DATABASE_URL: string\n      JWT_SECRET: string\n      NEXT_PUBLIC_SITE_URL: string\n    }\n  }\n}\n\n// 使う側\nwindow.myApp.debug = true                   // 型補完あり\nwindow.gtag('event', 'click', { category: 'cta' })\nprocess.env.DATABASE_URL                    // string と推論\n\n// 3rd party ライブラリの拡張 (Express)\n// src/types/express.d.ts\nimport 'express'\ndeclare module 'express' {\n  interface Request {\n    user?: { id: number; email: string }\n  }\n}\n// → req.user に型補完 (middleware で代入する想定)\n\n// CSS Modules\ndeclare module '*.module.css' {\n  const classes: { readonly [key: string]: string }\n  export default classes\n}\nimport styles from './Card.module.css'\nstyles.title                                // string\n\n// SVG as component (Vite / Next.js)\ndeclare module '*.svg' {\n  const content: string\n  export default content\n}",
    },
  },
  {
    id: "ts-027",
    categoryId: "ts-basics",
    difficulty: "advanced",
    type: "choice",
    question:
      "TS 5.0+ で導入された const type parameter の使い方として正しいのは？",
    choices: [
      "TS 5.0 では使えない",
      "function foo<const T>(arg: T) — 呼び出し時の引数を literal type として推論する",
      "型変数を const にする",
      "コンパイル時定数を強制",
    ],
    answerIndex: 1,
    hints: [
      "通常のジェネリクスはオブジェクト引数を広い型に推論する。",
      "`const T` で呼び出し側に as const を付けなくても literal 推論。",
      "API 設計で『引数のリテラル型を保ったまま型を返す』のに便利。",
    ],
    explanation: {
      summary:
        "TS 5.0+ の `function foo<const T>(arg: T)` で、引数のリテラル型を保ったまま型変数 T を推論。通常はオブジェクトリテラルが widened (string になる) されるのを防ぐ。",
      reason:
        "従来は呼び出し側で `as const` を毎回書く必要があった。`<const T>` を付けるとライブラリ側で literal 推論を強制できる。便利ケース: 動的なルート定義 (`route(['admin', 'users'])` で 'admin' / 'users' が literal で型に残る)、Tailwind の class builder、設定 DSL。",
      codeExample:
        "// 従来 (TS 4.x まで)\nfunction route<T>(parts: T) { return parts }\nconst r1 = route(['users', 'edit'])\n// r1 の型: string[] (literal が失われる)\n\nconst r2 = route(['users', 'edit'] as const)\n// r2 の型: readonly ['users', 'edit']\n// → 呼び出し側に as const を強制\n\n// TS 5.0+ <const T>\nfunction route<const T>(parts: T) { return parts }\nconst r3 = route(['users', 'edit'])\n// r3 の型: readonly ['users', 'edit']\n// → as const なしで literal 保持\n\n// 実用例: 型安全なルート定義\nfunction defineRoutes<const T extends Record<string, string>>(routes: T): T {\n  return routes\n}\nconst routes = defineRoutes({\n  home: '/',\n  users: '/users',\n  userDetail: '/users/:id',\n})\n// routes.home: '/' (literal)\n// routes.users: '/users' (literal)\n// 型: { home: '/'; users: '/users'; userDetail: '/users/:id' }\n\n// ルートの URL を型レベルで生成\ntype Routes = typeof routes\ntype RouteKey = keyof Routes              // 'home' | 'users' | 'userDetail'\n\n// Tailwind 風 class builder\nfunction tw<const T extends string[]>(...classes: T): T[number] {\n  return classes.join(' ') as T[number]\n}\nconst cls = tw('flex', 'gap-2', 'p-4')\n// classes に 'flex' | 'gap-2' | 'p-4' のリテラル型が残る",
    },
  },
  {
    id: "ts-028",
    categoryId: "ts-basics",
    difficulty: "advanced",
    type: "choice",
    question:
      "TS で『同じプリミティブ型だが意味的に区別したい』(UserId と PostId はどちらも number だが混用させない) パターンは？",
    choices: [
      "Branded types (Nominal types) — type UserId = number & { __brand: 'UserId' }",
      "interface で囲む",
      "Object でラップ",
      "新しい型を作る",
    ],
    answerIndex: 0,
    hints: [
      "TS は構造的部分型 (structural typing) なので、number は全部互換。",
      "ブランドプロパティを intersect で『見えない印』を付ける。",
      "実行時には影響なし、コンパイル時のみ区別。",
    ],
    explanation: {
      summary:
        "Branded types (Nominal typing emulation): `type UserId = number & { __brand: 'UserId' }` で同じ number でも UserId と PostId を区別。TS の構造的型システムを意図的に名目的にする手法。",
      reason:
        "TS は構造が同じなら互換 → `function transfer(from: UserId, to: UserId)` に PostId を渡しても通る。Branded types で intersect の brand プロパティが実体に存在しないが、コンパイル時のチェックで弾ける。zod / io-ts / valibot などのスキーマライブラリと組み合わせて、検証通過後に branded type にするパターンも。",
      codeExample:
        "// ❌ 普通の type alias (混用される)\ntype UserId = number\ntype PostId = number\n\nfunction follow(from: UserId, to: UserId) { ... }\nconst p: PostId = 42\nfollow(p, p)                              // ❌ 型エラーにならない (どちらも number)\n\n// ✅ Branded types\ntype Brand<T, B> = T & { __brand: B }\ntype UserId = Brand<number, 'UserId'>\ntype PostId = Brand<number, 'PostId'>\n\nfunction toUserId(n: number): UserId {\n  return n as UserId                       // unsafe cast (検証して使う)\n}\nfunction toPostId(n: number): PostId {\n  return n as PostId\n}\n\nconst u = toUserId(1)\nconst p = toPostId(2)\n\nfunction follow(from: UserId, to: UserId) { ... }\nfollow(u, u)                              // ✅ OK\nfollow(u, p)                              // ❌ Error: Argument of type 'PostId' is not assignable to 'UserId'\n\n// zod と組み合わせ\nimport { z } from 'zod'\n\nconst EmailSchema = z.string().email().brand<'Email'>()\ntype Email = z.infer<typeof EmailSchema>   // string & { z.BRAND<'Email'> }\n\nfunction sendMail(to: Email, body: string) { ... }\n\nconst raw: string = 'foo@example.com'\nsendMail(raw, '...')                       // ❌ Error (string は Email でない)\nconst email = EmailSchema.parse(raw)\nsendMail(email, '...')                     // ✅ OK\n\n// 数値範囲も branded で\ntype Percent = Brand<number, 'Percent'>    // 0〜100 のみ\nfunction toPercent(n: number): Percent {\n  if (n < 0 || n > 100) throw new Error('out of range')\n  return n as Percent\n}",
    },
  },
  {
    id: "ts-029",
    categoryId: "ts-basics",
    difficulty: "intermediate",
    type: "choice",
    question:
      "Discriminated Union の網羅性 (Exhaustiveness) をコンパイル時にチェックする慣用句は？",
    choices: [
      "if (true) { ... } else throw",
      "console.error",
      "@ts-ignore",
      "default ケースで const _: never = x として代入 (新ケース追加時に error)",
    ],
    answerIndex: 3,
    hints: [
      "never 型は『どの値も入らない』 → switch の default で残りが never であることをチェック。",
      "新ケースを Union に追加すると default の x の型が new case を含むため代入エラーに。",
      "switch / if-else どちらでも使える。",
    ],
    explanation: {
      summary:
        "Discriminated Union の網羅性チェック: switch の default で `const _: never = x` と代入する。新ケースを Union に追加した時、コンパイラが『これは never に入らない』とエラーで教えてくれる。",
      reason:
        "TS の型システムの強みの 1 つ。『新しい kind を追加し忘れて、古い分岐だけで処理する』バグを防ぐ。assertNever 関数として切り出すと再利用しやすい。Redux reducer / state machine / payment provider 切替などで多用。",
      codeExample:
        "type Shape =\n  | { kind: 'circle'; r: number }\n  | { kind: 'rect'; w: number; h: number }\n\n// 網羅性チェック\nfunction area(s: Shape): number {\n  switch (s.kind) {\n    case 'circle': return Math.PI * s.r ** 2\n    case 'rect':   return s.w * s.h\n    default: {\n      const _exhaustive: never = s         // ← 新 kind 追加で error\n      throw new Error(`Unknown shape: ${(s as any).kind}`)\n    }\n  }\n}\n\n// 後で triangle を追加\ntype Shape =\n  | { kind: 'circle'; r: number }\n  | { kind: 'rect'; w: number; h: number }\n  | { kind: 'triangle'; b: number; h: number }\n\n// area の default で error:\n// Type '{ kind: \"triangle\"; ... }' is not assignable to type 'never'\n// → switch に case 'triangle' を追加せよと教えてくれる\n\n// assertNever ヘルパ (再利用)\nfunction assertNever(x: never): never {\n  throw new Error(`Unexpected: ${JSON.stringify(x)}`)\n}\n\nfunction area2(s: Shape): number {\n  switch (s.kind) {\n    case 'circle':   return Math.PI * s.r ** 2\n    case 'rect':     return s.w * s.h\n    case 'triangle': return s.b * s.h / 2\n    default:         return assertNever(s)\n  }\n}\n\n// Redux reducer\ntype Action =\n  | { type: 'inc' }\n  | { type: 'dec' }\n  | { type: 'reset'; value: number }\n\nfunction reducer(state: number, action: Action): number {\n  switch (action.type) {\n    case 'inc': return state + 1\n    case 'dec': return state - 1\n    case 'reset': return action.value\n    default: return assertNever(action)\n  }\n}",
    },
  },
  {
    id: "ts-030",
    categoryId: "ts-basics",
    difficulty: "advanced",
    type: "choice",
    question:
      "TS の型レベルで『snake_case の string literal を camelCase に変換』する型は？",
    choices: [
      "Template Literal Type + Conditional Type + 再帰の組合せ (`${A}_${B}` → `${A}${Capitalize<B>}`)",
      "標準ユーティリティ Camelize<T>",
      "実装不可能",
      "正規表現",
    ],
    answerIndex: 0,
    hints: [
      "TS 4.1+ の Template Literal Type で型レベル文字列操作が可能に。",
      "Capitalize<S> / Uppercase / Lowercase の組込み Intrinsic Types。",
      "再帰で `_` を順次変換するパターン。",
    ],
    explanation: {
      summary:
        "Template Literal Type + Capitalize + 再帰で `'user_first_name'` → `'userFirstName'` を型レベルで変換可能。さらに Mapped Type と組み合わせて Object のキーを変換できる。",
      reason:
        "API レスポンスの snake_case → camelCase 変換などで、ライブラリが型レベルで自動推論できる根拠。TS は型レベルで Turing 完全 (条件 + 再帰) なので、Length カウント / sort / parsing なども理論上は実装可能 (現実的にはコンパイル時間とのバランス)。",
      codeExample:
        "// snake_case → camelCase\ntype CamelCase<S extends string> = S extends `${infer A}_${infer B}`\n  ? `${A}${Capitalize<CamelCase<B>>}`\n  : S\n\ntype A = CamelCase<'user_first_name'>     // 'userFirstName'\ntype B = CamelCase<'created_at'>           // 'createdAt'\ntype C = CamelCase<'id'>                   // 'id' (no change)\n\n// Object のキーを変換 (Mapped Type の as 句)\ntype ObjectCamelize<T> = {\n  [K in keyof T as CamelCase<K & string>]: T[K]\n}\n\ntype ApiUser = {\n  user_id: number\n  first_name: string\n  created_at: string\n}\ntype CamelUser = ObjectCamelize<ApiUser>\n// { userId: number; firstName: string; createdAt: string }\n\n// 逆変換 (camelCase → snake_case)\ntype SnakeCase<S extends string> = S extends `${infer A}${infer B}`\n  ? B extends Uncapitalize<B>\n    ? `${A}${SnakeCase<B>}`\n    : `${A}_${SnakeCase<Uncapitalize<B>>}`\n  : S\n\ntype D = SnakeCase<'userFirstName'>        // 'user_first_name'\n\n// 関連: Path keys (ネストオブジェクトの全 path を Union 型に)\ntype Paths<T> = {\n  [K in keyof T]: T[K] extends object\n    ? `${K & string}` | `${K & string}.${Paths<T[K]> & string}`\n    : `${K & string}`\n}[keyof T]\n\ntype P = Paths<{ user: { profile: { name: string } } }>\n// 'user' | 'user.profile' | 'user.profile.name'",
    },
  },

  // ===========================================================================
  // ⚛️ React 拡張 (react-021 〜 react-030)
  // ===========================================================================
  {
    id: "react-021",
    categoryId: "react-fundamentals",
    difficulty: "intermediate",
    type: "choice",
    question:
      "React 18+ の StrictMode は開発時に何をする？",
    choices: [
      "全コンポーネントを memo 化する",
      "useState / useEffect 等を意図的に 2 回呼ぶ — 副作用の冪等性チェック / 古い API 警告 / 開発時のみ動作",
      "本番で 2 倍速くなる",
      "型チェックを厳しくする",
    ],
    answerIndex: 1,
    hints: [
      "開発時に意図的に二度実行して、冪等でない副作用を検出。",
      "useEffect の cleanup 漏れを発見できる。",
      "本番ビルドでは影響なし。",
    ],
    explanation: {
      summary:
        "React 18 の `<StrictMode>` は開発時にコンポーネントを 2 回 render / effect を 2 回実行して、冪等性 (subscribe → unsubscribe が正しいか) をチェック。本番では何もしない。",
      reason:
        "React 18+ で導入された Strict Effects。effect が cleanup なしだと『2 回目で 2 つの subscription』になりバグが顕在化 → 開発時に気づける。`createRoot` の `<StrictMode>` 配下で動作。レガシーコンポーネント (componentWillMount 等) の警告、安全でない findDOMNode 等も検出。Next.js は `reactStrictMode: true` (デフォルト) で有効。",
      codeExample:
        "// app/layout.tsx (Next.js 自動)\n// Next.js は config で reactStrictMode が ON\n\n// 手動で囲む (Vite / CRA)\nimport { StrictMode } from 'react'\nimport { createRoot } from 'react-dom/client'\n\ncreateRoot(document.getElementById('root')!).render(\n  <StrictMode>\n    <App />\n  </StrictMode>\n)\n\n// StrictMode で発見できるバグの例\nfunction Counter() {\n  const [n, setN] = useState(0)\n\n  // ❌ cleanup なし subscription\n  useEffect(() => {\n    const id = setInterval(() => setN(c => c + 1), 1000)\n    // return () => clearInterval(id)   ← これが無い\n  }, [])\n  // StrictMode で 2 回実行 → 2 つのタイマー → 1 秒で +2 され、cleanup 漏れに気づく\n\n  return <p>{n}</p>\n}\n\n// ✅ 正しい (cleanup あり)\nuseEffect(() => {\n  const id = setInterval(() => setN(c => c + 1), 1000)\n  return () => clearInterval(id)         // ← cleanup\n}, [])\n\n// StrictMode が検出する古い API\n// - componentWillMount, componentWillReceiveProps, componentWillUpdate\n// - findDOMNode (deprecated)\n// - 安全でない legacy context API\n// - レガシー string refs",
    },
  },
  {
    id: "react-022",
    categoryId: "react-fundamentals",
    difficulty: "advanced",
    type: "choice",
    question:
      "重い state 更新をユーザー操作 (typing) をブロックせずに行うための React 18+ API は？",
    choices: [
      "setTimeout で遅延",
      "useEffect 内で setState",
      "useMemo",
      "startTransition (or useTransition) — 重い更新を低優先度としてマーク",
    ],
    answerIndex: 3,
    hints: [
      "Concurrent Features の中核。",
      "ユーザー入力 (typing) は高優先、絞り込み結果の描画は低優先と分けられる。",
      "useTransition は pending フラグも返す。",
    ],
    explanation: {
      summary:
        "`startTransition(() => { setState(...) })` で更新を低優先度マーク。重い再 render (大量リスト絞り込み等) をユーザー入力 (typing) をブロックせずに進める。`useTransition` は `[isPending, startTransition]` を返し、ローディング表示も。",
      reason:
        "React 18 の Concurrent Renderer の真価。緊急更新 (urgent): typing / クリックの即時反応。非緊急 (transition): 検索結果のフィルタ・タブ切替・ナビゲーション。Concurrent モードは内部で『中断可能な render』を可能にし、優先度の高いタスクで中断 → 後で再開。`useDeferredValue` も類似の用途で、特に値の更新を遅延したい時に。",
      codeExample:
        "'use client'\nimport { useState, useTransition, useDeferredValue } from 'react'\n\nfunction Search() {\n  const [query, setQuery] = useState('')\n  const [results, setResults] = useState<Item[]>([])\n  const [isPending, startTransition] = useTransition()\n\n  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {\n    setQuery(e.target.value)   // 緊急: input は即座に\n\n    startTransition(() => {\n      // 重い処理を低優先で\n      const filtered = heavyFilter(items, e.target.value)\n      setResults(filtered)\n    })\n  }\n\n  return (\n    <>\n      <input value={query} onChange={handleChange} />\n      {isPending && <Spinner />}\n      <ItemList items={results} />\n    </>\n  )\n}\n\n// useDeferredValue (派生版)\nfunction SearchAlt() {\n  const [query, setQuery] = useState('')\n  const deferredQuery = useDeferredValue(query)   // 遅延された値\n\n  // deferredQuery の変化で重い再 render が走る\n  // query 自体は即時更新 (input にすぐ反映)\n  const results = useMemo(\n    () => heavyFilter(items, deferredQuery),\n    [deferredQuery]\n  )\n\n  return (\n    <>\n      <input value={query} onChange={e => setQuery(e.target.value)} />\n      <ItemList items={results} />\n    </>\n  )\n}\n\n// React 18+ では setState がデフォルトで非緊急扱いされる場面も自動拡張\n// Suspense + transition の組合せで Streaming SSR とも統合",
    },
  },
  {
    id: "react-023",
    categoryId: "react-fundamentals",
    difficulty: "intermediate",
    type: "choice",
    question:
      "React で『ユニーク ID を生成する』Hook (React 18+) は？",
    choices: [
      "useRef(crypto.randomUUID())",
      "Date.now()",
      "useId — SSR / Client Hydration 間で一貫した ID を生成",
      "Math.random()",
    ],
    answerIndex: 2,
    hints: [
      "input と label の for/htmlFor 関連付けに便利。",
      "SSR と CSR で同じ ID を生成 (Hydration エラー防止)。",
      "リスト内では使わない (key の代わりにはならない)。",
    ],
    explanation: {
      summary:
        "`useId()` は SSR / Client で一貫した一意 ID を生成する Hook (React 18+)。input と label のような a11y 関連付けで `:r1:` のような ID を返す。リスト要素の key には使わない。",
      reason:
        "従来は `Math.random()` や `nanoid()` で生成 → SSR と CSR で値がずれて Hydration mismatch 警告。`useId` は React の内部 tree 位置から決定論的に生成 → 一致する。a11y (aria-describedby、for/id 関連付け)、複数 input の prefix (`${id}-name`、`${id}-email`) に。",
      codeExample:
        "'use client'\nimport { useId } from 'react'\n\nfunction LoginForm() {\n  const id = useId()\n  return (\n    <form>\n      <label htmlFor={`${id}-email`}>Email</label>\n      <input id={`${id}-email`} type=\"email\" />\n\n      <label htmlFor={`${id}-password`}>Password</label>\n      <input id={`${id}-password`} type=\"password\" />\n\n      <button>Login</button>\n    </form>\n  )\n}\n\n// 同じ Form コンポーネントを 2 回使っても ID が衝突しない\n<LoginForm />\n<LoginForm />   // 2 つ目は :r2:-email など\n\n// a11y\nfunction Tooltip() {\n  const id = useId()\n  return (\n    <>\n      <button aria-describedby={id}>Help</button>\n      <div id={id} role=\"tooltip\">Useful information</div>\n    </>\n  )\n}\n\n// ❌ リスト key には使わない (useId はコンポーネント生成時 1 回だけ)\nitems.map(() => {\n  const id = useId()   // Hook の rules-of-hooks 違反 + 全部同じ ID\n  return <li key={id}>...</li>\n})\n// ✅ リストは item.id を使う\nitems.map(item => <li key={item.id}>...</li>)",
    },
  },
  {
    id: "react-024",
    categoryId: "react-fundamentals",
    difficulty: "advanced",
    type: "choice",
    question:
      "React 外部の store (Redux / Zustand / browser API 等) を React の concurrent renderer と安全に統合する Hook は？",
    choices: [
      "useEffect",
      "useSyncExternalStore — subscribe / snapshot / serverSnapshot で同期",
      "useState",
      "useRef",
    ],
    answerIndex: 1,
    hints: [
      "React 18+ で標準化された外部 store 同期 Hook。",
      "Redux / Zustand など主要ライブラリの内部で使われている。",
      "tearing (concurrent render の途中で state が変わるバグ) を防ぐ。",
    ],
    explanation: {
      summary:
        "`useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot?)` は外部 store を React に統合する標準 API。subscribe で変更通知、getSnapshot で現在値、getServerSnapshot で SSR 用初期値。tearing 防止が組み込み済み。",
      reason:
        "React 18 の Concurrent Renderer では、render の途中で別の優先度のタスクで中断 → 再開する可能性がある。その間に外部 state が変わるとコンポーネント間で表示が割れる (tearing)。useSyncExternalStore は同期的な snapshot を保証してこれを防ぐ。Redux / Zustand / Jotai / Apollo は内部でこれを使うようアップデート済み。アプリ開発者が直接書くのは『独自の外部 store』『window resize / online status / matchMedia などのブラウザ API』",
      codeExample:
        "'use client'\nimport { useSyncExternalStore } from 'react'\n\n// 1. ブラウザの online/offline 状態を購読\nfunction useOnlineStatus() {\n  return useSyncExternalStore(\n    (callback) => {\n      window.addEventListener('online', callback)\n      window.addEventListener('offline', callback)\n      return () => {\n        window.removeEventListener('online', callback)\n        window.removeEventListener('offline', callback)\n      }\n    },\n    () => navigator.onLine,            // クライアントの snapshot\n    () => true,                         // SSR の snapshot (オンライン仮定)\n  )\n}\n\nfunction App() {\n  const isOnline = useOnlineStatus()\n  return <p>{isOnline ? '🟢 Online' : '🔴 Offline'}</p>\n}\n\n// 2. matchMedia (Dark Mode 検出)\nfunction useDarkMode() {\n  return useSyncExternalStore(\n    (callback) => {\n      const mql = window.matchMedia('(prefers-color-scheme: dark)')\n      mql.addEventListener('change', callback)\n      return () => mql.removeEventListener('change', callback)\n    },\n    () => window.matchMedia('(prefers-color-scheme: dark)').matches,\n    () => false,                         // SSR\n  )\n}\n\n// 3. 自作 store\nlet state = { count: 0 }\nconst listeners = new Set<() => void>()\nconst store = {\n  subscribe(cb: () => void) {\n    listeners.add(cb)\n    return () => listeners.delete(cb)\n  },\n  getSnapshot() {\n    return state\n  },\n  increment() {\n    state = { count: state.count + 1 }\n    listeners.forEach(l => l())\n  },\n}\n\nfunction Counter() {\n  const s = useSyncExternalStore(store.subscribe, store.getSnapshot)\n  return <button onClick={() => store.increment()}>{s.count}</button>\n}",
    },
  },
  {
    id: "react-025",
    categoryId: "react-fundamentals",
    difficulty: "advanced",
    type: "choice",
    question:
      "React で『DOM ツリー外 (modal / tooltip / portal target) に要素を描画する』API は？",
    choices: [
      "createPortal(children, targetDOM) — react-dom から",
      "ReactDOM.render",
      "useRef + ReactDOM.append",
      "そのような機能はない",
    ],
    answerIndex: 0,
    hints: [
      "Modal / Tooltip / Toast / Dropdown で重宝。",
      "親の overflow:hidden / z-index を脱出できる。",
      "React のイベントは Portal でも継承される (DOM ではなく React tree で bubble)。",
    ],
    explanation: {
      summary:
        "`createPortal(children, targetElement)` で React tree の階層を保ったまま、別の DOM 位置に描画。親の CSS (overflow / transform) を脱出できる。Modal / Tooltip / Dropdown / Toast で頻出。",
      reason:
        "React tree は階層的に React イベントを bubble する → Portal で別の DOM 位置に描画しても、React の onClick / onChange は親に伝わる。Modal の close で外側クリック検出も簡単。注意: a11y (フォーカストラップ、aria-modal、Esc で閉じる) は別途実装。Radix UI / shadcn/ui / Material UI の Modal が裏で createPortal を使っている。",
      codeExample:
        "'use client'\nimport { useState, useRef, useEffect } from 'react'\nimport { createPortal } from 'react-dom'\n\nfunction Modal({\n  open,\n  onClose,\n  children,\n}: {\n  open: boolean\n  onClose: () => void\n  children: React.ReactNode\n}) {\n  const [mounted, setMounted] = useState(false)\n\n  useEffect(() => {\n    setMounted(true)\n  }, [])\n\n  // Escape で閉じる\n  useEffect(() => {\n    if (!open) return\n    const handler = (e: KeyboardEvent) => {\n      if (e.key === 'Escape') onClose()\n    }\n    window.addEventListener('keydown', handler)\n    return () => window.removeEventListener('keydown', handler)\n  }, [open, onClose])\n\n  if (!mounted || !open) return null\n\n  return createPortal(\n    <div\n      role=\"dialog\"\n      aria-modal=\"true\"\n      className=\"fixed inset-0 z-50 grid place-items-center bg-black/50\"\n      onClick={onClose}\n    >\n      <div\n        className=\"rounded-lg bg-white p-6 shadow-xl dark:bg-zinc-900\"\n        onClick={(e) => e.stopPropagation()}   // 内側クリックは閉じない\n      >\n        {children}\n        <button onClick={onClose}>Close</button>\n      </div>\n    </div>,\n    document.body   // body 直下に描画 (overflow:hidden の親を脱出)\n  )\n}\n\n// 使う\nfunction Page() {\n  const [open, setOpen] = useState(false)\n  return (\n    <div className=\"overflow-hidden\">    {/* 親が overflow:hidden でも Portal なら脱出 */}\n      <button onClick={() => setOpen(true)}>Open</button>\n      <Modal open={open} onClose={() => setOpen(false)}>\n        <h2>Modal content</h2>\n        <p>Lorem ipsum...</p>\n      </Modal>\n    </div>\n  )\n}\n\n// Toast / Tooltip も同じパターン\n// 実装は Radix UI / shadcn/ui / Material UI の使用が現代の主流",
    },
  },
  {
    id: "react-026",
    categoryId: "react-fundamentals",
    difficulty: "intermediate",
    type: "choice",
    question:
      "React の Fragment に key を付けたい時の書き方は？",
    choices: [
      "<key={id}>",
      "<div key={id} fragment>",
      "Fragment に key は不要",
      "<Fragment key={id}> ... </Fragment> (短縮形 <></> では key を付けられない)",
    ],
    answerIndex: 3,
    hints: [
      "<></> は短縮形で props を取れない。",
      "リスト内で複数要素を 1 つの単位として render したい時に。",
      "import { Fragment } from 'react' で明示的に。",
    ],
    explanation: {
      summary:
        "Fragment に key を付ける時は短縮形 `<></>` ではなく `<Fragment key={id}>` を使う。リスト内で『複数要素を 1 つの単位として render したい』時 (definition list、表の行など) に必須。",
      reason:
        "リストでは React が key で要素同一性を判定 → key 抜けや変動 (index など) で再 mount が頻発しバグの温床。Fragment で複数要素をグループ化する時も同じ。Fragment + key で『1 行 = 複数 DOM (dt + dd)』のような構造を綺麗に表現できる。",
      codeExample:
        "import { Fragment } from 'react'\n\n// ❌ key 付き短縮形は不可\nitems.map(item => <key={item.id}>...</>)        // syntax error\n\n// ✅ Fragment を明示\nitems.map(item => (\n  <Fragment key={item.id}>\n    <dt>{item.term}</dt>\n    <dd>{item.definition}</dd>\n  </Fragment>\n))\n\n// 同じく表で 1 行 = 2 行を描く時\n<table>\n  <tbody>\n    {pairs.map(pair => (\n      <Fragment key={pair.id}>\n        <tr><td>Question</td><td>{pair.question}</td></tr>\n        <tr><td>Answer</td><td>{pair.answer}</td></tr>\n      </Fragment>\n    ))}\n  </tbody>\n</table>\n\n// 短縮形 (key 不要時のみ)\n{condition && (\n  <>\n    <Header />\n    <Body />\n  </>\n)}\n\n// 子要素 1 つだけ (Fragment 不要)\n{condition && <Body />}",
    },
  },
  {
    id: "react-027",
    categoryId: "react-fundamentals",
    difficulty: "advanced",
    type: "choice",
    question:
      "React で SSR/Hydration エラーを避けつつ『クライアントだけで動く』値 (window / Date.now など) を扱う方法は？",
    choices: [
      "window 直接アクセス",
      "対応不要",
      "useState + useEffect でクライアントマウント後に値をセット (or 'use client' + 動的 import + ssr: false)",
      "サーバー側で生成",
    ],
    answerIndex: 2,
    hints: [
      "サーバーで初期 HTML を生成 → クライアントが Hydrate でズレるとエラー。",
      "Date.now() / Math.random() / window.localStorage がよくある原因。",
      "Next.js の dynamic + ssr: false で SSR をスキップする方法も。",
    ],
    explanation: {
      summary:
        "Hydration mismatch を避ける 3 パターン: (1) useEffect 内でクライアントマウント後にセット、(2) `useSyncExternalStore` の serverSnapshot で SSR 用初期値、(3) Next.js なら `dynamic(() => import(...), { ssr: false })` で SSR をスキップ。",
      reason:
        "Server で生成した HTML と Client で render した HTML がズレると React は警告 → ハイドレーション失敗。原因: time / random / localStorage / window / dark mode preference / 認証状態など。`suppressHydrationWarning` 属性は最終手段 (内部で <time> など限定要素にのみ)。Next.js App Router の Server Component なら、そもそも Hydration の対象外なので問題なし。",
      codeExample:
        "'use client'\nimport { useState, useEffect } from 'react'\n\n// ❌ SSR と CSR でズレる\nfunction Now() {\n  return <p>{new Date().toLocaleTimeString()}</p>\n  // SSR: '12:34:56' / CSR Hydration 時: '12:34:57' → mismatch\n}\n\n// ✅ パターン 1: useEffect でマウント後にセット\nfunction Now() {\n  const [time, setTime] = useState<string | null>(null)\n\n  useEffect(() => {\n    setTime(new Date().toLocaleTimeString())\n    const id = setInterval(() => {\n      setTime(new Date().toLocaleTimeString())\n    }, 1000)\n    return () => clearInterval(id)\n  }, [])\n\n  if (time === null) return null         // SSR + マウント前\n  return <p>{time}</p>\n}\n\n// ✅ パターン 2: useSyncExternalStore (online/offline 等)\n// → 上記 react-024 参照\n\n// ✅ パターン 3: Next.js dynamic import で SSR スキップ\n// app/chart-page.tsx\nimport dynamic from 'next/dynamic'\n\nconst Chart = dynamic(() => import('./chart-component'), {\n  ssr: false,\n  loading: () => <Skeleton />,\n})\n\nexport default function Page() {\n  return <Chart data={...} />            // クライアントだけで render\n}\n\n// suppressHydrationWarning (最終手段、属性に限定)\n<time suppressHydrationWarning dateTime={time.toISOString()}>\n  {time.toLocaleString()}\n</time>",
    },
  },
  {
    id: "react-028",
    categoryId: "react-fundamentals",
    difficulty: "intermediate",
    type: "choice",
    question:
      "React で『コンポーネント内で発生した例外を捕捉してフォールバック UI を出す』仕組みは？",
    choices: [
      "console.error",
      "Error Boundary — class component の componentDidCatch / static getDerivedStateFromError、または react-error-boundary ライブラリ",
      "try/catch でラップ",
      "useEffect でエラー監視",
    ],
    answerIndex: 1,
    hints: [
      "React 本体には class 版しかない、関数で書くなら react-error-boundary。",
      "render / lifecycle / Hook 中の throw を捕捉。",
      "イベントハンドラ内のエラーは捕捉しない (普通の try/catch を)。",
    ],
    explanation: {
      summary:
        "Error Boundary は class component で `static getDerivedStateFromError` と `componentDidCatch` を実装、または `react-error-boundary` ライブラリで関数コンポーネント風に書く。render / hook / lifecycle 中のエラーを捕捉。",
      reason:
        "捕捉対象: コンポーネントの render、lifecycle メソッド、子の constructor、Hook の throw。捕捉しない: イベントハンドラ内、async / setTimeout 内、Server-Side Rendering、Error Boundary 自身のエラー (親に伝播)。Suspense と並ぶ React の宣言的エラーハンドリング。Sentry / Datadog に送信して監視。",
      codeExample:
        "// Class (React 本体)\nclass ErrorBoundary extends React.Component<\n  { children: React.ReactNode; fallback: React.ReactNode },\n  { hasError: boolean; error: Error | null }\n> {\n  state = { hasError: false, error: null }\n\n  static getDerivedStateFromError(error: Error) {\n    return { hasError: true, error }\n  }\n\n  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {\n    Sentry.captureException(error, { extra: errorInfo })\n  }\n\n  render() {\n    if (this.state.hasError) return this.props.fallback\n    return this.props.children\n  }\n}\n\n// 使う\n<ErrorBoundary fallback={<p>Something went wrong</p>}>\n  <App />\n</ErrorBoundary>\n\n// react-error-boundary (推奨、関数で書ける)\nimport { ErrorBoundary } from 'react-error-boundary'\n\nfunction Fallback({ error, resetErrorBoundary }: FallbackProps) {\n  return (\n    <div role=\"alert\">\n      <p>Error: {error.message}</p>\n      <button onClick={resetErrorBoundary}>Retry</button>\n    </div>\n  )\n}\n\n<ErrorBoundary\n  FallbackComponent={Fallback}\n  onError={(err, info) => Sentry.captureException(err, { extra: info })}\n  onReset={() => refetch()}\n>\n  <Suspense fallback={<Loading />}>\n    <Posts />\n  </Suspense>\n</ErrorBoundary>\n\n// イベントハンドラのエラーは別途 try/catch\nfunction Submit() {\n  return (\n    <button onClick={async () => {\n      try {\n        await api.create()\n      } catch (e) {\n        toast.error('Failed')\n        Sentry.captureException(e)\n      }\n    }}>\n      Save\n    </button>\n  )\n}",
    },
  },
  {
    id: "react-029",
    categoryId: "react-fundamentals",
    difficulty: "advanced",
    type: "choice",
    question:
      "React で props を passing するのを避けて『開発者がデバッグしやすいコンポーネント名』を DevTools に表示する Hook / API は？",
    choices: [
      "useDebugValue (Custom Hook 内) / displayName プロパティ (memo / forwardRef)",
      "console.log",
      "useId",
      "useImperativeHandle",
    ],
    answerIndex: 0,
    hints: [
      "Custom Hook の中で useDebugValue を呼ぶと React DevTools にラベル表示。",
      "memo / forwardRef でラップした関数は名前が無くなりやすい → displayName で。",
      "DevTools で見やすくするための補助的機能。",
    ],
    explanation: {
      summary:
        "`useDebugValue(label, formatter?)` を Custom Hook 内で呼ぶと React DevTools にラベル表示。`Component.displayName = 'Name'` で memo / forwardRef ラップ後のコンポーネント名を保持。",
      reason:
        "Custom Hook を多用すると DevTools で『useState[0]: 'value'』のような無味な表示になる → useDebugValue で意味を付ける。memo(Component) / forwardRef(Component) は無名関数になることがあり、DevTools 上で `<_c>` や `<ForwardRef>` 表示 → displayName で命名。Production ビルドでは消える / 影響なし。",
      codeExample:
        "import { useDebugValue, useEffect, useState, memo, forwardRef } from 'react'\n\n// Custom Hook で DevTools にラベル表示\nfunction useOnlineStatus() {\n  const [online, setOnline] = useState(true)\n  useEffect(() => { /* ... */ }, [])\n\n  useDebugValue(online ? 'Online' : 'Offline')\n  return online\n}\n\n// formatter は重い計算を skip\nfunction useDebouncedValue<T>(value: T, ms: number) {\n  const [v, setV] = useState(value)\n  useEffect(() => { /* ... */ }, [value, ms])\n\n  useDebugValue(v, val => `Debounced: ${val} (${ms}ms)`)\n  return v\n}\n\n// memo / forwardRef のラベル\nconst Button = memo(function Button({ label }: { label: string }) {\n  return <button>{label}</button>\n})\nButton.displayName = 'Button'\n\nconst Input = forwardRef<HTMLInputElement, { label: string }>(\n  function Input({ label }, ref) {\n    return <input ref={ref} placeholder={label} />\n  }\n)\nInput.displayName = 'Input'\n\n// React DevTools で見ると:\n// <Button label=\"Save\">          (memo)\n// <Input>                          (forwardRef)\n// useOnlineStatus: 'Online'        (Custom Hook)",
    },
  },
  {
    id: "react-030",
    categoryId: "react-fundamentals",
    difficulty: "advanced",
    type: "choice",
    question:
      "React Compiler (実験的、React 19+) が自動でやってくれることは？",
    choices: [
      "テストの自動生成",
      "本番デプロイ",
      "useMemo / useCallback / React.memo の自動挿入 (依存解析でメモ化を自動化)",
      "TypeScript 型の自動生成",
    ],
    answerIndex: 2,
    hints: [
      "Facebook (Meta) 開発のコンパイラ。",
      "Babel / SWC プラグインとして組み込む。",
      "手動メモ化が不要になる方向。",
    ],
    explanation: {
      summary:
        "React Compiler はビルド時にコードを解析し、必要な `useMemo` / `useCallback` / `React.memo` を自動挿入する。React 19+ で実験的 → 2025 年安定化予定。前提は『React のルール (Hook ルール + props/state を mutate しない) を守る』こと。",
      reason:
        "現状: パフォーマンスのために開発者が手動で useMemo / useCallback を書く → 漏れや過剰メモ化で逆効果も。Compiler が自動で適切な箇所だけメモ化 → コードが綺麗 + 性能向上。導入: Babel / SWC プラグイン + `eslint-plugin-react-compiler` で非互換コードを検出。Meta は社内で運用済み、Instagram でデプロイ済み。",
      codeExample:
        "// 現状 (手動メモ化)\nimport { useMemo, useCallback, memo } from 'react'\n\nfunction Parent({ items, query }: Props) {\n  const filtered = useMemo(\n    () => items.filter(i => i.matches(query)),\n    [items, query]\n  )\n  const onClick = useCallback((id: string) => {\n    doSomething(id)\n  }, [])\n\n  return <MemoChild items={filtered} onClick={onClick} />\n}\n\nconst MemoChild = memo(function Child({ items, onClick }) {\n  return ...\n})\n\n// React Compiler 適用後 (自動メモ化)\nfunction Parent({ items, query }: Props) {\n  const filtered = items.filter(i => i.matches(query))    // ← 自動でメモ化\n  const onClick = (id: string) => { doSomething(id) }      // ← 自動で安定化\n\n  return <Child items={filtered} onClick={onClick} />\n}\n\nfunction Child({ items, onClick }) {                       // ← 自動で memo\n  return ...\n}\n\n// 導入\n# Babel\nnpm install -D babel-plugin-react-compiler\n# .babelrc\n{ \"plugins\": [\"babel-plugin-react-compiler\"] }\n\n# Next.js (実験的)\n# next.config.js\nmodule.exports = {\n  experimental: { reactCompiler: true }\n}\n\n# eslint-plugin で非互換コード検出\nnpm install -D eslint-plugin-react-compiler\n# .eslintrc\n{ \"plugins\": [\"react-compiler\"], \"rules\": { \"react-compiler/react-compiler\": \"error\" } }",
    },
  },

  // ===========================================================================
  // 🐍 Python 拡張 (py-021 〜 py-030)
  // ===========================================================================
  {
    id: "py-021",
    categoryId: "python-basics",
    difficulty: "intermediate",
    type: "choice",
    question:
      "Python 3.10+ で導入された『パターンマッチ』の構文は？",
    choices: [
      "select / case",
      "match / case (構造的パターンマッチ)",
      "switch / case",
      "matches / when",
    ],
    answerIndex: 1,
    hints: [
      "case は値の比較だけでなく、構造の分解 + ガード式が可能。",
      "Ruby の case/in や Rust / Elixir のパターンマッチに近い。",
      "リスト / 辞書 / クラスのパターンに対応。",
    ],
    explanation: {
      summary:
        "Python 3.10+ で `match` / `case` (構造的パターンマッチ) が導入。値の比較だけでなく、リスト / 辞書 / dataclass の分解 + ガード式 + ワイルドカードに対応。",
      reason:
        "従来の if/elif の連鎖を読みやすく書ける。Discriminated Union 的なデータ構造の処理に最適。`_` でデフォルト、`|` で or、`as` で部分束縛。`if guard` で追加条件。class パターンは `Class(attr=value)` の形でデストラクチャ可。",
      codeExample:
        "# 基本: 値の比較\ndef handle(status: int) -> str:\n    match status:\n        case 200 | 201 | 204:\n            return 'success'\n        case 301 | 302:\n            return 'redirect'\n        case 400 | 401 | 403 | 404:\n            return 'client error'\n        case 500:\n            return 'server error'\n        case _:\n            return 'unknown'\n\n# リストの分解\ndef parse_command(cmd: list[str]) -> str:\n    match cmd:\n        case []:\n            return 'empty'\n        case [single]:\n            return f'single: {single}'\n        case [first, *rest]:\n            return f'first={first}, rest={rest}'\n        case ['quit', *_]:\n            return 'quitting'\n\n# 辞書の分解 + ガード\ndef handle_event(event: dict):\n    match event:\n        case {'type': 'click', 'x': x, 'y': y}:\n            return f'clicked at ({x}, {y})'\n        case {'type': 'key', 'key': key} if key.isalpha():\n            return f'letter: {key}'\n        case {'type': 'key', 'key': key}:\n            return f'other key: {key}'\n        case _:\n            return 'unknown event'\n\n# class パターン (dataclass と相性 ◎)\nfrom dataclasses import dataclass\n\n@dataclass\nclass Point:\n    x: float\n    y: float\n\n@dataclass\nclass Circle:\n    center: Point\n    radius: float\n\ndef describe(shape):\n    match shape:\n        case Point(x=0, y=0):\n            return 'origin'\n        case Point(x=x, y=0):\n            return f'on x-axis at {x}'\n        case Point(x=0, y=y):\n            return f'on y-axis at {y}'\n        case Circle(center=Point(0, 0), radius=r):\n            return f'circle at origin, r={r}'\n        case Circle(center=c, radius=r) if r > 100:\n            return f'large circle at {c}'\n        case _:\n            return 'other'",
    },
  },
  {
    id: "py-022",
    categoryId: "python-basics",
    difficulty: "intermediate",
    type: "choice",
    question:
      "Python 3.8+ で導入された『代入式』(変数代入を式として使える) 演算子は？",
    choices: [
      ":= (walrus operator)",
      "->",
      "<-",
      "::=",
    ],
    answerIndex: 0,
    hints: [
      "セイウチに見える形から walrus と呼ばれる。",
      "while や if の条件式の中で代入と評価を同時に行える。",
      "List/dict 内包表記でも便利 (計算結果を再利用)。",
    ],
    explanation: {
      summary:
        "`:=` (walrus) は代入式。`while (chunk := file.read(1024))` のように『代入 + その値を式として使う』。条件式・内包表記の中で計算結果を再利用するのに便利。",
      reason:
        "従来の Python は『代入は文 = 値を返さない』が原則 → ループ前に変数を初期化 + ループ内で再代入の冗長コードに。walrus で 1 行に。多用すると可読性が落ちるので、本当に役立つ箇所だけに。",
      codeExample:
        "# 従来\nchunk = file.read(1024)\nwhile chunk:\n    process(chunk)\n    chunk = file.read(1024)\n\n# walrus\nwhile chunk := file.read(1024):\n    process(chunk)\n\n# if + 一時変数\nif (n := len(my_list)) > 10:\n    print(f'list too long ({n} items)')\n\n# 内包表記で計算結果を再利用 (重い処理の重複を避ける)\n[result for x in data if (result := process(x)) is not None]\n# vs (従来)\n[process(x) for x in data if process(x) is not None]   # process が 2 回呼ばれる\n\n# 正規表現マッチを if と本文で使い回す\nimport re\nif match := re.search(r'(\\d+)', text):\n    print(f'found: {match.group(1)}')\n\n# 注意: トップレベル代入には使えない\nx := 5                    # SyntaxError\n(x := 5)                  # OK (括弧で囲む)\n\n# 関数引数で使うと混乱する\nfunc(x := 5)              # OK だが読みにくい",
    },
  },
  {
    id: "py-023",
    categoryId: "python-basics",
    difficulty: "intermediate",
    type: "choice",
    question:
      "Python の型ヒントで『None も許容する』を表現する最も簡潔な書き方は？(Python 3.10+)",
    choices: [
      "T | None (PEP 604、3.10+)",
      "Optional[T] (typing から、3.5+)",
      "Union[T, None]",
      "両方 (上の 3 つすべて等価)",
    ],
    answerIndex: 3,
    hints: [
      "Python 3.10+ で `|` がそのまま union として書ける。",
      "Optional[T] は typing から import 必要、Union[T, None] のエイリアス。",
      "3 つとも意味は同じ、可読性は `T | None` が最良。",
    ],
    explanation: {
      summary:
        "Python 3.10+ では `T | None` (PEP 604) が最も簡潔。`Optional[T]` と `Union[T, None]` は同等で、どれも『T または None』を意味する。新規コードは `|` 記法を推奨。",
      reason:
        "Python の型ヒントは PEP 484 (3.5+) で導入 → typing.Optional / Union → PEP 604 (3.10+) で `|` がそのまま使える。`list[int]` / `dict[str, int]` も 3.9+ で組み込み型から書ける (typing.List / Dict 不要)。型ヒントは runtime には影響なし、mypy / pyright で静的解析。",
      codeExample:
        "# Python 3.10+ (推奨)\ndef find(id: int) -> User | None: ...\n\ndef parse(input: str | bytes) -> dict[str, int] | None: ...\n\n# Python 3.9 以下\nfrom typing import Optional, Union, List, Dict\n\ndef find(id: int) -> Optional[User]: ...\ndef parse(input: Union[str, bytes]) -> Optional[Dict[str, int]]: ...\n\n# typing の Generic コンテナ (3.9+ では組み込みも使える)\ndef sum_all(nums: list[int]) -> int: ...                # 3.9+\ndef sum_all(nums: List[int]) -> int: ...                # 全バージョン\n\n# 複雑な型\nfrom typing import Callable, Iterable, TypedDict\n\nCallback = Callable[[int, str], bool]                   # (int, str) -> bool\nNames = Iterable[str]                                    # 反復可能な文字列\n\nclass User(TypedDict):                                   # dict の型付け\n    id: int\n    name: str\n    email: str | None\n\n# Protocol (構造的部分型、Duck Typing の型版)\nfrom typing import Protocol\n\nclass HasLength(Protocol):\n    def __len__(self) -> int: ...\n\ndef show_size(x: HasLength) -> None:\n    print(len(x))                                        # __len__ があれば何でも",
    },
  },
  {
    id: "py-024",
    categoryId: "python-basics",
    difficulty: "intermediate",
    type: "choice",
    question:
      "Python の `with` 文と一緒に使う『コンテキストマネージャ』を関数として簡単に作るデコレータは？",
    choices: [
      "@enter",
      "@resource",
      "@contextmanager (from contextlib)",
      "@with_block",
    ],
    answerIndex: 2,
    hints: [
      "通常は __enter__ / __exit__ を持つクラスを書く。",
      "@contextmanager + yield で簡単に。",
      "yield の前が __enter__、後が __exit__ に相当。",
    ],
    explanation: {
      summary:
        "`@contextmanager` (`from contextlib import contextmanager`) は関数を context manager に変える。`yield` の前が enter、後が exit (cleanup) に相当。クラス実装より圧倒的に簡潔。",
      reason:
        "クラスで `__enter__` / `__exit__` を書くより簡潔。`yield` の値を `with ... as x:` で受け取る。例外も `try / except / finally` で扱える。`contextlib` には他にも `suppress`、`closing`、`ExitStack`、`redirect_stdout` 等の便利ツール。",
      codeExample:
        "from contextlib import contextmanager\nfrom time import perf_counter\n\n# 基本: タイマー\n@contextmanager\ndef timer(name: str):\n    start = perf_counter()\n    try:\n        yield                          # ← ここで with ブロックの本体が走る\n    finally:\n        elapsed = perf_counter() - start\n        print(f'{name}: {elapsed:.3f}s')\n\nwith timer('heavy_work'):\n    do_heavy_work()\n\n# 値を返す\n@contextmanager\ndef temp_file(content: str):\n    import tempfile, os\n    f = tempfile.NamedTemporaryFile(mode='w', delete=False)\n    try:\n        f.write(content)\n        f.close()\n        yield f.name                   # ← パスを返す\n    finally:\n        os.unlink(f.name)\n\nwith temp_file('data') as path:\n    print(f'tempfile at {path}')\n# ブロック抜けで自動削除\n\n# 例外処理\n@contextmanager\ndef transaction(db):\n    db.begin()\n    try:\n        yield db\n        db.commit()\n    except:\n        db.rollback()\n        raise\n\nwith transaction(db) as db:\n    db.execute('UPDATE users SET active = true')\n    # 例外で rollback、成功で commit\n\n# contextlib のその他便利ツール\nfrom contextlib import suppress, closing, ExitStack\n\nwith suppress(FileNotFoundError):       # 例外を握りつぶす\n    os.remove('maybe_exists.tmp')\n\nwith closing(urlopen('http://...')) as response:   # close() を持つオブジェクトに with を付与\n    data = response.read()\n\nwith ExitStack() as stack:               # 複数の with を動的に\n    files = [stack.enter_context(open(p)) for p in paths]\n    # ブロック抜けで全 close",
    },
  },
  {
    id: "py-025",
    categoryId: "python-basics",
    difficulty: "intermediate",
    type: "choice",
    question:
      "Python の pathlib (PosixPath / WindowsPath) の利点として正しいのは？",
    choices: [
      "OS 依存",
      "オブジェクト指向 + OS 非依存 / / 演算子で結合 / 多くのファイル操作メソッド (read_text / write_text / exists 等)",
      "os.path より遅い",
      "Python 2 専用",
    ],
    answerIndex: 1,
    hints: [
      "pathlib.Path('foo') / 'bar' で結合 (string concat より安全)。",
      "Path.exists() / read_text() / write_text() / iterdir() などメソッドが豊富。",
      "Python 3.4+ で導入、現代の標準。",
    ],
    explanation: {
      summary:
        "`pathlib` は Path オブジェクトとして OS 非依存にパスを扱う。`/` 演算子で結合、`read_text()` / `write_text()` / `exists()` / `glob()` などメソッドが豊富。`os.path` より読みやすい。",
      reason:
        "従来の `os.path.join` / `os.path.exists` / `open + read` を 1 つのインターフェースに統一。クロスプラットフォーム対応 (Windows / POSIX を Path 内部で自動切替)。`Path('config') / 'settings.yml'` のような直感的な結合、`p.parent` / `p.name` / `p.suffix` / `p.stem` でパス分解。Python 3.4+ 標準。",
      codeExample:
        "from pathlib import Path\n\n# 結合\np = Path('config') / 'settings.yml'\nprint(p)                          # config/settings.yml (POSIX) or config\\settings.yml (Win)\nprint(p.absolute())                # フルパス\nprint(p.resolve())                 # シンボリックリンク解決\n\n# 分解\np = Path('/var/log/nginx/access.log.2024-01-01')\np.parent                          # PosixPath('/var/log/nginx')\np.name                            # 'access.log.2024-01-01'\np.stem                            # 'access.log.2024-01-01' (拡張子なし)\np.suffix                          # '' (この場合)\np.suffixes                        # ['.log', '.2024-01-01']\np.parts                           # ('/', 'var', 'log', 'nginx', '...')\n\n# 存在 / 種類\np.exists()                        # True / False\np.is_file()\np.is_dir()\np.is_symlink()\n\n# 読み書き (バイト or テキスト)\nPath('data.txt').write_text('hello', encoding='utf-8')\ncontent = Path('data.txt').read_text(encoding='utf-8')\nbinary = Path('image.png').read_bytes()\nPath('out.bin').write_bytes(b'\\x00\\x01\\x02')\n\n# ディレクトリ操作\np = Path('myproject')\np.mkdir(exist_ok=True, parents=True)   # mkdir -p\nfor child in p.iterdir():\n    print(child)\nfor py_file in p.glob('**/*.py'):      # 再帰 glob\n    print(py_file)\n\n# 削除\np.unlink()                         # ファイル削除\np.rmdir()                          # 空ディレクトリ削除\nshutil.rmtree(p)                   # 再帰削除\n\n# 比較演算子も使える\nPath('a.txt') == Path('a.txt')     # True\nPath('a') < Path('b')               # True (辞書順)",
    },
  },
  {
    id: "py-026",
    categoryId: "python-basics",
    difficulty: "intermediate",
    type: "choice",
    question:
      "asyncio で『複数の非同期処理を並列実行して全結果を待つ』関数は？",
    choices: [
      "asyncio.gather(*coros) / asyncio.TaskGroup (3.11+)",
      "asyncio.wait",
      "asyncio.parallel",
      "asyncio.all",
    ],
    answerIndex: 0,
    hints: [
      "並列実行 + 全結果回収には gather が定番。",
      "Python 3.11+ では TaskGroup が安全な代替 (例外伝播が改善)。",
      "await keyword で結果を取り出す。",
    ],
    explanation: {
      summary:
        "`asyncio.gather(*coros)` で複数の coroutine を並列実行 + 結果を順序通りに取得。3.11+ の `asyncio.TaskGroup` はより構造化された代替 (例外時に全タスクをクリーンに cancel)。",
      reason:
        "Python の asyncio は単一スレッドで I/O 待機中に他のタスクを実行する仕組み。CPU バウンドには無効 (multiprocessing を)。`gather` は 1 つの失敗で他がそのまま走り続けることがある (return_exceptions=True で例外も結果に)。TaskGroup (3.11+) は例外発生時に他を cancel する『構造化並行性』。",
      codeExample:
        "import asyncio\nimport aiohttp\n\nasync def fetch(session, url):\n    async with session.get(url) as r:\n        return await r.json()\n\n# gather (並列実行)\nasync def main():\n    async with aiohttp.ClientSession() as session:\n        results = await asyncio.gather(\n            fetch(session, 'https://api.example.com/users'),\n            fetch(session, 'https://api.example.com/posts'),\n            fetch(session, 'https://api.example.com/comments'),\n        )\n        users, posts, comments = results\n        return users, posts, comments\n\nasyncio.run(main())\n\n# return_exceptions=True (1 つ失敗でも全部取る)\nresults = await asyncio.gather(*tasks, return_exceptions=True)\nfor r in results:\n    if isinstance(r, Exception):\n        print(f'failed: {r}')\n    else:\n        print(f'ok: {r}')\n\n# TaskGroup (3.11+、構造化並行性、推奨)\nasync def main():\n    async with asyncio.TaskGroup() as tg:\n        t1 = tg.create_task(fetch(session, url1))\n        t2 = tg.create_task(fetch(session, url2))\n        t3 = tg.create_task(fetch(session, url3))\n    # ブロック抜けで全タスク完了、1 つ失敗で他を自動 cancel\n    print(t1.result(), t2.result(), t3.result())\n\n# wait_for (timeout)\nresult = await asyncio.wait_for(fetch(session, url), timeout=5.0)\n\n# 順次 await (waterfall、遅い、避ける)\nusers = await fetch(session, url1)\nposts = await fetch(session, url2)         # users を待ってから\n# → 順次なので 2 つの I/O が直列、gather で並列化すれば速い\n\n# 同期コードと混在 (CPU バウンド)\nimport concurrent.futures\nasync def heavy_work():\n    loop = asyncio.get_event_loop()\n    with concurrent.futures.ThreadPoolExecutor() as pool:\n        result = await loop.run_in_executor(pool, blocking_function)\n    return result",
    },
  },
  {
    id: "py-027",
    categoryId: "python-basics",
    difficulty: "intermediate",
    type: "choice",
    question:
      "f-string で『数値を 3 桁区切り + 小数点 2 桁』にする書式指定は？",
    choices: [
      "f'{n:#,.2}'",
      "f'{n:%.2f,}'",
      "f'{n:,.2f}'",
      "f'{n:000.2}'",
    ],
    answerIndex: 2,
    hints: [
      ", でカンマ区切り、.Nf で小数点 N 桁。",
      "順序は『種別 + パディング + カンマ + 精度 + 型』。",
      "Python 3.6+ の f-string + format spec mini-language。",
    ],
    explanation: {
      summary:
        "f-string の書式: `f'{value:<spec>}'`。`,` でカンマ区切り、`.Nf` で小数点 N 桁、`>N` / `<N` / `^N` で右寄せ / 左寄せ / 中央、`0N` でゼロパディング、`%` でパーセント、`e` で指数表記。",
      reason:
        "format spec mini-language は強力。`{var=}` で名前付きデバッグ (Python 3.8+)、`{var!r}` で repr、`{var!s}` で str。日付は `{dt:%Y-%m-%d}` で strftime 風に直接書ける。i18n の数値表記は babel ライブラリで。",
      codeExample:
        "n = 1234567.891\n\nf'{n:,.2f}'                    # '1,234,567.89'\nf'{n:.2e}'                     # '1.23e+06'\nf'{n:.0%}'                     # '12345.68%' ※ パーセントは元の値 *100\nf'{n:.2%}'                     # n が 0.85 なら '85.00%'\nf'{n:>15,.2f}'                 # '   1,234,567.89' (右寄せ 15 桁)\nf'{n:<15,.2f}'                 # '1,234,567.89   ' (左寄せ)\nf'{n:0>15,.2f}'                # '0001,234,567.89' (0 パディング)\n\n# 整数\nx = 42\nf'{x:04d}'                     # '0042'\nf'{x:#x}'                      # '0x2a' (16 進数)\nf'{x:b}'                       # '101010' (2 進数)\nf'{x:o}'                       # '52' (8 進数)\n\n# 文字列\nname = 'Alice'\nf'{name:>10}'                  # '     Alice'\nf'{name:^10}'                  # '  Alice   '\nf'{name:-^10}'                 # '--Alice---'\n\n# 名前付きデバッグ (3.8+)\nf'{name=}'                     # \"name='Alice'\"\nf'{n=:.2f}'                    # 'n=1234567.89'\n\n# 日付 (datetime)\nfrom datetime import datetime\nnow = datetime.now()\nf'{now:%Y-%m-%d %H:%M:%S}'    # '2026-01-01 12:34:56'\nf'{now:%a %B}'                 # 'Wed January'\n\n# repr / str\nf'{name!r}'                    # \"'Alice'\" (repr)\nf'{name!s}'                    # 'Alice' (str)\nf'{name!a}'                    # ASCII safe\n\n# 動的な書式 (ネスト)\nwidth = 10\nf'{name:>{width}}'             # 動的な幅指定",
    },
  },
  {
    id: "py-028",
    categoryId: "python-basics",
    difficulty: "advanced",
    type: "choice",
    question:
      "Python で型ヒント付きのジェネリック関数を書く時、TypeVar の代わりに使える新しい構文 (3.12+) は？",
    choices: [
      "T = TypeVar('T') しか方法はない",
      "def first[T](items: list[T]) -> T: ... (PEP 695 type parameter syntax)",
      "def first<T>(items: list<T>) -> T:",
      "def first[T:](items)",
    ],
    answerIndex: 1,
    hints: [
      "Python 3.12+ で導入された PEP 695。",
      "TypeScript の <T> に近い構文。",
      "TypeVar を import しなくて済む。",
    ],
    explanation: {
      summary:
        "Python 3.12+ (PEP 695) で関数 / クラスに `[T]` 構文でジェネリクスを直接書ける。`def first[T](items: list[T]) -> T:`。従来の `TypeVar` import が不要に。",
      reason:
        "TypeScript / Java / Kotlin に近い構文で記述が短い。`class Stack[T]:` でジェネリッククラス。`type Alias[T] = list[T]` でジェネリック型エイリアス。境界は `def f[T: int]` で `T extends int`、`T: (int, str)` で union 制約。古いコードベースは TypeVar、新規は PEP 695 が推奨。",
      codeExample:
        "# Python 3.12+ (PEP 695)\ndef first[T](items: list[T]) -> T | None:\n    return items[0] if items else None\n\nfirst([1, 2, 3])         # T = int\nfirst(['a', 'b'])         # T = str\n\n# 境界 (constraint)\ndef longest[T: (str, list)](a: T, b: T) -> T:\n    return a if len(a) >= len(b) else b\n# T は str か list のみ\n\n# 上界 (bound)\nfrom typing import SupportsAbs\ndef nearest_zero[T: SupportsAbs](items: list[T]) -> T:\n    return min(items, key=abs)\n\n# クラス\nclass Stack[T]:\n    def __init__(self) -> None:\n        self._items: list[T] = []\n    def push(self, item: T) -> None:\n        self._items.append(item)\n    def pop(self) -> T:\n        return self._items.pop()\n\nstack: Stack[int] = Stack()\nstack.push(1)\nstack.push(2)\nn: int = stack.pop()\n\n# Type alias\ntype Vector[T] = list[T]\ntype Maybe[T] = T | None\ntype Result[T, E] = T | Exception\n\n# 従来 (3.11 以下)\nfrom typing import TypeVar, Generic\n\nT = TypeVar('T')\n\ndef first(items: list[T]) -> T | None:\n    return items[0] if items else None\n\nclass Stack(Generic[T]):\n    def __init__(self) -> None:\n        self._items: list[T] = []",
    },
  },
  {
    id: "py-029",
    categoryId: "python-basics",
    difficulty: "advanced",
    type: "choice",
    question:
      "Python で『関数の前回呼び出し結果を覚えておく』(メモ化) 最も簡単な方法は？",
    choices: [
      "@functools.lru_cache / @functools.cache (3.9+)",
      "global 変数で dict 管理",
      "メモ化不可",
      "外部 DB",
    ],
    answerIndex: 0,
    hints: [
      "functools の標準デコレータ。",
      "lru_cache(maxsize=128) でサイズ制限、cache はサイズ無制限。",
      "純粋関数 (副作用なし) にのみ使う。",
    ],
    explanation: {
      summary:
        "`@functools.lru_cache(maxsize=N)` (LRU 方式)、`@functools.cache` (3.9+、サイズ無制限) でメモ化。引数 hash で結果をキャッシュ → 同じ引数の再呼び出しはキャッシュから即座に返る。",
      reason:
        "再帰の Fibonacci / DP / 重い計算で効果絶大。注意: 引数は hashable 必須 (list は ng、tuple ok)。副作用のある関数には使わない (キャッシュで実行スキップされる)。`cache_info()` でヒット率確認、`cache_clear()` でクリア。クラスメソッドのキャッシュは `functools.cached_property` (read-only) を。",
      codeExample:
        "from functools import lru_cache, cache, cached_property\n\n# 1. lru_cache (サイズ制限あり)\n@lru_cache(maxsize=128)\ndef fib(n: int) -> int:\n    return n if n < 2 else fib(n-1) + fib(n-2)\n\nfib(100)                      # 一瞬\nfib.cache_info()              # CacheInfo(hits=98, misses=101, maxsize=128, currsize=101)\nfib.cache_clear()             # クリア\n\n# 2. cache (サイズ無制限、3.9+)\n@cache\ndef factorial(n: int) -> int:\n    return 1 if n == 0 else n * factorial(n - 1)\n\n# 3. cached_property (クラスのインスタンスメソッド版)\nclass Article:\n    def __init__(self, body: str):\n        self.body = body\n\n    @cached_property\n    def word_count(self) -> int:\n        # 初回呼び出し時にだけ計算、以降はキャッシュ\n        return len(self.body.split())\n\na = Article('Hello world')\na.word_count                  # 計算\na.word_count                  # キャッシュから即座\n\n# 注意: 副作用ありの関数には NG\n@cache\ndef get_data(id: int):\n    return database.fetch(id)   # ❌ DB が変わってもキャッシュから返る\n\n# 引数が hashable 必須\n@cache\ndef foo(x):\n    return x * 2\n\nfoo([1, 2, 3])                 # ❌ TypeError: unhashable type: 'list'\nfoo((1, 2, 3))                 # ✅ OK (tuple)\n\n# 部分的にキャッシュ (引数が多い)\n@cache\ndef calculate(x: int, y: int, *, debug: bool = False):\n    # debug が True/False どちらもキャッシュされる\n    return x + y\n\n# 外部キャッシュ (Redis 等)\n# functools.cache はプロセスローカル → 複数プロセスで共有したいなら別途\n# - redis-py で SET/GET\n# - cachetools ライブラリ\n# - Django の cache framework",
    },
  },
  {
    id: "py-030",
    categoryId: "python-basics",
    difficulty: "intermediate",
    type: "choice",
    question:
      "Python で『最頻出する要素 Top N を取得』する標準ライブラリは？",
    choices: [
      "set + sort",
      "dict + sorted",
      "標準ライブラリにはない",
      "collections.Counter + most_common(N)",
    ],
    answerIndex: 3,
    hints: [
      "Counter は dict のサブクラスで、要素の出現回数を数える。",
      "most_common(N) で頻度降順の Top N。",
      "テキスト分析 / ログ集計 / ヒストグラムで頻用。",
    ],
    explanation: {
      summary:
        "`collections.Counter` は出現回数を数える dict サブクラス。`Counter(iterable).most_common(N)` で頻度降順 Top N を 1 行で取得。",
      reason:
        "テキストの単語頻度、ログのエラータイプ集計、ヒストグラム生成などで定番。`+` / `-` / `&` / `|` の演算子で Counter 同士を合成。`update()` で追加カウント。Pandas の `value_counts()` と同じ感覚で標準ライブラリで使える。",
      codeExample:
        "from collections import Counter\n\n# 単純カウント\nc = Counter('mississippi')\n# Counter({'i': 4, 's': 4, 'p': 2, 'm': 1})\nc.most_common(2)              # [('i', 4), ('s', 4)]\nc.most_common()                # 全部 (降順)\n\n# リスト\nwords = ['apple', 'banana', 'apple', 'cherry', 'apple', 'banana']\nCounter(words).most_common(3)\n# [('apple', 3), ('banana', 2), ('cherry', 1)]\n\n# ファイル / ログ\nfrom pathlib import Path\nwords = Path('article.txt').read_text().lower().split()\ntop10 = Counter(words).most_common(10)\nfor word, count in top10:\n    print(f'{count:4d}  {word}')\n\n# Counter 同士の演算\na = Counter('hello')\nb = Counter('world')\na + b           # Counter({'l': 3, 'o': 2, 'h': 1, 'e': 1, 'w': 1, 'r': 1, 'd': 1})\na - b           # Counter({'h': 1, 'e': 1, 'l': 2}) — 負数は除外\na & b           # Counter({'l': 1, 'o': 1}) — 最小値\na | b           # Counter({'l': 3, 'o': 2, 'h': 1, ...}) — 最大値\n\n# update / subtract\ncnt = Counter()\ncnt.update(['apple', 'banana'])\ncnt.update({'apple': 2, 'cherry': 1})\ncnt              # Counter({'apple': 3, 'banana': 1, 'cherry': 1})\n\n# total count\nsum(cnt.values())          # 合計件数\n\n# defaultdict との比較\nfrom collections import defaultdict\ngroups = defaultdict(list)\nfor item in items:\n    groups[item.category].append(item)\n# defaultdict は初期化込みでグループ化\n# Counter はカウント特化\n\n# 文字頻度の可視化\nfor char, count in Counter(text).most_common():\n    print(f'{char}: {\"█\" * count}')\n\n# Pandas との対応\n# import pandas as pd\n# pd.Series(words).value_counts().head(10)",
    },
  },
];
