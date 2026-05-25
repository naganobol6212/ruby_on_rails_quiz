"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { loadProgress } from "@/lib/storage";
import {
  computeStreak,
  dailyCounts,
  findTemplate,
  loadEntries,
  type JournalEntry,
} from "@/lib/journal";
import {
  type CategoryStats,
  type DifficultyStats,
  type MonthlyActivity,
  type OverallStats,
  type TemplateUsage,
  type WeeklyActivity,
  categoryStats,
  difficultyStats,
  monthlyActivity,
  overallStats,
  templateUsage,
  weeklyActivity,
} from "@/lib/stats";
import { roadmap } from "@/data/roadmap";
import type { Progress } from "@/lib/types";
import { JournalHeatmap } from "@/components/JournalHeatmap";

const ROADMAP_TOTAL_Q = roadmap.reduce(
  (s, p) =>
    s +
    p.steps.reduce(
      (s2, st) =>
        s2 +
        st.items.reduce(
          (s3, it) => s3 + (it.requiredQuestionIds?.length ?? 0),
          0,
        ),
      0,
    ),
  0,
);

export function StatsView() {
  const [progress, setProgress] = useState<Progress | null>(null);
  const [entries, setEntries] = useState<JournalEntry[]>([]);

  useEffect(() => {
    const refresh = () => {
      setProgress(loadProgress());
      setEntries(loadEntries());
    };
    refresh();
    const onProgress = () => refresh();
    const onJournal = () => refresh();
    window.addEventListener("rrq:progress-updated", onProgress);
    window.addEventListener("rrq:journal-updated", onJournal);
    return () => {
      window.removeEventListener("rrq:progress-updated", onProgress);
      window.removeEventListener("rrq:journal-updated", onJournal);
    };
  }, []);

  const overall = useMemo<OverallStats | null>(
    () => (progress ? overallStats(progress, entries, ROADMAP_TOTAL_Q) : null),
    [progress, entries],
  );
  const weekly = useMemo<WeeklyActivity[]>(
    () => (progress ? weeklyActivity(progress, 12) : []),
    [progress],
  );
  const monthly = useMemo<MonthlyActivity[]>(
    () => (progress ? monthlyActivity(progress, entries, 6) : []),
    [progress, entries],
  );
  const cats = useMemo<CategoryStats[]>(
    () => (progress ? categoryStats(progress) : []),
    [progress],
  );
  const diffs = useMemo<DifficultyStats[]>(
    () => (progress ? difficultyStats(progress) : []),
    [progress],
  );
  const tplUsage = useMemo<TemplateUsage[]>(
    () => templateUsage(entries),
    [entries],
  );
  const streak = useMemo(() => computeStreak(entries), [entries]);
  const heatmap = useMemo(() => dailyCounts(entries, 26 * 7), [entries]);

  return (
    <>
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
          学習統計
        </span>
      </div>

      <header className="mb-8">
        <p className="text-[10px] font-semibold uppercase tracking-widest text-rose-600 dark:text-rose-400">
          Stats Dashboard
        </p>
        <h1 className="mt-1 text-3xl font-bold tracking-tight text-zinc-900 dark:text-zinc-50">
          📈 学習統計ダッシュボード
        </h1>
        <p className="mt-2 max-w-2xl text-sm leading-relaxed text-zinc-600 dark:text-zinc-400">
          あなたの学習の積み重ねを 1 画面で。 週次 / 月次トレンド、 カテゴリー / 難易度別の正答率、
          ジャーナル習慣 — 強みと伸びしろが一目で分かります。
        </p>
      </header>

      {/* === ヒーロー (4 カード) ============================================= */}
      {overall && (
        <section className="mb-10 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          <HeroCard
            tone="rose"
            label="正答率 (定着率)"
            value={`${overall.accuracy}%`}
            sub={`${overall.solvedQuestions} / ${overall.attemptedQuestions} 問解けた`}
            emoji="🎯"
          />
          <HeroCard
            tone="violet"
            label="累計挑戦回数"
            value={`${overall.totalAttempts}`}
            sub={`挑戦したことのある問題 ${overall.attemptedQuestions} 件`}
            emoji="🔄"
          />
          <HeroCard
            tone={streak.current > 0 ? "amber" : "neutral"}
            label="ジャーナル連続記録"
            value={`${streak.current} 日`}
            sub={
              streak.longest > 0
                ? `最長 ${streak.longest} 日 · 累計 ${streak.totalDays} 日`
                : "今日から積み上げよう"
            }
            emoji={streak.current > 0 ? "🔥" : "🌱"}
          />
          <HeroCard
            tone="emerald"
            label="学習した日数 (累計)"
            value={`${overall.learningDays} 日`}
            sub={`クイズ ${overall.attemptedQuestions} 問 · ジャーナル ${overall.journalEntries} 件`}
            emoji="📅"
          />
        </section>
      )}

      {/* === 週次の学習活動 ============================================= */}
      <Panel
        title="📊 直近 12 週の学習活動"
        sub="各週に最後に挑戦した問題数 (青) と そのうち解けた数 (緑)"
      >
        {weekly.every((w) => w.attempts === 0) ? (
          <EmptyHint>まだ挑戦データがありません</EmptyHint>
        ) : (
          <WeeklyBars data={weekly} />
        )}
      </Panel>

      {/* === 月次トレンド ============================================= */}
      <Panel
        title="🗓 直近 6 ヶ月のトレンド"
        sub="クイズ挑戦回数 (青) / 解いた問題数 (緑) / ジャーナル件数 (紫)"
      >
        <MonthlyTrend data={monthly} />
      </Panel>

      {/* === カテゴリー別 ============================================= */}
      <Panel
        title="🏷 カテゴリー別正答率"
        sub="左: 得意分野 (Top 5) · 右: 苦手分野 (Bottom 5、 ※ 挑戦が多い順)"
      >
        {cats.length === 0 ? (
          <EmptyHint>挑戦してカテゴリー別を可視化しましょう</EmptyHint>
        ) : (
          <CategoryRanking cats={cats} />
        )}
      </Panel>

      {/* === 難易度別 ============================================= */}
      <Panel title="🎯 難易度別正答率" sub="初級 / 中級 / 上級 ごとの定着率">
        <DifficultyBars data={diffs} />
      </Panel>

      {/* === ジャーナル ヒートマップ ============================================= */}
      <Panel title="📝 ジャーナルの記録リズム" sub="ジャーナル機能のヒートマップを再表示">
        {entries.length === 0 ? (
          <EmptyHint>
            <Link
              href="/journal"
              className="text-rose-600 underline-offset-2 hover:underline dark:text-rose-300"
            >
              ジャーナルを始める →
            </Link>
          </EmptyHint>
        ) : (
          <JournalHeatmap counts={heatmap} weeks={26} />
        )}
      </Panel>

      {/* === テンプレ使用比率 ============================================= */}
      <Panel
        title="📋 ジャーナル テンプレ使用比率"
        sub={`これまで使ったテンプレの内訳 (合計 ${entries.length} 件)`}
      >
        {tplUsage.length === 0 ? (
          <EmptyHint>テンプレを使うと内訳が表示されます</EmptyHint>
        ) : (
          <TemplateUsageBar data={tplUsage} total={entries.length} />
        )}
      </Panel>

      <p className="mt-10 rounded-xl border border-dashed border-zinc-300 bg-zinc-50/50 p-4 text-[11px] text-zinc-600 dark:border-white/10 dark:bg-white/[0.02] dark:text-zinc-400">
        💡 統計はあなたのブラウザの LocalStorage から計算されます。 同じ問題への複数回挑戦の
        詳細時系列は保持していないため、 週次 / 月次トレンドは『最後に挑戦した日』 ベースの近似です。
      </p>
    </>
  );
}

