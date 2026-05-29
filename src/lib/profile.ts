/**
 * プロフィール (グループで使う表示名 / アバター) のデータ層。
 *
 * 正本は Supabase の profiles テーブル。未設定なら GitHub の user_metadata に
 * フォールバックする。更新は update_profile RPC (profiles + 非正規化コピーを一括更新)。
 * スキーマ / RPC は supabase/migrations/0004_profiles.sql を参照。
 */
import { getSupabase } from "@/lib/supabase/client";

export type Profile = {
  displayName: string;
  avatarUrl: string | null;
};

export type ProfileInfo = {
  profile: Profile;
  /** GitHub 由来の既定値 (「GitHub に戻す」用) */
  githubName: string;
  githubAvatar: string | null;
};

/** プロフィール更新を UI に伝えるイベント (AuthButton などが購読)。 */
export const PROFILE_UPDATED_EVENT = "rrq:profile-updated";

export async function getMyProfile(): Promise<ProfileInfo | null> {
  const sb = getSupabase();
  if (!sb) return null;
  // getSession はローカル参照 (getUser はネットワーク往復するため使わない)
  const {
    data: { session },
  } = await sb.auth.getSession();
  const user = session?.user;
  if (!user) return null;

  const meta = (user.user_metadata ?? {}) as Record<string, string | undefined>;
  const githubName =
    meta.user_name ?? meta.preferred_username ?? meta.full_name ?? "user";
  const githubAvatar = meta.avatar_url ?? null;

  const { data } = await sb
    .from("profiles")
    .select("display_name, avatar_url")
    .eq("user_id", user.id)
    .maybeSingle();

  const row = data as { display_name: string; avatar_url: string | null } | null;
  return {
    profile: {
      displayName: row?.display_name?.trim() ? row.display_name : githubName,
      avatarUrl: row?.avatar_url ?? githubAvatar,
    },
    githubName,
    githubAvatar,
  };
}

export async function updateProfile(
  name: string,
  avatarUrl: string | null,
): Promise<boolean> {
  const sb = getSupabase();
  if (!sb) return false;
  const { error } = await sb.rpc("update_profile", {
    p_name: name,
    p_avatar: avatarUrl,
  });
  if (error) {
    console.error("[profile] updateProfile failed", error);
    return false;
  }
  if (typeof window !== "undefined") {
    window.dispatchEvent(new Event(PROFILE_UPDATED_EVENT));
  }
  return true;
}
