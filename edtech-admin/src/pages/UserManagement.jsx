import { useEffect, useState } from 'react';
import { supabase } from '@junospace/supabase-client';
import { useAuth } from '../context/AuthContext';

function UserModal({ show, type, editingUser, onClose, onSave, activeCourses }) {
  const [form, setForm] = useState({
    full_name: '', email: '', password: '', role: type.toLowerCase(), phone: '', date_of_birth: '',
    address: '', avatar_color: '#6C35DE', avatar_file: null, department: '', specialization: '', bio: '', courses: []
  });
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (editingUser) {
      setForm({
        ...form, full_name: editingUser.full_name||'', email: editingUser.email||'', phone: editingUser.phone||'',
        date_of_birth: editingUser.date_of_birth||'', address: editingUser.address||'', avatar_color: editingUser.avatar_color||'#6C35DE',
        department: editingUser.department||'', specialization: editingUser.specialization||'', bio: editingUser.bio||'', role: editingUser.role
      });
    } else {
      setForm({ 
        full_name: '', email: '', password: '', role: type.toLowerCase(), phone: '', date_of_birth: '',
        address: '', avatar_color: '#6C35DE', avatar_file: null, department: '', specialization: '', bio: '', courses: []
      });
    }
  }, [editingUser, type, show]);

  if (!show) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    await onSave(form, editingUser?.id);
    setSaving(false);
  };

  const handleCourseToggle = (id) => {
    setForm(p => ({
      ...p, courses: p.courses.includes(id) ? p.courses.filter(x=>x!==id) : [...p.courses, id]
    }));
  };

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-md overflow-y-auto">
      <div className="bg-white rounded-[2rem] shadow-2xl w-full max-w-2xl overflow-hidden my-8 animate-in zoom-in-95 duration-200">
        <div className="p-8 border-b border-slate-100 bg-slate-50/50 flex justify-between items-center">
          <div>
            <h2 className="text-2xl font-black text-slate-800">{editingUser ? 'Edit Identity' : `Add ${type}`}</h2>
            <p className="text-xs text-secondary font-bold uppercase tracking-widest mt-1">Personnel Management</p>
          </div>
          <button onClick={onClose} className="w-10 h-10 rounded-full hover:bg-slate-200 transition-colors flex items-center justify-center"><span className="material-symbols-outlined text-secondary">close</span></button>
        </div>
        <form onSubmit={handleSubmit} className="p-8 space-y-6 max-h-[70vh] overflow-y-auto">
          <div className="grid grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="text-[10px] font-black text-secondary uppercase tracking-widest ml-1">Full Name *</label>
              <input required value={form.full_name} onChange={e=>setForm({...form, full_name: e.target.value})} className="w-full bg-slate-50 border-none rounded-2xl px-5 py-3 text-sm font-bold text-slate-800 focus:ring-2 focus:ring-indigo-500/20" />
            </div>
            <div className="space-y-2">
              <label className="text-[10px] font-black text-secondary uppercase tracking-widest ml-1">Email Address *</label>
              <input required type="email" disabled={!!editingUser} value={form.email} onChange={e=>setForm({...form, email: e.target.value})} className="w-full bg-slate-50 border-none rounded-2xl px-5 py-3 text-sm font-bold text-slate-800 disabled:opacity-60 focus:ring-2 focus:ring-indigo-500/20" />
            </div>
          </div>
          
          {(!editingUser || form.password !== undefined) && (
            <div className="space-y-2">
              <label className="text-[10px] font-black text-secondary uppercase tracking-widest ml-1">{editingUser ? 'Reset Password (optional)' : 'Temporary Password *'}</label>
              <input required={!editingUser} value={form.password} onChange={e=>setForm({...form, password: e.target.value})} className="w-full bg-slate-50 border-none rounded-2xl px-5 py-3 text-sm font-bold text-slate-800 focus:ring-2 focus:ring-indigo-500/20" type="text" placeholder={editingUser ? "Leave blank to keep current" : "Min 6 characters"} />
            </div>
          )}

          <div className="grid grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="text-[10px] font-black text-secondary uppercase tracking-widest ml-1">Role Type</label>
              <select value={form.role} onChange={e=>setForm({...form, role: e.target.value})} className="w-full bg-slate-50 border-none rounded-2xl px-5 py-3 text-sm font-bold text-slate-800 focus:ring-2 focus:ring-indigo-500/20">
                 <option value="student">Student</option>
                 <option value="instructor">Instructor</option>
                 <option value="staff">Staff</option>
                 <option value="admin">Administrator</option>
              </select>
            </div>
            <div className="space-y-2">
               <label className="text-[10px] font-black text-secondary uppercase tracking-widest ml-1">Phone Number</label>
               <input value={form.phone} onChange={e=>setForm({...form, phone: e.target.value})} className="w-full bg-slate-50 border-none rounded-2xl px-5 py-3 text-sm font-bold text-slate-800 focus:ring-2 focus:ring-indigo-500/20" />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="text-[10px] font-black text-secondary uppercase tracking-widest ml-1">Department</label>
              <input value={form.department} onChange={e=>setForm({...form, department: e.target.value})} className="w-full bg-slate-50 border-none rounded-2xl px-5 py-3 text-sm font-bold text-slate-800 focus:ring-2 focus:ring-indigo-500/20" placeholder="e.g. Computer Science" />
            </div>
            <div className="space-y-2">
              <label className="text-[10px] font-black text-secondary uppercase tracking-widest ml-1">Specialization</label>
              <input value={form.specialization} onChange={e=>setForm({...form, specialization: e.target.value})} className="w-full bg-slate-50 border-none rounded-2xl px-5 py-3 text-sm font-bold text-slate-800 focus:ring-2 focus:ring-indigo-500/20" placeholder="e.g. AI / ML" />
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-[10px] font-black text-secondary uppercase tracking-widest ml-1">Avatar Preset</label>
            <div className="flex gap-3">
              {['#6C35DE', '#185FA5', '#0F6E56', '#B05538', '#185F8A', '#7C3AED'].map(c => (
                <button type="button" key={c} onClick={()=>setForm({...form, avatar_color: c})} className={`w-10 h-10 rounded-full transition-all ${form.avatar_color===c ? 'ring-4 ring-indigo-500/20 scale-110 shadow-lg':''}`} style={{ backgroundColor: c }}></button>
              ))}
            </div>
          </div>
        </form>
        <div className="p-8 border-t border-slate-100 flex gap-4 bg-slate-50/30">
          <button type="button" onClick={onClose} className="flex-1 py-4 border-2 border-slate-200 rounded-2xl font-bold text-secondary hover:bg-slate-100 transition-colors">Cancel</button>
          <button onClick={handleSubmit} disabled={saving} className="flex-1 py-4 bg-indigo-600 text-white rounded-2xl font-bold shadow-xl shadow-indigo-600/20 hover:scale-[1.02] active:scale-95 transition-all">
            {saving ? 'Synchronizing...' : 'Commit Changes'}
          </button>
        </div>
      </div>
    </div>
  );
}

