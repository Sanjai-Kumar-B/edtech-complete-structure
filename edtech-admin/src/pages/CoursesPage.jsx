import { useEffect, useState } from 'react';
import { supabase } from '@junospace/supabase-client';
import { useAuth } from '../context/AuthContext';

function CourseModal({ show, editingCourse, onClose, onSave }) {
  const [form, setForm] = useState({ title: '', code: '', department: '', status: 'draft', description: '', tags: '' });
  const [modules, setModules] = useState([{ title: '', description: '' }]);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (editingCourse) {
      setForm({
        title: editingCourse.title, code: editingCourse.code, department: editingCourse.department||'',
        status: editingCourse.status, description: editingCourse.description||'',
        tags: editingCourse.tags ? editingCourse.tags.join(', ') : ''
      });
      loadModules(editingCourse.id);
    } else {
      setForm({ title: '', code: '', department: '', status: 'draft', description: '', tags: '' });
      setModules([{ title: '', description: '' }]);
    }
  }, [editingCourse, show]);

  async function loadModules(id) {
    const { data } = await supabase.from('course_modules').select('*').eq('course_id', id).order('week_number');
    if (data && data.length > 0) {
      setModules(data.map(m => ({ title: m.title, description: m.description })));
    } else {
      setModules([{ title: '', description: '' }]);
    }
  }

  if (!show) return null;

  const handleAddModule = () => {
    if (modules.length < 24) setModules([...modules, { title: '', description: '' }]);
  };
  const handleRemoveModule = (i) => {
    setModules(modules.filter((_, idx) => idx !== i));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    let finalCode = form.code || ('C-' + Math.floor(1000 + Math.random() * 9000));
    const tagsArray = form.tags.split(',').map(t=>t.trim()).filter(Boolean);
    await onSave({ ...form, code: finalCode, tags: tagsArray }, modules, editingCourse?.id);
    setSaving(false);
  };

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-md overflow-y-auto">
      <div className="bg-white rounded-[2.5rem] shadow-2xl w-full max-w-4xl overflow-hidden my-8 flex flex-col max-h-[90vh] animate-in zoom-in-95 duration-200">
        <div className="p-10 border-b border-slate-100 bg-slate-50/50 flex justify-between items-center shrink-0">
          <div>
             <h2 className="text-3xl font-black text-slate-800">{editingCourse ? 'Architect Course' : 'Add a New Course'}</h2>
             <p className="text-[10px] font-black text-secondary uppercase tracking-[0.2em] mt-1">Curriculum Design Authority</p>
          </div>
          <button onClick={onClose} className="w-12 h-12 rounded-full hover:bg-slate-200 transition-colors flex items-center justify-center"><span className="material-symbols-outlined text-secondary">close</span></button>
        </div>
        <form onSubmit={handleSubmit} className="p-10 overflow-y-auto flex-1 space-y-10">
          <div className="space-y-6">
            <h3 className="text-xs font-black text-indigo-600 uppercase tracking-widest border-l-4 border-indigo-600 pl-4">I. Core Specifications</h3>
            <div className="grid grid-cols-2 gap-8">
              <div className="space-y-2">
                 <label className="text-[10px] font-black text-secondary uppercase tracking-widest ml-1">Academic Title *</label>
                 <input required value={form.title} onChange={e=>setForm({...form, title: e.target.value})} className="w-full bg-slate-50 border-none rounded-2xl px-6 py-4 text-sm font-bold text-slate-800 focus:ring-4 focus:ring-indigo-500/10 transition-all" placeholder="e.g. Advanced Quantum Computing" />
              </div>
              <div className="space-y-2">
                 <label className="text-[10px] font-black text-secondary uppercase tracking-widest ml-1">Registry Code</label>
                 <input value={form.code} onChange={e=>setForm({...form, code: e.target.value})} className="w-full bg-slate-50 border-none rounded-2xl px-6 py-4 text-sm font-bold text-slate-800 focus:ring-4 focus:ring-indigo-500/10 transition-all" placeholder="QC-402 (Auto if blank)" />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-8">
              <div className="space-y-2">
                 <label className="text-[10px] font-black text-secondary uppercase tracking-widest ml-1">Department</label>
                 <input value={form.department} onChange={e=>setForm({...form, department: e.target.value})} className="w-full bg-slate-50 border-none rounded-2xl px-6 py-4 text-sm font-bold text-slate-800 focus:ring-4 focus:ring-indigo-500/10 transition-all" placeholder="e.g. Theoretical Physics" />
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-black text-secondary uppercase tracking-widest ml-1">Deployment Status</label>
                <select value={form.status} onChange={e=>setForm({...form, status: e.target.value})} className="w-full bg-slate-50 border-none rounded-2xl px-6 py-4 text-sm font-bold text-slate-800 focus:ring-4 focus:ring-indigo-500/10 transition-all">
                  <option value="draft">Draft - Restricted</option>
                  <option value="active">Active - Global Access</option>
                </select>
              </div>
            </div>
            <div className="space-y-2">
               <label className="text-[10px] font-black text-secondary uppercase tracking-widest ml-1">Course Narrative</label>
               <textarea required rows={4} value={form.description} onChange={e=>setForm({...form, description: e.target.value})} className="w-full bg-slate-50 border-none rounded-2xl px-6 py-4 text-sm font-bold text-slate-800 focus:ring-4 focus:ring-indigo-500/10 transition-all" placeholder="Describe the learning outcomes and objectives..." />
            </div>
          </div>

          <div className="space-y-6 pt-4">
            <div className="flex justify-between items-center border-l-4 border-indigo-600 pl-4">
              <h3 className="text-xs font-black text-indigo-600 uppercase tracking-widest">II. Syllabus Modules ({modules.length})</h3>
              <button type="button" onClick={handleAddModule} disabled={modules.length>=24} className="text-[10px] font-black text-indigo-600 bg-indigo-50 px-4 py-2 rounded-full hover:bg-indigo-600 hover:text-white transition-all">+ Append Module</button>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {modules.map((m, i) => (
                <div key={i} className="flex gap-4 items-start bg-slate-50/50 p-6 rounded-[2rem] border border-slate-100 group">
                  <div className="w-12 h-12 rounded-2xl bg-white shadow-sm flex items-center justify-center font-black text-indigo-600 text-xs shrink-0">{i+1}</div>
                  <div className="flex-1 space-y-3">
                    <input required placeholder="Module Identity" value={m.title} onChange={e=>{const n=[...modules];n[i].title=e.target.value;setModules(n);}} className="w-full bg-transparent border-b-2 border-slate-200 py-1 font-black text-slate-800 text-sm focus:border-indigo-600 transition-colors outline-none" />
                    <input placeholder="Objective summary" value={m.description} onChange={e=>{const n=[...modules];n[i].description=e.target.value;setModules(n);}} className="w-full bg-transparent text-xs font-medium text-secondary outline-none" />
                  </div>
                  {modules.length > 1 && <button type="button" onClick={()=>handleRemoveModule(i)} className="text-slate-300 hover:text-red-500 transition-colors"><span className="material-symbols-outlined text-[20px]">delete</span></button>}
                </div>
              ))}
            </div>
          </div>
        </form>
        <div className="p-10 border-t border-slate-100 flex gap-6 bg-slate-50/30 shrink-0">
          <button type="button" onClick={onClose} className="flex-1 py-4 border-2 border-slate-200 rounded-2xl font-black text-secondary hover:bg-slate-100 transition-all uppercase tracking-widest text-[10px]">Abandon</button>
          <button onClick={handleSubmit} disabled={saving} className="flex-1 py-4 bg-slate-900 text-white rounded-2xl font-black shadow-xl hover:scale-[1.02] active:scale-95 transition-all uppercase tracking-widest text-[10px]">
            {saving ? 'Synchronizing Intelligence...' : 'Commit to Registry'}
          </button>
        </div>
      </div>
    </div>
  );
}

