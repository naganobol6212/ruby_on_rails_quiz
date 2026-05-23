"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { tracks } from "@/data/tracks";
import { questionsByTrack } from "@/data/all-questions";
import { loadProgress } from "@/lib/storage";

export function TrackPicker() {
  const [stats, setStats] = useState<Record<string, { solved: number; total: number }>>({});

  useEffect(() => {
    const refresh = () => {
      const attempts = loadProgress().attempts;
      const result: Record<string, { solved: number; total: number }> = {};
      tracks.forEach((t) => {
        const qs = questionsByTrack(t.id);
        const solved = qs.filter((q) => attempts[q.id]?.solved).length;
        result[t.id] = { solved, total: qs.length };
      });
      setStats(result);
    };
    refresh();
    window.addEventListener("rrq:progress-updated", refresh);
    window.addEventListener("storage", refresh);
    return () => {
      window.removeEventListener("rrq:progress-updated", refresh);
      window.removeEventListener("storage", refresh);
    };
  }, []);

  return (
    <div className="grid gap-3 sm:grid-cols-2">
      {tracks.map((track) => {
        const s = stats[track.id] ?? { solved: 0, total: 0 };
        const isComingSoon = track.status === "coming-soon";
        const progressPct =
          s.total === 0 ? 0 : Math.round((s.solved / s.total) * 100);

        const card = (
          <div
            className={`group relative h-full overflow-hidden rounded-2xl border border-zinc-200 bg-white p-5 shadow-sm ring-1 ring-transparent transition-all duration-300 dark:border-zinc-800 dark:bg-zinc-900/40 ${
              isComingSoon
                ? "opacity-60"
                : "hover:-translate-y-0.5 hover:shadow-md dark:hover:bg-zinc-900/60 " +
                  track.ringClass
            }`}
          >
            <div
              className={`pointer-events-none absolute inset-0 bg-gradient-to-br opacity-0 transition-opacity duration-300 group-hover:opacity-100 ${track.accentClass}`}
            />

            {isComingSoon && (
              <div className="absolute right-3 top-3 z-10 rounded-full border border-zinc-300 bg-white/80 px-2 py-0.5 text-[10px] font-semibold text-zinc-600 dark:border-zinc-700 dark:bg-zinc-800/80 dark:text-zinc-300">
                Coming Soon
              </div>
            )}

            <div className="relative">
              <div className="mb-3 flex items-start justify-between">
                <span className="text-4xl drop-shadow-sm">{track.emoji}</span>
                {!isComingSoon && (
                  <span className="rounded-full border border-zinc-200 bg-zinc-50 px-2.5 py-1 font-mono text-[10px] text-zinc-600 dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-300">
                    {s.total} 問
                  </span>
                )}
              </div>

              <h3 className="text-lg font-bold text-zinc-900 dark:text-zinc-100">
                {track.name}
              </h3>
              <p className="mt-1.5 line-clamp-2 text-xs leading-relaxed text-zinc-600 dark:text-zinc-400">
                {track.description}
              </p>

              {!isComingSoon && s.total > 0 && (
                <>
                  <div className="mt-4 h-1 w-full overflow-hidden rounded-full bg-zinc-100 dark:bg-zinc-800">
                    <motion.div
                      className="h-full rounded-full bg-gradient-to-r from-sky-500 to-cyan-500"
                      initial={{ width: 0 }}
                      animate={{ width: `${progressPct}%` }}
                      transition={{ duration: 0.6, ease: "easeOut" }}
                    />
                  </div>
                  <div className="mt-2 flex items-center justify-between text-[10px] text-zinc-500 dark:text-zinc-400">
                    <span>
                      正解 {s.solved} / {s.total}
                    </span>
                    <span className="font-medium text-zinc-500 transition-colors group-hover:text-rose-600 dark:text-zinc-400 dark:group-hover:text-rose-300">
                      開く →
                    </span>
                  </div>
                </>
              )}
              {!isComingSoon && s.total === 0 && (
                <p className="mt-4 text-[11px] italic text-zinc-500 dark:text-zinc-400">
                  まだ問題がありません
                </p>
              )}
            </div>
          </div>
        );

        if (isComingSoon) {
          return (
            <div key={track.id} className="cursor-not-allowed">
              {card}
            </div>
          );
        }
        return (
          <Link key={track.id} href={`/track/${track.id}`}>
            {card}
          </Link>
        );
      })}
    </div>
  );
}
