import { Navigate, Outlet } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { Loader2 } from 'lucide-react'

export function ProtectedRoute({ children }) {
  const { user, profile, loading } = useAuth()

  if (loading) {
    return (
      <div className="min-h-screen bg-[#F8F7FC] flex flex-col items-center justify-center gap-4">
        <Loader2 size={36} className="text-[#6C35DE] animate-spin" />
        <p className="text-slate-500 font-bold text-sm tracking-wider uppercase">Checking Access...</p>
      </div>
    )
  }

  if (!user) {
    return <Navigate to="/login" replace />
  }

  if (!profile || profile.role !== 'admin') {
    return <Navigate to="/unauthorized" replace />
  }

  return children ? children : <Outlet />
}
