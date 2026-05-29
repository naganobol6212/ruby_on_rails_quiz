-- CodeDojo: グループ機能 (学習グループ + 共有フィード + スタンプ/コメント)
--
-- 使い方:
--   0001_init.sql 実行済みの前提で、 Supabase ダッシュボード → SQL Editor に
--   本ファイルを貼り付けて実行する。
--
-- 設計:
--   - RLS で「同じグループのメンバーだけが互いの投稿を読める」に限定。
--   - メンバー判定は SECURITY DEFINER 関数 is_group_member() に隔離し、
--     group_members を参照するポリシーの無限再帰を避ける。
--   - 未参加者はグループ行を SELECT できないため、 参加・作成は
--     SECURITY DEFINER の RPC (join_group_by_code / create_group) 経由で行う。
--   - opt-in 共有はスナップショット方式 (group_posts に本文をコピー)。

-- ============================================================================
-- テーブル
-- ============================================================================
CREATE TABLE IF NOT EXISTS public.groups (
  id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name        TEXT NOT NULL CHECK (char_length(name) BETWEEN 1 AND 80),
  description TEXT NOT NULL DEFAULT '' CHECK (char_length(description) <= 500),
  invite_code TEXT NOT NULL UNIQUE,
  owner_id    UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  created_at  TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS public.group_members (
  group_id     UUID NOT NULL REFERENCES public.groups(id) ON DELETE CASCADE,
  user_id      UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  role         TEXT NOT NULL DEFAULT 'member' CHECK (role IN ('owner', 'member')),
  display_name TEXT NOT NULL DEFAULT '',
  avatar_url   TEXT,
  joined_at    TIMESTAMPTZ NOT NULL DEFAULT now(),
  PRIMARY KEY (group_id, user_id)
);
CREATE INDEX IF NOT EXISTS idx_group_members_user ON public.group_members (user_id);

CREATE TABLE IF NOT EXISTS public.group_posts (
  id         UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  group_id   UUID NOT NULL REFERENCES public.groups(id) ON DELETE CASCADE,
  author_id  UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  author_name TEXT NOT NULL DEFAULT '',
  kind       TEXT NOT NULL DEFAULT 'text' CHECK (kind IN ('text', 'shared')),
  title      TEXT NOT NULL DEFAULT '' CHECK (char_length(title) <= 200),
  body       TEXT NOT NULL DEFAULT '' CHECK (char_length(body) <= 5000),
  source     JSONB,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
CREATE INDEX IF NOT EXISTS idx_group_posts_group_created
  ON public.group_posts (group_id, created_at DESC);

CREATE TABLE IF NOT EXISTS public.post_reactions (
  post_id    UUID NOT NULL REFERENCES public.group_posts(id) ON DELETE CASCADE,
  user_id    UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  emoji      TEXT NOT NULL CHECK (char_length(emoji) <= 16),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  PRIMARY KEY (post_id, user_id, emoji)
);

CREATE TABLE IF NOT EXISTS public.post_comments (
  id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  post_id     UUID NOT NULL REFERENCES public.group_posts(id) ON DELETE CASCADE,
  author_id   UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  author_name TEXT NOT NULL DEFAULT '',
  body        TEXT NOT NULL CHECK (char_length(body) BETWEEN 1 AND 2000),
  created_at  TIMESTAMPTZ NOT NULL DEFAULT now()
);
CREATE INDEX IF NOT EXISTS idx_post_comments_post_created
  ON public.post_comments (post_id, created_at);

-- ============================================================================
-- メンバー判定 (SECURITY DEFINER で RLS 再帰を回避)
-- ============================================================================
CREATE OR REPLACE FUNCTION public.is_group_member(gid UUID)
  RETURNS BOOLEAN
  LANGUAGE sql
  SECURITY DEFINER
  SET search_path = public, pg_temp
  STABLE
AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.group_members
    WHERE group_id = gid AND user_id = auth.uid()
  );
$$;

-- ============================================================================
-- RLS
-- ============================================================================
ALTER TABLE public.groups         ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.group_members  ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.group_posts    ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.post_reactions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.post_comments  ENABLE ROW LEVEL SECURITY;

-- groups: メンバーは読める / 作成は本人が owner / 更新・削除は owner のみ
DROP POLICY IF EXISTS groups_select ON public.groups;
CREATE POLICY groups_select ON public.groups
  FOR SELECT USING (public.is_group_member(id));
DROP POLICY IF EXISTS groups_insert ON public.groups;
CREATE POLICY groups_insert ON public.groups
  FOR INSERT WITH CHECK (owner_id = auth.uid());
DROP POLICY IF EXISTS groups_update ON public.groups;
CREATE POLICY groups_update ON public.groups
  FOR UPDATE USING (owner_id = auth.uid()) WITH CHECK (owner_id = auth.uid());
DROP POLICY IF EXISTS groups_delete ON public.groups;
CREATE POLICY groups_delete ON public.groups
  FOR DELETE USING (owner_id = auth.uid());

-- group_members: 同一グループのメンバーは閲覧可 / 自分の参加行を追加 /
--                自分は退会、 owner はメンバー除名できる
DROP POLICY IF EXISTS gm_select ON public.group_members;
CREATE POLICY gm_select ON public.group_members
  FOR SELECT USING (public.is_group_member(group_id));
DROP POLICY IF EXISTS gm_insert ON public.group_members;
CREATE POLICY gm_insert ON public.group_members
  FOR INSERT WITH CHECK (user_id = auth.uid());
DROP POLICY IF EXISTS gm_delete ON public.group_members;
CREATE POLICY gm_delete ON public.group_members
  FOR DELETE USING (
    user_id = auth.uid()
    OR EXISTS (SELECT 1 FROM public.groups g
               WHERE g.id = group_id AND g.owner_id = auth.uid())
  );

-- group_posts: メンバーは閲覧・投稿可 / 編集・削除は投稿者か owner
DROP POLICY IF EXISTS gp_select ON public.group_posts;
CREATE POLICY gp_select ON public.group_posts
  FOR SELECT USING (public.is_group_member(group_id));
DROP POLICY IF EXISTS gp_insert ON public.group_posts;
CREATE POLICY gp_insert ON public.group_posts
  FOR INSERT WITH CHECK (public.is_group_member(group_id) AND author_id = auth.uid());
DROP POLICY IF EXISTS gp_update ON public.group_posts;
CREATE POLICY gp_update ON public.group_posts
  FOR UPDATE USING (author_id = auth.uid()) WITH CHECK (author_id = auth.uid());
DROP POLICY IF EXISTS gp_delete ON public.group_posts;
CREATE POLICY gp_delete ON public.group_posts
  FOR DELETE USING (
    author_id = auth.uid()
    OR EXISTS (SELECT 1 FROM public.groups g
               WHERE g.id = group_id AND g.owner_id = auth.uid())
  );

-- post_reactions: 投稿のグループのメンバーのみ / 自分の行だけ追加・削除
DROP POLICY IF EXISTS pr_select ON public.post_reactions;
CREATE POLICY pr_select ON public.post_reactions
  FOR SELECT USING (EXISTS (
    SELECT 1 FROM public.group_posts p
    WHERE p.id = post_id AND public.is_group_member(p.group_id)
  ));
DROP POLICY IF EXISTS pr_insert ON public.post_reactions;
CREATE POLICY pr_insert ON public.post_reactions
  FOR INSERT WITH CHECK (user_id = auth.uid() AND EXISTS (
    SELECT 1 FROM public.group_posts p
    WHERE p.id = post_id AND public.is_group_member(p.group_id)
  ));
DROP POLICY IF EXISTS pr_delete ON public.post_reactions;
CREATE POLICY pr_delete ON public.post_reactions
  FOR DELETE USING (user_id = auth.uid());

-- post_comments: 投稿のグループのメンバーは閲覧・投稿可 / 削除は投稿者か owner
DROP POLICY IF EXISTS pc_select ON public.post_comments;
CREATE POLICY pc_select ON public.post_comments
  FOR SELECT USING (EXISTS (
    SELECT 1 FROM public.group_posts p
    WHERE p.id = post_id AND public.is_group_member(p.group_id)
  ));
DROP POLICY IF EXISTS pc_insert ON public.post_comments;
CREATE POLICY pc_insert ON public.post_comments
  FOR INSERT WITH CHECK (author_id = auth.uid() AND EXISTS (
    SELECT 1 FROM public.group_posts p
    WHERE p.id = post_id AND public.is_group_member(p.group_id)
  ));
DROP POLICY IF EXISTS pc_delete ON public.post_comments;
CREATE POLICY pc_delete ON public.post_comments
  FOR DELETE USING (
    author_id = auth.uid()
    OR EXISTS (SELECT 1 FROM public.group_posts p
               JOIN public.groups g ON g.id = p.group_id
               WHERE p.id = post_id AND g.owner_id = auth.uid())
  );

-- ============================================================================
-- RPC: グループ作成 (作成 + owner のメンバー登録を不可分に)
-- ============================================================================
CREATE OR REPLACE FUNCTION public.create_group(p_name TEXT, p_description TEXT DEFAULT '')
  RETURNS UUID
  LANGUAGE plpgsql
  SECURITY DEFINER
  SET search_path = public, pg_temp
AS $$
DECLARE
  gid   UUID;
  code  TEXT;
  uname TEXT;
  aurl  TEXT;
BEGIN
  IF auth.uid() IS NULL THEN
    RAISE EXCEPTION 'not authenticated';
  END IF;
  IF p_name IS NULL OR char_length(trim(p_name)) = 0 THEN
    RAISE EXCEPTION 'name required';
  END IF;

  -- 推測されにくい招待コード (衝突したら引き直す)
  LOOP
    code := substr(replace(gen_random_uuid()::text, '-', ''), 1, 10);
    EXIT WHEN NOT EXISTS (SELECT 1 FROM public.groups WHERE invite_code = code);
  END LOOP;

  INSERT INTO public.groups (name, description, invite_code, owner_id)
  VALUES (trim(p_name), COALESCE(p_description, ''), code, auth.uid())
  RETURNING id INTO gid;

  SELECT COALESCE(u.raw_user_meta_data->>'user_name',
                  u.raw_user_meta_data->>'full_name', ''),
         u.raw_user_meta_data->>'avatar_url'
    INTO uname, aurl
  FROM auth.users u WHERE u.id = auth.uid();

  INSERT INTO public.group_members (group_id, user_id, role, display_name, avatar_url)
  VALUES (gid, auth.uid(), 'owner', uname, aurl);

  RETURN gid;
END;
$$;

-- ============================================================================
-- RPC: 招待コードで参加 (未参加者はグループを SELECT できないため RPC 経由)
-- ============================================================================
CREATE OR REPLACE FUNCTION public.join_group_by_code(code TEXT)
  RETURNS UUID
  LANGUAGE plpgsql
  SECURITY DEFINER
  SET search_path = public, pg_temp
AS $$
DECLARE
  gid   UUID;
  uname TEXT;
  aurl  TEXT;
BEGIN
  IF auth.uid() IS NULL THEN
    RAISE EXCEPTION 'not authenticated';
  END IF;

  SELECT id INTO gid FROM public.groups WHERE invite_code = trim(code);
  IF gid IS NULL THEN
    RAISE EXCEPTION 'invalid invite code';
  END IF;

  SELECT COALESCE(u.raw_user_meta_data->>'user_name',
                  u.raw_user_meta_data->>'full_name', ''),
         u.raw_user_meta_data->>'avatar_url'
    INTO uname, aurl
  FROM auth.users u WHERE u.id = auth.uid();

  INSERT INTO public.group_members (group_id, user_id, role, display_name, avatar_url)
  VALUES (gid, auth.uid(), 'member', uname, aurl)
  ON CONFLICT (group_id, user_id) DO NOTHING;

  RETURN gid;
END;
$$;

-- 認証済みユーザーのみ RPC を実行可能に
REVOKE ALL ON FUNCTION public.create_group(TEXT, TEXT) FROM PUBLIC, anon;
REVOKE ALL ON FUNCTION public.join_group_by_code(TEXT) FROM PUBLIC, anon;
GRANT EXECUTE ON FUNCTION public.create_group(TEXT, TEXT) TO authenticated;
GRANT EXECUTE ON FUNCTION public.join_group_by_code(TEXT) TO authenticated;
