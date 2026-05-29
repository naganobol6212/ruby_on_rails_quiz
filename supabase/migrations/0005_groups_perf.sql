-- CodeDojo: グループ機能の RLS 性能改善
--
-- 背景:
--   0003_groups.sql の RLS ポリシーは行ごとに auth.uid() / is_group_member() を
--   評価していた。PostgreSQL の RLS では auth.uid() を (SELECT auth.uid()) で
--   ラップすると、プラン時に 1 回だけ評価する InitPlan に畳まれ、行数に比例した
--   再評価 (N+1 的な遅延) を避けられる。あわせて結合・参照で使う列に索引を足す。
--
-- 使い方: 0003_groups.sql 実行済みの前提で SQL Editor に貼って実行する。
--   アプリ側コードの変更は不要。

-- ============================================================================
-- 1. is_group_member 内の auth.uid() をサブクエリ化 (行ごと評価を回避)
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
    WHERE group_id = gid AND user_id = (SELECT auth.uid())
  );
$$;

-- ============================================================================
-- 2. 不足インデックスを追加 (RLS の EXISTS 結合 / 一覧取得を高速化)
-- ============================================================================
CREATE INDEX IF NOT EXISTS idx_post_reactions_post ON public.post_reactions (post_id);
CREATE INDEX IF NOT EXISTS idx_post_comments_post  ON public.post_comments (post_id);
-- is_group_member の WHERE (group_id, user_id) 用 (PK は (group_id,user_id) だが
-- user_id 起点の検索もあるため group_id+user_id の複合を明示)
CREATE INDEX IF NOT EXISTS idx_group_members_group_user
  ON public.group_members (group_id, user_id);

-- ============================================================================
-- 3. ポリシーの auth.uid() を (SELECT auth.uid()) でラップし直す
--    (行ごと評価 → InitPlan の 1 回評価に)
-- ============================================================================

-- groups
DROP POLICY IF EXISTS groups_insert ON public.groups;
CREATE POLICY groups_insert ON public.groups
  FOR INSERT WITH CHECK (owner_id = (SELECT auth.uid()));
DROP POLICY IF EXISTS groups_update ON public.groups;
CREATE POLICY groups_update ON public.groups
  FOR UPDATE USING (owner_id = (SELECT auth.uid()))
  WITH CHECK (owner_id = (SELECT auth.uid()));
DROP POLICY IF EXISTS groups_delete ON public.groups;
CREATE POLICY groups_delete ON public.groups
  FOR DELETE USING (owner_id = (SELECT auth.uid()));

-- group_members
DROP POLICY IF EXISTS gm_insert ON public.group_members;
CREATE POLICY gm_insert ON public.group_members
  FOR INSERT WITH CHECK (user_id = (SELECT auth.uid()));
DROP POLICY IF EXISTS gm_delete ON public.group_members;
CREATE POLICY gm_delete ON public.group_members
  FOR DELETE USING (
    user_id = (SELECT auth.uid())
    OR EXISTS (SELECT 1 FROM public.groups g
               WHERE g.id = group_id AND g.owner_id = (SELECT auth.uid()))
  );

-- group_posts
DROP POLICY IF EXISTS gp_insert ON public.group_posts;
CREATE POLICY gp_insert ON public.group_posts
  FOR INSERT WITH CHECK (
    public.is_group_member(group_id) AND author_id = (SELECT auth.uid())
  );
DROP POLICY IF EXISTS gp_update ON public.group_posts;
CREATE POLICY gp_update ON public.group_posts
  FOR UPDATE USING (author_id = (SELECT auth.uid()))
  WITH CHECK (author_id = (SELECT auth.uid()));
DROP POLICY IF EXISTS gp_delete ON public.group_posts;
CREATE POLICY gp_delete ON public.group_posts
  FOR DELETE USING (
    author_id = (SELECT auth.uid())
    OR EXISTS (SELECT 1 FROM public.groups g
               WHERE g.id = group_id AND g.owner_id = (SELECT auth.uid()))
  );

-- post_reactions
DROP POLICY IF EXISTS pr_insert ON public.post_reactions;
CREATE POLICY pr_insert ON public.post_reactions
  FOR INSERT WITH CHECK (user_id = (SELECT auth.uid()) AND EXISTS (
    SELECT 1 FROM public.group_posts p
    WHERE p.id = post_id AND public.is_group_member(p.group_id)
  ));
DROP POLICY IF EXISTS pr_delete ON public.post_reactions;
CREATE POLICY pr_delete ON public.post_reactions
  FOR DELETE USING (user_id = (SELECT auth.uid()));

-- post_comments
DROP POLICY IF EXISTS pc_insert ON public.post_comments;
CREATE POLICY pc_insert ON public.post_comments
  FOR INSERT WITH CHECK (author_id = (SELECT auth.uid()) AND EXISTS (
    SELECT 1 FROM public.group_posts p
    WHERE p.id = post_id AND public.is_group_member(p.group_id)
  ));
DROP POLICY IF EXISTS pc_delete ON public.post_comments;
CREATE POLICY pc_delete ON public.post_comments
  FOR DELETE USING (
    author_id = (SELECT auth.uid())
    OR EXISTS (SELECT 1 FROM public.group_posts p
               JOIN public.groups g ON g.id = p.group_id
               WHERE p.id = post_id AND g.owner_id = (SELECT auth.uid()))
  );
