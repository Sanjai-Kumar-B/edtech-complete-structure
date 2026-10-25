(async function() {
  const { data: { user } } = await window.db.auth.getUser()
  if (!user) { window.location.href = 'index.html'; return; }
  
  // FETCH STUDENT PROFILE
  const { data: S } = await window.db.from('users').select('*').eq('id', user.id).single()
  window.STUDENT = S
  
  // HERO CARD - Dynamic Greetings & Motivation
  const greetings = ["Designing the Future", "Architecture of Logic", "Mastering the Craft", "Digital Engineering", "Synthesizing Knowledge", "Building the Vision"];
  const messages = [
    { headline: "Designing the Future of AI.", sub: "Keep pushing. Every session counts." },
    { headline: "Every Line of Code Matters.", sub: "You're building something real. Don't stop." },
    { headline: "Build. Break. Learn. Repeat.", sub: "The best builders are relentless learners." },
    { headline: "The Future Belongs to Builders.", sub: "Show up. Ship. Repeat." },
    { headline: "Precision in Every Pixel.", sub: "Your attention to detail is what sets you apart." },
    { headline: "Coding is Modern Magic.", sub: "Transform your thoughts into reality, one function at a time." },
    { headline: "Stay Hungry. Stay Foolish.", sub: "Keep exploring the boundaries of what you can build." }
  ];
  
  let msgIndex = parseInt(localStorage.getItem('msg_index') || '0');
  const storedDate = localStorage.getItem('msg_date');
  const today = new Date().toDateString();
  if (storedDate !== today) {
    msgIndex = Math.floor(Math.random() * messages.length);
    localStorage.setItem('msg_index', msgIndex);
    localStorage.setItem('msg_date', today);
  }
  const msg = messages[msgIndex];
  const greeting = greetings[Math.floor(Math.random() * greetings.length)];
  
  const heroHtml = `
            <div class="absolute top-0 right-0 w-64 h-64 bg-violet-50 rounded-full -mr-20 -mt-20 blur-3xl transition-all group-hover:bg-violet-100"></div>
            <div class="relative z-10 w-full flex flex-col md:flex-row md:items-center justify-between gap-6">
                <div>
                    <span class="bg-violet-100 text-violet-600 text-[10px] font-bold px-4 py-1.5 rounded-full tracking-widest uppercase">Welcome back, ${S.full_name.split(' ')[0]}</span>
                    <h2 class="text-4xl font-extrabold text-slate-800 mt-5 tracking-tight">${msg.headline}</h2>
                    <p class="text-slate-500 mt-4 max-w-sm text-sm leading-relaxed">${msg.sub}</p>
                </div>
                <div class="flex-shrink-0 relative">
                    <div class="w-24 h-24 rounded-full border-4 border-violet-50 flex items-center justify-center text-4xl font-black text-white shadow-xl shadow-violet-200 overflow-hidden" style="background-color: ${S.avatar_color || '#7c3aed'}">
                        ${S.avatar_url ? `<img src="${S.avatar_url}" class="w-full h-full object-cover" />` : (S.avatar_initials || S.full_name.charAt(0))}
                    </div>
                    <div class="absolute bottom-0 right-0 w-8 h-8 bg-violet-500 rounded-full border-4 border-white flex items-center justify-center">
                        <span class="material-symbols-outlined text-white text-sm" data-icon="star">star</span>
                    </div>
                </div>
            </div>`;
  const heroEl = document.getElementById('dashboard-hero');
  if(heroEl) heroEl.innerHTML = heroHtml;

  // FETCH ENROLLMENTS
  const { data: enrollments } = await window.db.from('enrollments').select('*, batches(*, users!batches_instructor_id_fkey(*))').eq('student_id', S.id).eq('status', 'active');
  const batchIds = (enrollments || []).map(e => e.batch_id);

  // MENTOR STATUS
  if (enrollments?.[0]?.batches?.users) {
     const mentor = enrollments[0].batches.users;
     const mentorEl = document.getElementById('mentor-status');
     if (mentorEl) {
        mentorEl.classList.remove('hidden');
        mentorEl.querySelector('.font-black').innerText = mentor.full_name.charAt(0);
        mentorEl.querySelector('.text-slate-800').innerText = mentor.full_name;
     }
  }

  // ATTENDANCE & PROGRESS CARDS
  if (batchIds.length > 0) {
    // Attendance
    const { data: sessions } = await window.db.from('sessions').select('id').in('batch_id', batchIds);
    const sessionIds = (sessions || []).map(s => s.id);
    let attPct = 0;
    if (sessionIds.length > 0) {
      const { data: att } = await window.db.from('attendance').select('status').eq('student_id', S.id).in('session_id', sessionIds);
      const total = (att || []).length;
      const present = (att || []).filter(a => a.status === 'present').length;
      attPct = total > 0 ? Math.round(present * 100 / total) : 0;
    }
    const attEl = document.getElementById('dashboard-attendance');
    if(attEl) {
      const isLow = attPct < 75;
      const attBorder = isLow ? 'border-red-300' : 'border-emerald-200';
      const attShadow = isLow ? 'shadow-red-50' : 'shadow-emerald-50';
      const attIconColor = isLow ? 'text-red-500 bg-red-50' : 'text-emerald-500 bg-emerald-50';
      const attTagColor = isLow ? 'text-red-600 bg-red-50' : 'text-emerald-600 bg-emerald-50';
      const attTagText = isLow ? 'Requires Attention' : 'On Track';
      
      attEl.innerHTML = `
                <div class="flex items-center justify-between">
                    <span class="material-symbols-outlined p-2 rounded-full ${attIconColor}" data-icon="how_to_reg">how_to_reg</span>
                    <span class="text-[10px] font-bold px-2 py-1 rounded-full ${attTagColor}">${attTagText}</span>
                </div>
                <div class="mt-4">
                    <p class="text-3xl font-bold text-slate-800 tracking-tighter">${attPct}%</p>
                    <p class="text-xs text-slate-500 font-bold uppercase tracking-wider mt-1">Attendance</p>
                </div>
      `;
      attEl.className = `bg-white p-6 rounded-[2rem] flex flex-col justify-between border-4 ${attBorder} shadow-sm ${attShadow}`;
    }

    // Progress
    const { data: assignments } = await window.db.from('assignments').select('id').in('batch_id', batchIds).eq('is_published', true);
    const assignIds = (assignments || []).map(a => a.id);
    let progPct = 0;
    if (assignIds.length > 0) {
      const { data: subs } = await window.db.from('assignment_submissions').select('id').eq('student_id', S.id).in('assignment_id', assignIds);
      progPct = Math.round((subs || []).length * 100 / assignIds.length);
    }
    const progEl = document.getElementById('dashboard-progress');
    if(progEl) {
      progEl.innerHTML = `
                <div class="flex items-center justify-between">
                    <span class="material-symbols-outlined text-emerald-500 p-2 bg-emerald-50 rounded-full" data-icon="trending_up">trending_up</span>
                    <span class="text-[10px] text-emerald-600 font-bold bg-emerald-50 px-2 py-1 rounded-full">+4%</span>
                </div>
                <div class="mt-4">
                    <p class="text-3xl font-bold text-slate-800 tracking-tighter">${progPct}%</p>
                    <p class="text-xs text-slate-500 font-bold uppercase tracking-wider mt-1">Course Progress</p>
                </div>
      `;
      progEl.className = `bg-white p-6 rounded-[2rem] flex flex-col justify-between border-4 border-emerald-200 shadow-sm shadow-emerald-50`;
    }
  }

  // SKILL ANALYTICS (Live overrides from Instructor)
  const { data: skills } = await window.db.from('student_skills').select('*').eq('student_id', S.id).maybeSingle();
  if (skills) {
    const renderSkill = (name, val, color) => {
      return `
                    <div class="space-y-2">
                        <div class="flex justify-between items-center text-xs">
                            <span class="text-slate-500 font-light flex items-center gap-2"><span class="w-1.5 h-1.5 rounded-full bg-${color}-500"></span> ${name}</span>
                            <span class="text-slate-700 font-bold">${val}%</span>
                        </div>
                        <div class="h-1 w-full bg-slate-100 rounded-full overflow-hidden">
                            <div class="h-full bg-${color}-500 rounded-full" style="width: ${val}%"></div>
                        </div>
                    </div>`;
    };
    const skillsEl = document.getElementById('dashboard-skills');
    if(skillsEl) {
      skillsEl.innerHTML = `
        ${renderSkill('Consistency', skills.consistency, 'violet')}
        ${renderSkill('Technical', skills.technical, 'indigo')}
        ${renderSkill('Conceptual', skills.conceptual, 'emerald')}
        ${renderSkill('Participation', skills.participation, 'amber')}
      `;
    }
  }

  // TODAY & PREVIOUS (Activity Log Style)
  const todayIso = new Date().toISOString().split('T')[0];
  if(batchIds.length > 0) {
      // Today
      const { data: todaySessions } = await window.db.from('sessions').select('*, batches(batch_code, courses(code))').in('batch_id', batchIds).eq('session_date', todayIso);
      const todayEl = document.getElementById('dashboard-today');
      if (todayEl) {
        if (todaySessions?.length > 0) {
          const s = todaySessions[0];
          todayEl.innerHTML = `
                    <div class="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-violet-400 to-pink-400"></div>
                    <div class="flex justify-between items-start mb-6">
                        <h3 class="text-2xl font-black text-slate-800 tracking-tight">Today</h3>
                        <span class="bg-violet-100 text-violet-600 text-[10px] font-bold px-3 py-1 rounded-full flex items-center gap-1"><span class="w-1.5 h-1.5 rounded-full bg-violet-500 animate-pulse"></span> ACTIVE</span>
                    </div>
                    <div>
                        <p class="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Current Module</p>
                        <h4 class="text-xl font-bold text-slate-700 mt-2">${s.title}</h4>
                        <p class="text-sm text-slate-500 mt-3 line-clamp-2">${s.description || 'Synchronous instructional session.'}</p>
                    </div>
                    <button onclick="window.open('${s.zoom_link}', '_blank')" class="mt-8 w-full bg-violet-500 hover:bg-violet-600 text-white py-3 rounded-full text-sm font-bold transition-all shadow-lg shadow-violet-500/20 active:scale-95">Enter Class</button>
          `;
        } else {
          todayEl.innerHTML = `
                    <div class="flex justify-between items-start mb-6">
                        <h3 class="text-2xl font-black text-slate-800 tracking-tight">Today</h3>
                    </div>
                    <div class="py-6 flex flex-col items-center text-center">
                        <span class="material-symbols-outlined text-slate-200 text-5xl mb-4">nightlight</span>
                        <h4 class="text-lg font-black text-slate-400 uppercase tracking-widest">No Active Modules</h4>
                        <p class="text-xs text-slate-400 mt-2 font-medium">Perfect cycle for deep work & focus.</p>
                    </div>
          `;
        }
      }

      // Previous
      const { data: prevSessions } = await window.db.from('sessions').select('*').in('batch_id', batchIds).lt('session_date', todayIso).order('session_date', { ascending: false }).limit(1);
      const prevEl = document.getElementById('dashboard-previous');
      if (prevEl) {
        if (prevSessions?.length > 0) {
          const ps = prevSessions[0];
          prevEl.innerHTML = `
                    <div class="flex justify-between items-start mb-6">
                        <h3 class="text-2xl font-black text-slate-400 tracking-tight">Previous</h3>
                        <span class="bg-slate-100 text-slate-500 text-[10px] font-bold px-3 py-1 rounded-full"><span class="material-symbols-outlined text-[10px]" data-icon="check">check</span> COMPLETED</span>
                    </div>
                    <div>
                        <p class="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Past Module</p>
                        <h4 class="text-xl font-bold text-slate-600 mt-2">${ps.title}</h4>
                        <p class="text-sm text-slate-400 mt-3 line-clamp-2">${ps.description || 'Review the recorded session.'}</p>
                    </div>
                    <button onclick="window.location.href='courses.html'" class="mt-8 w-full border-2 border-slate-200 text-slate-500 hover:border-slate-300 hover:text-slate-600 py-3 rounded-full text-sm font-bold transition-all active:scale-95">Review Materials</button>
          `;
        }
      }
  }

  // PENDING ACTIONS (Priority Matrix)
  if(batchIds.length > 0) {
      const [pendAss, myAssSubs, pendTest, myTestSubs] = await Promise.all([
        window.db.from('assignments').select('id, title, due_date').in('batch_id', batchIds).eq('is_published', true),
        window.db.from('assignment_submissions').select('assignment_id').eq('student_id', S.id),
        window.db.from('assessments').select('id, title, due_date').in('batch_id', batchIds).eq('is_published', true),
        window.db.from('assessment_submissions').select('assessment_id').eq('student_id', S.id)
      ]);

      const subAssIds = (myAssSubs.data || []).map(s => s.assignment_id);
      const unsubmitted = (pendAss.data || []).filter(a => !subAssIds.includes(a.id)).map(a => ({...a, type: 'ASSIGNMENT', link: 'assignments.html'}));
      
      const subTestIds = (myTestSubs.data || []).map(s => s.assessment_id);
      const unattempted = (pendTest.data || []).filter(a => !subTestIds.includes(a.id)).map(a => ({...a, type: 'ASSESSMENT', link: 'course-detail.html'}));

      const allPending = [...unsubmitted, ...unattempted].sort((a,b) => new Date(a.due_date) - new Date(b.due_date));
      const pendingEl = document.getElementById('dashboard-pending');
      if (pendingEl) {
        if (allPending.length === 0) {
          pendingEl.innerHTML = '<div class="col-span-full py-12 flex flex-col items-center justify-center bg-emerald-50/50 rounded-[2.5rem] border border-emerald-100 text-emerald-600 font-black uppercase text-[10px] tracking-[0.3em]"><span class="material-symbols-outlined text-3xl mb-3">verified</span> Clearance Confirmed</div>';
        } else {
          pendingEl.innerHTML = allPending.slice(0, 4).map(item => {
            const isOverdue = new Date(item.due_date) < new Date();
            const color = isOverdue ? 'rose' : 'amber';
            return `
            <div onclick="window.location.href='${item.link}'" class="flex items-center gap-4 p-6 bg-white border border-slate-100 rounded-[2rem] hover:shadow-2xl hover:scale-[1.03] transition-all cursor-pointer group">
                <div class="w-12 h-12 rounded-2xl bg-${color}-50 text-${color}-500 flex items-center justify-center shrink-0 shadow-sm group-hover:bg-${color}-500 group-hover:text-white transition-all">
                   <span class="material-symbols-outlined">${item.type === 'ASSIGNMENT' ? 'description' : 'quiz'}</span>
                </div>
                <div class="flex-1 min-w-0">
                    <span class="text-[9px] font-black text-slate-400 uppercase tracking-widest">${item.type}</span>
                    <p class="text-sm font-black text-slate-800 truncate group-hover:text-violet-600 transition-colors">${item.title}</p>
                    <div class="flex items-center gap-2 mt-1">
                       <span class="w-1 h-1 rounded-full bg-${color}-500"></span>
                       <p class="text-[10px] font-bold text-${color}-600 uppercase tracking-tighter">${isOverdue ? 'Overdue Deadline' : 'Deadline ' + new Date(item.due_date).toLocaleDateString()}</p>
                    </div>
                </div>
                <span class="material-symbols-outlined text-slate-300 group-hover:text-violet-500 group-hover:translate-x-1 transition-all">arrow_forward</span>
            </div>`;
          }).join('');
        }
      }
  }

  // WEEKLY CALENDAR (Live Matrix)
  const mon = (() => {
    let d = new Date();
    let day = d.getDay();
    let diff = d.getDate() - day + (day === 0 ? -6 : 1);
    return new Date(d.setDate(diff));
  })();
  const sun = new Date(mon); sun.setDate(sun.getDate() + 6);
  
  if(batchIds.length > 0) {
      const { data: weekSessions } = await window.db.from('sessions').select('*').in('batch_id', batchIds).gte('session_date', mon.toISOString().split('T')[0]).lte('session_date', sun.toISOString().split('T')[0]);
      const calEl = document.getElementById('dashboard-calendar');
      if (calEl) {
        const days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
        const times = ['09:00', '11:00', '14:00'];
        let calHtml = '';
        times.forEach(time => {
          calHtml += `<div class="grid grid-cols-[80px_repeat(7,1fr)] gap-4 items-center py-2 border-b border-slate-50 last:border-0"><div class="text-[10px] font-black text-slate-300 uppercase tracking-widest pl-2">${time}</div>`;
          days.forEach((day, i) => {
            const d = new Date(mon); d.setDate(d.getDate() + i);
            const ds = d.toISOString().split('T')[0];
            const s = (weekSessions || []).find(x => x.session_date === ds && x.session_time.startsWith(time));
            if (s) {
              calHtml += `
              <div class="relative group h-12">
                  <div onclick="showTask('${s.type || 'SESSION'}', '${s.title.replace(/'/g, "\\'")}', '${(s.description || '').replace(/'/g, "\\'")}')" 
                       class="h-full cursor-pointer flex flex-col justify-center px-3 bg-violet-50 text-violet-700 text-[10px] font-black rounded-2xl border-l-4 border-violet-400 group-hover:shadow-xl group-hover:-translate-y-1 transition-all">
                       <span class="truncate">${s.title}</span>
                       <span class="text-[8px] text-violet-400 font-bold uppercase tracking-widest mt-0.5">${s.type || 'CLASS'}</span>
                  </div>
              </div>`;
            } else {
              calHtml += `<div class="h-12 bg-slate-50/30 rounded-2xl border border-dashed border-slate-100"></div>`;
            }
          });
          calHtml += `</div>`;
        });
        calEl.innerHTML = calHtml;
      }
  }

})();
