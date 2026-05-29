-- CodeDojo: プロフィール (グループ内で使う表示名 / アイコンを自分で設定)
--
-- 使い方:
--   0003_groups.sql 実行済みの前提で、 Supabase の SQL Editor に貼り付けて実行する。
--
-- 設計:
--   - profiles: ユーザーが設定した表示名 / アバター URL の正本 (自分の行のみ読み書き)。
--   - 表示は group_members / group_posts / post_comments に非正規化した値を使うため、
--     update_profile RPC で profiles と各非正規化カラムを一括更新する。
--   - 未設定なら GitHub の user_metadata にフォールバックする (create_group / join 時)。

-- ============================================================================
-- profiles
-- ============================================================================
CREATE TABLE IF NOT EXISTS public.profiles (
  user_id      UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  display_name TEXT NOT NULL DEFAULT '' CHECK (char_length(display_name) <= 60),
  avatar_url   TEXT CHECK (char_length(avatar_url) <= 2000),
  updated_at   TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS profiles_select ON public.profiles;
CREATE POLICY profiles_select ON public.profiles
  FOR SELECT USING (user_id = auth.uid());
DROP POLICY IF EXISTS profiles_insert ON public.profiles;
CREATE POLICY profiles_insert ON public.profiles
  FOR INSERT WITH CHECK (user_id = auth.uid());
DROP POLICY IF EXISTS profiles_update ON public.profiles;
CREATE POLICY profiles_update ON public.profiles
  FOR UPDATE USING (user_id = auth.uid()) WITH CHECK (user_id = auth.uid());

-- ============================================================================
-- RPC: プロフィール更新 (正本 + 非正規化コピーを一括更新)
-- ============================================================================
CREATE OR REPLACE FUNCTION public.update_profile(p_name TEXT, p_avatar TEXT)
  RETURNS VOID
  LANGUAGE plpgsql
  SECURITY DEFINER
  SET search_path = public, pg_temp
AS $$
DECLARE
  nm TEXT;
  av TEXT;
BEGIN
  IF auth.uid() IS NULL THEN
    RAISE EXCEPTION 'not authenticated';
  END IF;
  nm := trim(COALESCE(p_name, ''));
  IF char_length(nm) = 0 THEN
    RAISE EXCEPTION 'name required';
  END IF;
  IF char_length(nm) > 60 THEN
    RAISE EXCEPTION 'name too long';
  END IF;
  av := nullif(trim(COALESCE(p_avatar, '')), '');

  INSERT INTO public.profiles (user_id, display_name, avatar_url, updated_at)
  VALUES (auth.uid(), nm, av, now())
  ON CONFLICT (user_id) DO UPDATE
    SET display_name = excluded.display_name,
        avatar_url   = excluded.avatar_url,
        updated_at   = now();

  -- 既存グループの表示にも反映 (非正規化カラム)
  UPDATE public.group_members
     SET display_name = nm, avatar_url = av
   WHERE user_id = auth.uid();
  UPDATE public.group_posts
     SET author_name = nm
   WHERE author_id = auth.uid();
  UPDATE public.post_comments
     SET author_name = nm
   WHERE author_id = auth.uid();
END;
$$;

REVOKE ALL ON FUNCTION public.update_profile(TEXT, TEXT) FROM PUBLIC, anon;
GRANT EXECUTE ON FUNCTION public.update_profile(TEXT, TEXT) TO authenticated;

-- ============================================================================
-- create_group / join_group_by_code をプロフィール優先に更新
--   (profiles が無ければ GitHub の user_metadata にフォールバック)
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

  LOOP
    code := substr(replace(gen_random_uuid()::text, '-', ''), 1, 10);
    EXIT WHEN NOT EXISTS (SELECT 1 FROM public.groups WHERE invite_code = code);
  END LOOP;

  INSERT INTO public.groups (name, description, invite_code, owner_id)
  VALUES (trim(p_name), COALESCE(p_description, ''), code, auth.uid())
  RETURNING id INTO gid;

  SELECT COALESCE(NULLIF(pr.display_name, ''),
                  u.raw_user_meta_data->>'user_name',
                  u.raw_user_meta_data->>'full_name', ''),
         COALESCE(pr.avatar_url, u.raw_user_meta_data->>'avatar_url')
    INTO uname, aurl
  FROM auth.users u
  LEFT JOIN public.profiles pr ON pr.user_id = u.id
  WHERE u.id = auth.uid();

  INSERT INTO public.group_members (group_id, user_id, role, display_name, avatar_url)
  VALUES (gid, auth.uid(), 'owner', uname, aurl);

  RETURN gid;
END;
$$;

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

  SELECT COALESCE(NULLIF(pr.display_name, ''),
                  u.raw_user_meta_data->>'user_name',
                  u.raw_user_meta_data->>'full_name', ''),
         COALESCE(pr.avatar_url, u.raw_user_meta_data->>'avatar_url')
    INTO uname, aurl
  FROM auth.users u
  LEFT JOIN public.profiles pr ON pr.user_id = u.id
  WHERE u.id = auth.uid();

  INSERT INTO public.group_members (group_id, user_id, role, display_name, avatar_url)
  VALUES (gid, auth.uid(), 'member', uname, aurl)
  ON CONFLICT (group_id, user_id) DO NOTHING;

  RETURN gid;
END;
$$;
