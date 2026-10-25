import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { supabase } from '@junospace/supabase-client';
import { Loader2, ArrowLeft, Trophy, Clock, Calendar } from 'lucide-react';

export function AssessmentResults() {
  const { id } = useParams();

  const [assessment, setAssessment] = useState(null);
  const [submissions, setSubmissions] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadResults();
  }, [id]);

  async function loadResults() {
    try {
      // 1. Fetch assessment details
      const { data: assessData, error: aErr } = await supabase
        .from('assessments')
        .select('title, total_marks, duration_minutes, batches(batch_code)')
        .eq('id', id)
        .single();

      if (aErr) throw aErr;
      setAssessment(assessData);

      // 2. Fetch submissions joined with user (student profile)
      // Since auth.users is protected, we join on users table (public user data).
      const { data: subsData, error: sErr } = await supabase
        .from('assessment_submissions')
        .select('*, users(full_name, email)')
        .eq('assessment_id', id)
        .order('score', { ascending: false });

      if (sErr) throw sErr;
      setSubmissions(subsData || []);
    } catch (err) {
      console.error(err);
      alert("Failed to load results: " + err.message);
    } finally {
      setLoading(false);
    }
  }

  if (loading) {
    return <div className="pt-24 p-8 flex justify-center"><Loader2 className="animate-spin text-slate-400" /></div>;
  }

  if (!assessment) {
    return (
      <div className="pt-24 p-8 text-center text-slate-500">
        Assessment not found.
        <Link to="/instructor/assessments/create" className="text-indigo-600 font-bold ml-2">Go back</Link>
      </div>
    );
  }

  return (
    <div className="pt-24 p-8 max-w-5xl mx-auto space-y-8">
      <Link to="/instructor/assessments/create" className="inline-flex items-center gap-2 text-slate-500 font-bold hover:text-indigo-600 transition-colors">
        <ArrowLeft size={18} /> Back to Assessments
      </Link>

      <header className="bg-white rounded-3xl p-8 border border-slate-100 shadow-sm">
        <div className="flex justify-between items-start">
          <div>
            <div className="flex items-center gap-3 mb-2 text-xs font-black text-indigo-600 uppercase tracking-widest bg-indigo-50 px-3 py-1 rounded-full w-max">
              Batch {assessment.batches?.batch_code || 'Unknown'}
            </div>
            <h1 className="text-3xl font-black text-slate-800 tracking-tight">{assessment.title}</h1>
            <p className="text-slate-500 font-medium mt-1">Results & Submissions</p>
          </div>

          <div className="flex gap-4">
            <div className="text-center px-6 py-4 bg-slate-50 rounded-2xl">
              <div className="text-2xl font-black text-slate-700">{submissions.length}</div>
              <div className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-1">Students</div>
            </div>
            <div className="text-center px-6 py-4 bg-emerald-50 rounded-2xl">
              <div className="text-2xl font-black text-emerald-600">
                {submissions.length > 0 ? (submissions.reduce((a, b) => a + (b.score || 0), 0) / submissions.length).toFixed(1) : '--'}
              </div>
              <div className="text-[10px] font-bold text-emerald-600/70 uppercase tracking-widest mt-1">Avg Score</div>
            </div>
          </div>
        </div>
      </header>

      <section className="bg-white rounded-3xl border border-slate-100 shadow-sm overflow-hidden">
        {submissions.length === 0 ? (
          <div className="p-12 text-center text-slate-500 font-medium">No students have submitted this assessment yet.</div>
        ) : (
          <table className="w-full text-left">
            <thead className="bg-slate-50 border-b border-slate-100">
              <tr>
                <th className="px-6 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest">Student</th>
                <th className="px-6 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest">Submitted At</th>
                <th className="px-6 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest">Time Taken</th>
                <th className="px-6 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest text-right">Score</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {submissions.map(sub => (
                <tr key={sub.id} className="hover:bg-slate-50 transition-colors">
                  <td className="px-6 py-4">
                    <div className="font-bold text-slate-800 text-sm">{sub.users?.full_name || 'Unknown Student'}</div>
                    <div className="font-medium text-slate-400 text-xs">{sub.users?.email}</div>
                  </td>
                  <td className="px-6 py-4 text-sm font-semibold text-slate-600">
                    <div className="flex items-center gap-2">
                      <Calendar size={14} className="text-slate-400" />
                      {new Date(sub.submitted_at).toLocaleString()}
                    </div>
                  </td>
                  <td className="px-6 py-4 text-sm font-semibold text-slate-600">
                    <div className="flex items-center gap-2">
                      <Clock size={14} className="text-slate-400" />
                      {sub.time_taken_minutes ? `${sub.time_taken_minutes} mins` : '--'}
                    </div>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <div className="inline-flex items-center gap-2 px-3 py-1 bg-emerald-50 text-emerald-700 rounded-lg font-black">
                      <Trophy size={14} /> {sub.score} / {assessment.total_marks}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </section>
    </div>
  );
}
