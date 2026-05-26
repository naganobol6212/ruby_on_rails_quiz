"use client";

/**
 * OAuth コールバックページ。
 *
 * Supabase の signInWithOAuth は、 認証完了後に `${origin}/auth/callback` に
 * `#access_token=...` 形式で戻ってくる。 supabase-js は detectSessionInUrl で
 * 自動的にハッシュを解釈してセッションを確立するので、 ここでは何もせず
 * しばらく待ってホームに戻すだけ。
 */

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { getSupabase } from "@/lib/supabase/client";

export default function AuthCallbackPage() {
  const router = useRouter();

  useEffect(() => {
    const sb = getSupabase();
    if (!sb) {
      router.replace("/");
      return;
    }
    // 既存のハッシュを supabase-js が拾うのを待つ
    const { data: subscription } = sb.auth.onAuthStateChange((event) => {
      if (event === "SIGNED_IN" || event === "INITIAL_SESSION") {
        router.replace("/");
      }
    });
    // フォールバック: 3 秒で問答無用に戻す
    const t = window.setTimeout(() => router.replace("/"), 3000);
    return () => {
      subscription.subscription.unsubscribe();
      window.clearTimeout(t);
    };
  }, [router]);

  return (
    <div className="mx-auto flex min-h-[60vh] max-w-md flex-col items-center justify-center px-6 py-14 text-center">
      <div className="mb-4 h-10 w-10 animate-spin rounded-full border-2 border-rose-300 border-t-rose-600" />
      <h1 className="text-base font-bold text-zinc-900 dark:text-zinc-50">
        ログイン処理中...
      </h1>
      <p className="mt-1.5 text-xs text-zinc-500 dark:text-zinc-400">
        ホームへリダイレクトします
      </p>
    </div>
  );
}
