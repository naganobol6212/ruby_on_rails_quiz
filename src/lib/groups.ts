/**
 * 学習グループ機能のデータ層 (Supabase)。
 *
 * すべて RLS で「同じグループのメンバーだけが読める」に守られている。
 * Supabase 未設定 / 未ログイン時は呼び出し側で弾く想定だが、ここでも
 * getSupabase() が null なら安全に空を返す。
 *
 * スキーマ / RLS / RPC は supabase/migrations/0003_groups.sql を参照。
 */
import { getSupabase } from "@/lib/supabase/client";

// ===========================================================================
// 型
// ===========================================================================
export type GroupRole = "owner" | "member";
export type PostKind = "text" | "shared";

export type Group = {
  id: string;
  name: string;
  description: string;
  inviteCode: string;
  ownerId: string;
  createdAt: string;
};

export type GroupMember = {
  groupId: string;
  userId: string;
  role: GroupRole;
  displayName: string;
  avatarUrl: string | null;
  joinedAt: string;
};

export type GroupPost = {
  id: string;
  groupId: string;
  authorId: string;
  authorName: string;
  kind: PostKind;
  title: string;
  body: string;
  source: Record<string, unknown> | null;
  createdAt: string;
  updatedAt: string;
};

export type PostReaction = {
  postId: string;
  userId: string;
  emoji: string;
};

export type PostComment = {
  id: string;
  postId: string;
  authorId: string;
  authorName: string;
  body: string;
  createdAt: string;
};

export type JoinResult =
  | { ok: true; groupId: string }
  | { ok: false; error: "auth" | "invalid" | "unknown" };

// ===========================================================================
// Row 変換
// ===========================================================================
type GroupRow = {
  id: string;
  name: string;
  description: string;
  invite_code: string;
  owner_id: string;
  created_at: string;
};
type MemberRow = {
  group_id: string;
  user_id: string;
  role: GroupRole;
  display_name: string;
  avatar_url: string | null;
  joined_at: string;
};
type PostRow = {
  id: string;
  group_id: string;
  author_id: string;
  author_name: string;
  kind: PostKind;
  title: string;
  body: string;
  source: Record<string, unknown> | null;
  created_at: string;
  updated_at: string;
};
type ReactionRow = { post_id: string; user_id: string; emoji: string };
type CommentRow = {
  id: string;
  post_id: string;
  author_id: string;
  author_name: string;
  body: string;
  created_at: string;
};

const toGroup = (r: GroupRow): Group => ({
  id: r.id,
  name: r.name,
  description: r.description,
  inviteCode: r.invite_code,
  ownerId: r.owner_id,
  createdAt: r.created_at,
});
const toMember = (r: MemberRow): GroupMember => ({
  groupId: r.group_id,
  userId: r.user_id,
  role: r.role,
  displayName: r.display_name,
  avatarUrl: r.avatar_url,
  joinedAt: r.joined_at,
});
const toPost = (r: PostRow): GroupPost => ({
  id: r.id,
  groupId: r.group_id,
  authorId: r.author_id,
  authorName: r.author_name,
  kind: r.kind,
  title: r.title,
  body: r.body,
  source: r.source,
  createdAt: r.created_at,
  updatedAt: r.updated_at,
});
const toReaction = (r: ReactionRow): PostReaction => ({
  postId: r.post_id,
  userId: r.user_id,
  emoji: r.emoji,
});
const toComment = (r: CommentRow): PostComment => ({
  id: r.id,
  postId: r.post_id,
  authorId: r.author_id,
  authorName: r.author_name,
  body: r.body,
  createdAt: r.created_at,
});

/** ログイン中ユーザーの表示名 / アバターを GitHub メタデータから得る。 */
async function currentIdentity(): Promise<{
  id: string;
  name: string;
  avatar: string | null;
} | null> {
  const sb = getSupabase();
  if (!sb) return null;
  // getSession はローカル参照 (getUser はネットワーク往復するため使わない)
  const { data } = await sb.auth.getSession();
  const u = data.session?.user;
  if (!u) return null;
  const m = (u.user_metadata ?? {}) as Record<string, string | undefined>;
  return {
    id: u.id,
    name: m.user_name ?? m.preferred_username ?? m.full_name ?? "user",
    avatar: m.avatar_url ?? null,
  };
}

