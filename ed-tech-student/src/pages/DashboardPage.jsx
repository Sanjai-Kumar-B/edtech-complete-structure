import React, { useState, useEffect } from 'react';
import { supabase } from '@junospace/supabase-client';
import { useAuth } from '../context/AuthContext';
import { Link } from 'react-router-dom';

function Skeleton({ className = '' }) {
  return <div className={`bg-slate-200 animate-pulse rounded-xl ${className}`} />;
}

// Returns Mon-Sun dates for the current week
function getWeekDates() {
  const now = new Date();
  const day = now.getDay(); // 0=Sun
  const monday = new Date(now);
  monday.setDate(now.getDate() - ((day + 6) % 7));
  monday.setHours(0, 0, 0, 0);
  return Array.from({ length: 7 }, (_, i) => {
    const d = new Date(monday);
    d.setDate(monday.getDate() + i);
    return d;
  });
}

const DAY_LABELS = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];

export function DashboardPage() {
  const { user, profile } = useAuth();

  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({ attendance_pct: 0, course_progress: 0 });
  const [skills, setSkills] = useState({ consistency: 0, technical: 0, conceptual: 0, participation: 0 });
  const [weekSessions, setWeekSessions] = useState({}); // { 'Mon': [session,...], ... }
  const [pendingAssignments, setPendingAssignments] = useState([]);
  const [pendingAssessments, setPendingAssessments] = useState([]);
  const [todayModule, setTodayModule] = useState(null);
  const [prevModule, setPrevModule] = useState(null);
  const [selectedSession, setSelectedSession] = useState(null);

  useEffect(() => {
    if (user?.id) fetchAll(user.id);
  }, [user]);

  async function fetchAll(studentId) {
    setLoading(true);
    try {
      // 1. Get enrolled batches
      const { data: enrollments } = await supabase
        .from('enrollments')
        .select('batch_id, batches(id, batch_code, course_id, courses(title))')
        .eq('student_id', studentId)
        .eq('status', 'active');

      const batchIds = (enrollments || []).map(e => e.batch_id);

      if (batchIds.length === 0) {
        setLoading(false);
        return;
      }

      // 2. Attendance %
      const { data: attData } = await supabase
        .from('attendance')
        .select('status, sessions!inner(batch_id)')
        .eq('student_id', studentId)
        .in('sessions.batch_id', batchIds);

      const attTotal = (attData || []).length;
      const attPresent = (attData || []).filter(a => a.status === 'present').length;
      const attPct = attTotal > 0 ? Math.round((attPresent / attTotal) * 100) : 0;

      // 3. Skills from student_skills view (first batch)
      const primaryBatchId = batchIds[0];
      const { data: skillData } = await supabase
        .from('student_skills')
        .select('consistency, technical, conceptual, participation')
        .eq('student_id', studentId)
        .eq('batch_id', primaryBatchId)
        .maybeSingle();

      // 4. This week's sessions (Mon-Sun)
      const weekDates = getWeekDates();
      const monday = weekDates[0];
      const sunday = weekDates[6];
      const mondayStr = monday.toISOString().split('T')[0];
      const sundayStr = sunday.toISOString().split('T')[0];

      const { data: sessionsRaw } = await supabase
        .from('sessions')
        .select('id, title, session_date, session_time, type, duration_minutes, zoom_link, batch_id')
        .in('batch_id', batchIds)
        .gte('session_date', mondayStr)
        .lte('session_date', sundayStr)
        .order('session_date', { ascending: true })
        .order('session_time', { ascending: true });

      // Map sessions to day labels
      const byDay = {};
      (sessionsRaw || []).forEach(s => {
        const sd = new Date(s.session_date + 'T00:00:00');
        const dayIndex = (sd.getDay() + 6) % 7; // Mon=0
        const label = DAY_LABELS[dayIndex];
        if (!byDay[label]) byDay[label] = [];
        byDay[label].push(s);
      });
      setWeekSessions(byDay);

      // 5. Course progress — count submitted assignments / total published assignments
      const { data: publishedAssign } = await supabase
        .from('assignments')
        .select('id')
        .in('batch_id', batchIds)
        .eq('is_published', true);

      const totalAssign = (publishedAssign || []).length;

      const { data: mySubmissions } = await supabase
        .from('assignment_submissions')
        .select('assignment_id')
        .eq('student_id', studentId)
        .in('assignment_id', (publishedAssign || []).map(a => a.id));

      const submittedCount = (mySubmissions || []).length;
      const progressPct = totalAssign > 0 ? Math.round((submittedCount / totalAssign) * 100) : 0;

      // 6. Pending assignments (published, not yet submitted, not overdue)
      const submittedIds = new Set((mySubmissions || []).map(s => s.assignment_id));
      const { data: allAssign } = await supabase
        .from('assignments')
        .select('id, title, due_date, batches(batch_code)')
        .in('batch_id', batchIds)
        .eq('is_published', true);

      const pending = (allAssign || [])
        .filter(a => !submittedIds.has(a.id))
        .sort((a, b) => new Date(a.due_date) - new Date(b.due_date))
        .slice(0, 3);
      setPendingAssignments(pending);

      // 7. Pending assessments (not yet submitted)
      const { data: myAssessmentSubs } = await supabase
        .from('assessment_submissions')
        .select('assessment_id')
        .eq('student_id', studentId);
      const submittedAssessIds = new Set((myAssessmentSubs || []).map(s => s.assessment_id));

      const { data: allAssessments } = await supabase
        .from('assessments')
        .select('id, title, due_date, batches(batch_code)')
        .in('batch_id', batchIds)
        .eq('is_published', true);

      const pendingAssess = (allAssessments || [])
        .filter(a => !submittedAssessIds.has(a.id))
        .sort((a, b) => new Date(a.due_date) - new Date(b.due_date))
        .slice(0, 3);
      setPendingAssessments(pendingAssess);

      // 8. Today's module and previous module
      const currentWeekNum = Math.ceil(
        (new Date() - new Date(new Date().getFullYear(), 0, 1)) / (7 * 24 * 60 * 60 * 1000)
      );

      const firstEnroll = enrollments[0];
      if (firstEnroll?.batches?.course_id) {
        const { data: modules } = await supabase
          .from('course_modules')
          .select('*')
          .eq('course_id', firstEnroll.batches.course_id)
          .order('week_number', { ascending: true });

        // Find closest module by week_number
        if (modules && modules.length > 0) {
          const sortedMods = [...modules].sort((a, b) => a.week_number - b.week_number);
          let currentMod = sortedMods[sortedMods.length - 1]; // default last
          let prevMod = null;
          for (let i = 0; i < sortedMods.length; i++) {
            if (sortedMods[i].week_number >= currentWeekNum) {
              currentMod = sortedMods[i];
              prevMod = i > 0 ? sortedMods[i - 1] : null;
              break;
            }
          }
          setTodayModule(currentMod);
          setPrevModule(prevMod);
        }
      }

      setStats({ attendance_pct: attPct, course_progress: progressPct });
      setSkills(skillData || { consistency: 0, technical: 0, conceptual: 0, participation: 0 });
    } catch (err) {
      console.error('Dashboard fetch error:', err);
    } finally {
      setLoading(false);
    }
  }

  function formatDue(dateStr) {
    if (!dateStr) return 'No deadline';
    const d = new Date(dateStr);
    const now = new Date();
    const diff = Math.ceil((d - now) / (1000 * 60 * 60 * 24));
    if (diff < 0) return { label: 'Overdue', cls: 'text-red-500 font-bold' };
    if (diff === 0) return { label: 'Due Today', cls: 'text-orange-500 font-bold' };
    if (diff === 1) return { label: 'Due Tomorrow', cls: 'text-amber-500 font-bold' };
    return { label: `Due ${d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}`, cls: 'text-slate-500' };
  }

  const firstName = profile?.full_name?.split(' ')[0] || 'Student';
  const avatarColor = profile?.avatar_color || '#6C35DE';
  const avatarInitials = profile?.avatar_initials || profile?.full_name?.charAt(0) || 'S';

  const skillBars = [
    { label: 'Attendance', value: skills.consistency, color: 'bg-blue-500', shadow: 'shadow-[0_0_10px_rgba(59,130,246,0.5)]' },
    { label: 'Assignments', value: skills.technical, color: 'bg-blue-500', shadow: 'shadow-[0_0_10px_rgba(59,130,246,0.4)]' },
    { label: 'Assessments', value: skills.conceptual, color: 'bg-emerald-500', shadow: 'shadow-[0_0_10px_rgba(16,185,129,0.5)]' },
    { label: 'Participation', value: skills.participation, color: 'bg-orange-500', shadow: 'shadow-[0_0_10px_rgba(249,115,22,0.5)]' },
  ];

  return (
    <>
      {/* Top Section */}
      <section className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Welcome Card */}
        <div id="dashboard-hero" className="lg:col-span-7 bg-white p-10 rounded-[3rem] relative overflow-hidden group shadow-lg flex items-center justify-between border border-violet-100">
          <div className="absolute top-0 right-0 w-64 h-64 bg-violet-50 rounded-full -mr-20 -mt-20 blur-3xl transition-all group-hover:bg-violet-100" />
          <div className="relative z-10 w-full flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div>
              <span className="bg-violet-100 text-violet-600 text-[10px] font-bold px-4 py-1.5 rounded-full tracking-widest uppercase">Welcome back, {firstName}</span>
              <h2 className="text-4xl font-extrabold text-slate-800 mt-5 tracking-tight">Building Skills,<br /><span className="text-violet-500">Shaping Futures.</span></h2>
              <p className="text-slate-500 mt-4 max-w-sm text-sm leading-relaxed">
                {loading
                  ? 'Loading your progress...'
                  : stats.course_progress > 0
                    ? `You've completed ${stats.course_progress}% of your assignments. Keep the momentum!`
                    : 'No assignments submitted yet. Start your first assignment today!'}
              </p>
            </div>
            <div className="flex-shrink-0 relative">
              <div className="w-24 h-24 rounded-full border-4 border-violet-50 shadow-xl shadow-violet-200 flex items-center justify-center text-white text-3xl font-black" style={{ backgroundColor: avatarColor }}>
                {avatarInitials}
              </div>
              <div className="absolute bottom-0 right-0 w-8 h-8 bg-violet-500 rounded-full border-4 border-white flex items-center justify-center">
                <span className="material-symbols-outlined text-white text-sm">star</span>
              </div>
            </div>
          </div>
        </div>

        {/* Quick Stats */}
        <div className="lg:col-span-5 grid grid-cols-2 gap-4">
          <div id="dashboard-progress" className="bg-white p-6 rounded-[2rem] flex flex-col justify-between border-4 border-violet-200 shadow-sm">
            <div className="flex items-center justify-between">
              <span className="material-symbols-outlined text-emerald-500 p-2 bg-emerald-50 rounded-full">trending_up</span>
            </div>
            <div className="mt-4">
              {loading ? <Skeleton className="w-24 h-8 mb-1" /> : <p className="text-3xl font-bold text-slate-800 tracking-tighter">{stats.course_progress}%</p>}
              <p className="text-xs text-slate-500 font-bold uppercase tracking-wider mt-1">Assignment Progress</p>
            </div>
          </div>

          <div id="dashboard-attendance" className={`bg-white p-6 rounded-[2rem] flex flex-col justify-between border-4 ${stats.attendance_pct < 75 ? 'border-red-300' : 'border-emerald-300'} shadow-sm`}>
            <div className="flex items-center justify-between">
              <span className={`material-symbols-outlined p-2 rounded-full ${stats.attendance_pct < 75 ? 'text-red-500 bg-red-50' : 'text-emerald-500 bg-emerald-50'}`}>how_to_reg</span>
              <span className={`text-[10px] font-bold px-2 py-1 rounded-full ${stats.attendance_pct < 75 ? 'text-red-600 bg-red-50' : 'text-emerald-600 bg-emerald-50'}`}>
                {loading ? '...' : stats.attendance_pct < 75 ? 'Needs Attention' : 'On Track'}
              </span>
            </div>
            <div className="mt-4">
              {loading ? <Skeleton className="w-24 h-8 mb-1" /> : <p className="text-3xl font-bold text-slate-800 tracking-tighter">{stats.attendance_pct}%</p>}
              <p className="text-xs text-slate-500 font-bold uppercase tracking-wider mt-1">Attendance</p>
            </div>
          </div>
        </div>
      </section>

      {/* Middle Section */}
      <section className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
        {/* Skill Analytics */}
        <div className="lg:col-span-4 flex flex-col">
          <div className="bg-white p-8 rounded-[2rem] border border-violet-100 shadow-sm flex-1 flex flex-col justify-between">
            <div className="flex items-center justify-between mb-8">
              <h3 className="text-base font-bold text-slate-800 tracking-tight">Skill Analytics</h3>
              <button className="flex items-center justify-center p-2 rounded-full bg-blue-50 text-blue-500 hover:bg-blue-100 transition-colors">
                <span className="material-symbols-outlined text-sm">insights</span>
              </button>
            </div>
            <div id="dashboard-skills" className="space-y-6 my-auto">
              {loading
                ? [1, 2, 3, 4].map(i => <Skeleton key={i} className="h-6 w-full" />)
                : skillBars.map(s => (
                  <div key={s.label} className="space-y-2">
                    <div className="flex justify-between items-center text-xs">
                      <span className="text-slate-500 font-light flex items-center gap-2">
                        <span className={`w-1.5 h-1.5 rounded-full ${s.color}`} />
                        {s.label}
                      </span>
                      <span className="font-bold text-slate-700">{s.value}%</span>
                    </div>
                    <div className="h-1 w-full bg-slate-100 rounded-full overflow-hidden">
                      <div
                        className={`h-full ${s.color} rounded-full ${s.shadow} transition-all duration-700`}
                        style={{ width: `${s.value}%` }}
                      />
                    </div>
                  </div>
                ))}
            </div>
          </div>
        </div>

        {/* Modules & Tasks */}
        <div className="lg:col-span-8 flex flex-col gap-6">
          {/* Module Row */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Today's Module */}
            <div id="dashboard-today" className="bg-white rounded-[2rem] p-8 border border-violet-200 shadow-sm relative group overflow-hidden">
              <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-violet-400 to-pink-400" />
              <div className="flex justify-between items-start mb-6">
                <h3 className="text-2xl font-black text-slate-800 tracking-tight">This Week</h3>
                <span className="bg-violet-100 text-violet-600 text-[10px] font-bold px-3 py-1 rounded-full flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-violet-500 animate-pulse" /> ACTIVE
                </span>
              </div>
              {loading ? (
                <div className="space-y-2">
                  <Skeleton className="w-20 h-3" />
                  <Skeleton className="w-48 h-6" />
                  <Skeleton className="w-full h-10 mt-4" />
                </div>
              ) : todayModule ? (
                <>
                  <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Week {todayModule.week_number} Module</p>
                  <h4 className="text-xl font-bold text-slate-700 mt-2">{todayModule.title}</h4>
                  <p className="text-sm text-slate-500 mt-3 line-clamp-2">{todayModule.description || 'No description available.'}</p>
                  <Link to="/courses" className="mt-8 w-full bg-blue-500 hover:bg-blue-600 text-white py-3 rounded-full text-sm font-bold transition-all shadow-lg shadow-blue-500/20 active:scale-95 flex items-center justify-center">
                    Enter Class
                  </Link>
                </>
              ) : (
                <p className="text-slate-400 text-sm mt-4">No module scheduled for this week.</p>
              )}
            </div>

            {/* Previous Module */}
            <div id="dashboard-previous" className="bg-white rounded-[2rem] p-8 border border-slate-200 shadow-sm relative group">
              <div className="flex justify-between items-start mb-6">
                <h3 className="text-2xl font-black text-slate-400 tracking-tight">Previous</h3>
                <span className="bg-slate-100 text-slate-500 text-[10px] font-bold px-3 py-1 rounded-full">
                  <span className="material-symbols-outlined text-[10px]">check</span> COMPLETED
                </span>
              </div>
              {loading ? (
                <div className="space-y-2"><Skeleton className="w-20 h-3" /><Skeleton className="w-48 h-6" /></div>
              ) : prevModule ? (
                <>
                  <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Week {prevModule.week_number} Module</p>
                  <h4 className="text-xl font-bold text-slate-600 mt-2">{prevModule.title}</h4>
                  <p className="text-sm text-slate-400 mt-3 line-clamp-2">{prevModule.description || ''}</p>
                  <Link to="/courses" className="mt-8 w-full border-2 border-slate-200 text-slate-500 hover:border-slate-300 hover:text-slate-600 py-3 rounded-full text-sm font-bold transition-all active:scale-95 flex items-center justify-center">
                    Review Materials
                  </Link>
                </>
              ) : (
                <p className="text-slate-400 text-sm mt-4">No previous module yet.</p>
              )}
            </div>
          </div>

          {/* Pending Actions */}
          <div className="bg-white p-8 rounded-[2rem] border border-red-100 shadow-sm">
            <div className="flex items-center gap-3 mb-6">
              <div className="p-2 bg-red-50 rounded-full text-red-500">
                <span className="material-symbols-outlined text-lg">warning</span>
              </div>
              <h3 className="text-lg font-bold text-slate-800">Pending Actions Required</h3>
            </div>
            <div id="dashboard-pending" className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {loading ? (
                [1, 2].map(i => <Skeleton key={i} className="h-20" />)
              ) : (pendingAssignments.length === 0 && pendingAssessments.length === 0) ? (
                <div className="col-span-2 py-8 text-center text-slate-400">
                  <span className="material-symbols-outlined text-4xl text-emerald-200 block mb-2">check_circle</span>
                  <p className="font-bold text-emerald-600">All caught up! No pending actions.</p>
                </div>
              ) : (
                <>
                  {pendingAssignments.slice(0, 2).map(a => {
                    const due = formatDue(a.due_date);
                    return (
                      <Link key={a.id} to="/assignments" className="flex items-center gap-4 p-4 bg-orange-50/50 border border-orange-100 rounded-[1.5rem] hover:bg-orange-50 transition-colors">
                        <div className="flex-1">
                          <span className="text-[10px] font-black text-orange-600 uppercase tracking-widest">Assignment</span>
                          <p className="text-sm font-bold text-slate-700 mt-1 line-clamp-1">{a.title}</p>
                          <p className={`text-xs mt-1 ${due.cls}`}>{due.label}</p>
                        </div>
                        <button className="p-3 bg-white rounded-full shadow-sm text-orange-500 hover:bg-orange-500 hover:text-white transition-all">
                          <span className="material-symbols-outlined text-sm">upload</span>
                        </button>
                      </Link>
                    );
                  })}
                  {pendingAssessments.slice(0, 2).map(a => {
                    const due = formatDue(a.due_date);
                    return (
                      <Link key={a.id} to="/assessments" className="flex items-center gap-4 p-4 bg-red-50/50 border border-red-100 rounded-[1.5rem] hover:bg-red-50 transition-colors">
                        <div className="flex-1">
                          <span className="text-[10px] font-black text-red-600 uppercase tracking-widest">Assessment</span>
                          <p className="text-sm font-bold text-slate-700 mt-1 line-clamp-1">{a.title}</p>
                          <p className={`text-xs mt-1 ${due.cls}`}>{due.label}</p>
                        </div>
                        <button className="p-3 bg-white rounded-full shadow-sm text-red-500 hover:bg-red-500 hover:text-white transition-all">
                          <span className="material-symbols-outlined text-sm">play_arrow</span>
                        </button>
                      </Link>
                    );
                  })}
                </>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Weekly Schedule */}
      <section className="bg-white rounded-[2rem] p-8 border border-violet-100 shadow-sm relative">
        <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-4 border-b border-slate-100 pb-6">
          <div>
            <h3 className="text-xl font-extrabold text-slate-800 tracking-tight">Weekly Learning Flow</h3>
            <p className="text-sm text-slate-500 mt-1">Your scheduled sessions for this week.</p>
          </div>
          <div className="text-sm font-bold text-slate-700 bg-slate-50 px-4 py-2 rounded-full">
            {getWeekDates()[0].toLocaleDateString('en-US', { month: 'short', day: 'numeric' })} – {getWeekDates()[6].toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
          </div>
        </div>

        <div id="dashboard-calendar" className="overflow-x-auto">
          <div className="min-w-[700px]">
            {/* Day Headers */}
            <div className="grid grid-cols-7 gap-3 mb-4">
              {DAY_LABELS.map(d => (
                <div key={d} className="text-center text-xs font-bold text-slate-500 uppercase tracking-wider py-2">{d}</div>
              ))}
            </div>
            {/* Session Cells */}
            {loading ? (
              <div className="grid grid-cols-7 gap-3">
                {DAY_LABELS.map(d => <Skeleton key={d} className="h-16" />)}
              </div>
            ) : (
              <div className="grid grid-cols-7 gap-3">
                {DAY_LABELS.map(d => (
                  <div key={d} className="min-h-[80px] flex flex-col gap-2">
                    {(weekSessions[d] || []).map(s => (
                      <button
                        key={s.id}
                        onClick={() => setSelectedSession(s)}
                        className="cursor-pointer hover:-translate-y-1 hover:shadow-md transition-all bg-violet-50 text-violet-700 text-xs font-bold px-3 py-2 rounded-xl flex flex-col items-start border-l-4 border-violet-500 text-left w-full shadow-sm"
                      >
                        <span className="truncate w-full">{s.title}</span>
                        <span className="text-[10px] text-violet-400 mt-0.5">{s.session_time?.slice(0, 5)}</span>
                      </button>
                    ))}
                  </div>
                ))}
              </div>
            )}
            {!loading && Object.keys(weekSessions).length === 0 && (
              <div className="text-center py-8 text-slate-400 col-span-7">
                <span className="material-symbols-outlined text-4xl text-slate-200 block mb-2">calendar_month</span>
                <p className="text-sm font-medium">No sessions scheduled for this week.</p>
              </div>
            )}
          </div>
        </div>

        {/* Session Detail Modal */}
        {selectedSession && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 backdrop-blur-sm" onClick={() => setSelectedSession(null)}>
            <div className="bg-white rounded-[2rem] p-8 max-w-sm w-full mx-4 shadow-2xl" onClick={e => e.stopPropagation()}>
              <div className="flex justify-between items-start mb-4">
                <span className="text-[10px] font-bold text-violet-600 uppercase tracking-widest bg-violet-50 px-3 py-1 rounded-full">{selectedSession.type?.toUpperCase()}</span>
                <button onClick={() => setSelectedSession(null)} className="p-2 bg-slate-50 hover:bg-slate-100 rounded-full text-slate-500 transition-colors">
                  <span className="material-symbols-outlined text-sm">close</span>
                </button>
              </div>
              <h3 className="text-xl font-black text-slate-800 mb-2">{selectedSession.title}</h3>
              <p className="text-sm text-slate-500 mb-1">{selectedSession.session_date} at {selectedSession.session_time?.slice(0, 5)}</p>
              <p className="text-xs text-slate-400 mb-6">{selectedSession.duration_minutes} minutes</p>
              {selectedSession.zoom_link ? (
                <a href={selectedSession.zoom_link} target="_blank" rel="noopener noreferrer" className="w-full block bg-violet-500 hover:bg-violet-600 text-white font-bold py-3 rounded-full text-center shadow-lg shadow-violet-200 transition-colors">
                  Join Session
                </a>
              ) : (
                <button onClick={() => setSelectedSession(null)} className="w-full bg-violet-500 hover:bg-violet-600 text-white font-bold py-3 rounded-full shadow-lg shadow-violet-200 transition-colors">
                  Close
                </button>
              )}
            </div>
          </div>
        )}
      </section>

      {/* FAB */}
      <Link to="/assignments" className="fixed bottom-8 right-8 w-16 h-16 bg-[#6C35DE] text-white rounded-full flex items-center justify-center shadow-2xl shadow-[#6C35DE]/40 hover:scale-110 active:scale-95 transition-all z-50">
        <span className="material-symbols-outlined text-2xl">add</span>
      </Link>
    </>
  );
}
