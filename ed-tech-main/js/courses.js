(async function() {
  const { data: { user } } = await window.db.auth.getUser()
  if (!user) { window.location.href = 'index.html'; return; }
  
  const { data: studentProfile } = await window.db.from('users').select('*').eq('id', user.id).single()
  window.STUDENT = studentProfile;

  async function loadCourses() {
    const { data: enrollments } = await window.db.from('enrollments')
      .select('*, batches(*, courses(*, course_modules(count)))')
      .eq('student_id', user.id)
      .eq('status', 'active');

    const statsEl = document.getElementById('courses-stats');
    const listEl = document.getElementById('courses-list');

    if (!enrollments || enrollments.length === 0) {
      listEl.innerHTML = '<div class="col-span-full py-32 text-center bg-white rounded-[3rem] border-2 border-dashed border-slate-100"><p class="text-xs font-black uppercase tracking-[0.3em] text-slate-300">No active course deployments found.</p></div>';
      return;
    }

    // RENDER STATS
    const totalCourses = enrollments.length;
    const completedModules = 12; // Mock for now or calculate from sessions
    const nextClass = "Tomorrow, 10:00 AM";

    statsEl.innerHTML = `
      <div class="bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-xl shadow-slate-200/40 group hover:scale-105 transition-all">
         <span class="material-symbols-outlined text-violet-500 text-3xl mb-3">auto_stories</span>
         <p class="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Active Modules</p>
         <p class="text-3xl font-black text-slate-800">${totalCourses}</p>
      </div>
      <div class="bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-xl shadow-slate-200/40 group hover:scale-105 transition-all">
         <span class="material-symbols-outlined text-emerald-500 text-3xl mb-3">verified</span>
         <p class="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Completed Units</p>
         <p class="text-3xl font-black text-slate-800">${completedModules}</p>
      </div>
      <div class="bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-xl shadow-slate-200/40 group hover:scale-105 transition-all">
         <span class="material-symbols-outlined text-amber-500 text-3xl mb-3">event_upcoming</span>
         <p class="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Next Engagement</p>
         <p class="text-sm font-black text-slate-800 mt-2">${nextClass}</p>
      </div>
      <div class="bg-slate-900 p-8 rounded-[2.5rem] shadow-xl shadow-slate-900/20 group hover:scale-105 transition-all text-white">
         <span class="material-symbols-outlined text-indigo-400 text-3xl mb-3">monitoring</span>
         <p class="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-1">Learning Velocity</p>
         <p class="text-3xl font-black text-white">92%</p>
      </div>
    `;

    // RENDER LIST
    listEl.innerHTML = enrollments.map((e, idx) => {
      const c = e.batches.courses;
      const b = e.batches;
      const moduleCount = c.course_modules?.[0]?.count || 0;
      
      return `
      <div class="course-card bg-white rounded-[3rem] p-10 shadow-2xl shadow-slate-200/50 border border-slate-100 flex flex-col group relative overflow-hidden transition-all hover:shadow-violet-200/40" style="animation-delay: ${idx * 0.1}s">
          <div class="absolute top-0 right-0 w-40 h-40 bg-slate-50 rounded-full -mr-20 -mt-20 group-hover:bg-violet-50 transition-colors duration-500"></div>
          
          <div class="flex justify-between items-start mb-10 relative z-10">
              <div class="w-16 h-16 rounded-[1.5rem] bg-slate-900 text-white flex items-center justify-center shadow-xl group-hover:rotate-6 transition-transform">
                  <span class="material-symbols-outlined text-3xl">school</span>
              </div>
              <span class="px-4 py-1.5 bg-emerald-50 text-emerald-600 rounded-full text-[9px] font-black uppercase tracking-widest border border-emerald-100">Synchronized</span>
          </div>
          
          <div class="flex-1 relative z-10">
              <h3 class="text-2xl font-black text-slate-800 leading-tight mb-3 group-hover:text-violet-600 transition-colors">${c.title}</h3>
              <div class="flex items-center gap-3 mb-6">
                 <span class="text-[10px] font-black text-violet-500 uppercase tracking-widest">${c.code || 'CORE-NODE'}</span>
                 <span class="w-1 h-1 rounded-full bg-slate-200"></span>
                 <span class="text-[10px] font-black text-slate-400 uppercase tracking-widest">${b.batch_code}</span>
              </div>
              <p class="text-sm text-slate-500 font-medium leading-relaxed line-clamp-3 mb-8">${c.description || 'Institutional curriculum node details.'}</p>
          </div>

          <div class="space-y-6 relative z-10">
              <div class="flex items-center justify-between text-[10px] font-black uppercase tracking-widest text-slate-400">
                  <div class="flex items-center gap-2"><span class="material-symbols-outlined text-[18px] text-violet-300">account_tree</span> ${moduleCount} Modules</div>
                  <div class="flex items-center gap-2"><span class="material-symbols-outlined text-[18px] text-violet-300">speed</span> 64% Complete</div>
              </div>
              
              <div class="w-full h-2 bg-slate-50 rounded-full overflow-hidden shadow-inner">
                  <div class="h-full bg-violet-500 rounded-full transition-all duration-1000" style="width: 64%"></div>
              </div>
              
              <button onclick="localStorage.setItem('current_batch_id', '${b.id}'); localStorage.setItem('current_course_id', '${c.id}'); window.location.href='course-detail.html?batchId=${b.id}'" class="w-full py-4 bg-slate-50 text-slate-800 rounded-2xl text-[10px] font-black uppercase tracking-widest hover:bg-slate-900 hover:text-white transition-all shadow-sm active:scale-95">
                 Enter Curriculum Node
              </button>
          </div>
      </div>
      `;
    }).join('');
  }

  loadCourses();
})();
