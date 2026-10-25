import React, { useState, useEffect } from 'react';
import { supabase } from '@junospace/supabase-client';
import { useAuth } from '../context/AuthContext';
import { Loader2 } from 'lucide-react';

export function LibraryPage() {
  const { profile } = useAuth();
  const [filter, setFilter] = useState('all');
  const [loading, setLoading] = useState(true);
  const [resources, setResources] = useState([]);

  useEffect(() => {
    if (profile) loadLibrary();
  }, [profile]);

  async function loadLibrary() {
    setLoading(true);
    try {
      // 1. Get student's active batches
      const { data: myEnrollments, error: enrollError } = await supabase
        .from('enrollments')
        .select('batch_id')
        .eq('student_id', profile.id)
        .eq('status', 'active');

      if (enrollError) throw enrollError;

      const batchIds = myEnrollments.map(e => e.batch_id);

      if (batchIds.length === 0) {
        setResources([]);
        return;
      }

      // 2. Get assigned resources
      const { data: assignedData, error: assignError } = await supabase
        .from('batch_library_resources')
        .select('*, library_resources(*)')
        .in('batch_id', batchIds)
        .eq('is_released', true)
        .order('assigned_at', { ascending: false });

      if (assignError) throw assignError;

      // 3. Deduplicate (if multiple batches were assigned the same resource)
      const uniqueResourcesMap = new Map();
      assignedData?.forEach(assignment => {
        if (assignment.library_resources) {
          const res = assignment.library_resources;
          if (!uniqueResourcesMap.has(res.id)) {
            uniqueResourcesMap.set(res.id, res);
          }
        }
      });

      setResources(Array.from(uniqueResourcesMap.values()));
    } catch (err) {
      alert("Error loading library: " + err.message);
    } finally {
      setLoading(false);
    }
  }

  const getTabClass = (tabName) => {
    return filter === tabName
      ? 'px-4 py-2 bg-white shadow-sm text-violet-600 font-medium rounded-lg text-xs transition-all'
      : 'px-4 py-2 text-slate-500 font-light rounded-lg text-xs hover:bg-white transition-all';
  };

  const filteredResources = resources.filter(res => {
    if (filter === 'all') return true;
    if (filter === 'pdfs' && res.type === 'pdf') return true;
    if (filter === 'videos' && res.type === 'video') return true;
    if (filter === 'datasets' && res.type === 'link') return true;
    return false;
  });

  return (
    <div className="space-y-8 relative">
      <div className="flex flex-col md:flex-row justify-between items-center gap-6 mb-8 bg-white p-8 rounded-2xl shadow-sm border border-slate-100">
        <div>
          <span className="inline-flex items-center px-3 py-1 rounded-full bg-violet-100 text-violet-700 text-[10px] font-bold uppercase tracking-wider mb-3">
            <span className="material-symbols-outlined text-[14px] mr-1">auto_stories</span>
            {resources.length} Resources Available
          </span>
          <h2 className="text-4xl font-black tracking-tight text-slate-800">Library</h2>
          <p className="text-slate-500 mt-2 max-w-lg text-sm font-light">Access your assigned academic assets, research datasets, and reference materials curated by your instructors.</p>
        </div>
        <div className="flex items-center gap-3">
          {/* Unified Filter Controls at top */}
          <div className="flex p-1 bg-slate-100 rounded-xl gap-1">
            <button className={getTabClass('all')} onClick={() => setFilter('all')}>All</button>
            <button className={getTabClass('pdfs')} onClick={() => setFilter('pdfs')}>PDFs</button>
            <button className={getTabClass('videos')} onClick={() => setFilter('videos')}>Videos</button>
            <button className={getTabClass('datasets')} onClick={() => setFilter('datasets')}>Datasets / Links</button>
          </div>
          <button className="flex items-center gap-2 px-6 py-3 bg-violet-600 text-white font-black rounded-full text-xs shadow-lg shadow-violet-200 hover:scale-105 active:scale-95 transition-all hover:bg-violet-700">
            <span className="material-symbols-outlined text-[18px]">filter_list</span>
            FILTER BY TYPE
          </button>
        </div>
      </div>

      {/* Bento Layout Content */}
      <div className="grid grid-cols-12 gap-6 pb-12">
        {/* Active Module Focus (Bento Large) */}
        <div className="col-span-12 lg:col-span-8 space-y-6">
          {/* Material Cards List */}
          {loading ? (
            <div className="flex justify-center p-20"><Loader2 className="animate-spin text-violet-400" size={40} /></div>
          ) : filteredResources.length === 0 ? (
            <div className="bg-white p-16 rounded-3xl text-center border-2 border-dashed border-slate-100">
              <p className="text-slate-500 text-lg">No library resources have been assigned to your batch yet.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {filteredResources.map(res => {
                let icon = 'description';
                let btnIcon = 'download';
                let btnText = 'DOWNLOAD';
                let btnColor = 'bg-blue-50 text-blue-600';

                if (res.type === 'video') {
                  icon = 'play_circle';
                  btnIcon = 'play_arrow';
                  btnText = 'WATCH';
                  btnColor = 'bg-red-50 text-red-600';
                } else if (res.type === 'link') {
                  icon = 'link';
                  btnIcon = 'open_in_new';
                  btnText = 'OPEN LINK';
                  btnColor = 'bg-emerald-50 text-emerald-600';
                }

                return (
                  <div key={res.id} className="group bg-white p-5 rounded-2xl shadow-sm hover:shadow-md transition-all border border-slate-100 hover:border-violet-600/10 flex flex-col active:scale-[0.98]">
                    <div className="flex justify-between items-center mb-4">
                      <div className={`w-12 h-12 ${btnColor} rounded-xl flex items-center justify-center`} style={res.thumbnail_color ? { backgroundColor: res.thumbnail_color, color: 'white' } : {}}>
                        <span className="material-symbols-outlined">{icon}</span>
                      </div>
                      <a href={res.file_url || res.external_url} target="_blank" rel="noreferrer" className="bg-violet-600 hover:bg-violet-700 text-white text-[10px] font-bold px-4 py-2 rounded-full shadow-sm shadow-violet-200 transition-all flex items-center gap-1">
                        {btnText} <span className="material-symbols-outlined text-[14px]">{btnIcon}</span>
                      </a>
                    </div>
                    <h4 className="font-bold text-slate-800 group-hover:text-violet-600 transition-colors">{res.title}</h4>
                    <p className="text-sm text-slate-500 mt-2 line-clamp-2 flex-1">{res.description}</p>
                    <div className="mt-6 pt-4 border-t border-slate-50 flex items-center gap-4">
                      <span className="text-[10px] font-medium text-slate-400 flex items-center gap-1 uppercase tracking-widest">
                        <span className="material-symbols-outlined text-[14px]">save</span>
                        {res.category || res.type.toUpperCase()}
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Sidebar Content (Bento Side) */}
        <div className="col-span-12 lg:col-span-4 space-y-6">
          {/* My Bookmarks */}
          <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-bold text-slate-800">Referred Today</h3>
              <button className="text-xs text-violet-600 font-bold">View History</button>
            </div>
            <div className="space-y-4">
              <p className="text-sm text-slate-400 italic">No history recorded yet today.</p>
            </div>
          </div>

          {/* Support Sections */}
          <div className="space-y-4">
            <div className="bg-white p-4 rounded-2xl shadow-sm border border-slate-100 flex items-center gap-4">
              <div className="w-10 h-10 bg-blue-50 text-blue-600 rounded-xl flex items-center justify-center shrink-0">
                <span className="material-symbols-outlined text-lg">local_library</span>
              </div>
              <div>
                <h4 className="text-sm font-bold text-slate-800">Physical Library</h4>
                <p className="text-[10px] text-slate-500">Reserve textbooks & pods</p>
              </div>
            </div>
            <div className="bg-white p-4 rounded-2xl shadow-sm border border-slate-100 flex items-center gap-4">
              <div className="w-10 h-10 bg-orange-50 text-orange-600 rounded-xl flex items-center justify-center shrink-0">
                <span className="material-symbols-outlined text-lg">sync_problem</span>
              </div>
              <div>
                <h4 className="text-sm font-bold text-slate-800">Report Broken Link</h4>
                <p className="text-[10px] text-slate-500">Fast tracking resolve</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
