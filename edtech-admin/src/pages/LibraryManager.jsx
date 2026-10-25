/*
-- CREATE TABLE IF NOT EXISTS public.library_resources (
--   id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
--   title text NOT NULL,
--   type text NOT NULL, -- 'ebook', 'video', 'cheatsheet', 'tool', 'article'
--   category text,
--   description text,
--   file_url text,
--   external_url text,
--   thumbnail_color text DEFAULT '#6C35DE',
--   is_published boolean DEFAULT false,
--   uploaded_by uuid REFERENCES public.users(id),
--   created_at timestamptz DEFAULT now()
-- );
*/

import { useState, useEffect, useRef } from 'react';
import { supabase } from '@junospace/supabase-client';
import { useAuth } from '../context/AuthContext';
import { Loader2, Search, Link as LinkIcon, FileUp, Filter, Trash2, Edit2, Check, X, Eye, EyeOff, Plus } from 'lucide-react';

export function LibraryManager() {
  const { user } = useAuth();

  const [resources, setResources] = useState([]);
  const [courses, setCourses] = useState([]);
  const [batches, setBatches] = useState([]);
  const [assigningResource, setAssigningResource] = useState(null);
  const [selectedBatchIds, setSelectedBatchIds] = useState([]);
  const [saving, setSaving] = useState(false);

  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterType, setFilterType] = useState('All');

  // Form State
  const [title, setTitle] = useState('');
  const [type, setType] = useState('pdf');
  const [category, setCategory] = useState('');
  const [description, setDescription] = useState('');
  const [thumbnailColor, setThumbnailColor] = useState('#6C35DE');
  const [isPublished, setIsPublished] = useState(true);

  const [linkMode, setLinkMode] = useState('file'); // 'file' | 'url'
  const [file, setFile] = useState(null);
  const [externalUrl, setExternalUrl] = useState('');

  const [uploading, setUploading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  const fileInputRef = useRef(null);

  // Edit State
  const [editingId, setEditingId] = useState(null);
  const [editForm, setEditForm] = useState({});

  useEffect(() => {
    loadResources();
  }, []);

  async function loadResources() {
    setLoading(true);
    try {
      const [resData, courseData, batchData] = await Promise.all([
        supabase.from('library_resources').select('*').order('created_at', { ascending: false }),
        supabase.from('courses').select('id, title').eq('status', 'active'),
        supabase.from('batches').select('id, batch_code, courses(title)').eq('status', 'active')
      ]);

      if (resData.error) throw resData.error;
      setResources(resData.data || []);

      if (courseData.error) throw courseData.error;
      const loadedCourses = courseData.data || [];
      setCourses(loadedCourses);
      if (batchData.error) throw batchData.error;
      setBatches(batchData.data || []);

      if (loadedCourses.length > 0 && !category) {
        setCategory(loadedCourses[0].title);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }


  const handleOpenAssignModal = async (resource) => {
    setAssigningResource(resource);
    setSelectedBatchIds([]);
    try {
      const { data, error } = await supabase
        .from('batch_library_resources')
        .select('batch_id')
        .eq('resource_id', resource.id);

      if (error) throw error;
      if (data) setSelectedBatchIds(data.map(d => d.batch_id));
    } catch (err) {
      console.error(err);
    }
  };

  const handleToggleBatch = (batchId) => {
    if (selectedBatchIds.includes(batchId)) {
      setSelectedBatchIds(selectedBatchIds.filter(id => id !== batchId));
    } else {
      setSelectedBatchIds([...selectedBatchIds, batchId]);
    }
  };

  const handleSaveAssignments = async () => {
    setSaving(true);
    try {
      const { error: delError } = await supabase
        .from('batch_library_resources')
        .delete()
        .eq('resource_id', assigningResource.id);
      if (delError) throw delError;

      if (selectedBatchIds.length > 0) {
        const inserts = selectedBatchIds.map(bId => ({
          batch_id: bId,
          resource_id: assigningResource.id,
          assigned_by: user.id
        }));
        const { error: insError } = await supabase
          .from('batch_library_resources')
          .insert(inserts);
        if (insError) throw insError;
      }
      setAssigningResource(null);
    } catch (err) {
      alert("Failed to save assignments: " + err.message);
    } finally {
      setSaving(false);
    }
  };

  const handleFileChange = (e) => {
    const selected = e.target.files[0];
    if (selected) {
      if (selected.size > 20 * 1024 * 1024) { // 20MB limit
        setErrorMsg("File exceeds 20MB limit.");
        setFile(null);
        if (fileInputRef.current) fileInputRef.current.value = "";
      } else {
        setFile(selected);
        setErrorMsg('');
      }
    }
  };

  const handleAddResource = async (e) => {
    e.preventDefault();
    setErrorMsg('');

    if (!title || !type) {
      setErrorMsg("Title and type are required.");
      return;
    }

    if (linkMode === 'file' && !file) {
      setErrorMsg("Please upload a file.");
      return;
    }
    if (linkMode === 'url' && !externalUrl) {
      setErrorMsg("Please provide an external URL.");
      return;
    }

    setUploading(true);

    try {
      let finalFileUrl = null;
      let finalExternalUrl = null;

      if (linkMode === 'file') {
        const fileExt = file.name.split('.').pop();
        const fileName = `${Date.now()}_${Math.random().toString(36).substring(7)}.${fileExt}`;
        const filePath = `global/${fileName}`;

        const { error: uploadError } = await supabase.storage
          .from('library')
          .upload(filePath, file, { cacheControl: '3600', upsert: false });

        if (uploadError) throw new Error("Upload failed: " + uploadError.message);

        const { data: { publicUrl } } = supabase.storage.from('library').getPublicUrl(filePath);
        finalFileUrl = publicUrl;
      } else {
        finalExternalUrl = externalUrl;
      }

      const { data, error } = await supabase.from('library_resources').insert({
        title,
        type,
        category,
        description,
        file_url: finalFileUrl,
        external_url: finalExternalUrl,
        thumbnail_color: thumbnailColor,
        is_published: isPublished,
        uploaded_by: user.id
      }).select().single();

      if (error) throw error;

      setResources([data, ...resources]);

      // Reset form
      setTitle('');
      setType('pdf');
      if (courses.length > 0) setCategory(courses[0].title);
      else setCategory('');
      setDescription('');
      setFile(null);
      setExternalUrl('');
      setThumbnailColor('#6C35DE');
      setIsPublished(true);
      if (fileInputRef.current) fileInputRef.current.value = "";

    } catch (err) {
      setErrorMsg(err.message);
    } finally {
      setUploading(false);
    }
  };

  const handleTogglePublish = async (id, currentStatus) => {
    try {
      const { error } = await supabase.from('library_resources').update({ is_published: !currentStatus }).eq('id', id);
      if (error) throw error;
      setResources(resources.map(r => r.id === id ? { ...r, is_published: !currentStatus } : r));
    } catch (err) {
      alert("Failed to update status: " + err.message);
    }
  };

  const handleDelete = async (id) => {
    if (!confirm("Are you sure you want to delete this resource?")) return;
    try {
      const { error } = await supabase.from('library_resources').delete().eq('id', id);
      if (error) throw error;
      setResources(resources.filter(r => r.id !== id));
    } catch (err) {
      alert("Delete failed: " + err.message);
    }
  };

  const startEditing = (r) => {
    setEditingId(r.id);
    setEditForm({
      title: r.title,
      category: r.category || '',
      type: r.type,
      thumbnail_color: r.thumbnail_color || '#6C35DE'
    });
  };

  const saveEdit = async (id) => {
    try {
      const { data, error } = await supabase.from('library_resources').update({
        title: editForm.title,
        category: editForm.category,
        type: editForm.type,
        thumbnail_color: editForm.thumbnail_color
      }).eq('id', id).select().single();

      if (error) throw error;
      setResources(resources.map(r => r.id === id ? data : r));
      setEditingId(null);
    } catch (err) {
      alert(err.message);
    }
  };

  const filteredResources = resources.filter(r => {
    const matchesSearch = (r.title?.toLowerCase() || '').includes(searchQuery.toLowerCase()) ||
      (r.category?.toLowerCase() || '').includes(searchQuery.toLowerCase());
    const matchesType = filterType === 'All' || r.type === filterType.toLowerCase().replace(' ', '');
    return matchesSearch && matchesType;
  });

  return (
    <div className="p-8 pt-24 max-w-7xl mx-auto space-y-8 font-body">
      <header>
        <h1 className="text-3xl font-black text-slate-800 tracking-tight font-headline">Global Library Manager</h1>
        <p className="text-slate-500 font-medium mt-1">Upload and curate resources accessible to all students.</p>
      </header>

      {/* UPLOAD FORM */}
      <section className="bg-white rounded-[2rem] p-8 shadow-sm border border-slate-100">
        <h2 className="text-lg font-black text-slate-800 mb-6">Add New Resource</h2>

        <form onSubmit={handleAddResource} className="space-y-6">
          {errorMsg && <div className="p-3 bg-red-50 text-red-600 text-sm font-bold rounded-xl border border-red-100">{errorMsg}</div>}

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="lg:col-span-2 space-y-2">
              <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Title</label>
              <input type="text" required value={title} onChange={e => setTitle(e.target.value)} className="w-full bg-slate-50 border-none rounded-xl px-4 py-3 text-sm font-bold text-slate-700 focus:ring-2 focus:ring-indigo-500" placeholder="e.g. Master React in 10 Days" />
            </div>
            <div className="space-y-2">
              <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Category (Course)</label>
              <select value={category} onChange={e => setCategory(e.target.value)} className="w-full bg-slate-50 border-none rounded-xl px-4 py-3 text-sm font-bold text-slate-700 focus:ring-2 focus:ring-indigo-500">
                {courses.length === 0 && <option value="">No active courses</option>}
                {courses.map(c => (
                  <option key={c.id} value={c.title}>{c.title}</option>
                ))}
              </select>
            </div>
            <div className="space-y-2 flex gap-4">
              <div className="flex-1 space-y-2">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Type</label>
                <select value={type} onChange={e => setType(e.target.value)} className="w-full bg-slate-50 border-none rounded-xl px-4 py-3 text-sm font-bold text-slate-700 focus:ring-2 focus:ring-indigo-500">
                  <option value="pdf">PDF</option>
                  <option value="doc">Doc</option>
                  <option value="video">Video</option>
                  <option value="image">Image</option>
                </select>
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Color</label>
                <input type="color" value={thumbnailColor} onChange={e => setThumbnailColor(e.target.value)} className="w-12 h-11 p-1 bg-slate-50 border-none rounded-xl cursor-pointer" />
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Description</label>
              <textarea value={description} onChange={e => setDescription(e.target.value)} rows="4" className="w-full bg-slate-50 border-none rounded-xl px-4 py-3 text-sm font-medium text-slate-700 focus:ring-2 focus:ring-indigo-500" placeholder="Briefly describe the resource..." />
            </div>

            <div className="space-y-4">
              <div className="flex items-center gap-2 bg-slate-100 p-1 rounded-lg w-max">
                <button type="button" onClick={() => setLinkMode('file')} className={`px-4 py-1.5 text-xs font-bold rounded-md transition-all ${linkMode === 'file' ? 'bg-white shadow-sm text-indigo-600' : 'text-slate-500'}`}>Upload File</button>
                <button type="button" onClick={() => setLinkMode('url')} className={`px-4 py-1.5 text-xs font-bold rounded-md transition-all ${linkMode === 'url' ? 'bg-white shadow-sm text-indigo-600' : 'text-slate-500'}`}>External URL</button>
              </div>

              {linkMode === 'file' ? (
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">File (Max 20MB)</label>
                  <input type="file" ref={fileInputRef} onChange={handleFileChange} className="w-full bg-slate-50 border border-dashed border-slate-200 rounded-xl px-4 py-3 text-sm font-medium text-slate-700 file:mr-4 file:py-1 file:px-3 file:rounded-full file:border-0 file:text-xs file:font-bold file:bg-indigo-100 file:text-indigo-700 hover:file:bg-indigo-200 cursor-pointer" />
                </div>
              ) : (
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">URL Link</label>
                  <input type="url" value={externalUrl} onChange={e => setExternalUrl(e.target.value)} className="w-full bg-slate-50 border-none rounded-xl px-4 py-3 text-sm font-medium text-slate-700 focus:ring-2 focus:ring-indigo-500" placeholder="https://..." />
                </div>
              )}

              <label className="flex items-center gap-2 cursor-pointer mt-2">
                <input type="checkbox" checked={isPublished} onChange={e => setIsPublished(e.target.checked)} className="rounded text-indigo-600 border-slate-300 focus:ring-indigo-500" />
                <span className="text-sm font-bold text-slate-600">Publish immediately to student portal</span>
              </label>
            </div>
          </div>

          <div className="pt-4 border-t border-slate-100 flex justify-end">
            <button type="submit" disabled={uploading} className="px-8 py-3 bg-indigo-600 text-white rounded-xl font-bold shadow-lg shadow-indigo-600/30 hover:scale-105 active:scale-95 transition-all flex items-center gap-2 disabled:opacity-50 disabled:hover:scale-100">
              {uploading ? <><Loader2 size={18} className="animate-spin" /> Uploading...</> : <><FileUp size={18} /> Add to Library</>}
            </button>
          </div>
        </form>
      </section>

      {/* MANAGEMENT SECTION */}
      <section className="space-y-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <h2 className="text-xl font-black text-slate-800">Manage Resources</h2>

          <div className="flex items-center gap-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
              <input type="text" placeholder="Search title or category..." value={searchQuery} onChange={e => setSearchQuery(e.target.value)} className="pl-9 pr-4 py-2 bg-white border border-slate-200 rounded-xl text-sm font-medium focus:ring-2 focus:ring-indigo-500 w-64" />
            </div>
            <div className="flex bg-white border border-slate-200 rounded-xl p-1">
              {['All', 'PDF', 'Doc', 'Video', 'Image'].map(f => (
                <button key={f} onClick={() => setFilterType(f)} className={`px-3 py-1.5 text-xs font-bold rounded-lg transition-colors ${filterType === f ? 'bg-indigo-50 text-indigo-700' : 'text-slate-500 hover:bg-slate-50'}`}>
                  {f}
                </button>
              ))}
            </div>
          </div>
        </div>

        <div className="bg-white border border-slate-200 rounded-[2rem] overflow-hidden shadow-sm">
          <table className="w-full text-left border-collapse">
            <thead className="bg-slate-50 border-b border-slate-200">
              <tr>
                <th className="px-6 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest">Resource</th>
                <th className="px-6 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest">Category</th>
                <th className="px-6 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest">Status</th>
                <th className="px-6 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest">Date</th>
                <th className="px-6 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {loading ? (
                [1, 2, 3].map(i => (
                  <tr key={i}>
                    <td className="px-6 py-4"><div className="h-4 bg-slate-100 animate-pulse rounded w-48"></div></td>
                    <td className="px-6 py-4"><div className="h-4 bg-slate-100 animate-pulse rounded w-24"></div></td>
                    <td className="px-6 py-4"><div className="h-4 bg-slate-100 animate-pulse rounded w-16"></div></td>
                    <td className="px-6 py-4"><div className="h-4 bg-slate-100 animate-pulse rounded w-20"></div></td>
                    <td className="px-6 py-4"><div className="h-4 bg-slate-100 animate-pulse rounded w-16 ml-auto"></div></td>
                  </tr>
                ))
              ) : filteredResources.length === 0 ? (
                <tr>
                  <td colSpan="5" className="px-6 py-12 text-center text-slate-500 font-medium">No resources found matching your criteria.</td>
                </tr>
              ) : (
                filteredResources.map(r => {
                  if (editingId === r.id) {
                    return (
                      <tr key={r.id} className="bg-indigo-50/30">
                        <td className="px-6 py-4">
                          <input type="text" value={editForm.title} onChange={e => setEditForm({ ...editForm, title: e.target.value })} className="w-full bg-white border border-indigo-200 rounded px-2 py-1 text-sm font-bold" />
                        </td>
                        <td className="px-6 py-4">
                          <select value={editForm.category} onChange={e => setEditForm({ ...editForm, category: e.target.value })} className="w-full bg-white border border-indigo-200 rounded px-2 py-1 text-sm font-bold">
                            {courses.map(c => (
                              <option key={c.id} value={c.title}>{c.title}</option>
                            ))}
                          </select>
                        </td>
                        <td className="px-6 py-4" colSpan="2">
                          <div className="flex items-center gap-2">
                            <select value={editForm.type} onChange={e => setEditForm({ ...editForm, type: e.target.value })} className="bg-white border border-indigo-200 rounded px-2 py-1 text-sm font-bold">
                              <option value="pdf">PDF</option>
                              <option value="doc">Doc</option>
                              <option value="video">Video</option>
                              <option value="image">Image</option>
                            </select>
                            <input type="color" value={editForm.thumbnail_color} onChange={e => setEditForm({ ...editForm, thumbnail_color: e.target.value })} className="w-8 h-8 p-0 border-none rounded cursor-pointer" />
                          </div>
                        </td>
                        <td className="px-6 py-4 text-right">
                          <div className="flex items-center justify-end gap-2">
                            <button onClick={() => saveEdit(r.id)} className="p-1.5 bg-emerald-100 text-emerald-700 rounded hover:bg-emerald-200"><Check size={16} /></button>
                            <button onClick={() => setEditingId(null)} className="p-1.5 bg-slate-200 text-slate-600 rounded hover:bg-slate-300"><X size={16} /></button>
                          </div>
                        </td>
                      </tr>
                    )
                  }

                  return (
                    <tr key={r.id} className="hover:bg-slate-50/50 transition-colors group">
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <div className="w-3 h-3 rounded-full shrink-0" style={{ backgroundColor: r.thumbnail_color }}></div>
                          <div>
                            <div className="font-bold text-slate-800 text-sm flex items-center gap-2">
                              {r.title}
                              <a href={r.file_url || r.external_url} target="_blank" rel="noreferrer" className="text-slate-300 hover:text-indigo-600"><LinkIcon size={14} /></a>
                            </div>
                            <div className="text-[10px] font-black uppercase tracking-widest text-slate-400">{r.type}</div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <span className="px-2.5 py-1 bg-slate-100 text-slate-600 text-xs font-bold rounded-md">{r.category || 'Uncategorized'}</span>
                      </td>
                      <td className="px-6 py-4">
                        <button onClick={() => handleTogglePublish(r.id, r.is_published)} className={`flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold transition-colors ${r.is_published ? 'bg-emerald-50 text-emerald-600 hover:bg-emerald-100' : 'bg-amber-50 text-amber-600 hover:bg-amber-100'}`}>
                          {r.is_published ? <><Eye size={12} /> Published</> : <><EyeOff size={12} /> Draft</>}
                        </button>
                      </td>
                      <td className="px-6 py-4 text-sm font-semibold text-slate-500">
                        {new Date(r.created_at).toLocaleDateString()}
                      </td>
                      <td className="px-6 py-4 text-right">
                        <div className="flex justify-end gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                          <button onClick={() => handleOpenAssignModal(r)} className="p-1.5 text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-md" title="Assign to Batches"><Plus size={16} /></button>
                          <button onClick={() => startEditing(r)} className="p-1.5 text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-md"><Edit2 size={16} /></button>
                          <button onClick={() => handleDelete(r.id)} className="p-1.5 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-md"><Trash2 size={16} /></button>
                        </div>
                      </td>
                    </tr>
                  )
                })
              )}
            </tbody>
          </table>
        </div>
      </section>

      {/* ASSIGN MODAL */}
      {assigningResource && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm animate-in fade-in">
          <div className="bg-white rounded-3xl p-8 w-full max-w-md shadow-2xl">
            <div className="flex justify-between items-center mb-6">
              <div>
                <h3 className="text-xl font-black text-slate-800 tracking-tight">Assign Resource</h3>
                <p className="text-sm text-slate-500 truncate max-w-[250px]">{assigningResource.title}</p>
              </div>
              <button onClick={() => setAssigningResource(null)} className="p-2 bg-slate-50 text-slate-400 rounded-full hover:bg-slate-100">
                <X size={18} />
              </button>
            </div>

            <div className="space-y-3 max-h-60 overflow-y-auto pr-2 mb-6">
              {batches.length === 0 ? (
                <p className="text-sm text-slate-500 text-center py-4">No active batches available.</p>
              ) : (
                batches.map(batch => (
                  <label key={batch.id} className="flex items-center gap-3 p-3 bg-slate-50 rounded-xl border border-slate-100 cursor-pointer hover:border-indigo-200 transition-colors">
                    <input
                      type="checkbox"
                      checked={selectedBatchIds.includes(batch.id)}
                      onChange={() => handleToggleBatch(batch.id)}
                      className="w-5 h-5 rounded text-indigo-600 focus:ring-indigo-500 border-slate-300"
                    />
                    <div>
                      <div className="text-sm font-bold text-slate-800">{batch.batch_code}</div>
                      <div className="text-[10px] text-slate-500 uppercase tracking-wider">{batch.courses?.title || 'Unknown Course'}</div>
                    </div>
                  </label>
                ))
              )}
            </div>

            <button
              onClick={handleSaveAssignments}
              disabled={saving || batches.length === 0}
              className="w-full py-3 bg-indigo-600 text-white font-bold rounded-xl shadow-lg hover:bg-indigo-700 disabled:opacity-50 flex items-center justify-center gap-2"
            >
              {saving ? <Loader2 size={18} className="animate-spin" /> : 'Save Assignments'}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
