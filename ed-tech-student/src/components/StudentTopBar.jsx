import { useAuth } from '../context/AuthContext'
import { NavLink } from 'react-router-dom'

export function StudentTopBar() {
  const { profile, signOut } = useAuth()
  
  const avatarColor = profile?.avatar_color || '#6C35DE'
  const avatarInitials = profile?.avatar_initials || 'S'

  return (
    <header className="fixed top-0 right-0 left-0 md:left-72 z-40 h-16 glass-panel flex items-center justify-end px-8 border-b border-violet-100 shadow-sm shadow-violet-50/50 bg-white/80 backdrop-blur-md">
      <div className="flex items-center gap-4">
        <button className="relative p-2.5 bg-violet-50 text-violet-500 hover:bg-violet-100 rounded-full transition-colors flex items-center justify-center">
          <span className="material-symbols-outlined text-[20px]">notifications_active</span>
          <span className="absolute top-0 right-0 hidden sm:block w-3 h-3 bg-pink-500 rounded-full border-2 border-white animate-pulse"></span>
        </button>
        <button onClick={signOut} title="Sign Out" className="relative p-2.5 bg-slate-50 text-slate-500 hover:bg-red-50 hover:text-red-500 rounded-full transition-colors flex items-center justify-center">
          <span className="material-symbols-outlined text-[20px]">logout</span>
        </button>
        <NavLink to="/profile" className="relative flex items-center justify-center rounded-full border-2 border-violet-200 hover:border-violet-400 transition-colors cursor-pointer overflow-hidden w-10 h-10 shadow-sm shadow-violet-200">
          <div className="w-full h-full flex items-center justify-center text-white font-bold" style={{ backgroundColor: avatarColor }}>
            {avatarInitials}
          </div>
        </NavLink>
      </div>
    </header>
  )
}
