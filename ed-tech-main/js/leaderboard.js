(async function() {
  const { data: { user } } = await window.db.auth.getUser()
  if (!user) { window.location.href = 'index.html'; return; }
  const { data: studentProfile } = await window.db.from('users').select('*').eq('id', user.id).single()
  window.STUDENT = studentProfile;
  
  let currentCourse = 'all';
  let currentDuration = 'overall';

  // 1. Fetch Courses for Filter
  const { data: enrollments } = await window.db.from('enrollments').select('batches(id, courses(id, title))').eq('student_id', user.id);
  const courseFilter = document.getElementById('course-filter');
  const uniqueCourses = {};
  (enrollments || []).forEach(e => {
      if(e.batches?.courses) uniqueCourses[e.batches.courses.id] = e.batches.courses.title;
  });
  Object.entries(uniqueCourses).forEach(([id, title]) => {
      const opt = document.createElement('option');
      opt.value = id;
      opt.textContent = title;
      courseFilter.appendChild(opt);
  });

  courseFilter.addEventListener('change', (e) => {
      currentCourse = e.target.value;
      loadLeaderboard();
  });

  window.filterDuration = (type, btn) => {
      currentDuration = type;
      document.querySelectorAll('.duration-tab').forEach(t => {
          t.classList.remove('bg-white', 'shadow-sm', 'text-violet-600');
          t.classList.add('text-slate-500');
      });
      btn.classList.add('bg-white', 'shadow-sm', 'text-violet-600');
      btn.classList.remove('text-slate-500');
      loadLeaderboard();
  };

  async function loadLeaderboard() {
      // For real-time "algorithm", we fetch submissions and calculate
      // BUT for performance, we usually use a view. Let's try to fetch dynamic data.
      
      let query = window.db.from('users').select('id, full_name, avatar_initials, avatar_color, role').eq('role', 'student');
      const { data: students } = await query;

      // Fetch all submissions to calculate scores
      const { data: assignSubs } = await window.db.from('assignment_submissions').select('*');
      const { data: assessSubs } = await window.db.from('assessment_submissions').select('*');

      // Weekly Filter Logic
      const oneWeekAgo = new Date();
      oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);
      
      const leaderboard = students.map(s => {
          let aSubs = (assignSubs || []).filter(sub => sub.student_id === s.id);
          let eSubs = (assessSubs || []).filter(sub => sub.student_id === s.id);

          if(currentDuration === 'weekly') {
              aSubs = aSubs.filter(sub => new Date(sub.created_at) > oneWeekAgo);
              eSubs = eSubs.filter(sub => new Date(sub.created_at) > oneWeekAgo);
          }

          // Simple Algorithm: (Avg Assignment % * 0.4) + (Avg Assessment % * 0.6)
          const avgA = aSubs.length > 0 ? aSubs.reduce((acc, curr) => acc + (curr.score || 0), 0) / aSubs.length : 0;
          const avgE = eSubs.length > 0 ? eSubs.reduce((acc, curr) => acc + (curr.score || 0), 0) / eSubs.length : 0;
          
          // Boost score based on volume if in weekly
          const volumeBonus = currentDuration === 'weekly' ? (aSubs.length + eSubs.length) * 5 : 0;
          
          let total = Math.round((avgA * 0.4) + (avgE * 0.6) + volumeBonus);
          if (total > 1000 && currentDuration === 'overall') total = 1000; // Cap overall for demo

          return {
              id: s.id,
              full_name: s.full_name,
              initials: s.avatar_initials || s.full_name.split(' ').map(n => n[0]).join(''),
              color: s.avatar_color || '#8b5cf6',
              score: total,
              avgA: Math.round(avgA),
              avgE: Math.round(avgE),
              tasks: aSubs.length + eSubs.length
          };
      });

      // Sort by score
      leaderboard.sort((a, b) => b.score - a.score);

      renderLeaderboard(leaderboard);
  }

  function renderLeaderboard(data) {
      const podiumEl = document.getElementById('leaderboard-podium');
      const listEl = document.getElementById('leaderboard-list');
      const meEl = document.getElementById('leaderboard-me');
      const tableEl = document.getElementById('leaderboard-table');

      // Top 3
      const top3 = data.slice(0, 3);
      const p2 = top3[1];
      const p1 = top3[0];
      const p3 = top3[2];

      podiumEl.innerHTML = `
        <!-- 2nd Place -->
        <div class="col-span-12 md:col-span-4 h-full flex items-end order-2 md:order-1 pt-16">
            <div class="w-full">${p2 ? renderPodiumCard(p2, 2, 'from-slate-300 to-slate-400', 'border-slate-200') : ''}</div>
        </div>
        <!-- 1st Place -->
        <div class="col-span-12 md:col-span-4 h-full flex items-end order-1 md:order-2 z-10 pb-4">
            <div class="w-full">${p1 ? renderPodiumCard(p1, 1, 'from-amber-300 to-amber-500', 'border-amber-200 shadow-amber-200/50') : ''}</div>
        </div>
        <!-- 3rd Place -->
        <div class="col-span-12 md:col-span-4 h-full flex items-end order-3 md:order-3 pt-24">
            <div class="w-full">${p3 ? renderPodiumCard(p3, 3, 'from-orange-300 to-orange-500', 'border-orange-200') : ''}</div>
        </div>
      `;

      // List
      listEl.innerHTML = data.slice(3).map((s, idx) => `
        <div class="grid grid-cols-12 items-center px-8 py-5 bg-white/70 backdrop-blur-md rounded-3xl border border-slate-100 shadow-sm hover:shadow-xl hover:shadow-violet-200/40 hover:-translate-y-1 transition-all duration-300 group ${s.id === window.STUDENT.id ? 'border-violet-300 ring-2 ring-violet-200 bg-violet-50/50' : ''}">
            <div class="col-span-2 md:col-span-1">
                <span class="text-xl font-black text-slate-300 group-hover:text-violet-500 transition-colors">#${(idx + 4).toString().padStart(2, '0')}</span>
            </div>
            <div class="col-span-7 md:col-span-6 flex items-center gap-5">
                <div class="w-14 h-14 rounded-2xl flex items-center justify-center text-white font-black text-lg shadow-md group-hover:scale-110 transition-transform" style="background: ${s.color}">${s.initials}</div>
                <div>
                    <p class="font-bold text-slate-800 text-lg">${s.full_name} ${s.id === window.STUDENT.id ? '<span class="ml-2 text-[10px] bg-gradient-to-r from-violet-600 to-indigo-600 text-white px-3 py-1 rounded-full uppercase shadow-md">You</span>' : ''}</p>
                    <p class="text-[10px] text-slate-400 font-bold uppercase tracking-widest mt-1 group-hover:text-violet-400 transition-colors">Level ${Math.floor(s.score/10) || 1} Innovator</p>
                </div>
            </div>
            <div class="col-span-3 md:col-span-5 text-right flex items-center justify-end gap-8">
                <div class="hidden md:block w-40 h-2 bg-slate-100 rounded-full overflow-hidden shadow-inner">
                    <div class="h-full bg-gradient-to-r from-violet-500 to-indigo-500 rounded-full group-hover:animate-pulse" style="width: ${Math.min(s.score, 100)}%"></div>
                </div>
                <p class="text-3xl font-black text-slate-800 tracking-tighter group-hover:text-violet-600 transition-colors">${s.score}</p>
            </div>
        </div>
      `).join('');

      // Table View
      if(tableEl) {
          tableEl.innerHTML = `
            <thead>
                <tr class="bg-slate-50/50 text-[10px] font-black uppercase tracking-widest text-slate-400">
                    <th class="px-8 py-5 border-b border-slate-100">Rank</th>
                    <th class="px-8 py-5 border-b border-slate-100">Student Athlete</th>
                    <th class="px-8 py-5 border-b border-slate-100">Tasks Completed</th>
                    <th class="px-8 py-5 border-b border-slate-100">Avg Assignment</th>
                    <th class="px-8 py-5 border-b border-slate-100">Avg Assessment</th>
                    <th class="px-8 py-5 border-b border-slate-100 text-right">Total Score</th>
                </tr>
            </thead>
            <tbody>
                ${data.map((s, idx) => `
                <tr class="hover:bg-violet-50/30 transition-colors border-b border-slate-50 last:border-0 ${s.id === window.STUDENT.id ? 'bg-violet-50/50' : ''}">
                    <td class="px-8 py-6 text-sm font-black text-slate-400">#${idx + 1}</td>
                    <td class="px-8 py-6">
                        <div class="flex items-center gap-4">
                            <div class="w-10 h-10 rounded-xl flex items-center justify-center text-white font-bold text-sm shadow-sm" style="background: ${s.color}">${s.initials}</div>
                            <span class="font-bold text-slate-800">${s.full_name} ${s.id === window.STUDENT.id ? '<span class="ml-2 text-[9px] bg-gradient-to-r from-violet-600 to-indigo-600 text-white px-2 py-0.5 rounded-full uppercase shadow-sm">You</span>' : ''}</span>
                        </div>
                    </td>
                    <td class="px-8 py-6">
                        <span class="px-3 py-1 bg-slate-100 text-slate-600 rounded-lg text-xs font-bold">${s.tasks}</span>
                    </td>
                    <td class="px-8 py-6 text-sm font-bold text-slate-600">${s.avgA}%</td>
                    <td class="px-8 py-6 text-sm font-bold text-slate-600">${s.avgE}%</td>
                    <td class="px-8 py-6 text-lg font-black text-violet-600 text-right">${s.score}</td>
                </tr>
                `).join('')}
            </tbody>
          `;
      }

      // Me
      const myData = data.find(s => s.id === window.STUDENT.id);
      const myRank = data.findIndex(s => s.id === window.STUDENT.id) + 1;
      if(myData && meEl) {
          meEl.className = "fixed bottom-8 left-[18rem] right-8 bg-slate-900/90 backdrop-blur-2xl text-white p-6 rounded-[2.5rem] border border-white/10 shadow-[0_20px_60px_rgba(15,23,42,0.6)] flex items-center justify-between z-50 transform translate-y-0 transition-transform duration-500 in-frame-me overflow-hidden";
          meEl.innerHTML = `
            <div class="absolute inset-0 bg-gradient-to-r from-violet-600/20 to-indigo-600/20 opacity-50 blur-xl pointer-events-none"></div>
            <div class="relative z-10 flex items-center gap-6">
                <div class="w-16 h-16 bg-gradient-to-br from-violet-500 to-indigo-600 rounded-[1.5rem] flex flex-col items-center justify-center border border-white/20 shadow-xl shadow-violet-500/30">
                    <p class="text-[9px] font-black text-violet-200 uppercase leading-none mb-1 tracking-widest">Rank</p>
                    <p class="text-2xl font-black text-white leading-none">#${myRank}</p>
                </div>
                <div>
                    <p class="text-2xl font-black text-white leading-tight tracking-tight">${myData.full_name}</p>
                    <p class="text-[10px] text-violet-300 font-bold uppercase tracking-widest mt-1 bg-white/10 inline-block px-3 py-1 rounded-full border border-white/5 backdrop-blur-md">Keep pushing to reach the top 3!</p>
                </div>
            </div>
            <div class="relative z-10 flex items-center gap-8">
                <div class="text-right">
                    <p class="text-5xl font-black text-transparent bg-clip-text bg-gradient-to-r from-violet-400 to-indigo-300 tracking-tighter drop-shadow-sm">${myData.score}</p>
                    <p class="text-[10px] font-black text-slate-400 uppercase tracking-widest mt-1">Total Performance Points</p>
                </div>
                <button class="w-14 h-14 bg-white text-slate-900 rounded-full flex items-center justify-center hover:scale-110 active:scale-95 transition-all shadow-xl shadow-white/10 group">
                    <span class="material-symbols-outlined font-black text-2xl group-hover:rotate-12 transition-transform">rocket_launch</span>
                </button>
            </div>
          `;
      }
  }

  function renderPodiumCard(s, rank, grad, border) {
      const isFirst = rank === 1;
      const heightClass = rank === 1 ? 'h-full scale-105 z-10' : 'h-[80%] opacity-90 hover:opacity-100';
      const glow = rank === 1 ? 'shadow-[0_0_40px_rgba(251,191,36,0.3)]' : '';
      return `
        <div class="${heightClass} bg-white/80 backdrop-blur-md rounded-[3rem] border ${border} p-8 flex flex-col items-center justify-center text-center relative group hover:-translate-y-4 transition-all duration-500 shadow-xl shadow-slate-200/50 ${glow}">
            <div class="absolute -top-16">
                <div class="relative w-32 h-32 rounded-[2rem] bg-gradient-to-br ${grad} p-1 shadow-2xl shadow-slate-200 group-hover:scale-110 transition-transform duration-500">
                    <div class="absolute inset-0 bg-gradient-to-br ${grad} rounded-[2rem] blur-xl opacity-50 group-hover:opacity-80 transition-opacity"></div>
                    <div class="w-full h-full rounded-[1.8rem] bg-white flex items-center justify-center text-4xl font-black overflow-hidden border-[6px] border-white relative z-10">
                        <div class="w-full h-full flex items-center justify-center text-white" style="background: ${s.color}">${s.initials}</div>
                    </div>
                </div>
                <div class="absolute -bottom-4 -right-4 w-12 h-12 ${isFirst ? 'bg-amber-400 shadow-amber-400/50' : 'bg-slate-800 shadow-slate-800/50'} rounded-2xl flex items-center justify-center text-white font-black border-4 border-white text-xl shadow-lg transform rotate-12 group-hover:rotate-0 transition-transform">${rank}</div>
            </div>
            
            <div class="mt-20">
                <h3 class="text-2xl md:text-3xl font-black text-slate-800 tracking-tight leading-tight mb-2">${s.full_name}</h3>
                <p class="text-[10px] font-bold text-violet-500 uppercase tracking-widest mb-6">${rank === 1 ? 'Current Champion' : 'Elite Performer'}</p>
                
                <div class="px-10 py-5 bg-gradient-to-br from-slate-50 to-slate-100 rounded-3xl border border-slate-200 group-hover:from-violet-600 group-hover:to-indigo-600 group-hover:border-transparent transition-all duration-500 shadow-inner group-hover:shadow-xl group-hover:shadow-violet-500/30">
                    <p class="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1 group-hover:text-violet-200">Innovation Score</p>
                    <p class="text-4xl font-black text-slate-800 group-hover:text-white transition-colors">${s.score}</p>
                </div>
            </div>
            
            ${isFirst ? '<div class="absolute inset-0 bg-gradient-to-t from-amber-500/5 to-transparent rounded-[3rem] pointer-events-none"></div>' : ''}
        </div>
      `;
  }

  loadLeaderboard();
})();
