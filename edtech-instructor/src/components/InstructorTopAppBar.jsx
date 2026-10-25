import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export function InstructorTopAppBar() {
  const navigate = useNavigate();
  const { user, logout } = useAuth();

  const handleLogout = () => { logout(); navigate("/login", { replace: true }); };

  return (
    <header className="flex justify-between items-center px-8 w-[calc(100%-16rem)] h-16 z-30 ml-64 fixed top-0 right-0 bg-white/80 backdrop-blur-md shadow-sm border-b border-outline-variant/15">
      <div className="flex items-center flex-1 max-w-xl">
        <div className="relative w-full">
          <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 text-sm">search</span>
          <input className="w-full bg-surface-container-highest border-none rounded-lg pl-10 pr-4 py-2 text-sm focus:ring-2 focus:ring-primary/40 placeholder:text-slate-500 transition-all"
            placeholder="Search students, batches, or records..." type="text" />
        </div>
      </div>

      <div className="flex items-center gap-6 ml-8">
        <button className="relative text-slate-500 hover:text-primary transition-colors">
          <span className="material-symbols-outlined">notifications</span>
          <span className="absolute -top-1 -right-1 w-2 h-2 bg-error rounded-full"></span>
        </button>
        <div className="flex items-center gap-3">
          <div className="text-right hidden sm:block">
            <p className="text-sm font-semibold text-on-surface leading-tight">{user?.name || "Instructor"}</p>
            <p className="text-[10px] text-secondary font-medium uppercase tracking-wider">Instructor</p>
          </div>
          <button onClick={handleLogout}
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-secondary hover:text-error border border-outline-variant/30 rounded-lg hover:border-error/30 transition-all">
            <span className="material-symbols-outlined text-sm">logout</span>Sign Out
          </button>
        </div>
      </div>
    </header>
  );
}
