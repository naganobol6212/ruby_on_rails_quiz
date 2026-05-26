"use client";

/**
 * 認証状態の React Context。
 *
 * - Supabase 未設定なら user=null のまま、 ログインボタンも非表示にする
 * - 設定済みなら セッション復元 → onAuthStateChange でリアクティブに更新
 * - サインインに成功した直後に sync.ts の `syncOnLogin` を 1 回呼んで
 *   LocalStorage と Supabase をマージする
 */

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import type { Session, User } from "@supabase/supabase-js";
import { getSupabase, isAuthEnabled } from "@/lib/supabase/client";
import { setCurrentUserId, syncOnLogin } from "@/lib/sync";

type AuthState = {
  /** auth 機能 (Supabase) が有効か */
  enabled: boolean;
  /** 初回セッションロードが完了したか */
  ready: boolean;
  user: User | null;
  /** 進行中の同期があるか */
  syncing: boolean;
  signInWithGitHub: () => Promise<void>;
  signOut: () => Promise<void>;
};

const AuthCtx = createContext<AuthState | null>(null);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const enabled = isAuthEnabled();
  const [ready, setReady] = useState(!enabled); // 無効なら即 ready
  const [user, setUser] = useState<User | null>(null);
  const [syncing, setSyncing] = useState(false);

  useEffect(() => {
    if (!enabled) return;
    const sb = getSupabase();
    if (!sb) return;

    let cancelled = false;

    // 初回セッション (リロード後の復元)
    sb.auth.getSession().then(({ data }) => {
      if (cancelled) return;
      const u = data.session?.user ?? null;
      setUser(u);
      setCurrentUserId(u?.id ?? null);
      setReady(true);
    });

    // 状態変化を購読
    const { data: subscription } = sb.auth.onAuthStateChange(
      async (event, session: Session | null) => {
        if (cancelled) return;
        const u = session?.user ?? null;
        setUser(u);
        setCurrentUserId(u?.id ?? null);
        setReady(true);

        // SIGNED_IN イベントで一度だけマージ同期
        if (event === "SIGNED_IN" && session?.user) {
          setSyncing(true);
          try {
            await syncOnLogin(sb, session.user.id);
          } finally {
            if (!cancelled) setSyncing(false);
          }
        }
      },
    );

    return () => {
      cancelled = true;
      subscription.subscription.unsubscribe();
    };
  }, [enabled]);

  const signInWithGitHub = useCallback(async () => {
    const sb = getSupabase();
    if (!sb) return;
    const redirectTo =
      typeof window !== "undefined"
        ? `${window.location.origin}/auth/callback`
        : undefined;
    await sb.auth.signInWithOAuth({
      provider: "github",
      options: { redirectTo },
    });
  }, []);

  const signOut = useCallback(async () => {
    const sb = getSupabase();
    if (!sb) return;
    await sb.auth.signOut();
  }, []);

  const value = useMemo<AuthState>(
    () => ({
      enabled,
      ready,
      user,
      syncing,
      signInWithGitHub,
      signOut,
    }),
    [enabled, ready, user, syncing, signInWithGitHub, signOut],
  );

  return <AuthCtx.Provider value={value}>{children}</AuthCtx.Provider>;
}

export function useAuth(): AuthState {
  const ctx = useContext(AuthCtx);
  if (!ctx) {
    // Provider なしでも壊れないように no-op を返す (静的 export 時のフォールバック)
    return {
      enabled: false,
      ready: true,
      user: null,
      syncing: false,
      signInWithGitHub: async () => {},
      signOut: async () => {},
    };
  }
  return ctx;
}
