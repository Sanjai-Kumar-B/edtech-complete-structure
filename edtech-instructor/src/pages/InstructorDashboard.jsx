import { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { supabase } from '@junospace/supabase-client';
import { Link } from 'react-router-dom';

export function InstructorDashboard() {
  const { profile } = useAuth();
  const [data, setData] = useState({
    myBatches: [],
    totalStudents: 0,
    pendingCount: 0,
    todayCount: 0,
    criticalStudents: [],
    pendingSubmissions: []
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!profile) return;

    async function loadDashboard() {
      const { data: myBatches } = await supabase
        .from('batches')
        .select('*, courses(title, code), enrollments(count)')
        .eq('instructor_id', profile.id)
        .eq('status', 'active');

      const batchIds = myBatches?.map(b => b.id) || [];
      const totalStudents = myBatches?.reduce((acc, b) => acc + (b.enrollments[0]?.count || 0), 0) || 0;

      const today = new Date().toISOString().split('T')[0];
      
      let pendingCount = 0;
      let todayCount = 0;
      let criticalStudents = [];
      let pendingSubmissions = [];

      if (batchIds.length > 0) {
        // Get pending assignment submissions
        const { data: assignments } = await supabase.from('assignments').select('id, batch_id').in('batch_id', batchIds);
        const assignmentIds = assignments?.map(a => a.id) || [];
        
        if (assignmentIds.length > 0) {
          const { count } = await supabase
            .from('assignment_submissions')
            .select('id', { count: 'exact' })
            .eq('status', 'pending')
            .in('assignment_id', assignmentIds);
          pendingCount = count || 0;
          
          // Pending Assignments panel data
          const { data: pSubs } = await supabase
            .from('assignment_submissions')
            .select('*, assignments(title, due_date, batches(batch_code))')
            .eq('status', 'pending')
            .in('assignment_id', assignmentIds)
            .order('submitted_at', { ascending: true });
            
          pendingSubmissions = pSubs || [];
        }

        // Today sessions count
        const { count: sCount } = await supabase
          .from('sessions')
          .select('id', { count: 'exact' })
          .in('batch_id', batchIds)
          .eq('session_date', today);
        todayCount = sCount || 0;

        // Critical Focus panel
        const { data: scores } = await supabase
          .from('leaderboard_scores')
          .select('*')
          .in('batch_id', batchIds);
          
        criticalStudents = (scores || [])
          .filter(s => s.total_score < 60)
          .slice(0, 3);
      }

      setData({
        myBatches: myBatches || [],
        totalStudents,
        pendingCount,
        todayCount,
        criticalStudents,
        pendingSubmissions
      });
      setLoading(false);
    }

    loadDashboard();
  }, [profile]);

  if (loading) {
    return <div className="p-8">Loading dashboard...</div>;
  }

  const todayStr = new Date().toLocaleDateString(undefined, { weekday: 'long', month: 'short', day: 'numeric', year: 'numeric' });

  // Group pending submissions by assignment to show count per assignment
  const groupedPending = data.pendingSubmissions.reduce((acc, sub) => {
    const aid = sub.assignment_id;
    if (!acc[aid]) {
      acc[aid] = {
        title: sub.assignments?.title,
        batchCode: sub.assignments?.batches?.batch_code,
        dueDate: sub.assignments?.due_date,
        count: 0
      };
    }
    acc[aid].count += 1;
    return acc;
  }, {});
  const pendingGroups = Object.values(groupedPending);

  return (
    <div className="pt-20 p-8 space-y-8">
      {/* Welcome Header */}
      <header className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <h1 className="text-3xl font-extrabold text-on-surface tracking-tight">Welcome back, {profile?.full_name || 'Professor'}</h1>
          <p className="text-secondary font-medium mt-1">You have {data.todayCount} sessions scheduled for today.</p>
        </div>
        <div className="flex items-center gap-2 px-4 py-2 bg-surface-container-low rounded-lg text-sm font-medium text-on-surface-variant">
          <span className="material-symbols-outlined text-[18px]">calendar_today</span>
          <span>{todayStr}</span>
        </div>
      </header>

      {/* Summary Cards Bento Grid */}
      <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-surface-container-lowest p-6 rounded-xl shadow-[0px_4px_20px_rgba(25,28,30,0.04),0px_8px_40px_rgba(25,28,30,0.02)]">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-[12px] font-semibold text-secondary uppercase tracking-wider mb-1">Active Batches</p>
              <h2 className="text-3xl font-bold text-on-surface">{data.myBatches.length}</h2>
            </div>
            <div className="p-2 bg-primary-fixed rounded-lg text-primary">
              <span className="material-symbols-outlined">hub</span>
            </div>
          </div>
        </div>

        <div className="bg-surface-container-lowest p-6 rounded-xl shadow-[0px_4px_20px_rgba(25,28,30,0.04),0px_8px_40px_rgba(25,28,30,0.02)]">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-[12px] font-semibold text-secondary uppercase tracking-wider mb-1">Total Students</p>
              <h2 className="text-3xl font-bold text-on-surface">{data.totalStudents}</h2>
            </div>
            <div className="p-2 bg-secondary-fixed rounded-lg text-secondary">
              <span className="material-symbols-outlined">school</span>
            </div>
          </div>
        </div>

        <div className="bg-surface-container-lowest p-6 rounded-xl shadow-[0px_4px_20px_rgba(25,28,30,0.04),0px_8px_40px_rgba(25,28,30,0.02)]">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-[12px] font-semibold text-secondary uppercase tracking-wider mb-1">Pending Review</p>
              <h2 className="text-3xl font-bold text-primary">{data.pendingCount}</h2>
            </div>
            <div className="p-2 bg-error-container rounded-lg text-error">
              <span className="material-symbols-outlined">rate_review</span>
            </div>
          </div>
        </div>

        <div className="bg-surface-container-lowest p-6 rounded-xl shadow-[0px_4px_20px_rgba(25,28,30,0.04),0px_8px_40px_rgba(25,28,30,0.02)]">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-[12px] font-semibold text-secondary uppercase tracking-wider mb-1">Scheduled Sessions</p>
              <h2 className="text-3xl font-bold text-on-surface">{data.todayCount}</h2>
            </div>
            <div className="p-2 bg-tertiary-fixed rounded-lg text-tertiary">
              <span className="material-symbols-outlined">videocam</span>
            </div>
          </div>
        </div>
      </section>

      {/* Main Data Section */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Column: Batch Overview */}
        <section className="lg:col-span-8 bg-surface-container-lowest rounded-xl shadow-[0px_4px_20px_rgba(25,28,30,0.04),0px_8px_40px_rgba(25,28,30,0.02)] overflow-hidden">
          <div className="px-8 py-6 flex justify-between items-center">
            <h3 className="text-lg font-bold text-on-surface">Active Batch Progress</h3>
            <Link to="/instructor/batches" className="text-primary text-sm font-semibold hover:underline">View All Batches</Link>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead className="bg-surface-container-low border-none">
                <tr>
                  <th className="px-8 py-4 text-[11px] font-bold text-on-surface-variant uppercase tracking-widest">Batch Identity</th>
                  <th className="px-6 py-4 text-[11px] font-bold text-on-surface-variant uppercase tracking-widest text-center">Progress</th>
                  <th className="px-8 py-4 text-[11px] font-bold text-on-surface-variant uppercase tracking-widest text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-transparent">
                {data.myBatches.map((batch, index) => {
                  const studentCount = batch.enrollments?.[0]?.count || 0;
                  return (
                    <tr key={index} className="hover:bg-surface-container-low transition-colors group">
                      <td className="px-8 py-5">
                        <div className="flex flex-col">
                          <span className="text-sm font-bold text-on-surface">{batch.batch_code}</span>
                          <span className="text-[11px] text-secondary">{studentCount} Students • {batch.courses?.title}</span>
                        </div>
                      </td>
                      <td className="px-6 py-5">
                        <span className="text-xs font-medium text-secondary">
                          {batch.start_date
                            ? new Date(batch.start_date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
                            : 'TBD'}
                          {batch.end_date ? ` – ${new Date(batch.end_date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}` : ''}
                        </span>
                      </td>
                      <td className="px-8 py-5 text-right">
                        <Link to={`/instructor/batches/${batch.id}`} className="px-4 py-1.5 text-[12px] font-bold border-2 border-primary text-primary hover:bg-primary hover:text-white rounded transition-all">Open</Link>
                      </td>
                    </tr>
                  )
                })}
                {data.myBatches.length === 0 && (
                  <tr>
                    <td colSpan="3" className="px-8 py-5 text-center text-secondary">No active batches found.</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </section>

        {/* Right Column: Pending Tasks & Flags */}
        <section className="lg:col-span-4 space-y-6">
          {/* Tasks Panel */}
          <div className="bg-surface-container-lowest rounded-xl shadow-[0px_4px_20px_rgba(25,28,30,0.04),0px_8px_40px_rgba(25,28,30,0.02)]">
            <div className="p-6 border-b border-transparent">
              <div className="flex justify-between items-center">
                <h3 className="text-lg font-bold text-on-surface">Critical Focus</h3>
                <span className="px-2 py-1 bg-error-container text-error text-[10px] font-bold rounded uppercase">Action Required</span>
              </div>
            </div>
            <div className="p-2">
              {/* Flagged Students */}
              <div className="p-4 bg-surface-container-low rounded-lg mb-4">
                <div className="flex items-center gap-2 mb-3">
                  <span className="material-symbols-outlined text-error text-[20px]">flag</span>
                  <span className="text-xs font-bold text-on-surface uppercase tracking-wide">Attention Flag ({data.criticalStudents.length})</span>
                </div>
                <div className="space-y-3">
                  {data.criticalStudents.map((student, idx) => (
                    <div key={idx} className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-slate-300 flex items-center justify-center text-xs font-bold text-white">
                          {student.full_name?.charAt(0)}
                        </div>
                        <div className="flex flex-col">
                          <span className="text-xs font-bold">{student.full_name}</span>
                          <span className="text-[10px] text-secondary">Score: {student.total_score} (Low)</span>
                        </div>
                      </div>
                      <Link to={`/instructor/students/${student.student_id}?batch=${student.batch_id}`} className="text-primary hover:text-primary-container">
                        <span className="material-symbols-outlined text-[18px]">visibility</span>
                      </Link>
                    </div>
                  ))}
                  {data.criticalStudents.length === 0 && <p className="text-xs text-secondary">No critical students flagged.</p>}
                </div>
              </div>

              {/* Assignment Queue */}
              <div className="space-y-1">
                <p className="px-4 py-2 text-[11px] font-bold text-secondary uppercase tracking-widest">Pending Assignments</p>
                {pendingGroups.map((group, idx) => {
                  const dueTime = new Date(group.dueDate).getTime();
                  const isExpiring = (dueTime - Date.now()) < 24 * 60 * 60 * 1000;
                  return (
                    <Link key={idx} to="/instructor/assignments" className="flex items-start gap-4 p-4 hover:bg-surface-container transition-colors rounded-lg group">
                      <div className="w-10 h-10 bg-indigo-50 rounded flex items-center justify-center text-primary group-hover:bg-primary group-hover:text-white transition-all shrink-0">
                        <span className="material-symbols-outlined">description</span>
                      </div>
                      <div className="flex flex-col flex-1">
                        <span className="text-sm font-bold text-on-surface">{group.title}</span>
                        <span className="text-xs text-secondary">{group.batchCode} • {group.count} submissions</span>
                        {isExpiring && (
                          <div className="mt-2 text-[10px] text-error font-bold flex items-center gap-1">
                            <span className="material-symbols-outlined text-[14px]">schedule</span>
                            <span>Expiring Soon</span>
                          </div>
                        )}
                      </div>
                    </Link>
                  )
                })}
                {pendingGroups.length === 0 && <p className="px-4 text-xs text-secondary">No pending assignments.</p>}
              </div>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}
