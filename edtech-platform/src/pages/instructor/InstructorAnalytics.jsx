import { useState } from "react";

export function InstructorAnalytics() {
  const [period, setPeriod] = useState("30days");

  return (
    <div className="pt-20 p-8 min-h-screen space-y-8">
      {/* Header & Date Filter */}
      <div className="flex justify-between items-end">
        <div>
          <h2 className="text-3xl font-extrabold tracking-tight text-on-surface">Instructor Analytics</h2>
          <p className="text-secondary font-medium mt-1">Real-time performance metrics across all active batches.</p>
        </div>
        <div className="flex bg-surface-container-low rounded-xl p-1 gap-1">
          {[["30days","Last 30 Days"],["quarterly","Quarterly"],["alltime","All Time"]].map(([val, label]) => (
            <button
              key={val}
              onClick={() => setPeriod(val)}
              className={`px-4 py-2 text-xs font-bold uppercase tracking-wider rounded-lg transition-all ${period === val ? "text-primary bg-white shadow-sm" : "text-on-surface-variant hover:bg-white/50"}`}
            >
              {label}
            </button>
          ))}
        </div>
      </div>

      {/* Key Metrics Row */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        {[
          { label: "Global Average", value: "78.4%", delta: "+2.4%", deltaColor: "text-green-600", icon: "trending_up" },
          { label: "Completion Rate", value: "92.1%", delta: "Steady", deltaColor: "text-slate-400", icon: null },
          { label: "Engagement Score", value: "8.4/10", delta: "+0.8", deltaColor: "text-green-600", icon: "trending_up" },
          { label: "Active Students", value: "1,240", delta: "New Batch", deltaColor: "text-primary", icon: "group" },
        ].map((m) => (
          <div key={m.label} className="bg-surface-container-lowest p-6 rounded-xl shadow-[0px_4px_20px_rgba(25,28,30,0.04),0px_8px_40px_rgba(25,28,30,0.02)]">
            <p className="text-xs font-semibold uppercase tracking-widest text-secondary mb-2">{m.label}</p>
            <div className="flex items-baseline gap-2">
              <span className="text-4xl font-bold text-on-surface">{m.value}</span>
              <span className={`text-xs font-bold ${m.deltaColor} flex items-center gap-1`}>
                {m.icon && <span className="material-symbols-outlined text-sm">{m.icon}</span>}
                {m.delta}
              </span>
            </div>
          </div>
        ))}
      </div>

      {/* Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Bar Chart */}
        <div className="lg:col-span-8 bg-surface-container-lowest p-8 rounded-xl shadow-[0px_8px_40px_rgba(25,28,30,0.02)] relative overflow-hidden">
          <div className="flex justify-between items-start mb-8">
            <div>
              <h3 className="text-xl font-bold text-on-surface">Average Scores by Module</h3>
              <p className="text-sm text-secondary">Performance comparison across the technical stack</p>
            </div>
            <span className="material-symbols-outlined text-slate-300">bar_chart</span>
          </div>
          <div className="h-64 flex items-end justify-between gap-4 px-4">
            {[
              { label: "UI Design", h: "h-4/5", pct: "82%", active: false },
              { label: "Backend", h: "h-3/5", pct: "64%", active: false },
              { label: "React Dev", h: "h-full", pct: "94%", active: true },
              { label: "Cloud", h: "h-2/5", pct: "45%", active: false },
              { label: "Data Viz", h: "h-3/4", pct: "78%", active: false },
            ].map((b) => (
              <div key={b.label} className="flex flex-col items-center flex-1 group">
                <div className={`w-full ${b.active ? "bg-primary" : "bg-primary/10 group-hover:bg-primary/20"} rounded-t-lg ${b.h} relative transition-all`}>
                  <div className={`absolute -top-8 left-1/2 -translate-x-1/2 ${b.active ? "bg-primary" : "bg-on-surface"} text-white text-[10px] py-1 px-2 rounded ${b.active ? "opacity-100" : "opacity-0 group-hover:opacity-100"} transition-opacity`}>{b.pct}</div>
                </div>
                <p className={`mt-4 text-[10px] font-bold uppercase tracking-wider ${b.active ? "text-on-surface" : "text-on-surface-variant"}`}>{b.label}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Insights Panel */}
        <div className="lg:col-span-4 space-y-6">
          <div className="bg-surface-container-low p-6 rounded-xl border border-outline-variant/15">
            <div className="flex items-center gap-3 mb-4">
              <span className="material-symbols-outlined text-tertiary">warning</span>
              <h4 className="font-bold text-sm uppercase tracking-wide">Friction Points</h4>
            </div>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-bold text-on-surface">Advanced Auth Flow</p>
                  <p className="text-xs text-secondary">34% Fail rate</p>
                </div>
                <span className="px-2 py-1 bg-error-container text-on-error-container text-[10px] font-black rounded uppercase">Critical</span>
              </div>
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-bold text-on-surface">Redux Middleware</p>
                  <p className="text-xs text-secondary">Average grade 62%</p>
                </div>
                <span className="px-2 py-1 bg-tertiary-fixed text-on-tertiary-fixed text-[10px] font-black rounded uppercase">High</span>
              </div>
            </div>
          </div>
          <div className="bg-surface-container-lowest p-6 rounded-xl shadow-[0px_8px_40px_rgba(25,28,30,0.02)]">
            <h4 className="font-bold text-sm uppercase tracking-wide mb-4">Attendance Drop Patterns</h4>
            <div className="space-y-4">
              <div className="flex items-center gap-4">
                <div className="w-2 h-2 rounded-full bg-error"></div>
                <p className="text-xs text-secondary font-medium"><span className="text-on-surface font-bold">Friday Evenings</span> show 15% lower attendance than average.</p>
              </div>
              <div className="flex items-center gap-4">
                <div className="w-2 h-2 rounded-full bg-tertiary"></div>
                <p className="text-xs text-secondary font-medium"><span className="text-on-surface font-bold">Module 4 Week</span> typically has the highest drop-off rate.</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Engagement + At-Risk */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 bg-surface-container-lowest p-8 rounded-xl shadow-[0px_8px_40px_rgba(25,28,30,0.02)]">
          <div className="flex justify-between items-center mb-10">
            <h3 className="text-xl font-bold text-on-surface">Engagement Trends</h3>
            <div className="flex gap-4">
              <div className="flex items-center gap-2"><div className="w-3 h-3 rounded-full bg-primary"></div><span className="text-[10px] font-bold uppercase text-slate-400">Current Week</span></div>
              <div className="flex items-center gap-2"><div className="w-3 h-3 rounded-full bg-outline-variant"></div><span className="text-[10px] font-bold uppercase text-slate-400">Previous Week</span></div>
            </div>
          </div>
          <div className="relative h-64 w-full">
            <svg className="w-full h-full overflow-visible" viewBox="0 0 800 200">
              <path d="M0,150 Q100,80 200,120 T400,60 T600,100 T800,20" fill="none" stroke="#00288e" strokeLinecap="round" strokeWidth="4" />
              <path d="M0,170 Q100,140 200,160 T400,110 T600,130 T800,90" fill="none" stroke="#c4c5d5" strokeDasharray="8,4" strokeLinecap="round" strokeWidth="3" />
              <circle cx="400" cy="60" fill="#00288e" r="6" />
            </svg>
            <div className="absolute top-8 left-[48%] bg-white p-3 rounded-lg shadow-xl border border-outline-variant/10">
              <p className="text-[10px] font-bold text-slate-400 uppercase">Wednesday Peak</p>
              <p className="text-sm font-bold text-on-surface">98% Engagement</p>
            </div>
          </div>
        </div>

        <div className="bg-surface-container-low p-8 rounded-xl">
          <h3 className="text-xl font-bold text-on-surface mb-6">At-Risk Review</h3>
          <div className="space-y-6">
            {[
              { name: "Julian Vance", detail: "3 Missed Assignments", img: "https://lh3.googleusercontent.com/aida-public/AB6AXuBtwyHV1kKwv8BGk6I6VZIIcaLcedwX4U6YU8Y1Lp7rUEIaMMCLC9xeha0QwWlGdPlttrtyFTC0j9_sJoESBKzuYYkWPG8Ih2xPwxCIolcp3yubGv4c4IYSF7Rmlbw19eJNXrio6TZSgtoZsF5qmB5cY0SHl6wpvLH8_fnjHMf7Z_LnzGQ0V__KlR-tYvwLbygmAYks7vcYUTxvbpKsB074d9F2_ewnqqGpEmcTodSDRMubEUqFXYxtttayHX7V7N5k0r9wKi15yY0" },
              { name: "Sarah K.", detail: "Engagement down 40%", img: "https://lh3.googleusercontent.com/aida-public/AB6AXuBG5_kTBnw1e3PANw6oLIoTyBwm9nd5D42Qlgv3nyhxT-N77qYtj4vLfFJSNcOCfR62IbQWsS7DOQ4gPruSI99UvUgpwHmEYpt2JrVPnWGMFIIWNo1dJSw587AcaKgcaM2RFM6lxVYIuvgnjgkfNnTnv38pj2LAdrzmmBjadfcUpycMGhL3eyAMFkGVltNzhj8-KLjPstYzDcRpANfnbLnfc3Sq69bCo3DS_P5XnINJg5GhdCakYpMj52xxudxH9R-BhEDOQdIzPGA" },
              { name: "Marcus Chen", detail: "Last Active: 6 Days ago", img: "https://lh3.googleusercontent.com/aida-public/AB6AXuAmlHBW25itYHESyS1tRRHiqCB2hX4I2l4qJZPJvFjc1LeLopGz_xjUtR6aUyC0mmNmKbSPyw0hSEWokWSil0fb_BvAtO4Uuj75n7hg9KDo8S8QtWfp-vJMmNAhm92qUig6SOnMBWQUsyG4LDnhTTzZci3H8jjTTM0roDLz2b4DIaROI_lY93SJnB0rmM4Pg2jL70XdtlZaZkPXk0twKohggxwwmLTvU-Mo88f-Lh1cfKhI7BUVmV5zF3WF5c2UrJy2vlnAhCEjDXk" },
            ].map((s) => (
              <div key={s.name} className="flex items-center gap-4">
                <img alt={s.name} className="w-12 h-12 rounded-full object-cover shadow-sm" src={s.img} />
                <div className="flex-1">
                  <p className="text-sm font-bold text-on-surface">{s.name}</p>
                  <p className="text-xs text-secondary">{s.detail}</p>
                </div>
                <button className="material-symbols-outlined text-slate-400 hover:text-primary transition-colors">mail</button>
              </div>
            ))}
            <button className="w-full mt-4 py-3 border-2 border-dashed border-outline-variant text-[10px] font-bold uppercase tracking-widest text-secondary hover:bg-white transition-colors rounded-lg">
              View All 12 Flags
            </button>
          </div>
        </div>
      </div>

      {/* Batch Performance Table */}
      <div className="bg-surface-container-lowest rounded-xl shadow-[0px_8px_40px_rgba(25,28,30,0.02)] overflow-hidden">
        <div className="p-8 flex justify-between items-center border-b border-outline-variant/10">
          <h3 className="text-xl font-bold text-on-surface">Batch Performance Breakdown</h3>
          <button className="flex items-center gap-2 text-xs font-bold uppercase text-primary hover:opacity-70 transition-opacity">
            Export Report <span className="material-symbols-outlined text-sm">download</span>
          </button>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-surface-container-low/50">
                {["Batch ID","Instructor","Avg Score","Completion","Engagement","Status"].map(h => (
                  <th key={h} className={`px-8 py-4 text-[10px] font-bold uppercase tracking-widest text-on-surface-variant ${h === "Status" ? "text-right" : h === "Avg Score" || h === "Completion" || h === "Engagement" ? "text-center" : ""}`}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-outline-variant/10">
              {[
                { id: "#UX-2024-SPRING", name: "Product Design Masterclass", instr: "You", avg: "88%", comp: 92, eng: "9.2", status: "On Track", statusColor: "green" },
                { id: "#FE-REACT-NIGHT", name: "Advanced Frontend Systems", instr: "You", avg: "74%", comp: 65, eng: "6.8", status: "Needs Review", statusColor: "tertiary" },
                { id: "#DS-ML-BOOTCAMP", name: "Data Science & ML", instr: "Asst. Prof. Wei", avg: "81%", comp: 88, eng: "8.4", status: "On Track", statusColor: "green" },
              ].map((row) => (
                <tr key={row.id} className="hover:bg-surface-container-low transition-colors">
                  <td className="px-8 py-6"><span className="text-sm font-bold text-on-surface block">{row.id}</span><span className="text-[10px] text-secondary">{row.name}</span></td>
                  <td className="px-8 py-6 text-sm text-on-surface">{row.instr}</td>
                  <td className="px-8 py-6 text-center"><span className="text-sm font-bold text-on-surface">{row.avg}</span></td>
                  <td className="px-8 py-6 text-center"><div className="w-24 h-1.5 bg-surface-container rounded-full mx-auto overflow-hidden"><div className="bg-primary h-full" style={{ width: `${row.comp}%` }}></div></div></td>
                  <td className="px-8 py-6 text-center"><span className="text-sm font-bold text-on-surface">{row.eng}</span></td>
                  <td className="px-8 py-6 text-right">
                    <span className={`px-3 py-1 text-[10px] font-black rounded-full uppercase ${row.statusColor === "green" ? "bg-green-100 text-green-700" : "bg-tertiary-fixed text-on-tertiary-fixed"}`}>{row.status}</span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