// ===========================================================================
// レイアウト helpers
// ===========================================================================

function Panel({
  title,
  sub,
  children,
}: {
  title: string;
  sub?: string;
  children: React.ReactNode;
}) {
  return (
    <section className="mb-8 rounded-2xl border border-zinc-200 bg-white p-5 shadow-sm dark:border-white/10 dark:bg-zinc-900/40">
      <div className="mb-4">
        <h2 className="text-base font-bold text-zinc-900 dark:text-zinc-100">
          {title}
        </h2>
        {sub && (
          <p className="mt-0.5 text-[11px] text-zinc-500 dark:text-zinc-400">
            {sub}
          </p>
        )}
      </div>
      {children}
    </section>
  );
}

function EmptyHint({ children }: { children: React.ReactNode }) {
  return (
    <div className="rounded-lg border border-dashed border-zinc-300 px-4 py-6 text-center text-xs text-zinc-500 dark:border-white/10 dark:text-zinc-400">
      {children}
    </div>
  );
}

const TONES = {
  rose: "from-rose-500/15 to-fuchsia-500/10 border-rose-200 dark:border-rose-500/30 text-rose-700 dark:text-rose-300",
  violet:
    "from-violet-500/15 to-indigo-500/10 border-violet-200 dark:border-violet-500/30 text-violet-700 dark:text-violet-300",
  amber:
    "from-amber-500/15 to-orange-500/10 border-amber-200 dark:border-amber-500/30 text-amber-700 dark:text-amber-300",
  emerald:
    "from-emerald-500/15 to-teal-500/10 border-emerald-200 dark:border-emerald-500/30 text-emerald-700 dark:text-emerald-300",
  neutral:
    "from-zinc-100 to-zinc-50 border-zinc-200 dark:border-white/10 dark:from-white/[0.05] dark:to-white/[0.02] text-zinc-700 dark:text-zinc-300",
} as const;

