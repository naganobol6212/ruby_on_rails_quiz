import type { Guide } from "./types";

export const gitIntroGuide: Guide = {
    id: "git-intro",
    trackId: "git",
    title: "Git の地図 — 履歴を読む・書く・直す",
    subtitle:
      "Git の 3 エリア → ブランチ/マージ戦略 → リモート → 履歴修正と救出 → 高度操作 → GitHub/PR → GitHub Actions と運用、を 7 章で",
    audience:
      "git add / commit / push しか使えていない人、コンフリクトが怖い人、rebase / cherry-pick / bisect / reflog で困っている人",
    sources: [
      { label: "Pro Git Book (公式・無料・日本語あり)", url: "https://git-scm.com/book/ja/v2" },
      { label: "git-scm リファレンス", url: "https://git-scm.com/docs" },
      { label: "GitHub Docs", url: "https://docs.github.com/" },
    ],
    emoji: "🔧",
    relatedCategoryIds: ["git-github"],
    chapters: [
      {
        id: "git-3-areas-and-basics",
        title: "1. Git の 3 エリア — 作業ツリー / インデックス / リポジトリ",
        intro:
          "Git の心臓部は『3 つのエリア』。作業ツリー (ファイル) → インデックス (ステージ) → リポジトリ (コミット履歴)。これを掴めばあとのコマンドが地続きで理解できる。",
        readingMinutes: 7,
        objectives: [
          "作業ツリー / インデックス (ステージ) / リポジトリの 3 エリアを説明できる",
          "status / diff / diff --cached を読み分けられる",
          "commit / log / show でコミットを読める",
        ],
        sections: [
          {
            heading: "1.1 3 エリアの全体像",
            body: "Git はファイルを 3 つの状態で管理する。**作業ツリー (Working Tree)**: 実際のファイル。**インデックス (Index / Staging Area)**: 次のコミットに含める変更の予約箱。**ローカルリポジトリ**: 過去のコミット履歴 (.git/)。`add` で作業ツリー → インデックス、`commit` でインデックス → リポジトリ。",
            code: "[作業ツリー] -- git add --> [インデックス] -- git commit --> [リポジトリ]\n              <- git restore <-                  <- git reset <-\n\n# 例\necho 'hello' > foo.txt           # 作業ツリーを編集\ngit add foo.txt                   # インデックスに登録\ngit commit -m 'add foo'           # リポジトリへコミット\n\n# 取消の方向\ngit restore foo.txt               # 作業ツリーを最後のコミットに戻す (危険)\ngit restore --staged foo.txt      # インデックスから外す (作業ツリーは保つ)\ngit reset --soft HEAD~1           # 最新コミットを取消 (変更はインデックスに残す)\ngit reset --hard HEAD~1           # 最新コミットを取消 + 作業ツリーも巻き戻し (危険)",
            language: "bash",
            diagram: `flowchart LR
  WT["作業ツリー\\n(Working Tree)"] -- "git add" --> IDX["インデックス\\n(Staging)"]
  IDX -- "git commit" --> REPO["ローカルリポジトリ\\n(.git/)"]
  IDX -- "git restore --staged" --> WT
  REPO -- "git restore" --> WT
  REPO -- "git reset --soft" --> IDX
  REPO -- "git reset --hard" --> WT
  REPO -- "git push" --> REMOTE["リモート\\n(origin)"]
  REMOTE -- "git fetch / pull" --> REPO`,
            diagramCaption: "Git の 3 エリアと主要コマンドの流れ",
            notes: [
              "コミットは git の最小単位 (snapshot + parent + author + message)",
              ".git/ ディレクトリにすべての履歴が保存されている — リポジトリそのもの",
            ],
          },
          {
            heading: "1.2 status と diff を読む",
            body: "`git status` は現在の状態を要約。色付き 3 セクション (staged / not staged / untracked) を読み分ける。`git diff` は『インデックスに対する作業ツリーの差分』(まだ add してない変更)、`git diff --cached` は『最後のコミットに対するインデックスの差分』(add 済み未コミット)。",
            code: "$ git status\nOn branch main\nChanges to be committed:               <- add 済み (インデックス)\n  modified:   app/models/user.rb\nChanges not staged for commit:         <- まだ add していない\n  modified:   app/models/post.rb\nUntracked files:                       <- Git が追跡していない (.gitignore 候補)\n  config/secrets.yml\n\n# 差分の見方\ngit diff                          # 作業ツリー vs インデックス (まだ add していない)\ngit diff --cached                 # インデックス vs HEAD (add 済み未コミット)\ngit diff HEAD                     # 作業ツリー vs HEAD (両方の和)\ngit diff main..feature            # ブランチ間\ngit diff --stat                   # ファイル単位の追加/削除行サマリ\ngit diff -- app/                  # パス指定 (-- は曖昧さ解消)",
            language: "bash",
            notes: [
              ".gitignore で追跡したくないファイル (build 成果物 / .env / log) をパターン指定",
              "git diff の出力は `diff -u` と同じ unified diff 形式 (10 章 SQL ガイドにも同じ仕組み)",
            ],
          },
          {
            heading: "1.3 log と show — 履歴を読む",
            body: "`git log` で履歴一覧、`git show <SHA>` でそのコミットの詳細 (メッセージ + diff)。1 行表示 / グラフ / 著者・日付フィルタ / パス絞り込み・pickaxe 検索 (`-S`) が頻出。",
            code: "# 基本\ngit log                                    # フル詳細\ngit log --oneline                          # 1 行ずつ\ngit log --oneline --graph --all --decorate # 全ブランチ + グラフ + ラベル\ngit log -5                                  # 最新 5 件\ngit log --since='1 week ago'\ngit log --author='Alice'\ngit log -- app/models/user.rb              # ファイル指定\ngit log -p -- app/models/user.rb           # diff 付き\n\n# コミット詳細\ngit show HEAD                              # 最新コミット\ngit show abc1234                           # 指定 SHA\ngit show HEAD~3                            # 3 つ前\ngit show HEAD:app/models/user.rb           # そのコミット時点のファイル内容\n\n# pickaxe — 文字列が追加 / 削除されたコミットを検索 (8 章で再登場)\ngit log -S 'def calculate_tax'             # 出現回数の変化\ngit log -G 'TODO.*urgent'                   # 正規表現マッチ\n\n# blame — 行ごとに誰がいつ書いたか\ngit blame app/models/user.rb",
            language: "bash",
            notes: [
              "ログのカスタム書式: --pretty=format:'%h %an %s' のように整形できる",
              "fzf と組み合わせて `git log | fzf` でインタラクティブ履歴検索する流派も",
            ],
          },
        ],
        keyTakeaways: [
          "作業ツリー → インデックス → リポジトリ の 3 エリアを意識する",
          "git diff と git diff --cached を読み分ける — それぞれが見る境界が違う",
          "log / show / blame / log -S で履歴を強力に検索できる",
        ],
        comprehensionQuestionIds: ["git-003", "git-008"],
      },
      {
        id: "branches-and-merge-strategies",
        title: "2. ブランチとマージ戦略 — merge / rebase / fast-forward",
        intro:
          "Git の力は分岐と統合。`merge` で履歴を残しつつ統合、`rebase` で履歴を直列化。Fast-forward / merge commit / squash の 3 つを理解する。",
        readingMinutes: 9,
        objectives: [
          "branch / switch でブランチを切る・切り替えできる",
          "merge と rebase の挙動と使い分けを説明できる",
          "fast-forward / non-fast-forward / squash merge の差を読める",
        ],
        sections: [
          {
            heading: "2.1 branch と switch — ブランチ操作の現代スタイル",
            body: "Git 2.23+ から `switch` / `restore` が導入され、`checkout` のオーバーロードが分離された。ブランチ操作は **switch** が新しい標準。新ブランチ作成は `switch -c`、削除は `branch -d` (マージ済) / `-D` (強制)、リネームは `branch -m`。",
            code: "# 一覧\ngit branch                   # ローカル\ngit branch -a                 # リモート含む\ngit branch -vv                # 各ブランチの追跡先と最新 commit\n\n# 切替 (現代スタイル)\ngit switch main\ngit switch -c feature/login   # 作成 + 切替\ngit switch -c feature/x origin/feature/x   # リモート追跡で作成\n\n# 古典 (今でも使える)\ngit checkout main\ngit checkout -b feature/login\n\n# 削除\ngit branch -d feature/done    # マージ済み — 安全\ngit branch -D feature/done    # 強制 (未マージでも削除)\n\n# リネーム\ngit branch -m old-name new-name\ngit push origin :old-name new-name           # リモートも追従",
            language: "bash",
            notes: [
              "switch はブランチ専用、restore はファイル復元専用 — 役割が明確",
              "main / master 命名は GitHub 等のデフォルトを使う (チームで統一)",
            ],
          },
          {
            heading: "2.2 merge — 履歴を保持して統合",
            body: "`git merge feature` で『現在のブランチ』に feature を取り込む。先に進んでいなければ **fast-forward** (新コミットなし、ポインタを動かすだけ)、両方が分岐していれば **merge commit** が作られる (2 親の特別なコミット)。`--no-ff` で意図的に merge commit を残す流派もある。",
            code: "git switch main\ngit merge feature                   # 取り込み\n# Fast-forward → main のポインタが feature の先端へ移動 (新コミットなし)\n\n# 分岐している場合は merge commit が作られる\n# main:    A -- B -- C\n# feature:      \\\n#                D -- E\n# merge 後:\n# main:    A -- B -- C --------- M (parents: C, E)\n#                \\              /\n#                 D -- E -------\n\n# --no-ff で必ず merge commit を残す (PR の塊が見える)\ngit merge --no-ff feature\n\n# --squash で『1 コミットに圧縮』して取り込む (履歴がリニア + feature の細かい履歴は消える)\ngit merge --squash feature\ngit commit -m 'feat: login flow'\n\n# やめる\ngit merge --abort",
            language: "bash",
            diagram: `gitGraph
  commit id: "A"
  commit id: "B"
  branch feature
  checkout feature
  commit id: "D"
  commit id: "E"
  checkout main
  commit id: "C"
  merge feature id: "M"`,
            diagramCaption: "merge commit (M) によって両方の履歴が保持される",
            notes: [
              "--ff-only でつけると fast-forward 可能でなければエラーにできる (履歴が綺麗な状態を強制)",
              "GitHub の『Merge pull request』『Squash and merge』『Rebase and merge』は内部的にこれらを実行",
            ],
          },
          {
            heading: "2.3 rebase — 履歴を積み直して直列化",
            body: "`git rebase main` は『自分のコミットを main の先端に積み直す』。履歴がリニアになり、merge commit が無くなる。**共有ブランチに対する rebase は禁忌** (履歴が書き換わるので、他人が pull したものと整合性が壊れる)。個人 feature ブランチで使うのが鉄則。",
            code: "git switch feature\ngit rebase main                     # feature の commit を main の先端に積み直し\n\n# 図解\n# main:    A -- B -- C\n# feature:      \\\n#                D -- E\n# rebase 後:\n# main:    A -- B -- C\n# feature:           \\\n#                     D' -- E'    (新しい SHA、内容は同じ)\n\n# コンフリクト発生時\n# (1) ファイル編集で <<<<< ======= >>>>> を解決\n# (2) git add <file>\n# (3) git rebase --continue\ngit rebase --abort                  # やめる\ngit rebase --skip                   # この commit を捨てる\n\n# 上流ブランチに追随する一般的な流れ\ngit switch feature\ngit fetch origin\ngit rebase origin/main              # 最新の main を取り込んで feature を更新\ngit push --force-with-lease         # 個人ブランチなら OK",
            language: "bash",
            diagram: `gitGraph
  commit id: "A"
  commit id: "B"
  commit id: "C"
  branch feature
  checkout feature
  commit id: "D'"
  commit id: "E'"`,
            diagramCaption: "rebase 後: feature の commit は main の先端に新 SHA で積み直され、merge commit なしのリニア履歴に",
            notes: [
              "force push は --force でなく --force-with-lease を使う — 他人の commit を上書きしない",
              "PR レビュー中の feature ブランチで rebase + force-with-lease する流派は一般的",
            ],
          },
          {
            heading: "2.4 merge vs rebase — どっちを使うか",
            body: "**チーム / プロジェクトのポリシーで決める**。リニア履歴派 (rebase + squash merge) は GitHub Flow / trunk-based 派、履歴保持派 (merge --no-ff) は GitFlow 派に多い。判断の指針: 共有ブランチ (main) は履歴を残す or squash で 1 PR = 1 コミットに圧縮、個人 feature は rebase で main に追随。",
            code: "# パターン 1: Squash merge 派 (現代の多くの SaaS で主流)\n# - feature ブランチで自由にコミット\n# - PR を Squash merge で main に 1 コミットに圧縮して取り込む\n# - main の履歴がリニア + コミットメッセージが整う\n\n# パターン 2: Rebase + Merge 派 (リニア + 個別 commit を残す)\n# - feature を main に rebase してから merge --ff-only\n# - main は完全リニア、各コミットも残る\n\n# パターン 3: Merge --no-ff 派 (GitFlow)\n# - feature を main に merge --no-ff で取り込む\n# - merge commit が残り『どこからどこまでが PR』が明確\n\n# GitHub の設定で merge 方法を制限可\n# Settings → General → Pull Requests\n# [x] Allow squash merging  (推奨)\n# [ ] Allow merge commits\n# [ ] Allow rebase merging",
            language: "bash",
            notes: [
              "リポジトリの規約を最初に決める — 途中で変えると履歴が混乱",
              "main の commit メッセージは Conventional Commits (7 章) で揃えると CHANGELOG 生成が楽",
            ],
          },
        ],
        keyTakeaways: [
          "branch / switch / restore — 役割が分離した現代スタイルを使う",
          "merge は履歴保持 (fast-forward or merge commit)、rebase は直列化 (履歴書換)",
          "rebase は個人ブランチ専用 + force push は --force-with-lease",
          "プロジェクトのマージ方針 (Squash / Rebase / Merge --no-ff) を最初に決める",
        ],
        comprehensionQuestionIds: ["git-001"],
      },
      {
        id: "remote-and-collaboration",
        title: "3. リモートとコラボレーション — clone / fetch / pull / push",
        intro:
          "リモートリポジトリ (origin / upstream) と localの関係、fetch と pull の違い、tracking ブランチの仕組みを整理。",
        readingMinutes: 8,
        objectives: [
          "origin と upstream の役割を区別できる",
          "fetch / pull / pull --rebase の違いを説明できる",
          "tracking ブランチと push -u の意味を読める",
        ],
        sections: [
          {
            heading: "3.1 clone と remote の構造",
            body: "`git clone <url>` でリモートを丸ごとコピー (デフォルトの remote 名は **origin**)。フォーク経由なら自分の `origin` + 本家の `upstream` を持つのが一般的。`git remote -v` で確認、`git remote add upstream <url>` で追加。",
            code: "# 通常\ngit clone https://github.com/user/repo.git\n# → ./repo/ ができて origin が設定される\n\n# 確認\ngit remote -v\n# origin  https://github.com/user/repo.git (fetch)\n# origin  https://github.com/user/repo.git (push)\n\n# Fork パターン\ngit clone https://github.com/me/repo.git    # 自分の fork (origin)\ncd repo\ngit remote add upstream https://github.com/original/repo.git\ngit fetch upstream\ngit switch -c feature upstream/main          # 本家の main から派生\n\n# 別名変更 / 削除\ngit remote rename old new\ngit remote remove upstream\n\n# URL 変更\ngit remote set-url origin git@github.com:user/repo.git   # HTTPS → SSH",
            language: "bash",
            notes: [
              "main で SSH を使うと token のリフレッシュ不要 (鍵認証) — 開発機の鉄板",
              "HTTPS でも GitHub CLI (gh) や credential helper で token を保存できる",
            ],
          },
          {
            heading: "3.2 fetch / pull / pull --rebase の違い",
            body: "**fetch** はリモートの変更を取得するだけ (ローカルブランチには影響なし)。**pull** = fetch + merge。**pull --rebase** = fetch + rebase。CI / 整理された履歴を保ちたいチームは pull --rebase をデフォルトに設定することが多い。",
            code: "# fetch — リモートの状態を取ってくるだけ\ngit fetch                            # 全リモート\ngit fetch origin                      # origin だけ\ngit fetch origin main                 # 特定ブランチ\n# → origin/main の参照が更新されるが、main 自体は動かない\n\n# pull = fetch + merge\ngit pull origin main\n# → origin/main を取得して main に merge\n\n# pull --rebase = fetch + rebase\ngit pull --rebase origin main\n# → 自分のローカルコミットを origin/main の先端に積み直し (履歴リニア)\n\n# デフォルトを rebase に変える (.gitconfig)\ngit config --global pull.rebase true\n\n# 安全に最新を取り込む流儀\ngit fetch origin                      # まずは fetch だけ\ngit log HEAD..origin/main             # 差分を確認\ngit rebase origin/main                # 納得してから rebase\n# または\ngit merge origin/main",
            language: "bash",
            notes: [
              "『何が来るか分からないのに pull するな』派は fetch + log + merge/rebase を推奨",
              "pull の挙動は default branch ごとに違うのでドキュメント参照",
            ],
          },
          {
            heading: "3.3 push と tracking ブランチ",
            body: "`git push origin feature` でローカルの feature ブランチを送る。初回は `-u` (upstream 設定) を付けると以降 `git push` だけで OK。`--force-with-lease` は強制 push の安全版 (他人の commit を上書きしない)。",
            code: "# 初回 push (tracking 設定)\ngit push -u origin feature/login\n# 以降\ngit push                              # tracking 先 (origin/feature/login) に送る\ngit pull                              # tracking 元 から取る\n\n# 追跡関係の確認\ngit branch -vv\n# * feature/login abc1234 [origin/feature/login] commit msg\n\n# 別名で送る\ngit push origin local-name:remote-name\n\n# 削除\ngit push origin --delete feature/old\n# または\ngit push origin :feature/old\n\n# 強制 push (rebase / amend 後)\ngit push --force                       # ❌ 危険 (他人を上書き)\ngit push --force-with-lease            # ✅ 安全 (リモート未変更時のみ)\ngit push --force-if-includes           # ✅ さらに安全 (自分が最新を取得していることも確認)",
            language: "bash",
            notes: [
              "--force-with-lease をエイリアスにしておくと事故防止: alias gpfl='git push --force-with-lease'",
              "main / master へ force push を禁止するのは Branch Protection Rule (7 章)",
            ],
          },
        ],
        keyTakeaways: [
          "origin = 自分の clone 元、upstream = fork 元 (慣習)",
          "pull = fetch + merge、pull --rebase = fetch + rebase、迷ったら fetch して確認してから合流",
          "push -u で初回 tracking 設定、強制 push は --force-with-lease で安全に",
        ],
        comprehensionQuestionIds: [],
      },
      {
        id: "fixing-and-recovery",
        title: "4. 履歴の修正と救出 — amend / stash / reset / revert / reflog",
        intro:
          "Git は『間違えても救える』ツール。typo 修正 (amend)、WIP 退避 (stash)、巻き戻し (reset / revert)、迷子コミット復旧 (reflog) を整理する。",
        readingMinutes: 9,
        objectives: [
          "amend の安全な使い方 (push 済み禁止) を理解する",
          "reset --soft/--mixed/--hard と revert の違いを説明できる",
          "stash と reflog で『消したつもり』を救える",
        ],
        sections: [
          {
            heading: "4.1 commit --amend — 直前コミットの修正",
            body: "`git commit --amend` で『最後のコミット』を差し替え。メッセージだけ直すケース、忘れたファイルを混ぜるケース、両方に使える。**push 済みのコミットに対しては禁忌** (force push が必要 → 共有ブランチでは事故)。",
            code: "# メッセージだけ修正\ngit commit --amend -m '新しいメッセージ'\ngit commit --amend                     # エディタが開く\n\n# 忘れたファイルを混ぜる (メッセージはそのまま)\ngit add forgotten.rb\ngit commit --amend --no-edit\n\n# 作者を変える (誤って別人で commit した時)\ngit commit --amend --author='Alice <a@x>' --no-edit\n\n# push 済みの場合 (個人ブランチのみ)\ngit push --force-with-lease origin feature/x\n\n# ❌ NG\ngit push --force origin main           # main の amend + force は厳禁",
            language: "bash",
            notes: [
              "amend は『前の commit を捨てて新しい commit に置き換え』 → SHA が変わる",
              "PR 中の自分のブランチで amend → force-with-lease する流派は普通",
            ],
          },
          {
            heading: "4.2 stash — WIP を一時退避",
            body: "急に main の hotfix に切り替えたいが、今の編集を commit したくない時に `git stash`。退避した変更は `pop` (取り出し + 削除) / `apply` (取り出し + 残す) で復元。",
            code: "# 退避\ngit stash                              # 名無し\ngit stash push -m 'WIP: refactor user'\ngit stash -u                            # untracked も含める\ngit stash --keep-index                  # add 済みは残す\n\n# 一覧 / 内容\ngit stash list\n# stash@{0}: On feature/x: WIP: refactor user\n# stash@{1}: WIP on main: ...\ngit stash show stash@{0}                # ファイル一覧\ngit stash show -p stash@{0}             # diff\n\n# 復元\ngit stash pop                           # 最新を取り出し + 削除\ngit stash pop stash@{1}                 # 指定\ngit stash apply stash@{0}               # 取り出し + 残す\n\n# 削除\ngit stash drop stash@{0}\ngit stash clear                          # 全削除\n\n# 別ブランチに変換\ngit stash branch new-feature stash@{0}  # stash を新ブランチに",
            language: "bash",
            notes: [
              "stash は一時的な作業領域 — 数日寝かせると忘れる、ブランチ化が安全",
              "stash の競合解決は merge と同じ — 解決後 add",
            ],
          },
          {
            heading: "4.3 reset と revert — 巻き戻しの 2 流派",
            body: "**reset** は HEAD を動かす (履歴改変)。**revert** は『打ち消しコミット』を作る (履歴保持)。共有ブランチでは revert、個人ブランチで未 push なら reset。`--soft` / `--mixed` (デフォルト) / `--hard` の差は『どこまで影響を与えるか』。",
            code: "# reset の 3 段階\ngit reset --soft HEAD~1               # コミットだけ取消 (変更はインデックスに残る)\ngit reset --mixed HEAD~1              # コミット + インデックス取消 (作業ツリーは残る) — デフォルト\ngit reset --hard HEAD~1               # 全部消す (作業ツリーも巻き戻し、危険)\n\n# 図解\n# HEAD~1 を指す状態に戻す:\n# --soft  : 履歴のみ移動\n# --mixed : 履歴 + インデックスを移動 (作業ツリーは変更前のまま)\n# --hard  : 履歴 + インデックス + 作業ツリーを完全に巻き戻し\n\n# revert — 打ち消しコミットを作る (履歴保持、共有ブランチで安全)\ngit revert abc1234                    # 単発\ngit revert HEAD~3..HEAD                # 範囲 (HEAD~3 は含まない)\ngit revert --no-commit abc1234 def5678 # まとめて 1 コミット (--continue で完了)\n\n# どう使い分ける？\n# 自分の未 push commit → reset で消してもいい\n# 共有 (push 済み) commit → 必ず revert\n# main を 1 個前に戻したい → revert (force push 禁止)",
            language: "bash",
            notes: [
              "reset --hard は作業ツリーも壊れる — 退避していないと完全に消える",
              "reset の取消は reflog から HEAD@{1} を復元 (4.4)",
            ],
          },
          {
            heading: "4.4 reflog — 救出の最後の砦",
            body: "**reflog** は HEAD の移動履歴 (commit / reset / rebase / checkout 等を全部記録)。`git reset --hard` で吹き飛ばしたコミットも 90 日間は救える。Git の『安全網』なので必ず覚える。",
            code: "# 履歴確認\ngit reflog\n# abc1234 HEAD@{0}: reset: moving to HEAD~5\n# def5678 HEAD@{1}: commit: 救いたいコミット\n# ghi9012 HEAD@{2}: rebase finished: returning to refs/heads/feature\n# ...\n\n# 救出 — def5678 を取り戻す\ngit reset --hard def5678\n# または\ngit reset --hard HEAD@{1}\n\n# 削除したブランチを救出\ngit reflog | grep <branch_name>\ngit branch <restored_name> <SHA>\n\n# 完全に dangling (孤立) な commit を探す\ngit fsck --lost-found\n\n# reflog はリモートに反映されない (ローカル専用) — 期限は --expire で延長可\ngit config --global gc.reflogExpire '1.year'",
            language: "bash",
            notes: [
              "reflog は Git の隠れた SSD のようなもの — 知っていれば多くの事故から救える",
              "git gc で古い reflog がパージされる前に救出すること (デフォルト 90 日)",
            ],
          },
        ],
        keyTakeaways: [
          "amend は最後のコミットの差し替え — push 済みなら個人ブランチのみで",
          "stash で WIP 退避、ブランチ切替が安全に",
          "reset (履歴改変) vs revert (打ち消し commit) — 共有 = revert、個人 = reset",
          "reflog は『消した commit の救出ログ』、Git の最後の砦",
        ],
        comprehensionQuestionIds: ["git-002", "git-003", "git-004", "git-005", "git-007", "git-010"],
      },
      {
        id: "advanced-operations",
        title: "5. 高度操作 — cherry-pick / bisect / interactive rebase / worktree",
        intro:
          "歴史を縫う cherry-pick、バグを二分探索する bisect、コミットを編む interactive rebase、複数ブランチを同時に開く worktree。Git の上級ツールを整理。",
        readingMinutes: 10,
        objectives: [
          "cherry-pick で特定コミットを別ブランチへ取り込める",
          "bisect で『どのコミットで壊れたか』を二分探索できる",
          "interactive rebase でコミットを整える (squash / fixup / reorder / drop)",
          "worktree で複数ブランチを同時にチェックアウトできる",
        ],
        sections: [
          {
            heading: "5.1 cherry-pick — 美味しい所どり",
            body: "別ブランチの特定の 1 コミットだけを現在のブランチに取り込む。**hotfix を main と develop の両方に入れたい**、**リリースブランチからの逆輸入**などで頻出。`-x` で『元 commit 情報』をメッセージに残せる。",
            code: "# 1 コミット適用\ngit cherry-pick deadbeef\n\n# 範囲 (deadbeef を含まない deadbeef..feedface)\ngit cherry-pick deadbeef..feedface\n\n# 元コミット情報をメッセージに残す (履歴追跡用)\ngit cherry-pick -x deadbeef\n# → 'cherry picked from commit deadbeef' が footer に\n\n# コンフリクトしたら\n# (1) 編集\n# (2) git add <file>\n# (3) git cherry-pick --continue\ngit cherry-pick --abort                # やめる\ngit cherry-pick --skip                  # この commit をスキップ\n\n# よくあるユースケース: hotfix を main + develop 両方に\ngit switch hotfix/x\n# ... fix ...\ngit commit -m 'fix: 緊急バグ'\nSHA=$(git rev-parse HEAD)\ngit switch main && git cherry-pick $SHA\ngit switch develop && git cherry-pick $SHA",
            language: "bash",
          },
          {
            heading: "5.2 bisect — 二分探索でバグの原因コミット特定",
            body: "『ある時点では動いていたのに、今は壊れている』を二分探索で見つけるツール。`good` (動いていた) と `bad` (壊れた) を指定すると Git が中間 commit を順に提示。100 コミット先でも log2(100) ≈ 7 回で特定。",
            code: "# 開始\ngit bisect start\ngit bisect bad                          # 現在 (壊れている)\ngit bisect good v1.2.0                  # 動いていた版\n\n# Git が中間 commit を checkout する → 動作確認\n# 動く → git bisect good\n# 壊れている → git bisect bad\n# スキップ → git bisect skip (どっちか判断不能)\n\n# ループ → 原因 commit 特定\n# bisect found: deadbeef is the first bad commit\n\n# 終了\ngit bisect reset                         # 元の HEAD に戻る\n\n# 自動化 (テストスクリプトの exit code 0=good, 非0=bad)\ngit bisect start HEAD v1.2.0\ngit bisect run npm test\ngit bisect run rspec spec/regression_spec.rb\ngit bisect run sh -c 'cargo build && cargo test'",
            language: "bash",
            notes: [
              "bisect run はテストが冪等で速いほど威力を発揮する",
              "ビルドが通らない commit は git bisect skip でスキップ",
            ],
          },
          {
            heading: "5.3 interactive rebase — 履歴を編む",
            body: "`git rebase -i HEAD~N` で N 個前までのコミットを編集モードで開く。**pick** (採用)、**reword** (メッセージ書換)、**edit** (一時停止して修正)、**squash** (前と統合 + メッセージ編集)、**fixup** (前と統合 + メッセージ捨)、**drop** (削除)、**reorder** (行を入れ替え)。",
            code: "git rebase -i HEAD~5\n\n# エディタが開く\n# pick abc1 first feature\n# pick def2 typo fix\n# pick ghi3 lint\n# pick jkl4 second feature\n# pick mno5 fix for first\n\n# 編集後 (mno5 を abc1 の直後に統合 + ghi3 を捨てる + def2 のメッセージ修正)\n# pick abc1 first feature\n# fixup mno5 fix for first\n# reword def2 typo fix\n# drop ghi3 lint\n# pick jkl4 second feature\n\n# 保存 → エディタ閉じる → 順次適用\n# reword なら次に commit メッセージ編集が開く\n# edit なら『その時点で一時停止』 → ファイル修正後 git rebase --continue\n\n# コンフリクト発生時\ngit add <file>\ngit rebase --continue\ngit rebase --abort                       # やめる\n\n# よくあるパターン: 連続する fixup を 1 つの commit に\ngit commit --fixup abc1234              # fixup! コミットを作成\ngit rebase -i --autosquash HEAD~10      # 自動で fixup を統合",
            language: "bash",
            notes: [
              "interactive rebase は『コミット単位の編集』 — ファイルの追跡履歴 (rename 等) は触れない",
              "機密情報を全履歴から完全削除したいなら git filter-repo (新しい推奨ツール)",
            ],
          },
          {
            heading: "5.4 worktree — 同時に複数ブランチを開く",
            body: "`git worktree add ../path branch` で別ディレクトリに別ブランチをチェックアウトできる。元の作業中ディレクトリはそのまま、別ディレクトリで hotfix 対応 → 終わったら戻る。1 つの .git を共有するので clone より軽い。",
            code: "# 別ディレクトリにブランチを展開\ngit worktree add ../myapp-hotfix hotfix/urgent\ncd ../myapp-hotfix\n# 普通に作業 (元の作業ディレクトリには影響なし)\n\n# 新ブランチで作る (-b)\ngit worktree add -b feature/x ../myapp-feature main\n\n# 一覧\ngit worktree list\n# /home/user/myapp                abc1234 [feature/login]\n# /home/user/myapp-hotfix         def5678 [hotfix/urgent]\n# /home/user/myapp-feature        ghi9012 [feature/x]\n\n# 削除\ngit worktree remove ../myapp-hotfix\ngit worktree prune                      # 削除済み worktree のエントリ整理\n\n# 注意: 同じブランチを 2 つの worktree で開くことはできない",
            language: "bash",
            notes: [
              "feature 作業中に急ぎの hotfix 対応 / 旧バージョンと現バージョンを並べて比較などに",
              "Claude Code のような AI ツールでも worktree で並列作業を分離するのに使う",
            ],
          },
        ],
        keyTakeaways: [
          "cherry-pick で特定コミットだけを別ブランチに移植 (hotfix の二重取込み)",
          "bisect で『どのコミットで壊れたか』を log2(N) 回で特定",
          "interactive rebase + pick/reword/squash/fixup/drop で履歴を整える",
          "worktree で複数ブランチを同時にチェックアウト (stash 不要)",
        ],
        comprehensionQuestionIds: ["git-009", "git-011", "git-012", "git-016"],
      },
      {
        id: "github-and-pull-requests",
        title: "6. GitHub と Pull Request — gh CLI / レビュー / 保護",
        intro:
          "GitHub をブラウザではなく `gh` CLI で操る、PR レビューの実践、main を守る Branch Protection、Conventional Commits でメッセージを整える。",
        readingMinutes: 9,
        objectives: [
          "gh pr create / view / checkout / merge で PR をターミナルだけで回せる",
          "Branch Protection Rule で main を保護できる",
          "Conventional Commits の type / scope / breaking を書ける",
        ],
        sections: [
          {
            heading: "6.1 gh CLI — GitHub をターミナルで",
            body: "`gh` (GitHub CLI) は GitHub 公式 CLI。PR / Issue / Release / Run / repo すべてをターミナルから操作可能。`gh auth login` で初回認証、その後はトークン管理込み。`gh pr create` は対話 (タイトル・本文・base・reviewer) で PR 作成。",
            code: "# 認証\ngh auth login\n\n# PR 作成\ngh pr create                            # 対話的\ngh pr create --base main \\\n  --title 'feat: Add user signup' \\\n  --body  '## Summary...' \\\n  --reviewer alice,bob \\\n  --label bug,priority-high\ngh pr create --draft                    # 下書き\ngh pr create --fill                     # commit メッセージから自動補完\n\n# PR を見る\ngh pr list                              # 一覧 (自分のリポジトリ)\ngh pr view 42                           # ターミナルで\ngh pr view 42 --web                     # ブラウザで開く\ngh pr diff 42                           # 差分\ngh pr checkout 42                       # 同僚の PR をローカルにチェックアウト\n\n# レビュー\ngh pr review --approve\ngh pr review --request-changes -b 'コメント修正お願いします'\ngh pr review --comment -b '質問: ...'\n\n# マージ\ngh pr merge 42 --squash                 # squash merge\ngh pr merge 42 --rebase                 # rebase merge\ngh pr merge 42 --merge --auto           # CI 通過後に自動 merge\n\n# Issue / Release / Run\ngh issue list / create / view\ngh release list / create v1.0.0\ngh run list / view / rerun              # GitHub Actions",
            language: "bash",
            notes: [
              "AI ツール (Claude Code 等) が GitHub と連携する時も gh CLI 経由が多い",
              "alias gpc='gh pr create --fill' のようにエイリアス化すると爆速",
            ],
          },
          {
            heading: "6.2 PR レビューの実践",
            body: "良い PR の単位: **1 PR = 1 論理変更**、200〜400 行以下。レビュー側は (1) 何を達成するか (description)、(2) どう実現したか (diff)、(3) どうテストしたか (test plan) を確認。レビューコメントには suggestion ブロックで code を提案 (GitHub のクリックで apply 可)。",
            code: "# 良い PR description テンプレ (.github/pull_request_template.md)\n## Summary\n- 何を変えたか (1〜3 行)\n- 何のためか (リンク to Issue / RFC)\n\n## Test plan\n- [ ] ユニットテスト追加 (spec/...)\n- [ ] 手動テスト: ローカル + ステージング\n- [ ] スクリーンショット / GIF (UI 変更時)\n\n## Risk / Rollback\n- DB マイグレーション の reversible? Yes\n- feature flag: enabled by default? No → admin/* で ON\n\n# Suggestion ブロック (レビューコメント内で)\n# GitHub UI 上で書く\n```suggestion\nuser.full_name.presence || user.email\n```\n# クリックで apply → 自分の environment で再現せずに修正提案可\n\n# CODEOWNERS で自動レビュー割当\n# .github/CODEOWNERS\n*               @org/eng\n/db/migrate/    @org/dba @org/eng-lead\n/.github/       @org/sre",
            language: "markdown",
            notes: [
              "Conventional Comments (nit: / chore: / praise: ...) で『重要度』を明示する流派もある",
              "PR が大きい時は『先にスキーマ』『次にロジック』『最後にテスト』で 3 つに分けると速い",
            ],
          },
          {
            heading: "6.3 Branch Protection — main を守る",
            body: "`Settings → Branches → Add rule` で main / master を保護。直接 push 禁止 / CI 通過必須 / レビュー N 名必須 / linear history 強制 / 署名 commit 必須 などを組み合わせる。チームに合わせてカスタマイズ。",
            code: "# 推奨設定 (中規模チーム)\nBranch name pattern: main\n\n[x] Require a pull request before merging\n    [x] Require approvals: 1\n    [x] Dismiss stale pull request approvals when new commits are pushed\n    [x] Require review from Code Owners (CODEOWNERS で割当)\n\n[x] Require status checks to pass before merging\n    [x] Require branches to be up to date before merging\n    Required status checks:\n      - CI / test\n      - CI / lint\n      - CI / type-check\n\n[x] Require conversation resolution before merging\n[x] Require signed commits         # GPG / SSH 署名\n[x] Require linear history          # merge commit 禁止 (squash / rebase 強制)\n[ ] Allow force pushes              # OFF\n[ ] Allow deletions                 # OFF\n\nApply to administrators too. — 管理者にも適用 (重要)\n\n# 設定後の挙動\n$ git push origin main\n# remote: error: GH006: Protected branch update failed\n# remote: error: At least 1 approving review is required\n\n# Required check が無いと merge ボタンは灰色のまま",
            language: "bash",
            notes: [
              "Apply to administrators をオフにすると規約が形骸化 — 必ず ON",
              "Bot / Automation だけは bypass できるよう特定の AppId / Team を許可リストに",
            ],
          },
          {
            heading: "6.4 Conventional Commits — メッセージ規約",
            body: "コミットメッセージを `type(scope): subject` の形式に揃える規約。代表的 type: **feat** (新機能 → MINOR)、**fix** (バグ修正 → PATCH)、docs / chore / style / refactor / test / perf / build / ci。`BREAKING CHANGE:` フッターで MAJOR を発火。semantic-release / release-please で CHANGELOG と semver を自動化できる。",
            code: "# 形式: type(scope): subject\n#\n# [optional body]\n#\n# [optional footer(s)]\n\n# 良い例\nfeat(auth): JWT による API 認証を追加\nfix(post): 公開済み投稿の編集で 500 エラーが出るバグを修正\ndocs(readme): デプロイ手順を Vercel 向けに刷新\nrefactor(user): pluck で N+1 を解消\nperf(query): index 追加で /posts を 300ms → 30ms\nchore(deps): bump @types/node to 22.5.0\nci: run rspec in parallel on GH Actions\n\n# Breaking change (MAJOR)\nfeat(api)!: v1 を廃止、v2 のみサポート\n\nBREAKING CHANGE: GET /v1/users は 410 を返す。クライアントは v2 に移行が必要\n\n# 自動化\n# - semantic-release / release-please で CHANGELOG + GitHub Release + npm publish\n# - commitlint で commit メッセージの形式チェック (Husky と組合せ)\n\n# Squash merge の commit title を Conventional に強制\n# GitHub の Repository settings → Pull Requests → Default commit message → Pull request title and description",
            language: "text",
            notes: [
              "scope は機能領域 (auth / billing / user / api) を入れると CHANGELOG が読みやすい",
              "subject は命令形 (現在形)、英語なら大文字始まり、period なしが慣習",
            ],
          },
        ],
        keyTakeaways: [
          "gh CLI で PR / Issue / Run を全部ターミナルから (gh pr create / view / merge)",
          "Branch Protection Rule で main を守る — PR 必須 + CI 通過 + レビュー必須 + linear history",
          "Conventional Commits で type(scope): subject 形式、BREAKING CHANGE で MAJOR",
        ],
        comprehensionQuestionIds: ["git-006", "git-014", "git-015"],
      },
      {
        id: "github-actions-and-workflows",
        title: "7. GitHub Actions と運用 — CI / CD / Secrets",
        intro:
          "GitHub Actions で push / PR / cron / 手動の各トリガーから CI / CD を走らせる。matrix / cache / artifact / secrets / 環境別デプロイの基本を整理。",
        readingMinutes: 9,
        objectives: [
          ".github/workflows/*.yml の最小構成と主要キーワード (on / jobs / steps / uses) を読める",
          "matrix で複数バージョンをテスト、cache でビルドを高速化できる",
          "secrets / environments / OIDC で本番デプロイの基本を理解する",
        ],
        references: [
          { label: "GitHub Actions 公式", url: "https://docs.github.com/ja/actions" },
        ],
        sections: [
          {
            heading: "7.1 ワークフローの最小構成",
            body: "`.github/workflows/<name>.yml` を置くと GitHub Actions が自動検出。**on** でトリガー (push / pull_request / schedule / workflow_dispatch)、**jobs** で並列ジョブ、**steps** で各コマンド。`uses:` で公開 action (例: `actions/checkout@v4`) を取り込む。",
            code: "# .github/workflows/ci.yml\nname: CI\non:\n  push:\n    branches: [main]\n  pull_request:\n  workflow_dispatch:                  # 手動実行 (Actions タブからボタン)\n  schedule:\n    - cron: '0 9 * * 1'                # 月曜 9 時 (UTC)\n\nconcurrency:\n  group: ${{ github.workflow }}-${{ github.ref }}\n  cancel-in-progress: true             # 同じ PR の古い run はキャンセル\n\njobs:\n  test:\n    runs-on: ubuntu-latest\n    services:\n      postgres:\n        image: postgres:16\n        env: { POSTGRES_PASSWORD: postgres }\n        ports: ['5432:5432']\n        options: >-\n          --health-cmd pg_isready\n          --health-interval 10s\n          --health-timeout 5s\n          --health-retries 5\n    steps:\n      - uses: actions/checkout@v4\n      - uses: actions/setup-node@v4\n        with:\n          node-version: '22'\n          cache: 'npm'                 # node_modules キャッシュ\n      - run: npm ci\n      - run: npm run lint\n      - run: npm run test\n      - run: npm run build",
            language: "yaml",
            notes: [
              "concurrency + cancel-in-progress で『PR を連続 push した時の古い run を自動キャンセル』",
              "services でテスト用 DB / Redis を Docker で立ち上げ",
            ],
          },
          {
            heading: "7.2 matrix で複数バージョン同時テスト",
            body: "`strategy.matrix` で複数の OS / 言語バージョンを並列にテストできる。失敗で全体を止めたくなければ `fail-fast: false`。include / exclude で組み合わせを細かく調整。",
            code: "jobs:\n  test:\n    runs-on: ${{ matrix.os }}\n    strategy:\n      fail-fast: false\n      matrix:\n        os: [ubuntu-latest, macos-latest]\n        node: ['20', '22']\n        include:\n          - os: ubuntu-latest\n            node: '22'\n            coverage: true              # この組合せでだけ coverage 計測\n        exclude:\n          - os: macos-latest\n            node: '20'\n    steps:\n      - uses: actions/checkout@v4\n      - uses: actions/setup-node@v4\n        with: { node-version: ${{ matrix.node }}, cache: 'npm' }\n      - run: npm ci\n      - run: npm test\n      - if: matrix.coverage\n        run: npm run coverage\n      - if: matrix.coverage\n        uses: codecov/codecov-action@v4",
            language: "yaml",
          },
          {
            heading: "7.3 Secrets / Environments / OIDC",
            body: "**Secrets** は Settings → Secrets and variables → Actions で登録。`${{ secrets.NAME }}` で参照。**Environments** (production / staging) ごとに secrets を分離 + reviewer 必須化が可能。**OIDC** (OpenID Connect) で AWS / GCP に長期 IAM キーなしでデプロイできるのが現代の鉄板。",
            code: "# 通常 secrets\njobs:\n  deploy:\n    environment: production           # 環境を指定 (Settings → Environments で reviewer 必須化)\n    runs-on: ubuntu-latest\n    steps:\n      - uses: actions/checkout@v4\n      - run: ./deploy.sh\n        env:\n          STRIPE_KEY: ${{ secrets.STRIPE_KEY }}\n          DATABASE_URL: ${{ secrets.DATABASE_URL }}\n\n# OIDC で AWS にデプロイ (推奨、長期 IAM キー不要)\njobs:\n  deploy:\n    runs-on: ubuntu-latest\n    permissions:\n      id-token: write                  # OIDC token 取得\n      contents: read\n    steps:\n      - uses: actions/checkout@v4\n      - uses: aws-actions/configure-aws-credentials@v4\n        with:\n          role-to-assume: arn:aws:iam::123456789:role/gh-actions-deploy\n          aws-region: ap-northeast-1\n      - run: aws s3 sync ./dist s3://my-bucket/\n      - run: aws cloudfront create-invalidation --distribution-id $CF_ID --paths '/*'",
            language: "yaml",
            notes: [
              "Secrets はログに自動マスク — それでも echo しない、artifact に含めない",
              "OIDC は GCP / Azure / Vercel / Cloudflare などにも対応",
              "Environments の `Required reviewers` で本番デプロイを承認制に",
            ],
          },
          {
            heading: "7.4 ブランチ戦略の主要 3 流派",
            body: "**GitHub Flow** (現代の主流): main + 短命 feature ブランチ、main = 本番。**Trunk-based**: main 一本、feature flag で未完成機能を隠す。**GitFlow**: main / develop / feature / release / hotfix を使い分け (大規模・リリースサイクルが明確な場合)。チームに合った戦略を選ぶ。",
            code: "# GitHub Flow (推奨、Web サービス)\n# main: 常にデプロイ可能 (本番)\n# ↑ merge\n# feature/login, feature/signup (短命、PR ベース)\n#\n# 流れ:\n# 1. git switch -c feature/x main\n# 2. work + commit + push\n# 3. gh pr create --base main\n# 4. レビュー + CI 通過 → squash merge\n# 5. main → 自動デプロイ\n\n# Trunk-based (高頻度デプロイ、Google / Facebook 流)\n# main 一本、すべての作業を main に直接 (or 数時間で merge される短命 PR)\n# 未完成機能は feature flag で OFF にして main に入れる\n# 例: GrowthBook / LaunchDarkly / 自前 flag テーブル\n\n# GitFlow (リリースサイクルが明確、エンタープライズ / OSS)\n# main:    本番リリース版\n# develop: 次期リリースの開発版\n# feature/*: develop から派生、develop に戻る\n# release/*: develop から派生、main と develop に戻る\n# hotfix/*: main から派生、main と develop に戻る\n#\n# 現代の Web では複雑すぎることが多い — GitHub Flow に流れている",
            language: "text",
            notes: [
              "本番リリース頻度が日次以上なら GitHub Flow か Trunk-based、月次以下なら GitFlow も検討",
              "feature flag は Trunk-based / GitHub Flow とも相性が良い (未完成機能を main に入れて隠す)",
            ],
          },
        ],
        keyTakeaways: [
          "GitHub Actions は .github/workflows/*.yml、on で trigger / jobs で並列 / steps で実行",
          "matrix で複数バージョン並列、cache でビルド高速化",
          "Secrets は environment ごとに分離、本番は OIDC で長期キー不要",
          "GitHub Flow / Trunk-based / GitFlow をチームの規模とリリース頻度で選ぶ",
        ],
        comprehensionQuestionIds: ["git-013"],
      },
    ],
};
