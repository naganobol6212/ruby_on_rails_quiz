"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import { latestVersion } from "@/data/changelog";

const SEEN_KEY = "rrq_changelog_seen";

export function ChangelogBadge() {
  const [hasNew, setHasNew] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    try {
      const seen = window.localStorage.getItem(SEEN_KEY);
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setHasNew(seen !== latestVersion());
    } catch {
      /* ignore */
    }
  }, [pathname]);

  return (
    <Link
      href="/changelog"
      aria-label="お知らせ・更新履歴"
      title="お知らせ"
      className="group relative inline-flex h-9 w-9 items-center justify-center rounded-full border border-zinc-200 bg-white text-base text-zinc-600 transition hover:border-rose-300 hover:text-rose-600 dark:border-white/10 dark:bg-white/5 dark:text-zinc-300 dark:hover:border-rose-400/40 dark:hover:text-rose-300"
    >
      <span aria-hidden>🆕</span>
      {hasNew && (
        <span className="absolute -right-0.5 -top-0.5 inline-flex items-center justify-center">
          <span className="absolute h-2.5 w-2.5 animate-ping rounded-full bg-rose-500/70" />
          <span className="relative h-2 w-2 rounded-full bg-rose-500" />
        </span>
      )}
    </Link>
  );
}