function HeroCard({
  tone,
  label,
  value,
  sub,
  emoji,
}: {
  tone: keyof typeof TONES;
  label: string;
  value: string;
  sub: string;
  emoji: string;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 6 }}
      animate={{ opacity: 1, y: 0 }}
      className={`rounded-2xl border bg-gradient-to-br p-4 shadow-sm ${TONES[tone]}`}
    >
      <div className="flex items-center gap-2">
        <span className="text-2xl" aria-hidden>
          {emoji}
        </span>
        <p className="text-[10px] font-semibold uppercase tracking-widest opacity-80">
          {label}
        </p>
      </div>
      <p className="mt-2 text-3xl font-bold tabular-nums text-zinc-900 dark:text-zinc-50">
        {value}
      </p>
      <p className="mt-1 text-[11px] leading-relaxed text-zinc-600 dark:text-zinc-400">
        {sub}
      </p>
    </motion.div>
  );
}

// ===========================================================================
// 週次バー
// ===========================================================================

function WeeklyBars({ data }: { data: WeeklyActivity[] }) {
  const max = Math.max(1, ...data.map((d) => d.attempts));
  return (
    <div>
      <div className="flex h-32 items-end gap-1.5">
        {data.map((w) => {
          const h = (w.attempts / max) * 100;
          const solvedH = w.attempts === 0 ? 0 : (w.solved / w.attempts) * h;
          const rate =
            w.attempts === 0 ? 0 : Math.round((w.solved / w.attempts) * 100);
          return (
            <div
              key={w.weekStart}
              className="group relative flex flex-1 flex-col items-center"
              title={`${w.label} の週: ${w.attempts} 挑戦 · ${w.solved} 解けた (${rate}%)`}
            >
              <div className="relative flex h-full w-full items-end">
                <div
                  className="w-full rounded-t bg-sky-300/70 transition-all group-hover:bg-sky-400 dark:bg-sky-500/40 dark:group-hover:bg-sky-400/70"
                  style={{ height: `${h}%` }}
                >
                  <div
                    className="absolute bottom-0 w-full rounded-t bg-emerald-400/80 transition-all group-hover:bg-emerald-500 dark:bg-emerald-500/70 dark:group-hover:bg-emerald-400"
                    style={{ height: `${solvedH}%` }}
                  />
                </div>
              </div>
              {w.attempts > 0 && (
                <span className="pointer-events-none absolute -top-5 hidden rounded bg-zinc-900 px-1.5 py-0.5 font-mono text-[9px] text-white group-hover:block dark:bg-zinc-100 dark:text-zinc-900">
                  {w.attempts}/{w.solved}
                </span>
              )}
            </div>
          );
        })}
      </div>
      <div className="mt-1.5 flex gap-1.5 text-center font-mono text-[9px] text-zinc-500 dark:text-zinc-400">
        {data.map((w) => (
          <span key={w.weekStart} className="flex-1">
            {w.label}
          </span>
        ))}
      </div>
    </div>
  );
}

// ===========================================================================
// 月次トレンド (3 系列バー)
// ===========================================================================

