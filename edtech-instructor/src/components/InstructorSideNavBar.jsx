import { NavLink } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const navItems = [
  { name: "Dashboard", path: "/instructor/dashboard", icon: "dashboard" },
  { name: "My Batches", path: "/instructor/batches", icon: "groups" },
  { name: "Assignments", path: "/instructor/assignments", icon: "assignment_late" },
  { name: "Batch Library", path: "/instructor/library", icon: "auto_stories" },
  { name: "Attendance", path: "/instructor/attendance", icon: "how_to_reg" },
  { name: "Students", path: "/instructor/students", icon: "person" },
  { name: "Create Assessment", path: "/instructor/assessments/create", icon: "add_task" },
  { name: "Analytics", path: "/instructor/analytics", icon: "analytics" },
  { name: "Profile", path: "/instructor/profile", icon: "account_circle" },
];

export function InstructorSideNavBar() {
  const { user, signOut } = useAuth();

  return (
    <aside className="flex flex-col h-screen fixed left-0 w-64 z-40 bg-slate-900">
      <div className="p-6 flex items-center gap-3">
        <div className="w-10 h-10 flex items-center justify-center rounded-xl overflow-hidden shadow-lg shadow-indigo-500/20 shrink-0">
          <img src="/logo_white.png" className="w-full h-full object-cover" alt="JunoSpace Logo" />
        </div>
        <div>
          <div className="text-xl font-bold text-white tracking-tight">JunoSpace</div>
          <div className="text-[10px] uppercase tracking-widest text-indigo-400 mt-1 font-semibold">Instructor Portal</div>
        </div>
      </div>

      <nav className="flex-1 mt-2 overflow-y-auto no-scrollbar">
        {navItems.map((item) => (
          <NavLink key={item.name} to={item.path}
            className={({ isActive }) =>
              `flex items-center gap-3 px-4 py-3 transition-colors duration-200 text-[13px] font-medium ${isActive
                ? "text-indigo-200 border-l-4 border-indigo-400 bg-white/10"
                : "text-slate-400 hover:text-white hover:bg-slate-800 border-l-4 border-transparent"
              }`
            }
          >
            <span className="material-symbols-outlined text-[20px]">{item.icon}</span>
            <span>{item.name}</span>
          </NavLink>
        ))}
      </nav>

      <div className="p-4 mt-auto border-t border-slate-800">
        <div className="flex items-center gap-3 p-3 rounded-lg bg-white/5">
          <div className="w-8 h-8 rounded-full bg-indigo-600 flex items-center justify-center text-white text-xs font-bold shrink-0">
            {user?.name?.charAt(0) || "I"}
          </div>
          <div className="overflow-hidden flex-1">
            <p className="text-xs font-semibold text-white truncate">{user?.name || "Instructor"}</p>
            <p className="text-[10px] text-slate-400 truncate">{user?.email}</p>
          </div>
          <button onClick={signOut} title="Sign out" className="text-slate-500 hover:text-red-400 transition-colors shrink-0">
            <span className="material-symbols-outlined text-[18px]">logout</span>
          </button>
        </div>
      </div>
    </aside>
  );
}
