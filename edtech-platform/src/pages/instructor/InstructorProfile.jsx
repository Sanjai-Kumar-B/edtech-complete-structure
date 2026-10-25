export function InstructorProfile() {
  return (
    <div className="pt-20 p-8 min-h-screen space-y-8">
      <div className="flex justify-between items-end">
        <div>
          <h2 className="text-3xl font-extrabold tracking-tight text-on-surface">My Profile</h2>
          <p className="text-secondary font-medium mt-1">Manage your instructor account and preferences.</p>
        </div>
        <button className="px-6 py-2.5 bg-primary text-white text-sm font-bold rounded-lg shadow-md hover:opacity-90 transition-opacity">Save Changes</button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left: Profile Card */}
        <div className="lg:col-span-4 space-y-6">
          <div className="bg-surface-container-lowest p-8 rounded-xl shadow-[0px_4px_20px_rgba(25,28,30,0.04),0px_8px_40px_rgba(25,28,30,0.02)] text-center space-y-4">
            <div className="relative inline-block">
              <img
                alt="Dr. Aris Thorne"
                className="w-28 h-28 rounded-full object-cover mx-auto"
                src="https://lh3.googleusercontent.com/aida-public/AB6AXuBhMzGH1L-kb_5gA29ErHvs1JwGS70_btdp9qNgOaq5W8Gd1STr0Zp_o0dBMgJ91UNk8vsz4aZvgX3I1RI6fnDF3DupkweimEgxmjHAIw9LQ3Qt9H_Q6iICvEZq8gDPJ2SZBRzmX-AtmGJ5tGKpI5L1T4KXYA6p-crkOyyeLdWTKkLstoNXLSyjdf9BGNLpr08gwCHYKF_Cajbl6lIw-akBSIuMTTxQbVWwqEcRje8ItIin79nqik116wofnWqxRJwY9MwfOjSjDwI"
              />
              <button className="absolute bottom-0 right-0 w-8 h-8 bg-primary text-white rounded-full flex items-center justify-center shadow-md hover:opacity-90 transition-opacity">
                <span className="material-symbols-outlined text-[16px]">photo_camera</span>
              </button>
            </div>
            <div>
              <h3 className="text-xl font-bold font-headline text-on-surface">Dr. Aris Thorne</h3>
              <p className="text-sm text-secondary">Senior Fellow · Advanced Physics Dept.</p>
              <div className="mt-3 flex justify-center gap-2">
                <span className="px-3 py-1 bg-primary-fixed text-on-primary-fixed-variant text-[10px] font-bold uppercase rounded-full">Senior Instructor</span>
                <span className="px-3 py-1 bg-secondary-fixed text-on-secondary-fixed-variant text-[10px] font-bold uppercase rounded-full">Verified</span>
              </div>
            </div>
          </div>

          <div className="bg-surface-container-lowest p-6 rounded-xl shadow-[0px_4px_20px_rgba(25,28,30,0.04),0px_8px_40px_rgba(25,28,30,0.02)] space-y-4">
            <h4 className="text-xs font-black text-on-surface-variant uppercase tracking-[0.2em]">Quick Stats</h4>
            {[
              { label: "Active Batches", value: "12", icon: "hub" },
              { label: "Total Students", value: "428", icon: "school" },
              { label: "Avg Rating", value: "4.9 / 5", icon: "star" },
              { label: "Years Teaching", value: "11 yrs", icon: "workspace_premium" },
            ].map((s) => (
              <div key={s.label} className="flex items-center justify-between">
                <div className="flex items-center gap-3 text-secondary">
                  <span className="material-symbols-outlined text-[18px]">{s.icon}</span>
                  <span className="text-sm font-medium">{s.label}</span>
                </div>
                <span className="text-sm font-bold text-on-surface">{s.value}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Right: Edit Form */}
        <div className="lg:col-span-8 space-y-6">
          <div className="bg-surface-container-lowest p-8 rounded-xl shadow-[0px_4px_20px_rgba(25,28,30,0.04),0px_8px_40px_rgba(25,28,30,0.02)]">
            <h3 className="text-lg font-bold text-on-surface mb-6">Personal Information</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {[
                { label: "First Name", value: "Aris", type: "text" },
                { label: "Last Name", value: "Thorne", type: "text" },
                { label: "Email Address", value: "a.thorne@university.edu", type: "email" },
                { label: "Phone Number", value: "+1 (555) 012-3456", type: "tel" },
              ].map((f) => (
                <div key={f.label} className="space-y-2">
                  <label className="text-[11px] font-bold text-on-surface-variant uppercase tracking-widest">{f.label}</label>
                  <input
                    className="w-full bg-surface-container-low border-none rounded-lg px-4 py-3 text-sm font-medium focus:ring-2 focus:ring-primary/40 transition-all"
                    type={f.type}
                    defaultValue={f.value}
                  />
                </div>
              ))}
              <div className="md:col-span-2 space-y-2">
                <label className="text-[11px] font-bold text-on-surface-variant uppercase tracking-widest">Department</label>
                <select className="w-full bg-surface-container-low border-none rounded-lg px-4 py-3 text-sm font-medium focus:ring-2 focus:ring-primary/40 transition-all">
                  <option>Advanced Physics Department</option>
                  <option>Computer Science</option>
                  <option>Data Engineering</option>
                </select>
              </div>
              <div className="md:col-span-2 space-y-2">
                <label className="text-[11px] font-bold text-on-surface-variant uppercase tracking-widest">Bio / About</label>
                <textarea
                  className="w-full bg-surface-container-low border-none rounded-lg px-4 py-3 text-sm font-medium focus:ring-2 focus:ring-primary/40 transition-all resize-none"
                  rows={4}
                  defaultValue="Senior Fellow specialising in advanced structural dynamics, quantum analytics, and algorithmic ethics. 11 years of academic teaching with cross-disciplinary research experience."
                />
              </div>
            </div>
          </div>

          <div className="bg-surface-container-lowest p-8 rounded-xl shadow-[0px_4px_20px_rgba(25,28,30,0.04),0px_8px_40px_rgba(25,28,30,0.02)]">
            <h3 className="text-lg font-bold text-on-surface mb-6">Notification Preferences</h3>
            <div className="space-y-4">
              {[
                { label: "Assignment submissions", desc: "Notify when students submit assignments", on: true },
                { label: "Attendance alerts", desc: "Alert when student attendance falls below threshold", on: true },
                { label: "Class reminders", desc: "Remind me 30 minutes before a scheduled session", on: false },
                { label: "Batch reports", desc: "Weekly batch performance digest", on: true },
              ].map((n) => (
                <div key={n.label} className="flex items-center justify-between py-3 border-b border-outline-variant/10 last:border-0">
                  <div>
                    <p className="text-sm font-semibold text-on-surface">{n.label}</p>
                    <p className="text-xs text-secondary">{n.desc}</p>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input type="checkbox" defaultChecked={n.on} className="sr-only peer" />
                    <div className="w-11 h-6 bg-surface-variant rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary"></div>
                  </label>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
