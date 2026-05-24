"use client";

import { useEffect } from "react";
import { latestVersion } from "@/data/changelog";

const SEEN_KEY = "rrq_changelog_seen";

/**
 * /changelog ページを開いたタイミングで、最新バージョンを「既読」として記録。
 * ヘッダーの新着ドットを消すために使う。
 */
export function MarkAllSeen() {
  useEffect(() => {
    try {
      window.localStorage.setItem(SEEN_KEY, latestVersion());
    } catch {
      /* ignore */
    }
  }, []);
  return null;
}