export function CoursesPage() {
  const { profile } = useAuth();
  const [loading, setLoading] = useState(true);
  const [courses, setCourses] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [editingCourse, setEditingCourse] = useState(null);

  useEffect(() => { loadCourses(); }, []);

  async function loadCourses() {
    setLoading(true);
    const { data } = await supabase.from('courses').select('*, course_modules(count), batches!batches_course_id_fkey(count)').order('created_at', { ascending: false });
    setCourses(data || []);
    setLoading(false);
  }

  const exportCSV = () => {
    if (!courses.length) return;
    const rows = courses.map(c => `"${c.code}","${c.title}","${c.department}","${c.status}","${c.batches[0]?.count||0}"`).join('\n');
    const blob = new Blob(['Code,Title,Department,Status,Batches\n' + rows], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a'); a.href = url; a.download = `curriculum_audit.csv`; a.click();
  };

  const handleSaveCourse = async (courseData, modulesData, existingId) => {
    try {
      let cId = existingId;
      if (existingId) {
        const { error } = await supabase.from('courses').update({
          title: courseData.title, code: courseData.code, department: courseData.department,
          status: courseData.status, description: courseData.description, tags: courseData.tags
        }).eq('id', existingId);
        if (error) throw error;
        await supabase.from('course_modules').delete().eq('course_id', existingId);
      } else {
        const { data, error } = await supabase.from('courses').insert({
          title: courseData.title, code: courseData.code, department: courseData.department,
          status: courseData.status, description: courseData.description, tags: courseData.tags,
          created_by: profile.id
        }).select().single();
        if (error) throw error;
        cId = data.id;
      }
      if (modulesData.length > 0) {
        await supabase.from('course_modules').insert(modulesData.map((m, i) => ({
          course_id: cId, week_number: i + 1, title: m.title, description: m.description
        })));
      }
      setShowModal(false); setEditingCourse(null); loadCourses();
    } catch (err) { alert(err.message); }
  };

  const handleDelete = async (c) => {
    if ((c.batches?.[0]?.count || 0) > 0) return alert("Cannot purge courses with active batch deployments.");
    if (confirm(`Purge course ${c.code} from global registry?`)) {
      await supabase.from('courses').delete().eq('id', c.id);
      loadCourses();
    }
  };

  if (loading) return <div className="p-8 pt-24 text-center"><p className="text-secondary font-black uppercase tracking-widest text-[10px]">Loading Curriculum Intelligence...</p></div>;

  return (
    <div className="p-8 pt-24 space-y-10 max-w-[1600px] mx-auto animate-in fade-in duration-500">
      <CourseModal show={showModal} editingCourse={editingCourse} onClose={()=>{setShowModal(false);setEditingCourse(null);}} onSave={handleSaveCourse} />

      <header className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h1 className="text-4xl font-black text-slate-800 tracking-tight leading-none">Curriculum Registry</h1>
          <p className="text-secondary font-medium mt-3">Architecting the future of knowledge through structured modules.</p>
        </div>
        <div className="flex gap-4">
          <button onClick={exportCSV} className="px-6 py-3.5 bg-white border border-slate-200 text-slate-600 rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-slate-50 transition-all flex items-center gap-2 shadow-sm">
            <span className="material-symbols-outlined text-[20px]">download</span> Audit
          </button>
          <button onClick={()=>setShowModal(true)} className="px-8 py-3.5 bg-indigo-600 text-white rounded-2xl font-black text-xs uppercase tracking-widest hover:scale-105 transition-all flex items-center gap-2 shadow-xl shadow-indigo-600/20">
            <span className="material-symbols-outlined text-[20px]">add</span> Add Course
          </button>
        </div>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8">
        {courses.map(c => (
          <div key={c.id} className="bg-white rounded-[2.5rem] p-10 shadow-xl shadow-slate-200/50 border border-slate-100 flex flex-col group relative overflow-hidden transition-all hover:scale-[1.02]">
            <div className="absolute top-0 right-0 w-32 h-32 bg-slate-50 rounded-full -mr-16 -mt-16 group-hover:bg-indigo-50 transition-colors"></div>
            
            <div className="flex justify-between items-start mb-8 relative z-10">
              <span className={`px-4 py-1.5 rounded-full text-[9px] font-black uppercase tracking-widest ${c.status==='active'?'bg-emerald-50 text-emerald-600 border border-emerald-100':'bg-amber-50 text-amber-600 border border-amber-100'}`}>{c.status}</span>
              <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-all">
                <button onClick={()=>{setEditingCourse(c);setShowModal(true);}} className="w-10 h-10 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center hover:bg-indigo-600 hover:text-white shadow-sm transition-all"><span className="material-symbols-outlined text-[20px]">edit_note</span></button>
                <button onClick={()=>handleDelete(c)} className="w-10 h-10 rounded-xl bg-red-50 text-red-500 flex items-center justify-center hover:bg-red-500 hover:text-white shadow-sm transition-all"><span className="material-symbols-outlined text-[20px]">delete_sweep</span></button>
              </div>
            </div>
            
            <div className="flex-1 relative z-10">
              <h3 className="font-black text-2xl text-slate-800 leading-tight mb-2 group-hover:text-indigo-600 transition-colors">{c.title}</h3>
              <p className="text-[10px] font-black text-indigo-600 tracking-[0.2em] mb-6 flex items-center gap-2">
                 {c.code} <span className="w-1.5 h-1.5 rounded-full bg-slate-200"></span> {c.department}
              </p>
              <p className="text-sm text-secondary font-medium line-clamp-3 leading-relaxed mb-8">{c.description}</p>
            </div>

            <div className="flex items-center gap-6 pt-8 border-t border-slate-50 relative z-10">
              <div className="flex items-center gap-2.5 text-[10px] font-black text-slate-400 uppercase tracking-widest"><span className="material-symbols-outlined text-[20px] text-indigo-300">view_module</span> {c.course_modules[0]?.count||0} Nodes</div>
              <div className="flex items-center gap-2.5 text-[10px] font-black text-slate-400 uppercase tracking-widest"><span className="material-symbols-outlined text-[20px] text-indigo-300">groups</span> {c.batches[0]?.count||0} Cohorts</div>
            </div>
          </div>
        ))}
        {courses.length === 0 && <div className="col-span-full py-32 text-center bg-slate-50/50 rounded-[3rem] border-2 border-dashed border-slate-200"><p className="text-secondary font-black text-xs uppercase tracking-[0.3em]">No courses found in global registry.</p></div>}
      </div>
    </div>
  );
}
                  <span className="font-mono text-xs font-bold text-slate-500 uppercase">{createForm.thumbnail_color}</span>
                </div>
              </div>
            </div>

            <div className="flex gap-4">
              <button 
                type="submit" 
                disabled={creating}
                className="px-8 py-3 bg-indigo-600 text-white rounded-xl font-bold shadow-lg shadow-indigo-600/10 hover:bg-indigo-700 transition-all disabled:opacity-50"
              >
                {creating ? 'Architecting...' : 'Save Blueprint'}
              </button>
              <button 
                type="button" 
                onClick={() => setShowCreateForm(false)} 
                className="px-8 py-3 border border-slate-200 rounded-xl font-bold text-slate-600 hover:bg-slate-100 transition-all"
              >
                Discard
              </button>
            </div>
          </form>
        </section>
      )}

      {/* COURSE CARDS */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {loading ? (
          <div className="col-span-full py-20 text-center font-bold text-slate-400">Loading curriculum library...</div>
        ) : courses.length === 0 ? (
          <div className="col-span-full py-20 text-center font-bold text-slate-400">No courses in registry.</div>
        ) : (
          courses.map(c => {
            const isEditing = editingId === c.id;
            const isDeleting = deletingId === c.id;

            if (isEditing) {
              return (
                <div key={c.id} className="bg-slate-50 border-2 border-indigo-500 rounded-[2.5rem] p-8 space-y-4 animate-in zoom-in-95 duration-200">
                  <div className="space-y-2">
                    <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Title</label>
                    <input 
                      value={editForm.title} 
                      onChange={e => setEditForm({ ...editForm, title: e.target.value })} 
                      className="w-full bg-white border border-slate-200 rounded-xl px-4 py-2 text-sm font-bold" 
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Department</label>
                    <input 
                      value={editForm.department} 
                      onChange={e => setEditForm({ ...editForm, department: e.target.value })} 
                      className="w-full bg-white border border-slate-200 rounded-xl px-4 py-2 text-sm font-bold" 
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Description</label>
                    <textarea 
                      value={editForm.description} 
                      onChange={e => setEditForm({ ...editForm, description: e.target.value })} 
                      className="w-full bg-white border border-slate-200 rounded-xl px-4 py-2 text-sm font-medium"
                      rows="2"
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <div className="space-y-1">
                      <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Status</label>
                      <select 
                        value={editForm.status} 
                        onChange={e => setEditForm({ ...editForm, status: e.target.value })} 
                        className="w-full bg-white border border-slate-200 rounded-xl px-3 py-1.5 text-xs font-bold"
                      >
                        <option value="draft">Draft</option>
                        <option value="active">Active</option>
                      </select>
                    </div>
                    <div className="space-y-1">
                      <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Color</label>
                      <input 
                        type="color" 
                        value={editForm.thumbnail_color} 
                        onChange={e => setEditForm({ ...editForm, thumbnail_color: e.target.value })} 
                        className="w-full h-8 cursor-pointer rounded-xl" 
                      />
                    </div>
                  </div>
                  <div className="flex gap-2 pt-2">
                    <button 
                      onClick={() => handleUpdateCourse(c.id)} 
                      disabled={updating}
                      className="flex-1 py-2 bg-indigo-600 text-white text-xs font-bold rounded-xl"
                    >
                      {updating ? 'Saving...' : 'Save'}
                    </button>
                    <button 
                      onClick={() => setEditingId(null)} 
                      className="flex-1 py-2 bg-slate-200 text-slate-700 text-xs font-bold rounded-xl"
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              );
            }

            return (
              <div key={c.id} className="bg-white rounded-[2.5rem] border border-slate-100 shadow-lg shadow-slate-200/40 overflow-hidden flex flex-col justify-between group hover:shadow-xl transition-all duration-300 relative">
                
                {/* Visual Accent Box */}
                <div 
                  className="h-32 w-full relative flex items-center justify-center font-mono text-3xl font-black text-white/40 tracking-widest"
                  style={{ backgroundColor: c.thumbnail_color || '#6C35DE' }}
                >
                  {c.code}
                </div>

                <div className="p-8 flex-1 flex flex-col justify-between space-y-6">
                  <div>
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-[10px] font-black text-indigo-600 uppercase tracking-widest">{c.department || 'General'}</span>
                      <span className={`px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-widest ${c.status === 'active' ? 'bg-emerald-50 text-emerald-600 border border-emerald-100' : 'bg-amber-50 text-amber-600 border border-amber-100'}`}>
                        {c.status}
                      </span>
                    </div>
                    <h3 className="text-xl font-black text-slate-800 leading-tight group-hover:text-indigo-600 transition-colors">
                      {c.title}
                    </h3>
                    <p className="text-sm text-slate-500 font-medium mt-3 line-clamp-3 leading-relaxed">
                      {c.description || 'No blueprint description provided.'}
                    </p>
                  </div>

                  <div className="pt-6 border-t border-slate-50 flex justify-between items-center">
                    <span className="text-[9px] font-bold text-slate-400 uppercase tracking-widest">
                      Added {c.created_at ? new Date(c.created_at).toLocaleDateString() : 'N/A'}
                    </span>
                    
                    {isDeleting ? (
                      <div className="flex gap-2 animate-in fade-in duration-200">
                        <button 
                          onClick={() => handleDeleteCourse(c.id)} 
                          className="px-3 py-1.5 bg-red-600 text-white text-xs font-bold rounded-lg"
                        >
                          Confirm
                        </button>
                        <button 
                          onClick={() => setDeletingId(null)} 
                          className="px-3 py-1.5 bg-slate-100 text-slate-700 text-xs font-bold rounded-lg"
                        >
                          Cancel
                        </button>
                      </div>
                    ) : (
                      <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                        <button 
                          onClick={() => handleStartEdit(c)} 
                          className="w-8 h-8 rounded-lg bg-slate-50 text-indigo-600 flex items-center justify-center hover:bg-indigo-600 hover:text-white transition-all"
                        >
                          <span className="material-symbols-outlined text-[16px]">edit</span>
                        </button>
                        <button 
                          onClick={() => setDeletingId(c.id)} 
                          className="w-8 h-8 rounded-lg bg-red-50 text-red-500 flex items-center justify-center hover:bg-red-500 hover:text-white transition-all"
                        >
                          <span className="material-symbols-outlined text-[16px]">delete</span>
                        </button>
                      </div>
                    )}
                  </div>
                </div>

              </div>
            );
          })
        )}
      </div>

    </div>
  );
}
