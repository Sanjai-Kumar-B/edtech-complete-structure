export function InstructorDashboard() {
  return (
    <div className="pt-20 p-8 space-y-8">
      {/* Welcome Header */}
      <header className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <h1 className="text-3xl font-extrabold text-on-surface tracking-tight">Welcome back, Professor</h1>
          <p className="text-secondary font-medium mt-1">You have 4 sessions scheduled for today, October 24th.</p>
        </div>
        <div className="flex items-center gap-2 px-4 py-2 bg-surface-container-low rounded-lg text-sm font-medium text-on-surface-variant">
          <span className="material-symbols-outlined text-[18px]">calendar_today</span>
          <span>Thursday, Oct 24, 2024</span>
        </div>
      </header>

      {/* Summary Cards Bento Grid */}
      <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-surface-container-lowest p-6 rounded-xl shadow-[0px_4px_20px_rgba(25,28,30,0.04),0px_8px_40px_rgba(25,28,30,0.02)]">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-[12px] font-semibold text-secondary uppercase tracking-wider mb-1">Active Batches</p>
              <h2 className="text-3xl font-bold text-on-surface">12</h2>
            </div>
            <div className="p-2 bg-primary-fixed rounded-lg text-primary">
              <span className="material-symbols-outlined">hub</span>
            </div>
          </div>
          <div className="mt-4 flex items-center gap-2 text-[12px] font-medium text-emerald-600">
            <span className="material-symbols-outlined text-[16px]">trending_up</span>
            <span>+2 from last month</span>
          </div>
        </div>

        <div className="bg-surface-container-lowest p-6 rounded-xl shadow-[0px_4px_20px_rgba(25,28,30,0.04),0px_8px_40px_rgba(25,28,30,0.02)]">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-[12px] font-semibold text-secondary uppercase tracking-wider mb-1">Total Students</p>
              <h2 className="text-3xl font-bold text-on-surface">428</h2>
            </div>
            <div className="p-2 bg-secondary-fixed rounded-lg text-secondary">
              <span className="material-symbols-outlined">school</span>
            </div>
          </div>
          <div className="mt-4 flex items-center gap-2 text-[12px] font-medium text-on-surface-variant">
            <span>98% engagement rate</span>
          </div>
        </div>

        <div className="bg-surface-container-lowest p-6 rounded-xl shadow-[0px_4px_20px_rgba(25,28,30,0.04),0px_8px_40px_rgba(25,28,30,0.02)]">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-[12px] font-semibold text-secondary uppercase tracking-wider mb-1">Pending Review</p>
              <h2 className="text-3xl font-bold text-primary">34</h2>
            </div>
            <div className="p-2 bg-error-container rounded-lg text-error">
              <span className="material-symbols-outlined">rate_review</span>
            </div>
          </div>
          <div className="mt-4 flex items-center gap-2 text-[12px] font-medium text-error">
            <span className="material-symbols-outlined text-[16px]">priority_high</span>
            <span>12 Overdue (48h+)</span>
          </div>
        </div>

        <div className="bg-surface-container-lowest p-6 rounded-xl shadow-[0px_4px_20px_rgba(25,28,30,0.04),0px_8px_40px_rgba(25,28,30,0.02)]">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-[12px] font-semibold text-secondary uppercase tracking-wider mb-1">Scheduled Sessions</p>
              <h2 className="text-3xl font-bold text-on-surface">04</h2>
            </div>
            <div className="p-2 bg-tertiary-fixed rounded-lg text-tertiary">
              <span className="material-symbols-outlined">videocam</span>
            </div>
          </div>
          <div className="mt-4 flex items-center gap-2 text-[12px] font-medium text-on-surface-variant">
            <span>Next: 02:00 PM (Batch 24A)</span>
          </div>
        </div>
      </section>

      {/* Main Data Section */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Column: Batch Overview */}
        <section className="lg:col-span-8 bg-surface-container-lowest rounded-xl shadow-[0px_4px_20px_rgba(25,28,30,0.04),0px_8px_40px_rgba(25,28,30,0.02)] overflow-hidden">
          <div className="px-8 py-6 flex justify-between items-center">
            <h3 className="text-lg font-bold text-on-surface">Active Batch Progress</h3>
            <button className="text-primary text-sm font-semibold hover:underline">View All Batches</button>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead className="bg-surface-container-low border-none">
                <tr>
                  <th className="px-8 py-4 text-[11px] font-bold text-on-surface-variant uppercase tracking-widest">Batch Identity</th>
                  <th className="px-6 py-4 text-[11px] font-bold text-on-surface-variant uppercase tracking-widest text-center">Progress</th>
                  <th className="px-6 py-4 text-[11px] font-bold text-on-surface-variant uppercase tracking-widest">Next Session</th>
                  <th className="px-8 py-4 text-[11px] font-bold text-on-surface-variant uppercase tracking-widest text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-transparent">
                {[
                  { name: "Data Architecture 24A", desc: "32 Students • Advanced Tier", progress: 78, date: "Today, 02:00 PM", pulse: true },
                  { name: "Systemic Logic v.2", desc: "45 Students • Core Series", progress: 45, date: "Oct 25, 10:00 AM", pulse: false },
                  { name: "Quantum Analytics", desc: "18 Students • Research", progress: 92, date: "Today, 04:30 PM", pulse: false },
                  { name: "Algorithmic Ethics", desc: "112 Students • Seminar", progress: 12, date: "Oct 26, 09:00 AM", pulse: false },
                ].map((batch, index) => (
                  <tr key={index} className="hover:bg-surface-container-low transition-colors group">
                    <td className="px-8 py-5">
                      <div className="flex flex-col">
                        <span className="text-sm font-bold text-on-surface">{batch.name}</span>
                        <span className="text-[11px] text-secondary">{batch.desc}</span>
                      </div>
                    </td>
                    <td className="px-6 py-5">
                      <div className="flex flex-col gap-1.5 items-center">
                        <div className="w-full max-w-[120px] h-1.5 bg-surface-container-highest rounded-full overflow-hidden">
                          <div className={`bg-primary h-full`} style={{ width: `${batch.progress}%` }}></div>
                        </div>
                        <span className="text-[11px] font-medium text-on-surface-variant">{batch.progress}% Complete</span>
                      </div>
                    </td>
                    <td className="px-6 py-5">
                      <div className="flex items-center gap-2">
                        {batch.pulse && <div className="w-2 h-2 rounded-full bg-primary animate-pulse"></div>}
                        <span className="text-sm font-medium text-on-surface">{batch.date}</span>
                      </div>
                    </td>
                    <td className="px-8 py-5 text-right">
                      <button className="px-4 py-1.5 text-[12px] font-bold border-2 border-primary text-primary hover:bg-primary hover:text-white rounded transition-all">Open</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        {/* Right Column: Pending Tasks & Flags */}
        <section className="lg:col-span-4 space-y-6">
          {/* Tasks Panel */}
          <div className="bg-surface-container-lowest rounded-xl shadow-[0px_4px_20px_rgba(25,28,30,0.04),0px_8px_40px_rgba(25,28,30,0.02)]">
            <div className="p-6 border-b border-transparent">
              <div className="flex justify-between items-center">
                <h3 className="text-lg font-bold text-on-surface">Critical Focus</h3>
                <span className="px-2 py-1 bg-error-container text-error text-[10px] font-bold rounded uppercase">Action Required</span>
              </div>
            </div>
            <div className="p-2">
              {/* Flagged Students */}
              <div className="p-4 bg-surface-container-low rounded-lg mb-4">
                <div className="flex items-center gap-2 mb-3">
                  <span className="material-symbols-outlined text-error text-[20px]">flag</span>
                  <span className="text-xs font-bold text-on-surface uppercase tracking-wide">Attention Flag (3)</span>
                </div>
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <img
                        alt="Student"
                        className="w-8 h-8 rounded-full object-cover"
                        src="https://lh3.googleusercontent.com/aida-public/AB6AXuClXU3DCu2wVpRPknkdwy0q00PykYGLiwdjzbAnEVdtB_omg_--nm83ZdDMz9FdcZI10oqZWs3K0U4A4FY0WP23LGpElmI4lGB9eKPOiNcFXpSZh5JnVvjyJyldf1lruMrE4zSrfgkWSXx9-08YUamyaATwQMNDHeHKEhTRqVuu60aylaldiZLCMCZ_1MNl1sbnOFGJj3RM5hjQ4W274d17RtJjiOmzoJJDBnzZ6fPq2u2HP4p2Sd0sd1W9fWEaqHQzCXJFzVwvo6w"
                      />
                      <div className="flex flex-col">
                        <span className="text-xs font-bold">Liam Vance</span>
                        <span className="text-[10px] text-secondary">3 days inactive</span>
                      </div>
                    </div>
                    <button className="text-primary hover:text-primary-container"><span className="material-symbols-outlined text-[18px]">chat</span></button>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <img
                        alt="Student"
                        className="w-8 h-8 rounded-full object-cover"
                        src="https://lh3.googleusercontent.com/aida-public/AB6AXuCaBGgYgCVCtq1PPSwh4SpdKPQOvtZc1vyHO8b976ujK-FPz8rlpozQ8p5zdoEs499uloXt7uHwMj9_CJQmuiVncH45JpRNSxQ0f0N2UB3gZi4Tcwb7OHuVSjv_tZ35LiKhd3rVQqA2YaA4AFEqtJp_2bu2vhrZD6dqXkLm5CcIzbYjy_ZAd--_6d4ji96r82XSWH4LQt1FGkFDDK3XZwlHQuos4q97dJzNmNpH2b93OroFrroi4FxjpPeL9JRIqSLfUFJHGbpvds0"
                      />
                      <div className="flex flex-col">
                        <span className="text-xs font-bold">Sarah Chen</span>
                        <span className="text-[10px] text-secondary">Failed Quiz 4.2</span>
                      </div>
                    </div>
                    <button className="text-primary hover:text-primary-container"><span className="material-symbols-outlined text-[18px]">auto_awesome</span></button>
                  </div>
                </div>
              </div>

              {/* Assignment Queue */}
              <div className="space-y-1">
                <p className="px-4 py-2 text-[11px] font-bold text-secondary uppercase tracking-widest">Pending Assignments</p>
                <a className="flex items-start gap-4 p-4 hover:bg-surface-container transition-colors rounded-lg group" href="#">
                  <div className="w-10 h-10 bg-indigo-50 rounded flex items-center justify-center text-primary group-hover:bg-primary group-hover:text-white transition-all shrink-0">
                    <span className="material-symbols-outlined">description</span>
                  </div>
                  <div className="flex flex-col flex-1">
                    <span className="text-sm font-bold text-on-surface">Data Modeling Project</span>
                    <span className="text-xs text-secondary">Batch 24A • 18 submissions</span>
                    <div className="mt-2 text-[10px] text-error font-bold flex items-center gap-1">
                      <span className="material-symbols-outlined text-[14px]">schedule</span>
                      <span>Expires in 4h</span>
                    </div>
                  </div>
                </a>
                <a className="flex items-start gap-4 p-4 hover:bg-surface-container transition-colors rounded-lg group" href="#">
                  <div className="w-10 h-10 bg-indigo-50 rounded flex items-center justify-center text-primary group-hover:bg-primary group-hover:text-white transition-all shrink-0">
                    <span className="material-symbols-outlined">code</span>
                  </div>
                  <div className="flex flex-col flex-1">
                    <span className="text-sm font-bold text-on-surface">Recursive Algorithms Lab</span>
                    <span className="text-xs text-secondary">Core Series • 7 submissions</span>
                    <div className="mt-2 text-[10px] text-on-surface-variant font-bold flex items-center gap-1">
                      <span className="material-symbols-outlined text-[14px]">done_all</span>
                      <span>High priority</span>
                    </div>
                  </div>
                </a>
              </div>
            </div>
            <div className="p-4 border-t border-transparent bg-surface-container-low/30 rounded-b-xl">
              <button className="w-full py-2 bg-white border border-outline-variant text-sm font-bold text-on-surface hover:bg-slate-50 transition-all rounded shadow-sm">View Workload Analytics</button>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}
