import { useEffect, useState } from 'react';
import { supabase } from '@junospace/supabase-client';
import { useParams, Link } from 'react-router-dom';

function CreateBatchModal({ show, courses, onClose, onSave }) {
  const [form, setForm] = useState({ batch_code: '', course_id: '', max_students: 50, start_date: '', end_date: '', schedule: '' });
  const [saving, setSaving] = useState(false);
  if (!show) return null;
  const handleSubmit = async (e) => {
    e.preventDefault(); setSaving(true);
    await onSave(form); setSaving(false);
  };
  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-md overflow-y-auto">
      <div className="bg-white rounded-[2.5rem] shadow-2xl w-full max-w-xl overflow-hidden my-8 animate-in zoom-in-95 duration-200">
        <div className="p-10 border-b border-slate-100 bg-slate-50/50 flex justify-between items-center">
          <div>
            <h2 className="text-2xl font-black text-slate-800">Establish Batch</h2>
            <p className="text-[10px] font-black text-secondary uppercase tracking-widest mt-1">Batch Deployment Unit</p>
          </div>
          <button onClick={onClose} className="w-10 h-10 rounded-full hover:bg-slate-200 transition-colors flex items-center justify-center"><span className="material-symbols-outlined text-secondary">close</span></button>
        </div>
        <form onSubmit={handleSubmit} className="p-10 space-y-8">
          <div className="grid grid-cols-2 gap-6">
            <div className="space-y-2">
               <label className="text-[10px] font-black text-secondary uppercase tracking-widest ml-1">Batch Code *</label>
               <input required placeholder="BATCH-2026-X" value={form.batch_code} onChange={e=>setForm({...form, batch_code: e.target.value})} className="w-full bg-slate-50 border-none rounded-2xl px-6 py-4 text-sm font-bold text-slate-800 focus:ring-4 focus:ring-indigo-500/10 transition-all" />
            </div>
            <div className="space-y-2">
              <label className="text-[10px] font-black text-secondary uppercase tracking-widest ml-1">Parent Curriculum *</label>
              <select required value={form.course_id} onChange={e=>setForm({...form, course_id: e.target.value})} className="w-full bg-slate-50 border-none rounded-2xl px-6 py-4 text-sm font-bold text-slate-800 focus:ring-4 focus:ring-indigo-500/10 transition-all">
                <option value="">Select Registry Item...</option>
                {courses.map(c => <option key={c.id} value={c.id}>{c.title}</option>)}
              </select>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-6">
            <div className="space-y-2"><label className="text-[10px] font-black text-secondary uppercase tracking-widest ml-1">Commencement *</label><input required type="date" value={form.start_date} onChange={e=>setForm({...form, start_date: e.target.value})} className="w-full bg-slate-50 border-none rounded-2xl px-6 py-4 text-sm font-bold text-slate-800 focus:ring-4 focus:ring-indigo-500/10 transition-all" /></div>
            <div className="space-y-2"><label className="text-[10px] font-black text-secondary uppercase tracking-widest ml-1">Completion (Est.)</label><input type="date" value={form.end_date} onChange={e=>setForm({...form, end_date: e.target.value})} className="w-full bg-slate-50 border-none rounded-2xl px-6 py-4 text-sm font-bold text-slate-800 focus:ring-4 focus:ring-indigo-500/10 transition-all" /></div>
          </div>
          <div className="grid grid-cols-2 gap-6">
            <div className="space-y-2"><label className="text-[10px] font-black text-secondary uppercase tracking-widest ml-1">Capacity *</label><input required type="number" min="1" value={form.max_students} onChange={e=>setForm({...form, max_students: parseInt(e.target.value)})} className="w-full bg-slate-50 border-none rounded-2xl px-6 py-4 text-sm font-bold text-slate-800 focus:ring-4 focus:ring-indigo-500/10 transition-all" /></div>
            <div className="space-y-2"><label className="text-[10px] font-black text-secondary uppercase tracking-widest ml-1">Standard Schedule *</label><input required placeholder="Mon/Wed/Fri 10AM" value={form.schedule} onChange={e=>setForm({...form, schedule: e.target.value})} className="w-full bg-slate-50 border-none rounded-2xl px-6 py-4 text-sm font-bold text-slate-800 focus:ring-4 focus:ring-indigo-500/10 transition-all" /></div>
          </div>
        </form>
        <div className="p-10 border-t border-slate-100 flex gap-6 bg-slate-50/30">
          <button type="button" onClick={onClose} className="flex-1 py-4 border-2 border-slate-200 rounded-2xl font-black text-secondary hover:bg-slate-100 transition-all text-[10px] uppercase tracking-widest">Cancel</button>
          <button onClick={handleSubmit} disabled={saving} className="flex-1 py-4 bg-slate-900 text-white rounded-2xl font-black shadow-xl hover:scale-[1.02] active:scale-95 transition-all text-[10px] uppercase tracking-widest">{saving ? 'Deploying...' : 'Activate Batch'}</button>
        </div>
      </div>
    </div>
  );
}

