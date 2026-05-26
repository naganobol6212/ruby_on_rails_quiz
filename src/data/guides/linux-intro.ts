import type { Guide } from "./types";

export const linuxIntroGuide: Guide = {
    id: "linux-intro",
    trackId: "linux",
    title: "Linux & CLI の地図 — シェル・パイプ・運用",
    subtitle:
      "ファイルシステム → テキスト処理 → find/xargs → I/O とパイプ → プロセスと権限 → ネットワーク → シェル自動化 を 7 章で",
    audience:
      "Web アプリは書けるが本番サーバで詰まる人、CLI でテキスト処理 (grep/sed/awk/jq) を流暢に書けるようになりたい人、sudo / chmod / systemd で迷子になる人",
    sources: [
      { label: "Linux Command Library", url: "https://linuxcommandlibrary.com/" },
      { label: "tldr pages (実例ベースの man)", url: "https://tldr.sh/" },
      { label: "ArchWiki (深い解説、Arch でなくても有用)", url: "https://wiki.archlinux.org/" },
    ],
    emoji: "🐧",
    relatedCategoryIds: ["linux-cli"],
    chapters: [
      {
        id: "filesystem-and-navigation",
        title: "1. ファイルシステムとナビゲーション — ls / cd / cp / mv / rm",
        intro:
          "Linux のファイルシステム階層 (/etc / /var / /home など) と、基本的なファイル操作コマンドを整理。すべての出発点。",
        readingMinutes: 7,
        objectives: [
          "FHS (Filesystem Hierarchy Standard) の主要ディレクトリの役割を説明できる",
          "ls / cd / pwd / cp / mv / rm / mkdir / ln の基本オプションを使える",
          "ワイルドカード (* / ? / [abc]) とブレース展開 ({a,b,c}) を読める",
        ],
        sections: [
          {
            heading: "1.1 FHS — 標準ディレクトリ構造",
            body: "Linux は『どこに何を置くか』が FHS で決まっている。本番運用で『どこのログ?どこの設定?』で迷わないために主要 10 個を覚える。**/etc** 設定、**/var** 可変データ (log / db / spool)、**/home** ユーザー、**/usr** インストール済み、**/tmp** 一時、**/opt** サードパーティ、**/proc** プロセス情報の仮想 FS。",
            code: "/\n├ bin/, sbin/      基本コマンド (今は /usr に統合される傾向)\n├ boot/            ブートローダ / カーネル\n├ dev/             デバイスファイル (/dev/null, /dev/tty)\n├ etc/             システム設定 (/etc/nginx, /etc/ssh)\n├ home/            ユーザー (/home/alice)\n├ lib/             共有ライブラリ\n├ media/, mnt/     マウントポイント\n├ opt/             サードパーティ (Slack, Chrome 等)\n├ proc/            プロセス情報 (仮想 FS, /proc/<pid>)\n├ root/            root ユーザーの HOME\n├ run/             ランタイム情報 (PID ファイル等)\n├ sys/             カーネル情報 (仮想 FS)\n├ tmp/             一時 (再起動でクリア)\n├ usr/             インストールされたソフト (/usr/bin, /usr/lib)\n└ var/             可変データ (/var/log, /var/lib/postgresql, /var/spool)",
            language: "text",
            notes: [
              "ログを探すなら /var/log/ がほぼ確実",
              "/etc/ は『プレーンテキストの設定ファイル』が原則 (バイナリ設定はモダンサービスで稀)",
              "/tmp/ は再起動で消える、/var/tmp/ は残る (微妙な差)",
            ],
          },
          {
            heading: "1.2 ls / cd / pwd と基本のファイル操作",
            body: "`ls` は表示、`cd` は移動、`pwd` は現在地。`ls -la` (隠しファイル + 詳細) と `ls -lh` (人間用サイズ) が頻出。`cd -` で直前のディレクトリに戻る、`cd ~` でホームディレクトリ。",
            code: "# 表示\nls                              # 一覧\nls -la                          # 隠しファイル + 詳細 (-l long, -a all)\nls -lh                          # サイズを人間用 (K/M/G)\nls -lt                          # 更新時刻順\nls -lS                          # サイズ順\nls -R                           # 再帰\n\n# 移動\ncd /var/log\ncd                              # ホームへ\ncd ~                            # 同上\ncd ~alice                       # alice の HOME\ncd -                            # 直前のディレクトリ (トグル)\npwd                             # 現在地表示\n\n# 作成・コピー・移動・削除\nmkdir -p path/to/dir            # -p で中間ディレクトリも作る\ntouch file.txt                  # 空ファイル (or タイムスタンプ更新)\ncp file.txt copy.txt\ncp -r dir new_dir               # 再帰\ncp -p file backup/              # パーミッション / 時刻も保持\nmv old new                       # リネーム / 移動\nrm file                         # 削除\nrm -rf dir                      # 再帰 + 強制 (危険、確認しないこと多し)\n\n# 安全な削除 (rm のかわりに mv + 確認)\nalias rm='rm -i'                # -i で逐次確認 (chunky だが安全)\n# または trash-cli を使う",
            language: "bash",
            notes: [
              "rm -rf / は『システム全削除』 — alias で rm -i にしている熟練者は多い",
              "macOS と Linux で ls / cp / sed のオプションが微妙に違う (GNU vs BSD)",
            ],
          },
          {
            heading: "1.3 ワイルドカードとブレース展開",
            body: "シェルが事前に展開する仕組み。**ワイルドカード** (glob): `*` (任意の 0+ 文字)、`?` (任意 1 文字)、`[abc]` (a/b/c のいずれか)。**ブレース展開**: `{a,b,c}` で `a b c` に展開。`{1..10}` で連番、`{a..z}` でアルファベット。",
            code: "# Glob (ワイルドカード)\nls *.rb                          # 拡張子 .rb\nls file?.txt                     # file1.txt, file2.txt 等\nls file[0-9].txt                 # 数字\nls **/*.rb                       # 再帰 (シェルが対応していれば、zsh はデフォルト)\nshopt -s globstar               # bash で ** を有効化\n\n# ブレース展開 (シェル側、glob ではない)\necho file{1,2,3}.txt             # file1.txt file2.txt file3.txt\necho {a..e}                      # a b c d e\necho {1..5}                      # 1 2 3 4 5\necho {01..05}                    # 01 02 03 04 05\necho {2024..2026}-01            # 2024-01 2025-01 2026-01\n\n# 組み合わせ\nmkdir -p project/{src,test,docs}/{lib,bin}\n# → project/src/lib, project/src/bin, project/test/lib, ... 計 6 つ\n\nmv file.txt{,.bak}               # file.txt → file.txt.bak (バックアップの常套句)\ncp config.yml{,.20260101}       # 日付付きバックアップ",
            language: "bash",
            notes: [
              "ブレース展開は『シェル側』で起き、glob は『ファイルが存在する場合のみ』展開",
              "クォート (`'*.rb'`) すると展開されない — find / grep などに渡す時に意図的に",
            ],
          },
          {
            heading: "1.4 シンボリックリンクとハードリンク",
            body: "**シンボリックリンク (ln -s)** は『別ファイルへの参照』(Windows のショートカット相当)。**ハードリンク (ln)** は『同じ inode への別名』。日常はほぼ symlink を使う。",
            code: "# シンボリックリンク (一般的)\nln -s /var/log/nginx/access.log ./access.log\nls -la access.log\n# lrwxrwxrwx ... access.log -> /var/log/nginx/access.log\n\n# 既存リンクを上書き\nln -sfn /new/path link            # -f 強制 -n リンク先がディレクトリでも上書き\n\n# ハードリンク (同じ inode)\nln file.txt hardlink.txt\nls -li                            # i オプションで inode 表示 (両方同じ番号)\n\n# 違い\n# symlink: 別ファイル、リンク先が消えるとリンク切れ\n# hardlink: 同一 inode、片方を消してもデータは残る (refcount が 0 になるまで)\n# hardlink はディレクトリには使えない、別ファイルシステムをまたげない\n\n# 実用例: dotfiles 管理\nln -s ~/dotfiles/.zshrc ~/.zshrc\nln -s ~/dotfiles/.vimrc ~/.vimrc",
            language: "bash",
            notes: [
              "dotfiles を git 管理 + symlink で本体に展開するのが慣習",
              "symlink は読み書きすると元ファイルに作用する (リンク先で操作される)",
            ],
          },
        ],
        keyTakeaways: [
          "FHS で /etc (設定) / /var (可変) / /home / /tmp / /proc の場所を把握",
          "ls -la / -lh / -lt の頻出オプション、cd - で直前へ",
          "ワイルドカード (*/?[]) と ブレース展開 ({a,b,c} / {1..10}) は別の仕組み",
          "ln -s でシンボリックリンク — dotfiles 管理の定番",
        ],
        comprehensionQuestionIds: [],
      },
      {
        id: "text-processing",
        title: "2. テキスト処理 — cat / less / grep / sed / awk / sort / uniq",
        intro:
          "Linux 哲学の中心『テキストはユニバーサルなインターフェース』。grep / sed / awk / sort / uniq を組み合わせるだけで log 解析の大部分が書ける。",
        readingMinutes: 10,
        objectives: [
          "cat / less / head / tail とページャを使い分けられる",
          "grep で行検索、sed で置換、awk で列処理を書ける",
          "sort / uniq / wc / cut / tr などをパイプで連結できる",
        ],
        sections: [
          {
            heading: "2.1 cat / less / head / tail — ファイルを覗く",
            body: "**cat** はファイルを連結して出力 (短いファイル向け)。**less** は対話的ページャ (長いファイル / log)。**head / tail** で先頭 / 末尾 N 行。`tail -f` は『追記を待ち受け』モード — 本番 log 監視の定番。",
            code: "cat app.log                          # 全部出す (短いファイル)\ncat file1 file2 > combined           # 連結\n\n# less (推奨、長いファイル / pipe)\nless app.log\nless +F app.log                       # follow モード (= tail -f)\nless -N app.log                        # 行番号\nless -S app.log                        # 折り返さず横スクロール\nzless app.log.gz                       # gzip も読める\n# キー: / 検索 / n 次 / N 前 / G 末尾 / g 先頭 / F follow / q 終了\n\n# head / tail\nhead -20 app.log                       # 先頭 20 行\ntail -20 app.log                       # 末尾 20 行\ntail -f app.log                        # 追記を流す (本番 log 監視)\ntail -F app.log                        # ファイル rotation にも対応\ntail -n +100 app.log                   # 100 行目以降\n\n# 複数ファイル監視\ntail -f /var/log/{nginx,puma}/*.log\n\n# 行カウント\nwc -l app.log                          # 行数\nwc -lwc app.log                        # 行 / 単語 / バイト",
            language: "bash",
            notes: [
              "less は pipe にも使える: `ps aux | less`、`journalctl -u puma | less +F`",
              "cat ファイル | command の代わりに `< ファイル command` でも同じ (UUOC: Useless Use Of Cat)",
            ],
          },
          {
            heading: "2.2 grep — 行検索",
            body: "`grep PATTERN FILE` で正規表現マッチする行を出力。`-r` 再帰、`-n` 行番号、`-i` 大文字小文字無視、`-v` 反転、`-c` 件数、`-l` ファイル名のみ、`-A N` `-B N` `-C N` で前後 N 行。現代は **ripgrep (rg)** が高速で推奨。",
            code: "# 基本\ngrep ERROR app.log\ngrep -i error app.log                  # 大文字小文字無視\ngrep -v INFO app.log                   # INFO を含まない行\ngrep -c ERROR app.log                  # ヒット件数\n\n# 再帰\ngrep -rn 'TODO' .                       # 行番号付き\ngrep -rn 'TODO' --include='*.rb' .     # 拡張子フィルタ\ngrep -rln 'TODO' .                      # ファイル名のみ\ngrep -rE 'fixme|todo' --include='*.rb' --exclude-dir=node_modules\n\n# 前後コンテキスト\ngrep -A 3 -B 3 ERROR app.log           # 前後 3 行\ngrep -C 3 ERROR app.log                # 上と同じ (Context)\n\n# 拡張正規表現 (-E) / Perl 互換 (-P)\ngrep -E 'ERROR|FATAL' app.log\ngrep -P '\\d{4}-\\d{2}-\\d{2}' app.log    # \\d などの PCRE\n\n# ripgrep (推奨、超高速)\nrg 'TODO'                              # 自動再帰 + .gitignore 尊重\nrg -t ruby 'def calculate'             # ファイルタイプフィルタ\nrg -A 3 'ERROR'\nrg --json 'foo' | jq                   # JSON 出力で構造化",
            language: "bash",
            notes: [
              "ripgrep は再帰がデフォルト + .gitignore 尊重 + 並列 — grep -r より 10 倍以上速いことも",
              "正規表現の基本: . 任意 1 文字 / * 0+ / + 1+ / ? 0 or 1 / [abc] / ^ 行頭 / $ 行末 / \\d 数字",
            ],
          },
          {
            heading: "2.3 sed — ストリームエディタ (置換)",
            body: "**sed** は標準入力をパターンマッチで変換するエディタ。最頻出は `s/old/new/g` (置換)。`-i` でファイル直接編集 (in-place)、`-n` で出力抑制、`p` で『マッチ行のみ出力』。",
            code: "# 基本: 置換\nsed 's/old/new/' file.txt              # 行頭の最初の 1 つ\nsed 's/old/new/g' file.txt             # 全箇所 (g = global)\nsed -i 's/old/new/g' file.txt          # ファイル直接編集 (危険、要バックアップ)\nsed -i.bak 's/old/new/g' file.txt      # .bak でバックアップを残しつつ\n\n# 区切り文字を変える (パス置換で /)\nsed 's|/old/path|/new/path|g' file\n\n# 拡張正規表現 -E\nsed -E 's/[0-9]+/NUM/g' file\n\n# 行範囲指定\nsed '5d' file                          # 5 行目を削除\nsed '10,20d' file                       # 10〜20 行目削除\nsed -n '10,20p' file                   # 10〜20 行目だけ出力 (-n で残りを抑制)\nsed '/^#/d' file                        # コメント行 (# 始まり) を削除\n\n# よくある実用パターン\nsed -i 's/localhost/example.com/g' nginx.conf\nsed -i 's/^DEBUG=true/DEBUG=false/' .env\nfind . -name '*.rb' | xargs sed -i 's/old_method/new_method/g'",
            language: "bash",
            notes: [
              "macOS の sed は BSD 系で `-i` の引数が違う (`-i ''` で空文字列を渡す) — GNU sed と差",
              "複雑な変換は sed より awk / perl / ruby -i -ne の方が読みやすい",
            ],
          },
          {
            heading: "2.4 awk — 列処理の万能ツール",
            body: "**awk** は『各行をフィールド (列) に分割して処理する』言語。`$1` `$2` ... で N 番目のフィールド、`NF` で全列数、`NR` で行番号。デフォルト区切りは空白、`-F` で変更。集計・サマリ・CSV 処理に強い。",
            code: "# ファイルの 1 列目だけ抽出 (空白区切り)\nawk '{print $1}' file.txt\n\n# 2 列目と 5 列目を CSV で\nawk '{print $2 \",\" $5}' file\nawk -v OFS=',' '{print $2, $5}' file   # OFS で出力区切り\n\n# 区切り変更\nawk -F: '{print $1}' /etc/passwd       # : 区切りで 1 列目 (ユーザー名)\nawk -F, '{print $3}' data.csv          # CSV の 3 列目\n\n# フィルタ\nawk '$3 > 100' file                    # 3 列目が 100 より大きい行\nawk '/ERROR/ {print $1, $5}' app.log   # ERROR 行の 1 列目と 5 列目\nawk 'NR > 1' file                       # ヘッダ行スキップ\nawk 'NF == 5' file                      # 5 列ある行だけ\n\n# 集計\nawk '{sum += $3} END {print sum}' file # 3 列目の合計\nawk '{sum += $3; count++} END {print sum/count}' file  # 平均\n\n# 連想配列 (頻度カウント)\nawk '{count[$1]++} END {for (k in count) print k, count[k]}' file | sort -k2 -nr\n\n# 実例: nginx access log の status コード集計\nawk '{print $9}' access.log | sort | uniq -c | sort -nr",
            language: "bash",
          },
          {
            heading: "2.5 sort / uniq / cut / tr — テキストパイプの相棒",
            body: "**sort** 並べ替え、**uniq** 連続重複行除去 (要事前 sort)、**cut** 列の切り出し、**tr** 文字単位変換。これらをパイプで繋ぐと log 集計の大半が書ける。",
            code: "# sort\nsort file.txt                          # 辞書順\nsort -n file.txt                       # 数値順\nsort -nr file.txt                      # 数値降順\nsort -k2 file.txt                      # 2 列目をキー\nsort -t, -k3 -n data.csv               # CSV の 3 列目を数値順\nsort -u file.txt                       # 重複除去 (uniq の代わり)\n\n# uniq (必ず sort してから)\nsort file.txt | uniq                   # 重複除去\nsort file.txt | uniq -c                # 件数付き\nsort file.txt | uniq -c | sort -nr     # 頻度降順\nsort file.txt | uniq -d                # 重複しているものだけ\n\n# cut — 列の切り出し (固定区切り)\ncut -d, -f1,3 data.csv                 # CSV の 1, 3 列目\ncut -c1-10 file.txt                    # 1〜10 文字目\ncut -d: -f1 /etc/passwd                # : 区切りで 1 列目\n\n# tr — 文字変換\necho 'Hello' | tr 'a-z' 'A-Z'          # HELLO (大文字化)\necho 'a b c' | tr ' ' '\\n'              # スペースを改行に\ncat file | tr -d '\\r'                   # CRLF → LF\ncat file | tr -s ' '                    # 連続空白を 1 つに圧縮\n\n# 王道の組合せ\n# /etc/passwd からユーザー名一覧\ncut -d: -f1 /etc/passwd | sort\n\n# log から ERROR の頻度 Top 5\ngrep ERROR app.log | awk '{print $5}' | sort | uniq -c | sort -nr | head -5\n\n# JSON は jq で\ncurl -s https://api.example.com/users | jq '.[] | .email' | sort | uniq",
            language: "bash",
            notes: [
              "uniq は必ず sort の後に — 連続行しか比較しない",
              "JSON は jq、CSV は csvkit / miller (mlr) が便利",
            ],
          },
        ],
        keyTakeaways: [
          "less + tail -f が log の友、grep / ripgrep で行検索",
          "sed s/old/new/g で置換、-i でファイル直接編集 (バックアップ推奨)",
          "awk で列処理 ($1/$NF/NR)、集計 (END で sum/avg)、頻度カウント (連想配列)",
          "sort | uniq -c | sort -nr が log 集計の鉄板パイプ",
        ],
        comprehensionQuestionIds: ["cli-001", "cli-003"],
      },
      {
        id: "find-and-xargs",
        title: "3. find と xargs — 検索と一括処理",
        intro:
          "find はファイル『属性』(名前 / 更新時刻 / サイズ / 種類) で検索する強力ツール。xargs で結果を別コマンドの引数に流し込めば、強力な一括処理パイプが完成する。",
        readingMinutes: 9,
        objectives: [
          "find の主要オプション (-name / -type / -mtime / -size) を使える",
          "xargs で標準入力を別コマンドの引数化、-0 / -I {} / -P で安全 + 並列実行できる",
          "find -exec と xargs の使い分けを判断できる",
        ],
        sections: [
          {
            heading: "3.1 find — 属性で検索",
            body: "`find PATH -CONDITION` の形式。`-name PATTERN` で名前、`-type f/d/l` でファイル / ディレクトリ / シンボリックリンク、`-mtime ±N` で N 日以内 / 以上、`-size +10M` でサイズ。複数条件は `-and` (省略可) / `-or` / `-not`。",
            code: "# 名前で検索\nfind . -name '*.rb'                    # 拡張子 .rb (要クォート — シェル展開回避)\nfind . -iname '*.RB'                    # 大文字小文字無視\nfind . -name 'user*' -type f           # ファイルのみ\n\n# 種類\nfind . -type d                          # ディレクトリ\nfind . -type l                          # symlink\nfind . -type f -empty                   # 空ファイル\n\n# 更新時刻\nfind /var/log -mtime -1                 # 1 日以内\nfind /var/log -mtime +30                # 30 日より前\nfind . -mmin -10                        # 10 分以内 (分単位)\nfind . -newer reference.txt              # reference.txt より新しい\n\n# サイズ\nfind / -size +100M -type f 2>/dev/null  # 100MB 超 (stderr 隠す)\nfind . -size 0                          # 0 バイト\n\n# 権限\nfind /etc -perm 644\nfind . -perm /u=w                       # owner に書込権限あり\n\n# 複数条件 + 除外\nfind . -name '*.log' -not -path './node_modules/*'\nfind . \\( -name '*.tmp' -or -name '*.bak' \\) -delete\n\n# 結果に対してコマンド実行 (-exec)\nfind . -name '*.tmp' -exec rm {} \\;            # 1 件ずつ rm を呼ぶ (遅い)\nfind . -name '*.tmp' -exec rm {} +              # まとめて rm に渡す (高速)\nfind . -name '*.rb' -exec grep -l 'TODO' {} +",
            language: "bash",
            notes: [
              "`-delete` は強力 — 必ず `find ... -print` で確認してから使う",
              "macOS の find (BSD) は -mtime が日単位 (`-mtime -1d`) など細部が違う",
            ],
          },
          {
            heading: "3.2 xargs — 標準入力を引数化",
            body: "`echo a b c | rm` は動かない (rm は標準入力を読まない) が、`echo a b c | xargs rm` は `rm a b c` 相当になる。`find ... | xargs cmd` が定番。`-I {}` でプレースホルダ、`-n N` で N 引数ずつ、`-P N` で N 並列。",
            code: "# 基本: 検索結果を引数化\nfind . -name '*.tmp' | xargs rm\nls *.log | xargs gzip                  # 全 log を gzip\n\n# ファイル名に空白がある可能性 → -print0 + -0 で NULL 区切り (安全)\nfind . -name '*.tmp' -print0 | xargs -0 rm\n\n# -I {} でプレースホルダ\nfind . -name '*.rb' | xargs -I {} cp {} backup/\n# {} の位置を指定可能\nls *.jpg | xargs -I {} convert {} -resize 50% small_{}\n\n# -n N で 1 回のコマンドに N 引数まで\nls *.jpg | xargs -n 1 -I {} echo processing {}\n\n# 並列実行 -P N (CPU を使い切る)\ncat urls.txt | xargs -P 8 -I {} curl -s {} -o /dev/null -w '%{http_code} {}\\n'\n\n# 確認モード -p (実行前に y/n)\nfind . -name '*.tmp' | xargs -p rm\n\n# 何も無い時は実行しない -r (GNU)\nfind . -name 'never_exists' | xargs -r rm",
            language: "bash",
            notes: [
              "ファイル名に空白 / 改行が含まれる可能性 → 必ず `-print0 | xargs -0` の組合せ",
              "`xargs -P` の並列はサーバ負荷に注意 — 試す時は `-P 2` から",
            ],
          },
          {
            heading: "3.3 find -exec vs xargs の使い分け",
            body: "両方とも『検索結果に対してコマンドを実行』だが、性能と書き心地が違う。`-exec ... +` (まとめて 1 回) と `xargs` はほぼ同等の性能。`-exec ... \\;` は 1 件ごとに呼ぶので遅い。並列化 / プレースホルダ自由配置が必要なら xargs。",
            code: "# 性能差\nfind . -name '*.rb' -exec wc -l {} \\;       # 1 ファイルずつ wc を呼ぶ (遅い)\nfind . -name '*.rb' -exec wc -l {} +         # まとめて 1 回呼ぶ (速い)\nfind . -name '*.rb' | xargs wc -l            # 同上 (速い)\n\n# 使い分けの目安\n# -exec ... +    : 単純なファイル削除・ファイル渡し\n# xargs          : 並列実行 / プレースホルダの自由配置 / 別コマンドへの input\n\n# 実用例\n# 1) 30 日以上前の .log を gzip\nfind /var/log -name '*.log' -mtime +30 -exec gzip {} \\;\n\n# 2) 全 .rb で 'old_method' を検索\nfind . -name '*.rb' -print0 | xargs -0 grep -l 'old_method'\n\n# 3) 並列でファイル変換 (xargs 必須)\nfind . -name '*.jpg' -print0 | xargs -0 -P 4 -I {} convert {} {}.webp\n\n# 4) Git で追跡されているファイルだけ対象 (rg / git のほうが速い)\ngit ls-files '*.rb' | xargs sed -i 's/old/new/g'\nrg -l 'old_method' --type ruby | xargs sed -i 's/old_method/new_method/g'",
            language: "bash",
          },
          {
            heading: "3.4 fd / ripgrep — 現代の代替",
            body: "**fd** (find の Rust 製代替) と **ripgrep (rg)** (grep の Rust 製代替) は、デフォルトで .gitignore を尊重 / 並列 / カラー出力。日常使いはこちらが圧倒的に速くて快適。",
            code: "# fd (find の代替)\nfd '\\.rb$'                            # 拡張子 .rb\nfd -t f 'config'                      # ファイル (-t f), 名前に 'config'\nfd -t d 'src'                         # ディレクトリ\nfd -e log                              # 拡張子で (--extension)\nfd -e log -E node_modules              # 除外\nfd --changed-within 1d                 # 1 日以内 (find の -mtime -1)\nfd -x rm                               # -x で実行 (find -exec ... +)\nfd -x gzip                              # 並列\n\n# ripgrep (grep の代替)\nrg 'TODO'                              # 自動再帰\nrg -t ruby 'def calculate'             # ファイルタイプ\nrg -A 3 -B 3 'ERROR'                    # 前後\nrg --json 'pattern' | jq               # JSON 出力\n\n# 組合せ\nfd -e rb -x sed -i 's/old/new/g'      # find + xargs + sed 相当を 1 行で",
            language: "bash",
            notes: [
              "fd / rg はインストール推奨 (brew / apt / cargo install)",
              "find / grep は『どこにでもある』ので最低限覚えておき、ローカルでは fd / rg を使うのが現代",
            ],
          },
        ],
        keyTakeaways: [
          "find は属性で検索 (-name / -type / -mtime / -size / -perm)",
          "xargs で結果を引数化、必ず -print0 + -0 で空白安全に",
          "-exec ... + と xargs はほぼ同等、並列なら xargs -P",
          "fd / ripgrep が現代の代替 — .gitignore 尊重 + 並列で圧倒的に速い",
        ],
        comprehensionQuestionIds: ["cli-001", "cli-008"],
      },
      {
        id: "io-and-pipes",
        title: "4. 標準入出力とパイプ — stdin / stdout / stderr / リダイレクト",
        intro:
          "Unix 哲学『プログラムは text streams を入出力する』。stdin / stdout / stderr の 3 つのストリームと、リダイレクト / パイプ / tee を整理。",
        readingMinutes: 8,
        objectives: [
          "stdin (0) / stdout (1) / stderr (2) のファイルディスクリプタを区別できる",
          "> / >> / 2> / &> / 2>&1 を読み書きできる",
          "tee / プロセス置換 (<(cmd)) で複雑な合流を扱える",
        ],
        sections: [
          {
            heading: "4.1 3 つのストリームとリダイレクト",
            body: "各プロセスは 3 つの『ストリーム』を持つ: **stdin (0)** 入力、**stdout (1)** 通常出力、**stderr (2)** エラー出力。リダイレクトでファイルに / から流せる。`>` 上書き、`>>` 追記、`<` 入力、`2>` stderr、`&>` 両方、`2>&1` stderr を stdout に統合。",
            code: "# 出力をファイルへ\ncmd > out.txt                          # stdout を out.txt に上書き\ncmd >> out.txt                         # 追記\n\n# 入力をファイルから\nsort < unsorted.txt\n\n# stderr のリダイレクト\ncmd 2> errors.log                      # stderr のみ\ncmd 2>> errors.log                     # 追記\ncmd 2>/dev/null                         # 捨てる (find で error を抑制する定番)\n\n# 両方\ncmd &> all.log                          # stdout + stderr (Bash 拡張)\ncmd > all.log 2>&1                     # 同上 (POSIX)\ncmd 2>&1 | grep ERROR                  # stderr も pipe で grep に流す\n\n# 入出力同時\ncmd < input.txt > output.txt 2> errors.log\n\n# ヒアドキュメント / ヒア文字列\ncat <<EOF > config.txt\nname = Alice\nage = 30\nEOF\n\ngrep foo <<< 'foo bar baz'             # ヒア文字列 (1 行入力)\n\n# /dev/null と /dev/stdin /dev/stdout\ncmd > /dev/null 2>&1                   # 全部捨てる\necho 'data' | jq < /dev/stdin",
            language: "bash",
            diagram: `flowchart LR
  IN["入力ファイル"] -- "&lt;" --> P["プロセス\\n(cmd)"]
  P -- "stdout (1)" --> OUT["out.txt\\n&gt; or &gt;&gt;"]
  P -- "stderr (2)" --> ERR["errors.log\\n2&gt; or 2&gt;&gt;"]
  P -- "stdout | pipe" --> NEXT["次のコマンド\\n(grep/sort/...)"]
  P -. "2&gt;&amp;1" .-> OUT
  P -. "2&gt;/dev/null" .-> NULL[("/dev/null")]`,
            diagramCaption: "stdin (0) / stdout (1) / stderr (2) とリダイレクト先",
            notes: [
              "`>` 上書きの事故防止: `set -o noclobber` で既存ファイルへの `>` をエラーに (`>|` で強制上書き)",
              "2>&1 の順序が大事: `cmd 2>&1 | less` (statement 内、2>&1 を pipe より先に)",
            ],
          },
          {
            heading: "4.2 パイプ — プロセス間の流し込み",
            body: "`A | B` は A の stdout を B の stdin に直結。複数のシンプルなツールを組み合わせる Unix 哲学の中核。`A | B | C` のように何段でも繋げる。`|` は stdout のみ、stderr も繋ぎたいなら `|&` (Bash 4+)。",
            code: "# 基本パイプ\nps aux | grep ruby                     # ps の出力を grep に\ncat app.log | grep ERROR | wc -l       # ERROR 行数\n\n# stderr も pipe (Bash 4+)\nstrange-cmd |& grep error              # = strange-cmd 2>&1 | grep error\n\n# よくある集計パイプ\n# Top 10 IP (nginx access.log)\nawk '{print $1}' access.log | sort | uniq -c | sort -nr | head\n\n# ファイル名一覧 (拡張子別件数)\nfind . -type f | sed 's/.*\\.//' | sort | uniq -c | sort -nr\n\n# 重い処理の途中状況を見る\nrails db:migrate 2>&1 | tee migrate.log\n\n# 速度監視\nfind / -type f 2>/dev/null | pv -l > /dev/null   # 行数進捗 (要 pv install)\n\n# Process 数の指定\ncat urls.txt | xargs -P 8 -I {} curl -s {} -o /dev/null -w '%{http_code} {}\\n'",
            language: "bash",
            notes: [
              "パイプの各段は『独立プロセス』として並行実行 — 1 段詰まると全部遅くなる",
              "巨大ファイルを全部メモリに載せない設計 — 1 行ずつ流して処理する",
            ],
          },
          {
            heading: "4.3 tee — T 字パイプで分岐",
            body: "**tee** は標準入力を (1) ファイルに書き出し、(2) 標準出力にも流す T 字パイプ。『ログに記録しつつ次のコマンドにも流す』時に必須。`-a` で追記モード。`stderr` も含めたいなら `2>&1` を tee の前に。",
            code: "# 実行ログをファイル + 画面\nrails db:migrate | tee migrate.log\n\n# 追記モード\nrun-script | tee -a run.log\n\n# stderr もまとめてキャプチャ\nbundle exec rspec 2>&1 | tee rspec.log\n\n# パイプの途中で記録\ngrep ERROR log/production.log | tee errors.log | wc -l\n# → errors.log にも保存しつつ件数表示\n\n# 複数ファイルに同時書き出し\necho 'hello' | tee a.txt b.txt c.txt\n\n# sudo で root 権限ファイルに書き込む裏ワザ\necho 'new line' | sudo tee -a /etc/hosts\n# `echo ... > /etc/hosts` は echo に sudo がかからないので NG",
            language: "bash",
            notes: [
              "`sudo echo 'x' > /etc/hosts` は失敗する (リダイレクトはシェル側で起き、sudo は echo にしかかからない)",
              "tee 経由で `sudo tee -a` が定番のワークアラウンド",
            ],
          },
          {
            heading: "4.4 プロセス置換 — <(cmd) と >(cmd)",
            body: "Bash 拡張。`<(cmd)` は『cmd の出力をファイルに見せかける』、`>(cmd)` は『書き込んだものを cmd の入力に流す』。`diff` で『コマンド A と B の出力を比較』が代表的ユースケース。",
            code: "# 2 つのコマンド出力を diff\ndiff <(ls dir1) <(ls dir2)\ndiff <(sort file1) <(sort file2)\n\n# 同じテキストを 2 つの処理に分岐\ncat huge.log | tee >(grep ERROR > errors.log) >(grep WARN > warns.log) > /dev/null\n\n# プロセス置換で複数 input を 1 つの cmd に\nparallel command ::: <(cat list1) <(cat list2)\n\n# ファイルの代わりに直接渡せる場面\nwhile IFS= read -r line; do\n  echo \"got: $line\"\ndone < <(curl -s https://api.example.com/lines)",
            language: "bash",
            notes: [
              "プロセス置換は Bash / Zsh 拡張 — POSIX sh (dash 等) では使えない",
              "コードレビュー時に最初は面食らうので、コメントを添えると親切",
            ],
          },
        ],
        keyTakeaways: [
          "stdin (0) / stdout (1) / stderr (2) — リダイレクトは番号で指定",
          "&> / 2>&1 で stderr も合流、>>/  >| で追記 / 強制上書き",
          "tee で『記録しつつ次へ流す』、sudo tee -a で root ファイルへ追記",
          "<(cmd) / >(cmd) のプロセス置換で diff やパイプ分岐",
        ],
        comprehensionQuestionIds: ["cli-007"],
      },
      {
        id: "processes-and-permissions",
        title: "5. プロセスと権限 — ps / kill / chmod / chown / sudo",
        intro:
          "プロセス一覧 (ps / top / htop)、シグナル (kill / pkill)、パーミッション (chmod / chown) と sudo の使い方を整理。本番運用の必修知識。",
        readingMinutes: 9,
        objectives: [
          "ps aux / top / htop でプロセスを観察できる、pgrep / pkill で名前検索 + シグナル送信",
          "rwx / 644 / 755 / 600 の権限を読み書きできる、umask を理解",
          "sudo / sudoers / sudo -i の差を理解する",
        ],
        sections: [
          {
            heading: "5.1 ps / top / htop / pgrep — プロセス観察",
            body: "`ps aux` (BSD スタイル) が業界標準のフル一覧。`top` / `htop` で対話的に監視 (CPU / メモリ降順)。`pgrep -fl puma` で名前検索、`pkill -f sidekiq` でシグナル送信。",
            code: "# プロセス一覧\nps aux                                 # 全プロセス (a 全ユーザー u 詳細 x 端末なし含む)\nps aux | grep ruby                     # 絞り込み\nps -ef --forest                        # ツリー表示 (親子関係)\nps -eo pid,user,%cpu,%mem,comm --sort=-%mem | head  # CPU/メモリ順\n\n# 対話的監視\ntop                                    # 標準\nhtop                                   # 視覚的 (要 install)\n# top の中で: P CPU 順 / M メモリ順 / k kill / 1 CPU コア別表示 / q 終了\n\n# 名前で検索\npgrep -fl puma                          # puma を含むプロセスを名前で\npgrep -u alice                          # alice のプロセス\n\n# シグナル送信\nkill <PID>                              # SIGTERM (お願い、graceful)\nkill -15 <PID>                          # SIGTERM (明示)\nkill -9 <PID>                           # SIGKILL (強制、データロス可能性)\nkill -HUP <PID>                         # SIGHUP (設定再読込)\npkill -f sidekiq                        # 名前マッチで kill\nkillall ruby                            # コマンド名で全部\n\n# シグナル一覧\nkill -l\n# 1) SIGHUP  2) SIGINT  3) SIGQUIT  9) SIGKILL  15) SIGTERM\n# 18) SIGCONT  19) SIGSTOP\n\n# Ctrl-C で送られるのは SIGINT (2)、Ctrl-Z は SIGTSTP (停止 — fg で再開)",
            language: "bash",
            notes: [
              "SIGTERM (15) は『お願い、終わって』 — アプリは cleanup できる",
              "SIGKILL (9) は『強制終了』 — アプリは何もできずに死ぬ (最後の手段)",
              "puma / sidekiq などは特定シグナルで graceful restart (SIGUSR2 / SIGTSTP)",
            ],
          },
          {
            heading: "5.2 パーミッション — rwx / 数字表現 / 特殊ビット",
            body: "`ls -l` の左 10 文字を読む。最初の 1 文字はタイプ (- ファイル / d ディレクトリ / l symlink)、残り 9 文字を 3 つに分けて **owner / group / other** の **rwx**。数字表現は r=4 w=2 x=1 の和。`chmod` で変更、`chown` で所有者変更。",
            code: "$ ls -l\n-rw-r--r-- 1 alice users 100 Jan 1 app.rb\n# 1 文字目: - (ファイル) / d (ディレクトリ) / l (symlink)\n# 次の 9 文字: owner=rw- / group=r-- / other=r--\n# 数字: 644 (r=4 w=2 x=1 の和)\n\n# 主要なパターン\n# 644 (-rw-r--r--) : 一般ファイル\n# 755 (-rwxr-xr-x) : 実行ファイル / ディレクトリ\n# 600 (-rw-------) : 鍵ファイル (SSH 秘密鍵は必須)\n# 700 (drwx------) : 個人ディレクトリ\n# 666 (-rw-rw-rw-) : 誰でも書き込み可 (危険、デバッグ用)\n# 777 (-rwxrwxrwx) : 誰でも何でも (絶対避ける)\n\n# chmod\nchmod 644 app.rb\nchmod 755 script.sh\nchmod +x script.sh                     # 全員に実行権限追加\nchmod u+w,g-w,o-r file                 # owner に w 追加 / group から w 削除 / other から r 削除\nchmod -R 755 dir                       # 再帰\n\n# chown\nchown deploy file\nchown deploy:deploy file                # owner:group\nchown -R deploy:deploy /app             # 再帰\n\n# 新規ファイルのデフォルト権限 (umask)\numask                                  # 現在の umask 表示 (例: 022)\n# 644 = 666 (デフォルト) - 022 (umask) で計算\numask 077                              # 個人ファイル用 (group/other 一切なし)\n\n# 特殊ビット\n# setuid (s) : 実行時に owner 権限で動く (例: /usr/bin/passwd)\n# setgid (s) : group の継承\n# sticky bit (t) : /tmp/ に付いている (他人のファイルを消せない)\nls -ld /tmp\n# drwxrwxrwt   ← t が sticky bit",
            language: "bash",
            notes: [
              "SSH 秘密鍵は 600 必須 (~/.ssh/id_ed25519) — それ以外だと ssh-add が拒否",
              "Web アプリ run-as ユーザーは『最小権限』 — root では絶対動かさない",
            ],
          },
          {
            heading: "5.3 sudo / sudoers — 権限昇格",
            body: "`sudo` は『指定コマンドを別ユーザー (デフォルト root) として実行』。`sudo -i` で root シェル、`sudo -u user cmd` で別ユーザー、`sudo !!` で直前を sudo で再実行。誰が何をできるかは `/etc/sudoers` (編集は `visudo` 必須)。",
            code: "# 基本\nsudo apt update                        # root 権限で実行\nsudo -i                                 # root シェル (環境ごと)\nsudo -s                                 # 現在のシェルで root\nsudo -u deploy bundle exec rake db:migrate    # deploy ユーザーで\n\n# パスワードキャッシュ (デフォルト 15 分)\nsudo -v                                 # キャッシュ更新\nsudo -k                                 # キャッシュ破棄\n\n# 直前のコマンドを sudo で再実行\nsudo !!\n\n# sudoers — 権限の定義 (visudo で編集 — syntax check 付き)\nsudo visudo\n# 例:\n# alice    ALL=(ALL:ALL) ALL          # alice は全 host で全コマンド可\n# deploy   ALL=(ALL) NOPASSWD: /bin/systemctl restart puma   # deploy は puma restart のみ pw 無し\n# %admin   ALL=(ALL) ALL               # admin グループ全員\n\n# CI / Bot 用に NOPASSWD を限定したコマンドだけ許す\ndeploy   ALL=NOPASSWD: /usr/bin/git -C /app pull, /bin/systemctl restart app\n\n# 注意\n# sudo で edit するファイルは『現在のユーザーのエディタ設定』が使われない\nsudoedit /etc/nginx/nginx.conf         # 推奨 (一時コピーを編集 → 保存で反映)\n# vs\nsudo vim /etc/nginx/nginx.conf         # root として vim 起動 (root の .vimrc を読む)",
            language: "bash",
            notes: [
              "/etc/sudoers の直接編集は厳禁 — visudo が syntax check してくれる",
              "本番で `sudo su -` (root 化) する代わりに、必要なコマンドだけ NOPASSWD で限定する方が安全",
            ],
          },
          {
            heading: "5.4 ディスク使用量と監視",
            body: "**du** はディレクトリ / ファイル単位、**df** はパーティション単位。`-h` で人間用 (K/M/G)、`-s` で summary。本番で『どこが容量を食ってる？』を高速調査する手順を覚える。",
            code: "# パーティション (全体)\ndf -h                                  # 全パーティション\ndf -h .                                # カレントのみ\ndf -i                                  # inode 使用量 (大量小ファイルでも枯渇する)\n\n# ディレクトリ単位 (ピンポイント調査)\ndu -sh /var/log/*                      # /var/log 直下を 1 行ずつ\ndu -sh ./* | sort -h                   # サイズ順\ndu -h --max-depth=2 /var | sort -hr | head -20\n\n# 大きいファイル探索\nfind / -type f -size +100M 2>/dev/null | xargs ls -lh 2>/dev/null\nfind /var/log -name '*.log.*' -mtime +30 -delete    # 古い log を削除\n\n# CPU / メモリ\nfree -h                                 # メモリ\nuptime                                  # load average (1m, 5m, 15m)\nvmstat 1                                # 1 秒ごとの統計\niostat -x 1                             # ディスク I/O\nsar -u 1 10                             # CPU 使用率 1 秒 x 10 回\n\n# プロセス別\nps -eo pid,user,%cpu,%mem,comm --sort=-%mem | head\nhtop                                    # 視覚的\n\n# 監視ツール\n# Prometheus + node_exporter, Datadog, New Relic, Grafana Cloud などが定番",
            language: "bash",
            notes: [
              "Load Average の目安: CPU コア数を超えると過負荷 (4 コアなら 4.0 以上は危険信号)",
              "df -i で inode 枯渇 — 大量ログを溜め込むサービスで稀に起きる",
            ],
          },
        ],
        keyTakeaways: [
          "ps aux + top/htop でプロセス観察、kill -15 → -9 の順で送信、特定アプリは graceful restart シグナルあり",
          "rwx / 644 / 755 / 600 を体で覚える、SSH 秘密鍵は 600 必須",
          "sudo は必要最小限 + sudoers で限定、visudo で編集",
          "du / df / free / uptime が本番監視の最初の 4 コマンド",
        ],
        comprehensionQuestionIds: ["cli-002", "cli-004", "cli-006"],
      },
      {
        id: "networking-and-ssh",
        title: "6. ネットワーク — SSH / SCP / curl / dig / ss / 障害切り分け",
        intro:
          "リモート接続 (ssh / scp / rsync)、HTTP テスト (curl / jq)、DNS / ポート確認 (dig / ss / nc / lsof)、障害切り分けの定石 (ping → port → DNS) を整理。",
        readingMinutes: 10,
        objectives: [
          "ssh / scp / rsync で安全にリモート操作・ファイル転送ができる",
          "curl で API テスト、ヘッダ・ボディ・ステータスコードを扱える",
          "ping / nc / dig / ss / lsof で『繋がらない』の原因をレイヤーで切り分ける",
        ],
        sections: [
          {
            heading: "6.1 SSH — 鍵認証と ~/.ssh/config",
            body: "`ssh user@host` でリモート接続。鍵は `ssh-keygen -t ed25519` で生成 (`id_rsa` は古い)、公開鍵 (.pub) をサーバの `~/.ssh/authorized_keys` に追加。`~/.ssh/config` に Host エイリアスを書くと `ssh prod` のように短縮。",
            code: "# 鍵生成 (推奨: ed25519)\nssh-keygen -t ed25519 -C 'me@example.com'\n# → ~/.ssh/id_ed25519 (秘密鍵, 600), ~/.ssh/id_ed25519.pub (公開鍵)\n\n# 公開鍵をサーバに登録\nssh-copy-id user@host                  # 自動で authorized_keys に追加\n# または手動: cat ~/.ssh/id_ed25519.pub | ssh user@host 'cat >> ~/.ssh/authorized_keys'\n\n# 接続\nssh user@host\nssh -i ~/.ssh/specific_key user@host    # 鍵指定\nssh -p 2222 user@host                   # 非標準ポート\n\n# ~/.ssh/config (強く推奨)\nHost prod\n    HostName 1.2.3.4\n    User deploy\n    IdentityFile ~/.ssh/prod_key\n    Port 2222\n    ServerAliveInterval 60               # keep-alive (60 秒ごと)\n\nHost *.internal.example.com\n    User admin\n    ProxyJump bastion                    # bastion 経由\n\nHost bastion\n    HostName bastion.example.com\n    User jump\n\n# → `ssh prod` でフル設定で接続、ProxyJump で多段 SSH も透過的\n\n# ポートフォワード (本番 DB に手元から)\nssh -L 5432:localhost:5432 prod         # ローカル 5432 → リモート 5432\npsql -h localhost -p 5432               # ローカルでアクセス\n\n# Remote forward (逆向き)\nssh -R 8080:localhost:3000 prod         # リモートの 8080 → 手元の 3000",
            language: "bash",
            notes: [
              "秘密鍵 (~/.ssh/id_ed25519) は 600 必須 — それ以外だと ssh が拒否",
              "ProxyJump (-J) で bastion 経由を 1 コマンドで",
              "ssh-agent で passphrase を一度入力すれば残りはキャッシュ",
            ],
          },
          {
            heading: "6.2 scp / rsync — ファイル転送",
            body: "**scp** は SSH 経由の単純コピー (小規模)、**rsync** は差分転送 + 再開可能 (大規模・継続同期に強い)。S3 / GCS なら `aws s3 cp` / `gsutil cp`。",
            code: "# scp (Secure Copy)\nscp local.tar.gz user@host:/tmp/        # ローカル → リモート\nscp -r ./mydir user@host:/var/www/     # 再帰\nscp user@host:/etc/nginx/nginx.conf .  # リモート → ローカル\nscp -P 2222 file user@host:~/          # ポート指定\nscp -i ~/.ssh/key file user@host:~/    # 鍵指定\n\n# rsync (差分転送、推奨)\nrsync -avz ./mydir user@host:/var/www/\n# -a archive (再帰 + perm + symlink 等を保存)\n# -v verbose\n# -z compression\nrsync -avz --exclude='.git' --exclude='node_modules' ./ user@host:/var/www/myapp/\nrsync -avz --delete src/ user@host:dest/    # dest にしかないファイルを削除 (双方向同期に近い)\nrsync -avz --dry-run ./ user@host:dest/     # 実行前のシミュレーション (必須)\n\n# 進捗バー\nrsync -avz --info=progress2 ./big-file user@host:~/\n\n# 中断 / 再開\n# rsync は途中で止めても、同じコマンドで再実行すれば差分だけ転送される\n\n# クラウドストレージ\naws s3 cp local.tar.gz s3://my-bucket/backups/\naws s3 sync ./mydir s3://my-bucket/myapp/ --delete\ngsutil cp local.tar.gz gs://my-bucket/backups/\nrclone copy local.tar.gz onedrive:/Backups/    # 多種クラウド対応",
            language: "bash",
            notes: [
              "rsync の `--dry-run` は必ず最初に — 意図しない削除を防ぐ",
              "本番デプロイの初期は rsync が定番、徐々に CI/CD or コンテナへ移行",
            ],
          },
          {
            heading: "6.3 curl + jq — HTTP テストと JSON 整形",
            body: "**curl** は HTTP/HTTPS/FTP などのクライアント。`-X` メソッド、`-H` ヘッダ、`-d` ボディ、`-i` レスポンスヘッダも表示、`-v` 詳細、`-s` 無音、`-w` 形式指定。**jq** で JSON を整形 / フィルタ。",
            code: "# 基本\ncurl https://example.com\ncurl -i https://example.com             # ヘッダも表示\ncurl -v https://example.com             # 詳細 (SSL ハンドシェイク等)\ncurl -s https://example.com             # プログレス非表示\n\n# POST\ncurl -X POST -H 'Content-Type: application/json' \\\n  -d '{\"name\":\"Alice\"}' \\\n  http://localhost:3000/users\n\n# JSON ファイル送信\ncurl -X POST -H 'Content-Type: application/json' \\\n  --data @payload.json \\\n  http://localhost:3000/users\n\n# 認証ヘッダ\ncurl -H 'Authorization: Bearer abc123' https://api.example.com/me\n\n# レスポンスステータスコード抽出\ncurl -s -o /dev/null -w '%{http_code}\\n' https://example.com\ncurl -s -o /dev/null -w 'time=%{time_total} status=%{http_code}\\n' https://example.com\n\n# Cookie\ncurl -c cookies.txt https://example.com/login   # 保存\ncurl -b cookies.txt https://example.com/me      # 利用\n\n# jq でレスポンス整形\ncurl -s https://api.example.com/users | jq                  # 整形表示\ncurl -s https://api.example.com/users | jq '.[].email'      # email フィールド抽出\ncurl -s https://api.example.com/users | jq 'map(.email)'    # 配列に\ncurl -s https://api.example.com/users | jq '.[] | select(.active==true)'\ncurl -s https://api.example.com/users | jq -r '.[].email'   # raw (quotes なし)\n\n# 並列リクエスト\ncat urls.txt | xargs -P 8 -I {} curl -s {} -o /dev/null -w '%{http_code} {}\\n'\n\n# HTTPie (curl の使いやすい代替)\nhttp POST localhost:3000/users name=Alice email=a@x\nhttp GET api.example.com/me Authorization:'Bearer abc'",
            language: "bash",
            notes: [
              "curl は POSIX 標準 — どこにでもある。HTTPie / xh はローカルで便利",
              "jq の `-r` (raw) は『文字列の quotes を外す』 — shell スクリプトで値を取り出す時に必須",
            ],
          },
          {
            heading: "6.4 障害切り分け — ping / nc / dig / ss / lsof",
            body: "『繋がらない』の原因は複数レイヤー。**Layer 3 到達** (ping)、**Layer 4 ポート** (nc / telnet)、**DNS** (dig / nslookup)、**Layer 7 HTTP** (curl)、**証明書** (openssl s_client)、**手元のリスナ** (ss / lsof) と順に切り分ける。",
            code: "# 1. 到達性 (ICMP / Layer 3)\nping -c 4 example.com                  # 4 回\nping -c 4 8.8.8.8                       # IP 直で (DNS 問題を切り分け)\n\n# 2. ポート疎通 (TCP / Layer 4)\nnc -zv example.com 443                  # netcat (z=スキャン v=verbose)\ntelnet example.com 443                  # 古典的 (もう非推奨)\n\n# 3. DNS\ndig example.com                         # 詳細 (推奨)\ndig +short example.com                  # IP のみ\ndig @8.8.8.8 example.com                # 別 DNS サーバで\ndig MX example.com                       # MX レコード\ndig NS example.com                       # NS レコード\nnslookup example.com\nhost example.com\n\n# 4. アプリ層 (HTTP / Layer 7)\ncurl -v https://example.com\ncurl -I https://example.com             # HEAD だけ (ヘッダ確認)\n\n# 5. ルート追跡 (どこで止まってる？)\ntraceroute example.com\nmtr example.com                          # 連続監視 (見やすい)\n\n# 6. HTTPS 証明書\nopenssl s_client -connect example.com:443 -servername example.com < /dev/null\nopenssl s_client -connect example.com:443 -servername example.com 2>&1 | openssl x509 -noout -dates  # 有効期限\n\n# 7. 手元の listen ポート\nss -tlnp                                # TCP listen 一覧 + プロセス (現代の標準)\nss -tlnp | grep 3000                    # ポート 3000\nlsof -i:3000                            # そのポートを使うプロセス\nlsof -i tcp:3000                        # TCP のみ\nnetstat -tlnp                           # 古い (環境によってはまだ現役)\n\n# 8. パケットレベル (重い、本気の調査)\ntcpdump -i eth0 -nn 'port 443' -w out.pcap\nwireshark out.pcap                       # GUI で開く",
            language: "bash",
            notes: [
              "切り分け順: ping → DNS → port → HTTP → 証明書 — 下から上へ",
              "本番調査は ping + curl -v + dig +short の 3 つで大半解決",
              "ss -tlnp は netstat の現代版 (Linux)、macOS は lsof -i や netstat",
            ],
          },
        ],
        keyTakeaways: [
          "SSH は ed25519 + ~/.ssh/config + ProxyJump で爆速、ポートフォワードで DB 経由も",
          "rsync は差分転送 + --dry-run、scp は単発、クラウドなら aws s3 cp",
          "curl + jq の組合せで API テスト + JSON 整形、-w でステータスコード抽出",
          "障害切り分けは『ping → DNS → port → HTTP → 証明書』の順で下から上に",
        ],
        comprehensionQuestionIds: ["cli-005", "cli-012", "cli-013", "cli-014", "cli-016"],
      },
      {
        id: "shell-automation-and-ops",
        title: "7. シェル自動化と運用 — alias / function / tmux / cron / systemd",
        intro:
          ".bashrc / .zshrc / alias / function でシェルを快適に、tmux / screen でセッション継続、cron / systemd-timer で定期実行、systemd でサービス管理。本番運用の総まとめ。",
        readingMinutes: 10,
        objectives: [
          "alias / function / 環境変数 / PATH を .bashrc / .zshrc に書ける",
          "tmux で SSH 切断耐性のあるセッション、分割ペインを扱える",
          "cron / crontab と systemd-timer の使い分け、systemd でサービス管理ができる",
        ],
        sections: [
          {
            heading: "7.1 alias / function と .bashrc / .zshrc",
            body: "`alias name='command'` で短縮、関数なら `function f() { ... }`。`~/.bashrc` (bash) / `~/.zshrc` (zsh) に書いて永続化。環境変数は `export KEY=value`、`PATH` は `export PATH=$HOME/bin:$PATH`。",
            code: "# ~/.zshrc (Zsh の例)\n# Alias\nalias gs='git status'\nalias gc='git commit'\nalias gp='git push'\nalias gl='git log --oneline -20'\nalias glg='git log --oneline --graph --all --decorate'\nalias gpfl='git push --force-with-lease'\nalias be='bundle exec'\nalias rs='bin/rails server'\nalias rc='bin/rails console'\nalias rt='bundle exec rspec'\nalias ll='ls -lah'\nalias ..='cd ..'\nalias ...='cd ../..'\n\n# Function (引数を取りたい時)\nfunction mkcd() {\n  mkdir -p \"$1\" && cd \"$1\"\n}\n\nfunction gclone() {\n  git clone \"$1\" && cd $(basename \"$1\" .git)\n}\n\nfunction extract() {\n  case \"$1\" in\n    *.tar.gz)  tar xzf \"$1\" ;;\n    *.tar.bz2) tar xjf \"$1\" ;;\n    *.zip)     unzip \"$1\" ;;\n    *.gz)      gunzip \"$1\" ;;\n    *) echo 'unknown' ;;\n  esac\n}\n\n# 環境変数 / PATH\nexport EDITOR=vim\nexport VISUAL=vim\nexport PAGER=less\nexport LANG=ja_JP.UTF-8\nexport PATH=\"$HOME/bin:$HOME/.local/bin:$PATH\"\nexport PATH=\"$HOME/.cargo/bin:$PATH\"\n\n# プロンプト (Zsh)\nautoload -U colors && colors\nPROMPT='%{$fg[green]%}%n@%m %{$fg[blue]%}%~ %{$reset_color%}$ '\n\n# 反映\nsource ~/.zshrc",
            language: "bash",
            notes: [
              "dotfiles を git 管理 + symlink で本体に置くのが定番 (1 章 1.4)",
              "Zsh + oh-my-zsh / Prezto / starship で見た目とプロンプトを強化する流派が多い",
              "fish shell は POSIX 非互換だが補完が強力 — 好みで",
            ],
          },
          {
            heading: "7.2 tmux / screen — ターミナル多重化",
            body: "1 つのターミナルセッションに複数ウィンドウ / 分割ペインを持てる。SSH を切っても detach 状態で生存し、後で attach で復帰可能。**tmux** (推奨)、**screen** (古典)、**zellij** (新興、設定不要)。",
            code: "# tmux 基本操作\ntmux new -s deploy                     # 新セッション (名前付き)\ntmux ls                                 # セッション一覧\ntmux attach -t deploy                   # 再接続\ntmux attach                              # 最新セッション\ntmux kill-session -t deploy             # 終了\n\n# tmux のキーバインド (prefix: Ctrl-b)\n# Ctrl-b d   detach (中断せず抜ける)\n# Ctrl-b c   新ウィンドウ\n# Ctrl-b ,   ウィンドウ名変更\n# Ctrl-b 0-9 ウィンドウ番号で切替\n# Ctrl-b n / p   次 / 前ウィンドウ\n# Ctrl-b %   縦分割 (左右)\n# Ctrl-b \"   横分割 (上下)\n# Ctrl-b 矢印   ペイン間移動\n# Ctrl-b x   ペイン閉じる\n# Ctrl-b z   ペインを全画面 (再度押すと戻る)\n# Ctrl-b [   コピーモード (vim-like で移動 + コピー)\n# Ctrl-b ?   キー一覧\n\n# ~/.tmux.conf (好みでカスタム)\nset -g prefix C-a                        # prefix を Ctrl-a に変更\nunbind C-b\nset -g mouse on                          # マウス操作有効\nset -g base-index 1                      # window 番号を 1 から\nbind '|' split-window -h                 # | で縦分割\nbind '-' split-window -v                 # - で横分割\n\n# screen (古典)\nscreen -S deploy                         # 新規\nscreen -r deploy                         # 再接続\n# Ctrl-a d  → detach\n\n# zellij (新興、デフォルトで分かりやすい)\nzellij                                   # 起動するとガイドが出る\n\n# 1 回限りのバックグラウンド実行 (多重化機能なし)\nnohup ./long_running.sh > out.log 2>&1 &\ndisown                                   # 親シェル終了でも継続",
            language: "bash",
            notes: [
              "本番サーバの長時間処理 (デプロイ・データ移行・dump) は必ず tmux 内で",
              "tmux の prefix を Ctrl-a に変えると Emacs / readline と被るので注意 — 慣れの問題",
            ],
          },
          {
            heading: "7.3 cron / systemd-timer — 定期実行",
            body: "**cron** は伝統的な定期実行デーモン。`crontab -e` で編集、`分 時 日 月 曜 コマンド` の 5 フィールド書式。**systemd-timer** はモダンな代替 (依存関係 / ログ統合 / 再試行が強い)。Rails では `whenever` gem が Ruby DSL から crontab を生成。",
            code: "# cron (個人ユーザー)\ncrontab -e                              # 編集\ncrontab -l                              # 確認\n\n# 書式: 分 時 日 月 曜 cmd\n# *  全部\n# */N N ごと\n# A,B,C カンマ列挙\n# A-B 範囲\n\n# 例\n*/5 * * * * curl -s https://example.com/heartbeat   # 5 分毎\n0 3 * * * /usr/local/bin/backup.sh >> /var/log/backup.log 2>&1   # 毎日 3:00\n0 9 * * 1 echo 'Monday meeting' | mail -s 'reminder' alice@x     # 月曜 9:00\n0 0 1 * * /opt/monthly-cleanup.sh                                  # 毎月 1 日\n\n# Rails の whenever (Ruby DSL → crontab 自動生成)\n# config/schedule.rb\nevery 1.day, at: '3:00 am' do\n  rake 'cleanup:old_records'\nend\nevery 5.minutes do\n  rake 'healthcheck:ping'\nend\n# bundle exec whenever --update-crontab で反映\n\n# systemd-timer (モダン)\n# /etc/systemd/system/backup.service\n[Unit]\nDescription=Daily backup\n[Service]\nType=oneshot\nExecStart=/usr/local/bin/backup.sh\nUser=deploy\n\n# /etc/systemd/system/backup.timer\n[Unit]\nDescription=Run backup daily\n[Timer]\nOnCalendar=*-*-* 03:00:00\nPersistent=true\n[Install]\nWantedBy=timers.target\n\n# 有効化\nsudo systemctl daemon-reload\nsudo systemctl enable --now backup.timer\nsystemctl list-timers                  # 全 timer 一覧 + 次回実行時刻",
            language: "bash",
            notes: [
              "cron は『stdout / stderr を root にメール送信』するのがデフォルト → 必ず `>> log 2>&1` で握り潰す",
              "systemd-timer の方がログ (journalctl) + 失敗時再試行 (Restart=) + 依存関係で強い",
              "cron は環境変数を読み込まない — シェル絶対パスや `source ~/.bashrc` を明示",
            ],
          },
          {
            heading: "7.4 systemd — サービス管理",
            body: "現代の Linux で『デーモンを動かす』の標準。**systemctl** で起動 / 停止 / 再起動 / 自動起動、**journalctl** でログ閲覧。サービス定義は `/etc/systemd/system/*.service`。",
            code: "# サービス操作 (systemctl)\nsudo systemctl start puma\nsudo systemctl stop puma\nsudo systemctl restart puma\nsudo systemctl reload puma              # 設定再読込 (アプリ次第)\nsudo systemctl status puma              # 状態確認\nsudo systemctl enable puma              # 自動起動 ON\nsudo systemctl disable puma              # 自動起動 OFF\nsudo systemctl enable --now puma        # ON + 即起動\n\n# ログ (journalctl)\njournalctl -u puma                       # puma のログ全部\njournalctl -u puma -f                    # tail -f 相当\njournalctl -u puma --since '1 hour ago'\njournalctl -u puma --since today\njournalctl -u puma -p err                 # err 以上のみ\njournalctl --vacuum-time=7d              # 古いログを削除\n\n# サービス定義 (/etc/systemd/system/myapp.service)\n[Unit]\nDescription=My Rails App\nAfter=network.target postgresql.service\nRequires=postgresql.service\n\n[Service]\nType=simple\nUser=deploy\nGroup=deploy\nWorkingDirectory=/var/www/myapp\nEnvironmentFile=/var/www/myapp/.env\nExecStart=/var/www/myapp/bin/rails server -e production -b 0.0.0.0\nExecReload=/bin/kill -USR2 $MAINPID    # アプリ次第\nRestart=on-failure\nRestartSec=5\nStandardOutput=journal\nStandardError=journal\n\n[Install]\nWantedBy=multi-user.target\n\n# 反映\nsudo systemctl daemon-reload\nsudo systemctl enable --now myapp\nsudo systemctl status myapp\njournalctl -u myapp -f                   # ログ tail\n\n# 失敗時の調査\nsystemctl status myapp                   # 直近のエラーが見える\njournalctl -u myapp -n 100 --no-pager    # 末尾 100 行",
            language: "bash",
            notes: [
              "Restart=on-failure + RestartSec=5 でクラッシュ時の自動復旧",
              "ログは syslog ではなく journal に統一 (journalctl で一括閲覧)",
              "Docker / Kubernetes 環境では systemd ではなくコンテナランタイムが担当",
            ],
          },
        ],
        keyTakeaways: [
          "alias / function / 環境変数を .bashrc / .zshrc にまとめて永続化、dotfiles を git 管理",
          "tmux で SSH 切断に強いセッション、分割ペイン、長時間処理は必ず内側で",
          "cron は古典 / systemd-timer はモダン (再試行 + journal 統合)",
          "systemctl + journalctl でサービス管理 / ログ閲覧、Restart=on-failure で自動復旧",
        ],
        comprehensionQuestionIds: ["cli-009", "cli-010", "cli-011", "cli-015"],
      },
    ],
};