function MonthlyTrend({ data }: { data: MonthlyActivity[] }) {
  const max = Math.max(
    1,
    ...data.flatMap((d) => [d.attempts, d.solved, d.journalEntries]),
  );
  return (
    <div className="space-y-3">
      {data.map((m) => (
        <div key={m.ym}>
          <div className="mb-1 flex items-center justify-between text-[11px]">
            <span className="font-mono text-zinc-600 dark:text-zinc-400">
              {m.label}
            </span>
            <span className="font-mono text-zinc-500 dark:text-zinc-500">
              挑戦 {m.attempts} · 解 {m.solved} · 📝 {m.journalEntries}
            </span>
          </div>
          <div className="grid gap-0.5">
            <Bar value={m.attempts} max={max} color="bg-sky-400 dark:bg-sky-500/70" />
            <Bar
              value={m.solved}
              max={max}
              color="bg-emerald-400 dark:bg-emerald-500/70"
            />
            <Bar
              value={m.journalEntries}
              max={max}
              color="bg-violet-400 dark:bg-violet-500/70"
            />
          </div>
        </div>
      ))}
      <div className="flex gap-3 pt-1 text-[10px] text-zinc-500 dark:text-zinc-400">
        <LegendDot color="bg-sky-400 dark:bg-sky-500/70" label="挑戦回数" />
        <LegendDot
          color="bg-emerald-400 dark:bg-emerald-500/70"
          label="解けた問題数"
        />
        <LegendDot
          color="bg-violet-400 dark:bg-violet-500/70"
          label="ジャーナル件数"
        />
      </div>
    </div>
  );
}

function Bar({
  value,
  max,
  color,
}: {
  value: number;
  max: number;
  color: string;
}) {
  const pct = (value / max) * 100;
  return (
    <div className="relative h-3 overflow-hidden rounded-full bg-zinc-100 dark:bg-white/5">
      <motion.div
        initial={{ width: 0 }}
        animate={{ width: `${pct}%` }}
        transition={{ duration: 0.4 }}
        className={`h-full rounded-full ${color}`}
      />
    </div>
  );
}

function LegendDot({ color, label }: { color: string; label: string }) {
  return (
    <span className="inline-flex items-center gap-1.5">
      <span className={`inline-block h-2 w-3 rounded ${color}`} />
      <span>{label}</span>
    </span>
  );
}

// ===========================================================================
// カテゴリー Top/Bottom
// ===========================================================================

function CategoryRanking({ cats }: { cats: CategoryStats[] }) {
  const attempted = cats.filter((c) => c.attempted > 0);
  if (attempted.length === 0) {
    return (
      <EmptyHint>
        いくつか問題を解くと、 カテゴリー別の得意 / 苦手が見えます
      </EmptyHint>
    );
  }
  const sorted = [...attempted].sort((a, b) => b.percent - a.percent);
  const top = sorted.slice(0, 5);
  const bottom = sorted.slice(-5).reverse();

  return (
    <div className="grid gap-4 sm:grid-cols-2">
      <CategoryList
        title="💪 得意 (正答率高)"
        tone="emerald"
        items={top}
      />
      <CategoryList
        title="🎯 伸びしろ (正答率低)"
        tone="rose"
        items={bottom}
      />
    </div>
  );
}

