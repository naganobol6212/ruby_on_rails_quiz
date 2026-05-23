"use client";

import { useEffect, useState } from "react";
import { useTheme } from "next-themes";

export function ThemeToggle() {
  const { resolvedTheme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  // ハイドレーション完了後に初めて theme を信頼してアイコン表示
  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setMounted(true);
  }, []);

  const isDark = mounted && resolvedTheme === "dark";

  return (
    <button
      type="button"
      onClick={() => setTheme(isDark ? "light" : "dark")}
      aria-label={isDark ? "ライトモードに切替" : "ダークモードに切替"}
      title={isDark ? "ライトモードに切替" : "ダークモードに切替"}
      className="group inline-flex h-9 w-9 items-center justify-center rounded-full border border-zinc-300 bg-white text-zinc-700 shadow-sm transition hover:border-rose-400 hover:text-rose-500 dark:border-white/15 dark:bg-white/5 dark:text-zinc-300 dark:hover:border-rose-400/60 dark:hover:text-rose-300"
    >
      {/* マウント前はフラッシュ防止のため空 */}
      <span className="text-sm transition-transform group-hover:rotate-12">
        {mounted ? (isDark ? "☀" : "☾") : ""}
      </span>
    </button>
  );
}
