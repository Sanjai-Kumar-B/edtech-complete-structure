import { useEffect, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { supabase } from '@junospace/supabase-client';

function CreateSessionModal({ batchId, onClose, onAdd }) {
  const [form, setForm] = useState({ title: '', description: '', session_date: '', session_time: '', duration_min: 90, zoom_link: '' });
  const [saving, setSaving] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    const { data: session, error } = await supabase.from('sessions').insert({
      batch_id: batchId,
      title: form.title,
      description: form.description,
      session_date: form.session_date,
      session_time: form.session_time,
      duration_minutes: Number(form.duration_min),
      zoom_link: form.zoom_link,
      type: 'class'
    }).select().single();

    if (!error) {
      // Notify enrolled students
      const { data: enrolled } = await supabase.from('enrollments').select('users(id)').eq('batch_id', batchId);
      if (enrolled && enrolled.length > 0) {
        await supabase.from('notifications').insert(
          enrolled.map(e => ({
            user_id: e.users.id,
            title: 'New Session Added',
            message: `${form.title} on ${form.session_date}`,
            type: 'session'
          }))
        );
      }
      onAdd(session);
      onClose();
    } else {
      alert(error.message);
    }
    setSaving(false);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm overflow-y-auto">
      <div className="bg-white rounded-3xl shadow-2xl w-full max-w-md overflow-hidden my-8">
        <div className="bg-gradient-to-r from-slate-800 to-indigo-800 px-8 py-5">
          <h3 className="text-lg font-headline font-bold text-white">Create New Session</h3>
        </div>
        <form onSubmit={handleSubmit} className="p-8 space-y-4">
          <div>
            <label className="text-xs font-bold uppercase tracking-widest text-secondary mb-1.5 block">Session Title</label>
            <input required value={form.title} onChange={e => setForm({ ...form, title: e.target.value })} className="w-full px-4 py-2.5 rounded-xl border border-outline-variant text-sm focus:ring-2 focus:ring-primary/30" />
          </div>
          <div>
            <label className="text-xs font-bold uppercase tracking-widest text-secondary mb-1.5 block">Topic/Description</label>
            <input value={form.description} onChange={e => setForm({ ...form, description: e.target.value })} className="w-full px-4 py-2.5 rounded-xl border border-outline-variant text-sm focus:ring-2 focus:ring-primary/30" />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-xs font-bold uppercase tracking-widest text-secondary mb-1.5 block">Date</label>
              <input type="date" required value={form.session_date} onChange={e => setForm({ ...form, session_date: e.target.value })} className="w-full px-4 py-2.5 rounded-xl border border-outline-variant text-sm" />
            </div>
            <div>
              <label className="text-xs font-bold uppercase tracking-widest text-secondary mb-1.5 block">Time</label>
              <input type="time" required value={form.session_time} onChange={e => setForm({ ...form, session_time: e.target.value })} className="w-full px-4 py-2.5 rounded-xl border border-outline-variant text-sm" />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-xs font-bold uppercase tracking-widest text-secondary mb-1.5 block">Duration (min)</label>
              <input type="number" required value={form.duration_min} onChange={e => setForm({ ...form, duration_min: e.target.value })} className="w-full px-4 py-2.5 rounded-xl border border-outline-variant text-sm" />
            </div>
            <div>
              <label className="text-xs font-bold uppercase tracking-widest text-secondary mb-1.5 block">Zoom URL</label>
              <input type="url" value={form.zoom_link} onChange={e => setForm({ ...form, zoom_link: e.target.value })} className="w-full px-4 py-2.5 rounded-xl border border-outline-variant text-sm" />
            </div>
          </div>
          <div className="flex gap-3 pt-4">
            <button type="button" onClick={onClose} className="flex-1 py-3 rounded-xl border border-outline-variant text-sm font-semibold text-secondary">Cancel</button>
            <button type="submit" disabled={saving} className="flex-1 py-3 rounded-xl bg-primary text-white text-sm font-bold">{saving ? 'Saving...' : 'Save'}</button>
          </div>
        </form>
      </div>
    </div>
  );
}

