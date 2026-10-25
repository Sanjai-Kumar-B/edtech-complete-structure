import { useEffect, useState } from 'react';
import { supabase } from '@junospace/supabase-client';
import { Link } from 'react-router-dom';

export function AdminDashboard() {
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState({
    totalStudents: 0,
    totalInstructors: 0,
    totalStaff: 0,
    activeCourses: 0,
    activeBatches: 0,
    recentActivity: [],
    completionRate: 0,
    enrollmentByMonth: Array(12).fill(0),
    alerts: []
  });

  useEffect(() => {
    async function loadDash() {
      // Basic counts
      const [
        { count: students },
        { count: instructors },
        { count: staff },
        { count: courses },
        { count: batches }
      ] = await Promise.all([
        supabase.from('users').select('id', { count: 'exact' }).eq('role', 'student').eq('is_active', true),
        supabase.from('users').select('id', { count: 'exact' }).eq('role', 'instructor').eq('is_active', true),
        supabase.from('users').select('id', { count: 'exact' }).eq('role', 'staff').eq('is_active', true),
        supabase.from('courses').select('id', { count: 'exact' }).eq('status', 'active'),
        supabase.from('batches').select('id', { count: 'exact' }).eq('status', 'active')
      ]);

      // Recent Activity Fetching
      const [
        { data: recentAtt },
        { data: recentSubs },
        { data: newUsers }
      ] = await Promise.all([
        supabase.from('attendance').select('id, marked_at, status, users(full_name), sessions(title)').order('marked_at', { ascending: false }).limit(5),
        supabase.from('assignment_submissions').select('id, reviewed_at, status, users(full_name), assignments(title)').eq('status', 'reviewed').order('reviewed_at', { ascending: false }).limit(5),
        supabase.from('users').select('id, created_at, full_name, role').order('created_at', { ascending: false }).limit(5)
      ]);

      const activity = [
        ...(recentAtt || []).map(a => ({ id: `att-${a.id}`, type: 'ATTENDANCE', text: `Attendance marked for ${a.users?.full_name}`, sub: a.sessions?.title, date: a.marked_at, icon: 'check_circle', color: 'text-emerald-500' })),
        ...(recentSubs || []).map(s => ({ id: `sub-${s.id}`, type: 'REVIEW', text: `Assignment reviewed for ${s.users?.full_name}`, sub: s.assignments?.title, date: s.reviewed_at, icon: 'fact_check', color: 'text-indigo-500' })),
        ...(newUsers || []).map(u => ({ id: `user-${u.id}`, type: 'USER', text: `New ${u.role} onboarded: ${u.full_name}`, sub: 'Security clearance active', date: u.created_at, icon: 'person_add', color: 'text-amber-500' }))
      ].sort((a, b) => new Date(b.date) - new Date(a.date)).slice(0, 10);

      // Enrollments Trends
      const { data: enrolls } = await supabase.from('enrollments').select('enrolled_at, status');
      const months = Array(12).fill(0);
      let completed = 0;
      enrolls?.forEach(e => {
        if (e.status === 'completed') completed++;
        if (e.enrolled_at) {
          const m = new Date(e.enrolled_at).getMonth();
          months[m]++;
        }
      });
      const compRate = enrolls?.length ? Math.round((completed / enrolls.length) * 100) : 0;

      setData({
        totalStudents: students || 0,
        totalInstructors: instructors || 0,
        totalStaff: staff || 0,
        activeCourses: courses || 0,
        activeBatches: batches || 0,
        recentActivity: activity,
        completionRate: compRate,
        enrollmentByMonth: months,
        alerts: [] // Optional: fetch alerts logic if needed
      });
      setLoading(false);
    }
    loadDash();
  }, []);

  if (loading) return <div className="p-8 pt-24 text-center">Synchronizing Platform Intel...</div>;

  const currentMonth = new Date().getMonth();
  const maxEnrolls = Math.max(...data.enrollmentByMonth, 1);

  return (
    <div className="p-8 pt-24 space-y-10 max-w-[1600px] mx-auto animate-in fade-in duration-500">
      <header className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h1 className="text-4xl font-black text-slate-800 tracking-tight leading-none">Global Control</h1>
          <p className="text-secondary font-medium mt-3">High-level institutional surveillance and operations.</p>
        </div>
        <div className="flex bg-white rounded-2xl border border-slate-200 p-1 shadow-sm">
          <button className="px-6 py-2 bg-slate-100 text-slate-800 rounded-xl text-xs font-black uppercase tracking-widest">Live View</button>
          <button className="px-6 py-2 text-slate-400 rounded-xl text-xs font-black uppercase tracking-widest hover:text-slate-600 transition-colors">History</button>
        </div>
      </header>

      {/* PRIMARY METRICS */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-6">
        {[
          { label: 'Students', val: data.totalStudents, icon: 'groups', color: 'text-indigo-600', bg: 'bg-indigo-50' },
          { label: 'Instructors', val: data.totalInstructors, icon: 'psychology', color: 'text-emerald-600', bg: 'bg-emerald-50' },
          { label: 'Staff', val: data.totalStaff, icon: 'badge', color: 'text-amber-600', bg: 'bg-amber-50' },
          { label: 'Courses', val: data.activeCourses, icon: 'school', color: 'text-violet-600', bg: 'bg-violet-50' },
          { label: 'Batches', val: data.activeBatches, icon: 'layers', color: 'text-rose-600', bg: 'bg-rose-50' },
        ].map(s => (
          <div key={s.label} className="bg-white p-8 rounded-[2rem] border border-slate-100 shadow-xl shadow-slate-200/50 flex flex-col items-center text-center group hover:scale-[1.02] transition-transform">
            <div className={`w-14 h-14 rounded-2xl ${s.bg} ${s.color} flex items-center justify-center mb-4 shadow-sm group-hover:rotate-6 transition-transform`}>
              <span className="material-symbols-outlined text-[28px]">{s.icon}</span>
            </div>
            <p className="text-[10px] font-black text-secondary uppercase tracking-[0.2em] mb-1">{s.label}</p>
            <p className={`text-4xl font-black text-slate-800`}>{s.val}</p>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">

        {/* LEFT: TRENDS & ANALYTICS */}
        <div className="lg:col-span-8 space-y-8">
          <section className="bg-white rounded-[2.5rem] p-10 border border-slate-100 shadow-xl shadow-slate-200/50 h-[450px] flex flex-col">
            <div className="flex justify-between items-center mb-10">
              <h3 className="text-xl font-black text-slate-800">Enrollment Velocity</h3>
              <span className="text-[10px] font-black text-secondary uppercase tracking-widest">Year-to-Date Perspective</span>
            </div>
            <div className="flex-1 flex items-end justify-between gap-4">
              {data.enrollmentByMonth.map((v, i) => (
                <div key={i} className="flex-1 flex flex-col items-center group relative">
                  <div className="absolute -top-10 bg-slate-800 text-white text-[10px] py-1.5 px-3 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity z-10">{v} Enrolled</div>
                  <div className={`w-full rounded-2xl transition-all duration-500 ${i === currentMonth ? 'bg-indigo-600' : 'bg-slate-100 group-hover:bg-indigo-100'}`} style={{ height: `${Math.max((v / maxEnrolls) * 100, 8)}%` }}></div>
                  <p className={`text-[10px] mt-4 font-black ${i === currentMonth ? 'text-indigo-600' : 'text-slate-400'}`}>
                    {['JAN', 'FEB', 'MAR', 'APR', 'MAY', 'JUN', 'JUL', 'AUG', 'SEP', 'OCT', 'NOV', 'DEC'][i]}
                  </p>
                </div>
              ))}
            </div>
          </section>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <section className="bg-white rounded-[2.5rem] p-8 border border-slate-100 shadow-xl shadow-slate-200/50 flex flex-col items-center justify-center text-center">
              <h3 className="text-lg font-black text-slate-800 mb-6 w-full text-left">Academic Completion</h3>
              <div className="relative w-48 h-48">
                <svg viewBox="0 0 100 100" className="w-full h-full rotate-[-90deg]">
                  <circle cx="50" cy="50" r="42" fill="none" stroke="#f1f5f9" strokeWidth="12" />
                  <circle cx="50" cy="50" r="42" fill="none" stroke="url(#gradient)" strokeWidth="12" strokeDasharray={`${(data.completionRate / 100) * 263.8} 263.8`} strokeLinecap="round" />
                  <defs>
                    <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="0%">
                      <stop offset="0%" stopColor="#4f46e5" />
                      <stop offset="100%" stopColor="#818cf8" />
                    </linearGradient>
                  </defs>
                </svg>
                <div className="absolute inset-0 flex flex-col items-center justify-center">
                  <span className="text-4xl font-black text-slate-800">{data.completionRate}%</span>
                  <span className="text-[10px] font-black text-secondary uppercase tracking-widest mt-1">Success</span>
                </div>
              </div>
              <p className="text-xs text-secondary mt-6 font-medium">Overall certificate issuance velocity</p>
            </section>

            <section className="bg-slate-900 rounded-[2.5rem] p-8 text-white flex flex-col justify-between">
              <div>
                <h3 className="text-lg font-black mb-2">System Integrity</h3>
                <p className="text-sm text-slate-400 font-medium">Platform nodes performing at optimal efficiency.</p>
              </div>
              <div className="space-y-6 mt-8">
                <div className="flex justify-between text-xs"><span className="font-bold text-slate-500 uppercase tracking-widest">Uptime</span><span className="font-black text-emerald-400">99.98%</span></div>
                <div className="flex justify-between text-xs"><span className="font-bold text-slate-500 uppercase tracking-widest">Latency</span><span className="font-black text-emerald-400">42ms</span></div>
                <div className="flex justify-between text-xs"><span className="font-bold text-slate-500 uppercase tracking-widest">Nodes Active</span><span className="font-black text-emerald-400">24/24</span></div>
              </div>
              <button className="mt-8 w-full py-4 bg-white/10 hover:bg-white/20 rounded-2xl text-xs font-black uppercase tracking-widest transition-all">Deep Diagnostics</button>
            </section>
          </div>
        </div>

        {/* RIGHT: RECENT ACTIVITY (LIVE LOG) */}
        <div className="lg:col-span-4 flex flex-col">
          <section className="bg-white rounded-[2.5rem] border border-slate-100 shadow-xl shadow-slate-200/50 flex-1 flex flex-col overflow-hidden">
            <div className="p-8 border-b border-slate-50 bg-slate-50/50">
              <h3 className="text-xl font-black text-slate-800">Operational Log</h3>
              <p className="text-xs text-secondary font-bold uppercase tracking-widest mt-1">Real-time platform activity</p>
            </div>
            <div className="flex-1 overflow-y-auto p-2">
              {data.recentActivity.map(act => (
                <div key={act.id} className="p-5 hover:bg-slate-50/80 rounded-3xl transition-colors flex gap-4 items-start group">
                  <div className={`w-10 h-10 rounded-2xl flex items-center justify-center shrink-0 shadow-sm bg-white ${act.color} group-hover:scale-110 transition-transform`}>
                    <span className="material-symbols-outlined text-[20px]">{act.icon}</span>
                  </div>
                  <div className="flex-1">
                    <div className="flex justify-between items-start">
                      <span className="text-[10px] font-black text-secondary uppercase tracking-widest">{act.type}</span>
                      <span className="text-[9px] font-bold text-slate-400">{new Date(act.date).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                    </div>
                    <p className="text-sm font-black text-slate-800 mt-1">{act.text}</p>
                    <p className="text-[11px] text-secondary font-medium mt-0.5">{act.sub}</p>
                  </div>
                </div>
              ))}
              {data.recentActivity.length === 0 && <p className="p-10 text-center text-secondary font-bold">No recent operations logged.</p>}
            </div>
            <div className="p-6 bg-slate-50/30 border-t border-slate-50">
              <Link to="/admin/analytics" className="w-full py-4 border-2 border-slate-200 rounded-2xl text-xs font-black uppercase tracking-widest text-slate-600 hover:bg-slate-100 transition-all flex items-center justify-center gap-2">
                View Full Audit Trail <span className="material-symbols-outlined text-sm">arrow_forward</span>
              </Link>
            </div>
          </section>
        </div>

      </div>
    </div>
  );
}
