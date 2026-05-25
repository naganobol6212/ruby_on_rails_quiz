import Link from "next/link";
import { LearningCycle } from "@/components/LearningCycle";
import { templates } from "@/lib/journal";
import { tracks } from "@/data/tracks";
import { allQuestions } from "@/data/all-questions";
import { guides } from "@/data/guides";
import { crudChallenges } from "@/data/crud-challenges";

export const metadata = {
  title: "使い方 — CodeDojo",
  description:
    "CodeDojo の機能 (クイズ / 自己説明 / ジャーナル / 参考書 / CRUD 課題 / ロードマップ) の使い方と推奨される学習サイクルを解説",
};

export default function AboutPage() {
  const availableTracks = tracks.filter((t) => t.status === "available").length;

  return (
    <div className="mx-auto max-w-4xl px-6 py-10 sm:py-14">
      {/* パンくず */}
      <div className="mb-6 flex items-center gap-2 text-xs text-zinc-500 dark:text-zinc-400">
        <Link
          href="/"
          className="hover:text-rose-600 hover:underline dark:hover:text-rose-300"
        >
          ホーム
        </Link>
        <span>›</span>
        <span className="font-medium text-zinc-700 dark:text-zinc-200">
          使い方
        </span>
      </div>

      <header className="mb-10">
        <p className="text-[10px] font-semibold uppercase tracking-widest text-rose-600 dark:text-rose-400">
          How to use · 使い方ガイド
        </p>
        <h1 className="mt-1 text-3xl font-bold tracking-tight text-zinc-900 dark:text-zinc-50">
          📖 CodeDojo の使い方
        </h1>
        <p className="mt-3 max-w-2xl text-sm leading-relaxed text-zinc-600 dark:text-zinc-300">
          CodeDojo は『読む・解く・説明する・記録する』をワンストップでループ
          させるための学習ハブです。 本ページでは各機能の役割と推奨される
          使い方フローを解説します。 機能名のリンクからそのまま試せます。
        </p>
      </header>

      {/* 目次 */}
      <nav
        aria-label="目次"
        className="mb-10 rounded-xl border border-zinc-200 bg-zinc-50/60 p-4 text-sm dark:border-white/10 dark:bg-zinc-900/40"
      >
        <p className="mb-2 text-[10px] font-semibold uppercase tracking-widest text-zinc-500 dark:text-zinc-400">
          目次
        </p>
        <ul className="grid gap-1 sm:grid-cols-2">
          {[
            ["#cycle", "🌀 学習サイクル"],
            ["#features", "🧩 各機能の使い方"],
            ["#daily", "📅 1 日 / 1 週間の流れ"],
            ["#shortcuts", "⌨️ キーボードショートカット"],
            ["#data", "🔒 データの保存場所"],
            ["#faq", "❓ FAQ"],
          ].map(([href, label]) => (
            <li key={href}>
              <a
                href={href}
                className="inline-block py-0.5 text-zinc-700 hover:text-rose-600 hover:underline dark:text-zinc-300 dark:hover:text-rose-300"
              >
                {label}
              </a>
            </li>
          ))}
        </ul>
      </nav>

      {/* 1. 学習サイクル */}
      <section id="cycle" className="mb-12 scroll-mt-20">
        <SectionTitle num="1" emoji="🌀" title="まず全体像 — 学習サイクル" />
        <p className="mb-4 text-sm leading-relaxed text-zinc-700 dark:text-zinc-300">
          各機能はバラバラに使うのではなく、 1 つの『学習サイクル』として
          回すと効果が出ます。 矢印通りに進めば、 知識が
          <strong className="mx-1">わかる → 説明できる → 使える</strong>
          へ階段状に育ちます。
        </p>
        <LearningCycle variant="embedded" />
      </section>

      {/* 2. 各機能の使い方 */}
      <section id="features" className="mb-12 scroll-mt-20">
        <SectionTitle num="2" emoji="🧩" title="各機能の使い方" />

        <FeatureCard
          emoji="🎯"
          name="Track / クイズ"
          href="/#tracks"
          ctaLabel="Track 一覧へ"
          what={`言語 / フレームワーク別の学習トラック。現在 ${availableTracks} トラック、合計 ${allQuestions.length} 問。`}
          howto={[
            "ホームから興味ある Track を選択",
            "問題に対し選択肢を選ぶ前に『段階的ヒント』を 1〜3 段階で確認 (使うとマークが残る)",
            "答え合わせ後の『詳しい解説』を必ず読む",
            "わかった → ✓ / 自信ない → 🔁 をマーク (後で復習対象に)",
            "間違えたら次のステップ (自己説明) へ",
          ]}
          tip="ヒント無しで解けた問題は記憶に残りやすい。ヒント使った問題は『見直しマーク』を付けて翌日再挑戦"
        />

        <FeatureCard
          emoji="🗣️"
          name="自己説明 (Explanations)"
          href="/explanations"
          ctaLabel="自己説明一覧へ"
          what="問題ごとに『自分の言葉で説明』を書ける欄。クイズ画面の各問題下にもインライン表示されます。"
          howto={[
            "クイズで間違えた or 自信が無い問題で、答え合わせ後に『自己説明』ボックスを開く",
            "なぜその答えになるのか / 関連する概念 / 自分なりの覚え方 を 3 行程度で書く",
            "/explanations ページで過去の自己説明を一覧 / 検索可能",
            "ジャーナル (PREP テンプレ) と組み合わせると説明力がさらに伸びる",
          ]}
          tip="『書く』は『読む』の数倍記憶に残る。完璧な文章を狙わず、自分が後で読んで思い出せるレベルで OK"
        />

        <FeatureCard
          emoji="📝"
          name="ジャーナル (構造化日記)"
          href="/journal"
          ctaLabel="ジャーナルを開く"
          what={`日々の学びを ${templates.length} 種類のテンプレ (3 行ジャーナル / KPT / STAR / 5W1H / YWT / PREP / 日報) で構造化記録。 連続日数 / ヒートマップ / Markdown 対応。`}
          howto={[
            "初めての人は『3 行ジャーナル』 (今日 / 学び / 次の一歩) から",
            "書きにくければ各欄の 💡『答えやすい問い』をクリック → 引用で挿入 → 続けて答える",
            "Markdown で書ける (見出し / 太字 / コード / リスト)、 ツールバー or ⌘B / ⌘I / ⌘K",
            "毎日続けると 🔥 連続記録 / ヒートマップ が育つ — 中断したくない心理が習慣化を加速",
            "前回同じテンプレで書いた『Try / 明日の予定 / 次やる』が表示される → セルフレビューに",
          ]}
          tip="完璧主義は敵。1 行 / 単語 / 箇条書きでも OK。30 秒書くだけの日があっても継続が一番大事"
        />

        {guides.length > 0 && (
          <FeatureCard
            emoji="📚"
            name="参考書 (Study Guide)"
            href="/guide"
            ctaLabel="参考書を開く"
            what={`公式リファレンス / 定番書のエッセンスを章立てで圧縮。 現在 ${guides.length} ガイド、 合計 ${guides.reduce((s, g) => s + g.chapters.length, 0)} 章。`}
            howto={[
              "Track と紐付いた参考書から興味ある章を読む",
              "読み終えたら関連クイズで定着確認",
              "気になった箇所はジャーナル (YWT の『わかった』) に記録",
            ]}
            tip="1 章 5〜10 分で読み切れる粒度。流し読みより 1 章をクイズで定着まで持っていく方が効率的"
          />
        )}

        {crudChallenges.length > 0 && (
          <FeatureCard
            emoji="🛠️"
            name="CRUD 課題"
            href="/crud"
            ctaLabel="CRUD 課題へ"
            what={`シナリオ → データモデル → API → 段階別実装 → レビュー観点 → 発展課題 まで一機能を一周。 現在 ${crudChallenges.length} 課題、 計 ${crudChallenges.reduce((s, c) => s + c.steps.length, 0)} ステップ。`}
            howto={[
              "読みながら手元のエディタで実装してみる",
              "各ステップの『チェック観点』を口頭で説明できるか確認",
              "詰まった所はジャーナル (KPT の Problem) に記録 → 次回の Try に繋げる",
            ]}
            tip="読むだけより手を動かす方が定着する。ステップ単位で『説明できる』状態を目指す"
          />
        )}

        <FeatureCard
          emoji="🗺️"
          name="ロードマップ"
          href="/roadmap"
          ctaLabel="ロードマップを開く"
          what="トピック単位で正答率 / 見直しマーク / 学習進捗を俯瞰。 次に集中すべき弱点が一目で分かる。"
          howto={[
            "見直しマーク (🔁) が多いトピックから優先して復習",
            "未着手トピックは概要を読み、興味があれば該当 Track のクイズへ",
            "週次でロードマップを見て、 次の 1 週間で詰めるテーマを決める",
          ]}
          tip="毎週日曜にロードマップを 5 分眺める習慣がおすすめ。次週のテーマがその場で決まる"
        />

        <FeatureCard
          emoji="🔍"
          name="検索 (⌘K)"
          href="#shortcuts"
          ctaLabel="ショートカット詳細"
          what="ヘッダーの検索ボタン or ⌘K (Mac) / Ctrl+K (Win) で起動するコマンドパレット。 クイズ / 参考書 / ジャーナル / 解説 を横断検索。"
          howto={[
            "キーワードを入力すると即座に候補が表示",
            "↑↓ で選択、 Enter で遷移",
            "Esc で閉じる",
          ]}
          tip="ページ間移動はナビを使うより ⌘K が速い"
        />

        <FeatureCard
          emoji="🆕"
          name="変更履歴 (ChangelogBadge)"
          href="/changelog"
          ctaLabel="変更履歴を開く"
          what="ヘッダーの 🆕 バッジから、 直近の機能追加 / 改善を確認可能。 新機能が追加されると赤いドットで通知。"
          howto={[
            "🆕 をクリックして開く",
            "新しい順に並ぶので、 自分が最後に見た時より上の項目をチェック",
            "見終わるとバッジは消える (LocalStorage に最終確認版を記録)",
          ]}
          tip="新機能を見落とすと損。週 1 でも覗くと使える機能が増えていく"
        />
      </section>

      {/* 3. 1 日 / 1 週間の流れ */}
      <section id="daily" className="mb-12 scroll-mt-20">
        <SectionTitle num="3" emoji="📅" title="推奨される 1 日 / 1 週間の流れ" />

        <Subsection title="🌅 1 日のサンプル (合計 15-30 分)">
          <ol className="space-y-1.5 text-sm text-zinc-700 dark:text-zinc-300">
            <li>
              <strong>1. 朝 (5 分)</strong> — Track でクイズ 3〜5 問。 通勤中でも OK
            </li>
            <li>
              <strong>2. 昼 / 業務中</strong> — 詰まったら参考書 / ロードマップを確認、 PREP で説明文を書く練習
            </li>
            <li>
              <strong>3. 夜 (5 分)</strong> — ジャーナル『3 行ジャーナル』
              で今日 / 学び / 次の一歩 を 1 行ずつ記録
            </li>
          </ol>
        </Subsection>

        <Subsection title="📆 1 週間のサンプル">
          <ul className="space-y-1.5 text-sm text-zinc-700 dark:text-zinc-300">
            <li>
              <strong>月〜金</strong> — 上の『1 日サンプル』をループ
            </li>
            <li>
              <strong>水曜日</strong> — 軽い KPT (週の中盤チェック)
            </li>
            <li>
              <strong>金曜 or 日曜</strong> — KPT 振り返り、 ロードマップを 5 分眺めて次週のテーマを決める
            </li>
            <li>
              <strong>毎月初</strong> — ジャーナルのヒートマップ / 月別件数を眺め、 続けられた / 続かなかった原因を 5W1H で分析
            </li>
          </ul>
        </Subsection>
      </section>

      {/* 4. キーボードショートカット */}
      <section id="shortcuts" className="mb-12 scroll-mt-20">
        <SectionTitle num="4" emoji="⌨️" title="キーボードショートカット" />

        <Subsection title="グローバル">
          <ShortcutTable
            items={[
              ["⌘ K / Ctrl+K", "検索 (コマンドパレット) を開く"],
              ["Esc", "モーダル / 検索を閉じる"],
            ]}
          />
        </Subsection>

        <Subsection title="ジャーナル編集中 (各 multiline フィールド)">
          <ShortcutTable
            items={[
              ["⌘ B / Ctrl+B", "太字 ** 〜 **"],
              ["⌘ I / Ctrl+I", "斜体 * 〜 *"],
              ["⌘ K / Ctrl+K", "リンク挿入 [label](url)"],
              ["⌘ E / Ctrl+E", "プレビュー ⇄ 編集 切替"],
              ["⌘ S / Ctrl+S", "保存"],
            ]}
          />
        </Subsection>
      </section>

      {/* 5. データの保存場所 */}
      <section id="data" className="mb-12 scroll-mt-20">
        <SectionTitle num="5" emoji="🔒" title="データの保存場所" />
        <ul className="space-y-2 text-sm leading-relaxed text-zinc-700 dark:text-zinc-300">
          <li>
            🌐 <strong>全データはブラウザの LocalStorage に保存</strong> — サーバには一切送信されません
          </li>
          <li>
            💻 ブラウザ / 端末を変えると別データになります (将来エクスポート / インポート対応予定)
          </li>
          <li>
            🧹 ブラウザの履歴 / サイトデータを削除すると消えるので、 大事な記録は時々手動でコピーを推奨
          </li>
          <li>
            🔍 保存対象: クイズ正誤 / 見直しマーク / 自己説明 / ジャーナル全件 / 最後に見た changelog / 最後に使ったテンプレ
          </li>
        </ul>
      </section>

      {/* 6. FAQ */}
      <section id="faq" className="mb-12 scroll-mt-20">
        <SectionTitle num="6" emoji="❓" title="よくある質問" />
        <div className="space-y-3">
          <FaqItem
            q="どの Track / テンプレから始めればいい?"
            a="メインで使う言語の Track からどうぞ。ジャーナルは『3 行ジャーナル』から始めて、慣れたら KPT / YWT へ。最初から完璧を狙わない方が続きます。"
          />
          <FaqItem
            q="クイズに正解しても定着しない気がする"
            a="読む / 解くだけでなく、『自己説明』と『ジャーナルへの記録』をセットでやると定着率が大きく上がります。 1 問あたり 30 秒の追加投資で OK。"
          />
          <FaqItem
            q="ジャーナルが続かない"
            a="3 行ジャーナル (1 行 × 3 つ) で『書く障壁』を最小化。 さらに各欄の 💡『答えやすい問い』を使えば空欄から脱出できます。 完璧主義を捨てて 30 秒だけ書く日があっても OK。"
          />
          <FaqItem
            q="間違えた問題だけ復習したい"
            a="ロードマップ (/roadmap) でトピック別の正答率 / 見直しマーク (🔁) を確認、 マーク多い箇所から戻ると効率的です。"
          />
          <FaqItem
            q="データを他端末に移したい"
            a="現状は LocalStorage のみ。 ブラウザの開発者ツールから LocalStorage の rrq_* キーをコピーすれば手動移行は可能 (将来エクスポート機能追加予定)。"
          />
        </div>
      </section>

      <footer className="mt-12 border-t border-zinc-200 pt-6 text-center text-xs text-zinc-500 dark:border-white/10 dark:text-zinc-400">
        <p>
          新機能や改善は{" "}
          <Link
            href="/changelog"
            className="text-rose-600 underline-offset-2 hover:underline dark:text-rose-300"
          >
            変更履歴 (Changelog)
          </Link>{" "}
          で随時告知しています。
        </p>
      </footer>
    </div>
  );
}

