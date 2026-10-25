export function GlobalAttendance() {
  const students = [
    { name: "Elena Rodriguez", id: "CS-2023-001", img: "https://lh3.googleusercontent.com/aida-public/AB6AXuAklTB_2giMsU4tAMiKfSeMhmuqxn_40kD8Xh2BMNnyxLFV-5zyEu-ycoYSuVa1fcl15VCfdcWBtqja_c0G2hDLGJ9bMJCT_5q2OJf_6qrvG1bI7hYkZTVRdc49bfPFad3e5DFTHoeXXalajUxVZaKQnBmYeNd0wpyqFlFidk_1wtLa3nmcmtuEVUIt7WR9C9c-SjvjUWWssQZuLYKUs6cIAzPPwBsDLbcfmdWH9o-I3-LpRmJhBUQEjkPgrzqtL8L5lx655QvMwhc", records: ["P","P","T","F","F","W","W"] },
    { name: "Marcus Chen", id: "CS-2023-002", img: "https://lh3.googleusercontent.com/aida-public/AB6AXuDlTmBR1vse7ul6qSd4FTwAesbzBGYMNFMKr1U9JKAA0I7dz2wxWfI6Frs2nad2ZXuGj03zEmt23Pi8j29NJ4pXDWesm1U8rNyoB8jJkyBm0aZKcSBQ_XYzf6IQPJDXx5g-ZETftKReE3yQPMR9NZctlBtLUgvWom-w6qwaQyz9OAvBwnqqlHExnhXKjt4OhQY4VtS7CEYXbYVz5_iZIJ2RP1QNRJRLF6RLbygxLyVX-2FHIGQ0wFs3EQJ6UQQ6v2DbQP3DCYJwCy0", records: ["P","A","T","F","F","W","W"] },
    { name: "Sarah Jenkins", id: "CS-2023-003", img: "https://lh3.googleusercontent.com/aida-public/AB6AXuBpAnT9B9GkxJK8G5j653mUITyH2NP5pvHnQumBcaDGJ-ESAp89TgovyhWJnck03vuwp4GH0jbdN5BBsvkMP9FkzYdGA7-ggPfktYf-AFm3ystARQ_iq7ztGqtUASmC_SZDvld0PJ2-vVIboWQiFYDX2wf9CZlAa-sccL1tJ_mn6H7ydV01keo1INcb-JoTw2xlSYNjB25JWWJTS3Tmx-kuD5T7i9fBToTgOB2A0orMOa6HI6HlMmduyPxsnpMEadOdKntHbNBOrkU", records: ["L","P","T","F","F","W","W"] },
    { name: "David Okafor", id: "CS-2023-004", img: "https://lh3.googleusercontent.com/aida-public/AB6AXuD3QoUZOy5TtbmXMk7wVM0FHo05C-fH_NgawZTMurabfiVNjBgn2VpzM2OO0ri3ZS-L6B19OdxxTieXRsGt0u44pu7dW2dT1hG6D9_5a1LO3rR2yk7-bY-CDsDUpoegRhzaswW_apsFUfaB-1wOmR2Aodh7jvO4yYzS25TxCKomBL1PBsi1YWYCwsFUV-PU8W-LEvo9EpP2CrNrbUz5N5OzpNMQy7y66tLe7HGdupEI1RQpjroSph0YnZoIForIQMD-a_xFhGlARIs", records: ["P","P","T","F","F","W","W"] },
  ];

  const days = [
    { day: "MON", date: "12 OCT" },
    { day: "TUE", date: "13 OCT" },
    { day: "WED", date: "14 OCT", today: true },
    { day: "THU", date: "15 OCT" },
    { day: "FRI", date: "16 OCT" },
    { day: "SAT", date: "17 OCT", weekend: true },
    { day: "SUN", date: "18 OCT", weekend: true },
  ];

  const getStatusIcon = (record) => {
    if (record === "P") return <span className="material-symbols-outlined text-green-600">check_circle</span>;
    if (record === "A") return <span className="material-symbols-outlined text-red-500">cancel</span>;
    if (record === "L") return <span className="material-symbols-outlined text-orange-400">schedule</span>;
    if (record === "T") return (
      <label className="relative inline-flex items-center cursor-pointer">
        <input defaultChecked className="sr-only peer" type="checkbox" />
        <div className="w-11 h-6 bg-surface-variant rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary"></div>
      </label>
    );
    return <div className="w-2 h-2 rounded-full bg-surface-variant"></div>;
  };

  return (
    <div className="pt-20 p-8 min-h-screen space-y-8">
      {/* Header & Stats */}
      <div className="flex flex-col md:flex-row justify-between items-end gap-6">
        <div className="space-y-1">
          <h2 className="text-3xl font-extrabold font-headline tracking-tight text-on-surface">Attendance Tracker</h2>
          <p className="text-secondary">Manage daily session logs and individual student presence records.</p>
        </div>
        <div className="flex gap-4">
          <div className="bg-surface-container-lowest p-4 rounded-xl shadow-[0px_4px_20px_rgba(25,28,30,0.04),0px_8px_40px_rgba(25,28,30,0.02)] min-w-[160px]">
            <p className="text-[10px] font-semibold text-secondary uppercase tracking-wider mb-1">Average Attendance</p>
            <p className="text-2xl font-bold text-primary font-headline">94.2%</p>
          </div>
          <div className="bg-surface-container-lowest p-4 rounded-xl shadow-[0px_4px_20px_rgba(25,28,30,0.04),0px_8px_40px_rgba(25,28,30,0.02)] min-w-[160px]">
            <p className="text-[10px] font-semibold text-secondary uppercase tracking-wider mb-1">Active Batches</p>
            <p className="text-2xl font-bold text-primary font-headline">12</p>
          </div>
        </div>
      </div>

      {/* Filter Bar */}
      <section className="bg-surface-container-low p-6 rounded-2xl flex flex-wrap gap-6 items-center">
        <div className="flex flex-col gap-1.5">
          <label className="text-[10px] font-bold text-on-surface-variant uppercase tracking-widest">Select Batch</label>
          <select className="bg-surface-container-lowest border-none rounded-lg px-4 py-2 text-sm font-medium focus:ring-2 focus:ring-primary/40 shadow-sm">
            <option>Computer Science - Batch A (Evening)</option>
            <option>Data Engineering - Cohort 4</option>
            <option>UX Design Fundamentals - Summer 2024</option>
          </select>
        </div>
        <div className="flex flex-col gap-1.5">
          <label className="text-[10px] font-bold text-on-surface-variant uppercase tracking-widest">Date Range</label>
          <div className="flex items-center bg-surface-container-lowest rounded-lg px-4 py-2 shadow-sm">
            <span className="material-symbols-outlined text-outline text-sm mr-2">calendar_today</span>
            <input className="bg-transparent border-none p-0 text-sm font-medium w-48 focus:ring-0" type="text" defaultValue="Oct 12, 2023 - Oct 19, 2023" readOnly />
          </div>
        </div>
        <div className="flex flex-col gap-1.5">
          <label className="text-[10px] font-bold text-on-surface-variant uppercase tracking-widest">Session Type</label>
          <div className="flex bg-surface-container-highest p-1 rounded-lg">
            <button className="px-4 py-1.5 bg-surface-container-lowest rounded-md text-xs font-bold text-primary shadow-sm">All Sessions</button>
            <button className="px-4 py-1.5 text-xs font-semibold text-secondary hover:text-on-surface transition-colors">Lectures</button>
            <button className="px-4 py-1.5 text-xs font-semibold text-secondary hover:text-on-surface transition-colors">Labs</button>
          </div>
        </div>
        <div className="ml-auto">
          <button className="flex items-center gap-2 bg-surface-container-lowest px-4 py-2.5 rounded-lg text-sm font-bold text-on-surface shadow-sm hover:bg-surface-container transition-colors">
            <span className="material-symbols-outlined text-lg">download</span>
            Export CSV
          </button>
        </div>
      </section>

      {/* Attendance Grid */}
      <div className="grid grid-cols-12 gap-0 bg-surface-container-lowest rounded-2xl shadow-[0px_4px_20px_rgba(25,28,30,0.04),0px_8px_40px_rgba(25,28,30,0.02)] overflow-hidden">
        {/* Left: Student Names */}
        <div className="col-span-3 border-r border-outline-variant/15 bg-surface-container-low/50">
          <div className="p-4 border-b border-outline-variant/15 h-16 flex items-center bg-surface-container-low">
            <span className="text-[10px] font-bold text-on-surface-variant uppercase tracking-widest">Student Information</span>
          </div>
          <div className="divide-y divide-outline-variant/10">
            {students.map((s) => (
              <div key={s.id} className="p-4 h-20 flex items-center gap-3 hover:bg-white transition-colors group">
                <img className="w-10 h-10 rounded-full object-cover" src={s.img} alt={s.name} />
                <div>
                  <p className="text-sm font-bold text-on-surface leading-none group-hover:text-primary transition-colors">{s.name}</p>
                  <p className="text-[10px] text-secondary mt-1 font-medium">{s.id}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Right: Grid */}
        <div className="col-span-9 overflow-x-auto">
          <div className="flex h-16 border-b border-outline-variant/15">
            {days.map((d) => (
              <div key={d.date} className={`flex-none w-32 border-r border-outline-variant/15 p-2 flex flex-col justify-center items-center ${d.today ? "bg-primary/5" : "bg-surface-container-low"}`}>
                <span className={`text-[10px] font-bold leading-none ${d.today ? "text-primary" : d.weekend ? "text-slate-300" : "text-on-surface-variant"}`}>{d.day}</span>
                <span className={`text-base font-extrabold ${d.today ? "text-primary" : d.weekend ? "text-slate-300" : "text-on-surface"}`}>{d.date}</span>
                {d.today && <div className="w-1 h-1 bg-primary rounded-full mt-1"></div>}
              </div>
            ))}
          </div>
          <div className="divide-y divide-outline-variant/10">
            {students.map((s) => (
              <div key={s.id} className="flex h-20">
                {s.records.map((rec, i) => (
                  <div key={i} className={`flex-none w-32 border-r border-outline-variant/15 flex items-center justify-center ${days[i].today ? "bg-primary/5" : days[i].weekend ? "bg-surface-container-low" : ""}`}>
                    {getStatusIcon(rec)}
                  </div>
                ))}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Legend */}
      <div className="flex justify-end">
        <div className="bg-white p-4 rounded-2xl shadow-sm border border-outline-variant/15 space-y-3">
          <h4 className="text-[10px] font-black uppercase tracking-widest text-secondary">Legend</h4>
          <div className="flex items-center gap-3"><span className="material-symbols-outlined text-green-600 text-sm">check_circle</span><span className="text-xs font-medium">Present</span></div>
          <div className="flex items-center gap-3"><span className="material-symbols-outlined text-red-500 text-sm">cancel</span><span className="text-xs font-medium">Absent</span></div>
          <div className="flex items-center gap-3"><span className="material-symbols-outlined text-orange-400 text-sm">schedule</span><span className="text-xs font-medium">Late Arrival</span></div>
        </div>
      </div>

      {/* Action Bar */}
      <div className="flex justify-center">
        <div className="bg-inverse-surface text-inverse-on-surface px-8 py-4 rounded-full flex items-center gap-10 shadow-2xl">
          <div className="flex items-center gap-3">
            <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></div>
            <p className="text-sm font-semibold uppercase tracking-wide">Live Session: CS101 Lecture</p>
          </div>
          <div className="h-6 w-[1px] bg-white/20"></div>
          <div className="flex gap-4">
            <button className="bg-primary text-white px-6 py-2 rounded-full text-xs font-bold hover:scale-105 transition-transform">Save Changes</button>
            <button className="bg-white/10 text-white px-6 py-2 rounded-full text-xs font-bold hover:bg-white/20 transition-all">Cancel</button>
          </div>
        </div>
      </div>
    </div>
  );
}