function AssignInstructorModal({ show, batch, instructors, onClose, onAssign }) {
  const [instId, setInstId] = useState('');
  if (!show) return null;
  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-md">
      <div className="bg-white rounded-[2.5rem] shadow-2xl w-full max-w-md overflow-hidden animate-in zoom-in-95 duration-200">
        <div className="p-10 border-b border-slate-100 bg-slate-50/50">
          <h3 className="text-xl font-black text-slate-800">Assign Authority</h3>
          <p className="text-[10px] font-black text-secondary uppercase tracking-widest mt-1">Batch {batch?.batch_code}</p>
        </div>
        <div className="p-10 space-y-8">
          <select value={instId} onChange={e=>setInstId(e.target.value)} className="w-full bg-slate-50 border-none rounded-2xl px-6 py-4 text-sm font-bold text-slate-800 focus:ring-4 focus:ring-indigo-500/10 transition-all">
            <option value="">Select Instructor...</option>
            {instructors.map(i => <option key={i.id} value={i.id}>{i.full_name}</option>)}
          </select>
          <div className="flex gap-4">
            <button onClick={onClose} className="flex-1 py-4 border-2 border-slate-200 rounded-2xl font-black text-secondary hover:bg-slate-100 transition-all text-[10px] uppercase tracking-widest">Cancel</button>
            <button onClick={()=>onAssign(instId)} disabled={!instId} className="flex-1 py-4 bg-indigo-600 text-white rounded-2xl font-black shadow-xl hover:scale-[1.02] active:scale-95 transition-all text-[10px] uppercase tracking-widest">Authorize</button>
          </div>
        </div>
      </div>
    </div>
  )
}

