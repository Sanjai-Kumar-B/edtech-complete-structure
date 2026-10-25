import { NavLink } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const navItems = [
  { name: "Dashboard", path: "/admin/dashboard", icon: "dashboard" },
  { name: "Users", path: "/admin/users", icon: "group" },
  { name: "Courses", path: "/admin/courses", icon: "school" },

  { name: "Batches", path: "/admin/batches", icon: "layers" },

  { name: "Library", path: "/admin/library/manage", icon: "auto_stories" },
  { name: "Certifications", path: "/admin/certifications", icon: "verified" },
  { name: "Analytics & Reports", path: "/admin/analytics", icon: "analytics" },
];

const bottomItems = [
  { name: "Settings", path: "/admin/settings", icon: "settings" },
  { name: "Profile", path: "/admin/profile", icon: "account_circle" },
];

export function AdminSideNav() {
  const { user, signOut } = useAuth();

  return (
    <aside className="fixed h-screen w-72 left-0 top-0 bg-[#020617] flex flex-col py-8 z-50 overflow-y-auto no-scrollbar border-r border-white/5">
      <div className="px-8 mb-12">
        <div className="flex items-center gap-4">
          <div className="w-10 h-10 flex items-center justify-center rounded-xl overflow-hidden shadow-lg shadow-indigo-500/20">
            <img src="/logo_white.png" className="w-full h-full object-cover" alt="JunoSpace Logo" />
          </div>
          <div>
            <h1 className="text-xl font-black text-white tracking-tighter font-headline leading-none">JunoSpace</h1>
            <p className="text-[10px] uppercase tracking-[0.2em] text-slate-500 font-black mt-1">Global Authority</p>
          </div>
        </div>
      </div>

      <nav className="flex-1 space-y-0.5">
        {navItems.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            className={({ isActive }) =>
              `flex items-center gap-3 px-6 py-3 text-sm font-medium transition-colors duration-150 ${
                isActive
                  ? "text-indigo-200 bg-indigo-500/10 border-l-4 border-indigo-400"
                  : "text-slate-400 hover:text-white hover:bg-slate-800/50 border-l-4 border-transparent"
              }`
            }
          >
            <span className="material-symbols-outlined text-[20px]">{item.icon}</span>
            {item.name}
          </NavLink>
        ))}
      </nav>

      <div className="px-6 pt-6 border-t border-slate-800 space-y-0.5">
        {bottomItems.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            className={({ isActive }) =>
              `flex items-center gap-3 py-3 text-sm font-medium transition-colors duration-150 ${
                isActive
                  ? "text-indigo-200 border-l-4 border-indigo-400 pl-2"
                  : "text-slate-400 hover:text-white border-l-4 border-transparent"
              }`
            }
          >
            <span className="material-symbols-outlined text-[20px]">{item.icon}</span>
            {item.name}
          </NavLink>
        ))}

        {/* User + Logout */}
        <div className="mt-4 pt-4 border-t border-slate-800 flex items-center gap-3">
          <div className="w-8 h-8 rounded-full bg-indigo-600 flex items-center justify-center text-white text-xs font-bold shrink-0">
            {user?.name?.charAt(0) || "A"}
          </div>
          <div className="flex-1 overflow-hidden">
            <p className="text-xs font-semibold text-white truncate">{user?.name || "Admin"}</p>
            <p className="text-[10px] text-slate-400 truncate">{user?.email}</p>
          </div>
          <button
            onClick={signOut}
            title="Sign out"
            className="text-slate-500 hover:text-red-400 transition-colors shrink-0"
          >
            <span className="material-symbols-outlined text-[18px]">logout</span>
          </button>
        </div>
      </div>
    </aside>
  );
}
