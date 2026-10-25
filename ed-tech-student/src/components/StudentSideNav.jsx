import { NavLink } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

export function StudentSideNav() {
  const { profile, signOut } = useAuth()

  const fullName = profile?.full_name || 'Alex Chen'
  const avatarColor = profile?.avatar_color || '#6C35DE'
  const avatarInitials = profile?.avatar_initials || 'S'

  return (
    <>
      <aside className="fixed left-0 top-0 hidden md:flex flex-col h-screen w-72 rounded-r-[2rem] bg-white border-r border-violet-300 shadow-sm shadow-violet-100 py-8 px-4 space-y-2 z-50">
        <div className="px-4 mb-8">
          <div className="flex items-center gap-3">
            <img src="/logo.png" className="w-8 h-8 object-contain drop-shadow-md" alt="JunoSpace Logo" />
            <h1 className="text-xl font-bold text-violet-400 tracking-tighter">JunoSpace</h1>
          </div>
          <p className="text-xs text-slate-500 font-medium tracking-widest uppercase mt-1">Command Center</p>
        </div>
        
        <nav className="flex-1 space-y-1">
          <NavLink 
            to="/dashboard"
            className={({ isActive }) => 
              isActive 
                ? "flex items-center gap-3 px-4 py-3 text-violet-300 font-bold border-r-4 border-violet-400 bg-violet-900/20 rounded-l-lg transition-all duration-200"
                : "flex items-center gap-3 px-4 py-3 text-slate-500 hover:text-violet-300 hover:bg-slate-100 transition-all duration-200 rounded-lg"
            }
          >
            <span className="material-symbols-outlined">dashboard</span>
            <span className="text-sm">Dashboard</span>
          </NavLink>
          
          <NavLink 
            to="/courses"
            className={({ isActive }) => 
              isActive 
                ? "flex items-center gap-3 px-4 py-3 text-violet-300 font-bold border-r-4 border-violet-400 bg-violet-900/20 rounded-l-lg transition-all duration-200"
                : "flex items-center gap-3 px-4 py-3 text-slate-500 hover:text-violet-300 hover:bg-slate-100 transition-all duration-200 rounded-lg"
            }
          >
            <span className="material-symbols-outlined">school</span>
            <span className="text-sm">My Courses</span>
          </NavLink>

          <NavLink 
            to="/assignments"
            className={({ isActive }) => 
              isActive 
                ? "flex items-center gap-3 px-4 py-3 text-violet-300 font-bold border-r-4 border-violet-400 bg-violet-900/20 rounded-l-lg transition-all duration-200"
                : "flex items-center gap-3 px-4 py-3 text-slate-500 hover:text-violet-300 hover:bg-slate-100 transition-all duration-200 rounded-lg"
            }
          >
            <span className="material-symbols-outlined">assignment</span>
            <span className="text-sm">Assignments</span>
          </NavLink>

          <NavLink 
            to="/assessments"
            className={({ isActive }) => 
              isActive 
                ? "flex items-center gap-3 px-4 py-3 text-violet-300 font-bold border-r-4 border-violet-400 bg-violet-900/20 rounded-l-lg transition-all duration-200"
                : "flex items-center gap-3 px-4 py-3 text-slate-500 hover:text-violet-300 hover:bg-slate-100 transition-all duration-200 rounded-lg"
            }
          >
            <span className="material-symbols-outlined">quiz</span>
            <span className="text-sm">Assessments</span>
          </NavLink>

          <NavLink 
            to="/library"
            className={({ isActive }) => 
              isActive 
                ? "flex items-center gap-3 px-4 py-3 text-violet-300 font-bold border-r-4 border-violet-400 bg-violet-900/20 rounded-l-lg transition-all duration-200"
                : "flex items-center gap-3 px-4 py-3 text-slate-500 hover:text-violet-300 hover:bg-slate-100 transition-all duration-200 rounded-lg"
            }
          >
            <span className="material-symbols-outlined">auto_stories</span>
            <span className="text-sm">Library</span>
          </NavLink>

          <NavLink 
            to="/leaderboard"
            className={({ isActive }) => 
              isActive 
                ? "flex items-center gap-3 px-4 py-3 text-violet-300 font-bold border-r-4 border-violet-400 bg-violet-900/20 rounded-l-lg transition-all duration-200"
                : "flex items-center gap-3 px-4 py-3 text-slate-500 hover:text-violet-300 hover:bg-slate-100 transition-all duration-200 rounded-lg"
            }
          >
            <span className="material-symbols-outlined">emoji_events</span>
            <span className="text-sm">Leaderboard</span>
          </NavLink>

          <NavLink 
            to="/analytics"
            className={({ isActive }) => 
              isActive 
                ? "flex items-center gap-3 px-4 py-3 text-violet-300 font-bold border-r-4 border-violet-400 bg-violet-900/20 rounded-l-lg transition-all duration-200"
                : "flex items-center gap-3 px-4 py-3 text-slate-500 hover:text-violet-300 hover:bg-slate-100 transition-all duration-200 rounded-lg"
            }
          >
            <span className="material-symbols-outlined">analytics</span>
            <span className="text-sm">Analytics</span>
          </NavLink>

          <NavLink 
            to="/profile"
            className={({ isActive }) => 
              isActive 
                ? "flex items-center gap-3 px-4 py-3 text-violet-300 font-bold border-r-4 border-violet-400 bg-violet-900/20 rounded-l-lg transition-all duration-200"
                : "flex items-center gap-3 px-4 py-3 text-slate-500 hover:text-violet-300 hover:bg-slate-100 transition-all duration-200 rounded-lg"
            }
          >
            <span className="material-symbols-outlined">person</span>
            <span className="text-sm">Profile</span>
          </NavLink>
        </nav>

        <div className="mt-auto pt-4 px-2">
          <div className="flex items-center gap-3 p-3 rounded-xl bg-slate-100/40">
            <div className="w-10 h-10 rounded-full flex items-center justify-center text-white font-bold text-sm shrink-0" style={{ backgroundColor: avatarColor }}>
              {avatarInitials}
            </div>
            <div>
              <p className="text-xs font-bold text-slate-700">{fullName}</p>
              <p className="text-[10px] text-violet-400 font-medium">Lvl. 42 Architect</p>
            </div>
            <button onClick={signOut} className="ml-auto text-slate-500 hover:text-red-500 transition-colors">
              <span className="material-symbols-outlined text-lg">logout</span>
            </button>
          </div>
        </div>
      </aside>

      {/* Mobile Bottom Navigation */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 h-16 bg-white border-t border-violet-300 shadow-sm shadow-violet-100 flex items-center justify-around px-4 z-50">
        <NavLink to="/dashboard" className={({ isActive }) => `flex flex-col items-center gap-1 ${isActive ? 'text-violet-400' : 'text-slate-500'}`}>
          <span className="material-symbols-outlined">dashboard</span>
          <span className="text-[9px] font-bold uppercase">Home</span>
        </NavLink>
        <NavLink to="/courses" className={({ isActive }) => `flex flex-col items-center gap-1 ${isActive ? 'text-violet-400' : 'text-slate-500'}`}>
          <span className="material-symbols-outlined">school</span>
          <span className="text-[9px] font-bold uppercase">Courses</span>
        </NavLink>
        <NavLink to="/assignments" className={({ isActive }) => `flex flex-col items-center gap-1 ${isActive ? 'text-violet-400' : 'text-slate-500'}`}>
          <span className="material-symbols-outlined">assignment</span>
          <span className="text-[9px] font-bold uppercase">Assign</span>
        </NavLink>
        <NavLink to="/assessments" className={({ isActive }) => `flex flex-col items-center gap-1 ${isActive ? 'text-violet-400' : 'text-slate-500'}`}>
          <span className="material-symbols-outlined">quiz</span>
          <span className="text-[9px] font-bold uppercase">Exams</span>
        </NavLink>
        <NavLink to="/library" className={({ isActive }) => `flex flex-col items-center gap-1 ${isActive ? 'text-violet-400' : 'text-slate-500'}`}>
          <span className="material-symbols-outlined">auto_stories</span>
          <span className="text-[9px] font-bold uppercase">Library</span>
        </NavLink>
        <NavLink to="/leaderboard" className={({ isActive }) => `flex flex-col items-center gap-1 ${isActive ? 'text-violet-400' : 'text-slate-500'}`}>
          <span className="material-symbols-outlined">emoji_events</span>
          <span className="text-[9px] font-bold uppercase">Ranks</span>
        </NavLink>
        <NavLink to="/analytics" className={({ isActive }) => `flex flex-col items-center gap-1 ${isActive ? 'text-violet-400' : 'text-slate-500'}`}>
          <span className="material-symbols-outlined">analytics</span>
          <span className="text-[9px] font-bold uppercase">Stats</span>
        </NavLink>
        <NavLink to="/profile" className={({ isActive }) => `flex flex-col items-center gap-1 ${isActive ? 'text-violet-400' : 'text-slate-500'}`}>
          <span className="material-symbols-outlined">person</span>
          <span className="text-[9px] font-bold uppercase">Profile</span>
        </NavLink>
      </nav>
    </>
  )
}
