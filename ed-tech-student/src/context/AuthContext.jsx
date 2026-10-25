import { createContext, useContext, useEffect, useState } from 'react'
import { supabase } from '@junospace/supabase-client'

const AuthContext = createContext({})

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null)
  const [profile, setProfile] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null)
      if (session?.user) {
        setLoading(true)
        verifyAndFetchProfile(session.user.id)
      } else {
        setLoading(false)
      }
    })

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null)
      if (session?.user) {
        setLoading(true)
        verifyAndFetchProfile(session.user.id)
      } else {
        setProfile(null)
        setLoading(false)
      }
    })

    return () => subscription.unsubscribe()
  }, [])

  async function verifyAndFetchProfile(userId) {
    const { data, error } = await supabase
      .from('users')
      .select('*')
      .eq('id', userId)
      .single()

    if (!error && data) {
      if (data.role !== 'student') {
        await supabase.auth.signOut()
        setProfile(null)
        window.location.href = '/?error=role_mismatch'
      } else {
        setProfile(data)
      }
    } else {
      await supabase.auth.signOut()
      setProfile(null)
    }
    setLoading(false)
  }

  const signOut = async () => {
    await supabase.auth.signOut()
    window.location.href = '/' 
  }

  return (
    <AuthContext.Provider value={{ user, profile, loading, signOut }}>
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => useContext(AuthContext)
