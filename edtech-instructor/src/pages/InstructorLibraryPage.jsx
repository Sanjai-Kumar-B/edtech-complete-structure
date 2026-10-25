import { useState, useEffect } from 'react';
import { supabase } from '@junospace/supabase-client';
import { useAuth } from '../context/AuthContext';
import { Loader2, BookOpen, Link as LinkIcon, FileText, PlaySquare, CheckCircle2, Eye, EyeOff } from 'lucide-react';

export function InstructorLibraryPage() {
  const { profile } = useAuth();
  const [resources, setResources] = useState([]);
  const [loading, setLoading] = useState(true);
  const [toast, setToast] = useState('');

  useEffect(() => {
    if (profile) {
      loadData();
    }
  }, [profile]);

  async function loadData() {
    setLoading(true);
    try {
      // Fetch assigned resources for instructor's batches
      // We need to join batches (to ensure it's the instructor's batch) and library_resources
      const { data, error } = await supabase
        .from('batch_library_resources')
        .select(`
          id,
          is_released,
          batch_id,
          batches!inner(batch_code, instructor_id, courses(title)),
          library_resources!inner(id, title, type, category, description, file_url, external_url, thumbnail_color)
        `)
        .eq('batches.instructor_id', profile.id)
        .order('assigned_at', { ascending: false });

      if (error) throw error;
      setResources(data || []);
    } catch (err) {
      alert("Error loading library data: " + err.message);
    } finally {
      setLoading(false);
    }
  }

  const handleToggleRelease = async (assignmentId, currentStatus) => {
    try {
      const { error } = await supabase
        .from('batch_library_resources')
        .update({ is_released: !currentStatus })
        .eq('id', assignmentId);

      if (error) throw error;

      setResources(resources.map(r => r.id === assignmentId ? { ...r, is_released: !currentStatus } : r));

      setToast(!currentStatus ? 'Resource released to students!' : 'Resource hidden from students.');
      setTimeout(() => setToast(''), 3000);
    } catch (err) {
      alert("Failed to update status: " + err.message);
    }
  };

  const getIcon = (type) => {
    switch (type) {
      case 'pdf': return <FileText className="text-blue-500" />;
      case 'doc': return <FileText className="text-indigo-500" />;
      case 'video': return <PlaySquare className="text-red-500" />;
      case 'image': return <BookOpen className="text-emerald-500" />;
      case 'link': return <LinkIcon className="text-emerald-500" />;
      default: return <BookOpen className="text-slate-500" />;
    }
  };

  return (
    <div className="p-8 pt-24 max-w-7xl mx-auto space-y-8 pb-20 relative">
      {toast && (
        <div className="absolute top-4 right-4 bg-emerald-100 text-emerald-700 px-4 py-3 rounded-xl text-sm font-bold flex items-center gap-2 animate-in fade-in slide-in-from-top-4 z-50">
          <CheckCircle2 size={18} /> {toast}
        </div>
      )}

      <header>
        <h1 className="text-3xl font-black text-slate-800 tracking-tight font-headline">Batch Library</h1>
        <p className="text-slate-500 font-medium mt-1">Review resources assigned by the Admin and release them to your students.</p>
      </header>

      {loading ? (
        <div className="flex justify-center py-20"><Loader2 className="animate-spin text-slate-400" size={32} /></div>
      ) : resources.length === 0 ? (
        <div className="text-center p-12 border-2 border-dashed border-slate-200 rounded-3xl bg-white text-slate-500 font-medium">
          No resources have been assigned to your batches yet.
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {resources.map(assignment => {
            const res = assignment.library_resources;
            const batch = assignment.batches;

            return (
              <div key={assignment.id} className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 flex flex-col hover:shadow-md transition-shadow">
                <div className="flex justify-between items-start mb-4">
                  <div className="w-12 h-12 rounded-xl flex items-center justify-center shrink-0" style={{ backgroundColor: res.thumbnail_color || '#f1f5f9' }}>
                    {getIcon(res.type)}
                  </div>
                  <div className="flex flex-col items-end gap-1">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 bg-slate-50 px-2 py-1 rounded-full">{res.type}</span>
                    <span className="text-[10px] font-bold uppercase tracking-wider text-indigo-500 bg-indigo-50 px-2 py-1 rounded-full">{batch.batch_code}</span>
                  </div>
                </div>

                <h3 className="font-bold text-slate-800 text-lg mb-2 line-clamp-1 flex items-center gap-2">
                  {res.title}
                  <a href={res.file_url || res.external_url} target="_blank" rel="noreferrer" className="text-slate-300 hover:text-indigo-600 shrink-0"><LinkIcon size={14} /></a>
                </h3>
                <p className="text-sm text-slate-500 mb-6 flex-1 line-clamp-2">{res.description || 'No description provided.'}</p>

                <button
                  onClick={() => handleToggleRelease(assignment.id, assignment.is_released)}
                  className={`w-full py-2.5 font-bold text-sm rounded-xl transition-colors flex items-center justify-center gap-2 ${assignment.is_released
                      ? 'bg-emerald-50 text-emerald-700 hover:bg-emerald-100'
                      : 'bg-indigo-600 text-white hover:bg-indigo-700 shadow-md shadow-indigo-600/20'
                    }`}
                >
                  {assignment.is_released ? <><Eye size={16} /> Released to Students</> : <><EyeOff size={16} /> Release to Students</>}
                </button>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