function AddStudentModal({ show, batchId, onClose, onEnroll }) {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState([]);
  const [searching, setSearching] = useState(false);
  useEffect(() => {
    if (!query) { setResults([]); return; }
    const t = setTimeout(async () => {
      setSearching(true);
      const { data } = await supabase.from('users').select('*').eq('role', 'student').or(`full_name.ilike.%${query}%,email.ilike.%${query}%`).limit(8);
      setResults(data||[]); setSearching(false);
    }, 400);
    return () => clearTimeout(t);
  }, [query]);
  if (!show) return null;
  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-md">
      <div className="bg-white rounded-[2.5rem] shadow-2xl w-full max-w-lg overflow-hidden flex flex-col h-[600px] animate-in zoom-in-95 duration-200">
        <div className="p-10 border-b border-slate-100 bg-slate-50/50 flex justify-between items-center">
          <div><h3 className="text-xl font-black text-slate-800">Enrollment Unit</h3><p className="text-[10px] font-black text-secondary uppercase tracking-widest mt-1">Add Student to Batch</p></div>
          <button onClick={onClose} className="w-10 h-10 rounded-full hover:bg-slate-200 transition-colors flex items-center justify-center"><span className="material-symbols-outlined text-secondary">close</span></button>
        </div>
        <div className="p-10 border-b border-slate-100 shrink-0">
          <div className="relative">
             <span className="material-symbols-outlined absolute left-5 top-1/2 -translate-y-1/2 text-slate-400">search</span>
             <input placeholder="Search identity or email..." value={query} onChange={e=>setQuery(e.target.value)} className="w-full bg-slate-50 border-none rounded-2xl pl-12 pr-6 py-4 text-sm font-bold text-slate-800 focus:ring-4 focus:ring-indigo-500/10 transition-all" />
          </div>
        </div>
        <div className="flex-1 overflow-y-auto p-6 space-y-4">
          {searching ? <p className="p-10 text-center text-xs font-black text-secondary uppercase tracking-widest animate-pulse">Searching Registry...</p> : results.map(u => (
            <div key={u.id} className="p-6 bg-slate-50 hover:bg-white hover:shadow-lg hover:ring-1 hover:ring-slate-100 rounded-3xl flex items-center justify-between transition-all group">
              <div className="flex items-center gap-4">
                 <div className="w-10 h-10 rounded-xl flex items-center justify-center font-black text-white text-xs" style={{backgroundColor: u.avatar_color}}>{u.full_name?.charAt(0)}</div>
                 <div><p className="font-black text-slate-800 text-sm">{u.full_name}</p><p className="text-[10px] text-secondary font-medium uppercase tracking-wider">{u.email}</p></div>
              </div>
              <button onClick={()=>onEnroll(u.id)} className="px-6 py-2.5 bg-indigo-600 text-white rounded-xl text-[10px] font-black uppercase tracking-widest hover:scale-105 transition-all shadow-lg shadow-indigo-600/10">Enroll</button>
            </div>
          ))}
          {!searching && query && results.length===0 && <p className="p-10 text-center text-xs font-black text-secondary uppercase tracking-widest">No matching identities found.</p>}
        </div>
      </div>
    </div>
  )
}

