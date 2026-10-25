import { NavLink } from "react-router-dom";

export function InstructorSideNavBar() {
  const navItems = [
    { name: "Dashboard", path: "/instructor/dashboard", icon: "dashboard" },
    { name: "My Batches", path: "/instructor/batches", icon: "groups" },
    { name: "Assignments", path: "/instructor/assignments", icon: "assignment_late" },
    { name: "Attendance", path: "/instructor/attendance", icon: "how_to_reg" },
    { name: "Students", path: "/instructor/students", icon: "person" },
    { name: "Mentor Notes", path: "/instructor/notes", icon: "event_note" },
    { name: "Analytics", path: "/instructor/analytics", icon: "analytics" },
    { name: "Profile", path: "/instructor/profile", icon: "account_circle" },
  ];

  return (
    <aside className="flex flex-col h-screen fixed left-0 w-64 z-40 bg-slate-900 dark:bg-slate-950">
      <div className="p-6">
        <div className="text-xl font-bold text-white tracking-tight">Scholar Command</div>
        <div className="text-[10px] uppercase tracking-widest text-indigo-400 mt-1 font-semibold">Expert Console</div>
      </div>
      
      <nav className="flex-1 mt-4">
        {navItems.map((item) => (
          <NavLink
            key={item.name}
            to={item.path}
            className={({ isActive }) =>
              `flex items-center gap-3 px-4 py-3 transition-colors duration-200 ${
                isActive
                  ? "text-indigo-200 border-l-4 border-indigo-400 bg-white/10"
                  : "text-slate-400 hover:text-white hover:bg-slate-800"
              }`
            }
          >
            <span className="material-symbols-outlined">{item.icon}</span>
            <span className="text-[12px] font-medium">{item.name}</span>
          </NavLink>
        ))}
      </nav>

      <div className="p-4 mt-auto">
        <div className="flex items-center gap-3 p-3 rounded-lg bg-white/5">
          <img
            alt="User profile"
            className="w-8 h-8 rounded-full object-cover"
            src="https://lh3.googleusercontent.com/aida-public/AB6AXuBhMzGH1L-kb_5gA29ErHvs1JwGS70_btdp9qNgOaq5W8Gd1STr0Zp_o0dBMgJ91UNk8vsz4aZvgX3I1RI6fnDF3DupkweimEgxmjHAIw9LQ3Qt9H_Q6iICvEZq8gDPJ2SZBRzmX-AtmGJ5tGKpI5L1T4KXYA6p-crkOyyeLdWTKkLstoNXLSyjdf9BGNLpr08gwCHYKF_Cajbl6lIw-akBSIuMTTxQbVWwqEcRje8ItIin79nqik116wofnWqxRJwY9MwfOjSjDwI"
          />
          <div className="overflow-hidden">
            <p className="text-xs font-semibold text-white truncate">Dr. Aris Thorne</p>
            <p className="text-[10px] text-slate-400 truncate">Senior Fellow</p>
          </div>
        </div>
      </div>
    </aside>
  );
}
