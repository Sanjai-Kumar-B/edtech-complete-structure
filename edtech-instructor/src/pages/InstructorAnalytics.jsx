import { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { supabase } from '@junospace/supabase-client';

export function InstructorAnalytics() {
  const { profile } = useAuth();
  
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState({
    globalAvg: 0,
    totalStudents: 0,
    avgAttendance: 0,
    criticalCount: 0,
    batches: [],
    atRiskStudents: [],
    frictionPoints: []
  });

  useEffect(() => {
    async function loadAnalytics() {
      if (!profile) return;

      const { data: batchesRaw } = await supabase.from('batches').select('id, batch_code').eq('instructor_id', profile.id).eq('status', 'active');
      const batchIds = batchesRaw?.map(b => b.id) || [];
      
      if (batchIds.length > 0) {
        // Pre-fetch all session IDs in these batches (avoids nested await)
        const { data: sessions } = await supabase.from('sessions').select('id, title, batch_id, session_date').in('batch_id', batchIds);
        const { data: assignments } = await supabase.from('assignments').select('id, title, batch_id').in('batch_id', batchIds);
        const { data: assessmentsAll } = await supabase.from('assessments').select('id, title, batch_id').in('batch_id', batchIds);

        const sessionIds = sessions?.map(s => s.id) || [];
        const assignmentIds = assignments?.map(a => a.id) || [];
        const assessmentIds = assessmentsAll?.map(a => a.id) || [];

        // Load all data in parallel
        const [{ data: scores }, { data: enrollments }, { data: attendance }, { data: assignSubs }, { data: assessSubs }] = await Promise.all([
          supabase.from('leaderboard_scores').select('*').in('batch_id', batchIds),
          supabase.from('enrollments').select('*').in('batch_id', batchIds).eq('status', 'active'),
          sessionIds.length > 0 ? supabase.from('attendance').select('session_id, status, marked_at').in('session_id', sessionIds) : Promise.resolve({ data: [] }),
          assignmentIds.length > 0 ? supabase.from('assignment_submissions').select('score, assignment_id').in('assignment_id', assignmentIds) : Promise.resolve({ data: [] }),
          assessmentIds.length > 0 ? supabase.from('assessment_submissions').select('score, assessment_id').in('assessment_id', assessmentIds) : Promise.resolve({ data: [] }),
        ]);

        // Stats
        const globalAvg = scores?.length > 0 ? Math.round(scores.reduce((acc, s) => acc + s.total_score, 0) / scores.length) : 0;
        const totalStudents = enrollments?.length || 0;
        const avgAttendance = attendance?.length ? Math.round((attendance.filter(a => a.status === 'PRESENT').length / attendance.length) * 100) : 0;
        const atRiskStudents = scores?.filter(s => s.total_score < 60) || [];
        
        // Batch Breakdown — all in-memory, no nested awaits
        const batchesMapped = batchesRaw.map(b => {
          const bSessIds = sessions?.filter(s => s.batch_id === b.id).map(s => s.id) || [];
          const bAtt = attendance?.filter(a => bSessIds.includes(a.session_id)) || [];
          const bAttP = bAtt.length ? Math.round((bAtt.filter(a=>a.status==='PRESENT').length / bAtt.length)*100) : 0;
          
          const bAssignIds = assignments?.filter(a => a.batch_id === b.id).map(a => a.id) || [];
          const bAssignSubs = assignSubs?.filter(a => bAssignIds.includes(a.assignment_id)) || [];
          const bEnrolled = enrollments?.filter(e=>e.batch_id===b.id).length || 0;
          const bCompP = (bAssignIds.length * bEnrolled) > 0 ? Math.round((bAssignSubs.length / (bAssignIds.length * bEnrolled))*100) : 0;

          const bScores = scores?.filter(s => s.batch_id === b.id) || [];
          const bAvgScore = bScores.length ? Math.round(bScores.reduce((acc,s)=>acc+s.total_score,0)/bScores.length) : 0;

          const bAssessIds = assessmentsAll?.filter(a => a.batch_id === b.id).map(a => a.id) || [];
          const bAssessSubs = assessSubs?.filter(a => bAssessIds.includes(a.assessment_id)) || [];
          const bAvgAssess = bAssessSubs.length ? Math.round(bAssessSubs.reduce((acc,a)=>acc+a.score,0)/bAssessSubs.length) : 0;

          const engagement = Math.round((bAttP + bCompP) / 2);
          const status = engagement > 70 ? 'ON TRACK' : engagement >= 40 ? 'NEEDS REVIEW' : 'AT RISK';

          return { ...b, attP: bAttP, compP: bCompP, avgScore: bAvgScore, avgAssess: bAvgAssess, engagement, status };
        });

        // Friction Points
        const frictionPoints = [];
        if (assignSubs?.length > 0 && assignments?.length > 0) {
          const aScores = {};
          assignSubs.forEach(s => { if(!aScores[s.assignment_id]) aScores[s.assignment_id]=[]; aScores[s.assignment_id].push(s.score||0); });
          let lowestA = null; let lowestAScore = 101;
          for (let aid in aScores) {
            const avg = aScores[aid].reduce((a,b)=>a+b,0)/aScores[aid].length;
            if (avg < lowestAScore) { lowestAScore = avg; lowestA = aid; }
          }
          if (lowestA && lowestAScore < 60) {
            const aTitle = assignments.find(a=>a.id===lowestA)?.title;
            frictionPoints.push({ title: `Assignment: ${aTitle}`, reason: `Avg score ${Math.round(lowestAScore)}%`, level: 'CRITICAL' });
          }
        }
        
        if (attendance?.length > 0 && sessions?.length > 0) {
          const sAtt = {};
          attendance.forEach(a => { if(!sAtt[a.session_id]) sAtt[a.session_id]={p:0,t:0}; sAtt[a.session_id].t++; if(a.status==='PRESENT') sAtt[a.session_id].p++; });
          let lowestS = null; let lowestSAtt = 101;
          for (let sid in sAtt) {
            const pct = (sAtt[sid].p / sAtt[sid].t)*100;
            if (pct < lowestSAtt) { lowestSAtt = pct; lowestS = sid; }
          }
          if (lowestS && lowestSAtt < 60) {
            const sTitle = sessions.find(s=>s.id===lowestS)?.title;
            frictionPoints.push({ title: `Session: ${sTitle}`, reason: `Attendance ${Math.round(lowestSAtt)}%`, level: 'HIGH' });
          }
        }

        // Weekly attendance trend (last 6 weeks)
        const now = new Date();
        const weeklyAtt = Array.from({ length: 6 }, (_, wi) => {
          const weekStart = new Date(now);
          weekStart.setDate(now.getDate() - (5 - wi) * 7);
          const weekEnd = new Date(weekStart);
          weekEnd.setDate(weekStart.getDate() + 6);
          const weekSessions = sessions?.filter(s => {
            const sd = new Date(s.session_date);
            return sd >= weekStart && sd <= weekEnd;
          }) || [];
          const weekSessIds = weekSessions.map(s => s.id);
          const weekAtt = attendance?.filter(a => weekSessIds.includes(a.session_id)) || [];
          return weekAtt.length ? Math.round((weekAtt.filter(a=>a.status==='PRESENT').length / weekAtt.length) * 100) : 0;
        });

        setData({
          globalAvg,
          totalStudents,
          avgAttendance,
          criticalCount: atRiskStudents.length,
          batches: batchesMapped,
          atRiskStudents,
          frictionPoints,
          weeklyAtt,
        });
      }
      setLoading(false);
    }
    loadAnalytics();
  }, [profile]);

  if (loading) return <div className="p-8 pt-20">Loading analytics...</div>;

  const getColor = (val) => val >= 80 ? 'bg-emerald-500' : val >= 60 ? 'bg-amber-500' : 'bg-red-500';

  // Real weekly attendance trend from DB (last 6 weeks)
  const weeklyAttData = data.weeklyAtt || [0, 0, 0, 0, 0, 0];
  const maxWAtt = Math.max(...weeklyAttData, 1);
  const points1 = weeklyAttData.map((val, i) => `${i * (400/5)},${150 - (val / 100 * 140)}`).join(' ');

  return (
    <div className="pt-20 p-8 space-y-6">
      <header>
        <h1 className="text-3xl font-extrabold tracking-tight">Analytics Overview</h1>
        <p className="text-secondary font-medium mt-1">Global performance metrics across all your batches.</p>
      </header>

      {/* STAT CARDS */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200">
          <p className="text-xs font-bold text-secondary uppercase mb-2">Global Avg Score</p>
          <p className="text-3xl font-black">{data.globalAvg}</p>
        </div>
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200">
          <p className="text-xs font-bold text-secondary uppercase mb-2">Total Students</p>
          <p className="text-3xl font-black">{data.totalStudents}</p>
        </div>
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200">
          <p className="text-xs font-bold text-secondary uppercase mb-2">Avg Attendance</p>
          <p className="text-3xl font-black">{data.avgAttendance}%</p>
        </div>
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200">
          <p className="text-xs font-bold text-red-500 uppercase mb-2">Critical Students</p>
          <p className="text-3xl font-black text-red-600">{data.criticalCount}</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* CHARTS */}
        <div className="lg:col-span-2 space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200 h-64 flex flex-col">
              <h3 className="font-bold text-sm mb-4">Attendance by Batch</h3>
              <div className="flex-1 flex items-end justify-around gap-2 pb-2">
                {data.batches.map(b => (
                  <div key={b.id} className="flex flex-col items-center w-full group relative">
                    <div className="absolute -top-8 bg-slate-800 text-white text-[10px] py-1 px-2 rounded opacity-0 group-hover:opacity-100 transition-opacity">{b.attP}%</div>
                    <div className={`w-full rounded-t-md ${getColor(b.attP)}`} style={{ height: `${b.attP}%` }}></div>
                    <p className="text-[10px] mt-2 font-bold text-slate-500 rotate-45 origin-left">{b.batch_code}</p>
                  </div>
                ))}
              </div>
            </div>
            <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200 h-64 flex flex-col">
              <h3 className="font-bold text-sm mb-4">Assign Completion</h3>
              <div className="flex-1 flex items-end justify-around gap-2 pb-2">
                {data.batches.map(b => (
                  <div key={b.id} className="flex flex-col items-center w-full group relative">
                    <div className="absolute -top-8 bg-slate-800 text-white text-[10px] py-1 px-2 rounded opacity-0 group-hover:opacity-100 transition-opacity">{b.compP}%</div>
                    <div className="w-full rounded-t-md bg-indigo-500" style={{ height: `${b.compP}%` }}></div>
                    <p className="text-[10px] mt-2 font-bold text-slate-500 rotate-45 origin-left">{b.batch_code}</p>
                  </div>
                ))}
              </div>
            </div>
            <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200 h-64 flex flex-col">
              <h3 className="font-bold text-sm mb-4">Assess Avg Scores</h3>
              <div className="flex-1 flex items-end justify-around gap-2 pb-2">
                {data.batches.map(b => (
                  <div key={b.id} className="flex flex-col items-center w-full group relative">
                    <div className="absolute -top-8 bg-slate-800 text-white text-[10px] py-1 px-2 rounded opacity-0 group-hover:opacity-100 transition-opacity">{b.avgAssess}%</div>
                    <div className="w-full rounded-t-md bg-purple-500" style={{ height: `${b.avgAssess}%` }}></div>
                    <p className="text-[10px] mt-2 font-bold text-slate-500 rotate-45 origin-left">{b.batch_code}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200 overflow-x-auto">
            <h3 className="font-bold mb-4">Batch Performance Breakdown</h3>
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-slate-200 bg-slate-50">
                  <th className="p-3 text-xs font-bold text-secondary uppercase">Batch</th>
                  <th className="p-3 text-xs font-bold text-secondary uppercase text-center">Avg Score</th>
                  <th className="p-3 text-xs font-bold text-secondary uppercase text-center">Completion %</th>
                  <th className="p-3 text-xs font-bold text-secondary uppercase text-center">Engagement</th>
                  <th className="p-3 text-xs font-bold text-secondary uppercase text-center">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {data.batches.map(b => (
                  <tr key={b.id} className="hover:bg-slate-50">
                    <td className="p-3 font-bold text-sm">{b.batch_code}</td>
                    <td className="p-3 text-center font-semibold text-sm">{b.avgScore}</td>
                    <td className="p-3 text-center font-semibold text-sm">{b.compP}%</td>
                    <td className="p-3 text-center font-semibold text-sm">{b.engagement}%</td>
                    <td className="p-3 text-center">
                      <span className={`text-[10px] px-2 py-1 font-bold rounded-full uppercase ${b.status==='ON TRACK'?'bg-emerald-100 text-emerald-700':b.status==='NEEDS REVIEW'?'bg-amber-100 text-amber-700':'bg-red-100 text-red-700'}`}>{b.status}</span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200">
            <h3 className="font-bold mb-2">Attendance Trend (6 Weeks)</h3>
            <p className="text-[10px] text-secondary mb-4 uppercase tracking-widest">Live attendance %</p>
            <div className="w-full overflow-x-auto">
              <svg viewBox="0 0 400 160" className="w-full h-full min-w-[300px]">
                <line x1="0" y1="110" x2="400" y2="110" stroke="#f1f5f9" strokeWidth="1" />
                <line x1="0" y1="70" x2="400" y2="70" stroke="#f1f5f9" strokeWidth="1" />
                <line x1="0" y1="30" x2="400" y2="30" stroke="#f1f5f9" strokeWidth="1" />
                <text x="0" y="112" fontSize="8" fill="#94a3b8">0%</text>
                <text x="0" y="72" fontSize="8" fill="#94a3b8">50%</text>
                <text x="0" y="32" fontSize="8" fill="#94a3b8">100%</text>
                {weeklyAttData.length > 1 && (
                  <polyline fill="none" stroke="#4f46e5" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"
                    points={points1} />
                )}
                {weeklyAttData.map((val, i) => (
                  <g key={i}>
                    <circle cx={i * (400/5)} cy={150 - (val / 100 * 140)} r="5" fill="#4f46e5" />
                    <text x={i * (400/5)} y={165} fontSize="8" fill="#94a3b8" textAnchor="middle">W-{5-i}</text>
                  </g>
                ))}
              </svg>
            </div>
            <p className="text-center text-xs text-secondary mt-2">W-0 = This week, W-5 = 5 weeks ago</p>
          </div>
        </div>

        {/* RIGHT PANEL: AT RISK & FRICTION */}
        <div className="lg:col-span-1 space-y-6">
          <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
            <div className="p-5 border-b border-slate-100 bg-red-50">
              <h3 className="font-bold text-red-700">At-Risk Students</h3>
            </div>
            <div className="divide-y divide-slate-100 p-2 max-h-[300px] overflow-y-auto">
              {data.atRiskStudents.map((st, i) => (
                <div key={i} className="p-3 flex items-center justify-between hover:bg-slate-50">
                  <div>
                    <p className="font-bold text-sm">{st.full_name}</p>
                    <p className="text-xs text-secondary">{data.batches.find(b=>b.id===st.batch_id)?.batch_code} • Score: {st.total_score}</p>
                  </div>
                  <a href={`mailto:?subject=Checking in`} className="text-slate-400 hover:text-indigo-600"><span className="material-symbols-outlined text-[18px]">mail</span></a>
                </div>
              ))}
              {data.atRiskStudents.length===0 && <p className="p-4 text-center text-sm text-secondary">No students at risk.</p>}
            </div>
          </div>

          <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
            <div className="p-5 border-b border-slate-100 bg-amber-50">
              <h3 className="font-bold text-amber-700">Friction Points</h3>
            </div>
            <div className="divide-y divide-slate-100 p-2 max-h-[300px] overflow-y-auto">
              {data.frictionPoints.map((fp, i) => (
                <div key={i} className="p-3 flex items-start gap-3 hover:bg-slate-50">
                  <span className={`material-symbols-outlined text-[20px] ${fp.level==='CRITICAL'?'text-red-500':'text-amber-500'}`}>{fp.level==='CRITICAL'?'warning':'info'}</span>
                  <div>
                    <p className="font-bold text-sm">{fp.title}</p>
                    <p className="text-xs text-secondary mt-0.5">{fp.reason}</p>
                    <span className="text-[10px] font-bold uppercase mt-1 inline-block text-slate-500 bg-slate-100 px-2 rounded">{fp.level}</span>
                  </div>
                </div>
              ))}
              {data.frictionPoints.length===0 && <p className="p-4 text-center text-sm text-secondary">No friction points detected.</p>}
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