// ===========================================================================
// グループ
// ===========================================================================
export async function listMyGroups(): Promise<Group[]> {
  const sb = getSupabase();
  if (!sb) return [];
  const { data, error } = await sb
    .from("groups")
    .select("*")
    .order("created_at", { ascending: false });
  if (error) {
    console.error("[groups] listMyGroups failed", error);
    return [];
  }
  return (data as GroupRow[]).map(toGroup);
}

export async function getGroup(id: string): Promise<Group | null> {
  const sb = getSupabase();
  if (!sb) return null;
  const { data, error } = await sb
    .from("groups")
    .select("*")
    .eq("id", id)
    .maybeSingle();
  if (error) {
    console.error("[groups] getGroup failed", error);
    return null;
  }
  return data ? toGroup(data as GroupRow) : null;
}

export async function createGroup(
  name: string,
  description = "",
): Promise<string | null> {
  const sb = getSupabase();
  if (!sb) return null;
  const { data, error } = await sb.rpc("create_group", {
    p_name: name,
    p_description: description,
  });
  if (error) {
    console.error("[groups] createGroup failed", error);
    return null;
  }
  return (data as string) ?? null;
}

export async function joinGroupByCode(code: string): Promise<JoinResult> {
  const sb = getSupabase();
  if (!sb) return { ok: false, error: "unknown" };
  const { data, error } = await sb.rpc("join_group_by_code", { code });
  if (error) {
    const msg = error.message ?? "";
    if (msg.includes("invalid invite code")) return { ok: false, error: "invalid" };
    if (msg.includes("not authenticated")) return { ok: false, error: "auth" };
    console.error("[groups] joinGroupByCode failed", error);
    return { ok: false, error: "unknown" };
  }
  return { ok: true, groupId: data as string };
}

export async function leaveGroup(groupId: string): Promise<boolean> {
  const sb = getSupabase();
  if (!sb) return false;
  const id = (await currentIdentity())?.id;
  if (!id) return false;
  const { error } = await sb
    .from("group_members")
    .delete()
    .eq("group_id", groupId)
    .eq("user_id", id);
  if (error) {
    console.error("[groups] leaveGroup failed", error);
    return false;
  }
  return true;
}

export async function deleteGroup(groupId: string): Promise<boolean> {
  const sb = getSupabase();
  if (!sb) return false;
  const { error } = await sb.from("groups").delete().eq("id", groupId);
  if (error) {
    console.error("[groups] deleteGroup failed", error);
    return false;
  }
  return true;
}

// ===========================================================================
// メンバー
// ===========================================================================
export async function listMembers(groupId: string): Promise<GroupMember[]> {
  const sb = getSupabase();
  if (!sb) return [];
  const { data, error } = await sb
    .from("group_members")
    .select("*")
    .eq("group_id", groupId)
    .order("joined_at", { ascending: true });
  if (error) {
    console.error("[groups] listMembers failed", error);
    return [];
  }
  return (data as MemberRow[]).map(toMember);
}

export async function removeMember(
  groupId: string,
  userId: string,
): Promise<boolean> {
  const sb = getSupabase();
  if (!sb) return false;
  const { error } = await sb
    .from("group_members")
    .delete()
    .eq("group_id", groupId)
    .eq("user_id", userId);
  if (error) {
    console.error("[groups] removeMember failed", error);
    return false;
  }
  return true;
}

// ===========================================================================
// 投稿 (フィード)
// ===========================================================================
export async function listPosts(groupId: string): Promise<GroupPost[]> {
  const sb = getSupabase();
  if (!sb) return [];
  const { data, error } = await sb
    .from("group_posts")
    .select("*")
    .eq("group_id", groupId)
    .order("created_at", { ascending: false });
  if (error) {
    console.error("[groups] listPosts failed", error);
    return [];
  }
  return (data as PostRow[]).map(toPost);
}

