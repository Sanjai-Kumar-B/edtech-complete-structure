import { useNavigate } from 'react-router-dom'
import { ShieldAlert, ArrowLeft } from 'lucide-react'

export function UnauthorizedPage() {
  const navigate = useNavigate()

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#F8F7FC] p-6 relative overflow-hidden">
      <div className="absolute top-[-10%] right-[-10%] w-96 h-96 bg-red-500/10 rounded-full blur-[100px] pointer-events-none" />
      <div className="absolute bottom-[-10%] left-[-10%] w-[500px] h-[500px] bg-[#6C35DE]/10 rounded-full blur-[120px] pointer-events-none" />

      <div className="w-full max-w-md bg-white rounded-3xl p-8 shadow-xl shadow-slate-200/50 border border-slate-100 relative z-10 flex flex-col items-center text-center">
        
        <div className="w-16 h-16 rounded-2xl bg-red-50 flex items-center justify-center mb-6 border border-red-100 shadow-sm">
          <ShieldAlert size={32} className="text-red-500" />
        </div>
        
        <h1 className="text-2xl font-black text-slate-800 tracking-tight mb-2">Access Denied</h1>
        <p className="text-sm text-slate-500 mb-8 max-w-xs leading-relaxed">
          Your account does not have permission to access this portal.
        </p>

        <button 
          onClick={() => navigate('/')}
          className="w-full flex items-center justify-center gap-2 bg-[#6C35DE] hover:bg-[#5a2bc4] text-white py-3.5 rounded-xl text-sm font-bold transition-all duration-150 shadow-lg shadow-[#6C35DE]/20 active:scale-[0.98]"
        >
          <ArrowLeft size={18} />
          Go to Login
        </button>
      </div>
    </div>
  )
}
