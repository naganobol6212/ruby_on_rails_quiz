/**
 * Supabase クライアントのシングルトン。
 *
 * 環境変数:
 * - NEXT_PUBLIC_SUPABASE_URL
 * - NEXT_PUBLIC_SUPABASE_ANON_KEY
 *
 * これらが未設定なら `null` を返す。 アプリ全体は LocalStorage の挙動のまま
 * 動作し続け、 ログイン機能だけ無効になる。 環境変数を設定すると有効化される。
 *
 * セキュリティ: ANON KEY はクライアントに露出して問題ない (RLS で保護)。
 */

import { createClient, type SupabaseClient } from "@supabase/supabase-js";

const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

let client: SupabaseClient | null = null;

export function getSupabase(): SupabaseClient | null {
  if (!url || !anonKey) return null;
  if (!client) {
    client = createClient(url, anonKey, {
      auth: {
        // hash で返ってきた access_token を SDK が自動で拾う
        detectSessionInUrl: true,
        persistSession: true,
        autoRefreshToken: true,
        flowType: "pkce",
      },
    });
  }
  return client;
}

/** auth 機能が利用可能か (= env が設定されているか) */
export const isAuthEnabled = (): boolean => !!url && !!anonKey;