// ===========================================================================
// helpers
// ===========================================================================

function SectionTitle({
  num,
  emoji,
  title,
}: {
  num: string;
  emoji: string;
  title: string;
}) {
  return (
    <h2 className="mb-4 flex items-center gap-2 text-xl font-bold tracking-tight text-zinc-900 dark:text-zinc-50">
      <span className="inline-flex h-7 w-7 items-center justify-center rounded-full bg-rose-100 font-mono text-xs text-rose-700 dark:bg-rose-500/20 dark:text-rose-200">
        {num}
      </span>
      <span aria-hidden>{emoji}</span>
      <span>{title}</span>
    </h2>
  );
}

function FeatureCard({
  emoji,
  name,
  href,
  ctaLabel,
  what,
  howto,
  tip,
}: {
  emoji: string;
  name: string;
  href: string;
  ctaLabel: string;
  what: string;
  howto: string[];
  tip: string;
}) {
  return (
    <article className="mb-4 rounded-xl border border-zinc-200 bg-white p-5 shadow-sm dark:border-white/10 dark:bg-zinc-900/40">
      <header className="mb-3 flex items-start gap-3">
        <span className="text-2xl" aria-hidden>
          {emoji}
        </span>
        <div className="flex-1">
          <h3 className="text-base font-bold text-zinc-900 dark:text-zinc-50">
            {name}
          </h3>
          <p className="mt-1 text-xs leading-relaxed text-zinc-600 dark:text-zinc-400">
            {what}
          </p>
        </div>
        <Link
          href={href}
          className="inline-flex shrink-0 items-center gap-1 rounded-lg border border-rose-300 bg-rose-50 px-3 py-1.5 text-[11px] font-semibold text-rose-700 transition hover:bg-rose-100 dark:border-rose-500/40 dark:bg-rose-500/10 dark:text-rose-200 dark:hover:bg-rose-500/20"
        >
          <span>{ctaLabel}</span>
          <span aria-hidden>→</span>
        </Link>
      </header>
      <div className="space-y-2">
        <div>
          <p className="mb-1 text-[10px] font-semibold uppercase tracking-widest text-zinc-500 dark:text-zinc-400">
            使い方
          </p>
          <ol className="ml-4 list-decimal space-y-0.5 text-[13px] leading-relaxed text-zinc-700 marker:text-rose-400 dark:text-zinc-300">
            {howto.map((h, i) => (
              <li key={i}>{h}</li>
            ))}
          </ol>
        </div>
        <div className="rounded-md border border-amber-200 bg-amber-50/70 px-3 py-2 text-[11px] leading-relaxed text-amber-900 dark:border-amber-500/30 dark:bg-amber-500/[0.07] dark:text-amber-100">
          <strong>💡 コツ: </strong>
          {tip}
        </div>
      </div>
    </article>
  );
}