export function UserManagement() {
  const { profile } = useAuth();
  
  const [loading, setLoading] = useState(true);
  const [users, setUsers] = useState({ student: [], instructor: [], admin: [], staff: [] });
  const [activeCourses, setActiveCourses] = useState([]);
  
  const [tab, setTab] = useState('student');
  const [search, setSearch] = useState('');
  const [stats, setStats] = useState({ total: 0, actStudents: 0, instructors: 0, avgEng: 0 });
  
  const [showModal, setShowModal] = useState(false);
  const [editingUser, setEditingUser] = useState(null);

  useEffect(() => {
    loadData();
  }, []);

  async function loadData() {
    setLoading(true);
    const [
      { data: students },
      { data: instructors },
      { data: admins },
      { data: staff },
      { data: courses }
    ] = await Promise.all([
      supabase.from('users').select('*').eq('role', 'student').order('created_at', { ascending: false }),
      supabase.from('users').select('*').eq('role', 'instructor').order('created_at', { ascending: false }),
      supabase.from('users').select('*').eq('role', 'admin').order('created_at', { ascending: false }),
      supabase.from('users').select('*').eq('role', 'staff').order('created_at', { ascending: false }),
      supabase.from('courses').select('id, title').eq('status', 'active')
    ]);

    setUsers({ 
      student: students||[], 
      instructor: instructors||[], 
      admin: admins||[],
      staff: staff||[]
    });
    setActiveCourses(courses||[]);

    const total = (students?.length||0) + (instructors?.length||0) + (admins?.length||0) + (staff?.length||0);
    const actStudents = students?.filter(s=>s.is_active).length || 0;
    
    setStats({ total, actStudents, instructors: instructors?.length||0, avgEng: 0 });
    setLoading(false);
  }

  const exportCSV = () => {
    const data = users[tab];
    if (!data.length) return;
    const header = Object.keys(data[0]).join(',');
    const rows = data.map(obj => Object.values(obj).map(v => `"${v}"`).join(',')).join('\n');
    const blob = new Blob([header + '\n' + rows], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url; a.download = `${tab}_users.csv`; a.click();
  };

  const handleToggleActive = async (user) => {
    await supabase.from('users').update({ is_active: !user.is_active }).eq('id', user.id);
    loadData();
  };

  const handleDeleteUser = async (id) => {
    if (!confirm('Are you sure? This will NOT delete the auth user, only the profile record. Admin deletion of Auth users requires Edge Functions or Service Role.')) return;
    const { error } = await supabase.from('users').delete().eq('id', id);
    if (!error) loadData();
    else alert(error.message);
  }

  const handleSaveUser = async (form, existingId) => {
    try {
      if (existingId) {
        // Edit existing user profile
        const updates = {
          full_name: form.full_name, phone: form.phone, address: form.address,
          date_of_birth: form.date_of_birth, avatar_color: form.avatar_color,
          department: form.department, specialization: form.specialization, bio: form.bio,
          role: form.role
        };
        const { error } = await supabase.from('users').update(updates).eq('id', existingId);
        if (error) throw error;
      } else {
        // Create new user via Edge Function (uses service role server-side)
        const { data: { session } } = await supabase.auth.getSession();
        const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
        const res = await fetch(`${supabaseUrl}/functions/v1/create-user`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${session?.access_token || import.meta.env.VITE_SUPABASE_ANON_KEY}`,
          },
          body: JSON.stringify({
            email: form.email,
            password: form.password,
            full_name: form.full_name,
            role: form.role,
          }),
        });
        const result = await res.json();
        if (!res.ok || result.error) {
          throw new Error(result.error || 'Failed to create user.');
        }
        // If additional profile fields need to be updated after creation:
        if (result.user?.id && (form.phone || form.department || form.specialization)) {
          await supabase.from('users').update({
            phone: form.phone, department: form.department,
            specialization: form.specialization, avatar_color: form.avatar_color
          }).eq('id', result.user.id);
        }
      }
      setShowModal(false);
      setEditingUser(null);
      loadData();
    } catch (err) {
      alert(err.message);
    }
  };

  if (loading) return <div className="p-8 pt-24 text-center"><div className="animate-spin w-8 h-8 border-4 border-primary border-t-transparent rounded-full mx-auto mb-4"></div><p className="text-secondary font-bold">Synchronizing Global Personnel Registry...</p></div>;

  const currentData = users[tab].filter(u => 
    u.full_name?.toLowerCase().includes(search.toLowerCase()) || 
    u.email?.toLowerCase().includes(search.toLowerCase()) ||
    u.login_id?.toLowerCase().includes(search.toLowerCase())
  );

  const tabLabel = { student: 'Students', instructor: 'Instructors', admin: 'Admins', staff: 'Staff' };

  return (
    <div className="p-8 pt-24 space-y-10 max-w-[1600px] mx-auto animate-in fade-in duration-500">
      <UserModal show={showModal} type={tabLabel[tab]} editingUser={editingUser} onClose={()=>{setShowModal(false);setEditingUser(null);}} onSave={handleSaveUser} activeCourses={activeCourses} />

      <header className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h1 className="text-4xl font-black text-slate-800 tracking-tight leading-none">Global Personnel</h1>
          <p className="text-secondary font-medium mt-3">Identity Management & Platform Access Control</p>
        </div>
        <div className="flex items-center gap-3">
          <div className="relative">
            <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 text-[20px]">search</span>
            <input value={search} onChange={e=>setSearch(e.target.value)} placeholder="Search ID, Name or Email..." className="pl-12 pr-6 py-3.5 bg-white border border-slate-200 rounded-2xl text-sm font-bold w-64 shadow-sm focus:ring-4 focus:ring-indigo-500/5 transition-all" />
          </div>
          <button onClick={exportCSV} className="p-3.5 bg-white border border-slate-200 text-slate-600 rounded-2xl hover:bg-slate-50 transition-colors shadow-sm"><span className="material-symbols-outlined text-[20px]">download</span></button>
          <button onClick={()=>setShowModal(true)} className="px-8 py-3.5 bg-indigo-600 text-white rounded-2xl font-bold shadow-xl shadow-indigo-600/20 hover:scale-105 transition-all flex items-center gap-2">
            <span className="material-symbols-outlined text-[20px]">person_add</span> Add {tabLabel[tab]}
          </button>
        </div>
      </header>

      {/* STATS */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        {[
          { label: 'Total Personnel', val: stats.total, color: 'text-slate-800', bg: 'bg-white' },
          { label: 'Active Students', val: stats.actStudents, color: 'text-emerald-600', bg: 'bg-emerald-50 border-emerald-100' },
          { label: 'Lead Instructors', val: stats.instructors, color: 'text-indigo-600', bg: 'bg-indigo-50 border-indigo-100' },
          { label: 'Engage Velocity', val: `${stats.avgEng}%`, color: 'text-amber-600', bg: 'bg-amber-50 border-amber-100' },
        ].map(s => (
          <div key={s.label} className={`p-8 rounded-[2rem] border shadow-sm ${s.bg}`}>
            <p className="text-[10px] font-black text-secondary uppercase tracking-[0.2em] mb-2">{s.label}</p>
            <p className={`text-4xl font-black ${s.color}`}>{s.val}</p>
          </div>
        ))}
      </div>

      <div className="bg-white rounded-[2.5rem] shadow-xl shadow-slate-200/50 border border-slate-100 overflow-hidden">
        {/* Tab System */}
        <div className="flex bg-slate-50/50 p-2 gap-1 border-b border-slate-100">
          {Object.keys(tabLabel).map(key => (
            <button key={key} onClick={()=>setTab(key)} className={`flex-1 py-4 px-6 rounded-2xl text-sm font-black transition-all ${tab===key ? 'bg-white text-indigo-600 shadow-sm border border-slate-200/50' : 'text-slate-400 hover:text-slate-600 hover:bg-white/50'}`}>
              {tabLabel[key]} <span className="ml-2 px-2 py-0.5 bg-slate-100 rounded-lg text-[10px]">{users[key].length}</span>
            </button>
          ))}
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="border-b border-slate-100">
                <th className="px-8 py-5 text-[10px] font-black text-secondary uppercase tracking-widest">Identity</th>
                <th className="px-8 py-5 text-[10px] font-black text-secondary uppercase tracking-widest">Global ID</th>
                <th className="px-8 py-5 text-[10px] font-black text-secondary uppercase tracking-widest text-center">Security Status</th>
                <th className="px-8 py-5 text-[10px] font-black text-secondary uppercase tracking-widest">Affiliation</th>
                <th className="px-8 py-5 text-[10px] font-black text-secondary uppercase tracking-widest text-right">Operations</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {currentData.map(u => (
                <tr key={u.id} className={`group hover:bg-slate-50/50 transition-colors ${!u.is_active?'opacity-50 grayscale':''}`}>
                  <td className="px-8 py-5">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 rounded-2xl flex items-center justify-center font-black text-white text-lg shrink-0 shadow-lg" style={{backgroundColor: u.avatar_color||'#ccc'}}>{u.avatar_initials || u.full_name?.charAt(0)}</div>
                      <div>
                        <p className="font-black text-slate-800 text-sm">{u.full_name}</p>
                        <p className="text-[11px] text-secondary font-medium">{u.email}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-8 py-5">
                     <span className="font-mono text-[11px] font-bold text-slate-500 bg-slate-100 px-3 py-1 rounded-lg">{u.login_id || 'N/A'}</span>
                  </td>
                  <td className="px-8 py-5 text-center">
                    <button onClick={()=>handleToggleActive(u)} className={`px-4 py-1.5 rounded-xl text-[10px] font-black tracking-widest uppercase transition-all ${u.is_active?'bg-emerald-50 text-emerald-600 border border-emerald-100':'bg-red-50 text-red-600 border border-red-100'}`}>
                      {u.is_active?'ACTIVE':'INACTIVE'}
                    </button>
                  </td>
                  <td className="px-8 py-5">
                    <div className="space-y-1">
                       <p className="text-xs font-bold text-slate-700">{u.department || 'General'}</p>
                       <p className="text-[10px] text-secondary font-medium italic">{u.specialization || 'Unspecified'}</p>
                    </div>
                  </td>
                  <td className="px-8 py-5 text-right">
                    <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                      <button onClick={()=>{setEditingUser(u);setShowModal(true);}} className="w-10 h-10 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center hover:bg-indigo-600 hover:text-white transition-all shadow-sm"><span className="material-symbols-outlined text-[18px]">edit</span></button>
                      <button onClick={()=>handleDeleteUser(u.id)} className="w-10 h-10 rounded-xl bg-red-50 text-red-400 flex items-center justify-center hover:bg-red-500 hover:text-white transition-all shadow-sm"><span className="material-symbols-outlined text-[18px]">delete</span></button>
                    </div>
                  </td>
                </tr>
              ))}
              {currentData.length === 0 && <tr><td colSpan="5" className="p-20 text-center text-secondary font-bold">No records matched your search criteria.</td></tr>}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
                    value={createForm.email} 
                    onChange={e => setCreateForm({ ...createForm, email: e.target.value })} 
                    className="w-full bg-slate-50 border-none rounded-xl px-5 py-3 text-sm font-bold text-slate-800 focus:ring-2 focus:ring-indigo-500/20" 
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-secondary uppercase tracking-widest ml-1">Password</label>
                  <input 
                    required 
                    type="password" 
                    value={createForm.password} 
                    onChange={e => setCreateForm({ ...createForm, password: e.target.value })} 
                    className="w-full bg-slate-50 border-none rounded-xl px-5 py-3 text-sm font-bold text-slate-800 focus:ring-2 focus:ring-indigo-500/20" 
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-secondary uppercase tracking-widest ml-1">Role</label>
                  <select 
                    value={createForm.role} 
                    onChange={e => setCreateForm({ ...createForm, role: e.target.value })} 
                    className="w-full bg-slate-50 border-none rounded-xl px-5 py-3 text-sm font-bold text-slate-800 focus:ring-2 focus:ring-indigo-500/20"
                  >
                    <option value="student">Student</option>
                    <option value="instructor">Instructor</option>
                    <option value="admin">Admin</option>
                  </select>
                </div>

                <button 
                  type="submit" 
                  disabled={panelSubmitting} 
                  className="w-full py-4 bg-indigo-600 text-white rounded-xl font-bold shadow-lg shadow-indigo-600/20 hover:scale-[1.02] active:scale-95 transition-all flex items-center justify-center"
                >
                  {panelSubmitting ? 'Creating User...' : 'Create User'}
                </button>
              </form>
            </div>
            
            <button 
              type="button" 
              onClick={() => {
                setShowCreatePanel(false);
                setPanelError('');
              }} 
              className="w-full py-4 border-2 border-slate-200 rounded-xl font-bold text-slate-600 hover:bg-slate-50 transition-colors"
            >
              Cancel
            </button>
          </div>
        </div>
      )}

      {/* ENROLL STUDENT SLIDE-IN PANEL */}
      {showEnrollPanel && selectedStudentForEnroll && (
        <div className="fixed inset-0 z-[100] flex justify-end bg-black/40 animate-in fade-in duration-200">
          <div className="bg-white w-full max-w-md h-full shadow-2xl p-8 flex flex-col justify-between animate-in slide-in-from-right duration-300">
            <div>
              <div className="flex justify-between items-center mb-8">
                <div>
                  <h2 className="text-2xl font-black text-slate-800">Enroll Student</h2>
                  <p className="text-[10px] font-black text-secondary uppercase tracking-[0.2em] mt-1">Batch Assignment</p>
                </div>
                <button 
                  onClick={() => {
                    setShowEnrollPanel(false);
                    setSelectedStudentForEnroll(null);
                  }} 
                  className="w-10 h-10 rounded-full hover:bg-slate-100 flex items-center justify-center"
                >
                  <span className="material-symbols-outlined text-slate-500">close</span>
                </button>
              </div>

              <div className="bg-indigo-50 p-4 rounded-xl mb-6">
                <p className="text-xs text-indigo-700 font-bold">Student Identity</p>
                <p className="text-sm font-black text-slate-800 mt-1">{selectedStudentForEnroll.full_name}</p>
                <p className="text-xs text-slate-500">{selectedStudentForEnroll.email}</p>
              </div>

              <form onSubmit={handleEnrollStudent} className="space-y-6">
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-secondary uppercase tracking-widest ml-1">Target Cohort/Batch</label>
                  <select 
                    required 
                    value={selectedBatchId} 
                    onChange={e => setSelectedBatchId(e.target.value)} 
                    className="w-full bg-slate-50 border-none rounded-xl px-5 py-3 text-sm font-bold text-slate-800 focus:ring-2 focus:ring-indigo-500/20"
                  >
                    <option value="">Select a batch...</option>
                    {batches.map(b => (
                      <option key={b.id} value={b.id}>
                        {b.batch_code} ({b.courses?.title || 'Unknown Course'})
                      </option>
                    ))}
                  </select>
                </div>

                <button 
                  type="submit" 
                  disabled={!selectedBatchId}
                  className="w-full py-4 bg-indigo-600 text-white rounded-xl font-bold shadow-lg shadow-indigo-600/20 hover:scale-[1.02] active:scale-95 transition-all flex items-center justify-center disabled:opacity-50"
                >
                  Enroll Student
                </button>
              </form>
            </div>
            
            <button 
              type="button" 
              onClick={() => {
                setShowEnrollPanel(false);
                setSelectedStudentForEnroll(null);
              }} 
              className="w-full py-4 border-2 border-slate-200 rounded-xl font-bold text-slate-600 hover:bg-slate-50 transition-colors"
            >
              Cancel
            </button>
          </div>
        </div>
      )}

    </div>
  );
}
