-- CodeDojo: 端末間ライブ同期 (Supabase Realtime) を有効化する。
--
-- 使い方:
--   0001_init.sql を実行済みの前提で、 Supabase ダッシュボード → SQL Editor に
--   本ファイルを貼り付けて実行する。
--
-- 効果:
--   attempts / journal_entries / flashcards の行変更を Realtime で配信し、
--   別端末で記録した進捗をリロード無しで反映できるようにする。
--   RLS は維持されるため、 各ユーザーは「自分の行」の変更のみ受信する。
--
-- 補足:
--   このマイグレーションが未適用でも、 アプリは「ログイン時 / フォーカス復帰 /
--   60 秒間隔」の pull-merge で進捗を収束させる。Realtime はその上位互換 (即時反映)。

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_publication_tables
    WHERE pubname = 'supabase_realtime'
      AND schemaname = 'public' AND tablename = 'attempts'
  ) THEN
    ALTER PUBLICATION supabase_realtime ADD TABLE public.attempts;
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM pg_publication_tables
    WHERE pubname = 'supabase_realtime'
      AND schemaname = 'public' AND tablename = 'journal_entries'
  ) THEN
    ALTER PUBLICATION supabase_realtime ADD TABLE public.journal_entries;
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM pg_publication_tables
    WHERE pubname = 'supabase_realtime'
      AND schemaname = 'public' AND tablename = 'flashcards'
  ) THEN
    ALTER PUBLICATION supabase_realtime ADD TABLE public.flashcards;
  END IF;
END $$;