function CreateAssignmentModal({ batchId, onClose, onAdd }) {
  const [form, setForm] = useState({ title: '', description: '', due_date: '', max_score: 100, skill_category: 'Technical' });
  const [saving, setSaving] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    const { data, error } = await supabase.from('assignments').insert({
      batch_id: batchId, ...form, is_published: false
    }).select().single();
    if (!error) {
      onAdd(data);
      onClose();
    } else { alert(error.message); }
    setSaving(false);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm overflow-y-auto">
      <div className="bg-white rounded-3xl shadow-2xl w-full max-w-md overflow-hidden my-8">
        <div className="bg-gradient-to-r from-indigo-600 to-purple-600 px-8 py-5">
          <h3 className="text-lg font-headline font-bold text-white">Create Assignment</h3>
        </div>
        <form onSubmit={handleSubmit} className="p-8 space-y-4">
          <div>
            <label className="text-xs font-bold text-secondary mb-1 block">Title</label>
            <input required value={form.title} onChange={e => setForm({ ...form, title: e.target.value })} className="w-full px-4 py-2 border rounded-lg text-sm" />
          </div>
          <div>
            <label className="text-xs font-bold text-secondary mb-1 block">Description</label>
            <textarea required value={form.description} onChange={e => setForm({ ...form, description: e.target.value })} className="w-full px-4 py-2 border rounded-lg text-sm"></textarea>
          </div>
          <div>
            <label className="text-xs font-bold text-secondary mb-1 block">Due Date</label>
            <input type="date" required value={form.due_date} onChange={e => setForm({ ...form, due_date: e.target.value })} className="w-full px-4 py-2 border rounded-lg text-sm" />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-xs font-bold text-secondary mb-1 block">Max Score</label>
              <input type="number" required value={form.max_score} onChange={e => setForm({ ...form, max_score: e.target.value })} className="w-full px-4 py-2 border rounded-lg text-sm" />
            </div>
            <div>
              <label className="text-xs font-bold text-secondary mb-1 block">Skill Category</label>
              <select value={form.skill_category} onChange={e => setForm({ ...form, skill_category: e.target.value })} className="w-full px-4 py-2 border rounded-lg text-sm">
                <option>Technical</option><option>Conceptual</option><option>Consistency</option><option>Participation</option>
              </select>
            </div>
          </div>
          <div className="flex gap-3 pt-4">
            <button type="button" onClick={onClose} className="flex-1 py-2 border rounded-lg text-sm">Cancel</button>
            <button type="submit" disabled={saving} className="flex-1 py-2 bg-indigo-600 text-white rounded-lg text-sm">{saving ? '...' : 'Save'}</button>
          </div>
        </form>
      </div>
    </div>
  )
}

