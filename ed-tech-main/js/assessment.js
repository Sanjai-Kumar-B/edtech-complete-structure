(async function() {
  const { data: { user } } = await window.db.auth.getUser()
  if (!user) { window.location.href = 'index.html'; return; }
  
  const { data: S } = await window.db.from('users').select('*').eq('id', user.id).single()
  window.STUDENT = S
  
  let currentFilter = 'active';

  window.filterStatus = (status, btn) => {
    currentFilter = status;
    document.querySelectorAll('.status-tab').forEach(t => {
      t.classList.remove('bg-white', 'shadow-sm', 'text-violet-600');
      t.classList.add('text-slate-500');
    });
    btn.classList.add('bg-white', 'shadow-sm', 'text-violet-600');
    btn.classList.remove('text-slate-500');
    loadAssessments();
  };

  async function loadAssessments() {
    const listEl = document.getElementById('assessment-list');
    
    // 1. Fetch Enrollments for Batch IDs
    const { data: enrollments } = await window.db.from('enrollments').select('batch_id').eq('student_id', S.id).eq('status', 'active');
    const batchIds = (enrollments || []).map(e => e.batch_id);

    if (batchIds.length === 0) {
      listEl.innerHTML = '<div class="py-20 text-center bg-white rounded-[3rem] border-2 border-dashed border-slate-100"><p class="text-xs font-black uppercase tracking-[0.3em] text-slate-300">No active cohort deployments found.</p></div>';
      return;
    }

    // 2. Fetch Assessments
    const { data: assessments } = await window.db.from('assessments').select('*, batches(batch_code, courses(title, code))').in('batch_id', batchIds).eq('is_published', true);
    
    // 3. Fetch Submissions
    const { data: submissions } = await window.db.from('assessment_submissions').select('*').eq('student_id', S.id);
    const subIds = (submissions || []).map(s => s.assessment_id);

    const filtered = (assessments || []).filter(a => {
      if (currentFilter === 'active') return !subIds.includes(a.id);
      return subIds.includes(a.id);
    });

    if (filtered.length === 0) {
      listEl.innerHTML = `<div class="py-20 text-center bg-white rounded-[3rem] border border-slate-100"><p class="text-xs font-black uppercase tracking-[0.3em] text-slate-400">No ${currentFilter} evaluations found.</p></div>`;
      return;
    }

    listEl.innerHTML = filtered.map((a, idx) => {
      const sub = (submissions || []).find(s => s.assessment_id === a.id);
      const isOverdue = new Date(a.due_date) < new Date();
      
      return `
      <div class="assessment-card bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-xl shadow-slate-200/40 hover:shadow-violet-200/40 transition-all group flex flex-col md:flex-row md:items-center justify-between gap-8" style="animation-delay: ${idx * 0.1}s">
          <div class="flex items-center gap-6">
              <div class="w-16 h-16 rounded-[1.5rem] bg-slate-900 text-white flex items-center justify-center shadow-xl group-hover:rotate-6 transition-transform">
                  <span class="material-symbols-outlined text-2xl">${currentFilter === 'active' ? 'quiz' : 'verified'}</span>
              </div>
              <div>
                  <p class="text-[9px] font-black text-violet-500 uppercase tracking-widest mb-1">${a.batches?.courses?.code || 'CORE-NODE'}</p>
                  <h3 class="text-xl font-black text-slate-800 leading-tight group-hover:text-violet-600 transition-colors">${a.title}</h3>
                  <div class="flex items-center gap-3 mt-2">
                     <span class="text-[10px] font-bold text-slate-400 uppercase tracking-widest">${a.batches?.batch_code}</span>
                     <span class="w-1 h-1 rounded-full bg-slate-200"></span>
                     <span class="text-[10px] font-bold ${isOverdue ? 'text-rose-500' : 'text-slate-400'} uppercase tracking-widest">${currentFilter === 'active' ? 'Due ' + new Date(a.due_date).toLocaleDateString() : 'Resolved'}</span>
                  </div>
              </div>
          </div>
          <div class="flex items-center gap-6 shrink-0">
              ${currentFilter === 'active' ? `
                <div class="text-right hidden md:block">
                   <p class="text-xs font-black text-slate-800">${a.duration_minutes}m</p>
                   <p class="text-[9px] font-bold text-slate-400 uppercase tracking-widest">Duration</p>
                </div>
                <button onclick="window.location.href='assessment.html?id=${a.id}'" class="px-8 py-4 bg-slate-900 text-white rounded-2xl text-[10px] font-black uppercase tracking-widest shadow-xl shadow-slate-900/10 hover:scale-105 active:scale-95 transition-all">Initialize Quest</button>
              ` : `
                <div class="text-right">
                   <p class="text-2xl font-black text-slate-800">${sub.score}%</p>
                   <p class="text-[10px] font-bold text-emerald-500 uppercase tracking-widest">Success Rate</p>
                </div>
                <button class="w-12 h-12 rounded-2xl bg-slate-50 text-slate-400 flex items-center justify-center hover:bg-slate-900 hover:text-white transition-all"><span class="material-symbols-outlined text-xl">visibility</span></button>
              `}
          </div>
      </div>
      `;
    }).join('');
  }

  loadAssessments();
})();