function CategoryList({
  title,
  tone,
  items,
}: {
  title: string;
  tone: "emerald" | "rose";
  items: CategoryStats[];
}) {
  const colors = {
    emerald: {
      bar: "from-emerald-400 to-teal-500",
      head: "text-emerald-700 dark:text-emerald-300",
    },
    rose: {
      bar: "from-rose-400 to-fuchsia-500",
      head: "text-rose-700 dark:text-rose-300",
    },
  };
  return (
    <div className="rounded-xl border border-zinc-200 bg-zinc-50/50 p-3 dark:border-white/10 dark:bg-white/[0.03]">
      <h3
        className={`mb-2 text-xs font-semibold uppercase tracking-wider ${colors[tone].head}`}
      >
        {title}
      </h3>
      <ul className="space-y-2">
        {items.map((c) => (
          <li key={c.categoryId}>
            <Link
              href={`/quiz/${c.categoryId}`}
              className="group block rounded-lg px-2 py-1.5 transition hover:bg-white dark:hover:bg-white/5"
            >
              <div className="flex items-center justify-between gap-2 text-xs">
                <span className="line-clamp-1 font-medium text-zinc-800 group-hover:text-rose-600 dark:text-zinc-100 dark:group-hover:text-rose-300">
                  <span aria-hidden className="mr-1">
                    {c.category.emoji}
                  </span>
                  {c.category.name}
                </span>
                <span className="shrink-0 font-mono text-[10px] tabular-nums text-zinc-500 dark:text-zinc-400">
                  {c.solved}/{c.total} · {c.percent}%
                </span>
              </div>
              <div className="mt-1 h-1.5 overflow-hidden rounded-full bg-zinc-200 dark:bg-white/10">
                <div
                  className={`h-full bg-gradient-to-r transition-all duration-500 ${colors[tone].bar}`}
                  style={{ width: `${c.percent}%` }}
                />
              </div>
              {c.weak > 0 && (
                <p className="mt-0.5 text-[10px] text-amber-700 dark:text-amber-300">
                  🔁 見直し {c.weak} 問
                </p>
              )}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}

// ===========================================================================
// 難易度別
// ===========================================================================

const DIFF_META: Record<
  DifficultyStats["difficulty"],
  { label: string; color: string }
> = {
  beginner: {
    label: "初級",
    color: "from-emerald-400 to-teal-500",
  },
  intermediate: {
    label: "中級",
    color: "from-amber-400 to-orange-500",
  },
  advanced: {
    label: "上級",
    color: "from-rose-400 to-fuchsia-500",
  },
};

function DifficultyBars({ data }: { data: DifficultyStats[] }) {
  return (
    <ul className="space-y-3">
      {data.map((d) => {
        const meta = DIFF_META[d.difficulty];
        return (
          <li key={d.difficulty}>
            <div className="mb-1 flex items-center justify-between text-xs">
              <span className="font-semibold text-zinc-800 dark:text-zinc-200">
                {meta.label}
              </span>
              <span className="font-mono text-zinc-500 dark:text-zinc-400">
                {d.solved}/{d.total} 問 · {d.percent}%
              </span>
            </div>
            <div className="h-3 overflow-hidden rounded-full bg-zinc-100 dark:bg-white/5">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${d.percent}%` }}
                transition={{ duration: 0.5 }}
                className={`h-full rounded-full bg-gradient-to-r ${meta.color}`}
              />
            </div>
          </li>
        );
      })}
    </ul>
  );
}

// ===========================================================================
// テンプレ使用バー (積み上げ)
// ===========================================================================

const TPL_COLORS = [
  "bg-rose-400 dark:bg-rose-500/70",
  "bg-violet-400 dark:bg-violet-500/70",
  "bg-sky-400 dark:bg-sky-500/70",
  "bg-emerald-400 dark:bg-emerald-500/70",
  "bg-amber-400 dark:bg-amber-500/70",
  "bg-fuchsia-400 dark:bg-fuchsia-500/70",
  "bg-cyan-400 dark:bg-cyan-500/70",
];

function TemplateUsageBar({
  data,
  total,
}: {
  data: TemplateUsage[];
  total: number;
}) {
  return (
    <div>
      {/* 積み上げバー */}
      <div className="flex h-4 overflow-hidden rounded-full">
        {data.map((u, i) => {
          const pct = (u.count / total) * 100;
          return (
            <div
              key={u.templateId}
              className={TPL_COLORS[i % TPL_COLORS.length]}
              style={{ width: `${pct}%` }}
              title={`${findTemplate(u.templateId)?.name ?? u.templateId}: ${u.count} 件`}
            />
          );
        })}
      </div>
      {/* 凡例 */}
      <ul className="mt-3 grid gap-1.5 sm:grid-cols-2">
        {data.map((u, i) => {
          const t = findTemplate(u.templateId);
          const pct = Math.round((u.count / total) * 100);
          return (
            <li
              key={u.templateId}
              className="flex items-center gap-2 text-xs"
            >
              <span
                className={`inline-block h-3 w-3 shrink-0 rounded ${TPL_COLORS[i % TPL_COLORS.length]}`}
              />
              <span className="flex-1 truncate text-zinc-700 dark:text-zinc-300">
                <span aria-hidden className="mr-1">
                  {t?.emoji ?? "📝"}
                </span>
                {t?.name ?? u.templateId}
              </span>
              <span className="font-mono text-[10px] text-zinc-500 dark:text-zinc-400">
                {u.count} 件 · {pct}%
              </span>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