function CreateAssessmentModal({ batchId, profileId, onClose, onPublish }) {
  const [step, setStep] = useState(1);
  const [form, setForm] = useState({ title: '', description: '', due_date: '', duration_minutes: 30 });
  const [questions, setQuestions] = useState([]);
  const [saving, setSaving] = useState(false);

  const [qForm, setQForm] = useState({ question: '', code: '', options: ['', '', '', ''], correctAnswer: 0, topic: '', difficulty: 'Medium' });

  const handleAddQuestion = () => {
    setQuestions([...questions, { ...qForm }]);
    setQForm({ question: '', code: '', options: ['', '', '', ''], correctAnswer: 0, topic: '', difficulty: 'Medium' });
  };

  const handleSavePublish = async () => {
    setSaving(true);
    const { data: assessment, error } = await supabase.from('assessments').insert({
      batch_id: batchId, title: form.title, description: form.description, due_date: form.due_date, duration_minutes: form.duration_minutes, is_published: true, created_by: profileId
    }).select().single();

    if (assessment && questions.length > 0) {
      await supabase.from('assessment_questions').insert(questions.map((q, i) => ({
        assessment_id: assessment.id, question_text: q.question, code_block: q.code || null, options: q.options, correct_answer: q.correctAnswer, topic: q.topic, difficulty: q.difficulty, order_index: i
      })));

      const { data: enrolled } = await supabase.from('enrollments').select('users(id)').eq('batch_id', batchId);
      if (enrolled) {
        await supabase.from('notifications').insert(enrolled.map(e => ({ user_id: e.users.id, title: 'New Assessment Published', message: 'Check your course page.', type: 'assessment' })));
      }
      onPublish(assessment);
      onClose();
    } else {
      if (error) alert(error.message);
    }
    setSaving(false);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm overflow-y-auto">
      <div className="bg-white rounded-3xl shadow-2xl w-full max-w-2xl overflow-hidden my-8">
        <div className="bg-gradient-to-r from-blue-600 to-indigo-600 px-8 py-5 flex justify-between items-center">
          <h3 className="text-lg font-headline font-bold text-white">{step === 1 ? 'Create Assessment' : 'Question Builder'}</h3>
          <button onClick={onClose} className="text-white"><span className="material-symbols-outlined">close</span></button>
        </div>
        <div className="p-8 space-y-4 max-h-[70vh] overflow-y-auto">
          {step === 1 ? (
            <>
              <div><label className="block text-sm font-bold mb-1">Title</label><input required value={form.title} onChange={e => setForm({ ...form, title: e.target.value })} className="w-full p-2 border rounded" /></div>
              <div><label className="block text-sm font-bold mb-1">Description</label><textarea value={form.description} onChange={e => setForm({ ...form, description: e.target.value })} className="w-full p-2 border rounded" /></div>
              <div className="grid grid-cols-2 gap-4">
                <div><label className="block text-sm font-bold mb-1">Due Date</label><input type="date" value={form.due_date} onChange={e => setForm({ ...form, due_date: e.target.value })} className="w-full p-2 border rounded" /></div>
                <div><label className="block text-sm font-bold mb-1">Duration (min)</label><input type="number" value={form.duration_minutes} onChange={e => setForm({ ...form, duration_minutes: e.target.value })} className="w-full p-2 border rounded" /></div>
              </div>
              <button onClick={() => setStep(2)} className="w-full py-2 mt-4 bg-blue-600 text-white rounded font-bold">Next: Builder</button>
            </>
          ) : (
            <>
              <div className="bg-slate-50 p-4 rounded border border-slate-200 space-y-3">
                <h4 className="font-bold text-sm">Add Question</h4>
                <input placeholder="Question Text" value={qForm.question} onChange={e => setQForm({ ...qForm, question: e.target.value })} className="w-full p-2 border rounded text-sm" />
                <textarea placeholder="Code Block (Optional)" value={qForm.code} onChange={e => setQForm({ ...qForm, code: e.target.value })} className="w-full p-2 border rounded text-sm font-mono text-xs" />
                <div className="grid grid-cols-2 gap-2">
                  {qForm.options.map((opt, idx) => (
                    <div key={idx} className="flex items-center gap-2">
                      <input type="radio" name="correctAns" checked={qForm.correctAnswer === idx} onChange={() => setQForm({ ...qForm, correctAnswer: idx })} />
                      <input placeholder={`Option ${['A', 'B', 'C', 'D'][idx]}`} value={opt} onChange={e => { const no = [...qForm.options]; no[idx] = e.target.value; setQForm({ ...qForm, options: no }) }} className="w-full p-1.5 border rounded text-sm" />
                    </div>
                  ))}
                </div>
                <div className="grid grid-cols-2 gap-2">
                  <input placeholder="Topic" value={qForm.topic} onChange={e => setQForm({ ...qForm, topic: e.target.value })} className="p-1.5 border rounded text-sm" />
                  <select value={qForm.difficulty} onChange={e => setQForm({ ...qForm, difficulty: e.target.value })} className="p-1.5 border rounded text-sm"><option>Easy</option><option>Medium</option><option>Hard</option></select>
                </div>
                <button onClick={handleAddQuestion} disabled={!qForm.question || !qForm.options[0]} className="px-4 py-1.5 bg-slate-800 text-white rounded text-sm">Add Question</button>
              </div>
              <div className="space-y-2">
                {questions.map((q, i) => (
                  <div key={i} className="p-3 border rounded text-sm"><strong>Q{i + 1}:</strong> {q.question} <span className="text-emerald-600 float-right">Ans: {['A', 'B', 'C', 'D'][q.correctAnswer]}</span></div>
                ))}
              </div>
              <div className="flex gap-3 pt-4">
                <button onClick={() => setStep(1)} className="px-4 py-2 border rounded">Back</button>
                <button onClick={handleSavePublish} disabled={saving || questions.length === 0} className="flex-1 py-2 bg-emerald-600 text-white rounded font-bold">{saving ? 'Publishing...' : 'Save & Publish'}</button>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  )
}


export function BatchDetail() {
  const { batchId } = useParams();
  const { profile } = useAuth();
  const navigate = useNavigate();

  const [loading, setLoading] = useState(true);
  const [data, setData] = useState(null);
  const [tab, setTab] = useState('sessions');

  const [showSessionModal, setShowSessionModal] = useState(false);
  const [showAssignModal, setShowAssignModal] = useState(false);
  const [showAssessModal, setShowAssessModal] = useState(false);

  useEffect(() => {
    if (!profile) return;

    async function loadData() {
      setLoading(true);
      if (!batchId) {
        // Cover Page
        const { data: myBatches } = await supabase.from('batches').select('*, courses(title), enrollments(count)').eq('instructor_id', profile.id).eq('status', 'active');
        const batchIds = myBatches?.map(b => b.id) || [];

        let roadmaps = [];
        if (batchIds.length > 0) {
          const { data: rm } = await supabase.from('roadmap_weeks').select('batch_id, status').in('batch_id', batchIds);
          roadmaps = rm || [];
        }

        const batchesMapped = (myBatches || []).map(b => {
          const bRoadmaps = roadmaps.filter(r => r.batch_id === b.id);
          const totalWeeks = bRoadmaps.length || 1;
          const completedWeeks = bRoadmaps.filter(r => r.status === 'completed').length;
          return {
            ...b,
            studentCount: b.enrollments?.[0]?.count || 0,
            progress: Math.round((completedWeeks / totalWeeks) * 100),
          }
        });

        const totalStudents = batchesMapped.reduce((a, b) => a + b.studentCount, 0);

        setData({ isCover: true, batches: batchesMapped, totalBatches: batchesMapped.length, totalStudents, activeBatches: batchesMapped.length });
      } else {
        // Detail Page
        const { data: batch } = await supabase.from('batches').select('*, courses(*), users!batches_instructor_id_fkey(full_name)').eq('id', batchId).single();
        const { data: sessions } = await supabase.from('sessions').select('*').eq('batch_id', batchId).order('session_date');
        const { data: assignments } = await supabase.from('assignments').select('*, assignment_submissions(count)').eq('batch_id', batchId);
        const { data: assessments } = await supabase.from('assessments').select('*').eq('batch_id', batchId);
        const { data: enrolled } = await supabase.from('enrollments').select('*, users(id, full_name, email, avatar_initials, is_active)').eq('batch_id', batchId);
        const { data: roadmap } = await supabase.from('roadmap_weeks').select('*').eq('batch_id', batchId).order('week_number');
        const { data: scores } = await supabase.from('leaderboard_scores').select('*').eq('batch_id', batchId).order('rank');

        setData({ isCover: false, batch, sessions: sessions || [], assignments: assignments || [], assessments: assessments || [], enrolled: enrolled || [], roadmap: roadmap || [], scores: scores || [] });
      }
      setLoading(false);
    }

    loadData();
  }, [profile, batchId]);

  if (loading) return <div className="p-8 pt-20">Loading...</div>;

  if (data?.isCover) {
    return (
      <div className="pt-20 p-8 space-y-8">
        <header>
          <h1 className="text-3xl font-extrabold tracking-tight">My Batches</h1>
          <p className="text-secondary font-medium">Select a batch to manage its curriculum and students.</p>
        </header>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-100">
            <p className="text-xs font-bold text-secondary uppercase mb-1">Total Batches</p>
            <h2 className="text-3xl font-black">{data.totalBatches}</h2>
          </div>
          <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-100">
            <p className="text-xs font-bold text-secondary uppercase mb-1">Total Students</p>
            <h2 className="text-3xl font-black">{data.totalStudents}</h2>
          </div>
          <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-100">
            <p className="text-xs font-bold text-secondary uppercase mb-1">Active Batches</p>
            <h2 className="text-3xl font-black text-emerald-600">{data.activeBatches}</h2>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {data.batches.map(b => (
            <div key={b.id} className="bg-white rounded-2xl p-6 shadow-sm border border-slate-200 flex flex-col hover:shadow-md transition-shadow">
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h3 className="font-black text-xl">{b.batch_code}</h3>
                  <p className="text-sm text-secondary line-clamp-1">{b.courses?.title}</p>
                </div>
                <span className="bg-indigo-50 text-indigo-700 px-3 py-1 rounded-full text-xs font-bold">{b.studentCount} Students</span>
              </div>

              <div className="mb-6 flex-1">
                <div className="flex justify-between text-xs mb-1 font-bold"><span className="text-secondary">Progress</span><span className="text-indigo-600">{b.progress}%</span></div>
                <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
                  <div className="bg-indigo-600 h-full" style={{ width: `${b.progress}%` }}></div>
                </div>
              </div>

              <Link to={`/instructor/batches/${b.id}`} className="w-full py-2.5 bg-slate-50 hover:bg-indigo-50 hover:text-indigo-700 text-slate-700 font-bold text-center rounded-xl border border-slate-200 transition-colors">
                Open Batch
              </Link>
            </div>
          ))}
        </div>
      </div>
    );
  }

  // BATCH DETAIL VIEW
  const handlePublishAssign = async (id) => {
    await supabase.from('assignments').update({ is_published: true }).eq('id', id);
    const { data: enrolled } = await supabase.from('enrollments').select('users(id)').eq('batch_id', batchId);
    if (enrolled) {
      await supabase.from('notifications').insert(enrolled.map(e => ({ user_id: e.users.id, title: 'New Assignment', message: 'Check course page', type: 'assignment' })));
    }
    setData(prev => ({ ...prev, assignments: prev.assignments.map(a => a.id === id ? { ...a, is_published: true } : a) }));
  };

  const handleEditPoints = async (studentId, currentPts) => {
    const pts = prompt('Enter bonus points to add/set:', '0');
    if (pts !== null) {
      const notes = prompt('Enter reason notes:', '');
      await supabase.from('leaderboard_points').upsert({ student_id: studentId, batch_id: batchId, bonus_points: parseInt(pts), notes, updated_by: profile.id, updated_at: new Date().toISOString() }, { onConflict: 'student_id,batch_id' });
      alert('Points updated');
      // Reload scores
      const { data: scores } = await supabase.from('leaderboard_scores').select('*').eq('batch_id', batchId).order('rank');
      setData(prev => ({ ...prev, scores }));
    }
  };

  const handleUnlockWeek = async (weekId) => {
    await supabase.from('roadmap_weeks').update({ status: 'completed' }).eq('batch_id', batchId).eq('status', 'active');
    await supabase.from('roadmap_weeks').update({ status: 'active', unlocked_by: profile.id, unlocked_at: new Date().toISOString() }).eq('id', weekId);
    const { data: roadmap } = await supabase.from('roadmap_weeks').select('*').eq('batch_id', batchId).order('week_number');
    setData(prev => ({ ...prev, roadmap }));
  };

  return (
    <div className="pt-20 p-8 space-y-6">
      {showSessionModal && <CreateSessionModal batchId={batchId} onClose={() => setShowSessionModal(false)} onAdd={(s) => setData(p => ({ ...p, sessions: [...p.sessions, s] }))} />}
      {showAssignModal && <CreateAssignmentModal batchId={batchId} onClose={() => setShowAssignModal(false)} onAdd={(a) => setData(p => ({ ...p, assignments: [...p.assignments, { ...a, assignment_submissions: [{ count: 0 }] }] }))} />}
      {showAssessModal && <CreateAssessmentModal batchId={batchId} profileId={profile.id} onClose={() => setShowAssessModal(false)} onPublish={(a) => setData(p => ({ ...p, assessments: [...p.assessments, a] }))} />}

      <div className="flex items-center gap-4 mb-4">
        <Link to="/instructor/batches" className="text-secondary hover:text-primary"><span className="material-symbols-outlined">arrow_back</span></Link>
        <div>
          <h1 className="text-3xl font-extrabold">{data.batch?.batch_code}</h1>
          <p className="text-secondary font-medium">{data.batch?.courses?.title}</p>
        </div>
      </div>

      <div className="flex border-b border-slate-200 overflow-x-auto hide-scrollbar">
        {['sessions', 'assignments', 'assessments', 'enrolled', 'leaderboard', 'roadmap'].map(t => (
          <button key={t} onClick={() => setTab(t)} className={`px-6 py-3 font-bold text-sm whitespace-nowrap border-b-2 transition-colors ${tab === t ? 'border-primary text-primary' : 'border-transparent text-secondary hover:text-slate-800'}`}>
            {t.charAt(0).toUpperCase() + t.slice(1)}
          </button>
        ))}
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6">

        {/* SESSIONS TAB */}
        {tab === 'sessions' && (
          <div className="space-y-4">
            <div className="flex justify-between items-center mb-6">
              <h3 className="font-bold text-lg">Class Sessions</h3>
              <button onClick={() => setShowSessionModal(true)} className="bg-indigo-600 text-white px-4 py-2 rounded-lg text-sm font-bold flex items-center gap-2 hover:bg-indigo-700"><span className="material-symbols-outlined text-sm">add</span> New Session</button>
            </div>
            <div className="divide-y border border-slate-100 rounded-xl overflow-hidden">
              {data.sessions.map(s => (
                <div key={s.id} className="p-4 hover:bg-slate-50 flex items-center justify-between">
                  <div>
                    <h4 className="font-bold">{s.title}</h4>
                    <p className="text-xs text-secondary">{s.session_date} at {s.session_time} • {s.duration_minutes} min</p>
                  </div>
                  {s.zoom_link && <a href={s.zoom_link} target="_blank" rel="noreferrer" className="text-indigo-600 border border-indigo-200 px-3 py-1.5 rounded-lg text-xs font-bold hover:bg-indigo-50 flex items-center gap-1"><span className="material-symbols-outlined text-sm">videocam</span> Link</a>}
                </div>
              ))}
              {data.sessions.length === 0 && <p className="p-8 text-center text-secondary">No sessions scheduled.</p>}
            </div>
          </div>
        )}

        {/* ASSIGNMENTS TAB */}
        {tab === 'assignments' && (
          <div className="space-y-4">
            <div className="flex justify-between items-center mb-6">
              <h3 className="font-bold text-lg">Assignments</h3>
              <button onClick={() => setShowAssignModal(true)} className="bg-indigo-600 text-white px-4 py-2 rounded-lg text-sm font-bold flex items-center gap-2 hover:bg-indigo-700"><span className="material-symbols-outlined text-sm">add</span> Create Assignment</button>
            </div>
            <div className="divide-y border border-slate-100 rounded-xl overflow-hidden">
              {data.assignments.map(a => (
                <div key={a.id} className="p-4 hover:bg-slate-50 flex items-center justify-between">
                  <div>
                    <h4 className="font-bold flex items-center gap-2">{a.title} {a.is_published ? <span className="text-[10px] bg-emerald-100 text-emerald-700 px-2 py-0.5 rounded-full uppercase">Published</span> : <span className="text-[10px] bg-amber-100 text-amber-700 px-2 py-0.5 rounded-full uppercase">Draft</span>}</h4>
                    <p className="text-xs text-secondary mt-1">Due: {a.due_date} • {a.assignment_submissions?.[0]?.count || 0} Submissions</p>
                  </div>
                  {!a.is_published && <button onClick={() => handlePublishAssign(a.id)} className="text-indigo-600 text-sm font-bold border border-indigo-200 px-4 py-1.5 rounded-lg hover:bg-indigo-50">Publish</button>}
                </div>
              ))}
              {data.assignments.length === 0 && <p className="p-8 text-center text-secondary">No assignments created.</p>}
            </div>
          </div>
        )}

        {/* ASSESSMENTS TAB */}
        {tab === 'assessments' && (
          <div className="space-y-4">
            <div className="flex justify-between items-center mb-6">
              <h3 className="font-bold text-lg">Assessments</h3>
              <button onClick={() => setShowAssessModal(true)} className="bg-indigo-600 text-white px-4 py-2 rounded-lg text-sm font-bold flex items-center gap-2 hover:bg-indigo-700"><span className="material-symbols-outlined text-sm">add</span> Create Assessment</button>
            </div>
            <div className="divide-y border border-slate-100 rounded-xl overflow-hidden">
              {data.assessments.map(a => (
                <div key={a.id} className="p-4 hover:bg-slate-50 flex items-center justify-between">
                  <div>
                    <h4 className="font-bold flex items-center gap-2">{a.title}</h4>
                    <p className="text-xs text-secondary mt-1">Due: {a.due_date} • {a.duration_minutes} min</p>
                  </div>
                </div>
              ))}
              {data.assessments.length === 0 && <p className="p-8 text-center text-secondary">No assessments created.</p>}
            </div>
          </div>
        )}

        {/* ENROLLED TAB */}
        {tab === 'enrolled' && (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead><tr className="bg-slate-50 border-b border-slate-200"><th className="p-4 text-xs font-bold text-secondary uppercase">Student</th><th className="p-4 text-xs font-bold text-secondary uppercase">Risk Level</th><th className="p-4 text-xs font-bold text-secondary uppercase">Status</th><th className="p-4 text-right text-xs font-bold text-secondary uppercase">Action</th></tr></thead>
              <tbody className="divide-y">
                {data.enrolled.map(e => {
                  const sScore = data.scores.find(sc => sc.student_id === e.users.id)?.total_score || 0;
                  const risk = sScore >= 70 ? 'LOW' : sScore >= 50 ? 'MEDIUM' : 'HIGH';
                  const riskColors = { LOW: 'bg-emerald-100 text-emerald-700', MEDIUM: 'bg-amber-100 text-amber-700', HIGH: 'bg-red-100 text-red-700' };
                  return (
                    <tr key={e.id} className="hover:bg-slate-50">
                      <td className="p-4">
                        <p className="font-bold text-sm">{e.users.full_name}</p>
                        <p className="text-xs text-secondary">{e.users.email}</p>
                      </td>
                      <td className="p-4"><span className={`px-2 py-1 text-[10px] font-bold rounded-full ${riskColors[risk]}`}>{risk} RISK</span></td>
                      <td className="p-4"><span className="px-2 py-1 text-[10px] font-bold rounded-full bg-slate-100 text-slate-600">{e.status}</span></td>
                      <td className="p-4 text-right">
                        <Link to={`/instructor/students/${e.users.id}?batch=${batchId}`} className="text-indigo-600 text-sm font-bold border border-indigo-200 px-3 py-1.5 rounded-lg hover:bg-indigo-50">View</Link>
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        )}

        {/* LEADERBOARD TAB */}
        {tab === 'leaderboard' && (
          <div className="space-y-2 max-w-4xl">
            {data.scores.map((sc, i) => (
              <div key={sc.student_id} className="flex items-center justify-between p-4 border border-slate-100 rounded-xl hover:bg-slate-50">
                <div className="flex items-center gap-4">
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center font-black ${i === 0 ? 'bg-amber-100 text-amber-600' : i === 1 ? 'bg-slate-200 text-slate-600' : i === 2 ? 'bg-orange-100 text-orange-600' : 'bg-slate-50 text-slate-400'}`}>
                    {i + 1}
                  </div>
                  <div>
                    <h4 className="font-bold text-sm">{sc.full_name}</h4>
                    <p className="text-xs text-secondary">Score: {sc.total_score}</p>
                  </div>
                </div>
                <button onClick={() => handleEditPoints(sc.student_id, sc.total_score)} className="text-xs font-bold text-indigo-600 hover:underline">Edit Points</button>
              </div>
            ))}
            {data.scores.length === 0 && <p className="text-center text-secondary py-8">No leaderboard data.</p>}
          </div>
        )}

        {/* ROADMAP TAB */}
        {tab === 'roadmap' && (
          <div className="space-y-4 max-w-4xl">
            <div className="divide-y border border-slate-100 rounded-xl overflow-hidden">
              {data.roadmap.map(w => (
                <div key={w.id} className="p-5 hover:bg-slate-50 flex items-start justify-between gap-4">
                  <div className="flex gap-4">
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 border-2 ${w.status === 'completed' ? 'bg-emerald-100 border-emerald-500 text-emerald-600' : w.status === 'active' ? 'bg-blue-100 border-blue-500 text-blue-600' : 'bg-slate-100 border-slate-300 text-slate-400'}`}>
                      <span className="material-symbols-outlined text-sm">{w.status === 'completed' ? 'check' : w.status === 'active' ? 'play_arrow' : 'lock'}</span>
                    </div>
                    <div>
                      <h4 className="font-bold text-sm">Week {w.week_number}: {w.title}</h4>
                      <p className="text-xs text-secondary mt-1">{w.description}</p>
                    </div>
                  </div>
                  {w.status === 'locked' && <button onClick={() => handleUnlockWeek(w.id)} className="text-indigo-600 text-xs font-bold px-3 py-1.5 border border-indigo-200 rounded-lg hover:bg-indigo-50 whitespace-nowrap">Unlock</button>}
                </div>
              ))}
              {data.roadmap.length === 0 && <p className="p-8 text-center text-secondary">No roadmap weeks found.</p>}
            </div>
          </div>
        )}

      </div>
    </div>
  );
}
Publish
                    </button >
                  )}
                </div >
              ))}
{ data.assignments.length === 0 && <p className="p-8 text-center text-slate-400">No assignments created.</p> }
            </div >
          </div >
        )}