async function insertPost(
  groupId: string,
  kind: PostKind,
  title: string,
  body: string,
  source: Record<string, unknown> | null,
): Promise<GroupPost | null> {
  const sb = getSupabase();
  if (!sb) return null;
  const me = await currentIdentity();
  if (!me) return null;
  const { data, error } = await sb
    .from("group_posts")
    .insert({
      group_id: groupId,
      author_id: me.id,
      author_name: me.name,
      kind,
      title,
      body,
      source,
    })
    .select("*")
    .single();
  if (error) {
    console.error("[groups] insertPost failed", error);
    return null;
  }
  return toPost(data as PostRow);
}

/** 自由投稿。 */
export function createTextPost(
  groupId: string,
  body: string,
): Promise<GroupPost | null> {
  return insertPost(groupId, "text", "", body, null);
}

/** ジャーナル / 自己説明などの opt-in 共有 (内容をスナップショット)。 */
export function sharePost(
  groupId: string,
  title: string,
  body: string,
  source: Record<string, unknown> | null = null,
): Promise<GroupPost | null> {
  return insertPost(groupId, "shared", title, body, source);
}

export async function deletePost(postId: string): Promise<boolean> {
  const sb = getSupabase();
  if (!sb) return false;
  const { error } = await sb.from("group_posts").delete().eq("id", postId);
  if (error) {
    console.error("[groups] deletePost failed", error);
    return false;
  }
  return true;
}

// ===========================================================================
// リアクション (スタンプ)
// ===========================================================================
export async function listReactions(groupId: string): Promise<PostReaction[]> {
  const sb = getSupabase();
  if (!sb) return [];
  // 自グループの投稿に紐づくリアクションを取得 (RLS で自グループに限定される)
  const { data, error } = await sb
    .from("post_reactions")
    .select("post_id, user_id, emoji, group_posts!inner(group_id)")
    .eq("group_posts.group_id", groupId);
  if (error) {
    console.error("[groups] listReactions failed", error);
    return [];
  }
  return (data as unknown as ReactionRow[]).map(toReaction);
}

export async function addReaction(
  postId: string,
  emoji: string,
): Promise<boolean> {
  const sb = getSupabase();
  if (!sb) return false;
  const me = await currentIdentity();
  if (!me) return false;
  const { error } = await sb
    .from("post_reactions")
    .upsert(
      { post_id: postId, user_id: me.id, emoji },
      { onConflict: "post_id,user_id,emoji" },
    );
  if (error) {
    console.error("[groups] addReaction failed", error);
    return false;
  }
  return true;
}

export async function removeReaction(
  postId: string,
  emoji: string,
): Promise<boolean> {
  const sb = getSupabase();
  if (!sb) return false;
  const me = await currentIdentity();
  if (!me) return false;
  const { error } = await sb
    .from("post_reactions")
    .delete()
    .eq("post_id", postId)
    .eq("user_id", me.id)
    .eq("emoji", emoji);
  if (error) {
    console.error("[groups] removeReaction failed", error);
    return false;
  }
  return true;
}

// ===========================================================================
// コメント
// ===========================================================================
export async function listComments(groupId: string): Promise<PostComment[]> {
  const sb = getSupabase();
  if (!sb) return [];
  const { data, error } = await sb
    .from("post_comments")
    .select("id, post_id, author_id, author_name, body, created_at, group_posts!inner(group_id)")
    .eq("group_posts.group_id", groupId)
    .order("created_at", { ascending: true });
  if (error) {
    console.error("[groups] listComments failed", error);
    return [];
  }
  return (data as unknown as CommentRow[]).map(toComment);
}

export async function addComment(
  postId: string,
  body: string,
): Promise<PostComment | null> {
  const sb = getSupabase();
  if (!sb) return null;
  const me = await currentIdentity();
  if (!me) return null;
  const { data, error } = await sb
    .from("post_comments")
    .insert({ post_id: postId, author_id: me.id, author_name: me.name, body })
    .select("id, post_id, author_id, author_name, body, created_at")
    .single();
  if (error) {
    console.error("[groups] addComment failed", error);
    return null;
  }
  return toComment(data as CommentRow);
}

export async function deleteComment(id: string): Promise<boolean> {
  const sb = getSupabase();
  if (!sb) return false;
  const { error } = await sb.from("post_comments").delete().eq("id", id);
  if (error) {
    console.error("[groups] deleteComment failed", error);
    return false;
  }
  return true;
}
