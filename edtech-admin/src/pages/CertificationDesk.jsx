import { useEffect, useState, useRef } from 'react';
import { supabase } from '@junospace/supabase-client';
import { useAuth } from '../context/AuthContext';

export function CertificationDesk() {
  const { profile } = useAuth();

  const [loading, setLoading] = useState(true);
  const [eligibleStudents, setEligibleStudents] = useState([]);
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [criteria, setCriteria] = useState([]);
  const [batches, setBatches] = useState([]);

  const [tab, setTab] = useState('registry'); // registry | automation | verification
  const [verifyCode, setVerifyCode] = useState('');
  const [verifyResult, setVerifyResult] = useState(null);
  const [verifyError, setVerifyError] = useState('');
  const [verifying, setVerifying] = useState(false);
  const [issuing, setIssuing] = useState(false);
  const [toast, setToast] = useState('');

  const certRef = useRef(null);

  useEffect(() => {
    async function loadData() {
      const [
        { data: enrolls },
        { data: critData },
        { data: batchData }
      ] = await Promise.all([
        supabase.from('enrollments').select('*, users(*), batches(id, batch_code, status, courses(*))').eq('status', 'active'),
        supabase.from('certification_criteria').select('*, courses(title)'),
        supabase.from('batches').select('*, courses(title)').eq('status', 'active')
      ]);

      // Get scores from views
      const { data: scores } = await supabase.from('leaderboard_scores').select('*');
      const { data: skills } = await supabase.from('student_skills').select('*');

      const eligible = (enrolls || []).map(e => {
        const s = scores?.find(x => x.student_id === e.student_id && x.batch_id === e.batch_id);
        const sk = skills?.find(x => x.student_id === e.student_id && x.batch_id === e.batch_id);
        const c = critData?.find(x => x.course_id === e.batches.courses.id) || { min_attendance_pct: 80, min_assignment_avg: 70, min_assessment_avg: 70 };

        const isEligible = (sk?.consistency >= c.min_attendance_pct) && (sk?.technical >= c.min_assignment_avg) && (sk?.conceptual >= c.min_assessment_avg);

        return { ...e, score: s?.total_score || 0, skills: sk, isEligible, criteria: c };
      }).sort((a, b) => b.score - a.score);

      setEligibleStudents(eligible);
      setCriteria(critData || []);
      setBatches(batchData || []);
      setLoading(false);
    }
    loadData();
  }, []);

  const handleIssue = async () => {
    if (!selectedStudent) return;
    setIssuing(true);

    const { data: existing } = await supabase.from('certificates').select('id').eq('student_id', selectedStudent.student_id).eq('batch_id', selectedStudent.batch_id);
    if (existing && existing.length > 0) {
      alert("Certificate already issued for this node.");
      setIssuing(false);
      return;
    }

    const { error } = await supabase.from('certificates').insert({
      student_id: selectedStudent.student_id,
      batch_id: selectedStudent.batch_id,
      course_id: selectedStudent.batches.courses.id,
      issued_by: profile.id,
      status: 'issued'
    });

    if (!error) {
      setToast('Aura Issued Successfully');
      setTimeout(() => setToast(''), 3000);
    }
    setIssuing(false);
  };

  const updateCriteria = async (courseId, field, val) => {
    const existing = criteria.find(c => c.course_id === courseId);
    const update = { [field]: parseInt(val) };

    if (existing) {
      await supabase.from('certification_criteria').update(update).eq('course_id', courseId);
    } else {
      await supabase.from('certification_criteria').insert({ course_id: courseId, ...update });
    }
    // Refresh local
    setCriteria(prev => {
      const idx = prev.findIndex(p => p.course_id === courseId);
      if (idx > -1) {
        const newArr = [...prev];
        newArr[idx] = { ...newArr[idx], ...update };
        return newArr;
      }
      return [...prev, { course_id: courseId, ...update }];
    });
  };

  const handleVerify = async () => {
    if (!verifyCode.trim()) return;
    setVerifying(true);
    setVerifyError('');
    setVerifyResult(null);
    const { data, error } = await supabase
      .from('certificates')
      .select('*, users!certificates_student_id_fkey(full_name, avatar_initials, avatar_color, email), courses(title), batches(batch_code), issued_by_user:users!certificates_issued_by_fkey(full_name)')
      .eq('verify_code', verifyCode.trim())
      .maybeSingle();
    if (error || !data) {
      setVerifyError('No certificate found for that verification code.');
    } else {
      setVerifyResult(data);
    }
    setVerifying(false);
  };

  if (loading) return <div className="p-12 pt-24 text-center text-secondary animate-pulse">Synchronizing Achievement Registry...</div>;

  return (
    <div className="p-8 pt-24 max-w-7xl mx-auto space-y-8">
      <header className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div>
          <h1 className="text-4xl font-black text-on-surface tracking-tighter leading-none">Certification Desk</h1>
          <p className="text-secondary font-medium mt-3">The "Aura Engine" for automated academic verification.</p>
        </div>
        <div className="flex bg-surface-container-low p-1 rounded-2xl gap-1">
          {['registry', 'automation', 'verification'].map(t => (
            <button key={t} onClick={() => setTab(t)} className={`px-6 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${tab === t ? 'bg-primary text-white shadow-lg' : 'text-secondary hover:text-on-surface'}`}>{t}</button>
          ))}
        </div>
      </header>

      {tab === 'registry' && (
        <div className="grid grid-cols-12 gap-8">
          {/* List */}
          <div className="col-span-12 lg:col-span-4 bg-surface-container-lowest rounded-[2.5rem] border border-surface-variant/20 shadow-sm overflow-hidden flex flex-col h-[700px]">
            <div className="p-6 border-b border-surface-variant/10 bg-surface-container-low/30"><p className="text-[10px] font-black text-secondary uppercase tracking-[0.2em]">Deployment Registry</p></div>
            <div className="flex-1 overflow-y-auto p-4 space-y-2">
              {eligibleStudents.map(s => (
                <button key={s.id} onClick={() => setSelectedStudent(s)} className={`w-full p-4 rounded-3xl flex items-center gap-4 transition-all ${selectedStudent?.id === s.id ? 'bg-primary/5 border border-primary/20' : 'hover:bg-surface-container-low border border-transparent'}`}>
                  <div className="w-12 h-12 rounded-2xl bg-slate-900 flex items-center justify-center font-black text-white text-xs shadow-xl" style={{ backgroundColor: s.users.avatar_color }}>{s.users.avatar_initials}</div>
                  <div className="flex-1 text-left min-w-0">
                    <p className="text-sm font-black text-on-surface truncate">{s.users.full_name}</p>
                    <p className="text-[10px] text-secondary font-bold truncate">{s.batches.courses.title}</p>
                  </div>
                  <div className={`w-3 h-3 rounded-full ${s.isEligible ? 'bg-emerald-500 animate-pulse shadow-[0_0_10px_#10b981]' : 'bg-slate-300'}`}></div>
                </button>
              ))}
            </div>
          </div>

          {/* Preview */}
          <div className="col-span-12 lg:col-span-8 bg-surface-container-lowest rounded-[2.5rem] border border-surface-variant/20 shadow-sm p-12 flex flex-col items-center justify-center relative min-h-[600px]">
            {!selectedStudent ? (
              <div className="text-center">
                <span className="material-symbols-outlined text-6xl text-surface-variant mb-4">military_tech</span>
                <p className="text-secondary font-bold">Select a node from the registry to initialize verification.</p>
              </div>
            ) : (
              <>
                <div className="cert-preview w-full max-w-[700px] aspect-[1.414/1] bg-slate-900 rounded-[2.5rem] p-12 flex flex-col items-center text-center text-white relative overflow-hidden shadow-2xl">
                  <div className="absolute inset-0 opacity-10" style={{ backgroundImage: 'radial-gradient(circle at 2px 2px, white 1px, transparent 0)', backgroundSize: '24px 24px' }}></div>
                  <div className="relative z-10 border-2 border-white/10 rounded-[1.5rem] p-10 flex flex-col items-center h-full w-full justify-between">
                    <span className="material-symbols-outlined text-indigo-400 text-5xl">architecture</span>
                    <div>
                      <p className="text-[10px] font-black tracking-[0.5em] text-indigo-300 uppercase mb-4">Official Certification</p>
                      <h2 className="text-4xl font-black tracking-tighter">{selectedStudent.users.full_name}</h2>
                      <div className="h-px w-24 bg-white/20 mx-auto my-6"></div>
                      <p className="text-xs text-slate-400 font-medium italic mb-2">Technical Achievement Verification</p>
                      <h3 className="text-xl font-bold text-indigo-100">{selectedStudent.batches.courses.title}</h3>
                    </div>
                    <div className="w-full flex justify-between items-end">
                      <div className="text-left"><p className="text-[9px] font-black text-slate-500 uppercase tracking-widest">Hash ID</p><p className="text-[10px] font-mono text-slate-400">JNS-AX-992288</p></div>
                      <div className="text-right"><p className="text-[9px] font-black text-slate-500 uppercase tracking-widest">Authority</p><p className="text-[10px] text-slate-400">JUNOSPACE Global</p></div>
                    </div>
                  </div>
                </div>

                <div className="mt-12 flex items-center gap-4">
                  <button onClick={handleIssue} disabled={issuing || !selectedStudent.isEligible} className="px-12 py-4 bg-primary text-white rounded-2xl text-[10px] font-black uppercase tracking-widest shadow-xl shadow-primary/20 hover:scale-105 transition-all disabled:opacity-30">
                    {issuing ? 'Executing Aura...' : 'Issue Authority Node'}
                  </button>
                  {!selectedStudent.isEligible && <p className="text-[10px] font-black text-rose-500 uppercase tracking-widest">Criteria Not Met</p>}
                </div>
              </>
            )}
          </div>
        </div>
      )}

      {tab === 'automation' && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {batches.map(b => {
            const c = criteria.find(x => x.course_id === b.courses.id) || { min_attendance_pct: 80, min_assignment_avg: 70, min_assessment_avg: 70 };
            return (
              <div key={b.id} className="bg-surface-container-lowest p-8 rounded-[2.5rem] border border-surface-variant/20 shadow-sm space-y-8">
                <div>
                  <h3 className="text-xl font-black text-on-surface leading-none">{b.courses.title}</h3>
                  <p className="text-[10px] font-black text-secondary uppercase tracking-widest mt-2">Criteria Management</p>
                </div>
                <div className="space-y-6">
                  {[
                    { label: 'Min Attendance', field: 'min_attendance_pct', val: c.min_attendance_pct },
                    { label: 'Min Assignment', field: 'min_assignment_avg', val: c.min_assignment_avg },
                    { label: 'Min Assessment', field: 'min_assessment_avg', val: c.min_assessment_avg }
                  ].map(f => (
                    <div key={f.field}>
                      <div className="flex justify-between text-[11px] font-black text-on-surface-variant uppercase tracking-wider mb-2"><span>{f.label}</span><span>{f.val}%</span></div>
                      <input type="range" min="50" max="100" value={f.val} onChange={(e) => updateCriteria(b.courses.id, f.field, e.target.value)} className="w-full accent-primary h-1.5 bg-surface-container-high rounded-full appearance-none cursor-pointer" />
                    </div>
                  ))}
                </div>
                <button onClick={() => supabase.rpc('issue_batch_certifications', { p_batch_id: b.id })} className="w-full py-4 bg-slate-900 text-white rounded-2xl text-[10px] font-black uppercase tracking-widest hover:bg-slate-800 transition-colors">Mass Issue Node</button>
              </div>
            );
          })}
        </div>
      )}

      {tab === 'verification' && (
        <div className="max-w-2xl mx-auto space-y-8">
          <div className="bg-surface-container-lowest rounded-[2.5rem] border border-surface-variant/20 shadow-sm p-10">
            <p className="text-[10px] font-black text-secondary uppercase tracking-[0.2em] mb-6">Certificate Verification Portal</p>
            <div className="flex gap-4">
              <input
                type="text"
                placeholder="Enter verify code..."
                value={verifyCode}
                onChange={e => { setVerifyCode(e.target.value); setVerifyResult(null); setVerifyError(''); }}
                onKeyDown={e => e.key === 'Enter' && handleVerify()}
                className="flex-1 bg-surface-container-low border-none rounded-2xl px-6 py-4 text-sm font-bold text-on-surface focus:ring-4 focus:ring-primary/10 transition-all"
              />
              <button
                onClick={handleVerify}
                disabled={verifying || !verifyCode.trim()}
                className="px-8 py-4 bg-primary text-white rounded-2xl text-[10px] font-black uppercase tracking-widest shadow-xl shadow-primary/20 hover:scale-105 transition-all disabled:opacity-30"
              >
                {verifying ? 'Checking...' : 'Verify'}
              </button>
            </div>

            {verifyError && (
              <div className="mt-6 flex items-center gap-3 p-4 bg-rose-50 rounded-2xl border border-rose-100">
                <span className="material-symbols-outlined text-rose-500">cancel</span>
                <p className="text-sm font-bold text-rose-700">{verifyError}</p>
              </div>
            )}

            {verifyResult && (
              <div className="mt-8 space-y-6">
                <div className="flex items-center gap-3 p-4 bg-emerald-50 rounded-2xl border border-emerald-100">
                  <span className="material-symbols-outlined text-emerald-500 text-2xl">verified</span>
                  <p className="text-sm font-black text-emerald-700">Certificate is Authentic & Valid</p>
                </div>
                <div className="bg-slate-900 rounded-[2rem] p-8 text-white flex flex-col items-center text-center relative overflow-hidden">
                  <div className="absolute inset-0 opacity-10" style={{ backgroundImage: 'radial-gradient(circle at 2px 2px, white 1px, transparent 0)', backgroundSize: '24px 24px' }} />
                  <div className="relative z-10 border-2 border-white/10 rounded-[1.5rem] p-8 flex flex-col items-center w-full gap-4">
                    <span className="material-symbols-outlined text-indigo-400 text-4xl">workspace_premium</span>
                    <div className="w-20 h-20 rounded-2xl flex items-center justify-center text-2xl font-black text-white shadow-xl" style={{ backgroundColor: verifyResult.users?.avatar_color || '#6C35DE' }}>
                      {verifyResult.users?.avatar_initials || '?'}
                    </div>
                    <div>
                      <p className="text-[10px] font-black tracking-[0.4em] text-indigo-300 uppercase mb-2">Official Certification</p>
                      <h2 className="text-3xl font-black tracking-tighter">{verifyResult.users?.full_name}</h2>
                      <div className="h-px w-20 bg-white/20 mx-auto my-4" />
                      <p className="text-sm text-slate-400">Successfully completed</p>
                      <h3 className="text-xl font-bold text-indigo-100 mt-1">{verifyResult.courses?.title}</h3>
                      <p className="text-xs text-slate-500 mt-2">Batch: {verifyResult.batches?.batch_code}</p>
                    </div>
                    <div className="w-full flex justify-between items-end pt-4 border-t border-white/10">
                      <div className="text-left">
                        <p className="text-[9px] font-black text-slate-500 uppercase tracking-widest">Verify Code</p>
                        <p className="text-[10px] font-mono text-slate-400 mt-0.5">{verifyResult.verify_code}</p>
                      </div>
                      <div className="text-right">
                        <p className="text-[9px] font-black text-slate-500 uppercase tracking-widest">Issued</p>
                        <p className="text-[10px] text-slate-400 mt-0.5">{new Date(verifyResult.issued_at).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</p>
                      </div>
                    </div>
                    {verifyResult.status === 'revoked' && (
                      <div className="w-full p-3 bg-rose-900/50 rounded-xl border border-rose-500/30 mt-2">
                        <p className="text-xs font-black text-rose-400 text-center uppercase tracking-widest">⚠ This certificate has been revoked</p>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {toast && (
        <div className="fixed bottom-12 left-1/2 -translate-x-1/2 bg-slate-900 text-white px-8 py-4 rounded-full font-bold shadow-2xl flex items-center gap-3 animate-in slide-in-from-bottom duration-300 z-[100]">
          <span className="material-symbols-outlined text-emerald-400">verified</span>
          {toast}
        </div>
      )}
    </div>
  );
}
