import { useEffect, useState } from 'react';
import { useParams, useSearchParams, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { supabase } from '@junospace/supabase-client';

export function StudentProfileNotes() {
  const { studentId } = useParams();
  const [searchParams] = useSearchParams();
  const batchId = searchParams.get('batch');
  const { profile: instructor } = useAuth();
  
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState(null);
  const [tab, setTab] = useState('overview');
  
  const [bonusPoints, setBonusPoints] = useState('0');
  const [notes, setNotes] = useState('');
  const [skills, setSkills] = useState({ consistency: 0, technical: 0, conceptual: 0, participation: 0 });
  const [saving, setSaving] = useState(false);
  const [toast, setToast] = useState('');

  useEffect(() => {
    async function loadStudent() {
      if (!studentId || !batchId) { setLoading(false); return; }

      const [
        { data: studentProfile },
        { data: attendanceRecords },
        { data: assignmentSubs },
        { data: assessmentSubs },
        { data: skillData },
        { data: leaderboardPts },
        { data: leaderboardView },
        { data: enrollment },
        { data: instructorNote }
      ] = await Promise.all([
        supabase.from('users').select('*').eq('id', studentId).single(),
        supabase.from('attendance').select('*, sessions(title, session_date, batch_id)').eq('student_id', studentId),
        supabase.from('assignment_submissions').select('*, assignments(title, due_date, max_score, batch_id)').eq('student_id', studentId),
        supabase.from('assessment_submissions').select('*, assessments(title, batch_id)').eq('student_id', studentId),
        supabase.from('student_skills').select('*').eq('student_id', studentId).eq('batch_id', batchId).maybeSingle(),
        supabase.from('leaderboard_points').select('*').eq('student_id', studentId).eq('batch_id', batchId).maybeSingle(),
        supabase.from('leaderboard_scores').select('*').eq('student_id', studentId).eq('batch_id', batchId).maybeSingle(),
        supabase.from('enrollments').select('status, batches(batch_code)').eq('student_id', studentId).eq('batch_id', batchId).maybeSingle(),
        supabase.from('instructor_notes').select('note').eq('instructor_id', instructor.id).eq('student_id', studentId).maybeSingle()
      ]);

      const batchAtt = (attendanceRecords || []).filter(a => a.sessions?.batch_id === batchId);
      const presentCount = batchAtt.filter(a => a.status === 'PRESENT').length;
      const attPercent = batchAtt.length ? Math.round((presentCount / batchAtt.length) * 100) : 0;

      const batchAssign = (assignmentSubs || []).filter(a => a.assignments?.batch_id === batchId && a.status === 'reviewed');
      const assignAvg = batchAssign.length ? Math.round(batchAssign.reduce((a,b) => a + (b.score||0), 0) / batchAssign.length) : 0;

      const batchAssess = (assessmentSubs || []).filter(a => a.assessments?.batch_id === batchId);
      const assessAvg = batchAssess.length ? Math.round(batchAssess.reduce((a,b) => a + (b.score||0), 0) / batchAssess.length) : 0;

      const totalScore = leaderboardView?.total_score || 0;
      const rank = leaderboardView?.rank || '-';
      const riskLevel = totalScore >= 70 ? 'LOW' : totalScore >= 50 ? 'MEDIUM' : 'HIGH';

      const initialSkills = skillData || { consistency: 0, technical: 0, conceptual: 0, participation: 0 };

      setData({
        profile: studentProfile,
        attendance: batchAtt,
        assignments: (assignmentSubs || []).filter(a => a.assignments?.batch_id === batchId),
        assessments: batchAssess,
        skills: initialSkills,
        pts: leaderboardPts,
        rank,
        attPercent, assignAvg, assessAvg, riskLevel,
        status: enrollment?.status || 'UNKNOWN',
        batch_code: enrollment?.batches?.batch_code || batchId
      });

      setBonusPoints(leaderboardPts?.bonus_points?.toString() || '0');
      setNotes(instructorNote?.note || '');
      setSkills(initialSkills);
      setLoading(false);
    }
    loadStudent();
  }, [studentId, batchId]);

  const handleSaveAll = async () => {
    setSaving(true);
    try {
      // 1. Save Points (bonus points in leaderboard_points)
      const { error: pError } = await supabase.from('leaderboard_points').upsert({
        student_id: studentId,
        batch_id: batchId,
        bonus_points: parseInt(bonusPoints) || 0,
        updated_by: instructor.id,
        updated_at: new Date().toISOString()
      }, { onConflict: 'student_id,batch_id' });

      if (pError) throw pError;

      // 2. Save private instructor note to instructor_notes table
      if (notes.trim()) {
        const { error: nError } = await supabase.from('instructor_notes').upsert({
          instructor_id: instructor.id,
          student_id: studentId,
          note: notes,
          updated_at: new Date().toISOString()
        }, { onConflict: 'instructor_id,student_id' });
        if (nError) throw nError;
      }

      // 3. Skills are read-only computed views; no manual write needed
      // (leaderboard_scores and student_skills are views computed from real data)

      setToast('Student 360° Profile Updated');
      setTimeout(() => setToast(''), 3000);
    } catch (err) {
      alert(err.message);
    } finally {
      setSaving(false);
    }
  };

  const updateSubScore = async (type, id, newScore) => {
    const table = type === 'assignment' ? 'assignment_submissions' : 'assessment_submissions';
    const { error } = await supabase.from(table).update({ score: parseInt(newScore), status: 'reviewed' }).eq('id', id);
    if (!error) {
       setToast('Score updated');
       setTimeout(() => setToast(''), 2000);
       // Local update
       setData(prev => ({
           ...prev,
           [type + 's']: prev[type + 's'].map(item => item.id === id ? { ...item, score: parseInt(newScore), status: 'reviewed' } : item)
       }));
    }
  };

  if (loading) return <div className="p-8 pt-24 text-center">
    <div className="animate-spin w-8 h-8 border-4 border-primary border-t-transparent rounded-full mx-auto mb-4"></div>
    <p className="text-secondary font-bold">Aggregating Student 360° Data...</p>
  </div>;
  
  if (!data?.profile) return <div className="p-12 pt-24 text-center text-error font-bold">Student Record Not Found.</div>;

  const riskColors = { 
    LOW: 'bg-emerald-50 text-emerald-600 border-emerald-100', 
    MEDIUM: 'bg-amber-50 text-amber-600 border-amber-100', 
    HIGH: 'bg-red-50 text-red-600 border-red-100' 
  };

  return (
    <div className="pt-24 p-8 max-w-7xl mx-auto space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-6">
          <Link to={`/instructor/students`} className="w-12 h-12 rounded-2xl bg-surface-container-low flex items-center justify-center text-secondary hover:text-primary transition-colors">
            <span className="material-symbols-outlined">arrow_back</span>
          </Link>
          <div>
            <h1 className="text-3xl font-black text-on-surface tracking-tight leading-none">Student 360° Profile</h1>
            <p className="text-secondary font-medium mt-2">{data.profile.full_name} • {data.batch_code}</p>
          </div>
        </div>
        <div className="flex gap-3">
          <button className="px-6 py-3 bg-surface-container-high rounded-2xl text-sm font-bold text-on-surface-variant flex items-center gap-2">
            <span className="material-symbols-outlined text-[20px]">mail</span> Message
          </button>
          <button onClick={handleSaveAll} disabled={saving} className="px-8 py-3 bg-primary text-white rounded-2xl text-sm font-bold shadow-lg shadow-primary/20 hover:scale-105 transition-all">
            {saving ? 'Synchronizing...' : 'Save All Changes'}
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* LEFT COLUMN - Bio & Overrides */}
        <div className="lg:col-span-4 space-y-8">
          {/* Bio Card */}
          <section className="bg-surface-container-lowest rounded-[2.5rem] p-8 border border-surface-variant/20 shadow-sm text-center">
            <div className="relative inline-block mb-6">
              <div className="w-32 h-32 rounded-full bg-slate-100 flex items-center justify-center text-4xl font-black text-slate-400 border-4 border-white shadow-xl">
                {data.profile.full_name?.charAt(0)}
              </div>
              <div className={`absolute bottom-1 right-1 w-8 h-8 rounded-full border-4 border-white shadow-md ${data.status === 'active' ? 'bg-emerald-500' : 'bg-slate-300'}`}></div>
            </div>
            <h2 className="text-2xl font-black text-on-surface">{data.profile.full_name}</h2>
            <p className="text-sm text-secondary mb-6">{data.profile.email}</p>
            
            <div className="flex flex-wrap justify-center gap-2 mb-8">
              <span className={`px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest border ${riskColors[data.riskLevel]}`}>{data.riskLevel} Risk Profile</span>
              <span className="px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest bg-slate-100 text-slate-600 border border-slate-200">{data.status} Status</span>
            </div>

            <div className="grid grid-cols-2 gap-4">
               <div className="bg-surface-container-low p-4 rounded-3xl">
                  <p className="text-[10px] font-black text-secondary uppercase tracking-widest mb-1">Board Rank</p>
                  <p className="text-2xl font-black text-primary">#{data.rank}</p>
               </div>
               <div className="bg-surface-container-low p-4 rounded-3xl">
                  <p className="text-[10px] font-black text-secondary uppercase tracking-widest mb-1">Attendance</p>
                  <p className="text-2xl font-black text-on-surface">{data.attPercent}%</p>
               </div>
            </div>
          </section>

          {/* Overrides Card */}
          <section className="bg-surface-container-lowest rounded-[2.5rem] p-8 border border-surface-variant/20 shadow-sm space-y-8">
            <h3 className="text-lg font-black text-on-surface flex items-center gap-2">
              <span className="material-symbols-outlined text-primary">tune</span> Performance Overrides
            </h3>
            
            <div className="space-y-6">
              <div>
                <div className="flex justify-between items-center mb-3">
                  <label className="text-xs font-bold text-secondary uppercase tracking-widest">Leaderboard Bonus</label>
                  <span className="text-xs font-black text-primary">+{bonusPoints} Pts</span>
                </div>
                <input type="range" min="-100" max="500" step="5" value={bonusPoints} onChange={e=>setBonusPoints(e.target.value)} className="w-full h-2 bg-surface-container-high rounded-lg appearance-none cursor-pointer accent-primary" />
              </div>

              <div className="space-y-4 pt-4 border-t border-surface-variant/10">
                <p className="text-xs font-bold text-secondary uppercase tracking-widest">Skill Quadrants</p>
                {Object.entries(skills).map(([key, val]) => (
                  <div key={key}>
                    <div className="flex justify-between items-center mb-2">
                      <label className="text-[11px] font-bold text-on-surface-variant capitalize">{key}</label>
                      <span className="text-[11px] font-bold text-on-surface">{val}%</span>
                    </div>
                    <input type="range" min="0" max="100" value={val} onChange={e => setSkills({...skills, [key]: parseInt(e.target.value)})} className="w-full h-1.5 bg-surface-container-high rounded-lg appearance-none cursor-pointer accent-indigo-500" />
                  </div>
                ))}
              </div>

              <div className="pt-4 border-t border-surface-variant/10">
                <label className="text-xs font-bold text-secondary uppercase tracking-widest mb-3 block">Instructor Private Notes</label>
                <textarea rows={4} value={notes} onChange={e=>setNotes(e.target.value)} className="w-full p-4 bg-surface-container-low border-none rounded-2xl text-sm font-medium placeholder:text-slate-400 focus:ring-2 focus:ring-primary/20" placeholder="Observations about this student..." />
              </div>
            </div>
          </section>
        </div>

        {/* RIGHT COLUMN - Activity Tabs */}
        <div className="lg:col-span-8 bg-surface-container-lowest rounded-[2.5rem] border border-surface-variant/20 shadow-sm overflow-hidden flex flex-col min-h-[600px]">
          {/* Tab Navigation */}
          <div className="flex border-b border-surface-variant/10 bg-surface-container-lowest px-4">
            {[
              { id: 'overview', icon: 'dashboard', label: 'Summary' },
              { id: 'attendance', icon: 'calendar_month', label: 'Attendance' },
              { id: 'assignments', icon: 'assignment', label: 'Assignments' },
              { id: 'assessments', icon: 'quiz', label: 'Assessments' }
            ].map(t => (
              <button key={t.id} onClick={() => setTab(t.id)} className={`flex items-center gap-2 px-6 py-5 text-sm font-bold transition-all relative ${tab === t.id ? 'text-primary' : 'text-secondary hover:text-on-surface'}`}>
                <span className="material-symbols-outlined text-[18px]">{t.icon}</span>
                {t.label}
                {tab === t.id && <div className="absolute bottom-0 left-0 right-0 h-1 bg-primary rounded-t-full"></div>}
              </button>
            ))}
          </div>

          <div className="p-8 flex-1 overflow-y-auto">
            {tab === 'overview' && (
              <div className="space-y-8 animate-in fade-in duration-300">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="p-6 bg-indigo-50 rounded-3xl border border-indigo-100">
                    <h4 className="text-xs font-black text-indigo-400 uppercase tracking-widest mb-4">Academic Velocity</h4>
                    <div className="flex items-baseline gap-2">
                       <span className="text-5xl font-black text-indigo-700">{data.assignAvg}</span>
                       <span className="text-lg font-bold text-indigo-400">/ 100</span>
                    </div>
                    <p className="text-xs text-indigo-600/60 font-medium mt-2">Weighted average across all graded modules.</p>
                  </div>
                  <div className="p-6 bg-emerald-50 rounded-3xl border border-emerald-100">
                    <h4 className="text-xs font-black text-emerald-400 uppercase tracking-widest mb-4">Engagement Rate</h4>
                    <div className="flex items-baseline gap-2">
                       <span className="text-5xl font-black text-emerald-700">{data.attPercent}</span>
                       <span className="text-lg font-bold text-emerald-400">%</span>
                    </div>
                    <p className="text-xs text-emerald-600/60 font-medium mt-2">Live session attendance and interaction.</p>
                  </div>
                </div>

                <div className="bg-slate-50 p-8 rounded-3xl">
                   <h4 className="text-sm font-black text-slate-800 mb-6">Recent Milestone Submissions</h4>
                   <div className="space-y-3">
                      {data.assignments.slice(0,3).map(a => (
                        <div key={a.id} className="flex items-center justify-between p-4 bg-white rounded-2xl shadow-sm border border-slate-100">
                          <div className="flex items-center gap-3">
                            <span className="material-symbols-outlined text-indigo-500">description</span>
                            <div>
                              <p className="text-sm font-bold text-slate-800">{a.assignments?.title}</p>
                              <p className="text-[10px] text-slate-400 font-bold uppercase">{a.status}</p>
                            </div>
                          </div>
                          <span className="text-sm font-black text-slate-700">{a.score || 'PENDING'}</span>
                        </div>
                      ))}
                   </div>
                </div>
              </div>
            )}

            {tab === 'attendance' && (
              <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {data.attendance.map(a => (
                    <div key={a.id} className="p-4 bg-white rounded-2xl border border-slate-100 shadow-sm flex justify-between items-center group hover:border-primary transition-colors">
                      <div>
                        <p className="text-sm font-bold text-slate-800">{a.sessions?.title}</p>
                        <p className="text-[10px] text-slate-400 font-bold">{a.sessions?.session_date}</p>
                      </div>
                      <select value={a.status} className="bg-slate-50 border-none rounded-xl text-[10px] font-black uppercase py-1.5 focus:ring-1 ring-primary/20">
                         <option value="PRESENT">Present</option>
                         <option value="ABSENT">Absent</option>
                         <option value="LATE">Late</option>
                      </select>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {tab === 'assignments' && (
              <div className="space-y-4">
                {data.assignments.map(a => (
                  <div key={a.id} className="p-6 bg-white rounded-3xl border border-slate-100 shadow-sm flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                    <div className="flex-1">
                      <h4 className="font-bold text-slate-800">{a.assignments?.title}</h4>
                      <div className="flex items-center gap-3 mt-1">
                        <span className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">Due {a.assignments?.due_date}</span>
                        <div className="h-3 w-[1px] bg-slate-200"></div>
                        <span className={`text-[10px] font-black uppercase ${a.status==='reviewed'?'text-emerald-500':'text-amber-500'}`}>{a.status}</span>
                      </div>
                    </div>
                    <div className="flex items-center gap-4 w-full md:w-auto">
                       <div className="bg-slate-50 rounded-2xl p-3 flex items-center gap-2 border border-slate-100 w-full md:w-32">
                          <input type="number" value={a.score || 0} onChange={e => updateSubScore('assignment', a.id, e.target.value)} className="bg-transparent border-none p-0 text-lg font-black text-indigo-600 w-full text-center focus:ring-0" />
                          <span className="text-xs font-bold text-slate-400">/{a.assignments?.max_score}</span>
                       </div>
                       <button className="p-3 bg-indigo-50 text-indigo-600 rounded-xl hover:bg-indigo-600 hover:text-white transition-all">
                          <span className="material-symbols-outlined text-[20px]">visibility</span>
                       </button>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {tab === 'assessments' && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {data.assessments.map(a => (
                  <div key={a.id} className="p-6 bg-white rounded-3xl border border-slate-100 shadow-sm flex justify-between items-center group">
                    <div>
                      <h4 className="text-sm font-bold text-slate-800">{a.assessments?.title}</h4>
                      <p className="text-[10px] text-slate-400 font-bold mt-1">Submission Score</p>
                    </div>
                    <div className="bg-indigo-50 px-4 py-2 rounded-2xl border border-indigo-100">
                       <input type="number" value={a.score || 0} onChange={e => updateSubScore('assessment', a.id, e.target.value)} className="bg-transparent border-none p-0 text-xl font-black text-indigo-600 w-12 text-center focus:ring-0" />
                       <span className="text-xs font-bold text-indigo-400">%</span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {toast && (
        <div className="fixed bottom-12 left-1/2 -translate-x-1/2 bg-slate-900 text-white px-8 py-4 rounded-full font-bold shadow-2xl flex items-center gap-3 animate-in slide-in-from-bottom duration-300 z-[100]">
           <span className="material-symbols-outlined text-emerald-400">check_circle</span>
           {toast}
        </div>
      )}
    </div>
  );
}
