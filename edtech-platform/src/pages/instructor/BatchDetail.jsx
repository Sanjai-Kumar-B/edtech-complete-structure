export function BatchDetail() {
  return (
    <div className="pt-24 pb-12 px-8 max-w-7xl mx-auto space-y-8">
      {/* Batch Header Section */}
      <div className="mb-10 flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div className="space-y-2">
          <div className="flex items-center gap-3">
            <span className="px-2 py-0.5 bg-primary-fixed text-on-primary-fixed-variant text-[10px] font-bold uppercase tracking-wider rounded">Course Detail</span>
            <span className="text-secondary label-sm text-xs font-medium">Batch ID: SC-7721</span>
          </div>
          <h1 className="text-3xl font-extrabold tracking-tight text-on-surface">Advanced Structural Dynamics</h1>
          <div className="flex items-center gap-4 text-secondary font-medium">
            <div className="flex items-center gap-1.5">
              <span className="material-symbols-outlined text-lg">category</span>
              <span className="text-sm">Q3 Fall</span>
            </div>
            <div className="w-1 h-1 bg-outline-variant rounded-full"></div>
            <div className="flex items-center gap-1.5">
              <span className="material-symbols-outlined text-lg">schedule</span>
              <span className="text-sm">Mon, Wed • 02:00 PM - 04:00 PM</span>
            </div>
          </div>
        </div>

        {/* Instructor Notes (Glass Card) */}
        <div className="bg-surface-container-low p-5 rounded-xl min-w-[320px] max-w-[400px]">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2 text-on-surface-variant font-bold text-xs uppercase tracking-tight">
              <span className="material-symbols-outlined text-sm">sticky_note_2</span>
              Instructor Notes
            </div>
            <button className="text-primary text-[11px] font-bold hover:underline">EDIT</button>
          </div>
          <p className="text-sm text-secondary italic leading-relaxed">
            "Focus on modal analysis this week. Three students require remedial support on Fourier transforms."
          </p>
        </div>
      </div>

      {/* Tab System */}
      <div className="flex items-center gap-8 mb-6 border-b border-outline-variant/15">
        <button className="pb-4 text-indigo-700 font-semibold border-b-2 border-indigo-700 transition-all flex items-center gap-2">
          <span className="material-symbols-outlined text-[20px]">group</span>
          Students
        </button>
        <button className="pb-4 text-slate-500 font-medium hover:text-slate-800 transition-all flex items-center gap-2">
          <span className="material-symbols-outlined text-[20px]">done_all</span>
          Attendance
        </button>
        <button className="pb-4 text-slate-500 font-medium hover:text-slate-800 transition-all flex items-center gap-2">
          <span className="material-symbols-outlined text-[20px]">assignment</span>
          Assignments
        </button>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <div className="bg-surface-container-lowest p-6 rounded-xl shadow-[0px_4px_20px_rgba(25,28,30,0.04),0px_8px_40px_rgba(25,28,30,0.02)]">
          <div className="text-secondary label-sm text-[11px] font-bold uppercase tracking-widest mb-1">Total Enrollment</div>
          <div className="text-2xl font-extrabold text-on-surface">42</div>
          <div className="text-[11px] text-green-600 font-medium flex items-center gap-1 mt-2">
            <span className="material-symbols-outlined text-xs">trending_up</span>
            +2 from last week
          </div>
        </div>
        <div className="bg-surface-container-lowest p-6 rounded-xl shadow-[0px_4px_20px_rgba(25,28,30,0.04),0px_8px_40px_rgba(25,28,30,0.02)]">
          <div className="text-secondary label-sm text-[11px] font-bold uppercase tracking-widest mb-1">Avg Attendance</div>
          <div className="text-2xl font-extrabold text-on-surface">94.2%</div>
          <div className="text-[11px] text-on-surface-variant font-medium mt-2">Historical Batch High</div>
        </div>
        <div className="bg-surface-container-lowest p-6 rounded-xl shadow-[0px_4px_20px_rgba(25,28,30,0.04),0px_8px_40px_rgba(25,28,30,0.02)]">
          <div className="text-secondary label-sm text-[11px] font-bold uppercase tracking-widest mb-1">Avg Completion</div>
          <div className="text-2xl font-extrabold text-on-surface">88%</div>
          <div className="h-1.5 w-full bg-surface-container rounded-full mt-3">
            <div className="h-full bg-primary rounded-full" style={{ width: "88%" }}></div>
          </div>
        </div>
        <div className="bg-surface-container-lowest p-6 rounded-xl shadow-[0px_4px_20px_rgba(25,28,30,0.04),0px_8px_40px_rgba(25,28,30,0.02)]">
          <div className="text-secondary label-sm text-[11px] font-bold uppercase tracking-widest mb-1">Performance Index</div>
          <div className="text-2xl font-extrabold text-on-surface">A-</div>
          <div className="text-[11px] text-tertiary-container font-medium mt-2">Strong Class Engagement</div>
        </div>
      </div>

      {/* Data Table Section */}
      <div className="bg-surface-container-lowest rounded-xl shadow-[0px_4px_20px_rgba(25,28,30,0.04),0px_8px_40px_rgba(25,28,30,0.02)] overflow-hidden border border-outline-variant/10">
        <div className="px-8 py-5 flex items-center justify-between border-b border-outline-variant/5">
          <h3 className="font-headline font-bold text-lg text-on-surface">Student Roster</h3>
          <div className="flex items-center gap-3">
            <button className="p-2 hover:bg-slate-50 rounded-lg text-slate-400"><span className="material-symbols-outlined">filter_list</span></button>
            <button className="p-2 hover:bg-slate-50 rounded-lg text-slate-400"><span className="material-symbols-outlined">file_download</span></button>
          </div>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-surface-container-low/50">
                <th className="px-8 py-4 text-on-surface-variant text-[11px] font-bold uppercase tracking-widest">Student Name</th>
                <th className="px-8 py-4 text-on-surface-variant text-[11px] font-bold uppercase tracking-widest">Attendance %</th>
                <th className="px-8 py-4 text-on-surface-variant text-[11px] font-bold uppercase tracking-widest">Assignment Comp.</th>
                <th className="px-8 py-4 text-on-surface-variant text-[11px] font-bold uppercase tracking-widest">Performance</th>
                <th className="px-8 py-4 text-on-surface-variant text-[11px] font-bold uppercase tracking-widest">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-outline-variant/10">
              <tr className="hover:bg-surface-container-low transition-colors group">
                <td className="px-8 py-4">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-primary-fixed flex items-center justify-center text-on-primary-fixed-variant text-xs font-bold">AJ</div>
                    <div>
                      <div className="text-sm font-semibold text-on-surface">Arjun Jayaram</div>
                      <div className="text-[11px] text-secondary">arjun.j@university.edu</div>
                    </div>
                  </div>
                </td>
                <td className="px-8 py-4">
                  <div className="text-sm font-medium text-on-surface">98%</div>
                  <div className="text-[10px] text-green-600 font-bold uppercase tracking-tighter">Perfect Track</div>
                </td>
                <td className="px-8 py-4">
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-medium text-on-surface">100%</span>
                    <span className="material-symbols-outlined text-green-500 text-sm">check_circle</span>
                  </div>
                </td>
                <td className="px-8 py-4">
                  <span className="px-3 py-1 bg-green-100 text-green-800 text-[10px] font-bold rounded-full uppercase tracking-wider">High</span>
                </td>
                <td className="px-8 py-4">
                  <button className="text-primary hover:text-primary-container font-bold text-xs">VIEW PROFILE</button>
                </td>
              </tr>
              <tr className="hover:bg-surface-container-low transition-colors group">
                <td className="px-8 py-4">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-secondary-fixed flex items-center justify-center text-on-secondary-fixed-variant text-xs font-bold">SM</div>
                    <div>
                      <div className="text-sm font-semibold text-on-surface">Sarah Mitchell</div>
                      <div className="text-[11px] text-secondary">s.mitchell@university.edu</div>
                    </div>
                  </div>
                </td>
                <td className="px-8 py-4">
                  <div className="text-sm font-medium text-on-surface">82%</div>
                  <div className="text-[10px] text-secondary font-bold uppercase tracking-tighter">Stable</div>
                </td>
                <td className="px-8 py-4">
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-medium text-on-surface">75%</span>
                    <span className="text-[10px] text-secondary font-medium">9/12 Done</span>
                  </div>
                </td>
                <td className="px-8 py-4">
                  <span className="px-3 py-1 bg-blue-100 text-blue-800 text-[10px] font-bold rounded-full uppercase tracking-wider">Medium</span>
                </td>
                <td className="px-8 py-4">
                  <button className="text-primary hover:text-primary-container font-bold text-xs">VIEW PROFILE</button>
                </td>
              </tr>
              <tr className="hover:bg-surface-container-low transition-colors group">
                <td className="px-8 py-4">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-tertiary-fixed flex items-center justify-center text-on-tertiary-fixed-variant text-xs font-bold">BT</div>
                    <div>
                      <div className="text-sm font-semibold text-on-surface">Benjamin Thorne</div>
                      <div className="text-[11px] text-secondary">b.thorne@university.edu</div>
                    </div>
                  </div>
                </td>
                <td className="px-8 py-4">
                  <div className="text-sm font-medium text-on-surface">64%</div>
                  <div className="text-[10px] text-error font-bold uppercase tracking-tighter">Critical</div>
                </td>
                <td className="px-8 py-4">
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-medium text-on-surface">42%</span>
                    <span className="text-[10px] text-error font-bold">Delayed</span>
                  </div>
                </td>
                <td className="px-8 py-4">
                  <span className="px-3 py-1 bg-red-100 text-red-800 text-[10px] font-bold rounded-full uppercase tracking-wider">Low</span>
                </td>
                <td className="px-8 py-4">
                  <button className="text-primary hover:text-primary-container font-bold text-xs">VIEW PROFILE</button>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
        <div className="p-4 bg-surface-container-low/30 text-center">
          <button className="text-sm font-bold text-secondary hover:text-on-surface py-2 px-6 transition-all">Load More Students (38 remaining)</button>
        </div>
      </div>

      {/* Contextual Insights Section */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <div className="md:col-span-2 space-y-6">
          <h3 className="font-headline font-bold text-xl text-on-surface">Performance Trend</h3>
          <div className="bg-surface-container-lowest p-8 rounded-xl h-64 shadow-[0px_4px_20px_rgba(25,28,30,0.04),0px_8px_40px_rgba(25,28,30,0.02)] flex flex-col justify-end relative">
            {/* Simulated Chart Elements */}
            <div className="absolute inset-x-8 top-12 bottom-12 flex items-end gap-4">
              <div className="flex-1 bg-primary-fixed-dim/20 rounded-t h-[60%] relative group">
                <div className="absolute -top-8 left-1/2 -translate-x-1/2 bg-on-surface text-white text-[10px] px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity">72%</div>
              </div>
              <div className="flex-1 bg-primary-fixed-dim/40 rounded-t h-[75%] relative group">
                <div className="absolute -top-8 left-1/2 -translate-x-1/2 bg-on-surface text-white text-[10px] px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity">78%</div>
              </div>
              <div className="flex-1 bg-primary-fixed-dim/60 rounded-t h-[65%] relative group">
                <div className="absolute -top-8 left-1/2 -translate-x-1/2 bg-on-surface text-white text-[10px] px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity">74%</div>
              </div>
              <div className="flex-1 bg-primary rounded-t h-[88%] relative group">
                <div className="absolute -top-8 left-1/2 -translate-x-1/2 bg-primary text-white text-[10px] px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity">88%</div>
              </div>
              <div className="flex-1 bg-primary-fixed-dim/30 rounded-t h-[70%] relative group">
                <div className="absolute -top-8 left-1/2 -translate-x-1/2 bg-on-surface text-white text-[10px] px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity">76%</div>
              </div>
            </div>
            <div className="flex justify-between border-t border-outline-variant/10 pt-4">
              <span className="text-[10px] font-bold text-secondary tracking-widest uppercase">Week 12</span>
              <span className="text-[10px] font-bold text-secondary tracking-widest uppercase">Week 13</span>
              <span className="text-[10px] font-bold text-secondary tracking-widest uppercase">Week 14</span>
              <span className="text-[10px] font-bold text-primary tracking-widest uppercase">Week 15 (Current)</span>
              <span className="text-[10px] font-bold text-secondary tracking-widest uppercase">Week 16</span>
            </div>
          </div>
        </div>

        <div className="space-y-6">
          <h3 className="font-headline font-bold text-xl text-on-surface">Upcoming Deadlines</h3>
          <div className="space-y-4">
            <div className="bg-surface-container-lowest p-4 rounded-xl shadow-[0px_4px_20px_rgba(25,28,30,0.04),0px_8px_40px_rgba(25,28,30,0.02)] flex items-start gap-4">
              <div className="w-10 h-10 rounded-lg bg-tertiary-fixed flex flex-col items-center justify-center">
                <span className="text-[10px] font-bold text-on-tertiary-fixed-variant leading-none">NOV</span>
                <span className="text-sm font-extrabold text-on-tertiary-fixed-variant leading-none">18</span>
              </div>
              <div>
                <div className="text-sm font-bold text-on-surface">Seismic Load Lab Report</div>
                <div className="text-xs text-secondary">32 submissions pending</div>
              </div>
            </div>
            <div className="bg-surface-container-lowest p-4 rounded-xl shadow-[0px_4px_20px_rgba(25,28,30,0.04),0px_8px_40px_rgba(25,28,30,0.02)] flex items-start gap-4">
              <div className="w-10 h-10 rounded-lg bg-secondary-fixed flex flex-col items-center justify-center">
                <span className="text-[10px] font-bold text-on-secondary-fixed-variant leading-none">NOV</span>
                <span className="text-sm font-extrabold text-on-secondary-fixed-variant leading-none">22</span>
              </div>
              <div>
                <div className="text-sm font-bold text-on-surface">Final Project Abstract</div>
                <div className="text-xs text-secondary">Drafting stage</div>
              </div>
            </div>
            <button className="w-full py-4 border border-dashed border-outline-variant rounded-xl text-secondary text-sm font-bold hover:bg-surface-container-lowest hover:border-primary/50 transition-all">
              + Add New Assignment
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
