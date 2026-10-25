import { useState } from "react";

export function StudentProfileNotes() {
  const [note, setNote] = useState("");

  const notes = [
    { date: "October 14, 2023", title: "Exceptional Problem Solving", tag: "Strength", tagColor: "green", dotColor: "bg-primary", body: "Marcus demonstrated significant improvement in his approach to recursive algorithms. He was able to mentor two of his peers during the afternoon lab session without prompting. High collaborative value shown today." },
    { date: "October 08, 2023", title: "Attendance Decline", tag: "Warning", tagColor: "error", dotColor: "bg-error", body: "Missing three consecutive morning sessions. Marcus cited technical issues with his home connection. Need to monitor if this impacts his Project Module 3 submission next week." },
    { date: "September 29, 2023", title: "Curriculum Milestone", tag: "General", tagColor: "secondary", dotColor: "bg-secondary", body: "Completed the Basic Logic module with a 98% score. Marcus is ready for advanced elective selection. Recommendation: Focus on Data Engineering tracks given his recent performance." },
  ];

  return (
    <div className="pt-20 p-8 min-h-screen">
      {/* Header */}
      <div className="mb-10 flex justify-between items-end">
        <div>
          <nav className="flex gap-2 text-xs font-semibold text-secondary uppercase tracking-widest mb-2">
            <span>Students</span>
            <span className="material-symbols-outlined text-[10px]">chevron_right</span>
            <span className="text-primary">Marcus Vance</span>
          </nav>
          <h2 className="text-4xl font-extrabold font-headline text-on-surface tracking-tight">Student Performance Profile</h2>
        </div>
        <div className="flex gap-3">
          <button className="px-4 py-2 text-sm font-semibold text-secondary hover:bg-surface-container transition-colors rounded-lg flex items-center gap-2">
            <span className="material-symbols-outlined text-sm">file_download</span> Export PDF
          </button>
          <button className="px-4 py-2 text-sm font-semibold text-white bg-primary rounded-lg flex items-center gap-2 shadow-sm">
            <span className="material-symbols-outlined text-sm">mail</span> Contact Parents
          </button>
        </div>
      </div>

      {/* Bento Grid */}
      <div className="grid grid-cols-12 gap-8">
        {/* Left Column */}
        <div className="col-span-12 lg:col-span-5 space-y-8">
          {/* Student Card */}
          <div className="bg-surface-container-lowest p-8 rounded-xl shadow-[0px_4px_20px_rgba(25,28,30,0.04),0px_8px_40px_rgba(25,28,30,0.02)] relative overflow-hidden group">
            <div className="absolute top-0 right-0 p-6 opacity-5 group-hover:opacity-10 transition-opacity">
              <span className="material-symbols-outlined text-8xl">person</span>
            </div>
            <div className="flex items-center gap-6 mb-6">
              <img
                alt="Marcus Vance"
                className="w-20 h-20 rounded-full object-cover"
                src="https://lh3.googleusercontent.com/aida-public/AB6AXuBw42RpBlEs8rEYu61JHzVRfqODIejGAqyaVXJiDZgO0Z__wu9gbHJ5DsMvsF784WYy1EAtWNTuySrbOThn6Lg_GGw779IXSRa1NiDaZiIggtaCs4pvSS6rmPQl6K7tbW7QW5rqGYtxgeXlW9vtIMr64hmc93tke0qFutChfx_efbo7GoTSEWICvdO2SBa24dWlK8kurwYTnO6v3dJ9Fny_e1wX0dq890MccRvvSY7xxgQGvmv_ZeHjpULZqlsL-M0RgeOC0Ol8Wxc"
              />
              <div>
                <h3 className="text-2xl font-bold font-headline">Marcus Vance</h3>
                <p className="text-sm text-secondary">Batch: Advanced Computer Science (ACS-24)</p>
                <div className="flex gap-2 mt-2">
                  <span className="px-2 py-0.5 bg-green-100 text-green-700 text-[10px] font-bold uppercase rounded-full">Top Performer</span>
                  <span className="px-2 py-0.5 bg-blue-100 text-blue-700 text-[10px] font-bold uppercase rounded-full">Scholarship</span>
                </div>
              </div>
            </div>
            <div className="grid grid-cols-3 gap-4 border-t border-outline-variant/15 pt-6">
              <div className="text-center">
                <p className="text-[10px] font-bold text-secondary uppercase tracking-wider mb-1">Attendance</p>
                <p className="text-2xl font-black text-primary">94%</p>
              </div>
              <div className="text-center border-x border-outline-variant/15">
                <p className="text-[10px] font-bold text-secondary uppercase tracking-wider mb-1">Avg Score</p>
                <p className="text-2xl font-black text-primary">88.5</p>
              </div>
              <div className="text-center">
                <p className="text-[10px] font-bold text-secondary uppercase tracking-wider mb-1">Rank</p>
                <p className="text-2xl font-black text-primary">04</p>
              </div>
            </div>
          </div>

          {/* Skills Progress */}
          <div className="bg-surface-container-low p-8 rounded-xl space-y-6">
            <h4 className="text-xs font-black text-on-surface-variant uppercase tracking-[0.2em] mb-4">Core Skill Mastery</h4>
            <div className="space-y-4">
              {[
                { skill: "Algorithm Design", pct: 92 },
                { skill: "Data Structures", pct: 78 },
                { skill: "System Architecture", pct: 64 },
                { skill: "Collaborative Coding", pct: 85 },
              ].map((s) => (
                <div key={s.skill}>
                  <div className="flex justify-between items-end mb-2">
                    <span className="text-sm font-semibold">{s.skill}</span>
                    <span className="text-xs font-bold text-primary">{s.pct}%</span>
                  </div>
                  <div className="h-1.5 w-full bg-surface-container-highest rounded-full overflow-hidden">
                    <div className="h-full bg-primary" style={{ width: `${s.pct}%` }}></div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Quiz Score Velocity */}
          <div className="bg-surface-container-lowest p-8 rounded-xl shadow-[0px_4px_20px_rgba(25,28,30,0.04),0px_8px_40px_rgba(25,28,30,0.02)]">
            <h4 className="text-xs font-black text-on-surface-variant uppercase tracking-[0.2em] mb-6">Quiz Score Velocity</h4>
            <div className="flex items-end justify-between h-24 gap-2">
              {[40, 65, 50, 85, 90, 75, 95].map((h, i) => (
                <div key={i} className={`w-full rounded-t-sm ${i === 4 || i === 6 ? "bg-primary" : "bg-primary-fixed/30"}`} style={{ height: `${h}%` }}></div>
              ))}
            </div>
            <div className="flex justify-between mt-4 text-[10px] font-bold text-secondary uppercase tracking-widest">
              <span>Jan</span>
              <span>Current</span>
            </div>
          </div>
        </div>

        {/* Right Column */}
        <div className="col-span-12 lg:col-span-7 space-y-8">
          {/* Add Note Card */}
          <div className="bg-surface-container-lowest p-1 rounded-xl shadow-[0px_4px_20px_rgba(25,28,30,0.04),0px_8px_40px_rgba(25,28,30,0.02)] border border-primary/10">
            <div className="p-6 space-y-4">
              <div className="flex items-center gap-4">
                <img
                  alt="Instructor"
                  className="w-10 h-10 rounded-full"
                  src="https://lh3.googleusercontent.com/aida-public/AB6AXuBhMzGH1L-kb_5gA29ErHvs1JwGS70_btdp9qNgOaq5W8Gd1STr0Zp_o0dBMgJ91UNk8vsz4aZvgX3I1RI6fnDF3DupkweimEgxmjHAIw9LQ3Qt9H_Q6iICvEZq8gDPJ2SZBRzmX-AtmGJ5tGKpI5L1T4KXYA6p-crkOyyeLdWTKkLstoNXLSyjdf9BGNLpr08gwCHYKF_Cajbl6lIw-akBSIuMTTxQbVWwqEcRje8ItIin79nqik116wofnWqxRJwY9MwfOjSjDwI"
                />
                <input
                  className="flex-1 border-none focus:ring-0 text-sm py-2 placeholder:text-outline/60 bg-transparent"
                  placeholder="Add a new mentor note for Marcus..."
                  type="text"
                  value={note}
                  onChange={(e) => setNote(e.target.value)}
                />
              </div>
              <div className="flex justify-between items-center pt-2">
                <div className="flex gap-2">
                  {[{ icon: "bolt", label: "Strength" }, { icon: "warning", label: "Warning" }, { icon: "priority_high", label: "Urgency" }].map((t) => (
                    <button key={t.label} className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-[10px] font-bold bg-surface-container hover:bg-surface-container-high transition-colors text-secondary uppercase">
                      <span className="material-symbols-outlined text-[14px]">{t.icon}</span> {t.label}
                    </button>
                  ))}
                </div>
                <button className="bg-primary text-white px-6 py-2 rounded-lg text-sm font-bold shadow-md">Post Note</button>
              </div>
            </div>
          </div>

          {/* Notes Timeline */}
          <div className="space-y-6 relative pl-8">
            <div className="absolute left-3 top-2 bottom-0 w-[2px] bg-outline-variant/30"></div>
            {notes.map((n, i) => (
              <div key={i} className="relative bg-surface-container-lowest p-6 rounded-xl shadow-[0px_4px_20px_rgba(25,28,30,0.04),0px_8px_40px_rgba(25,28,30,0.02)] group">
                <div className={`absolute -left-[25px] top-7 w-4 h-4 rounded-full ${n.dotColor} ring-4 ring-surface-bright`}></div>
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <span className="text-[10px] font-black text-secondary uppercase tracking-widest block mb-1">{n.date}</span>
                    <h5 className="text-sm font-bold">{n.title}</h5>
                  </div>
                  <span className={`px-3 py-1 text-[10px] font-bold uppercase rounded-full ${n.tagColor === "green" ? "bg-green-50 text-green-700" : n.tagColor === "error" ? "bg-error-container text-on-error-container" : "bg-surface-container-high text-secondary"}`}>
                    {n.tag}
                  </span>
                </div>
                <p className="text-sm leading-relaxed text-secondary mb-4">{n.body}</p>
                <div className="flex gap-4 items-center">
                  <div className="flex items-center gap-1 text-[10px] font-bold text-outline uppercase tracking-wider cursor-pointer hover:text-primary transition-colors">
                    <span className="material-symbols-outlined text-[14px]">reply</span> Reply
                  </div>
                  <div className="flex items-center gap-1 text-[10px] font-bold text-outline uppercase tracking-wider cursor-pointer hover:text-primary transition-colors">
                    <span className="material-symbols-outlined text-[14px]">edit</span> Edit
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="flex justify-center pt-4">
            <button className="px-8 py-3 bg-surface-container text-secondary text-[10px] font-black uppercase tracking-[0.2em] rounded-full hover:bg-surface-container-high transition-all">
              View Full History
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
