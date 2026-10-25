import { useState, useEffect } from 'react'
import { useNavigate, Navigate, useSearchParams } from 'react-router-dom'
import { supabase } from '@junospace/supabase-client'
import { useAuth } from '../context/AuthContext'
import { Mail, Lock, ArrowRight, Loader2, AlertCircle } from 'lucide-react'
import { AnimatedLogo } from '@junospace/ui'

export function LoginPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  
  const { user } = useAuth()
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()

  useEffect(() => {
    if (searchParams.get('error') === 'role_mismatch') {
      setError('This account does not have access to this portal.')
    }
  }, [searchParams])

  if (user) {
    return <Navigate to="/dashboard" replace />
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setIsLoading(true)

    try {
      const { data, error: signInError } = await supabase.auth.signInWithPassword({
        email, password
      })

      if (signInError) throw signInError

      const { data: profile } = await supabase
        .from('users')
        .select('role')
        .eq('id', data.user.id)
        .single()
      
      if (profile?.role !== 'admin') {
        await supabase.auth.signOut()
        setError('You do not have admin access. Please use the correct portal.')
        setIsLoading(false)
        return
      }

      navigate('/dashboard')
    } catch (err) {
      console.error(err)
      setError(err.message || 'Invalid email or password')
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#F8F7FC] p-6 relative overflow-hidden">
      <div className="absolute top-[-10%] left-[-10%] w-96 h-96 bg-[#6C35DE]/20 rounded-full blur-[100px] pointer-events-none" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[500px] h-[500px] bg-blue-500/10 rounded-full blur-[120px] pointer-events-none" />

      <div className="w-full max-w-md bg-white rounded-3xl p-8 shadow-xl shadow-slate-200/50 border border-slate-100 relative z-10">
        <div className="flex flex-col items-center mb-8">
          <AnimatedLogo />
          <p className="text-[10px] font-black text-[#6C35DE] uppercase tracking-[0.2em] mt-1 login-form-anim">
            Admin Portal
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4 login-form-anim">
          {error && (
            <div className="bg-red-50 text-red-600 p-4 rounded-xl text-sm font-bold flex items-start gap-3 border border-red-100">
              <AlertCircle size={18} className="shrink-0 mt-0.5" />
              <p>{error}</p>
            </div>
          )}

          <div className="space-y-1.5">
            <label className="text-[11px] font-bold text-slate-500 uppercase tracking-widest pl-1">Email Address</label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slate-400">
                <Mail size={18} />
              </div>
              <input type="email" required value={email} onChange={(e) => setEmail(e.target.value)} className="w-full pl-11 pr-4 py-3 bg-slate-50 border-transparent focus:border-[#6C35DE] focus:bg-white focus:ring-0 rounded-xl text-sm font-medium transition-colors" placeholder="email@junospace.edu" />
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="text-[11px] font-bold text-slate-500 uppercase tracking-widest pl-1">Password</label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slate-400">
                <Lock size={18} />
              </div>
              <input type="password" required value={password} onChange={(e) => setPassword(e.target.value)} className="w-full pl-11 pr-4 py-3 bg-slate-50 border-transparent focus:border-[#6C35DE] focus:bg-white focus:ring-0 rounded-xl text-sm font-medium transition-colors" placeholder="••••••••" />
            </div>
          </div>

          <button type="submit" disabled={isLoading} className="w-full flex items-center justify-center gap-2 bg-[#6C35DE] hover:bg-[#5a2bc4] text-white py-3.5 rounded-xl text-sm font-bold transition-all duration-150 shadow-lg shadow-[#6C35DE]/20 active:scale-[0.98] mt-2 disabled:opacity-70 disabled:pointer-events-none">
            {isLoading ? <Loader2 size={18} className="animate-spin" /> : <><ArrowRight size={18} /> Sign In</>}
          </button>
        </form>
      </div>
    </div>
  )
}