function Subsection({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <div className="mb-4 rounded-xl border border-zinc-200 bg-white p-4 dark:border-white/10 dark:bg-zinc-900/40">
      <h3 className="mb-2 text-sm font-semibold text-zinc-800 dark:text-zinc-100">
        {title}
      </h3>
      {children}
    </div>
  );
}

function ShortcutTable({ items }: { items: [string, string][] }) {
  return (
    <table className="w-full text-sm">
      <tbody>
        {items.map(([key, desc]) => (
          <tr
            key={key}
            className="border-b border-zinc-100 last:border-b-0 dark:border-white/5"
          >
            <td className="py-1.5 pr-3 align-top">
              <kbd className="inline-block rounded border border-zinc-300 bg-zinc-50 px-1.5 py-0.5 font-mono text-[11px] text-zinc-700 dark:border-white/15 dark:bg-zinc-800 dark:text-zinc-200">
                {key}
              </kbd>
            </td>
            <td className="py-1.5 text-zinc-700 dark:text-zinc-300">{desc}</td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}

function FaqItem({ q, a }: { q: string; a: string }) {
  return (
    <details className="group rounded-xl border border-zinc-200 bg-white p-4 transition open:shadow-sm dark:border-white/10 dark:bg-zinc-900/40">
      <summary className="cursor-pointer text-sm font-semibold text-zinc-900 transition group-open:text-rose-600 hover:text-rose-600 dark:text-zinc-100 dark:group-open:text-rose-300 dark:hover:text-rose-300">
        Q. {q}
      </summary>
      <p className="mt-2 text-sm leading-relaxed text-zinc-700 dark:text-zinc-300">
        A. {a}
      </p>
    </details>
  );
}
