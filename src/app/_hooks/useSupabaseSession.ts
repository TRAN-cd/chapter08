import { supabase } from '@/app/_libs/supabase'
import { Session } from '@supabase/supabase-js'
import { usePathname } from 'next/navigation'
import path from 'path'
import { useState, useEffect } from 'react'

export const useSupabaseSession = () => {
  // undefined: ログイン状態ロード中, null: ログインしていない, Session: ログインしている
  const [session, setSession] = useState<Session | null | undefined>(undefined)
  const [token, setToken] = useState<string | null>(null)
  const pathname = usePathname()

  useEffect(() => {
    const fetcher = async () => {
      // 現在ログイン中かどうかチェック
      const { data: { session }} = await supabase.auth.getSession()
      setSession(session)
      setToken(session?.access_token || null)
    }

    fetcher()
  }, [pathname])

  return { session, isLoading: session === undefined, token}
}