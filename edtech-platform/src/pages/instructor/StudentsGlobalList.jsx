export function StudentsGlobalList() {
  return (
    <div className="pt-20 p-10 space-y-8">
      {/* Header */}
      <div className="flex justify-between items-end">
        <div>
          <h2 className="text-3xl font-extrabold tracking-tight text-on-surface">Global Students</h2>
          <p className="text-secondary text-sm mt-1">Unified view of all enrolled participants across active batches.</p>
        </div>
        <div className="flex gap-3">
          <button className="flex items-center gap-2 px-4 py-2.5 bg-surface-container-lowest text-on-surface-variant font-semibold text-sm rounded-lg shadow-sm border border-outline-variant/15 hover:bg-surface-container-high transition-colors">
            <span className="material-symbols-outlined text-lg">filter_list</span> Filters
          </button>
          <button className="flex items-center gap-2 px-4 py-2.5 bg-surface-container-lowest text-on-surface-variant font-semibold text-sm rounded-lg shadow-sm border border-outline-variant/15 hover:bg-surface-container-high transition-colors">
            <span className="material-symbols-outlined text-lg">file_download</span> Export CSV
          </button>
        </div>
      </div>

      {/* Summary Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-surface-container-lowest p-6 rounded-xl shadow-[0px_4px_20px_rgba(25,28,30,0.04),0px_8px_40px_rgba(25,28,30,0.02)] space-y-2">
          <p className="text-xs font-semibold text-secondary uppercase tracking-wider">Total Students</p>
          <h3 className="text-2xl font-bold text-on-surface">1,284</h3>
          <div className="flex items-center gap-1 text-emerald-600 text-xs font-bold">
            <span className="material-symbols-outlined text-xs">trending_up</span>+12% from last month
          </div>
        </div>
        <div className="bg-surface-container-lowest p-6 rounded-xl shadow-[0px_4px_20px_rgba(25,28,30,0.04),0px_8px_40px_rgba(25,28,30,0.02)] space-y-2">
          <p className="text-xs font-semibold text-secondary uppercase tracking-wider">Avg. Attendance</p>
          <h3 className="text-2xl font-bold text-on-surface">88.4%</h3>
          <div className="w-full bg-surface-container-low h-1.5 rounded-full overflow-hidden">
            <div className="bg-primary h-full" style={{ width: "88.4%" }}></div>
          </div>
        </div>
        <div className="bg-surface-container-lowest p-6 rounded-xl shadow-[0px_4px_20px_rgba(25,28,30,0.04),0px_8px_40px_rgba(25,28,30,0.02)] space-y-2">
          <p className="text-xs font-semibold text-secondary uppercase tracking-wider">Avg. Assignment Score</p>
          <h3 className="text-2xl font-bold text-on-surface">76.2%</h3>
          <div className="w-full bg-surface-container-low h-1.5 rounded-full overflow-hidden">
            <div className="bg-secondary h-full" style={{ width: "76.2%" }}></div>
          </div>
        </div>
        <div className="bg-surface-container-lowest p-6 rounded-xl shadow-[0px_4px_20px_rgba(25,28,30,0.04),0px_8px_40px_rgba(25,28,30,0.02)] space-y-2">
          <p className="text-xs font-semibold text-secondary uppercase tracking-wider">Students At Risk</p>
          <h3 className="text-2xl font-bold text-error">42</h3>
          <p className="text-xs text-on-surface-variant">Immediate attention required</p>
        </div>
      </div>

      {/* Table */}
      <div className="bg-surface-container-low rounded-xl p-1">
        <div className="bg-surface-container-lowest rounded-lg overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead className="bg-surface-container-low/50">
                <tr>
                  <th className="px-6 py-4 text-on-surface-variant uppercase tracking-[0.05rem] text-xs font-bold">Student Name</th>
                  <th className="px-6 py-4 text-on-surface-variant uppercase tracking-[0.05rem] text-xs font-bold">Batch ID</th>
                  <th className="px-6 py-4 text-on-surface-variant uppercase tracking-[0.05rem] text-xs font-bold">Attendance %</th>
                  <th className="px-6 py-4 text-on-surface-variant uppercase tracking-[0.05rem] text-xs font-bold">Assignment %</th>
                  <th className="px-6 py-4 text-on-surface-variant uppercase tracking-[0.05rem] text-xs font-bold">Risk Level</th>
                  <th className="px-6 py-4 text-on-surface-variant uppercase tracking-[0.05rem] text-xs font-bold text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-surface-container">
                {[
                  { initials: "JS", name: "Julianne Smith", email: "jsmith.edu@gmail.com", batch: "DS-2024-Q3", att: 94, attColor: "emerald", assign: 89, assignColor: "blue", risk: "Low", riskColor: "emerald" },
                  { img: "https://lh3.googleusercontent.com/aida-public/AB6AXuAwXFezUm-UNaBIzhJiRkVJDG-52chVryA8dOy311bzwdZ7WV45Np1baRkiNhauBUK2EN_wZNoFmtD7QJrtDsZSvmb6B8t0fPLWbMY4uJEO2LUiW-lha70Q1iGbiMe1jFOgr4IA6UbrDHPXQLZ_1ZDCNFggLRNBiN0ng0F1P6qGCxbDRyMXVlEzXusuxemAaOvPAb_Q0Zaj1vUDbzDJNiGdu6U92-mKNRv92u4_5I__DCx8u826fIqdzGRbzxzX3yH-JkAe0dUpk1U", name: "Marcus Kinsley", email: "m.kinsley@university.edu", batch: "UXD-ALPHA-01", att: 62, attColor: "red", assign: 55, assignColor: "amber", risk: "High", riskColor: "red" },
                  { initials: "RL", name: "Rohan Lee", email: "r.lee.dev@outlook.com", batch: "WEB-303-PRO", att: 78, attColor: "amber", assign: 82, assignColor: "blue", risk: "Medium", riskColor: "amber" },
                  { img: "https://lh3.googleusercontent.com/aida-public/AB6AXuDuOic8VYgxoZNcyQcIYmP9htUdOvhiAC5VV9T-dEfTkdbWIk-w-d2l0C-qM5EFitIRavnOovxZiiQ26JMNfHSrK71L7w64o_nSEKk6BU3ZeNRI8oar4g0T6yAXu6DEAjZGv2zROHUFyCX0IUFGUJ14BQcZqKLJrCxOBbh47XecwkrER0PIxrlMnVUvEvYnkz0Ru2cwDSyEsJTxKXIzdIYzgjrYAVlQ6fnVYOeax8zxmVRiRVQ1oIrKBfbgBzjMHPU6qQHogt11PRg", name: "Aria White", email: "aria.w@institution.edu", batch: "DS-2024-Q3", att: 91, attColor: "emerald", assign: 96, assignColor: "blue", risk: "Low", riskColor: "emerald" },
                ].map((s, i) => (
                  <tr key={i} className="hover:bg-surface-container-low transition-colors group">
                    <td className="px-6 py-5">
                      <div className="flex items-center gap-3">
                        {s.img ? (
                          <img alt={s.name} className="w-10 h-10 rounded-full" src={s.img} />
                        ) : (
                          <div className="w-10 h-10 rounded-full bg-primary-fixed flex items-center justify-center text-on-primary-fixed font-bold text-sm">{s.initials}</div>
                        )}
                        <div>
                          <p className="text-sm font-semibold text-on-surface">{s.name}</p>
                          <p className="text-[11px] text-secondary">{s.email}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-5"><span className="text-sm font-medium text-on-surface-variant">{s.batch}</span></td>
                    <td className="px-6 py-5">
                      <div className="flex items-center gap-2">
                        <span className={`text-sm font-semibold ${s.attColor === "red" ? "text-error" : ""}`}>{s.att}%</span>
                        <div className="flex-1 max-w-[40px] bg-surface-container h-1 rounded-full">
                          <div className={`bg-${s.attColor}-500 h-full`} style={{ width: `${s.att}%` }}></div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-5">
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-semibold">{s.assign}%</span>
                        <div className="flex-1 max-w-[40px] bg-surface-container h-1 rounded-full">
                          <div className={`bg-${s.assignColor}-500 h-full`} style={{ width: `${s.assign}%` }}></div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-5">
                      <span className={`px-3 py-1 bg-${s.riskColor}-100 text-${s.riskColor}-800 text-[10px] font-bold uppercase rounded-full`}>{s.risk}</span>
                    </td>
                    <td className="px-6 py-5 text-right">
                      <button className="text-outline hover:text-primary transition-colors">
                        <span className="material-symbols-outlined">more_vert</span>
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          {/* Pagination */}
          <div className="px-6 py-4 bg-surface-container-low/30 border-t border-outline-variant/10 flex justify-between items-center">
            <p className="text-xs text-on-surface-variant font-medium">Showing 1 to 4 of 1,284 entries</p>
            <div className="flex gap-2">
              <button className="px-3 py-1.5 bg-surface-container-lowest border border-outline-variant/20 rounded text-xs font-bold opacity-50" disabled>Previous</button>
              <button className="px-3 py-1.5 bg-primary text-white rounded text-xs font-bold">1</button>
              <button className="px-3 py-1.5 bg-surface-container-lowest border border-outline-variant/20 rounded text-xs font-bold hover:bg-surface-container-high transition-colors">2</button>
              <button className="px-3 py-1.5 bg-surface-container-lowest border border-outline-variant/20 rounded text-xs font-bold hover:bg-surface-container-high transition-colors">3</button>
              <span className="px-2 self-center text-outline">...</span>
              <button className="px-3 py-1.5 bg-surface-container-lowest border border-outline-variant/20 rounded text-xs font-bold hover:bg-surface-container-high transition-colors">Next</button>
            </div>
          </div>
        </div>
      </div>

      {/* Bento Insights */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="md:col-span-2 bg-surface-container-lowest p-8 rounded-xl shadow-[0px_4px_20px_rgba(25,28,30,0.04),0px_8px_40px_rgba(25,28,30,0.02)] relative overflow-hidden">
          <div className="relative z-10 space-y-4">
            <h4 className="text-lg font-bold text-on-surface">Instructor Insight: Engagement Dip</h4>
            <p className="text-on-secondary-container text-sm leading-relaxed max-w-lg">
              We've detected a significant 15% drop in assignment submissions for the <span className="font-bold">DS-2024-Q3</span> batch over the last 72 hours. This often correlates with module difficulty spikes. Consider scheduling a "Clear Doubts" session.
            </p>
            <button className="px-5 py-2.5 bg-primary-container text-on-primary-container text-xs font-bold rounded-lg hover:opacity-90 transition-opacity">Schedule session</button>
          </div>
          <div className="absolute right-[-20px] top-[-20px] opacity-10 pointer-events-none">
            <span className="material-symbols-outlined text-[160px]">auto_awesome</span>
          </div>
        </div>
        <div className="bg-primary p-8 rounded-xl shadow-lg text-white flex flex-col justify-between">
          <div>
            <span className="material-symbols-outlined text-3xl mb-4">rocket_launch</span>
            <h4 className="text-lg font-bold">Performance Leaders</h4>
            <p className="text-primary-fixed/80 text-xs mt-1">Students exceeding all KPIs this week.</p>
          </div>
          <div className="mt-6 space-y-3">
            {[{ name: "Aria White", score: "98.2%" }, { name: "Julianne Smith", score: "94.5%" }, { name: "David Chen", score: "93.9%" }].map((l) => (
              <div key={l.name} className="flex items-center justify-between">
                <span className="text-sm font-medium">{l.name}</span>
                <span className="text-xs font-bold bg-white/10 px-2 py-0.5 rounded">{l.score}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
