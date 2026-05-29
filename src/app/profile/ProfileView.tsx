"use client";

import { useCallback, useEffect, useState } from "react";
import Link from "next/link";
import { useAuth } from "@/lib/auth/context";
import { getMyProfile, updateProfile } from "@/lib/profile";

export function ProfileView() {
  const { enabled, ready, user } = useAuth();

  const [loading, setLoading] = useState(true);
  const [name, setName] = useState("");
  const [avatar, setAvatar] = useState("");
  const [githubAvatar, setGithubAvatar] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    const run = async () => {
      if (!enabled || !user) {
        if (!cancelled) setLoading(false);
        return;
      }
      const info = await getMyProfile();
      if (!cancelled) {
        if (info) {
          setName(info.profile.displayName);
          setAvatar(info.profile.avatarUrl ?? "");
          setGithubAvatar(info.githubAvatar);
        }
        setLoading(false);
      }
    };
    void run();
    return () => {
      cancelled = true;
    };
  }, [enabled, user]);

  const onSave = useCallback(async () => {
    if (!name.trim() || busy) return;
    setBusy(true);
    setError(null);
    setSaved(false);
    const ok = await updateProfile(name.trim(), avatar.trim() || null);
    setBusy(false);
    if (!ok) {
      setError("保存に失敗しました。時間をおいて再度お試しください。");
      return;
    }
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  }, [name, avatar, busy]);

  if (!ready || loading) {
    return <p className="text-sm text-zinc-500 dark:text-zinc-400">読み込み中...</p>;
  }
  if (!enabled || !user) {
    return (
      <div className="space-y-4">
        <Breadcrumb />
        <p className="rounded-xl border border-dashed border-zinc-300 bg-white/40 p-6 text-center text-sm text-zinc-500 dark:border-zinc-700 dark:bg-zinc-900/30 dark:text-zinc-400">
          プロフィールを編集するにはログインが必要です。
        </p>
      </div>
    );
  }

  const previewAvatar = avatar.trim() || null;

  return (
    <div className="space-y-8">
      <Breadcrumb />
      <header>
        <p className="text-[10px] font-semibold uppercase tracking-widest text-rose-600 dark:text-rose-400">
          Profile
        </p>
        <h1 className="mt-1 text-2xl font-bold tracking-tight text-zinc-900 dark:text-zinc-50">
          プロフィール設定
        </h1>
        <p className="mt-2 text-sm text-zinc-600 dark:text-zinc-400">
          グループの一覧や投稿に表示される名前とアイコンを設定できます。
        </p>
      </header>

      {error && (
        <p className="rounded-lg border border-rose-200 bg-rose-50 px-3 py-2 text-sm text-rose-700 dark:border-rose-500/30 dark:bg-rose-500/10 dark:text-rose-300">
          {error}
        </p>
      )}

      <div className="flex items-center gap-4">
        <span className="flex h-16 w-16 shrink-0 items-center justify-center overflow-hidden rounded-full border border-zinc-200 bg-zinc-100 dark:border-white/10 dark:bg-zinc-800">
          {previewAvatar ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={previewAvatar} alt="" className="h-full w-full object-cover" />
          ) : (
            <span className="text-xl font-bold text-zinc-500 dark:text-zinc-300">
              {(name || "U")[0]?.toUpperCase()}
            </span>
          )}
        </span>
        <div className="text-xs text-zinc-500 dark:text-zinc-400">
          プレビュー
        </div>
      </div>

      <div className="space-y-4">
        <label className="block">
          <span className="mb-1 block text-sm font-semibold text-zinc-900 dark:text-zinc-100">
            表示名
          </span>
          <input
            value={name}
            onChange={(e) => setName(e.target.value)}
            maxLength={60}
            placeholder="表示名"
            className="w-full rounded-lg border border-zinc-200 bg-white px-3 py-2 text-sm text-zinc-900 placeholder:text-zinc-400 focus:border-rose-400 focus:outline-none focus:ring-2 focus:ring-rose-500/20 dark:border-white/10 dark:bg-white/5 dark:text-zinc-100"
          />
        </label>

        <label className="block">
          <span className="mb-1 block text-sm font-semibold text-zinc-900 dark:text-zinc-100">
            アイコン画像 URL
          </span>
          <input
            value={avatar}
            onChange={(e) => setAvatar(e.target.value)}
            maxLength={2000}
            placeholder="https://..."
            className="w-full rounded-lg border border-zinc-200 bg-white px-3 py-2 text-sm text-zinc-900 placeholder:text-zinc-400 focus:border-rose-400 focus:outline-none focus:ring-2 focus:ring-rose-500/20 dark:border-white/10 dark:bg-white/5 dark:text-zinc-100"
          />
          <span className="mt-1 block text-xs text-zinc-500 dark:text-zinc-400">
            画像の URL を貼り付けてください。空にするとイニシャル表示になります。
          </span>
        </label>

        <div className="flex flex-wrap items-center gap-3">
          <button
            type="button"
            onClick={() => void onSave()}
            disabled={busy || !name.trim()}
            className="rounded-lg bg-rose-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-rose-500 disabled:opacity-50"
          >
            保存する
          </button>
          {githubAvatar && (
            <button
              type="button"
              onClick={() => setAvatar(githubAvatar)}
              className="rounded-lg border border-zinc-300 px-3 py-2 text-xs font-semibold text-zinc-600 transition hover:border-rose-400 hover:text-rose-600 dark:border-zinc-700 dark:text-zinc-300"
            >
              GitHub のアイコンに戻す
            </button>
          )}
          {saved && (
            <span className="text-xs font-medium text-emerald-600 dark:text-emerald-400">
              保存しました
            </span>
          )}
        </div>
      </div>
    </div>
  );
}

function Breadcrumb() {
  return (
    <div className="flex items-center gap-2 text-xs text-zinc-500 dark:text-zinc-400">
      <Link
        href="/"
        className="hover:text-rose-600 hover:underline dark:hover:text-rose-300"
      >
        ホーム
      </Link>
      <span>›</span>
      <span className="font-medium text-zinc-700 dark:text-zinc-200">
        プロフィール設定
      </span>
    </div>
  );
}
