import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { supabase } from '@junospace/supabase-client';
import { Loader2, Trash2, Edit2, CheckCircle2, X } from 'lucide-react';


function AssignmentReview() {
  const { user } = useAuth();

  const [loading, setLoading] = useState(true);
  const [submissions, setSubmissions] = useState([]);
  const [tab, setTab] = useState('pending'); // 'all', 'pending', 'graded'

  // Right Panel State
  const [selectedSub, setSelectedSub] = useState(null);
  const [score, setScore] = useState('');
  const [feedback, setFeedback] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [toast, setToast] = useState('');

  useEffect(() => {
    if (user) {
      loadSubmissions();
    }
  }, [user]);

  async function loadSubmissions() {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('assignment_submissions')
        .select(`
          *,
          users!assignment_submissions_student_id_fkey ( full_name, avatar_initials ),
          assignments!assignment_submissions_assignment_id_fkey!inner ( title, max_score, created_by, batches!assignments_batch_id_fkey ( id, batch_code ) )
        `)
        .eq('assignments.created_by', user.id)
        .order('submitted_at', { ascending: false });

      if (error) throw error;
      setSubmissions(data || []);
    } catch (err) {
      console.error(err);
      alert("Failed to load submissions: " + err.message);
    } finally {
      setLoading(false);
    }
  }

  const listToShow = submissions.filter(s => {
    if (tab === 'all') return true;
    if (tab === 'pending') return s.status === 'pending';
    if (tab === 'graded') return s.status === 'graded';
    return true;
  });

  const openPanel = (sub) => {
    setSelectedSub(sub);
    setScore(sub.score || '');
    setFeedback(sub.feedback || '');
    setErrorMsg('');
  };

  const closePanel = () => {
    setSelectedSub(null);
    setErrorMsg('');
  };

  const handleSubmitGrade = async (e) => {
    e.preventDefault();
    if (!selectedSub) return;

    setErrorMsg('');
    setSubmitting(true);

    try {
      const numericScore = parseInt(score);
      if (isNaN(numericScore) || numericScore < 0 || numericScore > selectedSub.assignments.max_score) {
        throw new Error(`Score must be between 0 and ${selectedSub.assignments.max_score}`);
      }

      // 1. Update assignment_submissions
      const { error: updateError } = await supabase
        .from('assignment_submissions')
        .update({
          score: numericScore,
          feedback,
          status: 'graded',
          reviewed_by: user.id,
          reviewed_at: new Date().toISOString()
        })
        .eq('id', selectedSub.id);

      if (updateError) throw updateError;

      // 2. Insert into leaderboard_points
      const { error: lbError } = await supabase
        .from('leaderboard_points')
        .insert({
          student_id: selectedSub.student_id,
          batch_id: selectedSub.assignments.batches.id,
          points: numericScore,
          reason: `Assignment: ${selectedSub.assignments.title}`,
          awarded_at: new Date().toISOString()
        });

      if (lbError) throw lbError;

      // Success
      setToast('Grade submitted successfully!');
      setTimeout(() => setToast(''), 3000);

      // Update local state
      setSubmissions(prev => prev.map(s => s.id === selectedSub.id ? {
        ...s,
        score: numericScore,
        feedback,
        status: 'graded',
        reviewed_at: new Date().toISOString()
      } : s));

      closePanel();
    } catch (err) {
      setErrorMsg(err.message || 'Failed to submit grade');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="h-full flex flex-col space-y-6">


      {/* TABS */}
      <div className="flex border-b border-slate-200 shrink-0">
        <button onClick={() => setTab('all')} className={`px-6 py-3 font-bold text-sm ${tab === 'all' ? 'text-[#6C35DE] border-b-2 border-[#6C35DE]' : 'text-slate-500 hover:text-slate-800'}`}>All</button>
        <button onClick={() => setTab('pending')} className={`px-6 py-3 font-bold text-sm flex items-center gap-2 ${tab === 'pending' ? 'text-[#6C35DE] border-b-2 border-[#6C35DE]' : 'text-slate-500 hover:text-slate-800'}`}>
          Pending <span className="bg-amber-100 text-amber-700 px-2 py-0.5 rounded-full text-xs">{submissions.filter(s => s.status === 'pending').length}</span>
        </button>
        <button onClick={() => setTab('graded')} className={`px-6 py-3 font-bold text-sm flex items-center gap-2 ${tab === 'graded' ? 'text-[#6C35DE] border-b-2 border-[#6C35DE]' : 'text-slate-500 hover:text-slate-800'}`}>
          Graded <span className="bg-emerald-100 text-emerald-700 px-2 py-0.5 rounded-full text-xs">{submissions.filter(s => s.status === 'graded').length}</span>
        </button>
      </div>

      {toast && (
        <div className="bg-emerald-100 text-emerald-700 px-4 py-3 rounded-xl text-sm font-bold flex items-center gap-2 animate-in fade-in slide-in-from-top-4 shrink-0">
          <CheckCircle2 size={18} /> {toast}
        </div>
      )}

      {/* MAIN CONTAINER WITH RELATIVE POSITIONING */}
      <div className="flex-1 relative overflow-hidden bg-white rounded-3xl border border-slate-200 shadow-sm flex flex-col">

        {/* LEFT SUBMISSION LIST */}
        <div className="flex-1 overflow-y-auto p-6">
          {loading ? (
            <div className="flex justify-center p-12"><Loader2 className="animate-spin text-slate-400" size={32} /></div>
          ) : listToShow.length === 0 ? (
            <div className="text-center p-12 border-2 border-dashed border-slate-100 rounded-3xl mt-4">
              <p className="text-slate-400 font-bold">No submissions found in this category.</p>
            </div>
          ) : (
            <div className="grid gap-4">
              {listToShow.map(sub => (
                <div
                  key={sub.id}
                  onClick={() => openPanel(sub)}
                  className={`p-5 rounded-2xl border transition-all cursor-pointer flex flex-col md:flex-row md:items-center justify-between gap-4 group ${selectedSub?.id === sub.id
                      ? 'border-[#6C35DE] bg-indigo-50/50 shadow-md ring-1 ring-[#6C35DE]/20'
                      : 'border-slate-100 hover:border-indigo-200 hover:bg-slate-50 hover:shadow-sm'
                    }`}
                >
                  <div className="flex items-center gap-4 min-w-0 flex-1">
                    <div className="w-12 h-12 rounded-full bg-indigo-100 flex items-center justify-center font-black text-indigo-700 shrink-0">
                      {sub.users?.avatar_initials || sub.users?.full_name?.charAt(0) || '?'}
                    </div>
                    <div className="min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <h3 className="font-bold text-slate-800 text-base truncate">{sub.users?.full_name || 'Unknown Student'}</h3>
                        <span className={`px-2 py-0.5 text-[10px] font-black uppercase tracking-wider rounded-md shrink-0 ${sub.status === 'graded' ? 'bg-emerald-100 text-emerald-700' : 'bg-amber-100 text-amber-700'
                          }`}>
                          {sub.status}
                        </span>
                      </div>
                      <p className="text-sm font-semibold text-slate-500 flex items-center gap-2 truncate">
                        <span className="text-slate-700">{sub.assignments?.title}</span>
                        <span className="w-1 h-1 rounded-full bg-slate-300 inline-block"></span>
                        <span>{sub.assignments?.batches?.batch_code}</span>
                      </p>
                      <p className="text-xs text-slate-400 mt-1">Submitted: {new Date(sub.submitted_at).toLocaleString()}</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-6 shrink-0">
                    {sub.file_url ? (
                      <a
                        href={sub.file_url}
                        target="_blank"
                        rel="noreferrer"
                        onClick={(e) => e.stopPropagation()}
                        className="text-xs font-bold text-[#6C35DE] hover:underline flex items-center gap-1 bg-indigo-50 px-3 py-1.5 rounded-lg"
                      >
                        <span className="material-symbols-outlined text-[14px]">open_in_new</span> View File
                      </a>
                    ) : (
                      <span className="text-xs font-medium text-slate-400 italic">No attachment</span>
                    )}

                    {sub.status === 'graded' && (
                      <div className="text-right">
                        <div className="text-xl font-black text-emerald-600">{sub.score}</div>
                        <div className="text-[10px] uppercase tracking-widest text-slate-400 font-bold">/ {sub.assignments?.max_score} pts</div>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* ABSOLUTE RIGHT PANEL FOR GRADING */}
        <div
          className={`absolute top-0 right-0 w-full max-w-[400px] h-full bg-white shadow-[-10px_0_30px_rgba(0,0,0,0.05)] border-l border-slate-200 z-10 transition-transform duration-300 ease-in-out flex flex-col ${selectedSub ? 'translate-x-0' : 'translate-x-full'
            }`}
        >
          {selectedSub && (
            <>
              <header className="p-6 border-b border-slate-100 flex justify-between items-start bg-slate-50/50">
                <div>
                  <h2 className="text-lg font-black text-slate-800">{selectedSub.users?.full_name}</h2>
                  <p className="text-sm font-semibold text-slate-500 mt-1">{selectedSub.assignments?.title}</p>
                  <p className="text-xs text-slate-400 mt-0.5">Submitted: {new Date(selectedSub.submitted_at).toLocaleString()}</p>
                </div>
                <button onClick={closePanel} className="p-2 text-slate-400 hover:text-slate-700 bg-white hover:bg-slate-100 rounded-full shadow-sm transition-colors">
                  <X size={18} />
                </button>
              </header>

              <div className="flex-1 overflow-y-auto p-6 space-y-6">

                {/* Submission Text */}
                {selectedSub.submission_text && (
                  <div>
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest block mb-2">Student Comments</label>
                    <div className="p-4 bg-slate-50 border border-slate-100 rounded-2xl text-sm font-medium text-slate-700 whitespace-pre-wrap">
                      {selectedSub.submission_text}
                    </div>
                  </div>
                )}

                {/* File Attachment */}
                <div>
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest block mb-2">Attachment</label>
                  {selectedSub.file_url ? (
                    <a href={selectedSub.file_url} target="_blank" rel="noreferrer" className="flex items-center gap-3 p-4 border border-indigo-100 bg-indigo-50/50 rounded-2xl hover:bg-indigo-50 transition-colors group">
                      <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center text-[#6C35DE] shadow-sm group-hover:scale-105 transition-transform">
                        <span className="material-symbols-outlined">description</span>
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-bold text-slate-700 truncate">View Submission File</p>
                        <p className="text-xs font-semibold text-indigo-500 truncate">Opens in new tab</p>
                      </div>
                    </a>
                  ) : (
                    <div className="p-4 bg-slate-50 border border-slate-100 rounded-2xl text-sm font-medium text-slate-500">
                      No file was attached to this submission.
                    </div>
                  )}
                </div>

                <div className="w-full h-px bg-slate-100 my-4"></div>

                {/* Grading Form */}
                <form id="grading-form" onSubmit={handleSubmitGrade} className="space-y-5">
                  {errorMsg && (
                    <div className="p-3 bg-red-50 border border-red-100 text-red-600 text-sm font-bold rounded-xl">
                      {errorMsg}
                    </div>
                  )}

                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest flex justify-between">
                      <span>Award Score</span>
                      <span className="text-indigo-500">Max: {selectedSub.assignments?.max_score}</span>
                    </label>
                    <div className="relative">
                      <input
                        type="number"
                        required
                        min="0"
                        max={selectedSub.assignments?.max_score}
                        value={score}
                        onChange={e => setScore(e.target.value)}
                        className="w-full bg-white border border-slate-200 focus:border-[#6C35DE] focus:ring-4 focus:ring-[#6C35DE]/10 rounded-2xl px-5 py-4 text-3xl font-black text-slate-800 text-center transition-all"
                        placeholder="0"
                      />
                      <div className="absolute right-5 top-1/2 -translate-y-1/2 text-slate-400 font-bold text-lg">
                        / {selectedSub.assignments?.max_score}
                      </div>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Instructor Feedback</label>
                    <textarea
                      required
                      rows="4"
                      value={feedback}
                      onChange={e => setFeedback(e.target.value)}
                      className="w-full bg-slate-50 border-transparent focus:border-[#6C35DE] focus:bg-white focus:ring-4 focus:ring-[#6C35DE]/10 rounded-2xl px-4 py-3 text-sm font-medium text-slate-700 transition-all resize-none"
                      placeholder="Excellent work on..."
                    />
                  </div>
                </form>
              </div>

              <footer className="p-6 border-t border-slate-100 bg-white">
                <button
                  type="submit"
                  form="grading-form"
                  disabled={submitting}
                  className="w-full py-4 bg-[#6C35DE] text-white rounded-2xl font-bold shadow-lg shadow-[#6C35DE]/20 hover:scale-[1.02] active:scale-95 transition-all flex items-center justify-center gap-2 disabled:opacity-50 disabled:hover:scale-100 disabled:active:scale-100"
                >
                  {submitting ? <Loader2 size={20} className="animate-spin" /> : 'Submit Grade & Award Points'}
                </button>
              </footer>
            </>
          )}
        </div>
      </div>
    </div>
  );
}



function AssignmentCreator() {
  const { profile, user } = useAuth();
  const [batches, setBatches] = useState([]);
  const [assignments, setAssignments] = useState([]);

  // Form State
  const [form, setForm] = useState({
    batch_id: '',
    title: '',
    description: '',
    due_date: '',
    max_score: 100,
    skill_category: 'Technical',
    is_published: false
  });

  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(true);
  const [toast, setToast] = useState('');

  // Edit State
  const [editingId, setEditingId] = useState(null);
  const [editForm, setEditForm] = useState({});

  useEffect(() => {
    if (profile) {
      loadData();
    }
  }, [profile]);

  async function loadData() {
    setFetching(true);
    try {
      // Load active batches for this instructor
      const { data: batchData } = await supabase
        .from('batches')
        .select('id, batch_code, courses(title)')
        .eq('instructor_id', profile.id)
        .eq('status', 'active');

      setBatches(batchData || []);
      if (batchData && batchData.length > 0) {
        setForm(f => ({ ...f, batch_id: batchData[0].id }));
      }

      // Load instructor's assignments
      const { data: assignData } = await supabase
        .from('assignments')
        .select('*, batches(batch_code)')
        .eq('created_by', user.id)
        .order('created_at', { ascending: false });

      setAssignments(assignData || []);
    } catch (err) {
      console.error(err);
    } finally {
      setFetching(false);
    }
  }

  const handleCreate = async (e) => {
    e.preventDefault();
    if (!form.batch_id || !form.title) {
      alert("Batch and Title are required.");
      return;
    }

    setLoading(true);
    try {
      const { data, error } = await supabase.from('assignments').insert({
        batch_id: form.batch_id,
        title: form.title,
        description: form.description,
        due_date: form.due_date || null,
        max_score: parseInt(form.max_score) || 100,
        skill_category: form.skill_category,
        is_published: form.is_published,
        created_by: user.id
      }).select('*, batches(batch_code)').single();

      if (error) throw error;

      setToast('Assignment created!');
      setTimeout(() => setToast(''), 3000);

      // Reset form
      setForm(f => ({
        ...f,
        title: '',
        description: '',
        due_date: '',
        max_score: 100,
        is_published: false
      }));

      setAssignments([data, ...assignments]);
    } catch (err) {
      alert(err.message || "Failed to create assignment");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!confirm('Are you sure you want to delete this assignment?')) return;
    try {
      const { error } = await supabase.from('assignments').delete().eq('id', id).eq('created_by', user.id);
      if (error) throw error;
      setAssignments(assignments.filter(a => a.id !== id));
    } catch (err) {
      alert(err.message);
    }
  };

  const startEditing = (assignment) => {
    setEditingId(assignment.id);
    setEditForm({
      title: assignment.title,
      description: assignment.description,
      due_date: assignment.due_date ? new Date(assignment.due_date).toISOString().slice(0, 16) : '',
      max_score: assignment.max_score,
      skill_category: assignment.skill_category,
      is_published: assignment.is_published
    });
  };

  const handleUpdate = async () => {
    if (!editForm.title) return;
    try {
      const { data, error } = await supabase.from('assignments').update({
        title: editForm.title,
        description: editForm.description,
        due_date: editForm.due_date || null,
        max_score: parseInt(editForm.max_score) || 100,
        skill_category: editForm.skill_category,
        is_published: editForm.is_published
      }).eq('id', editingId).eq('created_by', user.id).select('*, batches(batch_code)').single();

      if (error) throw error;

      setAssignments(assignments.map(a => a.id === editingId ? data : a));
      setEditingId(null);
    } catch (err) {
      alert(err.message);
    }
  };

  return (
    <div className="space-y-8">


      {/* CREATE FORM */}
      <section className="bg-white rounded-3xl p-8 shadow-sm border border-slate-100 relative">
        {toast && (
          <div className="absolute top-4 right-4 bg-emerald-100 text-emerald-700 px-4 py-2 rounded-xl text-sm font-bold flex items-center gap-2 animate-in fade-in slide-in-from-top-4">
            <CheckCircle2 size={16} /> {toast}
          </div>
        )}

        <form onSubmit={handleCreate} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Target Batch</label>
              <select
                required
                value={form.batch_id}
                onChange={e => setForm({ ...form, batch_id: e.target.value })}
                className="w-full bg-slate-50 border-none focus:ring-2 focus:ring-[#6C35DE] rounded-2xl px-4 py-3 text-sm font-bold text-slate-700"
              >
                {batches.map(b => (
                  <option key={b.id} value={b.id}>
                    {b.batch_code} - {b.courses?.title}
                  </option>
                ))}
              </select>
            </div>

            <div className="space-y-2">
              <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Assignment Title</label>
              <input
                required
                type="text"
                placeholder="e.g. Build a React App"
                value={form.title}
                onChange={e => setForm({ ...form, title: e.target.value })}
                className="w-full bg-slate-50 border-none focus:ring-2 focus:ring-[#6C35DE] rounded-2xl px-4 py-3 text-sm font-bold text-slate-700"
              />
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Description / Instructions</label>
            <textarea
              rows="3"
              placeholder="Detail the requirements..."
              value={form.description}
              onChange={e => setForm({ ...form, description: e.target.value })}
              className="w-full bg-slate-50 border-none focus:ring-2 focus:ring-[#6C35DE] rounded-2xl px-4 py-3 text-sm font-medium text-slate-700"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="space-y-2">
              <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Due Date</label>
              <input
                type="datetime-local"
                value={form.due_date}
                onChange={e => setForm({ ...form, due_date: e.target.value })}
                className="w-full bg-slate-50 border-none focus:ring-2 focus:ring-[#6C35DE] rounded-2xl px-4 py-3 text-sm font-bold text-slate-700"
              />
            </div>

            <div className="space-y-2">
              <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Max Score</label>
              <input
                type="number"
                min="1"
                value={form.max_score}
                onChange={e => setForm({ ...form, max_score: e.target.value })}
                className="w-full bg-slate-50 border-none focus:ring-2 focus:ring-[#6C35DE] rounded-2xl px-4 py-3 text-sm font-bold text-slate-700"
              />
            </div>

            <div className="space-y-2">
              <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Skill Category</label>
              <select
                value={form.skill_category}
                onChange={e => setForm({ ...form, skill_category: e.target.value })}
                className="w-full bg-slate-50 border-none focus:ring-2 focus:ring-[#6C35DE] rounded-2xl px-4 py-3 text-sm font-bold text-slate-700"
              >
                <option value="Consistency">Consistency</option>
                <option value="Technical">Technical</option>
                <option value="Conceptual">Conceptual</option>
                <option value="Participation">Participation</option>
              </select>
            </div>
          </div>

          <div className="flex items-center justify-between pt-4 border-t border-slate-100">
            <label className="flex items-center gap-3 cursor-pointer">
              <div className="relative">
                <input
                  type="checkbox"
                  className="sr-only peer"
                  checked={form.is_published}
                  onChange={e => setForm({ ...form, is_published: e.target.checked })}
                />
                <div className="w-11 h-6 bg-slate-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#6C35DE]"></div>
              </div>
              <span className="text-sm font-bold text-slate-600">Publish immediately</span>
            </label>

            <button
              type="submit"
              disabled={loading || !form.batch_id}
              className="px-8 py-3 bg-[#6C35DE] text-white rounded-xl font-bold shadow-lg shadow-[#6C35DE]/30 hover:scale-105 transition-all flex items-center gap-2 disabled:opacity-50 disabled:hover:scale-100"
            >
              {loading ? <Loader2 size={18} className="animate-spin" /> : 'Create Assignment'}
            </button>
          </div>
        </form>
      </section>

      {/* LIST SECTION */}
      <section className="space-y-4 pt-4">
        <h2 className="text-xl font-black text-slate-800">Your Assignments</h2>

        {fetching ? (
          <div className="flex justify-center p-8"><Loader2 className="animate-spin text-slate-400" /></div>
        ) : assignments.length === 0 ? (
          <div className="text-center p-8 bg-slate-50 rounded-3xl border border-dashed border-slate-200">
            <p className="text-slate-500 font-medium">No assignments created yet.</p>
          </div>
        ) : (
          <div className="grid gap-4">
            {assignments.map(a => editingId === a.id ? (
              <div key={a.id} className="bg-white p-6 rounded-2xl shadow-sm border border-indigo-100 space-y-4">
                <div className="flex justify-between items-center">
                  <h3 className="font-bold text-sm text-indigo-600 uppercase">Editing Assignment</h3>
                  <button onClick={() => setEditingId(null)} className="text-slate-400 hover:text-slate-600"><X size={20} /></button>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <input type="text" value={editForm.title} onChange={e => setEditForm({ ...editForm, title: e.target.value })} className="bg-slate-50 border-none rounded-xl text-sm font-bold" />
                  <input type="datetime-local" value={editForm.due_date} onChange={e => setEditForm({ ...editForm, due_date: e.target.value })} className="bg-slate-50 border-none rounded-xl text-sm font-bold" />
                  <input type="number" value={editForm.max_score} onChange={e => setEditForm({ ...editForm, max_score: e.target.value })} className="bg-slate-50 border-none rounded-xl text-sm font-bold" />
                  <select value={editForm.skill_category} onChange={e => setEditForm({ ...editForm, skill_category: e.target.value })} className="bg-slate-50 border-none rounded-xl text-sm font-bold">
                    <option value="Consistency">Consistency</option>
                    <option value="Technical">Technical</option>
                    <option value="Conceptual">Conceptual</option>
                    <option value="Participation">Participation</option>
                  </select>
                </div>
                <textarea value={editForm.description} onChange={e => setEditForm({ ...editForm, description: e.target.value })} className="w-full bg-slate-50 border-none rounded-xl text-sm font-medium" />
                <div className="flex items-center justify-between">
                  <label className="flex items-center gap-2 text-sm font-bold text-slate-600 cursor-pointer">
                    <input type="checkbox" checked={editForm.is_published} onChange={e => setEditForm({ ...editForm, is_published: e.target.checked })} className="rounded text-[#6C35DE]" />
                    Published
                  </label>
                  <button onClick={handleUpdate} className="px-6 py-2 bg-[#6C35DE] text-white rounded-lg font-bold text-sm">Save Changes</button>
                </div>
              </div>
            ) : (
              <div key={a.id} className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 flex flex-col md:flex-row gap-4 justify-between items-start md:items-center group hover:border-indigo-100 transition-colors">
                <div>
                  <div className="flex items-center gap-3 mb-1">
                    <h3 className="font-bold text-slate-800 text-lg">{a.title}</h3>
                    <span className={`text-[10px] font-black uppercase tracking-wider px-2 py-1 rounded-md ${a.is_published ? 'bg-emerald-100 text-emerald-700' : 'bg-slate-100 text-slate-500'}`}>
                      {a.is_published ? 'Published' : 'Draft'}
                    </span>
                  </div>
                  <div className="flex items-center gap-4 text-xs font-semibold text-slate-500">
                    <span className="flex items-center gap-1"><span className="material-symbols-outlined text-[14px]">groups</span> {a.batches?.batch_code || 'Unknown'}</span>
                    <span className="flex items-center gap-1"><span className="material-symbols-outlined text-[14px]">event</span> {a.due_date ? new Date(a.due_date).toLocaleDateString() : 'No Date'}</span>
                    <span className="flex items-center gap-1"><span className="material-symbols-outlined text-[14px]">star</span> {a.max_score} pts ({a.skill_category})</span>
                  </div>
                </div>
                <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                  <button onClick={() => startEditing(a)} className="p-2 text-slate-400 hover:text-[#6C35DE] bg-slate-50 hover:bg-indigo-50 rounded-lg transition-colors"><Edit2 size={18} /></button>
                  <button onClick={() => handleDelete(a.id)} className="p-2 text-slate-400 hover:text-red-500 bg-slate-50 hover:bg-red-50 rounded-lg transition-colors"><Trash2 size={18} /></button>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}


export function InstructorAssignments() {
  const [activeTab, setActiveTab] = useState('review');

  return (
    <div className="pt-24 p-8 max-w-7xl mx-auto space-y-6 h-[calc(100vh-2rem)] flex flex-col">
      <header className="flex flex-col md:flex-row md:items-center justify-between gap-6 shrink-0">
        <div>
          <h1 className="text-3xl font-black text-slate-800 tracking-tight">Assignments</h1>
          <p className="text-slate-500 font-medium mt-1">Manage and review all your assignments.</p>
        </div>
        <div className="flex bg-slate-100 p-1 rounded-2xl shrink-0">
          <button
            onClick={() => setActiveTab('review')}
            className={`px-6 py-2.5 rounded-xl text-sm font-bold transition-all ${activeTab === 'review' ? 'bg-white text-indigo-600 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}
          >
            Review Submissions
          </button>
          <button
            onClick={() => setActiveTab('manage')}
            className={`px-6 py-2.5 rounded-xl text-sm font-bold transition-all ${activeTab === 'manage' ? 'bg-white text-indigo-600 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}
          >
            Manage Assignments
          </button>
        </div>
      </header>

      <div className="flex-1 min-h-0 relative">
        {activeTab === 'review' && <AssignmentReview />}
        {activeTab === 'manage' && <div className="h-full overflow-y-auto no-scrollbar"><AssignmentCreator /></div>}
      </div>
    </div>
  );
}
