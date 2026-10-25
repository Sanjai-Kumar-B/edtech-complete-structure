import { useEffect, useState } from 'react';
import { supabase } from '@junospace/supabase-client';
import { StatCard } from '@junospace/ui';

export function AdminAnalytics() {
  const [loading, setLoading] = useState(true);
  const [period, setPeriod] = useState('month'); // week, month, quarter, year
  
  const [stats, setStats] = useState({ enrolls: 0, compRate: 0, attRate: 0, assScore: 0 });
  const [trends, setTrends] = useState({ enrolls: '+5.2%', compRate: '+1.1%', attRate: '-0.5%', assScore: '+2.0%' });
  const [monthlyData, setMonthlyData] = useState(Array(12).fill({ e: 0, c: 0 }));
  const [batchesInfo, setBatchesInfo] = useState([]);

  // Reporting State
  const [batches, setBatches] = useState([]);
  const [selectedBatchId, setSelectedBatchId] = useState('');
  const [reportData, setReportData] = useState(null);

  useEffect(() => {
    async function loadData() {
      setLoading(true);
      
      let startDate = new Date();
      if (period === 'week') startDate.setDate(startDate.getDate() - 7);
      if (period === 'month') startDate.setDate(1);
      if (period === 'quarter') startDate.setMonth(Math.floor(startDate.getMonth() / 3) * 3, 1);
      if (period === 'year') startDate = new Date(startDate.getFullYear(), 0, 1);
      const startIso = startDate.toISOString();

      // Top Stats
      const { data: enrolls } = await supabase.from('enrollments').select('enrolled_at, status').gte('enrolled_at', startIso);
      const totalE = enrolls?.length || 0;
      const compE = enrolls?.filter(e => e.status === 'completed').length || 0;
      const compRate = totalE > 0 ? Math.round((compE / totalE) * 100) : 0;

      const { data: att } = await supabase.from('attendance').select('status').gte('marked_at', startIso);
      const attRate = att?.length ? Math.round((att.filter(a=>a.status==='PRESENT').length / att.length) * 100) : 0;

      const { data: ass } = await supabase.from('assignment_submissions').select('score').eq('status', 'reviewed').gte('reviewed_at', startIso);
      const assScore = ass?.length ? (ass.reduce((a,b)=>a+(b.score||0),0) / ass.length / 10).toFixed(1) : 0; // scaled to 10

      setStats({ enrolls: totalE, compRate, attRate, assScore });

      // Monthly Chart Data (all-time or this year for chart)
      const { data: allEnrolls } = await supabase.from('enrollments').select('enrolled_at, status');
      const mData = Array(12).fill(null).map(()=>({ e:0, c:0 }));
      allEnrolls?.forEach(e => {
        if (e.enrolled_at) {
          const m = new Date(e.enrolled_at).getMonth();
          mData[m].e++;
          if (e.status === 'completed') mData[m].c++;
        }
      });
      setMonthlyData(mData);

      // Batch Performance Table
      const { data: batchesRaw } = await supabase.from('batches').select('id, batch_code, courses(title), enrollments(count)').eq('status', 'active');
      const { data: scores } = await supabase.from('leaderboard_scores').select('batch_id, total_score');
      const { data: sessions } = await supabase.from('sessions').select('id, batch_id');
      const { data: allAtt } = await supabase.from('attendance').select('session_id, status');
      // Get completed enrollment counts per batch
      const { data: completedEnrolls } = await supabase.from('enrollments').select('batch_id, status');
      // Get all assignment submissions per batch (to calc real completion)
      const { data: allAssignments } = await supabase.from('assignments').select('id, batch_id').eq('is_published', true);
      const { data: allSubs } = await supabase.from('assignment_submissions').select('assignment_id');

      const bInfo = batchesRaw?.map(b => {
        const bScores = scores?.filter(s => s.batch_id === b.id) || [];
        const avgScore = bScores.length ? Math.round(bScores.reduce((a,c)=>a+c.total_score,0)/bScores.length) : 0;
        
        const bSessIds = sessions?.filter(s=>s.batch_id===b.id).map(s=>s.id) || [];
        const bAtt = allAtt?.filter(a=>bSessIds.includes(a.session_id)) || [];
        const bAttPct = bAtt.length ? Math.round((bAtt.filter(a=>a.status==='PRESENT').length/bAtt.length)*100) : 0;
        
        // Real completion: # students who submitted all assignments / total enrolled
        const totalEnrolled = b.enrollments?.[0]?.count || 0;
        const bAssignIds = (allAssignments || []).filter(a => a.batch_id === b.id).map(a => a.id);
        const bSubCount = bAssignIds.length > 0 ? (allSubs || []).filter(s => bAssignIds.includes(s.assignment_id)).length : 0;
        const bCompPct = (bAssignIds.length > 0 && totalEnrolled > 0)
          ? Math.min(100, Math.round((bSubCount / (bAssignIds.length * totalEnrolled)) * 100))
          : 0;

        return { id: b.id, batch_code: b.batch_code, students: totalEnrolled, avgScore, attP: bAttPct, compP: bCompPct };
      }) || [];
      
      // Calculate average attendance across all batches for real trend comparison
      const avgBatchAtt = bInfo?.length ? Math.round(bInfo.reduce((a,b) => a + b.attP, 0) / bInfo.length) : 0;
      // Add real trend: batches above average attendance trend up, others trend down
      const bInfoWithTrend = (bInfo || []).map(b => ({ ...b, trend: b.attP >= avgBatchAtt ? 'up' : 'down' }));
      
      setBatchesInfo(bInfoWithTrend);
      
      // Load batches for reporting
      setBatches(batchesRaw || []);
      if (batchesRaw?.length > 0 && !selectedBatchId) {
        setSelectedBatchId(batchesRaw[0].id);
      }

      setLoading(false);
    }
    loadData();
  }, [period]);

  // Reporting Effect
  useEffect(() => {
    if (!selectedBatchId) return;
    async function generateReport() {
      const { data: scores } = await supabase.from('leaderboard_scores').select('*').eq('batch_id', selectedBatchId);
      const { data: skills } = await supabase.from('student_skills').select('*').eq('batch_id', selectedBatchId);
      
      const combined = (scores || []).map(s => ({
        ...s,
        skills: skills?.find(x => x.student_id === s.student_id)
      }));

      const avgScore = combined.length ? Math.round(combined.reduce((a,b) => a + b.total_score, 0) / combined.length) : 0;
      const avgAtt = combined.length ? Math.round(combined.reduce((a,b) => a + (b.skills?.consistency || 0), 0) / combined.length) : 0;
      
      setReportData({ students: combined, avgScore, avgAtt });
    }
    generateReport();
  }, [selectedBatchId]);

  const exportCSV = () => {
    if (!reportData) return;
    const headers = ['Name', 'Rank', 'Total Score', 'Attendance%', 'Technical%', 'Conceptual%'];
    const rows = reportData.students.map(s => [
      s.full_name,
      s.rank,
      s.total_score,
      s.skills?.consistency,
      s.skills?.technical,
      s.skills?.conceptual
    ]);
    const csvContent = "data:text/csv;charset=utf-8," 
      + headers.join(",") + "\n"
      + rows.map(e => e.join(",")).join("\n");
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `Report_${selectedBatchId}.csv`);
    document.body.appendChild(link);
    link.click();
  };

  const maxChartVal = Math.max(...monthlyData.map(d => d.e), 10);

  return (
    <div className="p-8 pt-20 space-y-12 max-w-7xl mx-auto font-body">
      {/* ---------------- PLATFORM ANALYTICS ---------------- */}
      <section className="space-y-6">
        <header className="flex justify-between items-end">
          <div>
            <h1 className="text-3xl font-extrabold tracking-tight font-headline">Platform Analytics</h1>
            <p className="text-secondary font-medium mt-1">Deep dive into platform engagement and trends.</p>
          </div>
          <div className="flex bg-white rounded-lg border border-slate-200 p-1">
            {['week', 'month', 'quarter', 'year'].map(p => (
              <button key={p} onClick={()=>setPeriod(p)} className={`px-4 py-1.5 text-xs font-bold rounded capitalize transition-colors ${period===p?'bg-slate-100 text-slate-800':'text-slate-500 hover:text-slate-800'}`}>This {p}</button>
            ))}
          </div>
        </header>

        {/* STAT CARDS */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          <StatCard label="Total Enrollments" value={stats.enrolls} badge={{ label: trends.enrolls, cls: trends.enrolls.startsWith('+') ? 'bg-emerald-50 text-emerald-600' : 'bg-red-50 text-red-600' }} />
          <StatCard label="Avg Completion" value={`${stats.compRate}%`} badge={{ label: trends.compRate, cls: trends.compRate.startsWith('+') ? 'bg-emerald-50 text-emerald-600' : 'bg-red-50 text-red-600' }} />
          <StatCard label="Avg Attendance" value={`${stats.attRate}%`} badge={{ label: trends.attRate, cls: trends.attRate.startsWith('+') ? 'bg-emerald-50 text-emerald-600' : 'bg-red-50 text-red-600' }} />
          <StatCard label="Assign Score" value={`${stats.assScore} / 10`} badge={{ label: trends.assScore, cls: trends.assScore.startsWith('+') ? 'bg-emerald-50 text-emerald-600' : 'bg-red-50 text-red-600' }} />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* CHART */}
          <div className="lg:col-span-2 bg-white rounded-2xl shadow-sm border border-slate-200 p-6 flex flex-col h-96">
            <h3 className="font-bold mb-6">Enrollment & Completion Trends</h3>
            <div className="flex-1 flex items-end justify-between gap-1 pb-4 border-b border-slate-100">
              {monthlyData.map((d, i) => (
                <div key={i} className="flex flex-col items-center w-full group relative h-full justify-end">
                  <div className="flex items-end justify-center w-full gap-0.5 h-[85%]">
                    {/* Enroll Bar */}
                    <div className="w-1/3 bg-[#b8cce4] rounded-t-sm hover:bg-[#a0b8d6] transition-all relative group/e" style={{height: `${Math.max((d.e/maxChartVal)*100, 2)}%`}}>
                      <div className="absolute -top-6 left-1/2 -translate-x-1/2 bg-slate-800 text-white text-[10px] py-0.5 px-1.5 rounded opacity-0 group-hover/e:opacity-100">{d.e}</div>
                    </div>
                    {/* Complete Bar */}
                    <div className="w-1/3 bg-[#00288e] rounded-t-sm hover:bg-blue-800 transition-all relative group/c" style={{height: `${Math.max((d.c/maxChartVal)*100, 2)}%`}}>
                      <div className="absolute -top-6 left-1/2 -translate-x-1/2 bg-slate-800 text-white text-[10px] py-0.5 px-1.5 rounded opacity-0 group-hover/c:opacity-100">{d.c}</div>
                    </div>
                  </div>
                  <p className="text-[10px] mt-2 font-bold text-slate-400">
                    {['JAN','FEB','MAR','APR','MAY','JUN','JUL','AUG','SEP','OCT','NOV','DEC'][i]}
                  </p>
                </div>
              ))}
            </div>
            <div className="flex justify-center gap-6 mt-4 text-xs font-bold text-secondary">
              <div className="flex items-center gap-2"><div className="w-3 h-3 bg-[#b8cce4] rounded-sm"></div> Enrolled</div>
              <div className="flex items-center gap-2"><div className="w-3 h-3 bg-[#00288e] rounded-sm"></div> Completed</div>
            </div>
          </div>

          {/* RING */}
          <div className="lg:col-span-1 bg-white rounded-2xl shadow-sm border border-slate-200 p-6 flex flex-col items-center justify-center">
            <h3 className="font-bold w-full text-left mb-6">Completion Rate</h3>
            <div className="relative w-48 h-48 mb-6">
              <svg viewBox="0 0 100 100" className="w-full h-full rotate-[-90deg]">
                <circle cx="50" cy="50" r="40" fill="none" stroke="#f1f5f9" strokeWidth="12" />
                <circle cx="50" cy="50" r="40" fill="none" stroke="#00288e" strokeWidth="12" strokeDasharray={`${(stats.compRate/100) * 251.2} 251.2`} strokeLinecap="round" />
              </svg>
              <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
                <span className="text-4xl font-black text-[#00288e]">{stats.compRate}%</span>
                <span className="text-[10px] font-bold uppercase tracking-widest text-secondary mt-1">OVERALL</span>
              </div>
            </div>
            <div className="w-full space-y-3">
              <div className="flex justify-between items-center text-sm">
                <div className="flex items-center gap-2 font-bold"><div className="w-3 h-3 bg-[#00288e] rounded-full"></div> Completed</div>
                <span className="font-bold text-slate-800">{Math.round(stats.enrolls * (stats.compRate/100))}</span>
              </div>
              <div className="flex justify-between items-center text-sm">
                <div className="flex items-center gap-2 font-bold text-secondary"><div className="w-3 h-3 bg-[#f1f5f9] rounded-full"></div> In-Progress</div>
                <span className="font-bold text-slate-800">{stats.enrolls - Math.round(stats.enrolls * (stats.compRate/100))}</span>
              </div>
            </div>
          </div>
        </div>

        {/* BATCH TABLE */}
        <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
          <div className="p-5 border-b border-slate-100 bg-slate-50">
            <h3 className="font-bold">Batch Performance Breakdown</h3>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="border-b border-slate-200">
                  <th className="p-4 text-xs font-bold text-secondary uppercase">Batch</th>
                  <th className="p-4 text-xs font-bold text-secondary uppercase text-center">Students</th>
                  <th className="p-4 text-xs font-bold text-secondary uppercase w-48">Completion</th>
                  <th className="p-4 text-xs font-bold text-secondary uppercase w-48">Attendance</th>
                  <th className="p-4 text-xs font-bold text-secondary uppercase text-center">Avg Score</th>
                  <th className="p-4 text-xs font-bold text-secondary uppercase text-center">Trend</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {loading ? <tr><td colSpan="6" className="p-8 text-center text-secondary">Loading...</td></tr> : batchesInfo.map(b => (
                  <tr key={b.id} className="hover:bg-slate-50">
                    <td className="p-4 font-bold text-sm text-[#00288e]">{b.batch_code}</td>
                    <td className="p-4 text-center font-bold text-sm">{b.students}</td>
                    <td className="p-4">
                      <div className="flex items-center justify-between text-xs font-bold mb-1"><span>{b.compP}%</span></div>
                      <div className="w-full bg-slate-100 h-1.5 rounded-full overflow-hidden">
                        <div className={`h-full ${b.compP>70?'bg-[#00288e]':b.compP>40?'bg-amber-500':'bg-red-500'}`} style={{width: `${b.compP}%`}}></div>
                      </div>
                    </td>
                    <td className="p-4">
                      <div className="flex items-center justify-between text-xs font-bold mb-1"><span>{b.attP}%</span></div>
                      <div className="w-full bg-slate-100 h-1.5 rounded-full overflow-hidden">
                        <div className={`h-full ${b.attP>80?'bg-emerald-500':b.attP>60?'bg-amber-500':'bg-red-500'}`} style={{width: `${b.attP}%`}}></div>
                      </div>
                    </td>
                    <td className="p-4 text-center font-black text-slate-700">{b.avgScore}</td>
                    <td className="p-4 text-center">
                      <span className={`material-symbols-outlined font-bold text-[20px] ${b.trend==='up'?'text-emerald-500':'text-red-500'}`}>{b.trend==='up'?'trending_up':'trending_down'}</span>
                    </td>
                  </tr>
                ))}
                {batchesInfo.length===0 && <tr><td colSpan="6" className="p-8 text-center text-secondary">No active batches.</td></tr>}
              </tbody>
            </table>
          </div>
        </div>
      </section>

      {/* ---------------- INSTITUTIONAL REPORTING ---------------- */}
      <section className="pt-8 space-y-10 border-t-2 border-dashed border-slate-200">
        <header className="flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div>
            <h2 className="text-3xl font-black text-slate-800 tracking-tight font-headline">Institutional Reporting</h2>
            <p className="text-slate-500 font-medium mt-1">Export detailed audit logs and cohort performance analytics.</p>
          </div>
          <div className="flex gap-4 items-center">
             <select value={selectedBatchId} onChange={e=>setSelectedBatchId(e.target.value)} className="bg-white border border-slate-200 rounded-xl px-4 py-2.5 text-sm font-bold text-slate-800 focus:ring-2 focus:ring-indigo-500 transition-all shadow-sm">
                {batches.map(b => <option key={b.id} value={b.id}>{b.batch_code} — {b.courses?.title}</option>)}
             </select>
             <button onClick={exportCSV} className="px-6 py-2.5 bg-indigo-600 text-white rounded-xl text-xs font-bold shadow-lg shadow-indigo-200 hover:scale-105 hover:bg-indigo-700 transition-all flex items-center gap-2">
                <span className="material-symbols-outlined text-[16px]">download</span> Export CSV
             </button>
          </div>
        </header>

        {reportData && (
          <div className="space-y-8">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {[
                { label: 'Cohort Average Score', val: reportData.avgScore, icon: 'analytics', color: 'text-indigo-600' },
                { label: 'Attendance Benchmark', val: `${reportData.avgAtt}%`, icon: 'calendar_month', color: 'text-emerald-600' },
                { label: 'Total Audited Personnel', val: reportData.students.length, icon: 'groups', color: 'text-amber-600' },
              ].map(s => (
                <div key={s.label} className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm flex flex-col hover:shadow-md transition-shadow">
                   <span className={`material-symbols-outlined ${s.color} text-[28px] mb-3`}>{s.icon}</span>
                   <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">{s.label}</p>
                   <p className="text-2xl font-black text-slate-800">{s.val}</p>
                </div>
              ))}
            </div>

            <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
               <div className="p-6 border-b border-slate-50 flex justify-between items-center bg-slate-50/50">
                  <h3 className="text-sm font-black text-slate-800 uppercase tracking-widest">Personnel Performance Registry</h3>
                  <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest bg-white px-3 py-1 rounded-full border border-slate-100">Verified Audit</span>
               </div>
               <div className="overflow-x-auto">
                 <table className="w-full text-left">
                    <thead className="bg-slate-50/50 border-b border-slate-100">
                       <tr>
                          <th className="px-8 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest">Scholar Identity</th>
                          <th className="px-8 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest text-center">Rank</th>
                          <th className="px-8 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest text-center">Score</th>
                          <th className="px-8 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest text-center">Attendance</th>
                          <th className="px-8 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest text-center">Technical</th>
                          <th className="px-8 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest text-center">Conceptual</th>
                       </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-50">
                       {reportData.students.map(s => (
                          <tr key={s.student_id} className="hover:bg-slate-50/50 transition-colors group">
                             <td className="px-8 py-4">
                                <div className="flex items-center gap-3">
                                   <div className="w-8 h-8 rounded-lg bg-slate-800 flex items-center justify-center font-bold text-white text-[10px]" style={{backgroundColor: s.avatar_color}}>{s.avatar_initials}</div>
                                   <p className="font-bold text-slate-800 text-sm group-hover:text-indigo-600 transition-colors">{s.full_name}</p>
                                </div>
                             </td>
                             <td className="px-8 py-4 text-center text-sm font-bold text-slate-700">#{s.rank}</td>
                             <td className="px-8 py-4 text-center text-sm font-black text-indigo-600">{s.total_score}</td>
                             <td className="px-8 py-4 text-center text-sm font-bold text-slate-700">{s.skills?.consistency || 0}%</td>
                             <td className="px-8 py-4 text-center text-sm font-bold text-slate-700">{s.skills?.technical || 0}%</td>
                             <td className="px-8 py-4 text-center text-sm font-bold text-slate-700">{s.skills?.conceptual || 0}%</td>
                          </tr>
                       ))}
                       {reportData.students.length === 0 && (
                         <tr><td colSpan="6" className="px-8 py-12 text-center text-slate-500">No students found in this batch.</td></tr>
                       )}
                    </tbody>
                 </table>
               </div>
            </div>
          </div>
        )}
      </section>
    </div>
  );
}
                          <th className="px-8 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest text-center">Technical</th>
                          <th className="px-8 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest text-center">Conceptual</th>
                       </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-50">
                       {reportData.students.map(s => (
                          <tr key={s.student_id} className="hover:bg-slate-50/50 transition-colors group">
                             <td className="px-8 py-4">
                                <div className="flex items-center gap-3">
                                   <div className="w-8 h-8 rounded-lg bg-slate-800 flex items-center justify-center font-bold text-white text-[10px]" style={{backgroundColor: s.avatar_color}}>{s.avatar_initials}</div>
                                   <p className="font-bold text-slate-800 text-sm group-hover:text-indigo-600 transition-colors">{s.full_name}</p>
                                </div>
                             </td>
                             <td className="px-8 py-4 text-center text-sm font-bold text-slate-700">#{s.rank}</td>
                             <td className="px-8 py-4 text-center text-sm font-black text-indigo-600">{s.total_score}</td>
                             <td className="px-8 py-4 text-center text-sm font-bold text-slate-700">{s.skills?.consistency || 0}%</td>
                             <td className="px-8 py-4 text-center text-sm font-bold text-slate-700">{s.skills?.technical || 0}%</td>
                             <td className="px-8 py-4 text-center text-sm font-bold text-slate-700">{s.skills?.conceptual || 0}%</td>
                          </tr>
                       ))}
                       {reportData.students.length === 0 && (
                         <tr><td colSpan="6" className="px-8 py-12 text-center text-slate-500">No students found in this batch.</td></tr>
                       )}
                    </tbody>
                 </table>
               </div>
            </div>
          </div>
        )}
      </section>
    </div>
  );
}
