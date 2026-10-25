import { useAuth } from "../context/AuthContext";

export function AdminTopBar({ placeholder = "Search analytics, students, or reports..." }) {
  const { user, signOut } = useAuth();

  return (
    <header className="glass-header fixed top-0 right-0 w-[calc(100%-16rem)] h-16 px-8 z-40 flex justify-between items-center shadow-sm border-b border-outline-variant/10">
      <div className="flex items-center flex-1 max-w-md">
        <div className="relative w-full">
          <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-slate-400">search</span>
          <input
            className="w-full bg-surface-container-highest border-none rounded-lg pl-10 pr-4 py-2 text-sm focus:ring-2 focus:ring-primary/30 transition-all placeholder:text-slate-500"
            placeholder={placeholder}
            type="text"
          />
        </div>
      </div>

      <div className="flex items-center gap-6">
        <div className="flex items-center gap-3 text-slate-500">
          <button className="hover:text-indigo-600 transition-colors relative">
            <span className="material-symbols-outlined">notifications</span>
            <span className="absolute -top-1 -right-1 w-2 h-2 bg-error rounded-full"></span>
          </button>
        </div>
        <div className="h-8 w-px bg-outline-variant/30"></div>
        <div className="flex items-center gap-3">
          <div className="text-right hidden sm:block">
            <p className="text-sm font-semibold text-on-surface leading-tight">{user?.name || "Admin"}</p>
            <p className="text-[10px] text-secondary font-medium uppercase tracking-wider">Administrator</p>
          </div>
          <button
            onClick={signOut}
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-secondary hover:text-error border border-outline-variant/30 rounded-lg hover:border-error/30 transition-all"
          >
            <span className="material-symbols-outlined text-sm">logout</span>
            Sign Out
          </button>
        </div>
      </div>
    </header>
  );
}
