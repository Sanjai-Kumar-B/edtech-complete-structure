import { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { supabase } from '@junospace/supabase-client';

export function GlobalAttendance() {
  const { profile } = useAuth();
  
  const [batches, setBatches] = useState([]);
  const [sessions, setSessions] = useState([]);
  
  const [selectedBatchId, setSelectedBatchId] = useState('');
  const [selectedSessionId, setSelectedSessionId] = useState('');
  
  const [students, setStudents] = useState([]);
  const [attendanceState, setAttendanceState] = useState({}); // { student_id: status }
  
  const [loadingBatches, setLoadingBatches] = useState(true);
  const [loadingData, setLoadingData] = useState(false);
  const [saving, setSaving] = useState(false);
  const [toast, setToast] = useState('');

  useEffect(() => {
    async function loadBatches() {
      if (!profile) return;
      const { data } = await supabase.from('batches').select('id, batch_code, courses(title)').eq('instructor_id', profile.id).eq('status', 'active');
      setBatches(data || []);
      if (data && data.length > 0) setSelectedBatchId(data[0].id);
      setLoadingBatches(false);
    }
    loadBatches();
  }, [profile]);

  useEffect(() => {
    async function loadSessions() {
      if (!selectedBatchId) { setSessions([]); setSelectedSessionId(''); return; }
      const { data } = await supabase.from('sessions').select('id, title, session_date').eq('batch_id', selectedBatchId).order('session_date', { ascending: false });
      setSessions(data || []);
      if (data && data.length > 0) setSelectedSessionId(data[0].id);
      else setSelectedSessionId('');
    }
    loadSessions();
  }, [selectedBatchId]);

  useEffect(() => {
    async function loadAttendanceData() {
      if (!selectedBatchId || !selectedSessionId) { setStudents([]); setAttendanceState({}); return; }
      setLoadingData(true);
      
      const { data: enrolled } = await supabase.from('enrollments').select('student_id, users(full_name, email, avatar_initials)').eq('batch_id', selectedBatchId).eq('status', 'active');
      const { data: existing } = await supabase.from('attendance').select('*').eq('session_id', selectedSessionId);
      
      const stData = enrolled?.map(e => ({
        id: e.student_id,
        name: e.users?.full_name,
        email: e.users?.email,
        initials: e.users?.avatar_initials || '?'
      })) || [];
      
      setStudents(stData);
      
      const stateObj = {};
      stData.forEach(s => {
        const rec = existing?.find(x => x.student_id === s.id);
        stateObj[s.id] = rec ? rec.status : 'UNMARKED';
      });
      setAttendanceState(stateObj);
      
      setLoadingData(false);
    }
    loadAttendanceData();
  }, [selectedBatchId, selectedSessionId]);

  const toggleStatus = (studentId) => {
    setAttendanceState(prev => {
      const curr = prev[studentId];
      let next = 'PRESENT';
      if (curr === 'UNMARKED') next = 'PRESENT';
      else if (curr === 'PRESENT') next = 'ABSENT';
      else if (curr === 'ABSENT') next = 'LATE';
      else if (curr === 'LATE') next = 'PRESENT';
      return { ...prev, [studentId]: next };
    });
  };

  const markAll = (status) => {
    const newState = {};
    students.forEach(s => newState[s.id] = status);
    setAttendanceState(newState);
  };

  const handleSave = async () => {
    if (!selectedSessionId) return;
    setSaving(true);
    
    const records = Object.entries(attendanceState).filter(([sid, status]) => status !== 'UNMARKED').map(([sid, status]) => ({
      session_id: selectedSessionId,
      student_id: sid,
      status: status,
      marked_by: profile.id,
      marked_at: new Date().toISOString()
    }));
    
    if (records.length > 0) {
      const { error } = await supabase.from('attendance').upsert(records, { onConflict: 'session_id,student_id' });
      if (!error) {
        setToast('Attendance saved successfully.');
        setTimeout(() => setToast(''), 3000);
      } else {
        alert(error.message);
      }
    }
    setSaving(false);
  };

  const counts = { PRESENT: 0, ABSENT: 0, LATE: 0, UNMARKED: 0 };
  Object.values(attendanceState).forEach(st => counts[st]++);

  if (loadingBatches) return <div className="p-8 pt-20">Loading...</div>;

  return (
    <div className="pt-20 p-8 space-y-6 max-w-6xl mx-auto">
      <header>
        <h1 className="text-3xl font-extrabold tracking-tight">Attendance</h1>
        <p className="text-secondary font-medium mt-1">Record and manage session attendance.</p>
      </header>

      {/* FILTERS */}
      <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200 grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block text-xs font-bold text-secondary uppercase mb-2">Select Batch</label>
          <select value={selectedBatchId} onChange={e=>setSelectedBatchId(e.target.value)} className="w-full p-3 rounded-xl border border-slate-300 font-bold focus:ring-2 focus:ring-indigo-500">
            {batches.map(b => <option key={b.id} value={b.id}>{b.batch_code} • {b.courses?.title}</option>)}
            {batches.length===0 && <option value="">No batches found</option>}
          </select>
        </div>
        <div>
          <label className="block text-xs font-bold text-secondary uppercase mb-2">Select Session</label>
          <select value={selectedSessionId} onChange={e=>setSelectedSessionId(e.target.value)} className="w-full p-3 rounded-xl border border-slate-300 font-bold focus:ring-2 focus:ring-indigo-500" disabled={!selectedBatchId}>
            {sessions.map(s => <option key={s.id} value={s.id}>{s.title} ({s.session_date})</option>)}
            {sessions.length===0 && <option value="">No sessions found</option>}
          </select>
        </div>
      </div>

      {!selectedBatchId || !selectedSessionId ? (
        <div className="text-center p-12 text-secondary bg-slate-50 rounded-2xl border border-dashed border-slate-300">
          Select a batch and session to view students.
        </div>
      ) : loadingData ? (
        <div className="text-center p-12">Loading students...</div>
      ) : (
        <>
          {/* STATS */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm text-center">
              <p className="text-[10px] uppercase font-bold text-emerald-600 mb-1">Present</p>
              <p className="text-3xl font-black text-emerald-700">{counts.PRESENT}</p>
            </div>
            <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm text-center">
              <p className="text-[10px] uppercase font-bold text-amber-600 mb-1">Late</p>
              <p className="text-3xl font-black text-amber-700">{counts.LATE}</p>
            </div>
            <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm text-center">
              <p className="text-[10px] uppercase font-bold text-red-600 mb-1">Absent</p>
              <p className="text-3xl font-black text-red-700">{counts.ABSENT}</p>
            </div>
            <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm text-center">
              <p className="text-[10px] uppercase font-bold text-slate-400 mb-1">Unmarked</p>
              <p className="text-3xl font-black text-slate-500">{counts.UNMARKED}</p>
            </div>
          </div>

          {/* BULK ACTIONS */}
          <div className="flex gap-2 justify-end">
            <button onClick={()=>markAll('PRESENT')} className="px-4 py-2 text-xs font-bold rounded bg-emerald-50 text-emerald-700 hover:bg-emerald-100 border border-emerald-200">Mark All Present</button>
            <button onClick={()=>markAll('UNMARKED')} className="px-4 py-2 text-xs font-bold rounded bg-slate-50 text-slate-600 hover:bg-slate-100 border border-slate-200">Reset All</button>
          </div>

          {/* LIST */}
          <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
            <div className="divide-y divide-slate-100">
              {students.map(st => {
                const status = attendanceState[st.id];
                const btnClass = 
                  status === 'PRESENT' ? 'bg-emerald-100 text-emerald-700 border-emerald-300' :
                  status === 'ABSENT' ? 'bg-red-100 text-red-700 border-red-300' :
                  status === 'LATE' ? 'bg-amber-100 text-amber-700 border-amber-300' :
                  'bg-slate-50 text-slate-400 border-slate-200 border-dashed hover:border-solid hover:bg-slate-100';

                return (
                  <div key={st.id} className="p-4 flex items-center justify-between hover:bg-slate-50 transition-colors">
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 rounded-full bg-slate-200 flex items-center justify-center font-bold text-slate-500 shrink-0">
                        {st.initials}
                      </div>
                      <div>
                        <p className="font-bold text-sm">{st.name}</p>
                        <p className="text-xs text-secondary">{st.email}</p>
                      </div>
                    </div>
                    <button onClick={()=>toggleStatus(st.id)} className={`px-4 py-2 min-w-[120px] rounded-lg font-bold text-xs uppercase border transition-all active:scale-95 ${btnClass}`}>
                      {status}
                    </button>
                  </div>
                )
              })}
              {students.length===0 && <div className="p-8 text-center text-secondary">No active students in this batch.</div>}
            </div>
          </div>

          {/* SAVE */}
          <div className="flex items-center justify-between sticky bottom-4 bg-white/90 backdrop-blur p-4 rounded-2xl border border-slate-200 shadow-lg">
            <div>
              {toast && <span className="bg-emerald-100 text-emerald-700 px-4 py-2 rounded-lg text-sm font-bold animate-pulse">{toast}</span>}
            </div>
            <button onClick={handleSave} disabled={saving} className="bg-indigo-600 text-white px-8 py-3 rounded-xl font-bold hover:bg-indigo-700 disabled:opacity-50">
              {saving ? 'Saving...' : 'Save Attendance'}
            </button>
          </div>
        </>
      )}
    </div>
  );
}