{/* ASSESSMENTS LIST TAB */ }
{
  tab === 'assessments' && (
    <div className="space-y-4">
      <div className="flex justify-between items-center mb-6">
        <h3 className="font-bold text-lg">Batch Assessments</h3>
        <Link to="/instructor/assessments/create" className="px-4 py-2 bg-indigo-600 text-white rounded-xl text-xs font-bold hover:bg-indigo-700">
          Go to Assessment Creator
        </Link>
      </div>
      <div className="divide-y border border-slate-100 rounded-xl overflow-hidden bg-slate-50/50">
        {data.assessments.map(a => (
          <div key={a.id} className="p-4 hover:bg-slate-50 flex items-center justify-between">
            <div>
              <h4 className="font-bold text-slate-800">{a.title}</h4>
              <p className="text-xs text-slate-500 mt-1">Duration: {a.duration_minutes} min • Due: {a.due_date ? new Date(a.due_date).toLocaleDateString() : 'N/A'}</p>
            </div>
            <Link to={`/instructor/assessments/${a.id}/results`} className="text-[#6C35DE] text-xs font-bold hover:underline">
              View Results
            </Link>
          </div>
        ))}
        {data.assessments.length === 0 && <p className="p-8 text-center text-slate-400">No assessments created.</p>}
      </div>
    </div>
  )
}

