(async function() {
  const { data: { user } } = await window.db.auth.getUser()
  if (!user) { window.location.href = 'index.html'; return; }
  const { data: studentProfile } = await window.db.from('users').select('*').eq('id', user.id).single()
  window.STUDENT = studentProfile
  const S = window.STUDENT;

  const urlParams = new URLSearchParams(window.location.search);
  let batchId = urlParams.get('batchId') || localStorage.getItem('current_batch_id');
  let courseId = urlParams.get('courseId') || localStorage.getItem('current_course_id');
  
  if (!batchId) {
      window.location.href = 'courses.html';
      return;
  }

  // Set up Tabs
  const tabBtns = document.querySelectorAll('.tab-btn');
  const tabPanes = document.querySelectorAll('.tab-pane');
  tabBtns.forEach(btn => {
      btn.addEventListener('click', () => {
          tabBtns.forEach(b => {
              b.classList.remove('border-violet-600', 'text-violet-600');
              b.classList.add('border-transparent', 'text-slate-500');
          });
          btn.classList.remove('border-transparent', 'text-slate-500');
          btn.classList.add('border-violet-600', 'text-violet-600');
          
          const target = btn.getAttribute('data-tab');
          tabPanes.forEach(p => p.classList.add('hidden'));
          const pane = document.getElementById(`tab-${target}`);
          if(pane) pane.classList.remove('hidden');
      });
  });

  // Fetch Course and Batch Details
  const { data: batchData } = await window.db.from('batches').select('*, courses(*)').eq('id', batchId).single();
  if (batchData && batchData.courses) {
      const course = batchData.courses;
      let sDate = batchData.start_date ? new Date(batchData.start_date).toLocaleDateString(undefined, {month:'short', year:'numeric'}) : 'Start';
      let eDate = batchData.end_date ? new Date(batchData.end_date).toLocaleDateString(undefined, {month:'short', year:'numeric'}) : 'Present';
      
      const instructorName = batchData.users?.full_name || 'Dr. Aris Thorne';
      const instructorInitials = batchData.users?.avatar_initials || 'AT';

      const headerHtml = `
      <div class="relative overflow-hidden rounded-[3rem] bg-slate-900 p-10 md:p-14 shadow-2xl shadow-violet-900/20 mb-8 border border-slate-800">
          <!-- Decorative Background Elements -->
          <div class="absolute top-0 right-0 w-[600px] h-[600px] bg-gradient-to-bl from-violet-600/30 to-indigo-600/5 rounded-full blur-3xl -mr-64 -mt-64 pointer-events-none"></div>
          <div class="absolute bottom-0 left-20 w-72 h-72 bg-blue-500/10 rounded-full blur-3xl -mb-32 pointer-events-none"></div>
          
          <div class="relative z-10 grid grid-cols-1 md:grid-cols-12 gap-10 items-center">
              <div class="md:col-span-8">
                  <div class="flex items-center gap-3 mb-6">
                      <span class="px-4 py-1.5 bg-violet-500/20 text-violet-300 font-black text-[10px] rounded-full uppercase tracking-widest border border-violet-500/30 backdrop-blur-md">${course.code}</span>
                      <span class="px-4 py-1.5 bg-white/10 text-slate-300 font-bold text-[10px] rounded-full uppercase tracking-widest border border-white/5 backdrop-blur-md">${sDate} - ${eDate}</span>
                      <span class="px-4 py-1.5 bg-slate-800 text-slate-400 font-bold text-[10px] rounded-full uppercase tracking-widest border border-slate-700">${batchData.batch_code}</span>
                  </div>
                  
                  <h1 class="text-4xl md:text-5xl lg:text-6xl font-black text-white tracking-tight leading-tight mb-6 drop-shadow-sm">${course.title}</h1>
                  
                  <p class="text-lg text-slate-400 max-w-2xl font-medium leading-relaxed mb-10">
                      ${course.description || 'Welcome to the course. Here you will find all your materials, live sessions, assignments, and assessments. Navigate using the tabs below.'}
                  </p>
                  
                  <div class="flex flex-wrap items-center gap-8">
                      <!-- Instructor -->
                      <div class="flex items-center gap-4">
                          <div class="w-12 h-12 rounded-full bg-gradient-to-br from-violet-400 to-indigo-600 flex items-center justify-center text-white font-bold text-sm shadow-inner border-2 border-slate-800">${instructorInitials}</div>
                          <div>
                              <p class="text-[10px] text-slate-500 font-bold uppercase tracking-widest">Lead Instructor</p>
                              <p class="text-sm font-bold text-slate-200">${instructorName}</p>
                          </div>
                      </div>
                      
                      <!-- Divider -->
                      <div class="w-px h-10 bg-slate-800 hidden md:block"></div>
                      
                      <!-- Course Stats -->
                      <div class="flex items-center gap-6">
                          <div>
                              <p class="text-[10px] text-slate-500 font-bold uppercase tracking-widest">Modules</p>
                              <p class="text-lg font-black text-white">12 <span class="text-xs text-slate-500 font-medium tracking-normal">units</span></p>
                          </div>
                          <div>
                              <p class="text-[10px] text-slate-500 font-bold uppercase tracking-widest">Duration</p>
                              <p class="text-lg font-black text-white">45 <span class="text-xs text-slate-500 font-medium tracking-normal">hours</span></p>
                          </div>
                      </div>
                  </div>
              </div>
              
              <div class="md:col-span-4 flex flex-col items-end justify-center">
                  <!-- Progress Card -->
                  <div class="w-full bg-white/5 backdrop-blur-xl border border-white/10 rounded-[2rem] p-8 shadow-2xl relative overflow-hidden group hover:bg-white/10 transition-colors">
                      <div class="flex justify-between items-end mb-4">
                          <div>
                              <p class="text-[10px] text-slate-400 font-bold uppercase tracking-widest mb-1">Your Progress</p>
                              <p class="text-3xl font-black text-white">64<span class="text-lg text-slate-500 font-medium">%</span></p>
                          </div>
                          <div class="w-10 h-10 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center">
                              <span class="material-symbols-outlined text-sm">trending_up</span>
                          </div>
                      </div>
                      <div class="w-full h-2 bg-slate-800 rounded-full overflow-hidden mb-6">
                          <div class="h-full bg-gradient-to-r from-emerald-400 to-teal-400 rounded-full w-[64%] shadow-[0_0_10px_rgba(52,211,153,0.5)] group-hover:w-[70%] transition-all duration-1000"></div>
                      </div>
                      <button class="w-full py-4 bg-white text-slate-900 rounded-xl font-bold text-sm hover:bg-violet-600 hover:text-white transition-colors shadow-lg active:scale-95 flex items-center justify-center gap-2">
                          Continue Learning <span class="material-symbols-outlined text-[16px]">arrow_forward</span>
                      </button>
                  </div>
              </div>
          </div>
      </div>`;
      document.getElementById('cd-header').innerHTML = headerHtml;
  }

  const todayStr = new Date().toISOString().split('T')[0];

  // LIVE CLASSES TAB
  const { data: sessions } = await window.db.from('sessions').select('*').eq('batch_id', batchId).order('session_date', { ascending: true });
  let liveHtml = '<div class="space-y-6">';
  if(sessions && sessions.length > 0) {
      sessions.forEach(s => {
          const isPast = s.session_date < todayStr;
          const isToday = s.session_date === todayStr;
          
          let statusBadge = '';
          let actionBtn = '';
          let bgClass = 'bg-white border-slate-200 hover:shadow-xl hover:-translate-y-1 transition-all duration-300';
          let iconColor = 'text-violet-500 bg-violet-100';
          
          if(isToday) {
              statusBadge = '<p class="text-[10px] font-black text-emerald-500 uppercase tracking-widest mb-1 flex items-center gap-2"><span class="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span> Today • ' + s.start_time.substring(0,5) + '</p>';
              actionBtn = `<button onclick="window.open('${s.zoom_link || '#'}', '_blank')" class="px-8 py-3 bg-gradient-to-r from-emerald-400 to-teal-500 text-white font-bold rounded-full shadow-lg shadow-emerald-500/30 hover:shadow-emerald-500/50 hover:scale-105 active:scale-95 transition-all flex items-center gap-2">Join Session <span class="material-symbols-outlined text-sm">videocam</span></button>`;
              bgClass = 'bg-gradient-to-r from-emerald-50/50 to-teal-50/10 border-emerald-200 hover:shadow-emerald-500/20 shadow-md relative overflow-hidden';
              iconColor = 'text-emerald-500 bg-emerald-100';
          } else if (isPast) {
              statusBadge = '<p class="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">' + s.session_date + ' • Completed</p>';
              actionBtn = `<button class="px-6 py-2.5 bg-slate-100 text-slate-400 font-bold rounded-full cursor-not-allowed border border-slate-200">Completed</button>`;
              bgClass = 'bg-slate-50/50 border-slate-100 opacity-75';
              iconColor = 'text-slate-400 bg-slate-200';
          } else {
              statusBadge = '<p class="text-[10px] font-bold text-violet-500 uppercase tracking-widest mb-1">' + s.session_date + ' • ' + s.start_time.substring(0,5) + '</p>';
              actionBtn = `<button class="px-8 py-3 bg-violet-100 text-violet-600 font-bold rounded-full hover:bg-violet-200 transition-colors border border-violet-200 flex items-center gap-2">Upcoming <span class="material-symbols-outlined text-sm">schedule</span></button>`;
          }

          liveHtml += `
          <div class="${bgClass} p-6 md:p-8 rounded-[2rem] border flex flex-col md:flex-row items-start md:items-center justify-between group">
              ${isToday ? '<div class="absolute inset-0 bg-gradient-to-r from-emerald-400/10 to-transparent pointer-events-none"></div>' : ''}
              <div class="flex items-center gap-6 relative z-10 w-full md:w-auto mb-6 md:mb-0">
                  <div class="w-16 h-16 rounded-2xl flex items-center justify-center ${iconColor} shadow-inner group-hover:scale-110 transition-transform">
                      <span class="material-symbols-outlined text-3xl">record_voice_over</span>
                  </div>
                  <div>
                      ${statusBadge}
                      <h4 class="text-xl md:text-2xl font-black text-slate-800 tracking-tight">${s.title}</h4>
                      <p class="text-sm text-slate-500 mt-1 font-medium">${s.description || 'Interactive live module session.'}</p>
                  </div>
              </div>
              <div class="relative z-10 w-full md:w-auto text-right">
                  ${actionBtn}
              </div>
          </div>`;
      });
  } else {
      liveHtml += '<div class="p-12 bg-slate-50 border-2 border-dashed border-slate-200 rounded-[2rem] text-center"><span class="material-symbols-outlined text-4xl text-slate-400 mb-4">event_busy</span><p class="text-slate-500 font-bold">No live classes scheduled.</p></div>';
  }
  liveHtml += '</div>';
  document.getElementById('tab-live').innerHTML = liveHtml;

  // ASSIGNMENTS TAB
  const { data: assignments } = await window.db.from('assignments').select('*').eq('batch_id', batchId).eq('is_published', true).order('due_date', { ascending: false });
  const { data: mySubmissions } = await window.db.from('assignment_submissions').select('*').eq('student_id', S.id);
  
  let assignHtml = '<div class="space-y-6">';
  if(assignments && assignments.length > 0) {
      assignments.forEach(a => {
          const sub = (mySubmissions || []).find(s => s.assignment_id === a.id);
          let badge = '';
          let borderClass = '';
          let iconHTML = '';
          if(sub) {
              if(sub.status === 'reviewed' || sub.score !== null) {
                  badge = `<span class="bg-violet-100 text-violet-700 px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest shadow-sm">Scored: ${sub.score || 100}</span>`;
                  borderClass = 'border-violet-300 bg-violet-50/30';
                  iconHTML = '<div class="w-14 h-14 rounded-2xl bg-violet-100 text-violet-600 flex items-center justify-center shadow-inner"><span class="material-symbols-outlined text-2xl">verified</span></div>';
              } else {
                  badge = '<span class="bg-blue-100 text-blue-700 px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest shadow-sm">Submitted</span>';
                  borderClass = 'border-blue-300 bg-blue-50/30';
                  iconHTML = '<div class="w-14 h-14 rounded-2xl bg-blue-100 text-blue-600 flex items-center justify-center shadow-inner"><span class="material-symbols-outlined text-2xl">publish</span></div>';
              }
          } else {
              badge = '<span class="bg-orange-100 text-orange-600 px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest shadow-sm">Pending</span>';
              borderClass = 'border-orange-300 bg-white';
              iconHTML = '<div class="w-14 h-14 rounded-2xl bg-orange-100 text-orange-500 flex items-center justify-center shadow-inner"><span class="material-symbols-outlined text-2xl">assignment</span></div>';
          }
          
          assignHtml += `
          <div class="p-6 md:p-8 rounded-[2rem] border-l-8 border-y border-r border-y-slate-200 border-r-slate-200 ${borderClass} shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 flex flex-col md:flex-row items-start md:items-center justify-between group">
              <div class="flex items-center gap-6 mb-6 md:mb-0">
                  ${iconHTML}
                  <div>
                      <h4 class="text-xl md:text-2xl font-black text-slate-800 tracking-tight group-hover:text-violet-700 transition-colors">${a.title}</h4>
                      <p class="text-sm text-slate-500 mt-1 font-medium">${a.description || 'Assignment details overview.'}</p>
                      <p class="text-[10px] text-slate-400 mt-3 font-bold uppercase tracking-widest"><span class="material-symbols-outlined text-[12px] align-text-bottom mr-1">event</span> Due: ${new Date(a.due_date).toLocaleDateString()}</p>
                  </div>
              </div>
              <div class="flex flex-col items-end gap-4 w-full md:w-auto">
                  ${badge}
                  ${!sub ? `<button class="text-sm font-bold text-violet-600 hover:text-violet-800 bg-violet-50 hover:bg-violet-100 px-6 py-2.5 rounded-full transition-colors flex items-center gap-2">Submit Work <span class="material-symbols-outlined text-sm">upload</span></button>` : `<button class="text-sm font-bold text-slate-500 hover:text-slate-800 bg-slate-100 hover:bg-slate-200 px-6 py-2.5 rounded-full transition-colors flex items-center gap-2">View File <span class="material-symbols-outlined text-sm">visibility</span></button>`}
              </div>
          </div>`;
      });
  } else {
      assignHtml += '<div class="p-12 bg-slate-50 border-2 border-dashed border-slate-200 rounded-[2rem] text-center"><span class="material-symbols-outlined text-4xl text-slate-400 mb-4">assignment_turned_in</span><p class="text-slate-500 font-bold">No assignments published yet.</p></div>';
  }
  assignHtml += '</div>';
  document.getElementById('tab-assignments').innerHTML = assignHtml;

  // MATERIALS TAB
  const materialsSessions = (sessions || []).filter(s => s.resource_url);
  let matHtml = '<div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">';
  if(materialsSessions.length > 0) {
      materialsSessions.forEach(s => {
          matHtml += `
          <div class="bg-white hover:bg-violet-50/50 p-6 md:p-8 rounded-[2rem] border border-slate-200 shadow-sm hover:shadow-xl hover:-translate-y-1 hover:border-violet-200 transition-all duration-300 flex flex-col justify-between group">
              <div class="flex items-start gap-4 mb-8">
                  <div class="w-14 h-14 bg-gradient-to-br from-violet-100 to-indigo-100 rounded-2xl flex items-center justify-center text-violet-600 shadow-inner group-hover:scale-110 transition-transform">
                      <span class="material-symbols-outlined text-2xl">folder_zip</span>
                  </div>
                  <div class="flex-1">
                      <h4 class="text-lg font-black text-slate-800 tracking-tight leading-tight group-hover:text-violet-700 transition-colors">${s.title}</h4>
                      <p class="text-[10px] text-slate-400 font-bold uppercase tracking-widest mt-2">Class Material</p>
                  </div>
              </div>
              <button onclick="window.open('${s.resource_url}', '_blank')" class="w-full py-3.5 bg-slate-900 hover:bg-violet-600 text-white font-bold rounded-xl shadow-lg hover:shadow-violet-500/30 transition-all flex items-center justify-center gap-2 active:scale-95">
                  <span class="material-symbols-outlined text-[18px]">cloud_download</span> Download File
              </button>
          </div>`;
      });
  } else {
      matHtml += '<div class="col-span-full p-12 bg-slate-50 border-2 border-dashed border-slate-200 rounded-[2rem] text-center"><span class="material-symbols-outlined text-4xl text-slate-400 mb-4">folder_off</span><p class="text-slate-500 font-bold">No materials available yet.</p></div>';
  }
  matHtml += '</div>';
  document.getElementById('tab-materials').innerHTML = matHtml;

  // ASSESSMENTS TAB
  const { data: assessments } = await window.db.from('assessments').select('*').eq('batch_id', batchId).eq('is_published', true);
  const { data: myAttempts } = await window.db.from('assessment_submissions').select('*').eq('student_id', S.id);
  
  let assessHtml = '<div class="grid grid-cols-1 md:grid-cols-2 gap-8">';
  if(assessments && assessments.length > 0) {
      assessments.forEach(a => {
          const attempt = (myAttempts || []).find(sub => sub.assessment_id === a.id);
          assessHtml += `
          <div class="bg-white p-8 md:p-10 rounded-[2.5rem] border border-slate-200 shadow-[0_8px_30px_rgb(0,0,0,0.04)] flex flex-col justify-between relative overflow-hidden group hover:-translate-y-2 hover:shadow-[0_20px_40px_rgb(124,58,237,0.1)] hover:border-violet-200 transition-all duration-500">
              <div class="absolute top-0 right-0 w-64 h-64 bg-gradient-to-bl from-violet-500/10 to-transparent rounded-full blur-3xl -mr-20 -mt-20 pointer-events-none group-hover:from-violet-500/20 transition-all duration-500"></div>
              
              <div class="relative z-10">
                  <div class="flex justify-between items-start mb-8">
                      <div class="p-4 bg-gradient-to-br from-violet-100 to-indigo-100 text-violet-600 rounded-2xl shadow-inner group-hover:scale-110 transition-transform">
                          <span class="material-symbols-outlined text-3xl">quiz</span>
                      </div>
                      ${attempt ? `<span class="bg-emerald-100 text-emerald-700 px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest shadow-sm">Scored: ${attempt.score || 0}%</span>` : `<span class="bg-orange-100 text-orange-600 px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest shadow-sm">Pending</span>`}
                  </div>
                  <h4 class="text-2xl font-black text-slate-800 tracking-tight leading-tight group-hover:text-violet-700 transition-colors">${a.title}</h4>
                  <p class="text-sm text-slate-500 mt-3 leading-relaxed font-medium">${a.description || 'Evaluate your understanding of the module contents.'}</p>
              </div>
              <button onclick="window.startAssessment('${a.id}', ${!!attempt})" class="relative z-10 mt-10 w-full py-4 rounded-xl font-bold transition-all flex items-center justify-center gap-2 ${attempt ? 'bg-slate-100 text-slate-600 hover:bg-slate-200 active:scale-95' : 'bg-gradient-to-r from-violet-600 to-indigo-600 text-white shadow-lg shadow-violet-500/30 hover:shadow-violet-500/50 hover:from-violet-500 hover:to-indigo-500 active:scale-95'}">
                  ${attempt ? '<span class="material-symbols-outlined text-[18px]">visibility</span> Review Answers' : 'Begin Assessment <span class="material-symbols-outlined text-[18px]">arrow_forward</span>'}
              </button>
          </div>`;
      });
  } else {
      assessHtml += '<div class="col-span-full p-12 bg-slate-50 border-2 border-dashed border-slate-200 rounded-[2rem] text-center"><span class="material-symbols-outlined text-4xl text-slate-400 mb-4">flaky</span><p class="text-slate-500 font-bold">No assessments published yet.</p></div>';
  }
  assessHtml += '</div>';
  document.getElementById('tab-assessments').innerHTML = assessHtml;

  // AI ROADMAP TAB
  const { data: roadmaps } = await window.db.from('roadmap_weeks').select('*').eq('batch_id', batchId).order('week_number', { ascending: true });
  
  if (!document.getElementById('node-modal')) {
      const modalHtml = `
      <div id="node-modal" class="hidden fixed inset-0 z-[100] bg-slate-900/60 backdrop-blur-lg flex items-center justify-center p-6">
          <div class="bg-white rounded-[3rem] p-12 max-w-xl w-full shadow-2xl relative overflow-hidden">
              <div class="absolute top-0 left-0 w-full h-2 bg-indigo-500"></div>
              <div id="modal-content" class="text-center">
                  <div id="modal-icon" class="w-20 h-20 bg-indigo-50 text-indigo-500 rounded-[1.5rem] flex items-center justify-center mx-auto mb-8"><span class="material-symbols-outlined text-4xl">rocket_launch</span></div>
                  <h3 id="modal-title" class="text-3xl font-black text-slate-800 mb-4">Node Title</h3>
                  <p id="modal-desc" class="text-slate-500 font-medium leading-relaxed mb-10">Module description will appear here.</p>
                  <button onclick="document.getElementById('node-modal').classList.add('hidden')" class="w-full py-4 bg-slate-900 text-white rounded-2xl text-[10px] font-black uppercase tracking-widest shadow-xl shadow-slate-900/20 hover:scale-105 active:scale-95 transition-all">Establish Link</button>
              </div>
          </div>
      </div>`;
      document.body.insertAdjacentHTML('beforeend', modalHtml);

      window.showNode = function(title, desc) {
          document.getElementById('modal-title').innerText = title;
          document.getElementById('modal-desc').innerText = desc || 'No description available.';
          document.getElementById('node-modal').classList.remove('hidden');
      };
  }

  let roadHtml = `
  <style>
      #roadmap-path { stroke-dasharray: 2000; stroke-dashoffset: 2000; animation: path-draw 3s ease-out forwards; }
      @keyframes path-draw { to { stroke-dashoffset: 0; } }
      .node-pulse { animation: node-ping 2s cubic-bezier(0, 0, 0.2, 1) infinite; }
      @keyframes node-ping { 75%, 100% { transform: scale(1.5); opacity: 0; } }
      .aura-particle { position: absolute; width: 6px; height: 6px; background: #8b5cf6; border-radius: 9999px; offset-path: path("M200,50 Q280,150 200,250 T200,450 T200,650 T200,850 T200,1050"); animation: particle-move 5s linear infinite; box-shadow: 0 0 20px 5px rgba(139, 92, 246, 0.5); }
      @keyframes particle-move { to { offset-distance: 100%; } }
  </style>
  <div class="relative max-w-4xl mx-auto py-24 min-h-[1200px] mt-10 bg-slate-50/30 rounded-[3rem] border border-slate-100/50 shadow-inner overflow-hidden">
      <div class="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-violet-100/20 via-transparent to-transparent pointer-events-none"></div>
      <svg class="absolute top-0 left-0 w-full h-full pointer-events-none z-0 overflow-visible" viewBox="0 0 400 1200" preserveAspectRatio="xMidYMin slice">
          <path id="roadmap-path" d="M200,50 Q280,150 200,250 T200,450 T200,650 T200,850 T200,1050" 
                stroke="url(#pathGradient)" stroke-width="6" fill="none" stroke-linecap="round" filter="drop-shadow(0 0 10px rgba(139,92,246,0.3))" />
          <defs>
              <linearGradient id="pathGradient" x1="0%" y1="0%" x2="0%" y2="100%">
                  <stop offset="0%" style="stop-color:#8b5cf6;stop-opacity:1" />
                  <stop offset="50%" style="stop-color:#c084fc;stop-opacity:1" />
                  <stop offset="100%" style="stop-color:#6366f1;stop-opacity:1" />
              </linearGradient>
          </defs>
      </svg>
      <div class="aura-particle" style="animation-delay: 0s"></div>
      <div class="aura-particle" style="animation-delay: -2.5s"></div>
      <div id="nodes-container" class="space-y-48 w-full relative z-10 flex flex-col items-center">
  `;

  if(roadmaps && roadmaps.length > 0) {
      roadmaps.forEach((w, i) => {
          const isCompleted = w.status === 'completed';
          const isActive = w.status === 'active';
          const sideClass = i % 2 === 0 ? '-translate-x-28' : 'translate-x-28';
          
          roadHtml += `
          <div class="flex justify-center ${sideClass}">
              <div onclick="showNode('${w.title.replace(/'/g, "\\'")}', '${(w.description || '').replace(/'/g, "\\'")}')" class="relative group cursor-pointer z-20">
                  ${isActive ? '<div class="absolute -inset-10 bg-violet-500 rounded-full blur-3xl opacity-30 node-pulse"></div>' : ''}
                  ${isCompleted ? '<div class="absolute -inset-6 bg-emerald-400 rounded-full blur-xl opacity-20"></div>' : ''}
                  
                  <div class="relative w-40 h-40 rounded-[2.5rem] ${isCompleted ? 'bg-gradient-to-br from-emerald-400 to-teal-500 border-4 border-white text-white shadow-[0_0_40px_rgba(52,211,153,0.4)]' : isActive ? 'bg-gradient-to-br from-violet-600 to-indigo-600 border-4 border-white text-white shadow-[0_0_50px_rgba(124,58,237,0.5)]' : 'bg-white border-4 border-slate-100 text-slate-300 shadow-xl'} flex flex-col items-center justify-center transition-all duration-500 group-hover:scale-110 active:scale-95 group-hover:rotate-3">
                      <span class="material-symbols-outlined text-5xl mb-1">${isCompleted ? 'verified' : isActive ? 'rocket_launch' : 'lock'}</span>
                      <p class="text-[10px] font-black uppercase tracking-widest mt-1">${w.status}</p>
                      
                      <!-- Tooltip -->
                      <div class="absolute ${i % 2 === 0 ? 'left-full ml-8' : 'right-full mr-8'} top-1/2 -translate-y-1/2 w-64 opacity-0 group-hover:opacity-100 translate-y-4 group-hover:-translate-y-1/2 transition-all duration-300 pointer-events-none">
                          <div class="bg-slate-900 text-white p-5 rounded-2xl shadow-2xl relative border border-slate-700">
                              <div class="absolute top-1/2 -translate-y-1/2 ${i % 2 === 0 ? '-left-2 border-r-slate-900 border-l-transparent border-t-transparent border-b-transparent' : '-right-2 border-l-slate-900 border-r-transparent border-t-transparent border-b-transparent'} border-8 border-solid w-0 h-0"></div>
                              <p class="text-[10px] text-violet-400 font-bold uppercase tracking-widest mb-1">Week ${w.week_number}</p>
                              <p class="text-sm font-black tracking-tight leading-tight">${w.title}</p>
                          </div>
                      </div>
                  </div>
              </div>
          </div>
          `;
      });
  } else {
      roadHtml += '<div class="z-10 bg-white p-12 rounded-[2rem] border border-slate-200 shadow-xl text-center"><span class="material-symbols-outlined text-4xl text-slate-400 mb-4">route</span><p class="text-slate-500 font-bold">Roadmap not defined yet.</p></div>';
  }

  roadHtml += '</div></div>';
  document.getElementById('tab-roadmap').innerHTML = roadHtml;

  // MODAL LOGIC FOR ASSESSMENT
  window.startAssessment = async function(assessmentId, isAttempted) {
      if(isAttempted) {
          alert('You have already submitted this assessment.');
          return;
      }
      const { data: assessment } = await window.db.from('assessments').select('*').eq('id', assessmentId).single();
      const { data: questions } = await window.db.from('assessment_questions').select('*').eq('assessment_id', assessmentId).order('order_index');
      
      if(!questions || questions.length === 0) {
          alert('No questions found for this assessment.');
          return;
      }
      
      // COVER PAGE (Instruction Screen)
      const coverHtml = `
      <div id="assessment-container" class="fixed inset-0 z-50 bg-white overflow-y-auto flex flex-col">
          <div class="max-w-4xl mx-auto w-full flex-1 flex flex-col p-8 md:p-20">
              <div class="flex-1 flex flex-col justify-center text-center">
                  <div class="w-20 h-20 bg-violet-100 text-violet-600 rounded-3xl flex items-center justify-center mx-auto mb-8 shadow-xl shadow-violet-100">
                      <span class="material-symbols-outlined text-4xl">quiz</span>
                  </div>
                  <h2 class="text-4xl md:text-5xl font-black text-slate-800 tracking-tight mb-6">${assessment.title}</h2>
                  <p class="text-lg text-slate-500 mb-12 max-w-2xl mx-auto leading-relaxed">${assessment.description || 'This assessment consists of multiple-choice questions designed to test your understanding of the module. Please read each question carefully before selecting an answer.'}</p>
                  
                  <div class="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
                      <div class="p-6 bg-slate-50 rounded-3xl border border-slate-100">
                          <p class="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">Questions</p>
                          <p class="text-2xl font-black text-slate-800">${questions.length}</p>
                      </div>
                      <div class="p-6 bg-slate-50 rounded-3xl border border-slate-100">
                          <p class="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">Total Marks</p>
                          <p class="text-2xl font-black text-slate-800">${questions.length * 10}</p>
                      </div>
                      <div class="p-6 bg-slate-50 rounded-3xl border border-slate-100">
                          <p class="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">Type</p>
                          <p class="text-2xl font-black text-slate-800">MCQ</p>
                      </div>
                  </div>

                  <button onclick="renderQuestions('${assessmentId}')" class="bg-violet-600 hover:bg-violet-700 text-white font-bold py-5 px-12 rounded-full text-lg shadow-2xl shadow-violet-500/40 transition-all hover:-translate-y-1 active:translate-y-0 w-full md:w-auto mx-auto">Start Assessment Now</button>
                  <p class="text-xs text-slate-400 mt-8">By starting, you agree to follow the assessment rules.</p>
              </div>
          </div>
          <button onclick="document.getElementById('assessment-container').remove()" class="absolute top-8 right-8 text-slate-400 hover:text-slate-800"><span class="material-symbols-outlined">close</span></button>
      </div>`;
      
      document.body.insertAdjacentHTML('beforeend', coverHtml);
      
      // Internal function to render actual questions
      window.renderQuestions = (id) => {
          const container = document.getElementById('assessment-container');
          let qHtml = `
          <div class="bg-slate-900 text-white p-6 flex justify-between items-center sticky top-0 z-10">
              <h2 class="text-xl font-bold">${assessment.title}</h2>
              <div class="text-sm font-bold text-slate-400">Question <span id="current-q">1</span> of ${questions.length}</div>
          </div>
          <div class="flex-1 max-w-3xl mx-auto w-full p-8 py-12 space-y-12 pb-32">
          `;
          
          questions.forEach((q, idx) => {
              qHtml += `
              <div class="bg-white p-8 rounded-3xl border border-slate-100 shadow-sm question-block" data-qid="${q.id}">
                  <h3 class="text-xl font-bold text-slate-800 mb-8 leading-tight"><span class="text-violet-500 mr-2">0${idx+1}.</span> ${q.question_text}</h3>
                  <div class="space-y-3 options-group" data-qid="${q.id}">`;
              if(q.options && Array.isArray(q.options)) {
                  q.options.forEach((opt, oIdx) => {
                      qHtml += `
                      <label class="flex items-center p-5 bg-slate-50 border-2 border-transparent rounded-2xl cursor-pointer hover:bg-violet-50 hover:border-violet-200 transition-all group">
                          <input type="radio" name="q_${q.id}" value="${opt}" class="w-5 h-5 text-violet-600 border-slate-300 focus:ring-violet-500">
                          <span class="ml-4 text-slate-600 font-semibold group-hover:text-violet-700">${opt}</span>
                      </label>`;
                  });
              }
              qHtml += `</div></div>`;
          });
          
          qHtml += `
          </div>
          <div class="bg-white border-t border-slate-100 p-6 flex justify-between items-center sticky bottom-0 z-10 px-8">
              <p class="text-xs text-slate-400 font-medium">Automatic saving enabled...</p>
              <button onclick="submitAssessment('${assessmentId}')" class="px-10 py-4 bg-slate-900 hover:bg-violet-600 text-white font-bold rounded-2xl shadow-xl transition-all text-sm uppercase tracking-widest">Submit Final Assessment</button>
          </div>`;
          
          container.innerHTML = qHtml;
          window.ASSESSMENT_QUESTIONS = questions;
      };
  };

  window.submitAssessment = async function(assessmentId) {
      const questions = window.ASSESSMENT_QUESTIONS;
      let score = 0;
      const answers = {};
      
      questions.forEach(q => {
          const selected = document.querySelector(`input[name="q_${q.id}"]:checked`);
          if(selected) {
              answers[q.id] = selected.value;
              if(selected.value === q.correct_option) score++;
          }
      });
      
      const finalScore = Math.round((score / questions.length) * 100);
      
      // Save result
      const { error } = await window.db.from('assessment_submissions').insert({
          assessment_id: assessmentId,
          student_id: S.id,
          score: finalScore,
          answers: answers
      });

      if(error) {
          alert('Submission error: ' + error.message);
          return;
      }

      // Show Result Screen
      const quotes = [
          { q: "Success is not final, failure is not fatal: it is the courage to continue that counts.", a: "Winston Churchill" },
          { q: "Believe you can and you're halfway there.", a: "Theodore Roosevelt" },
          { q: "Your limitation—it's only your imagination.", a: "Unknown" },
          { q: "Push yourself, because no one else is going to do it for you.", a: "Unknown" },
          { q: "Great things never come from comfort zones.", a: "Unknown" }
      ];
      const quote = quotes[Math.floor(Math.random() * quotes.length)];
      
      const resultHtml = `
      <div class="flex-1 flex flex-col items-center justify-center p-8 text-center bg-white">
          <div class="w-24 h-24 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mb-8 animate-bounce">
              <span class="material-symbols-outlined text-4xl">check_circle</span>
          </div>
          <h2 class="text-3xl font-black text-slate-800 mb-2">Assessment Completed!</h2>
          <p class="text-slate-500 mb-8">You have successfully submitted your answers.</p>
          
          <div class="mb-12">
              <p class="text-7xl font-black text-slate-900">${finalScore}<span class="text-3xl text-slate-400">%</span></p>
              <p class="text-xs font-bold text-slate-400 uppercase tracking-widest mt-2">Overall Proficiency</p>
          </div>

          <div class="max-w-md bg-slate-50 p-8 rounded-3xl border border-slate-100 mb-12 italic">
              <p class="text-slate-700 text-lg">"${quote.q}"</p>
              <p class="text-violet-600 font-bold not-italic mt-4 text-sm">— ${quote.a}</p>
          </div>

          <button onclick="window.location.reload()" class="bg-slate-900 text-white px-12 py-4 rounded-2xl font-bold hover:bg-violet-600 transition-all">Back to Course</button>
      </div>`;
      
      document.getElementById('assessment-container').innerHTML = resultHtml;
  };

})();