export function BatchesManagement() {
  const { batchId } = useParams();
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState(null);
  const [showCreate, setShowCreate] = useState(false);
  const [showAssign, setShowAssign] = useState(false);
  const [showAddStudent, setShowAddStudent] = useState(false);
  const [selectedBatch, setSelectedBatch] = useState(null);
  const [courses, setCourses] = useState([]);
  const [instructors, setInstructors] = useState([]);
  const [tab, setTab] = useState('STUDENTS');

  useEffect(() => {
    async function load() {
      setLoading(true);
      const { data: cs } = await supabase.from('courses').select('id, title').eq('status', 'active');
      setCourses(cs||[]);
      const { data: is } = await supabase.from('users').select('id, full_name').eq('role', 'instructor').eq('is_active', true);
      setInstructors(is||[]);

      if (!batchId) {
        const { data: batches } = await supabase.from('batches').select('*, courses(title, code), users!batches_instructor_id_fkey(full_name), enrollments(count)').order('created_at', { ascending: false });
        let totalStudents = 0; let activeBatches = 0; let instAssigned = new Set();
        batches?.forEach(b => {
          totalStudents += (b.enrollments?.[0]?.count||0);
          if (b.status === 'active') activeBatches++;
          if (b.instructor_id) instAssigned.add(b.instructor_id);
        });
        setData({ isDetail: false, batches: batches||[], totalStudents, activeBatches, instCount: instAssigned.size, weeklyContact: 42 });
      } else {
        const { data: batch } = await supabase.from('batches').select('*, courses(*), users!batches_instructor_id_fkey(*)').eq('id', batchId).single();
        const { data: enrollments } = await supabase.from('enrollments').select('*, users(*)').eq('batch_id', batchId);
        const { data: sessions } = await supabase.from('sessions').select('*').eq('batch_id', batchId);
        const { data: assignments } = await supabase.from('assignments').select('*').eq('batch_id', batchId);
        const { data: assessments } = await supabase.from('assessments').select('*').eq('batch_id', batchId);
        const { data: leaderboard } = await supabase.from('leaderboard_scores').select('*').eq('batch_id', batchId).order('rank');
        const { data: assignSubs } = await supabase.from('assignment_submissions').select('score, status, assignment_id, student_id').in('assignment_id', assignments?.map(a=>a.id)||[]);
        const { data: assessSubs } = await supabase.from('assessment_submissions').select('score, assessment_id, student_id').in('assessment_id', assessments?.map(a=>a.id)||[]);
        const { data: att } = await supabase.from('attendance').select('*').in('session_id', sessions?.map(s=>s.id)||[]);
        setData({ isDetail: true, batch, enrollments: enrollments||[], sessions: sessions||[], assignments: assignments||[], assessments: assessments||[], leaderboard: leaderboard||[], assignSubs: assignSubs||[], assessSubs: assessSubs||[], att: att||[] });
      }
      setLoading(false);
    }
    load();
  }, [batchId]);

  const handleCreateBatch = async (f) => {
    await supabase.from('batches').insert({ ...f, status: 'pending' });
    setShowCreate(false); window.location.reload();
  };

  const handleStatusUpdate = async (id, status) => {
    await supabase.from('batches').update({ status }).eq('id', id);
    window.location.reload();
  };

  const handleAssignInst = async (instId) => {
    await supabase.from('batches').update({ instructor_id: instId, status: 'active' }).eq('id', selectedBatch.id);
    setShowAssign(false); setSelectedBatch(null); window.location.reload();
  };

  const handleEnrollStudent = async (studentId) => {
    const { count } = await supabase.from('enrollments').select('id', { count: 'exact' }).eq('batch_id', batchId);
    if (count >= data.batch.max_students) return alert("Batch reached maximum capacity.");
    await supabase.from('enrollments').insert({ batch_id: batchId, student_id: studentId, status: 'active' });
    setShowAddStudent(false); window.location.reload();
  };

  if (loading) return <div className="p-8 pt-24 text-center font-black uppercase text-secondary tracking-widest text-[10px] animate-pulse">Syncing Batch Intelligence...</div>;

  if (!data.isDetail) {
    return (
      <div className="p-8 pt-24 space-y-10 max-w-[1600px] mx-auto animate-in fade-in duration-500">
        <CreateBatchModal show={showCreate} courses={courses} onClose={()=>setShowCreate(false)} onSave={handleCreateBatch} />
        <AssignInstructorModal show={showAssign} batch={selectedBatch} instructors={instructors} onClose={()=>{setShowAssign(false);setSelectedBatch(null);}} onAssign={handleAssignInst} />

        <header className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div>
            <h1 className="text-4xl font-black text-slate-800 tracking-tight leading-none">Batches</h1>
            <p className="text-secondary font-medium mt-3">Managing active learning units and instructional assignments.</p>
          </div>
          <button onClick={()=>setShowCreate(true)} className="px-8 py-3.5 bg-indigo-600 text-white rounded-2xl font-black text-xs uppercase tracking-widest hover:scale-105 transition-all flex items-center gap-2 shadow-xl shadow-indigo-600/20">
            <span className="material-symbols-outlined text-[20px]">add_circle</span> Establish Batch
          </button>
        </header>

        {/* METRICS */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          {[
            { label: 'Deployed Students', val: data.totalStudents, icon: 'groups', color: 'text-slate-800' },
            { label: 'Active Batches', val: data.activeBatches, icon: 'layers', color: 'text-emerald-600' },
            { label: 'Assigned Mentors', val: data.instCount, icon: 'psychology', color: 'text-indigo-600' },
            { label: 'Deployment Health', val: '94%', icon: 'monitoring', color: 'text-amber-600' },
          ].map(s => (
            <div key={s.label} className="bg-white p-8 rounded-[2rem] border border-slate-100 shadow-xl shadow-slate-200/50 text-center group hover:scale-[1.02] transition-transform">
              <span className={`material-symbols-outlined text-[32px] ${s.color} mb-3 group-hover:rotate-12 transition-transform`}>{s.icon}</span>
              <p className="text-[10px] font-black text-secondary uppercase tracking-[0.2em] mb-1">{s.label}</p>
              <p className="text-3xl font-black text-slate-800">{s.val}</p>
            </div>
          ))}
        </div>

        <div className="bg-white rounded-[2.5rem] shadow-xl shadow-slate-200/50 border border-slate-100 overflow-hidden">
          <table className="w-full text-left">
            <thead className="bg-slate-50/50 border-b border-slate-100">
              <tr>
                <th className="px-10 py-5 text-[10px] font-black text-secondary uppercase tracking-widest">Batch Identity</th>
                <th className="px-10 py-5 text-[10px] font-black text-secondary uppercase tracking-widest">Curriculum Node</th>
                <th className="px-10 py-5 text-[10px] font-black text-secondary uppercase tracking-widest">Authority Assigned</th>
                <th className="px-10 py-5 text-[10px] font-black text-secondary uppercase tracking-widest text-center">Occupation</th>
                <th className="px-10 py-5 text-[10px] font-black text-secondary uppercase tracking-widest">State</th>
                <th className="px-10 py-5 text-[10px] font-black text-secondary uppercase tracking-widest text-right">Ops</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {data.batches.map(b => (
                <tr key={b.id} className="group hover:bg-slate-50/50 transition-colors">
                  <td className="px-10 py-6 font-black text-slate-800 text-sm">
                    <div className="flex items-center gap-3">
                       <span className={`w-2 h-2 rounded-full ${b.status==='active'?'bg-emerald-500 shadow-[0_0_10px_rgba(16,185,129,0.5)]':'bg-amber-500'}`}></span>
                       <Link to={`/admin/batches/${b.id}`} className="hover:text-indigo-600 transition-colors">{b.batch_code}</Link>
                    </div>
                  </td>
                  <td className="px-10 py-6 text-xs font-bold text-secondary uppercase tracking-tight">{b.courses?.title}</td>
                  <td className="px-10 py-6 text-sm font-black text-slate-700">
                    {b.users ? <div className="flex items-center gap-2"><div className="w-6 h-6 rounded-lg bg-indigo-50 text-indigo-600 flex items-center justify-center text-[10px]">{b.users.full_name?.charAt(0)}</div>{b.users.full_name}</div> : <button onClick={()=>{setSelectedBatch(b);setShowAssign(true);}} className="text-indigo-600 hover:underline text-[10px] font-black uppercase tracking-widest bg-indigo-50 px-3 py-1.5 rounded-xl">Assign Mentor</button>}
                  </td>
                  <td className="px-10 py-6 text-sm font-black text-center text-slate-800">
                     <span className="text-indigo-600">{b.enrollments?.[0]?.count||0}</span> <span className="text-slate-300 mx-1">/</span> <span className="text-slate-400">{b.max_students}</span>
                  </td>
                  <td className="px-10 py-6"><span className={`px-4 py-1.5 rounded-xl text-[9px] font-black uppercase tracking-widest ${b.status==='active'?'bg-emerald-50 text-emerald-600 border border-emerald-100':'bg-slate-100 text-slate-500 border border-slate-200'}`}>{b.status}</span></td>
                  <td className="px-10 py-6 text-right">
                    <div className="flex items-center justify-end gap-3 opacity-0 group-hover:opacity-100 transition-opacity">
                      <Link to={`/admin/batches/${b.id}`} className="w-10 h-10 rounded-xl bg-slate-100 flex items-center justify-center text-slate-600 hover:bg-slate-900 hover:text-white transition-all"><span className="material-symbols-outlined text-[18px]">visibility</span></Link>
                      {b.status === 'active' && <button onClick={()=>handleStatusUpdate(b.id, 'inactive')} className="w-10 h-10 rounded-xl bg-red-50 text-red-500 flex items-center justify-center hover:bg-red-500 hover:text-white transition-all"><span className="material-symbols-outlined text-[18px]">power_settings_new</span></button>}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    );
  }

  // DETAIL VIEW
  const b = data.batch;
  const riskColors = { LOW: 'bg-emerald-50 text-emerald-600 border-emerald-100', MEDIUM: 'bg-amber-50 text-amber-600 border-amber-100', HIGH: 'bg-rose-50 text-rose-600 border-rose-100' };

  return (
    <div className="p-8 pt-24 space-y-10 max-w-[1600px] mx-auto animate-in fade-in duration-500">
      <AddStudentModal show={showAddStudent} batchId={batchId} onClose={()=>setShowAddStudent(false)} onEnroll={handleEnrollStudent} />
      
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="flex items-center gap-6">
          <Link to="/admin/batches" className="w-12 h-12 rounded-2xl bg-white border border-slate-200 flex items-center justify-center text-slate-400 hover:text-slate-800 transition-all shadow-sm"><span className="material-symbols-outlined">arrow_back</span></Link>
          <div>
             <h1 className="text-3xl font-black text-slate-800 tracking-tight leading-none">{b.batch_code}</h1>
             <p className="text-xs font-bold text-secondary uppercase tracking-widest mt-2">{b.courses?.title}</p>
          </div>
          <span className={`px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest ${b.status==='active'?'bg-emerald-50 text-emerald-600 border border-emerald-100':'bg-slate-100 text-slate-500 border border-slate-200'}`}>{b.status}</span>
        </div>
        <div className="flex gap-4">
           <button className="px-6 py-3 bg-white border border-slate-200 rounded-2xl text-[10px] font-black uppercase tracking-widest hover:bg-slate-50 transition-all">Audit Logs</button>
           <button onClick={()=>setShowAddStudent(true)} className="px-6 py-3 bg-indigo-600 text-white rounded-2xl text-[10px] font-black uppercase tracking-widest shadow-xl shadow-indigo-600/20 hover:scale-105 transition-all">+ Add Personnel</button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
        {[
          { l: 'Assigned Authority', v: b.users?.full_name || 'Restricted', i: 'verified_user' },
          { l: 'Instructional Cycle', v: b.schedule, i: 'event_repeat' },
          { l: 'Lifecycle Duration', v: `${b.start_date} → ${b.end_date||'TBD'}`, i: 'hourglass_empty' },
          { l: 'Enrollment Density', v: `${data.enrollments.length} / ${b.max_students}`, i: 'groups' },
        ].map(item => (
          <div key={item.l} className="bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-xl shadow-slate-200/50 group">
             <span className="material-symbols-outlined text-indigo-200 text-[24px] mb-3 group-hover:text-indigo-600 transition-colors">{item.i}</span>
             <p className="text-[9px] font-black text-secondary uppercase tracking-widest mb-1">{item.l}</p>
             <p className="text-sm font-black text-slate-800 truncate">{item.v}</p>
          </div>
        ))}
      </div>

      <div className="bg-white rounded-[2.5rem] shadow-xl shadow-slate-200/50 border border-slate-100 overflow-hidden">
        <div className="flex bg-slate-50/50 p-2 gap-2 border-b border-slate-100">
           {['STUDENTS', 'PROGRESS', 'PERFORMANCE'].map(t => (
             <button key={t} onClick={()=>setTab(t)} className={`flex-1 py-4 px-6 rounded-2xl text-xs font-black uppercase tracking-widest transition-all ${tab===t ? 'bg-white text-indigo-600 shadow-sm border border-slate-200/50':'text-slate-400 hover:text-slate-600'}`}>{t}</button>
           ))}
        </div>

        <div className="min-h-[500px]">
          {tab === 'STUDENTS' && (
            <div className="animate-in fade-in slide-in-from-bottom-2 duration-300">
              <table className="w-full text-left">
                <thead className="border-b border-slate-50">
                  <tr>
                    <th className="px-10 py-5 text-[9px] font-black text-secondary uppercase tracking-widest">Personnel Identity</th>
                    <th className="px-10 py-5 text-[9px] font-black text-secondary uppercase tracking-widest text-center">Engagement (Att)</th>
                    <th className="px-10 py-5 text-[9px] font-black text-secondary uppercase tracking-widest text-center">Submission Score</th>
                    <th className="px-10 py-5 text-[9px] font-black text-secondary uppercase tracking-widest text-center">Assessment Intel</th>
                    <th className="px-10 py-5 text-[9px] font-black text-secondary uppercase tracking-widest text-center">Retention Risk</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-50">
                  {data.enrollments.map(e => {
                    const sAtt = data.att.filter(a=>a.student_id===e.student_id);
                    const attP = sAtt.length ? Math.round((sAtt.filter(a=>a.status==='PRESENT').length/sAtt.length)*100):0;
                    const sAssign = data.assignSubs.filter(a=>a.student_id===e.student_id && a.status==='reviewed');
                    const assP = sAssign.length ? Math.round(sAssign.reduce((a,b)=>a+b.score,0)/sAssign.length):0;
                    const sAssess = data.assessSubs.filter(a=>a.student_id===e.student_id);
                    const asssP = sAssess.length ? Math.round(sAssess.reduce((a,b)=>a+b.score,0)/sAssess.length):0;
                    const risk = attP >= 80 && assP >= 70 ? 'LOW' : attP >= 60 ? 'MEDIUM' : 'HIGH';
                    return (
                      <tr key={e.id} className="hover:bg-slate-50/50 transition-colors group">
                        <td className="px-10 py-6">
                           <div className="flex items-center gap-4">
                              <div className="w-10 h-10 rounded-xl flex items-center justify-center font-black text-white text-xs shadow-sm" style={{backgroundColor: e.users?.avatar_color}}>{e.users?.full_name?.charAt(0)}</div>
                              <div><p className="font-black text-slate-800 text-sm group-hover:text-indigo-600 transition-colors">{e.users?.full_name}</p><p className="text-[10px] text-secondary font-medium uppercase tracking-wider">{e.users?.email}</p></div>
                           </div>
                        </td>
                        <td className="px-10 py-6 text-center text-sm font-black text-slate-800">{attP}%</td>
                        <td className="px-10 py-6 text-center text-sm font-black text-slate-800">{assP} <span className="text-[10px] text-slate-300">avg</span></td>
                        <td className="px-10 py-6 text-center text-sm font-black text-slate-800">{asssP} <span className="text-[10px] text-slate-300">iq</span></td>
                        <td className="px-10 py-6 text-center"><span className={`px-4 py-1 rounded-full text-[9px] font-black uppercase tracking-widest border ${riskColors[risk]}`}>{risk}</span></td>
                      </tr>
                    )
                  })}
                  {data.enrollments.length === 0 && <tr><td colSpan="5" className="p-20 text-center text-secondary font-black uppercase text-xs tracking-widest">No personnel enrolled in this batch.</td></tr>}
                </tbody>
              </table>
            </div>
          )}

          {tab === 'PROGRESS' && (
            <div className="p-12 space-y-12 animate-in fade-in slide-in-from-bottom-2 duration-300">
               <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
                  {[
                    { l: 'Instructional Hours', v: data.sessions.length, i: 'timer' },
                    { l: 'Modules Delivered', v: `${Math.round(data.sessions.length / 4)} Nodes`, i: 'account_tree' },
                    { l: 'Assignment Velocity', v: `${Math.round(data.assignSubs.filter(a=>a.status==='reviewed').length/data.assignSubs.length*100 || 0)}% Reviewed`, i: 'speed' },
                    { l: 'Resource Utilization', v: 'High', i: 'inventory_2' },
                  ].map(stat => (
                    <div key={stat.l} className="bg-slate-50/50 p-8 rounded-[2rem] border border-slate-100 flex flex-col items-center text-center">
                       <span className="material-symbols-outlined text-indigo-600 text-[28px] mb-3">{stat.i}</span>
                       <p className="text-[9px] font-black text-secondary uppercase tracking-widest mb-1">{stat.l}</p>
                       <p className="text-2xl font-black text-slate-800">{stat.v}</p>
                    </div>
                  ))}
               </div>
               
               <div className="space-y-6">
                  <h3 className="text-sm font-black text-slate-800 uppercase tracking-widest border-l-4 border-indigo-600 pl-4">Mentor Instruction Log</h3>
                  <div className="space-y-4">
                     {data.sessions.map((s, idx) => (
                        <div key={s.id} className="p-6 bg-white border border-slate-100 rounded-3xl flex items-center justify-between group hover:shadow-lg transition-all">
                           <div className="flex items-center gap-6">
                              <div className="w-12 h-12 rounded-2xl bg-slate-50 text-slate-400 flex items-center justify-center font-black text-xs">#{idx+1}</div>
                              <div>
                                 <p className="font-black text-slate-800 text-sm group-hover:text-indigo-600 transition-colors">{s.title}</p>
                                 <p className="text-[10px] text-secondary font-medium mt-1">{new Date(s.session_date).toLocaleDateString()} — {s.duration_minutes} Minutes</p>
                              </div>
                           </div>
                           <span className="px-4 py-1.5 bg-emerald-50 text-emerald-600 rounded-full text-[9px] font-black uppercase tracking-widest">Delivered</span>
                        </div>
                     ))}
                  </div>
               </div>
            </div>
          )}

          {tab === 'PERFORMANCE' && (
            <div className="p-12 grid grid-cols-1 lg:grid-cols-2 gap-12 animate-in fade-in slide-in-from-bottom-2 duration-300">
               <section className="space-y-8">
                  <h3 className="text-sm font-black text-slate-800 uppercase tracking-widest border-l-4 border-indigo-600 pl-4">Batch Leaderboard</h3>
                  <div className="space-y-3">
                     {data.leaderboard.map((l, i) => (
                        <div key={l.student_id} className="p-6 bg-white border border-slate-100 rounded-3xl flex items-center gap-4 group hover:ring-2 hover:ring-indigo-100 transition-all">
                           <div className={`w-10 h-10 rounded-xl flex items-center justify-center font-black text-sm ${i===0?'bg-amber-100 text-amber-600':i===1?'bg-slate-100 text-slate-500':i===2?'bg-orange-50 text-orange-600':'bg-slate-50 text-slate-300'}`}>{i+1}</div>
                           <div className="flex-1">
                              <p className="font-black text-slate-800 text-sm group-hover:text-indigo-600 transition-colors">{l.full_name}</p>
                              <div className="flex items-center gap-3 mt-1">
                                 <div className="w-24 h-1.5 bg-slate-100 rounded-full overflow-hidden"><div className="h-full bg-indigo-500" style={{width: `${(l.total_score/1000)*100}%`}}></div></div>
                                 <span className="text-[9px] font-black text-secondary uppercase tracking-widest">Rating</span>
                              </div>
                           </div>
                           <div className="text-2xl font-black text-slate-800">{l.total_score}</div>
                        </div>
                     ))}
                  </div>
               </section>

               <section className="space-y-10">
                  <div>
                     <h3 className="text-sm font-black text-slate-800 uppercase tracking-widest border-l-4 border-indigo-600 pl-4 mb-8">Instructional Velocity</h3>
                     <div className="space-y-8">
                        {data.sessions.slice(0,4).map(s => {
                           const sAtt = data.att.filter(a=>a.session_id===s.id);
                           const pct = sAtt.length ? Math.round((sAtt.filter(a=>a.status==='PRESENT').length/sAtt.length)*100):0;
                           return (
                              <div key={s.id}>
                                 <div className="flex justify-between items-center mb-2">
                                    <span className="text-[10px] font-black text-slate-800 uppercase tracking-widest">{s.title}</span>
                                    <span className={`text-[10px] font-black ${pct>80?'text-emerald-600':'text-amber-600'}`}>{pct}% Engagement</span>
                                 </div>
                                 <div className="w-full bg-slate-100 h-3 rounded-full overflow-hidden shadow-inner">
                                    <div className={`h-full transition-all duration-1000 ${pct>80?'bg-emerald-500':'bg-amber-500'}`} style={{width: `${pct}%`}}></div>
                                 </div>
                              </div>
                           )
                        })}
                     </div>
                  </div>
                  
                  <div className="bg-indigo-600 rounded-[2.5rem] p-10 text-white shadow-xl shadow-indigo-600/30">
                     <h4 className="text-lg font-black mb-2">Batch Intelligence</h4>
                     <p className="text-sm text-indigo-100 font-medium leading-relaxed">This batch is currently performing 12% above the institutional average in technical conceptualization.</p>
                     <div className="mt-8 flex gap-4">
                        <button className="flex-1 py-3 bg-white text-indigo-600 rounded-2xl text-[10px] font-black uppercase tracking-widest">Download Data</button>
                        <button className="flex-1 py-3 bg-indigo-500 text-white rounded-2xl text-[10px] font-black uppercase tracking-widest">Audit Batch</button>
                     </div>
                  </div>
               </section>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
          </div>
        </div>
      )}

    </div>
  );
}
