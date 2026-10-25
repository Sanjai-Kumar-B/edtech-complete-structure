import { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { supabase } from '@junospace/supabase-client';
import { Link } from 'react-router-dom';

export function StudentsGlobalList() {
  const { profile } = useAuth();
  
  const [loading, setLoading] = useState(true);
  const [batches, setBatches] = useState([]);
  const [students, setStudents] = useState([]); // all raw data
  
  const [selectedTab, setSelectedTab] = useState('ALL');

  useEffect(() => {
    async function loadData() {
      if (!profile) return;
      
      const { data: myBatches } = await supabase.from('batches').select('id, batch_code').eq('instructor_id', profile.id).eq('status', 'active');
      setBatches(myBatches || []);
      const batchIds = myBatches?.map(b => b.id) || [];
      
      if (batchIds.length > 0) {
        // enrollments
        const { data: enrolled } = await supabase.from('enrollments').select('batch_id, student_id, status, users(full_name, email, avatar_initials)').in('batch_id', batchIds);
        
        // stats
        const { data: attendance } = await supabase.from('attendance').select('student_id, session_id, status').in('session_id', (await supabase.from('sessions').select('id').in('batch_id', batchIds)).data?.map(s=>s.id)||[]);
        const { data: assignmentSubs } = await supabase.from('assignment_submissions').select('student_id, score, assignments(batch_id)').eq('status', 'reviewed').in('assignment_id', (await supabase.from('assignments').select('id').in('batch_id', batchIds)).data?.map(a=>a.id)||[]);
        const { data: scores } = await supabase.from('leaderboard_scores').select('student_id, batch_id, total_score').in('batch_id', batchIds);

        const stData = (enrolled || []).map(e => {
          // Att %
          const myAtt = attendance?.filter(a => a.student_id === e.student_id) || [];
          const attP = myAtt.length ? Math.round((myAtt.filter(a => a.status==='PRESENT').length / myAtt.length)*100) : 0;
          
          // Assign score
          const myAss = assignmentSubs?.filter(a => a.student_id === e.student_id && a.assignments.batch_id === e.batch_id) || [];
          const assScore = myAss.length ? Math.round(myAss.reduce((acc, a) => acc + (a.score||0), 0) / myAss.length) : 0;

          // Risk
          const totalS = scores?.find(s => s.student_id === e.student_id && s.batch_id === e.batch_id)?.total_score || 0;
          const riskLevel = totalS >= 70 ? 'LOW' : totalS >= 50 ? 'MEDIUM' : 'HIGH';

          return {
            id: e.student_id,
            name: e.users?.full_name,
            email: e.users?.email,
            initials: e.users?.avatar_initials || '?',
            batch_id: e.batch_id,
            batch_code: myBatches?.find(b => b.id === e.batch_id)?.batch_code || e.batch_id,
            attP,
            assScore,
            riskLevel,
            totalS
          };
        });
        
        setStudents(stData);
      }
      setLoading(false);
    }
    loadData();
  }, [profile]);

  const filtered = selectedTab === 'ALL' ? students : students.filter(s => s.batch_id === selectedTab);

  const avgAtt = filtered.length ? Math.round(filtered.reduce((acc, s) => acc + s.attP, 0) / filtered.length) : 0;
  const avgAss = filtered.length ? Math.round(filtered.reduce((acc, s) => acc + s.assScore, 0) / filtered.length) : 0;
  const riskCount = filtered.filter(s => s.riskLevel === 'HIGH').length;

  if (loading) return <div className="p-8 pt-20">Loading students...</div>;

  const riskColors = { LOW: 'bg-emerald-100 text-emerald-700', MEDIUM: 'bg-amber-100 text-amber-700', HIGH: 'bg-red-100 text-red-700' };

  return (
    <div className="pt-20 p-8 space-y-6">
      <header>
        <h1 className="text-3xl font-extrabold tracking-tight">Students</h1>
        <p className="text-secondary font-medium mt-1">Global view of all enrolled students across batches.</p>
      </header>

      {/* FILTER TABS */}
      <div className="flex flex-wrap gap-2">
        <button onClick={() => setSelectedTab('ALL')} className={`px-5 py-2 rounded-xl text-sm font-bold transition-colors ${selectedTab === 'ALL' ? 'bg-indigo-600 text-white' : 'bg-white text-slate-500 border border-slate-200 hover:bg-slate-50'}`}>All Batches</button>
        {batches.map(b => (
          <button key={b.id} onClick={() => setSelectedTab(b.id)} className={`px-5 py-2 rounded-xl text-sm font-bold transition-colors ${selectedTab === b.id ? 'bg-indigo-600 text-white' : 'bg-white text-slate-500 border border-slate-200 hover:bg-slate-50'}`}>{b.batch_code}</button>
        ))}
      </div>

      {/* STATS */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
          <p className="text-xs font-bold text-secondary uppercase mb-2">Total Students</p>
          <p className="text-3xl font-black">{filtered.length}</p>
        </div>
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
          <p className="text-xs font-bold text-secondary uppercase mb-2">Avg Attendance</p>
          <p className="text-3xl font-black">{avgAtt}%</p>
        </div>
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
          <p className="text-xs font-bold text-secondary uppercase mb-2">Avg Assign Score</p>
          <p className="text-3xl font-black">{avgAss}%</p>
        </div>
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
          <p className="text-xs font-bold text-red-500 uppercase mb-2">Students At Risk</p>
          <p className="text-3xl font-black text-red-600">{riskCount}</p>
        </div>
      </div>

      {/* TABLE */}
      <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead className="bg-slate-50 border-b border-slate-200">
              <tr>
                <th className="px-6 py-4 text-xs font-bold text-secondary uppercase">Student</th>
                <th className="px-6 py-4 text-xs font-bold text-secondary uppercase">Batch</th>
                <th className="px-6 py-4 text-xs font-bold text-secondary uppercase text-center">Attendance</th>
                <th className="px-6 py-4 text-xs font-bold text-secondary uppercase text-center">Assign Score</th>
                <th className="px-6 py-4 text-xs font-bold text-secondary uppercase text-center">Risk Level</th>
                <th className="px-6 py-4 text-xs font-bold text-secondary uppercase text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filtered.map(st => (
                <tr key={`${st.id}-${st.batch_id}`} className="hover:bg-slate-50">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-slate-200 flex items-center justify-center font-bold text-slate-500 text-xs shrink-0">{st.initials}</div>
                      <div>
                        <p className="font-bold text-sm">{st.name}</p>
                        <p className="text-xs text-secondary">{st.email}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-sm font-bold">{st.batch_code}</td>
                  <td className="px-6 py-4 text-center text-sm font-bold">{st.attP}%</td>
                  <td className="px-6 py-4 text-center text-sm font-bold">{st.assScore}%</td>
                  <td className="px-6 py-4 text-center">
                    <span className={`px-2 py-1 text-[10px] font-bold rounded-full ${riskColors[st.riskLevel]}`}>{st.riskLevel}</span>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <Link to={`/instructor/students/${st.id}?batch=${st.batch_id}`} className="text-indigo-600 hover:text-indigo-800 text-sm font-bold px-3 py-1.5 border border-indigo-200 rounded-lg hover:bg-indigo-50">View Details</Link>
                  </td>
                </tr>
              ))}
              {filtered.length === 0 && <tr><td colSpan="6" className="p-8 text-center text-secondary">No students found.</td></tr>}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
                  <td colSpan="4" className="p-20 text-center text-slate-400 font-bold">No students found.</td>
                </tr>
              ) : (
                filteredStudents.map(s => (
                  <tr key={s.id} className="hover:bg-slate-50/50">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div 
                          className="w-10 h-10 rounded-xl text-white font-bold text-xs flex items-center justify-center shadow-sm"
                          style={{ backgroundColor: s.color }}
                        >
                          {s.initials}
                        </div>
                        <div>
                          <p className="font-bold text-slate-800 text-sm leading-snug">{s.name}</p>
                          <p className="text-[10px] text-slate-400 font-semibold">{s.email}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className="font-mono text-sm font-bold text-slate-700 bg-slate-100 px-3 py-1 rounded-lg">
                        {s.batchesCount} {s.batchesCount === 1 ? 'Batch' : 'Batches'}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <span className="font-mono text-sm font-black text-indigo-600">{s.avgScore}%</span>
                        <div className="w-24 bg-slate-100 h-2 rounded-full overflow-hidden">
                          <div className="bg-indigo-500 h-full" style={{ width: `${s.avgScore}%` }} />
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <Link 
                        to={`/instructor/students/${s.id}`} 
                        className="px-4 py-2 bg-slate-900 text-white rounded-xl text-xs font-black hover:bg-slate-800 transition-all"
                      >
                        Write Notes & Details
                      </Link>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
