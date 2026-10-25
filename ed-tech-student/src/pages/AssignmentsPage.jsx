import React, { useState, useEffect } from 'react';
import { supabase } from '@junospace/supabase-client';
import { useAuth } from '../context/AuthContext';
import { Loader2 } from 'lucide-react';

export function AssignmentsPage() {
  const { user } = useAuth();
  
  const [tab, setTab] = useState('pending'); // 'pending' | 'resolved'
  const [loading, setLoading] = useState(true);
  
  const [pendingAssignments, setPendingAssignments] = useState([]);
  const [mySubmissions, setMySubmissions] = useState([]);
  const [totalAssignments, setTotalAssignments] = useState(0);

  // Modal State
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedAssignment, setSelectedAssignment] = useState(null);
  const [fileUrl, setFileUrl] = useState('');
  const [submissionText, setSubmissionText] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  useEffect(() => {
    if (user) loadData();
  }, [user]);

  async function loadData() {
    setLoading(true);
    try {
      // 1. Get student's enrolled active batches
      const { data: enrollments } = await supabase
        .from('enrollments')
        .select('batch_id')
        .eq('student_id', user.id)
        .eq('status', 'active');
      
      const batchIds = enrollments?.map(e => e.batch_id) || [];
      
      let allAssignments = [];
      let subs = [];

      if (batchIds.length > 0) {
        // 2. Get all published assignments for these batches
        const { data: assignmentsData } = await supabase
          .from('assignments')
          .select('*, batches(batch_code, courses(title))')
          .in('batch_id', batchIds)
          .eq('is_published', true);
        
        allAssignments = assignmentsData || [];
        setTotalAssignments(allAssignments.length);

        // 3. Get student's submissions
        const { data: subsData } = await supabase
          .from('assignment_submissions')
          .select('*, assignments(title, due_date, max_score, batches(batch_code, courses(title)))')
          .eq('student_id', user.id)
          .order('submitted_at', { ascending: false });
        
        subs = subsData || [];
        setMySubmissions(subs);
      }

      // 4. Filter pending assignments (no submission exists)
      const pending = allAssignments.filter(a => !subs.find(s => s.assignment_id === a.id));
      // Sort by due date ascending (earliest first)
      pending.sort((a, b) => new Date(a.due_date) - new Date(b.due_date));
      setPendingAssignments(pending);

    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }

  const openSubmitModal = (assignment) => {
    setSelectedAssignment(assignment);
    setFileUrl('');
    setSubmissionText('');
    setErrorMsg('');
    setModalOpen(true);
  };

  const closeSubmitModal = () => {
    setModalOpen(false);
    setSelectedAssignment(null);
  };

  const handleSubmitAssignment = async (e) => {
    e.preventDefault();
    setErrorMsg('');
    setSubmitting(true);
    
    try {
      if (!fileUrl && !submissionText) {
        throw new Error("Please provide a file URL or submission text.");
      }
      
      const { data, error } = await supabase
        .from('assignment_submissions')
        .insert({
          assignment_id: selectedAssignment.id,
          student_id: user.id,
          file_url: fileUrl || null,
          submission_text: submissionText || null,
          status: 'pending',
          submitted_at: new Date().toISOString()
        })
        .select('*, assignments(title, due_date, max_score, batches(batch_code, courses(title)))')
        .single();
        
      if (error) throw error;
      
      // Update state
      setMySubmissions([data, ...mySubmissions]);
      setPendingAssignments(pendingAssignments.filter(a => a.id !== selectedAssignment.id));
      closeSubmitModal();
      setTab('resolved'); // Auto switch to resolved tab to show the new submission
    } catch (err) {
      setErrorMsg(err.message);
    } finally {
      setSubmitting(false);
    }
  };

  // Helper to determine card styling for pending assignments
  const getPendingCardStatus = (dueDateStr) => {
    if (!dueDateStr) return { type: 'normal', icon: 'assignment', color: 'blue', label: 'No Due Date' };
    const due = new Date(dueDateStr);
    const now = new Date();
    const diffDays = (due - now) / (1000 * 60 * 60 * 24);
    
    if (diffDays < 0) return { type: 'overdue', icon: 'warning', color: 'red', label: 'Overdue' };
    if (diffDays <= 3) return { type: 'due_soon', icon: 'schedule', color: 'orange', label: 'Due Soon' };
    return { type: 'normal', icon: 'calendar_today', color: 'blue', label: `Due in ${Math.ceil(diffDays)} days` };
  };

  const velocityPct = totalAssignments > 0 ? Math.round((mySubmissions.length / totalAssignments) * 100) : 0;
  const strokeDashoffset = 364 - (364 * velocityPct) / 100;

  return (
    <div className="max-w-6xl mx-auto pb-12 font-['Inter']">
      
      {/* Header Section */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-12 border-b border-slate-100 pb-8">
        <div>
          <h1 className="font-['Plus_Jakarta_Sans'] text-4xl font-black text-slate-800 tracking-tighter mb-1">Assignments</h1>
          <p className="text-slate-500 font-light text-sm">Manage and track your academic milestones</p>
        </div>
        
        {/* Filter Tabs */}
        <div className="flex p-1 bg-slate-100/50 rounded-2xl gap-1">
          <button 
            className={`px-6 py-2.5 rounded-xl text-sm transition-all ${tab === 'pending' ? 'bg-white shadow-sm text-violet-600 font-medium' : 'text-slate-500 font-light hover:bg-white/50'}`}
            onClick={() => setTab('pending')}
          >
            Pending
          </button>
          <button 
            className={`px-6 py-2.5 rounded-xl text-sm transition-all ${tab === 'resolved' ? 'bg-white shadow-sm text-violet-600 font-medium' : 'text-slate-500 font-light hover:bg-white/50'}`}
            onClick={() => setTab('resolved')}
          >
            Resolved
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start mb-20">
        
        {/* Main List Column */}
        <div className="lg:col-span-8 space-y-6">
          {loading ? (
            <div className="p-12 flex justify-center"><Loader2 className="animate-spin text-slate-400" size={32} /></div>
          ) : tab === 'pending' ? (
            pendingAssignments.length === 0 ? (
              <div className="text-center p-12 bg-slate-50 rounded-2xl border border-dashed border-slate-200">
                <span className="material-symbols-outlined text-4xl text-emerald-400 mb-3">celebration</span>
                <p className="text-slate-600 font-medium">All caught up! No pending assignments.</p>
              </div>
            ) : (
              pendingAssignments.map(a => {
                const statusInfo = getPendingCardStatus(a.due_date);
                const colorConfig = {
                  red: { bg: 'bg-red-50', icon: 'text-red-500', badge: 'bg-red-500' },
                  orange: { bg: 'bg-orange-50', icon: 'text-orange-500', badge: 'bg-orange-500' },
                  blue: { bg: 'bg-blue-50', icon: 'text-blue-500', badge: 'bg-blue-500' }
                }[statusInfo.color];

                return (
                  <div key={a.id} className="group bg-white rounded-lg p-6 shadow-sm border border-slate-100 hover:-translate-y-1 transition-all duration-300">
                    <div className="flex flex-col sm:flex-row justify-between gap-4">
                      <div className="flex gap-5">
                        <div className={`w-12 h-12 ${colorConfig.bg} rounded-xl flex items-center justify-center flex-shrink-0`}>
                          <span className={`material-symbols-outlined ${colorConfig.icon}`}>{statusInfo.icon}</span>
                        </div>
                        <div>
                          <div className="flex items-center gap-3 mb-1">
                            <span className={`px-2.5 py-0.5 ${colorConfig.badge} text-white text-[9px] font-medium rounded-full uppercase tracking-widest`}>
                              {statusInfo.label}
                            </span>
                            <span className="text-slate-400 text-xs font-light">{a.batches?.courses?.title || a.batches?.batch_code || 'Unknown Course'}</span>
                          </div>
                          <h3 className="text-xl font-black font-['Plus_Jakarta_Sans'] text-slate-800 mb-2">{a.title}</h3>
                          <div className="flex items-center gap-4 text-sm text-slate-500 font-light">
                            <span className="flex items-center gap-1.5">
                              <span className="material-symbols-outlined text-base">calendar_today</span> 
                              {a.due_date ? new Date(a.due_date).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' }) : 'No Due Date'}
                            </span>
                          </div>
                        </div>
                      </div>
                      <div className="sm:self-center">
                        <button 
                          onClick={() => openSubmitModal(a)}
                          className="w-full sm:w-auto bg-violet-600 hover:bg-violet-700 text-white font-medium py-2.5 px-6 rounded-full text-sm transition-all shadow-md shadow-violet-500/20 active:scale-95"
                        >
                          Initialize Quest
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })
            )
          ) : (
            // RESOLVED TAB
            mySubmissions.length === 0 ? (
              <div className="text-center p-12 bg-slate-50 rounded-2xl border border-dashed border-slate-200">
                <p className="text-slate-500 font-medium">You haven't submitted any assignments yet.</p>
              </div>
            ) : (
              mySubmissions.map(sub => (
                <div key={sub.id} className="group bg-slate-50/30 border border-slate-100 rounded-lg p-6 transition-all hover:bg-white hover:shadow-sm">
                  <div className="flex flex-col sm:flex-row justify-between gap-4">
                    <div className="flex gap-5">
                      <div className={`w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0 ${sub.status === 'graded' ? 'bg-emerald-50 text-emerald-500' : 'bg-amber-50 text-amber-500'}`}>
                        <span className="material-symbols-outlined">{sub.status === 'graded' ? 'check_circle' : 'pending_actions'}</span>
                      </div>
                      <div>
                        <div className="flex items-center gap-3 mb-1">
                          <span className={`px-2.5 py-0.5 text-white text-[9px] font-medium rounded-full uppercase tracking-widest ${sub.status === 'graded' ? 'bg-emerald-500' : 'bg-amber-500'}`}>
                            {sub.status === 'graded' ? 'Graded' : 'Awaiting Review'}
                          </span>
                          <span className="text-slate-400 text-xs font-light">{sub.assignments?.batches?.courses?.title || 'Unknown Course'}</span>
                        </div>
                        <h3 className={`text-xl font-black font-['Plus_Jakarta_Sans'] text-slate-800 mb-2 ${sub.status==='graded'?'opacity-60':''}`}>{sub.assignments?.title}</h3>
                        <div className={`flex items-center gap-4 text-sm text-slate-500 font-light ${sub.status==='graded'?'opacity-60':''}`}>
                          <span className="flex items-center gap-1.5">
                            <span className="material-symbols-outlined text-base">task_alt</span> Submitted {new Date(sub.submitted_at).toLocaleDateString(undefined, {month:'short', day:'2-digit'})}
                          </span>
                        </div>
                      </div>
                    </div>
                    <div className="sm:self-center flex flex-col items-end gap-1">
                      {sub.status === 'graded' ? (
                        <>
                          <div className="text-emerald-600 font-black text-xl">{sub.score}<span className="text-sm font-medium text-slate-400">/{sub.assignments?.max_score}</span></div>
                          {sub.feedback && <p className="text-xs text-slate-500 italic max-w-xs text-right truncate">"{sub.feedback}"</p>}
                        </>
                      ) : (
                        <div className="text-amber-600 font-medium text-sm px-4 py-2 bg-amber-50 rounded-lg">Under Review</div>
                      )}
                    </div>
                  </div>
                </div>
              ))
            )
          )}
        </div>

        {/* Velocity / Stats Sidebar */}
        <div className="lg:col-span-4 space-y-8">
          <div className="bg-slate-50 rounded-lg p-8 relative overflow-hidden shadow-inner border border-slate-100">
            <div className="relative z-10">
              <h4 className="text-sm font-bold text-slate-500 uppercase tracking-widest mb-6">Velocity</h4>
              <div className="flex items-center justify-center mb-8 relative">
                <svg className="w-32 h-32 transform -rotate-90">
                  <circle className="text-slate-200" cx="64" cy="64" fill="transparent" r="58" stroke="currentColor" strokeWidth="12"></circle>
                  <circle className="text-[#6C35DE] transition-all duration-1000 ease-out" cx="64" cy="64" fill="transparent" r="58" stroke="currentColor" strokeDasharray="364" strokeDashoffset={strokeDashoffset} strokeWidth="12" strokeLinecap="round"></circle>
                </svg>
                <div className="absolute flex flex-col items-center">
                  <span className="text-2xl font-extrabold text-slate-800">{velocityPct}%</span>
                  <span className="text-[10px] text-slate-500 font-bold uppercase">Done</span>
                </div>
              </div>
              <div className="space-y-4">
                <div className="flex justify-between items-center text-sm">
                  <span className="text-slate-500">Assignments Done</span>
                  <span className="font-bold text-slate-700">{mySubmissions.length} / {totalAssignments}</span>
                </div>
                <div className="w-full bg-slate-200 h-3 rounded-full overflow-hidden">
                  <div className="bg-[#6C35DE] h-full shadow-[0_0_12px_rgba(108,53,222,0.3)] transition-all duration-1000" style={{ width: `${velocityPct}%` }}></div>
                </div>
              </div>
            </div>
          </div>
        </div>

      </div>

      {/* Submission Modal */}
      {modalOpen && selectedAssignment && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm animate-in fade-in">
          <div className="bg-white rounded-[2rem] p-8 w-full max-w-md shadow-2xl shadow-indigo-500/10">
            <div className="flex justify-between items-start mb-6">
              <div>
                <h3 className="text-xl font-black font-['Plus_Jakarta_Sans'] text-slate-800">Submit Assignment</h3>
                <p className="text-sm text-slate-500 mt-1">{selectedAssignment.title}</p>
              </div>
              <button onClick={closeSubmitModal} className="p-2 text-slate-400 hover:text-slate-700 bg-slate-50 hover:bg-slate-100 rounded-full transition-colors">
                <span className="material-symbols-outlined text-sm">close</span>
              </button>
            </div>

            <form onSubmit={handleSubmitAssignment} className="space-y-5">
              {errorMsg && (
                <div className="p-3 bg-red-50 text-red-600 text-sm font-bold rounded-xl border border-red-100">
                  {errorMsg}
                </div>
              )}
              
              <div className="space-y-2">
                <label className="text-xs font-bold text-slate-500 uppercase tracking-widest block ml-1">File URL</label>
                <input 
                  type="url" 
                  value={fileUrl}
                  onChange={e => setFileUrl(e.target.value)}
                  placeholder="https://github.com/..."
                  className="w-full bg-slate-50 border-none rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-violet-500 font-medium"
                />
              </div>

              <div className="space-y-2">
                <label className="text-xs font-bold text-slate-500 uppercase tracking-widest block ml-1">Comments / Text</label>
                <textarea 
                  rows="3"
                  value={submissionText}
                  onChange={e => setSubmissionText(e.target.value)}
                  placeholder="Any notes for the instructor..."
                  className="w-full bg-slate-50 border-none rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-violet-500 font-medium"
                />
              </div>

              <button 
                type="submit" 
                disabled={submitting}
                className="w-full py-3 mt-4 bg-violet-600 text-white rounded-xl font-bold shadow-lg shadow-violet-500/20 hover:bg-violet-700 active:scale-95 transition-all flex items-center justify-center gap-2 disabled:opacity-50"
              >
                {submitting ? <Loader2 size={18} className="animate-spin" /> : 'Submit Quest'}
              </button>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}
