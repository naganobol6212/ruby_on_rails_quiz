"use client";

import { useMemo, useState } from "react";
import { toDateKey } from "@/lib/journal";

type Props = {
  /** 日別の件数 Map (key: YYYY-MM-DD) */
  counts: Map<string, number>;
  /** 何日分表示するか (default: 直近 26 週 = 約半年) */
  weeks?: number;
};

/**
 * GitHub 風ヒートマップ。各セル = 1 日。
 * 色の濃さは件数で 4 段階。ホバーで日付 + 件数を tooltip 表示。
 */
export function JournalHeatmap({ counts, weeks = 26 }: Props) {
  const [hover, setHover] = useState<{
    date: string;
    count: number;
    x: number;
    y: number;
  } | null>(null);

  // セル配列を生成 (古い日 → 新しい日)
  // 起点 = 今日の (weeks * 7 - 1) 日前、それを日曜まで戻して整列
  const { cells, monthLabels, weekday } = useMemo(() => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const startBase = new Date(today.getTime() - (weeks * 7 - 1) * 86400000);
    // start を直前の日曜まで戻す (列が綺麗に並ぶ)
    const startDow = startBase.getDay();
    const start = new Date(startBase.getTime() - startDow * 86400000);

    const totalCells = (weeks + 1) * 7; // +1 週で余白を確保
    const cells: { date: Date; key: string; count: number; inRange: boolean }[] = [];
    for (let i = 0; i < totalCells; i++) {
      const date = new Date(start.getTime() + i * 86400000);
      const key = toDateKey(date);
      const count = counts.get(key) ?? 0;
      const inRange = date <= today && date >= startBase;
      cells.push({ date, key, count, inRange });
    }

    // 月ラベル: 各週の最初の日 (日曜) で月が切り替わったらラベル
    const monthLabels: { weekIndex: number; label: string }[] = [];
    let lastMonth = -1;
    for (let w = 0; w < weeks + 1; w++) {
      const firstOfWeek = cells[w * 7].date;
      if (firstOfWeek.getMonth() !== lastMonth) {
        monthLabels.push({
          weekIndex: w,
          label: `${firstOfWeek.getMonth() + 1}月`,
        });
        lastMonth = firstOfWeek.getMonth();
      }
    }

    const weekday = ["日", "月", "火", "水", "木", "金", "土"];

    return { cells, monthLabels, weekday };
  }, [counts, weeks]);

  // count → 色クラス
  const cellClass = (count: number, inRange: boolean) => {
    if (!inRange) return "bg-transparent";
    if (count === 0) return "bg-zinc-200/70 dark:bg-zinc-800";
    if (count === 1) return "bg-rose-200 dark:bg-rose-500/30";
    if (count === 2) return "bg-rose-400 dark:bg-rose-500/55";
    if (count === 3) return "bg-rose-500 dark:bg-rose-500/80";
    return "bg-rose-600 dark:bg-rose-400";
  };

  return (
    <div className="relative overflow-x-auto rounded-xl border border-zinc-200 bg-white p-4 dark:border-zinc-800 dark:bg-zinc-900/40">
      <div className="mb-2 flex items-center justify-between">
        <h3 className="text-sm font-semibold text-zinc-800 dark:text-zinc-200">
          📅 直近 {weeks} 週の記録ヒートマップ
        </h3>
        <Legend />
      </div>

      <div className="inline-block">
        {/* 月ラベル */}
        <div
          className="ml-6 grid gap-x-1 text-[10px] text-zinc-500 dark:text-zinc-400"
          style={{
            gridTemplateColumns: `repeat(${weeks + 1}, 12px)`,
          }}
        >
          {Array.from({ length: weeks + 1 }, (_, w) => {
            const label = monthLabels.find((m) => m.weekIndex === w)?.label;
            return (
              <div key={w} className="h-3 whitespace-nowrap">
                {label ?? ""}
              </div>
            );
          })}
        </div>

        {/* 曜日ラベル + セル本体 */}
        <div className="flex gap-1">
          <div className="flex w-5 flex-col justify-between py-0.5 text-[9px] text-zinc-400 dark:text-zinc-500">
            {weekday.map((w, i) => (
              <span key={i} className="h-3 leading-3">
                {i % 2 === 1 ? w : ""}
              </span>
            ))}
          </div>

          <div
            className="grid gap-1"
            style={{
              gridTemplateColumns: `repeat(${weeks + 1}, 12px)`,
              gridAutoFlow: "column",
              gridTemplateRows: "repeat(7, 12px)",
            }}
          >
            {cells.map((c) => (
              <button
                type="button"
                key={c.key}
                aria-label={
                  c.inRange
                    ? `${c.date.toLocaleDateString("ja-JP")} に ${c.count} 件`
                    : ""
                }
                disabled={!c.inRange}
                onMouseEnter={(e) => {
                  if (!c.inRange) return;
                  const rect = (e.target as HTMLElement).getBoundingClientRect();
                  setHover({
                    date: c.date.toLocaleDateString("ja-JP", {
                      year: "numeric",
                      month: "long",
                      day: "numeric",
                      weekday: "short",
                    }),
                    count: c.count,
                    x: rect.left + rect.width / 2,
                    y: rect.top,
                  });
                }}
                onMouseLeave={() => setHover(null)}
                className={`h-3 w-3 rounded-sm transition-transform hover:scale-125 disabled:cursor-default ${cellClass(c.count, c.inRange)}`}
              />
            ))}
          </div>
        </div>
      </div>

      {/* Tooltip */}
      {hover && (
        <div
          className="pointer-events-none fixed z-50 -translate-x-1/2 -translate-y-full rounded-md bg-zinc-900 px-2 py-1 text-[10px] font-medium text-white shadow-lg dark:bg-zinc-100 dark:text-zinc-900"
          style={{ left: hover.x, top: hover.y - 6 }}
        >
          {hover.date} : {hover.count} 件
        </div>
      )}
    </div>
  );
}

function Legend() {
  return (
    <div className="flex items-center gap-1.5 text-[10px] text-zinc-500 dark:text-zinc-400">
      <span>少</span>
      <span className="h-3 w-3 rounded-sm bg-zinc-200 dark:bg-zinc-800" />
      <span className="h-3 w-3 rounded-sm bg-rose-200 dark:bg-rose-500/30" />
      <span className="h-3 w-3 rounded-sm bg-rose-400 dark:bg-rose-500/55" />
      <span className="h-3 w-3 rounded-sm bg-rose-500 dark:bg-rose-500/80" />
      <span className="h-3 w-3 rounded-sm bg-rose-600 dark:bg-rose-400" />
      <span>多</span>
    </div>
  );
}
