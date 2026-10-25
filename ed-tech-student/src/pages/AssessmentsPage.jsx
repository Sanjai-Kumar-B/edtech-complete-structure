import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

export function AssessmentsPage() {
  const navigate = useNavigate();
  const [filter, setFilter] = useState('active');

  const getTabClass = (tabName) => {
    return filter === tabName 
      ? 'px-6 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all bg-white shadow-sm text-violet-600'
      : 'px-6 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all text-slate-500 hover:text-violet-600';
  };

  return (
    <div className="space-y-12">
      
      {/* HEADER */}
      <header className="flex flex-col md:flex-row md:items-center justify-between gap-8 mb-12">
        <div>
          <h2 className="text-4xl font-black text-slate-800 tracking-tight leading-none">Assessment Hub</h2>
          <p className="text-slate-500 font-medium mt-3">Validate your mastery and unlock advanced curriculum nodes.</p>
        </div>
        <div className="flex items-center gap-4 bg-white p-2 rounded-[2rem] shadow-xl shadow-slate-200/40 border border-slate-100">
          <div className="flex bg-slate-50 rounded-2xl p-1 gap-1">
            <button onClick={() => setFilter('active')} className={getTabClass('active')}>Pending</button>
            <button onClick={() => setFilter('completed')} className={getTabClass('completed')}>Resolved</button>
          </div>
        </div>
      </header>

      <div className="grid grid-cols-12 gap-10">
        {/* LEFT: ASSESSMENT LIST */}
        <div className="col-span-12 lg:col-span-8 space-y-6">
          
          {filter === 'active' && (
            <>
              {/* Active Assessment 1 */}
              <div className="bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-xl shadow-slate-200/40 hover:shadow-violet-200/40 transition-all group flex flex-col md:flex-row md:items-center justify-between gap-8 animate-[fade-in_0.5s_ease-out]">
                <div className="flex items-center gap-6">
                  <div className="w-16 h-16 rounded-[1.5rem] bg-slate-900 text-white flex items-center justify-center shadow-xl group-hover:rotate-6 transition-transform">
                    <span className="material-symbols-outlined text-2xl">quiz</span>
                  </div>
                  <div>
                    <p className="text-[9px] font-black text-violet-500 uppercase tracking-widest mb-1">CS-402</p>
                    <h3 className="text-xl font-black text-slate-800 leading-tight group-hover:text-violet-600 transition-colors">Midterm Evaluation</h3>
                    <div className="flex items-center gap-3 mt-2">
                      <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">BATCH-24A</span>
                      <span className="w-1 h-1 rounded-full bg-slate-200"></span>
                      <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Due Oct 24, 2023</span>
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-6 shrink-0">
                  <div className="text-right hidden md:block">
                    <p className="text-xs font-black text-slate-800">45m</p>
                    <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest">Duration</p>
                  </div>
                  <button onClick={() => navigate('/assessments/midterm')} className="px-8 py-4 bg-slate-900 text-white rounded-2xl text-[10px] font-black uppercase tracking-widest shadow-xl shadow-slate-900/10 hover:scale-105 active:scale-95 transition-all">Initialize Quest</button>
                </div>
              </div>

              {/* Active Assessment 2 */}
              <div className="bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-xl shadow-slate-200/40 hover:shadow-violet-200/40 transition-all group flex flex-col md:flex-row md:items-center justify-between gap-8 animate-[fade-in_0.6s_ease-out]">
                <div className="flex items-center gap-6">
                  <div className="w-16 h-16 rounded-[1.5rem] bg-slate-900 text-white flex items-center justify-center shadow-xl group-hover:rotate-6 transition-transform">
                    <span className="material-symbols-outlined text-2xl">quiz</span>
                  </div>
                  <div>
                    <p className="text-[9px] font-black text-violet-500 uppercase tracking-widest mb-1">DS-201</p>
                    <h3 className="text-xl font-black text-slate-800 leading-tight group-hover:text-violet-600 transition-colors">Data Structures Lab</h3>
                    <div className="flex items-center gap-3 mt-2">
                      <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">BATCH-24A</span>
                      <span className="w-1 h-1 rounded-full bg-slate-200"></span>
                      <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Due Nov 02, 2023</span>
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-6 shrink-0">
                  <div className="text-right hidden md:block">
                    <p className="text-xs font-black text-slate-800">90m</p>
                    <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest">Duration</p>
                  </div>
                  <button onClick={() => navigate('/assessments/midterm')} className="px-8 py-4 bg-slate-900 text-white rounded-2xl text-[10px] font-black uppercase tracking-widest shadow-xl shadow-slate-900/10 hover:scale-105 active:scale-95 transition-all">Initialize Quest</button>
                </div>
              </div>
            </>
          )}

          {filter === 'completed' && (
            <>
              {/* Completed Assessment 1 */}
              <div className="bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-xl shadow-slate-200/40 hover:shadow-violet-200/40 transition-all group flex flex-col md:flex-row md:items-center justify-between gap-8 animate-[fade-in_0.5s_ease-out]">
                <div className="flex items-center gap-6">
                  <div className="w-16 h-16 rounded-[1.5rem] bg-slate-900 text-white flex items-center justify-center shadow-xl group-hover:rotate-6 transition-transform">
                    <span className="material-symbols-outlined text-2xl">verified</span>
                  </div>
                  <div>
                    <p className="text-[9px] font-black text-violet-500 uppercase tracking-widest mb-1">CS-101</p>
                    <h3 className="text-xl font-black text-slate-800 leading-tight group-hover:text-violet-600 transition-colors">Introductory Module Exam</h3>
                    <div className="flex items-center gap-3 mt-2">
                      <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">BATCH-24A</span>
                      <span className="w-1 h-1 rounded-full bg-slate-200"></span>
                      <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Resolved</span>
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-6 shrink-0">
                  <div className="text-right">
                    <p className="text-2xl font-black text-slate-800">94%</p>
                    <p className="text-[10px] font-bold text-emerald-500 uppercase tracking-widest">Success Rate</p>
                  </div>
                  <button className="w-12 h-12 rounded-2xl bg-slate-50 text-slate-400 flex items-center justify-center hover:bg-slate-900 hover:text-white transition-all">
                    <span className="material-symbols-outlined text-xl">visibility</span>
                  </button>
                </div>
              </div>
            </>
          )}

        </div>

        {/* RIGHT: PERFORMANCE INSIGHTS */}
        <div className="col-span-12 lg:col-span-4 space-y-8">
          <section className="bg-slate-900 rounded-[3rem] p-10 text-white shadow-2xl shadow-slate-900/40 relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-br from-violet-600/20 to-transparent"></div>
            <h3 className="text-xl font-black mb-6 relative z-10">Institutional Standing</h3>
            <div className="space-y-8 relative z-10">
              <div>
                <div className="flex justify-between text-[10px] font-black uppercase tracking-widest text-slate-400 mb-2">
                  <span>Technical Aptitude</span><span>84%</span>
                </div>
                <div className="w-full h-1.5 bg-white/10 rounded-full overflow-hidden">
                  <div className="h-full bg-indigo-500" style={{ width: '84%' }}></div>
                </div>
              </div>
              <div>
                <div className="flex justify-between text-[10px] font-black uppercase tracking-widest text-slate-400 mb-2">
                  <span>Conceptual Precision</span><span>92%</span>
                </div>
                <div className="w-full h-1.5 bg-white/10 rounded-full overflow-hidden">
                  <div className="h-full bg-emerald-500" style={{ width: '92%' }}></div>
                </div>
              </div>
              <div>
                <div className="flex justify-between text-[10px] font-black uppercase tracking-widest text-slate-400 mb-2">
                  <span>Deployment Readiness</span><span>78%</span>
                </div>
                <div className="w-full h-1.5 bg-white/10 rounded-full overflow-hidden">
                  <div className="h-full bg-amber-500" style={{ width: '78%' }}></div>
                </div>
              </div>
            </div>
            <button className="w-full py-4 mt-10 bg-white/10 hover:bg-white/20 rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all relative z-10">
              Download Audit Report
            </button>
          </section>

          <section className="bg-white rounded-[3rem] p-10 border border-slate-100 shadow-xl shadow-slate-200/40">
            <div className="flex items-center gap-4 mb-8">
              <div className="w-12 h-12 bg-indigo-50 rounded-2xl text-indigo-500 flex items-center justify-center">
                <span className="material-symbols-outlined">psychology</span>
              </div>
              <h3 className="text-lg font-black text-slate-800 leading-tight">Scholar's Path</h3>
            </div>
            <p className="text-sm text-slate-500 font-medium leading-relaxed mb-8">
              Based on your last 3 evaluations, we suggest focusing on "System Scalability" and "Concurrency Patterns".
            </p>
            <div className="space-y-4">
              <div className="p-4 bg-slate-50 rounded-2xl flex items-center gap-4 group hover:bg-violet-50 transition-colors cursor-pointer">
                <span className="material-symbols-outlined text-slate-400 group-hover:text-violet-500">menu_book</span>
                <span className="text-xs font-bold text-slate-600 group-hover:text-violet-800">Review Distributed Systems</span>
              </div>
              <div className="p-4 bg-slate-50 rounded-2xl flex items-center gap-4 group hover:bg-violet-50 transition-colors cursor-pointer">
                <span className="material-symbols-outlined text-slate-400 group-hover:text-violet-500">smart_display</span>
                <span className="text-xs font-bold text-slate-600 group-hover:text-violet-800">Watch Concurrency Workshop</span>
              </div>
            </div>
          </section>
        </div>
      </div>

    </div>
  );
}
