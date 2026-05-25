"use client";

import { motion } from "framer-motion";
import type { StreakInfo } from "@/lib/journal";

type Props = {
  streak: StreakInfo;
  totalEntries: number;
};

/**
 * 連続記録 / 累計を 4 つのカードで可視化。
 * 毎日のモチベーション補強と『今日まだ書いてない』フィードバックを兼ねる。
 */
export function JournalStreak({ streak, totalEntries }: Props) {
  const { current, longest, totalDays, todayWritten, yesterdayWritten, lastDate } =
    streak;

  // 連続継続のステータス
  let status: {
    icon: string;
    label: string;
    detail: string;
    tone: "fire" | "warn" | "rest";
  };
  if (current === 0) {
    status = {
      icon: "🌱",
      label: "今日から始めよう",
      detail:
        totalDays > 0
          ? `最後の記録は ${formatRelative(lastDate)}。今日 1 行でも書けば再スタート`
          : "1 つ書くだけでカウントが始まります",
      tone: "rest",
    };
  } else if (todayWritten) {
    status = {
      icon: "🔥",
      label: `${current} 日連続`,
      detail: "今日も記録しました。お見事",
      tone: "fire",
    };
  } else if (yesterdayWritten) {
    status = {
      icon: "⏳",
      label: `${current} 日連続 (今日まだ)`,
      detail: "今日中に 1 行書けば連続更新",
      tone: "warn",
    };
  } else {
    status = {
      icon: "🌱",
      label: "今日から再開",
      detail: lastDate
        ? `最後の記録は ${formatRelative(lastDate)}`
        : "新しい記録から始めよう",
      tone: "rest",
    };
  }

  const toneClasses: Record<typeof status.tone, string> = {
    fire: "from-orange-500/15 to-rose-500/10 border-orange-300/60 text-orange-700 dark:from-orange-500/15 dark:to-rose-500/10 dark:border-orange-400/30 dark:text-orange-300",
    warn: "from-amber-500/15 to-yellow-500/10 border-amber-300/60 text-amber-800 dark:from-amber-500/15 dark:to-yellow-500/10 dark:border-amber-400/30 dark:text-amber-200",
    rest: "from-zinc-200/40 to-zinc-100/40 border-zinc-200 text-zinc-700 dark:from-zinc-800/60 dark:to-zinc-900/40 dark:border-zinc-700 dark:text-zinc-200",
  };

  return (
    <section className="grid gap-2 sm:grid-cols-4">
      <motion.div
        initial={{ opacity: 0, y: 6 }}
        animate={{ opacity: 1, y: 0 }}
        className={`relative overflow-hidden rounded-xl border bg-gradient-to-br p-4 shadow-sm sm:col-span-2 ${toneClasses[status.tone]}`}
      >
        <div className="flex items-center gap-3">
          <span className="text-3xl">{status.icon}</span>
          <div className="min-w-0 flex-1">
            <p className="text-[10px] font-semibold uppercase tracking-widest opacity-70">
              連続記録 (current streak)
            </p>
            <p className="mt-0.5 text-lg font-bold leading-tight">
              {status.label}
            </p>
            <p className="mt-1 text-[11px] opacity-80">{status.detail}</p>
          </div>
        </div>
      </motion.div>

      <StatCard
        icon="🏆"
        label="最長記録"
        value={longest > 0 ? `${longest} 日` : "—"}
        sub="これまでの連続記録"
      />
      <StatCard
        icon="📚"
        label="記録した日数 / 累計"
        value={`${totalDays} 日`}
        sub={`合計 ${totalEntries} 件のエントリ`}
      />
    </section>
  );
}

function StatCard({
  icon,
  label,
  value,
  sub,
}: {
  icon: string;
  label: string;
  value: string;
  sub: string;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 6 }}
      animate={{ opacity: 1, y: 0 }}
      className="rounded-xl border border-zinc-200 bg-white p-4 shadow-sm dark:border-zinc-800 dark:bg-zinc-900/40"
    >
      <div className="flex items-center gap-2">
        <span className="text-lg">{icon}</span>
        <p className="text-[10px] font-semibold uppercase tracking-widest text-zinc-500 dark:text-zinc-400">
          {label}
        </p>
      </div>
      <p className="mt-1 text-2xl font-bold tabular-nums text-zinc-900 dark:text-zinc-100">
        {value}
      </p>
      <p className="text-[11px] text-zinc-500 dark:text-zinc-400">{sub}</p>
    </motion.div>
  );
}

function formatRelative(dateKey: string | null): string {
  if (!dateKey) return "—";
  const d = new Date(`${dateKey}T00:00:00`);
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const diff = Math.round((today.getTime() - d.getTime()) / 86400000);
  if (diff === 0) return "今日";
  if (diff === 1) return "昨日";
  if (diff < 7) return `${diff} 日前`;
  return d.toLocaleDateString("ja-JP", { month: "2-digit", day: "2-digit" });
}