{/* LEADERBOARD TAB */ }
{
  tab === 'leaderboard' && (
    <div className="space-y-4">
      <h3 className="text-lg font-black text-slate-800 mb-4">Cohort Leaderboard</h3>
      <div className="divide-y border border-slate-100 rounded-2xl overflow-hidden">
        {data.scores.map(row => (
          <div key={row.student_id} className="p-4 flex items-center justify-between hover:bg-slate-50/50">
            <div className="flex items-center gap-4">
              <span className="font-mono font-bold text-slate-400 w-6">#{row.rank}</span>
              <div className="w-10 h-10 rounded-xl text-white flex items-center justify-center font-bold text-xs" style={{ backgroundColor: row.avatar_color || '#6C35DE' }}>
                {row.avatar_initials || row.full_name?.charAt(0)}
              </div>
              <div>
                <p className="font-bold text-slate-800 text-sm">{row.full_name}</p>
              </div>
            </div>
            <span className="font-mono text-sm font-black text-indigo-600">{row.total_score} points</span>
          </div>
        ))}
        {data.scores.length === 0 && <p className="p-8 text-center text-slate-400">No scores registered yet.</p>}
      </div>
    </div>
  )
}

{/* ROADMAP ROAD TAB */ }
{
  tab === 'roadmap' && (
    <div className="space-y-4">
      <h3 className="text-lg font-black text-slate-800 mb-4">Curriculum Roadmap</h3>
      <div className="space-y-4">
        {data.roadmap.map(w => (
          <div key={w.id} className="p-6 border border-slate-100 rounded-2xl flex items-center justify-between hover:border-[#6C35DE]/20 transition-all duration-300">
            <div className="flex items-center gap-4">
              <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-xs ${w.status === 'completed' ? 'bg-emerald-100 text-emerald-700' : w.status === 'active' ? 'bg-indigo-100 text-indigo-700' : 'bg-slate-100 text-slate-400'}`}>
                {w.week_number}
              </div>
              <div>
                <h4 className="font-bold text-slate-800">Week {w.week_number}: {w.title}</h4>
                <p className="text-xs text-slate-500 mt-1">{w.description}</p>
              </div>
            </div>
            {w.status === 'locked' && (
              <button onClick={() => handleUnlockWeek(w.id)} className="px-4 py-2 bg-indigo-50 text-[#6C35DE] rounded-xl text-xs font-bold hover:bg-indigo-100">
                Unlock Week
              </button>
            )}
          </div>
        ))}
        {data.roadmap.length === 0 && <p className="p-8 text-center text-slate-400">No roadmap data established.</p>}
      </div>
    </div>
  )
}

      </div >

  {/* MANUAL AWARD POINTS MODAL */ }
{
  pointsForm.open && (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm animate-in fade-in">
      <div className="bg-white rounded-3xl shadow-2xl w-full max-w-sm p-8 space-y-6">
        <h3 className="text-lg font-black text-slate-800">Award / Set Points</h3>
        <p className="text-xs text-slate-500 font-bold">Target Student: {pointsForm.studentName}</p>

        <form onSubmit={handleSavePoints} className="space-y-4">
          <div className="space-y-1">
            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Points Quantity *</label>
            <input required type="number" value={pointsForm.points} onChange={e => setPointsForm({ ...pointsForm, points: e.target.value })} className="w-full bg-slate-50 border-none rounded-xl px-4 py-2.5 text-sm font-bold text-slate-800 focus:ring-0" placeholder="e.g. 15" />
          </div>
          <div className="space-y-1">
            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Reason / Memo *</label>
            <input required value={pointsForm.reason} onChange={e => setPointsForm({ ...pointsForm, reason: e.target.value })} className="w-full bg-slate-50 border-none rounded-xl px-4 py-2.5 text-sm font-bold text-slate-800 focus:ring-0" placeholder="e.g. Hackathon Winner" />
          </div>
          <div className="flex gap-3 pt-2">
            <button type="submit" disabled={updatingPoints} className="flex-1 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-black">{updatingPoints ? 'Saving...' : 'Confirm'}</button>
            <button type="button" onClick={() => setPointsForm({ open: false, studentId: '', studentName: '', points: '', reason: '' })} className="flex-1 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-black">Cancel</button>
          </div>
        </form>
      </div>
    </div>
  )
}

    </div >
  );
}
