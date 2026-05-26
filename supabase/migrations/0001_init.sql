-- CodeDojo: 認証付きデータ同期用スキーマ
--
-- 使い方:
--   1. Supabase ダッシュボード → SQL Editor で本ファイルを丸ごと貼り付け実行
--   2. Authentication → Providers → GitHub を有効化
--      (GitHub の OAuth App を作成し、 Client ID / Secret を登録)
--   3. アプリ側で NEXT_PUBLIC_SUPABASE_URL / NEXT_PUBLIC_SUPABASE_ANON_KEY を設定
--
-- RLS により、 認証済みユーザーは自分の行だけを読み書き可能。

-- ============================================================================
-- attempts: 問題ごとの挑戦履歴 (PK = user_id + question_id)
-- ============================================================================
CREATE TABLE IF NOT EXISTS public.attempts (
  user_id                     UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  question_id                 TEXT NOT NULL,
  solved                      BOOLEAN NOT NULL DEFAULT FALSE,
  attempts                    INTEGER NOT NULL DEFAULT 0,
  hints_used                  INTEGER NOT NULL DEFAULT 0,
  last_answered_at            TIMESTAMPTZ NOT NULL,
  mark                        TEXT, -- 'mastered' | 'review' | NULL
  self_explanation            TEXT,
  self_explanation_updated_at TIMESTAMPTZ,
  PRIMARY KEY (user_id, question_id)
);

CREATE INDEX IF NOT EXISTS idx_attempts_user_answered
  ON public.attempts (user_id, last_answered_at DESC);

ALTER TABLE public.attempts ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "attempts_self_select" ON public.attempts;
CREATE POLICY "attempts_self_select" ON public.attempts
  FOR SELECT USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "attempts_self_insert" ON public.attempts;
CREATE POLICY "attempts_self_insert" ON public.attempts
  FOR INSERT WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "attempts_self_update" ON public.attempts;
CREATE POLICY "attempts_self_update" ON public.attempts
  FOR UPDATE USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "attempts_self_delete" ON public.attempts;
CREATE POLICY "attempts_self_delete" ON public.attempts
  FOR DELETE USING (auth.uid() = user_id);

-- ============================================================================
-- journal_entries: 学習ジャーナルのエントリ
-- ============================================================================
CREATE TABLE IF NOT EXISTS public.journal_entries (
  id          TEXT PRIMARY KEY,
  user_id     UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  template_id TEXT NOT NULL,
  title       TEXT NOT NULL DEFAULT '',
  content     JSONB NOT NULL DEFAULT '{}'::jsonb,
  created_at  TIMESTAMPTZ NOT NULL,
  updated_at  TIMESTAMPTZ NOT NULL
);

CREATE INDEX IF NOT EXISTS idx_journal_user_created
  ON public.journal_entries (user_id, created_at DESC);

ALTER TABLE public.journal_entries ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "journal_self_select" ON public.journal_entries;
CREATE POLICY "journal_self_select" ON public.journal_entries
  FOR SELECT USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "journal_self_insert" ON public.journal_entries;
CREATE POLICY "journal_self_insert" ON public.journal_entries
  FOR INSERT WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "journal_self_update" ON public.journal_entries;
CREATE POLICY "journal_self_update" ON public.journal_entries
  FOR UPDATE USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "journal_self_delete" ON public.journal_entries;
CREATE POLICY "journal_self_delete" ON public.journal_entries
  FOR DELETE USING (auth.uid() = user_id);

-- ============================================================================
-- flashcards: SRS フラッシュカード
-- ============================================================================
CREATE TABLE IF NOT EXISTS public.flashcards (
  id               TEXT PRIMARY KEY,
  user_id          UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  front            TEXT NOT NULL,
  back             TEXT NOT NULL,
  hint             TEXT,
  tags             TEXT[] NOT NULL DEFAULT '{}',
  source           JSONB NOT NULL,
  due_at           TIMESTAMPTZ NOT NULL,
  interval         INTEGER NOT NULL,
  ease             NUMERIC NOT NULL,
  repetitions      INTEGER NOT NULL DEFAULT 0,
  lapses           INTEGER NOT NULL DEFAULT 0,
  last_reviewed_at TIMESTAMPTZ,
  created_at       TIMESTAMPTZ NOT NULL,
  updated_at       TIMESTAMPTZ NOT NULL
);

CREATE INDEX IF NOT EXISTS idx_flashcards_user_due
  ON public.flashcards (user_id, due_at);

ALTER TABLE public.flashcards ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "flashcards_self_select" ON public.flashcards;
CREATE POLICY "flashcards_self_select" ON public.flashcards
  FOR SELECT USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "flashcards_self_insert" ON public.flashcards;
CREATE POLICY "flashcards_self_insert" ON public.flashcards
  FOR INSERT WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "flashcards_self_update" ON public.flashcards;
CREATE POLICY "flashcards_self_update" ON public.flashcards
  FOR UPDATE USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "flashcards_self_delete" ON public.flashcards;
CREATE POLICY "flashcards_self_delete" ON public.flashcards
  FOR DELETE USING (auth.uid() = user_id);
