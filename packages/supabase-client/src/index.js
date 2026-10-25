import { createClient } from '@supabase/supabase-js'

export const supabase = createClient(
  import.meta.env.VITE_SUPABASE_URL,
  import.meta.env.VITE_SUPABASE_ANON_KEY
)

export default supabase

export const getUser = async () => supabase.auth.getUser()
export const getSession = async () => supabase.auth.getSession()
export const signOut = async () => supabase.auth.signOut()
